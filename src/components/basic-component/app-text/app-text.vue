<template>
    <text :style="textStyle">
        <slot></slot>
    </text>
</template>

<script>
    export default {
        name: 'app-text',
        props: {
            theme: Object,
            fontSize: String,
            color: String,
        },
        computed: {
            textStyle() {
                let style = `font-size: ${this.fontSize ? this.fontSize : 32}rpx;color: ${this.color ? this.color : this.theme.color};`;
                return style;
            }
        }
    }
</script>

<style scoped lang="scss">
</style>