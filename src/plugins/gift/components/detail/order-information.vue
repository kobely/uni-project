<template>
	<view class="order-information page-width">
		<view class="page-width information">
			<view class="top">
				<view class="item">
					<text class="gray">订单号：</text>
					<text class="black">{{order_no}}</text>
				</view>
				<view class="item">
					<text class="gray">付款时间：</text>
					<text class="black">{{pay_time}}</text>
				</view>
			</view>
			<view class="bottom">
				<view class="item">
					<text class="gray">礼物玩法：</text>
					<text class="black">{{type === 'direct_open'? '直接领取' : type === 'time_open' ? '定时开奖' : '满人开奖'}}</text>
				</view>
				<view class="item" v-if="type === 'time_open'">
					<text class="gray">开奖时间：</text>
					<text class="black">{{open_time}}</text>
				</view>
				<view class="item" v-else-if="type === 'num_open'">
					<text class="gray">开奖人数：</text>
					<text class="black">满{{open_num}}人</text>
				</view>
				<view class="item">
					<text class="gray">礼物状态：</text>
					<text class="black">{{status}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
    export default {
        name: 'order-information',

        props: [`status`, `order_no`, `type`, `pay_time`, `open_time`, `open_num`],
    }
</script>

<style scoped lang="scss">
	@import '../../css/gift.scss';
	
	/*订单信息*/
	.order-information {
		margin-top: #{24upx};
		padding: #{0 24upx};
		/*信息*/
		.information {
			background-color: #ffffff;
			border-radius: #{16upx};
			padding: #{28upx 24upx 12upx 24upx};
			/*订单号 下单时间*/
			.top {
				border-bottom: #{1upx} solid #e2e2e2;
			}
			/*订单状态*/
			.bottom {
				margin-top: #{16upx};
			}
			.item {
				font-size: #{24upx};
				line-height: 1;
				margin-bottom: #{16upx};
			}
		}
	}
</style>