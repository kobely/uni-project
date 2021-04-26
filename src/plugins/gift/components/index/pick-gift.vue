<template>
	<view>
		<view v-bind:class="['page-width', 'figure-rule', 'component-height', `${theme}-figure-rule`]">
			<image
				class="page-width component-height background-image"
				src="/plugins/gift/image/head-texture-background.png"
			></image>
			<view class="page-width text-content component-height dir-left-nowrap">
				<view class="figure box-grow-0 dir-top-nowrap">
					<view class="box-grow-0 big-text text-color">表达心意新方式</view>
					<view class="box-grow-0 small-text text-color">
						·&nbsp;网上送礼&nbsp;&nbsp;&nbsp;·&nbsp;对方填地址&nbsp;&nbsp;&nbsp;·&nbsp;支持转赠
					</view>
				</view>
				<view class="rule box-grow-0">
					<view class="identification" @click="routeRule()">
						规则
					</view>
				</view>
			</view>
		</view>
		<view class="pick-gift radius-back-color" :class="{'pick-gift-height': gift_list.length === 0}">
			<view
					v-if="gift_list.length === 0"
					class="selection-box radius-back-color dir-left-nowrap cross-center"
					@click="routeGo(`/plugins/gift/list/list`)"
			>
				<image class="gift-box" src="/plugins/gift/image/gift-box.png"></image>
				<view class="guided-text">
					<view class="big-text" :class="[`${theme}-color`]">
						挑选礼物
					</view>
					<view class="small-text">
						点击这里开始挑选心仪礼物
					</view>
				</view>
				<image class="guide" src="/static/image/icon/arrow-right.png"></image>
			</view>
			<view v-else class="page-width cart">
				<view class="page-width item dir-left-nowrap" v-for="(item, key) in gift_list" :key="key">
					<image class="pic" :src="item.pic_url"></image>
					<view class="content dir-top-nowrap main-left">
						<text class="name black t-omit">{{item.name}}</text>
						<view class="attr t-omit">
							{{item.attr_str}}
						</view>
						<view class="price-button dir-left-nowrap cross-center main-between">
							<text :class="[`${theme}-color`, `price`, `t-omit`]">{{item.total_cost}}</text>
							<view class="number-button dir-left-nowrap cross-center main-between">
								<button :disabled="item.number == 0" class="btn btn-left" plain @click="changeNumber(false, key)">
									-
								</button>
								<input @input="changeIndex(key)" @confirm="changeInput" @blur="changeInput" class="input black" v-model="item.number" type="number">
								<button class="btn btn-right" :class="item.number == item.attr.stock ? 'disabled' : ''" plain @click="changeNumber(true, key)" v-bind:disabled="item.number == item.attr.stock">
									+
								</button>
							</view>
						</view>
					</view>
				</view>
				<view class="page-width total-content dir-left-nowrap cross-center main-between">
					<text class="number">共{{gift_list | getGiftNumber}}件礼物</text>
					<view @click="routeGo(`/plugins/gift/list/list`)" :class="[`again`, `${theme}-background`]">继续添加</view>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
    export default {
        name: 'pick-gift',

        props: {
			theme: String,
			gift_list: Array,
        },

        data() {
            return {
                index: -1,
            }
        },

	    methods: {
            
            // 加减改变数量
            changeNumber(status, index) {
                let quantity = 0;
                status ? quantity = 1 : quantity = -1;
                this.$emit('giftNumber', {
                    index: index, quantity: quantity, type : status
                });
            },

		    // input改变数量
            changeInput(e) {
                this.$emit('giftInput', {
                    index: this.index, quantity: Number(e.detail.value)
                });
            },
			
		    // input获取下标
            changeIndex(index) {
                this.index = index;
            },

		    // 跳转到商品列表
            routeGo(data) {
                uni.navigateTo({
	                url: data,
                })
            },
			routeRule() {
				uni.navigateTo({
					url: `/pages/rules/index?url=${encodeURIComponent(this.$api.gift.config)}&key=explain`
				});
			}
	    },
	    
	    filters: {
            getGiftNumber(data) {
                let number = 0;
                for (let i = 0; i < data.length; i++) {
                    number += Number(data[i].number);
                }
                return number;
            }
	    }
    }
</script>

