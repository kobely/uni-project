<template>
    <app-layout>
        <view class='top'>
            <image v-if="_num==1" :src='setting.ranking_pic.length > 0?setting.ranking_pic:stepImg.app_image.daily'></image>
            <image v-if="_num==2" :src='setting.ranking_pic.length > 0?setting.ranking_pic:stepImg.app_image.top_bg'></image>
        </view>
        <view class='rank'>
            <view @click="change(1)" class="rank-item">今日步数排行</view>
            <view @click="change(2)" class="rank-item">总财富排行</view>
        </view>
        <view v-if="_num==1" class="triangle-left"></view>
        <view v-if="_num==2" class="triangle-right"></view>
        <view class='my'>
            <view class='avatar'>
                <image :src='user.avatar'></image>
            </view>
            <view class='my-info'>
                <view class='my-name'>{{user.nickname}}</view>
                <view v-if="user.raking > 0">第{{user.raking}}名</view>
                <view v-if="user.raking == 0">暂未上榜</view>
            </view>
            <view class='moeny'>
                <view v-if="_num==1" class='number'>{{user.total_num ? user.total_num : 0}}</view>
                <view v-if="_num==2" class='number'>{{user.step_currency ? user.step_currency : 0}}</view>
                <view v-if="_num==1">步数</view>
                <view v-if="_num==2">{{setting.currency_name ? setting.currency_name : '活力币'}}数</view>
            </view>
        </view>
        <view class='list' :style="{'margin-bottom': `${adHeight}px`}">
            <view class='list-item' v-for="info in list" :key="info.id">
                <view class='noun'>
                    <view class='noun-text' v-if='info.raking > 3'>{{info.raking}}</view>
                    <image :src='info.img' v-if='info.raking < 4'></image>
                </view>
                <view class='avatar'>
                    <image :src='info.avatar'></image>
                </view>
                <view class='info'>
                    <view class='name'>{{info.nickname}}</view>
                </view>
                <view class='moeny'>
                    <view v-if="_num==1" class='number'>{{info.total_num ? info.total_num : 0}}</view>
                    <view v-if="_num==2" class='number'>{{info.step_currency ? info.step_currency : 0}}</view>
                    <view v-if="_num==1">步数</view>
                    <view v-if="_num==2">{{setting.currency_name ? setting.currency_name : '活力币'}}数</view>
                </view>
            </view>
        </view>
        <view id='ad'>
            <app-ad v-if="ad_data.unit_id"
                    :unit-id="ad_data.unit_id"
                    :type="ad_data.type"
                    :video-url="ad_data.video_url"
                    :pic-url="ad_data.pic_url"
                    :coupon-url="coupon_url"
                    :coupon-params="ad_data | getObje(ad_data)"
            />
        </view>
    </app-layout>
</template>

