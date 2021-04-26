<template>
    <app-layout>
        <view v-if="is_show" class="refund-detail-box">
            <app-order-banner :title='refundDetail.status_text' :hint="refundDetail.hint_text"></app-order-banner>
            <view v-if='refundDetail.is_confirm == 1 && refundDetail.type == 2' class='express-box'>
                <view class='express-label t-medium'>换货物流</view>
                <template v-if="refundDetail.merchant_express && refundDetail.merchant_express_no">
                    <app-order-express :pageUrl="`/pages/order/express-detail/express-detail?id=${refundDetail.order_id}&express=${refundDetail.merchant_express}&express_no=${refundDetail.merchant_express_no}&cover_pic=${refundDetail.detail[0].goods_info.pic_url}&customer_name=${refundDetail.customer_name}`" :express='refundDetail.merchant_express' :express_no='refundDetail.merchant_express_no'>
                    </app-order-express>
                </template>
                <template v-else>
                    <view v-if='refundDetail.send_type == 1'>
                        物流信息:到店自提
                    </view>
                    <view v-else-if='refundDetail.send_type == 2'>
                        物流信息:同城配送
                    </view>
                    <view v-else>
                        物流信息: 其它方式({{refundDetail.merchant_express_content}})
                    </view>
                </template>
            </view>
            <view v-if='refundDetail.send_type != 1 && refundDetail.send_type != 2 && refundDetail.is_send == 1 && refundDetail.type != 3' class='express-box'>
                <view class='express-label'>退货物流</view>
                <app-order-express :pageUrl="`/pages/order/express-detail/express-detail?id=${refundDetail.order_id}&express=${refundDetail.express}&express_no=${refundDetail.express_no}&cover_pic=${refundDetail.goods_info.pic_url}&customer_name=${refundDetail.customer_name}`" :express='refundDetail.express' :express_no='refundDetail.express_no'>
                </app-order-express>
            </view>
            <view v-if='refundDetail.status == 2 && refundDetail.is_send == 0' class='refund-address-box dif-top'>
                <view class='t-extra-small-color'>收件人信息</view>
                <view class='dir-left-nowrap'>
                    <view class='box-grow-1 dir-top-nowrap'>
                        <view class='dir-left-nowrap express'>
                            <view class='box-grow-1'>{{refundDetail.refund_name}}</view>
                            <view class='box-grow-0'>{{refundDetail.refund_mobile}}</view>
                        </view>
                        <view>{{refundDetail.refund_address}}</view>
                    </view>
                    <view class='box-grow-0 cross-center'>
                        <view @click='copyText' class='box-grow-0 detail-btn'>复制</view>
                    </view>
                </view>
                <view class='t-extra-small-color t-small remark'>
                    {{refundDetail.refund_remark}}
                </view>
            </view>
            <form class='form-box'>
                <view v-if='refundDetail.status == 2 && refundDetail.is_send == 0' class='dir-top-nowrap refund-express-box'>
                    <view class='dir-left-nowrap'>
                        <view class='label box-grow-0 cross-center'>快递公司:</view>
                        <view class="select-box">
                            <picker @change="expressListChange" :value="expressIndex" range-key="name" :range="expressList">
                                <view>
                                    <span :class="{'select-label-active': express}" class="select-label">{{express ? expressList[expressIndex].name : '请选择'}}</span>
                                    <image class="arrow-right" src="/static/image/icon/arrow-right.png"></image>
                                </view>
                            </picker>
                        </view>
                    </view>
                    <view class='dir-left-nowrap express_no'>
                        <view class='label box-grow-0 cross-center'>快递单号:</view>
                        <input placeholder-style="color:#999999;font-size:31rpx" v-model="express_no" class='box-grow-1' placeholder='请填写快递单号' />
                    </view>
                </view>
                <view class="platform">{{refundDetail.platform}}</view>
                <view class='goods-box'>
                    <app-jump-button :url="refundDetail.goods_info.page_url">
                        <app-order-goods-info style="width:100%;" :is-last-one="false" :goods='refundDetail.goods_info'></app-order-goods-info>
                    </app-jump-button>
                </view>
                <view class='preferential-box dir-top-nowrap'>
                    <view class='dir-left-nowrap item cross-center'>
                        <view class='label box-grow-0'>售后类型:</view>
                        <view class='t-small-color box-grow-1'>{{refundDetail.refund_type_text}}</view>
                    </view>
                    <view v-if="refundDetail.refund_data.goods_status" class='dir-left-nowrap item cross-center'>
                        <view class='label box-grow-0'>货物状态:</view>
                        <view class='t-small-color box-grow-1'>{{refundDetail.refund_data.goods_status}}</view>
                    </view>
                    <view v-if="refundDetail.refund_data.cause" class='dir-left-nowrap item cross-center'>
                        <view class='label box-grow-0'>{{refundDetail.type == 2 ? '换货原因' : '退款原因'}}:</view>
                        <view class='t-small-color box-grow-1 common-text'>{{refundDetail.refund_data.cause}}</view>
                    </view>
                    <template v-if='refundDetail.type == 1 || refundDetail.type == 3'>
                        <view class='dir-left-nowrap item cross-center'>
                            <view class='label'>申请退款:</view>
                            <view class='refund-price'>￥{{refundDetail.refund_price}}</view>
                        </view>
                        <view v-if="refundDetail.is_refund == 1" class='dir-left-nowrap item cross-center'>
                            <view class='label'>实际退款:</view>
                            <view class='refund-price'>￥{{refundDetail.reality_refund_price}}</view>
                        </view>
                    </template>
                    <view class='dir-left-nowrap item cross-center'>
                        <view class='label box-grow-0'>备注信息:</view>
                        <view class='t-small-color box-grow-1 common-text'>{{refundDetail.remark}}</view>
                    </view>
                    <view v-if="refundDetail.mobile" class='dir-left-nowrap item cross-center'>
                        <view class='label box-grow-0'>联系方式:</view>
                        <view class='t-small-color box-grow-1 common-text'>{{refundDetail.mobile}}</view>
                    </view>
                    <view v-if='refundDetail.merchant_remark' class='dir-left-nowrap item cross-center'>
                        <view class='label'>商家留言:</view>
                        <view class='merchant-remark common-text'>{{refundDetail.merchant_remark}}</view>
                    </view>
                    <view v-if='refundDetail.pic_list.length > 0' class='dir-top-nowrap'>
                        <view class='image-label'>图片凭证:</view>
                        <view class="flex-wrap">
                            <image @click="previewImage(index)" mode='aspectFill' class="picture" v-for="(item, index) in refundDetail.pic_list" :key="index" :src="item"></image>
                        </view>
                    </view>
                </view>
                <template v-if="refundDetail.status == 1 || (refundDetail.status == 2 && refundDetail.is_send == 0)">
                    <view style="height: 120rpx; width: 100%"></view>
                    <view class="main-center btn-box">
                        <!--商家未进行同意或拒绝操作时 用户可主动撤销申请-->
                        <view v-if='refundDetail.status == 2 && refundDetail.is_send == 0' @click="formSubmit" class="btn main-center cross-center">确认发货
                        </view>
                        <view v-if="refundDetail.status == 1" @click="cancel" class="btn main-center cross-center">
                            撤销申请
                        </view>
                    </view>
                </template>
            </form>
        </view>
    </app-layout>
