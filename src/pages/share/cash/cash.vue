<template>
    <app-layout>
        <view class="info">
            <view class="last">账户剩余金额：{{money}}元</view>
            <view class="last-info">
                <view v-if="config.cash_max_day > -1">
                    <view v-if="config.surplusCash > 0">今日剩余{{custom_setting.words.cash_money.name}}<span class="surplus">{{config.surplusCash?config.surplusCash:config.cash_max_day}}元</span></view>
                    <view v-else>今日{{custom_setting.words.cash_money.name}}已用尽</view>
                </view>
                <view v-else>今日{{custom_setting.words.cash_money.name}}无限制</view>
                <view @click="visible = !visible">
                    <button class="show-tip">规则</button>
                </view>
            </view>
        </view>
        <view>
            <view class="info input-money main-between cross-center">
                <view class="input">
                    <input v-model="moneyInput" type="digit" placeholder-style="color:#cdcdcd"
                           :placeholder="'请输入' + custom_setting.words.cash_money.name"/>
                    <view class="price">￥</view>
                </view>
                <view @click="getMoney" class="all">全部</view>
            </view>
            <view class="about" v-if="config.min_money > 0 && config.cash_service_charge > 0">
                <view v-if="config.min_money > 0">{{custom_setting.words.cash_money.name}}不能小于{{config.min_money}}元
                </view>
                <view v-if="config.cash_service_charge > 0">
                    {{custom_setting.words.cash.name}}需要加收{{config.cash_service_charge}}%手续费
                </view>
            </view>

            <view class="dir-left-nowrap cross-center cash-type" @click="cashTypeModel = true">
                <view class="box-grow-1">{{custom_setting.words.cash_type.name}}</view>
                <view class="box-grow-0">{{cashName}}</view>
                <image class="box-grow-0 arrow-image" src="/static/image/icon/arrow-right.png"></image>
            </view>
            <view class="cash-info" v-if="mark_num === 1 || mark_num === 2 || mark_num === 3">
                <view class="info content">
                    <view class="enter" v-if="mark_num === 3">开户人</view>
                    <view class="enter" v-else>姓名</view>
                    <input placeholder-style="color:#cdcdcd" class="info-input" v-model="name" placeholder="请输入正确的姓名"/>
                </view>
                <view class="info content" v-if="mark_num === 3">
                    <view class="enter">开户行</view>
                    <input placeholder-style="color:#cdcdcd" class="info-input" v-model="bank_name"
                           placeholder="请输入正确的银行名称"/>
                </view>
                <view class="info content">
                    <view class="enter">帐号</view>
                    <input placeholder-style="color:#cdcdcd" class="info-input" v-model="mobile" v-if="mark_num === 1"
                           placeholder="请输入正确的微信帐号"/>
                    <input placeholder-style="color:#cdcdcd" class="info-input" v-model="mobile"
                           v-else-if="mark_num === 2"
                           placeholder="请输入正确的支付宝帐号"/>
                    <input placeholder-style="color:#cdcdcd" class="info-input" v-model="mobile"
                           v-else-if="mark_num === 3"
                           type="number" placeholder="请输入正确的银行卡帐号"/>
                </view>
            </view>
            <view class="submit">
                <button @click="subscribe" >提交申请</button>
            </view>
        </view>
        <app-cash-model
                :title="custom_setting.words.cash_type.name"
                :is-auto="pay_type.auto"
                :is-wx="pay_type.wechat"
                :is-alipay="pay_type.alipay"
                :is-bank="pay_type.bank"
                :is-balance="pay_type.balance"
                :pay-type="cashType"
                @change="payTypeChange"
                v-model="cashTypeModel"
        ></app-cash-model>
        <view class="bg" v-if="visible">
            <view class="dialog">
                <view class="dialog-title">提示</view>
                <view class="dialog-msg">
                    今日剩余{{custom_setting.words.cash_money.name}}=平台每日可{{custom_setting.words.cash_money.name}}-今日所有用户{{custom_setting.words.cash_money.name}}
                </view>
                <view class="dialog-btn main-center">
                    <view class="dialog-submit" @click="visible= false">我知道了</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapState} from "vuex";
    import appCashModel from "../../../components/page-component/app-cash-model/app-cash-model";

    export default {
        data() {
            return {
                visible: false,
                mark_num: -1,
                money: 0,
                name: '',
                bank_name: '',
                mobile: '',
                moneyInput: '',
                pay_type: {
                    auto: false,
                    alipay: false,
                    wechat: false,
                    bank: false,
                    balance: false,
                },
                config: [],
                template_message: [],
                cashTypeModel: false,
                cashType: '',
                loading: false,
            }
        },
        components: {appCashModel,},
        computed: {
            ...mapState({
                mall: state => state.mallConfig.mall,
                custom_setting: state => state.mallConfig.share_setting_custom,
                share_setting: state => state.mallConfig.share_setting,
            }),
            cashName() {
                switch (this.cashType) {
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
        methods: {
            getMoney() {
                let money = this.config.surplusCash ? this.config.surplusCash : this.config.cash_max_day;
                if (+money < +this.money && +money > -1) {
                    this.moneyInput = +money;
                } else {
                    this.moneyInput = +this.money;
                }
            },

            payTypeChange(value) {
                this.cashType = value;
                switch (value) {
                    case 'auto':
                        this.mark_num = 0;
                        break;
                    case 'wx':
                        this.mark_num = 1;
                        break;
                    case 'alipay':
                        this.mark_num = 2;
                        break;
                    case 'bank':
                        this.mark_num = 3;
                        break;
                    case 'balance':
                        this.mark_num = 4;
                        break;
                    default:
                        this.mark_num = -1;
                        break;
                }
            },

            subscribe() {
                if (this.mark_num === -1) {
                    uni.showToast({title: '请选择提现方式', icon: 'none'});
                    return;
                }
                if(this.loading) {
                    return false
                }
                this.loading = true;
                this.$subscribe(this.template_message).then(res => {
                    this.submit();
                }).catch(res => {
                    this.submit();
                });
            },
            submit() {
                let that = this;
                let para = {
                    price: that.moneyInput,
                    type: 'auto',
                };
                uni.showLoading({
                    title: '申请中'
                })

                if (that.mark_num === 4) {
                    para.type = 'balance';
                } else if (that.mark_num === 0) {
                    para.type = 'auto';
                } else {
                    para.name = that.name;
                    para.mobile = that.mobile;
                    switch (that.mark_num) {
                        case 1:
                            para.type = 'wechat';
                            break;
                        case 2:
                            para.type = 'alipay';
                            break;
                        case 3:
                            para.type = 'bank';
                            para.bank_name = that.bank_name;
                            break;
                    }
                }
                that.$request({
                    url: that.$api.share.cash,
                    data: para,
                    method: 'post',
                }).then(response=>{
                    this.loading = false;
                    uni.hideLoading();
                    if(response.code === 0) {
                        uni.showToast({
                            title: response.msg,
                            duration: 1000
                        });
                        setTimeout(() => {
                            uni.redirectTo({
                                url: '/pages/share/cash-detail/cash-detail'
                            });
                        }, 1000);
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    this.loading = false;
                    uni.hideLoading();
                });
            },

            setting() {
                let that = this;
                that.$request({
                    url: that.$api.share.setting,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code === 0) {
                        that.config = response.msg.config;
                        that.template_message = response.msg.template_message
                        for (let i = 0; i < that.config.pay_type.length; i++) {
                            switch (that.config.pay_type[i]) {
                                case 'auto':
                                    that.pay_type.auto = true;
                                    break;
                                case 'alipay':
                                    that.pay_type.alipay = true;
                                    break;
                                case 'wechat':
                                    that.pay_type.wechat = true;
                                    break;
                                case 'balance':
                                    that.pay_type.balance = true;
                                    break;
                                case 'bank':
                                    that.pay_type.bank = true;
                                    break;
                            }
                        }
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
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            if (options.money > 0) {
                that.money = options.money;
            }
            that.setting();
            uni.setNavigationBarTitle({
                title: that.custom_setting.menus.cash.name,
            });
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

    .surplus {
        margin: 0 #{5rpx};
    }

    .button-space {
        height: #{120rpx};
    }

    .cash-info {
        margin-top: #{20rpx};
        margin-bottom: #{120rpx};
    }

    .cash-info .info.content:last-of-type {
        border-bottom: 0;
    }

    .info.cash-type {
        margin-bottom: #{20rpx};
        padding: #{32rpx} 0;
        border-bottom: 0;
    }

    .info {
        background-color: #fff;
        padding: #{32rpx} #{24rpx};
        border-bottom: #{1rpx} solid #e2e2e2;
        color: #353535;
    }

    .info.input-money {
        border-bottom: 0;
        width: 100%;
    }

    .last {
        font-size: #{40rpx};
        margin-bottom: #{15rpx};
    }

    .last-info {
        font-size: #{24rpx};
        color: #666;
        height: #{44rpx};
    }

    .last-info view {
        float: left;
        height: #{44rpx};
        line-height: #{44rpx};
    }

    .last-info .show-tip {
        display: inline-block;
        background-color: #fff;
        font-size: #{24rpx};
        padding: 0 #{12rpx};
        height: #{44rpx};
        line-height: #{44rpx};
        border-radius: #{22rpx};
        border: #{1rpx} solid #ff4544;
        color: #ff4544;
        margin-left: #{5rpx};
    }

    .last-info button::after {
        border: 0;
    }

    .price {
        height: #{80rpx};
        line-height: #{80rpx};
        font-size: #{46rpx};
        position: absolute;
        left: 0;
        top: 0;
        color: #ff4544;
    }

    .all {
        color: #666;
    }

    .input {
        font-size: #{36rpx};
        height: #{80rpx};
        line-height: #{80rpx};
        width: 70%;
        padding-left: #{50rpx};
        position: relative;
    }

    .input input {
        height: #{80rpx};
        line-height: #{80rpx};
    }

    .about {
        font-size: #{24rpx};
        padding: #{32rpx} #{24rpx} #{32rpx - 24rpx} #{24rpx};
        color: #666;
    }

    .icon {
        height: #{40rpx};
        width: #{40rpx};
        margin-right: #{16rpx};
        display: flex;
        justify-content: center;
    }

    .mode-item {
        width: #{200rpx};
        border: #{1rpx} solid #999;
        text-align: center;
        padding: 0 #{24rpx};
        height: #{66rpx};
        line-height: #{66rpx};
        border-radius: #{33rpx};
        display: flex;
        align-items: center;
        margin: #{10rpx} #{24rpx};
        font-size: #{30rpx};
        position: relative;
    }

    .mode-title {
        margin-bottom: #{25rpx};
        padding-left: #{24rpx};
        font-size: #{34rpx};
    }

    .enter {
        color: #353535;
        float: left;
        width: #{100rpx};
        height: #{56rpx};
        line-height: #{56rpx};
        font-size: #{32rpx};
    }

    .content {
        height: #{120rpx};
    }

    .info-input {
        font-size: #{32rpx};
        height: #{56rpx};
        padding: 0 #{32rpx};
    }


    .on-active {
        height: #{32rpx};
        width: #{32rpx};
        position: absolute;
        right: 0;
        bottom: 0;
    }

    .submit {
        margin-top: #{40rpx};
    }

    .submit button {
        height: #{80rpx};
        border-radius: #{40rpx};
        line-height: #{80rpx};
        width: 90%;
        margin: 0 auto;
        color: #fff;
        font-size: 16px;
        background-color: #ff4544;
    }

    .bg {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, .3);
        z-index: 10;
    }

    .dialog {
        position: fixed;
        top: #{400rpx};
        left: 0;
        right: 0;
        height: #{330rpx};
        width: #{640rpx};
        margin: 0 auto;
        z-index: 21;
        background-color: #fff;
        border-radius: #{20rpx};
        text-align: center;
        font-size: #{30rpx};
    }

    .dialog-title {
        margin: #{40rpx} auto #{35rpx};
    }

    .dialog-msg {
        margin: #{48rpx};
        margin-top: 0;
    }

    .dialog-btn {
        height: #{88rpx};
        width: #{640rpx};
        border-top: #{1rpx} solid #e2e2e2;
        line-height: #{88rpx};
        position: absolute;
        bottom: 0;
        left: 0;
    }

    .dialog-close,.dialog-submit {
        width: 100%;
    }

    .line {
        height: #{44rpx};
        margin-top: #{22rpx};
        width: #{1rpx};
        background-color: #e2e2e2;
    }

    .dialog-submit {
        color: #ff4544;
    }
</style>