<style scoped lang="scss">
	@import '../../css/gift.scss';
	
	.pick-gift {
		margin: #{0 24upx};
		width: calc(100% - #{48upx});
		position: relative;
		top: #{-90upx};
		.selection-box {
			width: #{702upx};
			height: 100%;
			padding: #{0 32upx};
		}
	}
	.pick-gift-height {
		height: #{150upx};
	}
	
	/* 礼物盒图 */
	.gift-box {
		width: #{96upx};
		height: #{96upx};
	}
	
	/* 导向图 */
	.guide {
		width: #{12upx};
		height: #{22upx};
	}
	
	/* 导向文字 */
	.guided-text {
		width: #{530upx};
		height: 100%;
		padding-left: #{24upx};
		.big-text {
			font-size: #{36upx};
			padding: #{34upx 0 5upx 0};
		}
		.small-text {
			font-size: #{24upx};
			color: #999999;
			padding: #{5upx 0 30upx 0};
		}
	}
	
	.radius-back-color {
		background-color: #ffffff;
		border-radius: #{16upx};
	}

	/*购物车*/
	.cart {
		padding: #{0 32upx 0 32upx};
		.total-content {
			height: #{100upx};
			/*继续添加*/
			.again {
				width: #{160upx};
				text-align: center;
				height: #{56upx};
				line-height: #{56upx};
				font-size: #{28upx};
				color: #ffffff;
				border-radius: #{32upx};
			}
			.number {
				font-size: #{28upx};
				color: #666666;
			}
		}
	}

	/*商品*/
	.item {
		padding-top: #{32upx};
		border-bottom: #{1upx} solid #e2e2e2;
		/*图片*/ 
		.pic {
			width: #{156upx};
			height: #{156upx};
			margin-bottom: #{32upx};
		}
		/*实质内容*/
		.content {
			width: calc(100% - #{156upx});
			padding-left: #{20upx};
		}
		/*标题*/ 
		.name {
			font-size: #{28upx};
			margin-top: #{2upx};
		}
		/*规格*/
		.attr {
			font-size: #{24upx};
			color: #999999;
			margin-top: #{20upx};
		}
		/*价格按钮*/ 
		.price-button {
			height: #{48upx};
			margin-top: #{34upx};
			.price {
				font-size: #{32upx};
				line-height: 1;
				width: calc(100% - #{200upx});
			}
			.price:before {
				content: "￥";
				font-size: 100%;
			}
		}
		.number-button {
			width: #{200upx};
			height: #{48upx};
			border-radius: #{8upx};
			border: #{1upx} solid #cdcdcd;
			.input {
				width: #{104upx};
				height: #{46upx};
				line-height: #{46upx};
				text-align: center;
				font-size: #{26upx};
				min-height: #{46upx};
				padding: 0;
			}
			.btn-left {
				border-right: #{1upx} solid #cdcdcd !important;
			}
			.btn-right {
				border-left: #{1upx} solid #cdcdcd !important;
			}
			.btn {
				height: #{45upx};
				line-height: #{45upx};
				width: #{45upx};
				font-size: #{26upx};
				text-align: center;
				color: #999999;
				border: none;
				padding: 0;
				border-radius: 0;
				background-color: transparent;
				margin: 0;
			}
			.disabled {
				background-color: #dddddd;
				color: #999999;
			}
		}
	}
	
	/* 广告图 规则 */
	.figure-rule {
		position: relative;
	}
	
	.text-content {
		position: absolute;
		top: 0;
		left: 0;
	}
	
	.rule {
		width: 12.5%;
		padding-top: #{40upx};
		.identification {
			width: 100%;
			border-top-left-radius: #{30upx};
			border-bottom-left-radius: #{30upx};
			background-color: rgba(0,0,0,.3);
			font-size: #{24upx};
			color: #ffffff;
			padding: #{12upx 24upx 12upx 20upx};
		}
	}
	
	.figure {
		width: 87.5%;
		padding-bottom: #{69upx};
		.text-color {
			color: #ffffff;
		}
		.big-text {
			font-size: #{48upx};
			padding: #{30upx 0 8upx 55upx};
		}
		.small-text {
			font-size: #{26upx};
			padding: #{8upx 0 52upx 48upx};
		}
	}
	
	.component-height {
		height: #{260upx};
	}
</style>