<template>
    <app-layout>
        <view v-if="setting" class="balance-head dir-top-nowrap cross-center"
              :style="{'background-image': `url(${setting.bj_pic_url.url})`}">
            <image @click="getRules" class="balance-legend"
                   :src="setting.re_pic_url.url ? setting.re_pic_url.url : `/static/image/icon/question.png`"></image>
            <view class="account">账户余额(元)</view>
            <view class="balance">{{balance}}</view>
            <view class="app-button main-center">
                <app-button @click="recharge" fontSize="28" padding="0 13px" borderColor="#FFFFFF" background="rgba(255,255,255,0)" color="#FFFFFF" round height="56">{{setting.re_name}}
                </app-button>
                <view style="margin-left: 26rpx;white-space: nowrap">
                    <app-button @click="password" v-if="setting.is_pay_password == 1" borderColor="#FFFFFF" fontSize="28" background="rgba(255,255,255,0)" padding="0 13px" color="#FFFFFF" round height="56">设置密码
                    </app-button>
                </view>
            </view>
        </view>
        <!-- 仅跳转 -->
        <app-jump-button v-if="setting && setting.ad_pic_url" :open_type="setting.open_type" :url="setting.page_url"
                         :params="setting.params">
            <image class="balance-ad" :src="setting.ad_pic_url.url"></image>
        </app-jump-button>

        <view class="balance-date main-center cross-center">
            <view class="icon-view cross-center main-center" @click="dateLess">
                <image class="balance-icon" src="/static/image/icon/arrow-left.png"></image>
            </view>
            <picker mode="date" :value="date" fields="month" @change="dateChange">
                <view>{{date_a}}</view>
            </picker>
            <view class="icon-view cross-center main-center" @click="datePlus">
                <image class="balance-icon" src="/static/image/icon/arrow-right.png"></image>
            </view>
        </view>
        <block v-for="(item,index) in logs" :key="index">
            <app-form-id @click="detail(item)" open-type="navigate">
                <view class="dir-left-nowrap cross-center balance-list">
                    <view class="box-grow-1 dir-top-nowrap">
                        <view class="balance-desc dir-left-nowrap t-omit">{{item.desc}}</view>
                        <view class="balance-time">{{item.created_at}}</view>
                    </view>
                    <view v-if="item.type == 1" class="box-grow-0 balance-plus">+{{item.money}}</view>
                    <view v-if="item.type == 2" class="box-grow-0 balance-less">-{{item.money}}</view>
                </view>
            </app-form-id>
        </block>
    </app-layout>
</template>

<script>
    export default {
        name: "balance",
        onShow: function () {
            this.getSetting();
            this.getNowTime(new Date());
        },
        onReachBottom: function () {
            const self = this;
            if (self.args || self.load)
                return;
            self.load = true;
            let page = self.page + 1;
            this.$request({
                url: self.$api.balance.logs,
                data: {
                    page: page,
                    date: self.date,
                }
            }).then(info => {
                if (info.code === 0) {
                    [self.page, self.args, self.logs] = [page, info.data.list.length === 0, self.logs.concat(info.data.list)];
                }
                self.load = false;
            });
        },
        data() {
            return {
                balance: 0,
                setting: null,
                logs: null,
                page: 1,
                load: false,
                args: false,
                showHidden: false,
                date: '',
                date_a: '',
            }
        },
        methods: {
            recharge: function () {
                uni.navigateTo({url: `/pages/balance/recharge`});
            },
            password: function () {
                uni.navigateTo({url: `/pages/balance/password`});
            },
            detail: function (row) {
                uni.navigateTo({url: `/pages/balance/detail?id=` + row.id});
            },
            getRules: function () {
                uni.navigateTo({
                    url: `/pages/rules/index?url=${encodeURIComponent(this.$api.balance.index)}&keys=${JSON.stringify(['setting', 'explain'])}`,
                });
            },
            getSetting: function () {
                const self = this;
                self.$request({
                    url: self.$api.balance.index,
                }).then(info => {
                    if (info.code === 0) {
                        this.setting = info.data.setting;
                        this.balance = info.data.balance;
                    }
                });
            },
            getLog: function () {
                const self = this;
                self.$showLoading({title: `加载中`});
                this.$request({
                    url: self.$api.balance.logs,
                    data: {date: self.date}
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        self.logs = info.data.list;
                    }
                }).catch(() => {
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
    .balance-head {
        height: #{324rpx};
        width: #{100%};
        color: #FFFFFF;

        .account {
            font-size: #{26rpx};
            margin-top: #{48rpx};
        }

        .balance {
            font-size: #{88rpx};
            margin: #{20rpx} auto;
        }

        .app-button {
            margin-bottom: #{48rpx};
        }
    }

    .balance-legend {
        height: #{36rpx};
        width: #{36rpx};
        align-self: flex-end;
        position: absolute;
        top: #{32rpx};
        right: #{24rpx};
    }

    .balance-ad {
        height: #{180rpx};
        width: #{750rpx};
        margin: #{20rpx} 0;
    }

    .balance-date {
        width: #{100%};
        height: #{80rpx};
        background: #FFFFFF;

        .icon-view {
            width: #{84rpx + 84rpx + 12rpx};
            height: 100%;
        }

        .balance-icon {
            height: #{20rpx};
            width: #{12rpx};
        }
    }

    .balance-list {
        height: #{140rpx};
        border-top: #{1px} solid #e2e2e2;
        padding: 0 #{24rpx};
        background: #FFFFFF;

        .balance-desc {
            font-size: #{28rpx};
            color: #353535;
            padding-right: #{24rpx};
        }

        .balance-time {
            font-size: #{24rpx};
            margin-top: #{30rpx};
            color: #666666;
        }

        .balance-plus {
            font-weight: bold;
            font-size: #{48rpx};
            color: #ff4544;
        }

        .balance-less {
            font-weight: bold;
            font-size: #{48rpx};
            color: #3fc24c;
        }
    }
</style>