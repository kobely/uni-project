<template>
	<view class="app-pt-time dir-left-nowrap" :class="theme.key == 'a' ? 'default-back' : ''" :style="{'background-color': theme.key != 'a' ? theme.background : ''}">
		<image class="app-image" src="./../image/pt-icon.png"></image>
		<view class="app-title">限时火拼·超值低价</view>
		<view class="app-time-content" >
			<view class="app-name" v-if="!start_time">距离活动开始还有</view>
			<view class="app-name" v-else-if="end_time !== '0000-00-00 00:00:00'">距离结束仅剩</view>
			<view class="app-time-info dir-left-nowrap cross-center" v-if="end_time !== '0000-00-00 00:00:00' || !start_time">
				<text class="app-value">{{time_str.day}}</text>
				<text class="app-degree">天</text>
				<text class="app-value">{{time_str.hou}}</text>
				<text class="app-degree">时</text>
				<text class="app-value">{{time_str.min}}</text>
				<text class="app-degree">分</text>
				<text class="app-value">{{time_str.sec}}</text>
				<text class="app-degree">秒</text>
			</view>
		</view>
	</view>
</template>

<script>
    export default {
        name: 'app-pt-time',
	    props: {
			theme: Object,
			end_time: {
				type: String,
				default() {
					return '00';
				}
			},
			start_time: {
            	type: Boolean,
				default() {
            		return true;
				}
			},

			time_str: {
            	type: Object,
				default() {
            		return {}
				}
			}
	    }
    }
</script>

<style scoped lang="scss">
	.default-back {
		background: linear-gradient(140deg, #ff5427, #ff3d3f,#ff2e4e, #ff2754);
	}
	.app-pt-time {
		height: #{88rpx};
		width: #{750rpx};

		.app-image {
			width: #{148rpx};
			height: #{88rpx};
		}
		.app-title {
			width: #{281rpx};
			color: white;
			margin-top: #{46rpx};
			font-size: #{22rpx};
		}
		.app-time-content {
			width: #{322rpx};
			height: #{88rpx};
			.app-name {
				width: #{322rpx};
				height: #{30rpx};
				font-size: #{20rpx};
				color: white;
				margin: #{5rpx} 0;
				text-align: center;
			}
			.app-time-info {
				height: #{48rpx};
				width: #{322rpx};
				text-align: center;
				.app-degree {
					font-size: #{23rpx};
					color: #ffffff;
					margin: 0 #{6rpx};
				}
				.app-value {
					display: inline-block;
					min-width: #{40rpx};
					height: #{36rpx};
					line-height: #{36rpx};
					border-radius: #{4rpx};
					background-color: white;
					text-align: center;
					font-size: #{19rpx};
				}
			}
		}
	}
</style>