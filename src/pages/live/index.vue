<template>
    <app-layout>
        <view class="box">
            <view v-if="list.length" class="list-box">
                <view class="item" v-for="(item, index) in list" :key="index" @click="liveClick(item)">
                    <view class="anchor-img-box">
                        <image mode="aspectFill" class="anchor-img" :src="item.anchor_img"></image>
                        <image v-if="item.live_status === 103" class="play-icon" src="/static/image/video-play.png"></image>
                    </view>
                    <view class="room-info-box">
                        <view class="name">{{item.name}}</view>
                        <view class="user-info-box">
                            <image mode="aspectFill" class="anchor-img" :src="item.anchor_img"></image>
                            <span class="anchor-name">{{item.anchor_name}}</span>
                        </view>
                    </view>
                    <view v-if="item.live_status === 101" class="tag-box tag-box-3">
                        <view class="text">
                            <image class="live-icon" src="/static/image/icon/liveing.png"></image>
                            <span>{{item.status_text}}</span>
                        </view>
                    </view>
                    <!--预告-->
                    <view v-else-if="item.live_status === 102" class="tag-box tag-box-1">
                        <view class="text">
                            <view class="round"></view>
                            <span>{{item.status_text}}</span>
                        </view>
                        <view class="text-time">{{item.text_time}}</view>
                    </view>
                    <view v-else-if="item.live_status === 103" class="tag-box tag-box-2">
                        <view class="text">
                            <view class="round"></view>
                            <span>{{item.status_text}}</span>
                        </view>
                    </view>
                    <view v-else class="tag-box tag-box-3">
                        <view class="text">
                            <view class="round"></view>
                            <span>{{item.status_text}}</span>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else class="empty-box">
                <image src="/static/image/order-empty.png"></image>
                <span>暂无任何内容</span>
            </view>
            <app-load-text v-if="is_show_load"></app-load-text>
            <view v-if="is_show_hint" class="hint">没有更多内容了哦</view>
        </view>
    </app-layout>
</template>
<script>
import { mapState } from "vuex";

export default {
    name: 'index',
    data() {
        return {
            list: [],
            page: 1,
            is_show_load: false,
            is_show_hint: false,
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.info
        })
    },
    methods: {
        liveClick(live) {
            let userId = this.userInfo ? this.userInfo.options.user_id : 0;
            let customParams = { user_id: userId }; // 开发者在直播间页面路径上携带自定义参数
            uni.navigateTo({
                url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${live.roomid}&custom_params=${encodeURIComponent(JSON.stringify(customParams))}`
            });
        },
        getList() {
            let self = this;
            if (!self.is_show_load) {
                self.$showLoading({
                    text: '加载中...'
                });
            }
            self.$request({
                url: self.$api.live.index,
                data: {
                    page: self.page
                }
            }).then(response => {
                self.$hideLoading();
                self.is_show_load = false;
                if (response.code === 0) {
                    let { list } = response.data;
                    if (self.page != 1) {
                        self.list = self.list.concat(list);
                    } else {
                        self.list = list;
                    }
                    self.page = list.length ? self.page + 1 : self.page;
                    if (list.length === 0 && self.list.length !== 0) {
                        self.is_show_hint = true;
                    }
                } else {
                    uni.showToast({
                        title: response.msg,
                        icon: 'none',
                        duration: 1000,
                    });
                }
            }).catch(() => {
                self.is_show_load = false;
                self.$hideLoading();
            });
        }
    },
    onLoad() { this.$commonLoad.onload();
        this.getList();
    },
    onReachBottom() {
        this.is_show_load = true;
        this.is_show_hint = false;
        this.getList()
    },
    // #ifdef MP
    onShareAppMessage() {
        return this.$shareAppMessage({
            title: '直播列表',
            path: '/pages/live/index',
            params: {
                user_id: this.userInfo ? this.userInfo.options.user_id : 0
            }
        });
    }
    // #endif
}
</script>
<style scoped lang="scss">
.list-box {
    padding: 20#{rpx};
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
        width: 346#{rpx};
        border-radius: 16#{rpx};
        box-shadow: 0 0 10#{rpx} 1#{rpx} rgba(0, 0, 0, 0.1);
        margin-bottom: 20#{rpx};
        position: relative;
        background: #ffffff;

        .tag-box {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
        }

        .tag-box-1 {
            .text {
                background: #22ac38;
            }

            .text-time {
                padding: 12#{rpx} 20#{rpx};
                font-size: 24#{rpx};
                color: #fff;
                background: rgba(0, 0, 0, 0.5);
                margin-left: -20rpx;
                border-bottom-right-radius: 30#{rpx};
                border-top-right-radius: 30#{rpx};
                padding-left: 30#{rpx};
            }
        }

        .tag-box-2 {
            .text {
                background: #777777;
            }
        }

        .tag-box-3 {
            .text {
                background: #ff4544;
            }

            .live-icon {
                width: 24#{rpx};
                height: 24#{rpx};
                margin-right: 12#{rpx};
            }
        }

        .round {
            width: 15#{rpx};
            height: 15#{rpx};
            background: #fff;
            border-radius: 50%;
            margin-right: 12#{rpx};

        }

        .text {
            padding: 12#{rpx} 20#{rpx};
            font-size: 26#{rpx};
            border-top-left-radius: 16#{rpx};
            border-top-right-radius: 30#{rpx};
            border-bottom-right-radius: 30#{rpx};
            z-index: 10;
            color: #fff;
            display: flex;
            align-items: center;

        }

        .anchor-img-box {
            width: 346#{rpx};
            height: 346#{rpx};
            border-radius: 16#{rpx};
            position: relative;
            overflow: hidden;

            .anchor-img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            .play-icon {
                width: 100#{rpx};
                height: 100#{rpx};
                position: absolute;
                top: 123#{rpx};
                left: 123#{rpx};

            }

            .subscribe-box {
                position: absolute;
                top: 153#{rpx};
                left: 53#{rpx};
            }
        }

        .room-info-box {
            padding: 15#{rpx} 28#{rpx};

            .name {
                font-size: 28#{rpx};
                color: #353535;
                white-space: nowrap;
                -ms-text-overflow: ellipsis;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .user-info-box {
                display: flex;
                align-items: center;
                margin-top: 12#{rpx};

                .anchor-img {
                    width: 40#{rpx};
                    height: 40#{rpx};
                    -webkit-border-radius: 50%;
                    -moz-border-radius: 50%;
                    border-radius: 50%;
                }

                .anchor-name {
                    width: 200#{rpx};
                    font-size: 24#{rpx};
                    color: #999999;
                    margin-left: 12#{rpx};
                    white-space: nowrap;
                    -ms-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
        }
    }
}

.empty-box {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    image {
        width: 280#{rpx};
        height: 280#{rpx};
    }

    span {
        margin-top: 15#{rpx};
        color: #999;
        font-size: 28#{rpx};
    }
}

.hint {
    font-size: 24#{rpx};
    color: #999999;
    text-align: center;
    width: 100%;
    margin-bottom: 15#{rpx};

}
</style>