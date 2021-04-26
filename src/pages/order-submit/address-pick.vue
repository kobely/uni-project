<template>
    <app-layout>
        <view class="page">
            <view class="search">
                <view class="prompt dir-left-nowrap main-center cross-center" v-if="search" @click="search = false">
                    <image src="../../static/image/icon/icon-search.png"></image>
                    <text>请输入收货人或联系电话搜索</text>
                </view>
                <view v-else style="position: relative">
                    <input placeholder="请输入收货人或联系电话搜索" type="text" v-model="keyword" @focus="getFocus=true" focus
                           @blur="inputBlur"/>
                    <image v-if="getFocus && keyword.length" @click.stop="keyword = ''" class="search-clear"
                           src="../../static/image/icon/delete-yuan.png"></image>
                </view>
            </view>

            <template v-if="list !== null">
                <view v-if="!list.length" class="no-data mb-24">暂无有效地址信息</view>
                <view v-else class="main-center dir-top-nowrap list">
                    <view v-for="(item,index) in list"
                          :key="index"
                          @click="setData(item.id)">
                        <app-shipping-address @handleAddress="address"
                                              :item="item"
                                              :theme="getTheme"
                                              :is_hide_default_btn="true"
                                              :destroy_url="destroy_url"
                                              :type="type"
                        ></app-shipping-address>
                    </view>
                </view>
            </template>
            <!--空格区域-->
            <view class="safe-area-inset-bottom">
                <view class="u-bottom-height"></view>
            </view>
            <view class="safe-area-inset-bottom u-bottom-fixed">
                <view class="dir-left-nowrap add-address-row" v-if="list !== null">
                    <view class="box-grow-1">
                        <app-form-id>
                            <app-button :theme="getTheme" type="important" round @click="editAddress(0)">
                                <view class="cross-center main-center">
                                    <image class="icon" src="/static/image/icon/add.png"></image>
                                    <view>手动添加</view>
                                </view>
                            </app-button>
                        </app-form-id>
                    </view>
                    <!-- #ifdef MP-WEIXIN -->
                    <view class="box-grow-1" v-if="type === 0">
                        <app-form-id>
                            <app-button type="important" round background="#08c303"
                                        @click="wechatAddAddress">
                                <view class="cross-center main-center">
                                    <image class="icon" src="/static/image/icon/wechat-white.png"></image>
                                    <view>自动获取</view>
                                </view>
                            </app-button>
                        </app-form-id>
                    </view>
                    <!-- #endif -->
                </view>
            </view>
            <template v-if="notInPointList !== null && notInPointList.length">
                <view class="tip">以下地址不在配送范围内，请编辑地址进行定位</view>
                <view class="main-center dir-top-nowrap list not-list">
                    <view v-for="(item,index) in notInPointList"
                          :key="index"
                          class="dir-left-nowrap cross-center item">
                        <view class="box-grow-1 left">
                            <view class="dir-left-nowrap mb-12">
                                <view class="box-grow-1">收货人: {{item.name}}</view>
                                <view class="box-grow-0">{{item.mobile}}</view>
                            </view>
                            <view>收货地址: {{item.address}}</view>
                        </view>
                        <view class="box-grow-0">
                            <view class="edit-btn-out" @click.stop="editAddress(item.id)">
                                <view class="edit-btn">编辑</view>
                            </view>
                        </view>
                    </view>
                </view>
            </template>
            <!--手动添加区域-->
            <view style="height: 130rpx"></view>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters} from 'vuex';
    import appShippingAddress from '../../components/page-component/app-shipping-address/app-shipping-address.vue';

    export default {
        name: 'address-pick',
        components: {
            appShippingAddress,
        },
        data() {
            return {
                mchIndex: null,
                allList: [],
                notInPointList: null,
                sign: '',
                page: 1,
                noMore: false,
                destroy_url: this.$api.user.address_destroy,

                keyword: '',
                search: true,
                getFocus: false,
                type: 0,
            };
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            list() {
                const allList = this.allList;
                const newVal = this.keyword;
                return allList.filter(item => {
                    let regExp = new RegExp(newVal);
                    return regExp.test(item.mobile) || regExp.test(item.name);
                })
            },
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.type = options.hasCity === `true` ? 1 : 0;
            this.sign = options.sign;
        },
        onShow() {
            this.page = 1;
            // #ifdef MP-BAIDU
            setTimeout(() => {
                this.loadData();
            }, 50);
            // #endif
            // #ifndef MP-BAIDU
            this.loadData();
            // #endif
        },
        methods: {
            inputBlur() {
                let that = this;
                setTimeout(v => {
                    that.getFocus = false;
                    if (that.keyword === '') that.search = true;
                }, 300)
            },

            address(status) {
                this.page = 1;
                this.loadData();
            },

            more() {
                if (this.noMore) return;
                this.page++;
                this.loadData('add');
            },
            loadData(type = 'current') {
                uni.showLoading({
                    mask: true,
                    title: '加载中',
                });
                this.$request({
                    url: this.$api.user.address,
                    data: {
                        type: this.type,
                        page: this.page,
                    }
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        if (
                            (!response.data.list || !response.data.list.length)
                            && (!response.data.notInPointList || !response.data.notInPointList.length)
                        ) {
                            this.noMore = true;
                        }
                        if (type === 'add') {
                            this.allList = this.list.concat(response.data.list);
                            this.notInPointList = this.notInPointList.concat(response.data.notInPointList);
                        } else {
                            this.allList = response.data.list;
                            this.notInPointList = response.data.notInPointList;
                        }
                    }
                }).catch(() => {
                    uni.hideLoading();
                });
            },
            setData(data) {
                if (this.sign === 'gift') {
                    let formData = this.$store.state.gift.address_id;
                    formData = data;

                    this.$store.commit('gift/addressId', formData);
                } else {
                    const formData = this.$store.state.orderSubmit.formData;
                    if (this.type === 1) {
                        formData.list[0].address_id = data;
                    } else {
                        formData.address_id = data;
                    }
                    this.$store.commit('orderSubmit/mutSetFormData', formData);
                }
                uni.navigateBack();
            },
            editAddress(id) {
                uni.navigateTo({
                    url: '/pages/address/address-edit?id=' + id + '&type=' + this.type,
                });
            },
            wechatAddAddress() {
                uni.chooseAddress({
                    success: (e) => {
                        if (e.errMsg !== 'chooseAddress:ok')
                            return;
                        this.$request({
                            url: this.$api.user.wechat_district,
                            data: {
                                national_code: e.nationalCode,
                                province_name: e.provinceName,
                                city_name: e.cityName,
                                county_name: e.countyName,
                            }
                        }).then(info => {
                            if (info.code === 0) {
                                let province_id = info.data.district['province']['id'];
                                let city_id = info.data.district['city']['id'];
                                let district_id = info.data.district['district']['id'];
                                let newAddress = {
                                    id: '',
                                    name: e.userName,
                                    ids: [province_id, city_id, district_id],
                                    province_id: province_id,
                                    city_id: city_id,
                                    district_id: district_id,
                                    mobile: e.telNumber,
                                    detail: e.detailInfo,
                                    type: 0,
                                };
                                uni.navigateTo({
                                    url: '/pages/address/address-edit?form=' + JSON.stringify(newAddress)
                                })
                            }
                        });
                    },
                });
            },
        },
    }
