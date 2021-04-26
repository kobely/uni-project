<template>
    <app-layout>
        <app-tab-nav :setTop="0" :border="false" :shadow="false" :height="100" :tabList="tabList" :padding="0" :activeItem="activeTab" @click="tabStatus" :theme="getTheme"></app-tab-nav>
        <view v-if="activeTab == '0'" class="scan">
            <view>输入兑换码或者扫码兑换二维码开始兑换</view>
            <view class="scan-input">
                <input @focus="hiddenBottom=false" @blur="hiddenBottom=true" placeholder="请输入兑换码" v-model="code" type="text">
                <image v-if="!is_not_wechat" @click="scan" src="./../image/scan.png"></image>
            </view>
            <view @click="clerk" class="scan-button" :style="{'background-color': code.length > 0 ? getTheme.background : '#d6d6d6','color' : code.length > 0 ? '#fff' : '#b2b2b2'}">兑换</view>
        </view>
        <view v-if="activeTab == '1'">
            <view v-if="list.length > 0" class="item" v-for="(item,index) in list" :key="index">
                <view class="main-between cross-center status">
                    <view class="item-code" :style="{'background-color': item.status == 2 ? getTheme.background_o : '#F5F5F5','color' : item.status == 2 ? getTheme.color : '#999999'}">{{item.code}}</view>
                    <view @click="toDetail(item)" class="dir-left-nowrap cross-center item-status" :style="{'color': item.status == 2 ? getTheme.color : '#999999'}">
                        <view>{{item.status == 2 ? item.last_num + '项待领取' : '已全部领取'}}</view>
                        <i v-if="item.status == 2" :style="{'color': getTheme.color}" class="iconfont icon-right">&#xe7eb;</i>
                        <image v-else src="/static/image/icon/right.png"></image>
                    </view>
                </view>
                <view class="item-time">兑换时间：{{item.r_raffled_at}}</view>
            </view>
            <view style="padding-top: 30%" v-if="list.length == 0">
                <app-no-goods title="暂无兑换记录" :is_image="1" background="#f7f7f7"></app-no-goods>
            </view>
        </view>
        <view @click="showRule" class="use-info" :style="{'color': getTheme.color}" :class="[`${tabbarbool? 'tabbarbool':''}`]" v-if="setting.is_rules == 1 && activeTab == '0' && hiddenBottom">使用说明</view>
        <u-mask :show="dialog" :maskClickAble="false" :zoom="false">
            <view class="dialog">
                <image class="dialog-img" src="./../image/error.png"></image>
                <view class="dialog-msg">
                    <text>{{msg}}</text>
                </view>
                <view class="dialog-other">{{other}}</view>
                <view @click="dialog=false;code=''" :style="{'background-color': getTheme.background}" class="dialog-button">我知道了</view>
            </view>
        </u-mask>
        <view v-if="showRules" class="dialog-bg">
            <view class="u-rules" :animation="animationData" :style="{bottom: bottom}" :class="[`${tabbarbool? 'tabbarbool':''}`,`${iphone_x? 'iphone_x':''}`]">
                <view class="u-rules-top dir-right-nowrap">
                    <view v-if="over" @click="showRules=false;bottom='-998rpx';animationData={}" class="end-close main-center cross-center">
                        <image src="/static/image/icon/icon-close.png"></image>
                    </view>
                </view>

                <view class="u-rules-content">
                    <parse :content="setting.rules"></parse>
                </view>
            </view>
        </view>
        <view @click="toGift" v-if="setting.is_to_gift == 1 && hiddenBottom" class="jump-dialog cross-center dir-top-nowrap main-center" :class="[`${tabbarbool? 'tabbarbool':''}`]">
            <image :src="setting.to_gift_pic"></image>
            <view>礼品卡</view>
        </view>
    </app-layout>
