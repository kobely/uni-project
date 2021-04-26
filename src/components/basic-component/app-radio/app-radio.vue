<template>
    <view class="app-default" :style="{'width': `${width}rpx`, 'height': `${height}rpx`}" @click.stop="radioSelection">
        <view
            v-if="value"
            styke
            class="app-default-active"
            :style="{'background-color': sign ? '' : theme.background}"
            :class="[
            {'round-active' : type === 'round'},
            sign ? theme +'-background' : '',
            theme
           ]"
        ></view>
        <view v-if="!value" class="app-default-border"
              :class="{'round-border' : type === 'round'}"
              :style="{
              borderColor: borderColor,
              }"></view>
    </view>
</template>

<script>
    export default {
        name: 'app-radio',
        props: {
            type: String,
            theme: [Object,String],
            value: {
                default: false,
                type: Boolean,
            },
            width: {
                type: String,
                default: '40'
            },
            height: {
                type: String,
                default: '40'
            },
            item: {
                type: Object,
                default() {
                    return {}
                }
            },
            sign: {
                default: null,
            },
            borderColor: {
                default: '#cccccc',
            },
        },
        data() {
            return {
                active: this.value,
            }
        },
        methods: {
            radioSelection() {
                this.active = !this.active;
                this.$emit('input', {active:this.active, item:this.sign});
                this.$emit('click', {active:this.active, item:this.item});
            }
        },
        watch: {
            value: {
                handler(value) {
                    this.active = value;
                }
            }
        }
    }
</script>

<style lang="scss">

    .round-active {
        border-radius: 50%;
    }

    .round-border {
        border-radius: 50%;
    }

    .app-default {
        position: relative;
    }

    .app-default-active {
        position: absolute;
        background-image: url("../../../static/image/icon/yes-radio.png");
        background-size: 100% 100%;
	    top: 50%;
	    left: 50%;
	    transform: translate(-50%, -50%);
        background-repeat: no-repeat;
	    width: #{40rpx};
	    height: #{40rpx};
    }

    .app-default-border {
	    position: absolute;
        border: #{2rpx} solid #cccccc;
	    top: 50%;
	    left: 50%;
	    transform: translate(-50%, -50%);
	    width: #{40rpx};
	    height: #{40rpx};
    }

</style>