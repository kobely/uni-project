<template>
    <app-layout>
        <view v-if="!goods" class="u-goods-detail"></view>
        <view class="app-goods" v-show="loading" v-if="goods">
            <app-banner
                :videoUrl="goods.video_url"
                :share="goods.share"
                :picList="goods.pic_url"
                :goods_id="goods_id"
                :isCart="false"
                sign="exchange"
            ></app-banner>
            <bd-info
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
                :flash-sale="flash_sale"
                :goods-id="goods.id"
                :extra-quick-share="goods.extra_quick_share"
                :app-share-pic="goods.app_share_pic"
                :app-share-title="goods.app_share_title"
                :poster-config="posterConfig"
                :poster-generate="posterGenerate"
                :has-poster-nav="true"
                v-bind:goods="goods"
                :share-url="url"
                :has-underline-price="false"
                @share="hShareAppMessage"
				:min-number="0"
				:limit-buy="goods.limit_buy"
            >
            </bd-info>
            <bd-coupon v-if="goods.goods_coupon_center" @change="setCoupon" :theme="getTheme" :coupons="goods.goods_coupon_center"></bd-coupon>
            <bd-xbc
                v-if="goods"
                :coAttr="false"
                :guarantee-title="goods.guarantee_title"
                :guarantee-pic="goods.guarantee_pic"
                :param_content="goods.param_content"
                :param_name="goods.param_name"
                :services="goods.services"
            ></bd-xbc>
            <!--商品信息-->
            <bd-hc
                v-if="goods.goods_marketing_award"
                :integral="goods.goods_marketing_award.integral"
                :coupon="goods.goods_marketing_award.coupon"
                :card="goods.goods_marketing_award.card"
                :balance="goods.goods_marketing_award.balance"
                :theme="getTheme"
            ></bd-hc>
            <bd-comments v-if="goods_id > 0" :goods-id="goods_id"></bd-comments>
            <bd-detail :detail="goods.detail"></bd-detail>
            <!-- 底部空格 -->
            <view class="safe-area-inset-bottom">
                <view :class="[uBottomHeight]"></view>
            </view>
            <!-- 底部按钮 -->
            <view v-if="is_open" class="safe-area-inset-bottom u-bottom-fixed">
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
				<app-jump-button form>
                <view  class="buttons dir-left-nowrap">
                    <view class="app-button main-center cross-center">
                        <view @click="toExchange" v-if="goods.goods_num > 0 && !goods.is_finish_sell" class="app-exhange" :style="{'background': !goods || goods.buy_goods_auth ? getTheme.background_gradient_btn : '#999999'}">
                            {{rightRemindText}}
                        </view>
                        <view class="app-over" :class="[disableBtn]" v-else>
                            {{disableBtnText}}
                        </view>
                    </view>
                </view>
				</app-jump-button>
            </view>
        </view>
        <app-close v-if="showClose" :modal="false" @update="getMall"></app-close>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appBanner from '../../../components/page-component/goods/app-goods-banner.vue';
    import appGoodsFullReduce from '../../../components/page-component/goods/app-goods-full-reduce.vue';
    import appClose from '@/components/basic-component/app-close/app-close.vue';
    import bdInfo from '@/components/page-component/goods/bd-info';
    import bdCoupon from '@/components/page-component/goods/bd-coupon.vue';
    import bdXbc from '@/components/page-component/goods/bd-xbc.vue';
    import bdKb from '@/components/page-component/goods/bd-kb.vue';
    import bdHc from '@/components/page-component/goods/bd-hc.vue';
    import bdDetail from '@/components/page-component/goods/bd-detail.vue';
    import bdComments from '@/components/page-component/goods/bd-comments.vue';
    import appSellTip from '@/components/page-component/goods/app-sell-tip.vue';
	import goodsMixin from '@/core/goods-mixin.js';

    export default {
        name: 'goods',
		mixins: [goodsMixin],
        data() {
            return {
                showClose: false,
                is_open: false,
                goods: {
                    id: '',
                    name: '',
                    cover_pic: '',
                    price: '',
                },
                posterConfig: this.$api.exchange.poster_config,
                posterGenerate: this.$api.exchange.poster_generate,
                url: '',
                is_vip: false,
                is_vip_card_user: 0,
                show: false,
                list: [],
                goods_id: -1,
                loading: false,
                first: true,
                discount: null,
                flash_sale: null,
                full_reduce: null,
				disable: 'disable',
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
            this.goods_id = +options.goods_id;
            this.posterConfig = this.posterConfig + '&goods_id=' + this.goods_id;
            this.posterGenerate = this.posterGenerate + '&goods_id=' + this.goods_id;
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.request({
                url: this.$api.exchange.detail,
                data: {
                    id: this.goods_id,
                }
            }).then(response => {
                if(response) {
                    this.first = false;
                    let { goods } = response;
                    this.goods = goods;
                    this.loading = true;
                    this.url = `${this.$api.goods.poster}&goods_id=${this.goods.id}`;
                    if(this.goods.vip_card_appoint.discount) {
                        this.is_vip = true;
                        this.discount = this.goods.vip_card_appoint.discount
                    }
                    this.full_reduce = goods.goods_activity.full_reduce;
                    this.flash_sale = this.goods.plugin_extra.flash_sale;
                    this.is_vip_card_user = this.goods.vip_card_appoint.is_vip_card_user;
                    // #ifdef H5
                    this.hShareAppMessage();
                    // #endif
                    this.$hideLoading();
                }
            });
        },
        onShow() {
            this.showClose = false;
            setTimeout(()=>{
                this.showClose = true;
            })
            if(this.first) {
                return false
            }
            this.$showLoading();
            this.$nextTick(() => {
                this.request({
                    url: this.$api.exchange.detail,
                    data: {
                        id: this.goods_id,
                    }
                }).then(response => {
                    let { goods } = response;
                    this.goods = goods;
                    this.loading = true;
                    this.full_reduce = goods.goods_activity.full_reduce;
                    this.url = `${this.$api.goods.poster}&goods_id=${this.goods.id}`;
                    if(this.goods.vip_card_appoint.discount) {
                        this.is_vip = true;
                        this.discount = this.goods.vip_card_appoint.discount
                    }
                    this.flash_sale = this.goods.plugin_extra.flash_sale;
                    this.is_vip_card_user = this.goods.vip_card_appoint.is_vip_card_user;
                    this.$hideLoading();
                });
            })
        },
        computed: {
            ...mapState('gConfig',{
                iphone: (data) => {
                    return data.iphone;
                },
                iphoneHeight: (state) =>{
                    return  state.iphoneHeight;
                },
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                mall: state => state.mallConfig.mall,
                userInfo: state => state.user.info,
				isTip: state => state.mallConfig.mall.setting.is_remind_sell_time
            }),
            themeObject:function() {
                return {
                    back: this.getTheme + '-m-back ' + this.getTheme,
                    backO: this.getTheme + '-m-back-o ' + this.getTheme,
                    theme: this.getTheme,
                    color: this.getTheme + '-m-text ' + this.getTheme,
                    sBack: this.getTheme + '-s-back ' + this.getTheme
                }
            },
			buyBtn() {
				if (!this.goods || this.goods.buy_goods_auth) {
					return this.getTheme + '-m-gradient-o ' + this.getTheme
				} else {
					return this.disable + '-m-back ' + this.disable;
				}
			},
			uBottomHeight() {
				if (this.full_reduce && this.goods.sell_time > 0) {
					return 'u-bottom-height-2';
				} else if (this.full_reduce || this.goods.sell_time > 0) {
					return 'u-bottom-height-1';
				} else {
					return 'u-bottom-height-0';
				}
			},
			leftTip() {
				let leftTip = '';
				if (!(this.isTip == 0 && this.goods.sell_time > 0)) {
					leftTip = 'bd-btn-left bd-btn-half';
				} else {
					leftTip = 'box-grow-1';
				}
				return this.goods && this.goods.type === 'goods' ? leftTip : '';
			},
			disableBtn() {
				if (this.goods.is_finish_sell || this.goods.sell_time > 0) {
					return 'btn-finish-sell';
				} else {
					return 'bd-oversell-btn';
				}
			},
			disableBtnText() {
				if (this.goods.is_finish_sell) {
					return '商品已下架';
				} else if (this.goods.sell_time > 0) {
					return '商品未开售';
				} else {
					return '已售罄';
				}
			},
			remindParams() {
				return {
					sell_time: this.goods.sell_time,
					goods_id: this.goods.id,
					template_message_list: this.goods.template_message_list,
					buy_text: '立即购买'
				};
			},
        },
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            // 分享朋友圈beta
            return this.$shareTimeline({
                title: this.goods.app_share_title ? this.goods.app_share_title : this.goods.name,
                imageUrl: this.goods.pic_url[0].pic_url,
                query: {
                    goods_id: this.goods.id
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
                    path: '/plugins/exchange/goods/goods',
                    title: this.goods.app_share_title ? this.goods.app_share_title : this.goods.name,
                    imageUrl: this.goods.app_share_pic ? this.goods.app_share_pic : this.goods.pic_url[0].pic_url,
                    desc: this.goods.subtitle,
                    params: {
                        goods_id: this.goods.id,
                    }
                },s);
            },
            getMall(e) {
                this.is_open = e.is_open == 1 ? true : false;
            },
            toExchange() {
				if (!this.goods.buy_goods_auth) {
					this.$tips.showToast({
						title: '您暂无权限购买该商品',
						icon: 'none'
					});
					return;
				}
				if (this.goods.sell_time > 0) {
					this.rightTip();
					return ;
				}
				if (typeof this.goods.limit_buy !== 'undefined' && this.goods.limit_buy.status == 1 && this.goods.limit_buy.rest_number < 1) {
                    this.$tips.showToast({
                        title: this.goods.limit_buy.text,
                        icon: 'none'
                    });
					return false;
				}
                let attr = [];
                for (let i in this.goods.attr[0].attr_list) {
                    attr.push({
                        attr_id: this.goods.attr[0].attr_list[i].attr_id,
                        attr_group_id: this.goods.attr[0].attr_list[i].attr_group_id
                    });
                }
                let mch_list = [{
                    mch_id: 0,
                    goods_list: [{
                        id: this.goods.id,
                        attr: attr,
                        num: 1,
                        cat_id: 0,
                        goods_attr_id: this.goods.attr[0].id
                    }]
                }];
                let url = `/pages/order-submit/order-submit?mch_list=${JSON.stringify(mch_list)}`;
                url += `&preview_url=${encodeURIComponent(this.$api.exchange.order_preview)}&submit_url=${encodeURIComponent(this.$api.exchange.order_submit)}&plugin=exchange`;
                uni.navigateTo({
                    url: url
                })
            },
            async request({url, data}) {
                const response = await this.$request({
                    url: url,
                    data: data,
                });
                if (response.code === 0) {
                    return response.data;
                }else {
                    uni.showModal({
                        title: '提示',
                        content: response.msg,
                        showCancel: false,
                        success: function (res) {
                            uni.navigateBack();
                        }
                    });
                }
            },
            setCoupon(index) {
                this.$set(this.goods.goods_coupon_center[index], 'is_receive', 1);
            },
			changeTime(time) {
				this.goods.sell_time = time;
			},
        },
        components: {
            'app-banner': appBanner,
            appClose,
            appGoodsFullReduce,
            bdInfo,
            bdCoupon,
            bdXbc,
            bdKb,
            bdHc,
            bdDetail,
            bdComments,
			appSellTip
        }
    }
</script>

<style lang="scss">
    .buttons {
        width: #{750rpx};
        height: #{110rpx};
        border-top: #{1rpx} solid #e2e2e2;
        .app-button {
            width: 100%;
            height: #{110rpx};
            text-align: center;
            line-height: #{110rpx};
            background-color: #fff;
            .app-exhange {
                width: #{702rpx};
                color: #fff;
                border-radius: #{41rpx};
                height: #{82rpx};
                line-height: #{82rpx};
                font-size: #{28rpx};
            }
            .app-over {
                width: #{702rpx};
                border-radius: #{41rpx};
                height: #{82rpx};
                line-height: #{82rpx};
                font-size: #{28rpx};
            }
			.bd-oversell-btn {
				background: #e9e9e9;
                color: #999999;
			}
			.btn-finish-sell {
				background: linear-gradient(to right, rgba(153, 153, 153, 1), rgba(153, 153, 153, 0.7)) ;
				color: #ffffff;
			}
        }
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
    }
    .u-bottom-height-2 {
        height: 270upx;
    }
</style>