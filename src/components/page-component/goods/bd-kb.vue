<template>
    <view class="bd-kb" v-if="express || shipping || pickup || limit">
        <view class="block dir-left-nowrap cross-center" v-if="express">
            <view class="box-grow-0">快递</view>
            <view class="content box-grow-1 u-line-1">{{express}}</view>
        </view>
        <view class="block dir-left-nowrap cross-center bd-margin" v-if="shipping" @click="openPopup('shipping', '包邮')">
            <view class="box-grow-0">包邮</view>
            <view class="content box-grow-1 u-line-1">{{shipping}}</view>
            <image class="bd-icon box-grow-0" src="../../../static/image/icon/arrow-right.png"></image>
        </view>
        <view class="block dir-left-nowrap cross-center bd-margin" v-if="limit" @click="openPopup('limit', '限购')">
            <view class="box-grow-0">限购</view>
            <view class="content box-grow-1 u-line-1">{{limit}}</view>
            <image class="bd-icon box-grow-0" src="../../../static/image/icon/arrow-right.png"></image>
        </view>
        <view class="block dir-left-nowrap cross-center bd-margin" v-if="pickup" @click="openPopup('pickup', '起送')">
            <view class="box-grow-0">起送</view>
            <view class="content box-grow-1 u-line-1">{{pickup}}</view>
            <image class="bd-icon box-grow-0" src="../../../static/image/icon/arrow-right.png"></image>
        </view>
        <u-popup v-model="show" length="600" mode="center" border-radius="14" @close="show = false">
            <view class="model" @touchmove.stop.prevent>
                <view class="f-top dir-left-nowrap main-between cross-center">
                    <view class="f-title dir-left-nowrap cross-center u-line-1">
                        <view class="p-title">{{showTitle}}</view>
                    </view>
                    <view class="f-image" @click="show = false">
                        <image class="f-img" src="/static/image/icon/icon-close.png"></image>
                    </view>
                </view>
                <scroll-view scroll-y class="f-scroll">
                    <view class="f-scroll-content">
                        {{showText}}
                    </view>
                </scroll-view>
            </view>
        </u-popup>
    </view>
</template>

<script>
    import uPopup from '../../basic-component/u-popup/u-popup.vue';
    export default {
        name: "bd-kb",
        props: {
            limit: String,
            shipping: String,
            express: String,
            pickup: String
        },
        components: {
            uPopup
        },
        data() {
            return {
                show: false,
                showText: '',
                showTitle: ''
            }
        },
        methods: {
            openPopup(data, title) {
                this.showText = this[data];
                this.showTitle = title;
                this.show = true;
            }
        }
    }
</script>

<style scoped lang="scss">
    .bd-kb {
        width: 702upx;
        border-radius: 15upx;
        padding: 20upx;
        background-color: #ffffff;
        margin: 24upx 24upx 24upx 24upx;
    }
    .block {
        font-size: 26upx;
    }
    .block view:first-child {
        margin-right: 26upx;
        color: #999999;
    }
    .content {
        color: #353535;
    }
    .bd-icon {
        width: 12upx;
        height: 22upx;
    }
    .bd-margin {
        margin-top: 20upx;
    }
    .bd-margin:first-child{
        margin-top: 0;
    }
    .model {
        background-color: #ffffff;
        padding-bottom: 24upx;
    }
    .f-scroll {
        max-height: 450upx;
    }
    .f-image {
        width: 78upx;
        height: 78upx;
        padding: 24upx;
        position: absolute;
        right: 0;
    }
    .f-img {
        width: 30upx;
        height: 30upx;
    }
    .f-top {
        height: 105upx;
        position: relative;
    }
    .f-title {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        max-width: 594upx;
    }
    .p-title {
        font-size: 28upx;
        color: #000000;
        text-align: center;
    }
    .f-scroll-content {
        padding: 0 24upx;
        font-size: 28upx;
        color: #353535;
    }
</style>