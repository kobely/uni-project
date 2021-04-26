<template>
    <view class="style-three dir-left-wrap padding">
       <view class="item" v-for="(it, k) in list" :key="k" @click="route_go(it)">
           <image class="pic_url" :src="it.pic_url"/>
           <text class="name t-omit">{{it.name}}</text>
       </view>

        <view class="no-empty main-center" v-if="list.length === 0">
            <app-no-goods background="#f7f7f7" title="该分类下无相关内容哦~"></app-no-goods>
        </view>
    </view>
</template>

<script>
    import goodsList from './goods-list.vue';
    import appNoGoods from '../../components/page-component/app-no-goods/app-no-goods.vue';

    export default {
        name: 'style-three',

        props: ['list'],

        components: {
            'goods-list': goodsList,
            'app-no-goods': appNoGoods
        },

        methods: {
            route_go(t) {
                uni.navigateTo({
                    url: t.page_url
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .style-three {
        width: #{750upx};
    }
    .padding {
        padding: 0 #{27rpx};
    }
    .item {
        width: #{120rpx};
        margin: #{64rpx} #{27rpx} 0 #{27rpx};
    }
    .pic_url {
        width: #{120rpx};
        height: #{120rpx};
        margin-bottom: #{20rpx};
    }
    .name {
        color: #353535;
        font-size: #{26rpx};
        width: 100%;
        text-align: center;
    }
    .no-empty {
        width: 100%;
        margin-top: #{150upx};
        background: #f7f7f7;
    }
</style>