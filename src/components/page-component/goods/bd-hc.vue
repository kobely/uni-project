<template>
    <view class="bd-hc" v-if="(integral && integral.title) || (balance && balance.title) || (card && card.list.length > 0) || (coupon && coupon.list.length > 0)">
        <view class="bd-block dir-left-nowrap cross-center" v-if="integral && integral.title">
            <view class="box-grow-0">活动</view>
            <view class="bd-give box-grow-0 main-center cross-center" :style="{'color': theme.color}">
                送积分
            </view>
            <view class="content u-line-1 box-grow-1">{{integral.title}}</view>
        </view>
        <view class="bd-block dir-left-nowrap cross-center" v-if="balance && balance.title">
            <view class="box-grow-0">促销</view>
            <view class="bd-give box-grow-0 main-center cross-center" :style="{'color': theme.color}">
                赠余额
            </view>
            <view class="content u-line-1 box-grow-1">{{balance.title}}</view>
        </view>
        <view class="bd-block dir-left-nowrap cross-center" v-if="card && card.list.length > 0" @click="change('card', '卡券')">
            <view class="box-grow-0">{{!(balance && balance.title) ? '促销' : ''}}</view>
            <view class="bd-give box-grow-0 main-center cross-center" :style="{'color': theme.color}">
                赠卡券
            </view>
            <view class="content u-line-1 box-grow-1">{{card.title}}</view>
            <image class="box-grow-0 bd-icon" src="/static/image/icon/arrow-right.png"></image>
        </view>
        <view class="bd-block dir-left-nowrap cross-center" v-if="coupon && coupon.list.length > 0" @click="change('coupon', '优惠券')">
            <view class="box-grow-0">{{!(balance && balance.title && card && card.list.length > 0) ? '促销' : ''}}</view>
            <view class="bd-give box-grow-0 main-center cross-center" :style="{'color': theme.color}">
                赠优惠券
            </view>
            <view class="content u-line-1 box-grow-1">{{coupon.title}}</view>
            <image class="box-grow-0 bd-icon" src="/static/image/icon/arrow-right.png"></image>
        </view>
        <u-popup v-model="show" mode="bottom" border-radius="14" @close="show = false">
            <view class="model" @touchmove.stop.prevent>
                <view class="f-top dir-left-nowrap main-between cross-center">
                    <view class="f-title dir-left-nowrap cross-center u-line-1">
                        <view class="p-title">{{title}}</view>
                    </view>
                    <view class="f-image" @click="show = false">
                        <image class="f-img" src="/static/image/icon/icon-close.png"></image>
                    </view>
                </view>
                <scroll-view scroll-y class="f-scroll">
                    <view class="f-scroll-content">
                        <view class="coupon-content" v-if="showModal === 'coupon'">
                            <view class="coupon dir-left-nowrap cross-center" v-for="(item, index) in coupon.list" :key="index">
                                <view class="dis" v-if="item.type === 1">
                                    <text>{{item.discount}}</text>
                                    <text>折</text>
                                </view>
                                <view class="price" v-else-if="item.type === 2">
                                    <text>￥</text>
                                    <text>{{item.sub_price}}</text>
                                </view>
                                <view class="box-grow-1 dir-top-nowrap">
                                    <text class="name">{{item.name}}</text>
                                    <text class="limit">满{{item.min_price}}可用</text>
                                    <text class="number">赠送{{item.number}}张</text>
                                </view>
                            </view>
                        </view>
                        <view class="card-content" v-if="showModal === 'card'">
                            <view class="card dir-left-nowrap cross-center" v-for="(item, index) in card.list" :key="index">
                                <image :src="item.pic_url"></image>
                                <view class="box-grow-1 dir-top-nowrap">
                                    <text class="name">{{item.name}}</text>
                                    <text class="number">赠送{{item.number}}张</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </u-popup>
    </view>
</template>

<script>
import uPopup from '../../basic-component/u-popup/u-popup.vue';

