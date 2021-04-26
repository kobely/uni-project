<template>
	<app-layout>
		<view class="setting">
			<image class="set-image" src="../image/set-bg.png"></image>
			<view class="head">
				<image class="logo" :src="detail.setting.mall_logo_pic" @click="setLogo"></image>
				<view class="name">
					<view @click="model = true;modelType = 0;name = detail.name">
						<view class="name-text dir-left-wrap main-center cross-center">
							<view>{{detail.name}}</view>
							<image src="../image/edit.png"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="switch switch-open dir-top-nowrap" >
				<view class="switch-item dir-left-nowrap cross-center">
					<image src="../image/is-open.png"></image>
					<view class="border dir-left-nowrap main-between" @click="openStatus">
						<view class="app-text">营业状态</view>
						<view  class=" cross-center">
							<view class="switch-view"  :class="{'app-switch-view':detail.setting.is_open == 1 }">
								<view class="click" :class="{'app-switch': detail.setting.is_open == 1 }"></view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="detail.setting.is_open == 1" class="switch-item no-margin dir-left-nowrap cross-center">
					<view @click="toggleOpenType(1)" class="radio-text dir-left-nowrap cross-center">
		                <app-radio @click="toggleOpenType(1)" height="100" width="100" :value="detail.setting.open_type == 1" :item="detail.setting" :theme="theme" type="round"></app-radio>
		                <view class="app-text" :class="{'admin': detail.setting.open_type == 1 }">全天24小时</view>
					</view>
					<view @click="toggleOpenType(2)" class="dir-left-nowrap cross-center">
		                <app-radio @click="toggleOpenType(2)" height="100" width="100" :value="detail.setting.open_type == 2" :item="detail.setting" :theme="theme" type="round"></app-radio>
		                <view class="app-text" :class="{'admin': detail.setting.open_type == 2 }">自定义营业时间</view>
					</view>
				</view>
				<view @click="chooseWeek" v-if="detail.setting.is_open == 1 && detail.setting.open_type == 2" class="switch-open-item main-between cross-center">
					<view class="app-text-switch app-text">选择日期</view>
					<view class="app-icon-text dir-left-nowrap cross-center">
						<view v-if="detail.setting.week_list.length == 0">未填写</view>
						<view v-else class="t-omit switch-open-text">
							<text v-for="(item,index) in detail.setting.week_list" :key="index">
	                            <text v-if="item == '1'">周一</text>
	                            <text v-if="item == '2'">周二</text>
	                            <text v-if="item == '3'">周三</text>
	                            <text v-if="item == '4'">周四</text>
	                            <text v-if="item == '5'">周五</text>
	                            <text v-if="item == '6'">周六</text>
	                            <text v-if="item == '0'">周日</text>
								<text v-if="index != detail.setting.week_list.length - 1">、</text>
							</text>
						</view>
						<image class="app-icon" src="../image/arrow-right.png"></image>
					</view>
				</view>
				<view @click="toSettingTime" v-if="detail.setting.is_open == 1 && detail.setting.open_type == 2" class="switch-open-item main-between cross-center">
					<view class="app-text-switch app-text">选择时间段</view>
					<view class="app-icon-text dir-left-nowrap cross-center">
						<view v-if="detail.setting.time_list.length == 0">未填写</view>
						<view v-else class="t-omit switch-open-text">
							<text v-for="(item,index) in detail.setting.time_list" :key="index">
								{{item.value[0]}}-{{item.value[1]}}<text v-if="index != detail.setting.time_list.length - 1">、</text>
							</text>
						</view>
						<image class="app-icon" src="../image/arrow-right.png"></image>
					</view>
				</view>
				<view @click="openAuto" v-if="detail.setting.is_open == 2" class="switch-open-item no-border main-between cross-center">
					<view class="app-text-switch app-text">设置自动开业时间</view>
					<view class="app-icon-text dir-left-nowrap cross-center">
						<view v-if="detail.setting.is_auto_open == 1">不设置</view>
						<view v-else>
							{{detail.setting.auto_open_time}}
						</view>
						<image class="app-icon" src="../image/arrow-right.png"></image>
					</view>
				</view>
			</view>
			<view class="switch dir-top-nowrap" >
				<view class="switch-item dir-left-nowrap cross-center" v-if="sms">
					<image src="../image/msg.png"></image>
					<view class="dir-left-nowrap main-between" :class="{'border':mail }" @click="setSmsStatus">
						<view class="app-text">短信通知</view>
						<view  class=" cross-center">
							<view class="switch-view"  :class="{'app-switch-view':sms.status == 1 }">
								<view class="click" :class="{'app-switch': sms.status == 1 }"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="switch-item dir-left-nowrap cross-center"  v-if="mail">
					<image src="../image/mail.png"></image>
					<view class="dir-left-nowrap main-between" @click="setMailStatus">
						<view class="app-text">邮件通知</view>
						<view class="cross-center" >
							<view class="switch-view" :class="{'app-switch-view':mail.status == 1 }">
								<view class="click" :class="{'app-switch':mail.status == 1 }"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="switch-time dir-top-nowrap">
				<view class="switch-time-item  dir-left-nowrap cross-center">
					<image src="../image/delete-time.png"></image>
					<view class="switch-time-content dir-left-nowrap main-between border" @click="model = true;modelType = 1;over_time = detail.setting.over_time">
						<view class="app-text-switch app-text">删除未支付订单限时</view>
						<view class="app-icon-text dir-left-nowrap cross-center" >
							<view>{{detail.setting.over_time}}分</view>
							<image class="app-icon" src="../image/arrow-right.png"></image>
						</view>
					</view>
				</view>
				<view class="switch-time-item  dir-left-nowrap cross-center">
					<image src="../image/auto.png"></image>
					<view class="switch-time-content dir-left-nowrap main-between border"  @click="model = true;modelType = 2;delivery_time = detail.setting.delivery_time">
						<view class="app-text-switch app-text">自动确认收货时间</view>
						<view class="app-icon-text dir-left-nowrap cross-center">
							<view>{{detail.setting.delivery_time}}天</view>
							<image class="app-icon" src="../image/arrow-right.png"></image>
						</view>
					</view>
				</view>
				<view class="switch-time-item dir-left-nowrap cross-center">
					<image src="../image/refund.png"></image>
					<view class="switch-time-content dir-left-nowrap main-between" @click="model = true;modelType = 3;after_sale_time = detail.setting.after_sale_time">
						<view class="app-text-switch app-text">可申请售后时间</view>
						<view class="app-icon-text dir-left-nowrap cross-center" >
							<view>{{detail.setting.after_sale_time}}天</view>
							<image class="app-icon" src="../image/arrow-right.png"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="online-payment">
				<view @click="model = true;modelType = 4;payment_type = detail.setting.payment_type">
					<view class="online-payment-content dir-left-nowrap cross-center">
						<image class="app-image" src="../image/pay.png"></image>
						<view class="dir-top-nowrap">
							<view class="payment-text">支付方式</view>
							<view class="payment-method-text">
								{{online_pay ? '线上支付':''}}
								{{online_pay && huodao ? '/':''}}
								{{huodao ? '货到付款':''}}
								{{huodao && balance || online_pay && balance ? '/':''}}
								{{balance ? '余额支付':''}}
							</view>
						</view>
						<image class="app-icon" src="../image/arrow-right.png"></image>
					</view>
				</view>
			</view>
			<view class="shipping-return">
				<view class="shipping-return-item dir-left-nowrap cross-center" >
					<image class="item-image" src="../image/send.png"></image>
					<view class="item-view dir-left-nowrap border main-between border" @click="sendTypeHandler">
						<view class="app-text">发货方式</view>
						<view class="right dir-left-nowrap cross-center">
							<view v-if="detail.setting.send_type">{{detail.setting.send_type.length > 0 ? '已选择': '未选择'}}</view>
							<image src="../image/arrow-right.png"></image>
						</view>
					</view>
				</view>
				<view class="shipping-return-item dir-left-nowrap cross-center">
					<image class="item-image" src="../image/address.png"></image>
					<view class="item-view dir-left-nowrap main-between" @click="jumpGo">
						<view class="app-text">退货地址</view>
						<view class="right dir-left-nowrap cross-center">
							<view>已填写</view>
							<image src="../image/arrow-right.png"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="integral">
				<view class="integral-item dir-left-nowrap cross-center">
					<image src="../image/intergral.png"></image>
					<view class="text-content dir-left-nowrap main-between border" @click="model = true;modelType = 6;member_integral = detail.setting.member_integral">
						<view class="app-text">积分抵扣</view>
						<view class="right dir-left-nowrap cross-center">
							<view>{{detail.setting.member_integral}}积分抵扣1元</view>
							<image src="../image/arrow-right.png"></image>
						</view>
					</view>
				</view>
				<view class="integral-item dir-left-nowrap cross-center">
					<image src="../image/rule.png"></image>
					<view class="text-content dir-left-nowrap main-between" @click="model = true;modelType = 7;member_integral_rule = detail.setting.member_integral_rule">
						<view class="app-text">积分使用规则</view>
						<view class="right dir-left-nowrap cross-center">
							<view>{{detail.setting.member_integral_rule && detail.setting.member_integral_rule.length > 0 ? '已填写' : '未填写'}}</view>
							<image src="../image/arrow-right.png"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
      <view class="safe-area-inset-bottom">
          <view class="u-bottom-height"></view>
      </view>
      <view class="safe-area-inset-bottom u-bottom-fixed">
          <view :class="['main-between','bottom-tab']">
              <view class="box-grow-1 tab-item" @click="toRedirect('/pages/app_admin/index/index')">
                  <image class="tab-icon" src="./../image/index.png"></image>
                  <view>首页</view>
              </view>
              <view class="box-grow-1 tab-item" @click="toRedirect('/pages/app_admin/order/order')">
                  <image class="tab-icon" src="./../image/order.png"></image>
                  <view>订单</view>
              </view>
              <view class="box-grow-1 tab-item" @click="toRedirect('/pages/app_admin/goods/goods')">
                  <image class="tab-icon" src="./../image/goods.png"></image>
                  <view>商品</view>
              </view>
              <view class="box-grow-1 tab-item active">
                  <image class="tab-icon" src="./../image/setting-active.png"></image>
                  <view>设置</view>
              </view>
          </view>
      </view>
		<view @touchmove.stop.prevent="" class="model" v-if="model">
			<view class="content">
				<view class="title">{{modelType === 0 ? '修改商城名称' : modelType === 1 ? '删除未支付订单限时':  modelType === 2 ? '自动确认收货时间':  modelType === 3 ? '可申请售后天数':  modelType === 4 ? '支付方式': modelType === 5 ? '发货方式': modelType === 6 ? '积分抵扣':modelType === 7 ? '积分使用规则': modelType === 8 ? '选择日期': modelType === 9 ? '设置自动开业': ''}}</view>
				<view class="content-text">
					<template v-if="modelType === 0">
						<input placeholder="最多输入15个字符" type="text" class="name" maxlength="15" v-model="name">
					</template>
					<template v-if="modelType === 1">
						<view class="dir-left-nowrap main-center intergral-change">
							<view class="intergral-input">
								<input type="number" class="input" v-model="over_time">
							</view>
							<view>分钟</view>
						</view>
					</template>
					<template v-if="modelType === 2">
						<view class="dir-left-nowrap  main-center intergral-change">
							<view class="intergral-input">
								<input type="number" class="input"  v-model="delivery_time">
							</view>
							<view>天</view>
						</view>
					</template>
					<template v-if="modelType === 3">
						<view class="dir-left-nowrap main-center intergral-change">
							<view class="intergral-input">
								<input type="number" class="input"  v-model="after_sale_time">
							</view>
							<view>天</view>
						</view>
					</template>
					<template v-if="modelType === 4">
						<view class="dir-top dir-top-nowrap main-center pay-change">
							<view class="pay-view" :class="{'app-active': online_pay}" @click="setPay('online_pay')">
								<view class="left  dir-left-nowrap cross-center main-between" >
									<view class="dir-left-nowrap cross-center">
										<image src="../image/online-payment.png"></image>
										<view>线上支付</view>
									</view>
									<image v-if="online_pay"  class="active" src="../image/check.png"></image>
								</view>
							</view>
							<view class="pay-view" :class="{'app-active': balance}" @click="setPay('balance')">
								<view class="left dir-left-nowrap  cross-center main-between" >
									<view class="dir-left-nowrap cross-center">
										<image src="../image/balance.png"></image>
										<view>余额支付</view>
									</view>
									<image v-if="balance"  class="active" src="../image/check.png"></image>
								</view>
							</view>
							<view class="pay-view" :class="{'app-active': huodao}" @click="setPay('huodao')">
								<view class="left dir-left-nowrap cross-center main-between">
									<view class="dir-left-nowrap cross-center">
										<image src="../image/cash-on-delivery.png"></image>
										<view>货到付款</view>
									</view>
									<image v-if="huodao" class="active" src="../image/check.png"></image>
								</view>
							</view>
						</view>
					</template>
					<template v-if="modelType === 5">
						<view class="dir-top dir-top-nowrap main-center pay-change">
							<view class="pay-view" :class="{'app-active': express}" @click="setSend('express')">
								<view class="left  dir-left-nowrap cross-center main-between" >
									<view class="dir-left-nowrap cross-center">
										<image src="../image/express-delivery.png"></image>
										<view>快递配送</view>
									</view>
									<image v-if="express"  class="active" src="../image/check.png"></image>
								</view>
							</view>
							<view class="pay-view" :class="{'app-active': offline}" @click="setSend('offline')">
								<view class="left dir-left-nowrap  cross-center main-between" >
									<view class="dir-left-nowrap cross-center">
										<image src="../image/self-lifting.png"></image>
										<view>到店自提</view>
									</view>
									<image v-if="offline"  class="active" src="../image/check.png"></image>
								</view>
							</view>
							<view class="pay-view" :class="{'app-active': city}" @click="setSend('city')">
								<view class="left dir-left-nowrap cross-center main-between">
									<view class="dir-left-nowrap cross-center">
										<image src="../image/same-city.png"></image>
										<view>同城配送</view>
									</view>
									<image v-if="city" class="active" src="../image/check.png"></image>
								</view>
							</view>
						</view>
					</template>
					<template v-if="modelType === 6">
						<view class="i-modal-body free">
							<view class="main-center intergral-change">
								<input type="number" class="intergral-input" v-model="member_integral">
								<view >积分抵扣1元</view>
							</view>
						</view>
					</template>
					<template v-if="modelType === 7">
						<view class="main-center cross-center textarea-area">
							<textarea class="textarea" v-model="member_integral_rule"></textarea>
						</view>
					</template>
					<template v-if="modelType === 8">
		                <view class="flex-wrap main-between cross-center time-area date-area">
		                    <view v-for="item in date" :key="item.value" @click="chooseDate(item)" :class="[`${item.check?`admin-m-text admin admin-m-border`:'time-area-item'}`]" class="dialog-choose-item">{{item.label}}</view>
		                </view>
					</template>
					<template v-if="modelType === 9">
						<view class="main-center cross-center time-area">
		                    <view @click="chooseAuto = 1" :class="[`${chooseAuto==1?`admin-m-text admin admin-m-border`:'time-area-item'}`]" class="dialog-choose-item">不设置</view>
		                    <view @click="chooseAuto = 2" :class="[`${chooseAuto==2?`admin-m-text admin admin-m-border`:'time-area-item'}`]" class="dialog-choose-item">设置</view>
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
		                                :class="[`${dateVal[0] == idx ?`admin-m-text admin`: ''}`]"
		                                :style="{ color: dateVal[0] == idx + 1 || dateVal[0] == idx - 1 ? '#999999' : dateVal[0] == idx + 2 || dateVal[0] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
		                        </picker-view-column>
		                        <picker-view-column>
		                            <view v-for="(item,idx) in months" :key="item"
		                                :class="[`${dateVal[1] == idx ?`admin-m-text admin`: ''}`]"
		                                :style="{ color: dateVal[1] == idx + 1 || dateVal[1] == idx - 1 ? '#999999' : dateVal[1] == idx + 2 || dateVal[1] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
		                        </picker-view-column>
		                        <picker-view-column>
		                            <view v-for="(item,idx) in days" :key="item"
		                                :class="[`${dateVal[2] == idx ?`admin-m-text admin`: ''}`]"
		                                :style="{ color: dateVal[2] == idx + 1 || dateVal[2] == idx - 1 ? '#999999' : dateVal[2] == idx + 2 || dateVal[2] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
		                        </picker-view-column>
		                    </picker-view>
		                    <picker-view :value="timeVal" :indicator-style="indicatorStyle" class="picker-view" @change="timeChange">
		                        <picker-view-column>
		                            <view v-for="(item,idx) in hour" :key="item"
		                                :class="[`${timeVal[0] == idx ?`admin-m-text admin`: ''}`]"
		                                :style="{ color: timeVal[0] == idx + 1 || timeVal[0] == idx - 1 ? '#999999' : timeVal[0] == idx + 2 || timeVal[0] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
		                        </picker-view-column>
		                        <picker-view-column>
		                            <view v-for="(item,idx) in minutes" :key="item"
		                                :class="[`${timeVal[1] == idx ?`admin-m-text admin`: ''}`]"
		                                :style="{ color: timeVal[1] == idx + 1 || timeVal[1] == idx - 1 ? '#999999' : timeVal[1] == idx + 2 || timeVal[1] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
		                        </picker-view-column>
		                        <picker-view-column>
		                            <view v-for="(item,idx) in minutes" :key="item"
		                                :class="[`${timeVal[2] == idx ?`admin-m-text admin`: ''}`]"
		                                :style="{ color: timeVal[2] == idx + 1 || timeVal[2] == idx - 1 ? '#999999' : timeVal[2] == idx + 2 || timeVal[2] == idx - 2 ? '#cdcdcd': '' , lineHeight: lineHeight}">{{item}}</view>
		                        </picker-view-column>
		                    </picker-view>
		                </view>
					</template>
				</view>
				<view class="buttons dir-left-nowrap cross-center">
					<view class="but cancel">
						<view @click="cancel">取消</view>
					</view>
					<view class="line"></view>
					<view class="but confirm">
						<view @click="confirm">确认</view>
					</view>
				</view>
			</view>
		</view>
	</app-layout>
