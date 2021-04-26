<template>
    <view @touchmove.stop.prevent="" class="app-clerk-historys" v-show="visible">
        <view class="history-box">
            <view class="top-box">
                <span class="text">历史核销记录</span>
                <image @click="close" class="close" src="/static/image/icon/icon-close.png"></image>
            </view>
            <scroll-view class="scroll-view" scroll-y="true" @scrolltolower="lower">
                <view class="item" v-for="item in list" :key="item.id">
                    <view class="title">已核销（{{item.use_number}}次）</view>
                    <view class="clerk-info">
                        <view class="list-item">
                            核销时间：{{item.clerked_at}}
                        </view>
                        <view class="list-item">
                            核销门店：{{item.store_name}}
                        </view>
                        <view class="list-item">
                            核销员：{{item.clerk_user}}
                        </view>
                    </view>
                </view>
                <view class="not-more" v-if="isMore">没有更多数据！</view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'app-clerk-historys',
        components: {},
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            userCardId: {
                type: Number,
                default: 0,
            }
        },
        watch: {
            isShow(newVal) {
                if (!newVal) {
                    this.visible = false;
                }

                if (newVal) {
                    this.page = 1;
                    this.list = [];
                    this.getList();
                }
            }
        },
        data() {
            return {
                visible: false,
                list: [],
                page: 1,
                isMore: false,
            }
        },
        methods: {
            close() {
                this.$emit('update:isShow', false);
            },
            getList() {
                let that = this;
                that.$showLoading({
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.card.history,
                    data: {
                        user_card_id: that.userCardId,
                        page: that.page,
                    },
                }).then(response => {
                    that.$hideLoading();
                    that.visible = true;
                    if (response.code === 0) {
                        that.list = that.list.concat(response.data.list);
                        that.page = response.data.list.length > 0 ? that.page + 1 : that.page;
                        if (response.data.list.length === 0) {
                            that.isMore = true;
                        }
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 2000,
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            lower() {
                this.getList();
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-clerk-historys {
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;

        .history-box {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            max-height: 920#{rpx};
            overflow: hidden;
            border-top-left-radius: 16#{rpx};
            border-top-right-radius: 16#{rpx};
            background: #f7f7f7;

            .top-box {
                width: 100%;
                height: 120#{rpx};
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                background: #ffffff;

                .text {
                    font-size: 38#{rpx};
                    color: #353535;
                }

                .close {
                    width: 35#{rpx};
                    height: 35#{rpx};
                    position: absolute;
                    right: 24#{rpx};
                    top: 24#{rpx};
                }
            }

            .scroll-view {
                max-height: 800#{rpx};

                .item {
                    display: flex;
                    flex-direction: column;
                    margin-top: 18#{rpx};
                    background: #ffffff;
                    max-height: 800#{rpx};

                    .title {
                        height: 80#{rpx};
                        display: flex;
                        align-items: center;
                        font-size: 28#{rpx};
                        color: #353535;
                        border-bottom: 1#{rpx} solid #dcdcdc;
                        padding-left: 24#{rpx};
                    }

                    .clerk-info {
                        display: flex;
                        flex-direction: column;
                        padding: 25#{rpx} 24#{rpx};

                        .list-item {
                            margin-bottom: 20#{rpx};
                            font-size: 28#{rpx};
                            color: #353535;
                        }
                        .list-item:last-child {
                            margin-bottom: 0;
                        }
                    }
                }

                .not-more {
                    width: 100%;
                    display: flex;
                    justify-content:center;
                    align-items: center;
                    color: #353535;
                    font-size:28#{rpx};
                    padding:20#{rpx} 0;
                }
            }
        }
    }
</style>