<template>
	<view class="page-width">
		<view class="page-width order-wind-list">
			<view class="order-item" @click.stop="route_go(`/plugins/gift/detail/detail?gift_id=${item.id}&status=${tab_status}`)"  v-for="(item, index) in order_list" :key="index">
				
				<view class="page-width order-number-status main-between">
					<text v-if="item.order_no">订单号 {{item.order_no}}</text>
					<text v-if="!item.order_no && item.giftLog.type == 'num_open'">满人开奖 满{{item.giftLog.open_num}}人开奖</text>
					<text v-if="!item.order_no && item.giftLog.type == 'direct_open'">直接开奖</text>
					<text v-if="!item.order_no && item.giftLog.type == 'time_open'">定时开奖 {{item.giftLog.open_time}} </text>
					<text>{{item.status}}</text>
				</view>
				<view class="page-width item-content main-between cross-top">
					
					<!-- 商品图片 -->
					<view class="pic-content">
						<image
								class="pic"
								:src="item | getPicUrl(big_gift_pic)"
						></image>
						<image v-if="!getConvert(item.detail)" class="convert-pic" src="../../image/convert.png"></image>
					</view>
					
					<view class="name-attr-price dir-top-nowrap main-between">
						
						<view>
							<!-- 商品名字 -->
							<view class="page-width name t-omit-two">
								{{item.is_big_gift == 0 ? item.detail[0].name : '大礼包'}}
							</view>
							
							<!-- 商品规格 -->
							<view class="attr t-omit">
								<template v-if="item.is_big_gift == 0">
									{{item.detail[0].attr}}
								</template>
							</view>
						</view>
						
						<!-- 商品数量 -->
						<view class="number-price main-between">
							<text class="number">×{{item.status_num === 6 ? getNumber(item.detail) : item.detail[0].num}}</text>
						</view>
					</view>
				</view>
				
				<!-- 底部按钮 -->
				<view class="page-width nav main-between dir-left-nowrap">
					<view class="status dir-left-nowrap cross-center main-left">
						<text class="t-omit name">
							{{item.sendUser.nickname}}
						</text>
						<text>
							送出
						</text>
					</view>
					<view class="dir-left-nowrap" v-if="getConvert(item.detail)">
						<view @click.stop="setShare(item.id, item.gift_id, item.giftLog.bless_word, item)" class="again-button share-button" v-if="item.status_num == 1 && !item.notPayOrder">
							转赠礼物
						</view>
						<view @click.stop="route_go(`/plugins/gift/address/address?id=${item.id}&status=${tab_status}`)"  class="again-button" v-if="item.status_num == 1 && !item.notPayOrder">
							填写地址
						</view>
						<view  class="again-button" v-if="item.status_num == 2" @click.stop="receipt(index)">
							确认收货
						</view>
						<view class="again-button" v-if="item.notPayOrder" @click.stop="route_go(`/pages/order/index/index?status=1`)">
							去支付
						</view>
					</view>
				</view>
			</view>
		</view>
		<template v-if="order_list.length === 0">
			<view class="order-empty page-width dir-top-nowrap cross-center">
				<image class="image" src="/static/image/order-empty.png"></image>
				<text>没有任何记录~</text>
			</view>
		</template>
	</view>
</template>

<script>
    export default {
        name: 'order-wind-list',
      
	    props: [`tab_status`, `theme`, `order_list`, `big_gift_pic`],
	    
	    methods: {
            
            // 转增礼物
            setShare(id, gift_id, bless_word, item) {
                this.$emit('setShare', {id, gift_id, bless_word, item});
            },

		    // 跳转
            route_go(data) {
                uni.navigateTo({
	                url: data,
                })
            },

            getNumber(data) {
                let number = 0;
                for (let i = 0; i < data.length; i++) {
                    number += Number(data[i].num);
                }
                return number;
            },
		    
            receipt(index) {
                this.$emit('receipt', index);
            },

            getConvert(order_list) {
                let  is_convert = true;
                for (let i = 0; i < order_list.length;i++) {
                    if (order_list[i].is_convert == -1) {
                        is_convert = false;
                    }
                }
                return is_convert;
            }
	    },
     
	    filters: {
            getPicUrl(data, big_gift_pic) {
                if (data.is_big_gift == 0) {
                    let goods_attr = Object.prototype.toString.call(data.detail[0].goods_info) === '[object String]' ? JSON.parse(data.detail[0].goods_info).goods_attr : data.detail[0].goods_info.goods_attr;
                    return goods_attr.pic_url ? goods_attr.pic_url : data.detail[0].cover_pic;
	            } else {
                    return big_gift_pic;
                }
            },
	    }
    }
</script>

<style lang="scss" scoped>
	@import "../../css/gift.scss";
	.order-empty {
		width: 100%;
		margin-top: #{200upx};
		.image {
			width: #{240upx};
			height: #{240upx};
		}
		text {
			font-size: #{22upx};
			color: #666666;
			text-align: center;
			margin-top: #{28upx};
		}
	}
	// 订单列表
	.order-wind-list {
		padding: #{0 24upx 24upx 24upx};
		// 订单
		.order-item {
			border-radius: #{16upx};
			background-color: #ffffff;
			padding: #{24upx};
			margin-top: #{24upx};
		}
	}
	
	/*订单号状态值*/
	.order-number-status {
		font-size: #{24upx};
		color: #353535;
		padding: #{8upx 0 4upx 0};
		>text {
			line-height: 1;
		}
	}
	
	/*图片价格名字规格价格数量*/
	.item-content {
		padding: #{28upx 0};
		.pic-content {
			width: #{160upx};
			height: #{160upx};
			position: relative;
		}
		.convert-pic {
			width: #{160upx};
			height: #{160upx};
			position: absolute;
			top: 0;
			left: 0;
		}
		/*照片*/
		.pic {
			width: #{160upx};
			height: #{160upx};
			border-radius: #{8upx};
			position: absolute;
			top: 0;
			left: 0;
		}
		
		/*名字规格价格*/
		.name-attr-price {
			width: calc(100% - #{160upx});
			min-height: #{160upx};
			padding-left: #{10upx};
		}
		
		/*名字*/
		.name {
			font-size: #{24upx};
			line-height: #{31upx};
			height: #{62upx};
			color: #353535;
			margin: #{8upx 0 17.6upx 0};
		}
		
		/*规格*/
		.attr {
			white-space: normal;
			color: #999999;
			font-size: #{24upx};
			height: #{24upx};
			line-height: 1;
		}
		
		/*价格数量*/
		.number-price {
			font-size: #{24upx};
			line-height: 1;
			margin-bottom: #{12upx};
			.number {
				color: #999999;
			}
			.price {
				color: #353535;
			}
			.price:before {
				content: "￥";
			}
		}
	}
	
	/*状态跳转*/
	.nav {
		height: #{48upx};
		.again-button {
			padding: #{12upx 20upx};
			font-size: #{24upx};
			color: #666666;
			line-height: 1;
			border-radius: #{28upx};
			border: #{1upx} solid #bbbbbb;
		}
		.share-button {
			margin-right: #{16upx};
		}
		.status {
			font-size: #{24upx};
			line-height: 1;
			color: #353535;
			padding: #{12upx 0};
			width: #{200upx};
			text.name {
				max-width: #{135upx};
				white-space:nowrap;
				display: inline-block;
				overflow:hidden;
				text-overflow:ellipsis;
			}
		}
	}
</style>