<template>
    <view v-if="buy_data && buy_data.length" class="buy-prompt-box" :style="[hiddenHeight()]">
        <swiper circular vertical autoplay>
            <block v-for="(item,index) in buy_data" :key="index">
                <swiper-item @touchmove.stop.prevent catchtouchmove='catchTouchMove'>
                    <view class="box">
                        <view class="cross-center center dir-left-nowrap">
                            <image class="box-grow-0 image" :src="item.avatar"></image>
                            <view class="box-grow-0 text-a">{{item.time_str}}</view>
                            <view class="box-grow-0 text-b">{{item.content}}</view>
                        </view>
                    </view>
                </swiper-item>
            </block>
        </swiper>
    </view>
</template>

<script>
    import { mapState} from "vuex";
    export default {
        name: "app-buy-prompt",
        props: {
            isShowAttention: Boolean
        },
        data() {
            return {
                buy_data: null,
            }
        },
        computed: {
            ...mapState({
                systemInfo: state => state.gConfig.systemInfo,
                mBarHeight: state => state.gConfig.mBarHeight
            }),
            hiddenHeight() {
                return () => {
                    let n;
                    if (this.isShowAttention) {
                        n = uni.upx2px(280);
                    } else {
                        n = uni.upx2px(97);
                    }
                    // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO
                    n = n + this.systemInfo.statusBarHeight + this.mBarHeight;
                    // #endif
                    return Object.assign({}, {
                        top: n + 'px',
                    })
                }
            },
        },
        created: function () {
            const self = this;
            self.$request({
                url: self.$api.index.buy_data,
            }).then(info => {
                if (info.code === 0) {
                    self.buy_data = info.data;
                }
            });
        },
        methods: {
            catchTouchMove: function () {
                return false
            }
        }
    }
</script>

<style scoped lang="scss">
    swiper {
        height: #{60rpx};
        width: #{568rpx};
    }

    .buy-prompt-box {
        position: fixed;
        top: #{97rpx};
        left: #{24rpx};
        z-index: 9999;
    }

    .buy-prompt-box .box {
        display: inline-block
    }

    .buy-prompt-box .center {
        height: #{60rpx};
        background-color: rgba(0, 0, 0, 0.8);
        border-radius: #{30rpx};
        color: #fff;
    }

    .buy-prompt-box .image {
        height: #{60rpx};
        width: #{60rpx};
        border-radius: 50%;
    }

    .buy-prompt-box .text-a {
        padding-left: #{10rpx};
        font-size: #{24rpx};
    }

    .buy-prompt-box .text-b {
        padding-right: #{24rpx};
        font-size: #{24rpx};
        white-space: nowrap;
    }
</style>