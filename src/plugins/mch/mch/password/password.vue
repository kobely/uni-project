<template>
    <app-layout>
        <view style="background:#FFFFFF">
            <view class="dir-left-nowrap cross-center select">
                <view class="box-grow-0 first-child main-right">新密码</view>
                <view class="box-grow-1">
                    <input @input="expressNoInput"
                           data-name="password"
                           placeholder-class="plugins-mch-password-input"
                           placeholder="必填"
                           :value="form.password"/>
                </view>
            </view>
            <view class="dir-left-nowrap cross-center select">
                <view class="box-grow-0 first-child main-right">确认新密码</view>
                <view class="box-grow-1">
                    <input @input="expressNoInput"
                           data-name="checkPass"
                           placeholder-class="plugins-mch-password-input"
                           placeholder="必填"
                           :value="form.checkPass"/>
                </view>
            </view>
        </view>

        <view class="submit-btn main-center">
            <app-button @click="passwordSubmit" height="80" width="702" font-size="32" background="#ff4544"
                        color="#ffffff" round>提交
            </app-button>
        </view>
    </app-layout>
</template>

<script>
    export default {
        name: "password",
        components: {},
        data() {
            return {
                form: {},
                mch_id: -1,
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.mch_id = options.mch_id;
        },
        methods: {
            expressNoInput: function (e) {
                let name = e.currentTarget.dataset.name;
                this.form[name] = e.detail.value;
            },

            passwordSubmit() {
                const self = this;
                const form = self.form;

                let content = function () {
                    if (!form.password) {
                        return "密码不能为空";
                    }
                    if (form.password !== form.checkPass) {
                        return "密码不一致";
                    }
                    return false;
                }();
                if (content) {
                    uni.showToast({icon: 'none', title: content});
                    return;
                }

                self.$showLoading({text: '修改中'});
                self.$request({
                    url: self.$api.mch.update_password,
                    method: 'POST',
                    data: {
                        mch_id: self.mch_id,
                        password: form.password,
                    },
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        uni.showModal({
                            title: '提示',
                            content: info.msg,
                            showCancel: false,
                            success: function (e) {
                                if (e.confirm) {
                                    uni.navigateBack({
                                        delta: 1
                                    });
                                }
                            }
                        })
                    } else {
                        uni.showToast({icon: 'none', title: info.msg});
                    }
                }).catch((info) => {
                    self.$hideLoading();
                })
            }
        }
    }
</script>
<style lang="scss">
    .plugins-mch-password-input {
        color: #bbb;
        font-size: #{28rpx};
    }
</style>
<style scoped lang="scss">
    input {
        height: 100%;
        padding: 0 #{32rpx};
        font-size: inherit;
        line-height: inherit;
        color: #666;
    }

    .select {
        margin: 0 #{24rpx};
        border-bottom: 1px solid #e2e2e2;
        height: #{100rpx};

        .first-child {
            padding-left: #{3rpx};
            font-size: #{28rpx};
            width: #{160rpx};
            color: #353535;
        }
    }

    .select:last-child {
        border-bottom: none
    }

    .submit-btn {
        margin-top: #{56rpx};
        margin-bottom: #{24rpx};
    }
</style>