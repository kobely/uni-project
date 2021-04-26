<template>
    <view class="app-submit-goods">

        <view v-if="plugin !== 'composition'"
              class="app-submit-goods-item">
            <view v-for="(goodsItem, goodsIndex) in newList.goods_list" :key="goodsIndex"
                  class="goods-item">
                <view class="dir-left-nowrap">
                    <view class="box-grow-0" style="position: relative;">
                        <view v-if="goodsItem.address_disabled" class="address-disabled">不在配送范围内</view>
                        <image class="goods-image"
                               :src="goodsItem.goods_attr.pic_url ? goodsItem.goods_attr.pic_url : goodsItem.cover_pic"></image>
                    </view>
                    <view class="box-grow-1 dir-top-nowrap">
                        <view class="goods-name box-grow-1">{{goodsItem.name}}</view>
                        <view class="box-grow-0">
                            <view class="dir-left-wrap attr-list">
                                <view v-for="(attrItem,attrIndex) in goodsItem.attr_list"
                                      :key="attrIndex"
                                      class="attr-item">
                                    {{attrItem.attr_group_name}}：{{attrItem.attr_name}}
                                </view>
                            </view>
                            <view class="dir-left-nowrap">
                                <view class="box-grow-1 goods-num">×{{goodsItem.num}}</view>
                                <view class="box-grow-0 goods-price-info">
                                    <view>
                                        <text v-for="(customCurrency,customCurrencyIndex) in goodsItem.custom_currency"
                                              :key="customCurrencyIndex">
                                            {{customCurrency}}+
                                        </text>
                                        <text class="goods-price-unit">￥</text>
                                        <text>{{goodsItem.total_original_price}}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view v-for="(discount,discountIndex) in goodsItem.discounts"
                      :key="discountIndex"
                      :class="[themeTextClass]"
                      :style="{'text-align': 'right','padding-top': '12rpx','font-size': '24rpx','color': !is_gift ? theme.color : ''}">
                    <view style="display: inline-block; margin-right: 6rpx;">{{discount.name}}</view>
                    <template v-if="discount.value<0">-¥{{priceFormat(0-discount.value)}}</template>
                    <template v-else-if="discount.value>0">+¥{{priceFormat(discount.value)}}</template>
                    <template v-else>¥0.00</template>
                </view>
            </view>
        </view>

        <view v-else class="composition">
            <view class="composition-item" v-for="(compositionItem, compositionIndex) in newList.composition_list"
                  :key="compositionIndex">
                <view v-for="(goodsItem, goodsIndex) in compositionItem.goods_list" :key="goodsIndex"
                      class="goods-item">
                    <view class="dir-left-nowrap">
                        <view class="box-grow-0" style="position: relative;">
                            <view v-if="goodsItem.address_disabled" class="address-disabled">不在配送范围内</view>
                            <image class="goods-image"
                                   :src="goodsItem.goods_attr.pic_url ? goodsItem.goods_attr.pic_url : goodsItem.cover_pic"></image>
                        </view>
                        <view class="box-grow-1 dir-top-nowrap">
                            <view class="goods-name box-grow-1">{{goodsItem.name}}</view>
                            <view class="box-grow-0">
                                <view class="dir-left-wrap attr-list">
                                    <view v-for="(attrItem,attrIndex) in goodsItem.attr_list"
                                          :key="attrIndex"
                                          class="attr-item">
                                        {{attrItem.attr_group_name}}：{{attrItem.attr_name}}
                                    </view>
                                </view>
                                <view class="dir-left-nowrap goods-other">
                                    <view class="box-grow-1 goods-num">×{{goodsItem.num}}</view>
                                    <view v-if="compositionItem.type == 2" class="box-grow-0 goods-price-info">
                                        <view>
                                            <text v-for="(customCurrency,customCurrencyIndex) in goodsItem.custom_currency"
                                                  :key="customCurrencyIndex">
                                                {{customCurrency}}+
                                            </text>
                                            <text class="goods-price-unit">￥</text>
                                            <text>{{goodsItem.total_price}}</text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view v-for="(discount,discountIndex) in goodsItem.discounts"
                          :key="discountIndex"
                          :class="[themeTextClass]"
                          :style="{'text-align': 'right','padding-top': '12rpx','font-size': '24rpx','color': !is_gift ? theme.color : ''}">
                        <view style="display: inline-block; margin-right: 6rpx;">{{discount.name}}</view>
                        <template v-if="discount.value<0">-¥{{priceFormat(0-discount.value)}}
                        </template>
                        <template v-else-if="discount.value>0">+¥{{priceFormat(discount.value)}}
                        </template>
                        <template v-else>¥0.00</template>
                    </view>
                </view>
                <view class="composition-info" :class="[themeTextClass]" :style="{'color': !is_gift ? theme.color : ''}">
                    <view style="margin-bottom: 8rpx;">{{compositionItem.type == 1 ? '固定套餐' : '搭配套餐'}}
                        ￥{{compositionItem.total_price}}
                    </view>
                    <view class="composition-discount">已省 ￥{{compositionItem.composition_price}}</view>
                </view>
            </view>
        </view>

    </view>
