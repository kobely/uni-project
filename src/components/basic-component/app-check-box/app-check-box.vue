<template>
    <view>
        <view class="app-view" v-if="type === 'all'" @click="selectAll">
            <view class="app-item"
                  :style="{'width': `${size ? size : 32}rpx`}"
                  :class="[
                {'app-radius': shape === 'round'}
            ]"
            ></view>
            <view class="app-mask"
                  v-show="value.boolean"
                  :style="{'width': `${size ? size : 32}rpx`}"
                  :class="[
                {'app-radius': shape === 'round'},
                `${theme}-background`
                ]"
            ></view>
        </view>
        <view class="app-view" @click="handleCheckBox" v-if="type !== 'all'">
            <view class="app-item"
                  :style="{'width': `${size ? size : 32}rpx`}"
                  :class="[
                {'app-radius': shape === 'round'}
            ]"
            ></view>
            <view class="app-mask"
                  v-show="value.boolean"
                  :style="{'width': `${size ? size : 32}rpx`}"
                  :class="[
                {'app-radius': shape === 'round'},
                `${theme}-background`
                ]"
            ></view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'app-check-box',
        props: {
            selectData: Array,
            shape: String,
            theme: String,
            size: String,
            type: String,
            item: Object,
            value: {
                default: {
                    type: 'all',
                    boolean: false
                },
            },
            isShow: Boolean,
        },
        data() {
            return {
                showHidden: this.value,
                allBoolean: this.value,
            }
        },
       methods: {
           handleCheckBox() {
               this.showHidden = !this.showHidden;
               this.$emit('input', this.showHidden);
           },
           selectAll() {
               this.allBoolean = !this.allBoolean;
               this.$emit('input', this.allBoolean);
               
           }
       },
        watch: {
            selectData: {
                handler: function() {
                    // let num = 0;
                    // let add = this.selectData.length;
                    // for (let i = 0; i < this.selectData.length; i++) {
                    //     if (this.selectData[i].boolean === true) {
                    //         num++;
                    //     } else {
                    //         add--;
                    //     }
                    // }
                    // if (add < this.selectData.length) {
                    //     this.allBoolean = false;
                    //     this.$emit('input', this.allBoolean);
                    // }
                    // if (num === this.selectData.length) {
                    //     this.allBoolean = true;
                    //     this.$emit('input', this.allBoolean);
                    // }
                },
                deep: true,
                immediate: true,
            },
            isShow: {
                handler: function(response) {
                    // for (let i = 0;i < this.selectData.length; i++) {
                    //     this.selectData[i].boolean = response;
                    // }
                }
            }
        }
    }
</script>

<style scoped lang="scss">

    .app-view {
        position: relative;
    }
    .app-item {
        width: #{32rpx};
        height: #{32rpx};
        border: #{1rpx} solid $uni-general-color-three;
    }
    .app-radius {
        border-radius: 50%;
    }
    .app-mask {
        width: #{32rpx};
        height: #{32rpx};
        position: absolute;
        top: 0;
        left: 0;
    }
</style>