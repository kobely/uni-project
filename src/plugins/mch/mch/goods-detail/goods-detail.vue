<template>
    <view class="app-layout">
        <app-layout :overflow="overflow">
            <view class="show" v-if="list.length == 0">
                <image @click="showMenu(0)" src='./../../image/add-detail.png'></image>
                <view>快来添加内容，来介绍你的商品吧！</view>
            </view>
            <view v-else>
                <view class="list-item dir-top-nowrap" v-for="(item,index) in list" :key="index">
                    <image v-if="item.type =='line'" class="line" :src="adminImg.line"></image>
                    <view v-if="item.type =='img' && item.pic_url == ''" class="loading main-center dir-top-nowrap cross-center">
                        <image class="loading-img" src="/static/image/loading.gif"></image>
                        <view class="loading-text">图片上传中，请稍后...</view>
                    </view>
                    <image v-if="item.type =='img' && item.pic_url != ''" :style="[{'height':`${item.height}`}]" @load="imageLoad(index,$event)" :src="item.pic_url"></image>
                    <view v-if="item.type=='text'" class="txt"><text>{{item.text}}</text></view>
                    <view class="choose dir-right-nowrap">
                        <view @click="showMenu(index)" class="choose-item">插入</view>
                        <view v-if="item.type=='text'" @click="editText(index,item)" class="choose-item">编辑</view>
                        <view v-if="item.type=='img'" @click="toggle(index)" class="choose-item">替换</view>
                        <view @click="move(1,index,item)" v-if="index != list.length - 1" class="choose-item">下移</view>
                        <view @click="move(2,index,item)" v-if="index != 0" class="choose-item">上移</view>
                        <view @click="toRemove(index)" class="choose-item">删除</view>
                    </view>
                </view>
                <view :class="['placeholder', `${iphone_x? 'iphone_x':''}`]"></view>
                <view :class="['add', `${iphone_x? 'iphone_x':''}`]">
                    <view @click="save">保存</view>
                </view>
            </view>
            <view @click="showMenu" v-if="textDialog || menu || is_delete" class="dialog">
                <view v-if="menu" class="menu">
                    <view class="menu-list main-center">
                        <view v-if="!toToggle" @click.stop="addLine" class="menu-item">
                            <image src="./../../image/line.png"></image>
                            <view>分割线</view>
                        </view>
                        <view v-if="!toToggle" @click.stop="showText" class="menu-item">
                            <image src="./../../image/txt.png"></image>
                            <view>文本</view>
                        </view>
                        <view @click="add('album')" class="menu-item">
                            <image src="./../../image/image.png"></image>
                            <view>图片</view>
                        </view>
                        <view class="toggle-placeholder" v-if="toToggle"></view>
                        <view @click="add('camera')" class="menu-item">
                            <image src="./../../image/camera.png"></image>
                            <view>相机</view>
                        </view>
                    </view>
                    <image @click="showMenu" class="close" src="/static/image/icon/close.png"></image>
                </view>
                <view @click.stop="" v-if="textDialog" class="textarea">
                    <textarea focus maxlength="-1" @confirm="toList" show-confirm-bar v-model="txt"></textarea>
                </view>
                <view class="dialog-item" v-if="is_delete">
                    <view class="dialog-title">提示</view>
                    <view class="dialog-txt">是否删除该组件</view>
                    <view class="main-center btn-area">
                        <view class="submit-btn" @click='cancel'>取消</view>
                        <view class="line"></view>
                        <view class="submit-btn be-submit" @click='remove'>确认</view>
                    </view>
                </view>
            </view>
        </app-layout>
    </view>
</template>

