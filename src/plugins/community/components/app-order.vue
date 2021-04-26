<template>
    <view>
        <view @click="toDetail(item.id)" class="item">
            <view class="title main-between cross-center">
                <view class="activity-title dir-left-nowrap">
                    <image src="./../image/activity-name.png"></image>
                    <view>{{item.title}}</view>
                </view>
                <view class="number dir-right-nowrap">
                    <view :style="{'color': theme.color}">{{item.no}}</view>
                    <view v-if="is_user && item.cancel_status == 1" class="status">已关闭</view>
                    <view v-else-if="is_user && item.is_sale == 1" class="status">已完成</view>
                    <view v-else-if="is_user && item.is_confirm == 1" class="status">已提货</view>
                    <view v-else-if="is_user && item.is_send == 1" class="status">待提货</view>
                    <view v-else-if="is_user && item.is_pay == 1" class="status">待发货</view>
                    <view v-else-if="is_user && item.is_pay == 0" class="status">未付款</view>
                </view>
            </view>
            <view v-if="!is_user" class="info main-between cross-center">
                <view class="user-info dir-left-nowrap cross-center">
                    <view class="avatar">
                        <image :src="item.user_avatar"></image>
                    </view>
                    <view class="user">
                        {{item.name}}
                        <text>{{item.mobile}}</text>
                    </view>
                </view>
                <view :style="{'color': theme.color}" v-if="item.cancel_status == 1" class="status">已关闭</view>
                <view :style="{'color': theme.color}" v-else-if="item.is_sale == 1" class="status">已完成</view>
                <view :style="{'color': theme.color}" v-else-if="item.is_confirm == 1" class="status">已提货</view>
                <view :style="{'color': theme.color}" v-else-if="item.is_send == 1" class="status">待提货</view>
                <view :style="{'color': theme.color}" v-else-if="item.is_pay == 1" class="status">待发货</view>
                <view :style="{'color': theme.color}" v-else-if="item.is_pay == 0" class="status">未付款</view>
            </view>
            <view v-if="item.remark" class="remark">买家备注：{{item.remark}}</view>
            <view v-for="goods in item.detail" class="goods" :key="goods.id">
                <image class="goods-img" mode='aspectFill' :src='goods.goods_info.pic_url'></image>
                <view class='t-omit-two goods-name'>{{goods.goods_info.name}}</view>
                <view class="goods-attr t-omit">
                    <text v-for="attr in goods.goods_info.attr_list" :key="item.attr_id">{{attr.attr_group_name}}:{{attr.attr_name}}</text>
                </view>
                <view class="goods-num">x{{goods.goods_info.num}}</view>
                <view class="goods-price">￥{{goods.goods_info.total_original_price}}</view>
            </view>
            <view class="order-total">共<text>{{item.num}}</text>件商品 合计<text>￥{{item.total_price}}</text></view>
            <view class="dir-right-nowrap">
                <view @click.stop="orderPay(item)" v-if="is_user && item.is_pay == 0 && item.cancel_status == 0" class="pick-btn" :style="{'color': theme.color, 'border-color': theme.border}">立即支付</view>
                <view @click.stop="toRemind(item)" v-if="item.is_send == 1 && item.is_confirm == 0" class="pick-btn" :style="{'color': theme.color, 'border-color': theme.border}">确认提货</view>
            </view>
        </view>
        <view v-if="show" class="bg">
            <view class="dialog">
                <view class="dialog-content">是否确认提货</view>
                <view class="main-center btn-area">
                    <view class="submit-btn box-grow-1" style="color: #666" @click='toRemind'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn box-grow-1" @click='beConfirm'  :style="{'color': theme.color}">确认</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        name: 'app-order',
        props: {
            item: {
                type: Object
            },
            is_user: {
                type: Boolean
            },
            is_confirm: {
                type: Boolean
            },
            theme: Object
        },
        data() {
            return {
                show: false,
                orderList: [],
                id: 0,
            };
        },
        methods: {
            toRemind(item) {
                if(item.id > 0) {
                    this.show = true;
                    this.id = item.id
                }else {
                    this.show = false;
                    this.id = 0;
                }
            },
            // 订单支付
            orderPay(e) {
                let _this = this;
                _this.$showLoading();
                _this.$request({
                    url: _this.$api.order.list_pay_data,
                    data: {
                        id: e.id
                    }
                }).then(response => {
                    _this.$hideLoading();
                    if (response.code === 0) {
                        _this.$payment.pay(response.data.id).then(() => {
                            // 支付成功
                            uni.redirectTo({
                                url: '/plugins/community/order/order?is_user=1'
                            })
                        }).catch(e => {
                            // 支付失败
                            uni.showModal({
                                title: '',
                                content: e.errMsg,
                                showCancel: false
                            })
                        })
                    }
                }).catch(() => {
                    _this.$hideLoading();
                });
            },
            toDetail(id) {
                let is_user = 0;
                if(this.is_user) {
                    is_user = 1
                }
                uni.navigateTo({
                    url: '/plugins/community/order-detail/order-detail?id=' + id + '&is_user=' + is_user
                });
            },
            beConfirm() {
                let that = this;
                that.show = false;
                uni.showLoading({
                    mask: true,
                    title: '确认提货中...'
                });
                that.$request({
                    url: that.is_user ? that.$api.order.confirm : that.$api.community.confirm,
                    data: {
                        id: that.id
                    }
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.item.is_confirm = 1;
                        that.id = 0;
                        that.$emit('update', that.item);
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
        .item {
            border-radius: 16rpx;
            background-color: #fff;
            width: 702rpx;
            margin: 24rpx;
            margin-top: 0;
            padding: 24rpx;
            &:first-of-type {
                margin-top: 24rpx;
            }
            .status {
                font-size: 24rpx;
            }
            .title {
                height: 32rpx;
                line-height: 32rpx;
                margin-bottom: 24rpx;
                .number {
                    font-size: 38rpx;
                    .status {
                        margin-right: 30rpx;
                    }
                }
                .activity-title {
                    color: #353535;
                    font-size: #{24rpx};
                    height: 30rpx;
                    line-height: 30rpx;
                    image {
                        width: 30rpx;
                        height: 30rpx;
                        margin-right: 20rpx;
                        display: block;
                    }
                }
            }
            .info {
                height: 56rpx;
                font-size: 24rpx;
                .user-info {
                    height: 56rpx;
                    .avatar {
                        margin-right: 20rpx;
                        width: 56rpx;
                        height: 56rpx;
                        border-radius: 50%;
                        image {
                            width: 56rpx;
                            height: 56rpx;
                            border-radius: 50%;
                        }
                    }
                    .user {
                        color: #353535;
                        text {
                            margin-left: 30rpx;
                        }
                    }
                }
            }
            .remark {
                margin-top: 25rpx;
                word-break: break-all;
                font-size: 24rpx;
                color: #3b3939;
                padding: 20rpx 24rpx;
                background-color: #F7F7F7;
            }
            .goods {
                height: #{160rpx};
                margin-top: #{24rpx};
                position: relative;
                font-size: #{24rpx};
                color: #353535;
                margin-bottom: #{24rpx};
                .goods-img {
                    height: #{160rpx};
                    width: #{160rpx};
                    float: left;
                    margin-right: #{20rpx};
                    border-radius: #{4rpx};
                }
                .goods-attr {
                    font-size: #{24rpx};
                    color: #999;
                    width: 70%;
                    position: absolute;
                    width: 70%;
                    top: #{78rpx};
                    left: #{180rpx};
                    text {
                        margin-right: #{20rpx};
                    }
                }
                .goods-num {
                    font-size: #{24rpx};
                    color: #999;
                    position: absolute;
                    top: #{126rpx};
                    left: #{180rpx};
                }
                .goods-price {
                    font-size: #{24rpx};
                    color: #353535;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }
            }
            .order-total {
                text-align: right;
                color: #999999;
                font-size: 24rpx;
                margin-bottom: 24rpx;
                text {
                    font-size: 28rpx;
                    color: #353535;
                }
            }
            .pick-btn {
                height: 48rpx;
                line-height: 46rpx;
                border-radius: 24rpx;
                border: 2rpx solid;
                font-size: 24rpx;
                display: inline-block;
                padding: 0 20rpx;
                margin-left: 20rpx;
            }
        }
        .bg {
            position: fixed;
            background-color: rgba(0,0,0,.3);
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 99;
            .dialog {
                width: 480rpx;
                height: 200rpx;
                position: fixed;
                top: 30%;
                left: 50%;
                margin-left: -240rpx;
                background-color: #fff;
                border-radius: 16rpx;
                z-index: 233;
                font-size: 28rpx;
                color: #353535;
                .dialog-content {
                    height: 110rpx;
                    line-height: 110rpx;
                    text-align: center;
                }
                .btn-area {
                    height: #{88rpx};
                    position: relative;
                    border-top: #{2rpx} solid #e2e2e2;
                    .line {
                        height: #{32rpx};
                        width: #{1rpx};
                        background-color: #e2e2e2;
                        position: absolute;
                        top: #{28rpx};
                        left: 0;
                        right: 0;
                        margin: 0 auto;
                    }
                    .submit-btn {
                        height: #{88rpx};
                        line-height: #{88rpx};
                        font-size: #{28rpx};
                        text-align: center;
                    }
                }
            }
        }
</style>