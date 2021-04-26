<template>
    <app-layout>
        <view v-if="!loading" class="u-goods-detail"></view>
        <template v-else>
            <app-goods-banner
                :isCart="false"
                :picList="detail.pic_url"
                :share="detail.share"
                sign="pintuan"
                :goods_id="goods_id"
                :video-url="detail.video_url"
            ></app-goods-banner>
            <app-pt-time
                :theme="getTheme"
                :end_time="detail.pintuanGoods.end_time"
                :start_time="start_time"
                :time_str="time_str"
            ></app-pt-time>
            <!-- #ifndef MP-TOUTIAO -->
            <view>
            <!-- #endif -->
                <bd-info
                    :theme="getTheme"
                    :name="detail.name"
                    :is-negotiable="detail.is_negotiable"
                    :subtitle="detail.subtitle"
                    :level-show="detail.level_show"
                    :price="detail.price"
                    :original-price="detail.original_price"
                    :price-max="detail.price_max"
                    :price-min="detail.price_min"
                    :price-member-max="detail.price_member_max"
                    :price-member-min="detail.price_member_min"
                    :discount='discount'
                    :is-vip-card-user="is_vip_card_user"
                    :sales="detail.sales"
                    :unit="detail.unit"
                    :is-sales="detail.is_sales"
                    :is-vip="isVip"
                    :flash-sale="flash_sale"
                    :goods-id="detail.id"
                    :extra-quick-share="detail.extra_quick_share"
                    :app-share-pic="detail.app_share_pic"
                    :app-share-title="detail.app_share_title"
                    :poster-config="poster_config"
                    :poster-generate="poster_generate"
                    :has-poster-nav="true"
                    v-bind:goods="detail"
                    :share-url="share_url"
                    @share="hShareAppMessage"
					:limit-buy="detail.limit_buy"
					:min-number="detail.min_number"
                >
                    <view class="app-bottom dir-left-wrap cross-center">
                        <text class="app-price-symbol app-original-price" :style="{'color': getTheme.color}" v-if="detail.level_show === 1">{{detail.groups.original_price}}</text>
                        <text class="app-pt-info" :style="{'color': getTheme.color,'background-color': getTheme.background_o}" v-for="(item, index) in detail.groups" :key="index">{{item.groups.people_num}}人拼团</text>
                        <text class="app-pt-info" :style="{'color': getTheme.color,'background-color': getTheme.background_o}">拼团立省￥{{groupSparePrice}}</text>
                    </view>
                </bd-info>
            <!-- #ifndef MP-TOUTIAO -->
            </view>
            <!-- #endif -->
            <bd-coupon @change="setCoupon" :theme="getTheme" :coupons="detail.goods_coupon_center"></bd-coupon>
            <bd-xbc
                :coAttr="is_open"
                :attr-list="selectAttr&&selectAttr.attr_list"
                :type="detail.type"
                :guarantee-title="detail.guarantee_title"
                :guarantee-pic="detail.guarantee_pic"
                :param_content="detail.param_content"
                :param_name="detail.param_name"
                :services="detail.services"
                :attr-groups="detail.attr_groups"
                @openAttr="shop(true)"
            ></bd-xbc>
            <!--商品信息-->
            <bd-hc
                :integral="detail.goods_marketing_award.integral"
                :coupon="detail.goods_marketing_award.coupon"
                :card="detail.goods_marketing_award.card"
                :balance="detail.goods_marketing_award.balance"
                :theme="getTheme"
            ></bd-hc>
            <bd-kb
                :limit="detail.goods_marketing.limit"
                :express="detail.express"
                :shipping="detail.goods_marketing.shipping"
                :pickup="detail.goods_marketing.pickup"
            ></bd-kb>
            <app-participant :theme="getTheme" :pintuan_list="pintuan_list"></app-participant>
            <bd-comments :goods-id="detail.id"></bd-comments>
            <bd-detail :detail="detail.detail"></bd-detail>
            <app-related-suggestion-product :theme="getTheme" sign="pintuan" :list="list"></app-related-suggestion-product>
            <!--空格区域-->
            <view class="safe-area-inset-bottom u-bottom">
                <view class="u-bottom-height" :class="pintuan_list.length > 0 && full_reduce ? 'u-bottom-height-1' : 'u-bottom-height-0'"></view>
            </view>
            <!--底部按钮-->
            <view v-if="is_open == 1" class="safe-area-inset-bottom  u-bottom-fixed">
                <view v-if="full_reduce && !show">
                    <app-goods-full-reduce
                        :theme="getTheme"
                        :full_reduce="full_reduce"
                    >
                    </app-goods-full-reduce>
                </view>
                <view class="join dir-left-nowrap cross-center main-between" v-if="pintuan_list.length > 0 && !show">
                    <view class="dir-left-nowrap cross-center">
                        <image class="avatar" :src="pintuan_list[0].avatar"></image>
                        <view class="text">剩余
                            <text style="color: #ff4544;">{{pintuan_list_time}}</text>
                            ，还差{{pintuan_list[0].surplus_people}}人</view>
                    </view>
                    <view :style="{'background-color': getTheme.background}" class="btn" @click="goJoin(pintuan_list[0].id)">参与拼团</view>
                </view>
                <app-button-button
                    :level_show="detail.level_show"
                    :member_price_min="detail.groups[0].member_price_min"
                    :groups="detail.groups"
                    :pintuan_groups="item.pintuan_groups"
                    :price="price"
                    :price_member_min="detail.price_member_min"
                    :is_alone_buy="detail.pintuanGoods.is_alone_buy"
                    :selectGroupAttrId="selectGroupAttrId"
                    :selectAttr="selectAttr"
                    :pt="pt"
                    :item="detail"
                    @click="shop"
                    :start_time="start_time"
                    :theme="getTheme"
                    :singlePrice="singlePrice"
                    :name="detail.name"
                    :url="webUrl"
                ></app-button-button>
            </view>
            <u-attr

                :goods="detail"
                :checked="selectAttr"
                :theme="getTheme"
                @check="attrTap"
                v-model="show"
                :is_show_left="false"
                :is_show_right="false"
                ref="attr"
                :again="again"
            >
                <view v-if="pt === true" slot="extra">
                    <app-pt-attr :groups="detail.groups" :selectGroupAttrId="selectGroupAttrId" @click="setGroupAttrID" :theme="getTheme"></app-pt-attr>
                </view>
                <template slot="right">
                    <view class="u-pt-bottom dir-left-nowrap">
                        <view v-if="detail.pintuanGoods.is_alone_buy" class="bd-btn-left bd-btn dir-top-nowrap cross-center main-center box-grow-1"
                              :style="{'background-color': getTheme.key == 'a' ? '#feeeee' : getTheme.background_s,'color': getTheme.key == 'a' ? '#ff5c5c' : getTheme.color}"
                              @click="leftFunc(number)">
                            <text class="price">
                                {{singlePrice}}
                            </text>
                            <text class="app-text">单独购买</text>
                        </view>
                        <view @click="rightFunc" class="bd-btn dir-top-nowrap  cross-center main-center box-grow-1"
                              :style="{'background': getTheme.key == 'a' ? 'linear-gradient(140deg, #ff9460, #ff5c5c)' : getTheme.background,'color': getTheme.main_text}"
                              :class="[!detail.pintuanGoods.is_alone_buy ? 'bd-btn-radius' : 'bd-btn-right']" >
                            <text class="price">{{groupPrice}}</text>
                            <text class="app-text">{{detail.groups[set_group_num].groups.people_num}}人拼团</text>
                        </view>
                    </view>
                </template>
            </u-attr>
            <!--快捷导航-->
            <app-quick-navigation></app-quick-navigation>
        </template>
        <app-close v-if="showClose" :modal="false" @update="getMall"></app-close>
    </app-layout>
