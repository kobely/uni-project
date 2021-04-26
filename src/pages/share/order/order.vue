<template>
    <app-layout>
        <app-tab-nav :tabList="tabList" :activeItem="activeTab" padding="0" @click="tabStatus" :theme="theme"></app-tab-nav>
        <view class="list" v-if="list && list.length > 0">
            <view class="item" v-for="item in list" :key="item.id">
                <view class="item-top main-between">
                    <text>订单号：{{item.order_no}}</text>
                    <text class="red-color">{{item.status}}</text>
                </view>
                <view @click="open(item.id)">
                    <view class="item-bottom dir-left-nowrap">
                        <image class="avatar" :src="item.avatar"></image>
                        <view class="t-omit name">{{item.nickname}}</view>
                        <view class="t-omit type">{{item.share_status}}</view>
                        <view class="money">{{item.is_sale == 1 ? "已得佣金:" : "预计佣金:"}}
                            <text class="red-color">{{item.share_money}}</text>元</view>
                        <image class="close" src="/static/image/share/img-share-down.png" v-if="id == item.id"></image>
                        <image class="open" src="/static/image/share/img-share-right.png" v-else></image>
                    </view>
                </view>
                <view class="order" v-if="id == item.id" v-for="goods in item.detail" :key="goods.id">
                    <view @click="toGoods(goods.id,item)">
                        <image class="goods-img" :src="goods.cover_pic"></image>
                        <view class="t-omit goods-name">{{goods.name}}</view>
                        <view><text v-for="attr in goods.attr_list" :key="attr.attr_group_id">{{attr.attr_group_name}}:{{attr.attr_name}}</text></view>
                        <view>x{{goods.num}}</view>
                    </view>
                </view>
            </view>
        </view>
        <view class='no-tip' v-if="list && list.length == 0">
            <image src="/static/image/order-empty.png"></image>
            <span>暂无{{activeTab == 1?'待付款': activeTab == 2?'已付款':activeTab == 3?'已完成':''}}订单</span>
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
                    {id:0, name: '全部'},
                    {id:1, name: '待付款'},
                    {id:2, name: '已付款'},
                    {id:3, name: '已完成'},
                ],
                loading: null,
                list: [],
                activeTab: 0,
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
                if(this.id != e) {
                    this.id = e;
                }else {
                    this.id = null;
                }
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
                    url: that.$api.share.share_order,
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
                let url;
                uni.showLoading({
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.share.share_order,
                    data: {
                        status: that.activeTab,
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
            toGoods(id,item) {
                if(item.mch_id > 0) {
                    uni.navigateTo({
                        url: '/plugins/mch/goods/goods?id=' + id +'&mch_id=' + item.mch_id
                    });
                }else if(item.sign =='advance') {
                    uni.navigateTo({
                        url: '/plugins/advance/detail/detail?id=' + id
                    });
                }else if(item.sign =='pintuan') {
                    uni.navigateTo({
                        url: '/plugins/pt/goods/goods?goods_id=' + id
                    });
                }else if(item.sign =='miaosha') {
                    uni.navigateTo({
                        url: '/plugins/miaosha/goods/goods?id=' + id
                    });
                } else if(item.sign =='gift') {
                    uni.navigateTo({
                        url: '/plugins/gift/goods/goods?id=' + id
                    });
                } else if(item.sign =='advance') {
                    uni.navigateTo({
                        url: '/plugins/advance/detail/detail?id=' + item.goods_id
                    });
                }  else if(item.sign =='booking') {
                    uni.navigateTo({
                        url: '/plugins/book/goods/goods?goods_id=' + id
                    });
                } else if(item.sign =='') {
                    uni.navigateTo({
                        url: '/pages/goods/goods?id=' + id
                    });
                } else if(item.sign == 'vip_card') {
                    return false
                }else {
                    uni.navigateTo({
                        url: '/plugins/'+item.sign+'/goods/goods?goods_id=' + id
                    });
                }

            },
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            uni.setNavigationBarTitle({
                title: that.custom_setting.menus.order.name
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
    .item {
        background-color: #fff;
        color: #353535;
        padding: 0 #{24rpx};
        font-size: #{24rpx};
        margin-bottom: #{30rpx};
    }

    .status {
        float: right;
    }

    .item-top {
        padding: #{24rpx} 0;
        border-bottom: #{1rpx} solid #e2e2e2;
    }

    .item-bottom {
        height: #{90rpx};
        line-height: #{66rpx};
        padding: #{12rpx} 0;
    }

    .avatar {
        height: #{64rpx};
        width: #{64rpx};
        float: left;
        margin-right: #{10rpx};
    }

    .item-bottom .name {
        width: 20%;
    }

    .item-bottom .type {
        width: 25%;
        margin-left: #{20rpx};
    }

    .item-bottom .money {
        width: 35%;
        text-align: right;
    }

    .open {
        float: right;
        margin: #{20rpx} #{10rpx} 0 #{20rpx};
        height: #{26rpx};
        width: #{16rpx};
    }

    .close {
        float: right;
        margin: #{25rpx} #{10rpx};
        height: #{16rpx};
        width: #{26rpx};
    }

    .order {
        border-top: #{1rpx} solid #e2e2e2;
        height: #{164rpx};
        padding: #{30rpx} 0;
    }

    .goods-img {
        height: #{104rpx};
        width: #{104rpx};
        margin-right: #{50rpx};
        float: left;
    }

    .goods-name {
        width: 75%;
        margin-bottom: #{5rpx};
    }
    .red-color {
        color: #ff4544;
    }
</style>