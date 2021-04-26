<template>
    <app-layout>
        <view v-if="!bargain" class="u-goods-detail"></view>
        <template v-if="bargain">
            <app-goods-banner :pic-list="bargain.pic_url" :share="bargain.share"
                              :goods_id="bargain.goods_id"
                              sign="bargain"
                              :video-url="bargain.video_url"></app-goods-banner>
            <view v-if="begin_list || end_list" class="main-center cross-center time-bg">
                <app-plugin-time-bar
                    :theme="getTheme"
                    :day="begin_list ? begin_list.d : end_list.d"
                    :hour="begin_list ? begin_list.h : end_list.h"
                    :minute="begin_list ? begin_list.m : end_list.m"
                    :second="begin_list ? begin_list.s : end_list.s"
                    :start_begin="begin_list ? '距活动开始' : '距活动结束'"
                >
                </app-plugin-time-bar>
            </view>
            <view class="goods" v-if="bargain">
                <view class="t-omit-three name">{{bargain.name}}</view>
                <view v-if="bargain.subtitle" class="goods-subtitle">
                    <view class="t-omit-three">{{bargain.subtitle}}</view>
                </view>
                <view class="dir-left-nowrap cross-center">
                    <view class="detail box-grow-1 dir-top-nowrap">
                        <view class="box-grow-0 dir-left-nowrap cross-bottom end">
                            <view>最低</view>
                            <view :style="{'color': getTheme.color}">￥</view>
                            <view class="price" :style="{'color': getTheme.color}">{{bargain.min_price}}</view>
                            <view class="del" v-if="isUnderlinePirce == 1">原价{{bargain.price}}</view>
                        </view>
                        <view class="box-grow-0 num dir-left-nowrap">
                            <view>库存:{{bargain.stock}}{{bargain.unit}}</view>
                            <view>已有{{bargain.join_num}}人参与砍价</view>
                        </view>
                    </view>
                    <view @click="shareClick" :style="{'background-color': getTheme.background}" class="share dir-left-nowrap main-center cross-center box-grow-0">
                        <image class="bd-icon box-grow-0" src="/static/image/icon/icon-share-white.png"></image>
                        <view class="box-grow-0">分享</view>
                    </view>
                    <view>
                        <app-share-qr-code :url="poster + `&goods_id=` + goods_id"
                                           v-model="shareShow"
                                           :has-poster-nav="true"
                                           :poster-config="poster_config + `&goods_id=` + goods_id"
                                           :poster-generate="poster_generate + `&goods_id=` + goods_id"
                                           :goods="bargain"
                                           @share="shareMessage"
                        ></app-share-qr-code>
                    </view>
                </view>
				<view>
					<bd-info-extra :theme="getTheme" :goods="bargain" :unit="bargain.unit" :min-number="0" :limit-buy="bargain.limit_buy"></bd-info-extra>
				</view>
            </view>
            <view class="attr-box">
                <view class="attr dir-left-nowrap">
                    <view class="box-grow-0 left cross-center dir-top-nowrap">
                        <view>商品信息</view>
                    </view>
                    <view class="box-grow-1 right dir-left-wrap">
                        <view class="attr-item" v-for="(item, index) in bargain.select_attr_group" :key="index">
                            {{item.attr_group_name + ':' + item.attr_name}}
                        </view>
                    </view>
                </view>
            </view>
            <bd-coupon @change="setCoupon" :theme="getTheme" :coupons="bargain.goods_coupon_center"></bd-coupon>
            <bd-xbc
                :guarantee-title="bargain.guarantee_title"
                :guarantee-pic="bargain.guarantee_pic"
                :param_content="bargain.param_content"
                :param_name="bargain.param_name"
                :services="bargain.service"
            ></bd-xbc>
            <bd-hc
                :integral="bargain.goods_marketing_award.integral"
                :coupon="bargain.goods_marketing_award.coupon"
                :card="bargain.goods_marketing_award.card"
                :balance="bargain.goods_marketing_award.balance"
                :theme="getTheme"
            ></bd-hc>
            <bd-kb
                :limit="bargain.goods_marketing.limit"
                :express="bargain.express"
                :shipping="bargain.goods_marketing.shipping"
                :pickup="bargain.goods_marketing.pickup"
            ></bd-kb>
            <view class="activity goods-margin" v-if="bargain.bargain_info">
                <view class="dir-left-nowrap cross-center">
                    <image class="box-grow-0 user-img" :src="userInfo.avatar" load-lazy></image>
                    <view class="dir-top-nowrap">
                        <view class="dir-left-nowrap">
                            <view>距本次砍价结束仅剩</view>
                            <view class="yellow">
                                <block v-if="finish_list">
                                    {{finish_list.d}}天{{finish_list.h}}：{{finish_list.m}}：{{finish_list.s}}
                                </block>
                                <block v-else>0天0：0：0</block>
                            </view>
                        </view>

                        <view v-if="bargain.bargain_info.now_price == bargain.bargain_info.min_price"
                              class="yellow">已砍至最低价，赶快优惠购买吧！
                        </view>
                        <view class="yellow" v-else>快让你的好友助你一臂之力！</view>
                    </view>
                </view>
                <view class="main-center">
                    <view class="current">当前价￥{{bargain.bargain_info.now_price}}</view>
                </view>
                <view class='progress-box'>
                    <view class='progress-view' :style="{width:bargain.bargain_info.bargain_price_per+'%'}"></view>
                </view>
                <view class='dir-left-nowrap price'>
                    <view class='box-grow-1'>原价￥{{bargain.bargain_info.price}}</view>
                    <view class='box-grow-0'>底价￥{{bargain.bargain_info.min_price}}</view>
                </view>
                <view class='info'>
                    <scroll-view class="user-scroll" scroll-y scroll-into-view="user"
                                 scroll-with-animation="true">
                        <block v-for="(v,k) in bargain.bargain_info.list" :key="k">
                            <view class="item dir-left-nowrap cross-center">
                                <image class='box-grow-0' :src="v.avatar" load-lazy></image>
                                <view class="box-grow-1 dir-left-nowrap cross-center">
                                    <view class="nickname">{{v.nickname}}</view>
                                    <view> 小刀一挥帮忙砍了</view>
                                    <view class="red">{{v.price}}</view>
                                    <view>元</view>
                                </view>
                            </view>
                        </block>
                    </scroll-view>
                </view>
            </view>
            <view class="circuit-label goods-margin dir-left-nowrap cross-center">
                <icon class="icon-circuit" type></icon>
                <view>砍价流程</view>
            </view>
            <view class="circuit-value dir-left-nowrap main-center">
                <block v-for="(v,k) in circuit" :key="k">
                    <view class="cross-center dir-top-nowrap">
                        <image :src="v.url" :class="v.name ? 'icon-circuit-i' : 'icon-circuit-j'"></image>
                        <view class="box-grow-0 name">{{v.name}}</view>
                    </view>
                </block>
            </view>
            <view class="circuit-label goods-margin dir-left-nowrap cross-center">
                <icon class="icon-circuit" type></icon>
                <view>活动说明</view>
            </view>
            <view class="activity-time">
                <view>本活动开始时间{{bargain.begin_time}}</view>
                <view>本活动结束时间{{bargain.end_time}}</view>
            </view>
            <view class="circuit-label goods-margin dir-left-nowrap cross-center">
                <icon class="icon-circuit" type></icon>
                <view>商品详情</view>
            </view>
            <view class="bd-detail">
                <app-rich-text :content="bargain.detail"></app-rich-text>
            </view>
            <!-- 底部空格 -->
            <view class="safe-area-inset-bottom">
                <view class="u-bottom-height"></view>
            </view>
            <!-- 底部按钮 -->
            <view v-if="is_open" class="safe-area-inset-bottom u-bottom-fixed">
                <view class="bargain-goods-bottom main-center cross-center">
                    <block v-if="bargain.bargain_info">
                        <block v-if="bargain.bargain_info.min_price < bargain.bargain_info.now_price">
                            <view @click="submit" class="btn shop" :style="{'background-color': getTheme.background_s,'color': getTheme.secondary_text}">立即购买</view>
                            <view @click="bargainFriend" class="btn friend" :class="getTheme.key === 'a' ? 'default-friend' : ''"
                                  :style="{'background-color': getTheme.key != 'a' ? getTheme.background : '','color': getTheme.key != 'a' ? getTheme.main_text : '#ffffff'}">找人帮砍</view>
                        </block>
                        <view v-else @click="submit" class="btn" :class="getTheme.key === 'a' ? 'default-btn' : ''" :style="{'background-color': getTheme.key != 'a' ? getTheme.background : '','color': getTheme.main_text}">立即购买</view>
                    </block>
                    <block v-else>
                        <view v-if="bargain.stock == 0" class="btn" style="background: #CDCDCD;color: #fff;">已售罄</view>
                        <view v-else-if="compareTime === 'no-start'" class="btn" style="background: #CDCDCD;color: #fff;">未开始
                        </view>
                        <view v-else-if="compareTime === 'end'" class="btn" style="background: #CDCDCD;color: #fff;">已结束</view>
                        <view v-else @click="subscribe" class="btn" :class="getTheme.key === 'a' ? 'default-btn' : ''" :style="{'background-color': getTheme.key != 'a' ? getTheme.background : '','color': getTheme.main_text}">立即砍价
                        </view>
                    </block>
                </view>
            </view>
        </template>
        <app-close v-if="showClose" :modal="false" @update="getMall"></app-close>
    </app-layout>