<script>
    import appAd from "../../../components/page-component/app-ad/app-ad"
    import {mapState} from "vuex";

    export default {
        data() {
            return {
                list: [],
                over: false,
                ad_data: {},
                user: {},
                loading: false,
                more: false,
                _num: 1,
                setting: null,
                adHeight: 0,
                coupon_url: this.$api.step.receive,
            }
        },
        components: {
            appAd
        },
        computed: {
            ...mapState({
                stepImg: state => state.mallConfig.plugin.step,
            })
        },
        filters: {
            getObje(data, temp) {
                return {
                    id: data.id
                }
            }
        },
        methods: {
            getHeight() {
                const self = this;
                setTimeout(() => {
                    const query = uni.createSelectorQuery().in(this);
                    query.select('#ad').boundingClientRect(res => {
                        self.adHeight = res.height;
                    }).exec();
                })
            },
            change(num) {
                let that = this;
                uni.showLoading({
                    mask: true,
                    text: '加载中...'
                });
                that.list = [];
                that.user = {};
                that._num = num;
                let url;
                if (num == 1) {
                    url = that.$api.step.step_convert
                } else if (num == 2) {
                    url = that.$api.step.ranking
                }
                that.getList(url);
            },
            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.step.setting,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
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
                });
            },
            getList(url) {
                let that = this;
                that.$request({
                    url: url,
                    data: {
                        status: that._num
                    }
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.list = response.data.list;
                        that.user = response.data.user;
                        that.ad_data = response.data.ad_data;
                        if (that.list.length > 0) {
                            for (let i = 0; i < that.list.length; i++) {
                                that.list[i].raking = i + 1;
                            }
                            that.list[0].img = './../image/top1.png';
                            if (that.list.length > 1) {
                                that.list[1].img = './../image/top2.png';
                            }
                            if (that.list.length > 2) {
                                that.list[2].img = './../image/top3.png';
                            }
                        }
                        that.getHeight();
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

        onLoad() { this.$commonLoad.onload();
            let that = this;
            let url = that.$api.step.step_convert;
            that._num = 1;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.getSetting();
            that.getList(url);
        }
    }
</script>

<style scoped lang="scss">
    .top {
        width: 100%;
        height: #{400rpx};
    }

    .top image {
        width: 100%;
        height: #{400rpx};
        z-index: 2;
    }

    .triangle-left {
        width: 0;
        height: 0;
        border-left: #{14rpx} solid transparent;
        border-right: #{14rpx} solid transparent;
        border-bottom: #{18rpx} solid white;
        position: absolute;
        left: 22.5%;
        top: #{384rpx};
        z-index: 10;
    }

    .triangle-right {
        width: 0;
        height: 0;
        border-left: #{14rpx} solid transparent;
        border-right: #{14rpx} solid transparent;
        border-bottom: #{18rpx} solid white;
        position: absolute;
        right: 22.5%;
        top: #{384rpx};
        z-index: 10;
    }

    .rank {
        width: 100%;
        position: absolute;
        top: #{300rpx};
        background-color: rgba(0, 0, 0, 0.1);
        color: white;
        font-size: #{32rpx};
        z-index: 5;
    }

    .rank .rank-item {
        display: inline-block;
        width: 50%;
        height: 100%;
        line-height: #{100rpx};
        text-align: center;
    }

    .my {
        height: #{136rpx};
        width: 100%;
        background-color: white;
        margin-bottom: #{20rpx};
    }

    .avatar {
        padding: #{24rpx};
        float: left;
    }

    .avatar image {
        height: #{80rpx};
        width: #{80rpx};
        border: #{4rpx} #f09b48 solid;
        border-radius: #{40rpx};
    }

    .my-info {
        color: #999;
        font-size: #{24rpx};
        padding: #{32rpx} 0;
        height: 100%;
        float: left;
    }

    .my-name {
        color: #353535;
        font-size: #{30rpx};
        margin-bottom: #{8rpx};
    }

    .moeny {
        float: right;
        color: #999;
        font-size: #{24rpx};
        padding: #{32rpx} #{24rpx};
        height: 100%;
        text-align: right;
    }

    .number {
        font-size: #{34rpx};
        font-family: 'DIN';
        color: #353535;
        margin-bottom: #{10rpx};
    }

    .temp {
        visibility: hidden;
    }

    .list-item {
        height: #{135rpx};
        width: 100%;
        background-color: white;
        border-bottom: #{1rpx} solid #e2e2e2;
        overflow: hidden;
    }

    .noun {
        width: #{100rpx};
        height: #{135rpx};
        float: left;
        text-align: center;
        padding: #{43rpx} #{25rpx};
    }

    .noun image {
        width: #{50rpx};
        height: #{50rpx};
    }

    .noun-text {
        font-size: #{30rpx};
        color: #353535;
    }

    .list .avatar {
        padding-left: 0;
    }

    .info {
        float: left;
        color: #353535;
        font-size: #{30rpx};
        line-height: #{136rpx};
        width: 45%;
        overflow: hidden;
    }

    .name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .loading {
        font-size: #{24rpx};
        color: #353535;
        text-align: center;
        height: #{80rpx};
        line-height: #{80rpx};
        background-color: white;
    }

    #ad {
        width: 100%;
        position: fixed;
        bottom: 0;
    }
</style>