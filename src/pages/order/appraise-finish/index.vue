<template>
    <app-layout>
        <view class='finish-box'>
            <view class='top-box dir-top-nowrap cross-center main-center'>
                <image class='img' src='/static/image/icon/order/icon-comment.png'></image>
                <text class='comment'>评价成功</text>
                <view class='dir-left-nowrap btn-box'>
                    <app-jump-button url="/pages/index/index" open_type="redirect">
                        <view class='btn text-1 main-center cross-center'>返回首页</view>
                    </app-jump-button>
                    <app-jump-button open_type="back">
                        <view :style="{'color': getTheme.color}" class="btn text-2 main-center cross-center">查看订单</view>
                    </app-jump-button>
                </view>
            </view>

            <block v-if="goodsList && goodsList.length">
                <view class="recommend">
                    <view class="recommend-title dir-left-nowrap main-center">
                        <view class="dir-left-nowrap cross-center">
                            <view class="border"></view>
                            <image src="/static/image/icon/icon-favorite.png"></image>
                            <view class="text">您或许喜欢</view>
                            <view class="border"></view>
                        </view>
                    </view>
                    <u-ordinary-list :is-under-line-price="isListUnderlinePrice == 1 ? true : false" :isShowAttr="true" :list="goodsList" :theme="getTheme" :list-style="2"></u-ordinary-list>
                </view>
            </block>
        </view>
    </app-layout>
</template>

<script>
    import { mapGetters, mapState } from "vuex";
    import uOrdinaryList from '../../../components/page-component/u-goods-list/u-ordinary-list.vue';

    export default {
        data() {
            return {
                goodsList: [],
                page: 1,
                load: false,
                args: false,
            }
        },
        components: {
            uOrdinaryList
        },
        methods: {
            getRecommend: function () {
                let self = this;
                self.$showLoading();
                self.$request({
                    url: self.$api.goods.new_recommend,
                    data: {
                        type: 'order_comment',
                    }
                }).then(response => {
                    self.$hideLoading();
                    if (response.code === 0) {
                        const goods_list = response.data.list;
                        if (goods_list && goods_list.length) {
                            self.goodsList = goods_list
                        }
                    }
                }).catch(() => {
                    self.hideLoading();
                });
            }
        },
        onLoad() { this.$commonLoad.onload();
            this.getRecommend();
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                isListUnderlinePrice: state => state.mallConfig.mall.setting.is_list_underline_price
            })
        },
    }
</script>

<style lang="scss" scoped>
    .finish-box {
        position: absolute;
        width: 100%;
        height: 100%;
        .top-box {
            background: #fff;

            .img {
                width: 230#{rpx};
                height: 180#{rpx};
                margin-top: 72#{rpx};
            }

            .comment {
                color: $uni-important-color-black;
                margin: 40#{rpx} 0 48#{rpx};
                font-weight: 800;
                font-size: $uni-font-size-import-two;
            }

            .btn-box {
                margin-bottom: 48#{rpx};
            }

            .btn {
                height: 72#{rpx};
                width: 200#{rpx};
                border-radius: 36#{rpx};
                font-size: 28#{rpx};
                border: #{2rpx} solid $uni-weak-color-one;
                margin: 0 34#{rpx};
            }

            .text-2 {
                border: 1#{rpx} solid ;
            }
        }
    }

    .finish-box .like-box {
        font-size: 24#{rpx};
        padding: 48#{rpx} 0 32#{rpx};
        color: $uni-general-color-two;
    }

    .finish-box .like-box .text {
        margin: 0 24#{rpx};
    }

    .finish-box .like-box view {
        color: $uni-general-color-two;
    }

    .recommend {
        margin-top: 24#{rpx};
        background-color: #F7F7F7;

        .recommend-title {
            margin: #{40rpx} 0 #{32rpx} 0;
            font-size: $uni-font-size-weak-one;
            color: $uni-general-color-two;
            padding-top: 20#{rpx};

            .border {
                border-top: #{2rpx} solid #bbbbbb;
                height: 0;
                width: #{40rpx};
                margin: 0 #{24rpx};
            }

            image {
                width: #{24rpx};
                height: #{24rpx};
                display: block;
                margin-right: #{12rpx};
            }
        }
    }

</style>