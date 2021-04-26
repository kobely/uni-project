<template>
    <view class="app-share-qr-code-poster" @click.prevent.stop="showHiddenClick" :class="{'app-show-hidden': value}">
        <view class="safe-area-inset-bottom app-bottom" v-if="buttonBoolean">
            <view class="app-icons dir-left-nowrap">
                <!-- #ifndef H5 -->
                <view class="box-grow-1" @click="showHiddenClick" v-if="isShowFriend">
                    <app-jump-button form arrangement="topCenter" open_type="share" >
                        <icon class="app-icon app-share" type></icon>
                        <text class="app-text">发送给朋友</text>
                    </app-jump-button>
                </view>
                <!-- #endif -->
                <!-- #ifdef H5 -->
                <view class="box-grow-1" @click="shareUrl" v-if="isShowFriend">
                    <app-jump-button form arrangement="topCenter">
                        <icon class="app-icon app-share" type></icon>
                        <text class="app-text">发送给朋友</text>
                    </app-jump-button>
                </view>
                <!-- #endif -->
                <!--  #ifndef MP-BAIDU -->
                <view class="box-grow-1" v-if="isHidden">
                    <view class="box-grow-1" @click.prevent.stop="fenxianghaibao">
                        <app-form-id>
                            <view class="dir-top-wrap main-center cross-center">
                                <icon class="app-icon app-code" type></icon>
                                <text class="app-text">{{title}}</text>
                            </view>
                        </app-form-id>
                    </view>
                </view>
                <!--  #endif -->
                <!-- #ifdef MP-WEIXIN || H5 -->
                <view v-if="goods.is_video_number && isShowFriend" class="box-grow-1">
                    <view class="box-grow-1" @click.prevent.stop="isShowVideoNumber = true">
                        <app-form-id>
                            <view class="dir-top-wrap main-center cross-center">
                                <icon class="app-icon app-video-number" type></icon>
                                <text class="app-text">生成视频号链接</text>
                            </view>
                        </app-form-id>
                    </view>
                </view>
                <!-- #endif -->
            </view>
            <view class="app-button">
                <app-form-id>
                    <view style="height: 100rpx;background-color: #ffffff;text-align: center;line-height: 100rpx;font-size: 32rpx;color: #353535;"
                          @click="showHiddenClick"
                          type="general">取消</view>
                </app-form-id>
            </view>
	    </view>
	    <!--  #ifndef MP-BAIDU -->
	    <view class="app-center dir-top-wrap main-center cross-center" v-else>
		    <view class="app-close" @click="showHiddenClick"></view>
		    <view class="app-image-iframe main-center dir-top-nowrap cross-center" v-if="loading">
			    <image class="loading" src="/static/image/loading.gif"></image>
			    <view class="text">海报生成中</view>
		    </view>
		    <image class="app-image-iframe" v-if="!loading" show-menu-by-longpress mode="aspectFit" @click="preview(shareImage)"  :src="shareImage"></image>
		    <view class="app-button">
			    <button class="save-picture" :style="{'background-color': loading ? '#cdcdcd' :  sign !== 'gift' ? theme.color : ''}" :class="[sign === 'gift' ?  theme + '-background' : '' ]" :disabled="loading" @click="savePicture">保存图片</button>
		    </view>
		    <text class="app-text">保存到相册</text>
	    </view>
	    <!--  #endif -->
	    <app-permissions-auth :text="text" :isShow='is_can_save' @cancel="cancel"></app-permissions-auth>

        <!-- 视频号弹框 -->
        <app-share-video-number :goods-id="goods.id" :is-show="isShowVideoNumber" @close="closeVideoNumber"></app-share-video-number>
    </view>
</template>

