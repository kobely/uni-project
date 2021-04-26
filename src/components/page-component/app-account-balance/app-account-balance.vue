<template>
    <view class="app-account-balance dir-left-nowrap cross-center"
          :class="[!margin?'no-margin':'', !round?'no-round':'',]" v-if="showBar">
        <template v-if="showIntegral">
            <view class="box-grow-1 split" :class="[showCount > 1?'':'data-col']">
                <app-account-style :show-count="showCount" :icon="userCenter.account_bar.integral.icon"
                                   :text="userCenter.account_bar.integral.text"
                                   :value="userInfo?userInfo.integral:'-'"
                                   :page="userCenter.account_bar.integral.navigate_enabled?'/plugins/integral_mall/index/index':'/pages/user-center/integral-detail/integral-detail'"></app-account-style>
            </view>
        </template>
        <template v-if="showBalance">
            <view class="box-grow-1 split" :class="[showCount > 1?'':'data-col']">
                <app-account-style :show-count="showCount" :icon="userCenter.account_bar.balance.icon"
                                   :text="userCenter.account_bar.balance.text"
                                   :value="userInfo?userInfo.balance:'-'"
                                   page="/pages/balance/balance"></app-account-style>
            </view>
        </template>
        <template v-if="showCoupon">
            <view class="box-grow-1 split" :class="[showCount > 1?'':'data-col']">
                <app-account-style :show-count="showCount" :icon="userCenter.account_bar.coupon.icon"
                                   :text="userCenter.account_bar.coupon.text"
                                   :value="userInfo?userInfo.coupon:'-'"
                                   page="/pages/coupon/index/index"></app-account-style>
            </view>
        </template>
        <template v-if="showCard">
            <view class="box-grow-1 split" :class="[showCount > 1?'':'data-col']">
                <app-account-style :show-count="showCount" :icon="userCenter.account_bar.card.icon"
                                   :text="userCenter.account_bar.card.text"
                                   :value="userInfo?userInfo.card:'-'"
                                   page="/pages/card/index/index"></app-account-style>
            </view>
        </template>
    </view>
</template>

<script>
    import {mapState} from 'vuex';
    import appAccountStyle from "./app-account-style.vue";

    export default {
        name: 'app-account-balance',
        components: {
            'app-account-style': appAccountStyle,
        },
        props: {
            margin: {
                type: Boolean,
                default: false,
            },
            round: {
                type: Boolean,
                default: false,
            },
            inputUserCenter: null,
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                storeUserCenter: state => state.mallConfig.user_center,
            }),
            showBar() {
                if (this.userCenter
                    && this.userCenter.account_bar
                    && this.userCenter.account_bar.status == 0
                ) return false;
                return this.showBalance || this.showIntegral;
            },
            userCenter() {
                if (this.inputUserCenter) return this.inputUserCenter;
                return this.storeUserCenter;
            },
            showIntegral() {
                if (!this.userCenter) return false;
                if (this.userCenter.account_bar && this.userCenter.account_bar.integral.status == 1) return true;
                return false;
            },
            showBalance() {
                if (!this.userCenter) return false;
                if (this.userCenter.recharge_setting
                    && this.userCenter.recharge_setting.status == 1
                    && this.userCenter.account_bar
                    && this.userCenter.account_bar.balance.status == 1
                ) return true;
                return false;
            },
            showCoupon() {
                if (!this.userCenter) return false;
                if (this.userCenter.account_bar && this.userCenter.account_bar.coupon.status == 1) return true;
                return false;
            },
            showCard() {
                if (!this.userCenter) return false;
                if (this.userCenter.account_bar && this.userCenter.account_bar.card.status == 1) return true;
                return false;
            },
            showCount() {
                let count = 0;
                if (this.showIntegral) {
                    count++;
                }
                if (this.showBalance) {
                    count++;
                }
                if (this.showCoupon) {
                    count++;
                }
                if (this.showCard) {
                    count++;
                }
                return count;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .app-account-balance.no-margin {
        width: 100%;
        margin: 0 auto;
        box-shadow: none;
    }

    .app-account-balance.no-round {
        border-radius: 0;
    }

    .app-account-balance {
        width: #{702rpx};
        height: #{100rpx};
        background: #fff;
        border-radius: #{16rpx};
        margin: #{24rpx} auto;
        box-shadow: 0 0 #{8rpx} rgba(0, 0, 0, .05);
    }

    .data-col {
        width: 100%;
        padding: 0 #{32rpx};
    }

    .split {
        border-left: #{1rpx #eeeeee solid};

        &:first-child {
            border: none;
        }
    }
</style>
