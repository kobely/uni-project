<template>
    <app-layout>
        <view class='poster' @click="screen">
            <image :src='poster'></image>
        </view>
        <view class='choose'>
            <view class='share-title'>选择模版</view>
            <view class='share-bg main-center'>
                <view class='cross-left box-grow-0' @click='chooseImg(1)'>
                    <image src='./../image/left.png' v-if="left"></image>
                </view>
                <view class='pic_list box-grow-0 dir-left-nowrap'>
                    <view v-for="item in pic" :key="item" :class="[`bg-item`,`${currentItem==item.id?'active':''}`]" @click="tagChoose(item.id)">
                        <image :src='item.pic_url'></image>
                    </view>
                </view>
                <view class='cross-right box-grow-0' @click='chooseImg(2)'>
                    <image src='./../image/xi-right.png' v-if="right"></image>
                </view>
            </view>
            <view @click='saveImage'>
                <button class='share-btn'>保存图片</button>
            </view>
            <view class='share-tip'>保存至相册</view>
        </view>
    </app-layout>
</template>

<script>

    export default {
        data() {
            return {
                todayStep: 0,
                pic_list: [],
                poster: '',
                pic: [],
                page: 0,
                currentItem: '',
                left: false,
                right: true,
            }
        },
        methods: {
            screen() {
                let img = this.poster
                uni.previewImage({
                    urls: [img]
                })
            },
            chooseImg(id) {
                let that = this;
                let length = Math.floor(that.pic_list.length / 4 -0.0001);
                if(id == 1) {
                    if (that.left == false ) {
                        return
                    }
                    that.page--;
                    that.right = true;
                    if (that.page == 0) {
                        that.left = false;
                    }
                    that.pic = that.pic_list.slice(that.page * 4, that.page * 4 + 4)
                } else if (id == 2){
                    if (that.right == false) {
                        return
                    }
                    that.page++;
                    that.left = true;
                    if (that.page == length) {
                        that.right = false;
                    }
                    that.pic = that.pic_list.slice(that.page * 4, that.page * 4 + 4)
                }
            },
            tagChoose(id) {
                this.currentItem = id;
                this.getPoster();
            },
            saveImage: function () {
                let that = this;
                // #ifndef MP-ALIPAY
                uni.showLoading({
                    mask: true,
                    text: '保存中...'
                });
                uni.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success(res) {
                        if (res.errMsg == "authorize:ok") {
                            uni.getImageInfo({
                                src: that.poster,
                                success(res) {
                                    uni.hideLoading();
                                    uni.saveImageToPhotosAlbum({
                                        filePath: res.path,
                                        success(res) {
                                            uni.showToast({
                                                title: '保存成功！',
                                                icon: 'success',
                                                duration: 2000
                                            });
                                        },
                                        fail(res) {
                                            uni.showToast({
                                                title: '保存失败！',
                                                icon: 'none',
                                                duration: 1000
                                            });
                                        }
                                    })
                                },
                                fail(res) {
                                    uni.hideLoading();
                                    uni.showToast({
                                        title: '保存失败！',
                                        icon: 'none',
                                        duration: 1000
                                    });
                                }
                            })
                        }
                    },
                    fail(res) {
                        uni.hideLoading();
                        uni.showModal({
                            title: '提示',
                            content: '保存失败，需要授权保存到相册权限',
                            showCancel: false,
                            confirmText: '打开授权',
                            success(e) {
                                if (e.confirm) {
                                    uni.openSetting({});
                                }
                            }
                        });
                    }
                })
                // #endif
                 // #ifdef MP-ALIPAY
                my.showLoading({
                    content: '图片保存中'
                });
                my.saveImage({
                    url: that.poster,
                    showActionSheet: true,
                    success: (res) => {
                        uni.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 1000
                        })
                    },
                    fail() {
                        uni.showToast({
                            title: '保存失败',
                            icon: 'none',
                            duration: 1000
                        })
                    },
                    complete() {
                        my.hideLoading();
                    }
                });
                // #endif
            },
            getPoster() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '生成中...'
                });
                that.$request({
                    url: that.$api.step.poster,
                    data: {
                        pic_id: that.currentItem,
                        num: that.todayStep
                    },
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.poster = response.data.pic_url;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                });
            },
            getList() {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '步数加载中...'
                });
                that.$request({
                    url: that.$api.step.setting,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.pic_list = response.data.qrcode_pic;
                        that.pic = response.data.qrcode_pic;
                        that.qrcode_title = response.data.qrcode_title;
                        that.currentItem = response.data.qrcode_pic[0].id;
                        if(response.data.qrcode_pic.length > 4) {
                            that.pic = response.data.qrcode_pic.slice(0, 4);
                        }else {
                            that.left = false;
                            that.right = false;
                        }
                        that.getPoster();
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            if (options.step > -1) {
                that.todayStep = options.step
            }
            that.getList();
        }
    }
</script>

<style scoped lang="scss">
    .poster {
        height: #{750rpx};
        width: #{422rpx};
        margin: #{46rpx} auto #{48rpx};
        background-color: whtie;
        display: block;
        box-shadow: 0 0 #{20rpx} rgba(0, 0, 0, 0.15);
    }

    .poster image {
        height: #{750rpx};
        width: #{422rpx};
    }

    .mycanvas {
        height: #{1165rpx};
        width: #{750rpx};
    }

    .share-title {
        font-size: #{30rpx};
        color: #999;
        text-align: center;
        margin-bottom: #{20rpx};
    }

    .share-bg {
        height: #{144rpx};
        text-align: center;
        position: relative;
        width: 100%;
    }

    .cross-left {
        height: #{144rpx};
        width: #{80rpx};
    }

    .cross-right {
        height: #{144rpx};
        width: #{80rpx}; 
    }

    .cross-left image, .cross-right image {
        height: #{26rpx};
        width: #{26rpx};
        display: block;
        margin-top: #{59rpx};
        margin-left: #{37rpx};
    }

    .share-bg .bg-item {
        margin-right: #{20rpx};
    }

    .share-bg .bg-item.active image {
        border: #{4rpx} solid #ff4544;
    }

    .pic_list {
        height: #{144rpx};
        width: #{540rpx};
        margin: 0 #{10rpx};
    }

    .bg-item,.bg-item image {
        height: #{144rpx};
        width: #{120rpx};
    }

    .share-btn {
        height: #{80rpx};
        width: #{500rpx};
        margin: #{40rpx} auto #{20rpx};
        color: white;
        font-size: #{32rpx};
        background-color: #ff4544;
        border-radius: #{40rpx};
        line-height: #{80rpx};
    }

    .share-tip {
        font-size: #{24rpx};
        color: #999;
        text-align: center;
    }
</style>