</script>

<style lang="scss">
    page {
        background: $uni-weak-color-two;
    }
</style>

<style scoped lang="scss">
    .mb-12 {
        margin-bottom: #{12rpx};
    }

    .mb-24 {
        margin-bottom: #{24rpx};
    }

    .page {
        //padding: #{24rpx} 0;

        .no-data {
            padding: #{100rpx};
            text-align: center;
            margin-top: 88upx;
            color: $uni-general-color-three;
            background: #fff;
            border-radius: #{16rpx};
        }
    }

    .search {
        width: #{750rpx};
        height: #{88rpx};
        padding: #{16rpx} #{24rpx};
        box-sizing: border-box;
        background-color: #efeff4;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;

        .prompt {
            width: #{702rpx};
            height: #{56rpx};
            position: absolute;
            border-radius: #{28rpx};
            background-color: #ffffff;

            > image {
                width: #{26rpx};
                height: #{26rpx};
            }

            > text {
                color: #b2b2b2;
                font-size: #{26rpx};
                margin: #{0 10rpx};
            }
        }

        input {
            width: #{702rpx};
            height: #{56rpx};
            border-radius: #{28rpx};
            background-color: #ffffff;
            padding: #{0 70rpx 0 30rpx};
            box-sizing: border-box;
            font-size: #{26rpx};
        }

        .search-clear {
            position: absolute;
            right: #{15rpx};
            top: #{14rpx};
            width: #{30rpx};
            height: #{30rpx};
            z-index: 300;
        }
    }

    .list {
        margin-top: #{60rpx};
        //margin-bottom: #{48rpx};

        .item {
            font-size: $uni-font-size-general-one;
            background: #fff;
            border-radius: #{24rpx};
            margin-bottom: #{24rpx};

            .left {
                padding: #{24rpx};
            }

            .edit-btn-out {
                padding: #{39rpx} 0;
            }

            .edit-btn {
                padding: #{4rpx} #{30rpx};
                color: $uni-general-color-two;
                border-left: $uni-weak-color-one #{1rpx} solid;
            }
        }
    }

    .add-address-row {
        margin-bottom: 50rpx;
        > view {
            padding: 0 #{12rpx};
        }

        .icon {
            width: #{32rpx};
            height: #{32rpx};
            margin-right: #{12rpx};
        }
    }

    .not-list {
        color: $uni-general-color-two;
        margin-left: #{24rpx};
        margin-right: #{24rpx};
    }

    .tip {
        color: $uni-general-color-one;
        margin: #{0 24rpx 20rpx 24rpx};
    }
    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1500;
    }
    .u-bottom-height {
        height: 120upx;
    }
</style>
