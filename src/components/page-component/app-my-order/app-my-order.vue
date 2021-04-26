<template>
    <view class="app-my-order" :style="{background: backgroundColor}"
          :class="[!margin?'no-margin':'', !round?'no-round':'',]">
        <app-form-id @click="goUrl('/pages/order/index/index')">
            <view class="dir-left-nowrap cross-center title">
                <view class="box-grow-1">我的订单</view>
                <view class="box-grow-0 more">查看更多</view>
                <view class="box-grow-0">
                    <image class="arrow" src="/static/image/icon/arrow-right.png"></image>
                </view>
            </view>
        </app-form-id>
        <view class="dir-left-nowrap main-around nav-list">
            <view class="box-grow-0"
                  v-for="(item,index) in order_bar"
                  :key="index"
                  :style="{
                    width: (100/order_bar.length) + '%',
                  }">
                <app-form-id @click="goUrl(item.link_url, item.open_type)">
                    <view class="nav-item">
                        <view class="text"
                              :style="{'background-color': theme.background}"
                              v-if="item.num && item.num !== '' && item.num !== null && item.num !== 0 && item.num !== '0'">
                            {{item.num}}
                        </view>
                        <view>
                            <image class="icon" :src="item.icon_url"></image>
                        </view>
                        <view class="name">{{item.name}}</view>
                    </view>
                </app-form-id>
            </view>
        </view>
    </view>
</template>

<script>

    export default {
        name: 'app-my-order',
        props: {
            order_bar: {
                type: Array,
                default: [],
            },
            backgroundColor: {
                type: String,
                default() {
                    return '#ffffff'
                }
            },
            margin: {
                type: Boolean,
                default: false,
            },
            round: {
                type: Boolean,
                default: false,
            },
            theme: Object
        },
        methods: {
            goUrl(url, openType = 'navigate') {
                switch (openType) {
                    case 'navigate':
                        uni.navigateTo({
                            url: url,
                        });
                        break;
                    case 'redirect':
                        uni.redirectTo({
                            url: url,
                        });
                        break;
                    default:
                        uni.navigateTo({
                            url: url,
                        });
                        break;
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .app-my-order.no-margin {
        width: 100%;
        margin: 0 auto;
        box-shadow: none;
    }

    .app-my-order.no-round {
        border-radius: 0;
    }

    .app-my-order {
        width: #{702rpx};
        border-radius: #{16rpx};
        margin: #{24rpx} auto;
        box-shadow: 0 0 #{8rpx} rgba(0, 0, 0, .05);

        .title {
            padding: #{32rpx} #{32rpx} #{16rpx};

            .more {
                color: $uni-general-color-two;
                margin-right: #{12rpx};
            }

            .arrow {
                width: #{12rpx};
                height: #{22rpx};
            }
        }

        .nav-list {
            padding: 0 0 #{24rpx};

            .nav-item {
                padding: #{16rpx};
                text-align: center;
                position: relative;

                .text {
                    position: absolute;
                    top: 0;
                    right: #{24rpx};
                    border-radius: #{1000rpx};
                    font-size: $uni-font-size-weak-two;
                    height: #{32rpx};
                    line-height: #{32rpx};
                    min-width: #{32rpx};
                    text-align: center;
                    padding: 0 #{8rpx};
                    z-index: 10;
                    color: #ffffff;
                }

                .icon {
                    width: #{60rpx};
                    height: #{60rpx};
                    display: block;
                    margin: 0 auto #{20rpx};
                }

                .name {
                    font-size: $uni-font-size-weak-one;
                    color: $uni-general-color-one;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1;
                }
            }
        }
    }
</style>