<template>
    <app-layout>
        <view class="cat-info" v-if="mch_id || mch_id == 0">
            <view class='cat-item type cross-center dir-left-nowrap'>
                <view class="form-label">分类级别</view>
                <view class="select">
                    <radio-group @change="typeChange" class="dir-left-nowrap main-between">
                        <label class="dir-left-nowrap cross-center" v-for="item in level" :key="item.value" style="width: 33%;">
                            <view>
                                <radio :disabled="id > 0" :color="color" :value="item.value" :checked="item.value == catItem.level"/>
                            </view>
                            <view class="select-label" :style="{'color': id > 0 ?  '#adadb2' : catItem.level == item.value ? color: '#353535'}">{{item.label}}</view>
                        </label>
                    </radio-group>
                </view>
            </view>
            <view class='cat-item cross-center main-between' v-if="catItem.level > 1">
                <view class="form-label">
                    <view><text style="color: #ff4544;">*</text>一级分类</view>
                </view>
                <view style="flex-grow: 1" @click="getList('one')">
                    <view class='cat-info dir-right-nowrap cross-center'>
                        <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                        <text style="color: #353535;width: 90%;text-align: right;" class="t-omit" v-if="parents">{{parents.label}}</text>
                        <text style="color: #cdcdcd" v-else>请选择归属的一级分类</text>
                    </view>
                </view>
            </view>
            <view class='cat-item cross-center main-between' v-if="catItem.level > 2">
                <view class="form-label">
                    <view><text style="color: #ff4544;">*</text>二级分类</view>
                </view>
                <view style="flex-grow: 1" @click="getList('two')">
                    <view class='cat-info dir-right-nowrap cross-center'>
                        <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                        <text style="color: #353535;width: 90%;text-align: right;" class="t-omit" v-if="parents_two">{{parents_two.label}}</text>
                        <text style="color: #cdcdcd" v-else>请选择归属的二级分类</text>
                    </view>
                </view>
            </view>
            <view class='cat-item cross-center dir-left-nowrap'>
                <view class="form-label"><text style="color: #ff4544;">*</text>分类名称</view>
                <view class='dir-left-nowrap price-input cross-center'>
                    <input placeholder-style="color: #cdcdcd" maxlength="16" placeholder="请输入分类名称" class='input' v-model="catItem.name"></input>
                </view>
            </view>
            <view class='cat-item cross-center dir-left-nowrap'>
                <view class="form-label"><text style="color: #ff4544;">*</text>排序</view>
                <view class='dir-left-nowrap price-input cross-center'>
                    <input type="number" placeholder-style="color: #cdcdcd" placeholder="请输入排序" class='input' v-model="catItem.sort"></input>
                </view>
            </view>
            <view class='cat-item cross-center main-between'>
                <view class="form-label">
                    <view>分类图标</view>
                    <view class="sub-label">200x200</view>
                </view>
                <view>
                    <view @click="add('pic_url')" class='cat-info dir-right-nowrap cross-center'>
                        <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                        <image v-if="catItem.pic_url" class="cat-pic" :src="catItem.pic_url"></image>
                        <text style="color: #cdcdcd" v-else>请上传分类图标</text>
                    </view>
                </view>
            </view>
            <view class='cat-item cross-center main-between'>
                <view class="form-label">
                    <view>分类大图</view>
                    <view class="sub-label">702x212</view>
                </view>
                <view>
                    <view @click="add('big_pic_url')" class='cat-info dir-right-nowrap cross-center'>
                        <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                        <image v-if="catItem.big_pic_url" class="cat-pic big" :src="catItem.big_pic_url"></image>
                        <text style="color: #cdcdcd" v-else>请上传分类大图</text>
                    </view>
                </view>
            </view>
            <view class='cat-item cross-center main-between'>
                <view class="form-label">
                    <view>分类广告图</view>
                    <view class="sub-label">500x184</view>
                </view>
                <view>
                    <view @click="add('advert_pic')" class='cat-info dir-right-nowrap cross-center'>
                        <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                        <image v-if="catItem.advert_pic" class="cat-pic advert" :src="catItem.advert_pic"></image>
                        <text style="color: #cdcdcd" v-else>请上传分类广告图</text>
                    </view>
                </view>
            </view>
            <view class='cat-item cross-center main-between' v-if="mch_id == 0">
                <view class="form-label">
                    <view>广告链接</view>
                </view>
                <view style="flex-grow: 1" @click="getList('ad')">
                    <view class='cat-info dir-right-nowrap cross-center'>
                        <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                        <text v-if="catItem.advert_url">{{catItem.advert_url}}</text>
                        <text style="color: #cdcdcd" v-else>请选择链接</text>
                    </view>
                </view>
            </view>
            <view class='cat-item cross-center main-between'>
                <view class="form-label">是否启用</view>
                <switch :color="color" style="transform:scale(0.7)" :checked="catItem.status == 1" @change="catItem.status = catItem.status == 0 ? 1:0"></switch>
            </view>
            <view class='cat-item cross-center main-between'>
                <view class="form-label">是否显示</view>
                <switch :color="color" style="transform:scale(0.7)" :checked="catItem.is_show == true" @change="catItem.is_show = !catItem.is_show"></switch>
            </view>
        </view>
        <view  v-if="mch_id || mch_id == 0" :class="['placeholder', `${iphone_x? 'iphone_x':''}`]"></view>
        <view  v-if="mch_id || mch_id == 0" :class="['add', `${iphone_x? 'iphone_x':''}`]" >
            <view :style="{'background-color':color}" @click="save">保存</view>
        </view>
        <view :class="['dialog', `${iphone_x?'iphone_x':''}`]" v-if="dialog">
            <view class="picker-list">
                <view class="main-between picker-header" :style="{'color': color}">
                    <view @click="dialog=false;">取消</view>
                    <view @click="submitChoose">确定</view>
                </view>
                <view v-if="mode == 'ad'" class="picker-type dir-left-nowrap cross-center">
                    <view @click="toggleType(item.value)" class="picker-type-item box-grow-1" :class="chooseType == item.value ? 'active':''" v-for="item in linkType" :key="item.value" :style="{'color': chooseType == item.value ? color : '#353535','border-color': chooseType == item.value ? color : '#fff'}">{{item.name}}</view>
                </view>
                <picker-view v-if="pickList.length > 0" indicator-style="height: 34px;" :value="chooseIndex" class="picker" @change="bindChange">
                    <picker-view-column>
                        <view v-for="(item,idx) in pickList" :key="idx"
                              :style="{'color': newIndex == idx ? color : newIndex == idx + 1 || newIndex == idx - 1 ? '#999999' : newIndex == idx + 2 || newIndex == idx - 2 ? '#cdcdcd' : ''}"
                              class="picker-text t-omit">{{mode == 'ad' ? item.name : item.label}}</view>
                    </picker-view-column>
                </picker-view>
                <view class="picker" style="background-color: #fff" v-else-if="pickList.length == 0 && mode == 'ad'"></view>
            </view>
        </view>
        <view class="params-dialog main-center cross-center" v-if="showParams">
            <view class="params">
                <view class="params-title">{{title}}</view>
                <view class="params-list">
                    <view class="params-item" v-for="item in params" :key="item.key">
                        <view class="main-center cross-center">
                            <view class="params-label">{{item.key}}</view>
                            <view class="params-input">
                                <input :type="item.number" v-model="item.value">
                            </view>
                        </view>
                        <view class="params-desc">{{item.desc}}</view>
                    </view>
                </view>
                <view class="params-buttons dir-left-nowrap cross-center">
                    <view class="but cancel">
                        <view @click="showParams=false;">取消</view>
                    </view>
                    <view class="line"></view>
                    <view class="but confirm">
                        <view @click="paramsConfirm">确认</view>
                    </view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";
    import uploadFile from '../../../core/upload.js';

    export default {
        data() {
            return {
                dialog: false,
                level: [
                    {value: 1, label:'一级'},{value: 2, label:'二级'},{value: 3, label:'三级'}
                ],
                iphone_x: false,
                showParams: false,
                parents: null,
                parents_two: null,
                mode: '',
                params: [],
                pickList: [],
                linkType: [
                    {value: 'base', name: '基础'},
                    {value: 'order', name: '订单'},
                    {value: 'marketing', name: '营销'},
                    {value: 'plugin', name: '插件'},
                    {value: 'diy', name: '微页面'},
                ],
                chooseType: 'base',
                title: '',
                linkList: [],
                list: [],
                mch_id: null,
                id: 0,
                type: '',
                newIndex: 0,
                chooseIndex: [0],
                catItem: {
                    level: 1,
                    name: '',
                    sort: 100,
                    pic_url: '',
                    big_pic_url: '',
                    advert_pic: '',
                    status: 1,
                    advert_url:'',
                    advert_open_type: '',
                    advert_params: [],
                    is_show: 1,
                    parent_id: '',
                },
                color: ''
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                adminImg: state => state.mallConfig.__wxapp_img.app_admin
            })
        },
        methods: {
            paramsConfirm() {
                for(let item of this.params) {
                    if(item.is_required && !item.value) {
                        uni.showToast({
                            title: item.desc,
                            icon: 'none',
                            duration: 1000
                        });
                        return false;
                    }
                }
                this.dialog = false;
                this.showParams = false;
                this.catItem.advert_url = this.pickList[this.newIndex].value;
                this.catItem.advert_open_type = this.pickList[this.newIndex].open_type;
                this.catItem.advert_params = this.params;
            },
            toggleType(item) {
                this.chooseType = item;
                this.pickList = [];
                this.newIndex = 0;
                this.chooseIndex[0] = 0;
                setTimeout(()=>{
                    this.pickList = this.linkList[item];
                },200)
            },
            getList(type) {
                this.pickList = [];
                this.mode = type;
                this.newIndex = 0;
                this.chooseIndex[0] = 0;
                if(type == 'one') {
                    let list = [];
                    for(let item of this.list) {
                        if(this.catItem.level == 3) {
                            if(item.children) {
                                list.push(item)
                            }
                        }else {
                            list.push(item)
                        }
                    }
                    for(let index in list) {
                        if(this.parents && this.parents.value == list[index].value) {
                            this.newIndex = +index;
                            this.chooseIndex[0] = +index;
                        }
                        this.pickList.push(list[index])
                    }
                    if(this.pickList.length == 0) {
                        uni.showToast({
                            title: '暂无可用的一级分类',
                            icon: 'none',
                            duration: 1000
                        });
                        this.catItem.level--;
                        return false;
                    }
                    this.$nextTick(() => {
                        this.dialog = true;
                    })
                }
                if(type == 'two') {
                    if(!this.parents) {
                        uni.showToast({
                            title: '请选择归属的一级分类',
                            icon: 'none',
                            duration: 1000
                        });
                        return false;
                    }
                    if(this.parents.children) {
                        for(let index in this.parents.children) {
                            if(this.parents_two && this.parents_two.value == this.parents.children[index].value) {
                                this.newIndex = +index;
                                this.chooseIndex[0] = +index;
                            }
                            this.pickList.push(this.parents.children[index])
                        }
                        if(this.pickList.length == 0) {
                            uni.showToast({
                                title: '暂无二级分类',
                                icon: 'none',
                                duration: 1000
                            });
                            this.catItem.level--;
                            return false;
                        }
                        this.$nextTick(() => {
                            this.dialog = true;
                        })
                    }
                }
                if(type == 'ad') {
                    this.pickList = this.linkList[this.chooseType];
                    for(let index in this.linkList[this.chooseType]) {
                        if(this.catItem.advert_url && this.catItem.advert_url == this.linkList[this.chooseType][index].value) {
                            this.newIndex = +index;
                            this.chooseIndex[0] = +index;
                        }
                    }
                    this.$nextTick(() => {
                        this.dialog = true;
                    })
                }
            },
            submitChoose() {
                if(this.mode == 'one') {
                    this.dialog = false;
                    if(this.parents && this.parents.value != this.pickList[this.newIndex].value) {
                        this.parents_two = null;
                    }
                    this.parents = this.pickList[this.newIndex];
                }else if(this.mode == 'two') {
                    this.dialog = false;
                    this.parents_two = this.pickList[this.newIndex];
                }else if(this.mode == 'ad') {
                    if(this.pickList[this.newIndex].params) {
                        this.params = this.pickList[this.newIndex].params;
                        this.title = this.pickList[this.newIndex].name;
                        this.showParams = true;
                    }else {
                        this.dialog = false;
                        this.catItem.advert_url = this.pickList[this.newIndex].value;
                        this.catItem.advert_open_type = this.pickList[this.newIndex].open_type;
                        this.catItem.advert_params = [];
                    }
                }
            },
            bindChange(e) {
                this.newIndex = +e.detail.value[0]
            },
            getCat() {
                let that = this;
                let url = this.mch_id == 0 ? that.$api.app_admin.cat : that.type == 'mall' ? that.$api.mch.cat : that.$api.mch.mch_cat;
                let para;
                that.$request({
                    url: url,
                    data: {
                        mch_id: that.mch_id
                    }
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.list = response.data.list;
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
            getPickLine() {
                let that = this;
                that.$request({
                    url: that.$api.app_admin.pick_link,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.linkList = response.data.list;
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
            add(name) {
                let that = this;
                this.menu = false;
                // #ifdef MP
                uni.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    success(res) {
                        // tempFilePath可以作为img标签的src属性显示图片
                        const tempFilePaths = res.tempFilePaths;
                        uni.showLoading({
                            mask: true,
                            title: '上传中...'
                        });
                        tempFilePaths.forEach(function (row, index) {
                            let para = {
                                pic_url: '',
                                type: 'img',
                                id: 0
                            };
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
                                uni.hideLoading();
                                let imgInfo = undefined;

                                // #ifndef MP-BAIDU
                                imgInfo = JSON.parse(res.data);
                                // #endif

                                // #ifdef MP-BAIDU
                                imgInfo = res.data;
                                // #endif

                                if (imgInfo.code == 0) {
                                    if(name == 'pic_url') {
                                        that.catItem.pic_url = imgInfo.data.url
                                    }else if(name == 'big_pic_url') {
                                        that.catItem.big_pic_url = imgInfo.data.url
                                    }else if(name == 'advert_pic') {
                                        that.catItem.advert_pic = imgInfo.data.url
                                    }
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
            typeChange(e) {
                if(this.id > 0) return false;
                this.catItem.level = e.target.value;
                if(this.catItem.level == 3 && (this.parents &&!this.parents.children)) {
                    this.parents = null;
                }
            },
            save() {
                let that = this;
                let url = this.mch_id == 0 ? that.$api.app_admin.cat_edit : that.type == 'mall' ? that.$api.mch.cat : that.$api.mch.mch_cat_edit;
                that.catItem.status = that.catItem.status.toString();
                if(that.catItem.level == 3) {
                    if(that.parents_two && that.parents_two.value) {
                        that.catItem.parent_id = that.parents_two.value
                    }else {
                        uni.showToast({
                            title: '请选择归属的二级分类',
                            icon: 'none',
                            duration: 1000
                        });
                        return false;
                    }
                }else if(that.catItem.level == 2) {
                    if(that.parents && that.parents.value) {
                        that.catItem.parent_id = that.parents.value
                    }else {
                        uni.showToast({
                            title: '请选择归属的一级分类',
                            icon: 'none',
                            duration: 1000
                        });
                        return false;
                    }
                }
                if(!that.catItem.name) {
                    uni.showToast({
                        title: '分类名称不能为空',
                        icon: 'none',
                        duration: 1000
                    });
                    return false;
                }
                uni.showLoading({
                    mask: true,
                    title: '提交中...'
                });
                if(that.mch_id > 0) {
                    that.catItem.mch_id = that.mch_id;
                }
                that.catItem.is_show = +that.catItem.is_show;
                that.catItem.status = that.catItem.status.toString();
                that.$request({
                    url: url,
                    data: {
                        form: JSON.stringify(that.catItem),
                        mch_id: that.mch_id
                    },
                    method: 'post'
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code == 0) {
                        uni.showToast({
                            title: response.msg,
                            duration: 1000
                        });
                        setTimeout(()=>{
                            uni.navigateBack();
                        },1000)
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                    that.$hideLoading();
                });
            },
            getDetail() {
                let that = this;
                let url = this.mch_id == 0 ? that.$api.app_admin.cat_edit : that.type == 'mall' ? that.$api.mch.cat : that.$api.mch.mch_cat_edit;
                let para;
                that.$request({
                    url: url,
                    data: {
                        id: that.id,
                        mch_id: that.mch_id
                    }
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.catItem = response.data.detail;
                        that.catItem.level = response.data.detail.parents.length + 1;
                        if(that.catItem.level > 1) {
                            for(let item of that.catItem.parents) {
                                if(item.parent_id == 0) {
                                    that.parents = {
                                        label: item.name,
                                        value: item.id
                                    };
                                }else {
                                    that.parents_two = {
                                        label: item.name,
                                        value: item.id
                                    };
                                }
                            }
                        }
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

        onLoad(options) {
            let that = this;
            this.id = options.id ? options.id : 0;
            this.type = options.type ? options.type : '';
            this.mch_id = options.mch_id ? options.mch_id : 0;
            this.color = this.mch_id > 0 ? '#ff4544' : '#446dfd';
            uni.setNavigationBarTitle({
                title: this.id > 0 ? '编辑分类' : '新增分类'
            });
            if(this.mch_id == 0) that.getPickLine();
            if(this.id > 0) {
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                this.getDetail();
            }
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
            that.getCat();
        }
    }
</script>

<style scoped lang="scss">
    .cat-info {
        background-color: #fff;
        padding: 0 #{24rpx};
        .cat-item:first-of-type {
            border-top: 0;
        }
        .select {
            width: 100%;
        }
        .form-label {
            padding: 30rpx 0;
            width: #{148rpx};
            text-align: right;
            margin-right: 16rpx;
            flex-shrink: 0;
            .sub-label {
                font-size: 24rpx;
                color: #999999;
            }
        }
        .price-input {
            width: 100%;
            input {
                width: 100%;
            }
        }
        .cat-item {
            border-top: #{1rpx} solid #e2e2e2;
            min-height: #{88rpx};
            font-size: #{28rpx};
            color: #353535;
            .to-more {
                height: #{24rpx};
                width: #{12rpx};
                margin-left: #{10rpx};
            }
            .cat-pic {
                width: 80rpx;
                height: 80rpx;
                margin-right: 28rpx;
                &.big {
                    width: 265rpx;
                }
                &.advert {
                    width: 218rpx;
                }
            }
        }
    }

    .cat {
        background-color: #fff;
        margin-bottom: #{20rpx};
        .show-more {
            width: 45rpx;
            height: 88rpx;
            image {
                height: #{22rpx};
                width: #{12rpx};
            }
        }
        .cat-item {
            height: #{88rpx};
            line-height: #{88rpx};
            font-size: #{28rpx};
            color: #353535;
            &.cat-left {
                margin-left: 16rpx;
            }
        }
        .cat-menu {
            margin-right: 16rpx;
            image {
                height: #{40rpx};
                width: #{40rpx};
                margin-left: 10rpx;
            }
        }
    }
    .add {
        position: fixed;
        bottom: 0;
        left: 0;
        height: #{120rpx};
        width: 100%;
        z-index: 15;
        background-color: #fff;
        &.iphone_x {
            height: #{170rpx};
            padding-bottom: #{50rpx};
        }
        view {
            width: #{702rpx};
            line-height: #{80rpx};
            height: #{80rpx};
            margin: #{20rpx} auto;
            border-radius: #{40rpx};
            background-color: #446dfd;
            color: #fff;
            font-size: #{32rpx};
            text-align: center;
        }
    }
    .placeholder {
        height: #{120rpx};
        &.iphone_x {
            height: #{170rpx};
        }
    }
    .params-dialog {
        position: fixed;
        height: 100%;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 22;
        background-color: rgba(0, 0, 0, .3);
        .params {
            width: #{620rpx};
            background-color: white;
            border-radius: #{16rpx};
            margin-top: #{-200rpx};
            .params-title {
                margin: #{40rpx} 0;
                font-size: #{32rpx};
                color: #353535;
                text-align: center;
            }
            .params-list {
                max-height: #{480rpx};
                overflow-y: auto;
                .params-item {
                    margin-bottom: #{20rpx};
                    .params-label {
                        height:#{80rpx};
                        line-height: #{80rpx};
                        margin-right: #{20rpx};
                    }
                    .params-input {
                        height:#{80rpx};
                        line-height: #{80rpx};
                        background-color: #f7f7f7;
                        border-radius: #{8rpx};
                        width: #{320rpx};
                        padding: #{0 28rpx};
                        box-sizing: border-box;
                        text-align: left;
                        input {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .params-desc {
                        margin-top: #{10rpx};
                        padding: 0 #{24rpx};
                        color: #999;
                        font-size: #{28rpx};
                        text-align: center;
                    }
                }
            }
            .params-buttons {
                width: #{620rpx};
                height: #{88rpx};
                border-top: #{1rpx} solid #e2e2e2;
                .line {
                    width: #{2rpx};
                    height: #{32rpx};
                    background-color: #e2e2e2;
                }
                .but {
                    width: #{309rpx};
                    height: #{88rpx};
                    line-height: #{88rpx};
                    text-align: center;
                    font-size: #{32rpx};
                }
                .cancel {
                    color: #{32rpx};
                }
                .confirm {
                    color: #446dfd;
                }
            }
        }
    }
    .dialog {
        position: fixed;
        height: 100%;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 20;
        background-color: rgba(0, 0, 0, .3);
        .picker-list {
            background-color: #fff;
            padding-top: #{20rpx};
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            .picker-type {
                height: 84rpx;
                border-bottom: 2rpx solid #e2e2e2;
                padding: 0 24rpx;
                .picker-type-item {
                    height: 82rpx;
                    line-height: 82rpx;
                    text-align: center;
                    font-size: 28rpx;
                    &.active {
                        border-bottom: 3rpx solid;
                    }
                }
            }
            .picker-header {
                padding: 0 #{24rpx};
                font-size: #{32rpx};
            }
            .picker {
                width: 100%;
                height: #{440rpx};
                color: #999999;
            }
            .picker-text {
                height: 34px;
                line-height: 34px;
                font-size: #{32rpx};
                padding-left: #{24rpx};
                text-align: left;
            }
        }
    }
</style>