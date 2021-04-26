<template>
    <view class="give" v-if="card">
        <view class="content" :style="contentStyle">
            <view class="avatar dir-left-nowrap main-center cross-center">
                <image :src="card.avatar"></image>
            </view>
            <view class="nickname">{{card.nickname}}</view>
            <view class="title">送你一张卡券</view>
            <template v-if="card.status == 2">
                <view class="pic dir-left-nowrap main-between cross-center">
                    <view class="card-title box-grow-0">
                        <image :src="card.pic_url"></image>
                    </view>
                    <view class="name t-omit-two box-grow-0">{{card.name}}</view>
                    <view class="box-grow-1"></view>
                </view>
                <view class="reset-time">剩余次数：{{card.reset_number}}次</view>
                <view class="time">有效期：{{card.start_time}} - {{card.end_time}}</view>
                <view class="card-btn-group dir-left-nowrap main-center">
                    <view class="card-btn btn-0 box-grow-0" @click="back">
                        <app-image :img-src="card.img_back" width="100%" height="100%"></app-image>
                    </view>
                    <view class="card-btn btn-0 box-grow-0" @click="shareShow = true">
                        <app-image :img-src="card.img_share" width="100%" height="100%"></app-image>
                    </view>
                </view>
                <view>
                    <app-share-qr-code v-model="shareShow" title="生成卡券海报"
                                       :poster-url="`/pages/poster/poster?card_id=` + card.id"
                                       :has-poster-nav="true"
                    ></app-share-qr-code>
                </view>
            </template>
            <view class="card-btn btn-1" v-else @click="receive">
                <app-image :img-src="card.img_receive" width="100%" height="100%"></app-image>
            </view>
            <view class="card-modal dir-top-nowrap cross-center main-center" v-if="modal.show">
                <view class="modal-content" :style="{backgroundImage: `url(`+card.img_finish_receiving+`)`}">
                    <view class="error">{{modal.msg}}</view>
                    <view class="modal-btn" @click="modal.show = false"></view>
                </view>
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
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import AppRelatedSuggestionProduct
        from '../../../components/page-component/app-related-suggestion-product/app-related-suggestion-product';
    import appShareQrCode
        from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
    import jump from '../../../core/jump.js';

    export default {
        name: "app-card-give",
        components: {
            AppRelatedSuggestionProduct, appShareQrCode
        },
        props: {
            card: {
                type: Object | null,
                default() {
                    return null;
                }
            }
        },
        data() {
            return {
                recommendGoodsList: null,
                shareShow: false,
                modal: {
                    show: false,
                    msg: ''
                },
            };
        },
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img,
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            contentStyle() {
                let style = '';
                if (this.card.status === 2) {
                    style = `background-image: url('${this.card.receive_card_bg}')`;
                } else {
                    style = `background-image: url('${this.card.card_bg}')`;
                }
                return style;
            }
        },
        created() {
            this.loadRecommendGoodsList();
        },
        methods: {
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
            back() {
                jump({
                    open_type: 'redirect',
                    url: '/pages/index/index'
                })
            },
            receive() {
                this.$showLoading();
                this.$request({
                    url: this.$api.card.receive,
                    method: 'get',
                    data: {
                        cardId: this.card.id
                    }
                }).then(response => {
                    this.$hideLoading();
                    if (response.code === 0) {
                        this.$emit('receive')
                    } else {
                        this.modal = {
                            show: true,
                            msg: response.msg
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .give {
        background-color: #ffffff;
    }

    .content {
        width: #{750rpx};
        height: #{880rpx};
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        padding-top: #{46rpx};
        text-align: center;
        background-color: #ffffff;
        line-height: 1;

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
        }

        .title {
            margin-top: #{40rpx};
            font-size: $uni-font-size-import-two;
        }

        .pic {
            margin: #{76rpx auto 0 auto};
            width: #{636rpx};
            height: #{200rpx};

            .card-title {
                margin-left: #{40rpx};
                border-radius: #{120rpx};
                overflow: hidden;
            }

            image {
                width: #{120rpx};
                height: #{120rpx};
                display: block;
            }

            .name {
                margin-left: #{21rpx};
                width: #{300rpx};
            }
        }

        .reset-time {
            height: #{52rpx};
            font-size: $uni-font-size-weak-two;
            line-height: #{50rpx};
            margin: #{40rpx auto 0 auto};
        }

        .time {
            margin-top: #{6rpx};
            font-size: $uni-font-size-weak-two;
        }

        .card-btn-group {
            margin-top: #{34rpx};
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
    }
</style>
