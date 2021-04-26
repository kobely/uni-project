<template>
    <app-layout>
        <view v-if="isShow">
            <!--申请退款-->
            <view class="box" v-if="orderDetail.cancel_status == 0">
                <view class="goods-info">
                    <view :key="index" v-for="(item, index) in orderDetail.detail">
                        <app-jump-button :url="item.goods_info.page_url">
                            <app-order-goods-info :goods="item.goods_info" :is-last-one="orderDetail.detail.length - 1 !== index" :plugin-data="orderDetail.plugin_data" :plugin-index="index">
                            </app-order-goods-info>
                        </app-jump-button>
                    </view>
                </view>
                <view class="content">
                    <view class="content-item">
                        <span class="label">
                            退款原因
                        </span>
                        <view class="select-box" @click="cause.visible = true">
                            <span class="select-label" :class="{'active': form.cause, 'no-active': !form.cause}">
                                {{form.cause ? cause.list[cause.index] : '请选择'}}
                            </span>
                            <image class="arrow-right" src="/static/image/icon/arrow-right.png">
                            </image>
                        </view>
                    </view>
                    <view class="content-item">
                        <span class="label">
                            退款金额
                        </span>
                        <input :placeholder="`最多可退款${orderDetail.refund_price_text}`" class="text price-text" disabled="" placeholder-style="color:#999999;font-size:28rpx;" v-model="orderDetail.refund_price_text">
                        </input>
                    </view>
                    <view class="content-item">
                        <span class="label">
                            备注信息
                        </span>
                        <input class="text" placeholder="最多可填200个字" placeholder-style="color:#999999;font-size:28rpx;" v-model="form.remark">
                    </view>
                    <view class="content-item">
                        <span class="label">
                            联系方式
                        </span>
                        <input class="text" placeholder="请填写联系方式，便于卖家联系你 " placeholder-style="color:#999999;font-size:28rpx;" type="number" v-model="form.mobile">
                    </view>
                </view>
                <view class="upload-box">
                    <view class="label">
                        上传凭证
                    </view>
                    <app-upload-image :max-num="maxNum" @image-event="imageEvent" background-color="#fff">
                    </app-upload-image>
                </view>
            </view>
            <!--申请后展示的代码-->
            <view v-else="">
                <app-order-banner title="待商家审核">
                </app-order-banner>
                <view class="platform">
                    {{orderDetail.platform}}
                </view>
                <view class="goods-box">
                    <view :key="index" v-for="(item, index) in orderDetail.detail">
                        <app-jump-button :url="item.goods_info.page_url">
                            <app-order-goods-info :goods="item.goods_info" style="width:100%;">
                            </app-order-goods-info>
                        </app-jump-button>
                    </view>
                </view>
                <view class="preferential-box dir-top-nowrap">
                    <view class="dir-left-nowrap item cross-center" v-if="orderDetail.cancel_data.cause">
                        <view class="label box-grow-0">
                            退款原因:
                        </view>
                        <view class="t-small-color box-grow-1">
                            {{orderDetail.cancel_data.cause}}
                        </view>
                    </view>
                    <view class="dir-left-nowrap item cross-center">
                        <view class="label box-grow-0">
                            退款金额:
                        </view>
                        <view class="t-small-color box-grow-1 total_pay_price">
                            ￥{{orderDetail.total_pay_price}}
                        </view>
                    </view>
                    <view class="dir-left-nowrap item cross-center" v-if="orderDetail.cancel_data.remark">
                        <view class="label box-grow-0">
                            备注信息:
                        </view>
                        <view class="t-small-color box-grow-1 text">
                            {{orderDetail.cancel_data.remark}}
                        </view>
                    </view>
                    <view class="dir-left-nowrap item cross-center" v-if="orderDetail.cancel_data.mobile">
                        <view class="label box-grow-0">
                            联系方式:
                        </view>
                        <view class="t-small-color box-grow-1 text">
                            {{orderDetail.cancel_data.mobile}}
                        </view>
                    </view>
                    <view class="dir-top-nowrap" v-if="orderDetail.cancel_data.image_list.length > 0">
                        <view class="image-label">
                            图片凭证:
                        </view>
                        <view class="flex-wrap">
                            <image @click="previewImage(index)" :key="index" :src="item" class="picture" mode="aspectFill" v-for="(item, index) in orderDetail.cancel_data.image_list">
                            </image>
                        </view>
                    </view>
                </view>
            </view>
            <view style="height: 80rpx;margin-top: 80rpx;">
            </view>
            <view class="btn-box">
                <view @click="cancelApply" class="btn main-center cross-center" v-if="orderDetail.cancel_status == 2">
                    撤销申请
                </view>
                <view @click="formSubmit" class="btn main-center cross-center" v-else="">
                    提交
                </view>
            </view>
            <app-select title="退款原因" :is-show="cause.visible" :value="cause.index" :list="cause.list" @confirm="bindPickerChange"></app-select>
        </view>
    </app-layout>
