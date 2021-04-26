<template>
	<view class="app-join-member" v-if="level_show === 2">
		<app-jump-button form open_type="navigate" url="/pages/member/index/index">
			<view class="app-orange dir-left-nowrap main-between cross-center">
				<view class="cross-center">
					<text class="app-title">加入会员，享会员价</text>
					<text class="app-symbol">{{groupSparePrice}}</text>
				</view>
				<view class="cross-center">
					<text class="app-title">了解更多</text>
					<image class="app-icon" src="../../../static/image/icon/arrow-right.png"></image>
				</view>
			</view>
		</app-jump-button>
	</view>
</template>

<script>
    export default {
        name: 'app-join-member',
	    props: {
            group_price_min: {
                type: String,
	            default() {
                    return '0.00';
	            }
            },
            original_price: {
                type: String,
	            default() {
                    return '0.00';
                }
            },
            level_show: {
                type: Number,
	            default() {
                    return 0;
	            }
            }
	    },
	    computed: {
            groupSparePrice: function() {
                return (Number(this.original_price) - Number(this.group_price_min)).toFixed(2);
            }
	    }
    }
</script>

<style scoped lang="scss">
	.app-join-member {
		background-color: white;
		width: #{750rpx};
		height: #{77rpx};
		padding: #{10rpx} #{17rpx};
		box-sizing: border-box;
		.app-orange {
			background-color: #faf2d8;
			width: #{716rpx};
			height: #{57rpx};
			border-radius: #{9rpx};
			padding: 0 #{17rpx};
			box-sizing: border-box;
			.app-symbol {
				color: #ff4544;
				font-size: #{16rpx};
				margin-top: #{2rpx};
			}
			.app-symbol:before {
				content: '￥';
			}
			.app-icon {
				width: #{9rpx};
				height: #{16rpx};
				margin-left: #{10rpx};
			}
			.app-title {
				font-size: #{28rpx};
				color: #3a3a39;
			}
		}
	}
</style>