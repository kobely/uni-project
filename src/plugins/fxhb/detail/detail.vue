<template>
    <view class="app-layout">
        <app-layout>
            <view class="detail-bg">
                <view class="fxhb-bg" :style="{'background-image': `url(${appImg.bg})`}">
                    <view class="fxhb-right">
                        <view @click="rules">活动规则</view>
                        <view @click="homes">返回首页</view>
                    </view>
                </view>
                <view class="fxhb-box">
                    <!-- 正在进行 -->
                    <view v-if="status === 0 && is_join == 1" class="detail-info">
                        <view class="user-list dir-left-wrap main-center">
                            <!-- #ifdef H5-->
                            <view v-for="(v,k) in list" :key="`k-${k}`" class="user-item">
                                <image :src="v.avatar" load-lazy></image>
                            </view>
                            <!-- #endif -->
                            <!-- #ifdef MP-->
                            <view v-for="(v,k) in list" :key="k" class="user-item">
                                <image :src="v.avatar" load-lazy></image>
                            </view>
                            <!-- #endif -->
                            <view v-for="(v,k) of user_num_list" :key="k" class="user-item none">
                                <image :src="appImg.fxhb_none" load-lazy></image>
                            </view>
                        </view>
                        <view class="detail-info-text">还差{{user_num}}人即可瓜分{{coupon_total_money}}元红包,快邀好友来拆</view>
                        <view class="detail-time-text">{{time_str}}后结束</view>
                        <view class="main-center">
                            <app-jump-button open_type="share">
                                <!-- #ifdef MP -->
                                <app-button color="#FFFFFF" height="88" width="560"
                                            background="#ff4544" round>邀请好友一起拆
                                </app-button>
                                <!-- #endif -->
                                <!-- #ifdef H5 -->
                                <app-button @click="hShareAppMessage" color="#FFFFFF" height="88" width="560"
                                            background="#ff4544" round>邀请好友一起拆
                                </app-button>
                                <!-- #endif -->


                            </app-jump-button>
                        </view>
                    </view>

                    <!-- 过期 -->
                    <view v-if="status === 2" class="detail-info">
                        <view class="detail-info-text cross-center dir-top-nowrap">
                            <view>超过规定时间，该红包不能拆了</view>
                            <icon class="icon-detail-time" type></icon>
                        </view>
                        <view class="main-center">
                            <app-button @click="openNew" height="88" width="560" background="#ff4544" color="#FFFFFF"
                                        font-size="32" round>拆一个新红包
                            </app-button>
                        </view>
                    </view>

                    <!-- 未中奖 -->
                    <view v-if="status === 1 && is_join == 0" class="detail-info">
                        <view class="user-list dir-left-wrap main-center">
                            <block v-for="(v,k) in list" :key="k">
                                <view class="user-item">
                                    <image :src="v.avatar" load-lazy></image>
                                </view>
                            </block>
                        </view>
                        <view class="detail-info-text">很遗憾，该红包已被瓜分完了</view>
                        <view class="main-center detail-error">
                            <app-button height="88" width="560" color="#FFFFFF" background="#ff4544" @click="openNew"
                                        round>
                                拆一个新红包
                            </app-button>
                        </view>
                    </view>

                    <!-- 已中奖 -->
                    <view v-if="status === 1 && is_join == 1" class="detail-info">
                        <view class="detail-info-text">恭喜您，已成功瓜分红包</view>
                        <view class="dir-left-nowrap cross-center coupon">
                            <view class="box-grow-1">
                                <view class="coupon-title">满减券</view>
                                <view class="coupon-desc">满{{min_price}}可用</view>
                            </view>
                            <view class="box-grow-0 dir-left-nowrap cross-bottom">
                                <view class="coupon-unit cross-bottom">￥</view>
                                <view class="coupon-money">{{user_price}}</view>
                            </view>
                        </view>
                        <view class="main-center">
                            <app-button @click="openNew" font-size="32" background="#ff4544" height="88" width="560"
                                        color="#FFFFFF" round>拆一个新红包
                            </app-button>
                        </view>
                        <view class="main-center coupon-set">
                            <app-button @click="goods" font-size="32" background="#ffb82f" height="88" width="560"
                                        color="#FFFFFF" round>
                                <view class="main-center cross-center">
                                    <view style="margin-right: 2px">立即使用</view>
                                    <icon class="icon-right" type></icon>
                                </view>
                            </app-button>
                        </view>
                    </view>

                    <!-- 中奖列表 -->
                    <view v-if="status === 1" class="detail-info award-list">
                        <view class="dir-left dir-left-nowrap main-center cross-center">
                            <view class="box-grow-0 list-line"></view>
                            <view class="box-grow-0 list-text">看看大家手气</view>
                            <view class="box-grow-0 list-line"></view>
                        </view>
                        <view class="dir-left-nowrap cross-center list" v-for="(v,k) in list" :key="k">
                            <view class="box-grow-0">
                                <image class="user-avatar" :src="v.avatar" load-lazy></image>
                            </view>
                            <view class="box-grow-1">{{v.nickname}}</view>
                            <view class="box-grow-0 dir-top-nowrap main-right">
                                <view class="main-right">{{v.get_price}}元</view>
                                <view class="dir-left main-center best" v-if="v.is_best">
                                    <icon class="user-pond" type></icon>
                                    <view class="t-extra-small">手气最佳</view>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 推荐商品 -->
                    <view class="more-goods" v-if="goods_list && goods_list.length">
                        <view class="tt-goods dir-left-nowrap cross-center main-center">
                            <view class="line"></view>
                            <view class="dir-left-nowrap cross-center">
                                <icon class="icon-love" type></icon>
                                <view>商品推荐</view>
                            </view>
                            <view class="line"></view>
                        </view>
                        <u-ordinary-list :isShowAttr="true" :list="goods_list" :theme="getTheme" :list-style="2"></u-ordinary-list>
                    </view>

                    <!-- 模态框 -->
                    <view v-if="show_share_model && user_num" class="act-modal">
                        <view class="act-modal-bg"></view>
                        <view class="act-modal-pic cross-center main-center">
                            <view class="modal-box" :style="{'background-image': `url(${appImg.share_modal_bg})`}">
                                <view class="modal-close" @click="closeShareModal">
                                    <icon class="icon-close" type></icon>
                                </view>
                                <view class="modal-text dir-left-nowrap main-center cross-bottom">
                                    <view>还差</view>
                                    <view class="bold-num">{{user_num}}</view>
                                    <view>个人即可拆红包</view>
                                </view>
                                <view class="dir-left-nowrap main-center cross-bottom">
                                    <view>一起瓜分</view>
                                    <view class="bold-money">{{coupon_total_money}}</view>
                                    <view>元！</view>
                                </view>
                                <view class="main-center btn">
                                    <app-jump-button open_type="share">
                                        <!-- #ifdef MP -->
                                        <app-button height="80" width="440" color="#FFFFFF" font-size="28"
                                                    background="#ff4544" round>邀请好友一起拆
                                        </app-button>
                                        <!-- #endif -->
                                        <!-- #ifdef H5 -->
                                        <app-button @click="hShareAppMessage" height="80" width="440" color="#FFFFFF" font-size="28"
                                                    background="#ff4544" round>邀请好友一起拆
                                        </app-button>
                                        <!-- #endif -->
                                    </app-jump-button>
                                </view>
                            </view>
                        </view>
                    </view>

                    <view v-if="is_new" class="hongbao dir-left main-center">
                        <view class="hongbao-content" :style="{'background-image': `url(${appImg.hongbao_bg})`}">
                            <view class="hongbao-desc">
                                <view>{{config.count_price}}元红包已包好</view>
                                <view>快拆开和小伙伴分红包</view>
                            </view>
                            <view @click="open">
                                <icon class="hongbao-btn" type></icon>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </app-layout>
    </view>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import uOrdinaryList from '../../../components/page-component/u-goods-list/u-ordinary-list.vue';

