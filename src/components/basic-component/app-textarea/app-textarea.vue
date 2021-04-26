<template>
    <view class="app-textarea">
        <view class="a"
              @click="showInput=true"
              :style="{
              background: background,
              fontSize: `${fontSize}rpx`,
              color: color,
              borderRadius: `${borderRadius}rpx`,
              border: showBorder ? `2rpx solid ${borderColor}` : 'none',
              padding: `${paddingY}rpx ${paddingX}rpx`,
              }">
            <text v-if="inValue" class="content" :style="{
            color: color,
            }">{{inValue}}</text>
            <view v-else
                  class="placeholder"
                  :style="placeholderStyle"
                  :class="placeholderClass">{{placeholder}}
            </view>
        </view>
        <view class="b" v-if="showInput">
            <textarea class="textarea"
                      :value="inValue"
                      :placeholder="placeholder"
                      :focus="showInput"
                      :maxlength="maxlength"
                      @input="handleInput"
                      @blur="complete"
                      @confirm="complete"/>
            <view class="c" @click="complete"></view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'app-textarea',
        props: {
            value: {
                default: '',
            },
            placeholder: {
                default: '',
            },
            placeholderStyle: {
                type: [String, Array],
                default: function () {
                    return '';
                }
            },
            placeholderClass: {
                type: Array,
                default: function () {
                    return [];
                },
            },
            disable: {
                default: false,
            },
            maxlength: {
                default: 10000,
            },
            focus: {
                default: false,
            },
            confirmType: {
                default: 'done'
            },

            showBorder: {
                default: true,
            },
            borderColor: {
                default: '#cccccc',
            },
            borderRadius: {
                default: 8,
            },
            fontSize: {
                default: 32,
            },
            color: {
                default: '#555',
            },
            background: {
                default: '#fff',
            },
            paddingX: {
                default: 24,
            },
            paddingY: {
                default: 24,
            },
            defaultValue: {
                default: '',
            },
        },
        data() {
            return {
                showInput: !!this.focus,
                inValue: this.value ? this.value : this.defaultValue,
            };
        },
        methods: {
            handleInput(e) {
                this.inValue = e.detail.value;
            },
            complete(e) {
                this.showInput = false;
                this.$emit('input', this.inValue);
            },
        }
    }
</script>

<style scoped lang="scss">
    .a {

        .content {
            color: #444;
            display: block;
            width: 100%;
            min-height: $uni-font-size;
            word-wrap: break-word;
        }

        .placeholder {
            color: #aaa;
            min-height: $uni-font-size;
        }
    }

    .b {
        position: fixed;
        background: rgba(0, 0, 0, 0.5);
        padding: #{50rpx};
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;

        .textarea {
            width: 100%;
            background: #fff;
            border: #{1rpx} solid #ccc;
            z-index: 1;
            padding: #{24rpx};
            border-radius: #{5rpx};
        }

        .c {
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
        }
    }
</style>
