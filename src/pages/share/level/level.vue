<template>
    <view class="app-layout">
        <app-layout>
            <view class="app-level" :style="bg" v-if="list">
                <view class="title" v-if="list.length > 0">
                    {{list.length > 1 ? (list.length == 2 ? '两' : '三') + '者满足其一即可升级' : '满足以下条件即可升级'}}
                </view>
                <view class="list">
                    <block v-for="(item, index) in list" :key="index">
                        <view class="item dir-left-nowrap">
                            <template v-if="index != 0">
                                <image src="./../image/shuxian.png" class="shuxian left"></image>
                                <image src="./../image/shuxian.png" class="shuxian right"></image>
                            </template>
                            <view class="content box-grow-1" v-if="item.condition_type == 1">下线人数达到
                                <text>{{item.condition}}</text>
                                人
                            </view>
                            <view class="content box-grow-1" v-else-if="item.condition_type == 2">累计佣金达到
                                <text class="price">{{item.condition}}</text>
                            </view>
                            <view class="content box-grow-1" v-else-if="item.condition_type == 3">已提现佣金达到
                                <text class="price">{{item.condition}}</text>
                            </view>
                            <view class="content box-grow-1" v-else-if="item.condition_type == 4">累计消费金额达到
                                <text class="price">{{item.condition}}</text>
                            </view>
                            <view class="box-grow-0 dir-left-nowrap cross-center right" @click="ruleClick(item)">
                                <view class="box-grow-0">等级说明</view>
                                <image class="box-grow-0 arrow-right" src="/static/image/icon/arrow-right.png"></image>
                            </view>
                        </view>
                    </block>
                </view>
                <view class="level-btn" @click="levelUp" v-if="list.length > 0">
                    立即升级
                </view>
                <view class="dialog dir-left-nowrap main-center cross-center" v-if="dialog.show">
                    <view class="content dir-top-nowrap cross-center" :style="dialogBg">
                        <view class="dialog-title">{{dialog.condition_text}}</view>
                        <view>{{dialog.level_name}}</view>
                        <view class="btn" :class="'btn-' + dialog.status" @click="cancel">我知道了</view>
                    </view>
                </view>
                <view class="dialog dir-left-nowrap main-center cross-center" v-if="rule.show">
                    <view class="rule dir-top-nowrap cross-center">
                        <image class="box-grow-0 close" @click="rule.show = false" src="/static/image/icon/icon-close.png"></image>
                        <view class="rule-title">等级说明</view>
                        <text class="rule-content">{{rule.content}}</text>
                        <view class="btn" @click="rule.show = false">我知道了</view>
                    </view>
                </view>
            </view>
        </app-layout>
    </view>
</template>

