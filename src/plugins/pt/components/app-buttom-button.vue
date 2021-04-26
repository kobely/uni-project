<template>
	<view class="bd-bottom dir-left-nowrap cross-center">
		<view class="bd-back dir-top-nowrap main-center cross-center" @click="router">
            <image class="bd-icon" src="../../../static/image/icon/index.png"></image>
            <text class="bd-text">首页</text>
		</view>
        <bd-service :name="name" :url="url"></bd-service>
		<view v-if="item.goods_stock > 0 && start_time" class="box-grow-1 dir-left-nowrap">
			<view v-if="is_alone_buy === 1" @click.stop="turnOn(false)" class="bd-btn but dir-top-nowrap box-grow-1" :class="[is_alone_buy === 1 ? 'bd-btn-left' : '']" :style="{'background': item.buy_goods_auth ? theme.background_s_gradient_btn : '#999999','color': item.buy_goods_auth ? theme.secondary_text : ''}">
                <text class="price">
                    {{singlePrice}}
                </text>
                <text class="app-text">单独购买</text>
			</view>
			<view class="bd-btn but dir-top-nowrap box-grow-1" :style="{'background': item.buy_goods_auth ? theme.background_gradient_btn : '#999999','color': theme.main_text}" :class="[is_alone_buy === 1 ? 'bd-btn-right' : '']"  @click="turnOn(true)">
                <text class="price">{{group_price}}</text>
                <text class="app-text">{{groups[set_group_num].groups.people_num}}人拼团</text>
			</view>
		</view>
        <view v-else class="bd-btn bd-oversell-btn box-grow-1">
            <template v-if="item.goods_stock === 0">已售罄</template>
            <template v-else-if="!start_time">活动未开始</template>
        </view>
	</view>
</template>

