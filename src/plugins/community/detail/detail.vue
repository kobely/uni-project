<template>
    <app-layout>
        <view class="status" :class="activity.condition > 0 ? 'start':'cross-center'" v-if="activity.activity_status == 1">
            <view class="main-between cross-center status-up">
                <view v-if="activity.condition == 0" style="color: #999">
                    {{activity.user_num}}人已抢{{activity.all_sales}}件
                </view>
                <view v-else class="condition">
                    <text v-if="activity.num - activity.condition_count > 0">
                        还差{{activity.num - activity.condition_count}}{{activity.condition === 1 ? '人':'件'}}
                    </text>
                    拼团成功
                </view>
                <view class="status">{{status_text}}</view>
            </view>
            <view v-if="activity.condition > 0" class="main-between cross-center status-down" >
                <view class="progress">
                    <view :style="{'width': `${activity.rate}%`,'backgroundImage':`url(${bonusImg.progress})`}"></view>
                </view>
                <view style="color: #999">
                    {{activity.condition_count ? activity.user_num : 0}}人已抢{{activity.all_sales}}件
                </view>
            </view>
        </view>
        <view class="status" v-else>
            <text v-if="activity.activity_status == 2">本次活动已结束</text>
            <text v-if="activity.activity_status == 0">距离本次活动开始还有{{d > 0? d + '天': ''}}{{h > 0? h + '时': ''}}{{m > 0? m + '分': ''}}</text>
        </view>
        <view class="goods-list">
            <view class="dir-left-nowrap item" v-for="item in list" :key="item.id">
                <view class="goods-cover">
                    <view v-if="item.goods_stock == 0" class="out-dialog">
                        <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                    </view>
                    <image :src="item.cover_pic"></image>
                </view>
                <view @click="switchGood(item)" v-if="activity.activity_status < 2" class="goods-switch">
                    <switch :color="getTheme.color" :checked="item.switch == 1" />
                </view>
                <view class="goods-info">
                    <view class="goods-name t-omit">{{item.name}}</view>
                    <view class="goods-profit" :style="{'color': getTheme.color, 'border-color': getTheme.border}">预计利润 
                        <text v-if="item.use_attr === 1">￥{{item.profit_price.min_price}}-{{item.profit_price.max_price}}</text>
                        <text v-else>￥{{item.profit_price}}</text>
                    </view>
                    <view>库存:{{item.goods_stock}}{{item.goodsWarehouse.unit}}</view>
                    <view :style="{'color': `${activity.activity_status == 0 ? '#ffffff': '#666'}`}">{{item.sales}}</view>
                    <view class="goods-price" :style="{'color': getTheme.color}">￥{{item.min_price}}</view>
                </view>
            </view>
        </view>
        <!--空格区域-->
        <view class="safe-area-inset-bottom">
            <view class="u-bottom-height"></view>
        </view>
        <!--底部按钮-->
        <view class="safe-area-inset-bottom u-bottom-fixed">
            <view class="bottom-menu dir-left-nowrap">
                <view class="menu-btn-area dir-left-nowrap">
                    <view @click="toOrder" class="menu-btn box-grow-1 dir-top-nowrap main-center cross-center">
                        <image src="./../image/order.png"></image>
                        <view>团购订单</view>
                    </view>
                    <view @click="toRecord" class="menu-btn box-grow-1 dir-top-nowrap main-center cross-center">
                        <image src="./../image/data.png"></image>
                        <view>数据</view>
                    </view>
                    <view @click="copy" v-if="activity.activity_status > 0" class="menu-btn box-grow-1 dir-top-nowrap main-center cross-center">
                        <image src="./../image/long.png"></image>
                        <view>复制接龙</view>
                    </view>
                </view>
                <view class="status-btn">
                    <button :style="{'background-color': getTheme.background}" @click="showShare=true" v-if="(activity.activity_status == 2 && activity.is_success == 1) || activity.activity_status == 1 || activity.activity_status == 0" class="share">推广到群聊</button>
                    <view v-if="activity.activity_status == 2 && activity.is_success == 0" class="lose">活动失败</view>
                </view>
            </view>
        </view>
        <app-share-qr-code @share="hShareAppMessage" :posterUrl="'/plugins/community/poster/poster?activity_id='+id + '&middleman_id=0'" :hasPosterNav="showShare" v-model="showShare" title="生成活动海报"></app-share-qr-code>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appShareQrCode from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';

    export default {
        data() {
            return {
                timeInterval: null,
                showShare: false,
                id: 0,
                middleman_id: 0,
                list: [],
                order: [],
                status_text: '',
                activity: {},
                d: '',
                h: '',
                m: '',
                setting: {}
            }
        },
        components: {
            appShareQrCode
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                stock: state => state.mallConfig.__wxapp_img.stock,
                appSetting: state => state.mallConfig.mall.setting,
                appImg: state => state.mallConfig.__wxapp_img.mall,
                bonusImg: state => state.mallConfig.__wxapp_img.bonus,
            })
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.id = options.id;
            that.middleman_id = options.middleman_id;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.getSetting();
        },
        onHide() {
            clearInterval(this.timeInterval);
        },
        onUnload() {
            clearInterval(this.timeInterval);
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.hShareAppMessage();
        },
        // #endif
        methods: {
            hShareAppMessage(s = false) {
                return this.$shareAppMessage({
                    title: this.setting.app_share_title ? this.setting.app_share_title : this.$children[0].navigationBarTitle,
                    imageUrl: this.setting.app_share_pic ? this.setting.app_share_pic : this.list[0].cover_pic,
                    path: "/plugins/community/activity/activity",
                    params: {
                        id: this.id
                    }
                }, s);
            },
            copy() {
                let that = this;
                let order = '';
                let no;
                if(that.order.length === 0) {
                    uni.showToast({
                        title: '暂无订单，复制接龙文本失败',
                        duration: 1000,
                        icon: 'none'
                    });
                    return false;
                }
                for(let i = 0;i < that.order.length;i++) {
                    no = i + 1
                    if(no > 1) {
                        order += '\n\n';
                    }
                    if(no < 10) {
                        order += "【00"+no+"】\n";
                    }else if(no < 100) {
                        order += "【0"+no+"】\n";
                    }else if(no < 1000) {
                        order += "【"+no+"】\n";
                    }
                    order += "用户昵称："+that.order[i].name+"\n商品名称：";
                    for(let idx in that.order[i].list) {
                        if(idx > 0) {
                            order += "、";
                        }
                        order += that.order[i].list[idx].goods + "（";
                        for(let index in that.order[i].list[idx].attr) {
                            if(index > 0) {
                                order += "/";
                            }
                            order += that.order[i].list[idx].attr[index].attr_name;
                        }
                        order += "） x" + that.order[i].list[idx].num;
                    }
                }
                this.$utils.uniCopy({
                    data: order,
                    success() {
                        //#ifndef MP-WEIXIN
                        uni.showToast({title: '复制成功'});
                        // #endif
                    },
                });
            },
            switchGood(item) {
                let that = this;
                that.$request({
                    url: that.$api.community.switch,
                    data: {
                        activity_id: that.id,
                        goods_id: item.id
                    },
                    method: 'post'
                }).then(response=>{
                    uni.hideLoading();
                    uni.showToast({
                        title: response.msg,
                        icon: 'none',
                        duration: 1000
                    });
                })
            },
            toOrder() {
                uni.redirectTo({
                    url: '/plugins/community/order/order?keyword=' + this.activity.title
                });
            },
            toRecord() {
                uni.navigateTo({
                    url: '/plugins/community/record/record?id=' +this.id
                });
            },
            getTime(time) {
                if(time > 86399) {
                    this.d = Math.floor(time / 86400);
                    time = time - (86400*this.d);
                }else {
                    this.d = 0;
                }
                if(time > 3599) {
                    this.h = Math.floor(time / 3600);
                    time = time - (3600*this.h);
                }else {
                    this.h = 0;
                }
                if(time > 59) {
                    this.m = Math.floor(time / 60);
                    time = time - (60*this.m);
                }else {
                    this.m = 0;
                }
            },
            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.community.setting,
                }).then(response=>{
                    if(response.code === 0) {
                        that.setting = response.data;
                        that.getList();
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            getOrder() {
                let that = this;
                that.$request({
                    url: that.$api.community.middle_list,
                    data: {
                        status: 0,
                        keyword: that.activity.title,
                        is_pagination: 2
                    },
                }).then(response=>{
                    this.order = response.data.list;
                })
            },
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.community.activity_detail,
                    data: {
                        id: that.id
                    },
                    method: 'post'
                }).then(response=>{
                    uni.hideLoading();
                    that.$hideLoading();
                    if(response.code === 0) {
                        that.activity = response.data.activity;
                        that.list = response.data.list;
                        for(let i in that.list) {
                            that.list[i].check = true;
                        }
                        if(that.activity.activity_status == 0) {
                            let time = that.activity.time - 1;
                            that.timeInterval = setInterval(() =>{
                                that.getTime(time);
                                time--;
                                if(time == 0) {
                                    clearInterval(that.timeInterval);
                                    that.getList();
                                }
                            },1000);
                        }else {
                            that.status_text = that.activity.end_at.slice(5) + '结束';
                            that.getOrder();
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    uni.hideLoading();
                    that.$hideLoading();
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .status {
        height: 96rpx;
        line-height: 96rpx;
        background-color: #fff;
        padding: 0 24rpx;
        font-size: 24rpx;
        &.start {
            height: 140rpx;
            padding-top: 30rpx
        }
        .status-up,.status-down {
            height: 50rpx;
            line-height: 50rpx;
            font-size: 24rpx;
            width: 100%;
            view {
                height: 50rpx;
                line-height: 50rpx;
            }
            .progress {
                width: #{430rpx};
                background-color: #f0f0f0;
                border-radius: #{10rpx};
                height: #{20rpx};
                position: relative;
                overflow: hidden;
                view {
                    border-radius: #{10rpx};
                    height: #{20rpx};
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 2;
                }
            }
            .condition {
                font-size: 28rpx;
                color: #353535;
            }
            .status {
                font-size: 26rpx;
                color: #ff4544;
                padding-right: 0;
            }
        }
    }
    .goods-list {
        padding: 0 24rpx;
        .item {
            height: 220rpx;
            width: 702rpx;
            margin-top: 20rpx;
            background-color: #fff;
            border-radius: 16rpx;
            position: relative;
            .goods-switch {
                position: absolute;
                right: 24rpx;
                bottom: 24rpx;
                transform:scale(0.7)
            }
            .goods-cover {
                flex-shrink: 0;
                width: 220rpx;
                height: 220rpx;
                border-radius: 16rpx;
                margin-right: 20rpx;
                position: relative;
                .out-dialog {
                    width: #{220rpx};
                    height: #{220rpx};
                    border-radius: #{16rpx};
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 10;
                    background-color: rgba(0,0,0,.5);
                    image {
                        width: #{220rpx};
                        height: #{220rpx};
                        border-radius: #{16rpx};
                    }
                }
                image {
                    width: 100%;
                    height: 100%;
                    border-radius: 16rpx;
                }
            }
            .goods-info {
                padding-top: 20rpx;
                font-size: 20rpx;
                color: #666;
                .goods-name {
                    font-size: 28rpx;
                    width: 440rpx;
                    color: #353535;
                }
                .goods-profit {
                    display: inline-block;
                    padding: 0 4rpx;
                    border: 2rpx solid;
                    border-radius: 8rpx;
                    margin: 12rpx 0 8rpx;
                    font-size: 22rpx;
                    height: 30rpx;
                    line-height: 28rpx;
                }
                .goods-price {
                    font-size: 32rpx;
                }
            }
        }
    }
    .u-bottom-height {
        height: 130upx;
    }
    .bottom-menu {
        width: 100%;
        height: 110rpx;
        font-size: 20rpx;
        .menu-btn-area {
            width: 50%;
            height: 110rpx;
            .menu-btn {
                height: 110rpx;
                color: #999;
                border-right: 2rpx solid #e2e2e2;
                width: 25%;
                &:last-of-type {
                    border-right: 0;
                }
                image {
                    width: 40rpx;
                    height: 40rpx;
                    margin-bottom: 5rpx;
                }
            }
        }
        .status-btn {
            width: 50%;
            height: 110rpx;
            text-align: center;
            line-height: 110rpx;
            .lose {
                width: 100%;
                height: 100%;
                background-color: #999999;
                color: #fff;
                font-size: 28rpx;
            }
            .share {
                width: 100%;
                height: 100%;
                line-height: 110rpx;
                color: #fff;
                border-radius: 0;
                font-size: 28rpx;
            }
        }
    }
    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1500;
        background-color: #ffffff;
    }
</style>