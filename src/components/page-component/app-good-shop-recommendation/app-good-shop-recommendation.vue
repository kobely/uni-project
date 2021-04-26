<template>
    <view class="app-good-shop-recommendation">
        <view class="app-top-title dir-left-nowrap main-between cross-center" v-if="!showGoods && type === 'mch'">
            <view class="app-left dir-left-nowrap cross-center">
                <icon class="icon" type></icon>
                <text>好店推荐</text>
            </view>
            <view class="app-right dir-left-nowrap cross-center">
                <app-jump-button form url="/plugins/mch/list/list">
                    <text>更多</text>
                    <icon class="icon" type></icon>
                </app-jump-button>
            </view>
        </view>
        <view class="app-content" v-if="!showGoods">
            <scroll-view scroll-x class="app-scroll">
                <view class="app-item" :style="[{'background-color':`${cardStyle < 3 ? '#ffffff': ''}`,'border': `${cardStyle == 2 ? '2rpx solid #e2e2e2': '0'}`}]"
                      v-for="(item, index) in list"
                      :key="index"
                >
                    <app-jump-button arrangement="column" form :url="'/plugins/mch/shop/shop?mch_id=' + item.id">
                        <image class="app-image" :src="item.picUrl"></image>
                        <text class="app-name u-line-1">
                            {{item.name}}
                        </text>
                    </app-jump-button>
                </view>
            </scroll-view>
        </view>
        <view class="app-goods-shop" v-if="showGoods">
            <view class="app-shop" :style="[{'background-color':`${cardStyle < 3 ? '#ffffff': ''}`,'border': `${cardStyle == 2 ? '2rpx solid #e2e2e2': '0'}`}]"
                  v-for="(item, index) in list" :key="index">
                <view class="app-top dir-left-nowrap main-between" @click.stop="jump(item.id)">
                    <view class="dir-left-nowrap">
                        <image class="app-image" :src="item.pic_url"></image>
                        <view class="app-title">
                            <text class="app-name t-omit-two">{{item.name}}</text>
                            <view class="app-number-title">
                                <text class="app-shops">商品数量: {{item.goods_num}}</text>
                                <text class="app-sell">已售: {{item.order_num}}</text>
                            </view>
                        </view>
                    </view>
                    <view v-if="item.distance" class="box-grow-0 distance" >距离{{item.distance}}</view>
                    <view class="app-button-jump" v-else>
                        <app-jump-button form >
                            <view class="app-button">进店逛逛</view>
                        </app-jump-button>
                    </view>
                </view>
                <view class="app-bottom" v-if="item.goodsList.length !== 0">
                    <scroll-view class="app-scroll" scroll-x>
                        <view class="app-item" :style="{marginLeft: number !== 0 ? '8rpx' : '0'}"
                              v-for="(good, number) in item.goodsList" :key="number">
                            <view form
                                             @click.native.stop="router_jump(good, item.id)"
                                             >
                                <image class="app-image" :src="good.picUrl"></image>
                                <text class="app-price" :style="{'color': theme.color}">￥{{good.price}}</text>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';

    export default {
        name: "app-good-shop-recommendation",

        props: {
            showGoods: {
                type: Boolean,
                default: function () {
                    return false;
                },
                required: false
            },
            cardStyle: {
                type: String,
                default: function () {
                    return '1';
                },
                required: false
            },
            type: {
                type: String,
                default() {
                   return 'mch';
                },
                required: false
            },
            backgroundColor: {
                type: String,
                default() {
                   return '#fff';
                },
                required: false
            },
            theme: {
                type: [String, Object],
                required: false
            },
            page_id: {
                type: Number,
                required: false
            },
            index: {
                type: Number,
                required: false
            },
            is_required: {
                type: Boolean,
                required: false
            },
            mch_list: {
                type: Array,
                required: false
            },
            coupon_req: {
                type: Boolean,
                required: false
            }
        },
        computed: {
            ...mapGetters('mallConfig',{
                getVideo: 'getVideo'
            }),
            ...mapState({
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            })
        },
	    methods: {
            jump(data) {
                this.$jump({
	                url: `/plugins/mch/shop/shop?mch_id=${data}`,
	                open_type: 'navigate',
                });
            },
            router_jump(data, id) {
                // #ifndef MP-BAIDU
                if (data.goodsWarehouse.video_url && this.getVideo == 1) {
                    // #ifdef MP
                    uni.navigateTo({
                        url: `/pages/goods/video?goods_id=${data.id}&sign=mch`
                    });
                    // #endif
                    // #ifdef H5
                    uni.navigateTo({
                        url: `/plugins/mch/goods/goods?id=${data.id}&mch_id=${id}`,
                    });
                    // #endif
                } else {
                    uni.navigateTo({
                        url: `/plugins/mch/goods/goods?id=${data.id}&mch_id=${id}`,
                    });
                }
                // #endif

                // #ifdef MP-BAIDU
                uni.navigateTo({
                    url: `/plugins/mch/goods/goods?id=${data.id}&mch_id=${id}`,
                });
                // #endif
            },
            loadData() {
                this.$request({
                    url: this.$api.index.extra,
                    data: {
                        type: this.page_id === 0 ?'mall' : 'diy',
                        key: 'mch',
                        page_id: this.page_id,
                        index: this.index,
                        longitude: 0,
                        latitude: 0
                    }
                }).then(e => {
                    this.list = e.data;
                    if (this.page_id === 0) {
                        let storage = this.$storage.getStorageSync('INDEX_MALL');
                        storage.home_pages[this.index].list = this.list;
                        this.$storage.setStorageSync('INDEX_MALL', storage);
                    }
                })
            }
	    },

        data() {
            return {
                list: []
            }
        },

        watch: {
            mch_list: {
                handler(data) {
                    if (this.coupon_req) {
                        this.list = data;
                    }
                },
                deep: true
            }
        },
        mounted() {
            if (this.coupon_req) {
                this.list = this.mch_list;
            } else {
                if (this.is_required) {
                    this.loadData();
                } else {
                    let storage = this.$storage.getStorageSync('INDEX_MALL');
                    this.list = storage.home_pages[this.index].list;
                }
            }
        },
    }
