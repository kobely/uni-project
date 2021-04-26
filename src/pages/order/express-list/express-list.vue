<template>
    <app-layout>
        <view v-if="is_show" class='express-list-box dir-top-nowrap'>
            <view class="top-box cross-center">
                <view class="title">{{order.detailExpress.length}}个包裹已发出</view>
            </view>
            <view class="express-box" v-for="deItem in order.detailExpress" :key="deItem.id">
                <app-jump-button :url="getPageUrl(deItem, deItem.expressRelation[0].orderDetail.goods_info.goods_attr.cover_pic)">
                    <view style="width: 100%">
                        <view class="dir-left-nowrap express-item">
                            <!-- 同城配送 -->
                            <template v-if="order.send_type == 2">
                                <view class="dir-left-nowrap cross-center city-service">
                                    <image class="head" src="/static/image/icon/deliveryman.png"></image>
                                    <template v-if="deItem.city_name && deItem.city_mobile">
                                        <view class="info-box dir-top-nowrap box-grow-1">
                                            <view class="info-label">配送员</view>
                                            <view class="info">{{deItem.city_name}} {{deItem.city_mobile}}</view>
                                        </view>
                                        <view class="icon-box">
                                            <app-jump-button open_type="tel" :number="deItem.city_mobile">
                                                <image class="icon" src="/static/image/icon/store-tel.png"></image>
                                            </app-jump-button>
                                        </view>
                                        <!-- 第三方配送才有地图信息 -->
                                        <view v-if="deItem.send_type == 1" class="icon-box">
                                            <app-jump-button open_type="navigate" :url="'/pages/order/city-map/city-map?express_id=' + deItem.id">
                                                <image class="icon" src="/static/image/icon/see-location.png"></image>
                                            </app-jump-button>
                                        </view>
                                    </template>
                                    <template v-else>
                                        <view class="await-man">等待分配骑手</view>
                                    </template>
                                </view>
                            </template>
                            <!-- 快递配送 -->
                            <template v-else>
                                <view v-if="deItem.send_type == 1" class="dir-top-nowrap box-grow-1 express-info">
                                    <view class="dir-left-nowrap item">
                                        <view class="box-grow-0">快递公司：</view>
                                        <view class="box-grow-1">{{deItem.express}}</view>
                                    </view>
                                    <view class="dir-left-nowrap item">
                                        <view class="box-grow-0">物流单号：</view>
                                        <view class="box-grow-1">{{deItem.express_no}}</view>
                                    </view>
                                    <view class="dir-left-nowrap item">
                                        <view class="box-grow-0">商家留言：</view>
                                        <view class="box-grow-1">{{deItem.merchant_remark}}</view>
                                    </view>
                                </view>
                                <view class="box-grow-1 express-info" v-else>物流信息：{{deItem.express_content}}</view>
                                <view v-if="deItem.send_type == 1" class="cross-center box-grow-0">
                                    <app-image width="12rpx" height="22rpx" imgSrc="/static/image/icon/arrow-right.png"></app-image>
                                </view>
                            </template>
                        </view>
                        <view class="dir-left-wrap">
                            <view class="image" v-for="erItem in deItem.expressRelation" :key="erItem.id">
                                <app-image width="124rpx" height="124rpx" :imgSrc="erItem.orderDetail.goods_info.goods_attr.cover_pic"></app-image>
                            </view>
                        </view>
                        <view class="goods-num">共{{deItem.goods_num}}件商品</view>
                    </view>
                </app-jump-button>
            </view>
        </view>
    </app-layout>
</template>
<script>

export default {
    data() {
        return {
            is_show: false,
            orderId: null,
            order: [],
        }
    },
    methods: {
        getOrderDetail() {
            this.$showLoading();
            this.$request({
                url: this.$api.order.order_express_list,
                data: {
                    order_id: this.orderId,
                }
            }).then(response => {
                this.$hideLoading();
                this.is_show = true;
                if (response.code === 0) {
                    this.order = response.data.order;
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
        getPageUrl(expressInfo, coverPic) {
            if (expressInfo && expressInfo.send_type == 1 && this.order.send_type != 2) {
                return `/pages/order/express-detail/express-detail?express=${expressInfo.express}&customer_name=${expressInfo.customer_name}&express_no=${expressInfo.express_no}&cover_pic=${coverPic}`
            } else {
                return '';
            }
        },
    },
    onLoad(options) { this.$commonLoad.onload(options);
        this.orderId = options.order_id
        this.getOrderDetail();
    }
}
</script>
<style lang="scss" scoped>
.top-box {
    width: 100%;
    height: #{100rpx};
    background: #feeeee;
    margin-bottom: #{20rpx};

    .title {
        margin-left: #{24rpx};
        color: #ff4544;
        font-size: #{28rpx};
    }

}

.express-box {
    padding: #{32rpx} #{24rpx} #{20rpx};
    background: #ffffff;

    .express-info {
        font-size: #{28rpx};
        margin-bottom: #{20rpx};
        color: #353535;

        .item {
            margin-bottom: #{24rpx};
        }
    }

    .goods-num {
        font-size: #{24rpx};
        color: #999999;
        margin: #{20rpx} 0;

    }

    .image {
        margin-right: #{20rpx};
        margin-top: #{20rpx};
    }
}

.city-service {
    width: 100%;
    margin-bottom: 10#{rpx};

    .await-man {
        margin-left: #{12rpx};
        font-size: #{28rpx};
        color:#666666;
    }

    .info-box {
        margin-left: #{12rpx};

        .info-label {
            margin-bottom: #{10rpx};
            color: #999999;
            font-size: #{28rpx};
        }
        .info {
            color: #666666;
        }
    }

    .head {
        width: #{75rpx};
        height: #{75rpx};
    }

    .icon-box {
        padding: 0 #{40rpx};
        border-left: #{2rpx} solid #e2e2e2;

        .icon {
            width: #{45rpx};
            height: #{45rpx};
        }
    }
}
</style>