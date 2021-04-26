<template>
    <app-layout>
        <view class="box">
            <view class="item">
                <view class='order-info' v-if="detail.name">
                    <view class='dir-left-nowrap'>
                        <view class='info-label'>收货人：</view>
                        <view>
                            <view>{{detail.name}}</view>
                        </view>
                    </view>
                    <view class='dir-left-nowrap'>
                        <view class='info-label'>联系方式：</view>
                        <view>
                            <view>{{detail.mobile}}</view>
                        </view>
                    </view>
                </view>
                <view class="card-info">
                    <image class="card-img" :src='detail.pic_url'></image>
                    <view class="card-name t-omit-two">{{detail.card_name}}</view>
                    <view class='card-other'>
                        <view class='other-label'>有效时间</view>
                        <view>{{detail.start_time}} - {{detail.end_time}}</view>
                        <view class='other-label'>发放时间</view>
                        <view>{{detail.created_at}}</view>
                        <view class='other-label'>使用说明</view>
                        <text>{{detail.content}}</text>
                    </view>
                </view>
                <view class='order-info'>
                    <view style="margin-bottom: 24rpx;">核销信息</view>
                    <view class='dir-left-nowrap'>
                        <view class='info-label'>剩余次数：</view>
                        <view>
                            <view>{{detail.number - detail.use_number}}次</view>
                        </view>
                    </view>
                    <view class='dir-left-nowrap'>
                        <view class='info-label'>已核销次数：</view>
                        <view>
                            <view>{{detail.use_number}}次</view>
                        </view>
                    </view>
                    <view class='dir-left-nowrap'>
                        <view class='info-label'>总次数：</view>
                        <view>
                            <view>{{detail.number}}次</view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="detail.is_use == 0 && detail.receive_id == 0" class='bottom cross-center'>
                <view @click='submit=true'>
                    <button class="submit-btn">核销卡券</button>
                </view>
            </view>
        </view>
        <view v-if="msg || submit" class='bg cross-center main-center' @touchmove.stop.prevent="">
            <view class='dialog'>
                <view class="title">{{submit ? '输入本次核销次数' : '提示'}}</view>
                <view v-if="msg" class='dialog-content'>{{msg}}</view>
                <view v-if="submit" class='dialog-content'>
                    <input v-model="useNumber" class="input-number" type="number"/>次
                </view>
                <view v-if="msg" @click='closeDialog' class='dialog-btn'>确认</view>
                <view v-if="submit" class='dialog-btn main-center cross-center'>
                    <view @click='submit=false' style='color:#666666;width: 50%'>取消</view>
                    <view class="line"></view>
                    <view style='width: 50%' @click='clerk'>确定</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    export default {
        data() {
            return {
                detail: {
                    start_time: '',
                    end_time: ''
                },
                msg: null,
                is_clerk: 0,
                submit: false,
                cardId: null,
                surplus_number: 0,
                useNumber: '',
                qrCodeId: -1,
            }
        },
        name: "clerk",
        methods: {
            getList(id) {
                let that = this;
                that.$showLoading({
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.card.detail,
                    data: {
                        cardId: id,
                        qr_code_id: that.qrCodeId,
                    },
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code === 0) {
                        that.detail = response.data.card;
                        that.cardId = id;
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000,
                        });
                    }

                    if (that.detail.clerk_number && that.detail.clerk_number >= 1) {
                        uni.showModal({
                            title: '提示',
                            content: '核销码已失效',
                            showCancel: false,
                            complete: function(res) {
                                uni.navigateBack();
                            }
                        });
                    };
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            clerk() {
                let that = this;
                uni.showLoading({
                    title: '核销中...'
                });

                if (!that.useNumber) {
                    uni.showToast({
                        title: '请输入核销次数',
                        icon: 'none',
                        duration: 2000,
                    });
                    return false;
                }

                that.$request({
                    url: that.$api.card.clerk,
                    data: {
                        cardId: that.cardId,
                        use_number: that.useNumber,
                        qr_code_id: that.qrCodeId,
                    },
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code === 0) {
                        that.is_clerk = response.data.is_clerk;
                        that.msg = response.msg;
                        that.submit = false;
                        that.surplus_number = response.data.surplus_number;
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 2000,
                        });
                    }
                }).catch(() => {
                    uni.hideLoading();
                });
            },
            closeDialog() {
                if (this.msg) {
                    this.msg = ''
                    if (this.is_clerk) {
                        let url = '';
                        if (this.surplus_number > 0) {
                            url = '/plugins/clerk/order/order?status=2&type=0';
                        } else {
                            url = '/plugins/clerk/order/order?status=2&type=1';
                        }
                        uni.navigateBack({});
//                        uni.redirectTo({
//                            url: url
//                        })
                    }
                } else {
                    this.msg = ''
                }
            },
        },
        onLoad(options) { this.$commonLoad.onload(options);
            if(options.qr_code_id) {
                this.qrCodeId = options.qr_code_id;
            }
            this.getList(options.cardId);
        }
    }
