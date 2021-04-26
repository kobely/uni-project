<template>
    <app-layout>
        <app-tab-nav :tabList="tabList" :shadow="noBorder" background="#f7f7f7" padding="0" :border="noBorder" :activeItem="activeTab" @click="tabStatus" :theme="theme"></app-tab-nav>
        <view v-if="list.length == 0" class="tip main-center cross-center">暂无数据</view>
        <view v-else class="list" v-for="item in list" :key="item.id">
            <view class="item-header">{{item.date}}</view>
            <view class="item" v-for="list in item.list" :key="list.id">
                <view class="type">{{list.pay_type}}<text :class="[`status`,`red-color`]">{{list.status_text}}</text></view>
                <view>提现账户：{{list.extra.mobile}}</view>
                <view>提现时间：{{list.time.created_at}}</view>
                <view class="cash">
                    <view class="cash-price">{{list.cash.price}}</view>
                    <view>手续费{{list.cash.service_charge}}</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from 'vuex';
    import appTabNav from '../../../components/basic-component/app-tab-nav/app-tab-nav.vue';

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
                    {id:3, name: '无效'},
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
            'app-tab-nav': appTabNav,
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
                this.list = [];
                this.page = 2;
                this.activeTab = e.currentTarget.dataset.id;
                uni.showLoading({
                    title: '加载中...'
                });
                this.getList();
            },
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.share.cash_list,
                    data: {
                        status: that.activeTab
                    },
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code === 0) {
                        that.list = response.data.list;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
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
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.share.cash_list,
                    data: {
                        status: that.activeTab,
                        page: that.page
                    },
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.loading = null;
                        for (let i in response.data.list) {
                            for (let index in that.list) {
                                if(i == index) {
                                    that.list[index].list = that.list[index].list.concat(response.data.list[index].list)
                                }
                            }
                        }
                        that.page++;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    uni.hideLoading();
                });
            },
            toGoods(id) {
                uni.navigateTo({
                    url: `/pages/goods/goods?id=${id}`
                });
            },
        },

        onLoad() { this.$commonLoad.onload();
            let that = this;
            uni.setNavigationBarTitle({
                title: that.custom_setting.menus.cash.name
            });
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
        margin: #{24rpx} #{24rpx} 0;
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

    .tip {
        width: 100%;
        color: #999999;
        height: #{500rpx};
    }
    .red-color {
        color: #ff4544;
    }
</style>