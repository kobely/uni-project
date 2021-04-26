<template>
    <app-layout>
        <view class="order-box">
            <view v-if="is_show" class='content-box'>
                <template v-if="orders.length">
                    <view v-for='(item, index) in orders' :key='item.id' :style="{'margin-top': index == 0 ? '24rpx' : '0'}" class='order-item-box dir-top-wrap'>
                        <app-jump-button type="redirect" :url="item.id | getPageUrl(currentIndex)">
                            <view class="dir-top-nowrap" style="width: 100%">
                                <view class='dir-left-nowrap view-1'>
                                    <view class='box-grow-1'>订单号：{{item.order_no}}</view>
                                    <template v-if='item.status == 0'>
                                        <text v-if='item.sign == "pintuan"'>{{item.is_pay == 1 ? '拼团中' : '待付款'}}</text>
                                    </template>
                                    <template v-else>
                                        <view>{{item.status_text}}</view>
                                    </template>
                                </view>
                                <view v-for='(dItem) in item.detail' :key='dItem.id' class='view-2'>
                                    <app-order-goods-info :goods='dItem.goods_info'></app-order-goods-info>
                                </view>
                            </view>
                        </app-jump-button>
                        <view class='dir-left-nowrap view-3 status-text'>
                            <view class='box-grow-1'>
                                {{item.status_text}}
                            </view>
                            <view v-if="item.type == 1 || item.type == 3" class='box-grow-0 dir-top-nowrap'>
                                <text>
                                    申请退款：{{item.refund_price}}
                                </text>
                                <text style="margin-top:5rpx;" v-if="item.is_refund == 1">
                                    实际退款：{{item.reality_refund_price}}
                                </text>
                            </view>
                        </view>
                    </view>
                </template>
                <template v-else>
                    <view class='not-order-box cross-center main-center'>
                        暂无相关订单
                    </view>
                </template>
            </view>
            <app-load-text v-if="is_load_show"></app-load-text>
        </view>
    </app-layout>
</template>
<script>
import appOrderGoodsInfo from '../../../components/page-component/app-order-goods-info/app-order-goods-info.vue';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            page: 1,
            currentIndex: 5,
            orders: [],
            pagination: null,
            is_show: false,
            is_load_show: false,
        }
    },
    methods: {
        async getList() {
            try {
                const response = await this.$request({
                    url: this.$api.order.list,
                    data: {
                        status: this.currentIndex,
                        page: this.page,
                    }
                });
                this.$hideLoading();
                let { code, data, msg } = response;
                this.is_load_show = false;
                this.is_show = true;
                if (code === 0) {
                    let { list, pagination } = data;
                    if (this.page !== 1) {
                        this.orders = this.orders.concat(list);
                    } else {
                        this.orders = list;
                    }
                    this.page = list.length ? this.page + 1 : this.page;
                    this.pagination = pagination;
                } else {
                    uni.showModal({
                        title: '',
                        content: msg,
                        showCancel: false,
                    });
                }
            } catch (e) {
                this.is_load_show = false;
                this.$hideLoading();
                throw new Error(e);
            }
        },
    },
    filters: {
        getPageUrl(id, currentIndex) {
            if (currentIndex === 5) {
                return `/pages/order/refund-detail/refund-detail?id=${id}`
            }
        }
    },
    onReachBottom() {
        this.is_load_show = true;
        this.getList()
    },
    onShow() {
        this.page = 1;
        this.$showLoading();
        this.getList();
        this.$store.dispatch('gConfig/setTabBarBoolean', this.tabBarNavs.navs);
    },
    computed: {
        ...mapGetters('mallConfig', {
            tabBarNavs: 'getNavBar'
        }),
    },
    components: {
        'app-order-goods-info': appOrderGoodsInfo,
    },
}
</script>
<style scoped lang="scss">
.order-box {
    width: 100%;
    height: 100%;
}

.not-order-box {
    height: 100vh;
    color: $uni-general-color-two;
}

.order-item-box {
    background: #fff;
    padding: 0 24#{rpx};
    margin: 0 24#{rpx};
    margin-bottom: 24#{rpx};
    border-radius: 16#{rpx};
    font-size: $uni-font-size-general-two;
}

.order-item-box .view-1 {
    width: 100%;
    font-size: $uni-font-size-weak-one;
    color: $uni-important-color-black;
    margin: 32#{rpx} 0;
}

.order-item-box .view-2 {}

.order-item-box .view-3 {
    font-size: $uni-font-size-import-two;
}

.order-item-box .view-3 .btn {
    margin-left: 15#{rpx};
}

.price-color {
    color: $uni-important-color-black;
}

.status-text {
    margin: #{28rpx} 0;
    font-size: $uni-font-size-general-two;
}

.success-color {
    color: $uni-important-color-black;
}

.action-box-view {
    width: 100%;
}
</style>