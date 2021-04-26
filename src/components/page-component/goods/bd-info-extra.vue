<template>
	<view class="bd-info-extra dir-left-nowrap">
		<view v-if="minNumber > 1" class="bd-limit-buy dir-left-nowrap cross-center" :style="{'background': theme.background_o,'color': theme.color}">
			<view class="bd-limit-buy-img box-grow-1">
				<image :style="{'background': theme.background}" :src="goodsInfo.min_number"></image>
			</view>
			<view class="bd-limit-buy-text box-grow-0">{{minNumber}}{{unit}}起售</view>
		</view>
		<view v-if="limitBuy.status == 1" class="bd-limit-buy dir-left-nowrap cross-center" :style="{'background': theme.background_o,'color': theme.color}">
			<view class="bd-limit-buy-img box-grow-1">
				<image :style="{'background': theme.background}" :src="goodsInfo.limit_buy"></image>
			</view>
			<view class="bd-limit-buy-text box-grow-0">{{limitBuy.msg}}</view>
		</view>
	</view>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "bd-info-extra",
	props: {
		theme: Object,
		minNumber: Number,
		limitBuy: Object,
		goods: Object,
		unit: String
	},
	computed: {
		...mapState({
			goodsInfo: state => state.mallConfig.__wxapp_img.goods
		})
	},
}
</script>

<style lang="scss" scoped>
.bd-limit-buy {
	font-size: $uni-font-size-weak-one;
	margin-left: 12upx;
	margin-top: 20upx;
	padding: 12upx 20upx;
	border-radius: 5upx;
	&:first-child {
		margin-left: 0;
	}
	.bd-limit-buy-img {
		width: 28upx;
		height: 28upx;
		margin-right: 10upx;
		image {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
