<template>
    <view class="dir-left-nowrap cross-center">
        <!-- #ifdef MP-WEIXIN || MP-BAIDU || H5 -->
        <picker class="box-grow-1 area-picker-left"
                mode="multiSelector"
                @change="bindMultiPickerChange"
                @columnchange="bindMultiPickerColumnChange"
                :value="multiIndex"
                range-key="name"
                :range="multiArray">
            <text v-if="place!==`请选择`" class="address-name-color">{{place}}</text>
            <text v-else class="address-place-name-color">{{place}}</text>
        </picker>
        <!-- #endif -->

        <!-- #ifdef MP-ALIPAY || MP-TOUTIAO -->
        <view class="area-picker-left" @click="showAreaPicker">
            <text v-if="place!==`请选择`" class="address-name-color">{{place}}</text>
            <text v-else class="address-place-name-color">{{place}}</text>
        </view>
        <view class="area-picker" :class="area_picker_show">
            <view class="area-picker-bg" bindtap="hideAreaPicker">
                <scroll-view></scroll-view>
            </view>
            <view class="area-picker-body">
                <scroll-view>
                    <view class="area-picker-top">
                        <text class="area-picker-cancel" @click="hideAreaPicker">取消</text>
                        <text class="area-picker-confirm" @click="areaPickerConfirm">确认</text>
                    </view>
                    <view class="area-picker-row">
                        <picker-view v-if="multiIndex && multiIndex.length" indicator-style="height: 50px" style="width: 100%; height: 250px;"
                                     :value="multiIndex" @change="areaPickerChange">
                            <picker-view-column>
                                <view v-if="multiArray[0]" v-for="(item,index) in multiArray[0]" :key="index"
                                      style="line-height: 50px;height: 50px;text-align: center">{{item.name}}
                                </view>
                            </picker-view-column>
                            <picker-view-column>
                                <view v-if="multiArray[1]" v-for="(item,index) in multiArray[1]" :key="index"
                                      style="line-height: 50px;height: 50px;text-align: center">{{item.name}}
                                </view>
                            </picker-view-column>
                            <picker-view-column>
                                <view v-if="multiArray[2]" v-for="(item,index) in multiArray[2]" :key="index"
                                      style="line-height: 50px;height: 50px;text-align: center">{{item.name}}
                                </view>
                            </picker-view-column>
                        </picker-view>
                    </view>
                </scroll-view>
            </view>
        </view>
        <!-- #endif -->
        <image class="box-grow-0 arrow-image" src="/static/image/icon/arrow-right.png"></image>
    </view>
</template>

