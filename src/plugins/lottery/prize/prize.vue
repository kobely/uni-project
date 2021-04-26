<template>
    <app-layout>
        <view class="no-content" v-if="!list || list.length==0">暂无记录</view>
        <view class="prize-bar dir-left-nowrap">
            <view @click="change(1)" class="box-grow-1" :class="type==1 ? 'activity':''">
                <text>进行中</text>
            </view>
            <view @click="change(2)" class="box-grow-1" :class="type==2 ? 'activity':''">
                <text>已中奖</text>
            </view>
            <view @click="change(3)" class="box-grow-1" :class="type==3 ? 'activity':''">
                <text>未中奖</text>
            </view>
        </view>
        <view class="prize-list">
            <view class="line" v-for="(v,k) in list" :key="k">
                <view class="dir-left-nowrap goods" @click="lotteryDetail(v.lottery_id)">
                    <image class="box-grow-0" :src="v.goods.goodsWarehouse.cover_pic"></image>
                    <view class="dir-top info">
                        <view class="t-omit-three name">{{v.goods.goodsWarehouse.name}}</view>

                        <view class="attr-text dir-left-wrap t-omit">
                            <block v-for="(value,key) in v.attr_list" :key="key">
                                <text>{{value.attr_group_name}}：{{value.attr_name}}</text>
                            </block>
                        </view>
                        <view class="stock">共{{v.lottery.stock}}份</view>
                    </view>
                </view>
                <view class="dir-left-nowrap cross-center end">
                    <icon class="box-grow-0 icon-time" type></icon>
                    <view class="box-grow-1">{{v.time}}</view>
                    <view class="box-grow-0">
                        <view class="prize-detail" @click="lotteryDetail(v.lottery_id)">查看详情</view>
                    </view>
                </view>
            </view>
            <app-load-text v-if="load"></app-load-text>
        </view>
        <common-buttom status="prize"></common-buttom>
    </app-layout>
</template>

<script>
    import commonButtom from "../common-buttom.vue";

    export default {
        name: "prize",
        components: {commonButtom},
        data() {
            return {
                list: null,
                page: 1,
                type: 1,
                load: false,
                args: false,
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.type = options.type ? options.type : 1;
            this.getSetting();
            this.loadData();
        },

        onReachBottom: function () {
            const self = this;
            if (self.args || self.load)
                return;
            self.load = true;
            let page = self.page + 1;
            self.$request({
                url: self.$api.lottery.prize,
                data: {
                    page: page,
                    type: self.type,
                }
            }).then(info => {
                if (info.code === 0) {
                    [self.page, self.args, self.list] = [page, info.data.list.length === 0, self.list.concat(info.data.list)];
                }
                self.load = false;
            });
        },
        methods: {
            getSetting() {
                const self = this;
                self.$request({
                    url: self.$api.lottery.setting,
                }).then(info => {
                    if (info.code === 0) {
                        uni.setNavigationBarTitle({
                            title: info.data.setting.title,
                        })
                    }
                })
            },

            loadData() {
                const self = this;
                self.$showLoading({title: '加载中'});
                self.$request({
                    url: self.$api.lottery.prize,
                    data: {
                        type: self.type
                    }
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        self.list = info.data.list;
                    }
                }).catch(info => {
                    self.$hideLoading();
                })
            },

            change(type) {
                [this.type, this.page, this.args] = [type, 1, false];
                this.loadData();
            },
            lotteryDetail(id) {
                uni.navigateTo({url: `/plugins/lottery/detail/detail?lottery_id=` + id});
            },

        }
    }
</script>

<style scoped lang="scss">
    .attr-text {
        color: #999999;
        font-size: #{28rpx};
        margin-top: #{14rpx};
        max-width: #{480rpx};

        text:after {
            content: '，'
        }

        text:last-child:after {
            content: ''
        }
    }

    .no-content {
        color: #888;
        padding-top: #{200rpx};
        text-align: center;
    }

    .prize-bar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: #fff;
        border-top: #{1rpx} solid #e3e3e3;
        border-bottom: #{1rpx} solid #e3e3e3;
        z-index: 999;

        view {
            color: #666666;
            text-align: center;

            text {
                height: #{90rpx};
                line-height: #{90rpx};
                border-bottom: #{4rpx} solid transparent;
                width: auto;
                display: inline-block;
            }
        }

        .activity {
            text {
                color: #ff4544;
                border-bottom-color: #ff4544;
            }
        }
    }

    .prize-list {
        //padding-bottom: #{96rpx};
        padding-top: #{92rpx};

        .line {
            margin-top: #{20rpx}
        }

        .goods {
            padding: #{24rpx};
            border-bottom: 1px solid #e2e2e2;
            background: #ffffff;

            image {
                display: block;
                width: #{160rpx};
                height: #{160rpx};

            }

            .info {
                font-size: #{28rpx};
                margin-left: #{24rpx};
                margin-top: #{16rpx};

                .name {
                    color: #353535;
                }

                .stock {
                    margin-top: #{10rpx};
                    color: #999999;
                }
            }
        }
    }

    .prize-detail {
        height: #{46rpx};
        line-height: #{46rpx};
        width: #{148rpx};
        border-radius: #{24rpx};
        color: #FF4544;
        border: #{1px} solid #ff4544;
        background: #FFFFFF;
        font-size: #{28rpx};
        text-align: center;
    }

    .end {
        color: #999999;
        font-size: #{28rpx};
        height: #{72rpx};
        background: #FFFFFF;
        padding: 0 #{24rpx};

        .icon-time {
            background-repeat: no-repeat;
            background-size: 100% 100%;
            height: #{24rpx};
            width: #{24rpx};
            margin-right: #{12rpx};
            background-image: url("./../image/lottery_time.png");
        }
    }
</style>