</template>

<script>

import {mapGetters, mapState} from 'vuex';
import appQuickNavigation from "../../../components/page-component/app-quick-navigation/app-quick-navigation";
import appRichText from "../../../components/basic-component/app-rich/parse.vue";
import appGoodsBanner from "../../../components/page-component/goods/app-goods-banner.vue";
import appShareQrCode from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
import appPluginTimeBar from '../components/app-plugin-time-bar.vue';
import bdCoupon from '@/components/page-component/goods/bd-coupon.vue';
import bdXbc from '@/components/page-component/goods/bd-xbc.vue';
import bdKb from '@/components/page-component/goods/bd-kb.vue';
import bdHc from '@/components/page-component/goods/bd-hc.vue';
import bdComments from '@/components/page-component/goods/bd-comments.vue';
import appClose from '@/components/basic-component/app-close/app-close.vue';
import bdInfoExtra from '@/components/page-component/goods/bd-info-extra.vue';

export default {
    name: "goods",
    components: {
        appQuickNavigation,
        appRichText,
        appGoodsBanner,
        appShareQrCode,
        appPluginTimeBar,
        appClose,
        bdCoupon,
        bdXbc,
        bdKb,
        bdHc,
        bdComments,
		bdInfoExtra
    },
    computed: {
        ...mapState({
            appImg: state => state.mallConfig.plugin.bargain.app_image,
            userInfo: state => state.user.info,
            isUnderlinePrice: state => state.mallConfig.mall.setting.is_underline_price,
        }),
        ...mapState('gConfig', {
            iphone: (data) => {
                return data.iphone;
            },
            iphoneHeight: (state) => {
                return state.iphoneHeight;
            },
        }),
        ...mapGetters('mallConfig', {
            getTheme: 'getTheme',
        }),
        compareTime() {
            if (this.bargain) {
                let {begin_time, end_time} = this.bargain;

                function getStamp(time = '') {
                    if (time) {
                        time = time.trim().substring(0, 19);
                        time = time.replace(/-/g, '/');
                        return new Date(time).getTime();
                    }
                    return new Date().getTime();
                }

                let begin_time_stamp = getStamp(begin_time)
                let end_time_stamp = getStamp(end_time)
                let time_stamp = getStamp();
                if (begin_time_stamp <= time_stamp && time_stamp < end_time_stamp) {
                    return '';
                }
                if (time_stamp >= end_time_stamp) {
                    return 'end';
                }
                if (time_stamp < begin_time_stamp) {
                    return 'no-start';
                }
            }
            return '';
        },
    },

    data() {
        return {
            showClose: false,
            is_open: false,
            timeIntegral: null,
            goods_id: '',
            bargain: null,
            finish_list: null,
            begin_list: null,
            end_list: null,

            shareShow: false,
            title: '砍价',
            page: 1,

            circuit: [{
                name: '点击砍价',
                url: './../image/bargain-click.png',
            }, {
                name: '',
                url: './../image/bargain-jiantou.png',
            }, {
                name: '找人砍价',
                url: './../image/bargain-help.png',
            }, {
                name: '',
                url: './../image/bargain-jiantou.png',
            }, {
                name: '价格合适',
                url: './../image/bargain-price.png',
            }, {
                name: '',
                url: './../image/bargain-jiantou.png',
            }, {
                name: '优惠购买',
                url: './../image/bargain-buy.png'
            }],
            goods: {},
            poster: this.$api.bargain.poster,
            isUnderlinePirce: 0,
            poster_config: this.$api.bargain.poster_config,
            poster_generate: this.$api.bargain.poster_generate,
        }
        },
    onLoad(options) { this.$commonLoad.onload(options);
        // #ifdef MP-WEIXIN
        wx.showShareMenu({
            menus: ['shareAppMessage', 'shareTimeline']
        })
        // #endif
        const self = this;
        this.$store.dispatch('user/info');
        this.goods_id = options.goods_id;

        this.$showLoading();
        this.$request({
            url: this.$api.bargain.goods_detail,
            data: {
                goods_id: this.goods_id,
            }
        }).then(info => {
            self.$hideLoading();
            if (info.code === 0) {
                self.bargain = info.data.bargain;
                self.goods = self.bargain.goods
                // #ifdef H5
                this.shareMessage();
                // #endif
                //定时器
                let func = function () {
                    self.begin_list = self.setTimeStart(self.bargain.begin_time);
                    self.end_list = self.setTimeStart(self.bargain.end_time);
                    if (self.bargain.bargain_info) {
                        self.finish_list = self.setTimeStart(self.bargain.bargain_info.finish_at);
                    }
                };
                func();
                self.timeIntegral = setInterval(() => {
                    func();
                }, 1000);
            } else {
                uni.showToast({icon: 'none', title: info.msg});
                uni.navigateBack();
            }
        }).catch(() => {
            self.$hideLoading();
        });
    },

    onShow() {
        this.showClose = false;
        setTimeout(()=>{
            this.showClose = true;
        })
    },
    onUnload() {
        clearInterval(this.timeIntegral);
    },
    // #ifdef MP
    onShareAppMessage() {
        return this.shareMessage();
    },
    // #endif
    // #ifdef MP-WEIXIN
    onShareTimeline() {
        return this.$shareTimeline({
            title: this.bargain.goods.app_share_title ? this.bargain.goods.app_share_title : this.bargain.name,
            query: {
                goods_id: this.bargain.goods_id
            }
        });
    },
    // #endif
    methods: {
        shareMessage(s = false){
            return this.$shareAppMessage({
                title: this.bargain.goods.app_share_title ? this.bargain.goods.app_share_title : this.bargain.name,
                path: '/plugins/bargain/goods/goods',
                imageUrl: this.bargain.goods.app_share_pic ? this.bargain.goods.app_share_pic : this.bargain.cover_pic,
                desc: this.bargain.subtitle,
                params: {
                    goods_id: this.bargain.goods_id
                }
            }, s);
        },
        getMall(e) {
            this.is_open = e.is_open == 1 ? true : false;
        },
        bargainFriend() {
            uni.navigateTo({url: '/plugins/bargain/activity/activity?id=' + this.bargain.bargain_info.bargain_order_id});
        },
        setTimeStart: function (e) {
            let time = e.replace(/-/g, '/');
            let diff_time = parseInt((new Date(time).getTime() - new Date().getTime()) / 1000)
            let day = 0, hour = 0, minute = 0, second = 0;

            if (diff_time > 0) {
                day = Math.floor(diff_time / (60 * 60 * 24));
                hour = Math.floor(diff_time / (60 * 60)) - (day * 24);
                minute = Math.floor(diff_time / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(diff_time) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            } else {
                return null;
            }
            return {
                d: day.toString(),
                h: hour < 10 ? ('0' + hour) : hour.toString(),
                m: minute < 10 ? ('0' + minute) : minute.toString(),
                s: second < 10 ? ('0' + second) : second.toString(),
            };
        },

        subscribe: function () {
            const self = this;
			if (typeof this.bargain.limit_buy !== 'undefined' && this.bargain.limit_buy.status == 1 && this.bargain.limit_buy.rest_number < 1) {
				this.$tips.showToast({
					title: this.bargain.limit_buy.text,
					icon: 'none'
				});
				return false;
			}
            this.$subscribe(this.bargain.template_message).then(res => {
                self.save();
            }).catch(() => {
                self.save();
            });
        },

        save: function () {
            const self = this;
            self.$showLoading();
            self.$request({
                url: self.$api.bargain.bargain_submit,
                data: {
                    goods_id: self.bargain.goods_id
                },
            }).then(info => {
                self.$hideLoading();
                if (info.code == 0) {
                    self.bargainResult(info);
                } else {
                    uni.showToast({icon: 'none', title: info.msg});
                }
            }).catch(e => {
                self.$hideLoading();
            });
        },

        bargainResult(data) {
            const self = this;
            self.$showLoading();
            self.$request({
                url: self.$api.bargain.bargain_result,
                data: {
                    queueId: data.data.queueId,
                    token: data.data.token,
                },
            }).then(info => {
                if (info.code === 0) {
                    if (info.data.retry) {
                        setTimeout(() => {
                            self.bargainResult(data);
                        }, 1000);
                        return;
                    }
                    self.$hideLoading();
                    uni.redirectTo({
                        url: '/plugins/bargain/activity/activity?order_id=' + info.data.bargain_order_id,
                    })
                } else {
                    self.$hideLoading();
                    uni.showToast({icon: 'none', title: info.msg});
                }
            }).catch(e => {
                self.$hideLoading();
            });
        },

        submit: function () {
            const bargain = this.bargain;
            const mchList = [{
                "mch_id": 0,
                "bargain_order_id": bargain.bargain_info.bargain_order_id,
                "goods_list": [{
                    "id": bargain.goods_id,
                    "attr": [],
                    "num": 1,
                    "cart_id": 0,
                    "goods_attr_id": bargain.goods_attr_id
                }]
            }];
            uni.navigateTo({
                url: '/pages/order-submit/order-submit?mch_list=' +
                    JSON.stringify(mchList) +
                    '&preview_url=' + encodeURIComponent(this.$api.bargain.order_preview) +
                    '&submit_url=' + encodeURIComponent(this.$api.bargain.order_submit)
            });
        },

        shareClick() {
            this.shareShow = true;
        },

        setCoupon(index) {
            this.$set(this.bargain.goods_coupon_center[index], 'is_receive', 1);
        }
    }
}
</script>

<style scoped lang="scss">
    .time-bg {
        width: 100%;
        height: #{88rpx};
        .icon-time {
            position: relative;
            height: 100%;
            width: #{710rpx};
            background-repeat: no-repeat;
            background-size: 100% auto;
        }

        .time-desc {
            position: absolute;
            font-size: #{26rpx};
            left: 0;
            right: 0;
            margin: 0 auto;
            color: #353535;
        }

        .time-box {
            height: #{42rpx};
            color: #fff;
            width: #{46rpx};
            line-height: #{42rpx};
            text-align: center;
            background-color: #666;
            border-radius: #{4rpx};
            margin: 0 #{10rpx};
        }
    }

    .activity {
        font-size: #{28rpx};
        color: #353535;
        padding: #{24rpx};
        background: #FFFFFF;
        width: 702upx;
        border-radius: 15upx 15upx 0 0;
        margin: 24upx 24upx 0 24upx;
        .user-img {
            height: #{96rpx};
            width: #{96rpx};
            display: block;
            margin-right: #{34rpx};
        }

        .yellow {
            color: #ff8c40;
        }

        .current {
            margin-top: #{20rpx};
            font-size: #{38rpx};
            color: #ff4544;
        }

        .progress-box {
            width: 100%;
            height: #{40rpx};
            border-radius: #{20rpx};
            border: #{1px} solid #ff5c5c;
            overflow: hidden;
            margin-top: #{28rpx};
            margin-bottom: #{16rpx};
        }

        .progress-view {
            width: 50%;
            height: 100%;
            border-radius: #{20rpx};
            background-color: #ff9f9f;
        }

        .price {
            font-size: #{26rpx};
            color: #666666;
            padding-bottom: #{20rpx};
        }
    }

    .goods {
        width: 702upx;
        border-radius: 15upx 15upx 0 0;
        margin: 24upx 24upx 0 24upx;
        background: #FFFFFF;
        padding: #{32rpx} #{24rpx} #{40rpx};
        color: #999999;

        .name {
            color: #353535;
            margin-bottom:#{32rpx};
            font-size: #{32rpx};
        }
        .goods-subtitle {
            font-size: 24rpx;
            background-color: #ffffff;
            color: #999999;
            margin-bottom:#{24rpx};
        }

        .detail {
            color: #999999;
            font-size: #{28rpx};

            .end {
                line-height: 1;
            }

            .red {
                color: #ff4544;
            }

            .price {
                font-size: #{46rpx};
            }

            .del {
                margin-left: #{16rpx};
                text-decoration: line-through;
            }

            .num {
                margin-top: #{32rpx};
            }

            .num view:first-child {
                margin-right: #{32rpx};
            }
        }

        .share {
            margin-right: #{-24rpx};
            height: #{48rpx};
            border-radius: #{40rpx} 0 0 #{40rpx};
            padding: 0 #{14rpx};
            width: #{103rpx};

            .bd-icon {
                height: #{22rpx};
                width: #{22rpx};
            }

            view {
                font-size: #{22rpx};
                color: #ffffff;
                margin-left: #{10rpx};
            }
        }
    }

    .circuit-label {
        height: #{88rpx};
        color: #ff4544;
        width: 702upx;
        margin: 24upx 24upx 0 24upx;
        font-size: #{32rpx};
        background: #FFFFFF;
        border-bottom: #{1px} solid #e2e2e2;

        .icon-circuit {
            height: #{34}rpx;
            width: #{34rpx};
            background-image: url("./../image/bargain-flow.png");
            background-repeat: no-repeat;
            background-size: 100% auto;
            margin: 0 #{16rpx};
        }
    }

    .user-scroll {
        max-height: #{264rpx};
    }

    .info {
        width: 100%;
        border-radius: #{16rpx};
        background-color: #fff7f7;
        padding: #{32rpx} #{24rpx};

        .nickname {
            max-width: #{200rpx};
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
        }

        .red {
            color: #ff4544;
        }

        image {
            width: #{64rpx};
            height: #{64rpx};
            margin-right: #{24rpx};
        }


        .item {
            margin-bottom: #{32rpx};
        }

        .item:last-child {
            margin-bottom: 0;
        }
    }

    .circuit-value {
        padding-top: #{20rpx};
        background: #FFFFFF;
        padding-bottom: #{30rpx};
        width: 702upx;
        border-radius: 0 0 15upx 15upx;
        margin: 0 24upx;
        .icon-circuit-i {
            height: #{72rpx};
            width: #{72rpx};
        }

        .name {
            font-size: #{24rpx};
            color: #999999;
            margin-top: #{20rpx};
        }

        .icon-circuit-j {
            margin-top: #{19rpx};
            height: #{34rpx};
            width: #{52rpx};
        }

        > view {
            margin: 0 #{10rpx}
        }
    }

    .activity-time {
        padding-bottom: #{40rpx};
        background: #FFFFFF;
        padding-left: #{20rpx};
        width: 702upx;
        border-radius: 0 0 15upx 15upx;
        margin: 0 24upx;
        view {
            padding-top: #{28rpx};
            font-size: #{28rpx};
            color: #666666;
        }

        view:before {
            content: '●';
            margin-right: #{20rpx};
        }
    }

    .bargain-goods-bottom {
        height: #{120rpx};
        width: 100%;
        background: #FFFFFF;
        .btn {
            font-size: #{32rpx};
            height: #{80rpx};
            line-height: #{80rpx};
            text-align: center;
            width: #{702rpx};
            border-radius: #{40rpx};
        }

        .default-btn {
            background: linear-gradient(#ff9292, #fc6969);
        }

        .btn.shop {
            width: #{346rpx};
        }

        .btn.friend {
            width: #{346rpx};
            margin-left: #{12rpx};
        }
        .default-friend {
            background: linear-gradient(#ffc46b, #ffa13c);
            color: #ffffff;
        }
    }
    .attr-box {
        width: 702upx;
        margin: 0 24upx 0 24upx;
        border-radius: 0 0 15upx 15upx;
        padding: #{0 24rpx};
        background: #ffffff;
        .attr {
            padding: #{28rpx 0};
            border-top: #{1rpx solid #eeeeee};

            .left {
                color: #666666;
                margin-right: #{24rpx};
                font-size: $uni-font-size-weak-one;

                view {
                    border: #{1rpx solid #666666};
                    padding: #{8rpx 16px};
                    -webkit-border-radius: #{30rpx};
                    -moz-border-radius: #{30rpx};
                    border-radius: #{30rpx};
                }
            }

            .right {
                font-size: $uni-font-size-general-two;
                margin-top: #{10rpx};

                .attr-item {
                    margin-right: #{10rpx};
                }
            }
        }
    }

    .text {
        color: #ffffff;
    }

    .goods-margin {
        margin-top: 20upx;
    }
    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 999;
        background-color: #ffffff;
    }
    .u-bottom-height {
        height: 110upx;
    }

    .bd-detail {
        width: 702upx;
        background-color: #ffffff;
        padding: 20upx 0;
        margin: 0 24upx;
        border-radius: 0 0 15upx 15upx;
    }

</style>
