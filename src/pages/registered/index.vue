<template>
    <view class="bd-registered">
        <template>
            <view class="bd-item dir-left-nowrap cross-center">
                <image src="./image/phone.png"  class="bd-label box-grow-0"></image>
                <input class="bd-input box-grow-1" v-model="mobile" placeholder="请输入手机号" type="text">
            </view>
            <view class="bd-item dir-left-nowrap cross-center">
                <image src="./image/image.png" class="bd-label box-grow-0"></image>
                <input class="bd-input box-grow-1" v-model="pic_captcha" placeholder="请输入图形验证码" type="text">
                <image :src="imageUrl" @click="getImageUrl" class="bd-image box-grow-0"></image>
            </view>
            <view class="bd-item dir-left-nowrap cross-center">
                <image src="./image/message.png" class="bd-label box-grow-0"></image>
                <input class="bd-input box-grow-1" v-model="sms_captcha" placeholder="请输入短消息验证码" type="text">
                <view  v-if="!isSend" class="bd-btn box-grow-0" @click="getVerCode">获取验证码</view>
                <view v-else class="bd-btn box-grow-0 bd-send" >重新发送{{ timeNum }}S</view>
            </view>
            <view class="bd-bottom" :class="mobile && pic_captcha && sms_captcha ? 'bd-yes-agree' : 'bd-no-agree'" @click="register">完成</view>
            <view v-if="detail.agreement_name || detail.declare_name" class="bd-agree-group dir-left-nowrap cross-top" >
                <radio @click="agree = !agree" color="#ff4544" :checked="agree"></radio>
                <view class="bd-agree">
                    点击同意即表示您已阅读并同意
                    <text v-if="detail.agreement_name" @click="toRule('agreement')">
                        <text class="bd-color">《{{detail.agreement_name}}》</text>
                    </text>
                    <text v-if="detail.declare_name">与</text>
                    <text @click="toRule('declare')" v-if="detail.declare_name" class="bd-color">《{{detail.declare_name}}》</text>
                </view>
            </view>
        </template>
    </view>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "index",
        data() {
            return {
                pic_captcha: '',
                mobile: '',
                sms_captcha: '',
                validate_code_id: '',
                imageUrl: '',
                agree: false,
                isSend: false,
                timeNum: 60,
                timeIng: 0,
                detail: {
                    agreement_name: '',
                    declare_name: '',
                }
            }
        },
        computed: {
            ...mapGetters({
                getSign: 'user/sign',
            })
        },
        onLoad() { this.$commonLoad.onload();
            this.getDetail();
            this.getImageUrl();
        },
        methods: {
            toRule(string) {
                this.$store.dispatch('user/sign', {
                    mobile: this.mobile,
                    validate_code_id: this.validate_code_id,
                    sms_captcha: this.sms_captcha,
                });
                let title = string == 'agreement' ? this.detail.agreement_name : this.detail.declare_name;
                uni.navigateTo({
                    url: `/pages/rules/index?url=${encodeURIComponent(this.$api.registered.register_data)}&key=` + string + `&title=` + title,
                });
            },
            getDetail: function() {
                this.$request({
                    url: this.$api.registered.register_data,
                }).then(response => {
                    if (response.code === 0) {
                        this.detail = response.data;
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: response.msg
                        });
                    }
                });
            },
            getVerCode: function() {
                this.timeNum = 60;
                this.$request({
                    url: this.$api.registered.sms,
                    method: "post",
                    data: {
                        mobile: this.mobile,
                        pic_captcha: this.pic_captcha
                    }
                }).then(response => {
                   if (response.code === 0) {
                       this.isSend = true;
                       this.validate_code_id = response.data.validate_code_id;
                       this.change();
                   } else {
                       this.getImageUrl();
                       uni.showToast({
                           icon: 'none',
                           title: response.msg
                       });
                   }
                });
            },
            getImageUrl: function() {
                this.$request({
                    url: this.$api.registered.captcha,
                    data: {
                        refresh: true
                    }
                }).then(response => {
                    this.imageUrl = response.url;
                });
            },
            change: function () {
                clearInterval(this.timeIng);
                this.timeIng = setInterval(() => {
                    this.timeNum--;
                    if (this.timeNum === 0) {
                        clearInterval(this.timeIng);
                        this.isSend = false;
                    }
                }, 1000);
            },
            register: function() {
                if(!this.mobile || !this.pic_captcha || !this.sms_captcha) return;
                if (!this.agree && (this.detail.agreement_name || this.detail.declare_name)) {
                    uni.showToast({
                        icon: 'none',
                        title: '请阅读并同意注册协议'
                    })
                    return;
                }
                if(!this.validate_code_id) {
                    uni.showToast({
                        icon: 'none',
                        title: '请先获取验证码'
                    })
                    return;
                }
                this.$request({
                    url: this.$api.registered.register,
                    method: "post",
                    data: {
                        mobile: this.mobile,
                        validate_code_id: this.validate_code_id,
                        sms_captcha: this.sms_captcha
                    }
                }).then(response => {
                    if (response.code === 0) {
                        this.$storage.setStorageSync('_USER_ACCESS_TOKEN', response.data.access_token);
                        this.$store.dispatch('user/sign', {
                            mobile: '',
                            validate_code_id: -1,
                            sms_captcha: '',
                        });
                        this.$event.trigger(this.$const.EVENT_USER_LOGIN);
                        uni.redirectTo({
                            url: '/pages/user-center/user-center'
                        });
                    } else {
                        this.getImageUrl();
                        uni.showToast({
                            icon: 'none',
                            title: response.msg
                        });
                    }
                });
            }
        },
        beforeDestroy() {
            clearInterval(this.timeIng);
        },
        watch: {
            getSign: {
                handler(newVal) {
                    this.validate_code_id = newVal.validate_code_id;
                    this.sms_captcha = newVal.sms_captcha;
                    this.mobile = newVal.mobile;
                },
                immediate: true,
                deep: true
            }
        }
    }
</script>

<style scoped>
    .bd-registered {
        min-height: 100vh;
        background-color: #ffffff;
        padding: 46upx 42upx;

    }
    .bd-item {
        height: 100upx;
        border-bottom: 2upx solid #f4f4f4;
    }
    .bd-label {
        width: 36upx;
        height: 36upx;
        margin: 0 25upx 0 2upx;
    }
    .bd-btn {
        border-left: 1upx solid #f4f4f4;
        width: 226upx;
        height: 53upx;
        line-height: 53upx;
        font-size: 32upx;
        color: #ff4544;
        text-align: center;
    }
    .bd-image {
        width: 160upx;
        height: 67upx;

    }
    .bd-input {
        height: 36upx;
    }
    .bd-bottom {

        height: 88upx;
        line-height: 88upx;
        color: #ffffff;
        font-size: 36upx;
        border-radius: 44upx;
        margin-top: 68upx;
        text-align: center;
    }
    .bd-yes-agree {
        background: rgba(255, 69, 68, 1);
    }
    .bd-no-agree {
        background: rgba(255, 69, 68, 0.5);
    }
    .bd-agree-group {
        margin-top: 42upx;
    }
    .bd-agree {
        color: #999999;
        font-size: 28upx;
        margin-left:13upx;
    }
    .bd-color {
        color: #ff4544;
    }
    /deep/ .uni-radio-input {
        width: 35upx;
        height: 35upx;
    }
    .bd-send {
        color: rgba(255, 69, 68, 0.5);
    }
</style>