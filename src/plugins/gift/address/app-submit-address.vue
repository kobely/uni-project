<template>
    <view class="app-submit-address">

        <view class="information dir-top-nowrap main-left">
            <view class="express dir-left-nowrap cross-center" @click="navigateAddress"
                  v-if="delivery === 'express' || delivery === 'city'">
                <view class="dir-top-nowrap content" v-if="address">
                    <view class="top dir-left-nowrap main-between">
                        <text class="font">收货人：{{address.name}}</text>
                        <text class="font">{{address.mobile}}</text>
                    </view>
                    <view class="bottom font t-omit-two">
                        收货地址：{{address.province}}{{address.city}}{{address.district}}{{address.detail}}
                    </view>
                </view>
                <view class="content font" v-else>请选择收货地址</view>
                <view>
                    <image class="icon-image" src="/static/image/icon/arrow-right.png"></image>
                </view>
            </view>
            <view class="lifting dir-left-nowrap cross-center main-between" v-else>
                <input type="text" placeholder="姓名" v-model="name">
                <input type="number" placeholder="电话" v-model="mobile">
            </view>
            <image class="line" :src="appImg.common.address_bottom"></image>
        </view>

        <view class="delivery-method dir-left-nowrap main-between cross-center">
            <view>配送方式</view>
            <view class="dir-left-nowrap main-between method">
                <text v-for="(item, index) in send_type" class="item" @click="setMethod(item.value)" :key="index"
                      :class="[`${delivery === item.value ? theme + '-background '+'text-color' : 'item-default'}`]">
                    {{item.name}}
                </text>
            </view>
        </view>

        <view class="store-information dir-top-nowrap" v-if="delivery === 'offline'">
            <view class="font" v-if="Object.keys(store).length === 0">
                暂无门店，请选择其他配送方式
            </view>
            <view class="font" v-if="Object.keys(store).length > 0">门店信息</view>
            <view class="dir-left-nowrap main-between cross-center" v-if="Object.keys(store).length > 0"
                  @click="route_go">
                <view class="content dir-top-nowrap">
                    <view class="dir-left-nowrap main-between">
                        <view class="font">{{store.name}}</view>
                        <view>
                            <image class="location" src="/static/image/icon/location.png"></image>
                            <text class="font">距您{{store.distance}}</text>
                        </view>
                    </view>
                    <view class="address">
                        {{store.address}}
                    </view>
                </view>
                <image class="icon-image" src="/static/image/icon/arrow-right.png"></image>
            </view>
        </view>

        <view class="city" v-if="delivery === 'city'">
            <template v-if="mch.city.error">
                <view class="dir-left-nowrap cross-center">
                    <view class="box-grow-1 t-omit error">{{mch.city.error}}</view>
                    <view class="box-grow-0 btn" @click="jump()">查看配送范围</view>
                </view>
            </template>
            <template v-else>
                <view class="t-omit">发货地址：{{mch.city.address}}</view>
                <view class="t-omit" v-if="mch.city.explain">{{mch.city.explain}}</view>
                <view class="dir-left-nowrap cross-center">
                    <view class="box-grow-1 t-omit error" style="color: #353535;">该地址在配送范围内</view>
                    <view class="box-grow-0 btn" @click="jump()">查看配送范围</view>
                </view>
            </template>
        </view>

        <view class="safe-area-inset-bottom u-bottom-fixed">
            <view class="button"  @click="submit" v-bind:class="[`${theme}-background`]">
                确认提交
            </view>
        </view>
    </view>
</template>

