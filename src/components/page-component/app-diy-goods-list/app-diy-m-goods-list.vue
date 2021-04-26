<template>
    <view class="app-diy-m-goods-list" :style="{backgroundColor: backgroundColor}">
        <view class="m-diy-list__box dir-top-nowrap">
            <view class="m-label box-grow-0 dir-left-nowrap cross-center main-between"
                  :style="{background: 'linear-gradient(to right, ' + mBgColor +', '+ ( mBgType === 'gradient' ?  mBgGradientColor:  mBgColor) + ')'}">
                <view class="box-grow-0 dir-left-nowrap cross-center">
                    <view class="title" :style="{color: mColor}">{{ mTitle }}</view>
                    <template v-if="tempData.open_date || after_title">
                        <view class="desc">{{ timer_text }}</view>
                        <view v-if="timer" class="time dir-left-nowrap cross-center">
                            <template v-if="timer.day">
                                <view class="box main-center cross-center"
                                      :style="{color: mTimeColor,backgroundColor:mTimeBgColor}">{{ timer.day }}
                                </view>
                                <view class="colon main-center cross-center">:</view>
                            </template>
                            <view class="box main-center cross-center"
                                  :style="{color: mTimeColor,backgroundColor:mTimeBgColor}">{{ timer.hour }}
                            </view>
                            <view class="colon main-center cross-center">:</view>
                            <view class="box main-center cross-center"
                                  :style="{color: mTimeColor,backgroundColor:mTimeBgColor}">{{ timer.min }}
                            </view>
                            <view class="colon main-center cross-center">:</view>
                            <view class="box main-center cross-center"
                                  :style="{color: mTimeColor,backgroundColor:mTimeBgColor}">{{ timer.sec }}
                            </view>
                        </view>
                        <view v-if="after_title" class="desc">{{ after_title }}</view>
                    </template>
                </view>
                <view class="m-label-right box-grow-0 dir-left-nowrap cross-center" @click="jumpMore">
                    <view>更多</view>
                    <view class="bg"></view>
                </view>
            </view>
            <view class="m-goods" :style="{backgroundColor:mGoodsBgColor}">
                <scroll-view v-if="tempData.list && tempData.list.length" scroll-x>
                    <view class="dir-left-nowrap">
                        <view class="m-goods-box dir-top-nowrap box-grow-0" v-for="(goods,index) in tempData.list"
                              :key="index"
                              @click="jump(goods)">
                            <!-- 商品名称 -->
                            <view class="sell-out-pi">
                                <view class="u-cover-box">
                                    <view class="u-out-dialog" v-if="isShowStock(goods)">
                                        <image class="pic-url"
                                               :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"
                                        ></image>
                                    </view>
                                    <image class="pic-url box-grow-0 u-cover" v-bind:src="goods.cover_pic"></image>
                                </view>
                            </view>
                            <view class="goods-end"
                                  v-if="showProgressBar || showGoodsName || isShowOriginalPrice(goods) || showGoodsPrice">
                                <view v-if="showGoodsName" class="goods-name t-omit-two">
                                    <text class="g-tag"
                                          :style="{'background-color': theme.background_o,'color': theme.color}">
                                        {{ signAlone.title }}
                                    </text>
                                    {{ goods.name }}
                                </view>
                                <template v-if="sign === 'flash-sale' && showProgressBar">
                                    <view class="u-margin goods-fold flash-sale main-center cross-center"
                                          :style="{'background-color': theme.background}">
                                        {{goods.discount_type == 1 ? goods.min_discount + '折' : '减' + goods.min_discount + '元'}}
                                    </view>
                                    <view class="u-margin goods-progress" :style="{'background-color': theme.background_l}">
                                        <view class="goods-progress-view"
                                              :style="{width: `${goods.percentage}%`,'background-color':`${theme.background}`}"></view>
                                    </view>
                                    <view class="u-margin goods-num">{{ goods.sales }}</view>
                                </template>
                                <template v-if="showGoodsPrice">
                                    <view class="u-margin" v-if="isShowMemPrice(goods)">
                                        <app-member-price
                                            :theme="theme"
                                            v-bind:price="goods.level_price"
                                        ></app-member-price>
                                    </view>
                                    <view class="u-margin" v-if="isShowVip(goods)">
                                        <app-sup-vip
                                            v-bind:is_vip_card_user="goods.vip_card_appoint.is_vip_card_user"
                                            v-bind:discount="goods.vip_card_appoint.discount"
                                        ></app-sup-vip>
                                    </view>

                                    <view class="u-margin dir-left-wrap cross-center">
                                        <view class="goods-price" :style="{'color': theme.color}">
                                            {{ goods.price_content }}
                                        </view>
                                        <view v-if="isShowOriginalPrice(goods)"
                                              class="goods-under-line-price">￥{{ goods.original_price }}
                                        </view>
                                    </view>
                                </template>
                            </view>
                            <view class="tag">
                                <app-image :img-src="goodsTagPicUrl" width="64rpx" height="64rpx"></app-image>
                            </view>
                        </view>
                    </view>
                </scroll-view>
                <view v-else class="empty cross-center dir-left-wrap">
                    <view class="empty-bg"></view>
                    <view class="empty-text">{{ signAlone.empty_title }}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import appPrice from "../../page-component/goods/app-price.vue";
