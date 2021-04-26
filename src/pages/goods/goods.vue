<template>
    <app-layout>
        <view v-if="!goods" class="u-goods-detail"></view>
        <template v-if="goods">
            <!--商品轮播图-->
            <app-goods-banner
                v-bind:pic-list="goods.pic_url"
                v-bind:share="goods.share"
                v-bind:video-url="goods.video_url"
                v-bind:goods_id="goodsId"
            ></app-goods-banner>
            <view>
                <bd-info
                    :theme="getTheme"
                    :name="name"
                    :is-negotiable="is_negotiable"
                    :subtitle="subtitle"
                    :flash-sale="flash_sale"
                    :level-show="level_show"
                    :price="price"
                    :original-price="original_price"
                    :price-max="price_max"
                    :price-min="price_min"
                    :price-member-max="price_member_max"
                    :price-member-min="price_member_min"
                    :discount='discount'
                    :is-vip-card-user="is_vip_card_user"
                    :sales="sales"
                    :is-vip="is_vip"
                    :unit="unit"
                    :is-sales="is_sales"
                    :goods-id="goodsId"
                    :extra-quick-share="extra_quick_share"
                    :app-share-pic="app_share_pic ? app_share_pic: goods.pic_url[0].pic_url"
                    :app-share-title="app_share_title ? app_share_title : name"
                    :poster-config="poster_config + `&goods_id=` + goodsId"
                    :poster-generate="poster_generate + `&goods_id=` + goodsId"
                    :has-poster-nav="true"
                    v-bind:goods="goods"
                    @share="hShareAppMessage"
                    @quickShare="quickShare"
					:limit-buy="limit_buy"
					:min-number="min_number"
                ></bd-info>
            </view>
            <!--商品优惠券-->
            <bd-coupon @change="setCoupon" :theme="getTheme" :coupons="goods_coupon_center"></bd-coupon>
            <!--商品规格-->
            <bd-xbc
                :coAttr="is_open == 1 && exchangeStatus ==null ? 1 : 0"
                :attr-list="checked && checked.attr_list"
                :type="goodsType"
                :guarantee-title="guarantee_title"
                :guarantee-pic="guarantee_pic"
                :param_content="param_content"
                :param_name="param_name"
                :services="services"
                :attr-groups="attr_groups"
                :goods-stock="goods_num"
                @openAttr="clickAttr"
            ></bd-xbc>
            <!--商品信息-->
            <bd-hc
                :integral="goods_marketing_award.integral"
                :coupon="goods_marketing_award.coupon"
                :card="goods_marketing_award.card"
                :balance="goods_marketing_award.balance"
                :theme="getTheme"
            ></bd-hc>
            <bd-kb
                :limit="goods_marketing.limit"
                :express="express"
                :shipping="goods_marketing.shipping"
                :pickup="goods_marketing.pickup"
            ></bd-kb>
            <!--套餐组合-->
            <view @click="toComposition" class="goods-composition" v-if="composition && composition.list.length > 0">
                <view class="goods-composition-title">套餐组合</view>
                <uni-swiper-dot :current="current" :theme="getTheme" :info="composition.list" mode="customize">
                    <swiper @change="change" class="goods-composition-swiper" :current="current" :autoplay="true">
                        <swiper-item v-for="item in composition.list" :key="item.id">
                            <app-composition :theme="getTheme"  @click="toComposition(item)" @look="toComposition(item)" :item="item"></app-composition>
                        </swiper-item>
                    </swiper>
                </uni-swiper-dot>
                <view class="goods-composition-more main-between cross-center">
                    <view>更多套餐组合</view>
                    <image src="/static/image/icon/arrow-right.png"></image>
                </view>
            </view>
            <bd-comments :goods-id="goodsId"></bd-comments>
            <!--商品详情-->
            <bd-detail :detail="detail"></bd-detail>
            <!--相关推荐-->
            <app-goods-recommend :sureCart="true" :theme="getTheme" :goods-list="recommend_list"></app-goods-recommend>
            <!--空格区域-->
            <view class="safe-area-inset-bottom u-bottom">
                <view class="u-bottom-height" :class="uBottomHeight"></view>
            </view>
            <!--底部按钮-->
            <view v-if="is_open == 1" class="safe-area-inset-bottom u-bottom-fixed">
                <view v-if="full_reduce && exchangeStatus == null">
                    <app-goods-full-reduce
                        :theme="getTheme"
                        :full_reduce="full_reduce"
                        :sign="goodsType === 'goods' ? '' : 1"
                    >
                    </app-goods-full-reduce>
                </view>
				<view v-if="exchangeStatus == null && sell_time > 0">
					<app-sell-tip :time="sell_time" @changeTime="changeTime"></app-sell-tip>
				</view>
                <view class="bd-bottom u-bottom-height-0 cross-center dir-left-nowrap" >
                    <template v-if="exchangeStatus == null">
                        <view class="bd-back dir-top-nowrap main-center cross-center box-grow-0" @click="back">
                            <image class="bd-icon" src="../../static/image/icon/index.png"></image>
                            <text class="bd-text">首页</text>
                        </view>
                        <template v-if="is_negotiable !== 1">
                            <bd-service :name="name" :url="sendPath"></bd-service>
                        </template>
                        <view class="bd-back dir-top-nowrap main-center cross-center box-grow-0" @click="setFavorite">
                            <image class="bd-icon" :src="favorite ? '../../static/image/icon/icon-favorite-active.png' : '../../static/image/icon/icon-favorite.png'"></image>
                            <text class="bd-text">收藏</text>
                        </view>
                        <template v-if="is_negotiable !== 1">
                            <view class="box-grow-1 bd-btn bd-btn-color " :class="[disableBtn]" v-if="goods_num === 0 || is_finish_sell">
                                {{is_finish_sell ? '商品已下架' : '已售罄'}}
                            </view>
                            <view class="box-grow-1 dir-left-nowrap" v-else>
                                <view v-if="goods.type === 'goods'"
                                      @click="clickAttr(0)"
                                      :style="{'background': !goods || goods.buy_goods_auth ? getTheme.background_s_gradient_btn : '#999999','color': !goods || goods.buy_goods_auth ? getTheme.secondary_text : '#ffffff'}"
                                      :class="['bd-btn', leftTip
                                  ]"
                                >
                                    加入购物车
                                </view>
								<view :class="[goods.type === 'goods' ? 'bd-btn-right bd-btn-half' : 'box-grow-1']" v-if="!(isTip == 0 && sell_time > 0)">		
								<app-jump-button form>
                                <view
                                    @click="clickAttr(1)"
                                    :style="{'background': goods.buy_goods_auth ? getTheme.background_gradient_btn : '#999999','color': goods.buy_goods_auth ? getTheme.main_text : ''}"
                                    :class="['bd-btn', 'bd-btn-color', 'box-grow-1', goods.type === 'goods' ? 'bd-btn-right' : '']"
                                >{{rightRemindText}}
                                </view>
								</app-jump-button>
								</view>
                            </view>
                        </template>
                        <view class="box-grow-1 dir-left-nowrap bd-btn-tel" v-else>
                            <block v-for="(item, index) in good_negotiable" :key="index">
                                <view class="tel"
                                      v-if="item === 'contact_tel'"
                                      @click="makePhoneCall(mall.setting.contact_tel)"
                                      :style="{'background': good_negotiable.length === 1 ? getTheme.background_gradient_btn : getTheme.background_s_gradient_btn,'color': good_negotiable.length === 2 ? getTheme.color : ''}"
                                      :class="[good_negotiable.length === 1 ? 'all-radius all-width text ' : '', good_negotiable.length === 3 ? 'bd-three-one text ' : '', good_negotiable.length === 2 ? 'bd-btn-half' : '']"
                                >
                                    联系电话
                                </view>
                                <!-- #ifndef MP-TOUTIAO || MP-ALIPAY || H5 -->
                                <button v-else-if="item === 'contact'"
                                        open-type="contact"
                                        show-message-card
                                        :send-message-title="name"
                                        :send-message-path="sendPath"
                                        :style="contactBtnStyle"
                                        class="contact" :class="contactBtn">
                                    客服
                                </button>
                                <!-- #endif -->
                                <view class="service"
                                      v-else-if="item === 'contact_web'"
                                      @click="router('/pages/web/web?url=' + encodeURIComponent(mall.setting.web_service_url))"
                                      :style="{'background': good_negotiable.length !== 3 ? getTheme.background_gradient_btn : '','color': good_negotiable.length === 1 ? getTheme.secondary_text : ''}"
                                      :class="good_negotiable.length === 3 ? 'default-bakground bd-three-one ' : good_negotiable.length === 2 ? 'bd-btn-half text ' : ' all-radius all-width '" >
                                    客服
                                </view>
                            </block>
                        </view>
                    </template>
                    <template v-else>
                        <view v-if="exchangeStatus == 0" @click="toExchange" class="box-grow-1 bd-exchange" :style="{'background': getTheme.background_gradient_o}">
                            立即领取
                        </view>
                        <view class="box-grow-1 bd-exchange bd-over" v-else-if="exchangeStatus == 1">
                            已领取
                        </view>
                    </template>
                </view>
            </view>
            <!--快捷导航-->
            <app-quick-navigation></app-quick-navigation>
            <u-attr
                v-if="is_negotiable === 0 && exchangeStatus ==null"
                v-model="attrShow"
                :goods="goods"
                :theme="getTheme"
                :checked="checked"
                @check="check"
            >
            </u-attr>
        </template>
        <app-close v-if="showClose" :modal="false" @update="getMall"></app-close>
    </app-layout>
