<template>
    <view class="app-view"
          :style="{'height': `${setHeight}rpx`, 'width': `${width}rpx`}"
    >
        <template v-if="type !== 'textarea'">
            <!--  #ifndef  MP-TOUTIAO -->
            <input :disabled="disabled"
                   :value="value ? value : defaultValue"
                   :class="{'is-disabled': disabled, 'is-round': round, 'is-border': border}"
                   class="app-input"
                   :type="type"
                   :password="password"
                   :placeholder-style="placeholderStyle"
                   :placeholder="placeholder"
                   :focus="focus"
                   :style="{
                   'padding-left': !center && icon ? '30rpx' : `${paddingLeft}rpx`,
                   'text-align': center ? 'center' : 'none',
                   'height': `${setHeight}rpx`,
                   'width': `${width}rpx`,
                   'color': `${color}`,
                   backgroundColor: backgroundColor,
                   borderRadius: `${radius}rpx`,
                   borderColor: borderColor,
                   }"
                   @input="changeValue"
                   @blur="blur"
                   @confirm="confirm"
            />
            <!--  #endif -->
            <!-- MP-TOUTIAO focus属性有问题，去除。2020-02-24 -->
            <!--  #ifdef  MP-TOUTIAO -->
            <input :disabled="disabled"
                   :value="value || value === 0 ? value : defaultValue"
                   :class="{'is-disabled': disabled, 'is-round': round, 'is-border': border}"
                   class="app-input"
                   :type="type"
                   :password="password"
                   :placeholder-style="placeholderStyle"
                   :placeholder="placeholder"
                   :style="{
                   'padding-left': !center && icon ? '30rpx' : `${paddingLeft}rpx`,
                   'text-align': center ? 'center' : 'none',
                   'height': `${setHeight}rpx`,
                   'width': `${width}rpx`,
                   'color': `${color}`,
                   backgroundColor: backgroundColor,
                   borderRadius: `${radius}rpx`,
                   borderColor: borderColor,
                   }"
                   @input="changeValue"
                   @blur="blur"
                   @confirm="confirm"
            />
            <!--  #endif -->
            <icon v-if="icon" class="app-icon"
                  :style="{'background-image': `url(${icon})`, 'left': center ? '42%': '1%'}" type></icon>
        </template>
        <template v-else>
            <textarea :value="value ? value : defaultValue"
                      :maxlength="maxLength ? maxLength : -1"
                      @blur="blur"
                      @confirm="confirm"
                      :placeholder-style="placeholderStyle"
                      :show-confirm-bar="showConfirmBar"
                      :placeholder="placeholder"
                      :auto-height="autoHeight"
                      :disabled="disabled"
                      @input="changeValue"
                      class="app-input-textarea"
                      :class="{'is-disabled': disabled, 'is-round': round, 'is-border': border}"
                      :style="{
                            'color': `${color}`,
                            backgroundColor: backgroundColor,
                            borderRadius: `${radius}rpx`,
                            padding: `24rpx ${paddingLeft}rpx`,
                            borderColor: borderColor,
                      }"
            >
            </textarea>
        </template>
    </view>
</template>

<script>

    export default {
        name: 'app-input',
        props: {
            type: String,
            password: Boolean,
            disabled: Boolean,
            placeholder: {
                default: '',
                type: String,
            },
            autoHeight: Boolean,
            showConfirmBar: Boolean,
            placeholderStyle: {
                type: String,
                default: function () {
                    return 'color: #999999';
                }
            },
            maxLength: String,
            value: {
                default: '',
            },
            round: Boolean,
            border: {
                type: [Number, Boolean]
            },
            borderColor: {
                default: '#c0c4cc',
            },
            icon: String,
            center: Boolean,
            size: String,
            width: String,
            color: {
                default: '#353535',
                type: String,
            },
            height: String,
            backgroundColor: String,
            radius: Number,
            focus: {
                type: Boolean,
                default: false,
            },
            paddingLeft: {
                default: 12,
            },
            defaultValue: {
                default: '',
            },
        },
        data() {
            return {
                newValue: this.value
            }
        },
        methods: {
            blur(event) {
                this.$emit('blur', event.detail);
            },
            confirm(event) {
                this.$emit('confirm', event.detail);
            },
            changeValue(value) {
                this.$emit('input', value.detail.value);
            }
        },
        computed: {
            setHeight: function () {
                if (this.height) return this.height;
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
</script>

<style scoped lang="scss">

    .app-input {
        border-radius: #{10rpx};
        box-sizing: border-box;
        outline: none;
        height: #{80rpx};
        width: 100%;
        line-height: #{80rpx};
        color: $uni-general-color-three;
    }

    .is-border {
        border: #{2rpx} solid #dcdfe6;
    }

    .app-input:active {
        border-color: #c0c4cc
    }

    .app-input.is-disabled {
        background-color: #f5f7fa;
        border-color: #e4e7ed;
        color: #c0c4cc;
        cursor: not-allowed;
    }

    .is-round {
        border-radius: #{50rpx};
    }

    .app-view {
        position: relative;
    }

    .app-icon {
        width: #{25rpx};
        height: #{25rpx};
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .app-input-textarea {
        max-height: 100%;
        width: 100%;
        word-wrap: break-word;
    }

    /* #ifdef MP-ALIPAY */
    .app-input,
    .app-input-textarea {
        overflow: hidden;
    }

    /* #endif */
</style>