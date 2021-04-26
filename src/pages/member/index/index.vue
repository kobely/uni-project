<template>
	<view style="position: absolute;width: 100%;height: 100%;top: 0;left: 0;background-color: #fff;overflow: auto;">
    	<app-layout :haveBackground="haveBackground">
		    <view :class="[`user`,recharge ? `` : `recharge`,nextMember && nextMember.money > 0 ? `` : `less`]">
		        <view v-if="detail.rules != '' && level > 0" class="question" @click="toRules">
		            <image load-lazy="true" src="./../image/question.png"></image>
		        </view>
		        <!-- 开通充值后的模块 -->
		        <view class="user-info">
		            <image load-lazy="true" class="avatar" :src="userInfo.options.avatar"></image>
		            <view>{{userInfo.nickname}}</view>
		            <view class="user-member-info">
		                <view class="member-detail">
		                    <image class="level-icon" load-lazy="true" :src="member_pic_url"></image>
		                    <text v-if="level == 0">{{userInfo.identity.level_name}}</text>
		                    <text v-if="level > 0" class="t-omit member-level-name">{{detail.name}}</text>
		                </view>
		                <view class="progress" v-if="nextMember && nextMember.money > 0">
		                	<view class="progress-line">
		                		<view :style="[{'width': prop + `%`}]" class="progress-active"></view>
		                	</view>
		                    <view v-if="nextList.length > 0">消费￥{{ list !== null ? list.consumption_money : "0" }}/￥{{ detail !== null ? nextMember.money : "0" }}</view>
		                </view>
		            </view>
		        </view>
		        <view :class="[`user-balance`,`main-between`,`cross-center`,nextMember && nextMember.money > 0 ? `` : `less`]" v-if="recharge == true">
		            <view class="user-text">
		                <view>账户余额</view>
		                <view class="user-price">￥{{balance}}</view>
		            </view>
		            <view class="to-recharge" @click="toRecharge">
		                <button class="go-btn">去充值</button>
		            </view>
		        </view>
		        <!-- 用户信息 -->
		        <view :class="[`card`,recharge ? `` : `recharge`,nextMember && nextMember.money > 0 ? `` : `less`]">
		            <image v-if="list" load-lazy="true" class="card-img" :src="list && list.mall_member ? detail.bg_pic_url : list.member_bg_pic_url"></image>
		            <image class="card-bottom" :src="memberImg.card_bottom"></image>
		        </view>
		    </view>
		    <!-- 特权展示 -->
			<view class="member-info">
		        <view v-if="level > 0 && (detail.rights && detail.rights.length > 0)" class="member-title main-center cross-center">
		            <image load-lazy="true" :src="memberImg.member_left"></image>
		            <view class="info-text">{{detail.name}}特权</view>
		            <image load-lazy="true" :src="memberImg.member_right"></image>
		        </view>
		        <image v-else load-lazy="true" class="banner" :src="memberImg.banner"></image>
		        <view @click="toDetail" v-if="detail.rights && detail.rights.length > 0">
		            <view :class="[`main-center flex-wrap`, `rights`, `${level == 0 ? 'border' : ''}`]">
		                <view class="rights-item" v-for="item in detail.rights" :key="item.id">
		                    <image load-lazy="true" class="rights-img" :src="item.pic_url"></image>
		                    <view class="t-omit">{{item.title}}</view>
		                </view>
		            </view>
		        </view>
		    </view>
		    <!-- 升级会员 -->
		    <view class="update" v-if="(nextList && nextList.length > 0)">
		        <view class="update-nav">
		            <image load-lazy="true" class="update-img" :src="memberImg.up"></image>
		            <view @click="toMore">
		                <view class="more">
		                    <text>更多</text>
		                    <image load-lazy="true" src="/static/image/icon/arrow-right.png"></image>
		                </view>
		            </view>
		        </view>
		        <!-- 可升级的会员大于一个 -->
		        <view class="member-list main-center" v-if="nextList.length > 1">
		            <view class="member-item" v-for="item in nextList" :key="item.id">
		                <image load-lazy="true" class="memeber-img" :src="item.bg_pic_url ? item.bg_pic_url : item.pic_url"></image>
		                <view class="memeber-other">
		                    <view class="member-name t-omit">{{item.name}}</view>
		                    <view class="discount">
		                        <text>{{item.discount}}</text>折
		                    </view>
		                    <view>会员折扣</view>
		                    <view @click="toMore(item.level)">
		                        <button class="update-btn">立即升级</button>
		                    </view>
		                </view>
		            </view>
		        </view>
		        <!-- 可升级的会员只有一个 -->
		        <view class="level" v-else>
		            <image load-lazy="true" class="level-img" :src="nextList[0].bg_pic_url ? nextList[0].bg_pic_url : nextList[0].pic_url "></image>
		            <view class="level-right">
		                <view class="level-name t-omit">{{ nextList[0].name }}</view>
		                会员折扣
		                <text class="discount">
		                    <text>{{nextList[0].discount}}</text>折
		                </text>
		                <view @click="toMore(nextList[0].level)">
		                    <button class="level-btn">立即升级</button>
		                </view>
		            </view>
		        </view>
		    </view>
		    <!-- 优惠券 -->
		    <view class="coupon" v-if="coupon.length > 0">
		        <view class="update-nav">
		            <image load-lazy="true" class="update-img" :src="memberImg.coupon"></image>
		        </view>
		        <scroll-view class="coupon-list" scroll-x>
		            <view v-for="(item,index) in coupon" :key="item.id" @click="toCoupon(item.id)" class="coupon-item">
		                <image load-lazy="true" v-if="item.user_count === '0'" class="coupon-bg" :src="memberImg.coupon_index"></image>
		                <image load-lazy="true" v-else class="coupon-bg" :src="memberImg.coupon_received"></image>
		                <view class="coupon-price" v-if="item.type == 2">￥
		                    <text>{{item.sub_price}}</text>
		                </view>
	                    <view class="coupon-price" v-else>
	                    	<text>{{item.discount}}</text>折
	                	</view>
		                <view class="coupon-total">满{{item.min_price}}可用</view>
		                <view @click.stop="receive(item,index)" :style="{'padding-top': `${item.user_count === '0' ? '10rpx':'25rpx'}`}" class="coupon-status">{{item.user_count === '0' ?'立即领取' :'已领取'}}</view>
		            </view>
		        </scroll-view>
		    </view>
		    <!-- 商品 -->
		    <view class="goods" v-if="goods.length > 0">
		        <view class="update-nav">
		            <image load-lazy="true" class="update-img" :src="memberImg.goods"></image>
		            <view @click="toGoods">
		                <view class="more">
		                    <text>更多</text>
		                    <image load-lazy="true" src="/static/image/icon/arrow-right.png"></image>
		                </view>
		            </view>
		        </view>
		        <scroll-view class="goods-list" scroll-x>
		            <view v-for="item in goods" :key="item.id" @click="toGoods(item.id)" class="goods-item">
		                <image load-lazy="true" class="goods-img" :src="item.cover_pic"></image>
		                <view class="goods-name t-omit">{{item.name}}</view>
		                <view class="goods-price">￥
		                    <text>{{item.price}}</text>
		                </view>
		                <view class="before">原价{{item.original_price}}元</view>
		            </view>
		        </scroll-view>
		    </view>
		    <view v-if="tabbarbool" class="placeholder"></view>
   		</app-layout>
	</view>