<script>
    import {mapState} from 'vuex';
    export default {
        name: "level",
        onLoad() { this.$commonLoad.onload();
            this.loadData();
        },
        data() {
            return {
                list: null,
                dialog: {
                    show: false,
                    status: 0,
                    level_name: '',
                    condition_text: '',
                },
                rule: {
                    show: false,
                    content: ''
                }
            };
        },
        computed: {
            ...mapState({
                mallConfig: state => state.mallConfig,
            }),
            dialogBg() {
                if (this.dialog.status) {
                    return `background-image: url(${this.mallConfig.__wxapp_img.share.dialog_success})`;
                } else {
                    return `background-image: url(${this.mallConfig.__wxapp_img.share.dialog_error})`;
                }
            },
            bg() {
                if (this.list) {
                    if (this.list.length > 0) {
                        return `background-image: url(${this.mallConfig.__wxapp_img.share.sharebg})`;
                    } else {
                        return `background-image: url(${this.mallConfig.__wxapp_img.share.no_level_bg})`;
                    }
                } else {
                    return ``;
                }
            },
        },
        methods: {
            loadData() {
                this.$showLoading();
                this.$request({
                    url: this.$api.share.level,
                }).then(response => {
                    this.$hideLoading();
                    if (response.code == 0) {
                        this.list = response.data.list;
                    } else {
                        uni.showModal({
                            content: response.msg,
                            showCancel: false
                        })
                    }
                }).catch(response => {
                    this.$hideLoading();
                })
            },
            levelUp() {
                uni.showLoading({
                    title: '升级中...'
                });
                this.$request({
                    url: this.$api.share.level_up,
                }).then(response => {
                    uni.hideLoading();
                    if (response.code == 0) {
                        this.dialog.show = true;
                        this.dialog = {...this.dialog, ...response.data};
                    } else {
                        uni.showModal({
                            content: response.msg,
                            showCancel: false
                        })
                    }
                }).catch(response => {
                    uni.hideLoading();
                })
            },
            cancel() {
                this.dialog.show = false;
                if (this.dialog.status == 1) {
                    this.loadData();
                }
            },
            ruleClick(item) {
                this.rule.show = true;
                this.rule.content = item.rule;
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-level {
        height: 100vh;
        width: 100%;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;

        .title {
            font-size: #{57rpx};
            color: #ffffff;
            padding: #{80rpx 0};
            width: 100%;
            text-align: center;
        }

        .list {
            padding: #{0 33rpx};

            .item {
                position: relative;
                background: #ffffff;
                border-radius: #{20rpx};
                height: #{130rpx};
                line-height: #{130rpx};
                margin-bottom: #{24rpx};

                .shuxian {
                    width: #{16rpx};
                    height: #{60rpx};
                    display: block;
                    top: #{-43rpx};
                    position: absolute;

                    &.left {
                        left: #{78rpx};
                    }

                    &.right {
                        right: #{78rpx};
                    }
                }
                
                .content {
                    padding-left: #{60rpx};

                    text {
                        color: #e33d41;

                        &.price:before {
                            content: '￥';
                        }
                    }
                }

                .right {
                    font-size: $uni-font-size-weak-two;
                    color: $uni-general-color-two;

                    .arrow-right {
                        width: #{12rpx};
                        height: #{22rpx};
                        margin-left: #{12rpx};
                        margin-right: #{25rpx};
                        display: block;
                    }
                }
            }
        }

        .level-btn {
            text-align: center;
            width: #{534rpx};
            height: #{88rpx};
            line-height: #{88rpx};
            margin: #{50rpx 108rpx};
            font-size: #{43rpx};
            color: #895c4c;
            border-radius: #{50rpx};
            background-image: linear-gradient(to right, #ffddad , #ffce98);
        }

        .dialog {
            position: fixed;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.5);
            width: 100%;
            height: 100%;

            .content {
                width: #{436rpx};
                height: #{492rpx};
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                font-size: $uni-font-size-weak-one;
                color: #545454;

                .dialog-title {
                    margin-top: #{255rpx};
                    margin-bottom: #{30rpx};
                }

                .btn {
                    margin-top: #{30rpx};
                    width: #{272rpx};
                    height: #{60rpx};
                    color: #ffffff;
                    border-radius: #{60rpx};
                    text-align: center;
                    line-height: #{60rpx};

                    &.btn-1 {
                        background: #ff4e47;
                    }

                    &.btn-0 {
                        background: #ffbf7a;
                    }
                }
            }

            .rule {
                width: #{650rpx};
                background-color: #ffffff;
                border-radius: #{20rpx};
                position: relative;

                .close {
                    position: absolute;
                    right: #{24rpx};
                    top: #{24rpx};
                    width: #{30rpx};
                    height: #{30rpx};
                }

                .rule-title {
                    margin: #{40rpx 0};
                }

                .rule-content {
                    width: #{calc(100% - 64rpx)};
                    margin: #{0 32rpx};
                    padding: #{20rpx 32rpx};
                    height: #{270rpx};
                    overflow-y: auto;
                    border: #{1rpx solid #e2e2e2};
                    border-radius: #{16rpx};
                }
                
                .btn {
                    width: 100%;
                    height: #{90rpx};
                    line-height: #{90rpx};
                    text-align: center;
                    color: $uni-general-color-one;
                    font-size: $uni-font-size-import-two;
                    border-top: #{1rpx solid #e2e2e2};
                    margin-top: #{32rpx};
                }
            }
        }
    }
</style>