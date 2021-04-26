<template>
	  <app-layout>
        <view class="order page-width">
	        
            <!-- 切换 -->
            <view class="page-width switch-tab">
                <switch-tab
                    v-bind:theme="theme"
                    v-on:setTab="setTab"
                ></switch-tab>
            </view>

            <!-- 我送出订单列表 -->
            <view class="page-width order-list" v-if="tab_status === 0">
                <order-list
                    v-bind:theme="theme"
                    v-bind:big_gift_pic="big_gift_pic"
                    v-bind:tab_status="tab_status"
                    v-bind:order_list="list"
                ></order-list>
            </view>
			
	        <!-- 我收到的 -->
	        <view class="page-width order-win-list" v-if="tab_status === 1">
		        <order-win-list
			        v-bind:theme="theme"
			        v-bind:tab_status="tab_status"
			        v-bind:order_list="list"
			        v-on:setShare="setShare"
			        v-on:receipt="receipt"
		        ></order-win-list>
	        </view>
	        
	        <!-- 我参与的 -->
	        <view class="page-width order-involved-list" v-if="tab_status === 2">
		        <order-involved-list
		            v-bind:order_list="list"
		            v-bind:big_gift_pic="big_gift_pic"
		            v-bind:tab_status="tab_status"
		            v-on:setShare="setShare"
		            v-on:receipt="receipt"
		        ></order-involved-list>
	        </view>
	        
            <!-- 空白格 -->
			<view class="page-width empty-nav">
				<app-empty-bottom
						backgroundColor="#f7f7f7"
						v-bind:height="Number(96)"
				></app-empty-bottom>
			</view>

            <!--  导航  -->
            <view class="page-width gift-navigation">
                <gift-navigation
                    v-bind:theme="theme"
                ></gift-navigation>
            </view>
	
	        
	        <!-- 分享海报 -->
	        <view class="page-width share-poster">
		        <app-share-qr-code-poster @share="hShareAppMessage" v-bind:isHidden="false" v-bind:url="shareUrl" v-model="share"></app-share-qr-code-poster>
	        </view>
	        
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from 'vuex';
    import giftNavigation from '../components/announcement/gift-navigation.vue';
    import switchTab from '../components/order/switch-tab.vue';
    import orderList from '../components/order/order-list.vue';
    import appEmptyBottom from'../../../components/basic-component/app-empty-bottom/app-empty-bottom.vue';
	import orderWinList from '../components/order/order-win-list.vue';
	import orderInvolvedList from '../components/order/order-involved-list.vue';
    import appShareQrCodePoster from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';

    export default {
        name: 'order',

        data() {
            return {
                tab_status: 0,
                list: [],
                page_count: 1,
                page: 1,
	            url: ``,
                share: false,
                shareUrl: ``,
	            gift_id: -1,
                turn_no: '',
                share_img: '',
                bless_word: ''
            }
        },

	    onLoad() { this.$commonLoad.onload();
            this.list = [];
            this.url = this.$api.gift.send_list;
            this.$nextTick(() => {
                this.request();
            });
	    },
        // #ifdef MP
        onShareAppMessage(e) {
            if (e.from === 'button') {
                return this.$shareAppMessage({
                    path: '/plugins/gift/index/index',
                    imageUrl: this.share_img,
	                // #ifdef MP-ALIPAY
                    bgImgUrl: this.share_img,
	                // #endif
                    title: this.bless_word,
                    params: {
                        gift_id: this.gift_id,
                        turn_no: this.turn_no,
                    }
                });
            } else {
                return this.$shareAppMessage({
                    path: '/plugins/gift/index/index',
                    title: this.bless_word,
	                imageUrl: this.big_gift_pic,
                });
            }
        },
        // #endif
        // 下拉加载
        onReachBottom() {
            if (this.page < this.page_count) {
                this.page++;
                this.request();
            }
        },

        methods: {
            hShareAppMessage(s = false) {
                return this.$shareAppMessage({
                    path: '/plugins/gift/index/index',
                    imageUrl: this.share_img,
                    // #ifdef MP-ALIPAY
                    bgImgUrl: this.share_img,
                    // #endif
                    title: this.bless_word,
                    params: {
                        gift_id: this.gift_id,
                        turn_no: this.turn_no,
                    }
                },s);
            },
            // 切换请求
            setTab(data) {
                this.tab_status = data;
                this.list = [];
                this.page = 1;
                switch(data) {
	                case 0:
	                    this.url = this.$api.gift.send_list;
	                    break;
	                case 1:
	                    this.url = this.$api.gift.my_win;
		                break;
	                case 2:
	                    this.url = this.$api.gift.my_join;
                }
                this.request();
            },
	        
	        async request() {
                this.$utils.showLoading();
                try {
                    const res = await this.$request({
                       url: this.url,
                       methods: 'get',
                       data: {
                           page: this.page,
                       }
                    });
                    if (res.code === 0) {
                        this.list.push( ...res.data.list);
                        this.page_count = res.data.pagination.page_count;
                    } else {
                        uni.showModal({
	                        title: '提示',
	                        content: res.msg,
                        })
                    }
                    this.$utils.hideLoading();
                } catch (e) {
                    this.$utils.hideLoading();
                    throw new Error(e);
                }
	        },
	        
	        async setShare(data) {
                this.$utils.showLoading();
                const res = await this.$request({
	                url: this.$api.gift.turn,
	                data: {
	                    id: data.id,
	                }
                });
                if (res.code === 0) {
                    this.turn_no = res.data.turn_no;
                    this.gift_id = data.gift_id;
                    this.bless_word = data.bless_word;
                    if (data.item.is_big_gift === 1) {
                        this.share_img = this.big_gift_pic;
                    } else {
                        this.share_img = data.item.detail[0].cover_pic;
                    }
                    this.share = true;
                } else {
                    uni.showModal({
	                    title: '提示',
	                    content: res.msg,
                    })
                }
                this.$utils.hideLoading();
	        },

            receipt(index) {
                let _this = this;
                uni.showModal({
                    title: '提示',
                    content: '确认收货',
                    success: function(res) {
                        if (res.confirm) {
                            _this.$request({
                                url: _this.$api.order.confirm,
                                data: {
                                    id: _this.list[index].giftOrder[0].order_id,
                                }
                            }).then(res => {
                                if (res.code === 0) {
                                    _this.list[index].status = '已完成';
                                    _this.list[index].status_num = 7;
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
            }),
        },

        components: {
            'gift-navigation': giftNavigation,
            'switch-tab': switchTab,
            'order-list': orderList,
            'app-empty-bottom': appEmptyBottom,
	        'order-win-list': orderWinList,
	        'order-involved-list': orderInvolvedList,
            'app-share-qr-code-poster': appShareQrCodePoster,
        },
    }
</script>

<style scoped lang="scss">
	@import '../css/gift.scss';

	/*订单页面*/
    .order {
        position: absolute;
        height: 100%;
	    top: 0;
	    left: 0;
        background-color: #f7f7f7;
    }

	/*状态开关*/
	.switch-tab {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1500;
	}
	
	/*订单列表*/
	.order-list {
		margin-top: #{115upx};
	}
	
	.order-win-list {
		margin-top: #{115upx};
	}
	
	.order-involved-list {
		margin-top: #{115upx};
	}
</style>