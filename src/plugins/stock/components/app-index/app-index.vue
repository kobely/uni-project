<template>
    <view>
        <view v-if="stock.index" class="app-stock-user" :style="{'background-image': `url(${stock.index})`}">
            <view @click="toAbout" class="about dir-left-nowrap cross-center">
                <text>升级说明</text>
                <image src="/static/image/icon/question.png"></image>
            </view>
            <view @click="toCash" class="cash-btn">提现</view>
            <view @click="toUpdate" class="dir-left-nowrap cross-center user-info">
                <image :src="detail.avatar"></image>
                <view>{{detail.level.name}}</view>
                <view v-if="detail.is_up == '1'" class="level-icon">可升级</view>
            </view>
            <view class="rate">当前{{setting.form.rate ? setting.form.rate : '分红比例'}}为{{detail.bonus_rate}}%</view>
            <view class="price">
                <view class="price-detail">{{detail.total_bonus}}</view>
                <view>{{setting.form.total_bonus ? setting.form.total_bonus : '可提现分红'}}(元)</view>
            </view>
        </view>
        <view class="app-stock-bonus main-between">
            <view class="bonus-item main-between cross-center">
                <view>{{setting.form.cash_bonus ? setting.form.cash_bonus : '已提现分红'}}(元)</view>
                <view class="bonus-price">{{detail.cash_bonus}}</view>
            </view>
        </view>
        <view class="app-stock-menu dir-left-wrap cross-center">
            <view @click="toBonus" class="menu-item dir-top-nowrap cross-center">
                <image class="menu-icon" :src="stock.stock"></image>
                <view>{{setting.form.stock ? setting.form.stock : '股东分红'}}</view>
            </view>
            <view @click="toDetail" class="menu-item dir-top-nowrap cross-center">
                <image class="menu-icon" :src="stock.cash"></image>
                <view>{{setting.form.cash_detail ? setting.form.cash_detail : '提现明细'}}</view>
            </view>
            <view @click="toBalance" class="menu-item dir-top-nowrap cross-center">
                <image class="menu-icon" :src="stock.detail"></image>
                <view>{{setting.form.balance_detail ? setting.form.balance_detail : '结算明细'}}</view>
            </view>
        </view>
    </view>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        name: 'app-index',
        props: {
            detail: {
                type: Object
            },
            setting: {
                type: Object
            },
        },
        computed: {
            ...mapState({
                stock: state => state.mallConfig.__wxapp_img.stock,
            })
        },
        methods: {
            toUpdate() {
                uni.navigateTo({
                    url: '/plugins/stock/update/update'
                });
            },
            toCash() {
                uni.navigateTo({
                    url: '/plugins/stock/cash/cash'
                });
            },
            toBonus() {
                let name = this.setting.form.stock ? this.setting.form.stock : '';
                let cash_detail_name = this.setting.form.cash_detail ? this.setting.form.cash_detail : '';
                uni.navigateTo({
                    url: '/plugins/stock/bonus/bonus?name=' + name + '&cash_detail=' + cash_detail_name
                });
            },
            toDetail() {
                let name = this.setting.form.cash_detail ? this.setting.form.cash_detail : '';
                uni.navigateTo({
                    url: '/plugins/stock/cash-detail/cash-detail?name=' + name
                });
            },
            toBalance() {
                let name = this.setting.form.balance_detail ? this.setting.form.balance_detail : '';
                uni.navigateTo({
                    url: '/plugins/stock/balance/balance?name=' + name
                });
            },
            toAbout() {
                uni.navigateTo({
                    url: `/pages/rules/index?url=${encodeURIComponent(this.$api.stock.level)}&key=level_up_remark`,
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-stock-user {
        width: 100%;
        height: #{460rpx};
        padding: #{56rpx};
        background-size: 100% 100%;
        position: relative;
        font-size: #{26rpx};
        color: #ffe5be;
        .user-info {
            margin-bottom: #{20rpx};
            position: relative;
            width:fit-content;
            width:-webkit-fit-content;
            width:-moz-fit-content;
            height: #{60rpx};
            padding: 0 #{32rpx} 0 #{2rpx};
            font-size: #{28rpx};
            color: #ffe5be;
            background-color: rgba(0,0,0,.3);
            border-radius: #{30rpx};
            image {
                width: #{56rpx};
                border-radius: #{28rpx};
                height: #{56rpx};
                margin-right: #{16rpx};
                display: block;
            }
            .level-icon {
                padding: #{2rpx} #{10rpx};
                font-size: #{22rpx};
                color: #fff;
                background-color: #ff4544;
                border-radius: #{16rpx};
                border-bottom-left-radius: 0;
                position: absolute;
                right: #{-40rpx};
                top: #{-20rpx};
            }
        }
        .about {
            position: absolute;
            top: #{56rpx};
            right: #{56rpx};
            font-size: #{26rpx};
            height: #{60rpx};
            line-height: #{60rpx};
            color: rgba(255,255,255,.5);
            image {
                width: #{28rpx};
                height: #{28rpx};
                opacity: 0.5;
                margin-left: #{12rpx};
            }
        }
        .price {
            font-size: #{24rpx};
            color: #fff;
            margin-top: #{40rpx};
            .price-detail {
                font-size: #{64rpx};
                font-family: DIN;
                margin-bottom: #{6rpx};
            }
        }
        .cash-btn {
            padding: 0 #{42rpx};
            border-radius: #{32rpx};
            display: inline-block;
            height: #{64rpx};
            line-height: #{64rpx};
            font-size: #{28rpx};
            color: #fff;
            text-align: center;
            position: absolute;
            right: #{56rpx};
            top: #{232rpx};
            background: linear-gradient(to right, #d59635, #f8bb60);
        }
    }
    .app-stock-bonus {
        margin-top: #{-80rpx};
        padding: 0 #{24rpx};
        height: #{170rpx};
        .bonus-item {
            background-color: #fff;
            position: relative;
            z-index: 2;
            width: #{702rpx};
            height: #{124rpx};
            border-radius: #{16rpx};
            box-shadow: 0 0 #{10rpx} rgba(0,0,0,.05);
            padding: 0 #{32rpx};
            color: #999999;
            font-size: #{26rpx};
            .bonus-price {
                font-size: #{40rpx};
                font-family: DIN;
                color: #353535;
                margin-top: #{4rpx};
            }
        }
    }
    .app-stock-menu {
        margin: #{24rpx};
        margin-top: #{-20rpx};
        border-radius: #{16rpx};
        background-color: #fff;
        padding: #{48rpx} #{27rpx} #{50rpx};
        box-shadow: 0 0 #{10rpx} rgba(0,0,0,.05);
        .menu-item {
            width: #{216rpx};
            font-size: #{28rpx};
            color: #353535;
            .menu-icon {
                width: #{120rpx};
                height: #{120rpx};
                margin-bottom: #{20rpx};
                display: block;
            }
        }
    }
</style>