</template>

<script>
	import {mapGetters, mapState} from "vuex";
    import appGoodsBanner from "../../components/page-component/goods/app-goods-banner.vue";
    import appGoodsRecommend from "../../components/page-component/app-goods-recommend/app-goods-recommend.vue";
    import appQuickNavigation from "../../components/page-component/app-quick-navigation/app-quick-navigation.vue";
    import appComposition from'../../components/basic-component/app-composition/app-composition.vue';
    import uniSwiperDot from '../../components/basic-component/uni-swiper-dot/uni-swiper-dot';
    import uAttr from '../../components/page-component/goods/u-attr.vue';
	import appGoodsFullReduce from '../../components/page-component/goods/app-goods-full-reduce.vue';
	import bdInfo from '@/components/page-component/goods/bd-info';
    import bdCoupon from '@/components/page-component/goods/bd-coupon.vue';
    import bdXbc from '@/components/page-component/goods/bd-xbc.vue';
    import bdKb from '@/components/page-component/goods/bd-kb.vue';
    import bdHc from '@/components/page-component/goods/bd-hc.vue';
    import bdDetail from '@/components/page-component/goods/bd-detail.vue';
    import bdComments from '@/components/page-component/goods/bd-comments.vue';
    import appClose from '@/components/basic-component/app-close/app-close.vue';
    import bdService from '@/components/page-component/goods/bd-service.vue';
    import bdFlashSale from '@/components/page-component/goods/bd-flash-sale.vue';
    import appSellTip from '@/components/page-component/goods/app-sell-tip.vue';
	import goodsMixin from '@/core/goods-mixin.js';

    export default {
        name: "goods",
		mixins: [goodsMixin],
        components: {
            appGoodsBanner,
            'app-goods-recommend': appGoodsRecommend,
            'app-quick-navigation': appQuickNavigation,
            'app-composition': appComposition,
            appClose,
            uniSwiperDot,
			appGoodsFullReduce,
            uAttr,
            bdInfo,
            bdCoupon,
            bdXbc,
            bdKb,
            bdHc,
            bdDetail,
            bdComments,
            bdService,
            bdFlashSale,
			appSellTip
        },
        data() {
            return {
                showClose: false,
                is_open: 0,
                goods: null,
                selectAttr: null,
                recommend_list: null,
                is_vip: false,
                is_vip_card_user: 0,
                current: 0,
                discount: null,
                attrShow: false,
                shareData: null,
				contact_tel:'',
				contact: '',
				contact_web:'',
                sendPath: '',
                poster_config: this.$api.goods.poster,
                poster_generate: this.$api.poster.goods_new,
                // 限时抢购
				flash_sale: null,
                checked: null,
                // 商品服务
                services: null,
                // 商品详情
                detail: null,
                // 商品ID
                goodsId: null,
                // 套餐组合
                composition: null,
                autoplay: true,
                full_reduce: null,
                goods_marketing_award: null,
                express: null,
                goods_marketing: null,
                exchangeStatus: null,
                exchange: null,

                price: null,
                level_show: null,
                sales: null,
                unit: null,
                is_sales: null,
                extra_quick_share: null,
                price_max: null,
                price_min: null,
                price_member_max: null,
                price_member_min: null,
                original_price: null,
                subtitle: null,
                is_negotiable: null,
                name: null,
                app_share_pic: null,
                app_share_title: null,
                goodsType: null,
                favorite: null,
                goods_coupon_center: null,
                guarantee_title: null,
                guarantee_pic: null,
                param_content: null,
                param_name: null,
                attr_groups: null,
                goods_num: null,
                good_stock: null,
                min_number: null,
                limit_buy: null,
				disable: 'disable',
				sell_time: 0,
				template_message_list: [],
				is_finish_sell: false
            };
        },
        computed: {
            ...mapState({
                mall: state => state.mallConfig.mall,
                gConfig: state => state.gConfig,
				isTip: state => state.mallConfig.mall.setting.is_remind_sell_time
            }),
			...mapGetters('mallConfig', {
				getTheme: 'getTheme',
			}),
			good_negotiable: function() {
            	let good_negotiable = this.mall.setting.good_negotiable;
            	this.contact_tel = '';
				this.contact = '';
				this.contact_web = '';
            	let arr = [];
            	for (let i = 0; i < good_negotiable.length; i++) {
            		if (good_negotiable[i] === 'contact_tel') {
						this.contact_tel = 'contact_tel';
					}
                    // #ifndef MP-TOUTIAO || MP-ALIPAY || H5
                    if (good_negotiable[i] === 'contact') {
						this.contact = 'contact';
					}
                    // #endif
					if (good_negotiable[i] === 'contact_web') {
						this.contact_web = 'contact_web';
					}
				}
            	if (this.contact_tel) {
					arr.push(this.contact_tel);
				}
				if (this.contact) {
					arr.push(this.contact);
				}
				if (this.contact_web) {
					arr.push(this.contact_web);
				}
				return arr;
			},
            contactBtnStyle: function() {
                const len = this.good_negotiable.length;
                const theme = this.getTheme.key;
                if (len === 3 && (theme === 'a' || theme === 'b' || theme === 'f')) {
                    return `background:${this.getTheme.background_gradient_btn}`;
                } else if (len === 3 && !(theme === 'a' ||  theme === 'b' || theme === 'f')) {
                    return `background:${this.getTheme.background_gradient_btn};color:${this.getTheme.background_s}`;
                } if (len === 2 && (theme === 'a' || theme === 'b' || theme === 'f') && !this.contact_tel) {
                    return `background:${this.getTheme.background_s_gradient_btn};`;
                } else if (len === 2 && (theme === 'a' || theme === 'b' || theme === 'f') && this.contact_tel) {
                    return `background:${this.getTheme.background}`;
                } else if (len === 2 && !(theme === 'a' || theme === 'b' || theme === 'f') && !this.contact_tel) {
                    return `background:${this.getTheme.background_s_gradient_btn};color:${this.getTheme.background_s}`;
                } else if (len === 2 && !(theme === 'a' || theme === 'b' || theme === 'f') && this.contact_tel) {
                    return `background:${this.getTheme.background_gradient_btn};color:${this.getTheme.background_s}`;
                } else {
                    return `background:${this.getTheme.background_gradient_btn}`;
                }
            },
			uBottomHeight() {
				if (this.full_reduce && this.sell_time > 0) {
					return 'u-bottom-height-2';
				} else if (this.full_reduce || this.sell_time > 0) {
					return 'u-bottom-height-1';
				} else {
					return 'u-bottom-height-0';
				}
			},
			leftTip() {
				let leftTip = '';
				if (!(this.isTip == 0 && this.sell_time > 0)) {
					leftTip = 'bd-btn-left bd-btn-half';
				} else {
					leftTip = 'box-grow-1';
				}
				return this.goods && this.goods.type === 'goods' ? leftTip : '';
			},
			disableBtn() {
				return this.is_finish_sell ? 'btn-finish-sell' : 'bd-oversell-btn';
			},
            contactBtn: function() {
                const len = this.good_negotiable.length;
                const theme = this.getTheme.key;
                if (len === 3 && (theme === 'a' || theme === 'b' || theme === 'f')) {
                    return `text bd-three-one bd-no-radius `;
                } else if (len === 3 && !(theme === 'a' ||  theme === 'b' || theme === 'f')) {
                    return `bd-three-one bd-no-radius `;
                } if (len === 2 && (theme === 'a' || theme === 'b' || theme === 'f') && !this.contact_tel) {
                    return `text bd-btn-half bd-content-radius-0`;
                } else if (len === 2 && (theme === 'a' || theme === 'b' || theme === 'f') && this.contact_tel) {
                    return `bd-btn-half bd-content-radius-1`;
                } else if (len === 2 && !(theme === 'a' || theme === 'b' || theme === 'f') && !this.contact_tel) {
                    return `bd-btn-half bd-content-radius-0`;
                } else if (len === 2 && !(theme === 'a' || theme === 'b' || theme === 'f') && this.contact_tel) {
                    return `bd-btn-half bd-content-radius-1`;
                } else {
                    return `text all-width all-radius `;
                }
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
            if (this.isLogin) {
                this.$store.dispatch('user/info');
            }
            this.goodsId = options.id;
            // #ifndef MP-ALIPAY
            this.loadData(this.goodsId, options);
            // #endif
            this.sendPath = '/pages/goods/goods?id=' + options.id;
            console.log(this.sendPath)
            if(options && options.exchange) {
                this.exchangeStatus = options.exchange;
                this.exchange = options;
            }
        },
        onShow() {
            this.autoplay = true;
            this.showClose = false;
            setTimeout(()=>{
                this.showClose = true;
                // #ifdef MP-ALIPAY
                this.loadData(this.goodsId, this.exchange);
                // #endif
            });
        },
        onHidden() {
            this.autoplay = false;
        },
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            // 分享朋友圈beta
            return this.$shareTimeline({
                title: this.app_share_title ? this.app_share_title : this.name,
                imageUrl: this.goods.pic_url[0].pic_url,
                query: {
                    id: this.goodsId
                }
            });
        },
        // #endif
        methods: {
            hShareAppMessage(s = false) {
                return this.$shareAppMessage({
                    title: this.app_share_title ? this.app_share_title : this.name,
                    imageUrl: this.app_share_pic ? this.app_share_pic : this.goods.pic_url[0].pic_url,
                    path: '/pages/goods/goods',
                    desc: this.subtitle,
                    params: {
                        id: this.goodsId
                    }
                }, s);
            },
            getMall(e) {
                this.is_open = e.is_open;
            },
            toExchange() {
                let mch_list = [{
                    mch_id: 0,
                    goods_list: [{
                        id: this.exchange.id,
                        attr: this.exchange.attr,
                        num: this.exchange.goods_num,
                        cat_id: 0,
                        goods_attr_id: this.exchange.attr_id
                    }],
                    code: this.exchange.code,
                    token: this.exchange.token,
                }];
                let url = `/pages/order-submit/order-submit?mch_list=${JSON.stringify(mch_list)}`;
                url += `&preview_url=${encodeURIComponent(this.$api.exchange.exchange_preview)}&submit_url=${encodeURIComponent(this.$api.exchange.exchange_submit)}&plugin=exchange`;
                uni.navigateTo({
                    url: url
                })
            },
            // 规格选择
            check({item}) {
                this.checked = item;
            },
            change(e) {
                if(e.detail.source === 'touch') {
                    this.current = e.detail.current;
                }
                if(e.detail.source === 'autoplay') {
                    this.current = e.detail.current;
                }
            },
            quickShare(info) {
                this.shareData = info;
                //#ifdef H5
                this.$shareAppMessage(this.shareData, true);
                // #endif
            },
            toComposition(item) {
                let id = item.id > 0 ? item.id : this.composition.list[0].id
                uni.navigateTo({
                    url: this.composition.url + '?goods_id=' + this.goodsId + '&composition_id=' + id
                })
            },
            loadData(id, options) {
                return new Promise((resolve, reject) => {
                    this.$showLoading();
                    this.$request({
                        url: this.$api.goods.detail,
                        data: {
                            id: id,
							plugin: options && options.exchange ? 'exchange' : 'mall'
                        }
                    }).then(response => {
                        this.$hideLoading();
                        if (response.code === 0) {
                            let { services,
                                detail, name,
                                vip_card_appoint, plugin_extra, id,
                                goods_activity, goods_marketing_award,
                                goods_marketing, express,
                                price, sales,
                                level_show, is_sales, unit, extra_quick_share,
                                price_max, price_min, price_member_max,
                                price_member_min, original_price, subtitle,
                                is_negotiable, app_share_title,
                                app_share_pic, type, favorite, goods_coupon_center,
                                guarantee_title, guarantee_pic, param_content,
                                param_name, attr_groups, goods_num, good_stock,
								min_number, limit_buy, sell_time, template_message_list,
								is_finish_sell
                            } = response.data.goods;
                            uni.setNavigationBarTitle({
                                title: name
                            });

                            this.name = name;
                            this.app_share_pic = app_share_pic;
                            this.app_share_title = app_share_title;
                            this.goods = response.data.goods;
                            this.services = services;
                            this.detail = detail;
                            this.goodsId = id;
                            this.flash_sale = plugin_extra.flash_sale;
                            this.composition = plugin_extra.composition;
                            this.goods_marketing_award = goods_marketing_award;
                            this.goods_marketing = goods_marketing;
                            this.express = express;
                            this.price = price;
                            this.level_show = level_show;
                            this.sales = sales;
                            this.unit = unit;
                            this.is_sales = is_sales;
                            this.price_max = price_max;
                            this.price_min = price_min;
                            this.price_member_max = price_member_max;
                            this.price_member_min = price_member_min;
                            this.original_price = original_price;
                            this.subtitle = subtitle;
                            this.is_negotiable = is_negotiable;
                            this.extra_quick_share = extra_quick_share;
                            this.goodsType = type;
                            this.favorite = favorite;
                            this.goods_coupon_center = goods_coupon_center;
                            this.guarantee_title = guarantee_title;
                            this.param_content = param_content;
                            this.guarantee_pic = guarantee_pic;
                            this.attr_groups = attr_groups;
                            this.param_name = param_name;
                            this.goods_num = goods_num;
                            this.good_stock = good_stock;
                            this.min_number = min_number;
                            this.limit_buy = limit_buy;
							this.sell_time = sell_time;
							this.template_message_list = template_message_list;
							this.is_finish_sell = is_finish_sell;
                            if (goods_activity) {
                                this.full_reduce = goods_activity.full_reduce;
                            }
                            if(vip_card_appoint.discount || vip_card_appoint.discount === '0.00') {
                                this.is_vip = true;
                                this.discount = vip_card_appoint.discount
                            }
                            this.is_vip_card_user = vip_card_appoint.is_vip_card_user;
                            this.loadRecommend();
                            // #ifdef H5
                            this.hShareAppMessage();
                            // #endif
                            resolve();
                        } else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none'
                            });
                            reject();
                        }
                    }).catch(() => {
                        reject();
                        this.$hideLoading();
                    });
                });
            },
            onAttr(data) {
                this.selectAttr = data;
            },
            loadRecommend() {
                this.$request({
                    url: this.$api.goods.new_recommend,
                    data: {
                        goods_id: this.goodsId,
                        type: 'goods'
                    }
                }).then(response => {
                    if (response.code === 0) {
                        this.recommend_list = response.data.list;
                    }
                });
            },
            back() {
                uni.reLaunch({
                    url: '/pages/index/index'
                });
            },
            setFavorite() {
                let url = this.$api.user.favorite_add;
                let favorite = true;
                if (this.favorite) {
                    url = this.$api.user.favorite_remove;
                    favorite = false;
                }
                this.favorite = favorite;
                this.$request({
                    url: url,
                    data: {
                        goods_id: this.goodsId
                    }
                }).then(response => {
                    if (response.code === 0) {
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: response.msg,
                            showCancel: false
                        });
                    }
                });
            },
            clickAttr(data) {
				if (data === 1 && this.sell_time > 0) {
					this.rightTip();
					return ;
				}
				if (!this.goods.buy_goods_auth) {
                    this.$tips.showToast({
                        title: '您暂无权限购买该商品',
                        icon: 'none'
                    });
                    return;
				}
                if (this.goods.type === 'ecard' && data === 0) {
                    this.$tips.showToast({
                        title: '虚拟商品不允许加入购物车',
                        icon: 'none'
                    });
                    return;
                }
                this.attrShow = true;
            },
            setCoupon(index) {
                this.$set(this.goods_coupon_center[index], 'is_receive', 1);
            },
            router(url) {
                uni.navigateTo({
                    url: url
                })
            },
            makePhoneCall(number) {
                uni.makePhoneCall({
                    phoneNumber: number
                });
            },
			changeTime(time) {
				this.sell_time = time;
				this.goods.sell_time = time;
			}
        },
        // #ifdef MP
        onShareAppMessage(object) {
            if (object.from === 'button' && this.shareData) {
                return this.$shareAppMessage(this.shareData);
            }
            return this.hShareAppMessage();
        },
        // #endif
    }
