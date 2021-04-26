<template>
    <app-layout>
        <view class="bg">
            <view class="no-content" v-if="!list.status">暂无记录</view>
            <view v-if="list && list.status" class="head-bg" :style="{'background-image': 'url(' + lotteryConfig.app_image.bg_pic + ')'}">
                <template v-if="list.status === `1` && list.lottery.join_min_num - num > 0">
                    <view class="dir-left-nowrap detail-head-a main-center">
                        <icon class="icon-march" type></icon>
                        <view class="dir-top-nowrap main-center">
                            <view class="text-success">还差{{ list.lottery.join_min_num - num }}人即可开奖</view>
                            <view class="text-time">{{ list.time }}</view>
                        </view>
                    </view>
                    <view class="main-center cross-center detail-lucky">您的幸运码为{{ list.lucky_code }}</view>
                </template>
                <template v-if="list.status === `1` && list.lottery.join_min_num - num <=0">
                    <view class="dir-left-nowrap detail-head-a main-center">
                        <icon class="icon-wait" type></icon>
                        <view class="dir-top-nowrap main-center">
                            <view class="text-success">参加成功，等待开奖</view>
                            <view class="text-time">{{ list.time }}</view>
                        </view>
                    </view>
                    <view class="main-center cross-center detail-lucky">您的幸运码为{{ list.lucky_code }}</view>
                </template>

                <template v-if="list.status===`2` && list.lottery.type !=2">
                    <view class="dir-left-nowrap detail-head-b main-center">
                        <icon class="icon-error" type></icon>
                        <view class="dir-top-nowrap main-center text-winning">很遗憾，您未中奖</view>
                    </view>
                    <view @click="prize" class="cross-center main-center dir-left-nowrap detail-lucky">
                        <view>查看我的幸运码</view>
                        <icon class="icon-arrow-right-white" type></icon>
                    </view>
                </template>

                <template v-if="list.status===`2` && list.lottery.type ==2">
                    <view class="dir-left-nowrap detail-head-b main-center">
                        <icon class="icon-people" type></icon>
                        <view class="dir-top-nowrap main-center text-winning">人数未到，开奖失败</view>
                    </view>
                </template>

                <template v-if="list.status===`3` || list.status===`4`">
                    <view class="dir-left-nowrap detail-head-b main-center">
                        <icon class="icon-winning" type></icon>
                        <view class="dir-top-nowrap main-center">
                            <view class="text-winning">恭喜你，中奖啦！</view>
                            <view class="text-code">中奖幸运码为 {{ list.lucky_code }}</view>
                        </view>
                    </view>
                    <view @click="prize" class="cross-center main-center dir-left-nowrap detail-lucky">
                        <view>查看我的幸运码</view>
                        <icon class="icon-arrow-right-white" type></icon>
                    </view>
                </template>
            </view>

            <view class="detail-box" v-if="list && list.goods"
                  :style="{background: 'linear-gradient(' + lotteryConfig.config.bg_color +', '+ ( lotteryConfig.config.bg_color_type === 'gradient' ?  lotteryConfig.config.bg_gradient_color:  lotteryConfig.config.bg_color) + ')'}">
                <view class="detail-center-a">

                    <view @click="navGoods" class="dir-left-nowrap goods">
                        <image class="box-grow-0" :src="list.goods.goodsWarehouse.cover_pic" load-lazy></image>
                        <view class="dir-top-nowrap goods-center">
                            <view class="t-omit-three goods-name" :class="list.lottery.join_min_num > 0 ? 'limit' : ''"
                                  :data-limit="`${list.lottery.join_min_num}人起抽`">
                                {{ list.goods.goodsWarehouse.name }}
                            </view>
                            <view class="attr-text dir-left-wrap t-omit">
                                <block v-for="(value, key) in list.attr.attr_list" :key="key">
                                    <text>{{ value.attr_group_name }}：{{ value.attr_name }}</text>
                                </block>
                            </view>
                            <view class="stock">共
                                <text>{{ list.lottery.stock }}</text>
                                份
                            </view>
                            <view class="dir-left-nowrap cross-center">
                                <view class="box-grow-0 price">免费</view>
                                <view class="box-grow-1 original-price">￥{{ list.goods.price }}</view>
                        </view>
                    </view>
                </view>

                <view v-if="setting.cs_status ===1 && setting.cs_prompt_pic" @click="qrcode" class="lottery-share" >
                    <image :src="setting.cs_prompt_pic" mode="aspectFit" load-lazy></image>
                </view>

                <template v-if="list.status == 1">
                    <view  class="dir-left-nowrap cross-center people">
                        <view class="dir-top-nowrap box-grow-1">
                            <view class="text">邀请好友参与，增加中奖概率哦！</view>
                            <view class="ok">已成功邀请
                                <text>{{list.parent_num}}</text>
                                位好友
                            </view>
                        </view>
                        <view @click="prize" class="box-grow-0 dir-left-nowrap cross-center jt">
                            <view class="text">详情</view>
                            <icon class="icon-arrow-right" type></icon>
                        </view>
                    </view>

                    <view class="dir-left-nowrap main-center t-small open">
                        <view class="share">
                            <view @click="moreLottery" class="more-lottery a">参与更多抽奖</view>
                        </view>
                        <app-jump-button open_type="share">
                            <!--  #ifdef MP -->
                            <app-button font-size="28" background="#ff4544" color="#ffffff" height="72"
                                        width="300" round>邀请好友参与
                            </app-button>
                            <!--  #endif -->
                            <!--  #ifdef H5 -->
                            <app-button font-size="28" background="#ff4544" color="#ffffff" height="72"
                                        @click="hShareAppMessage"
                                        width="300" round>邀请好友参与
                            </app-button>
                            <!--  #endif -->
                        </app-jump-button>
                    </view>
                </template>

                <template v-else-if="list.status == 2">
                    <view class="main-center open">
                        <view @click="moreLottery" class="more-lottery b">参与更多抽奖</view>
                    </view>
                </template>

                <template v-else-if="list.status == 3 || list.status == 4">
                    <view class="dir-left-nowrap main-center t-small open">
                        <view class="share">
                            <app-button @click="moreLottery" font-size="28" background="#FFFFFF" color="#ff4544"
                                        height="72"
                                        width="300" round>
                                参与更多抽奖
                            </app-button>
                        </view>
                        <app-button font-size="28" v-if="list.status == 3" background="#ff4544"
                                    color="#ffffff" @click="submit" height="72" width="300" round>
                            立即兑换
                        </app-button>
                        <app-button font-size="28" v-if="list.status == 4" background="#cdcdcd" color="#ffffff"
                                    height="72"
                                    width="300"
                                    round disabled>
                            已兑换
                        </app-button>
                    </view>
                </template>

                <view class="user-list" v-if="(list.status==2 && list.lottery.type ==2) || list.status == 1">
                    <view class="user">已有{{num}}人参与</view>
                    <view class="flex-wrap">
                        <block v-for="(v,k) in user_list" :key="k">
                            <image class="box-grow-0" :src="v.user.userInfo.avatar"></image>
                        </block>
                    </view>
                    <view v-if="num > 30" class="t-medium end">仅显示最近参与30人</view>
                </view>

                <view class="detail-suc" v-else>
                    <view class="main-center cross-center people">已有{{num}}人参与 {{list.ok_num}}人中奖</view>
                    <view class="father">
                        <view v-for="(v,k) in user_list" :key="k"
                              class="dir-left-nowrap cross-center user-winning-list">
                            <image class="box-grow-0" :src="v.user.userInfo.avatar"></image>
                            <view class="box-grow-1">{{ v.user.nickname }}</view>
                            <view class="dir-top-nowrap box-grow-0 main-right right">
                                <view class="main-right text-num">{{ v.lucky_code }}</view>
                                <view class="main-right text-code">幸运码</view>
                            </view>
                        </view>
                    </view>
                    <view v-if="list.ok_num>3 && !args" class="load" @click="userload">加载更多</view>
                </view>

                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "detail",

        data() {
            return {
                page: 1,
                load: false,
                args: false,
                title: '抽奖',
                list: {},
                num: '',
                user_list: null,
                setting: {},
            }
        },
        computed: {
            ...mapState({
                lotteryConfig: state => state.mallConfig.plugin.lottery,
            }),
        },
        onLoad(options) { this.$commonLoad.onload(options);
            const self = this;
            self.getSetting();

            self.$showLoading();
            self.$request({
                url: self.$api.lottery.detail,
                data: {
                    id: options.id ? options.id : 0,
                    lottery_id: options.lottery_id ? options.lottery_id : 0,
                },
                method: 'POST'
            }).then(info => {
                self.$hideLoading();
                if (info.code === 0) {
                    [self.list, self.num, self.user_list] = [info.data.list, info.data.num, info.data.user_list];
                } else {
                    uni.showModal({
                        title: '提示',
                        content: info.msg,
                        showCancel: false,
                        success: function (e) {
                            if (e.confirm) {
                                uni.navigateBack({delta: 1});
                            }
                        }
                    });
                }
            }).catch(e => {
                self.$hideLoading();
            })
        },

        // #ifdef MP
        onShareAppMessage() {
            return this.hShareAppMessage();
        },
        // #endif
        methods: {
            hShareAppMessage(s = false) {
                return this.$shareAppMessage({
                    title: this.list.goods.app_share_title ? this.list.goods.app_share_title : this.title,
                    path: '/plugins/lottery/goods/goods',
                    imageUrl: this.list.goods.app_share_pic ? this.list.goods.app_share_pic : '',
                    params: {
                        lottery_id: this.list.lottery_id,
                    },
                }, s);
            },
            userload: function () {
                const self = this;
                if (self.args || self.load)
                    return;
                self.load = true;
                let page = self.page + 1;

                self.$request({
                    url: self.$api.lottery.detail,
                    data: {
                        page: page,
                        lottery_id: self.list.lottery_id,
                    }
                }).then(info => {
                    if (info.code === 0) {
                        [self.page, self.args, self.user_list] = [page, info.data.user_list.length < 6, self.user_list.concat(info.data.user_list)];
                    }
                    self.load = false;
                });
            },

            getSetting: function () {
                const self = this;
                self.$request({
                    url: self.$api.lottery.setting,
                }).then(info => {
                    if (info.code === 0) {
                        self.setting = info.data.setting;
                    }
                });
            },
            navGoods() {
                uni.navigateTo({url: `/plugins/lottery/goods/goods?lottery_id=` + this.list.lottery_id})
            },
            qrcode() {
                uni.navigateTo({url: `/plugins/lottery/qrcode/qrcode`})
            },
            prize() {
                uni.navigateTo({url: `/plugins/lottery/lucky-code/lucky-code?lottery_id=` + this.list.lottery_id});
            },
            moreLottery() {
                uni.redirectTo({url: `/plugins/lottery/index/index`});
            },
            submit: function () {
                const list = this.list;
                const mchList = [{
                    "mch_id": 0,
                    "lottery_log_id": list.id,
                    "goods_list": [{
                        "id": list.goods.id,
                        "attr": list.attr.attr_list,
                        "num": 1,
                        "cart_id": 0,
                        "goods_attr_id": list.goods.attr_id,
                    }]
                }];
                uni.navigateTo({
                    url: '/pages/order-submit/order-submit?mch_list=' +
                        JSON.stringify(mchList) +
                        '&preview_url=' + encodeURIComponent(this.$api.lottery.order_preview) +
                        '&submit_url=' + encodeURIComponent(this.$api.lottery.order_submit)
                });
            }
        }
    }
