<template>
    <app-layout>
        <view v-if="!goods" class="u-goods-detail"></view>
        <template v-else>
            <view class="goods-head-box">
                <app-goods-banner :pic-list="goods.pic_url" :share="goods.share"
                                  :goods_id="lottery_id"
                                  sign="lottery"
                                  :video-url="goods.video_url"></app-goods-banner>
                <view class="time main-center">
                    <view v-if="user_log === null || user_log.status <= 1"
                          class="time-info dir-left-nowrap cross-center">
                        <icon class="icon" type></icon>
                        <view v-if="new_status == 2">距活动开始：</view>
                        <view v-else>距活动结束：</view>
                        <text v-if="times.day>0 || times.hour>0">{{times.day}}天{{times.hour}}小时</text>
                        <text v-if="times.day==0 && times.hour==0">{{times.minute}}分{{times.second}}秒</text>
                    </view>
                    <view v-else class="time-info time-error dir-left-nowrap cross-center">
                        <icon class="icon" type></icon>
                        <view>活动已结束</view>
                    </view>
                </view>
            </view>
            <view class="goods" v-if="goods">
                <view class="u-line-2 name">{{goods.name}}</view>
                <view v-if="goods.subtitle" class="goods-subtitle">
                    <view class="t-omit-three">{{goods.subtitle}}</view>
                </view>
                <view class="dir-left-nowrap">
                    <view class="detail box-grow-1">
                        <view class="dir-left-nowrap box-grow-0">
                            <text>共</text>
                            <text class="bold">{{lottery.stock}}</text>
                            <text>份</text>
                            <view class="num">{{goods.num}}人参与</view>
                        </view>
                        <view class="price dir-left-nowrap box-grow-0">
                            <view class="box-grow-0">免费</view>
                            <view class="box-grow-0 del" v-if="isUnderlinePrice">售价￥{{goods.original_price}}</view>
                        </view>
                    </view>
                    <view @click="shareClick"
                          :style="{'background-color': getTheme.background}"
                          class="share dir-left-nowrap main-center cross-center">
                        <image class="share-icon box-grow-0" src="/static/image/icon/icon-share-white.png"></image>
                        <text class="share-text box-grow-0">分享</text>
                    </view>

                    <app-share-qr-code :url="poster + `&goods_id=` + goods.id"
                                       :has-poster-nav="true"
                                       :poster-config="poster_config + `&goods_id=` + goods.id"
                                       :poster-generate="poster_generate + `&goods_id=` + goods.id"
                                       v-model="shareShow"
                                       :goods="goods"
                                       @share="hShareAppMessage"
                    ></app-share-qr-code>
                </view>
            </view>
            <!-- 规格信息 -->
            <view class="lottery-attr">
                <view class="box cross-center">
                    <view class="border box-grow-0">商品信息</view>
                    <view class="text dir-left-wrap t-omit">
                        <block v-for="(value,key) in goods.attr_list" :key="key">
                            <text>{{value.attr_group_name}}：{{value.attr_name}}</text>
                        </block>
                    </view>
                </view>
            </view>
            <view @click="qrcode" class="lottery-share" v-if="setting.cs_status ===1 && setting.cs_prompt_pic">
                <image :src="setting.cs_prompt_pic" mode="aspectFit" load-lazy></image>
            </view>
            <view class="step cross-center dir-left-nowrap" @click="rule">
                <view class="box-grow-1">抽奖流程</view>
                <view class="cross-center">
                    <icon class="icon-right box-grow-0" type></icon>
                </view>
            </view>
            <view class="step-info dir-left-nowrap">
                <block v-for="(v,k) in rule_list" :key="k">
                    <view class="box-grow-1 dir-left-nowrap main-center cross-center">
                        <view class="label">{{v.key}}</view>
                        <text class="value">{{v.value}}</text>
                    </view>
                </block>
            </view>
            <view v-if="lucky_list" class="dir-top-nowrap lucky-all">
                <view class='box-grow-1'>实时幸运码</view>
                <view class='box-grow-1 friend'>邀请好友参与，额外获赠幸运码，提高中奖率哦！</view>
                <swiper v-if="lucky_list.length" class='swiper' :class="[lucky_list.length > 1?'':'swiper-one']"
                        :display-multiple-items="lucky_list.length > 1 ? 2: 1" vertical="true"
                        autoplay="true"
                        interval="2000" duration="500" circular="true">
                    <block v-for="(v,k) in lucky_list" :key="k">
                        <swiper-item style="height: 50%" @touchmove='catchTouchMove'>
                            <view class="dir-left cross-center lucky-code">
                                <image class="box-grow-0" :src="v.user.userInfo.avatar" load-lazy></image>
                                <view class="box-grow-1 t-omit nickname">{{v.user.nickname}}</view>
                                <view class="box-grow-0 font-normal">{{v.lucky_num}}个幸运码</view>
                            </view>
                        </swiper-item>
                    </block>
                </swiper>
            </view>
