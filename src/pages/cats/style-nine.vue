<template>
    <view class="style-nine dir-left-nowrap">

        <app-category-list
                @click="active"
                :list="list"
                v-if="list.length > 0"
                :noSetHeight="setHeight+'rpx'"
                :theme="theme"
        ></app-category-list>

        <scroll-view scroll-y
                     v-if="list.length > 0"
                     :class="goods_list.length > 0 && list.length === 0 ? 'goods-list-right' : 'right'"
                     @scrolltolower="lower"
                     :style="{height: `${setHeight}rpx`}"
        >
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
            <product-list :theme="theme" v-if="goods_list.length > 0 && list.length > 0" @attr="attr" :goods_list="goods_list"></product-list>

            <template v-if="goods_list.length === 0 && is_over_goods">
                <app-no-goods title="该分类下无相关内容哦~"></app-no-goods>
            </template>
        </scroll-view>

        <goods-list
            @attr="attr"
            :theme="theme"
            v-if="goods_list.length > 0 && list.length === 0"
            :goods_list="goods_list"
        ></goods-list>

        <view class="no-empty main-center" v-if="list.length === 0 && goods_list.length === 0">
            <app-no-goods title="该分类下无相关内容哦~" ></app-no-goods>
        </view>
    </view>
</template>

<script>
    import appCategoryList from '../../components/page-component/app-category-list/app-category-list.vue';
    import productList from './product-list.vue';
    import goodsList from './goods-list.vue';
    import appNoGoods from '../../components/page-component/app-no-goods/app-no-goods.vue';

    export default {
        name: "style-nine",

        components: {
            'app-category-list': appCategoryList,
            'product-list': productList,
            'app-no-goods': appNoGoods,
            'goods-list': goodsList
        },

        props: [`list`, `activeIndex`,  `setHeight`, `goods_list`, `theme`, `is_over_goods`],


        methods: {
           active({item}) {
               this.$emit('requestGoods', {item});
               this.$emit('active', item);
               this.$emit('page');
           },

            lower() {
                this.$emit('lower', this.list[this.activeIndex]);
            },

             attr({previewUrl, submitUrl, attr_groups, goods}) {
                this.$emit('attr', {previewUrl, submitUrl, attr_groups, goods});
            },

            route_advert(data) {
                this.$emit('route_advert', data);
            }
        },

    }
</script>

<style scoped lang="scss">
    .style-nine {
        background-color: white;
    }
    .right {
        width: #{546upx};
        background-color: white;
        padding-left: #{24upx};
    }
    .goods-list-right {
        width: #{750upx};
        background-color: white;
    }
    .advert_pic {
        width: #{500rpx};
        height: #{184rpx};
        margin: #{20rpx} #{24rpx} #{20rpx} 0;
    }
    .item {
        padding: #{20upx 0};
    }
    .no-empty {
        width: 100%;
        margin-top: #{150upx};
    }
</style>