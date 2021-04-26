<template>
    <view class="coupon" v-if="newCoupons.length > 0">
        <view class="marketing">
            <view class="block dir-left-nowrap cross-center" @click="setShow">
                <text class="box-grow-0 bd-name">领券</text>
                <view class="big-box dir-left-nowrap cross-center" v-for="(item, index) in newCoupons" :key="index">
                    <view class="box" :style="{'color':theme.color}">
                        满{{item.min_price}}元{{item.type == 1 ? '享' : '减'}}{{item.type == 1 ?item.discount + '折' : item.sub_price}}
                        <view class="left"></view>
                        <view class="right"></view>
                    </view>
                </view>
                <image class="box-grow-0" src="/static/image/icon/arrow-right.png"></image>
            </view>
        </view>
        <u-popup v-model="show" mode="bottom" border-radius="14" @close="show = false">
            <view class="model">
                <view class="f-top dir-left-nowrap main-between cross-center">
                    <view class="f-title">可领取优惠券</view>
                    <view class="f-image" @click="show = false">
                        <image class="f-img" src="/static/image/icon/icon-close.png" ></image>
                    </view>
                </view>
                <scroll-view :scroll-y="true" class="f-scroll">
                    <view class="f-scroll-content">
                        <view class="f-item dir-top-nowrap" v-for="(item, index) in coupons" :key="index">
                            <view class="f-item-top">
                                <image :src="couponImg[item.is_receive == 0 ? 'coupon_enabled' : 'coupon_disabled']"></image>
                                <view class="dir-left-nowrap main-between cross-center">
                                    <view class="f-text-content dir-left-nowrap cross-bottom">
                                        <view class="f-big-text-dis" v-if="item.type == 1">
                                            <text>{{item.discount}}</text>
                                            <text>折</text>
                                        </view>
                                        <view class="f-big-text-pri" v-else-if="item.type == 2">
                                            <text>￥</text>
                                            <text>{{item.sub_price}}</text>
                                        </view>
                                        <view class="f-small-text">
                                            <view>优惠券</view>
                                            <view>满{{item.min_price}}元使用</view>
                                        </view>
                                    </view>
                                    <button @click="receive(item.id, index)" :style="{'color': item.is_receive == 0 ? '#caa76e' : '#b4b4b4'}">{{item.is_receive == 0 ? '立即领取' : '已领取'}}</button>
                                </view>
                            </view>
                            <view class="f-item-bottom dir-top-nowrap">
                                <text v-if="item.expire_type == `1`">领取后{{item.expire_day}}天过期</text>
                                <text v-if="item.expire_type == `2`">有效日期：{{item.begin_time}} - {{item.end_time}}</text>
                                <text class="t-omit" v-if="item.appoint_type == `3`">适用范围：全场通用</text>
                                <text class="t-omit" v-else-if="item.appoint_type == `4`">适用范围：仅限当面付活动使用</text>
                                <text class="t-omit" v-else-if="item.appoint_type == `5`">适用范围：仅限礼品卡使用</text>
                                <text class="t-omit" v-else-if="item.appoint_type == `2`">
                                    <text>适用商品：</text>
                                    <block v-for="(goods,index) in item.goods" :key="goods.id">
                                        <text>{{index !== 0 ? '、' : ''}}{{goods.name}}</text>
                                    </block>
                                </text>
                                <text class="t-omit" v-else-if="item.appoint_type == `1`">
                                    适用分类：
                                    <block v-for="(cat,index) in item.cat" :key="cat.id">
                                        {{index !== 0 ? '、' : ''}}{{cat.name}}
                                    </block>
                                </text>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </u-popup>
    </view>
</template>

<script>

import uPopup from '../../basic-component/u-popup/u-popup.vue';
import appExclusiveCoupon from '../../page-component/app-exclusive-coupon/app-exclusive-coupon.vue';
import {mapState} from "vuex";
import user from '../../../core/user.js';