<script>
    import {mapState} from 'vuex';
    import appIphoneX from '../../../components/basic-component/app-iphone-x/app-iphone-x.vue';

    export default {

        props: [`theme`, `address`, `goods_id`, `user_order_id`, `store_list`, `store_index`, `send_type`, `goods`, `remark`, `mch`, `dis_send_type`, `diyForm`,
            `store`, `template_message_captain`],

        data() {
            return {
                delivery: 'express',
                name: '',
                mobile: '',
                send_text: '',
                hasCity: false,
            }
        },

        methods: {
            jump() {
                uni.navigateTo({
                    url: `/pages/order-submit/map`,
                });
            },
            navigateAddress() {
                let url = '/pages/order-submit/address-pick';
                url += '?sign=gift&id=' + this.user_order_id + '&hasCity=' + this.hasCity;
                uni.navigateTo({
                    url: url,
                });
            },

            setMethod(item) {
                this.delivery = item;
                this.send_text = item;
                this.hasCity = false;
                this.$emit('delivery', item);
                if (this.delivery === 'offline') {
                    this.$emit('setMethod');
                } else if (this.delivery === 'city') {
                    this.hasCity = true;
                    this.$emit('city');
                } else if (this.delivery === 'express') {
                    this.$emit('express');
                }
            },

            submit() {
                this.$subscribe(this.template_message_captain).then(() => {
                    this.submission();
                }).catch(() => {
                    this.submission();
                });
            },

            submission() {
                for (let i in this.goods) {
                    const item = this.goods[i];
                    if (!item.goods_form_validate_result) continue;
                    if (item.goods_form_validate_result.hasError) {
                        uni.showModal({
                            title: '提示',
                            content: item.goods_form_validate_result.errors[0].msg,
                            showCancel: false,
                        });
                        return;
                    }
                }
                uni.showLoading({
                    title: '提交中'
                });
                let data = {
                    list: [
                        {
                            mch_id: 0,
                            goods_list: [],
                            send_type: this.send_text,
                            store_id: this.store.id,
                            use_integral: 0,
                            user_coupon_id: 0,
                            remark: this.remark,
                            order_form: this.diyForm,
                        }
                    ],
                    address_id: this.address && this.address.id ? this.address.id : 0,
                    address: {
                        name: this.name,
                        mobile: this.mobile,
                    }
                };
                for (let i = 0; i < this.goods.length; i++) {
                    let good = {
                        id: this.goods[i].goods_id,
                        attr: [],
                        num: this.goods[i].num,
                        cat_id: 0,
                        goods_attr_id: this.goods[i].goods_attr_id,
                        cart_id: 0,
                        user_order_id: this.user_order_id,
                        form_data: this.goods[i].form_data,
                    };
                    let attr = [];
                    let attr_list = this.goods[i].goods_info;
                    for (let j = 0; j < attr_list.length; j++) {
                        attr.push({
                            attr_id: attr_list[j].attr_id,
                            attr_group_id: attr_list[j].attr_group_id,
                        })
                    }

                    good.attr = attr;
                    data.list[0].goods_list.push(good);
                }
                this.$request({
                    url: this.$api.gift.convert,
                    method: 'post',
                    data: {
                        form_data: JSON.stringify(data)
                    },
                }).then(res => {
                    if (res.code === 0) {
                        this.pay_data(res.data);
                    } else {
                        uni.hideLoading();
                        uni.showModal({
                            title: '提示',
                            content: res.msg,
                        })
                    }
                });
            },
            route_go() {
                uni.navigateTo({
                    url: `/pages/order-submit/store-pick?plugin=gift`
                })
            },

            pay_data(data) {
                this.$request({
                    url: this.$api.order.pay_data,
                    method: 'post',
                    data: {
                        ...data,
                    }
                }).then(res => {
                    if (res.code === 0) {
                        if (res.data.hasOwnProperty('id')) {
                            let id = res.data.id;
                            if (this.mch.express_price == 0) {
                                this.$request({
                                    url: this.$api.payment.get_payments,
                                    method: 'get',
                                    data: {
                                        id: id,
                                    }
                                }).then(res => {
                                    if (res.code === 0) {
                                        this.$request({
                                            url: this.$api.payment.pay_data,
                                            method: 'get',
                                            data: {
                                                id: id,
                                                pay_type: 'balance',
                                            }
                                        }).then(res => {
                                            if (res.code === 0) {
                                                this.$request({
                                                    url: this.$api.payment.pay_buy_balance,
                                                    data: {
                                                        id: id,
                                                    }
                                                }).then(res => {
                                                    if (res.code === 0) {
                                                        uni.hideLoading();
                                                        // uni.redirectTo({
                                                        //     url: `/plugins/gift/order/order`,
                                                        // })
                                                        uni.redirectTo({
                                                            url: `/pages/order-submit/pay-result?payment_order_union_id=${id}&order_page_url=${encodeURIComponent('/plugins/gift/order/order')}`,
                                                        });
                                                    } else {
                                                        uni.hideLoading();
                                                        uni.showModal({
                                                            title: '提示',
                                                            content: res.msg,
                                                        })
                                                    }
                                                })
                                            } else {
                                                uni.hideLoading();
                                                uni.showModal({
                                                    title: '提示',
                                                    content: res.msg,
                                                })
                                            }
                                        })
                                    } else {
                                        uni.hideLoading();
                                        uni.showModal({
                                            title: '提示',
                                            content: res.msg,
                                        })
                                    }
                                })
                            } else {
                                this.$payment.pay(id).then(msg => {
                                    // 支付成功
                                    uni.hideLoading();
                                    uni.redirectTo({
                                        url: `/plugins/gift/order/order`,
                                    })
                                }).catch(msg => {
                                    // 支付失败
                                    uni.hideLoading();
                                    uni.redirectTo({
                                        url: `/plugins/gift/order/order`,
                                    })
                                });
                            }
                        } else {
                            setTimeout(() => {
                                this.pay_data(data);
                            }, 1000);
                        }
                    } else {
                        uni.hideLoading();
                        uni.showModal({
                            title: '提示',
                            content: res.msg,
                        })
                    }
                })
            }
        },
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img,
            }),
        },

        watch: {
            send_type: {
                handler(v) {
                    if (v.length === 0) return;
                    for (let i = 0; i < v.length; i++) {
                        if (this.dis_send_type === v[0].value) {
                            this.delivery = v[0].value;
                            this.send_text = v[0].value;
                            if (v[0].value === 'city') {
                                this.hasCity = true;
                            }
                        }
                    }
                },
                immediate: true
            }
        },

        components: {
            'app-iphone-x': appIphoneX,
        }
    }
