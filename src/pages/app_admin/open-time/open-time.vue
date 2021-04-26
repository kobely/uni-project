<template>
    <app-layout>
        <view>
            <view @click="openTime(item, index)" class="attr" v-for="(item, index) in list" :key="index">
                <image @click.stop='toDelete(index)' class='low-attr' src='./../image/low.png'></image>
                <view class="attr-item main-between cross-center">
                    <view v-if="item.value[0] && item.value[1]">{{item.value[0]}}-{{item.value[1]}}</view>
                    <view v-else class="placeholder-text">请选择时间段</view>
                    <image class="app-icon" src="../image/arrow-right.png"></image>
                </view>
            </view>
        </view>
        <view v-if="list.length < 3" class='add-attr' @click='add'>
            <view class='add-attr-btn main-center'>
                <image src='./../image/add.png'></image>
                <view>增加时间段</view>
            </view>
        </view>
        <view :class="['placeholder', `${iphone_x? 'iphone_x':''}`]"></view>
        <view :class="['add', `${iphone_x? 'iphone_x':''}`]">
            <view @click="save">保存</view>
        </view>
        <view @touchmove.stop.prevent="" class="time-bg cross-center" v-if="timeDialog">
            <view class="time-dialog">
                <view class="dialog-title">选择时间段</view>
                <view class="choose-time">
                    <view class="time-title">起始时间</view>
                    <view class="year-1">时</view>
                    <view class="month-1">分</view>
                    <view class="day-1">秒</view>
                    <view class="year-2">时</view>
                    <view class="month-2">分</view>
                    <view class="day-2">秒</view>
                    <picker-view :value="startVal" :indicator-style="indicatorStyle" class="picker-view" @change="startChange">
                        <picker-view-column>
                            <view v-for="(item,idx) in hour" :key="item"
                                :class="[`${startVal[0] == idx ?`admin-m-text admin`: ''}`]"
                                :style="{ color: startVal[0] == idx + 1 || startVal[0] == idx - 1 ? '#999999' : startVal[0] == idx + 2 || startVal[0] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
                        </picker-view-column>
                        <picker-view-column>
                            <view v-for="(item,idx) in minutes" :key="item"
                                :class="[`${startVal[1] == idx ?`admin-m-text admin`: ''}`]"
                                :style="{ color: startVal[1] == idx + 1 || startVal[1] == idx - 1 ? '#999999' : startVal[1] == idx + 2 || startVal[1] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
                        </picker-view-column>
                        <picker-view-column>
                            <view v-for="(item,idx) in minutes" :key="item"
                                :class="[`${startVal[2] == idx ?`admin-m-text admin`: ''}`]"
                                :style="{ color: startVal[2] == idx + 1 || startVal[2] == idx - 1 ? '#999999' : startVal[2] == idx + 2 || startVal[2] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
                        </picker-view-column>
                    </picker-view>
                    <view class="time-title">结束时间时间</view>
                    <picker-view :value="endVal" :indicator-style="indicatorStyle" class="picker-view" @change="endChange">
                        <picker-view-column>
                            <view v-for="(item,idx) in hour" :key="item"
                                :class="[`${endVal[0] == idx ?`admin-m-text admin`: ''}`]"
                                :style="{ color: endVal[0] == idx + 1 || endVal[0] == idx - 1 ? '#999999' : endVal[0] == idx + 2 || endVal[0] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
                        </picker-view-column>
                        <picker-view-column>
                            <view v-for="(item,idx) in minutes" :key="item"
                                :class="[`${endVal[1] == idx ?`admin-m-text admin`: ''}`]"
                                :style="{ color: endVal[1] == idx + 1 || endVal[1] == idx - 1 ? '#999999' : endVal[1] == idx + 2 || endVal[1] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
                        </picker-view-column>
                        <picker-view-column>
                            <view v-for="(item,idx) in minutes" :key="item"
                                :class="[`${endVal[2] == idx ?`admin-m-text admin`: ''}`]"
                                :style="{ color: endVal[2] == idx + 1 || endVal[2] == idx - 1 ? '#999999' : endVal[2] == idx + 2 || endVal[2] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
                        </picker-view-column>
                    </picker-view>
                </view>
                <view class="main-center btn-area">
                    <view class="time-submit-btn" @click='cancel' style="color: #666;">取消</view>
                    <view class="line"></view>
                    <view class="time-submit-btn" style="color: #446dfd;" @click='submitTime'>确认</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        data() {
            return {
                lineHeight: '72rpx',
                iphone_x: false,
                list: [],
                detail: {},
                indicatorStyle: '',
                timeDialog: false,
                choose: 2,
                index: -1,
                hour: [],
                minutes: [],
                startVal: [0,0,0],
                endVal: [0,0,0],
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                adminImg: state => state.mallConfig.__wxapp_img.app_admin
            })
        },
        methods: {
            submitTime() {
                if(this.startVal[0] > this.endVal[0]) {
                    uni.showToast({
                        title: '结束时间不应早于开始时间',
                        icon: 'none',
                        duration: 1000
                    })
                }else if(this.startVal[0] == this.endVal[0] && this.startVal[1] > this.endVal[1]) {
                    uni.showToast({
                        title: '结束时间不应早于开始时间',
                        icon: 'none',
                        duration: 1000
                    })
                }else if(this.startVal[0] == this.endVal[0] && this.startVal[1] == this.endVal[1] && this.startVal[2] > this.endVal[2]) {
                    uni.showToast({
                        title: '结束时间不应早于开始时间',
                        icon: 'none',
                        duration: 1000
                    })
                }else if(this.startVal[0] == this.endVal[0] && this.startVal[1] == this.endVal[1] && this.startVal[2] == this.endVal[2]) {
                    uni.showToast({
                        title: '结束时间不应等于开始时间',
                        icon: 'none',
                        duration: 1000
                    })
                }else {
                    this.list[this.index] = [];
                    let start = this.hour[this.startVal[0]] + ':' + this.minutes[this.startVal[1]] + ':' + this.minutes[this.startVal[2]]
                    let end = this.hour[this.endVal[0]] + ':' + this.minutes[this.endVal[1]] + ':' + this.minutes[this.endVal[2]]
                    let para = {
                        value : [start,end]
                    }
                    this.list[this.index] = para
                    this.timeDialog = false;
                }
            },
            cancel() {
                this.timeDialog = false;
                this.index = -1;
            },
            openTime(item, index) {
                this.index = index;
                if(item.value[0]) {
                    this.startVal = item.value[0].split(':').map(Number);
                }else {
                    this.startVal = [0,0,0]
                }
                if(item.value[1]) {
                    this.endVal = item.value[1].split(':').map(Number);
                }else {
                    this.endVal = [0,0,0]
                }
                this.timeDialog = true;
            },
            startChange: function(e) {
                this.startVal = e.detail.value;
            },
            endChange: function(e) {
                this.endVal = e.detail.value;
            },
            add() {
                let para = {
                    value: []
                }
                this.list.push(para);
            },
            toDelete(index) {
                this.list.splice(index,1);
            },
            save() {
                for(let item of this.list) {
                    if(!item.value[0] || !item.value[1]) {
                        uni.showToast({icon: 'none', title: '时间段请填写完整'});
                        return false;
                    }
                }
                uni.showLoading({
                    mask: true,
                    title: '保存中...'
                });
                this.detail.setting.time_list = this.list;
                let data = {
                    name: this.detail.name,
                    setting: JSON.stringify(this.detail.setting)
                };
                this.$request({
                    url: this.$api.app_admin.setting,
                    method: 'post',
                    data: data,
                }).then(response => {
                    if (response.code === 0) {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                        setTimeout(function() {
                            uni.navigateBack();
                        }, 500)
                    }
                })
            },
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            let screenWidth = uni.getSystemInfoSync().windowWidth;
            let p = 375 / screenWidth;
            this.lineHeight = 72*p + 'rpx'
            this.indicatorStyle =  'height: 36px;font-size:14px;';
            this.$request({
                url: this.$api.app_admin.setting
            }).then(response => {
                this.detail = response.data.detail;
            })
            for(let i = 0;i < 60;i++) {
                if(i < 10) {
                    i = '0' + i
                }
                if(i < 24) {
                    this.hour.push(i)
                }
                this.minutes.push(i)
            }
            this.list = JSON.parse(options.time_list);
            if(this.list.length == 0) {
                let para = {
                    value: ['','']
                }
                this.list.push(para)
            }
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
        }
    }
