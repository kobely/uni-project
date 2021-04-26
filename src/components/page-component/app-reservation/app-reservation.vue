<!--预约-->
<template>
	<view class="app-reservation">
		<view class="app-list-mode" v-if="listStyle === -1">
			<view class="app-item dir-left-nowrap main-between cross-center" :class="{'app-border': goodsStyle === 2}" v-for="(item, index) in list" :key="index">
				<app-jump-button form>
					<image class="app-icon" lazy-load="true"  v-if="showGoodsTag" :src="goodsTagPicUrl"></image>
					<image class="app-image" lazy-load="true" :src="item.cover_pic" :mode="fill === 1 ? 'scaleToFill' : fill === 0 ? 'aspectFit' : ''"></image>
					<view class="app-content" :class="{'app-name-padding': !showGoodsName}">
						<text class="app-name" v-if="showGoodsName">{{item.name}}</text>
						<view class="app-price-button dir-left-nowrap main-between cross-center">
							<text class="app-price">{{item.price_content ===  '￥0.00' ? '免费' : item.price_content}}</text>
							<button v-if="showBuyBtn" class="app-button"
							        :style="{
									        color: buyBtnStyle === 2 || buyBtnStyle === 4 ? buttonColor : 'white',
									        borderColor: buttonColor,
									        backgroundColor: buyBtnStyle === 1 || buyBtnStyle === 3 ? buttonColor : 'white',
								        }"
							        :class="{
									        'app-filling': buyBtnStyle === 1,
									        'app-line': buyBtnStyle === 2,
									        'app-fillet-fill': buyBtnStyle === 3,
									        'app-rounded-line': buyBtnStyle === 4
								        }"
							>{{buyBtnText}}</button>
						</view>
					</view>
				</app-jump-button>
			</view>
		</view>
		<view class="app-one-per-line" v-if="listStyle === 0">
			<view class="app-item dir-top-nowrap"
			      :class="{'app-border': goodsStyle === 2 || goodsStyle === 4}"
			      v-for="(item, index) in list"
			      :key="index"
			>
				<app-jump-button form arrangement="column">
					<image class="app-icon"
					       lazy-load="true"
					       v-if="showGoodsTag"
					       :src="goodsTagPicUrl"
					></image>
					<image class="app-image"
					       :class="{'app-image-square' : goodsCoverProportion === '1-1', 'app-image-rectangle': goodsCoverProportion === '3-2'}"
					       lazy-load="true"
					       :src="item.cover_pic"
					       :mode="fill === 1 ? 'scaleToFill' : fill === 0 ? 'aspectFit' : ''"
					></image>
					<text class="app-name"
					      v-if="showGoodsName"
					      :class="{'app-text-align': goodsStyle === 3 || goodsStyle === 4 }"
					>{{item.name}}</text>
					<view class="app-price-button dir-left-nowrap cross-center"
					      :class="{'main-between': goodsStyle === 1 || goodsStyle === 2, 'main-center': goodsStyle === 3 || goodsStyle === 4, 'app-margin-no-name': !showGoodsName}"
					>
						<view class="app-group-price">
							<text class="app-price">{{item.price_content ===  '￥0.00' ? '免费' : item.price_content}}</text>
						</view>
						<button class="app-button"
						        :style="{
							        color: buyBtnStyle === 2 || buyBtnStyle === 4 ? buttonColor : 'white',
							        borderColor: buttonColor,
							        backgroundColor: buyBtnStyle === 1 || buyBtnStyle === 3 ? buttonColor : 'white',
						        }"
						        :class="{
							        'app-filling': buyBtnStyle === 1,
							        'app-line': buyBtnStyle === 2,
							        'app-fillet-fill': buyBtnStyle === 3,
							        'app-rounded-line': buyBtnStyle === 4
						        }"
						        v-if="showBuyBtn && goodsStyle !== 3 && goodsStyle !== 4"
						>{{buyBtnText}}</button>
					</view>
				</app-jump-button>
			</view>
		</view>
		<view class="app-two-per-line dir-left-wrap" v-if="listStyle === 1">
			<view v-for="(item, index) in list"
			      :key="index"
			      class="app-item dir-top-nowrap"
			      :class="{'app-border': goodsStyle === 2 || goodsStyle === 4, 'app-item-margin': index%2 === 0}"
			>
				<app-jump-button form arrangement="column">
					<image class="app-icon"
					       lazy-load="true"
					       v-if="showGoodsTag"
					       :src="goodsTagPicUrl"
					></image>
					<image class="app-image"
					       lazy-load="true"
					       :src="item.cover_pic"
					       :mode="fill === 1 ? 'scaleToFill' : fill === 0 ? 'aspectFit' : ''"
					></image>
					<text class="app-name"
					      v-if="showGoodsName"
					      :class="{'app-text-align': goodsStyle === 3 || goodsStyle === 4 }"
					>{{item.name}}</text>
					<view class="app-group-price-button dir-left-nowrap" :class="{'main-center': goodsStyle === 3 || goodsStyle === 4, 'app-margin-no-name': !showGoodsName}">
						<view class="app-group-price dir-top-wrap main-center">
							<text class="app-price">{{item.price_content ===  '￥0.00' ? '免费' : item.price_content}}</text>
						</view>
						<button class="app-button"
						        :style="{
							        color: buyBtnStyle === 2 || buyBtnStyle === 4 ? buttonColor : 'white',
							        borderColor: buttonColor,
							        backgroundColor: buyBtnStyle === 1 || buyBtnStyle === 3 ? buttonColor : 'white',
						        }"
						        :class="{
							        'app-filling': buyBtnStyle === 1,
							        'app-line': buyBtnStyle === 2,
							        'app-fillet-fill': buyBtnStyle === 3,
							        'app-rounded-line': buyBtnStyle === 4
						        }"
						        v-if="showBuyBtn && goodsStyle !== 3 && goodsStyle !== 4">
							{{buyBtnText}}
						</button>
					</view>
				</app-jump-button>
			</view>
		</view>
		<app-load-text v-if="!request"></app-load-text>
	</view>
