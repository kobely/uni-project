<template>
	<view class="app-merchant-guarantee dir-left-wrap">
		<view class="app-item dir-left-nowrap cross-center main-center" v-for="(item, index) in services" :key="index">
			<image class="app-image" src="../../../static/image/icon/yes.png"></image>
			<text class="app-title">{{item}}</text>
		</view>
	</view>
</template>

<script>
    export default {
        name: 'app-merchant-guarantee',
	    props: {
            services: {
                type: Array,
	            default() {
                    return [];
	            }
            }
	    }
    }
</script>

<style scoped lang="scss">
	.app-merchant-guarantee {
		min-height: #{56rpx};
		width: #{750rpx};
		background-color: white;
		.app-item {
			display: inline-block;
			margin: #{10rpx} #{26rpx};
			.app-image {
				width: #{24rpx};
				height: #{24rpx};
				margin: #{0} #{6rpx} 0 0;
			}
			.app-title {
				font-size: #{21rpx};
				color: #737373;
			}
		}
	}
</style>