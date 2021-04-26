<template>
    <view>
        <app-model v-model="display" type="3">
            <view slot="title">{{title}}</view>
            <view slot="content">
                <view class="dir-top-nowrap">
                    <view class="cash-type-item dir-left-nowrap cross-center" v-if="isAuto">
                        <image class="icon" src="/static/image/icon/cash/icon-auto.png"></image>
                        <view class="dir-left-nowrap box-grow-1 cash-type-box cross-center"
                              @click="payTypeChange(`auto`)">
                            <!--  #ifdef MP-WEIXIN -->
                            <view class="box-grow-1 cross-center">微信零钱</view>
                            <!--  #endif -->
                            <!--  #ifdef MP-ALIPAY -->
                            <view class="box-grow-1 cross-center">支付宝余额</view>
                            <!--  #endif -->
                            <!--  #ifndef MP-WEIXIN || MP-ALIPAY -->
                            <view class="box-grow-1 cross-center">自动</view>
                            <!--  #endif -->
                            <view class="cross-center">
                                <view v-if="payType === `auto`" class="radio-single-active" :style="{'background-color': theme.background}"></view>
                                <view v-else class="radio-single"></view>
                            </view>
                        </view>
                    </view>
                    <view class="cash-type-item dir-left-nowrap cross-center" v-if="isWx">
                        <image class="icon" src="/static/image/icon/cash/icon-wechat.png"></image>
                        <view class="dir-left-nowrap cross-center box-grow-1 cash-type-box"
                              @click="payTypeChange(`wx`)">
                            <view class="box-grow-1">微信线下打款</view>
                            <view class="box-grow-0">
                                <view v-if="payType === `wx`" class="radio-single-active" :style="{'background-color': theme.background}"></view>
                                <view v-else class="radio-single"></view>
                            </view>
                        </view>
                    </view>
                    <view class="cash-type-item dir-left-nowrap cross-center" v-if="isAlipay">
                        <image class="icon" src="/static/image/icon/cash/icon-alipay.png"></image>
                        <view class="dir-left-nowrap cross-center box-grow-1 cash-type-box"
                              @click="payTypeChange(`alipay`)">
                            <view class="box-grow-1">支付宝线下打款</view>
                            <view class="box-grow-0">
                                <view v-if="payType === `alipay`" class="radio-single-active" :style="{'background-color': theme.background}"></view>
                                <view v-else class="radio-single"></view>
                            </view>
                        </view>
                    </view>
                    <view class="cash-type-item dir-left-nowrap cross-center" v-if="isBank">
                        <image class="icon" src="/static/image/icon/cash/icon-bank.png"></image>
                        <view class="dir-left-nowrap cross-center box-grow-1 cash-type-box"
                              @click="payTypeChange(`bank`)">
                            <view class="box-grow-1">银联线下打款</view>
                            <view class="box-grow-0">
                                <view v-if="payType === `bank`" class="radio-single-active" :style="{'background-color': theme.background}"></view>
                                <view v-else class="radio-single"></view>
                            </view>
                        </view>
                    </view>
                    <view class="cash-type-item dir-left-nowrap cross-center" v-if="isBalance">
                        <image class="icon" src="/static/image/icon/cash/icon-balance.png"></image>
                        <view class="dir-left-nowrap cross-center box-grow-1 cash-type-box"
                              @click="payTypeChange(`balance`)">
                            <view class="box-grow-1">商城余额</view>
                            <view class="box-grow-0">
                                <view v-if="payType === `balance`" class="radio-single-active" :style="{'background-color': theme.background}"></view>
                                <view v-else class="radio-single"></view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </app-model>
    </view>
</template>

<script>
    import appModel from '../../basic-component/app-model/app-model.vue';

    export default {
        name: "app-cash-model",
        components: {appModel},
        props: {
            title: {
                type: String,
                default() {
                    return '提现方式';
                }
            },
            payType: String,
            /* balance bank alipay wx auto*/
            isAuto: {
                type: Boolean,
                default() {
                    return false
                }
            },
            isWx: {
                type: Boolean,
                default() {
                    return false
                }
            },
            isAlipay: {
                type: Boolean,
                default() {
                    return false
                }
            },
            isBank: {
                type: Boolean,
                default() {
                    return false
                }
            },
            isBalance: {
                type: Boolean,
                default() {
                    return false
                }
            },
            value: {
                type: Boolean,
                default() {
                    return false
                }
            },
            theme: {
                type: Object,
            }
        },
        data() {
            return {
                display: this.value
            }
        },
        watch: {
            value: function (value) {
                this.display = value;
            },
            display: function (value) {
                this.$emit('input', value);
            }
        },
        computed: {},
        methods: {
            payTypeChange(pay_type) {
                // this.payType = pay_type;
                this.$emit('change', pay_type);
                this.display = false;
            },
        }
    }
</script>

<style scoped lang="scss">
    .cash-type-item {
        height: #{120rpx};
        padding-left: #{32rpx};

        > view {
            height: 100%;
        }

        .cash-type-box {
            border-bottom: 1px solid #E2E2E2;
            padding-right: #{32rpx};


            .radio-single {
                width: #{40rpx};
                height: #{40rpx};
                border-radius: 50%;
                background-color: white;
                border: #{1rpx} solid #e2e2e2;
            }

            .radio-single-active {
                width: #{40rpx};
                height: #{40rpx};
                border-radius: 50%;
                background-repeat: repeat;
                background-size: 100% 100%;
                background-image: url("../../../static/image/icon/yes-radio.png");
            }
        }

        .icon {
            height: #{40rpx};
            width: #{40rpx};
            margin-right: #{16rpx};
            display: flex;
            justify-content: center;
        }
    }
</style>