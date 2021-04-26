<template>
    <view class="app-image" :style="appBackground" v-if="imgSrc">
        <image src="/static/image/icon/loading-img.png" class="img" :class="is_error ? '' : 'default'"
               mode="aspectFill" lazy-load v-if="is_loading" :style="imgStyle"></image>
        <image :src="imgSrc" class="img" :mode="mode" @error="imgError" @load="imgLoad" lazy-load
               v-if="!is_error" :style="imgStyle"></image>
    </view>
</template>

<script>
    export default {
        name: "app-image",
        props: {
            imgSrc: String,
            width: String,
            height: String,
            mode: {
                type: String,
                default() {
                    return 'aspectFill';
                }
            },
            borderRadius: String,
        },
        data() {
            return {
                is_loading: true,
                is_error: false
            };
        },
        computed: {
            appBackground() {
                return `width: ${this.width};height: ${this.height};`;
            },
            imgStyle() {
                return `border-radius: ${this.borderRadius}`;
            },
        },

        methods: {
            imgError() {
                this.is_error = true;
            },
            imgLoad() {
                this.is_loading = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-image {
        display: block;
        position: relative;
        .img {
            width: 100%;
            height: 100%;
            display: block;
            will-change: transform;

            &.default {
                position: absolute;
                left: 0;
                top: 0;
                z-index: 0;
            }
        }
    }
</style>