<script>
    import {mapGetters} from 'vuex';
    import appPermissionsAuth from '../../basic-component/app-layout/app-permissions-auth/app-permissions-auth.vue';
    import appShareVideoNumber from '../../page-component/app-share-video-number/app-share-video-number.vue';

    export default {
        name: 'app-share-qr-code-poster',
        components: {
            appPermissionsAuth,
            appShareVideoNumber
        },
        computed: {
            ...mapGetters('iPhoneX', {
                getBoolEmpty: 'getBoolEmpty'
            })
        },
        props: {
            title: {
                type: String,
                default() {
                    return '生成商品海报';
                }
            },
            posterConfig: String,
            posterGenerate: String,
            hasPosterNav: {
                type: Boolean,
                default() {
                    return false
                },
            },
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
            },
            isHidden: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            posterUrl: {
                type: String,
                default() {
                    return ''
                }
            },
            theme: [Object,String],
            sign: String,
            isShowFriend: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            appShareTitle: String,
            appSharePic: String,
            goods: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                showHidden: this.value,
                buttonBoolean: true,
                shareImage: '',
                is_can_save: false,
                text: '保存图片需要您的授权。点击去设置,开启 保存到相册 权限',
                loading: true,

                isShowVideoNumber: false,
                article_url: '',
                number: 1,
                isClick: true,
                isShow: false,
            }
        },
        methods: {
            fenxianghaibao() {
                if (this.hasPosterNav) {
                    let url = this.posterUrl;
                    if (this.posterUrl == '') {
                        // #ifdef MP
                        url = `/pages/poster/goods?poster_config=${escape(this.posterConfig)}&poster_generate=${escape(this.posterGenerate)}`
                        // #endif
                        // #ifdef H5
                        url = `/pages/poster/goods?poster_config=${btoa(this.posterConfig)}&poster_generate=${btoa(this.posterGenerate)}`
                        // #endif
                    }
                    uni.navigateTo({
                        url: url
                    });
                } else {
                    this.buttonBoolean = false;
                    this.getShareImg();
                }
            },
            showHiddenClick() {
                this.showHidden = false;
                this.$emit('input', this.showHidden);
                this.buttonBoolean = true;
            },
            savePicture() {
                if (this.loading) return;
                this.$utils.batchSave(this.shareImage, 'image').then(() => {
                    uni.showToast({title: '保存成功'});
                });
            },
            getShareImg() {
                if (!this.url) return;
                this.$request({
                    url: this.url,
                }).then(response => {
                    if (response.code === 0) {
                        this.shareImage = response.data.pic_url;
                        this.loading = false;
                    } else {
                        uni.showModal({
                            content: response.msg,
                            showCancel: false,
                        });
                    }
                });
            },
            getAuthSetting() {
                let self = this;
                uni.getSetting({
                    success(res) {
                        // #ifndef MP-TOUTIAO
                        self.is_can_save = !res.authSetting['scope.writePhotosAlbum'];
                        // #endif
                        // #ifdef MP-TOUTIAO
                        self.is_can_save = !res.authSetting['scope.album'];
                        // #endif
                    }
                });
            },
            cancel(isShow) {
                this.is_can_save = isShow;
            },
            preview(data) {
                uni.previewImage({
                    urls: [data],
                    longPressActions: true,
                });
            },
            // #ifdef H5
            open() {
                this.$jwx.showMenuItems({
                    success() {
                    }
                })
            },
            // #endif
            videoNumberClick() {
                if (!this.isClick) {
                    return
                }
                this.isClick = false;

                uni.showLoading({title: '加载中'});
                this.$request({
                    url: this.$api.goods.addMaterial,
                    data: {
                        goods_id: this.goods.id
                    }
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        this.isShowVideoNumber = true;
                        this.getArticleUrl(response.data.media_id);
                    } else {
                        this.resetVideoNumber()
                        uni.showModal({
                            content: response.msg,
                            showCancel: false,
                        });
                    }
                }).catch(() => {
                    this.resetVideoNumber()
                });
            },
            getArticleUrl(mediaId) {
                let interval = setInterval(() => {
                    if (this.article_url) {
                        clearInterval(interval);
                    }
                    if (this.number > 30) {
                        clearInterval(interval);
                        this.resetVideoNumber()
                        uni.showModal({
                            content: '获取视频号链接异常,请稍后重试',
                            showCancel: false,
                        });
                    }

                    this.number++;
                    this.$request({
                        url: this.$api.goods.articleUrl,
                        data: {
                            media_id: mediaId
                        }
                    }).then(response => {
                        uni.hideLoading();
                        if (response.code === 0) {
                            this.article_url = response.data.url;
                        } else {
                            this.resetVideoNumber()
                            uni.showModal({
                                content: response.msg,
                                showCancel: false,
                            });
                            clearInterval(interval);
                        }
                    });
                }, 1000)
            },
            resetVideoNumber() {
                this.number = 1;
                this.isShowVideoNumber = false;
                this.isClick = true;
            },
            copyText() {
                this.$utils.uniCopy({
                    data: this.article_url,
                    success() {
                        uni.showToast({title: '复制成功'});
                        this.resetVideoNumber()
                    }
                });
            },
            closeVideoNumber() {
                this.isShowVideoNumber = false;
            },
            // #ifdef H5
            shareUrl() {
                this.showHidden = false;
                this.$emit('input', this.showHidden);
                this.buttonBoolean = true;
                this.$emit('share', true);
            }
            // #endif
        }
    }
