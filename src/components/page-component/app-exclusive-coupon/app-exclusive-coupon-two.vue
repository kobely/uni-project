<template>
    <view class="app-exclusive-coupon-two" :style="{'background-color': `${noneColor ? '' : background}`}">
        <view class="app-bottom" v-if="coupon_list.length > 0">
            <scroll-view scroll-x class="app-scroll dir-left-nowrap">
                <view v-for="(item, index) in coupon_list"
                      :key="index"
                      class="app-item"
                      :style="[couponBoxStyle(item,index)]"
                >
                    <app-form-id @click="receive(index)">
                        <view class="coupon-bg">
                            <img style="height: 100%;width: 100%" :src="'../../../static/image/diy/bg_coupon_index_' + ([1,2,3].indexOf(coupon_list.length) === -1 ? 4 : coupon_list.length)  + '.png'" alt="">
                        </view>
                        <view v-if="coupon_list.length === 1" class="dir-left-nowrap" style="height: 100%"
                             :style="{color: textColor}">
                            <view style="width: 28%;font-size: 32rpx"
                                  class="app-text-top main-center app-number cross-center"
                                  :class="{discount: item.type === `1`, 'app-symbol' : item.type !== `1`}">
                                {{item.type === `1` ? item.discount : item.sub_price}}
                            </view>
                            <view style="width: 71%;font-size: 20rpx" class="app-text-top main-center cross-center">
                                满{{item.min_price}}元可用
                            </view>
                            <view style="width: 20%" class="app-text-right main-center cross-center">
                                <text>
                                    {{item.is_receive == 0 ? receiveTip : item.is_receive > 0 ? '已领取' : ''}}
                                </text>
                            </view>
                        </view>
                        <view v-else class="dir-left-nowrap" style="height:100%" :style="{color: textColor}">
                            <view style="text-align: center;width: 75%" class="box-grow-0">
                                <view style="font-size:32rpx;height: 50%;padding-top: 15rpx"
                                     :class="{discount: item.type === `1`, 'app-symbol' : item.type !== `1`}">
                                    {{item.type === `1` ? item.discount : item.sub_price}}
                                </view>
                                <view style="height: 50%;font-size: 20rpx;padding-top: 15rpx">
                                    满{{item.min_price}}元可用
                                </view>
                            </view>
                            <view class="box-grow-1 app-text-right main-center cross-center">
                                <text>
                                    {{item.is_receive == 0 ? receiveTip : item.is_receive > 0 ? '已领取' : ''}}
                                </text>
                            </view>
                        </view>
                    </app-form-id>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'app-exclusive-coupon-two',
        props: {
            receiveBg: {
                type: String,
                default: function() {
                    return '';
                }
            },
            list: {
                type: Array,
                default: function() {
                    return [];
                }
            },
            textColor: {
                type: String,
                default: function() {
                    return  "#ffffff";
                }
            },
            unclaimedBg: {
                type: String,
                default: function() {
                    return ''
                }
            },
            index: {
                type: Number,
            },
            sign: {
                type: String,
            },
            noneColor: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            background: String,
            page_id: Number,
            template_id: Number,
            is_required: Boolean,
            coupon_req: Boolean,
            couponBg: {
                type: String,
                default: '#D9BC8B',
            },
            //diy手动添加优惠券标识
            addType: String,
            couponBgType: {
                type: String,
                default() {
                    return '#pure';
                }
            },
            dIndex: {
                type: Array,
                default() {
                    return [0, 0];
                }
            },
            mIndex: {
                type: Array,
                default() {
                    return [0, 0];
                }
            },
            dType: String,
        },
        data() {
            return {
                coupon_list: []
            };
        },
        computed: {
            receiveTip() {
                let receiveTip = '立即领取';
                if (this.sign === 'integral-mall') {
                    receiveTip = '立即兑换';
                }
                return receiveTip;
            },
            couponBoxStyle() {
                return (data, index) => {
                    let couponList = this.coupon_list;
                    let width, background;

                    let screenWidth = uni.getSystemInfoSync().windowWidth;
                    let p = 750 / screenWidth;
                    switch (couponList.length) {
                        case 1:
                            width = `${parseInt(702 / p)}px`;
                            break;
                        case 2:
                            width = `${parseInt(341 / p)}px`;
                            break;
                        case 3:
                            width = `${parseInt(220 / p)}px`;
                            break;
                        default:
                            width = `${parseInt(274 / p)}px`;
                            break;
                    }
                    let extra = {'margin-left': `${20 / p}px`};
                    if (index === 0) extra = Object.assign(extra, {'margin-left': `${24 / p}px`});
                    if (index === this.coupon_list.length - 1) extra = Object.assign(extra, {'margin-right': `${24 / p}px`});
                    if (data.is_receive > 0) {
                        background = '#B4B4B4';
                    } else if (this.couponBgType === 'gradient') {
                        background = 'linear-gradient(to left, ' + this.couponBg + ',' + this.$utils.colorRgba(this.couponBg, 0.5) + ')';
                    } else {
                        background = this.couponBg;
                    }
                    return Object.assign(extra, {
                        background,
                        'width': width,
                        'min-width': couponList.length > 3 ? width : 'auto'
                    });
                }
            }
        },
        methods: {
            flushCache(coupon_list) {
                if (this.page_id == 0) {
                    let storage = this.$storage.getStorageSync('INDEX_MALL');
                    let dIndex = this.dIndex;
                    let mIndex = this.mIndex;

                    if (this.dType === 'module') {
                        storage.home_pages.navs[mIndex[0]].template.data[mIndex[1]].data.list[dIndex[0]].data[dIndex[1]].data.coupon_list = coupon_list;
                    } else {
                        storage.home_pages.navs[dIndex[0]].template.data[dIndex[1]].data.coupon_list = coupon_list;
                    }
                    this.$storage.setStorageSync('INDEX_MALL', storage);
                }
            },
            receive(index) {
                let list = this.coupon_list;
                if (this.sign == 'integral-mall') {
                    this.$jump({
                        url: list[index].page_url,
                        open_type: 'navigate'
                    });
                    return;
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
                            this.coupon_list[index].is_receive = '1';
                        }
                        let tempList = this.coupon_list;
                        this.flushCache(tempList);
                        this.$store.dispatch('page/actionSetCoupon', {
                            list: [Object.assign(tempList[index], e.data)],
                            type: 'receive'
                        });
                    } else {
                        uni.showToast({title: e.msg, icon: 'none'});
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
                    if (this.page_id === 0) {
                        let storage = this.$storage.getStorageSync('INDEX_MALL');
                        storage.home_pages[this.index].list = this.coupon_list;
                        this.$storage.setStorageSync('INDEX_MALL', storage);
                    }
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
                }
            } else {
                this.coupon_list = this.list;
            }
        },
    }