</template>
<script>
import appOrderGoodsInfo from '../../../components/page-component/app-order-goods-info/app-order-goods-info.vue';
import appUploadImage from "../../../components/basic-component/app-upload-image/app-upload-image.vue";
import appOrderBanner from '../../../components/page-component/app-order-banner/app-order-banner.vue';
import appSelect from "../components/app-select";

export default {
    components: {
        appOrderGoodsInfo,
        appUploadImage,
        appOrderBanner,
        'app-select': appSelect,
    },
    data() {
        return {
            orderDetail: {},
            form: {
                image_list: [],
                remark: '',
                mobile: '',
                cause: '',
            },
            maxNum: 6,
            cause: {
                list: [],
                visible: false,
                index: 1,
            },
            isShow: false,
        }
    },
    methods: {
        getOrderDetail() {
            let self = this;
            self.$showLoading();
            self.$request({
                url: self.$api.order.detail,
                data: {
                    id: self.order_id,
                }
            }).then(response => {
                self.$hideLoading();
                self.isShow = true;
                if (response.code === 0) {
                    self.orderDetail = response.data.detail;
                    self.setPageTitle();
                } else {
                    uni.showModal({
                        title: '',
                        content: response.msg,
                        showCancel: false,
                    });
                }
            }).catch(() => {
                self.$hideLoading();
            });
        },
        formSubmit() {
            let self = this;
            if (!self.form.cause) {
                uni.showModal({
                    title: '',
                    content: '请选择退款原因',
                    showCancel: false,
                });
                return;
            }
            uni.showModal({
                title: '提示',
                content: '确认申请退款？',
                success: function(res) {
                    if (res.confirm) {
                        self.$subscribe(self.orderDetail.template_message_list).then(response => {
                            self.cancelAction();
                        }).catch(res => {
                            self.cancelAction();
                        });
                    }
                }
            });
        },
        imageEvent(e) {
            this.form.image_list = e.imageList;
        },
        bindPickerChange(e) {
            if (!e.is_modal_confirm) {
                this.cause.index = e.index;
                this.form.cause = this.cause.list[this.cause.index];
            }
            this.cause.visible = false;
        },
        cancelAction() {
            let self = this;
            uni.showLoading({ title: '取消中' });
            self.$request({
                url: self.$api.order.cancel,
                data: {
                    id: self.orderDetail.id,
                    cancel_data: JSON.stringify(self.form)
                }
            }).then(response => {
                uni.hideLoading();
                if (response.code === 0) {
                    if (self.sign === 'advance') {
                        self.$request({
                            url: self.$api.advance.order_detail,
                            method: 'get',
                            data: {
                                id: self.order_id,
                            }
                        }).then(response => {
                            if (response.code === 0) {
                                self.orderDetail = response.data.detail;
                            } else {
                                uni.showModal({
                                    title: '',
                                    content: response.msg,
                                    showCancel: false,
                                });
                            }
                        })
                    } else {
                        self.getOrderDetail();
                    }
                } else {
                    uni.showModal({
                        title: '',
                        content: response.msg,
                        showCancel: false,
                    });
                }
            }).catch(() => {
                uni.hideLoading();
            });
        },
        cancelCauseList() {
            let self = this;
            self.$request({
                url: self.$api.order.cancel_cause_list,
            }).then(response => {
                if (response.code === 0) {
                    self.cause.list = response.data.list;
                } else {
                    uni.showModal({
                        title: '',
                        content: response.msg,
                        showCancel: false,
                    });
                }
            }).catch(() => {
                self.$hideLoading();
            });
        },
        cancelApply() {
            let self = this;
            uni.showLoading({ title: '取消中' });
            self.$request({
                url: self.$api.order.cancel_apply,
                method: "post",
                data: {
                    id: self.order_id
                }
            }).then(response => {
                uni.hideLoading();
                if (response.code === 0) {
                    uni.navigateBack();
                } else {
                    uni.showModal({
                        title: '',
                        content: response.msg,
                        showCancel: false,
                    });
                }
            }).catch(() => {
                uni.hideLoading();
            });
        },
        // 设置页面标题
        setPageTitle() {
            let title = '申请退款';
            if (this.orderDetail.cancel_status == 2) {
                title = '订单退款'
            }

            uni.setNavigationBarTitle({
                title: title
            });
        },
        // 图片预览
        previewImage(index) {
            let imageList = this.orderDetail.cancel_data.image_list;
            uni.previewImage({
                current: imageList[index],
                urls: imageList
            })
        },
    },
    onLoad(options) { this.$commonLoad.onload(options);
        this.order_id = options.id;
        this.getOrderDetail();
        this.cancelCauseList();
    }
}
</script>
<style lang="scss" scoped="">
.box {
    padding: 24#{rpx};
    width: 100%;

    .goods-info {
        background: #ffffff;
        border-radius: 16#{rpx};
        padding: 28#{rpx};
    }

    .content {
        margin-top: 24#{rpx};
        padding: 0 28#{rpx};
        background: #ffffff;
        border-radius: 16#{rpx};
        display: flex;
        flex-direction: column;

        .content-item {
            display: flex;
            height: 88#{rpx};
            align-items: center;
            border-bottom: 1#{rpx} solid #e2e2e2;

            .label {
                font-size: 28#{rpx};
                color: #353535;
                width: 152#{rpx};
            }

            .text {
                color: #353535;
                font-size: 28#{rpx};
                flex-grow: 1;
            }

            .price-text {
                color: #ff4544;
            }
        }

        .content-item:last-child {
            border-bottom: 0;
        }

        .select-box {
            text-align: right;
            width: 100%;

            .no-active {
                color: #999999;
            }

            .active {
                color: #353535;
            }

            .select-label {
                font-size: 28#{rpx};
            }

            .arrow-right {
                width: 12#{rpx};
                height: 22#{rpx};
                margin-left: 16#{rpx};
            }
        }
    }

    .upload-box {
        background: #ffffff;
        border-radius: 16#{rpx};
        padding: 28#{rpx};
        display: flex;
        flex-direction: column;
        margin-top: 24#{rpx};

        .label {
            font-size: 28#{rpx};
            color: #353535;
            margin-bottom: 20#{rpx};
        }
    }
}

