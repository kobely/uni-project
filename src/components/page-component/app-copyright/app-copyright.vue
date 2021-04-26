<template>
    <view class="app-view">
        <app-jump-button form :url="link.url" :open_type="link.openType" :params="link.params?link.params:[]">
            <view class="app-view dir-top-nowrap cross-center" :style="{backgroundColor: backgroundColor}">
                <icon class="app-icon" v-if="picUrl" :style="{backgroundImage: `url(${picUrl})`}" type></icon>
                <text class="app-text" :style="{marginTop: picUrl ? '16rpx': '24rpx'}">{{text}}</text>
            </view>
        </app-jump-button>
    </view>
</template>

<script>

    export default {
        name: 'app-copyright',
        props: {
            backgroundColor: {
                type: String,
                default() {
                    return '#ff4544';
                }
            },
            link: {
                type: Object,
                default() {
                    return null;
                }
            },
            picUrl: String,
            text: String,
        }
    }
</script>

<style scoped lang="scss">
    .app-view {
        width: #{750rpx};
        border: none;
        border-radius: 0;padding-bottom: 24rpx;
    }

    .app-text {
        font-size: #{24rpx};
        text-align: center;
        color: #999999;
    }

    .app-icon {
        width: #{160rpx};
        height: #{50rpx};
        margin-top: #{36rpx};
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

</style>