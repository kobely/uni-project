<template>
    <view class="style-eleven dir-left-nowrap">
        <app-category-list
                @click="active"
                :list="list"
                v-if="list.length>0"
                :noSetHeight="setHeight+'rpx'"
                :theme="theme"
        ></app-category-list>
        <scroll-view scroll-y
                     v-if="list.length !== 0"
                     :class="goods_list.length > 0 && list.length === 0 ? 'goods-list-right' : 'right'"
                     @scrolltolower="lower"
                     :style="{height: `${setHeight}rpx`}"
        >
           <view>
               <app-jump-button :open_type="list[activeIndex].advert_open_type"
                                :params="list[activeIndex].advert_params"
                                :url="list[activeIndex].advert_url">
                   <image
                           class="advert_pic"
                           :src="list[activeIndex].advert_pic"
                           v-if="list[activeIndex].advert_pic"
                   ></image>
               </app-jump-button>
           </view>

            <second-class
                v-if="list.length !== 0 && list[activeIndex].child.length !== 0"
                @setNav="setNav"
                :theme="theme"
                :list="list[activeIndex].child"
                :activeIndexTwo="activeIndexTwo"
            ></second-class>

            <view class="cat-list" v-for="(it, key) in goods_list" :key="key">
                <view class="cat-title">{{it.name}}</view>
                <product-list
                    :theme="theme"
                    v-if="it.goods_list.length > 0"
                    :goods_list="it.goods_list"
                    @attr="attr"
                ></product-list>
            </view>

            <template v-if="goods_list.length === 0 && list.length !== 0 && is_over_goods">
                <app-no-goods title="该分类下无相关内容哦~" ></app-no-goods>
            </template>
        </scroll-view>
    </view>
</template>

<script>
    import appCategoryList from '../../components/page-component/app-category-list/app-category-list.vue';
    import productList from './product-list.vue';
    import goodsList from './goods-list.vue';
    import secondClass from './second-class.vue';
    import appNoGoods from '../../components/page-component/app-no-goods/app-no-goods.vue';

    export default {
        name: "style-eleven",
        components: {
            'app-category-list': appCategoryList,
            'product-list': productList,
            'app-no-goods': appNoGoods,
            'goods-list': goodsList,
            'second-class': secondClass
        },
        props: [`list`, `activeIndex`,  `setHeight`, `goods_list`, `activeIndexTwo`, `theme`, `is_over_goods`],
        methods: {
            active({item}) {
                this.$emit('requestCatList', {item, index: 0});
                this.$emit('active', item);
            },
            lower() {
                this.$emit('lower', this.list[this.activeIndex]);
            },
            setNav({it, key}) {
                this.$emit('setNav',{
                    item: it, index: key
                });
            },
            attr({previewUrl, submitUrl, attr_groups, goods}) {
                this.$emit('attr', {previewUrl, submitUrl, attr_groups, goods});
            },
            route_advert(data) {
                this.$emit('route_advert', data);
            }
        }
    }
</script>

<style scoped lang="scss">
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
        margin: #{20upx 24upx 20upx 0};
    }
    .item {
        padding: #{20upx 0};
    }
    .no-empty {
        width: 100%;
        margin-top: #{150upx};
    }
    .cat-title {
        font-size: #{26upx};
        line-height: 1;
        color: #999999;
        margin: #{32upx 0};
    }
</style>