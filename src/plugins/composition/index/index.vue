<template>
    <app-layout :overflow="false">
        <view class="banner">
            <image v-if="activityBg == 'statics/img/plugins/composition-banner.png'" :src="compositionImg.banner"></image>
            <image v-else :src="activityBg"></image>
            <view @click="toRule" class="rule">活动规则</view>
        </view>
        <view class="search" @click="toSearch">
            <view class="search-view dir-left-nowrap main-center cross-center">
                <image class="image" src="/static/image/icon/icon-search.png"></image>
                <view class="text">请输入商品名称搜索</view>
            </view>
        </view>
        <view class='no-tip' v-if="list.length == 0">
            <image src="/static/image/no-goods.png"></image>
            <view>没有任何套餐哦~</view>
        </view>
        <view v-else class="list" :style="{ position: position}">
            <view class="item" v-for="item in list" :key="item.id">
                <app-composition :theme="getTheme" @click="show(item)" @look="toDetail(item)" :item="item" :large="true">
                    <template>
                        <view class="look-goods main-center cross-center">
                            <view>套餐商品</view>
                            <image src="/static/image/icon/icon-down.png"></image>
                        </view>
                    </template>
                </app-composition>
            </view>
        </view>
        <view @click="close" class="dialog-bg" v-if="showGoods">
            <view @click.stop="" :class="['dialog', `${iphone_x? 'iphone_x':''}`,`${tabbarbool? 'tabbarbool':''}`]" :style="{'bottom':height +'px'}" :animation="animationData">
                <view class="dialog-title main-between cross-center">
                    <view @click="toDetail(detail)" class="toBuy dir-left-nowrap cross-center">
                        <image :style="{'background-color': getTheme.background}" src="/static/image/icon/goods-cart.png"></image>
                        <view :style="{'color': getTheme.color}">去购买套餐</view>
                    </view>
                    <view class="close">
                        <image @click="close" src="/static/image/icon/close.png"></image>
                    </view>
                </view>
                <view class="dialog-goods-list">
                    <view @click.stop="toGoods(item.goods_id)" class="dialog-goods dir-left-nowrap" :key="item.id" v-for="item in detail.host_list">
                        <image :src="item.cover_pic"></image>
                        <view>
                            <view class="t-omit-two goods-name">{{item.name}}</view>
                            <view class="goods-price" :style="{'color': getTheme.color}">￥{{item.min_price}}{{item.max_price != item.min_price ? '~￥'+item.max_price : ''}}</view>
                        </view>
                    </view>
                    <view @click.stop="toGoods(item.goods_id)" class="dialog-goods dir-left-nowrap" :key="item.id" v-for="item in detail.goods_list">
                        <image :src="item.cover_pic"></image>
                        <view>
                            <view class="t-omit-two goods-name">{{item.name}}</view>
                            <view class="goods-price" :style="{'color': getTheme.color}">￥{{item.min_price}}{{item.max_price != item.min_price ? '~￥'+item.max_price : ''}}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from "vuex";
    import appComposition from'../../../components/basic-component/app-composition/app-composition.vue';

    export default {
        data() {
            return {
                about: '',
                list: [],
                detail: {},
                position: 'static',
                iphone_x: false,
                noMore: false,
                showGoods: false,
                page: 2,
                height: 0,
                scrollHeight: 0,
                tabbarbool: false,
                animationData: {},
                currentRoute: this.$platDiff.route(),
                activityBg: ''
            }
        },
        components: {
            'app-composition': appComposition,
        },
        computed: {
            ...mapState({
                tabBarNavs: state => state.mallConfig.navbar.navs,
                compositionImg: state => state.mallConfig.__wxapp_img.composition
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            })
        },
        watch: {
            tabBarNavs: {
                handler: function() {
                    this.b();
                },
                immediate: true,
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
            show(e) {
                let that = this;
                that.detail = e;
                that.showGoods = true;
                that.position = 'fixed';
                let animation = uni.createAnimation({
                    duration: 1000,
                    timingFunction: 'ease'
                });
                that.animationData = animation;
                setTimeout(function(){
                    animation.translateY(that.height).step();
                    that.animationData = animation.export();
                },200)
            },
            close() {
                this.detail = {};
                this.showGoods = false;
                this.position = 'static'
            },
            toRule() {
                uni.navigateTo({
                    url: `/pages/rules/index?url=${encodeURIComponent(this.$api.composition.config)}&key=rule`
                });
            },
            toDetail(item) {
                uni.navigateTo({
                    url: '/plugins/composition/detail/detail?composition_id=' + item.id
                });
            },
            toGoods(id) {
                uni.navigateTo({
                    url: '/pages/goods/goods?id=' + id
                });
            },
            toSearch() {
                uni.navigateTo({
                    url: '/plugins/composition/search/search'
                });
            },
            getSetting() {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.composition.config,
                }).then(response=>{
                    if(response.code == 0) {
                        that.getList();
                        that.activityBg = response.data.activityBg;
                    }else {
                        that.$hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },

            getList() {
                let that = this;
                that.$request({
                    url: that.$api.composition.index,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.list = response.data.list;
                        if(that.list.length < 5) {
                            that.noMore = true;
                        }
                        for(let i in that.list) {
                            that.list[i].choose = false;
                            for(let idx in that.list[i].goods_list) {
                                that.list[i].goods_list[idx].choose_attr = null;
                                if(that.list[i].type == 2) {
                                    that.list[i].host_list[0].choose_attr = null;
                                    that.list[i].host_list[0].opacity = 1;
                                    that.list[i].goods_list[idx].choose_goods = false;
                                    that.list[i].host_list[0].choose_goods = false;
                                }
                            }
                        }
                        uni.setStorage({
                            key: "composition",
                            data: that.list
                        })
                    }else {
                        that.$hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
            getMore() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中'
                });
                that.$request({
                    url: that.$api.composition.index,
                    data: {
                        page: that.page
                    }
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        if(response.data.list.length == 0) {
                            this.noMore = true;
                            return false;
                        }
                        that.page++;
                        let list = response.data.list;
                        for(let i in list) {
                            list[i].choose = false;
                            for(let idx in list[i].goods_list) {
                                list[i].goods_list[idx].choose_attr = null;
                                if(list[i].type == 2) {
                                    list[i].host_list[0].choose_attr = null;
                                    list[i].host_list[0].opacity = 1;
                                    list[i].goods_list[idx].choose_goods = false;
                                    list[i].host_list[0].choose_goods = false;
                                }
                            }
                        }
                        that.list = that.list.concat(list);
                        uni.setStorage({
                            key: "composition",
                            data: that.list
                        })
                    }else {
                        uni.hideLoading();
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
        },
        onLoad() { this.$commonLoad.onload();
            let that = this;
            uni.getSystemInfo({
                success: function (res) {
                    that.height = -res.screenHeight;
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            });
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
              menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
            that.getSetting();
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: this.$children[0].navigationBarTitle,
                path: "/plugins/composition/index/index",
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
        onReachBottom() {
            if(!this.noMore) {
                this.getMore();
            }
        },
    }
</script>

<style scoped lang="scss">
    .list {
        .item {
            margin: 0 #{24rpx} #{20rpx};
            background-color: #fff;
            border-radius: #{16rpx};
            padding: #{24rpx};
            padding-bottom: #{16rpx};
            .look-goods {
                margin-top: #{8rpx};
                border-radius: #{8rpx};
                height: #{48rpx};
                width: #{288rpx};
                font-size: #{24rpx};
                color: #666666;
                background-color: #f7f7f7;
                image {
                    width: #{18rpx};
                    height: #{10rpx};
                    margin-left: #{16rpx};
                }
            }
        }
    }
    .no-tip {
        position: fixed;
        top: 40%;
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
    .banner {
        height: #{280rpx};
        width: 100%;
        position: relative;
        image {
            width: 100%;
            height: #{280rpx};
        }
        .rule {
            position: absolute;
            right: #{24rpx};
            top: #{24rpx};
            padding: 0 #{16rpx};
            border-radius: #{24rpx};
            height: #{48rpx};
            line-height: #{48rpx};
            font-size: #{22rpx};
            color: #fff;
            background-color: rgba(0,0,0,.4);
        }
    }
    .search {
        width: #{750rpx};
        height: #{88rpx};
        position: sticky;
        top: 0;
        left: 0;
        z-index: 100;
        background-color: #efeff4;
        padding: #{15rpx} #{24rpx};
        box-sizing: border-box;
        .search-view {
            width: #{750-48rpx};
            height: #{88-30rpx};
            background-color: white;
            border-radius: #{22rpx};
            .image {
            width: #{20rpx};
            height: #{20rpx};
            margin-right: #{11rpx};
            }
            .text {
            font-size: #{26rpx};
            color: #999999;
            }
        }
    }
    .dialog-bg {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.3);
        z-index: 202;
        .dialog {
            &.tabbarbool {
                padding-bottom: #{110rpx};
            }
            &.tabbarbool.iphone_x {
                padding-bottom: #{160rpx};
            }
            width: 100%;
            position: fixed;
            left: 0;
            z-index: 210;
            background-color: #fff;
            border-top-left-radius: #{16rpx};
            border-top-right-radius: #{16rpx};
            .dialog-title {
                padding: #{36rpx} #{24rpx} #{24rpx};
                font-size: #{32rpx};
                color: #353535;
                .toBuy {
                    font-size: #{28rpx};
                    image {
                        width: #{36rpx};
                        height: #{36rpx};
                        margin-right: #{12rpx};
                        display: block;
                    }
                }
                .close {
                    image {
                        width: #{36rpx};
                        height: #{36rpx};
                    }
                }
            }
            .dialog-goods-list {
                padding: 0 #{24rpx};
                max-height: #{750rpx};
                overflow-y: auto;
                .dialog-goods {
                    font-size: #{32rpx};
                    position: relative;
                    padding: #{28rpx} 0;
                    border-top: #{2rpx} solid #e2e2e2;
                    image {
                        width: #{180rpx};
                        height: #{180rpx};
                        margin-right: #{24rpx};
                        border-radius: #{8rpx};
                    }
                    .goods-name {
                        color: #353535;
                        width: #{498rpx};
                    }
                    .goods-price {
                        position: absolute;
                        bottom: #{50rpx};
                        left: #{204rpx};
                    }
                }
                .dialog-goods:first-of-type {
                    border-top: 0;
                }
            }
        }
    }
</style>
