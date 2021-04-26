<template>
	<view class="app-button">
		<app-form-id>
			<button class="button">预约</button>
		</app-form-id>
	</view>
</template>

<script>
    export default {
        name: "app-button"
    }
</script>

<style scoped lang="scss">
	.app-button {
		display: inline-block;
		height: #{48rpx};
		.button {
			width: 100%;
			display: inline-block;
			border: #{1rpx} solid #ff4544;
			height: #{48rpx};
			font-size: #{28rpx};
			color: #ff4544;
			padding: 0 #{28rpx};
			line-height: #{48rpx};
			border-radius: #{24rpx};
			background-color: #fff5f5;
		}
	}
</style>