<template>
    <app-layout>
       <view class="u-topic">
           <view class="topic" v-if="topic">
               <view class="title">{{topic.title}}</view>
               <view class="time plr-24">{{topic.read_count}}</view>
                <block v-for="(temp, index) in topic.detail" :key="index">
                    <template v-if="temp.id === 'image-text'">
                        <view class="plr-24">
                            <app-rich-text :content="temp.data.content"></app-rich-text>
                        </view>
                    </template>
                    <template v-else-if="temp.id === 'rubik'">
                        <view style="position: relative">
                            <app-image-ad :image-style="temp.data.style" :list="temp.data.list"
                                            :height="temp.data.height"></app-image-ad>
                            <block v-for="(hotspot, hotspot_index) in temp.data.hotspot" :key="hotspot_index">
                                <view>
                                    <app-hotspot :hotspot="rubikHotspot(hotspot)"></app-hotspot>
                                </view>
                            </block>
                        </view>
                    </template>
                    <template v-else-if="temp.id === 'video'">
                        <view>
                            <app-video :pic-url="temp.data.pic_url"
                                        :url="temp.data.url"
                            ></app-video>
                        </view>
                    </template>
                </block>
           </view>
           <view>
               <app-empty-bottom :height="Number(96)"></app-empty-bottom>
           </view>
           <view>
               <app-iphone-x>
                   <view class="bar dir-left-nowrap cross-center" slot="empty-area">
                       <view class="box-grow-1 dir-top-wrap cross-center" v-if="topic.is_favorite === 'love'" @click="favorite">
                           <image src="/static/image/icon/icon-favorite-active.png"></image>
                           <view>已收藏</view>
                       </view>
                       <view class="box-grow-1 dir-top-wrap cross-center" v-else @click="favorite">
                           <image src="/static/image/icon/icon-favorite.png"></image>
                           <view>收藏</view>
                       </view>
                       <view class="box-grow-1 dir-top-wrap cross-center" @click="shareClick">
                           <image src="/static/image/icon/icon-share-gray.png"></image>
                           <view>分享</view>
                       </view>
                   </view>
               </app-iphone-x>
               <app-share-qr-code-poster @share="hShareAppMessage" :theme="getTheme" v-model="shareShow" :url="poster" title="生成海报"></app-share-qr-code-poster>
           </view>
       </view>
    </app-layout>
</template>

<script>
	import {mapGetters, mapState} from "vuex";
    import appRichText from "../../components/basic-component/app-rich/parse";
    import appShareQrCodePoster from "../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue";
    import appIphoneX from '../../components/basic-component/app-iphone-x/app-iphone-x.vue';
    import appEmptyBottom from'../../components/basic-component/app-empty-bottom/app-empty-bottom.vue';
    import appVideo from "../../components/page-component/app-video/app-video.vue";
    import appImageAd from "../../components/page-component/app-image-ad/app-image-ad.vue";
    import appHotspot from "../../components/basic-component/app-hotspot/app-hotspot.vue";
    
    export default {
        name: "topic",
        components: {
            'app-rich-text': appRichText,
            'app-share-qr-code-poster': appShareQrCodePoster,
            appIphoneX,
            appEmptyBottom,
			'app-video': appVideo,
			'app-image-ad': appImageAd,
			'app-hotspot': appHotspot,
        },
        computed: {
            ...mapState({
                gConfig: state => state.gConfig,
            }),
			...mapGetters('mallConfig', {
				getTheme: 'getTheme',
			}),
        },
        data() {
            return {
                topic: {},
                is_loading: false,
                shareShow: false,
                poster: null,
                id: null
            };
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.id = options.id;
            this.loadData(options.id);
            this.poster = this.$api.poster.topic + '&id=' + options.id
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
        },
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            // 分享朋友圈beta
            return this.$shareTimeline({
                title: this.topic.app_share_title ? this.topic.app_share_title : this.topic.name,
                imageUrl: this.topic.qrcode_pic,
                query: {
                    id: this.id
                }
            });
        },
        // #endif
        // #ifdef MP
        onShareAppMessage() {
            return this.hShareAppMessage();
        },
        // #endif
        methods: {
            hShareAppMessage(s = false) {
                return this.$shareAppMessage({
                    title: this.topic.app_share_title ? this.topic.app_share_title : this.topic.title,
                    imageUrl: this.topic.qrcode_pic ? this.topic.qrcode_pic : '',
                    path: '/pages/topic/topic',
                    params: {
                        id: this.topic.id
                    }
                }, s);
            },
            loadData(id) {
                this.$showLoading();
                this.$request({
                    url: this.$api.topic.detail,
                    data: {
                        id: id
                    }
                }).then(response => {
                    this.$hideLoading();
                    if (response.code === 0) {
                        this.topic = response.data.list
                        uni.setNavigationBarTitle({
                            title: this.topic.app_share_title ? this.topic.app_share_title : this.topic.title
                        })
                    }
                }).catch(e => {
                    this.$hideLoading();
                });
            },
            favorite() {
                if (this.is_loading) {
                    return;
                }
                uni.showLoading({
                    mark: true,
                    title: '正在请求'
                });
                this.is_loading = true;
                let is_favorite = this.topic.is_favorite === 'no_love' ? 'love' : 'no_love';
                this.$request({
                    url: this.$api.topic.favorite,
                    data: {
                        id: this.topic.id,
                        is_favorite: is_favorite
                    },
                    method: 'post'
                }).then(response => {
                    uni.hideLoading();
                    this.is_loading = false;
                    if (response.code === 0) {
                        this.topic.is_favorite = is_favorite;
                        uni.showToast({
                            title: response.msg,
                            mask: false
                        })
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: response.msg,
                            showCancel: false,
                        });
                    }
                }).catch(e => {
                    uni.hideLoading();
                    this.is_loading = false;
                });
            },
            shareClick() {
                this.shareShow = true;
            },
            rubikHotspot(hotspot) {
                if (hotspot && hotspot.link) {
                    hotspot.link.url = hotspot.link.new_link_url;
                    hotspot.link.openType = hotspot.link.open_type;
                }
                return hotspot;
            },
        }
    }
</script>

<style scoped lang="scss">
    .topic {
        background-color: #ffffff;
        .title {
            padding: #{28rpx} #{24rpx} #{44rpx} #{24rpx};
            font-size: #{42rpx};
        }

        .time {
            margin-bottom: #{32rpx};
            font-size: $uni-font-size-general-two;
            color: $uni-general-color-two;
        }
    }

	.plr-24 {
		padding: 0 #{24rpx};
	}

    .bar {
        background-color: #ffffff;
        height: #{96rpx};
        width: 100%;
        border-top: #{1rpx} solid #e2e2e2;
        font-size: $uni-font-size-weak-one;
        color: $uni-general-color-two;

        image {
            width: #{40rpx};
            height: #{40rpx};
        }

        &>view.box-grow-1 {
            width: 50%;
        }
    }
    .u-topic {
        min-height: 100vh;
        background-color: #ffffff;
    }
</style>