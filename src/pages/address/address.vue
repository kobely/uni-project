<template>
    <app-layout>
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

        <view class="head">
            <view v-for="(item, index) in list" :key="index">
                <app-shipping-address
                        @handleAddress="address"
                        :item="item"
                        :is_refund_address="is_refund_address"
                        :is_hide_default_btn="is_hide_default_btn == 0"
                        :destroy_url="destroy_url"
                        :theme="manual_btn_bg"
                ></app-shipping-address>
            </view>
        </view>
        <!--空格区域-->
        <view class="safe-area-inset-bottom">
            <view class="u-bottom-height"></view>
        </view>
        <view class="safe-area-inset-bottom u-bottom-fixed">
            <view class="app-buttons main-between">
                <!-- #ifdef MP-ALIPAY || H5 -->
                <app-button :theme="manual_btn_bg" arrangement="row" @click="manual" type="important" round width="700">
                    <icon class="app-icon app-manual-icon" type></icon>
                    <text class="app-text">手动添加</text>
                </app-button>
                <!-- #endif -->
                <!-- #ifndef MP-ALIPAY || H5 -->
                <app-button :theme="manual_btn_bg" arrangement="row" @click="manual" type="important" round width="346">
                    <icon class="app-icon app-manual-icon" type></icon>
                    <text class="app-text">手动添加</text>
                </app-button>
                <app-button background="#08c303" arrangement="row" @click="getauto" type="important" round width="346">
                    <icon class="app-icon app-auth-icon" type></icon>
                    <text class="app-text">自动获取</text>
                </app-button>
                <!-- #endif -->
            </view>
        </view>
    </app-layout>
</template>

<script>
    import appShippingAddress from '../../components/page-component/app-shipping-address/app-shipping-address.vue';
    import {mapGetters} from "vuex";

    export default {
        name: "address",
        components: {
            'app-shipping-address': appShippingAddress,
        },
        data() {
            return {
                page: 1,
                args: '',
                load: '',
                allList: [],
                manual_btn_bg: null,
                is_refund_address: 0,
                is_hide_default_btn: 0,
                address_url: '',
                destroy_url: '',

                keyword: '',
                search: true,
                getFocus: false,
            }
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
            this.is_hide_default_btn = options.is_hide_default_btn ? options.is_hide_default_btn : 0;
            this.is_refund_address = options.is_refund_address ? +options.is_refund_address : 0;
            if(options.manual_btn_bg && options.manual_btn_bg == 'admin') {
                this.manual_btn_bg = {
                    background: '#446dfd',
                    color: '#446dfd',
                }
            }else {
                this.manual_btn_bg = options.manual_btn_bg ? options.manual_btn_bg : this.getTheme;
            }
            if (this.is_refund_address > 0) {
                this.address_url = this.$api.app_admin.refund_address;
                this.destroy_url = this.$api.app_admin.address_destroy;
                uni.setNavigationBarTitle({
                    title: '退货地址'
                })
            } else {
                this.address_url = this.$api.user.address;
                this.destroy_url = this.$api.user.address_destroy;
            }

            //#ifdef MP-BAIDU
            this.init();
            //#endif
        },
        onShow: function () {
            this.init();
        },
        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {
            const self = this;
            if (self.args || self.load)
                return;
            self.load = true;
            let page = self.page + 1;
            this.$request({
                url: self.$api.user.address,
                data: {
                    page: page,
                }
            }).then(info => {
                if (info.code === 0) {
                    [self.page, self.args, self.allList] = [page, info.data.allList.length === 0, self.allList.concat(info.data.list)];
                }
                self.load = false;
            });
        },
	    methods: {
            inputBlur() {
                let that = this;
                setTimeout(v => {
                    that.getFocus = false;
                    if (that.keyword === '') that.search = true;
                }, 300)
            },
            init() {
                const self = this;
                if (!self.address_url) return;

                uni.showLoading({
                    title: '加载中'
                });
                self.page = 1;
                self.$request({
                    url: self.address_url,
                }).then(info => {
                    uni.hideLoading();
                    if (info.code === 0) {
                        [self.page, self.allList] = [1, info.data.list];
                    }
                }).catch(() => {
                    uni.hideLoading();
                });
            },
            address() {
                this.init();
            },
            manual() {
                uni.navigateTo({
                    url: '/pages/address/address-edit?is_refund_address=' + this.is_refund_address,
                });
            },
            getauto() {
                //#ifndef MP-ALIPAY
                const self = this;
                uni.chooseAddress({
                        success: function (e) {
                            self.$request({
                                url: self.$api.user.wechat_district,
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
                                    };

                                    uni.navigateTo({
                                        url: '/pages/address/address-edit?form=' + JSON.stringify(newAddress) + '&is_refund_address=' + self.is_refund_address
                                    })
                                }
                            });
                        }
                    }
                );
                //#endif
            }
	    },
    }
</script>
<style scoped lang="scss">
    .head {
        margin-top: #{100rpx};
        background: $uni-weak-color-two;
    }

    .search {
        width: #{750rpx};
        height: #{88rpx};
        padding: #{16rpx} #{24rpx};
        box-sizing: border-box;
        background-color: #efeff4;
        top: 0;
        position: fixed;
        left: 0;
        z-index: 23;

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

    .app-buttons {
        height: 128upx;
        padding: 24upx 24upx;

        .app-icon {
            width: #{32rpx};
            height: #{32rpx};
            background-repeat: no-repeat;
            background-size: 100% 100%;
            margin-right: #{8rpx};
        }

        .app-manual-icon {
            background-image: url("./image/add.png");
        }

        .app-auth-icon {
            background-image: url("./image/auth.png");
        }

        .app-text {
            font-size: #{28rpx};
            color: #ffffff;
            margin-left: #{8rpx};
        }
    }
    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 999;
    }
    .u-bottom-height {
        height: 128upx;
    }
</style>