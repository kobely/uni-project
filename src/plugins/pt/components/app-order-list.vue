<template>
	<view class="app-order-list">
		<view class="app-item" v-for="(item, index) in list" :key="index">
			<view class="app-top app-border main-between dir-left-nowrap cross-center">
				<text :style="{'color': theme.color}">
					{{item.status_cn}}
				</text>
				<view class="app-order-time" v-if="item.status === 1">
					<text style="margin-right: 20rpx;">剩</text>
					<block>
						<app-order-time :time="item.end_date_time"></app-order-time>
					</block>
				</view>
			</view>
			<view class="app-center app-border dir-top-nowrap">
				<view class="app-center-top dir-left-nowrap">
					<image class="app-image" lazy-load :src="item.detail[0].goods_info.cover_pic"></image>
					<view class="app-content dir-top-nowrap">
						<text class="app-name">{{item.detail[0].goods_info.name}}</text>
						<view class="app-attr">
							<text v-for="(attr, i) in item.detail[0].goods_info.attr_list" :key="i">{{attr.attr_group_name}}:{{attr.attr_name}}</text>
						</view>
						<view class="app-price-num dir-left-nowrap main-between">
							<text class="app-num">{{item.detail[0].num}}</text>
							<text class="app-price">{{item.detail[0].total_price}}</text>
						</view>
					</view>
				</view>
				<view class="app-center-bottom dir-left-nowrap main-right">
					<text class="app-t">合计：</text>
					<text class="app-n" :style="{'color': theme.color}">{{item.total_pay_price}}</text>
				</view>
			</view>
			<view class="app-bottom main-right cross-center">
				<view class="app-button app-white-button" v-if="item.status === 2">
					<app-jump-button form :url="`/pages/order/order-detail/order-detail?id=${item.id}`">
						订单详情
					</app-jump-button>
				</view>
				<view class="app-button app-red-button" :style="{'background-color': theme.background}" v-if="item.is_pay === 0 && item.pay_type !== 2 && (item.status === 0 || item.status === 1)">
					<app-form-id from @click="goPay(item.id, item.id)">
						去支付
					</app-form-id>
				</view>
				<view class="app-button app-red-button" :style="{'background-color': theme.background}" v-else>
					<app-jump-button from :url="`/plugins/pt/detail/detail?pintuan_order_id=${item.pintuan_order_id}&id=${item.pintuan_order_id}`">
						拼团详情
					</app-jump-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import appOrderTime from '../components/app-order-time.vue';
	
    export default {
        name: 'app-order-list',
	    props: {
            list: {
                type: Array,
	            default() {
                    return [];
	            }
            },
			theme: Object
	    },
	    methods: {
            goPay(order_id, id) {
                let _this = this;
                uni.showModal({
                    title: '提示',
                    content: '订单支付',
                    cancelText: '取消',
                    confirmText: '确定',
	                success(res) {
                        if (res.confirm) {
                            _this.$request({
	                            url: _this.$api.order.list_pay_data,
	                            data: {
	                                id: order_id,
	                            }
                            }).then(response => {
                                if (response.code === 0) {
                                   _this.$payment.pay(response.data.id).then(() => {
                                       for (let i = 0; i < _this.list.length; i++) {
                                           if(_this.list[i].id === id){
                                               _this.$emit('click', i);
                                           }
                                       }
                                   }).catch(() => {
                                   })
                                }
                            })
                        }
	                }
                })
            }
	    },
	    components: {
            'app-order-time': appOrderTime,
	    }
    }
</script>

<style scoped lang="scss">
	.app-order-list {
		width: #{750rpx};
		.app-item {
			width: #{750rpx};
			height: #{471rpx};
			background-color: white;
			margin-top: #{20rpx};
			>view {
				width: #{750rpx};
				box-sizing: border-box;
				padding: 0 #{24rpx};
			}
			.app-top {
				height: #{80rpx};
				font-size: #{24rpx};
				.app-order-time {
					color: #919191;
				}
			}
			.app-center {
				height: #{304rpx};
				padding-top: #{32rpx};
				box-sizing: border-box;
				.app-center-top {
					.app-image {
						width: #{156rpx};
						height: #{156rpx};
						margin-right: #{24rpx};
					}
					.app-content {
						width: #{522rpx};
						height: #{156rpx};
						.app-name {
							width: #{522rpx};
							height: #{60rpx};
							line-height: #{30rpx};
							font-size: #{28rpx};
							color: #353535;
							word-break: break-all;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
						.app-attr {
							height: #{24rpx};
							font-size: #{24rpx};
							color: #999999;
							margin-bottom: #{20rpx};
							>text {
								margin-right: #{18rpx};
							}
						}
						.app-price-num {
							font-size: #{28rpx};
							color: #353535;
							.app-price:before {
								content: '￥';
							}
							.app-num:before {
								content: '×';
							}
						}
					}
				}
				.app-center-bottom {
					padding-top: #{64rpx};
					box-sizing: border-box;
					>text {
						font-size: #{28rpx};
					}
					.app-t {
						color: #353535;
					}
					.app-n:before {
						content: '￥';
					}
				}
			}
			.app-bottom {
				height: #{88rpx};
				.app-button {
					height: #{56rpx};
					line-height: #{56rpx};
					width: #{160rpx};
					font-size: #{24rpx};
					border-radius: #{28rpx};
					text-align: center;
				}
				.app-red-button {
					color: #ffffff;
				}
				.app-white-button {
					border: #{1rpx} solid #cdcdcd;
					color: #353535;
					margin-right: #{20rpx};
				}
			}
			.app-border {
				border-bottom: #{1rpx} solid #e2e2e2;
			}
		}
	}
</style>
