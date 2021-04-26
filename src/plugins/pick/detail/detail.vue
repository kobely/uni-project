<template>
    <app-layout>
        <view v-if="!goods" class="u-goods-detail"></view>
        <template v-if="goods">
            <app-goods-banner
                :pic-list="goods.pic_url"
                :share="goods.share"
                :video-url="goods.video_url"
                :goods_id="goods.id"
                :isCart="false"
                sign="pick"
            ></app-goods-banner>
            <bd-info
                :theme="getTheme"
                :name="goods.name"
                :is-negotiable="goods.is_negotiable"
                :subtitle="goods.subtitle"
                :level-show="goods.level_show"
                :flash-sale="flash_sale"
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
                :is-vip="isVip"
                :goods-id="goods.id"
                :extra-quick-share="goods.extra_quick_share"
                :app-share-pic="goods.app_share_pic"
                :app-share-title="goods.app_share_title"
                :poster-config="poster_config + `&goods_id=` + goods.id"
                :poster-generate="poster_generate + `&goods_id=` + goods.id"
                :has-poster-nav="true"
                :is-show-member="false"
                @quickShare="quickShare"
                v-bind:goods="goods"
                @share="hShareAppMessage"
				:limit-buy="goods.limit_buy"
				:min-number="goods.min_number"
            ></bd-info>
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
                @openAttr="clickAttr(1)"
            ></bd-xbc>
            <view class="rule">
                <view class="content dir-left-nowrap main-between" @click="goBack">
                    <view class="dir-left-nowrap cross-center">
                        <view class="tag">N元任选</view>
                        <view class="activity-price">{{activity.rule_price}}元选{{activity.rule_num}}件</view>
                    </view>
                    <view class="dir-left-nowrap go cross-center">
                        <view>去凑单</view>
                        <image src="/static/image/icon/arrow-right.png"></image>
                    </view>
                </view>
            </view>
            <!--商品信息-->
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
            <view class="recommend">
                <app-goods-recommend :detail="activity" :theme="getTheme" sign="pick" :is_show_member="false" :sureCart="false" :goods-list="recommend_list" :activity="activity"></app-goods-recommend>
            </view>
            <!-- 底部空格 -->
            <view class="safe-area-inset-bottom">
                <view class="u-bottom-height"></view>
            </view>
            <!-- 底部按钮 -->
            <view v-if="is_open == 1" class="safe-area-inset-bottom u-bottom-fixed">
                <view class="bd-bottom dir-left-nowrap cross-center">
                    <view class="bd-back dir-top-nowrap main-center cross-center box-grow-0" @click="back">
                        <image class="bd-icon" src="/static/image/icon/index.png"></image>
                        <text class="bd-text">首页</text>
                    </view>
                    <bd-service :name="goods.name" :url="webUrl"></bd-service>
                    <view class="bd-back dir-top-nowrap main-center cross-center box-grow-0" @click="favorite">
                        <image class="bd-icon" :src="goods.favorite ? '/static/image/icon/icon-favorite-active.png' : '/static/image/icon/icon-favorite.png'"></image>
                        <text class="bd-text">收藏</text>
                    </view>
                    <view v-if="goods.goods_num === 0" class="box-grow-1 bd-btn bd-oversell-btn bd-btn-color" >
                        已售罄
                    </view>
                    <template v-else>
                        <view v-if="activity_status === 1" class="box-grow-1 dir-left-nowrap">
                            <view :style="{'background': goods.buy_goods_auth ? getTheme.background_s_gradient_btn : '#999999','color': goods.buy_goods_auth ? getTheme.secondary_text : ''}" class="bd-btn-half bd-btn bd-btn-left"
                                  @click="clickAttr(1)">
                                加入凑单池
                            </view>
                            <view class="bd-btn-half bd-btn bd-btn-color bd-btn-right"
                                  :style="{'background-color': getTheme.background,'color': getTheme.main_text}"
                                  @click="clickAttr"
                            >返回凑单池
                            </view>
                        </view>
                        <view v-else class="box-grow-1 bd-btn  bd-btn-color bd-btn-over"
                        >活动已结束
                        </view>
                    </template>
                </view>
            </view>
            <u-attr
                v-model="attrShow"
                :goods="goods"
                :theme="getTheme"
                :checked="selectAttr"
                :is_show_left="false"
                @check="onAttr"
                :rightFunc="true"
                @rightFunc="add"
                rightText="加入凑单池"
            >
            </u-attr>
            <app-quick-navigation></app-quick-navigation>
        </template>
        <app-close v-if="showClose" :modal="false" @update="getMall"></app-close>
    </app-layout>
