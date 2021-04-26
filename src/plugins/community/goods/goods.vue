<template>
    <app-layout>
        <view v-if="goods.id == ''" class="u-goods-detail"></view>
        <view class="app-goods" v-else>
            <!--商品轮播图-->
            <app-banner
                :videoUrl="goods.video_url"
                :share="goods.share"
                :picList="goods.pic_url"
                :goods_id="goods_id"
                :isCart="false"
                sign="community"
            ></app-banner>
            <!-- 商品时间 -->
            <app-goods-time
                :day="day"
                :second="second"
                :minute="minute"
                :hour="hour"
                :theme="getTheme"
                :status="activity.status"
                :goods="goods"
            ></app-goods-time>
            <view class="other-info">
                <view class="t-omit-two goods-name">{{goods.name}}</view>
                <view v-if="goods.subtitle" class="goods-subtitle">
                    <view class="t-omit-three">{{goods.subtitle}}</view>
                </view>
                <view class="middleman dir-top-nowrap main-center">
                    <view v-if="middleman.id > 0" class="middleman-info dir-left-nowrap">
                        <image class="avatar" :src="middleman.avatar"></image>
                        <view class="user-info">
                            <view class="t-omit" style="width: 80%">{{middleman.name}}</view>
                            <view class="t-omit-two middleman-address">
                                <image class="icon" src="./../image/add.png"></image>
                                <text>提货地址:{{middleman.province}}<text v-if="middleman.province != middleman.city">{{middleman.city}}</text>{{middleman.district}}{{middleman.detail}}</text>
                            </view>
                        </view>
                    </view>
                    <view v-if="activity.status != 2" class="app-share">
                        <view @click="shareShow = true"
                              :style="{'background-color': getTheme.background}"
                              class="app-share-box dir-left-nowrap main-center cross-center">
                            <image class="app-icon  box-grow-0" src="/static/image/icon/icon-share-white.png"></image>
                            <text class="app-text box-grow-0">分享</text>
                        </view>
                    </view>
                </view>
				<view>
					<bd-info-extra :unit="goods.unit" :goods="goods" :theme="getTheme" :min-number="goods.min_number" :limit-buy="goods.limit_buy"></bd-info-extra>
				</view>
            </view>
            <!--商品优惠券-->
            <bd-coupon @change="setCoupon" :theme="getTheme" :coupons="goods.goods_coupon_center"></bd-coupon>
            <bd-xbc
                v-if="goods"
                :coAttr="is_open"
                :attr-list="checked ? checked.attr_list : []"
                :type="goods.type"
                :guarantee-title="goods.guarantee_title"
                :guarantee-pic="goods.guarantee_pic"
                :param_content="goods.param_content"
                :param_name="goods.param_name"
                :services="goods.services"
                :attr-groups="goods.attr_groups"
                :goods-stock="goods.goods_stock"
                @openAttr="joinCart"
            ></bd-xbc>
            <bd-hc
                :integral="goods.goods_marketing_award.integral"
                :coupon="goods.goods_marketing_award.coupon"
                :card="goods.goods_marketing_award.card"
                :balance="goods.goods_marketing_award.balance"
                :theme="getTheme"
            ></bd-hc>
            <bd-kb
                :limit="goods.goods_marketing.limit"
                :express="goods.express"
                :shipping="goods.goods_marketing.shipping"
                :pickup="goods.goods_marketing.pickup"
            ></bd-kb>
            <bd-comments :goods-id="goods.id"></bd-comments>
            <bd-detail :detail="goods.detail"></bd-detail>
            <!--空格区域-->
            <view class="safe-area-inset-bottom">
                <view class="u-bottom-height"></view>
            </view>
            <!-- 底部按钮 -->
            <view v-if="is_open == 1" class="safe-area-inset-bottom u-bottom-fixed">
                <view class="bd-bottom dir-left-nowrap">
                    <view class="bd-back dir-top-nowrap main-center cross-center box-grow-0" @click="back">
                        <image class="bd-icon" src="./../image/activity.png"></image>
                        <text class="bd-text">活动</text>
                    </view>
                    <view v-if="goods && goods.goods_stock > 0 && activity.status === 1" @click="joinCart"
                          :style="{'background': goods.buy_goods_auth ? getTheme.background_gradient_btn : '#999999'}"
                     class="'bd-btn box-grow-1 bd-btn-color">
                        加入购物车
                    </view>
                    <view class="box-grow-1 bd-btn bd-oversell-btn bd-btn-color" v-else>
                        加入购物车
                    </view>
                </view>
            </view>
        </view>
        <app-close v-if="showClose" :modal="false" @update="getMall"></app-close>
        <!--商品规格-->
        <u-attr
            v-if="goods && goods.goods_stock > 0 && activity.status === 1"
            v-model="show"
            :goods="goods"
            :theme="getTheme"
            :checked="checked"
            :is_show_left="false"
            :right-func="true"
            right-text="加入购物车"
            @rightFunc="rightFunc"
            @check="check"
        >
        </u-attr>
        <app-share-qr-code
            v-model="shareShow"
            :url="url"
            :goods="goods"
            :poster-config="posterConfig"
            :poster-generate="posterGenerate"
            :has-poster-nav="hasPosterNav"
            @share="hShareAppMessage"
        ></app-share-qr-code>
    </app-layout>
