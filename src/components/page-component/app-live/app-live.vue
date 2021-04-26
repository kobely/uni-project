<template>
    <view v-if="value.live_list.length > 0" class="app-live" :style="{background: value.background}">
        <template v-if="value.style_type == 1">
            <view class="live-style-1 shadow"
              v-for="(item, index) in value.live_list"
              :key="index"
              @click="liveClick(item)">
            <view class="item">
                <image class="anchor-img" mode="aspectFill" :src="item.anchor_img"></image>
                <view class="gradient"></view>
                <view class="label-box">
                    <view class="label-item"
                          :class="{'label-item-over': item.live_status == 103,
                          'label-item-notice': item.live_status == 102}">
                        <image v-if="item.live_status == 101" class="live-ing"
                               src="/static/image/icon/liveing.png"></image>
                        <view v-else class="round"></view>
                        <span class="label-text">{{item.status_text}}</span>
                    </view>
                    <span v-if="item.live_status == 102" class="text-time">{{item.text_time}}</span>
                </view>
                <view class="user-info">
                    <image class="avatar" mode="aspectFill" :src="item.anchor_img"></image>
                    <span class="nickname ellipsis">{{item.anchor_name}}</span>
                </view>
                <image v-if="item.live_status === 103" class="play-icon"
                       src="/static/image/video-play.png"></image>
            </view>
            <span class="title ellipsis">{{item.name}}</span>
            <view v-if="value.is_show_goods == true && item.goods.length > 0" class="goods-info">
                <image mode="aspectFill" class="goods-cover" :src="item.goods[0].cover_img"></image>
                <view class="goods-item">
                    <span class="goods-name ellipsis">{{item.goods[0].name}}</span>
                    <span class="goods-price">￥{{item.goods[0].price}}</span>
                </view>
            </view>
        </view>
        </template>
        <view v-if="value.style_type == 2" class="wrap-box">
            <view class="wrap-item" v-for="(valueItem, valueIndex) in newValue" :key="valueIndex">
                <view class="live-style-2 shadow"
                      v-for="(item, index) in valueItem.live_list"
                      :key="index"
                      @click="liveClick(item)">
                    <view class="item">
                        <image mode="aspectFill" class="anchor-img" :src="item.anchor_img"></image>
                        <view class="gradient"></view>
                        <view class="label-box">
                            <view class="label-item"
                                  :class="{'label-item-over': item.live_status == 103,
                          'label-item-notice': item.live_status == 102}">
                                <image v-if="item.live_status == 101" class="live-ing"
                                       src="/static/image/icon/liveing.png"></image>
                                <view v-else class="round"></view>
                                <span class="label-text">{{item.status_text}}</span>
                            </view>
                            <span v-if="item.live_status == 102" class="text-time">{{item.text_time}}</span>
                        </view>
                        <view class="user-info">
                            <image class="avatar" mode="aspectFill" :src="item.anchor_img"></image>
                            <span class="nickname ellipsis">{{item.anchor_name}}</span>
                        </view>
                        <image v-if="item.live_status === 103" class="play-icon"
                               src="/static/image/video-play.png"></image>
                    </view>
                    <span class="title ellipsis">{{item.name}}</span>
                    <view v-if="value.is_show_goods == true && item.goods.length > 0" class="goods-info">
                        <image mode="aspectFill" class="goods-cover" :src="item.goods[0].cover_img"></image>
                        <view class="goods-item">
                            <span class="goods-name ellipsis">{{item.goods[0].name}}</span>
                            <span class="goods-price">￥{{item.goods[0].price}}</span>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <template v-if="value.style_type == 3">
             <view class="live-style-3 shadow"
              v-for="(item, index) in value.live_list"
              :key="index"
              @click="liveClick(item)">
            <view class="item">
                <image mode="aspectFill" class="anchor-img" :src="item.anchor_img"></image>
                <view class="gradient"></view>
                <view class="label-box">
                    <view class="label-item"
                          :class="{'label-item-over': item.live_status == 103,
                          'label-item-notice': item.live_status == 102}">
                        <image v-if="item.live_status == 101" class="live-ing"
                               src="/static/image/icon/liveing.png"></image>
                        <view v-else class="round"></view>
                        <span class="label-text">{{item.status_text}}</span>
                    </view>
                    <span v-if="item.live_status == 102" class="text-time">{{item.text_time}}</span>
                </view>
                <image v-if="item.live_status === 103" class="play-icon"
                       src="/static/image/video-play.png"></image>
            </view>
            <view class="item-2">
                <span class="title">{{item.name}}</span>
                <view class="user-info">
                    <image class="avatar" mode="aspectFill" :src="item.anchor_img"></image>
                    <span class="nickname ellipsis">{{item.anchor_name}}</span>
                </view>
                <view v-if="value.is_show_goods == true && item.goods.length > 0" class="goods-info">
                    <view class="goods-cover">
                        <view class="gradient"></view>
                        <image mode="aspectFill" :src="item.goods[0].cover_img"></image>
                        <span class="goods-price">￥{{item.goods[0].price}}</span>
                    </view>
                    <view class="goods-cover goods-cover-2" v-if="item.goods.length >= 2">
                        <view class="shade"></view>
                        <image mode="aspectFill" :src="item.goods[1].cover_img"></image>
                        <view class="goods-count">
                            <span class="number">{{item.goods.length}}</span>
                            <span>宝贝</span>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        </template>
    </view>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: 'app-live',
        components: {},
        props: {
            value: {
                type: Object,
                default: function () {
                    return {
                        background: '#f7f7f7',
                        live_list: [],
                        is_show_goods: true,
                        number: 5,
                        style_type: 1
                    }
                }
            },
        },
        data() {
            return {}
        },
        computed: {
            newValue() {
                let self = this;
                let newValue = [
                    {
                        background: self.value.background,
                        is_show_goods: self.value.is_show_goods,
                        number: self.value.number,
                        style_type: self.value.style_type,
                        live_list: [],
                    }, {
                        background: self.value.background,
                        is_show_goods: self.value.is_show_goods,
                        number: self.value.number,
                        style_type: self.value.style_type,
                        live_list: [],
                    },
                ];

                let number1 = 0;
                let number2 = 0;
                self.value.live_list.forEach((item, index) => {
                    let sign = item.goods.length > 0 ? true : false;
                    if (number1 == 0 || number1 <= number2) {
                        number1 = sign ? number1 + 2 : number1 + 1;
                        newValue[0].live_list.push(item);
                    } else {
                        number2 = sign ? number2 + 2 : number2 + 1;
                        newValue[1].live_list.push(item);
                    }
                });
                return newValue;
            },
            ...mapState({
                userInfo: state => state.user.info,
            })
        },
        methods: {
            liveClick(liveData) {
                let userId = this.userInfo ? this.userInfo.options.user_id : 0;
                let customParams = {user_id: userId}; // 开发者在直播间页面路径上携带自定义参数
                uni.navigateTo({
                    url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${liveData.roomid}&custom_params=${encodeURIComponent(JSON.stringify(customParams))}`
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-live {
        padding: 20#{rpx};

        .shadow {
            box-shadow: 0 0 10#{rpx} 5#{rpx} rgba(0, 0, 0, 0.1);
        }

        .label-item {
            border-top-left-radius:16#{rpx};
            border-top-right-radius: 30#{rpx};
            border-bottom-right-radius: 30#{rpx};
            background: #ff4544;
            padding: 12#{rpx} 20#{rpx};
            display: flex;
            align-items: center;

        }
        .label-item-over {
            background: #777777;
        }
        .label-item-notice {
            background: #22ac38;
        }

        .round {
            width: 12#{rpx};
            height: 12#{rpx};
            background: #ffffff;
            border-radius: 50%;
        }

        .live-ing {
            width: 24#{rpx};
            height: 24#{rpx};
        }

        .label-text {
            margin-left: 12#{rpx};
            color: #ffffff;
            font-size: 26#{rpx};
        }

        .label-box {
            position: absolute;
            top: 0;
            left: 0;
            border-top-left-radius: 16#{rpx};
            border-top-right-radius: 30#{rpx};
            border-bottom-right-radius: 30#{rpx};
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            z-index: 20;
        }

        .ellipsis {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .play-icon {
            width: 100#{rpx};
            height: 100#{rpx};
            z-index: 20;
        }

        .user-info {
            display: flex;
            align-items: center;
            z-index: 20;

            .avatar {
                width: 40#{rpx};
                height: 40#{rpx};
                border-radius: 50%;
            }

            .nickname {
                color: #ffffff;
                font-size: 24#{rpx};
                margin-left: 12#{rpx};
                width: 578#{rpx};
            }
        }

        .text-time {
            color: #ffffff;
            font-size: 24#{rpx};
            margin: 0 20#{rpx} 0 12#{rpx};
        }

        .shade {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            position: absolute;
            z-index: 10;
        }

        .gradient {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
        }

        /*样式一*/
        .live-style-1 {
            width: 100%;
            border-radius: 16#{rpx};
            background: #ffffff;
            padding: 20#{rpx};
            margin-bottom: 20#{rpx};
            display: flex;
            flex-direction: column;

            .item {
                width: 100%;
                height: 360#{rpx};
                border-radius: 16#{rpx};
                position: relative;
                overflow: hidden;

                .anchor-img {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                }

                .user-info {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    margin-left: 20#{rpx};
                    margin-bottom: 20#{rpx};
                }

                .play-icon {
                    position: absolute;
                    top: 130#{rpx};
                    left: 285#{rpx};
                }
            }

            .title {
                font-size: 32#{rpx};
                color: #353535;
                width: 654#{rpx};
                margin: 28#{rpx} 0 20#{rpx};
            }
            .goods-info {
                width: 100%;
                border-radius: 8#{rpx};
                padding: 10#{rpx};
                display: flex;
                background: #f7f7f7;
                .goods-cover {
                    width: 80#{rpx};
                    height: 80#{rpx};
                    border-radius: 8#{rpx};
                }

                .goods-item {
                    display: flex;
                    flex-direction: column;
                    margin-left: 16#{rpx};
                    .goods-name {
                        font-size: 26#{rpx};
                        color: #666666;
                        width: 540#{rpx};
                    }
                    .goods-price {
                        font-size: 26#{rpx};
                        color: #353535;
                        margin-top: 16#{rpx};
                    }
                }
            }
        }
        .live-style-1:last-child {
            margin-bottom: 0;
        }

        /*样式二*/
        .wrap-box {
            width: 100%;
            display: flex;
            justify-content: space-between;

            .wrap-item {
                display: flex;
                flex-direction: column;

                .live-style-2 {
                    background: #ffffff;
                    border-radius: 16#{rpx};
                    overflow: hidden;
                    margin-bottom: 20#{rpx};
                    width: 100%;
                    display: flex;
                    flex-direction: column;

                    .item {
                        width: 346#{rpx};
                        height: 346#{rpx};
                        position: relative;
                        border-radius: 16#{rpx};

                        .anchor-img {
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            top: 0;
                            left: 0;
                        }

                        .user-info {
                            position: absolute;
                            bottom: 20#{rpx};
                            left: 20#{rpx};
                            .nickname {
                                width: 254#{rpx};
                            }
                        }

                        .play-icon {
                            position: absolute;
                            top: 123#{rpx};
                            left: 123#{rpx};
                        }
                    }

                    .title {
                        font-size: 28#{rpx};
                        color: #353535;
                        width: 290#{rpx};
                        margin: 28#{rpx};
                    }

                    .goods-info {
                        width: 100%;
                        display: flex;
                        margin: 0 28#{rpx} 28#{rpx};
                        .goods-cover {
                            width: 80#{rpx};
                            height: 80#{rpx};
                            border-radius: 8#{rpx};
                        }

                        .goods-item {
                            display: flex;
                            flex-direction: column;
                            margin-left: 16#{rpx};
                            .goods-name {
                                font-size: 26#{rpx};
                                color: #666666;
                                width: 194#{rpx};
                            }
                            .goods-price {
                                font-size: 26#{rpx};
                                color: #353535;
                                margin-top: 16#{rpx};
                            }
                        }
                    }
                }
                .live-style-2:last-child {
                    margin-bottom: 0;
                }
            }
        }
        /*样式三*/
        .live-style-3 {
            width: 100%;
            background: #ffffff;
            border-radius: 16#{rpx};
            overflow: hidden;
            display: flex;
            margin-bottom: 20#{rpx};

            .item {
                border-radius: 16#{rpx};
                width: 360#{rpx};
                height: 360#{rpx};
                position: relative;

                .anchor-img {
                    width: 100%;
                    height:100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                }

                .play-icon {
                    position: absolute;
                    top: 123#{rpx};
                    left: 123#{rpx};
                }
            }

            .item-2 {
                display: flex;
                flex-direction: column;
                padding: 20#{rpx};

                .title {
                    width: 310#{rpx};
                    height: 88#{rpx};
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                }

                .user-info {
                    margin: 20#{rpx} 0;
                }

                .nickname {
                    width: 258#{rpx};
                    color: #999999;
                }

                .goods-info {
                    display: flex;
                    justify-content: space-between;

                    .goods-cover {
                        width: 148#{rpx};
                        height: 148#{rpx};
                        border-radius: 16#{rpx};
                        overflow: hidden;
                        display: flex;
                        align-items: flex-end;
                        justify-content: center;
                        position: relative;

                        image {
                            width: 148#{rpx};
                            height: 148#{rpx};
                            position: absolute;
                            top: 0;
                            left: 0;
                        }
                        .goods-price {
                            color: #ffffff;
                            font-size: 24#{rpx};
                            z-index: 10;
                            margin-bottom: 10#{rpx};
                        }
                    }

                    .goods-cover-2 {
                        align-items: center;

                        .goods-count {
                            display: flex;
                            flex-direction: column;
                            color: #ffffff;
                            font-size: 24#{rpx};
                            z-index: 10;

                            .number {
                                text-align: center;
                            }
                        }
                    }
                }
            }
        }
        .live-style-3:last-child {
            margin-bottom: 0;
        }
    }
</style>