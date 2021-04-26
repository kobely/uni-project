<template>
    <app-layout>
        <scroll-view @scrolltolower="getMore" scroll-y :style="{'height':`${windowHeight}px`}">
            <app-tab-nav setTop="0" :tabList="tabList" padding="0" :theme="getTheme" :activeItem="activeTab" @click="tabStatus"></app-tab-nav>
            <view v-if="list.length > 0">
                <view v-for="(item,index) in list" :key="item.id" class="list">
                    <view class="title main-between cross-center">
                        <view class="title-name">
                            <view class="title-text">{{item.title}}</view>
                            <view v-if="item.condition > 0">满{{item.num}}{{item.condition == 1 ? '人':'件'}}成团，已参团{{item.condition_count ? item.condition_count : '0'}}{{item.condition == 1 ? '人':'件'}}</view>
                        </view>
                        <view class="status-text" :style="{'color': getTheme.color}">{{item.statusText}}</view>
                    </view>
                    <view @click="toDetail(item.id)" class="goods-list">
                        <view class="dir-left-nowrap">
                            <view class="goods" v-for="goods in item.communityGoods_4"  :key="goods.id">
                                <image mode='aspectFill' :src="goods.cover_pic"></image>
                            </view>
                        </view>
                        <image class="right-arrow" src="/static/image/icon/arrow-right.png"></image>
                    </view>
                    <view class="main-between cross-center other">
                        <view>共{{item.goods_count}}件商品</view>
                        <view class="dir-right-nowrap">
                            <view @click="showHiddenClick(item)" class="other-button normal-button" v-if="item.status_name == '未开始' || item.status_name == '进行中'">分享</view>
                            <view @click="toRemind(item.id,index)" class="other-button" :style="{'color': getTheme.color, 'border-color': getTheme.border}" v-if="item.status_name == '已结束' && item.is_success == 1 && item.is_remind == 0">通知提货</view>
                            <view class="other-button un-active" v-if="item.status_name == '已结束' && item.is_success == 1 && item.is_remind == 1">通知提货</view>
                            <view v-if="item.status_name != '未开始'" @click="toOrder(item)" class="other-button normal-button">本团订单</view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else class="empty-box">
                <image src="/static/image/order-empty.png"></image>
                <span>暂无{{activeTab == 0?'未开始': activeTab == 1?'进行中':activeTab == 2?'已结束':''}}活动</span>
            </view>
            <view>
                <app-share-qr-code @share="hShareAppMessage" :posterUrl="'/plugins/community/poster/poster?activity_id='+id + '&middleman_id=0'" :hasPosterNav="showShare" v-model="showShare" :url="poster" title="生成活动海报"></app-share-qr-code>
            </view>
            <view v-if="showRemind" class="dialog-bg main-center cross-center">
                <view class="dialog">
                    <view class="dialog-content">确认通知提货？</view>
                    <view class="dialog-btn main-between">
                        <view @click="toRemind" class="btn" style="color: #666">取消</view>
                        <view class="line"></view>
                        <view @click="remind" class="btn" :style="{'color': getTheme.color}">确认</view>
                    </view>
                </view>
            </view>
            <app-menu :theme="getTheme" active="activity"></app-menu>
        </scroll-view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appMenu from '../components/app-menu';
    import appTabNav from "../../../components/basic-component/app-tab-nav/app-tab-nav.vue";
    import appShareQrCode from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';

    export default {
        data() {
            return {
                tabList: [
                    {id:-1, name: '全部'},
                    {id:1, name: '进行中'},
                    {id:0, name: '未开始'},
                    {id:2, name: '已结束'}
                ],
                activeTab: -1,
                list: [],
                setting: {},
                detail: {},
                id: 0,
                windowHeight: 0,
                index: -1,
                page: 1,
                showShare: false,
                showRemind: false,
                more: false,
                poster: '',
                middleman: {}
            }
        },
        components: {
            "app-tab-nav": appTabNav,
            "app-menu": appMenu,
            appShareQrCode
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                stock: state => state.mallConfig.__wxapp_img.stock,
                bonusImg: state => state.mallConfig.__wxapp_img.bonus,
                userInfo: state => state.user.info,
            })
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            uni.getSystemInfo({
                success: function (res) {
                    that.windowHeight = res.windowHeight;
                }
            })
            that.getStatus();
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
                    imageUrl: this.setting.app_share_pic ? this.setting.app_share_pic : this.detail.communityGoods_4[0].cover_pic,
                    path: "/plugins/community/activity/activity",
                    params: {
                        id: this.id
                    }
                },s);
            },
            toRemind(id,index) {
                if(id > 0) {
                    this.id = id;
                    this.index = index;
                }
                this.showRemind = !this.showRemind
            },
            remind(item) {
                let that = this;
                that.toRemind();
                uni.showLoading({
                    mask: true,
                    title: '发送提醒...'
                });
                that.$request({
                    url: that.$api.community.notice,
                    data: {
                        activity_id: that.id
                    }
                }).then(response=>{
                    uni.hideLoading();
                    uni.showToast({
                        title: response.msg,
                        icon: 'none',
                        duration: 1000
                    });
                    that.id = 0;
                    if(response.code == 0) {
                        that.list[that.index].is_remind = 1;
                        that.index = -1;
                    }
                })
            },
            toDetail(id) {
                uni.navigateTo({
                    url: '/plugins/community/detail/detail?id=' + id + '&middleman_id=' + this.middleman.user_id
                });
            },
            toOrder(item) {
                uni.redirectTo({
                    url: '/plugins/community/order/order?keyword=' + item.title
                });
            },
            showHiddenClick(detail) {
                this.showShare = !this.showShare;
                this.detail = detail;
                this.id = detail.id;
            },
            tabStatus(e) {
                if(this.loading) {
                    return false
                }
                this.list = [];
                this.page = 1;
                this.activeTab = e.currentTarget.dataset.id;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.getList();
            },
            getStatus() {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.community.index,
                }).then(response=>{
                    if(response.code == 0) {
                        this.setting = response.data.setting;
                        if(response.data.middleman.status == 1) {
                            that.getList();
                            this.middleman = response.data.middleman;
                        }else {
                            that.$hideLoading();
                            uni.showToast({
                                title: '您还不是团长，现在前往申请页面',
                                icon: 'none',
                                duration: 1000
                            });
                            setTimeout(function(){
                                uni.redirectTo({
                                    url: '/plugins/community/apply/apply'
                                });
                            },1000)
                        }
                    }else {
                        that.$hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
            getMore() {
                if(this.more) {
                    this.page++;
                    this.getMoreList();
                    this.more = false;
                }
            },
            getMoreList() {
                let that = this;
                that.$request({
                    url: that.$api.community.activity_list,
                    data: {
                        status: that.activeTab,
                        page: that.page
                    },
                    method: 'get'
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.more = false;
                        if(response.list.length == 20) {
                            that.more = true;
                        }
                        for(let index in response.list) {
                            if(response.list[index].goods_count == 0) {
                                response.list.splice(index,1)
                            }
                        }
                        let list = response.list;
                        for(let i in list) {
                            if(list[i].status_name == '已结束') {
                                list[i].statusText = '活动失败'
                                if(list[i].is_success) {
                                    list[i].statusText = '活动成功'
                                }
                            }else if(list[i].status_name == '进行中') {
                                list[i].statusText = list[i].end_at + '结束'
                            }else if(list[i].status_name == '未开始') {
                                list[i].statusText = list[i].start_at + '开始'
                            }
                        }
                        that.list = that.list.concat(list)
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                    that.$hideLoading();
                });
            },
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.community.activity_list,
                    data: {
                        status: that.activeTab
                    },
                    method: 'post'
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.more = false;
                        if(response.list.length == 20) {
                            that.more = true;
                        }
                        for(let index in response.list) {
                            if(response.list[index].goods_count == 0) {
                                response.list.splice(index,1)
                            }
                        }
                        that.list = response.list;
                        for(let i in that.list) {
                            if(that.list[i].status_name == '已结束') {
                                that.list[i].statusText = '活动失败'
                                if(that.list[i].is_success) {
                                    that.list[i].statusText = '活动成功'
                                }
                            }else if(that.list[i].status_name == '进行中') {
                                that.list[i].statusText = that.list[i].end_at + '结束'
                            }else if(that.list[i].status_name == '未开始') {
                                that.list[i].statusText = that.list[i].start_at + '开始'
                            }
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                    that.$hideLoading();
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .dialog-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.3);
        z-index: 1000;
        .dialog {
            font-size: 30rpx;
            color: #353535;
            width: 480rpx;
            height: 200rpx;
            border-radius: 16rpx;
            text-align: center;
            background-color: #fff;
            .dialog-content {
                height: 110rpx;
                line-height: 110rpx;
            }
            .dialog-btn {
                position: relative;
                height: 90rpx;
                border-top: 2rpx solid #e2e2e2;
                .btn {
                    width: 240rpx;
                    height: 90rpx;
                    text-align: center;
                    line-height: 90rpx;
                    font-size: 26rpx;
                }
                .line {
                    position: absolute;
                    top: 20rpx;
                    left: 50%;
                    margin-left: -1rpx;
                    width: 2rpx;
                    height: 45rpx;
                    background-color: #e2e2e2;
                }
            }
        }
    }
    .list {
        background-color: #fff;
        border-radius: 16rpx;
        margin: 24rpx;
        width: 702rpx;
        padding: 0 24rpx 40rpx;
        .title {
            height: 115rpx;
            border-bottom: 2rpx solid #e2e2e2;
            font-size: 22rpx;
            .title-name {
                font-size: 22rpx;
                color: #666;
                .title-text {
                    font-size: 28rpx;
                    font-weight: 600;
                    color: #353535;
                }
            }
            .status-text {
                width: 145rpx;
                text-align: right;
            }
        }
        .goods-list {
            position: relative;
            height: 160rpx;
            .goods {
                height: 160rpx;
                padding-top: 20rpx;
                padding-bottom: 20rpx;
                image {
                    margin-right: 20rpx;
                    height: 120rpx;
                    width: 120rpx;
                    border-radius: 16rpx;
                }
            }
            .right-arrow {
                position: absolute;
                top: 50%;
                margin-top: #{-12rpx};
                right: #{24rpx};
                width: #{12rpx};
                height: #{24rpx};
            }
        }
        .other {
            font-size: 22rpx;
            color: #666;
            height: 60rpx;
            .other-button {
                line-height: 58rpx;
                height: 58rpx;
                padding: 0 35rpx;
                border-radius: 30rpx;
                border: 2rpx solid;
                display: inline-block;
                font-size: 24rpx;
                margin-left: 25rpx;
                &.un-active {
                    background-color: #F7F7F7;
                    border-color: #F7F7F7;
                    color: #E2E2E2;
                }
                &.normal-button {
                    border-color: #e2e2e2;
                }
            }
        }
    }
    .empty-box {
        width: 100%;
        height: 60vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        image {
            width: 280#{rpx};
            height: 280#{rpx};
        }
        span {
            margin-top: 15#{rpx};
            color: #999;
            font-size: 28#{rpx};
        }
    }
</style>