</template>

<script>

    import {mapState} from 'vuex';

    export default {
        name: "app-submit-goods",
        props: {
            list: {
                type: Object
            },
            plugin: {
                type: String
            },
            index: {
                type: Number
            },
            theme: [String, Object],
        },
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img,
            }),
            themeTextClass() {
                if (typeof(this.theme) == 'string' && this.theme.indexOf('gift') > 0) {
                    return `${this.theme} ${this.theme}-color`;
                }
            },
            is_gift() {
                if (typeof(this.theme) == 'string' && this.theme && this.theme.indexOf('gift') > 0) {
                    return true;
                }else {
                    return false;
                }
            },
            newList:function () {
                return this.list;
            }
        },
        methods: {
            priceFormat(val) {
                if (isNaN(val)) {
                    return val;
                }
                return parseFloat(val).toFixed(2);
            },
        },
        mounted() {
            console.log(this.list.goods_list);
        }
    }
</script>

<style scoped lang="scss">
    .app-submit-goods {
        .composition {
            .composition-item {
                margin-top: #{24rpx};

                .composition-open {
                    text-align: center;
                    background-color: #fff;
                    height: #{84rpx};

                    .composition-btn {
                        display: inline-block;
                        border: #{2rpx} solid #bbbbbb;
                        font-size: #{24rpx};
                        color: #999999;
                        padding: 0 #{24rpx};
                        margin: #{12rpx} 0 #{16rpx};
                        height: #{56rpx};
                        line-height: #{54rpx};
                        border-radius: #{28rpx};

                        image {
                            width: #{22rpx};
                            height: #{12rpx};
                            margin-left: #{16rpx};
                        }
                    }
                }

                .composition-info {
                    background-color: #fff;
                    font-size: #{28rpx};
                    text-align: right;
                    padding: #{24rpx};

                    .composition-discount {
                        font-size: #{24rpx};
                    }
                }
            }
        }

        .goods-item {
            background: #fff;
            padding: #{28rpx} #{32rpx};
            border-bottom: #{1rpx} solid #e2e2e2;
            font-size: #{28rpx};

            .address-disabled {
                background: #ffecec;
                color: #ff4544;
                position: absolute;
                bottom: 0;
                left: 0;
                right: #{22rpx};
                padding: #{12rpx} 0;
                text-align: center;
                font-size: #{20rpx};
                z-index: 100;
            }

            .goods-image {
                width: #{156rpx};
                height: #{156rpx};
                display: block;
                margin-right: #{24rpx};
                font-size: #{24rpx};
            }

            .goods-name {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.25;
            }

            .attr-list {
                margin-bottom: #{12rpx};
            }

            .attr-list, .goods-num {
                font-size: #{24rpx};
                color: #999999;
            }

            .goods-other {
                margin-top: #{16rpx};
            }

            .attr-item {
                margin-right: #{24rpx};
            }

            .attr-item:last-child {
                margin-right: 0;
            }

            .goods-price-info {
                text-align: right;
            }
        }

        .goods-item:last-child {
            border-bottom: none;
        }
    }
</style>