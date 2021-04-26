<template>
    <view class="app-composition dir-left-nowrap">
        <view @click.stop="open">
            <view class="app-composition-goods" :class="item.goods_list.length == 2 ? 'two' : item.goods_list.length == 3 ? 'three' : item.goods_list.length == 4 ? 'four': 'five'" v-if="item.type == 1">
                <image mode="aspectFill" :src="goods.cover_pic" v-for="goods in item.goods_list" :key="goods.id"></image>
            </view>
            <view class="app-composition-goods" :class="item.goods_list.length == 1 ? 'two' : item.goods_list.length == 2 ? 'three' : item.goods_list.length == 3 ? 'four': 'five'" v-if="item.type == 2">
                <image mode="aspectFill" :src="goods.cover_pic" v-for="goods in item.host_list" :key="goods.id"></image>
                <image mode="aspectFill" :src="goods.cover_pic" v-for="goods in item.goods_list" :key="goods.id"></image>
            </view>
            <slot></slot>
        </view>
        <view @click.stop="toDetail" class="app-composition-right">
            <view class="dir-left-nowrap cross-center app-composition-info">
                <view class="app-composition-type" v-if="item.type == 1 && !large" :style="{'color':theme.color}">固定</view>
                <view class="app-composition-type" v-if="item.type == 2 && !large" :style="{'color':theme.color}">搭配</view>
                <view class="app-composition-name t-omit" :class="large ? 'long-name' :  ''">{{item.name}}</view>
            </view>
            <view class="app-composition-type" v-if="item.type == 1 && large" :style="{'color':theme.color}">固定套餐</view>
            <view class="app-composition-type" v-if="item.type == 2 && large" :style="{'color':theme.color}">搭配套餐</view>
            <view class="app-composition-price">
                套餐价<text :style="{'color':theme.color}">￥{{item.min_composition_price}}</text>
            </view>
            <view class="app-composition-discount">
                最多可省<text>￥{{item.max_discount}}</text>
            </view>
        </view>
    </view>
</template>

<script>

	import {mapState} from 'vuex';
	
    export default {
        name: "app-composition",
	    props: {
            item: {
                type: Object
            },
            large: Boolean,
            theme: Object
	    },
        data() {
            return {
            }
        },
        created() {
            let that = this;
        },
        methods: {
            open(e) {
                this.$emit('click', e);
            },
            toDetail(e) {
                this.$emit('look', e);
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-composition {
        .app-composition-goods {
            width: #{288rpx};
            height: #{140rpx};
            flex-shrink: 0;
            margin-right: #{24rpx};
            position: relative;
            &.two {
                image {
                    position: absolute;
                    width: #{140rpx};
                    height: #{140rpx};
                    border-radius: #{8rpx};
                    top: 0;
                }
                image:first-of-type {
                    left: 0;
                }
                image:last-of-type {
                    right: 0;
                }
            }
            &.three {
                image {
                    position: absolute;
                    width: #{140rpx};
                    height: #{66rpx};
                    border-radius: #{8rpx};
                }
                image:first-of-type {
                    left: 0;
                    top: 0;
                    height: #{140rpx};
                    width: #{140rpx};
                }
                image:nth-child(2) {
                    top: 0;
                    right: 0;
                }
                image:last-of-type {
                    bottom: 0;
                    right: 0;
                }
            }
            &.four {
                image {
                    position: absolute;
                    width: #{66rpx};
                    height: #{66rpx};
                    border-radius: #{8rpx};
                }
                image:first-of-type {
                    left: 0;
                    top: 0;
                    height: #{140rpx};
                    width: #{140rpx};
                }
                image:nth-child(2) {
                    top: 0;
                    right: 0;
                    width: #{140rpx};
                }
                image:nth-child(3) {
                    right: #{74rpx};
                    bottom: 0;
                }
                image:last-of-type {
                    right: 0;
                    bottom: 0;
                }
            }
            &.five {
                image {
                    position: absolute;
                    width: #{66rpx};
                    height: #{66rpx};
                    border-radius: #{8rpx};
                }
                image:first-of-type {
                    left: 0;
                    top: 0;
                    height: #{140rpx};
                    width: #{140rpx};
                }
                image:nth-child(2) {
                    top: 0;
                    right: #{74rpx};
                }
                image:nth-child(3) {
                    right: 0;
                    top: 0;
                }
                image:nth-child(4) {
                    right: #{74rpx};
                    bottom: 0;
                }
                image:last-of-type {
                    right: 0;
                    bottom: 0;
                }
            }
        }
        .app-composition-right {
            width: #{342rpx};
        }
        .app-composition-info {
            height: #{44rpx};
            width: #{342rpx};
            .app-composition-type {
                font-size: #{22rpx};
                display: block;
                margin: 0 #{16rpx} 0 0;
            }
            .app-composition-name {
                height: #{44rpx};
                line-height: #{44rpx};
                width: #{260rpx};
                font-size: #{28rpx};
                color: #353535;
                &.long-name {
                    width: #{342rpx};
                }
            }
        }
        .app-composition-type {
            padding: #{2rpx 12rpx};
            flex-shrink: 0;
            border: #{2rpx} solid;
            border-radius: #{20rpx};
            margin: #{14rpx} 0 0;
            font-size: #{22rpx};
            display: inline-block;
        }
        .app-composition-price {
            color: #999999;
            font-size: #{24rpx};
            margin: #{14rpx} 0 #{10rpx};
            text {
                font-size: #{28rpx};
            }
        }
        .app-composition-discount {
            color: #999999;
            font-size: #{24rpx};

        }
    }
</style>