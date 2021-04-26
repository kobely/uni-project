<template>
    <app-layout>
        <view class="bg">
            <view class="dir-top-wrap cross-center" style="background-color: #fff">
                <image mode="aspectFill" class='qrcode' @click='look' :src='img'></image>
                <view @click="saveImg" :class="[`share-btn main-center cross-center`]">保存图片</view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        data() {
            return {
                img: ''
            }
        },
        computed: {
            ...mapState({
                mall: state => state.mallConfig.mall,
                custom_setting: state => state.mallConfig.share_setting_custom,
                share_img: state => state.mallConfig.__wxapp_img.share
            })
        },
        methods: {
            look() {
                let that = this;
                uni.previewImage({
                    current: that.img,
                    urls: [that.img]
                })
            },

            saveImg() {
                if (!this.img) return;
                this.$utils.batchSave(this.img, 'image').then(() => {
                    uni.showToast({title: '保存成功'});
                });
            },

            getList() {
                let that = this;
                that.$request({
                    url: that.$api.share.poster,
                    method: 'get',
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.img = response.data.pic_url;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(()=>{
                        that.getList();
                    });
                });
            },
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            uni.setNavigationBarTitle({
                title: that.custom_setting.menus.qrcode.name
            });
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.getList();
        }
    }
</script>

<style scoped lang="scss">
    .bg {
        position: absolute;
        width: 100%;
        background-color: #fff;
        height: 100%;
    }

    .qrcode {
        height: #{1030rpx};
        width: #{580rpx};
        margin-top: #{32rpx};
    }

    .load {
        width: #{400rpx};
        height: #{400rpx};
        margin: 0 auto;
        padding-top: #{280rpx};
    }

    .share-btn {
        margin: #{34rpx} auto;
        width: #{480rpx};
        height: #{80rpx};
        font-size: #{32rpx};
        color: #fff;
        border-radius: #{40rpx};
        background: #ff4544;
    }
</style>