</template>

<script>
    import {mapState, mapGetters} from 'vuex';
    import appBanner from '../../../components/page-component/goods/app-goods-banner.vue';
    import appGoodsTime from '../components/app-goods-time.vue';
    import appShareQrCode from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
    import uAttr from '../../../components/page-component/goods/u-attr.vue';
    import appClose from '@/components/basic-component/app-close/app-close.vue';
    import bdCoupon from '@/components/page-component/goods/bd-coupon.vue';
    import bdXbc from '@/components/page-component/goods/bd-xbc.vue';
    import bdKb from '@/components/page-component/goods/bd-kb.vue';
    import bdHc from '@/components/page-component/goods/bd-hc.vue';
    import bdDetail from '@/components/page-component/goods/bd-detail.vue';
    import bdComments from '@/components/page-component/goods/bd-comments.vue';
	import bdInfoExtra from '@/components/page-component/goods/bd-info-extra.vue';

    export default {
        name: 'goods',
        data() {
            return {
                showClose: false,
                is_open: 0,
                goods: {
                    id: '',
                    name: '',
                    cover_pic: '',
                    price: '',
                },
                middleman: {},
                activity: {},
                hasPosterNav: true,
                posterConfig: this.$api.community.goods_config,
                posterGenerate: this.$api.community.goods_generate,
                isShowBuy: false,
                shareShow: false,
                checked: null,
                url: '',
                show: false,
                list: [],
                goods_id: -1,
                hour: 0,
                minute: 0,
                second: 0,
                longitude: 0,
                latitude: 0,
                day: 0,
                loading: false,
                first: true,
                middleman_id: 0,
				disable: 'disable'
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
            that.goods_id = options.goods_id;
            that.posterConfig = that.posterConfig + '&goods_id=' + that.goods_id;
            that.posterGenerate = that.posterGenerate + '&goods_id=' + that.goods_id;
            if(options.middleman_id > 0) {
                that.middleman_id = options.middleman_id;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.request({
                    url: that.$api.community.goods_detail,
                    data: {
                        goods_id: that.goods_id,
                        middleman_id: that.middleman_id,
                    }
                }).then(response => {
                    that.first = false;
                    let { goods, activity,middleman } = response;
                    that.goods = goods;
                    that.goods.price = that.goods.price.toString();
                    that.activity = activity;
                    that.middleman = middleman;
                    that.loading = true;
                    that.url = `${that.$api.goods.poster}&goods_id=${that.goods.id}`;
                    if(activity.time > 0) {
                        that.getTime(activity.time);
                    }
                    that.$hideLoading();
                    // #ifdef H5
                    that.hShareAppMessage();
                    // #endif
                });
            }else {
                // #ifndef H5
                uni.getLocation({
                    success: (e) => {
                        uni.hideLoading();
                        that.longitude = e.longitude;
                        that.latitude = e.latitude;
                        that.$showLoading({
                            type: 'global',
                            text: '加载中...'
                        });
                        that.request({
                            url: that.$api.community.goods_detail,
                            data: {
                                goods_id: that.goods_id,
                                longitude: that.longitude,
                                latitude: that.latitude
                            }
                        }).then(response => {
                            that.first = false;
                            let { goods, activity,middleman } = response;
                            that.goods = goods;
                            that.activity = activity;
                            that.middleman = middleman;
                            that.loading = true;
                            that.url = `${that.$api.goods.poster}&goods_id=${that.goods.id}`;
                            if(activity.time > 0) {
                                that.getTime(activity.time);
                            }
                            that.$hideLoading();
                        });
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.showModal({
                            title: '提示',
                            content: '获取位置信息失败，需要授权获取您的位置信息',
                            showCancel: false,
                            confirmText: '打开授权',
                            success(e) {
                                if (e.confirm) {
                                    uni.openSetting({});
                                }
                            }
                        });
                    },
                });
                // #endif
                // #ifdef H5
                that.$jwx.getLocation({
                    success: (e) => {
                        uni.hideLoading();
                        that.longitude = e.longitude;
                        that.latitude = e.latitude;
                        that.$showLoading({
                            type: 'global',
                            text: '加载中...'
                        });
                        that.request({
                            url: that.$api.community.goods_detail,
                            data: {
                                goods_id: that.goods_id,
                                longitude: that.longitude,
                                latitude: that.latitude
                            }
                        }).then(response => {
                            that.first = false;
                            let { goods, activity,middleman } = response;
                            that.detail = goods;
                            that.activity = activity;
                            that.middleman = middleman;
                            that.loading = true;
                            that.url = `${that.$api.goods.poster}&goods_id=${that.detail.id}`;
                            if(activity.time > 0) {
                                that.getTime(activity.time);
                            }
                            that.$hideLoading();
                        });
                    },
                    fail: function () {
                        uni.showToast({
                            title: '请开启手机位置权限',
                            icon: 'none',
                            duration: 1000
                        });
                    },
                })
                // #endif
            }
        },
        onShow() {
            this.showClose = false;
            setTimeout(()=>{
                this.showClose = true;
            })
            if(this.first) {
                return false
            }
            this.$showLoading();
            this.$nextTick(() => {
                this.request({
                    url: this.$api.community.goods_detail,
                    data: {
                        goods_id: this.goods_id,
                        middleman_id: this.middleman_id,
                        longitude: this.longitude,
                        latitude: this.latitude
                    }
                }).then(response => {
                    let { goods, activity,middleman } = response;
                    this.goods = goods;
                    this.activity = activity;
                    this.middleman = middleman;
                    this.loading = true;
                    this.url = `${this.$api.goods.poster}&goods_id=${this.goods.id}`;
                    if(activity.time > 0) {
                        this.getTime(activity.time);
                    }
                    this.$hideLoading();
                });
            })
        },
        onHide() {
            clearInterval(this.time);
        },
        onUnload() {
            clearInterval(this.time);
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                mall: state => state.mallConfig.mall,
                userInfo: state => state.user.info,
            })
        },
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            // 分享朋友圈beta
            return this.$shareTimeline({
                title: this.goods.app_share_title ? this.goods.app_share_title : this.goods.name,
                imageUrl: this.goods.pic_url[0].pic_url,
                query: {
                    goods_id: this.goods.id,
                    user_id: this.userInfo.options.user_id
                }
            });
        },
        // #endif
        // #ifdef MP
        onShareAppMessage() {
            return this.hShareAppMessage();
        },
        // #endif
        methods: {
            hShareAppMessage(s = false){
                let { app_share_title, app_share_pic, name, id, pic_url, subtitle} = this.goods;
                return this.$shareAppMessage({
                    path: '/plugins/community/goods/goods',
                    title: app_share_title ? app_share_title : name,
                    imageUrl: app_share_pic ? app_share_pic : pic_url[0].pic_url,
                    desc: subtitle,
                    params: {
                        goods_id: id,
                        user_id: this.userInfo.options.user_id
                    }
                },s);
            },
            getMall(e) {
                this.is_open = e.is_open;
            },
            async request({url, data}) {
                const response = await this.$request({
                    url: url,
                    data: data,
                });
                if (response.code === 0) {
                    return response.data;
                }else {
                    uni.showToast({
                        title: response.msg,
                        icon: 'none',
                        duration: 1000
                    });
                    if(response.msg === '所选活动已下架' || response.msg === '所选活动不存在' ) {
                        setTimeout(()=>{
                            uni.navigateBack({});
                        },1000);
                    }
                    if(response.msg == '所选商品不在活动中') {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                        setTimeout(()=>{
                            uni.redirectTo({
                                url: '/plugins/community/list/list'
                            });
                        },1000)
                        return false
                    }
                }
            },
            check({item}) {
                this.checked = item;
            },
            back() {
                uni.redirectTo({
                    url: '/plugins/community/list/list'
                });
            },
            rightFunc(data) {
                let { id, goods_attr_id, num } = data.goods_list[0];
                this.$request({
                    url: this.$api.community.cart_add,
                    data: {
                        activity_id: this.activity.id,
                        goods_id: id,
                        goods_attr_id: goods_attr_id,
                        num: num
                    },
                    method: 'post'
                }).then(response => {
                    if (response.code === 0) {
                        this.addResult(response.data.queue_id, response.data.token);
                    }
                });
            },
            joinCart() {
				if (!this.goods.buy_goods_auth) {
                    this.$tips.showToast({
                        title: '您暂无权限购买该商品',
                        icon: 'none'
                    });
                    return;
				}
                this.show = true;
            },
            addResult(queue_id, token) {
                this.$request({
                    url: this.$api.community.cart_result,
                    method: 'post',
                    data: {
                        queue_id: queue_id,
                        token: token,
                    },
                }).then(response => {
                    if (response.code === 0) {
                        if (response.data && response.data.retry === 1) {
                            setTimeout(() => {
                                this.addResult(queue_id, token);
                            }, 1000);
                        } else {
                            this.attrShow = 0;
                            uni.hideLoading();
                            uni.showToast({
                                title: '添加成功',
                                duration: 1000
                            });
                        }
                    } else {
                        uni.hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                });
            },
            getTime(newValue) {
                newValue = newValue - 1;
                this.day = parseInt(newValue / 3600 / 24);
                this.hour = parseInt(newValue / 3600 % 24);
                if(this.hour < 10) {
                    this.hour = '0' + this.hour
                }else {
                    this.hour = this.hour.toString();
                }
                this.minute = parseInt(newValue / 60 % 60);
                if(this.minute < 10) {
                    this.minute = '0' + this.minute
                }else {
                    this.minute = this.minute.toString();
                }
                this.second = parseInt(newValue % 60);
                if(this.second < 10) {
                    this.second = '0' + this.second
                }else {
                    this.second = this.second.toString();
                }
                clearInterval(this.time);
                this.time = setInterval(() => {
                    newValue = newValue - 1;
                    if (newValue < 0) {
                        clearInterval(this.time);
                    }
                    this.day = parseInt(newValue / 3600 / 24);
                    this.hour = parseInt(newValue / 3600 % 24);
                    if(this.hour < 10) {
                        this.hour = '0' + this.hour
                    }else {
                        this.hour = this.hour.toString();
                    }
                    this.minute = parseInt(newValue / 60 % 60);
                    if(this.minute < 10) {
                        this.minute = '0' + this.minute
                    }else {
                        this.minute = this.minute.toString();
                    }
                    this.second = parseInt(newValue % 60);
                    if(this.second < 10) {
                        this.second = '0' + this.second
                    }else {
                        this.second = this.second.toString();
                    }
                }, 1000);
            },
            setCoupon(index) {
                this.$set(this.goods.goods_coupon_center[index], 'is_receive', 1);
            }
        },
        components: {
            'app-banner': appBanner,
            'app-goods-time': appGoodsTime,
            'app-share-qr-code': appShareQrCode,
            appClose,
            uAttr,
            bdCoupon,
            bdXbc,
            bdKb,
            bdHc,
            bdDetail,
            bdComments,
			bdInfoExtra,
        }
    }
