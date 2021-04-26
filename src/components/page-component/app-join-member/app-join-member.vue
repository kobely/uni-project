<template>
	<view class="app-goods-join-member">
		<app-jump-button url="/pages/member/index/index" open_type="navigate">
			<view class="member dir-left cross-center">
				<view class="box-grow-0">加入会员，享会员价</view>
				<view class="box-grow-1 price" :style="{'color': getTheme.color}">
					<app-price
						type="text-price-all"
					   	:max="memberMaxPrice"
					   	:min="memberMinPrice"
					   	:default-price="price"
					></app-price>
				</view>
				<view class="dir-left cross-center box-grow-0">
					<view>了解更多</view>
					<image src="/static/image/icon/arrow-right.png" class="right"></image>
				</view>
			</view>
		</app-jump-button>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex';
    import appPrice from "../../page-component/goods/app-price.vue";

    export default {
        name: "app-goods-join-member",
        components: {
            'app-price': appPrice,
        },
        props: {
            memberMaxPrice: String,
            memberMinPrice: String,
            price: String,
        },
		computed: {
			...mapGetters('mallConfig', {
				getTheme: 'getTheme',
			}),
		},
    }
</script>

<style scoped lang="scss">
	.member {
		background-color: #faf2d8;
		width: 100%;
		height: #{80rpx};
		padding: 0 #{24rpx};
		font-size: $uni-font-size-weak-one;
		margin: #{24rpx} 0;
		border-radius: #{16rpx};
		.right {
			width: #{12rpx};
			height: #{22rpx};
			margin-left: #{16rpx};
		}

		.price {
			font-size: $uni-font-size-general-one;
		}
	}
</style>