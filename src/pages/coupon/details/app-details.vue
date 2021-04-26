<template>
    <view class="page" v-if="list">
        <view>
            <!-- 优惠券信息 -->
            <view class="info-top">
                <view class="name">{{list.name}}</view>
                <template v-if="list.type == 2">
                    <view class="price">￥{{list.sub_price | reservedNum}}</view>
                </template>
                <template v-else-if="list.type == 1">
                    <view class="price">{{list.discount | reservedNum}}折</view>
                </template>
                <view v-if="isShowShare" class="share-img">
                    <image src="/static/image/coupon/btn_share.png" @click="shareShow = true"></image>
                    <view>
                        <app-share-qr-code v-model="shareShow" title="生成优惠券海报"
                                           @share="hShareAppMessage"
                                           :poster-url="`/pages/poster/poster?coupon_id=` + list.id"
                                           :has-poster-nav="true"
                        ></app-share-qr-code>
                    </view>
                </view>
                <view v-if="list.min_price > 0">满{{list.min_price | reservedNum}}可用</view>
                <view v-else-if="list.min_price == 0">无门槛使用</view>
                <view v-if="list.discount_limit">优惠上限:￥{{list.discount_limit | reservedNum}}</view>
                <view v-if="list.appoint_type == 4">
                    <view class="scan-code">仅限当面付活动使用</view>
                </view>
                <view v-if="list.appoint_type == 5">
                    <view class="scan-code">仅限礼品卡使用</view>
                </view>
                <view @click="toGoods" v-if="list.status == 1">
                    <button style="background-color: #fff;color: #ff4544;border: 1rpx solid #ff4544"
                            :class="[`btn`]">
                        立即使用
                    </button>
                </view>
                <view @click="receive(list.id)" v-else-if="list.status == 0">
                    <button style="color:#fff;border: 1rpx solid #ff4544;background: #ff4544;" :class="[`btn`]">立即领取
                    </button>
                </view>
                <button class="btn used" v-else-if="list.status == 2">已使用</button>
                <button class="btn used" v-else-if="list.status == 3">已过期</button>
                <button class="btn used" v-else-if="list.status == 4">已领取</button>
            </view>
            <!-- 分割线 -->
            <view class="line">
                <image src="./../image/line.png"></image>
            </view>
            <!-- 优惠券使用信息 -->
            <view class="details">
                <view class="title">有效期</view>
                <view v-if="list.expire_type == '2'">{{list.begin_time}} - {{list.end_time}}
                </view>
                <view v-else-if="list.expire_day > 0">领取后{{list.expire_day}}天内有效</view>
                <view class="title">使用规则</view>
                <view v-if="list.appoint_type == '1'">本券仅限购买
                    <text v-for="(cat,index) in list.cat" :key="cat.id">{{cat.name}}
                        <text v-if="index !== list.cat.length -1">、</text>
                    </text>
                    分类下的商品。
                </view>
                <view v-if="list.appoint_type == '2'">本券仅限购买
                    <text v-for="(good,index) in list.goods" :key="good.id">{{good.name}}
                        <text v-if="index !== list.goods.length -1">、</text>
                    </text>
                    。
                </view>
                <view v-if="list.appoint_type == '3'">本券全场通用。</view>
                <view v-if="list.appoint_type == '4'">本券仅限当面付活动使用。</view>
                <view v-if="list.appoint_type == '5'">本券仅限礼品卡使用。</view>
                <view class="title">使用说明</view>
                <view>
                    <text style="word-break: break-all;">{{list.rule}}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {mapGetters} from "vuex";
    import appShareQrCode from '@/components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';

    export default {
        name: "app-details",
        components: {appShareQrCode},
        props: {
            isShowShare: Boolean,
            couponId: {
                type: String,
                default() {
                    return '0';
                }
            },
            // 入口类型 0--领券中心 1--会员专享 2--我的优惠券
            type: {
                type: Number,
                default() {
                    return 0;
                }
            },
            detailList: {
                type: Object,
                default() {
                    return null;
                }
            }
        },
        data() {
            return {
                list: {},
                shareShow: false,
            };
        },
        computed: {
            ...mapGetters({
                userInfo: 'user/info',
            })
        },
        watch: {
            // #ifndef H5
            couponId() {
                if (this.couponId > 0) {
                    this.getList(this.couponId);
                }
            },
            // #endif
            detailList() {
                if (this.detailList) {
                    this.list = this.detailList;
                }
            }
        },
        created() {
            // #ifdef H5
            if (this.couponId > 0) {
                this.getList(this.couponId);
            }
            // #endif
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.hShareAppMessage();
        },
        // #endif
        methods: {
            hShareAppMessage(s= false){
                return this.$shareAppMessage({
                    title: this.list.name,
                    imageUrl:"",
                    path: "/pages/coupon/details/details",
                    params: {
                        id: this.list.id
                    }
                }, s);
            },
            getList(id) {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                let url = that.$api.coupon.detail;
                let para = {
                    coupon_id: id
                };
                if (this.type === 2) {
                    url = that.$api.coupon.user_coupon_detail;
                    para = {
                        user_coupon_id: id
                    };
                }
                that.$request({
                    url: url,
                    data: para
                }).then(response => {
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
                    that.$hideLoading();
                });
            },
            toGoods() {
                uni.navigateTo({
                    url: this.list.page_url
                });
            },
            receive(id) {

                let that = this;
                if (this.type === 2) {
                    return false;
                }
                if (that.loading) {
                    return false
                }
                that.loading = true;
                uni.showLoading({
                    title: '领取中...'
                });
                that.$request({
                    url: that.type === 1 ? that.$api.member.receive : that.$api.coupon.receive,
                    data: {
                        coupon_id: id
                    },
                }).then(response => {
                    that.loading = false;
                    uni.hideLoading();
                    if (response.code === 0) {
                        uni.showToast({
                            title: response.msg,
                            duration: 1000,
                            mask: true,
                        });
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000,
                            mask: true,
                        });
                    }
                    this.getList(id);
                }).catch(() => {
                    uni.hideLoading();
                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(() => {
                        that.receive(id);
                    });
                });
            },
        },
        filters: {
            reservedNum(data) {
                return Number(data);
            }
        }
    }