</script>

<style scoped lang="scss">

    .box {
        display: flex;
        flex-direction: column;

        .item {
            margin-bottom: 140#{rpx};
        }
    }
    .card-info {
        margin: 0 24#{rpx};
        border-radius: #{15rpx};
        background-color: #fff;
        position: relative;
        margin-top: #{70rpx};
        text-align: center;
        padding: #{80rpx} #{24rpx} #{36rpx};
        margin-bottom: #{20rpx};
    }

    .card-img {
        height: #{88rpx};
        width: #{88rpx};
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        top: #{-44rpx};
        border-radius: #{44rpx};
    }

    .card-name {
        font-size: #{46rpx};
        max-width: 70%;
        color: #353535;
        margin: 0 auto #{38rpx};
    }

    .card-status {
        width: #{160rpx};
        height: #{60rpx};
        position: absolute;
        bottom: #{30rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
        line-height: #{60rpx};
        font-size: 15px;
        border-radius: #{30rpx};
        background-color: #FEEEEE;
        color: #FF4544;
    }

    .card-about {
        padding: #{40rpx};
        width: 90%;
        margin: 0 auto #{50rpx};
        border-radius: #{15rpx};
        background-color: #fff;
        font-size: 15px;
    }

    .about-title {
        color: #999999;
        margin-bottom: #{40rpx};
    }

    .submit-btn {
        width: #{702rpx};
        height: #{88rpx};
        margin: 0 auto;
        padding: 0;
        text-align: center;
        line-height: #{88rpx};
        border-radius: #{44rpx};
        background-color: #ff4544;
        color: #fff;
        font-size: #{32rpx};
    }

    .bottom {
        position: fixed;
        bottom: 0;
        height: #{140rpx};
        width: 100%;
        padding: 0 #{24rpx};
        border-top: #{1rpx} solid #e2e2e2;
        background: #ffffff;
    }

    .order-info {
        width: #{702rpx};
        margin: #{24rpx};
        background-color: #fff;
        border-radius: #{16rpx};
        padding: #{28rpx} #{24rpx};
        font-size: #{28rpx};
        color: #353535;
    }

    .info-label {
        color: #999999;
    }

    .card-other {
        text-align: left;
        font-size: #{28rpx};
        color: #353535;
        border-top: #{1rpx} solid #e2e2e2;
    }

    .other-label {
        color: #999999;
        margin: #{30rpx} 0 #{22rpx};
    }

    .bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .3);
        z-index: 1000;
    }

    .dialog {
        width: #{630rpx};
        background-color: #fff;
        padding-top: #{40rpx};
        border-radius: #{16rpx};
        font-size: #{32rpx};
        color: #353535;
        text-align: center;

        .title {
            font-size: 32#{rpx};
            color: #353535;
            margin-bottom:40#{rpx};
        }
    }

    .dialog-content {
        margin: #{40rpx};
        display: flex;
        justify-content:center;
        align-items: center;

        .input-number {
            width: 288#{rpx};
            background: #f7f7f7;
            border-radius: 16#{rpx};
            height: 80#{rpx};
            margin-right: 16#{rpx};
            line-height: 80#{rpx};
        }
    }

    .dialog-btn {
        color: #ff4544;
        height: #{88rpx};
        line-height: #{88rpx};
        border-top: #{1rpx} solid #e2e2e2;
    }

    .line {
        height: #{45rpx};
        width:#{1rpx};
        background-color:#e2e2e2;
    }
</style>