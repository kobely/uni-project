<template>
    <app-layout>
        <view v-if="!toSearch" style="z-index: 50">
            <view class='status' v-if="is_mall">
                <view class='status-list main-between'>
                    <view @click='tab(1)' :class="[`${status==1?'active':''}`,`left-status`]">订单</view>
                    <view @click='tab(2)' :class="[`${status==2?'active':''}`,`right-status`]">卡券</view>
                </view>
            </view>
            <view :class="[`search`, `${is_mall?'':'no-mall'}`]">
                <view @click='beSearch' class="main-center search-content cross-center">
                    <image src="/static/image/icon/icon-search.png"></image>
                    <text>搜索</text>
                </view>
            </view>
            <app-tab-nav :setTop="setTop" :placeHeight="placeHeight" :setHeight="96" :tabList="tabList" :padding="0"
                         :activeItem="activeTab" @click="tabStatus"></app-tab-nav>
        </view>
        <view v-if="toSearch" class="search-item main-between cross-center">
            <view class="search-input">
                <image src='/static/image/icon/icon-search.png'></image>
                <input v-if="status == 1 && toSearch" focus @confirm='search' confirm-type='search' v-model='keyword'
                       placeholder-style='color:#999999;font-size:13px;' placeholder='输入订单号/商品名称/店铺名称搜索'/>
                <input v-if="status == 2 && toSearch" focus @confirm='search' confirm-type='search' v-model='keyword'
                       placeholder-style='color:#999999;font-size:13px;' placeholder='输入卡券名称/用户昵称搜索'/>
            </view>
            <view @click="cancelSeacrch">取消</view>
        </view>
        <view v-if="!searchResult && toSearch" :class="[`search-history`,`${list.length == 0 ? '' : 'go-out'}`]">
            <view v-if="candidate.length != 0" class='main-between search-title'>
                <view>历史搜索</view>
                <view @click="clear">
                    <image class="history-img" src="/static/image/icon/delete.png"></image>
                </view>
            </view>
            <view class='flex-wrap history-list'>
                <view @click="keywordSearch(item)" class="keyword-item box-grow-0" v-for="item in candidate"
                      :key="item">
                    <text class="t-omit">{{item}}</text>
                </view>
            </view>
        </view>
        <view v-if="toSearch" class="search-place"></view>

        <template v-if="status == 1">
            <view v-for="(item, index) in list" :key="item.id" class="item">
                <view class='main-between item-top'>
                    <view class='shop t-omit'>
                        <image src='./../image/shop.png'></image>
                        <text>{{item.store.name}}</text>
                    </view>
                    <view class="item-status" v-if="item.clerk_id > 0">已核销</view>
                    <view class="item-status" v-else-if="item.cancel_status == 1">已退款</view>
                    <view class="item-status" v-else>未核销</view>
                </view>
                <view @click="toDetail(item.id)">
                    <view class="goods" :style="{'margin-top':`${index == 0 ?'0':'12'}px`}" v-for="goods in item.detail"
                          :key="goods.id">
                        <image :src='goods.goods.goodsWarehouse.cover_pic'></image>
                        <view class='goods-info'>
                            <view class='goods-name t-omit-two'>{{goods.goods.goodsWarehouse.name}}</view>
                            <view class="goods-attr  t-omit-two">
                                <text v-for="attr in goods.attr_list" :key="attr.id">
                                    {{attr.attr_group_name}}:{{attr.attr_name}}
                                </text>
                            </view>
                            <view>x{{goods.num}}</view>
                        </view>
                        <view class='goods-price'>￥ {{goods.total_price}}</view>
                    </view>
                </view>
                <view class='total'>合计
                    <text>￥{{item.total_pay_price}}</text>
                    (含运费￥{{item.express_price}})
                </view>
                <view class='dir-right-nowrap' v-if="item.clerk_id == 0 && item.cancel_status != 1">
                    <view class="refund-text" v-if="item.refund">{{item.refund}}</view>
                    <view v-else class="clerk-btn dir-right-nowrap" @click="toClerk(item.id)">
                        <button>核销</button>
                    </view>
                </view>
            </view>
        </template>

        <template v-if="status == 2">
            <view v-for="item in list" :key="item.id" class="item card-item">
                <image class='card-img' :src='item.pic_url'></image>
                <view @click="toCardDetail(item.id)">
                    <view class='t-omit-two card-name'>{{item.name}}</view>
                    <view class="surplus-number">剩余{{item.number - item.use_number}}次</view>
                    <view class='dir-left-nowrap platform cross-center'>
                        <image class='platform-img' :src="item.platform_icon"></image>
