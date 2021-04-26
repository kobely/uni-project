<template>
    <view class="app-poster-image">

        <view class="goods-one dir-left-wrap" v-if="form.typesetting==1">
            <block v-for="(item,key) in info.multi_map" :key="key">
                <image mode="aspectFill" v-if="key <= 0" :src="item"></image>
            </block>
        </view>

        <view class="goods-two dir-left-wrap" v-else-if="form.typesetting==2">
            <block v-for="(item,key) in info.multi_map" :key="key">
                <image mode="aspectFill" v-if="key <= 1" :src="item"></image>
            </block>
        </view>

        <view class="goods-three dir-left-wrap" v-else-if="form.typesetting==3">
            <block v-for="(item,key) in info.multi_map" :key="key">
                <image mode="aspectFill" v-if="key <= 2" :src="item"></image>
            </block>
        </view>

        <view class="goods-four dir-left-wrap" v-else-if="form.typesetting==4">
            <block v-for="(item,key) in info.multi_map" :key="key">
                <image mode="aspectFill" v-if="key <= 3" :src="item"></image>
            </block>
        </view>

        <view class="goods-five dir-left-wrap" v-else-if="form.typesetting==5">
            <block v-for="(item,key) in info.multi_map" :key="key">
                <image mode="aspectFill" v-if="key <= 4" :src="item"></image>
            </block>
        </view>

        <view v-if="info.extra_multiMap" v-for="(item,key) in info.extra_multiMap" :key="key">
            <view v-if="item.file_type === 'image'" class="plugin-image-class" :style="[pluginIconStyle(item)]">
                <image :src="item.image_url"></image>
            </view>
            <view v-else-if="item.file_type === 'text'" class="plugin-text-class" :style="[pluginTextStyle(item)]">
                <text>{{item.text}}</text>
            </view>
        </view>

    </view>
</template>

<script>

    export default {
        name: "app-poster-image",
        props: {
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
            pluginTextStyle() {
                return (data) => {
                    let style = {};
                    if (data.bottom !== undefined && this.form.style != 2) {
                        style = {bottom: parseFloat(data.bottom) - 43 + 'rpx'}
                    }
                    return Object.assign({}, data, style);
                }
            },

            pluginIconStyle() {
                return (data) => {
                    let style = {};
                    if (data.bottom !== undefined && this.form.style != 2) {
                        style = {bottom: parseFloat(data.bottom) - 40 + 'rpx'};
                    }
                    return Object.assign({}, data, style)
                }
            },
        },
    }
</script>

<style scoped lang="scss">

    .app-poster-image {
        height: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;

        .plugin-text-class {
            position: absolute;
            z-index: 11;
        }

        .plugin-image-class {
            position: absolute;
            z-index: 10;

            image {
                height: 100%;
                width: 100%;
            }
        }

        image {
            display: block;
        }

        .goods-one {
            height: 100%;
            width: 100%;

            image {
                height: 100%;
                width: 100%;

            }
        }

        .goods-two {
            height: 100%;
            width: 100%;

            image:nth-child(1) {
                height: 50%;
                width: 100%;
            }

            image:nth-child(2) {
                height: 50%;
                width: 100%;
            }
        }

        .goods-three {
            height: 100%;
            width: 100%;

            image:nth-child(1) {
                height: 50%;
                width: 100%;
            }

            image:nth-child(2) {
                height: 50%;
                width: 50%;
            }

            image:nth-child(3) {
                height: 50%;
                width: 50%;
            }
        }

        .goods-four {
            height: 100%;
            width: 100%;

            image:nth-child(1) {
                height: 50%;
                width: 50%;
            }

            image:nth-child(2) {
                height: 50%;
                width: 50%;
            }

            image:nth-child(3) {
                height: 50%;
                width: 50%;
            }

            image:nth-child(4) {
                height: 50%;
                width: 50%;
            }
        }

        .goods-five {
            height: 100%;
            width: 100%;
            position: relative;

            image:nth-child(1) {
                position: absolute;
                top: 0;
                left: 0;
                height: 50%;
                width: 50%;
            }

            image:nth-child(2) {
                position: absolute;
                top: 50%;
                left: 0;
                height: 50%;
                width: 50%;
            }

            image:nth-child(3) {
                position: absolute;
                top: 0;
                left: 50%;
                height: 33.333%;
                width: 50%;
            }

            image:nth-child(4) {
                position: absolute;
                top: 33.33%;
                left: 50%;
                height: 33.333%;
                width: 50%;
            }

            image:nth-child(5) {
                position: absolute;
                top: 66.66%;
                left: 50%;
                height: 33.333%;
                width: 50%;
            }
        }
    }
</style>