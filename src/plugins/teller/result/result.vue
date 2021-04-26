<template>
    <view class="bg">
        <app-layout :haveBackground="haveBackground">
            <view class="total dir-top-nowrap main-center cross-center">
                <view class="total-price">-{{detail.amount}}</view>
                <view>交易成功</view>
            </view>
            <view class="total-info">
                <view class="main-between cross-center total-item">
                    <view class="label">原价</view>
                    <view>￥{{detail.total_goods_original_price}}</view>
                </view>
                <view v-if="detail.member_discount_price != '0.00'" class="main-between cross-center total-item">
                    <view class="label">会员折扣</view>
                    <view>-￥{{detail.member_discount_price}}</view>
                </view>
                <view v-if="detail.integral_deduction_price != '0.00'" class="main-between cross-center total-item">
                    <view class="label">积分抵扣</view>
                    <view>-￥{{detail.integral_deduction_price}}</view>
                </view>
                <view v-if="detail.coupon_discount_price != '0.00'" class="main-between cross-center total-item">
                    <view class="label">优惠券</view>
                    <view>-￥{{detail.coupon_discount_price}}</view>
                </view>
                <view v-if="detail.full_reduce_price != '0.00'" class="main-between cross-center total-item">
                    <view class="label">满减</view>
                    <view>-￥{{detail.full_reduce_price}}</view>
                </view>
                <view v-if="detail.vip_card_discount != '0.00'" class="main-between cross-center total-item">
                    <view class="label">超级会员卡</view>
                    <view>-￥{{detail.vip_card_discount}}</view>
                </view>
            </view>
            <view class="total-info">
                <view class="main-between cross-center total-item">
                    <view class="label">支付方式</view>
                    <view>{{detail.pay_type}}</view>
                </view>
                <view class="main-between cross-center total-item">
                    <view class="label">支付时间</view>
                    <view>{{detail.created_at}}</view>
                </view>
                <view class="main-between cross-center total-item">
                    <view class="label">交易单号</view>
                    <view>{{detail.order_no}}</view>
                </view>
            </view>
            <view @click="toIndex" class="return-btn">返回首页</view>
        </app-layout>
    </view>
</template>

<script>

    import { mapState } from "vuex";

    export default {
        data() {
            return {
                detail: {}
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
            })
        },
        methods: {
            toIndex() {
                uni.reLaunch({
                    url:'/pages/index/index'
                })
            },
        },

        onLoad(options) {
            this.$request({
                url: this.$api.teller.search,
                data: {
                    pay_code: options.code
                },
                method: 'post'
            }).then(response=>{
                this.$hideLoading();
                if(response.code == 0) {
                    this.detail = response.data;
                }
            }).catch(response => {
                this.$hideLoading();
            });
        }
    }
</script>

<style scoped lang="scss">
    .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        padding: 0 #{24rpx};
    }
    .total {
        height: #{260rpx};
        width: 100%;
        color: #999999;
        font-size: #{28rpx};
        border-bottom: #{2rpx} solid #e2e2e2;
        .total-price {
            font-size: #{54rpx};
            color: #353535;
            margin-bottom: #{30rpx};
        }
    }
    .total-info {
        padding: #{10rpx} #{30rpx};
        font-size: #{28rpx};
        border-bottom: #{2rpx} solid #e2e2e2;
        .total-item {
            height: #{68rpx};
            .label {
                color: #999;
            }
        }
    }
    .return-btn {
        height: #{84rpx};
        border: #{2rpx} solid #ff4544;
        color: #ff4544;
        line-height: #{84rpx};
        width: 100%;
        font-size: #{28rpx};
        text-align: center;
        border-radius: #{42rpx};
        margin-top: #{80rpx};
    }
</style>