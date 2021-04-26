<template>
    <app-layout>
        <view class='join-bg' v-if='join || success'>
            <view class='success' v-if='success'>
                <view class='content'>
                    <image src='./../image/submit.png' class='banner'></image>
                    <view class='banner-text'>恭喜您</view>
                    <image src='./../image/success.png' class='success-tip'></image>
                    <view>成功提交步数</view>
                    <view>奖金将于24点结算后自动发放</view>
                    <view class='tip'>奖金可至“我的{{setting.currency_name ? setting.currency_name : '活力币'}}”查看</view>
                    <view @click='closeTip(1)'>
                        <button class='success-btn'>我知道了</button>
                    </view>
                </view>
            </view>
            <!-- 参加成功后提示框 -->
            <view class='join-success' v-if='join'>
                <image class='join-img' src='./../image/participation.png'></image>
                <view v-if="join" @click="closeTip()" class='join-close'>
                    <image src='/static/image/icon/icon-close.png'></image>
                </view>
                <view>报名成功，记得{{open_date}}来参加哦</view>
                <button class='invite' open-type="share">邀请好友</button>
            </view>
        </view>
        <!-- 背景图 -->
        <view class='bg'>
            <image :src="setting.activity_pic.length > 0?setting.activity_pic:stepImg.app_image.activity_bg"></image>
        </view>
        <view class='icon'>
            <view style="display:inline-block" @click="toLog">
                <image src='./../image/log.png'></image>
            </view>
            <view style="display:inline-block" @click="toRules">
                <image src='./../image/rule.png'></image>
            </view>
        </view>
        <view class='dare' v-if="list[0].id > 0">
            <view class='join' v-for="item in list" :key="item.id">
                <view class='join-title'>
                    <view class='title-left'>{{item.begin_at}}期</view>
                    <view class='msg' v-if="item.date !== time">已有{{item.people_num}}人报名</view>
                    <view class='not' v-if="item.log_status == null">未参赛</view>
                    <view class='already' v-if="item.log_status != null">已参赛</view>
                </view>
                <view class='activity-name'>{{item.title}}</view>
                <view class='activity-step' v-if="item.log_status == null && item.now_time_status == true">目标{{item.step_num}}步</view>
                <view class='join-info' v-if="item.log_status != null && item.now_time_status == true">
                    <view class='target'>目标
                        <text>{{item.step_num}}</text>步，已完成
                        <text v-if="item.log_status === '0'">{{daily_real_num}}</text>
                        <text v-if="item.log_status > 0">{{item.user_total_num}}</text>步
                    </view>
                    <view v-if="item.log_status != 1">请于今日24点前，更新并提交步数</view>
                    <view v-if="item.log_status == 1">奖金将于24点后结算自动发放</view>
                    <view @click='toSubmit(item.step_num,item.id)' v-if="item.log_status == 0 && daily_real_num > item.step_num-1">
                        <button class='submit'>提交成绩</button>
                    </view>
                    <button class='submit-end' v-if="item.log_status == 1">已提交成绩</button>
                </view>
                <view class='dare-item' v-if="item.now_time_status == true">
                    <view class='item'>
                        <view class='total'>{{item.currency_num?item.currency_num:0}}</view>
                        <view>奖金池总额</view>
                    </view>
                    <view class='item'>
                        <view class='total'>{{item.award_num?item.award_num:0}}</view>
                        <view>达标人数</view>
                    </view>
                </view>
                <view v-if="item.now_time_status == false">
                    <view class='money'>{{item.currency_num?item.currency_num:0}}</view>
                    <view>奖金池总额</view>
                    <view class='info'>参与满
                        <text>{{item.step_num}}</text>步起平分奖池金额</view>
                    <view v-if="item.log_status == null" class='join-btn' @click="toJoin(item.id)">
                        <button class='join-btn'>参与比赛</button>
                    </view>
                    <button class='finish-btn' v-if="item.log_status == 0" open-type="share">已参赛，邀请好友</button>
                </view>
            </view>
            <view class='loading' v-if="loading">正在加载中...</view>
            <view :style="{'height': `${adHeight}px`}"></view>
        </view>
        <!-- 无挑战 -->
        <view class='space' v-else>
            <image src='./../image/none.png'></image>
            <view>暂无挑战赛哦</view>
            <view :style="{'height': `${adHeight}px`}"></view>
        </view>
        <view id="ad">
            <app-ad v-if="ad_data.unit_id"
                    :unit-id="ad_data.unit_id"
                    :type="ad_data.type"
                    :video-url="ad_data.video_url"
                    :pic-url="ad_data.pic_url"
                    :coupon-url="coupon_url"
                    :coupon-params="ad_data | getObje(ad_data)"
            />
        </view>
        <view class="dialog-bg cross-center" v-if="isSubmit">
            <view class="dialog">
                <view class="dialog-title">提示</view>
                <view class="main-center refund-tip">确认提交成绩？</view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click="toSubmit(0, '')">取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='submit'>确认</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import appAd from "../../../components/page-component/app-ad/app-ad"
    import {mapState} from "vuex";

    export default {
        data() {
            return {
                unit_id: '',
                list: [],
                ad: false,
                space: true,
                daily_real_num: 0,
                page: 2,
                join: false,
                isSubmit: false,
                activity_id: '',
                open_date: '',
                step_num: 0,
                over: false,
                authorize: false,
                ad_data: {},
                setting: null,
                success: false,
                adHeight: 0,
                coupon_url: this.$api.step.receive,
            }
        },
        components: {
            appAd
        },
        computed: {
            ...mapState({
                stepImg: state => state.mallConfig.plugin.step,
                userInfo: state => state.user.info,
            })
        },
        filters: {
            getObje(data, temp) {
                return {
                    id: data.id
                }
            }
        },
        methods: {
            getHeight() {
                const self = this;
                setTimeout(() => {
                    const query = uni.createSelectorQuery().in(this);
                    query.select('#ad').boundingClientRect(res => {
                        self.adHeight = res.height;
                    }).exec();
                })
            },
            toSubmit(step_num, activity_id) {
                this.step_num = step_num;
                this.activity_id = activity_id;
                this.isSubmit = !this.isSubmit;
            },

            toLog() {
                uni.navigateTo({url: '/plugins/step/log/log'});
            },

            toRules() {
                // uni.navigateTo({url: '/plugins/step/rules/rules?rule=2'});
                uni.navigateTo({
                    url: `/pages/rules/index?url=${encodeURIComponent(this.$api.step.setting)}&key=activity_rule`,
                });
            },

            toJoin(id) {
                uni.navigateTo({url: '/plugins/step/join/join?id=' + id});
            },

            // 提交成绩
            submit() {
                let that = this;
                let code, iv, encrypted_data;
                let num = that.daily_real_num;
                let activity_id = that.activity_id;
                let step_num = that.step_num;
                that.isSubmit = false;
                if (num < step_num) {
                    uni.showToast({
                        title: '成绩未达标',
                        icon: 'none',
                        duration: 1000
                    });
                } else {
                    uni.showLoading({
                        mask: true,
                        title: '提交成绩中...'
                    });
                    // #ifdef MP-WEIXIN
                    uni.login({
                        success(res) {
                            code = res.code;
                            // 获取iv和encryptedData
                            uni.getWeRunData({
                                success(res) {
                                    iv = res.iv;
                                    encrypted_data = res.encryptedData;
                                    that.$request({
                                        url: that.$api.step.activity_submit,
                                        method: 'POST',
                                        data: {
                                            encrypted_data: encrypted_data,
                                            iv: iv,
                                            code: code,
                                            activity_id: activity_id,
                                            num: num
                                        },
                                    }).then(response => {
                                        uni.hideLoading();
                                        if (response.code == 0) {
                                            that.success = true;
                                        } else {
                                            uni.showToast({
                                                title: response.msg,
                                                icon: 'none',
                                                duration: 1000
                                            });
                                        }
                                    }).catch(response  => {
                                        uni.hideLoading();
                                        uni.showToast({
                                            title: response,
                                            icon: 'none',
                                            duration: 1000
                                        });
                                    });
                                }
                            })
                        }
                    })
                    // #endif
                    // #ifdef MP-ALIPAY
                    var myDate = new Date();
                    let year = myDate.getFullYear();
                    let month = myDate.getMonth() + 1;
                    if (month >= 1 && month <= 9) {
                        month = "0" + month;
                    }
                    let now = myDate.getDate();
                    let today = year + "-" + month + "-" + now;
                    my.getRunData({
                        countDate: today,
                        success: (res) => {
                            that.$request({
                                url: that.$api.step.activity_submit,
                                data: {
                                    encrypted_data: encrypted_data,
                                    activity_id: activity_id,
                                    num: num
                                },
                                method: 'POST',
                            }).then(response => {
                                uni.hideLoading();
                                if (response.code == 0) {
                                    that.success = true;
                                } else {
                                    uni.showToast({
                                        title: response.msg,
                                        icon: 'none',
                                        duration: 1000
                                    });
                                }
                            }).catch(response  => {
                                uni.hideLoading();
                                uni.showToast({
                                    title: response,
                                    icon: 'none',
                                    duration: 1000
                                });
                            });
                        },
                        fail: (res) => {
                            uni.showModal({
                                content: res.errMsg,
                                showCancel: false,
                            });
                        },
                        complete: (res) => {
                            uni.showModal({
                                content: res.errMsg,
                                showCancel: false,
                            });
                        },
                    });
                    // #endif
                }
            },
            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.step.setting,
                }).then(response=>{
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
                });
            },
            auth() {
                let that = this;
                uni.getSetting({
                    success(res) {
                        if (res.authSetting['scope.werun'] == true) {
                            that.page = 1;
                            that.getList();
                        } else {
                            uni.authorize({
                                scope: 'scope.werun',
                                success(res) {
                                    if (res.errMsg == "authorize:ok") {
                                        // 读取数据
                                        that.page = 1;
                                        that.getList();
                                    }
                                },
                                fail(res) {
                                    that.$hideLoading();
                                    uni.showModal({
                                        title: '提示',
                                        content: '获取步数信息失败，需要授权获取步数权限',
                                        showCancel: false,
                                        confirmText: '打开授权',
                                        success(e) {
                                            if (e.confirm) {
                                                uni.openSetting({});
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    },
                    fail(res) {
                        that.authorize = true;
                        that.$hideLoading();
                    }
                })
            },
            getList() {
                let that = this;
                let code, iv, encrypted_data;
                uni.login({
                    success(res) {
                        code = res.code;
                        // #ifdef MP-WEIXIN
                        uni.getWeRunData({
                            success(res) {
                                iv = res.iv;
                                encrypted_data = res.encryptedData;
                                that.$request({
                                    url: that.$api.step.activity,
                                    method: 'POST',
                                    data: {
                                        encrypted_data: encrypted_data,
                                        iv: iv,
                                        code: code,
                                        page: that.page
                                    },
                                }).then(response => {
                                    that.$hideLoading();
                                    if (response.code == 0) {
                                        that.ad_data = response.list.ad_data;
                                        that.getHeight();
                                        that.daily_real_num = response.list.daily_real_num;
                                        let list = that.list;
                                        let activity_data = response.list.activity_data;
                                        that.page++;
                                        if(activity_data.length > 0) {
                                            if (list.length > 0) {
                                                for (let i = 0; i < list.length; i++) {
                                                    if (activity_data[0].id == list[i].id) {
                                                        return
                                                    }
                                                }
                                            }
                                            that.more = false;
                                            if (activity_data.length == 3) {
                                                that.more = true;
                                            }
                                            that.list = list.concat(activity_data);
                                        }
                                    } else {
                                        uni.showToast({
                                            title: response.msg,
                                            icon: 'none',
                                            duration: 1000
                                        });
                                    }
                                }).catch(response => {
                                    uni.showToast({
                                        title: response,
                                        icon: 'none',
                                        duration: 1000
                                    });
                                });
                            },
                            fail(res) {
                                if (res.errMsg == 'getWeRunData:fail cancel') {
                                    uni.showModal({
                                        content: '读取失败，请稍后再试',
                                        showCancel: false,
                                    });
                                } else if (res.errMsg == 'getWeRunData: fail device not support') {
                                    uni.showModal({
                                        content: '请在微信中搜索"微信运动"公众号，并点击关注',
                                        showCancel: false,
                                    });
                                } else {
                                    uni.showModal({
                                        content: res.errMsg,
                                        showCancel: false,
                                    });
                                }

                            }
                        })
                        // #endif
                        // #ifdef MP-ALIPAY
                        var myDate = new Date();
                        let year = myDate.getFullYear();
                        let month = myDate.getMonth() + 1;
                        if (month >= 1 && month <= 9) {
                            month = "0" + month;
                        }
                        let now = myDate.getDate();
                        let today = year + "-" + month + "-" + now;
                        my.getRunData({
                            countDate: today,
                            success: (res) => {
                                that.$request({
                                    url: that.$api.step.activity,
                                    method: 'POST',
                                    data: {
                                        encrypted_data: encrypted_data,
                                        page: that.page
                                    },
                                }).then(response => {
                                    that.$hideLoading();
                                    if (response.code == 0) {
                                        that.ad_data = response.list.ad_data;
                                        that.daily_real_num = response.list.daily_real_num;
                                        let list = that.list;
                                        let activity_data = response.list.activity_data;
                                        that.page++;
                                        if(activity_data.length > 0) {
                                            if (list.length > 0) {
                                                for (let i = 0; i < list.length; i++) {
                                                    if (activity_data[0].id == list[i].id) {
                                                        return
                                                    }
                                                }
                                            }
                                            that.more = false;
                                            if (activity_data.length == 3) {
                                                that.more = true;
                                            }
                                            that.list = list.concat(activity_data);
                                        }
                                    } else {
                                        uni.showToast({
                                            title: response.msg,
                                            icon: 'none',
                                            duration: 1000
                                        });
                                    }
                                }).catch(response => {
                                    uni.showToast({
                                        title: response,
                                        icon: 'none',
                                        duration: 1000
                                    });
                                });
                            },
                            fail: (res) => {
                                uni.showModal({
                                    content: res.errMsg,
                                    showCancel: false,
                                });
                            },
                            complete: (res) => {
                                uni.showModal({
                                    content: res.errMsg,
                                    showCancel: false,
                                });
                            },
                        });
                        // #endif
                    },
                    fail(res) {
                        uni.showModal({
                            content: res.errMsg,
                            showCancel: false,
                        });
                    }
                })
            },
            closeTip(status) {
                this.success = false;
                this.join = false;
                if(status == 1) {
                    this.list = [];
                    this.page = 1;
                    this.$showLoading({
                        type: 'global',
                        text: '加载中...'
                    });
                    this.getList();
                }
            },
        },
        onReachBottom() {
            if(this.more) {
                this.getList();
            }
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: '步数挑战',
                path: "/plugins/step/index/index",
                params: {
                    user_id: this.userInfo.options.user_id
                }
            });
        },
        // #endif
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.$store.dispatch('user/info');
            if (options.submit == 1) {
                that.activity_id =  options.activity_id;
                that.step_num =  options.step_num;
                that.isSubmit =  true;
            } else if (options.join == 1) {
                that.join = true
                that.open_date = options.date
            }
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.auth();
            that.getSetting();
        }
    }
</script>

<style scoped lang="scss">
    .bg {
        height: #{560rpx};
        width: 100%;
        overflow-y: hidden;
    }

    .bg image {
        width: 100%;
        height: 100%;
    }

    .icon {
        height: #{72rpx};
        width: #{200rpx};
        position: absolute;
        top: #{360rpx};
        right: #{12rpx};
    }

    .icon image {
        height: #{72rpx};
        width: #{72rpx};
        margin-right: #{28rpx};
    }

    .dare {
        width: 100%;
        position: absolute;
        top: #{450rpx};
        left: 0;
        right: 0;
    }

    .dare-info {
        width: 93.6%;
        background-color: white;
        margin: 0 #{24rpx};
        color: #999;
        font-size: #{26rpx};
        padding: #{28rpx} #{32rpx};
        border-radius: #{16rpx};
        box-shadow: 0 0 #{20rpx} rgba(0, 0, 0, 0.15);
    }

    .join-info {
        font-size: #{24rpx};
        color: #999;
        text-align: center;
        margin-top: #{12rpx};
    }

    .target {
        font-size: #{26rpx};
        color: #666666;
        margin-bottom: #{14rpx};
    }

    .target text {
        color: #ff4544;
        font-family: 'DIN';
    }

    .submit {
        height: #{78rpx};
        width: #{498rpx};
        border-radius: #{40rpx};
        background-color: #ff9d1e;
        color: #ffff;
        font-size: #{32rpx};
        margin-top: #{20rpx};
        line-height: #{78rpx};
        border: #{1rpx} solid #ff9d1e;
    }

    .submit-end {
        height: #{78rpx};
        width: #{498rpx};
        border-radius: #{40rpx};
        background-color: #ffff;
        color: #ff9d1e;
        margin-top: #{20rpx};
        font-size: #{32rpx};
        line-height: #{78rpx};
        border: #{1rpx} solid #ff9d1e;
    }

    .join-title{
        height: #{55rpx};
    }

    .title-left {
        text-align: left;
        float: left;
        width: auto;
        color: #353535;
        font-size: #{28rpx};
        overflow: hidden;
    }

    .dare-title {
        height: #{48rpx};
    }

    .not {
        float: right;
        height: #{48rpx};
        width: #{94rpx};
        line-height: #{48rpx};
        background-color: #eee;
        text-align: center;
    }

    .already {
        float: right;
        height: #{48rpx};
        width: #{94rpx};
        color: #ff9d1e;
        line-height: #{48rpx};
        background-color: #fff2e2;
        text-align: center;
    }

    .dare-item {
        width: 100%;
    }

    .item {
        display: inline-block;
        width: 36%;
        text-align: center;
        padding-top: #{20rpx};
    }

    .total {
        color: #ff9d1e;
        font-family: "DIN";
        font-size: #{50rpx};
        margin-bottom: #{16rpx};
    }

    .join {
        width: 93.6%;
        background-color: white;
        margin: 0 #{24rpx} #{20rpx};
        color: #999;
        font-size: #{26rpx};
        padding: #{30rpx} #{32rpx} #{40rpx};
        border-radius: #{16rpx};
        text-align: center;
        margin-top: #{20rpx};
        box-shadow: 0 0 #{20rpx} rgba(0, 0, 0, 0.15);
    }

    .msg {
        float: right;
    }

    .money {
        color: #ff9d1e;
        font-family: "DIN";
        font-size: #{50rpx};
        margin: #{10rpx} 0 #{10rpx};
    }

    .info {
        margin: #{36rpx} 0 #{26rpx};
    }

    .info text {
        color: #ff9d1e;
    }

    .join-btn {
        height: #{80rpx};
        line-height: #{80rpx};
        width: #{500rpx};
        font-size: 16px;
        border-radius: #{40rpx};
        background-color: #ff9d1e;
        margin: 0 auto;
        color: #ffff;
    }

    .finish-btn {
        height: #{78rpx};
        line-height: #{78rpx};
        width: #{498rpx};
        border-radius: #{40rpx};
        border: #{1rpx} solid #ff9d1e;
        background-color: #ffff;
        color: #ff9d1e;
        font-size: #{32rpx};
    }

    button::after {
        border: none;
    }

    .success {
        position: fixed;
        top: #{300rpx};
        z-index: 3;
        background-color: #e8703e;
        width: #{630rpx};
        height: #{640rpx};
        margin: 0 #{60rpx};
        border-radius: #{16rpx};
        text-align: center;
    }

    .content {
        background-color: white;
        width: #{598rpx};
        height: #{608rpx};
        margin: #{16rpx};
        font-size: #{34rpx};
        color: #9f5100;
    }

    .success-tip {
        height: #{200rpx};
        width: #{200rpx};
        margin-bottom: #{28rpx};
    }

    .banner {
        height: #{132rpx};
        width: #{548rpx};
        margin-top: #{-76rpx};
    }

    .banner-text {
        position: fixed;
        top: #{272rpx};
        width: #{598rpx};
        text-align: center;
        color: #9f5100;
        font-size: #{42rpx};
    }

    .tip {
        font-size: #{30rpx};
        color: #666;
        margin: #{30rpx} 0 #{18rpx};
    }

    .success-btn {
        font-size: #{34rpx};
        color: #ffff;
        height: #{80rpx};
        width: #{500rpx};
        border-radius: #{40rpx};
        background-color: #ff9d1e;
    }

    .space {
        width: 93.6%;
        height: #{550rpx};
        background-color: white;
        margin: 0 #{24rpx};
        color: #999;
        font-size: #{34rpx};
        padding: #{80rpx} 0 #{100rpx};
        border-radius: #{16rpx};
        text-align: center;
        position: absolute;
        top: #{450rpx};
        box-shadow: 0 0 #{20rpx} rgba(0, 0, 0, 0.15);
    }

    .no-join image {
        height: #{200rpx};
        width: #{200rpx};
        margin-bottom: #{35rpx};
    }

    .no-join {
        width: 93.6%;
        height: #{350rpx};
        background-color: white;
        margin: 0 #{24rpx};
        color: #999;
        font-size: #{34rpx};
        border-radius: #{16rpx};
        padding: #{30rpx} 0 0;
        text-align: center;
        margin-top: #{20rpx};
        box-shadow: 0 0 #{20rpx} rgba(0, 0, 0, 0.15);
    }

    .space image {
        height: #{300rpx};
        width: #{300rpx};
        margin-bottom: #{15rpx};
    }

    form {
        display: inline-block;
    }

    #ad {
        position: fixed;
        bottom: 0;
        width: 100%;
    }

    .join-bg {
        width: 100%;
        height: 100%;
        position: fixed;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 9999;
        top: 0;
        left: 0;
    }

    .join-success {
        position: fixed;
        top: #{300rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
        height: #{640rpx};
        width: #{630rpx};
        border-radius: #{16rpx};
        background-color: white;
        text-align: center;
        z-index: 9;
        padding: #{92rpx} 0 #{80rpx};
    }

    .join-success .join-close {
        width: #{28rpx};
        height: #{28rpx};
        position: absolute;
        top: #{32rpx};
        right: #{32rpx};
    }

    .join-success .join-close image {
        width: #{28rpx};
        height: #{28rpx};    
    }

    .join-img {
        height: #{260rpx};
        width: #{260rpx};
        margin-bottom: #{40rpx};
    }

    .join-success view {
        font-size: #{32rpx};
        color: #666;
    }

    .invite {
        margin-top: #{56rpx};
        height: #{80rpx};
        width: #{500rpx};
        line-height: #{80rpx};
        font-size: #{34rpx};
        color: #ff9d1e;
        border-radius: #{40rpx};
        background-color: white;
        border: #{1rpx} solid #ff9d1e;
    }

    .invite::after {
        border: 0px;
    }


    .loading{
      font-size: #{30rpx};
      color: #353535;
      text-align: center;
      height: #{80rpx};
      line-height: #{80rpx};
      background-color: #f2f2f2;
    }

    .activity-name{
        font-size: #{30rpx};
        color: #353535;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        margin-top: #{20rpx};
        margin-bottom: #{5rpx};
        padding: 0 11%;
    }

    .activity-step{
        font-size: #{26rpx};
        color: #666666;
    }

    .openSetting{
      height: #{120rpx};
      width: #{500rpx};
      line-height: #{120rpx};
      background-color: #4fd866;
      border-radius: #{30rpx};
      color: #ffff;
      font-size: #{52rpx};
      position: fixed;
      top: 50%;
      left: 50%;
      margin-left: #{-250rpx};
    }


    .over-screen{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, .3);
        z-index: 100;
    }

    .window{
        height: #{160rpx};
        line-height: #{160rpx};
        width: 84%;
        position: fixed;
        top: #{400rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
        background-color: white;
        text-align: center;
        font-size: #{32rpx};
        color: #353535;
        border-top-left-radius: #{16rpx};
        border-top-right-radius: #{16rpx};
    }

    .get-setting{
        height: #{88rpx};
        line-height: #{88rpx};
        width: 84%;
        position: fixed;
        top: #{560rpx};
        left: 0;
        right: 0;
        margin: 0 auto;    
        border-top: #{1rpx} solid #e2e2e2;
        background-color: white;
        text-align: center;
        border-bottom-left-radius: #{16rpx};
        border-bottom-right-radius: #{16rpx};
        font-size: #{32rpx};
        color: #353535;
    }

    .dialog-bg {
        background-color: rgba(0, 0, 0, .3);
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 100;
    }

    .dialog {
        width: #{620rpx};
        border-radius: #{16rpx};
        margin: 0 auto;
        background-color: #fff;
        z-index: 20;
    }

    .dialog-title {
        font-size: #{32rpx};
        color: #353535;
        width: #{620rpx};
        margin: #{32rpx} auto #{40rpx};
        text-align: center;
    }

    .refund-tip {
        font-size: #{32rpx};
        color: #353535;
        margin: #{4rpx} 0 #{45rpx};
    }

    .btn-area {
        height: #{88rpx};
        position: relative;
        border-top: #{1rpx} solid #e2e2e2;
    }

    .btn-area .line {
        height: #{32rpx};
        width: #{1rpx};
        background-color: #e2e2e2;
        position: absolute;
        top: #{28rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
    }

    .submit-btn {
        height: #{88rpx};
        line-height: #{88rpx};
        font-size: #{32rpx};
        color: #666;
        width: #{310rpx};
        text-align: center;
    }

    .submit-btn.be-submit {
        color: #446dfd;
    }
</style>