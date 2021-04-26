<template>
    <app-layout>
        <view class="box" v-if="isShow">
            <view class="goods-info">
                <app-jump-button :url="orderDetail.page_url">
                    <app-order-goods-info :is-last-one="false" :goods='orderDetail.goods_info' :plugin-data="orderDetail.plugin_data" plugin-index="0"></app-order-goods-info>
                </app-jump-button>
            </view>
            <view class="content">
                <template v-if="orderDetail.order.sign != 'gift'">
                    <view class="content-item" @click="jump(1)">
                        <view class="left-item">
                            <view>仅退款（无需退货）</view>
                            <view class="remark">没收到货，或与卖家协商同意无需退货只退款</view>
                        </view>
                        <image class="arrow-right" src="/static/image/icon/arrow-right.png"></image>
                    </view>
                    <view class="content-item" @click="jump(2)">
                        <view class="left-item">
                            <view>退货退款</view>
                            <view class="remark">退还货物并且退款</view>
                        </view>
                        <image class="arrow-right" src="/static/image/icon/arrow-right.png"></image>
                    </view>
                </template>
                <view v-if="orderDetail.is_confirm == 1" class="content-item" @click="jump(3)">
                    <view class="left-item">
                        <view>换货</view>
                        <view class="remark">已收到货，需要更换已收到的货物</view>
                    </view>
                    <image class="arrow-right" src="/static/image/icon/arrow-right.png"></image>
                </view>
            </view>
        </view>
    </app-layout>
</template>
<script>
import appOrderGoodsInfo from '../../../components/page-component/app-order-goods-info/app-order-goods-info.vue';


export default {
    components: {
        appOrderGoodsInfo,
    },
    data() {
        return {
            orderDetail: {},
            id: null,
            isShow: false,
        }
    },
    methods: {
        getRefundDetail() {
            let self = this;
            self.$showLoading();
            self.$request({
                url: this.$api.order.apply_refund,
                data: {
                    id: self.id,
                }
            }).then(response => {
                self.$hideLoading();
                self.isShow = true;
                if (response.code === 0) {
                    self.orderDetail = response.data.detail;
                } else {
                    uni.showModal({
                        title: '',
                        content: response.msg,
                        showCancel: false,
                    });
                }
            }).catch(() => {
                self.$hideLoading();
            });
        },
        jump(type) {
            let url = '';
            if (type === 1) {
                url = '/pages/order/refund/refund?id=' + this.id + '&type=3';
            } else if (type === 2) {
                url = '/pages/order/refund/refund?id=' + this.id + '&type=1';
            } else {
                url = '/pages/order/refund/refund?id=' + this.id + '&type=2';
            }

            uni.navigateTo({
                url: url
            });
        }
    },
    onLoad(options) { this.$commonLoad.onload(options);
        this.id = options.id;
        this.getRefundDetail();
    }
}
</script>
<style scoped lang="scss">
.box {
    padding:24#{rpx};
    width: 100%;

    .goods-info {
        background: #ffffff;
        border-radius: 16#{rpx};
        padding: 28#{rpx};
    }

    .content {
        margin-top:24#{rpx};
        background: #ffffff;
        border-radius: 16#{rpx};
        display: flex;
        flex-direction: column;
        padding-left: 28#{rpx};
        padding-right: 28#{rpx};

        .content-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            border-bottom:1#{rpx} solid #e2e2e2;
            padding: 32#{rpx} 0;

            .left-item {
                display: flex;
                flex-grow: 1;
                flex-direction: column;
            }

            .arrow-right {
                width: 12#{rpx};
                height: 22#{rpx};
                margin-left: 16#{rpx};
            }

            .remark {
                font-size:24#{rpx};
                color: #999999;
                margin-top: 16#{rpx};
            }
        }

        .content-item:last-child {
            border: 0;
        }
    }
}
</style>