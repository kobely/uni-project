<template>
    <app-layout>
        <view v-if="is_show" class='clerk-box'>
            <view class='order-info'>
                <view class='dir-left-nowrap'>
                    <view class='info-label'>收货人：</view>
                    <view>
                        <view>{{orderDetail.name}}</view>
                    </view>
                </view>
                <view class='dir-left-nowrap'>
                    <view class='info-label'>联系方式：</view>
                    <view>
                        <view>{{orderDetail.mobile}}</view>
                    </view>
                </view>
                <view class='line'></view>
                <view>
                    <text class='info-label'>下单时间：</text>
                    {{orderDetail.created_at}}
                </view>
                <view class="remark-box" v-if="orderDetail.remark">
                    <text class='info-label'>买家留言：</text>
                    {{orderDetail.remark}}
                </view>
            </view>

            <view class='goods-box'>
                <view v-for='item in orderDetail.detail' :style="{'margin-top': index == 0 ? '0': '24rpx'}"
                      :key='item.id'>
                    <app-jump-button :url="item.goods_info.page_url">
                        <app-order-goods-info style="width:100%;" :goods='item.goods_info'></app-order-goods-info>
                    </app-jump-button>
                </view>
            </view>

            <view class='order-info dir-top-nowrap'>
                <view class='dir-left-nowrap item'>
                    <view class='box-grow-1 info-label'>商品总额</view>
                    <view class='box-grow-0'>￥{{orderDetail.total_goods_price}}</view>
                </view>
                <view class='dir-left-nowrap item'>
                    <view class='box-grow-1 info-label'>商品总数</view>
                    <view class='box-grow-0'>x{{orderDetail.goods_num}}</view>
                </view>
                <view v-if='orderDetail.integral_deduction_price > 0' class='dir-left-nowrap item'>
                    <view class='box-grow-1 info-label'>积分抵扣</view>
                    <view class='box-grow-0'>-￥{{orderDetail.integral_deduction_price}}</view>
                </view>
                <view class='dir-left-nowrap item' v-if="orderDetail.coupon_discount_price > 0">
                    <view class='box-grow-1 info-label'>优惠券优惠</view>
                    <view class='box-grow-0'>-￥{{orderDetail.coupon_discount_price}}</view>
                </view>
                <view class='dir-left-nowrap item'>
                    <view class='box-grow-1 info-label'>运费</view>
                    <view class='box-grow-0'>￥{{orderDetail.express_price}}</view>
                </view>
                <view v-if='orderDetail.words' class='dir-top-nowrap item'>
                    <view class='box-grow-1 info-label'>商家留言:</view>
                    <view class='box-grow-0 t-extra-small-color'>{{orderDetail.words}}</view>
                </view>
                <view class='order-price-box cross-center dir-right-nowrap'>
                    <view>
                        合计:
                        <text class='price'>￥
                            <text>{{orderDetail.total_pay_price}}</text>
                        </text>
                    </view>
                </view>
            </view>

            <view class='order-info' v-if="orderDetail.id > 0 && (haveForm || orderDetail.order_form.length > 0)">
                <app-form-data @show="showForm" :order="orderDetail"> 
                    <view class='info-title'>表单信息</view>
                </app-form-data>
            </view>
            <view style="height: 140rpx; width: 100%"></view>
            <view class='action-box'>
                <view v-if='orderDetail.is_pay == 0'>
                    <button class='box-grow-0 btn' @click='clerkAffirmPay'>确认收款</button>
                </view>
                <view v-else>
                    <view v-if='orderDetail.is_pay == 1 && orderDetail.clerk_id == 0' class="dir-left-nowrap cross-center">
                        <view @click="orderClerkRemark" class="dir-top-nowrap box-grow-0 cross-center left-box">
                            <image :src="clerkImg.edit" class="edit-icon"></image>
                            <view class="edit-remark">备注</view>
                        </view>
                        <button @click='orderClerk'
                                class='box-grow-1 btn'>
                            核销订单
                        </button>
                    </view>
                    <view class="cross-center main-center clerk-text" v-else>订单已核销</view>
                </view>
            </view>
        </view>
        <view v-if="msg" class='bg cross-center main-center'>
            <view class='dialog'>
                <view>提示</view>
                <view class='dialog-content'>无核销权限</view>
                <view @click='toIndex' class='dialog-btn'>确认</view>
            </view>
        </view>

        <view v-if="remarkClerk" class='bg cross-center main-center'>
            <view class='remark-dialog'>
                <view class="title">备注</view>
                <textarea class="textarea" v-model="clerk_remark" placeholder="请输入核销备注"/>
                <view class="dir-left-nowrap bottom-box">
                    <view @click="remarkClerk = false" class="box-grow-1 cross-center main-center cancel-text">取消</view>
                    <view @click="orderClerk" class="box-grow-1 cross-center main-center clerk-text">核销订单</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from 'vuex';
    import appOrderGoodsInfo from "../../../components/page-component/app-order-goods-info/app-order-goods-info.vue";
    import appFormData from "../../../components/basic-component/app-order/app-form-data.vue";

    export default {
        components: {
            'app-order-goods-info': appOrderGoodsInfo,
            appFormData,
        },
        data() {
            return {
                haveForm: true,
                id: null,
                orderDetail: {},
                clerk_remark: '',
                is_show: false,
                msg: false,
                remarkClerk: false,
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                clerkImg: state => state.mallConfig.__wxapp_img.clerk,
            })
        },
        methods: {
            showForm(e) {
                this.haveForm = e && e.length ? true : false
            },
            toIndex() {

                uni.redirectTo({
                    url: '/pages/index/index'
                });
            },
            getOrderDetail() {
                this.$request({
                    url: this.$api.order.detail,
                    data: {
                        id: this.id,
                        action_type: 1
                    }
                }).then(response => {
                    this.$hideLoading();
                    this.is_show = true;
                    if (response.code === 0) {
                        this.orderDetail = response.data.detail;
                    }
                }).catch(() => {
                    this.$hideLoading();
                });
            },
            IsClerk() {
                this.$showLoading();
                this.$request({
                    url: this.$api.user.is_clerk,
                    data: {
                        clerk_id: this.userInfo.options.user_id,
                    }
                }).then(response => {
                    if (response.code === 0) {
                        if(response.data.is_clerk_user == 1) {
                            this.getOrderDetail();
                        }else {
                            this.$hideLoading();
                            this.msg = true;
                        }
                    }
                }).catch(() => {
                    this.$hideLoading();
                });
            },
            clerkAffirmPay() {
                let self = this;
                uni.showModal({
                    title: '提示',
                    content: '确认已进行线下收款?',
                    success: function (res) {
                        if (res.confirm) {
                            uni.showLoading({
                                title: '加载中'
                            });
                            self.$request({
                                url: self.$api.order.clerk_affirm_pay,
                                data: {
                                    id: self.id,
                                    action_type: 1,
                                }
                            }).then(response => {
                                uni.hideLoading();
                                if (response.code === 0) {
                                    self.getOrderDetail();
                                } else  {
                                    uni.showToast({
                                        title: response.msg,
                                        icon: 'none',
                                    });
                                }
                                this.msg = response.data.msg
                            }).catch(() => {
                                uni.hideLoading();
                            });
                        }
                    }
                });
            },
            orderClerk() {
                let self = this;

                if (self.remarkClerk) {
                    self.remarkClerk = false;
                }

                uni.showModal({
                    content: '是否核销订单？',
                    success: function (res) {
                        if (res.confirm) {
                            self.$showLoading();
                            self.$request({
                                url: self.$api.order.order_clerk,
                                data: {
                                    id: self.id,
                                    action_type: 1,
                                    clerk_remark: self.clerk_remark
                                }
                            }).then(response => {
                                self.$hideLoading();
                                uni.showToast({
                                    title: response.msg,
                                    icon: 'none',
                                    duration: 2000,
                                    success: function() {
                                        if (response.code === 0) {
                                           setTimeout(()=> {
                                                uni.redirectTo({
                                                    url: '/plugins/clerk/order/order?status=1&type=1'
                                                })
                                           }, 2000);
                                        }
                                    }
                                })
                            }).catch(() => {
                                self.$hideLoading();
                            });
                        }
                    }
                })
            },
            orderClerkRemark()
            {
                this.remarkClerk = true;
            },
            closeDialog() {
                if (this.msg == '核销成功') {
                    this.msg = '';
                    if (this.is_clerk) {
                        let pages = getCurrentPages();
                        let idx;
                        pages.forEach((row, index) => {
                            if (pages[index].route === 'plugins/clerk/order/order') {
                                idx = index
                            }
                        });
                        if (idx > -1) {
                            pages[idx]._num = 1;
                            uni.navigateBack({
                                delta: pages.length - 1 - idx
                            });
                        } else {
                            uni.redirectTo({
                                url: '/plugins/clerk/order/order?status=1&type=1'
                            })
                        }
                    } else {
                        uni.redirectTo({
                            url: '/pages/index/index'
                        })
                    }
                } else {
                    this.msg = '';
                }
            },
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.id = options.id;
            var getUser = setInterval(() => {
                if(that.userInfo) {
                    that.IsClerk();
                    clearInterval(getUser);
                }
            },500)
        }
    }
