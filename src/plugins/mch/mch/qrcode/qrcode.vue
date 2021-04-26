<template>
    <app-layout>
        <view class="qrcode-bg">
            <view class="icon-bg" :style="{'background-image': `url(${appImg.qrcode_header_bg})`}" type></view>
            <image class="mch-pic" :src="mch.store.cover_url"></image>
            <view class="mch-name">{{mch.store.name}}</view>
            <image class="mch-qrcode" :src="qr_code.file_path"></image>
            <view class="mch-text">扫一扫，进入店铺</view>
            <view class="main-center">
                <app-button height="80" width="300" background="#ffffff" color="#ff4544" @click="saveQrcode" round>保存二维码
                </app-button>
            </view>
        </view>
    </app-layout>
</template>

<script>
import {mapState} from 'vuex';

export default {
    name: "qrcode",
    computed: {
        ...mapState({
            appImg: state => state.mallConfig.plugin.mch.app_image,
        }),
    },
    components: {},
    data() {
        return {
            qr_code: {},
                mch: {
                    store: {}
                },
                mch_id: 0,
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            const self = this;
            self.mch_id = options.mch_id;
            self.$request({
                url: self.$api.mch.qr_code,
                data: {
                    mch_id: self.mch_id,
                }
            }).then(info => {
                if (info.code === 0) {
                    self.mch = info.data.mch;
                    self.qr_code = info.data.qr_code;
                } else {
                    uni.showToast({title: info.msg, icon: 'none'})
                }
            })
        },

        methods: {
            //TODO 公用
            saveQrcode: function () {
                let qrcode_pic = this.qr_code.file_path;
                this.$utils.batchSave(qrcode_pic, 'image').then(result => {
                    uni.showToast({title: '保存成功'});
                });
            },
        }
    }
</script>
<style scoped lang="scss">
    .qrcode-bg {
        text-align: center;
        color: #353535;

        .icon-bg {
            height: #{240rpx};
            width: 100%;
            background-size: 100% auto;
            background-repeat: no-repeat;
        }

        .mch-pic {
            display: inline-block;
            margin-top: #{-100rpx};
            height: #{200rpx};
            width: #{200rpx};
            border-radius: #{16rpx};
            box-shadow: 0 0 #{16rpx} rgba(0, 0, 0, 0.4);
        }

        .mch-name {
            font-size: #{36rpx};
            margin-top: #{48rpx};
            margin-bottom: #{80rpx};
        }

        .mch-qrcode {
            height: #{400rpx};
            width: #{400rpx};
        }

        .mch-text {
            font-size: #{32rpx};
            margin-top: #{40rpx};
            margin-bottom: #{32rpx};
        }
    }
</style>