<template>
    <app-layout>
        <view class="head">
            <image class="head-bg" :src="adminImg.bg"></image>
            <image class="mall-img" v-if="userInfo && userInfo.options" :src="userInfo.options.avatar"></image>
            <view class="mall-name t-omit">{{mall.name}}</view>
            <view v-if="is_scan_code_pay" @click="toPayment">
                <view class="mall-scan-code dir-top-nowrap main-center cross-center">
                    <image src="./../image/scan-code.png"></image>
                    <view>收款码</view>
                </view>
            </view>
            <!-- 菜单 -->
            <view class="main-between menu" v-if="new_msg_num">
                <view class="box-grow-1 menu-item" @click="toMessage">
                    <image class="item-icon" :src="adminImg.order"></image>
                    <view>订单消息</view>
                    <view class="red-num cross-center" v-if="new_msg_num.order_num && new_msg_num.order_num > 0">{{new_msg_num.order_num > 99 ? '99+':new_msg_num.order_num}}</view>
                </view>
                <view v-if="info.share == 1 || info.mch == 1 || info.bonus == 1 || info.stock == 1" class="box-grow-1 menu-item" @click="toReview">
                    <image class="item-icon" :src="adminImg.msg"></image>
                    <view>审核消息</view>
                    <view class="red-num cross-center" v-if="new_msg_num.review_num && new_msg_num.review_num > 0">{{new_msg_num.review_num > 99 ? '99+' : new_msg_num.review_num}}</view>
                </view>
                <view v-if="info.share == 1 || info.mch == 1 || info.bonus == 1 || info.stock == 1" class="box-grow-1 menu-item" @click="toCash">
                    <image class="item-icon" :src="adminImg.cash"></image>
                    <view>提现申请</view>
                    <view class="red-num cross-center" v-if="new_msg_num.cash_num && new_msg_num.cash_num > 0">{{new_msg_num.cash_num > 99 ? '99+':new_msg_num.cash_num}}</view>
                </view>
                <view class="box-grow-1 menu-item" @click="toComment">
                    <image class="item-icon" :src="adminImg.comment"></image>
                    <view>评论管理</view>
                </view>
                <view class="box-grow-1 menu-item" @click="toUser">
                    <image class="item-icon" :src="adminImg.user"></image>
                    <view>用户管理</view>
                </view>
            </view>
        </view>
        <!-- 经营状况 -->
        <view class="manage-handle statics">
            <view class='main-between' style="margin: 0 24rpx">
                <view class="title">经营状况</view>
                <view v-if="false" @click="toggle(true,1)" class="order">
                    <view class='cross-center'>
                        <text>{{plugins_active.name}}</text>
                        <image class="more" src="/static/image/icon/icon-down.png"></image>
                    </view>
                </view>
            </view>
            <view class="choose main-between" style="margin-left: 24rpx;margin-right:24rpx">
                <!-- <view @click="tab(1)" :class="['box-grow-1 choose-item',`${_num==0?'active':''}`,'choose-item']">汇总</view>-->
                <view @click="tab(1)"
                      :class="['box-grow-1 choose-item',`${num==1?'active':''}`,'choose-item','left-choose-item']">今日
                </view>
                <view @click="tab(2)" :class="['box-grow-1 choose-item',`${num==2?'active':''}`,'choose-item']">昨日
                </view>
                <view @click="tab(3)" :class="['box-grow-1 choose-item',`${num==3?'active':''}`,'choose-item']">7日
                </view>
                <view @click="tab(4)"
                      :class="['box-grow-1 choose-item',`${num==4?'active':''}`,'choose-item','right-choose-item']">30日
                </view>
            </view>
            <view class="dir-left-wrap" style="padding-bottom: 12rpx">
                <view class="manage-box">
                    <u-count-to :font-size="40" color="#446DFD" :duration="500"  :end-val="all_data.order_num"></u-count-to>
<!--                    <view class="value">{{all_data.order_num}}</view>-->
                    <view class="label">支付订单数</view>
                </view>
                <view class="manage-box">
                    <u-count-to :font-size="40" color="#446DFD" :duration="500" :decimals="2" :end-val="all_data.total_pay_price"></u-count-to>
<!--                    <view class="value">{{all_data.total_pay_price}}</view>-->
                    <view class="label">支付金额(元)</view>
                </view>
                <view class="manage-box">
                    <u-count-to :font-size="40" color="#446DFD" :duration="500"  :end-val="all_data.user_num"></u-count-to>
