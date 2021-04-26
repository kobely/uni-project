<template>
    <app-layout>
        <view class='top'>
            <view class='top-item'>
                <view class='top-num'>{{count}}</view>
                <view>邀请好友总数</view>
            </view>
            <view class='line'></view>
            <view class='top-item'>
                <view class='top-num'>{{now_count}}</view>
                <view>今日邀请好友</view>
            </view>
        </view>
        <view class='list'>
            <view class='list-title'>
                <text>助力好友</text>
                <text class='title-right'>助力时间</text>
            </view>
            <view class='list-item' v-for="item in list" :key="item.id">
                <view class='user-avatar'>
                    <image :src='item.avatar'></image>
                </view>
                <view class='name'>{{item.nickname}}</view>
                <view class='time'>{{item.created_at}}</view>
            </view>
            <view class='list-item' v-if="list.length == 0">
                <view class='no-friend'>暂无助力好友</view>
            </view>
            <view class='loading' v-if="loading">正在加载中...</view>
        </view>
    </app-layout>
</template>

<script>

    export default {
        data() {
            return {
                list: [],
                count: 0,
                now_count: 0,
                page: 2,
                loading: false,
                more_list: false,
            }
        },
        methods: {
            getMore() {
                let that = this;
                that.$request({
                    url: that.$api.step.invite_list,
                    data: {
                        page: that.page
                    },
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.list = that.list.concat(response.data.list);
                        that.page++;
                        that.more_list = false;
                        if (response.data.list.length == 15) {
                            that.more_list = true;
                        }
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
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.step.invite_list,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.list = response.data.list;
                        that.count = response.data.count;
                        that.now_count = response.data.now_count;
                        that.more_list = false;
                        if (response.data.list.length == 15) {
                            that.more_list = true;
                        }
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
        onReachBottom: function () {
            if (!this.more_list) {
                this.getMore();
            }
        },
        onLoad() { this.$commonLoad.onload();
            let that = this;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.getList();
        }
    }
</script>

<style scoped lang="scss">
    .top{
        margin: #{24rpx} #{24rpx} #{20rpx};
        background-color: #fff;
        height: #{200rpx};
        position: relative;
        color: #999999;
        padding: #{50rpx} 0;
        font-size: #{24rpx};
        border-radius: #{16rpx};
    }

    .title-right{
        float: right;
    }

    .top-num{
        font-size: #{48rpx};
        color: #ff9d1e;
        font-family: 'DIN';
        margin-bottom: #{5rpx};
    }

    .line{
        position: absolute;
        top: #{50rpx};
        left: 50%;
        height: #{100rpx};
        width: #{2rpx};
        background-color: #e2e2e2;
    }

    .top-item{
        width: 50%;
        float: left;
        text-align: center;
    }

    .list{
        background-color: white;
        padding: #{32rpx} #{32rpx} #{16rpx};
        border-radius: #{16rpx};
        margin: 0 #{24rpx} #{24rpx}; 
    }

    .list-title{
        font-size: #{38rpx};
        color: #353535;
        margin-bottom: #{38rpx};
    }

    .list-item{
        padding-bottom: #{38rpx};
        height: #{88rpx};
        
    }

    .list-item .user-avatar{
        height: #{56rpx};
        width: #{56rpx};
        margin-right: #{24rpx};
        float: left;
    }

    .user-avatar image{
        height: 100%;
        width: 100%;
        border-radius: #{28rpx};
    }

    .name{
        float: left;    
        font-size: #{30rpx};
        color: #353535;
        width: #{300rpx};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: top;
        height: #{56rpx};    
        line-height: #{56rpx};
    }

    .time{
        float: right;
        font-size: #{24rpx};
        color: #999999;
        vertical-align: top;
        height: #{56rpx};    
        line-height: #{56rpx};
    }

    .no-friend{
        margin-top: #{120rpx};
        text-align: center;
    }

    .loading {
        font-size: #{24rpx};
        color: #353535;
        text-align: center;
        height: #{80rpx};
        line-height: #{80rpx};
        background-color: white;
    }
</style>