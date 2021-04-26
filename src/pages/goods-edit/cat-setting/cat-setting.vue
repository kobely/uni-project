<template>
    <app-layout>
        <view class='add-cat'>
            <view v-if="mch_id || mch_id == 0" @click="editCat" class='add-cat-btn main-center' :style="{'border-color': color,'color': color}">
                <image :src="mch_id == 0 ? './../image/add.png': './../image/mch-add.png'"></image>
                <view>新增分类</view>
            </view>
        </view>
        <view>
            <view class="cat" v-for="item in list" :key="item.value">
                <view class="main-between cat-item" @click="toggle(item)">
                    <view class="dir-left-nowrap cat-name">
                        <view v-if="item.children" class="show-more cross-center main-center">
                            <image v-if="!item.show" src='/static/image/icon/right.png'></image>
                            <image class="bottom" v-else src='/static/image/icon/bottom.png'></image>
                        </view>
                        <view :class="[`${item.children ? '' : 'cat-left'}`]">{{item.label}}</view>
                    </view>
                    <view class="cat-menu dir-left-nowrap cross-center">
                        <image @click.stop='editCat(item)' src='./../image/edit.png'></image>
                        <image @click.stop='pop(item.value)' src='./../image/low.png'></image>
                    </view>
                </view>
                <view v-for="sec in item.children" :key="sec.value" v-if="item.children && item.show">
                    <view class="main-between cat-item sec-cat" @click.stop="toggle(sec)">
                        <view class="show-more"></view>
                        <view class="dir-left-nowrap cat-name">
                            <view v-if="sec.children" class="show-more cross-center main-center">
                                <image v-if="!sec.show" src='/static/image/icon/right.png'></image>
                                <image class="bottom" v-else src='/static/image/icon/bottom.png'></image>
                            </view>
                            <view :class="[`${sec.children ? '' : 'cat-left'}`]">{{sec.label}}</view>
                        </view>
                        <view class="cat-menu dir-left-nowrap cross-center">
                            <image @click.stop='editCat(sec)' src='./../image/edit.png'></image>
                            <image @click.stop='pop(sec.value)' src='./../image/low.png'></image>
                        </view>
                    </view>
                    <view v-for="third in sec.children" :key="third.value" v-if="sec.children && sec.show">
                        <view class="main-between cat-item sec-cat">
                            <view class="show-more"></view>
                            <view class="dir-left-nowrap cat-name">
                                <view class="show-more"></view>
                                <view>{{third.label}}</view>
                            </view>
                            <view class="cat-menu dir-left-nowrap cross-center">
                                <image @click.stop='editCat(third)' src='./../image/edit.png'></image>
                                <image @click.stop='pop(third.value)' src='./../image/low.png'></image>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class='dialog' v-if="value > -1">
                <view class='dialog-item'>
                    <view class='dialog-title'>确定删除这个分类吗？</view>
                    <view class="main-center btn-area">
                        <view class="submit-btn" @click='close'>取消</view>
                        <view class="line"></view>
                        <view class="submit-btn be-submit" @click='toDelete'>删除</view>
                    </view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        data() {
            return {
                mch_id: null,
                type: '',
                first: true,
                value: -1,
                color: '',
                list: [],
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                adminImg: state => state.mallConfig.__wxapp_img.app_admin
            })
        },
        methods: {
            editCat(item) {
                let id = item.value ? item.value : null;
                uni.navigateTo({
                    url: `/pages/goods-edit/cat-edit/cat-edit?mch_id=`+this.mch_id+`&type=`+this.type+`&id=`+ id
                })
            },
            toggle(item) {
                item.show = !item.show;
                this.$forceUpdate();
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
                    that.first = false;
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.list = response.data.list;
                        for(let item of that.list) {
                            item.show = false;
                            if(item.children) {
                                for(let children of item.children) {
                                    children.show = false;
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
                    uni.hideLoading();
                });
            },
            pop(value) {
                this.value = value;
            },
            close() {
                this.value = -1;
            },
            toDelete() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '删除中...',
                });
                let url = this.mch_id == 0 ? that.$api.app_admin.cat_destroy : that.$api.mch.mch_cat_destroy;
                let para;
                that.$request({
                    url: url,
                    data: {
                        id: this.value,
                        mch_id: that.mch_id
                    },
                    method: 'post'
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        this.value = -1;
                        this.getCat();
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
        },

        onShow() {
            if(!this.first) {
                uni.showLoading({
                    mask: true,
                });
                this.getCat();
            }
        },

        onLoad(options) {
            let that = this;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.type = options.type ? options.type : '';
            this.mch_id = options.mch_id ? options.mch_id : 0;
            this.color = this.mch_id > 0 ? '#ff4544' : '#446dfd';
            that.getCat();
        }
    }
</script>

<style scoped lang="scss">
    .cat {
        background-color: #fff;
        margin-bottom: #{20rpx};
        .cat-item {
            height: #{88rpx};
            line-height: #{88rpx};
            font-size: #{28rpx};
            color: #353535;
            >view {
                flex-shrink: 0;
            }
            .show-more {
                width: 45rpx;
                height: 88rpx;
                image {
                    height: #{22rpx};
                    width: #{12rpx};
                }
                .bottom {
                    width: 22rpx;
                    height: 12rpx;
                }
            }
            .cat-name {
                flex-grow: 1;
                .cat-left {
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
            &.sec-cat {
                .cat-name {
                    border-top: 2rpx solid #e2e2e2;
                }
                .cat-menu {
                    border-top: 2rpx solid #e2e2e2;
                }
            }
        }
    }
    .add-cat {
        height: #{120rpx};
        background-color: #fff;
        margin-bottom: #{20rpx};
        padding-top: #{24rpx};
        .add-cat-btn {
            height: #{72rpx};
            width: #{320rpx};
            border-radius: #{36rpx};
            border: #{1rpx} solid #446dfd;
            margin: 0 auto;
            color: #446dfd;
            font-size: #{26rpx};
            line-height: #{72rpx};
            image {
                height: #{28rpx};
                width: #{28rpx};
                margin-right: #{12rpx};
                margin-top: #{22rpx};
            }
        }
    }
    .dialog {
        position: fixed;
        height: 100%;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, .3);
        .dialog-item {
            padding-top: #{20rpx};
            position: fixed;
            top: 25%;
            left: 0;
            right: 0;
            margin: 0 auto;
            width: #{620rpx};
            border-radius: #{16rpx};
            background-color: #fff;
            text-align: center;
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
                color: #446dfd;
            }
        }
        .dialog-title {
            text-align: center;
            font-size: 32rpx;
            color: #353535;
            margin: #{66rpx} 0 #{76rpx};
        }
    }
</style>