<template>
    <view class="bd-verify-phone">
        <view class="bd-content dir-top-nowrap cross-center">
            <image src="./image/phone-1.png" class="bd-iphone"></image>
            <text class="bd-iphone-text">
                验证新手机号
            </text>
        </view>
        <view class="bd-item dir-left-nowrap cross-center">
            <image src="./image/earth.png"  class="bd-label box-grow-0"></image>
            <input class="bd-input box-grow-1" value="+86" :disabled="true" type="text">
        </view>
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
        <view class="bd-bottom" :class="agree ? 'bd-yes-agree' : 'bd-no-agree'" @click="confirm">确认</view>
    </view>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "verify-phone",
        data() {
            return {
                mobile: '',
                pic_captcha: '',
                sms_captcha: '',
                validate_code_id: '',
                imageUrl: '',
                isSend: false,
                timeNum: 60,
                timeIng: 0
            }
        },
        mounted() {
            this.getImageUrl();
        },
        computed: {
            agree: function() {
                if (this.pic_captcha && this.sms_captcha && this.mobile) {
                    return true;
                } else {
                    return false;
                }
            },
            ...mapState({
                userInfo: state => state.user.info
            })
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.key = options.key;
        },
        methods: {
            getVerCode: function() {
                this.timeNum = 60;
                this.$request({
                    url: this.$api.registered.sms,
                    method: "post",
                    data: {
                        mobile: this.userInfo.mobile,
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
            confirm: function() {
                if (!this.agree) return;
                let data = {
                    mobile: this.mobile,
                    validate_code_id: this.validate_code_id,
                    key: this.key,
                    sms_captcha: this.sms_captcha
                }
                this.$request({
                    url: this.$api.registered.mobile,
                    method: "post",
                    data: data
                }).then(response => {
                    if (response.code === 0) {

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
    }
</script>

<style scoped>
    .bd-verify-phone {
        min-height: 100vh;
        background: #FFFFFF;
        padding: 46upx 42upx;
    }
    .bd-iphone {
        width: 110upx;
        height: 110upx;
        margin-top: 54upx;
    }
    .bd-iphone-text {
        font-size:32upx;
        font-weight: bold;
        color: #333333;
        margin-top: 60upx;
    }
    .bd-content {
        border-bottom: 2upx solid #f4f4f4;
        padding-bottom: 65upx;
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
</style>