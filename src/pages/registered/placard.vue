<template>
    <view class="dir-top-nowrap cross-center main-center">
        <image class="bd-wechart" src="/static/image/icon/wechart.png"></image>
        <text class="bd-text">完成支付后请返回公众号继续操作</text>
    </view>
</template>

<script>
export default {
name: "placard"
}
</script>

<style scoped lang="scss">
    .bd-wechart {
        width: 127upx;
        height: 127upx;
        margin-bottom: 50upx;
        margin-top: 150upx;
    }
    .bd-text {
        font-size: 28upx;
        color: #353535;
    }
    // #ifdef H5
   .uni-page-head {
       display: none;
   }
    // #endif
</style>