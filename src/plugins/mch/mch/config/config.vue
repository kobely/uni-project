<template>
    <app-layout>
        <view class="apply-com">基本信息</view>
        <view class="white">
            <view class="dir-left-nowrap cross-center form-input">
                <view class="box-grow-0 form-label main-right">联系人</view>
                <view class="box-grow-1">
                    <input @input="applyInput"
                           data-type="realname"
                           placeholder-class="plugins-mch-config-input"
                           placeholder="必填"
                           name="realname"
                           :value="form.realname"/>
                </view>
            </view>
            <view class="dir-left-nowrap cross-center form-input">
                <view class="box-grow-0 form-label main-right">联系电话</view>
                <view class="box-grow-1">
                    <input @input="applyInput"
                           data-type="mobile"
                           placeholder-class="plugins-mch-config-input"
                           placeholder="必填"
                           maxlength="18"
                           name="mobile"
                           :value="form.mobile"/>
                </view>
            </view>
            <view class="dir-left-nowrap cross-center form-input">
                <view class="box-grow-0 form-label main-right">微信号</view>
                <view class="box-grow-1">
                    <input @input="applyInput"
                           data-type="wechat"
                           placeholder-class="plugins-mch-config-input"
                           placeholder="请输入微信号"
                           name="wechat"
                           :value="form.wechat"/>
                </view>
            </view>
        </view>

        <view class="apply-com">账号信息</view>
        <view class="white">
            <view class="dir-left-nowrap cross-center form-input">
                <view class="box-grow-0 form-label main-right">账号</view>
                <view class="box-grow-1">
                    <input @input="applyInput"
                           data-type="username"
                           name="username"
                           placeholder="请输入账号"
                           placeholder-class="plugins-mch-config-input"
                           :value="form.username"/>
                </view>
            </view>
            <view class="dir-left-nowrap cross-center form-input">
                <view class="box-grow-0 form-label main-right">密码</view>
                <view class="box-grow-1" @click="navPassword">
                    <view class="dir-left-nowrap cross-center">
                        <view class="box-grow-1 password">修改密码</view>
                        <view class="box-grow-0 cross-center">
                            <icon class="icon-arrow-right" type></icon>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <view class="apply-com">店铺信息</view>
        <view class="white">
            <view class="dir-left-nowrap cross-center form-input">
                <view class="box-grow-0 form-label ">店铺名称</view>
                <view class="box-grow-1">
                    <input @input="applyInput"
                           data-type="name"
                           placeholder-class="plugins-mch-config-input"
                           placeholder="必填"
                           :value="form.name"/>
                </view>
            </view>
            <view class="dir-left-nowrap cross-center form-input">
                <view class="box-grow-0 form-label ">营业状态</view>
                <view class="box-grow-1 dir-right-nowrap">
                    <view @click="form.is_open = form.is_open == 1? 2: 1" class="switch-view"  :class="{'app-switch-view':form.is_open == 1 }">
                        <view class="click" :class="{'app-switch': form.is_open == 1 }"></view>
                    </view>
                </view>
            </view>
            <view v-if="form.is_open == 1" class="dir-left-nowrap cross-center form-input">
                <view @click="form.open_type = 1" class="dir-left-nowrap cross-center box-grow-0 form-radio-input">
                    <view class="box-grow-0">
                        <app-radio @click="form.open_type = 1" :value="form.open_type == 1" :item="form" :theme="theme" type="round"></app-radio>
                    </view>
                    <view class="box-grow-0 radio-text" :style="{'color': form.open_type == 1 ? '#ff4544':'353535'}">全天24小时营业</view>
                </view>
                <view @click="form.open_type = 2" class="dir-left-nowrap cross-center box-grow-0 form-radio-input">
                    <view class="box-grow-0">
                        <app-radio @click="form.open_type = 2" :value="form.open_type == 2" :item="form" :theme="theme" type="round"></app-radio>
                    </view>
                    <view class="box-grow-0 radio-text" :style="{'color': form.open_type == 2 ? '#ff4544':'353535'}">自定义营业时间</view>
                </view>
            </view>
            <view @click="openTime" v-if="form.is_open == 1 && form.open_type == 2" class="dir-left-nowrap cross-center form-input">
                <view class="box-grow-0 form-label ">选择日期</view>
                <view class="box-grow-1 dir-right-nowrap">
                    <view class="cross-center dir-right-nowrap category-info">
                        <view class="box-grow-0 cross-center">
                            <icon class="icon-arrow-right" type></icon>
                        </view>
                        <view class="box-grow-0 category-select">
                            <view v-if="form.week_list.length == 0">未填写</view>
                            <view v-else class="t-omit switch-open-text">
                                <text v-for="(item,index) in form.week_list" :key="index">
                                    <text v-if="item == '1'">周一</text>
                                    <text v-if="item == '2'">周二</text>
                                    <text v-if="item == '3'">周三</text>
                                    <text v-if="item == '4'">周四</text>
                                    <text v-if="item == '5'">周五</text>
                                    <text v-if="item == '6'">周六</text>
                                    <text v-if="item == '7'">周日</text>
                                    <text v-if="index != form.week_list.length - 1">、</text>
                                </text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view @click="toSettingTime" v-if="form.is_open == 1 && form.open_type == 2" class="dir-left-nowrap cross-center form-input">
                <view class="box-grow-0 form-label ">选择时间段</view>
                <view class="box-grow-1 dir-right-nowrap">
                    <view class="cross-center dir-right-nowrap category-info">
                        <view class="box-grow-0 cross-center">
                            <icon class="icon-arrow-right" type></icon>
                        </view>
                        <view class="box-grow-0 category-select">
                            <view v-if="form.time_list.length == 0">未填写</view>
                            <view v-else class="t-omit switch-open-text">
                                <text v-for="(item,index) in form.time_list" :key="index">
                                    {{item.value[0]}}-{{item.value[1]}}<text v-if="index != form.time_list.length - 1">、</text>
                                </text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="form.is_open == 2" class="dir-left-nowrap cross-center form-input">
                <view class="box-grow-0 form-label ">设置自动开业时间</view>
                <view class="box-grow-1">
                    <view @click="openAuto" class="box-grow-0 cross-center dir-right-nowrap radio-text" style="color: #666666">
                        <icon class="icon-arrow-right" type></icon>
                        <view v-if="form.is_auto_open == 1">
                            不设置
                        </view>
                        <view v-else-if="form.is_auto_open == 2">
                            {{form.auto_open_time}}
                        </view>
                    </view>
                </view>
            </view>
            <view class="dir-left-nowrap cross-center form-input">
                <view class="box-grow-0 form-label ">所在地区</view>
                <view class="box-grow-1 area-left">
                    <app-area-picker @customevent="areaEvent"
                                     :ids="[area.province_id, area.city_id, area.district_id]"></app-area-picker>
                </view>
            </view>

            <view class="dir-left-nowrap cross-center form-input">
                <view class="box-grow-0 form-label ">详细地址</view>
                <view class="box-grow-1">
                    <input @input="applyInput"
                           data-type="address"
                           placeholder-class="plugins-mch-config-input"
                           placeholder="必填"
                           name="address"
                           :value="form.address"/>
                </view>
            </view>


            <view class="dir-left-nowrap cross-center form-input">
                <view class="box-grow-0 form-label ">所售类目</view>
                <view class="box-grow-1">
                    <picker :range="category_list" range-key="name" class="category-picker" :value="form.mch_common_cat_key" @change="categoryChange">
                        <view class="cross-center dir-left-nowrap category-info">
                            <view class="box-grow-1 category-select">
                                {{form.mch_common_cat_str ? form.mch_common_cat_str:`请选择`}}
                            </view>
                            <view class="box-grow-0 cross-center">
                                <icon class="icon-arrow-right" type></icon>
                            </view>
                        </view>
                    </picker>
                </view>
            </view>

            <view class="dir-left-nowrap cross-center form-input">
                <view class="box-grow-0 form-label ">客服电话</view>
                <view class="box-grow-1">
                    <input @input="applyInput"
                           data-type="service_mobile"
                           placeholder-class="plugins-mch-config-input"
                           placeholder="必填"
                           name="service_mobile"
                           :value="form.service_mobile"/>
                </view>
            </view>

            <view class="dir-left-nowrap cross-center form-input end">
                <view class="form-label box-grow-0 dir-top-nowrap ">
                    <view>店铺头像</view>
                    <view class="bigness">240×240</view>
                </view>
                <view class="box-grow-1">
                    <view class="dir-left-nowrap up-pic" @click="uploadCoverUrl">
                        <view class="box-grow-1 cross-center category-picker">
                            <view v-if="form.cover_url" class="shop-pic">
                                <image mode="aspectFill" :src="form.cover_url" class="pic-head"></image>
                            </view>
                            <view v-else class="box-grow-1 category-select">请选择图片</view>
                        </view>
                        <view class="box-grow-0 cross-center">
                            <icon class="icon-arrow-right" type></icon>
                        </view>
                    </view>
                </view>
            </view>

            <view class="dir-left-nowrap cross-center form-input end">
                <view class="form-label box-grow-0 dir-top-nowrap ">
                    <view>店铺背景</view>
                    <view class="bigness">750×200</view>
                </view>
                <view class="box-grow-1">
                    <view class="dir-left-nowrap up-pic" @click="uploadPicUrl">
                        <view class="box-grow-1 cross-center category-picker">
                            <view v-if="form.pic_url" class="shop-pic">
                                <image mode="aspectFill" :src="form.pic_url" class="pic-bg"></image>
                            </view>
                            <view v-else class="box-grow-1 category-select">请选择图片</view>
                        </view>
                        <view class="box-grow-0 cross-center">
                            <icon class="icon-arrow-right" type></icon>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="main-center submit-btn">
            <app-button @click="formSubmit" height="80" width="702" font-size="32" background="#ff4544" color="#ffffff"
                        round>提交
            </app-button>
        </view>
        <view @touchmove.stop.prevent="" class="time-bg cross-center" v-if="timeDialog">
            <view class="time-dialog">
                <view class="dialog-title">自定义营业时间</view>
                <view class="flex-wrap main-between cross-center time-area date-area">
                    <view v-for="item in date" :key="item.value" @click="chooseDate(item)" :class="[`${item.check?`a-m-text a a-m-border`:'time-area-item'}`]" class="dialog-choose-item">{{item.label}}</view>
                </view>
                <view class="main-center btn-area">
                    <view class="time-submit-btn" @click='cancel' style="color: #666;">取消</view>
                    <view class="line"></view>
                    <view class="time-submit-btn" style="color: #ff4544;" @click='submitTime'>确认</view>
                </view>
            </view>
        </view>
        <view @touchmove.stop.prevent="" class="time-bg cross-center" v-if="autoDialog">
            <view class="time-dialog">
                <view class="dialog-title">设置自动开业</view>
                <view class="main-center cross-center time-area">
                    <view @click="changeAuto(1)" :class="[`${chooseAuto==1?`a-m-text a a-m-border`:'time-area-item'}`]" class="dialog-choose-item">不设置</view>
                    <view @click="changeAuto(2)" :class="[`${chooseAuto==2?`a-m-text a a-m-border`:'time-area-item'}`]" class="dialog-choose-item">设置</view>
                </view>
                <view class="choose-time" v-if="chooseAuto==2">
                    <view class="time-title">设置自动开业时间</view>
                    <view class="year-1">年</view>
                    <view class="month-1">月</view>
                    <view class="day-1">日</view>
                    <view class="year-2">时</view>
                    <view class="month-2">分</view>
                    <view class="day-2">秒</view>
                    <picker-view :value="dateVal" :indicator-style="indicatorStyle" class="picker-view" @change="dateChange">
                        <picker-view-column>
                            <view v-for="(item,idx) in years" :key="item"
                                :class="[`${dateVal[0] == idx ?`a-m-text a`: ''}`]"
                                :style="{ color: dateVal[0] == idx + 1 || dateVal[0] == idx - 1 ? '#999999' : dateVal[0] == idx + 2 || dateVal[0] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
                        </picker-view-column>
                        <picker-view-column>
                            <view v-for="(item,idx) in months" :key="item"
                                :class="[`${dateVal[1] == idx ?`a-m-text a`: ''}`]"
                                :style="{ color: dateVal[1] == idx + 1 || dateVal[1] == idx - 1 ? '#999999' : dateVal[1] == idx + 2 || dateVal[1] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
                        </picker-view-column>
                        <picker-view-column>
                            <view v-for="(item,idx) in days" :key="item"
                                :class="[`${dateVal[2] == idx ?`a-m-text a`: ''}`]"
                                :style="{ color: dateVal[2] == idx + 1 || dateVal[2] == idx - 1 ? '#999999' : dateVal[2] == idx + 2 || dateVal[2] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
                        </picker-view-column>
                    </picker-view>
                    <picker-view :value="timeVal" :indicator-style="indicatorStyle" class="picker-view" @change="timeChange">
                        <picker-view-column>
                            <view v-for="(item,idx) in hour" :key="item"
                                :class="[`${timeVal[0] == idx ?`a-m-text a`: ''}`]"
                                :style="{ color: timeVal[0] == idx + 1 || timeVal[0] == idx - 1 ? '#999999' : timeVal[0] == idx + 2 || timeVal[0] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
                        </picker-view-column>
                        <picker-view-column>
                            <view v-for="(item,idx) in minutes" :key="item"
                                :class="[`${timeVal[1] == idx ?`a-m-text a`: ''}`]"
                                :style="{ color: timeVal[1] == idx + 1 || timeVal[1] == idx - 1 ? '#999999' : timeVal[1] == idx + 2 || timeVal[1] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
                        </picker-view-column>
                        <picker-view-column>
                            <view v-for="(item,idx) in minutes" :key="item"
                                :class="[`${timeVal[2] == idx ?`a-m-text a`: ''}`]"
                                :style="{ color: timeVal[2] == idx + 1 || timeVal[2] == idx - 1 ? '#999999' : timeVal[2] == idx + 2 || timeVal[2] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
                        </picker-view-column>
                    </picker-view>
                </view>
                <view class="main-center btn-area">
                    <view class="time-submit-btn" @click='cancel' style="color: #666;">取消</view>
                    <view class="line"></view>
                    <view class="time-submit-btn" style="color: #ff4544;" @click='submitAutoTime'>确认</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import appAreaPicker from '../../../../components/page-component/app-area-picker/app-area-picker';
    import appRadio from '../../../../components/basic-component/app-radio/app-radio.vue';

    const date = new Date()
    const years = []
    const months = []
    const bigDays = []
    const smallDays = []
    const secDays = []
    const otherDays = []

    for (let i = date.getFullYear(); i <= date.getFullYear() + 10; i++) {
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
        name: "config",
        components: {appAreaPicker, appRadio},
        data() {
            return {
                theme: {
                    background: '#ff4544'
                },
                lineHeight: '72rpx',
                mch_id: -1,
                category_list: [],
                indicatorStyle: '',
                area: {
                    province_id: 0,
                    city_id: 0,
                    district_id: 0,
                },
                date: [
                    {label: '周一', value: '1', check: false},
                    {label: '周二', value: '2', check: false},
                    {label: '周三', value: '3', check: false},
                    {label: '周四', value: '4', check: false},
                    {label: '周五', value: '5', check: false},
                    {label: '周六', value: '6', check: false},
                    {label: '周日', value: '0', check: false},
                ],
                form: {},
                form_data: {},

                timeDialog: false,
                choose: 2,
                hour: [],
                minutes: [],
                startVal: [0,0,0],
                endVal: [0,0,0],

                autoDialog: false,
                dateVal: [0,0,0],
                timeVal: [0,0,0],
                chooseAuto: 1,
                years: years,
                months: months,
                days: bigDays,
                bigDays: bigDays,
                smallDays: smallDays,
                secDays: secDays,
                otherDays: otherDays,
            }
        },
        onShow() {
            let that = this;
            uni.getStorage({
                key: 'openTime',
                success(res) {
                    that.form.time_list = res.data;
                }
            })
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad(options) { this.$commonLoad.onload(options);
            uni.removeStorage({
                key: 'openTime'
            })
            this.indicatorStyle =  'height: 36px;font-size:14px;';
            let screenWidth = uni.getSystemInfoSync().windowWidth;
            let p = 375 / screenWidth;
            this.lineHeight = 72*p + 'rpx';
            this.mch_id = options.mch_id;
            this.getCategory();
            for(let i = 0;i < 60;i++) {
                if(i < 10) {
                    i = '0' + i
                }
                if(i < 24) {
                    this.hour.push(i)
                }
                this.minutes.push(i)
            }
            var myDate = new Date();
            let year = myDate.getFullYear();
            let month = myDate.getMonth() + 1;
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            let day = myDate.getDate();
            for(let i in this.years) {
                if (year == this.years[i]) {
                    this.dateVal[0] = +i
                }
            }
            for(let i in this.months) {
                if (month == this.months[i]) {
                    this.dateVal[1] = +i
                }
            }
            if(month == 2) {
                if(year%4 == 0 && year %400 != 0) {
                    this.days = this.otherDays
                }else {
                    this.days = this.secDays
                }
            }else if((month < 8 && month%2 == 1) || (month > 7 && month%2 == 0)) {
                this.days = this.bigDays
            }else {
                this.days = this.smallDays
            }
            for(let i in this.days) {
                if (day == this.days[i]) {
                    this.dateVal[2] = +i
                }
            }
        },
        methods: {
            toSettingTime() {
                uni.navigateTo({
                    url: `/plugins/mch/mch/open-time/open-time?time_list=${JSON.stringify(this.form.time_list)}`
                })
            },
            chooseDate(e) {
                e.check = !e.check;
            },
            openTime() {
                for(let date of this.date) {
                    date.check = false;
                    for(let item of this.form.week_list) {
                        if(date.value == item) {
                            date.check = true;
                        }
                    }
                }
                this.timeDialog = true;
            },
            openAuto() {
                this.chooseAuto = this.form.is_auto_open;
                if(this.chooseAuto == 2 && this.form.auto_open_time.length > 0) {
                    for(let i in this.years) {
                        if (this.form.auto_open_time.substring(0, 4) == this.years[i]) {
                            this.dateVal[0] = +i
                        }
                    }
                    for(let i in this.months) {
                        if (this.form.auto_open_time.substring(5, 7) == this.months[i]) {
                            this.dateVal[1] = +i
                        }
                    }
                    let startMonth = +this.dateVal[1] + 1;
                    if(startMonth == 2) {
                        if(year%4 == 0 && year %400 != 0) {
                            this.days = this.otherDays
                        }else {
                            this.days = this.secDays
                        }
                    }else if((startMonth < 8 && startMonth%2 == 1) || (startMonth > 7 && startMonth%2 == 0)) {
                        this.days = this.bigDays
                    }else {
                        this.days = this.smallDays
                    }
                    for(let i in this.days) {
                        if (this.form.auto_open_time.substring(8, 10) == this.days[i]) {
                            this.dateVal[2] = +i
                        }
                    }
                    let auto_open_time = this.form.auto_open_time.substring(11);
                    this.timeVal = auto_open_time.split(':').map(Number);
                }
                this.autoDialog = true;
            },
            submitTime() {
                this.form.week_list = [];
                for(let item of this.date) {
                    if(item.check) {
                        this.form.week_list.push(item.value)
                    }
                }
                this.timeDialog = false;
            },
            submitAutoTime() {
                this.form.is_auto_open = this.chooseAuto;
                if(this.form.is_auto_open == 2) {
                    let month = this.months[this.dateVal[1]];
                    let day = this.days[this.dateVal[2]];
                    if(month < 10) {
                        month = '0' + month
                    }
                    if(day < 10) {
                        day = '0' + day
                    }
                    this.form.auto_open_time = this.years[this.dateVal[0]] + '-' + month + '-' + day
                    this.form.auto_open_time += ' ' + this.hour[this.timeVal[0]] + ':' + this.minutes[this.timeVal[1]] + ':' + this.minutes[this.timeVal[2]]
                }
                this.autoDialog = false;
            },
            cancel() {
                this.timeDialog = false;
                this.autoDialog = false;
            },
            change(e) {
                this.choose = e;
            },
            changeAuto(e) {
                this.chooseAuto = e;
            },
            startChange: function(e) {
                this.startVal = e.detail.value;
            },
            endChange: function(e) {
                this.endVal = e.detail.value;
            },
            dateChange: function(e) {
                const val = e.detail.value;
                this.dateVal = e.detail.value;
                let years = this.years;
                let year = this.years[val[0]];
                let month = this.months[val[1]];
                if(month == 2) {
                    if(year%4 == 0 && year %400 != 0) {
                        this.days = this.otherDays
                    }else {
                        this.days = this.secDays
                    }
                }else if((month < 8 && month%2 == 1) || (month > 7 && month%2 == 0)) {
                    this.days = this.bigDays
                }else {
                    this.days = this.smallDays
                }
            },
            timeChange: function(e) {
                this.timeVal = e.detail.value;
            },
            getCategory: function () {
                const self = this;
                self.$request({
                    url: self.$api.mch.category,
                    data: {
                        id: self.mch_id,
                    }
                }).then(info => {
                    if (info.code == 0) {
                        self.category_list = info.data.list;
                        self.loadData();
                    }
                });
            },

            loadData: function () {
                const self = this;
                self.$showLoading();

                self.$request({
                    url: self.$api.mch.detail,
                    data: {
                        id: self.mch_id,
                        review_status: 1,
                    }
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        const detail = info.data.detail;

                        let mch_common_cat_str = '';
                        let mch_common_cat_key = 0;
                        self.category_list.map((v, k) => {
                            if (v.id == detail.mch_common_cat_id) {
                                mch_common_cat_str = v.name;
                                mch_common_cat_key = k;
                            }
                        });

                        self.form = {
                            id: detail.id,
                            realname: detail.realname,
                            mobile: detail.mobile,
                            wechat: detail.wechat,
                            address: detail.store.address,
                            name: detail.store.name,
                            service_mobile: detail.store.mobile,
                            mch_common_cat_str,
                            mch_common_cat_key,
                            mch_common_cat_id: detail.mch_common_cat_id,
                            cover_url: detail.store.cover_url,
                            username: detail.mchUser.username,
                            pic_url: detail.store.pic_url.length > 0 ? detail.store.pic_url[0].pic_url : '',
                            form_data: detail.form_data,
                            is_open: detail.is_open,
                            open_type: detail.open_type,
                            is_auto_open: detail.is_auto_open,
                            auto_open_time: detail.auto_open_time,
                            time_list: detail.time_list,
                            week_list: detail.week_list
                        };
                        self.area = {
                            province_id: detail.store.province_id,
                            city_id: detail.store.city_id,
                            district_id: detail.store.district_id,
                        };
                    }
                });
            },

            navPassword() {
                uni.navigateTo({url: `/plugins/mch/mch/password/password?mch_id=` + this.mch_id});
            },

            //INPUT
            applyInput: function (e) {
                let name = e.currentTarget.dataset.type;
                this.form[name] = e.detail.value;
            },

            categoryChange(e) {
                const item = this.category_list[e.detail.value];

                this.form.mch_common_cat_id = item.id;
                this.form.mch_common_cat_str = item.name;
                this.form.mch_common_cat_key = e.detail.value;
            },

            //地址处理
            areaEvent(data) {
                if (data) {
                    this.area.province_id = data.province.id;
                    this.area.city_id = data.city.id;
                    this.area.district_id = data.district.id;
                }
            },

            // 上传头像
            uploadCoverUrl(e) {
                const self = this;
                uni.chooseImage({
                    count: 1,
                    success: function (e) {
                        uni.uploadFile({
                            url: self.$api.upload.file,
                            filePath: e.tempFilePaths[0],
                            name: 'file',
                            formData: {
                                file: e.tempFilePaths[0],
                            },
                            success(res) {
                                const result = JSON.parse(res.data);
                                if (result.code === 0) {
                                    self.form.cover_url = result.data.url;
                                    uni.showToast({title: '上传成功'});
                                } else {
                                    uni.showToast({icon: 'none', title: result.msg});
                                }
                            }
                        });
                    }
                })
            },

            // 上传背景
            uploadPicUrl(e) {
                const self = this;
                uni.chooseImage({
                    count: 1,
                    success: function (e) {
                        uni.uploadFile({
                            url: self.$api.upload.file,
                            filePath: e.tempFilePaths[0],
                            name: 'file',
                            formData: {
                                file: e.tempFilePaths[0],
                            },
                            success(res) {
                                const result = JSON.parse(res.data);
                                if (result.code === 0) {
                                    self.form.pic_url = result.data.url;
                                    self.form.pic_url_id = result.data.id;
                                    uni.showToast({title: '上传成功'});
                                } else {
                                    uni.showToast({icon: 'none', title: result.msg});
                                }
                            }
                        });
                    }
                })
            },

            //SUBMIT
            formSubmit: function (e) {
                let self = this;
                let form = self.form;
                let area = self.area;

                let content = function () {
                    if(form.open_type == 2 && form.week_list.length == 0) {
                        return '请选择营业时间'
                    }
                    if (!form.realname) {
                        return "联系人不能为空";
                    }
                    if (!form.mobile) {
                        return "联系电话不能为空";
                    }
                    if (!form.username) {
                        return "账号不能为空";
                    }
                    if (!form.mch_common_cat_id) {
                        return "类目不能为空";
                    }
                    if (!form.name) {
                        return "店铺名称不能为空";
                    }
                    return false;
                }();
                if (content) {
                    uni.showToast({icon: 'none', title: content});
                    return;
                }
                self.$showLoading({title: '保存中'});
                self.$request({
                    url: self.$api.mch.apply,
                    data: {
                        id: form.id,
                        mch_common_cat_id: form.mch_common_cat_id,
                        address: form.address,
                        username: form.username,
                        name: form.name,
                        service_mobile: form.service_mobile,
                        realname: form.realname,
                        mobile: form.mobile,
                        wechat: form.wechat,
                        form_data: JSON.stringify(form.form_data),
                        province_id: area.province_id,
                        city_id: area.city_id,
                        district_id: area.district_id,
                        logo: form.cover_url,
                        bg_pic_url: JSON.stringify({pic_url: form.pic_url, id: form.pic_url_id}),
                        is_open: form.is_open,
                        open_type: form.open_type,
                        is_auto_open: form.is_auto_open,
                        auto_open_time: form.auto_open_time,
                        time_list: JSON.stringify(form.time_list),
                        week_list: JSON.stringify(form.week_list)
                    },
                    method: 'POST',
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        uni.showModal({
                            title: '提示',
                            content: info.msg,
                            showCancel: false,
                            success: function (e) {
                                if (e.confirm) {
                                    uni.navigateBack({
                                        delta: 1
                                    });
                                }
                            }
                        })
                    } else {
                        uni.showToast({icon: 'none', title: info.msg});
                    }
                });
            },
        }
    }
