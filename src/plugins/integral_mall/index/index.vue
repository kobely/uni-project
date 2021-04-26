<template>
	<app-layout :overflow="false">
	    <view class="nav">
	        <image load-lazy="true" class="nav-bg" src="./../image/index_BG.png"></image>
	        <view class="nav-title">我的积分</view>
	        <view class="nav-num">{{userInfo ? userInfo.integral : 0}}</view>
	        <view @click="toAbout" class="about">
	            <image load-lazy="true" src="./../image/about.png"></image>
	        </view>
	        <view @click="router('/plugins/integral_mall/exchange/exchange')" class="exchange">
	            <image load-lazy="true" src="/static/image/icon/exchange.png"></image>
	            <text>我的兑换</text>
	        </view>
	        <view @click="router('/pages/user-center/integral-detail/integral-detail')" class="log">
	            <image load-lazy="true" src="./../image/log.png"></image>
	            <text>积分收支</text>
	        </view>
	    </view>
        <view class="banner" indicator-dots="true" autoplay="true" v-if="banners && banners.length">
            <swiper class="swiper" indicator-dots="true" autoplay="true">
                <swiper-item v-for="(item,index) in banners" :key="index">
                    <app-jump-button :open_type="item.open_type" :url="item.page_url" :params="item.params">
                        <image mode="aspectFill" :src="item.pic_url"></image>
                    </app-jump-button>
                </swiper-item>
            </swiper>
        </view>
	    <view class="coupon" v-if="coupon.length > 0">
	        <view class="coupon-title">兑换优惠券</view>
	        <scroll-view scroll-x class="coupon-list">
	            <view class="coupon-item" @click="router('/plugins/integral_mall/coupon/coupon?id=' + item.id)" v-for="item in coupon" :key="item.id">
	                <image load-lazy="true" src="./../image/coupon-bg.png"></image>
	                <view class="coupon-name t-omit" v-if="item.coupon.type == 2">￥
	                    <text>{{item.coupon.sub_price}}</text>优惠券</view>
	                <view class="coupon-name discount" v-else>
	                    <text>{{item.coupon.discount}}</text>优惠券</view>
	                <view class="coupon-user t-omit">
                        {{item.integral_num}}积分<span v-if="item.price > 0">+{{item.price}}元</span>兑换
						<!-- 满{{item.coupon.min_price}}元可用 -->
					</view>
	                <view class="coupon-exchange">
	                    <view>立即兑换</view>
	                </view>
	            </view>
	        </scroll-view>
	    </view>
	    <view class="goods">
	        <view class="goods-title">
	            <view class="coupon-title">优惠购专区</view>
	        </view>
	        <scroll-view scroll-x class="cat-list">
	            <view @click="tab(0)" :style="{'background-color': _num == 0 ? getTheme.background : ''}" :class="[`cat-item`,`t-omit`,`${_num == 0 ?'active':''}`]">全部</view>
	            <view @click="tab(item.id)" :style="{'background-color': _num == item.id ? getTheme.background : ''}" :class="[`cat-item`,`t-omit`,`${_num == item.id ?'active':''}`]" v-for="item in cats" :key="item.id">{{item.name}}
	            </view>
	        </scroll-view>
	        <view class="goods-list dir-left-wrap">
	            <view open-type="navigate" @click="toGoods(item)" class="goods-item" v-for="item in goods" :key="item.id">
	                <image load-lazy="true" mode="aspectFill" class="goods-img" :src="item.cover_pic"></image>
                    <view class="out-dialog" v-if="item.goods_stock == 0 && appSetting.is_show_stock == '1'">
                        <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                    </view>
	                <view class="goods-name t-omit">{{item.name}}</view>
	                <view class="goods-price" :style="{'color': getTheme.color}">{{item.integralMallGoods.integral_num}}积分<text v-if="item.price > 0">+￥{{item.price}}</text></view>
	                <view class="goods-old">￥{{item.original_price}}</view>
	                <view class="goods-num">仅剩{{item.goods_stock}}件</view>
                    <button v-if="item.goods_stock > 0" class="goods-exchange" :style="{'background-color': item.buy_goods_auth ? getTheme.background : '#999999'}">立即兑换</button>
	                <button v-else class="goods-exchange" style="background: #CDCDCD;color: #fff;">已售罄</button>
	            </view>
	        </view>
	    </view>
	    <view class="dialog-bg" v-if="lose || success">
	        <view class="dialog">
	            <view @click="close">
	                <image load-lazy="true" class="close" src="/static/image/icon/icon-close.png"></image>
	            </view>
	            <view class="lose" v-if="lose">
	                <image load-lazy="true" class="lose-img" src="./../image/lose.png"></image>
	                <view class="lose-title">兑换失败！</view>
	                <view>当前积分不足</view>
	            </view>
	            <view class="success" v-if="success">
	                <image load-lazy="true" class="success-head" :src="integralImg.app_image.success"></image>
	                <view>恭喜您，兑换成功！</view>
	                <view class="main-between success-btn">
	                    <view @click="toList">
	                        <button class="to-card">去卡券包</button>
	                    </view>
	                    <view @click="toList">
	                        <button class="to-use">立即使用</button>
	                    </view>
	                </view>
	            </view>
	        </view>
	    </view>
