<template>
    <view class="style-five">

        <view class="head" v-if="list.length !== 0">
            <app-head-navigation @click="active" :list="list" :theme="theme"></app-head-navigation>
        </view>

        <view class="nav" v-if="list[activeIndex].child.length > 0">
            <text class="name" @click="setNav({it: it, key:k})"
                  :style="{'color': k === activeIndexTwo ? theme.color : ''}"
                  :class="k === activeIndexTwo ? 'active' : 'default'"
                  v-for="(it, k) in list[activeIndex].child" :key="k">
                {{it.name}}
            </text>
        </view>

        <view :class="list[activeIndex].child.length === 0 ? 'margin-fixed' : ''">
            <app-product-list :isShowAttr="false" :theme="theme" v-if="goods_list.length > 0" @routeGo="route_go" :goods_list="goods_list"></app-product-list>
            <view class="u-loading-list" v-if="goodsLoading">加载中...</view>
            <view class="no-empty main-center" v-else-if="goods_list.length === 0 && is_over_goods">
                <app-no-goods background="#f7f7f7" title="该分类下无相关内容哦~"></app-no-goods>
            </view>
        </view>

    </view>
</template>

<script>
    import appHeadNavigation from '../../components/page-component/app-head-navigation/app-head-navigation.vue';
    import appProductList from '../../components/page-component/app-product-list/app-product-list.vue';
    import appNoGoods from '../../components/page-component/app-no-goods/app-no-goods.vue';
    import {mapState} from "vuex";

    export default {
        name: "style-five",

        components: {
            'app-head-navigation': appHeadNavigation,
            'app-product-list': appProductList,
            'app-no-goods': appNoGoods
        },

        props: [`list`, `activeIndex`, `goods_list`, `activeIndexTwo`, `theme`, `is_over_goods`, `goodsLoading`],

        methods: {
            active(data) {
                this.$emit('active', data);
            },
            setNav({it, key}) {
                this.$emit('setNav', {
                    item: it,
                    index: key
                });
            },
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
            }
        },
        computed: {
            ...mapState({
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            }),
        }
    }
</script>

<style scoped lang="scss">
    .margin-fixed {
        margin-top: #{188upx};
    }
    .nav {
        width: 100%;
        padding-top: #{24rpx};
        padding-left: #{24rpx};
        background-color: #ffffff;
        margin-top: #{188upx};
    }
    .head {
        position: fixed;
        top: 88upx;
        left: 0;
        z-index: 1000;
    }
    .name {
        border: #{1rpx} solid #cccccc;
        font-size: #{28rpx};

        padding: 0 #{28rpx};
        display: inline-block;
        height: #{54rpx};
        line-height: #{54rpx};
        margin-right: #{24rpx};
        border-radius: #{28rpx};
        margin-bottom: #{20rpx};
    }

    .default {
        color: #666666;
    }
    .active {
        border: #{1rpx} solid ;
    }
    .u-loading-list {
        height: 64upx;
        line-height: 64upx;
        text-align: center;
        color: #b0b0b0;
        font-size: 24upx;
    }
</style>