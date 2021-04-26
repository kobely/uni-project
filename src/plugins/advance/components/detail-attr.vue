<template>
	<view class="detail-attr" >
        <view class="safe-area-inset-bottom u-bottom-fixed">
            <view class="attr-content" @tap.stop="preventD">
                <view class="top dir-left-nowrap">
                    <view class="image-view">
                        <image :src="attr_pic_url ? attr_pic_url : image_url" @click="clickImage(index)"></image>
                    </view>
                    <view class="price dir-top-nowrap">
                        <text class="des" :style="{'color': theme.color}">定金￥{{attr_deposit}}抵￥{{attr_swell_deposit}}</text>
                        <text class="swell" :style="{'color': theme.color}" v-if="level_show == 0 || level_show == 2">
                            ￥{{attr_price}}
                            <text class="swell-text"> 预售价</text>
                        </text>
                        <text class="swell" :style="{'color': theme.color}"  v-if="level_show === 1">
                            ￥{{attr_price_member}}
                            <text class="swell-text"> 会员价</text>
                        </text>
                        <text class="stock">库存{{attr_stock}}</text>
                    </view>
                    <image class="close" src="/static/image/icon/icon-close.png" @click="close_attr"></image>
                </view>
                <scroll-view class="center" :scroll-y="true">
                    <view class="row" v-for="(item, index) in attr_groups" :key="index">
                        <text class="attr-group-name">{{item.attr_group_name}}</text>
                        <view class="attr-row dir-left-wrap">
                            <view class="attr-item"
                            	  :style="{'background-color': attr.active ? theme.background: ''}"
                                  :class=" attr.active ? 'active-attr-item' : 'default-back'"
                                  v-for="(attr, ind) in item.attr_list"
                                  :key="ind"
                                  @click.stop="select_attr(item, attr)"
                            >{{attr.attr_name}}</view>
                        </view>
                    </view>
                </scroll-view>
                <view class="bottom dir-left-nowrap main-between cross-center">
                    <text>数量</text>
                    <view class="num dir-right-nowrap main-between cross-center">
                        <image class="image" src="/static/image/cart/can-be-added.png" @click.stop="add_num"></image>
                        <input type="number" class="input" :value="num" @change="change_num">
                        <image class="image" :src="num === 1 ? '../image/can-be-reduced.png' : '/static/image/cart/can-be-reduced.png'" @click.stop="edd_num"></image>
                    </view>
                </view>
                <view :style="{height:`${height}rpx`}" >
                </view>
            </view>
        </view>
	</view>
</template>

<script>
    export default {
        name: "detail-attr",
	    data() {
            return {
                image_url: ''
            }
	    },
	    props: {
            height: Number,
            cover_pic: String,
            attr: Array,
            attr_groups: Array,
            goods_stock: Number,
            attr_swell_deposit: {
                type: [String, Number]
            },
            attr_deposit: {
                type: [String, Number]
            },
            attr_stock: {
                type: [String, Number]
            },
            price_member: Number,
            attr_price: String,
            level_show: Number,
            attr_price_member: Number,
            num: Number,
            attr_pic_url: String,
			theme: Object,
	    },
	    methods: {
            close_attr() {
                this.$emit('close_attr', true);
            },
            select_attr(data, item) {
                this.$emit('select_attr', {
                    data: data.attr_group_id, item: item.attr_id
                });
            },
            change_num(data) {
                this.$emit('change_num_data', Number(data.detail.value));
            },
		    add_num() {
                this.$emit('change_num', 1);
            },
		    edd_num() {
                if (this.num === 1) return;
                this.$emit('change_num', -1);
		    },
            clickImage() {
                let url = [];
                if (this.attr_pic_url) {
                    url.push(this.attr_pic_url);
                } else {
                    url.push(this.image_url);
                }
                uni.previewImage({
                    urls: url
                });
            },
			preventD() {}
	    },
	    mounted() {
            if (this.attr[0] && this.attr[0].pic_url) {
                this.image_url = this.attr[0].pic_url;
            } else {
	            this.image_url = this.cover_pic;
            }
	    }
    }
</script>

<style scoped lang="scss">
	.detail-attr {
		width: #{750rpx};
		background-color: rgba(153,153,153,0.3);
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1601;
	}
	.attr-content {
		width: #{750rpx};
		border-top-left-radius: #{15rpx};
		border-top-right-radius: #{15rpx};
		padding: 0 #{24rpx};
		.top {
			height: #{155rpx};
			width: #{702rpx};
			border-bottom: #{1rpx} solid #e2e2e2;
			position: relative;
			.image-view {
				width: #{200rpx};
				height: #{200rpx};
				background-color: white;
				border-radius: #{9rpx};
				text-align: center;
				position: absolute;
				top: #{-63rpx};
				>image {
					width: #{192rpx};
					height: #{192rpx};
					margin-top: #{4rpx};
					border-radius: #{9rpx};
				}
			}
			.close {
				width: #{35rpx};
				height: #{35rpx};
				padding: #{5rpx};
				position: absolute;
				right: 0;
				top: #{20rpx};
			}
			.price {
				height: #{141rpx};
				margin-left: #{228rpx};
				width: #{441rpx};
				padding-top: #{28rpx};
				.stock {
					font-size: #{24rpx};
					color: #999999;
				}
				.des {
					font-size: #{22rpx};
					margin-bottom: #{5rpx};
				}
				.swell {
					font-size: #{24rpx};
					margin-bottom: #{5rpx};
					.swell-text {
						font-size: #{21rpx};
					}
				}
			}
		}
		.center {
			max-height: #{333rpx};
			.row {
				width: #{702rpx};
				border-bottom: #{1rpx} solid #e2e2e2;
				padding: #{32rpx 0 0 0};
				font-size: #{25rpx};
				.attr-group-name {
					color: #666666;
				}
				.attr-row {
					margin-top: #{19rpx};
					.attr-item {
						height: #{57rpx};
						line-height: #{57rpx};
						text-align: center;
						border-radius: #{9rpx};
						color: #1b1b1b;
						margin-right: #{20rpx};
						padding: 0 #{24rpx};
						margin-bottom: #{32rpx};
					}

					.active-attr-item {
						color: #ffffff;

					}
				}
			}
			
		}
		.bottom {
			height: #{123rpx};
			width: #{702rpx};
			color: #6a6a6a;
			.num {
				width: #{216rpx};
				height: #{60rpx};
				.input {
					width: #{90rpx};
					height: #{60rpx};
					background-color: #f7f7f7;
					text-align: center;
					color: #353535;
				}
				.image {
					width: #{60rpx};
					height: #{60rpx};
					margin: #{0 2upx};
				}
			}
		}
	}
	.default-back {
		background-color: #f2f2f2;
	}
    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1601;
        background-color: #ffffff;
    }
</style>