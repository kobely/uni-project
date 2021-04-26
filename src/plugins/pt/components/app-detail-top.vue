<template>
	<view class="app-detail-top dir-left-nowrap">
		<image class="app-image" :src="cover_pic"></image>
		<view class="app-content dir-top-nowrap">
			<text class="app-name">{{name}}</text>
			<view class="app-price">
				<text class="app-group-min-price" :style="{'color': theme.color}">{{price}}</text>
				<text class="app-origin-price">{{original_price}}</text>
			</view>
			<view class="app-attr">
				<text class="app-people-num" :style="{'background-color': theme.background_o,'color': theme.color}">{{people_num}}人团</text>
				<text :style="{'background-color': theme.background_o,'color': theme.color}">拼团省{{group_economize_price}}</text>
			</view>
			<image class="app-icon" v-if="status === 2" src="/plugins/pt/image/pt-success.png"></image>
			<image class="app-icon" v-else-if="status === 3 || status === 4" src="/plugins/pt/image/pt-fail.png"></image>
		</view>
	</view>
</template>

<script>
    export default {
        name: "app-detail-top",
	    props: {
            cover_pic: String,
            name: String,
            original_price: String,
			price: String,
            people_num: String,
		    status: Number,
            group_economize_price: String,
			theme: Object
	    }
    }
</script>

<style scoped lang="scss">
	.app-detail-top {
		width: #{750rpx};
		height: #{260+24rpx};
		background-color: white;
		padding: #{24rpx} #{24rpx} 0 #{24rpx};
		box-sizing: border-box;
		.app-image {
			width: #{260rpx};
			height: #{260rpx};
			margin-right: #{24rpx};
			background-color: pink;
		}
		.app-content {
			width: #{750-48-260-24rpx};
			height: #{260rpx};
			background-color: white;
			padding-top: #{8rpx};
			box-sizing: border-box;
			.app-name {
				font-size: #{26rpx};
				color: #353535;
				line-height: #{29rpx};
				word-break: break-all;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
				overflow: hidden;
			}
			.app-price {
				margin-top: #{28rpx};
				>text:before {
					content: '￥';
					font-size: #{26rpx};
				}
				.app-group-min-price {
					font-size: #{48rpx};
				}
				.app-origin-price {
					font-size: #{24rpx};
					color: #999999;
					margin-left: #{16rpx};
					text-decoration: line-through;
				}
			}
			.app-attr {
				margin-top: #{16rpx};
				>text {
					display: inline-block;
					height: #{44rpx};
					line-height: #{44rpx};
					font-size: #{24rpx};
					padding: 0 #{12rpx};
					box-sizing: border-box;
				}
				.app-people-num {
					margin-right: #{6rpx};
				}
			}
			.app-icon {
				position: absolute;
				top: #{112rpx};
				right: #{24rpx};
				width: #{140rpx};
				height: #{140rpx};
			}
		}
	}
</style>