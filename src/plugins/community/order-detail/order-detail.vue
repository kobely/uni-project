<template>
    <app-layout>
        <scroll-view scroll-y :style="{'height':`${windowHeight}px`}">
            <app-head :theme="getTheme" height="320rpx"></app-head>
            <view class="title main-between cross-center">
                <view>
                    <view class="big-title-text">{{detail.status_text == '待付款' ? '等待买家付款': detail.status_text}}</view>
                    <view v-if="detail.status_text == '待付款' && detail.cancel_time_stamp > 0">若未在<text v-if="d>0">{{d}}天</text>{{h}}:{{m}}:{{s}}内付款，订单将自动取消</view>
                    <view v-if="detail.status_text == '已关闭' && detail.is_pay == 0 && detail.auto_cancel_time">超时未付款</view>
                </view>
                <view v-if="!is_user && detail.status_text != '待付款'" class="pick dir-top-nowrap main-center cross-center" :class="{'over': detail.status_text == '已完成'}">
                    <view>提货编码</view>
                    <view class="number" :style="{'color': getTheme.color}">{{detail.no}}</view>
                </view>
            </view>
            <view v-if="is_user && (detail.status_text == '待提货' || detail.status_text == '已提货' || detail.status_text == '已完成')" class="item-card send main-between">
                <view class="send-info dir-top-nowrap cross-center">
                    <view>提货编码</view>
                    <view :style="{'opacity': `${detail.status_text == '已提货' || detail.status_text == '已完成' ? '0.3':'1'}`,'color': detail.status_text == '已提货' || detail.status_text == '已完成' ? getTheme.color : ''}" class="send-no">{{detail.no}}</view>
                </view>
                <view class="line"></view>
                <view class="send-info dir-top-nowrap cross-center">
                    <view>提货二维码</view>
                    <image @click="toBig" :style="[{'opacity': `${detail.status_text == '已提货' || detail.status_text == '已完成' ? '0.3':'1'}`}]" class="qr" :src="detail.no_QrCode.file_path"></image>
                </view>
            </view>
            <view class="info">
                <view class="main-between cross-center info-top">
                    <view v-if="detail.mobile" class="user-info dir-left-nowrap cross-center">
                        <view class="avatar">
                            <image :src="is_user ? detail.middleman_info.avatar:detail.user_avatar"></image>
                        </view>
                        <view class="user main-center cross-center">
                            <text class="user-name" :class="!is_user ? 'long-name': ''">{{is_user ? detail.middleman_info.name:detail.name}}</text>
                            <view class="middleman-name" :style="{'color': getTheme.color, 'border-color': getTheme.border}" v-if="is_user">{{detail.middleman_info.middleman_name}}
                                <view class="middleman-bg" :style="{'background-color': getTheme.background}"></view>
                            </view>
                            <text>{{is_user ? detail.middleman_info.mobile:detail.mobile}}</text>
                        </view>
                    </view>
                    <view @click="tel" class="detail-btn" :style="{'color': getTheme.color}">
                        <image :style="{'background-color': getTheme.background}" src="./../image/tel.png"></image>
                        <text>{{is_user?'联系团长':'联系收货人'}}</text>
                    </view>
                </view>
                <view class="info-bottom">
                    <view v-if="is_user && detail.middleman_info" class="dir-left-nowrap cross-center"><image src="./../image/middleman-add.png"></image>提货地址：{{detail.address}}</view>
                    <view v-else>订单备注：{{detail.remark ? detail.remark : '暂无备注'}}</view>
                </view>
            </view>
            <view class="item-card">
                <view>
                    <view class="goods-title main-between">
                        <view class="dir-left-nowrap cross-center">
                            <image src="./../image/activity-name.png"></image>
                            <view>{{detail.activity_name}}</view>
                        </view>
                        <view v-if="is_user && detail.status_text == '待发货'" class="number" :style="{'color': getTheme.color}">{{detail.no}}</view>
                    </view>
                    <view v-for="(goods, key) in detail.detail" :key="key">
                        <view class="goods" :key="goods.id">
                            <image mode='aspectFill' class="goods-img" :src='goods.goods_info.pic_url'></image>
                            <view class='t-omit goods-name'>{{goods.goods_info.name}}</view>
                            <view class="goods-attr t-omit-twor">
                                <text v-for="attr in goods.goods_info.attr_list" :key="attr.attr_id">{{attr.attr_group_name}}:{{attr.attr_name}}</text>
                            </view>
                            <view class="goods-num">x{{goods.goods_info.num}}</view>
                            <view class="goods-price">￥{{goods.goods_info.total_original_price}}</view>
                        </view>
                        <view class="refund dir-right-nowrap">
                            <!-- <view @click="toRefund" class="refund-btn">申请退款</view> -->
                            <!-- 无售后记录 且 未超过售后时间 才可申请售后 -->
                            <block v-if='goods.is_show_apply_refund'>
                                <app-jump-button :url="`/pages/order/refund/select-refund-type?id=${goods.id}&sign=community`">
                                    <view size='mini' class='refund-btn'>申请售后</view>
                                </app-jump-button>
                            </block>
                            <block v-else-if="goods.refund">
                                <text class='refund-status'>已申请售后({{goods.refund.status_text}})</text>
                            </block>
                        </view>
                    </view>
                </view>
                <view class="main-between price-item">
                    <view class="price-label">商品金额</view>
                    <view>￥{{detail.total_goods_original_price}}</view>
                </view>
                <view v-if="detail.plugin_data" class="main-between price-item" v-for="(pluginData,index) in detail.plugin_data" :key="index">
                    <view class="price-label">{{pluginData.label}}</view>
                    <view>-￥{{ pluginData.value }}</view>
                </view>
                <view class="main-between price-item" style='margin-bottom: 0'>
                    <view class="price-label">合计</view>
                    <view class="total-price" :style="{'color': getTheme.color}">￥{{detail.total_price}}</view>
                </view>
            </view>
            <view v-if="!is_user" class="item-card main-between cross-center">
                <view class="goods-title dir-left-nowrap cross-center">
                    <image src="./../image/profit.png"></image>
                    <view>利润</view>
                </view>
                <view class="total-price" :style="{'color': getTheme.color}">￥{{detail.profit_price}}</view>
            </view>
            <view v-if="is_user && detail.remark" class="item-card">
                <view class="time-info main-between">
                    <view>备注: {{detail.remark}}</view>
                </view>
            </view>
            <view class="item-card">
                <view class="time-info main-between">
                    <view>订单号: {{detail.order_no}}</view>
                    <view @click="copy" class="copy-btn">复制</view>
                </view>
                <view class="time-info">下单时间: {{detail.created_at}}</view>
                <view v-if="detail.pay_time != '0000-00-00 00:00:00'" class="time-info">付款时间: {{detail.pay_time}}</view>
                <view v-if="detail.send_time != '0000-00-00 00:00:00'" class="time-info">发货时间: {{detail.send_time}}</view>
                <view v-if="detail.confirm_time != '0000-00-00 00:00:00'" class="time-info">提货时间: {{detail.confirm_time}}</view>
                <view v-if="detail.is_sale == 1" class="time-info">完成时间: {{detail.updated_at}}</view>
            </view>
            <view :class="['bottom-place', `${iphone_x? 'iphone_x':''}`]"></view>
            <view v-if="(is_user && (detail.status_text == '待付款' || detail.status_text == '待发货')) || detail.status_text == '待提货'" :class="['dir-right-nowrap','btn', `${iphone_x ? 'iphone_x':''}`]">
                <view @click.stop="orderPay" v-if="is_user && detail.is_pay == 0 && detail.cancel_status == 0" class="handle-btn" :style="{'color': getTheme.color, 'border-color': getTheme.border}">立即支付</view>
                <view @click.stop="toRemind" v-if="detail.is_send == 1 && detail.is_confirm == 0" class="handle-btn" :style="{'color': getTheme.color, 'border-color': getTheme.border}">确认提货</view>
                <view @click.stop="cancel" v-if="detail.is_pay == 1 && detail.is_send == 0" class="handle-btn" :style="{'color': getTheme.color, 'border-color': getTheme.border}">申请退款</view>
            </view>
            <view v-if="is_user && (detail.is_pay == 0 || (detail.is_pay == 1 && detail.is_send == 0)) && detail.cancel_status == 0" :class="['bottom-total-price', `${iphone_x? 'iphone_x':''}`]" :style="{'color': getTheme.color}">合计：￥{{detail.total_price}}</view>
            <view v-if="show" class="bg">
                <view class="dialog">
                    <view class="dialog-content">是否确认提货</view>
                    <view class="main-center btn-area">
                        <view class="submit-btn box-grow-1" style="color: #666" @click='toRemind'>取消</view>
                        <view class="line"></view>
                        <view class="submit-btn box-grow-1" @click='beConfirm' :style="{'color': getTheme.color}">确认</view>
                    </view>
                </view>
            </view>
            <view @click="toBig" v-if="showQr" class="bg">
                <view  @click.stop="" class="dialog qr-dialog dir-top-nowrap cross-center">
                    <image @click.stop="toBig" class="close" src="/static/image/icon/icon-close.png"></image>
                    <image class="qr" :src="detail.no_QrCode.file_path"></image>
                    <view>提货编码 {{detail.no}}</view>
                    <view class="qr-info">仅{{detail.middleman_info.middleman_name}} {{detail.middleman_info.name}} 可以扫码核销</view>
                </view>
            </view>
        </scroll-view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appHead from "../components/app-head.vue";

    export default {
        data() {
            return {
                detail: {
                    profit_price: '',
                    total_price: '',
                    total_goods_price: '',
                    total_goods_original_price: '',
                    created_at: '',
                    order_no: '',
                    pay_time: '0000-00-00 00:00:00',
                    send_time: '0000-00-00 00:00:00',
                    confirm_time: '0000-00-00 00:00:00',
                    sale_time: '0000-00-00 00:00:00',
                },
                d: '',
                h: '',
                m: '',
                s: '',
                windowHeight: 0,
                timeInterval: null,
                showQr: false,
                is_user: false,
                show: false,
                iphone_x: false
            }
        },
        components: {
            appHead
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                userInfo: state => state.user.info,
                adminImg: state => state.mallConfig.__wxapp_img.app_admin,
            })
        },
        methods: {
            // 取消 | 申请退款
            cancel(e) {
                let self = this;
                uni.navigateTo({
                    url: '/pages/order/refund/order-refund?id=' + self.detail.id
                });
            },
            toBig() {
                if(this.detail.status_text == '已提货' || this.detail.status_text == '已完成') {
                    return false
                }
                this.showQr = !this.showQr
            },
            toRemind() {
                this.show = !this.show;
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
                        id: that.detail.id
                    }
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.getDetail();
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                })
            },
            // 订单支付
            orderPay(e) {
                let _this = this;
                _this.$showLoading();
                _this.$request({
                    url: _this.$api.order.list_pay_data,
                    data: {
                        id: this.detail.id
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
            copy() {
                this.$utils.uniCopy({
                    data: this.detail.order_no,
                    success() {
                        //#ifndef MP-WEIXIN
                        uni.showToast({title: '复制成功'});
                        // #endif
                    },
                });
            },
            tel() {
                let phoneNumber = this.detail.mobile
                if(this.is_user) {
                    phoneNumber = this.detail.middleman_info.mobile
                }
                uni.makePhoneCall({
                    phoneNumber: phoneNumber
                })
            },
            getDetail() {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.$request({
                    url: that.is_user ? that.$api.community.order_detail : that.$api.community.middle_detail,
                    data: {
                        id: this.id
                    },
                    method: 'post'
                }).then(response=>{
                    uni.hideLoading();
                    that.$hideLoading();
                    if(response.code === 0) {
                        that.detail = response.data.detail;
                        that.getTime(that.detail.cancel_time_stamp);
                        let time = +that.detail.cancel_time_stamp - 1;
                        if(time > 0) {
                            that.timeInterval = setInterval(() =>{
                                time--;
                                if(time < 0) {
                                    clearInterval(that.timeInterval);
                                    that.getDetail();
                                }else {
                                    that.getTime(time);
                                }
                            },1000);
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                        if(response.msg == '该订单您无权确认') {
                            setTimeout(()=>{
                                uni.redirectTo({
                                    url: '/pages/index/index'
                                });
                            },1000)
                        }
                    }
                }).catch(response => {
                    uni.hideLoading();
                    that.$hideLoading();
                });
            },
            getTime(time) {
                let that = this;
                if(time > 86399) {
                    this.d = Math.floor(time / 86400)
                    time = time - (86400*this.d)
                }else {
                    this.d = 0
                }
                if(time > 3599) {
                    this.h = Math.floor(time / 3600)
                    if(this.h < 10) {
                        this.h = '0' + this.h
                    }
                    time = time - (3600*this.h)
                }else {
                    this.h = '00'
                }
                if(time > 59) {
                    this.m = Math.floor(time / 60)
                    if(this.m < 10) {
                        this.m = '0' + this.m
                    }
                    time = time - (60*this.m)
                }else {
                    this.m = '00';
                }
                if(time < 60) {
                    this.s = time;
                    if(this.s < 10) {
                        this.s = '0' + this.s
                    }
                }
            },
        },
        onHide() {
            clearInterval(this.timeInterval);
        },
        onUnload() {
            clearInterval(this.timeInterval);
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            if(options.is_user == 1) {
                that.is_user = true
            }
            uni.getSystemInfo({
                success: function (res) {
                    that.windowHeight = res.windowHeight;
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
            that.id = options.id;
            that.getDetail();
        }
    }
</script>

<style scoped lang="scss">
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
            &.qr-dialog {
                top: 230rpx;
                width: 600rpx;
                height: 620rpx;
                border-radius: 16rpx;
                padding: 90rpx 0 56rpx;
                font-size: 32rpx;
                margin-left: -300rpx;
                .close {
                    width: 30rpx;
                    height: 30rpx;
                    right: 103rpx;
                    top: #{260rpx};
                    z-index: 234;
                    position: fixed;
                }
                .qr {
                    width: 360rpx;
                    height: 360rpx;
                    display: block;
                    margin-bottom: 30rpx;
                }
                .qr-info {
                    font-size: 26rpx;
                    color: #999999;
                    margin-top: 10rpx;  
                }
            }
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
    .title {
        padding: 20rpx 45rpx;
        margin-top: -320rpx;
        height: 160rpx;
        color: #fff;
        font-size: 26rpx;
        position: relative;
        z-index: 10;
        .big-title-text {
            font-size: 36rpx;
        }
        .pick {
            height: 124rpx;
            width: 124rpx;
            border-radius: 50%;
            background-color: #fff;
            color: #353535;
            font-size: 22rpx;
            &.over {
                background-color: #f0f0f0;
                color: #dbdbdb;
                .number {
                    color: #dbdbdb;
                }
            }
            .number {
                font-size: 38rpx;
            }
        }
    }
    .info {
        border-radius: 16rpx;
        width: 702rpx;
        margin: 0 24rpx;
        background-color: #fff;
        position: relative;
        z-index: 10;
        font-size: 24rpx;
        .info-top {
            height: 106rpx;
            padding: 25rpx 24rpx;
            .user-info {
                height: 56rpx;
                .avatar {
                    margin-right: 24rpx;
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
                    .user-name {
                        margin-left: 0;
                        display: inline-block;
                        max-width: 100rpx;
                        max-height: 62rpx;
                        overflow: hidden;
                        &.long-name {
                            max-width: 230rpx;
                        }
                    }
                    .middleman-name {
                        margin-left: 10rpx;
                        font-size: 20rpx;
                        height: 30rpx;
                        line-height: 26rpx;
                        padding: 0 5rpx;
                        display: inline-block;
                        border-radius: 10rpx;
                        border: 2rpx solid;
                        margin-top: 2rpx;
                        position: relative;
                        white-space: nowrap;
                        .middleman-bg {
                            border-radius: 10rpx;
                            position: absolute;
                            top: 0;
                            left: 0;
                            opacity: 0.1;
                            height: 100%;
                            width: 100%;
                        }
                    }
                    text {
                        margin-left: 25rpx;
                    }
                }
            }
            .detail-btn {
                height: 56rpx;
                line-height: 56rpx;
                image {
                    height: #{28rpx};
                    width: #{28rpx};
                    display: block;
                    margin-top: #{14rpx};
                    margin-right: #{10rpx};
                    float: left;
                }
            }
        }
        .info-bottom {
            border-top: 2rpx solid #e2e2e2;
            padding: 18rpx 24rpx;
            image {
                width: 19rpx;
                height: 25rpx;
                margin-right: 10rpx;
            }
        }
    }
    .item-card {
        padding: #{24rpx};
        background-color: #fff;
        margin: #{24rpx};
        margin-bottom: 0;
        border-radius: #{16rpx};
        position: relative;
        &.send {
            margin: #{24rpx};
            margin-top: 0;
        }
        .line {
            height: 180rpx;
            width: 2rpx;
            position: absolute;
            left: 50%;
            top: 10rpx;
            background-color: #e2e2e2;
            margin-left: -1rpx;
        }
        .send-info {
            width: 303rpx;
            height: 152rpx;
            text-align: center;
            color: #353535;
            font-size: 24rpx;
            .send-no {
                font-size: 38rpx;
                height: 135rpx;
                line-height: 135rpx;
            }
            .qr {
                display: block;
                height: 100rpx;
                width: 100rpx;
                margin-top: 10rpx;
            }
        }
        .total-price {
            font-size: 28rpx;
        }
        .goods-title {
            color: #353535;
            font-size: #{24rpx};
            height: 30rpx;
            image {
                width: 30rpx;
                height: 30rpx;
                margin-right: 14rpx;
                display: block;
            }
            .number {
                font-size: 32rpx;
            }
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
                margin-right: #{24rpx};
                border-radius: #{4rpx};
            }
            .goods-name {
                font-size: 26rpx;
            }
            .goods-attr {
                color: #999;
                width: 70%;
                position: absolute;
                top: #{40rpx};
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
        .refund {
            margin-bottom: #{40rpx};
            .refund-btn {
                width: #{168rpx};
                text-align: center;
                height: #{56rpx};
                line-height: #{54rpx};
                font-size: #{26rpx};
                color: #666666;
                border: #{2rpx} solid #e2e2e2;
                border-radius: #{28rpx};
            }
        }
        .price-item {
            margin-bottom: #{10rpx};
            font-size: #{24rpx};
            color: #353535;
            .price-label {
                color: #999;
                font-size: #{24rpx};
            }
        }
        .time-info {
            margin-top: 25rpx;
            color: #353535;
            font-size: #{24rpx};
            &:first-of-type {
                margin-top: 0;
            }
            .copy-btn {
                position: absolute;
                top: 12rpx;
                right: 24rpx;
                height: 60rpx;
                border-radius: 30rpx;
                line-height: 58rpx;
                padding: 0 30rpx;
                border: 2rpx solid #e2e2e2;
            }
        }
    }
    .bottom-place {
        height: #{120rpx};
        &.iphone_x {
            height: #{170rpx};
        }
    }
    .bottom-total-price {
        height: #{96rpx};
        line-height: 96rpx;
        position: fixed;
        bottom: 0;
        width: 50%;
        left: 30rpx;
        z-index: 14;
        font-size: 32rpx;
        &.iphone_x {
            height: #{146rpx};
            line-height: 146rpx;
            padding-bottom: #{50rpx};
        }
    }
    .btn {
        height: #{96rpx};
        position: fixed;
        bottom: 0;
        width: 100%;
        right: 0;
        border-top: #{1rpx} solid #e2e2e2;
        z-index: 10;
        padding: #{24rpx};
        background-color: #fff;
        &.iphone_x {
            height: #{146rpx};
            padding-bottom: #{50rpx};
        }
        .handle-btn {
            height: #{48rpx};
            line-height: #{46rpx};
            padding: 0 #{24rpx};
            border-radius: #{24rpx};
            border: #{2rpx} solid;
            font-size: #{24rpx};
            margin-left: #{16rpx};
            display: inline-block;
        }
    }

</style>