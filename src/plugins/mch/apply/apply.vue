<template>
    <app-layout>
        <view v-if="status === -1 || form_status">
            <view class="apply-com">基本信息</view>
            <view class="white">
                <view class="dir-left-nowrap cross-center form-input">
                    <view class="box-grow-0 form-label main-right">联系人</view>
                    <view class="box-grow-1">
                        <input @input="applyInput"
                               :disabled="form_status && status !== 2"
                               data-type="realname"
                               placeholder-class="plugins-mch-apply-input"
                               placeholder="必填"
                               name="realname"
                               :value="form.realname"/>
                    </view>
                </view>
                <view class="dir-left-nowrap cross-center form-input">
                    <view class="box-grow-0 form-label main-right">联系电话</view>
                    <view class="box-grow-1">
                        <input @input="applyInput"
                               :disabled="form_status && status !== 2"
                               data-type="mobile"
                               placeholder-class="plugins-mch-apply-input"
                               placeholder="必填"
                               name="mobile"
                               :value="form.mobile"/>
                    </view>
                </view>
                <view class="dir-left-nowrap cross-center form-input">
                    <view class="box-grow-0 form-label main-right">微信号</view>
                    <view class="box-grow-1">
                        <input @input="applyInput"
                               :disabled="form_status && status !== 2"
                               data-type="wechat"
                               placeholder="请填写微信号"
                               placeholder-class="plugins-mch-apply-input"
                               name="wechat"
                               :value="form.wechat"/>
                    </view>
                </view>
            </view>

            <view class="apply-com">账号信息</view>
            <view class="white">
                <view class="dir-left-nowrap cross-center form-input">
                    <view class="box-grow-0 form-label main-right">账号</view>
                    <view class="box-grow-1">
                        <input @input="applyInput"
                               :disabled="form_status && status !== 2"
                               data-type="username"
                               placeholder-class="plugins-mch-apply-input"
                               placeholder="必填"
                               name="username"
                               :value="form.username"/>
                    </view>
                </view>
                <view class="dir-left-nowrap cross-center form-input">
                    <view class="box-grow-0 form-label main-right">密码</view>
                    <view class="box-grow-1">
                        <input @input="applyInput"
                               :disabled="form_status && status !== 2"
                               password
                               data-type="password"
                               placeholder-class="plugins-mch-apply-input"
                               placeholder="必填"
                               name="password"
                               :value="form.password"/>
                    </view>
                </view>
                <view class="dir-left-nowrap cross-center form-input">
                    <view class="box-grow-0 form-label main-right">确认密码</view>
                    <view class="box-grow-1">
                        <input @input="applyInput"
                               :disabled="form_status && status !== 2"
                               password
                               data-type="checkPass"
                               placeholder-class="plugins-mch-apply-input"
                               placeholder="必填"
                               name="checkPass"
                               :value="form.checkPass"/>
                    </view>
                </view>
            </view>

            <view class="apply-com">店铺信息</view>
            <view class="white">
                <view class="dir-left-nowrap cross-center form-input">
                    <view class="box-grow-0 form-label main-right">店铺名称</view>
                    <view class="box-grow-1">
                        <input @input="applyInput"
                               :disabled="form_status && status !== 2"
                               data-type="name"
                               placeholder-class="plugins-mch-apply-input"
                               placeholder="必填"
                               name="name"
                               :value="form.name"/>
                    </view>
                </view>
                <view class="dir-left-nowrap cross-center form-input">
                    <view class="box-grow-0 form-label main-right">所在地区</view>
                    <view class="box-grow-1 area-left">
                        <app-area-picker @customevent="areaEvent"
                                         :ids="[area.province_id, area.city_id, area.district_id]"></app-area-picker>
                    </view>
                </view>
                <view class="dir-left-nowrap cross-center form-input">
                    <view class="box-grow-0 form-label main-right">详细地址</view>
                    <view class="box-grow-1">
                        <input @input="applyInput"
                               :disabled="form_status && status !== 2"
                               data-type="address"
                               placeholder-class="plugins-mch-apply-input"
                               placeholder="必填"
                               name="address"
                               :value="form.address"/>
                    </view>
                </view>
                <view class="dir-left-nowrap cross-center form-input">
                    <view class="box-grow-0 form-label main-right">客服电话</view>
                    <view class="box-grow-1">
                        <input @input="applyInput"
                               :disabled="form_status && status !== 2"
                               data-type="service_mobile"
                               placeholder-class="plugins-mch-apply-input"
                               placeholder="必填"
                               name="service_mobile"
                               :value="form.service_mobile"/>
                    </view>
                </view>
                <view class="dir-left-nowrap cross-center form-input">
                    <view class="box-grow-0 form-label main-right">所售类目</view>
                    <view class="box-grow-1">
                        <picker :disabled="form_status && status !== 2"
                                :range="category_list" range-key="name" class="category-picker"
                                :value="form.mch_common_cat_id" @change="categoryChange">
                            <view class="cross-center dir-left-nowrap category-info">
                                <view class="box-grow-1 category-select">
                                    {{form.mch_common_cat_str?form.mch_common_cat_str:`请选择`}}
                                </view>
                                <view class="box-grow-0 cross-center">
                                    <icon class="icon-arrow-right" type></icon>
                                </view>
                            </view>
                        </picker>
                    </view>
                </view>
            </view>

            <block v-if="form_data && form_data.length && (setting.status === '1' || status >= 0)">
                <!-- 自定义表单-->
                <app-diy-form title="其他信息" :list="form_data" sign="mch" @input="hangleForm"
                              @validate="validateForm"></app-diy-form>
            </block>

            <block v-if="!form_status || status === 2">
                <view class="dir-left-nowrap cross-center rules-box">
                    <view v-if="rulesStatus" class="icon" @click="rulesTap(false)">
                        <view class="icon-true" type></view>
                    </view>
                    <view v-else class="icon" @click="rulesTap(true)">
                        <view class="icon-false" type></view>
                    </view>
                    <view class="block">我已阅读并同意</view>
                    <view @click="navApplyRules" class="blue">《入驻协议》</view>
                </view>
                <view class="main-center submit-btn" v-if="status === -1 || status === 2">
                    <app-button @click="formSubmit" height="80" width="702" font-size="32" background="#ff4544"
                                border-color="#FF4544"
                                color="#FFFFFF" round>提交
                    </app-button>
                </view>
            </block>

            <view v-if="form_status" class="cross-center dir-top-nowrap main-center">
                <view @click="closeForm" class="result-title">查看审核结果</view>
                <view @click="navHome" class="result-home">返回首页</view>
            </view>
        </view>

        <!-- STATUS -->
        <block v-if="status >=0 && !form_status">
            <view class="dir-top-nowrap main-center cross-center">
                <view class="main-center form-img">
                    <image v-if="status === 0" :src="appImg.load"></image>
                    <image v-else-if="status === 1" :src="appImg.success"></image>
                    <image v-else-if="status === 2" :src="appImg.error"></image>
                </view>
                <view class="status-title">
                    <view v-if="status === 0">待审核</view>
                    <view v-else-if="status === 1">审核通过</view>
                    <view v-else-if="status === 2">审核失败</view>
                </view>
                <view class="status-content">
                    <view v-if="status === 0">您的信息已提交，请耐心等待审核。</view>
                    <block v-else-if="status === 2">
                        <view v-if="mch.review_remark">{{mch.review_remark}}</view>
                        <view v-else>您的信息填写不完整，请重新填写</view>
                    </block>
                </view>
                <view v-if="status === 2" class="status-new main-center">
                    <app-button @click="openForm" height="80" width="560" background="#FF4544" color="#FFFFFF"
                                border-color="#FF4544"
                                font-size="32" round>重新申请
                    </app-button>
                </view>
                <view v-else class="status-submit" @click="openForm">查看提交内容</view>
            </view>
        </block>

    </app-layout>
