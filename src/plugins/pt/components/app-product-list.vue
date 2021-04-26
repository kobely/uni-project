<template>
    <view>
        <view class="bd-item dir-left-nowrap" :class="{'bd-item-border': index !== list.length - 1}" v-for="(item, index) in list" :key="index" @click="route_go(item)">
            <view class="out-dialog" v-if="item.goods_stock === 0 && appSetting.is_show_stock === 1">
                <image :src="appSetting.is_use_stock == 1 ? appImg.plugins_out : appSetting.sell_out_pic"></image>
            </view>
            <image class="bd-image" :src="item.cover_pic"></image>
            <view class="bd-content dir-top-nowrap main-between cross-top">
                <view>
                    <view class="bd-name u-line-2">{{item.name}}</view>
                    <view class="app-group" :style="{'color': theme.color}">已团{{item.sales}}件</view>
                </view>
                <view class="app-price-button dir-left-nowrap main-between cross-bottom">
                    <view class="price dir-top-nowrap main-right">
                        <view class="member-price" v-if="item.is_level === 1 && item.level_price != -1" >
                            <app-member-price :theme="theme" :price="item.level_price"></app-member-price>
                        </view>
                        <view v-if="item.vip_card_appoint.discount" class="sup-vip">
                            <app-sup-vip :is_vip_card_user="item.vip_card_appoint.is_vip_card_user"  :discount="item.vip_card_appoint.discount"></app-sup-vip>
                        </view>
                        <view class="app-price dir-left-nowrap cross-bottom">
                            <text class="app-symbol app-now-price" :style="{'color': theme.color}" v-if="item.price > 0">{{item.price}}</text>
                            <text class="app-now-price" :style="{'color': theme.color}" v-else>免费</text>
                            <text class="app-symbol app-old-price">{{item.original_price}}</text>
                        </view>
                    </view>
                    <view v-if="item.goods_stock > 0" class="app-button" :style="{'background-color': item.buy_goods_auth ? theme.background : '#999999','color': item.buy_goods_auth ? theme.main_text : ''}">去开团</view>
                    <view v-else style="background: #DCDCDC;color: #fff" class="app-button">已售罄</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {mapState, mapGetters} from 'vuex';

    export default {
        name: 'app-product-list',
        computed: {
            ...mapState({
                appSetting: state => state.mallConfig.mall.setting,
                appImg: state => state.mallConfig.__wxapp_img.mall,
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            }),
            // #ifndef MP-BAIDU
            ...mapGetters('mallConfig',{
                getVideo: 'getVideo'
            }),
            // #endif
        },
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            },
            theme: Object
        },
		data() {
			return {
				disable: 'disable'
			};
		},

        methods: {
            route_go(data) {
                // #ifndef MP-BAIDU
                if (data.video_url && this.getVideo == 1) {
                    // #ifdef MP
                    uni.navigateTo({
                        url: `/pages/goods/video?goods_id=${data.id}&sign=pintuan`
                    });
                    // #endif

                    // #ifdef H5
                    uni.navigateTo({
                        url: `/plugins/pt/goods/goods?goods_id=${data.id}`,
                    });
                    // #endif
                } else {
                    uni.navigateTo({
                        url: `/plugins/pt/goods/goods?goods_id=${data.id}`,
                    });
                }
                // #endif

                // #ifdef MP-BAIDU
                uni.navigateTo({
                    url: `/plugins/pt/goods/goods?goods_id=${data.id}`,
                });
                // #endif
            }
        }
    }
</script>

<style scoped lang="scss">
        .bd-item-border {
            border-bottom: #{1rpx} solid #e2e2e2;
        }
        .out-dialog {
            width: #{220rpx};
            height: #{220rpx};
            position: absolute;
            z-index: 10;
            background-color: rgba(0,0,0,.5);
            image {
                width: #{220rpx};
                height: #{220rpx};
            }
        }
        .bd-image {
            width: #{220rpx};
            height: #{220rpx};
            border-radius: #{4rpx};
        }
        .bd-name {
            font-size: #{28rpx};
            color: #353535;
            margin-top: #{5rpx};
        }
        .bd-item {
            padding: #{24rpx 24rpx 14rpx 24rpx};
            background-color: #ffffff;
            position: relative;
			.bd-content {
				width: #{458rpx};
				margin-left: #{24rpx};
				position: relative;
				.app-group {
					font-size: #{22rpx};
                    margin-bottom: 5upx;
                    margin-top: -3upx;
				}
				.app-price-button {
					position: absolute;
					bottom: #{10rpx};
					width: #{458rpx};
                    padding-top: 5rpx;
					.price {
						width: #{458-180rpx};
						height: #{105rpx};
					}
					.app-button {
						font-size: #{26rpx};
						color: #ffffff;
						width: #{180rpx};
						height: #{64rpx};
						line-height: #{64rpx};
						text-align: center;
						/* #ifndef MP-TOUTIAO */
						padding: 0 #{49rpx};
						/* #endif */
						border-radius: #{32rpx};
					}
					.default-button {
						background: linear-gradient(140deg, #ffa360, #ff5c5c);
					}
					.app-now-price {
						font-size: #{30rpx};
						margin-right: #{12rpx};
					}
					.app-old-price {
						font-size: #{25rpx};
						color: #999999;
						text-decoration:line-through;
					}
					.app-symbol:before {
						content: '￥';
						font-size: #{16rpx};
					}
				}
			}
		}
    .member-price {
        margin-top: 5upx;
    }
    .sup-vip {
        margin-top: 5upx;
    }
</style>