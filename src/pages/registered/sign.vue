<template>
    <view class="bd-sign">
        <view class="bd-item dir-left-nowrap cross-center">
            <image src="./image/phone.png"  class="bd-label box-grow-0"></image>
            <input class="bd-input box-grow-1" v-model="mobile" placeholder="请输入手机号" type="text">
        </view>
        <template v-if="!isPassword">
            <view class="bd-item dir-left-nowrap cross-center">
                <image src="./image/image.png" class="bd-label box-grow-0"></image>
                <input class="bd-input box-grow-1" v-model="pic_captcha" placeholder="请输入图形验证码" type="text">
                <image :src="imageUrl" @click="getImageUrl" class="bd-image box-grow-0"></image>
            </view>
            <view class="bd-item dir-left-nowrap cross-center">
                <image src="./image/message.png" class="bd-label box-grow-0"></image>
                <input class="bd-input box-grow-1" v-model="captcha" placeholder="请输入短消息验证码" type="text">
                <view  v-if="!isSend" class="bd-btn box-grow-0" @click="getVerCode">获取验证码</view>
                <view v-else class="bd-btn box-grow-0 bd-send" >重新发送{{ timeNum }}S</view>
            </view>
        </template>
        <template v-else>
            <view class="bd-item dir-left-nowrap cross-center">
                <image src="./image/password.png"  class="bd-label box-grow-0"></image>
                <input class="bd-input box-grow-1" v-model="password" placeholder="请输入密码" type="text">
            </view>
        </template>
        <view class="bd-bottom" :class="agree ? 'bd-yes-agree' : 'bd-no-agree'" @click="sign">登入</view>
        <view class="bd-agree-group dir-left-nowrap cross-center main-between" >
            <text class="bd-color" v-if="!isPassword" @click="isPassword = true">密码登入</text>
            <text class="bd-color" v-else @click="isPassword = false">验证码登入</text>
            <text class="bd-color" @click="router('/pages/registered/index')">手机号快速注册</text>
        </view>
        <view class="bd-forget bd-color" v-if="isPassword" @click="routerGo('/pages/registered/forget')">忘记密码？</view>
    </view>
</template>

<script>
export default {
    name: "sign",
    data() {
        return {
            pic_captcha: '',
            mobile: '',
            captcha: '',
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
    onLoad() { this.$commonLoad.onload();
        this.getImageUrl();
        // #ifdef H5
        this.$storage.setStorageSync('platform', 'mobile');
        // #endif
        console.log(bdImage);
    },
    computed: {
        agree: function() {
            if ((this.mobile && this.pic_captcha) || (this.mobile && this.password)) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
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
                    })
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
                mobile: this.mobile,
                validate_code_id: this.validate_code_id,
                captcha: this.captcha,
                password: this.password
            }
            if (this.isPassword) {
                delete data.validate_code_id;
                delete data.captcha;
                data.type = 'username';
            } else {
                data.type = 'mobile';
                delete data.password;
            }
            this.$request({
                url: this.$api.registered.login,
                method: "post",
                data: data
            }).then(response => {
                if (response.code === 0) {
                    this.$storage.setStorageSync('_USER_ACCESS_TOKEN', response.data.access_token);
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
        },
        router(url) {
            uni.redirectTo({
                url
            });
        },
        routerGo(url) {
            uni.navigateTo({
                url
            });
            // uni.
        }
    },
    beforeDestroy() {
        clearInterval(this.timeIng);
    }
}
</script>

<style scoped>
.bd-sign {
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
.bd-color {
    font-size: 28upx;
    color: #ff4544;
}
/deep/ .uni-radio-input {
    width: 35upx;
    height: 35upx;
}
.bd-send {
    color: rgba(255, 69, 68, 0.5);
}

.bd-forget {
    position: fixed;
    bottom: 50upx;
    left: 50%;
    transform: translateX(-50%);
}
</style>