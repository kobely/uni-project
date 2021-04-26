<template>
    <app-layout>
        <view class="list">
            <view class="account-date main-center cross-center">
                <image @click="dateLess" class="account-icon"
                       src="../../../../static/image/icon/arrow-left.png"></image>
                <picker mode="date" :value="date" fields="month" @change="dateChange">
                    <view>{{date_a}}</view>
                </picker>
                <image @click="datePlus" class="account-icon"
                       src="../../../../static/image/icon/arrow-right.png"></image>
            </view>
            <view class="no-content" v-if="!list.length">暂无记录</view>
            <view v-else class="account-list">
                <view v-for="(item, index) in list" :key="index" class="account-item dir-left-nowrap cross-center">
                    <view class="box-grow-1 left">
                        <view class="desc t-omit">{{item.desc}}</view>
                        <view class="created">{{item.created_at}}</view>
                    </view>
                    <view class="add-money" v-if="item.type == 1">+{{item.money}}</view>
                    <view class="less-money" v-else>-{{item.money}}</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    export default {
        name: "account-log",
        components: {},
        data() {
            return {
                page: 1,
                args: false,
                load: false,
                mch_id: 0,
                list: [],

                date_a: '',
                data: '',
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.mch_id = options.mch_id;
            this.getNowTime(new Date());
        },
        onReachBottom: function () {
            const self = this;
            if (self.args || self.load)
                return;
            self.load = true;
            let page = self.page + 1;

            self.$request({
                url: self.$api.mch.account_log,
                data: {
                    mch_id: self.mch_id,
                    page: page,
                }
            }).then(info => {
                if (info.code === 0) {
                    [self.page, self.args, self.list] = [page, info.data.list.length === 0, self.list.concat(info.data.list)];
                }
                self.load = false;
            });
        },
        methods: {
            getLog: function () {
                const self = this;
                self.$showLoading();
                self.$request({
                    url: self.$api.mch.account_log,
                    data: {
                        mch_id: self.mch_id,
                        date: self.date
                    }
                }).then(info => {
                    self.$hideLoading();
                    self.list = info.data.list;
                }).catch(e => {
                    self.$hideLoading();
                })
            },

            dateLess: function () {
                let date = this.date;
                let d = new Date(date);
                d.setMonth(d.getMonth() - 1);
                this.getNowTime(d);
            },
            datePlus: function () {
                let date = this.date;
                let d = new Date(date);
                d.setMonth(d.getMonth() + 1);
                this.getNowTime(d);
            },
            dateChange: function (e) {
                let date = e.detail.value;
                let d = new Date(date);
                this.getNowTime(d);
            },

            getNowTime(date) {
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                date = [year, month].map((n) => {
                    n = n.toString()
                    return n[1] ? n : '0' + n
                }).join('-');
                let date_a = date.replace('-', '年') + '月';
                [this.date, this.date_a, this.page, this.args] = [date, date_a, 1, false];
                this.getLog();
            },
        }
    }
</script>

<style scoped lang="scss">
    .account-date {
        position: fixed;
        top: 0;
        width: #{100%};
        height: #{80rpx};
        background: #FFFFFF;
        color: #353535;

        .account-icon {
            height: #{20rpx};
            width: #{12rpx};
            margin: auto #{84rpx};
        }
    }

    .no-content {
        color: #888;
        padding: #{200rpx} 0 0 0;
        text-align: center;
    }

    .account-list {
        margin-top: #{80rpx + 16rpx};

        .account-item {
            background: #FFFFFF;
            height: #{140rpx};
            border-bottom: #{1rpx} solid #e2e2e2;
            padding: 0 #{24rpx};

            .left {
                margin-right: #{24rpx};
            }

            .desc {
                font-size: #{28rpx};
                color: #353535;
            }

            .created {
                margin-top: #{14rpx};
                font-size: #{24rpx};
                color: #666666;
            }

            .add-money {
                font-size: #{48rpx};
                color: #ff4544;
            }

            .less-money {
                font-size: #{48rpx};
                color: #3fc24c;
            }
        }

        .account-item:last-child {
            border-bottom: none;
        }
    }
</style>