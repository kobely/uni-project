<template>
    <view class="app-user-center-top cross-center" :style="{'background-image': 'url('+topPicUrl+')'}">
        <!-- style 3 start -->
        <view class="style-3 box-grow-1 main-center" v-if="topStyle == '3'">
            <view class="style-3-container dir-left-nowrap cross-center"
                  :style="userCenter.style_bg_pic_url?`background-image: url(${userCenter.style_bg_pic_url})`:``">
                <view class="box-grow-0 avatar-container">
                    <image :src="avatar" :class="[is_vip_card_user && is_icon_super_vip == '1' ? 'avatar is_vip' : 'avatar']"></image>
                    <image v-if="is_vip_card_user && is_icon_super_vip == '1'" src="/static/image/vip_icon.png" class="vip_icon"></image>
                </view>
                <view class="box-grow-1 info-container">
                    <template v-if="isLogin">
                        <view class="dir-left-nowrap cross-center">
                            <view v-if="userInfo" class="nickname t-omit" :style="{'color':userNameColor}">{{userInfo.nickname}}</view>
                            <!--#ifdef MP-WEIXIN -->
                            <button class="u-refresh dir-left-nowrap main-between cross-center member-margin"
                                    open-type="getUserInfo"
                                    scope="userInfo"
                                    @getAuthorize="getUserInfo"
                                    @getuserinfo="getUserInfo"
                            >
                                <icon class="u-icon" type></icon>
                                <text>刷新</text>
                            </button>
                            <!-- #endif-->
                            <!--#ifdef H5 -->
                            <button class="u-refresh dir-left-nowrap main-between cross-center member-margin"
                                    @click="getUserInfo"
                                    v-if="isWechat"
                            >
                                <icon class="u-icon" type></icon>
                                <text>刷新</text>
                            </button>
                            <!-- #endif-->
                        </view>
                        <app-form-id @click="goMember" v-if="mall.setting.is_icon_members_grade == 1">
                            <view class="member-info inline-flex cross-center dir-left-nowrap">
                                <view>
                                    <image :src="getMemberPicUrl" class="member-icon" mode="aspectFill"></image>
                                </view>
                                <view v-if="userInfo" class="t-omit">{{userInfo.identity.level_name}}</view>
                            </view>
                        </app-form-id>
                    </template>
                    <template v-else>
                        <app-form-id>
                            <view class="login-btn" @click="callLogin">点击登录</view>
                        </app-form-id>
                    </template>
                </view>
                <view class="box-grow-0 address-container">
                    <app-jump-button v-if="userInfo && userInfo.is_show_pay_code" form url="/plugins/teller/index/index">
                        <view class="address-btn-3 pay-code">
                            <image class="pay-code-icon" src="/static/image/icon/pay-code.png"></image>
                            <view>付款码</view>
                        </view>
                    </app-jump-button>
                    <app-jump-button form url="/pages/address/address">
                        <view class="address-btn-3">
                            <image class="address-btn-icon" src="/static/image/icon/address-white.png"></image>
                            <view>收货地址</view>
                        </view>
                    </app-jump-button>
                </view>
            </view>
        </view>
        <!-- style 3 end -->

        <!-- style 2 start -->
        <view class="style-2 box-grow-1" v-else-if="topStyle == '2'">
            <app-jump-button v-if="userInfo && userInfo.is_show_pay_code" form url="/plugins/teller/index/index">
                <view class="pay-code-btn">
                    <image class="pay-code-icon" src="/static/image/icon/pay-code.png"></image>
                    <view>付款码</view>
                </view>
            </app-jump-button>
            <view class="avatar-container">
                <image :src="avatar" :class="[is_vip_card_user && is_icon_super_vip == '1' ? 'avatar is_vip' : 'avatar']"></image>
                <image v-if="is_vip_card_user  && is_icon_super_vip == '1'" src="/static/image/vip_icon.png" class="vip_icon"></image>
            </view>
            <view class="info-container">
                <template v-if="isLogin">
                    <app-form-id @click="goMember" v-if="mall.setting.is_icon_members_grade == 1">
                        <view class="member-info inline-flex cross-center dir-left-nowrap">
                            <view>
                                <image :src="getMemberPicUrl" class="member-icon" mode="aspectFill"></image>
                            </view>
                            <view v-if="userInfo" class="t-omit">{{userInfo.identity.level_name}}</view>
                        </view>
                    </app-form-id>
                    <view class="dir-left-nowrap cross-center main-center">
                        <view v-if="userInfo" class="nickname t-omit" :style="{'color':userNameColor}"
                              :class="[mall.setting.is_icon_members_grade != 1 ? 'no-member-icon' : '',]">
                            {{userInfo.nickname}}</view>
                        <!--#ifdef MP-WEIXIN -->
                        <button class="u-refresh dir-left-nowrap main-between cross-center"
                                :class="[mall.setting.is_icon_members_grade != 1 ? 'no-member-icon' : '',]"
                                open-type="getUserInfo"
                                scope="userInfo"
                                @getAuthorize="getUserInfo"
                                @getuserinfo="getUserInfo"
                        >
                            <icon class="u-icon" type></icon>
                            <text>刷新</text>
                        </button>
                        <!-- #endif-->
                        <!--#ifdef H5 -->
                        <button class="u-refresh dir-left-nowrap main-between cross-center"
                                v-if="isWechat"
                                :class="[mall.setting.is_icon_members_grade != 1 ? 'no-member-icon' : '',]"
                                @click="getUserInfo"
                        >
                            <icon class="u-icon" type></icon>
                            <text>刷新</text>
                        </button>
                        <!-- #endif-->
                    </view>
                </template>
                <template v-else>
                    <app-form-id>
                        <view class="login-btn" @click="callLogin">点击登录</view>
                    </app-form-id>
                </template>
            </view>
        </view>
        <!-- style 2 end -->

        <!-- style 1 start -->
        <view class="style-1 dir-left-nowrap cross-center box-grow-1" v-else-if="topStyle == '1'">
            <view class="box-grow-0 avatar-container">
                <image :src="avatar" :class="[is_vip_card_user && is_icon_super_vip == '1' ? 'avatar is_vip' : 'avatar']"></image>
                <image v-if="is_vip_card_user && is_icon_super_vip == '1'" src="/static/image/vip_icon.png" class="vip_icon"></image>
            </view>
            <view class="box-grow-1 info-container">
                <template v-if="isLogin">
                    <view class="dir-left-nowrap cross-center">
                        <view v-if="userInfo" class="nickname t-omit" :style="{'color':userNameColor}">{{userInfo.nickname}}</view>
                        <!--#ifdef MP-WEIXIN -->
                        <button class="u-refresh dir-left-nowrap main-between cross-center member-margin" open-type="getUserInfo"
                                @getAuthorize="getUserInfo"
                                @getuserinfo="getUserInfo">
                            <icon class="u-icon" type></icon>
                            <text>刷新</text>
                        </button>
                        <!-- #endif-->
                        <!--#ifdef  H5 -->
                        <button class="u-refresh dir-left-nowrap main-between cross-center member-margin"
                                v-if="isWechat"
                                @click="getUserInfo">
                            <icon class="u-icon" type></icon>
                            <text>刷新</text>
                        </button>
                        <!-- #endif-->
                    </view>
                    <app-form-id @click="goMember" v-if="mall.setting.is_icon_members_grade == 1">
                        <view class="member-info inline-flex cross-center dir-left-nowrap">
                            <view>
                                <image :src="getMemberPicUrl" class="member-icon" mode="aspectFill"></image>
                            </view>
                            <view v-if="userInfo" class="t-omit">{{userInfo.identity.level_name}}</view>
                        </view>
                    </app-form-id>
                </template>
                <template v-else>
                    <app-form-id>
                        <view class="login-btn" @click="callLogin">点击登录</view>
                    </app-form-id>
                </template>
            </view>
            <view class="box-grow-0 address-container">
                <app-jump-button v-if="userInfo && userInfo.is_show_pay_code" form url="/plugins/teller/index/index">
                    <view class="pay-code">
                        <image class="pay-code-icon" src="/static/image/icon/pay-code.png"></image>
                        <view>付款码</view>
                    </view>
                </app-jump-button>
                <app-jump-button form url="/pages/address/address">
                    <view class="address-btn-1 dir-left-nowrap cross-center" >
                        <view>
                            <image class="address-btn-icon" src="/static/image/icon/address-white.png"></image>
                        </view>
                        <view>收货地址</view>
                    </view>
                </app-jump-button>
            </view>
        </view>
        <!-- style 1 end -->

    </view>
