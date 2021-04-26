<template>
    <app-layout>
        <view class="no-content" v-if="!list || !list.length">暂无记录</view>
        <block v-else>
            <view v-for="(item, index) in list" :key="index" class="settle">
                <view class="settle-status">{{item.order_status_text}}</view>
                <view class="price dir-left-nowrap main-center cross-bottom">
                    <view class="num">{{item.total_pay_price}}</view>
                    <text class="yuan">元</text>
                </view>
                <view class="item-info dir-top-nowrap main-center">
                    <view class="dir-left-nowrap">
                        <view class="box-grow-0 item-label main-right">订单号</view>
                        <view class="item-value">{{item.order_no}}</view>
                    </view>
                    <view class="dir-left-nowrap goods">
                        <view class="box-grow-0 item-label main-right">商品名称</view>
                        <view class="goods-name t-omit-two item-value">{{item.goods_name}}{{item.goods_name}}</view>
                    </view>
                </view>
            </view>
        </block>
    </app-layout>
</template>

<script>
    export default {
        name: "settle-detail",
        components: {},
        data() {
            return {
                page: 1,
                args: false,
                load: false,
                mch_id: -1,
                is_transfer: 0,
                list: [],
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.mch_id = options.mch_id;
            this.is_transfer = options.is_transfer;

            uni.setNavigationBarTitle({title: this.is_transfer === `1` ? `已结算金额` : `未结算金额`});
            this.loadData();
        },
        onReachBottom: function () {
            const self = this;
            if (self.args || self.load)
                return;
            self.load = true;
            let page = self.page + 1;

            self.$request({
                url: self.$api.mch.cash_log,
                data: {
                    is_transfer: self.is_transfer,
                    mch_id: self.mch_id,
                    page: page,
                }
            }).then(info => {
                if (info.code === 0) {
                    [self.page, self.args, self.list] = [page, info.data.list.length === 0, self.list.concat(info.data.list)];
                }
                self.load = false;
            });
        },

        methods: {
            loadData() {
                const self = this;
                self.$showLoading();
                self.$request({
                    url: self.$api.mch.order_close_log,
                    data: {
                        is_transfer: self.is_transfer,
                        mch_id: self.mch_id
                    }
                }).then(info => {
                    self.$hideLoading();
                    self.list = info.data.list;
                }).catch(e => {
                    self.$hideLoading();
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    .no-content {
        color: #888;
        padding-top: #{100rpx};
        text-align: center;
    }

    .settle {
        color: #353535;
        padding: 0 #{24rpx};
        background: #FFFFFF;
        margin-top: #{20rpx};

        .settle-status {
            font-size: #{32rpx};
            padding-top: #{24rpx};
        }

        .price {
            text-align: center;
            line-height: 1;
            margin-top: #{8rpx};
            margin-bottom: #{32rpx};

            .num {
                font-size: #{60rpx};
            }

            .yuan {
                font-size: #{28rpx};
            }
        }

        .item-info {
            font-size: #{28rpx};
            border-top: #{1rpx} solid #e2e2e2;
            padding: #{40rpx} 0;

            .goods {
                margin-top: #{24rpx};
            }

            .item-label {
                width: #{134rpx};
            }

            .item-value {
                margin-left: #{32rpx};
                color: #999999
            }
        }
    }
</style>