<template>
    <view class="bg">
        <app-layout :haveBackground="haveBackground">
            <view v-if="userInfo" class="main dir-top-nowrap main-center cross-center">
                <image class="avatar" :src="userInfo.avatar"></image>
                <view>会员付款码</view>
                <view style="color: #ff4544;">{{pay_code}}</view>
                <image class="qr" :src="file_path"></image>
                <view style="color: #999999;">5分钟过期，过期后自动刷新</view>
                <view>请提供二维码给店员扫码即可进行支付</view>
                <view class="balance main-between cross-center" @click="toBalance">
                    <view class="dir-left-nowrap cross-center">
                        <view class="icon main-center cross-center">
                            <image src="/static/image/icon/cash/icon-balance.png"></image>
                        </view>
                        <view>账户余额</view>
                    </view>
                    <image class="right" src="/static/image/icon/arrow-right.png"></image>
                </view>
            </view>
        </app-layout>
    </view>
</template>

<script>

    import { mapState } from "vuex";

    export default {
        data() {
            return {
                haveBackground: false,
                pay_code: '',
                file_path: '',
                expiry_date: '',
                check: null,
                reload: null
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
            })
        },
        onHide() {
            clearInterval(this.check);
            clearInterval(this.reload);
        },
        onUnload() {
            clearInterval(this.check);
            clearInterval(this.reload);
        },
        methods: {
            toBalance() {
                uni.navigateTo({
                    url: `/pages/balance/balance`,
                });
            },
            checkTime() {
                let that = this;
                let timestamp = Date.parse(new Date()) /1000;
                let time = (that.expiry_date - timestamp) * 1000;
                this.reload = setTimeout(()=>{
                    that.getList();
                },time)
            },
            getCode(pay_code) {
                let that = this;
                that.$request({
                    url: that.$api.teller.search,
                    data: {
                        pay_code: pay_code
                    },
                    method: 'post'
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0 && this.userInfo) {
                        if(response.data.is_use) {
                            clearInterval(this.check);
                            clearInterval(this.reload);
                            uni.navigateTo({
                                url: `/plugins/teller/result/result?code=` + pay_code,
                            });
                        }else {
                            this.check = setTimeout(()=>{
                                that.getCode(pay_code);
                            },5000)
                        }
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.teller.code,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.pay_code = response.data.pay_code;
                        that.file_path = response.data.file_path;
                        that.expiry_date = response.data.expiry_date;
                        that.getCode(response.data.pay_code);
                        that.checkTime();
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
        },

        onShow(options) {
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.getList();
        }
    }
</script>

<style scoped lang="scss">
    .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, #495aff, #0ab6fe);
    }
    .main {
        margin: #{96rpx} auto;
        background-color: #fff;
        width: #{690rpx};
        height: #{980rpx};
        border-radius: #{16rpx};
        padding-bottom: #{110rpx};
        position: relative;
        view {
            margin: #{8rpx} 0; 
            font-size: #{26rpx};
        }
        .avatar {
            position: absolute;
            left: 50%;
            top: #{-65rpx};
            border-radius: 50%;
            margin-left: #{-65rpx};
            z-index: 10;
            width: #{128rpx};
            height: #{128rpx};
            border: #{2rpx} solid #ffffff;
        }
        .qr {
            width: #{430rpx};
            height: #{430rpx};
            border-radius: #{16rpx};
            border: #{2rpx} solid #e2e2e2;
            margin-top: #{38rpx};
            margin-bottom: #{12rpx};
        }
        .balance {
            position: absolute;
            bottom: #{56rpx};
            background-color: #f0f0f0;
            height: #{120rpx};
            width: 100%;
            padding: 0 #{19rpx};
            color: #353535;
            .icon {
                width: #{72rpx};
                height: #{72rpx};
                border-radius: 50%;
                background-color: #fff;
                margin-right: #{19rpx};
                image {
                    width: #{40rpx};
                    height: #{40rpx};
                }
            }
            .right {
                width: #{12rpx};
                height: #{22rpx};
            }
        }
    }
</style>