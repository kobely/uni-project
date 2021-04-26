<template>
    <app-layout>
        <view v-if="award.status==3 || award.status==4" class="dir-left-nowrap cross-center lucky-head">
            <image class="lucky-logo" src="./../image/lottery-code.png"></image>
            <image class="box-grow-0 lucky-user-ok" :src="award.user.userInfo.avatar"></image>
            <view class="box-grow-1 lucky-name">{{award.user.nickname}}</view>
            <view class="dir-top-nowrap box-grow-0 main-right lucky-right">
                <view class="main-right">{{award.lucky_code}}</view>
                <view class="main-right lucky-text">获赠幸运码</view>
            </view>
        </view>
        <view class="lucky-center">
            <view class="main-center cross-center lucky-code">
                <block v-if="award.status==3 || award.status==4">其他</block>
                <block wx:else>持有</block>
                <text>{{num}}个幸运码</text>
            </view>

            <view class="lucky-info">
                <view v-if="own.status==1 || own.status==2" class="dir-left-nowrap cross-center lucky-parent-list">
                    <image class="box-grow-0" :src="own.user.userInfo.avatar"></image>
                    <view class="box-grow-1 lucky-name">{{own.user.nickname}}</view>
                    <view class="dir-top-nowrap box-grow-0 main-right lucky-right">
                        <view class="main-right">{{own.lucky_code}}</view>
                        <view class="main-right lucky-text">幸运码</view>
                    </view>
                </view>
                <block v-for="(v,k) in parent" :key="k">
                    <view class="dir-left-nowrap cross-center lucky-parent-list">
                        <image class="box-grow-0" :src="v.childUser.userInfo.avatar"></image>
                        <view class="box-grow-1 lucky-name">{{v.childUser.nickname}}</view>
                        <view class="dir-top-nowrap box-grow-0 main-right lucky-right">
                            <view class="main-right">{{v.lucky_code}}</view>
                            <view class="main-right lucky-text">获赠幸运码</view>
                        </view>
                    </view>
                </block>
                <view v-if="parent.length>=9 && !args" class="lucky-more" @click="more">
                    加载更多
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    export default {
        name: "lucky-code",
        components: {},
        data() {
            return {
                lottery_id: '',
                award: {user:{userInfo:{}}},
                num: 0,
                own: {user:{userInfo:{}}},
                page: 1,
                parent: [],
            }
        },

        onLoad(options) { this.$commonLoad.onload(options);
            const self = this;
            self.lottery_id = options.lottery_id;
            self.$showLoading({title: '加载中'});
            self.$request({
                url: self.$api.lottery.code,
                data: {
                    lottery_id: self.lottery_id,
                }
            }).then(info => {
                self.$hideLoading();
                if (info.code === 0) {
                    [self.award, self.num, self.own, self.parent] = [info.data.award, info.data.num, info.data.own, info.data.parent];
                }
            }).catch(e => {
                self.$hideLoading();
            })
        },
        methods: {
            more: function () {
                const self = this;
                if (self.args || self.load) return
                self.load = true;

                let page = self.page + 1;
                self.$request({
                    url: self.$api.lottery.code,
                    data: {
                        page: page,
                        lottery_id: self.lottery_id,
                    }
                }).then(info => {
                    if (info.code === 0) {
                        [self.page, self.args, self.parent] = [page, info.data.parent.length === 0, self.parent.concat(info.data.parent)];
                    }
                    self.load = false;
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .lucky-head {
        border: #{1rpx} solid #ff4544;
        position: relative;
        background: #ffffff;
        margin: #{40rpx} #{24rpx} #{16rpx};
        border-radius: #{16rpx};
        height: #{140rpx};

        .lucky-logo {
            position: absolute;
            top: 0;
            left: 0;
            width: #{84rpx};
            height: #{84rpx};
        }

        .lucky-user-ok {
            display: block;
            width: #{64rpx};
            height: #{64rpx};
            margin-left: #{40rpx};
            border-radius: 50%;
        }
    }

    .lucky-center {
        font-size: #{28rpx};
        color: #353535;
        background: #ffffff;
        margin: #{24rpx} #{24rpx} 0;
        border-radius: #{16rpx};

        .lucky-code {
            height: #{88rpx};
            border-bottom: #{1rpx} solid #e2e2e2;
        }

        .lucky-info {
            padding: #{16rpx} 0;

            .lucky-parent-list {
                padding: #{16rpx} 0;

                image {
                    display: block;
                    width: #{64rpx};
                    height: #{64rpx};
                    margin-left: #{40rpx};
                    border-radius: 50%;
                }
            }
        }
    }

    .lucky-name {
        margin: 0 #{32rpx};
        color: #353535;
    }

    .lucky-right {
        margin-right: #{40rpx};
        color:#353535;
        .lucky-text {
            color: #999999;
            font-size: #{22rpx};
        }
    }

    .lucky-more {
        font-size: #{24rpx};
        color: #999999;
        padding: #{16rpx} 0;
        text-align: center;
    }

</style>