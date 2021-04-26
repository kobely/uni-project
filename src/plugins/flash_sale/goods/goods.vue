<template>
    <app-layout>
        <view v-if="!goods" class="u-goods-detail"></view>
        <view class="app-goods" v-if="goods">
            <view class="banner">
                <app-banner :videoUrl="goods.video_url" :share="goods.share" :picList="goods.pic_url" :goods_id="goods_id" sign="flash_sale"></app-banner>
            </view>
            <!-- 时间 -->
            <view class="f-timing">
                <view class="f-image" :style="{'background-color': getTheme.background}"></view>
                <view class="f-activity" :style="{'color': getTheme.color}">
                    {{goods.discount_type === 1 ? goods.min_discount + '折' : '减' + goods.min_discount  + '元' }}
                </view>
                <view class="f-content dir-top-nowrap">
                    <view class="app-text" v-if="activity_status === 0">距离开始仅剩</view>
                    <view class="app-text" v-else-if="activity_status === 1">距离结束仅剩</view>
                    <view class="app-text over-text" v-else-if="activity_status === 2">活动已结束</view>
                    <view class="app-time cross-center main-around" v-if="activity_status !== 2">
                        <text class="app-num app-right" >{{time_str.day}}</text>
                        <text>天</text>
                        <text class="app-num app-right">{{time_str.hou}}</text>
                        <text>时</text>
                        <text class="app-num app-right">{{time_str.min}}</text>
                        <text>分</text>
                        <text class="app-num app-right">{{time_str.sec}}</text>
                        <text>秒</text>
                    </view>
                </view>
            </view>
            <bd-info
                :theme="getTheme"
                :name="goods.name"
                :is-negotiable="goods.is_negotiable"
                :subtitle="goods.subtitle"
                :level-show="goods.level_show"
                :price="goods.price"
                :original-price="goods.original_price"
                :price-max="goods.price_max"
                :price-min="goods.price_min"
                :price-member-max="goods.price_member_max"
                :price-member-min="goods.price_member_min"
                :discount='discount'
                :is-vip-card-user="is_vip_card_user"
                :sales="goods.sales"
                :unit="goods.unit"
                :is-sales="goods.is_sales"
                :is-vip="is_vip"
                :goods-id="goods.id"
                :extra-quick-share="goods.extra_quick_share"
                :app-share-pic="goods.app_share_pic"
                :app-share-title="goods.app_share_title"
                :poster-config="poster_config + `&goods_id=` + goods.id"
                :poster-generate="poster_generate + `&goods_id=` + goods.id"
                :has-poster-nav="true"
                @quickShare="quickShare"
                v-bind:goods="goods"
                @share="hShareAppMessage"
				:min-number="goods.min_number"
				:limit-buy="goods.limit_buy"
            ></bd-info>
            <bd-coupon @change="setCoupon" :theme="getTheme" :coupons="goods.goods_coupon_center"></bd-coupon>
            <bd-xbc
                :coAttr="is_open"
                :attr-list="selectAttr.attr_list"
                :type="goods.type"
                :guarantee-title="goods.guarantee_title"
                :guarantee-pic="goods.guarantee_pic"
                :param_content="goods.param_content"
                :param_name="goods.param_name"
                :services="goods.services"
                :attr-groups="goods.attr_groups"
                :goods-stock="goods.goods_stock"
                :co-attr="activity_status"
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
            <!-- 相关推荐 -->
            <template  v-if="list.length > 0">
                <app-related-suggestion-product :theme="getTheme" :list="list"></app-related-suggestion-product>
            </template>
            <!--空格区域-->
            <view class="safe-area-inset-bottom">
                <view class="u-bottom-height" :class="full_reduce ? 'u-bottom-height-1' : 'u-bottom-height-0'"></view>
            </view>
            <!-- 底部按钮 -->
            <view v-if="is_open == 1" class="safe-area-inset-bottom u-bottom-fixed">
                <view v-if="full_reduce">
                    <app-goods-full-reduce
                        :theme="getTheme"
                        sign="flash_sale"
                        :full_reduce="full_reduce"
                    >
                    </app-goods-full-reduce>
                </view>
                <view class="bd-bottom dir-left-nowrap cross-center">
                    <view class="bd-back dir-top-nowrap main-center cross-center box-grow-0" @click="back">
                        <image class="bd-icon" src="../../../static/image/icon/index.png"></image>
                        <text class="bd-text">首页</text>
                    </view>
                    <bd-service :name="goods.name" :url="webUrl"></bd-service>
                    <view v-if="goods.goods_stock == 0" class="bd-button box-grow-1 bd-oversell-btn" >
                            已售罄
                    </view>
                    <template v-else >
                        <template v-if="activity_status === 1">
                            <view class="dir-left-nowrap box-grow-1">
                                <view @click="joinCart" class="bd-btn-half bd-button bd-btn-left"
                                      :style="{'background': !goods || goods.buy_goods_auth ? getTheme.background_s_gradient_btn : '#999999','color': !goods || goods.buy_goods_auth ? getTheme.secondary_text : ''}">
                                    加入购物车
                                </view>
                                <view  @click="joinCart" class="bd-btn-half bd-button bd-btn-right"
                                       :style="{'background': goods.buy_goods_auth ? getTheme.background_gradient_btn : '#999999','color': goods.buy_goods_auth ? getTheme.main_text : ''}">
                                    立即购买
                                </view>
                            </view>
                        </template>
                        <view class="dir-left-nowrap box-grow-1" v-if="activity_status === 0">
                            <view class="bd-btn-half bd-button bd-btn-left" @click="joinCart" :style="{'background': !goods || goods.buy_goods_auth ? getTheme.background_s_gradient_btn : '#999999','color' : !goods || goods.buy_goods_auth ? getTheme.secondary_text : ''}">
                                加入购物车
                            </view>
                            <view style="background: #999999;line-height: 1" class="dir-top-nowrap bd-button bd-btn-right bd-btn-half main-center cross-center">
                                <view style="font-size: 28rpx">{{activity.start_at | getStart}}</view>
                                <view style="font-size: 20rpx">{{activity.start_at | getStartT}}</view>
                            </view>
                        </view>
                        <view v-if="activity_status === 2" class="bd-button bd-oversell-btn box-grow-1" >
                            活动已结束
                        </view>
                    </template>
                </view>
            </view>
            <u-attr
                v-model="show"
                :goods="goods"
                :theme="getTheme"
                :checked="selectAttr"
                @check="onAttr"
                :rightFunc="true"
                :leftFunc="true"
                @leftFunc="leftFunc"
                @rightFunc="rightFunc"
                :is_show_right="activity_status === 1"
            >
            </u-attr>
        </view>
        <app-close v-if="showClose" :modal="false" @update="getMall"></app-close>
    </app-layout>