</template>

<script>
import {mapGetters, mapState} from "vuex";
    import appQuickNavigation from "../../../components/page-component/app-quick-navigation/app-quick-navigation.vue";
    import appGoodsBanner from "../../../components/page-component/goods/app-goods-banner";
    import appGoodsRecommend from "../../../components/page-component/app-goods-recommend/app-goods-recommend";
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
        name: 'detail',

        data() {
            return {
                showClose: false,
                is_open: 0,
                goods: null,
                attrShow: 0,
                selectAttr: {},
                isVip: false,
                discount: null,
                is_vip_card_user: 0,
                shareData: {},
                recommend_list: [],
                activity: {},
                shareUrl: '',
                webUrl: '',
                activity_status: 1,
                poster_config: this.$api.pick.poster_config,
                poster_generate: this.$api.pick.poster_generate,
                // 限时抢购
                flash_sale: null,
				disable: 'disable'
            }
        },

        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            })
        },
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: this.goods.app_share_title ? this.goods.app_share_title : this.goods.name,
                imageUrl: this.goods.app_share_pic ? this.goods.app_share_pic : this.goods.pic_url[0].pic_url,
                path: '/plugins/pick/detail',
                desc: this.goods.subtitle,
                params: {
                    id: this.goods.id
                }
            });
        },
        components: {
            'app-quick-navigation': appQuickNavigation,
            appGoodsBanner,
            'app-goods-recommend': appGoodsRecommend,
            uAttr,
            bdInfo,
            bdCoupon,
            bdXbc,
            bdKb,
            bdHc,
            bdDetail,
            bdComments,
            appClose,
            bdService
        },

        methods: {
            hShareAppMessage(s = false){
                return this.$shareAppMessage({
                    title: '',
                    imageUrl: '',
                    path: "/plugins/pick/detail/detail",
                    params: {
                        goods_id: this.goods.id
                    }
                }, s);
            },
            getMall(e) {
                this.is_open = e.is_open;
            },
            async getDetail(id) {
                const e = await this.$request({
                    url: this.$api.pick.goods,
                    method: 'get',
                    data: {
                        id: id
                    }
                });
                if (e.code === 0) {
                    let {
                        vip_card_appoint,
                        plugin_extra
                    } = e.data.detail;
                    this.goods = e.data.detail;
                    this.flash_sale = plugin_extra.flash_sale;
                    this.activity = e.data.activity;
                    this.recommend_list = e.data.list;
                    this.shareUrl = `${this.$api.pick.poster}&goods_id=${this.goods.id}`;
                    this.activity_status = e.data.activity_status;
                    if(vip_card_appoint.discount || vip_card_appoint.discount === '0.00') {
                        this.isVip = true;
                        this.discount = vip_card_appoint.discount
                    }
                    this.is_vip_card_user = vip_card_appoint.is_vip_card_user;
                    // #ifdef H5
                    this.hShareAppMessage();
                    // #endif
                } else {
                    uni.showToast({
                        title: e.msg,
                        icon: 'none'
                    })
                }
            },
            setCoupon(index) {
                this.$set(this.goods.goods_coupon_center[index], 'is_receive', 1);
            },
            onAttr({item}) {
                this.selectAttr = item;
            },
            quickShare(info) {
                this.shareData = info;
            },
            clickAttr(status) {
                if (this.activity_status !== 1) return;
                if (status === 1) {
					if (!this.goods.buy_goods_auth) {
						this.$tips.showToast({
							title: '您暂无权限购买该商品',
							icon: 'none'
						});
						return;
					}
                    this.attrShow = true;
                } else {
                    uni.navigateTo({
                        url: `/plugins/pick/pond/pond?rule_num=${this.activity.rule_num}&pick_activity_id=${this.activity.id}`
                    })
                }
            },
            async add(data) {
                let goods = data.goods_list[0];
                const e = await this.$request({
                    url: this.$api.pick.add,
                    data: {
                        goods_id: goods.id,
                        attr: goods.goods_attr_id,
                        num: goods.num,
                        pick_activity_id: this.activity.id
                    }
                });
                if (e.code === 0) {
                    uni.navigateBack();
                }
            },

            back() {
                uni.navigateTo({
                    url: '/pages/index/index'
                });
            },

            goBack() {
                uni.navigateTo({
                    url: '/plugins/pick/index/index'
                });
            },

            favorite() {
                let url = this.$api.user.favorite_add;
                let favorite = true;
                if (this.goods.favorite) {
                    url = this.$api.user.favorite_remove;
                    favorite = false;
                }
                this.goods.favorite = favorite;
                this.$request({
                    url: url,
                    data: {
                        goods_id: this.goods.id,
                    }
                }).then(response => {
                    if (response.code === 0) {
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: response.msg,
                            showCancel: false,
                        });
                    }
                }).catch(() => {
                });
            },
        },
        onShow() {
            this.showClose = false;
            setTimeout(()=>{
                this.showClose = true;
            })
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.webUrl = '/plugins/pick/detail/detail?goods_id=' + options.goods_id;
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
            this.getDetail(options.goods_id);
        },

        // #ifdef MP-WEIXIN
        onShareTimeline() {
            // 分享朋友圈beta
            return this.$shareTimeline({
                title: this.goods.app_share_title ? this.goods.app_share_title : this.goods.name,
                query: {
                    goods_id: this.goods.goods_id
                } // 此处填写页面的参数
            });
        },
        // #endif
    }
