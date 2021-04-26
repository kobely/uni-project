<template>
	<app-layout>
        <view v-if="!goods" class="u-goods-detail"></view>
		<template class="detail" v-if="goods">
            <!--商品轮播图-->
            <app-goods-banner
                v-bind:picList="goods.pic_url"
                v-bind:share="goods.share"
                v-bind:isCart="false"
                v-bind:videoUrl="goods.video_url"
                v-bind:goods_id="goods.id"
                sign="advance"
            ></app-goods-banner>
            <!--商品公告-->
            <detail-ad
                v-if="goods.advanceGoods.end_prepayment_at"
                v-bind:sales="goods.sales"
                v-bind:d="d"
                v-bind:h="h"
                v-bind:m="m"
                v-bind:s="s"
                v-bind:theme="getTheme"
            ></detail-ad>
			<!-- 详情标题 -->
            <app-name v-bind:name="goods.name"></app-name>
            <view v-if="goods.subtitle" class="goods-subtitle">
                <view class="t-omit-three">{{goods.subtitle}}</view>
            </view>
            <!--商品价格-->
            <detail-price-share
                v-if="goods.attr.length > 0"
                v-bind:url="url"
                v-bind:original_price="goods.original_price"
                v-bind:attr="goods.attr"
                v-bind:price_min="goods.price_min"
                v-bind:price_max="goods.price_max"
                v-bind:group_max_member_price="goods.group_max_member_price"
                v-bind:group_min_member_price="goods.group_min_member_price"
                v-bind:end_prepayment_at="goods.advanceGoods.end_prepayment_at"
                v-bind:pay_limit="goods.advanceGoods.pay_limit"
                v-bind:level_show="goods.level_show"
                v-bind:cats="goods.goodsWarehouse && goods.goodsWarehouse.cats"
                v-bind:goodsId="goods.id"
                v-bind:is_vip_card_user="goods.vip_card_appoint.is_vip_card_user"
                v-bind:discount="goods.vip_card_appoint.discount"
                v-bind:theme="getTheme"
                v-bind:has-poster-nav="true"
                v-bind:poster-config="poster_config + `&goods_id=` + goods.id"
                v-bind:poster-generate="poster_generate + `&goods_id=` + goods.id"
                v-bind:goods="goods"
                @share="hShareAppMessage"
            ></detail-price-share>
			<view class="bd-info-extra">
				<bd-info-extra :unit="goods.unit" :theme="getTheme" :min-number="goods.min_number" :limit-buy="goods.limit_buy" :goods="goods"></bd-info-extra>
			</view>	
            <!--商品会员-->
			<view class="join-member" v-if="goods.level_show === 2">
				<app-join-member
                    v-bind:member-min-price="`${goods.group_min_member_price}`"
                    v-bind:member-max-price="`${goods.group_min_member_price}`"
                    v-bind:price="`${goods.original_price}`"
				></app-join-member>
			</view>
            <!--超级会员卡-->
			<view class="detail-vip" v-if="goods.vip_card_appoint.discount > 0">
				<app-vip-card top="0" background="#fff"></app-vip-card>
			</view>
			<template v-if="goods.advanceGoods.ladder_rules.length>0">
				<detail-discount
                    v-bind:url="url"
                    v-bind:ladder_rules="goods.advanceGoods.ladder_rules"
                    v-bind:sales="goods.sales"
				></detail-discount>
			</template>
            <bd-coupon @change="setCoupon" :theme="getTheme" :coupons="goods.goods_coupon_center"></bd-coupon>
            <bd-xbc
                :coAttr="is_open"
                :attr-list="select_attr_group"
                :type="goods.type"
                :guarantee-title="goods.guarantee_title"
                :guarantee-pic="goods.guarantee_pic"
                :param_content="goods.param_content"
                :param_name="goods.param_name"
                :services="goods.services"
                :attr-groups="goods.attr_groups"
                :goods-stock="goods.goods_stock"
                @openAttr="close_attr(false)"
            ></bd-xbc>
            <detail-attr
                v-if="!active && goods.attr.length>0"
                v-bind:theme="getTheme"
                v-bind:height="110"
                v-bind:cover_pic="goods.cover_pic"
                v-bind:attr="goods.attr"
                v-bind:attr_groups="goods.attr_groups"
                v-bind:goods_stock="goods.goods_stock"
                v-bind:attr_deposit="attr_deposit"
                v-bind:attr_swell_deposit="attr_swell_deposit"
                v-bind:attr_stock="attr_stock"
                v-bind:attr_price="attr_price"
                v-bind:attr_price_member="attr_price_member"
                v-bind:level_show="goods.level_show"
                v-bind:attr_pic_url="attr_pic_url"
                @select_attr="select_attr"
                @close_attr="close_attr"
                v-bind:num="num"
                v-bind:detail="goods"
                @change_num="change_num"
                @change_num_data="change_num_data"
            ></detail-attr>
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
            <app-related-suggestion-product text="您或许会喜欢" sign="advance" v-bind:theme="getTheme"  v-bind:list="list"></app-related-suggestion-product>
			<!-- 空白格 -->
            <view class="safe-area-inset-bottom">
                <view :class="full_reduce ? 'u-bottom-height-1' : 'u-bottom-height-0'"></view>
            </view>
			<view v-if="is_open == 1" class="safe-area-inset-bottom u-bottom-fixed">
                <view v-if="full_reduce && active">
                    <app-goods-full-reduce
                        :theme="getTheme"
                        :full_reduce="full_reduce"
                    >
                    </app-goods-full-reduce>
                </view>
                <detail-bottom-button
                    v-bind:theme="getTheme"
                    @close_attr="close_attr"
                    v-bind:favorite="goods.favorite"
                    v-bind:active="active"
                    v-bind:goods_id="goods.id"
                    @favorite="favorite"
                    v-bind:detail="goods"
                    v-bind:num="num"
                    v-bind:buttonDisabled="buttonDisabled"
                    v-bind:end_prepayment_at="goods.advanceGoods.end_prepayment_at"
                    @request="request_detail"
                ></detail-bottom-button>
			</view>
            <app-close v-if="showClose" :modal="false" @update="getMall"></app-close>
            <!-- 快捷导航 -->
            <app-quick-navigation></app-quick-navigation>
		</template>
	</app-layout>
