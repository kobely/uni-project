<template>
    <app-layout>
        <view>
            <view class="input-list">
                <view class="dir-left-nowrap input-item">
                    <view class='label'>快递公司</view>
                    <view @click='toPick' width="width:30%;" class="dir-right-nowrap cross-center">
                        <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                        <text>{{express}}</text>
                    </view>
                </view>
                <view class="dir-left-nowrap input-item" style='position:relative'>
                    <view class='label'>快递单号</view>
                    <input v-model="express_no"></input>
                    <text v-if="id > 0" @click="getExpressNo" class='get'>获取面单</text>
                </view>
                <view class="dir-left-nowrap input-item">
                    <view class='label'>邮政编码</view>
                    <input v-model="code"></input>
                </view>
                <view class="dir-left-nowrap input-item">
                    <view class='label'>商家留言</view>
                    <input v-model="words"></input>
                </view>
            </view>
            <button @click="saveAddress" class='address-bottom'>确认发货</button>
        </view>
        <!-- 选择列表 -->
        <view class="dialog" v-if="dialog">
            <view class="picker-list">
                <view class="main-between picker-header">
                    <view @click="toPick(2)">取消</view>
                    <view @click="toPick(1)">确定</view>
                </view>
                <picker-view indicator-style="height: 36px;" class="picker" :value="[value]" @change="bindChange">
                    <picker-view-column>
                        <view v-for="item in list" :key="item.id" class="pick-view">{{item.name}}</view>
                    </picker-view-column>
                </picker-view>
            </view>
        </view>
    </app-layout>
</template>

