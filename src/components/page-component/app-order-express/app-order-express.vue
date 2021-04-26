<template>
    <view class="app-order-express">
        <app-jump-button :url="pageUrl">
            <view class='e-box dir-left-nowrap cross-center'>
                <view class='dir-top-nowrap box-grow-1'>
                    <view class='express-name'>快递公司: {{express}}</view>
                    <view style="margin-bottom: 15rpx;">快递单号: {{express_no}}</view>
                    <view v-if="merchant_remark">商家物流留言: {{merchant_remark}}</view>
                </view>
                <image class='box-grow-0 img' src='/static/image/icon/arrow-right.png'></image>
            </view>
        </app-jump-button>
    </view>
</template>

<script>
    export default {
        name: 'app-order-express',
        data() {
            return {}
        },
        props: {
            express: {
                type: String,
                value: ''
            },
            express_no: {
                type: String,
                value: ''
            },
            pageUrl: {
                type: String,
                value: ''
            },
            merchant_remark: {
                type: String,
                value: ''
            }
        }
    }
</script>

<style scoped lang="scss">
    .e-box {
        width: 100%;
    }

    .e-box .img {
        width: 12#{rpx};
        height: 24#{rpx};
    }

    .e-box .express-name {
        margin-bottom: 15#{rpx};
    }
</style>