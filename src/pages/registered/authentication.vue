<template>
    <view class="bd-authentication">
        <view class="bd-content dir-top-nowrap cross-center">
            <image src="./image/phone-0.png" class="bd-iphone"></image>
            <text class="bd-iphone-text">
                验证当前手机号：{{userInfo && userInfo.mobile | setIphone}}
            </text>
            <text class="bd-prompt">
                为了您的账户安全，请输入验证码
            </text>
        </view>
        <template v-if="!isPassword">
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
        </template>
        <template v-else>
            <view class="bd-item dir-left-nowrap cross-center">
                <image src="./image/password.png"  class="bd-label box-grow-0"></image>
                <input class="bd-input box-grow-1" v-model="password" placeholder="请输入密码" type="password">
            </view>
        </template>
        <view class="bd-bottom" :class="agree ? 'bd-yes-agree' : 'bd-no-agree'" @click="sign">确认</view>
        <view class="bd-agree-group dir-right-nowrap cross-center" v-if="!isPassword">
            <text class="bd-color"  @click="isPassword = true">手机收不到验证码？</text>
        </view>
    </view>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "authentication",
    data() {
        return {
            pic_captcha: '',
            sms_captcha: '',
            validate_code_id: '',
            type: '',
            password: '',
            imageUrl: '',
            isSend: false,
            timeNum: 60,
            timeIng: 0,
            isPassword: false
        }
    },
    mounted() {
        this.getImageUrl();
    },
    computed: {
        agree: function() {
            if ((this.pic_captcha && this.sms_captcha) || this.password) {
                return true;
            } else {
                return false;
            }
        },
        ...mapState({
            userInfo: state => state.user.info
        })
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
        sign: function() {
            if (!this.agree) return;
            let data = {
                type: this.type,
                validate_code_id: this.validate_code_id,
                password: this.password,
                sms_captcha: this.sms_captcha
            }
            if (this.isPassword) {
                data.type = 'validate_by_password';
                delete data.validate_code_id;
                delete data.sms_captcha;
            } else {
                data.type = 'validate_by_mobile';
                delete data.password;
            }
            this.$request({
                url: this.$api.registered.validate,
                method: "post",
                data: data
            }).then(response => {
                if (response.code === 0) {
                    uni.redirectTo({
                        url: `/pages/registered/verify-phone?key=${response.data.key}`
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
    filters: {
        setIphone(data) {
            return data && data.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
        }
    }
}
</script>

<style scoped>
    .bd-authentication {
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
    .bd-prompt {
        font-size: 26upx;
        color: #999999;
        margin-top:35upx;
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
    .bd-agree-group {
        margin-top: 42upx;
    }
    .bd-color {
        font-size: 28upx;
        color: #ff4544;
    }
</style>