</template>

<script>
    import {mapState, mapGetters} from 'vuex';
    import Vue from "@dcloudio/vue-cli-plugin-uni/packages/h5-vue";

    export default {
        name: 'app-user-center-top',
        props: {
            topStyle: String,
            topPicUrl: String,
            memberPicUrl: String,
            userNameColor: String,
            is_icon_super_vip: {
                type: String,
                default() {
                    return '0';
                }
            },
        },
        computed: {
            isLogin() {
                return this.$user.isLogin();
            },
            ...mapState({
                mall: state => state.mallConfig.mall,
                is_vip_card_user: function(state) {
                    return state.user.info && state.user.info.is_vip_card_user ? 1 : 0;
                }
            }),
            ...mapGetters({
                userCenter: 'mallConfig/getUserCenter',
                userInfo: 'user/info',
            }),
            avatar() {
                if (this.isLogin && this.userInfo) {
                    return this.userInfo.avatar;
                } else {
                    return '/static/image/user-default-avatar.png';
                }
            },
            getMemberPicUrl() {
                return this.memberPicUrl;
                // todo 此处选哪个图标待确认
                if (this.memberPicUrl) {
                    return this.memberPicUrl;
                } else {
                    return this.userInfo.identity.member_pic_url;
                }
            },
            // #ifdef H5
            isWechat: function() {
                return this.$jwx.isWechat();
            }
            // #endif
        },
        // #ifdef MP
        created() {
            if (this.isLogin) {
                this.$store.dispatch('user/info', {refresh: true});
            }
        },
        // #endif
        methods: {
            callLogin() {
                this.$store.dispatch('user/accessToken');
            },
            goMember() {
                uni.navigateTo({
                    url: '/pages/member/index/index',
                });
            },
            getUserInfo(userInfoResult) {
                // #ifdef MP
                let _this = this;
                uni.login({
                    scopes: 'auth_user',
                    success(loginResult) {
                        const data = {
                            encryptedData: userInfoResult.detail.encryptedData,
                            iv: userInfoResult.detail.iv,
                            rawData: userInfoResult.detail.rawData,
                            signature: userInfoResult.detail.signature,
                            code: loginResult.code,
                        };
                        _this.$request({
                            url: _this.$api.passport.login,
                            method: 'post',
                            data: data
                        }).then(response => {
                            uni.hideLoading();
                            if (response.code === 0) {
                                uni.showToast({
                                    title: '资料已更新',
                                    icon: 'none'
                                });
                                this.$storage.setStorageSync('_USER_ACCESS_TOKEN', response.data.access_token);
                            } else {
                                return reject(response.msg);
                            }
                        });
                    }
                });
                // #endif
                // #ifdef H5
                this.$request({
                    url: this.$api.registered.url,
                    method: 'get',
                    data: {
                        scope: 'snsapi_userinfo',
                        response_type: 'code',
                        url: `${window.location.href}`
                    }
                }).then(res => {
                    if (res.code === 0) {
                        this.$storage.setStorageSync('_USER_SIGN', true);
                        window.location.replace(res.data.url);
                    } else {
                        uni.navigateTo({
                            url: '/pages/registered/sign'
                        });
                    }
                });
                // #endif
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-user-center-top {
        width: #{750rpx};
        height: #{300rpx};
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        overflow: hidden;
    }

    .avatar {
        width: #{132rpx};
        height: #{132rpx};
        border-radius: #{1000rpx};
    }

    .avatar.is_vip {
        border: #{8rpx} solid #ffe993;
    }

    .login-btn {
        display: inline-block;
        padding: #{12rpx} #{24rpx};
        font-size: $uni-font-size-import-one;
    }

    .avatar-container {
        padding: #{24rpx};
        position: relative;
    }

    .style-2 .vip_icon {
        left: 50%;
        margin-left: 29rpx;
    }

    .vip_icon {
        position: absolute;
        right: 0;
        top: 0;
        width: 58rpx;
        height: 57rpx;
    }

    .info-container {
        padding: #{0rpx};
        position: relative;
        z-index: 997;
    }

    .address-container {
        padding: #{24rpx};
    }

    .member-info {
        background: #3c3642;
        color: #fff;
        font-size: $uni-font-size-weak-two;
        padding: #{6rpx} #{12rpx};
        border-radius: #{1000rpx};
        height: #{36rpx};
        line-height: #{36rpx};

        .member-icon {
            display: block;
            width: #{44rpx};
            height: #{44rpx};
            margin-top: -#{6rpx};
            margin-bottom: -#{6rpx};
            margin-left: -#{12rpx};
            margin-right: #{6rpx};
            border-radius: #{1000rpx};
            overflow: hidden;
        }
    }

    .pay-code-btn {
        z-index: 998;
        position: absolute;
        right: 50rpx;
        top: 0;
        color: #fff;
        text-align: center;
        font-size: $uni-font-size-weak-two;
        .pay-code-icon {
            width: #{44rpx};
            height: #{44rpx};   
        }
    }

    .address-btn-3 {
        text-align: center;
        font-size: $uni-font-size-general-two;
        color: #ffffff;
        &.pay-code {
            margin-bottom: #{20rpx};
            font-size: $uni-font-size-weak-two;
            .pay-code-icon {
                width: #{44rpx};
                height: #{44rpx};   
            }
        }
        .address-btn-icon {
            width: #{44rpx};
            height: #{44rpx};
        }
    }

    .address-btn-1 {
        padding: #{16rpx} #{18rpx};
        border-radius: #{1000rpx} 0 0 #{1000rpx};
        margin-right: -#{48rpx};
        background: #ff4544;
        color: #ffffff;
        .address-btn-icon {
            width: #{44rpx};
            height: #{44rpx};
            margin-right: #{12rpx};
            display: block;
        }
    }

    .style-3 {

        .style-3-container {
            background-color: #fff;
            border-radius: #{12rpx};
            width: #{656rpx};
            height: #{220rpx};
            background-size: 100% 100%;

            .nickname {
                margin-bottom: #{12rpx};
                color: $uni-important-color-black;
            }
        }
        .u-refresh.member-margin {
            margin-bottom: 12upx;
        }
    }

    .style-2 {
        text-align: center;
        position: relative;
        
        .info-container {
            margin-top: -#{50rpx};
        }

        .nickname {
            color: #fff;
        }

        .nickname.no-member-icon {
            margin-top: #{30rpx};
        }

        .u-refresh.no-member-icon {
            margin-top: #{30rpx};
        }
        .login-btn {
            color: #fff;
            margin-top: #{40rpx};
        }
    }

    .style-1 {
        padding: 0 #{24rpx};

        .nickname {
            color: #fff;
            margin-bottom: #{12rpx};
        }
        .u-refresh.member-margin {
            margin-bottom: 12upx;
        }
        .pay-code {
            margin-bottom: #{20rpx};
            color: #fff;
            text-align: center;
            font-size: $uni-font-size-weak-two;
            margin-left: #{96rpx};
            .pay-code-icon {
                width: #{44rpx};
                height: #{44rpx};   
            }
        }
    }


    .u-refresh {
        border-radius: 18upx;
        border: 1upx solid #ffffff;
        min-width: 69upx;
        margin:0 0 0 10upx;
        box-sizing: content-box;
        height: 37upx;
        padding: 0 13upx;
        background-color: transparent;
        transform: rotateZ(360deg);
        .u-icon {
            width: 21upx;
            height: 21upx;
            background-image: url('../../../static/image/icon/refresh.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            margin-right: 5upx;
        }
        text {
            line-height: 1;
            color: #ffffff;
            font-size: 21upx;
        }
    }

</style>
