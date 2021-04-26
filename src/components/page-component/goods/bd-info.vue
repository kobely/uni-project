<template>
    <view class="bd-info">
        <text class="bd-name u-line-2">{{name}}</text>
        <text class="bd-subtitle u-line-3" v-if="subtitle">{{subtitle}}</text>
        <view class="dir-left-nowrap bd-price-share">
            <view class="box-grow-1" :class="isNegotiable === 1 ? 'cross-center' : ''">
                <template v-if="isNegotiable !== 1">
                    <view>
                        <template v-if="levelShow === 1">
                            <view class="dir-left-wrap cross-bottom">
                                <view class="bd-price box-grow-0" :style="{'color': theme.color}">
                                    <app-price :max="`${priceMemberMax}`" :min="`${priceMemberMin}`" :default-price="`${price}`" :theme="theme"></app-price>
                                </view>
                                <view v-if="isShowMember" class="bd-member-mark">
                                    <app-member-mark :theme="theme"></app-member-mark>
                                </view>
                                <app-sup-vip v-if="discount" :is_vip_card_user="isVipCardUser" margin="0 0 0 13rpx" :discount="discount"></app-sup-vip>
                            </view>
                            <view class="dir-left-nowrap cross-bottom">
                                <view v-if="isUnderlinePrice == 1" :style="{'color': theme.color}" class="'box-grow-0', 'bd-member-price'">
                                    <app-price :price="`${price}`" type="text-price-all"></app-price>
                                </view>
                                <view v-if="isSales === 1" class="bd-sales">销量{{sales}}{{unit}}</view>
                            </view>
                        </template>
                       <template v-else>
                           <view class="dir-left-wrap cross-bottom">
                               <view :style="{'color': theme.color}" class="bd-price">
                                   <app-price :max="`${priceMax}`" :min="`${priceMin}`" :default-price="`${price}`"></app-price>
                               </view>
                               <view v-if="isUnderlinePrice == 1" class="bd-origin-price" >
                                   <app-price :price="`${originalPrice}`" type="text-price-all"></app-price>
                               </view>
                               <app-sup-vip v-if="discount" :is_vip_card_user="isVipCardUser" margin="0 0 0 13rpx" :discount="discount"></app-sup-vip>
                           </view>
                           <view class="dir-left-nowrap cross-bottom">
                               <view v-if="isSales === 1" class="bd-sales" >销量{{sales}}{{unit}}</view>
                           </view>
                       </template>
                    </view>
                </template>
                <template v-else>
                    <text :style="{'color': theme.color}" class="bd-negotiable">价格面议</text>
                </template>
            </view>
            <template v-if="isShowShare">
                <view class="box-grow-0 bd-share">
                    <view @click="shareClick"
                          :style="{'background-color': theme.background}"
                          class="bd-share-box dir-left-nowrap main-center cross-center">
                        <image class="bd-icon box-grow-0" src="/static/image/icon/icon-share-white.png"></image>
                        <text class="bd-text box-grow-0">分享</text>
                    </view>
                </view>
            </template>
            <template v-if="!isShowShare && $slots.share">
                <view class="bd-share">
                    <slot name="share"></slot>
                </view>
            </template>
            <template v-if="isShowShare">
                <bd-quick-share
                    v-model="quickShareShow"
                    @quickShare="quickShare"
                    :goods-id="goodsId"
                    :is-video-number="goods.is_video_number"
                    :extra-quick-share="extraQuickShare"
                    :app-share-pic="appSharePic"
                    :app-share-title="appShareTitle"
                ></bd-quick-share>
                <app-share-qr-code
                    @share="testShare"
                    v-model="shareShow"
                    :url="newShareUrl"
                    :goods="goods"
                    :poster-config="posterConfig"
                    :poster-generate="posterGenerate"
                    :has-poster-nav="hasPosterNav"
                    :app-share-pic="appSharePic"
                    :app-share-title="appShareTitle"
                ></app-share-qr-code>
            </template>
        </view>
        <slot></slot>
		<bd-info-extra :theme="theme" :min-number="minNumber" :limit-buy="limitBuy" :goods="goods" :unit="unit"></bd-info-extra>
        <app-vip-card v-if="isVip" background="#fff" top="20rpx"></app-vip-card>
        <view class="bd-margin" v-if="flashSale">
            <bd-flash-sale :flash-sale="flashSale" :theme="theme"></bd-flash-sale>
        </view>
        <view class="bd-margin" v-if="levelShow === 2 && isNegotiable === 0">
            <bd-join-member
                :member-max-price="`${priceMemberMax}`"
                :member-min-price="`${priceMemberMin}`"
                :price="`${price}`"
            ></bd-join-member>
        </view>
    </view>
</template>

