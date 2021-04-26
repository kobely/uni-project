<template>
    <view class="app-goods-quick-share">
        <cover-view v-if="friendModel" class="friend-box">
            <cover-view class="info main-center cross-center dir-top-nowrap">
                <cover-view class="dir-left-nowrap cross-center">
                    <cover-image src="/static/image/icon/friend-v.png" class="icon"></cover-image>
                    <cover-view class="text">文本已复制到剪贴板</cover-view>
                </cover-view>
                <cover-view class="dir-left-nowrap cross-center" style="margin-top: 30rpx">
                    <cover-image src="/static/image/icon/friend-v.png" class="icon"></cover-image>
                    <cover-view class="text">图片已保存到相册</cover-view>
                </cover-view>
            </cover-view>
        </cover-view>

        <text id="opacity-hide" class="opacity-hide">
            第一行
            第二行
            第三行
            第四行
            第五行
        </text>
        <view v-if="value" class="box">
            <view v-if="posterShow">
                <app-goods-preview-poster
                    v-model="posterShow" @close="close" :url="posterUrl"
                ></app-goods-preview-poster>
            </view>
            <view v-else class="quick-center">
                <view class="head">
                    <view class="t-omit name">{{extraQuickShare.mall_name}}</view>
                    <view class="time">{{extraQuickShare.format_time}}</view>
                    <view class="close" @click.stop="close">
                        <icon type></icon>
                    </view>
                </view>
                <scroll-view scroll-y class="scrollbar">
                    <view class="goods-text">
                        <text class="opacity-hide" space="nbsp" id="all_hide_text_0"
                              v-text="extraQuickShare.share_text"></text>
                        <text class="share-text"
                              :class="{'limit': is_limit}" space="nbsp"
                              v-text="extraQuickShare.share_text"></text>
                        <view v-if="is_all_btn" class="all" @click.stop="showText">
                            <block v-if="is_limit">全文</block>
                            <block v-else>收起</block>
                        </view>
                    </view>

                    <view class="goods-image dir-left-wrap">
                        <view v-for="(item,index) in extraQuickShare.share_pic" :key="index">
                            <image @click.stop="previewImage(index)" :src="item.pic_url" lazy-load></image>
                        </view>
                    </view>
                </scroll-view>
                <view class="goods-set cross-center dir-left-nowrap">
                    <!--  #ifdef MP-BAIDU -->
                    <view class="box-grow-0" style="margin-left: auto" @click="copyText">复制文本</view>
                    <!--  #endif -->
                    <!--  #ifndef MP-BAIDU -->
                    <view class="box-grow-0" @click="copyText">复制文本</view>
                    <!--  #endif -->
                    <view class="box-grow-0 margin" @click="saveImage(false)">保存图片</view>
                    <!--  #ifndef MP-BAIDU -->
                    <view class="box-grow-0" @click="open">生成海报</view>
                    <!--  #endif -->
                    <view class="line"></view>
                    <view class="box-grow-0">分享到</view>
                    <image @click="batchCopy" class="friend box-grow-0"></image>
                    <view style="width: 50rpx">
                        <app-jump-button open_type="share">
                            <image @click="shareCard" class="card"></image>
                        </app-jump-button>
                    </view>
                    <!-- #ifdef MP_WEIXIN || H5 -->
                    <image v-if="isVideoNumber" @click="videoNumber" class="video-number box-grow-0"></image>
                    <!-- #endif -->
                </view>
            </view>
        </view>

        <!-- 视频号弹框 -->
        <app-share-video-number :goods-id="goodsId" :is-show="isShowVideoNumber" @close="closeVideoNumber"></app-share-video-number>
    </view>
</template>

<script>
import appGoodsPreviewPoster from '../goods/app-goods-preview-poster.vue';
import appShareVideoNumber from '../../../components/page-component/app-share-video-number/app-share-video-number.vue';

