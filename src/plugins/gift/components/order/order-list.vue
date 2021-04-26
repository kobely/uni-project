<template>
    <view class="page-width">
	    <view class="page-width order-list">
		    <view @click="navigateTo(`/plugins/gift/detail/detail?gift_id=${item.id}&status=${tab_status}`)"
		          class="order-item"
		          v-for="(item, index) in order_list"
		          :key="index"
		    >
			    <view class="page-width order-number-status main-between">
				    <text>订单号 {{item.sendOrder[0].order_no}}</text>
				    <text>{{item.status}}</text>
			    </view>
			    <view class="page-width item-content main-between cross-top">
				    
				    <!-- 商品图片 -->
				    <image class="pic"
				           :src="item.is_big_gift === 0 ? getPicUrl(item.sendOrder[0].detail[0].goods_info) : big_gift_pic"
				    ></image>
				    <view class="name-attr-price dir-top-nowrap main-between">
					    
					    <view>
						    <!-- 商品名字 -->
						    <view class="page-width name t-omit-two">
							    {{item.is_big_gift === 0 ? item.sendOrder[0].detail[0].goods.goodsWarehouse.name : `大礼包`}}
						    </view>
						
						    <!-- 商品规格 -->
						    <view class="attr t-omit">
							    <template v-if="item.is_big_gift === 0">
								    <block  v-for="(a, k) in JSON.parse(item.sendOrder[0].detail[0].goods_info).attr_list" :key="k">
									    {{a.attr_group_name}}：{{a.attr_name}}&nbsp;&nbsp;&nbsp;&nbsp;
								    </block>
							    </template>
						    </view>
					    </view>
					    
					    <!-- 商品价格数量 -->
					    <view class="number-price main-between">
						    <text class="number">{{item.is_big_gift === 0 ? `×${item.num}` : `共${item.sendOrder[0].detail.length}种商品`}}</text>
						    <text class="price">{{item.sendOrder[0].total_pay_price}}</text>
					    </view>
				    </view>
			    </view>
			    
			    <!-- 底部按钮 -->
			    <view class="page-width nav main-between">
				    <view class="status">
					    {{item.type === `direct_open` ? `直接送礼` : item.type === `time_open` ? `定时开奖 ${item.open_time}` : item.type === `num_open` ?  `满人开奖 满${item.open_num}人开奖` : ``}}
				    </view>
				    <view @click.stop="redirectTo" class="again-button" >
					    再送一份
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
        name: 'order-list',
        
        props: {
            theme: String,
            order_list: Array,
            tab_status: Number,
            big_gift_pic: String,
        },
	    
	    methods: {
            // 跳转到首页
            redirectTo() {
                uni.redirectTo({
	                url: `/plugins/gift/index/index`
                })
            },
			
		    // 跳转到详情
            navigateTo(data) {
                uni.navigateTo({
	                url: data
                })
            },

            getPicUrl(data) {
                let goods_attr = JSON.parse(data).goods_attr;
                return goods_attr.pic_url ? goods_attr.pic_url : goods_attr.cover_pic;
            }
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
    .order-list {
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
		}

		/*照片*/
		.pic {
			width: #{160upx};
			height: #{160upx};
			border-radius: #{8upx};
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
		.status {
			font-size: #{24upx};
			line-height: 1;
			color: #353535;
			padding: #{12upx 0};
		}
	}
</style>