</template>
<script>
    import appTabNav from "../../../components/basic-component/app-tab-nav/app-tab-nav.vue";
    import uMask from '../../../components/basic-component/u-mask/u-mask.vue';
    import parse from "../../../components/basic-component/app-rich/parse.vue";
    import appNoGoods from '../../../components/page-component/app-no-goods/app-no-goods.vue';
    import { mapState, mapGetters } from "vuex";

    export default {
        name: "index",
        data() {
            return {
                currentRoute: this.$platDiff.route(),
                tabbarbool: false,
                iphone_x: false,
                tabList: [
                    {id:0, name: '兑换礼品'},
                    {id:1, name: '兑换记录'}
                ],
                over: false,
                hiddenBottom: true,
                code: '',
                bottom: '-998rpx',
                activeTab: '0',
                list: [],
                setting: {},
                animationData: {},
                showRules: false,
                dialog: false,
                more: false,
                loading: false,
                is_not_wechat: false,
                msg: '',
                other: '',
                page: 1,
            };
        },
        watch: {
            tabBarNavs: {
                handler: function() {
                    this.b();
                },
                immediate: true,
            }
        },
        components: {
            "app-tab-nav": appTabNav,
            parse,
            "app-no-goods": appNoGoods,
            "u-mask": uMask
        },
        computed: {
            ...mapState({
                tabBarNavs: state => state.mallConfig.navbar.navs,
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme'
            })
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: this.$children[0].navigationBarTitle,
                path: "/plugins/exchange/index/index",
            });
        },
        // #endif
        // #ifdef MP-WEIXIN
        onShareTimeline() {
          // 分享朋友圈beta
          return this.$shareTimeline({
            title: this.$children[0].navigationBarTitle,
            query: {} // 此处填写页面的参数
          });
        },
        // #endif
        onReachBottom() {
            if(this.more) {
                this.page++;
                this.getMore();
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            // #ifdef H5
            this.is_not_wechat = !this.$jwx.isWechat();
            // #endif
            if(options.code) {
                that.code = options.code
            }
            if(options.token && options.library_id && options.created_at) {
                that.getActive(options.token, options.library_id, options.created_at)
            }
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
              menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
            uni.getSystemInfo({
                success: function (res) {
                    that.height = -res.screenHeight;
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            });
            that.$request({
                url: that.$api.exchange.setting,
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
            })
        },
        onShow() {
            if(this.activeTab == '1') {
                this.getList();
            }
        },
        methods: {
            getActive(token, library_id, created_at) {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '获取兑换码...'
                });
                that.$request({
                    url: that.$api.exchange.code,
                    data: {
                        token: token,
                        library_id: library_id,
                        created_at: created_at,
                    }
                }).then(response=>{
                    uni.hideLoading();
                    this.loading = false;
                    if(response.code == 0) {
                        this.code = response.data.code
                    }else {
                        this.msg = response.msg;
                        this.other = '';
                        this.dialog = true;
                    }
                }).catch(response => {
                    uni.hideLoading();
                });
            },
            b() {
                // #ifndef H5
                let currentRoute = this.currentRoute;
                for (let i = 0; i < this.tabBarNavs.length; i++) {
                    if(currentRoute.includes(this.tabBarNavs[i].url.split('?')[0])) {
                        return this.tabbarbool = true;
                    }
                }
                // #endif
                return  this.tabbarbool = false;
            },
            showRule() {
                let that = this;
                that.over = false;
                that.showRules = true;
                var animation = uni.createAnimation({
                    duration: 1000,
                    timingFunction: 'ease',
                })
                that.animationData = animation
                setTimeout(function(){
                    let num = 0;
                    if(that.tabbarbool) {
                        num += 55
                    }
                    animation.bottom(-500).bottom(num).step()
                    that.animationData = animation.export();
                    setTimeout(function(){
                        that.bottom = num *2 + 'rpx';
                        that.over = true;
                    },1200)
                },200)
            },
            scan() {
                let that = this;
                // #ifndef MP-ALIPAY || H5
                uni.scanCode({
                    success(res) {
                        if(res.scanType == "CODE_128" || (res.result && res.result.length == 12)) {
                            that.code = res.result
                        } else {
                            if(res.path) {
                                uni.showLoading({
                                    mask: true,
                                    title: '获取兑换码...'
                                });
                                let path = res.path
                                path = path.split('?');
                                let scene = path[1];
                                let reg = new RegExp("scene=", "g");
                                scene = path[1].replace(reg, "");
                                that.$request({
                                    url: that.$api.default.qrcode_parameter,
                                    data: {
                                        token: scene
                                    }
                                }).then(response => {
                                    if (response.code === 0) {
                                        if(response.data.detail && response.data.detail.data.type == 'auto') {
                                            that.getActive(response.data.detail.data.token, response.data.detail.data.library_id, response.data.detail.data.created_at)
                                        }else {
                                            uni.hideLoading();
                                            uni.showToast({
                                                title: '未获取到兑换码',
                                                icon: 'none',
                                                duration: 1000
                                            });
                                            that.code = response.data.detail.data.code;
                                        }
                                    }
                                });
                            }else {
                                uni.showToast({
                                    title: '暂不支持此二维码，请使用应用内扫一扫功能',
                                    icon: 'none',
                                    duration: 1000
                                });
                            }
                        }
                    }
                })
                // #endif
                // #ifdef MP-ALIPAY
                my.ap.navigateToAlipayPage({
                    appCode:'alipayScan',
                    success:(res) => {
                    },
                    fail:(res) => {
                        my.alert({content:'失败：'+JSON.stringify(res)});
                    }
                });
                // #endif
                // #ifdef H5
                if (this.$jwx.isWechat()) {
                    this.$jwx.scanQRCode({
                        success(res) {
                            if(res.resultStr) {
                                if(res.resultStr.indexOf(',') > 0){
                                 //条形码时返回的格式类似为【code128,123456789】      
                                     var dealserialNumber=res.resultStr.split(',')[1];          
                                     dealserialNumber = dealserialNumber.replace(/[^a-z\d]/ig, "");//处理条形码扫描的字符
                                     that.code = dealserialNumber;//扫描结果传递到的处理页面
                                }else{
                                    //二维码时
                                    location.href=res.resultStr;//扫描结果传递到的处理页面
                                }
                            }else if(res.scanType == "CODE_128" || (res.result && res.result.length == 12)) {
                                that.code = res.result
                            } else {
                                if(res.path) {
                                    uni.showLoading({
                                        mask: true,
                                        title: '获取兑换码...'
                                    });
                                    let path = res.path
                                    path = path.split('?');
                                    let scene = path[1];
                                    let reg = new RegExp("scene=", "g");
                                    scene = path[1].replace(reg, "");
                                    that.$request({
                                        url: that.$api.default.qrcode_parameter,
                                        data: {
                                            token: scene
                                        }
                                    }).then(response => {
                                        if (response.code === 0) {
                                            if(response.data.detail.data.type == 'auto') {
                                                that.getActive(response.data.detail.data.token, response.data.detail.data.library_id, response.data.detail.data.created_at)
                                            }else {
                                                uni.hideLoading();
                                                that.code = response.data.detail.data.code;
                                            }
                                        }
                                    });
                                }else {
                                    uni.showToast({
                                        title: '暂不支持此二维码，请使用应用内扫一扫功能',
                                        icon: 'none',
                                        duration: 1000
                                    });
                                }
                            }
                        }
                    })
                }else {
                    uni.showToast({
                        title: '暂不支持浏览器点击扫码，请应用扫一扫功能',
                        icon: 'none',
                        duration: 1000
                    });
                }
                // #endif
            },
            tabStatus(e) {
                if(this.loading) {
                    return false
                }
                this.list = [];
                this.page = 1;
                this.activeTab = e.currentTarget.dataset.id;
                this.getList();
            },
            getMore() {
                let that = this;
                if(this.loading) {
                    return false
                }
                this.loading = true;
                that.more = false;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.exchange.log,
                    data: {
                        page: that.page
                    }
                }).then(response=>{
                    uni.hideLoading();
                    this.loading = false;
                    if(response.code == 0) {
                        that.list = that.list.concat(response.data.list);
                        if(that.list.length == response.data.pagination.pageSize) {
                            that.more = true;
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
                });
            },
            getList() {
                let that = this;
                if(this.loading) {
                    return false
                }
                this.loading = true;
                that.page = 1;
                that.more = false;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.exchange.log
                }).then(response=>{
                    this.loading = false;
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.list = response.data.list;
                        if(that.list.length == response.data.pagination.pageSize) {
                            that.more = true;
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
                });
            },
            toDetail(item) {
                uni.navigateTo({
                    url: '/plugins/exchange/detail/detail?code=' + item.code + '&exchange=1'
                })
            },
            toGift() {
                uni.navigateTo({
                    url: '/plugins/exchange/list/list'
                })
            },
            clerk() {
                let that = this;
                if(this.loading || !this.code) {
                    return false
                }
                uni.showLoading({
                    mask: true,
                    title: '兑换中...'
                });
                this.loading = true;
                let code = this.code;
                that.$request({
                    url: that.$api.exchange.info,
                    data: {
                        code: code
                    }
                }).then(response=>{
                    this.loading = false;
                    uni.hideLoading();
                    if(response.code == 0) {
                        this.code = '';
                        uni.navigateTo({
                            url: '/plugins/exchange/detail/detail?code=' + code
                        })
                    }else {
                        this.msg = response.msg;
                        this.other = '';
                        if(response.msg == '该兑换码未到使用时间!') {
                            this.other = response.data.valid_start_time + '-' + response.data.valid_end_time + ' 可用'
                        }
                        this.dialog = true;
                    }
                }).catch(response => {
                    uni.hideLoading();
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .dialog-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.3);
        z-index: 101;
    }
    .jump-dialog {
        position: fixed;
        bottom: 120rpx;
        right: 24rpx;
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        background-color: rgba(0,0,0,.3);
        font-size: 16rpx;
        color: #fff;
        z-index: 100;
        &.tabbarbool {
            bottom: 240rpx;
        }
        image {
            width: 54rpx;
            height: 54rpx;
            margin-bottom: 3rpx;
            display: block;
        }
    }
    .use-info {
        position: fixed;
        bottom: 64rpx;
        text-align: center;
        font-size: 28rpx;
        width: 200rpx;
        margin: 0 auto;
        left: 0;
        right: 0;
        &.tabbarbool {
            bottom: 204rpx;
        }
    }
    .scan {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        text-align: center;
        padding-top: 184rpx;
        font-size: 28rpx;
        color: #353535;
        .scan-input {
            height: 94rpx;
            width: 580rpx;
            margin: 40rpx auto;
            background-color: #f9f9f9;
            border: 2rpx solid #e2e2e2;
                border-radius: 16rpx;
            position: relative;
            box-shadow: 1rpx 1rpx 4rpx 4rpx #f5f5f5;
            input {
                border-radius: 16rpx;
                width: 100%;
                height: 100%;
                padding: 10rpx 80rpx 10rpx 20rpx;
                text-align: left;
            }
            image {
                width: 48rpx;
                height: 44rpx;
                position: absolute;
                right: 24rpx;
                top: 23rpx;
                z-index: 2
            }
        }
        .scan-button {
            height: 300rpx;
            width: 300rpx;
            border-radius: 50%;
            text-align: center;
            line-height: 300rpx;
            box-shadow: 2rpx 2rpx 8rpx 8rpx #f3f3f3;
            margin: 112rpx auto;
            font-size: 42rpx;
            font-weight: 600;
            color: #fff;
        }
    }
    .item {
        margin: 24rpx 24rpx 0;
        background-color: #fff;
        border-radius: 16rpx;
        .status {
            padding: 28rpx 30rpx;
            border-bottom: 2rpx solid #e2e2e2;

            .item-code {
                padding: 16rpx 30rpx;
                border-radius: 40rpx;
                font-size: 28rpx;
                font-weight: 600;
            }
            .item-status {
                font-size: 28rpx;
                view:first-of-type {
                    margin-right: 16rpx;
                }
                image {
                    height: 22rpx;
                    width: 14rpx;
                    display: block;
                }
            }
        }
        .item-time {
            height: 72rpx;
            line-height: 72rpx;
            font-size: 28rpx;
            color: #666666;
            padding: 0 30rpx;
        }
    }
    .dialog {
        margin: 270rpx auto;
        background-color: #fff;
        border-radius: 16rpx;
        width: 600rpx;
        padding: 60rpx 0;
        text-align: center;
        .dialog-img {
            width: 200rpx;
            height: 200rpx;
            margin: 0 auto 20rpx;
        }
        .dialog-msg {
            font-size: 32rpx;
            color: #353535;
        }
        .dialog-other {
            font-size: 24rpx;
            color: #999999;
        }
        .dialog-button {
            font-size: 26rpx;
            width: 520rpx;
            height: 90rpx;
            border-radius: 45rpx;
            line-height: 90rpx;
            text-align: center;
            color: #fff;
            margin: 50rpx auto 0;
        }
    }
    .u-rules {
        border-top-left-radius: 16rpx;
        border-top-right-radius: 16rpx;
        width: 100%;
        position: fixed;
        z-index: 1005;
        left: 0;
        background-color: #fff;
        &.iphone_x.tabbarbool {
            padding-bottom: 50rpx;
        }
        .u-rules-top {
            border-top-left-radius: 16rpx;
            border-top-right-radius: 16rpx;
            background-color: #fff;
            height: 80rpx;
            .end-close {
                width: 80rpx;
                height: 80rpx;
                padding: 25rpx;
                image {
                    width: 30rpx;
                    height: 30rpx;
                }
            }
        }
        .u-rules-content {
            padding: 0 20rpx;
            min-height: 160rpx;
            max-height: 918rpx;
            overflow: auto;
        }
    }
</style>