</script>


<style scoped lang="scss">
	.save-picture {
		width: #{500upx};
		height: #{80upx};
		border-radius: #{40upx};
		font-size: #{32upx};
		line-height: #{80upx};
		text-align: center;
		margin: 0;
		padding: 0;
		border: none;
		color: #ffffff;
	}
    .app-share-qr-code-poster {
        width: #{750rpx};
        height: 100%;
        position: fixed;
        z-index: 1701;
        left: 0;
        opacity: 0;
	    top: 0;
        visibility: hidden;
        background-color: rgba(153, 153, 153, 0.5);
	    .loading {
		    width: #{220rpx};
		    height: #{220rpx};
	    }
        .app-icons {
            height: #{290rpx};
	        .app-text {
		        font-size: #{26rpx};
		        color: #353535;
	        }
            > view {
                width: 50%;
                height: 100%;
                .app-icon {
                    width: #{120rpx};
                    height: #{120rpx};
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-color: white;
                    border-radius: 50%;
                    margin-top: #{60rpx};
                    margin-bottom: #{24rpx};
                }
                .app-share {
                    background-image: url('../../../static/image/icon/share.png');
                }
                .app-code {
                    background-image: url('../../../static/image/icon/code.png');
                }
                .app-video-number {
                    background-image: url('../../../static/image/icon/video-number.png');
                }
                .text {
                    font-size: #{26rpx};
                    color: #353535;
                }
            }
        }
        .app-bottom {
            width: 100%;
            position: fixed;
            bottom: 0;
            left: 0;
            background-color: #f2f2f2;
            .app-icons {
                width: 100%;
                height: #{290rpx};
            }
            .app-button {
                width: 100%;
                height: #{100rpx};
                /deep/ button {
                    border-radius: 0;
                    border: none;
                }
            }
        }
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

        .video-number-dialog {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            .item {
                width: #{622rpx};
                border-radius: #{16rpx};
                position: relative;
                background: #ffffff;

                .close {
                    width: #{30rpx};
                    height: #{30rpx};
                    position: absolute;
                    top: #{24rpx};
                    right: #{24rpx};
                    z-index: 10;
                }

                .title {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #353535;
                    font-size: #{32rpx};
                    margin: #{40rpx} 0;
                }

                .content {
                    width: #{558rpx};
                    height: #{82rpx};
                    border-radius: #{16rpx};
                    background: #f7f7f7;
                    color: #353535;
                    font-size: #{28rpx};
                    padding: #{20rpx};
                    margin: 0 #{30rpx} #{30rpx};
                    overflow: hidden;
                    display: inline-block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .copy {
                    height: #{90rpx};
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: #{34rpx};
                    color: #ff4544;
                    border-top: #{1rpx} solid #e2e2e2;
                }

                .hint {
                    text-align: center;
                    margin: #{30rpx} 0;
                }
            }
        }
    }

    .app-show-hidden {
        opacity: 1;
        visibility: visible;

    }
</style>
