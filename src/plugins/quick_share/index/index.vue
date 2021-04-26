<template>
    <app-layout>
        <view class="bg">


        <cover-view v-if="friendModel" class="friend-box">
            <cover-view class="info main-center cross-center dir-top-nowrap">
                <cover-view class="dir-left-nowrap cross-center">
                    <cover-image src="../../../static/image/icon/friend-v.png" class="icon"></cover-image>
                    <cover-view class="text">文本已复制到剪贴板</cover-view>
                </cover-view>
                <cover-view class="dir-left-nowrap cross-center" style="margin-top: 30rpx">
                    <cover-image src="../../../static/image/icon/friend-v.png" class="icon"></cover-image>
                    <cover-view v-if="is_video" class="text">视频已保存到相册</cover-view>
                    <cover-view v-else class="text">图片已保存到相册</cover-view>
                </cover-view>
            </cover-view>
        </cover-view>
        <view>
            <text id="opacity-hide" class="opacity-hide">
                第一行
                第二行
                第三行
                第四行
                第五行
            </text>
            <view class="fixed">
                <view class="share-head-margin">
                    <view class="share-head dir-left-nowrap">
                        <view class="box-grow-1 main-center cross-center"
                              :class="[`goods`, tab===`goods`? `${tab}-active`: '']"
                              @click="tabChange(`goods`)">商品
                        </view>
                        <view class="box-grow-1 main-center cross-center"
                              :class="[`dynamic`, tab===`dynamic`? `${tab}-active`: '']"
                              @click="tabChange(`dynamic`)">动态
                        </view>
                    </view>
                </view>
                <view class="share-center dir-left-nowrap" v-if="tab === `goods`">
                    <view class="dir-left-nowrap cross-center value">
                        <view @click="sortChange(sort===1?2:1)" :class="[sort===1 || sort===2 ? `active`: ``]">最新商品
                        </view>
                        <icon v-if="sort === 1" class="sort-plus" type></icon>
                        <icon v-else-if="sort === 2" class="sort-less" type></icon>
                        <icon v-else class="sort-default" type></icon>
                    </view>
                    <view class="dir-left-nowrap cross-center value">
                        <view @click="sortChange(sort===3?4:3)" :class="[sort===3 || sort===4 ? `active`: ``]">最新素材
                        </view>
                        <icon v-if="sort === 3" class="sort-plus" type></icon>
                        <icon v-else-if="sort === 4" class="sort-less" type></icon>
                        <icon v-else class="sort-default" type></icon>
                    </view>
                    <view class="dir-left-nowrap cross-center value">
                        <view @click="sortChange(sort===5?6:5)" :class="[sort===5 || sort===6 ? `active`: ``]">销量
                        </view>
                        <icon v-if="sort === 5" class="sort-plus" type></icon>
                        <icon v-else-if="sort === 6" class="sort-less" type></icon>
                        <icon v-else class="sort-default" type></icon>
                    </view>
                </view>
            </view>
            <view :class="tab + `-margin`">
                <view class="share-goods" v-for="(item,index) in list" :key="index">
                    <view v-if="item.is_top" class="goods-top dir-left-nowrap">
                        <icon class="top box-grow-0" type></icon>
                        <view>置顶</view>
                    </view>

                    <view class="goods-head dir-left-nowrap">
                        <view class="dir-top-nowrap">
                            <view class="t-omit goods-name">{{item.mall_name}}</view>
                            <view class="goods-time">{{item.format_time}}</view>
                        </view>
                        <view v-if="tab === `goods`" @click="navDetail(item)"
                              class="goods-detail main-center box-grow-0 cross-center">商品详情
                        </view>
                    </view>
                    <view class="goods-text">
                        <text class="opacity-hide" space="nbsp" :id="`all_hide_text_` + index"
                              v-text="item.share_text"></text>
                        <text class="share-text" :class="{'limit': allTextList.indexOf(index) === -1}"
                              space="nbsp" v-text="item.share_text"></text>
                        <view v-if="item.is_all_btn" class="all" @click="showText(index)">
                            <block v-if="allTextList.indexOf(index) === -1">全文</block>
                            <block v-else>收起</block>
                        </view>
                    </view>
                    <view v-if="item.goods_id ===0 && item.material_video_url" class="goods-video">
                        <video :src="item.material_video_url" show-mute-btn
                               :poster="item.material_cover_url"></video>
                    </view>
                    <view v-else class="goods-image dir-left-wrap">
                        <view v-for="(item1,index1) in item.share_pic" :key="index1">
                            <image @click="previewImage(item.share_pic, index1)" :src="item1.pic_url" lazy-load></image>
                        </view>
                    </view>
                    <view class="goods-set cross-center dir-left-nowrap">
                        <view class="box-grow-1 main-center">
                            <!--  #ifdef MP-BAIDU || MP-ALIPAY -->
                            <view class="box-grow-1 main-center"  @click="copyText(item)">复制文本</view>
                            <!--  #endif -->
                            <!--  #ifndef MP-BAIDU || MP-ALIPAY -->
                            <view class="box-grow-1 main-center" @click="copyText(item)">复制文本</view>
                            <!--  #endif -->
                            <!--  #ifdef MP-WEIXIN -->
                            <view class="box-grow-1 main-center" @click="saveImage(item)"
                                  v-if="item.goods_id ===0 && item.material_video_url">下载视频
                            </view>
                            <view class="box-grow-1 main-center" v-else @click="saveImage(item)">保存图片</view>
                            <!--  #endif -->
                            <!--  #ifndef MP-WEIXIN -->
                            <view class="box-grow-1 main-center" v-if="item.goods_id !==0 || !item.material_video_url" @click="saveImage(item)">保存图片</view>
                            <!--  #endif -->
                            <!--  #ifndef MP-BAIDU -->
                            <view class="box-grow-1 main-center" @click="setPoster(item)">生成海报</view>
                            <!--  #endif -->
                        </view>
                        <view class="line"></view>
                        <view class="box-grow-0">分享到</view>
                        <image @click="batchCopy(item)" class="friend box-grow-0"></image>
                        <view style="width: 50rpx">
                            <app-jump-button open_type="share">
                                <image @click="shareCard(item)" class="card"></image>
                            </app-jump-button>
                        </view>
                        <!-- #ifdef MP_WEIXIN || H5 -->
                        <image v-if="item.is_video_number && tab==='goods'" @click="videoNumber(item)" class="video-number box-grow-0"></image>
                        <!-- #endif -->
                    </view>
                </view>
            </view>

            <view class="box" :class="{'app-show-hidden': posterShow}">
                <app-goods-preview-poster
                        v-model="posterShow" @close="posterShow = false" :url="posterUrl"
                ></app-goods-preview-poster>
            </view>

            <!-- 视频号弹框 -->
        <app-share-video-number :goods-id="currentGoods.goods_id" :is-show="isShowVideoNumber" @close="closeVideoNumber"></app-share-video-number>
        </view>
        </view>
    </app-layout>
