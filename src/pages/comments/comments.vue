<template>
    <app-layout>
        <view v-if="goodsId">
            <app-comments show-type="all" :goods-id="goodsId" :reach-bottom="onReachBottom"></app-comments>
        </view>
    </app-layout>
</template>

<script>
    import appComments from './app-comments.vue';

    export default {
        name: "comments",
        components: {
            'app-comments': appComments,
        },
        data() {
            return {
                goodsId: null,
                onReachBottom: 0
            };
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.goodsId = options.goods_id;
        },
        onReachBottom() {
            this.onReachBottom = Math.random();
        }
    }
</script>
