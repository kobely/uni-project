import api from './appOnLaunch.js';
import event from './event.js';
import $const from './const.js';
import $store from '../store/index.js';
import Vue from 'vue';
const storageKey = '_USER_ACCESS_TOKEN';

let userInfo = null;

export default {
    getUserInfoResolve: null,
    getUserInfoReject: null,
    getAccessToken(options) {
        options = options || {};
        if (typeof options.cacheOnly === 'undefined') {
            options.cacheOnly = false;
        }
        return new Promise((resolve, reject) => {
            let accessToken = Vue.prototype.$storage.getStorageSync(storageKey);
            if (accessToken) {
                return resolve(accessToken);
            }
            if (options.cacheOnly) {
                return resolve(accessToken);
            }
            const pages = getCurrentPages();
            const currentPage = pages[pages.length - 1];
            currentPage.$vm.$store.commit('user/showLoginModal', true);
            this.getUserInfoResolve = (userInfoResult) => {
                uni.showLoading({
                    mask: true,
                    title: '正在登录',
                });
                uni.login({
                    scopes: 'auth_base',
                    success(loginResult) {
                        const data = {
                            encryptedData: userInfoResult.detail.encryptedData,
                            iv: userInfoResult.detail.iv,
                            rawData: userInfoResult.detail.rawData,
                            signature: userInfoResult.detail.signature,
                            code: loginResult.code,
                        };
                        Vue.prototype.$request({
                            url: api.passport.login,
                            method: 'post',
                            data: data,
                        }).then(response => {
                            uni.hideLoading();
                            if (response.code === 0) {
                                event.trigger($const.EVENT_USER_LOGIN);
                                Vue.prototype.$storage.setStorageSync(storageKey, response.data.access_token);
                                return resolve(response.data.access_token);
                            } else {
                                return reject(response.msg);
                            }
                        }).catch(e => {
                            uni.hideLoading();
                            reject(e);
                        });
                    },
                    fail(error) {
                        reject(error);
                    }
                });
            };
            this.getUserInfoReject = (e) => {
                reject(e);
            };
        });
    },
    getInfo(options) {
        options = options || {};
        if (typeof options.refresh === 'undefined') {
            options.refresh = false;
        }
        return new Promise((resolve, reject) => {
            if (options.refresh) {
                userInfo = null;
            }
            if (userInfo) {
                return resolve(userInfo);
            }
            this.getAccessToken().then(accessToken => {
                uni.showNavigationBarLoading();
                Vue.prototype.$request({
                    url: api.user.user_info,
                }).then(response => {
                    uni.hideNavigationBarLoading();
                    if (response.code === 0) {
                        let platform = response.data.platform;
                        // #ifdef H5
                        if (Vue.prototype.$jwx.isWechat() && platform === 'wxapp_wechat') {
                            platform = 'wechat';
                        }
                        // #endif
                        Vue.prototype.$storage.setStorageSync('platform', platform);
                        userInfo = JSON.parse(JSON.stringify(response.data));
                        event.trigger($const.EVENT_USER_REGISTER, userInfo);
                        if (typeof userInfo.register !== 'undefined') {
                            let register = userInfo.register;
                            if (register.coupon_list) {
                                let coupon = {
                                    list: register.coupon_list,
                                    type: 'register'
                                };
                                $store.dispatch('page/actionSetCoupon', coupon);
                            }
                        }
                        return resolve(userInfo);
                    } else {
                        return reject(response.msg);
                    }
                }).catch(e => {
                    uni.hideNavigationBarLoading();
                    return reject(e);
                });
            }).catch(e => {
                return reject(e);
            });
        });
    },
    isLogin() {
        if ($store && $store.state.user && $store.state.user.accessToken) return true;
        return !!Vue.prototype.$storage.getStorageSync(storageKey);
    },
    loginByToken(token) {
        Vue.prototype.$storage.setStorageSync(storageKey, token);
    },
    silentLogin() {
        // #ifdef MP-WIXIN
        uni.login({
            success: function (loginRes) {
                Vue.prototype.$request({
                    url: api.passport.login,
                    method: 'post',
                    data: {
                        code: loginRes.code
                    },
                }).then(response => {
                    if (response.code === 0) {
                        Vue.prototype.$storage.setStorageSync(storageKey, response.data.access_token);
                    }
                });
            }
        });
        // #endif
        // #ifdef H5
        let params = Vue.prototype.$utils.getUrlParam('code');
        if (!params) {
            Vue.prototype.$request({
                url: Vue.prototype.$api.registered.url,
                method: 'get',
                data: {
                    scope: 'snsapi_base',
                    response_type: 'code',
                    url: `${window.location.href}`
                }
            }).then(res => {
                if (res.code === 0) {
                    Vue.prototype.$storage.setStorageSync('_USER_SIGN', true);
                    window.location.href = res.data.url;
                } else {
                    Vue.prototype.$storage.setStorageSync('isSign', true);
                }
            });
        }
        // #endif
    }
}