</script>

<style scoped lang="scss">
    .app-good-shop-recommendation {
        width: #{750rpx};

        .distance {
            align-self: flex-start;
            padding-top: #{36rpx};
            font-size: #{24rpx};
            color: #999999;
            float: right;
            padding-right: #{50rpx};
        }

        .app-top-title {
            width: #{750rpx};
            height: #{80rpx};
            border-bottom: #{1rpx} solid #e2e2e2;
            background-color: #ffffff;

            .icon {
                background-size: 100% 100%;
                background-repeat: no-repeat;
            }

            .app-left {
                height: #{80rpx};

                .icon {
                    width: #{46rpx};
                    height: #{46rpx};
                    background-image: url("../../../static/image/icon/good-shop.png");
                    margin-left: #{24rpx};

                }

                text {
                    font-size: #{26rpx};
                    color: #ff8831;
                    margin-left: #{16rpx};
                }
            }

            .app-right {
                height: #{80rpx};

                .icon {
                    width: #{12rpx};
                    height: #{22rpx};
                    background-image: url("../../../static/image/icon/arrow-right.png");
                    margin-right: #{24rpx};
                }

                text {
                    font-size: #{26rpx};
                    color: #999999;
                    margin-right: #{12rpx};
                }
            }
        }

        .app-content {
            width: #{750rpx};
            padding: #{12rpx} 0;

            .app-scroll {
                width: #{750rpx};
                padding-left: #{16rpx};
                white-space: nowrap;
                height: #{224+20+20+23rpx};

                .app-item {
                    display: inline-block;
                    width: #{224rpx};
                    height: #{224+20+20+24rpx};
                    margin: 0 #{8rpx};
                    border-radius: #{16rpx};

                    .app-image {
                        width: #{224rpx};
                        height: #{224rpx};
                        border-top-left-radius: #{16rpx};
                        border-top-right-radius: #{16rpx};
                    }

                    .app-name {
                        height: #{24+20+20rpx};
                        /* #ifndef MP-ALIPAY */
                        width: #{189rpx};
                        /* #endif */
                        /* #ifdef MP-ALIPAY */
                        width: #{195rpx};
                        /* #endif */
                        font-size: #{24rpx};
                        color: #353535;
                        line-height: #{24+20+20rpx};
                        display: inline-block;
                        overflow: hidden;
                        text-align: center;
                    }
                }
            }
        }

        .app-goods-shop {
            width: #{750rpx};
            padding: #{20rpx};

            .app-shop {
                width: #{750-20-20rpx};
                padding: 0 #{24rpx};
                margin-top: #{20rpx};
                margin-bottom: #{20rpx};
                overflow: hidden;
                border-radius: #{16rpx};

                .app-top {
                    width: #{750-20-20-24-24rpx};
                    margin: #{24rpx} 0;

                    .app-image {
                        width: #{100rpx};
                        height: #{100rpx};
                        border-radius: #{8rpx};
                    }

                    .app-title {
                        margin-left: #{24rpx};
                        margin-top: #{36-24rpx};
                        width: #{370rpx};
                        .app-name {
                            font-size: #{28rpx};
                            color: #353535;
                        }

                        .app-number-title {
                            margin-top: #{12rpx};
                            color: #999999;
                            font-size: #{24rpx};

                            .app-sell {
                                margin-left: #{32rpx};
                            }
                        }
                    }

                    .app-button-jump {
                        float: right;
                        margin-right: #{24rpx};
                        width: #{144rpx};
                        height: #{64rpx};
                        margin-top: #{18rpx};
                        margin-bottom: #{18rpx};
                        .app-button {
                            width: #{144rpx};
                            height: #{64rpx};
                            text-align: center;
                            border: #{1rpx} solid #cccccc;
                            font-size: #{26rpx};
                            color: #666666;
                            line-height: #{64rpx};
                            border-radius: #{40rpx};
                        }
                    }
                }

                .app-bottom {
                    height: #{210+23rpx};
                    width: #{750-20-20-24-24rpx};
                    padding-bottom: #{23rpx};

                    .app-scroll {
                        height: #{210rpx};
                        width: #{750-20-20-24-24rpx};
                        white-space: nowrap;
                        margin-bottom: #{23rpx};

                        .app-item {
                            /*background-color: red;*/
                            display: inline-block;
                            width: #{210rpx};
                            height: #{210rpx};
                            margin-left: #{8rpx};
                            margin-right: #{8rpx};
                            position: relative;

                            .app-image {
                                width: #{210rpx};
                                height: #{210rpx};
                            }

                            .app-price {
                                position: absolute;
                                bottom: 0;
                                left: 0;
                                width: #{210rpx};
                                font-size: #{28rpx};
                                height: #{50rpx};
                                text-align: center;
                                background-color: rgba(245, 245, 246, 0.5);
                            }
                        }
                    }
                }
            }
            .app-shop:first-of-type {
                margin-top: 0;
            }
            .app-shop:last-of-type {
                margin-bottom: 0;
            }
        }
    }
</style>