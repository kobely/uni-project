<template>
    <view class="app-dialog cross-center" :class="iVisible ? 'show' : '' ">
        <view class="background" @click="close"></view>
        <view class="container">
            <view class="header">
                <view class="title">{{title}}</view>
                <view class="close" @click="close">
                    <image src="/static/image/icon/icon-close.png"
                           style="width: 30rpx;height: 30rpx;"></image>
                </view>
            </view>
            <view style="padding: 0 34rpx">
                <scroll-view scroll-y class="body">
                    <text>{{content}}</text>
                </scroll-view>
            </view>
            <view class="footer">
                <view class="confirm" @click="confirm">{{confirmText}}</view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "app-dialog",
        props: {
            title: {
                default: '',
            },
            content: {
                default: '',
            },
            visible: {
                type: Boolean,
                default: false,
            },
            confirmText: {
                default: '确认',
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
            confirm() {
                this.iVisible = false;
                this.$emit('update:visible', this.iVisible);
            },
        },
    }
</script>

<style scoped lang="scss">
    .app-dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        padding: #{50rpx};
        visibility: hidden;

        .background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .5);
            z-index: 1;
        }

        .container {
            z-index: 2;
            background: #fff;
            border-radius: #{15rpx};
            overflow: hidden;
            width: 100%;

            .header {
                padding: #{40rpx} #{100rpx};
                position: relative;
                margin-bottom: #{2rpx};

                .title {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: center;
                    font-size: #{32rpx};
                }

                .close {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: #{24rpx};
                }
            }

            .body {
                padding: #{22rpx} #{32rpx};
                border: #{1rpx} solid #e2e2e2;
                border-radius: #{15rpx};
                margin-bottom: #{32rpx};
                height: #{517rpx};
                word-break: break-all;
            }

            .footer {
                border-top: #{1rpx} solid #e2e2e2;

                .confirm {
                    text-align: center;
                    padding: #{29rpx};
                    font-size: #{32rpx};
                    color: #666666;
                }
            }
        }
    }

    .app-dialog.show {
        visibility: visible;
    }
</style>