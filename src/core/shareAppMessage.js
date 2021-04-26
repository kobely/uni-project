import {objectToUrlParams} from "./utils";
import request from "../core/request.js";
import api from "../core/appOnLaunch.js";
import $store from "../store/index.js";
import user from './user.js';
import Vue from "vue";
// #ifdef H5
import jwx from '../core/jweixin.js';
// #endif

const shareAppMessage = function (args, success) {
    args = args || {
        title: '这是一个分享页面',
        path: '/pages/index/index',
        params: {}
    };
    if (typeof args.params === 'undefined') {
        args.params = {};
    }
    // #ifdef MP-ALIPAY
    if (typeof args.imageUrl !== 'undefined') {
        args.bgImgUrl = args.imageUrl;
    }
    // #endif
    let user_id = 0;

    if (user.isLogin() && Vue.prototype.$store.state.user.info) {
        user_id = Vue.prototype.$store.state.user.info.options.user_id;
    }
    if (typeof args.path === 'undefined' || (args.path === '/pages/index/index' && typeof args.params.page_id === 'undefined')) {
        args.path = `/pages/index/index?user_id=${user_id}`;
        if (Object.keys(args.params).length != 0) {
            args.path += `&` + objectToUrlParams(args.params);
        }
    } else {
        args.params.path = args.path;
        args.params.user_id = user_id;
        // #ifdef MP
        args.path = `/pages/index/index?scene=share&user_id=${user_id}&params=${JSON.stringify(args.params)}`;
        // #endif
        // #ifdef H5
        args.path = `/pages/index/index?scene=share&user_id=${user_id}&params=${btoa(JSON.stringify(args.params))}`;
        // #endif
    }
    // #ifdef H5
    let reg = /^(\S+\?\#)\S+$/;
    let h = window.location.href.match(reg);
    if (h) {
        let link = h[1] + args.path;
        if (success) {
            if (jwx.isWechat()) {
                Vue.prototype.$store.commit('share/status', true);
            } else {
                Vue.prototype.$utils.uniCopy({
                    data: link,
                    success() {
                        uni.showToast({
                            icon: 'none',
                            title: '链接已复制'
                        });
                    }
                });
            }
        }
        async function we() {
            await new Promise(function (resolve, reject) {
                jwx.updateAppMessageShareData({
                    data: {
                        title: args.title,
                        imgUrl: args.imgUrl ? args.imgUrl : args.imageUrl,
                        link,
                        desc: args.desc ? args.desc : ' '
                    },
                    success: function (res) {
                        success && success(res);
                        resolve(res);
                    },
                    cancel: function (res) {
                        reject(res);
                    }
                });
            });
        }

        we();
    }
    // #endif
    // #ifdef MP
    // 无法监听分享 故去掉
    setTimeout(() => {
        request({
            url: api.coupon.share_coupon,
        }).then(response => {
            if (response.code === 0) {
                let coupon = {
                    list: response.data.list,
                    type: 'share'
                };
                $store.dispatch('page/actionSetCoupon', coupon);
            }
        }).catch(() => {
        });
    }, 1000);
    // #endif
    return args;
};


export default shareAppMessage;

