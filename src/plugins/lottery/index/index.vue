<template>
    <app-layout>
        <app-swiper :height="280" :list="banner_list" name="pic_url" :autoplay="true"></app-swiper>
        <view @click="qrcode" v-if="setting && setting.cs_status ===1 && setting.cs_prompt_pic" class="lottery-share">
            <image :src="setting.cs_prompt_pic" mode="aspectFit" load-lazy></image>
        </view>

        <view class="dir-top-nowrap bottom">
            <view class="lottery cross-center" v-for="(v,k) in list" :key="k">
                <view class="lottery-image box-grow-0">
                    <view>{{v.lottery_log_count}}人参与</view>
                    <image :src="v.cover_pic" load-lazy></image>
                </view>
                <view class="dir-top-nowrap lottery-desc box-grow-1" @click="goods(v)">
                    <view class="box-grow-0 goods-name t-omit-two">{{v.goods_name}}</view>
                    <view class="box-grow-1 dir-left cross-center activity">
                        <icon class="activity-icon" type></icon>
                        <text v-if="v.new_status == 2">距活动开始：</text>
                        <text v-else>距活动结束：</text>
                        <text v-if="times[k].day>0 || times[k].hour>0">
                            <text class="red">{{times[k].day}}</text>
                            <text>天</text>
                            <text class="red">{{times[k].hour}}</text>
                            <text>小时</text>
                        </text>
                        <text v-if="times[k].day==0 && times[k].hour==0">
                            <text class="red">{{times[k].minute}}</text>
                            <text>分</text>
                            <text class="red">{{times[k].second}}</text>
                            <text>秒</text>
                        </text>
                    </view>
                    <view class="stock box-grow-0">共{{v.stock}}份</view>
                    <view class="dir-left-nowrap cross-center box-grow-0 end">
                        <view class="price box-grow-1 dir-left-nowrap">
                            <view class="currency">免费</view>
                            <view class="original">原价￥{{v.price}}</view>
                        </view>
                        <view class="price box-grow-0">
                            <view v-if="v.new_status == 2" @click.stop>
                                <app-button height="56" font-size="28" color="#FFFFFF" round
                                            background="#cdcdcd" width="164" disabled>尚未开始
                                </app-button>
                            </view>
                            <app-button v-else-if="v.new_status == 1" height="56" font-size="27" color="#FFFFFF" round
                                        background="#cdcdcd" width="164" disabled>已参与
                            </app-button>
                            <view v-else @click.stop="validateIntegral(v)">
                                <app-button height="56" font-size="27" color="#FFFFFF" background="#ff4544" width="164"
                                            round>立即抽奖
                                </app-button>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <app-load-text v-if="load"></app-load-text>
        </view>
        <common-buttom status="index"></common-buttom>
        <integral-model ref="integralModel" :text="deplete_integral_num + '积分'" @next="detail"></integral-model>
    </app-layout>
</template>


