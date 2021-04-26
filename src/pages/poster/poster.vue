<template>
    <app-layout>
        <view id="head" class="head">
            <view class="poster main-center cross-center" :style="{'background-image': `url(${info.poster_bg})`}">
                <view class="dir-top-nowrap main-center user">
                    <image :src="info.avatar"></image>
                    <view>{{info.nickname}}</view>
                </view>
                <view class="dir-left-nowrap info" v-if="coupon_id > 0">
                    <view class="main-center cross-center discout" v-if="info.type == 1">{{info.discount}}<text>折</text></view>
                    <view class="main-center cross-center discout" v-if="info.type == 2"><text>￥</text>{{info.sub_price}}</view>
                    <view class="use-info dir-top-nowrap main-center cross-center">
                        <view v-if="info.min_price || info.min_price == 0" class="min-price">{{info.min_price == 0 ? '无门槛使用' : '满'+ info.min_price +'可用'}}</view>
                        <view v-if="info.discount_limit">优惠上限:￥{{info.discount_limit}}</view>
                        <view>{{info.appoint_type}}</view>
                    </view>
                </view>
                <view class="expire" v-if="coupon_id > 0 && info.expire_type">
                    <text>
                        <text>有效期：</text>
                        <text v-if="info.expire_type == '2'">{{info.begin_time}} - {{info.end_time}}</text>
                        <text v-else-if="info.expire_day > 0">领取后{{info.expire_day}}天内有效</text>
                    </text>
                </view>
                <view class="dir-left-nowrap cross-center info" v-if="card_id > 0">
                    <image class="card-pic" :src="info.pic_url"></image>
                    <view class="name t-omit-two">{{info.name}}</view>
                </view>
                <image class="qrcode" :src="info.qrcode"></image>
            </view>
        </view>
        <view class="button main-center cross-center" @click="submitSave"
              :style="{'background-color': getTheme.background}">保存图片
        </view>
    </app-layout>
</template>

<script>
    import { mapState,mapGetters } from "vuex";

    export default {
        data() {
            return {
                card_id: 0,
                coupon_id: 0,
                info: {},
            }
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                poster_img: state => state.mallConfig.__wxapp_img.poster,
            })
        },
        methods: {
            submitSave() {
                this.$showLoading({text: '生成中'});
                let that = this;
                let url;
                let para;
                if(that.card_id > 0) {
                    url = that.$api.poster.card_share;
                    para = {
                        cardId: that.card_id
                    }
                }
                if(that.coupon_id > 0) {
                    url = that.$api.poster.coupon_share;
                    para = {
                        coupon_id: that.coupon_id
                    }
                }
                that.$request({
                    url: url,
                    data: para
                }).then(info => {
                    this.$hideLoading();
                    let { code, data, msg } = info;
                    if (code === 0) {
                        const pic_url = data.pic_url;

                        this.$utils.batchSave(pic_url, 'image').then(() => {
                            uni.showToast({title: '保存成功'});
                        });
                    } else {
                        uni.showToast({title: msg, icon: 'none'});
                    }
                }).catch(() => {
                    this.$hideLoading();
                })
            },
            getList() {
                let that = this;
                let url;
                let para;
                if(that.card_id > 0) {
                    url = that.$api.poster.card;
                    para = {
                        cardId: that.card_id
                    }
                }
                if(that.coupon_id > 0) {
                    url = that.$api.poster.coupon;
                    para = {
                        coupon_id: that.coupon_id
                    }
                }
                that.$request({
                    url: url,
                    data: para
                }).then(response=>{
                    if(response.code == 0) {
                        that.info = response.data;
                    }else {
                        that.$hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            if(options.card_id > 0) {
                that.card_id = options.card_id
            }
            if(options.coupon_id > 0) {
                that.coupon_id = options.coupon_id
            }
            that.getList();
        }
    }
</script>

<style scoped lang="scss">
    .head {
        width: 100%;
        .poster {
            margin: #{50rpx} auto;
            width: #{600rpx};
            height: #{1067.2rpx};
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
            position: relative;
            .user {
                position: absolute;
                top: 52.8rpx;
                left: 0;
                right: 0;
                width: 90%;
                margin: 0 auto;
                color: #fff;
                font-size: 24rpx;
                text-align: center;
                image {
                    border-radius: 50%;
                    width: 104rpx;
                    height: 104rpx;
                    margin: 0 auto 20rpx;
                }
            }
            .info {
                position: absolute;
                top: 274.8rpx;
                left: 0;
                color: #fff;
                height: 156rpx;
                width: 100%;
                .card-pic {
                    width: 96rpx;
                    height: 96rpx;
                    border-radius: 50%;
                    margin: 0 19.2rpx 0 60.8rpx;
                }
                .name {
                    width: 264rpx;
                    color: #353535;
                    font-size: 27rpx;
                }
                .discout {
                    width: 228.8rpx;
                    font-size: 48rpx;
                    text {
                        font-size: 27rpx;
                        margin-top: 14rpx;
                    }
                }
                .use-info {
                    color: #353535;
                    font-size: 24rpx;
                    view {
                        margin: 5rpx 0;
                        width: 100%;
                    }
                    .min-price {
                        font-size: 27rpx;
                    }
                }
            }
            .expire {
                position: absolute;
                bottom: 320rpx;
                left: 0;
                text-align: center;
                width: 100%;
                >text {
                    border-radius: 24rpx;
                    background-color: rgba(0,0,0,.2);
                    padding: 9rpx 19.2rpx;
                    color: #fff;
                    font-size: 20rpx;
                }
            }
            .qrcode {
                position: absolute;
                bottom: 110rpx;
                left: 0;
                right: 0;
                width: 192rpx;
                height: 192rpx;
                margin: 0 auto;
                border-radius: 50%;
            }
        }
    }

    .button {
        font-size: #{32rpx};
        border-radius: #{40rpx};
        height: #{68rpx};
        margin: 0 auto #{50rpx};
        color: #ffffff;
        width: #{500rpx};
    }
</style>
