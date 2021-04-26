<template>
	<app-layout>
		<view class="search dir-left-nowrap main-between cross-center">
			<input class="input" type="text" v-model="keyword" focus @blur="setRequest" @confirm="setRequest" confirm-type="search">
			<view class="icon" v-show="keyword.length>0" @click="empyt_search"></view>
			<text class="search-text" @click="setRequest">搜索</text>
		</view>
		<view class="storage" v-if="strong.length > 0 && !search">
			<view class="operating dir-left-nowrap main-between">
				<text>历史搜索</text>
				<view class="delete-icon" @click="setClearStorage"></view>
			</view>
			<view class="history-record dir-left-wrap">
				<view class="item" v-for="(item, index) in strong" :key="index" @click="searchRequest(item)">
					{{item}}
				</view>
			</view>
		</view>
		
		<view class="product-list">
			<app-product-list @routeGo="routeGo" sign="gift" :goods_list="goods_list" :theme="theme"></app-product-list>
		</view>
		<view v-if="goods_list.length === 0 && !loading && search" class="page-width no-goods">
			<app-no-goods background="#f7f7f7"></app-no-goods>
		</view>
	</app-layout>
</template>

<script>
    let strong = "GIFT_SEARCH";
    import appProductList from '../../../components/page-component/app-product-list/app-product-list.vue';
	import appNoGoods from '../../../components/page-component/app-no-goods/app-no-goods.vue';
	import { mapState, mapGetters } from 'vuex';
    
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
				loading: true,
                goSearch: false
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
            async request() {
				this.loading = true;
				const res = await this.$request({
	                url: this.$api.gift.list,
	                method: 'get',
	                data: {
                        page: this.page,
                        keyword: this.keyword,
		                sign: ''
	                },
                });
                this.loading = false;
                if (res.code === 0) {

                    this.goods_list.push(...res.data.list);
                    // this.dataProcessing(res.data);
                }
            },

            searchRequest(data) {
                this.search = true;
                this.goods_list = [];
                this.page = 1;
                this.keyword = data;
                this.request();
            },

            // 处理数据
            dataProcessing(res) {
                for (let i = 0; i < res.list.length; i+=2) {
                    if (i+1 !== res.list.length) {
                        this.goods_list.push([res.list[i], res.list[i+1]]);
                    } else {
                        this.goods_list.push([res.list[i]]);
                    }
                }
                this.page_count = res.pagination.page_count;
            },

            setRequest() {
                if (this.keyword.match(/^[ ]*$/)) return;
                if (this.goSearch) return;
                this.goSearch = true;
                this.search = true;
                this.goods_list = [];
                this.request().then(() => {
                    let newStrong = this.$storage.getStorageSync(strong);
                    for (let i = 0; i < newStrong.length; i++) {
                    	if (newStrong[i] === this.keyword) {
							return;
						}
					}
					newStrong.push(this.keyword);
                    this.$storage.setStorageSync(strong, newStrong);
                    this.goSearch = false;
                });
            },

            routeGo(data) {
				// #ifndef MP-BAIDU
				if (data.video_url && this.getVideo == 1) {
				    // #ifdef MP
					uni.navigateTo({
						url: `/pages/goods/video?goods_id=${data.id}&sign=gift`
					});
					// #endif
                    // #ifdef H5
                    uni.navigateTo({
                        url: `/plugins/gift/goods/goods?${data.page_url.split('?')[1]}&is_search=1`,
                    });
                    // #endif
				} else {
					uni.navigateTo({
						url: `/plugins/gift/goods/goods?${data.page_url.split('?')[1]}&is_search=1`,
					});
				}
				// #endif

				// #ifdef MP-BAIDU
				uni.navigateTo({
					url: `/plugins/gift/goods/goods?${data.page_url.split('?')[1]}&is_search=1`,
				});
				// #endif
            },

            empyt_search() {
                this.goods_list = [];
                this.keyword = '';
                this.search = false;
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
            ...mapState('gift',{
                theme: state => state.theme,
            }),
			...mapGetters('mallConfig', {
				getVideo: 'getVideo'
			}),
            ...mapState({
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            }),
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
	.search {
		width: #{750upx};
		height: #{105upx};
		background-color: #efeff4;
		padding: #{0 24upx};
		position: relative;
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
		.item {
			height: #{64upx};
			line-height: #{64upx};
			font-size: #{26upx};
			padding: #{0 20upx};
			background-color: #f7f7f7;
			border-radius: #{32upx};
			margin-bottom: #{32upx};
		}
	}
</style>