<template>
    <app-layout>
        <view class='top'>
            <image :src='stepImg.app_image.daily_info'></image>
            <view class='detail-name'>账户{{setting.currency_name ? setting.currency_name : '活力币'}}</view>
            <view class='detail-number'>{{stepUser.step_currency}}
                <text>个</text>
            </view>
        </view>
        <app-tab-nav :tabList="tabList" setTop="180" :activeItem="activeTab" @click="tabStatus"></app-tab-nav>
        <view class="need-height"></view>
        <view class='list' v-for="item in list" :key="item">
            <view class='list-left'>
                <view class='name'>{{item.remark}}</view>
                <view>{{item.created_at}}</view>
            </view>
            <view class='list-right'>
                <text v-if="activeTab == 1">+</text>
                <text v-if="activeTab == 2">-</text>
                <text>{{item.currency}}</text>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import appTabNav from "../../../components/basic-component/app-tab-nav/app-tab-nav.vue";

    import { mapState } from "vuex";

    export default {
        data() {
            return {
                tabList: [
                    {id:1, name: '收入'},
                    {id:2, name: '支出'}
                ],
                stepUser: {
                    step_currency: 0
                },
                activeTab: 1,
                page: 2,
                list: [],
                setting: {
                    currency_name: ''
                },
                over: false
            }
        },
        components: {
            "app-tab-nav": appTabNav,
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                stepImg: state => state.mallConfig.plugin.step,
            })
        },
        methods: {
            tabStatus(e) {
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.list = [];
                this.activeTab = e.currentTarget.dataset.id;
                this.getList();
            },
            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.step.setting,
                }).then(response=>{
                    that.getList();
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
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.step.log,
                    data:{
                       type: that.activeTab
                    },
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.list = response.data.list;
                        that.stepUser = response.data.stepUser;
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
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.activeTab = 1;
            that.getSetting();
        }
    }
</script>

<style scoped lang="scss">
    .need-height {
        height: #{180rpx};
    }

    .top {
        height: #{180rpx};
        width: 100%;
        position: fixed;
        background-color: #f7f7f7;
        top: 0;
        left: 0;
        z-index: 10;
    }

    .top image {
        width: 100%;
        height: #{160rpx};
    }

    .detail-name {
        position: absolute;
        left: #{24rpx};
        top: #{36rpx};
        font-size: #{26rpx};
        color: #fff;
    }

    .detail-number {
        position: absolute;
        bottom: #{36rpx};
        left: #{24rpx};
        font-size: #{48rpx};
        color: white;
        font-family: 'DIN';
    }

    .detail-number text {
        font-size: #{30rpx};
    }

    .list {
        height: #{139rpx};
        width: 100%;
        padding: #{36rpx} #{24rpx};
        background-color: white;
        border-bottom: #{1rpx} #e2e2e2 solid;
    }

    .list-left {
        color: #666;
        font-size: #{24rpx};
        float: left;
        width: 60%;
    }

    .name {
        font-size: #{30rpx};
        color: #353535;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .list-right {
        color: #353535;
        font-size: #{34rpx};
        float: right;
        line-height: #{68rpx};
    }
</style>