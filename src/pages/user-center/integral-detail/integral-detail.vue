<template>
    <app-layout>
        <app-tab-nav :tabList="tabList" :activeItem="activeTab" @click="setTab" :theme="getTheme"></app-tab-nav>
	    <view v-for="(item, index) in list" :key="index" :style="{'color': getTheme.color}" class="u-item" >
	        <view class='u-desc'>{{item.desc}}</view>
	        <view class='u-integral'>{{item.integral}}积分</view>
	        <view class="u-info">
	            <text>时间: {{item.created_at}}</text>
	        </view>
	    </view>
    </app-layout>
</template>

<script>
	import { mapGetters, mapState } from "vuex";
	import appTabNav from "../../../components/basic-component/app-tab-nav/app-tab-nav.vue";

    export default {
        data() {
            return {
                tabList: [{id:1, name: '收入'}, {id:2, name: '支出'}],
                activeTab: 1,
                page: 1,
                list: [],
				page_count: 1
            }
        },
        components: {
            "app-tab-nav": appTabNav
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info
            }),
			...mapGetters('mallConfig', {
				getTheme: 'getTheme'
			})
        },
		onLoad() { this.$commonLoad.onload();
            uni.showLoading({
                title: '加载中...'
            });
			this.getList();
		},
		onReachBottom() {
			if (this.page_count >= this.page) {
				this.getList();
			}
		},
        methods: {
			setTab(e) {
                uni.showLoading({
                    title: '加载中...'
                });
				this.activeTab = +e.currentTarget.dataset.id;
				this.list = [];
                this.page = 1;
                this.getList();
            },
            async getList() {
				try {
					const res = await this.$request({
						url: this.$api.integral_mall.log,
						data: {
							type: this.activeTab,
							page: this.page
						}
					});
					let { code, data, msg } = res;
                    uni.hideLoading();
					if (code === 0) {
						if (this.page !== 1) {
							this.list = this.list.concat(data.list);
						} else {
							this.list = data.list;
							this.page_count = data.pagination.page_count;
						}
						this.page = data.list.length ? this.page + 1 : this.page;
					} else {
						uni.showToast({
							title: msg,
							icon: 'none',
							duration: 1000
						});
					}
				} catch (e) {
					this.$event.on(this.$const.EVENT_USER_LOGIN).then(()=>{
						this.getList();
					});
				}
            }
        }
    }
</script>

<style scoped lang="scss">
	.u-item {
		font-size: 28upx;
		padding: 36upx 24upx;
		border-bottom: 1upx solid #e2e2e2;
		background-color: #ffffff;
	}
	.u-desc {
	    color: #353535;
	    margin-bottom: 6upx;
	}
	.u-integral {
	    width: 25%;
	    display: inline-block;
	}
	.u-info {
	    font-size: 22upx;
	    float: right;
	    color: #999999;
	}
</style>