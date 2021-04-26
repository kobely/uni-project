<template>
	<view class="app-mode" :class="{'app-show': display}">
		<view class="app-content">
			<view class="app-top">
				<view class="app-content-image">
					<image class="app-image" :src="coverPic"></image>
				</view>
				<view class="app-number dir-top-nowrap">
					<text class="app-price">￥{{price}}</text>
					<text>库存: {{goodsNum}}</text>
				</view>
				<view class="app-close" @click.stop="close"></view>
			</view>
			<view class="app-center">
				<view class="app-attr dir-top-nowrap main-center" v-for="(item, index) in attrGroup" :key="index">
					<text>{{item.attr_group_name}}</text>
					<view class="dir-left-nowrap main-left">
						<view class="app-item" v-for="(attr, num) in item.attr_list" :key="num" :class="{'app-attr-index': attrIndex === index}">{{attr.attr_name}}</view>
					</view>
				</view>
				<view class="app-add-subtract dir-left-nowrap main-between cross-center">
					<text>数量</text>
					<view class="app-input dir-left-nowrap main-between cross-center">
						<view class="app-icon" @click="subtract">-</view>
						<input type="number" v-model="number">
						<view class="app-icon" @click="add">+</view>
					</view>
				</view>
			</view>
			<view class="app-bottom dir-left-nowrap">
				<view>
					<app-form-id>
						<button class="app-add">加入购物车</button>
					</app-form-id>
				</view>
				<view>
					<app-form-id @click="jumpGo">
						<button class="app-buy">立即购买</button>
					</app-form-id>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
    export default {
        name: 'app-model',
        props: {
            value: {
                type: Boolean,
                default: function() {
                    return true;
                }
            },
            attrGroup: {
                type: Array,
	            default: function() {
	                return [];
	            }
            },
            coverPic: {
                type: String,
	            default: function() {
	                return 'http://matianxia.oss-cn-qingdao.aliyuncs.com/uploads/20190511/0f724bf010aebf9a999ac39beb44eadf.jpg?x-oss-process=style/q90';
	            }
            },
            price: {
                type: String,
	            default: function() {
	                return '100.5';
	            }
            },
            goodsNum: {
                type: Number,
	            default: function() {
	                return 0;
	            }
            }
        },
        data() {
            return {
                display: this.value,
                number: 1
            }
        },
        methods: {
            close() {
                this.display = false;
                this.$emit('input', this.display);
            },
            jumpGo() {
                this.$jump({
	                open_type: 'navigate',
	                url: '/pages/index/index'
                })
            },
            subtract() {
                if (this.number !== 0) {
                    this.number--;
                }
            },
	        add() {
                this.number++;
	        }
        },
        watch: {
            value: function() {
                this.display = this.value;
            }
        }
    }
</script>

<style scoped lang="scss">
	.app-mode {
		position: fixed;
		z-index: 1600;
		top: 0;
		left: 0;
		width: #{750rpx};
		height: 100%;
		background-color:rgba(127, 127, 127, 0.4);
		transition: all 0.2s linear;
		visibility: hidden;
		opacity: 0;
		overflow: hidden;
		.app-content {
			position: absolute;
			bottom: 0;
			background-color: white;
			.app-top {
				width: $screen-width;
				height: #{142rpx};
				padding: 0 #{24rpx};
				background-color: white;
				border-bottom: #{1rpx} solid #e2e2e2;
				position: relative;
				.app-content-image {
					width: #{200rpx};
					height: #{205rpx};
					background-color: white;
					position: absolute;
					top: #{-63rpx};
					border-top-left-radius: #{20rpx};
					border-top-right-radius: #{20rpx};
					.app-image {
						width: #{192rpx};
						height: #{188rpx};
						margin-top: #{8rpx};
						margin-left: #{4rpx};
						margin-right: #{4rpx};
						border-bottom-left-radius: #{20rpx};
						border-bottom-right-radius: #{20rpx};
					}
				}
				.app-number {
					width: #{446rpx};
					height: 100%;
					position: absolute;
					left: #{224rpx};
					padding-top: #{49rpx};
					padding-left: #{24rpx};
					text {
						font-size: #{24rpx};
						color: #666666;
					}
					.app-price {
						color: #ff4544;
						margin-bottom: #{18rpx};
					}
				}
				.app-close {
					width: #{23rpx};
					height: #{23rpx};
					background-image: url("./image/close.png");
					background-size: cover;
					background-repeat: no-repeat;
					position: absolute;
					right: #{26rpx};
					top: #{20rpx};
				}
			}
			.app-bottom {
				width: 100%;
				height: #{110rpx};
				>view {
					width: 50%;
					height: 100%;
					button {
						width: 100%;
						height: 100%;
						line-height: #{110rpx};
						border: none;
						font-size: #{28rpx};
						color:white;
						border-radius: 0;
					}
					button:after {
						display: none;
					}
					
					.app-add {
						background-color: #f39800;
					}
					.app-add:active {
						background-color: #f39800;
					}
					.app-buy {
						background-color: #ff4544;
					}
					.app-buy:active {
						background-color: #ff4544;
					}
				}
			}
			.app-center {
				width: 100%;
				padding: 0 #{24rpx};
				.app-add-subtract {
					border-top: #{1rpx} solid #e2e2e2;
					height: #{124rpx};
					width: 100%;
					text {
						height: #{23rpx};
						color: #666666;
					}
					.app-input {
						width: #{182rpx};
						height: #{26rpx};
						input {
							font-size: #{20rpx};
							text-align: center;
							width: #{130rpx};
						}
						.app-icon {
							width: #{26rpx};
							height: #{26rpx};
							font-size: #{35rpx};
							text-align: center;
							line-height: #{26rpx};
							font-weight: bold;
							color: #999999;
						}
						
					}
				}
				.app-attr {
					width: 100%;
					height: #{160rpx};
					.app-item {
						color: #5e5e5e;
						background-color: white;
						height: #{57rpx};
						padding: 0 #{24rpx};
						line-height: #{57rpx};
						border-radius: #{10rpx};
						
					}
					.app-attr-index {
						background-color: #ff4544;
						color: white;
					}
					text {
						font-size: #{23rpx};
						color: #666666;
					}
				}
			}
		}
	}
	.app-show {
		opacity: 1;
		visibility: visible;
	}
</style>