.btn-box {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24#{rpx};
    background: #f7f7f7;
    z-index: 999;

    .btn {
        border-radius: 40#{rpx};
        height: 80#{rpx};
        background: #ff4544;
        padding: 24#{rpx} 0;
        color: #ffffff;
        font-size: 32#{rpx};
    }
}

.shade-box {
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;

    .list {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: #ffffff;
        border-top-left-radius: 16#{rpx};
        border-top-right-radius: 16#{rpx};
        overflow: hidden;

        .title {
            height: 100#{rpx};
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 1#{rpx} solid #e2e2e2;
        }
    }
}

.platform {
    background: #fff;
    border-bottom: 1#{rpx} solid #e2e2e2;
    padding: 20#{rpx} 20#{rpx};
    margin-top: 20#{rpx};
}

.goods-box {
    background: #fff;
    padding: 32#{rpx} 24#{rpx};
}

.preferential-box {
    background: #fff;
    padding: 32#{rpx} 24#{rpx};
    margin-top: 20#{rpx};

    .item {
        margin: 12#{rpx} 15#{rpx} 12#{rpx} 0;
        align-items: flex-start;
    }

    .picture {
        width: #{160rpx};
        height:#{160rpx};
        margin-right: #{14rpx};
        margin-bottom:#{14rpx};
    }

    .label {
        margin-right: 15#{rpx};
    }

    .image-label {
        margin: 12#{rpx} 0;
    }

    .text {
        word-break: break-all;
    }

    .total_pay_price {
        color: $uni-important-color-red;
    }
}
</style>