</script>


<style lang="scss" scoped>
    @import '../css/gift.scss';

    .icon-image {
        width: #{12upx};
        height: #{22upx};
    }

    .information {
        background-color: #ffffff;
    }

    .app-submit-address {
        width: 100%;

        .express {
            .content {
                width: #{660upx};
                margin-right: #{28upx};
            }

            padding: #{32upx 24upx};

            .top {
                margin-bottom: #{22upx};
            }

            .font {
                font-size: #{32upx};
                line-height: 1;
                color: #353535;
            }

            .bottom {
                line-height: #{36upx};
            }
        }

        .line {
            width: 100%;
            height: #{8upx};
        }

    }

    .delivery-method {
        font-size: #{32upx};
        width: 100%;
        margin-top: #{24upx};
        background-color: #ffffff;
        height: #{120upx};
        padding: #{0 24upx};

        .method {
            .item {
                width: #{170upx};
                height: #{56upx};
                border-radius: #{30upx};
                line-height: #{56upx};
                text-align: center;
                margin-right: #{10upx};
            }

            .item-default {
                background-color: #f7f7f7;
            }
        }
    }

    .button {
        height: #{100upx};
        line-height: #{100upx};
        font-size: #{36upx};
        color: #ffffff;
        text-align: center;
    }

    .lifting {
        padding: #{0 24upx};
        width: 100%;
        height: #{100upx};

        input {
            width: 50%;
            color: #353535;
            font-size: #{32upx};
        }
    }

    /*门店信息*/
    .store-information {
        width: 100%;
        padding: #{32upx 24upx 32upx 24upx};
        background-color: #ffffff;
        border-top: #{1upx} solid #e2e2e2;

        .content {
            padding: #{32upx 40upx 32upx 0};
            width: #{662upx};
        }

        .font {
            color: #353535;
            font-size: #{32upx};
            line-height: 1;
        }

        .location {
            width: #{22upx};
            height: #{26upx};
            margin-right: #{8upx};
        }

        .address {
            color: #999999;
            font-size: #{28upx};
            line-height: 1;
            margin-top: #{20upx};
        }
    }

    .city {
        padding: #{32rpx 24rpx};
        font-size: #{28upx};
        background-color: #ffffff;
        margin-bottom: #{20rpx};

        .btn {
            padding: #{10rpx} #{20rpx};
            border-radius: #{100rpx};
            border: #{1rpx} solid #cccccc;
            font-size: $uni-font-size-general-two;
            color: $uni-general-color-one;
        }

        .error {
            color: #ff4544;
            margin-right: #{24rpx};
        }
    }

    .text-color {
        color: #ffffff;
    }

    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1500;
        background-color: #ffffff;
    }
</style>

