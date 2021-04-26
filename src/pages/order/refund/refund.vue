<template>
    <app-layout>
        <view v-if="is_show">
            <view class="refund-box">
                <view class="goods-info">
                    <app-jump-button :url="refundDetail.page_url">
                        <app-order-goods-info :goods="refundDetail.goods_info" :is-last-one="false" :plugin-data="refundDetail.plugin_data" :plugin-index="0">
                        </app-order-goods-info>
                    </app-jump-button>
                </view>
                <view class="content">
                    <view class="content-item" v-if="form.type == 3">
                        <span class="label">
                            货物状态
                        </span>
                        <view class="select-box" @click="setVisible('goodsStatus')">
                            <span :class="{'active': form.goods_status, 'no-active': !form.goods_status}" class="select-label">
                                {{form.goods_status ? goodsStatus.list[goodsStatus.index] : '请选择'}}
                            </span>
                            <image class="arrow-right" src="/static/image/icon/arrow-right.png">
                            </image>
                        </view>
                    </view>
                    <view class="content-item" v-if="form.type != 2">
                        <span class="label">
                            退款原因
                        </span>
                        <view class="select-box" @click="setVisible('refundList')">
                            <span :class="{'active': form.cause, 'no-active': !form.cause}" class="select-label">
                                {{form.cause ? refundList.list[refundList.index] : '请选择'}}
                            </span>
                            <image class="arrow-right" src="/static/image/icon/arrow-right.png">
                            </image>
                        </view>
                    </view>
                    <view class="content-item" v-if="form.type == 2">
                        <span class="label">
                            换货原因
                        </span>
                        <input class="text" placeholder="请输入换货原因" placeholder-style="color:#999999;font-size:28rpx;" v-model="form.cause"/>

                    </view>
                    <view class="content-item" v-if="form.type != 2">
                        <span class="label">
                            退款金额
                        </span>
                        <span v-if="form.refund_price" class="price-label">￥</span>
                        <input :placeholder="`最多可退款${refundDetail.refund_price_text}`" class="text price-text" placeholder-style="color:#999999;font-size:28rpx;" type="digit" v-model="form.refund_price">
                    </view>
                    <view class="content-item">
                        <span class="label">
                            备注信息
                        </span>
                        <input class="text" placeholder="最多可填200个字" placeholder-style="color:#999999;font-size:28rpx;" v-model="form.remark"/>
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
                    <app-upload-image :max-num="maxNum" @imageEvent="imageEvent" background-color="#fff">
                    </app-upload-image>
                </view>
                <view style="height: 80rpx;margin-top: 80rpx;">
                </view>
            </view>
            <view class="btn-box">
                <view @click="formSubmit" class="btn main-center cross-center">
                    提交
                </view>
            </view>
            <app-select height="264rpx" title="货物状态" :is-show="goodsStatus.visible" :list="goodsStatus.list" @confirm="goodsStatusChange" ></app-select>
            <app-select title="退款原因" :is-show="refundList.visible" :list="refundList.list" @confirm="refundListChange"></app-select>
        </view>
    </app-layout>
</template>
<script>
import appOrderGoodsInfo from "../../../components/page-component/app-order-goods-info/app-order-goods-info.vue";
import appUploadImage from "../../../components/basic-component/app-upload-image/app-upload-image.vue";
import appSelect from "./../components/app-select";

