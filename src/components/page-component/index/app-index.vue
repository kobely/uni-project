<template>
    <view class="app-index">
        <!-- #ifdef MP-WEIXIN-->
        <template v-if="mall.setting.is_official_account == 1">
            <official-account></official-account>
        </template>
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <template v-if="isShowAttention && mall.setting.is_official_account == 1">
            <view class="bd-attention">
                <view class="bd-content">
                    <view class="dir-left-nowrap main-between cross-center">
                        <view class="dir-left-nowrap cross-center">
                            <image class="bd-logo" :src="userInfo && userInfo.wechat_logo"></image>
                            <view class="bd-name">{{userInfo && userInfo.wechat_name}}</view>
                        </view>
                        <view class="bd-btn" @click="openAttention">去关注</view>
                    </view>
                </view>
            </view>
        </template>
        <!-- #endif -->
        <block v-for="(item, index) in newPage" :key="index">
            <template v-if="item.key === 'search'">
                <view class="page-width">
                    <app-search-for></app-search-for>
                </view>
            </template>
	        
            <template v-else-if="item.key === 'banner'">
                <view v-if="item.banners.length > 0">
                    <app-swiper
                        :list="item.banners"
                        name="pic_url"
                        :height="350"
                        :autoplay="true"
                    >
                    </app-swiper>
                </view>
            </template>
	
            <view class="mt-20" v-else-if="item.key === 'cat'">
                <app-index-cat
                    :theme="theme"
                    :page_id="page_id"
                    :index="index"
                    :is_required="is_required"
                    @buyProduct="buyProduct"
                ></app-index-cat>
            </view>

            <template v-else-if="item.key === 'home_nav'">
                <app-navigation-icon
                    :navs="item.home_navs"
                    :columns="Number(item.row_num)"
                    :rows="-1"
                ></app-navigation-icon>
            </template>
	        
            <template v-else-if="item.key === 'notice'">
                <u-announcement
                    :name="item.notice_name"
                    :content="item.notice_content"
                    :icon="item.notice_url"
                    :bgColor="item.notice_bg_color"
                    :text-color="item.notice_text_color"
                ></u-announcement>
            </template>
	        
            <template v-else-if="item.key === 'video'">
                <view class="mt-20">
                    <app-video
                        :pic-url="item.video_pic_url"
                        :url="item.video_url"
                    ></app-video>
                </view>
            </template>
	        
            <template v-else-if="item.key === 'topic'">
                <view class="mt-20">
                    <app-topic
                        :topic_list="item.topics"
                        :count="Number(item.topic_num)"
                        :icon="item.label_url"
                        :logo_2="item.topic_url_2"
                        :logo_1="item.topic_url"
                    ></app-topic>
                </view>
            </template>
	        
            <template v-else-if="item.key === 'coupon'">
                <view class="mt-20">
                    <app-exclusive-coupon
                        v-bind:coupon_list="item.coupons"
                        v-bind:receive-bg="item.coupon_url"
                        v-bind:unclaimed-bg="item.coupon_not_url"
                        @click="changeCoupon"
                        v-bind:page_id="page_id" :index="index"
                        v-bind:is_storage="is_storage"
                        v-bind:is_required="is_required"
                        v-bind:coupon_req="coupon_req"
                    ></app-exclusive-coupon>
                </view>
            </template>
	
	        <template v-else-if="item.key === 'block'">
                <app-image-ad :image-style="item.block.status" :list="item.block.value"
                                    :height="item.block.height"></app-image-ad>
	        </template>
	
	        <template v-else-if="item.key === 'miaosha'">
		        <view class="miaosha mt-20">
			        <u-miaosha :appImg="appImg" :appSetting="appSetting"  @router="router" :is_storage="is_storage"   :is_required="is_required" :page_id="page_id" :index="index" :page-hide="pageHide"  :theme="theme"></u-miaosha>
		        </view>
	        </template>

            <template v-else-if="item.key === 'flash_sale'">
                <view class="u-flash-sale mt-20">
                    <u-flash-sale :appImg="appImg" :appSetting="appSetting"  @router="router" :is_storage="is_storage"  :is_required="is_required" :page_id="page_id" :index="index"   :theme="theme"></u-flash-sale>
                </view>
            </template>

	        <template v-else-if="item.key === 'fxhb'">
		        <view>
			        <app-popup-ad :opened="true" :is_storage="is_storage"  :is_required="is_required" :list="item.fxhb"></app-popup-ad>
		        </view>
	        </template>
	        
            <template v-else-if="item.key === 'pintuan'">
                <view class="pintuan mt-20">
                    <u-pintuan :appImg="appImg" :appSetting="appSetting"  @router="router" :is_required="is_required" :index="index" :page_id="page_id" :theme="theme" ></u-pintuan>
                </view>
            </template>
	        
            <template v-else-if="item.key === 'booking'">
                <view class="booking mt-20">
                    <u-booking :appImg="appImg" :appSetting="appSetting"  @router="router" :is_required="is_required" :index="index" :theme="theme" :page_id="page_id" ></u-booking>
                </view>
            </template>
	        
            <template v-else-if="item.key === 'mch'">
                <view class="mch mt-20">
                    <bd-g-s-r :is_required="is_required" :index="index" :theme="theme" :page_id="page_id" :list="item.mch"></bd-g-s-r>
                </view>
            </template>
	
	        <template v-else-if="item.key === 'advance'">
		        <view class="advance mt-20">
			        <u-advance :appImg="appImg" :appSetting="appSetting"  @router="router" :is_required="is_required" :index="index" :theme="theme" :page_id="page_id"></u-advance>
		        </view>
	        </template>

            <template v-else-if="item.key === 'pick'">
                <view class="pick mt-20">
                    <u-pick :appImg="appImg" :appSetting="appSetting"
                            @router="router" :is_required="is_required"
                            :index="index"  :theme="theme"
                            :page_id="page_id"></u-pick>
                </view>
            </template>
	        
            <template v-else-if="item.key === 'wholesale'">
                <view class="booking mt-20">
                    <app-index-wholesale :is_required="is_required" :index="index" :theme="theme" :page_id="page_id" ></app-index-wholesale>
                </view>
            </template>
        </block>

        <view class="page-width">
            <app-quick-navigation></app-quick-navigation>
        </view>

    </view>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
    import appSearchFor from '../../page-component/app-search-for/app-search-for.vue';
    import appSwiper from '../../page-component/app-swiper/app-swiper.vue';
    import appNavigationIcon from '../../page-component/app-navigation-icon/app-navigation-icon.vue';
    import uAnnouncement from '../../page-component/u-announcement/u-announcement.vue';
    import appVideo from '../../page-component/app-video/app-video.vue';
    import appTopic from '../../page-component/app-special-topic/app-special-topic-normal.vue';
    import appExclusiveCoupon from '../../page-component/app-exclusive-coupon/app-exclusive-coupon.vue';
    import appImageAd from '../../page-component/app-image-ad/app-image-ad.vue';
    import appReservation from '../../page-component/app-reservation/app-reservation.vue';
    import bdGSR from "../../page-component/app-good-shop-recommendation/app-good-shop-recommendation.vue";
    import appTimer from "../../basic-component/app-timer/app-timer.vue";
    import appQuickNavigation from "../../page-component/app-quick-navigation/app-quick-navigation.vue";
    import appPopupAd from "../../page-component/app-popup-ad/app-popup-ad.vue";
    import appIndexWholesale from "../../page-component/app-index-wholesale/app-index-wholesale.vue";
    import uMiaosha from "../../page-component/u-index-plugins/u-miaosha.vue";
    import uPintuan from "../../page-component/u-index-plugins/u-pintuan.vue";
    import uBooking from "../../page-component/u-index-plugins/u-booking.vue";
    import appIndexCat from "../../page-component/app-index-cat/app-index-cat.vue";
    import uAdvance from '../../page-component/u-index-plugins/u-advance.vue';
    import uPick from '../../page-component/u-index-plugins/u-pick.vue';
    import uFlashSale from '../../page-component/u-index-plugins/u-flash-sale.vue';
    export default {
        name: 'app-index',
	    data() {
            return {
                newPage: [],
                time: -1,
                tempList: [],
                timeout: 0,
                flash_salse: false
            }
	    },
        props: {
            homePages: {
                type: Array,
                default() {
                    return [];
                }
            },
            is_storage: Boolean,
            pageHide: Boolean,
            theme: Object,
            page_id: Number,
            is_required: Boolean,
            coupon_req: Boolean,
            isShowAttention: Boolean
        },
        computed: {
            ...mapState('mallConfig', {
                mall: state => state.mall,
                appImg: state => state.__wxapp_img.mall,
                appSetting: state => state.mall.setting
            }),
            ...mapGetters({
                userInfo: 'user/info'
            }),
            ...mapState({
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            }),
        },
        watch: {
            homePages: {
                handler: function(data) {
					uni.setNavigationBarTitle({
						title: this.mall.name
					});
                    this.tempList = [];
                    clearTimeout(this.timeout);
                    this.newPage = [];
                    this.tempList = this.cloneData(data);
                    this.splitData();
                },
	            immediate: true,
            },
	    },
	    methods: {
            changeCoupon(data, index) {
                this.newPage[index].coupons[data].is_receive = '1';
            },
            buyProduct(data) {
                this.$emit('buyProduct', data);
            },
            splitData() {
                if (!this.tempList.length) return;
                let item = this.tempList[0];
                this.newPage.push(item);
                this.tempList.splice(0, 1);
                if (this.tempList.length) {
                    this.timeout = setTimeout(() => {
                        this.splitData();
                    }, 100);
                }
            },
            // 复制而不是引用对象和数组
            cloneData(data) {
                return JSON.parse(JSON.stringify(data));
            },
            router(goods) {
                // #ifndef MP-BAIDU
                if (goods.video_url && this.getVideo == 1) {
                    // #ifdef MP
                    uni.navigateTo({
                        url: `/pages/goods/video?goods_id=${goods.id}&sign=${goods.sign}`
                    });
                    // #endif
                    // #ifdef H5
                    uni.navigateTo({
                        url: goods.page_url
                    })
                    // #endif
                } else {
                    uni.navigateTo({
                        url: goods.page_url
                    })
                }
                // #endif

                // #ifdef MP-BAIDU
                uni.navigateTo({
                    url: goods.page_url
                })
                // #endif
            },
            // #ifdef H5
            openAttention() {
                this.$store.dispatch('user/showAttentionTwo', true);
                this.$store.dispatch('user/showAttention', true);
            },
            // #endif
	    },
        components: {
            'app-search-for': appSearchFor,
            'app-swiper': appSwiper,
            'app-navigation-icon': appNavigationIcon,
            uAnnouncement,
            'app-video': appVideo,
            'app-topic': appTopic,
            'app-exclusive-coupon': appExclusiveCoupon,
            'app-image-ad': appImageAd,
            'app-reservation': appReservation,
            'bd-g-s-r': bdGSR,
            'app-timer': appTimer,
            'app-quick-navigation': appQuickNavigation,
            'app-popup-ad': appPopupAd,
            'app-index-cat': appIndexCat,
            'app-index-wholesale': appIndexWholesale,
            uAdvance,
            uMiaosha,
            uPintuan,
            uBooking,
            uFlashSale,
            uPick
        },
    }
</script>

<style scoped lang="scss">
    .mch {
        background-color: #ffffff;
    }

    .mt-20 {
        margin-top: #{20rpx};
    }
    /* #ifdef H5 */
    .bd-attention {
        width: 100%;
        background-color: #ffffff;
        padding: 5upx 10upx 24upx 10upx;
        .bd-content {
            padding: 0 10upx 0 6upx;
            margin-top: 15upx;
        }
        .bd-logo {
            width:70upx;
            height: 70upx;
            margin-right: 15upx;
        }
        .bd-name {
            font-size: 28upx;
            color: #353535;
        }
        .bd-btn {
            width:110upx;
            height: 50upx;
            line-height: 50upx;
            font-size: 22upx;
            border: 1upx solid #009400;
            color: #009400;
            border-radius: 5upx;
            text-align: center;
            transform: rotateZ(360deg);
        }
    }
    /* #endif */

</style>
