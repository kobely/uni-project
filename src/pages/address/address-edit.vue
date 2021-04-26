<template>
    <app-layout>
        <view class="app-view">
            <!-- 自动识别功能 -->
            <view v-if="form.type === 0 || is_refund_address > 0"
                  class="automatic dir-left-nowrap cross-center main-between">
                <input type="text" v-model="automatic" placeholder-class="place-automatic"
                       placeholder="复制收货信息（姓名前后请输入空格）" @confirm="getAddress">
                <button @click="getAddress" :style="{'color': getTheme.color}">自动识别</button>
            </view>

            <view class="app-line app-border main-between cross-center">
                <text class="app-text box-grow-0">收货人</text>
                <input class="address-input" type="text" v-model="form.name"/>
            </view>
            <view class="app-line app-border main-between cross-center">
                <text class="app-text box-grow-0">联系电话</text>
                <input class="address-input" type="number" v-model="form.mobile"/>
            </view>
            <view v-if="form.type === 0  || is_refund_address > 0"
                  class="app-line app-border main-between cross-center">
                <text class="app-text box-grow-0">所在地区</text>
                <view class="box-grow-1 area-left">
                    <app-area-picker v-if="tt_area_show"
                                     @customevent="areaEvent"
                                     :ids="[form.province_id,form.city_id,form.district_id]"></app-area-picker>
                </view>
            </view>

            <!-- #ifndef MP-TOUTIAO -->
            <view v-if="form.type === 1 && is_refund_address == 0"
                  class="app-line app-border main-between cross-center">
                <text class="app-text box-grow-0">定位地址</text>
                <view class="h-100 main-right dir-left-nowrap cross-center box-grow-1" @click="getChooseLocation">
                    <view style="line-height: 1.5;text-align: right" class="t-omit-two c-address" v-if="form.location">
                        {{ form.location }}
                    </view>
                    <view v-else class="c-address" style="color: #999999;margin-right:auto">点击此处进行定位</view>
                    <icon type="" class="box-grow-0 icon-arrow-image" type></icon>
                </view>
            </view>
            <!-- #endif -->
            <view v-if="form.type === 0 || is_refund_address > 0" class="app-line main-between cross-center">
                <text class="app-text box-grow-0">详细地址</text>
                <input class="address-input" type="text" :focus="focus" @blur="focus = false" v-model="form.detail"/>
            </view>
            <view v-if="form.type === 1" class="app-line main-between cross-center">
                <text class="app-text box-grow-0">门牌号</text>
                <input class="address-input" placeholder-style="color:#999999" placeholder="请输入具体门牌号以便配送" type="text"
                       :focus="focus" @blur="focus = false"
                       v-model="form.detail"/>
            </view>
            <view v-if="false" class="tip" @click="detailFocus">请输入具体门牌号以便配送</view>
        </view>
        <view class="app-button">
            <app-button @click="submit" :theme="getTheme" arrangement="row" type="important" round width="90%">
                <text class="app-text">保存地址</text>
            </app-button>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters} from 'vuex';
    import appAreaPicker from '../../components/page-component/app-area-picker/app-area-picker.vue';
    import addressParse from './address-parse.js';
    import appTextArea from '../../components/basic-component/app-textarea/app-textarea.vue';

    export default {
        name: "address-edit",
        data() {
            return {
                form: {
                    location: '',
                    latitude: '',
                    longitude: '',
                    id: '',
                    name: '',
                    mobile: '',
                    address: '',
                    province_id: 0,
                    city_id: 0,
                    district_id: 0,
                    detail: '',
                    type: '',
                },
                is_refund_address: 0,
                detail_url: '',
                list: [],
                submit_status: false,
                tt_area_show: false,
                automatic: '',
                provinceString: '',
                cityString: '',
                areaString: '',
                focus: false,
            }
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme'
            }),
        },
        components: {
            appAreaPicker,
            appTextArea
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.form.type = options.type == 1 ? 1 : 0;
            this.getAutoInfo();

            if (options.is_refund_address > 0) {
                this.is_refund_address = options.is_refund_address;
                this.detail_url = this.$api.app_admin.refund_address_edit;
                uni.setNavigationBarTitle({
                    title: '编辑退货地址'
                });
            } else {
                this.is_refund_address = 0;
                this.detail_url = this.$api.user.address_detail;
            }
            if (options.form) {
                const optionsForm = JSON.parse(options.form);
                if (typeof optionsForm.type === 'undefined') {
                    optionsForm.type = this.form.type;
                }
                this.form = optionsForm;
            }

            if (options.id > 0) {
                this.$showLoading({title: `加载中`});
                this.$request({
                    url: this.detail_url,
                    data: options
                }).then(info => {
                    this.$hideLoading();
                    if (info.code === 0) {
                        if (options.is_refund_address > 0) {
                            const detail = info.data.detail;
                            this.getInfo(Object.assign({detail: detail.address_detail}, detail));
                        } else {
                            this.form = info.data.list;
                        }
                    } else {
                        uni.showToast({title: info.msg, icon: 'none'});
                    }
                    this.tt_area_show = true;
                }).catch(() => {
                    this.$hideLoading();
                    this.tt_area_show = true;
                });
            } else {
                this.tt_area_show = true;
            }
        },
        methods: {
            async getAutoInfo() {
                const res = await this.$request({
                    url: this.$api.user.auto_address_info,
                    method: 'get'
                });
                if (res.code === 0) {
                    let autoInfo = JSON.parse(res.data);

                    const provinces = autoInfo.reduce((per, cur) => {
                        const {children, ...others} = cur;
                        return per.concat(others);
                    }, []);

                    const cities = autoInfo.reduce((per, cur) => {
                        return per.concat(cur.children.map(({children, ...others}) => ({...others, provinceCode: cur.code})));
                    }, []);

                    const areas = autoInfo.reduce((per, cur) => {
                        const provinceCode = cur.code;
                        return per.concat(cur.children.reduce((p, c) => {
                            const cityCode = c.code;
                            return p.concat(c.children.map(({children, ...others}) => ({...others, cityCode, provinceCode,})));
                        }, []));
                    }, []);

                    this.provinceString = JSON.stringify(provinces);
                    this.cityString = JSON.stringify(cities);
                    this.areaString = JSON.stringify(areas);
                }
            },
            // #ifndef MP-TOUTIAO
            async getChooseLocation() {
                const self = this;
                const [err, res] = await uni.chooseLocation();

                if (res) {
                    self.form.location = res.address + res.name;
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
                                                        self.form.location = res.address + res.name;
                                                        self.form.latitude = res.latitude;
                                                        self.form.longitude = res.longitude;
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
                        let { province, city, district } = info.data.district;
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

            async submit() {
                try {
                    if (this.submit_status) return;
                    let content;

                    if (!this.form.detail) {
                        content = this.form.type == 1 ? '门牌号不能为空' : '详细地址不能为空';
                    }
                    if (!this.form.province_id && this.form.type == 0) {
                        content = '地区不能为空';
                    }
                    if (!this.form.mobile) {
                        content = '联系方式不能为空';
                    }
                    if (!(this.$validation.umobile(this.form.mobile))) {
                        content = '联系方式格式错误';
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

                    let para, url;
                    if (this.is_refund_address > 0) {
                        let {id, name, mobile, detail} = this.form;
                        url = this.$api.app_admin.refund_address_edit;
                        para = {
                            form: JSON.stringify({
                                id,
                                name,
                                mobile,
                                address_detail: detail,
                                address: this.list,
                                is_default: 0,
                                remark: '',
                            })
                        }
                    } else {
                        url = this.$api.user.address_save;
                        para = Object.assign({}, this.form);
                    }

                    const info = await this.$request({
                        url: url,
                        data: para,
                        method: 'POST',
                    });

                    this.submit_status = false;

                    if (info.code === 0) {
                        uni.showToast({title: info.msg, icon: 'none'});
                        uni.navigateBack({delta: 1});
                    } else {
                        uni.showToast({title: info.msg, icon: 'none'});
                    }
                } catch (e) {
                    this.submit_status = false;
                    throw new Error(e);
                }
            },

            getAddress() {
                let data = addressParse(this.automatic, {} ,this.provinceString, this.cityString, this.areaString);
                if (this.$validation.empty(data)) return;
                const district = this.$storage.getStorageSync("_DISTRICT");
                let { name, province, city, area, phone, detail } = data;
                for (let i = 0; i < district.length; i++) {
                    if (district[i].name === province) {
                        for (let j = 0; j < district[i].list.length; j++) {
                            if (district[i].list[j].name === city) {
                                for (let k = 0; k < district[i].list[j].list.length; k++) {
                                    if (district[i].list[j].list[k].name === area) {
                                        this.form.province_id = district[i].id;
                                        this.form.city_id = district[i].list[j].id;
                                        this.form.district_id = district[i].list[j].list[k].id;
                                        break;
                                    }
                                }
                                break;
                            } else if (city === '市辖区') {
                                for (let k = 0; k < district[i].list[j].list.length; k++) {
                                    if (district[i].list[j].list[k].name === area) {
                                        this.form.province_id = district[i].id;
                                        this.form.city_id = district[i].list[j].id;
                                        this.form.district_id = district[i].list[j].list[k].id;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                }

                this.form.name = name;
                this.form.detail = `${detail}`;
                this.form.mobile = phone;
            },
            detailFocus() {
                this.focus = true;
            }
        }
    }
</script>

<style scoped lang="scss">

    // 自动识别功能
    .automatic {
        height: #{100upx};
        margin-bottom: #{20upx};
        padding: #{0 32upx 0 24upx};
        background-color: #ffffff;
        button {
            width: #{150upx};
            height: #{60upx};
            padding: 0;
            line-height: #{58upx};
            border-radius: #{5upx};
            border: #{1upx} solid;
            font-size: #{26upx};
            background-color: transparent;
            margin: 0;
            text-align: center;
        }
        input {
            width: calc(100% - #{182upx});
            font-size: #{28upx};
            color:#353535;
        }
        .place-automatic {
            font-size: #{26upx};
            color: #999999;
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
    }

    .address-input {
        width: #{580rpx};
        font-size: #{28rpx};
        color: #353535;
    }

    .area-left {
        padding-left: #{32rpx};
        text-align: right;
        margin-left: auto;
    }

    .app-view {
        background: #f7f7f7;
        .app-line {
            background-color: #ffffff;
            height: #{99rpx};
            line-height: #{99rpx};
            padding: #{0 24upx};
            text.app-text {
                font-size: #{28rpx};
                color: $uni-important-color-black;
                width: #{124rpx};
            }
        }

        .app-border {
            border-bottom: #{1rpx} solid $uni-weak-color-one;
        }

        .c-address {
            padding-right: #{24rpx};
            font-size: #{28rpx};
            color: #353535;
        }

        .icon-arrow-image {
            width: #{12rpx};
            height: #{24rpx};
            background-image: url("../../static/image/icon/arrow-right.png");
            background-size: 100% auto;
            background-repeat: no-repeat;
        }

        .tip {
            padding: #{0 24rpx 24rpx 24rpx};
            background: #ffffff;
            color: #b7b7b7;
        }
    }
</style>