<template>
	<view class="app-prompt-box">
		<view class="app-content">
			<text class="app-title">提示</text>
			<view class="app-text">
				{{text}}
			</view>
			<view class="app-buttons dir-left-nowrap">
                <view class="app-button app-close" @click="close(false)">取消</view>
				<view class="app-line"></view>
                <view class="app-button app-sure" @click="close(true)">确认</view>
			</view>
		</view>
	</view>
</template>

<script>
    export default {
        name: 'app-prompt-box',
	    props: {
            text: {
                type: String,
            }
	    },
	    methods: {
            close(boolean) {
                this.$emit('click', boolean);
            }
	    }
    }
</script>

<style scoped lang="scss">
	.app-prompt-box {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(153, 153, 153, 0.3);
		z-index: 1500;
		.app-content {
			width: #{620rpx};
			border-radius: #{8rpx};
			background-color: white;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			text-align: center;
			
			.app-title {
				display: inline-block;
				font-size: #{32rpx};
				margin-top: #{40rpx};
				margin-bottom: #{64rpx};
				color: #353535;
				text-align: center;
			}
			.app-text {
				font-size: #{32rpx};
				color: #353535;
				text-align: center;
				margin-bottom: #{64rpx};
			}
			.app-buttons {
				border-top: #{1rpx} solid #e2e2e2;
				.app-button {
					font-size: #{32rpx};
					width: #{309.5rpx};
					height: #{88rpx};
					line-height: #{88rpx};
					text-align: center;
				}
				.app-sure {
					color: #ff4544;
				}
				.app-close {
					color: #666666;
				}
				.app-line {
					width: #{1rpx};
					height: #{32rpx};
					margin-top: #{30rpx};
					color: #e2e2e2;
				}
			}
		}
	}
</style>