</template>
<script>
    import { mapGetters, mapState } from 'vuex';
    import appGoodsBanner from '../../../components/page-component/goods/app-goods-banner.vue';
    import appPtTime from '../components/app-pt-time.vue';
    import appMerchantGuarantee from '../components/app-merchant-guarantee.vue';
    import appButtomButton from '../components/app-buttom-button.vue';
    import appPtAttr from '../components/app-pt-attr.vue';
    import appParticipant from '../components/app-participant.vue';
    import appRelatedSuggestionProduct from '../../../components/page-component/app-related-suggestion-product/app-related-suggestion-product.vue';
    import appQuickNavigation from "../../../components/page-component/app-quick-navigation/app-quick-navigation.vue";
    import appGoodsFullReduce from "../../../components/page-component/goods/app-goods-full-reduce";
    import uAttr from '@/components/page-component/goods/u-attr.vue';
    import bdInfo from '@/components/page-component/goods/bd-info';
    import bdCoupon from '@/components/page-component/goods/bd-coupon.vue';
    import bdXbc from '@/components/page-component/goods/bd-xbc.vue';
    import bdKb from '@/components/page-component/goods/bd-kb.vue';
    import bdHc from '@/components/page-component/goods/bd-hc.vue';
    import bdDetail from '@/components/page-component/goods/bd-detail.vue';
    import bdComments from '@/components/page-component/goods/bd-comments.vue';
    import appClose from '@/components/basic-component/app-close/app-close.vue';

    export default {
        name: 'goods',
        data() {
            return {
                showClose: false,
                is_open: 0,
                goods_id: 0,
                detail: {
                    goods_activity: {
                        full_reduce: {}
                    },
                    groups: []
                },
                full_reduce: null,
                loading: false,
                // 分享
                share_url: '',
                // 倒计时
                time_str: {
                    day: '00',
                    hou: '00',
                    min: '00',
                    sec: '00'
                },
                down_time: 0,
                // 超级会员功能
                discount: null,
                isVip: false,
                goods: {},
                item: {
                    name: '',
                    pintuan_groups: [],
                },
                selectAttr: null,
                show: false,
                pt: false,
                selectGroupAttrId: 0,
                pintuan_list: [],
                list: [],
                cartShow: false,
                price: '',
                webUrl: '',
                time: null,
                is_vip_card_user: 0,
                url: this.$api.pt.detail,
                poster_config: this.$api.pt.poster_config,
                poster_generate: this.$api.pt.poster_generate,
                aloneAttr: null,
                start_time: false,
                pintuan_list_time: '',
                pt_time: null,
                number: 1,
                group_price: '',
                again: 0,
                // 限时抢购
                flash_sale: null,
            }
        },
        computed: {
            ...mapState('gConfig', {
                iphone: (data) => {
                    return data.iphone;
                },
                iphoneHeight: (state) => {
                    return state.iphoneHeight;
                },
            }),
            ...mapState({
                mall: state => state.mallConfig.mall
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            set_group_num() {
                for (let i = 0; i < this.detail.groups.length; i++) {
                    if (this.detail.groups[i].groups.id == this.selectGroupAttrId) {
                        return i;
                    }
                }
            },
            groupPrice: function() {
                if (!this.$validation.isEmpty(this.selectAttr)) {
                    if (this.pt) {
                        if (this.detail.level_show === 1) {
                            if (this.selectAttr.price_member === 0) {
                                return '免费';
                            } else {
                                return `￥${this.selectAttr.price_member}`;
                            }
                        } else {
                            if (Number(this.selectAttr.price) ===  0) {
                                return '免费';
                            } else {
                                return `￥${this.selectAttr.price}`;
                            }
                        }
                    } else {
                        let attr = this.detail.groups[this.set_group_num].attr;
                        for (let i = 0; i < attr.length; i++) {
                            if (attr[i].sign_id === this.selectAttr.sign_id) {
                                if (this.detail.level_show === 1) {
                                    if (attr[i].price_member === 0) {
                                        return '免费';
                                    } else {
                                        return `￥${attr[i].price_member}`;
                                    }
                                } else {
                                    if (Number(attr[i].price) ===  0) {
                                        return '免费';
                                    } else {
                                        return `￥${attr[i].price}`;
                                    }
                                }
                            }
                        }
                    }
                }
            },
            singlePrice: function() {
                if (!this.$validation.isEmpty(this.selectAttr)) {
                    for (let i = 0; i < this.aloneAttr.length; i++) {
                        if (this.aloneAttr[i].sign_id === this.selectAttr.sign_id) {
                            if (this.detail.level_show === 1) {
                                if (Number(this.aloneAttr[i].price_member) === 0) {
                                    return '免费';
                                } else {
                                    return `￥${this.aloneAttr[i].price_member}`;
                                }
                            } else {
                                if (Number(this.aloneAttr[i].price) === 0) {
                                    return '免费';
                                } else {
                                    return `￥${this.aloneAttr[i].price}`;
                                }
                            }
                        }
                    }
                } else {
                    if (this.detail.level_show === 1) {
                        if (Number(this.detail.price_member_min) === 0) {
                            return '免费';
                        } else {
                            return `￥${this.detail.price_member_min}`;
                        }
                    } else {
                        if (Number(this.detail.price) ===  0) {
                            return '免费';
                        } else {
                            return `￥${this.detail.price}`
                        }
                    }
                }
            },
            groupSparePrice: function() {
                if (this.detail.groups.length > 0) {
                    return (this.detail.original_price - this.detail.groups[0].price_min).toFixed(2);
                } else {
                    return this.detail.original_price;
                }
            }
        },
        onShow() {
            this.showClose = false;
            setTimeout(()=>{
                this.showClose = true;
            })
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.webUrl = '/plugins/pt/goods/goods?goods_id=' + options.goods_id;
            this.goods_id = options.goods_id;
            this.requestDetail();
            this.newRecommend();
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
        },
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            // 分享朋友圈beta
            return this.$shareTimeline({
                title: this.detail.app_share_title ? this.detail.app_share_title : this.detail.name,
                query: {
                    goods_id: this.goods_id
                } // 此处填写页面的参数
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
                    path: '/plugins/pt/goods/goods',
                    title: this.detail.app_share_title ? this.detail.app_share_title : this.detail.name,
                    imageUrl: this.detail.app_share_pic ? this.detail.app_share_pic : this.detail.pic_url[0].pic_url,
                    desc: this.detail.subtitle,
                    params: {
                        goods_id: this.goods_id
                    }
                }, s);
            },
            getMall(e) {
                this.is_open = e.is_open;
            },
            goJoin(id) {
                uni.navigateTo({
                    url: `/plugins/pt/detail/detail?id=${id}`
                })
            },
            // 获取商品详情
            async requestDetail() {
                const e = await this.$request({
                    url: this.$api.pt.detail,
                    method: 'get',
                    data: {
                        id: this.goods_id,
                    }
                });
                if (e.code === 0) {
                    this.loading = true;
                    let detail = e.data.detail;
                    this.detail = detail;
                    this.price = detail.price;
                    // 规格初始化
                    this.aloneAttr = JSON.parse(JSON.stringify(detail.attr));
                    let groups = detail.groups;
                    if (groups.length > 0) {
                        this.detail.attr = groups[0].attr;
                        this.selectGroupAttrId = groups[0].groups.id;
                    }
                    if (detail.goods_activity) {
                        this.full_reduce = detail.goods_activity.full_reduce;
                    }
                    this.flash_sale = detail.plugin_extra.flash_sale;
                    this.share_url = `${this.$api.pt.poster}&goods_id=${this.detail.id}`;
                    this.poster_config = `${this.poster_config}&goods_id=${this.detail.id}`;
                    this.poster_generate = `${this.poster_generate}&goods_id=${this.detail.id}`;
                    this.pintuan_list = e.data.pintuan_list;
                    if (this.pintuan_list.length > 0) {
                        let timelog = new Date(this.pintuan_list[0].surplus_date_time.replace(/-/g, '/'));
                        this.pt_time = setInterval(() =>{
                            let time = timelog.getTime() - new Date().getTime();
                            if (time < 0) {
                                clearInterval(this.pt_time);
                            }
                            let day = parseInt((time/1000/60/60/24)%30);
                            let hou = parseInt((time/1000/60/60)%24);
                            let min = parseInt((time/1000/60)%60);
                            let sec = parseInt((time/1000)%60);
                            if (day > 0) {
                                this.pintuan_list_time = day+"天"+hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec);
                            } else {
                                this.pintuan_list_time = hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec);
                            }
                        },1000);
                    }
                    if (detail.vip_card_appoint.discount) {
                        this.isVip = true;
                        this.discount = detail.vip_card_appoint.discount;
                    }
                    this.is_vip_card_user = detail.vip_card_appoint.is_vip_card_user;
                    this.goods = {
                        attr: detail.attr,
                        cover_pic: detail.cover_pic,
                        level_show: detail.level_show,
                        price: detail.price,
                        mch_id: detail.mch_id,
                        name: detail.name,
                        id: detail.id,
                    };
                    if (detail.pintuanGoods.end_time !== '0000-00-00 00:00:00') {
                        this.countdown(detail.pintuanGoods.end_time);
                    }

                    if (detail.pintuanGoods.start_time) {
                        let time = new Date(detail.pintuanGoods.start_time.replace(/-/g, '/'));
                        let nowTime = new Date();
                        let equation = time.getTime() - nowTime.getTime();
                        if (equation > 0) {
                            this.start_time = false;
                            this.countdown(detail.pintuanGoods.start_time);
                        } else {
                            this.start_time = true;
                        }
                    }
                    // #ifdef H5
                    this.hShareAppMessage();
                    // #endif
                } else {
                    uni.showToast({
                        title: e.msg,
                        icon: 'none'
                    })
                }
            },
            countdown(t) {
                let time = new Date(t.replace(/-/g, '/'));
                let nowTime = new Date();
                let equation = time.getTime() - nowTime.getTime();
                let day = parseInt((equation / 3600000 / 24));
                let hour = parseInt((equation / 1000 / 60 / 60) % 24);
                let minute = parseInt((equation / 1000 / 60) % 60);
                let second = parseInt((equation / 1000) % 60);
                this.time_str = {
                    day: day < 10 ? `0${day}` : day,
                    hou: hour < 10 ? `0${hour}` : hour,
                    min: minute < 10 ? `0${minute}` : minute,
                    sec: second < 10 ? `0${second}` : second
                }
                this.down_time = setTimeout(() => {
                    this.countdown(t);
                }, 1000);
            },

            async newRecommend() {
                const e = await this.$request({
                    url: this.$api.goods.new_recommend
                });
                if (e.code === 0) {
                    this.list = e.data.list;
                }
            },
            setCoupon(index) {
                this.$set(this.detail.goods_coupon_center[index], 'is_receive', 1);
            },
            attrTap({item, number}) {
                for (let i = 0; i < this.aloneAttr.length; i++) {
                    if (this.aloneAttr[i].sign_id === item.sign_id) {
                        this.price = this.aloneAttr[i].price;
                    }
                }
                this.number = number;
                this.selectAttr = item;
            },
            shop(data) {
				if (!this.detail.buy_goods_auth) {
					this.$tips.showToast({
						title: '您暂无权限购买该商品',
						icon: 'none'
					});
					return;
				}
                if (data === true) {
                    this.$set(this, 'pt', true);
                    this.detail.groups.forEach((item) => {
                        if (this.selectGroupAttrId === item.groups.id) {
                            this.$set(this.detail, 'attr', item.attr);
                            this.$set(this.detail, 'id', item.groups.goods_id);
                        }
                    });
                } else {
                    this.$set(this, 'pt', false);
                    this.$set(this.detail, 'attr', this.aloneAttr);
                    this.$set(this.detail, 'id', this.goods_id);
                }
                this.show = true;
                this.$nextTick(() => {
                    this.again = Math.random();
                });
            },
            setGroupAttrID(item) {
                this.selectGroupAttrId = item.groups.id;
                this.$set(this.detail, 'attr', item.attr);
                this.$set(this.detail, 'id', item.groups.goods_id);
                this.$nextTick(() => {
                    this.again = Math.random();
                });
            },
            defaultRequest() {
                this.$set(this, 'pt', true);
                this.detail.attr = this.detail.groups[0].attr;
                this.selectGroupAttrId = this.detail.groups[0].groups.id;
                this.detail.id = this.detail.groups[0].groups.goods_id;
            },
            rightFunc() {
                if (this.pt === false && this.show === true) {
                    this.pt = true;
                    this.$set(this, 'pt', true);
                    setTimeout(() => {
                        this.show = true;
                    }, 500);
                    this.detail.groups.forEach((item) => {
                       if (this.selectGroupAttrId === item.groups.id) {
                           this.$set(this.detail, 'attr', item.attr);
                           this.$set(this.detail, 'id', item.groups.goods_id);
                       }
                    });
                    this.$nextTick(() => {
                        this.again = Math.random();
                    });
                } else {
					if (this.detail.min_number > this.number) {
						this.$tips.showToast({
							title: '该商品' + this.detail.min_number + this.detail.unit + '起售',
							icon: 'none'
						});
						return false;
					}
					if (typeof this.detail.limit_buy !== 'undefined' && this.detail.limit_buy.status == 1 && this.detail.limit_buy.rest_number < this.number) {
						this.$tips.showToast({
							title: this.detail.limit_buy.text,
							icon: 'none'
						});
						return false;
					}
                    let attrs = [];
                    this.selectAttr.attr_list.forEach(item => {
                        attrs.push({
                            attr_id: item.attr_id,
                            attr_group_id: item.attr_group_id
                        });
                    });
                    let newData = {
                        pintuan_order_id: 0,
                        pintuan_group_id: this.selectGroupAttrId,
                        mch_id: this.detail.mch_id ? this.detail.mch_id : 0,
                        goods_list: [
                            {
                                id: this.detail.id,
                                attrs,
                                num: this.number,
                                cat_id: 0,
                                goods_attr_id: this.selectAttr.id
                            }
                        ]
                    }
                    uni.navigateTo({
                        url: `/pages/order-submit/order-submit?mch_list=${JSON.stringify([newData])}&preview_url=${encodeURIComponent(this.$api.pt.order_preview)}&submit_url=${encodeURIComponent(this.$api.pt.order_submit)}`
                    });
                }

            },
            leftFunc(number) {
                if (this.pt === true && this.show === true) {
                    this.$set(this, 'pt', false);
                    setTimeout(() => {
                        this.show = true;
                    }, 500);
                    this.$set(this.detail, 'attr', this.aloneAttr);
                    this.$set(this.detail, 'id', this.goods_id);
                    this.$nextTick(() => {
                        this.$refs.attr.firstSelect();
                    });
                } else {
					if (this.detail.min_number > this.number) {
						this.$tips.showToast({
							title: '该商品' + this.detail.min_number + this.detail.unit + '起售',
							icon: 'none'
						});
						return false;
					}
					if (typeof this.detail.limit_buy !== 'undefined' && this.detail.limit_buy.status == 1 && this.detail.limit_buy.rest_number < this.number) {
						this.$tips.showToast({
							title: this.detail.limit_buy.text,
							icon: 'none'
						});
						return false;
					}
                    let goods = this.detail;
                    let select_attr = this.selectAttr;
                    let attr = [];
                    for (let i in select_attr.attr_list) {
                        attr.push({
                            attr_id: select_attr.attr_list[i].attr_id,
                            attr_group_id: select_attr.attr_list[i].attr_group_id
                        });
                    }
                    let mch_list = [{
                        mch_id: goods.mch_id ? goods.mch_id : 0,
                        pintuan_order_id: 0,
                        pintuan_group_id: 0,
                        goods_list: [{
                            id: goods.id,
                            attr: attr,
                            num: number,
                            cat_id: 0,
                            goods_attr_id: select_attr.id
                        }]
                    }];
                    uni.navigateTo({
                        url: `/pages/order-submit/order-submit?mch_list=${JSON.stringify(mch_list)}&preview_url=${encodeURIComponent(this.$api.pt.order_preview)}&submit_url=${encodeURIComponent(this.$api.pt.order_submit)}`
                    });
                }
            }
        },

        components: {
            bdInfo,
            bdCoupon,
            bdXbc,
            bdKb,
            bdHc,
            bdDetail,
            bdComments,
            'app-goods-banner': appGoodsBanner,
            'app-pt-time': appPtTime,
            'app-merchant-guarantee': appMerchantGuarantee,
            'app-button-button': appButtomButton,
            'app-pt-attr': appPtAttr,
            'app-participant': appParticipant,
            'app-related-suggestion-product': appRelatedSuggestionProduct,
            'app-quick-navigation': appQuickNavigation,
            uAttr,
            appGoodsFullReduce,
            appClose
        },
        onHide() {
            clearTimeout(this.down_time);
        },
        onUnload() {
            clearTimeout(this.down_time);
        }
    }