export default {
    name: 'bd-quick-share',
    components: {
        appGoodsPreviewPoster,
        appShareVideoNumber
    },
    props: {
        value: {
            type: Boolean,
            default() {
                return false;
            }
        },
        goodsId: {
            type: [Number, String]
        },
        extraQuickShare: {
            type: Object,
            required: false,
        },
        isVideoNumber: {
            type: Boolean,
            default() {
                return false
            }
        },
        appSharePic: String,
        appShareTitle: String
    },
    data() {
        return {
            friendModel: false,
            posterUrl: '',
            is_all_btn: false,
            is_limit: true,
            shareData: null,
            posterShow: false,

            isShowVideoNumber: false,
        }
    },
    watch: {
        value(newInfo, oldInfo) {
            if (newInfo) {
                setTimeout(() => {
                    let self = this;
                    const query = uni.createSelectorQuery().in(self);
                    query.select('#opacity-hide').boundingClientRect(item => {
                        const key = uni.createSelectorQuery().in(self);
                        key.select('#all_hide_text_0').boundingClientRect(item1 => {
                            self.is_all_btn = item1.height + 1 >= item.height;
                        }).exec();
                    }).exec();
                })
            }
        }
    },
    methods: {
        showText() {
            this.is_limit = !this.is_limit;
        },
        close() {
            this.$emit('input', false);
            this.posterShow = false;
        },
        open() {
            const posterConfig = this.$api.quick_share.poster_config + '&goods_id=' + this.goodsId;
            const posterGenerate = this.$api.quick_share.poster_generate + '&goods_id=' + this.goodsId;

            let url;
            // #ifdef MP
            url = `/pages/poster/goods?poster_config=${escape(posterConfig)}&poster_generate=${escape(posterGenerate)}`
            // #endif
            // #ifdef H5
            url = `/pages/poster/goods?poster_config=${btoa(posterConfig)}&poster_generate=${btoa(posterGenerate)}`
            // #endif

            uni.navigateTo({
                url,
            });
            // this.posterShow = true;
        },
        batchCopy() {
            this.copyText();
            this.saveImage(true);
        },
        copyText() {
            this.$utils.uniCopy({
                data: this.extraQuickShare.share_text,
                success() {
                    //#ifndef MP-WEIXIN
                    uni.showToast({title: '复制成功'});
                    // #endif
                },
            });
        },
        saveImage(customize_success = false) {
            let self = this;
            if (!self.extraQuickShare.share_pic) {
                return '';
            }
            uni.showLoading({title: `图片保存中`});
            self.$request({
                url: self.$api.quick_share.poster_list,
                data: {
                    goods_id: self.goodsId,
                }
            }).then(info => {
                if (info.code === 0) {
                    let urls = self.extraQuickShare.share_pic.map(item => {
                        return item.pic_url;
                    });
                    urls.splice(-1, 1, info.data.pic_url);

                    self.$utils.batchSave(urls, 'image').then(result => {
                        const customize_a = function () {
                            uni.showToast({title: '保存成功'});
                        };
                        const customize_b = function () {
                            self.friendModel = true;
                            setTimeout(() => {
                                self.friendModel = false;
                            }, 1500)
                        };
                        customize_success ? customize_b() : customize_a();
                    });
                }
            }).catch(e => {
                uni.hideLoading();
            });
        },
        shareCard() {
            const title = this.appShareTitle ? this.appShareTitle : this.extraQuickShare.share_text;
            let imageUrl = '';
            if (this.extraQuickShare.share_pic[0].pic_url) {
                imageUrl = this.extraQuickShare.share_pic[0].pic_url;
            }
            if (this.appSharePic) {
                imageUrl = this.appSharePic;
            }

            this.$emit('quickShare', {
                title: title,
                imageUrl: imageUrl,
                path: this.goodsId === 0 ? '/pages/index/index' : '/pages/goods/goods',
                params: this.goodsId === 0 ? {} : {id: this.goodsId},
            });
        },
        previewImage(index) {
            if (!this.extraQuickShare.share_pic) {
                return '';
            }
            const urls = this.extraQuickShare.share_pic.map(item => {
                return item.pic_url;
            });
            uni.previewImage({
                urls: urls,
                current: index
            });
        },
        closeVideoNumber() {
            this.isShowVideoNumber = false;
        },
        videoNumber() {
            this.isShowVideoNumber = true;
        }
    }
}
</script>

