<template>
    <app-layout>
        <view :class="[`nav main-between cross-center`]">
            <view class="nav-left">
                <view>{{custom_setting.menus.money.name}}</view>
                <view class="money">{{list.total_money?list.total_money:0}}元</view>
            </view>
            <view class="nav-right cross-center" @click="toDetail">
                <view>{{custom_setting.menus.cash.name}}</view>
            </view>
        </view>
        <view class="info-item">
            <text>{{custom_setting.words.can_be_presented.name}}</text>
            <view class="use-money">{{list.money?list.money:0}}元</view>
        </view>
        <view class="info-item cash-money">
            <view class="money-info">
                <text>{{custom_setting.words.already_presented.name}}</text>
                <view class="use-money">{{list.cash_money?list.cash_money:0}}元</view>
            </view>
            <view>
                <text>{{custom_setting.words.pending_money.name}}</text>
                <view class="use-money">{{list.un_pay?list.un_pay:0}}元</view>
            </view>
        </view>
        <view @click="open=!open">
            <view class="info-item">
                <text>{{custom_setting.words.user_instructions.name}}</text>
                <view style="float:right">
                    <image class="down" src="/static/image/share/img-share-down.png" v-if="open"></image>
                    <image class="open" src="/static/image/share/img-share-right.png" v-else></image>
                </view>
                <text class="must" space="nbsp" v-if="open" v-text="config.content"></text>
            </view>
        </view>
        <view @click="toCash">
            <view class="submit">
                <button >{{custom_setting.words.cash.name}}</button>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        data() {
            return {
                open: false,
                list: [],
                config: []
            }
        },
        computed: {
            ...mapState({
                mall: state => state.mallConfig.mall,
                custom_setting: state => state.mallConfig.share_setting_custom,
                share_setting: state => state.mallConfig.share_setting,
            })
        },
        methods: {
            toCash() {
                uni.navigateTo({
                    url: '/pages/share/cash/cash?money=' + this.list.money
                });
            },

            toDetail() {
                uni.navigateTo({
                    url: '/pages/share/cash-detail/cash-detail'
                });
            },

            setting() {
                let that = this;
                that.$request({
                    url: that.$api.share.setting,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.config = response.msg.config;
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
        },

        onLoad() { this.$commonLoad.onload();
            let that = this;
            uni.setNavigationBarTitle({
                title: that.custom_setting.menus.money.name
            });
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.$request({
                url: that.$api.share.brokerage,
            }).then(response=>{
                if(response.code == 0) {
                    that.list = response.data.list;
                    that.setting();
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
</script>

<style scoped lang="scss">
    .nav {
        padding: #{24rpx};
        height: #{160rpx};
        color: #fff;
        background-color: #ff4544;
    }

    .money {
        margin-top: #{15rpx};
        font-size: #{46rpx};
    }

    .nav-right {
        width: auto;
        height: #{112rpx};
    }

    .nav-right view {
        background-color: #ff4544;
        color: #fff;
        border: #{2rpx} solid #fff;
        padding: 0 #{30rpx};
        height: #{54rpx};
        line-height: #{52rpx};
        border-radius: #{27rpx};
        font-size: #{28rpx};
    }

    .nav-right button::after {
        border: 0;
    }

    .info-item {
        background-color: #fff;
        padding: #{24rpx};
        font-size: #{28rpx};
        width: 100%;
        color: #353535;
    }

    .info-item.cash-money {
        margin: #{20rpx} 0;
    }

    .use-money {
        float: right;
        color: #666;
    }

    .money-info {
        border-bottom: #{1rpx} solid #e2e2e2;
        padding-bottom: #{24rpx};
        margin-bottom: #{24rpx};
    }

    .open {
        width: #{16rpx};
        height: #{26rpx};
    }

    .down {
        height: #{16rpx};
        width: #{26rpx};
    }

    .submit {
        width: 90%;
        margin: #{40rpx} auto;
    }

    .submit button {
        color: #fff;
        font-size: #{30rpx};
        height: #{80rpx};
        border-radius: #{40rpx};
        line-height: #{80rpx};
        background: #ff4544;
    }

    button:active {
        background-color: rgba(0, 0, 0, 0.2);
    }

    .must {
        display: block;
        padding-top: #{24rpx};
        font-size: #{26rpx};
    }
</style>