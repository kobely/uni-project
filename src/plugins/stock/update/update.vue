<template>
    <view class="app-layout">
        <app-layout>
            <view :class="success ? 'preventTouchMove' : ' '">
                <view class="user" :style="{'background-image': `url(${stock.update})`}">
                    <view class="dir-left-nowrap cross-center user-info">
                        <image :src="user.avatar"></image>
                        <view>{{user.nickname}}</view>
                    </view>
                    <view class="level">{{user.level_name}}</view>
                    <view v-if="up_type > 0" class="about main-center">
                        <view class="about-item">
                            <view class="info">{{user.level_rate}}%</view>
                            <view>{{setting.form.level_rate ? setting.form.level_rate : '分红比例'}}</view>
                        </view>
                        <view class="line"></view>
                        <view class="about-item">
                            <view class="info">{{user.condition}}
                                <text v-if="up_type == 1">人</text>
                                <text v-else-if="up_type == 4">单</text>
                                <text v-else>元</text>
                            </view>
                            <view v-if="up_type == 1">下线总人数</view>
                            <view v-if="up_type == 2">累计佣金总额</view>
                            <view v-if="up_type == 3">已提现佣金总额</view>
                            <view v-if="up_type == 4">分销订单总数</view>
                            <view v-if="up_type == 5">分销订单总金额</view>
                        </view>
                    </view>
                </view>
                <view class="cross-center" style="background-color: #ffa854;" v-if="user.is_big_rate == 1">
                    <view class="dir-top-nowrap cross-center max-area">
                        <image class="max-logo" :src="stock.max"></image>
                        <view class="max-title">恭喜</view>
                        <view>您已成为最高等级股东</view>         
                    </view>
                </view>
                <view v-else class="all-level">
                    <view class="level-item dir-left-nowrap" v-for="(item,index) in list" :key="item.id">
                        <view class="level-left">
                            <view class="can-update" v-if="item.up">可升级</view>
                            <view class="level-long">
                                <view :id="'item' + index" class="about-level" :style="{'left': `${user.condition / item.condition < 1 ? (user.condition / item.condition *100) + '%' : '100%'}`,'margin-left': `${width + 'rpx'}`}" v-if="!item.up">{{user.condition}}
                                    <text v-if="up_type == 1">人</text>
                                    <text v-else-if="up_type == 4">单</text>
                                    <text v-else>元</text>
                                </view>
                                <view class="triangle" :style="{'left': `${user.condition / item.condition < 1 ? (user.condition / item.condition *100) + '%' : '100%'}`}" v-if="!item.up"></view>
                                <view :class="[user.condition / item.condition < 0.05 ? `level-rate small` : `level-rate big`]" :style="{'width': `${user.condition / item.condition < 1 ? (user.condition / item.condition *100) + '%' : '100%'}`,'background-color':`${user.condition / item.condition < 1 ? '#ff4544': '#25bb3e'}`}"></view>
                            </view>
                            <view :class="[user.condition / item.condition < 0.75 ? user.condition / item.condition > 0.25 ? `level-condition` : `level-condition left` : `level-condition right`]" :style="{'left': `${user.condition / item.condition < 0.75 ? user.condition / item.condition > 0.25 ?  (user.condition / item.condition *100) + '%' : '25%' : '75%'}`}">
                                <text v-if="up_type == 1">下线总人数</text>
                                <text v-if="up_type == 2">累计佣金总额</text>
                                <text v-if="up_type == 3">已提现佣金总额</text>
                                <text v-if="up_type == 4">分销订单总数</text>
                                <text  v-if="up_type == 5">分销订单总金额</text>
                            </view>
                        </view>
                        <view class="level-right cross-center main-center dir-top-nowrap">
                            <view>
                                <text class="level-condition">{{item.condition}}</text>
                                <text v-if="up_type == 1">人</text>
                                <text v-else-if="up_type == 4">单</text>
                                <text v-else>元</text>
                            </view>
                            <view style="text-align: center">{{setting.form.level_rate ? setting.form.level_rate : '分红比例'}}<text class="level-rate">{{item.bonus_rate}}</text>%</view>
                            <view class="level-name t-omit">{{item.name}}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="user.is_big_rate == 0 && canUp" :class="['bottom', `${iphone_x?'iphone_x':''}`]">
                <view @click="toUpdate" class="update-btn">立即升级</view>
            </view>
            <view v-if="success" class="dialog cross-center main-center">
                <view class="dialog-content dir-top-nowrap cross-center">
                    <image :src="stock.success"></image>
                    <view>成功升级为{{up.name}}</view>
                    <view @click="getList" class="isee">我知道了</view>
                </view>
            </view>
        </app-layout>
    </view>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        data() {
            return {
                iphone_x: false,
                user: {},
                up_type: '',
                loading: false,
                canUp: false,
                up: {},
                success: false,
                page: 2,
                width: -25,
                setting: {},
                page_count: 1,
                list: []
            }
        },
        computed: {
            ...mapState({
                stock: state => state.mallConfig.__wxapp_img.stock,
                mall: state => state.mallConfig.mall,
                userInfo: state => state.user.info,
            })
        },
        methods: {
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.stock.level,
                }).then(response=>{
                    if(response.code == 0) {
                        that.user = response.data.user;
                        that.up_type = response.data.up_type;
                        let list = response.data.list;
                        that.page_count = response.data.pagination.page_count;
                        let condition = that.user.condition.toString();
                        that.width = -20 - (condition.length*5);
                        let canUp = 0;
                        that.success = false;
                        if(list.length == 0) {
                            that.$hideLoading();
                        }else {
                            for(let i in list) {
                                list[i].up = true;
                                canUp++;
                                if(+list[i].condition > +that.user.condition) {
                                    list[i].up = false;
                                    canUp--;
                                }
                                if(i == list.length-1) {
                                    setTimeout(function(){
                                        that.list = list;
                                        that.$hideLoading();
                                    },200)
                                }
                            }
                        }
                        if(canUp > 0) {
                            that.canUp = true;
                        }
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
            toUpdate() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.stock.up,
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.up = response.data;
                        this.success = true;
                        this.canUp = false;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                })
            },
            getMore() {
                if(this.loading) {
                    return false;
                }
                if(this.page > this.page_count) {
                    return false;
                }
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.loading = true;
                that.$request({
                    url: that.$api.stock.level,
                    data: {
                        page: this.page
                    }
                }).then(response=>{
                    this.loading = false;
                    if(response.code == 0) {
                        let list = response.data.list;
                        let canUp = 0;
                        if(list.length == 0) {
                            uni.hideLoading();
                        }else {
                            that.page++;
                            for(let i in list) {
                                list[i].up = true;
                                canUp++;
                                if(+list[i].condition > +that.user.condition) {
                                    list[i].up = false;
                                    canUp--;
                                }
                                if(i == list.length-1) {
                                    setTimeout(function(){
                                        that.list = that.list.concat(list);
                                        that.$forceUpdate();
                                        uni.hideLoading();
                                    },200)
                                }
                            }
                        }
                        if(canUp > 0) {
                            that.canUp = true;
                        }
                    }else {
                        uni.hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    this.loading = false;
                    uni.hideLoading();
                });
            },
            getSetting() {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.stock.setting,
                }).then(response=>{
                    that.getList();
                    if(response.code == 0) {
                        that.setting = response.data;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                    uni.hideLoading();
                });
            },
        },
        onReachBottom() {
            this.getMore();
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
            that.getSetting();
        }
    }
