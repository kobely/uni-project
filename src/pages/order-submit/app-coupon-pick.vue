<template>
    <view class="app-coupon-pick">
        <view class="coupon-tab dir-left-nowrap cross-center" @touchmove.stop="true">
            <view @click="couponType=1"
                  class="box-grow-1"
                  :style="{'color': couponType==1 && !is_gift ? theme.background : ''}"
                  :class="couponType==1 && is_gift ? theme + '-color ' + theme : ''">可用优惠券
                <template v-if="list">({{list.length}})</template>
                <view class="active-block"
                      :style="{'background-color': is_gift ? '' : theme.background,'display': couponType==1 ? 'block':'none'}"
                      :class="is_gift ? theme + '-background ' + theme : ''"></view>
            </view>
            <view class="box-grow-0 split"></view>
            <view @click="couponType=0"
                  class="box-grow-1"
                  :style="{'color': couponType==0 && !is_gift ? theme.background : ''}"
                  :class="couponType==0 && is_gift ? theme + '-color ' + theme : ''">不可用优惠券
                <template v-if="cantUseList">({{cantUseList.length}})</template>
                <view class="active-block"
                      :style="{'background-color': is_gift ? '' : theme.background,'display': couponType==0 ? 'block':'none'}"
                      :class="is_gift ? theme + '-background ' + theme : ''"></view>
            </view>
        </view>
        <scroll-view scroll-y="true" class="list-scroll">
            <view class="coupon-list" v-if="couponType == 1">
                <view v-if="list === null" style="padding: 50rpx; text-align: center; color: #999;">加载中</view>
                <template v-else>
                    <view v-if="!list.length" style="padding: 128rpx; text-align: center;">
                        <image src="/static/image/no-goods.png"
                               style="width: 240rpx;height: 240rpx;margin-bottom: 36rpx;"></image>
                        <view style="color: #999999;">暂无可用优惠券</view>
                    </view>
                    <template v-else>
                        <view v-for="(item,index) in list"
                              :key="index"
                              class="item">
                            <view class="dir-left-nowrap cross-center top"
                                  :style="{
                                  backgroundImage: `url(${appImg.order_submit.coupon_bg})`,
                                  }">
                                <view class="box-grow-0 mr-32">
                                    <view v-if="item.type==1" class="dir-left-nowrap cross-bottom">
                                        <view style="font-size: 72rpx;line-height: 1;">{{item.discount}}</view>
                                        <view style="line-height: 1.75">折</view>
                                    </view>
                                    <view v-else class="dir-left-nowrap cross-bottom">
                                        <view style="line-height: 1.75">￥</view>
                                        <view style="font-size: 72rpx;line-height: 1;">{{item.sub_price}}</view>
                                    </view>
                                </view>
                                <view class="box-grow-1" style="font-size: 24rpx;">
                                    <view class="desc-row">{{item.coupon_data.name}}</view>
                                    <view class="desc-row">满{{item.coupon_min_price}}元可用</view>
                                    <view v-if="item.discount_limit" class="desc-row">
                                        优惠上限:￥{{item.discount_limit}}
                                    </view>
                                </view>
                                <app-submit-checkbox
                                        :round="true"
                                        v-model="item.checked"
                                        :theme="theme"
                                        border-color="#999999"
                                        @input="handleCouponChange"
                                        :sign="index"></app-submit-checkbox>
                            </view>
                            <view class="bottom">
                                <view style="margin-bottom: 12rpx;">有效日期：{{item.start_time}}-{{item.end_time}}</view>
                                <view>适用范围：{{item.coupon_data.appoint_type == 3 ? '全场通用' : item.coupon_data.appoint_type == 5?'礼品卡' : '限品类'}}</view>
                            </view>
                        </view>
                    </template>
                </template>
            </view>
            <view class="coupon-list" v-else>
                <view v-if="cantUseList === null" style="padding: 50rpx; text-align: center; color: #999;">加载中</view>
                <template v-else>
                    <view v-if="!cantUseList.length" style="padding-top: 128rpx; text-align: center;">
                        <image src="/static/image/no-goods.png"
                               style="width: 240rpx;height: 240rpx;margin-bottom: 36rpx;"></image>
                        <view style="color: #999999;">暂无不可用优惠券</view>
                    </view>
                    <template v-else>
                        <view v-for="(item,index) in cantUseList"
                              :key="index"
                              class="item">
                            <view class="dir-left-nowrap cross-center top"
                                  :style="{
                                  backgroundImage: `url(${appImg.order_submit.coupon_bg_disable})`,
                                  }">
                                <view class="box-grow-0 mr-32">
                                    <view v-if="item.type==1" class="dir-left-nowrap cross-bottom">
                                        <view style="font-size: 72rpx;line-height: 1;">{{item.discount}}</view>
                                        <view style="line-height: 1.75">折</view>
                                    </view>
                                    <view v-else class="dir-left-nowrap cross-bottom">
                                        <view style="line-height: 1.75">￥</view>
                                        <view style="font-size: 72rpx;line-height: 1;">{{item.sub_price}}</view>
                                    </view>
                                </view>
                                <view class="box-grow-1" style="font-size: 24rpx;">
                                    <view class="desc-row">{{item.coupon_data.name}}</view>
                                    <view class="desc-row">满{{item.coupon_min_price}}元可用</view>
                                    <view v-if="item.discount_limit" class="desc-row">
                                        优惠上限:￥{{item.discount_limit}}
                                    </view>
                                </view>
                            </view>
                            <view class="bottom">
                                <view style="margin-bottom: 12rpx;">有效日期：{{item.start_time}}-{{item.end_time}}</view>
                                <view>适用范围：{{item.coupon_data.appoint_type == 3 ? '全场通用' : '限品类'}}</view>
                            </view>
                        </view>
                    </template>
                </template>
            </view>
        </scroll-view>
    </view>
