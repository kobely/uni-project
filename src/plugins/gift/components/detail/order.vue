<template>
	<view class="page-width order">
		<view class="page-width order-content">
			<view class="item dir-left-nowrap" v-for="(item, index) in order_list" :key="index">
				<view class="image">
					<image class="pic" :src="item.goods_info | getPicUrl"></image>
					<text v-if="sign" :class="[`${theme}-background`, `sign`]">{{sign}}</text>
				</view>
				<view class="name-attr-price dir-top-nowrap main-left">
					<view class="name">{{item.name}}</view>
					<view class="attr">
						<block
							v-for="(name, key) in JSON.parse(item.goods_info).attr_list"
							:key="key"
						>
							{{name.attr_group_name}}:{{name.attr_name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						</block>
					</view>
					<view class="number-price dir-left-nowrap main-between">
						<text class="number gray">{{item.num}}</text>
						<text class="price black">{{item.total_price}}</text>
					</view>
				</view>
			</view>
			<view class="total dir-left-nowrap main-right cross-center">
				<text class="gray-word gray">合计</text>
				<text class="black-word black">{{total_price}}</text>
			</view>
		</view>
	</view>
</template>

<script>
    export default {
        name: "order",
	    
	    props: {
            order_list: Array,
            sign: String,
		    theme: String,
            total_price: Number,
	    },
	    
        filters: {
            getPicUrl(data) {
                let goods_attr = JSON.parse(data).goods_attr;
                return goods_attr.pic_url ? goods_attr.pic_url : goods_attr.cover_pic;
            }
        }
    }
</script>

<style scoped lang="scss">
	@import "../../css/gift.scss";
	
	.order {
		padding: #{0 24upx};
		margin-top: #{24upx};
		.order-content {
			background-color: #ffffff;
			padding: #{24upx 24upx 0 24upx};
			overflow: hidden;
		}
	}
	
	/*订单*/
	.item {
		margin-bottom: #{24upx};
		.image {
			width: #{160upx};
			height: #{160upx};
			position: relative;
			.pic {
				border-radius: #{8upx};
				width: #{160upx};
				height: #{160upx};
			}
		}
		.sign {
			position: absolute;
			top: 0;
			left: 0;
			border-top-left-radius: #{8upx};
			font-size: #{24upx};
			color: #ffffff;
			padding: #{10upx};
		}
	}
	
	/*名字价格规格*/
	.name-attr-price {
		width: calc(100% - #{160upx});
		padding-left: #{20upx};
		.name {
			font-size: #{24upx};
			line-height: #{30upx};
			height: #{60upx};
			margin-top: #{5upx};
			word-break: break-all;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			white-space: normal !important;
		}
		.attr {
			font-size: #{24upx};
			color: #999999;
			margin-top: #{17upx};
			word-break: break-all;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
			white-space: normal !important;
		}
		.number-price {
			font-size: #{24upx};
			line-height: 1;
			margin-top: #{20upx};
		
			.number:before {
				content: "×";
				font-size: 80%;
			}
		
			.price:before {
				content: "￥";
			}
		}
	}
	
	/*合计*/
	.total {
		padding: #{24upx 0};
		/*灰字*/
		.gray-word {
			font-size: #{24upx};
			line-height: 1;
		}
		/*黑字*/
		.black-word {
			font-size: #{28upx};
			line-height: 1;
		}
		.black-word:before {
			content: '￥';
			font-size: 100%;
		}
	}
	
</style>