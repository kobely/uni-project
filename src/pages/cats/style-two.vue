<template>
    <view class="style-two dir-left-nowrap">

        <app-category-list
            @click="active"
            :list="list"
            v-if="list.length !== 0"
            :noSetHeight="setHeight+'rpx'"
            :theme="theme"
        ></app-category-list>

        <scroll-view scroll-y
                     class="right"
                     :style="{height: `${setHeight}rpx`}"
                     v-if="list.length > 0">
            <view>
                <app-jump-button :open_type="list[activeIndex].advert_open_type"
                                 :params="list[activeIndex].advert_params"
                                 :url="list[activeIndex].advert_url">
                    <image class="advert_pic"
                           @click="advert(list[activeIndex])"
                           :src="list[activeIndex].advert_pic"
                           v-if="list[activeIndex].advert_pic"></image>
                </app-jump-button>
            </view>
            <view class="item"
                  v-for="(it, k) in list[activeIndex].child"
                  :key="k"
                  @click="route_go(it.page_url)">
                <image :src="it.big_pic_url"
                       class="big_pic_url"></image>
            </view>
            <view class="no-empty main-center"
                  v-if="list[activeIndex].child.length === 0">
                <app-no-goods title="该分类下无相关内容哦~"></app-no-goods>
            </view>
        </scroll-view>

        <view class="no-empty main-center" v-else>
            <app-no-goods background="#f7f7f7" title="该分类下无相关内容哦~"></app-no-goods>
        </view>

    </view>
</template>

<script>
    import appCategoryList from '../../components/page-component/app-category-list/app-category-list.vue';
    import appNoGoods from '../../components/page-component/app-no-goods/app-no-goods.vue';

    export default {
        name: 'style-two',

        props: [`list`, `activeIndex`,  `setHeight`, `theme`],

        components: {
            'app-category-list': appCategoryList,
            'app-no-goods': appNoGoods
        },

        methods: {
            active({item}) {
                this.$emit('active', item);
            },
            route_go(e) {
                uni.navigateTo({
                    url: e
                })
            },
            advert(e) {
                this.$emit('route_advert', e);
            }
        }
    }
</script>

<style scoped lang="scss">
    .right {
        width: #{524rpx};
        margin-left: #{22rpx};
        background-color: #ffffff;
    }
    .advert_pic {
        width: #{500rpx};
        height: #{184rpx};
        margin: #{20upx 24upx 20upx 0};
    }
    .item {
        margin-left: #{2rpx};
        height: #{158rpx};
        width: #{524rpx};
        margin-bottom: #{20rpx};
    }
    .big_pic_url {
        height: #{158rpx};
        width: #{524rpx};
    }
    .no-empty {
        width: 100%;
        margin-top: #{150upx};
    }
</style>