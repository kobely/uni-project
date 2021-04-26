<template>
	<view class="detail-vip" @click="nav">
		<image class="bg" src="../image/S-VIP-BG.png"></image>
		<view class="content dir-left-nowrap">
			<view class="item icon">
				<image class="icon" src="../image/v-logo.png"></image>
			</view>
			<view class="item text dir-top-nowrap">
				<text class="big text">开通{{name}}超级会员，立省更多</text>
				<text class="small text">超值全场{{discount == 0 ? '免费': discount + '折'}}！</text>
			</view>
			<view class="item button">
				<view class="button">
					立即开通
				</view>
			</view>
		</view>
	</view>
</template>

<script>
    export default {
        name: 'detail-vip',
	    props: {
            discount: String,
            name: String,
	    },
	    methods: {
            nav() {
                uni.navigateTo({
	                url: `/plugins/vip_card/index/index`,
                })
            }
	    }
    }
</script>

<style scoped lang="scss">
	.detail-vip {
		position: relative;
		width: #{750upx};
		height: #{120upx};
		padding: #{0 24upx};
		background-color: #ffffff;
		.bg {
			width: 100%;
			height: #{120upx};
			border-radius: #{14upx};
		}
		.content {
			position: absolute;
			top: 0;
			left: #{24upx};
			width: calc(100% - #{48upx});
			height: #{120upx};
		}
		.item {
			height: 100%;
			.icon {
				width: #{60upx};
				height: #{60upx};
				margin: #{36upx 0 0 26upx};
			}
			.text {
				color: #e9ceb9;
			}
			.big {
				font-size: #{26upx};
				line-height: 1;
				margin-top: #{30upx};
				margin-bottom: #{12upx};
				word-break: break-all;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				white-space: normal;
			}
			.small {
				font-size: #{21upx};
				line-height: 1;
			}
		}
		.item.icon {
			width: #{115upx};
		}
		.item.text {
			width: #{417upx};
		}
		.item.button {
			width: #{170upx};
			.button {
				width: #{120upx};
				height: #{48upx};
				text-align: center;
				border-radius: #{24upx};
				background: linear-gradient(to right, #fbdec8, #f3be94);
				font-size: #{24upx};
				line-height: 2;
				color: #342e25;
				margin-top: #{36upx};
			}
		}
	}
</style>