</script>

<style scoped lang="scss">
    .other-info {
        background-color: #fff;
        padding: 20upx;
        width: 702upx;
        border-radius: 15upx;
        margin: 24upx 24upx 0 24upx;
        .goods-name {
            font-size: #{32rpx};
            line-height: 42upx;
            color: #353535;
            margin-bottom: #{24rpx};
        }
        .goods-subtitle {
            font-size: 24rpx;
            line-height: 34upx;
            background-color: #ffffff;
            color: #999999;
            margin-bottom: #{24rpx};
        }
        .middleman {
            height: #{88rpx};
            color: #ffffff;
            position: relative;
            .app-share {
                height: #{136rpx};
                position: absolute;
                right: #{-20rpx};
                top: #{12rpx};

                .app-share-box {
                    height: #{48rpx};
                    border-radius: #{40rpx} 0 0 #{40rpx};
                    padding: 0 #{14rpx};
                    width: #{103rpx};

                    .app-icon {
                        width: #{22rpx};
                        height: #{22rpx};
                    }

                    .app-text {
                        font-size: #{22rpx};
                        color: #ffffff;
                        margin-left: #{10rpx};
                        top: #{50rpx};
                    }
                }
            }
            .middleman-info {
                .avatar {
                    width: #{88rpx};
                    height: #{88rpx};
                    border-radius: 50%;
                    margin-right: #{24rpx};
                }
                .user-info {
                    font-size: #{30rpx};
                    color: #353535;
                    width: #{520rpx};
                    .middleman-address {
                        margin-top: #{16rpx};
                        font-size: #{24rpx};
                        .icon {
                            height: #{25rpx};
                            width: #{19rpx};
                            margin-right: #{5rpx};
                            color: #ff4544;
                        }
                    }
                }
            }
        }
    }
    .app-goods {
        background-color: #f7f7f7;
    }
    .bd-bottom {
        width: 750upx;
        height: 110upx;
        padding: 20upx 24upx;
    }
    .bd-back {
        width: 66upx;
        height: 100%;
        margin-right: 20upx;
    }
    .bd-icon {
        width: 30upx;
        height: 30upx;
    }
    .bd-text {
        font-size: 20upx;
        color: #888888;
    }
    .bd-btn {
        text-align: center;
        line-height: 70upx;
        font-size: 28upx;
        border-radius: 35upx;
    }
    .bd-btn-color {
        color: #ffffff;
    }
    .bd-oversell-btn {
        background-color: #CDCDCD;
    }
    .product-list {
        background-color: white;
    }

    .join-member {
        background-color: #ffffff;
        padding: 0 #{24rpx};
    }
    .app-bottom {
        background-color: white;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
    }
    .text {
        color: #ffffff;
    }

    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1500;
        background-color: #ffffff;
    }
    .u-bottom-height {
        height: 110upx;
    }
    .u-bottom-height {
        height: 110upx;
    }
    .goods-margin {
        margin-top: 20upx;
    }
</style>