<!--            <bd-kb-->
<!--                :limit="detail.goods_marketing.limit"-->
<!--                :express="detail.express"-->
<!--                :shipping="detail.goods_marketing.shipping"-->
<!--                :pickup="detail.goods_marketing.pickup"-->
<!--            ></bd-kb>-->
<!--            <view class="app-goods-marketing">-->
<!--                <app-goods-marketing :express="goods.express"></app-goods-marketing>-->
<!--            </view>-->
            <view class="goods-rule">商品详情</view>
            <view class="rule-info">
                <app-rich-text :content="goods.detail"></app-rich-text>
            </view>
            <!-- 底部空格 -->
            <view class="safe-area-inset-bottom">
                <view class="u-bottom-height"></view>
            </view>
            <!-- 底部按钮 -->
            <view class="safe-area-inset-bottom u-bottom-fixed">
                <view class='bd-bottom main-center cross-center'>
                    <view class='bd-btn bd-bottom-first' :style="{'background-color': getTheme.background_s,'color': getTheme.secondary_text}" @click='buyNow'>直接购买</view>
                    <view v-if="new_status == 2" class="bd-btn  bd-btn-end bd-color">尚未开始</view>
                    <view v-else-if="lottery.type == 1" class="bd-btn bd-btn-end bd-color">已结束</view>
                    <view v-else-if="lottery.status == 0" class="bd-btn bd-btn-end bd-color">已关闭</view>
                    <view v-else-if="user_log == null" class="bd-btn bd-color" :style="{'background-color': getTheme.background,'color': getTheme.main_text}"
                          @click='validateIntegral'>立即抽奖
                    </view>
                    <view v-else-if="user_log.status <= 1" class="bd-btn bd-btn-end bd-color">已参与</view>
                    <view v-else class="bd-btn bd-btn-end bd-color">已结束</view>
                </view>
            </view>
            <view v-if="award_bg" class="animation-model main-center cross-center">
                <u-mask :maskClickAble="false" :show="award_bg"></u-mask>
                <view @click="prize" class="main-center detaill" @touchmove.stop.prevent>
                    <view class="ani_box" :animation="animation_trans_lottery">
                        <image :src="appImg.lottery_box"></image>
                    </view>
                </view>
                <image class="boxbg" :src="appImg.lottery_boxbg" @touchmove.stop.prevent></image>
            </view>
        </template>
        <integral-model ref="integralModel" :text="lottery.deplete_integral_num + '积分'" @next="subscribe"></integral-model>
    </app-layout>
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import appQuickNavigation from "../../../components/page-component/app-quick-navigation/app-quick-navigation";
import appRichText from "../../../components/basic-component/app-rich/parse.vue";
import appGoodsBanner from "../../../components/page-component/goods/app-goods-banner.vue";
import appShareQrCode from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
import uMask from '../../../components/basic-component/u-mask/u-mask.vue';
import integralModel from "../integral-model.vue";

