<template>
    <view>
        <view class="safe-area-inset-bottom">
            <view class="u-bottom-height" ></view>
        </view>
	    <view class="safe-area-inset-bottom u-bottom-fixed">
            <view class='lottery-bottom dir-left-nowrap cross-center'>
                <view @click="nav(`/plugins/lottery/index/index`)" class="box-grow-1 dir-left-nowrap main-center cross-center">
                    <icon class="icon" :class="status==='index' ? 'icon-ht': 'icon-hf'" type></icon>
                    <view :class="status==='index' ? 'red': 'gray'">抽奖会场</view>
                </view>
                <view class="line"></view>
                <view @click="nav(`/plugins/lottery/prize/prize`)" class="box-grow-1 dir-left-nowrap main-center cross-center">
                    <icon class="icon" :class="status==='index' ? 'icon-jf': 'icon-jt'" type></icon>
                    <view :class="status==='index' ? 'gray': 'red'">抽奖记录</view>
                </view>
            </view>
	    </view>
    </view>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: 'common-buttom',
        computed: {
            ...mapState('gConfig', {
                iphone: (data) => {
                    return data.iphone;
                },
                iphoneHeight: (state) => {
                    return state.iphoneHeight;
                },
            })
        },
        props: {
            status: {
                type: String,
                default: 'index'
            },
        },
        methods: {
			nav(url) {
				uni.redirectTo({url});
			},
        }
    }
</script>

<style scoped lang="scss">
    .lottery-bottom {
        width: 100%;
        height: #{96rpx};
        border-top: #{1rpx} solid #e2e2e2;
        color: #999;

        .line {
            height: #{48rpx};
            width: #{1rpx};
            background: #e2e2e2;
        }

        .icon {
            width: #{34rpx};
            height: #{33rpx};
            background-repeat: no-repeat;
            background-size: 100% 100%;
            margin: 0 #{16rpx};
        }

        .icon.icon-ht {
            background-image: url('./image/lottery-hc-t.png');
        }

        .icon.icon-hf {
            background-image: url('./image/lottery-hc-f.png');
        }

        .icon.icon-jt {
            background-image: url('./image/lottery-jl-t.png');
        }

        .icon.icon-jf {
            background-image: url('./image/lottery-jl-f.png');
        }

        .gray {
            color: #999999;
        }

        .red {
            color: #ff4544;
        }
    }

    .navbar + .body {
        padding-bottom: #{115rpx};
    }

    .navbar + .body .lottery-bottom {
        bottom: #{115rpx};
    }

    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1500;
        background-color: #ffffff;
        box-shadow: 0 -1rpx 20rpx -15rpx #353535;
    }
    .u-bottom-height {
        height: 96upx;
    }
</style>