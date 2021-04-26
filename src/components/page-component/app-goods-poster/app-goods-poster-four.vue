<template>
    <view class="app-goods-poster-four">
        <view class="box dir-top" :style="{'background': `${background}`,'transform' : `scale(${multiple},${multiple})`}">
            <view class="user cross-center">
                <image :src="info.avatar"></image>
                <view class="cross-center">{{info.nickname}}{{customize}}</view>
            </view>
            <view class="goods dir-top-nowrap">
                <view class="goods-head dir-top-nowrap">
                    <view class="goods-name t-omit-two">{{info.goods_name}}</view>
                    <view class="goods-price">
                        <app-poster-price :info="info"></app-poster-price>
                    </view>
                </view>
                <view class="goods-image box-grow-0">
                    <app-poster-image :form="form" :info="info"></app-poster-image>
                </view>
                <view class="box-grow-1 dir-top-nowrap four-end">
                    <image :src="info.qrcode_url"></image>
                    <view>{{(info.extra_mark && info.extra_mark[3]) ? info.extra_mark[3] : `长按识别小程序码进入`}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import appPosterImage from "./app-poster-image";
    import appPosterPrice from "./app-poster-price"

    export default {
        name: "app-goods-poster-four",
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
            customize() {
                if (this.info.customize_text) {
                    return this.info.customize_text;
                } else {
                    return '向您推荐一个好物';
                }
            },
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
    .app-goods-poster-four {
        height: 100%;
        width: 100%;
        padding: #{24rpx} 0;

        .box {
            transform: scale(0.46, 0.46);
            transform-origin: center top;
            /*zoom: 0.46;*/
            width: #{750rpx};
            height: #{1334rpx};
            margin: 0 auto;

            .user {
                padding: #{24rpx} #{35rpx};

                image {
                    height: #{100rpx};
                    width: #{100rpx};
                    border: #{5rpx} solid #FFFFFF;
                    border-radius: 50%;
                    margin-right: #{16rpx};
                }

                view {
                    height: #{54rpx};
                    background: #f1f1f1;
                    padding: 0 #{24rpx};
                    font-size: #{24rpx};
                    border-radius: #{30rpx};
                }
            }

            .goods {
                height: #{1334rpx - 160rpx - 24rpx};
                width: #{750rpx -  24rpx - 24rpx};
                background: #ffffff;
                margin: 0 auto;
                border-radius: #{16rpx};

                .goods-head {
                    padding: #{28rpx};
                    height: #{248rpx};
                    width: 100%;

                    .goods-name {
                        font-size: #{34rpx};
                        color: #353535;
                    }

                    .goods-price {
                        margin-top: auto;
                        margin-bottom: #{30rpx};
                    }
                }

                .goods-image {
                    height: #{650rpx};
                    width: #{650rpx};
                    margin: 0 auto;
                }

                .four-end {
                    text-align: center;
                    padding-top: #{32rpx};

                    image {
                        height: #{150rpx};
                        width: #{150rpx};
                        display: block;
                        margin: 0 auto;
                    }

                    view {
                        font-size: #{24rpx};
                        color: #999999;
                        padding-top: #{22rpx};
                        padding-right: #{26rpx};
                    }
                }
            }
        }
    }
</style>