<template>
    <view>
        <view v-if="!check.pass">
            <view class="main-center app-progress-area">
                <view class="cross-center dir-top-nowrap condition">
                    <image v-if="check.type == 1" src="../image/no-member.png"></image>
                    <image v-else-if="check.type == 4" src="../image/no-order.png"></image>
                    <image v-else src="../image/no-money.png"></image>
                    <view>0
                        <text v-if="check.type == 1">人</text>
                        <text v-else-if="check.type == 4">单</text>
                        <text v-else>元</text>
                    </view>
                </view>
                <view class="cross-center progress-item">
                    <view class="progress"></view>
                    <view class="active-progress" :style="{'width': `${rate + '%'}`}"></view>
                    <view class="cross-center dir-top-nowrap active-icon">
                        <view :style="{'left': `${rate + '%'}`}" class="condition-detail">
                            <text>{{check.now_target}}</text>
                            <text v-if="check.type == 1">人</text>
                            <text v-else-if="check.type == 4">单</text>
                            <text v-else>元</text>
                        </view>
                        <view :style="{'left': `${rate + '%'}`}" class="line"></view>
                        <image :style="{'left': `${rate + '%'}`}" src="../image/progress.png"></image>
                    </view>
                </view>
                <view class="cross-center dir-top-nowrap condition">
                    <image v-if="check.type == 1" src="../image/no-member.png"></image>
                    <image v-else-if="check.type == 4" src="../image/no-order.png"></image>
                    <image v-else src="../image/money.png"></image>
                    <view style='color: #ff4544'>{{check.target}}
                        <text v-if="check.type == 1">人</text>
                        <text v-else-if="check.type == 4">单</text>
                        <text v-else>元</text>
                    </view>
                </view>
            </view>
            <view class="app-condition-info">
                <view>
                    <text v-if="check.type == 1">下线总人数满</text>
                    <text v-if="check.type == 4">分销订单总数满</text>
                    <text v-if="check.type == 5">分销订单总金额满</text>
                    <text v-if="check.type == 3">已提现佣金总金额满</text>
                    <text v-if="check.type == 2">累计佣金总金额满</text>
                    <text v-if="check.type == 6">消费金额满</text>
                    <text class="condition-num">{{check.target}}</text>
                    <text class="condition-num" v-if="check.type == 1">人</text>
                    <text class="condition-num" v-else-if="check.type == 4">单</text>
                    <text class="condition-num" v-else>元</text>
                    <text>可申请成为代理</text>
                </view>
                <view>
                    您当前的
                    <text v-if="check.type == 1">下线总人数为</text>
                    <text v-if="check.type == 4">分销订单总数为</text>
                    <text v-if="check.type == 5">分销订单总金额为</text>
                    <text v-if="check.type == 3">已提现佣金总金额为</text>
                    <text v-if="check.type == 2">累计佣金总金额为</text>
                    <text v-if="check.type == 6">消费金额为</text>
                    <text class="condition-num">{{check.now_target}}</text>
                    <text class="condition-num" v-if="check.type == 1">人</text>
                    <text class="condition-num" v-else-if="check.type == 4">单</text>
                    <text class="condition-num" v-else>元</text>
                </view>
            </view>
            <view class="info">
                <view class="dir-left-nowrap info-title">
                    <view>代理区域</view>
                    <view @click="resetChoose" class="toChange">去修改</view>
                </view>                
                <view class="dir-left-nowrap">
                    <view class="label">代理级别：</view>
                    <view class="content">{{check.level_desc}}</view>
                </view>
                <view class="dir-left-nowrap">
                    <view class="label">代理地区：</view>
                    <view class="content">
                        <view>{{province.name}}<text v-if="check.level == 3"> - {{city.name}}</text></view>
                        <view class="dir-left-wrap district-list" v-if="district.length > 0">
                            <view style="color: #353535" v-for="(item,index) in district" :key="item.name">
                                <text v-if="index > 0"> / </text>
                                {{item.name}}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view @click="toIndex" class="app-to-index">去商城逛逛</view>
        </view>
        <view class="app-get" v-if="check.pass && !beApply">
            <image class="get-img" :src="region.get"></image>
            <view class="get-text">您已达到成为代理条件</view>
            <view>
                <text v-if="check.type == 1">下线总人数: </text>
                <text v-if="check.type == 4">分销订单总数: </text>
                <text v-if="check.type == 5">分销订单总金额: </text>
                <text v-if="check.type == 3">已提现佣金总金额: </text>
                <text v-if="check.type == 2">累计佣金总金额: </text>
                <text v-if="check.type == 6">消费金额: </text>
                <text class="condition-num">{{check.target}}</text>
                <text v-if="check.type == 1">人</text>
                <text v-else-if="check.type == 4">单</text>
                <text v-else>元</text>
            </view>
            <view class="apply-input cross-bottom main-center" v-if="setting.is_agreement == 1 && setting.apply_type == 2">
                <view class="read cross-bottom" @click="toggle">
                    <image src="/static/image/icon/icon-uncheck.png" v-if="read == false"></image>
                    <image src="/static/image/icon/icon-checkbox-checked-a.png" v-else></image>
                </view>
                <text>已阅读并同意《</text>
                <text class="agreement_title" @click="toRead">{{setting.agreement_title ? setting.agreement_title : '区域代理申请协议'}}</text>
                <text>》</text>
            </view>
            <view class="info">
                <view class="dir-left-nowrap">
                    <view class="label">代理级别：</view>
                    <view class="content">{{check.level_desc}}</view>
                </view>
                <view class="dir-left-nowrap">
                    <view class="label">代理地区：</view>
                    <view class="content">
                        <view>{{province.name}}<text v-if="check.level == 3"> - {{city.name}}</text></view>
                        <view class="dir-left-wrap district-list" v-if="district.length > 0">
                            <view style="color: #353535" v-for="(item,index) in district" :key="item.name">
                                <text v-if="index > 0"> / </text>
                                {{item.name}}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view @click="toApply" class="app-to-index">申请成为代理</view>
        </view>
    </view>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        name: 'app-condition',
        props: {
            check: {
                type: Object
            },
            read: {
                type: Boolean,
                default() {
                    return false
                }
            },
            setting: {
                type: Object
            },
            province: {
                type: Object
            },
            city: {
                type: Object
            },
            district: {
                type: Array
            },
            rate: {
                type: Number,
                default() {
                    return 0;
                }
            }
        },
        data() {
            return {
                beApply: false,
            }
        },
        computed: {
            ...mapState({
                region: state => state.mallConfig.__wxapp_img.region,
            })
        },
        methods: {
            toApply() {
                let that = this;
                if(that.setting.apply_type == 2) {
                    that.$emit('submit');
                }else {
                    that.beApply = true;
                    that.$emit("update",that.beApply);
                }
            },

            resetChoose() {
                this.$emit("reset",false);
            },

            toggle() {
                this.$emit("beRead");
            },

            toRead() {
                let that = this;
                that.$emit("toRead");
            },

            toIndex() {
                uni.reLaunch({
                    url: '/pages/index/index'
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    .app-progress-area {
        margin-top: #{100rpx};
        .condition {
            font-size: #{24rpx};
            color: #999999;
            image {
                width: #{120rpx};
                height: #{100rpx};
                margin-bottom: #{8rpx};
            }
        }
        .progress-item {
            width: #{470rpx};
            height: #{5rpx};
            top: #{50rpx};
            border-radius: #{2.5rpx};
            background-color: #e3e3e3;
            position: relative;
            .active-progress {
                position: absolute;
                background-color: #ff4544;
                height: #{5rpx};
                top: 0;
                left: 0;
                height: 100%;
            }
            .active-icon {
                font-size: #{24rpx};
                color: #ff4544;
                .condition-detail {
                    position: absolute;
                    top: #{-68rpx};
                    width: #{200rpx};
                    margin-left: #{-100rpx};
                    text-align: center;
                }
                .line {
                    position: absolute;
                    top: #{-30.5rpx};
                    width: #{2rpx};
                    height: #{30.5rpx};
                    z-index: 5;
                    background-color: #ff4544;
                }
                image {
                    position: absolute;
                    top: #{-17.5rpx};
                    height: #{35rpx};
                    width: #{35rpx};
                    margin-left: #{-17.5rpx};
                    z-index: 6;
                    display: block;
                }
            }
        }
    }
    .app-condition-info {
        text-align: center;
        margin-top: #{70rpx};
        font-size: #{32rpx};
        color: #353535;
        view:first-of-type {
            margin-bottom: #{20rpx};
            .condition-num {
                font-size: #{40rpx};
            }
        }
        .condition-num {
            color: #ff4544;
            font-family: DIN;
        }
    }
    .app-to-index {
        width: #{702rpx};
        height: #{80rpx};
        border-radius: #{40rpx};
        background-color: #ff4544;
        color: #fff;
        text-align: center;
        line-height: #{80rpx};
        font-size: #{32rpx};
        margin: #{78rpx} auto 0;
    }
    .app-get {
        font-size: #{28rpx};
        color: #353535;
        text-align: center;
        padding-bottom: #{50rpx};
        background-color: #fff;
        .get-img {
            width: #{650rpx};
            height: #{450rpx};
            margin: #{16rpx} auto;
        }
        .get-text {
            font-size: #{36rpx};
            margin-bottom: #{3rpx};
        }
        .app-to-index {
            margin-top: #{45rpx};
            width: #{670rpx};
        }
        .apply-input {
            height: #{60rpx};
            width: 100%;
            font-size: #{28rpx};
            color: #353535;
            .agreement_title {
                color:#ff4544;
                max-width: #{360rpx};
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            text {
                display: inline-block;
            }
            .label {
                width: #{126rpx};
            }
            .read {
                width: #{42rpx};
                height: #{60rpx};
                padding-bottom: #{3rpx};
                padding-right: #{10rpx};
                image {
                    height: #{32rpx};
                    width: #{32rpx};
                    display: block;
                }
            }
        }
    }

    .info {
        border-top: #{2rpx} solid #e2e2e2;
        padding-top: #{30rpx};
        font-size: #{28rpx};
        color: #353535;
        margin: #{30rpx} #{40rpx};
        .info-title {
            font-size: #{32rpx};
            height: #{40rpx};
            line-height: #{40rpx};
            margin-bottom: #{28rpx};
            .toChange {
                height: #{40rpx};
                line-height: #{38rpx};
                display: inline-block;
                padding: 0 #{16rpx};
                color: #ff4544;
                border: #{2rpx} solid #ff4544;
                margin-left: #{16rpx};
                border-radius: #{20rpx};
                font-size: #{24rpx};
            }
        }
        >view {
            margin-bottom: #{16rpx};
        }
        .label {
            color: #999999;
        }
        .content {
            width: #{530rpx};
            text-align: left;
            .district-list {
                text {
                    margin: 0 #{10rpx};
                }
            }
        }
    }
</style>