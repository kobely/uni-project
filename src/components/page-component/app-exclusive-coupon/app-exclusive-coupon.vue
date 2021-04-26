<template>
    <view class="app-exclusive-coupon" :style="{'background-color': `${noneColor ? '' : background}`}">
        <view class="app-top main-between" v-if="showTop" @click="route()">
            <view class="app-left main-between cross-center">
                <icon class="app-icon" type></icon>
                <text class="app-title">专享优惠券</text>
            </view>
            <view class="app-right main-between cross-center">
                <text class="app-text">更多</text>
                <icon class="app-icon" type></icon>
            </view>
        </view>
        <view class="app-bottom">
            <scroll-view scroll-x class="app-scroll dir-left-nowrap">
                <view v-for="(item, index) in coupon_list"
                      :key="index"
                      class="app-item"
                      :style="{backgroundImage: `url(${item.is_receive == 0 ? unclaimedBg : item.is_receive == 1 ? receiveBg : ''})`}"
                >
                    <view class="main-left" @click="receive(index)">
                        <view class="app-text-left">
                            <view class="app-text-top">
                                <template v-if="item.type == '1'">
                                    <text class="app-number discount" :style="{color: textColor}">{{item.discount}}</text>
                                </template>
                                <template v-else>
                                    <text class="app-symbol" :style="{color: textColor}">￥</text>
                                    <text class="app-number" :style="{color: textColor}">{{item.sub_price}}</text>
                                </template>
                            </view>
                            <text class="app-text-bottom" :style="{color: textColor}">满{{item.min_price}}元可用</text>
                        </view>
                        <view class="app-text-right">
                            <text :style="{color: textColor}">{{item.is_receive == 0 ? receiveTip : item.is_receive > 0 ? '已领取' : ''}}</text>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'app-exclusive-coupon',
        props: {
            receiveBg: {
                type: String,
                default: function() {
                    return '';
                },
                required: false
            },
            list: {
                type: Array,
                default: function() {
                    return [];
                },
                required: false
            },
            textColor: {
                type: String,
                default: function() {
                    return  "#ffffff";
                },
                required: false
            },
            unclaimedBg: {
                type: String,
                default: function() {
                    return '';
                },
                required: false
            },
            index: {
                type: Number,
                required: false
            },
            sign: {
                type: String,
                required: false
            },
            showTop: {
                type: Boolean,
                default() {
                    return true;
                },
                required: false
            },
            noneColor: {
                type: Boolean,
                default() {
                    return false;
                },
                required: false
            },
            background: {
                type: String,
                required: false
            },
            page_id: {
                type: Number,
                required: false
            },
            is_required: {
                type: Boolean,
                required: false
            },
            coupon_req: {
                type: Boolean,
                required: false
            }
        },
        data() {
            return {
                coupon_list: [],
                tempList: []
            };
        },
        computed: {
            receiveTip() {
                let receiveTip = '立即领取';
                if (this.sign === 'integral-mall') {
                    receiveTip = '立即兑换';
                }
                return receiveTip;
            }
        },
        methods: {
            receive(index) {
                let list = this.coupon_list;
                if (this.sign === 'integral-mall') {
                    this.$jump({
                        url: list[index].page_url,
                        open_type: 'navigate'
                    });
                    return ;
                }
                if (list[index].is_receive == 1) {
                    uni.showToast({
                        mask: true,
                        title: '已领取',
                        icon: 'none'
                    });
                    return true;
                }
                uni.showLoading({
                    mask: true,
                    title: '领取中'
                });
                this.$request({
                    url: this.$api.coupon.receive,
                    data: {
                        coupon_id: list[index].id
                    }
                }).then(e => {
                    uni.hideLoading();
                    if (e.code === 0) {
                        if (e.data.rest == 0) {
                            e.data.is_receive = 1;
                        }
                        this.coupon_list[index] = Object.assign(list[index], e.data);
                        let storage = this.$storage.getStorageSync('INDEX_MALL');
                        storage.home_pages[this.index].list = this.coupon_list;
                        this.$storage.setStorageSync('INDEX_MALL', storage);
                        this.$store.dispatch('page/actionSetCoupon', {
                            list: [this.coupon_list[index]],
                            type: 'receive'
                        });
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: e.msg,
                            showCancel: false,
                        });
                    }
                }).catch(() => {
                    uni.hideLoading();
                });
            },
            loadData() {
                this.$request({
                    url: this.$api.index.extra,
                    data: {
                        type: 'mall',
                        key: 'coupon',
                        page_id: this.page_id,
                        index: this.index
                    }
                }).then(e => {
                    this.coupon_list = e.data;
                    // this.tempList = this.cloneData(e.data);
                    // this.splitData();
                    if (this.page_id === 0) {
                        let storage = this.$storage.getStorageSync('INDEX_MALL');
                        storage.home_pages[this.index].list = e.data;
                        this.$storage.setStorageSync('INDEX_MALL', storage);
                    }
                })
            },
            cloneData(data) {
                return JSON.parse(JSON.stringify(data));
            },
            splitData() {
                if (!this.tempList.length) return;
                let item = this.tempList[0];
                this.coupon_list.push(item);
                this.tempList.splice(0, 1);
                if (this.tempList.length) {
                    setTimeout(() => {
                        this.splitData();
                    }, 300);
                }
            },
            route() {
                uni.navigateTo({
                    url: '/pages/coupon/list/list'
                })
            }
        },
        mounted() {
            if (!this.coupon_req) {
                if (this.is_required) {
                    this.loadData();
                } else {
                    let storage = this.$storage.getStorageSync('INDEX_MALL');
                    this.coupon_list = storage.home_pages[this.index].list;
                    // this.tempList = this.cloneData(storage.home_pages[this.index].list);
                    // this.splitData();
                }
            } else {
                this.coupon_list = this.list;
                // this.tempList = this.cloneData(this.list);
                // this.splitData();
            }
        },
    }
