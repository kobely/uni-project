<template>
    <app-layout>
        <view class="coupon-head-btn">
            <app-button @click="pickCoupon(-1)" color="#999999" background="#FFFFFF" round>不使用优惠券</app-button>
        </view>
        <view class="coupon-box">
            <view class="coupon-item-container" v-for="(v,k) in list" :key="k">
                <app-form-id @click="pickCoupon(v)">
                    <view class="coupon-item">
                        <image :src="appImg.coupon_enable_bg" class="coupon-bg"></image>
                        <view class="dir-left-nowrap">
                            <view class="box-grow-0 cross-center box-left">
                                <view class="box-discount">
                                    <view v-if="v.type==1">{{v.discount}}折</view>
                                    <view v-if="v.type==2">￥{{v.sub_price}}</view>
                                    <view class="box-use">满{{v.coupon_min_price}}可用</view>
                                </view>
                            </view>
                            <view class="box-grow-1 cross-center coupon-right">
                                <view>
                                    <view class="coupon-name t-omit">{{v.coupon_data.name}}</view>
                                    <view class="box-time">
                                        <view>{{v.start_time}}~{{v.end_time}}</view>
                                    </view>
                                    <view>仅限当面付活动使用</view>
                                </view>
                                <icon v-if="coupon_id == v.id" class="icon-coupon-select" type></icon>
                            </view>
                        </view>
                    </view>
                </app-form-id>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "coupon",
        components: {},
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img.mall,
            }),
        },
        data() {
            return {
                list: [],
                page_loading: true,
                coupon_id: 0,
                price: '',
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            const self = this;
            [self.coupon_id, self.price] = [options.coupon_id, options.price];
            self.$showLoading({text: '加载中'});
            self.$request({
                url: self.$api.scan_code_pay.coupons,
                data: {
                    price: options.price,
                },
                method: 'post',
            }).then(e => {
                self.$hideLoading();
                if (e.code === 0) {
                    self.list = e.data.coupon_list;
                } else {
                    uni.showToast({icon: 'none', title: e.msg});
                }
            }).catch(e => {
                self.$hideLoading();
            });
        },
        methods: {
            pickCoupon(userCoupon) {
                this.$store.commit('scanCode/mutSetUserCoupon', userCoupon);
                uni.navigateBack({delta: 1});
            },
        }
    }
</script>

<style lang="scss">
    page {
        background: #fff;
    }
</style>
<style scoped lang="scss">
    .coupon-head-btn {
        padding: #{24rpx};
    }

    .coupon-box {
        padding: #{24rpx} #{34rpx} 0 #{34rpx};

        .box-left {
            height: #{152rpx};
            position: relative;
            .box-discount {
                text-align: center;
                color: #fff;
                width: #{194rpx};
            }

            .box-use {
                font-size: #{20rpx};
                padding-top: #{16rpx};
            }
        }
    }

    .coupon-item-container {
        margin-bottom: #{24rpx};
    }

    .coupon-item-container:last-child {
        margin-bottom: 0;
    }

    .coupon-item {
        position: relative;
        overflow: hidden;
    }

    .coupon-bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }

    .coupon-right {
        position: relative;
    }

    .coupon-right > view {
        padding: 0 #{30rpx};
        overflow: hidden;
        color: #666666;
        font-size: #{20rpx};
    }

    .coupon-right .icon-coupon-select {
        position: absolute;
        right: 0;
        top: 0;
        height: #{70rpx};
        width: #{70rpx};
        z-index: 1;
        background-image: url("../../../static/image/icon/coupon-select.png");
        background-size: 100% auto;
        background-repeat: no-repeat;
    }

    .coupon-right .box-time {
        padding: #{12rpx} 0;
    }

    .coupon-right .coupon-name {
        color: #353535;
        font-size: #{32rpx};
    }
</style>