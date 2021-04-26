<template>
	<view :class="[!listStyle ? 'list-padding' : '', 'page-width', 'product-list', 'dir-top-nowrap']">
		<view class="f-swipe-content" @click="routeGo(item)"  v-if="listStyle" v-for="(item, index) in goods_list" :key="item.id">
			<view class="f-item  dir-left-nowrap" >
                <view class="f-out-dialog" v-if="item.goods_stock == 0 && appSetting.is_show_stock == '1'">
                    <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                </view>
                <image class="f-img" :src="item.cover_pic" :lazy-load="true" mode="aspectFill"></image>
				<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
				<view class="f-content dir-top-wrap main-between">
					<text class="t-omit-two f-title">{{ item.name }}</text>
					<view>
						<!-- 会员价 -->
						<view class="member-price" v-if="item.is_level == 1 && item.is_negotiable != 1">
							<app-member-price
									:price="item.level_price"
									:theme="theme"
									:sign="sign"
							></app-member-price>
						</view>

						<!-- 超级会员卡 -->
						<view class="app-sup-vip" v-if="item.vip_card_appoint && item.vip_card_appoint.discount && item.is_negotiable != 1">
							<app-sup-vip
									:discount="item.vip_card_appoint.discount"
									:is_vip_card_user="item.vip_card_appoint.is_vip_card_user"
							></app-sup-vip>
						</view>
						<view class="dir-left-nowrap main-between">
							<view class="dir-top-wrap main-between">
								<text class="f-price" :style="{'color': sign === 'gift' ?theme.color : ''}" :class="sign === 'gift' ? theme + '-color' : ''">{{item.price_content}}</text>
								<text class="f-scale" v-if="item.is_negotiable != 1 && isShowSalesNum == 1">{{item.sales}}</text>
							</view>
							<view v-if="sign !== 'gift' && item.is_negotiable != 1 && isShowCart == 1 && item.goods_stock > 0">
								<image class="f-cat-icon"
									   @click.stop="specification(item)"
									   :style="{'background-color': item.buy_goods_auth ? theme.background : '#999999'}" 
									   src="/static/image/icon/cats.png"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="!listStyle" class="page-width dir-left-wrap main-between" >
			<view @click="routeGo(item)"
					class="u-goods box-grow-0 dir-top-nowrap main-between"
					v-for="(item, index) in goods_list"
                    :class="'index-'+index"
					:key="index">
				<view class="image-name dir-top-nowrap main-left" >
					<view class="out-dialog" v-if="item.goods_stock == 0 && appSetting.is_show_stock == '1'">
                        <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                    </view>
					<image class="image" :src="item.cover_pic" :lazy-load="true" mode="aspectFill"></image>
					<view class="name t-omit-two" v-if="is_name && isShowGoodsName == 1">{{item.name}}</view>
				</view>
				<view class="content dir-top-nowrap main-right" :style="{height: is_name ? 'calc(100% - #{426rpx})': 'height: calc(100% - #{384rpx});'}" >

					<!-- 会员价 -->
					<view class="member-price" v-if="(item.is_level == 1 || (sign === 'exchange' && item.level_show != 0)) && item.is_negotiable != 1">
						<app-member-price
							:price="item.level_price"
							:theme="theme"
							:sign="sign"
						></app-member-price>
					</view>

					<!-- 超级会员卡 -->
					<view class="app-sup-vip" v-if="item.vip_card_appoint && item.vip_card_appoint.discount && item.is_negotiable != 1">
						<app-sup-vip
								:discount="item.vip_card_appoint.discount"
								:is_vip_card_user="item.vip_card_appoint.is_vip_card_user"
						></app-sup-vip>
					</view>

					<!-- 价格 销量 -->
					<view v-if="sign !== 'exchange'" 
						class="price-total page-width dir-left-nowrap main-between cross-bottom"
					>
						<view>
                            <view class="price" :style="{'color': sign !== 'gift' ?theme.color : ''}" :class="sign === 'gift' ? theme + '-color' : ''">
                                {{item.price_content}}
                            </view>
                            <view class="origin-price" v-if="isListUnderlinePrice == 1">
                                ￥{{item.original_price}}
                            </view>
                        </view>
						<template v-if="sign === 'gift'">
							<text v-if="item.is_negotiable != 1" class="gray sales">{{item.sales}}</text>
						</template>
						<template v-else>
							<text v-if="item.is_negotiable != 1 && isShowSalesNum == 1" class="gray sales">{{item.sales}}</text>
							<view class="box-grow-1" style="position: relative;" v-if="item.is_negotiable != 1 && isShowCart == 1 && item.goods_stock > 0">
								<!--  #ifdef  MP-ALIPAY -->
								<div class="cart-box" @click.stop="specification(item)" style="-webkit-background-origin: content-box;background-origin: content-box;">
									<app-cart-image class="goods-cart"  :sign="sign"  :theme="theme" :goods="item"></app-cart-image>
								</div>
								<!--  #endif -->
								<!-- #ifndef MP-ALIPAY -->
								<div class="cart-box" @click.stop="specification(item)">
									<app-cart-image class="goods-cart" :sign="sign" :theme="theme" :goods="item"></app-cart-image>
								</div>
								<!-- #endif -->
							</view>
						</template>
					</view>
                    <view v-if="sign === 'exchange'" class="price-total exchange page-width">
                        <template>
							<text class="price" :style="{'color': theme.color}">
								{{item.price_content}}
							</text>
                            <view class="dir-left-nowrap cross-center sales-box box-grow-0">
                                <view class="sales">{{item.sales}}</view>
                            </view>
                            <view class="dir-left-nowrap cross-center sales-box box-grow-0">
                                <view class="sales">库存:{{item.goods_stock}}{{item.unit}}</view>
                            </view>
                        </template>
                    </view>
				</view>
			</view>
		</view>
        <u-attr
        	v-if="attrGoods.attrShow || attrGoods.goods"
            v-model="attrGoods.attrShow"
            :checked="attrGoods.select"
            :goods="attrGoods.goods"
            :theme="theme"
            @check="checkClick"
        ></u-attr>
	</view>
