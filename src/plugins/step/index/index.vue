<template>
    <app-layout>
        <view @click="toDetail">
            <view class='nav'>
                <image load-lazy='true' class='yuan' src='./../image/yuan.png'></image>
                <text>我的{{setting.currency_name ? setting.currency_name : '活力币'}}<text style='color:#ff9d1e;'>{{user_data.step_currency ? user_data.step_currency : 0}}</text></text>
                <image load-lazy='true' class='to-log' src='/static/image/icon/arrow-right.png'></image>
            </view>
        </view>
        <view class='today-step'>
            <view class='rule' @click="toRules">
                <view>规则</view>
            </view>
            <view @click="toTop" class='today-top'>
                <image load-lazy='true' src='./../image/top.png'></image>
            </view>
            <view @click="toIndex" class='today-index'>
                <image load-lazy='true' src='./../image/index.png'></image>
            </view>
            <image load-lazy='true' class='step-bg' :src='stepImg.app_image.bg'></image>
            <view @click="exchange" class='step-btn'>
                <view>今日可兑步数</view>
                <view class='step-num'>{{user_data.daily_num ? user_data.daily_num : 0}}</view>
                <view>点击兑换</view>
                <view class='step-tip'>每日零点清零</view>
            </view>
            <view class='get-now' @click="refresh">
                <image load-lazy='true' src="./../image/refresh.png"></image>
                <text>同步最新步数</text>
            </view>
            <view class="invite-btn" @click="showHiddenClick">
                <view class='invite'>邀请好友获得永久步数加成</view>
            </view>
        </view>
        <view class='friend'>
            <view class='friend-left' style="line-height: 1.2">
                <view>好友</view>
                <view>助力</view>
            </view>
            <view class='friend-list'>
                <view style="display: inline-block" v-for="(item, index) in invite_list" :key="index" @click="showHiddenClick">
                    <image load-lazy='true' :src='item.avatar'></image>
                </view>
                <view class='look-more'>
                    <view @click="toFriend" style="line-height: 1.2">
                        <view>查看</view>
                        <view>更多</view>
                        <image load-lazy='true' src='/static/image/icon/arrow-right.png'></image>
                    </view>
                </view>
            </view>
            <view style='margin: #{22rpx} 0 #{6rpx};'>
                总邀请{{user_data.all_invite ? user_data.all_invite : 0}}人，今日邀请{{user_data.daily_invite_num ?
                user_data.daily_invite_num : 0}}人
            </view>
            <view>当前步数加成{{user_data.daily_ratio ? user_data.daily_ratio : 0}}%，明天步数加成{{ user_data.ratio ?
                user_data.ratio : 0}}%
            </view>
        </view>
        <!-- 流量主 -->
        <app-ad v-if="ad_data.unit_id"
                :unit-id="ad_data.unit_id"
                :type="ad_data.type"
                :video-url="ad_data.video_url"
                :pic-url="ad_data.pic_url"
                :coupon-url="coupon_url"
                :coupon-params="ad_data | getObje(ad_data)"
        />
        <view class='everyday'>
            <view class='everyday-title'>每日兑换提醒</view>
            <view>{{setting.currency_name ? setting.currency_name : '活力币'}}可兑换礼物，记得每天来看看哟~</view>
            <view @click="openMsg" class='switch'>
                <switch style="transform:scale(0.7)" @change='toSwitch' :checked="user_data.is_remind == 1"></switch>
            </view>
        </view>
        <view v-if="banner_list.length" class='banner' indicator-dots="true" autoplay="true">
            <swiper class="swiper" indicator-dots="true" autoplay="true">
                <swiper-item v-for="(item, index) in banner_list" :key="index">
                    <app-jump-button :open_type="item.open_type" :url="item.page_url" :params="item.params">
                        <image mode="aspectFill" :src="item.pic_url"></image>
                    </app-jump-button>
                </swiper-item>
            </swiper>
        </view>
        <view class='dare'>
            <view class='dare-banner'>
                <view class='dare-title'>步数挑战</view>
                <view class='dare-date' v-if='activity_data.id > 0 && activity_data.now_time_status == false'>{{activity_data.begin_at}}开始</view>
                <view class='dare-date' v-if='activity_data.id > 0 && activity_data.now_time_status == true'>{{activity_data.title}}进行中</view>
                <view @click="toDare">
                    <view class='dare-right'>
                        <text>更多</text>
                        <image load-lazy='true' src='/static/image/icon/arrow-right.png'></image>
                    </view>
                </view>
            </view>
            <view class='dare-item' v-if="activity_data.id > 0">
                <view class='item-img'>
                    <image load-lazy='true' src='./../image/dare.png'></image>
                </view>
                <view class='dare-info' v-if="activity_data.now_time_status == true && activity_data.log_status == null">
                    <view>奖金池总额</view>
                    <view class='info-num'>{{activity_data.total_currency}}</view>
                    <view>达标人数</view>
                    <view class='info-num'>{{activity_data.people_reach_num}}</view>
                </view>
                <view class='item' v-if="activity_data.now_time_status == false || activity_data.log_status > -1 ">
                    <view class='target-step'>目标步数
                        <text>{{activity_data.step_num}}</text> 步
                    </view>
                    <view v-if='activity_data.now_time_status == false'>
                        <view class='dare-gold'>挑战保证金
                            <text>{{activity_data.bail_currency}}{{setting.currency_name ? setting.currency_name : '活力币'}}</text>
                        </view>
                        <view>已有{{activity_data.people_num}}人参加</view>
                    </view>
                    <view class='target-step' v-if='activity_data.now_time_status == true'>
                        已完成<text v-if="activity_data.log_status === '0'">{{user_data.daily_real_num}}</text>
                        <text v-if="activity_data.log_status > 0">{{activity_data.user_total_num}}</text>步
                    </view>
                    <view @click="toDare(activity_data.id,activity_data.step_num)">
                        <button class='join' v-if='activity_data.log_status == 0 && activity_data.now_time_status == true && user_data.daily_real_num > activity_data.step_num-1'>提交成绩</button>
                    </view>
                    <view class='start' v-if='activity_data.log_status == 0 && activity_data.now_time_status == true'>距目标越来越近了，加油哦~</view>
                    <button class='join-over' v-if='activity_data.log_status == 0 && activity_data.now_time_status == false' open-type="share">已参赛，邀请好友</button>
                    <button class='submit-over' v-if='activity_data.log_status == 1'>已提交成绩</button>
                    <view @click="toJoin(activity_data.id)">
                        <button class='join' v-if='activity_data.log_status == null && activity_data.now_time_status == false'>立即参加</button>
                    </view>
                </view>
            </view>
            <view class='no-dare' v-else>
                <image load-lazy='true' src='./../image/none.png'></image>
                <view>暂无挑战赛哦</view>
            </view>
        </view>
        <view class='exchange-title'>
            <image load-lazy='true' src='./../image/exchange.png'></image>
            <text>免费兑换</text>
        </view>
        <view class='good-list dir-left-wrap'>
            <view class='good-item' v-for="(good,  index) in goods" :key="index" @click="toGoods(good)">
                <view class="out-dialog" v-if="good.count_stock == 0 && appSetting.is_show_stock == '1'">
                    <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                </view>
                <image class="goods-cover" load-lazy='true' :src='good.cover_pic'></image>
                <view class='good-info'>
                    <!-- #ifdef MP-ALIPAY -->
                    <view class='good-name t-omit-two' style="line-height: 1.3">{{good.name}}</view>
                    <!-- #endif -->
                    <!-- #ifndef MP-ALIPAY -->
                    <view class='good-name t-omit-two'>{{good.name}}</view>
                    <!-- #endif -->
                    <view :style="{'color': getTheme.color}" class='good-price dir-left-nowrap cross-center'>
                        <image load-lazy='true' src='./../image/detail-price.png'></image>
                        <view class="cross-bottom">{{good.min_currency}}</view>
                        <view v-if="good.max_currency > good.min_currency"  style="align-self: flex-end;font-size: #{22rpx};padding-bottom:#{2rpx};">起</view>
                        <view style="font-size: #{25rpx};">+</view>
                        <view>￥{{good.min_price}}</view>
                        <view v-if="good.max_price > good.min_price" style="align-self: flex-end;font-size: #{22rpx};padding-bottom:#{2rpx};">起</view>
                    </view>
                    <view class="main-between goods-other-info">
                        <view>￥{{good.original_price}}</view>
                        <view>仅剩{{good.count_stock}}件</view>
                    </view>
                    <button v-if="good.count_stock > 0" :style="{'background': good.buy_goods_auth ? getTheme.background_gradient_btn : '#999999','color': good.buy_goods_auth ? getTheme.main_text : ''}" class="good-exchange">立即兑换</button>
                    <button v-else class="good-exchange" style="background: #CDCDCD;color: #fff;">已售罄</button>
                </view>
            </view>
        </view>
        <view class="bg main-center" v-if="toExchange">
            <view class="dialog">
                <view>确定将
                    <text style='color: #ff4544'>{{user_data.daily_num}}</text>步兑换为
                    <text style='color: #ff4544'>{{exchangNum}}</text>{{setting.currency_name ? setting.currency_name : '活力币'}}？</view>
                <view class="dialog-btn main-between">
                    <view class="close-btn" @click="toExchange=false">取消</view>
                    <view class="line"></view>
                    <view class="submit-btn" @click="subscribe">确认</view>
                </view>
            </view>
        </view>
        <view class="share-qr-code-poster" v-if="showShare">
            <view class="app-bottom">
                <view class="app-icons dir-left-nowrap">
                    <view class="box-grow-1" @click="showHiddenClick">
                        <app-jump-button form arrangement="topCenter" open_type="share">
                            <icon class="app-icon app-share" type></icon>
                            <text class="app-text">发送给朋友</text>
                        </app-jump-button>
                    </view>
                    <view class="box-grow-1">
                        <app-form-id @click="toShare(user_data.daily_num)">
                            <view class="dir-top-wrap main-center cross-center">
                                <icon class="app-icon app-code" type></icon>
                                <text class="app-text">生成邀请海报</text>
                            </view>
                        </app-form-id>
                    </view>
                </view>
                <view class="app-button">
                    <app-form-id>
                        <view style="height: 100rpx;background-color: #ffffff;text-align: center;line-height: 100rpx;font-size: 32rpx;color: #353535;" @click="showHiddenClick"  type="general">取消</view>
                    </app-form-id>
                </view>

                <view v-if="getBoolEmpty.XBoolean" :style="{height: getBoolEmpty.emptyHeight + 'rpx',}"></view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import appAd from '../../../components/page-component/app-ad/app-ad';
    import {mapGetters, mapState} from "vuex";

    export default {
        data() {
            return {
                showShare: false,
                user_id: 0,
                share_title: '',
                setting: {},
                first: false,
                activity_data: {},
                ad_data: {},
                page: 1,
                template_remind: '',
                template_activity: '',
                banner_list: {},
                toExchange: false,
                authorize: false,
                exchangNum: 0,
                user_data: {
                    daily_num: 0
                },
                goods: [],
                loading: false,
                invite_list: [{
                        avatar: './../image/friend.png'
                    },
                    {
                        avatar: './../image/friend.png'
                    },
                    {
                        avatar: './../image/friend.png'
                    },
                    {
                        avatar: './../image/friend.png'
                    }
                ],
                coupon_url: this.$api.step.receive,
				disable: 'disable'
            }
        },
        components: {
            appAd
        },
        computed: {
            ...mapState({
                stepImg: state => state.mallConfig.plugin.step,
                appImg: state => state.mallConfig.__wxapp_img.mall,
                appSetting: state => state.mallConfig.mall.setting,
                userInfo: state => state.user.info,
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            }),
             ...mapGetters('mallConfig', {
                getVideo: 'getVideo',
                getTheme: 'getTheme'
             }), 
            ...mapGetters('iPhoneX', {
                getBoolEmpty: 'getBoolEmpty'
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
            showHiddenClick() {
                this.showShare = !this.showShare;
            },

            toIndex() {
                uni.redirectTo({
                    url: '/pages/index/index'
                });
            },

            toDetail() {
                uni.navigateTo({
                    url: '/plugins/step/detail/detail'
                });
            },

            toShare(num) {
                this.showShare = false;
                uni.navigateTo({
                    url: '/plugins/step/share/share?step=' + num
                });
            },

            toRules() {
                // uni.navigateTo({
                //     url: '/plugins/step/rules/rules?rule=1'
                // });
                uni.navigateTo({
                    url: `/pages/rules/index?url=${encodeURIComponent(this.$api.step.setting)}&key=rule`,
                });
            },

            toTop() {
                uni.navigateTo({
                    url: '/plugins/step/top/top'
                });
            },

            toFriend() {
                uni.navigateTo({
                    url: '/plugins/step/friend/friend'
                });
            },

            toDare(id,num) {
                if(id && num) {
                    uni.navigateTo({
                        url: '/plugins/step/dare/dare?submit=1&activity_id=' + id +'&step_num=' + num
                    });
                }else {
                    uni.navigateTo({
                        url: '/plugins/step/dare/dare'
                    })
                }
            },

            toJoin(id) {
                uni.navigateTo({
                    url: '/plugins/step/join/join?id=' + id
                });
            },

            toGoods(data) {
                 // #ifndef MP-BAIDU || H5
                if (data.video_url && this.getVideo == 1) {
                    uni.navigateTo({
                        url: `/pages/goods/video?goods_id=${data.goods_id}&sign=step`
                    });
                } else {
                    uni.navigateTo({
                        url: '/plugins/step/goods/goods?goods_id=' + data.goods_id
                    });
                }
                // #endif
                // #ifdef H5
                uni.navigateTo({
                    url: '/plugins/step/goods/goods?goods_id=' + data.goods_id
                });
                // #endif
                // #ifdef MP-BAIDU
                uni.navigateTo({
                    url: '/plugins/step/goods/goods?goods_id=' + data.id
                });
                // #endif

            },
            getAuth() {
                let that = this;
                uni.getSetting({
                    success(res) {
                        if (res.authSetting['scope.werun'] == true) {
                            that.page = 1;
                            that.runData();
                            that.getGoods();
                        } else {
                            uni.authorize({
                                scope: 'scope.werun',
                                success(res) {
                                    if (res.errMsg == "authorize:ok") {
                                        that.page = 1;
                                        // 读取数据
                                        that.runData();
                                        that.getGoods();
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
                    }
                })
            },
            aliAuth(today) {
                let that = this;
                let inviteList = [{
                        avatar: './../image/friend.png'
                    },
                    {
                        avatar: './../image/friend.png'
                    },
                    {
                        avatar: './../image/friend.png'
                    },
                    {
                        avatar: './../image/friend.png'
                    }
                ]
                if(that.user_id == 0 && that.userInfo) {
                    that.user_id =  that.userInfo.options.user_id;
                }
                my.getRunData({
                    countDate: today,
                    success: (res) => {
                        that.$request({
                            url: that.$api.step.index,
                            data: {
                                encrypted_data: res.response,
                                parent_id: that.user_id,
                                page: 1
                            },
                            method: 'POST',
                        }).then(response=>{
                            that.$hideLoading();
                            if (response.code == 0) {
                                that.template_remind = response.data.template_remind;
                                that.template_activity = response.data.template_activity;
                                that.activity_data = response.data.activity_data;
                                that.ad_data = response.data.ad_data;
                                that.banner_list = response.data.banner_list;
                                that.user_data = response.data.user_data;
                                that.invite_list = that.user_data.invite_list.concat(inviteList).slice(0, 4);
                                that.first = true;
                            } else {
                                uni.showToast({
                                    title: response.msg,
                                    icon: 'none',
                                    duration: 1000
                                });
                            }
                        }).catch(response  => {
                            that.$hideLoading();
                            that.$event.on(that.$const.EVENT_USER_LOGIN).then(()=>{
                                that.aliAuth(today);
                            });
                        });
                    },
                    fail: (res) => {
                        uni.showModal({
                            content: res.errMsg,
                            showCancel: false,
                        });
                    }
                });
            },

            runData() {
                let that = this;
                let code, iv, encrypted_data;
                let inviteList = [{
                        avatar: './../image/friend.png'
                    },
                    {
                        avatar: './../image/friend.png'
                    },
                    {
                        avatar: './../image/friend.png'
                    },
                    {
                        avatar: './../image/friend.png'
                    }
                ]
                uni.login({
                    success(res) {
                        if(that.user_id == 0 && that.userInfo) {
                            that.user_id =  that.userInfo.options.user_id;
                        }
                        code = res.code;
                        // 获取iv和encryptedData
                        uni.getWeRunData({
                            success(res) {
                                iv = res.iv;
                                encrypted_data = res.encryptedData;
                                that.$request({
                                    url: that.$api.step.index,
                                    data: {
                                        encrypted_data: encrypted_data,
                                        iv: iv,
                                        parent_id: that.user_id,
                                        code: code,
                                        page: 1
                                    },
                                    method: 'POST',
                                }).then(response=>{
                                    that.$hideLoading();
                                    if (response.code == 0) {
                                        that.template_remind = response.data.template_remind;
                                        that.template_activity = response.data.template_activity;
                                        that.activity_data = response.data.activity_data;
                                        that.ad_data = response.data.ad_data;
                                        that.banner_list = response.data.banner_list;
                                        that.user_data = response.data.user_data;
                                        that.invite_list = that.user_data.invite_list.concat(inviteList).slice(0, 4);
                                        that.first = true;
                                    } else {
                                        uni.showToast({
                                            title: response.msg,
                                            icon: 'none',
                                            duration: 1000
                                        });
                                    }
                                }).catch(response  => {
                                    that.$hideLoading();
                                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(()=>{
                                        that.runData();
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
                    }
                })
            },
            getGoods() {
                let that = this;
                that.$request({
                    url: that.$api.step.goods,
                    data: {
                        page: that.page
                    },
                }).then(response=>{
                    if(response.code == 0) {
                        that.goods = that.goods.concat(response.data.list);
                        that.page++;
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
            refresh() {
                this.$showLoading({
                    type: 'global',
                    text: '步数加载中...'
                });
                // #ifdef MP-WEIXIN
                this.runData();
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
                this.aliAuth(today);
                // #endif
            },
            openMsg() {
                if(this.user_data.is_remind == 0) {
                    this.$subscribe(this.template_remind);
                }
            },
            toSwitch(e) {
                let checked = 0;
                if (e.detail.value) {
                    checked = 1
                }
                let that = this;
                this.$request({
                    url: this.$api.step.remind,
                    data: {
                        is_remind: checked
                    },
                    method: 'post',
                }).then(response => {
                    if (response.code == 0) {
                        this.user_data.is_remind = checked;
                    }
                }).catch(response => {
                });
            },
            exchange() {
                let that = this;
                let convert_ratio = +that.setting.convert_ratio;
                let daily_real_num = +that.user_data.daily_real_num;
                let daily_num = +that.user_data.daily_num;
                let num = 0;
                if (convert_ratio > 0) {
                    num = (daily_num / convert_ratio).toFixed(2);
                }
                if (daily_num < 1 || num < 0.01) {
                    uni.showToast({
                        title: '可兑换步数不足',
                        icon: 'none',
                        duration: 1000
                    });
                } else {
                    that.toExchange = true;
                    that.exchangNum = num;
                    that.$forceUpdate();
                }
            },
            subscribe() {
                if(this.loading) {
                    return false;
                }
                this.loading = true;
                this.$subscribe(this.template_remind).then(res => {
                    this.exchangeSubmit();
                }).catch(res => {
                    this.exchangeSubmit();
                });
            },
            exchangeRequest(num, code, encrypted_data, iv) {
                let that = this;
                that.$request({
                    url: that.$api.step.convert,
                    data: {
                        num: num,
                        code: code,
                        encrypted_data: encrypted_data,
                        iv: iv,
                    },
                    method: 'post',
                }).then(response => {
                    that.loading = false;
                    uni.hideLoading();
                    if (response.code == 0) {
                        uni.showToast({
                            title: "兑换成功",
                            icon: 'success',
                            duration: 1000
                        });
                        setTimeout(function(){
                            // #ifdef MP-WEIXIN
                            that.runData();
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
                            that.aliAuth(today);
                            // #endif
                        },1000)
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.loading = false;
                    uni.hideLoading();
                });
            },
            exchangeSubmit() {
                let that = this;
                let num = this.user_data.daily_real_num;
                let code, iv, encrypted_data;
                that.toExchange = false;
                // #ifdef MP-ALIPAY
                var myDate = new Date();
                let year = myDate.getFullYear();
                let month = myDate.getMonth() + 1;
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                let now = myDate.getDate();
                let today = year + "-" + month + "-" + now;
                // #endif
                uni.showLoading({
                    mask: true,
                    title: '兑换中...'
                });
                uni.login({
                    success(res) {
                        code = res.code;
                        // 获取iv和encryptedData

                        // #ifndef MP-ALIPAY
                        uni.getWeRunData({
                            success(res) {
                                iv = res.iv;
                                encrypted_data = res.encryptedData;
                                that.exchangeRequest(num, code, encrypted_data, iv);
                            },
                            fail(res) {
                                that.loading = false;
                                uni.hideLoading();
                                uni.showModal({
                                    content: res.errMsg,
                                    showCancel: false,
                                });
                            }
                        })
                        // #endif
                        // #ifdef MP-ALIPAY
                        my.getRunData({
                            countDate: today,
                            success: (res) => {
                                encrypted_data = res.response;
                                that.exchangeRequest(num, code, encrypted_data, iv);
                            },
                            fail(res) {
                                that.loading = false;
                                uni.hideLoading();
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
                    },
                    fail(res) {
                        that.loading = false;
                        uni.hideLoading();
                        uni.showModal({
                            content: res.errMsg,
                            showCancel: false,
                        });
                    }
                })
            },
        },
        onReachBottom() {
            this.getGoods();
        },
        // #ifdef MP-WEIXIN
        onShareTimeline() {
          return this.$shareTimeline({
            title: this.share_title ? this.share_title : this.$children[0].navigationBarTitle,
            query: {} // 此处填写页面的参数
          });
        },
        // #endif
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
              menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            // #ifdef MP-BAIDU || MP-TOUTIAO
            uni.showModal({
                title: '提示',
                showCancel: false,
                content: '本平台暂不支持该插件',
                success: function (res) {
                    uni.redirectTo({
                        url: '/pages/index/index'
                    });
                }
            });
            return false;
            // #endif
            this.$store.dispatch('user/info');
            if(options.user_id > 0) {
                that.user_id = options.user_id;
            }
            that.$request({
                url: that.$api.step.setting,
            }).then(response=>{
                // #ifdef MP-WEIXIN
                that.getAuth();
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
                that.aliAuth(today);
                that.getGoods();
                // #endif
                if(response.code == 0) {
                    that.setting = response.data;
                    that.share_title = response.data.share_title.toString();
                    that.rules = response.data.rule;
                    if(response.data.share_title.indexOf("\n") > -1) {
                        let share_title = response.data.share_title.split("\n");
                        let index = Math.floor(Math.random() * share_title.length);
                        that.share_title = share_title[index]
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
        onShow() {
            let that = this;
            if (that.first == false) {
                return
            } else {
                // #ifdef MP-WEIXIN
                that.runData();
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
                that.aliAuth(today);
                // #endif
            }
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: this.share_title ? this.share_title : this.$children[0].navigationBarTitle,
                imageUrl: this.setting.share_pic ? this.setting.share_pic : '',
                path: "/plugins/step/index/index",
                params: {
                    user_id: this.userInfo.options.user_id
                }
            });
        }
        // #endif
    }
</script>

<style scoped lang="scss">
    .share-qr-code-poster {
        width: #{750rpx};
        height: 100%;
        position: fixed;
        z-index: 1501;
        left: 0;
        top: 0;
        background-color: rgba(153, 153, 153, 0.5);
        .loading {
            width: #{220rpx};
            height: #{220rpx};
        }
        .app-icons {
            height: #{290rpx};
            .app-text {
                font-size: #{26rpx};
                color: #353535;
            }
            > view {
                width: 50%;
                height: 100%;
                .app-icon {
                    width: #{120rpx};
                    height: #{120rpx};
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-color: white;
                    border-radius: 50%;
                    margin-top: #{60rpx};
                    margin-bottom: #{24rpx};
                }
                .app-share {
                    background-image: url('../../../static/image/icon/share.png');
                }
                .app-code {
                    background-image: url('../../../static/image/icon/code.png');
                }
                .text {
                    font-size: #{26rpx};
                    color: #353535;
                }
            }
        }
        .app-bottom {
            width: 100%;
            position: fixed;
            bottom: 0;
            left: 0;
            background-color: #f2f2f2;
            .app-icons {
                width: 100%;
                height: #{290rpx};
            }
            .app-button {
                width: 100%;
                height: #{100rpx};
                /deep/ button {
                    border-radius: 0;
                    border: none;
                }
            }
        }
        .app-center {
            width: calc(100% - #{80rpx});
            padding-top: #{100rpx};
            padding-bottom: #{77rpx};
            border-radius: #{8rpx};
            background-color: white;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .app-close {
                width: #{30rpx};
                height: #{30rpx};
                background-size: cover;
                background-repeat: no-repeat;
                background-image: url("../../../static/image/icon/close.png");
                position: absolute;
                top: #{28rpx};
                right: #{24rpx};

            }
            .app-image-iframe {
                width: #{440rpx};
                height: #{783rpx};
                position: relative;
                box-shadow: #{2rpx} #{2rpx} #{10rpx} #d9d9d9;
                .text {
                    text-align: center;
                    color: #888;
                }
            }
            .app-button {
                width: #{500rpx};
                height: #{80rpx};
                margin-top: #{38rpx};
                margin-bottom: #{24rpx};
            }
            .app-text {
                font-size: #{24rpx};
                color: #999999;
            }
        }
    }
    .app-bottom {
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: #f2f2f2;
        .app-icons {
            width: 100%;
            height: #{290rpx};
        }
        .app-button {
            width: 100%;
            height: #{100rpx};
            /deep/ button {
                border-radius: 0;
                border: none;
            }
        }
    }
    .nav {
        height: #{90rpx};
        line-height: #{90rpx};
        background-color: #fff;
        color: #353535;
        padding: 0 #{30rpx};
        font-size: #{28rpx};
    }

    .nav .yuan {
        margin-top: #{28rpx};
        height: #{34rpx};
        width: #{34rpx};
        display: block;
        float: left;
        margin-right: #{10rpx};
    }

    .nav .to-log {
        margin-top: #{34rpx};
        float: right;
        height: #{22rpx};
        width: #{12rpx};
        display: block;
    }

    .rule {
        position: absolute;
        right: 0;
        top: #{40rpx};
        color: white;
        font-size: #{24rpx};
        height: #{48rpx};
        width: #{90rpx};
        line-height: #{48rpx};
        border-top-left-radius: #{24rpx};
        border-bottom-left-radius: #{24rpx};
        background-color: rgba(0, 0, 0, 0.2);
    }

    .today-top {
        height: #{74rpx};
        width: #{74rpx};
        position: absolute;
        top: #{40rpx};
        left: #{24rpx};
    }

    .today-top image {
        height: #{74rpx};
        width: #{74rpx};
    }

    .today-index {
        height: #{74rpx};
        width: #{74rpx};
        position: absolute;
        top: #{144rpx};
        left: #{24rpx};
    }

    .today-index image {
        height: #{74rpx};
        width: #{74rpx};
    }

    .today-step {
        width: 100%;
        height: #{720rpx};
        position: relative;
        text-align: center;
    }

    .today-step .step-bg {
        width: 100%;
        height: #{720rpx};
    }

    .step-btn {
        position: absolute;
        top: #{90rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
        font-size: #{24rpx};
        color: #353535;
        height: #{294rpx};
        width: #{280rpx};
        text-align: center;
        padding: #{48rpx} 0 #{35rpx};
    }

    .step-btn:active {
        border-radius: #{140rpx};
        background-color: rgba(0, 0, 0, 0.5);
    }

    .step-num {
        font-family: DIN;
        font-size: #{64rpx};
        margin: #{8rpx} 0 #{4rpx};
    }

    .step-tip {
        font-size: #{20rpx};
        color: #999;
        margin-top: #{8rpx};
    }

    .get-now {
        position: absolute;
        top: #{400rpx};
        left: 0;
        right: 0;
        font-size: #{26rpx};
        color: #666;
    }

    .get-now image {
        height: #{24rpx};
        width: #{24rpx};
        margin-right: #{10rpx};
    }

    .invite {
        background: linear-gradient(to right, #ff9d1e, #ffb81e);
        height: #{80rpx};
        border-radius: #{40rpx};
        box-shadow: 0 0 #{20rpx} #ffb71e;
        text-shadow: 0 0 #{6rpx} #ffb81e;
        line-height: #{80rpx};
        color: white;
        width: #{500rpx};
        font-size: #{30rpx};
    }

    .invite-btn {
        position: absolute;
        top: #{452rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
        width: #{500rpx};
    }

    .friend {
        position: relative;
        z-index: 10;
        background-color: #fff;
        margin: #{-150rpx} #{24rpx} 0;
        padding: #{32rpx} #{24rpx};
        padding-left: 0;
        text-align: center;
        font-size: #{24rpx};
        color: #666;
    }

    .friend-left {
        padding: #{12rpx} 0;
        font-weight: bold;
        width: #{108rpx};
        height: #{80rpx};
        text-align: center;
        font-size: #{24rpx};
        background-color: #ffebd2;
        color: #ff9d1e;
        border-top-right-radius: #{40rpx};
        border-bottom-right-radius: #{40rpx};
        float: left;
        margin-right: #{24rpx};
    }

    .friend-list image {
        height: #{80rpx};
        width: #{80rpx};
        border-radius: 50%;
        margin: 0 #{10rpx};
    }

    .look-more {
        padding-top: #{10rpx};
        margin-top: #{4rpx};
        float: right;
        height: #{72rpx};
        width: #{120rpx};
        background-color: #f2f2f2;
        color: #999;
        font-size: #{22rpx};
        border-radius: #{36rpx};
        position: relative;
    }

    .look-more image {
        height: #{20rpx};
        width: #{10rpx};
        position: absolute;
        right: #{13rpx};
        top: #{26rpx};
    }

    .everyday {
        margin: #{20rpx} 0;
        background-color: #fff;
        padding: #{24rpx};
        font-size: #{24rpx};
        color: #999;
        position: relative;
    }

    .everyday-title {
        font-size: #{28rpx};
        color: #353535;
    }

    .switch {
        position: absolute !important;
        right: #{24rpx};
        top: #{36rpx};
    }

    .ad {
        height: #{190rpx};
        width: 100%;
        margin-top: #{20rpx};
        margin-bottom: #{20rpx};
    }

    .ad form {
        width: 100%;
        height: #{190rpx};
    }

    .ad image {
        width: 100%;
        height: #{190rpx};
    }

    .banner {
        margin-bottom: #{20rpx};
        height: #{190rpx};
    }

    .banner swiper {
        height: #{190rpx};
    }

    .banner image {
        height: #{190rpx};
        width: 100%;
    }

    .dare {
        padding: #{40rpx} 0 #{40rpx} #{32rpx};
        margin: 0 #{24rpx};
        background-color: white;
        border-radius: #{16rpx};
    }

    .dare-banner {
        color: #666;
        font-size: #{24rpx};
        height: #{40rpx};
        line-height: #{40rpx};
        margin-bottom: #{80rpx};
    }

    .dare-right {
        float: right;
        height: #{40rpx};
        line-height: #{40rpx};
        margin-right: #{32rpx};
        color: #666;
    }

    .no-dare {
        margin: #{54rpx} auto 0;
        width: #{300rpx};
        font-size: #{30rpx};
        color: #999;
        text-align: center;
        background-color: white;
    }

    .join-over {
        height: #{56rpx};
        width: #{280rpx};
        border-radius: #{28rpx};
        background-color: #fff;
        color: #ff9d1e;
        border: 1px solid #ff9d1e;
        font-size: #{26rpx};
        line-height: #{56rpx};
        margin: #{18rpx} 0 #{20rpx};
    }

    .submit-over {
        height: #{56rpx};
        width: #{210rpx};
        border-radius: #{28rpx};
        background-color: #fff;
        color: #ff9d1e;
        border: 1px solid #ff9d1e;
        font-size: #{26rpx};
        line-height: #{56rpx};
        margin: #{18rpx} 0 #{20rpx};
    }

    .no-dare image {
        height: #{300rpx};
        width: #{300rpx};
        margin-bottom: #{40rpx};
    }

    .dare-info {
        color: #999;
        font-size: #{30rpx};
        margin-top: #{-4rpx};
    }

    .info-num {
        margin: #{5rpx} 0 #{26rpx};
        font-size: #{44rpx};
        color: #ff9d1e;
    }

    .dare-date {
        float: left;
        width: auto;
    }

    .dare-title {
        font-size: #{34rpx};
        color: #353535;
        padding: 0 #{13rpx};
        border-left: #{6rpx} solid #ff9d1e;
        float: left;
    }

    .dare-banner image {
        height: #{20rpx};
        width: #{10rpx};
        margin-left: #{12rpx};
    }

    .height {
        height: #{20rpx};
    }

    .start {
        color: #666;
        font-size: #{24rpx};
        margin-top: #{30rpx};
        margin-bottom: #{30rpx};
    }

    .dare-item {
        height: #{250rpx};
        background-color: white;
    }

    .dare-item .item-img {
        margin: #{-28rpx} #{64rpx} 0 0;
        height: #{250rpx};
        width: #{250rpx};
        float: left;
    }

    .dare-item .item-img image {
        width: #{250rpx};
        height: #{250rpx};
    }

    .dare-item .item {
        color: #666;
        height: #{250rpx};
        float: left;
        width: 52.5%;
    }

    .target-step {
        color: #353535;
        height: #{56rpx};
        line-height: #{28rpx};
        font-size: #{30rpx};
        margin-bottom: #{18rpx};
    }

    .target-step text {
        font-size: #{46rpx};
        color: #ff4544;
        font-family: 'DIN';
    }

    .dare-gold {
        margin-top: #{-5rpx};
        margin-bottom: #{8rpx};
        font-size: #{26rpx};
    }

    .dare-gold text {
        color: #ff9d1e;
    }

    .join {
        height: #{56rpx};
        width: #{200rpx};
        border-radius: #{28rpx};
        background-color: #ff9d1e;
        color: #fff;
        font-size: #{26rpx};
        line-height: #{56rpx};
        margin: #{18rpx} 0 #{20rpx};
    }

    .join::after {
        border: 0;
    }

    .exchange-title {
        font-size: #{30rpx};
        color: #353535;
        margin: #{20rpx} auto #{10rpx};
        text-align: center;
        height: #{96rpx};
        background-color: white;
        position: relative;
    }

    .exchange-title image {
        width: #{320rpx};
        height: #{96rpx};
    }

    .exchange-title text {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: auto;
        height: #{96rpx};
        line-height: #{96rpx};
    }

    .good-list {
        padding-left: #{24rpx};
    }

    .good-item {
        width: #{344rpx};
        background-color: #fff;
        font-size: 14px;
        color: #353535;
        margin: #{14rpx} #{14rpx} 0 0;
        position: relative;
        display: block;
        border-radius: #{16rpx};
        position: relative;
        .out-dialog {
            width: #{344rpx};
            height: #{344rpx};
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(0,0,0,.5);
            image {
                width: #{344rpx};
                height: #{344rpx};
            }
        }
    }

    .good-item .goods-cover {
        height: #{344rpx};
        width: #{344rpx};
        display: block;
        border-top-left-radius: #{16rpx};
        border-top-right-radius: #{16rpx};
    }

    .good-info {
        padding: #{12rpx} #{24rpx} #{24rpx} #{24rpx};
        background-color: white;
        border-bottom-left-radius: #{16rpx};
        border-bottom-right-radius: #{16rpx};
    }

    .good-name {
        color: #353535;
        font-size: #{28rpx};
        height: #{72rpx};
    }

    .good-price {
        font-size: #{30rpx};
        margin: #{8rpx} 0;
    }

    .good-price image {
        height: #{30rpx};
        width: #{30rpx};
        display: block;
        margin-right: #{16rpx};
    }

    .good-exchange {
        width: #{296rpx};
        height: #{48rpx};
        border-radius: #{24rpx};
        color: white;
        font-size: #{28rpx};
        line-height: #{48rpx};
        text-align: center;
    }

    .good-exchange::after {
        border: 0;
    }

    .bg {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 500;
        padding-top: #{400rpx};
        background-color: rgba(0, 0, 0, .3)
    }

    .dialog {
        width: #{600rpx};
        height: #{250rpx};
        text-align: center;
        background-color: #fff;
        border-radius: #{16rpx};
        padding-top: #{65rpx};
        font-size: #{28rpx};
        position: relative;
    }

    .dialog-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: #{90rpx};
        line-height: #{90rpx};
        border-top: #{1rpx} solid #e2e2e2;
    }

    .line {
        height: #{90rpx};
        width: #{1rpx};
        background-color: #e2e2e2;
    }

    .submit-btn,.close-btn {
        width: 50%;
    }

    .submit-btn {
        color: #ff4544;
    }

    .goods-other-info {
        font-size: #{24rpx};
        color: #999999;
        margin-bottom: #{14rpx};
    }

    .goods-other-info>view:first-of-type {
        text-decoration: line-through;
    }
</style>
