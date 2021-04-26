<template>
    <app-layout>
        <view v-if="goods.id == 0" class="u-goods-detail"></view>
        <view class="app-goods" v-show="loading" v-if="goods.id > 0">
            <view class="banner">
                <app-banner
                    :videoUrl="goods.video_url"
                    :share="goods.share"
                    :picList="goods.pic_url"
                    :goods_id="goods_id"
                    :isCart="false"
                    sign="wholesale"
                ></app-banner>
            </view>

            <!-- 批发信息 -->
            <view v-if="goods && goods.section.length > 1 && goods.is_negotiable == 0" class="wholesale main-center cross-center" :style="{'background-color': getTheme.background}">
                <view class="wholesale-item" v-for="(item,index) in goods.section" :key="index">
                    <view>
                        <view class="wholesale-price t-omit">￥<text>{{item.price}}</text></view>
                        <view>{{item.display_num}}{{goods.unit}}</view>
                    </view>
                </view>
            </view>
            <bd-info
                v-if="goods"
                :theme="getTheme"
                :name="goods.name"
                :is-negotiable="goods.is_negotiable"
                :subtitle="goods.subtitle"
                :flash-sale="flash_sale"
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
                v-bind:goods="goods"
                @share="hShareAppMessage"
				:limit-buy="goods.limit_buy"
				:min-number="goods.wholesaleGoods.rise_num"
            >
            </bd-info>
            <!--商品优惠券-->
            <bd-coupon v-if="goods && goods.id > 0" @change="setCoupon" :theme="getTheme" :coupons="goods.goods_coupon_center"></bd-coupon>
            <bd-xbc
                v-if="goods && goods.id > 0"
                :coAttr="is_open"
                :attr-list="selectAttr.attr_list"
                :type="goods.type"
                :guarantee-title="goods.guarantee_title"
                :guarantee-pic="goods.guarantee_pic"
                :param_content="goods.param_content"
                :param_name="goods.param_name"
                :services="goods.services"
                :attr-groups="goods.attr_groups"
                :goods-stock="goods.goods_num"
                @openAttr="clickAttr"
            ></bd-xbc>
            <!--商品信息-->
            <bd-hc
                v-if="goods && goods.goods_marketing_award"
                :integral="goods.goods_marketing_award.integral"
                :coupon="goods.goods_marketing_award.coupon"
                :card="goods.goods_marketing_award.card"
                :balance="goods.goods_marketing_award.balance"
                :theme="getTheme"
            ></bd-hc>
            <bd-kb
                v-if="goods && goods.goods_marketing_award"
                :limit="goods.goods_marketing.limit"
                :express="goods.express"
                :shipping="goods.goods_marketing.shipping"
                :pickup="goods.goods_marketing.pickup"
            ></bd-kb>
            <view class="attr">
                <app-attr v-if="goods.id > 0 && goods.is_negotiable == 0" :goods="goods"
                          :attrGroupList="goods.attr_groups"
                          @attrtap="attrtap"
                          ref="attr"
                          sign="wholesale"
                          :chooseNumber="false"
                          :show="show"
                          :selectAttr="selectAttr"
                          :previewUrl="previewUrl"
                          :submitUrl="submitUrl"
                          :totalNumber="totalNumber"
                          :totalPrice="totalPrice"
                          :discount="wholesaleDiscount"
                          :wholesaleType="goods.wholesaleGoods.type"
                          @attr="attr"
						  :is_show_buy="showRight"
						  :buy-text="rightRemindText"
                          :theme="getTheme"
                >
                </app-attr>
            </view>
            <bd-comments v-if="goods.id" :goods-id="goods.id"></bd-comments>
            <!--商品详情-->
            <bd-detail :detail="goods.detail"></bd-detail>
            <!--空格区域-->
            <view class="safe-area-inset-bottom u-bottom">
                <view class="u-bottom-height" :class="uBottomHeight"></view>
            </view>
            <!--底部按钮-->
            <view v-if="is_open == 1" class="safe-area-inset-bottom u-bottom-fixed">
                <view v-if="full_reduce">
                    <app-goods-full-reduce
                        :theme="getTheme"
                        :full_reduce="full_reduce"
                        :sign="goods.type === 'goods' ? '' : 1"
                    >
                    </app-goods-full-reduce>
                </view>
				<view v-if="goods.sell_time > 0">
					<app-sell-tip :time="goods.sell_time" @changeTime="changeTime"></app-sell-tip>
				</view>
                <view class="bd-bottom u-bottom-height-0 dir-left-nowrap cross-center" >
                    <view class="bd-back dir-top-nowrap main-center cross-center box-grow-0" @click="back">
                        <image class="bd-icon" src="../../../static/image/icon/index.png"></image>
                        <text class="bd-text">首页</text>
                    </view>
                    <bd-service :name="goods.name" :url="webUrl"></bd-service>
                    <view class="bd-back dir-top-nowrap main-center cross-center box-grow-0" @click="favorite">
                        <image class="bd-icon" :src="goods.favorite ? '../../../static/image/icon/icon-favorite-active.png' : '../../../static/image/icon/icon-favorite.png'"></image>
                        <text class="bd-text">收藏</text>
                    </view>
                    <template v-if="goods.is_negotiable !== 1">
                        <view class="box-grow-1 bd-btn bd-btn-color" :class="[disableBtn]" v-if="goods.goods_num === 0 || goods.is_finish_sell > 0">
                            {{goods.is_finish_sell > 0 ? '商品已下架' : '已售罄'}}
                        </view>
                        <view class="box-grow-1 dir-left-nowrap" v-else>
                            <view v-if="goods.type === 'goods'"
                                  @click="clickAttr(0)"
                                  :style="{'background': getTheme.background_s_gradient_btn,'color': getTheme.secondary_text}"
                                  :class="['bd-btn', leftTip]"
                            >
                                加入购物车
                            </view>
							<view :class="[goods.type === 'goods' ? 'bd-btn-half' : 'box-grow-1']" v-if="showRight">
							<app-jump-button form>
                            <view
                                @click="clickAttr(1)"
                                :class="['bd-btn', 'bd-btn-color', goods.type === 'goods' ? 'bd-btn-right box-grow-1' : 'box-grow-1']"
                                :style="{'background-color': getTheme.background,'color': getTheme.main_text}"
                            >{{rightRemindText}}
                            </view>
							</app-jump-button>
							</view>
                        </view>
                    </template>
                    <view class="box-grow-1 dir-left-nowrap bd-btn-tel" v-else>
                        <block v-for="(item, index) in good_negotiable" :key="index">
                            <view class="tel"
                                  v-if="item === 'contact_tel'"
                                  @click="makePhoneCall(mall.setting.contact_tel)"
                                  :style="{'background': good_negotiable.length === 1 ? getTheme.background_gradient_btn : getTheme.background_s_gradient_btn,'color': good_negotiable.length === 2 ? getTheme.color : ''}"
                                  :class="[good_negotiable.length === 1 ? 'all-radius all-width text ' : ' ' , good_negotiable.length === 3 ? 'bd-three-one text' : '', good_negotiable.length === 2 ? 'bd-btn-half': '']"
                            >
                                联系电话
                            </view>
                            <!-- #ifndef MP-TOUTIAO || MP-ALIPAY || H5  -->
                            <button v-else-if="item === 'contact'"
                                    open-type="contact"
                                    show-message-card
                                    :send-message-title="goods.name"
                                    :send-message-path="webUrl"
                                    :style="contactBtnStyle"
                                    class="contact" :class="contactBtn">
                                客服
                            </button>
                            <!-- #endif -->
                            <view class="service"
                                  v-else-if="item === 'contact_web'"
                                  @click="router('/pages/web/web?url=' + encodeURIComponent(mall.setting.web_service_url))"
                                  :style="{'background-color': good_negotiable.length !== 3 ? getTheme.background_gradient_btn : ''}"
                                  :class="good_negotiable.length === 3 ? 'default-bakground bd-three-one ' : good_negotiable.length === 2 ? ' bd-btn-half text ' : ' all-radius all-width '" >
                                客服
                            </view>
                        </block>
                    </view>
                </view>
            </view>
        </view>
        <app-close v-if="showClose" :modal="false" @update="getMall"></app-close>
    </app-layout>
