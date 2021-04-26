<template>
    <app-layout>
        <view class='top'>
            <image :src='stepImg.app_image.activity_log_bg'></image>
            <view class='total'>
                <view class='total-num'>{{info.total_currency}}</view>
                <view>总获得奖励</view>
            </view>
            <view class='data'>
                <view class='location'>
                    <view class='data-num'>{{info.total_bout}}</view>
                    <view>参赛次数</view>
                </view>
                <view class='location'>
                    <view class='data-num'>{{info.bout}}</view>
                    <view>达标次数</view>
                </view>
                <view class='location'>
                    <view class='data-num'>{{info.bout_ratio}}%</view>
                    <view>达标率</view>
                </view>
            </view>
        </view>
        <view class='log'>参赛记录</view>
        <view class='list' v-for="item in list" :key="item">
            <view class='list-title'>
                <view class='title-left'>{{item.activity.step_num}}步-<view class='title-name'>{{item.activity.title}}</view>挑战赛</view>
                <view class='loser' v-if='item.status == 0'>{{item.activity.now_time_status ? '进行中': '未开始'}}</view>
                <view class='wait' v-else-if='item.status == 1'>已达标</view>
                <view class='finish' v-else-if='item.status == 2'>已结算</view>
                <view class='finish' v-else-if='item.status == 3'>未完成</view>
                <view class='finish' v-else-if='item.status == 4'>已解散</view>
            </view>
            <view class='list-body'>
                <view class='list-num'>{{item.user_num == null ? 0 : item.user_num}}</view>
                <view>完成步数</view>
            </view>
            <view class='list-body'>
                <view class='list-num'>{{item.reward_currency}}</view>
                <view>奖励金额</view>
            </view>
        </view>
    </app-layout>
</template>

<script>

    import { mapState } from "vuex";

    export default {
        data() {
            return {
                page: 2,
                list: [],
                info: [],
                time: null,
            }
        },
        computed: {
            ...mapState({
                stepImg: state => state.mallConfig.plugin.step,
                userInfo: state => state.user.info,
            })
        },
        methods: {

            getList() {
                let that = this;
                that.$request({
                    url: that.$api.step.activity_log,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.list = response.data.list;
                        that.info = response.data.info;
                        for(let i = 0;i < list.length;i++) {
                            list[i].start = true;
                            let begin = list[i].activity.begin_at.replace("-","").replace("-","");
                            if (begin < that.data.time) {
                                list[i].start = false;
                            }
                        }
                        that.list.forEach(function(row,index){
                            row.start = true;
                            if(new Date(row.begin_at).getTime() < that.time) {
                                row.start = false;
                            }
                        })
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
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.time = new Date().getTime();
            that.getList();
        }
    }
</script>

<style scoped lang="scss">
    .top {
        height: #{408rpx};
        width: 100%;
        text-align: center;
        color: #fff;
        font-size: #{24rpx};
        position: relative;
    }

    .top image {
        height: #{408rpx};
        width: 100%;
    }

    .total {
        position: absolute;
        top: #{80rpx};
        width: 100%;
    }

    .total-num {
        font-size: #{72rpx};
        font-family: 'DIN';
        margin-bottom: #{18rpx};
    }

    .data {
        position: absolute;
        bottom: #{80rpx};
        width: 100%;
    }

    .location {
        float: left;
        width: 33.33%;
    }

    .data-num {
        font-size: #{44rpx};
        font-family: 'DIN';
        margin-bottom: #{9rpx};
    }

    .log {
        height: #{64rpx};
        color: #999;
        font-size: #{30rpx};
        padding-left: #{24rpx};
        background-color: #f7f7f7;
        line-height: #{64rpx};
    }

    .list {
        height: #{254rpx};
        width: 100%;
        background-color: white;
        color: #999;
        font-size: #{30rpx};
        padding: #{28rpx} #{24rpx};
        margin-bottom: #{20rpx};
    }

    .list-title {
        height: #{48rpx};
        width: 100%;
    }

    .title-left {
        float: left;
        color: #353535;
        font-size: #{30rpx};
        display: flex;
        width: 80%;
    }

    .wait {
        height: #{48rpx};
        width: #{94rpx};
        background-color: #feeeee;
        color: #ff4544;
        font-size: #{24rpx};
        line-height: #{48rpx};
        text-align: center;
        float: right;
    }

    .finish {
        height: #{48rpx};
        width: #{94rpx};
        background-color: #fff2e2;
        color: #ff9d1e;
        font-size: #{24rpx};
        line-height: #{48rpx};
        text-align: center;
        float: right;
    }

    .loser {
        height: #{48rpx};
        width: #{94rpx};
        background-color: #eee;
        color: #999;
        font-size: #{24rpx};
        line-height: #{48rpx};
        text-align: center;
        float: right;
    }

    .list-body {
        width: 50%;
        padding: #{40rpx} 0 #{50rpx};
        float: left;
        text-align: center;
    }

    .list-num {
        font-size: #{46rpx};
        color: #ff9d1e;
        font-family: 'DIN';
        margin-bottom: #{16rpx};
    }

    .loading {
        color: #353535;
        text-align: center;
        height: #{80rpx};
        line-height: #{80rpx};
    }

    .title-name {
        max-width: 65%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>