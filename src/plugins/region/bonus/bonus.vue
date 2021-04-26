<template>
    <app-layout>
        <view class="header cross-center dir-top-nowrap" :style="{'background-image': `url(${region.stock})`}">
            <view>{{setting.form && setting.form.bouns ? setting.form.bouns : '代理分红'}}(元)</view>
            <view class="detail-price">{{detail.all_bonus ? detail.all_bonus : '0.00'}}</view>
            <view @click="toDetail" class="to-cash">
                <text>{{cash_detail?cash_detail:'提现明细'}}</text>
                <image class="arrow-right" src='/static/image/icon/arrow-right-white.png'></image>
            </view>
        </view>
        <view class="cell">
            <view class="main-between cell-item">
                <view class="label">{{setting.form && setting.form.total_bonus_text ? setting.form.total_bonus_text : '可提现分红'}}</view>
                <view>{{detail.total_bonus ? detail.total_bonus: '0.00'}}元</view>
            </view>
        </view>
        <view class="cell">
            <view class="main-between cell-item">
                <view class="label">{{setting.form && setting.form.cash_bonus_text ? setting.form.cash_bonus_text : '已提现分红'}}</view>
                <view>{{detail.cash_bonus ? detail.cash_bonus : '0.00'}}元</view>
            </view>
            <view class="main-between cell-item">
                <view class="label">{{setting.form && setting.form.loading_bonus_text ? setting.form.loading_bonus_text : '待打款分红'}}</view>
                <view>{{detail.loading_bonus ? detail.loading_bonus : '0.00'}}元</view>
            </view>
        </view>
        <view @click="show=!show" class="cell">
            <view class="main-between cell-item">
                <view class="label">用户须知</view>
                <view>
                    <image :class="['arrow-right',`${show ? 'show' : ''}`,]" src='/static/image/icon/arrow-right.png'></image>    
                </view>
            </view>
            <view v-if="show" class="content">
                <text>{{detail.user_instructions}}</text>
            </view>
        </view>
        <view @click="toCash" class="cash">{{setting.form && setting.form.to_cash ? setting.form.to_cash : '我要提现'}}</view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        data() {
            return {
                show: false,
                cash_detail: '',
                setting: {},
                detail: {}
            }
        },
        computed: {
            ...mapState({
                region: state => state.mallConfig.__wxapp_img.region,
            })
        },
        methods: {
            toCash() {
                uni.navigateTo({
                    url: '/plugins/region/cash/cash'
                });
            },
            toDetail() {
                let name = this.cash_detail ? this.cash_detail : '';
                uni.navigateTo({
                    url: '/plugins/region/cash-detail/cash-detail?name=' + name
                });
            },
            getSetting() {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.region.setting,
                }).then(response=>{
                    that.getInfo();
                    if(response.code == 0) {
                        that.setting = response.data;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                    uni.hideLoading();
                });
            },
            getInfo() {
                let that = this;
                that.$request({
                    url: that.$api.region.info,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.detail = response.data;
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
        },

        onLoad(options) { this.$commonLoad.onload(options);
            this.getSetting();
            if(options.name) {
                uni.setNavigationBarTitle({
                    title: options.name,
                })
            }
            if(options.cash_detail) {
                this.cash_detail = options.cash_detail;
            }
        }
    }
</script>

<style scoped lang="scss">
    .arrow-right {
        height:#{20rpx};
        width:#{12rpx};
    }
    .arrow-right.show {
        transform:rotate(90deg);
    }
    .header {
        height: #{300rpx};
        width: 100%;
        background-size: 100% 100%;
        color: #fff;
        font-size: #{28rpx};
        padding: #{50rpx} 0;
        .detail-price {
            font-size: #{80rpx};
            font-family: DIN;
            margin: #{10rpx} 0 #{24rpx};
        }
        .to-cash {
            font-size: #{26rpx};
            .arrow-right {
                margin-left:#{16rpx};
            }
        }
    }
    .cell {
        font-size: #{28rpx};
        color: #666666;
        margin: #{20rpx} #{24rpx} 0;
        width: #{702rpx};
        background-color: #fff;
        padding: 0 #{32rpx};
        border-radius: #{8rpx};
        .cell-item {
            border-top: #{2rpx} solid #e2e2e2;
            height: #{96rpx};
            line-height: #{96rpx};
            .label {
                color: #353535;
            }
        }
        .cell-item:first-of-type {
            border-top: 0;
        }
        .content {
            font-size: #353535;
            padding-bottom: #{24rpx};
        }
    }
    .cash {
        width: #{702rpx};
        height: #{80rpx};
        line-height: #{80rpx};
        text-align: center;
        margin: #{40rpx} auto 0;
        border-radius: #{40rpx};
        background-color: #ff4544;
        color: #fff;
        font-size: #{32rpx};
    }
</style>