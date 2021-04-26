<template>
    <app-layout>
        <view class="dir-top-nowrap recharge" v-if="pageShow">
            <view class="account">我的账户</view>
            <view :style="{'background-image': `url(${appImg.mall.balance_recharge})`}"
                  class="dir-left-nowrap bg cross-center">
                <image class="image box-grow-0" src="./image/icon-balance.png"></image>
                <view class="balance-text box-grow-1">{{customPage.balance_title}}</view>
                <view class="balance-price box-grow-0">{{balance}}</view>
            </view>
            <view class="amount-text">{{customPage.recharge_amount_title}}</view>
            <view class="dir-left-wrap select">
                <view v-for="(item,index) in list" :key="index" @click="setPrice(index)"
                      class="dir-top-nowrap cross-center main-center box" :class="index === selected? 'active':''">
                    <view class="price">充{{ item.pay_price }}元</view>
                    <view class="send" v-if="item.send_price > 0">送{{ item.send_price }}元</view>
                    <view class="send" v-if="item.send_integral > 0">送{{ item.send_integral }}积分</view>
                    <view class="send dir-left-nowrap cross-center" v-if="item.member">
                        <view class="t-omit">送{{ item.member.name }}</view>
                        <view class="box-grow-0 member-info main-center cross-center"
                              @click.stop="navMember(item.member)">详情
                        </view>
                    </view>
                </view>
            </view>
            <view class="input" :class="selected === -1 && getFocus ? `red`: `grey`" v-if="setting.type === `1`">
                <input @focus="bindFocus" placeholder-style="color:#bbbbbb" v-model="pay_price" type="digit"
                       :focus="getFocus"
                       @blur="bludBlur"
                       @input="changeInput"
                       :placeholder="`手动输入` + customPage.recharge_amount_title"/>
            </view>
            <view class="btn">
                <app-button @click="submit"
                            :round-size="customPage.recharge_btn_radius+ `rpx`"
                            :color="customPage.recharge_btn_color"
                            height="88"
                            :border-color="customPage.recharge_btn_background"
                            :background="customPage.recharge_btn_background">{{customPage.recharge_btn_title}}
                </app-button>
            </view>
            <view class="account">{{customPage.recharge_explanation_title}}</view>
            <app-text class="text" :content="setting.explain"></app-text>
        </view>
    </app-layout>
</template>

<script>
import {mapState} from 'vuex';
import appText from '../../components/basic-component/app-rich/parse.vue';

export default {
    name: "recharge",
    computed: {
        ...mapState({
            customPage: state => state.mallConfig.recharge_page_custom,
            appImg: state => state.mallConfig.__wxapp_img,
            userInfo: state => state.user.info,
        }),
    },
    data() {
        return {
            setting: null,
            list: null,
            pay_price: '',
            balance: '￥',
            selected: -1,
            getFocus: false,
            pageShow: false,
        }
    },
    onShow: function () {
        this.loadData();
    },

    components: {
        appText
    },
    watch: {
        pay_price: {
            handler: function (newData, oldData) {
                if (newData) {
                    this.selected = -1;
                }
            }
        }
    },

    methods: {
        navMember: function (member) {
            uni.navigateTo({
                url: `/pages/member/upgrade/upgrade?level=${member.level}`
            });
        },
        getSetting: function () {
            const self = this;
            self.$request({
                url: self.$api.balance.index,
            }).then(info => {
                if (info.code === 0) {
                    self.pageShow = true;
                    if (info.data.setting.status === `1`) {
                        self.setting = info.data.setting;
                        self.balance = '￥' + info.data.balance;
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: '尚未开启余额功能',
                            showCancel: false,
                            confirmText: '确定',
                            success(e) {
                                if (e.confirm) {
                                    uni.navigateBack({delta: 1})
                                }
                                }
                            });
                        }
                    }
                })
            },
            loadData: function () {
                const self = this;
                self.getSetting();
                self.$showLoading({title: `加载中`});
                self.$request({
                    url: self.$api.recharge.index,
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        self.list = info.data.list;
                    }
                }).catch(info => {
                    self.$hideLoading();
                })
            },

            bindFocus: function () {
                this.selected = -1;
                this.getFocus = true;
            },

            bludBlur: function () {
                this.getFocus = false;
            },

            changeInput(e) {
            },
            setPrice: function (index) {
                this.pay_price = '';
                this.selected = index;
            },

            submit: function () {
                const self = this;
                let para;
                if (self.selected === -1) {
                    if (self.pay_price > 0) {
                        para = {
                            id: 0,
                            pay_price: self.pay_price,
                            send_price: 0
                        };
                    } else {
                        uni.showToast({
                            title: '金额不能为空',
                            icon: 'none',
                        });
                        return;
                    }
                } else {
                    para = {
                        id: self.list[self.selected].id,
                        pay_price: self.list[self.selected].pay_price,
                        send_price: self.list[self.selected].send_price,
                    }
                }

                self.$showLoading({title: `加载中`});
                self.$request({
                    url: self.$api.recharge.balance_recharge,
                    data: para,
                    method: 'POST',
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        self.$payment.pay(info.data.pay_id).then(e => {
                            uni.showModal({
                                title: '提示',
                                content: '充值成功！',
                                showCancel: false,
                                confirmText: '确定',
                                success(e) {
                                    if (e.confirm) {
                                        uni.navigateBack({delta: 1})
                                    }
                                }
                            });
                        }).catch(e => {
                            //uni.showToast({'title': e, icon: 'none'});
                        });
                    } else {
                        uni.showToast({'title': info.msg, icon: 'none'});
                    }
                }).catch(info => {
                    self.$hideLoading();
                })
            }
        }
}
</script>
<style lang="scss">
    page {
        background: #FFFFFF;
    }