</template>

<script>
    import {mapState, mapGetters} from 'vuex';
    import appBanner from '../../../components/page-component/goods/app-goods-banner.vue';
    import appAttr from '../components/app-attr/app-attr.vue';
    import appGoodsFullReduce from "../../../components/page-component/goods/app-goods-full-reduce.vue";
    import bdInfo from '@/components/page-component/goods/bd-info';
    import bdCoupon from '@/components/page-component/goods/bd-coupon.vue';
    import bdXbc from '@/components/page-component/goods/bd-xbc.vue';
    import bdKb from '@/components/page-component/goods/bd-kb.vue';
    import bdHc from '@/components/page-component/goods/bd-hc.vue';
    import bdDetail from '@/components/page-component/goods/bd-detail.vue';
    import bdComments from '@/components/page-component/goods/bd-comments.vue';
    import appClose from '@/components/basic-component/app-close/app-close.vue';
    import bdService from '@/components/page-component/goods/bd-service.vue';
    import appSellTip from '@/components/page-component/goods/app-sell-tip.vue';
	import goodsMixin from '@/core/goods-mixin.js';

    export default {
        name: 'goods',
		mixins: [goodsMixin],
        data() {
            return {
                showClose: false,
                is_open: 0,
                goods: {
                    id: '',
                    name: '',
                    cover_pic: '',
                    price: '',
                    section: [],
                    wholesaleGoods: {
                        rise_num: 0
                    }
                },

                selectAttr: {
                    attr_list: []
                },
                webUrl: '',
                previewUrl: this.$api.wholesale.order_preview,
                submitUrl: this.$api.wholesale.order_submit,
                show: 0,
                list: [],
                appAttr: {},
                totalNumber: 0,
                totalPrice: '0.00',
                poster_config: this.$api.wholesale.poster_config,
                poster_generate: this.$api.wholesale.poster_generate,
                url: this.$api.wholesale.poster,
                goods_id: -1,
                loading: false,
                first: true,
                is_vip: false,
                is_vip_card_user: 0,
                discount: null,
                full_reduce: null,
                flash_sale: null,
                wholesaleDiscount: 0
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.goods_id = options.id;
            that.webUrl = '/plugins/wholesale/goods/goods?id=' + options.id;
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.request({
                url: that.$api.wholesale.detail,
                data: {
                    id: that.goods_id,
                }
            }).then(response => {
                that.first = false;
                that.goods = response.detail;
                if (response.detail.goods_activity) {
                    this.full_reduce = response.detail.goods_activity.full_reduce;
                }
                if(that.goods.vip_card_appoint.discount > 0) {
                    that.is_vip = true;
                    that.discount = that.goods.vip_card_appoint.discount
                }
                that.is_vip_card_user = that.goods.vip_card_appoint.is_vip_card_user;
                for(let item of that.goods.attr) {
                    item.number = '0';
                }
                if(that.goods.attr_groups.length == 1) {
                    that.goods.attr[0].number = '0';
                }else {
                    for(let item of that.goods.attr_groups) {
                        item.less_attr_group_name = item.attr_group_name.substring(0,10);
                        item.scrollLeft = 0;
                        for(let i in item.attr_list) {
                            item.attr_list[i].active = i > 0 ? false : true;
                            item.attr_list[i].number = 0;
                        }
                    }
                }
                that.flash_sale = that.goods.plugin_extra.flash_sale;
                that.loading = true;
                that.$hideLoading();
                // #ifdef H5
                that.hShareAppMessage();
                // #endif
            });
        },
        onShow() {
            this.showClose = false;
            setTimeout(()=>{
                this.showClose = true;
            })
            if(this.first) {
                return false
            }
            let attr = JSON.parse(JSON.stringify(this.goods.attr));
            let attr_groups = JSON.parse(JSON.stringify(this.goods.attr_groups));
            this.$showLoading();
            this.$nextTick(() => {
                let that = this;
                that.request({
                    url: that.$api.wholesale.detail,
                    data: {
                        id: that.goods_id,
                    }
                }).then(response => {
                    that.goods = response.detail;
                    that.goods.attr = attr;
                    that.goods.attr_groups = attr_groups;
                    this.$hideLoading();
                });
            })
        },
        computed: {
            ...mapState({
				isTip: state => state.mallConfig.mall.setting.is_remind_sell_time,
                mall: state => state.mallConfig.mall,
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            good_negotiable: function() {
                let good_negotiable = this.mall.setting.good_negotiable;
                this.contact_tel = '';
                this.contact = '';
                this.contact_web = '';
                let arr = [];
                for (let i = 0; i < good_negotiable.length; i++) {
                    if (good_negotiable[i] === 'contact_tel') {
                        this.contact_tel = 'contact_tel';
                    }
                    // #ifndef MP-TOUTIAO || MP-ALIPAY || H5
                    if (good_negotiable[i] === 'contact') {
                        this.contact = 'contact';
                    }
                    // #endif
                    if (good_negotiable[i] === 'contact_web') {
                        this.contact_web = 'contact_web';
                    }
                }
                if (this.contact_tel) {
                    arr.push(this.contact_tel);
                }
                if (this.contact) {
                    arr.push(this.contact);
                }
                if (this.contact_web) {
                    arr.push(this.contact_web);
                }
                return arr;
            },
            contactBtnStyle: function() {
                const len = this.good_negotiable.length;
                const theme = this.getTheme.key;
                if (len === 3 && (theme === 'a' || theme === 'b' || theme === 'f')) {
                    return `background:${this.getTheme.background_gradient_btn}`;
                } else if (len === 3 && !(theme === 'a' ||  theme === 'b' || theme === 'f')) {
                    return `background:${this.getTheme.background_gradient_btn};color:${this.getTheme.color};`;
                } if (len === 2 && (theme === 'a' || theme === 'b' || theme === 'f') && !this.contact_tel) {
                    return `background:${this.getTheme.background_s_gradient_btn}`;
                } else if (len === 2 && (theme === 'a' || theme === 'b' || theme === 'f') && this.contact_tel) {
                    return `background:${this.getTheme.background_gradient_btn}`;
                } else if (len === 2 && !(theme === 'a' || theme === 'b' || theme === 'f') && !this.contact_tel) {
                    return `background:${this.getTheme.background_s_gradient_btn};color:${this.getTheme.color}`;
                } else if (len === 2 && !(theme === 'a' || theme === 'b' || theme === 'f') && this.contact_tel) {
                    return `background:${this.getTheme.background_gradient_btn};color:${this.getTheme.color}`;
                } else {
                    return `background:${this.getTheme.background_gradient_btn}`;
                }
            },
            contactBtn: function() {
                const len = this.good_negotiable.length;
                const theme = this.getTheme.key;
                if (len === 3 && (theme === 'a' || theme === 'b' || theme === 'f')) {
                    return `text bd-three-one bd-no-radius `;
                } else if (len === 3 && !(theme === 'a' ||  theme === 'b' || theme === 'f')) {
                    return `bd-three-one bd-no-radius `;
                } if (len === 2 && (theme === 'a' || theme === 'b' || theme === 'f') && !this.contact_tel) {
                    return `text bd-btn-half bd-content-radius-0`;
                } else if (len === 2 && (theme === 'a' || theme === 'b' || theme === 'f') && this.contact_tel) {
                    return `text bd-btn-half bd-content-radius-1`;
                } else if (len === 2 && !(theme === 'a' || theme === 'b' || theme === 'f') && !this.contact_tel) {
                    return `bd-btn-half bd-content-radius-0`;
                } else if (len === 2 && !(theme === 'a' || theme === 'b' || theme === 'f') && this.contact_tel) {
                    return `bd-btn-half bd-content-radius-1`;
                } else {
                    return `text  all-width all-radius `;
                }
            },
			uBottomHeight() {
				if (this.full_reduce && this.goods.sell_time > 0) {
					return 'u-bottom-height-2';
				} else if (this.full_reduce || this.goods.sell_time > 0) {
					return 'u-bottom-height-1';
				} else {
					return 'u-bottom-height-0';
				}
			},
			leftTip() {
				let leftTip = '';
				if (!(this.isTip == 0 && this.goods.sell_time > 0)) {
					leftTip = 'bd-btn-left bd-btn-half';
				} else {
					leftTip = 'box-grow-1';
				}
				return this.goods && this.goods.type === 'goods' ? leftTip : '';
			},
			disableBtn() {
				return this.goods.is_finish_sell ? 'btn-finish-sell' : 'bd-oversell-btn';
			},
			showRight() {
				return !(this.isTip == 0 && this.goods.sell_time > 0)
			},
			remindParams() {
				return {
					sell_time: this.goods.sell_time,
					goods_id: this.goods.id,
					template_message_list: this.goods.template_message_list,
					buy_text: '立即购买'
				};
			},
        },
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            // 分享朋友圈beta
            return this.$shareTimeline({
                title: this.goods.app_share_title ? this.goods.app_share_title : this.goods.name,
                imageUrl: this.goods.pic_url[0].pic_url,
                query: {
                    id: this.goods.id
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
                return this.$shareAppMessage({
                    path: '/plugins/wholesale/goods/goods',
                    title: this.goods.app_share_title ? this.goods.app_share_title : this.goods.name,
                    imageUrl: this.goods.app_share_pic ? this.goods.app_share_pic : this.goods.pic_url[0].pic_url,
                    desc: this.goods.subtitle,
                    params: {
                        id: this.goods.id
                    }
                }, s);
            },
            getMall(e) {
                this.is_open = e.is_open;
            },
            setCoupon(index) {
                this.$set(this.goods.goods_coupon_center[index], 'is_receive', 1);
            },
            clickAttr(data) {
				if (data === 1 && this.goods.sell_time > 0) {
					this.rightTip();
					return ;
				}
                this.show = Math.random();
            },
            attr(data) {
                this.appAttr = data;
            },

            favorite() {
                let url = this.$api.user.favorite_add;
                let favorite = true;
                if (this.goods.favorite) {
                    url = this.$api.user.favorite_remove;
                    favorite = false;
                }
                this.goods.favorite = favorite;
                this.$request({
                    url: url,
                    data: {
                        goods_id: this.goods.id,
                    }
                }).then(response => {
                    if (response.code === 0) {
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: response.msg,
                            showCancel: false,
                        });
                    }
                }).catch(e => {
                });
            },

            back() {
                uni.reLaunch({
                    url: '/pages/index/index'
                });
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
                    setTimeout(()=>{
                        uni.navigateBack();
                    },1000)
                }
            },

            attrtap(e) {
                let that = this;
                if (e.goods !== null) {
                    that.goods = e.goods;
                    if(e.goodsAttr && e.goodsAttr !== 'undefined') {
                        for(let row of e.goodsAttr) {
                            for(let item of that.goods.attr) {
                                if(row.id == item.id) {
                                    item.number = row.number
                                }
                            }
                        }
                    }
                    that.totalNumber = 0;
                    let totalPrice = 0;
                    for(let item of that.goods.attr) {
                        that.totalNumber += +item.number;
                        if(item.number > 0) {
                            let price = that.goods.level_show === 1 ? item.price_member : item.price;
                            totalPrice += item.number*price;
                        }
                    }
                    if(that.goods.attr_groups.length > 1) {
                        for(let row of that.goods.attr_groups[0].attr_list) {
                            row.number = 0;
                            for(let item of that.goods.attr) {
                                if(item.number > 0) {
                                    if(row.attr_id == item.attr_list[0].attr_id && row.attr_name == item.attr_list[0].attr_name) {
                                        row.number += +item.number
                                        row.length = -5 - (+(row.number.toString().length) * 10)
                                    }
                                }
                            }
                        }
                    }
                    setTimeout(()=>{
                        let get = 0;
                        for(let i of that.goods.wholesaleGoods.wholesale_rules) {
                            if(!(that.totalNumber < i.num)) {
                                this.wholesaleDiscount = +i.discount
                                get++
                            }
                        }
                        if(get == 0) {
                            this.wholesaleDiscount = that.goods.wholesaleGoods.type == 0 ? 10 : 0
                        }
                        if(this.wholesaleDiscount > 0) {
                            if(that.goods.wholesaleGoods.type == 0) {
                                totalPrice = totalPrice*(this.wholesaleDiscount/10)
                            }else {
                                totalPrice = totalPrice - (this.wholesaleDiscount*that.totalNumber)
                            }
                        }
                        that.totalPrice = totalPrice.toFixed(2);
                    },0)
                }
            },
            makePhoneCall(number) {
                uni.makePhoneCall({
                    phoneNumber: number
                });
            },
            router(url) {
                uni.navigateTo({
                    url: url
                })
            },
			changeTime(time) {
				this.goods.sell_time = time;
			},
        },
        components: {
            'app-banner': appBanner,
            'app-attr': appAttr,
            'app-goods-full-reduce': appGoodsFullReduce,
            appClose,
            bdInfo,
            bdCoupon,
            bdXbc,
            bdKb,
            bdHc,
            bdDetail,
            bdComments,
            bdService,
			appSellTip
        }
    }
</script>

<style scoped lang="scss">
    .vip-card {
        padding-bottom: #{20rpx};
        background-color: #fff;
    }
    .wholesale {
        height: 88rpx;
        color: #fff;
        .wholesale-item {
            display: flex;
            margin: 0 12rpx;
            justify-content: center;
            align-items: center;
            font-size: 22rpx;
            width: 218rpx;
            .wholesale-price {
                font-size: 26rpx;
                margin-top: -5rpx;
                text {
                    font-size: 44rpx;
                }
            }
            >view {
                display: inline-block;
                >view {
                    margin-top: -10rpx;
                }
            }
            &:first-of-type {
                justify-content: flex-start;
            }
            &:last-of-type {
                justify-content: flex-end;
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
        margin-bottom: 8upx;
    }
    .bd-text {
        font-size: 20upx;
        color: #888888;
        line-height: 1;
    }
    .bd-btn {
        text-align: center;
        line-height: 70upx;
        font-size: 26upx;
        border-radius: 35upx;
    }
    .bd-btn-left {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .bd-btn-right {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    .bd-btn-half {
        width: 50%;
    }
    .bd-btn-color {
        color: #ffffff;
    }
    .bd-oversell-btn {
        background-color: #CDCDCD;
    }
    .bd-content-radius-0 {
        border-radius: 35upx 0 0 35upx;
    }
    .bd-content-radius-1 {
        border-radius:0 35upx 35upx 0;
    }
    .bd-btn-tel {
        >view {
            line-height: 70upx;
            text-align: center;
        }
        .tel {
            border-top-left-radius: 35upx;
            border-bottom-left-radius: 35upx;
        }
        .contact {
            padding: 0;
            height: 70upx;
            line-height: 70upx;
            margin: 0;
            border: none;
        }
        .service {
            border-top-right-radius: 35upx;
            border-bottom-right-radius: 35upx;
        }
        .all-radius {
            border-radius: 35upx;
        }
        .all-width {
            width: 100%;
        }
        .bd-three-one {
            width: calc(100%/3);
        }
        .bd-no-radius {
            border-radius: 0;
        }
    }
    .product-list {
        background-color: white;
    }

    .join-member {
        background-color: #ffffff;
        padding: 0 #{24rpx};
    }
    .text {
        color: #ffffff;
    }
    .default-bakground {
        background-color: #446dfd;
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
    .u-bottom-height-0 {
        height: 110upx;
    }
    .u-bottom-height-1 {
        height: 190upx;
    }
    .goods-margin {
        margin-top: 20upx;
    }
    .wholesale-text {
        height: 30rpx;
        line-height: 30rpx;
        padding: 0 15rpx;
        border-radius: 15rpx;
        font-size: $uni-font-size-weak-two;
        display: inline-block;
        margin-bottom: #{20rpx};
        &.margin {
            margin-bottom: 0;
        }
    }

    .text {
        color: #ffffff;
    }
	.btn-finish-sell {
		background: linear-gradient(to right, rgba(153, 153, 153, 1), rgba(153, 153, 153, 0.7)) ;
	}
    .u-bottom-height-2 {
        height: 270upx;
    }
</style>