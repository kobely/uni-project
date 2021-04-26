<template>
    <app-layout>
        <view v-if="middleman.status == 0" class="wait">
            <image :src="bonusImg.wait"></image>
            <view>谢谢您的支持，请等待审核...</view>
            <view class="app-button">
                <app-button :theme="getTheme" color="#fff" @click="toIndex" arrangement="row" type="important" round width="320">
                    <text class="app-text">去商城逛逛</text>
                </app-button>
            </view>
        </view>
        <view v-else-if="middleman.status == 1" class="success">
            <image :src="bonusImg.success"></image>
            <view class="success-text">您已成为团长</view>
            <view class="app-button">
                <app-button :theme="getTheme" color="#fff" @click="toCommunity" arrangement="row" type="important" round width="320">
                    <text class="app-text">团长中心</text>
                </app-button>
            </view>
        </view>
        <view v-else-if="middleman.status == -1" class="pay">
            <app-head :apply="middleman.status == -1" :theme="getTheme"></app-head>
            <view class="pay-view">
                <image class="money-icon" src="./../image/money.png"></image>
                <view class="money-name">{{setting.apply_money_name}}</view>
                <view>商家设置了加入门槛，你需要支付相应费用</view>
                <view class="pay-price">￥<text>{{middleman.pay_price}}</text></view>
            </view>
            <view class="app-button">
                <app-button :theme="getTheme" color="#fff" @click="middlemanPay" roundSize="40rpx" arrangement="row" type="important" round>
                    <text class="app-text">确认支付</text>
                </app-button>
            </view>
        </view>
        <view v-else-if="middleman.status == 3" class="refuse">
            <image src="./../image/refuse.png"></image>
            <view>您被解除{{setting.middleman}}身份</view>
            <view class="refuse-info">
                <view>审核时间:
                    <text>{{middleman.apply_at}}</text>
                </view>
                <view class="refuse-reason">解除理由:
                    <text style="word-wrap:break-word;">{{middleman.reason ? middleman.reason :"无"}}</text>
                </view>
                <view class="app-button">
                    <app-button :theme="getTheme" color="#fff" @click="reApply" arrangement="row" type="important" round width="320">
                        <text class="app-text">再次申请</text>
                    </app-button>
                </view>
            </view>
        </view>
        <view v-else-if="middleman.status == 2" class="refuse">
            <image src="./../image/refuse.png"></image>
            <view>您的申请被拒</view>
            <view class="refuse-info">
                <view>审核时间:
                    <text>{{middleman.apply_at}}</text>
                </view>
                <view class="refuse-reason">拒绝理由:
                    <text style="word-wrap:break-word;">{{middleman.reason ? middleman.reason :"无"}}</text>
                </view>
                <view class="app-button">
                    <app-button :theme="getTheme" color="#fff" @click="reApply" arrangement="row" type="important" round>
                        <text class="app-text">再次申请</text>
                    </app-button>
                </view>
            </view>
        </view>
        <view v-else-if="middleman.status == -2">
            <app-head :theme="getTheme"></app-head>
            <view class="title">
                <view class="big-title-text">{{setting.middleman}}信息</view>
                <view>用于商品配送管理，请填写真实信息</view>
            </view>
            <view class="app-view">
                <view class="app-line main-between cross-center">
                    <text class="app-text box-grow-0">姓名</text>
                    <view class="address-input" style="opacity: 0.3" v-if="address">{{form.name}}</view>
                    <input v-else placeholder-style="color:#cdcdcd" placeholder="请输入姓名" maxlength="10" class="address-input" type="text" v-model="form.name" />
                </view>
                <view class="app-line main-between cross-center">
                    <text class="app-text box-grow-0">手机号</text>
                    <view class="address-input" style="opacity: 0.3" v-if="address">{{form.mobile}}</view>
                    <input v-else placeholder-style="color:#cdcdcd" placeholder="请输入手机号" maxlength="11" class="address-input" type="number" v-model="form.mobile" />
                </view>
                <view class="app-line main-between cross-center">
                    <text class="app-text box-grow-0">省市区</text>
                    <view class="address-input" v-if="address" style="opacity: 0.3" >{{form.province}},{{form.city}},{{form.district}}</view>
                    <view v-else class="box-grow-1 area-left">
                        <app-area-picker @customevent="areaEvent"
                                         :ids="[form.province_id,form.city_id,form.district_id]"></app-area-picker>
                    </view>
                </view>
                <!-- #ifndef MP-TOUTIAO -->
                <view v-if="is_refund_address == 0" class="app-line main-between cross-center">
                    <text class="app-text box-grow-0">所在地区</text>
                    <view class="h-100 main-right dir-left-nowrap cross-center box-grow-1" @click="getChooseLocation" :style="{'opacity': address ? '0.3' : '1'}">
                        <view class="box-grow-0 c-address t-omit" :class="{'placeholder':!location}">{{location ? location : '请选择所在地区'}}</view>
                        <image src="/static/image/icon/arrow-right.png" class="box-grow-0 icon-arrow-image"></image>
                    </view>
                </view>
                <!-- #endif -->

                <view class="app-line main-between cross-center">
                    <text class="app-text box-grow-0">提货地址</text>
                    <input placeholder-style="color:#cdcdcd" placeholder="请输入详细提货地址" class="address-input" type="text" :focus="focus" @blur="focus = false" v-model="form.detail" />
                </view>
            </view>
            <view class="app-button">
                <app-button v-if="address" :theme="getTheme" color="#fff" @click="saveAddress" arrangement="row" type="important" round width="90%">
                    <text class="app-text">保存</text>
                </app-button>
                <app-button v-else :theme="getTheme" color="#fff" @click="submit" arrangement="row" type="important" round width="90%">
                    <text class="app-text">下一步</text>
                </app-button>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appAreaPicker from '../../../components/page-component/app-area-picker/app-area-picker.vue';
    import appHead from '../components/app-head.vue';
    import appTextArea from '../../../components/basic-component/app-textarea/app-textarea.vue';

    export default {
        data() {
            return {
                wait: false,
                middleman: {
                    status: 99
                },
                id: null,
                form: {
                    location: '',
                    latitude: '',
                    longitude: '',
                    name: '',
                    mobile: '',
                    province_id: 0,
                    city_id: 0,
                    district_id: 0,
                    detail: '',
                },
                location: '',
                setting: {
                    middleman: ''
                },
                is_refund_address: 0,
                detail_url: '',
                list: [],
                submit_status: false,
                automatic: '',
                province: [],
                focus: false,
                address: false,
            }
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                community: state => state.mallConfig.__wxapp_img.community,
                bonusImg: state => state.mallConfig.__wxapp_img.bonus,
            })
        },
        components: {appAreaPicker, appTextArea, appHead},

        onLoad(options) { this.$commonLoad.onload(options);
            if(options.id > 0) {
                this.address = true;
            }
            this.getPlace();
            this.getStatus();
        },
        methods: {
            areaEvent(data) {
                if (data) {
                    this.form.province_id = data.province.id;
                    this.form.city_id = data.city.id;
                    this.form.district_id = data.district.id;
                }
            },
            toCommunity() {
                uni.navigateTo({
                    url: '/plugins/community/index/index'
                }); 
            },
            toIndex() {
                uni.navigateTo({
                    url: '/pages/index/index'
                }); 
            },
            reApply() {
                let that = this;
                that.middleman.status = -2;
            },
            middlemanPay() {
                let that = this;
                if(that.id > 0) {
                    that.pay(that.id);
                    return false;
                }
                that.$request({
                    url: that.$api.community.apply_pay,
                    data: {
                        id: that.middleman.id
                    }
                }).then(response=>{
                    if(response.code == 0) {
                        that.pay(response.data.id);
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
                    url: that.$api.community.index,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.setting = response.data.setting;
                        uni.setNavigationBarTitle({
                            title: '申请' + that.setting.middleman,
                        })
                        if(response.data.middleman.id > 0) {
                            that.middleman = response.data.middleman;
                            if(that.address) {
                                that.middleman.status = -2;
                                that.form = response.data.middleman;
                                if(that.form.province == that.form.city) {
                                    that.location = that.form.province + ' ' + that.form.district + ' ' + that.form.location;
                                }else {
                                    that.location = that.form.province + ' ' + that.form.city + ' ' + that.form.district + ' ' + that.form.location;
                                }
                                uni.setNavigationBarTitle({
                                    title: '填写' + that.setting.middleman +'信息',
                                })
                            }
                        }else {
                            that.middleman.status = -2;
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            getPlace() {
                let that = this;
                that.$request({
                    url: that.$api.city.cityName,
                }).then(response=>{
                    if(response.code === 0) {
                        that.province = response.data.list;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                })
            },
            // #ifndef MP-TOUTIAO
            async getChooseLocation() {
                const self = this;
                if(self.address) {
                    return false
                }
                const [err, res] = await uni.chooseLocation();

                if (res) {
                    if(res.name == '我的位置' || res.address == '我的位置') {
                        uni.showToast({
                            title: '请选择具体位置',
                            icon: 'none'
                        });
                        return false;
                    } 
                    let province = '';
                    let city = '';
                    let area = '';
                    let name = res.name;
                    // #ifdef MP-ALIPAY
                    if(res.provinceName == '上海') {
                        res.provinceName = '上海市'
                    }
                    if(res.provinceName == '澳门特别行政区' || res.provinceName == '香港特别行政区' || res.provinceName == '台湾省') {
                        uni.showToast({
                            title: '不支持该地区',
                            icon: 'none'
                        });
                        return false;
                    }
                    res.address = res.address.replace(res.provinceName,'');
                    res.address = res.address.replace(res.cityName,'');
                    res.address = res.address.replace(res.adName,'');
                    name = res.name ? res.name : res.address;
                    res.address = res.provinceName + res.cityName + res.adName + name;
                    if(!(res.adCode > 0)) {
                        res.address = '其他其他其他'
                    }
                    // #endif
                    if(!res.address) {
                        res.address = '其他其他其他'
                    }
                    res.address = res.address.replace('北京市北京市','北京市');
                    res.address = res.address.replace('天津市天津市','天津市');
                    res.address = res.address.replace('上海市上海市','上海市');
                    res.address = res.address.replace('重庆市重庆市','重庆市');
                    res.address = res.address.replace('香港特别行政区香港特别行政区','香港特别行政区');
                    res.address = res.address.replace('澳门特别行政区澳门特别行政区','澳门特别行政区');
                    for(let i in self.province) {
                        if(res.address.indexOf(self.province[i].name) == 0) {
                            province = self.province[i].name != 'undefined' ? self.province[i].name : '';
                            self.form.province_id = self.province[i].id;
                            if(province != '北京市' && province != '天津市' && province != '上海市' && province != '重庆市' && province != '澳门特别行政区' && province != '香港特别行政区') {
                                res.address = res.address.replace(province,'');
                            }
                            for(let j in self.province[i].list) {
                                if(res.address.indexOf(self.province[i].list[j].name) == 0 && self.province[i].list[j].parent_id == self.province[i].id) {
                                    city = self.province[i].list[j].name != 'undefined' ? self.province[i].list[j].name : '';
                                    self.form.city_id = self.province[i].list[j].id;
                                    res.address = res.address.replace(city,'');
                                    for(let x in self.province[i].list[j].list) {
                                        if(res.address.indexOf(self.province[i].list[j].list[x].name) == 0 && self.province[i].list[j].list[x].parent_id == self.province[i].list[j].id && self.province[i].list[j].list[x].provinceCode == self.province[i].code) {
                                            area = self.province[i].list[j].list[x].name != 'undefined' ? self.province[i].list[j].list[x].name : '';
                                            self.form.district_id = self.province[i].list[j].list[x].id;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(!province || !area || !name) {
                        self.form.province_id = ''
                        self.form.city_id = ''
                        self.form.district_id = ''
                    }
                    if(province == city) {
                        self.location = province + ' ' + area + ' ' + name;
                    }else {
                        self.location = province + ' ' + city + ' ' + area + ' ' + name;
                    }
                    self.form.location = name;
                    self.form.latitude = res.latitude;
                    self.form.longitude = res.longitude;
                }
                if (err) {
                    const setting = () => {
                        uni.showModal({
                            title: '授权权限',
                            content: '请先授权地理位置权限',
                            success(res) {
                                if (res.confirm) {
                                    uni.openSetting({
                                        success(settingdata) {
                                            if (settingdata.authSetting['scope.userLocation']) {
                                                uni.chooseLocation({
                                                    success: function (res) {
                                                        self.getChooseLocation();
                                                    },
                                                });
                                            } else {
                                                uni.showToast({
                                                    title: '授权失败',
                                                    icon: 'none'
                                                });
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    };

                    //#ifdef MP-BAIDU
                    if (err.errCode === 1003) {
                        setting();
                    }
                    //#endif

                    //#ifdef MP-WEIXIN
                    if (err.errMsg === `chooseLocation:fail auth deny`) {
                        setting();
                    }
                    //#endif
                }
            },
            // #endif
            getInfo(detail) {
                this.$request({
                    url: this.$api.user.wechat_district,
                    data: {
                        province_name: detail.address[0],
                        city_name: detail.address[1],
                        county_name: detail.address[2],
                    },
                }).then(info => {
                    if (info.code === 0) {
                        const {province, city, district} = info.data.district;
                        detail.province_id = province.id;
                        detail.city_id = city.id;
                        detail.district_id = district.id;
                        this.form = detail;
                    }
                }).catch(() => {
                    uni.showToast({
                        title: '网络异常',
                        icon: 'none',
                    });
                })
            },

            areaEvent(data) {
                if (data) {
                    this.form.province_id = data.province.id;
                    this.form.city_id = data.city.id;
                    this.form.district_id = data.district.id;
                    this.list = [data.province.name, data.city.name, data.district.name];
                }
            },

            saveAddress() {
                let that = this;
                if (!this.form.detail) {
                    uni.showToast({
                        title: '提货地址不能为空',
                        icon: 'none',
                    });
                    return false
                }
                if (!this.form.province_id || !this.form.city_id || !this.form.district_id) {
                    uni.showToast({
                        title: '提货地址不能为空',
                        icon: 'none',
                    });
                    return false
                }
                that.$request({
                    url: that.$api.community.edit_address,
                    data: {
                        detail: that.form.detail
                    },
                    method: 'post'
                }).then(response=>{
                    uni.showToast({
                        title: response.msg,
                        icon: 'none',
                        duration: 1000
                    });
                    if(response.code == 0) {
                        setTimeout(()=>{
                            uni.navigateBack({});
                        },1000)
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },

            async submit() {
                try {
                    if (this.submit_status) return;
                    let content;

                    if (!this.form.detail) {
                        content = '提货地址不能为空';
                    }
                    if (!this.form.location) {
                        content = '所在地区不能为空';
                    }
                    if (!this.form.mobile) {
                        content = '手机号不能为空';
                    }
                    if (!this.form.name) {
                        content = '姓名不能为空';
                    }
                    if (content) {
                        uni.showToast({
                            title: content,
                            icon: 'none'
                        });
                        return;
                    }

                    this.submit_status = true;

                    let url = this.$api.community.apply;
                    let para = this.form;

                    if (this.is_refund_address > 0) {

                        url = this.$api.app_admin.refund_address_edit;
                        let {id, name, mobile, detail} = this.form;

                        para = {
                            form: JSON.stringify({
                                id,
                                name,
                                mobile,
                                address_detail: detail,
                                address: this.list,
                                is_default: 0,
                                remark: ''
                            })
                        }
                    }

                    const info = await this.$request({
                        url: url,
                        data: para,
                        method: 'POST',
                    });

                    this.submit_status = false;

                    if (info.code === 0) {
                        let queue_id = info.data.queue_id;
                        let token = info.data.token;
                        this.getResult(queue_id, token)
                    } else {
                        uni.showToast({title: info.msg, icon: 'none'});
                    }
                } catch (e) {
                    this.submit_status = false;
                    throw new Error(e);
                }
            },
            getResult(queue_id,token) {
                this.$request({
                    url: this.$api.community.apply_result,
                    data: {
                        queue_id: queue_id,
                        token: token,
                    },
                }).then(response => {
                    if (response.code === 0) {
                        if (response.data.retry && response.data.retry === 1) {
                            this.getPayDataTimer = setTimeout(() => {
                                this.getResult(queue_id, token);
                            }, 1000);
                        } else {
                            uni.hideLoading();
                            if(response.data.id > 0) {
                                this.id = response.data.id
                            }
                                this.getStatus();
                        }
                    } else {
                        this.exchangeCoupon = false;
                        uni.hideLoading();
                        uni.showModal({
                            title: '提示',
                            content: response.msg,
                            showCancel: false,
                        });
                    }
                }).catch(e => {
                    this.exchangeCoupon = false;
                    uni.hideLoading();
                    uni.showModal({
                        title: '提示',
                        content: e.errMsg,
                        showCancel: false,
                    });
                });
            },
            pay(id) {
                this.$payment.pay(id).then(res => {
                    this.getStatus();
                }).catch(() => {
                    uni.showToast({
                        title: '支付失败',
                        icon: 'none',
                        duration: 1000
                    });
                });
            },
            detailFocus() {
                this.focus = true;
            }
        }
    }
</script>

<style scoped lang="scss">
    .success {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        text-align: center;
        .success-text {
            margin: #{-20rpx} auto #{30rpx};
            color: #353535;
            font-size: #{40rpx};
        }
        image {
            height: #{270rpx};
            width: #{380rpx};
            margin: #{120rpx} auto #{60rpx};
        }
        .app-button {
            margin: #{24rpx} auto;
            width: #{320rpx};
        }
    }
    .pay {
        font-size: #{36rpx};
        color: #353535;
        text-align: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        .pay-view {
            position: relative;
            margin-top: #{-324rpx};
            color: #fff;
            font-size: #{26rpx};
            .money-icon {
                width: #{93rpx};
                height: #{93rpx};
                border-radius: 50%;
                margin-bottom: #{20rpx};
            }
            .money-name {
                font-size: #{34rpx};
                margin-bottom: #{10rpx};
            }
            .pay-price {
                margin-top: #{150rpx};
                color: #353535;
                font-size: #{50rpx};
                text {
                    font-size: #{70rpx};
                }
            }
        }
    }
    .refuse {
        font-size: #{36rpx};
        color: #353535;
        text-align: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        position: absolute;
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
            }
        }
        .app-button {
            margin: #{24rpx} auto;
            width: #{320rpx};
        }
    }
    .wait {
        color: #666;
        font-size: #{32rpx};
        text-align: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        view {
            margin-bottom: #{68rpx};
        }
        image {
            height: #{270rpx};
            width: #{380rpx};
            margin: #{120rpx} auto #{60rpx};
        }
        .app-button {
            margin: #{24rpx} auto;
            width: #{320rpx};
        }
    }
    .title {
        font-size: #{26rpx};
        color: #fff;
        margin-top: #{-360rpx};
        text-align: center;
        height: #{160rpx};
        padding-top: #{30rpx};
        position: relative;
        .big-title-text {
            font-size: #{34rpx};
            margin: 0 0 #{12rpx};
        }
    }
    .popup {
        position: fixed;
        background: rgba(0, 0, 0, 0.5);
        padding: #{50rpx};
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;
        .textarea {
            width: 100%;
            background: #fff;
            border: #{1rpx} solid #ccc;
            z-index: 1;
            padding: #{24rpx};
            border-radius: #{5rpx};
        }
        .c {
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
        }
    }
    .h-100 {
        height: 100%;
    }

    .app-button {
        margin: #{40rpx} #{24rpx};
        color: #fff;
        text {
            color: #fff!important;
        }
    }

    .address-input {
        width: #{580rpx};
        font-size: #{28rpx};
        color: #353535;
    }

    .area-left {
        text-align: text;
        margin-left: auto;
    }

    .app-view {
        background-color: #ffffff;
        position: relative;
        z-index: 10;
        width: #{702rpx};
        margin: 0 auto;
        border-radius: #{16rpx};
        .app-line {
            height: #{118rpx};
            line-height: #{118rpx};
            padding: #{0 32rpx 0 0};
            text.app-text {
                font-size: #{28rpx};
                color: $uni-important-color-black;
                width: #{140rpx};
                margin-right: #{20rpx};
                text-align: right;
                flex-shrink: 0;
            }
        }

        .c-address {
            padding-right: #{24rpx};
            font-size: #{28rpx};
            color: #353535;
            width: #{500rpx};
            height: 100%;
            &.placeholder {
                color: #cdcdcd;
            }
        }

        .icon-arrow-image {
            width: #{12rpx};
            height: #{24rpx};
        }

        .tip {
            padding: #{0 24rpx 24rpx 24rpx};
            background: #ffffff;
            color: #b7b7b7;
        }
    }
</style>