<style scoped lang="scss">
.friend-box {
    position: fixed;
    top: #{563rpx};
    width: 100%;
    left: 0;
    z-index: 1701;

    .info > cover-view:first-child {
        margin-bottom: #{30rpx};
    }

    .info {
        width: #{413rpx};
        height: #{209rpx};
        color: #ffffff;
        font-size: #{28rpx};
        border-radius: #{16rpx};
        margin: 0 auto;
        background: rgba(0, 0, 0, 0.8);

        cover-view {
            background: rgba(0, 0, 0, 0);
        }

        .text {
            padding-left: #{13rpx};
        }

        .icon {
            height: #{28rpx};
            width: #{28rpx};
        }
    }
}
.opacity-hide {
    position: fixed;
    top: 0;
    z-index: -10;
    opacity: 0;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: normal !important;
    -webkit-line-clamp: 5;
}

.share-text {
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: normal !important;
}

.share-text.limit {
    -webkit-line-clamp: 2;
}

.app-goods-quick-share {
    .box {
        position: fixed;
        z-index: 1700;
        left: 0;
        bottom: 0;
        width: #{750rpx};
        opacity: 1;
        visibility: visible;
        height: 100%;
        background-color: rgba(153, 153, 153, 0.5);
    }

    .quick-center {
        background: #ffffff;
        border-top-left-radius: #{16rpx};
        border-top-right-radius: #{16rpx};
        position: absolute;
        width: 100%;
        height: auto;
        left: 0;
        bottom: 0;
        z-index: 111;
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

.head {
    padding: 0 #{24rpx};

    .name {
        padding-top: #{30rpx};
        color: #212121;
        font-size: #{34rpx};
        max-width: 80%;
    }

    .time {
        font-size: #{24rpx};
        color: #a0a0a0;
        padding-top: #{10rpx};
        padding-bottom: #{20rpx};
    }

    .close {
        position: absolute;
        top: #{12rpx};
        right: #{12rpx};
        padding: #{12rpx};
        z-index: 111;
        icon {
            background-image: url("../../../plugins/quick_share/image/close.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            height: #{30rpx};
            width: #{30rpx};
        }
    }
}

.scrollbar {
    max-height: #{876rpx};
}

.goods-text {
    padding: 0 #{24rpx};
    font-size: #{32rpx};
    color: #212121;

    .share-text {
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        white-space: normal !important;
    }

    .share-text.limit {
        -webkit-line-clamp: 4;
    }

    .all {
        padding-top: #{10rpx};
        color: #5b6a91;
    }
}

.goods-image {
    padding: #{10rpx} #{24rpx - 8rpx} #{30rpx} #{24rpx - 8rpx};

    view {
        height: #{227rpx};
        width: #{227rpx};
        margin: #{6rpx};
    }

    image {
        height: 100%;
        width: 100%;
        display: block;
    }
}

.goods-set {
    color: #a0a0a0;
    font-size: #{28rpx};
    border-top: #{1rpx} solid #e2e2e2;
    padding: #{20rpx} #{24rpx} #{53rpx};

    .margin {
        margin: 0 auto;
    }

    .line {
        height: #{50rpx};
        width: #{1px};
        margin: 0 #{26rpx};
        background: #dcdfe6;
    }

    image {
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: #{50rpx};
        width: #{50rpx};
    }

    .friend {
        margin-right: #{15rpx};
        margin-left: #{20rpx};
        background-image: url("../../../plugins/quick_share/image/friend.png");
    }

    .video-number {
        margin-left: #{20rpx};
        background-image: url("../../../static/image/icon/video-number-2.png");
    }

    .card {
        background-image: url("../../../plugins/quick_share/image/wechat.png");
    }

}
</style>