<template>
    <view class="bd-share dir-left-nowrap " :class="hideShare ? 'main-center':'main-between'">
        <template v-if="!isImg">
            <view class="bd-btn bd-left" @click="copy" :style="{marginLeft: hideShare ? '0' : '70upx'}">
                <view class="bd-radius dir-top-nowrap main-center cross-center">
                    <image class="bd-image" src="./image/share.png"></image>
                    <text>发送给好友</text>
                </view>
                <text>点击发送给好友，</text>
                <text>以完成分享</text>
            </view>
            <view class="bd-btn bd-right" @click="share" v-if="!hideShare">
                <view class="bd-radius dir-top-nowrap main-center cross-center">
                    <image class="bd-image" src="./image/pic.png"></image>
                    <text>生成分享海报</text>
                </view>
                <text>点击生成分享海报，</text>
                <text>好友扫码进入</text>
            </view>
        </template>
        <template v-else>
            <image class="bd-share-img" :src="shareImage"></image>
            <view class="bd-share-btn" @click="saveImg">保存到相册</view>
        </template>
    </view>
</template>

<script>
export default {
    name: "h5-share",
    data() {
        return {
            hideShare: true,
            url: '',
            shareImage: '',
            isImg: false,
            shareUrl: '',
            posterConfig: {},
            hasPosterNav: false,
            posterGenerate: null
        }
    },
    onLoad(options) { this.$commonLoad.onload(options);
        this.hideShare = options.hideShare == 1;
        this.url = decodeURIComponent(options.url);
        this.shareUrl = decodeURIComponent(options.shareUrl);
        this.posterConfig = options.posterConfig;
        this.hasPosterNav = options.hasPosterNav;
        this.posterGenerate = options.posterGenerate;
    },
    methods: {
        copy() {
            this.$utils.uniCopy({
                data: this.url,
                success() {
                    uni.showToast({
                        icon: 'none',
                        title: '链接已复制'
                    });
                }
            });
        },
        share() {
            if (this.hasPosterNav) {
                let url = `/pages/poster/goods?poster_config=${this.posterConfig}&poster_generate=${this.posterGenerate}`
                uni.navigateTo({
                    url: url
                });
            } else {
                if (!this.shareUrl) return;
                this.$request({
                    url: this.shareUrl,
                }).then(response => {
                    if (response.code === 0) {
                        this.shareImage = response.data.pic_url;
                        // this.loading = false;
                    } else {
                        uni.showModal({
                            content: response.msg,
                            showCancel: false,
                        });
                    }
                });
            }
        },
        saveImg() {
            let a = document.createElement('a');
            a.setAttribute('href', this.shareImage);
            a.setAttribute('download', '');
            let obj = document.createEvent('MouseEvents');
            obj.initMouseEvent('click', true, true, window, 0,0,0,0,0, false, false, true, false, 0, null);
            a.dispatchEvent(obj);
        }
    }
}
</script>

<style scoped lang="scss">
.bd-share {
    width: 100%;
    position: absolute;
    top: 0;
    left:0;
    background-color: #f5f4f9;
    height: 100%;
}
.bd-share-img {
    width: 100%;
    position: absolute;
    top: 0;
    left:0;
    height: 100%;
}
.bd-share-btn {
    width: 340upx;
    height: 80upx;
    border-radius: 40upx;
    color: #ffffff;
    background: #67bcff;
    text-align: center;
    font-size: 30upx;
    line-height: 80upx;
    position: fixed;
    bottom: 35upx;
    left: 50%;
    transform: translateX(-50%);
}
.bd-btn {
    width: 270upx;
    margin-top: 225upx;
    text-align: center;
}
.bd-left {
    margin-left: 70upx;
    .bd-image {
        width: 69upx;
        height: 90upx;
    }
}
.bd-right {
    margin-right: 70upx;
    .bd-image {
        width: 93upx;
        height: 79upx;
    }
}
.bd-image {
    margin-top: 66upx;
    margin-bottom: 35upx;
}
.bd-radius {
    width:      270upx;
    height: 270upx;
    border-radius: 50%;
    background-color: #ffffff;
    margin-bottom: 35upx;
    font-size: 22upx;
}
</style>