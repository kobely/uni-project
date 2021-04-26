<template>
	<app-layout>
        <view v-if="!loading" class="u-goods-detail"></view>
		<template v-else>
            <!--商品轮播图-->
            <app-goods-banner
                :picList="picUrl"
                :isCart="false"
                :share="goods.share"
                :goods_id="goodsId"
                :video-url="goods.video_url"
                sign="booking"
            ></app-goods-banner>
           <view>
               <bd-name
                   :theme="getTheme"
                   :name="goods.name"
                   :is-negotiable="goods.is_negotiable"
                   :subtitle="goods.subtitle"
                   :level-show="goods.level_show"
                   :price="goods.price"
                   :original-price="goods.original_price"
                   :price-max="goods.price_max"
                   :price-min="goods.price_min"
                   :price-member-max="goods.price_member_max"
                   :price-member-min="goods.price_member_min"
                   :discount='discount'
                   :is-vip-card-user="is_vip_card_user"
                   :sales="goods.sales"
                   :unit="goods.unit"
                   :is-sales="goods.is_sales"
                   :is-vip="is_vip"
                   :goods-id="goods.id"
                   :extra-quick-share="goods.extra_quick_share"
                   :app-share-pic="goods.app_share_pic"
                   :app-share-title="goods.app_share_title"
                   :poster-config="poster_config"
                   :poster-generate="poster_generate"
                   :has-poster-nav="true"
                   v-bind:goods="goods"
                   @share="hShareAppMessage"
				   :min-number="goods.min_number"
				   :limit-buy="goods.limit_buy"
               ></bd-name>
           </view>
            <bd-coupon @change="setCoupon" :theme="getTheme" :coupons="goods.goods_coupon_center"></bd-coupon>
            <bd-xbc
                :coAttr="is_open"
                :attr-list="checked && checked.attr_list"
                :type="goods.type"
                :guarantee-title="goods.guarantee_title"
                :guarantee-pic="goods.guarantee_pic"
                :param_content="goods.param_content"
                :param_name="goods.param_name"
                :services="goods.services"
                :attr-groups="goods.attr_groups"
                :goods-stock="goods.goods_num"
                @openAttr="open"
            ></bd-xbc>
            <bd-hc
                :integral="goods.goods_marketing_award.integral"
                :coupon="goods.goods_marketing_award.coupon"
                :card="goods.goods_marketing_award.card"
                :balance="goods.goods_marketing_award.balance"
                :theme="getTheme"
            ></bd-hc>
            <bd-kb
                :limit="goods.goods_marketing && goods.goods_marketing.limit"
                :express="goods.express"
                :shipping="goods.goods_marketing && goods.goods_marketing.shipping"
                :pickup="goods.goods_marketing && goods.goods_marketing.pickup"
            ></bd-kb>
			<view class="bd-store" v-if="store[0]">
				<app-store
					:store_id="store[0] && store[0].id"
					:address="store[0] && store[0].address"
					:name="store[0].name"
					:business_hours="store[0].business_hours"
					:storeNum="storeNum"
					:goods_id="goodsId"
				></app-store>
			</view>
            <bd-comments :goods-id="goods.id"></bd-comments>
            <bd-detail :detail="goods.detail"></bd-detail>
            <!--相关推荐-->
            <app-related-suggestion-product :theme="getTheme" sign="booking" :list="list" ></app-related-suggestion-product>
            <!-- 底部空格 -->
            <view class="safe-area-inset-bottom">
                <view class="u-bottom-height" :class="full_reduce ? 'u-bottom-height-1' : 'u-bottom-height-0'"></view>
            </view>
            <!-- 底部按钮 -->
            <view v-if="is_open == 1" class="safe-area-inset-bottom u-bottom-fixed">
                <view v-if="full_reduce">
                    <app-goods-full-reduce
                        :theme="getTheme"
                        sign="book"
                        :full_reduce="full_reduce"
                    >
                    </app-goods-full-reduce>
                </view>
                <view class="bd-bottom dir-left-nowrap cross-center">
                    <view class="u-back dir-top-nowrap main-center cross-center box-grow-0" @click="router('/pages/index/index')">
                        <image class="u-icon" src="../../../static/image/icon/index.png"></image>
                        <text class="u-text">首页</text>
                    </view>
                    <bd-service :name="goods.name" :url="webUrl"></bd-service>
                    <view v-if="goods.goods_num > 0" :style="{'background': goods.buy_goods_auth ? getTheme.background_gradient_btn : '#9999999'}" class="u-btn box-grow-1"  @click="open">
                        立即预约
                    </view>
                    <view v-else class="u-btn u-oversell-btn box-grow-1" >已售罄</view>
                </view>
            </view>
            <u-attr
                :goods="goods"
                v-model="show"
                :theme="getTheme"
                :checked="checked"
                @check="check"
                :is_show_left="false"
                right-text="立即预约"
                :right-func="true"
                @rightFunc="rightFunc"
            >
            </u-attr>
            <!-- 快捷导航 -->
            <app-quick-navigation></app-quick-navigation>
		</template>
        <app-close v-if="showClose" :modal="false" @update="getMall"></app-close>
	</app-layout>
