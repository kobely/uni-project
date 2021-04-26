<template>
    <view class="style-six dir-left-nowrap">
        <app-category-list
            @click="active"
            :list="list"
            :noSetHeight="setHeight+'rpx'"
            :theme="theme"
        ></app-category-list>

        <scroll-view scroll-y class="right" :style="{height: `${setHeight}rpx`}">
            <view>
                <app-jump-button :open_type="list[activeIndex].advert_open_type"
                                 :params="list[activeIndex].advert_params"
                                 :url="list[activeIndex].advert_url">
                    <image class="advert_pic"
                           :src="list[activeIndex].advert_pic"
                           v-if="list[activeIndex].advert_pic"
                    ></image>
                </app-jump-button>
            </view>
            <view class="item" v-for="(item, key) in list[activeIndex].child" :key="key">
                <view class="more dir-left-nowrap main-between" @click="route_go(item.page_url)">
                    <text class="name t-omit">{{item.name}}</text>
                    <view class="icon dir-left-nowrap cross-center">
                        <text class="more-text">更多</text>
                        <view class="icon-pic"></view>
                    </view>
                </view>
                <view v-for="(a, i)  in item.child" :key="i" @click.stop="getChild(key,i)">
                    <image :src="a.big_pic_url" class="g-pic"></image>
                </view>
            </view>

            <view class="no-empty main-center" v-if="list[activeIndex].child.length === 0">
                <app-no-goods title="该分类下无相关内容哦~"></app-no-goods>
            </view>

        </scroll-view>
    </view>
</template>

<script>
    import appCategoryList from '../../components/page-component/app-category-list/app-category-list.vue';
    import appNoGoods from '../../components/page-component/app-no-goods/app-no-goods.vue';

    export default {

        name: "style-six",

        components: {
            'app-category-list': appCategoryList,
            'app-no-goods': appNoGoods
        },

        props: [`list`, `activeIndex`,  `setHeight`, `theme`],

        methods: {
            active({item}) {
                this.$emit('active', item);
            },

            route_go(data) {
                if (!data) return;
                uni.navigateTo({
                    url: data
                });
            },
            getChild(key, i) {
                uni.navigateTo({
                    url: this.list[this.activeIndex].child[key].child[i].page_url
                });
            },
            route_advert(data) {
                this.$emit('route_advert', data);
            }
        },

    }
</script>

<style scoped lang="scss">
    .advert_pic {
        width: #{500rpx};
        height: #{184rpx};
        margin: #{20rpx} #{24rpx} #{20rpx} 0;
    }
    .right {
        width: #{546rpx};
        background-color: white;
        padding-left: #{24upx};
    }
    .item {
        margin-left: #{2rpx};
        width: #{524rpx};
    }
    .more {
        position: relative;
        width: #{524rpx};
        margin: #{20rpx} 0 #{40rpx} 0;
    }
    .more-text {
        font-size: #{26rpx};
        color: #999999;
        margin-left: #{16rpx};
    }
    .icon-pic {
        width: #{13rpx};
        height: #{22rpx};
        background-image: url("../../static/image/icon/arrow-right.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        margin-left: #{24rpx};
    }
    .name {
        font-size: #{28rpx};
        color: #353535;
        width: 40%;
    }
    .icon {
        position: absolute;
        right: #{24rpx};
    }
    .g-pic {
        width: #{500rpx};
        height: #{158rpx};
        margin-bottom: #{20rpx};
    }
</style>