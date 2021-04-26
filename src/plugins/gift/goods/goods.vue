<template>
	<app-layout>
        <view v-if="!goods || !getTheme" class="u-goods-detail"></view>
		<view class="goods" v-if="goods && getTheme.color">
			<view class="page-width">
				<app-goods-banner
					v-bind:picList="goods.pic_url"
					v-bind:videoUrl="goods.video_url"
					v-bind:isCart="false"
                    v-bind:goods_id="goods_id"
					sign="gift"
                    v-bind:share="goods.share"
				></app-goods-banner>
			</view>
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
                :has-poster-nav="true"
                v-bind:goods="goods"
                :is-show-share="false"
                @share="hShareAppMessage"
				:limit-buy="goods.limit_buy"
				:min-number="goods.min_number"
            >
                <!--  #ifdef H5 -->
                <button slot="share" @click="hShareAppMessage" class="bd-share" open-type="share">
                <!--  #endif -->
                <!--  #ifdef MP -->
                <button slot="share" class="bd-share" open-type="share">
                <!--  #endif -->
                        <image src="/plugins/gift/image/begging-gift.png"></image>
                <!--  #ifdef MP -->
                </button>
                <!--  #endif -->
                <!--  #ifdef H5 -->
                </button>
                <!--  #endif -->
            </bd-info>
            <bd-coupon @change="setCoupon" :theme="getTheme" :coupons="goods.goods_coupon_center"></bd-coupon>
            <bd-xbc
                :coAttr="is_open"
                :attr-list="selectAttr.attr_list"
                :type="goods.type"
                :guarantee-title="goods.guarantee_title"
                :guarantee-pic="goods.guarantee_pic"
                :param_content="goods.param_content"
                :param_name="goods.param_name"
                :services="goods.services"
                :attr-groups="goods.attr_groups"
                :goods-stock="goods.goods_stock"
                @openAttr="clickAttr"
            ></bd-xbc>
            <bd-hc
                :integral="goods.goods_marketing_award&&goods.goods_marketing_award.integral"
                :coupon="goods.goods_marketing_award&&goods.goods_marketing_award.coupon"
                :card="goods.goods_marketing_award && goods.goods_marketing_award.card"
                :balance="goods.goods_marketing_award&&goods.goods_marketing_award.balance"
                :theme="getTheme"
            ></bd-hc>
            <bd-kb
                :limit="goods.goods_marketing && goods.goods_marketing.limit"
                :express="goods.express"
                :shipping="goods.goods_marketing && goods.goods_marketing.shipping"
                :pickup="goods.goods_marketing && goods.goods_marketing.pickup"
            ></bd-kb>
            <bd-comments :goods-id="goods.id"></bd-comments>
            <bd-detail :detail="goods.detail"></bd-detail>
			<!-- 相关推荐 -->
			<view class="app-recommend" v-if="goods_list.length > 0">
				<app-related-suggestion-product
					v-bind:list="goods_list"
                    sign="gift"
                    :theme="getTheme"
                ></app-related-suggestion-product>
            </view>
            <!-- 底部空格 -->
            <view class="safe-area-inset-bottom">
                <view class="u-bottom-height" :class="full_reduce ? 'u-bottom-height-1' : 'u-bottom-height-0'"></view>
            </view>
            <!-- 底部按钮 -->
            <view v-if="is_open == 1" class="safe-area-inset-bottom u-bottom-fixed">
                <view v-if="full_reduce">
                    <app-goods-full-reduce
                        :theme="getTheme"
                        :full_reduce="full_reduce"
                        sign="gift"
                    >
                    </app-goods-full-reduce>
                </view>
                <bottom-button
                    :name="goods.name"
                    :url="webUrl"
                    v-bind:theme="getTheme"
                    v-bind:attr_bool="attr_bool"
                    v-bind:goods_stock="goods.goods_stock"
                    v-on:attrSwitch="clickAttr"
                    v-bind:join_disabled="join_disabled"
                ></bottom-button>
            </view>
            <u-attr
                v-model="attrShow"
                :theme="getTheme"
                :is_show_left="false"
                :checked="selectAttr"
                @check="onAttr"
                :rightFunc="true"
                @rightFunc="pay"
                v-bind:goods="goods"
                sign="gift"
                rightText="加入礼包"
            >
            </u-attr>
        </view>
        <app-close v-if="showClose" :modal="false" @update="getMall"></app-close>
    </app-layout>
</template>

<script>
import {mapState,mapGetters} from 'vuex';
import appGoodsBanner from '../../../components/page-component/goods/app-goods-banner.vue';
import appRelatedSuggestionProduct
    from '../../../components/page-component/app-related-suggestion-product/app-related-suggestion-product.vue';
