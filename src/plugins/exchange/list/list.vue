<template>
    <app-layout>
        <app-tab-nav :setTop="0" :border="false" :shadow="false" :height="100" :tabList="tabList" :padding="0" :activeItem="activeTab" @click="tabStatus" :theme="getTheme"></app-tab-nav>
        <view v-if="activeTab == '0'" class="goods dir-left-wrap">
            <view style="width: 100%" v-if="list.length > 0">
                <app-product-list sign="exchange" :theme="getTheme" @routeGo="jump" :listStyle="listStyle" :goods_list="list"></app-product-list>
            </view>
            <view style="padding-top: 30%;width: 100%;" v-if="list.length == 0">
                <app-no-goods title="暂无可购买的礼品卡" background="#f7f7f7"></app-no-goods>
            </view>
        </view>
        <view v-if="activeTab == '1'">
            <view class="item" v-for="(item,index) in list" :key="index">
                <view class="dir-left-nowrap cross-center status">
                    <view class="item-cover">
                        <app-image :img-src="item.cover_pic" width="140rpx" height="140rpx"
                                   :border-radius="`8rpx 8rpx 0 0`"></app-image>
                    </view>
                    <view class="t-omit-two item-name">{{item.name}}</view>
                </view>
                <view class="item-time main-between cross-center">
                    <view>购买时间：{{item.created_at}}</view>
                    <view v-if="item.status == 'unused'" @click="apply(item)" :style="{'background-color': getTheme.background}" class="rewards-submit">立即使用</view>
                    <view v-else-if="item.status == 'used'" @click="apply(item)" class="rewards-submit over">已使用</view>
                    <view @click="apply(item)" v-else class="rewards-submit over">已失效</view>
                </view>
            </view>
            <view style="padding-top: 30%" v-if="list.length == 0">
                <app-no-goods title="暂无已获得的礼品卡" background="#f7f7f7"></app-no-goods>
            </view>
        </view>
        <view @click="toIndex" v-if="setting.is_to_exchange == 1" class="jump-dialog cross-center dir-top-nowrap main-center" :class="[`${tabbarbool? 'tabbarbool':''}`]">
            <image :src="setting.to_exchange_pic"></image>
            <view>兑换中心</view>
        </view>
    </app-layout>
</template>