export default {
    name: "bd-hc",
    components: {
        uPopup
    },
    props: {
        card: {
            type: Object,
            default() {
                return {};
            }
        },
        integral: {
            type: Object,
            default() {
                return {};
            }
        },
        balance: {
            type: Object,
            default() {
                return {};
            }
        },
        coupon: {
            type: Object,
            default() {
                return {};
            }
        },
        theme: {
            type: Object,
            default() {
                return {};
            }
        },
    },
    data() {
        return {
            show: false,
            showModal: '',
            title: ''
        };
    },
    methods: {
        change(key, title) {
            this.showModal = key;
            this.title = title;
            this.show = true;
        }
    }
}
</script>

<style scoped lang="scss">
    .bd-hc {
        width: 702upx;
        border-radius: 15upx;
        padding: 20upx 20upx 0 20upx;
        background-color: #ffffff;
        overflow: hidden;
        margin: 24upx 24upx 24upx 24upx;
    }
    .bd-block {
        font-size: 26upx;
        color: #999999;
        margin-bottom: 20upx;
        .content {
            color: #353535;
        }
    }
    .bd-give {
        padding: 2upx 4upx;
        border: 1upx solid;
        border-radius: 4upx;
        font-size: 22upx;
        margin-right: 12upx;
    }
    .bd-block view:first-child {
        margin-right: 26upx;
        width: 60upx;
    }
    .bd-icon {
        width: 12upx;
        height: 22upx;
    }
    .card-content {
        width: 100%;
        .card {
            width: 100%;
            height: #{160rpx};
            background-image: url('../../../static/image/icon/goods-card.png');
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            padding: 0 #{32rpx} 0 #{36rpx};
            margin-bottom: #{20rpx};
            image {
                width: #{88rpx};
                height: #{88rpx};
                display: block;
                margin-right: #{68rpx};
                border-radius: #{88rpx};
            }
            .name {
                width: 478#{rpx};
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                font-size: 28#{rpx};
                color: #353535;
            }
            .number {
                font-size:24#{rpx};
                color: #999999;
                margin-top:10#{rpx};
            }
        }
    }
    .coupon-content {
        width: 100%;
        .coupon {
            width: 100%;
            height: #{160rpx};
            background-image: url('../../../static/image/icon/goods-card.png');
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            margin-bottom: #{20rpx};
            .dis {
                >text:first-child {
                    font-weight: bold;
                    font-size: 36upx;
                }
                >text:last-child {
                    font-size: 22upx;
                    font-weight: bold;
                }
            }
            .price {
                >text:first-child {
                    font-size: 18upx;
                    font-weight: bold;
                }
                >text:last-child {
                    font-size: 36upx;
                    font-weight: bold;
                }
            }
            view:first-child {
                width: 160upx;
                text-align: center;
            }
            view:last-child {
                padding-left: 32upx;
            }
            image {
                width: #{88rpx};
                height: #{88rpx};
                display: block;
                margin-right: #{68rpx};
                border-radius: #{88rpx};
            }
            .name {
                width: 478#{rpx};
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                font-size: 28#{rpx};
                color: #353535;
            }
            .limit {
                font-size: 19upx;
                color: #353535;
            }
            .number {
                font-size:24#{rpx};
                color: #999999;
                margin-top:10#{rpx};
            }
        }
    }
    .model {
        height: 80vh;
        width: 750upx;
    }
    .f-top {
        height: 105upx;
        background-color: #ffffff;
        position: relative;
        border-radius: 15rpx;
    }
    .f-image {
        width: 78upx;
        height: 78upx;
        padding: 24upx;
        position: absolute;
        right: 0;
    }
    .f-img {
        width: 30upx;
        height: 30upx;
    }
    .f-title {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        max-width: 594upx;
    }
    .f-scroll {
        height: calc(80vh - 105upx);
        width: 100%;
    }
    .f-scroll-content {
        padding: 0 24upx;
    }
</style>