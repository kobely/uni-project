<template>
    <app-layout>
        <template v-if="result">
            <view class="pay-result mb-24" :class="{'over-page' : community}">
                <image class="top-pic mb-24" :src="appImg.mall.order_pay_success"></image>
                <view class="mb-24" style="font-weight: bold;">订单提交成功</view>
                <view class="pay-price mb-24">￥{{result.total_pay_price}}</view>
                <view class="dir-left-nowrap main-center">
                    <view v-if="!community" class="btn-wrap">
                        <view class="return-btn"
                              style="color: #999999;border-color: #e2e2e2"
                              @click="reLaunch('/pages/index/index')">返回首页
                        </view>
                    </view>
                    <view class="btn-wrap">
                        <view class="return-btn" :style="{'color': getTheme.color}" @click="redirectTo(orderPageUrl)">
                            {{community?'查看详情':'查看订单'}}
                        </view>
                    </view>
                </view>

                <view v-if="showGift" class="gift">
                    <image class="background" :src="appImg.mall.order_pay_result_coupon"></image>
                    <view class="title">恭喜你获得</view>
                    <scroll-view scroll-y class="gift-scroll">
                        <template v-if="result.send_data && result.send_data.send_integral_num>0">
                            <view class="item dir-left-nowrap cross-center">
                                <view class="box-grow-0">
                                    <image class="integral-img" src="/static/image/integral.png"></image>
                                </view>
                                <view class="box-grow-1">
                                    <view class="send-data-name mb-12">{{result.send_data.send_integral_num}}积分</view>
                                    <view class="send-data-desc">即时到账</view>
                                </view>
                                <view class="box-grow-0">
                                    <app-form-id>
                                        <view class="return-btn small"
                                              :style="{'background-color': getTheme.background, 'border-color': getTheme.border}"
                                              @click="redirectTo('/pages/index/index')">
                                            立即使用
                                        </view>
                                    </app-form-id>
                                </view>
                            </view>
                        </template>
                        <template v-if="result.send_data && result.send_data.send_balance>0">
                            <view class="item dir-left-nowrap cross-center">
                                <view class="box-grow-0">
                                    <image class="hongbao-img" src="/static/image/hongbao.png"></image>
                                </view>
                                <view class="box-grow-1">
                                    <view class="send-data-name mb-12">{{result.send_data.send_balance}}元余额红包</view>
                                    <view class="send-data-desc">即时到账</view>
                                </view>
                                <view class="box-grow-0">
                                    <app-form-id>
                                        <view class="return-btn small"
                                              :style="{'background-color': getTheme.background, 'border-color': getTheme.border}"
                                              @click="redirectTo('/pages/index/index')">
                                            立即使用
                                        </view>
                                    </app-form-id>
                                </view>
                            </view>
                        </template>
                        <template v-if="result.user_coupon_list && result.user_coupon_list.length">
                            <view class="item dir-left-nowrap cross-center"
                                  v-for="(item,index) in result.user_coupon_list"
                                  :key="index">
                                <view class="box-grow-0 dir-left-nowrap cross-bottom main-center">
                                    <template v-if="item.type==1">
                                        <view class="coupon-discount">{{item.discount}}</view>
                                        <view class="coupon-discount-unit">折</view>
                                    </template>
                                    <template v-if="item.type==2">
                                        <view class="coupon-price-unit">￥</view>
                                        <view class="coupon-price">{{item.sub_price}}</view>
                                    </template>
                                </view>
                                <view class="box-grow-1">
                                    <view class="coupon-name mb-12">{{item.name}}</view>
                                    <view class="coupon-desc">
                                        <block v-if="item.min_price>0">满{{item.min_price}}元可用</block>
                                        <block v-else>满任意金额可用</block>
                                    </view>
                                    <view class="coupon-desc" v-if="item.discount_limit">优惠上限:￥{{item.discount_limit}}</view>
                                </view>
                                <view class="box-grow-0">
                                    <app-form-id>
                                        <view class="return-btn small"
                                              :style="{'background-color': getTheme.background, 'border-color': getTheme.border}"
                                              @click="redirectTo(item.appoint_type == 4 ? '/plugins/scan_code/index/index': '/pages/coupon/index/index')">
                                            立即使用
                                        </view>
                                    </app-form-id>
                                </view>
                            </view>
                        </template>
                        <template v-if="result.card_list && result.card_list.length">
                            <view class="item dir-left-nowrap cross-center" v-for="(item,index) in result.card_list"
                                  :key="index">
                                <view class="box-grow-0">
                                    <image class="card-img" :src="item.pic_url"></image>
                                </view>
                                <view class="box-grow-1">
                                    <view class="card-name">{{item.name}}</view>
                                </view>
                                <view class="box-grow-0">
                                    <app-form-id>
                                        <view class="return-btn small"
                                              :style="{'background-color': getTheme.background, 'border-color': getTheme.border}"
                                              @click="redirectTo('/pages/card/index/index')">
                                            立即使用
                                        </view>
                                    </app-form-id>
                                </view>
                            </view>
                        </template>
                    </scroll-view>
                </view>
            </view>

            <app-related-suggestion-product v-if="recommendGoodsList && recommendGoodsList.length"
                                            :list="recommendGoodsList"
                                            text="您或许会喜欢"
                                            :theme="getTheme"
            ></app-related-suggestion-product>
            <app-order-share-modal v-if="shareCheck"></app-order-share-modal>
        </template>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import AppRelatedSuggestionProduct
        from '../../components/page-component/app-related-suggestion-product/app-related-suggestion-product';
    import appOrderShareModal from "../../components/page-component/app-order-share-modal/app-order-share-modal.vue";

    export default {
        name: 'pay-result',
        components: {
            AppRelatedSuggestionProduct,
            appOrderShareModal
        },
        data() {
            return {
                payment_order_union_id: null,
                result: null,
                redirectUrl: null,
                recommendGoodsList: null,
                shareCheck: false,
                orderPageUrl: false,
                community: false
            };
        },
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img,
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            showGift() {
                if (!this.result || this.community) {
                    return false;
                }
                let { send_data, user_coupon_list, card_list } = this.result;
                if ((send_data && send_data.send_integral_num > 0) || (send_data && send_data.send_balance > 0) || (user_coupon_list && user_coupon_list.length) || (card_list && card_list.length)) {
                    return true;
                }
                return false;
            },
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.payment_order_union_id = options.payment_order_union_id;
            this.orderPageUrl = decodeURIComponent(options.order_page_url || '/pages/order/index/index?status=0');
            if(options.order_page_url === '/plugins/community/order/order') {
                this.orderPageUrl = this.orderPageUrl + '?is_user=1'
                this.community = true;
            }
            this.loadData();
            this.loadRecommendGoodsList();
        },
        methods: {
            loadData() {
                this.$showLoading({
                    type: 'global',
                });
                this.$request({
                    url: this.$api.order.pay_result,
                    data: {
                        payment_order_union_id: this.payment_order_union_id
                    }
                }).then(response => {
                    this.$hideLoading();
                    if (response.code === 0) {
                        this.result = response.data;
                        this.shareCheck = this.result.shareCheck;
                        if (this.result.order_page_url) {
                            this.orderPageUrl = this.result.order_page_url;
                        }
                    }
                }).catch(() => {
                    this.$hideLoading();
                });
            },
            redirectTo(url) {
                uni.redirectTo({
                    url: url,
                });
            },
            reLaunch(url) {
                uni.reLaunch({
                    url: url,
                });
            },
            loadRecommendGoodsList() {
                if (this.community) {
                    return false;
                }
                this.$request({
                    url: this.$api.goods.new_recommend,
                    method: 'get',
                    data: {
                        type: 'order_pay',
                    },
                }).then(response => {
                    if (response.code === 0) {
                        this.recommendGoodsList = response.data.list;
                    }
                }).catch(() => {
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    .return-btn {
        height: #{72rpx};
        line-height: #{70rpx};
        border: #{2rpx} solid;
        border-radius: #{1000rpx};
        padding: 0 #{32rpx};
        font-size: $uni-font-size-general-one;
    }

    .return-btn:active {
        box-shadow: inset 0 0 #{100rpx} rgba(0, 0, 0, .15);
    }

    .return-btn.small {
        height: #{60rpx};
        line-height: #{58rpx};
        padding: 0 #{24rpx};
        font-size: #{24rpx};
        color: #ffffff;
    }


    .mb-12 {
        margin-bottom: #{12rpx};
    }

    .mb-24 {
        margin-bottom: #{24rpx};
    }

    .pay-result {
        text-align: center;
        background: #fff;
        padding: #{36rpx};
        &.over-page {
            position: absolute;
            width: 100%;
            height: 100%;
        }
        .top-pic {
            width: #{220rpx};
            height: #{172rpx};
        }

        .pay-price {
            color: $uni-general-color-one;
        }

        .default-border {
            border-color: $uni-general-color-two;
        }

        .btn-wrap {
            padding: #{36rpx};
        }

        .gift {
            position: relative;
            padding: #{24rpx};
            border-radius: #{20rpx};
            background: #ffbe6a;

            .background {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: #{102rpx};
                z-index: 0;
            }

            .title {
                text-align: center;
                font-weight: bold;
                color: #fff;
                margin-bottom: #{24rpx};
            }

            .gift-scroll {
                max-height: #{400rpx};
            }

            .item {
                background: #fff;
                margin-bottom: #{24rpx};
                border-radius: #{18rpx};
                padding: #{18rpx};
                min-height: #{160rpx};

                > view:nth-of-type(1) {
                    min-width: #{180rpx};
                }

                > view:nth-of-type(2) {
                    text-align: left;
                    margin-left: #{10rpx};
                }
            }

            .item:last-child {
                margin-bottom: 0;
            }


            .coupon-discount,
            .coupon-discount-unit,
            .coupon-price-unit,
            .coupon-price {
                color: $uni-important-color-red;
                line-height: 1;
            }

            .coupon-discount-unit,
            .coupon-price-unit {
                line-height: 1.15;
            }

            .coupon-price,
            .coupon-discount {
                font-size: #{48rpx};
            }

            .hongbao-img,
            .integral-img,
            .card-img {
                width: #{80rpx};
                height: #{80rpx};
                border-radius: #{1000rpx};
            }

            .coupon-name,
            .card-name {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .send-data-desc,
            .coupon-desc {
                font-size: $uni-font-size-weak-one;
                color: $uni-general-color-one;
            }
        }
    }

</style>