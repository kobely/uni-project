<template>
    <app-layout>
        <view class="cross-center store-head">
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
        <view class="shop-list">
            <app-shop :list="list"></app-shop>
        </view>
    </app-layout>
</template>

<script>
import appShop from "../../components/page-component/app-shop/app-shop.vue";

export default {
    name: "store",
    components: {appShop},
    data() {
        return {
            getFocus: false,
            longitude: 0,
            latitude: 0,
            url: '',
            keyword: '',
            goods_id: 0,
            list: null,
            args: false,
            load: false,
            page: 1,
            toSearch: false,
        }
    },

    onLoad(options) { this.$commonLoad.onload(options);
        const self = this;
        if (options.book_id) {
            self.url = self.$api.book.store_list;
            self.goods_id = options.book_id
        } else {
            self.url = self.$api.store.list;
            self.goods_id = 0
        }

        //
        // self.longitude = '1';
        // self.latitude = '1';
        // self.loadData();
        // return;
        this.t(() => {
            // #ifdef MP
            uni.getLocation({
                success: function (res) {
                    self.longitude = res.longitude;
                    self.latitude = res.latitude;
                    self.loadData();
                },
                fail: function () {
                    uni.showToast({
                        title: '请开启手机位置权限',
                        icon: 'none',
                        duration: 1000,
                        success: function () {

                        }
                    });
                },
            });
            // #endif
            // #ifdef H5
            this.$jwx.getLocation({
                success(res) {
                    self.longitude = res.longitude;
                    self.latitude = res.latitude;
                    self.loadData();
                },
                fail: function () {
                    uni.showToast({
                        title: '请开启手机位置权限',
                        icon: 'none',
                        duration: 1000
                    });
                },
            })
            // #endif
        });

    },

    onPullDownRefresh: function () {
        const self = this;
        self.keyword = '';
        self.toSearch = false;
        self.page = 1;

        this.t(() => {
            // #ifdef MP
            uni.getLocation({
                success: function (res) {
                    self.longitude = res.longitude;
                    self.latitude = res.latitude;
                    self.loadData();
                },
                fail: function () {
                    uni.showToast({
                        title: '请开启手机位置权限',
                        icon: 'none',
                        duration: 1000,
                        success: function () {

                        }
                    });
                },
                complete: function () {
                    uni.stopPullDownRefresh();
                }
            });
            // #endif
            // #ifdef H5
            this.$jwx.getLocation({
                success(res) {
                    self.longitude = res.longitude;
                    self.latitude = res.latitude;
                    self.loadData();
                },
                fail: function () {
                    uni.showToast({
                        title: '请开启手机位置权限',
                        icon: 'none',
                        duration: 1000
                    });
                },
            })
            // #endif
        });
    },
    // #ifdef MP
    onShareAppMessage() {
        return this.$shareAppMessage({
            title: this.$children[0].navigationBarTitle,
            path: '/pages/store/store',
            params: {}
        });
    },
    // #endif
    onReachBottom: function () {
            const self = this;
            if (self.args || self.load)
                return;
            self.load = true;
            let page = self.page + 1;

            self.$request({
                url: self.url,
                data: {
                    page: page,
                    longitude: self.longitude,
                    latitude: self.latitude,
                    keyword: self.keyword,
                    goods_id: self.goods_id,
                }
            }).then(info => {
                if (info.code === 0) {
                    [self.page, self.args, self.list] = [page, info.data.list.length === 0, self.list.concat(self.forMatter(info.data.list))];
                }
                self.load = false;
            });
        },

        methods: {
            t(func) {
                // #ifdef MP-ALIPAY  || H5
                func();
                // #endif

                // #ifndef MP-ALIPAY || H5
                const scope = 'scope.userLocation';
                uni.authorize({
                    scope,
                    success(res) {
                        func();
                    },
                    fail(e) {
                        uni.showModal({
                            title: '提示',
                            content: '您好,请先授权地理位置权限',
                            showCancel: false,
                            success(res) {
                                if (res.confirm) {
                                    uni.openSetting({
                                        success(settingdata) {
                                            if (settingdata.authSetting[scope]) {
                                                func();
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                });
                // #endif
            },
            /*
             * update
             */
            forMatter(list) {
                list.forEach((v, k) => {
                    v.pic_url = v.cover_url;
                    let array = [];
                    for (let i = 0; i < v.score; i++) {
                        array.push(i);
                    }
                    v.score = array
                })
                return list;
            },
            //搜索
            bindConfirm: function (e) {
                this.loadData();
            },

            beSearch: function (e) {
                if (this.keyword.length === 0) {
                    this.toSearch = !this.toSearch;
                    this.getFocus = this.toSearch;
                }
            },

            cancelPrint() {
                this.keyword = '';
                this.toSearch = false;
                this.loadData();
            },

            bindInput: function (e) {
                this.keyword = e.detail.value;
            },

            loadData: function () {
                const self = this;

                self.$showLoading();
                self.$request({
                    url: self.url,
                    data: {
                        keyword: self.keyword,
                        longitude: self.longitude,
                        latitude: self.latitude,
                        goods_id: self.goods_id
                    },
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        self.list = self.forMatter(info.data.list);
                    }
                }).catch(() => {
                    self.$hideLoading();
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    .store-head {
        height: #{88rpx};
        width: 100%;

        .search-content {
            height: #{56rpx};
            border-radius: #{28rpx};
            background: #fff;
            position: relative;
            width: 100%;
            margin: 0 #{24rpx};
            padding-left: #{24rpx};

            .input {
                height: #{56rpx};
                border-radius: #{28rpx};
                color: #353535;
                width: 90%;
                background-color: #ffffff;
            }

            .icon-search {
                background-image: url("../../static/image/icon/icon-search.png");
                height: #{24rpx};
                width: #{24rpx};
                background-size: 100% auto;
                margin-right: #{10rpx};
                background-repeat: no-repeat;
            }

            .close-word {
                height: #{56rpx};
                width: #{70rpx};
                position: absolute;
                right: 0;
                top: 0;
                z-index: 20;

                .icon-close {
                    background-image: url("../../static/image/icon/icon-close.png");
                    background-repeat: no-repeat;
                    background-size: 100% auto;
                    height: #{25rpx};
                    width: #{25rpx};
                }
            }
        }

        .search-text {
            color: #b2b2b2;
            font-size: #{24rpx};
            margin: 0 #{5rpx};
        }

        .store-search {
            background-color: #ddd;
            border-radius: 0 #{10rpx} #{10rpx} 0;
            padding: 0 #{20rpx};
        }

        .store-icon {
            margin-bottom: #{10rpx};
            margin-right: #{10rpx};
        }
    }

    .shop-list {
        background: #FFFFFF;
    }
</style>