import appGoodsTimer from "./app-goods-timer.vue";
import appDiyCompositionImage from './app-diy-composition-image';

export default {
    name: "app-diy-m-goods-list",
    components: {
        'app-price': appPrice,
        'app-goods-timer': appGoodsTimer,
        appDiyCompositionImage
    },
    props: {
        list: {
            type: Array,
            default() {
                return [];
            }
        },
        mTitle: String,
        mColor: {
            type: String,
            default: '#FFFFFF',
        },
        mBgType: {
            type: String,
            default: 'gradient',
        },
        mBgColor: {
            type: String,
            default: '#FF366F',
        },
        mBgGradientColor: {
            type: String,
            default: '#FF4242',
        },
        mTimeColor: {
            type: String,
            default: '#353535',
        },
        mTimeBgColor: {
            type: String,
            default: '#FFFFFF',
        },
        mGoodsBgColor: {
            type: String,
            default: '#FFE7E7',
        },
        showProgressBar: {
            type: [Boolean, String],
            default: false,
        },
        showGoodsName: {
            type: [Boolean, String],
            default: true,
        },
        showGoodsPrice: {
            type: [Boolean, String],
            default: true,
        },
        showGoodsTag: {
            type: [Boolean, String],
            default: false,
        },
        customizeGoodsTag: {
            type: [Boolean, String],
            default: '#FFFFFF',
        },
        goodsTagPicUrl: {
            type: String,
            default: '',
        },
        isUnderLinePrice: {
            type: [Boolean, String],
            default: true,
        },
        backgroundColor: {
            type: String,
            default: '#FFFFFF',
        },
        sign: String,
        theme: Object,
        mData: Object,
    },
    data() {
        return {
            timer: null,
            timer_text: '',

            tempData: this.mData,
            after_title: '',
            mTimeIntegral: null,
        };
    },
    watch: {
        mData: {
            handler: function (data) {
                this.tempData = data;
            },
            immediate: true,
        },
    },
    computed: {
        ...mapState({
            appImg: state => state.mallConfig.__wxapp_img.mall,
            appSetting: state => state.mallConfig.mall.setting,
            platform: function (state) {
                return state.gConfig.systemInfo.platform;
            }
        }),
        ...mapGetters('mallConfig', {
            getVideo: 'getVideo'
        }),
        newData() {
            return this.list;
        },
        signAlone() {
            switch (this.sign) {
                case 'miaosha':
                    return {
                        'sign': this.sign,
                        'title': '秒杀',
                        'empty_title': '暂无秒杀活动',
                        'more_url': '/plugins/miaosha/advance/advance',
                    }
                case 'flash-sale':
                    return {
                        'sign': this.sign,
                        'title': '限时抢购',
                        'empty_title': '暂无抢购活动',
                        'more_url': '/plugins/flash_sale/index/index',
                    }
                default:
                    break;
            }
        },
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                if (this.signAlone.sign === 'miaosha') {
                    this.sTime();
                }
                if (this.signAlone.sign === 'flash-sale') {
                    this.fTime();
                }
            })
        })
    },
    beforeDestroy() {
        clearInterval(this.mTimeIntegral);
    },
    methods: {
        // 是否展示会员价
        isShowMemPrice(goods) {
            return goods.is_level === 1 && goods.is_negotiable !== 1 ? 1 : 0;
        },
        // 是否展示超级会员价
        isShowVip(goods) {
            return goods.vip_card_appoint && goods.vip_card_appoint.discount > 0 && goods.is_negotiable !== 1 ? 1 : 0;
        },
        // 是否展示售罄
        isShowStock(goods) {
            return this.appSetting.is_show_stock === 1 && goods.goods_stock === 0 ? 1 : 0;
        },
        set_time(time_at) {
            clearInterval(this.mTimeIntegral);
            let timer = new Date(time_at.replace(/-/g, '/'));
            this.now_time(timer);
            this.mTimeIntegral = setInterval(() => {
                this.now_time(timer);
            }, 1000);
        },
        now_time(timer) {
            let time = timer.getTime() - new Date().getTime();
            if (time < 0) {
                clearInterval(this.mTimeIntegral);
            }
            let day = parseInt(time / 1000 / 60 / 60 / 24);

            let hou = parseInt((time / 1000 / 60 / 60) % 24);
            let min = parseInt((time / 1000 / 60) % 60);
            let sec = parseInt((time / 1000) % 60);
            this.timer = {
                day: day < 10 ? "0" + day : day,
                hour: hou < 10 ? "0" + hou : hou,
                min: min < 10 ? "0" + min : min,
                sec: sec < 10 ? "0" + sec : sec
            };
        },

        fTime() {
            if (this.tempData.activity) {
                this.after_title = '结束';
                this.set_time(this.tempData.activity.end_at);
            } else if (this.tempData.next_activity) {
                this.after_title = '开始';
                //TODO ddddddd待优化
                if (this.tempData.next_activity && this.tempData.next_activity.start_at) {
                    this.set_time(this.tempData.next_activity.start_at);
                }
            }
        },
        sTime() {
            let timenow = new Date();//获取当前时间
            if ((new Date(this.tempData.open_date)).getDate() != timenow.getDate()) {
                this.timer_text = '预告 ' + this.tempData.open_date + ' ' + this.tempData.open_time + '点场';
            } else if (this.tempData.open_time != timenow.getHours()) {
                this.timer_text = '预告 ' + this.tempData.open_time + '点场';
            } else {
                this.timer_text = this.tempData.open_time + '点场';
                let timelog = this.tempData.date_time * 1000 - timenow.getTime();
                this.mTimeIntegral = setInterval(() => {
                    timelog -= 1000;
                    if (timelog <= 0) {
                        clearInterval(this.mTimeIntegral);
                        return;
                    }
                    let hour = parseInt((timelog / 1000 / 60 / 60));
                    let min = parseInt((timelog / 1000 / 60) % 60);
                    let sec = parseInt((timelog / 1000) % 60);
                    this.timer = {
                        hour: hour < 10 ? "0" + hour : hour,
                        min: min < 10 ? "0" + min : min,
                        sec: sec < 10 ? "0" + sec : sec
                    };
                }, 1000);
            }
        },
        jumpMore() {
            uni.navigateTo({
                url: this.signAlone.more_url,
            });
        },
        jump(data) {
            let isNav = false;
            // #ifdef MP-ALIPAY || MP-WEIXIN || MP-TOUTIAO
            isNav = true;
            // #endif

            // #ifdef H5 || MP-BAIDU
            isNav = false;
            // #endif
            if (isNav && data.video_url && this.getVideo == 1) {
                uni.navigateTo({
                    url: `/pages/goods/video?goods_id=${id}&sign=${data.sign}`
                });
            } else {
                uni.navigateTo({
                    url: data.page_url
                });
            }
        },
        isShowOriginalPrice(goods) {
            return this.isUnderLinePrice && goods.original_price && this.showGoodsPrice && goods.is_negotiable !== 1;
        },
    }
}
</script>

