<template>
    <app-layout>
        <view style="height: 100%;background-color: #f7f7f7;position: absolute;width: 100%">
		    <view class='article-list' v-for="item in list" :key="item.id">
		        <app-form-id @click="toDetail(item.id)">
		            <view class='article-item main-between'>
		                <text class="t-omit" style="width: 90%">{{item.title}}</text>
		                <image class='enter' src='/static/image/icon/arrow-right.png'></image>
		            </view>
		        </app-form-id>
		    </view>
        </view>
    </app-layout>
</template>

<script>

    import { mapState } from "vuex";

    export default {
        data() {
            return {
                page: 2,
                loading: false,
                list: []
            }
        },
        computed: {
            ...mapState({
                title: state => state.mallConfig.bar_title
            })
        },
        methods: {
            getList() {
                let that = this;
                that.$showLoading({
                    text: '加载中...'
                });
                this.$request({
                    url: that.$api.article.list,
                    method: 'get',
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        this.list = response.data.list;
                    }
                }).catch(e => {
                    that.$hideLoading();
                });
            },
            getMore() {
                let that = this;
                if(that.loading) {
                    return false
                }
                that.loading = true;
                uni.showLoading({
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.article.list,
                    data: {
                        page: that.page
                    },
                }).then(response=>{
                    that.loading = false;
                    uni.hideLoading();
                    if(response.code == 0) {
                        if(response.data.list.length > 0) {
                            that.list = that.list.concat(response.data.list);
                            that.page++;
                        }else {
                            uni.showToast({
                                title: '没有更多内容',
                                icon: 'none',
                                duration: 1000
                            });
                            that.loading = true;
                        }
                    }
                }).catch(e => {
                    that.loading = false;
                    uni.hideLoading();
                });
            },
            toDetail(id) {
                uni.navigateTo({
                    url: '/pages/article/article-detail/article-detail?id=' + id
                });
            }
        },
        onLoad() { this.$commonLoad.onload();
            this.getList();
        },
        onReachBottom() {
            this.getMore();
        },
        // #ifdef MP
        onShareAppMessage() {
            let that = this;
            for(let i in that.title) {
                if(that.title[i].name === '文章中心') {
                    return that.$shareAppMessage({
                        title: that.title[i].new_name,
                        path: "/pages/article/article-list/article-list",
                    });
                }
            }
        }
        // #endif
    }
</script>

<style scoped lang="scss">
	.article-item {
	    height: #{100rpx};
	    line-height: #{100rpx};
	    background-color: #fff;
	    border-bottom: #{1rpx} solid #e2e2e2;
	    padding: 0 #{30rpx};
	}

	.enter {
	    margin-top: #{39rpx};
	    width: #{12rpx};
	    height: #{22rpx};
	}
</style>