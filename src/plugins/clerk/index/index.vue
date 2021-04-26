<template>
    <app-layout>
        <view class="page">
            <view class='scan dir-left-nowrap main-center'>
                <view class="icon-box" @click="clerk">
                    <image v-if='is_not_wechat' :src='clerkImg.un_qr'></image>
                    <image v-else :src='clerkImg.clerk'></image>
                    <view class="scan-text">扫码核销</view>
                </view>
                <!-- #ifndef MP-BAIDU -->
                <view class="icon-box" v-if="is_scan_code_pay && is_mall" @click="scan">
                    <image :src='clerkImg.scan_code_pay'></image>
                    <view class="scan-text">收款码</view>
                </view>
                <!-- #endif -->
            </view>
            <view class='border-css main-center'>
                <view></view>
            </view>
            <view class='main-between list'>
                <view class='item box-grow-1' @click="toOrder">
                    <image src='./../image/order.png'></image>
                    <view>订单</view>
                </view>
                <view v-if="is_mall" class='item box-grow-1' @click="toCard">
                    <image src='./../image/card.png'></image>
          
                    <view>卡券</view>
                </view>
                <view class='item box-grow-1' @click="toStatic">
                    <image src='./../image/static.png'></image>
                    <view>核销统计</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import * as utils from '../../../core/utils.js';

    import { mapState } from "vuex";

    export default {
        name: "about",
        data() {
            return {
                is_mall: false,
                is_scan_code_pay: false,
                is_not_wechat: false,
            };
        },
        computed: {
            ...mapState({
                clerkImg: state => state.mallConfig.__wxapp_img.clerk,
                mall: state => state.mallConfig.mall
            }),
        },
        onLoad() { this.$commonLoad.onload();
            // #ifdef H5
            this.is_not_wechat = !this.$jwx.isWechat();
            // #endif
            this.getList();
        },
        methods: {
            toStatic() {
                uni.navigateTo({
                    url: '/plugins/clerk/statics/statics'
                });
            },
            toOrder() {
                uni.navigateTo({
                    url: '/plugins/clerk/order/order?status=1'
                });
            },
            toCard() {
                uni.navigateTo({
                    url: '/plugins/clerk/order/order?status=2'
                });
            },
            clerk() {
                let that = this;
                // #ifndef MP-ALIPAY || H5
                uni.scanCode({
                    success(res) {
                        if(res.path) {
                            let path = res.path
                            path = path.split('?');
                            let scene = path[1];
                            let reg = new RegExp("scene=", "g");
                            scene = path[1].replace(reg, "");
                            that.$request({
                                url: that.$api.clerk.qrcode_parameter,
                                data: {
                                    token: scene
                                }
                            }).then(response => {
                                if (response.code === 0) {
                                    let detail = response.data.detail;
                                    let url = '/' + detail.path;
                                    if (detail.data) {
                                        url += '?' + utils.objectToUrlParams(detail.data);
                                    }
                                    uni.redirectTo({
                                        url: url
                                    })
                                    uni.options = null;
                                }
                            });
                        }else {
                            uni.showModal({
                                title: '提示',
                                content: '暂不支持此二维码，请使用应用内扫一扫功能',
                                showCancel: false,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    }
                })
                // #endif
                // #ifdef MP-ALIPAY
                my.ap.navigateToAlipayPage({
                    appCode:'alipayScan',
                    success:(res) => {
                    },
                    fail:(res) => {
                        my.alert({content:'失败：'+JSON.stringify(res)});
                    }
                });
                // #endif
                // #ifdef H5
                if (this.$jwx.isWechat()) {
                    this.$jwx.scanQRCode({
                        success(res) {
                            let path = '';
                            if(res.path) {
                                path = res.path;
                            }
                            if(res.resultStr) {
                                let index = res.resultStr.indexOf('?#')
                                if(index > -1) {
                                    path = res.resultStr.substring(index + 2);
                                }else {
                                    uni.showToast({
                                        title: res.resultStr,
                                        icon: 'none',
                                        duration: 1000
                                    });
                                }
                            }
                            if(!path) {
                                uni.showToast({
                                    title: '无法处理的二维码',
                                    icon: 'none',
                                    duration: 1000
                                });
                                return false;
                            }
                            path = path.split('?');
                            let scene = path[1];
                            let reg = new RegExp("scene=", "g");
                            scene = path[1].replace(reg, "");
                            that.$request({
                                url: that.$api.clerk.qrcode_parameter,
                                data: {
                                    token: scene
                                }
                            }).then(response => {
                                if (response.code === 0) {
                                    let detail = response.data.detail;
                                    let url = '/' + detail.path;
                                    if (detail.data) {
                                        url += '?' + utils.objectToUrlParams(detail.data);
                                    }
                                    uni.navigateTo({
                                        url: url
                                    })
                                    uni.options = null;
                                }
                            });
                        }
                    })
                } else {
                    uni.showToast({
                        title: '暂不支持浏览器点击扫码，请应用扫一扫功能',
                        icon: 'none',
                        duration: 1000
                    });
                }
                // #endif
            },
            scan() {
                uni.redirectTo({
                    url: '/pages/app_admin/payment-code/payment-code?is_clerk_enter=1'
                })
            },
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.clerk.info,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.is_mall = response.data.is_mall;
                        that.is_scan_code_pay = response.data.is_clerk;
                    }else {
                        if(response.msg == '无核销信息权限') {
                            uni.showModal({
                                title: '提示',
                                content: '该帐号无核销权限',
                                showCancel: false,
                                success: function (res) {
                                    uni.redirectTo({
                                        url: '/pages/index/index'
                                    })
                                }
                            });
                        }else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    .page {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: #fff;
    }

    .shop-info {
        margin-top: #{88rpx};
        color: #666666;
        font-size: #{32rpx};
    }

    .shop-info image {
        height: #{40rpx};
        width: #{40rpx};
        margin-right: #{24rpx};
    }

    .scan,.scan button {
        height: #{380rpx};
        width: #{380rpx};
        margin: #{150rpx} auto #{72rpx};
        color: #fff;
        font-size: #{38rpx};
        position: relative;
        z-index: 10;
    }

    .scan image {
        height: #{276rpx};
        width: #{276rpx};
    }

    .icon-box {
        position: relative;
    }

    .scan-text {
        position: absolute;
        width: #{276rpx};
        text-align: center;
        font-size: #{32rpx};
        top: #{160rpx};
        left: 0;
        right: 0;
    }

    .border-css {
        position: absolute;
        top: #{-676rpx};
        height: #{1500rpx};
        width: #{750rpx};
        left: 0;
        overflow: hidden;
    }

    .border-css view {
        position: absolute;
        height: #{1300rpx};
        width: #{1300rpx};
        border-radius: 50%;
        box-shadow: 0 0 #{40rpx} rgb(239, 239, 239);
    }

    .list {
        margin: #{204rpx} auto;
        position: relative;
        z-index: 100;
        width: 100%;
    }

    .item {
        text-align: center;
        color: #353535;
        font-size: #{28rpx};
    }

    .item image {
        width: #{80rpx};
        height: #{80rpx};
        margin-bottom: #{24rpx};
    }
</style>