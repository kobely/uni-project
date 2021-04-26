<template>
    <app-layout>
        <app-tab-nav :tabList="tabList" :activeItem="activeTab" @click="tabStatus" padding="0" :theme="theme"></app-tab-nav>
        <view v-if="list && list.length > 0">
            <view class="item" v-for="item in list" :key="item.id">
                <view class="user-info">
                    <image class="avatar" :src="item.avatar"></image>
                    <view class="t-omit user-name">{{item.nickname}}</view>
                    <view class="time">绑定时间：{{item.junior_at}}</view>
                </view>
                <view class="number">推广{{item.peopleCount}}人</view>
                <view class="order-info">
                    <text>{{item.orderPrice}}元</text>
                    <text class="order-num">{{item.orderCount}}个订单</text>
                </view>
            </view>
        </view>
        <view class='no-tip' v-if="list.length == 0">
            <image src="/static/image/user-default-avatar.png"></image>
            <span>暂无相关成员</span>
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
                    {id:1, name: '一级分销'},
                ],
                loading: null,
                list: [],
                activeTab: 1,
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
                    url: that.$api.share.team,
                    data: {
                        status: that.activeTab
                    },
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.list = response.data.list;
                        that.first_count = response.data.first_count;
                        that.second_count = response.data.second_count;
                        that.third_count = response.data.third_count;
                        if(that.custom_setting.words.one_share.name) {
                            if(that.custom_setting.words.one_share.name.length > 7) {
                                that.custom_setting.words.one_share.name = that.custom_setting.words.one_share.name.substring(0,5) + '...'
                            }
                            that.tabList[0].name = that.custom_setting.words.one_share.name + '(' +that.first_count+')'
                        }else {
                            that.tabList[0].name = '一级分销(' +that.first_count+')'
                        }
                        if(that.second_count > 0) {
                            let second = {id: 2};
                            if(that.custom_setting.words.second_share.name.length > 7) {
                                that.custom_setting.words.second_share.name = that.custom_setting.words.second_share.name.substring(0,5) + '...'
                            }
                            second.name = that.custom_setting.words.second_share.name ? that.custom_setting.words.second_share.name  + '('+that.second_count+')': '二级分销('+that.second_count+')'
                            that.tabList[1] = second;
                            if(that.third_count > 0) {
                                if(that.custom_setting.words.three_share.name.length > 7) {
                                    that.custom_setting.words.three_share.name = that.custom_setting.words.three_share.name.substring(0,5) + '...'
                                }
                                let third = {id: 3};
                                third.name = that.custom_setting.words.three_share.name ? that.custom_setting.words.three_share.name  + '('+that.third_count+')': '三级分销('+that.third_count+')'
                                that.tabList[2] = third;
                            }
                        }
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
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.share.team,
                    data: {
                        status: that.activeTab,
                        page: that.page
                    },
                }).then(response=>{
                    that.$hideLoading();
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
                    that.$hideLoading();
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
            uni.setNavigationBarTitle({
                title: that.custom_setting.menus.team.name
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
        padding: #{24rpx};
        color: #353535;
        margin-bottom: #{25rpx};
    }

    .user-info {
        width: 75%;
        display: inline-block;
        height: #{136rpx};
    }

    .avatar {
        height: #{100rpx};
        width: #{100rpx};
        float: left;
        margin-right: #{25rpx};
    }

    .user-info .user-name {
        width: 40%;
    }

    .time {
        font-size: #{24rpx};
        color: #666;
        margin-top: #{20rpx};
    }

    .number {
        float: right;
        font-size: #{24rpx};
    }

    .order-info {
        color: #666;
        border-top: #{1rpx} solid #e2e2e2;
        padding-top: #{24rpx};
        font-size: #{30rpx};
    }

    .order-num {
        float: right;
    }
</style>