<!--                    <view class="value">{{all_data.user_num}}</view>-->
                    <view class="label">访客数</view>
                </view>
                <view class="manage-box">
                    <u-count-to v-if="all_data.data_num < 10000" :duration="500" :font-size="40" color="#446DFD" separator=","  :end-val="all_data.data_num"></u-count-to>
                    <view v-else class="value" v-text="formatNumText"></view>
                    <view class="label">访问量</view>
                </view>
            </view>
        </view>

        <!-- 快速处理 -->
        <view class="quick-handle statics">
            <view class='main-between'>
                <view class="title">快速处理</view>
            </view>
            <view class="dir-left-nowrap">
                <!-- 待付款 @click="toRedirect('/pages/app_admin/order/order?status=0')" -->
                <view class="box-grow-1 quick-box" @click="toRedirect('/pages/app_admin/order/order?status=1')">
                    <view class="num">{{all_data.wait_send_num}}</view>
                    <view class="label">待发货订单</view>
                    <view class="dir-left-nowrap cross-center">
                        <span class="nav-title">立即发货</span>
                        <icon class="icon-goto" type></icon>
                    </view>
                    <img style="height: 80rpx;width: 100rpx" src="../image/icon_sent.png" alt="">
                </view>
                <view class="box-grow-1 quick-box" style="margin-left: 20rpx"
                      @click="toRedirect('/pages/app_admin/order/order?refund=1')">
                    <view class="num">{{all_data.pro_order}}</view>
                    <view class="label">维权订单</view>
                    <view class="dir-left-nowrap cross-center">
                        <span class="nav-title">立即处理</span>
                        <icon class="icon-goto" type></icon>
                    </view>
                    <img style="height: 88rpx;width: 96rpx" src="../image/icon_hand.png" alt="">
                </view>
            </view>
        </view>
        <!-- 图表 -->
        <view class="statics canvas-sataics">
            <view class="main-between">
                <view @click="toggle(true,3)" class="order">
                    <view class='cross-center'>
                        <text>{{pay_active.name}}</text>
                        <image class="more" src="/static/image/icon/icon-down.png"></image>
                    </view>
                </view>
                <view @click="toggle(true,2)" class="order">
                    <view class='cross-center'>
                        <text>{{canvas_plugins.name}}</text>
                        <image class="more" src="/static/image/icon/icon-down.png"></image>
                    </view>
                </view>
            </view>
            <view class="choose main-between">
                <view @click="tablist(0)" :class="['box-grow-1',`${date==0?'active':''}`,'choose-item','left-choose-item']">今日</view>
                <view @click="tablist(1)" :class="['box-grow-1',`${date==1?'active':''}`,'choose-item']">昨日</view>
                <view @click="tablist(2)" :class="['box-grow-1',`${date==2?'active':''}`,'choose-item']">7日</view>
                <view @click="tablist(3)" :class="['box-grow-1',`${date==3?'active':''}`,'choose-item','right-choose-item']">30日</view>
            </view>
            <view class="box">
                <!--#ifdef MP-ALIPAY -->
                <canvas v-show="!dialog" @touchstart="touchIt($event,'canvasColumn')" canvas-id="canvasColumn" id="canvasColumn" class="charts" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth*(pixelRatio-1)/2+'px','margin-top':-cHeight*(pixelRatio-1)/2+'px'}"></canvas>
                <!--#endif-->
                <!--#ifndef MP-ALIPAY -->
                <canvas v-show="!dialog" @touchstart="touchIt($event)" canvas-id="canvasColumn" id="canvasColumn" class="charts"></canvas>
                <!--#endif-->
            </view>
        </view>
        <view class="safe-area-inset-bottom">
            <view class="u-bottom-height"></view>
        </view>
        <cover-view class="safe-area-inset-bottom u-bottom-fixed">
            <cover-view class="main-between bottom-tab">
                <cover-view class="box-grow-1 tab-item active" @click="getInfo(today)">
                    <!-- #ifdef MP-TOUTIAO -->
                    <image class="tab-icon" src="./../image/index-active.png"></image>
                    <view>首页</view>
                    <!-- #endif -->
                    <!-- #ifndef MP-TOUTIAO -->
                    <cover-image class="tab-icon" src="./../image/index-active.png"></cover-image>
                    <cover-view  style="font-size: 20upx">首页</cover-view>
                    <!-- #endif -->
                </cover-view>
                <cover-view class="box-grow-1 tab-item" @click="toRedirect('/pages/app_admin/order/order')">
                    <!-- #ifdef MP-TOUTIAO -->
                    <image class="tab-icon" src="./../image/order.png"></image>
                    <view>订单</view>
                    <!-- #endif -->
                    <!-- #ifndef MP-TOUTIAO -->
                    <cover-image class="tab-icon" src="./../image/order.png"></cover-image>
                    <cover-view  style="font-size: 20upx">订单</cover-view>
                    <!-- #endif -->
                </cover-view>
                <cover-view class="box-grow-1 tab-item" @click="toRedirect('/pages/app_admin/goods/goods')">
                    <!-- #ifdef MP-TOUTIAO -->
                    <image class="tab-icon" src="./../image/goods.png"></image>
                    <view>商品</view>
                    <!-- #endif -->
                    <!-- #ifndef MP-TOUTIAO -->
                    <cover-image class="tab-icon" src="./../image/goods.png"></cover-image>
                    <cover-view style="font-size: 20upx">商品</cover-view>
                    <!-- #endif -->
                </cover-view>
                <cover-view class="box-grow-1 tab-item" @click="toRedirect('/pages/app_admin/setting/setting')">
                    <!-- #ifdef MP-TOUTIAO -->
                    <image class="tab-icon" src="./../image/setting.png"></image>
                    <view>设置</view>
                    <!-- #endif -->
                    <!-- #ifndef MP-TOUTIAO -->
                    <cover-image class="tab-icon" src="./../image/setting.png"></cover-image>
                    <cover-view  style="font-size: 20upx">设置</cover-view>
                    <!-- #endif -->
                </cover-view>
            </cover-view>
        </cover-view>
        <!-- 选择列表 -->
        <view class="dialog" v-if="dialog">
            <view class="picker-list">
                <view class="main-between picker-header">
                    <view @click="toggle(false,2)">取消</view>
                    <view @click="toggle(false,1)">确定</view>
                </view>
                <picker-view indicator-style="height: 34px;" :value="chooseIndex" @change="bindChange">
                    <picker-view-column>
                        <view
                                :style="{'color': newIndex == idx ? '#446dfd' : newIndex == idx + 1 || newIndex == idx - 1 ? '#999999' : newIndex == idx + 2 || newIndex == idx - 2 ? '#cdcdcd' : ''}"
                                v-for="(item,idx) in choose_list" :key="item.name"
                                class="picker-view">
                            {{item.name}}
                        </view>
                    </picker-view-column>
                </picker-view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import uCharts from '../../../components/u-charts/u-charts.min.js';
    import uCountTo from '../../../components/basic-component/u-count-to/u-count-to.vue';

    import {mapState} from "vuex";

    var _self;
    var canvaColumn=null;

    export default {
        components: {
            uCountTo
        },
        data() {
            return {
                info: {
                    comment: 0,
                    mch: 0,
                    share: 0,
                },
                plugins_list: [],
                status: [{
                    name: '支付金额',
                    sign: 'total_pay_price'
                }, {
                    name: '支付订单数',
                    sign: 'order_num'
                }, {
                    name: '支付人数',
                    sign: 'user_num'
                }, {
                    name: '支付件数',
                    sign: 'goods_num'
                }],
                plugins_active: {
                    name: '全部',
                    sign: 'all'
                },
                canvas_plugins: {
                    name: '全部',
                    sign: 'all'
                },
                pay_active: {
                    name: '支付金额',
                    sign: 'total_pay_price'
                },
                num: '1',
                date: '0',
                choose_list: [],
                new_msg_num: null,
                all_data: {
                    order_num: 0,
                    total_pay_price: 0,
                    user_num: 0,
                    data_num: 0,
                    wait_send_num: '--',
                    pro_order: '--',
                },
                chooseIndex: [0],
                newIndex: 0,
                dialog: false,
                today: '',
                yesterday: '',
                weekday: '',
                monthday: '',
                area: null,
                id: null,
                is_scan_code_pay: 0,
                cWidth:'',
                cHeight:'',
                pixelRatio:1,
                first: true,
            }
        },
        computed: {
            ...mapState({
                mall: state => state.mallConfig.mall,
                adminImg: state => state.mallConfig.__wxapp_img.app_admin,
                userInfo: state => state.user.info
            }),
            formatNumText() {
                if(this.all_data.data_num === '--'){
                    return this.all_data.data_num;
                }
                if (this.all_data.data_num) {
                    let numberFormat = function (value) {
                        let param = {};
                        let k = 10000,
                            sizes = ['', '万', '亿', '万亿'],
                            i;
                        if (value < k) {
                            param.value = value
                            param.unit = ''
                        } else {
                            i = Math.floor(Math.log(value) / Math.log(k));
                            param.value = Math.floor(((value / Math.pow(k, i))) * 100) / 100;
                            param.unit = sizes[i];
                        }
                        return param;
                    }
                    let num = this.all_data.data_num;
                    let format = numberFormat(num);
                    return format.value + format.unit;
                }
            },
        },
        methods: {
            bindChange(e) {
                this.newIndex = +e.detail.value[0];
            },
            // 切换
            toggle(Bool,num) {
                let status;
                if(Bool) {
                    this.area = num;
                }else {
                    status = num;
                }
                let day;
                let otherDay;
                switch (this.num) {
                    case '0':
                        day = '';
                        break;
                    case '1':
                        day = this.today;
                        break;
                    case '2':
                        day = this.yesterday;
                        break;
                    case '3':
                        day = this.weekday;
                        break;
                    case '4':
                        day = this.monthday;
                        break;
                }
                switch (this.date) {
                    case '0':
                        otherDay = this.today;
                        break;
                    case '1':
                        otherDay = this.yesterday;
                        break;
                    case '2':
                        otherDay = this.weekday;
                        break;
                    case '3':
                        otherDay = this.monthday;
                        break;
                }
                if (this.area === 3 && Bool) {
                    for(let index in this.status) {
                        if(this.pay_active.sign == this.status[index].sign) {
                            this.chooseIndex[0] = +index
                            this.newIndex = +index;
                        }
                    }
                    this.choose_list = this.status;
                    this.dialog = !this.dialog;
                } else if (this.area < 3 && Bool) {
                    if (this.area === 1) {
                        for(let index in this.plugins_list) {
                            if(this.plugins_active.sign == this.plugins_list[index].sign) {
                                this.chooseIndex[0] = +index
                                this.newIndex = +index;
                            }
                        }
                    } else if (this.area === 2) {
                        for(let index in this.plugins_list) {
                            if(this.canvas_plugins.sign == this.plugins_list[index].sign) {
                                this.chooseIndex[0] = +index
                                this.newIndex = +index;
                            }
                        }
                    }
                    this.choose_list = this.plugins_list;
                    this.dialog = !this.dialog;
                }
                if(!Bool) {
                    setTimeout(() => {
                        if (status == 1) {
                            switch (this.area) {
                                case 3:
                                    this.pay_active = this.status[this.newIndex];
                                    this.dialog = false;
                                    this.getCanvas(otherDay);
                                    break;
                                case 1:
                                    this.plugins_active = this.plugins_list[this.newIndex];
                                    this.getInfo(day);
                                    break;
                                case 2:
                                    this.canvas_plugins = this.plugins_list[this.newIndex];
                                    this.dialog = false;
                                    this.getCanvas(otherDay);
                                    break;
                                default:
                                    this.dialog = false;
                                    break;
                            }
                        } else if (status > 0 && status != 1) {
                            this.newIndex = 0;
                            this.dialog = false;
                        }
                    }, 500);
                }
            },
            tablist(e) {
                this.date = e.toString();
                switch (this.date) {
                    case '0':
                        this.getCanvas(this.today);
                        break;
                    case '1':
                        this.getCanvas(this.yesterday);
                        break;
                    case '2':
                        this.getCanvas(this.weekday);
                        break;
                    case '3':
                        this.getCanvas(this.monthday);
                        break;
                }
                this.$forceUpdate();
            },
            tab(e) {
                this.num = e.toString();
                switch (this.num) {
                    case '0':
                        this.getInfo();
                        break;
                    case '1':
                        this.getInfo(this.today);
                        break;
                    case '2':
                        this.getInfo(this.yesterday);
                        break;
                    case '3':
                        this.getInfo(this.weekday);
                        break;
                    case '4':
                        this.getInfo(this.monthday);
                        break;
                }
                this.$forceUpdate();
            },
            toRedirect(url) {
                uni.redirectTo({
                    url: url
                })
            },
            toPayment() {
                uni.navigateTo({
                    url: '/pages/app_admin/payment-code/payment-code'
                });
            },
            toMessage() {
                uni.navigateTo({
                    url: '/pages/app_admin/order-message/order-message'
                });
            },
            toReview() {
                uni.navigateTo({
                    url: '/pages/app_admin/review-message/review-message'
                });
            },
            toCash() {
                uni.navigateTo({
                    url: '/pages/app_admin/cash/cash'
                });
            },
            toComment() {
                uni.navigateTo({
                    url: '/pages/app_admin/comment/comment'
                });
            },
            toUser() {
                uni.navigateTo({
                    url: '/pages/app_admin/user/user?share='+this.info.share
                });
            },
            // 获取日期
            getDate() {
                var myDate = new Date();
                // 今天
                let year = myDate.getFullYear();
                let month = myDate.getMonth() + 1;
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                let now = myDate.getDate();
                this.today = year + "-" + month + "-" + now;
                var timestamp = Date.parse(new Date());
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
                let weekTime = (timestamp / 1000 - 24 * 60 * 60 * 6) * 1000;
                let weekDate = new Date(weekTime)
                let week_year = weekDate.getFullYear();
                let week_month = weekDate.getMonth() + 1;
                if (week_month >= 1 && week_month <= 9) {
                    week_month = "0" + week_month;
                }
                let week_now = weekDate.getDate();
                this.weekday = week_year + "-" + week_month + "-" + week_now;
                // 30天
                let monthTime = (timestamp / 1000 - 24 * 60 * 60 * 29) * 1000;
                let monthDate = new Date(monthTime)
                let month_year = monthDate.getFullYear();
                let month_month = monthDate.getMonth() + 1;
                if (month_month >= 1 && month_month <= 9) {
                    month_month = "0" + month_month;
                }
                let month_now = monthDate.getDate();
                this.monthday = month_year + "-" + month_month + "-" + month_now;
            },
            getInfo(day) {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                let date_end;
                if(day == that.yesterday){
                    date_end = that.yesterday;
                } else {
                    date_end = that.today;
                }
                that.$request({
                    url: that.$api.app_admin.index,
                    data: {
                        date_start: day ? day : '',
                        date_end: date_end,
                        sign: that.plugins_active.sign
                    },
                    method: 'post'
                }).then(response=>{
                    uni.hideLoading();
                    that.$hideLoading();
                    if(response.code == 0) {
                        let plugins = [];
                        that.info = response.data.admin_info;
                        that.plugins_list = plugins.concat(response.data.plugins_list);
                        that.new_msg_num = response.data.new_msg_num;
                        that.all_data = response.data.all_data;
                        that.is_scan_code_pay = response.data.is_scan_code_pay;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(e => {
                    uni.hideLoading();
                    that.$hideLoading();
                });
            },

            getCanvas(day, status) {
                let that = this;
                let date_end = that.today;
                if (day == that.yesterday) {
                    date_end = that.yesterday
                }
                that.$request({
                    url: that.$api.app_admin.table,
                    data: {
                        date_start: day,
                        date_end: date_end,
                        type: 1,
                        sign: that.canvas_plugins.sign
                    },
                    method: 'post'
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        let list = response.data.list;
                        let Column = {categories:[],series:[{name: '',data: []}]};
                        if (that.pay_active.sign == 'total_pay_price') {
                            Column.series[0].name = '支付金额';
                            list.forEach(function(row, index) {
                                let time = list[index].created_at;
                                if(that.date < 2) {
                                    time = list[index].created_at + '时'
                                }
                                let data = {
                                    value: list[index].total_pay_price,
                                    index: list[index].created_at
                                }
                                Column.series[0].data.push(data)
                                Column.categories.push(time)
                            })
                        } else if (that.pay_active.sign == 'order_num') {
                            Column.series[0].name = '支付订单数';
                            list.forEach(function(row, index) {
                                let time = list[index].created_at;
                                if(that.date < 2) {
                                    time = list[index].created_at + '时'
                                }
                                let data = {
                                    value: list[index].order_num,
                                    index: list[index].created_at
                                }
                                Column.series[0].data.push(data)
                                Column.categories.push(time)
                            })
                        } else if (that.pay_active.sign == 'goods_num') {
                            Column.series[0].name = '支付件数';
                            list.forEach(function(row, index) {
                                let time = list[index].created_at;
                                if(that.date < 2) {
                                    time = list[index].created_at + '时'
                                }
                                let data = {
                                    value: list[index].goods_num,
                                    index: list[index].created_at
                                }
                                Column.series[0].data.push(data)
                                Column.categories.push(time)
                            })
                        } else if (that.pay_active.sign == 'user_num') {
                            Column.series[0].name = '支付人数';
                            list.forEach(function(row, index) {
                                let time = list[index].created_at;
                                if(that.date < 2) {
                                    time = list[index].created_at + '时'
                                }
                                let data = {
                                    value: list[index].user_num,
                                    index: list[index].created_at
                                }
                                Column.series[0].data.push(data)
                                Column.categories.push(time)
                            })
                        }
                        let padding = [15,15,4,0]
                        switch (that.date) {
                            case '0':
                                Column.categories.forEach(function(row, index) {
                                    if (index % 4 == 0) {
                                        Column.categories[index] = Column.categories[index]
                                    } else {
                                        Column.categories[index] = ''
                                    }
                                })
                                Column.categories.push('24')
                                padding = [15,15,4,-25]
                                break;
                            case '1':
                                Column.categories.forEach(function(row, index) {
                                    if (index % 4 != 0) {
                                        Column.categories[index] = ''
                                    }
                                })
                                Column.categories.push('24')
                                padding = [15,15,4,-25]
                                break;
                            case '2':
                                Column.categories.forEach(function(row, index) {
                                    Column.categories[index] = Column.categories[index].substring(5)
                                })
                                break;
                            case '3':
                                Column.categories.forEach(function(row, index) {
                                    Column.categories[index] = Column.categories[index].substring(5)
                                    if (index % 4 != 0) {
                                        Column.categories[index] = ''
                                    }
                                })
                                break;
                        }
                        that.showColumn(Column,padding);
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                })
            },
            touchIt(e) {
                let that = this;
                canvaColumn.showToolTip(e, {
                    format: function (item,category) {
                        item.color = 'rgba(0,0,0,0)';
                        if(that.date == 0) {
                            category = that.today + ' ' + item.data.index + '时 '
                        }else if(that.date == 1) {
                            category = that.yesterday + ' ' + item.data.index + '时 '
                        }else if(that.date == 2 || that.date == 3) {
                            category = item.data.index
                        }
                        if(item.name == '支付金额') {
                            return category + ' ' + item.name + '￥' + item.data.value + '  '
                        }else {
                            return category + ' ' + item.name + ' ' + item.data.value + '  '
                        }
                    }
                });
            },
            showColumn(chartData,padding){
                let _self = this;
                canvaColumn=new uCharts({
                    $this:_self,
                    canvasId: 'canvasColumn',
                    type: 'area',
                    legend:{
                        show: false
                    },
                    fontSize:9,
                    background:'#FFFFFF',
                    colors: ["#446DFD"],
                    padding: padding,
                    pixelRatio:this.pixelRatio,
                    categories: chartData.categories,
                    series: chartData.series,
                    xAxis: {
                        disableGrid:true,
                    },
                    yAxis: {
                        gridType: 'dash',
                        data: {
                            disabled: true
                        }
                    },
                    dataLabel: false,
                    dataPointShape: false,
                    width: this.cWidth*this.pixelRatio,
                    height: this.cHeight*this.pixelRatio,
                    extra: {
                        area: {
                            type: 'curve',
                            addLine: true
                        },
                        tooltip:{
                            bgColor:'#000000',
                            bgOpacity:0.7,
                        }
                    }
                });
            },
        },

        onLoad() { this.$commonLoad.onload();
            let that = this;
            that.$store.dispatch('user/refreshInfo');
            that.getDate();
            that.date = '0';
            //#ifdef MP-ALIPAY
            uni.getSystemInfo({
                success: function (res) {
                    if(res.pixelRatio>1){
                        //正常这里给2就行，如果pixelRatio=3性能会降低一点
                        //_self.pixelRatio =res.pixelRatio;
                        that.pixelRatio =2;
                    }
                }
            });
            //#endif
            that.cWidth=uni.upx2px(640);
            that.cHeight=uni.upx2px(220);
        },
        onReady() {
            let that = this;
            var getAdmin = setInterval(() => {
                if(that.userInfo) {
                    that.$showLoading({
                        type: 'global',
                        text: '加载中...'
                    });
                    clearInterval(getAdmin);
                    if(that.userInfo && that.userInfo.identity && that.userInfo.identity.is_admin == 0){
                        that.$hideLoading();
                        uni.showModal({
                            title: '提示',
                            content: '该帐号无管理员权限',
                            showCancel: false,
                            success: function (res) {
                                uni.redirectTo({
                                    url: '/pages/index/index'
                                })
                            }
                        });
                    }else {
                        that.$request({
                            url: that.$api.app_admin.index,
                            data: {
                                date_start: that.today,
                                date_end: that.today,
                                sign: 'all'
                            },
                            method: 'post'
                        }).then(response=>{
                            if(response.code == 0) {
                                let plugins = [];
                                that.info = response.data.admin_info;
                                that.plugins_list = plugins.concat(response.data.plugins_list);
                                that.new_msg_num = response.data.new_msg_num;
                                that.all_data = response.data.all_data;
                                that.is_scan_code_pay = response.data.is_scan_code_pay;
                                that.getCanvas(that.today);
                            }else {
                                uni.showToast({
                                    title: response.msg,
                                    icon: 'none',
                                    duration: 1000
                                });
                            }
                        }).catch(e => {
                            that.$hideLoading();
                            uni.showModal({
                                title: '提示',
                                content: '该帐号无管理员权限',
                                showCancel: false,
                                success: function (res) {
                                    uni.redirectTo({
                                        url: '/pages/index/index'
                                    })
                                }
                            });
                        });
                    }
                }
            },500)
        }
    }
</script>

<style scoped lang="scss">
    .icon-goto {
        background-image: url("../image/goto.png");
        height: #{22rpx};
        width: #{22rpx};
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .manage-handle {
        padding-bottom: 0 !important;
        margin: 0 #{24rpx} #{24rpx} !important;

        .manage-box {
            width: 50%;
            padding: #{32rpx} #{60rpx};

            .value {
                color: #446DFD;
                font-size: #{40rpx};
            }

            .label {
                margin-top: #{16rpx};
                line-height: 1;
                font-size: #{24rpx};
                color: #999999;
            }
        }
    }

    .quick-handle {
        .quick-box {
            position: relative;
            margin-top: #{32rpx};
            width: #{309rpx};
            height: #{176rpx};
            background: rgba(255, 255, 255, 1);
            box-shadow: 0 0 #{16rpx} 0 rgba(0, 0, 0, 0.1);
            border-radius: #{16rpx};
            padding-top: #{24rpx};
            padding-left: #{24rpx};

            .num {
                color: #353535;
                font-size: #{40rpx};
                line-height: 1;
            }

            .label {
                font-size: #{24rpx};
                color: #999999;
                padding-top: #{16rpx};
                line-height: 1;
                padding-bottom: #{24rpx};
            }

            .nav-title {
                font-size: #{20rpx};
                color: #999999;
                margin-right: #{8rpx};
            }

            img {
                position: absolute;
                bottom: 0;
                right: 0;
                display: block;
            }
        }
    }

    .head {
        height: #{300rpx};
        width: 100%;
        position: relative;
        margin-bottom: #{50rpx};
    }

    .head-bg {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }
    .mall-scan-code {
        position: absolute;
        top: #{32rpx};
        right: #{56rpx};
        z-index: 2;
    }

    .mall-scan-code image {
        height: #{44rpx};
        width: #{44rpx};
    }
    .mall-scan-code view {
        padding-top: #{8rpx};
        font-size: #{20rpx};
        color:#FFFFFF;
    }
    .mall-img {
        height: #{72rpx};
        width: #{72rpx};
        border-radius: #{36rpx};
        border: #{2rpx} solid #fff;
        position: absolute;
        top: #{24rpx};
        left: #{24rpx};
        z-index: 2;
    }

    .mall-name {
        color: #fff;
        position: absolute;
        top: 0;
        height: #{132rpx};
        line-height: #{132rpx};
        left: #{116rpx};
        font-size: #{40rpx};
        z-index: 2;
        width: #{466rpx};
    }

    .menu {
        background-color: #fff;
        border-radius: #{10rpx};
        height: #{194rpx};
        bottom: #{-26rpx};
        left: #{24rpx};
        right: #{24rpx};
        position: absolute;
        z-index: 3;
    }

    .item-icon {
        height: #{86rpx};
        width: #{86rpx};
        margin-bottom: #{10rpx};
    }

    .menu-item {
        padding-top: #{35rpx};
        text-align: center;
        color: #666666;
        font-size: #{24rpx};
        position: relative;
    }

    .red-num {
        position: absolute;
        top: #{16rpx};
        left: 50%;
        margin-left: #{12rpx};
        height: #{34rpx};
        border-radius: #{17rpx};
        background-color: #FF4544;
        color: #fff;
        padding: 0 #{10rpx};
        border: #{1rpx} solid #fff;
    }

    .statics {
        background-color: #fff;
        margin: 0 #{24rpx} #{24rpx};
        padding: #{32rpx};
        border-radius: #{10rpx};
    }

    .sataics.canvas-sataics {
        height: #{484rpx};
    }

    .choose {
        margin-top: #{32rpx};
        height: #{56rpx};
        line-height: #{54rpx};
        border-radius: #{28rpx};
        border: #{1rpx} solid #446DFD;
        margin-bottom: #{12rpx};
    }

    .choose-item {
        text-align: center;
        font-size: #{24rpx};
        color: #666666;
    }

    .choose-item.active {
        background-color: #446DFD;
        color: #fff;
    }

    .left-choose-item {
        border-top-left-radius: #{27rpx};
        border-bottom-left-radius: #{27rpx};
    }

    .right-choose-item {
        border-top-right-radius: #{27rpx};
        border-bottom-right-radius: #{27rpx};
    }

    .title {
        display: inline-block;
        width: auto;
        color: #353535;
        font-size: #{28rpx};
        margin-top: #{-2rpx};
    }

    .order {
        font-size: #{24rpx};
        color: #999999;
    }

    .pay-info {
        margin: #{46rpx} 0;
        width: 100%;
    }

    .pay-order,.pay-price {
        margin-left: #{64rpx};
        color: #999999;
        font-size: #{24rpx};
    }

    .pay-order {
        border-right: #{1rpx} solid #E2E2E2;
        margin-left: #{40rpx};
    }

    .pay-txt {
        font-family: DIN;
        font-size: #{40rpx};
        color: #353535;
    }

    .order-item {
        box-shadow: 0 0 #{16rpx} rgba(0, 0, 0, .1);
        border-radius: #{8rpx};
        padding: #{20rpx} 0 #{20rpx} #{20rpx};
        width: #{182rpx};
        font-size: #{24rpx};
        color: #999999;
    }

    .goto {
        height: #{22rpx};
        width: #{22rpx};
        margin-left: #{8rpx};
    }

    .order-num {
        color: #FF9000;
        font-size: #{36rpx};
        font-family: DIN;
    }

    .box {
        width:100%;
        padding-top: #{80rpx};
        height:#{300rpx};
    }

    .bottom-tab {
        width: 100%;
        height: #{96rpx};
        background-color: #fff;
        font-size: #{20rpx};
        color: #9096ad;
        padding-top: #{14rpx};
    }

    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 999;
        width: 100%;
        background-color: #ffffff;
    }

    .tab-item {
        text-align: center;
    }

    .tab-icon {
        height: #{48rpx};
        width: #{48rpx};
        display: inline-block;
    }

    .tab-item.active {
        color: #446dfd;
    }

    .tab-item view {
        margin-top: #{-5rpx};
    }

    .more {
        width: #{22rpx};
        height: #{12rpx};
        margin-left: #{12rpx};
    }

    .dialog {
        position: fixed;
        height: 100%;
        width: 100%;
        bottom: #{96rpx};
        left: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, .3);
    }

    .picker-list {
        background-color: #fff;
        padding-top: #{20rpx};
        position: fixed;
        bottom: #{96rpx};
        left: 0;
        width: 100%;
    }

    .picker-header {
        padding: 0 #{24rpx};
        color: #446dfd;
        font-size: #{32rpx};
    }

    canvas {
        width: 100%;
        height: 100%;
    }

    .u-bottom-height {
        height: 116upx;
    }

    .picker-view {
        line-height: 34px;
        text-align:center;
        font-size: #{32rpx};
    }
    picker-view {
        width: 100%;
        height: #{440rpx};
    }
</style>