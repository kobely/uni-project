<template>
    <app-layout>
        <view v-if="is_show" class='city-map-box dir-top-nowrap'>
            <view class="top-box dir-left-nowrap">
                <image class="goods-image box-grow-0" :src="expressData.goods_pic"></image>
                <view class="goods-info dir-top-nowrap box-grow-1">
                    <!-- #ifdef MP-ALIPAY -->
                    <view class="t-omit goods-name" style="height: 24rpx;">{{expressData.goods_name}}</view>
                    <!-- #endif -->
                    <!-- #ifndef MP-ALIPAY -->
                    <view class="t-omit goods-name">{{expressData.goods_name}}</view>
                    <!-- #endif -->
                    
                    <view class="goods-num">共购买{{expressData.goods_num}}件商品</view>
                </view>
            </view>
            <view>
                <map style="width: 100%; height: 300px;" :latitude="latitude" :longitude="longitude" :markers="covers">
                </map>
            </view>
            <view class="city-box dir-top-nowrap">
                <view class="status-label">{{expressData.status_text}}</view>
                <view class="time-label" v-if="expressData.estimate_time && expressData.status != 302">{{expressData.estimate_time}}</view>
                <view class="corporation-box dir-left-nowrap">
                    <image class="corporation-icon" :src="expressData.corporation_icon"></image>
                    <view class="corporation-name">{{expressData.corporation_name}}</view>
                </view>
                <view class="dir-left-nowrap cross-center city-service">
                    <image class="head" src="/static/image/icon/deliveryman.png"></image>
                    <view class="info-box dir-top-nowrap box-grow-1">
                        <template v-if="expressData.city_name && expressData.city_mobile">
                            <view class="info-label">配送员</view>
                            <view class="info-man">{{expressData.city_name}} {{expressData.city_mobile}}</view>
                        </template>
                        <template v-else>
                            <view class="await-man">等待分配骑手</view>
                        </template>
                    </view>
                    <view class="icon-box">
                        <app-jump-button open_type="tel" :number="expressData.city_mobile">
                            <image class="icon" src="/static/image/icon/store-tel.png"></image>
                        </app-jump-button>
                    </view>
                </view>
            </view>
        </view>
    </app-layout>
</template>
<script>

export default {
    data() {
        return {
            is_show: false,
            latitude: 39.909,
            longitude: 116.39742,
            // 顺序是 配送员位置 用户位置 商家位置
            covers: [{
                latitude: 0,
                longitude: 0,
                iconPath: '',
                width: 50,
                height: 50
            }, {
                latitude: 0,
                longitude: 0,
                iconPath: '/static/image/icon/city-service/my.png',
                width: 50,
                height: 50
            },
            {
                latitude: 0,
                longitude: 0,
                iconPath: '/static/image/icon/city-service/shop.png',
                width: 50,
                height: 50
            }],
            express_id: 0,
            expressData: {}
        }
    },
    methods: {
        getExpressInfo() {
            this.$showLoading();
            this.$request({
                url: this.$api.order.city_map,
                data: {
                    express_id: this.express_id,
                },
                method: 'POST',
            }).then(response => {
                this.$hideLoading();
                this.is_show = true;
                if (response.code === 0) {
                    this.expressData = response.data.express_data;
                    let {
                        user_longitude, user_latitude,
                        man_longitude, man_latitude,
                        corporation_icon, shop_longitude,
                        shop_latitude
                    } = this.expressData;
                    this.longitude = user_longitude;
                    this.latitude = user_latitude;
                    this.covers[0].longitude = man_longitude;
                    this.covers[0].latitude = man_latitude;
                    this.covers[0].iconPath = corporation_icon;

                    this.covers[1].longitude = user_longitude;
                    this.covers[1].latitude = user_latitude;

                    this.covers[2].longitude = shop_longitude;
                    this.covers[2].latitude = shop_latitude;
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
    },
    onLoad(options) { this.$commonLoad.onload(options);
        this.express_id = options.express_id;
        this.getExpressInfo();
    }
}
</script>
<style lang="scss" scoped>
    .top-box {
        background-color: #ffffff;
        border-radius: #{16rpx};
        margin: #{20rpx} #{24rpx};
        padding: #{24rpx};

        .goods-image {
            width: #{68rpx};
            height: #{68rpx};
            margin-right: #{16rpx};
        }

        .goods-name {
            font-size: #{24rpx};
            color: #353535;
            margin-bottom: #{15rpx};
        }

        .goods-num {
            color: #999999;
            font-size: #{20rpx};
        }
    }

    .city-box {
        margin: #{24rpx};
        background-color: #ffffff;
        padding: #{30rpx};
        border-radius: #{16rpx};

        .status-label {
            font-weight: 800;
            font-size: #{32rpx};
            color: #353535;
        }

        .time-label {
            font-size: #{28rpx};
            color: #353535;
            margin-top: #{21rpx};
        }

        .corporation-box {
            margin-top: #{40rpx};
            margin-bottom: #{20rpx};

            .corporation-icon {
                width: #{40rpx};
                height: #{40rpx};
                margin-right: #{14rpx};
            }

            .corporation-name {
                font-size: #{28rpx};
                color: #666666;
            }
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

            .info-man {
                font-size: #{28rpx};
                color: #666666;
            }
        }

        .head {
            width: #{75rpx};
            height: #{75rpx};
        }

        .icon-box {
            padding: 0 #{30rpx};
            border-left: #{1rpx} solid #f7f7f7;

            .icon {
                width: #{45rpx};
                height: #{45rpx};
            }
        }
    }
</style>