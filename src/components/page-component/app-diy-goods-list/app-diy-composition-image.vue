<template>
    <view class="app-diy-composition-image">
        <view class="goods-one dir-left-wrap" :class="imageClass">
            <block v-for="(item,key) in imageList" :key="key">
                <image :mode="mode" :src="item"></image>
            </block>
        </view>
    </view>
</template>

<script>
    export default {
        name: "app-diy-composition-image",
        props: {
            imageList: Array,
            mode: String,
        },
        computed: {
            imageClass() {
                let count = this.imageList.length;
                switch (count) {
                    case 1:
                        return 'goods-one';
                    case 2:
                        return 'goods-two';
                    case 3:
                        return 'goods-three';
                    case 4:
                        return 'goods-four';
                    case 5:
                        return 'goods-five';
                }
            },
        },
    }
</script>

<style scoped lang="scss">

    .app-diy-composition-image {
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
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 48.8%;
            }

            image:nth-child(2) {
                position: absolute;
                top: 0;
                right: 0;
                height: 100%;
                width: 48.8%;
            }
        }

        .goods-three {
            height: 100%;
            width: 100%;

            image:nth-child(1) {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 48.8%;
            }

            image:nth-child(2) {
                position: absolute;
                top: 0;
                right: 0;
                height: 48.8%;
                width: 48.8%;
            }

            image:nth-child(3) {
                position: absolute;
                bottom: 0;
                right: 0;
                height: 48.8%;
                width: 48.8%;
            }
        }

        .goods-four {
            height: 100%;
            width: 100%;

            image:nth-child(1) {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 48.8%;
            }

            image:nth-child(2) {
                position: absolute;
                top: 0;
                right: 0;
                height: 48.8%;
                width: 48.8%;
            }

            image:nth-child(3) {
                position: absolute;
                bottom: 0;
                left: calc(50% + 4rpx);
                height: 48.8%;
                width: calc(24.4% - 4rpx);
            }

            image:nth-child(4) {
                position: absolute;
                bottom: 0;
                right: 0;
                height: 48.8%;
                width: calc(24.4% - 4rpx);
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
                height: 100%;
                width: 48.8%;
            }

            image:nth-child(2) {
                position: absolute;
                top: 0;
                left: calc(50% + 4rpx);
                height: 48.8%;
                width: calc(24.4% - 4rpx);
            }

            image:nth-child(3) {
                position: absolute;
                top: 0;
                right: 0;
                height: 48.8%;
                width: calc(24.4% - 4rpx);
            }

            image:nth-child(4) {
                position: absolute;
                bottom: 0;
                left: calc(50% + 4rpx);
                height: 48.8%;
                width: calc(24.4% - 4rpx);
            }

            image:nth-child(5) {
                position: absolute;
                bottom: 0;
                right: 0;
                height: 48.8%;
                width: calc(24.4% - 4rpx);
            }
        }
    }
</style>