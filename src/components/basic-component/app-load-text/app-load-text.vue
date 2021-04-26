<template>
	<view class="app-load-text">
		<icon class="app-load image-no-rep image-cover" type></icon>
	</view>
</template>

<script>
    export default {
        name: 'app-load-data'
    }
</script>

<style scoped lang="scss">
	.app-load-text {
		width: #{750rpx};
		text-align: center;
		height: #{42rpx};
	}
	.app-load {
		width: #{70rpx};
		height: #{42rpx};
		background-image: url("./image/load.gif");
	}
</style>