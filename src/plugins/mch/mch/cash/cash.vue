<template>
    <app-layout>
        <view class="cash-head dir-top-nowrap main-center">
            <view class="cash-account">账户剩余金额：{{account_money}}</view>
            <view class="dir-left-nowrap cross-center cash-account-input">
                <view class="box-grow-0 cash-cny">￥</view>
                <view class="box-grow-1 cross-center">
                    <input class="cash-input-account" placeholder="输入提现金额" type="digit"
                           placeholder-style="color:#cdcdcd;font-size:40rpx" v-model="form.cash_money"/>
                </view>
            </view>

            <view class="dir-left-nowrap cross-center cash-type" @click="cashTypeModel = true">
                <view class="box-grow-1">提现方式</view>
                <view class="box-grow-0">{{cashName}}</view>
                <image class="box-grow-0 arrow-image" src="/static/image/icon/arrow-right.png"></image>
            </view>
            <view v-if="pay_type === 'wx'" class="cash-form">
                <view class="dir-left-nowrap cross-center line">
                    <view class="box-grow-0 required">姓名</view>
                    <view class="box-grow-1">
                        <input class="cash-input" placeholder="请输入正确的姓名"
                               placeholder-style="color:#cccccc;font-size:28rpx" v-model="form.nickname"/>
                    </view>
                </view>
                <view class="dir-left-nowrap cross-center no-line">
                    <view class="box-grow-0 required">账号</view>
                    <view class="box-grow-1">
                        <input class="cash-input" placeholder="请输入正确微信账号"
                               placeholder-style="color:#cccccc;font-size:28rpx" v-model="form.account"/>
                    </view>
                </view>
            </view>
            <view v-if="pay_type === 'alipay'" class="cash-form">
                <view class="dir-left-nowrap cross-center line">
                    <view class="box-grow-0 required">姓名</view>
                    <view class="box-grow-1">
                        <input class="cash-input" placeholder="请输入正确的姓名"
                               placeholder-style="color:#cccccc;font-size:28rpx" v-model="form.nickname"/>
                    </view>
                </view>
                <view class="dir-left-nowrap cross-center no-line">
                    <view class="box-grow-0 required">账号</view>
                    <view class="box-grow-1">
                        <input class="cash-input" placeholder="请输入正确支付宝账号"
                               placeholder-style="color:#cccccc;font-size:28rpx" v-model="form.account"/>
                    </view>
                </view>
            </view>
            <view v-if="pay_type === 'bank'" class="cash-form">
                <view class="dir-left-nowrap cross-center line">
                    <view class="box-grow-0 required">开户人</view>
                    <view class="box-grow-1">
                        <input class="cash-input" placeholder="请输入正确的姓名"
                               placeholder-style="color:#cccccc;font-size:28rpx" v-model="form.nickname"/>
                    </view>
                </view>
                <view class="dir-left-nowrap cross-center line">
                    <view class="box-grow-0 required">开户行</view>
                    <view class="box-grow-1">
                        <input class="cash-input" placeholder="请输入正确的银行名称"
                               placeholder-style="color:#cccccc;font-size:28rpx" v-model="form.bank_name"/>
                    </view>
                </view>
                <view class="dir-left-nowrap cross-center no-line">
                    <view class="box-grow-0 required">账号</view>
                    <view class="box-grow-1">
                        <input class="cash-input" placeholder="请输入正确银行卡账号"
                               placeholder-style="color:#cccccc;font-size:28rpx" v-model="form.account"/>
                    </view>
                </view>
            </view>
            <view class="cash-btn main-center">
                <app-button @click="submit" height="80" width="702" background="#FF4544" font-size="32" color="#FFFFFF"
                            round>提交申请
                </app-button>
            </view>

            <app-cash-model
                    :is-auto="is_auto"
                    :is-wx="is_wx"
                    :is-alipay="is_alipay"
                    :is-bank="is_bank"
                    :is-balance="is_balance"
                    :pay-type="pay_type"
                    @change="payTypeChange"
                    v-model="cashTypeModel"
            ></app-cash-model>
        </view>
    </app-layout>