</template>

<script>
	import { mapState, mapGetters } from'vuex';
    import appGoodsBanner from '../../../components/page-component/goods/app-goods-banner.vue';
	import detailAd from '../components/detail-ad.vue';
	import detailPriceShare from '../components/detail-price-share.vue';
	import detailBottomButton from '../components/detail-bottom-button.vue';
	import detailAttr from '../components/detail-attr.vue';
    import appJoinMember from '../../../components/page-component/app-join-member/app-join-member.vue';
    import appRelatedSuggestionProduct from '../../../components/page-component/app-related-suggestion-product/app-related-suggestion-product.vue';
	import detailDiscount from '../components/detail-discount.vue';
	import detailVip from '../components/detail-vip.vue';
	import appVipCard from '../../../components/page-component/app-vip-card/app-vip-card.vue';
	import appName from '../../../components/page-component/app-goods-detail/app-name.vue';
    import appQuickNavigation from '../../../components/page-component/app-quick-navigation/app-quick-navigation.vue';
	import appGoodsFullReduce from '../../../components/page-component/goods/app-goods-full-reduce.vue';
    import appClose from '@/components/basic-component/app-close/app-close.vue';
    import bdDetail from '@/components/page-component/goods/bd-detail.vue';
    import bdComments from '@/components/page-component/goods/bd-comments.vue';
    import bdKb from '@/components/page-component/goods/bd-kb.vue';
    import bdHc from '@/components/page-component/goods/bd-hc.vue';
    import bdCoupon from '@/components/page-component/goods/bd-coupon.vue';
    import bdXbc from '@/components/page-component/goods/bd-xbc.vue';
	import bdInfoExtra from '@/components/page-component/goods/bd-info-extra.vue';

    export default {
        name: "detail",
	    data() {
            return {
                showClose: false,
                is_open: 0,
                full_reduce: null,
                active: true,
	            attr_deposit: '0',
	            attr_swell_deposit: '0',
	            attr_stock: 0,
                attr_price: '0',
                attr_price_member: 0,
	            url: '',
                level_show: 0,
	            loading: false,
	            select_attr_group: [],
                zhe: false,
                list: [],
	            num: 1,
                shareShow: false,
                attr_pic_url: '',
                goods_id: -1,
                d: 0,
                h: 0,
                m: 0,
                s: 0,
                end_time: -1,
				buttonDisabled: false,
                poster_config: this.$api.advance.poster_config,
                poster_generate: this.$api.advance.poster_generate,
                goods: null
            }
	    },
		onLoad(data) {
            this.goods_id = data.id;
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				menus: ['shareAppMessage', 'shareTimeline']
			})
			// #endif
	    },
	    onShow() {
            this.showClose = false;
            setTimeout(()=>{
                this.showClose = true;
            })
            this.$nextTick(() => {
				this.request_detail({id: this.goods_id});
				this.$request({
					url: this.$api.advance.goods_list,
					data: {
						goods_id: this.goods_id,
					}
            	}).then(response => {
					if (response.code === 0) {
						this.list = response.data.list;
					} else if (response.code === 1) {
						uni.showModal({
							title: '提示',
							content: response.msg,
						});
					}
            	});
			})
	    },
	    onHide() {
            clearInterval(this.end_time);
	    },
        onUnload() {
            clearInterval(this.end_time);
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.hShareAppMessage();
        },
        // #endif
	    methods: {
          hShareAppMessage(s = false) {
                let { app_share_title, name, id, app_share_pic, subtitle, pic_url} = this.goods;
                return this.$shareAppMessage({
                    path: '/plugins/advance/detail/detail',
                    title: app_share_title ? app_share_title : name,
                    imageUrl: app_share_pic ? app_share_pic : pic_url[0].pic_url,
                    desc: subtitle,
                    params: { id }
                }, s);
            },
            getMall(e) {
                this.is_open = e.is_open;
            },
            request_detail(data) {
                this.$request({
                    url: this.$api.advance.detail,
                    data: {
                        id: data.id
                    },
                    method: 'get'
                }).then(res => {
                    if (res.code === 0) {
                        this.goods = res.data.detail;
                        if (this.goods.goods_activity) {
                            this.full_reduce = this.goods.goods_activity.full_reduce;
                        }
                        this.goods.num = 1;
                        this.loading = true;
                        this.url = `${this.$api.advance.poster}&goods_id=${this.goods.id}`;
                        this.getTime(this.goods.advanceGoods.end_prepayment_at);
                        this.set_attr_active();
                        // #ifdef H5
                        this.hShareAppMessage();
                        // #endif
                    } else if (res.code === 1) {
                        uni.hideLoading();
                        uni.showModal({
                            content: res.msg,
                            showCancel: false,
                            success() {
                                uni.navigateBack();
                            }
                        });
                    }
                });
            },
            open_share() {
                this.shareShow = true;
            },
            change_num(data) {
                this.num += data;
            },
            change_num_data(data) {
                this.num = data;
            },
            favorite(data) {
                this.goods.favorite = data;
            },
            select_attr({data, item}) {
                let attr_groups = this.goods.attr_groups;
                let str = ':';
                let sd = 0;
                for (let i = 0; i < attr_groups.length;i++) {
                    let attr_list = this.goods.attr_groups[i].attr_list;
                    for (let j = 0; j < attr_list.length; j++) {
                        if (attr_groups[i].attr_group_id === data && attr_list[j].attr_id === item) {
                            this.$set(this.goods.attr_groups[i].attr_list[j], 'active', true);
                        } else if (attr_groups[i].attr_group_id === data && attr_list[j].attr_id !== item){
                            this.$set(this.goods.attr_groups[i].attr_list[j], 'active', false);
                        }
                        if (this.goods.attr_groups[i].attr_list[j].active) {
                            sd = this.goods.attr_groups[i].attr_list[j].attr_id;
                            str += `:${sd}`;
                        }
                    }
                }
                let result = str.substr(2);
                this.get_price_stock(result);
            },
		    set_attr_active() {
                let item = 0;
                let str = ':';
                for (let i = 0; i < this.goods.attr_groups.length;i++) {
                    for (let j = 0; j < this.goods.attr_groups[i].attr_list.length; j++) {
                        if (j !== 0) {
                            this.$set(this.goods.attr_groups[i].attr_list[j], 'active', false);
                        } else if (j === 0) {
                            item = this.goods.attr_groups[i].attr_list[j].attr_id;
                            str += `:${item}`;
                            this.$set(this.goods.attr_groups[i].attr_list[j], 'active', true);
                        }
                    }
                }
                this.get_price_stock(str.substr(2));
            },
		    get_price_stock(data) {
                let attr = this.goods.attr;
                for (let i = 0; i < attr.length;i++) {
                    if (attr[i].sign_id === data) {
                        this.select_attr_group = attr[i].attr_list;
                        let { deposit, swell_deposit, stock, price, price_member, pic_url } = attr[i];
                        this.attr_deposit = deposit;
                        this.attr_swell_deposit = swell_deposit;
                        this.attr_stock = stock;
                        this.attr_price = price;
                        this.attr_price_member = price_member;
                        this.attr_pic_url = pic_url;
                    }
                }
                this.attr_stock == 0 ? this.buttonDisabled = true : this.buttonDisabled = false;
		    },
            close_attr(data) {
                if (!this.goods.buy_goods_auth) {
                    this.$tips.showToast({
                        title: '您暂无权限购买该商品',
                        icon: 'none'
                    });
                    return;
                }
                this.active = data;
            },
		    getTime(end_prepayment_at) {
                let time = new Date(end_prepayment_at.replace(/-/g, '/')).getTime() - (new Date()).getTime();
                this.d = parseInt((time/1000/60/60/24));
                this.h = parseInt((time/1000/60/60)%24);
                this.m = parseInt((time/1000/60)%60);
                this.s = parseInt((time/1000)%60);
                this.end_time = setInterval(() => {
                    let now = new Date().getTime();
                    let timelog = new Date(end_prepayment_at.replace(/-/g, '/')).getTime();
                    let time = timelog - now;
                    if (time > 0) {
                        let day = parseInt((time/1000/60/60/24));
                        let hou = parseInt((time/1000/60/60)%24);
                        let min = parseInt((time/1000/60)%60);
                        let sec = parseInt((time/1000)%60);
                        this.d = day;
                        this.h = hou;
                        this.m = min;
                        this.s = sec;
                    } else {
                        clearInterval(this.end_time);
                    }
                }, 1000);
		    },
			setCoupon(index) {
				this.$set(this.goods.goods_coupon_center[index], 'is_receive', 1);
			}
	    },
        components: {
            'app-goods-banner': appGoodsBanner,
	        'detail-ad': detailAd,
	        'detail-price-share': detailPriceShare,
	        'detail-bottom-button': detailBottomButton,
	        'detail-attr': detailAttr,
            'app-join-member': appJoinMember,
            'app-related-suggestion-product': appRelatedSuggestionProduct,
	        'detail-discount': detailDiscount,
	        'detail-vip': detailVip,
			'app-name': appName,
	        'app-vip-card': appVipCard,
            'app-quick-navigation': appQuickNavigation,
			appGoodsFullReduce,
            appClose,
            bdDetail,
            bdComments,
            bdKb,
            bdHc,
            bdCoupon,
            bdXbc,
			bdInfoExtra,
        },
	    computed: {
            ...mapGetters('mallConfig',{
	            vip: 'getVip',
				getTheme: 'getTheme'
			}),
		    ...mapGetters('user', {
                is_vip: 'is_vip'
		    }),
            ...mapState({
                mall: state => state.mallConfig.mall
            }),
	    },
		// #ifdef MP-WEIXIN
		onShareTimeline() {
			let { app_share_title, name, id } = this.goods;
			return this.$shareTimeline({
				title: app_share_title ? app_share_title : name,
				query: { id }
			});
		}
		// #endif
    }
