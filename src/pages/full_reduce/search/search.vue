<template>
    <app-layout>
       <view class="layout">
           <view class="search dir-left-nowrap main-between cross-center">
               <input class="input" :focus="true" confirm-type="search" maxlength="50" type="text" v-model="keyword" @blur="setRequest">
               <view class="icon" v-show="keyword.length>0" @click="empyt_search"></view>
               <text class="search-text" @click="setRequest">搜索</text>
           </view>
           <view class="storage" v-if="strong.length > 0 && !search">
               <view class="operating dir-left-nowrap main-between">
                   <text>历史搜索</text>
                   <view class="delete-icon" @click="setClearStorage"></view>
               </view>
               <view class="history-record dir-left-wrap">
                   <view class="item t-omit" v-for="(item, index) in strong" :key="index" @click="searchRequest(item)">
                       {{item}}
                   </view>
               </view>
           </view>

           <view class="product-list" v-if="loading && goods_list.length > 0">
               <app-product-list @routeGo="routeGo" :goods_list="goods_list" :theme="getTheme"></app-product-list>
           </view>
           <template v-else-if="goods_list.length === 0 && loading && search">
               <view class="no-empty main-center" >
                   <app-no-goods title="暂无满减商品" ></app-no-goods>
               </view>
           </template>
       </view>
    </app-layout>
</template>

<script>
    let strong = "FULL_REDUCE_SEARCH";
    import appProductList from '../../../components/page-component/app-product-list/app-product-list.vue';
    import {mapGetters, mapState} from 'vuex';
    import appNoGoods from "../../../components/page-component/app-no-goods/app-no-goods.vue";

    export default {
        name: "search",
        data() {
            return {
                keyword: '',
                strong: [],
                page: 1,
                goods_list: [],
                search: false,
                is_search: 0,
                loading: false
            }
        },

        onLoad() { this.$commonLoad.onload();
            if (!this.$storage.getStorageSync(strong)) {
                this.$storage.setStorageSync(strong, []);
            } else {
                this.strong = this.$storage.getStorageSync(strong);
            }
        },

        methods: {
            async request(bool) {
                const res = await this.$request({
                    url: this.$api.full_reduce.list,
                    method: 'get',
                    data: {
                        page: this.page,
                        keyword: this.keyword
                    },
                });
                this.loading = true;
                if (res.code === 0) {
                    if (bool) this.goods_list = [];
                    this.goods_list.push(...res.data.list);
                    this.page_count = res.data.pagination.page_count;
                    // this.dataProcessing(res.data);
                }
            },

            searchRequest(data) {
                this.search = true;
                this.goods_list = [];
                this.page = 1;
                this.keyword = data;
                this.request(1);
            },

            setRequest() {
                this.keyword = this.keyword.trim();
                if (this.keyword.match(/^[ ]*$/)) return;
                this.search = true;
                this.goods_list = [];
                this.request().then(() => {
                    let newStrong = this.$storage.getStorageSync(strong);
                    for (let i = 0; i < newStrong.length; i++) {
                        if (newStrong[i] === this.keyword) {
                            return;
                        }
                    }
                    newStrong.unshift(this.keyword);
                    if (newStrong.length > 15) {
                        newStrong = newStrong.slice(0, 15);
                    }
                    this.$storage.setStorageSync(strong, newStrong);
                });
            },

            routeGo(data) {
                // #ifndef MP-BAIDU
                if (data.video_url && this.getVideo == 1) {
                    // #ifdef MP
                    uni.navigateTo({
                        url: `/pages/goods/video?goods_id=${data.id}`
                    });
                    // #endif
                    // #ifdef H5
                    uni.navigateTo({
                        url: data.page_url,
                    });
                    // #endif
                } else {
                    uni.navigateTo({
                        url: data.page_url,
                    });
                }
                // #endif

                // #ifdef MP-BAIDU
                uni.navigateTo({
                    url: data.page_url,
                });
                // #endif
            },

            empyt_search() {
                this.goods_list = [];
                this.keyword = '';
                this.search = false;
                if (!this.$storage.getStorageSync(strong)) {
                    this.$storage.setStorageSync(strong, []);
                } else {
                    this.strong = this.$storage.getStorageSync(strong);
                }
            },

            setClearStorage() {
                this.$storage.removeStorageSync(strong);
                this.strong = [];
                this.$storage.setStorageSync(strong, []);
            }
        },

        components: {
            'app-product-list': appProductList,
            appNoGoods
        },

        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme'
            }),
            ...mapGetters('mallConfig', {
                getVideo: 'getVideo'
            }),
            ...mapState({
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            })
        },

        // 分页请求
        onReachBottom() {
            if (this.page < this.page_count) {
                this.page++;
                this.request();
            }
        },
    }
</script>

<style scoped lang="scss">
    .layout {
        position: absolute;
        top: 0;
        left: 0;
        width: 750upx;
        height: 100%;
        background-color: #ffffff;
    }
    .search {
        width: #{750upx};
        height: #{105upx};
        background-color: #efeff4;
        padding: #{0 24upx};
        position:fixed;
        top: 0;
        z-index: 1000;
    }

    .icon {
        width: #{32upx};
        height: #{32upx};
        border-radius: #{64upx};
        position: absolute;
        right: #{120upx};
        background-image: url("../../../static/image/icon/delete-yuan.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        z-index: 1000;
    }

    .input {
        width: #{620upx};
        height: #{65upx};
        background-color: #ffffff;
        border-radius: #{32.5upx};
        padding: #{0 35upx};
    }

    .search-text {
        font-size: #{30upx};
        color: #666666;
    }

    .storage {
        width: #{750upx};
        margin-top: 115upx;
        padding: #{0 25upx};
    }

    .operating {
        margin-top: #{34upx};
        text {
            font-size: #{26upx};
            color: #666666;
            line-height: 1;
        }
    }

    .delete-icon {
        width: #{28upx};
        height: #{32upx};
        background-image: url("../../../static/image/icon/delete.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        z-index: 1000;
    }

    .history-record {
        margin-top: #{25upx};
        max-height: 440upx;
        overflow: hidden;
        .item {
            height: #{64upx};
            line-height: #{64upx};
            font-size: #{26upx};
            padding: #{0 20upx};
            background-color: #f7f7f7;
            border-radius: #{32upx};
            margin-bottom: #{32upx};
            max-width: 700upx;
            margin-right: 24upx;
        }
    }
    .no-empty {
        width: 100%;
        margin-top: 280upx;
    }
    .product-list {
        margin-top: 115upx;
    }
</style>