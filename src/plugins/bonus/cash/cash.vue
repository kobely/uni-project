<template>
    <app-layout>
        <view class="info">
            <view class="last">可提现金额：{{captain.total_bonus ? captain.total_bonus : 0}}元</view>
        </view>
        <view>
            <view class="info input-money main-between cross-center">
                <view class="input">
                    <input v-model="moneyInput" type="digit" placeholder-style="color:#cdcdcd"
                           :placeholder="'请输入' + custom_setting.words.cash_money.name">
                    <view :class="[`price`]">￥</view>
                </view>
            </view>
            <view class="about"
                  v-if="config.min_money > 0 || config.cash_service_charge > 0 || config.free_cash_min > 0 || config.free_cash_max > 0">
                <view class="dir-left-nowrap">
                    <view>说明：</view>
                    <view>
                        <view v-if="config.min_money > 0">金额不能少于￥{{config.min_money}}元</view>
                        <view v-if="config.cash_service_charge > 0">提现需要加收{{config.cash_service_charge}}%手续费</view>
                        <view v-if="config.free_cash_max > 0">
                            免手续费提现金额区间为￥{{config.free_cash_min}}~￥{{config.free_cash_max}}
                        </view>
                    </view>
                </view>
            </view>

            <view class="dir-left-nowrap cross-center cash-type" @click="cashTypeModel = true">
                <view class="box-grow-1">提现方式</view>
                <view class="box-grow-0">{{cashName}}</view>
                <image class="box-grow-0 arrow-image" src="/static/image/icon/arrow-right.png"></image>
            </view>

            <view v-if="mark_num==1 || mark_num ==2 || mark_num == 3" class="cash-info">
                <view class="info content">
                    <view class="enter" v-if="mark_num==3">开户人</view>
                    <view class="enter" v-else>姓名</view>
                    <input class="info-input" v-model="name" placeholder="请输入正确的姓名"></input>
                </view>
                <view class="info content" v-if="mark_num==3">
                    <view class="enter">开户行</view>
                    <input class="info-input" v-model="bank_name" placeholder="请输入正确的银行名称"></input>
                </view>
                <view class="info content">
                    <view class="enter">帐号</view>
                    <input class="info-input" v-model="mobile" v-if="mark_num==1" placeholder="请输入正确的微信帐号"></input>
                    <input class="info-input" v-model="mobile" v-if="mark_num==2" placeholder="请输入正确的支付宝帐号"></input>
                    <input class="info-input" v-model="mobile" v-if="mark_num==3" type="number" placeholder="请输入正确的银行卡帐号"></input>
                </view>
            </view>
            <view class="submit">
                <button @click="subscribe">提交申请</button>
            </view>
        </view>
        <view class="bg" v-if="submitOver || warningInfo">
            <view class="dialog">
                <view class="dialog-title">提示</view>
                <view v-if="submitOver">提现申请提交成功</view>
                <view v-if="warningInfo">{{warningInfo}}</view>
                <view @click="toDetail" v-if="submitOver" class="close-button">确认</view>
                <view @click="warningInfo = false" v-if="warningInfo" class="close-button">确认</view>
            </view>
        </view>
        <app-cash-model
                :is-auto="pay_type.auto"
                :is-wx="pay_type.wechat"
                :is-alipay="pay_type.alipay"
                :is-bank="pay_type.bank"
                :is-balance="pay_type.balance"
                :pay-type="cashType"
                @change="payTypeChange"
                v-model="cashTypeModel"
        ></app-cash-model>
    </app-layout>
</template>