export default {
    name: 'bd-coupon',
    props: {
        coupons: Array,
        theme: Object,
        guarantee_title: {
            type: String
        },
    },
    data() {
        return {
            show: false,
            newCoupons: []
        }
    },
    methods: {
        async receive(id, index) {
            uni.showLoading({
                mask: true,
                title: '领取中'
            });
            const e = await this.$request({
                url: this.$api.coupon.receive,
                data: {
                    coupon_id: id
                }
            });
            uni.hideLoading();
            if (e.code === 1) {
                uni.showModal({
                    title: '提示',
                    content: e.msg,
                    showCancel: false,
                });
            } else {
                if (e.data.rest == 0) {
                    this.$emit('change', index);
                }
                uni.showToast({
                    icon: 'none',
                    title: '领取成功',
                    duration: 1000,
                });
            }
        },
        setShow() {
            if (user.isLogin()) {
                this.show = true;
            } else {
                this.$user.getInfo();
            }

        }
    },
    computed: {
        ...mapState({
            couponImg: state => state.mallConfig.__wxapp_img.coupon,
        })
    },
    components: {
        uPopup,
        appExclusiveCoupon
    },
    watch: {
        coupons: {
            handler(data) {
                this.newCoupons = data.slice(0, 3);
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

<style scoped lang="scss">
.content {
    padding: 10upx 0 10upx  30upx;
}
.marketing {
    width: 702upx;
    border-radius: 15upx;
    padding: 20upx;
    background-color: #ffffff;
    height: 88upx;
    line-height: 48upx;
    margin: 24upx 24upx 0 24upx;
    .block {

        position: relative;
        image {
            width: 12upx;
            height: 22upx;
            position: absolute;
            right: 0;
        }
        .bd-name {
            margin-right: 26upx;
            font-size: #{26upx};
            color: #999999;
        }
    }
}
.big-box {
    overflow: hidden;
    margin-right: 10upx;
}
.box {
    border: 1upx solid;
    border-radius: 4upx;
    position: relative;
    display: inline-block;
    box-sizing: content-box;
    padding: 0 12upx;
    font-size: 20upx;
    height: 30upx;
    line-height: 32upx;
    .left,.right {
        width: 10upx;
        height: 10upx;
        border-radius: 50%;
        position: absolute;
        z-index: 1;
        top: 50%;
        border: 1upx solid;
        background-color: #ffffff;
    }
    .left {
        left: 0;

        transform: translate(-51%, -50%);
    }
    .right {
        right: 0;
        transform: translate(51%,-50%);
    }
}
.model {
    height: 80vh;
    width: 750upx;
    .f-top {
        height: 105upx;
        border-bottom: 1upx solid #e2e2e2;
        padding-left:24upx;
        background-color: #ffffff;
        .f-image {
            width: 78upx;
            height: 78upx;
            padding: 24upx;
            .f-img {
                width: 30upx;
                height: 30upx;
            }
        }
    }
    .f-scroll {
        height: calc(80vh - 105upx);
        width: 100%;
        background-color: #f7f7f7;
        .f-scroll-content {
            padding: 0 24upx;
            height: 995upx;
            width: 100%;
        }
        .f-item {
            width: 702upx;
            height: 272upx;
            border: 1upx solid #cfcfcf;
            margin-top: 17upx;
            border-radius: 14upx;
            background-color: #ffffff;
        }
        .f-item:last-child {
            margin-bottom: 24upx;
        }
        .f-item-top {
            height: 159upx;
            position: relative;
            >image {
                height: 159upx;
                width: 100%;
            }
            >view {
                position: absolute;
                top: 0;
                width: 702upx;
                height: 159upx;
                padding: 0 24upx;
                color: #ffffff;
            }
            .dir-left-nowrap>button {
                width: 161upx;
                height: 56upx;
                line-height: 56upx;
                padding: 0;
                border: none;
                margin: 0;
                border-radius: 28upx;
                background-color: #ffffff;
                font-size: 26upx;
                text-align: center;
            }
            .f-text-content {
                padding-bottom: 25upx;
            }
            .f-big-text-dis text{
                line-height: 1;
            }
            .f-big-text-dis text:first-child {
                font-size: 56upx;
                font-weight: bold;
            }
            .f-big-text-dis text:last-child {
                font-size: 34upx;
                margin-left: 14upx;
            }
            .f-small-text {
                font-size: 24upx;
                margin-left: 27upx;
            }
            .f-big-text-pri text {
                line-height: 1;
            }
            .f-big-text-pri text:first-child {
                font-size: 27upx;
            }
            .f-big-text-pri text:last-child  {
                font-size: 56upx;
                font-weight: bold;
            }
        }
        .f-item-bottom {
            height: 111upx;
            padding: 24upx;
            text {
                font-size: 22upx;
                color: #545454;
            }
        }
    }
}

</style>