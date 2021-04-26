<template>
    <app-layout>
        <app-swiper :height="280" :list="banner_list" :autoplay="true" name="pic_url"></app-swiper>
        <view class="bargain-end">
            <view v-for="(v,k) in list" class="dir-left-nowrap" :key="k">
                <view class="bargain-left">
                    <image load-lazy :src="v.cover_pic"></image>
                    <view v-if="v.stock == 0" class="sold-out">
                        <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                    </view>
                </view>
                <view @click="goods(v)" class="bargain-right">
                    <view class="dir-top-nowrap list">
                        <view class="bargain-name box-grow-0">{{v.name}}</view>
                        <view class="dir-left-nowrap num box-grow-1 cross-center">
                            <view class="dir-left-nowrap user box-grow-0">
                                <block v-for="(v1,k1) in v.user_list" :key="k1" v-if="k1 < 3">
                                    <image class="avatar" :src="v1.avatar" load-lazy></image>
                                </block>
                            </view>
                            <view class="box-grow-1">{{v.sales}}人已参与</view>
                        </view>
                        <view class="dir-left-nowrap cross-bottom box-grow-0 min-price">
                            <view class="box-grow-1 dir-top-nowrap">
                                <view class="bargain-original">￥{{v.price}}</view>
                                <view class="bargain-price-title" :style="{'color': getTheme.color}">最低￥
                                    <text class="bargain-price">{{v.min_price}}</text>
                                </view>
                            </view>
                            <view v-if="v.status == 0 || v.stock == 0">
                                <app-button width="180" font-size="28" background="#cdcdcd" height="64" color="#FFFFFF"
                                            round
                                            disabled>下次再来
                                </app-button>
                            </view>
                            <view v-else class="box-grow-0">
                                <view class="red-btn" :style="{'color': getTheme.color, 'border-color': getTheme.border}">立即参与</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <app-load-text v-if="load"></app-load-text>
        </view>

        <view>
	        <common-buttom :theme="getTheme" status="index"></common-buttom>
        </view>
    </app-layout>
</template>

<script>
    import appSwiper from "../../../components/page-component/app-swiper/app-swiper.vue";
    import commonButtom from "../common-buttom.vue";
    import appIphoneX from '../../../components/basic-component/app-iphone-x/app-iphone-x.vue';
    import appEmptyBottom from '../../../components/basic-component/app-empty-bottom/app-empty-bottom.vue';
    import { mapState, mapGetters } from 'vuex';

    export default {
        name: "index",
        components: {appSwiper, commonButtom, appEmptyBottom, appIphoneX},
        computed: {
            ...mapGetters('mallConfig',{
                getVideo: 'getVideo',
                getTheme: 'getTheme',
            }),
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img.mall,
                appSetting: state => state.mallConfig.mall.setting,
            })
        },
        data() {
            return {
                list: [],
                args: false,
                page: 1,
                load: false,
                banner_list: null,
                title: '砍价',
            }
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: this.title,
                path: '/plugins/bargain/index/index',
                params: {}
            });
        },
        // #endif
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            // 分享朋友圈beta
            return this.$shareTimeline({
                title: this.title
            });
        },
        // #endif
        onLoad() { this.$commonLoad.onload();
            const self = this;
            self.$request({
                url: self.$api.bargain.banner,
            }).then(info => {
                if (info.code === 0) {
                    self.banner_list = info.data.list;
                }
            })
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
        },

        onShow: function () {
            const self = this;
            self.$showLoading();
            self.$request({
                url: self.$api.bargain.goods_list,
            }).then(info => {
                self.$hideLoading();
                if (info.code === 0) {
                    self.list = info.data.list;
                }
                self.args = false;
                self.page = 1;
            }).catch(e => {
                self.$hideLoading();
            })
        },

        onReachBottom: function () {
            const self = this;
            if (self.args || self.load)
                return;
            self.load = true;
            let page = self.page + 1;

            self.$request({
                url: self.$api.bargain.goods_list,
                data: {
                    page: page,
                }
            }).then(info => {
                if (info.code === 0) {
                    [self.page, self.args, self.list] = [page, info.data.list.length === 0, self.list.concat(info.data.list)];
                }
                self.load = false;
            });
        },
        methods: {
            goods(data) {
                uni.navigateTo({
                    url: '/plugins/bargain/goods/goods?goods_id=' + data.goods_id,
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .list {
        height: #{220rpx};
    }

    .bargain-end {
        margin-top: #{16rpx}
    }

    .bargain-end > view {
        padding: #{24rpx};
        background: #ffffff;
        border-bottom: #{1rpx solid #e2e2e2};
    }
    .bargain-end >view:last-child {
        border-bottom: none;
    }
    .bargain-left {
        position: relative;

        image {
            width: #{220rpx};
            height: #{220rpx};
            display: block;
        }

        .sold-out {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: #{220rpx};
            height: #{220rpx};
            background-color: rgba(0,0,0,.5);
        }
    }

    .bargain-right {
        margin-left: #{24rpx};
        width: 100%;

        .bargain-name {
            font-size: #{32rpx};
            color: #353535;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            line-height: 1.5;
            overflow: hidden;
        }

        .num {
        }

        .num > view {
            color: #999999;
            font-size: #{24rpx};
            margin-right: #{16rpx};
        }

        .avatar {
            margin-left: -8rpx;
            border: 1px solid #ffffff;
            height: #{34rpx};
            width: #{34rpx};
            border-radius: 50%;
        }

        .user {
            margin-right: #{16rpx};
        }

        .bargain-original {
            font-size: #{24rpx};
            color: #999999;
            text-decoration: line-through;
        }

        .min-price {
            margin-bottom: #{8rpx};
        }

        .bargain-price-title {
            line-height: 1;
            font-size: #{28rpx};
        }

        .bargain-price {
            margin-top: #{16rpx};
            font-size: #{48rpx};
        }
    }

    .red-btn {
        font-size: #{28rpx};
        line-height: #{64rpx};
        text-align: center;
        height: #{64rpx};
        border-radius: #{33rpx};
        border: #{1rpx} solid;
        width: #{176rpx};
    }
</style>