</template>

<script>
    import appGoodsPreviewPoster from '../../../components/page-component/goods/app-goods-preview-poster';
    import appShareVideoNumber from '../../../components/page-component/app-share-video-number/app-share-video-number.vue';

    export default {
        name: "index",
        components: {
            appGoodsPreviewPoster,
            appShareVideoNumber
        },
        data() {
            return {
                friendModel: false,
                is_video: false,

                tab: 'goods',
                sort: 1,
                page: 1,
                args: false,
                load: false,

                list: [],
                allTextList: [],
                shareData: {},

                posterShow: false,
                posterUrl: '',
                isShowVideoNumber: false,
                currentGoods: {}
            }
        },

        onReachBottom: function () {
            const self = this;
            if (self.args || self.load)
                return;
            self.load = true;
            let page = self.page + 1;
            self.$request({
                url: self.$api.quick_share.goods,
                data: {
                    type: self.tab,
                    sort: self.sort,
                    page,
                }
            }).then(info => {
                if (info.code === 0) {
                    //todo
                    info.data.list.forEach(v => {
                        v.is_all_btn = false;
                    });
                    [self.page, self.args, self.list] = [page, info.data.list.length === 0, self.list.concat(info.data.list)];
                    self.formatList();
                }
                self.load = false;
            });
        },

        onLoad() { this.$commonLoad.onload();
            this.loadData();
        },
        // #ifdef MP
        onShareAppMessage(params) {
            if (params.from === 'button') {
                return this.$shareAppMessage(this.shareData);
            }
        },
        // #endif
        methods: {
            navDetail(column) {
                uni.navigateTo({url: `/pages/goods/goods?id=` + column.goods_id});
            },
            previewImage(list, index) {
                const urls = list.map(item => {
                    return item.pic_url;
                });
                uni.previewImage({
                    urls: urls,
                    current: index,
                });
            },

            showText(index) {
                let key = this.allTextList.indexOf(index);
                if (key === -1) {
                    this.allTextList.splice(-1, 0, index);
                } else {
                    this.allTextList.splice(key, 1);
                }
            },
            sortChange(sort) {
                [this.list, this.allTextList] = [[], []];
                [this.page, this.args, this.sort] = [1, false, sort];
                this.loadData();
            },
            tabChange(tab) {
                [this.list, this.allTextList] = [[], []];
                [this.page, this.args, this.tab] = [1, false, tab];
                this.loadData();
            },
            loadData() {
                const self = this;
                self.$showLoading({text: '加载中'});
                self.$request({
                    url: self.$api.quick_share.goods,
                    data: {
                        page: 1,
                        type: self.tab,
                        sort: self.sort,
                    }
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        info.data.list.forEach(v => {
                            v.is_all_btn = false;
                        })
                        self.list = info.data.list;
                        self.formatList();
                    }
                }).catch(info => {
                    self.$hideLoading();
                })
            },

            formatList() {
                const self = this;
                setTimeout(() => {
                    let list = JSON.parse(JSON.stringify(self.list));
                    const query = uni.createSelectorQuery().in(this);
                    query.select('#opacity-hide').boundingClientRect(item => {
                        list.forEach((v, k) => {
                            let key = uni.createSelectorQuery().in(self);
                            key.select(`#all_hide_text_` + k).boundingClientRect(item1 => {
                                v.is_all_btn = item1.height + 1 >= item.height;
                            }).exec();
                        });
                        self.list = list;
                    }).exec();
                })
            },

            saveImage(column, customize_success = false) {
                let self = this;
                self.is_video = column.goods_id === 0 && column.material_video_url;
                const customize_a = function () {
                    uni.showToast({title: '保存成功'});
                };
                const customize_b = function () {
                    self.friendModel = true;
                    setTimeout(() => {
                        self.friendModel = false;
                    }, 1500)
                };

                if (self.is_video) {
                    const share_video = column.material_video_url;
                    self.$utils.batchSave(share_video, 'video').then(result => {
                        customize_success ? customize_b() : customize_a();
                    });
                } else {
                    uni.showLoading({title: `图片保存中`});
                    self.$request({
                        url: self.$api.quick_share.poster_list,
                        data: {
                            id: column.id,
                        }
                    }).then(info => {
                        if (info.code === 0) {
                            let urls = column.share_pic.map(item => {
                                return item.pic_url;
                            })
                            urls.splice(-1, 1, info.data.pic_url);
                            self.$utils.batchSave(urls, 'image').then(result => {
                                customize_success ? customize_b() : customize_a();
                            });
                        }
                    }).catch(e => {
                        uni.hideLoading();
                    })
                }
            },

            setPoster(column) {
                if(this.tab === 'dynamic') {
                    this.posterUrl = this.$api.quick_share.poster + `&id=` + column.id;
                    this.posterShow = true;
                } else {
                    const posterConfig = this.$api.quick_share.poster_config + '&id=' + column.id;
                    const posterGenerate = this.$api.quick_share.poster_generate + '&id=' + column.id;
                    uni.navigateTo({
                        // #ifdef MP
                        url : `/pages/poster/goods?poster_config=${escape(posterConfig)}&poster_generate=${escape(posterGenerate)}`
                        // #endif
                        // #ifdef H5
                        url : `/pages/poster/goods?poster_config=${btoa(posterConfig)}&poster_generate=${btoa(posterGenerate)}`
                        // #endif
                    });
                }
            },
            copyText(column) {
                this.$utils.uniCopy({
                    data: column.share_text,
                    success() {
                        //#ifndef MP-WEIXIN
                        uni.showToast({title: '复制成功'});
                        // #endif
                    }
                });
            },
            batchCopy(column) {
                const self = this;
                this.copyText(column);
                //#ifdef H5
                if (column.goods_id === 0 && column.material_video_url) {
                    this.$request({
                        url: this.$api.quick_share.poster + `&id=` + column.id,
                    }).then(response => {
                        if (response.code === 0) {
                            let shareImage = response.data.pic_url;
                            self.$utils.batchSave(shareImage).then(result => {
                                self.friendModel = true;
                                setTimeout(() => {
                                    self.friendModel = false;
                                }, 1500)
                            });
                        } else {
                            uni.showModal({
                                content: response.msg,
                                showCancel: false
                            });
                        }
                    });
                    return;
                }
                // #endif
                this.saveImage(column, true);
            },
            shareCard(column) {
                this.shareShow = true;
                const title = column.app_share_title ? column.app_share_title : column.share_text;
                let imageUrl = '';
                if (column.share_pic[0].pic_url) {
                    imageUrl = column.share_pic[0].pic_url;
                }
                if (column.app_share_pic) {
                    imageUrl = column.app_share_pic;
                }

                this.shareData = {
                    title: title,
                    imageUrl: imageUrl,
                    path: column.goods_id === 0 ? '/pages/index/index' : '/pages/goods/goods',
                    params: column.goods_id === 0 ? {} : {id: column.goods_id},
                }
                // #ifdef H5
                this.$shareAppMessage(this.shareData, true);
                // #endif
            },
            closeVideoNumber() {
                this.isShowVideoNumber = false;
            },
            videoNumber(goods) {
                this.currentGoods = goods;
                this.isShowVideoNumber = true;
            }
        }
    }