</template>

<script>
    import appCashModel from "../../../../components/page-component/app-cash-model/app-cash-model";

    export default {
        name: "cash",
        components: {appCashModel},
        data() {
            return {
                cashTypeModel: false,
                is_wx: false,
                is_alipay: false,
                is_bank: false,
                is_balance: false,
                is_auto: false,
                form: {
                    cash_money: '',
                    account: '',
                    nickname: '',
                    bank_name: '',
                },
                mch_id: 0,
                pay_type: '',
                account_money: '',
                setting: null,
                template_message_list: null,
            }
        },
        computed: {
            cashName() {
                switch (this.pay_type) {
                    case 'auto':
                        // #ifdef MP-WEIXIN
                        return '微信零钱';
                        // #endif
                        // #ifdef MP-ALIPAY
                        return '支付宝余额';
                        // #endif
                        // #ifndef MP-WEIXIN || MP-ALIPAY
                        return '自动';
                    // #endif
                    case 'wx':
                        return '微信线下打款';
                    case 'alipay':
                        return '支付宝线下打款';
                    case 'bank':
                        return '银联线下打款';
                    case 'balance':
                        return '商城余额';
                    default:
                        return;
                        break;
                }
            },
        },
        onLoad(options) { this.$commonLoad.onload(options);
            const self = this;
            self.mch_id = options.mch_id;
            self.account_money = options.account_money;

            self.$showLoading({text: '正在提交'});
            self.$request({
                url: self.$api.mch.setting,
                data: {
                    mch_id: self.mch_id
                }
            }).then(info => {
                self.$hideLoading();
                if (info.code === 0) {
                    let setting = info.data.setting;
                    [
                        self.setting,
                        self.is_wx,
                        self.is_alipay,
                        self.is_bank,
                        self.is_balance,
                        self.is_auto,
                        self.template_message_list
                    ] = [
                        setting,
                        setting.cash_type.indexOf('wx') !== -1,
                        setting.cash_type.indexOf('alipay') !== -1,
                        setting.cash_type.indexOf('bank') !== -1,
                        setting.cash_type.indexOf('balance') !== -1,
                        setting.cash_type.indexOf('auto') !== -1,
                        info.data.template_message_list,
                    ];
                }
            }).catch(e => {
                self.$hideLoading();
            })
        },
        methods: {
            payTypeChange(value) {
                this.pay_type = value;
            },

            subscribe(callback) {
                this.$subscribe(this.template_message_list).then(res => {
                    callback();
                }).catch(res => {
                    callback();
                });
            },
            submit: function (e) {
                const self = this;
                let form = self.form;
                let pay_type = self.pay_type;
                let cash_max = self.account_money;

                let content = function () {
                    if (!form.cash_money) {
                        return "请输入提现金额";
                    }
                    let cash = parseFloat(parseFloat(form.cash_money).toFixed(2));

                    if (cash > cash_max) {
                        return "提现金额不能超过" + cash_max + "元";
                    }
                    if (cash < 1) {
                        return "提现金额不能低于1元";
                    }
                    if (!pay_type) {
                        return "请选择提现方式";
                    }
                    if (pay_type === 'wx' || pay_type === 'alipay' || pay_type === 'bank') {
                        if (!form.nickname) {
                            return "姓名不能为空";
                        }
                        if (!form.account) {
                            return "账号不能为空";
                        }
                    }
                    if (pay_type === 'bank' && !form.bank_name) {
                        return "开户行不能为空";
                    }
                    if (pay_type === 'balance' || pay_type === 'auto') {
                    }
                    return false;
                }();

                if (content) {
                    uni.showToast({icon: 'none', title: content});
                    return
                }
                self.subscribe(() => {
                    self.$showLoading({text: '正在提交'});
                    self.$request({
                        url: self.$api.mch.cash_submit,
                        method: 'POST',
                        data: {
                            mch_id: self.mch_id,
                            money: form.cash_money,
                            type: self.pay_type,
                            type_data: JSON.stringify(form),
                        }
                    }).then(info => {
                        self.$hideLoading();
                        uni.showModal({
                            title: "提示",
                            content: info.msg,
                            showCancel: false,
                            success: function (e) {
                                if (e.confirm) {
                                    if (info.code === 0) {
                                        uni.redirectTo({url: '/plugins/mch/mch/cash-log/cash-log?mch_id=' + self.mch_id})
                                    }
                                }
                            }
                        });
                    }).catch(e => {
                        self.$hideLoading();
                    })
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .cash-type {
        height: #{120rpx};
        background: white;
        color: #353535;
        font-size: #{32rpx};
        padding: 0 #{24rpx};
        margin-top: #{24rpx};

        .arrow-image {
            width: #{12rpx};
            height: #{24rpx};
            display: block;
            margin-left: #{12rpx};
        }
    }

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
                background-image: url("../../../../static/image/icon/icon-checkbox-checked-a.png");
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

    .cash-head {
        .cash-account {
            height: #{96rpx};
            border-bottom: #{1rpx} solid #e2e2e2;
            padding: 0 #{24rpx};
            line-height: #{96rpx};
            font-size: #{32rpx};
            color: #353535;
            background: #FFFFFF;
        }

        .cash-account-input {
            height: #{160rpx};
            padding: 0 #{24rpx};
            background: #FFFFFF;

            .cash-cny {
                font-size: #{64rpx};
                color: #ff4544;
                line-height: 1;
            }

            .cash-input-account {
                height: #{160rpx};
                color: #353535;
                margin-left: #{24rpx};
                font-size: #{40rpx};
            }
        }
    }

    .cash-process {
        background: #FFFFFF;
        padding: #{32rpx} #{24rpx};
        margin-top: #{20rpx};
        font-size: #{28rpx};
        color: #353535;

        .label {
            padding-bottom: #{32rpx - 24rpx};
        }

        .cash-tx {
            color: #353535;
            margin: 0 -#{24rpx};
        }

        .cash-tx .tx-item {
            margin: 0 #{16rpx};
            margin-top: #{24rpx};
            border: #{1rpx} solid #cdcdcd;
            height: #{68rpx};
            border-radius: #{34rpx};
            width: #{210rpx};
        }

        .tx-item.active {
            border: #{2rpx} solid #ff4544;
        }

        .icon {
            height: #{40rpx};
            width: #{40rpx};
            margin-right: #{16rpx};
            background-size: 100% auto;
            background-repeat: no-repeat;

        }

        .icon.wechat {
            background-image: url("../../../../static/image/icon/cash/icon-wechat.png");
        }

        .icon.alipay {
            background-image: url("../../../../static/image/icon/cash/icon-alipay.png");
        }

        .icon.bank {
            background-image: url("../../../../static/image/icon/cash/icon-bank.png");
        }

        .icon.balance {
            background-image: url("../../../../static/image/icon/cash/icon-balance.png");
        }

        .icon.auto {
            background-image: url("../../../../static/image/icon/cash/icon-auto.png");
        }
    }

    .cash-form {
        margin-top: #{20rpx};
        background: #fff;
        font-size: #{28rpx};

        .line {
            height: #{88rpx};
            margin: 0 #{24rpx};
            border-bottom: 1px solid #ddd;
        }

        .no-line {
            height: #{88rpx};
            margin: 0 #{24rpx};
        }

        .required {
            min-width: #{180rpx - 24rpx - 24rpx};
        }

        .required::before {
            content: '*';
            vertical-align: top;
            color: #ff4544;
        }

        .cash-input {
            height: 100%;
            color: #353535;
            font-size: #{28rpx};
        }
    }

    .cash-btn {
        margin-top: #{40rpx};
    }
</style>