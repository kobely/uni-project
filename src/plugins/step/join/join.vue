<template>
    <app-layout>
        <view v-if="join == false">
            <view class='top'>
                <image :src='stepImg.app_image.ba'></image>
                <view class='title'>
                    <text :class='[`${list.title.length > 14 ? "dare-name" : ""}`]'>{{list.title}}</text>
                    <text>{{list.step_num}}步挑战赛</text>
                </view>
                <view class='time'>开始时间：{{list.begin_at ? list.begin_at + ' 00:00' : ''}}</view>
                <view class='time end-time'>结束时间：{{list.end_at ? list.end_at + ' 23:59' : ''}}</view>
            </view>
            <view class='msg'>
                <view class='text'>使用{{setting.currency_name ? setting.currency_name : '活力币'}}参赛</view>
                <view>
                    <text class='use-price'>{{list.bail_currency ? list.bail_currency : 0}}</text>个</view>
            </view>
            <view class='content'>
                <view class='content-title'>参赛步骤</view>
                <view class='content-body'>
                    <view class='content-num'>
                        <image src='./../image/one.png'></image>
                    </view>
                    <view class='content-text'>
                        <view class='step-title'>报名参赛</view>
                        <view>使用{{list.bail_currency ? list.bail_currency : 0}}个{{setting.currency_name ? setting.currency_name:'活力币'}}参赛</view>
                    </view>
                </view>
                <view class='content-body'>
                    <view class='content-num'>
                        <image src='./../image/two.png'></image>
                    </view>
                    <view class='content-text'>
                        <view class='step-title'>比赛日行走达{{list.step_num}}步</view>
                        <view>比赛日完成并提交{{list.step_num}}步行走</view>
                    </view>
                </view>
                <view class='content-body'>
                    <view class='content-num'>
                        <image src='./../image/three.png'></image>
                    </view>
                    <view class='content-text'>
                        <view class='step-title'>获得{{setting.currency_name ? setting.currency_name:'活力币'}}奖励</view>
                        <view>挑战结束，达标用户可平分奖池{{setting.currency_name ? setting.currency_name:'活力币'}}</view>
                    </view>
                </view>
            </view>
            <view @click='subscribe'>
                <view class='join'>
                    <button class='join-btn'>立即报名</button>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        data() {
            return {
                list: {},
                name: '',
                open_date: '',
                step_num: 1000,
                bail_currency: 1.00,
                setting: null,
                template_activity: null,
                join: false
            }
        },
        computed: {
            ...mapState({
                stepImg: state => state.mallConfig.plugin.step,
                userInfo: state => state.user.info,
            })
        },
        methods: {
            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.step.setting,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.setting = response.data;
                        that.template_activity = response.data.template_activity;
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
            getList(id) {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.step.activity_detail,
                    data:{
                        activity_id: id
                    },
                }).then(response=>{
                    that.getSetting();
                    if(response.code == 0) {
                        that.list = response.data.list;
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
            subscribe() {
                this.$subscribe(this.template_activity).then(res => {
                    this.apply();
                }).catch(res => {
                    this.apply();
                });
            },
            apply() {
                let that = this;
                let id = that.list.id;
                uni.showLoading({
                    mask: true,
                    title: '报名中...'
                });
                that.$request({
                    url: that.$api.step.activity_join,
                    data: {
                        activity_id: id
                    },
                    method: 'POST',
                }).then(response => {
                    uni.hideLoading();
                    if (response.code == 0) {
                        let date = that.list.begin_at;
                        uni.redirectTo({
                            url: '/plugins/step/dare/dare?join=1&date='+date
                        })
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                    uni.showToast({
                        title: response,
                        icon: 'none',
                        duration: 1000
                    });
                });
            },
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.getList(options.id);
        }
    }
</script>

<style scoped lang="scss">
    .top {
        height: #{200rpx};
        color: #fff;
        font-size: #{32rpx};
        text-align: center;
        position: relative;
    }

    .top image{
        width: 100%;
        height: 100%;
    }

    .title {
        position: absolute;
        width: 100%;
        text-align: center;
        top: #{35rpx};
        height: #{35rpx};
        line-height: #{35rpx};
    }

    .dare-name{
        display: inline-block;
        width: 65%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: #{35rpx};
        line-height: #{35rpx};
        margin-bottom: #{-3rpx};
    }

    .time{
        position: absolute;
        width: 100%;
        font-size: #{26rpx};
        text-align: center;
        top: #{80rpx}; 
    }

    .time.end-time {
        top:#{110rpx};
    }

    .msg {
        height: #{200rpx};
        width: 93.6%;
        background-color: white;
        margin: 0 #{24rpx};
        color: #999;
        text-align: center;
        font-size: #{26rpx};
        padding: #{40rpx} #{40rpx};
        border-radius: #{16rpx};
        position: absolute;
        top: #{160rpx};
    }

    .text {
        margin-bottom: #{18rpx};
    }

    .use-price {
        font-size: #{68rpx};
        font-family: 'DIN';
        color: #ff9d1e;
        margin-right: #{6rpx};
    }

    .content {
        background-color: white;
        margin-top: #{180rpx};
        font-size: #{30rpx};
        color: #999;
        padding-bottom: #{50rpx};
    }

    .content-title {
        padding-left: #{24rpx};
        height: #{87rpx};
        line-height: #{87rpx};
        border-bottom: #{1rpx} solid #e2e2e2;
        color: #353535;
    }

    .content-body {
        padding: #{40rpx} #{56rpx} #{30rpx};
    }

    .content-num {
        float: left;
        height: #{80rpx};
        width: #{40rpx};
        margin-right: #{32rpx};
    }

    .content-num image {
        height: #{40rpx};
        width: #{40rpx};
    }

    .step-title {
        font-size: #{32rpx};
        color: #353535;
        margin-bottom: #{10rpx};
    }

    .join {
        position: fixed;
        bottom: 0;
        height: #{150rpx};
        width: 100%;
        background-color: white;
        padding: #{35rpx} 0;
    }

    .join-btn {
        height: #{80rpx};
        width: #{702rpx};
        font-size: #{34rpx};
        color: #fffefe;
        background: linear-gradient(to right, #ff9d1e, #ffb71e);
        border-radius: #{40rpx};
    }

    button::after {
      border: none
    }
</style>