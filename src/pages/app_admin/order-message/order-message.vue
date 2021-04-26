<template>
    <app-layout>
        <app-tab-nav :tabList="tabList" padding="0" :activeItem="activeTab" @click="tabStatus" :theme="theme"></app-tab-nav>
        <view class="order main-center cross-center">
            <view @click="choose" class="main-center cross-center">
                <view>{{active.name}}</view>
                <image class="more" src="../image/open.png"></image>
            </view>
        </view>
        <view class="order-placeholder"></view>
        <view @click="toOrder(item.order_no)" v-for="item in list" :key="item.id">
            <view class="msg-item">
                <view class="msg-title" v-if="activeTab==8"><text class="plugin-name">{{item.plugin_name}}</text>有新订单啦</view>
                <view class="msg-title" v-if="activeTab==4">退款申请</view>
                <view class="msg-title cross-center" v-if="activeTab==1 && item.type == 2">
                    <text class='replace'></text>换货申请</view>
                <view class="msg-title cross-center" v-if="activeTab==1 && item.type == 1">
                    <text class='return'></text>退货退款申请</view>
                <view class="msg-time">{{item.created_at}}</view>
                <view class="goods-info">
                    <image class="goods-img" :src='activeTab == 1? item.detail.goods_info.goods_attr.cover_pic: item.detail[0].goods.goodsWarehouse.cover_pic'></image>
                    <view class="goods-name t-omit-two">
                        <text>{{activeTab == 1? item.detail.goods_info.goods_attr.name : item.detail[0].goods.goodsWarehouse.name}}</text>
                        <text v-if="item.detail.length > 1 && activeTab != 1">等{{item.detail.length}}件商品</text>
                    </view>
                    <view class="goods-user">来自用户{{item.nickname}}</view>
                </view>
            </view>
        </view>
        <view class='no-tip' v-if="list.length === 0 && !loading">
            <image :src='adminImg.no_message'></image>
            <view>没有任何消息哦~</view>
        </view>
        <!-- 选择列表 -->
        <view class="dialog" v-if="dialog">
            <view class="picker-list">
                <view class="main-between picker-header">
                    <view @click="toggle(false,2)">取消</view>
                    <view @click="toggle(false,1)">确定</view>
                </view>
                <picker-view indicator-style="height: 36px;" :value="chooseIndex" @change="bindChange">
                    <picker-view-column>
                        <view 
                            :style="{'color': newIndex == idx ? '#446dfd' : newIndex == idx + 1 || newIndex == idx - 1 ? '#999999' : newIndex == idx + 2 || newIndex == idx - 2 ? '#cdcdcd' : ''}"
                            v-for="(item,idx) in choose_list" :key="item.name"
                            class="picker-view"
                            >{{item.name}}
                        </view>
                    </picker-view-column>
                </picker-view>
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
                    {id:8, name: '下单提醒'},
                    {id:4, name: '退款提醒'},
                    {id:1, name: '售后提醒'}
                ],
                theme: {
                    color: '#446dfd'
                },
                more_list: false,
                dialog: false,
                activeTab: 8,
                chooseIndex: [0],
                choose_list: [],
                list: [],
                newIndex: 0,
                page: 1,
                loading: false,
                today: '',
                yesterday: '',
                active: {
                    sign: 'all',
                    name: '全部',
                },
                num: {}
            }
        },
        components: {
            "app-tab-nav": appTabNav,
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                adminImg: state => state.mallConfig.__wxapp_img.app_admin,
            })
        },
        methods: {
            choose() {
                this.dialog = true;
            },

            toggle(boolean,type) {
                this.dialog = boolean;
                if(type == 1) {
                    uni.showLoading({
                        mask: true,
                        title: '加载中...'
                    });
                    this.chooseIndex[0] = this.newIndex;
                    this.active = this.choose_list[this.chooseIndex[0]];
                    this.list = [];
                    this.page = 1;
                    if (this.activeTab == 1) {
                        this.getPut();
                    } else {
                        this.getList();
                    }
                }else {
                    this.newIndex = this.chooseIndex[0];
                }
            },

            bindChange(e) {
                this.newIndex = e.detail.value[0];
            },
            
            toOrder(id) {
                uni.navigateTo({
                    url: '/pages/app_admin/order/order?no='+id+'&msg=1'
                }); 
            },
            tabStatus(e) {
                this.list = [];
                this.page = 1;
                this.activeTab = e.currentTarget.dataset.id;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                if (this.activeTab == 1) {
                    this.getPut();
                } else {
                    this.getList();
                }
            },
            getPut() {
                let that = this;
                if(that.loading) {
                    return false
                }
                that.loading = true;
                that.$request({
                    url: that.$api.app_admin.refund,
                    data: {
                        status: 0,
                        sign: that.active.sign,
                        page: that.page
                    }
                }).then(response=>{
                    that.loading = false;
                    uni.hideLoading();
                    if(response.code == 0) {
                        response.data.list.forEach(function(row,index){
                            if (row.created_at.substring(0,10) == that.today) {
                                row.created_at = row.created_at.substring(11)
                            } else if (row.created_at.substring(0, 10) == that.yesterday) {
                                row.created_at = '昨天'
                            }else {
                                row.created_at = row.created_at.substring(0, 10)
                            }
                        })
                        that.list = that.list.concat(response.data.list);
                        that.page++;
                        that.more_list = false;
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
                });
            },
            getList() {
                let that = this;
                if(that.loading) {
                    return false
                }
                that.loading = true;
                that.$request({
                    url: that.$api.app_admin.order,
                    data: {
                        status: that.activeTab,
                        plugin: that.active.sign,
                        page: that.page
                    }
                }).then(response=>{
                    that.loading = false;
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.choose_list = response.plugin_list;
                        response.data.list.forEach(function(row,index){
                            if (row.created_at.substring(0,10) == that.today) {
                                row.created_at = row.created_at.substring(11)
                            } else if (row.created_at.substring(0, 10) == that.yesterday) {
                                row.created_at = '昨天'
                            }else {
                                row.created_at = row.created_at.substring(0, 10)
                            }
                        })
                        that.list = that.list.concat(response.data.list);
                        that.page++;
                        that.more_list = false;
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
                    that.$hideLoading();
                    uni.hideLoading();
                });
            },
        },

        onReachBottom() {
            if(this.more_list) {
                uni.showLoading({
                    mask: true,
                    title: '加载更多...'
                });
                if (this.activeTab == 1) {
                    this.getPut();
                } else {
                    this.getList();
                }
            }
        },

        onLoad() { this.$commonLoad.onload();
            let that = this;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            var myDate = new Date();
            // 今天
            let year = myDate.getFullYear();
            let month = myDate.getMonth() + 1;
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            let now = myDate.getDate();
            that.today = year + "-" + month + "-" + now;
            var timestamp = Date.parse(new Date());
            // 昨天
            let yesterTime = (timestamp / 1000 - 24 * 60 * 60) * 1000;
            let yesterDate = new Date(yesterTime)
            let yester_year = yesterDate.getFullYear();
            let yester_month = yesterDate.getMonth() + 1;
            if (yester_month >= 1 && yester_month <= 9) {
                yester_month = "0" + yester_month;
            }
            let yester_now = yesterDate.getDate();
            that.yesterday = yester_year + "-" + yester_month + "-" + yester_now;
            that.getList();
        }
    }
