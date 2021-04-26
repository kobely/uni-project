<template>
    <app-layout>
        <view class="web-login">
            <view class="icon"></view>
            <view class="text">即将登录网页端，是否允许登录？</view>
            <view class="main-center">
                <app-button @click="loginSubmit" width="560" height="80" font-size="32" background="#ff4544"
                            color="#FFFFFF" round>确认登录
                </app-button>
            </view>
            <view class="cancel" @click="navIndex">取消</view>
        </view>
    </app-layout>
</template>

<script>
    export default {
        name: "web-login",
        data() {
            return {
                token: '',
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.token = options.token;
            if (!this.token) {
                uni.showModal({
                    title: '提示',
                    content: '无效的Token，请刷新页面后重新扫码登录',
                    showCancel: false,
                    success: function (e) {
                        if (e.confirm) {
                            uni.redirectTo({
                                url: '/pages/index/index',
                            });
                        }
                    }
                });
            }
        },
        methods: {
            navIndex() {
                uni.redirectTo({url: `/pages/index/index`});
            },

            loginSubmit: function () {
                const self = this;
                self.$showLoading({text: '正在处理'});
                self.$request({
                    url: self.$api.mch.qr_code_login,
                    data: {
                        token: self.token,
                    },
                    method: 'post'
                }).then(info => {
                    self.$hideLoading();
                    uni.showModal({
                        title: '提示',
                        content: info.msg,
                        showCancel: false,
                        success: function (e) {
                            if (e.confirm) {
                                uni.redirectTo({url: '/pages/index/index'});
                            }
                        }
                    });
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    .web-login {
        margin: #{150rpx} 0;
        text-align: center;

        .icon {
            width: #{400rpx};
            height: #{300rpx};
            background-image: url("../../image/web-login.png");
            background-repeat: no-repeat;
            background-size: 100% auto;
            margin: 0 auto #{100rpx};
        }

        .text {
            margin-bottom: #{120rpx};
            font-size: #{32rpx};
            color: #666;
        }

        .cancel {
            margin-top: #{60rpx};
            font-size: #{32rpx};
            color: #999999;
        }
    }
</style>