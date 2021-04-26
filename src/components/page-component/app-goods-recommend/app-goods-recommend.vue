<template>
    <view class="app-goods-recommend" v-if="goodsList && goodsList.length > 0">
        <view class="recommend-title dir-left-nowrap main-center">
            <view class="dir-left-nowrap cross-center">
                <view class="border"></view>
                <view class="app-icon-love image-cover image-no-rep"></view>
                <view class="text">您或许喜欢</view>
                <view class="border"></view>
            </view>
        </view>
        <view class="recommend-list">
            <u-ordinary-list :is-under-line-price="isListUnderlinePrice == 1 ? true : false" :showBuyBtn="sureCart ? 1 : 0" :isShowAttr="sureCart" :list="goodsList" :theme="theme" :list-style="2"></u-ordinary-list>
        </view>
    </view>
</template>

<script>
    import uOrdinaryList from '../../page-component/u-goods-list/u-ordinary-list.vue';
    import {mapState} from "vuex";

    export default {
        name: "app-goods-recommend",
        components: {
            uOrdinaryList
        },
        props: {
            goodsList:  {
                type: Array,
                default() {
                    return [];
                }
            },
            theme: Object,
            sureCart: Boolean,
            activity: Object,
            is_show_member: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            sign: String,
            detail: Object
        },
        computed: {
            ...mapState({
                isListUnderlinePrice: state => state.mallConfig.mall.setting.is_list_underline_price
            }),
        },

    }
</script>

<style scoped lang="scss">
    .app-goods-recommend {
        .recommend-title {
            margin: #{40rpx} 0 #{32rpx} 0;
            font-size: $uni-font-size-weak-one;
            color: $uni-general-color-two;
            .text {
                color: #999;
            }
            .border {
                height: #{2rpx};
                background-color: #bbbbbb;
                width: #{40rpx};
                margin: 0 #{24rpx};
            }

            
            .app-icon-love {
                width: #{24rpx};
                height: #{24rpx};
                margin-right: #{12rpx};
                background-image: url('../../../static/image/icon/icon-favorite.png');
            }
        }
    }
</style>