</script>

<style scoped lang="scss">
    .attr {
        background-color: #fff;
        position: relative;
        padding-left: #{84rpx};
        padding-right: #{26rpx};
        .low-attr {
            position: absolute;
            z-index: 2;
            top: #{24rpx};
            height: #{40rpx};
            width: #{40rpx};
            left: #{24rpx};
        }
        .attr-item {
            height: #{88rpx};
            line-height: #{88rpx};
            border-top: #{2rpx} solid #e2e2e2;
            position: relative;
            font-size: #{28rpx};
            color: #353535;
            .placeholder-text {
                color: #e1e1e1;
            }
            .app-icon {
                width: #{12rpx};
                height: #{22rpx};
            }
        }
        &:first-of-type {
            .attr-item {
                border-top: 0;
            }
        }
    }
    .add-attr {
        height: #{120rpx};
        background-color: #fff;
        margin-top: #{20rpx};
        padding-top: #{24rpx};
        .add-attr-btn {
            height: #{72rpx};
            width: #{320rpx};
            border-radius: #{36rpx};
            border: #{1rpx} solid #446dfd;
            margin: 0 auto;
            color: #446dfd;
            font-size: #{26rpx};
            line-height: #{72rpx};
            image {
                height: #{28rpx};
                width: #{28rpx};
                margin-right: #{12rpx};
                margin-top: #{22rpx};
            }
        }
    }
    .add {
        position: fixed;
        bottom: 0;
        left: 0;
        height: #{120rpx};
        width: 100%;
        z-index: 15;
        background-color: #fff;
        view {
            width: #{702rpx};
            line-height: #{80rpx};
            height: #{80rpx};
            margin: #{20rpx} auto;
            border-radius: #{40rpx};
            background-color: #446dfd;
            color: #fff;
            font-size: #{32rpx};
            text-align: center;
        }
    }
    .add.iphone_x {
        height: #{170rpx};
        padding-bottom: #{50rpx};
    }
    .placeholder {
        height: #{120rpx};
    }
    .placeholder.iphone_x {
        height: #{170rpx};
    }
    .time-bg {
        background-color: rgba(0, 0, 0, 0.3);
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 100;
        .time-dialog {
            width: #{620rpx};
            border-radius: #{16rpx};
            margin: 0 auto;
            background-color: #fff;
            z-index: 20;
            .dialog-title {
                font-size: #{32rpx};
                color: #353535;
                width: #{620rpx};
                margin: #{32rpx} auto #{40rpx};
                text-align: center;
            }
            .time-area {
                margin-bottom: #{24rpx};
                padding: 0 #{32rpx};
                &.date-area {
                    border-top: #{2rpx} solid #e2e2e2;
                    padding: #{28rpx} #{32rpx};
                    .dialog-choose-item {
                        margin: #{12rpx} 0;
                    }
                }
                .dialog-choose-item {
                    margin: 0 12rpx;
                    width: #{170rpx};
                    height: #{68rpx};
                    line-height: #{68rpx};
                    text-align: center;
                    border-radius: #{34rpx};
                    border: #{2rpx} solid;
                    font-size: #{28rpx};
                    margin-bottom: #{16rpx};
                    &.time-area-item {
                        border-color: #ddd;
                        color: #666;
                    }
                }
            }
            .choose-time {
                position: relative;
                .time-title {
                    margin-left: #{32rpx};
                    color: #666;
                    font-size: #{28rpx};
                    margin-bottom: #{20rpx};
                }
                .year-1 {
                    position: absolute;
                    left: #{192rpx};
                    top: #{146rpx};
                }
                .month-1 {
                    position: absolute;
                    left: #{380rpx};
                    top: #{146rpx};
                }
                .day-1 {
                    position: absolute;
                    right: #{32rpx};
                    top: #{146rpx};
                }
                .year-2 {
                    position: absolute;
                    left: #{192rpx};
                    bottom: #{88rpx};
                }
                .month-2 {
                    position: absolute;
                    left: #{380rpx};
                    bottom: #{88rpx};
                }
                .day-2 {
                    position: absolute;
                    right: #{32rpx};
                    bottom: #{88rpx};
                }
                .picker-view {
                    width: #{556rpx};
                    height: #{216rpx};
                    margin: 0 auto #{20rpx};
                    text-align: center;
                    view {
                        line-height: #{68rpx};
                    }
                }
            }
            .btn-area {
                height: #{88rpx};
                position: relative;
                border-top: #{2rpx} solid #e2e2e2;
                &.other-btn-area {
                    margin-top: #{10rpx};
                }
                .line {
                    height: #{32rpx};
                    width: #{1rpx};
                    background-color: #e2e2e2;
                    position: absolute;
                    top: #{28rpx};
                    left: 0;
                    right: 0;
                    margin: 0 auto;
                }
                .time-submit-btn {
                    height: #{88rpx};
                    line-height: #{88rpx};
                    font-size: #{32rpx};
                    width: #{310rpx};
                    text-align: center;
                }
            }
        }
    }
</style>