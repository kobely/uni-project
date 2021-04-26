<template>
    <app-layout>
        <view class="price-show dir-top-nowrap main-center cross-center">
            <view class="title">可提现金额（元）</view>
            <view class="price">{{middleman.money}}</view>
            <view @click="toCash" class="cash-btn" :style="{'color': getTheme.color, 'border-color': getTheme.border}">去提现</view>
        </view>
        <view class="menu">
            <view @click="toDetail" class="menu-item main-between cross-center">
                <view>提现明细</view>
                <image src="/static/image/icon/arrow-right.png"></image>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appMenu from '../components/app-menu';

    export default {
        data() {
            return {
                middleman: {},
                setting: {},
                middleman: {},
                apply_at: ''
            }
        },
        components: {
            "app-menu": appMenu
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                stock: state => state.mallConfig.__wxapp_img.stock,
                bonusImg: state => state.mallConfig.__wxapp_img.bonus,
                userInfo: state => state.user.info,
            })
        },
        onShow: function (options) {
            this.getStatus();
        },
        methods: {
            toDetail() {
                uni.navigateTo({
                    url: '/plugins/community/cash-detail/cash-detail'
                });
            },
            toCash() {
                uni.navigateTo({
                    url: '/plugins/community/cash/cash'
                });
            },
            getStatus() {
                let that = this;
                that.$request({
                    url: that.$api.community.index,
                }).then(response=>{
                    if(response.code == 0) {
                        this.setting = response.data.setting;
                        this.middleman = response.data.middleman;
                        if(response.data.middleman.id > 0) {
                            this.middleman = response.data.middleman;
                            this.apply_at = this.middleman.apply_at.substring(0,10)
                        }else {
                            uni.showToast({
                                title: '您还不是团长，现在前往申请页面',
                                icon: 'none',
                                duration: 1000
                            });
                            setTimeout(function(){
                                uni.redirectTo({
                                    url: '/plugins/community/apply/apply'
                                });
                            },1000)
                        }
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
        }
    }
</script>

<style scoped lang="scss">
    .price-show {
        width: 702rpx;
        height: 256rpx;
        margin: 24rpx 24rpx;
        border-radius: 16rpx;
        background-color: #fff;
        .title {
            color: #999999;
            font-size: 24rpx;
            margin-bottom: 10rpx;
        }
        .price {
            color: #353535;
            font-size: 40rpx;
            font-family: DIN;
        }
        .cash-btn {
            font-size: 28rpx;
            padding: 0 24rpx;
            height: 46rpx;
            line-height: 44rpx;
            border-radius: 23rpx;
            border: 2rpx solid;
            margin-top: 30rpx;
            display: inline-block;
        }
    }
    .menu {
        border-radius: 16rpx;
        background-color: #fff;
        width: 702rpx;
        margin: 0 24rpx;
        .menu-item {
            padding: 32rpx;
            height: 96rpx;
            border-top: 2rpx solid #e2e2e2;
            font-size: 26rpx;
            color: #353535;
            &:first-of-type {
                border-top: 0;
            }
            image {
                width: 12rpx;
                height: 22rpx;
                display: block;
            }
        }
    }
</style>