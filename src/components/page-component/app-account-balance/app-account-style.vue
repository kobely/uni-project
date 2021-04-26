<template>
    <view class="app-account-style" :style="{width: 702/showCount + 'rpx'}">
        <app-jump-button form arrangement="column" :url="page">
            <template v-if="showCount >= 3">
                <view class="dir-top-nowrap cross-center" style="width: 100%;overflow: hidden">
                    <view class="value box-grow-0 t-omit">{{value}}</view>
                    <view class="box-grow-1 dir-left-nowrap cross-center">
                        <view class="box-grow-0">
                            <image class="icon" :src="icon"></image>
                        </view>
                        <view class="unit box-grow-1">
                            <view class="t-omit">{{text}}</view>
                        </view>
                    </view>
                </view>
            </template>
            <template v-else>
                <view class="dir-left-nowrap cross-center" :class="[showCount > 1?'':'data-col']">
                    <view :class="[showCount > 1?'':'box-grow-0']">
                        <image class="icon" :src="icon"></image>
                    </view>
                    <view class="unit" :class="[showCount > 1?'':'box-grow-1']">
                        <view class="t-omit">{{text}}</view>
                    </view>
                    <view class="value t-omit" :class="[showCount > 1?'':'box-grow-0']">{{value}}</view>
                </view>
            </template>
        </app-jump-button>
    </view>
</template>

<script>
    export default {
        name: "app-account-style",
        props: {
            showCount: Number,
            icon: String,
            text: String,
            value: [Number, String],
            page: String,
        }
    }
</script>

<style scoped lang="scss">
    .app-account-style {
    }

    .icon {
        width: #{26rpx};
        height: #{26rpx};
        display: block;
        margin-right: #{12rpx};
    }

    .unit {
        color: $uni-general-color-one;
        margin-right: #{16rpx};
        font-size: $uni-font-size-general-two;
    }

    .value {
        color: #ffbb43;
        font-weight: bold;
        padding: 0 10upx;
    }
</style>