</template>

<script>
import {mapState} from 'vuex';
import appAreaPicker from '../../../components/page-component/app-area-picker/app-area-picker';
import appDiyForm from '../../../components/page-component/app-diy-form/app-diy-form';

export default {
    name: "apply",
    components: {appAreaPicker, appDiyForm},
    computed: {
        ...mapState({
            appImg: state => state.mallConfig.plugin.mch.app_image,
        }),
    },
    data() {
        return {
            mch_id: -1,
                category_list: [],
                express_list: null,
                form_data: null,
                form_status: false,
                rulesStatus: false,
                area: {
                    province_id: 0,
                    city_id: 0,
                    district_id: 0,
                },
                setting: {},
                status: -2,
                form: {
                    realname: '',
                    mobile: '',
                    wechat: '',
                    username: '',
                    password: '',
                    checkPass: '',
                    address: '',
                    name: '',
                    service_mobile: '',
                    mch_common_cat_str: '',
                    mch_common_cat_id: 0,
                },
                formStatus: {
                    errors: [],
                    hasError: false,
                },
                submit_status: false,
                template_message_list: null,
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.mch_id = options.mch_id;
            this.getCategory();
        },

        methods: {
            hangleForm({data}) {
                this.form.form_data = data;
            },
            navApplyRules() {
                // uni.navigateTo({url: `/plugins/mch/apply_rules/apply_rules`});
                uni.navigateTo({
                    url: `/pages/rules/index?url=${encodeURIComponent(this.$api.mch.setting)}&keys=${JSON.stringify(['setting', 'desc'])}`,
                });
            },
            navHome() {
                uni.navigateTo({url: `/pages/index/index`});
            },
            loadData: function () {
                const self = this;
                self.$showLoading();
                self.$request({
                    url: self.$api.mch.mch_status,
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        self.mch = info.data.mch;
                        self.status = self.mch ? self.mch.review_status : -1;
                        self.template_message_list = info.data.template_message_list;
                        if (self.mch) {
                            self.formInfo(self.mch.id);
                            if (self.mch.status == 1) {
                                //缓存
                                this.$storage.setStorageSync("MCH2019", info.data);
                            }
                        } else {
                            self.getSetting();
                        }
                    }
                }).catch(e => {
                    self.$hideLoading();
                })
            },

            //FUNCTION
            getCategory: function () {
                const self = this;
                self.$request({
                    url: self.$api.mch.category,
                    data: {
                        id: self.mch_id,
                    }
                }).then(info => {
                    if (info.code === 0) {
                        self.category_list = info.data.list;
                        self.loadData();
                    }
                });
            },

            getExpress: function () {
                const self = this;
                self.$request({
                    url: self.$api.mch.express_list,
                }).then(info => {
                    if (info.code === 0) {
                        self.express_list = info.data.list;
                    }
                });
            },

            getSetting: function () {
                const self = this;
                self.$request({
                    url: self.$api.mch.setting,
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        self.setting = info.data.setting;
                        self.form_data = info.data.setting.form_data;
                    }
                });
            },

            //INFO
            formInfo(mch_id) {
                const self = this;
                self.getExpress();

                self.$request({
                    url: self.$api.mch.detail,
                    data: {
                        id: mch_id,
                        is_review_status: 1,
                    }
                }).then(info => {
                    if (info.code === 0) {
                        const detail = info.data.detail;

                        let mch_common_cat_str = '';
                        self.category_list.forEach(v => {
                            if (v.id == detail.mch_common_cat_id)
                                mch_common_cat_str = v.name
                        });

                        if (self.status === 2) {
                            self.getSetting();
                        }

                        //表单处理
                        if (self.status === 0 || self.status === 1) {
                            let form_data = [];
                            if (detail.form_data && detail.form_data.length) {
                                detail.form_data.map(v => {
                                    let list = [];
                                    if (v.key === 'checkbox') {
                                        v.value = v.value ? v.value: [];
                                        v.value.map(v => {
                                            list.push({label: v});
                                        })
                                    }
                                    if (v.key === 'radio') {
                                        list.push({label: v.value});
                                    }
                                    form_data.push({
                                        key: v.key,
                                        name: v.key_name,
                                        default: v.value,
                                        is_required: v.required,
                                        img_type: v.img_type,
                                        list: list,
                                    })
                                });
                            }
                            self.form_data = form_data;
                        }

                        self.form = {
                            mch_id: detail.id,
                            realname: detail.realname,
                            mobile: detail.mobile,
                            wechat: detail.wechat,
                            username: detail.mchUser.username,
                            password: '000000',
                            checkPass: '000000',
                            address: detail.store.address,
                            name: detail.store.name,
                            service_mobile: detail.store.mobile,
                            mch_common_cat_str: mch_common_cat_str,
                            mch_common_cat_id: detail.mch_common_cat_id,
                        };

                        self.area = {
                            province_id: detail.store.province_id,
                            city_id: detail.store.city_id,
                            district_id: detail.store.district_id,
                        };
                    }
                });
            },

            //INPUT
            applyInput: function (e) {
                let name = e.currentTarget.dataset.type;
                this.form[name] = e.detail.value;
            },

            categoryChange(e) {
                const item = this.category_list[e.detail.value];

                this.form.mch_common_cat_id = item.id;
                this.form.mch_common_cat_str = item.name;
            },

            //地址处理
            areaEvent(data) {
                if (data) {
                    this.area.province_id = data.province.id;
                    this.area.city_id = data.city.id;
                    this.area.district_id = data.district.id;
                }
            },

            validateForm: function ({result}) {
                this.formStatus = result;
            },
            subscribe(callback) {
                this.$subscribe(this.template_message_list).then(() => {
                    callback();
                }).catch(() => {
                    callback();
                });
            },
            //SUBMIT
            formSubmit: function () {
                const self = this;
                let form = self.form;
                let area = self.area;
                let rulesStatus = self.rulesStatus;

                let content = function () {
                    if (!rulesStatus) {
                        return '请同意入驻协议';
                    }
                    if (!form.realname) {
                        return "联系人不能为空";
                    }
                    if (!form.mobile) {
                        return "联系电话不能为空";
                    }
                    if (!form.username) {
                        return "账号不能为空";
                    }
                    if (!form.password) {
                        return "密码不能为空";
                    }
                    if (!form.mch_common_cat_id) {
                        return "类目不能为空";
                    }
                    if (form.password !== form.checkPass) {
                        return "密码不一致";
                    }
                    if (!form.name) {
                        return "店铺名称不能为空";
                    }
                    if (self.formStatus.hasError) {
                        return self.formStatus.errors[0].msg;
                    }
                    if (self.submit_status) {
                        return "提交中";
                    }
                    return false;
                }();

                if (content) {
                    uni.showToast({title: content, icon: 'none'});
                    return;
                }
                self.subscribe(() => {
                    self.$showLoading({text: `提交中`});
                    self.submit_status = true;
                    self.$request({
                        url: self.$api.mch.apply,
                        data: {
                            id: form.mch_id ? form.mch_id : 0,
                            realname: form.realname,
                            mobile: form.mobile,
                            wechat: form.wechat,
                            username: form.username,
                            password: form.password,
                            name: form.name,
                            province_id: area.province_id,
                            city_id: area.city_id,
                            district_id: area.district_id,
                            mch_common_cat_id: form.mch_common_cat_id,
                            address: form.address,
                            service_mobile: form.service_mobile,
                            form_data: form.form_data ? JSON.stringify(form.form_data) : JSON.stringify([]),
                            is_update_apply: self.status === 2 ? 1 : 0,
                        },
                        method: 'POST',
                    }).then(info => {
                        self.submit_status = false;
                        self.$hideLoading();
                        if (info.code === 0) {
                            self.loadData();
                            self.form_status = false;
                        } else {
                            uni.showToast({title: info.msg, icon: 'none'});
                        }
                    }).catch(e => {
                        self.submit_status = false;
                    })
                })
            },

            rulesTap: function (status) {
                this.rulesStatus = status;
            },

            closeForm() {
                this.form_status = false;
            },

            openForm() {
                this.form_status = true;
            },
        }
    }