</script>

<style scoped lang="scss">
    .preventTouchMove{
        top: 0; 
        left: 0; 
        width: 100%;
        overflow: hidden; 
        position: fixed; 
        z-index: 0; 
    }

    .app-layout {
        background-color: #ffa854;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }
    .user {
        width: 100%;
        height: #{360rpx};
        background-size: 100% 100%;
        padding: #{40rpx};
        color: #fff;
        .user-info {
            height: #{56rpx};
            font-size: #{28rpx};
            image {
                height: #{56rpx};
                width: #{56rpx};
                border-radius: #{28rpx};
                display: block;
                margin-right: #{20rpx};
            }
        }
        .level {
            margin-top: #{16rpx};
            font-size: #{40rpx};
            text-align: center;
        }
        .about {
            font-size: #{26rpx};
            padding-top: #{54rpx};
            position: relative;
            .about-item {
                width: 50%;
                text-align: center;
                .info {
                    font-size: #{40rpx};
                    font-family: DIN;
                    margin-bottom: #{6rpx};
                }
            }
            .line {
                position: absolute;
                left: 50%;
                top: #{70rpx};
                width: #{1rpx};
                height: #{40rpx};
                opacity: 0.5;
                background-color: #fff;
                margin-left: #{-1rpx};
            }
        }
    }
    .all-level {
        background-color: #ffa854;
        padding: #{66rpx} #{24rpx} #{180rpx};
        .level-item {
            background-color: #fff;
            border-radius: #{16rpx};
            height: #{184rpx};
            width: #{702rpx};
            position: relative;
            margin-bottom: #{24rpx};
            .level-left {
                width: #{450rpx};
                padding-left: #{40rpx};
                .level-condition {
                    font-size: #{24rpx};
                    color: #999999;
                    margin-top: #{6rpx};
                    width: #{200rpx};
                    text-align: center;
                    margin-left: #{-100rpx};
                    position: relative;
                }
                .level-condition.left {
                    text-align: left;
                }
                .level-condition.right {
                    text-align: right;
                    margin-left: #{-115rpx};
                }
                .can-update {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: #{48rpx};
                    width: #{110rpx};
                    line-height: #{48rpx};
                    padding: 0 #{16rpx};
                    border-top-left-radius: #{16rpx};
                    border-top-right-radius: 0;
                    border-bottom-left-radius: 0;
                    border-bottom-right-radius: #{16rpx};
                    color: #fff;
                    font-size: #{26rpx};
                    background-color: #25bb3e;
                }
                .level-long {
                    margin-top: #{74rpx};
                    width: #{400rpx};
                    height: #{16rpx};
                    border-radius: #{8rpx};
                    background-color: #e3e3e3;
                    position: relative;
                    .level-rate {
                        background-color: #ff4544;
                        height: #{16rpx};
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                    .level-rate.big {
                        border-radius: #{8rpx};
                    }
                    .level-rate.small {
                        border-top-left-radius: #{8rpx};
                        border-bottom-left-radius: #{8rpx};
                    }
                    .about-level {
                        padding: #{2rpx} #{8rpx};
                        background-color: #ff4544;
                        color: #fff;
                        font-size: #{22rpx};
                        border-radius: #{4rpx};
                        position: absolute;
                        top: #{-50rpx};
                        white-space: nowrap;
                        z-index: 2;
                    }
                    .triangle {
                        width: 0;
                        height: 0;
                        border-left: #{24rpx} solid transparent;
                        border-right: #{24rpx} solid transparent;
                        border-top: #{24rpx} solid #ff4544;
                        position: absolute;
                        top: #{-30rpx};
                        margin-left: #{-24rpx};
                    }
                }
            }
            .level-right {
                font-size: #{24rpx};
                width: #{252rpx};
                color: #353535;
                .level-name {
                    font-size: #{28rpx};
                    color: #999999;
                    text-align: center;
                    width: 90%;
                }
                .level-rate {
                    font-family: DIN;
                    font-size: #{32rpx};
                    color: #ff4544;
                }
                .level-condition {
                    font-family: DIN;
                    font-size: #{36rpx};
                    color: #ff4544;
                }
            }
        }
    }
    .max-area {
        width: #{702rpx};
        margin: 0 auto;
        padding: #{80rpx} 0 #{75rpx};
        border-radius: #{16rpx};
        font-size: #{28rpx};
        color: #999999;
        background-color: #fff;
        .max-logo {
            height: #{300rpx};
            width: #{300rpx};
            margin-bottom: #{32rpx};
            display: block;
        }
        .max-title {
            font-size: #{40rpx};
            color: #353535;
            margin-bottom: #{6rpx};
        }
    }
    .bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        height: #{128rpx};
        background-color: #fff;
        .update-btn {
            width: #{702rpx};
            height: #{80rpx};
            line-height: #{80rpx};
            margin: #{24rpx};
            border-radius: #{40rpx};
            background-color: #ff4544;
            text-align: center;
            color: #fff;
            font-size: #{32rpx};
        }
    }
    .bottom.iphone_x {
        height: #{178rpx};
        padding-bottom: #{50rpx};
    }
    .dialog {
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,.3);
        width: 100%;
        height: 100%;
        z-index: 100;
        .dialog-content {
            width: #{504rpx};
            font-size: #{32rpx};
            color: #353535;
            background-color: #fff;
            border-bottom-left-radius: #{16rpx};
            border-bottom-right-radius: #{16rpx};
            image {
                width: #{504rpx};
                height: #{246rpx};
                display: block;
                margin-bottom: #{30rpx};
                margin-top: -20%;
            }
            .isee {
                width: #{300rpx};
                height: #{80rpx};
                line-height: #{80rpx};
                text-align: center;
                border-radius: #{40rpx};
                font-size: #{32rpx};
                color: #fff;
                background-color: #ff4544;
                margin-top: #{40rpx};
                margin-bottom: #{48rpx};
            }
        }
    }
</style>