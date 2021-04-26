<template>
    <view class="app-timer">
        <app-jump-button form :url="link.url" :open_type="link.openType" arrangement="column">
            <view v-if="picUrl">
                <app-image :img-src="picUrl" mode="widthFix" width="750rpx" height="auto"></app-image>
            </view>
            <view :style="{'background-image':  `url(${bgPicUrl ? bgPicUrl : '../../../static/image/icon/icon-timer-bg.png'})`}" class="timer dir-top-nowrap main-center"
                  v-if="timerStr">
                <view v-if="startTime">距离活动开始还有</view>
                <view v-if="startTime === null && endTime">距离活动结束还有</view>
                <view v-if="startTime === null && endTime === null">活动已结束</view>
                <view>{{timerStr}}</view>
            </view>
        </app-jump-button>
    </view>
</template>

<script>
    export default {
        name: "app-timer",
        props: {
            picUrl: String,
            link: Object,
            startDateTime: {
                type: String,
                default() {
                    return '2019-8-30 10:00:00';
                }
            },
            endDateTime: {
                type: String,
                default() {
                    return '2019-8-30 10:00:00';
                }
            },
            pageHide: Boolean,
            bgPicUrl: String,
        },
        data() {
            return {
                timeInterval: null,
                startTime: null,
                endTime: null,
                timerStr: null
            };
        },
        computed: {
            time() {
                return {
                    startDateTime: this.startDateTime,
                    endDateTime: this.endDateTime,
                    pageHide: this.pageHide,
                };
            }
        },
        beforeDestroy() {
            clearInterval(this.timeInterval);
        },
        watch: {
            time: {
                handler() {
                    if (this.pageHide) {
                        clearInterval(this.timeInterval);
                        return ;
                    }
                    let startDateTime = this.startDateTime;
                    let endDateTime = this.endDateTime;

                    this.timeInterval = setInterval(() => {
                        let startTime = null, endTime = null, timerStr = null;
                        if (startDateTime) {
                            startDateTime = startDateTime.replace(/-/g, '/');
                            startTime = this.$utils.timeDifference(new Date().getTime(), new Date(startDateTime).getTime());
                            if (startTime) {
                                timerStr = (startTime['d'] > 0 ? startTime['d'] + '天' : '') + startTime['h'] + '小时' + startTime['m'] + '分' + startTime['s'] + '秒';
                            }
                        }
                        if (endDateTime && !timerStr) {
                            endDateTime = endDateTime.replace(/-/g, '/');
                            endTime = this.$utils.timeDifference(new Date().getTime(), new Date(endDateTime).getTime());
                            if (endTime) {
                                timerStr = (endTime['d'] > 0 ? endTime['d'] + '天' : '') + endTime['h'] + '小时' + endTime['m'] + '分' + endTime['s'] + '秒';
                            }
                        }
                        this.startTime = startTime;
                        this.endTime = endTime;
                        this.timerStr = timerStr;
                    }, 1000);
                },
                immediate: true
            }
        }
    }
</script>

<style scoped lang="scss">
    .timer {
        width: 100%;
        height: #{140rpx};
        padding: #{24rpx};
        font-size: $uni-font-size-general-one;
        color: #ffffff;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
    }
</style>