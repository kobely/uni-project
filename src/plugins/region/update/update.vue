<template>
    <app-layout>
        <image :src="region.detail" class="bg"></image>
        <view class="info">
            <image class="avatar" :src="detail.avatar"></image>
            <image v-if="detail.level_up_log && detail.level_up_log.status == 1" class="success-img" :src="bonus.success"></image>
            <view v-if="detail.level_up_log && detail.level_up_log.status == 1" class="update main-between cross-center">
                <text>恭喜您已升级成为{{detail.province_text}}的
                    <text v-if="detail.level == 1">省代理</text>
                    <text v-if="detail.level == 2">市代理</text>
                </text>
            </view>
            <view v-if="detail.is_up == 1" class="update main-between cross-center">
                <view v-if="detail.level_up_log && detail.level_up_log.status == 0">正在申请成为{{detail.province_text}}的{{detail.level_up.level_desc}}</view>
                <view v-else>可升级为{{detail.province_text}}的{{detail.level_up.level_desc}}</view>
                <view @click="toUpdate" class="update-btn">{{detail.level_up_log && detail.level_up_log.status == 0 ? '去查看':'去升级'}}</view>
            </view>
            <view class="title main-center cross-center">
                <image src="./../image/title-left.png"></image>
                <view>代理级别</view>
                <image src="./../image/title-right.png"></image>
            </view>
            <view class="level-info">
                <text v-if="detail.level == 1">省代理</text>
                <text v-if="detail.level == 2">市代理</text>
                <text v-if="detail.level == 3">区/县代理</text>
                <text class="placeholder">|</text>
                <text v-if="detail.bonus_rate">{{setting.form.rate ? setting.form.rate : '分红比例'}}{{detail.bonus_rate}}%</text>
            </view>
            <view class="title main-center cross-center">
                <image src="./../image/title-left.png"></image>
                <view>代理地区</view>
                <image src="./../image/title-right.png"></image>
            </view>
            <view>
                <text>{{detail.province_text}}</text>
                <text v-if="detail.level > 2 && detail.city_text">
                    <text class="placeholder">-</text>
                    {{detail.city_text}}
                </text>
            </view>
            <view class="relation-list" v-if="detail.level > 1 && !(detail.relation.length == 1 && detail.relation[0].name == detail.province_text)">
                <text v-for="(item,index) in detail.relation" :key="index">
                    <text class="placeholder" v-if="index > 0">/</text>
                    {{item.name}}
                </text>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        data() {
            return {
                detail: {},
                setting: {},
                first: true,
            }
        },
        computed: {
            ...mapState({
                region: state => state.mallConfig.__wxapp_img.region,
                bonus: state => state.mallConfig.__wxapp_img.bonus,
            })
        },
        methods: {
            toUpdate() {
                uni.navigateTo({
                    url: '/plugins/region/index/index?up=1'
                });
            },
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.region.status,
                }).then(response=>{
                    if(response.code == 0) {
                        that.first = false;
                        that.$hideLoading();
                        that.detail = response.data.region;
                        if(that.detail.status != 1) {
                            uni.redirectTo({
                                url: '/plugins/region/index/index'
                            })
                        }
                        if(that.detail.level_up_log.status == 1) {
                            that.clearLevel();
                        }
                    }else {
                        that.$hideLoading();
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
            clearLevel() {
                let that = this;
                that.$request({
                    url: that.$api.region.clear_up,
                    method: 'post'
                }).then(response=>{
                })
            },
            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.region.setting,
                }).then(response=>{
                    if(response.code == 0) {
                        that.getList();
                        that.setting = response.data;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                    uni.hideLoading();
                });
            },
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.getSetting();
        },
        onShow() {
            if(!this.first) {
                this.getList();
            }
        }
    }
</script>

<style scoped lang="scss">
    .bg {
        height: #{280rpx};
        width: 100%;
    }
    .success-img {
        display: block;
        height:#{320rpx};
        width:#{420rpx};
        margin: 0 auto #{20rpx};
    }
    .info {
        position: relative;
        z-index: 10;
        width: #{702rpx};
        margin: #{-148rpx} auto 0;
        border-radius: #{16rpx};
        background-color: #fff;
        box-shadow: 0 #{10rpx} #{10rpx} rgba(0, 0, 0, 0.05);
        text-align: center;
        padding-bottom: #{100rpx};
        font-size: #{32rpx};
        color: #353535;
        .avatar {
            width: #{140rpx};
            height: #{140rpx};
            border-radius: #{70rpx};
            border: #{4rpx} solid #fff;
            margin: #{-68rpx} auto 0;
        }
        .update {
            height: #{80rpx};
            width: #{590rpx};
            margin: #{56rpx} auto 0;
            padding: 0 #{28rpx};
            border-radius: #{8rpx};
            color: #ff4544;
            font-size: #{26rpx};
            background-color: #feeeee;
            .update-btn {
                width: #{100rpx};
                height: #{40rpx};
                line-height: #{40rpx};
                border-radius: #{20rpx};
                text-align: center;
                font-size: #{22rpx};
                color: #fff;
                background-color: #ff4544;
            }
        }
        .title {
            margin-top: #{60rpx};
            margin-bottom: #{50rpx};
            font-size: #{28rpx};
            color: #999999;
            image {
                width: #{120rpx};
                height: #{24rpx};
                display: block;
            }
            view {
                margin: 0 #{32rpx};
            }
        }
        .level-info {
            font-size: #{32rpx};
            color: #353535;
            margin: 0 0 #{14rpx};
        }
        .relation-list {
            width: #{590rpx};
            margin: #{10rpx} auto 0;
        }
        .placeholder {
            margin:  0 #{10rpx};
        }
    }
</style>