<template>
    <app-layout>
        <view class="list-head">
            <view class="dir-left-nowrap cross-center mch-list-input">
                <view class="box-grow-1 box dir-left main-center cross-center">
                    <view v-if="toSearch" class="search-content">
                        <input class="input"
                               :value="keyword"
                               @input="bindInput"
                               @confirm="bindConfirm"
                               @blur="beSearch"
                               confirm-type="search"
                               :focus="getFocus"/>
                        <view v-if="keyword.length" @click="cancelPrint" class="main-center cross-center close-word">
                            <icon class="icon-close" type></icon>
                        </view>
                    </view>
                    <view v-else @click="beSearch" class="main-center search-content cross-center">
                        <icon class="icon-search" type></icon>
                        <text class="search-text">搜索</text>
                    </view>
                </view>
                <view @click="changeCat" class="cross-center">
                    <icon class="icon-cats" type></icon>
                </view>
            </view>

            <view v-if="catModel" class="list-cat-model dir-left-wrap cross-center">
                <view v-for="(v,k) in cat_list" :key="k">
                    <view @click="cat(v.id)">
                        <view class="cat-name">{{v.name}}</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="gap"></view>
        <view class="no-content" v-if="!list || list.length === 0">暂无店铺记录</view>
        <app-good-shop-recommendation v-else :theme="getTheme" :coupon_req="true" :mch_list="list" :show-goods="true"></app-good-shop-recommendation>
    </app-layout>
</template>
<script>
    import appGoodShopRecommendation
        from '../../../components/page-component/app-good-shop-recommendation/app-good-shop-recommendation.vue';
    import {mapGetters, mapState} from "vuex";

    export default {
        name: "list",
        components: {appGoodShopRecommendation},
        data() {
            return {
                catModel: false,
                toSearch: false,
                list: [],
                cat_list: [],
                page: 1,
                keyword: '',
                mch_common_cat_id: 0,
                load: false,
                args: false,
                latitude: 0,
                longitude: 0,
                page_loading: false,
                getFocus: false
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.getLocation();
            this.getCats();
        },

        onReachBottom: function () {
            const self = this;
            if (self.args || self.load)
                return;
            self.load = true;
            let page = self.page + 1;

            self.$request({
                url: self.$api.mch.index,
                data: {
                    keyword: self.keyword,
                    latitude: self.latitude,
                    longitude: self.longitude,
                    mch_common_cat_id: self.mch_common_cat_id,
                    page: page,
                }
            }).then(info => {
                if (info.code === 0) {
                    [self.page, self.args, self.list] = [page, info.data.list.length === 0, self.list.concat(self.dataMap(info.data.list))];
                }
                self.load = false;
            });
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: `好店推荐`,
                path: '/plugins/mch/list/list',
                params: {}
            });
        },
        // #endif
        methods: {
            dataMap(list) {
                if (!list)
                    return;
                list.forEach(item => {
                    item.pic_url = item.store.cover_url;
                    item.name = item.store.name;
                    item.goods_num = item.goods_count;
                    item.order_num = item.order_goods_count;
                    item.goodsList = item.goods;
                    item.goodsList.forEach(item1 => {
                        item1.picUrl = item1.goodsWarehouse.cover_pic;
                    })
                });
                return list;
            },
            getLocation() {
                const self = this;
                // #ifdef MP
                uni.getLocation({
                    type: 'wgs84',
                    success(res) {
                        [self.latitude, self.longitude] = [res.latitude, res.longitude];
                    },
                    complete(res) {
                        console.warn(res);
                        self.loadData();
                    }
                })
                // #endif
                // #ifdef H5
                this.$jwx.getLocation({
                    success(res) {
                        [self.latitude, self.longitude] = [res.latitude, res.longitude];
                        self.loadData();
                    },
                    fail() {
                        self.loadData();
                    }
                });
                // #endif
            },
            loadData() {
                const self = this;
                self.$showLoading();
                self.$request({
                    url: self.$api.mch.index,
                    data: {
                        keyword: self.keyword,
                        latitude: self.latitude,
                        longitude: self.longitude,
                        mch_common_cat_id: self.mch_common_cat_id,
                    }
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        self.list = self.dataMap(info.data.list);
                    }
                }).catch(info => {
                    self.$hideLoading();
                })
            },
            //分类处理
            getCats() {
                const self = this;
                self.$request({
                    url: self.$api.mch.category,
                }).then(info => {
                    self.cat_list = info.data.list;
                });
            },
            navShop(mch_id) {
                uni.navigateTo({url: `/plugins/mch/shop/shop?mch_id=` + mch_id});
            },
            navGoods(mch_id, goods_id) {
                uni.navigateTo({url: `/plugins/mch/goods/goods?id=` + goods_id + `&mch_id=` + mch_id});
            },

            beSearch: function (e) {
                if (this.keyword.length === 0) {
                    this.toSearch = !this.toSearch;
                    this.getFocus = this.toSearch;
                }
            },
            //搜索
            bindConfirm() {
                [
                    this.page,
                    this.mch_common_cat_id,
                    this.catModel,
                    this.list
                ] = [
                    1,
                    0,
                    false,
                    []
                ]
                this.loadData();
            },

            cat(id) {
                [this.mch_common_cat_id, this.list, this.page, this.catModel] = [id, [], 1, false];
                this.loadData();
            },

            changeCat() {
                this.catModel = !this.catModel;
            },

            bindInput: function (e) {
                this.keyword = e.detail.value;
            },

            cancelPrint() {
                this.keyword = '';
                this.toSearch = false;
                this.bindConfirm();
            },
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
        },
    }
