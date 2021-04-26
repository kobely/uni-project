<template>
    <app-layout>
        <view v-if="setting.cs_wechat_qrcode" class="dir-top-nowrap cross-center">
            <view class="cs-wechat">客服微信</view>
            <view class="cs-box dir-top-nowrap cross-center">
                <image class="box-grow-0" :src="setting.cs_wechat_qrcode" load-lazy></image>
                <view class="box-grow-0 cs-wechat-name" v-if="setting.cs_wechat">微信号：{{setting.cs_wechat}}</view>
                <view class="box-grow-0 dir-left-nowrap cross-center end">
                    <view @click="save(setting.cs_wechat_qrcode)" class="btn">保存客服二维码图片</view>
                    <view v-if="setting.cs_wechat" @click="copy" class="btn">复制客服微信号</view>
                </view>
            </view>
        </view>
        <view v-if="setting.cs_wechat_flock_qrcode" class="dir-top-nowrap cross-center bottom">
            <view class="cs-wechat">微信群</view>
            <view class="cs-box dir-top-nowrap cross-center">
                <image :src="setting.cs_wechat_flock_qrcode" class="box-grow-0" load-lazy></image>
                <view class="box-grow-0 dir-left-nowrap cross-center end">
                    <view @click="save(setting.cs_wechat_flock_qrcode)" class="btn">保存群二维码图片</view>
                </view>
            </view>
        </view>
    </app-layout>

</template>

<script>
    export default {
        name: "qrcode",
        components: {},
        data() {
            return {
                setting: {},
            }
        },
        onLoad() { this.$commonLoad.onload();
            const self = this;
            self.$request({
                url: self.$api.lottery.setting,
            }).then(info => {
                if (info.code === 0) {
                    self.setting = info.data.setting;
                }
            }).catch(e => {
                // 网络请求出错
            })
        },
        methods: {
            save(url) {
                const self = this;

                // #ifndef MP-ALIPAY
                uni.showLoading({title: `图片保存中`});
                uni.downloadFile({
                    url,
                    success: function (e) {
                        uni.saveImageToPhotosAlbum({
                            filePath: e.tempFilePath,
                            success: function () {
                                uni.showToast({title: '保存成功'});
                            },
                            fail: function (err) {
                                if (err.errMsg) {
                                    uni.showModal({
                                        title: '提示',
                                        content: '您好,请先授权保存到相册权限',
                                        showCancel: false,
                                        success(res) {
                                            if (res.confirm) {
                                                uni.openSetting({
                                                    success(settingdata) {
                                                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                                            uni.saveImageToPhotosAlbum({
                                                                filePath: e.tempFilePath,
                                                                success: function () {
                                                                    uni.showToast({title: '保存成功'});
                                                                },
                                                            })
                                                        } else {
                                                            uni.showModal({
                                                                title: '提示',
                                                                content: '授权失败，请稍后重新获取',
                                                                showCancel: false,
                                                            })
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            },
                            complete: function (e) {
                                uni.hideLoading();
                            }
                        });
                    },
                    fail: function (e) {
                        uni.showModal({
                            title: '图片下载失败',
                            content: e.errMsg,
                            showCancel: false,
                        });
                    },
                    complete: function (e) {
                        uni.hideLoading();
                    }
                });
                // #endif

                // #ifdef MP-ALIPAY
                my.showLoading({content: '图片保存中'});
                my.saveImage({
                    url: url,
                    showActionSheet: true,
                    success: () => {
                        uni.showToast({title: '保存成功'});
                    },
                    complete() {
                        my.hideLoading();
                    }
                })
                // #endif
            },

            copy() {
                this.$utils.uniCopy({
                    data: this.setting.cs_wechat,
                    success(){
                        //#ifndef MP-WEIXIN
                        uni.showToast({ title: '复制成功'});
                        // #endif
                    }
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    .bottom {
        margin-bottom: #{40rpx};
    }

    .cs-wechat {
        height: #{80rpx};
        width: #{240rpx};
        text-align: center;
        line-height: #{80rpx};
        border: #{1rpx} dashed #999999;
        color: #353535;
        border-radius: #{16rpx};
        font-size: #{36rpx};
        margin-top: #{40rpx};
        background: #FFFFFF;
        margin-bottom: -#{40rpx};
        z-index: 1;
    }

    .cs-box {
        width: #{670rpx};
        border-radius: #{16rpx};
        border: #{1rpx} dashed #999999;
        background: #FFFFFF;
    }

    .cs-box image {
        margin-top: #{88rpx};
        height: #{360rpx};
        width: #{360rpx};
        display: block;
    }

    .cs-wechat-name {
        margin-top: #{32rpx};
        font-size: #{28rpx};
        color: #999999;
    }

    .end {
        margin-bottom: #{56rpx};
        margin-top: #{24rpx};
    }

    .end .btn:nth-child(2) {
        margin-left: #{20rpx};
    }

    .btn {
        text-align: center;
        height: #{64rpx};
        width: #{264rpx};
        line-height: #{64rpx};
        color: #ff4544;
        border-radius: #{32rpx};
        border: #{1px} solid #ff4544;
        font-size: #{24rpx};
    }
</style>