export default {
    name: "goods",
    components: {
        appQuickNavigation,
        appRichText, appGoodsBanner,
        appShareQrCode,
        uMask,
        integralModel
    },
    computed: {
        ...mapGetters('mallConfig', {
            getTheme: 'getTheme',
        }),
        ...mapState({
            appImg: state => state.mallConfig.plugin.lottery.app_image,
            isUnderlinePrice: state => state.mallConfig.mall.setting.is_underline_price,
            userInfo: state => state.user.info,
        })
    },
    data() {
        let integral_time, integral_animation;
        return {
            integral_time,
            integral_animation,
            animation_trans_lottery: null,
            rule_list: [
                {key: 1, value: "参与\n抽奖"},
                {key: 2, value: "等待\n开奖"},
                {key: 3, value: "幸运\n中奖"},
                {key: 4, value: "下单\n收礼"}
            ],
            times: {},
            poster: this.$api.lottery.poster,
            user_log: null,
            lottery: null,
            goods: null,
            lucky_list: null,
            lottery_id: '',
            award_bg: '',
            shareShow: false,
            setting: {},
            new_status: 0,
            template_message: null,
            poster_config: this.$api.lottery.poster_config,
            poster_generate: this.$api.lottery.poster_generate,
        }
    },
        onHide() {
            clearInterval(this.integral_time)
        },
        onUnload() {
            clearInterval(this.integral_time);
        },
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            return this.$shareTimeline({
                title: this.goods.app_share_title ? this.goods.app_share_title : this.goods.name,
                imageUrl: this.goods.app_share_pic,
                query: {
                    lottery_id: this.lottery_id,
                }
            });
        },
        // #endif
        onLoad(options) {
            this.$commonLoad.onload(options);
            var that = this;
            that.$event.on(that.$const.EVENT_USER_LOGIN).then(() => {
                that.start(options);
            });
            that.start(options);
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.hShareAppMessage();
        },
        // #endif
        methods: {
            start(options) {
                this.lottery_id = options.lottery_id;
                // #ifdef MP-WEIXIN
                wx.showShareMenu({
                    withShareTicket: true,
                    menus: ['shareAppMessage', 'shareTimeline']
                })
                // #endif
                this.getSetting();
                this.clerk(options.user_id);
                this.$showLoading({title: '加载中'});
                this.$request({
                    url: this.$api.lottery.goods,
                    data: {
                        lottery_id: this.lottery_id
                    }
                }).then(info => {
                    this.$hideLoading();
                    if (info.code === 0) {
                        [
                            this.goods,
                            this.lottery,
                            this.lucky_list,
                            this.user_log,
                            this.new_status,
                            this.template_message,
                        ] = [
                            info.data.goods,
                            info.data.lottery,
                            info.data.lucky_list,
                            info.data.user_log,
                            info.data.new_status,
                            info.data.template_message,
                        ];
                        // #ifdef H5
                        this.hShareAppMessage();
                        // #endif
                        uni.setNavigationBarTitle({
                            title: this.goods.name
                        });
                        this.setTimeStart(this.new_status == 2 ? this.lottery.start_at : this.lottery.end_at);
                    } else {
                        uni.showToast({icon: 'none', title: info.msg});
                    }
                }).catch(() => {
                    this.$hideLoading();
                });
            },
            hShareAppMessage(s = false) {
                return this.$shareAppMessage({
                    title: this.goods.app_share_title ? this.goods.app_share_title : this.goods.name,
                    imageUrl: this.goods.app_share_pic ? this.goods.app_share_pic : this.goods.pic_url[0].pic_url,
                    path: '/plugins/lottery/goods/goods',
                    desc: this.goods.subtitle,
                    params: {
                        lottery_id: this.lottery.id,
                    }
                }, s);
            },
            qrcode() {
                uni.navigateTo({url: `/plugins/lottery/qrcode/qrcode`})
            },
            validateIntegral() {
                let deplete_integral_num = Number(this.lottery.deplete_integral_num);
                if (deplete_integral_num > 0) {
                    this.$refs.integralModel.showModel();
                } else {
                    this.subscribe();
                }
            },
            prize() {
                uni.navigateTo({url: `/plugins/lottery/detail/detail?lottery_id=` + this.lottery.id});
                clearInterval(this.lotteryInter);
                this.award_bg = false;
            },
            rule() {
                uni.navigateTo({
                    url: `/pages/rules/index?url=${encodeURIComponent(this.$api.lottery.setting)}&keys=${JSON.stringify(['setting', 'rule'])}`,
                });
            },
            catchTouchMove() {
                return false;
            },
            getSetting: function () {
                const self = this;
                self.$request({
                    url: self.$api.lottery.setting,
                }).then(info => {
                    if (info.code === 0) {
                        self.setting = info.data.setting;
                    }
                });
            },

            clerk(user_id) {
                const self = this;
                if (!user_id) return

                self.$request({
                    url: self.$api.lottery.clerk,
                    data: {
                        user_id,
                        lottery_id: self.lottery_id,
                    },
                    method: 'POST',
                });
            },

            setTimeStart(info) {
                const self = this;
                clearInterval(self.integral_time);
                let func = function (info) {
                    let time = info.replace(/-/g, '/');
                    let diff_time = parseInt((new Date(time).getTime() - new Date().getTime()) / 1000);
                    let day = 0, hour = 0, minute = 0, second = 0;

                    if (diff_time > 0) {
                        day = Math.floor(diff_time / (60 * 60 * 24));
                        hour = Math.floor(diff_time / (60 * 60)) - (day * 24);
                        minute = Math.floor(diff_time / 60) - (day * 24 * 60) - (hour * 60);
                        second = Math.floor(diff_time) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                    }

                    self.times = {day, hour, minute, second};
                    if (self.times <= 0) {
                        clearInterval(self.integral_time)
                    }
                };
                func(info);
                self.integral_time = setInterval(() => {
                    func(info)
                }, 1000)
            },
            subscribe: function () {
                if (this.award_bg) return;
                const self = this;
                self.$subscribe(this.template_message).then(res => {
                    self.buyZero();
                }).catch(res => {
                    self.buyZero();
                });
            },
            buyZero: function () {
                const self = this;
                self.award_bg = !self.award_bg;
                setTimeout(() => {
                    let animation = uni.createAnimation({
                        duration: 500,
                        timingFunction: 'linear',
                        delay: 0,
                        transformOrigin: '50% 50%',
                    })
                    if (self.award_bg) {
                        animation.width( `${uni.upx2px(360)}px`).height(`${uni.upx2px(314)}px`).step();
                    } else {
                        animation.scale(0, 0).opacity(0).step();
                    }
                    self.animation_trans_lottery = animation.export();
                    setTimeout(() => {
                        let circleCount = 0;
                        self.integral_animation = setInterval(() => {
                            if (circleCount % 2 === 0) {
                                animation.scale(0.9).opacity(1).step();
                            } else {
                                animation.scale(1).opacity(1).step();
                            }

                            self.animation_trans_lottery = animation.export();
                            circleCount++;
                            if (circleCount === 500) {
                                circleCount = 0;
                            }
                        }, 500);
                    }, 500)
                }, 50)
            },

            detail() {
                clearInterval(this.integral_animation);
                this.award_bg = false
            },

            onImageListClick(e) {
                let urls = [];
                let index = e.currentTarget.dataset.index;
                for (let i in this.goods.pic_url) {
                    urls.push(this.goods.pic_url[i].pic_url);
                }
                uni.previewImage({
                    urls: urls, // 需要预览的图片http链接列表
                    current: urls[index],
                });
            },

            buyNow: function () {
                uni.navigateTo({url: `/pages/goods/goods?id=` + this.lottery.buy_goods_id})
            },

            shareClick() {
                this.shareShow = true;
            }
        }
    }
