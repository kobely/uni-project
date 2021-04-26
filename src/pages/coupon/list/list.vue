<template>
    <app-layout>
        <view class="page">
            <view class="coupon-item" v-for="item in list" :key="item.id">
                <image class="coupon-bg" :src="couponImg[item.is_receive == '0' ? 'coupon_enabled' : 'coupon_disabled']" ></image>
                <view class="coupon-left dir-left-nowrap" @click="toDetail(item.id)">
                    <view class="coupon-price t-omit box-grow-0">
                        <template v-if="item.type == 2">
                            <text>{{item.sub_price | keepNumbers}}</text>
                        </template>
                        <template v-else>
                            <text>{{item.discount | keepNumbers}}</text>

                            折
                        </template>
                    </view>
                    <view class="box-grow-1 dir-top-nowrap main-center coupon-content">
                        <view class="t-omit" style="width:auto;display:block;">{{item.name}}</view>
                        <view class="min_price t-omit" v-if="item.min_price > 0">满{{item.min_price | keepNumbers}}可用</view>
                        <view v-else>无门槛使用</view>
                        <view v-if="item.discount_limit">优惠上限:￥{{item.discount_limit | keepNumbers}}</view>
                    </view>
                </view>
                <view class="use-btn" @click="receive(item)" v-if="item.is_receive == `0`">
                    <view class="use" style="text-align: center">立即领取</view>
                </view>
                <button class="use use-btn" style="color:#b4b4b4;" v-else-if="item.is_receive == `1`">已领取</button>
                <view class="coupon-info" @click="toDetail(item.id)">
                    <view v-if="item.expire_type == `1`">领取后{{item.expire_day}}天过期</view>
                    <view v-if="item.expire_type == `2`">有效日期: {{item.begin_time}} - {{item.end_time}}</view>
                    <view class="t-omit" v-if="item.appoint_type == `3`">适用范围：全场通用</view>
                    <view class="t-omit" v-else-if="item.appoint_type == `4`">适用范围：仅限当面付活动使用</view>
                    <view class="t-omit" v-else-if="item.appoint_type == `5`">适用范围：仅限礼品卡使用</view>
                    <view class="t-omit" v-else-if="item.appoint_type == `2`">
                        <text>适用商品：</text>
                        <text v-for="(goods,index) in item.goods" :key="goods.id">
                            <text>{{index != 0 ? '、' : ''}}{{goods.name}}</text>
                        </text>
                    </view>
                    <view class="t-omit" v-else-if="item.appoint_type == `1`">
                        <text>适用分类：</text>
                        <text v-for="(cat,index) in item.cat" :key="cat.id">
                            <text>{{index != 0 ? '、' : ''}}{{cat.name}}</text>
                        </text>
                    </view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
import {mapGetters, mapState} from "vuex";

    export default {
        data() {
            return {
                list: [],
                loading: false,
                page: 2,
            }
        },
        computed: {
            ...mapState({
                couponImg: state => state.mallConfig.__wxapp_img.coupon,
            }),
            ...mapGetters({
                userInfo: 'user/info',
            })
        },
        methods: {
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.coupon.list,
                    method: 'get',
                }).then(response => {
                    uni.hideLoading();
                    that.$hideLoading();
                    if (response.code === 0) {
                        that.list = response.data.list;
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    uni.hideLoading();
                    that.$hideLoading();
                });
            },
            getMore() {
                let that = this;
                uni.showLoading({
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.coupon.list,
                    data: {
                        page: that.page
                    },
                }).then(e => {
                    uni.hideLoading();
                    if (e.code == 0) {
                        if (e.data.list.length > 0) {
                            that.list = that.list.concat(e.data.list);
                            that.page++;
                        }
                    } else {
                        uni.showToast({
                            title: e.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(e => {
                    uni.hideLoading();
                });
            },
            toDetail(id) {
                uni.navigateTo({
                    url: '/pages/coupon/details/details?id=' + id
                });
            },
            receive(coupon) {

                let that = this;
                if(that.loading) {
                    return false
                }
                that.loading = true;
                uni.showLoading({
                    title: '领取中...'
                });
                that.$request({
                    url: that.$api.coupon.receive,
                    data: {
                        coupon_id: coupon.id
                    },
                }).then(response => {
                    that.loading = false;
                    uni.hideLoading();
                    if (response.code === 0) {
                        setTimeout(function (row) {
                            that.$store.dispatch('page/actionSetCoupon', {
                                list: [Object.assign(coupon, response.data)],
                                type: 'receive'
                            });
                            that.getList();
                        }, 200)
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                        that.getList();
                    }
                }).catch(() => {
                    uni.hideLoading();
                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(() => {
                        that.receive(coupon);
                    });
                });
            },
        },
        onLoad() { this.$commonLoad.onload();

        },
        onShow() {
            this.$showLoading({
                text: '加载中...'
            });
            this.getList();
        },
        filters: {
            keepNumbers(n) {
                return Number(n);
            }
        },
        onReachBottom() {
            this.getMore();
        },
    }
</script>

<style scoped lang="scss">
    .page {
        padding: #{20rpx} #{25rpx};
        width: 100%;
    }

    .coupon-item {
        height: #{275rpx};
        position: relative;
        margin-bottom: #{20rpx};
    }

    .coupon-bg {
        height: #{160rpx};
        width: 100%;
    }

    .coupon-left {
        position: absolute;
        left: #{20rpx};
        top: #{30rpx};
        color: #fff;
        width: 70%;
    }

    .coupon-left .coupon-price {
        float: left;
        max-width: 55%;
        width: auto;
        height: #{92rpx};
        line-height: #{92rpx};
        margin-right: #{20rpx};
    }

    .coupon-left .min_price {
        width: auto;
    }

    .coupon-price text {
        font-size: #{60rpx};
    }

    .use {
        height: #{56rpx};
        line-height: #{58rpx};
        background-color: #fff;
        width: #{160rpx};
        border-radius: #{28rpx};
        font-size: #{24rpx};
        color: #caa76e;
    }

    .use-btn {
        height: #{55rpx};
        width: #{160rpx};
        border-radius: #{27.5rpx};
        position: absolute;
        right: #{20rpx};
        border: 0;
        top: #{48rpx};
    }

    .coupon-info {
        position: absolute;
        top: #{160rpx};
        left: 0;
        right: 0;
        height: #{115rpx};
        background-color: #fff;
        border: #{2rpx} solid #cfcfcf;
        border-top: 0;
        padding: #{20rpx} #{25rpx};
        font-size: #{26rpx};
        color: #666;
        border-bottom-left-radius: #{15rpx};
        border-bottom-right-radius: #{15rpx};
    }

    .discount_limit {
        width: #{286rpx};
        text-align: center;
        color: #ffffff;
    }

    .coupon-content {
        font-size: $uni-font-size-general-one;
        line-height: 1.1;
    }
</style>
