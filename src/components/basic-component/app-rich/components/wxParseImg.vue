<template>
    <image
        :lazy-load="newNode.attr.lazyLoad"
        :class="newNode.classStr"
        :style="newStyleStr || newNode.styleStr"
        :data-src="newNode.attr.src"
        :src="newNode.attr.src"
        @tap="wxParseImgTap"
        @load="wxParseImgLoad"
    />
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: 'wxParseImg',

        data() {
            return {
                style: '',
                preview: true
            };
        },

        props: {
            node: {
                type: Object,
                default() {
                    return {};
                }
            },
            parentNode: {}
        },

        computed: {
            newStyleStr: function() {
                if (this.parentNode.styleStr && this.parentNode.styleStr.indexOf('text-align: center') > -1) {
                    this.style += 'margin: 0 auto';
                }
                return this.style;
            },
            ...mapState('gConfig', {
                windowWidth: (state) => {
                    return state.imageWidth;
                },
            }),
            newNode: function() {
                return this.node;
            }
        },
        methods: {
            wxParseImgTap(e) {
                if (!this.preview) return;
                const { src } = e.currentTarget.dataset;
                if (!src) return;
                let parent = this.$parent;
                while (!parent.preview || typeof parent.preview !== 'function') {
                    parent = parent.$parent;
                }
                parent.preview(src, e);
            },
            // 图片视觉宽高计算函数区
            wxParseImgLoad(e) {
                const { src } = e.currentTarget.dataset;
                if (!src) return;
                let { width, height } = e.mp.detail;
                const recal = this.wxAutoImageCal(width, height);
                const { imageheight, imageWidth } = recal;
                const { padding, mode } = this.newNode.attr;//删除padding
                const { styleStr } = this.newNode;
                const imageHeightStyle = mode === 'widthFix' ? '' : `height: ${imageheight}px;`;
                this.$nextTick().then(() => {
                    this.style = `${styleStr ? styleStr: null}; ${imageHeightStyle}; width: ${imageWidth}; padding: 0 ${+padding}px;display:block;`;//删除padding
                });
            },
            wxAutoImageCal(originalWidth, originalHeight) {
                // 获取图片的原始长宽
                const windowWidth = this.windowWidth;

                const results = {};

                if (originalWidth < 60 || originalHeight < 60) {
                    const { src } = this.newNode.attr;
                    let parent = this.$parent;
                    while (!parent.preview || typeof parent.preview !== 'function') {
                        parent = parent.$parent;
                    }
                    parent.removeImageUrl(src);
                    this.preview = false;
                }
                results.imageWidth = originalWidth;
                results.imageheight = originalHeight;
                // 判断按照那种方式进行缩放
                if (originalWidth  > windowWidth) {
                    // 在图片width大于手机屏幕width时候
                    results.imageWidth = `100%`;
                    results.imageheight = windowWidth * (uni.upx2px(originalHeight) / uni.upx2px(originalWidth));
                } else {
                    // 否则展示原来的数据
                    results.imageWidth = `${uni.upx2px(originalWidth)}px`;
                    results.imageheight = uni.upx2px(originalHeight);
                }
                return results;
            }
        }
    };
</script>

<style lang="scss">
    image:host{
        width: 702upx;
    }
</style>
