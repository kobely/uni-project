<template>
    <app-layout>
        <view v-if="!goods" class="u-goods-detail"></view>
        <template v-if="goods">
            <!--商品轮播图-->
            <app-banner
                :videoUrl="goods.video_url"
                :share="goods.share"
                :picList="goods.pic_url"
                :goods_id="goods_id"
                sign="miaosha"
            ></app-banner>
            <!-- 秒杀时间 -->
            <app-goods-time
                :day="day"
                :second="second"
                :minute="minute"
                :hour="hour"
                :theme="getTheme"
                :miaosha_status="miaosha_status"
            ></app-goods-time>
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
                :poster-config="poster_config"
                :poster-generate="poster_generate"
                :has-poster-nav="true"
                v-bind:goods="goods"
                :share-url="url"
                @share="hShareAppMessage"
				:limit-buy="goods.limit_buy"
				:min-number="goods.min_number"
            >
            </bd-info>
            <bd-coupon @change="setCoupon" :theme="getTheme" :coupons="goods.goods_coupon_center"></bd-coupon>
            <bd-xbc
                :coAttr="is_open"
                :attr-list="selectAttr && selectAttr.attr_list"
                :type="goods.type"
                :guarantee-title="goods.guarantee_title"
                :guarantee-pic="goods.guarantee_pic"
                :param_content="goods.param_content"
                :param_name="goods.param_name"
                :services="goods.services"
                :attr-groups="goods.attr_groups"
                @openAttr="takeCart"
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
            <!-- 相关推荐 -->
            <app-related-suggestion-product :theme="getTheme" :list="list"></app-related-suggestion-product>
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
                    >
                    </app-goods-full-reduce>
                </view>
                <view class="bd-bottom dir-left-nowrap cross-center">
                    <view class="bd-back dir-top-nowrap main-center cross-center box-grow-0" @click="router('/pages/index/index')">
                        <image class="bd-icon" src="../../../static/image/icon/index.png"></image>
                        <text class="bd-text">首页</text>
                    </view>
                    <bd-service :name="goods.name" :url="webUrl"></bd-service>
                    <template v-if="goods.goods_stock > 0" >
                        <template v-if="miaosha_status === 1">
                            <view class="box-grow-1 dir-left-nowrap">
                                <view class="bd-btn bd-btn-left bd-btn-half"
                                      @click="takeCart"
                                      :style="{'background': goods.buy_goods_auth ? getTheme.background_s_gradient_btn : '#999999','color': goods.buy_goods_auth ? getTheme.secondary_text : ''}">
                                    加入购物车
                                </view>
                                <view @click="takeCart" class="bd-btn bd-btn-half bd-btn-right bd-btn-color"
                                    :style="{'background': goods.buy_goods_auth ? getTheme.background_gradient_btn : '#999999','color': goods.buy_goods_auth ? getTheme.main_text : ''}"
                                    >
                                    立即购买
                                </view>
                            </view>
                        </template>
                        <view class="bd-btn bd-oversell-btn box-grow-1 bd-btn-color" v-else-if="miaosha_status === 2">
                            活动未开始
                        </view>
                        <view class="bd-btn bd-oversell-btn box-grow-1 bd-btn-color" v-else-if="miaosha_status === 0">
                            活动已结束
                        </view>
                    </template>
                    <view class="box-grow-1 bd-btn bd-oversell-btn bd-btn-color" v-else>
                        已售罄
                    </view>
                </view>
            </view>
            <!--商品规格-->
            <u-attr
                v-if="miaosha_status === 1"
                v-model="show"
                :theme="getTheme"
                :goods="goods"
                :checked="selectAttr"
                @check="attrtap"
                :leftFunc="true"
                @leftFunc="leftFunc"
                :rightFunc="true"
                @rightFunc="rightFunc"
            >
            </u-attr>
        </template>
        <app-close v-if="showClose" :modal="false" @update="getMall"></app-close>
    </app-layout>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import appBanner from '../../../components/page-component/goods/app-goods-banner.vue';
