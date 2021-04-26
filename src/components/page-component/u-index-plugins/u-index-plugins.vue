<template>
    <view class="u-plugins">
        <view class="u-top main-between cross-center" hover-class="u-hover-class" @click="router">
            <slot name="u-top-name"></slot>
            <view class="dir-left-nowrap cross-center">
                <view class="box-grow-0 u-more">更多</view>
                <image class="box-grow-0 u-icon" src="/static/image/icon/arrow-right.png"></image>
            </view>
        </view>
        <scroll-view class="u-bottom" scroll-x>
            <slot name="u-body"></slot>
        </scroll-view>
    </view>
</template>

<script>

export default {
    name: "u-index-plugins",
    props: {
        list: {
            type: Array
        },
        url: {
            type: String
        }
    },
    methods: {
        router() {
            uni.navigateTo({
                url: this.url
            })
        }
    }
}
</script>

<style scoped lang="scss">
    .u-plugins {
        background-color: #f7f7f7;
    }
    .u-top {
        width: 750upx;
        height: 72upx;
        padding: 0 24upx;
        background-color: #ffffff;
        margin-bottom: 5upx;
    }
    .u-more {
        font-size: 26upx;
        color: #999999;
        margin-right: 12upx;
    }
    .u-icon {
        width: 12upx;
        height: 22upx;
        display: block;
    }
    .u-bottom {
        width: 750upx;
    }
</style>