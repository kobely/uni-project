<template>
    <view>
        <!--空格区域-->
        <view class="safe-area-inset-bottom">
            <view class="u-bottom-height"></view>
        </view>
        <!--底部按钮-->
        <view class="safe-area-inset-bottom u-bottom-fixed">
            <view class="app-menu main-between">
                <view v-show="activity_loading" @click="toActivity" class="menu-btn dir-top-nowrap main-center cross-center">
                    <image @load="activityLoad" :style="{'background-color': theme.background}" v-if="active === 'activity'" src="./../image/activity-active.png"></image>
                    <image @load="activityLoad" v-else src="./../image/activity.png"></image>
                    <view :style="{'color': active === 'activity' ? theme.color : ''}">活动</view>
                </view>
                <view v-show="order_loading" @click="toOrder" class="menu-btn dir-top-nowrap main-center cross-center">
                    <image @load="orderLoad" :style="{'background-color': theme.background}" v-if="active === 'order'" src="./../image/order-active.png"></image>
                    <image @load="orderLoad" v-else src="./../image/order.png"></image>
                    <view :style="{'color': active === 'order' ? theme.color : ''}">订单</view>
                </view>
                <view v-show="me_loading" @click="toMe" class="menu-btn dir-top-nowrap main-center cross-center">
                    <image @load="meLoad" :style="{'background-color': theme.background}" v-if="active === 'me'" src="./../image/me-active.png"></image>
                    <image @load="meLoad" v-else src="./../image/me.png"></image>
                    <view :style="{'color': active === 'me' ? theme.color : ''}">我的</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>

    export default {
        name: 'app-index',
        props: {
            active: {
                type: String
            },
            theme: Object
        },
        data() {
            return {
                activity_loading: false,
                order_loading: false,
                me_loading: false,
            };
        },
        methods: {
            activityLoad() {
                this.activity_loading = true;
            },
            orderLoad() {
                this.order_loading = true;
            },
            meLoad() {
                this.me_loading = true;
            },
            toActivity() {
                if (this.active === 'activity') {
                    return false;
                }
                uni.redirectTo({
                    url: '/plugins/community/index/index'
                });
            },
            toOrder() {
                if (this.active === 'order') {
                    return false;
                }
                uni.redirectTo({
                    url: '/plugins/community/order/order'
                });
            },
            toMe() {
                if(this.active === 'me') {
                    return false;
                }
                uni.redirectTo({
                    url: '/plugins/community/me/me'
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1500;
        background-color: #ffffff;
    }
    .u-bottom-height {
        height: 90upx;
    }
    .app-menu {
        height: #{90rpx};
        width: 100%;
        background-color: #fff;
        font-size: #{22rpx};
        border-top: #{2rpx} solid #e2e2e2;
        .menu-btn {
            width: #{200rpx};
            color: #666;
            text-align: center;
            height: #{90rpx};
            image {
                width: #{40rpx};
                height: #{40rpx};
                margin-bottom: #{3rpx};
            }
        }
    }
</style>