<template>
    <view class="bd-detail">
        <view class="detail" v-if="newDetail">
            <image src="/static/image/icon/goods-detail.png"></image>
            <app-rich-text
                :content="newDetail"
            ></app-rich-text>
        </view>
    </view>
</template>

<script>
import appRichText from "../../basic-component/app-rich/parse";

export default {
    name: "bd-detail",

    components: {
        'app-rich-text': appRichText,
    },

    props: {
        detail: {
            type: String,
            default() {
                return '';
            }
        },
    },
    created() {
        this.$store.dispatch('gConfig/setImageWidth', 48);
    },
    computed: {
        newDetail() {
            let detail = '';
            if (this.detail) {
                detail = this.detail;
            }
            return detail;
        },
    }
}
</script>

<style scoped lang="scss">

.bd-detail {
    width: 702upx;
    padding: 20upx 0;
    background-color: #ffffff;
    border-radius: 15upx;
    margin: 24upx 24upx 0 24upx;
    image {
        width: 100%;
        height: #{80rpx};
        display: block;
    }
}
</style>