</template>

<script>
    import { mapState,mapGetters } from 'vuex';
    import appGoodsBanner from '../../../components/page-component/goods/app-goods-banner.vue';
    import appStore from '../components/app-store.vue';
    import appRelatedSuggestionProduct from '../../../components/page-component/app-related-suggestion-product/app-related-suggestion-product.vue';
    import appQuickNavigation from "../../../components/page-component/app-quick-navigation/app-quick-navigation.vue";
    import AppVipCard from '../../../components/page-component/app-vip-card/app-vip-card';
	import appGoodsFullReduce from '../../../components/page-component/goods/app-goods-full-reduce.vue';
    import uAttr from '../../../components/page-component/goods/u-attr.vue';
    import bdName from '@/components/page-component/goods/bd-info.vue';
    import bdCoupon from '@/components/page-component/goods/bd-coupon.vue';
    import bdXbc from '@/components/page-component/goods/bd-xbc.vue';
    import bdKb from '@/components/page-component/goods/bd-kb.vue';
    import bdHc from '@/components/page-component/goods/bd-hc.vue';
    import bdDetail from '@/components/page-component/goods/bd-detail.vue';
    import bdComments from '@/components/page-component/goods/bd-comments.vue';
    import appClose from '@/components/basic-component/app-close/app-close.vue';
    import bdService from '@/components/page-component/goods/bd-service.vue';

    export default {
        name: 'goods',
        components: {
            'app-goods-banner': appGoodsBanner,
            'app-store': appStore,
            'app-related-suggestion-product': appRelatedSuggestionProduct,
            'app-quick-navigation': appQuickNavigation,
            'app-vip-card': AppVipCard,
            uAttr,
            appClose,
			appGoodsFullReduce,
            bdName,
            bdCoupon,
            bdXbc,
            bdKb,
            bdHc,
            bdDetail,
            bdComments,
            bdService
        },
        data() {
            return {
                showClose: false,
                is_open: 0,
                goods: {
					goods_activity: {
						full_reduce: {}
					},
                    goods_marketing: {}
				},
                goods_marketing: {},
                full_reduce: null,
                selectAttr: {},
                activeIndex: 0,
                list: [],
                url: '',
                webUrl: '',
                cartShow: true,
                is_vip: false,
                is_vip_card_user: 0,
                discount: null,
                goods_id: 0,
                poster_config: this.$api.book.poster_config,
                poster_generate: this.$api.book.poster_generate,
                // 规格选中
                checked: null,
                // 规格显示
                show: false,
                // 详情loading
                loading: false,
                // 门店列表
                store: null,
                storeNum: null,
                // 商品服务
                services: null,
                // 商品标题
                name: null,
                // 商品ID
                goodsId: null,
                // 商品轮播图
                picUrl: null,
				disable: 'disable'
            }
        },
        onShow() {
            this.showClose = false;
            setTimeout(()=>{
                this.showClose = true;
            })
        },
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            let { app_share_title, goods_id, name} = this.goods;
            return this.$shareTimeline({
                title: app_share_title ? app_share_title : name,
                query: {
                    goods_id: goods_id
                }
            });
        },
        // #endif
        onLoad(options) { this.$commonLoad.onload(options);
            this.webUrl = '/plugins/book/goods/goods?goods_id=' + options.goods_id;
            this.goods_id = options.goods_id;
            this.request(options.goods_id);
            this.newRecommend(options.goods_id);
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
        },
        // #ifdef MP
        onShareAppMessage() {
            this.hShareAppMessage();
        },
        // #endif
        methods: {
            hShareAppMessage(s = false){
                let { app_share_title, app_share_pic, goods_id, name, subtitle} = this.goods;
                return this.$shareAppMessage({
                    path: '/plugins/book/goods/goods',
                    title: app_share_title ? app_share_title : name,
                    imageUrl: app_share_pic ? app_share_pic : this.picUrl[0].pic_url,
                    desc: subtitle,
                    params: {
                        goods_id: goods_id
                    }
                },s);
            },
            getMall(e) {
                this.is_open = e.is_open;
            },
            check({item}) {
                this.checked = item;
            },
            rightFunc(data) {
                uni.navigateTo({
                    url: `/pages/order-submit/order-submit?mch_list=${JSON.stringify([data])}&preview_url=${encodeURIComponent(this.$api.book.order_preview)}&submit_url=${encodeURIComponent(this.$api.book.order_submit)}&plugin=booking`
                });
            },
            newRecommend(id) {
                this.$request({
                    url: this.$api.goods.new_recommend,
                    data: {
                        goods_id: id
                    }
                }).then(response => {
                    if (response.code === 0) {
                        this.list = response.data.list;
                    }
                })
            },
            open() {
				if (!this.goods.buy_goods_auth) {
                    this.$tips.showToast({
                        title: '您暂无权限购买该商品',
                        icon: 'none'
                    });
                    return;
				}
                this.show = true;
            },
            setCoupon(index) {
                this.$set(this.goods.goods_coupon_center[index], 'is_receive', 1);
            },
            router: function(url) {
                uni.navigateTo({
                    url: url
                });
            },
            request(goods_id) {
                let _this = this;
                // #ifdef MP
                uni.getLocation({
                    type: 'wgs84',
                    success(s){
                        _this.$showLoading();
                        _this.$request({
                            url: _this.$api.book.detail,
                            data: {
                                goods_id: goods_id,
                                latitude: s.latitude,
                                longitude: s.longitude,
                            }
                        }).then(r => {
                            if (r.code === 0) {
                                let list = r.data.list;
                                let { store, services, name, id, pic_url, goods_marketing } = r.data.list;
                                _this.item = list;
                                _this.goods = list;
                                if (list.goods_activity) {
                                    _this.full_reduce = list.goods_activity.full_reduce;
                                }
                                _this.store = store.slice(0, 1);
                                _this.storeNum = store.length;
                                _this.services = services;
                                _this.name = name;
                                _this.goodsId = id;
                                _this.picUrl = pic_url;
                                _this.goods_marketing = goods_marketing;
                                _this.url = `${_this.$api.book.poster}&goods_id=${id}`;
                                _this.poster_config = `${_this.poster_config}&goods_id=${id}`;
                                _this.poster_generate = `${_this.poster_generate}&goods_id=${id}`;
                                _this.loading = true;
                                if (list.vip_card_appoint.discount > 0) {
                                    _this.is_vip = true;
                                    _this.discount = list.vip_card_appoint.discount;
                                }
                                _this.is_vip_card_user = list.vip_card_appoint.is_vip_card_user;
                            }
                            _this.$hideLoading();
                        });
                    },
                    fail() {
                        uni.showToast({
                            title: '请开启位置权限',
                            icon: 'none',
                            duration: 2000,
                            success: function() {
                                setTimeout(() => {
                                    uni.navigateBack();
                                }, 2000);
                            }
                        });
                    }
                });
                // #endif
                // #ifdef H5
                this.$jwx.getLocation({
                    success(s) {
                        _this.$showLoading();
                        _this.$request({
                            url: _this.$api.book.detail,
                            data: {
                                goods_id: goods_id,
                                latitude: s.latitude,
                                longitude: s.longitude,
                            }
                        }).then(r => {
                            if (r.code === 0) {
                                let list = r.data.list;
                                let { store, services, name, id, pic_url, goods_marketing } = r.data.list;
                                _this.goods = list;
                                if (list.goods_activity) {
                                    _this.full_reduce = list.goods_activity.full_reduce;
                                }
                                _this.store = store.slice(0, 1);
                                _this.storeNum = store.length;
                                _this.services = services;
                                _this.name = name;
                                _this.goodsId = id;
                                _this.picUrl = pic_url;

                                _this.url = `${_this.$api.book.poster}&goods_id=${id}`;
                                _this.poster_config = `${_this.poster_config}&goods_id=${id}`;
                                _this.poster_generate = `${_this.poster_generate}&goods_id=${id}`;
                                _this.loading = true;
                                if (list.vip_card_appoint.discount > 0) {
                                    _this.is_vip = true;
                                    _this.discount = list.vip_card_appoint.discount;
                                }
                                _this.is_vip_card_user = list.vip_card_appoint.is_vip_card_user;
                                _this.hShareAppMessage();
                            }
                            _this.$hideLoading();
                        });
                    },
                    fail() {
                        uni.showToast({
                            title: '请开启位置权限',
                            icon: 'none',
                            duration: 2000,
                            success: function() {
                                setTimeout(() => {
                                    uni.navigateBack();
                                }, 2000);
                            }
                        });
                    }
                });
                // #endif
            }
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
        }
    }
