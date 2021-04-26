<template>
    <app-layout>
        <view v-if="captain.status == 1 && captain.is_delete != 1">
            <view class="user-info">
                <view class="main-between user-name">
                    <view class="cross-center">
                        <image class="avatar" :src='captain.avatar'></image>
                        <view class="t-omit">{{captain.user.nickname}}</view>
                    </view>
                    <view class="cross-center rate">
                        <text>{{setting.form && setting.form.rate?setting.form.rate:'分红比例'}}{{captain.level ? captain.level.rate: setting.bonus_rate}}%</text>
                        <view class="rate-icon" @click="toAbout">
                            <image src="/static/image/icon/question.png"></image>
                        </view>
                    </view>
                </view>
                <view class="dir-left-nowrap user-bonus">
                    <view @click="toStatics" class="user-bonus-item">
                        <view>
                            <text>{{captain.all_bonus}}</text>元
                        </view>
                        <view>{{setting.form && setting.form.total_bonus?setting.form.total_bonus:'累计分红金额'}}
                            <image class="right-arrow" src="/static/image/icon/arrow-right-white.png"></image>
                        </view>
                    </view>
                    <view class="user-bonus-item">
                        <view>
                            <text>{{captain.expect_bonus}}</text>元
                        </view>
                        <view>{{setting.form && setting.form.expect_bonus?setting.form.expect_bonus:'预计分红金额'}}</view>
                    </view>
                </view>
            </view>
            <view @click="toDetail">
                <view class="main-between bonus-item cash-bonus">
                    <view>{{setting.form && setting.form.cashd_bonus?setting.form.cashd_bonus:'已提现分红'}}</view>
                    <view class="bonus-price">
                        <text>{{captain.cash_bonus}}</text>元
                        <image src="/static/image/icon/arrow-right.png"></image>
                    </view>
                </view>
            </view>
            <view class="main-between bonus-item total-bonus">
                <view>
                    <view class="bonus-price">
                        <text>{{captain.total_bonus}}</text>元
                    </view>
                    <view>{{setting.form && setting.form.can_cash_bonus?setting.form.can_cash_bonus:'可提现分红'}}</view>
                </view>
                <view>
                    <view @click="toCash" class="cash-btn">
                        <button>提现</button>
                    </view>
                </view>
            </view>
            <view @click="toOrder">
                <view class="dir-left-nowrap cross-center bonus-item cash-bonus order-item">
                    <image class="order-icon" :src="bonusImg.order"></image>
                    <view class="main-between">
                        <view>{{setting.form && setting.form.orders?setting.form.orders:'分红订单'}}</view>
                        <image src="/static/image/icon/arrow-right.png"></image>
                    </view>
                </view>
            </view>
            <view @click="toMember">
                <view class="dir-left-nowrap cross-center bonus-item cash-bonus member-item">
                    <image :src="bonusImg.member"></image>
                    <view class="main-between">
                        <view>{{setting.form && setting.form.members?setting.form.members:'队员'}}</view>
                        <image src="/static/image/icon/arrow-right.png"></image>
                    </view>
                </view>
            </view>
        </view>
        <view v-else style="position: absolute;width: 100%;height: 100%;background-color: #fff;">
            <image load-lazy="true" class="banner" v-if="(captain.status != 1 && captain.status > -2) || captain.is_delete == 1" :src="setting.bg_url"></image>
            <view class="apply-area" v-if="toApply && captain.status != 0 && captain.is_delete != 1">
                <view class="apply">
                    <view class="apply-input" style="border-top:0">欢迎申请{{setting.form && setting.form.title ? setting.form.title : '团队分红'}}，请填写申请信息</view>
                    <view class="apply-input dir-left-nowrap">
                        <view class="label">姓名</view>
                        <input v-model="name" placeholder="请填写真实姓名" placeholder-style="color:#cdcdcd"></input>
                    </view>
                    <view class="apply-input dir-left-nowrap">
                        <view class="label">手机号</view>
                        <input v-model="mobile" type="number" placeholder="请填写手机号" placeholder-style="color:#cdcdcd"></input>
                    </view>
                    <view class="apply-input" v-if="setting.is_agreement == 1">
                        <view class="read" @click="read=!read">
                            <image src="/static/image/icon/icon-uncheck.png" v-if="read == false"></image>
                            <image class="check-red" src="/static/image/icon/icon-checkbox-checked.png" v-else></image>
                        </view>
                        我已经阅读并了解
                        <text style="color:#014c8c" @click="protocol=setting.agreement_content">《{{setting.agreement_title}}》</text>
                    </view>
                </view>
                <view @click="subscribe" class="apply-sumbit be-apply">
                    <button>申请成为队长</button>
                </view>
            </view>
            <image v-if="toApply && captain.status != 0 && captain.is_delete != 1" :style="{'height':`${height}px`}" @load="imageLoad" class="rights" :src="setting.form.bottom_bg_url"></image>
            <view v-if="wait" class="wait">
                <image :src="bonusImg.wait"></image>
                <view>谢谢您的支持，请等待审核...</view>
                <view @click="toIndex" class="apply-sumbit to-mall">
                    <button>去商城逛逛</button>
                </view>
            </view>
            <view v-if="pass && !toApply && captain.status != 1" class="wait is-pass">
                <image :src="bonusImg.success"></image>
                <view>
                    <view class="is-pass-text">您已达到成为队长条件</view>
                    <view v-if="check.all_members > -1">{{setting.form && setting.form.become_name ? setting.form.become_name : '下线'}}：{{check.condition}}人</view>
                    <view v-if="check.all_shares > -1">{{setting.form && setting.form.become_name ? setting.form.become_name : '下线分销商'}}：{{check.condition}}人</view>
                    <view v-if="check.total_money > -1">{{setting.form && setting.form.become_name ? setting.form.become_name : '累计佣金'}}：￥{{check.condition}}元</view>
                    <view v-if="check.cash_money > -1">{{setting.form && setting.form.become_name ? setting.form.become_name : '已提现佣金'}}：￥{{check.condition}}元</view>
                </view>
                <view @click="toApply=!toApply" class="apply-sumbit to-apply">
                    <button>立即申请成为队长</button>
                </view>
            </view>
            <view v-if="pass == false">
                <image class="check-img" src="./../image/check.png"></image>
                <view class="check-tip">您未达到成为队长条件</view>
                <view class="check-status" v-if="check.cash_money > -1">还差
                    <text>￥{{other}}</text>{{setting.form && setting.form.become_name ? setting.form.become_name : "已提现佣金"}}成为队长</view>
                <view class="check-status" v-if="check.total_money > -1">还差
                    <text>￥{{other}}</text>{{setting.form && setting.form.become_name ? setting.form.become_name : "累计佣金"}}成为队长</view>
                <view class="check-status" v-if="check.all_shares > -1">还差
                    <text>{{other}}</text>个{{setting.form && setting.form.become_name ? setting.form.become_name : "下线分销商"}}成为队长</view>
                <view class="check-status" v-if="check.all_members > -1">还差
                    <text>{{other}}</text>个{{setting.form && setting.form.become_name ? setting.form.become_name : "下线"}}成为队长</view>
                <view class="progress">
                    <view :style="{'width': `${rate}%`,'backgroundImage':`url(${bonusImg.progress})`}"></view>
                </view>
                <view class="main-between progress-text">
                    <view v-if="check.cash_money > -1">已有{{setting.form && setting.form.become_name ? setting.form.become_name : "已提现佣金"}}￥{{check.cash_money}}</view>
                    <view v-if="check.total_money > -1">已有{{setting.form && setting.form.become_name ? setting.form.become_name : "累计佣金"}}￥{{check.total_money}}</view>
                    <view v-if="check.all_shares > -1">已有{{setting.form && setting.form.become_name ? setting.form.become_name : "下线分销商"}}{{check.all_shares}}人</view>
                    <view v-if="check.all_members > -1">已有{{setting.form && setting.form.become_name ? setting.form.become_name : "下线"}}{{check.all_members}}人</view>
                    <view v-if="check.cash_money > -1 || check.total_money > -1">￥{{check.condition}}</view>
                    <view v-if="check.all_shares > -1|| check.all_members > -1">{{check.condition}}人</view>
                </view>
            </view>
            <view v-if="captain.status == 2 || captain.is_delete == 1" class="refuse">
                <image src="./../image/refuse.png"></image>
                <view v-if="captain.status == 2 && captain.is_delete == 0">您的申请被拒</view>
                <view v-if="captain.is_delete == 1 && captain.status == 1">您被解除队长身份</view>
                <view class="refuse-info">
                    <view>审核时间:
                        <text>{{captain.apply_at}}</text>
                    </view>
                    <view class="refuse-reason" v-if="captain.status == 2">拒绝理由:
                        <text style="word-wrap:break-word;">{{captain.reason ? captain.reason :"无"}}</text>
                    </view>
                    <view class="refuse-reason" v-if="captain.is_delete == 1 && captain.status == 1">解除理由:
                        <text style="word-wrap:break-word;">{{captain.reason ? captain.reason :"无"}}</text>
                    </view>
                    <view @click="reApply" class="apply-sumbit to-mall">
                        <button>再次申请</button>
                    </view>
                </view>
            </view>
        </view>

        <!-- 分红协议（modal模式） -->
        <view class="modal" v-if="protocol">
            <view class="protocol">
                <view class="protocol-name">{{setting.agreement_title}}</view>
                <view class="protocol-content">
                    <app-rich-text :content="protocol"></app-rich-text>
                </view>
                <view @click="protocol=null;read=true">
                    <view class="read-over">我已阅读</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import appRichText from "../../../components/basic-component/app-rich/parse.vue";

    import { mapState } from "vuex";

    export default {
        data() {
            return {
                read: false,
                toApply: false,
                name: '',
                mobile: '',
                height: 0,
                pass: null,
                check: {},
                rate: 0,
                other: 0,
                protocol: null,
                setting: '',
                template_message: [],
                wait: false,
                first: false,
                captain: {
                    status: 5
                }
            }
        },
        components: {
            "app-rich-text": appRichText
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                bonusImg: state => state.mallConfig.__wxapp_img.bonus
            })
        },
        methods: {
            toDetail() {
                uni.navigateTo({
                    url: '/plugins/bonus/cash-detail/cash-detail'
                }); 
            },

            toIndex() {
                uni.navigateTo({
                    url: '/pages/index/index'
                }); 
            },

            toCash() {
                uni.navigateTo({
                    url: '/plugins/bonus/cash/cash'
                }); 
            },

            toStatics() {
                uni.navigateTo({
                    url: '/plugins/bonus/statics/statics'
                }); 
            },

            toAbout() {
                uni.navigateTo({
                    url: '/plugins/bonus/about/about'
                }); 
            },

            toOrder() {
                uni.navigateTo({
                    url: '/plugins/bonus/order/order'
                }); 
            },

            toMember() {
                uni.navigateTo({
                    url: '/plugins/bonus/memeber/memeber'
                }); 
            },


            imageLoad: function (e) {
                var $width = e.detail.width; //获取图片真实宽度
                var $height = e.detail.height; //获取图片真实高度
                this.height = $height * (750 / $width) / 2
            },

            subscribe() {
                let that = this;
                let is_agree = 0;
                if(that.read) {
                    is_agree = 1;   
                }else {
                    uni.showToast({
                        title: '请先查看' + that.setting.agreement_title +'并同意',
                        icon: 'none',
                        duration: 1000
                    });
                    return false;
                }
                if(that.name && that.mobile) {
                    if(that.mobile.length == 11 && (/0?(1)[0-9]{10}/.test(that.mobile))) {
                        this.$subscribe(this.template_message).then(res => {
                            this.submit(is_agree);
                        }).catch(res => {
                            this.submit(is_agree);
                        });
                    }else {
                        uni.showToast({
                            title: '请输入正确的手机号码',
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }else {
                    uni.showToast({
                        title: '请完善申请信息',
                        icon: 'none',
                        duration: 1000
                    });
                }
                // this.$subscribe(this.template_message).then(res => {
                //     this.submit();
                // }).catch(res => {
                //     this.submit();
                // });
            },
            submit(is_agree) {
                let that = this;
                that.$request({
                    url: that.$api.bonus.apply,
                    data: {
                        name: that.name,
                        mobile: that.mobile,
                        is_agree: is_agree
                    },
                    method: 'post'
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        uni.showToast({
                            title: response.msg,
                            duration: 1000
                        });
                        setTimeout(function() {
                            that.getStatus();
                            that.wait = true;
                        }, 500)
                    }else {
                        if (response.msg == '请先查看团队分红申请协议并同意') {
                            response.msg = '请先查看' + that.setting.agreement_title +'并同意'
                        }
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

            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.bonus.setting,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.setting = response.data.list;
                        that.template_message = response.data.list.template_message_captain;
                        if (that.setting.form && that.setting.form.title) {
                            uni.setNavigationBarTitle({
                                title: that.setting.form.title,
                            })
                        }else {
                            uni.setNavigationBarTitle({
                                title: '团队分红',
                            })
                        }
                        if (that.setting.is_agreement == 0) {
                            that.read = true;
                        }
                        if (that.setting.bg_url == 'statics/img/app/bonus/banner.png') {
                            that.setting.bg_url = that.bonusImg.banner
                        }
                        if (that.setting.form.bottom_bg_url == 'statics/img/app/bonus/right.png') {
                            that.setting.form.bottom_bg_url = that.bonusImg.right
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

            getCheck() {
                let that = this;
                that.$request({
                    url: that.$api.bonus.index,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.check = response.data;
                        that.pass = response.data.pass;
                        if(response.data.to_apply) {
                            toApply = response.data.to_apply
                        }
                        let other;
                        let rate;
                        if (that.check.total_money > -1) {
                            other = (that.check.condition - (+that.check.total_money)).toFixed(2)
                            rate = (+that.check.total_money) / that.check.condition * 100
                        }
                        if (that.check.cash_money > -1) {
                            other = (that.check.condition - (+that.check.cash_money)).toFixed(2)
                            rate = (+that.check.cash_money) / that.check.condition * 100
                        }
                        if (that.check.all_shares > -1) {
                            other = that.check.condition - (+that.check.all_shares)
                            rate = (+that.check.all_shares) / that.check.condition * 100
                        }
                        if (that.check.all_members > -1) {
                            other = that.check.condition - (+that.check.all_members)
                            rate = (+that.check.all_members) / that.check.condition * 100
                        }
                        that.other = other;
                        that.rate = rate;
                        that.captain.status = 5;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                        if (e.data.msg == '你不是分销商') {
                        setTimeout(function(){
                                uni.redirectTo({
                                    url: '/pages/index/index'
                                })
                            },1000)
                        } else {
                            that.getSetting();
                            that.pass = true;
                            that.captain.status = 5;
                            captain.status = 5;
                        }
                    }
                }).catch(response => {
                    that.$hideLoading();
                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(()=>{
                        that.$store.dispatch('user/info');
                        that.getStatus();
                    });
                });
            },

            reApply() {
                let that = this;
                that.$request({
                    url: that.$api.bonus.clear,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.name = '';
                        that.mobile = '';
                        that.getCheck();
                        if (that.setting.become_type != 0) {
                            that.captain = {}
                        }else {
                            that.captain = {}
                            that.captain.status = 5
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

            getStatus() {
                let that = this;
                that.$request({
                    url: that.$api.bonus.status,
                }).then(response=>{
                    that.$hideLoading();
                    that.getSetting();
                    if(response.code == 0) {
                        that.wait = false;
                        that.captain = response.data.captain;
                        if (that.captain.status == 0) {
                            that.wait = true;
                        } else if (that.captain.status == -1) {
                            that.getCheck();
                        }
                        if (that.captain.status == 1) {
                            that.toApply = false
                        }
                    }else {
                        if (response.msg == '用户未申请队长') {
                            that.getCheck();
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
                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(()=>{
                        that.$store.dispatch('user/info');
                        that.getStatus();
                    });
                });
            },
        },

        onLoad() { this.$commonLoad.onload();
            this.$store.dispatch('user/info');
        },

        onReady() {
            this.getStatus();
            this.first = true;
        },

        onShow() {
            if(this.first) {
                this.pass = null;
                this.toApply = false;
                this.read = false;
                if(this.captain.status != 1) {
                    this.captain = {};
                }
                this.getStatus();
            }
        }
    }
</script>

<style scoped lang="scss">
    .banner {
        height: #{360rpx};
        width: 100%;
        display: block;
    }

    .apply {
        background-color: #fff;
        padding: 0 #{24rpx};
        margin-bottom: #{24rpx};
    }

    .apply-input {
        height: #{80rpx};
        line-height: #{80rpx};
        border-top: #{1rpx} solid #e2e2e2;
        font-size: #{28rpx};
        color: #353535;
    }

    .apply-input .label {
        width: #{126rpx};
    }

    .apply-area {
        background-color: #f7f7f7;
        padding: #{20rpx} 0 #{24rpx};
    }

    input {
        border: 0;
        width: #{560rpx};
        height: #{60rpx};
        line-height: #{60rpx};
        margin-top: #{10rpx};
    }

    .read {
        width: #{42rpx};
        height: #{80rpx};
        float: left;
        padding-top: #{24rpx};
        padding-right: #{10rpx};
    }

    .read image {
        height: #{32rpx};
        width: #{32rpx};
        display: block;
    }

    .apply-sumbit {
        margin: 0 auto;
    }

    .apply-sumbit button {
        height: #{80rpx};
        line-height: #{80rpx};
        width: #{702rpx};
        margin: 0 auto;
        border-radius: #{40rpx};
        background-color: #ff4544;
        color: #fff;
        font-size: #{32rpx};
        text-align: center;
    }

    .apply-sumbit.be-apply {
        width: #{702rpx};
    }

    .apply-sumbit.to-mall,.apply-sumbit.to-mall button {
        width: #{320rpx};
    }

    .apply-sumbit.to-apply,.apply-sumbit.to-apply button {
        width: #{440rpx};
    }

    .rights {
        width: 100%;
    }

    .wait {
        color: #666;
        font-size: #{32rpx};
        text-align: center;
    }

    .wait view {
        margin-bottom: #{68rpx};
    }

    .wait.is-pass view{
        margin-bottom: 0;
    }

    .wait.is-pass image{
        height:#{320rpx};
        width:#{420rpx};
        margin:#{40rpx} auto;
    }

    .wait.is-pass>view {
        padding-bottom: #{33rpx};
        font-size:#{28rpx};
    }

    .wait.is-pass .is-pass-text {
        font-size: #{36rpx};
        color:#353535;
    }

    .wait image {
        height: #{270rpx};
        width: #{380rpx};
        margin: #{120rpx} auto #{60rpx};
    }

    .check-img {
        height: #{160rpx};
        width: #{160rpx};
        margin: #{80rpx} auto #{40rpx};
        display: block;
    }

    .check-tip {
        font-size: #{36rpx};
        color: #353535;
        text-align: center;
        margin-bottom: #{14rpx};
    }

    .check-status {
        font-size: #{28rpx};
        color: #666;
        text-align: center;
    }

    .check-status text {
        font-size: #{40rpx};
        font-family: DIN;
        color: #ff8f17;
        margin-right: #{8rpx};
    }

    .progress {
        width: #{600rpx};
        background-color: #f0f0f0;
        border-radius: #{20rpx};
        height: #{40rpx};
        margin: #{40rpx} auto 0;
        position: relative;
    }

    .progress view {
        border-radius: #{20rpx};
        height: #{40rpx};
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
    }

    .progress-text {
        margin: #{16rpx} auto 0;
        color: #999;
        font-size: #{26rpx};
        width: #{600rpx};
    }

    .refuse image {
        height: #{160rpx};
        width: #{160rpx};
        margin: #{80rpx} auto #{40rpx};
    }

    .refuse {
        font-size: #{36rpx};
        color: #353535;
        text-align: center;
    }

    .refuse view {
        margin-bottom:#{25rpx};
    }

    .refuse-reason {
        margin:#{10rpx} 0 #{76rpx};
    }

    .refuse-info {
        font-size: #{28rpx};
        color: #999;
        border-top: #{1rpx} solid #e2e2e2;
        width: #{520rpx};
        margin: 0 auto;
        margin-bottom: 0;
        padding-top: #{30rpx};
        padding-left: #{20rpx};
        text-align: left;
    }

    .refuse-info text {
        color: #666;
    }

    .user-info {
        margin: #{24rpx};
        width: #{702rpx};
        padding: #{40rpx};
        background: linear-gradient(to bottom, #ff7757, #ff6362);
        border-radius: #{16rpx};
        font-size: #{36rpx};
        color: #fff;
    }

    .user-info .avatar {
        height: #{80rpx};
        width: #{80rpx};
        margin-right: #{28rpx};
        border-radius: 50%;
        border: #{2rpx} solid #fff;
    }

    .user-info .user-name {
        height: #{80rpx};
        line-height:#{80rpx};
        margin-bottom: #{35rpx};
    }

    .user-info .avatar+view {
        width: #{300rpx};
    }

    .rate {
        font-size:#{26rpx};
    }

    .rate image {
        height:#{28rpx};width:#{28rpx};display:block;
    }

    .rate-icon {
        height:#{28rpx};
        width:#{28rpx};
        margin-left:#{12rpx};
        display:block;
    }

    .user-bonus {
        font-size: #{24rpx};
    }

    .user-bonus .user-bonus-item {
        width: #{320rpx};
    }

    .user-bonus .user-bonus-item view:first-of-type {
        font-size: #{28rpx};
    }

    .user-bonus .user-bonus-item text {
        font-size: #{48rpx};
        font-family: DIN;
    }

    .right-arrow {
        height:#{14rpx};
        width:#{8rpx};
        margin-left:#{8rpx};
    }

    .bonus-item {
        background-color: #fff;
        font-size: #{28rpx};
        color: #999;
        border-radius: #{16rpx};
        width: #{702rpx};
        margin: 0 #{24rpx} #{16rpx};
    }

    .bonus-item.cash-bonus {
        height: #{100rpx};
        line-height: #{100rpx};
        padding: 0 #{40rpx};
    }

    .bonus-item.total-bonus {
        padding: #{32rpx} #{40rpx};
        height: #{144rpx};
    }

    .bonus-item.cash-bonus .bonus-price image {
        height:#{20rpx};
        width:#{12rpx};
        margin-left:#{16rpx};
    }

    .total-bonus .bonus-price {
        margin-bottom:#{8rpx};
        margin-top: #{-8rpx};
    }

    .bonus-price {
        color: #353535;
    }

    .bonus-price text {
        font-size: #{36rpx};
        font-family: DIN;
    }

    .cash-btn button {
        height: #{48rpx};
        width: #{96rpx};
        line-height: #{46rpx};
        border-radius: #{24rpx};
        border: #{1rpx} solid #ff4544;
        color: #ff4544;
        font-size: #{24rpx};
        text-align: center;
        margin-top: #{14rpx};
        padding: 0;
        background-color: #fff;
    }

    .cash-btn button::after {
        border: 0
    }

    .order-item {
        margin-bottom: 0;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    .order-icon {
        height:#{40rpx};
        width:#{40rpx};
        margin-right:#{32rpx};
    }

    .order-icon+view {
        width:#{590rpx};
    }

    .order-icon+view image{
        height:#{20rpx};
        width:#{12rpx};
        margin-top:#{40rpx};
    }

    .member-item {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .member-item>image {
        height:#{40rpx};
        width:#{40rpx};
        margin-right:#{32rpx};
    }

    .member-item .main-between {
        width:#{590rpx};
        border-top: #{1rpx} solid #e2e2e2;
    }

    .member-item .main-between image {
        height:#{20rpx};
        width:#{12rpx};
        margin-top:#{40rpx};
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        width: 100%;
        z-index: 99;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .protocol {
        position: relative;
        z-index: 99;
        background-color: #fff;
        width: 80%;
        border-radius: #{20rpx};
        margin: #{100rpx} auto;
    }

    .protocol-name {
        text-align: center;
        height: #{100rpx};
        line-height: #{100rpx};
        color: #666;
    }

    .protocol-content {
        padding: #{10rpx} #{20rpx};
        height: #{720rpx};
        overflow: auto;
        color: #353535;
    }

    .read-over {
        height: #{100rpx};
        text-align: center;
        line-height: #{100rpx};
        background-color: #ff4544;
        color: #fff;
        font-size: #{30rpx};
        border-bottom-right-radius: #{20rpx};
        border-bottom-left-radius: #{20rpx};
    }

    .protocol image {
        height: #{200rpx};
        width: #{200rpx};
    }.check-red {
        background: #ff4544;
         }
</style>