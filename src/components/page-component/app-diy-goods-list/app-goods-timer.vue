<template>
    <view class="dir-left-nowrap app-goods-timer cross-center" :class="listClass" :style="{'background-color': listStyle == 1 || listStyle == 2 ?theme.background :''}">
        <template v-if="listStyle === -1">
            <!-- 列表模式 -->
            <image class="box-grow-0 img" src="../../../static/image/icon/time.png"></image>
            <view class="box-grow-0 timer-1">{{timer}}</view>
            <view class="box-grow-1" :style="{'color': theme.color}" v-if="timerStr">&nbsp;&nbsp;&nbsp;{{timerStr}}</view>
        </template>
        <template v-else-if="listStyle === 1">
            <!-- 一行一个 -->
            <view class="dir-left-nowrap app-column-1">
                <view class="box-grow-1 sign-name">{{signName}}</view>
                <view class="box-grow-0 timer-1">{{timer}}</view>
                <view class="box-grow-0" v-if="timerStr">&nbsp;&nbsp;&nbsp;{{timerStr}}</view>
            </view>
        </template>
        <template v-else-if="listStyle === 2">
            <!-- 一行一个 -->
            <view class="box-grow-0 dir-left-nowrap app-column-2">
                <view class="box-grow-0 timer-1">{{timer}}</view>
                <view class="box-grow-1" v-if="timerStr">&nbsp;&nbsp;&nbsp;{{timerStr}}</view>
            </view>
        </template>
    </view>
</template>

<script>

    export default {
        name: "app-goods-timer",
        props: {
            startDateTime: String,
            endDateTime: String,
            listStyle: {
                type: Number,
                default() {
                    return -1;
                }
            },
            sign: String,
            pageHide: Boolean,
            theme: Object,
        },
        data() {
            return {
                timeInterval: null,
                timer: null,
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
            },

            listClass() {
                let str = ``;
                if(this.listStyle == 2) {
                    str = `main-center`
                }
                return str;
            },

            signName() {
                let name = '';
                switch (this.sign) {
                    case 'miaosha':
                        name = '秒杀';
                        break;
                    case 'bargain':
                        name = '砍价';
                        break;
                    case 'lottery':
                        name = '抽奖';
                        break;
                    case 'advance':
                        name = '预售';
                        break;
                    case 'flash-sale':
                        name = '限时抢购';
                        break;
                }
                return name;
            },
        },
        methods: {
            timing(startDateTime, endDateTime) {
                let timerStr = null;
                let startTime = this.$utils.timeDifference(new Date().getTime(), new Date(startDateTime).getTime());
                if (startTime) {
                    this.timer = '距开始 ';
                    timerStr = (startTime['d'] > 0 ? startTime['d'] + '天' : '') + startTime['h'] + ':' + startTime['m'] + ':' + startTime['s'];
                }
                let endTime = null;
                if (!timerStr) {
                    endTime = this.$utils.timeDifference(new Date().getTime(), new Date(endDateTime).getTime());
                    if (endTime) {
                        this.timer = '距结束 ';
                        timerStr = (endTime['d'] > 0 ? endTime['d'] + '天' : '') + endTime['h'] + ':' + endTime['m'] + ':' + endTime['s'];
                    }
                }
                if (!timerStr) {
                    this.timer = '活动已结束';
                    clearInterval(this.timeInterval);
                }
                this.timerStr = timerStr;
            }
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
                    
                    startDateTime = startDateTime.replace(/-/g, '/');
                    endDateTime = endDateTime.replace(/-/g, '/');
                    this.timing(startDateTime, endDateTime);
                    this.timeInterval = setInterval(() => {
                        this.timing(startDateTime, endDateTime);
                    }, 1000);
                },
                immediate: true
            }
        },
        beforeDestroy() {
            clearInterval(this.timeInterval);
        }
    }
</script>

<style scoped lang="scss">
    .app-goods-timer {
        font-size: #{24upx};
        color: #ffffff;

        .img {
            width: #{24rpx};
            height: #{24rpx};
            display: block;
            margin-right: #{12rpx};
        }
        
        .timer-1 {
            color: $uni-general-color-two;
        }

        .app-column-1 {
            padding: 0 #{24rpx};
            height: #{80rpx};
            line-height: #{80rpx};
            width: 100%;

            .timer-1 {
                color: #ffffff;
            }

            .sign-name {
                text-align: left;
                font-size: $uni-font-size-import-two;
            }
        }

        .app-column-2 {
            height: #{44rpx};
            line-height: #{44rpx};

            .timer-1 {
                color: #ffffff;
            }
        }
    }
</style>