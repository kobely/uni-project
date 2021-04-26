<template>
    <app-layout>
        <view>
        <!-- 申请页面背景图片以及待审核页面背景图片 -->
            <image :src="custom_setting.apply.apply_head_pic" class="add-bg"></image>
            <!-- 未在申请分销商 -->
            <view class="add-form">
                <view class="add-default">
                    <view class="add-info share-name dir-left-nowrap">
                        <view>欢迎加入</view>
                        <view class="mall-name t-omit">{{mall.name}}</view>
                        <view>，请填写申请信息</view>
                    </view>
                    <view class="add-info">
                        <view class="add-label">邀请人</view>
                        <view class="share-user">
                            <text >{{parent_name}}</text>(请核对)</view>
                    </view>
                    <view class="add-info">
                        <view class="add-label">
                            <text style="color: #ff4544">*</text>姓名
                        </view>
                        <view class="add-input">
                            <input v-model="name" placeholder="请填写真实姓名" placeholder-style="color: #cdcdcd" />
                        </view>
                    </view>
                    <view class="add-info">
                        <view class="add-label">
                            <text style="color: #ff4544">*</text>手机号码</view>
                        <view class="add-input">
                            <input v-model="phone" type="number" placeholder="请填写手机号码" placeholder-style ="color: #cdcdcd" />
                        </view>
                    </view>
                </view>
                <view class="add-default add-diy-form" v-if="share_setting.form_status == 1">
                    <app-diy-form :datePadding="0" :itemHeight="66" :showRequiredIcon="true" @input="handleFormInput" labelPosition="top" :list="share_setting.form" :labelFs28="true"></app-diy-form>
                </view>
                <view class="add-default add-diy-form">
                    <view class="add-info" style="font-size:13px;">
                        <view class="read" @click="toRead">
                            <image src="/static/image/icon/icon-uncheck.png" v-if="read == false"></image>
                            <image :class="[`red-background`]" src="/static/image/icon/icon-checkbox-checked.png" v-else></image>
                        </view>
                        我已经阅读并了解
                        <text style="color:#014c8c" @click="protocol = true">【{{custom_setting.apply.share_apply_pact.name ? custom_setting.apply.share_apply_pact.name : custom_setting.apply.share_apply_pact.default}}】</text>
                    </view>
                </view>
                <view class="submit">
                    <view @click="subscribe">
                        <button :style="{'background-color':`${custom_setting.apply.apply_btn_background}`,'border-radius':`${custom_setting.apply.apply_btn_round}`,'color':`${custom_setting.apply.apply_btn_color}`}">{{custom_setting.apply.apply_btn_title ? custom_setting.apply.apply_btn_title : '申请成为分销商'}}</button>
                    </view>
                </view>
            </view>
            <!-- 特权 -->
            <view class="other">
                <image @load="imageLoad" :style="{'height':`${height}rpx`}" class="end-img" :src="custom_setting.apply.apply_end_pic"></image>
            </view>
            <!-- 分销协议（modal模式） -->
            <view class="modal" v-if="protocol">
                <view class="protocol">
                    <view class="protocol-name">{{custom_setting.apply.share_apply_pact.name ? custom_setting.apply.share_apply_pact.name : custom_setting.apply.share_apply_pact.default}}</view>
                    <view class="protocol-content">
                        <text>{{share_setting.agree}}</text>
                    </view>
                    <view @click="protocol=false;read=true">
                        <view class="read-over">我已阅读</view>
                    </view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";
    import AppDiyForm from "../../../components/page-component/app-diy-form/app-diy-form";

    export default {
        data() {
            return {
                status: null,
                mallName: '',
                name: '',
                phone: '',
                parent_name: '',
                height: 0,
                form: {},
                template_message: [],
                read: false,
                protocol: false
            }
        },
        computed: {
            ...mapState({
                mall: state => state.mallConfig.mall,
                custom_setting: state => state.mallConfig.share_setting_custom,
                share_setting: state => state.mallConfig.share_setting,
            })
        },
        components: {
            AppDiyForm
        },
        methods: {
            handleFormInput({data}) {
                const result = [];
                for (let i in data) {
                    result[i] = {
                        key: data[i].key,
                        label: data[i].name,
                        value: data[i].value,
                        required: data[i].is_required,
                    };
                }
                this.form = result;
            },
            toRead() {
                this.read = !this.read
            },

            imageLoad: function (e) {
                var $width = e.detail.width; //获取图片真实宽度
                var $height = e.detail.height; //获取图片真实高度
                this.height = $height * (702 / $width)
            },
            subscribe() {
                let that = this;
                let read = 0;
                if(this.form.length > 0) {
                    for(let item of this.form) {
                        if(item.required == 1) {
                            if(!item.value) {
                                uni.showToast({
                                    title: '请填写' + item.label,
                                    icon: 'none',
                                    duration: 1000
                                });
                                return false
                            }
                            if(item.key == 'img_upload' && Array.isArray(item.value)) {
                                for(let img of item.value) {
                                    if(!img) {
                                        uni.showToast({
                                            title: '请填写' + item.label,
                                            icon: 'none',
                                            duration: 1000
                                        });
                                        return false
                                    }
                                }
                            }
                        }
                    }
                }
                if (this.read == true) {
                    read = 1;
                    if (!that.name) {
                        uni.showToast({
                            title: '请输入真实姓名',
                            icon: 'none',
                            duration: 1000
                        });
                    } else if (!that.phone) {
                        uni.showToast({
                            title: '请输入手机号码',
                            icon: 'none',
                            duration: 1000
                        });
                    } else if (!(/0?(1)[0-9]{10}/.test(that.phone))) {
                        uni.showToast({
                            title: '请输入正确的手机号码',
                            icon: 'none',
                            duration: 1000
                        });
                    } else {
                        // let template_message = [this.template_message]
                        this.$subscribe(this.template_message).then(res => {
                            this.submit(read);
                        }).catch(res => {
                            this.submit(read);
                        });
                    }
                } else {
                    uni.showToast({
                        title: '请先查看分销协议并同意',
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            submit(read) {
                let that = this;
                uni.showLoading({
                    title: '提交中...'
                });
                let para = {
                    name: that.name,
                    mobile: that.phone,
                    agree: read
                }
                if(that.share_setting.form_status == 1) {
                    para.form = JSON.stringify(that.form)
                }
                that.$request({
                    url: that.$api.share.apply,
                    data: para,
                    method: 'post'
                }).then(response => {
                    that.$store.dispatch('mallConfig/actionResetConfig');
                    that.$hideLoading();
                    if (response.code == 0) {
                        uni.showToast({
                            title: response.msg,
                            duration: 1000
                        });
                        setTimeout(function() {
                            uni.navigateBack({
                                delta: 1
                            })
                        }, 500)
                    } else {
                        if(that.share_setting.form_status == 0 && response.msg == '请填写表单') {
                            uni.showToast({
                                title: '申请条件有所变化，请重新填写',
                                icon: 'none',
                                duration: 1000
                            });
                        }else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    }
                }).catch(e => {
                    that.$hideLoading();
                    uni.showToast({
                        title: response,
                        icon: 'none',
                        duration: 1000
                    });
                })
            }
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            if (options.template_message != null) {
                that.template_message = JSON.parse(options.template_message)
            }
            uni.setNavigationBarTitle({
                title: this.custom_setting.apply.share_apply.name ? this.custom_setting.apply.share_apply.name : this.custom_setting.apply.share_apply.default
            });
            this.$request({
                url: this.$api.user.user_info,
            }).then(response => {
                this.$hideLoading();
                if (response.code === 0) {
                    this.parent_name = response.data.identity.parent_name
                }
            })
        },
        onShow() {
            this.$store.dispatch('mallConfig/actionResetConfig');
        }
    }
</script>

<style scoped lang="scss">
    .add-bg {
        height: #{300rpx};
        width: 100%;
        display: block;
        margin-bottom: #{20rpx};
        background-color: #f7f7f7;
    }

    .add-form {
        padding: 0 #{24rpx};
        font-size: #{30rpx};
        color: #353535;
        .add-default {
            background-color: #fff;
            border-radius: #{16rpx};
            padding: 0 #{10rpx} #{35rpx};
            margin-bottom: #{20rpx};
            &.add-diy-form {
                padding-bottom: 0;
                padding: #{10rpx} #{24rpx};
                .add-info {
                    border-bottom: 0;
                    padding: #{24rpx} 0;
                }
            }
            .add-info {
                width: 100%;
                padding: #{10rpx} #{24rpx};
                border-bottom: #{1rpx} solid #e2e2e2;
                .red-background {
                    background-color: #ff4544;
                }
                .add-label {
                    height: #{45rpx};
                    line-height: #{45rpx};
                    font-size: #{28rpx};
                }
               .add-input {
                    height: #{75rpx};
                    input {
                        height: #{65rpx};
                        padding-top: #{5rpx};
                    }
                }
                &.share-name {
                    height: #{90rpx};
                    line-height: #{90rpx};
                    padding: 0 #{10rpx};
                    .mall-name {
                        max-width: #{300rpx};
                        color: #ff4544;
                    }
                }
                .share-user {
                    color: #666;
                    height: #{75rpx};
                    line-height: #{75rpx};
                    >text {
                        color: #ff4544;
                    }
                }
                .read {
                    width: #{32rpx};
                    height: #{32rpx};
                    float: left;
                    margin-right: #{10rpx};
                    image {
                        height: 100%;
                        width: 100%;
                        display: block;
                    }
                }
            }
        }
    }

    .submit {
        background-color: #f7f7f7;
        margin: 0 #{-24rpx};
        padding: #{24rpx};
        button {
            color: #fff;
            font-size: #{30rpx};
            font-weight: bold;
            height: #{80rpx};
            border-radius: #{40rpx};
            line-height: #{80rpx};
        }
    }

    .other {
        background-color: #fff;
        padding: 0 #{24rpx};
        color: #353535;
        font-size: #{30rpx};
        .end-img {
            width: 100%;
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
            margin: #{100rpx} auto;
            .protocol-name {
                height: #{100rpx};
                text-align: center;
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
                text-align: center;
                height: #{100rpx};
                line-height: #{100rpx};
                background-color: #ff4544;
                color: #fff;
                font-size: #{30rpx};
                border-bottom-right-radius: #{20rpx};
                border-bottom-left-radius: #{20rpx};
            }
        }
    }
</style>