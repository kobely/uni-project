<template>
	<view class="app-goods-time">
		<view class="app-image" :style="{'background-color': theme.background}"></view>
		<view class="app-content dir-top-nowrap">
			<view class="app-text" v-if="miaosha_status === 1">距离结束仅剩</view>
			<view class="app-text" v-if="miaosha_status === 2">距离开始仅剩</view>
			<view class="app-text over-text" v-if="miaosha_status === 0">活动已结束</view>
			<view class="app-time cross-center main-around" v-if="miaosha_status !== 0">
				<text class="app-num app-right" v-if="day > 0">{{day}}</text>
				<text v-if="day > 0">天</text>
				<text class="app-num app-right">{{hour}}</text>
				<text>:</text>
				<text class="app-num app-right">{{minute}}</text>
				<text>:</text>
				<text class="app-num app-right">{{second}}</text>
			</view>
		</view>
	</view>
</template>

<script>
    export default {
        name: 'app-goods-time',
	    props: {
            miaosha_status: {
                type: Number,
            },
            hour: {
                type: Number,
                default() {
                    return 0;
                }
            },
            minute: {
                type: Number,
                default() {
                    return 0;
                }
            },
            second: {
                type: Number,
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
			background-image: url('../image/miaosha-bg.png');
			background-repeat: no-repeat;
			background-size: 100% 100%;
		}
		.app-content {
			position: absolute;
			right: #{20rpx};
			top: 0;
			height: #{88rpx};
			width: #{230rpx};
			.app-text {
				font-size: #{22rpx};
				color: #ffffff;
				text-align: center;
				margin-top: #{6rpx};
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