<template>
    <view class="app-goods-poster-one main-center">
        <view class="box" :style="{'background': `${background}`,'transform' : `scale(${multiple},${multiple})`}">
            <view class="head cross-center">
                <image :src="info.avatar"></image>
                <view class="nickname main-center cross-center">
                    {{info.nickname}}{{customize}}
                </view>
            </view>
            <view class="goods-image">
                <app-poster-image :form="form" :info="info"></app-poster-image>
            </view>
            <view class="end dir-left-nowrap">
                <view class="dir-top-nowrap goods-info">
                    <view class="goods-name t-omit-two">{{info.goods_name}}</view>
                    <view class="goods-price">
                        <app-poster-price :info="info"></app-poster-price>
                    </view>
                    <view class="goods-remark">{{(info.extra_mark && info.extra_mark[0]) ? info.extra_mark[0] : `长按识别小程序码进入`}}</view>
                </view>
                <view class="poster cross-center">
                    <image :src="info.qrcode_url"></image>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import appPosterImage from "./app-poster-image.vue";
    import appPosterPrice from "./app-poster-price.vue";

    export default {
        name: "app-goods-poster-one",
        components: {
            appPosterImage,
            appPosterPrice
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
            customize() {
                if (this.info.customize_text) {
                    return this.info.customize_text;
                } else {
                    return '向您推荐一个好物';
                }
            },
            background() {
                if (parseInt(this.form.type) === 2) {
                    return `linear-gradient(${this.form.color},${this.$utils.colorRgba(this.form.color, 0.5)})`;
                } else {
                    return this.form.color;
                }
            }
        },
    }
</script>

<style scoped lang="scss">
    .app-goods-poster-one {
        height: 100%;
        width: 100%;
        padding: #{24rpx} 0;

        .box {
            transform: scale(0.46, 0.46);
            transform-origin: center top;
            /*zoom: 0.46;*/
            width: #{750rpx};
            height: #{1334rpx};
            padding: 0 #{24rpx};
            margin: auto;

            .head {
                padding-top: #{96rpx};
                margin-bottom: #{39rpx};
                width: 100%;

                image {
                    height: #{90rpx};
                    width: #{90rpx};
                    display: block;
                    border-radius: 50%;
                }

                .nickname {
                    line-height: #{54rpx};
                    padding: 0 #{24rpx};
                    margin-left: #{24rpx};
                    font-size: #{24rpx};
                    background: #f1f1f1;
                    color: #4b4b4b;
                    border-radius: #{30rpx};
                }
            }

            .goods-image {
                height: #{702rpx};
                width: 100%;
                border-radius: #{16rpx} #{16rpx} 0 0;
                overflow: hidden;
            }

            .end {
                background: #ffffff;
                height: #{311rpx};
                border-radius: 0 0 #{16rpx} #{16rpx};
                padding: #{28rpx};
                margin-top: -1px;

                .goods-info {
                    max-width: #{450rpx};

                    .goods-name {
                        font-size: #{34rpx};
                        color: #353535;
                    }

                    .goods-price {
                        margin-top: auto;
                        padding-bottom: #{65rpx};
                    }

                    .goods-remark {
                        line-height: 1;
                        color: #999999;
                        padding-bottom: #{40rpx - 28rpx};
                        font-size: #{28rpx};
                    }
                }

                .poster {
                    height: 100%;
                    margin-left: auto;

                    image {
                        height: #{230rpx};
                        width: #{230rpx};
                        display: block;
                    }
                }
            }
        }
    }
</style>