</script>
<style scoped lang="scss">
    .search-content {
        height: #{56rpx};
        border-radius: #{28rpx};
        background: #fff;
        position: relative;
        width: 100%;
        margin-left: #{24rpx};

        .input {
            height: #{56rpx};
            border-radius: #{28rpx};
            color: #353535;
            width: 90%;
            background-color: #ffffff;
        }

        .icon-search {
            background-image: url("../../../static/image/icon/icon-search.png");
            height: #{24rpx};
            width: #{24rpx};
            background-size: 100% auto;
            margin-right: #{10rpx};
            background-repeat: no-repeat;
        }
    }

    .search-text {
        color: #b2b2b2;
        font-size: #{24rpx};
        margin: 0 #{5rpx};
    }

    .list-head {
        position: fixed;
        top: 0;
        z-index: 1;
        width: 100%;
    }

    .no-content {
        color: #888;
        padding: #{100rpx} 0 0 0;
        text-align: center;
    }

    .mch-list-input {
        height: #{88rpx};
        padding: 0 #{24rpx};
        background: #EFEFF4;


        .box {
            margin-right: #{24rpx};
            height: #{56rpx};
            border-radius: #{28rpx};
            background: #FFFFFF;
            input {
                border-radius: #{28rpx};
            }
        }

        .icon-cats {
            background-image: url("./../image/list-cat.png");
            background-repeat: no-repeat;
            background-size: 100% auto;
            height: #{30rpx};
            width: #{38rpx};
        }

        .close-word {
            height: #{56rpx};
            width: #{70rpx};
            position: absolute;
            right: 0;
            top: 0;
            z-index: 20;

            .icon-close {
                background-image: url("../../../static/image/icon/icon-close.png");
                background-repeat: no-repeat;
                background-size: 100% auto;
                height: #{25rpx};
                width: #{25rpx};
            }
        }
    }

    .list-cat-model {
        padding-top: #{12rpx};
        padding-bottom: #{12rpx};
        padding-left: #{20rpx};
        background: #f7f7f7;

        .cat-name {
            color: #353535;
            font-size: #{24rpx};
            border: #{1rpx} solid #e7e7e7;
            border-radius: #{28rpx};
            line-height: #{56rpx};
            height: #{56rpx};
            background: #ffffff;
            padding: 0 #{24rpx};
            margin: #{10rpx} #{12rpx} #{10rpx} #{12rpx};
        }
    }

    .gap {
        height: #{88rpx};
    }

    .list-shop {
        margin: #{10rpx} #{20rpx};
        width: #{710rpx};
        background: #fff;
        border-radius: #{16rpx};
    }

    .list-shop .shop-info {
        padding-right: #{24rpx};
    }

    .list-shop .distance {
        align-self: flex-start;
        padding-top: #{36rpx};
        font-size: #{24rpx};
        color: #999999;
        padding-right: #{50rpx};
    }

    .list-shop .list-shop-icon {
        border-radius: #{8rpx};
        height: #{100rpx};
        width: #{100rpx};
        margin: #{24rpx};
    }

    .list-shop .name {
        color: #353535;
        font-size: #{28rpx};
        margin-bottom: #{24rpx};
    }

    .list-shop .shop {
        font-size: #{24rpx};
        color: #999;
    }

    .list-shop .goods-num {
        padding-right: #{32rpx};
    }

    .list-shop .goods {
        padding-bottom: #{24rpx};
        margin: 0 #{16rpx};
    }

    .list-shop .goods-box {
        margin: 0 #{8rpx};
    }

    .list-shop .goods-info {
        position: relative;
        height: #{210rpx};
        width: #{210rpx};
    }

    .list-shop .goods-info view {
        background: #fff;
        font-size: #{28rpx};
        opacity: 0.8;
        width: #{210rpx};
        color: #ff4544;
        height: #{50rpx};
        position: absolute;
        bottom: 0;
    }

    .list-shop .goods-info image {
        height: 100%;
        width: 100%;
    }
</style>