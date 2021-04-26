<template>
    <view class="app-shop-product">
        <view class="app-mch dir-left-nowrap main-left cross-center">
            <view class="app-all-radio cross-center" @click="changeAllRadio(mch)" v-if="mch.new_status === 0 || editStatus">
                <view class="app-all" v-if="!mch.is_active"></view>
                <view class="app-all-active" v-else :style="{'background-color': theme.background}"></view>
            </view>
            <view v-else class="app-all-radio cross-center">
                <view class="app-all app-all-n"></view>
            </view>
            <view class="dir-left-nowrap cross-center">
                <view class="t-omit app-mch-name" @click="navigateMch(mch)">{{mch.name}}</view>
                <view v-if="mch.new_status === 2" class="close-tip">已打烊</view>
            </view>
        </view>
        <view v-for="(good, index) in mch.goods_list" :key="index">
            <view class="app-product dir-left-nowrap cross-top" :class="{'no-border': index == mch.goods_list.length - 1, 'padding': good.new_status == 3 && !good.attr}">
                <view class="app-single-radio dir-left-nowrap main-center cross-center">
                    <view v-if="(good.new_status === 2 || good.new_status === 3 || good.new_status === 4 || good.new_status === 5) && !editStatus"
                          class="app-invalid">失效</view>
                    <view v-else-if="(good.new_status === 6 || mch.new_status === 2 || good.new_status === 1 || !good.buy_goods_auth) && !editStatus" class="app-radio dir-top-nowrap main-center cross-center">
                        <view class="disabled-radio"></view>
                    </view>
                    <view class="app-radio dir-top-nowrap main-center cross-center" v-else
                          @click="changeSingleRadio(mch, good)">
                        <view class="radio-single" v-if="!good.is_active"></view>
                        <view class="radio-single-active" v-else :style="{'background-color': theme.background}"></view>
                    </view>
                </view>
                <view class="app-image" @click="jump(good)">
                    <image :src="good.attrs.pic_url ? good.attrs.pic_url : good.goods.cover_pic"></image>
                </view>
                <view class="app-content" :style="{'margin-bottom': good.sign === 'wholesale' ? good.new_status == 0 || good.new_status == 6 ?'0' : '50rpx' : '30rpx'}">
                    <view class="app-wholesale-title" v-if="good.sign === 'wholesale'" :class="{'app-failed-title': good.new_status !== 0 && !(good.new_status == 6 && good.sell_time > 0)}">
                        <view v-if="good.new_status === 3 || good.new_status === 5" class="t-omit">{{good.goods.name}}</view>
                        <view v-else  class="t-omit-two">{{good.goods.name}}</view>
                        <view class="rise-num dir-left-nowrap cross-center" :style="{'color': `${good.new_status !== 0 && good.new_status !== 6 ? '#999999' : good.new_status === 0 ? '#63be72': '#ff4544'}`}">
                            <image v-if="good.new_status !== 0 && good.new_status !== 6" class="num-icon" src="/static/image/icon/grey.png"></image>
                            <image v-else-if="good.new_status === 0" class="num-icon" src="/static/image/icon/friend-v.png"></image>
                            <view>起批量 {{good.plugin_data.up_num}}{{good.goods.goodsWarehouse.unit}}</view>
                        </view>
                    </view>
                    <text class="app-title" v-else :class="{'app-failed-title': good.new_status !== 0 && !(good.new_status == 6 && good.sell_time > 0)}">
                        {{good.goods.name}}
                    </text>
                    <view class="app-specification-style" v-if="good.sign !== 'wholesale'">
                        <text v-for="(item, index) in good.attrs.attr" v-bind:key="index">
                            {{item.attr_group_name}}: {{item.attr_name}}
                        </text>
                    </view>

                    <view class="app-failed-goods" v-if="good.sell_time > 0 && good.new_status != 2 && good.new_status != 3 && good.new_status != 4 && good.new_status != 5">
                        <view
                              class="app-text app-sell-string dir-left-nowrap main-left cross-center">
                            <icon class="app-flash-sale-spike-icon"></icon>
                            即将开售 还剩{{good.sell_string}}开售
                        </view>
                    </view>
                    <view class="app-miaosha dir-left-nowrap main-left cross-center" v-if="good.sign === 'miaosha'">
                        <icon class="app-miaosha-icon"
                              v-if="good.miaosha_status === 2 || good.miaosha_status === 1" type></icon>
                        <icon class="app-spike-icon" v-if="good.miaosha_status === 0" type></icon>
                        <view class="app-beginning" v-if="good.miaosha_status === 1">
                            秒杀中  还剩
                            {{good.miaosha_string}}
                            结束
                        </view>
                        <text class="app-over" v-if="good.miaosha_status === 0">秒杀已结束</text>
                    </view>

                    <view class="app-miaosha dir-left-nowrap main-left cross-center" v-if="good.sign === 'flash_sale'">
                        <icon class="app-flash-sale-icon"
                              :style="{'background-color': theme.background}"
                              v-if="good.flash_sale_status === 1" type></icon>
                        <icon class="app-flash-sale-spike-icon" v-if="good.flash_sale_status === 2 || good.flash_sale_status === 0" type></icon>
                        <view class="app-beginning" v-if="good.flash_sale_status === 1">
                            抢购中  还剩
                            {{good.flash_sale_string}}
                            结束
                        </view>
                        <view class="app-beginning" v-if="good.flash_sale_status === 2">
                            抢购未开始  还剩
                            {{good.flash_sale_string}}
                            开始
                        </view>
                        <text class="app-over" v-if="good.flash_sale_status === 0">抢购已结束</text>
                    </view>

                    <view class="dir-top-nowrap" v-if="(good.new_status === 0 || (good.new_status === 6 && good.sell_time > 0)) && good.buy_goods_auth && good.sign !== 'wholesale'">
                        <view class="reduce-price" v-if="good.reduce_price > 0 && good.new_status === 0">
                            比加入时降￥{{good.reduce_price}}
                        </view>
                        <view v-if="good.attrs && (good.attrs.price || good.attrs.price == 0)" class="app-price-button dir-left-nowrap main-between cross-center">
                            <text class="app-price" :style="{'color': theme.color}">
                                {{good.attrs.price}}
                            </text>
                            <view v-if="good.sign != 'wholesale'">
                                <app-add-subtract
                                    v-model="mch.goods_list[index].num"
                                    :good_id="mch.goods_list[index].id"
                                    :stock="good.attrs.stock"
                                    @change="change"
                                    :theme="theme"
                                ></app-add-subtract>
                            </view>
                        </view>
                    </view>

                    <view class="app-failed-goods" v-else-if="!good.buy_goods_auth">
                        <view
                              class="app-text dir-left-nowrap main-left cross-center">
                            您暂无权限购买该商品
                        </view>
                    </view>
                    <view class="app-failed-goods" v-else>
                        <view v-if="good.new_status === 2"
                              class="app-text dir-left-nowrap main-left cross-center">
                            商品已售罄,请联系卖家
                        </view>
                        <view v-else-if="good.new_status === 3"
                              class="app-text  dir-left-nowrap main-left cross-center">
                            商品已失效
                        </view>
                        <view v-else-if="good.new_status === 4"
                              class="app-text  dir-left-nowrap main-left cross-center">
                            商户已关闭
                        </view>
                        <view v-else-if="good.new_status === 5"
                              class="app-text dir-left-nowrap main-left cross-center">
                            商品已下架
                        </view>
                    </view>
                </view>
            </view>
            <view class="app-wholesale-style" :class="{'border': good.sign != 'wholesale'}" v-if="mch.mch_id == 0 && ((good.sign != 'wholesale' && mch.goods_list && mch.goods_list[index+1] && mch.goods_list[index+1].sign === 'wholesale') || (good.sign === 'wholesale' && (good.new_status === 0 || good.new_status === 6)))">
                <view class="app-wholesale-attr dir-left-nowrap cross-center" v-for="(attr, idx) in good.attr_arr" :key="idx">
                    <view class="app-single-radio dir-left-nowrap main-center cross-center">
                        <view v-if="(good.new_status === 6 || mch.new_status === 2 || good.new_status === 1 || !good.buy_goods_auth) && !editStatus" class="app-radio dir-top-nowrap main-center cross-center">
                            <view class="disabled-radio"></view>
                        </view>
                        <view class="app-radio dir-top-nowrap main-center cross-center" v-else
                              @click="changeSingleRadio(mch, attr)">
                            <view class="radio-single" v-if="!attr.is_active"></view>
                            <view class="radio-single-active" v-else :style="{'background-color': theme.background}"></view>
                        </view>
                    </view>
                    <view class="attr-wholesale-item main-between cross-center">
                        <view class="attr-item-name">
                            <text v-for="(item, index) in attr.attrs.attr" v-bind:key="index">
                                <text v-if="index > 0">/</text>
                                {{item.attr_name}}
                            </text>
                            <view :style="{'color': theme.color}">￥{{attr.price ? attr.price : attr.attrs.price}}</view>
                        </view>
                        <app-add-subtract
                            v-model="attr.num"
                            :good_id="attr.id"
                            background="#f5f5f5"
                            :stock="attr.attr_info.stock"
                            @change="change"
                            :theme="theme"
                        ></app-add-subtract>
                    </view>
                </view>
                <view class="wholesale-total dir-right-nowrap cross-center" v-if="good.sign === 'wholesale' && (good.new_status === 0 || good.new_status === 6)">
                    <view class="wholesale-total-price" :style="{'color': theme.color}">￥{{good.price}}</view>
                    <view>共{{good.sell_time > 0 ? '0' : good.attrs.num}}{{good.goods.goodsWarehouse.unit}}</view>
                </view>
            </view>
        </view>
    </view>
