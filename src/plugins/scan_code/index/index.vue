<template>
    <app-layout>
        <view>
            <view class="scan-head dir-top-nowrap main-center">
                <view class="order-name">订单金额</view>
                <view class="scan-price dir-left-nowrap cross-bottom" @click="openPriceModel">
                    <view class="order-key">￥</view>
                    <view class="order-value">{{list.price}}</view>
                </view>
                <view class="scan-line"></view>
                <!-- 优惠 -->
                <view class="dir-left-nowrap cross-center scan-offer">
                    <view class="box-grow-1">订单优惠</view>
                    <view class="box-grow-0">
                        <view v-if="list.preferential_money > 0" class="red">
                            -￥{{list.preferential_money}}
                        </view>
                        <view v-else-if="list.price > 0" class="gray">暂无优惠</view>
                    </view>
                </view>

                <!-- 优惠券 -->
                <view class="dir-left-nowrap cross-center scan-offer">
                    <view class="box-grow-1">优惠劵</view>
                    <view class="box-grow-0 coupon-right">
                        <view v-if="list.coupon_id" @click="setCoupon" class="red">
                            -￥{{list.coupon_preferential_money}}
                        </view>
                        <view v-else-if="list.price > 0 && list.can_coupon_num > 0" class="gray"
                              @click="setCoupon">选择优惠券
                        </view>
                        <view v-else-if="list.price > 0" class="gray">暂无可用优惠券</view>
                    </view>
                    <view class="box-grow-0 cross-center">
                        <icon class="icon-right" type></icon>
                    </view>
                </view>
                <!-- 积分抵扣 -->
                <view v-if="list.price > 0 && activity && integral.user_integral_num >= integral.member_integral && list.integral_deduction > 0"
                      class="dir-left-nowrap cross-center scan-offer">
                    <view class="box-grow-1 cross-center dir-left-nowrap">
                        <view>
                            <text>使用{{list.use_integral_num}}积分抵扣</text>
                            <text class="red">{{list.integral_deduction}}</text>
                            <text>元</text>
                        </view>
                        <view @click="getIntegralInfo" class="main-center cross-center">
                            <icon class="scan-integral-icon" type></icon>
                        </view>
                    </view>
                    <view class="box-grow-0" @click="handleUseIntegral">
                        <icon v-if="list.use_integral == 1" class="scan-integral-switch check" type></icon>
                        <icon v-else class="scan-integral-switch uncheck" type></icon>
                    </view>
                </view>

                <!-- 备注 -->
                <view class="dir-left-nowrap scan-offer">
                    <input @input="bindTextBlur" :value="remark" class="scan-input" placeholder="添加备注"/>
                </view>
                <view class="scan-line"></view>
                <view class="scan-remark cross-center dir-left-nowrap main-center">
                    <view class="key">应付金额</view>
                    <view class="value">￥{{list.pay_price}}</view>
                </view>
            </view>

            <view class="main-center cross-center scan-btn">
                <app-button @click="submit"
                            color="#ffffff"
                            font-size="32"
                            height="88"
                            width="702"
                            :background="list.price > 0 ? '#ff4544': '#cdcdcd'"
                            :disabled="list.price <= 0"
                            round>已与店员确认，立即买单
                </app-button>
            </view>
            <view class="scan-end" v-if="activity.rules">
                <view class="dir-left-nowrap cross-center">
                    <view class="icon"></view>
                    <view>规则说明</view>
                </view>
                <text space="nbsp">{{activity.rules}}</text>
            </view>
        </view>

        <!-- MODEL -->
        <view v-if="price_modal" class="scan-modal show bt">
            <view class="scan-modal-bg"></view>
            <view class="scan-modal-pic main-center">
                <view class="info-model cross-center dir-top-nowrap">
                    <view class="order-title">订单金额</view>
                    <view class="info-box dir-left-nowrap cross-center">
                        <input focus class="info-input" @input="setTempInput" :value="tmp_price" type="digit"
                               placeholder-class="place" placeholder="输入支付金额"/>
                        <view>元</view>
                    </view>
                    <view class="info-end dir-left-nowrap cross-center">
                        <view @click="closePriceModel" class="box-grow-1 main-center cross-center">取消</view>
                        <view class="box-grow-0 info-line"></view>
                        <view @click="calcPrice" class="box-grow-1 red main-center cross-center">确认</view>
                    </view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    export default {
        name: "index",
        components: {},
        data() {
            return {
                page_loading: true,
                tmp_price: '',
                clerk_user_id: 0,
                edit_status: true,
                price_modal: false,
                activity: {},
                remark: '',
                integral: {
                    user_integral_num: '0',
                },
                list: {
                    price: '',
                    pay_price: 0.00,
                    use_integral: 0,
                    activity_id: 0,
                    coupon_id: 0,
                    can_coupon_num: 0,
                    integral_explain: [],
                },
                clear: false,
            }
        },
        onShow: function () {
            const self = this;
            const userCoupon = self.$store.state.scanCode.userCoupon;
            if (userCoupon) {
                if (userCoupon == -1) {
                    self.list.coupon_id = 0
                } else {
                    self.list.coupon_id = userCoupon.id;
                }
                self.calcPrice();
            } else {
                self.list.coupon_id = 0
            }
            if (self.clear) {
                [
                    self.edit_status,
                    self.clear,
                    self.remark,
                    self.tmp_price,
                    self.list,
                ] = [
                    true,
                    false,
                    '',
                    '',
                    {
                        price: '',
                        pay_price: 0.00,
                        use_integral: 0,
                        activity_id: 0,
                        coupon_id: 0,
                        can_coupon_num: 0,
                        integral_explain: [],
                    }
                ]
            }
        },

        onLoad(options) { this.$commonLoad.onload(options);
            const self = this;
            self.$store.commit('scanCode/mutSetUserCoupon', 0);
            self.clear = true;

            if (options.clerk_user_id) {
                self.clerk_user_id = options.clerk_user_id;
            }

            if (options.price) {
                [self.edit_status, self.tmp_price,] = [false, options.price];
                self.calcPrice();
            }

            self.$showLoading({text: '加载中'});
            self.$request({
                url: self.$api.scan_code_pay.index
            }).then(info => {
                self.$hideLoading();
                if (info.code === 0) {
                    [
                        self.activity,
                        self.goods,
                        self.integral,
                        self.setting
                    ] = [
                        info.data.activity  ? info.data.activity : {},
                        info.data.goods,
                        info.data.integral,
                        info.data.setting
                    ];
                }
            }).catch(info => {
                self.$hideLoading();
            })
        },
        methods: {
            openPriceModel() {
                if (!this.edit_status) return;
                this.price_modal = true;
            },
            closePriceModel() {
                this.price_modal = false;
            },
            setTempInput: function (e) {
                this.tmp_price = this.money(e.detail.value);
            },
            money(val) {
              let num = val.toString(); //先转换成字符串类型
              if (num.indexOf('.') == 0) { //第一位就是 .
                num = '0' + num
              }
              num = num.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
              num = num.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
              num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
              num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
              if (num.indexOf(".") < 0 && num != "") {
                num = parseFloat(num);
              }

              return +num
            },
            priceChange() {
                if (this.tmp_price > 100000) {
                    this.tmp_price = 100000.00;
                }
            },
            //总价
            calcPrice: function () {
                const self = this;
                self.priceChange();
                self.price_modal = false;
                self.$showLoading({text: '加载中'});

                self.$request({
                    url: self.$api.scan_code_pay.preview,
                    data: {
                        price: self.tmp_price,
                        coupon_id: self.list.coupon_id,
                        use_integral: self.list.use_integral,
                        clerk_user_id: self.clerk_user_id
                    },
                    method: 'POST',
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        [self.list, self.tmp_price] = [info.data, info.data.price];
                    } else {
                        uni.showToast({icon: 'none', title: info.msg});
                    }
                }).catch(info => {
                    self.$hideLoading();
                })
            },

            //UseIntegral
            handleUseIntegral() {
                const self = this;
                let list = self.list;
                list.use_integral = list.use_integral == 1 ? 0 : 1;
                self.calcPrice();
            },

            //Remark
            bindTextBlur: function (e) {
                this.remark = e.detail.value;
            },

            //Integral
            getIntegralInfo: function (e) {
                let content = '';
                this.list.integral_explain.map(v => {
                    content += '消费满' + v.consume_money + '元，';
                    content += '积分最多可抵' + v.integral_deduction + '元';
                    content += '\r\n';
                });
                uni.showModal({
                    title: '积分抵扣说明',
                    content: content.trim(),
                    showCancel: false
                })
            },

            //navigate
            setCoupon: function (e) {
                this.clear = false;
                uni.navigateTo({
                    url: '/plugins/scan_code/index/coupon?price=' + this.list.price + '&coupon_id=' + this.list.coupon_id,
                });
            },

            submit: function (e) {
                const self = this;
                if (!self.list.price) return

                self.$showLoading({text: '正在提交'});
                self.$request({
                    url: self.$api.scan_code_pay.submit,
                    method: 'post',
                    data: {
                        price: self.list.price,
                        coupon_id: self.list.coupon_id,
                        use_integral: self.list.use_integral,
                        remark: self.remark,
                        clerk_user_id: self.clerk_user_id
                    },
                }).then(e => {
                    self.$hideLoading();
                    if (e.code === 0) {
                        self.$payment.pay(e.data.pay_id).then(payMsg => {
                            self.$store.commit('scanCode/mutSetUserCoupon', '');
                            // 支付成功
                            uni.showModal({
                                title: '提示',
                                content: "支付成功",
                                showCancel: false,
                                success() {
                                    uni.navigateTo({
                                        url: '/pages/order-submit/pay-result?payment_order_union_id=' + e.data.pay_id + '&plugin=scan_code_pay'
                                    })
                                    self.clear = true;
                                },
                            });
                        }).catch(payMsg => {
                            // 支付失败
                            self.$showLoading({text: '取消中'});
                            self.$request({
                                url: self.$api.scan_code_pay.cancel,
                                data: {
                                    pay_id: e.data.pay_id,
                                },
                                method: 'POST',
                            }).then(info => {
                                self.$hideLoading();
                            }).catch(info => {
                                self.$hideLoading();
                                uni.showModal({title: '提示', content: info.msg});
                            })
                        });
                    } else {
                        uni.showModal({title: '提示', content: info.msg});
                    }
                }).catch(e => {
                    self.$hideLoading();
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .red {
        color: #ff4544;
    }

    .gray {
        color: #999999;
    }

    .scan-head {
        margin: #{20rpx} #{24rpx} 0 #{24rpx};
        background: #fff;
        border-radius: #{16rpx};
        padding: #{48rpx} #{40rpx} 0 #{40rpx};
        font-size: #{28rpx};
        color: #353535;

        .scan-line {
            height: 1px;
            margin-top: #{38rpx};
            background: #e2e2e2;
        }

        .scan-price {
            margin-top: #{32rpx};

            .order-key {
                font-size: #{50rpx};
            }

            .order-value {
                font-size: #{80rpx};
                padding-left: #{28rpx};
                height: #{98rpx};
            }
        }
    }

    .scan-offer {
        color: #666666;
        font-size: #{28rpx};
        margin-top: #{40rpx};

        .coupon-right {
            padding-right: #{12rpx};
        }

        .icon-right {
            background-size: 100% auto;
            background-repeat: no-repeat;
            background-image: url("../../../static/image/icon/arrow-right.png");
            width: #{12rpx};
            height: #{22rpx};
        }
    }

    .scan-integral-icon {
        height: #{36rpx};
        width: #{36rpx};
        background-image: url("../../../static/image/icon/warning.png");
        background-repeat: no-repeat;
        background-size: 100% auto;
        margin-left: #{20rpx};
    }

    .scan-integral-switch {
        width: #{44rpx};
        height: #{44rpx};
        background-size: 100% auto;
        background-repeat: no-repeat;
        float: left;

    }

    .scan-integral-switch.check {
        margin-left: #{5rpx};
        background-image: url("../../../static/image/icon/icon-checkbox-checked-a.png");
    }

    .scan-integral-switch.uncheck {
        margin-left: #{5rpx};
        background-image: url("../../../static/image/icon/icon-uncheck.png");
    }

    .scan-input {
        width: 100%;
        font-size: #{28rpx};
        color: #666;
    }

    .scan-remark {
        height: #{106rpx};

        .key {
            margin-left: auto;
            color: #353535;
            font-size: #{28rpx};
        }

        .value {
            margin-left: #{10rpx};
            color: #ff4544;
            font-size: #{36rpx};
        }
    }

    .scan-end {
        color: #666;
        background: #fff;
        margin: 0 #{24rpx};
        font-size: #{28rpx};
        border-radius: #{16rpx};
        padding: #{40rpx};

        text {
            word-break: break-all;
            text-align: justify;
        }
    }

    .scan-end > view {
        margin-bottom: #{12rpx};
    }

    .scan-end .icon {
        height: #{26rpx};
        width: #{8rpx};
        border-radius: #{4rpx};
        background: #ff4544;
        margin-right: #{16rpx};
    }

    .scan-btn {
        margin: #{40rpx} auto;
    }

    .scan-modal {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 2001;
        transition: 200ms;
    }

    .scan-modal.show {
        visibility: visible;
        opacity: 1;
    }

    .scan-modal.bt {
        -webkit-animation-name: fadeIn; /*动画名称*/
        -webkit-animation-duration: 0.25s; /*动画持续时间*/
        -webkit-animation-iteration-count: 1; /*动画次数*/
        -webkit-animation-delay: 0s; /*延迟时间*/
    }

    .scan-modal .scan-modal-bg {
        background: rgba(0, 0, 0, 0.8);
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    .scan-modal .scan-modal-pic {
        position: fixed;
        left: 0;
        top: #{188rpx};
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    .scan-modal .scan-modal-close image {
        width: #{50rpx};
        height: #{50rpx};
        margin-top: #{50rpx};
    }

    .scan-modal .info-model {
        height: #{360rpx};
        width: #{620rpx};
        background: #fff;
        border-radius: #{16rpx};
    }

    .scan-modal .order-title {
        margin: #{48rpx} 0
    }

    .scan-modal .place {
        color: #cdcdcd
    }

    .scan-modal .info-box {
        height: #{88rpx};
        width: #{400rpx};
        margin-bottom: #{48rpx};
        border-radius: #{8rpx};
        padding: 0 #{24rpx};
        border: 1px solid #e2e2e2;
    }

    .scan-modal .info-input {
        font-size: #{32rpx};
        color: #353535;
    }

    .scan-modal .info-line {
        height: #{32rpx} !important;
        width: 1px !important;
        background: #e2e2e2;
    }

    .scan-modal .info-end {
        color: #666666;
        height: #{88rpx};
        font-size: #{32rpx};
        border-top: #{1rpx} solid #e2e2e2;
        width: 100%;
    }

    .scan-modal .info-end view {
        height: 100%;
        width: 100%;
    }

</style>