</template>

<script>
    import { mapState } from "vuex";
    import appAttr from '../../../components/page-component/app-attr/app-attr.vue';
    import uAttr from '../../../components/page-component/goods/u-attr.vue';

    export default {
        name: 'product-list',

        props: {
            goods_list: Array,
            theme: [Object,String],
            is_name: {
                type: Boolean,
	            default: true,
            },
            is_cart: {
                type: Boolean,
	            default: true,
            },
			sign: String,
			listStyle: {
            	type: Boolean,
				default: false
			},
            isShowAttr: {
                type: Boolean,
                default: true
            },
        },
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img.mall,
                isShowCart: state => state.mallConfig.mall.setting.is_show_cart,
                isShowGoodsName: state => state.mallConfig.mall.setting.is_show_goods_name,
                isShowSalesNum: state => state.mallConfig.mall.setting.is_show_sales_num,
                appSetting: state => state.mallConfig.mall.setting,
                isListUnderlinePrice: state => state.mallConfig.mall.setting.is_list_underline_price
            })
        },

        methods: {
            routeGo(data) {
                this.$emit('routeGo', data);
            },
            specification(goods) {
                this.attrGoods.select = null;
                if (this.isShowAttr) {
                    this.attrGoods.goods = goods;
                    this.attrGoods.attrShow = true;
                } else {
                    uni.showLoading({
                        text: '',
                        mask: true
                    });
                    this.$request({
                        url: this.$api.goods.attr,
                        data: {
                            id: goods.id,
                            mch_id: goods.mch_id
                        }
                    }).then(e => {
                        uni.hideLoading();
                        if (e.code === 0) {
                            this.attrGoods.goods = Object.assign(goods, e.data);
                            this.attrGoods.attrShow = true;
                        } else {
                            uni.showToast({
                                title: e.msg,
                                icon: 'none'
                            })
                        }
                    })
                }
            },
            checkClick({item}) {
                this.attrGoods.select = item;
            }
        },
        data() {
            return {
                attrGoods: {
                    goods: null,
                    attrShow: 0,
                    select: null,
					disable: 'disable'
                }
            }
        },
        components: {
            'app-attr': appAttr,
            uAttr
        }
    }
</script>

