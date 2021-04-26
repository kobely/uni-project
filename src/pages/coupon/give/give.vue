<template>
    <app-layout>
        <view class="give" v-if="coupon">
            <view class="content" :style="contentStyle">
                <view class="avatar dir-left-nowrap main-center cross-center">
                    <image :src="coupon.avatar"></image>
                </view>
                <view class="nickname">{{coupon.nickname}}</view>
                <view class="title">送你一张优惠券</view>
                <template v-if="coupon.status == 1">
                    <view class="pic dir-left-nowrap cross-between main-center">
                        <view class="box-grow-0 coupon-left main-center cross-center">
                            <view class="discount" v-if="coupon.type == 1">{{coupon.discount}}</view>
                            <view class="sub t-omit" v-else>{{coupon.sub_price}}</view>
                        </view>
                        <view class="box-grow-0 coupon-right dir-top-nowrap main-center cross-center">
                            <view v-if="coupon.min_price > 0">满￥{{coupon.min_price}}可用</view>
                            <view v-else>无门槛使用</view>
                            <view class="margin-top">{{coupon.appoint_type_text}}</view>
                        </view>
                        <view class="box-grow-1"></view>
                    </view>
                    <template v-if="coupon.expire_type == 1">
                        <view class="time">有效期：领取后{{coupon.expire_day}}天有效</view>
                    </template>
                    <template v-else>
                        <view class="time">有效期：{{coupon.begin_time}} - {{coupon.end_time}}</view>
                    </template>
                    <view class="card-btn-group dir-left-nowrap main-center">
                        <view class="card-btn btn-0 box-grow-0" @click="shareShow = true">
                            <app-image :img-src="coupon.img_share" width="100%" height="100%"></app-image>
                        </view>
                        <view class="card-btn btn-0 box-grow-0" @click="toGoods">
                            <app-image :img-src="coupon.img_use" width="100%" height="100%"></app-image>
                        </view>
                    </view>
                    <view>
                        <app-share-qr-code v-model="shareShow" title="生成优惠券海报"
                                           :poster-url="`/pages/poster/poster?coupon_id=` + coupon.id"
                                           :has-poster-nav="true"
                        ></app-share-qr-code>
                    </view>
                </template>
                <view class="card-btn btn-1" v-else @click="receive">
                    <app-image :img-src="coupon.img_receive" width="100%" height="100%"></app-image>
                </view>
            </view>
            <view>
                <app-related-suggestion-product v-if="recommendGoodsList && recommendGoodsList.length"
                                                :list="recommendGoodsList"
                                                text="您或许会喜欢"
                                                :theme="getTheme"
                ></app-related-suggestion-product>
            </view>
        </view>
        <view class="card-modal dir-top-nowrap cross-center main-center" v-if="modal.show">
            <view class="modal-content" :style="{backgroundImage: `url(`+img_finish_receiving+`)`}">
                <view class="error">{{modal.msg}}</view>
                <view class="modal-btn" @click="btnClick"></view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import AppRelatedSuggestionProduct
        from '../../../components/page-component/app-related-suggestion-product/app-related-suggestion-product';
    import appShareQrCode from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
    import jump from '../../../core/jump.js';
    export default {
        name: "give",
        components: {
            AppRelatedSuggestionProduct,appShareQrCode
        },
        data() {
            return {
                recommendGoodsList: null,
                shareShow: false,
                modal: {
                    show: false,
                    msg: '',
                    is_show_back: false
                },
                coupon: null,
                user_id: 0,
                img_finish_receiving: null,
            };
        },
        computed: {
            ...mapState({
                couponImg: state => state.mallConfig.__wxapp_img.coupon,
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            contentStyle() {
                let style = '';
                if (!this.coupon) {
                    return '';
                }
                if (this.coupon.status === 1) {
                    style = `background-image: url(`+this.coupon.receive_coupon_bg+`)`;
                } else {
                    style = `background-image: url(`+this.coupon.coupon_bg+`)`;
                }
                return style;
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            if (typeof options.user_id !== 'undefined') {
                this.user_id = options.user_id;
            }
            this.getList(options.coupon_id);
            this.loadRecommendGoodsList();
        },
        methods: {
            getList(coupon_id) {
                this.$showLoading();
                this.$request({
                    url: this.$api.coupon.give,
                    data: {
                        coupon_id: coupon_id,
                        user_id: this.user_id
                    }
                }).then(response => {
                    this.$hideLoading();
                    this.img_finish_receiving = response.data.img_finish_receiving
                    if (response.code == 0) {
                        this.coupon = response.data;
                    } else {
                        this.modal = {
                            show: true,
                            msg: response.msg,
                            is_show_back: true,
                        }
                    }
                }).catch(response => {
                    this.$hideLoading();
                })
            },
            loadRecommendGoodsList() {
                this.$request({
                    url: this.$api.goods.new_recommend,
                    method: 'get',
                    data: {
                        type: 'order_pay',
                    },
                }).then(response => {
                    if (response.code === 0) {
                        this.recommendGoodsList = response.data.list;
                    }
                }).catch(e => {
                });
            },
            btnClick() {
                if (this.modal.is_show_back) {
                    jump({
                        open_type: 'redirect',
                        url: '/pages/index/index'
                    })
                } else {
                    this.modal.show = false;
                }
            },
            receive() {
                this.$showLoading();
                this.$request({
                    url: this.$api.coupon.receive,
                    method: 'get',
                    data: {
                        coupon_id: this.coupon.id
                    }
                }).then(response => {
                    this.$hideLoading();
                    if (response.code === 0) {
                        this.getList(this.coupon.id);
                    } else {
                        this.modal = {
                            show: true,
                            msg: response.msg,
                            is_show_back: false,
                        }
                    }
                })
            },
            toGoods() {
                uni.redirectTo({
                    url: this.coupon.page_url
                });
            },
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: this.coupon.app_share_title,
                imageUrl: this.coupon.app_share_pic ? this.coupon.app_share_pic : this.couponImg.img_coupon_2,
                path: '/pages/coupon/give/give',
                params: {
                    coupon_id: this.coupon.id
                }
            });
        }
        // #endif
    }
</script>

<style scoped lang="scss">
    .give {
        background-color: #ffffff;
    }

    .content {
        width: #{750rpx};
        height: #{880rpx};
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        padding-top: #{46rpx};
        text-align: center;

        .avatar {
            width: #{130rpx};
            height: #{130rpx};
            margin: #{0 auto 30rpx auto};
            border-radius: #{130rpx};
            overflow: hidden;

            image {
                width: 100%;
                height: 100%;
                display: block;
            }
        }

        .nickname {
            font-size: $uni-font-size-general-one;
            line-height: 1;
        }

        .title {
            margin-top: #{40rpx};
            font-size: $uni-line-height-general-two;
            line-height: 1;
        }

        .pic {
            margin: #{90rpx auto 0 auto};
            width: #{636rpx};
            height: #{200rpx};
            padding: #{0 16rpx 0 24rpx};

            .coupon-left {
                width: #{174rpx};
                height: 100%;
                color: #ffffff;
                font-size: #{56rpx};

                .discount {
                    &:after {
                        content: '折';
                        font-size: #{32rpx};
                    }
                }

                .sub {
                    &:before {
                        content: '￥';
                        font-size: #{32rpx};
                    }
                }
            }

            .coupon-right {
                width: #{300rpx};
                height: 100%;
                font-size: $uni-font-size-import-two;

                .margin-top {
                    margin-top: #{16rpx};
                    font-size: $uni-font-size-general-one;
                }
            }
        }

        .time {
            margin: #{45rpx 0};
            font-size: $uni-font-size-weak-one;
        }

        .card-btn {
            width: #{284rpx};
            height: #{76rpx};
            &.btn-1 {
                margin: #{410rpx auto 0 auto};
            }

            &.btn-0 {
                &:first-child {
                    margin-right: #{38rpx};
                }
            }
        }
    }

    .card-modal {
        background-color: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;

        .modal-content {
            width: #{600rpx};
            height: #{528rpx};
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;

            .error {
                margin: #{290rpx auto 0 auto};
                text-align: center;
                font-size: $uni-font-size-import-one;
            }

            .modal-btn {
                margin: #{62rpx auto 0 auto};
                width: #{520rpx};
                height: #{90rpx};
                border-radius: #{90rpx};
            }
        }
    }
</style>
