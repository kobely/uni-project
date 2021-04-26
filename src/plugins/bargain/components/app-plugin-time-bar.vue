<template>
    <view class="time-bar">
        <view class="app-pt-time" :style="{'background-color': theme.background}">
            <image class="app-image" src="../image/time-bar.png"></image>
            <view class="app-time-content">
                <view class="app-name">{{start_begin}}</view>
                <view class="app-time-info dir-left-nowrap cross-center">
                    <text class="app-value">{{day}}</text>
                    <text class="app-degree">天</text>
                    <text class="app-value">{{hour}}</text>
                    <text class="app-degree">时</text>
                    <text class="app-value">{{minute}}</text>
                    <text class="app-degree">分</text>
                    <text class="app-value">{{second}}</text>
                    <text class="app-degree">秒</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'app-plugin-time-bar',
        props: {
            day: {
                type: String,
                default() {
                    return '00';
                }
            },
            hour: {
                type: String,
                default() {
                    return '00';
                }
            },
            minute: {
                type: String,
                default() {
                    return '00';
                }
            },
            second: {
                type: String,
                default() {
                    return '00';
                }
            },
            theme: Object,
            img_url: String,
            start_begin: String
        }
    }
</script>

<style scoped lang="scss">
    .default-back {
        background: linear-gradient(140deg, #ff5427, #ff3d3f,#ff2e4e, #ff2754);
    }
    .app-pt-time {
        height: #{88rpx};
        width: #{750rpx};
        position: relative;
        .app-image {
            width: #{750rpx};
            height: #{88rpx};
        }
        .app-title {
            width: #{281rpx};
            color: white;
            margin-top: #{46rpx};
            font-size: #{22rpx};
        }
        .app-time-content {
            width: #{322rpx};
            height: #{88rpx};
            position: absolute;
            right: 0;
            top: 0;
            .app-name {
                width: #{322rpx};
                height: #{30rpx};
                font-size: #{20rpx};
                color: white;
                margin: #{5rpx} 0;
                text-align: center;
            }
            .app-time-info {
                height: #{48rpx};
                width: #{322rpx};
                text-align: center;
                .app-degree {
                    font-size: #{23rpx};
                    color: #ffffff;
                    margin: 0 #{6rpx};
                }
                .app-value {
                    display: inline-block;
                    min-width: #{40rpx};
                    height: #{36rpx};
                    line-height: #{36rpx};
                    border-radius: #{4rpx};
                    background-color: white;
                    text-align: center;
                    font-size: #{19rpx};
                }
            }
        }
    }
</style>
