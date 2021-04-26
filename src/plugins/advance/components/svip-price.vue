<template>
	<view class="vip-price dir-left-nowrap">
		<view class="item left">
			<image class="vip-icon" src="../image/S-VIP.png"></image>
		</view>
		<view class="item right">9.5折</view>
	</view>
</template>

<script>
    export default {
        name: "vip-price"
    }
</script>

<style scoped lang="scss">
	.vip-price {
		width: #{148upx};
		height: #{27upx};
		.item {
			height: #{27upx};
			width: 50%;
		}
		.left {
			border-top-left-radius: #{13upx};
			border-bottom-left-radius: #{13upx};
			background-color: #4e4040;
			position: relative;
		}
		.right {
			border-top-right-radius: #{13upx};
			border-bottom-right-radius: #{13upx};
			background: linear-gradient(45deg, #edc9a8, #fdebde);
			font-size: #{18upx};
			line-height: #{27upx};
			text-align: center;
			color: #4e4040;
		}
		.vip-icon {
			width: #{51upx};
			height: #{14upx};
			position:absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>