<script>
    export default {
        name: "app-area-picker",
        props: {
            ids: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                tempIds : this.ids,
                area_picker_show: '',
                list: [],
                multiIndex: [],
                multiArray: [],
                place: '',
            }
        },
        created: function () {
            this.tempIds = this.tempIds.concat();
        },
        watch: {
            ids: {
                handler:function (newData,oldData){
                    this.tempIds = this.ids;
                },
            },
            tempIds: {
                handler:function (newData,oldData){
                    const self = this;
                    self.before((data) => {
                        self.init(data);
                    })
                    this.$emit('ids', this.tempIds);
                },
                deep: true,
                immediate: true,
            },
        },

        methods: {
            //#ifdef MP-ALIPAY || MP-TOUTIAO
            showAreaPicker: function () {
                this.area_picker_show = 'active';
            },

            hideAreaPicker: function () {
                this.area_picker_show = '';
            },

            areaPickerConfirm: function (e) {
                this.bindMultiPickerChange({detail: {value: this.multiIndex}});
                this.hideAreaPicker();
            },

            areaPickerChange: function (e) {
                const self = this;
                if (self.area_picker_show == '') return;
                let detail = {
                    column: '',
                    value: '',
                };
                for (let i = 0; i < 3; i++) {
                    if (e.detail.value[i] !== self.multiIndex[i]) {
                        detail.column = i;
                        detail.value = e.detail.value[i];
                        break;
                    }
                }
                self.multiIndex = e.detail.value;
                self.bindMultiPickerColumnChange({detail: detail});
            },
            //#endif

            before(cb) {
                const self = this;
                const district = this.$storage.getStorageSync("_DISTRICT");
                if (district) {
                    cb(district);
                } else {
                    this.$request({
                        url: self.$api.default.district,
                    }).then(info => {
                        if (info.code === 0) {
                            this.$storage.setStorageSync("_DISTRICT", info.data.list);
                            cb(info.data.list);
                        }
                    })
                }
            },

            init: function (list) {
                const null_status = this.tempIds.length === 3 && this.tempIds[0] != 0;
                const ids = null_status ? this.tempIds : [2, 3, 4];
                const multiIndex = this.getIndex(list, ids);
                const multiArray = [
                    list,
                    list[multiIndex[0]].list,
                    list[multiIndex[0]].list[multiIndex[1]].list
                ];
                let place = multiArray[0][multiIndex[0]].name
                    + '，'
                    + multiArray[1][multiIndex[1]].name
                    + '，'
                    + multiArray[2][multiIndex[2]].name;

                /////初始化
                let eve = [
                    multiArray[0][multiIndex[0]],
                    multiArray[1][multiIndex[1]],
                    multiArray[2][multiIndex[2]],
                ];
                ////
                this.setEvent(eve, null_status);
                [this.list, this.multiArray, this.multiIndex, this.place] = [list, multiArray, multiIndex, null_status ? place : '请选择']
            },

            getIndex: function (list, data) {
                let arr = [];
                list.map((item, index) => {
                    if (data[0] == item.id) arr.push(index)
                });

                list[arr[0]].list.map((item, index) => {
                    if (data[1] == item.id) arr.push(index)
                });

                list[arr[0]].list[arr[1]].list.map((item, index) => {
                    if (data[2] == item.id) arr.push(index);
                });
                return arr;
            },

            bindMultiPickerChange: function (e) {
                let list = [
                    this.multiArray[0][e.detail.value[0]],
                    this.multiArray[1][e.detail.value[1]],
                    this.multiArray[2][e.detail.value[2]],
                ];

                let place = list[0].name
                    + '，'
                    + list[1].name
                    + '，'
                    + list[2].name;
                [this.multiIndex, this.place] = [e.detail.value, place];
                this.setEvent(list);
            },

            setEvent: function (list, status = true) {
                let data = {
                    province: {
                        id: list[0].id,
                        name: list[0].name
                    },
                    city: {
                        id: list[1].id,
                        name: list[1].name
                    },
                    district: {
                        id: list[2].id,
                        name: list[2].name
                    },
                };
                this.$emit('customevent', status ? data : null);
            },

            bindMultiPickerColumnChange: function (e) {
                let data = {
                    multiArray: this.multiArray,
                    multiIndex: this.multiIndex
                };
                data.multiIndex[e.detail.column] = e.detail.value;
                switch (e.detail.column) {
                    case 0:
                        data.multiIndex.splice(1, 1, 0);
                        data.multiIndex.splice(2, 1, 0);
                        data.multiArray.splice(1, 1, this.list[data.multiIndex[0]].list);
                        data.multiArray.splice(2, 1, this.list[data.multiIndex[0]].list[data.multiIndex[1]].list);
                        break;
                    case 1:
                        data.multiIndex.splice(2, 1, 0);
                        data.multiArray.splice(2, 1, this.list[data.multiIndex[0]].list[data.multiIndex[1]].list);
                        break;
                }
                [this.multiArray, this.multiIndex] = [data.multiArray, data.multiIndex]
            },
        },
    }
</script>

<style scoped lang="scss">
    .area-picker-left {
        min-width: #{115rpx};
        font-size: #{28rpx};
        padding-right: #{24rpx};
        line-height: 1.5;
        margin-left: auto;

        .address-name-color {
            color: #353535;
        }

        .address-place-name-color {
            color: #999999;
        }
    }

    .arrow-image {
        width: #{12rpx};
        height: #{24rpx};
    }

    /* #ifdef MP-ALIPAY || MP-TOUTIAO  */
    .area-picker {
        position: fixed;
        z-index: 1600;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        transform: translateY(100%);
        transition: 250ms opacity;
        opacity: 0;
        background: rgba(0, 0, 0, .3);
    }

    .area-picker.active {
        transform: translateY(0);
        opacity: 1;
    }

    .area-picker .area-picker-bg {
        flex-grow: 1;
        position: relative;
    }

    .area-picker .area-picker-bg > scroll-view {
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        position: absolute;
    }

    .area-picker .area-picker-body {
        flex-grow: 0;
        height: #{600rpx};
        background: #fff;
        transform: translateY(100%);
        transition: 250ms transform;
        position: relative;
    }

    .area-picker.active .area-picker-body {
        transform: translateY(0);
    }

    .area-picker .area-picker-body > scroll-view {
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        position: absolute;
    }

    .area-picker .area-picker-cancel,
    .area-picker .area-picker-confirm {
        display: inline-block;
        padding: #{24rpx};
        color: #888;
    }

    .area-picker .area-picker-confirm {
        float: right;
        color: #00aa00;
    }

    .area-picker .area-picker-row {
        width: 100%;
        height: #{500rpx};
    }
    /* #endif */
</style>