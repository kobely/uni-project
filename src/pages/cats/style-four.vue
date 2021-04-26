<template>
    <view class="style-four dir-left-nowrap">

        <app-category-list
                @click="active"
                :list="list"
                :noSetHeight="setHeight+'rpx'"
                v-if="list.length !== 0"
                :theme="theme"
        ></app-category-list>

        <scroll-view scroll-y
                     class="right"
                     :style="{height: `${setHeight}rpx`}"
                     v-if="list.length !== 0">
           <view>
               <app-jump-button :open_type="list[activeIndex].advert_open_type"
                                :params="list[activeIndex].advert_params"
                                :url="list[activeIndex].advert_url">
                   <image class="advert_pic"
                          :src="list[activeIndex].advert_pic"
                          v-if="list[activeIndex].advert_pic"></image>
               </app-jump-button>
           </view>
            <view class="item dir-top-nowrap main-left cross-center"
                  @click="route_go(it.page_url)"
                  v-for="(it, key) in list[activeIndex].child"
                  :key="key">
                <image :src="it.pic_url" class="pic_url"></image>
                <text class="name t-omit">{{it.name}}</text>
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
        name: "style-four",

        components: {
            'app-category-list': appCategoryList,
            'app-no-goods': appNoGoods,
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
            route_advert(data) {
                this.$emit('route_advert', data);
            }
        }
    }
</script>

<style scoped lang="scss">
    .right {
        width: #{546rpx};
        background-color: #ffffff;
    }
    .advert_pic {
        width: #{500rpx};
        height: #{184rpx};
        margin: #{20rpx} #{24rpx} #{20rpx} #{24rpx};
    }
    .item {
        width: #{182rpx};
        height: #{138rpx};
        display: inline-block;
        margin-bottom: #{40rpx};
        text-align: center;
    }
    .pic_url {
        height: #{104rpx};
        width: #{104rpx};
    }
    .name {
        font-size: #{26rpx};
        margin-top: #{8rpx};
        color: #353535;
        text-align: center;
    }
    .no-empty {
        width: 100%;
        margin-top: #{150upx};
    }
</style>