<template>
    <app-layout>
        <view class="search">
            <view class="search-input dir-left-nowrap cross-center main-center">
                <input type="text" class="input" v-model="keyword" @confirm="search" focus>
                <text class="search-text" @click="search">搜索</text>
                <image class="delete" @click="deleteKeyword" v-if="keyword.length > 0" src="/static/image/icon/delete-yuan.png"></image>
            </view>

            <view v-if="!isSearch && historyList.length > 0" class="history">
                <view class="dir-left-nowrap cross-center title">
                    <view class="box-grow-1">历史搜索</view>
                    <image src="/static/image/icon/delete.png" class="box-grow-0" @click="deleteHistory"></image>
                </view>
                <view class="dir-left-wrap history-list">
                    <view v-for="(item, index) in historyList"
                          class="box-grow-0 cross-center item"
                          @click="historyClick(item.keyword)"
                          :key="index"
                    >{{item.keyword}}
                    </view>
                </view>
            </view>
            <view class="list">
                <view class="item dir-left-nowrap" v-for="(item) in list" :key="item.id" @click="navigator('/plugins/pick/detail/detail?goods_id=' + item.id)">
                    <view v-if="item.goods_stock == 0" class="out-dialog">
                        <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                    </view>
                    <image class="image" :src="item.cover_pic"></image>
                    <view class="content dir-top-nowrap main-between">
                        <text class="name t-omit-two">{{item.name}}</text>
                        <view class="information dir-left-nowrap main-between cross-bottom">
                            <view class="num">
                                <view class="value">
                                    <text class="price" :style="{'color': getTheme.color}">￥{{item.price}}</text>
                                    <text class="original_price">￥{{item.original_price}}</text>
                                </view>
                                <text class="sales">{{item.sales}}</text>
                            </view>
                            <view>
                                <view class="go-button" :style="{'background-color': getTheme.background}">去凑单</view>
                            </view>
                        </view>
                    </view>
                </view>
                <view v-if="isSearch" class="goods-list">
                    <template v-if="list.length <= 0">
                        <view class="main-center no-result">
                            <view class="dir-left-nowrap cross-center">
                                <image class="box-grow-0 empty" src="/static/image/icon/empty.png"></image>
                                <view class="box-grow-1">
                                    <view>抱歉，没有相关商品</view>
                                </view>
                            </view>
                        </view>
                    </template>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from "vuex";

    export default {
        name: 'search',

        data() {
            return {
                list: [],
                keyword: '',
                activity: {},
                historyList: [],
                isSearch: false,
                page: 1
            }
        },

        onLoad() { this.$commonLoad.onload();
            this.historyList = this.getHistory();
        },
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img.mall,
                appSetting: state => state.mallConfig.mall.setting,
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
        },
        onReachBottom() {
            this.page++;
            this.getList();
        },

        methods: {
            navigator(str) {
                uni.navigateTo({
                    url: str
                });
            },

            search() {
                let keyword = this.keyword;
                if (keyword === '') return;
                this.keyword = keyword.trim();
                this.reset();
            },
            reset() {
                this.page = 1;
                this.getGoodsList();
            },

            async getList() {
                const e = await this.$request({
                    url: this.$api.pick.goods_list,
                    method: 'get',
                    data: {
                        keyword: this.keyword,
                        page: this.page,
                    }
                });
                if (e.code === 0) {
                    let { list} = e.data;
                    this.list.push(...list);
                }
            },

            async getGoodsList() {
                const e = await this.$request({
                    url: this.$api.pick.goods_list,
                    method: 'get',
                    data: {
                        keyword: this.keyword,
                        page: this.page,
                    }
                });
                if (e.code === 0) {
                    let { bg_url, list, form, activity } = e.data;
                    this.isSearch = true;
                    this.list = list;
                    this.background = bg_url;
                    this.form = form;
                    this.activity = activity;
                    this.setHistory();
                }
            },
            setHistory() {
                let historyList = this.getHistory();
                let keyword = this.keyword.trim();

                historyList.forEach((item, index) => {
                    if (item.keyword === keyword) historyList.splice(index, 1);
                });
                historyList.push({
                    keyword: keyword,
                });
                if (historyList.length > 20) historyList.shift();
                this.historyList = historyList;
                this.$storage.setStorageSync("SEARCH_HISTORY_LIST", historyList);
            },
            getHistory() {
                let historyList = this.$storage.getStorageSync('SEARCH_HISTORY_LIST');
                if (!historyList) historyList = [];
                return historyList;
            },

            deleteHistory() {
                this.$storage.removeStorageSync("SEARCH_HISTORY_LIST");
                this.historyList = [];
            },

            cancel() {
                this.isSearch = false;
                this.keyword = '';
                this.list = [];
            },

            historyClick(keyword) {
                this.keyword = keyword.trim();
                this.reset();
            },

            deleteKeyword() {
                this.keyword = '';
            }
        },

        watch: {
            keyword: {
                handler(v) {
                    if (v == '') {
                        this.cancel();
                    }
                },
                immediate: true,
            }
        },
    }
