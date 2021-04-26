<template>
    <app-layout>
        <app-tab-nav :tabList="tabList" :activeItem="activeTab" @click="tabStatus" :theme="getTheme"></app-tab-nav>
	    <view v-if="list.length == 0" class="tip">暂无相关优惠券</view>
        <view v-else class="list">
	        <view @click="toDetail(item.id)" v-for="item in list" :key="item.id">
	            <view class="list-item">
					<image src="./../image/img-coupon-bg-0.png" v-if="activeTab == 1"></image>
					<image src="./../image/img-coupon-bg-1.png" v-else></image>
	                <image class="status" src="./../image/img-coupon-status-icon-1.png" v-if="activeTab == 2"></image>
	                <image class="status" src="./../image/img-coupon-status-icon-2.png" v-if="activeTab == 3"></image>
	                <view class="item-left dir-top-nowrap main-center">
	                    <view class="coupon-price t-omit" v-if="item.coupon.type == 2">￥{{item.coupon.sub_price | reservedNum}}</view>
	                    <view class="coupon-price t-omit" v-else>{{item.coupon.discount | reservedNum}}折</view>
	                    <view style="font-size: 10px" class="t-omit" v-if="item.coupon_min_price > 0">满{{item.coupon_min_price | reservedNum}}可用</view>
	                    <view style="font-size: 10px" v-else>无门槛使用</view>
	                    <view style="font-size: 10px" v-if="item.discount_limit">优惠上限:￥{{item.discount_limit | reservedNum}}</view>
	                </view>
	                <view class="item-right">
	                    <view class="item-name t-omit t-large t-large-color">{{item.coupon.name}}</view>
	                    <view class="t-small-color time-area">{{item.start_time}} - {{item.end_time}}</view>
	                    <view v-if="item.coupon.appoint_type == 3">全场通用</view>
                        <view v-else-if="item.coupon.appoint_type == 4">仅限当面付活动使用</view>
	                    <view v-else-if="item.coupon.appoint_type == 5">仅限礼品卡使用</view>
	                    <view v-else>限品类</view>
	                </view>
	            </view>
	        </view>
	    </view>
	    <view :class="[`footer-space`,iphone_x? `iphone_x`:``]"></view>
	    <view :class="[`coupon-footer`,iphone_x? `iphone_x`:``]" @click="toList">去领券</view>
    </app-layout>
</template>

<script>
    import appTabNav from "../../../components/basic-component/app-tab-nav/app-tab-nav.vue";

	import {mapGetters, mapState} from "vuex";

    export default {
        data() {
            return {
                list: [],
                iphone_x: false,
                tabList: [
                    {id:1, name: '未使用'},
                    {id:2, name: '已使用'},
                    {id:3, name: '已过期'}
                ],
                activeTab: 1,
                first: false,
                page: 2,
            }
        },
        components: {
            "app-tab-nav": appTabNav
        },
        computed: {
			...mapGetters('mallConfig', {
				getTheme: 'getTheme',
			}),
        },
        methods: {
        	tabStatus(e) {
                this.list = [];
                this.page = 2;
                this.activeTab = e.currentTarget.dataset.id;
                uni.showLoading({
                    title: '加载中...'
                });
                this.getList();
        	},

            getList() {
                let that = this;
                that.first = true;
                that.$request({
                    url: that.$api.coupon.user_coupon,
                    data: {
                    	status: that.activeTab
                    }
                }).then(response=>{
                    uni.hideLoading();
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.list = response.data.list;
                        that.page = 2;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                    that.$hideLoading();
                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(()=>{
                        that.getList();
                    });
                });
            },
            getMore() {
                let that = this;
                uni.showLoading({
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.coupon.user_coupon,
                    data: {
                    	status: that.activeTab,
                        page: that.page
                    }
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        if(response.data.list.length > 0) {
                            that.list = that.list.concat(response.data.list);
                            that.page++;
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(e => {
                    uni.hideLoading();
                });
            },
            toDetail(id) {
                uni.navigateTo({
                    url: '/pages/coupon/details/details-no-share?person=1&id=' + id
                });
            },
            toList() {
                uni.navigateTo({
                    url: '/pages/coupon/list/list'
                });
            },
        },
        onLoad() { this.$commonLoad.onload();
            let that = this;
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
            that.$showLoading({
                text: '加载中...'
            });
            that.getList();
        },

        onShow() {
            if(this.first) {
                this.getList();
            }
        },
        onReachBottom() {
            this.getMore();
        },
         filters: {
            reservedNum(data) {
                return Number(data);
            }
        }
    }
</script>

<style scoped lang="scss">
    .footer-space {
        height: #{100rpx};
    }

    .footer-space.iphone_x {
        height: #{150rpx};
    }

    .time-area {
        padding:#{7rpx} 0;
    }

	.list {
	    padding: #{32rpx} #{35rpx};
        background-color: #f7f7f7;
	}

	.list-item {
	    height: #{152rpx};
	    width: 100%;
	    position: relative;
	    margin-bottom: #{25rpx};
	}

	.list-item image {
	    width: 100%;
	    height: 100%;
	}

	.item-left {
	    position: absolute;
	    left: 0;
	    top: 0;
	    height:100%;
	    width: #{190rpx};
	    text-align: center;
	    font-size: #{24rpx};
	    color: #fff;
	    padding-top: #{8rpx};
	}

	.coupon-price {
	    font-size: #{36rpx};
	    padding-bottom: #{16rpx};
	}

	.item-right {
	    position: absolute;
	    left: #{220rpx};
	    top: #{15rpx};
	    width: 65%;
	    color: #6f6e6d;
	    font-size: #{20rpx};
	}

	.item-name {
	    font-size: #{32rpx};
	    color: #353535;
	}

	.item-right view {
	    margin-bottom: #{4rpx};
	}

	.coupon-footer {
	    position: fixed;
	    bottom: 0;
	    left: 0;
	    right: 0;
	    width: 100%;
	    height: #{100rpx};
	    line-height: #{100rpx};
	    text-align: center;
	    background-color: #fff;
	    z-index: 2;
	}

    .coupon-footer.iphone_x {
        height: #{150rpx};
        padding-bottom: #{50rpx};
    }

	.list-item .status {
	    position: absolute;
	    top: 0;
	    right: 0;
	    height: #{98rpx};
	    width: #{140rpx};
	    z-index: 2;
	}

	.tip {
		margin-top: 20%;
	    text-align: center;
	    color: #686868;
	}

    .t-omit {
        display: inline-block;
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .t-omit-two {
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
</style>
