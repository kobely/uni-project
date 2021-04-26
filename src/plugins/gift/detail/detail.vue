<template>
	<app-layout>
		<view class="page-width detail" v-if="loading">
			
			<template v-if="gift_status == 0">
				
				<!-- 未领取 -->
				<view class="page-width waiting-draw" v-if="detail.wait_list && detail.wait_list.list.length > 0 && detail.type === 'direct_open'">
					<order
						sign="未领取"
						v-bind:order_list="detail.wait_list.list"
						v-bind:theme="theme"
						v-bind:total_price="detail.wait_list.total_price"
					></order>
				</view>
				
				<!-- 待开奖 -->
				<view class="page-width waiting-draw" v-if="detail.wait_list && detail.wait_list.list.length > 0 && detail.type !== 'direct_open'">
					<order
						v-bind:order_list="detail.wait_list.list"
						v-bind:theme="theme"
						v-bind:total_price="detail.wait_list.total_price"
					></order>
				</view>
				
				<!-- 已领取 -->
				<view class="page-width order" v-if="detail.convert_list && detail.convert_list.list.length > 0">
					<order
						v-bind:order_list="detail.convert_list.list"
						v-bind:total_price="detail.convert_list.total_price"
						sign="已领取"
						v-bind:theme="theme"
					></order>
				</view>
				
				<!-- 已完成 -->
				<view class="page-width order" v-if="detail.success_list && detail.success_list.list.length > 0">
					<order
						v-bind:order_list="detail.success_list.list"
						v-bind:total_price="detail.success_list.total_price"
						sign="已完成"
						v-bind:theme="theme"
					></order>
				</view>
				
				<!-- 已退款 -->
				<view class="page-width order" v-if="detail.refund_list && detail.refund_list.list.length > 0">
					<order
						v-bind:total_price="detail.refund_list.total_price"
						v-bind:order_list="detail.refund_list.list"
						sign="已退款"
						v-bind:theme="theme"
					></order>
				</view>
			
				<!-- 订单信息 -->
				<view class="page-width order-information">
					<order-information
						v-bind:order_no="detail.order_no"
						v-bind:status="detail.status"
						v-bind:type="detail.type"
						v-bind:pay_time="detail.pay_time"
						v-bind:open_time="detail.open_time"
						v-bind:open_num="detail.open_num"
					></order-information>
				</view>
				
				<!-- 查看领取详情 -->
				<view class="page-width receiving-status">
					<receiving-status
						v-bind:type="detail.type"
						v-bind:theme="theme"
						v-bind:gift_id="detail.id"
						v-bind:status="gift_status"
						v-bind:user_id="detail.id"
					></receiving-status>
				</view>
				
			</template>
			
			<template v-else>
				
				<!-- 我获取的订单 -->
				<win-order
					@setSwitch="setSwitch"
					v-bind:order_list="detail.detail"
					v-bind:status_num="detail.status_num"
					v-bind:detail="detail"
				></win-order>
				
				<!-- 订单信息 -->
				<view class="page-width order-information">
					<win-order-information
						v-bind:order_no="detail.order_no"
						v-bind:status="detail.status"
						v-bind:type="detail.giftLog.type"
						v-bind:pay_time="detail.giftLog.sendOrder[0].pay_time"
						v-bind:open_time="detail.giftLog.open_time"
						v-bind:open_num="detail.giftLog.open_num"
					></win-order-information>
				</view>
				
				<!-- 物流信息 -->
				<view class="page-width logistics" v-if="detail.giftOrder[0].order.send_type == 1 || (detail.giftOrder[0].order.is_send == 1 && detail.giftOrder[0].order.detailExpress[0].express)">
					<logistics
							v-bind:send_type="detail.giftOrder[0].order.send_type"
							v-bind:store="detail.giftOrder[0].order.store"
							v-bind:is_send="detail.giftOrder[0].order.is_send"
							v-bind:express="detail.giftOrder[0].order.detailExpress[0].express"
							v-bind:express_no="detail.giftOrder[0].order.detailExpress[0].express_no"
							v-bind:customer_name="detail.giftOrder[0].order.detailExpress[0].customer_name"
							v-bind:cover_pic="detail.is_big_gift == 0 ? detail.giftLog.sendOrder[0].detail[0].goods.goodsWarehouse.cover_pic : '/plugins/gift/image/is_big_gift.png'"
					></logistics>
				</view>
				
				<!-- 查看领取详情 -->
				<view class="page-width receiving-status">
					<receiving-status
						@receipt="receipt"
						v-bind:type="detail.giftLog.type"
						v-bind:theme="theme"
						v-bind:gift_id="detail.gift_id"
						v-bind:status="gift_status"
						v-bind:status_num="detail.status_num"
						v-bind:user_id="detail.id"
						v-on:setShare="setShare"
						v-bind:order_id="detail.giftOrder[0].order_id"
						:notPayOrder="detail.notPayOrder"
						v-bind:detail="detail.detail"
					></receiving-status>
				</view>
				
			</template>
			
			<!-- 空白格 -->
			<view class="page-width empty">
				<app-empty-bottom
					backgroundColor="#f7f7f7"
					v-bind:height="Number(110)"
				></app-empty-bottom>
			</view>
			
			<!-- 分享海报 -->
			<view class="page-width share-poster">
				<app-share-qr-code-poster
					v-bind:isHidden="false"
					v-model="share"
				></app-share-qr-code-poster>
			</view>
			
		</view>
	</app-layout>
