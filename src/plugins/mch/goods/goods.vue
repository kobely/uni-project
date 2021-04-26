<template>
    <app-layout>
        <view v-if="!goods" class="u-goods-detail"></view>
        <template v-if="goods">
            <!--商品轮播图-->
            <app-goods-banner
                :pic-list="goods.pic_url"
                :share="goods.share"
                :goods_id="id"
                sign="mch"
                :video-url="goods.video_url"
            ></app-goods-banner>
            <view>
                <bd-info
                    :theme="getTheme"
                    :name="goods.name"
                    :subtitle="goods.subtitle"
                    :level-show="goods.level_show"
                    :flash-sale="flash_sale"
                    :price="goods.price"
                    :original-price="goods.original_price"
                    :price-max="goods.price_max"
                    :price-min="goods.price_min"
                    :price-member-max="goods.price_member_max"
                    :price-member-min="goods.price_member_min"
                    :sales="goods.sales"
                    :unit="goods.unit"
                    :is-sales="goods.is_sales"
                    :goods-id="goods.id"
                    :extra-quick-share="goods.extra_quick_share"
                    :app-share-pic="goods.app_share_pic"
                    :app-share-title="goods.app_share_title"
                    :poster-config="poster_config + `&goods_id=` + goods.id + `&mch_id=` + goods.mch_id"
                    :poster-generate="poster_generate + `&goods_id=` + goods.id + `&mch_id=` + goods.mch_id"
                    :has-poster-nav="true"
                    :share-url="poster + `&goods_id=` + goods.id + `&mch_id=` + goods.mch_id"
                    v-bind:goods="goods"
                    @share="hShareAppMessage"
					:limit-buy="goods.limit_buy"
					:min-number="goods.min_number"
                ></bd-info>
            </view>
            <template v-if="mch_store">
                <view class="shop-info dir-left-nowrap cross-center" :clas="mch_store.distance ? 'shop-info-2' : 'shop-info-1'">
                    <image @click="navShop" class="box-grow-0" :src="mch_store.store.cover_url"></image>
                    <view @click="navShop" class="dir-top-nowrap box-grow-1">
                        <view class="store-name t-omit">{{mch_store.store.name}}</view>
                        <view class="dir-left-nowrap">
                            <view class="store-num">商品数量: {{mch_store.goods_count}}</view>
                            <view>已售: {{mch_store.order_goods_count}}</view>
                        </view>
                    </view>
                    <view class="box-grow-0">
                        <view @click="navService" v-if="mch_setting.is_web_service"
                              class="contain main-center cross-center dir-top-nowrap">
                            <image class="store-icon-contain"
                                   :src="mch_setting.web_service_pic ? mch_setting.web_service_pic : `../image/goods-contact.png`"></image>
                            <view class="store-contain">客服</view>
                        </view>
                        <view v-else class="main-center store-btn">
                            <view class="shop-btn" @click="navShop">进店逛逛</view>
                        </view>
                    </view>
                </view>
                <view v-if="mch_store.distance"  class="shop-address dir-left-nowrap cross-top">
                    <view class="dir-top-nowrap box-grow-1">
                        <view class="address">{{mch_store.store.address}}</view>
                        <view class="km">距离{{mch_store.distance}}</view>
                    </view>
                    <view @click="navMap" class="box-grow-0 icon-address main-center">
                        <image src="../image/summary-address.png"></image>
                    </view>
                </view>
            </template>
            <bd-xbc
                :coAttr="is_open"
                :attr-list="selectAttr && selectAttr.attr_list"
                :type="goods.type"
                :guarantee-title="goods.guarantee_title"
                :guarantee-pic="goods.guarantee_pic"
                :param_content="param_content"
                :param_name="goods.param_name"
                :services="goods.services"
                :attr-groups="goods.attr_groups"
                :goods-stock="goods.goods_stock"
                @openAttr="clickAttr()"
            ></bd-xbc>
            <bd-hc
                :integral="goods.goods_marketing_award.integral"
                :coupon="goods.goods_marketing_award.coupon"
                :card="goods.goods_marketing_award.card"
                :balance="goods.goods_marketing_award.balance"
                :theme="getTheme"
            ></bd-hc>
            <bd-kb
                :limit="goods.goods_marketing.limit"
                :express="goods.express"
                :shipping="goods.goods_marketing.shipping"
                :pickup="goods.goods_marketing.pickup"
            ></bd-kb>
            <bd-comments :goods-id="goods.id"></bd-comments>
            <bd-detail :detail="goods.detail"></bd-detail>
            <!--相关推荐-->
            <view class="recommend">
                <view class="recommend-title dir-left-nowrap main-center">
                    <view class="dir-left-nowrap cross-center">
                        <view class="border"></view>
                        <image src="/static/image/icon/icon-favorite.png"></image>
                        <view style="color: #353535;">您或许喜欢</view>
                        <view class="border"></view>
                    </view>
                </view>
                <view class="recommend-list">
                    <u-ordinary-list :is-under-line-price="isListUnderlinePrice == 1 ? true : false" :isShowAttr="true" :list="recommend_list" :theme="getTheme" :list-style="2"></u-ordinary-list>
                </view>
            </view>
            <!-- 底部空格 -->
            <view class="safe-area-inset-bottom">
                <view class="u-bottom-height" :class="[uBottomHeight]"></view>
            </view>
            <!-- 底部按钮 -->
            <view v-if="is_open == 1" class="safe-area-inset-bottom u-bottom-fixed">
                <view v-if="full_reduce">
                    <app-goods-full-reduce
                        :theme="getTheme"
                        :full_reduce="full_reduce"
                    >
                    </app-goods-full-reduce>
                </view>
				<view v-if="goods.sell_time > 0">
					<app-sell-tip :time="goods.sell_time" @changeTime="changeTime"></app-sell-tip>
				</view>
                <view class="bd-bottom dir-left-nowrap" >
                    <view class="bd-back dir-top-nowrap main-center cross-center box-grow-0" @click="navShop">
                        <image class="bd-icon" src="../../../static/image/icon/icon-mch.png"></image>
                        <text>店铺</text>
                    </view>
                    <view class="bd-back dir-top-nowrap main-center cross-center box-grow-0" @click="back">
                        <image class="bd-icon" src="../../../static/image/icon/index.png"></image>
                        <text>首页</text>
                    </view>
                    <view class="bd-back dir-top-nowrap main-center cross-center box-grow-0" @click="favorite">
                        <image class="bd-icon" :src="goods.favorite ? '../../../static/image/icon/icon-favorite-active.png' : '../../../static/image/icon/icon-favorite.png'"></image>
                        <text>收藏</text>
                    </view>
                    <view class="box-grow-1 dir-left-nowrap">
                        <template v-if="goods.goods_stock > 0 && !goods.is_finish_sell">
                            <view class="bd-button"
                                  :class="[leftTip]"
                                  :style="{'background': !goods || goods.buy_goods_auth ? getTheme.background_s_gradient_btn : '#999999','color': !goods || goods.buy_goods_auth ? getTheme.secondary_text : ''}"
                                  @click="clickAttr">
                                加入购物车
                            </view>
							<view class="bd-button" v-if="!(isTip == 0 && goods.sell_time > 0)">
								<app-jump-button form>
									<view 
                            :style="{'background': goods.buy_goods_auth ? getTheme.background_gradient_btn : '#999999','color': goods.buy_goods_auth ? getTheme.main_text : '', 'width': '100%'}"
							class="bd-btn-right box-grow-1"  @click="buyClick"
                            >{{rightRemindText}}
									</view>
								</app-jump-button>
							</view>
                        </template>
                        <view v-else class="bd-btn" :class="[disableBtn]">{{goods.is_finish_sell ? '商品已下架' : '已售罄'}}</view>
                    </view>
                </view>
            </view>
            <u-attr
                v-model="attrShow"
                :goods="goods"
                :theme="getTheme"
                :checked="selectAttr"
                @check="onAttr"
            >
            </u-attr>
        </template>
        <app-close v-if="showClose" :mch_id="mch_id" :modal="false" @update="getMall"></app-close>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from "vuex";
    import appGoodsBanner from "@/components/page-component/goods/app-goods-banner.vue";
    import appGoodsFullReduce from "@/components/page-component/goods/app-goods-full-reduce";
    import uOrdinaryList from '@/components/page-component/u-goods-list/u-ordinary-list.vue';
    import uAttr from '@/components/page-component/goods/u-attr.vue';
    import bdInfo from '@/components/page-component/goods/bd-info';
    import bdXbc from '@/components/page-component/goods/bd-xbc.vue';
    import bdKb from '@/components/page-component/goods/bd-kb.vue';
    import bdHc from '@/components/page-component/goods/bd-hc.vue';
    import bdDetail from '@/components/page-component/goods/bd-detail.vue';
    import bdComments from '@/components/page-component/goods/bd-comments.vue';
    import appClose from '@/components/basic-component/app-close/app-close.vue';
    import appSellTip from '@/components/page-component/goods/app-sell-tip.vue';
	import goodsMixin from '@/core/goods-mixin.js';

    export default {
        name: "goods",
		mixins: [goodsMixin],
        components: {
            appGoodsBanner,
            uOrdinaryList,
            uAttr,
            appGoodsFullReduce,
            bdInfo,
            bdXbc,
            bdKb,
            bdHc,
            bdDetail,
            bdComments,
            appClose,
			appSellTip
        },
        data() {
            return {
                showClose: false,
                is_open: 0,
                goods: null,
                full_reduce: null,
                selectAttr: null,
                recommend_list: null,
                attrShow: false,
                id: 0,
                mch_id: 0,
                mch_store: null,
                mch_setting: null,
                flash_sale: null,
                poster: this.$api.mch.poster,
                poster_config: this.$api.mch.poster_config,
                poster_generate: this.$api.mch.poster_generate,
                param_content: [],
				disable: 'disable'
            };
        },
        computed: {
            ...mapState({
                mall: state => state.mallConfig.mall,
                isListUnderlinePrice: state => state.mallConfig.mall.setting.is_list_underline_price,
				isTip: state => state.mallConfig.mall.setting.is_remind_sell_time
            }),
            ...mapState('gConfig', {
                iphone: (data) => {
                    return data.iphone;
                },
                iphoneHeight: (state) => {
                    return state.iphoneHeight;
                },
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
			uBottomHeight() {
				if (this.full_reduce && this.goods && this.goods.sell_time > 0) {
					return 'u-bottom-height-2';
				} else if (this.full_reduce || (this.goods && this.goods.sell_time > 0)) {
					return 'u-bottom-height-1';
				} else {
					return 'u-bottom-height-0';
				}
			},
			leftTip() {
				let leftTip = '';
				if (!(this.isTip == 0 && this.goods && this.goods.sell_time > 0)) {
					leftTip = 'bd-btn-left';
				} else {
					leftTip = 'box-grow-1';
				}
				return leftTip;
			},
			disableBtn() {
				return this.goods && this.goods.is_finish_sell ? 'btn-finish-sell' : 'bd-oversell-btn';
			},
			remindParams() {
				if (!this.goods) {
					return {};
				}
				return {
					sell_time: this.goods.sell_time,
					goods_id: this.goods.id,
					template_message_list: this.goods.template_message_list,
					buy_text: '立即购买'
				};
			},
        },
        onLoad(options) { this.$commonLoad.onload(options);
            [this.mch_id, this.id] = [options.mch_id, options.id];
            this.getAddress();
            this.loadRecommend();
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                withShareTicket: true,
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
        },
        onShow() {
            this.showClose = false;
            setTimeout(()=>{
                this.showClose = true;
            })
        },
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            return this.$shareTimeline({
                title: this.goods.app_share_title ? this.goods.app_share_title : this.goods.name,
                query: {
                    id: this.id,
                    mch_id: this.mch_id,
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
            hShareAppMessage(s = false){
                return this.$shareAppMessage({
                    title: this.goods.app_share_title ? this.goods.app_share_title : this.goods.name,
                    imageUrl: this.goods.app_share_pic ? this.goods.app_share_pic : this.goods.pic_url[0].pic_url,
                    path: '/plugins/mch/goods/goods',
                    desc: this.goods.subtitle,
                    params: {
                        id: this.id,
                        mch_id: this.mch_id,
                    }
                }, s);
            },
            getMall(e) {
                this.is_open = e.is_open;
            },
            // setCoupon(index) {
            //     this.$set(this.goods.goods_coupon_center[index], 'is_receive', 1);
            // },
            getAddress() {
                const self = this;
                uni.getLocation({
                    type: 'wgs84',
                    success(res) {
                        self.getMch(res.latitude, res.longitude);
                    },
                    fail(e) {
                        self.getMch(0, 0);
                    }
                });
            },

            getMch(latitude, longitude) {
                const self = this;
                self.$showLoading();
                self.$request({
                    url: self.$api.mch.detail,
                    data: {
                        id: self.mch_id,
                        latitude: latitude,
                        longitude: longitude,
                    }
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        [self.mch_store, self.mch_setting] = [info.data.detail, info.data.mchSetting];
                        self.getDetail();
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: info.msg,
                            showCancel: false,
                            success: function (e) {
                                if (e.confirm) {
                                    uni.navigateBack({delta: 1});
                                }
                            }
                        });
                    }
                }).catch(() => {
                    self.$hideLoading();
                })
            },

            getDetail() {
                this.$showLoading();
                this.$request({
                    url: this.$api.mch.goods_detail,
                    data: {
                        id: this.id,
                        mch_id: this.mch_id
                    }
                }).then(e => {
                    this.$hideLoading();
                    if (e.code === 0) {
                        let { goods_activity } = e.data.detail;
                        this.goods = e.data.detail;
                        // #ifdef H5
                        this.hShareAppMessage();
                        // #endif
                        let { param_content } = e.data.detail;
                        this.param_content = param_content;
                        if (goods_activity) {
                            this.full_reduce = goods_activity.full_reduce;
                        }
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: e.msg,
                            showCancel: false
                        });
                    }
                }).catch(() => {
                    this.$hideLoading();
                });
            },

            loadRecommend() {
                const self = this;
                self.$request({
                    url: self.$api.goods.new_recommend,
                    data: {
                        goods_id: self.id,
                    },
                    method: 'get'
                }).then(info => {
                    if (info.code === 0) {
                        this.recommend_list = info.data.list;
                    }
                });
            },

            navMap() {
                uni.openLocation({
                    latitude: parseFloat(this.mch_store.store.latitude),
                    longitude: parseFloat(this.mch_store.store.longitude),
                    name: this.mch_store.store.name,
                    address: this.mch_store.store.address,
                })
            },

            onAttr({item}) {
                this.selectAttr = item;
            },

            navService() {
                uni.navigateTo({url: `/pages/web/web?url=` + this.mch_setting.web_service_url});
            },

            navShop() {
                uni.redirectTo({url: `/plugins/mch/shop/shop?mch_id=` + this.mch_id});
            },

            back() {
                uni.redirectTo({
                    url: '/pages/index/index'
                });
            },

            favorite() {
                this.goods.favorite ? this.goods.favorite = false :  this.goods.favorite = true;
                this.$request({
                    url: !this.goods.favorite ? this.$api.user.favorite_remove : this.$api.user.favorite_add,
                    data: {
                        goods_id: this.goods.id,
                    }
                }).then(e => {
                    if (e.code !== 0) {
                        uni.showModal({
                            title: '提示',
                            content: e.msg,
                            showCancel: false
                        });
                    }
                });
            },

            clickAttr() {
                if (!this.goods.buy_goods_auth) {
                    uni.showToast({
                        title: '您暂无权限购买该商品',
                        icon: 'none'
                    });
                    return;
                }
                if (this.goods.type === 'ecard') {
                    uni.showToast({
                        title: '虚拟商品不允许加入购物车',
                        icon: 'none'
                    });
                    return;
                }
                this.attrShow = true;
            },
			changeTime(time) {
				this.goods.sell_time = time;
			},
			buyClick() {
				if (this.goods.sell_time > 0) {
					this.rightTip();
				} else{
					this.clickAttr();
				}
			},
        },
    }
