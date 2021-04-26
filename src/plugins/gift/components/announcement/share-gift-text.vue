<template>
	<view class="page-width ready-send">
        <view class="big">
            {{big}}
        </view>
        <view class="small" v-if="small">
            {{small}}
        </view>
    </view>
</template>

<script>
    export default {
        name: 'ready-send',

        props: [`big`, `small`]
    }
</script>

<style scoped lang="scss">
    @import "../../css/gift.scss";

    .ready-send {
        color: #ffffff;
        text-align: center;
        .big {
            line-height: 1;
            font-size: #{40upx};
            margin-top: #{64upx};
        }
        .small {
            line-height: 1.1;
            font-size: #{26upx};
	        margin-top: #{26upx};
        }
    }
</style>