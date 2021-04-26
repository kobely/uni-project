<template>
	<view class="page-width gift-method">
        <view class="page-width black gift-title">送礼方式</view>
        <view class="page-width active-tab dir-left-nowrap">
            <view 
				class="tab-item black box-grow-0" 
                v-bind:class="{'tab-item-back': open_type === 0}"
                v-on:click="set_people_status(0)"
            >单人领取</view>
            <view
				class="tab-item black box-grow-0" 
                v-bind:class="{'tab-item-back': open_type === 1}"
                v-on:click="set_people_status(1)"
            >多人领取</view>
        </view>
        <view 
			class="page-width people-title" 
            :class="{'people-title-left-radius': open_type === 1}"
        >
            {{open_type === 1 ? "多人领取，每人限领一份" : "一人领取所有礼物"}}
        </view>
        <view class="page-width method dir-left-nowrap cross-center">
            <view
				class="swipe black dir-left-nowrap main-left cross-center" 
				v-on:click="set_method_type(1)"
			>
	            <text>
					{{method_type === 'direct_open' ? "直接送礼" : method_type === 'time_open' ? "定时开奖" : method_type === 'num_open' ? "满人开奖" : ""}}
				</text>
	            <image src="/static/image/icon/icon-down.png" class="swipe-icon" v-if="type.length > 1"></image>
            </view>
            <view class="line"></view>
            <view class="swipe-content dir-left-nowrap main-between cross-center">
	            <text v-if="method_type === 'direct_open'">收礼人可直接领取礼包中的礼物</text>
	            <template v-if="method_type === 'time_open'">
		            <text 
						class="box-grow-1"
						v-on:click="method_status = true;select_type = 2"
		                v-bind:class="{'black' : select_str}"
		            >{{select_str ? select_str : "请选择开奖时间"}}</text>
		            <image class="right-icon" src="/static/image/icon/arrow-right.png"></image>
	            </template >
	            <template v-if="method_type === 'num_open'">
		            <input 
						class="people-number" 
						:value="open_num"
						type="number" 
						placeholder="请输入需要参与的人数" 
						placeholder-class="people-number-input"
						@input="change_people"
					>
		            <text class="people-number black">人</text>
	            </template>
            </view>
        </view>
		<template v-if="method_status">
			<view class="page-width layer-mask" v-on:click="method_status = false">
				<app-iphone-x>
						<view :class="[`${select_type === 1 ? 'select-method' : 'select-time'}`]" slot="empty-area" v-on:tap.native.stop="">
							<template v-if="select_type === 1">
								<view class="page-width item black item-border" v-on:click="set_methods(item)" v-for="(item, index) in type" :key="index" >
									{{item === 'direct_open' ? '直接送礼' : item === 'time_open' ? '定时开奖' : item === 'num_open' ? '满人开奖' : ''}}
								</view>
								<view class="page-width item" v-on:click.stop="method_status = false">取消</view>
							</template>
							<template v-else-if="select_type === 2">
								<view class="title main-right content">
									<text class="title-h black">选择开奖时间</text>
									<text class="select-determine" v-on:click="getChange">确定</text>
								</view>
								<picker-view class="picker-view page-width" v-bind:value="select_date" @change="dateChange">
									<picker-view-column>
										<view class="item" v-for="(item,index) in date.days" :key="index">{{item}}</view>
									</picker-view-column>
									<picker-view-column>
										<view class="item" v-for="(item,index) in date.hour" :key="index">{{item}}</view>
									</picker-view-column>
									<picker-view-column>
										<view class="item" v-for="(item,index) in date.minute" :key="index">{{item}}</view>
									</picker-view-column>
								</picker-view>
							</template>
						</view>
				</app-iphone-x>
			</view>
		</template>
    </view>
</template>

