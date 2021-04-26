<template>
    <app-layout>
        <view v-if="!goods" class="u-goods-detail"></view>
        <template v-if="goods">
            <app-goods-banner
                :pic-list="goods.pic_url"
                :share="goods.share"
                :goods_id="goods.id"
                :video-url="goods.video_url"
            ></app-goods-banner>
            <view class="bd-info">
                <view class="goods-name u-line-2">{{goods.name}}</view>
                <view v-if="goods.subtitle" class="goods-subtitle">
                    <view class="t-omit-three">{{goods.subtitle}}</view>
                </view>
                <view class='price main-between' :style="{'color': getTheme.color}">
                    <view class="dir-left-nowrap cross-bottom">
                        <image class="detail-price" src='./../image/detail-price.png'></image>
                        <view class="cross-bottom">{{goods.min_currency}}</view>
                        <view class="goods-currency" v-if="goods.max_currency > goods.min_currency">起</view>
                        <view>+</view>
                        <view style="font-size: 14px">￥</view>
                        <view>{{goods.min_price}}</view>
                        <view class="goods-currency" v-if="goods.max_price > goods.min_price">起</view>
                    </view>
                    <view @click="shareClick"
                          :style="{'background-color': getTheme.background}"
                          class="share dir-left-nowrap main-center cross-center">
                        <image class="share-image box-grow-0" src="/static/image/icon/icon-share-white.png"></image>
                        <view class="share-text box-grow-0">分享</view>
                    </view>
                </view>
                <app-share-qr-code :url="shareUrl"
                                   :has-poster-nav="true"
                                   :poster-config="poster_config + `&goods_id=` + goods.id"
                                   :poster-generate="poster_generate + `&goods_id=` + goods.id"
                                   v-model="shareShow"
                                   :goods="goods"
                                   @share="hShareAppMessage"
                ></app-share-qr-code>
				<view style="background-color: #FFFFFF;padding: 24upx; 0 0 24upx">
					<bd-info-extra :goods="goods" :theme="getTheme" :unit="goods.unit" :min-number="goods.min_number" :limit-buy="goods.limit_buy"></bd-info-extra>
				</view>
            </view>
            <bd-coupon  @change="setCoupon" :theme="getTheme" :coupons="goods.goods_coupon_center"></bd-coupon>
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
            <bd-detail :detail="goods.detail"></bd-detail>
            <!--空格区域-->
            <view class="safe-area-inset-bottom u-bottom">
                <view class="u-bottom-height"></view>
            </view>
            <!--底部按钮-->
            <view v-if="is_open == 1" class="safe-area-inset-bottom u-bottom-fixed">
                <view class="bd-bottom dir-left-nowrap cross-center">
                    <view class="bd-back dir-top-nowrap main-center cross-center box-grow-0" @click="back">
                        <image class="bd-icon" src="/static/image/icon/index.png"></image>
                        <text class="bd-text">首页</text>
                    </view>
                    <bd-service :name="goods.name" :url="webUrl"></bd-service>
                    <view v-if="goods.goods_stock === 0" class="box-grow-1 bd-btn bd-oversell-btn bd-btn-color" >
                        已售罄
                    </view>
                    <view
                        v-else
                        @click="clickAttr"
                        :style="{'background': goods.buy_goods_auth ? getTheme.background_gradient_btn : '#999999','color': goods.buy_goods_auth ? getTheme.main_text : ''}"
                        class="bd-btn box-grow-1 bd-btn-color">
                        立即兑换
                    </view>
                </view>
            </view>
            <u-attr
                :goods="goods"
                v-model="attrShow"
                :theme="getTheme"
                :checked="selectAttr"
                :is_show_left="false"
                rightText="立即兑换"
                @check="onAttr"
                :rightFunc="true"
                @rightFunc="rightFunc"
            >
                <view slot="priceBefore" v-if="selectAttr">
                    {{selectAttr.extra.value}}{{selectAttr.extra.name}} +
                </view>
            </u-attr>
        </template>
        <app-close v-if="showClose" :modal="false" @update="getMall"></app-close>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from "vuex";
    import appGoodsBanner from "../../../components/page-component/goods/app-goods-banner.vue";
    import appShareQrCode from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
    import uAttr from '../../../components/page-component/goods/u-attr.vue';
    import bdCoupon from '@/components/page-component/goods/bd-coupon.vue';
    import bdXbc from '@/components/page-component/goods/bd-xbc.vue';
    import bdDetail from '@/components/page-component/goods/bd-detail.vue';
    import bdKb from '@/components/page-component/goods/bd-kb.vue';
    import bdHc from '@/components/page-component/goods/bd-hc.vue';
    import appClose from '@/components/basic-component/app-close/app-close.vue';
    import bdService from '@/components/page-component/goods/bd-service.vue';
	import bdInfoExtra from '@/components/page-component/goods/bd-info-extra.vue';

    export default {
        name: "goods",
        components: {
            appGoodsBanner,
            appShareQrCode,
            uAttr,
            bdCoupon,
            bdXbc,
            bdDetail,
            bdHc,
            bdKb,
            appClose,
            bdService,
			bdInfoExtra
        },
        data() {
            return {
                showClose: false,
                is_open: 0,
                goods: {
                    id: '',
                    name: '',
                    cover_pic: '',
                    price: '',
                },
                webUrl: '',
                selectAttr: null,
                shareShow: false,
                shareUrl: null,
                attrShow: false,
                poster_config: this.$api.step.poster_config,
                poster_generate: this.$api.step.poster_generate,
				disable: 'disable'
            };
        },
        computed: {
            ...mapState({
                mall: state => state.mallConfig.mall,
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            })
        },
        onShow() {
            this.showClose = false;
            setTimeout(()=>{
                this.showClose = true;
            })
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.webUrl = '/plugins/step/goods/goods?goods_id=' + options.goods_id;
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
              menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
            this.loadData(options.goods_id);
        },
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            let { app_share_title, name, app_share_pic, cover_pic, id, pic_url } = this.goods;
            return this.$shareTimeline({
                title: app_share_title ? app_share_title: name,
                imageUrl: pic_url[0].pic_url,
                query: {
                    goods_id: id
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
                let { app_share_title, name, app_share_pic, cover_pic, id , subtitle} = this.goods;
                return this.$shareAppMessage({
                    title: app_share_title ? app_share_title: name,
                    imageUrl: app_share_pic ? app_share_pic: cover_pic,
                    path: "/plugins/step/goods/goods",
                    desc: subtitle,
                    params: {
                        goods_id: id
                    }
                }, s);
            },
            getMall(e) {
                this.is_open = e.is_open;
            },
            loadData(id) {
                this.$showLoading();
                this.$request({
                    url: this.$api.step.goods_detail,
                    data: {
                        id: id
                    }
                }).then(response => {
                    this.$hideLoading();
                    if (response.code === 0) {
                        this.goods = response.data.detail;
                        this.shareUrl = this.$api.step.goods_poster + '&goods_id=' + id;
                        this.goods.id = id;
                        // #ifdef H5
                        this.hShareAppMessage();
                        // #endif
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none'
                        });
                    }
                }).catch(() => {
                    this.$hideLoading();
                });
            },
            onAttr({item}) {
                this.selectAttr = item;
            },
            shareClick() {
                this.shareShow = true;
            },
            back() {
                uni.redirectTo({
                    url: '/pages/index/index'
                });
            },
            clickAttr() {
				if (!this.goods.buy_goods_auth) {
                    this.$tips.showToast({
                        title: '您暂无权限购买该商品',
                        icon: 'none'
                    });
                    return;
				}
                this.attrShow = true;
            },
            setCoupon(index) {
                this.$set(this.goods.goods_coupon_center[index], 'is_receive', 1);
            },
            rightFunc(data) {
                uni.navigateTo({
                    url: `/pages/order-submit/order-submit?mch_list=${JSON.stringify([data])}&preview_url=${encodeURIComponent(this.$api.step.order_preview)}&submit_url=${encodeURIComponent(this.$api.step.order_submit)}`
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .goods-currency {
        font-size: #{22rpx};
        padding-bottom:#{2rpx};
    }

    .goods-currency+view {
        font-size: #{32rpx};
        padding: 0 #{5rpx};
    }

    .goods-name {
        padding: 24upx 24upx 0 24upx;
        background-color: #ffffff;
        color: $uni-important-color-black;
    }

    .goods-subtitle {
        padding: #{24rpx};
        padding-bottom: #{30rpx};
        font-size: 24rpx;
        background-color: #ffffff;
        color: #999999;
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
    .bd-btn-color {
        color: #ffffff;
    }
    .bd-oversell-btn {
        background-color: #CDCDCD;
    }
    .price {
        height: #{106rpx};
        font-size: #{40rpx};
        font-family: DIN;
        padding-left: #{24rpx};
        padding-bottom: #{24rpx};
        background-color: #fff;
        position: relative;
    }

    .price .detail-price {
        height: #{44rpx};
        width: #{44rpx};
        display: block;
        float: left;
        margin-right: #{16rpx};
    }

    .share {
        margin-top: #{10rpx};
        height: #{48rpx};
        border-radius: #{40rpx} 0 0 #{40rpx};
        padding: 0 #{14rpx};
        width: #{103rpx};

        .share-image {
            width: #{22rpx};
            height: #{22rpx};
        }
        .share-text {
            font-size: #{22rpx};
            color: #ffffff;
            margin-left: #{10rpx};
        }
    }

    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1500;
        background-color: #ffffff;
    }
    .u-bottom-height {
        height: 110upx;
    }

    .bd-info {
        width: 702upx;
        border-radius: 15upx;
        overflow: hidden;
        margin: 24upx 24upx 0 24upx;
    }
</style>
