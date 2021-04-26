<template>
    <app-layout>
        <app-tab-nav :setTop="0" :tabList="tabList" :padding="0" :theme="getTheme" :activeItem="activeTab" @click="tabStatus" :shadow="false"></app-tab-nav>
        <view v-if="activeTab == 1">
            <view class="tip">提示：当预计利润大于可提现利润时，说明存在未过售后订单</view>
            <view class="tip-placeholder"></view>
            <view class="item" v-for="(item,index) in list" :key="index">
                <view class="item-top main-between">
                    <view class="goods-title dir-left-nowrap">
                        <image src="./../image/activity-name.png"></image>
                        <view>{{item.activity.title}}</view>
                    </view>
                    <view class="start-time dir-left-nowrap">
                        {{item.activity.start_at}}开始
                    </view>
                </view>
                <view class="item-info">
                    <view class="item-bottom main-center">
                        <view class="money-item dir-top-nowrap cross-center main-center box-grow-1">
                            <view>订单数</view>
                            <view style="color: #353535;" class="money">{{item.order_num}}</view>
                        </view>
                        <view class="money-item dir-top-nowrap cross-center main-center box-grow-1">
                            <view>订单金额</view>
                            <view style="color: #353535;" class="money">{{item.total_pay_price}}</view>
                        </view>
                    </view>
                    <view class="item-bottom main-center">
                        <view class="money-item dir-top-nowrap cross-center main-center box-grow-1">
                            <view>预计总利润</view>
                            <view style="color: #f39800" class="money">{{item.profit_price}}</view>
                        </view>
                        <view class="money-item dir-top-nowrap cross-center main-center box-grow-1">
                            <view>可提现利润</view>
                            <view style="color: #f39800" class="money">{{item.stay_price}}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view v-if="activeTab == 2">
            <view class="price main-between cross-center">
                <view>
                    <view>累计利润：￥{{statics.all_price ? statics.all_price :'0.00'}}</view>
                    <view>待结算：￥{{statics.stay_price ? statics.stay_price: '0.00'}}</view>
                </view>
                <view class="choose-btn" :style="{'color': getTheme.color, 'border-color': getTheme.border}" @click="show=!show">
                    <text>{{type == 'day' ? '今日': type == 'month' ? '本月': '全部'}}</text>
                    <image v-if="activeTab == 2" :style="{'background-color': getTheme.background}" src='./../image/open.png'></image>
                </view>
            </view>
            <view class="order">
                <view v-for="item in detail" class="order-item" :key="item.order_no">
                    <view class="order-top main-between">
                        <view>{{item.order_no}}</view>
                        <view>￥{{item.profit_price}}</view>
                    </view>
                    <view class="order-bottom main-between">
                        <view>{{item.created_at}}</view>
                        <view>{{item.status}}</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="bg" v-if="show">
            <view class='dialog'>
                <view @click="toggle('')" class="dialog-item">全部</view>
                <view @click="toggle('month')" class="dialog-item">本月</view>
                <view @click="toggle('day')" class="dialog-item">今日</view>
                <view class="cancel main-center cross-center">
                    <view @click="show=!show" class="cancel-btn">取消</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appTabNav from "../../../components/basic-component/app-tab-nav/app-tab-nav.vue";

    export default {
        data() {
            return {
                show: false,
                statics: {
                    all_price: '',
                    stay_price: '',
                },
                tabList: [
                    {id:1, name: '概况'},
                    {id:2, name: '明细'}
                ],
                activeTab: 1,
                type: '',
                page: 1,
                list: [],
                detail: []
            }
        },
        components: {
            "app-tab-nav": appTabNav
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
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.getStatus();
        },
        onReachBottom() {
            this.page++;
            if(this.activeTab == 2) {
                this.getDetail();
            }else {
                this.getList();
            }
        },
        methods: {
            tabStatus(e) {
                let id = e.currentTarget.dataset.id;
                this.show = false;
                this.activeTab = id;
                this.page = 1;
                if(this.detail.length == 0) {
                    this.$showLoading({
                        type: 'global',
                        text: '加载中...'
                    });
                }
                if(this.activeTab == 2) {
                    this.getDetail();
                }else {
                    this.getList();
                }
            },
            toggle(type) {
                this.type = type;
                this.show = false;
                this.page = 1;
                this.getDetail();
            },
            getDetail() {
                let that = this;
                that.$request({
                    url: that.$api.community.profit_detail,
                    data: {
                        type: this.type,
                        page: this.page
                    }
                }).then(response=>{
                    uni.hideLoading();
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.statics = response.data.data;
                        if(that.page > 1) {
                            that.detail = that.detail.concat(response.data.list);
                        }else {
                            that.detail = response.data.list;
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
            },
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.community.profit_list,
                    data: {
                        page: this.page
                    }
                }).then(response=>{
                    uni.hideLoading();
                    that.$hideLoading();
                    if(response.code == 0) {
                        if(that.page > 1) {
                            that.list = that.list.concat(response.list);
                        }else {
                            that.list = response.list;
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
            },
            getStatus() {
                let that = this;
                that.$request({
                    url: that.$api.community.index,
                }).then(response=>{
                    if(response.code == 0) {
                        this.setting = response.data.setting;
                        if(response.data.middleman.id > 0) {
                            this.middleman = response.data.middleman;
                            this.apply_at = this.middleman.apply_at.substring(0,10)
                            this.getList();
                        }else {
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
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .tip {
        height: 60rpx;
        line-height: 60rpx;
        background-color: #f8e5e5;
        color: #ff4544;
        padding-left: 20rpx;
        font-size: 24rpx;
        position: fixed;
        top: #{90rpx};
        left: 0;
        width: 100%;
        z-index: 10;
    }
    .tip-placeholder {
        height: 60rpx;
    }
    .item {
        width: 702rpx;
        margin: 16rpx 24rpx 0;
        background-color: #fff;
        border-radius: 16rpx;
        .item-top {
            height: 90rpx;
            line-height: 90rpx;
            padding: 0 20rpx;
            border-bottom: 2rpx solid #e2e2e2;
            .goods-title {
                color: #353535;
                font-size: #{24rpx};
                margin-top: 30rpx;
                height: 30rpx;
                line-height: 30rpx;
                image {
                    width: 30rpx;
                    height: 30rpx;
                    margin-right: 20rpx;
                    display: block;
                }
            }
            .start-time {
                color: #999999;
                font-size: 24rpx;
            }
        }
        .item-info {
            padding: 30rpx 0;
            .item-bottom {
                height: 105rpx;
                .money-item {
                    font-size: 24rpx;
                    color: #999999;
                    width: 50%;
                    .money {
                        margin-top: 10rpx;
                        font-family: DIN;
                        font-size: 46rpx;
                    }
                }
            }
        }
    }
    .price {
        height: 96rpx;
        background-color: #fff;
        padding: 0 24rpx;
        font-size: 24rpx;
        color: #999999;
        position: fixed;
        top: #{90rpx};
        left: 0;
        width: 100%;
        z-index: 100;
        .choose-btn {
            border: 2rpx solid;
            height: 50rpx;
            border-radius: 25rpx;
            line-height: 48rpx;
            display: inline-block;
            padding: 0 24rpx;
            image {
                margin-top: 21rpx;
                height: 8rpx;
                width: 12rpx;
                margin-left: 10rpx;
                float: right;
                display: block;
            }
        }
    }
    .order {
        width: 702rpx;
        border-radius: 16rpx;
        background-color: #fff;
        margin: 114rpx 24rpx 24rpx;
        .order-item {
            padding: 24rpx 32rpx;
            border-top: 2rpx solid #e2e2e2;
            font-size: 26rpx;
            color: #353535;
            &:first-of-type {
                border-top: 0;
            }
            .order-bottom {
                font-size: 24rpx;
                color: #999999;
            }
        }
    }
    .bg {
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,.3);
        z-index: 4;
        width: 100%;
        height: 100%;
        .dialog {
            background-color: #fff;
            border-radius: 16rpx;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            z-index: 200;
            .dialog-item {
                height: 115rpx;
                line-height: 115rpx;
                border-bottom: 2rpx solid #e2e2e2;
                text-align: center;
                font-size: 26rpx;
                color: #353535;
            }
            .cancel {
                background-color: #F6F6F6;
                height: 140rpx;
                .cancel-btn {
                    height: 115rpx;
                    line-height: 115rpx;
                    text-align: center;
                    width: 702rpx;
                    border-radius: 16rpx;
                    background-color: #fff;
                }
            }
        }
    }
</style>