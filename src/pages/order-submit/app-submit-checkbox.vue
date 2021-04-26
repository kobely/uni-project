<template>
    <view class="app-submit-checkbox"
          :class="[{'round' : round}, iValue === activeValue ? 'active' : 'inactive', iValue === activeValue ? themeBgClass : '']"
          :style="{'width': `${width}rpx`, 'height': `${height}rpx`, borderColor: borderColor, 'background-color': iValue === activeValue && !is_gift ? cTheme.background : ''}"
          @click.stop="handleClick">
    </view>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "app-submit-checkbox",
        props: {
            value: {
                default: true,
            },
            activeValue: {
                default: true,
            },
            inactiveValue: {
                default: false,
            },
            width: {
                default: 40
            },
            height: {
                default: 40
            },
            sign: {
                default: null,
            },
            borderColor: {
                default: '#cccccc',
            },
            round: {
                default: false,
            },
            theme: {
                default: null,
            },
        },
        data() {
            return {
                iValue: this.value,
                iTheme: this.theme,
                is_gift: false
            };
        },
        mounted() {
            this.is_gift = typeof(this.cTheme) == 'string' && this.cTheme.indexOf('gift') >= 0 ? true : false;
        },
        computed: {
            ...mapGetters('mallConfig', {
                defaultTheme: 'getTheme',
            }),
            cTheme() {
                return this.iTheme ? this.iTheme : this.defaultTheme;
            },
            themeBgClass() {
                if (typeof(this.cTheme) == 'string' && this.cTheme.indexOf('gift') >= 0) {
                    return `${this.cTheme} ${this.cTheme}-background`;
                }
            },
        },
        watch: {
            value(v) {
                this.iValue = v;
            },
            theme(v) {
                this.iTheme = v;
            },
        },
        methods: {
            handleClick() {
                this.iValue = this.iValue === this.activeValue ? this.inactiveValue : this.activeValue;
                this.$emit('input', {
                    v: this.iValue, index: this.sign
                });
                this.$emit('change', this.iValue, this.sign);
            },
        },
    }
</script>

<style scoped lang="scss">
    .app-submit-checkbox {
        border: #{1rpx} solid;
        display: inline-block;
    }

    .app-submit-checkbox.inactive {
        background: #fff;
    }

    .app-submit-checkbox.round {
        border-radius: #{10000rpx};
    }

    .app-submit-checkbox.active {
        border: none;
        background-image: url("../../static/image/icon/yes-radio.png");
        background-size: 100% 100%;
    }
</style>