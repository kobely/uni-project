<template>
	<view class="app-product-list">
		<view class="app-item dir-left-nowrap" v-for="(item, index) in list" :key="index" @click="route_go(item)">
			<image class="app-image" :src="item.goods.cover_pic"></image>
			<view class="out-dialog" v-if="item.miaosha_num == 0 && appSetting.is_show_stock == '1'">
				<image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
			</view>
			<view class="app-content">
				<text class="app-name">{{item.goods.name}}</text>
				<view class="app-percentage">
					<view :style="{width: `${item.goods.miaosha_percentage}`}"></view>
				</view>
				<view class="app-text dir-left-nowrap main-between cross-center">
					<text class="app-already">已抢购{{item.goods.miaosha_count}}{{item.goods.unit}}</text>
					<text class="app-past">仅剩{{item.goods.miaosha_num}}{{item.goods.unit}}</text>
				</view>
				<view class="price-button dir-left-nowrap main-between cross-bottom">
					<view class="price app-price dir-top-nowrap main-right cross-top">
						<view v-if="item.is_level">
							<app-member-price :price="item.level_price"></app-member-price>
						</view>
                        <app-sup-vip :is_vip_card_user="item.vip_card_appoint.is_vip_card_user" margin="4rpx 0 0" v-if="item.vip_card_appoint.discount" :discount="item.vip_card_appoint.discount"></app-sup-vip>
						<view class="app-min-price" :style="{'color': theme.color}">￥{{item.goods.min_price}}</view>
						<view class="app-original-price">￥{{item.goods.original_price}}</view>
					</view>
					<view class="app-button" style="color: #ffffff;" :style="{'background-color': theme.background}" v-if="status === 1 && item.miaosha_num > 0">马上抢购</view>
					<view class="app-button no-button" :style="{'color': theme.color, 'border-color': theme.border}" v-if="(status === 0 || status === 2) && item.miaosha_num > 0">查看商品</view>
					<view class="app-button" style="background-color: #CDCDCD;color: #fff;" v-if="item.miaosha_num == 0">下次再来</view>
				</view>
			</view>
		</view>
		<view :style="{width: `100%`, height: `${botHeight}rpx`}" v-if="empty"></view>
	</view>
</template>

<script>
    import {mapState, mapGetters} from 'vuex';

    export default {
		name: 'app-product-list',
	    data() {
            return {
                is_vip: true,
            }
	    },
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img.mall,
				appSetting: state => state.mallConfig.mall.setting,
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            }),
			...mapGetters('mallConfig', {
				getVideo: 'getVideo'
			}),
        },
	    props: {
            list: {
                type: Array,
	            default() {
                    return [];
	            }
            },
            status: {
                type: Number
            },
            empty: Boolean,
            botHeight: Number,
			theme: {
            	type: Object,
			}
	    },
	    methods: {
            route_go(data) {
				// #ifndef MP-BAIDU
				if (data.goods.video_url && this.getVideo == 1) {
				    // #ifdef MP
					uni.navigateTo({
						url: `/pages/goods/video?goods_id=${data.goods_id}&sign=miaosha`
					});
					// #endif
                    // #ifdef H5
                    uni.navigateTo({
                        url: `/plugins/miaosha/goods/goods?id=${data.goods_id}`,
                    });
                    // #endif
				} else {
					uni.navigateTo({
						url: `/plugins/miaosha/goods/goods?id=${data.goods_id}`,
					});
				}
				// #endif

				// #ifdef MP-BAIDU
				uni.navigateTo({
					url: `/plugins/miaosha/goods/goods?id=${data.goods_id}`,
				});
				// #endif
            }
	    }
    }
</script>

<style scoped lang="scss">
	.app-product-list {
		width: #{750rpx};
		background-color:white;
		overflow: hidden;
		.app-item {
			width: #{750rpx};
			padding: #{12rpx} #{24rpx} 0 0;
			border-bottom: #{1rpx} solid #e2e2e2;
			background-color: white;
			position: relative;
			.app-image {
				width: #{262rpx};
				height: #{262rpx};
			}
			.out-dialog {
				width: #{262rpx};
				height: #{262rpx};
				position: absolute;
				top: #{12rpx};
				left: 0;
				background-color: rgba(0,0,0,.5);
				image {
					width: #{262rpx};
					height: #{262rpx};
				}
			}
			.app-content {
				width: #{440rpx};
				margin-left: #{24rpx};
				padding-top: #{18rpx};
				margin-bottom: #{10rpx};
				.app-name {
					font-size: #{28rpx};
					color: #353535;
					word-break: break-all;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
				.app-percentage {
					width: #{440rpx};
					height: #{24rpx};
					border-radius: #{12rpx};
					background-color: #ffb7b7;
					margin-top: #{16rpx};
					overflow: hidden;
					>view {
						height: #{24rpx};
						border-radius: #{12rpx};
						background-color: #ff4544;
					}
				}
				.app-text {
					font-size: #{24rpx};
					margin-top: #{4rpx};
				}
				.app-already {
					color: #666666;
				}
				.app-past {
					color: #ff4544;
				}
				.price-button {
					width: #{440rpx};
					min-height: #{132rpx};
					.price {
						width: #{440-164rpx};
						height: #{132rpx};
					}
					.app-price {
						
						.app-min-price {
							font-size: #{40rpx};
							height: #{40rpx};
							margin-top: #{-4rpx};
						}
						.app-original-price {
							font-size: #{24rpx};
							color: #999999;
							text-decoration: line-through;
						}
					}
					.app-button {
						width: #{164rpx};
						height: #{68rpx};
						font-size: #{26rpx};
						text-align: center;
						line-height: #{68rpx};
						border-radius: #{34rpx};
						margin-bottom: #{5rpx};
					}
					.no-button {
						background-color: white;
						border: #{1rpx} solid;
					}
				}
			}
		}
	}
</style>