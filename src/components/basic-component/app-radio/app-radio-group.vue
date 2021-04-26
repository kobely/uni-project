<template>
    <view class="app-radio-group">
        <view style="overflow-y:hidden;">
        <view class="dir-left-wrap">
            <template v-for="(item, index) in model">
                <view :key="index" class="item cross-center dir-left-nowrap" :style="{height: `${height}rpx`,}">
                    <template v-if="type==='round'">
                        <view class="item-round text-ellipsis"
                              :class="[
                                `white-background`,
                                item.value?`background`:``,
                                ]"
                              :style="{color: color ? color: '#FF4544',
                                  borderColor: color ? color: '#FF4544',
                                  backgroundColor: item.value ? color: '#FFFFFF'}"
                              @click="handleClick(index)">{{item.label}}
                        </view>
                    </template>
                    <template v-else>
                        <view class="checker">
                            <app-radio v-model="item.value" type="round" @input="handleInput" :sign="index"></app-radio>
                        </view>
                        <view class="label text-ellipsis">{{item.label}}</view>
                    </template>
                </view>
            </template>
        </view>
        </view>
    </view>
</template>

<script>
    import AppRadio from "./app-radio";

    export default {
        name: 'app-radio-group',
        components: {AppRadio},
        props: {
            type: {
                default: 'default',
            },
            value: {
                default: null,
            },
            list: {
                type: Array,
                default: [],
            },
            height: {
                type: Number,
                default: 88,
            },
            sign: {
                default: null,
            },
            color: {
                default: '#ff4544',
            }
        },
        data() {
            const list = this.list;
            for (let i in list) {
                if (list[i].label === this.value) {
                    list[i].value = true;
                }
            }
            return {
                model: this.list,
            };
        },
        methods: {
            handleInput(e, index) {
                if (e === false) {
                    this.model[index].value = true;
                    return;
                }
                for (let i in this.model) {
                    if (index != i) {
                        this.model[i].value = false;
                    }
                }
                this.$emit('input', this.model[index].label, this.sign);
                this.$emit('change', this.model, this.sign);
            },
            handleClick(index) {
                for (let i in this.model) {
                    if (i == index) {
                        if (!this.model[i].value) {
                            this.model[i].value = true;
                            this.$emit('input', this.model[index].label, this.sign);
                            this.$emit('change', this.model, this.sign);
                        }
                    } else {
                        this.model[i].value = false;
                    }
                }
            },
        },
    }
</script>

<style scoped lang="scss">
    .label {
        color: #666666;
    }

    .item {
        margin-bottom: #{12rpx};
        margin-top: #{12rpx};
        margin-right: #{10rpx};
    }

    .item:last-child {
        margin-right: 0;
    }

    .checker {
        margin-right: #{16rpx};
    }

    .item-round {
        display: inline-block;
        height: #{56rpx};
        line-height: #{54rpx};
        border: #{2rpx} solid;
        padding: 0 #{24rpx};
        border-radius: #{1000rpx};
        font-size: $uni-font-size-general-one;
    }

    .background {
        background-color: #ff4544;
        color: #ffffff !important;
    }

    .border {
        border-color: #ff4544;
    }

    .color {
        color: #ff4544;
    }

    .text-ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: #{420rpx};
    }
</style>
