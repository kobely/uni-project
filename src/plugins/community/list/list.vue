<template>
    <app-layout>
        <image class="banner" :src="setting.banner"></image>
        <view class="nav-area">
            <view class="nav main-center cross-center" :style="{'background-color': getTheme.background}">
                <view @click="tabStatus(item,index)" :key="item.id" class="nav-item" v-for="(item,index) in tabList">
                    <text>{{item.name}}</text>
                </view>
                <view class="active" :animation="animationData" :style="{'color': getTheme.color}">{{activeTabName}}</view>
            </view>
        </view>
        <view class="placeholder"></view>
        <view v-if="list.length > 0">
            <view v-for="item in list" :key="item.id" v-if="item.goods_count > 0" class="list">
                <view class="title main-center dir-top-nowrap" :style="{'background': getTheme.background_gradient}">
                    <view class="title-text t-omit">{{item.title}}
                        <image class="hot-icon" src="./../image/hot.png"></image>
                    </view>
                    <view class="sec-title-text t-omit" v-if="item.condition > 0">
                        <text v-if="item.num - item.condition_count > 0">还差{{item.num - item.condition_count}}{{item.condition == 1 ? '人':'件商品'}}成团</text>
                        <text v-else>已成团</text>
                        ，已<text v-if="item.condition == 1">参</text>团{{item.condition_count ? item.condition_count : '0'}}{{item.condition == 1 ? '人':'件'}}
                    </view>
                </view>
                <view class="status-text" :style="{'color': getTheme.color}">
                    <view class="status-bg" :style="{'background-color': getTheme.background}"></view>
                    {{item.statusText}}
                </view>
                <view @click="toDetail(item)" class="goods-list">
                    <view class="dir-left-nowrap">
                        <view class="goods" v-for="goods in item.communityGoods_4"  :key="goods.id">
                            <image mode='aspectFill' :src="goods.cover_pic"></image>
                        </view>
                    </view>
                    <image class="right-arrow" src="/static/image/icon/arrow-right.png"></image>
                </view>
                <view class="main-between cross-center other">
                    <view>共{{item.goods_count}}件商品</view>
                </view>
            </view>
        </view>
        <view v-else class="empty-box">
            <image v-if="!loading" src="/static/image/no-goods.png"></image>
            <span v-if="!loading">暂无{{activeTab == 0?'未开始': activeTab == 1?'进行中':activeTab == 2?'已结束':''}}活动</span>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appMenu from '../components/app-menu';
    import appTabNav from "../../../components/basic-component/app-tab-nav/app-tab-nav.vue";
    import appShareQrCode from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
    export default {
        data() {
            return {
                tabList: [
                    {id:-1, name: '全部'},
                    {id:1, name: '进行中'},
                    {id:0, name: '未开始'},
                    {id:2, name: '已结束'}
                ],
                activeTab: -1,
                activeTabName: '全部',
                list: [],
                setting: {},
                widthRate: 1,
                id: 0,
                loading: false,
                more: false,
                page: 1,
                first: true,
                poster: '',
                longitude: '',
                latitude: '',
                middleman: {},
                middleman_id: '',
                animation: {},
                animationData: {}
            }
        },
        components: {
            "app-tab-nav": appTabNav,
            "app-menu": appMenu,
            appShareQrCode
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme'
            }),
            ...mapState({
                stock: state => state.mallConfig.__wxapp_img.stock,
                bonusImg: state => state.mallConfig.__wxapp_img.bonus,
                userInfo: state => state.user.info,
            })
        },
        // #ifdef MP-WEIXIN
        onShareTimeline() {
          // 分享朋友圈beta
          return this.$shareTimeline({
            title: this.setting.app_share_title ? this.setting.app_share_title : this.$children[0].navigationBarTitle,
            query: {} // 此处填写页面的参数
          });
        },
        // #endif
        onShow() {
            let that = this;
            that.animation = uni.createAnimation({
                duration: 400,
                timingFunction: 'linear',
            });
            if(that.first) {
                return false;
            }
            if(this.$storage.getStorageSync('middleman_info')) {
                let middleman = this.$storage.getStorageSync('middleman_info');
                if(middleman.id > 0) {
                    that.middleman_id = middleman.user_id
                }
                that.getList();
            }else {
                that.getList();
            }
        },
        onLoad() { this.$commonLoad.onload();
            let that = this;
            uni.getSystemInfo({
                success: function (res) {
                    let width = res.windowWidth * 2;
                    that.widthRate = width / 750;
                }
            });
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
              menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
            // #ifndef H5
            uni.getLocation({
                success: (e) => {
                    uni.hideLoading();
                    that.longitude = e.longitude;
                    that.latitude = e.latitude;
                    that.$showLoading({
                        type: 'global',
                        text: '加载中...'
                    });
                    that.getSetting();
                },
                fail: (e) => {
                    uni.hideLoading();
                    uni.showModal({
                        title: '提示',
                        content: '获取位置信息失败，需要授权获取您的位置信息',
                        showCancel: false,
                        confirmText: '打开授权',
                        success(e) {
                            if (e.confirm) {
                                uni.openSetting({});
                            }
                        }
                    });
                },
            });
            // #endif
            // #ifdef H5
            if (that.$jwx.isWechat()) {
                that.$jwx.getLocation({
                    success(res) {
                        uni.hideLoading();
                        that.longitude = res.longitude;
                        that.latitude = res.latitude;
                        that.$showLoading({
                            type: 'global',
                            text: '加载中...'
                        });
                        that.getSetting();
                    },
                    fail: function () {
                        uni.showToast({
                            title: '请开启手机位置权限',
                            icon: 'none',
                            duration: 1000
                        });
                    },
                })
            }else {
                uni.getLocation({
                    success: (e) => {
                        uni.hideLoading();
                        that.longitude = e.longitude;
                        that.latitude = e.latitude;
                        that.$showLoading({
                            type: 'global',
                            text: '加载中...'
                        });
                        that.getSetting();
                    },
                    fail: (e) => {
                        uni.showModal({
                            title: '提示',
                            content: '定位失败，确保定位服务已开启',
                            success: function (res) {
                                if (res.confirm) {
                                    window.location.reload();
                                } else if (res.cancel) {
                                    let pages = getCurrentPages();
                                    if (pages.length > 1) {
                                        uni.navigateBack();
                                    } else {
                                        uni.navigateTo({
                                            url: 'pages/index/index'
                                        });
                                    }
                                }
                            }
                        });
                    },
                });
            }
            // #endif
        },
        onReachBottom() {
            if(this.more) {
                this.page++;
                this.getMore();
                this.more = false;
            }
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: this.setting.app_share_title ? this.setting.app_share_title : this.$children[0].navigationBarTitle,
                imageUrl: this.setting.app_share_pic ? this.setting.app_share_pic : '',
                path: "/plugins/community/list/list"
            });
        },
        // #endif
        methods: {
            getMore() {
                let that = this;
                that.loading = true;
                let para = {
                    longitude: that.longitude,
                    latitude: that.latitude,
                    page: that.page,
                    status: that.activeTab
                };
                if(that.middleman_id > 0) {
                    para.middleman_id = that.middleman_id
                }
                that.$request({
                    url: that.$api.community.list,
                    data: para,
                }).then(response=>{
                    that.loading = false;
                    that.first = false;
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code === 0) {
                        if (response.list.length === 20) {
                            that.more = true;
                        }else {
                            that.more = false
                        }
                        for(let index in response.list) {
                            if(response.list[index].goods_count == 0) {
                                response.list.splice(index,1)
                            }
                        }
                        that.list = that.list.concat(response.list);
                        for(let i in that.list) {
                            if(that.list[i].status_name === '已结束') {
                                that.list[i].statusText = '活动结束'
                            }else if(that.list[i].status_name === '进行中') {
                                that.list[i].statusText = that.list[i].end_at + '结束'
                            }else if(that.list[i].status_name === '未开始') {
                                that.list[i].statusText = that.list[i].start_at + '开始'
                            }
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.loading = false;
                    uni.hideLoading();
                    that.$hideLoading();
                });
            },
            toDetail(item) {
                uni.navigateTo({
                    url: '/plugins/community/activity/activity?id=' + item.id + '&title=' + item.title
                });
            },
            tabStatus(e,index) {
                let that = this;
                if(that.loading) {
                    return false
                }
                that.list = [];
                that.page = 1;
                that.activeTab = e.id;
                that.activeTabName = e.name;
                let width = 88* +that.widthRate * index;
                that.animation.translate(width, 0).step();
                that.animationData = that.animation.export();
                // uni.showLoading({mask: true,
                //     title: '加载中...'
                // });
                that.getList();
            },
            getSetting() {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.community.setting,
                }).then(response=>{
                    if(response.code === 0) {
                        that.setting = response.data;
                        if(this.$storage.getStorageSync('middleman_info')) {
                            let middleman = this.$storage.getStorageSync('middleman_info');
                            if(middleman.id > 0) {
                                that.middleman_id = middleman.user_id
                            }
                            that.getList();
                        }else {
                            that.getList();
                        }
                    }else {
                        that.$hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            getList() {
                let that = this;
                that.loading = true;
                let para = {
                    longitude: that.longitude,
                    latitude: that.latitude,
                    status: that.activeTab
                };
                if(that.middleman_id > 0) {
                    para.middleman_id = that.middleman_id
                }
                that.$request({
                    url: that.$api.community.list,
                    data: para,
                    method: 'post'
                }).then(response=>{
                    that.loading = false;
                    that.first = false;
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code === 0) {
                        if (response.list.length === 20) {
                            that.more = true;
                        }else {
                            that.more = false
                        }
                        for(let index in response.list) {
                            if(response.list[index].goods_count == 0) {
                                response.list.splice(index,1)
                            }
                        }
                        that.list = response.list;
                        for(let i in that.list) {
                            if(that.list[i].status_name === '已结束') {
                                that.list[i].statusText = '活动结束'
                            }else if(that.list[i].status_name === '进行中') {
                                that.list[i].statusText = that.list[i].end_at + '结束'
                            }else if(that.list[i].status_name === '未开始') {
                                that.list[i].statusText = that.list[i].start_at + '开始'
                            }
                        }
                        if(response.removeStorage) {
                            this.$storage.removeStorageSync('middleman_info');
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.loading = false;
                    uni.hideLoading();
                    that.$hideLoading();
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .list {
        margin: #{24rpx};
        width: #{702rpx};
        .title {
            height: #{115rpx};
            font-size: #{22rpx};
            color: #fff;
            border-top-left-radius: #{16rpx};
            border-top-right-radius: #{16rpx};
            padding-left: 63rpx;
            .title-text {
                font-size: #{30rpx};
                font-weight: 600;
                height: #{35rpx};
                line-height: #{35rpx};
                max-width: #{600rpx};
                position: relative;
                overflow: inherit;
                .hot-icon {
                    position: absolute;
                    top: 0;
                    left: #{-49rpx};
                    width: #{35rpx};
                    height: #{35rpx};
                }
            }
            .sec-title-text {
                width: #{600rpx};
            }
        }
        .status-text {
            text-align: center;
            position: relative;
            width: 100%;
            height: #{48rpx};
            line-height: #{48rpx};
            font-size: #{26rpx};
            .status-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0.1;
                z-index: 0;
            }
        }
        .goods-list {
            position: relative;
            height: #{160rpx};
            background-color: #fff;
            padding: 0 #{24rpx} #{24rpx};
            .goods {
                height: #{160rpx};
                padding-top: #{22rpx};
                padding-bottom: #{22rpx};
                image {
                    margin-right: #{38rpx};
                    height: #{120rpx};
                    width: #{120rpx};
                    border-radius: #{16rpx};
                }
            }
            .right-arrow {
                position: absolute;
                top: 50%;
                margin-top: #{-12rpx};
                right: #{30rpx};
                width: #{12rpx};
                height: #{24rpx};
            }
        }
        .other {
            padding: 0 #{24rpx} #{24rpx};
            font-size: #{24rpx};
            color: #999;
            height: #{60rpx};
            background-color: #fff;
            border-bottom-left-radius: #{16rpx};
            border-bottom-right-radius: #{16rpx};
            .other-button {
                line-height: #{58rpx};
                height: #{58rpx};
                padding: 0 #{35rpx};
                border-radius: #{30rpx};
                border: #{2rpx} solid #e2e2e2;
                display: inline-block;
                font-size: #{24rpx};
                margin-left: #{25rpx};
                &.active {
                    border-color: #ff4544;
                    color: #ff4544;
                }
            }
        }
    }
    .banner {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        height: #{280rpx};
        width: #{750rpx};
        background-color: #f7f7f7;
    }
    .nav-area {
        background-color: #f7f7f7;
        position: fixed;
        top: #{280rpx};
        left: 0;
        z-index: 10;
        .nav {
            height: #{54rpx};
            width: #{702rpx};
            margin: #{35rpx} #{24rpx};
            border-radius: 27rpx;
            box-shadow: rgba(186, 186, 186, 0.35) 0 4rpx 4rpx;
            .active {
                position: absolute;
                top: 28rpx;
                left: #{24rpx};
                width: 182rpx;
                height: 68rpx;
                line-height: 68rpx;
                z-index: 10;
                background-color: #fff;
                border-radius: 27rpx;
                text-align: center;
                box-shadow: rgba(186, 186, 186, 0.35) 0 4rpx 4rpx;
            }
            .nav-item {
                width: 25%;
                height: #{54rpx};
                color: #ffffff;
                font-size: #{28rpx};
                text-align: center;
                line-height: #{54rpx};
                position: relative;
            }
        }
    }
    .placeholder {
        height: #{380rpx};
    }
    .empty-box {
        width: 100%;
        height: 60vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        image {
            width: 280#{rpx};
            height: 280#{rpx};
        }
        span {
            margin-top: 15#{rpx};
            color: #999;
            font-size: 28#{rpx};
        }
    }
</style>