</template>
<script>
    import {mapGetters, mapState} from 'vuex';
    import appBanner from '../../../components/page-component/goods/app-goods-banner.vue';
    import appRelatedSuggestionProduct from '../../../components/page-component/app-related-suggestion-product/app-related-suggestion-product.vue';
    import appGoodsFullReduce from '../../../components/page-component/goods/app-goods-full-reduce.vue';
    import uAttr from '../../../components/page-component/goods/u-attr.vue';
    import bdInfo from '@/components/page-component/goods/bd-info';
    import bdCoupon from '@/components/page-component/goods/bd-coupon.vue';
    import bdXbc from '@/components/page-component/goods/bd-xbc.vue';
    import bdKb from '@/components/page-component/goods/bd-kb.vue';
    import bdHc from '@/components/page-component/goods/bd-hc.vue';
    import bdDetail from '@/components/page-component/goods/bd-detail.vue';
    import bdComments from '@/components/page-component/goods/bd-comments.vue';
    import appClose from '@/components/basic-component/app-close/app-close.vue';
    import bdService from '@/components/page-component/goods/bd-service.vue';

    export default {
        name: 'goods',
        data() {
            return {
                showClose: false,
                is_open: 0,
                goods_id: -1,
                full_reduce: null,
                activity: {},
                activity_status: 0,
                time_str: {
                    day: 0,
                    hou: 0,
                    min: 0,
                    sec: 0
                },
                timing: null,
                discount: null,
                is_vip: false,
                is_vip_card_user: 0,
                shareData: null,
                poster_config: this.$api.flash_sale.poster_config,
                poster_generate: this.$api.flash_sale.poster_generate,
                selectAttr: {},

                url: '',
                webUrl: '',
                show: false,
                list: [],
                miaosha_buy_count: 0,
                is_activity: 0,
                loading: false,
                is_show_buy: true,
                share: false,
                goods: null,
				disable: 'disable'

            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.goods_id = options.id;
            this.webUrl = '/plugins/flash_sale/goods/goods?id=' + options.id;
            this.share = options.share;
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
        },
        onHide() {
            clearInterval(this.timing);
        },
        onUnload() {
            clearInterval(this.timing);
        },
        onShow() {
            this.showClose = false;
            setTimeout(()=>{
                this.showClose = true;
            })
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme'
            }),
        },
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            let { app_share_title, name, id } = this.goods;
            return this.$shareTimeline({
                title: app_share_title ? app_share_title : name,
                query: {
                    id,
                    share: true
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
                let { app_share_title, name, app_share_pic, id, pic_url, subtitle} = this.goods;
                return this.$shareAppMessage({
                    path: '/plugins/flash_sale/goods/goods',
                    title: app_share_title ? app_share_title : name,
                    imageUrl: app_share_pic ? app_share_pic : pic_url[0].pic_url,
                    desc: subtitle,
                    params: {
                        id,
                        share: true
                    }
                },s);
            },
            getMall(e) {
                this.is_open = e.is_open;
            },
            async getDetail() {
                this.loading = false;
                const e = await this.$request({
                    url: this.$api.flash_sale.detail,
                    data: {
                        id: this.goods_id
                    }
                });
                if (e.code === 0) {
                    this.loading = true;
                    let { detail, activity, activity_status } = e.data;
                    this.goods = detail;
                    this.activity = activity;
                    if (detail.goods_activity) {
                        this.full_reduce = detail.goods_activity.full_reduce;
                    }
                    this.activity_status = activity_status;
                    if(detail.vip_card_appoint.discount) {
                        this.is_vip = true;
                        this.discount = detail.vip_card_appoint.discount;
                    }
                    this.is_vip_card_user = detail.vip_card_appoint.is_vip_card_user;
                    if (activity_status === 1) {
                        this.set_time(activity.end_at);
                    } else if (activity_status === 0) {
                        this.set_time(activity.start_at);
                        this.is_show_buy = false;
                    }
                    // #ifdef H5
                    this.hShareAppMessage();
                    // #endif
                } else {
                    uni.showToast({
                        title: e.msg,
                        icon: 'none'
                    });
                    if (!this.share) {
                        uni.navigateBack();
                    } else {
                        uni.navigateTo({
                            url: `/plugins/flash_sale/index/index`
                        })
                    }

                }
            },

            set_time(time_at) {
                clearInterval(this.timing);
                let time_str = new Date(time_at.replace(/-/g, '/'));
                this.now_time(time_str);
                this.timing = setInterval(() => {
                    this.now_time(time_str);
                }, 1000);
            },

            now_time(time_str) {
                let time = time_str.getTime() - new Date().getTime();
                if (time < 0) {
                    clearInterval(this.timing);
                }
                let day = parseInt(time/1000/60/60/24);
                let hou = parseInt((time/1000/60/60)%24);
                let min = parseInt((time/1000/60)%60);
                let sec = parseInt((time/1000)%60);
                this.time_str.day = day < 10 ? '0' + day : day;
                this.time_str.hou = hou < 10 ? '0' + hou : hou;
                this.time_str.min = min < 10 ? '0' + min : min;
                this.time_str.sec = sec < 10 ? '0' + sec : sec;
            },

            quickShare(info) {
                this.shareData = info;
            },
            async request({ url, data }) {
                const response = await this.$request({
                    url: url,
                    data: data,
                });
                if (response.code === 0) {
                    return response.data;
                }
            },
            onAttr({item}) {
                this.selectAttr = item;
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
            leftFunc: function (number) {
                this.$request({
                    url: this.$api.flash_sale.add_cart,
                    data: {
                        flash_goods_id: this.selectAttr.goods_id,
                        attr_id: this.selectAttr.id,
                        num: number
                    },
                    method: 'post'
                }).then(e => {
                    uni.showToast({
                        title: e.msg,
                        type: 'success'
                    });
                });
            },
            rightFunc(data) {
                uni.navigateTo({
                    url: `/pages/order-submit/order-submit?mch_list=${JSON.stringify([data])}`
                })

            },
            setCoupon(index) {
                this.$set(this.goods.goods_coupon_center[index], 'is_receive', 1);
            },

            back() {
                uni.redirectTo({
                    url: '/pages/index/index'
                });
            }
        },

        watch: {
            goods_id: {
                handler() {
                  this.getDetail();
                }
            }
        },

        filters: {
            getStart(data) {
                if (!data) return;
                let time_str = new Date(data.replace(/-/g, '/'));
                return `${time_str.getHours() < 10 ? '0'
                    + time_str.getHours() : time_str.getHours()}:${time_str.getMinutes() < 10 ? '0' +
                    time_str.getMinutes() : time_str.getMinutes()} 开抢 `;
            },
            getStartT(data) {
                if (!data) return;
                let time_str = new Date(data.replace(/-/g, '/'));
                return `${time_str.getFullYear()}.${time_str.getMonth() + 1}.${time_str.getDate()}`
            }
        },

        components: {
            'app-banner': appBanner,
            'app-related-suggestion-product': appRelatedSuggestionProduct,
            appGoodsFullReduce,
            uAttr,
            bdInfo,
            bdCoupon,
            bdXbc,
            bdKb,
            bdHc,
            bdDetail,
            bdComments,
            appClose,
            bdService
        }
    }
</script>
<style scoped lang="scss">
    @import './goods.scss';
    .u-coupon {
        margin-top: 20upx;
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
    .u-bottom-height-0 {
        height: 110upx;
    }
    .u-bottom-height-1 {
        height: 190upx;
    }
    .bd-bottom {
        height: 110upx;
        width: 750upx;
        padding: 20upx 24upx;
    }
    .bd-back {
        width: 66upx;
        height: 100%;
        margin-right: 20upx;
        font-size: 20upx;
        color: #888888;
    }
    .bd-btn-half {
        width: 50%;
    }
    .bd-icon {
        width: 30upx;
        height: 30upx;
        margin-bottom: 8upx;
    }
    .bd-button {
        text-align: center;
        line-height: 70upx;
        font-size: 28upx;
        border-radius: 35upx;
    }
    .bd-btn-left {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .bd-btn-right {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        color: #ffffff;
    }
    .bd-oversell-btn {
        background-color: #CDCDCD;
        color: #ffffff;
    }

</style>