</script>

<style scoped lang="scss">
    .order-placeholder {
        height: #{74rpx};
    }
    .order {
        position: fixed;
        top: #{90rpx};
        left: 0;
        color: #446dfd;
        width: 100%;
        z-index: 9;
        background-color: #f7f7f7;
        padding: #{24rpx} 0;
        font-size: #{26rpx};
        >view {
            width: #{200rpx};
            height: #{50rpx};
            text-align: center;
            .more {
                margin-left: #{12rpx};
                width: #{22rpx};
                height: #{12rpx};
                display: block;
            }
        }
    }
    .plugin-name {
        border: #{2rpx} solid #ff9000;
        padding: 0 #{6rpx};
        background-color: #fff8ee;
        color: #ff9000;
        font-size: #{24rpx};
        height: #{36rpx};
        border-radius: #{8rpx};
        line-height: #{35rpx};
        margin-right: #{8rpx};
    }

    .dialog {
        position: fixed;
        height: 100%;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, .3);
        .picker-list {
            background-color: #fff;
            padding-top: #{20rpx};
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
        }
        .picker-view {
            line-height: #{72rpx};
            text-align:center;
            font-size: #{32rpx};
        }
        picker-view {
            width: 100%;
            height: #{440rpx};
        }
        .picker-header {
            padding: 0 #{24rpx};
            color: #446dfd;
            font-size: #{32rpx};
        }
    }

    .msg-item {
        margin: #{24rpx};
        margin-bottom: 0;
        border-radius: #{16rpx};
        background-color: #fff;
        padding: #{28rpx} #{20rpx} #{24rpx};
        position: relative;
    }

    .msg-title {
        color: #353535;
        font-size: #{28rpx};
        margin-bottom: #{20rpx};
    }

    .msg-time {
        position: absolute;
        right: #{20rpx};
        top: #{32rpx};
        color: #999999;
        font-size: #{24rpx};
    }

    .goods-info {
        height: #{144rpx};
        border-radius: #{8rpx};
        background-color: #f7f7f7;
        position: relative;
        padding: #{16rpx} #{20rpx} 0 0;
    }

    .goods-img {
        height: #{144rpx};
        width: #{144rpx};
        float: left;
        margin-right: #{20rpx};
        margin-top: #{-16rpx};
    }

    .goods-name {
        color: #353535;
        font-size: #{26rpx};
    }

    .goods-user {
        position: absolute;
        left: #{164rpx};
        bottom: #{20rpx};
        color: #999999;
        font-size: #{24rpx};
    }

    .replace {
        height: #{12rpx};
        width: #{12rpx};
        border-radius: 50%;
        background-color: #ffaa31;
        display: inline-block;
        margin-right: #{12rpx};
    }

    .return {
        height: #{12rpx};
        width: #{12rpx};
        border-radius: 50%;
        background-color: #ff4544;
        display: inline-block;
        margin-right: #{12rpx};
    }

    .top {
        padding:0 #{24rpx};
        background-color: #fff;
        border-bottom: #{1rpx} solid #E2E2E2;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
    }

    .no-tip {
        position: fixed;
        top: #{250rpx};
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
</style>