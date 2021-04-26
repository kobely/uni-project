<template>
    <view class="style-eight">
        <view class="head" v-if="list.length !== 0">
            <app-head-navigation :theme="theme" @click="active" :list="list"></app-head-navigation>
        </view>
        <view :class="list.length === 0 && goods_list.length !== 0 ? '' : 'product'" v-if="goods_list.length !== 0">
            <app-product-list :isShowAttr="false" :theme="theme" @routeGo="route_go" :goods_list="goods_list"></app-product-list>
            <view class="u-loading-list" v-if="goodsLoading">加载中...</view>
        </view>

        <template v-if="goods_list.length === 0 && list.length !== 0 && is_over_goods">
            <view class="no-empty main-center">
                <app-no-goods background="#f7f7f7" title="该分类下无相关内容哦~"></app-no-goods>
            </view>
        </template>

        <template v-if="list.length === 0 && goods_list.length === 0">
            <view class="no-empty main-center">
                <app-no-goods background="#f7f7f7" title="该分类下无相关内容哦~"></app-no-goods>
            </view>
        </template>

    </view>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
    import appHeadNavigation from '../../components/page-component/app-head-navigation/app-head-navigation.vue';
    import appProductList from '../../components/page-component/app-product-list/app-product-list.vue';
    import appNoGoods from '../../components/page-component/app-no-goods/app-no-goods.vue';

    export default {
        name: "style-eight",

        components: {
            'app-head-navigation': appHeadNavigation,
            'app-product-list': appProductList,
            'app-no-goods': appNoGoods
        },

        props: [`goods_list`, `list`, `theme`, `is_over_goods`, `goodsLoading`],

        computed: {
            ...mapGetters('mallConfig', {
                getVideo: 'getVideo',
                getTheme: 'getTheme'
            }),
            ...mapState({
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            })
        },

        methods: {
            route_go(e) {
                // #ifndef MP-BAIDU
                if (e.video_url && this.getVideo == 1) {
                    // #ifdef MP
                    uni.navigateTo({
                        url: `/pages/goods/video?goods_id=${e.id}&sign=${e.sign}`
                    });
                    // #endif
                    // #ifdef H5
                    uni.navigateTo({
                        url: e.page_url
                    });
                    // #endif
                } else {
                    uni.navigateTo({
                        url: e.page_url
                    });
                }
                // #endif

                // #ifdef MP-BAIDU
                uni.navigateTo({
                    url: e.page_url
                });
                // #endif
            },

            active(t) {
                this.$emit('active', t);
            }
        }
    }
</script>

<style scoped lang="scss">
    .style-eight {
        width: #{750upx};
    }
    .head {
        position: fixed;
        top: 88upx;
        left: 0;
        z-index: 1000;
    }
    .product {
        margin-top: #{188upx};
    }
    .no-empty {
        width: 100%;
        margin-top: #{250upx};
        background-color: #f7f7f7;
    }
    .u-loading-list {
        height: 64upx;
        line-height: 64upx;
        text-align: center;
        color: #b0b0b0;
        font-size: 24upx;
    }
</style>