</script>

<style scoped lang="scss">
    .goods-name {
        padding: #{24rpx};
        background-color: #ffffff;
        color: $uni-important-color-black;
    }

    .goods-subtitle {
        padding: #{24rpx};
        padding-top: 0;
        font-size: 24rpx;
        background-color: #ffffff;
        color: #999999;
    }


    .attr {
        padding: #{24rpx} 0;
        background-color: #f7f7f7;
    }

    .recommend {
        .recommend-title {
            margin: #{40rpx} 0 #{32rpx} 0;
            font-size: $uni-font-size-weak-one;
            color: $uni-general-color-two;

            .border {
                border-top: #{2rpx} solid #bbbbbb;
                height: 0;
                width: #{40rpx};
                margin: 0 #{24rpx};
            }

            image {
                width: #{24rpx};
                height: #{24rpx};
                display: block;
                margin-right: #{12rpx};
            }
        }
    }

    .shop-btn {
        height: #{64rpx};
        border: #{1px} solid #cdcdcd;
        color: #666666;
        background: #FFFFFF;
        width: #{146rpx};
        line-height: #{64rpx};
        border-radius: #{32rpx};
        text-align: center;
    }

    .bd-bottom {
        height: 110upx;
        width: 750upx;
        padding: 20upx 24upx;
    }
    .bd-back {
        width: 66upx;
        height: 100%;
        margin-right: 20upx;
        font-size: 20upx;
        color: #888888;
    }
    .bd-icon {
        width: 30upx;
        height: 30upx;
    }
    .bd-button {
        text-align: center;
        line-height: 70upx;
        font-size: 26upx;
        border-radius: 35upx;
        width: 50%;
    }
    .bd-btn-left {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .bd-btn-right {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 35upx;
        border-bottom-right-radius: 35upx;
        color: #ffffff;
    }
    .bd-btn {
        color: #ffffff;
        width: 100%;
        text-align: center;
        line-height: 70upx;
        font-size: 26upx;
        border-radius: 35upx;
    }

    .comments {
        margin-bottom: #{20rpx};
        background-color: #ffffff;
    }

    .detail {
        background-color: #ffffff;

        image {
            width: 100%;
            height: #{80rpx};
            display: block;
        }
    }
    .shop-info-1 {
        border-radius: 15upx;
    }
    .shop-info-2 {
        border-radius: 15upx 15upx 0 0;
    }
    .shop-info {
        height: #{124rpx};
        color: #999999;
        font-size: #{24rpx};
        background: #FFFFFF;
        width: 702upx;
        margin: 24upx 24upx 0 24upx;
        > image {
            border-radius: #{8rpx};
            margin: 0 #{20rpx};
            height: #{80rpx};
            width: #{80rpx}
        }

        .store-name {
            line-height: 1.5em;
            font-size: #{32rpx};
            color: #353535;
            margin-bottom: #{16rpx};
        }

        .store-num {
            margin-right: #{32rpx};
        }

        .contain {
            width: #{152rpx};
            height: 100%;

            image {
                height: #{40rpx};
                width: #{40rpx};
                display: block;
            }

            view {
                margin-top: #{8rpx};
            }
        }

        .store-btn {
            margin: 0 #{20rpx};
        }
    }

    .shop-address {
        width: 702rpx;
        margin: 0 24upx 24upx 24upx;
        padding: 20upx;
        font-size: #{24rpx};
        background: #FFFFFF;
        border-radius: 0 0 15upx 15upx;
        .address {
            color: #666666;
            max-height: #{560rpx};
        }

        .km {
            color: #999999;
            margin-top:#{10rpx};
        }

        .icon-address {
            width: #{120rpx};
            border-left: 1px solid #e2e2e2;
        }

        image {
            height: #{32rpx};
            width: #{32rpx};
            display: block;
        }
    }
    .text {
        color: #ffffff;
    }
    .goods-margin {
        margin-top: 20upx;
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
    .bd-oversell-btn {
        background-color: #CDCDCD;
    }
	.btn-finish-sell {
		background: linear-gradient(to right, rgba(153, 153, 153, 1), rgba(153, 153, 153, 0.7)) ;
	}
    .u-bottom-height-2 {
        height: 270upx;
    }
    .bd-oversell-btn {
        background-color: #CDCDCD;
    }
</style>