</script>

<style lang="scss">
    .plugins-mch-apply-input {
        color: #bbb;
        font-size: #{28rpx};
    }
</style>
<style scoped lang="scss">
    .apply-com {
        padding-top: #{30rpx};
        padding-left: #{24rpx};
        height: #{72rpx};
        color: #999;
        font-size: #{26rpx};
        background: #f7f7f7;
        width: 100%;
    }

    .white {
        background: #FFFFFF;

        .form-input {
            margin: 0 #{24rpx};
            border-bottom: 1px solid #e2e2e2;
            height: #{100rpx}
        }

        input {
            height: 100%;
            padding: 0 #{32rpx};
            color: #666666;
            font-size: #{28rpx};
        }

        .form-label {
            padding-left: #{3rpx};
            font-size: #{28rpx};
            color: #353535;
            min-width: #{125rpx};
        }

        > view:last-child {
            border-bottom: none;
        }

        .icon-arrow-right {
            background-image: url("../../../static/image/icon/arrow-right.png");
            height: #{22rpx};
            width: #{12rpx};
            background-size: 100% auto;
            background-repeat: no-repeat;
        }

        .area-left {
            padding-left: #{32rpx};
            text-align: right;
            margin-left: auto;
        }

        .category-picker {
            height: 100%;
            width: 100%;
        }

        .category-info {
            height: 100%;
            width: 100%;
            min-height: #{98rpx};
        }

        .category-select {
            font-size: #{28rpx};
            color: #666666;
            text-align: right;
            padding-right: #{24rpx};
        }
    }

    .rules-box {
        background: #f7f7f7;
        margin: #{32rpx} #{24rpx};
        font-size: #{28rpx};

        .icon {
            height: #{32rpx};
            width: #{32rpx};
            margin-right: #{16rpx};
        }

        .icon-true {
            height: #{32rpx};
            width: #{32rpx};
            background-repeat: no-repeat;
            background-image: url("../image/apply-ok.png");
            background-size: 100% 100%;
        }

        .icon-false {
            height: #{32rpx};
            width: #{32rpx};
            background-repeat: no-repeat;
            background-image: url("../image/apply-er.png");
            background-size: 100% 100%;
        }

        .block {
            color: #353535;
        }

        .blue {
            color: #5292ed;
        }
    }

    .submit-btn {
        margin-top: #{52rpx - 32rpx};
        margin-bottom: #{24rpx};
    }

    .result-title {
        color: #387ee8;
        font-size: #{28rpx};
        margin-top: #{32rpx};
    }

    .result-home {
        color: #666;
        font-size: #{28rpx};
        padding: #{24rpx};
    }

    .form-img {
        width: 100%;
        margin-top: #{150rpx};
        margin-bottom: #{72rpx};

        image {
            height: #{270rpx};
            width: #{380rpx};
        }
    }

    .status-title {
        font-size: #{36rpx};
        color: #666666;
    }

    .status-content {
        margin-top: #{24rpx};
        color: #666666;
        width: #{560rpx};

        view {
            text-align: center;
        }
    }

    .status-new {
        margin-top: #{88rpx};
    }

    .status-submit {
        color: #5292ed;
        font-size: #{28rpx};
        margin-top: #{66rpx};
    }
</style>