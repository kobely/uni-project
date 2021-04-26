<template>
    <view class="app-goods-poster-two main-center">
        <view class="box" :style="{'background': `${background}`,'transform' : `scale(${multiple},${multiple})`}">
            <view class="goods-image">
                <app-poster-image :form="form" :info="info"></app-poster-image>
            </view>
            <view class="dir-top-nowrap end-bg">
                <view class="goods-name t-omit-two">{{info.goods_name}}</view>
                <view :class="info.sign === 'flash_sale' ? 'flash-sale' : 'goods-price'">
                    <app-poster-price :info="info"></app-poster-price>
                </view>
                <view class="dir-left-nowrap end-info cross-center">
                    <view class="dir-top-nowrap">
                        <view class="dir-left-nowrap cross-center user">
                            <image :src="info.avatar" class="box-grow-0"></image>
                            <view class="t-omit dir-top-nowrap">
                                <view>{{info.nickname}}</view>
                                <view v-if="(info.extra_mark && info.extra_mark[5])">{{info.extra_mark[5]}}</view>
                            </view>
                        </view>
                        <view class="goods-remark dir-left-nowrap">
                            <view class="dir-left-nowrap cross-center">
                                <view>{{ (info.extra_mark && info.extra_mark[1]) ? info.extra_mark[1] : `长按识别小程序码进入`}}</view>
                                <icon class="icon-three-arrow" type></icon>
                            </view>
                        </view>
                    </view>
                    <view class="poster-qrcode">
                        <image :src="info.qrcode_url"></image>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import appPosterImage from "./app-poster-image.vue";
    import appPosterPrice from "./app-poster-price.vue";

    export default {
        name: "app-goods-poster-two",
        components: {
            appPosterImage,
            appPosterPrice,
        },
        props: {
            multiple: {
                type: Number,
                required: true,
            },
            info: {
                type: Object,
                required: true,
            },
            form: {
                type: Object,
                required: true,
            },
        },
        computed: {
            background() {
                if (parseInt(this.form.type) === 2) {
                    let top = this.form.color;
                    let bottom = this.$utils.colorRgba(this.form.color, 0.5);
                    return 'linear-gradient(' + top + ',' + bottom + ')';
                } else {
                    return this.form.color;
                }
            },
        },
    }
</script>

<style scoped lang="scss">
    .app-goods-poster-two {
        height: 100%;
        width: 100%;
        padding: #{24rpx} 0;

        .box {
            transform-origin: center top;
            /*zoom: 0.46;*/
            width: #{750rpx};
            height: #{1334rpx};
            margin: 0 auto;

            .goods-image {
                height: #{750rpx};
                width: 100%;
                overflow: hidden;
            }

            .end-bg {
                height: #{616rpx};
                width: #{702rpx};
                background-image: url("../../../static/image/poster/style-two-end-shadow.png");
                background-size: 100% 100%;
                background-repeat: no-repeat;
                padding: 0 #{26rpx};

                position: absolute;
                left: #{24rpx};
                bottom: #{24rpx};
                z-index: 50;

                .goods-name {
                    font-size: #{34rpx};
                    color: #353535;
                    margin-top: #{36rpx};
                }

                .goods-price {
                    margin-top: auto;
                    margin-bottom: #{400rpx};
                }
                .flash-sale {
                    margin-top: auto;
                    margin-bottom: #{430rpx};
                }
                .end-info {
                    width: 100%;
                    justify-content: space-between;
                    position: absolute;
                    bottom: #{28rpx};
                    padding-left: #{40rpx};
                    padding-right: #{40rpx};

                    .user {
                        padding-bottom: #{24rpx};

                        image {
                            height: #{96rpx};
                            width: #{96rpx};
                            display: block;
                            border-radius: 50%;
                        }

                        > view {
                            max-width: #{250rpx};
                            margin-left: #{26rpx};
                        }
                    }

                    .poster-qrcode image {
                        height: #{230rpx};
                        width: #{230rpx};
                        display: block;
                    }

                    .goods-remark {
                        color: #353535;
                        height: #{52rpx};
                        font-size: #{24rpx};

                        > view {
                            height: 100%;
                            background: #f1f1f1;
                            padding: 0 #{20rpx};
                            border-radius: #{20px};
                        }
                    }

                    .icon-three-arrow {
                        height: #{17rpx};
                        width: #{15rpx};
                        background-image: url("../../../static/image/poster/three-arrow.png");
                        background-size: 100% 100%;
                        background-repeat: no-repeat;
                        margin-left: #{10rpx};
                    }
                }
            }
        }
    }
</style>