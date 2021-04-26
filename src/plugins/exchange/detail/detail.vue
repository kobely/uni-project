<template>
    <app-layout>
        <view class="code-info" :style="{backgroundImage: 'url('+ exchangeImg.bg + ')',backgroundColor: getTheme.background}">
            <view class="code">{{code}}</view>
            <view v-if="exchange == 0">该兑换码包含{{list.length}}种礼品，您可以{{mode == 0 ? '全部':'任选一件'}}兑换：</view>
            <view v-if="exchange == 1">于{{r_raffled_at}}兑换以下礼品</view>
        </view>
        <view>
            <view class="rewards" v-for="(item,index) in list" :key="index">
                <view class="rewards-top dir-left-nowrap cross-center" :class="mode == 1 ? 'active-item':''">
                    <app-radio width="88" :height="item.type == 'integral' || item.type == 'balance' || item.type == 'svip' ? '36':'140'"  @click="toggle" :value="item.active" :item="item" :theme="getTheme" type="round" v-if="mode == 1">
                    </app-radio>
                    <view v-if="item.type == 'goods'" class="dir-left-nowrap card goods">
                        <image class="card-img" mode="aspectFill" :src="item.goods_info.cover_pic"></image>
                        <view class="card-info">
                            <view class="t-omit-two card-name">{{item.goods_info.name}}</view>
                            <view class="attr">{{item.goods_info.attr_str}}</view>
                            <view class="dir-right-nowrap">
                                <div class="goods-num" :style="{'color': getTheme.color}">x{{item.goods_num}}</div>
                            </view>
                        </view>
                    </view>
                    <view v-if="item.type == 'card'" class="dir-left-nowrap card">
                        <image class="card-img" mode="aspectFill" v-if="item.card_info.pic_url" :src="item.card_info.pic_url"></image>
                        <view class="card-info">
                            <view class="dir-left-nowrap">
                                <image src="./../image/card.png"></image>
                                <view class="t-omit-two card-name">{{item.card_info.name}}</view>
                            </view>
                            <view class="main-between cross-center">
                                <div class="card-number" :style="{'color': getTheme.color,'background-color': getTheme.background_o}">剩余{{item.card_info.number}}次</div>
                                <div class="card-num" :style="{'color': getTheme.color}">x{{item.card_num}}</div>
                            </view>
                        </view>
                    </view>
                    <view v-if="item.type == 'coupon'" class="dir-left-nowrap card">
                        <view class="card-info">
                            <view class="dir-left-nowrap">
                                <image src="./../image/coupon.png"></image>
                                <view class="t-omit-two card-name">{{item.coupon_info.name}}</view>
                            </view>
                            <view class="main-between cross-center">
                                <div v-if="item.coupon_info.type == 1" class="card-number" :style="{'color': getTheme.color,'background-color': getTheme.background_o}">{{item.coupon_info.discount}}折 满{{item.coupon_info.min_price == 0 ? '任意金额': '￥'+item.coupon_info.min_price}}可用 <text style="margin-left: 10rpx" v-if="item.coupon_info.discount_limit">优惠上限￥{{item.coupon_info.discount_limit}}</text></div>
                                <div v-if="item.coupon_info.type == 2" class="card-number" :style="{'color': getTheme.color,'background-color': getTheme.background_o}">￥{{item.coupon_info.sub_price}} 满{{item.coupon_info.min_price == 0 ? '任意金额': '￥'+item.coupon_info.min_price}}可用</div>
                                <div class="card-num" :style="{'color': getTheme.color}">x{{item.coupon_num}}</div>
                            </view>
                        </view>
                    </view>
                    <view v-if="item.type == 'integral' || item.type == 'balance' || item.type == 'svip'" class="dir-left-nowrap balance">
                        <view class="balance-info cross-center main-between">
                            <view class="dir-left-nowrap cross-center">
                                <image v-if="item.type == 'integral'" src="./../image/point.png"></image>
                                <image v-if="item.type == 'balance'" src="./../image/balance.png"></image>
                                <image v-if="item.type == 'svip'" src="./../image/svip.png"></image>
                                <view class="balance-name">{{item.name}}</view>
                            </view>
                            <view v-if="item.type == 'integral'" :style="{'color': getTheme.color}">{{item.integral_num}}</view>
                            <view v-if="item.type == 'balance'" :style="{'color': getTheme.color}">￥{{item.balance}}</view>
                            <view v-if="item.type == 'svip'" :style="{'color': getTheme.color}">{{item.svip_info.discount}}折</view>
                        </view>
                    </view>
                </view>
                <view v-if="exchange == 1" class="rewards-bottom dir-right-nowrap cross-center">
                    <view v-if="item.is_send == 0" @click="apply(item)" :style="{'background-color': getTheme.background}" class="rewards-submit">立即领取</view>
                    <view v-if="item.is_send == 1" class="rewards-submit over">已领取</view>
                    <view v-if="item.goods_id > 0 || (item.user_coupon_id && item.user_coupon_id.length > 0) || (item.user_card_id && item.user_card_id.length > 0)" @click="toDetail(item)" :style="{'color': getTheme.color, 'border-color': getTheme.border}" class="rewards-detail">查看详情</view>
                </view>
            </view>
        </view>
        <view v-if="exchange == 0" class="placeholder"></view>
        <view v-if="exchange == 0 && list.length > 0" class="apply safe-area-inset-bottom">
            <view class="apply-btn" @click="submit" :style="{'background-color': getTheme.background}">立即兑换</view>
        </view>
        <u-mask :show="dialog" :maskClickAble="false" :zoom="false">
            <view class="dialog">
                <image class="dialog-img" src="./../image/error.png"></image>
                <view class="dialog-msg">
                    <text>{{msg}}</text>
                </view>
                <view class="dialog-other">{{other}}</view>
                <view @click="goback"  :style="{'background-color': getTheme.background}" class="dialog-button">我知道了</view>
            </view>
        </u-mask>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import uMask from '../../../components/basic-component/u-mask/u-mask.vue';
    import appIphoneX from '../../../components/basic-component/app-iphone-x/app-iphone-x.vue';
    import appRadio from '../../../components/basic-component/app-radio/app-radio.vue';

    export default {
        name: "index",
        data() {
            return {
                first: true,
                loading: false,
                code: '',
                dialog: false,
                msg: '',
                other: '',
                r_raffled_at: '',
                list: [],
                mode: 0,
                exchange: 0,
                token: ''
            };
        },
        components:{
            'app-radio': appRadio,
            uMask,
            'app-iphone-x': appIphoneX,
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.code = options.code;
            that.exchange = options.exchange == 1 ? 1 : 0;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.getList();
        },
        onShow() {
            if(this.exchange == 1 && !this.first) {
                this.getList()
            }
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                exchangeImg: state => state.mallConfig.__wxapp_img.exchange
            })
        },
        methods: {
            toDetail(item) {
                if(item.type == 'goods') {
                    uni.navigateTo({
                        url: `/pages/goods/goods?id=${item.goods_id}&code=${this.code}&token=${item.token}&attr=${item.goods_info.attr_str}&attr_id=${item.attr_id}&goods_num=${item.goods_num}&exchange=${item.is_send}`
                    });
                }else if(item.type == 'coupon') {
                    uni.navigateTo({
                        url: `/pages/coupon/details/details-no-share?person=1&id=${item.user_coupon_id[0]}`
                    });
                }else if(item.type == 'card') {
                    uni.navigateTo({
                        url: `/pages/card/details/details?id=${item.user_card_id[0]}`
                    });
                }
            },
            goback() {
                this.dialog = false;
                uni.navigateBack();
            },
            apply(item) {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '领取中...'
                });
                if(item.type != 'goods') {
                    that.$request({
                        url: that.$api.exchange.covert,
                        data: {
                            code: this.code,
                            token: item.token
                        },
                        method: 'post'
                    }).then(response=>{
                        uni.hideLoading();
                        if(response.code == 0) {
                            uni.showToast({
                                title: response.msg,
                                duration: 1000
                            });
                            this.getList();
                        }else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    }).catch(response => {
                        uni.hideLoading();
                    });
                }else {
                    let mch_list = [{
                        mch_id: 0,
                        goods_list: [{
                            id: item.goods_id,
                            attr: item.goods_info.attr_str,
                            num: item.goods_num,
                            cat_id: 0,
                            goods_attr_id: item.attr_id
                        }],
                        code: this.code,
                        token: item.token,
                    }];
                    let url = `/pages/order-submit/order-submit?mch_list=${JSON.stringify(mch_list)}`;
                    url += `&preview_url=${encodeURIComponent(this.$api.exchange.exchange_preview)}&submit_url=${encodeURIComponent(this.$api.exchange.exchange_submit)}&plugin=exchange`;
                    uni.navigateTo({
                        url: url
                    })
                }
            },
            toggle(e) {
                for(let item of this.list) {
                    if(item.token == e.item.token) {
                        item.active = e.active;
                        this.token = e.item.token
                    }else {
                        item.active = false;
                    }
                }
                this.$forceUpdate();
            },
            submit() {
                let that = this;
                if(that.mode == 1 && !that.token) {
                    uni.showToast({
                        title: '请选择想要兑换的礼品',
                        icon: 'none',
                        duration: 1000
                    });
                    return false
                }
                if(this.loading) {
                    return false
                }
                this.loading = true;
                uni.showLoading({
                    mask: true,
                    title: '领取中...'
                });
                that.$request({
                    url: that.$api.exchange.unite,
                    data: {
                        code: this.code,
                        token: this.token
                    },
                    method: 'post'
                }).then(response=>{
                    this.loading = false;
                    uni.hideLoading();
                    if(response.code == 0) {
                        this.exchange = 1;
                        this.mode = 0;
                        this.getList();
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                });
            },
            getList() {
                let that = this;
                that.$request({
                    url: that.exchange == 1 ? that.$api.exchange.log_detail : that.$api.exchange.info,
                    data: {
                        code: that.code
                    }
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    that.first = false;
                    if(response.code == 0) {
                        if(that.exchange == 0) {
                            that.list = response.list.rewards;
                            that.mode = response.list.mode;
                            if(that.mode == 1) {
                                for(let item of that.list) {
                                    item.active = false;
                                }
                            }
                        }else {
                            that.r_raffled_at = response.data.codeModel.r_raffled_at
                            that.list = response.data.rewards;
                        }
                    }else {
                        if(that.exchange == 0) {
                            that.msg = response.msg;
                            that.other = '';
                            if(response.msg == '该兑换码未到使用时间!') {
                                that.other = response.data.valid_start_time + '-' + response.data.valid_end_time + ' 可用'
                            }
                            that.dialog = true;
                        }else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    }
                }).catch(response => {
                    that.$hideLoading();
                    uni.hideLoading();
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .dialog {
        margin: 270rpx auto;
        background-color: #fff;
        border-radius: 16rpx;
        width: 600rpx;
        padding: 60rpx 0;
        text-align: center;
        .dialog-img {
            width: 200rpx;
            height: 200rpx;
            margin: 0 auto 20rpx;
        }
        .dialog-msg {
            font-size: 32rpx;
            color: #353535;
        }
        .dialog-other {
            font-size: 24rpx;
            color: #999999;
        }
        .dialog-button {
            font-size: 26rpx;
            width: 520rpx;
            height: 90rpx;
            border-radius: 45rpx;
            line-height: 90rpx;
            text-align: center;
            color: #fff;
            margin: 50rpx auto 0;
        }
    }
    .code-info {
        width: 702rpx;
        height: 240rpx;
        border-radius: 16rpx;
        background-size: 100% 100%;
        margin: 24rpx;
        text-align: center;
        color: #fff;
        font-size: 24rpx;
        .code {
            margin-top: 50rpx;
            display: inline-block;
            font-size: 38rpx;
            text-align: center;
            padding: 24rpx 95rpx;
            border-radius: 60rpx;
            color: #fff;
            background-color: rgba(255,255,255,.2);
            margin-bottom: 20rpx;
        }
    }
    .rewards {
        background-color: #fff;
        border-radius: 16rpx;
        width: 702rpx;
        margin: 24rpx auto 0;
        .rewards-top {
            padding: 34rpx 40rpx;
            &.active-item {
                padding-left: 0;
            }
            .active {
                width: 88rpx;
                height: 140rpx;
                text-align: center;
                flex-shrink: 0;
                image {
                    width: 32rpx;
                    height: 32rpx;
                    margin-top: 54rpx;
                    border-radius: 16rpx;
                }
                &.small {
                    height: 36rpx;
                    image {
                        margin-top: 2rpx;
                    }
                }
            }
            .goods-num {
                font-size: 28rpx;
            }
            .balance {
                width: 100%;
                .balance-info {
                    width: 100%;
                    image {
                        width: 30rpx;
                        height: 30rpx;
                        margin-right: 14rpx;
                    }
                    .balance-name {
                        font-size: 28rpx;
                        color: #353535;
                    }
                }
            }
            .card {
                width: 100%;
                &.goods {
                    .card-info {
                        .card-name {
                            margin-top: 0;
                            margin-bottom: 10rpx;
                        }
                    }
                }
                .card-img {
                    height: 140rpx;
                    width: 140rpx;
                    border-radius: 8rpx;
                    margin-right: 20rpx;
                    flex-shrink: 0;
                }
                .card-info {
                    width: 100%;
                    image {
                        width: 30rpx;
                        height: 30rpx;
                        margin-right: 14rpx;
                    }
                    .attr {
                        font-size: 24rpx;
                        color: #999;
                    }
                    .card-name {
                        margin-top: -5rpx;
                        font-size: 28rpx;
                        color: #353535;
                        margin-bottom: 30rpx;
                    }
                    .card-number {
                        padding: 12rpx 20rpx;
                        font-size: 24rpx;
                        border-radius: 30rpx;
                    }
                    .card-num {
                        font-size: 28rpx;
                    }
                }
            }
        }
        .rewards-bottom {
            border-top: #{2rpx} solid #e2e2e2;
            height: #{118rpx};
            width: 100%;
            padding: 0 #{30rpx};
            .rewards-submit {
                height: #{68rpx};
                line-height: #{68rpx};
                text-align: center;
                padding: 0 #{30rpx};
                border-radius: #{40rpx};
                color: #fff;
                font-size: #{28rpx};
                &.over {
                    background-color: #f7f7f7;
                    color: #999999;
                }
            }
            .rewards-detail {
                height: #{68rpx};
                line-height: #{68rpx};
                text-align: center;
                padding: 0 #{30rpx};
                border-radius: #{40rpx};
                background-color: #fff;
                font-size: #{28rpx};
                border: #{2rpx} solid;
                margin-right: #{18rpx};
            }
        }
    }
    .placeholder {
        height: #{178rpx};
        width: 100%;
    }

    .apply {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 2;
        height: #{154rpx};
        width: 100%;
        background-color: #fff;
        padding-top: #{26rpx};
        padding-left: #{24rpx};
        .apply-btn {
            width: #{702rpx};
            height: #{88rpx};
            line-height: #{88rpx};
            border-radius: #{44rpx};
            text-align: center;
            color: #fff;
            font-size: #{32rpx};
        }
    }
</style>