</script>
<style scoped lang="scss">
    .head-bg {
        background-size: 100% 100%;
        background-repeat: no-repeat;
        height: #{242rpx};
        width: 100%;
    }
    .attr-text {
        color: #999999;
        font-size: #{26rpx};
        margin-top: #{14rpx};
        max-width: #{335rpx};

        text:after {
            content: '，'
        }

        text:last-child:after {
            content: ''
        }
    }

    .load {
        text-align: center;
        color: #999;
        font-size: #{24rpx};
        padding-bottom: #{20rpx};
    }

    .bg {
        min-height: 100vh;
    }

    .lottery-share {
        margin: #{20rpx} 0;

        image {
            height: #{140rpx};
            margin: 0 auto;
            width: #{702rpx};
            display: block;
        }
    }

    .no-content {
        color: #888;
        padding: #{100rpx} 0 0 0;
        text-align: center;
    }

    .limit[data-limit]:before {
        content: attr(data-limit);
        font-size: #{24rpx};
        color: #ff4544;
        border: 1px solid #ff4544;
        padding: 0 #{12rpx};
        height: #{40rpx};
        text-align: center;
        line-height: #{40rpx};
        background: #fff;
        border-radius: #{20rpx};
        margin-right: #{12rpx};
        display: inline-block;
    }

    .detail-head-a {
        padding-top: #{64rpx};
        color: #FFFFFF;
        margin-bottom: #{32rpx};

        .icon-march {
            margin-right: #{48rpx};
            width: #{88rpx};
            height: #{88rpx};
            background-image: url('./../image/lottery-march.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .icon-wait {
            margin-right: #{48rpx};
            width: #{88rpx};
            height: #{88rpx};
            background-image: url('./../image/lottery-go.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .text-success {
            font-size: #{32rpx};
        }

        .text-time {
            margin-top: #{10rpx};
            font-size: #{28rpx};
        }
    }

    .detail-lucky {
        color: #fff;
        font-size: #{28rpx};
        padding-bottom: #{16rpx};

        .icon-arrow-right-white {
            width: #{16rpx};
            height: #{30rpx};
            margin-left: #{16rpx};
            background-image: url('../../../static/image/icon/arrow-right-white.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
    }

    .goods {
        padding: 0 #{32rpx};
        font-size: #{32rpx};
        color: #353535;

        image {
            display: block;
            width: #{280rpx};
            height: #{280rpx};
        }

        .stock {
            color: #999999;
            margin-top: #{30rpx};
            margin-bottom: #{30rpx};
            font-size: #{28rpx};

            text {
                font-size: #{36rpx};
                color: #ff4544;
                font-weight: bold;
                padding: 0 #{5rpx};
            }
        }

        .goods-center {
            padding-left: #{24rpx};
        }

        .price {
            color: #ff4544;
        }

        .original-price {
            text-decoration: line-through;
            padding-left: #{12rpx};
            color: #999;
        }
    }

    .open {
        padding: 0 #{35rpx};
        margin: #{40rpx} 0 #{32rpx} 0;

        .share {
            padding-right: #{32rpx};
        }

        .more-lottery {
            background: #ffffff;
            color: #ff4544;
            font-size: #{28rpx};
            height: #{72rpx};
            border-radius: #{36rpx};
            text-align: center;
            line-height: #{72rpx};
            border: 1px solid #ff4544;
        }

        .a {
            width: #{300rpx};
        }

        .b {
            width: #{500rpx};
        }
    }

    .user-list {
        border-top: #{1px} solid #e2e2e2;
        padding: 0 #{32rpx};

        .user {
            font-size: #{28rpx};
            margin-top: #{40rpx};
            margin-bottom: #{32rpx};
            text-align: center;
            color: #666;
        }

        image {
            display: block;
            width: #{56rpx};
            height: #{56rpx};
            margin: 0 #{3rpx} #{20rpx} #{4rpx};
        }

        .end {
            color: #999999;
            text-align: center;
            font-size: #{24rpx};
        }
    }
    .detail-box {
        padding-top: #{16rpx};
        min-height: calc(100vh - #{242rpx});
    }
    .detail-center-a {
        background: #fff;
        border-radius: #{16rpx};
        margin: 0 #{24rpx};
        padding: #{32rpx} 0;

        .people {
            background: #fff7e7;
            margin-top: #{32rpx};
            padding: #{26rpx} #{32rpx};

            .text {
                color: #666;
                font-size: #{24rpx};
            }

            .ok {
                color: #353535;
                padding-top: #{10rpx};
                font-size: #{28rpx};

                text {
                    font-weight: bold;
                    color: #FF4544;
                    padding: 0 #{5rpx};
                }
            }

            .jt {
                font-size: #{24rpx};
                color: #999999;

                .icon-arrow-right {
                    background-image: url("../../../static/image/icon/arrow-right.png");
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    width: #{16rpx};
                    height: #{30rpx};
                    margin-left: #{16rpx};
                }
            }
        }
    }

    .detail-head-b {
        padding-top: #{72rpx};
        color: #fff;
        font-size: #{28rpx};
        margin-bottom: #{32rpx};

        .icon-winning {
            margin-right: #{48rpx};
            width: #{88rpx};
            height: #{88rpx};
            background-image: url('./../image/lottery-success.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .icon-error {
            margin-right: #{48rpx};
            width: #{88rpx};
            height: #{88rpx};
            background-image: url('./../image/lottery-error.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .icon-people {
            margin-right: #{48rpx};
            width: #{88rpx};
            height: #{88rpx};
            background-image: url('./../image/lottery-people.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .text-winning {
            font-size: #{32rpx};
        }

        .text-code {
            margin-top: #{8}rpx;
            font-size: #{28rpx};
        }
    }

    .detail-suc {
        background: #f7f7f7;
        color: #353535;
        font-size: #{28rpx};
        margin: 0 #{32rpx};

        .people {
            text-align: center;
            height: #{88rpx};
            background: #f7f7f7;
            border-bottom: 1px solid #e2e2e2;
        }

        .user-winning-list:first-child {
            padding-top: #{32rpx};
        }

        .user-winning-list {
            padding-bottom: #{32rpx};

            image {
                display: block;
                width: #{64rpx};
                height: #{64rpx};
                margin: 0 #{32rpx} 0 #{40rpx};
                border-radius: 50%;
            }

            .right {
                margin-right: #{40rpx};

                .text-num {
                    font-size: #{28rpx};
                    color: #353535;
                }

                .text-code {
                    margin-top: #{5rpx};
                    font-size: #{22rpx};
                    color: #999999;
                }
            }
        }
    }
</style>