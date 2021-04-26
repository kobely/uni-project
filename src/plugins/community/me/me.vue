<template>
    <app-layout>
        <app-head :theme="getTheme"></app-head>
        <view class="title dir-left-nowrap cross-center">
            <image class="avatar" :src="middleman.avatar"></image>
            <view class="user-info dir-top-nowrap main-center">
                <view class="user dir-left-nowrap cross-center">
                    <view class="nickname">{{middleman.nickname}}</view>
                    <view class="middleman">
                        <image src="./../image/logo.png"></image>
                        <text>{{setting.middleman}}</text>
                    </view>
                </view>
                <view class="apply">加入时间: {{apply_at}}</view>
            </view>
        </view>
        <view class="money-info">
            <view class="menu" style="margin: 0">
                <view class="menu-item main-between cross-center">
                    <view>
                        已结算
                        <view class="sec-title">已结算金额=已提现金额+可提现金额</view>
                    </view>
                    <view class="money">{{middleman.total_money}}</view>
                </view>
                <view class="menu-item main-between cross-center">
                    <view>可提现</view>
                    <view class="money">{{middleman.money}}</view>
                </view>
            </view>
            <view @click="toProfit" class="look-money main-center cross-center">
                <view>查看利润明细</view>
                <image src="/static/image/icon/arrow-right.png"></image>
            </view>
        </view>
        <view class="menu">
            <view @click="toCash" class="menu-item main-between cross-center">
                <view>利润提现</view>
                <image src="/static/image/icon/arrow-right.png"></image>
            </view>
            <view @click="toClerk" class="menu-item main-between cross-center">
                <view>提货核销</view>
                <image src="/static/image/icon/arrow-right.png"></image>
            </view>
        </view>
        <view class="menu">
            <view @click="toAddress" class="menu-item main-between cross-center">
                <view>我的地址</view>
                <image src="/static/image/icon/arrow-right.png"></image>
            </view>
        </view>
        <app-menu :theme="getTheme" active="me"></app-menu>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appMenu from '../components/app-menu';
    import appHead from '../components/app-head.vue';

    export default {
        data() {
            return {
                middleman: {},
                setting: {},
                apply_at: ''
            }
        },
        components: {
            "app-menu": appMenu,
            "app-head": appHead
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
        onShow: function (options) {
            this.getStatus();
        },
        methods: {
            toProfit() {
                uni.navigateTo({
                    url: '/plugins/community/profit/profit'
                });
            },
            toCash() {
                uni.navigateTo({
                    url: '/plugins/community/profit-cash/profit-cash'
                });
            },
            toClerk() {
                uni.navigateTo({
                    url: '/plugins/community/clerk/clerk'
                });
            },
            toAddress() {
                uni.navigateTo({
                    url: '/plugins/community/apply/apply?id=' + this.middleman.id
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
            },
        }
    }
</script>

<style scoped lang="scss">
    .title {
        height: 220rpx;
        margin-top: -360rpx;
        width: 100%;
        padding: 0 45rpx;
        position: relative;
        z-index: 10;
        .avatar {
            width: 130rpx;
            height: 130rpx;
            margin-right: 25rpx;
            display: block;
            border-radius: 50%;
        }
        .user-info {
            color: #fff;
            height: 130rpx;
            .user {
                height: 36rpx;
                line-height: 36rpx;
                .nickname {
                    font-size: 28rpx;
                    margin-right: 20rpx;
                }
                .middleman {
                    height: 36rpx;
                    background-color: #353535;
                    border-radius: 18rpx;
                    padding: 0 12rpx 0 6rpx;
                    font-size: 22rpx;
                    image {
                        float: left;
                        margin-top: 2rpx;
                        width: 32rpx;
                        height: 32rpx;
                        display: block;
                        margin-right: #{6rpx};
                    }
                }
            }
            .apply {
                color: #fff;
                font-size: 26rpx;
                margin-top: 20rpx;
            }
        }
    }
    .money-info {
        width: 702rpx;
        margin: 0 24rpx;
        border-radius: 16rpx;
        background-color: #fff;
        position: relative;
        z-index: 10;
        .menu {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            .menu-item {
                height: 115rpx;
                font-size: 26rpx;
                .sec-title {
                    font-size: 20rpx;
                    margin-top: 8rpx;
                    color: #999;
                }
                .money {
                    font-family: DIN;
                    font-size: 40rpx;
                    color: #f39800;
                }
            }
        }
        .look-money {
            height: 88rpx;
            border-top: 2rpx solid #e2e2e2;
            font-size: 26rpx;
            color: #999999;
            image {
                width: 12rpx;
                height: 22rpx;
                margin-left: 15rpx;
                display: block;
            }
        }
    }
    .menu {
        border-radius: 16rpx;
        background-color: #fff;
        width: 702rpx;
        margin: 15rpx 24rpx 0;
        .menu-item {
            padding: 32rpx;
            height: 96rpx;
            border-top: 2rpx solid #e2e2e2;
            font-size: 26rpx;
            color: #353535;
            &:first-of-type {
                border-top: 0;
            }
            image {
                width: 12rpx;
                height: 22rpx;
                display: block;
            }
        }
    }
</style>