<template>
	<view class="app-goods-time">
		<view class="app-image" :style="{'background-color': theme.background}"></view>
		<view class="app-goods-info">
			<text>￥</text>
			<text class="app-goods-price">{{goods.price}}</text>
			<text v-if="status !== 0 && goods.is_sales == 1" class="app-goods-sales">已抢{{goods.sales}}{{goods.unit}}，剩{{goods.goods_stock}}{{goods.unit}}</text>
		</view>
		<view class="app-content dir-top-nowrap">
			<view class="app-text" v-if="status === 1">距离结束仅剩</view>
			<view class="app-text" v-if="status === 0">距离开始仅剩</view>
			<view class="app-text over-text" v-if="status === 2">活动已结束</view>
			<view class="app-time cross-center main-around" v-if="status !== 2">
				<text class="app-num app-right" v-if="day > 0">{{day}}</text>
				<text v-if="day > 0">天</text>
				<text class="app-num app-right">{{hour}}</text>
				<text>时</text>
				<text class="app-num app-right">{{minute}}</text>
				<text>分</text>
				<text class="app-num app-right">{{second}}</text>
				<text>秒</text>
			</view>
		</view>
	</view>
</template>

<script>
    export default {
        name: 'app-goods-time',
	    props: {
            status: {
                type: Number,
            },
            goods: {
            	type: Object
            },
            hour: {
                type: String,
                default() {
                    return 0;
                }
            },
            minute: {
                type: String,
                default() {
                    return 0;
                }
            },
            second: {
                type: String,
                default() {
                    return 0;
                }
            },
            day: {
                type: Number,
                default() {
                    return 0;
                }
            },
			theme: Object
        },
    }
</script>

<style scoped lang="scss">
	.app-goods-time {
		width: #{750rpx};
		height: #{88rpx};
		position: relative;
		.app-image {
			width: #{750rpx};
			height: #{88rpx};
			background-repeat: no-repeat;
			background-size: 100% 100%;
		}
		.app-goods-info {
			position: absolute;
			left: #{24rpx};
			bottom: #{12rpx};
			color: #fff;
			font-size: #{32rpx};
			.app-goods-price {
				font-family: DIN;
				font-size: #{56rpx};
			}
			.app-goods-sales {
				margin-left: #{16rpx};
				font-size: #{20rpx};
			}
		}
		.app-content {
			position: absolute;
			right: #{20rpx};
			top: 0;
			height: #{88rpx};
			width: #{300rpx};
			.app-text {
				font-size: #{22rpx};
				color: #ffffff;
				text-align: center;
				margin-top: #{2rpx};
			}
			.over-text {
				font-size: #{32rpx};
				line-height: #{88rpx};
				margin-top: 0;
			}
			.app-time {
				color: white;
				height: #{40rpx};
				font-size: #{26rpx};
				margin-top: #{6rpx};
				.app-num {
					display: inline-block;
					width: #{44rpx};
					height: #{40rpx};
					line-height: #{40rpx};
					background-color:white;
					border-radius: #{8rpx};
					color: #353535;
					text-align: center;
				}
				.app-right {
					margin: 0 #{4rpx};
				}
			}
		}
	}
</style>