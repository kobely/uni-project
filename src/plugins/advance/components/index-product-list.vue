<template>
	<view class="product-list" v-if="product.length > 0">
		<view class="item" v-for="(item, index) in newProduct" :key="index" :class="{'item-bottom-bor': index !== product.length-1}" @click="route_jump(item)">
			<app-form-id>
				<view class="item-in dir-left-wrap main-between cross-center">
					<image class="goods-cover" :src="item.cover_pic" :lazy-load="true"></image>
					<view class="out-dialog" v-if="item.goods_stock == 0 && appSetting.is_show_stock == '1'">
						<image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
					</view>
					<view class="item-content dir-top-nowrap main-between">
						<view>
							<text class="item-name">{{item.name}}</text>
							<view class="item-time dir-left-wrap">
								<image  class="icon" src="/static/image/icon/time.png"></image>
								<text class="text">距预售截止：</text>
								<text class="text-time" :style="{'color': theme.color}">{{item.html}}</text>
							</view>
						</view>
						<view class="price-button dir-left-nowrap main-between">
							<view class="price">
								<text class="symbol" :style="{'color': theme.color}" v-if="item.use_attr == 0">定金￥{{Number(item.advanceGoods.deposit)}}抵￥{{Number(item.advanceGoods.swell_deposit)}}</text>
								<text class="symbol" :style="{'color': theme.color}" v-if="item.use_attr == 1">定金￥{{Number(item.attr[0].deposit)}}抵￥{{Number(item.attr[0].swell_deposit)}}</text>
								<view class="dir-left-nowrap cross-center">
									<template v-if="item.is_level == 1">
										<app-member-price :theme="theme" :price="item.level_price"></app-member-price>
									</template>
									<app-sup-vip :is_vip_card_user="item.vip_card_appoint.is_vip_card_user" margin="0 0 0 10rpx" v-if="item.vip_card_appoint.discount" :discount="item.vip_card_appoint.discount"></app-sup-vip>
								</view>
								<view class="all-price">
									<text class="new-price" :style="{'color': theme.color}">￥{{Number(item.price)}}</text>
									<text class="old-price">￥{{Number(item.original_price)}}</text>
								</view>
							</view>
							<view v-if="item.goods_stock > 0" class="button" :style="{'background-color': item.buy_goods_auth ? theme.background : '#999999'}">抢购</view>
						</view>
					</view>
				</view>
			</app-form-id>
		</view>
	</view>
</template>

<script>
	import {mapGetters, mapState} from 'vuex';

    export default {
		name: 'index-product-list',
		data() {
			return {
				disable: 'disable'
			};
		},
        props: {
            product: {
                type: Array,
	            default() {
                    return [];
	            }
            },
			theme: Object,
        },
	    methods: {
            route_jump(data) {
				// #ifndef MP-BAIDU
				if (data.goodsWarehouse.video_url && this.getVideo == 1) {
				    // #ifdef MP
					uni.navigateTo({
						url: `/pages/goods/video?goods_id=${data.id}&sign=advance`
					});
					// #endif
                    // #ifdef H5
                    uni.navigateTo({
                        url: data.page_url,
                    });
                    // #endif
				} else {
					uni.navigateTo({
						url: data.page_url,
					});
				}
				// #endif

				// #ifdef MP-BAIDU
				uni.navigateTo({
					url: data.page_url,
				});
				// #endif
            }
	    },
	    computed: {
            newProduct() {
                for (let i = 0; i < this.product.length; i++) {
                    let attr = this.product[i].attr;
                    let compare = function (obj1, obj2) {
                        let val1 = Number(obj1.deposit);
                        let val2 = Number(obj2.deposit);
                        if (val1 < val2) {
                            return -1;
                        } else if (val1 > val2) {
                            return 1;
                        } else {
                            return 0;
                        }
                    };
                    this.product[i].attr = attr.sort(compare);
                }
                return this.product;
            },
            ...mapGetters('mallConfig',{
                vip: 'getVip',
				getVideo: 'getVideo'
            }),
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img.mall,
                appSetting: state => state.mallConfig.mall.setting,
                mall: state => state.mallConfig.mall,
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            })
	    }
    }
</script>

<style scoped lang="scss">
	.product-list {
		width: #{750rpx};
		.item {
			height: #{268rpx};
			background-color: #ffffff;
			width: 100%;
			padding: #{24rpx};
			position: relative;
			.item-in {
				width: #{702rpx};
				height: #{220rpx};
				.goods-cover {
					width: #{220rpx};
					height: #{220rpx};
					border-radius: #{12rpx};
				}
				.out-dialog {
					width: #{220rpx};
					height: #{220rpx};
					position: absolute;
					bottom: 0;
					left: 0;
					background-color: rgba(0,0,0,.5);
					image {
						width: #{220rpx};
						height: #{220rpx};
					}
				}
				.item-content {
					width: #{458rpx};
					height: #{220rpx};
				}
				.item-name {
					width: #{458rpx};
					line-height: 35upx;
					margin: #{7rpx} 0;
					font-size: #{25rpx};
					color: #353535;
					word-break: break-all;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.item-time {
					width: #{458rpx};
					height: #{24rpx};
					margin-top: #{8rpx};
					line-height: #{24rpx};
					.icon {
						width: #{24rpx};
						height: #{24rpx};
						margin-right: #{12rpx};
					}
					.text {
						font-size: #{25rpx};
						color: #adadad;
					}
					.text-time {
						font-size: #{25rpx};
					}
				}
				.price-button {
					width: #{458rpx};
					height: #{73rpx};
					margin-bottom: #{28rpx};
					.price {
						width: #{354rpx};
						height: #{73rpx};
						.symbol {
							display: inline-block;
							padding: #{0rpx 4rpx};
							font-size: #{24rpx};
							border: #{1rpx} solid;
							border-radius: #{8rpx};
							margin: #{5upx 0 5upx 0};
						}
						.all-price {
							line-height: 1;
							font-size: #{28rpx};
							margin-top: #{8upx};
							.new-price {
								font-size: #{28rpx};
								line-height: 1;
							}
							.old-price {
								font-size: #{21rpx};
								color: #999999;
								text-decoration: line-through;
								margin-left: #{12rpx};
								line-height: 1;
							}
						}
					}
					.button {
						width: #{104rpx};
						height: #{56rpx};
						margin-top: #{60rpx};
						border-radius: #{28rpx};
						font-size: #{28rpx};
						color: #ffffff;
						text-align: center;
						line-height: #{56rpx};
					}
				}
			}
		}
		.item-bottom-bor {
			border-bottom: #{1rpx} solid #eeeeee;
		}
	}
</style>