</script>

<style lang="scss" scoped>
    .info-title {
        font-size: #{24rpx};
        color: #353535;
        margin-bottom: #{20rpx};
    }
    .bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .3);
        z-index: 1000;
        .dialog {
            margin-top: #{-100rpx};
            width: #{630rpx};
            background-color: #fff;
            padding-top: #{40rpx};
            border-radius: #{16rpx};
            font-size: #{32rpx};
            color: #353535;
            text-align: center;
            .dialog-content {
                margin: #{40rpx};
            }
            .dialog-btn {
                color: #ff4544;
                height: #{88rpx};
                line-height: #{88rpx};
                border-top: #{1rpx} solid #e2e2e2;
            }
        }

        .remark-dialog {
            margin-top: #{-100rpx};
            padding-top: #{32rpx};
            background-color: #fff;
            border-radius: #{16rpx};
            font-size: #{32rpx};
            color: #353535;

            .title {
                text-align: center;
                font-size: #{32rpx};
                margin-top: #{8rpx};
                margin-bottom: #{32rpx};
            }

            .textarea {
                width: #{556rpx};
                height: #{300rpx};
                border: #{1rpx} solid #e2e2e2;
                border-radius: #{16rpx};
                padding: #{24rpx} #{32rpx};
                margin: 0 #{32rpx};
            }

            .bottom-box {
                height: #{88rpx};
                border-top: #{1rpx} solid #e2e2e2;
                margin-top: #{32rpx};
                padding: #{20rpx} 0;

                .cancel-text {
                    font-size: 34#{rpx};
                    color: #666666;
                    width: 0;
                }

                .clerk-text {
                    font-size: 34#{rpx};
                    color: #ff4544;
                    width: 0;
                    border-left: #{1rpx} solid #e2e2e2;
                }
            }
        }
    }

    .clerk-box {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .remark-box {
        margin-top: 14#{rpx};
    }

    .action-box {
        position: fixed;
        background-color: #fff;
        height: 140#{rpx};
        padding:30#{rpx};
        bottom: 0;
        width: 100%;
        z-index: 999;
        .btn {
            background-color: $uni-important-color-red;
            color: #fff;
            z-index: 999;
            width: 100%;
            font-size: 32#{rpx};
            height: 88#{rpx};
            line-height: 88#{rpx};
            border-radius: 44#{rpx};
        }
        .btn::after {
            border: 0;
        }
        .clerk-text {
            font-size: $uni-font-size-import-one;
            height: 100%;
            color: $uni-general-color-one;
        }

        .left-box {
            margin-right: 20#{rpx};

            .edit-icon {
                width: 30#{rpx};
                height: 30#{rpx};
                margin-bottom: 10#{rpx};
            }

            .edit-remark {
                font-size: 28#{rpx};
                color: $uni-general-color-two;
            }
        }
    }

    .order-info {
        width: 702#{rpx};
        margin: 24#{rpx};
        background-color: #fff;
        border-radius: 16#{rpx};
        padding: 24#{rpx};
        font-size: $uni-font-size-general-one;
        color: $uni-important-color-black;
    }
    .order-info.form-data {
        margin-bottom: #{24rpx};
    }

    .line {
        height: 1#{rpx};
        width: 654#{rpx};
        background-color: $uni-weak-color-one;
        margin: 22#{rpx} 0;
    }

    .info-label {
        color: $uni-general-color-two;
    }

    .goods-box {
        width: 702#{rpx};
        margin: 0 24#{rpx};
        background-color: #fff;
        border-radius: 16#{rpx};
        padding: 24#{rpx};
        font-size: 28#{rpx};
        color: $uni-important-color-black;
    }

    .order-price-box {
        border-top: 1#{rpx} solid #e2e2e2;
        margin-top: 24#{rpx};
        padding: 20#{rpx} 0 6#{rpx};
        font-size: 28#{rpx};
        color: $uni-important-color-black;
        border-bottom-left-radius: 16#{rpx};
        border-bottom-right-radius: 16#{rpx};
        background-color: #fff;
    }

    .order-price-box .price {
        font-size: 28#{rpx};
        color: $uni-important-color-red;
    }

    .bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .3);
        z-index: 1000;
    }

    .dialog {
        width: 630#{rpx};
        background-color: #fff;
        padding-top: 40#{rpx};
        border-radius: 16#{rpx};
        font-size: 32#{rpx};
        color: $uni-important-color-black;
        text-align: center;
    }

    .dialog-content {
        margin: 40#{rpx};
    }

    .dialog-btn {
        color: $uni-important-color-red;
        height: 88#{rpx};
        line-height: 88#{rpx};
        border-top: 1#{rpx} solid $uni-weak-color-one;
        .view1 {
            color: $uni-important-color-black;
            width: 50%;
        }
        .view2 {
            height: 45#{rpx};
            width: 1#{rpx};
            background-color: $uni-weak-color-one;
        }
        .view3 {
            width: 50%;
        }
    }
</style>