</script>

<style scoped lang="scss">

    .goods-subtitle {
        padding: #{24rpx};
        padding-top: 0;
        font-size: 24rpx;
        background-color: #ffffff;
        color: #999999;
    }
    .goods-margin {
        margin-top: 20upx;
    }
    .vip-card {
        padding: 20upx 20upx;
        background-color: #fff;
    }
    .u-bottom-height-0 {
        height: 110upx;
    }
    .u-bottom-height-1 {
        height: 190upx;
    }
    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1602;
        background-color: #ffffff;
        box-shadow: 0 -1rpx 20rpx -15rpx #353535;
    }
    .bd-bottom {
        width: 750upx;
        height: 110upx;
        padding: 20upx 24upx;
    }
    .u-btn {
        line-height: 70upx;
        color: #ffffff;
        font-size: 28upx;
        text-align: center;
        border-radius: 35upx;
    }
    .u-oversell-btn {
        background-color: #CDCDCD;
    }
    .u-back {
        width: 66upx;
        height: 100%;
        margin-right: 20upx;
    }
    .u-icon {
        width: 30upx;
        height: 30upx;
        margin-bottom: 8upx;
    }
    .u-text {
        font-size: 20upx;
        color: #888888;
        line-height: 1;
    }
    .bd-store {
        width: 702upx;
        border-radius: 15upx;
        margin: 24upx 24upx 0 24upx;
        overflow: hidden;
    }
</style>