export default {
    components: {
        "app-order-goods-info": appOrderGoodsInfo,
        'app-upload-image': appUploadImage,
        'app-select': appSelect,
    },
    data() {
        return {
            refundDetail: {},
            maxNum: 6, // 图片上传最大数量
            is_show: false,
            form: {
                id: 0,
                type: 0,
                goods_status: '',
                cause: '',
                image_list: [],
                mobile: '',
                remark: '',
                refund_price: '',
            },
            goodsStatus: {
                index: 0,
                visible: false,
                list: [],
            },
            refundList: {
                index: 0,
                visible: false,
                list: [],
            },
            refundCauseList: [],
            disabled: false
        }
    },
    methods: {
        getRefundDetail() {
            let self = this;
            self.$showLoading();
            self.$request({
                url: this.$api.order.apply_refund,
                data: {
                    id: self.form.id,
                }
            }).then(response => {
                self.$hideLoading();
                self.is_show = true;
                if (response.code === 0) {
                    self.refundDetail = response.data.detail;
                    self.goodsStatus.list = response.data.list.goods_status;
                    self.refundList.list = response.data.list.refund_list.confirm_list;
                    self.refundCauseList = response.data.list.refund_list;
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
            if (!self.form.goods_status && self.form.type == 3) {
                uni.showModal({
                    title: '',
                    content: '请选择货物状态',
                    showCancel: false,
                });
                return;
            }
            if (!self.form.cause) {
                let content = self.form.type == 2 ? '请填写换货原因' : '请选择退款原因';
                uni.showModal({
                    title: '',
                    content: content,
                    showCancel: false,
                });
                return;
            }
            if ((!self.form.refund_price || self.form.refund_price < 0) && self.form.type != 2) {
                uni.showModal({
                    title: '',
                    content: '请填写退款金额',
                    showCancel: false,
                });
                return;
            }

            if (!self.form.remark) {
                uni.showModal({
                    title: '',
                    content: '请填写备注信息',
                    showCancel: false,
                });
                return;
            }

            if (!self.form.mobile) {
                uni.showModal({
                    title: '',
                    content: '请填写联系方式',
                    showCancel: false,
                });
                return;
            }

            this.$subscribe(this.refundDetail.template_message_list).then(response => {
                self.submitAction();
            }).catch(res => {
                self.submitAction();
            });
        },
        submitAction() {
            let self = this;

            if (self.disabled) {
                return
            }
            self.disabled = true;

            uni.showLoading({
                title: '提交中'
            });
            let refundPrice = self.form.type == 2 ? 0 : self.form.refund_price;
            self.$request({
                url: self.$api.order.refund_submit,
                method: "post",
                data: {
                    id: self.form.id,
                    type: self.form.type,
                    pic_list: JSON.stringify(self.form.image_list),
                    refund_price: refundPrice,
                    remark: this.form.remark,
                    mobile: this.form.mobile,
                    cause: this.form.cause,
                    goods_status: this.form.goods_status,
                },
            }).then(response => {
                self.disabled = false;
                uni.hideLoading();
                if (response.code === 0) {
                    uni.redirectTo({
                        url: '/pages/order/refund/index'
                    })
                } else {
                    uni.showModal({
                        title: '',
                        content: response.msg,
                        showCancel: false,
                    });
                }
            }).catch(() => {
                self.disabled = false;
                uni.hideLoading();
            });
        },
        imageEvent(e) {
            this.form.image_list = e.imageList;
        },
        goodsStatusChange(e) {
            if (!e.is_modal_confirm) {
                if (this.goodsStatus.index != e.index) {
                    this.form.cause = '';
                }

                this.goodsStatus.index = e.index;
                this.form.goods_status = this.goodsStatus.list[this.goodsStatus.index];

                if (this.goodsStatus.index == 0) {
                    this.refundList.list = this.refundCauseList.not_confirm_list;
                } else {
                    this.refundList.list = this.refundCauseList.confirm_list;
                }
            }
            this.goodsStatus.visible = false;
        },
        refundListChange(e) {
            if (!e.is_modal_confirm) {
                this.refundList.index = e.index;
                this.form.cause = this.refundList.list[this.refundList.index];
            }
            this.refundList.visible = false;
        },
        // 设置页面标题
        setPageTitle() {
            let title = '订单售后';
            if (this.form.type == 1) {
                title = '退货退款'
            } else if (this.form.type == 2) {
                title = '换货';
            } else if (this.form.type == 3) {
                title = '仅退款';
            }
            uni.setNavigationBarTitle({
                title: title
            });
        },
        setVisible(key) {
            this[key].visible = true;
        }
    },
    onLoad(options) { this.$commonLoad.onload(options);
        this.form.id = options.id;
        this.form.type = options.type;
        this.getRefundDetail();
    },
    onReady() {
        this.setPageTitle();
    }
}
</script>
<style lang="scss" scoped="">
.refund-box {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 24#{rpx};

    .goods-info {
        background: #ffffff;
        border-radius: 16#{rpx};
        padding: 28#{rpx};
        margin-bottom: 24#{rpx};
    }

    .upload-box {
        background: #ffffff;
        border-radius: 16#{rpx};
        padding:28#{rpx};
        display: flex;
        flex-direction: column;
        margin-top:24#{rpx};

        .label {
            font-size: 28#{rpx};
            color: #353535;
            margin-bottom:20#{rpx};
        }
    }

    .content {
        margin-top:24#{rpx};
        padding:0 28#{rpx};
        background: #ffffff;
        border-radius: 16#{rpx};
        display: flex;
        flex-direction: column;

        .content-item {
            display: flex;
            height: 88#{rpx};
            align-items: center;
            border-bottom:1#{rpx} solid #e2e2e2;

            .label {
                font-size:28#{rpx};
                color: #353535;
                width: 152#{rpx};
            }

            .text {
                color: #353535;
                font-size:28#{rpx};
                flex-grow: 1;
            }

            .price-text {
                color: #ff4544;
            }

            .price-label {
                font-size:28#{rpx};
                color: #ff4544;
            }
        }

        .content-item:last-child {
            border-bottom: 0;
        }

        .select-box {
            display: flex;
            align-items: center;
            width: 100%;

            .select-label {
                font-size:28#{rpx};
                width: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                display: inline-block;
                text-align: right;
            }

            .no-active {
                color: #999999;
            }

            .active {
                color: #353535;
            }

            .arrow-right {
                width: 12#{rpx};
                height: 22#{rpx};
                margin-left: 16#{rpx};
            }
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
</style>