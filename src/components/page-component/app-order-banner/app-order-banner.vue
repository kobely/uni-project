<template>
    <view class="app-order-banner order-status-box" :style="{'background-image': `url(${newPicUrl})`, 'background-size': '100% 100%'}">
        <view class='text'>{{title}}</view>
        <view v-if="hint" class='hint'>{{hint}}</view>
    </view>
</template>
<script>
export default {
    name: 'app-order-banner',
    data() {
        return {
            newPicUrl: ''
        }
    },
    props: {
        title: {
            type: String,
            value: ''
        },
        picUrl: {
            type: String,
            value: ''
        },
        hint: {
            type: String,
            value: ''
        }
    },
    created() {
        this.newPicUrl = this.$store.state.mallConfig.__wxapp_img.mall.order.status_bar;
    }
}
</script>
<style scoped lang="scss">
    .order-status-box {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 120#{rpx};
    }
    .text {
        z-index: 1;
        margin-left: 80#{rpx};
        color: #fff;
        font-size: $uni-font-size-import-two;
    }

    .hint {
        z-index: 1;
        margin-top: 10#{rpx};
        margin-left: 80#{rpx};
        color: #fff;
        font-size: $uni-font-size-general-two;
    }
</style>