</script>
<style lang="scss" scoped>
    .vip-card {
        padding: 0 #{20rpx} #{20rpx};
        background-color: #fff;
    }
    .join-member {
        background-color: #ffffff;
        padding: 0 #{24rpx};
        box-sizing: border-box;
    }

    .app-buttons {
        position: fixed;
        z-index: 1602;
    }

    .join {
        width: 750upx;
        height: 88upx;
        background-color: #fff7b8;
        padding: 0 24upx;
        .avatar {
            width: 64upx;
            height: 64upx;
            border-radius: 32upx;
        }
        .btn {
            width: 160upx;
            height: 64upx;
            border-radius: 40upx;
            font-size: 26upx;
            color: #ffffff;
            line-height: 64upx;
            text-align: center;
        }
        .text {
            font-size: 26upx;
            margin-left: 24upx;
            line-height: 1;
            color: #353535;
        }
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
        height: 190upx;
    }
    .u-bottom-height-1 {
        height: 280upx;
    }
    .goods-margin {
        margin-top: 20upx;
    }

    .u-pt-bottom {
        width: 702upx;
        height: 70upx;
    }
    .bd-btn-left {
        border-top-left-radius: 35upx;
        border-bottom-left-radius:35upx;
    }
    .bd-btn-radius {
        border-radius: 35upx;
    }
    .bd-btn-right {
        border-top-right-radius: 35upx;
        border-bottom-right-radius: 35upx;
    }
    .bd-btn {
        text-align: center;
        font-size: 22upx;
    }
    .app-bottom {
        margin-top: #{18rpx};
        >text {
            margin-bottom: 5upx;
        }
        .app-original-price {
            font-size: #{23rpx};
            margin-right: #{10rpx};
        }
        .app-pt-info {
            display: inline-block;
            height: #{30rpx};
            line-height: #{30rpx};
            padding: 0 #{8rpx};
            margin-left: #{5rpx};
            font-size: #{20rpx};
        }
    }

    .app-pt-button {
        background: linear-gradient(140deg, #ff9460, #ff5c5c);
        text {
            color: white;
        }
    }

    .app-single-button {
        background-color: #feeeee;

        text {
            color: #ff5c5c;
        }
    }
    .bt-text {
        color: white;
    }
</style>