</script>

<style scoped lang="scss">
    .detail {

    }

    .goods-name {
        padding: #{24rpx 24rpx 0 24rpx};
        background-color: #ffffff;
        color: $uni-important-color-black;
        font-size: 28upx;
        line-height: 38upx;
    }
    
    .goods-subtitle {
        padding: #{24rpx};
        font-size: 24rpx;
        background-color: #ffffff;
        color: #999999;
    }


    .price {
        padding-top: #{24rpx};
        background-color: #ffffff;
    }

    .button {
        width: 50%;
        height: 100%;
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
    }
    .bd-text {
        font-size: 20upx;
        color: #888888;
    }
    .bd-btn {
        text-align: center;
        line-height: 70upx;
        font-size: 28upx;
        border-radius: 35upx;
    }
    .bd-btn-color {
        color: #ffffff;
    }
    .bd-oversell-btn {
        background-color: #CDCDCD;
    }
    .bd-btn-half {
        width: 50%;
    }
    .bd-btn-left {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .bd-btn-right {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    .bd-btn-over {
        background-color: #999999;
    }
    .app-bottom {
        width: 100%;
        height: #{110rpx};
        font-size: $uni-font-size-general-one;
        background-color: #ffffff;
    }

    .little {
        width: #{110rpx};
        height: 100%;
        background-color: #ffffff;
        font-size: #{20rpx};
        color: $uni-general-color-two;

        &:first-child {
            border-right: #{1rpx} solid #e2e2e2;
        }

        image {
            width: #{40rpx};
            height: #{40rpx};
            display: block;
            margin-bottom: #{10rpx};
        }
    }

    .rule {
        width: #{702upx};
        height: #{66upx};
        margin:#{0 24upx};
        background-color: #ffffff;
        .content {
            width: #{702upx};
            background-color: #fff0f0;
            height: #{66upx};
            padding: #{0 24upx};
        }
        .tag {
            border-radius: #{13upx};
            font-size: #{19upx};
            line-height: 29upx;
            background-color: #ff4544;
            color: #ffffff;
            padding: #{1upx 10upx};
        }
        .activity-price {
            font-size: #{23upx};
            margin-left: #{17upx};
        }
        .go {
            >view {
                font-size: #{23upx};
                color: #999999;
            }
            >image {
                width: #{12upx};
                height: #{22upx};
                margin-left: #{14upx};
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
    .u-bottom-height {
        height: 110upx;
    }
</style>
