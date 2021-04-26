<template>
    <app-layout>
        <view class='dir-top-nowrap cross-center box'>
            <image class='disabled_img' :src='picUrl'></image>
            <text class='title'>{{text}}</text>
            <text class='content'>请联系管理员</text>
        </view>
    </app-layout>
</template>

<script>
    import { mapGetters } from "vuex";

    export default {
        data() {
            return {
                picUrl: '',
                text: ''
            }
        },
        computed: {
            ...mapGetters('mallConfig', {
                __wxapp_img: 'getWxappImg'
            })
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.picUrl = this.__wxapp_img.mall.disabled;
            this.text = options.text;
        }
    }
</script>

<style scoped lang="scss">
    .box {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .disabled_img {
        width: 380#{rpx};
        height: 380#{rpx};
        margin-top: 200#{rpx};
    }

    .title {
        margin-top: 56#{rpx};
        font-size: 13pt;
        color: #5292ed;
    }

    .content {
        margin-top: 24#{rpx};
        font-size: 9pt;
        color: $uni-general-color-two;
    }
</style>