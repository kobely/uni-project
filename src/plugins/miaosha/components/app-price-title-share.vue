<template>
	<view class="app-price-title-share">
		<view class="app-name">{{name}}</view>
		<view v-if="subtitle" class="app-subtitle">
			<view class="t-omit-three">{{subtitle}}</view>
		</view>
		<view class="app-content dir-left-nowrap main-between">
			<view class="app-price">
				<view v-if="level_show === 1" class="dir-left-nowrap main-left cross-bottom">
					<text class="app-member-price" :style="{'color': theme.color}">{{priceMember}}</text>
					<text class="app-member-icon" :style="{'color': theme.color, 'border-color': theme.border}">会员价</text>
                    <app-sup-vip :is_vip_card_user="is_vip_card_user" margin="0 0 10rpx 13rpx" v-if="discount" :discount="discount"></app-sup-vip>
				</view>
				<view class="cross-bottom dir-left-nowrap" v-else>
					<text class="app-unmember-price" :style="{'color': theme.color}">{{price}}</text>
                     <app-sup-vip :is_vip_card_user="is_vip_card_user" margin="0 0 10rpx 13rpx" v-if="discount" :discount="discount"></app-sup-vip>
				</view>
				<view class="app-original-price">
					<text v-if="level_show != 1" class="app-p">￥{{original_price}}</text>
					<text v-else class="app-miaosha" :style="{'color': theme.color}">￥{{price}}</text>
					<text v-if="isSales == 1">销量 {{miaosha_buy_count}}{{unit}}</text>
				</view>
			</view>
			<view class="app-share">
				<app-form-id @click="shareShow = true">
					<image class="app-icon" src="../../../static/image/icon/icon-share.png"></image>
					<text class="app-text">分享</text>
				</app-form-id>
			</view>
		</view>
		<view>
			<app-share-qr-code v-model="shareShow"
                               :url="url"
                               :poster-config="posterConfig"
                               :poster-generate="posterGenerate"
                               :has-poster-nav="hasPosterNav"
            ></app-share-qr-code>
		</view>
	</view>
</template>

<script>
    import appShareQrCode from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
    import { mapState } from "vuex";

    export default {
        name: 'app-price-title-share',
	    data() {
            return {
                shareShow: false,
            }
	    },
	    props: {
            posterConfig: String,
            posterGenerate: String,
            hasPosterNav: {
                type: Boolean,
                default() {
                    return false
                },
            },
            is_vip_card_user:  {
                type: Number,
                default() {
                    return 0;
                }
            },
            discount: {
                type: String,
                default() {
                    return null;
                }
            },
            name: {
                type: String,
            },
			// 副标题
			subtitle: {
				type: String,
			},
            original_price:{
                type: String,
            },
            price_max: {
                type: Number
            },
            price_min:{
                type: Number
            },
            price_member_max:{
                type: Number
            },
            price_member_min: {
                type: Number
            },
            level_show: {
                type: Number
            },
            url: {
                type: String,
            },
            miaosha_buy_count: {
                type: Number,
            },
            unit: {
                type: String,
            },
			theme: {
				type: Object,
			}
	    },
	    computed: {
            priceMember: function() {
                if (this.price_member_min === this.price_member_max) {
                    return this.price_member_min;
                } else if (this.price_member_min !== this.price_member_max && this.price_member_max !== 0) {
                    return `${this.price_member_min}~${this.price_member_max}`
                } else if (this.price_member_max=== 0) {
                    return '免费';
                }
            },
		    price: function() {
                if (this.price_min === this.price_max) {
                    return this.price_min;
                } else if (this.price_min !== this.price_max && this.price_max !== 0) {
                    return `${this.price_min}~${this.price_max}`
                } else if (this.price_max === 0) {
                    return '免费';
                }
		    },
            ...mapState({
                isUnderlinePrice: state => state.mallConfig.mall.setting.is_underline_price,
				isSales: state => state.mallConfig.mall.setting.is_sales,
            }),
	    },
        components: {
            'app-share-qr-code': appShareQrCode
        }
    }
</script>

<style scoped lang="scss">
	.app-price-title-share {
		width: #{750rpx};
		background-color: white;
		padding: #{24rpx} #{24rpx} #{5rpx} #{24rpx};
		.app-name {
			width: #{702rpx};
			max-height: #{70rpx};
			line-height: #{35rpx};
			font-size: #{30rpx};
			color: #353535;
			word-break: break-all;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.app-subtitle {
	        margin-top: #{18rpx};
	        font-size: 24rpx;
	        background-color: #ffffff;
	        color: #999999;
		}
		.app-content {
			width: #{702rpx};
			.app-price {
				padding-top: #{20rpx};
				.app-member-price:before {
					content: '￥';
					font-size: #{32rpx};
				}
				.app-unmember-price:before {
					content: '￥';
					font-size: #{23rpx};
				}
				.app-unmember-price {
					font-size: #{40rpx};
				}
				.origin-price {
					color: #ff5c5c !important;
				}
				.app-member-price {
					font-size: #{56rpx};
					margin-right: #{13rpx};
					font-family: DIN;
				}
				.app-original-price {
					font-size: #{28rpx};
					color: #999;
					.app-miaosha {
						font-size: #{30rpx};
						font-family: DIN;
						margin-right: #{20rpx};
					}
					.app-p {
						text-decoration: line-through;
						margin-right: #{17rpx};
						font-size: #{24rpx};
					}
				}

			}
			.app-share {
				width: #{40rpx};
				height: #{136rpx};
				position: relative;
				.app-icon {
					width: #{40rpx};
					height: #{40rpx};
				}
				.app-text {
					color: #666666;
					font-size: #{20rpx};
					position: absolute;
					top: #{50rpx};
					left: 0;
				}
			}
		}
	}
	.app-member-icon {
		display: inline-block;
		width: #{67rpx};
		height: #{28rpx};
		line-height: #{24rpx};
		text-align: center;
		border: #{1upx} solid;
		border-radius: #{5rpx};
		font-size: #{18rpx};
		margin-bottom: #{10rpx};
	}
</style>