<template>
    <app-layout>
        <view class="info dir-left-nowrap" :style="{backgroundImage: `url(${community.log})`}">
            <view class="info-item dir-top-nowrap main-center">
                <view>订单总数（笔）</view>
                <view class="num">{{detail.order_num}}</view>
            </view>
            <view class="line"></view>
            <view class="info-item dir-top-nowrap main-center">
                <view>本团收入（元）</view>
                <view class="num">{{detail.order_price}}</view>
            </view>
        </view>
        <view class="number dir-left-nowrap">
            <view class="number-item dir-top-nowrap main-center box-grow-1">
                <view>参与人数</view>
                <view class="num">{{detail.user_num}}</view>
            </view>
            <view class="number-item dir-top-nowrap main-center box-grow-1">
                <view>浏览人数</view>
                <view class="num">{{detail.log_num}}</view>
            </view>
            <view class="number-item dir-top-nowrap main-center box-grow-1">
                <view class="label">转化率</view>
                <view class="num">{{rate}}%</view>
            </view>
        </view>
        <view class="list">
            <view class="item main-between cross-center" v-for="(item,index) in detail.list" :key="index">
                <view class="dir-left-nowrap cross-center">
                    <view class="index">{{item.index}}</view>
                    <view class="avatar">
                        <image :src="item.avatar"></image>
                    </view>
                    <view class="nickname t-omit">{{item.nickname}}</view>
                </view>
                <view class="time">{{item.created_at}}</view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';

    export default {
        data() {
            return {
                id: 0,
                rate: 0,
                detail: {
                    list: [],
                    log_num: '0',
                    user_num: '0',
                    order_price: '0',
                    order_num: '0',
                },
            }
        },
        components: {
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                stock: state => state.mallConfig.__wxapp_img.stock,
                community: state => state.mallConfig.__wxapp_img.community,
                userInfo: state => state.user.info,
            })
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.id = options.id;
            this.getList();
        },
        methods: {
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.community.activity_log,
                    data: {
                        id: that.id
                    },
                    method: 'post'
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.detail = response.data;
                        for(let i in that.detail.list) {
                            that.detail.list[i].index = +i +1;
                            if(that.detail.list[i].index < 10) {
                                that.detail.list[i].index = '0' + that.detail.list[i].index
                            }
                        }
                        if(that.detail.log_num > 0) {
                            that.rate = Math.round(that.detail.user_num / that.detail.log_num * 100)
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
                    that.$hideLoading();
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .info {
        height: #{260rpx};
        background-color: #4859E8;
        color: #fff;
        font-size: #{34rpx};
        position: relative;
        background-size: 100% 100%;
        .info-item {
            width: 50%;
            height: #{260rpx};
            text-align: center;
            .num {
                font-size: #{40rpx};
                font-family: DIN;
                margin-top: #{15rpx};
            }
        }
        .line {
            width: #{2rpx};
            height: #{130rpx};
            position: absolute;
            top: #{65rpx};
            left: 50%;
            margin-left: #{-1rpx};
            z-index: 5;
            background-color: #fff;
        }
    }
    .number {
        width: #{702rpx};
        margin: #{24rpx};
        border-radius: #{16rpx};
        background-color: #fff;
        height: #{132rpx};
        .number-item {
            text-align: center;
            font-size: #{26rpx};
            color: #999;
            .num {
                font-size: #{28rpx};
                color: #353535;
                margin-top: #{10rpx};
            }
        }
    }
    .list {
        background-color: #fff;
        border-radius: #{16rpx};
        padding: 0 #{32rpx};
        margin: 0 #{24rpx} #{24rpx};
        width: #{702rpx};
        .item {
            height: #{100rpx};
            border-top: #{2rpx} solid #e2e2e2;
            padding: 0 #{18rpx};
            &:first-of-type {
                border-top: 0;
            }
            .index {
                font-size: #{26rpx};
                height: #{100rpx};
                line-height: #{100rpx};
                font-weight: 600;
                color: #3C8DF1;
                margin-right: #{24rpx};
            }
            .avatar {
                width: #{56rpx};
                height: #{56rpx};
                border-radius: 50%;
                margin-right: #{24rpx};
                image {
                    width: #{56rpx};
                    height: #{56rpx};
                    border-radius: 50%;
                }
            }
            .name {
                font-size: #{28rpx};
                height: #{100rpx};
                line-height: #{100rpx};
                color: #3b3939;
                width: #{300rpx};
            }
            .time {
                font-size: #{26rpx};
                color: #999;
            }
        }
    }
</style>