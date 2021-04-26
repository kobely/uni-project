<template>
	<view class="app-coupon-center">
		<view class="app-coupon-item"
		      v-for="(item, index) in list"
		      :key="index"
		      @click="jump(item)"
		>
			<view class="app-top dir-left-nowrap main-between"  :class="{'app-unexpired': item.is_receive === '0', 'app-received': item.is_receive > '0'}">
				<view class="app-text dir-left-nowrap main-left">
					<view class="app-price">
						<text class="app-symbol">￥</text>
						<text class="app-number">{{item.sub_price}}</text>
					</view>
					<view class="app-amount dir-top-nowrap main-left">
						<text>优惠券</text>
						<text>满{{item.min_price}}使用</text>
					</view>
				</view>
				<view class="app-button">
					<app-button type="important"
					            height="56"
					            background="#ffffff"
					            round
					            :color="`${item.is_receive === '0' ? '#ff4544' : item.is_receive > '0' ? '#999999' : ''}`"
					            fontSize="28"
					            @click="use(item.id)"
					>{{item.is_receive === '0' ? '立即领取' : item.is_receive > '0' ? '已领取' : ''}}</app-button>
				</view>
			</view>
			<view class="app-bottom dir-top-nowrap main-between">
				<text class="app-time">
					有效时间: {{item.begin_time}} - {{item.end_time}}
				</text>
				<text class="app-range">
					适用范围: {{setRange(item.appoint_type)}}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	import jump from '../../../core/jump.js';
	
    export default {
        name: 'app-coupon-center',
	    props: {
            list: {
                type: Array,
	            default: function() {
	                return [
		                {
                            appoint_type: "",
                            begin_time: "",
                            cat: [],
                            couponGoods: [],
                            created_at: "",
                            deleted_at: "",
                            desc: "",
                            discount: "",
                            end_time: "",
                            expire_day: "",
                            expire_type: "",
                            goods: [],
                            id: "",
                            is_delete: "",
                            is_member: "",
                            is_receive: "",
                            mall_id: "",
                            min_price: "",
                            name: "",
                            pic_url: "",
                            rule: "",
                            sort: "",
                            sub_price: "",
                            total_count: "",
                            type: "",
                            updated_at: "",
		                }
	                ]
	            }
            }
	    },
	    methods: {
            setRange: function(appoint_type) {
                if (appoint_type === '1') {
                    return '限品类';
                } else if (appoint_type === '2') {
                    return '限商品';
                } else if (appoint_type === '3') {
                    return '全场通用';
                }
            },
            jump(item) {
                jump({
	                open_type: 'navigate',
	                url: `/pages/coupon/details/details?id=${item.id}`
                });
            },
            use() {
            }
	    }
    }
</script>

<style scoped lang="scss">
	.app-coupon-center {
		width: #{750rpx};
		overflow: hidden;
		.app-coupon-item {
			margin: #{20rpx} #{24rpx} #{0} #{24rpx};
			width: #{702rpx};
			height: #{160+112rpx};
			.app-top {
				width: #{702rpx};
				height: #{160rpx};
				background-size: 100% 100%;
				background-repeat: no-repeat;
				.app-button {
					width: #{160+24rpx};
					padding-right: #{24rpx};
					padding-top: #{48rpx};
					/deep/ button {
						padding: 0 #{10rpx} !important;
					}
				}
				.app-text {
					width: #{702-160-24rpx};
					height: #{160rpx};
					margin-left: #{24rpx};
					.app-price {
						padding-top: #{52rpx};
						color: #ffffff;
						.app-symbol {
							font-size: #{36rpx};
						}
						.app-number {
							font-size: #{72rpx};
						}
					}
					.app-amount {
						padding-top: #{50rpx};
						color: #ffffff;
						font-size: #{28rpx};
						margin-left: #{20rpx};
					}
				}
			}
			.app-unexpired {
				background-image: url("../../../static/image/icon/unexpired-coupon.png");
			}
			.app-received {
				background-image: url("../../../static/image/icon/received-coupon.png");
			}
			.app-bottom {
				width: #{702rpx};
				height: #{112rpx};
				border-left: #{1rpx} solid #cfcfcf;
				border-bottom: #{1rpx} solid #cfcfcf;
				border-right: #{1rpx} solid #cfcfcf;
				border-bottom-left-radius: #{16rpx};
				border-bottom-right-radius: #{16rpx};
				text {
					font-size: #{24rpx};
					color: #666666;
					margin-left: #{24rpx};
				}
				.app-time {
					margin-top: #{24rpx};
				}
				.app-range {
					margin-bottom: #{32rpx};
				}
			}
		}
	}
</style>