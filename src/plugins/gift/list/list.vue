<template>
	<app-layout>
		<view class="list" v-if="loading">
			<!--  排序规则  -->
			<view class="page-width sort-rule">
				<app-sort-rule
					:theme="theme"
					sign="gift"
					v-on:sort="set_sort"
					@setStyle="setStyle"
					route="/plugins/gift/search/search"
				></app-sort-rule>
			</view>
			
			<!--  商品列表  -->
			<view class="page-width product-list">
				<product-list
					:goods_list="goods_list"
					:theme="theme"
					@routeGo="routeGo"
					sign="gift"
					:listStyle="listStyle"
				></product-list>
			</view>
			
			<view v-if="goods_list.length === 0" class="page-width no-goods">
				<app-no-goods background="#f7f7f7"></app-no-goods>
			</view>
		</view>
	</app-layout>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
	import appSortRule from '../../../components/page-component/app-sort-rule/app-sort-rule.vue';
	import productList from '../../../components/page-component/app-product-list/app-product-list.vue';
    import appNoGoods from '../../../components/page-component/app-no-goods/app-no-goods.vue';
	import search from '../components/list/search.vue';
	
    export default {
        name: 'list',

        data() {
            return {
                // 商品列表
                goods_list: [],
	            // 当前页面
                page: 1,
	            // 总页面
	            page_count: 1,
	            // 排序
                sort: 1,
	            // 价格排序
                sort_type: -1,
                loading: false,
				listStyle: false
            }
        },

        onLoad() { this.$commonLoad.onload();
            this.$store.dispatch('gift/getConfig', this.$api.gift.config);
            this.request().then(res => {
                this.goods_list.push(...res.list);
	            this.loading = true;
            });
        },

	    // 分页请求
        onReachBottom() {
            if (this.page < this.page_count) {
                this.page++;
                this.request().then(res => {
                    this.goods_list.push(...res.list);
                });
            }
        },

        methods: {
            
            // 请求数据
            async request() {
                this.$utils.showLoading();
                try {
                    const res = await this.$request({
                        url: this.$api.gift.list,
                        method: 'get',
                        data: {
                            sort: this.sort,
                            page: this.page,
                            sort_type: this.sort_type,
                        }
                    });
	                this.$utils.hideLoading();
                    if (res.code === 0) {
                        this.page_count = res.data.pagination.page_count;
						return res.data;
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: res.msg,
                        })
                    }
                } catch (e) {
                    this.$utils.hideLoading();
                    throw new Error(e);
                }
            },
	      
	        // 数据排序
            set_sort({data, type}) {
                this.sort = data;
                this.goods_list = [];
                this.page = 1;
                this.sort_type = type;
                this.request().then(res => {
                    this.goods_list.push(...res.list);
                })
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
                        url: `/plugins/gift/goods/goods?${data.page_url.split('?')[1]}`
                    });
                    // #endif
				} else {
					uni.navigateTo({
						url: `/plugins/gift/goods/goods?${data.page_url.split('?')[1]}`
					});
				}
				// #endif

				// #ifdef MP-BAIDU
				uni.navigateTo({
					url: `/plugins/gift/goods/goods?${data.page_url.split('?')[1]}`
				});
				// #endif
            },

			setStyle(data) {
            	this.listStyle = data;
			}
        },

        computed: {
            ...mapState('gift',{
                theme: function(state) {
                    return state.theme ? state.theme : this.$storage.getStorageSync('giftTheme');
                }
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

        components: {
            'app-sort-rule': appSortRule,
            'product-list': productList,
            'app-no-goods': appNoGoods,
	        'search': search,
        },
    }
</script>

<style lang="scss" scoped>
	@import '../css/gift';
	
	/* 商品列表页面 */
	.list {
		padding-bottom: #{24upx};
	}
	
	/* 排序规则 */
	.sort-rule {
		position: fixed;
        top: 0;
		left: 0;
		z-index: 1500;
	}
	
	//.search {
	//	position: fixed;
	//	top: 0;
	//	left: 0;
	//	z-index: 1500;
	//}
	
	/* 商品列表 */
	.product-list {
		margin-top: #{192upx};
	}
	
</style>