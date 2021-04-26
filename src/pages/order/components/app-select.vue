<template>
    <!-- 弹框 -->
    <view class="modal-box" v-if="isShow" @click="confirm('close')">
        <view class="modal-item" @click.stop.prevent="">
            <view class="title-box">
                <view class="title">{{title}}</view>
                <view class="confirm" @click.stop="confirm('confirm')">确定</view>
            </view>
            <view class="picker-box">
                <picker-view indicator-class="picker-item" :indicator-style="indicatorStyle" :style="{'height': height}" @change="change">
                    <picker-view-column style="text-align: center;">
                        <view v-if="list" :class="{'line': newValue == index, 'line-2': newValue != index}" v-for="(item, index) in list" :key="index">{{item}}</view>
                    </picker-view-column>
                </picker-view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    name: 'app-select',
    props: {
        list: {
            type: Array,
            default: function() {
                return [];
            }
        },
        isShow: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: ''
        },
        height: {
            type: String,
            default: '440rpx',
        },
        index: {
            type: Number,
            default: 0
        }
    },
    watch: {
        isShow(newVal, oldVal) {
            if (newVal) {
                this.newValue = this.index;
            }
        }
    },
    data() {
        return {
            newValue: 0,
            value: [0],
            indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/88))}px;`
        }
    },
    methods: {
        confirm(type) {
            this.$emit('confirm', { index: this.newValue, is_modal_confirm: type === 'close' });
        },
        change(e) {
            this.newValue = e.detail.value[0];
        }
    }
}
</script>
<style scoped lang="scss">
.modal-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 9998;

    .modal-item {
        background: #ffffff;
        border-top-left-radius: 16#{rpx};
        border-top-right-radius: 16#{rpx};
        overflow: hidden;
        position: absolute;
        width: 100%;
        bottom: 0;
        z-index: 9999;

        .title-box {
            height: 100#{rpx};
            width: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1#{rpx} solid #e2e2e2;

            .title {
                font-size: 32#{rpx};
                color: #353535;
            }

            .confirm {
                position: absolute;
                color: #ff4544;
                font-size: 32#{rpx};
                right: 24#{rpx}
            }
        }
    }

    .picker-box {
        padding: 48#{rpx} 0;

        .picker-item {
            border: 1#{rpx} solid red;
        }

        .line {
            line-height: 88rpx;
            font-size: 36#{rpx};
            color: #353535;
        }

        .line-2 {
            line-height: 88rpx;
            font-size: 32#{rpx};
            color: #353535;
        }
    }
}
</style>