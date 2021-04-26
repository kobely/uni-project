<template>
    <view class="app-view">
        <view class="app-left">
            <app-radio type="round" @clickSelectionBox="clickSelectionBox"></app-radio>
            全选
        </view>
        <view class="app-right" @click="hidden = true">去结算</view>
        <view v-if="hidden" class="app-right-black"></view>
    </view>
</template>

<script>
    import appRadio from "../../basic-component/app-radio/app-radio.vue";

    export default {
        name: "app-settlement-bar",
        data() {
            return {
                hidden: false
            }
        },
        components: {
            "app-radio": appRadio,
        },
        methods: {
            clickSelectionBox(t) {
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-view {
        width: #{750rpx};
        height: #{100rpx};
        border-top: 1rpx solid $uni-weak-color-one;
        display: flex;
        position: relative;
        background-color: #ffffff;
    }
    .app-left {
        width: #{500rpx};
        height: #{100rpx};
        background-color: blue;
    }
    .app-right {
        height: #{100rpx};
        width: #{250rpx};
        line-height: #{100rpx};
        text-align: center;
        color: #ffe2e2;
        background-color: $uni-important-color-red;
    }
    .app-right-black {
        background-color: rgba(0,0,0,.8);
        position: absolute;
        right: 0;
        height: #{100rpx};
        width: #{250rpx};
        line-height: #{100rpx};
        text-align: center;
        color: #ffe2e2;
    }
</style>