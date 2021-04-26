<template>
    <app-layout>
        <view class='nav main-center cross-center'>
            <template v-if="coupon.coupon.type == 2">
            <view class='price'>￥
                <text v-if="coupon.coupon.sub_price > 99999" style="font-size:22px">{{coupon.coupon.sub_price}}</text>
                <text v-else-if="coupon.coupon.sub_price > 9999" style="font-size:26px">{{coupon.coupon.sub_price}}</text>
                <text v-else-if="coupon.coupon.sub_price > 999" style="font-size:32px">{{coupon.coupon.sub_price}}</text>
                <text v-else-if="coupon.coupon.sub_price > 99" style="font-size:36px">{{coupon.coupon.sub_price}}</text>
                <text v-else>{{coupon.coupon.sub_price}}</text>
            </view>
            </template>
            <template v-if="coupon.coupon.type == 1">
                <view class='price'>
                    <text>{{coupon.coupon.discount}}</text>折
                </view>
            </template>
            <view class="right dir-top-nowrap main-center">
                <text class='name'>{{coupon.coupon.name}}</text>
                <text>满{{coupon.coupon.min_price}}元可用</text>
                <text v-if="coupon.coupon.discount_limit">优惠上限:￥{{coupon.coupon.discount_limit}}</text>
            </view>
        </view>
        <view class='need-price'>
            <text>{{coupon.integral_num}}</text>积分
            <text v-if="coupon.price > 0" style="font-size:16px">+￥</text>
            <text v-if="coupon.price > 0">{{coupon.price}}</text>
        </view>
        <view class='about'>
            <view class='title'>
                <view></view>
                <text>优惠券说明</text>
            </view>
            <view v-if="coupon.coupon.expire_type == 1">优惠券有效期：兑换后{{coupon.coupon.expire_day}}天</view>
            <view v-if="coupon.coupon.expire_type == 2">优惠券有效期：{{coupon.coupon.begin_time}}-{{coupon.coupon.end_time}}</view>
            <view>适用范围：
                <text v-if="coupon.coupon.appoint_type == 1">以下指定分类商品适用：
                    <text v-for="(item,index) in coupon.coupon.cat" :key="item.name">
                        <text v-if="index != 0">、</text>
                        <text>{{item.name}}</text>
                    </text>
                </text>
                <text v-if="coupon.coupon.appoint_type == 2">
                    <text v-for="(item,index) in coupon.coupon.goods" :key="item.name">
                        <text v-if="index != 0">、</text>
                        <text>{{item.name}}</text>
                    </text>
                </text>
                <text v-if="coupon.coupon.appoint_type == 3">全场通用</text>
                <text v-if="coupon.coupon.appoint_type == 4">仅限当面付活动使用</text>
            </view>
            <view class='content'>使用说明：{{coupon.coupon.rule}}</view>
        </view>
        <view @click="exchangeCoupon=true" :class="[`exchange`,iphone_x? `iphone_x`:``]">
            <view class='coupon-exchange'>立即兑换</view>
        </view>
        <view class="dialog-bg" v-if="exchangeCoupon">
            <view class="dialog-tip">
                <view class="dialog-title">提示</view>
                <view class="dialog-msg">
                    确定使用
                    <text v-if="coupon.integral_num > 0"><text style="color: #ff4544">{{coupon.integral_num}}</text>积分</text>
                    <text v-if="coupon.price > 0"><text v-if="coupon.integral_num > 0">与</text>
                    <text style="color: #ff4544">{{coupon.price}}</text>元</text>
                    兑换此优惠券？
                </view>
                <view class="dialog-btn main-center">
                    <view @click="exchangeCoupon=false" class="dialog-close">取消</view>
                    <view class="line"></view>
                    <view class="dialog-submit" @click="submit">确认</view>
                </view>
            </view>
        </view>
        <view class='dialog-bg' v-if="lose || success">
            <view class='dialog'>
                <view @click="close">
                    <image class='close' src='/static/image/icon/icon-close.png'></image>
                </view>
                <view class='lose' v-if="lose">
                    <image class='lose-img' src='./../image/lose.png'></image>
                    <view class='lose-title'>兑换失败！</view>
                    <view>当前积分不足</view>
                </view>
                <view class='success' v-if="success">
                    <image class='success-head' :src="integralImg.app_image.success"></image>
                    <view>恭喜您，兑换成功！</view>
                    <view class='main-between success-btn'>
                        <view @click="toList">
                            <button class='to-card'>去卡券包</button>
                        </view>
                        <view @click="toList">
                            <button class='to-use'>立即使用</button>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>

    import { mapState } from "vuex";

    export default {
        name: "about",
        data() {
            return {
                coupon: {
                    coupon: {
                        min_price: '',
                        rule: ''
                    }
                },
                success: false,
                lose: false,
                iphone_x: false,
                exchangeCoupon: false,
                current: 'wechat',
            };
        },
        computed: {
            ...mapState({
                integralImg: state => state.mallConfig.plugin.integral_mall,
                mall: state => state.mallConfig.mall
            }),
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            let id = options.id;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.getList(id);
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
        },
        methods: {
            close() {
                this.success = false;
                this.lose = false;
            },

            toList() {
                this.success = false;
                uni.navigateTo({
                    url: '/pages/coupon/index/index'
                });
            },
            getList(id) {
                let that = this;
                that.$request({
                    url: that.$api.integral_mall.detail,
                    data: {
                        id: id
                    }
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.coupon = response.data.detail;
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
            submit() {
                let that = this;
                let id = that.coupon.id;
                that.exchangeCoupon = false;
                if (that.userInfo != null && that.userInfo.integral < that.choose.integral_num) {
                    uni.showToast({
                        title: '积分不足',
                        icon: 'none',
                        duration: 1000
                    });
                }else {
                    uni.showLoading({
                        mask: true,
                        title: '领取中...'
                    });
                    that.$request({
                        url: that.$api.integral_mall.coupon_submit,
                        data: {
                            id: id
                        },
                        method: 'post'
                    }).then(response=>{
                        if(response.code == 0) {
                            let queue_id = response.data.queue_id;
                            let token = response.data.token;
                            that.getPayOrderId(queue_id, token)
                        }else {
                            uni.hideLoading();
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    }).catch(response => {
                        uni.hideLoading();
                    });
                }
            },

            getPayOrderId(queue_id, token) {
                this.$request({
                    url: this.$api.integral_mall.coupon_pay,
                    data: {
                        queue_id: queue_id,
                        token: token,
                    },
                }).then(response => {
                    if (response.code === 0) {
                        if (response.data.retry && response.data.retry === 1) {
                            this.getPayDataTimer = setTimeout(() => {
                                this.getPayOrderId(queue_id, token);
                            }, 1000);
                        } else {
                            uni.hideLoading();
                            this.pay(response.data.id);
                        }
                    } else {
                        this.exchangeCoupon = false;
                        uni.hideLoading();
                        uni.showModal({
                            title: '提示',
                            content: response.msg,
                            showCancel: false,
                        });
                    }
                }).catch(e => {
                    this.exchangeCoupon = false;
                    uni.hideLoading();
                    uni.showModal({
                        title: '提示',
                        content: e.errMsg,
                        showCancel: false,
                    });
                });
            },
            pay(id) {
                this.$payment.pay(id).then(res => {
                    this.success = true;
                }).catch(e => {
                    uni.showToast({
                        title: '支付失败',
                        icon: 'none',
                        duration: 1000
                    });
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    .nav {
        height: #{270rpx};
        width: 100%;
        color: #353535;
        font-size: 15px;
        background-image: url('./../image/BG.png');
        background-size: 100% 100%;
        padding: 0 #{90rpx};
        >view {
            width: 50%;
        }
    }

    .price {
        height: #{270rpx};
        line-height: #{270rpx};
        font-size: 22px;
        text-align: center;
        text {
            font-size: 40px;
        }
    }

    .name {
        font-size: $uni-line-height-import-two;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .need-price {
        height: #{140rpx};
        line-height: #{140rpx};
        padding-left: #{24rpx};
        font-size: 16px;
        color: #353535;
        border-bottom: #{1rpx} solid #ededed;
    }

    .need-price text {
        font-size: 24px;
    }

    .about {
        padding: #{40rpx} #{24rpx};
        color: #666;
        font-size: 15px;
    }

    .title {
        font-size: 15px;
        margin-bottom: #{30rpx};
        color: #353535;
    }

    .title view {
        display: inline-block;
        height: #{20rpx};
        width: #{6rpx};
        margin-right: #{8rpx};
        background-color: #ff4544;
    }

    .content {
        padding-bottom: #{130rpx};
    }

    .exchange {
        z-index: 10;
        border-top: #{1rpx} solid #e2e2e2;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        height: #{120rpx};
    }

    .exchange.iphone_x {
        padding-bottom: #{50rpx};
        height: #{170rpx};
    }

    .coupon-exchange {
        margin-top: #{20rpx};
        margin-left: 5%;
        height: #{80rpx};
        line-height: #{80rpx};
        width: 90%;
        border-radius: #{40rpx};
        background-color: #ff4544;
        text-align: center;
        font-size: 16px;
        color: #fff;
        padding: 0;
    }

    .coupon-exchange::after {
        border: 0;
    }

    .dialog-bg {
        position: fixed;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .dialog {
        width: #{574rpx};
        margin: 0 auto;
        background-color: #fff;
        position: fixed;
        top: 25%;
        left: 0;
        right: 0;
        border-radius: #{16rpx};
    }

    .close {
        height: #{30rpx};
        width: #{30rpx};
        position: absolute;
        right: #{22rpx};
        top: #{22rpx};
        z-index: 10;
    }

    .lose {
        padding: #{88rpx} 0 #{88rpx} #{90rpx};
        height: #{310rpx};
        font-size: 15px;
        color: #353535;
    }

    .lose-img {
        height: #{134rpx};
        width: #{124rpx};
        margin-right: #{48rpx};
        display: block;
        float: left;
    }

    .lose-title {
        font-size: 23px;
        font-weight: 500;
        margin: #{15rpx} 0;
    }

    .success {
        height: #{350rpx};
        background-color: #fff;
        text-align: center;
        padding-top: #{150rpx};
        font-size: 18px;
        color: #353535;
        border-radius: #{16rpx};
    }

    .success-head {
        height: #{332rpx};
        width: #{574rpx};
        position: absolute;
        top: #{-215rpx};
        left: 0;
    }

    .to-card, .to-use {
        margin-top: #{44rpx};
        height: #{64rpx};
        border-radius: #{32rpx};
        line-height: #{64rpx};
        width: #{228rpx};
        font-size: 16px;
    }

    .to-card::after, .to-use::after {
        border: 0;
    }

    .to-card {
        background-color: #fff;
        color: #353535;
        border: #{1rpx} solid #999;
    }

    .to-use {
        background-color: #ff4544;
        color: #fff;
    }

    .success-btn {
        padding:0 #{39rpx};
    }

    .dialog-tip {
        position: fixed;
        top: #{400rpx};
        left: 0;
        right: 0;
        padding-bottom: #{88rpx};
        width: #{640rpx};
        margin: 0 auto;
        z-index: 221;
        background-color: #fff;
        border-radius: 10px;
        text-align: center;
        font-size: #{30rpx};
    }

    .dialog-msg {
        margin: 0 #{50rpx} #{50rpx};
    }

    .dialog-title {
        margin: #{40rpx} auto #{35rpx};
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

    .nav .right {
        height: #{270rpx};
        width: #{320rpx};
        padding-left: #{10rpx};
        font-size: $uni-font-size-general-two;
    }
</style>