<style scoped  lang="scss">
	.product-list {
		position: relative;
        .u-goods {
            margin-top: #{15upx};
            background-color: #ffffff;
            width: #{344upx};
            border-radius: #{15upx};
        }
	}
    .list-padding {
        padding: #{0 20upx};
    }
	/*图片名字*/
	.image-name {
		width: 100%;
		border-top-left-radius: #{15upx};
		border-top-right-radius: #{15upx};
		position: relative;
	    .out-dialog {
			border-top-left-radius: #{15upx};
			border-top-right-radius: #{15upx};
	        width: #{344upx};
	        height: #{344upx};
	        position: absolute;
	        top: 0;
	        z-index: 10;
	        left: 0;
	        background-color: rgba(0,0,0,.5);
	        image {
	            width: #{344upx};
	            height: #{344upx};
	        }
	    }
		.image {
			width: 100%;
			height: #{344upx};
			border-top-left-radius: #{15upx};
			border-top-right-radius: #{15upx};
		}
		.name {
			font-size: #{26upx};
			color: #353535;
			padding: #{0 24upx};
			margin-top: #{20upx};
			line-height: #{36upx};
		}
	}
	
	.content-name {
		height: calc(100% - #{426upx});
	}
	
	.content-no {
		height: calc(100% - #{384upx});
	}
	/*复杂内容*/
	.content {
		padding: #{0 24upx};
		
		.price-total {
			margin: #{16upx 0 30upx 0};
			&.exchange {
				margin-top: #{6upx};
				margin-bottom: #{16upx};
			}
			.sales {
				font-size: #{20rpx};
				margin-left:#{12rpx};
			}
            .sales-box {
                color: #999999;
				.sales {
					margin-left: 0;
				}
            }
			.price {
				font-size: #{28rpx};
			}
		}
		/*会员价组件*/
		.member-price {
			margin-top: #{12upx};
		}
		
		/*超级会员卡组件*/
		.app-sup-vip {
			margin-top: #{9upx};
		}
		
	}
	
	/*默认文字颜色*/
	.default-color {
		color: #ff4544;
	}

	.cart-box {
		width: #{92upx};
		height: #{92upx};
		position: absolute;
		padding: #{32upx};
		right: #{-24rpx};
		top: #{-60rpx};
	}
	.goods-cart {
		width: #{28rpx};
		height: #{28rpx};
	}
	.f-swipe-content {
		background-color: #ffffff;
		.f-item {
			padding: 24upx;
            border-bottom: 1upx solid #e2e2e2;
            position: relative;
            .f-img {
				width: 200upx;
				height: 200upx;
				border-radius: 23upx;
				margin-right: 24upx;
			}
            .f-out-dialog {
                width: 200upx;
                height: 200upx;
                border-radius: 23upx;
                margin-right: 24upx;
                position: absolute;
                z-index: 10;
                background-color: rgba(0,0,0,.5);
                image {
                    width: #{200upx};
                    height: #{200upx};
                }
            }
			.f-content {
				width: 478upx;
			}
			.f-title {
				font-size: 26upx;
                line-height: 36upx;
				color: #353535;
			}
			.f-invalid {
				width: 128upx;
				height: 42upx;
				line-height: 42upx;
				background-color: #f7f7f7;
				padding: 0 27upx 0 18upx;
				>text {
					font-size: 23upx;
					color: #999999;
				}
				>image {
					width: 24upx;
					height: 24upx;
				}
			}
			.f-low-stock {
				width: 148upx;
				height: 42upx;
				line-height: 42upx;
				background-color: #ffecec;
				padding: 0 27upx 0 18upx;
				>text {
					font-size: 23upx;
					color: #ff4544;
				}
				>image {
					width: 24upx;
					height: 24upx;
				}
			}
			.f-low-price {
				height: 42upx;
				display: inline-block;
				background-color: #ffecec;
				padding: 0 27upx 0 18upx;
				position: relative;
				>text {
					font-size: 23upx;
					color: #ff4544;
				}
				>image {
					width: 24upx;
					margin-right: 14upx;
					height: 24upx;
				}
			}
			.f-cat-icon {
				width: 56upx;
				height: 56upx;
			}
			.f-price {
				font-size: 24upx;
				margin-top: 12upx;
			}
			.f-scale {
				font-size: 21upx;
				color: #b0b0b0;
			}
		}
	}

    .origin-price {
        font-size: 21upx;
        color: #999999;
        text-decoration:line-through;
    }
</style>