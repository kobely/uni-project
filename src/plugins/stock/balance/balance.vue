<template>
    <app-layout>
        <view class="no-list" v-if="list.length == 0">
            <image src="/static/image/order-empty.png"></image>
            <view>暂无任何明细</view>
        </view>
        <view v-else>
            <view v-for="(item, key) in list" :key="key" class="balance-item">
                <view class="balance-date">
                    <text class="balance-type" v-if="item.bonus_type == 1">按周 </text>
                    <text class="balance-type" v-else>按月 </text>
                    <text>{{item.start_time}} - {{item.end_time}}</text>
                </view>
                <view class="balance-info">
                    <view class="level corss-center">{{item.level_name}}</view>
                    <view>订单数 {{item.order_num}}<text class="order-price">{{setting.form.rate_text ? setting.form.rate_text : '分红比例'}} {{item.bonus_rate}}%</text></view>
                    <view class="bonus-info dir-top-nowrap main-center">
                        <view>{{setting.form.price_text ? setting.form.price_text : '分红金额'}}</view>
                        <view class="bonus-price">￥{{item.price}}</view>
                    </view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>

    import { mapState } from "vuex";

    export default {
        data() {
            return {
                setting: {},
                list: [],
                more: false,
                page: 1
            }
        },
        computed: {
            ...mapState({
            })
        },
        methods: {
            getSetting() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.stock.setting,
                }).then(response=>{
                    if(response.code == 0) {
                        that.setting = response.data;
                        that.getList();
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
                    url: that.$api.stock.bonus,
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.list = response.data.list;
                        if(response.data.list.length == response.data.pagination.pageSize) {
                            this.more = true;
                            this.page++;
                        }
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
            getMore() {
                let that = this;
                that.more = false;
                uni.showLoading({
                    mask: true,
                    title: '加载更多...'
                });
                that.$request({
                    url: that.$api.stock.bonus,
                    data: {
                        page: that.page
                    }
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.list = that.list.concat(response.data.list);
                        if(response.data.list.length == response.data.pagination.pageSize) {
                            that.more = true;
                            that.page++;
                        }
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
            }
        },

        onLoad(options) { this.$commonLoad.onload(options);
            if(options.name) {
                uni.setNavigationBarTitle({
                    title: options.name,
                })
            }
            this.getSetting();
        },
        onReachBottom() {
            if(this.more) {
                this.getMore();
            }
        }
    }
</script>

<style scoped lang="scss">
    .no-list {
        text-align: center;
        margin-top: #{200rpx};
        font-size: #{24rpx};
        color: #666666;
        image {
            width: #{240rpx};
            height: #{240rpx};
            margin-bottom: #{20rpx};
        }
    }
    .balance-item {
        background-color: #fff;
        border-radius: #{8rpx};
        font-size: #{28rpx};
        color: #999999;
        margin: #{24rpx} #{24rpx} #{12rpx};
        width: #{702rpx};
        box-shadow: 0 0 #{20rpx} rgba(0,0,0,0.1);
        .balance-date {
            padding: 0 #{32rpx};
            height: #{96rpx};
            line-height: #{96rpx};
            .balance-type {
                margin-right: #{10rpx};
            }
        }
        .balance-info {
            border-top: #{2rpx} solid #e2e2e2;
            height: #{162rpx};
            padding: #{32rpx} #{32rpx};
            position: relative;
            .level {
                font-size: #{32rpx};
                color: #353535;
                margin-bottom: #{16rpx};
                text {
                    font-size: #{24rpx};
                    color: #ff4544;
                    margin-left: #{20rpx};
                }
            }   
            .bonus-info {
                height: #{162rpx};
                font-size: #{26rpx};
                color: #353535;
                text-align: right;
                position: absolute;
                bottom: 0;
                right: #{32rpx};
                .bonus-price {
                    font-size: #{38rpx};
                    color: #ff4544;
                    font-family: DIN;
                }
            }
            .order-price {
                margin-left: #{40rpx};
            }
        }
    }
</style>