<script>
    import appSwiper from "../../../components/page-component/app-swiper/app-swiper.vue";
    import integralModel from "../integral-model.vue";
    import commonButtom from "../common-buttom.vue";
    import {mapGetters} from "vuex";

    export default {
        name: "index",
        components: {appSwiper, commonButtom, integralModel},
        data() {
            let integral;
            return {
                integral,
                args: false,
                load: false,
                page: 1,
                list: null,
                times: null,
                title: '幸运抽奖',
                banner_list: [],
                setting: null,
                template_message: null,
                deplete_integral_num: 0,
            }
        },
        computed: {
            ...mapGetters({
                userInfo: 'user/info',
            })
        },
        onHide: function () {
            clearInterval(this.integral);
        },
        onUnload: function () {
            clearInterval(this.integral);
        },
        onLoad(options) { this.$commonLoad.onload(options);
            const self = this;
            self.$request({
                url: self.$api.lottery.setting,
            }).then(info => {
                if (info.code === 0) {
                    self.setting = info.data.setting;
                    uni.setNavigationBarTitle({
                        title: self.setting.title,
                    });
                    self.title = self.setting.title;
                }
            })
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                withShareTicket: true,
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
        },
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            return this.$shareTimeline({
                title: this.title,
                query: {}
            });
        },
        // #endif
        onReachBottom: function () {
            const self = this;
            if (self.args || self.load)
                return;
            self.load = true;
            let page = self.page + 1;

            self.$request({
                url: self.$api.lottery.index,
                data: {
                    page: page,
                }
            }).then(info => {
                if (info.code === 0) {
                    [self.page, self.args, self.list] = [page, info.data.list.length === 0, self.list.concat(info.data.list)];

                    let time = self.list.map(v => {
                        return v.new_status == 2 ? v.start_at : v.end_at;
                    })
                    self.setTimeStart(time);
                }
                self.load = false;
            });
        },
        onShow: function () {
            const self = this;
            self.$showLoading({title: '加载中'});
            self.$request({
                url: self.$api.lottery.index,
            }).then(info => {
                self.$hideLoading();
                if (info.code === 0) {
                    [
                        self.banner_list,
                        self.list,
                        self.banner_list,
                        self.template_message
                    ] = [
                        info.data.banner_list,
                        info.data.list,
                        info.data.banner_list,
                        info.data.template_message
                    ];
                    [self.page, self.args] = [1, false];
                    let time = self.list.map(v => {
                        return v.new_status == 2 ? v.start_at : v.end_at;
                    })
                    self.setTimeStart(time);
                }
            }).catch(() => {
                self.$hideLoading();
            })
        },
        // #ifdef MP
        onShareAppMessage () {
            return this.$shareAppMessage({
                title: this.title,
                path: '/plugins/lottery/index/index',
                params: {},
            });
        },
        // #endif
        methods: {
            qrcode() {
                uni.navigateTo({url: `/plugins/lottery/qrcode/qrcode`})
            },
            goods(data) {
                uni.navigateTo({
                    url: `/plugins/lottery/goods/goods?lottery_id=${data.id}`
                });
            },
            validateIntegral(column){
                let deplete_integral_num = Number(column.deplete_integral_num);
                if (deplete_integral_num > 0) {
                    this.deplete_integral_num = deplete_integral_num;
                    this.$refs.integralModel.showModel(column.id);
                } else {
                    this.detail(column.id);
                }
            },
            detail(id) {
                this.$subscribe(this.template_message).then(res => {
                    uni.navigateTo({url: `/plugins/lottery/detail/detail?lottery_id=` + id});
                }).catch(res => {
                    uni.navigateTo({url: `/plugins/lottery/detail/detail?lottery_id=` + id});
                });
            },
            setTimeStart(info) {
                const self = this;
                clearInterval(self.integral);
                let func = function (info) {
                    let times = [];
                    info.map((item, index, array) => {
                        let time = item.replace(/-/g, '/');
                        let diff_time = parseInt((new Date(time).getTime() - new Date().getTime()) / 1000)
                        let day = 0, hour = 0, minute = 0, second = 0;

                        if (diff_time > 0) {
                            day = Math.floor(diff_time / (60 * 60 * 24));
                            hour = Math.floor(diff_time / (60 * 60)) - (day * 24);
                            minute = Math.floor(diff_time / 60) - (day * 24 * 60) - (hour * 60);
                            second = Math.floor(diff_time) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                        }
                        times[index] = {day, hour, minute, second}
                    })
                    self.times = times;
                }
                func(info);
                self.integral = setInterval(() => {
                    func(info)
                }, 1000)
            }
        }
    }
</script>

<style scoped lang="scss">
    .lottery-share {
        margin-top: #{20rpx};

        image {
            height: #{150rpx};
            width: 100%;
            display: block;
        }
    }
    .bottom {
        //margin-bottom: #{96rpx}
    }
    .lottery {
        margin-top: #{20rpx};
        width: 100%;
        height: #{268rpx};
        background: #FFFFFF;

        .lottery-image {
            padding-left: #{24rpx};
            position: relative;
            margin: #{24rpx} 0;

            view {
                position: absolute;
                top: 0;
                left: #{24rpx};
                color: #ff4544;
                background: #ffe4e7;
                line-height: #{40rpx};
                padding: 0 #{12rpx};
                border-radius: 0 #{25rpx} #{25rpx} 0;
                font-size: #{24rpx};
            }

            image {
                width: #{220rpx};
                height: #{220rpx};
                display: block;
            }
        }

        .lottery-desc {
            align-self: flex-start;
            margin: #{24rpx};
            height: #{220rpx};
            .goods-name {
                color: #353535;
                font-size: #{28rpx};
                margin-bottom: #{10rpx};
            }

            .activity-icon {
                background-image: url('./../image/lottery_time.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
                height: #{24rpx};
                width: #{24rpx};
                margin-right: #{12rpx};
            }

            .activity {
                font-size: #{26rpx};
                color: #999999;
                .red {
                    color: #ff4544;
                }
            }

            .stock {
                font-size: #{26rpx};
                color: #999999;
                margin-top: #{10rpx};
            }

            .end {
                width: 100%;
            }

            .price {
                font-size: #{28rpx};
                .currency {
                    color: #ff4544;
                }
                .original {
                    margin-left: #{12rpx};
                    text-decoration: line-through;
                    color: #999999;
                }
            }
        }
    }
</style>