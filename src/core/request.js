import Vue from 'vue';
import { popAll } from './formId.js';
import apiUrl from './apiUrl.js';
import siteInfo from 'siteInfo';

const request = async function (args) {
    const header = {
        // #ifndef H5
        'X-App-Platform': (args.header && args.header['X-App-Platform']) ? args.header['X-App-Platform'] : Vue.prototype.$platform,
        // #endif
        'X-Form-Id-List': JSON.stringify(popAll()),
        'X-Requested-With': (args.header && args.header['X-Requested-With']) ? args.header['X-Requested-With'] : 'XMLHttpRequest',
        'X-App-Version': Vue.prototype.$appVersion,
        'content-type': args.header && args.header.contentType ? args.header['content-type'] : 'application/x-www-form-urlencoded',
        // #ifdef MP-TOUTIAO
        'X-tt-platform': Vue.prototype.$store.state.gConfig.systemInfo.appName,
        // #endif
    };

    await Vue.prototype.$store.dispatch('user/loadAccessTokenFormCache');
    if (Vue.prototype.$store.state.user && Vue.prototype.$store.state.user.accessToken) {
        header['X-Access-Token'] = Vue.prototype.$store.state.user.accessToken;
    }
    if (Vue.prototype.$store.state.user && Vue.prototype.$store.state.user.tempParentId !== 0) {
        header['X-User-Id'] = Vue.prototype.$store.state.user.tempParentId + '';
    }

    //多商户Token
    let obj = {};
    args.url.replace(/([^=&]+)=([^&]*)/g, function (m, key, value) {
        obj[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    if (Vue.prototype.$utils.objectValues(apiUrl.mch).indexOf(obj.r) !== -1) {
        const mch_storage = Vue.prototype.$storage.getStorageSync('MCH2019');
        header['Mch-Access-Token'] = mch_storage.token;
    }
    // #ifdef H5
    let platform_storage = Vue.prototype.$storage.getStorageSync('platform');
    platform_storage = platform_storage === 'wxapp_wechat' ? 'wechat' : platform_storage;
    header['X-App-Platform'] = (args.header && args.header['X-App-Platform']) ? args.header['X-App-Platform'] : `${siteInfo.platform}`;
    // #endif
    const [error, response] = await uni.request({
        url: args.url,
        method: args.method || 'get',
        data: args.data,
        header: header
    });

    if (error) {
        let msg = {
            code: 400,
            msg: error.errMsg,
            data: error,
        };
        alertError(msg);
        return Promise.reject(msg);
    } else {
        return distinguishStatusCode(response);
    }
};

// #ifndef MP-ALIPAY
const reloadPage = function () {
    let pages = getCurrentPages();
    let page = pages[pages.length - 1];
    let options = page.options || {};
    let route = page.route || '';
    if (route.indexOf('/') !== 0) {
        route = '/' + route;
    }
    let query = '';
    for (let k in options) {
        query = query + `${k}=${options[k]}&`;
    }
    uni.redirectTo({
        url: route + (query ? `?${query}` : ``),
    });
};
// #endif

const alertError = function (error) {
    let confirmText = '刷新页面';
    // #ifdef MP-ALIPAY
    confirmText = '确认';
    // #endif
    uni.showModal({
        title: '网络错误',
        content: '网络开了小差，请刷新重试下哦~',
        cancelText: '复制错误',
        confirmText: confirmText,
        success: (e) => {
            if (e.cancel) {
                let data = `code: ${error.code}, \r\nmsg: ${error.msg}, \r\ndetail: `
                    + (error.data ? (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)) : null);
                Vue.prototype.$utils.uniCopy({
                    data: data
                });
            }
            if (e.confirm) {
                // #ifndef MP-ALIPAY
                reloadPage();
                // #endif
            }
        },
    });
};

const distinguishDataCode = function (response) {
    if (response.data) {
        let {msg, code} = response.data;

        if (code >= 400) {
            alertError({
                code: code,
                msg: msg,
                data: response.data.error || (response.data.data || msg),
            });
            return Promise.reject(msg);
        } else if (code === 2) {
            // #ifdef H5
            if (Vue.prototype.$jwx.isWechat()) {
                Vue.prototype.$store.dispatch('user/showAttention', true);
            }
            // #endif
            return Promise.reject(msg);
        } else if (code === -1) {
            Vue.prototype.$store.dispatch('user/logout');
            Vue.prototype.$store.dispatch('user/accessToken');
            return Promise.reject(msg);
        } else if (code === -2) {
            uni.redirectTo({
                url: '/pages/disabled/disabled?text=' + response.data.data.text
            });
        } else if (code === -3) {
            uni.redirectTo({
                url: '/plugins/mch/mch/login/login'
            });
            return Promise.reject(msg);
        } else {
            return Promise.resolve(response.data);
        }
    } else {
        return Promise.reject({
            code: 200,
            msg: '数据不存在',
            data: response,
        });
    }
};

const distinguishStatusCode = function (response) {
    let msg = {
        code: 500,
        msg: '服务器内部错误',
        data: response,
    };
    switch (response.statusCode) {
        case 200:
            return distinguishDataCode(response);
        case 404:
            msg = {
                code: 404,
                msg: '资源获取不到',
                data: response,
            };
            break;
        case 500:
            msg = {
                code: 500,
                msg: '服务器内部错误',
                data: response,
            };
            break;
        case 503:
            msg = {
                code: 503,
                msg: '服务不可用',
                data: response,
            };
            break;
        case 504:
            msg = {
                code: 504,
                msg: '网关超时',
                data: response,
            };
            break;
        case 400:
            msg = {
                code: 400,
                msg: '服务器不理解请求的语法',
                data: response,
            };
            break;
        case 403:
            msg = {
                code: 403,
                msg: '服务器拒绝请求',
                data: response,
            };
            break;
        case 405:
            msg = {
                code: 405,
                msg: '方法禁用',
                data: response,
            };
            break;
        case 406:
            msg = {
                code: 406,
                msg: '无法使用请求的内容特性响应请求的网页',
                data: response,
            };
            break;
        case 407:
            msg = {
                code: 407,
                msg: '需要代理授权',
                data: response,
            };
            break;
        case 408:
            msg = {
                code: 408,
                msg: '请求超时',
                data: response,
            };
            break;
        case 409:
            msg = {
                code: 409,
                msg: '冲突',
                data: response,
            };
            break;
        case 410:
            msg = {
                code: 410,
                msg: '已删除',
                data: response,
            };
            break;
        case 411:
            msg = {
                code: 411,
                msg: '需要有效长度',
                data: response,
            };
            break;
        case 412:
            msg = {
                code: 412,
                msg: '服务器未满足请求者在请求中设置的其中一个前提条件',
                data: response,
            };
            break;
        case 413:
            msg = {
                code: 413,
                msg: '请求实体过大',
                data: response,
            };
            break;
        case 414:
            msg = {
                code: 414,
                msg: '求情URI过长',
                data: response,
            };
            break;
        case 415:
            msg = {
                code: 415,
                msg: '不支持的媒体类型',
                data: response,
            };
            break;
        case 416:
            msg = {
                code: 416,
                msg: '请求范围不符合要求',
                data: response,
            };
            break;
        case 417:
            msg = {
                code: 417,
                msg: '未满足期望值',
                data: response,
            };
            break;
        default:
            break;
    }
    alertError(msg);
    return Promise.reject(msg);
};

export default request;
//
//
// class Request {
//     // 设置全局默认配置
//     setConfig(customConfig) {
//         // 深度合并对象，否则会造成对象深层属性丢失
//         this.config = deepMerge(this.config, customConfig);
//     }
//
//     request(options = {}) {
//         // 检查请求拦截
//         if (this.interceptor.request && typeof this.interceptor.request === 'function') {
//             let tmpConfig = {};
//             let interceptorRequest = this.interceptor.request(options);
//             if (interceptorRequest === false) {
//                 // 返回一个处于pending状态中的Promise，来取消原promise，避免进入then()回调
//                 return new Promise(()=>{});
//             }
//             this.options = interceptorRequest;
//         }
//         options.dataType = options.dataType || this.config.dataType;
//         options.responseType = options.responseType || this.config.responseType;
//         options.url = options.url || '';
//         options.params = options.params || {};
//         options.header = Object.assign(this.config.header, options.header);
//         options.method = options.method || this.config.method;
//
//         return new Promise((resolve, reject) => {
//             options.complete = (response) => {
//                 // 请求返回后，隐藏loading(如果请求返回快的话，可能会没有loading)
//                 uni.hideLoading();
//                 // 清除定时器，如果请求回来了，就无需loading
//                 clearTimeout(this.config.timer);
//                 this.config.timer = null;
//                 if (this.config.originalData) {
//                     // 判断是否存在拦截器
//                     if (this.interceptor.response && typeof this.interceptor.response === 'function') {
//                         let resInterceptors = this.interceptor.response(response);
//                         // 如果拦截器不返回false，就将拦截器返回的内容给this.$u.post的then回调
//                         if (resInterceptors !== false) {
//                             resolve(resInterceptors);
//                         } else {
//                             // 如果拦截器返回false，意味着拦截器定义者认为返回有问题，直接接入catch回调
//                             reject(response);
//                         }
//                     } else {
//                         // 如果要求返回原始数据，就算没有拦截器，也返回最原始的数据
//                         resolve(response);
//                     }
//                 } else {
//                     if (response.statusCode === 200) {
//                         if (this.interceptor.response && typeof this.interceptor.response === 'function') {
//                             let resInterceptors = this.interceptor.response(response.data);
//                             if (resInterceptors !== false) {
//                                 resolve(resInterceptors);
//                             } else {
//                                 reject(response.data);
//                             }
//                         } else {
//                             // 如果不是返回原始数据(originalData=false)，且没有拦截器的情况下，返回纯数据给then回调
//                             resolve(response.data);
//                         }
//                     } else {
//                         // 不返回原始数据的情况下，服务器状态码不为200，modal弹框提示
//                         if(response.errMsg) {
//                             uni.showModal({
//                                 title: response.errMsg
//                             });
//                         }
//                         reject(response)
//                     }
//                 }
//             }
//
//             // 判断用户传递的URL是否/开头,如果不是,加上/，这里使用了uView的test.js验证库的url()方法
//             options.url = Vue.prototype.$validation.url(options.url) ? options.url : (this.config.baseUrl + (options.url.indexOf('/') === 0 ?
//                 options.url : '/' + options.url));
//             // 是否显示loading
//             // 加一个是否已有timer定时器的判断，否则有两个同时请求的时候，后者会清除前者的定时器id
//             // 而没有清除前者的定时器，导致前者超时，一直显示loading
//             if(this.config.showLoading && !this.config.timer) {
//                 this.config.timer = setTimeout(() => {
//                     uni.showLoading({
//                         title: this.config.loadingText,
//                         mask: this.config.loadingMask
//                     })
//                     this.config.timer = null;
//                 }, this.config.loadingTime);
//             }
//             uni.request(options);
//         })
//     }
//
//     constructor() {
//         this.config = {
//             baseUrl: '', // 请求的根域名
//             // 默认的请求头
//             header: {
//                 'X-App-Platform': Vue.prototype.$platform,
//                 'X-Form-Id-List': JSON.stringify(popAll()),
//                 'X-Requested-With': 'XMLHttpRequest',
//                 'X-App-Version': Vue.prototype.$appVersion,
//                 'content-type': 'application/x-www-form-urlencoded'
//             },
//             method: 'POST',
//             // 设置为json，返回后uni.request会对数据进行一次JSON.parse
//             dataType: 'json',
//             // 此参数无需处理，因为5+和支付宝小程序不支持，默认为text即可
//             responseType: 'text',
//             showLoading: true, // 是否显示请求中的loading
//             loadingText: '请求中...',
//             loadingTime: 800, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
//             timer: null, // 定时器
//             originalData: false, // 是否在拦截器中返回服务端的原始数据，见文档说明
//             loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
//         }
//
//         // 拦截器
//         this.interceptor = {
//             // 请求前的拦截
//             request: function(config) {
//                 // //多商户Token
//                 // let obj = {};
//                 // config.url.replace(/([^=&]+)=([^&]*)/g, function (m, key, value) {
//                 //     obj[decodeURIComponent(key)] = decodeURIComponent(value);
//                 // });
//                 // if (Vue.prototype.$utils.objectValues(apiUrl.mch).indexOf(obj.r) !== -1) {
//                 //     const mch_storage = uni.getStorageSync('MCH2019');
//                 //     config.header['Mch-Access-Token'] = mch_storage.token;
//                 // }
//                 return config;
//             },
//             // 请求后的拦截
//             response: null
//         }
//
//     }
// }
//
// export {
//     Request
// }
