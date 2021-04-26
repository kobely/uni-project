<template>
    <app-layout>
        <view style="height:100%;padding-bottom:0;position: absolute;width: 100%">
            <view class="page">
                <view class='dialog-bg' v-if="dialog">
                    <view class='in-bargain'>
                        <image v-if="kanjia" class='bargain-gif-bg' src='./../image/light.png'></image>
                        <image v-if="kanjia" class='bargain-gif' :src='bargainImg.app_image.activity_header'></image>
                        <image class='dialog-header' v-if="!kanjia" :src='bargainImg.app_image.header'></image>
                        <image class='dialog-header-gif-sec' :animation="animationData" v-if="!kanjia"
                               :src='bargainImg.app_image.top1'></image>
                        <view @click="dialog=false" v-if="!kanjia">
                            <image class='dialog-close' src='./../image/close.png'></image>
                        </view>
                        <view class='dialog' v-if="!kanjia">
                            <view class="self-dialog">
                                <view v-if="bargain.user_id == info.user_id">你一出手就帮自己砍掉了
                                    <text class='price'>{{info.price}}元</text>
                                </view>
                                <view v-if="bargain.user_id != info.user_id">你一出手就帮{{bargain.nickname}}</view>
                                <view v-if="bargain.user_id != info.user_id">砍了
                                    <text class='price'>{{info.price}}元</text>
                                </view>
                            </view>
                            <view v-if="bargain.user_id == info.user_id">快邀请好友帮你一起砍价吧！</view>
                            <view class="button-margin">
                            <!-- #ifdef H5 -->
                               <button @click="hShareAppMessage" open-type="share" v-if="bargain.user_id == info.user_id">
                                      <image style="margin-top: 0" :src='bargainImg.app_image.find'></image>
                               </button>
                            <!-- #endif -->
                            <!-- #ifdef MP -->
                                <button open-type="share" v-if="bargain.user_id == info.user_id">
                                      <image style="margin-top: 0" :src='bargainImg.app_image.find'></image>
                                </button>
                            <!-- #endif -->
                            </view>
                            <view v-if="bargain.user_id != info.user_id" @click="toJoin">
                                <image :src='bargainImg.app_image.join_small'></image>
                            </view>
                        </view>
                    </view>
                </view>
                <view v-if="tip" class='dialog-bg'>
                    <view class="dialog-item">
                        <view class='dialog-tip-title'>提示</view>
                        <view>{{tip}}</view>
                        <view @click="tip=''" class='close-button'>确认</view>
                    </view>
                </view>
                <view>
                    <view @click="toIndex" class='rules left-rules'>返回首页</view>
                </view>
                <view>
                    <view  @click="toRules" class='rules right-rules'>活动规则</view>
                </view>
                <view class='top-banner' :style="{'background-image': 'url(' + bargainImg.app_image.bg_pic + ')'}"></view>
                <view class='info'>
                    <image class='avatar' :src='detail.initiator_avatar'></image>
                    <view class='username'>{{detail.initiator_nickname}}</view>
                    <view>我发现一件好货，来一起砍价优惠购！</view>
                    <view class='goods'>
                        <image :src='detail.cover_pic'></image>
                        <view class='t-omit-two goods-name'>{{detail.goods_name}}</view>
                        <view class='t-omit goods-attr'>
                            <text v-for="attr in detail.select_attr_group" :key="attr.id">
                                {{attr.attr_group_name}}:{{attr.attr_name}}
                            </text>
                        </view>
                        <view class='end_time' v-if="detail.reset_time > 0">
                            <text class="date-text" v-if="dd > 0">{{dd}}</text>
                            <text v-if="dd > 0">天</text>
                            <text class="date-text">{{hh}}</text>
                            <text>:</text>
                            <text class="date-text">{{mm}}</text>
                            <text>:</text>
                            <text class="date-text">{{ss}}</text>
                            <text>后结束</text>
                        </view>
                        <view class='end_time' v-else>已结束</view>
                        <view class='price'>当前价 ￥{{detail.now_price ?detail.now_price : 0}}</view>
                    </view>
                </view>
                <view class='progress'>
                    <view class='border' v-if="detail.bargain_price_per < 5" :style="{'left':`${detail.bargain_price_per}%`}"></view>
                    <text class='begin' v-if="detail.bargain_price_per < 5">已砍{{detail.bargain_price ? detail.bargain_price : 0}}</text>
                    <text class='progress-info progressing' v-else-if="detail.bargain_price_per < 100" :style="{'left':`${detail.bargain_price_per ? detail.bargain_price_per : 0}%`}">已砍{{detail.bargain_price ? detail.bargain_price : 0}}</text>
                    <text class='progress-info over' v-else>已完成</text>
                    <view class='progress-bg'>
                        <image src='./../image/progress.png'></image>
                        <view class='line' :class="[`${detail.bargain_price < 4 ? 'small-line':''}`]" :style="{'width':`${detail.bargain_price_per ? detail.bargain_price_per : 0}%`}"></view>
                    </view>
                    <text class='before-price'>原价￥{{detail.price ? detail.price : 0}}</text>
                    <text class='after-price'>底价￥{{detail.min_price ? detail.min_price : 0}}</text>
                </view>
                <!-- 不是自己的砍价 -->
                <view class='join main-center' v-if="status == 2">
                    <view @click="toJoin">
                        <image class="join-img" :animation="sizeAnimation" :src='bargainImg.app_image.join_big'></image>
                    </view>
                </view>
                <!-- 砍价未完成 -->
                <view class='button-view main-between' v-if="detail.now_price != detail.min_price && status != 2">
                    <view @click="toBuy">
                        <image :src='bargainImg.app_image.buy_small'></image>
                    </view>
                    <!-- #ifdef H5 -->
                    <button @click="hShareAppMessage" open-type="share">
                        <image :src='bargainImg.app_image.go_on'></image>
                    </button>
                    <!-- #endif -->
                    <!-- #ifdef MP -->
                    <button open-type="share">
                        <image :src='bargainImg.app_image.go_on'></image>
                    </button>
                    <!-- #endif -->
                </view>
                <!-- 砍价完成 -->
                <view class='join main-center' v-if="detail.now_price == detail.min_price && status != 2">
                    <view @click="toBuy">
                        <image class="join-img" :animation="sizeAnimation" :src='bargainImg.app_image.buy_now'></image>
                    </view>
                </view>
                <view class="log-box"
                      :style="{background: 'linear-gradient(' + bargainImg.config.bg_color +', '+ ( bargainImg.config.bg_color_type === 'gradient' ?  bargainImg.config.bg_gradient_color:  bargainImg.config.bg_color) + ')'}">
                    <view class='log'>
                        <view class='main-center'>
                            <text class='log-line'></text>
                            <text class='log-title'>砍价记录</text>
                            <text class='log-line'></text>
                        </view>
                        <view class='log-item' v-for="item in list" :key="item.id">
                            <view class='log-user'>
                                <image :src='item.avatar'></image>
                                <text class="nickname">{{item.nickname}}</text>
                            </view>
                            <view class='log-info'>
                                <image src='./../image/down.png'></image>
                                <text>砍掉{{item.price}}元</text>
                            </view>
                        </view>
                        <view @click="lookMore" v-if="toMore">
                            <view class='look-more' v-if="more">
                                <image src='./../image/to-down.png'></image>
                                <text>查看更多</text>
                            </view>
                            <view catchtap='closeList' class='up' v-else>
                                <image src='./../image/to-up.png'></image>
                                <text>收起</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        name: "activity",
        data() {
            return {
                detail: {
                    bargain_price_per: 0
                },
                list: [],
                distance: 0,
                more: false,
                sizeAnimation: {},
                status: 1,
                animationData: '',
                kanjia: false,
                dialog: false,
                info: {},
                bargain: {},
                toMore: false,
                page: 1,
                dd: 0,
                hh:23,
                mm:59,
                ss:59,
                changeTimer: null,
                timer: null,
                tip: '',
                title: '',
                order_id: '',
                // rules: ''
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                bargainImg: state => state.mallConfig.plugin.bargain,
                mall: state => state.mallConfig.mall
            }),
        },
        // #ifdef MP
        onShareAppMessage() {
           return this.hShareAppMessage();
        },
        // #endif
        onUnload() {
            clearInterval(this.timer);
            clearInterval(this.changeTimer);
        },
        onLoad(options) { this.$commonLoad.onload(options);
            var that = this;
            that.$store.dispatch('user/info');
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.getSetting();
            let getInfo = setInterval(function () {
                if(that.userInfo) {
                    clearInterval(getInfo);
                    if (options.order_id) {
                        that.join(options.order_id);
                        that.order_id = options.order_id;
                    } else if (options.id) {
                        that.getDetail(options.id,1)
                        that.order_id = options.id;
                    } else if (options.bargain_order_id) {
                        that.order_id = options.bargain_order_id;
                        if (options.user_id == that.userInfo.options.user_id) {
                            that.getDetail(options.bargain_order_id, 1)
                        } else {
                            that.status = 2;
                            that.join(options.bargain_order_id)
                        }
                    }
                    that.changeTimer = setInterval(() => {
                        that.changeSize();
                    }, 300) 
                }
            }, 300)  
        },

        methods: {
            hShareAppMessage(s = false){
                let that = this;
                return this.$shareAppMessage({
                    title: that.title,
                    path: "/plugins/bargain/activity/activity",
                    imageUrl: that.detail.app_share_pic ? that.detail.app_share_pic : '',
                    params: {
                        user_id: that.userInfo.options.user_id,
                        bargain_order_id: that.order_id,
                    }
                },s);
            },
            toRules() {
                // uni.navigateTo({
                //     url: '/plugins/bargain/rule/rule?rules=' + this.rules
                // })
                uni.navigateTo({
                    url: `/pages/rules/index?url=${encodeURIComponent(this.$api.bargain.setting)}&key=rule`,
                });
            },

            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.bargain.setting,
                }).then(response=>{
                    if(response.code === 0) {
                        that.title = response.data.title.toString();
                        // that.rules = response.data.rule;
                        if(response.data.title.indexOf("\n") > -1) {
                            let title = response.data.title.split("\n");
                            let index = Math.floor(Math.random() * title.length);
                            that.title = title[index]
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
            join(bargain_order_id) {
                let that = this;
                that.$request({
                    url: that.$api.bargain.user_join_bargain,
                    data: {
                        bargain_order_id: bargain_order_id
                    },
                }).then(response=>{
                    if(response.code == 0) {
                        let queueId = response.data.queueId;
                        let token = response.data.token;
                        that.result(queueId, token, bargain_order_id)
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                        if (response.msg == "用户已参与本次砍价") {
                            that.getDetail(bargain_order_id, 1)
                        }
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
            result(queueId, token, bargain_order_id) {
                let that = this;
                that.$request({
                    url: that.$api.bargain.user_join_bargain_result,
                    data: {
                        queueId: queueId,
                        token: token
                    },
                }).then(response=>{
                    if(response.code == 0) {
                        if (response.data.retry == 1) {
                            setTimeout(() => {
                                that.result(queueId, token, bargain_order_id)
                            }, 1000)
                        } else {
                            that.$hideLoading();
                            that.info = response.data.info;
                            that.bargain = response.data.bargain;
                            that.bargainAnimation();
                            that.getDetail(bargain_order_id, 1)
                        }
                    }else {
                        if (response.msg == "已砍至最低价") {
                            that.tip = response.msg;
                            that.getDetail(bargain_order_id, 1)
                        }else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
            getDetail(bargain_order_id,page) {
                let that = this;
                that.$request({
                    url: that.$api.bargain.activity,
                    data: {
                        bargain_order_id: bargain_order_id,
                        page: page
                    },
                }).then(response=>{
                    setTimeout(function(){
                        that.$hideLoading();
                    },500)
                    if(response.code == 0) {
                        if (response.data.list.length > 0) {
                            that.detail = response.data;
                            if (response.data.total_people > 3) {
                                    that.toMore = true;
                                if (response.data.list.length == 3) {
                                    that.more = true;
                                }else {
                                    that.more = false;
                                }
                            }
                            that.list = that.list.concat(response.data.list);
                            if(page == 1) {
                                let reset_time = that.detail.reset_time;
                                that.timer = setInterval(() => {
                                    reset_time--;
                                    that.getTime(reset_time);
                                    if(that.reset_time == 0) {
                                        clearInterval(that.timer)
                                    }
                                }, 1000)
                            }
                        } else {
                            that.tip = '暂无更多用户'
                            that.toMore = false
                        }
                    }else {
                        uni.showModal({
                            title: '提示',
                            content: response.data.msg,
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    uni.redirectTo({
                                        url: '/pages/index/index'
                                    });
                                }
                            }
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
            getTime(time) {
                if(time > 86399) {
                    this.dd = Math.floor(time / 86400)
                    time = time - (86400*this.dd)
                }else {
                    this.dd = 0
                }
                if(time > 3599) {
                    this.hh = Math.floor(time / 3600)
                    if(this.hh < 10) {
                        this.hh = '0' + this.hh
                    }
                    time = time - (3600*this.hh)
                }else {
                    this.hh = '00'
                }
                if(time > 59) {
                    this.mm = Math.floor(time / 60)
                    if(this.mm < 10) {
                        this.mm = '0' + this.mm
                    }
                    time = time - (60*this.mm)
                }else {
                    this.mm = '00';
                }
                if(time < 60) {
                    this.ss = time;
                    if(this.ss < 10) {
                        this.ss = '0' + this.ss
                    }
                }
            },
            // 砍价动画
            bargainAnimation() {
                let that = this;
                that.kanjia = true;
                that.dialog = true;
                setTimeout(function() {
                    that.kanjia = false;
                    that.success();
                },1200)
                that.$forceUpdate();
            },
            // 查看更多
            lookMore() {
                this.page++;
                this.getDetail(this.order_id,this.page)
            },
            // 收起
            closeList() {
                this.list = this.list.slice(0,3);
                this.page = 1;
                this.more = true;
            },
            // 砍价成功
            success() {
                let that = this;
                this.dialog = true;
                var animation = uni.createAnimation({
                    duration: 500,
                    timingFunction: 'linear'
                })
                this.animation = animation;
                animation.scale(1).step().rotate(2).step().rotate(-2).step().rotate(0).step();
                this.animationData = animation.export();
            },
            // 按钮动画
            changeSize() {
                var size = uni.createAnimation({
                    duration: 1000,
                    timingFunction: 'linear'
                })
                this.size = size;
                size.scale(0.8).step().scale(1).step();
                this.sizeAnimation = size.export();
            },
            toIndex() {
                uni.reLaunch({
                    url:'/pages/index/index'
                })
            },
            toBuy() {
                const bargain = this.detail;
                const mchList = [{
                    "mch_id": 0,
                    "bargain_order_id": bargain.bargain_order_id,
                    "goods_list": [{
                        "id": bargain.goods_id,
                        "attr": [],
                        "num": 1,
                        "cart_id": 0,
                        "goods_attr_id": bargain.goods_attr_id
                    }]
                }];
                uni.navigateTo({
                    url: '/pages/order-submit/order-submit?mch_list=' +
                        JSON.stringify(mchList) +
                        '&preview_url=' + encodeURIComponent(this.$api.bargain.order_preview) +
                        '&submit_url=' + encodeURIComponent(this.$api.bargain.order_submit)
                });
            },
            
            toJoin() {
                if (this.detail.goods_id) {
                    uni.navigateTo({
                        url: '/plugins/bargain/goods/goods?goods_id=' + this.detail.goods_id,
                    }) 
                } else {
                    uni.showModal({
                        title: '提示',
                        content: '活动已结束',
                        showCancel: false,
                        success: function(res) {
                            if (res.confirm) {
                                uni.redirectTo({
                                    url: '/pages/index/index'
                                });
                            }
                        }
                    });
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .goods-attr {
        margin-top: #{6rpx};
        margin-bottom: #{16rpx};
        color: #999999;
        font-size: #{26rpx};
        width: 60%;
        text {
            margin-right: #{18rpx};
        }
    }
    .page {
        //padding-bottom: #{100rpx};
        min-height: 100%;
        padding-top: #{95rpx};
    }

    .self-dialog {
        margin-bottom: #{14rpx};
    }

    .top-banner {
        width: 100%;
        position: absolute;
        height: #{870rpx};
        z-index: 1;
        top: 0;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .rules {
        position: absolute;
        top: #{32rpx};
        height: #{40rpx};
        line-height: #{40rpx};
        width: #{136rpx};
        text-align: center;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: #{20rpx};
        font-size: 12px;
        color: #fff;
        z-index: 2;
    }

    .left-rules {
        left: #{20rpx};
    }

    .right-rules {
        right: #{20rpx};
    }

    .log-box {
        position: absolute;
        z-index: 2;
        min-height: calc(100vh - #{870rpx});
        top: #{870rpx};
        padding-top: #{20rpx};
        width: 100%;
        padding-bottom: #{100rpx};
    }
    .info {
        background-color: #fff;
        margin: 0 #{20rpx};
        position: relative;
        z-index: 2;
        border-radius: #{16rpx};
        text-align: center;
        font-size: 16px;
        color: #353535;
        padding-top: #{65rpx};
        padding-bottom: #{10rpx};
    }

    .info .avatar {
        position: absolute;
        top: #{-70rpx};
        left: 0;
        right: 0;
        width: #{118rpx};
        height: #{118rpx};
        border-radius: 50%;
        margin: 0 auto;
        border: #{1rpx} solid #fff;
    }

    .info .username {
        font-size: 14px;
        color: #999;
        margin-bottom: #{20rpx};
    }

    .goods {
        margin: #{20rpx} #{24rpx} 0;
        padding: #{24rpx} 0;
        height: #{264rpx};
        border-top: #{1rpx} solid #e2e2e2;
        text-align: left;
        font-size: 14px;
        color: #353535;
    }

    .goods image {
        height: #{216rpx};
        width: #{216rpx};
        float: left;
        display: block;
        margin-right: #{20rpx};
    }

    .goods .end_time {
        font-size: 14px;
        color: #666;
        margin-top: #{10rpx};
    }

    .end_time text {
        margin: 0 #{10rpx};
    }

    .end_time text:last-of-type {
        margin: 0 0 0 #{10rpx};
    }

    .goods .end_time .date-text {
        display: inline-block;
        color: #fff;
        height: #{46rpx};
        line-height: #{46rpx};
        text-align: center;
        width: #{46rpx};
        margin: 0;
        background-color: #666;
        border-radius: #{4rpx};
    }

    .goods .price {
        font-size: 16px;
        color: #ff5c5c;
        margin-top: #{10rpx};
    }

    .progress {
        padding-top: #{56rpx};
        height: #{180rpx};
        width: #{680rpx};
        margin: #{32rpx} auto 0;
        position: relative;
        z-index: 2;
    }

    .progress-info,.begin {
        font-size: 12px;
        color: #ff5c5c;
        padding: 0 #{20rpx};
        display: inline-block;
        border-radius: #{20rpx};
        height: #{40rpx};
        line-height: #{40rpx};
        background-color: #fff;
        position: absolute;
        z-index: 5;
        top: 0;
        left:5%;
        margin-left: #{-68rpx};
        white-space:nowrap;
    }

    .progress-info.progressing {
        margin-left: #{-68rpx};
        min-width: #{82rpx};
        white-space: nowrap;
    }

    .progress-info::after {
        content: '';
        position: absolute;
        top: #{40rpx};
        left: 50%;
        margin-left: #{-8rpx};
        border: #{8rpx} solid transparent;
        border-top-color: #fff;
    }

    .progress .border {
        position: absolute;
        top: #{40rpx};
        margin-left: #{-8rpx};
        border: #{8rpx} solid transparent;
        border-top-color: #fff;
    }

    .progress-info.over::after {
        left: 75%;
    }

    .progress-info.over {
        left:97%;
        margin-left: #{-68rpx};
        white-space:nowrap;
    }

    .progress .progress-bg {
        width: #{680rpx};
        height: #{28rpx};
        position: relative;
        z-index: 2;
    }

    .progress .progress-bg image {
        width: #{680rpx};
        height: #{28rpx};
        position: absolute;
    }

    .progress .line {
        position: absolute;
        top: #{2rpx};
        left: #{2rpx};
        height: #{24rpx};
        background-color: #ff9f9f;
        border-radius: #{12rpx};
        z-index: 5;
        max-width: #{676rpx};
    }

    .progress .line.small-line {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .before-price, .after-price {
        font-size: 12px;
        color: #fff;
        position: absolute;
        bottom: #{40rpx};
    }

    .before-price {
        left: 0;
    }

    .after-price {
        right: 0;
    }

    .button-view {
        position: relative;
        z-index: 2;
        margin: 0 #{20rpx};
    }

    .button-view button {
        height: #{82rpx};
        width: #{328rpx};
        padding: 0;
        margin: 0;
        border-radius: #{41rpx};  
    }

    .button-view image {
        height: #{82rpx};
        width: #{328rpx};
    }

    .log {
        background-color: rgba(255, 255, 255, .3);
        margin: 0 #{20rpx};
        padding: #{40rpx};
        border-radius: #{16rpx};
        position: relative;
        z-index: 2;
    }

    .log-line {
        position: absolute;
        top: #{60rpx};
        left: 50%;
        height: #{1rpx};
        width: #{160rpx};
        background-color: #fff;
    }

    .log .log-line:first-of-type {
        margin-left: #{-254rpx};
    }

    .log .log-line:last-of-type {
        margin-left: #{94rpx};
    }

    .log-title {
        color: #fff;
        font-size: 14px;
        margin: 0 #{34rpx};
    }

    .log-item {
        margin-top: #{40rpx};
        height: #{80rpx};
        line-height: #{80rpx};
        color: #fff;
    }

    .log-item .log-user {
        float: left;
        width: 50%;
    }

    .log-item .log-user image {
        height: #{80rpx};
        width: #{80rpx};
        border-radius: 50%;
        margin-right: #{24rpx};
        float: left;
    }

    .log-item .log-info {
        float: right;
        width: 50%;
        text-align: right;
    }

    .log-item .log-info text {
        float: right;
    }

    .log-item .log-info image {
        margin-top: #{15rpx};
        height: #{50rpx};
        width: #{72rpx};
        margin-right: #{16rpx};
    }

    .look-more,.up {
        margin-top: #{48rpx};
        width: 100%;
        font-size: 12px;
        color: #fff;
        text-align: center;
    }

    .look-more image,.up image {
        height: #{18rpx};
        width: #{18rpx};
        margin-right: #{16rpx};
    }

    .join {
        height: #{152rpx};
    }

    .dialog-bg {
        height: 100%;
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .dialog-header {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        margin: 0 auto;
        height: #{200rpx};
        width: #{638rpx};
        z-index: 15;
    }

    .dialog-header-gif {
        position: absolute;
        left: 0;
        right: 0;
        top: #{34rpx};
        margin: 0 auto;
        height: #{69rpx};
        width: #{132rpx};
        z-index: 20;    
    }

    .dialog-header-gif-sec {
        position: absolute;
        left: 0;
        right: 0;
        top: #{-70rpx};
        margin: 0 auto;
        height: #{276rpx};
        width: #{525rpx};
        z-index: 20;
        transform: scale(0.25);
    }


    .dialog {
        padding: #{60rpx} 0 #{48rpx};
        background-color: #fff;
        position: fixed;
        top: #{504rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
        width: #{638rpx};
        text-align: center;
        border-bottom-left-radius: #{16rpx};
        border-bottom-right-radius: #{16rpx};
    }

    .dialog image {
        margin-top: #{45rpx};
        height: #{88rpx};
        width: #{480rpx};
    }

    .button-margin {
        margin-top: #{45rpx};
    }

    .button-margin button {
        border: 0;
    }

    .dialog button {
        background-color: #fff;
    }

    .dialog .price {
        color: #ff5c5c;
        font-size: 16px;
        font-weight: blod;
    }

    .dialog-close {
        height: #{50rpx};
        width: #{50rpx};
        position: fixed;
        top: #{320rpx};
        right: #{62rpx};
        z-index: 20;
    }

    .in-bargain {
        position: fixed;
        top: #{300rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
        width: #{638rpx};
        height: #{535rpx};
        border-radius: #{16rpx};
        background-color: #fff;
    }

    .bargain-gif {
        display: block;
        position: absolute;
        top: #{147.5rpx};
        left: 0;
        right: 0;
        height: #{240rpx};
        width: #{310rpx};
        margin: 0 auto;
    }

    .bargain-gif-bg {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: #{500rpx};
        width: #{500rpx};
        margin: 0 auto;   
    }

    page {
        height: 100%;
    }

    .nickname {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        width: 65%;
    }

    .dialog-item {
        position: fixed;
        top: #{400rpx};
        left: 0;
        right: 0;
        height: #{300rpx};
        width: #{640rpx};
        margin: 0 auto;
        z-index: 21;
        background-color: #fff;
        border-radius: #{20rpx};
        text-align: center;
        font-size: #{30rpx};
    }

    .close-button {
        height: #{88rpx};
        width: #{640rpx};
        border-top: #{1rpx} solid #e2e2e2;
        line-height: #{88rpx};
        color: #ff4544;
        position: absolute;
        bottom: 0;
        left: 0;
    }

    .dialog-tip-title {
        margin: #{40rpx} auto #{35rpx};
    }

    .join-img {
        width: #{680rpx};
        height: #{110rpx};
    }

    .goods-name {
        margin-top: #{6rpx};
    }
</style>