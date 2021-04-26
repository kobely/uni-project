<template>
    <app-layout>
        <!-- 卡片 -->
        <view class="head-card" :style="[{'background-color': `${list.form.card_bg}`}]">
            <image class="card-bottom" :src="svipImg.card_bottom" alt=""></image>
        </view>
        <view class="list">
            <view class="title main-center cross-center">
                <image :src="svipImg.left" alt=""></image>
                <view class="title-text">购买会员</view>
                <image :src="svipImg.right" alt=""></image>
            </view>
            <view class="item dir-left-nowrap" style="border-top: 0">
                <view class="label">超级会员卡名称</view>
                <view class="content">{{list.name}}</view>
            </view>
            <view class="item dir-left-nowrap">
                <view class="label">会员卡标题</view>
                <view class="content">{{card.name}}</view>
            </view>
            <view class="item dir-left-nowrap">
                <view class="label">有效时间</view>
                <view class="content">{{end_time > 0 ? end_time : today}}-{{end_day}}</view>
            </view>
            <view class="item dir-left-nowrap">
                <view class="label">有效期</view>
                <view class="content">{{card.expire_day}}天</view>
            </view>
            <view class="item dir-left-nowrap">
                <view class="label">会员卡权益</view>
                <view v-if="card.main" class="content cross-center main-between">
                    <view style="min-width: 70%">
                        <view v-if="card.main.is_free_delivery == 1">自营商品包邮</view>
                        <view v-if="card.main.is_discount && card.type_info.all">
                            <text>自营商品{{card.main.discount == 0 ? '免费' : card.main.discount + '折'}}</text>
                            <text class="about" v-if="(card && card.type_info.ignore_goods && card.type_info.ignore_goods.length > 0) || (card && card.type_info.ignore_cats && card.type_info.ignore_cats.length > 0)">(特殊商品除外)</text>
                        </view>
                        <view v-if="card && card.main.is_discount && card.type_info.cats && card.type_info.cats.length > 0">指定分类{{card.main.discount == 0 ? '免费' : card.main.discount + '折'}}</view>
                        <view v-if="card && card.main.is_discount && card.type_info.goods && card.type_info.goods.length > 0">指定商品{{card.main.discount == 0 ? '免费' : card.main.discount + '折'}}</view>
                    </view>
                    <view @click="toDetail" class="to-detail main-center cross-center">
                        <view>详情</view>
                        <image src="/static/image/icon/arrow-right.png"></image>
                    </view>
                </view>
            </view>
            <view class="item dir-left-nowrap" v-if="card.send_integral_num > 0 || card.send_balance > 0 || (card.coupons && card.coupons.length > 0) || (card.cards && card.cards.length > 0)">
                <view class="label">购买即赠</view>
                <view class="content">
                    <view v-if="card.send_integral_num > 0">积分{{card.send_integral_num}}</view>
                    <view v-if="card.send_balance > 0">余额{{card.send_balance}}</view>
                    <view v-if="card.coupons.length > 0" v-for="item in card.coupons" :key="item.id">{{item.name}}优惠券{{item.send_num}}张</view>
                    <view v-if="card.cards.length > 0" v-for="item in card.cards" :key="item.id">{{item.name}}卡券{{item.send_num}}张</view>
                </view>
            </view>
        </view>
        <view class="buy-form" v-if="list.order_form && list.is_order_form === 1">
            <app-diy-form label-position="top" :show-required-icon="true" :label-fs28="true" @validate="handleOrderFormValidate" @input="handleGoodsFormInput" :list="list.order_form"></app-diy-form>
        </view>
        <view :class="['bottom-place', `${iphone_x? 'iphone_x':''}`]"></view>
        <view :class="['foot', `${iphone_x? 'iphone_x':''}`]">
            <view @click="showClose = true" class="foot-button">支付</view>
        </view>
        <view v-if="success" class="dialog main-center cross-center">
            <view class="gift">
                <image class="gift-bg" src="./../image/gift.png"></image>
                <view class="gift-list">
                    <view @click="toIntegral" class="gift-item" v-if="card.send_integral_num > 0">
                        <image class="gift-icon" :src="list.form.integral_icon != 'statics/img/app/vip_card/integral.png'?list.form.integral_icon:svipImg.integral"></image>
                        <view>积分{{card.send_integral_num}}</view>
                        <image src="/static/image/icon/arrow-right.png"></image>
                    </view>
                    <view @click="toBalance" class="gift-item" v-if="card.send_balance > 0">
                        <image class="gift-icon" :src="list.form.balance_icon != 'statics/img/app/vip_card/balance.png'?list.form.balance_icon:svipImg.balance"></image>
                        <view>余额{{card.send_balance}}</view>
                        <image src="/static/image/icon/arrow-right.png"></image>
                    </view>
                    <view @click="toCoupon" class="gift-item" v-if="card.coupons.length > 0">
                        <image class="gift-icon" :src="list.form.coupon_icon != 'statics/img/app/vip_card/coupon.png'?list.form.coupon_icon:svipImg.coupon"></image>
                        <view>优惠券{{total_coupon}}张</view>
                        <image src="/static/image/icon/arrow-right.png"></image>
                    </view>
                    <view @click="toCard" class="gift-item" v-if="card.cards.length > 0">
                        <image class="gift-icon" :src="list.form.card_icon != 'statics/img/app/vip_card/card.png'?list.form.card_icon:svipImg.card"></image>
                        <view>卡券{{total_card}}张</view>
                        <image src="/static/image/icon/arrow-right.png"></image>
                    </view>
                    <view @click="toBack" class="dialog-btn">我知道了</view>    
                </view>
            </view>
        </view>
        <app-close v-if="showClose" :toBack="true" @update="getMall"></app-close>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";
    import AppDiyForm from "../../../components/page-component/app-diy-form/app-diy-form";
    import AppClose from '../../../components/basic-component/app-close/app-close.vue';

    export default {
        data() {
            return {
                detail: {},
                list: {
                    form: {
                        card_bg: ''
                    }
                },
                card: {
                    expire_day: '',
                    type_info: {
                        ignore_goods: [],
                        ignore_cats: [],
                    }
                },
                today: '',
                end_day: '',
                total_coupon: 0,
                total_card: 0,
                id: 0,
                end_time: '',
                start_day: '',
                success: false,
                iphone_x: false,
                template_message: [],
                loading: false,
                validateResult: {
                    hasError: false
                },
                showClose: false,
                is_open: false
            }
        },
        components: {
            AppDiyForm,
            AppClose
        },
        computed: {
            ...mapState({
                svipImg: state => state.mallConfig.__wxapp_img.vip_card
            })
        },
        methods: {
            getMall(e) {
                this.is_open = e.is_open == 1 ? true : false;
                if(this.is_open) {
                    this.subscribe();
                }
            },
            toDetail() {
                uni.navigateTo({
                    url: '/plugins/vip_card/rights/rights?id='+ this.id
                })
            },

            toBack() {
                this.success = false;
                uni.navigateBack();
            },
            toCoupon() {
                uni.navigateTo({
                    url: '/pages/coupon/index/index'
                })
            },
            toCard() {
                uni.navigateTo({
                    url: '/pages/card/index/index'
                })
            },
            toBalance() {
                uni.navigateTo({
                    url: '/pages/balance/balance'
                })
            },
            toIntegral() {
                uni.navigateTo({
                    url: '/plugins/integral_mall/index/index'
                })
            },
            getSetting() {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.vip_card.setting,
                }).then(response=>{
                    if(response.code == 0) {
                        that.list = response.data;
                        uni.setNavigationBarTitle({
                            title: '购买' + that.list.name,
                        })
                        that.template_message = response.data.template_message;
                        that.getCard();
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
            getCard() {
                let that = this;
                that.$request({
                    url: that.$api.vip_card.card_detail,
                    data: {
                        id: this.id
                    }
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.card = response.data;
                        var timestamp = Date.parse(new Date());
                        if(that.end_time > 0) {
                            timestamp = Date.parse(new Date(that.end_time));
                        }
                        // 结束
                        let endTime = (timestamp / 1000 + 24 * 60 * 60 * response.data.expire_day) * 1000;
                        let endDate = new Date(endTime)
                        let end_year = endDate.getFullYear();
                        let end_month = endDate.getMonth() + 1;
                        if (end_month >= 1 && end_month <= 9) {
                            end_month = "0" + end_month;
                        }
                        let end_now = endDate.getDate();
                        if (end_now >= 1 && end_now <= 9) {
                            end_now = "0" + end_now;
                        }
                        that.end_day = end_year + "/" + end_month + "/" + end_now;
                        that.card.coupons.forEach(v => {
                            that.total_coupon += +v.send_num
                        })
                        that.card.cards.forEach(v => {
                            that.total_card += +v.send_num
                        })
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
            subscribe() {
                if (this.validateResult.hasError) {
                    uni.showToast({
                        title: this.validateResult.errors[0].msg,
                        icon: 'none'
                    })
                    return;
                }
                if(!this.is_open) {
                    return false
                }
                this.$subscribe(this.template_message).then(res => {
                    this.toSubmit();
                }).catch(res => {
                    this.toSubmit();
                });
            },
            toSubmit() {
                let that = this;
                if(this.loading) {
                    return false
                }
                this.loading = true;
                uni.showLoading({
                    mask: true,
                    title: '购买中...'
                });
                that.$request({
                    url: that.$api.vip_card.order_submit,
                    data: {
                        id: this.id,
                        order_form: JSON.stringify(that.list.order_form)
                    },
                    method: 'post'
                }).then(response => {
                    if (response.code === 0) {
                        that.getPayOrderId(response.data.queue_id, response.data.token);
                    } else {
                        that.loading = false;
                        uni.hideLoading();
                        uni.showModal({
                            title: '提示',
                            content: response.msg,
                            showCancel: false,
                        });
                    }
                }).catch(e => {
                    that.loading = false;
                    uni.hideLoading();
                    uni.showModal({
                        title: '提示',
                        content: e.errMsg,
                        showCancel: false,
                    });
                });
            },
            handleOrderFormValidate({result}) {
                this.validateResult = result;
                this.showClose = false;
            },
            handleGoodsFormInput({data, sign}) {
                const result = [];
                for (let i in data) {
                    result[i] = {
                        key: data[i].key,
                        label: data[i].name,
                        value: data[i].value,
                        required: data[i].is_required,
                    };
                }
                this.list.order_form = result;
            },
            getPayOrderId(queue_id, token) {
                this.$request({
                    url: this.$api.vip_card.pay_data,
                    method: 'post',
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
                            this.pay(response.data.id);
                        }
                    } else {
                        uni.hideLoading();
                        this.loading = false;
                        uni.showModal({
                            title: '提示',
                            content: response.msg,
                            showCancel: false,
                        });
                    }
                }).catch(e => {
                    this.loading = false;
                    uni.hideLoading();
                    uni.showModal({
                        title: '提示',
                        content: e.errMsg,
                        showCancel: false,
                    });
                });
            },
            pay(id) {
                let that = this;
                that.$payment.pay(id).then(res => {
                    uni.hideLoading();
                    that.loading = false;
                    uni.showToast({
                        title: '购买成功',
                        duration: 1000
                    });
                    if(that.card.send_integral_num > 0 || that.card.send_balance > 0 || that.card.coupons.length > 0 || that.card.cards.length > 0) {
                        that.success = true;
                    }else {
                        setTimeout(v=>{
                            uni.navigateBack();
                        },1000)
                    }
                }).catch(res => {
                    uni.hideLoading();
                    that.loading = false;
                    uni.showToast({
                        title: '支付失败',
                        icon: 'none',
                        duration: 1000
                    });
                });
            },
        },
        onUnload() {
           clearInterval(this.getPayDataTimer);
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
            var myDate = new Date();
            let year = myDate.getFullYear();
            let month = myDate.getMonth() + 1;
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            let now = myDate.getDate();
            if (now >= 1 && now <= 9) {
                now = "0" + now;
            }
            this.today = year + "/" + month + "/" + now;
            this.id = options.id;
            this.end_time = options.end;
            this.expire_day = options.expire_day ? options.expire_day : 0;
            that.getSetting(options.id);
        }
    }
</script>

<style scoped lang="scss">
    .head-card {
        height: #{344rpx};
        position: relative;
        .card-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            height: #{80rpx};
            width: 100%;
        }
    }
    .list {
        width: #{702rpx};
        margin: 0 auto;
        position: relative;
        margin-top: #{-284rpx};
        z-index: 5;
        background-color: #fff;
        border-radius: #{15rpx};
        padding-bottom: #{40rpx};
        box-shadow: 0 0 #{8rpx} rgb(239, 239, 239);
        .title {
            width: 100%;
            padding-top: #{40rpx};
            margin-bottom: #{20rpx};
            .title-text {
                margin: 0 #{20rpx};
                font-size: #{32rpx};
                color: #342e25;
            }
            image {
                width: #{60rpx};
                height: #{19rpx};
            }
        }
        .item {
            min-height: #{120rpx};
            border-top: #{2rpx} solid #e2e2e2;
            padding: #{40rpx} 0;
            width: #{630rpx};
            margin: 0 auto;
            font-size: #{28rpx};
            color: #342e25;
            .label {
                font-size: #{28rpx};
                width: #{260rpx};
                text-align: right;
                margin-right: #{30rpx};
                color: #999999;
            }
            .content {
                width: #{340rpx};
                view {
                    margin-top: #{20rpx};
                }
                view:first-of-type {
                    margin-top: #{2rpx};
                }
                .about {
                    font-size: #{20rpx};
                    color: #999999;
                }
                .to-detail {
                    font-size: #{24 rpx};
                    margin-top: 0;
                    color: #999999;
                    width: 30%;
                    height: 100%;
                    view {
                        margin-top: 0;
                    }
                    image {
                        width: #{12rpx};
                        height: #{22rpx};
                        margin-left: #{12rpx};
                    }
                }
            }
        }
    }
    .bottom-place {
        height: #{160rpx};
    }
    .bottom-place.iphone_x {
        height: #{210rpx};
    }
    .foot {
        position: fixed;
        z-index: 997;
        bottom: 0;
        left: 0;
        width: 100%;
        height: #{160rpx};
        background-color: #F7F7F7;
        .foot-button {
            width: #{702rpx};
            margin: #{40rpx} auto;
            height: #{80rpx};
            line-height: #{80rpx};
            font-size: #{32rpx};
            text-align: center;
            border-radius: #{40rpx};
            color: #342e25;
            background-color: #F3BE94;
        }
    }
    .foot.iphone_x {
        height: #{210rpx};
        padding-bottom: #{50rpx};
    }

    .dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.3);
        z-index: 998;
        .gift {
            max-height: #{1059rpx};
            width: #{668rpx};
            .gift-bg {
                height: #{332rpx};
                width: #{668rpx};
            }
            .gift-list {
                width: #{668rpx};
                background-color: #fff;
                padding-bottom: #{55rpx};
                padding-top: #{40rpx};
                border-bottom-left-radius: #{20rpx};
                border-bottom-right-radius: #{20rpx};
                margin-top: #{-18rpx};
                .dialog-btn {
                    width: #{253rpx};
                    height: #{89rpx};
                    line-height: #{89rpx};
                    margin: #{30rpx} auto 0;
                    border-radius: #{45rpx};
                    text-align: center;
                    background: linear-gradient(to right,#fbdec7,#f3bf95);
                    color: #fcfcfc;
                }
                .gift-item {
                    position: relative;
                    color: #666666;
                    font-size: #{30rpx};
                    text-align: center;
                    height: #{112rpx};
                    line-height: #{112rpx};
                    width: #{532rpx};
                    border-radius: #{15rpx};
                    border: #{2rpx} solid #e2e2e2;
                    margin: 0 auto #{20rpx};
                    image {
                        position: absolute;
                        bottom: #{44rpx};
                        right: #{20rpx};
                        width: #{12rpx};
                        height: #{22rpx};
                    }
                    .gift-icon {
                        height: #{80rpx};
                        width: #{80rpx};
                        position: absolute;
                        left: #{30rpx};
                        top: #{15rpx};
                    }
                }
            }
        }
    }

    .buy-form {
        border-radius: 16upx;
        overflow: hidden;
        box-shadow: 0 0 5upx rgba(0,0,0,0.025);
        margin: 20upx 24upx 0 24upx;
    }
</style>