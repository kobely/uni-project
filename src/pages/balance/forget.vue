<template>
    <app-layout>
        <view class="bd-forget" >
            <view class="bd-image">
                <image class="bd-img" src="./image/forget.png"/>
                <view class="bd-text">请联系平台客服修改</view>
            </view>
            <view class="bd-wechat">
                <view class="bd-border">
                    <view class="border-title">客服微信</view>
                    <image class="bd-img-wechat" :src="detail.qrcode_url"/>
                    <view v-if="detail.name" class="bd-name">微信号：{{detail.name}}</view>
                    <view class="bd-btns main-center cross-center">
                        <view class="bd-btn" @click="saveImg">保存客服二维码图片</view>
                        <view class="bd-btn" v-if="detail.name" @click="saveName">复制客服微信号</view>
                    </view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
    name: "forget",
    data() {
        return {
            detail: null
        }
    },
    computed: {
        ...mapState({
            mall: state => state.mallConfig.mall
        }),
    },
    onLoad() {
        this.detail = this.mall.setting.current_customer_service;
    },
    methods: {
        saveImg() {
            this.$utils.batchSave(this.detail.qrcode_url, 'image').then(() => {
                uni.showToast({title: '保存成功'});
            });
        },
        saveName() {
            this.$utils.uniCopy({
                data: this.detail.name,
                success() {
                     uni.showToast({
                        icon: 'none',
                        title: '微信客服复制成功'
                    });        
                }
            });
        }
    }
}
</script>

<style scoped lang="scss">
    .bd-image {
        width: 750upx;
        height: 460upx;
        background: #ffffff;
    }
    .bd-img {
        width:335upx;
        height: 200upx;
        margin: 100upx 207.5upx 0 207.5upx;
    }
    .bd-wechat {
        padding: 70upx 40upx;
        width:750upx;
    }
    .bd-text {
        font-size: 35upx;
        font-weight: bold;
        color: #333333;
        text-align: center;
        margin-top:50upx;
    }
    .bd-border {
        border: 1upx dashed #999999;
        background: #ffffff;
        border-radius: 15upx;
        position: relative;
        height: 650upx;
    }
    .border-title {
        height: 80upx;
        line-height: 80upx;
        text-align: center;
        width: 240upx;
        color: #353535;
        font-size: 35upx;
         border: 1upx dashed #999999;
        background: #ffffff;
        border-radius: 15upx;
        position: absolute;
        top: 0;
        transform: translate(-50%, -50%);
        left: 50%;
    }
    .bd-img-wechat {
        width: 360upx;
        height:360upx;
        margin:90upx 155upx 25upx 155upx;
    }
    .bd-name {
        font-size:26upx;
        color: #999999;
        text-align: center;
    }
    .bd-btns {
        padding: 24upx 0;
    }
    .bd-btn {
        width:264upx;
        height:64upx;
        border: 1upx solid #ff4544;
        border-radius: 32upx;
        color: #ff4544;
        font-size:24upx;
        line-height: 64upx;
        text-align: center;
        margin: 0 40upx;
    }
</style>