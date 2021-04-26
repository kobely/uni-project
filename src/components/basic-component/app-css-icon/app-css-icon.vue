<template>
    <view class="app-css-icon"
          :class="[icon,round?'round':'',padding?'padding':'']"
          :style="{
          borderColor: color,
          fontSize: iSize,
          transform: transform,
          backgroundColor: background,
          }"></view>
</template>

<script>
    export default {
        name: "app-css-icon",
        props: {
            icon: {
                default: 'point',
                type: String,
            },
            size: {
                default: 50,
            },
            color: {
                default: '#333',
                type: String,
            },
            transform: {
                default: '',
            },
            background: {
                default: 'transparent',
                type: String,
            },
            round: {
                default: false,
                type: Boolean,
            },
            padding: {
                default: false,
                type: Boolean,
            },
        },
        computed: {
            iSize() {
                if (isNaN(this.size)) {
                    return `${this.size}`;
                } else {
                    return `${this.size}rpx`;
                }
            },
        },
    }
</script>

<style scoped lang="scss">
    .app-css-icon {
        display: inline-block;
        height: 1em;
        width: 1em;
        box-sizing: border-box;
        text-indent: -#{100em};
        vertical-align: middle;
        position: relative;
        overflow: hidden;
        transform: translate(0, -10%);
    }

    .app-css-icon.round {
        border-radius: 10em;
    }

    .app-css-icon::before,
    .app-css-icon::after {
        content: '';
        box-sizing: inherit;
        position: absolute;
        left: 50%;
        top: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        border-color: inherit;
    }

    .check::before {
        border-style: solid;
        border-width: 0 0 .15em .15em;
        height: .5em;
        width: .9em;
        transform: translate(-50%, -.375em) rotate(-45deg);
    }

    .padding.check::before {
        border-width: 0 0 .1em .1em;
        height: .333em;
        width: .6em;
        transform: translate(-50%, -.25em) rotate(-45deg);
    }


    .arrow-right::before {
        height: .65em;
        width: .65em;
        border-style: solid;
        border-width: .15em 0 0 .15em;
        transform: translate(-75%, -50%) rotate(135deg);
    }

    .padding.arrow-right::before {
        height: .4333em;
        width: .4333em;
        border-style: solid;
        border-width: .1em 0 0 .1em;
        transform: translate(-75%, -50%) rotate(135deg);
    }
</style>