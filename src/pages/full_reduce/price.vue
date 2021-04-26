<template>
    <view class="price" :style="{'color': getTheme.color}">{{price}}</view>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "price",

        props: {
            price: String
        },

        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme'
            })
        }
    }
</script>

<style scoped lang="scss">
    .price {
        font-size: 22upx;
    }
</style>