import appGoodsTime from '../components/app-goods-time.vue';
import appRelatedSuggestionProduct from '../../../components/page-component/app-related-suggestion-product/app-related-suggestion-product.vue';
import appGoodsFullReduce from "../../../components/page-component/goods/app-goods-full-reduce";
import uAttr from '../../../components/page-component/goods/u-attr.vue';
import bdInfo from '@/components/page-component/goods/bd-info';
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
    data() {
        return {
            showClose: false,
            is_open: 0,
            goods: null,
            full_reduce: null,
            cartShow: false,
            miaosha_status: -1,
            miaosha_time: 0,
            selectAttr: null,
            url: '',
            webUrl: '',
            show: false,
            list: [],
            miaosha_buy_count: 0,
            goods_id: -1,
            is_activity: 0,
            hour: 0,
            minute: 0,
            second: 0,
            day: 0,
            time: -1,
            is_vip_card_user: 0,
            discount: null,
            is_vip: false,
            loading: false,
            flash_sale: null,
            poster_config: this.$api.miaosha.poster_config,
            poster_generate: this.$api.miaosha.poster_generate,
			disable: 'disable',
        }
    },
    onLoad(options) { this.$commonLoad.onload(options);
        this.goods_id = options.id;
        this.webUrl = '/plugins/miaosha/goods/goods?id=' + options.id;
        if (options.is_activity) {
            this.is_activity = options.is_activity
        }
        // #ifdef MP-WEIXIN
        wx.showShareMenu({
            menus: ['shareAppMessage', 'shareTimeline']
        })
        // #endif
    },
    onShow() {
        this.showClose = false;
        setTimeout(()=>{
            this.showClose = true;
        })
        this.$showLoading();
        this.$nextTick(() => {
            let that = this;
            this.$request({
                url: this.$api.miaosha.goods_detail,
                data: {
                    id: this.goods_id,
                    is_activity: this.is_activity
                }
            }).then(response => {
                this.$hideLoading();
                if (response.code === 0) {
                   let { detail, miaosha_status, miaosha_time, miaosha_buy_count } = response.data;
                   this.goods = detail;
                   if (detail.goods_activity) {
                       this.full_reduce = detail.goods_activity.full_reduce;
                   }
                    this.flash_sale = detail.plugin_extra.flash_sale;
                   this.miaosha_status = miaosha_status;
                   this.miaosha_buy_count = miaosha_buy_count;
                   this.loading = true;
                   this.url = `${this.$api.miaosha.poster}&goods_id=${this.goods.id}`;
                   this.poster_config = `${this.poster_config}&goods_id=${this.goods.id}`;
                   this.poster_generate = `${this.poster_generate}&goods_id=${this.goods.id}`;
                   this.getTime(miaosha_time);
                    // #ifdef H5
                    this.hShareAppMessage();
                    // #endif
               } else {
                    uni.showToast({
                        title: response.msg,
                        icon: 'none'
                    })
                }
                this.$request({
                    url: this.$api.goods.new_recommend,
                    data: {
                        goods_id: this.goods.id,
                    }
                }).then(response => {
                    if (response.code === 0) {
                        this.list = response.data.list;
                        if (that.goods.vip_card_appoint.discount) {
                            that.is_vip = true;
                            that.discount = that.goods.vip_card_appoint.discount
                        }
                        that.is_vip_card_user = that.goods.vip_card_appoint.is_vip_card_user
                    }
                })
            });
        })
    },
    onHide() {
        clearInterval(this.time);
    },
    onUnload() {
        clearInterval(this.time);
    },
    computed: {
        ...mapGetters('mallConfig', {
            getTheme: 'getTheme',
        }),
        ...mapState({
            mall: state => state.mallConfig.mall,
        })
    },
    // #ifdef MP-WEIXIN
    onShareTimeline() {
        return this.$shareTimeline({
            title: this.goods.app_share_title ? this.goods.app_share_title : this.goods.name,
            query: {
                id: this.goods.id
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
                path: '/plugins/miaosha/goods/goods',
                title: this.goods.app_share_title ? this.goods.app_share_title : this.goods.name,
                imageUrl: this.goods.app_share_pic ? this.goods.app_share_pic : this.goods.pic_url[0].pic_url,
                desc: this.goods.subtitle,
                params: {
                    id: this.goods.id
                }
            },s);
        },
        getMall(e) {
            this.is_open = e.is_open;
        },
        async request({ url, data }) {
            const response = await this.$request({
                url: url,
                data: data,
            });
            if (response.code === 0) {
                return response.data;
            }
        },
        attrtap({item}) {
            this.selectAttr = item;
        },
        takeCart() {
			if (!this.goods.buy_goods_auth) {
				this.$tips.showToast({
					title: '您暂无权限购买该商品',
					icon: 'none'
				})
				return ;
			}
            this.show  = true;
        },
        leftFunc(number) {
            this.$request({
                url: this.$api.miaosha.add_cart,
                method: 'post',
                data: {
                    miaosha_goods_id: this.selectAttr.goods_id,
                    attr_id: this.selectAttr.id,
                    num: number
                }
            }).then(response => {
                uni.showToast({
                    title: response.msg,
                    icon: 'none'
                })
            });
        },
        rightFunc(data) {
            uni.navigateTo({
                url: `/pages/order-submit/order-submit?mch_list=${JSON.stringify([data])}&preview_url=${encodeURIComponent(this.$api.miaosha.order_preview)}&submit_url=${encodeURIComponent(this.$api.miaosha.order_submit)}`
            });
        },
        getTime(newValue) {
            newValue = newValue - 1;
            this.day = parseInt(newValue / 3600 / 24);
            this.hour = parseInt(newValue / 3600 % 24);
            this.minute = parseInt(newValue / 60 % 60);
            this.second = parseInt(newValue % 60);
            clearInterval(this.time);
            this.time = setInterval(() => {
                newValue = newValue - 1;
                if (newValue < 0) {
                    clearInterval(this.time);
                }
                this.day = parseInt(newValue / 3600 / 24);
                this.hour = parseInt(newValue / 3600 % 24);
                this.minute = parseInt(newValue / 60 % 60);
                this.second = parseInt(newValue % 60);
            }, 1000);
        },
        setCoupon(index) {
            this.$set(this.goods.goods_coupon_center[index], 'is_receive', 1);
        },

        router(url) {
            uni.navigateTo({
                url: url
            })
        }
    },
    components: {
        'app-banner': appBanner,
        'app-goods-time': appGoodsTime,
        'app-related-suggestion-product': appRelatedSuggestionProduct,
        uAttr,
        appGoodsFullReduce,
        bdInfo,
        bdCoupon,
        bdXbc,
        bdKb,
        bdHc,
        bdDetail,
        bdComments,
        appClose,
        bdService
    }
}
</script>
<style scoped lang="scss">

.app-goods {
    background-color: #f7f7f7;
}

.buttons {
    width: #{750rpx};
    height: #{110rpx};

    .app-home {
        width: 14%;
        height: #{110rpx};
        background-color: white;



            image {
                width: #{40rpx};
                height: #{40rpx};
            }

            text {
                font-size: #{18rpx};
                color: #707070;

            }
    }

    .app-button {
        width: 86%;
        height: #{110rpx};
        text-align: center;
        line-height: #{110rpx};

        .app-join-cart {
            height: #{110rpx};
        }

        .app-buy {
            height: #{110rpx};
            color: white;
        }

        .notStart {
            height: #{110rpx};
            background-color: #cccccc;
            color: #FFFFFF;
        }

        .app-over {
            height: #{110rpx};
            background: #666;
            color: #FFFFFF;
        }
    }
}

.text {
    color: #ffffff;
}
.u-bottom-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1602;
    background-color: #ffffff;
}
.u-bottom-height-0 {
    height: 110upx;
}
.u-bottom-height-1 {
    height: 190upx;
}

.goods-margin {
    margin-top: 20upx;
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
</style>
