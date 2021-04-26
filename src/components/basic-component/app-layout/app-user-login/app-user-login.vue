<template>
    <view class="login-1 dir-left-nowrap main-center cross-center" :class="showLoginModal ? 'show' : ''">
        <view class="login-content">
            <image :src="auth_page && auth_page.pic_url" class="login-img"></image>
            <view>
                <app-hotspot :hotspot="auth_page.hotspot_link">
                    <button class="login-btn" @click="link"></button>
                </app-hotspot>
            </view>
            <view>
                <app-hotspot :hotspot="auth_page.hotspot_cancel">
                    <button class="login-btn" @click="cancel"></button>
                </app-hotspot>
            </view>
            <view>
                <app-hotspot :hotspot="auth_page.hotspot">
                    <!-- #ifdef MP -->
                    <button class="login-btn"
                            :open-type="openType"
                            scope="userInfo"
                            @getAuthorize="getUserInfo"
                            @getuserinfo="getUserInfo"
                            @click="getUserInfoClick"
                    >
                    </button>
                    <!-- #endif -->
                    <!-- #ifdef H5 -->
                    <view class="login-btn" @click="getUserInfo"></view>
                    <!-- #endif -->
                </app-hotspot>
            </view>
        </view>
    </view>
</template>

<script>
    import Vue from 'vue';
    import {mapState} from 'vuex';
    import appHotspot from '../../../basic-component/app-hotspot/app-hotspot.vue';

    export default {
        name: 'app-user-login',
        components: {
            appHotspot,
        },
        data() {
            return {};
        },
        computed: {
            openType() {
                // #ifdef MP-ALIPAY
                return 'getAuthorize';
                // #endif
                return 'getUserInfo';
            },
            ...mapState('mallConfig', {
                auth_page: state => state.auth_page,
            }),
            ...mapState({
                showLoginModal: function(state) {
                    return state.user.showLoginModal
                }
            }),
        },
        created() {
            const vm = this;
            Vue.use({
                install(Vue, options) {
                    Vue.prototype.$layout = {
                        getUserInfo() {
                            vm.showLoginModal = true;
                            return new Promise((resolve, reject) => {
                                vm.getUserInfo = (e) => {
                                };
                            });
                        },
                    };
                },
            });
        },
        methods: {
            link() {
                this.$store.commit('user/showLoginModal', false);
            },
            cancel() {
                this.$store.commit('user/showLoginModal', false);
                this.$user.getUserInfoReject('getUserInfo fail: cancel.');
                let pages = getCurrentPages();
                let list = ['/pages/index/index', '/pages/user-center/user-center'];
                // #ifdef MP
                let url = this.$platDiff.route();
                // #endif
                // #ifdef H5
                let {hash} = window.location;
                hash = hash.split('#')[1];
                let url =hash;
                if (url === '/') {
                    url = '/pages/index/index'
                }
                // #endif

                if (list.includes(url)) {
                    // #ifdef MP
                    url = this.$platDiff.routeWithOption();
                    // #endif
                    // #ifdef H5
                    url = window.location.hash;
                    // #endif
                    uni.redirectTo({
                        url: url
                    });
                } else if (pages.length >= 2) {
                    uni.navigateBack({
                        delta: 1
                    });
                } else {
                    uni.redirectTo({
                        url: '/pages/index/index'
                    });
                }
            },
            // #ifdef MP
            getUserInfoClick(e) {
                // #ifdef MP-TOUTIAO
                this.getUserInfo(e);
                // #endif
            },
            // #endif
            getUserInfo(e) {
                // #ifdef H5
                if (this.$jwx.isWechat()) {
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
                } else {
                    uni.navigateTo({
                        url: '/pages/registered/sign'
                    });
                }
                // #endif
                // #ifdef MP
                this.$store.commit('user/showLoginModal', false);
                const resolve = this.$user.getUserInfoResolve;
                const reject = this.$user.getUserInfoReject;
                this.$event.on(this.$const.EVENT_USER_LOGIN, true).then(() => {
                    this.$jump({
                        open_type: 'reload'
                    })
                });
                // #ifdef MP-WEIXIN
                if (e.detail.errMsg !== 'getUserInfo:ok') {
                    this.$store.commit('user/showLoginModal', true);
                    return reject(e.detail.errMsg);
                } else {
                    return resolve(e);
                }
                // #endif

                // #ifdef MP-ALIPAY
                my.getOpenUserInfo({
                    success(openUserInfo) {
                        const response = JSON.parse(openUserInfo.response);
                        e.detail = {
                            rawData: JSON.stringify(response.response),
                            encryptedData: '',
                            iv: '',
                            signature: '',
                        };
                        return resolve(e);
                    },
                    fail(failE) {
                        console.log('getOpenUserInfo:', failE);
                    },
                });
                // #endif

                // #ifdef MP-BAIDU
                e.detail.rawData = JSON.stringify(e.detail.userInfo);
                e.detail.encryptedData = '';
                e.detail.iv = '';
                e.detail.signature = '';
                return resolve(e);
                // #endif

                // #ifdef MP-TOUTIAO
                uni.login({
                    success() {
                        uni.getUserInfo({
                            success(result) {
                                e.detail = {
                                    rawData: result.rawData,
                                    encryptedData: '',
                                    iv: '',
                                    signature: '',
                                };
                                return resolve(e);
                            },
                            fail(e) {
                                console.log('getUserInfo fail:', e);
                            },
                        });
                    },
                    fail(e) {
                        console.log('login fail:', e);
                    },
                });
                // #endif
                // #endif
            },
            // #ifdef H5
            getUrlParam(name) {
                let url = window.location.href.split('#')[0];
                let search = url.split('?')[1]
                if (search) {
                    let r = search.substr(0).match(new RegExp('(^|&)' + name + '=([^&]*)(&|$)'))
                    if (r !== null) return unescape(r[2])
                    return null
                } else {
                    return null
                }
            }
            // #endif
        }
    }
</script>

<style scoped lang="scss">
    $login-padding: #{200rpx} #{50rpx};

    .login-1 {
        box-sizing: border-box;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        padding: $login-padding;
        visibility: hidden;
        opacity: 0;
        transition: opacity 200ms;

        .login-btn {
            display: block;
            width: 100%;
            height: 100%;
            opacity: 0;
            padding: 0;
        }

        .login-content {
            position: relative;
            width: #{650rpx};
            height: #{700rpx};
        }

        .login-img {
            width: #{650rpx};
            height: #{700rpx};
        }
    }

    .login-1.show {
        visibility: visible;
        opacity: 1;
    }
</style>