<script>
    import { mapState } from "vuex";
    import uploadFile from '../../../../core/upload.js';

    export default {
        data() {
            return {
                tempFilePaths: '',
                imgheight: 0,
                menu: false,
                list: [],
                txt: '',
                textDialog: false,
                overflow: false,
                is_delete: false,
                toToggle: false,
                index: 0,
                reEdit: false,
                loadingImg: false,
                iphone_x: false
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                adminImg: state => state.mallConfig.__wxapp_img.app_admin
            })
        },
        methods: {
            toList() {
                this.textDialog = false;
                let item = {
                    type:'text',
                    text: this.txt
                };
                if(this.reEdit) {
                    this.list.splice(this.index,1,item);
                    this.reEdit = false;
                }else {
                    this.list.splice(this.index,0,item);
                }
            },
            editText(index,item) {
                this.txt = item.text;
                this.reEdit = true;
                this.textDialog = true;
                this.index = index;
            },
            move(type,index,item) {
                this.list.splice(index,1);
                if(type == 1) {
                    this.list.splice(index + 1,0,item);
                }else {
                    this.list.splice(index - 1,0,item);
                }
            },

            toRemove(index) {
                this.txt = null;
                this.is_delete = true;
                this.index = index;
            },

            cancel() {
                this.is_delete = false;
            },

            remove() {
                this.is_delete = false;
                this.list.splice(this.index,1);
            },

            showMenu(index) {
                if(index > -1) {
                    this.index = index + 1;
                    this.menu = true;
                    this.txt = '';
                    this.toToggle = false;
                }else {
                    if(this.txt.length > 0) {
                        this.toList();
                    }else {
                        this.textDialog = false;
                    }
                    this.menu = false;
                }
            },

            toggle(index) {
                this.index = index;
                this.toToggle = true;
                this.menu = true;
            },

            addLine() {
                let item = {type:'line'}
                this.list.splice(this.index,0,item)
                this.menu = false;
            },

            showText() {
                this.textDialog = !this.textDialog;
                this.menu = false;
            },

            add(sourceType) {
                let that = this;
                this.menu = false;
                // #ifdef MP
                uni.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    sourceType: [sourceType],
                    success(res) {
                        // tempFilePath可以作为img标签的src属性显示图片
                        const tempFilePaths = res.tempFilePaths;
                        let list = that.list;
                        tempFilePaths.forEach(function (row, index) {
                            let para = {
                                pic_url: '',
                                type: 'img',
                                id: 0
                            };
                            that.loadingImg = true;
                            that.toToggle ? list.splice(that.index,1,para) : list.splice(that.index,0,para);
                            that.list = list;
                            let fileName = '';
                            // #ifdef MP-BAIDU
                            fileName = row.substr(row.lastIndexOf('/') + 1);
                            // #endif
                            uploadFile({
                                url: that.$api.upload.file,
                                filePath: row,
                                fileType: 'image',
                                mch_id: 0,
                                fileName: fileName
                            }).then(res => {
                                let imgInfo = undefined;

                                // #ifndef MP-BAIDU
                                imgInfo = JSON.parse(res.data);
                                // #endif

                                // #ifdef MP-BAIDU
                                imgInfo = res.data;
                                // #endif

                                if (imgInfo.code == 0) {
                                    for(let i in list) {
                                        if(list[i].type === 'img' && list[i].pic_url === '') {
                                            list[i].pic_url = imgInfo.data.url;
                                            list[i].id = imgInfo.data.id;
                                        }
                                    }
                                }
                                that.list = list;

                                if (index == tempFilePaths.length - 1) {
                                    that.loadingImg = false;
                                    uni.hideLoading();
                                }
                            });
                        })
                    }
                })
                // #endif

                // #ifdef H5
                uni.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    sourceType: [sourceType],
                    success: function(e) {
                        uni.showLoading({
                            mask: true,
                            title: '上传中...'
                        });
                        let list = that.list;
                        let image = new Image();
                        image.src = e.tempFilePaths;
                        let para = {
                            pic_url: '',
                            type: 'img',
                            id: 0
                        };
                        that.loadingImg = true;
                        that.toToggle ? list.splice(that.index,1,para) : list.splice(that.index,0,para);
                        that.list = list;
                        image.onload = () => {
                            let canvas = document.createElement("canvas");
                            canvas.width = image.width;
                            canvas.height = image.height;
                            let ctx = canvas.getContext("2d");
                            ctx.drawImage(image, 0, 0, image.width, image.height);
                            let ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase();
                            let dataURL = canvas.toDataURL("image/" + ext);
                            uploadFile({
                                url: that.$api.upload.file,
                                maxNum: 1,
                                success: function({res, header}) {
                                    that.$request({
                                        url: that.$api.upload.file + '&name=base64',
                                        header: header,
                                        method: 'post',
                                        data: {
                                            database: dataURL
                                        }
                                    }).then(res => {
                                        uni.hideLoading();
                                        if (res.code === 0) {
                                            for(let i in list) {
                                                if(list[i].type === 'img' && list[i].pic_url === '') {
                                                    list[i].pic_url = res.data.url;
                                                    list[i].id = res.data.id;
                                                }
                                            }
                                            that.loadingImg = false;
                                            uni.hideLoading();
                                        } else {
                                            uni.showModal({
                                                title: '',
                                                content: res.msg,
                                                showCancel: false,
                                            });
                                        }
                                    })
                                }
                            });
                        };
                    }
                });
                // #endif
            },
            imageLoad(index,e) {
                let $height = e.detail.height; //获取图片真实高度
                let $width = e.detail.width; //获取图片真实宽度
                let height = $height * (750 / $width);
                this.list[index].height = height + 'rpx';
                this.$forceUpdate();
            },
            clear(index) {
                this.img.splice(index,1)
                this.$storage.setStorageSync('goods_detail', this.list);
            },
            save() {
                if(!this.loadingImg) {
                    this.$storage.setStorageSync('goods_detail', this.list);
                    setTimeout(function() {
                        uni.navigateBack();
                    }, 500)
                }else {
                    uni.showToast({
                        title: '上传图片中，请稍后...',
                        icon: 'none',
                        duration: 1000
                    });
                }
            }
        },

        onLoad() { this.$commonLoad.onload();
            let that = this;
            this.list = this.$storage.getStorageSync('goods_detail') ? this.$storage.getStorageSync('goods_detail') : [];
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
        }
    }
