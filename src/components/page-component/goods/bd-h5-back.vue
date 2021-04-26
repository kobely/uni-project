<template>
    <view @click="back" :class="iconStyle == 1 ? 'bd-back-style-1' : 'bd-back-style-2 cross-center main-center'" :style="{'height': iconStyle == 2 ? height + 'upx' : '46upx','width': iconStyle == 2 ? width + 'upx' : '46upx'}">
        <image class="back-icon" v-if="iconStyle == 2" :src="moreRank ? '../../../../static/image/icon/h5-back-2.png' : '../../../static/image/icon/h5-back-2.png'" alt=""></image>
    </view>
</template>

<script>
export default {
    name: "bd-h5-back",
    props: {
        height: {
            type: String,
            default: function(){
                return '102';
            }
        },
        width: {
            type: String,
            default: function(){
                return '75';
            }
        },
        iconStyle: {
            type: Number,
            default: function(){
                return 1;
            }
        },
        moreRank: {
            type: Boolean
        }
    },
    methods: {
        back() {
            let pages = getCurrentPages();
            if (pages.length > 1) {
                uni.navigateBack();
            } else {
                uni.navigateTo({
                    url: 'pages/index/index'
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .bd-back-style-1 {
        width: 46upx;
        border-radius: 50%;
        position: fixed;
        top: 24upx;
        left:24upx;
        z-index: 1500;
        background-repeat: no-repeat;
        background-image: url("../../../static/image/icon/h5-back.png");
        background-size: 100% 100%;
    }
    .bd-back-style-2 {
        border-radius: 50%;
        position: fixed;
        top: 0;
        left:0;
        z-index: 1500;
        .back-icon {
            width: 15upx;
            height: 27upx;
        }
    }
</style>