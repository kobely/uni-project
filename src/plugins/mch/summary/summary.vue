<template>
    <app-layout>
        <view class="summary-head">
            <image class="shop-pic" :src="shop.store.pic_url && shop.store.pic_url[0].pic_url" lazy-load></image>
            <view class="home cross-center" @click="navHome">
                <image src="../image/arrow-left-white.png"></image>
                <view>返回店铺首页</view>
            </view>
            <image class="cover-pic" :src="shop.store.cover_url" lazy-load></image>
        </view>

        <view class="summary-info">
            <view class="summary-name">{{shop.store.name}}</view>
            <view v-if="mchSetting.is_web_service" @click="navCs"
                  class="summary-contact main-center cross-center dir-left-nowrap">
                <image :src="mchSetting.web_service_pic ? mchSetting.web_service_pic : '/plugins/mch/images/summary-blue.png'"></image>
                <view>在线沟通</view>
            </view>

            <view class="dir-left-nowrap tag" v-if="shop.store.scope">
                <image class="box-grow-0" src="./../image/summary-yw.png"></image>
                <view>{{shop.store.scope}}</view>
            </view>
            <view class="dir-left-nowrap tag" v-if="shop.store.mobile">
                <image class="box-grow-0" src="./../image/summary-phone.png"></image>
                <view class="dir-left-nowrap">
                    <view class="max">{{shop.mobile}}</view>
                    <view @click="callPhone" class="box-grow-0 main-center cross-center tv">拨号</view>
                </view>
            </view>
            <view class="dir-left-nowrap tag" v-if="shop.store.address">
                <image class="box-grow-0" src="./../image/summary-address.png"></image>
                <view class="dir-left-nowrap">
                    <view class="max">{{shop.store.address}}</view>
                    <view @click="mapPower" class="box-grow-0 main-center cross-center tv">导航
                    </view>
                </view>
            </view>

            <view class="dir-left-nowrap tag" v-if="shop.store.description">
                <image class="box-grow-0" src="./../image/summary-synopsis.png"></image>
                <view>{{shop.store.description}}</view>
            </view>
        </view>

        <view v-if="shop.store.latitude>0 && shop.store.longitude>0" class="main-center summary-end">
            <map :longitude="shop.store.longitude" :markers="markers" :latitude="shop.store.latitude"
                 class="map"></map>
        </view>
    </app-layout>
</template>

<script>
    export default {
        name: "summary",
        components: {},
        data() {
            return {
                markers: [],
                shop: {store: {}},
                mchSetting: {},
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            const self = this;

            self.$showLoading();
            self.$request({
                url: self.$api.mch.detail,
                data: {
                    id: options.mch_id,
                }
            }).then(info => {
                self.$hideLoading();
                if (info.code === 0) {
                    let shop = info.data.detail;
                    let markers = [{
                        iconPath: "./../image/summary-map.png",
                        id: 0,
                        width: 43,
                        height: 43,
                        longitude: shop.store.longitude,
                        latitude: shop.store.latitude,
                    }];
                    [
                        self.markers,
                        self.shop,
                        self.mchSetting
                    ] = [
                        markers,
                        shop,
                        info.data.mchSetting
                    ]
                }
            }).catch(e => {
                self.$hideLoading();
            })
        },
        methods: {
            navHome() {
                uni.redirectTo({url: `/plugins/mch/shop/shop?mch_id=` + this.shop.id});
            },
            navCs() {
                uni.navigateTo({url: `/pages/web/web?url=` + this.mchSetting.web_service_url});
            },
            callPhone() {
                const phoneNumber = this.shop.mobile;
                uni.makePhoneCall({
                    phoneNumber: phoneNumber
                })
            },
            mapPower() {
                const shop = this.shop;
                uni.openLocation({
                    latitude: parseFloat(shop.store.latitude),
                    longitude: parseFloat(shop.store.longitude),
                    name: shop.store.name,
                    address: shop.store.address,
                });
                openLocation
            }
        },
    }
</script>

<style scoped lang="scss">
    .summary-head {
        height: #{200rpx};
        width: 100%;
        position: relative;

        .shop-pic {
            height: 100%;
            width: 100%;
            opacity: 0.8;
        }

        .home {
            position: absolute;
            top: #{55rpx};
            left: #{0rpx};
            background: #ff4544;
            border-radius: 0 #{28rpx} #{28rpx} 0;
            height: #{56rpx};
        }

        .home view {
            color: #fff;
            font-size: #{26rpx};
            padding-right: #{24rpx};
        }

        .home image {
            height: #{22rpx};
            width: #{12rpx};
            margin: #{12rpx};
        }

        .cover-pic {
            border-radius: #{16rpx};
            position: absolute;
            top: #{130rpx};
            left: #{305rpx};
            height: #{140rpx};
            width: #{140rpx};
        }
    }

    .summary-info {
        margin: #{100rpx} #{55rpx} 0 #{55rpx};

        .summary-name {
            text-align: center;
            color: #353535;
        }

        .summary-contact {
            height: #{80rpx};
            width: #{360rpx};
            margin: #{40rpx} auto;
            color: #5292ed;
            font-size: #{28rpx};
            border-radius: #{40rpx};
            border: #{1rpx} solid #5292ed;
        }

        .summary-contact image {
            height: #{32rpx};
            width: #{32rpx};
            margin-right: #{16rpx};
        }

        .tag {
            margin: #{15rpx} 0;
        }

        .tag > image {
            padding-top: #{5rpx};
            height: #{32rpx};
            width: #{32rpx};
        }

        .tag > view {
            margin-left: #{24rpx};
            font-size: #{28rpx};
            color: #353535;
        }

        .tag .max {
            max-width: #{448rpx};
        }

        .tag .tv {
            text-align: center;
            display: inline-block;
            border-radius: #{22rpx};
            margin: 0 #{32rpx};
            padding: 0 #{20rpx};
            font-size: #{26rpx};
            height: #{44rpx};
            line-height: #{44rpx};
            border: 1px solid #5292ed;
            color: #5292ed;
        }
    }

    .summary-end {
        margin: #{36rpx} 0;
    }

    .map {
        width: #{640rpx};
        height: #{560rpx};
    }
</style>