<script>

    import { mapState } from "vuex";

    export default {
        data() {
            return {
                express_no: '',
                express: '',
                customer_name: '',
                code: '',
                words: '',
                list: [],
                dialog: false,
                id: '',
                value: 0,
                is_send: 0,
                mch_id: 0,
                express_id: 0,
                order_refund_id: 0,
                order_detail_ids: [],
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info
            })
        },
        methods: {
            bindChange(e) {
                let index = +e.detail.value[0]
                this.express = this.list[index].name
            },
            toPick(type) {
                let that = this;
                if(type == 1) {
                    that.customer_name = '';
                    for(let index in that.list) {
                        if (that.list[index].name == that.express) {
                            that.value = +index;
                        }
                    }
                }
                that.express = that.list[that.value].name
                that.dialog = !that.dialog;
            },
            getExpressNo() {
                let that = this;
                uni.showLoading({
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.mch.order_print,
                    data: {
                        express: that.express,
                        code: that.code,
                        mch_id: that.mch_id,
                        order_id: that.id,
                        order_detail_ids: JSON.stringify(that.order_detail_ids)
                    },
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.express_no = response.data.Order.LogisticCode;
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
            getExpress() {
                let that = this;
                that.$showLoading({
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.mch.express_list
                }).then(response=>{
                    if(response.code == 0) {
                        that.list = response.data.list;
                        that.getList();
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
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.mch.order_detail,
                    data: {
                        id: that.id,
                        mch_id: that.mch_id,
                    }
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        let detail = response.data.detail.detailExpress[0];
                        if(detail != undefined) {
                            that.express = detail.express ? detail.express : response.data.detail.last_express ? response.data.detail.last_express : that.list[0].name;
                            that.express_no = detail.express_no ? detail.express_no : '';
                            that.customer_name = detail.customer_name ? detail.customer_name : '';
                            that.express_id = detail.id ? detail.id : '';
                            that.code = detail.code > 0 ? detail.code : '';
                            that.words = detail.words ? detail.words : '';
                        }else {
                            that.express = response.data.detail.last_express ? response.data.detail.last_express : that.list[0].name;
                        }
                        that.order_detail_ids = response.data.detail.detail.map(item => {
                            return item['id']
                        });
                        for(let index in that.list) {
                            if (that.list[index].name == that.express) {
                                that.value = +index;
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
            saveAddress: function (e) {
                let that = this;
                if (!that.express_no) {
                    uni.showToast({
                        title: '快递单号不得为空',
                        icon: 'none',
                        duration: 1000,
                    });
                    return;
                }
                uni.showLoading({
                    title: '提交中...'
                });
                if(that.id > 0) {
                    let para ={
                        is_express: 1,
                        order_id: that.id,
                        express_no: that.express_no,
                        mch_id: that.mch_id,
                        express: that.express,
                        code: that.code,
                        customer_name: that.customer_name,
                        words: that.words,
                    }
                    if(that.express_id) {
                        para.express_id = that.express_id
                    }
                    that.$request({
                        url: that.$api.mch.order_send,
                        method: "POST",
                        data: para
                    }).then(response => {
                        uni.hideLoading();
                        if (response.code == 0) {
                            let msg = response.msg;
                            if(that.is_send == 2) {
                                msg = '修改成功'
                            }
                            uni.showToast({
                                title: msg,
                                duration: 1000,
                                type: 'success',
                                mask: false
                            });
                            setTimeout(function(){
                                uni.navigateBack();
                            },500)
                        } else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    }).catch(response => {
                        uni.hideLoading();
                        uni.showToast({
                            title: response,
                            icon: 'none',
                            duration: 1000
                        });
                    });   
                }else {
                    let para ={
                        is_express: 1,
                        type: 2,
                        is_agree: 1,
                        mch_id: that.mch_id,
                        order_refund_id: that.order_refund_id,
                        express_no: that.express_no,
                        express: that.express,
                        merchant_remark: that.words,
                    }
                    if(para.express_id) {
                        para.express_id = that.express_id
                    }
                    that.$request({
                        url: that.$api.mch.refund_handle,
                        method: "POST",
                        data: para
                    }).then(response => {
                        uni.hideLoading();
                        if (response.code == 0) {
                            let msg = response.msg;
                            uni.showToast({
                                title: msg,
                                duration: 1000,
                                type: 'success',
                                mask: false
                            });
                            setTimeout(function(){
                                uni.navigateBack();
                            },500)
                        } else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    }).catch(response => {
                        uni.hideLoading();
                        uni.showToast({
                            title: response,
                            icon: 'none',
                            duration: 1000
                        });
                    });
                }

            },
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            if (options.id > 0) {
                that.id = options.id
            }
            that.mch_id = options.mch_id;
            if (options.order_refund_id > 0) {
                that.order_refund_id = options.order_refund_id
            }
            that.getExpress();
            if (options.is_send > 0) {
                that.is_send = options.is_send
            }
        }
    }
</script>

<style scoped lang="scss">
    .picker {
        width: 100%;
        height: #{440rpx}
    }
    
    .pick-view {
        line-height: #{72rpx};
        text-align:center;
        color:#ff4544;
        font-size: #{32rpx};
    }

    .address-bottom {
        width: #{702rpx};
        height: #{80rpx};
        line-height: #{80rpx};
        border-radius: #{40rpx};
        padding: 0;
        text-align: center;
        margin: #{40rpx} auto;
        color: #fff;
        z-index: 7;
        font-size: #{28rpx};
        background-color: #ff4544;
    }

    .to-more {
        height: #{24rpx};
        width: #{12rpx};
        margin-left: #{10rpx};
    }

    .input-list {
        background-color: #fff;
        padding-left: #{30rpx};
    }

    .input-item {
        border-top: #{1rpx} solid #eee;
        padding: #{24rpx} #{30rpx} #{24rpx} 0;
        height: #{96rpx};
        font-size: #{28rpx};
        color: #495060;
    }

    .input-item:first-of-type {
        border-top: 0;
    }

    .input-item .label {
        width: #{200rpx};
        height: #{48rpx};
        line-height: #{48rpx};
    }

    .input-item input {
        //width: #{550rpx};
        height: #{48rpx};
        line-height: #{48rpx};
        font-size: #{28rpx};
    }


    .input-item view {
        width: #{550rpx};
        height: #{48rpx};
        line-height: #{48rpx};
        font-size: #{28rpx};
    }

    .dialog {
        position: fixed;
        height: 100%;
        width: 100%;
        bottom: #{96rpx};
        left: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, .3);
    }

    .picker-list {
        background-color: #fff;
        padding-top: #{20rpx};
        position: fixed;
        bottom: #{96rpx};
        left: 0;
        width: 100%;
    }

    .picker-header {
        padding: 0 #{24rpx};
        color: #ff4544;
        font-size: #{32rpx};
    }

    .get {
        width: #{160rpx};
        height: #{48rpx};
        line-height: #{48rpx};
        text-align: center;
        border: #{1rpx} solid #ff4544;
        border-radius: #{24rpx};
        position: absolute;
        top: #{20rpx};
        right: #{24rpx};
        display: block;
        color: #ff4544;
    }
</style>