<!-- 	    <view class="dialog-bg" v-if="choose.id > 0">
	        <view class="dialog-tip">
                <view class="dialog-title">提示</view>
                <view class="dialog-msg">
		            确定使用
		            <text v-if="choose.integral_num > 0"><text style="color: #ff4544">{{choose.integral_num}}</text>积分</text>
		            <text v-if="choose.price > 0"><text v-if="choose.integral_num > 0">与</text>
		            <text style="color: #ff4544">{{choose.price}}</text>元</text>
		            兑换此优惠券？
		        </view>
                <view class="dialog-btn main-center">
                    <view @click="chooseItem({})" class="dialog-close">取消</view>
                    <view class="line"></view>
                    <view class="dialog-submit" @click="submit">确认</view>
                </view>
            </view>
	    </view> -->
	</app-layout>
</template>


<script>
    import { mapState, mapGetters } from "vuex";

    export default {
        data() {
            return {
		        success: false,
		        lose: false,
		        _num: 0,
		        more: false,
		        setting: {},
		        coupon: [],
		        userInfo: {
		            integral: 0
		        },
		        choose: {
		            integral: 0
		        },
		        banners: [],
		        cats: [],
		        id: 0,
		        exchangeCoupon: false,
		        current: 'wechat',
		        goods: [],
		        args: false,
		        page: 1,
				disable: 'disable'
            }
        },
        computed: {
            ...mapState({
                integralImg: state => state.mallConfig.plugin.integral_mall,
                appSetting: state => state.mallConfig.mall.setting,
                appImg: state => state.mallConfig.__wxapp_img.mall,
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            }),
             ...mapGetters('mallConfig', {
				getVideo: 'getVideo',
			 	getTheme: 'getTheme'
            }),
        },
        methods: {
            close() {
                this.success = false;
                this.lose = false;
            },

        	tab(id) {
        		this._num = id;
        		this.page = 1;
        		this.goods = [];
        		this.getGoods();
        	},

            toList() {
                this.success = false;
                uni.navigateTo({
                    url: '/pages/coupon/index/index'
                });
            },
            toGoods(data) {
                 // #ifndef MP-BAIDU
                if (data.goodsWarehouse.video_url && this.getVideo == 1) {
                    // #ifdef MP
                    uni.navigateTo({
                        url: `/pages/goods/video?goods_id=${data.id}&sign=${data.sign}`
                    });
                    // #endif
                    // #ifdef H5
                    uni.navigateTo({
                        url: '/plugins/integral_mall/goods/goods?goods_id=' + data.id
                    });
                    // #endif
                } else {
                    uni.navigateTo({
                        url: '/plugins/integral_mall/goods/goods?goods_id=' + data.id
                    });
                }
                // #endif

                // #ifdef MP-BAIDU
                uni.navigateTo({
                    url: '/plugins/integral_mall/goods/goods?goods_id=' + data.id
                });
                // #endif

            },
            toAbout() {
				uni.navigateTo({
					url: `/pages/rules/index?url=${encodeURIComponent(this.$api.integral_mall.index)}&keys=${JSON.stringify(['setting', 'rule'])}`,
				});
            },
			router(url) {
				uni.navigateTo({
					url: url
				});
			},
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.integral_mall.index,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code === 0) {
                    	let { banners, setting, userInfo } = response.data;
                    	that.banners = banners;
		                that.setting = setting;
		                that.userInfo = userInfo;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            getCoupon() {
                let that = this;
                that.$request({
                    url: that.$api.integral_mall.coupon,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code === 0) {
                    	that.coupon = response.data.list;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            getCat() {
                let that = this;
                that.$request({
                    url: that.$api.integral_mall.cats,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code === 0) {
                    	that.cats = response.data.list;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            getGoods() {
                let that = this;
                that.$request({
                    url: that.$api.integral_mall.goods,
                    data: {
		                cat_id: that._num,
		                page: that.page
		            }
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code === 0) {
                    	that.more = false;
                    	if(response.data.list.length == response.data.pagination.pageSize) {
                    		that.page++;
                    		that.more = true;
                    	}
                    	if(that.page > 1) {
                    		that.goods = that.goods.concat(response.data.list);
                    	}else {
                    		that.goods = response.data.list;
                    	}
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
        },
        onReachBottom() {
        	if(this.more) {
            	this.getGoods();
        	}
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: this.$children[0].navigationBarTitle,
                path: "/plugins/integral_mall/index/index",
            });
        },
        // #endif
        // #ifdef MP-WEIXIN
        onShareTimeline() {
          // 分享朋友圈beta
          return this.$shareTimeline({
            title: this.$children[0].navigationBarTitle,
            query: {} // 此处填写页面的参数
          });
        },

        // #endif
        onLoad() { this.$commonLoad.onload();
            let that = this;
            that._num = 0;
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
              menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
	        that.getList();
	        that.getCoupon();
	        that.getCat();
	        that.getGoods();
        }
    }
</script>

<style scoped lang="scss">
	.nav {
	    height: #{220rpx};
	    width: 100%;
	    position: relative;
	}

	.nav-bg {
	    height: #{220rpx};
	    width: 100%;
	}

	.nav-title {
	    text-align: center;
	    width: 100%;
	    position: absolute;
	    top: #{25rpx};
	    color: #999;
	    font-size: 12px;
	}

	.nav-num {
	    text-align: center;
	    width: 100%;
	    position: absolute;
	    top: #{60rpx};
	    color: #ecb786;
	    font-size: 24px;
	}

	.exchange, .log {
	    position: absolute;
	    bottom: #{40rpx};
	    color: #fff;
	    font-size: 15px;
	    height: #{34rpx};
	    line-height: #{34rpx};
	}

	.exchange image, .log image {
	    height: #{34rpx};
	    width: #{34rpx};
	    margin-right: #{16rpx};
	    display: block;
	    float: left;
	}

	.exchange {
	    left: #{120rpx};
	}

	.log {
	    right: #{120rpx};
	}

	.about {
	    height: #{30rpx};
	    width: #{30rpx};
	    position: absolute;
	    top: #{25rpx};
	    right: 38%;
	}

	.about image {
	    height: #{30rpx};
	    width: #{30rpx};
		display: block;
	}

    .banner {
        margin: #{20rpx} 0;
        height: #{190rpx};
    }

    .banner swiper {
        height: #{190rpx};
    }

    .banner image {
        height: #{190rpx};
        width: 100%;
    }

	.coupon {
	    background-color: #fff;
	    padding: #{30rpx} 0 #{40rpx} #{25rpx};
	}

	.coupon-title {
	    font-size: 15px;
	    color: #353535;
	    border-left: #{4rpx} solid #ff6f28;
	    padding-left: #{16rpx};
	    height: #{35rpx};
	    line-height: #{35rpx};
	    margin-bottom: #{38rpx};
	}

	.coupon-list {
	    height: #{220rpx};
	    white-space: nowrap;
	    overflow: hidden;
	    width: auto;
	}

	.coupon-item {
	    width: #{330rpx};
	    height: #{220rpx};
	    position: relative;
	    display: inline-block;
	    font-size: 13px;
	    color: #353535;
	    margin-right: #{20rpx};
	}

	.coupon-item image {
	    width: #{330rpx};
	    height: #{220rpx};
	}

	.coupon-name {
	    position: absolute;
	    left: #{24rpx};
	    top: #{10rpx};
        width: #{300rpx};
	    font-weight: bold;

		&.discount text:after {
			content: '折';
			font-size: 50%;
		}
	}

	.coupon-name text {
	    font-size: 20px;
	    margin-right: #{12rpx};
	}

	.coupon-user {
	    position: absolute;
        width: #{280rpx};
	    left: #{24rpx};
	    top: #{70rpx};
	}

	.coupon-exchange {
	    position: absolute;
	    bottom: #{22rpx};
	    left: 0;
	    right: 0;
        text-align: center;
	}

	.coupon-exchange view {
        display: inline-block;
        padding: 0 #{28rpx};
        text-align: center;
	    height: #{48rpx};
	    line-height: #{48rpx};
	    border-radius: #{24rpx};
	    border: #{2rpx} solid #353535;
	    margin: 0 auto;
	}

	.goods-title {
	    padding-left: #{20rpx};
	    height: #{96rpx};
	    line-height: #{96rpx};
	    padding-top: #{30.5rpx};
	    background-color: #fff;
	    margin-top: #{24rpx};
	    border-bottom: #{1rpx} solid #e2e2e2;
	}

	.cat-list {
	    height: #{100rpx};
	    background-color: #fff;
	    border-bottom: #{1rpx} solid #e2e2e2;
	    white-space: nowrap;
	    overflow: hidden;
	    width: auto;
        position: sticky;
        top: 0;
        z-index: 10;
	}

	.cat-item {
	    display: inline-block;
	    margin: #{23rpx};
	    text-align: center;
        width: auto;
	    color: #353535;
	    font-size: 12px;
        height: #{54rpx};
        line-height: #{54rpx};
        padding: 0 #{20rpx};
	}

    .cat-item.active {
        border-radius: #{27rpx};
        color: #fff;
    }

	.goods-list {
        padding-left: #{24rpx};
	}

	.goods-item {
	    width: #{344rpx};
	    background-color: #fff;
	    font-size: 14px;
	    color: #353535;
	    margin: #{14rpx} #{14rpx} 0 0;
	    position: relative;
	    display: block;
        border-radius: #{16rpx};
	}

	.goods-name {
        margin-top: #{16rpx};
	    padding-left: #{24rpx};
        font-size: 26upx;
        height: 30upx;
        line-height: 30upx;
	}

	.goods-img {
	    height: #{344rpx};
	    width: #{344rpx};
	    display: block;
        border-top-left-radius: #{16rpx};
        border-top-right-radius: #{16rpx};
	}


    .out-dialog {
        width: #{344rpx};
        height: #{344rpx};
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,.5);
        image {
            width: #{344rpx};
            height: #{344rpx};
        }
    }

	.goods-price {
	    margin-top: #{10rpx};
	    margin-left: #{24rpx};
	    padding-bottom: #{125rpx};
	}

	.goods-old {
	    font-size: 13px;
	    color: #999;
	    text-decoration: line-through;
	    position: absolute;
	    left: #{24rpx};
	    bottom: #{88rpx};
	}

	.goods-num {
	    position: absolute;
	    right: #{24rpx};
	    bottom: #{88rpx};
	    font-size: 13px;
	}

	.goods-exchange {
	    height: #{48rpx};
	    line-height: #{48rpx};
	    border-radius: #{24rpx};
	    position: absolute;
	    bottom: #{24rpx};
	    left: #{24rpx};
	    right: #{24rpx};
	    color: #fff;
	    font-size: 13px;
	}

	.goods-exchange::after {
	    border: 0;
	}

	.dialog-bg {
	    position: fixed;
	    left: 0;
	    top: 0;
	    height: 100%;
	    width: 100%;
	    background-color: rgba(0, 0, 0, 0.3);
	}

	.dialog {
	    width: #{574rpx};
	    margin: 0 auto;
	    background-color: #fff;
	    position: fixed;
	    top: 25%;
	    left: 0;
	    right: 0;
	    border-radius: #{16rpx};
	}

	.close {
	    height: #{30rpx};
	    width: #{30rpx};
	    position: absolute;
	    right: #{22rpx};
	    top: #{22rpx};
	    z-index: 10;
	}

	.lose {
	    padding: #{88rpx} 0 #{88rpx} #{90rpx};
	    height: #{310rpx};
	    font-size: 15px;
	    color: #353535;
	}

	.lose-img {
	    height: #{134rpx};
	    width: #{124rpx};
	    margin-right: #{48rpx};
	    display: block;
	    float: left;
	}

	.lose-title {
	    font-size: 23px;
	    font-weight: 500;
	    margin: #{15rpx} 0;
	}

	.success {
	    height: #{350rpx};
	    background-color: #fff;
	    text-align: center;
	    padding-top: #{150rpx};
	    font-size: 18px;
	    color: #353535;
	    border-radius: #{16rpx};
	}

	.success-head {
	    height: #{332rpx};
	    width: #{574rpx};
	    position: absolute;
	    top: #{-215rpx};
	    left: 0;
	}

	.to-card, .to-use {
	    margin-top: #{44rpx};
	    height: #{64rpx};
	    border-radius: #{32rpx};
	    line-height: #{64rpx};
	    width: #{228rpx};
	    font-size: 16px;
	}

	.to-card::after, .to-use::after {
	    border: 0;
	}

	.to-card {
	    background-color: #fff;
	    color: #353535;
	    border: #{1rpx} solid #999;
	}

	.to-use {
	    background-color: #ff4544;
	    color: #fff;
	}

    .dialog-tip {
        position: fixed;
        top: #{400rpx};
        left: 0;
        right: 0;
        padding-bottom: #{88rpx};
        width: #{640rpx};
        margin: 0 auto;
        z-index: 21;
        background-color: #fff;
        border-radius: 10px;
        text-align: center;
        font-size: #{30rpx};
    }

    .dialog-msg {
    	margin: 0 #{50rpx} #{50rpx};
    }

    .dialog-title {
        margin: #{40rpx} auto #{35rpx};
    }

    .dialog-btn {
        height: #{88rpx};
        width: #{640rpx};
        border-top: #{1rpx} solid #e2e2e2;
        line-height: #{88rpx};
        position: absolute;
        bottom: 0;
        left: 0;
    }

    .dialog-close,.dialog-submit {
        width: 50%;
    }

    .line {
        height: #{44rpx};
        margin-top: #{22rpx};
        width: #{1rpx};
        background-color: #e2e2e2;
    }

    .dialog-submit {
        color: #ff4544;
    }

    .success-btn {
		padding:0 #{39rpx};
    }
</style>
