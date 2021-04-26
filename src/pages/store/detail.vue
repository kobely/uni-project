<template>
    <app-layout>
        <app-swiper :height="360" :list="list.pic_url" :autoplay="true" name="pic_url"></app-swiper>
        <view class="head">
            <view class="name">{{list.name}}</view>
            <view class="dir-left-nowrap cross-center score">
                <view class="box-grow-0">评分：</view>
                <icon v-for="i in list.score" :key="i" class="box-grow-0 image" type></icon>
            </view>
            <view class="time">营业时间：{{list.business_hours}}</view>
        </view>
        <view class="cross-center tel">
            <view class="box-grow-0">电话：</view>
            <view class="box-grow-1 info">{{list.mobile}}</view>
            <image @click="mobile" class="box-grow-0" src="/static/image/icon/store-tel.png"></image>
        </view>
        <view class="cross-top address">
            <view class="box-grow-0">地址：</view>
            <view class="box-grow-1 info">{{list.address}}</view>
            <image @click="goto" class="box-grow-0" src="/static/image/icon/store-navigate.png"></image>
        </view>
        <view class="bg-line"></view>
        <view class="content cross-center">店铺介绍</view>
        <view class="end">
            <app-rich-text :content="list.description"></app-rich-text>
        </view>
    </app-layout>
</template>

<script>
    import appSwiper from "../../components/page-component/app-swiper/app-swiper.vue";
    import appRichText from "../../components/basic-component/app-rich/parse.vue";

    export default {
        name: "detail",
        components: {appSwiper, appRichText},

        data() {
            return {
                list: {
                    business_hours: '',
                    name: '',
                    mobile: '',
                    score: '',
                    address: '',
                    description: '',
                },
            }
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: this.list.name,
                path: '/pages/store/detail',
                params: {
                    id: this.list.id,
                }
            });
        },
        // #endif
        onLoad(options) { this.$commonLoad.onload(options);
            if (!options.id) {
                return;
            }
            const self = this;
            self.$showLoading({title: '加载中'});
            self.$request({
                url: self.$api.store.detail,
                data: {
                    id: options.id
                }
            }).then(info => {
                self.$hideLoading();
                if (info.code === 0) {
                    //#ifdef MP-BAIDU
                    const score = info.data.list.score;
                    let array = [];
                    for (let i = 0; i < score; i++) {
                        array.push(i);
                    }
                    info.data.list.score = array;
                    //#endif
                    self.list = info.data.list;
                }
            }).catch(info => {
                self.$hideLoading();
            })
        },

        methods: {
            goto: function (e) {
                const list = this.list;
                uni.openLocation({
                    latitude: parseFloat(list.latitude),
                    longitude: parseFloat(list.longitude),
                    name: list.name,
                    address: list.address,
                })
            },
            mobile: function () {
                uni.makePhoneCall({
                    phoneNumber: this.list.mobile,
                })
            },
        }

    }
</script>

<style scoped lang="scss">
    .head {
        background: #FFFFFF;
        padding: 0 #{24rpx};
        font-size: #{26rpx};
        color: #999999;
        border-bottom: #{1px} solid #e2e2e2;

        .name {
            font-size: #{32rpx};
            font-weight: bold;
            color: #353535;
            padding-top: #{24rpx};
        }

        .score {
            margin-top: #{24rpx};

            .image {
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-image: url('../../static/image/icon/store-score.png');
                margin-left: #{6rpx};
                height: #{24rpx};
                width: #{28rpx};
            }
        }

        .time {
            margin-top: #{16rpx};
            margin-bottom: #{28rpx};
        }

    }

    .tel, .address {
        background: #FFFFFF;
        font-size: #{28rpx};
        color: #353535;
        padding: #{34rpx} 0 #{34rpx} #{24rpx};
        border-bottom: #{1px} solid #e2e2e2;

        .info {
            border-right: #{1px} solid #e2e2e2;
            padding-right: #{60rpx};
        }

        image {
            height: #{40rpx};
            width: #{40rpx};
            margin: 0 #{40rpx};
            align-self: center;
        }
    }

    .address {
        border-bottom: none;
    }

    .bg-line {
        background: #f7f7f7;
        height: #{20rpx};
        width: #{100%};
    }

    .content {
        background: #FFFFFF;
        padding-left: #{24rpx};
        height: #{72rpx};
        font-size: #{26rpx};
        color: #353535;
        border-bottom: #{1px} solid #e2e2e2;
    }

    .end {
        background: #FFFFFF;
        padding: #{32rpx} #{24rpx} #{32rpx};
    }
</style>