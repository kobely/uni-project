<template>
    <view>
        <u-mask v-if="modal" :show="mallStatus.is_open == 2" zIndex="3000" :maskClickAble="false" :zoom="false">
            <view style="height: 100%;width: 100%" class="main-center cross-center">
                <view class="open-dialog">
                    <view class="open-dialog-title">商家已打烊</view>
                    <view class="open-dialog-content">
                        <view v-if="list.length > 0 && list != '商城'">{{list}}已经打烊</view>
                        <view v-if="!list">您访问的商家已经打烊</view>
                        <view v-if="mallStatus.auto_open_text.length > 0">{{mallStatus.auto_open_text}}</view>
                    </view>
                    <view @click="toIndex" class="dialog-button" :style="{'color':getTheme.color}">继续浏览</view>
                </view>
            </view>
        </u-mask>
        <view v-else>
            <view class="dir-left-nowrap cross-center close-tip" v-if="mallStatus.is_open == 2">
                <image src="/static/image/icon/be-close.png"></image>
                <view class="dir-top-nowrap main-center">
                    <view>商家已打烊</view>
                    <view class="close-content" v-if="mallStatus.auto_open_text.length > 0">{{mallStatus.auto_open_text}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>

	import {mapState, mapGetters} from 'vuex';
    import uMask from "../u-mask/u-mask.vue";
	
    export default {
        name: "app-close",
        components:{
            uMask
        },
	    props: {
            modal: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            toBack: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            mch_id: {
                type: [Number, String],
                default() {
                    return 0;
                }
            },
            mch_list: {
                type: String,
                default() {
                    return ''
                }
            }
	    },
        data() {
            return {
                mallStatus: {
                    is_open: 0,
                    auto_open_text: ''
                },
                isMall: true,
                list: ''
            }
        },
        created() {
            let para = {};
            let mch_list = ''
            if(this.mch_list) {
                mch_list = this.mch_list;
                if(mch_list.length > 0) {
                    para.mch_id_list = mch_list;
                    if(mch_list.indexOf(0) == -1) {
                        this.isMall = false;
                    }
                }
            }
            if(this.mch_id > 0) {
                para.mch_id_list = JSON.stringify([this.mch_id]);
                this.isMall = false;
            }
            this.$request({
                url: this.$api.index.status,
                data: para
            }).then(response => {
                console.log(para)
                let mallStatus = response.data;
                if(!this.isMall) {
                    response.data.shift();
                }
                this.mallStatus = response.data[0]
                if(this.mch_id > 0) {
                    for(let item of response.data) {
                        if(item.mch_id == this.mch_id) {
                            this.mallStatus = item
                        }
                    }
                }
                if(mch_list.length > 0) {
                    this.list = '';
                    for(let item of response.data) {
                        if(item.is_open == 2) {
                            if(!this.mallStatus.auto_open_text) {
                                this.mallStatus.auto_open_text = item.auto_open_text;
                            }
                            this.mallStatus.is_open = item.is_open;
                            if(this.list.length > 0) {
                                this.list += '、'
                            }
                            this.list += item.name
                        }
                    }
                    this.$emit('update', this.mallStatus)
                }else {
                    this.$emit('update', this.mallStatus)
                }
            })
        },
	    computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                mall: state => state.mallConfig.mall,
                userInfo: state => state.user.info,
            })
	    },
        methods: {
            toIndex() {
                if(this.toBack) {
                    uni.navigateBack();
                }else {
                    uni.redirectTo({
                        url: '/pages/index/index'
                    })
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .close-tip {
        position: fixed;
        bottom: 0;
        left: 0;
        height: 130rpx;
        width: 100%;
        z-index: 20;
        font-size: 30rpx;
        color: #353535;
        background-color: #fff7d7;
        image {
            width: 70rpx;
            height: 70rpx;
            margin: 0 24rpx;
        }
        .close-content {
            padding-top: 10rpx;
            font-size: 24rpx;
            color: #999999;
        }
    }
    .open-dialog {
        width: 620rpx;
        border-radius: 16rpx;
        background-color: #fff;
        position: relative;
        padding-top: 40rpx;
        padding-bottom: 105rpx;
        font-size: 32rpx;
        color: #353535;
        text-align: center;
        .open-dialog-content {
            padding: 25rpx 0;
            font-size: 26rpx;
            color: #666666;
            view {
                margin: 5rpx 0;
            }
        }
        .dialog-button {
            font-size: 30rpx;
            position: absolute;
            bottom: 0;
            left: 0;
            border-top: 2rpx solid #e2e2e2;
            height: 90rpx;
            line-height: 90rpx;
            width: 100%;
        }
    }
</style>