</script>

<style scoped lang="scss">
    .page {
        height: 100%;
        background-color: #d6b985;
        width: 100%;
        padding: #{20rpx} 0;
        position: absolute;
    }

    .info-top {
        background-color: #fff;
        margin: 0 #{25rpx};
        text-align: center;
        padding-top: #{60rpx};
        padding-bottom: #{8rpx};
        border-top-left-radius: #{25rpx};
        border-top-right-radius: #{25rpx};
        color: #353535;
        font-size: #{32rpx};
        position: relative;
    }

    .name {
        font-size: #{28rpx};
        color: #666;
    }

    .price {
        font-size: #{56rpx};
        margin-top: #{28rpx};
        margin-bottom: #{10rpx};
    }

    .scan-code {
        height: #{56rpx};
        line-height: #{52rpx};
        margin: #{35rpx} auto 0;
        color: #ff4544;
        font-size: #{30rpx};
        border: none;
    }

    .btn {
        height: #{56rpx};
        line-height: #{52rpx};
        width: #{240rpx};
        margin: #{35rpx} auto 0;
        font-size: #{30rpx};
        border-radius: #{28rpx};
        border: #{2rpx} solid;
    }

    .btn.used {
        background-color: #f7f7f7;
        color: #acacac;
        border: #{2rpx} solid #f7f7f7;
    }

    .btn::after {
        border: 0;
    }

    .line {
        height: #{50rpx};
        margin: #{-4rpx} #{25rpx} 0;
        background-color: #fff;
    }

    .line image {
        height: 100%;
        width: 100%;
    }

    .details {
        background-color: #fff;
        margin: #{-4rpx} #{25rpx} 0;
        font-size: #{28rpx};
        padding: #{25rpx} #{40rpx} #{65rpx};
        border-bottom-left-radius: #{25rpx};
        border-bottom-right-radius: #{25rpx};
    }

    .details .title {
        color: #b0b0b0;
        font-size: #{26rpx};
        margin-bottom: #{25rpx};
        margin-top: #{50rpx};
    }

    .scan-code {
        height: #{56rpx};
        line-height: #{52rpx};
        margin: #{35rpx} auto 0;
        color: #ff4544;
        font-size: #{30rpx};
        border: none;
    }

    .info-top .share-img {
        position: absolute;
        right: #{32rpx};
        top: #{32rpx};
        z-index: 5;
        width: #{94rpx};
        height: #{94rpx};

        image {
            width: 100%;
            height: 100%;
            display: block;
        }
    }
</style>