</template>

<script>
    import { mapState } from 'vuex';
	import order from '../components/detail/order.vue';
	import orderInformation from '../components/detail/order-information';
    import winOrderInformation from '../components/detail/win-order-information';
    import receivingStatus from '../components/detail/receiving-status.vue';
	import appEmptyBottom from'../../../components/basic-component/app-empty-bottom/app-empty-bottom.vue';
	import winOrder from '../components/detail/win-order.vue';
    import appShareQrCodePoster from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue'
	import logistics from '../components/detail/logistics.vue';
    
    export default {
        name: 'detail',

        data() {
            return {
                gift_id: -1,
                detail: {},
                gift_status: -1,
	            win_detail: {},
                share: false,
                turn_no: '',
	            loading: false,
            }
        },

        onLoad(options) { this.$commonLoad.onload(options);
            this.gift_id = options.gift_id;
            this.gift_status  = options.status;
            this.$store.dispatch('gift/getConfig', this.$api.gift.config);
        },

	    onShow() {
        	let { send_detail, win_detail, join_detail } = this.$api.gift;
            switch (this.gift_status) {
                case '0':
                    this.getDetail({
                        url: send_detail,
                        data: {
                            gift_id: this.gift_id,
                        }
                    });
                    break;
                case '1':
                    this.getDetail({
                        url: win_detail,
                        data: {
                            user_order_id: this.gift_id,
                        },
                    });
                    break;
                case '2':
                    this.getDetail({
                        url: join_detail,
                        data: {
                            user_order_id: this.gift_id,
                        },
                    });
                    break;
            }
	    },
        // #ifdef MP
        onShareAppMessage(e) {
            if (e.from === "button") {
                return this.$shareAppMessage({
                    path: '/plugins/gift/index/index',
                    imageUrl: this.detail.is_big_gift === 0 ? this.detail.detail[0].cover_pic :  this.big_gift_pic,
                    // #ifdef MP-ALIPAY
                    bgImgUrl:this.detail.is_big_gift === 0 ? this.detail.detail[0].cover_pic : this.big_gift_pic,
                    // #endif
                    title: this.detail.giftLog.bless_word,
                    params: {
                        gift_id: this.detail.gift_id,
                        turn_no: this.turn_no
                    }
                });
            }
        },
        // #endif
        methods: {
            async getDetail(data) {
                this.$utils.showLoading();
                try {
                    const res = await this.$request({
                        url: data.url,
                        method: 'get',
                        data: {
                            ...data.data,
                        }
                    });
                    this.$utils.hideLoading();
                    if (res.code === 0) {
                        this.detail = res.data.detail;
                        this.loading = true;
                    } else {
                        uni.showModal({
	                        title: '提示',
	                        content: res.msg
                        })
                    }
                } catch (e) {
                    this.$utils.hideLoading();
                    throw new Error(e);
                }
            },

            async setShare() {
	            this.$utils.showLoading();
                const res = await this.$request({
                    url: this.$api.gift.turn,
                    data: {
                        id: this.gift_id
                    }
                });
                if (res.code === 0) {
                    this.turn_no = res.data.turn_no;
                    this.share = true;
                } else {
                    uni.showModal({
                        title: '提示',
                        content: res.msg
                    })
                }
                this.$utils.hideLoading();
            },

            setSwitch(index) {
                this.detail.detail[index].switch = !this.detail.detail[index].switch;
            },

            receipt(order_id) {
                let _this = this;
                uni.showModal({
                    title: '提示',
                    content: '确认收货',
                    success: function(res) {
                        if (res.confirm) {
                            _this.$request({
                                url: _this.$api.order.confirm,
                                data: {
                                    id: order_id,
                                }
                            }).then(res => {
                                if (res.code === 0) {
                                    switch (_this.gift_status) {
                                        case '0':
                                            _this.getDetail({
                                                url: _this.$api.gift.send_detail,
                                                data: {
                                                    gift_id: _this.gift_id,
                                                }
                                            });
                                            break;
                                        case '1':
                                            _this.getDetail({
                                                url: _this.$api.gift.win_detail,
                                                data: {
                                                    user_order_id: _this.gift_id,
                                                },
                                            });
                                            break;
                                        case '2':
                                            _this.getDetail({
                                                url: _this.$api.gift.join_detail,
                                                data: {
                                                    user_order_id: _this.gift_id,
                                                },
                                            });
                                            break;
                                    }
                                }
                            })
                        }
                    }
                })
            }
        },

        computed: {
            ...mapState('gift',{
                theme: state => state.theme,
                big_gift_pic: state => state.big_gift_pic,
            })
        },

        components: {
            'order': order,
	        'order-information': orderInformation,
            'receiving-status': receivingStatus,
             'app-empty-bottom': appEmptyBottom,
	        'win-order': winOrder,
	        'win-order-information': winOrderInformation,
            'app-share-qr-code-poster': appShareQrCodePoster,
	        'logistics': logistics,
        },
    }
</script>

<style scoped lang="scss">
	@import '../css/gift';
	
	/* 礼物详情 */
	.detail {
		position: absolute;
		width: 100%;
		min-height: 100%;
		background-color: #f7f7f7;
	}
	
	/*领取状况*/
	.receiving-status {
		margin-top: #{40upx};
		/*position:*/
	}
	
	.logistics {
		padding: #{24upx};
	}
</style>