</template>


<script>
    import appRadio from '../../../../components/basic-component/app-radio/app-radio.vue';
    import appAddSubtract from '../app-add-subtract/app-add-subtract.vue';

    export default {
        name: "app-shop-product",
        components: {
            'app-radio': appRadio,
            'app-add-subtract': appAddSubtract,
        },
        props: {
            mch: {
                type: Object
            },
            editStatus: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            theme: Object
        },
        data() {
            return {
                timer: null,
                time: '0'
            }
        },
        methods: {
            navigateMch(mch) {
                if (mch.mch_id) {
                    uni.navigateTo({
                        url: `/plugins/mch/shop/shop?mch_id=${mch.mch_id}`
                    });
                }
            },
            changeSingleRadio(mch, item) {
                this.$emit('changeSingleRadio', {mch, item});
            },
            changeAllRadio(data) {
                this.$emit('changeRadioAll', data);
            },
	        
            jump(good) {
                if (good.new_status !== 0)  return;
                let url = ``;
                if (good.mch_id > 0) {
                    url = `/plugins/mch/goods/goods?id=${good.goods.id}&mch_id=${good.mch_id}`;
                } else if (good.sign === 'miaosha') {
                    url = `/plugins/miaosha/goods/goods?id=${good.goods.id}`;
                } else if (good.sign === 'flash_sale') {
                    url = `/plugins/flash_sale/goods/goods?id=${good.goods.id}`;
                } else if (good.sign === 'wholesale') {
                    url = `/plugins/wholesale/goods/goods?id=${good.goods.id}`;
                } else {
                    url = `/pages/goods/goods?id=${good.goods.id}`;
                }
                uni.navigateTo({
                    url
                });
            },
	        
            change({number, id}) {
                this.$emit('change', {
                    number, id, mch_id:  this.mch.mch_id
                });
            }
        },
    }
