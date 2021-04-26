<template>
    <view>
        <view v-if="region.index" class="app-region-user" :style="{'background-image': `url(${region.index})`}">
            <view class="dir-left-nowrap user-info">
                <image class="avatar" :src="detail.avatar"></image>
                <view>
                    <view class="name">{{detail.nickname}}</view>
                    <view class="dir-left-nowrap cross-center">
                        <view class="level" @click="toUpdate">
                            <text v-if="detail.level == 1">省代理</text>
                            <text v-if="detail.level == 2">市代理</text>
                            <text v-if="detail.level == 3">区/县代理</text>
                            <image class="right-arrow" src="/static/image/icon/arrow-right-white.png"></image>
                            <image v-if="detail.is_up == 1 && detail.level_up_log && detail.level_up_log.status != 2" class="is-up" src="../image/up.png"></image>
                            <image v-if="detail.is_up == 1 && detail.level_up_log && detail.level_up_log.status == 2" class="is-up" src="../image/up-lose.png"></image>
                            <image v-if="detail.is_up == 0 && detail.level_up_log && detail.level_up_log.status == 1" class="is-up" src="../image/up-success.png"></image>
                        </view>
                        <view class="rate main-between cross-center">
                            <view>{{setting.form.rate ? setting.form.rate : '分红比例'}}{{detail.bonus_rate}}%</view>
                            <view @click="toAbout" class="about dir-right-nowrap cross-center">
                                <image src="/static/image/icon/question.png"></image>
                                <text>说明</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="price main-between cross-center">
                <view>
                    <view class="price-detail">{{detail.total_bonus}}</view>
                    <view>{{setting.form.total_bonus ? setting.form.total_bonus : '可提现分红'}}(元)</view>
                </view>
                <view @click="toCash" class="cash-btn">提现</view>
            </view>
        </view>
        <view class="app-region-bonus main-between">
            <view class="bonus-item">
                <view>{{setting.form.cash_bonus ? setting.form.cash_bonus : '已提现分红'}}(元)</view>
                <view class="bonus-price">{{detail.cash_bonus}}</view>
            </view>
            <view class="bonus-item">
                <view>{{setting.form.all_bonus ? setting.form.all_bonus : '累计分红'}}(元)</view>
                <view class="bonus-price">{{detail.all_bonus}}</view>
            </view>
        </view>
        <view class="app-region-menu main-center cross-center">
            <view @click="toBonus" class="menu-item dir-top-nowrap cross-center">
                <image class="menu-icon" :src="region.bonus"></image>
                <view>{{setting.form.region ? setting.form.region : '代理分红'}}</view>
            </view>
            <view @click="toDetail" class="menu-item dir-top-nowrap cross-center">
                <image class="menu-icon" :src="region.cash"></image>
                <view>{{setting.form.cash_detail ? setting.form.cash_detail : '提现明细'}}</view>
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
                region: state => state.mallConfig.__wxapp_img.region,
            })
        },
        methods: {
            toUpdate() {
                if(this.detail.is_up == 1 && this.detail.level_up_log && this.detail.level_up_log.status == 2) {
                    uni.navigateTo({
                        url: '/plugins/region/index/index?up=1'
                    });
                }else {
                    uni.navigateTo({
                        url: '/plugins/region/update/update'
                    });
                }
            },
            toCash() {
                uni.navigateTo({
                    url: '/plugins/region/cash/cash'
                });
            },
            toBonus() {
                let name = this.setting.form.region ? this.setting.form.region : '';
                let cash_detail_name = this.setting.form.cash_detail ? this.setting.form.cash_detail : '';
                uni.navigateTo({
                    url: '/plugins/region/bonus/bonus?name=' + name + '&cash_detail=' + cash_detail_name
                });
            },
            toDetail() {
                let name = this.setting.form.cash_detail ? this.setting.form.cash_detail : '';
                uni.navigateTo({
                    url: '/plugins/region/cash-detail/cash-detail?name=' + name
                });
            },
            toOrder() {
                let name = this.setting.form.order ? this.setting.form.order : '';
                uni.navigateTo({
                    url: '/plugins/region/order/order?name=' + name
                });
            },
            toAbout() {
                uni.navigateTo({
                    url: '/plugins/region/about/about'
                });
            },
        },

        creatd(options) {
            let that = this;
        }
    }
</script>

<style scoped lang="scss">
    .app-region-user {
        width: 100%;
        height: #{460rpx};
        padding: #{56rpx};
        background-size: 100% 100%;
        position: relative;
        font-size: #{26rpx};
        color: #fff;
        .user-info {
            margin-bottom: #{40rpx};
            position: relative;
            width:fit-content;
            width:-webkit-fit-content;
            width:-moz-fit-content;
            width: 100%;
            >view {
                width: 100%;
            }
            .name {
                font-size: #{32rpx};
                margin-bottom: #{10rpx};
            }
            .level {
                font-size: #{24rpx};
                border-radius: #{20rpx};
                height: #{40rpx};
                line-height: #{38rpx};
                padding: 0 #{16rpx};
                border: #{2rpx} solid #fff;
                flex-shrink: 0;
                position: relative;
                .is-up {
                    position: absolute;
                    top: #{-14rpx};
                    right: #{-14rpx};
                    width: #{28rpx};
                    height: #{28rpx};
                }
                .right-arrow {
                    height:#{18rpx};
                    width:#{10rpx};
                    margin-left:#{8rpx};
                    margin-right: 0;
                    display: inline-block;
                }
            }
            .rate {
                height: #{60rpx};
                line-height: #{60rpx};
                font-size: #{26rpx};
                color: #fff;
                margin-left: 24rpx;
                width: 100%;
                .about {
                    image {
                        width: #{28rpx};
                        height: #{28rpx};
                        margin-left: #{12rpx};
                    }
                }
            }
            .avatar {
                width: #{80rpx};
                border-radius: #{40rpx};
                flex-shrink: 0;
                height: #{80rpx};
                border: #{2rpx} solid #fff;
                margin-right: #{28rpx};
                display: block;
            }
        }
        .price {
            font-size: #{24rpx};
            color: #fff;
            margin-top: #{20rpx};
            padding-top: #{20rpx};
            border-top: #{2rpx} solid #e2e2e2;
            .price-detail {
                font-size: #{64rpx};
                font-family: DIN;
                margin-bottom: #{6rpx};
            }
            .cash-btn {
                padding: 0 #{42rpx};
                border-radius: #{32rpx};
                height: #{64rpx};
                line-height: #{64rpx};
                font-size: #{28rpx};
                color: #3484F3;
                text-align: center;
                background-color: #fff;
            }
        }
    }
    .app-region-bonus {
        margin-top: #{-80rpx};
        padding: 0 #{24rpx};
        height: #{170rpx};
        .bonus-item {
            background-color: #fff;
            position: relative;
            z-index: 2;
            width: #{330rpx};
            height: #{124rpx};
            border-radius: #{16rpx};
            box-shadow: 0 0 #{10rpx} rgba(0,0,0,.05);
            padding: 0 #{32rpx};
            padding-top: #{20rpx};
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
    .app-region-menu {
        margin: #{24rpx};
        margin-top: #{-20rpx};
        border-radius: #{16rpx};
        background-color: #fff;
        padding: #{64rpx} #{27rpx} #{50rpx};
        box-shadow: 0 0 #{10rpx} rgba(0,0,0,.05);
        .menu-item {
            width: #{216rpx};
            margin: 0 #{47rpx};
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