export default {
    name: "detail",
    components: {
        uOrdinaryList
    },
    computed: {
        ...mapState({
            appImg: state => state.mallConfig.plugin.fxhb.app_image
        }),
        ...mapGetters('mallConfig', {
            getTheme: 'getTheme'
            })
        },
	    
        data() {
            let interval_time;
            return {
                interval_time,
                user_activity_id: 0,
                config: null,
                goods_list: [],
                show_share_model: false,
                time_str: "00:00:00",
                is_new: false,

                coupon_total_money: 0,
                is_join: 0,
                is_my_hongbao: false,
                list: null,
                min_price: 0,
                reset_time: null,
                status: -1,
                totalUser: 0,
                user_num: 0,
                user_num_list: [],
                user_price: 0,
                again_open: true,
                page_url: '',
                template_message: []
            }
        },
	    
        onLoad(options) { this.$commonLoad.onload(options);
            this.user_activity_id = options.user_activity_id ? options.user_activity_id : '';
            this.loadConfig();
        },
        onUnload: function () {
            clearInterval(this.intervalTime);
        },

        // #ifdef MP
        onShareAppMessage() {
            return this.hShareAppMessage();
        },
        // #endif
        methods: {
            hShareAppMessage(s = false) {
                return this.$shareAppMessage({
                    title: this.config.share_title,
                    path: '/plugins/fxhb/detail/detail',
                    params: {
                        user_activity_id: this.user_activity_id,
                    },
                    imageUrl: this.config.share_pic_url
                }, s);
            },
            loadConfig() {
                const self = this;
                uni.showLoading({
	                title: '加载中',
                });
                self.$request({
                    url: self.$api.fxhb.index,
                    data: {
                        user_activity_id: self.user_activity_id
                    }
                }).then(info => {
	                uni.hideLoading();
                    if (info.code === 0) {
                        self.config = info.data.config;
                        self.template_message = info.data.template_message;
                        if (info.data.user_activity_id) {
                            self.user_activity_id = info.data.user_activity_id;
                            self.loadData()
                        } else {
                            if (self.user_activity_id) {
                                self.subscribe();
                            } else {
                                self.openNew();
                            }
                        }
                    } else {
                        uni.showToast({icon: 'none', title: info.msg});
                        setTimeout(() => {
                            uni.redirectTo({url: '/pages/index/index'})
                        }, 2000)
                    }
                }).catch(() => {
                    uni.hideLoading();
                })
            },

            openNew() {
                [this.status, this.is_new, this.goods_list] = [-1, true, []];
            },
            open() {
                if (this.again_open) {
                    this.user_activity_id = 0;
                    this.subscribe();
                    this.again_open = false;
                }
            },
            rules() {
                uni.navigateTo({
                    url: `/pages/rules/index?url=${encodeURIComponent(this.$api.fxhb.index)}&keys=${JSON.stringify(['config', 'remark'])}`,
                });
            },
            homes() {
                uni.navigateTo({url: `/pages/index/index`})
            },
            goods() {
                uni.redirectTo({url: this.page_url});
            },

            subscribe(){
                this.detailSubmit();
                // return;
                // self.$subscribe(self.template_message).then(res => {
                //     let tpl_id = self.template_message[0];
                //     if (res[tpl_id] == 'accept') {
                //         uni.showModal({
                //             title: '提示',
                //             content: '订阅成功',
                //             showCancel: false,
                //             success(res) {
                //                 self.detailSubmit();
                //             }
                //         })
                //     } else {
                //         uni.showModal({
                //             title: '提示',
                //             content: '取消订阅',
                //             showCancel: false,
                //             success(res) {
                //                 self.detailSubmit();
                //             }
                //         })
                //     }
                // }).catch(res => {
                //     self.detailSubmit();
                // });
            },
            detailSubmit() {
                let self = this;
	            uni.showLoading({
		            title: '抢红包中',
                    mask: true,
                });
                this.$request({
                    url: this.$api.fxhb.join,
                    method: 'post',
                    data: {
                        user_activity_id: this.user_activity_id
                    }
                }).then(info => {
	                uni.hideLoading();
                    if (info.code === 0) {
                        this.result(info.data.queueId, info.data.token);
                    } else {
                        uni.showToast({icon: 'none', title: info.msg});
                        setTimeout(() => {
                            self.openNew();
                        }, 2000)
                    }
                }).catch(() => {
                    uni.hideLoading();
                })
            },

            async loadData() {
	            uni.showLoading({
		            title: '加载中',
		            mask: true,
	            });
                const info = await this.$request({
                    url: this.$api.fxhb.detail,
                    data: {
                        user_activity_id: this.user_activity_id
                    }
                });
                uni.hideLoading();
                if (info.code === 0) {
                    let {
                        coupon_total_money,
                        is_join, is_my_hongbao,
                        list, min_price, page_url,
                        reset_time, status, totalUser,
                        user_num, user_price
                    } = info.data;
                    this.coupon_total_money = coupon_total_money;
                    this.is_join = is_join;
                    this.is_my_hongbao = is_my_hongbao;
                    this.list = list;
                    this.min_price = min_price;
                    this.page_url = page_url;
                    this.reset_time = reset_time;
                    this.totalUser = totalUser;
                    this.status = status;
                    this.user_num = user_num;
                    this.user_price = user_price;
                    // this.user_num_list = [];
                    this.user_num_list = new Array(this.user_num);
                    // for (let i = 0; i < this.user_num; i++) {
                    //     this.user_num_list.push(i);
                    // }
                    this.setTimeStart();
                    this.getRecommend();
                    this.again_open = true;
                } else {
                    uni.showToast({icon: 'none', title: info.msg});
                    setTimeout(() => {
                        uni.redirectTo({url: '/pages/index/index'})
                    }, 2000)
                }
            },

            setTimeStart() {
                const self = this;
                clearInterval(this.interval_time);

                let times = function () {
                    let hour = 0,
                        minute = 0,
                        second = 0; //时间默认值
                    let times = self.reset_time;
                    times--;
                    if (times > 0) {
                        hour = Math.floor(times / (60 * 60));
                        minute = Math.floor(times / 60) - (hour * 60);
                        second = Math.floor(times) - (hour * 60 * 60) - (minute * 60);
                    }
                    [self.reset_time, self.time_list] = [times, {hour, minute, second}];
                    self.time_str = (hour < 10 ? ('0' + hour) : hour) + ':' + (minute < 10 ? ('0' + minute) : minute) + ':' + (second < 10 ? ('0' + second) : second);
                    if (times <= 0) {
                        clearInterval(self.intervalTime);
                    }
                };
                times();
                this.interval_time = setInterval(() => {
                    times();
                }, 1000);
            },

            result(queueId, token) {
	            uni.showLoading({
		            title: '加载中',
		            mask: true,
	            });
                this.$request({
                    url: this.$api.fxhb.join_result,
                    data: {
                        queueId: queueId,
                        token: token
                    }
                }).then(info => {
                    if (info.code === 0) {
                        if (info.data.retry && info.data.retry == 1) {
                            setTimeout(() => {
                                this.result(queueId, token)
                            }, 1000);
                        } else {
                            this.user_activity_id = info.data.user_activity_id;
                            this.loadData();
                            uni.hideLoading();
                            this.showShareModal();
                        }
                    } else {
                        uni.hideLoading();
                        this.status = 2;
                        uni.showToast({icon: 'none', title: info.msg});
                        setTimeout(() => {
                            uni.redirectTo({url: '/pages/index/index'})
                        }, 2000)
                    }
                })
            },

            //打开分享提示框
            showShareModal: function () {
                [this.is_new, this.show_share_model] = [false, true];
            },

            //关闭分享提示框
            closeShareModal: function () {
                [this.show_share_model] = [false];
            },

            async getRecommend () {
	            uni.showLoading({
		            title: '加载中',
		            mask: true,
	            });
                const info = await this.$request({
                    url: this.$api.fxhb.recommend,
                });
	            uni.hideLoading();
                if (info.code === 0) {
                    this.goods_list = info.data.list;
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    .app-layout .detail-bg {
        background: #fe6b2e;
        min-height: 100vh;
    }
    .app-layout /deep/ .app-layout {
        background: #fe6b2e;
        min-height: 100vh;
    }
    .fxhb-bg {
        background-size: 100% auto;
        background-repeat: no-repeat;
        height: #{464rpx};
        position: relative;
        z-index: 50;
    }

    .fxhb-right {
        font-size: #{24rpx};
        color: #FFFFFF;
        float: right;

        view {
            background: rgba(0, 0, 0, .5);
            border-radius: #{28rpx} 0 0 #{28rpx};
            line-height: #{56rpx};
            text-align: center;
            width: #{136rpx};
            margin-top: #{24rpx};
        }
    }

    .fxhb-start {
        position: fixed;
        width: 100%;
        left: 0;
        top: #{380rpx};
        height: 100%;
        z-index: 10;
    }

    .hongbao {
        position: relative;
        width: 100%;
        left: 0;
        height: 100%;
        z-index: 51;

        .hongbao-content {
            font-size: #{36rpx};
            padding: #{350rpx} #{25rpx} 0 #{25rpx};
            background-size: 100% auto;
            background-repeat: no-repeat;
            width: #{602rpx};
            height: #{712rpx};
            text-align: center;

            .hongbao-desc {
                margin-bottom: #{100rpx};
                line-height: 1.5;
                color: #ffe15d;
                font-size: 13pt;
            }
        }

        .hongbao-btn {
            background-image: url("./../image/open_hongbao_btn.png");
            line-height: #{96rpx};
            height: #{96rpx};
            width: #{416rpx};
            background-repeat: no-repeat;
            background-size: 100% 100%;
            text-align: center;
        }
    }

    .fxhb-box {
        margin-top: #{-68rpx};
        background: #fe6b2e;

        .detail-info {
            background: rgba(255, 255, 255, 0.9);
            border-radius: #{16rpx};
            margin: 0 #{24rpx};
            padding: #{50rpx};
            z-index: 100;
            position: relative;
        }

        .user-list {
            overflow: hidden;
            margin-bottom: #{16rpx};

            .user-item {
                border: #{2rpx} solid #ff5c5c;
                width: #{104rpx};
                height: #{104rpx};
                margin-left: #{23rpx};
                margin-right: #{23rpx};
                margin-bottom: #{40rpx};
                display: inline-block;
                overflow: hidden;
                border-radius: #{999rpx};
                background-color: #fff;
                float: left;
            }

            .none {
                border-style: none;
            }

            image {
                width: 100%;
                height: 100%;
            }
        }

        .detail-info-text {
            text-align: center;
            color: #666666;
            font-size: #{28rpx};
        }

        .detail-time-text {
            color: #999999;
            text-align: center;
            margin-top: #{24rpx};
            margin-bottom: #{40rpx};
            font-size: #{28rpx};
        }

        .icon-detail-time {
            background-size: 100% 100%;
            background-image: url("./../image/cry.png");
            width: #{190rpx};
            height: #{168rpx};
            margin-top: #{48rpx};
            margin-bottom: #{32rpx};
        }
    }

    .more-goods {
        padding-bottom: #{32rpx};
        color: #FFFFFF;
        font-size: #{24rpx};
        margin-top: #{48rpx};

        .tt-goods {
            margin-bottom: #{12rpx};
        }

        .line {
            height: #{1px};
            width: #{40rpx};
            background: #FFFFFF;
            margin: 0 #{24rpx};
        }

        .icon-love {
            width: #{24rpx};
            height: #{24rpx};
            background-size: 100% 100%;
            background-repeat: no-repeat;
            margin-right: #{12rpx};
            background-image: url("./../image/love.png");
        }

    }

    .detail-error {
        margin-top: #{40rpx};
    }

    .award-list {
        margin-top: #{32rpx} !important;
        padding-top: #{48rpx} !important;
        color: #353535;
        padding-bottom: #{56rpx} !important;

        .list {
            margin-top: #{40rpx};
        }

        .list-line {
            width: #{176rpx};
            height: #{2rpx};
            background: #dbdbdb;
        }

        .list-text {
            font-size: #{32rpx};
            padding: 0 #{50rpx};
        }

        .user-avatar {
            width: #{80rpx};
            height: #{80rpx};
            border-radius: 50%;
            margin-right: #{20rpx};
        }

        .best {
            color: #ffb82f;
            font-size: #{28rpx};
            margin-top: #{10rpx};
            .user-pond {
                width: #{40rpx};
                height: #{30rpx};
                margin-right: #{10rpx};
                background-image: url("./../image/best_icon.png");
                background-repeat: no-repeat;
                background-size: 100% auto;
            }
        }
    }

    .coupon-set {
        margin-top: #{24rpx};
        .icon-right {
            width: #{12rpx};
            height: #{22rpx};
            margin-left: #{10rpx};
            background-image: url("../../../static/image/icon/arrow-right-white.png");
            background-repeat: no-repeat;
            background-size: 100% auto;
        }
    }
    .coupon {
        margin-top: #{32rpx};
        background-size: 100% 100%;
        height: #{190rpx};
        background-repeat: no-repeat;
        background-image: url("./../image/coupon.png");
        margin-bottom: #{24rpx};
        .coupon-title {
            font-size: #{48rpx};
            padding-left: #{56rpx};
            color: #8f4c1a;
            margin-bottom: #{16rpx};
        }
        .coupon-desc {
            font-size: #{28rpx};
            padding-left: #{56rpx};
            color: #8f4c1a;
        }
        .coupon-unit {
            font-size: #{50rpx};
            line-height: 1.35;
            color: #ff5c5c;
            padding-bottom: #{2rpx};
        }
        .coupon-money {
            font-size: #{80rpx};
            line-height: 1;
            font-weight: bold;
            padding-right: #{56rpx};
            color: #ff5c5c;
        }
    }
    .act-modal {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 2001;
        transition: 200ms;
        .show {
            visibility: visible;
            opacity: 1;
        }
        .act-modal-bg {
            background: rgba(0, 0, 0, 0.5);
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }
        .act-modal-pic {
            background: rgba(0, 0, 0, 0.25);
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }
    }
    .modal-box {
        background-size: 100% 100%;
        background-repeat: no-repeat;
        height: #{816rpx};
        width: #{606rpx};
        text-align: center;
        font-size: #{40rpx};
        color: #666666;
        .modal-close {
            float: right;
            margin-top: #{32rpx};
            margin-right: #{32rpx};
            .icon-close {
                background-image: url("../../../static/image/icon/close.png");
                background-repeat: no-repeat;
                background-size: 100% auto;
                height: #{30rpx};
                width: #{30rpx};
            }
        }
        .modal-text {
            margin-top: #{448rpx};
            margin-bottom: #{28rpx};
        }
        .bold-num {
            font-size: #{54rpx};
            color: #ffc73f;
            line-height:1em;
            font-weight: bold;
        }
        .bold-money {
            font-size: #{68rpx};
            color: #ffc73f;
            line-height:1em;
            font-weight: bold;
        }
        .btn {
            margin-top: #{64rpx};
        }
    }
</style>