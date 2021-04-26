<template>
    <app-layout>
        <view class="top">
            <view class="dir-left-nowrap box">
                <input type="text" class="box-grow-1 input" placeholder="请输入内容搜索" confirm-type="搜索"
                       @confirm="searchList"
                       v-model="keyword">
                <view class="close-tip" @click="clear">
                    <image class="search-close" v-if="keyword" src="/static/image/icon/delete-yuan.png"></image>
                </view>
                <view class="box-grow-0 cross-center" @click="searchList">搜索</view>
            </view>
        </view>

        <view class="hot" v-show="isSearch">
            <!-- 历史记录 -->
            <view class="history">
                <view class="dir-left-nowrap cross-center title">
                    <view class="box-grow-1">历史搜索</view>
                    <image src="/static/image/icon/delete.png" class="box-grow-0"
                           @click="deleteHistory"></image>
                </view>
                <view class="dir-left-wrap list">
                    <view class="dir-left-wrap">
                        <view v-for="(line, index) in historyList" :key="index"
                              class="dir-left-wrap box-grow-0">
                            <view class="box-grow-0 cross-center item"
                                  @click="historyClick(line.keyword)">
                                <view class="t-omit" style="max-width: 650rpx">{{ line.keyword }}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <template v-if="!isSearch">
            <scroll-view class="auto-tab" scroll-x
                         :scroll-into-view="'type' + (tabCurrentIndex >= 2 ? tabCurrentIndex - 2 : 0)">
                <view class="auto-item" v-for="(item, index) in typeList" :key="index">
                    <view class="auto-tab-item cross-center" :id="'type' + index"
                          :key="index"
                          :style="{'color': tabCurrentIndex == index ? getTheme.color: ''}"
                          :class="tabCurrentIndex == index ? 'current-type' : ''"
                          @click="tabClick(index)">{{ item.name }}
                    </view>
                </view>
            </scroll-view>
            <view class="empty"></view>
            <view style="margin-top: 100rpx">
                <app-special-topic-list :cat-show="false" :topic-list="list"></app-special-topic-list>
            </view>
        </template>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from "vuex";
    import appSpecialTopicList from "../../components/page-component/app-special-topic/app-special-topic-list.vue";

    let page = 1;
    let search = {};
    let is_no_more = false;
    let is_loading = false;
    export default {
        name: "list",
        components: {
            appSpecialTopicList,
        },
        data() {
            return {
                list: [],
                typeList: [],
                tabCurrentIndex: 0,
                KEY: '_TOPIC_SEARCH_DATA',
                historyList: [],
                keyword: '',
                isSearch: false,
            };
        },
        computed: {
            ...mapState({
                bar_title: state => state.mallConfig.bar_title,
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
        },
        watch: {
            keyword: {
                handler(n, o) {
                    if (n !== o) {
                        this.isSearch = true;
                    }
                },
                immediate: true,
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            page = 1;
            is_no_more = false;
            is_loading = false;
            if (typeof options.type != 'undefined') {
                search.type = options.type;
            }
            this.loadData();
            this.loadType();
        },
        onReachBottom() {
            if (is_no_more || this.isSearch) {
                return;
            }
            this.loadData();
        },
        // #ifdef MP
        onShareAppMessage() {
            let route = this.$platDiff.route();
            let title = '专题列表';
            for (let i in this.bar_title) {
                if (this.bar_title[i].value == route) {
                    title = this.bar_title[i].new_name;
                    break;
                }
            }
            return this.$shareAppMessage({
                title: title,
                path: '/pages/topic/list',
            });
        },
        // #endif
        methods: {
            historyClick(keyword) {
                this.keyword = keyword.trim();
                this.searchList();
            },
            setHistory() {
                let historyList = this.getHistory();
                let keyword = this.keyword.trim();

                if (!keyword) {
                    return;
                }
                historyList.forEach((item, index) => {
                    if (item.keyword === keyword) historyList.splice(index, 1);
                });
                historyList.unshift({
                    keyword: keyword,
                });
                if (historyList.length > 20) historyList.pop();
                this.historyList = historyList;
                this.$storage.setStorageSync(this.KEY, historyList);
            },
            getHistory() {
                let historyList = this.$storage.getStorageSync(this.KEY);
                if (!historyList) historyList = [];
                return historyList;
            },
            deleteHistory() {
                let self = this;
                uni.showModal({
                    content: '确认删除全部历史记录？',
                    success: function (res) {
                        if (res.confirm) {
                            self.$storage.removeStorageSync(self.KEY);
                            self.historyList = [];
                        }
                    }
                });
            },
            clear() {
                uni.hideKeyboard()
                this.keyword = '';
            },
            searchList() {
                page = 1;
                this.keyword = this.keyword.trim();
                this.loadData();
            },
            loadData() {
                if (is_loading) {
                    return;
                }
                this.$showLoading();
                is_loading = true;
                search.page = page;
                this.setHistory();
                this.$request({
                    url: this.$api.topic.list,
                    data: Object.assign({}, {keyword: this.keyword}, search)
                }).then(response => {
                    is_loading = false;
                    this.isSearch = false;
                    this.historyList = this.getHistory();
                    this.$hideLoading();
                    if (response.code === 0) {
                        if (page === 1) {
                            this.list = [];
                        }
                        if (response.data.list.length > 0) {
                            this.list = this.list.concat(response.data.list);
                            page++;
                        } else {
                            is_no_more = true;
                        }
                    } else {

                    }
                }).catch(e => {
                    this.$hideLoading();
                    is_loading = false;
                });
            },
            loadType() {
                this.$request({
                    url: this.$api.topic.type,
                }).then(response => {
                    if (response.code === 0) {
                        if (response.data.list.length > 0) {
                            let list = [
                                {
                                    id: 0,
                                    name: '全部'
                                },
                                {
                                    id: -1,
                                    name: '精选'
                                }
                            ];
                            this.typeList = list.concat(response.data.list);
                            for (let i in this.typeList) {
                                if (this.typeList[i].id == search.type) {
                                    this.tabCurrentIndex = i;
                                    break;
                                }
                            }
                        }
                    } else {

                    }
                }).catch(e => {
                    is_loading = false;
                });
            },
            tabClick(index) {
                page = 1;
                is_no_more = false;
                let type = this.typeList[index].id;
                this.tabCurrentIndex = index;
                search = {
                    page: page,
                    type: type
                };
                this.loadData();
            }
        }
    }
</script>

<style scoped lang="scss">
    .auto-tab {
        position: fixed;
        top: 100#{rpx};
        left: 0;
        background-color: #ffffff;
        z-index: 1500;
        height: #{88rpx};
        width: 100%;
        white-space: nowrap;
        padding: 0 #{32rpx};
        border-bottom: #{1rpx} solid #e2e2e2;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
    }

    .auto-item {
        display: inline-block;
        height: 84upx;
    }

    .auto-tab-item {
        margin-right: #{60rpx};
        background-color: #ffffff;
        height: 100%;
    }

    .auto-tab-item.current-type {
        border-bottom: #{4rpx} solid;
    }

    .empty {
        height: #{88+16rpx};
        width: 100%;
        background-color: #f7f7f7;
    }

    .top {
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 15;
        padding: #{20rpx} #{24rpx};
        background-color: #efeff4;
        font-size: $uni-font-size-import-two;
        color: $uni-general-color-one;

        .input {
            background-color: #ffffff;
            border-radius: #{50rpx 0 0 50rpx};
            padding: 0 #{32rpx};
            font-size: $uni-font-size-general-one;
            height: #{64rpx};
        }

        .box {
            position: relative;

            .close-tip {
                width: #{64rpx};
                height: #{64rpx};
                background-color: #ffffff;
                border-radius: #{0 50rpx 50rpx 0};
                margin-right: #{20rpx};
            }

            .search-close {
                width: #{32rpx};
                height: #{32rpx};
                border-radius: 50%;
                margin: #{16rpx};
            }
        }
    }

    .history {
        padding: #{36rpx} #{24rpx};
        border-radius: #{16rpx} #{16rpx} 0 0;
        background-color: #ffffff;
        margin-top: #{110rpx};
        min-height: calc(100vh - #{110rpx});
        font-size: $uni-font-size-general-one;

        .title {
            padding-bottom: #{24rpx};
            color: $uni-general-color-one;

            image {
                width: #{28rpx};
                height: #{34rpx};
                display: block;
            }
        }

        .list {
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
</style>