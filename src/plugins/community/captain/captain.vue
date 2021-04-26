<template>
    <app-layout>
        <view v-if="list.length > 0">
            <view @click="bind(item)" class="dir-left-nowrap cross-center captain" v-for="item in list" :key="item.id">
                <image class="avatar" :src="item.avatar"></image>
                <view class="user dir-top-nowrap main-center">
                    <view class="name t-omit">
                        <text>{{item.name}}</text>
                        <view class="space" :style="{'color': getTheme.color}">距你{{item.space}}</view>
                    </view>
                    <view class="t-omit">{{item.mobile}}</view>
                    <view class="address t-omit-two">
                        <view>
                            <image class="icon" src="./../image/add.png"></image>
                            提货地址:{{item.province}}
                            <text v-if="item.province != item.city">{{item.city}}</text>{{item.district}}{{item.detail}}
                        </view>
                    </view>
                </view>
                <image class="arrow-image" src="/static/image/icon/right.png"></image>
            </view>
        </view>
        <view v-if="list.length == 0 && !loading" class="empty-box">
            <image src="./../image/no-one.png"></image>
            <span>暂无团长</span>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';

    export default {
        data() {
            return {
                longitude: '',
                latitude: '',
                list: [],
                loading: false,
                page: 1,
            }
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
        onLoad(options) { this.$commonLoad.onload(options);
            this.longitude = options.longitude;
            this.latitude = options.latitude;
            this.getList();
        },
        methods: {
            bind(item) {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '绑定中...'
                });
                that.$request({
                    url: that.$api.community.bind,
                    data: {
                        middleman_id: item.user_id
                    }
                }).then(response=>{
                    uni.hideLoading();
                    uni.removeStorage({
                        key: 'middleman_info'
                    });
                    if(response.data.is_private) {
                        uni.showToast({
                            title: '切换成功',
                            icon: 'none',
                            duration: 1000
                        });
                        item.is_allow_change = 1;
                        uni.setStorage({
                            key: 'middleman_info',
                            data: item
                        })
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                    if(response.code == 0) {
                        uni.setStorage({
                            key: 'bind',
                            data: item.user_id,
                            success: function () {
                                setTimeout(function(){
                                    uni.navigateBack({});
                                },1000)
                            },
                            fail() {
                                setTimeout(function(){
                                    uni.navigateBack({});
                                },1000)
                            }
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
            getList() {
                let that = this;
                that.loading = true;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.community.middleman_list,
                    data: {
                        longitude: this.longitude,
                        latitude: this.latitude,
                        page: this.page,
                    }
                }).then(response=>{
                    that.$hideLoading();
                    that.loading = false;
                    if(response.code == 0) {
                        that.list = response.data.list;
                        for(let i in  that.list) {
                            that.list[i].space = ~~that.list[i].distance +'m';
                            if(that.list[i].distance > 1000) {
                                that.list[i].space = (that.list[i].distance / 1000).toFixed(1) + 'km'
                            }
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.loading = false;
                    that.$hideLoading();
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    .captain {
        width: #{698rpx};
        height: #{192rpx};
        border-radius: #{16rpx};
        padding: 0 #{32rpx};
        margin: #{20rpx} #{28rpx} 0;
        background-color: #fff;
        .avatar {
            width: #{84rpx};
            height: #{84rpx};
            border-radius: 50%;
            margin-right: #{18rpx};
            flex-shrink: 0;
        }
        .user {
            width: #{495rpx};
            height: #{152rpx};
            color: #353535;
            font-size: #{26rpx};
            .name {
                font-size: #{30rpx};
                font-weight: 600;
                margin-bottom: #{10rpx};
                position: relative;
                padding-right: 36%;
                .space {
                    position: absolute;
                    top: 0;
                    right: 0;
                    height: #{40rpx};
                    font-size: #{26rpx};
                    line-height: #{40rpx};
                    font-weight: 400;
                }
            }
            .address {
                width: #{504rpx};
                .icon {
                    height: #{25rpx};
                    width: #{19rpx};
                    margin-right: #{5rpx};
                }
            }
        }
        .arrow-image {
            margin-left: #{36rpx};
            width: #{12rpx};
            height: #{24rpx};
            flex-shrink: 0;
        }
    }
    .empty-box {
        width: 100%;
        height: 60vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        image {
            width: 280#{rpx};
            height: 280#{rpx};
        }
        span {
            margin-top: 15#{rpx};
            color: #999;
            font-size: 28#{rpx};
        }
    }
</style>