</template>

<script>
    import appRadio from '../../../components/basic-component/app-radio/app-radio.vue';
	
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
        name: "setting",
	    data() {
            return {
                theme: {
                    background: '#446dfd',
                    color: '#446dfd',
                },
            	lineHeight: '72rpx',
                indicatorStyle: '',
                detail: {
                    setting: {
                        delivery_time: '0',
                        after_sale_time: '0',
                        over_time: '0',
                        member_integral: '0'
                    }
                },
                mail: {},
                sms: {},
	            model: false,
	            modelType: 0,
	            name: '',
                over_time: '',
                delivery_time: '',
                after_sale_time: '',
                payment_type: [],
                online_pay: false,
                balance: false,
                huodao: false,
                send_type: [],
                express: false,
                offline: false,
                city: false,
                member_integral: '',
                member_integral_rule: '',
                chooseAuto: 1,
                date: [
                    {label: '周一', value: '1', check: false},
                    {label: '周二', value: '2', check: false},
                    {label: '周三', value: '3', check: false},
                    {label: '周四', value: '4', check: false},
                    {label: '周五', value: '5', check: false},
                    {label: '周六', value: '6', check: false},
                    {label: '周日', value: '7', check: false},
                ],
                hour: [],
                minutes: [],
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
	    onLoad() { this.$commonLoad.onload();
            for(let i = 0;i < 60;i++) {
                if(i < 10) {
                    i = '0' + i
                }
                if(i < 24) {
                    this.hour.push(i)
                }
                this.minutes.push(i)
            }
            this.indicatorStyle =  'height: 36px;font-size:14px;';
            let screenWidth = uni.getSystemInfoSync().windowWidth;
            let p = 375 / screenWidth;
            this.lineHeight = 72*p + 'rpx';
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
	    onShow() {
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.getList();
	    },
	    methods: {
	    	getList() {
	            this.$request({
	                url: this.$api.app_admin.setting
	            }).then(response => {
	                if (response.code === 0) {
	                    this.detail = response.data.detail;
	                    this.$hideLoading();
	                    let { over_time, delivery_time, after_sale_time, payment_type, member_integral,member_integral_rule, is_auto_open }  = this.detail.setting;
	                    this.over_time = over_time;
	                    this.delivery_time = delivery_time;
	                    this.after_sale_time = after_sale_time;
	                    this.payment_type = payment_type;
	                    this.member_integral = member_integral;
	                    this.member_integral_rule = member_integral_rule;
	                	this.chooseAuto = is_auto_open;
	                    let sendType = this.detail.setting.send_type;
	                    for (let i = 0; i < sendType.length; i++) {
	                        if (sendType[i] === 'express') {
	                            this.express = true;
	                        } else if(sendType[i] === 'offline') {
	                            this.offline = true;
	                        } else if (sendType[i] === 'city') {
	                            this.city = true;
	                        }
	                    }
	                    this.name = this.detail.name;
	                    this.mail = response.data.mail;
	                    this.sms = response.data.sms;
	                    for (let i = 0; i < payment_type.length; i++) {
	                        if (payment_type[i] === 'online_pay') {
	                            this.online_pay = true;
	                        } else if (payment_type[i] === 'huodao') {
	                            this.huodao = true;
	                        } else if (payment_type[i] === 'balance') {
	                            this.balance = true;
	                        }
	                    }
	                    for(let date of this.date) {
	                    	for(let item of this.detail.setting.week_list) {
	                    		if(date.value == item) {
	                    			date.check = true;
	                    		}
	                    	}
	                    }
	                }
	            })
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
            openAuto() {
                this.chooseAuto = this.detail.setting.is_auto_open;
                if(this.chooseAuto == 2 && this.detail.setting.auto_open_time.length > 0) {
                    for(let i in this.years) {
                        if (this.detail.setting.auto_open_time.substring(0, 4) == this.years[i]) {
                            this.dateVal[0] = +i
                        }
                    }
                    for(let i in this.months) {
                        if (this.detail.setting.auto_open_time.substring(5, 7) == this.months[i]) {
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
                        if (this.detail.setting.auto_open_time.substring(8, 10) == this.days[i]) {
                            this.dateVal[2] = +i
                        }
                    }
                    let auto_open_time = this.detail.setting.auto_open_time.substring(11);
                    this.timeVal = auto_open_time.split(':').map(Number);
                }
				this.model = true;
				this.modelType = 9;
            },
	    	chooseWeek() {
			    for(let date of this.date) {
			    	date.check = false;
			    	for(let item of this.detail.setting.week_list) {
			    		if(date.value == item) {
			    			date.check = true;
			    		}
			    	}
			    }
				this.model = true;
				this.modelType = 8;
	    	},
	    	toggleOpenType(e) {
	    		if(e == 1) {
	    			this.detail.setting.open_type = e;
	    			this.submit();
	    		}else {
	    			if(this.detail.setting.week_list.length > 0) {
	    				this.detail.setting.open_type = e;
	    				this.submit();
	    			}else {
	    				this.model = true;
	    				this.modelType = 8;
	    			}
	    		}
	    	},
	    	toSettingTime() {
                uni.navigateTo({
                    url: `/pages/app_admin/open-time/open-time?time_list=${JSON.stringify(this.detail.setting.time_list)}`
                })
	    	},
            chooseDate(e) {
                e.check = !e.check;
            },
            toRedirect(url) {
                uni.redirectTo({
                    url: url
                })
            },
            setLogo() {
                let _this = this;
                uni.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera'],
                    success(res) {
                        uni.uploadFile({
	                        url: _this.$api.upload.file,
                            filePath: res.tempFilePaths[0],
	                        name: 'file',
                            success(response) {
                                _this.detail.setting.mall_logo_pic = JSON.parse(response.data).data.url;
                                _this.submit();
                            }
                        });
                    }
                });
            },
            setSmsStatus() {
                if (this.sms.status === 1) {
                    this.sms.status = 0;
                } else {
                    this.sms.status = 1;
                }
                this.submit();
            },
            setMailStatus() {
                if (this.mail.status === '1') {
                    this.mail.status = '0';
                } else {
                    this.mail.status = '1';
                }
                this.submit();
            },
            openStatus() {
                if (this.detail.setting.is_open === 1) {
                    this.detail.setting.is_open = 2;
                } else {
                    this.detail.setting.is_open = 1;
                }
                this.submit();
            },
            setPay(data) {
                this[data] = !this[data];
                if (this.balance === false && this.huodao === false) {
                    this.online_pay = true;
                }
            },
            setSend(data) {
                this[data] = !this[data];
                if (this.offline === false && this.city === false) {
                    this.express = true;
                }
            },
            sendTypeHandler() {
                this.model = true;
                this.modelType = 5;
            },
            jumpGo() {
                this.$jump({
                    open_type: 'navigate',
	                url: `/pages/address/address?manual_btn_bg=admin&is_hide_default_btn=1&is_refund_address=1`
                });
            },
		    submit() {
                let mail = this.mail ? this.mail.status : null;
                let sms = this.sms? this.sms.status : null;
                let data = {
                    name: this.detail.name,
                    setting: JSON.stringify(this.detail.setting),
                    mail: mail,
                    sms: sms
                };
                this.$request({
	                url: this.$api.app_admin.setting,
	                method: 'post',
	                data: data,
                }).then(response => {
                    if (response.code === 0) {
                        this.model = false;
                    }
                })
		    },
            cancel() {
                this.model = false;
            },
            confirm() {
            	if(this.modelType == 8) {
	            	let pass = false;
	            	for(let item of this.date) {
	            		if(item.check) {
	            			pass = item.check;
	            		}
	            	}
            		if(!pass) {
		                uni.showToast({
		                    title: '请选择营业时间',
		                    icon: 'none',
		                    duration: 1000
		                });
	            		return false;
            		}else {
            			this.detail.setting.open_type = 2
            		}
            	}else if(this.modelType == 1 && this.over_time > 100) {
	                uni.showToast({
	                    title: '删除未支付订单限时最大为100分钟',
	                    icon: 'none',
	                    duration: 1000
	                });
            		return false;
            	}else if(this.modelType == 2 && this.delivery_time > 30) {
	                uni.showToast({
	                    title: '自动确认收货时间为30天',
	                    icon: 'none',
	                    duration: 1000
	                });
            		return false;
            	}else if(this.modelType == 3 && this.after_sale_time > 30) {
	                uni.showToast({
	                    title: '可申请售后时间最大为30天',
	                    icon: 'none',
	                    duration: 1000
	                });
            		return false;
            	}
                this.detail.name = this.name;
                this.detail.setting.over_time = this.over_time;
                this.detail.setting.delivery_time = this.delivery_time;
                this.detail.setting.after_sale_time = this.after_sale_time;
                this.detail.setting.payment_type = [];
                this.detail.setting.member_integral = this.member_integral;
                this.detail.setting.member_integral_rule = this.member_integral_rule;
                if (this.online_pay === true) {
                    this.detail.setting.payment_type.push('online_pay');
                }
                if (this.huodao === true) {
                    this.detail.setting.payment_type.push('huodao');
                }
                if (this.balance === true) {
                    this.detail.setting.payment_type.push('balance');
                }
                this.detail.setting.send_type = [];
                if (this.offline === true) {
                    this.detail.setting.send_type.push('offline');
                }
                if (this.express === true) {
                    this.detail.setting.send_type.push('express');
                }
                if (this.city === true) {
                    this.detail.setting.send_type.push('city');
                }
                this.detail.setting.week_list = [];
                for(let item of this.date) {
                	if(item.check) {
                		this.detail.setting.week_list.push(item.value)
                	}
                }
                this.detail.setting.is_auto_open = this.chooseAuto;
                if(this.detail.setting.is_auto_open == 2) {
                    let month = this.months[this.dateVal[1]];
                    let day = this.days[this.dateVal[2]];
                    if(month < 10) {
                        month = '0' + month
                    }
                    if(day < 10) {
                        day = '0' + day
                    }
                    this.detail.setting.auto_open_time = this.years[this.dateVal[0]] + '-' + month + '-' + day
                    this.detail.setting.auto_open_time += ' ' + this.hour[this.timeVal[0]] + ':' + this.minutes[this.timeVal[1]] + ':' + this.minutes[this.timeVal[2]]
                }
                this.submit();
            },
	    },
	    components: {
            appRadio
	    }
    }
</script>

<style scoped lang="scss">
@import "./setting.scss";
</style>