</script>

<style scoped lang="scss">
    .app-exclusive-coupon-two {
        width: #{750rpx};

        .coupon-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .app-bottom {
            padding: #{16rpx} 0;
            height: #{130+16+16rpx};
            width: #{750rpx};

            .app-scroll {
                height: #{130+16+16rpx};
                height: 100%;
                del-width: #{750-24rpx};
                white-space: nowrap;
            }

            .app-item {
                width: #{256rpx};
                position: relative;
                height: #{130rpx};
                display: inline-block;
                margin-left: #{20rpx};
                background-repeat: no-repeat;
                background-size: 100% 100%;

                .app-number.app-symbol:before {
                    content: '￥';
                    font-size: #{20rpx};
                }

                app-number {
                    font-size: #{40rpx};
                }

                .discount:after {
                    content: '折';
                    font-size: 75%;
                }

                .app-text-left {
                    width: 75%;
                    height: #{130rpx};

                    .app-text-top {
                        height: 50%;
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
                            height: 100%;
                        }
                    }

                    .app-text-bottom {
                        height: 50%;
                        text-align: center;
                        font-size: #{20rpx};
                        display: block;
                    }
                }

                .app-text-right {
                    width: 25%;
                    height: #{130rpx};

                    text {
                        height: #{130rpx};
                        display: inline-block;
                        text-align: center;
                        line-height: #{50rpx};
                        font-size: #{24rpx};
                        writing-mode: vertical-rl;
                        letter-spacing: #{5rpx};
                    }
                }
            }
        }
    }
</style>
