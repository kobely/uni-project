<template>
    <view class="app-bottom-modal">
        <view class="order-submit-picker dir-top-nowrap"
              :class="iVisible?'show':''">
            <view class="box-grow-1 close"
                  @click="close" @touchmove.stop="true"></view>
            <view class="box-grow-0 container">
                <view class="title dir-left-nowrap" @touchmove.stop="true">
                    <view class="box-grow-1">{{title}}</view>
                    <view @click="close"
                          class="box-grow-0">
                        <image src="/static/image/icon/icon-close.png"
                               style="width: 30rpx;height: 30rpx;"></image>
                    </view>
                </view>
                <view class="body">
                    <slot></slot>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "app-bottom-modal",
        props: {
            title: {
                type: String,
                default: '',
            },
            sign: {
                default: null,
            },
            visible: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                iVisible: this.visible,
            };
        },
        watch: {
            visible(v) {
                this.iVisible = v;
            },
        },
        methods: {
            close() {
                this.iVisible = false;
                this.$emit('update:visible', this.iVisible);
            },
        },
    }
</script>

<style scoped lang="scss">

    .order-submit-picker {
        background: rgba(0, 0, 0, 0.25);
        position: fixed;
        z-index: 1501;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        visibility: hidden;
        transition: 300ms;

        .close {
        }

        .container {
            background: #fff;
            position: relative;
            top: 100%;
            transition: 300ms;
            transition-timing-function: ease;
            border-radius: #{16rpx} #{16rpx} 0 0;
            box-shadow: 0 0 #{24rpx} rgba(0, 0, 0, .1);

            .title {
                padding: #{28rpx} #{32rpx};
                font-weight: bold;
                font-size: #{36rpx};
            }
        }
    }

    .order-submit-picker.show {
        opacity: 1;
        visibility: visible;

        .container {
            top: 0;
        }
    }
</style>