</template>
<script>
import appOrderBanner from '../../../components/page-component/app-order-banner/app-order-banner.vue';
import appOrderGoodsInfo from '../../../components/page-component/app-order-goods-info/app-order-goods-info.vue';
import appOrderExpress from '../../../components/page-component/app-order-express/app-order-express.vue';
import order from "../order.js";

export default {
    components: {
        'app-order-banner': appOrderBanner,
        'app-order-goods-info': appOrderGoodsInfo,
        'app-order-express': appOrderExpress,
    },
    data() {
        return {
            id: null,
            refundDetail: {},
            expressList: [],
            expressIndex: 0,
            express: '',
            express_no: '',
            customer_name: '',
            index: 0,
            is_show: false,
            value: [0],
        }
    },
    methods: {
        getRefundDetail() {
            let self = this;
            self.$showLoading();
            self.$request({
                url: self.$api.order.refund_detail,
                data: {
                    id: self.id
                }
            }).then(response => {
                self.$hideLoading();
                self.is_show = true;
                if (response.code === 0) {
                    self.refundDetail = response.data.detail;
                    self.expressList = response.data.express_list;
                }
            }).catch(() => {
                self.$hideLoading();
            });
        },
        async formSubmit() {
            let self = this;
            if (!this.express) {
                uni.showToast({
                    title: '请选择快递公司',
                    icon: 'none',
                });
                return;
            }
            if (!this.express_no) {
                uni.showToast({
                    title: '请填写快递单号',
                    icon: 'none',
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
            try {
                this.$showLoading({ title: '提交中' });
                this.$request({
                    url: this.$api.order.refund_send,
                    method: 'post',
                    data: {
                        id: this.id,
                        express: this.express,
                        customer_name: this.customer_name,
                        express_no: this.express_no
                    }
                }).then(response => {
                    this.$hideLoading();

                    if (response.code === 0) {
                        this.getRefundDetail();
                    } else {
                        uni.showModal({
                            title: '',
                            content: response.msg,
                            showCancel: false,
                        });
                    }
                });
            } catch (e) {
                this.$hideLoading();
            }
        },
        copyText() {
            let { refund_name, refund_mobile, refund_address } = this.refundDetail;
            order.copyText(`${refund_name}\xa0${refund_mobile}\xa0${refund_address}`)
        },
        // 用户撤销申请
        cancel() {
            let self = this;
            uni.showModal({
                title: '提示',
                content: '是否撤销申请？',
                success: function(res) {
                    if (res.confirm) {
                        uni.showLoading({ title: '撤销中' });
                        self.$request({
                            url: self.$api.order.cancel_refund,
                            data: {
                                refund_id: self.refundDetail.id
                            },
                            method: 'post'
                        }).then(response => {
                            uni.hideLoading();
                            let { code, data, msg } = response;

                            uni.showModal({
                                title: '',
                                content: msg,
                                showCancel: false,
                                success: function() {
                                    let pages = getCurrentPages();
                                    uni.navigateBack({
                                        delta: pages.length > 3 ? 3 : 1
                                    });
                                }
                            });
                        });
                    }
                }
            });
        },
        expressListChange(e) {
            this.expressIndex = e.target.value;
            this.express = this.expressList[this.expressIndex].name;
        },
        // 图片预览
        previewImage(index) {
            let imageList = this.refundDetail.pic_list;
            uni.previewImage({
                current: imageList[index],
                urls: imageList
            })
        },
    },
    onLoad(options) { this.$commonLoad.onload(options);
        this.id = options.id;
        this.getRefundDetail();
    }
}
</script>
<style lang="scss" scoped>
.refund-detail-box {
    position: absolute;
    width: 100%;
    height: 100%;

    .form-box {
        .platform {
            background: #fff;
            border-bottom: 1#{rpx} solid #e2e2e2;
            padding: 20#{rpx} 20#{rpx};
            margin-top: 20#{rpx};
        }

        .select-box {
            text-align: right;
            width: 100%;

            .select-label {
                font-size: 31#{rpx};
                color: #999999;
            }

            .select-label-active {
                color: #353535;
            }

            .arrow-right {
                width: 12#{rpx};
                height: 22#{rpx};
                margin-left: 16#{rpx};
            }
        }
    }

    .btn-box {
        position: fixed;
        bottom: 0;
        width: 100%;
        background: #f7f7f7;
        padding: 20#{rpx};

        .btn {
            border-radius: 40#{rpx};
            height: 80#{rpx};
            width: 100%;
            background-color: $uni-important-color-red;
            padding: 24#{rpx} 0;
            color: #ffffff;
            font-size: 32#{rpx};
        }
    }
}

.express-box {
    background: #fff;
    padding: 32#{rpx} 24#{rpx};
    margin-top: 20#{rpx};
}

.express-label {
    margin-bottom: 10#{rpx};
    color: #999999;
    font-size: $uni-font-size-general-one;
}

.goods-box {
    background: #fff;
    padding: 32#{rpx} 24#{rpx};
}

.preferential-box {
    background: #fff;
    padding: 32#{rpx} 24#{rpx};
    margin-top: 20#{rpx};

    .picture {
        width: #{160rpx};
        height: #{160rpx};
        margin-right: #{14rpx};
        margin-bottom: #{14rpx};
    }
}

.preferential-box {
    .item {
        margin: 12#{rpx} 15#{rpx} 12#{rpx} 0;
        align-items: flex-start;
    }

    .image-label {
        margin: 12#{rpx} 0 24#{rpx};
    }

    .common-text {
        word-break: break-all;
    }
}

.preferential-box .label {
    margin-right: 15#{rpx};
}

.preferential-box .merchant-remark {
    color: $uni-important-color-red;
}

.refund-address-box {
    background-color: #fff;
    padding: 32#{rpx} 24#{rpx};
    margin-top: 20#{rpx};
}

.refund-address-box .express {
    margin: 15#{rpx} 0 5#{rpx};
}

.refund-address-box .remark {
    margin-top: 10#{rpx};
    padding-top: 5#{rpx};
    border-top: 1#{rpx} solid $uni-weak-color-one;
}

.refund-express-box {
    background-color: #fff;
    padding: 32#{rpx} 24#{rpx};
    margin-top: 20#{rpx};
}

.refund-express-box .label {
    margin-right: 25#{rpx};
}

.refund-express-box .express_no {
    border-top: 1#{rpx} solid $uni-weak-color-one;
    margin-top: 15#{rpx};
    padding-top: 15#{rpx};
}

.refund-express-box .right-icon {
    width: 12#{rpx};
    height: 22#{rpx};
    margin-right: 25#{rpx};
}

.refund-price {
    color: $uni-important-color-red;
}

.detail-btn {
    border: 1#{px} solid #bbbbbb;
    border-radius: 30#{rpx};
    padding: 10#{rpx} 30#{rpx};
    margin-left: 15#{rpx};
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
    bottom: 0;
    left: 0;
    width: 100%;
}

.picker-header {
    padding: 0 #{24rpx};
    color: #446dfd;
    font-size: #{32rpx};
}

.get {
    width: #{160rpx};
    height: #{48rpx};
    line-height: #{48rpx};
    text-align: center;
    border: #{1rpx} solid #446dfd;
    border-radius: #{24rpx};
    position: absolute;
    top: #{20rpx};
    right: #{24rpx};
    display: block;
    color: #446dfd;
}

.pick {
    width: 100%;
    height: #{440rpx}
}

.pick-view {
    line-height: #{72rpx};
    text-align: center;
    color: #446dfd;
    font-size: #{32rpx};
}
</style>