</script>

<style scoped lang="scss">
    #editor {
        width: 100%;
        height: 100%;
        background-color: #fff;
    }
    .app-layout {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: #fff;
    }
    .app-layout /deep/ .app-layout {
        background: #FFFFFF;
    }
    .show {
        margin-top: #{220rpx};
        width: 100%;
        text-align: center;
        color: #353535;
        font-size: #{32rpx};
        image {
            width: #{310rpx};
            height: #{310rpx};
            margin-bottom: #{90rpx};
        }
    }
    .dialog {
        background-color: rgba(0,0,0,.3);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 20;
        .menu {
            height: #{420rpx};
            width: 100%;
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 21;
            background-color: #fff;
            border-top-left-radius: #{16rpx};
            border-top-right-radius: #{16rpx};
            padding-top: #{68rpx};
            .toggle-placeholder {
                height: #{194rpx};
                width: #{134rpx};
            }
            .menu-list {
                margin-left: #{23rpx};
                .menu-item {
                    margin: 0 #{28rpx};
                    width: #{120rpx};
                    text-align: center;
                    color: #353535;
                    font-size: #{28rpx};
                    image {
                        height: #{120rpx};
                        width: #{120rpx};
                        margin-bottom: #{20rpx};
                    }
                }
            }
            .close {
                width: #{30rpx};
                height: #{30rpx};
                margin: #{88rpx} auto 0;
                display: block;
            }
        }
        .textarea {
            position: fixed;
            top: #{25rpx};
            left: #{24rpx};
            z-index: 50;
            width: #{702rpx};
            height: #{300rpx};
            background-color: #fff;
            border-radius: #{16rpx};
            padding: #{24rpx} #{28rpx};
            color: #353535;
            font-size: #{28rpx};
            textarea {
                width: 100%;
                height: 100%;
            }
        }
        .dialog-item {
            padding-top: #{35rpx};
            position: fixed;
            top: 30%;
            left: 0;
            right: 0;
            margin: 0 auto;
            width: #{620rpx};
            border-radius: #{16rpx};
            background-color: #fff;
            .dialog-title {
                font-size: #{32rpx};
                color: #353535;
                margin-bottom: #{6rpx};
                text-align: center;
            }
            .dialog-txt {
                margin: #{40rpx} auto;
                text-align: center;
                font-size: #{32rpx};
                color: #353535;
            }
            .btn-area {
                height: #{88rpx};
                position: relative;
                border-top: #{1rpx} solid #e2e2e2;
                .line {
                    height: #{32rpx};
                    width: #{1rpx};
                    background-color: #e2e2e2;
                    position: absolute;
                    top: #{28rpx};
                    left: 0;
                    right: 0;
                    margin: 0 auto;
                }
                .submit-btn {
                    height: #{88rpx};
                    line-height: #{88rpx};
                    font-size: #{32rpx};
                    color: #666;
                    width: #{310rpx};
                    text-align: center;
                }
                .submit-btn.be-submit {
                    color: #ff4544;
                }
            }
        }
    }
    .list-item {
        background-color: #fff;
        margin-top: #{-2rpx};
        image {
            width: 100%;
        }
        .loading {
            padding: #{75rpx} 0;
            background-color: #fff;
            .loading-img {
                height: #{160rpx};
                width: #{160rpx};
            }
            .loading-text {
                font-size: #{28rpx};
                color: #999999;
                margin-top: #{28rpx};
            }
        }
        .line {
            height: #{72rpx};
        }
        .choose {
            height: #{80rpx};
            font-size: #{28rpx};
            color: #353535;
            background-color: #f7f7f7;
            padding-bottom: #{16rpx};
            .choose-item {
                width: #{120rpx};
                height: #{64rpx};
                line-height: #{64rpx};
                text-align: center;
                border: #{2rpx} solid #ff4544;
                background-color: #ffffff;
                color: #ff4544;
                margin-left: #{16rpx};
            }
        }
        .txt {
            padding: #{24rpx};
        }
    }
    .list-item:first-of-type {
        border-top: 0;
        margin-top: 0;
    }
    .list-item:last-of-type {
        border-bottom: 0;
    }
    .add {
        position: fixed;
        bottom: 0;
        left: 0;
        height: #{120rpx};
        width: 100%;
        z-index: 15;
        background-color: #fff;
        view {
            width: #{702rpx};
            line-height: #{80rpx};
            height: #{80rpx};
            margin: #{20rpx} auto;
            border-radius: #{40rpx};
            background-color: #ff4544;
            color: #fff;
            font-size: #{32rpx};
            text-align: center;
        }
    }
    .add.iphone_x {
        height: #{170rpx};
        padding-bottom: #{50rpx};
    }
    .placeholder {
        height: #{120rpx};
    }
    .placeholder.iphone_x {
        height: #{170rpx};
    }
</style>