</script>

<style scoped lang="scss">
    .goods-subtitle {
        padding: 0 #{20rpx};
        font-size: 24rpx;
        background-color: #ffffff;
        color: #999999;
        width: 702upx;
        margin: 0 24upx;
    }

	.join-member {
		background-color: #ffffff;
		padding: 0 #{24rpx};
	}
	.border-top {
		border-top: #{1rpx} solid #e2e2e2;
	}
	.zhe {
		height: #{80rpx};
		background-color: white;
		width: #{750rpx};
		padding: 0 #{24rpx};
		margin-top: #{20rpx};
		.symbol {
			width: #{116rpx};
			font-size: #{20rpx};
			color: #ff4544;
			border: #{1rpx} solid #ff4544;
			border-radius: #{4rpx};
			text-align: center;
		}
		.image {
			width: #{12rpx};
			height: #{22rpx};
		}
		.content {
			width: #{520rpx};
			font-size: #{21rpx};
			color: #666666;
			word-break: break-all;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
			margin-left: #{12rpx};
		}
	}
	.detail-vip {
		padding: 20upx;
        background-color: #ffffff;
        width: 702upx;
        margin: 0 24upx 0 24upx;
        border-radius: 0 0 15upx 15upx;
	}
    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1601;
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
    .bd-info-extra {
        padding: 0 #{20rpx};
        background-color: #ffffff;
        width: 702upx;
        margin: 0 24upx;
    }
</style>
