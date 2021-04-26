<template>
	<view class="goods-list dir-top-nowrap">
		<view class="row dir-left-nowrap main-between box-grow-1" v-for="(item, key) in goodsList" :key="key" >
			<view class="item box-grow-0" v-for="(good, index) in item"  :key="index" @click="route_go(good)">
				<view class="image-name dir-top-nowrap main-left">
					<view class="out-dialog" v-if="good.goods_stock == 0 && appSetting.is_show_stock == '1'">
						<image  :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
					</view>
					<image :lazy-load="true" mode="aspectFill"  class="cover_pic" :src="good.cover_pic"></image>
					<view class="name t-omit">{{good.name}}</view>
				</view>
				<view class="content dir-top-nowrap main-right">
					<view class="price-bottom" v-if="good.is_level == 1">
						<app-member-price :theme="theme" :price="good.level_price"></app-member-price>
					</view>
					<view v-if="good.discount">
						<app-sup-vip :is_vip_card_user="good.is_vip_card_user" :discount="good.discount"></app-sup-vip>
					</view>
					<view class="price-btn dir-left-nowrap main-between cross-center">
						<view class="price" :style="{'color': theme.color}">{{good.price_str}}</view>
						<view v-if="good.goods_stock != 0" :style="{'color': good.buy_goods_auth ? theme.color : '#9999999'}" class="btn">预约</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';

    export default {
        name: "app-product-list",
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img.mall,
                appSetting: state => state.mallConfig.mall.setting,
            }),
			...mapGetters('mallConfig', {
				getVideo: 'getVideo'
			}),
        },
		
		data() {
			return {
				disable: 'disable'
			};
		},

        props: [`goodsList`, `theme`],
	    
	    methods: {
            route_go(data) {
				this.$emit('route_go', data);
            }
	    },
    }
</script>

<style scoped lang="scss">
	
	.goods-list {
		width: calc(100% - #{32upx});
		background-color: #f7f7f7;
		margin: #{0 16upx};
	}
	.row {
		margin-top: #{16upx};
	}
	.item {
		width: #{350upx};
		border-radius: #{15upx};
		background-color: #ffffff;
	}
	
	.image-name {
		height: #{396upx};
		margin-bottom: #{10upx};
		position: relative;
		.out-dialog {
			width: #{350upx};
			height: #{350upx};
			position: absolute;
			top: 0;
			left: 0;
			background-color: rgba(0,0,0,.5);
			z-index: 10;
			image {
				width: #{350upx};
				height: #{350upx};
			}
		}
	}
	
	.content {
		margin: #{0 20upx};
		width: #{310upx};
		height: calc(100% - #{405upx});
	}
	.cover_pic {
		width: #{350upx};
		height: #{350upx};
		margin-bottom: #{20upx};
		border-top-right-radius: #{15upx};
		border-top-left-radius: #{15upx};
	}
	.name {
		width: #{310upx};
		margin: #{0 20upx};
		font-size: #{28upx};
		color: #353535;
	}
	.btn {
		width: #{110upx};
		height: #{45upx};
		border-radius: #{22.5upx};
		font-size: #{26upx};
		line-height: #{45upx};
		text-align: center;
		border: #{1upx} solid ;
	}
	.price-bottom {
		margin-bottom: #{10upx};
	}
	.price {
		font-size: #{25upx};
	}
	.price-btn {
		margin-top: #{10upx};
		margin-bottom: #{16upx};
	}
</style>
