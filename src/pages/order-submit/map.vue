<template>
    <app-layout>
        <view class="map" v-if="config && config.address">
            <!-- #ifdef MP -->
            <map :longitude="config.address.longitude" :latitude="config.address.latitude" :show-location="true"
                 :polygons="polygons" :polygon="polygons" :scale="15"
                 :include-points="polygons[0].points" :markers="markers"></map>
            <!-- #endif -->
             <!-- #ifdef H5 -->
            <map :longitude="config.address.longitude" :latitude="config.address.latitude" :show-location="true"
                :scale="15"
                :polyline="polyline"
                :include-points="polyline[0].points" :markers="markers"></map>
            <!-- #endif -->
            <cover-view class="bottom dir-left-nowrap" :style="{paddingBottom: iPhoneX.XBoolean ? '50rpx' : '24rpx'}">
                <cover-view class="box-grow-1">
                    <cover-view class="t-omit">{{mall.name}}</cover-view>
                    <cover-view class="general">{{config.address.address}}</cover-view>
                </cover-view>
                <cover-view class="box-grow-0 cross-center" @click="mobile">
                    <cover-image class="mobile" src="/static/image/icon/store-tel.png"></cover-image>
                </cover-view>
            </cover-view>
        </view>
    </app-layout>
</template>

<script>
    import {mapState} from 'vuex';
    export default {
        name: "map",
        data() {
            return {
                config: null,
            };
        },
        onLoad() { this.$commonLoad.onload();
            this.loadData();
        },
        computed: {
            // #ifdef MP
            polygons() {
                let polygons = [];
                if (this.config && this.config.range && this.config.range.length > 0) {
                    let points = [];
                    for (let i in this.config.range) {
                        points.push({
                            latitude: this.config.range[i].lat,
                            longitude: this.config.range[i].lng,
                        });
                    }
                    polygons.push({
                        points: points,
                        // #ifndef MP-ALIPAY
                        strokeColor: '#4d77ff',
                        strokeWidth: 2,
                        // #endif
                        // #ifdef MP-ALIPAY
                        color: '#4d77ff',
                        width: 2,
                        // #endif
                        fillColor: '#4d77ff40',
                    });
                }
                return polygons;
            },
            // #endif
            // #ifdef H5
            polyline() {
                let polyline = [];
                if (this.config && this.config.range && this.config.range.length > 0) {
                    let points = [];
                    for (let i in this.config.range) {
                        points.push({
                            latitude: this.config.range[i].lat,
                            longitude: this.config.range[i].lng
                        });
                    }
                    polyline.push({
                        points: points,
                        color: '#4d77ff',
                        width: 2,
                        borderWidth: 2
                    });
                }
                return polyline;
            },
            // #endif
            markers() {
                let markers = [];
                if (this.config && this.config.range && this.config.address) {
                    markers.push({
                        latitude: this.config.address.latitude,
                        longitude: this.config.address.longitude,
                        // #ifndef MP-ALIPAY
                        callout: {
                            content: this.mall.name,
                            color: '#353535',
                            bgColor: '#ffffff',
                            display: 'ALWAYS',
                            fontSize: 13,
                            padding: 4,
                            borderWidth: 2,
                            borderRadius: 10,
                            borderColor: '#ffffff'
                        },
                        anchor: {
                            x: 0.5,
                            y: 1
                        },
                        // #endif
                        // #ifdef MP-ALIPAY
                        anchorX: 0.5,
                        anchorY: 1,
                        customCallout: {
                            "type": 2,
                            "descList": [{
                                "desc": this.mall.name,
                                "descColor": "#353535"
                            }],
                            "isShow": 1
                        },
                        // #endif
                        iconPath: '/static/image/location.png',
                        width: 20,
                        height: 20,
                    })
                }
                return markers;
            },
            ...mapState({
                mall: state => state.mallConfig.mall,
                iPhoneX: state => state.iPhoneX
            }),
        },
        methods: {
            loadData() {
                this.$request({
                    url: this.$api.order.delivery,
                    method: 'post',
                }).then(response => {
                    if (response.code == 0) {
                        this.config = response.data.config;
                    } else {
                        uni.showModal({
                            content: response.msg,
                            showCancel: false
                        });
                    }
                })
            },
            mobile() {
                uni.makePhoneCall({
                    phoneNumber: this.config.contact_way,
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .map {
        map {
            width: 100%;
            height: #{1334rpx};
        }

        .bottom {
            position: fixed;
            bottom: 0;
            left: 0;
            width: #{750rpx};
            padding: #{24rpx};
            background-color: #ffffff;

            .mobile {
                width: #{40rpx};
                height: #{40rpx};
                display: block;
            }

            .general {
                color: $uni-general-color-two;
                font-size: $uni-font-size-weak-one;
            }
        }
    }
</style>