</script>

<style scoped lang="scss">
    .goods-composition {
        width: 702upx;
        margin: 20upx 20upx 0 20upx;
        padding: 20rpx;
        background-color: #fff;
        border-radius: 15upx;
        .goods-composition-title {
            font-size: 28rpx;
            color: #353535;
            margin-bottom: 20rpx;
        }
        .goods-composition-swiper {
            height: 194rpx;
        }
        .goods-composition-more {
            margin: 20rpx  auto 4rpx auto;
            width: 226rpx;
            padding: 0 24rpx;
            height: 56rpx;
            line-height: 54rpx;
            border-radius: 28rpx;
            border: 2rpx solid #bbbbbb;
            font-size: 24rpx;
            color: #999999;
            image {
                width: #{12rpx};
                height: #{22rpx};
            }
        }
    }
    .goods-name {
        padding: 24upx 24upx 0 24upx;
        background-color: #ffffff;
        color: #353535;
        font-size: 32upx;
        line-height: 42upx;
    }

    .goods-subtitle {
        padding: #{24rpx 24rpx 0 24rpx};
        font-size: 24rpx;
        background-color: #ffffff;
        color: #999999;
    }
    
	.price {
		padding-top: #{24rpx};
		background-color: #ffffff;
	}
    .vip-card {
        padding-bottom: #{20rpx};
        background-color: #fff;
    }
    .attr {
        background-color: #f7f7f7;
    }
    .bottom {
        width: 100%;
        height: #{110rpx};
    }

    .bd-bottom {
        width: 750upx;
        height: 110upx;
        padding: 20upx 24upx;
    }

    .bd-back {
        width: 66upx;
        height: 100%;
        margin-right: 20upx;
    }
    .bd-icon {
        width: 30upx;
        height: 30upx;
        margin-bottom: 8upx;
    }
    .bd-text {
        font-size: 20upx;
        color: #888888;
        line-height: 1;
    }
    .bd-btn {
        text-align: center;
        line-height: 70upx;
        font-size: 28upx;
        border-radius: 35upx;
    }
    .bd-btn-left {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .bd-btn-right {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    .bd-btn-half {
        width: 50%;
    }
    .bd-btn-color {
        color: #ffffff;
    }
    .bd-oversell-btn {
        background-color: #CDCDCD;
    }

    .bd-content-radius-0 {
        border-radius: 35upx 0 0 35upx;
    }
    .bd-content-radius-1 {
        border-radius:0 35upx 35upx 0;
    }
    .bd-btn-tel {
        font-size: 26upx;
        >view {
            line-height: 70upx;
            text-align: center;
        }
        .tel {
            border-top-left-radius: 35upx;
            border-bottom-left-radius: 35upx;
        }
        .contact {
            padding: 0;
            font-size: 26upx;
            height: 70upx;
            line-height: 70upx;
            margin: 0;
            border: none;
        }
        .service {
            border-top-right-radius: 35upx;
            border-bottom-right-radius: 35upx;
        }
        .all-radius {
            border-radius: 35upx;
        }
        .all-width {
            width: 100%;
        }
        .bd-three-one {
            width: calc(100%/3);
        }
        .bd-no-radius {
            border-radius: 0;
        }

    }
    .bd-exchange {
        line-height: 70upx;
        font-size: #{28rpx};
        text-align: center;
        color: #fff;
        border-radius: 35upx;
        &.bd-over {
            background: #e9e9e9;
            color: #999999;
        }
    }
	.text {
		color: #ffffff;
	}
	.default-bakground {
		background-color: #446dfd;
        color: #ffffff;
	}
    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1500;
        background-color: #ffffff;
        box-shadow: 0 -1rpx 20rpx -15rpx #353535;
    }
    .u-bottom-height-0 {
        height: 110upx;
    }
    .u-bottom-height-1 {
        height: 190upx;
    }
    .u-bottom-height-2 {
        height: 270upx;
    }
    .goods-margin {
        margin-top: 20upx;
    }
    .bd-goods {
        margin: 24 upx 24 upx 24 upx 24 upx;
    }
    .ecard-text {
        color: #999999;
    }

    .bd-content {
        padding: 0;
        display: block;
        background-color: #ffffff;
    }
    .bd-content-view {
        width:100%;
        height: 100%;
    }
	.btn-finish-sell {
		background: linear-gradient(to right, rgba(153, 153, 153, 1), rgba(153, 153, 153, 0.7)) ;
	}
</style>
