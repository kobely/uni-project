<template>
    <view class="bg">
        <app-layout :haveBackground="haveBackground">
            <view v-if="!is_success" class="bd-password">
                <view v-if="userInfo && userInfo.is_pay_password" class="bd-item dir-left-nowrap cross-center" v-else>
                    <image src="./image/password.png"  class="bd-label box-grow-0"></image>
                    <input maxlength="6" class="bd-input box-grow-1" v-model="old_pay_password" placeholder="请输入旧密码" :password="isPassword" type="number">
                </view>
                <view class="bd-item dir-left-nowrap cross-center">
                    <image src="./image/password.png"  class="bd-label box-grow-0"></image>
                    <input maxlength="6" class="bd-input box-grow-1" v-model="pay_password" :password="isPassword" :placeholder="userInfo && userInfo.is_pay_password ? '请输入新密码' : '请输入密码'" type="number">
                </view>
                <view class="bd-item dir-left-nowrap cross-center">
                    <image src="./image/password.png"  class="bd-label box-grow-0"></image>
                    <input maxlength="6" class="bd-input box-grow-1" v-model="verify_pay_password" :password="isPassword" :placeholder="userInfo && userInfo.is_pay_password ? '请确认新密码' : '请确认密码'" type="number">
                </view>
                <view 
                    class="bd-bottom"
                    :class="inputPass ? 'bd-yes-agree' : 'bd-no-agree'" @click="modify">
                    确认
                </view>
                <view v-if="userInfo && userInfo.is_pay_password && mall.setting.current_customer_service.qrcode_url" @click="toForget" class="forget">若忘记旧密码请<text style="color: #ff4544;">联系商城客服</text>重置</view>
            </view>
            <view v-else class="pass-view dir-top-nowrap main-center">
                <image class="pass-icon" src="./image/pass.png"></image>
                <view>余额支付密码设置成功，请务必牢记该密码</view>
                <view @click="toIndex" class="bd-bottom bd-yes-agree">回商城逛逛</view>
            </view>
        </app-layout>
    </view>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
    name: "password",
    data() {
        return {
            is_success: false,
            old_pay_password: '',
            pay_password: '',
            verify_pay_password: '',
            haveBackground: false,
            isPassword: false
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.info,
            mall: state => state.mallConfig.mall
        }),
        inputPass() {
            if(this.userInfo && this.userInfo.is_pay_password) {
                return this.old_pay_password.length + this.pay_password.length + this.verify_pay_password.length == 18 ? true : false
            }else {
                return this.pay_password.length + this.verify_pay_password.length == 12 ? true : false
            }
        },
    },
    onLoad() {
        const self = this;
        self.$request({
            url: self.$api.balance.index,
        }).then(info => {
            if (info.code === 0) {
                if(info.data.setting.is_pay_password == 0) {
                    uni.showToast({
                        icon: 'none',
                        title: '支付密码功能未开启'
                    })
                    setTimeout(()=>{
                        uni.navigateBack();
                    },1000)
                }
            }
        });
        // #ifdef MP-WEIXIN || MP-BAIDU
        this.isPassword = true;
        // #endif
    },
    methods: {
        toForget() {
            uni.navigateTo({
                url: '/pages/balance/forget'
            });
        },
        toIndex() {
            uni.reLaunch({
                url:'/pages/index/index'
            })
        },
        modify: function() {
            if(this.inputPass) {
                this.verify_pay_password = this.verify_pay_password.trim();
                this.pay_password = this.pay_password.trim();
                this.old_pay_password = this.old_pay_password.trim();
                if (this.pay_password === this.verify_pay_password) {
                    this.$showLoading({
                        type: 'global',
                        text: '设置中...'
                    });
                    let data = {
                        pay_password: this.pay_password,
                        verify_pay_password: this.verify_pay_password,
                    }
                    if(this.userInfo.is_pay_password) {
                        data.old_pay_password = this.old_pay_password;
                    }
                    this.$request({
                        url: this.userInfo.is_pay_password ? this.$api.member.update_password : this.$api.member.set_password,
                        method: "post",
                        data: data
                    }).then(response => {
                        this.$hideLoading();
                        if (response.code === 0) {
                            this.is_success = true;
                            this.$store.dispatch('user/refresh');
                            uni.showToast({
                                title: response.msg,
                                type: 'success'
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
                      title: '两次输入的密码不一致'
                  })
                }
            }
        },
    }
}
</script>

<style scoped>
.forget {
    position: absolute;
    bottom: 28upx;
    width: 100%;
    left: 0;
    text-align: center;
    color: #999;
    font-size: 28upx;
    height: 94upx;
    line-height: 94upx;
}
.bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
}
.pass-view {
    font-size: 28upx;
    color: #999999;
    text-align: center;
    background-color: #ffffff;
}
.pass-view .bd-bottom {
    width: 354upx;
    font-size: 28upx;
    margin: 68upx auto;
}
.pass-icon {
    width: 228upx;
    height: 228upx;
    display: block;
    margin: 100upx auto 80upx;
}
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
    height: 100%;
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