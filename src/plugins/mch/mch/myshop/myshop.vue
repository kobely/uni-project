<template>
    <app-layout>
        <block v-if="mch_id">
            <!-- 页面内容 -->
            <view class="myshop-header">
                <view class="fk">今日付款金额（元）</view>
                <view class="fk-num">{{detail.day_order_pay_price_count}}</view>
                <view class="dir-left-nowrap">
                    <view class="box-grow-1 data-col">
                        <view>浏览人数</view>
                        <view>{{detail.visit_count}}</view>
                    </view>
                    <view class="box-grow-1 data-col">
                        <view>付款订单数</view>
                        <view>{{detail.order_pay_count}}</view>
                    </view>
                    <view class="box-grow-1 data-col">
                        <view>付款件数</view>
                        <view>{{detail.order_goods_count}}</view>
                    </view>
                </view>
                <view class="myshop-login">
                    <app-form-id @click="navLogin">
                        <view class="main-center cross-center myshop-account">切换账户</view>
                    </app-form-id>
                </view>
            </view>

            <view class="dir-left-wrap menu-list">
                <view class="box-grow-0 menu-item">
                    <app-form-id @click="navConfig">
                        <image src="./../../image/myshop-shop.png"></image>
                        <view>店铺管理</view>
                    </app-form-id>
                </view>
                <view class="box-grow-0 menu-item">
                    <app-form-id @click="navGoods">
                        <image src="./../../image/myshop-goods.png"></image>
                        <view>商品管理</view>
                    </app-form-id>
                </view>
                <view class="box-grow-0 menu-item">
                    <app-form-id @click="navOrder">
                        <image src="./../../image/myshop-order.png"></image>
                        <view>订单管理</view>
                    </app-form-id>
                </view>
                <view class="box-grow-0 menu-item">
                    <app-form-id @click="navData">
                        <image src="./../../image/myshop-data.png"></image>
                        <view>数据统计</view>
                    </app-form-id>
                </view>
                <view class="box-grow-0 menu-item">
                    <app-form-id @click="navAccount">
                        <image src="./../../image/myshop-zc.png"></image>
                        <view>资产</view>
                    </app-form-id>
                </view>
                <!-- #ifndef MP-BAIDU -->
                <view class="box-grow-0 menu-item">
                    <app-form-id @click="navQrcode">
                        <image src="./../../image/myshop-shop.png"></image>
                        <view>店铺二维码</view>
                    </app-form-id>
                </view>
                <!--#endif -->
            </view>
            <view  @click="showPcUrl" class="myshop-pc">PC端管理网址</view>
            <!-- #ifndef H5 -->
            <view :style="{bottom: iphone ?  `${iphoneHeight}rpx` : '0rpx'}" class="myshop-msg main-center cross-center"
                  v-if="detail.is_add_formid">
                <view class="msg main-center cross-center" @click="setMessage">
                    <view class="btn">消息提醒按钮</view>
                    <!-- #ifndef MP-WEIXIN -->
                    <view class="bout">(剩余{{detail.form_id_count}}次)</view>
                    <!--#endif -->
                </view>
            </view>
            <!--#endif -->
            <view class="pc-url" :class="show_pc_url ? `show`: ``">
                <view class="modal-bg" @click="hidePcUrl"></view>
                <view class="modal-dialog" @click="copyPcUrl">
                    <view class="page-url">{{detail.page_url}}</view>
                    <view class="content">点击可复制内容</view>
                </view>
            </view>
        </block>
    </app-layout>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "myshop",
        computed: {
            ...mapState('gConfig', {
                iphone: (data) => {
                    return data.iphone;
                },
                iphoneHeight: (state) => {
                    return state.iphoneHeight;
                },
            })
        },

        data() {
            return {
                show_pc_url: false,
                mch_id: -1,
                detail: {
                    day_order_pay_price_count: 0,
                    visit_count: 0,
                    order_pay_count: 0,
                    order_goods_count: 0,
                    form_id_count: 0,
                    template_message_list: null,
                },
            }
        },
        onShow() {
            const self = this;
            const mch = this.$storage.getStorageSync('MCH2019');
            if (!mch) {
                uni.redirectTo({
                    url: '/plugins/mch/mch/login/login',
                })
                return;
            }
            self.mch_id = mch.mch.id;

            self.$showLoading({title: '登陆中'});
            self.$request({
                url: self.$api.mch.manage_index,
                data: {
                    mch_id: self.mch_id
                }
            }).then(info => {
                self.$hideLoading();
                if (info.code === 0) {
                    const detail = info.data.detail;
                    if (detail.status === '0') {
                        uni.showModal({
                            title: '提示',
                            content: '店铺已被关闭！请联系管理员',
                            showCancel: false,
                            success: function (e) {
                                if (e.confirm) {
                                    uni.redirectTo({
                                        url: '/plugins/mch/mch/login/login',
                                    })
                                }
                            }
                        });
                    }
                    self.detail = detail;
                } else {
                    uni.redirectTo({
                        url: '/plugins/mch/mch/login/login',
                    })
                }
            });
        },
        methods: {
            navLogin: function () {
                uni.redirectTo({url: `/plugins/mch/mch/login/login`});
            },
            navConfig: function () {
                uni.navigateTo({url: `/plugins/mch/mch/config/config?mch_id=` + this.mch_id});
            },
            navGoods: function () {
                uni.navigateTo({url: `/plugins/mch/mch/goods/goods?mch_id=` + this.mch_id});
            },
            navOrder: function () {
                uni.navigateTo({url: `/plugins/mch/mch/order/order?mch_id=` + this.mch_id});
            },
            navData: function () {
                uni.navigateTo({url: `/plugins/mch/mch/count/count?mch_id=` + this.mch_id});
            },
            navAccount: function () {
                uni.navigateTo({url: `/plugins/mch/mch/account/account?mch_id=` + this.mch_id});
            },
            navQrcode: function () {
                uni.navigateTo({url: `/plugins/mch/mch/qrcode/qrcode?mch_id=` + this.mch_id});
            },
            //MESSAGE
            setMessage: function () {
                //#ifndef MP-WEIXIN
                this.detail.form_id_count++;
                // #endif

                //#ifdef MP-WEIXIN
                this.$subscribe(this.detail.template_message_list).then(res => {

                }).catch();
                // #endif
            },
            //MODEL
            showPcUrl: function () {
                this.show_pc_url = true;
            },
            hidePcUrl: function () {
                this.show_pc_url = false;
            },
            copyPcUrl: function () {
                let data = this.detail.page_url;
                this.$utils.uniCopy({
                    data: data,
                    success(){
                        //#ifndef MP-WEIXIN
                        uni.showToast({ title: '复制成功'});
                        // #endif
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .myshop-header {
        background: #26a5ef;
        color: #fff;
        background: -webkit-gradient(linear, 0 0, 0 bottom, from(#44b9fe), to(#028dde));
        padding: #{48rpx} 0 #{32rpx};
        overflow: hidden;
        .fk {
            font-size: #{26rpx};
            text-align: center;
            margin-bottom: #{40rpx};
        }
        .fk-num {
            text-align: center;
            font-size: 19pt;
            font-weight: bold;
            line-height: 1;
            margin-bottom: #{64rpx};
        }
        .data-col {
            text-align: center;
            border-right: #{1rpx} solid rgba(255, 255, 255, 0.35);
        }
    }

    .myshop-login {
        position: absolute;
        top: #{40rpx};
        left: #{24rpx};

        .myshop-account {
            position: relative;
            border: 1px solid #FFFFFF;
            border-radius: #{20rpx};
            width: #{120rpx};
            font-size: #{24rpx};
            height: #{40rpx};
        }
    }

    .myshop-pc {
        text-align: center;
        margin-top: #{40rpx};
        color: #999999;
        font-size:#{24rpx};
    }

    .myshop-msg {
        position: fixed;
        bottom: #{0rpx};
        width: 100%;
        height: #{120rpx};
        margin: 0 auto;

        .msg {
            width: #{702rpx};
            height: #{80rpx};
            border-radius: #{999rpx};
            color: #fff;
            background: #ff4544;

            .btn {
                font-size: #{32rpx};
            }

            .bout {
                font-size: #{24rpx};
            }
        }
    }


    .menu-list {
        flex-wrap: wrap;
        margin-bottom: #{24rpx};
        -webkit-flex-wrap: wrap;
        background: #fff;
        padding: #{60rpx} 0 0;
        .menu-item {
            width: 33.333333%;
            text-align: center;
            font-size: #{26rpx};
            margin-bottom: #{80rpx};
        }
        .menu-item image {
            width: #{94rpx};
            height: #{94rpx};
            margin-bottom: #{6rpx};
        }

    }
    .pc-url.show {
        visibility: visible;
        opacity: 1;
    }

    .pc-url {
        position: fixed;
        left: 0;
        top: 0;
        height: 100%;
        z-index: 100;
        margin: #{100rpx};
        visibility: hidden;
        opacity: 0.5;
        transition: 200ms;

        .modal-bg {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
        }

        .modal-dialog {
            background: #fff;
            padding: #{32rpx};
            border-radius: #{16rpx};
            overflow: hidden;
            word-break: break-all;
            position: relative;

            .page-url {
                margin-bottom: #{32rpx};
                color: #353535
            }

            .content {
                font-size: #{24rpx};
                color: #888;
                text-align: center
            }
        }

    }
</style>