</template>

<script>

    import { mapState } from "vuex";

    export default {
        data() {
            return {
                // #ifdef MP
                currentRoute: this.$platDiff.route(),
                // #endif
                tabbarbool: false,
                detail: {
		            rules: ''
		        },
		        list: [],
		        nextList: [],
		        goods: [],
		        first: false,
		        haveBackground: false,
		        coupon: [],
		        balance: 0,
		        loading: false,
		        member_pic_url: null,
		        nextMember: {
		        	money: 0
		        },
		        recharge: false,
		        current: 'wechat',
		        prop: 0,
		        page_loading: true,
		        level: 0
            }
        },
        name: "index",
        computed: {
            ...mapState({
                tabBarNavs: state => state.mallConfig.navbar.navs,
                userInfo: state => state.user.info,
                memberImg: state => state.mallConfig.__wxapp_img.member,
                couponImg: state => state.mallConfig.__wxapp_img.coupon,
            })
        },
        watch: {
            tabBarNavs: {
                handler: function() {
                    this.b();
                },
                immediate: true,
            }
        },
        methods: {
            b() {
                // #ifdef MP
                let currentRoute = this.currentRoute;
                // #endif
                // #ifdef H5
                let currentRoute = '/pages/member/index/index';
                // #endif
                for (let i = 0; i < this.tabBarNavs.length; i++) {
                    if(currentRoute.includes(this.tabBarNavs[i].url.split('?')[0])) {
                        return this.tabbarbool = true;
                    }
                }
                return  this.tabbarbool = false;
            },
        	receive(item,index) {
				let that = this;
				if(item.user_count > 0 || that.loading) {
					return false
				}
				that.loading = true;
                uni.showLoading({
                	mask: true,
                    title: '领取中...'
                });
                that.$request({
                    url: that.$api.member.receive,
                    data: {
                        coupon_id: item.id
                    },
                }).then(response=>{
					that.loading = false;
                    uni.hideLoading();
                    if(response.code === 0) {
                        uni.showToast({
                            title: response.msg,
                            duration: 1000
                        });
                        that.coupon[index].user_count = response.data.rest === 0 ? 1 : 0;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    uni.hideLoading();
                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(()=>{
                        that.receive(item,index);
                    });
                });
        	},

        	toCoupon(id) {
                uni.navigateTo({
                    url: '/pages/coupon/details/details-no-share?is_member=1&id='+ id
                });
        	},

        	toGoods(id) {
        		if(id) {
	        		uni.navigateTo({
	        			url: '/pages/goods/goods?id=' + id
	        		})
        		}else {
	        		uni.navigateTo({
	        			url: '/pages/member/goods/goods?discount=' + this.detail.discount
	        		})
        		}
        	},

        	toDetail() {
                uni.navigateTo({
                    url: '/pages/member/detail/detail?level='+ this.level + '&prop=' + this.prop
                });
        	},

        	toMore(level) {
        		if(level > 0) {
	        		uni.navigateTo({
	        			url: '/pages/member/upgrade/upgrade?level=' + this.level + '&other=' + level
	        		})
        		}else {
	        		uni.navigateTo({
	        			url: '/pages/member/upgrade/upgrade?level=' + this.level
	        		})
        		}
        	},

        	toRules() {
				uni.navigateTo({
					url: `/pages/rules/index?url=${encodeURIComponent(this.$api.member.index)}&keys=${JSON.stringify(['mall_member', 'rules'])}`,
				});
        	},

        	toRecharge() {
                uni.navigateTo({
                    url: '/pages/balance/recharge'
                });
        	},

            getList() {
                let that = this;
                that.$request({
                    url: that.$api.member.index,
                    method: 'get',
                }).then(response=>{
                    that.$hideLoading();
            		that.$store.dispatch('user/info');
                    if(response.code == 0) {
		                that.list = response.data;
		                that.detail = that.list.mall_member;
				        that.goods = that.list.member_goods;
		                that.coupon = that.list.member_coupons;
		                that.nextMember = that.list.next_consume_upgrade_member;
		                that.member_pic_url = that.list.member_pic_url;
		                that.nextList = that.list.next_mall_member;
		                if (that.recharge) {
		                    that.balance = that.list.user_info.balance
		                }
		                if (that.detail != null) {
		                    that.level = that.detail.level;
		                }
		                if (that.nextMember) {
		                    that.prop = that.list.consumption_money / that.nextMember.money * 100;
		                    if(that.prop > 100) {
		                        that.prop = 100;
		                    }
		                }
		                if (that.detail == null && that.nextList && that.nextList.length > 0) {
		                    that.detail = that.nextList[0]
		                }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(()=>{
                        that.getList();
                    });
                });
            },
        },
        onLoad() { this.$commonLoad.onload();
        	let that = this;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.$request({
                url: that.$api.recharge.setting,
                method: 'get',
            }).then(response=>{
                if(response.code == 0) {
	                if (response.data.setting.status == 1) {
	                    that.recharge = true
	                }
                }else {
                    uni.showToast({
                        title: response.msg,
                        icon: 'none',
                        duration: 1000
                    });
                }
            }).catch(response => {
                that.$hideLoading();
            });
        },

        onShow() {
        	let that = this;
        	that.getList();
        }
    }
</script>

<style scoped lang="scss">
	.placeholder {
		height: #{160rpx};
		background-color: #fff;
	}
	.member-level-name {
		max-width: #{200rpx};
	}

	.info-text {
		margin: 0 #{20rpx};
	}

	.user {
	    position: relative;
	    height: #{690rpx};
	    width: 100%;
	    background-color: #fff;
	    overflow: hidden;
	    &.recharge {
		    height: #{550rpx};
		    &.less {
		    	height: #{480rpx};
		    }
		}
	}

	.user-info {
	    position: absolute;
	    left: 0;
	    right: 0;
	    top: #{40rpx};
	    width: 100%;
	    padding: 0 #{45rpx};
	    z-index: 5;
	    color: #fff;
	    padding-left: #{185rpx};
		.user-member-info {
		    margin-top: #{16rpx};
		    font-size: #{20rpx};
		}
		.avatar {
		    height: #{100rpx};
		    width: #{100rpx};
		    border-radius: 50%;
		    border: #{2rpx} solid #fff;
		    position: absolute;
		    left: #{45rpx};
		}
	}


	.member-detail {
	    position: relative;
	    height: #{36rpx};
	    line-height: #{36rpx};
	    border-radius: #{18rpx};
	    padding: 0 #{16rpx} 0 #{54rpx};
	    background-color: #454955;
	    display: inline-block;
	    margin-bottom: #{15rpx};
	}

	.member-detail .level-icon{
	    border-radius: 50%;
	    position: absolute;
	    margin-bottom: #{-3rpx};
	}

	.member-detail image {
	    height: #{44rpx};
	    width: #{44rpx};
	    position: absolute;
	    bottom: 0;
	    left: 0;
	}

	.card {
	    height: #{690rpx};
	    width: 100%;
	    position: relative;
	    background-color: #292a31;
	    z-index: 2;
	    &.less {
	    	height: #{650rpx};
	    	&.recharge {
			    height: #{480rpx};
			}
	    }
	    &.recharge {
		    height: #{530rpx};
		}
	}

	.card-bottom {
	    position: absolute;
	    width: 100%;
	    height: #{80rpx};
	    bottom: 0;
	    left: 0;
	    z-index: 5;
	}

	.question {
	    position: absolute;
	    right: #{24rpx};
	    top: #{24rpx};
	    z-index: 99;
	}

	.question image {
	    height: #{36rpx};
	    width: #{36rpx};
	}

	.card-img {
	    position: absolute;
	    bottom: 0;
	    left: 0;
	    right: 0;
	    height: #{320rpx};
	    width: #{660rpx};
	    margin: 0 auto;
	    border-radius: #{16rpx};
	    z-index: 3;
	}

	.member-info {
		background-color: #fff;
	    padding-top: #{40rpx};
	}

	.member-title image {
	    height: #{32rpx};
	    width: #{68rpx};
	}

	.user-balance {
	    height: #{140rpx};
	    width: #{660rpx};
	    background-color: #454955;
	    position: absolute;
	    top: #{210rpx};
	    left: #{45rpx};
	    right: #{45rpx};
	    border-radius: #{16rpx};
	    z-index: 999;
	    padding: #{36rpx};
	    color: #fff;
	    &.less {
	    	top: #{160rpx};
	    }
	}

	.user-text {
	    vertical-align: top;
	    font-size: #{18rpx};
	    display: inline-block;
	}

	.user-price {
	    font-size: #{46rpx};
	    font-family: DIN;
	}

	.go-btn {
	    background-color: #454955;
	    height: #{56rpx};
	    line-height: #{52rpx};
	    width: #{140rpx};
	    border-radius: #{28rpx};
	    font-size: #{28rpx};
	    color: #fff;
	    border: #{1rpx} solid #fff;
	    padding: 0;
	    text-align: center;
	    margin-top: #{1rpx};
	}

	.go-btn::after {
	    border: 0;
	}

	.progress-line {
		height: #{10rpx};
		border-radius: #{5rpx};
		margin-bottom: #{5rpx};
		background-color: #949598;
		position: relative;
	}

	.progress-active {
		height: #{10rpx};
		border-radius: #{5rpx};
		background-color: #FFB82F;
		position: absolute;
		left: 0;
		top: 0;
	}

	.card-info {
	    position: absolute;
	    bottom: #{-10rpx};
	    left: #{620rpx};
	    height: #{320rpx};
	    width: #{660rpx};
	    padding: #{78rpx} #{100rpx} 0;
	    color: rgba(53, 53, 53, 0.7);
	    font-size: #{24rpx};
	    text-align: center;
	}

	.card-name {
	    font-size: #{44rpx};
	    color: #fff;
	}

	.rights {
	    margin-top: #{40rpx};
	    text-align: center;
	    color: #353535;
	    font-size: #{26rpx};
	    white-space: nowrap;
	    width: auto;
	}

	.rights-item {
	    display: inline-block;
	    width: #{150rpx};
	    margin: 0 #{40rpx} #{20rpx};
	}

	.rights-item .t-omit {
	    display: block;
	}

	.rights-img {
	    height: #{80rpx};
	    width: #{80rpx};
	    margin-bottom: #{12rpx};
	}

	.update {
		background-color: #fff;
	    padding-top: #{60rpx};
	    padding-bottom: #{40rpx};
	}

	.update-nav {
	    height: #{64rpx};
	    padding: 0 #{26rpx};
	    color: #999;
	    font-size: #{28rpx};
	}

	.update-img {
	    float: left;
	    height: #{64rpx};
	    width: #{200rpx};
	}

	.more {
	    height: #{64rpx};
	    line-height: #{64rpx};
	    float: right;
	}

	.more image {
	    height: #{22rpx};
	    width: #{12rpx};
	    margin-left: #{12rpx};
	}

	.member-list {
	    margin-top: #{32rpx};
	    height: #{505rpx};
	    white-space: nowrap;
	    width: auto;
	}

	.member-item {
	    margin: #{20rpx};
	    width: #{342rpx};
	    height: #{465rpx};
	    display: inline-block;
	    position: relative;
	    text-align: center;
	    font-size: #{24rpx};
	    color: #999;
	    box-shadow: #{0rpx} #{0rpx} #{20rpx} rgba(0, 0, 0, 0.1);
	    border-radius: #{16rpx};
	}

	.memeber-other {
	    padding-top: #{22rpx};
	    height: #{290rpx};
	    width: 100%;
	    border: #{1rpx} solid #e2e2e2;
	    border-top: 0;
	    border-bottom-left-radius: #{16rpx};
	    border-bottom-right-radius: #{16rpx};
	}

	.memeber-img {
	    width: 100%;
	    height: #{175rpx};
	    display: block;
	    border-top-left-radius: #{16rpx};
	    border-top-right-radius: #{16rpx};
	}

	.member-name {
	    color: #353535;
	    font-size: #{32rpx};
	    width: 90%;
	}

	.member-price {
	    margin-top: #{8rpx};
	    font-size: #{24rpx};
	    color: rgba(53, 53, 53, 0.7);
	}

	.member-price text {
	    font-size: #{42rpx};
	}

	.discount {
	    padding-top: #{12rpx};
	    color: #ffb82f;
	    font-size: #{24rpx};
	}

	.discount text {
	    font-size: #{40rpx};
	}

	.update-btn {
	    height: #{62rpx};
	    width: 60%;
	    line-height: #{60rpx};
	    margin: #{24rpx} auto 0;
	    font-size: #{28rpx};
	    color: #b4914f;
	    border-radius: #{31rpx};
	    background-color: #fff;
	    border: #{1rpx} solid #b4914f;
	}

	.update-btn::after {
	    border: 0;
	}

	.coupon {
	    padding-bottom: #{40rpx};
	    background-color: #fff;
	}

	.coupon-list {
	    margin-top: #{32rpx};
	    padding-left: #{26rpx};
	    height: #{130rpx};
	    white-space: nowrap;
	    overflow: hidden;
	    width: auto;
	}

	.coupon-item {
	    height: #{130rpx};
	    width: #{260rpx};
	    position: relative;
	    font-size: #{24rpx};
	    margin-right: #{15rpx};
	    display: inline-block;
	}

	.coupon-bg {
	    height: #{130rpx};
	    width: #{260rpx};
	}

	.coupon-price {
	    position: absolute;
	    top: #{15rpx};
	    left: 0;
	    right: 0;
	    color: #fff;
	    text-align: center;
	    width: 75%;
	}

	.coupon-price text {
	    font-size: #{40rpx};
	}

	.coupon-total {
	    position: absolute;
	    bottom: #{10rpx};
	    left: 0;
	    right: 0;
	    color: #fff;
	    text-align: center;
	    width: 75%;
	}

	.coupon-status {
	    position: absolute;
	    top: 0;
	    right: 0;
	    width: #{70rpx};
	    height: #{130rpx};
	    font-size: #{22rpx};
	    color: #fff;
	    white-space: normal;
	    line-height: 125%;
	    padding: #{10rpx} 0 0 #{30rpx};
	}

	.goods {
	    margin-bottom: #{55rpx};
	}

	.goods-list {
	    margin-top: #{32rpx};
	    height: #{440rpx};
	    white-space: nowrap;
	}

	.goods-item {
	    margin: #{20rpx} 0;
	    height: #{400rpx};
	    width: #{220rpx};
	    display: inline-block;
	    margin-left: #{20rpx};
	    padding: #{24rpx};
	    color: #999;
	    font-size: #{24rpx};
	    text-align: center;
	    border-radius: #{8rpx};
	    box-shadow: 0 0 #{20rpx} rgba(0, 0, 0, 0.1);
	}

	.goods-img {
	    height: #{210rpx};
	    width: #{210rpx};
	    margin-bottom: #{10rpx};
	    display: block;
	}

	.goods-name {
	    color: #666;
	    width: #{210rpx};
	}

	.goods-price {
	    color: #b4914f;
	    margin: #{5rpx};
	}

	.goods-price text {
	    font-size: #{42rpx};
	}

	.before {
	    text-decoration: line-through;
	}

	.level {
	    margin: #{32rpx} auto #{40rpx};
	    width: #{700rpx};
	    height: #{206rpx};
	    border-radius: #{16rpx};
	    border: #{1rpx} solid #e2e2e2;
	    position: relative;
	    box-shadow: 0 0 #{20rpx} rgba(0, 0, 0, 0.1);
	}

	.level-img {
	    height: 100%;
	    width: #{400rpx};
	    float: left;
	    display: block;
	    border-top-left-radius: #{16rpx};
	    border-bottom-left-radius: #{16rpx};
	}

	.level-name {
	    font-size: #{32rpx};
	    color: #353535;
	    width: 100%;
	    height: #{40rpx};
	}

	.level-right {
	    position: absolute;
	    right: 0;
	    top: 0;
	    width: #{300rpx};
	    height: #{206rpx};
	    color: #999;
	    font-size: #{24rpx};
	    text-align: center;
	    padding: #{20rpx} 0;
	    border-top-right-radius: #{16rpx};
	    border-bottom-right-radius: #{16rpx};
	}

	.level-right .discount {
	    margin-left: #{14rpx};
	    margin-top: #{-5rpx};
	}

	.level-btn {
	    margin-top: #{14rpx};
	    height: #{48rpx};
	    line-height: #{46rpx};
	    padding: 0 #{30rpx};
	    border-radius: #{24rpx};
	    border: #{1rpx} solid #b4914f;
	    font-size: #{24rpx};
	    display: inline-block;
	    color: #b4914f;
	    background-color: #fff;
	}

	.level-btn::after {
	    border: 0;
	}

	.banner {
	    width: 100%;
	    height: #{110rpx};
	    display: block;
	    margin: #{40rpx} 0 #{20rpx};
	}

	.no-rights {
	    height: #{200rpx};
	    width: #{700rpx};
	    margin: 0 auto;
	    border: #{1rpx} solid #b4914f;
	    border-radius: #{16rpx};
	    text-align: center;
	    color: #353535;
	    font-size: #{26rpx};
	    padding-top: #{35rpx};
	}

	.rights.border {
	    border: #{1rpx} solid #b4914f;
	    margin: 0 #{26rpx};
	    width: auto;
	    min-height: #{200rpx};
	    border-radius: #{16rpx};
	}

	.border .rights-item {
	    margin-top: #{34rpx};
	}

	.no-next {
	    padding-top: #{140rpx};
	}
</style>
