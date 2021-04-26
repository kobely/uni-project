<template>
    <app-layout>
        <view @click="navigate">123</view>
        <view @click="copy">{{url}}</view>
    </app-layout>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                url: 'http://asdu83.natappfree.cc/zjhj_mall_v4/web/statics/html/index.html',
            }
        },
        methods: {
            navigate() {
                uni.navigateTo({url: `/pages/web/web?url=` + this.url});
            },
            copy() {
                this.$utils.uniCopy({
                    data: this.url,
                    success() {
                        //#ifndef MP-WEIXIN
                        uni.showToast({title: '复制成功'});
                        // #endif
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>