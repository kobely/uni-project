f<template>
    <app-layout>
        <app-tab-nav :tabList="tabList" background="#f7f7f7" :padding="0" :shadow="noBorder" :border="noBorder" :activeItem="activeTab" @click="tabStatus" :theme="theme"></app-tab-nav>
        <view class="no-list" v-if="list.length == 0">
            <image src="/static/image/order-empty.png"></image>
            <view>暂无任何明细</view>
        </view>
        <view v-else class="list" v-for="item in list" :key="item.id">
            <view class="item-header">{{item.date}}</view>
            <view class="item" v-for="list in item.list" :key="list.id">
                <view class="type">
                    <text v-if="list.pay_type == 'auto'">自动打款</text>
                    <text v-if="list.pay_type == 'balance'">提现至余额</text>
                    <text v-if="list.pay_type == 'wechat'">提现至微信</text>
                    <text v-if="list.pay_type == 'alipay'">提现至支付宝</text>
                    <text v-if="list.pay_type == 'bank'">提现至银行卡</text>
                    <text :class="[`status`]">{{list.status_text}}</text></view>
                <view>提现账户：{{list.extra.mobile?list.extra.mobile:'无'}}</view>
                <view>提现时间：{{list.time.created_at}}</view>
                <view v-if="list.content.reject_content">驳回理由：<text style="word-wrap:break-word;">{{list.content.reject_content}}</text></view>
                <view class="cash">
                    <view class="cash-price">{{list.cash.price}}</view>
                    <view>手续费{{list.cash.service_charge}}</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import appTabNav from "../../../components/basic-component/app-tab-nav/app-tab-nav.vue";

    import { mapState } from "vuex";

    export default {
        data() {
            return {
                theme: {
                    color: '#ff4544'
                },
                tabList: [
                    {id:-1, name: '全部'},
                    {id:0, name: '待审核'},
                    {id:1, name: '待打款'},
                    {id:2, name: '已打款'},
                    {id:3, name: '已驳回'},
                ],
                loading: null,
                list: [],
                activeTab: -1,
                noBorder: false,
                id: null,
                page: 2
            }
        },
        components: {
            "app-tab-nav": appTabNav,
        },
        computed: {
            ...mapState({
                mall: state => state.mallConfig.mall,
                custom_setting: state => state.mallConfig.share_setting_custom,
                share_setting: state => state.mallConfig.share_setting,
            })
        },
        methods: {
            open(e) {
                this.id = e;
            },

            tabStatus(e) {
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.list = [];
                this.page = 2;
                this.activeTab = e.currentTarget.dataset.id;
                this.getList();
            },
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.stock.detail,
                    data: {
                        status: that.activeTab
                    },
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.list = response.data.list;
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
                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(()=>{
                        that.getList();
                    });
                });
            },
            getMore() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.stock.detail,
                    data: {
                        status: that.activeTab,
                        page: that.page
                    },
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.loading = null;
                        let more = response.data.list;
                        if (more.length > 0) {
                            if (that.list[that.list.length - 1].date == more[0].date) {
                                that.list[that.list.length - 1].list = that.list[that.list.length - 1].list.concat(more[0].list);
                                more.shift();
                                that.list = that.list.concat(more)
                            }else {
                                that.list = that.list.concat(more)
                            }
                            that.page++;
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(e => {
                    uni.hideLoading();
                });
            },
            toGoods(id) {
                uni.navigateTo({
                    url: '/pages/goods/goods?id=' + id
                });
            },
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            if(options.name) {
                uni.setNavigationBarTitle({
                    title: options.name,
                })
            }
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.getList();
        },
        onReachBottom() {
            this.getMore();
        }
    }
</script>

<style scoped lang="scss">
    .list {
        background-color: #fff;
        margin: #{24rpx} #{24rpx} #{12rpx};
        border-radius: #{8rpx};
        box-shadow: rgba(0, 0, 0, .1) 0 0 #{20rpx};
    }

    .item-header {
        color: #999999;
        font-size: #{32rpx};
        height: #{96rpx};
        line-height: #{96rpx};
        padding: 0 #{32rpx};
    }

    .list .item {
        padding: #{32rpx};
        font-size: #{24rpx};
        color: #999999;
        border-top: 1px solid #e2e2e2;
        position: relative;
    }

    .type {
        font-size: #{32rpx};
        color: #353535;
        margin-bottom: #{8rpx};
    }

    .status {
        margin-left: #{20rpx};
        font-size: #{24rpx};
        padding: 0 #{10rpx};
        border-radius: #{16rpx};
        border: 1px solid #ff4544;
        color: #ff4544;
    }

    .cash {
        position: absolute;
        top: #{50rpx};
        right: #{32rpx};
        text-align: right;
    }

    .cash-price {
        font-size: #{40rpx};
        color: #353535;
    }

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
</style>