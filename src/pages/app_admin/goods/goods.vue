<template>
    <app-layout>
        <view v-if="id" class="screen" @click='id=null'></view>
        <view class="search main-between">
            <view @click='beSearch' v-if="!toSearch" class="main-center search-content cross-center">
                <image class="search-icon" src="/static/image/icon/icon-search.png"></image>
                <text class="search-text">请输入商品名称搜索</text>
            </view>
            <view v-else class="dir-left-nowrap" style="position: relative">
                <input focus placeholder="请输入商品名称搜索" class="box-grow-1 t-small search-content" @confirm='reload' confirm-type='search' @focus="getFocus=true;id=null" v-model='keyword'></input>
                <image v-if="getFocus && keyword.length > 0" @click="clearSearch" class="search-clear" src="../image/clear.png"></image>
            </view>
            <view @click="toAdd">
                <view class='add-goods dir-left-nowrap'>
                    <image src='./../image/add.png'></image>
                    <view>添加商品</view>
                </view>
            </view>
        </view>
        <app-tab-nav setTop="88" :tabList="tabList" padding="0" :activeItem="activeTab" @click="tabStatus" :theme="theme"></app-tab-nav>
        <view class="top-place"></view>
        <view>
            <view class="msg-item" @click='id=null' v-for="item in list" :key="item.id">
                <image class="msg-img" :src='item.goodsWarehouse.cover_pic'></image>
                <view class="out-dialog" v-if="item.goods_stock == 0 && appSetting.is_show_stock == '1'">
                    <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                </view>
                <view class="t-omit-two goods-name">{{item.name}}</view>
                <view class='goods-price'>¥{{item.price}}</view>
                <view class='goods-num goods-num-zero' v-if="item.goods_stock == 0">售罄</view>
                <view class='goods-num' v-else>库存:{{item.goods_stock}}</view>
                <image class='more-handle' @click.stop='showMenu(item.id)' src='./../image/more-handle.png'></image>
                <view v-if="item.id == id" class='main-between more'>
                    <view @click.stop="toEdit(item.id)">
                        <view class='more-item'>
                            <image src='./../image/goods-edit.png'></image>
                            <view>编辑</view>
                        </view>
                    </view>
                    <view @click.stop="toSwitch('0',item.id)">
                        <view v-if="activeTab == '1'" class='more-item'>
                            <image src='./../image/down.png'></image>
                            <view>下架</view>
                        </view>
                    </view>
                    <view @click.stop="toSwitch('1',item.id)">
                        <view v-if="activeTab == '0'" class='more-item'>
                            <image src='./../image/toUp.png'></image>
                            <view>上架</view>
                        </view>
                    </view>
                    <view @click.stop="toDelete(item.id)">
                        <view class='more-item'>
                            <image src='./../image/del.png'></image>
                            <view>删除</view>
                        </view>
                    </view>
                </view>
                <view v-if="item.id == id" class='and-more'></view>
            </view>
        </view>
        <view class='no-tip' v-if="list.length === 0 && !loading">
            <image class="icon-image" :src='adminImg.no_goods'></image>
            <view>没有任何商品哦~</view>
        </view>
        <view class="safe-area-inset-bottom">
            <view class="u-bottom-height"></view>
        </view>
        <view class="safe-area-inset-bottom u-bottom-fixed">
            <view :class="['main-between', 'bottom-tab']">
                <view class="box-grow-1 tab-item" @click="toRedirect('/pages/app_admin/index/index')">
                    <image class="tab-icon" src="./../image/index.png"></image>
                    <view>首页</view>
                </view>
                <view class="box-grow-1 tab-item" @click="toRedirect('/pages/app_admin/order/order')">
                    <image class="tab-icon" src="./../image/order.png"></image>
                    <view>订单</view>
                </view>
                <view class="box-grow-1 tab-item active" @click="reload">
                    <image class="tab-icon" src="./../image/goods-active.png"></image>
                    <view>商品</view>
                </view>
                <view class="box-grow-1 tab-item" @click="toRedirect('/pages/app_admin/setting/setting')">
                    <image class="tab-icon" src="./../image/setting.png"></image>
                    <view>设置</view>
                </view>
            </view>
        </view>
        <view class="dialog" v-if="is_switch || is_delete">
            <view class="dialog-item" v-if="is_switch || is_delete">
                <view class="dialog-title">提示</view>
                <view class="dialog-txt" v-if="is_switch && activeTab== '1'">是否下架该商品</view>
                <view class="dialog-txt" v-if="is_switch && activeTab== '0'">是否上架该商品</view>
                <view class="dialog-txt" v-if="is_delete">是否删除该商品</view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view v-if="is_switch" class="submit-btn be-submit" @click='goods_switch'>确认</view>
                    <view v-if="is_delete" class="submit-btn be-submit" @click='goods_destroy'>确认</view>
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
                tabList: [
                    {id:1, name: '出售中'},
                    {id:0, name: '下架中'}
                ],
                theme: {
                    color: '#446dfd'
                },
                activeTab: '1',
                getFocus: false,
                keyword: '',
                page: 1,
                id: null,
                more_list: false,
                iphone_x: false,
                status: null,
                page_loading: true,
                list: [],
                is_switch: false,
                is_delete: false,
                toSearch: false,
                device: null,
                first: false,
                loading: false
            }
        },
        components: {
            "app-tab-nav": appTabNav
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                appImg: state => state.mallConfig.__wxapp_img.mall,
                appSetting: state => state.mallConfig.mall.setting,
                adminImg: state => state.mallConfig.__wxapp_img.app_admin,
            })
        },
        methods: {
            toEdit(id) {
                uni.navigateTo({
                    url: '/pages/app_admin/add-goods/add-goods?id=' + id
                })
            },
            clearSearch() {
                this.keyword = '';
                this.reload();
            },
            toAdd() {
                uni.navigateTo({
                    url: '/pages/app_admin/add-goods/add-goods'
                })
            },
            toRedirect(url) {
                uni.redirectTo({
                    url: url
                })
            },
            beSearch() {
                this.getFocus=false;
                if (this.keyword.length == 0) {
                    this.toSearch = !this.toSearch
                }else {
                    this.toSearch = this.toSearch;
                }
            },
            reload() {
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.list = [];
                this.page = 1;
                this.id = null;
                this.getList();
            },
            cancel() {
                this.id = null;
                this.is_delete = false;
                this.is_switch = false;
            },
            toDelete(e) {
                this.is_delete = true;
            },
            showMenu(id) {
                if(this.id == id) {
                    this.id = null
                }else {
                    this.id = id;
                }
            },
            toSwitch(status,id) {
                let that = this;
                that.id = id;
                that.status = status;
                that.is_switch = true;
            },
            tabStatus(e) {
                if(this.loading) {
                    return false
                }
                this.list = [];
                this.page = 1;
                this.activeTab = e.currentTarget.dataset.id;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.getList();
            },
            getList() {
                let that = this;
                if(that.loading) {
                    return false
                }
                that.loading = true;
                let para = {
                    keyword: that.keyword
                };
                para.status = that.activeTab;
                that.$request({
                    url: that.$api.app_admin.goods,
                    data: {
                        page: that.page,
                        search: JSON.stringify(para)
                    }
                }).then(response=>{
                    that.loading = false;
                    uni.hideLoading();
                    that.$hideLoading();
                    if(response.code === 0) {
                        that.list = that.list.concat(response.data.list);
                        that.page++;
                        that.more_list = false;
                        that.first = true;
                        if (response.data.list.length == response.data.pagination.pageSize) {
                            that.more_list = true;
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.loading = false;
                    uni.hideLoading();
                    that.$hideLoading();
                });
            },
            goods_destroy() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.app_admin.goods_destroy,
                    data: {
                        id: that.id
                    },
                    method: 'post'
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.page = 1;
                        that.list = [];
                        that.id = null;
                        that.is_delete = false;
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

            goods_switch() {
                let that = this;
                that.$request({
                    url: that.$api.app_admin.goods_switch,
                    data: {
                        status: that.status,
                        id: that.id
                    },
                    method: 'post'
                }).then(response=>{
                    if(response.code == 0) {
                        that.page = 1;
                        that.id = null;
                        that.list = [];
                        that.is_switch = false;
                        that.getList();
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                });
            },
        },

        onLoad() { this.$commonLoad.onload();
            let that = this;
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
            this.activeTab = '1';
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.getList();
        },

        onReachBottom: function() {
            if (this.more_list) {
                this.getList();
            }
        },

        onShow() {
            let that = this;
            that.id = null;
            if(that.first) {
                this.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.list = [];
                that.page = 1;
                that.getList();          
            }
        }
    }
</script>

<style scoped lang="scss">
    .search {
        z-index: 30;
        height: #{88rpx};
        padding: #{16rpx} #{35rpx};
        background-color: #EFEFF4;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
    }

    .search input {
        padding: 0 #{70rpx} 0 #{30rpx};
    }

    .search-clear {
        position: absolute;
        right: #{15rpx};
        top: #{14rpx};
        width: #{30rpx};
        height: #{30rpx};
        z-index: 100;
    }

    .search-content {
        background-color: #fff;
        height: #{56rpx};
        border-radius: #{28rpx};
        width: #{502rpx};
    }

    input.search-content {
        width: #{482rpx};
        font-size: #{26rpx};
    }

    .msg-item {
        margin: #{24rpx};
        margin-bottom: 0;
        background-color: #fff;
        border-radius: #{16rpx};
        position: relative;
        padding: #{24rpx};
        .out-dialog {
            width: #{148rpx};
            height: #{148rpx};
            position: absolute;
            top: #{24rpx};
            left: #{24rpx};
            z-index: 5;
            background-color: rgba(0,0,0,.5);
            image {
                width: #{148rpx};
                height: #{148rpx};
            }
        }
    }

    .msg-img {
        height: #{148rpx};
        width: #{148rpx};
        display: block;
    }

    .goods-name {
        font-size: #{26rpx};
        color: #353535;
        position: absolute;
        top: #{22rpx};
        left: #{192rpx};
        width: #{486rpx};
    }

    .goods-price {
        font-size: #{32rpx};
        color: #ff4544;
        position: absolute;
        bottom: #{55rpx};
        left: #{192rpx};
    }

    .goods-num {
        font-size: #{24rpx};
        color: #999999;
        position: absolute;
        bottom: #{20rpx};
        left: #{192rpx};
    }

    .goods-num-zero {
        color: #ff4544;
    }

    .add-goods {
        width: #{180rpx};
        height: #{56rpx};
        line-height: #{54rpx};
        border-radius: #{28rpx};
        border: #{1rpx} solid #446dfd;
        padding-left: #{18rpx};
        font-size: #{26rpx};
        color: #446dfd;
        margin-left: #{20rpx};
        background-color: #fff;
    }

    .add-goods image{
        height: #{28rpx};
        width: #{28rpx};
        margin-right: #{8rpx};
        margin-top: #{14rpx};
        display: block;
    }

    .more-handle {
        height: #{56rpx};
        width: #{56rpx};
        position: absolute;
        bottom: #{16rpx};
        right: #{24rpx};
    }

    .more {
        height: #{100rpx};
        border-radius: #{8rpx};
        background-color: rgba(0, 0, 0, .75);
        padding: #{18rpx} 0 #{8rpx};
        font-size: #{20rpx};
        color: #fff;
        z-index: 6;
        position: absolute;
        bottom: #{62rpx};
        right: #{24rpx};
    }

    .more-item {
        width: #{90rpx};
        text-align: center;
    }

    .more .more-item image {
        height: #{40rpx};
        width: #{40rpx};
    }

    .and-more {
        width: 0;
        height: 0;
        border-left: #{10rpx} solid transparent;
        border-right: #{10rpx} solid transparent;
        border-top: #{10rpx} solid rgba(0, 0, 0, .75);
        position: absolute;
        bottom: #{54rpx};
        right: #{44rpx};
        z-index: 6;
    }

    .bottom-tab {
        width: 100%;
        height: #{96rpx};
        background-color: #fff;
        font-size: #{20rpx};
        color: #9096ad;
        padding-top: #{14rpx};
    }
    .u-bottom-fixed {
        z-index: 999;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        background-color: #ffffff;
    }
    .tab-item {
        text-align: center;
    }

    .tab-icon {
        height: #{48rpx};
        width: #{48rpx};
        display: inline-block;
    }

    .tab-item.active {
        color: #446dfd;
    }

    .tab-item view {
        margin-top: #{-5rpx};
    }

    .screen {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0)
    }

    .btn-area {
        height: #{88rpx};
        position: relative;
        border-top: #{1rpx} solid #e2e2e2;
    }

    .btn-area .line {
        height: #{32rpx};
        width: #{1rpx};
        background-color: #e2e2e2;
        position: absolute;
        top: #{28rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
    }

    .submit-btn {
        height: #{88rpx};
        line-height: #{88rpx};
        font-size: #{32rpx};
        color: #666;
        width: #{310rpx};
        text-align: center;
    }

    .submit-btn.be-submit {
        color: #446dfd;
    }

    .dialog {
        position: fixed;
        height: 100%;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, .3);
    }

    .dialog-item {
        padding-top: #{35rpx};
        position: fixed;
        top: 30%;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: #{620rpx};
        border-radius: #{16rpx};
        background-color: #fff;
    }

    .dialog-title {
        font-size: #{32rpx};
        color: #353535;
        margin-bottom: #{6rpx};
        text-align: center;
    }

    .dialog-txt {
        margin: #{40rpx} auto;
        text-align: center;
        font-size: #{32rpx};
        color: #353535;
    }

    .no-tip {
        position: fixed;
        top: 35%;
        left: 0;
        right: 0;
        color: #666666;
        font-size: #{24rpx};
        text-align: center;
    }

    .no-tip .icon-image {
        height: #{240rpx};
        width: #{240rpx};
        margin-bottom: #{20rpx};
    }

    .u-bottom-height {
        height: 116upx;
    }
    .search-icon {
        height: #{24rpx};
        width: #{24rpx};
    }

    .search-text {
        color: #b2b2b2;
        font-size: #{24rpx};
        margin: 0 #{5rpx};
    }

    .top-place {
        height: #{88rpx};
    }
</style>