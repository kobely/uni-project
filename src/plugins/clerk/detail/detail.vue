<template>
    <app-layout>
        <view class='status'>
            <image class='status-bg' :src='clerkImg.detail'></image>
            <view class="status-text" v-if="detail.is_use == 1 && detail.cancel_status == 0">已核销</view>
            <view class='status-info' v-if="detail.is_use == 1 ||detail.clerk_id > 0">
                <view v-if="card_id > 0">核销时间：{{detail.clerked_at}}</view>
                <view v-if="id > 0">核销时间：{{detail.orderClerk.updated_at}}</view>
                <view class="status-price" v-if="id > 0">核销金额：￥{{detail.total_pay_price}}</view>
            </view>
            <view class="status-text" v-if="(detail.is_use == 0 && card_id > 0) || (detail.clerk_id == 0&&detail.cancel_status == 0)">未核销</view>
            <view class="status-text" v-if="detail.cancel_status == 1">已退款</view>
            <view class='status-info' v-if="detail.cancel_status == 1">
                <view v-if="id > 0">退款时间：{{detail.cancel_time}}</view>
            </view>
            <view v-if="id > 0 && detail.store && detail.store.address" class='address-info'>
                <image src='./../image/address.png'></image>
                <view>{{detail.store.name ? detail.store.name : ''}} {{detail.store.mobile ? detail.store.mobile : ''}}</view>
                <view class="address">{{detail.store.address}}</view>
            </view>
            <view  v-if="card_id > 0" class="card-info">
                <view class='dir-left-nowrap cross-center'>
                    <image class="card-img" :src='detail.pic_url'></image>
                    <view class="card-name t-omit-two">{{detail.card_name}}</view>
                </view>
                <view class='card-other'>
                    <view v-if="detail.is_show_history" class="history-button" @click="isShow = true">
                        <span>历史核销记录</span>
                        <image class="icon" src="/static/image/icon/red-arrow.png"></image>
                    </view>
                    <view class='other-label'>有效时间</view>
                    <view>{{detail.start_time}} - {{detail.end_time}}</view>
                    <view class='other-label'>发放时间</view>
                    <view>{{detail.created_at}}</view>
                    <view class='other-label'>使用说明</view>
                    <text>{{detail.content}}</text>
                </view>
            </view>
        </view>
        <view v-if="id > 0" class='order-info'>
            <view class="goods" :style="{'margin-top':`${index == 0 ?'0':'12'}px`}" v-for="goods in detail.detail" :key="goods.id">
                <image :src='goods.goods.goodsWarehouse.cover_pic'></image>
                <view class='goods-info'>
                    <view class='goods-name t-omit-two'>{{goods.goods.goodsWarehouse.name}}</view>
                    <view class="goods-attr t-omit-two">
                        <text v-for="attr in goods.attr_list" :key="attr.id">{{attr.attr_group_name}}:{{attr.attr_name}}</text>
                    </view>
                    <view>x{{goods.num}}</view>
                </view>
                <view class='goods-price'>￥ {{goods.total_price ? goods.total_price : '0.00'}}</view>
            </view>
            <view class="main-between price-item">
                <view class="price-label">商品总价</view>
                <view>￥{{ detail.total_goods_price ? detail.total_goods_price : '0.00' }}</view>
            </view>
            <view class="main-between price-item">
                <view class="price-label">运费</view>
                <view>￥{{ detail.express_price ? detail.express_price : '0.00' }}</view>
            </view>
            <view class="main-between price-item" v-if="detail.member_discount_price > 0">
                <view class="price-label">会员折扣</view>
                <view>￥{{ detail.member_discount_price }}</view>
            </view>
            <view class="main-between price-item" v-if="detail.integral_deduction_price > 0">
                <view class="price-label">积分抵扣</view>
                <view>￥-{{ detail.integral_deduction_price }}</view>
            </view>
            <view class="main-between price-item" v-if="detail.coupon_discount_price > 0">
                <view class="price-label">优惠券抵扣</view>
                <view>-￥{{ detail.coupon_discount_price }}</view>
            </view>
            <view class="main-between price-item">
                <view class="price-label total-label">订单总价</view>
                <view class="total-price">￥{{ detail.total_pay_price ? detail.total_pay_price : '0.00' }}</view>
            </view>
        </view>
        <view class='order-info' v-if="detail.name">
            <view class='info-title'>收货信息</view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">收货人：</view>
                <view>{{detail.name}}</view>
            </view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">联系方式：</view>
                <view>{{detail.mobile}}</view>
            </view>
        </view>
        <view v-if="id > 0" class='order-info'>
            <view class='info-title'>订单信息</view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">下单时间：</view>
                <view>{{detail.created_at}}</view>
            </view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">订单号：</view>
                <view>{{detail.order_no}}</view>
            </view>
            <view class="dir-left-nowrap price-item" v-if="detail.remark">
                <view class="price-label">买家备注：</view>
                <view>{{detail.remark}}</view>
            </view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">支付方式：</view>
                <view v-if="detail.pay_type == 1">线上支付</view>
                <view v-else-if="detail.pay_type == 3">余额支付</view>
                <view v-else-if="detail.pay_type == 2">货到付款</view>
                <view v-else-if="detail.pay_type == 4">现金</view>
                <view v-else-if="detail.pay_type == 5">pos机</view>
                <view v-else>未支付</view>
            </view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">收货方式：</view>
                <view v-if="detail.send_type == 1">到店自提</view>
                <view v-if="detail.send_type == 0">快递配送</view>
            </view>
        </view>
        <view class='order-info' v-if="detail.orderClerk && detail.clerk">
            <view class='info-title'>核销信息</view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">核销员：</view>
                <view>{{detail.clerk.nickname}}</view>
            </view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">核销时间：</view>
                <view>{{detail.orderClerk.created_at}}</view>
            </view>
            <view class="dir-left-wrap price-item">
                <view class="price-label">核销备注：</view>
                <view>{{detail.orderClerk.clerk_remark}}</view>
            </view>
        </view>
        <view class='order-info' v-if="detail.id > 0 && (haveForm || detail.order_form.length > 0)">
            <app-form-data @show="showForm" :order="detail">  
                <view class='info-title'>表单信息</view>
            </app-form-data>
        </view>
        <view v-if="detail.is_show_history == 1" class='order-info'
              :style="{'margin-bottom': `${detail.clerk_id > 0 ? '12':'28'}px;`}">
            <view class='info-title'>核销信息</view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">剩余次数：</view>
                <view>{{detail.number - detail.use_number}}次</view>
            </view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">已核销次数：</view>
                <view>{{detail.use_number}}次</view>
            </view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">总次数：</view>
                <view>{{detail.number}}次</view>
            </view>
        </view>
        <view style="height: 140rpx; width: 100%"></view>
        <view v-if="detail.clerk_id == 0 && id > 0 && detail.is_pay == 1 && detail.cancel_status == 0" @click="toClerk(detail.id)" class="to-clerk">
            <button>去核销</button>
        </view>
        <view v-if="detail.clerk_id == 0 && id > 0 && detail.is_pay == 0 && detail.cancel_status == 0" class="to-clerk" @click="checkPay=!checkPay">
            <button>确认收款</button>
        </view>
        <view v-if="detail.is_use == 0 && card_id > 0 && detail.receive_id == 0" @click="toClerkCard(detail.id)" class="to-clerk">
            <button>去核销</button>
        </view>
        <view class="bg cross-center main-center" v-if="checkPay">
            <view class="dialog">
                <view class="dialog-title">提示</view>
                <view class="dialog-msg">确认是否已当面支付款项给您！</view>
                <view class="dialog-btn main-center">
                    <view @click="checkPay=!checkPay" class="dialog-close">取消</view>
                    <view class="line"></view>
                    <view class="dialog-submit" @click="clerkAffirmPay">确认</view>
                </view>
            </view>
        </view>
        <app-clerk-historys :user-card-id="detail.id" :is-show.sync="isShow"></app-clerk-historys>
    </app-layout>
