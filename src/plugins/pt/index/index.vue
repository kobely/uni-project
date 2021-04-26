<template>
	<app-layout>
		<view class="app-pt-index">
			<view class="index-nav" v-if="nav_list.length > 0">
                <view class="app-index-nav dir-left-nowrap cross-center">
                    <view class="app-search">
                        <app-jump-button form open_type="navigate" url="/pages/search/search?sign=pt">
                            <view class="app-icon"></view>
                        </app-jump-button>
                    </view>
                    <view class="app-line"></view>
                    <scroll-view scroll-x class="app-scroll">
                        <text class="app-item" v-for="(item) in nav_list"
                              :key="item.id"
                              :style="{'background': cat_id == item.id ? getTheme.key === 'a' ? 'linear-gradient(140deg, #ffa360, #ff5c5c)' :  getTheme.background : '','color': cat_id == item.id ? '#ffffff' : ''}"
                              @click="changeStatus(item.id)"
                        >{{item.name}}</text>
                    </scroll-view>
                </view>
			</view>
            <!--#ifdef MP-->
			<view class="banner" v-if="banners.length !== 0">
                <swiper class="app-banner" autoplay interval="2000"  circular easing-function="easeInOutCubic">
                    <swiper-item v-for="(item, k) in banners" :key="k">
                        <app-jump-button form :open_type="item.open_type" :item="item" :params="item.params" :url="`${item.page_url}`">
                            <image class="app-image" :src="item.pic_url" lazy-load></image>
                        </app-jump-button>
                    </swiper-item>
                </swiper>
			</view>
            <!--#endif-->
            <!--#ifdef H5-->
            <app-swiper :height="230" :list="banners" :autoplay="true" name="pic_url"></app-swiper>
            <!--#endif-->
			<view class="image-ad" v-if="setting.is_advertisement == 1">
				<app-image-ad :list="setting.advertisement.list" :imageStyle="imageStyle"></app-image-ad>
			</view>
			<view class="app-list safe-area-inset-bottom">
				<app-product-list :theme="getTheme" :list="goods_list"></app-product-list>
			</view>
            <app-quick-navigation></app-quick-navigation>
		</view>
	</app-layout>
</template>

<script>
    import appImageAd from '../../../components/page-component/app-image-ad/app-image-ad.vue';
	import appProductList from '../components/app-product-list.vue';
    import appQuickNavigation from "../../../components/page-component/app-quick-navigation/app-quick-navigation.vue";
    import appSwiper from '../../../components/page-component/app-swiper/app-swiper.vue';
	import {mapState, mapGetters} from "vuex";

    export default {
        name: 'index',
	    data() {
            return {
                banners: [],
                setting: {},
                nav_list: [],
	            page: 1,
                page_count: 1,
                goods_list: [],
                cat_id: 0,
	            imageStyle: 0
            }
	    },
	    onLoad(option) { this.$commonLoad.onload(option);
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
            option.cat_id && (this.cat_id = option.cat_id);
            this.requestSetting();
            this.requestCats(option.cat_id);
	    },
        onReachBottom() {
            if (this.page < this.page_count) {
                this.page++;
                this.requestList(1);
            }
        },
	    methods: {
            async changeStatus(id) {
                this.cat_id = id;
                this.page = 1;
                this.goods_list = [];
                this.requestList(0);
            },
			async requestList(status) {
				const r = await this.$request({
					url: this.$api.pt.goods,
					data: {
						page: this.page,
						cat_id: this.cat_id,
					}
				});
				if(r.code === 0) {
				    let { pagination, list } = r.data;
                    this.goods_list = 1 === status ? this.goods_list.concat(list) : list;
					this.page_count = pagination.page_count;
				}
			},
            requestSetting() {
              this.$request({
                  url: this.$api.pt.index
              }).then(e => {
                    if (e.code === 0) {
                        this.banners = e.data.banners;
                        // #ifdef H5
                        this.banners.forEach(item => {
                            if (item.open_type === 'app') {
                                item.id = this.$utils.guid('pt');

                            }
                        })
                        // #endif
                        this.setting = e.data.setting;
                        let ad = e.data.setting.advertisement;
                        let list = [];
                        for (let i = 0, len = ad.list.length; i < len; i++) {
                            let item = ad.list[i];
                            item.link = {
                                value: item.link_url,
                                open_type: item.open_type
                            }
                            list.push(item);
                        }
                        this.setting.advertisement.list = list;
                        this.imageStyle = Number(ad.style);
                    }
              });
            },
            requestCats(cat_id) {
                this.$request({
                    url: this.$api.pt.cats
                }).then(res => {
                    if (res.code === 0) {
                        this.nav_list = this.nav_list.concat(res.data.list);
                        !cat_id && (this.cat_id = this.nav_list[0].id);
                        this.requestList(0);
                    }
                });
            }
	    },
		computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
		},
        components: {
            'app-image-ad': appImageAd,
	        'app-product-list': appProductList,
            'app-quick-navigation': appQuickNavigation,
            appSwiper
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                path: '/plugins/pt/index/index',
                title: this.$children[0].navigationBarTitle,
            });
        },
        // #endif
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            return this.$shareTimeline({
                title: this.$children[0].navigationBarTitle,
                query: {
                }
            });
        },
        // #endif
    }
</script>

<style scoped lang="scss">
	.app-pt-index {
		background-color: #f7f7f7;
        min-height: 100vh;
		.index-nav {
			width: #{750rpx};
			height: #{92rpx};
		}
		.banner {
			margin-bottom: #{24rpx};
		}
		.app-list {
			margin-top: #{20rpx};
		}

	}
    .app-banner {
        height: #{230rpx};
        width: #{750rpx};
        .app-image {
            height: #{230rpx};
            width: #{750rpx};
        }
    }
    .app-index-nav {
        height: #{92rpx};
        background-color: white;
        width: #{750rpx};
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        .app-search {
            width: #{108rpx};
            height: #{92rpx};
            .app-icon {
                width: #{60rpx};
                height: #{60rpx};
                background-image: url("../image/big-sarch.png");
                background-size: 100% 100%;
                background-repeat: no-repeat;
            }
        }
        .app-line {
            width: #{1rpx};
            height: #{40rpx};
            background-color: #e2e2e2;
        }
        .app-scroll {
            width: #{641rpx};
            height: #{92rpx};
            white-space: nowrap;
            .app-item {
                display: inline-block;
                font-size: #{28rpx};
                color: #666666;
                padding: 0 #{24rpx};
                box-sizing: border-box;
                height: #{56rpx};
                line-height: #{56rpx};
                border-radius: #{28rpx};
                margin: #{18rpx} #{32rpx};
            }
            .app-active-item {
                color: white;
            }
            .default-item {
                background: linear-gradient(140deg, #ffa360, #ff5c5c);
            }
        }
    }
</style>