</template>

<script>
    import {mapState} from 'vuex';
    import AppSubmitCheckbox from "./app-submit-checkbox.vue";

    export default {
        name: "app-coupon-pick",
        components: {
            AppSubmitCheckbox
        },
        props: {
            theme: {
                type: [String,Object],
            },
            plugin: String,
            mchIndex: {
                type: Number,
                default: 0
            },
            noCoupons: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                couponType: 1,
                loading: false,
                list: null,
                is_gift: false,
                cantUseList: null
            }
        },
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img
            }),
        },
        created() {
            this.$store.commit('orderSubmit/mutSetMchNoCouponStatusList', []);
            this.is_gift = typeof(this.theme) == 'string' && this.theme.indexOf('gift') >= 0 ? true : false;
            this.loadData();
            this.loadData(true);
        },
        methods: {
            loadData(loadCantUse = false) {
                this.loading = true;
                this.$request({
                    url: this.$api.order.usable_coupon_list,
                    method: 'post',
                    data: {
                        form_data: JSON.stringify(this.$store.state.orderSubmit.formData.list[this.mchIndex]),
                        is_cant_use_list: loadCantUse ? 1 : 0,
                        sign: this.plugin
                    }
                }).then(response => {
                    this.loading = false;
                    if (response.code === 0) {
                        if (loadCantUse) {
                            this.cantUseList = response.data.list;
                        } else {
                            for (let i in response.data.list) {
                                response.data.list[i].checked = false;
                            }
                            this.list = response.data.list;
                            const mchNoCouponStatusList = this.$store.getters['orderSubmit/getMchNoCouponStatusList'];
                            let noCoupons = this.$validation.isEmpty(this.list);
                            this.$emit('update:noCoupons', noCoupons);
                            mchNoCouponStatusList[this.mchIndex] = noCoupons;
                            this.$store.commit('orderSubmit/mutSetMchNoCouponStatusList', mchNoCouponStatusList);
                        }
                    } else {
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            handleCouponChange({v, index}) {
                if (v) {
                    this.setData(this.list[index].id, index);
                } else {
                    this.setData(0, index);
                }
            },
            setData(data, index) {
                if (parseInt(data) === 0) {
                    this.list[index].checked = false;
                } else {
                    for (let i in this.list) {
                        this.list[i].checked = parseInt(index) === parseInt(i);
                    }
                }
                const formData = this.$store.state.orderSubmit.formData;
                formData.list[this.mchIndex].user_coupon_id = data;
                this.$store.commit('orderSubmit/mutSetFormData', formData);
                this.$emit('change');
            },
        },
    }
</script>

<style scoped lang="scss">
    .app-coupon-pick {
        .mr-32 {
            margin-right: #{32rpx};
        }

        .btn {
            height: #{56rpx};
            line-height: #{56rpx};
            padding: 0 #{32rpx};
            border-radius: #{1000rpx};
            background: #fff;
            text-align: center;
            border: #{1rpx} solid;
        }

        .btn:active {
            box-shadow: 0 0 #{100rpx} rgba(0, 0, 0, 0.05) inset;
        }

        .btn.use {
            color: #c5a977;
            border-color: transparent;
        }

        .btn.dont-use {
            height: #{80rpx};
            line-height: #{80rpx};
        }

        .coupon-tab {
            > view {
                text-align: center;
                padding: #{32rpx};
                position: relative;
            }

            .active {
            }

            .active-block {
                position: absolute;
                bottom: 0;
                left: 50%;
                height: #{4rpx};
                width: #{110rpx};
                margin-left: -#{60rpx};
                display: none;
            }

            .active {
                .active-block {
                    display: block;
                }
            }

            .split {
                width: #{1rpx};
                height: #{28rpx};
                background: #ddd;
                padding: 0;
            }

            border-bottom: #{1rpx} solid #ddd;
        }

        .list-scroll {
            overflow: hidden;
            background: #f7f7f7;
            height: #{913rpx};
        }

        .coupon-list {
            box-sizing: border-box;
            padding: #{32rpx};

            .item {
                margin: #{32rpx} 0;
                background: #fff;
                border-radius: #{16rpx};
                box-shadow: 0 0 #{10rpx} rgba(0, 0, 0, .05);
                overflow: hidden;

                .top {
                    padding: #{40rpx} #{24rpx};
                    color: #fff;
                    background-size: 100% 100%;

                    .desc-row {
                        margin: #{6rpx} 0;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }

                .bottom {
                    padding: #{24rpx} #{24rpx};
                    font-size: #{24rpx};
                }
            }
        }
    }
</style>