<script>
    import appTabNav from "../../../components/basic-component/app-tab-nav/app-tab-nav.vue";
    import appProductList from '../../../components/page-component/app-product-list/app-product-list.vue';
    import appPrice from '../../../components/page-component/goods/app-price.vue';
    import appNoGoods from '../../../components/page-component/app-no-goods/app-no-goods.vue';
    import uMask from '../../../components/basic-component/u-mask/u-mask.vue';
    import { mapState, mapGetters } from "vuex";

    export default {
        name: "index",
        data() {
            return {
                currentRoute: this.$platDiff.route(),
                tabbarbool: false,
                tabList: [
                    {id:0, name: '购买礼品卡'},
                    {id:1, name: '我的礼品卡'}
                ],
                code: '',
                activeTab: '0',
                list: [],
                setting: {},
                listStyle: false,
                loading: false,
                more: false,
                dialog: false,
                msg: '',
                page: 1,
            };
        },
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img.mall,
                appSetting: state => state.mallConfig.mall.setting,
                tabBarNavs: state => state.mallConfig.navbar.navs,
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme'
            }),
            ...mapGetters('mallConfig', {
                getVideo: 'getVideo'
            })
        },
        components: {
            "app-tab-nav": appTabNav,
            'app-product-list': appProductList,
            appPrice,
            appNoGoods,
            "u-mask": uMask
        },
        watch: {
            tabBarNavs: {
                handler: function() {
                    this.b();
                },
                immediate: true,
            }
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: this.$children[0].navigationBarTitle,
                path: "/plugins/exchange/list/list",
            });
        },
        // #endif
        // #ifdef MP-WEIXIN
        onShareTimeline() {
          // 分享朋友圈beta
          return this.$shareTimeline({
            title: this.$children[0].navigationBarTitle,
            query: {} // 此处填写页面的参数
          });
        },
        // #endif
        onLoad(options) { this.$commonLoad.onload(options);
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
              menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
            if(options.tab > 0) {
                this.activeTab = options.tab.toString();
            }
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.$request({
                url: this.$api.exchange.setting,
            }).then(response=>{
                if(response.code == 0) {
                    this.setting = response.data;
                    this.getList();
                }else {
                    uni.showToast({
                        title: response.msg,
                        icon: 'none',
                        duration: 1000
                    });
                }
            })
        },
        onShow() {
            if(this.activeTab == '1') {
                this.getList();
            }
        },
        onReachBottom() {
            if(this.more) {
                this.page++;
                this.getMore();
            }
        },
        methods: {
            b() {
                // #ifndef H5
                let currentRoute = this.currentRoute;
                for (let i = 0; i < this.tabBarNavs.length; i++) {
                    if(currentRoute.includes(this.tabBarNavs[i].url.split('?')[0])) {
                        return this.tabbarbool = true;
                    }
                }
                // #endif
                return  this.tabbarbool = false;
            },
            toIndex() {
                uni.navigateTo({
                    url: '/plugins/exchange/index/index'
                })
            },
            getMore() {
                let that = this;
                if(this.loading) {
                    return false
                }
                this.loading = true;
                this.more = false;
                that.$request({
                    url: that.activeTab == '0' ? that.$api.exchange.list : that.$api.exchange.me_list,
                    data: {
                        page: this.page
                    }
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    this.loading = false;
                    if(response.code == 0) {
                        that.list = that.list.concat(response.data.list);
                        if(response.data.list.length == response.data.pagination.pageSize) {
                            this.more = true;
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
                });
            },
            jump(data) {
                // #ifndef MP-BAIDU
                if (data.video_url && this.getVideo == 1) {
                    // #ifdef MP
                    uni.navigateTo({
                        url: `/pages/goods/video?goods_id=${data.id}&sign=exchange`
                    });
                    // #endif
                    // #ifdef H5
                    uni.navigateTo({
                        url: `/plugins/exchange/goods/goods?goods_id=${data.id}`
                    });
                    // #endif
                } else {
                    uni.navigateTo({
                        url: `/plugins/exchange/goods/goods?goods_id=${data.id}`
                    });
                }
                // #endif

                // #ifdef MP-BAIDU
                uni.navigateTo({
                    url: `/plugins/exchange/goods/goods?goods_id=${data.id}`
                });
                // #endif
            },
            apply(goods) {
                uni.navigateTo({
                    url: '/plugins/exchange/gift/gift?code=' + goods.code
                })
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
                if(this.loading) {
                    return false
                }
                this.loading = true;
                this.page = 1;
                this.more = false;
                that.$request({
                    url: that.activeTab == '0' ? that.$api.exchange.list : that.$api.exchange.me_list
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    this.loading = false;
                    if(response.code == 0) {
                        that.list = response.data.list;
                        if(that.list.length == response.data.pagination.pageSize) {
                            this.more = true;
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
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    .jump-dialog {
        position: fixed;
        bottom: 120rpx;
        right: 24rpx;
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        background-color: rgba(0,0,0,.3);
        font-size: 16rpx;
        color: #fff;
        z-index: 100;
        &.tabbarbool {
            bottom: 240rpx;
        }
        image {
            width: 54rpx;
            height: 54rpx;
            margin-bottom: 3rpx;
            display: block;
        }
    }
    .item {
        margin: 24rpx 24rpx 0;
        background-color: #fff;
        border-radius: 16rpx;
        .status {
            padding: 28rpx 30rpx;
            border-bottom: 2rpx solid #e2e2e2;
            .item-cover {
                width: 140rpx;
                flex-shrink: 0;
                margin-right: 30rpx;
            }
            .item-name {
                font-size: 28rpx;
                color: #353535;
            }
        }
        .item-time {
            height: 112rpx;
            font-size: 28rpx;
            color: #666666;
            padding: 0 30rpx;
            .rewards-submit {
                height: 68rpx;
                line-height: 68rpx;
                text-align: center;
                padding: 0 30rpx;
                border-radius: 40rpx;
                color: #fff;
                font-size: #{28rpx};
                &.over {
                    background-color: #f7f7f7;
                    color: #999999;
                }
            }
        }
    }
</style>