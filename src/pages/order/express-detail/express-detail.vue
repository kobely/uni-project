<template>
    <app-layout>
        <view v-if="is_show" class='express-box'>
            <view class='box-grow-1 top-box dir-left-wrap'>
                <view class='box-grow-0 cross-center main-center'>
                    <image class='goods-pic' mode='aspectFill' :src='cover_pic'></image>
                </view>
                <view class='dir-top-wrap box-grow-1'>
                    <view class='dir-left-nowrap'>
                        <text class='box-grow-0 label'>物流状态:</text>
                        <text class='box-grow-0 sign-text'>
                            {{expressDetail.status_text ? expressDetail.status_text : '未知'}}
                        </text>
                    </view>
                    <view class='dir-left-nowrap'>
                        <text class='box-grow-0 label'>快递公司:</text>
                        <text class='box-grow-0'>{{order.express}}</text>
                    </view>
                    <view class='dir-left-nowrap cross-center'>
                        <text class='box-grow-0 label'>快递单号:</text>
                        <text class='box-grow-1'>{{order.express_no}}</text>
                        <view @click='copyText' class='box-grow-0 detail-btn'>复制</view>
                    </view>
                </view>
            </view>
            <view class='logistics-box dir-top-wrap'>
                <block v-if='expressDetail.list'>
                    <view class='item-box'>
                        <view v-for='item in expressDetail.list' :key='item.id'
                              :class="{'sign-text': index == 0 ? true : false}" class='dir-top item'>
                            <image v-if='index == 0' class='sign-big'
                                   src='/static/image/icon/order/point-green.png'></image>
                            <image v-else class='sign' src='/static/image/icon/order/point-gray.png'></image>
                            <view>{{item.desc}}</view>
                            <view>{{item.datetime}}</view>
                        </view>
                    </view>
                </block>
                <view v-else class='main-center empty-box'>
                    <view>暂无物流信息</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    export default {
        data() {
            return {
                expressDetail: null,
                order: null,
                express: '',
                express_no: '',
                cover_pic: '',
                customer_name: '',
                is_show: false,
            }
        },
        methods: {
            getExpressDetail() {
                this.$showLoading();
                this.$request({
                    url: this.$api.order.express_detail,
                    data: {
                        express: this.express,
                        customer_name: this.customer_name,
                        express_no: this.express_no
                    }
                }).then(response => {
                    this.$hideLoading();
                    this.is_show = true;
                    if (response.code === 0) {
                        this.order = response.data.order;
                        this.expressDetail = response.data.express;
                    } else {
                        uni.showModal({
                            title: '',
                            content: response.msg,
                            showCancel: false,
                        });
                    }
                }).catch(() => {
                    this.$hideLoading();
                });
            },
            copyText() {
                this.$utils.uniCopy({
                    data: this.order.express_no,
                    success: function () {
                        uni.showToast({
                            title: '复制成功',
                            icon: 'none',
                        })
                    }
                });
            },
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.express = options.express;
            this.express_no = options.express_no;
            this.customer_name = options.customer_name;
            this.cover_pic = options.cover_pic;
            this.getExpressDetail();
        }
    }
</script>

<style lang="scss" scoped>
    .express-box {
        position: absolute;
        height: 100%;
        width: 100%;
    }
    .express-box .top-box {
        padding: #{20rpx};
        background-color: #ffffff;
    }

    .express-box .label {
        margin-right: #{10rpx};
    }

    .express-box .goods-pic {
        width: #{130rpx};
        height: #{130rpx};
        margin-right: #{20rpx};
    }

    .logistics-box {
        padding: #{20rpx} #{25rpx};
        background-color: #fff;
        margin-top: #{25rpx};
        font-size: $uni-font-size-weak-two;
        color: $uni-general-color-two;
    }

    .logistics-box .item-box {
        border-left: #{1rpx} solid $uni-weak-color-one;
        padding-left: #{45rpx};
        position: relative;
    }

    .logistics-box .item {
        margin-bottom: #{25rpx};
        padding-bottom: #{25rpx};
        border-bottom: #{1rpx} solid $uni-weak-color-one;
    }

    .logistics-box .item .sign {
        width: #{16rpx};
        height: #{16rpx};
        position: absolute;
        left: #{-7rpx};
    }

    .logistics-box .item .sign-big {
        width: #{32rpx};
        height: #{32rpx};
        position: absolute;
        left: #{-16rpx};
    }

    .sign-text {
        color: #25ae5f;
    }
    .empty-box {
        font-size: $uni-font-size-general-one;
    }
    .detail-btn {
        border: 1#{rpx} solid #bbbbbb;
        border-radius: 30#{rpx};
        padding: 10#{rpx} 30#{rpx};
    }
</style>