</script>

<style scoped lang="scss">
    .app-shop-product {
        width: #{750rpx};
        background-color: #ffffff;
        margin-top: #{20rpx};
        >view:last-of-type {
            .app-wholesale-style {
                padding-bottom: 0;
            }
        }
    }

    .app-mch {
        border-bottom: #{1rpx} solid #e2e2e2;
        height: #{80rpx};
        width: 100%;
        .app-all-radio {
            width: #{94rpx};
            height: #{80rpx};
            .app-all {
                width: #{40rpx};
                height: #{40rpx};
                border-radius: 50%;
                margin-left: #{24rpx};
                background-color: white;
                border: #{2rpx} solid #cccccc;
            }
            .app-all-n {
                background-color: #cdcdcd !important;
            }
            .app-all-active {
                width: #{40rpx};
                height: #{40rpx};
                border-radius: 50%;
                margin-left: #{24rpx};
                background-repeat: repeat;
                background-size: 100% 100%;
                background-image: url("../../../../static/image/icon/yes-radio.png");
            }
        }
        .app-mch-name {
            max-width: #{522rpx};
            font-size: #{26rpx};
            color: #666666;
        }
        .close-tip {
            font-size: #{22rpx};
            height: #{32rpx};
            line-height: #{32rpx};
            border-radius: #{16rpx};
            padding: 0 #{8rpx};
            color: #fff;
            background-color: #c0c0c0;
            margin-left: #{20rpx};
        }
    }

    .app-product {
        width: 100%;
        margin-top: #{30rpx};
        &.padding {
            padding-bottom: #{30rpx};
        }
        &:last-of-type {
            border-bottom: #{1rpx} solid #e2e2e2;
        }
        &.no-border {
            border-bottom: 0;
        }
        .app-single-radio {
            width: #{84rpx};
            height: #{156rpx};
            .disabled-radio {
                width: #{40rpx};
                height: #{40rpx};
                border-radius: 50%;
                border: #{2rpx} solid #cccccc;
                background-color: #cdcdcd;
            }
            .app-radio {
                width: #{84rpx};
                height: #{156rpx};
                .radio-single {
                    width: #{40rpx};
                    height: #{40rpx};
                    border-radius: 50%;
                    background-color: white;
                    border: #{2rpx} solid #cccccc;
                }
                .radio-single-active {
                    width: #{40rpx};
                    height: #{40rpx};
                    border-radius: 50%;
                    background-repeat: repeat;
                    background-size: 100% 100%;
                    background-image: url("../../../../static/image/icon/yes-radio.png");
                }
            }
            .app-invalid {
                width: #{64rpx};
                height: #{32rpx};
                line-height: #{32rpx};
                border-radius: #{16rpx};
                text-align: center;
                font-size: #{24rpx};
                color: #FFFFFF;
                background-color: #cdcdcd;
            }
        }
        .app-image {
            width: #{156rpx};
            height: #{156rpx};
            image {
                width: 100%;
                height: 100%;
            }
        }
        .app-content {
            width: #{466rpx};
            background-color: white;
            margin: 0 #{24rpx} #{30rpx} #{20rpx};
            .app-title {
                width: 100%;
                font-size: #{28rpx};
                color: #353535;
                word-break: break-all;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                margin-bottom: #{10rpx};
            }
            .app-wholesale-title {
                width: 100%;
                font-size: #{28rpx};
                color: #353535;
                .rise-num {
                    margin-top: #{10rpx};
                    font-size: 24rpx;
                    margin-bottom: 20rpx;
                    .num-icon {
                        width: 28rpx;
                        max-height: 28rpx;
                        margin-right: 12rpx;
                    }
                }
            }
            .app-failed-title {
                color: #999999;
            }
            .app-specification-style {
                margin-bottom: #{16rpx};
                text {
                    font-size: #{24rpx};
                    color: #999999;
                    margin-right: #{36rpx};
                }
                .wholesale-attr {
                    font-size: 16rpx;
                    background-color: #f5f5f5;
                    border-radius: 16rpx;
                    padding: 12rpx 16rpx;
                    position: relative;
                    .wholesale-attr-item {
                        width: 90%;
                        .attr-num {
                            margin-left: 5rpx;
                        }
                        text {
                            margin-right: 5rpx;
                        }
                    }
                    .more-icon {
                        position: absolute;
                        height: 25rpx;
                        width: 5rpx;
                        bottom: 16rpx;
                        right: 16rpx;
                    }
                }
            }
            .app-miaosha {
                width: 100%;
                margin-bottom: #{24rpx};
                .app-miaosha-icon {
                    width: #{29rpx};
                    height: #{29rpx};
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    background-image: url("../../../../static/image/cart/miaosha.png");
                    margin-right: #{12rpx};
                }
                .app-flash-sale-icon {
                    width: #{29rpx};
                    height: #{29rpx};
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    background-image: url("../../../../static/image/plugins/flash-sale-icon.png");
                    margin-right: #{12rpx};
                }
                .app-flash-sale-spike-icon {
                    width: #{29rpx};
                    height: #{29rpx};
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    background-image: url("../../../../static/image/plugins/flash-sale-icon.png");
                    margin-right: #{12rpx};
                    background-color: #cdcdcd;
                }
                .app-spike-icon {
                    width: #{29rpx};
                    height: #{29rpx};
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    background-image: url("../../../../static/image/cart/spike-invalid.png");
                    margin-right: #{12rpx};
                }
                .app-beginning {
                    font-size: #{22rpx};
                    color: #ff4544;
                }
                .app-over {
                    font-size: #{22rpx};
                    color: #999999;
                }
            }
            .app-failed-goods {
                width: 100%;
                .app-text {
                    color: #353535;
                    font-size: #{25rpx};
                }
                .app-spike {
                    margin-bottom: #{24rpx};
                }
                .app-spike-icon {
                    width: #{29rpx};
                    height: #{29rpx};
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    background-image: url("../../../../static/image/cart/spike-invalid.png");
                    margin-right: #{12rpx};
                }
                .app-spike-text {
                    font-size: #{24rpx};
                    color: #999999;
                }
                .app-sell-string {
                    font-size: #{24rpx};
                    color: #ff4544;
                    .app-flash-sale-spike-icon {
                        width: #{29rpx};
                        height: #{29rpx};
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        background-image: url("../../../../static/image/plugins/flash-sale-icon.png");
                        margin-right: #{12rpx};
                        background-color: #cdcdcd;
                    }
                }
            }
            .app-price-button {
                width: 100%;
                height: #{60rpx};
                .app-price {
                    font-size: #{32rpx};
                }
                .app-price:before {
                    content: '￥';
                    font-size: #{24rpx};
                }
            }

            .reduce-price {
                color: #ff4544;
                font-size: #{24rpx};
            }
        }
    }
    .app-wholesale-style {
        background-color: #f7f7f7;
        padding-bottom: 20rpx;
        &.border {
            border-top: 1rpx solid #e2e2e2;
        }
        .wholesale-total {
            padding-right: 44rpx;
            height: 70rpx;
            background-color: #fff;
            border-top: 1rpx solid #e2e2e2;
            border-bottom: 1rpx solid #e2e2e2;
            font-size: 22rpx;
            color: #353535;
            .wholesale-total-price {
                font-size: 30rpx;
                height: 40rpx;
                margin-left: 20rpx;
                padding-left: 20rpx;
                border-left: 2rpx solid #e2e2e2;
            }
        }
        .app-wholesale-attr {
            padding-right: 24rpx;
            padding-bottom: 20rpx;
            background-color: #fff;
            &:first-of-type {
                padding-top: 20rpx;
            }
            .app-single-radio {
                width: #{84rpx};
                .disabled-radio {
                    width: #{40rpx};
                    height: #{40rpx};
                    border-radius: 50%;
                    border: #{2rpx} solid #cccccc;
                    background-color: #cdcdcd;
                }
                .app-radio {
                    width: #{84rpx};
                    .radio-single {
                        width: #{40rpx};
                        height: #{40rpx};
                        border-radius: 50%;
                        background-color: white;
                        border: #{2rpx} solid #cccccc;
                    }
                    .radio-single-active {
                        width: #{40rpx};
                        height: #{40rpx};
                        border-radius: 50%;
                        background-repeat: repeat;
                        background-size: 100% 100%;
                        background-image: url("../../../../static/image/icon/yes-radio.png");
                    }
                }
            }
            .attr-wholesale-item {
                width: 640rpx;
                background-color: #f5f5f5;
                min-height: 100rpx;
                padding: 20rpx;
                .attr-item-name {
                    font-size: 22rpx;
                    width: 400rpx;
                    text {
                        color: #666666;
                    }
                }
            }
        }
    }
</style>