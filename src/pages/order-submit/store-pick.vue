<template>
    <app-layout>
        <view class="page">
            <view class="top">
                <view class="dir-left-nowrap box">
                    <input type="text" class="box-grow-1 input" confirm-type="搜索" @confirm="search"
                           v-model="keyword">
                    <view class="close-tip" @click="clear">
                        <image class="search-close" v-if="keyword"
                               src="/static/image/icon/delete-yuan.png"></image>
                    </view>
                    <view class="box-grow-0 cross-center" @click="search">搜索</view>
                </view>
            </view>
            <template v-if="list !== null">
                <template v-if="!list.length">
                    <view class="main-center no-result" style="margin-top: 100rpx">
                        <view class="dir-left-nowrap cross-center">
                            <image class="box-grow-0 empty" src="../../static/image/icon/empty.png"></image>
                            <view class="box-grow-1">
                                <view>抱歉，没有相关门店</view>
                            </view>
                        </view>
                    </view>
                </template>
                <view v-else class="main-center dir-top-nowrap list" style="margin-top: 100rpx">
                    <view class="manual-location" v-if="!keyword">
                        <app-button type="general" @click="selectLocation">手动定位</app-button>
                        <view v-if="locationAddress" class="location-address">
                            {{locationAddress}}
                        </view>
                    </view>
                    <view v-for="(item,index) in list"
                          :key="index"
                          @click="setData(item.id, index)"
                          class="dir-left-nowrap item">
                        <view class="box-grow-0">
                            <image :src="item.cover_url" class="avatar"></image>
                        </view>
                        <view class="box-grow-1">
                            <view class="name mb-8">{{item.name}}</view>
                            <view class="mobile mb-8">电话: {{item.mobile}}</view>
                            <view class="distance">距离: {{item.distance}}</view>
                        </view>
                    </view>
                </view>
            </template>
        </view>
    </app-layout>
</template>

<script>
    export default {
        name: 'store-pick',
        data() {
            return {
                mchIndex: null,
                list: null,
                firstGoodsId: null,
                plugin: null,
                manualLocation: false,
                longitude: '',
                latitude: '',
                locationAddress: null,
                keyword: '',
            };
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.mchIndex = options.mchIndex;
            this.firstGoodsId = options.firstGoodsId || null;
            this.plugin = options.plugin || null;
            
        },
        onShow() {
            if (!this.manualLocation) this.getLocation();
        },
        methods: {
            //搜索
            clear() {
                uni.hideKeyboard()
                this.keyword = '';
                this.loadData();
            },
            search() {
                this.loadData();
            },

            getLocation() {
                uni.showLoading({
                    mask: true,
                    title: '正在获取位置信息',
                });
                // #ifdef MP
                uni.getLocation({
                    success: (e) => {
                        uni.hideLoading();
                        this.longitude = e.longitude;
                        this.latitude = e.latitude;
                        this.loadData();
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.showModal({
                            title: '提示',
                            content: '获取位置信息失败，需要授权获取您的位置信息',
                            showCancel: false,
                            confirmText: '打开授权',
                            success(e) {
                                if (e.confirm) {
                                    uni.openSetting({});
                                }
                            }
                        });
                    },
                });
                // #endif
                // #ifdef H5
                let _this = this;
                this.$jwx.getLocation({
                    success(e) {
                        uni.hideLoading();
                        _this.longitude = e.longitude;
                        _this.latitude = e.latitude;
                        _this.loadData();
                    },
                    fail() {
                        uni.hideLoading();
                        uni.showToast({
                            title: '需要授权获取您的位置信息',
                            icon: 'none'
                        });
                    }
                });
                // #endif
            },
            selectLocation() {
                this.manualLocation = true;
                uni.chooseLocation({
                    success: e => {
                        this.longitude = e.longitude;
                        this.latitude = e.latitude;
                        this.locationAddress = (e.address || '') + ' ' + e.name || '';
                        this.locationAddress = this.locationAddress.trim();
                        this.loadData();
                    }
                });
            },
            loadData() {
                uni.showLoading({
                    mask: true,
                    title: '加载中',
                });
                this.$request({
                    url: this.plugin === 'booking' ? this.$api.book.store_list : this.$api.order.store_list,
                    data: {
                        keyword: this.keyword,
                        longitude: this.longitude,
                        latitude: this.latitude,

                        goods_id: this.firstGoodsId,
                    }
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        this.list = response.data.list;
                    } else {
                    }
                }).catch(() => {
                    uni.hideLoading();
                });
            },
            setData(data) {
                if (this.plugin === 'gift') {
                    let store_id = this.$store.state.gift.store_id;
                    store_id = data;
                    this.$store.commit('gift/storeId', data);
                } else {
                    const formData = this.$store.state.orderSubmit.formData;
                    formData.list[this.mchIndex].store_id = data;
                    this.$store.commit('orderSubmit/mutSetFormData', formData);
                }
                uni.navigateBack();
            },
        }
    }
</script>

<style lang="scss">
    page {
        background: $uni-weak-color-two;
    }
</style>

<style scoped lang="scss">
    .no-result {
        height: #{156rpx};
        padding: #{28rpx} 0;
        font-size: $uni-font-size-general-one;
        background-color: #ffffff;

        .text {
            color: $uni-general-color-two;
        }

        .empty {
            width: #{100rpx};
            height: #{100rpx};
            display: block;
            margin-right: #{40rpx};
        }
    }
    .top {
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 15;
        padding: #{20rpx} #{24rpx};
        background-color: #efeff4;
        font-size: $uni-font-size-import-two;
        color: $uni-general-color-one;

        .input {
            background-color: #ffffff;
            border-radius: #{50rpx 0 0 50rpx};
            padding: 0 #{32rpx};
            font-size: $uni-font-size-general-one;
            height: #{64rpx};
        }

        .box {
            position: relative;

            .close-tip {
                width: #{64rpx};
                height: #{64rpx};
                background-color: #ffffff;
                border-radius: #{0 50rpx 50rpx 0};
                margin-right: #{20rpx};
            }

            .search-close {
                width: #{32rpx};
                height: #{32rpx};
                border-radius: 50%;
                margin: #{16rpx};
            }
        }

        .radio {
            margin-top: #{32rpx};

            .radio-item {
                padding-bottom: #{12rpx};
            }

            .active {
                border-bottom: #{4rpx} solid;
            }
        }
    }
    .mb-8 {
        margin-bottom: #{8rpx};
    }

    .page {
        border-top: #{1rpx} solid $uni-weak-color-one;
    }

    .manual-location {
        padding: #{24rpx};

        .location-address {
            padding: #{12rpx} 0 0;
            font-size: $uni-font-size-general-two;
            color: $uni-general-color-two;
        }
    }

    .list {
        .item {
            padding: #{24rpx};
            background: #fff;
            border-bottom: #{1rpx} solid $uni-weak-color-one;

            .avatar {
                width: #{140rpx};
                height: #{140rpx};
                margin-right: #{24rpx};
                border-radius: #{999rpx};
                box-shadow: 0 0 #{1rpx} rgba(0, 0, 0, .25);
            }

            .name {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .mobile, .distance {
                font-size: $uni-font-size-general-one;
                color: $uni-general-color-two;
            }
        }
    }
</style>