import bottomButton from '../components/goods/bottom-button.vue';
import appGoodsFullReduce from '../../../components/page-component/goods/app-goods-full-reduce.vue';
import uAttr from '../../../components/page-component/goods/u-attr.vue';
import bdInfo from '@/components/page-component/goods/bd-info';
import bdCoupon from '@/components/page-component/goods/bd-coupon.vue';
import bdXbc from '@/components/page-component/goods/bd-xbc.vue';
import bdKb from '@/components/page-component/goods/bd-kb.vue';
import bdHc from '@/components/page-component/goods/bd-hc.vue';
import bdDetail from '@/components/page-component/goods/bd-detail.vue';
import bdComments from '@/components/page-component/goods/bd-comments.vue';
import appClose from '@/components/basic-component/app-close/app-close.vue';


export default {
    name: 'goods',
    data() {
        return {
            showClose: false,
            is_open: 0,
            // 商品ID
            goods_id: -1,
            // 商品
            goods: null,
            full_reduce: null,
            // 相关推荐
            goods_list: [],
            attr_bool: false,
            // 选中规格
            select_data: {},
            // 选中规格字符串
            select_str: '',
            number: 1,
            getTheme: false,
            ask_gift: '',
            webUrl: '',
            mch_id: -1,
            loading: false,
            join_disabled: true,
            is_share: 0,
            is_search: 0,
            selectAttr: {},
            attrShow: false,
            flash_sale: null,
            is_vip: false,
            is_vip_card_user: null,
            discount: null
        }
    },
    onLoad(options) { this.$commonLoad.onload(options);
        this.webUrl = '/plugins/gift/goods/goods?id=' + options.id;
        this.goods_id = options.id;
        if (options.mch_id) {
            this.mch_id = options.mch_id;
        }
        if (options.is_share == 1) {
            this.is_share = 1;
        }
        if (options.is_search == 1) {
            this.is_search = 1;
        }
        this.$store.dispatch('gift/getConfig', this.$api.gift.config);
        this.request(options.id).then(() => {
            this.requestList();
            this.requestConfig();
            // #ifdef H5
            this.hShareAppMessage();
            // #endif
        });
        // #ifdef MP-WEIXIN
        wx.showShareMenu({
            menus: ['shareAppMessage', 'shareTimeline']
        })
        // #endif
    },
    onShow() {
        this.showClose = false;
        setTimeout(() => {
            this.showClose = true;
        })
    },
    // #ifdef MP-WEIXIN
    onShareTimeline() {
        // 分享朋友圈beta
        return this.$shareTimeline({
            title: this.ask_gift,
            query: {
                id: this.goods_id,
                is_share: 1,
            } // 此处填写页面的参数
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
                path: '/plugins/gift/goods/goods',
                title: this.ask_gift,
                imageUrl: this.goods.app_share_pic ? this.goods.app_share_pic : this.goods.pic_url[0].pic_url,
                // #ifdef MP-ALIPAY
                bgImgUrl: this.goods.app_share_pic ? this.goods.app_share_pic : this.goods.pic_url[0].pic_url,
                // #endif
                desc: this.goods.subtitle,
                params: {
                    id: this.goods_id,
                    is_share: 1,
                }
            }, s);
        },
        getMall(e) {
            this.is_open = e.is_open;
        },
        clickAttr() {
            this.attrShow = true;
        },
        onAttr({item}) {
            // if (!item && !item.attr_list) return;
            this.selectAttr = item;
            let attr_str = ``;
            for (let i = 0; i < item.attr_list.length; i++) {
                attr_str += `${item.attr_list[i].attr_group_name}: ${item.attr_list[i].attr_name} `;
            }
            this.select_data = {
                name: this.goods.name,
                price: item.price,
                attr: {
                    id: item.id,
                    attr_list: item.attr_list,
                    stock: item.stock,
                    goods_id: item.goods_id,
                },
                attr_str: attr_str,
                pic_url: item.pic_url ? item.pic_url : this.goods.cover_pic,
            }
        },
        // 请求商品
        async request(id) {
            this.$utils.showLoading();
            try {
                const res = await this.$request({
                    url: this.$api.gift.goods,
                    method: 'get',
                    data: {
                        id
                    }
                });
                this.$utils.hideLoading();
                if (res.code === 0) {
                    this.goods = res.data.goods;
                    this.flash_sale = res.data.goods.plugin_extra.flash_sale;
                    if (this.goods.goods_activity) {
                        this.full_reduce = this.goods.goods_activity.full_reduce;
                    }
                    if (this.goods.vip_card_appoint.discount) {
                        this.is_vip = true;
                        this.discount = this.goods.vip_card_appoint.discount
                    }
                    this.is_vip_card_user = this.goods.vip_card_appoint.is_vip_card_user
                    this.loading = true;
                    for (let i = 0; i < this.goods.attr_groups.length; i++) {
                        for (let j = 0; j < this.goods.attr_groups[i].attr_list.length; j++) {
                            if (j === 0) {
                                this.goods.attr_groups[i].attr_list[j].active = true;
                            } else {
                                this.goods.attr_groups[i].attr_list[j].active = false;
                            }
                        }
                    }
                }
        } catch (e) {
            this.$utils.hideLoading();
            throw new Error(e);
        }
    },
        // 请求配置
        async requestConfig() {
            this.$utils.showLoading();

            try {
                const res = await this.$request({
                    url: this.$api.gift.config,
                    method: 'get',
                });
                this.$utils.hideLoading();
                if (res.code === 0) {
                    this.ask_gift = res.data.ask_gift;
                    this.getTheme = res.data.theme_color;
                    this.$store.commit('gift/setTheme', Number(res.data.theme.id));
                } else {
                    uni.showModal({
                        title: '提示',
                        content: res.msg,
                    });
                }
            } catch (e) {
                this.$utils.hideLoading();
                throw new Error(e);
            }
        },
        // 请求相关推荐
        async requestList() {
            this.$utils.showLoading();
            try {
                const res = await this.$request({
                    url: this.$api.goods.new_recommend,
                    method: 'get',
                    data: {
                        goods_id: this.goods_id,
                        type: 'goods',
                    }
                });
                this.$utils.hideLoading();
                if (res.code === 0) {
                    this.goods_list = res.data.list;
                } else {
                    uni.showModal({
                        title: '提示',
                        content: res.msg,
                    });
                }
            } catch (e) {
                this.$utils.hideLoading();
                throw new Error(e);
            }
        },
        // 规格开关
        attrSwitch(data) {
            this.attr_bool = data;
        },
        pay(data) {
            this.number = data.goods_list[0].num;
            if (this.$storage.getStorageSync('GIFT_CART')) {
                let again = 0;
                let storage = this.$storage.getStorageSync('GIFT_CART');
                for (let i = 0; i < storage.length; i++) {
                    if (storage[i].attr.id === this.select_data.attr.id) {
                        storage[i].number += this.number;
                    } else {
                        again += 1;
                    }
                }
                if (again === storage.length) {
                    let data = this.select_data;
                    data.number = this.number;
                    storage.push(data);
                }
                this.$storage.setStorageSync('GIFT_CART', storage);
            } else {
                let data = this.select_data;
                data.number = this.number;
                this.$storage.setStorageSync('GIFT_CART', [data]);
            }
            if (this.is_share === 1) {
                uni.navigateTo({
                    url: `/plugins/gift/index/index`
                })
            } else if (this.is_search === 1) {
                uni.navigateBack({
                    delta: 3
                });
            } else {
                uni.navigateBack({
                    delta: 2
                });
            }
        },
        setCoupon(index) {
            this.$set(this.goods.goods_coupon_center[index], 'is_receive', 1);
        }
    },
    computed: {
        ...mapState('gift', {
            theme: state => state.theme,
			theme_id: state => state.theme_id
        }),
        ...mapState('mallConfig', {
            mall: state => state.mall
        }),
    },
    components: {
        'app-goods-banner': appGoodsBanner,
        'app-related-suggestion-product': appRelatedSuggestionProduct,
        'bottom-button': bottomButton,
        appGoodsFullReduce,
        uAttr,
        bdInfo,
        bdCoupon,
        bdXbc,
        bdKb,
        bdHc,
        bdDetail,
        bdComments,
        appClose
    },
}
</script>

<style lang="scss">
//@import '../css/gift';

/* 商品页面 */
.goods {

    background-color: #f7f7f7;

    .goods-subtitle {
        padding: 0 #{24rpx};
        font-size: 24rpx;
        background-color: #ffffff;
        color: #999999;
    }

    /*加入会员*/
    .join-member {
        background-color: #ffffff;
        padding: #{0 24upx};
    }

    /*详情 评价*/
    .detailed-evaluation {

    }

    /*超级会员卡*/
    .vip-card {
        padding: #{0 24upx 24upx 24upx};
        background-color: #ffffff;
    }

    /*商品服务*/
    .commodity-service {
        margin: #{20upx 0};
    }

    /*规格选择*/
    .show-attr {
        margin-bottom: #{20upx};
    }

    /*空格*/
    .empty {
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
}

.u-coupon {
    margin-top: 20upx;
}

/*求礼物*/
.bd-share {
    width: 96upx;
    height: 96upx;
    border: none;
    padding: 0;
    background-color: transparent;
    border-radius: 0;
    margin: 0;

    image {
        width: 100%;
        height: 100%;
    }
}
</style>
