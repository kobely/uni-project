<template>
    <view class="app-goods-preview-poster">
        <view class="app-center dir-top-wrap main-center cross-center">
            <view class="app-close" @click="showHiddenClick"></view>
            <view class="app-image-iframe main-center dir-top-nowrap cross-center" v-if="loading">
                <image class="loading" src="/static/image/loading.gif"></image>
                <view class="text">海报生成中</view>
            </view>
            <image class="app-image-iframe" v-if="!loading" show-menu-by-longpress mode="aspectFit"
                   @click="preview" :src="shareImage"></image>
            <view class="app-button">
                <app-button width="500"
                            :disabled="disabled"
                            height="80"
                            :background="disabled ? '#cdcdcd' : '#ff4544'"
                            fontSize="32rpx"
                            color="white"
                            roundSize="40rpx"
                            @click="savePicture"
                >保存图片
                </app-button>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "app-goods-preview-poster",

        props: {
            value: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            url: {
                type: String,
                default() {
                    return '';
                }
            },

            disabled: {
                type: Boolean,
                default() {
                    return false;
                }
            }
        },

        created: function () {
            this.showHidden = this.value;
        },
        watch: {
            value(newVal) {
                this.showHidden = newVal;
            },
            showHidden(newVal) {
                if (newVal) {
                    this.getShareImg();
                }
            }
        },
        data() {
            return {
                showHidden: false,
                loading: true,
                shareImage: '',
            }
        },
        methods: {
            showHiddenClick() {
                this.$emit('close', false);
            },
            savePicture() {
                if (this.loading) return;
                this.$utils.batchSave(this.shareImage, 'image').then(() => {
                    uni.showToast({title: '保存成功'});
                });
            },
            getShareImg() {
                if (!this.url) return;
                this.loading = true;
                this.$request({
                    url: this.url,
                }).then(response => {
                    if (response.code === 0) {
                        this.shareImage = response.data.pic_url;
                        this.loading = false;
                    } else {
                        uni.showModal({
                            content: response.msg,
                            showCancel: false
                        });
                    }
                });
            },
            preview() {
                uni.previewImage({
                    urls: [this.shareImage]
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-goods-preview-poster {
        .app-center {
            width: calc(100% - #{80rpx});
            padding-top: #{100rpx};
            padding-bottom: #{77rpx};
            border-radius: #{8rpx};
            background-color: white;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            .loading {
                width: #{220rpx};
                height: #{220rpx};
            }

            .app-close {
                width: #{30rpx};
                height: #{30rpx};
                background-size: cover;
                background-repeat: no-repeat;
                background-image: url("../../../static/image/icon/close.png");
                position: absolute;
                top: #{28rpx};
                right: #{24rpx};

            }

            .app-image-iframe {
                width: #{440rpx};
                height: #{783rpx};
                position: relative;
                box-shadow: #{2rpx} #{2rpx} #{10rpx} #d9d9d9;

                .text {
                    text-align: center;
                    color: #888;
                }
            }

            .app-button {
                width: #{500rpx};
                height: #{80rpx};
                margin-top: #{38rpx};
                margin-bottom: #{24rpx};
            }

            .app-text {
                font-size: #{24rpx};
                color: #999999;
            }
        }
    }
</style>