<script>
import {mapState} from "vuex";
import AppVipCard from '@/components/page-component/app-vip-card/app-vip-card';
import bdFlashSale from '@/components/page-component/goods/bd-flash-sale.vue';
import appPrice from '@/components/page-component/goods/app-price.vue';
import bdJoinMember from '@/components/page-component/goods/bd-join-member.vue';
import appMemberMark from '@/components/page-component/app-member-mark/app-member-mark.vue';
import bdQuickShare from '@/components/page-component/goods/bd-quick-share.vue';
import appShareQrCode from '@/components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
import bdInfoExtra from '@/components/page-component/goods/bd-info-extra.vue';

export default {
    name: "u-info",
    props: {
        name: String,
        subtitle: String,
        isNegotiable: Number,
        theme: Object,
        flashSale: Object,
        levelShow: Number,
            price: {
                type: [Number, String]
            },
            originalPrice: {
                type: [Number, String]
            },
            priceMax: Number,
            priceMin: Number,
            priceMemberMax: Number,
            priceMemberMin: Number,
            isShowMember: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            discount: {
                type: [Number, String]
            },
            isVipCardUser: {
                type: Number,
                default() {
                    return 0;
                }
            },
            sales: {
                type: [Number, String]
            },
            unit: String,
            isSales: Number,
            goodsId: Number,
            goods: Object,
            isVip: Boolean,
            isShowShare: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            posterConfig: String,
            posterGenerate: String,
            hasPosterNav: {
                type: Boolean,
                default() {
                    return false
                },
            },
            shareUrl: String,
            appShareTitle: String,
            appSharePic: String,
            extraQuickShare: Object,
            minNumber: Number,
            limitBuy: Object,
            hasUnderlinePrice: {
                type: [Boolean, String],
                default:true
            }
        },
        data() {
            return {
                shareShow: false,
                quickShareShow: false
            }
        },
        components: {
            AppVipCard,
            bdFlashSale,
            appPrice,
            appMemberMark,
            bdJoinMember,
            bdQuickShare,
            appShareQrCode,
			bdInfoExtra
        },
        computed: {
            isUnderlinePrice() {
                return Number(this.is_underline_price) && this.hasUnderlinePrice
            },
            ...mapState({
                is_underline_price: state => state.mallConfig.mall.setting.is_underline_price
            }),
            newShareUrl() {
                if (this.shareUrl) {
                    return this.shareUrl;
                } else {
                    if (this.goodsId) {
                        return this.$api.poster.goods + '&goods_id=' + this.goodsId;
                    } else {
                        return ``;
                    }
                }
            }
        },
        methods: {
            testShare(s){
                this.$emit('share', s);
            },
            quickShare(e) {
                this.$emit('quickShare', e);
            },
            shareClick() {
                // 判断登入
                if (!this.$user.isLogin()) {
                    this.$user.getInfo().then(() => {
                    });
                } else {
                    if (this.extraQuickShare) {
                        this.quickShareShow = true;
                    } else {
                        this.shareShow = true;
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .bd-info {
        width: 702upx;
        background-color: #ffffff;
        border-radius: 15upx;
        padding: 20upx;
        margin: 24upx 24upx 24upx 24upx;
    }
    .bd-name {
        font-size: 32upx;
        color: #353535;
        line-height: 42upx;
        margin-top: 5upx;
    }
    .bd-subtitle {
        margin-top: 23upx;
        font-size: 24upx;
        line-height: 34upx;
        color: #999999;
    }
    .bd-price-share {
        margin-top: 20upx;
    }
    .bd-negotiable {
        font-size: 48upx;
        line-height: 53upx;
    }
    .bd-margin {
        margin-top: 20upx;
    }
    .bd-member-mark {
        margin-left: 12upx;
    }
    .bd-price {
        font-size: 56upx;
        line-height: 1;
        font-family: DIN;
    }
    .bd-sales {
        color: #999999;
        font-size: 24upx;
        margin-top: 22upx;
    }
    .bd-member-price {
        font-size: 32upx;
        margin-right: 20upx;
        line-height: 1;
    }
    .bd-origin-price {
        text-decoration: line-through;
        margin-left: 20upx;
        color: #999999;
        font-size: 28upx;
    }
    .bd-share {
        margin-top: 15upx;
        margin-right: -20upx;
    }

    .bd-share .bd-share-box {
        height: 48upx;
        border-radius: 40upx 0 0 40upx;
        padding: 0 14upx;
        width: 103upx;
    }

    .bd-share .bd-icon {
        width: 22upx;
        height: 22upx;
    }
    .bd-share .bd-text {
        color: #ffffff;
        font-size: 22upx;
        line-height: 30upx;
        margin-left: 10upx;
    }
</style>