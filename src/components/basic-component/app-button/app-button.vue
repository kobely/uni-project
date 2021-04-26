<template>
    <view class="app-view" :style="{
        'width': `${width ? width : '100%'}${width ? 'rpx': ''}`,
         'height': `${setHeight}rpx`,
    }">
        <button
            v-if="type === 'important'"
            :style="[
                {
                    'line-height': `${setHeight - 2}rpx`,
                    'font-size': `${fontSize ? fontSize : 32}rpx`,
                    'width': `${width ? width : '100%'}${width ? 'rpx': ''}`,
                    'height': `${setHeight}rpx`,
                    'background-color': `${background ? background : theme.background}`,
                    'border-radius': `${roundSize ? roundSize : ''}`,
                    color: `${color ? color : theme.main_text}`,
                    padding: padding
                }
            ]"
            @click="handleClick"
            :class="[
                'app-button',
                `app-important`,
              `${round ? 'is-round' : ''}`,
               `${disabled ? 'app-important-disabled is-disabled' : ''}`,
              `${arrangement === 'column' ? 'app-button-column' : arrangement === 'row' ? 'app-button-row' : ''}`
            ]"
        >
            <slot></slot>
        </button>
        <button
                @click="handleClick"
                v-else-if="type === 'general'"
                :class="[
                `app-button`,
                `app-general`,
                `${disabled ? 'app-general-disabled  is-disabled' : 'app-general-disabled-not'}`,
                `${round ? 'is-round': ''}`,
                `${arrangement === 'column' ? 'app-button-column' : arrangement === 'row' ? 'app-button-row' : ''}`
                ]"
                :style="{
                    'height': `${setHeight}rpx`,
                    'line-height': `${setHeight - 2}rpx`,
                    'font-size': `${fontSize ? fontSize : 32}rpx`,
                    'width': `${width ? width : '100%'}${width ? 'rpx': ''}`,
                    'background-color': `${background ? background : ''}`,
                    'border-radius': `${roundSize ? roundSize : ''}`,
                    color: color,
                    padding: padding
                }"
        >
            <slot></slot>
        </button>
        <button
                @click="handleClick"
                v-else
              :style="{
                'height': `${setHeight}rpx`,
                'line-height': `${setHeight - 2}rpx`,
                'font-size': `${fontSize ? fontSize : 32}rpx`,
                'width': `${width ? width : '100%'}${width ? 'rpx': ''}`,
                'background-color': `${background ? background : theme.background}`,
                'border-radius': `${roundSize ? roundSize : ''}`,
                'border-color': `${borderColor ? borderColor : theme.border}`,
                'color': `${color ? color : theme.main_text}`,
                'padding': padding
            }"
              :class="[
                'app-button',
                `app-secondary`,
              `${round ? 'is-round' : ''}`,
               `${disabled ? 'app-secondary-disabled is-disabled' : ''}`,
               `${arrangement === 'column' ? 'app-button-column' : arrangement === 'row' ? 'app-button-row' : ''}`
            ]"
        >
            <slot></slot>
        </button>
    </view>
</template>

<script>

    export default {
    props: {
        disabled: Boolean,
        type: String,
        round: Boolean,
        theme: Object,
        height: String,
        fontSize: String,
        width: String,
        color: String,
        size: String,
        background: String,
        form: Boolean,
        arrangement: String,
        roundSize: String,
        padding: String,
        borderColor: String,
    },
    data() {
        return {
            touch: false
        }
    },
    methods: {
        handleClick(e) {
            this.$emit('click', e);
        }
    },
    computed: {
        setHeight: function() {
            if (this.height) {
                return this.height;
            } else {
                switch (this.size) {
                    case 'large':
                        return 100;
                    case 'small':
                        return 60;
                    case 'medium':
                        return 80;
                    default:
                        return 80;
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    
    $border-radius: 40rpx;
    $height: 80rpx;
    $border-size: 1px;

    .app-view {
        position: relative;
        /*width:100%;*/
        .app-button {
            height: $height;
            text-align: center;
            line-height: $height;
        }
        .is-round {
            border-radius: $border-radius;
        }
        .is-disabled {
            /*background-color: #cdcdcd;*/
            pointer-events: none;
        }
        .app-general {
            background-color: #ffffff;
            border: $border-size solid #cdcdcd;
        }
        .app-general-disabled {
            color: #cdcdcd;
        }
        .app-general-disabled-not {
            color: #353535;
        }
        .app-mask {
            background-color: rgba(0, 0, 0, .2);
            width: 100%;
            height: $height;
            position: absolute;
            top:0;
            left: 0;
        }
        .app-important {
            color: #ffffff;
        }
        .app-important-disabled {
            background-color: #cdcdcd;
        }
        .app-secondary {
            border-width: $border-size;
            border-style: solid;
        }
        .app-secondary-disabled {
            background-color: #ffffff;
            border-color: #cdcdcd;
            color: #cdcdcd;
        }
    }
    .app-button:active {
        box-shadow: inset 0 0 #{1000rpx} rgba(0, 0, 0, .15);
    }
</style>

<style scoped lang="scss">
    /* #ifdef MP-WEIXIN */
    button {
        border: none;
        padding: 0 #{24rpx};
    }
    button:after {
        border: none;
        border-radius: 0;
    }
    
    /* #endif */
    
    /* #ifdef MP-TOUTIAO */
    div {
        display: block !important;
    }
    button {
        border-radius: 0;
        padding: 0;
        height: 100%;
        //border-color:inherit;
    }
    button:after {
        border: none;
        border-radius: 0;
    }
    /* #endif */
    
    /* #ifdef MP-ALIPAY */
    button {
        border: none;
    //background-color: transparent;
        border-radius: 0;
    }
    /* #endif */
    
    /* #ifdef MP-BAIDU*/
    button {
        padding: 0;
    }
    button:after {
        border-radius: 0;
        border: none;
    }
    /* #endif */

    .app-button-column {
	    height: 100%;
	    width: 100%;
	    display: flex;
	    flex-direction: column;
	    justify-content: center;
	    align-items: center;
    }

    .app-button-row {
	    height: 100%;
	    width: 100%;
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
	    align-items: center;
    }
</style>