<script>
    import appCashModel from "../../../components/page-component/app-cash-model/app-cash-model.vue"
    import {mapState} from "vuex";

    export default {
        data() {
            return {
                cashTypeModel: false,
                visible: false,
                moneyInput: '',
                mark_num: -1,
                captain: {},
                moneyInput: '',
                pay_type: {
                    auto: false,
                    alipay: false,
                    wechat: false,
                    bank: false,
                    balance: false,
                },
                warningInfo: '',
                submitOver: false,
                template_message: [],
                config: [],
                getMoney: null,
                cashType: '',
            }
        },
        components: {
            appCashModel,
        },
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
                if (this.mark_num == -1) {
                    uni.showToast({title: '请选择提现方式', icon: 'none'});
                    return;
                }
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
                    type: 'auto'
                };
                if(that.mark_num == 4) {
                    para.type = 'balance';
                } else if(that.mark_num == 0) {
                    para.type = 'auto';
                } else {
                    para.name = that.name;
                    para.mobile = that.mobile;
                    if (that.mark_num == 1) {
                        para.type = 'wechat';
                    }
                    if (that.mark_num == 2) {
                        para.type = 'alipay';
                    }
                    if (that.mark_num == 3) {
                        para.type = 'bank';
                        para.bank_name = that.bank_name;
                    }
                }
                that.$request({
                    url: that.$api.bonus.cash,
                    data: para,
                    method: 'post'
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.submitOver = true;
                    }else {
                        that.warningInfo = response.msg;
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },

            toDetail() {
                this.submitOver = false;
                uni.redirectTo({
                    url: '/plugins/bonus/cash-detail/cash-detail'
                });
            },

            getStatus() {
                let that = this;
                that.$request({
                    url: that.$api.bonus.status,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.captain = response.data.captain;
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

            setting() {
                let that = this;
                that.$request({
                    url: that.$api.bonus.setting,
                }).then(response=>{
                    that.$hideLoading();
                    that.getStatus();
                    if(response.code == 0) {
                        that.config = response.data.list;
                        that.template_message = response.data.list.template_message_withdraw;
                        for (let i = 0; i < that.config.pay_type.length; i++) {
                            switch (that.config.pay_type[i]) {
                                case "auto":
                                    that.pay_type.auto = true;
                                    //that.mark_num = 0;
                                    break;
                                case "alipay":
                                    that.pay_type.alipay = true;
                                    //that.mark_num = 2;
                                    break;
                                case "wechat":
                                    that.pay_type.wechat = true;
                                    //that.mark_num = 1;
                                    break;
                                case "balance":
                                    that.pay_type.balance = true;
                                    //that.mark_num = 4;
                                    break;
                                case "bank":
                                    that.pay_type.bank = true;
                                    //that.mark_num = 3;
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
                }).catch(response => {
                    that.$hideLoading();
                });
            },
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            if (options.money > 0) {
                that.money = options.money;
            };
            that.setting();
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

    .cash-info {
        margin-top: #{20rpx};
    }

    .info {
        background-color: #fff;
        padding: #{32rpx} #{24rpx};
        border-bottom: #{1rpx} solid #e2e2e2;
        color: #353535;
    }

    .info.input-money {
        border-bottom: 0;
    }

    .info.cash-type {
        margin: #{20rpx} 0;
        padding: #{32rpx} 0;
    }

    .last {
        font-size: #{40rpx};
        margin-bottom: #{15rpx};
    }

    .last-info {
        font-size: #{24rpx};
        color: #666;
    }

    .last-info view {
        float: left;
        height: #{44rpx};
        line-height: #{44rpx};
    }

    .last-info .show-tip {
        color: #666;
        display: inline-block;
        background-color: #fff;
        font-size: #{24rpx};
        padding: 0 #{12rpx};
        height: #{44rpx};
        line-height: #{44rpx};
        border-radius: #{22rpx};
        border: #{1rpx} solid #e2e2e2;
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
        padding: #{32rpx} #{24rpx} #{12rpx};
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
        font-size: #{32rpx};
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
        height: #{300rpx};
        width: #{640rpx};
        margin: 0 auto;
        z-index: 21;
        background-color: #fff;
        border-radius: 10px;
        text-align: center;
        font-size: #{30rpx};
    }

    .dialog-title {
        margin: #{40rpx} auto #{35rpx};
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
        width: 50%;
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

    .bg {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        width: 100%;
        z-index: 20;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .dialog {
        position: fixed;
        top: #{400rpx};
        left: 0;
        right: 0;
        height: #{300rpx};
        width: #{640rpx};
        margin: 0 auto;
        z-index: 21;
        background-color: #fff;
        border-radius: 10px;
        text-align: center;
        font-size: #{30rpx};
    }

    .close-button {
        height: #{88rpx};
        width: #{640rpx};
        border-top: #{1rpx} solid #e2e2e2;
        line-height: #{88rpx};
        color: #ff4544;
        position: absolute;
        bottom: 0;
        left: 0;
    }

    .dialog-title {
        margin: #{40rpx} auto #{35rpx};
    }
    // 经典红
    $classic-red-main-color: #ff4544;
    $classic-red-secondary-color: #f39800;

    // 活力黄
    $vibrant-yellow-main-color: #fcc600;
    $vibrant-yellow-secondary-color: #555555;

    // 浪漫粉
    $romantic-powder-main-color: #ff547b;
    $romantic-powder-secondary-color: #ffe6e8;

    // 流光金
    $streamer-gold-main-color: #ddb766;
    $streamer-gold-secondary-color: #f0ebd8;

    // 优雅紫
    $elegant-purple-main-color: #7783ea;
    $elegant-purple-secondary-color: #e9ebff;

    // 品味红
    $taste-red-main-color: #ff4544;
    $taste-red-secondary-color: #555555;

    // 清醒绿
    $fresh-green-main-color: #63be72;
    $fresh-green-secondary-color: #e1f4e3;

    // 商务蓝
    $business-blue-main-color: #4a90e2;
    $business-blue-secondary-color: #dbe9f9;

    // 纯粹黑
    $pure-black-main-color: #333333;
    $pure-black-secondary-color: #dedede;

    // 热情红
    $passionate-red-main-color: #ff4544;
    $passionate-red-secondary-color: #ffdada;

    .classic-red-border {
      border-color: $classic-red-main-color;
    }

    .vibrant-yellow-border {
      border-color: $vibrant-yellow-main-color;
    }

    .romantic-powder-border {
      border-color: $romantic-powder-main-color;
    }

    .streamer-gold-border {
      border-color: $streamer-gold-main-color;
    }

    .elegant-purple-border {
      border-color: $elegant-purple-main-color;
    }

    .taste-red-border {
      border-color: $taste-red-main-color;
    }

    .fresh-green-border {
      border-color: $fresh-green-main-color;
    }

    .business-blue-border {
      border-color: $business-blue-main-color;
    }

    .pure-black-border {
      border-color: $pure-black-main-color;
    }

    .passionate-red-border {
      border-color: $passionate-red-main-color;
    }
</style>