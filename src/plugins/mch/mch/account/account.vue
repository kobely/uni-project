<template>
    <app-layout>
        <!-- 页面内容 -->
        <view class="header-h">
            <image class="header-bg" :src="appImg.mch_account_header_bg" mode="widthFix"></image>
            <view class="header-box dir-top-nowrap main-center">
                <view class="account">账户可用余额(元)</view>
                <view class="money">{{account_money}}</view>
                <app-form-id style="height: auto" @click="navCash">
                    <view class="cash-btn">提现</view>
                </app-form-id>
            </view>
        </view>

        <view class="menu-group">
            <app-form-id @click="navAccountLog">
                <view class="menu-item flex dir-left-nowrap">
                    <view class="box-grow-1 cross-center">收支记录</view>
                    <view class="box-grow-0 cross-center">
                        <icon class="icon-arrow-right" type></icon>
                    </view>
                </view>
            </app-form-id>
            <app-form-id @click="navCashLog">
                <view class="menu-item flex dir-left-nowrap">
                    <view class="box-grow-1 cross-center">提现记录</view>
                    <view class="box-grow-0 cross-center">
                        <icon class="icon-arrow-right" type></icon>
                    </view>
                </view>
            </app-form-id>

            <app-form-id @click="navSettleDetailN">
                <view class="menu-item flex dir-left-nowrap weijiesuan">
                    <view class="box-grow-1 cross-center">未结算金额</view>
                    <view class="box-grow-0 cross-center">
                        <text>￥{{not_close_money}}</text>
                        <icon class="icon-arrow-right" type></icon>
                    </view>
                </view>
            </app-form-id>
            <app-form-id @click="navSettleDetailY">
                <view class="menu-item flex dir-left-nowrap">
                    <view class="box-grow-1 cross-center">已结算金额</view>
                    <view class="box-grow-0 cross-center">
                        <text>￥{{close_money}}</text>
                        <icon class="icon-arrow-right" type></icon>
                    </view>
                </view>
            </app-form-id>
        </view>
        <view class="footer">
            <view @click="showDesc">交易手续费说明</view>
        </view>
    </app-layout>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "account",
        components: {},
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.plugin.mch.app_image,
            }),
        },
        data() {
            return {
                account_money: '--',
                close_money: '0.00',
                desc: '',
                not_close_money: '0.00',
                transfer_fate: 0,

                mch_id: -1,
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.mch_id = options.mch_id;
            // #ifdef MP-BAIDU
            this.loadData();
            // #endif
        },

        onShow: function () {
            this.loadData();
        },

        methods: {
            navCash() {
                uni.navigateTo({url: `/plugins/mch/mch/cash/cash?mch_id=` + this.mch_id + `&account_money=` + this.account_money})
            },
            navAccountLog() {
                uni.navigateTo({url: `/plugins/mch/mch/account-log/account-log?mch_id=` + this.mch_id})
            },
            navCashLog() {
                uni.navigateTo({url: `/plugins/mch/mch/cash-log/cash-log?mch_id=` + this.mch_id})
            },
            navSettleDetailN() {
                uni.navigateTo({url: `/plugins/mch/mch/settle-detail/settle-detail?is_transfer=0&mch_id=` + this.mch_id})
            },
            navSettleDetailY() {
                uni.navigateTo({url: `/plugins/mch/mch/settle-detail/settle-detail?is_transfer=1&mch_id=` + this.mch_id})
            },
            loadData: function () {
                const self = this;
                if (self.mch_id <= 0) return
                self.$showLoading();

                self.$request({
                    url: self.$api.mch.property,
                    data: {
                        mch_id: self.mch_id,
                    }
                }).then(info => {
                    self.$hideLoading();
                    [
                        self.account_money,
                        self.close_money,
                        self.desc,
                        self.not_close_money,
                        self.transfer_fate
                    ] = [
                        info.data.account_money,
                        info.data.close_money,
                        info.data.desc,
                        info.data.not_close_money,
                        info.data.transfer_fate
                    ];
                }).catch(e => {
                    self.$hideLoading();
                });
            },

            showDesc: function () {
                uni.showModal({
                    title: '交易手续费说明',
                    content: this.desc,
                    showCancel: false,
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    .icon-arrow-right {
        width: #{12rpx};
        height: #{22rpx};
        margin-left: #{12rpx};
        background-image: url("../../../../static/image/icon/arrow-right.png");
        background-repeat: no-repeat;
        background-size: 100% auto;
    }

    .header-h {
        position: relative;
        text-align: center;
        height: #{324rpx};
        color: #fff;
        z-index: 10;

        .header-bg {
            position: absolute;
            z-index: 0;
            left: 0;
            top: 0;
            width: 100%;
        }

        .header-box {
            position: relative;
            height: 100%;

            .account {
                font-size: #{26rpx};
                margin-bottom: #{40rpx};
            }

            .money {
                font-size: #{88rpx};
                font-weight: bold;
                line-height: 1;
                margin-bottom: #{40rpx};
            }

            .cash-btn {
                display: inline-block;
                height: #{56rpx};
                line-height: #{56rpx};
                padding: 0 #{60rpx};
                border: #{1rpx} solid #fff;
                font-size: #{28rpx};
                border-radius: #{28rpx};
            }
        }
    }

    .menu-group {
        font-size: #{28rpx};
        color: #353535;
        margin: #{16rpx} 0;
    }

    .menu-item {
        background: #fff;
        height: #{88rpx};
        border-bottom: #{1rpx} solid #eee;
        padding: 0 #{24rpx};
    }

    .menu-item.weijiesuan {
        margin-top: #{20rpx};
    }

    .menu-item text {
        color: #666666;
    }

    .footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        padding-bottom: #{56rpx};

        view {
            font-size: #{28rpx};
            padding: #{12rpx};
            display: inline-block;
            color: #397ed3
        }
    }
</style>