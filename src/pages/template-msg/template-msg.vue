<template>
    <app-layout>
        <view>
            <view class="title">温馨提示:测试前请先点击"订阅",授权后点击"发送"</view>
            <view class="list" v-if="list.length > 0">
                <view class="item dir-left-nowrap cross-center" v-for="(item, index) in list" :key="index">
                    <view class="box-grow-1">{{item.name}}</view>
                    <view class="box-grow-0 btn btn-subscribe" @click="subscribe(index)">
                        <app-jump-button>订阅</app-jump-button>
                    </view>
                    <view class="box-grow-0 btn btn-send" @click="send(index)">发送</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    export default {
        name: "template-msg",
        data() {
            return {
                list: [],
            };
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.loadData();
        },
        methods: {
            loadData() {
                this.$showLoading();
                this.$request({
                    url: this.$api.template.template,
                }).then(response => {
                    this.$hideLoading();
                    if (response.code == 0) {
                        this.list = response.data.list;
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        })
                    }
                }).catch(response => {
                    this.$hideLoading();
                });
            },
            subscribe(index) {
                let template = this.list[index];
                this.$subscribe([template.tpl_id]).then(res => {
                    // #ifdef MP_WEIXIN
                    if (res[template.tpl_id] == 'accept') {
                        uni.showModal({
                            title: '提示',
                            content: '订阅成功',
                            showCancel: false,
                        })
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: '取消订阅',
                            showCancel: false,
                        })
                    }
                    // #endif
                    // #ifndef MP-WEIXIN
                    uni.showModal({
                        title: '提示',
                        content: '订阅成功',
                        showCancel: false,
                    })
                    // #endif
                });
            },
            send(index) {
                this.$showLoading({
                    text: '发送中'
                });
                this.$request({
                    url: this.$api.template.template,
                    method: 'post',
                    data: {
                        templateTpl: this.list[index].tpl_name
                    }
                }).then(response => {
                    this.$hideLoading();
                    if (response.code == 0) {
                        uni.showModal({
                            title: '提示',
                            content: response.data.msg,
                            showCancel: false,
                        })
                    } else {
                        this.$hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .title {
        font-size: $uni-font-size-general-one;
        color: #ff8a00;
        height: #{88rpx};
        line-height: #{88rpx};
        padding: #{0 24rpx};
        background-color: #fff0d9;
    }

    .list {
        padding: #{24rpx};

        .item {
            margin-bottom: #{24rpx};
            background-color: #ffffff;
            height: #{120rpx};
            padding: #{0 40rpx};
            border-radius: #{16rpx};

            .btn {
                font-size: $uni-font-size-general-two;
                padding: #{20rpx 30rpx};
                border-radius: #{64rpx};
                margin-left: #{20rpx};

                &.btn-subscribe {
                    border: #{1rpx solid #409eff};
                    background-color: #ffffff;
                    color: #409eff;
                }

                &.btn-send {
                    background-color: #409eff;
                    color: #ffffff;
                }
            }
        }
    }
</style>