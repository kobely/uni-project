<template>
	<view class="app-sell-tip" v-if="time > 0">
		<view class="dir-left-norwap cross-center sell-tip">
			<view class="content box-grow-1">{{content}}</view>
			<view class="box-grow-0">距开始</view>
			<view class="box-grow-0 dir-left-nowrap u-time-box" v-if="timer">
				<view class="main-center cross-center u-time" v-if="timer.day > 0">{{timer.day}}</view>
				<view class="main-center cross-center u-symbol" v-if="timer.day > 0">:</view>
				<view class="main-center cross-center u-time">{{timer.hour}}</view>
				<view class="main-center cross-center u-symbol">:</view>
				<view class="main-center cross-center u-time">{{timer.min}}</view>
				<view class="main-center cross-center u-symbol">:</view>
				<view class="main-center cross-center u-time">{{timer.sec}}</view>
			</view>
		</view>
	</view>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
export default {
	name: "app-sell-tip",
	components:{},
	props: {
		time: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	data() {
		return {
			timer: null,
			timeLog: 0
		}
	},
	watch:{
		time: {
			handler() {
				let timelog = this.time;
				if (timelog <= 0) {
					return;
				}
				let day = parseInt((timelog / 60 / 60 / 24));
				let hour = parseInt((timelog / 60 / 60) % 24);
				let min = parseInt((timelog / 60) % 60);
				let sec = parseInt((timelog) % 60);
				this.timer = {
					day: day,
					hour: hour < 10 ? "0" + hour : hour,
					min: min < 10 ? "0" + min : min,
					sec: sec < 10 ? "0" + sec : sec
				};
				setTimeout(() => {
				    timelog -= 1;
					this.$emit('changeTime', timelog);
				}, 1000);
			},
			immediate: true
		}
	},
	computed:{
		...mapState({
			isTip: state => state.mallConfig.mall.setting.is_remind_sell_time
		}),
		content() {
			let str = '即将开售';
			if (this.isTip == 1) {
				str += '，记得设置提醒'
			}
			return str;
		}
	}
}
</script>

<style lang="scss" scoped>
	.sell-tip {
		width: 100%;
		height: 80upx;
		padding: 0 32upx;
		background-color: #F2F2F2;
		border-radius: 16upx;
        font-size: 24upx;
	}
	.content {
		font-weight: bold;
		font-size: $uni-font-size-general-two;
	}
    .u-time-box {
        margin-left: #{23rpx};
    }
    .u-symbol {
        width: 16upx;
        height: 42upx;
    }
    .u-time {
        width: 42upx;
        height: 42upx;
        color: #ffffff;
        border-radius: 8upx;
        background-color: #353535;
    }
</style>