<script>
    import appIphoneX from '../../../../components/basic-component/app-iphone-x/app-iphone-x.vue';

    export default {
        name: 'gift-method',

        props: [`method_type`, `open_type`, `open_num`, `select_str`, `type`],

        data() {
            return {
                // 人数开关
                people_status: false,
	            // 玩法开关
                method_status: false,
	            // 选中 时间 方法
                select_type: 1,
	            // 选中数据
                select_date: [0, 0, 0],
	            // 时间数据
	            date: {
                    days: [],
                    hour: [],
                    minute: [],
	            },
	            copy_date: []
            }
        },

	    // 组件挂载
        mounted() {
            this.getDateStr();
            this.select_date[1] = new Date().getHours();
            this.select_date[2] = new Date().getMinutes() + 1;
        },


	    // 方法
	    methods: {
            // 滚动 修改数据
            dateChange(data) {
                const value = data.detail.value;
                this.select_date[0] = value[0];
                this.select_date[1] = value[1];
                this.select_date[2] = value[2];
                if ( value[0] === 0 && new Date().getHours() > value[1]) {
                    this.select_date[1] = new Date().getHours();
                }
                if (value[0] === 0 && this.select_date[1] === new Date().getHours() && new Date().getMinutes() + 1 > value[2]) {
                    this.select_date[2] = new Date().getMinutes() + 1;
                }
            },
		    
		    // 得到选中的日期
            getChange() {
                this.method_status = false;
                this.$emit('set_lottery_time', `${this.date.days[this.select_date[0]]} ${this.date.hour[this.select_date[1]]}时${this.date.minute[this.select_date[2]]}分`, `${this.copy_date[this.select_date[0]]} ${this.date.hour[this.select_date[1]]}:${this.date.minute[this.select_date[2]]}:00`);
            },
		    
		    // 获取日期 时间
            getDateStr() {
                const hour = [];
                const minute = [];
                const weekday = new Array(7);
                weekday[0] = '日';
                weekday[1] = '一';
                weekday[2] = '二';
                weekday[3] = '三';
                weekday[4] = '四';
                weekday[5] = '五';
                weekday[6] = '六';
                
                // 获取小时
                for (let i = 0; i < 24; i++) {
                    if (i < 10) {
                        i = `0${i}`;
                    }
                    hour.push(`${i}`);
                }
                this.date.hour.push(...hour);
                
                // 获取分钟
                for (let i = 0; i < 60; i++) {
                    if (i < 10) {
                        i = `0${i}`;
                    }
                    minute.push(`${i}`);
                }
                this.date.minute.push(...minute);
                
                // 获取后7天日期
                let days = [];
                for (let i = 0; i < 7; i++) {
                    let date = new Date();
                    date.setDate(date.getDate()+i);
                    let month = date.getMonth()+1;
                    let day = date.getDate();
                    days.push(`${month}月${day}日星期${weekday[date.getDay()]}`);
                    this.copy_date.push(`${date.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`);
                }
                this.date.days.push(...days);
            },
		    
		    set_methods(data) {
                this.method_status = false;
                this.$emit('set_methods', data);
		    },

            set_people_status(data) {
                this.$emit('set_people_status', data);
            },

            change_people(data) {
                this.$emit('change_people', Number(data.detail.value));
            },

            set_method_type(index) {
				this.method_status = true;
                this.select_type = index;
            }
	    },
	    
	    // 组件
        components: {
            'app-iphone-x': appIphoneX,
        },
    }
</script>

<style scoped lang="scss">
    @import '../../css/gift.scss';

	/*玩法*/
    .gift-method {
        padding: #{0upx 24upx 0 24upx};
        background-color: #f7f7f7;
        .gift-title {
            font-size: #{26upx};
            padding-bottom: #{16upx};
        }
    }

	/*切换板*/
    .active-tab {
        height: #{84upx};
        .tab-item {
            width: #{200upx};
            line-height: #{84upx};
            font-size: #{26upx};
            text-align: center;
            border-top-left-radius: #{16upx};
            border-top-right-radius: #{16upx};
        }
        .tab-item-back {
            background-color: #ffffff;
        }
    }

    .people-title {
        padding: #{30upx 0 2upx 32upx};
        font-size: #{24upx};
        color: #999999;
        background-color: #ffffff;
        border-top-right-radius: #{16upx};
    }

    .people-title-left-radius {
        border-top-left-radius: #{16upx};
    }

    /*玩法*/
    .method {
        height: #{104upx};
        background-color: #ffffff;
        border-bottom-left-radius: #{16upx};
        border-bottom-right-radius: #{16upx};
	    
	    /*下拉选择*/
	    .swipe {
		    width: #{200upx};
		    height: 100%;
		    padding-left: #{32upx};
		    font-size: #{26upx};
		    .swipe-icon {
			    width: #{22upx};
			    height: #{12upx};
			    margin-left: #{12upx};
		    }
	    }
	    
	    /*中间线*/
	    .line {
		    width: #{1upx};
		    height: #{36upx};
		    background-color: #e2e2e2;
	    }
    }

    /*选择显示*/
    .swipe-content {
	    height: #{104upx};
	    line-height: #{104upx};
	    width: calc(100% - #{201upx});
	    padding: #{0 32upx};
	    /*文字*/
	    text {
		    color: #999999;
		    font-size: #{26upx};
	    }
	    /*图标*/
	    .right-icon {
			width: #{12upx};
		    height: #{22upx};
	    }
	    /*参与人数*/
	    .people-number {
		    font-size: #{26upx};
	    }
	    input.people-number{
		    width: #{400upx};
	    }
	    .people-number-input {
		    font-size: #{26upx};
		    color: #999999;
	    }
    }
    
    /* 图层蒙版 */
	.layer-mask {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		z-index: 1600;
		background-color: rgba(0,0,0,.3);
	}
	
	/*选择方法弹板*/
	.select-method {
		width: 100%;
		background-color: #ffffff;
		box-shadow:#{0 1upx 10upx -1upx} #dddddd;
		.item {
			height: #{88upx};
			line-height: #{88upx};
			padding: auto;
			font-size: #{28upx};
			text-align: center;
		}
		.item-border {
			border-bottom: #{1upx} solid #e2e2e2;
		}
	}
	
	/*选择时间弹板*/
	.select-time {
		width: 100%;
		height: #{536upx};
		background-color: #ffffff;
		box-shadow: #{0 1upx 10upx -1upx} #dddddd;
		.picker-view {
			height: #{440upx};
		}
		
		/*选择块*/
		.item {
			font-size: #{28upx};
			text-align: center;
			line-height: 34px;
		}
		
		/*标题*/
		.title {
			height: #{96upx};
			line-height: #{96upx};
			font-size: #{32upx};
			border-bottom: #{1upx} solid #e2e2e2;
			
			/*确定按钮*/
			.select-determine {
				padding: #{0 26upx};
				color: #3399ff;
			}
			
			.title-h {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}
</style>