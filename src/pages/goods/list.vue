<template>
    <app-layout>
	    <view class="sort-rule">
		    <app-sort-rule @sort="setSort" :theme="getTheme" @setStyle="setStyle"></app-sort-rule>
	    </view>
	    <view class="product-list" v-if="goods_list.length > 0">
		    <app-product-list :isShowAttr="false" :theme="getTheme" @routeGo="routeGo" :listStyle="listStyle" :goods_list="goods_list"></app-product-list>
	    </view>
        <view class="u-loading-list" v-show="loading">加载中...</view>
        <view class="no-goods dir-left-nowrap cross-center main-center" v-if="noGoods">
            <view class="symbol"></view>
            <view class="u-no-icon"></view>
            <text class="u-text">暂无更多商品</text>
            <view class="symbol"></view>
        </view>
		<view class="app-no-goods" v-if="goods_list.length === 0 && !first_req">
			<app-no-goods background="#f7f7f7"></app-no-goods>
		</view>
		<view class="quick-box dir-top-nowrap" :style="{bottom: tabbarbool ? '180rpx' : '40rpx'}">
			<app-jump-button url="/pages/cart/cart" open_type="redirect" v-if="isShowCartFly == 1">
				<image class="quick-btn" src="./image/goods-list-card.png"></image>
			</app-jump-button>
			<app-jump-button v-if="isShowScoreTop == 1">
				<image @click="backTop" class="quick-btn" src="./image/back-top.png"></image>
			</app-jump-button>
		</view>
    </app-layout>
</template>

<script>
	import {mapGetters, mapState} from 'vuex';
	import appProductList from '../../components/page-component/app-product-list/app-product-list.vue';
	import appSortRule from '../../components/page-component/app-sort-rule/app-sort-rule.vue';
	import appNoGoods from '../../components/page-component/app-no-goods/app-no-goods.vue';

    export default {
        name: "list",
        data() {
            return {
                goods_list: [],
                page_count: 1,
                coupon_id: 0,
	            page: 1,
	            cat_id: 0,
	            sort: 1,
	            sort_type: 1,
				first_req: true,
				listStyle: false,
                noGoods: false,
                loading: false,
                sign: '',
            }
        },
	    onLoad(options) { this.$commonLoad.onload(options);
            if(options.cat_id > 0) {
                this.cat_id = options.cat_id;
            }
            if(options.coupon_id > 0) {
                this.coupon_id = options.coupon_id
            }
            this.sign = options.sign ? options.sign : '';
            this.request().then(() => {
            	this.first_req = false;
            	if (this.page < this.page_count) {
                    this.loading = true;
                }
			});
	    },
		computed: {
        	...mapGetters('mallConfig', {
				getVideo: 'getVideo',
                getTheme: 'getTheme',
			}),
            ...mapState({
                isShowCartFly: state => state.mallConfig.mall.setting.is_show_cart_fly,
                isShowScoreTop: state => state.mallConfig.mall.setting.is_show_score_top,
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            })
		},
        onReachBottom() {
            if (this.page < this.page_count) {
                this.page++;
                this.noGoods = false;
                this.request();
            } else {
                this.loading = false;
                this.noGoods = true;
			}
        },
	    methods: {
			routeGo(e) {
				if (e.video_url && this.getVideo == 1) {
				    // #ifdef MP
					uni.navigateTo({
						url: `/pages/goods/video?goods_id=${e.id}`
					});
					// #endif
                    // #ifdef H5
                    uni.navigateTo({
                        url: e.page_url
                    });
                    // #endif
				} else {
					uni.navigateTo({
						url: e.page_url
					});
				}

			},
            // 数据请求
            async request(status) {
                const res = await this.$request({
	                url: this.$api.default.goods_list,
	                method: 'get',
	                data: {
                        page: this.page,
                        cat_id: this.cat_id,
                        sort: this.sort,
                        sort_type: this.sort_type,
                        keyword: '',
                        coupon_id: this.coupon_id,
                        sign: this.sign,
	                }
                });
                if (res.code === 0) {
                    this.page_count = res.data.pagination.page_count;
                	if (status === 0) {
                        this.goods_list= res.data.list;
                    } else {
                        this.goods_list.push(...res.data.list);
                    }
                    if (this.page === 1 && this.page_count === 1) {
                        this.noGoods = true;
                    }
                } else {
                    uni.showModal({
	                    title: '提示',
	                    content: res.msg,
                    })
                }
            },
            setSort({data, type}) {
				this.first_req = true;
                this.sort = data;
                this.page = 1;
                this.sort_type = type;
				this.goods_list=[];
                this.request(0).then(() => {
                	this.first_req = false;
					this.backTop();
                    if (this.page_count > 1) {
                        this.loading = true;
                    } else {
                        this.loading = false;
                    }
				});
            },
            backTop() {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
            },
			setStyle(data) {
				this.listStyle = data;
			},
            splitData() {
                if (!this.compList.length) return;
                this.goods_list.push.apply(this.goods_list, this.compList.splice(0, 10));
                if (this.compList.length) {
                    this.compTime = setTimeout(() => {
                        this.splitData();
                    }, 200);
                }
            }
	    },
        components: {
            'app-product-list': appProductList,
	        'app-sort-rule': appSortRule,
			'app-no-goods': appNoGoods,
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                path: '/pages/goods/list',
                params: {
                    cat_id: this.cat_id,
                }
            });
        }
        // #endif
    }
</script>

<style scoped lang="scss">
	.sort-rule {
		width: #{750upx};
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1500;
	}
    .product-list {
        margin-top: #{188upx};
    }

	.quick-box {
		position: fixed;
		bottom: #{40rpx};
		right: #{48rpx};
        z-index: 100;
	}

	.quick-btn {
		width: #{80rpx};
		height: #{80rpx};
		margin-top: #{32rpx};
	}
	.app-no-goods {
		margin-top: 200upx;
	}
    .no-goods {
        width: 750upx;
        margin: 20upx 0;
    }
    .u-no-icon {
        width: 18upx;
        height: 20upx;
        background-image: url("./image/no.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin: 0 10upx 0 15upx;
    }
    .symbol {
        width: 30upx;
        height: 2upx;
        background-color: #d2d2d2;
    }
    .u-text {
        font-size: 24upx;
        color: #b0b0b0;
        margin-right: 15upx;
    }
    .u-loading-list {
        height: 64upx;
        line-height: 64upx;
        text-align: center;
        color: #b0b0b0;
        font-size: 24upx;
    }
</style>