<template>
	<view class="app-store">
		<view class="app-text" :style="{'app-text-border': borderStyle}" v-if="title">门店信息</view>
		<view class="app-list" :class="{'app-list-border': storeNum > 1}">
			<app-jump-button form arrangement="a" open_type="navigate" :url="`/pages/store/detail?id=${store_id}`">
				<text class="app-store-name" >
					{{name}}
				</text>
				<text class="app-address">地址: {{address}}</text>
				<text class="app-time">营业时间: {{business_hours}}</text>
			</app-jump-button>
		</view>
		<view class="app-more" v-if="storeNum > 1">
			<app-jump-button open_type="navigate" :url="`/pages/store/store?book_id=${goods_id}`" arrangement="left" form>
				查看全部{{storeNum}}家分店
				<icon class="app-icon" v-if="icon" type></icon>
			</app-jump-button>
		</view>
	</view>
</template>

<script>
    export default {
        name: "app-store",
        props: {
            borderStyle: {
                type: Boolean,
                default: function() {
                    return true;
                }
            },
            icon: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            storeNum: {
                type: Number,
                default() {
                    return 0;
                }
            },
            business_hours: {
                type: String,
                default() {
                    return '';
                }
            },
            address: {
                type: String,
                default() {
                    return '';
                }
            },
            name: {
                type: String,
                default() {
                    return '';
                }
            },
            store_id: {
                type: String,
                default() {
                    return '';
                }
            },
            title: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            goods_id: {
                type: String,
                default() {
                    return '';
                }
            },
        }
    }
</script>

<style scoped lang="scss">
	.app-store {
		width: 100%;
		background-color: white;
		padding-left: #{24rpx};
		margin-bottom: #{20rpx};
		.app-text {
			height: #{72rpx};
			width: calc(100% - #{24rpx});
			font-size: #{26rpx};
			color: #999999;
			line-height: #{72rpx};
			border-bottom: #{1rpx} solid #e2e2e2;
		}
		.app-text-border {
			border-bottom: #{1rpx} solid #e2e2e2;
		}
		.app-more {
			height: #{80rpx};
			line-height: #{80rpx};
			font-size: #{28rpx};
			color: #00a0e9;
			position: relative;
		}
		.app-icon {
			position: absolute;
			top: #{30rpx};
			right: #{24rpx};
			width: #{10rpx};
			height: #{22rpx};
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-image: url("../../../static/image/icon/arrow-right.png");
		}
		.app-list-border {
			border-bottom: #{1rpx} solid #e2e2e2;
		}
		.app-list {
			padding-bottom: #{32rpx};
			.app-store-name {
				font-size: #{28rpx};
				margin-top: #{32rpx};
				margin-bottom: #{20rpx};
				color: #353535;
			}
			.app-address {
				font-size: #{28rpx};
				color: #999999;
			}
			.app-time {
				font-size: #{28rpx};
				color: #999999;
			}
		}
	}
</style>