<template>
    <app-layout>
        <view class="express">
            <image class="logo" src='./../image/express.png'></image>
            <view class="company-name">{{express_company}}</view>
            <view class="express-no">运单编号：{{express_no}}<image @click='copy' src="./../image/copy.png"></image></view>
        </view>
        <view class='logistics-box dir-top t-small-color t-medium'>
            <block v-if='express && express.list'>
                <view class='item-box'>
                    <view :class="['dir-top-nowrap','item',`${index == 0 ? 'sign-text' : ''}`]" v-for='item in express.list' :key='item.id'>
                        <image v-if='index == 0' class='sign-big' src='/static/image/icon/order/point-green.png'></image>
                        <image v-else class='sign' src='/static/image/icon/order/point-gray.png'></image>
                        <view>{{item.desc}}</view>
                        <view>{{item.datetime}}</view>
                    </view>
                </view>
            </block>
            <view v-else class='main-center'>
                <view>暂无物流信息</view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        data() {
            return {
                express: '',
                id: '',
                express_no: '',
                express_company: ''
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                adminImg: state => state.mallConfig.__wxapp_img.app_admin,
            })
        },
        methods: {
            copy() {
                this.$utils.uniCopy({
                    data: this.express_no,
                    success() {
                        uni.getClipboardData({
                            success() {
                                uni.showToast({
                                    title: '复制成功',
                                    duration: 1000
                                });
                            }
                        })
                    }
                })
            },
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.$request({
                url: that.$api.app_admin.express_detail,
                data: {
                    id: options.id,
                    express: options.express,
                    customer_name: options.customer_name,
                    express_no: options.express_no
                }
            }).then(response => {
                that.$hideLoading();
                if (response.code == 0) {
                    that.express = response.data.express;
                    that.id = options.id;
                    that.express_company = options.express;
                    that.express_no = options.express_no;
                } else {
                    uni.showToast({
                        title: response.msg,
                        icon: 'none',
                        duration: 1000
                    });
                }
            }).catch(response => {
                that.$hideLoading();
                uni.showToast({
                    title: response,
                    icon: 'none',
                    duration: 1000
                });
            });
        }
    }
</script>

<style scoped lang="scss">
    .logo {
        height: #{100rpx};
        width: #{100rpx};
        float: left;
        margin-right: #{34rpx};
    }

    .express {
        margin: #{24rpx};
        display: block;
        margin-bottom: 0;
        padding: #{32rpx};
        padding-left: #{24rpx};
        position: relative;
        font-size: #{32rpx};
        background-color: #fff;
        color: #353535;
        border-radius: #{16rpx};
        height: #{160rpx};
    }

    .to-more {
        height: #{24rpx};
        width: #{12rpx};
        position: absolute;
        right: #{24rpx};
        top: 50%;
        margin-top: #{-6rpx};
    }

    .express-list {
        padding: #{40rpx} #{32rpx};
        background-color: #fff;
        color: #25ae5f;
        font-size: #{32rpx};
        margin: #{24rpx};
        border-radius: #{16rpx};
    }

    .express-box .top-box {
        background-color: #fff;
        padding: #{20rpx};
    }
    .express-box .label {
        margin-right: #{10rpx};
    }

    .express-box .goods-pic {
        width: #{130rpx};
        height: #{130rpx};
        margin-right: #{20rpx};
    }

    .logistics-box {
        padding: #{20rpx} #{25rpx};
        margin: 0 #{24rpx};
        border-radius: #{16rpx};
        background-color: #fff;
        margin-top: #{25rpx};
    }

    .logistics-box .item-box {
        border-left: #{1rpx} solid #e2e2e2;
        padding-left: #{45rpx};
        position: relative;
    }

    .logistics-box .item {
        margin-bottom: #{25rpx};
        padding-bottom: #{25rpx};
        border-bottom: #{1rpx} solid #e2e2e2;
    }

    .logistics-box .item .sign {
        width: #{16rpx};
        height: #{16rpx};
        position: absolute;
        left: #{-7rpx};
    }

    .logistics-box .item .sign-big {
        width: #{32rpx};
        height: #{32rpx};
        position: absolute;
        left: #{-16rpx};
    }

    .sign-text {
        color: #25ae5f;
    }

    .company-name {
        margin-top: #{6rpx};
    }

    .express-no {
        color:#666666;
        font-size: #{28rpx};
        margin-top: #{10rpx};
    }

    .express-no image {
        height: #{24rpx};
        width: #{24rpx};
        margin-left: #{16rpx};
    }
</style>