</style>
<style scoped lang="scss">
    .recharge {
        background: #FFFFFF;
        padding: #{40rpx} #{24rpx} 0;
        min-height: 100vh;
        .btn .app-view .app-secondary {
            border-width: 0px !important;
        }

        .account {
            font-size: #{24rpx};
            border-left: #{6rpx} solid #ff4544;
            padding-left: #{24rpx};
            color: #666666;
            margin-bottom: #{32}rpx;
        }

        .bg {
            background-repeat: no-repeat;
            background-size: #{702rpx} #{160rpx};
            height: #{160rpx};
            width: #{702rpx};
            color: #666666;

            .image {
                width: #{72rpx};
                height: #{72rpx};
                margin-left: #{40rpx};
            }

            .balance-text {
                font-size: #{42rpx};
                margin-left: #{20rpx}
            }

            .balance-price {
                font-size: #{46rpx};
                margin-right: #{56rpx};
            }
        }

        .amount-text {
            font-size: #{24rpx};
            color: #999999;
            margin-top: #{56rpx};
        }

        .select {
            margin: 0 #{-12rpx};

            .box {
                height: #{183rpx};
                width: #{339rpx};
                margin: #{24rpx} #{12rpx} 0 #{12rpx};
                padding: 0 24#{rpx};
                border: #{1px} solid #cccccc;
                border-radius: #{16rpx};

                .price {
                    font-size: #{32rpx};
                    font-weight: bold;
                    color: #666666;
                }

                .send {
                    font-size: #{24rpx};
                    color: #999999;
                }

                .member-info {
                    border: 1#{rpx} solid #999999;
                    border-radius: 24#{rpx};
                    height: 30#{rpx};
                    width: 60#{rpx};
                    font-size: 18#{rpx};
                    margin-left: 10#{rpx};
                }
            }

            .active {
                border: #{1px} solid #ff4544;

                .price {
                    color: #ff4544
                }

                .send {
                    color: #ff4544;
                }

                .member-info {
                    border-color: #ff4544;
                }
            }
        }

        .input {
            margin-top: #{40rpx};
            border-radius: #{14rpx};

            input {
                color: #666666;
                height: #{88rpx};
                padding: 0 #{12rpx};
            }
        }

        .input.red {
            border: #{1px} solid #ff4544;
        }

        .input.grey {
            border: #{1px} solid #cccccc;
        }

        .btn {
            margin-top: #{56rpx};
            margin-bottom: #{72rpx};
        }

        .text {
            margin-top: -8rpx;
        }
    }
</style>