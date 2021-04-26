<!--秒杀-->
<template>
	<view class="app-spike">
		<view class="app-list-mode" v-if="listStyle === -1">
			<view class="app-item dir-left-nowrap main-between cross-center" :class="{'app-border': goodsStyle === 2}" v-for="(item, index) in list" :key="index">
				<app-jump-button form>
					<image class="app-icon" lazy-load="true"  v-if="showGoodsTag" :src="goodsTagPicUrl"></image>
					<image class="app-image" lazy-load="true" :src="item.cover_pic" :mode="fill === 1 ? 'scaleToFill' : fill === 0 ? 'aspectFit' : ''"></image>
					<view class="app-content" :class="{'app-name-padding': !showGoodsName}">
						<text class="app-name"  v-if="showGoodsName" :class="{'app-icon-margin' : !beforeStarting(item.start_time, item.end_time)}">
							<text class="app-spike-name">秒杀</text>
							{{item.name}}
						</text>
						<view class="app-icon-v dir-left-nowrap main-left cross-center" v-if="beforeStarting(item.start_time, item.end_time)">
							<icon class="app-icon-time" type></icon>
							<template v-if="startOrEnd(item.start_time, item.end_time) === 's'">
							<text class="app-text">距开始</text>
							<app-timer color="#ff4544" fontSize="24" :startTime="item.start_time"></app-timer>
							</template>
							<template v-if="startOrEnd(item.start_time, item.end_time) === 'e'">
							<text class="app-text">距结束</text>
							<app-timer color="#ff4544" fontSize="24"  :startTime="item.end_time"></app-timer>
							</template>
						</view>
						<view class="app-price-button dir-left-nowrap main-between cross-center">
							<view class="app-price dir-top-nowrap">
								<text class="app-new-price">￥{{item.price}}</text>
								<text class="app-original-price">￥{{item.original_price}}</text>
							</view>
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
		<view class="app-one-per-line" v-if="listStyle === 1">
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
					<view class="app-spike-view dir-left-nowrap main-between cross-center" v-if="beforeStarting(item.start_time, item.end_time)"
					      :class="{'app-view-square': goodsCoverProportion === '1-1', 'app-view-rectangle': goodsCoverProportion === '3-2'}"
					>
						<text class="app-spike-name">秒杀</text>
						<view class="app-right-spike">
							<template v-if="startOrEnd(item.start_time, item.end_time) === 's'">
								<text class="app-text">距开始</text>
								<app-timer color="white" fontSize="24" :startTime="item.start_time"></app-timer>
							</template>
							<template v-if="startOrEnd(item.start_time, item.end_time) === 'e'">
								<text class="app-text">距结束</text>
								<app-timer color="white" fontSize="24"  :startTime="item.end_time"></app-timer>
							</template>
						</view>
					</view>
					<text class="app-name"
					      v-if="showGoodsName"
					      :class="{'app-text-align': goodsStyle === 3 || goodsStyle === 4 }"
					>{{item.name}}</text>
					<view class="app-price-button dir-left-nowrap cross-center"
					      :class="{'main-between': goodsStyle === 1 || goodsStyle === 2, 'main-center': goodsStyle === 3 || goodsStyle === 4, 'app-margin-no-name': !showGoodsName}"
					>
						<view class="app-group-price dir-top-nowrap">
							<text class="app-new-price">￥{{item.price}}</text>
							<text class="app-original-price">￥{{item.original_price}}</text>
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
		<view class="app-two-per-line dir-left-wrap" v-if="listStyle === 2">
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
					<view class="app-spike-view dir-left-nowrap main-center cross-center" v-if="beforeStarting(item.start_time, item.end_time)">
						<template v-if="startOrEnd(item.start_time, item.end_time) === 's'">
							<text class="app-text">距开始</text>
							<app-timer color="white" fontSize="24" :startTime="item.start_time"></app-timer>
						</template>
						<template v-if="startOrEnd(item.start_time, item.end_time) === 'e'">
							<text class="app-text">距结束</text>
							<app-timer color="white" fontSize="24"  :startTime="item.end_time"></app-timer>
						</template>
					</view>
					<text class="app-name"
					      v-if="showGoodsName"
					      :class="{'app-text-align': goodsStyle === 3 || goodsStyle === 4 }"
					>
						<text class="app-spike-name">秒杀</text>
						{{item.name}}
					</text>
					<view class="app-group-price-button dir-left-nowrap" :class="{'main-center': goodsStyle === 3 || goodsStyle === 4}">
						<view class="app-group-price dir-top-nowrap">
							<text class="app-new-price">￥{{item.price}}</text>
							<text class="app-original-price">￥{{item.original_price}}</text>
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
	import appTimer from '../../basic-component/app-timer/app-timer.vue';
	import { mapState } from 'vuex';
	
    export default {
        name: 'app-group-goods',
        components: {
	        'app-timer': appTimer
        },
	    computed: {
            ...mapState({
                height : state=>state.gConfig.systemInfo.windowHeight
            })
	    },
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
                    return 3;
                }
            },
            buyBtnText: {
                type: String,
                default: function() {
                    return "马上秒";
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
                    return 1;
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
                    return 2;
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
                    return true;
                }
            },
            showGoodsTag: {
                type: Boolean,
                default: function() {
                    return true;
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
                request: this.value,
            }
        },
        methods: {
            autoEnd() {
                this.$lazyLoadingData('app-spike').then(response => {
                    if (response[0].height +response[0].top < this.height) {
                        this.request = false;
                        this.$emit('input', this.request);
                    }
                });
            },
            beforeStarting(start, end) {
                let now = new Date();
                let s = new Date(start.replace(/-/g, '/'));
                let e = new Date(end.replace(/-/g, '/'));
                if (now > s) {
                    if (now < e) {
                        return true;
                    } else {
                        return false
                    }
                } else {
                    return true;
                }
            },
            startOrEnd(start, end) {
                let now = new Date();
                let s = new Date(start.replace(/-/g, '/'));
                let e = new Date(end.replace(/-/g, '/'));
                if (now > s) {
                    if (now < e) {
                        return 'e';
                    }
                } else {
                    return 's';
                }
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
	.app-spike {
		width: $screen-width;
		overflow: hidden;
		background-color: white;
	}
	.app-border {
		border-color: #e2e2e2 !important;
	}
	.app-list-mode {
		width: $screen-width;
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
					/* #ifndef MP-WEIXIN */
					line-height: #{30rpx};
					/* #endif */
					/* #ifdef MP-WEIXIN */
					line-height: #{28rpx};
					/* #endif */
					height: #{58rpx};
					width: #{702-199-33rpx};
					margin-top: #{23rpx};
					.app-spike-name {
						display: inline-block;
						font-size: #{22rpx};
						width: #{64rpx};
						height: #{28rpx};
						line-height: #{28rpx};
						margin-right: #{8rpx};
						color: #ff4544;
						background-color: #feeeee;
						border-radius: #{14rpx};
					}
				}
				.app-icon-margin {
					margin-bottom: #{51rpx};
				}
				.app-icon-v {
					width: #{446rpx};
					height: #{35rpx};
					line-height: #{35rpx};
					margin-top: #{16rpx};
					.app-icon-time {
						width: #{24rpx};
						height: #{24rpx};
						background-size: 100% 100%;
						background-repeat: no-repeat;
						background-image: url("../../../static/image/icon/time.png");
						margin-right: #{12rpx};
					}
					.app-text {
						font-size: #{24rpx};
						color: #999999;
						margin-right: #{12rpx};
					}
				}
				.app-price-button {
					margin-top: #{3rpx};
					width: #{446rpx};
					height: #{48rpx};
					.app-price {
						height: #{68rpx};
						padding-top: #{10rpx};
						.app-original-price {
							text-decoration: line-through;
							font-size: #{22rpx};
							color: #999999;
						}
						.app-new-price {
							font-size: #{28rpx};
							color: #ff4544;
						}
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
			.app-spike-view {
				height: #{80rpx};
				width: #{702rpx};
				position: absolute;
				left: 50%;
				transform: translate(-50%, -100%);
				background: linear-gradient(to right, #ff4544, #ff8b8b);
				color: white;
				padding: 0 #{24rpx};
				.app-spike-name {
					font-size: #{32rpx};
				}
				.app-right-spike {
					line-height: #{32rpx};
					.app-text {
						font-size: #{24rpx};
						margin-right: #{12rpx};
					}
				}
			}
			.app-view-square {
				top: #{702rpx};
			}
			.app-view-rectangle {
				top: #{280.8rpx};
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
					.app-new-price {
						font-size: #{24rpx};
						color: #ff4544;
					}
					.app-original-price {
						font-size: #{22rpx};
						color: #999999;
						text-decoration: line-through;
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
			.app-spike-view {
				width: #{346rpx};
				height: #{44rpx};
				position: absolute;
				top: #{346rpx};
				left: 50%;
				transform: translate(-50%, -100%);
				background: linear-gradient(to right, #ff4544, #ff8b8b);
				.app-text {
					font-size: #{24rpx};
					margin-right: #{6rpx};
					color: white;
				}
				/deep/ text {
					line-height: #{47rpx};
				}
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
				.app-spike-name {
					display: inline-block;
					color: #ff4544;
					font-size: #{20rpx};
					height: #{26rpx};
					line-height: #{26rpx};
					width: #{64rpx};
					text-align: center;
					background-color: #feeeee;
					margin-right: #{12rpx};
				}
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
					padding-top: #{36rpx};
					.app-new-price {
						font-size: #{22rpx};
						color: #ff4544;
					}
					.app-original-price {
						font-size: #{18rpx};
						color: #999999;
						text-decoration: line-through;
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