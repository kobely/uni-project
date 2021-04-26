<template>
    <app-layout>
        <view v-if="edit" class="back-t">
            <view class="code-box set">
                <view style="text-align: left;">收款金额</view>
                <view class="dir-left-nowrap cross-center code-input">
                    <view>￥</view>
                    <input v-model="tmp_price" type="digit"/>
                </view>
                <view class="set-line"></view>
                <view @click="submit" class="btn main-center cross-center">确认</view>
            </view>
        </view>
        <view v-else class="back-o">
            <view class="code-box dir-top-nowrap main-center cross-center">
                <view class="box-grow-0 code-title">扫描二维码，向我付钱</view>
                <view v-if="price > 0" class="price">￥{{price}}</view>
                <image @click="qrcodeClick" class="box-grow-0" :src="pic_url"></image>
                <view class="dir-left-nowrap cross-center end">
                    <view @click="savePrice">设置金额</view>
                    <view class="line"></view>
                    <view @click="saveQrcode">保存图片</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    export default {
        name: "payment-code",
        components: {},
        data() {
            return {
                edit: false,
                pic_url: '',
                save_loading: false,
                price: '',
                tmp_price: '',
                is_clerk_enter: 0
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.is_clerk_enter = options.is_clerk_enter ? 1 : 0;
            this.submit();
        },
        methods: {
            savePrice: function () {
                this.edit = true;
            },

            submit: function () {
                const tmp_price = this.tmp_price ? parseFloat(this.tmp_price).toFixed(2) : '';

                this.$showLoading({text: `生成中`});
                this.$request({
                    url: this.$api.scan_code_pay.qr_code,
                    method: 'POST',
                    data: {
                        price: tmp_price,
                        is_clerk_enter: this.is_clerk_enter
                    }
                }).then(info => {
                    this.$hideLoading();
                    if (info.code === 0) {
                        [
                            this.pic_url,
                            this.price,
                            this.tmp_price,
                            this.edit
                        ] = [
                            info.data.qr_code.file_path,
                            tmp_price,
                            tmp_price,
                            false
                        ]
                    } else {
                        uni.showToast({icon: 'none', title: info.msg});
                    }
                }).catch(() => {
                    this.$hideLoading();
                });
            },

            //预览
            qrcodeClick: function () {
                uni.previewImage({
                    urls: [this.pic_url],
                });
            },

            //保存
            saveQrcode: function () {
                const self = this;
                uni.showLoading({mask: true,title: `图片保存中`});

                self.$utils.batchSave(self.pic_url, 'image').then(result => {
                    uni.showToast({title: '保存成功'});
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    .back-o {
        background: #fb8a36;
        height: 100vh;
        padding-top: #{32rpx};
    }

    .back-t {
        width: 100%;
        height: 100%;
        padding-top: #{32rpx};
    }

    .code-box {
        text-align: center;
        background: #fff;
        margin: 0 auto;
        width: #{686rpx};
        border-radius: #{16rpx};
    }

    .code-box.set {
        padding: #{48rpx};
        color: #353535;
    }

    .set .receipt {
        font-size: #{68rpx};
    }

    .code-box .btn {
        color: #fff;
        height: #{88rpx};
        background: #ff4544;
        font-size: #{32rpx};
        margin-top: #{48rpx};
        border-radius: #{44rpx};
    }

    .code-box image {
        width: #{360rpx};
        height: #{360rpx};
    }

    .code-box .code-title {
        color: #353535;
        font-size: #{36rpx};
        margin-top: #{120rpx};
        margin-bottom: #{64rpx};
    }

    .code-box .end {
        color: #418bfb;
        font-size: #{32rpx};
        margin-top: #{80rpx};
        margin-bottom: #{100rpx};
    }

    .code-box .line {
        height: #{32rpx};
        background: #418bfb;
        width: 1px;
        margin: 0 #{60rpx};
    }

    .code-box .set-line {
        width: 100%;
        height: 1px;
        background: #e2e2e2;
        margin-top: #{40rpx};
    }

    .code-box .price {
        font-size: #{56rpx};
        color: #353535;
        margin-bottom: #{40rpx};
    }

    .code-input {
        font-size: #{68rpx};
        margin-top: #{40rpx};
    }

    .code-input > view {
        padding-right: #{22rpx};
    }

    .code-input input {
        height: #{100rpx};
        text-align: left;
    }

</style>