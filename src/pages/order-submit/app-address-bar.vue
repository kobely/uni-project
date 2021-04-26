<template>
    <view class="app-address-bar">
        <view v-if="allZiti" class="group">
            <view class="dir-left-nowrap">
                <view class="box-grow-1">
                    <app-input placeholder="请填写联系人"
                               height="100"
                               padding-left="36"
                               v-model="address.name"
                               @input="handleAddressInput"></app-input>
                </view>
                <view class="box-grow-1"
                      style="padding-right: 36rpx;">
                    <app-input placeholder="请填写手机号"
                               height="100"
                               v-model="address.mobile"
                               @input="handleAddressInput"></app-input>
                </view>
            </view>
        </view>
        <view v-else class="group dir-left-nowrap cross-center" @click="navigateAddress"
              style="padding: 25rpx 32rpx">
            <view class="box-grow-1">
                <template v-if="address">
                    <view class="dir-left-nowrap" style="padding: 11rpx 0;">
                        <view class="box-grow-1">收货人：{{address.name}}</view>
                        <view class="box-grow-0">{{address.mobile}}</view>
                    </view>
                    <view style="padding: 9rpx 0; line-height: 1.25; text-align: justify;">
                        收货地址：
                        <template v-if="hasCity">{{address.location}}</template>
                        <template v-else>
                            {{address.province}}
                            {{address.city}}
                            {{address.district}}
                        </template>
                        {{address.detail}}
                    </view>
                </template>
                <view v-else style="padding: 11rpx 0;">
                    <template v-if="hasCity">请选择收货地址</template>
                    <template v-else>请选择收货地址</template>
                </view>
                <view v-if="hasZiti"
                      :style="{'color': getTheme.color,'padding': '11rpx 0'}">
                    (收货地址中的手机号码将用于自提信息)
                </view>
                <view v-if="address && hasCity"
                      style="padding: 11rpx 0;">
                    该地址在配送范围内
                </view>
            </view>
            <view class="box-grow-0" style="padding-left: 24rpx;">
                <image src="/static/image/icon/right.png"
                       style="width: 12rpx; height: 22rpx;"></image>
            </view>
        </view>
    </view>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "app-address-bar",
        props: {
            address: {
                default: null,
            },
            allZiti: {
                default: false,
            },
            hasZiti: {
                default: false,
            },
            hasCity: {
                default: false,
            },
            city: {
                default: null
            }
        },
        computed: {
            ...mapGetters('mallConfig', {
                theme: 'getTheme'
            }),
        },
        methods: {
            navigateAddress() {
                if (this.city && this.city.errorCode === 1) {
                    uni.showModal({
                        content: this.city.error,
                        showCancel: false
                    });
                    return ;
                }
                uni.navigateTo({
                    url: '/pages/order-submit/address-pick?hasCity=' + this.hasCity,
                });
            },
            handleAddressInput() {
                this.$emit('addressInput', this.address);
            },
        },
    }
</script>