</template>

<script>
    import appClerkHistorys from '../../../components/page-component/app-clerk-historys/app-clerk-historys.vue';
    import appFormData from "../../../components/basic-component/app-order/app-form-data.vue";

    import { mapState } from "vuex";

    export default {
        name: "detail",
        components: {
            appClerkHistorys,
            appFormData,
        },
        data() {
            return {
                haveForm: true,
                detail: {
                    start_time: '',
                    end_time: '',
                },
                card_id: null,
                checkPay: false,
                id: null,
                isShow: false,
            };
        },
        computed: {
            ...mapState({
                clerkImg: state => state.mallConfig.__wxapp_img.clerk,
                mall: state => state.mallConfig.mall
            }),
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.$showLoading({
                text: '加载中...'
            });
            if (options.id > 0) {
                this.id = options.id;
                uni.setNavigationBarTitle({
                    title: "订单详情",
                })
            }else if (options.card_id > 0) {
                this.card_id = options.card_id;
                uni.setNavigationBarTitle({
                    title: "卡券详情",
                })
            }
        },
        onShow: function() {
            if (this.id > 0) {
                this.getDetail();
            }else if (this.card_id > 0) {
                this.getCardDetail();
            }
        },
        methods: {
            showForm(e) {
                console.log(e)
                this.haveForm = e && e.length ? true : false
            },
            toClerk(id) {
                uni.navigateTo({
                    url: '/pages/order/clerk/clerk?id=' + id
                });
            },
            toClerkCard(id) {
                uni.navigateTo({
                    url: '/pages/card/clerk/clerk?cardId=' + id
                });
            },
            getDetail() {
                let that = this;
                that.$request({
                    url: that.$api.clerk.detail,
                    data: {
                        order_id: this.id
                    },
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.detail = response.data.order;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
            getCardDetail() {
                let that = this;
                that.$request({
                    url: that.$api.clerk.card_detail,
                    data: {
                        cardId: this.card_id
                    },
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.detail = response.data.card;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
            clerkAffirmPay() {
                let that = this;
                that.$request({
                    url: that.$api.order.clerk_affirm_pay,
                    data: {
                        id: that.id,
                        action_type: 1,
                    },
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.checkPay = !that.checkPay;
                        that.getDetail();
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .status {
        position: relative;
        padding-top: #{140rpx};
    }

    .status-price {
        margin-top: #{4rpx};
    }

    .status-bg {
        position: absolute;
        top: 0;
        left: 0;
        height: #{220rpx};
        width: 100%;
        z-index: 0;
    }

    .status-text {
        font-size: #{32rpx};
        color: #fff;
        position: absolute;
        top: #{42rpx};
        left: #{48rpx};
    }

    .address-info {
        width: #{702rpx};
        margin: 0 auto;
        font-size: #{26rpx};
        color: #353535;
        background-color: #fff;
        border-radius: #{16rpx};
        position: relative;
        padding: #{28rpx} #{24rpx} #{28rpx} #{92rpx};
    }

    .address-info image {
        position: absolute;
        top: #{40rpx};
        left: #{24rpx};
        height: #{44rpx};
        width: #{44rpx};
    }

    .address {
        margin-top: #{8rpx};
    }

    .order-info {
        margin: #{24rpx} #{38rpx};
        padding: #{28rpx} #{24rpx};
        background-color: #fff;
        border-radius: #{16rpx};
    }

    .goods {
        height: #{160rpx};
        position: relative;
        margin-bottom: #{20rpx};
    }

    .goods image {
        height: #{160rpx};
        width: #{160rpx};
        border-radius: #{10rpx};
        float: left;
        margin-right: #{20rpx};
    }

    .goods-info {
        font-size: #{24rpx};
        color: #999999;
    }

    .goods-name {
        color: #353535;
        height: #{70rpx};
    }

    .goods-price {
        color: #353535;
        font-size: #{24rpx};
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .total {
        font-size: #{24rpx};
        margin-top: #{28rpx};
        color: #999999;
        text-align: right;
    }

    .price-item {
        margin-top: #{10rpx};
        font-size: #{24rpx};
        color: #353535;
    }

    .price-item:first-of-type {
        margin-top: #{24rpx};
    }

    .price-label {
        color: #999;
        font-size: #{24rpx};
    }

    .price-label.total-label {
        font-size: #{24rpx};
        color:#353535;
    }

    .total-price {
        font-size: #{28rpx};
        color: #ff4544;
        font-weight: bold;
    }

    .info-title {
        font-size: #{24rpx};
        color: #353535;
        margin-bottom: #{20rpx};
    }

    .status-info {
        position: absolute;
        right: #{48rpx};
        top: #{42rpx};
        color: #fff;
        font-size: #{24rpx};
        text-align: right;
    }

    .to-clerk {
        position: fixed;
        bottom: 0;
        height: 140#{rpx};
        width: 100%;
        padding: 0 24#{rpx};
        border-top: 1#{rpx} solid #e2e2e2;
        background: #ffffff;
        display: flex;
        align-items: center;

    }

    .to-clerk button {
        width: #{702rpx};
        margin: 0 auto;
        font-size: #{32rpx};
        color: #fff;
        height: #{88rpx};
        line-height: #{88rpx};
        border-radius: #{44rpx};
        background-color: #ff4544;
        text-align: center;
    }

    .card-info {
        width: 90%;
        margin: 0 auto;
        border-radius: #{15rpx};
        background-color: #fff;
        position: relative;
        padding: #{40rpx} #{24rpx};
        margin-bottom: #{20rpx};
    }

    .card-img {
        height: #{88rpx};
        width: #{88rpx};
        margin-right: #{20rpx};
        border-radius: #{44rpx};
    }

    .card-name {
        font-size: #{32rpx};
        color: #353535;
        width: #{546rpx};
    }

    .info-label {
        color: #999999;
    }

    .card-other {
        text-align: left;
        font-size: #{28rpx};
        margin-top: #{40rpx};
        color: #353535;
        border-top: #{1rpx} solid #e2e2e2;
    }

    .other-label {
        color: #999999;
        margin: #{30rpx} 0 #{22rpx};
    }

    .bg {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, .3);
        z-index: 10;
    }

    .dialog {
        position: fixed;
        top: #{400rpx};
        left: 0;
        right: 0;
        height: #{300rpx};
        width: #{640rpx};
        margin: 0 auto;
        z-index: 21;
        background-color: #fff;
        border-radius: 10px;
        text-align: center;
        font-size: #{30rpx};
    }

    .dialog-title {
        margin: #{40rpx} auto #{35rpx};
    }

    .dialog-msg {
        color: #ff4544;
    }

    .dialog-btn {
        height: #{88rpx};
        width: #{640rpx};
        border-top: #{1rpx} solid #e2e2e2;
        line-height: #{88rpx};
        position: absolute;
        bottom: 0;
        left: 0;
    }

    .dialog-close,.dialog-submit {
        width: 50%;
    }

    .line {
        height: #{44rpx};
        margin-top: #{22rpx};
        width: #{1rpx};
        background-color: #e2e2e2;
    }

    .dialog-submit {
        color: #ff4544;
    }

    .goods-attr {
        margin-bottom: #{16rpx};
    }

    .goods-attr text {
        margin-right: #{18rpx};
    }

    .history-button {
        width: 215#{rpx};
        height:60#{rpx};
        padding:18#{rpx} 23#{rpx};
        display: flex;
        color: #ff4544;
        font-size:24#{rpx};
        margin:30#{rpx} 0;
        align-items: center;
        justify-content:center;
        background: #ffebeb;
        border-radius: 30#{rpx};

        .icon {
            width: 12#{rpx};
            height:22#{rpx};
            margin-left:12#{rpx};
        }
    }
</style>