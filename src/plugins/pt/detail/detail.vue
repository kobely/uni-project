<template>
	<app-layout>
		<view class="detail" v-if="detail">
			<view class="detail-top">
				<app-detail-top
						:cover_pic="detail.goods_cover_pic"
						:name="detail.goods_name"
						:people_num="detail.people_num"
						:price="detail.price"
						:original_price="detail.original_price"
						:status="detail.status"
						:theme="getTheme"
						:group_economize_price="detail.group_economize_price"
				></app-detail-top>
			</view>
			<view class="group-avatar">
				<app-group-short
            @share="hShareAppMessage"
                        :url="url"
                        :surplus_people="detail.surplus_people"
                        :surplusDateTime="detail.surplus_date_time"
                        :group_users="detail.group_users"
                        :status="detail.status"
                        :goodsId="detail.goods_id"
						:one_goods_id="detail.one_goods_id"
                        :is_join="detail.is_join"
                        :detail="detail"
                        :theme="getTheme"
                        :has-poster-nav="true"
                        :poster-config="poster_config"
                        :poster-generate="poster_generate"
                ></app-group-short>
			</view>
			<view class="rule dir-left-nowrap main-between cross-center" @click="router">
				<text class="app-left">拼团须知</text>
				<view class="app-right dir-left-nowrap cross-center">
					<text>· 好友参团</text>
					<text>· 人满发货</text>
					<text>· 人不满退款</text>
					<image class="app-icon" src="/static/image/icon/arrow-right.png"></image>
				</view>
			</view>
			<view class="rule more">
				<app-jump-button form arrangement="b" url="/plugins/pt/index/index">
					<text class="app-left">更多拼团</text>
					<view class="app-right dir-left-nowrap cross-center">
						<text>更多</text>
						<image class="app-icon" src="/static/image/icon/arrow-right.png"></image>
					</view>
				</app-jump-button>
			</view>
			<view class="list">
				<app-product-list :theme="getTheme" :list="list"></app-product-list>
			</view>
		</view>
	</app-layout>
</template>

<script>
    import appDetailTop from '../components/app-detail-top.vue';
    import appGroupAvatarShort from '../components/app-group-avatar-short.vue';
    import appProductList from '../components/app-product-list.vue';

    import {mapGetters, mapState} from 'vuex';

    export default {
        name: 'detail',
        data() {
            return {
                detail: null,
                url: '',
                list: [],
                id: null,
                poster_config: this.$api.pt.poster_config,
                poster_generate: this.$api.pt.poster_generate,
            }
	    },
	    onLoad(options) { this.$commonLoad.onload(options);
			this.id = options.id;
            this.request(options.id);
	    },
        onShow() {
            this.$store.dispatch('gConfig/setTabBarBoolean', this.tabBarNavs.navs);
        },
        computed: {
            ...mapGetters('mallConfig', {
                tabBarNavs: 'getNavBar',
				getTheme: 'getTheme',
			})
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.hShareAppMessage();
        },
        // #endif
        methods: {
            hShareAppMessage(s = false) {
                return this.$shareAppMessage({
                    path: '/plugins/pt/detail/detail',
                    title: this.detail.app_share_title ? this.detail.app_share_title : this.detail.name,
                    imageUrl: this.detail.app_share_pic ? this.detail.app_share_pic : '',
                    params: {
                        id: this.id
                    }
                },s);
            },
            attrTap(data) {
                if (data !== null) {
                    this.selectAttr = data;
                } else {
                    this.selectAttr = {};
                }
            },
            request(id) {
                this.$request({
	                url: this.$api.pt.pt_detail,
	                data: {
	                    id: id,
	                }
                }).then(response => {
                    if (response.code === 0) {
                        this.detail = response.data.detail;
                        this.url = `${this.$api.pt.order_poster}&pintuan_group_id=${id}&goods_id=${this.detail.goods_id}`;

                        this.poster_config = `${this.poster_config}&pintuan_group_id=${id}&goods_id=${this.detail.goods_id}`;
                        this.poster_generate = `${this.poster_generate}&pintuan_group_id=${id}&goods_id=${this.detail.goods_id}`;
                    }
                }).catch(() => {
                });
                this.$request({
	                url: this.$api.pt.goods,
                }).then(response => {
                    if(response.code === 0) {
                        this.list = response.data.list;
                    }
                })
            },

			router() {
				uni.navigateTo({
					url: `/pages/rules/index?url=${encodeURIComponent(this.$api.pt.index)}&keys=${JSON.stringify(['setting', 'new_rules'])}`,
				});
			}
	    },
	    components: {
            'app-detail-top': appDetailTop,
		    'app-group-short': appGroupAvatarShort,
		    'app-product-list': appProductList,
	    }
    }
</script>

<style scoped lang="scss">
	.rule {
		width: #{750rpx};
		height: #{90rpx};
		background-color: white;
		padding: 0 #{24rpx};
		box-sizing: border-box;
		.app-left{
			font-size: #{26rpx};
			color: #353535;
		}
		.app-right>text {
			font-size: #{24rpx};
			color: #999999;
			margin-left: #{30rpx};
		}
		.app-icon {
			width: #{12rpx};
			height: #{22rpx};
			margin-left: #{12rpx};
		}
	}
	.more {
		margin-top: #{20rpx};
	}
</style>