<template>
	<view class="detail-discount">
		<view class="top dir-left-nowrap main-between">
			<view class="text">
				<template v-if="activeIndex === 0 && ladder_rules.length === 1">
					<view>
						再抢购{{ladder_rules[0].num-sales}}件
					</view>
					<view>
						可享
						<text>{{ladder_rules[0].discount}}</text>
						折优惠
					</view>
				</template>
				<template v-if="activeIndex === 0 && ladder_rules.length > 1">
					<view>
						再抢购{{ladder_rules[0].num-sales}}件
					</view>
					<view>
						可享
						<text>{{ladder_rules[0].discount}}</text>
						折优惠
					</view>
				</template>
				<template v-if="activeIndex > 0">
					<view>
						当前{{ladder_rules[activeIndex-1].discount}}折，再抢购{{ladder_rules[activeIndex].num-sales}}件
					</view>
					<view>
						可享
						<text>{{ladder_rules[activeIndex].discount}}</text>
						折优惠
					</view>
				</template>
				<template v-if="activeIndex === -1">
					<view >已满足抢购条件</view>
					可享
					<text>{{ladder_rules[ladder_rules.length - 1].discount}}</text>
					折优惠
				</template>
			</view>
			<view class="button" >
				<!-- #ifdef MP -->
				<app-jump-button form  open_type="share">邀请好友购买</app-jump-button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<app-jump-button form  @click.native="shareUrl">邀请好友购买</app-jump-button>
				<!-- #endif -->
			</view>
		</view>
		<view class="bottom">
			<view :scroll-x="true"  class="textss"  v-if="ladder_rules.length === 1">
				<view class="scroll-empty"></view>
				<view class="content-d border-radius-right border-radius-left" style="width:654rpx;">
					<view class="content-d-d-d border-radius-left border-radius-right" :style="{width: `${ activeIndex === -1 ? '702' : (702/Number(ladder_rules[0].num)) * sales}rpx`}"></view>
					<text class="content-text-o">满{{ladder_rules[0].num}}件，享{{Number(ladder_rules[0].discount)}}折</text>
				</view>
				<view class="scroll-empty after"></view>
			</view>
			<scroll-view :scroll-x="true"  class="textss"  v-if="ladder_rules.length !== 1" >
				<view class="scroll-empty"></view>
				<view class="content-d" v-for="(item, index) in ladder_rules" :key="index" :class="{'border-radius-left': index === 0, 'border-radius-right': index === ladder_rules.length - 1}">
					<view class="content-d-d-d" :style="{width: `${getNum(item, index)}rpx`}" :class="{'border-radius-left': index === 0, 'border-radius-right': index === ladder_rules.length - 1}"></view>
					<text class="content-text">满{{item.num}}件，享{{item.discount}}折</text>
					<view class="yuan-default" :class="{'yuan' : activeIndex > index || activeIndex === -1}" ></view>
				</view>
				<view class="scroll-empty after"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
    export default {
        name: "detail-discount",
	    data() {
            return {
                shareShow: false,
                x: 0,
                y: 0,
                old: {
                    x: 0,
                    y: 0
                }
            }
	    },
	    props: {
            url: String,
            ladder_rules: Array,
            sales: Number,
	    },
	    computed: {
            activeIndex() {
                let index = 0;
                for (let i = 0; i < this.ladder_rules.length; i++) {
                    if (this.ladder_rules[i].num > this.sales) {
                        return i;
                    } else {
                        index += 1;
                    }
                }
                if (index === this.ladder_rules.length) {
                    return -1;
                }
            }
	    },
	    methods: {
            open_share() {
                this.shareShow = true;
            },
            onChange: function(e) {
                this.old.x = e.detail.x;
            },
            getNum(item, index) {
                if (this.activeIndex > index) {
                    return 320;
                } else if (this.activeIndex === index) {
                    if (index === 0) {
                        return 320/Number(item.num) * this.sales;
                    } else {
                        return 320/(Number(item.num)-Number(this.ladder_rules[index-1].num)) * (this.sales-Number(this.ladder_rules[index-1].num));
                    }
                } else if (this.activeIndex === -1) {
                    return 320;
                } else if (this.activeIndex < index) {
                    return 0;
                }
            },
			// #ifdef H5
			shareUrl() {
				 this.$utils.uniCopy({
					data: window.location.href,
					success() {
						uni.showToast({
							icon: 'none',
							title: '链接已复制'
						});
					}
				});
			}
			// #endif
	    }
    }
</script>

<style scoped lang="scss">
	.detail-discount {
		width: #{702rpx};
		background:linear-gradient(45deg,#ff8c40, #ff6d40);
		height: #{210rpx};
        border-radius: 15upx;
        margin: 24upx 24upx 0 24upx;
		.top {
			color: #ffffff;
			padding: #{ 30rpx 24rpx 0 24rpx};
			.text {
				font-size: #{26rpx};
				text {
					font-size: #{32rpx};
				}
			}
			.button {
				margin-top: #{8rpx};
				width: #{213rpx};
				height: #{56rpx};
				line-height: #{54rpx};
				font-size: #{26rpx};
				color: #ffffff;
				border-radius: #{30rpx};
				text-align: center;
				border: #{1rpx} solid #ffffff;
			}
		}
		.bottom {
			height: #{100rpx};
			width: #{702rpx};
		}
	}
	.textss {
		height: #{100rpx};
		white-space: nowrap;
	}
	.content {
		height: #{10rpx};
		width: #{702rpx};
		background-color: #b24c2d;
		border-radius: #{5rpx};
		position: relative;
		.content-nei {
			height: #{10rpx};
			border-radius: #{5rpx};
			background-color: #ffffff;
		}
		.content-text {
			position: absolute;
			font-size: #{24rpx};
			color: #ffffff;
			margin-top: #{16rpx};
			right: 0;
		}
	}
	.content-d {
		display: inline-block;
		width: #{320rpx};
		height: #{10rpx};
		position: relative;
		margin-top: #{5rpx};
		background-color: rgba(204, 94, 51, .8);
		.content-text {
			position: absolute;
			font-size: #{24rpx};
			color: #ffffff;
			margin-top: #{16rpx};
			right: 0;
			transform: translateX(50%);
		}
		.content-text-o {
			position: absolute;
			font-size: #{24rpx};
			color: #ffffff;
			margin-top: #{16rpx};
			right: 0;
		}
	}
	.content-d-d {
		height: #{10rpx};
		border-radius: #{5rpx};
	}
	.content-d-d-d {
		height: #{10rpx};
		background-color: #f7f7f7;
	}
	.yuan {
		background-color: #ff8c40 !important;
		border: #{5rpx} solid #ffffff !important;
	}
	.scroll-empty {
		height: #{10upx};
		width: #{25upx};
		display: inline-block;
	}
	.after {
		width: #{125upx};
	}
	.yuan-default {
		border-radius: 50%;
		position: absolute;
		z-index: 1400;
		top: 50%;
		transform: translateY(-50%);
		right: 0;
		width: #{20rpx};
		height: #{20rpx};
		background-color: rgba(204, 94, 51, .8);
		border: #{5rpx} solid rgba(204, 94, 51, .8) ;
	}
	.border-radius-left {
		border-top-left-radius: #{5rpx};
		border-bottom-left-radius: #{5rpx};
	}
	.border-radius-right {
		border-top-right-radius: #{5rpx};
		border-bottom-right-radius: #{5rpx};
	}
</style>