<style scoped lang="scss">
.app-diy-m-goods-list {
    padding: 20px 0;

    .m-diy-list__box {
        padding: 0 #{20rpx};

    }

    .m-label {
        width: 100%;
        height: #{80rpx};
        padding: 0 #{24rpx};
        border-radius: #{16rpx} #{16rpx} 0 0;

        .title {
            font-size: #{28rpx};
        }

        .desc {
            color: #ffffff;
            font-size: #{24rpx};
            margin-left: #{20rpx};
        }

        .time {
            margin-left: #{12rpx};

            .colon {
                color: #ffffff;
                width: #{22rpx};
            }

            .box {
                font-size: 11px;
                height: #{36rpx};
                width: #{40rpx};
                border-radius: #{4rpx};
                background: #FFFFFF;
                font-weight: bold;
            }
        }

        .m-label-right {
            font-size: #{26rpx};
            color: #FFFFFF;

            .bg {
                background-image: url("../../../static/image/icon/arrow-right-white.png");
                background-repeat: no-repeat;
                background-size: 100% 100%;
                width: #{12rpx};
                height: #{22rpx};
                display: block;
                margin-left: #{12rpx};
            }
        }
    }

    .m-goods {
        padding: #{20rpx} 0 #{20rpx} #{24rpx};
        width: 100%;
        border-radius: 0 0 #{16rpx} #{16rpx};

        .empty {
            background: #FFFFFF;
            padding: 0 #{56rpx};
            border-radius: #{16rpx};
            height: #{180rpx};
            margin-right: #{20rpx};

            .empty-bg {
                background-image: url("../../../static/image/icon/empty.png");
                background-repeat: no-repeat;
                background-size: 100% 100%;
                height: #{100rpx};
                width: #{100rpx}
            }

            .empty-text {
                margin-left: #{54rpx};
                font-size: #{28rpx};
                color: #353535;
            }
        }

        .m-goods-box {
            margin-right: #{12rpx};
            position: relative;
            background-color: #FFFFFF;
            width: #{260rpx};
            border-radius: #{16rpx};

            .tag {
                position: absolute;
                left: 0;
                top: 0;
                z-index: 10;
                width: #{64rpx};
                height: #{64rpx};
            }

            .u-cover-box {
                position: relative;
                width: #{260rpx};
                height: #{260rpx};
            }
            .u-margin {
                margin-top: #{5rpx};
            }
            .u-out-dialog {
                width: #{260rpx};
                height: #{260rpx};
                position: absolute;
                top: 0;
                left: 0;
                z-index: 10;
                background-color: rgba(0, 0, 0, .5);
                border-radius: #{16rpx} #{16rpx} 0 0;
            }

            .pic-url {
                height: #{260rpx};
                width: 100%;
                display: block;
                border-radius: #{16rpx} #{16rpx} 0 0;
            }

            .goods-end {
                width: 100%;
                padding: #{20rpx} #{14rpx};

                .goods-name {
                    font-size: #{24rpx};
                    color: #353535;
                }

                .g-tag {
                    padding: 0 #{10rpx};
                    margin-right: #{8rpx};
                    font-size: $uni-font-size-weak-two;
                    border-radius: #{28rpx};
                    text-align: center;
                }

                .goods-fold {
                    padding: #{5rpx} #{10rpx};
                    font-size: #{20rpx};
                    color: #fff;
                    line-height: 1;
                    border-radius: #{14rpx};
                    margin-right: #{10rpx};
                    display: inline-block;
                }

                .goods-progress {
                    width: 100%;
                    height: #{20rpx};
                    border-radius: #{20rpx};
                    //background: #ff9f9f;
                    overflow: hidden;
                    margin-top: #{4rpx};

                    .goods-progress-view {
                        width: 50%;
                        height: 100%;
                        border-radius: inherit;
                        //background-color: #ff4544;
                    }
                }

                .goods-num {
                    font-size: #{20rpx};
                    color: #999999;
                }


                .goods-price {
                    font-size: #{28rpx};
                }

                .goods-under-line-price {
                    font-size: #{20rpx};
                    margin-left: #{10rpx};
                    color: #999999;
                    text-decoration: line-through;
                }

            }
        }

    }
}
</style>
