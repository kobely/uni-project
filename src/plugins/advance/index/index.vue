<template>
	<app-layout>
		<view class="index">
			<view class="search-input">
				<search-input :theme="getTheme"></search-input>
			</view>
			<view class="index-swipe" v-if="picture_list.length > 0">
				<index-swipe :pictures="picture_list"></index-swipe>
			</view>
			<view class="index-product-list">
				<product-list  :theme="getTheme" :product="product_list" ></product-list>
			</view>
		</view>
	</app-layout>
</template>

<script>
	import searchInput from '../components/search-input.vue';
	import indexSwipe from '../components/index-swipe.vue';
	import indexProductList from '../components/index-product-list.vue';
	import {mapGetters} from "vuex";

    export default {
        name: 'index',
	    data() {
            return {
                product_list: [],
                picture_list: [],
                page_count: 1,
                interval: null,
	            page: 1,
            }
	    },
	    onHide() {
            clearInterval(this.interval);
	    },
        onUnload() {
            clearInterval(this.interval);
        },
	    onLoad() { this.$commonLoad.onload();
            this.requestBanner().then(() => {
                this.requestList();
            });
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				menus: ['shareAppMessage', 'shareTimeline']
			})
			// #endif
	    },
	    methods: {
            cutoffTime(product_list) {
                let now = (new Date()).getTime();
                product_list.map((item, index) => {
                    let end_time = new Date(item.advanceGoods.end_prepayment_at.replace(/-/g, '/')).getTime();
                    let timing = end_time - now;
                    if (timing > 0) {
                        let day = parseInt(timing/1000/60/60/24);
                        let hou = parseInt((timing/1000/60/60)%24);
                        let min = parseInt((timing/1000/60)%60);
                        let sec = parseInt((timing/1000)%60);
                        if (day > 0) {
                            this.$set(product_list[index], 'html', `${day}天${hou}:${(min<10?"0"+min:min)}:${(sec<10?"0"+sec:sec)}`);
                        } else {
                            this.$set(product_list[index], 'html', `${hou}:${(min<10?"0"+min:min)}:${(sec<10?"0"+sec:sec)}`);
                        }
                    } else {
                        this.$delete(product_list, index);
                        if (this.product_list.length < 10 && this.page_count > 1) {
                            this.product_list = [];
                            this.requestList();
                        }
                    }
                })
            },

            set_interval() {
                clearInterval(this.interval);
                this.cutoffTime(this.product_list);
                this.interval = setInterval(() => {
                    this.cutoffTime(this.product_list);
                }, 1000);
            },

		    async requestList() {
                const res = await this.$request({
                    url: this.$api.advance.goods,
                    method: 'get',
                    data: {
                        page: this.page,
                    }
                });
                if (res.code === 0) {
                    this.product_list.push(...res.data.list);
                    this.page_count = res.data.pagination.page_count;
                    this.set_interval();
                }
		    },

		    async requestBanner() {
                this.$request({
                    url: this.$api.advance.banner,
                    method: 'get',
                }).then(res => {
                    if (res.code === 0) {
                        this.picture_list = res.data.list;
                    }
                })
		    }
	    },

        components: {
            'search-input': searchInput,
            'index-swipe' : indexSwipe,
	        'product-list': indexProductList,
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                path: '/plugins/advance/index/index',
                title: this.$children[0].navigationBarTitle,
            });
        },
        // #endif
		// #ifdef MP-WEIXIN
		onShareTimeline() {
			// 分享朋友圈beta
			return this.$shareTimeline({
				title: this.$children[0].navigationBarTitle,
				query: {
				} // 此处填写页面的参数
			});
		},
		// #endif
		computed: {
			...mapGetters('mallConfig', {
				getTheme: 'getTheme',
			})
		},
        onReachBottom() {
            if (this.page < this.page_count) {
                this.page++;
                this.requestList();
            }
        },
    }
</script>

<style scoped lang="scss">
	.index {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #f7f7f7;
		padding-top: #{88upx};
	}
	.index-product-list {
		margin-top: #{20rpx};
	}

</style>
