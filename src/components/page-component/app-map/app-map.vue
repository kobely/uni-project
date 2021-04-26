<template>
    <view :style="{background: `${marginTopColor}`,paddingTop: `${marginTop}rpx`}">
        <view class="main-center app-map"
              :style="{background: `${backgroundColor}`,padding: `${paddingY}rpx ${paddingX}rpx`, backgroundImage:  `url(${backgroundPicUrl? backgroundPicUrl : ''})`}">
            <map enable-3D
                 show-compass
                 enable-overlooking
                 enable-zoom
                 enable-scroll
                 enable-rotate
                 show-location
                 @callouttap="openMap"
                 :markers="markers"
                 :latitude="latitude"
                 :longitude="longitude"
                 :style="{height: `${height}rpx`}"
            ></map>
        </view>
    </view>
</template>

<script>
	// 头条小程序 不支持 地图组件
    export default {
        name: "app-map",
	    props: {
            backgroundColor: String,
            backgroundPicUrl: String,
            height: Number,
            latitude: String,
            longitude: String,
            marginTop: Number,
            marginTopColor: String,
            paddingX: Number,
            paddingY: Number,
            address: {
                type: String,
                default() {
                    return '';
                }
            },
	    },
        data() {
            return {
                markers: [],
            };
        },
        mounted() {
            const self = this;
            let marker = {
                iconPath: "../../../static/image/summary-map.png",
                id: 0,
                width: 43,
                height: 43,
                latitude: this.latitude,
                longitude: this.longitude,
            };
            if (self.address) {
                marker.callout = {
                    content: self.address,
                    color: '#353535',
                    fontSize: '13',
                    bgColor: '#FFFFFF',
                    display: 'ALWAYS',
                    textAlign: 'center',
                    padding: '20rpx',
                }
            }
            self.markers = [marker];
        },
        methods: {
            openMap() {
                // #ifdef MP
                uni.openLocation({
                    latitude: parseFloat(this.latitude),
                    longitude: parseFloat(this.longitude),
                    name: this.address,
                    address: this.address,
                });
                // #endif
                // #ifdef H5
                this.$jwx.openlocation({
                    latitude: parseFloat(this.latitude),
                    longitude: parseFloat(this.longitude),
                    name: this.address,
                    address: this.address,
                });
                // #endif
            },
        }
    }
</script>

<style scoped lang="scss">
    .app-map {
        background-repeat: no-repeat;
		background-size: 100% 100%;

        map {
            width: 100%;
        }
	}
</style>