</script>

<style scoped lang="scss">
    .lottery-attr {
        background: #ffffff;
        width: 702upx;
        margin: 0 24upx 24upx 24upx;
        border-radius: 0 0 15upx 15upx;
        .box {
            border-top: 1px solid #e2e2e2;
            padding: 28upx 20upx;
        }
        .border {
            border: 1px solid #666666;
            border-radius: #{20rpx};
            font-size: #{24rpx};
            line-height: 1;
            padding: #{8rpx} #{16rpx};
            color: #666666;
        }
        .text {
            margin-left: #{24rpx};
            color: #353535;
            font-size: #{26rpx};
            max-width: #{520rpx};
            text:after {
                content: '，'
            }
            text:last-child:after {
                content: ''
            }
        }
    }
    .lottery-share {
        margin: #{20rpx} 0;
        image {
            height: #{140rpx};
            margin: 0 auto;
            width: #{702rpx};
            display: block;
        }
    }
    .t1 {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.25);
    }
    .goods-head-box {
        position: relative;
    }
    .time {
        position: absolute;
        bottom: #{120rpx};
        width: 100%;
        .time-info {
            height: #{56rpx};
            background: #ff4544;
            opacity: 0.6;
            padding: 0 #{24rpx};
            border-radius: #{28rpx};
            font-size: #{28rpx};
            color: #FFFFFF;
            .icon {
                height: #{24rpx};
                width: #{24rpx};
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-image: url('./../image/lottery-white.png');
            }
            view {
                margin-left: #{24rpx};
            }
        }
        .time-error {
            background: #000000;
        }
    }
    .goods {
        background: #FFFFFF;
        padding: 20upx 20upx 20upx 20upx;
        width: 702upx;
        margin: 24upx 24upx 0 24upx;
        border-radius: 15upx 15upx 0 0;
        .name {
            color: #353535;
            font-size: 32upx;
            line-height: 42upx;
        }
        .goods-subtitle {
            margin-top: 25upx;
            font-size: 24rpx;
            line-height: 34upx;
            color: #999999;
        }

        .detail {
            margin-top: #{24rpx};
            .bold {
                font-weight: bold;
                font-size: #{36rpx};
                color: #ff4544;
            }
            .num {
                margin-right: #{16rpx};
                margin-left: #{12rpx};
            }
            .price {
                color: #ff4544;
                padding-top: #{32rpx};
            }
            .del {
                color: #999999;
                margin-left: #{12rpx};
                text-decoration: line-through;
            }
        }

        .share {
            height: #{48rpx};
            border-radius: #{40rpx} 0 0 #{40rpx};
            padding: 0 #{14rpx};
            width: #{103rpx};
            margin-right: #{-20rpx};
            margin-top: #{44rpx};
            .share-icon {
                width: #{22rpx};
                height: #{22rpx};
            }
            .share-text {
                font-size: #{22rpx};
                color: #ffffff;
                margin-left: #{10rpx};
            }
        }
    }
    .step {
        width: 702upx;
        margin: 24upx 24upx 0 24upx;
        padding: 20upx 20upx 0 20upx;
        background: #FFFFFF;
        border-radius: 15upx 15upx 0 0;
        view {
            font-size: #{32rpx};
            color: #353535;
        }
        .icon-right {
            background-repeat: no-repeat;
            background-size: 100% 100%;
            height: #{22rpx};
            width: #{12rpx};
            margin-left: #{16rpx};
            background-image: url("../../../static/image/icon/arrow-right.png");
        }
    }
    .step-info {
        padding: #{40rpx} 0;
        background: #FFFFFF;
        width: 702upx;
        margin: 0 24upx 24upx 24upx;
        border-radius: 0 0 15upx 15upx;
        .label {
            font-size: #{52rpx};
            font-weight: bold;
            color: #dddddd;
            margin-right: #{20rpx};
        }
        .value {
            color: #666666;
        }
    }
    .code {
        margin-top: #{20rpx};
    }
    .lucky-all {
        width: 702upx;
        overflow-y: hidden;
        padding: #{20rpx};
        background: #ffffff;
        color: #353535;
        margin: 24upx 24upx 0 24upx;
        border-radius: 15upx;
        .friend {
            margin-top: #{16rpx};
            font-size: #{24rpx};
            margin-bottom: #{24rpx};
            color: #999999;
        }
        .swiper {
            // #ifdef MP-ALIPAY
            height: #{92rpx};
            // #endif
            // #ifndef MP-ALIPAY
            height: #{184rpx};
            // #endif
            .lucky-code {
                height: #{88rpx};
                background: #fff5f5;
                padding: 0 #{24rpx};
                margin-bottom: #{8rpx};
                image {
                    margin-right: #{32rpx};
                    height: #{64rpx};
                    width: #{64rpx};
                    border-radius: 50%
                }
                .nickname {
                    color: #353535;
                }
                .font-normal {
                    color: #666666;
                }
            }
        }
        .swiper-one {
            // #ifndef MP-ALIPAY
            height: #{92rpx};
            // #endif
        }
    }
    .goods-rule {
        border-bottom: #{1px} solid #e2e2e2;
        color: #353535;
        background: #FFFFFF;
        font-size: #{32rpx};
        line-height: #{80rpx};
        padding-left: #{24rpx};
        width: 702upx;
        margin: 24upx 24upx 0 24upx;
        border-radius: 15upx 15upx 0 0;
    }
    .rule-info {
        width: 702upx;
        margin: 0 24upx 24upx 24upx;
        border-radius: 0 0 15upx 15upx;
        background: #FFFFFF;
        padding: 20upx;
    }
    .bd-bottom {
        width: 750upx;
        height: 110upx;
        padding: 20upx 24upx;
    }
    .bd-btn {
        border-radius: 35upx;
        text-align: center;
        line-height: 70upx;
        font-size: 28upx;
        width: 50%;
    }
    .bd-bottom-first {
        margin-right: 20upx;
    }
    .bd-color {
        color: #ffffff;
    }
    .bd-btn-end {
        background: #cdcdcd;
    }
    .animation-model {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        z-index: 1999;
        .boxbg {
            height: #{840rpx};
            width: 100%;
            z-index: 1001;
        }
        .detaill {
            width: 100%;
            position: absolute;
            top: 50% - #{157rpx};
            z-index: 1002;
            .ani_box {
                height: 0;
                width: 0;
                image {
                    opacity: 1;
                    height: 100%;
                    width: 100%;
                    z-index: 20;
                }
            }
        }
        .image {
            width: 100%;
            height: #{840rpx};
            position: absolute;
            top: #{140rpx};
            left: 0;
        }
    }
    .u-bottom-height {
        height: 100upx;
    }
    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1602;
        background-color: #ffffff;
    }
</style>