<script>
import bdService from '@/components/page-component/goods/bd-service.vue';

    export default {
        name: 'app-bottom-button',
	    
	    props: {
            selectAttr: Object,
            selectGroupAttrId: {
                type: [String, Number]
            },
            is_alone_buy: {
                type: Number,
            },
			groups: {
                type: Array,
	            default() {
                    return [];
	            }
            },
            level_show: {
                type: Number,
	            default() {
                    return 0;
                }
            },
			member_price_min: {
                type: [String, Number],
                default() {
                    return '0.00';
                }
            },

            price: {
                type: String,
	            default() {
                    return '0.00';
	            }
            },
            price_member_min: {
                type: Number,
	            default() {
                    return 0;
                }
            },
		    pt: {
                type: Boolean,
		    },
            item: Object,
			start_time: Boolean,
			end_time: Boolean,
			theme: Object,
            url: String,
            name: String,
            singlePrice: String
	    },
	    
	    data() {
            return {
                group_price: '',
				disable: 'disable'
            }
	    },
	    mounted() {
			this.get_group();
	    },
	    methods: {
            turnOn(bool) {
                this.$emit('click', bool);
            },
		    get_group() {
                if (this.$validation.isEmpty(this.selectAttr)) {
                    if (this.level_show === 1) {
                        if (Number(this.member_price_min) === 0) {
                            this.group_price = '免费';
                        } else {
                            this.group_price = `￥${this.member_price_min}`;
                        }
                    } else {
                        if (Number(this.groups[0].price_min) ===  0) {
                            this.group_price =  '免费';
                        } else {
                            this.group_price = `￥${this.groups[0].price_min}`;
                        }
                    }
                } else {
                    if (this.level_show === 1) {
                        if (Number(this.selectAttr.price_member) === 0) {
                            this.group_price = '免费';
                        } else {
                            this.group_price = `￥${this.selectAttr.price_member}`;
                        }
                    } else {
                        if (Number(this.selectAttr.price) ===  0) {
                            this.group_price = '免费';
                        } else {
                            this.group_price = `￥${this.selectAttr.price}`;
                        }
                    }
                }
		    },
            router() {
                uni.reLaunch({
                    url: `/pages/index/index`
                });
            }
	    },
	    computed: {
            // // 单价
            // singlePrice() {
            //     if (this.pt) return;
            //     if (this.$validation.isEmpty(this.selectAttr)) {
            //         if (this.level_show === 1) {
            //             if (this.price_member_min === 0) {
            //                 return '免费';
            //             } else {
            //                 let price = this.price_member_min;
            //                 return `￥${price.toFixed(2)}`
            //             }
            //         } else {
            //             if (Number(this.price) ===  0) {
            //                 return '免费';
            //             } else {
            //                 return `￥${this.price}`
            //             }
            //         }
            //     } else {
            //         if (this.level_show === 1) {
            //             if (Number(this.selectAttr.price_member) === 0) {
            //                 return '免费';
            //             } else {
            //                 return `￥${this.selectAttr.price_member}`;
            //             }
            //         } else {
            //             if (Number(this.price) ===  0) {
            //                 return '免费';
            //             } else {
            //                 return `￥${this.selectAttr.price}`
            //             }
            //         }
            //     }
            // },
		    
		    set_group_num() {
                for (let i = 0; i < this.groups.length; i++) {
                    if (this.groups[i].groups.id == this.selectGroupAttrId) {
                        return i;
                    }
                }
		    }	    },
	    
	    watch: {
            selectAttr: {
                handler() {
                    if (this.pt) {
                        if (this.$validation.isEmpty(this.selectAttr)) {
                            if (this.level_show === 1) {
                                if (Number(this.member_price_min) === 0) {
                                    this.group_price = '免费';
                                } else {
                                    this.group_price =  `￥${this.member_price_min}`;
                                }
                                
                            } else {
                                if (Number(this.groups[0].price_min) ===  0) {
                                    this.group_price =  '免费';
                                } else {
                                    this.group_price =  `￥${this.groups[0].price_min}`;
                                }
                            }
                            
                        } else {
                            if (this.level_show === 1) {
                                if (Number(this.selectAttr.price_member) === 0) {
                                    this.group_price =  '免费';
                                } else {
                                    this.group_price =  `￥${this.selectAttr.price_member}`;
                                }
                            } else {
                                if (Number(this.selectAttr.price) ===  0) {
                                    this.group_price =  '免费';
                                } else {
                                    this.group_price =  `￥${this.selectAttr.price}`;
                                }
                            }
                        }
                    }
                },
	            immediate: true,
	            deep: true,
            },

			groups: {
            	handler(data) {
            		if (data.length > 0) {
						this.$nextTick(() => {
							this.get_group();
						})
					}
				},
				immediate: true
			}
	    },
        components: {
            bdService
        }
    }
</script>

<style scoped lang="scss">
    .app-single-button {
        background-color: #feeeee;
        text {
            color: #ff5c5c;
        }
    }
    .app-pt-button {
        background: linear-gradient(140deg, #ff9460, #ff5c5c);
        text {
            color: white;
        }
    }

    .app-but {
        height: #{110rpx};
        width: 50%;
    }

    .price {
        font-size: #{24rpx};
        margin-top: #{5rpx};
    }
    .app-text {
        font-size: #{20rpx};
    }
	.text {
		color: #ffffff;
	}


    .bd-bottom {
        height: 110upx;
        width: 750upx;
        padding: 20upx 24upx;
    }
    .bd-back {
        width: 66upx;
        height: 100%;
        margin-right: 20upx;
        font-size: 20upx;
        color: #888888;
    }
    .bd-btn-half {
        width: 50%;
    }
    .bd-icon {
        width: 30upx;
        height: 30upx;
        margin-bottom: 8upx;
    }
    .bd-text {
        font-size: 20upx;
        color: #888888;
        line-height: 1;
    }
    .bd-btn {
        text-align: center;
        font-size: 26upx;
        border-radius: 35upx;
    }
    .bd-btn-left {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .bd-btn-right {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        color: #ffffff;
    }
    .bd-oversell-btn {
        background-color: #CDCDCD;
        color: #ffffff;
        line-height: 70upx;
    }

    .bd-btn-left {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .bd-btn-right {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
</style>