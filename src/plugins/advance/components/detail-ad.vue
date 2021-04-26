<template>
	<view class="detail-ad dir-left-nowrap main-between" :style="{'background-color': theme.background}">
		<view class="text dir-left-nowrap main-between cross-center">
			<text class="title">预售</text>
			<text class="count">已抢{{sales}}件</text>
		</view>
		<view class="count-down dir-top-nowrap" style="margin-bottom: 12rpx;">
			<text class="advance-title">距定金截止</text>
			<view class="dir-left-nowrap main-center cross-center">
				<view class="num">{{d}}</view>
				<view class="word">天</view>
				<view class="num">{{h}}</view>
				<view class="word">时</view>
				<view class="num">{{m}}</view>
				<view class="word">分</view>
				<view class="num">{{s}}</view>
				<view class="word">秒</view>
			</view>
		</view>
	</view>
</template>

<script>
    export default {
        name: "detail-ad",
	    props: {
            sales: {
                type: Number,
	            default() {
                    return 0;
                }
            },
            d: {
                type: Number,
	            default() {
                    return 0;
                }
            },
            h: {
                type: Number,
	            default() {
                    return 0;
	            }
            },
            m: {
                type: Number,
                default() {
                    return 0;
                }
            },
            s: {
                type: Number,
                default() {
                    return 0;
                }
            },
			theme: Object
	    }
    }
</script>

<style scoped lang="scss">
	.default {
		background:linear-gradient(to right, #ff5527, #ff2755);
	}
	.detail-ad {
		width: #{750rpx};
		height: #{88rpx};
		padding: 0 #{24rpx};
		.text {
			color: #ffffff;
			.title {
				display: inline-block;
				font-size: #{32rpx};
				margin-right: #{12rpx};
				height: #{88upx};
				line-height: #{88upx};
			}
			.count {
				display: inline-block;
				padding: #{5upx 16rpx};
				border-radius: #{18rpx};
				background-color: rgba(0,0,0,.2);
				font-size: #{22rpx};
			}
		}
		.count-down {
			height: #{88rpx};
			text-align: center;
			.advance-title {
				font-size: #{20rpx};
				color: #ffffff;
				margin-top: #{5rpx};
				margin-bottom: #{5rpx};
			}
			.num {
				width:#{40rpx};
				height: #{36rpx};
				line-height: #{36rpx};
				text-align: center;
				border-radius: #{4rpx};
				font-size: #{24rpx};
				color: #353535;
				background-color: #ffffff;
			}
			.word {
				width: #{35rpx};
				height: #{36rpx};
				line-height: #{36rpx};
				text-align: center;
				font-size: #{24rpx};
				color: #ffffff;
			}
		}
	}
</style>