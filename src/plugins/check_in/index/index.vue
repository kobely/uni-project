<template>
    <app-layout :overflow='false'>
		<view v-if="customize">
	        <image load-lazy='true' class='bg' :src='customize.head_bg ? customize.head_bg : checkImg.app_image.top_bg'></image>
	        <!-- 签到提醒 -->
	        <view @click="changeSwitch" class='tips dir-left-nowrap cross-center' v-if="config.is_remind == 1">
	            <text :style="{'color':`${customize.remind_font}`}">签到提醒</text>
	            <switch style="transform:scale(0.7)" v-if="user.is_remind == 1" @change='toSwitch' :checked="user.is_remind == 1"></switch>
	            <switch style="transform:scale(0.7)" v-else @change='toSwitch' :checked="user.is_remind == 1"></switch>
	        </view>
	        <!-- 规则 -->
	        <view @click="toRules" class='icon'>
	            <view class='rules'>签到规则</view>
	        </view>
	        <view @click="toIndex" class='icon toIndex'>
	            <view class='rules'>回到首页</view>
	        </view>
	        <!-- 签到按钮 -->
	        <view @click="subscribe" class='check-in-btn' v-if="user.today_check_in == null">
	            <image load-lazy='true' :src='customize.not_signed_icon ? customize.not_signed_icon : checkImg.app_image.check_in'></image>
	        </view>
	        <view class='check-in-btn' v-else>
	            <image load-lazy='true' :src='customize.signed_icon ? customize.signed_icon : checkImg.app_image.over'></image>
	        </view>
	        <view :style="{'color':`${customize.daily_font}`}" class='no-check-in' v-if="user.today_check_in == null">今日还未签到</view>
	        <view :style="{'color':`${customize.daily_font}`}" class='no-check-in' v-else>今日已签到</view>
	        <view :style="{'color':`${customize.daily_font}`}" v-if="user.continue_day || user.continue_day == 0" class='always'>已连续签到{{user.continue_day}}天</view>
	        <!-- 签到奖励 -->
	        <view class='other' :style="{'background':`linear-gradient(to bottom,${customize.end_bg},${customize.end_style == 1 ? customize.end_gradient_bg : customize.end_bg})`,'min-height':`${other_height}`}">
	            <view class='reward' v-if="config.continue.length > 0">
	                <view :class="[`reward-item`, `${item.day == config.continue[0].day ? 'no-top':''}`]" v-for="(item, index) in config.continue" :key="index" :style="{'border-color':`${customize.line_font}`}">
	                    <image load-lazy='true' class='reward-icon' v-if="item.type =='integral'" :src="customize.integral_icon ? customize.integral_icon : '/static/image/integral.png'"></image>
	                    <image load-lazy='true' class='reward-icon' v-if="item.type =='balance'" :src="customize.balance_icon ? customize.balance_icon : '/static/image/hongbao.png'"></image>
	                    <view class='reward-title'>连续签到{{item.day}}天</view>
	                    <view class='reward-content' v-if="item.type =='integral'">赠送{{item.number}}积分</view>
	                    <view class='reward-content' v-if="item.type =='balance'">赠送{{item.number}}元余额红包</view>
	                    <view class='reward-btn' v-if="item.check">
	                        <button class='over' :style="{'color':`${customize.prompt_font}`,'backgroundColor':`${customize.btn_bg}`}">已领取</button>
	                    </view>
	                    <view class='reward-btn' v-else-if="user.continue_day >= item.day" data-id="2" @click="getAward(2,item.day)">
	                        <button :style="{'color':`${customize.not_prompt_font}`,'backgroundColor':`${customize.not_btn_bg}`}">领取</button>
	                    </view>
	                </view>
	            </view>
	            <view class='reward balance-reward' v-if="config.total.length > 0">
	                <view class='reward-item' v-for="(item, index) in config.total" :key="index">
	                    <image load-lazy='true' class='reward-icon' v-if="item.type =='integral'" :src="customize.integral_icon ? customize.integral_icon : '/static/image/integral.png'"></image>
	                    <image load-lazy='true' class='reward-icon' v-if="item.type =='balance'" :src="customize.balance_icon ? customize.balance_icon : '/static/image/hongbao.png'"></image>
	                    <view class='reward-title'>累积签到{{item.day}}天</view>
	                    <view class='reward-content' v-if="item.type =='integral'">赠送{{item.number}}积分</view>
	                    <view class='reward-content' v-if="item.type =='balance'">赠送{{item.number}}元余额红包</view>
	                    <view class='reward-btn' v-if="item.check">
	                        <button class='over'>已领取</button>
	                    </view>
	                    <view class='reward-btn' v-if="user.total_day >= item.day && !item.check" data-id="3" @click="getAward(3,item.day)">
	                        <button :style="{'color':`${customize.not_prompt_font}`,'backgroundColor':`${customize.not_btn_bg}`}">领取</button>
	                    </view>
	                </view>
	            </view>
	            <!-- 日历 -->
	            <!-- #ifndef MP-BAIDU -->
	            <view class='day'>
            	<!-- #endif -->
                <!-- #ifdef MP-BAIDU -->
	            <view class='day' style="margin: 12px 18px;">
            	<!-- #endif -->
	                <view class='day-title main-center cross-center'>
	                    <view @click="lose">
	                    	<view class="toggle-btn main-center cross-center">
	                        	<image load-lazy='true' src='/static/image/icon/arrow-left.png'></image>
	                    	</view>
	                    </view>
	                    <view class='date'>
	                        <text>{{year}}</text>
	                        <text>年</text>
	                        <text>{{month}}</text>
	                        <text>月</text>
	                    </view>
	                    <view @click="add">
	                    	<view class="toggle-btn main-center cross-center">
	                        	<image load-lazy='true' src='/static/image/icon/arrow-right.png'></image>
	                    	</view>
	                    </view>
	                </view>
	                <view class='week main-between'>
	                    <view>日</view>
	                    <view>一</view>
	                    <view>二</view>
	                    <view>三</view>
	                    <view>四</view>
	                    <view>五</view>
	                    <view>六</view>
	                </view>
	                <view class='everyday main-between'>
	                	<!-- #ifdef MP-TOUTIAO || MP-WEIXIN -->
	                    <view v-for="(item,index) in everyday" class='every' :key="index">
	                    <!-- #endif -->
	                	<!-- #ifndef MP-TOUTIAO || MP-WEIXIN -->
	                    <view v-for="(item,index) in everyday" class='every' style="width:28px;" :key="index">
	                    <!-- #endif -->
	                        <image load-lazy='true' v-if="item && item.check" :src="customize.calendar_icon ? customize.calendar_icon : './../image/choose.png'"></image>
	                        <view v-if="item" :class="[`${item && item.date > now ? 'next' : ''}`]">{{item.date}}</view>
	                    </view>
	                </view>
	            </view>
	        </view>
            </view>
	    </view>
        </view>
	    <view class='dialog' v-if="success || getRed">
	        <view v-if="success" class='success'>
	            <image load-lazy='true' class='success-img' v-if="success" :src='checkImg.app_image.success'></image>
	            <image load-lazy='true' class='success-img' v-else :src='checkImg.app_image.get'></image>
	            <view class='getPrice main-center'>
	                <image load-lazy='true' v-if="result.type == 'integral'" :src="customize.integral_icon ? customize.integral_icon : '/static/image/integral.png'"></image>
	                <text>+{{result.number}}</text>
	            </view>
	            <view v-if="success" class='info'>
	                <text v-if="result.status == 1">签到成功</text>
	                <text v-if="result.status == 2">已连续签到</text>
	                <text v-if="result.status == 3">已累积签到</text>
	                <text v-if="result.status != 1">{{result.day}}天</text>
	            </view>
	            <view class='info' v-else>恭喜获得签到奖励</view>
	            <view @click="close">
	                <button class='success-btn'>{{success ? '知道咯' : '收下奖励'}}</button>
	            </view>
	        </view>
	        <view v-if="getRed" class='getRed'>
	            <image load-lazy='true' class='getRed-img' :src='checkImg.app_image.getRed'></image>
	            <view class='getRed-title'>恭喜获得签到奖励</view>
	            <view class='getRed-price'>
	                <text>+{{result.number}}</text>元</view>
	            <view class='getRed-content'>余额红包</view>
	            <view @click="close">
	                <button class='getRed-btn'>收下奖励</button>
	            </view>
	            <view class='getRed-info'>
	                <text v-if="result.status == 1">已签到</text>
	                <text v-if="result.status == 2">已连续签到</text>
	                <text v-if="result.status == 3">已累积签到</text>
	                <text>{{result.day}}</text>天</view>
	        </view>
	        <view :class="[`close`,`${getRed ? 'get-close' : ''}`]" @click="close">
	            <image load-lazy='true' :src='mallImg.close'></image>
	        </view>
	    </view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        data() {
            return {
		        month: 1,
		        year: 1990,
		        everyday: [],
		        config: {
		        	total: [],
		        	continue: []
		        },
		        user: {},
		        result: {},
		        other_height: '500rpx',
		        now: 1,
		        noday: ['', '', '', '', '', '', '', ''],
		        week: 1,
		        date: [],
		        getRed: false,
		        customize: null,
		        page_loading: true,
		        template_message: false,
		        success: false
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                mallImg: state => state.mallConfig.__wxapp_img.mall,
                checkImg: state => state.mallConfig.plugin.check_in
            })
        },
        methods: {
            toRules() {
				uni.navigateTo({
					url: `/pages/rules/index?url=${encodeURIComponent(this.$api.check_in.index)}&keys=${JSON.stringify(['config', 'rule'])}`,
				});
            },
            toIndex() {
                uni.redirectTo({
                    url: '/pages/index/index'
                });
            },
            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.check_in.customize,
                }).then(response=>{
                    if(response.code == 0) {
                        that.customize = response.data.list;
                		that.getList();
                    }else {
                    	that.$hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.check_in.index,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.config = response.data.config;
                        that.user = response.data.check_in_user;
                        that.template_message = response.data.template_message;
                		that.getEveryday();
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
		    getEveryday() {
		        let that = this;
		        let month = that.month;
		        let year = that.year;
		        let day = 32;
		        let everyday = [];
		        if (month < 8 && month % 2 == 0 && month != 2) {
		            day = 31;
		        } else if (month > 7 && month % 2 == 1) {
		            day = 31;
		        } else if (month == 2) {
		            if (year % 4 == 0 && year % 100 != 0) {
		                day = 30;
		            } else {
		                day = 29;
		            }
		        }
		        for (let i = 1; i < day; i++) {
		            everyday.push({
		                date: i,
		                check: false
		            })
		        }
		        let noday = that.noday;
		        let before = that.week;
		        for (let z = 0; z < before; z++) {
		            everyday.unshift(noday[z])
		        }
		        if (everyday.length % 7 != 0) {
		            let number = 7 - (everyday.length % 7);
		            for (let y = 0; y < number; y++) {
		                everyday.push(noday[y])
		            }
		        }
		        that.everyday = everyday;
		        that.getDay(year,month);
		    },
            getDay(year, month) {
                let that = this;
                that.$request({
                    url: that.$api.check_in.sign_in_day,
		            data: {
		                month: month,
		                year: year
		            }
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        let date = response.data.check_in_day;
                        for(let day of that.everyday) {
                        	if(day) {
	                        	day.check = false;
                        		for(let item of date) {
	                        		if(item == day.date) {
	                        			day.check = true;
	                        		}
                        		}
                        	}
                        }
                		that.$forceUpdate();
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
			lose() {
		        let month = this.month - 1;
		        let year = this.year;
		        let now = this.now;
		        if (month < 1) {
		            month = 12;
		            year--;
		        }
		        let dayValue = year + "-" + month + '-01';
		        var day = new Date(Date.parse(dayValue.replace(/-/g, '/')));
		        this.week = day.getDay();
		        var myDate = new Date();
		        let nowYear = myDate.getFullYear();
		        let nowMonth = myDate.getMonth() + 1;
		        if (year == nowYear) {
		            if (month > nowMonth) {
		                now = 0;
		            } else if (month < nowMonth) {
		                now = 32;
		            } else {
		                now = myDate.getDate();
		            }
		        } else if (year > nowYear) {
		            now = 0;
		        } else {
		            now = 32;
		        }
		        this.year = year;
		        this.month = month;
		        this.now = now;
		        this.getEveryday();
		    },
		    // 月份增大
		    add() {
		        let month = this.month + 1;
		        let year = this.year;
		        let now = this.now;
		        if (month > 12) {
		            month = 1;
		            year++;
		        }
		        let dayValue = year + "-" + month + '-01';
		        var day = new Date(Date.parse(dayValue.replace(/-/g, '/')));
		        this.week = day.getDay();
		        var myDate = new Date();
		        let nowYear = myDate.getFullYear();
		        let nowMonth = myDate.getMonth() + 1;
		        if (year == nowYear) {
		            if (month > nowMonth) {
		                now = 0;
		            } else if (month < nowMonth) {
		                now = 32;
		            } else {
		                now = myDate.getDate();
		            }
		        } else if (year > nowYear) {
		            now = 0;
		        } else {
		            now = 32;
		        }
		        this.year = year;
		        this.month = month;
		        this.now = now;
		        this.getEveryday();
		    },
            subscribe() {
                this.$subscribe(this.template_message).then(res => {
                    this.getAward(1);
                }).catch(res => {
                    this.getAward(1);
                });
            },
		    getAward(status,day) {
		        let that = this;
                uni.showLoading({
                	mask: true,
                    title: status == 1 ? '签到中...' : '领取中...'
                });
		        that.$request({
                    url: that.$api.check_in.sign_in,
		            data: {
		                status: status,
                    	day: day ? day : 1
		            }
                }).then(response=>{
                    if(response.code == 0) {
	                    let queueId = response.data.queueId;
	                    let token = response.data.token;
	                    that.checkInResult(queueId,token);
                    }else {
                    	uni.hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(()=>{
                        that.$store.dispatch('user/info');
                        that.getAward(status,day);
                    });
                });
		    },
		    checkInResult(queueId, token) {
		        let that = this;
		        that.$request({
                    url: that.$api.check_in.sign_in_result,
		            data: {
		                queueId: queueId,
                    	token: token
		            }
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
						if (response.data.retry == 1) {
	                        that.checkInResult(queueId, token);
	                    } else {
	                    	that.result = response.data
	                        if (that.result.type == 'integral') {
	                        	that.success = true;
				            } else if (that.result.type == 'balance') {
	                        	that.getRed = true;
				            }
	                    }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                });
		    },
		    changeSwitch() {
                if(this.user.is_remind == 0) {
                    this.$subscribe(this.template_message);
                }
		    },
		    toSwitch (e) {
		        let that = this;
		        let is_remind = 0;
		        if (e.detail.value) {
		            is_remind = 1;
		        }
		        that.$request({
                    url: that.$api.check_in.user,
		            data: {
		                is_remind: is_remind
		            }
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                    	this.user.is_remind = is_remind
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
		    },
		    close() {
	            this.success = false;
	            this.getRed = false;
		        this.getList();
		    },
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: this.$children[0].navigationBarTitle,
                path: "/plugins/check_in/index/index",
            });
        },
        // #endif
		// #ifdef MP-WEIXIN
		onShareTimeline() {
		  // 分享朋友圈beta
		  return this.$shareTimeline({
		    title: this.$children[0].navigationBarTitle,
		    query: {} // 此处填写页面的参数
		  });
		},
		// #endif
        onLoad() { this.$commonLoad.onload();
            let that = this;
            wx.getSystemInfo({
		      success: function(res, rect) {
		      	that.other_height = (res.windowHeight*2 - 500) + 'rpx'
		      }
		    });

            let myDate = new Date();
	        that.year = myDate.getFullYear();
	        that.month = myDate.getMonth() + 1;
	        that.now = myDate.getDate();
	        let dayValue = that.year + "-" + that.month + '-01';
	        let day = new Date(Date.parse(dayValue.replace(/-/g, '/')));
	        that.week = day.getDay();
	        // #ifdef MP-WEIXIN
			wx.showShareMenu({
			  menus: ['shareAppMessage', 'shareTimeline']
			})
			// #endif
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.getSetting();
        }
    }
</script>

<style scoped lang="scss">
	.bg {
	    width: 100%;
	    height: #{500rpx};
	    display: block;
	}

	.tips {
	    position: absolute;
	    top: #{55rpx};
	    left: #{30rpx};
	    color: #fff;
	    font-size: #{24rpx};
	}

	.icon {
	    position: absolute;
	    right: 0;
	    top: #{55rpx};
	}

	.icon.toIndex {
		top:#{119rpx};
	}

	.rules {
	    height: #{48rpx};
	    line-height: #{46rpx};
	    width: #{144rpx};
	    text-align: center;
	    padding: 0;
	    color: #fff;
	    background-color: rgba(0, 0, 0, 0.3);
	    font-size: #{24rpx};
	    border-top-left-radius: #{24rpx};
	    border-bottom-left-radius: #{24rpx};
	    border: #{2rpx} solid #fff;
	    border-right: 0;
	}

	.check-in-btn {
	    height: #{260rpx};
	    width: #{260rpx};
	    position: absolute;
	    top: #{60rpx};
	    left: 50%;
	    margin-left: #{-130rpx};
	}

	.check-in-btn image {
	    height: #{260rpx};
	    width: #{260rpx};
	}

	.no-check-in {
	    font-size: #{32rpx};
	    color: #fff;
	    position: absolute;
	    top: #{340rpx};
	    left: 0;
	    right: 0;
	    text-align: center;
	}

	.always {
	    font-size: #{28rpx};
	    color: #fff;
	    position: absolute;
	    top: #{390rpx};
	    left: 0;
	    right: 0;
	    text-align: center;
	}

	.reward {
	    margin: 0 #{24rpx};
	    border-radius: #{14rpx};
	    padding: 0 #{40rpx};
	    background-color: #fff;
	}

	.reward.balance-reward {
		margin-top:#{24rpx};
	}

	.reward-item {
	    height: #{150rpx};
	    border-top: #{1rpx} dashed #5997fc;
	    color: #2c3c7e;
	    font-size: #{26rpx};
	    position: relative;
	}

	.reward-item.no-top {
	    border-top: #{1rpx} dashed #fff!important;
	}

	.reward.balance-reward .reward-item {
		border-top: #{1rpx} solid #fff;
	}

	.reward-icon {
	    float: left;
	    height: #{72rpx};
	    width: #{72rpx};
	    margin-top: #{39rpx};
	    margin-right: #{24rpx};
	}

	.reward-title {
	    margin-top: #{40rpx};
	}

	.reward-content {
	    margin-top: #{-3rpx};
	}

	.reward-btn {
	    position: absolute;
	    right: #{40rpx};
	    top: #{47rpx};
	}

	.reward-btn button {
	    border-radius: #{28rpx};
	    width: #{150rpx};
	    height: #{56rpx};
	    line-height: #{56rpx};
	    color: #fff;
	    font-size: #{26rpx};
	    background-color: #5997fc;
	}

	.reward-btn button::after {
	    border: 0;
	}

	.reward-btn .over {
	    background-color: #cdcdcd;
	}

	.day {
	    margin: #{24rpx};
	    background-color: #fff;
	    border-radius: #{14rpx};
	    z-index: 99;
	    padding: #{40rpx} #{25rpx};
	    padding-top: 0;
	}

	.day-title {
	    height: #{110rpx};
	}

	.day-title image {
	    display: block;
	    margin-top: #{4rpx};
	    height: #{22rpx};
	    width: #{12rpx};
	}

	.date {
	    color: #353535;
	    font-size: #{28rpx};
	}

	.week {
	    color: #999;
	    height: #{64rpx};
	    border-bottom: #{1rpx} solid #e2e2e2;
	    margin-bottom: #{16rpx};
	}

	.week view {
	    height: #{64rpx};
	    width: #{64rpx};
	    margin: 0 #{15rpx};
	    line-height: #{64rpx};
	    text-align: center;
	}

	.everyday {
	    flex-wrap: wrap;
	}

	.everyday .every {
	    margin: 0 #{15rpx} #{8rpx};
	    height: #{64rpx};
	    width: #{64rpx};
	    line-height: #{64rpx};
	    text-align: center;
	    position: relative;
	}

	.everyday .every image {
	    height: #{64rpx};
	    position: absolute;
	    width: #{64rpx};
	    top: 0;
	    left: 0;
	    display: block;
	}

	.every view {
	    line-height: #{64rpx};
	    position: absolute;
	    height: #{64rpx};
	    width: #{64rpx};
	    top: 0;
	    left: 0;
	    z-index: 5;
	}

	.next {
	    color: #999;
	}

	.dialog {
	    position: fixed;
	    left: 0;
	    top: 0;
	    height: 100%;
	    width: 100%;
	    z-index: 999;
	    background-color: rgba(0, 0, 0, 0.3);
	}

	.success {
	    position: fixed;
	    top: #{350rpx};
	    left: 0;
	    right: 0;
	    width: #{630rpx};
	    margin: 0 auto;
	    background-color: #fff;
	    border-radius: #{16rpx};
	    z-index: 1000;
	    padding-bottom: #{64rpx};
	}

	.success .success-img {
	    height: #{450rpx};
	    width: #{630rpx};
	    margin-top: #{-250rpx};
	}

	.getPrice {
	    height: #{40rpx};
	    line-height: #{40rpx};
	    color: #ff4544;
	    font-size: #{44rpx};
	    margin-bottom: #{28rpx};
	}

	.success .getPrice image {
	    height: #{40rpx};
	    width: #{40rpx};
	    margin-right: #{16rpx};
	    display: block;
	}

	.info {
	    font-size: #{32rpx};
	    color: #353535;
	    margin-bottom: #{44rpx};
	    text-align: center;
	}

	.info text {
	    color: #ff4544;
	}

	.success-btn {
	    width: #{320rpx};
	    height: #{72rpx};
	    line-height: #{72rpx};
	    font-size: #{32rpx};
	    color: #fff;
	    background-color: #ff4544;
	    border-radius: #{36rpx};
	    margin: 0 auto;
	}

	.success-btn::after {
	    border: 0;
	}

	.getRed {
	    height: #{460rpx};
	    width: #{630rpx};
	    position: fixed;
	    top: #{330rpx};
	    left: 0;
	    right: 0;
	    margin: 0 auto;
	    text-align: center;
	    font-size: #{28rpx};
	    color: #ba7d44;
	}

	.getRed-img {
	    height: #{460rpx};
	    width: #{630rpx};
	}

	.getRed-title {
	    position: fixed;
	    text-align: center;
	    left: 0;
	    width: 100%;
	    top: #{390rpx};
	}

	.getRed-price {
	    color: #ff4544;
	    position: fixed;
	    text-align: center;
	    left: 0;
	    width: 100%;
	    top: #{450rpx};
	}

	.getRed-price text {
	    font-family: DIN;
	    font-size: #{68rpx};
	}

	.getRed-content {
	    position: fixed;
	    text-align: center;
	    left: 0;
	    width: 100%;
	    top: #{540rpx};
	}

	.getRed-btn {
	    position: fixed;
	    top: #{640rpx};
	    left: 0;
	    right: 0;
	    margin: 0 auto;
	    width: #{320rpx};
	    height: #{72rpx};
	    color: #ff4544;
	    font-size: #{32rpx};
	    line-height: #{72rpx};
	    border-radius: #{36rpx};
	    background: linear-gradient(to bottom, #ffe8bc, #ffcb7c);
	}

	.getRed-btn::after {
	    border: 0;
	}

	.close {
	    position: fixed;
	    top: #{870rpx};
	    height:#{30rpx};
	    width:#{30rpx};
	    left: 50%;
	    margin-left: #{-15rpx};
	    z-index: 1000;
	}

	.close image {
	    height:#{30rpx};
	    width:#{30rpx};
	}

	.get-close {
	    top: #{800rpx};
	}

	.getRed-info {
	    font-size: #{22rpx};
	    position: fixed;
	    top: #{724rpx};
	    left: 0;
	    right: 0;
	    text-align: center;
	    color: #ffcb7c;
	}

	.other {
	    background: linear-gradient(to bottom,#2a3a7c,#5b7ac7);
	    padding-bottom: #{40rpx};
	    position: absolute;
	    top: #{500rpx};
	    left: 0;
	    width: 100%;
	}

	.toggle-btn {
	    width: #{150rpx};
	    height: #{110rpx};
	}
</style>
