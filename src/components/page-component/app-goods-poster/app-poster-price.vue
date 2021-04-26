<template>
    <view class="app-poster-price" :style="{color: textColor}">

        <view v-if="defaultPrice.indexOf(info.sign) !== -1 || info.sign === 'wholesale'">
            <view v-if="info.is_negotiable === 1">
                <view class="price">价格面议</view>
            </view>
            <view v-else class="price">
                <app-price :max="`${info.max_price}`" :min="`${info.min_price}`"></app-price>
            </view>
        </view>

        <view v-else-if="info.sign === 'pintuan'" class="cross-bottom dir-left-nowrap">
            <view class="plugin-label">{{info.people_num}}</view>
            <app-price class="price" :max="`${info.max_price}`" :min="`${info.min_price}`"></app-price>
        </view>

        <view v-else-if="info.sign === 'integral_mall'" class="cross-bottom dir-left-nowrap">
            <view class="plugin-label">{{info.integral_num}}积分+</view>
            <app-price class="price" :max="`${info.max_price}`" :min="`${info.min_price}`"></app-price>
        </view>

        <view v-else-if="info.sign === 'lottery'" class="cross-bottom dir-left-nowrap lottery">
            <img :src="info.iconFreeUrl" alt="">
            <view :class="{'white':whiteColor}">￥{{info.price}}</view>
        </view>

        <view v-else-if="info.sign === 'step'" class="cross-bottom dir-left-nowrap">
            <view class="plugin-label">{{info.currency}}{{info.unit}}+</view>
            <app-price class="price" :price="`${info.price}`"></app-price>
        </view>

            <view v-else-if="info.sign === 'bargain'" class="cross-bottom dir-left-nowrap">
            <view class="plugin-label" style="line-height: 1">最低￥</view>
            <view class="price">{{info.bargain_min_price}}</view>
        </view>

        <view v-else-if="info.sign === 'flash_sale'" class="cross-bottom dir-left-nowrap flash_sale">
            <view class="plugin-label">抢购价￥</view>
            <view class="price">{{info.min_price}}</view>
        </view>

        <view v-else class="cross-bottom dir-left-nowrap">
            <app-price :max="`${info.max_price}`" :min="`${info.min_price}`"></app-price>
        </view>

    </view>
</template>

<script>
    import appPrice from '../goods/app-price.vue';

    export default {
        components: {
            appPrice
        },
        props: {
            whiteColor: {
                type: Boolean,
                required: false,
            },
            info: {
                type: Object,
                required: true,
            },
            textColor: {
                type: String,
                default: '#FF4544',
                required: false,
            }
        },
        data() {
            return {
                defaultPrice: ['booking', '', 'miaosha', 'mch', 'pick']
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-poster-price {
        color: #FF4544;

        .white {
            color: #d9d9d9 !important;
        }

        .price {
            font-size: #{56rpx};
            line-height: 1;
        }

        .plugin-label {
            font-size: #{30rpx};
            padding-right: #{5rpx};
        }

        .flash_sale .price {
            font-size: 40rpx;
            font-weight: bold;
        }
        .lottery {
            margin-bottom: #{-10rpx};

            img {
                width: #{120rpx};
                height: #{60rpx};
                display: block;
            }

            view {
                margin-left: #{10rpx};
                color: #353535;
                text-decoration: line-through;
                text-align: center;
            }
        }
    }
</style>