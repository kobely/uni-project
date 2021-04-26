<template>
    <view class="bd-password">
        <template v-if="isPhone">
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
        </template>
        <view class="bd-item dir-left-nowrap cross-center" v-else>
            <image src="./image/password.png"  class="bd-label box-grow-0"></image>
            <input  class="bd-input box-grow-1" v-model="old_password" placeholder="请输入旧密码" type="password">
        </view>
        <view class="bd-item dir-left-nowrap cross-center">
            <image src="./image/password.png"  class="bd-label box-grow-0"></image>
            <input  class="bd-input box-grow-1" v-model="new_password" placeholder="请输入新密码" type="password">
        </view>
        <view class="bd-item dir-left-nowrap cross-center">
            <image src="./image/password.png"  class="bd-label box-grow-0"></image>
            <input  class="bd-input box-grow-1" v-model="again_password" placeholder="请确认新密码" type="password">
        </view>
        <view
            class="bd-bottom"
            :class="1 ? 'bd-yes-agree' : 'bd-no-agree'" @click="modify">
            确认
        </view>
         <view class="bd-agree-group dir-right-nowrap cross-center" v-if="!isPhone">
            <text class="bd-color"  @click="isPhone = true">使用绑定手机验证修改密码</text>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: "password",
    data() {
        return {
            old_password: '',
            new_password: '',
            again_password: '',
            imageUrl: '',
            isPhone: false,
            sms_captcha: '',
            timeNum: 60,
            timeIng: 0,
            pic_captcha:'',
            validate_code_id: '',
            isSend: false,
            mobile: ''
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.info
        })
    },
    methods: {
        modify: function() {
            this.again_password = this.again_password.trim();
            this.new_password = this.new_password.trim();
            if (this.new_password === this.again_password) {
                let data = {
                    old_password: this.old_password,
                    new_password: this.new_password,
                    again_password: this.again_password,
                    validate_code_id: this.validate_code_id,
                    sms_captcha: this.sms_captcha,
                    mobile: this.mobile,
                    type: ''
                }
                if (this.isPhone) {
                    delete data.old_password;
                    data.type = 'u_mobile_password';
                } else {
                    delete data.sms_captcha;
                    delete data.mobile;
                    delete data.validate_code_id;
                    data.type = 'u_password';
                }
                this.$request({
                    url: this.$api.registered.password,
                    method: "post",
                    data: data
                }).then(response => {
                    if (response.code === 0) {
                        this.$store.dispatch('user/refreshInfo');
                        this.$storage.removeStorageSync('_USER_ACCESS_TOKEN');
                        uni.navigateTo({
                            url: '/pages/registered/sign'
                        });
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: response.msg
                        });
                    }
                });
            } else {
              uni.showToast({
                  icon: 'none',
                  title: '两次密码不统一'
              })
            }
        },
        getVerCode() {
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
        getImageUrl: function() {
            this.$request({
                url: this.$api.registered.captcha,
                data: {
                    refresh: true
                }
            }).then(response => {
                this.imageUrl = response.url;
            });
        }
    },
    mounted() {
        this.getImageUrl();
    }
}
</script>

<style scoped>
.bd-password {
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
.bd-input {
    height: 36upx;
}

    .bd-image {
        width: 160upx;
        height: 67upx;
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

    .bd-btn {
        border-left: 1upx solid #f4f4f4;
        width: 226upx;
        height: 53upx;
        line-height: 53upx;
        font-size: 32upx;
        color: #ff4544;
        text-align: center;
    }
</style>