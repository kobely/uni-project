<template>
    <app-layout>
        <view class="shop" :class=" fixed ? `shop-tab-` + tab:``">
            <!-- v1 -->
            <view class="shop-head">
                <view class="tt-bg"></view>
                <view class="black">
                    <image :src="detail.store.pic_url && detail.store.pic_url.length && detail.store.pic_url[0].pic_url" class="shop-pic" lazy-load mode="aspectFill"></image>
                </view>
                <view class="shop-summary dir-left-nowrap cross-center" v-if="detail">
                    <image :src="detail.store.cover_url" class="icon-pic"></image>
                    <view class="dir-top-nowrap box-grow-1 main-center">
                        <view class="shop-name t-omit">{{detail.store.name}}</view>
                        <view class="box-grow-1 shop-goods">
                            <text>商品:{{detail.goods_count}}</text>
                            <text>已售:{{detail.order_goods_count}}</text>
                        </view>
                    </view>
                    <view @click="openKfModal" class="cross-center dir-top-nowrap kf" v-if="is_service">
                        <icon class="icon-kf" type></icon>
                        <view>客服</view>
                    </view>
                </view>
            </view>
            <!-- v2 -->
            <view class="cross-center main-center shop-tab">

                <view class="main-center cross-center box-grow-0 shop-search" @click="goodsSearch">
                    <icon class="icon-search" type></icon>
                </view>
                <view class="cross-center main-center box-grow-1" style="padding: 0 32rpx">
                    <view @click="tabChange(1)" class="cross-center main-center box-grow-1 dir-top-nowrap">
                        <view :style="{'color': tab === 1 ? getTheme.color : ''}">首页</view>
                        <view v-if="tab === 1" class="shop-tab-active" :style="{'background-color': getTheme.background}"></view>
                    </view>
                    <view @click="tabChange(2)" class="cross-center main-center box-grow-1 dir-top-nowrap">
                        <view :style="{'color': tab === 2 ? getTheme.color : ''}">全部</view>
                        <view v-if="tab === 2" class="shop-tab-active" :style="{'background-color': getTheme.background}"></view>
                    </view>
                    <view @click="tabChange(5)" class="cross-center main-center box-grow-1 dir-top-nowrap">
                        <view :style="{'color': tab === 5 ? getTheme.color : ''}">新品</view>
                        <view v-if="tab === 5" class="shop-tab-active" :style="{'background-color': getTheme.background}"></view>
                    </view>
                    <view @click="navigateSummary" class="cross-center main-center box-grow-1 dir-top-nowrap">
                        <view>简介</view>
                    </view>
                </view>
            </view>

            <!-- v3 -->
            <block v-if="tab === 1">
                <view class="shop-home">热销推荐</view>
                <u-ordinary-list :reset="reset" :pagination="true" :isShowAttr="true" :previewUrl="order_preview" :submitUrl="order_submit" :list="goods_list" :theme="getTheme" :list-style="2"></u-ordinary-list>
            </block>

            <block v-if="tab === 2">
                <view class="dir-left-nowrap shop-all">
                    <view class="box-grow-1 dir-left-nowrap main-center cross-center" @click="navCat">
                        <view>分类</view>
                        <icon class="icon-cat" type></icon>
                    </view>
                    <view class="box-grow-1 dir-left-nowrap main-center cross-center" @click="changeStyle(1)">
                        <view :style="{'color': sort === 1 ? getTheme.color : ''}">综合</view>
                    </view>
                    <view class="box-grow-1 dir-left-nowrap main-center cross-center" @click="changeStyle(4)">
                        <view :style="{'color': sort === 4 ? getTheme.color : ''}">销量</view>
                    </view>
                    <view class="box-grow-1 dir-left-nowrap main-center cross-center" @click="changeStyle(3)">
                        <view :style="{'color': sort === 3 ? getTheme.color : ''}">价格</view>
                        <icon v-if="sort === 3 && sort_type === 1" class="icon-price-plus" :style="{'color': getTheme.color,'background-color': getTheme.background}" type></icon>
                        <icon v-else-if="sort === 3 && sort_type === 0" class="icon-price-less" :style="{'color': getTheme.color,'background-color': getTheme.background}" type></icon>
                        <icon v-else class="icon-price-default" type></icon>
                    </view>
                </view>
                <u-ordinary-list :reset="reset" :pagination="true" :isShowAttr="true" :previewUrl="order_preview" :submitUrl="order_submit" :list="goods_list" :theme="getTheme" :list-style="2"></u-ordinary-list>
            </block>

            <block v-if="tab === 5">
                <view v-for="(v,k) in goods_list" :key="k" v-if="v.goods_list && v.goods_list.length">
                    <view class="cross-center main-center dir-left-nowrap shop-new">
                        <view class="line"></view>
                        <view class="label">{{v.label}}</view>
                        <view class="line"></view>
                    </view>
                    <u-ordinary-list :reset="reset" :pagination="true" :isShowAttr="true" :previewUrl="order_preview" :submitUrl="order_submit" :list="v.goods_list" :theme="getTheme" :list-style="2"></u-ordinary-list>
                </view>
            </block>
            <!-- v4 -->
            <view v-if="shopKf">
                <view class="act-modal show">
                    <view class="act-modal-bg" @click="closeKfModal"></view>
                    <view class="act-modal-pic main-center cross-center">
                        <view class="shop-model">
                            <image @click="closeKfModal" src="../../../static/image/icon/close.png"></image>
                            <view class="kf">联系客服</view>
                            <view class="cross-center dir-top-nowrap">
                                <view v-if="mch_setting.is_web_service" @click="navigateCs"
                                      class="shop-info main-center cross-center dir-left-nowrap">
                                    <image :src="mch_setting.web_service_pic ? mch_setting.web_service_pic : './../image/shop-contact.png'"></image>
                                    <view>在线沟通</view>
                                </view>
                                <view v-if="detail.store.mobile" @click="callPhone"
                                      class="shop-info main-center cross-center dir-left-nowrap">
                                    <image src="./../image/shop-phone.png"></image>
                                    <view>致电商家</view>
                                </view>
                                <view v-if="detail.wechat" @click="copyInfo"
                                      class="shop-info main-center cross-center dir-left-nowrap">
                                    <image src="./../image/shop-wechat.png"></image>
                                    <view>复制微信号</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import uOrdinaryList from '../../../components/page-component/u-goods-list/u-ordinary-list.vue';

    export default {
        name: "shop",
        components: {
            uOrdinaryList
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
        },
        data() {
            return {
                mch_id: -1,
                sort: 1,
                cat_id: 0,
                sort_type: 0,
                page: 1,
                load: false,
                args: false,
                is_service: 0,

                detail: {store: {}},
                mch_setting: {},

                tab: 2,
                shopKf: false,
                coupon_list: [],
                goods_list: [],
                fixed: false,
                order_preview: this.$api.mch.order_preview,
                order_submit: this.$api.mch.order_submit,

                attrGoods: {
                    attrShow: 0,
                    goods: {}
                },
                reset: true
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            //this.$store.dispatch('user/info');
            this.mch_id = options.mch_id;
            this.cat_id = options.cat_id ? options.cat_id : 0;
            this.loadShop();
            this.getGoods();
            this.getOption();
            this.addVisit();
        },
        onReachBottom: function () {
            const self = this;
            this.reset = false;
            if (self.args || self.load) return;
            self.load = true;
            let page = self.page + 1;
            self.$request({
                url: self.$api.mch.goods,
                data: {
                    page: page,
                    mch_id: self.mch_id,
                    sort: self.sort,
                    sort_type: self.sort_type,
                    mch_status: 2,
                    cat_id: self.cat_id,
                }
            }).then(info => {
                if (info.code === 0) {
                    let goods_list;
                    if (self.sort === 5) {
                        goods_list = self.formatList(self.goods_list, info.data.list);
                    } else {
                        goods_list = self.goods_list.concat(info.data.list);
                    }
                    [self.page, self.args, self.goods_list] = [page, info.data.list.length === 0, goods_list];
                }
                self.load = false;
            });
        },
        // #ifdef MP
        onShareAppMessage () {
            return this.$shareAppMessage({
                title: this.detail.store.name,
                path: '/plugins/mch/shop/shop',
                params: {
                    mch_id: this.mch_id,
                }
            });
        },
        // #endif
        methods: {
            goodsSearch() {
                uni.navigateTo({url: '/pages/search/search?mch_id=' + this.mch_id});
            },
            navCat() {
                uni.navigateTo({url: '/plugins/mch/cat/cat?mch_id=' + this.mch_id});
            },
            navigateSummary() {
                uni.navigateTo({url: `/plugins/mch/summary/summary?mch_id=` + this.mch_id});
            },
            navigateCs() {
                uni.navigateTo({url: `/pages/web/web?url=` + this.mch_setting.web_service_url});
            },
            getOption() {
                const self = this;
                self.$request({
                    url: self.$api.mch.setting,
                }).then(info => {
                    if (info.code === 0) {
                        self.is_service = info.data.setting.is_service;
                    }
                })
            },

            loadShop() {
                const self = this;

                self.$showLoading();
                self.$request({
                    url: self.$api.mch.detail,
                    data: {
                        id: self.mch_id
                    }
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        [self.detail, self.mch_setting] = [info.data.detail, info.data.mchSetting];
                        uni.setNavigationBarTitle({
                            title: self.detail.store.name,
                        });
                    }
                }).catch(info => {
                    self.$hideLoading();
                })
            },

            addVisit() {
                const self = this;
                self.$request({
                    url: self.$api.mch.visit,
                    method: "POST",
                    data: {
                        mch_id: self.mch_id
                    }
                }).then(info => {
                })
            },

            getGoods: function () {
                const self = this;
                self.$showLoading();
                self.$request({
                    url: self.$api.mch.goods,
                    data: {
                        page: 1,
                        mch_id: self.mch_id,
                        sort: self.sort,
                        sort_type: self.sort_type,
                        mch_status: 2,
                        cat_id: self.cat_id,
                    }
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        self.goods_list = info.data.list;
                    }
                }).catch(info => {
                    self.$hideLoading();
                })
            },

            //TODO
            changeStyle: function (sort) {
                let old_sort = this.sort;
                if (old_sort === 3 && sort === 3) {
                    this.sort_type = this.sort_type ? 0 : 1;
                }
                this.reset = true;
                [this.sort, this.goods_list, this.page, this.args, this.cat_id, this.goods_list] = [sort, [], 1, false, 0,[]];
                this.getGoods();
            },

            tabChange: function (e) {
                this.reset = true;
                [this.sort, this.tab, this.page, this.args, this.cat_id, this.goods_list] = [e, e, 1, false, 0, []];
                this.getGoods();
            },

            //KfModel
            copyInfo() {
                this.$utils.uniCopy({
                    data: this.detail.wechat,
                    success(){
                        //#ifndef MP-WEIXIN
                        uni.showToast({ title: '复制成功'});
                        // #endif
                    }
                });
            },

            callPhone() {
                uni.makePhoneCall({
                    phoneNumber: this.detail.store.mobile
                })
            },

            openKfModal() {
                this.shopKf = true;
            },

            closeKfModal() {
                this.shopKf = false;
            },
            formatList: function (oldArray, addArray) {
                if (!addArray.length) {
                    return odlArray;
                }
                let newList, list;
                let end = oldArray.pop();
                let start = addArray.shift();
                if (end.label === start.label) {
                    end.goods_list = end.goods_list.concat(start.goods_list);
                    list = end;
                } else {
                    oldArray = oldArray.concat(end);
                    list = start;
                }
                newList = oldArray.concat(list);
                newList = newList.concat(addArray);
                return newList;
            }
        }
    }
