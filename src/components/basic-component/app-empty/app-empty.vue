<template>
    <view class="app-empty" :style="{height: height + 'rpx',backgroundColor: backgroundColor}"></view>
</template>

<script>
    export default {
        name: "app-empty",
        props: {
            height: {
                type: Number,
                default() {
                    return 10;
                }
            },
            backgroundColor: {
                type: String,
                default() {
                    return `#ffffff`;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-empty {
        width: 100%;
        display: block;
    }
</style>