</script>

<style scoped lang="scss">
    .app-exclusive-coupon {
        width: #{750rpx};
        .app-top {
            width: #{750rpx};
            height: #{80rpx};
            border-bottom: #{1rpx} solid #e2e2e2;
            .app-icon {
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            .app-left {
                width: #{215rpx};
                height: #{80rpx};
                margin-left: #{24rpx};
                .app-icon {
                    width: #{46rpx};
                    height: #{46rpx};
                    background-image: url("../../../static/image/icon/coupon-icon.png");
                }
                .app-title {
                    font-size: #{28rpx};
                    color: #ff8831;
                }
            }
            .app-right {
                height: #{80rpx};
                width: #{75rpx};
                margin-right: #{24rpx};
                .app-icon {
                    width: #{12rpx};
                    height: #{22rpx};
                    background-image: url("../../../static/image/icon/arrow-right.png");
                }
                .app-text {
                    font-size: #{26rpx};
                    color: #999999;
                }
            }
        }
        .app-bottom {
            padding-top: #{16rpx};
            padding-left: #{8rpx};
            padding-bottom: #{16rpx};
            height: #{162rpx};
            width: #{750rpx};
            .app-scroll {
                height: #{162rpx};
                width: #{750-24rpx};
                white-space: nowrap;
            }
            .app-item {
                width: #{256rpx};
                height: #{130rpx};
                display: inline-block;
                margin-left: #{16rpx};
                background-repeat: no-repeat;
                background-size: 100% 100%;
                >view {
                    width: #{256rpx};
                    height: #{130rpx};
                }
                .app-text-left {
                    width: #{199rpx};
                    height: #{130rpx};
                    .app-text-top {
                        height: #{78rpx};
                        padding-top: #{1rpx};
                        overflow: hidden;
                        text-align: center;
                        .app-symbol {
                            display: inline-block;
                            height: #{78rpx};
                            font-size: #{20rpx};
                        }
                        .app-number {
                            display: inline-block;
                            height: #{78rpx};
                            padding-top: #{26rpx};
                            font-size: #{40rpx};
                        }

                        .discount:after {
                            content: '折';
                            font-size: 75%;
                        }
                    }
                    .app-text-bottom {
                        height: #{50rpx};
                        width: #{199rpx};
                        text-align: center;
                        font-size: #{20rpx};
                        display: inline-block;
                    }
                }
                .app-text-right {
                    width: #{50rpx};
                    height: #{130rpx};
                    text {
                        height: #{130rpx};
                        width: #{50rpx};
                        display: inline-block;
                        text-align: center;
                        line-height: #{50rpx};
                        font-size: #{20rpx};
                        margin-left: #{2rpx};
                        writing-mode: vertical-rl;
                        letter-spacing: #{5rpx};
                    }
                }
            }
        }
    }
</style>