</template>

<script>

    export default {
        name: 'app-reservation',
        props: {
            buttonColor: {
                type: String,
                default: function() {
                    return "blue";
                }
            },
            buyBtnStyle: {
                type: Number,
                default: function() {
                    return 4;
                }
            },
            buyBtnText: {
                type: String,
                default: function() {
                    return "预约";
                }
            },
            customizeGoodsTag: {
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            fill: {
                type: Number,
                default: function() {
                    return 0;
                }
            },
            goodsCoverProportion: {
                type: String,
                default: function() {
                    return "3-2";
                }
            },
            goodsStyle: {
                type: Number,
                default: function() {
                    return 3;
                }
            },
            goodsTagPicUrl: {
                type: String,
                default: function() {
                    return "http://v4test2.zjhejiang.com/plugins/diy/assets/images/goods-tag-xp.png";
                }
            },
            list: {
                type: Array,
                default: function() {
                    return [
                    ];
                }
            },
            listStyle: {
                type: Number,
                default: function() {
                    return 1;
                }
            },
            showBuyBtn: {
                type: Boolean,
                default: function() {
                    return true;
                }
            },
            showGoodsName: {
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            showGoodsTag: {
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            scrollTop: {
                type: Number,
                default: function() {
                    return 0;
                }
            },
            value: {
                type: Boolean,
                default: function() {
                    return true;
                }
            }
        },
        data() {
            return {
                height: 0,
                request: this.value,
            }
        },
        created() {
            let that = this;
            wx.getSystemInfo({
                success: function(response) {
                    that.height = response.windowHeight
                }
            })
        },
        methods: {
            autoEnd() {
                this.$lazyLoadingData('app-reservation').then(response => {
                    if (response[0].height + response[0].top < this.height) {
                        this.request = false;
                        this.$emit('input', this.request);
                    }
                });
            }
        },
        watch: {
            scrollTop: {
                handler: function(n,o) {
                    if (n > o  &&  this.request) this.autoEnd();
                }
            }
        }
    }
</script>

<style scoped lang="scss">
	.app-reservation {
		width: #{750rpx};
		overflow: hidden;
	}
	.app-border {
		border-color: #e2e2e2 !important;
	}
	.app-list-mode {
		width: #{750rpx};
		.app-item {
			margin-top: #{15rpx};
			width: #{702rpx};
			margin-left: #{24rpx};
			margin-right: #{24rpx};
			height: #{200rpx};
			border-bottom-right-radius: #{20rpx};
			border-top-right-radius: #{20rpx};
			position: relative;
			padding-right: #{24rpx};
			border: #{1rpx} solid transparent;
			.app-icon {
				position: absolute;
				top: 0;
				left: 0;
				width: #{65rpx};
				height: #{55rpx};
			}
			.app-image {
				width: #{199rpx};
				height: #{199rpx};
				margin-right: #{33rpx};
			}
			.app-name-padding {
				padding-top: #{81rpx};
			}
			.app-content {
				width: #{446rpx};
				height: #{200rpx};
				border-bottom-right-radius: #{20rpx};
				border-top-right-radius: #{20rpx};
				.app-name {
					word-break: break-all;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-size: #{28rpx};
					color: #353535;
					line-height: #{28rpx};
					height: #{58rpx};
					width: #{702-199-33rpx};
					margin-top: #{23rpx};
				}
				.app-price-button {
					margin-top: #{38rpx};
					width: #{446rpx};
					height: #{48rpx};
					.app-price {
						display: inline-block;
						height: #{48rpx};
						line-height: #{48rpx};
						color: #ff4544;
						font-size: #{22rpx};
					}
					.app-button {
						display: inline-block;
						height: #{48rpx};
						line-height: #{48rpx};
						padding: 0 #{20rpx};
						font-size: #{28rpx};
						margin: 0;
						border: #{1rpx} solid #ff4544;
					}
					.app-button:after {
						display: none;
					}
					.app-filling {
						background-color: #ff4544;
						color: white;
					}
					.app-line {
						background-color: white;
						color: #ff4544;
					}
					.app-fillet-fill {
						background-color: #ff4544;
						color: white;
						border-radius: #{20rpx};
					}
					.app-rounded-line {
						background-color: white;
						color: #ff4544;
						border-radius: #{20rpx};
					}
				}
			}
		}
	}
	.app-one-per-line {
		width: #{750rpx};
		padding: #{2rpx} #{24rpx};
		.app-item {
			width: #{702rpx};
			position: relative;
			border: #{1rpx} solid transparent;
			margin-top: #{24rpx};
			border-bottom-right-radius: #{10rpx};
			border-bottom-left-radius: #{10rpx};
			overflow: hidden;
			.app-icon {
				position: absolute;
				top: 0;
				left: 0;
				width: #{65rpx};
				height: #{55rpx};
			}
			.app-image {
				width: #{702rpx};
			}
			.app-image-square {
				height: #{702rpx};
			}
			.app-image-rectangle {
				height: #{280.8rpx};
			}
			.app-name {
				word-break: break-all;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				width: #{702rpx};
				padding: 0 #{24rpx};
				margin-top: #{28rpx};
				font-size: #{26rpx};
				color: #353535;
			}
			.app-text-align {
				text-align: center;
			}
			.app-price-button {
				width: #{702rpx};
				padding: 0 #{24rpx};
				height: #{48rpx};
				margin-top: #{36rpx};
				margin-bottom: #{24rpx};
				.app-group-price {
					.app-price {
						font-size: #{22rpx};
						color: #ff4544;
					}
				}
				.app-margin-no-name {
					margin-top: #{92rpx};
				}
				.app-button {
					height: #{48rpx};
					padding: 0 #{20rpx};
					font-size: #{26rpx};
					line-height: #{48rpx};
					margin: 0;
					border-radius: 0;
					border: #{1rpx} solid #ff4544;
				}
				.app-button:after {
					display: none;
				}
				.app-filling {
					background-color: #ff4544;
					color: white;
				}
				.app-line {
					background-color: white;
					color: #ff4544;
				}
				.app-fillet-fill {
					background-color: #ff4544;
					color: white;
					border-radius: #{20rpx};
				}
				.app-rounded-line {
					background-color: white;
					color: #ff4544;
					border-radius: #{20rpx};
				}
			}
		}
	}
	.app-two-per-line {
		width: #{750rpx};
		padding: #{2rpx} #{24rpx};
		.app-item {
			width: #{346rpx};
			height: #{534rpx};
			border-bottom-left-radius: #{10rpx};
			border-bottom-right-radius: #{10rpx};
			border: #{1rpx} solid transparent;
			overflow: hidden;
			position: relative;
			margin-top: #{24rpx};
			margin-bottom: #{24rpx};
			padding-bottom: #{24rpx};
			.app-icon {
				position: absolute;
				top: 0;
				left: 0;
				width: #{65rpx};
				height: #{55rpx};
			}
			.app-image {
				width: #{346rpx};
				height: #{346rpx};
			}
			.app-name {
				word-break: break-all;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				margin-top: #{24rpx};
				padding: 0 #{24rpx};
				font-size: #{25rpx};
				width: #{346rpx};
				height: #{49rpx};
				line-height: #{25rpx};
				color: #353535;
			}
			.app-margin-no-name {
				margin-top: #{24+49rpx};
			}
			.app-text-align {
				text-align: center;
			}
			.app-group-price-button {
				width: #{346rpx};
				padding: 0 #{24rpx};
				height: #{36+48rpx};
				position: relative;
				.app-group-price {
					height: #{36+48rpx};
					.app-fight-group {
						display: inline-block;
						height: #{30rpx};
						border-radius: #{10rpx};
						border: #{1rpx} solid #ff4544;
						font-size: #{20rpx};
						line-height: #{30rpx};
						text-align: center;
						padding: 0 #{13rpx};
						color: #ff4544;
						margin-top: #{16rpx};
					}
					.app-price {
						font-size: #{20rpx};
						color: #ff4544;
						/* #ifndef MP-BAIDU || MP-WEIXIN */
						margin-top: #{13rpx};
						/* #endif */
						/* #ifdef MP-BAIDU */
						margin-top: #{10rpx};
						/* #endif */
						/* #ifdef MP-WEIXIN */
						margin-top: #{11rpx};
						/* #endif */
					}
				}
				.app-button {
					display: inline-block;
					margin: #{36rpx} 0 0 0;
					padding: 0 #{10rpx};
					min-width: #{120rpx};
					height: #{48rpx};
					font-size: #{26rpx};
					line-height: #{48rpx};
					border-radius: 0;
					border: #{1rpx} solid #ff4544;
					position: absolute;
					right: #{24rpx};
				}
				.app-button:after {
					display: none;
				}
				.app-filling {
					background-color: #ff4544;
					color: white;
				}
				.app-line {
					background-color: white;
					color: #ff4544;
				}
				.app-fillet-fill {
					background-color: #ff4544;
					color: white;
					border-radius: #{20rpx};
				}
				.app-rounded-line {
					background-color: white;
					color: #ff4544;
					border-radius: #{20rpx};
				}
			}
		}
		.app-item-margin {
			margin-right: #{10rpx};
		}
	}
</style>