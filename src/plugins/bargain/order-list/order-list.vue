<template>
    <app-layout>
        <view class="no-content" v-if="!list.length">
            <view>你还没有进行中的砍价</view>
            <view>去会场逛逛！</view>
        </view>
        <view class="order-list">
            <block v-for="(v,k) in list" :key="k">
                <view @click="navGoods(v)" class="bargain-list dir-left-nowrap">
                    <view class="box-grow-0">
                        <image :src="v.cover_pic"></image>
                    </view>

                    <view class="box-grow-1 dir-top-nowrap bargain-right">
                        <view class="box-grow-0 bargain-name t-omit-two">{{v.goods_name}}</view>
                        <view class="attr t-omit">{{v.select_attr_group_text}}</view>
                        <block v-if="v.reset_time">
                            <view class="box-grow-1 bargain-time dir-left-nowrap cross-center">
                                <block v-if="v.times.day > 0">
                                    <view class='info'>{{v.times.day}}</view>
                                    <view class="mark">天</view>
                                </block>
                                <view class="info">{{v.times.hour}}</view>
                                <view class="mark">:</view>
                                <view class="info">{{v.times.minute}}</view>
                                <view class="mark">:</view>
                                <view class="info">{{v.times.second}}</view>
                                <view class="mark">后结束</view>
                            </view>
                            <view class="box-grow-0 dir-left-nowrap cross-center">
                                <view class="box-grow-1 dir-top-nowrap">
                                    <view class='min-price'>
                                        <block v-if="v.now_price == v.min_price">已砍至最低</block>
                                        <block v-else>离最低￥{{v.min_price}}</block>
                                    </view>
                                    <view class='price'>
                                        <block v-if="v.now_price == v.min_price">￥{{v.min_price}}</block>
                                        <block v-else>还差￥{{v.reset_price}}</block>
                                    </view>
                                </view>
                                <view class="box-grow-0">
                                    <app-button v-if="v.now_price == v.min_price" @click.native.stop="submit(v)" height="64"
                                                width="176" color="#FFFFFF" background="#ff6700" font-size="28"
                                                round>立即购买
                                    </app-button>
                                    <app-button v-else @click.native.stop="goto(v)" height="64" width="176" color="#FFFFFF"
                                                :theme="getTheme" font-size="28" round>继续砍价
                                    </app-button>
                                </view>
                            </view>
                        </block>
                        <block v-else>
                            <view class="box-grow-1"></view>
                            <view class="box-grow-0">
                                <view class="box-grow-1 bargain-content">{{v.content}}</view>
                                <view class="box-grow-0 price">{{v.status_content}}</view>
                            </view>
                        </block>
                    </view>
                </view>
            </block>
        </view>
        <common-buttom :theme="getTheme" status="prize"></common-buttom>
    </app-layout>
</template>

<script>
    import commonButtom from "../common-buttom.vue";
    import {mapGetters} from "vuex";

    export default {
        name: "order-list",
        components: {commonButtom},
        data() {
            let integral;
            return {
                integral,
                list: [],
                args: false,
                page: 1,
                load: false,
            }
        },
        computed: {
            ...mapGetters('mallConfig',{
                getTheme: 'getTheme',
            }),
        },
        onReachBottom: function () {
            const self = this;
            if (self.args || self.load)
                return;
            self.load = true;
            let page = self.page + 1;
            self.$request({
                url: self.$api.bargain.list,
                data: {
                    page: page,
                }
            }).then(info => {
                if (info.code === 0) {
                    [self.page, self.args] = [page, info.data.list.length === 0];
                    self.getIntegral(self.list.concat(info.data.list));
                }
                self.load = false;
            });
        },

        onShow: function () {
            const self = this;
            self.$showLoading();
            self.$request({
                url: self.$api.bargain.list,
            }).then(info => {
                self.$hideLoading();
                if (info.code === 0) {
                    self.getIntegral(info.data.list);
                }
                self.args = false;
                self.page = 1;
            }).catch(e => {
                self.$hideLoading();
            })
        },
        onUnload() {
            clearInterval(this.integral);
        },
        methods: {
            navGoods(v) {
                uni.navigateTo({url: '/plugins/bargain/goods/goods?goods_id=' + v.goods_id});
            },
            goto(v) {
                uni.navigateTo({url: "/plugins/bargain/activity/activity?id=" + v.bargain_order_id});
            },
            getIntegral: function (list) {
                const self = this;
                clearInterval(self.integral);
                let func = function () {
                    list.forEach((value, key, array) => {
                        if (value.status) return;
                        let time = value.finish_at.replace(/-/g, '/');
                        let diff_time = parseInt((new Date(time).getTime() - new Date().getTime()) / 1000)
                        let day = 0, hour = 0, minute = 0, second = 0;
                        if (diff_time > 0) {
                            day = Math.floor(diff_time / (60 * 60 * 24));
                            hour = Math.floor(diff_time / (60 * 60)) - (day * 24);
                            minute = Math.floor(diff_time / 60) - (day * 24 * 60) - (hour * 60);
                            second = Math.floor(diff_time) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                            value.times = {day, hour, minute, second};
                        } else {
                            value.times = second;
                        }
                    });
                    self.list = list;
                }
                func(list);
                self.integral = setInterval(() => {
                    func(list);
                }, 1000);
            },

            submit: function (bargain) {
                const mchList = [{
                    "mch_id": 0,
                    "bargain_order_id": bargain.bargain_order_id,
                    "goods_list": [{
                        "id": bargain.goods_id,
                        "attr": [],
                        "num": 1,
                        "cart_id": 0,
                        "goods_attr_id": bargain.goods_attr_id
                    }]
                }];

                uni.navigateTo({
                    url: '/pages/order-submit/order-submit?mch_list=' +
                        JSON.stringify(mchList) +
                        '&preview_url=' + encodeURIComponent(this.$api.bargain.order_preview) +
                        '&submit_url=' + encodeURIComponent(this.$api.bargain.order_submit)
                });
            },
        }

    }
</script>
<style scoped lang="scss">
    .no-content {
        padding: #{150rpx} 0;
        text-align: center;
        color: #888;
    }

    .order-list {

    }

    .bargain-list {
        padding: #{24rpx};
        margin-bottom: #{8rpx};
        background: #ffffff;

        image {
            height: #{216rpx};
            width: #{215rpx};
            display: block;
        }

        .bargain-right {
            margin-left: #{20rpx};
            min-height: #{216rpx};
        }

        .bargain-time {
            margin: #{8rpx} 0;
            font-size: #{26rpx};

            .info {
                width: #{45rpx};
                height: #{38rpx};
                background: #666666;
                color: #FFFFFF;
                text-align: center;
                border-radius: #{4rpx};
                line-height: #{38rpx};
            }

            .mark {
                color: #666666;
                margin: 0 #{10rpx};
            }
        }

        .self {
        }

        .min-price {
            color: #999999;
            font-size: #{24rpx};
        }

        .price {
            margin-top: #{8rpx};
            color: #ff4544;
            font-size: #{28rpx};
        }

        .bargain-content {
            margin-bottom: #{64rpx};
            color: #666666;
            font-size: #{24rpx};
        }

        .bargain-name {
            font-size: #{28rpx};
            color: #353535;
        }

        .attr {
            color: #999999;
            margin: #{12rpx 0 16rpx 0};
            font-size: $uni-font-size-weak-one;
        }
    }
</style>