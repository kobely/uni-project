<template>
    <view v-if="modelStatus" class="lottery-integral-model">
        <view class="box dir-top-nowrap main-center cross-center">
            <image class="close" @click="closeModel" src="/static/image/icon/close.png"></image>
            <view class="header">
                <view>参与此抽奖需要消耗</view>
                <view>
                    <text style="color: #ff4544" v-text="text"></text>
                    ，是否继续?
                </view>
            </view>
            <view class="bg" :style="{backgroundImage: 'url(' + appImg.lottery.bg+ ')'}"></view>
            <view @click="next" class="btn main-center cross-center">
                继续抽奖
            </view>
            <view @click="closeModel" class="fail">
                放弃抽奖
            </view>
        </view>
    </view>
</template>

<script>
import {mapState} from 'vuex';

export default {
    name: 'integral-model',
    computed: {
        ...mapState({
            appImg: state => state.mallConfig.__wxapp_img,
        }),
    },
    props: {
        text: {
            type: String,
            default: '0积分'
        },
    },
    data() {
        return {
            modelStatus: false,
            params: null,
        }
    },
    methods: {
        showModel(...params) {
            this.params = params;
            this.modelStatus = true;
        },
        next() {
            this.closeModel();
            this.$emit('next', this.params);
        },
        closeModel() {
            this.modelStatus = false;
        },
    }
}
</script>

<style scoped lang="scss">
.lottery-integral-model {
    text-align: center;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    z-index: 1602;
    background-color: rgba(0, 0, 0, 0.3);

    .box {
        position: relative;
        text-align: center;
        margin: 0 auto;
        width: #{534rpx};
        background-color: #FFFFFF;
        border-radius: #{16rpx};
        z-index: 2;
        top: 20%;

        .close {
            position: absolute;
            height: #{30rpx};
            width: #{30rpx};
            top: #{24rpx};
            right: #{24rpx};
        }

        .header {
            font-size: #{32rpx};
            color: #353535;
            font-weight: bold;
            margin: #{40rpx} auto;
        }

        .bg {
            background-size: 100% 100%;
            background-repeat: no-repeat;
            height: #{263rpx};
            width: #{355rpx};
            display: block;
            margin-bottom: #{40rpx};
        }

        .btn {
            height: #{76rpx};
            width: #{366rpx};
            background-color: #ff4544;
            color: #FFFFFF;
            font-size: #{32rpx};
            border-radius: #{40rpx};
            margin-bottom: #{36rpx};
        }

        .fail {
            line-height: 1;
            font-size: #{28rpx};
            color: #ff4544;
            margin-bottom: #{40rpx};
        }
    }
}
</style>