<!--                        <image class='platform-img' v-if="item.platform == 'aliapp'" src='./../image/ali.png'></image>-->
                        <view>{{item.nickname}}</view>
                    </view>
                </view>
                <view class='cross-center card-clerk'>
                    <view v-if="item.is_use == 0 && item.receive_id == 0" class="clerk-btn dir-right-nowrap" @click="toClerkCard(item.id)">
                        <button>核销</button>
                    </view>
                    <view v-else-if="item.is_use == 0 && item.receive_id > 0" class="clerk-btn-1">
                        已转赠
                    </view>
                    <image v-else class='clerked-img' src='./../image/clerked.png'></image>
                </view>
            </view>
        </template>

        <view class='no-tip' v-if="list.length == 0 && status == 1">
            <image :src='clerkImg.order'></image>
            <view>没有任何订单哦~</view>
        </view>
        <view class='no-tip' v-if="list.length == 0 && status == 2">
            <image :src='clerkImg.card'></image>
            <view>没有任何卡券哦~</view>
        </view>
    </app-layout>
</template>

<script>
    import appTabNav from "../../../components/basic-component/app-tab-nav/app-tab-nav.vue";

    import {mapState} from "vuex";

    export default {
        name: "about",
        components: {
            "app-tab-nav": appTabNav,
        },
        data() {
            return {
                activeTab: 2,
                order_list: [
                    {id: 2, name: '未核销'},
                    {id: 1, name: '已核销'},
                    {id: 5, name: '已退款'},
                    {id: 3, name: '我的'},
                ],
                card_list: [
                    {id: 2, name: '未核销'},
                    {id: 1, name: '已核销'},
                    {id: 3, name: '我的'},
                ],
                tabList: [],
                candidate: [],
                status: 1,
                placeHeight: 312,
                setTop: 190,
                more_list: false,
                is_mall: false,
                toSearch: false,
                searchResult: false,
                first: false,
                keyword: '',
                list: []
            };
        },
        computed: {
            ...mapState({
                clerkImg: state => state.mallConfig.__wxapp_img.clerk,
                mall: state => state.mallConfig.mall
            }),
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.status = options.status
            if (options.type > 0) {
                this.activeTab = options.type
            }
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.$request({
                url: this.$api.clerk.info
            }).then(response => {
                if (response.code == 0) {
                    this.is_mall = response.data.is_mall;
                    if (!response.data.is_mall) {
                        this.placeHeight = 210;
                        this.setTop = 88;
                    }
                    this.list = [];
                    if (this.status == 1) {
                        this.tabList = this.order_list;
                        this.getList();
                        uni.setNavigationBarTitle({
                            title: "订单",
                        })
                    } else if (this.status == 2) {
                        this.tabList = this.card_list;
                        this.getCard();
                        uni.setNavigationBarTitle({
                            title: "卡券",
                        })
                    }
                } else {
                    uni.redirectTo({
                        url: '/pages/user-center/user-center'
                    })
                }
            })
        },
        onReachBottom: function () {
            if (this.more_list) {
                this.getMore();
            }
        },
        onShow(options) {
            let that = this;
            if (that.first) {
                that.$request({
                    url: that.$api.clerk.info
                }).then(response => {
                    if (response.code == 0) {
                        that.is_mall = response.data.is_mall;
                        if (!response.data.is_mall) {
                            this.placeHeight = 210
                        }
                        if (that.status == 1) {
                            that.getList();
                            uni.setNavigationBarTitle({
                                title: "订单",
                            })
                        } else if (that.status == 2) {
                            that.getCard();
                            uni.setNavigationBarTitle({
                                title: "卡券",
                            })
                        }
                    } else {
                        uni.redirectTo({
                            url: '/pages/user-center/user-center'
                        })
                    }
                })
            }

            if (!that.first) {
                if (that.status == 1) {
                    that.getList();
                } else if (that.status == 2) {
                    that.getCard();
                }
            }
        },
        methods: {
            getMore() {
                let that = this;
                let url;
                let para;
                if (that.load) {
                    return false
                }
                that.load = true;
                if (that.status == 1) {
                    if (that.activeTab == 3) {
                        url = that.$api.clerk.my;
                        para = {
                            page: that.page,
                        }
                    } else if (that.activeTab == 5) {
                        url = that.$api.clerk.order;
                        para = {
                            status: that.activeTab,
                            keyword_1: 8,
                            keyword: that.keyword
                        }
                    } else {
                        url = that.$api.clerk.order;
                        para = {
                            page: that.page,
                            is_clerk: that.activeTab,
                        }
                    }
                } else {
                    if (that.activeTab == 3) {
                        url = that.$api.clerk.my_card;
                        para = {
                            page: that.page,
                        }
                    } else {
                        url = that.$api.clerk.card;
                        para = {
                            page: that.page,
                            is_clerk: that.activeTab,
                        }
                    }
                }
                that.$request({
                    url: url,
                    data: para,
                }).then(response => {
                    that.$hideLoading();
                    that.load = false;
                    if (response.code == 0) {
                        that.list = that.list.concat(response.data.list);
                        that.page++;
                        that.more_list = false;
                        if (response.data.list.length == response.data.pagination.pageSize) {
                            that.more_list = true;
                        }
                        that.list.forEach(function (row) {
                            row.refund = null;
                            if (row.cancel_status == 2) {
                                row.refund = '申请取消中'
                            } else if (row.is_pay == 0) {
                                row.refund = '订单未支付'
                            }
                        })
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.load = false;
                    that.$hideLoading();
                });
            },

            toClerk(id) {
                uni.navigateTo({
                    url: '/pages/order/clerk/clerk?id=' + id
                });
            },
            toClerkCard(id) {
                uni.navigateTo({
                    url: '/pages/card/clerk/clerk?cardId=' + id
                });
            },
            toDetail(id) {
                uni.navigateTo({
                    url: '/plugins/clerk/detail/detail?id=' + id
                });
            },
            toCardDetail(id) {
                uni.navigateTo({
                    url: '/plugins/clerk/detail/detail?card_id=' + id
                });
            },
            keywordSearch(e) {
                this.keyword = e;
                this.searchResult = true;
                if (this.status == 1) {
                    this.getList();
                } else {
                    this.getCard();
                }
            },
            beSearch() {
                this.candidate = this.$storage.getStorageSync('clerk_keyword') ? this.$storage.getStorageSync('clerk_keyword') : [];
                if (this.status == 2) {
                    this.candidate = this.$storage.getStorageSync('clerk_card_keyword') ? this.$storage.getStorageSync('clerk_card_keyword') : [];
                }
                this.toSearch = !this.toSearch;
                this.list = [];
                this.searchResult = false;
                uni.setNavigationBarTitle({
                    title: "搜索",
                })
            },
            cancelSeacrch() {
                this.toSearch = !this.toSearch;
                this.keyword = '';
                if (this.status == 1) {
                    this.getList();
                    uni.setNavigationBarTitle({
                        title: "订单",
                    })
                } else {
                    this.getCard();
                    uni.setNavigationBarTitle({
                        title: "卡券",
                    })
                }
            },
            search() {
                let value = this.$storage.getStorageSync('clerk_keyword') ? this.$storage.getStorageSync('clerk_keyword') : [];
                if (this.status == 2) {
                    value = this.$storage.getStorageSync('clerk_card_keyword') ? this.$storage.getStorageSync('clerk_card_keyword') : [];
                }
                if (this.keyword.length == 0 || this.keyword.trim().length == 0) {
                    this.keyword = ''
                    return
                } else if (value.length > 0) {
                    value.unshift(this.keyword)
                } else {
                    value = [this.keyword]
                }
                value.forEach(function (row, index) {
                    if (value[0] == value[index] && index > 0) {
                        value.splice(index, 1)
                    }
                })
                if (this.status == 1) {
                    this.$storage.setStorageSync('clerk_keyword', value);
                    this.getList();
                } else {
                    this.$storage.setStorageSync('clerk_card_keyword', value);
                    this.getCard();
                }
            },
            // 清除搜索记录
            clear() {
                let that = this;
                if(this.status == 2) {
                    this.$storage.removeStorageSync('clerk_card_keyword');
                }else {
                    this.$storage.removeStorageSync('clerk_keyword');
                }
            },
            tabStatus(e) {
                let that = this;
                if (that.load) {
                    return false
                }
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.list = [];
                that.page = 2;
                that.activeTab = +e.currentTarget.dataset.id;
                if (this.status == 1) {
                    this.getList();
                } else {
                    this.getCard();
                }
            },
            tab(e) {
                let that = this;
                if (that.load) {
                    return false
                }
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.list = [];
                that.page = 2;
                that.activeTab = 2;
                that.status = e;
                if (e == 1) {
                    this.tabList = this.order_list;
                    this.getList();
                } else {
                    this.tabList = this.card_list;
                    this.getCard();
                }
            },
            getList() {
                let that = this;
                let url;
                let para;
                if (that.load) {
                    return false
                }
                that.load = true;
                if (this.activeTab == 3) {
                    url = that.$api.clerk.my;
                    para = {
                        keyword_1: 8,
                        keyword: this.keyword
                    }
                } else if (this.activeTab == 5) {
                    url = that.$api.clerk.order;
                    para = {
                        status: this.activeTab,
                        keyword_1: 8,
                        keyword: this.keyword
                    }
                } else {
                    url = that.$api.clerk.order;
                    para = {
                        is_clerk: this.activeTab,
                        keyword_1: 8,
                        keyword: this.keyword
                    }
                }
                that.$request({
                    url: url,
                    data: para,
                }).then(response => {
                    uni.hideLoading();
                    that.$hideLoading();
                    that.load = false;
                    if (response.code == 0) {
                        that.first = true;
                        that.list = response.data.list;
                        that.page = 2;
                        that.searchResult = true;
                        that.more_list = false;
                        if (response.data.list.length == response.data.pagination.pageSize) {
                            that.more_list = true;
                        }
                        that.list.forEach(function (row) {
                            row.refund = null;
                            if (row.cancel_status == 2) {
                                row.refund = '申请退款中'
                            } else if (row.is_pay == 0) {
                                row.refund = '订单未支付'
                            }
                        })
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.load = false;
                    uni.hideLoading();
                    that.$hideLoading();
                });
            },
            getCard() {
                let that = this;
                let url;
                let para;
                if (that.load) {
                    return false
                }
                that.load = true;
                if (this.activeTab == 3) {
                    url = that.$api.clerk.my_card;
                    para = {
                        keyword: this.keyword
                    }
                } else {
                    url = that.$api.clerk.card;
                    para = {
                        is_clerk: this.activeTab,
                        keyword: this.keyword
                    }
                }
                that.$request({
                    url: url,
                    data: para,
                }).then(response => {
                    that.load = false;
                    uni.hideLoading();
                    that.$hideLoading();
                    if (response.code == 0) {
                        that.list = response.data.list;
                        that.page = 2;
                        that.searchResult = true;
                        that.more_list = false;
                        if (response.data.list.length == response.data.pagination.pageSize) {
                            that.more_list = true;
                        }
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.load = false;
                    uni.hideLoading();
                    that.$hideLoading();
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    .search {
        height: #{88rpx};
        padding: #{16rpx} #{26rpx};
        background-color: #efeff4;
        position: fixed;
        top: #{104rpx};
        left: 0;
        width: 100%;
        z-index: 10;
    }

    .search-place {
        height: #{120rpx};
        width: 100%;
    }

    .search.no-mall {
        top: 0;
    }

    .search-content {
        background-color: #fff;
        height: #{56rpx};
        border-radius: #{28rpx};
    }

    .search-content image {
        height: #{24rpx};
        width: #{24rpx};
    }

    .search-content text {
        color: #b2b2b2;
        font-size: #{24rpx};
        margin: 0 #{5rpx};
    }

    .tab-list {
        height: #{96rpx};
        position: fixed;
        top: #{192rpx};
        left: 0;
        right: 0;
        z-index: 10;
        width: 100%;
        background-color: #fff;
        border-bottom: #{1rpx} solid #e2e2e2;
    }

    .tab-list.no-mall {
        top: #{88rpx};
    }

    .tab-item {
        text-align: center;
        font-size: #{28rpx};
        color: #666;
    }

    .tab-item text {
        height: #{92rpx};
        line-height: #{92rpx};
        display: inline-block;
    }

    .tab-item text.active {
        border-bottom: #{4rpx} solid #ff4544;
        color: #ff4544;
    }

    .status {
        width: 100%;
        height: #{104rpx};
        background-color: #fff;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
    }

    .status-list {
        width: #{368rpx};
        height: #{56rpx};
        margin: #{24rpx} auto;
        border-radius: #{28rpx};
        line-height: #{54rpx};
        font-size: #{24rpx};
        color: #666666;
        background-color: #fff;
    }

    .status-list view {
        width: 50%;
        text-align: center;
        border: #{2rpx} solid #ff4544;
    }

    .status-list .active {
        background-color: #ff4544;
        height: #{56rpx};
        color: #ffffff;
    }

    .item {
        width: #{702rpx};
        margin: 0 #{24rpx} #{24rpx};
        background-color: #fff;
        border-radius: #{16rpx};
        padding: #{24rpx};
        position: relative;
    }

    .item.card-item {
        padding: #{40rpx} #{160rpx} #{40rpx} #{132rpx};
    }

    .shop {
        font-size: #{24rpx};
        color: #353535;
        max-width: #{500rpx};
    }

    .shop image {
        height: #{24rpx};
        width: #{24rpx};
        margin-right: #{12rpx};
    }

    .goods {
        height: #{160rpx};
        position: relative;
    }

    .goods image {
        height: #{160rpx};
        width: #{160rpx};
        border-radius: #{10rpx};
        float: left;
        margin-right: #{20rpx};
    }

    .goods-info {
        font-size: #{24rpx};
        color: #999999;
    }

    .goods-name {
        color: #353535;
        height: #{70rpx};
    }

    .goods-price {
        color: #353535;
        font-size: #{24rpx};
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .total {
        font-size: #{24rpx};
        margin-top: #{28rpx};
        color: #999999;
        text-align: right;
    }

    .total text {
        color: #353535;
        font-size: #{28rpx};
    }

    .clerk-btn button {
        width: #{138rpx};
        text-align: center;
        height: #{48rpx} !important;
        border-radius: #{24rpx};
        border: #{1rpx} solid #ff4544;
        line-height: #{46rpx};
        margin-top: #{28rpx};
        font-size: #{24rpx};
        color: #ff4544;
        background-color: #fff;
    }

    .card-clerk .clerk-btn button {
        margin-top: 0;
    }

    .clerk-btn button::after {
        border: 0;
    }

    .clerk-btn-1 {
        width: #{138rpx};
        padding: #{8rpx 0};
        text-align: center;
        color: #ff4544;
        background-color: #ffecec;
        font-size: $uni-font-size-weak-one;
    }

    .search-item {
        height: #{96rpx};
        background-color: #efeff4;
        padding: 0 #{24rpx};
        font-size: #{28rpx};
        color: #00c203;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 22;
    }

    .search-input {
        height: #{64rpx};
        position: relative;
        width: #{620rpx};
    }

    .search-input image {
        height: #{22rpx};
        width: #{22rpx};
        position: absolute;
        top: #{21rpx};
        left: #{28rpx};
        z-index: 10;
    }

    .search-input input {
        padding-left: #{62rpx};
        background-color: #fff;
        border-radius: #{32rpx};
        height: #{64rpx};
        font-size: #{26rpx};
        color: #353535;
    }

    .search-history {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        background-color: #fff;
        padding: #{120rpx} #{4rpx} #{24rpx};
        font-size: #{28rpx};
        color: #666;
        z-index: 20;
    }

    .search-title {
        padding: 0 #{20rpx};
        margin-bottom: #{24rpx};
    }

    .keyword-item {
        height: #{64rpx};
        line-height: #{64rpx};
        padding: 0 #{20rpx};
        background-color: #f7f7f7;
        color: #333;
        border-radius: #{32rpx};
        font-size: #{28rpx};
        margin-left: #{20rpx};
        margin-bottom: #{20rpx};
        max-width: 90%;
    }

    .scan {
        position: fixed;
        bottom: #{80rpx};
        right: 0;
        z-index: 30;
        height: #{116rpx};
        width: #{112rpx};
    }

    .scan button {
        height: #{116rpx} !important;
        width: #{112rpx};
        border-top-left-radius: #{58rpx};
        border-bottom-left-radius: #{58rpx};
        border: #{1rpx} solid #cdcdcd;
        border-right: 0;
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 #{10rpx} rgb(239, 239, 239);
        text-align: center;
    }

    .scan button image {
        height: #{64rpx};
        width: #{64rpx};
        margin-top: #{26rpx};
    }

    .item .card-img {
        position: absolute;
        top: #{40rpx};
        left: #{24rpx};
        width: #{88rpx};
        height: #{88rpx};
        border-radius: 50%;
    }

    .platform {
        font-size: #{24rpx};
        color: #999999;
        height: #{24rpx};
        margin-top: #{20rpx};
    }

    .platform-img {
        height: #{24rpx};
        width: #{24rpx};
        margin-right: #{12rpx};
    }

    .card-name {
        width: #{370rpx};
        font-size: #{28rpx};
        color: #353535;
    }

    .card-clerk {
        position: absolute;
        right: #{24rpx};
        top: 0;
        height: #{168rpx};
    }

    .card-clerk .clerked-img {
        width: #{120rpx};
        height: #{120rpx};
    }

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
    }

    .no-tip image {
        height: #{240rpx};
        width: #{240rpx};
        margin-bottom: #{20rpx};
    }

    .left-status {
        border-top-left-radius: #{28rpx};
        border-bottom-left-radius: #{28rpx};
    }

    .right-status {
        border-top-right-radius: #{28rpx};
        border-bottom-right-radius: #{28rpx};
    }

    .history-img {
        height: #{34rpx};
        width: #{28rpx};
    }

    .history-list {
        max-height: #{420rpx};
        overflow: hidden;
    }

    .item-top {
        margin-bottom: #{28rpx};
    }

    .item-top .item-status {
        font-size: #{24rpx};
        color: #ff4544;
    }

    .goods-attr {
        margin-bottom: #{16rpx};
    }

    .goods-attr text {
        margin-right: #{18rpx};
    }

    .refund-text {
        font-size: #{24rpx};
        color: #ff4544;
        margin-top: #{24rpx};
        text-align: right;
    }

    .surplus-number {
        font-size: 24#{rpx};
        color: #999999;
        margin: 12#{rpx} 0;
    }
</style>