</script>

<style scoped lang="scss">
    .bg {
        background: #FFFFFF;
    }
    .friend-box {
        position: fixed;
        top: #{563rpx};
        width: 100%;
        left: 0;
        z-index: 88;

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
                display: block;
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

    .fixed {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 10;

        .share-head-margin {
            padding: #{23rpx} 0;
            background: #ffffff;

            .share-head {
                text-align: center;
                width: #{323rpx};
                margin: 0 auto;
                font-size: #{28rpx};
                height: #{56rpx};
                color: #666666;

                .goods {
                    border-top-left-radius: #{30rpx};
                    border-bottom-left-radius: #{30rpx};
                    border-top: 1px solid #446dfd;
                    border-bottom: 1px solid #446dfd;
                    border-left: 1px solid #446dfd;
                }

                .dynamic {
                    border-top-right-radius: #{30rpx};
                    border-bottom-right-radius: #{30rpx};
                    border-top: 1px solid #446dfd;
                    border-bottom: 1px solid #446dfd;
                    border-right: 1px solid #446dfd;
                }

                .dynamic-active, .goods-active {
                    background: #446dfd;
                    color: #ffffff;
                }
            }
        }

        .share-center {
            padding: 0 #{60rpx};
            height: #{96rpx};
            font-size: #{28rpx};
            background: #FFFFFF;
            justify-content: space-between;

            .value > view {
                margin-right: #{9rpx};
            }

            .active {
                color: #446dfd;
            }

            icon {
                background-repeat: no-repeat;
                background-size: 100% 100%;
                width: #{16upx};
                height: #{26upx};
            }

            .sort-default {
                background-image: url("../image/sort-blue-default.png");
            }

            .sort-less {
                background-image: url("../image/sort-blue-less.png");
            }

            .sort-plus {
                background-image: url("../image/sort-blue-plus.png");
            }
        }
    }

    .goods-margin {
        margin-top: #{196rpx};
    }

    .dynamic-margin {
        margin-top: #{100rpx};
    }

    .box {
        position: fixed;
        z-index: 1700;
        left: 0;
        bottom: 0;
        width: #{750rpx};
        opacity: 0;
        visibility: hidden;
        height: 100%;
        background-color: rgba(153, 153, 153, 0.5);
    }

    .app-show-hidden {
        opacity: 1;
        visibility: visible;
    }


    .share-goods {
        background: #FFFFFF;
        margin-bottom: #{15rpx};

        .goods-top {
            background: #FFFFFF;
            padding: #{14rpx} #{24rpx};
            font-size: #{26rpx};
            color: #ff4544;

            .top {
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-image: url("../image/goods-top.png");
                height: #{32rpx};
                width: #{28rpx};
                display: block;
                margin-right: #{12rpx};
            }
        }

        .goods-head {
            padding: #{40rpx} #{24rpx} 0 #{24rpx};

            .goods-name {
                color: #212121;
                font-size: #{34rpx};
                max-width: #{540rpx};
                line-height: 1;
            }

            .goods-time {
                margin-top: #{20rpx};
                color: #a0a0a0;
                font-size: #{24rpx};
                line-height: 1;
            }

            .goods-detail {
                color: #446dfd;
                font-size: #{26rpx};
                border: 1px solid #446dfd;
                border-radius: #{6rpx};
                height: #{50rpx};
                width: #{135rpx};
                margin-left: auto;
            }
        }

        .goods-text {
            padding: 0 #{24rpx};
            font-size: #{32rpx};
            color: #212121;
            margin-top: #{40rpx};

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

        .goods-video {
            padding-top: #{15rpx};
            padding-bottom: #{30rpx};

            video {
                width: 100%;
                height: #{422rpx};
            }
        }

        .goods-image {
            padding: #{10rpx} #{18rpx} #{30rpx} #{18rpx};

            view {
                height: #{226rpx};
                width: #{226rpx};
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
            padding: #{15rpx} #{24rpx} #{15rpx} 0;

            .margin {
                margin: 0 auto;
            }

            .line {
                height: #{60rpx};
                width: #{1px};
                margin-right: #{26rpx};
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
                background-image: url("../image/friend.png");
            }

            .video-number {
                margin-left: #{20rpx};
                background-image: url("../../../static/image/icon/video-number-2.png");
            }

            .card {
                background-image: url("../image/wechat.png");
            }
        }
    }
</style>