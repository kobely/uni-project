<template>
	<view class="app-reservation-form dir-left-wrap">
		<view>
			<app-jump-button form open_type="navigate" :url="`/plugins/book/orderDetails/orderDetails?id=${item.id}`">
				<image class="app-image" :src="item.detail[0].goods_info.pic_url"></image>
				<text class="app-status-text" v-if="item.cancel_status == 2">退款中</text>
				<text class="app-status-text" v-else-if="item.cancel_status == 1 && item.is_pay == 0">已取消</text>
				<text class="app-status-text" v-else-if="item.cancel_status == 1">已退款</text>
				<text class="app-status-text" v-else-if="item.is_pay == 0">待付款</text>
				<text class="app-status-text" v-else-if="item.is_confirm == 0">待使用</text>
				<text class="app-status-text" v-else-if="item.is_confirm == 1">已使用</text>
				<view class="app-title-price">
					<view class="app-title">
						{{item.detail[0].goods_info.name}}
					</view>
					<view class="app-price dir-left-wrap main-right cross-center">
						<view class="app-attr">
							<text v-for="(attr, i) in item.detail[0].goods_info.attr_list" :key="i">{{attr.attr_group_name}}: {{attr.attr_name}}</text>
						</view>
						<text class="app-old-price">{{item.total_goods_original_price}}</text>
						<text  class="app-new-price">{{item.total_pay_price}}</text>
					</view>
				</view>
			</app-jump-button>
		</view>
		<view class="app-buttons dir-left-nowrap main-right" v-if="item.cancel_status == 0 && item.is_sale == 0">
			<view class="app-button" v-if="item.cancel_status != 2 && item.is_pay == 1 && item.is_confirm == 0" @click="refund('refund')">
				<app-form-id>
					<view class="button app-button-white">申请退款</view>
				</app-form-id>
			</view>
			<view class="app-button" v-if="item.cancel_status != 2 && item.is_pay == 1 && item.is_confirm == 0" @click="refund('use')">
				<app-form-id>
					<view class="button app-button-red">立即使用</view>
				</app-form-id>
			</view>
			<view class="app-button" v-if="item.is_sale == 0 && item.is_confirm == 1" @click="evaluation">
				<app-form-id>
					<view class="button app-button-red">去评价</view>
				</app-form-id>
			</view>
			<view class="app-button" v-if="item.is_pay == 0" @click="refund('cancel')">
				<app-form-id>
					<view class="button app-button-white">申请取消</view>
				</app-form-id>
			</view>
			<view class="app-button" v-if="item.is_pay == 0" @click="refund('pay')">
				<app-form-id>
					<view class="button app-button-red">去支付</view>
				</app-form-id>
			</view>
		</view>
	</view>
</template>

<script>
    export default {
        name: 'app-reservation-form',
        props: {
            item: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        methods: {
            refund(data) {
                this.$emit('click', data, this.item);
            },
            evaluation() {
                this.$jump({
                    open_type: 'navigate',
                    url: `pages/order/appraise/appraise?id=${this.item.id}`
                })
            }
        }
    }
</script>

<style scoped lang="scss">
	.app-reservation-form {
		width: 100%;
		margin-top: #{20rpx};
		position: relative;
		background-color:white;
		.app-image {
			width: #{208rpx};
			height: #{160rpx};
			border-radius: #{8rpx};
			margin: #{24rpx} #{24rpx} #{24rpx} #{24rpx};
		}
		.app-status-text {
			display: inline-block;
			width: #{100rpx};
			height: #{48rpx};
			line-height: #{48rpx};
			font-size: #{26rpx};
			color: #FFFFFF;
			background-color: #ff4544;
			border-top-left-radius: #{8rpx};
			text-align: center;
			position: absolute;
			top: #{24rpx};
			left: #{24rpx};
		}
		.app-title-price {
			width: #{470rpx};
			height: #{24+160+24rpx};
			margin-right: #{24rpx};
			.app-title {
				margin-top: #{32rpx};
				height: #{64rpx};
				width: #{470rpx};
				font-size: #{28rpx};
				line-height: #{32rpx};
				color: #353535;
				word-break: break-all;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
			.app-attr {
				width: #{470rpx};
				margin-top: #{6rpx};
				font-size: 12px;
				color: #c9c9c9;
			}
			.app-price>text {
				margin-top: #{32rpx};
				margin-bottom: #{32rpx};
			}
			.app-price>text:before {
				content: '￥';
			}
			.app-old-price {
				text-decoration:line-through;
				font-size: #{26rpx};
				color: #999999;
				margin-right: #{24rpx};
			}
			.app-new-price {
				font-size: #{32rpx};
				color: #ff4544;
			}
		}
		.app-buttons {
			height: #{100rpx};
			width: 100%;
			border-top: #{1rpx} solid #e2e2e2;
			padding-right: #{8rpx};
			.app-button {
				width: #{180rpx};
				height: #{60rpx};
				margin-right: #{16rpx};
				padding-top: #{20rpx};
				.button {
					width: 100%;
					height: #{60rpx};
					line-height: #{60rpx};
					border-radius: #{30rpx};
					padding: 0;
					font-size: #{32rpx};
					border-width: #{1rpx};
					border-style: solid;
					text-align: center;
					border-color: transparent;
				}
				.app-button-white {
					background-color: white;
					border-color: #cdcdcd;
					color: #666666;
				}
				.app-button-red {
					background-color: #fff5f5;
					color: #ff4544;
					border-color: #ff4544;
				}
			}
		}
	}
</style>