</script>

<style scoped lang="scss">
    .search {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .search-input {
        width: #{750upx};
        height: #{105upx};
        background-color: #efeff4;
        position: fixed;
        top: 0;
    }
    .input {
        height: #{64upx};
        width: #{620upx};
        background-color: #ffffff;
        border-radius: #{36upx};
        padding: #{0 36upx};
    }
    .search-text {
        font-size: #{32upx};
        margin-left: #{20upx};
    }
    .list {
        padding-bottom: #{96upx};
        margin-top: #{105upx};
    }

    .item {
        padding: #{24upx};
        border-bottom: #{1upx} solid #eeeeee;
        background-color: #ffffff;
        position: relative;
        .out-dialog {
            width: #{220rpx};
            height: #{220rpx};
            border-radius: #{16rpx};
            position: absolute;
            top: #{24rpx};
            left: #{24rpx};
            z-index: 10;
            background-color: rgba(0,0,0,.5);
            image {
                width: #{220rpx};
                height: #{220rpx};
                border-radius: #{16rpx};
            }
        }
    }

    .image {
        width: #{220upx};
        height: #{220upx};
        border-radius: #{16upx};
        flex-shrink: 0;
    }

    .content {
        width: #{478upx};
        margin-left: #{24upx};
        height: #{228upx};
    }
    .name {
        font-size: #{28upx};
        color: #353535;
    }


    .generate {
        position: fixed;
        bottom: 0;
        height: #{96upx};
        width: #{750upx};
        background-color: #ffffff;
        border-top: #{1upx} solid #e2e2e2;
    }
    .generate-img {
        width: #{34upx};
        height: #{34upx};
        margin-right: #{7.5upx};
    }

    .generate-text {
        margin-left: #{7.5upx};
        font-size: #{32upx};
        color: #ff4d4c;
    }

    .information {
        margin-bottom: #{12upx};
    }

    .num {
        margin-bottom: #{8upx};
    }

    .sales {
        font-size: #{24upx};
        color: #999999;
        line-height: 1;
    }

    .value {
        margin-bottom: #{18upx};
        line-height: 1;
    }
    .price {
        font-size: #{32upx};
        line-height: 1;
    }
    .original_price {
        text-decoration:line-through;
        font-size: #{24upx};
        line-height: 1;
        color: #999999;
        margin-left: #{10upx};
    }
    .go-button {
        height: #{56upx};
        line-height: #{56upx};
        width: #{130upx};
        font-size: #{28upx};
        border-radius: #{28upx};
        text-align: center;
        color: #ffffff;
    }

    .history {
        padding: #{36rpx} #{24rpx};
        border-radius: #{16rpx} #{16rpx} 0 0;
        background-color: #ffffff;
        font-size: $uni-font-size-general-one;
        margin-top: #{105upx};

        .title {
            padding-bottom: #{24rpx};
            color: $uni-general-color-one;

            image {
                width: #{28rpx};
                height: #{34rpx};
                display: block;
            }
        }

        .history-list {
            .item {
                height: #{64rpx};
                background-color: #f7f7f7;
                padding: 0 #{20rpx};
                margin-right: #{20rpx};
                margin-bottom: #{16rpx};
                border-radius: #{32rpx};
            }
        }
    }

    .delete {
        width: #{32upx};
        height: #{32upx};
        position: absolute;
        right: #{122upx};
        top: #{36upx};
        border-radius: 50%;
        z-index: 1500;
    }
    .goods-list {
        .no-result {
            height: #{156rpx};
            padding: #{28rpx} 0;
            font-size: $uni-font-size-general-one;
            background-color: #ffffff;

            .empty {
                width: #{100rpx};
                height: #{100rpx};
                display: block;
                margin-right: #{40rpx};
            }
        }
    }
</style>