</script>

<style scoped lang="scss">
    .shop {
        width: 100%;

        .shop-head {
            height: #{200rpx};
            width: 100%;
            position: relative;

            .tt-bg {
                background: rgba(0, 0, 0, .3);
                height: 100%;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }

            .black {
                height: 100%;
                width: 100%;
            }
        }
        .shop-pic {
            height: 100%;
            width: 100%;
        }

        .shop-summary {
            position: absolute;
            top: #{74rpx};
            left: 0;
            width: 100%;
            color: #FFFFFF;
            font-size: #{24rpx};

            .icon-pic {
                border-radius: #{8rpx};
                height: #{80rpx};
                width: #{80rpx};
                margin: 0 #{24rpx};
                display: block;
            }

            .shop-name {
                margin-bottom: #{20rpx};
                max-width: #{520rpx};
            }

            .shop-goods {
                font-size: #{24rpx};
            }

            .shop-goods text:first-child {
                margin-right: #{32rpx};
            }

            .kf {
                margin-right: #{50rpx};

                .icon-kf {
                    height: #{40rpx};
                    width: #{40rpx};
                    margin-bottom: #{8rpx};
                    background-image: url("./../image/shop-kf.png");
                    background-repeat: no-repeat;
                    background-size: 100% auto;
                }
            }
        }

        .shop-tab {
            height: #{77rpx};
            background: #ffffff;
            font-size: #{28rpx};
            color: #666666;
            border-radius: #{16rpx};
            position: relative;
            top: #{-18rpx};
            margin: 0 #{24rpx} #{-18rpx} #{24rpx};

            .shop-search {
                width: #{136rpx};
                height: #{40rpx};
                border-right: 1px solid #E2E2E2;
            }

            .shop-text-active {
                color: #ff4544;
            }

            .shop-tab-active {
                height: #{4rpx};
                width: #{30rpx};
                border-radius: #{2rpx};
                position: absolute;
                bottom: #{8rpx};
            }

            > view {
                height: 100%;
            }

            icon {
                height: #{48rpx};
                width: #{48rpx};
                display: block;
                background-size: 100% auto;
                background-repeat: no-repeat;
            }

            .active {
                border-bottom: #{1rpx} solid;
            }

            .icon-search {
                height: #{40rpx};
                width: #{40rpx};
                background-image: url("../image/search.png");
            }

            .icon-home {
                background-image: url("./../image/shop-home.png");
            }



            .icon-all {
                background-image: url("./../image/shop-all.png");
            }



            .icon-new {
                background-image: url("./../image/shop-new.png");
            }



            .icon-summary {
                background-image: url("./../image/shop-summary.png");
            }
        }

        .shop-home {
            /*height: #{80rpx};
            line-height: #{80rpx};*/
            line-height: 1;
            padding: #{32rpx} #{24rpx} #{28rpx - 18rpx} #{24rpx};
            width: 100%;
            font-size: #{28rpx};
            color: #353535;
        }

        .shop-all {
            /*height: #{88rpx};*/
            font-size: #{26rpx};
            line-height: 1;
            color: #353535;
            padding: #{32rpx} #{25rpx} #{32rpx - 14rpx} #{25rpx};

            .icon-cat {
                background-repeat: no-repeat;
                background-size: 100% 100%;
                height: #{20rpx};
                width: #{26rpx};
                margin-left: #{12rpx};
                background-image: url("./../image/shop-cat.png");
            }

            .active {
                color: #ff4544;
            }

            .icon-price-plus {
                background-repeat: no-repeat;
                background-size: 100% 100%;
                height: #{19rpx};
                width: #{12rpx};
                margin-left: #{12rpx};
                background-image: url("./../image/shop-price-plus.png");
            }

            .icon-price-less {
                background-repeat: no-repeat;
                background-size: 100% 100%;
                height: #{19rpx};
                width: #{12rpx};
                margin-left: #{12rpx};
                background-image: url("./../image/shop-price-less.png");
            }

            .icon-price-default {
                background-repeat: no-repeat;
                background-size: 100% 100%;
                height: #{19rpx};
                width: #{12rpx};
                margin-left: #{12rpx};
                background-image: url("../../../static/image/icon/price-sort-default.png");
            }
        }

        .shop-new {
            margin-top: #{40rpx};
            margin-bottom: #{24rpx};

            .line {
                height: #{1px};
                width: #{260rpx};
                margin: 0 #{28rpx};
                background: #cdcdcd;
            }

            .label {
                font-size: #{22rpx};
                color: #999999;
            }
        }
    }

    .act-modal {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 2001;
        transition: 200ms;

        .show {
            visibility: visible;
            opacity: 1;
            -webkit-animation-name: fadeIn; /*动画名称*/
            -webkit-animation-duration: 0.25s; /*动画持续时间*/
            -webkit-animation-iteration-count: 1; /*动画次数*/
            -webkit-animation-delay: 0s; /*延迟时间*/
        }

        .act-modal-bg {
            background: rgba(0, 0, 0, 0.5);
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .act-modal-pic {
            background: rgba(0, 0, 0, 0.25);
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }
    }

    .shop-model {
        position: relative;
        color: #353535;
        width: #{620rpx};
        background: #ffffff;
        border-radius: #{16rpx};
        text-align: center;

        > view:last-child {
            margin-bottom: #{16rpx};
        }

        .kf {
            margin: #{40rpx} 0;
            font-size: #{32rpx};
        }

        > image {
            position: absolute;
            right: #{27rpx};
            top: #{27rpx};
            width: #{35rpx};
            height: #{35rpx};
        }

        .shop-info {
            height: #{80rpx};
            width: #{360rpx};
            margin-bottom: #{24rpx};
            border: 1px solid #cdcdcd;
            border-radius: #{40rpx};
            color: #666666;
            font-size: #{28rpx};
        }

        .shop-info image {
            height: #{32rpx};
            width: #{32rpx};
            margin-right: #{16rpx};
        }
    }

    .shop-tab-1,
    .shop-tab-5 {
        margin-top: #{120rpx};
    }

    .shop-tab-1 .shop-tab,
    .shop-tab-5 .shop-tab {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
    }


    .shop-tab-2 {
        margin-top: #{95rpx};
    }

    .shop-tab-2 .shop-all {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
        border-bottom: #{1rpx} solid #e3e3e3;
    }
    .icon-default {
        background-color: #666666;
    }
</style>