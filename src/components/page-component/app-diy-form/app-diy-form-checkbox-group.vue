<template>
    <view class="app-diy-form-checkbox-group">
        <view class="list dir-left-wrap">
            <view v-for="(item, index) in model"
                  :key="index"
                  @click="handleClick(index)" class="out-of-item box-grow-0">
                <view class="item text-ellipsis"
                      :style="{color: color ? color: '#FF4544',
                              borderColor: color ? color: '#FF4544',
                              backgroundColor: item.value ? color: '#FFFFFF',
                              }"
                      :class="[
                        `white-background`,
                        item.value?`background`:``,
                        ]">{{item.label}}
                </view>
            </view>
        </view>
    </view>
</template>

<script>

    export default {
        name: 'app-diy-form-checkbox-group',
        props: {
            sign: {
                default: null,
            },
            value: {
                type: Array,
                default: [],
            },
            list: {
                type: Array,
                default: [],
            },
            color: {
                default: '#ff4544',
            }
        },
        data() {
            const model = this.list;
            for (let i in model) {
                let inArray = false;
                for (let j in this.value) {
                    if (model[i].label === this.value[j]) {
                        inArray = true;
                        break;
                    }
                }
                if (inArray) {
                    model[i].value = true;
                }
            }
            return {
                model: model,
            };
        },
        methods: {
            handleClick(index) {
                this.model[index].value = !this.model[index].value;
                this.outputData();
            },
            outputData() {
                const value = [];
                for (let i in this.model) {
                    if (this.model[i].value === true) {
                        value.push(this.model[i].label);
                    }
                }
                this.$emit('change', value, this.sign);
                this.$emit('input', value, this.sign);
            },
        },
    }
</script>

<style scoped lang="scss">
    .app-diy-form-checkbox-group {
        width: 100%;
        overflow-y: hidden;
        //overflow-x: hidden;
    }

    .list {
        //margin-bottom: #{-24rpx};
        //margin: 0 -#{6rpx};
    }

    .out-of-item {
        margin-bottom: #{12rpx};
        margin-top: #{12rpx};
        margin-right: #{10rpx};
        display: inline-block;
    }

    .item {
        //display: inline-block;
        height: #{56rpx};
        line-height: #{54rpx};
        border: #{2rpx} solid;
        padding: 0 #{24rpx};
        border-radius: #{1000rpx};
        font-size: $uni-font-size-general-one;
    }
    .background {
        color: #ffffff !important;
    }
    .border {
        border-color: #ff4544;
    }
    .color {
        color: #ff4544;
    }
    .text-ellipsis{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: #{420rpx};
    }
</style>
