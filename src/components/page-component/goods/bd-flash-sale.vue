<template>
    <view class="f-flash">
        <view class="f-con cross-center"
              :style="flashStyle" @click="navigator">
            <view class="f-sign" :style="{'background-color': theme.background}">限时抢购</view>
            <view class="f-title">
                {{flashSale.discount_type == 2 ? '减': ''}}
                {{flashSale.min_discount}}
                {{flashSale.discount_type == 2 ? '元' : '折'}}&nbsp;&nbsp;
                {{flashSale.time_status == 1 ? flashSale.start_at : flashSale.end_at}}
                {{flashSale.time_status == 1 ? '开始' : '结束'}}
            </view>
            <view class="f-text" :style="{'color': theme.color}">
                去{{flashSale.time_status == 1 ? '加' : '抢'}}购
            </view>
            <image class="f-icon" src="/static/image/icon/flash-sale.gif"></image>
        </view>
    </view>
</template>

<script>
export default {
    name: "bd-flash-sale",
    props: {
        flashSale: {
            type: Object,
            default() {
                return {
                    time_status: 1,
                    start_at: '',
                    end_at: '',
                    min_discount: ''
                }
            }
        },
        theme: Object
    },
    computed:{
        flashStyle() {
            if(this.theme.theme == 'a' && this.flashSale.cover) {
                return "background-image: url('" + this.flashSale.cover + ')'
            }else {
                return "background:" + this.theme.background_p
            }
        }
    },
    methods: {
        navigator() {
            uni.navigateTo({
                url: this.flashSale.url
            });
        }
    }
}
</script>

<style scoped lang="scss">
.f-flash {
    background-color: #ffffff;
}
.f-con {
    width: 662upx;
    height: 88upx;
    position: relative;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 16upx;
}
.f-back {
    width: 100%;
    height: 100%;
    position: absolute;
}
.f-sign {
    height: 34upx;
    width: 100upx;
    font-size: 20upx;
    color: #fff;
    text-align: center;
    line-height: 34upx;
    border-radius: 17upx;
    margin:0 20upx;
}
.f-title {
    font-size: 26upx;
    color: #353535;
}
.f-icon {
    width: 54upx;
    height: 63upx;
    position: absolute;
    right: 22upx;
}
.f-text {
    font-size: 26upx;
    position: absolute;
    right: 80upx;
    font-weight: bold;
}
</style>