</script>

<style lang="scss">
    .plugins-mch-config-input {
        color: #bbb;
        font-size: #{28rpx};
    }
</style>
<style scoped lang="scss">
    .apply-com {
        padding-top: #{30rpx};
        padding-left: #{24rpx};
        height: #{72rpx};
        color: #999;
        font-size: #{26rpx};
        background: #f7f7f7;
        width: 100%;
    }

    .white {
        background: #FFFFFF;

        .form-input {
            margin: 0 #{24rpx};
            border-bottom: 1px solid #e2e2e2;
            height: #{100rpx};
            .form-radio-input {
                width: #{350rpx};
            }
            .switch-open-text {
              width: 314rpx;
              text-align: right;
            }
            .radio-text {
                margin-left: #{18rpx};
                font-size: #{28rpx};
                .icon-arrow-right {
                    margin-left: 18rpx;
                }
            }
            .app-switch-view {
                background-color: #14d675 !important;
            }
            .switch-view {
                width: #{88rpx};
                height: #{48rpx};
                border-radius: #{24rpx};
                background-color: #dddddd;
                .click {
                    border-radius: 50%;
                    background-color: white;
                    width: #{38rpx};
                    height: #{38rpx};
                    margin: #{5rpx} #{6rpx};
                }
                .app-switch {
                    transform: translateX(#{40rpx});
                }
            }
        }

        input {
            height: 100%;
            width: 100%;
            padding-left: #{32rpx};
            padding-right: #{24rpx};
            color: #666666;
            font-size: #{28rpx};
        }

        .form-label {
            padding-left: #{3rpx};
            font-size: #{28rpx};
            color: #353535;
            min-width: #{125rpx};
        }

        > view:last-child {
            border-bottom: none;
        }

        //
        .password {
            font-size: #{28rpx};
            color: #666666;
            text-align: right;
            padding-right: #{24rpx};
        }

        .icon-arrow-right {
            background-image: url("../../../../static/image/icon/arrow-right.png");
            height: #{22rpx};
            width: #{12rpx};
            background-size: 100% auto;
            background-repeat: no-repeat;
        }

        .area-left {
            padding-left: #{32rpx};
            text-align: right;
            margin-left: auto;
        }

        .category-picker {
            height: 100%;
            width: 100%;
        }

        .category-info {
            height: 100%;
            width: 100%;
            min-height: #{98rpx};
        }

        .category-select {
            font-size: #{28rpx};
            color: #666666;
            text-align: right;
            padding-right: #{24rpx};
        }

        .end {
            height: #{128rpx};

            .bigness {
                font-size: #{24rpx};
                color: #888;
                line-height: 1;
            }
        }

        .up-pic {
            height: 100%;
            padding-left: #{32rpx};

            .shop-pic {
                padding: #{18rpx} #{24rpx};
                text-align: right;
                width: 100%;
                font-size: 0;

                .pic-head {
                    height: #{80rpx};
                    width: #{80rpx};
                }

                .pic-bg {
                    height: #{80rpx};
                    width: #{298rpx};
                }
            }
        }
    }

    .submit-btn {
        margin-top: #{56rpx};
        margin-bottom: #{24rpx};
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