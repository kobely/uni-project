<template>
    <view class="app-goods-poster-three">
        <view class="box dir-top-nowrap" :style="{'background': `${background}`,'transform' : `scale(${multiple},${multiple})`}">
            <view class="user dir-left-nowrap box-grow-0">
                <image :src="info.avatar"></image>
                <view class="poster-three-love" :class="{'white': colorWhite.indexOf(background) !== -1}">
                    我看上了这款商品<br>
                    {{(info.extra_mark && info.extra_mark[4]) ? info.extra_mark[4] : `帮我看看咋样啊~`}}<br>
                    比心~
                </view>
            </view>
            <view class="goods-image box-grow-0">
                <app-poster-image :form="form" :info="info"></app-poster-image>
            </view>
            <view class="goods cross-center dir-top-nowrap main-center box-grow-1">
                <view class="goods-name t-omit" :class="{'white': colorWhite.indexOf(background) !== -1}">
                    {{info.goods_name}}
                </view>
                <view class="goods-price">
                    <app-poster-price :info="info" :white-color="colorWhite.indexOf(background) !== -1"
                                      :text-color="colorBlock.indexOf(background) !== -1 ? `#353535`: ``"></app-poster-price>
                </view>
            </view>
            <view class="dir-left-nowrap main-center box-grow-0 end-box cross-center">
                <image :src="info.qrcode_url"></image>
                <text :class="{'white': colorWhite.indexOf(background) !== -1}">{{(info.extra_mark && info.extra_mark[2]) ? info.extra_mark[2] : `长按识别小程序码 即可查看~`}}</text>
            </view>
        </view>
    </view>
</template>

<script>
    import appPosterImage from "./app-poster-image";
    import appPosterPrice from "./app-poster-price"

    export default {
        name: "app-goods-poster-three",
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
        data() {
            return {
                colorWhite: ['linear-gradient(#000000,rgba(0,0,0,0.5))', '#000000'],
                colorBlock: ['linear-gradient(#fc4a3b,rgba(252,74,59,0.5))', '#fc4a3b'],
            }
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
    .app-goods-poster-three {
        height: 100%;
        width: 100%;
        padding: #{24rpx} 0;

        .white {
            color: #d9d9d9 !important;
        }

        .box {
            transform: scale(0.46, 0.46);
            transform-origin: center top;
            /*zoom: 0.46;*/
            width: #{750rpx};
            height: #{1334rpx};
            margin: 0 auto;

            .user {
                padding: #{40rpx} #{35rpx} #{38rpx} #{35rpx};

                image {
                    display: block;
                    width: #{97rpx};
                    height: #{97rpx};
                    margin-right: #{30rpx};
                    border-radius: 50%;
                }

                .poster-three-love {
                    font-size: #{26rpx};
                    color: #353535;
                }

                .poster-three-love:after {
                    content: "";
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    background-image: url("../../../static/image/poster/three-love.png");
                    height: #{24rpx};
                    width: #{24rpx};
                    display: inline-block;
                    margin-left: #{10rpx};
                }
            }

            .goods-image {
                height: #{680rpx};
                width: #{680rpx};
                margin: 0 auto;
            }

            .goods {
                width: 100%;

                .goods-name {
                    font-size: #{34rpx};
                    color: #353535;
                    max-width: #{600rpx};
                    text-align: center;
                    padding-top: #{28rpx};
                }

                .goods-price {
                    margin-top: auto;
                    margin-bottom: #{55rpx};
                }
            }

            .end-box {
                width: #{702rpx};
                height: #{230rpx + 24rpx + 24rpx};
                border-top: 1px solid #c9c9c9;
                margin: 0 auto;

                image {
                    height: #{230rpx};
                    width: #{230rpx};
                    del-border-radius: 50%;
                    display: block;
                }

                text {
                    color: #353535;
                    padding-left: #{30rpx};
                    font-size: #{26rpx};
                }
            }
        }
    }
</style>