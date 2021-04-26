<template>
    <app-layout>
        <view class="search-mode">
            <view class="search-input">
                <input type="text" v-model='keyword' placeholder-style='color:#999999;font-size:13px;' placeholder='请输入订单号/商品名称/收货人姓名/联系电话'>
                <image v-if="keyword.length > 0" @click="clearSearch" class="search-clear" src="/static/image/icon/clear.png"></image>
            </view>
            <view class="search-time dir-left-nowrap cross-center">
                <view class="search-time-label">下单时间</view>
                <view @click="dialog=true;type=1" class="search-time-item main-between cross-center" :class="{'placeholder': !start}">
                    <view>{{start != '' ? start : '请选择开始时间'}}</view>
                    <image v-if="start" @click.stop="clearTime(1)" class="time-clear" src="/static/image/icon/clear.png"></image>
                </view>
                <view class="search-time-line"></view>
                <view @click="dialog=true;type=2" class="search-time-item main-between cross-center" :class="{'placeholder': !end}">
                    <view>{{end != '' ? end : '请选择结束时间'}}</view>
                    <image v-if="end" @click.stop="clearTime(2)" class="time-clear" src="/static/image/icon/clear.png"></image>
                </view>
            </view>
            <view>
               <app-iphone-x>
                    <view class="search-menu main-center" slot="empty-area">
                        <view @click="reset" class="box-grow-1 search-menu-item">重置</view>
                        <view @click="toSearch" style="color: #fff" class="box-grow-1 search-menu-item" :style="{'background-color': getTheme.background}">搜索</view>
                    </view>
               </app-iphone-x>
           </view>
        </view>
        <view class="dialog" v-if="dialog" @click="dialog=!dialog">
            <view class="picker-list" @click.stop="">
                <view class="main-between picker-header">
                    <view @click="dialog=false">取消</view>
                    <view @click="submitTime">确定</view>
                </view>
                <picker-view :value="timeVal" :indicator-style="indicatorStyle" @change="timeChange">
                    <picker-view-column>
                        <view v-for="(item,idx) in years" :key="item"
                              :class="[`picker-view`,{
                                'sure-color': timeVal[0] == idx,
                                'cardinal-color': timeVal[0] == idx + 1 || timeVal[0] == idx - 1,
                                'even-color': timeVal[0] == idx + 2 || timeVal[0] == idx - 2,
                              }]"><text>{{item}}</text>年</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view v-for="(item,idx) in months" :key="item"
                              :class="[`picker-view`,{
                                'sure-color': timeVal[1] == idx,
                                'cardinal-color': timeVal[1] == idx + 1 || timeVal[1] == idx - 1,
                                'even-color': timeVal[1] == idx + 2 || timeVal[1] == idx - 2,
                              }]"><text>{{item}}</text>月</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view v-for="(item,idx) in days" :key="item"
                              :class="[`picker-view`,{
                                'sure-color': timeVal[2] == idx,
                                'cardinal-color': timeVal[2] == idx + 1 || timeVal[2] == idx - 1,
                                'even-color': timeVal[2] == idx + 2 || timeVal[2] == idx - 2,
                              }]"><text>{{item}}</text>日</view>
                    </picker-view-column>
                </picker-view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState,mapGetters } from "vuex";
    import appIphoneX from '../../../components/basic-component/app-iphone-x/app-iphone-x.vue';
    const date = new Date()
    const years = []
    const months = []
    const bigDays = []
    const smallDays = []
    const secDays = []
    const otherDays = []

    for (let i = 2015; i <= date.getFullYear(); i++) {
        years.push(i)
    }

    for (let i = 1; i <= 12; i++) {
        months.push(i)
    }

    for (let i = 1; i <= 31; i++) {
        bigDays.push(i)
    }
    for (let i = 1; i <= 30; i++) {
        smallDays.push(i)
    }
    for (let i = 1; i <= 28; i++) {
        secDays.push(i)
    }
    for (let i = 1; i <= 29; i++) {
        otherDays.push(i)
    }
    
    export default {
        data() {
            return {
                keyword: '',
                timeVal: [],
                time: '',
                start: '',
                end: '',
                years: years,
                months: months,
                days: bigDays,
                bigDays: bigDays,
                smallDays: smallDays,
                secDays: secDays,
                otherDays: otherDays,
                today: '',
                type: 1,
                dialog: false
            }
        },
        components: {
            'app-iphone-x': appIphoneX,
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
        },
        methods: {
            clearSearch() {
                this.keyword = '';
            },
            clearTime(type) {
                if (type == 1) {
                    this.start = '';
                } else {
                    this.end = ''
                }
            },
            toSearch() {
                let search = {
                    keyword: this.keyword,
                    dateArr: []
                }
                if (this.start || this.end) {
                    search.dateArr = [this.start, this.end]
                }
                this.$storage.setStorage({
                    key: "search",
                    data: search,
                    success(res) {
                        uni.hideLoading();
                        setTimeout(function () {
                            uni.navigateBack();
                        }, 500)
                    },
                    fail(res) {
                        uni.hideLoading();
                        uni.showToast({
                            title: res.errMsg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                })
            },
            reset() {
                this.keyword = '';
                this.start = '';
                this.end = '';
            },
            submitTime() {
                let start, end;
                let time = new Date(this.time).getTime();
                if (this.type == 1) {
                    if (this.end) {
                        end = new Date(this.end).getTime();
                        if (time > end) {
                            uni.showToast({
                                title: '时间区间选择有误，请确认选择的时间',
                                icon: 'none',
                                duration: 1000
                            });
                            return false
                        }
                    }
                    this.start = this.time;
                } else {
                    if (this.start) {
                        start = new Date(this.start).getTime();
                        if (time < start) {
                            uni.showToast({
                                title: '时间区间选择有误，请确认选择的时间',
                                icon: 'none',
                                duration: 1000
                            });
                            return false
                        }
                    }
                    this.end = this.time
                }
                this.dialog = false;
            },
            timeChange: function (e) {
                const val = +e.detail.value;
                this.timeVal = +e.detail.value;
                let years = this.years;
                let year = this.years[val[0]];
                let month = this.months[val[1]];
                if (month == 2) {
                    if (year % 4 == 0 && year % 400 != 0) {
                        this.days = this.otherDays
                    } else {
                        this.days = this.secDays
                    }
                } else if ((month < 8 && month % 2 == 1) || (month > 7 && month % 2 == 0)) {
                    this.days = this.bigDays
                } else {
                    this.days = this.smallDays
                }
                let day = this.days[val[2]];
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (day >= 1 && day <= 9) {
                    day = "0" + day;
                }
                this.time = year + '-' + month + '-' + day;
            },
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.indicatorStyle = 'height: 36px;color:' + that.color + ';font-size:14px;';
            var myDate = new Date();
            // 今天
            let year = myDate.getFullYear();
            let month = myDate.getMonth() + 1;
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            let now = myDate.getDate();
            that.today = year + "-" + month + "-" + now;
            that.time = that.today;
            for (let i in that.years) {
                if (that.today.substring(0, 4) == that.years[i]) {
                    that.timeVal[0] = +i
                }
            }
            let chooseMonth = that.today.substring(5, 7);
            for (let i in that.months) {
                if (that.today.substring(5, 7) == that.months[i]) {
                    that.timeVal[1] = +i
                }
            }
            if (chooseMonth == 2) {
                if (year % 4 == 0 && year % 400 != 0) {
                    this.days = this.otherDays
                } else {
                    this.days = this.secDays
                }
            } else if ((chooseMonth < 8 && chooseMonth % 2 == 1) || (chooseMonth > 7 && chooseMonth % 2 == 0)) {
                this.days = this.bigDays
            } else {
                this.days = this.smallDays
            }
            for (let i in that.days) {
                if (that.today.substring(8, 10) == that.days[i]) {
                    that.timeVal[2] = +i
                }
            }
            if (this.$storage.getStorageSync('search')) {
                let search = this.$storage.getStorageSync('search');
                that.keyword = search.keyword;
                if (search.dateArr[0]) {
                    that.start = search.dateArr[0];
                }
                if (search.dateArr[1]) {
                    that.end = search.dateArr[1];
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .search-mode {
        position: fixed;
        z-index: 233;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: #f7f7f7;
        .search-input {
            height: #{100rpx};
            background-color: #fff;
            padding: #{19rpx} #{18rpx};
            input {
                padding: 0 #{30rpx};
                background-color: #fff;
                border-radius: #{31rpx};
                height: #{62rpx};
                font-size: #{26rpx};
                color: #353535;
                width: 100%;
                background-color: #f7f7f7;
            }
            .search-clear {
                position: absolute;
                right: #{35rpx};
                top: #{35rpx};
                width: #{30rpx};
                height: #{30rpx};
                z-index: 235;
            }
        }
        .search-time {
            margin-top: #{20rpx};
            padding-left: #{24rpx};
            height: #{100rpx};
            background-color: #fff;
            .search-time-label {
                font-size: #{32rpx};
                color: #353535;
                margin-right: #{28rpx};
            }
            .search-time-item {
                height: #{48rpx};
                line-height: #{44rpx};
                width: #{250rpx};
                font-size: #{24rpx};
                color: #353535;
                border: #{2rpx} solid #e2e2e2;
                padding: 0 #{10rpx} 0 #{16rpx};
                border-radius: #{8rpx};
                &.placeholder {
                    color: #999999;
                }
                .time-clear {
                    width: #{30rpx};
                    height: #{30rpx};
                    margin-right: #{10rpx};
                }
            }
            .search-time-line {
                margin: 0 #{12rpx};
                width: #{24rpx};
                height: #{2rpx};
                background-color: #e2e2e2;
            }
        }
        .search-menu {
            height: #{110rpx};
            width: 100%;
            background-color: #fff;
            .search-menu-item {
                line-height: #{110rpx};
                text-align: center;
                font-size: #{32rpx};
                color: #353535;
            }
        }
    }
    .dialog {
        position: fixed;
        height: 100%;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 240;
        background-color: rgba(0, 0, 0, .3);
        .picker-list {
            background-color: #fff;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            z-index: 242;
            .picker-header {
                padding: 0 #{24rpx};
                color: #446dfd;
                font-size: #{32rpx};
                line-height: #{100rpx};
                height: #{96rpx};
                border-bottom: #{2rpx} solid #e2e2e2;
                &>view:first-of-type {
                    color: #353535;
                }
            }
            picker-view {
                width: 100%;
                height: #{440rpx};
                picker-view-column:first-of-type {
                    flex: 1.75
                }
            }
            .picker-view {
                line-height: #{72rpx};
                text-align:center;
                font-size: #{32rpx};
                &.sure-color {
                    font-size: #{36rpx};
                    color: #353535;
                    font-weight: 600;
                }
                &.cardinal-color {
                    color: #999999;
                }
                &.even-color {
                    color: #cdcdcd;
                }
            }
        }
    }
</style>
