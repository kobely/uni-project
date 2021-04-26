<template>
    <app-layout>
        <app-index v-if="detail.status == 1" :setting="setting" :detail="detail"></app-index>
        <view class="other" v-else>
            <!-- 头部图片 -->
            <view class="header">
                <image v-if="status" :src="setting.form.bg_url == 'statics/img/app/stock/banner.png' ? stock.banner : setting.form.bg_url"></image>
            </view>
            <!-- 未达成条件 -->
            <app-condition @toRead="toRead" @beRead="beRead" @submit="submit" v-if="look" v-on:update="receive" :read="read" :setting="setting" :rate="rate" :check="check"></app-condition>
            <!-- 等待审核 -->
            <view v-if="wait" class="wait">
                <image :src="bonusImg.wait"></image>
                <view>谢谢您的支持，请等待审核...</view>
                <view @click="toIndex" class="apply-sumbit to-mall">
                    <button>去商城逛逛</button>
                </view>
            </view>
            <!-- 申请页面 -->
            <view class="apply-area" v-if="beApply && !wait">
                <view class="apply">
                    <view class="apply-input" style="border-top:0">欢迎申请股东分红，请填写申请信息</view>
                    <view class="apply-input dir-left-nowrap">
                        <view class="label">姓名</view>
                        <input v-model="name" placeholder="请填写真实姓名" placeholder-style="color:#cdcdcd"></input>
                    </view>
                    <view class="apply-input dir-left-nowrap">
                        <view class="label">手机号</view>
                        <input v-model="mobile" type="number" placeholder="请填写手机号" placeholder-style="color:#cdcdcd"></input>
                    </view>
                    <view class="apply-input cross-center" v-if="setting.is_agreement == 1">
                        <view class="read" @click="beRead">
                            <image src="/static/image/icon/icon-uncheck.png" v-if="read == false"></image>
                            <image src="/static/image/icon/icon-checkbox-checked-a.png" v-else></image>
                        </view>
                        <text>已阅读并同意《</text>
                        <text class="agreement_title" @click="toRead">{{setting.agreement_title ? setting.agreement_title : '股东分红申请协议'}}</text>
                        <text>》</text>
                    </view>
                </view>
                <view @click="submit" class="apply-sumbit be-apply">
                    <button>申请成为股东</button>
                </view>
            </view>
            <view v-if="refuse || remove" class="refuse">
                <image src="../image/refuse.png"></image>
                <view v-if="refuse">您的申请被拒</view>
                <view v-if="remove">您被解除股东身份</view>
                <view class="refuse-info">
                    <view>审核时间:
                        <text>{{detail.updated_at}}</text>
                    </view>
                    <view class="refuse-reason" v-if="refuse">拒绝理由:
                        <text style="word-wrap:break-word;">{{detail.reason ? detail.reason :"无"}}</text>
                    </view>
                    <view class="refuse-reason" v-if="remove">解除理由:
                        <text style="word-wrap:break-word;">{{detail.reason ? detail.reason :"无"}}</text>
                    </view>
                    <view @click="reApply" class="apply-sumbit to-mall">
                        <button>再次申请</button>
                    </view>
                </view>
            </view>
            <!-- 底部图片 -->
            <image v-if="beApply && !wait" :style="{'height':`${height}px`}" @load="imageLoad" class="rights" :src="setting.form.bottom_bg_url == 'statics/img/app/stock/foot.png' ? stock.foot : setting.form.bottom_bg_url"></image>
        </view>
        <!-- 分红协议（modal模式） -->
        <view class="modal cross-center main-center" v-if="protocol">
            <view class="protocol">
                <view class="protocol-name t-omit">{{setting.agreement_title}}</view>
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
    import { mapState } from "vuex";
    import appIndex from '../components/app-index/app-index';
    import appCondition from '../components/app-condition/app-condition';
    import appRichText from "../../../components/basic-component/app-rich/parse.vue";

    export default {
        data() {
            return {
                detail: {
                    bonus_rate: 0
                },
                protocol: null,
                setting: {},
                name: '',
                mobile: '',
                wait: false,
                refuse: false,
                remove: false,
                read: false,
                look: false,
                beApply: false,
                rate: 0,
                template_message: [],
                height: 0,
                status: false,
                check: {}
            }
        },
        components: {
            'app-index': appIndex,
            "app-rich-text": appRichText,
            'app-condition': appCondition,
        },
        computed: {
            ...mapState({
                stock: state => state.mallConfig.__wxapp_img.stock,
                bonusImg: state => state.mallConfig.__wxapp_img.bonus,
            })
        },
        methods: {
            toRead() {
                this.protocol = this.setting.agreement_content;
            },
            reApply() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.wait = false;
                that.$request({
                    url: that.$api.stock.clear,
                    method: 'post'
                }).then(response=>{
                    if(response.code == 0) {
                        that.getDetail();
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                });
            },
            receive(e) {
                this.beApply = true;
            },
            beRead() {
                this.read = !this.read;
            },
            toIndex() {
                uni.navigateTo({
                    url: '/pages/index/index'
                }); 
            },
            imageLoad: function (e) {
                var $width = e.detail.width; //获取图片真实宽度
                var $height = e.detail.height; //获取图片真实高度
                this.height = $height * (750 / $width) / 2
            },
            submit() {
                let that = this;
                let is_agree = 0;
                if(that.read || that.setting.is_agreement == 0) {
                    is_agree = 1;   
                }else {
                    uni.showToast({
                        title: that.setting.agreement_title ? '请先查看' + that.setting.agreement_title +'申请协议并同意' : '请先查看股东分红申请协议并同意',
                        icon: 'none',
                        duration: 1000
                    });
                    return false;
                }
                if(that.setting.apply_type < 3) {
                    if( that.name && that.mobile) {
                        if(that.mobile.length == 11 && (/0?(1)[0-9]{10}/.test(that.mobile))) {
                            this.$subscribe(this.template_message).then(res => {
                                this.submitApply(is_agree);
                            }).catch(res => {
                                this.submitApply(is_agree);
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
                }else {
                    this.$subscribe(this.template_message).then(res => {
                        this.submitApply(is_agree);
                    }).catch(res => {
                        this.submitApply(is_agree);
                    });
                }
            },
            submitApply(is_agree) {
                let that = this;
                that.$request({
                    url: that.$api.stock.apply,
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
                        that.name = '';
                        that.mobile = '';
                        setTimeout(function() {
                            uni.showLoading({
                                mask: true,
                                title: '加载中...'
                            });
                            that.getStatus();
                            that.look = false;
                            if(that.setting.apply_type == 1 || that.setting.apply_type == 3) {
                                that.wait = true;
                            }
                        }, 500)
                    }else {
                        if (response.msg == '请先查看股东分红申请协议并同意') {
                            response.msg = '请先查看' + that.setting.agreement_title +'申请协议并同意'
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
            getStatus() {
                let that = this;
                that.wait = false;
                that.status = false;
                that.$request({
                    url: that.$api.stock.status,
                }).then(response=>{
                    that.status = true;
                    if(response.code == 0) {
                        that.detail = response.data.stock;
                        if(response.data.stock.name) {
                            that.name = response.data.stock.name;
                        }
                        if(response.data.stock.phone) {
                            that.mobile = response.data.stock.phone;
                        }
                        if(that.detail.status == -1) {
                            that.$hideLoading();
                            uni.hideLoading();
                            that.beApply = false;
                            that.remove = true;
                        }else if(that.detail.status == 2) {
                            that.$hideLoading();
                            uni.hideLoading();
                            that.beApply = false;
                            that.refuse = true;
                        }else if(that.detail.status == 1) {
                            that.$hideLoading();
                            uni.hideLoading();
                            that.beApply = false;
                            return false;
                        }else if(that.detail.status == 0) {
                            that.$hideLoading();
                            uni.hideLoading();
                            that.beApply = false;
                            that.wait = true;
                        }else {
                            that.getDetail();
                        }
                    }else {
                        if(response.msg == '用户未申请股东') {
                            that.getDetail();
                        }else {
                            that.$hideLoading();
                            uni.hideLoading();
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    }
                }).catch(response => {
                    that.$hideLoading();
                    uni.hideLoading();
                });
            },
            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.stock.setting,
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.setting = response.data;
                        that.template_message = response.data.template_message_stock;
                        uni.setNavigationBarTitle({
                            title: that.setting.form.title?that.setting.form.title: '股东分红',
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
                    uni.hideLoading();
                });
            },
            getDetail() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.check = {};
                that.$request({
                    url: that.$api.stock.index,
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.look = true;
                        that.refuse = false;
                        that.remove = false;
                        that.check = response.data;
                        if(that.check.all_money) {
                            that.rate = +that.check.all_money / +that.check.condition *100;
                        }else if(that.check.all_order) {
                            that.rate = +that.check.all_order / +that.check.condition *100;
                        }else if(that.check.all_money) {
                            that.rate = +that.check.all_money / +that.check.condition *100;
                        }else if(that.check.cash_money) {
                            that.rate = +that.check.cash_money / +that.check.condition *100;
                        }else if(that.check.total_money) {
                            that.rate = +that.check.total_money / +that.check.condition *100;
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                        setTimeout(function(){
                            that.toIndex();
                        },1000)
                    }
                }).catch(response => {
                    uni.hideLoading();
                });
            }
        },
        onShow() {
            let that = this;
            that.getStatus();
        },

        onLoad(options) { this.$commonLoad.onload(options);
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            if(options.name) {
                this.name = options.name
            }
            if(options.mobile) {
                this.mobile = options.mobile
            }
            this.getSetting();
        }
    }
</script>

<style scoped lang="scss">
    .other {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        .rights {
            width: 100%;
        }
        .header {
            height: #{360rpx};
            width: 100%;
            image {
                width: 100%;
                height: 100%;
            }
        }
        .apply-area {
            background-color: #f7f7f7;
            padding: #{20rpx} 0 #{24rpx};
            .apply {
                background-color: #fff;
                padding: 0 #{24rpx};
                margin-bottom: #{24rpx};
                .apply-input {
                    height: #{80rpx};
                    line-height: #{80rpx};
                    border-top: #{1rpx} solid #e2e2e2;
                    font-size: #{28rpx};
                    color: #353535;
                    .agreement_title {
                        color:#ff4544;
                        max-width: 360rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    text {
                        display: inline-block;
                    }
                    input {
                        border: 0;
                        width: #{560rpx};
                        height: #{60rpx};
                        line-height: #{60rpx};
                        margin-top: #{10rpx};
                    }
                    .label {
                        width: #{126rpx};
                    }
                    .read {
                        width: #{42rpx};
                        height: #{80rpx};
                        float: left;
                        padding-top: #{24rpx};
                        padding-right: #{10rpx};
                        image {
                            height: #{32rpx};
                            width: #{32rpx};
                            display: block;
                        }
                    }
                }
            }
        }
        .refuse {
            font-size: #{36rpx};
            color: #353535;
            text-align: center;
            background-color: #fff;
            image {
                height: #{160rpx};
                width: #{160rpx};
                margin: #{80rpx} auto #{40rpx};
            }
            view {
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
                text {
                    color: #666;
                    margin-left: #{15rpx};
                }
            }
        }
        .wait {
            color: #666;
            font-size: #{32rpx};
            text-align: center;
            view {
                margin-bottom: #{68rpx};
            }
            image {
                height: #{270rpx};
                width: #{380rpx};
                margin: #{120rpx} auto #{60rpx};
            }
        }
        .apply-sumbit {
            margin: 0 auto;
            button {
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
        .protocol {
            position: relative;
            z-index: 99;
            background-color: #fff;
            width: 80%;
            border-radius: #{20rpx};
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
            image {
                height: #{200rpx};
                width: #{200rpx};
            }
        }
    }
</style>