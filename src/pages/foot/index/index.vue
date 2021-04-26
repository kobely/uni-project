<template>
    <app-layout>
        <view class="tab-list">
            <view class="tab cross-center main-center">
                <view class="active">浏览记录</view>
                <view @click="redirect('/pages/foot/summary/summary')">账单总结</view>
            </view>
            <view class="tab-date dir-left-nowrap">
                <view @click="chooseDate(today,today)" :class="[`${start_time == today && today !='' ? 'active' : ''}`]">今日</view>
                <view @click="chooseDate(yesterday,yesterday)" :class="[`${start_time == yesterday && yesterday !='' ? 'active' : ''}`]">昨日</view>
                <view @click="chooseDate(weekday,today)" :class="[`${start_time == weekday && weekday !='' ? 'active' : ''}`]">近7日</view>
                <view @click="chooseDate(monthday,today)" :class="[`${start_time == monthday && monthday !='' ? 'active' : ''}`]">近30日</view>
                <view @click="choose" :class="[`${otherday ? 'active customize' : 'customize'}`]">{{otherday && showTime ? showTime : '自定义时间'}}</view>
            </view>
        </view>
        <view class="tab-placeholder"></view>
        <view v-if="list.length > 0">
            <view v-for="item in list" :key="item.date" class='list'>
                <view class="date-info">{{item.date}}</view>
                <view class="dir-left-wrap">
                    <view class="goods" @click="toDetail(goods)" :key="goods.goods_id" v-for="(goods,index) in item.goods">
                        <image class="goods-img" :src="goods.goodsWarehouse.cover_pic"></image>
                        <view class="out-dialog" v-if="goods.goods_stock == 0 && appSetting.is_show_stock == '1'">
                            <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                        </view>
                        <view class="goods-info">
                            <view class="t-omit-two goods-name">{{goods.goodsWarehouse.name}}</view>
                            <view class="main-between cross-center">
                                <view>{{goods.is_negotiable == 1 ? '价格面议' : '￥'+goods.price}}</view>
                                <view @click.stop="toShow(goods,item,index)" class="more main-center cross-center">
                                    <image src="./../image/foot-more.png"></image>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="no-list main-center cross-center dir-top-nowrap" v-else>
            <image src="./../image/foot.png"></image>
            <view>暂无浏览的足迹哦~</view>
            <view @click="redirect('/pages/index/index')" class="to-mall">去商城逛逛</view>
        </view>
        <view :catchtouchmove="!showMenu" v-if="showMenu" class="dialog">
            <view class="other-area" @click="closeMenu"></view>
            <view class="menu-card">
                <view @click="closeMenu" class="close-menu-icon">
                    <image src="./../image/black-close.png"></image>
                </view>
                <view class="main-center menu-item">
                    <view v-if="!detail.sign || detail.sign == 'mch' || detail.sign == 'advance' || detail.sign == 'pick' || detail.sign == 'community' || detail.sign == 'wholesale'" @click="toFavorite">
                        <image class="menu-icon" src="./../image/to-favorite.png"></image>
                        <view>收藏</view>
                    </view>
                    <view @click="beDelete=true">
                        <image class="menu-icon" src="./../image/to-delete.png"></image>
                        <view>删除</view>
                    </view>
                </view>
                <view @click="closeMenu" class="close-menu">取消</view>
            </view>
        </view>
        <view :catchtouchmove="!beDelete" v-if="beDelete" class="tips-dialog cross-center main-center">
            <view class="delete-info">
                <view class="delete-content">是否删除该条足迹?</view>
                <view class="delete-btn main-between">
                    <view @click="closeMenu" class="btn">取消</view>
                    <view class="line"></view>
                    <view @click="toDelete" class="btn submit-btn">确认</view>
                </view>
            </view>
        </view>
        <view v-if="showText" class="dialog-title cross-center main-center">
            <view>{{showText}}</view>
        </view>
        <!-- 选时间 -->
        <view :catchtouchmove="!chooseTime" class="time-dialog cross-center main-center" v-if="chooseTime">
            <view class="time-dialog-content">
                <view class="time-dialog-title">筛选时间</view>
                <view class="choose-time">
                    <view class="time-title">起始时间</view>
                    <view class="year-1">年</view>
                    <view class="month-1">月</view>
                    <view class="day-1">日</view>
                    <view class="year-2">年</view>
                    <view class="month-2">月</view>
                    <view class="day-2">日</view>
                    <picker-view :value="start" class="picker-view" @change="startChange">
                        <picker-view-column>
                            <view 
                                v-for="(item, index) in years"
                                :class="{
                                    'sure-color': chooseStart[0] === index,
                                    'cardinal-color': chooseStart[0] === index + 1 || chooseStart[0] === index - 1,
                                    'even-color': chooseStart[0] === index + 2 || chooseStart[0] === index - 2,
                                }" 
                                :key="item">{{item}}
                            </view>
                        </picker-view-column>
                        <picker-view-column>
                            <view 
                                v-for="(item, index) in months"
                                :class="{
                                    'sure-color': chooseStart[1] === index,
                                    'cardinal-color': chooseStart[1] === index + 1 || chooseStart[1] === index - 1,
                                    'even-color': chooseStart[1] === index + 2 || chooseStart[1] === index - 2,
                                }" 
                                :key="item">{{item}}
                            </view>
                        </picker-view-column>
                        <picker-view-column>
                            <view 
                                v-for="(item, index) in days"
                                :class="{
                                    'sure-color': chooseStart[2] === index,
                                    'cardinal-color': chooseStart[2] === index + 1 || chooseStart[2] === index - 1,
                                    'even-color': chooseStart[2] === index + 2 || chooseStart[2] === index - 2,
                                }" 
                                :key="item">{{item}}
                            </view>
                        </picker-view-column>
                    </picker-view>
                    <view class="time-title">结束时间</view>
                    <picker-view  :value="end" indicator-style="height: 36px;color: #ff4544;font-size:14px;" class="picker-view" @change="endChange">
                        <picker-view-column>
                            <view 
                                v-for="(item, index) in years"
                                :class="{
                                    'sure-color': chooseEnd[0] === index,
                                    'cardinal-color': chooseEnd[0] === index + 1 || chooseEnd[0] === index - 1,
                                    'even-color': chooseEnd[0] === index + 2 || chooseEnd[0] === index - 2,
                                }" 
                                :key="item">{{item}}
                            </view>
                        </picker-view-column>
                        <picker-view-column>
                            <view 
                                v-for="(item, index) in months"
                                :class="{
                                    'sure-color': chooseEnd[1] === index,
                                    'cardinal-color': chooseEnd[1] === index + 1 || chooseEnd[1] === index - 1,
                                    'even-color': chooseEnd[1] === index + 2 || chooseEnd[1] === index - 2,
                                }" 
                                :key="item">{{item}}
                            </view>
                        </picker-view-column>
                        <picker-view-column>
                            <view 
                                v-for="(item, index) in days"
                                :class="{
                                    'sure-color': chooseEnd[2] === index,
                                    'cardinal-color': chooseEnd[2] === index + 1 || chooseEnd[2] === index - 1,
                                    'even-color': chooseEnd[2] === index + 2 || chooseEnd[2] === index - 2,
                                }" 
                                :key="item">{{item}}
                            </view>
                        </picker-view-column>
                    </picker-view>
                </view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='toChoose'>确认</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState,mapGetters } from "vuex";

    const date = new Date();
    const years = [];
    const months = [];
    const days = [];
    for (let i = 2017; i <= date.getFullYear(); i++) {
        years.push(i);
    }
    for (let i = 1; i <= 12; i++) {
        months.push(i);
    }
    for (let i = 1; i <= 31; i++) {
        days.push(i);
    }
    export default {
        data() {
            return {
                showMenu: false,
                otherday: false,
                beDelete: false,
                page: 1,
                detail: {},
                chooseTime: false,
                end_time: '',
                start_time: '',
                today: '',
                yesterday: '',
                showText: false,
                weekday: '',
                monthday: '',
                list: [],
                start: [],
                end: [],
                chooseStart: [],
                chooseEnd: [],
                showTime: '',
                years: years,
                months: months,
                days: days,
                selectAttr: null,
                loading: false,
                index: -1,
                dateList: null,
                buyText: '立即购买',
                sign: '',
                cartShow: 1,
                plugin: '',
                buyBool: false,
                previewUrl: '',
                submitUrl: '',
                attrShow: 0
            }
        },
        computed: {
            ...mapState({
                appSetting: state => state.mallConfig.mall.setting,
                appImg: state => state.mallConfig.__wxapp_img.mall,
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            }),
            ...mapGetters('mallConfig', {
                getVideo: 'getVideo',
                getTheme: 'getTheme'
            })
        },
        methods: {
            // 路由重定向
            redirect(url) {
                uni.redirectTo({
                    url: url
                });
            },
            toDetail(item) {
                // #ifndef MP-BAIDU
                if (item.goodsWarehouse.video_url && this.getVideo == 1) {
                    // #ifdef MP
                    uni.navigateTo({
                        url: `/pages/goods/video?goods_id=${item.goods_id}&sign=${item.sign}`
                    });
                    // #endif
                    // #ifdef H5
                    uni.navigateTo({
                        url: item.page_url
                    })
                    // #endif
                } else {
                    uni.navigateTo({
                        url: item.page_url
                    })
                }
                // #endif
                // #ifdef MP-BAIDU
                uni.navigateTo({
                    url: item.page_url
                })
                // #endif
            },
            startChange: function(e) {
                this.chooseStart = e.detail.value;
            },
            endChange: function(e) {
                this.chooseEnd = e.detail.value;
            },
            toChoose() {
                let startYear = this.years[this.chooseStart[0]];
                let startMonth = this.months[this.chooseStart[1]];
                let startDay = this.days[this.chooseStart[2]];
                let endYear = this.years[this.chooseEnd[0]];
                let endMonth = this.months[this.chooseEnd[1]];
                let endDay = this.days[this.chooseEnd[2]];
                if (+endYear == +startYear) {
                    if (endMonth == +startMonth) {
                        if (+endDay >= +startDay) {
                            this.getTimeList(startYear, endYear, startMonth, endMonth, startDay, endDay);
                        } else {
                            uni.showToast({
                                title: '结束时间不应早于开始时间',
                                icon: 'none',
                                duration: 1000
                            })
                        }
                    } else if (+endMonth > +startMonth) {
                        this.getTimeList(startYear, endYear, startMonth, endMonth, startDay, endDay);
                    } else if (+endMonth < +startMonth) {
                        uni.showToast({
                            title: '结束时间不应早于开始时间',
                            icon: 'none',
                            duration: 1000
                        })
                    }
                } else if (+endYear > +startYear) {
                    this.getTimeList(startYear, endYear, startMonth, endMonth, startDay, endDay);
                } else if (+endYear < +startYear) {
                    uni.showToast({
                        title: '结束时间不应早于开始时间',
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            getTimeList(startYear, endYear, startMonth, endMonth, startDay, endDay) {
                this.otherday = true;
                if (startMonth >= 1 && startMonth <= 9) {
                    startMonth = "0" + startMonth;
                }
                if (startDay >= 1 && startDay <= 9) {
                    startDay = "0" + startDay;
                }
                this.start_time = startYear + '-' + startMonth + '-' + startDay;
                if (endMonth >= 1 && endMonth <= 9) {
                    endMonth = "0" + endMonth;
                }
                if (endDay >= 1 && endDay <= 9) {
                    endDay = "0" + endDay;
                }
                this.end_time = endYear + '-' + endMonth + '-' + endDay;
                this.chooseTime = false;
                this.showTime = this.start_time.substr(5).replace('-','.') + '-' + this.end_time.substr(5).replace('-','.')
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.page = 1;
                this.list = [];
                this.getList();
            },
            choose() {
                let that = this;
                that.start = [];
                that.end = [];
                let startDay;
                let endDay;
                if (that.start_time) {
                    startDay = that.start_time;
                } else {
                    startDay = that.today;
                }
                if (that.end_time) {
                    endDay = that.end_time;
                } else {
                    endDay = that.today;
                }
                that.years.forEach(function(row, index) {
                    if (startDay.substring(0, 4) == that.years[index]) {
                        that.start[0] = +index
                    }
                })
                that.months.forEach(function(row, index) {
                    if (startDay.substring(5, 7) == that.months[index]) {
                        that.start[1] = +index
                    }
                })
                that.days.forEach(function(row, index) {
                    if (startDay.substring(8, 10) == that.days[index]) {
                        that.start[2] = +index
                    }
                })
                that.years.forEach(function(row, index) {
                    if (endDay.substring(0, 4) == that.years[index]) {
                        that.end[0] = +index
                    }
                })
                that.months.forEach(function(row, index) {
                    if (endDay.substring(5, 7) == that.months[index]) {
                        that.end[1] = +index
                    }
                })
                that.days.forEach(function(row, index) {
                    if (endDay.substring(8, 10) == that.days[index]) {
                        that.end[2] = +index
                    }
                })
                that.chooseStart = that.start;
                that.chooseEnd = that.end;
                that.chooseTime = !that.chooseTime;
            },
            toDelete() {
                this.$request({
                    url: this.$api.foot.del,
                    data: {
                        id: this.detail.id
                    }
                }).then(response => {
                    uni.hideLoading();
                    this.$hideLoading();
                    if(response.code === 0) {
                        this.showText = response.msg;
                        this.closeMenu();
                        this.dateList.goods.splice(this.index,1);
                        setTimeout(() => {
                            this.showText = false;
                        },1000);
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    uni.hideLoading();
                    this.$hideLoading();
                });
            },
            toShow(goods,item,index) {
                this.detail = goods;
                this.dateList = item;
                this.index = index;
                this.showMenu = true;
            },
            closeMenu() {
                this.detail = {};
                this.beDelete = false;
                this.showMenu = false;
            },
            cancel() {
                this.chooseTime = false;
                this.otherday = false;
                this.chooseStart = [];
                this.chooseEnd = [];
            },
            getList() {
                let that = this;
                if(that.loading) {
                    return false
                }
                that.loading = true;
                that.$request({
                    url: that.$api.foot.index,
                    data: {
                        start_time: that.start_time + ' 00:00:00',
                        end_time: that.end_time + ' 23:59:59',
                        page: that.page
                    }
                }).then(response=>{
                    that.loading = false;
                    uni.hideLoading();
                    that.$hideLoading();
                    if(response.code === 0) {
                        if(that.list.length > 0) {
                            if(that.list[that.list.length-1].date == response.list[0].date) {
                                that.list[that.list.length-1].goods = that.list[that.list.length-1].goods.concat(response.list.shift().goods);
                            }
                            that.list = that.list.concat(response.list)
                        }else {
                            that.list = that.list.concat(response.list)
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.loading = false;
                    uni.hideLoading();
                    that.$hideLoading();
                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(()=>{
                        that.getList();
                    });
                });
            },
            toFavorite() {
                let that = this;
                that.$request({
                    url: that.$api.user.favorite_add,
                    data: {
                        goods_id: that.detail.goods_id
                    }
                }).then(response=>{
                    if(response.code === 0 || response.msg === '已经收藏过啦！') {
                        that.showText = response.msg;
                        that.closeMenu();
                        setTimeout(v=>{
                            that.showText = false;
                        },1000);
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                })
            },
            // 获取日期
            getDate() {
                let myDate = new Date();
                // 今天
                let year = myDate.getFullYear();
                let month = myDate.getMonth() + 1;
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                let now = myDate.getDate();
                this.today = year + "-" + month + "-" + now;
                let timestamp = Date.parse(new Date());
                // 昨天
                let yesterTime = (timestamp / 1000 - 24 * 60 * 60) * 1000;
                let yesterDate = new Date(yesterTime)
                let yester_year = yesterDate.getFullYear();
                let yester_month = yesterDate.getMonth() + 1;
                if (yester_month >= 1 && yester_month <= 9) {
                    yester_month = "0" + yester_month;
                }
                let yester_now = yesterDate.getDate();
                this.yesterday = yester_year + "-" + yester_month + "-" + yester_now;
                // 7天
                let weekTime = (timestamp / 1000 - 24 * 60 * 60 * 7) * 1000;
                let weekDate = new Date(weekTime)
                let week_year = weekDate.getFullYear();
                let week_month = weekDate.getMonth() + 1;
                if (week_month >= 1 && week_month <= 9) {
                    week_month = "0" + week_month;
                }
                let week_now = weekDate.getDate();
                this.weekday = week_year + "-" + week_month + "-" + week_now;
                // 30天
                let monthTime = (timestamp / 1000 - 24 * 60 * 60 * 30) * 1000;
                let monthDate = new Date(monthTime)
                let month_year = monthDate.getFullYear();
                let month_month = monthDate.getMonth() + 1;
                if (month_month >= 1 && month_month <= 9) {
                    month_month = "0" + month_month;
                }
                let month_now = monthDate.getDate();
                this.monthday = month_year + "-" + month_month + "-" + month_now;
            },
            chooseDate(start,end) {
                if(this.loading) {
                    return false
                }
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.otherday = false;
                this.list = [];
                this.page = 1;
                this.start_time = start;
                this.end_time = end;
                this.getList();
            }
        },
        onLoad() { this.$commonLoad.onload();
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.getDate();
            this.start_time = this.today;
            this.end_time = this.today;
            this.getList();
        },
        onReachBottom() {
            this.page++;
            this.getList();
        }
    }
</script>

<style scoped lang="scss">
    .out-dialog {
        width: #{238rpx};
        height: #{238rpx};
        position: absolute;
        border-top-left-radius: #{16rpx};
        border-top-right-radius: #{16rpx};
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,.5);
        image {
            border-top-left-radius: #{16rpx};
            border-top-right-radius: #{16rpx};
            width: #{238rpx};
            height: #{238rpx};
        }
    }
    .no-list {
        font-size: #{32rpx};
        color: #999999;
        height: #{800rpx};
        width: 100%;
        image {
            width: #{115rpx};
            height: #{122rpx};
            margin-bottom: #{40rpx};
        }
        .to-mall {
            width: #{320rpx};
            height: #{80rpx};
            line-height: #{80rpx};
            text-align: center;
            border-radius: #{40rpx};
            background-color: #FF4544;
            color: #fff;
            margin-top: #{40rpx};
        }
    }
    .dialog-title {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        view {
            padding: #{22rpx} #{32rpx};
            background-color: rgba(0,0,0,.8);
            border-radius: #{8rpx};
            color: #fff;
            font-size: #{26rpx};
        }
    }
    .tab-list {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        background-color: #fff;
        padding: #{20rpx} 0;
        width: 100%;
        .tab {
            width: #{600rpx};
            height: #{72rpx};
            border-radius: #{40rpx};
            font-size: #{28rpx};
            color: #ff4544;
            border: #{2rpx} solid #ff4544;
            margin: 0 auto #{20rpx};
            view {
                width: #{300rpx};
                height: #{72rpx};
                text-align: center;
                line-height: #{72rpx};
            }
            .active {
                border-radius: #{36rpx};
                background-color: #ff4544;
                color: #fff;
            }
        }
        .tab-date {
            view {
                padding: 0 #{24rpx};
                height: #{60rpx};
                line-height: #{60rpx};
                margin-left: #{24rpx};
                border-radius: #{40rpx};
                color: #353535;
                font-size: #{26rpx};
                display: inline-block;
            }
            .customize {
                width: #{172rpx};
                padding: 0;
                text-align: center;
            }
            .active {
                background-color: #ff4544;
                color: #fff;
            }
        }
    }
    .tab-placeholder {
        height: #{192rpx};
    }
    .list {
        padding-left: #{9rpx};
        .date-info {
            padding-left: #{21rpx};
            color: #999999;
            font-size: #{26rpx};
            height: #{68rpx};
            line-height: #{68rpx};
        }
        .goods {
            background-color: #fff;
            font-size: #{28rpx};
            border-radius: #{16rpx};
            margin-right: #{9rpx};
            margin-bottom: #{9rpx};
            color: #353535;
            position: relative;
            .goods-img {
                height: #{238rpx};
                width: #{238rpx};
                border-top-left-radius: #{16rpx};
                border-top-right-radius: #{16rpx};
            }
            .goods-info {
                padding: #{8rpx} #{24rpx} #{16rpx};
                border-bottom-left-radius: #{16rpx};
                border-bottom-right-radius: #{16rpx};
                width: #{238rpx};
                position: relative;
                color: #ff4544;
                .goods-name {
                    color: #353535;
                    margin-bottom: #{10rpx};
                    height: #{76rpx};
                }
                .more {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    height: #{60rpx};
                    width: #{60rpx};
                    image {
                        width: #{32rpx};
                        height: #{6rpx};
                    }
                }
            }
        }
    }
    .dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 20;
        background-color: rgba(0,0,0,.5);
        .other-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 21;
        }
        .menu-card {
            padding-top: #{50rpx};
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: #{312rpx};
            z-index: 22;
            border-top-left-radius: #{16rpx};
            border-top-right-radius: #{16rpx};
            background-color: rgba(255,255,255,.85);
            .close-menu-icon {
                position: absolute;
                top: 0;
                right: 0;
                padding: #{24rpx};
                image {
                    width: #{21rpx};
                    height: #{21rpx};
                    display: block;    
                }
            }
            .close-menu {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: #{100rpx};
                background-color: #fff;
                font-size: #{30rpx};
                color: #545454;
                font-weight: bold;
                text-align: center;
                line-height: #{100rpx};
            }
            .menu-item {
                font-size: #{23rpx};
                color: #545454;
                >view {
                    text-align: center;
                    width: #{96rpx};
                    margin: 0 #{17rpx};
                    .menu-icon {
                        width: #{96rpx};
                        height: #{96rpx};
                        margin-bottom: #{4rpx};
                    }
                }
            }
        }
    }
    .tips-dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 200;
        background-color: rgba(0,0,0,.5);
        .delete-info {
            width: #{620rpx};
            height: #{280rpx};
            border-radius: #{16rpx};
            background-color: #fff;
            font-size: #{36rpx};
            color: #353535;
            position: relative;
            .delete-content {
                width: #{620rpx};
                text-align: center;
                margin-top: #{76rpx};
            }
            .delete-btn {
                position: absolute;
                width: 100%;
                bottom: 0;
                left: 0;
                height: #{88rpx};
                border-top: #{1rpx} solid #e2e2e2;
                .line {
                    position: absolute;
                    left: 50%;
                    margin-left: #{-1rpx};
                    bottom: #{28rpx};
                    width: #{1rpx};
                    height: #{32rpx};
                    background-color: #e2e2e2;
                }
                .btn {
                    width: 50%;
                    height: #{88rpx};
                    line-height: #{88rpx};
                    text-align: center;
                    color: #666666;
                }
                .btn.submit-btn {
                    color: #ff4544;
                }
            }
        }
    }
    .time-dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 30;
        background-color: rgba(0,0,0,.3);
        .time-dialog-content {
            width: #{620rpx};
            height: #{778rpx};
            background-color: #fff;
            border-radius: #{16rpx};
            font-size: #{28rpx};
            .time-dialog-title {
                width: #{620rpx};
                text-align: center;
                margin-top: #{30rpx};
                font-size: #{32rpx};
                color: #353535;
            }
            .choose-time {
                margin-top: #{30rpx};
                padding: 0 #{33rpx} #{33rpx};
                font-size: #{28rpx};
                color: #353535;
                position: relative;
                .time-title {
                    color: #666666;
                }
                .year-1 {
                    position: absolute;
                    left: #{192rpx};
                    top: #{128rpx};
                }
                .month-1 {
                    position: absolute;
                    left: #{380rpx};
                    top: #{128rpx};
                }
                .day-1 {
                    position: absolute;
                    right: #{32rpx};
                    top: #{128rpx};
                }
                .year-2 {
                    position: absolute;
                    left: #{192rpx};
                    bottom: #{148rpx};
                }
                .month-2 {
                    position: absolute;
                    left: #{380rpx};
                    bottom: #{148rpx};
                }
                .day-2 {
                    position: absolute;
                    right: #{32rpx};
                    bottom: #{148rpx};
                }
            }
            .btn-area {
                height: #{88rpx};
                position: relative;
                border-top: #{2rpx} solid #f1f1f1;
            }
            .btn-area.other-btn-area {
                margin-top: #{10rpx};
            }
            .btn-area .line {
                height: #{32rpx};
                width: #{1rpx};
                background-color: #e2e2e2;
                position: absolute;
                top: #{28rpx};
                left: 0;
                right: 0;
                margin: 0 auto;
            }
            .submit-btn {
                height: #{88rpx};
                line-height: #{88rpx};
                font-size: #{32rpx};
                color: #666;
                width: #{310rpx};
                text-align: center;
            }
            .submit-btn.be-submit {
                color: #ff4544;
            }
            .picker-view {
                width: #{556rpx};
                height: #{216rpx};
                margin: 0 auto #{25rpx};
                text-align: center;
                .sure-color {
                    color: #ff4544;
                }
                .cardinal-color {
                    color: #999999;
                }
                .even-color {
                    color: #cdcdcd;
                }
            }
            .picker-view view {
                line-height: #{72rpx};
            }
        }
    }
</style>