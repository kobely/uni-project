<template>
    <app-layout>
        <view class="search">
            <view @click="toSearch=!toSearch" v-if="!toSearch" class="main-center search-content cross-center">
                <image src="/static/image/icon/icon-search.png"></image>
                <text>搜索</text>
            </view>
            <view v-else class="dir-left-norwap cross-center search-area" >
                <view class="search-input">
                    <image src="/static/image/icon/icon-search.png"></image>
                    <input :focus="!haveKeyword" @confirm="getList" confirm-type="search" v-model="keyword" placeholder-style="color:#999999;font-size:13px;" placeholder="请输入订单号或昵称搜索"></input>
                </view>
                <view class="cancel" @click="cancelSeacrch">取消</view>
            </view>
        </view>
        <app-tab-nav setTop="88" :tabList="tabList" :activeItem="activeTab" padding="0" @click="tabStatus" :theme="theme"></app-tab-nav>
        <view class="placeholder"></view>
        <view class="list" v-if="list && list.length > 0">
            <view v-for="item in list" :key="item.id" class="order-item">
                <view class="order-no">订单号 {{item.order_no}}</view>
                <view class="main-between cross-center">
                    <view class="goods-item dir-left-nowrap">
                        <image class="goods-img" :src="item.avatar"></image>
                        <view class="t-omit order-nickname">{{item.nickname}}</view>
                    </view>
                    <view class="bonus-info">
                        <view class="goods-price">商品金额
                            <text>￥{{item.total_pay_price}}</text>
                        </view>
                        <view class="bonus-price">{{setting.form.price_text ? setting.form.price_text :"分红金额"}}
                            <text>￥{{item.bonus_price}}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class='no-tip' v-if="list && list.length == 0">
            <image src="/static/image/order-empty.png"></image>
            <span>暂无{{activeTab == 1?'未完成':activeTab == 2?'已完成':''}}订单</span>
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
                    {id:1, name: '未完成'},
                    {id:2, name: '已完成'}
                ],
                loading: null,
                list: [],
                activeTab: 1,
                page: 2,
                keyword: '',
                toSearch: false,
                haveKeyword: false,
            }
        },
        components: {
            "app-tab-nav": appTabNav,
        },
        computed: {
            ...mapState({
                mall: state => state.mallConfig.mall,
            })
        },
        methods: {
            open(e) {
                this.id = e;
            },

            goSearch() {
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.getList();
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
            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.bonus.setting,
                }).then(response=>{
                    if(response.code == 0) {
                        that.setting = response.data.list;
                        if (that.setting.form && that.setting.form.orders) {
                            uni.setNavigationBarTitle({
                                title: that.setting.form.orders,
                            })
                        } else {
                            uni.setNavigationBarTitle({
                                title: '分红订单',
                            })
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(()=>{
                        that.getSetting();
                    });
                });
            },
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.bonus.order,
                    data: {
                        status: that.activeTab,
                        keyword: that.keyword
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
                let url;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.bonus.order,
                    data: {
                        status: that.activeTab,
                        keyword: that.keyword,
                        page: that.page
                    },
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        if(response.data.list.length > 0) {
                            that.loading = null;
                            that.list = that.list.concat(response.data.list);
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
            cancelSeacrch() {
                this.keyword = '';
                this.toSearch = !this.toSearch;
                this.getList();
                this.$hideLoading();
            },
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            if (options.nickname) {
                that.keyword = options.nickname;
                that.haveKeyword = true;
                that.toSearch = true;
            }
            that.$showLoading({
                text: '加载中...'
            });
            that.getSetting();
            that.getList();
        },
        onReachBottom() {
            this.getMore();
        }
    }
</script>

<style scoped lang="scss">
    .no-tip {
        position: fixed;
        top: #{400rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
        color: #666666;
        font-size: #{24rpx};
        width: #{240rpx};
        text-align: center;
        image {
            height: #{240rpx};
            width: #{240rpx};
            margin-bottom: #{20rpx};
        }
    }
    .search {
        height: #{88rpx};
        padding: #{16rpx} #{26rpx};
        background-color: #efeff4;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
    }

    .search input {
        padding: 0 #{30rpx};
    }

    .search-content {
        background-color: #fff;
        height: #{56rpx};
        border-radius: #{28rpx};
    }

    .search-content image {
        height:#{24rpx};
        width:#{24rpx};
    }

    .search-content text {
        color:#b2b2b2;
        font-size:#{24rpx};
        margin:0 #{5rpx};
    }

    .search-area {
        height: #{56rpx};
    }

    .placeholder {
        height: #{88rpx};
    }

    .order-item {
        margin: #{16rpx} #{24rpx} 0;
        border-radius: #{16rpx};
        background-color: #fff;
        padding: #{28rpx} #{24rpx};
        font-size: #{28rpx};
        color: #353535;
    }

    .order-no {
        margin-bottom: #{28rpx};
    }

    .order-nickname {
        width: #{240rpx};
    }

    .goods-item {
        height: #{80rpx};
        line-height: #{80rpx};
        width: #{330rpx};
    }

    .goods-img {
        height: #{80rpx};
        width: #{80rpx};
        border-radius: #{10rpx};
        margin-right: #{24rpx};
    }

    .bonus-info {
        font-size: #{24rpx};
        color: #999;
    }

    .search-input {
        height: #{56rpx};
        position: relative;
        width: #{620rpx};
    }

    .search-input image {
        height: #{22rpx};
        width: #{22rpx};
        position: absolute;
        top: #{17rpx};
        left: #{28rpx};
        z-index: 10;
    }

    .search-input input {
        padding-left: #{66rpx};
        background-color: #fff;
        border-radius: #{32rpx};
        height: #{56rpx};
        font-size: #{26rpx};
        color: #353535;
    }

    .cancel {
        margin-left: #{16rpx};
        font-size: #{28rpx};
        color: #00c203;
    }

    .goods-price {
        margin-bottom: #{4rpx};
    }

    .goods-price text {
        font-size:#{24rpx};
        color:#353535;
    }

    .bonus-price text {
        font-size:#{28rpx};
        color:#ff4544;
    }
</style>