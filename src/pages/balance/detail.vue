<template>
    <app-layout>
        <view class='balance-detail-head cross-center'>
            <view class='dir-left-nowrap cross-center'>
                <view class='box-grow-0 key'>交易金额</view>
                <view v-if="detail.type == 1" class='box-grow-1 value red'>+{{detail.money}}</view>
                <view v-if="detail.type == 2" class='box-grow-1 value blue'>-{{detail.money}}</view>
            </view>
        </view>
        <view class='balance-detail'>
            <view class='dir-left-nowrap info'>
                <view class='box-grow-0 key'>交易时间</view>
                <view class='box-grow-1 value'>{{detail.created_at}}</view>
            </view>
            <view class='dir-left-nowrap info'>
                <view class='box-grow-0 key'>交易详情</view>
                <view class='box-grow-1 value'>{{detail.desc}}</view>
            </view>
            <view v-if="detail.order_no" class='dir-left-nowrap info'>
                <view class='box-grow-0 key'>交易单号</view>
                <view class='box-grow-1 value'>{{detail.order_no}}</view>
            </view>
            <view v-if="detail.order_refund_no" class='dir-left-nowrap info'>
                <view class='box-grow-0 key'>退款单号</view>
                <view class='box-grow-1 value'>{{detail.order_refund_no}}</view>
            </view>
        </view>
    </app-layout>
</template>

<script>

    export default {
        name: "detail",
        data() {
            return {
                detail: null,
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            const self = this;
            this.$showLoading({title: `加载中`});
            self.$request({
                url: self.$api.balance.log_detail,
                data: {
                    id: options.id,
                }
            }).then((info) => {
                if (info.code === 0) {
                    this.detail = info.data.detail;
                }
                this.$hideLoading();
            }).catch((info) => {
                this.$hideLoading();
            })
        },
    }
</script>

<style scoped lang="scss">
    $fontColor: #999999;
    .balance-detail-head {
        background: #FFFFFF;
        height: #{140rpx};
        font-size: #{28rpx};
        padding: 0 #{24rpx};

        .key {
            color: $fontColor;
            margin-right: #{40}rpx;
        }

        .value {
            font-size: #{38rpx};
            font-weight: bold;
        }

        .value.red {
            color: #ff4544;
        }

        .value.blue {
            color: #3fc24c;
        }
    }

    $line: #{1px} solid #ededed;

    .balance-detail {
        background: #FFFFFF;
        font-size: #{28rpx};
        border-top: $line;
        border-bottom: $line;
        padding: #{40rpx} #{24rpx} #{8rpx};

        .info {
            margin-bottom: #{32}rpx;

            .key {
                color: $fontColor;
                margin-right: #{40}rpx;
            }

            .value {
                color: #666666;
            }
        }
    }

</style>