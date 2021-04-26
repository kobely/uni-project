<template>
    <app-layout>
        <view class="login-box">
            <view class="login-null dir-left-nowrap cross-center">
                <view>还没有商家账户？</view>
                <view @click="navApply">
                    <view class="main-center cross-center apply-btn">立即申请</view>
                </view>
            </view>
            <view class="login-bg">
                <image :src="appImg.mch_login_bg"></image>
                <view></view>
            </view>
            <view class="account main-center cross-center">
                <view class="dir-left-nowrap login-form">
                    <view class="box-grow-0 cross-center">账号</view>
                    <input placeholder="请输入账号" placeholder-style="color:#bbbbbb" size="28" type="text"
                           v-model="form.username"/>
                </view>
            </view>
            <view class="password main-center cross-center">
                <view class="dir-left-nowrap login-form cross-center">
                    <view class="box-grow-0 cross-center">密码</view>
                    <input placeholder="请输入密码" placeholder-style="color:#bbbbbb" size="28" type="password"
                           v-model="form.password"/>
                </view>
            </view>
            <view @click="login">
                <view class="main-center cross-center login-dl">
                    <view class="main-center cross-center">登录</view>
                </view>
            </view>
            <view class="dir-top-nowrap main-center cross-center">
                <!-- #ifndef H5 -->
                <view class="spacing main-center cross-center">
                    <view class="line"></view>
                    <view>或</view>
                    <view class="line"></view>
                </view>
                <!-- #endif -->

                <!-- #ifdef MP-WEIXIN -->
                <image :src="appImg.wechat" @click="wxLogin" class="platform-pic"></image>
                <view class="platform-name">微信授权登录</view>
                <!-- #endif -->
	            
                <!-- #ifdef MP-ALIPAY -->
                <image :src="appImg.alipay" @click="wxLogin" class="platform-pic"></image>
                <view class="platform-name">支付宝授权登录</view>
                <!-- #endif -->
	            
                <!-- #ifdef MP-BAIDU -->
                <image :src="appImg.baidu" @click="wxLogin" class="platform-pic"></image>
                <view class="platform-name">百度授权登录</view>
                <!-- #endif -->
	            
                <!-- #ifdef MP-TOUTIAO -->
                <image :src="appImg.byte_dance" @click="wxLogin" class="platform-pic"></image>
                <view class="platform-name">授权登录</view>
                <!-- #endif -->
	            
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "login",
	    
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.plugin.mch.app_image,
            }),
        },
        data() {
            return {
                form: {
                    username: '',
                    password: '',
                }
            }
        },
        onLoad() { this.$commonLoad.onload();
            uni.removeStorage({key: 'MCH2019'});
        },
	    
        methods: {
            navApply() {
                uni.navigateTo({url: `/plugins/mch/apply/apply`});
            },
            login: function () {
                const self = this;
                self.$showLoading({title: '登陆中'});

                self.$request({
                    url: self.$api.mch.login,
                    method: 'POST',
                    data: {
                        username: self.form.username,
                        password: self.form.password,
                    },
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        self.loginSuccess(info.data);
                    } else {
                        uni.showToast({icon: 'none', title: info.msg});
                    }
                }).catch(() => {
                    self.$hideLoading();
                })
            },

            wxLogin: function () {
                const self = this;
                self.$showLoading({title: '登陆中'});

                self.$request({
                    url: self.$api.mch.mch_status,
                    data: {
                        is_review_status: 1,
                    },
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        let mch = info.data.mch;
                        if (mch && mch.review_status == 1) {
                            self.loginSuccess(info.data);
                            return;
                        }
                        uni.showToast({icon: 'none', title: '账户不存在或账户异常'});
                    } else {
                        uni.showToast({icon: 'none', title: info.msg});
                    }
                }).catch(() => {
                    self.$hideLoading();
                });
            },

            loginSuccess(data) {
                uni.showToast({title: '登陆成功'});

                //缓存
                this.$storage.setStorageSync("MCH2019", data);

                //跳转
                uni.redirectTo({
                    url: '/plugins/mch/mch/myshop/myshop'
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .login-box {
        background: #FFFFFF;
        min-height: 100vh;
    }

    .login-null {
        background: #feeeee;
        height: #{80rpx};
        width: 100%;
        color: #ff4544;
        font-size: #{28rpx};

        > view {
            margin-left: #{24rpx};
        }
    }

    .account {
        margin-top: #{88rpx - 24rpx};
    }

    .password {
        margin-top: #{64rpx - 24rpx};
        margin-bottom: #{72rpx}
    }

    .apply-btn {
        height: #{44rpx};
        width: #{162rpx};
        color: #ff4544;
        background: #feeeee;
        border: #{1rpx} solid #ff4544;
        border-radius: #{22rpx};
        font-size: #{28rpx};
        line-height: #{44rpx};
    }

    .login-bg {
        position: relative;
        height: #{300rpx};
        width: 100%;
    }

    .login-bg view {
        position: absolute;
        left: #{200rpx};
        bottom: #{0rpx};
        width: #{0rpx};
        height: #{0rpx};
        border-left: #{24rpx} solid transparent;
        border-right: #{24rpx} solid transparent;
        border-bottom: #{40rpx} solid #ffffff;
    }

    .login-bg image {
        height: 100%;
        width: 100%;
    }

    .input-place {
        color: red;
        font-size: #{28rpx};
    }

    .login-form {
        color: #353535;
        width: #{560rpx};
        border-bottom: 1px solid #e2e2e2;
        padding-bottom: #{24rpx};
    }

    .login-form view {
        color: #bbb;
        font-size: #{28rpx};
        margin-left: #{48rpx};
        margin-right: #{32rpx};
    }

    .login-form input {
        color: #353535;
        font-size: #{28rpx};
        width: 100%;
    }

    .login-dl {
        height: #{80rpx};
        width: 100%;
    }

    .login-dl view {
        width: #{560rpx};
        height: 100%;
        background: #ff4544;
        border-radius: #{40rpx};
        color: #fff;
        font-size: #{32rpx};
    }

    .spacing {
        font-size: #{24rpx};
        margin-top: #{80rpx};
        color: #bbbbbb;

        .line {
            width: #{230rpx};
            height: #{1px};
            margin: 0 #{40rpx};
            background: #e2e2e2;
        }
    }

    .platform-pic {
        height: #{120rpx};
        width: #{120rpx};
        margin-top: #{76rpx};
        margin-bottom: #{32rpx};
    }

    .platform-name {
        color: #bbbbbb;
        font-size: #{28rpx};
    }
</style>