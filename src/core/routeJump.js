import store from '../store/index.js';
import user from '../core/user.js';
import { clearStorage } from '../core/cache.js';


const jump = function(data) {
    if (!data.open_type && !data.params && !data.page_url) return;

    let open_type  = data.open_type;
    let params = data.params;
    let page_url = data.page_url;

    if (!Array.isArray(params) && Object.prototype.toString.call(params) ==="[object String]" && params) {
        params = JSON.parse(params);
    }

    switch (open_type) {
        case 'reLaunch':
            uni.reLaunch({
                url: params[0].value,
            });
            break;

        case 'redirect':
            uni.redirectTo({
                url: params[0].value,
            });
            break;

        case 'navigate':
            let new_page_url =  page_url.split('?')[0];
            let options = `?`;

            for (let i = 0; i < params.length; i++) {
                options += `${params[i].key}=${params[i].value}&`;
            }
            new_page_url += options.slice(0, options.length - 1);

            if (options === '?') {
                new_page_url = page_url;
            }
            /* #ifdef MP-BAIDU || MP-TOUTIAO */
            if (page_url.split('?')[0] !== '/plugins/step/index/index') {
                uni.navigateTo({
                    url: new_page_url
                });
            }
            /* #endif */

            /* #ifdef MP-WEIXIN || MP-ALIPAY */
            uni.navigateTo({
                url: new_page_url
            });
            /* #endif */

            break;

        case 'app_admin':
            if (store.state.user.info.identity.is_admin == 1) {
                uni.navigateTo({
                    url: data.url,
                });
            }
            break;

        case 'back':
            uni.navigateBack({});
            break;

        case 'tel':
            uni.makePhoneCall({
                phoneNumber: params[0].value,
            });
            break;

        case 'web':
            uni.navigateTo({
                url: `${page_url.split('?')[0]}?url=${encodeURIComponent(params[0].value)}`
            });
            break;

        case 'app':
            let originalPath = '';
            for (let i = 0; i < params.length; i++) {
                originalPath += `${params[i].key}=${params[i].value}&`;
            }
            if (typeof originalPath !== 'string') return;
            let groups = originalPath.split('&');
            let obj = {};
            for (let i in groups) {
                if (typeof groups[i] !== 'string') continue;
                if (!groups[i].length) continue;
                let kvs = groups[i].split('=');
                if (kvs.length !== 2) {
                    let s = '';
                    for (let i = 1; i < kvs.length; i++) {
                        if (i+1 === kvs.length) {
                            continue;
                        } else {
                            s += `${kvs[i]}=${kvs[i+1]}`
                        }
                    }
                    obj[kvs[0]] = s;
                } else {
                    obj[kvs[0]] = kvs[1];
                }
            }
            let new_params = obj;
            let appId = '';
            let path = '';
            // #ifdef MP-WEIXIN
            appId = new_params.app_id || '';
            path = new_params.path || '';
            // #endif
            // #ifdef MP-ALIPAY
            appId = new_params.ali_app_id || '';
            path = new_params.ali_path || '';
            // #endif
            // #ifdef MP-TOUTIAO
            appId = new_params.tt_app_id || '';
            path = new_params.tt_path || '';
            // #endif
            // #ifdef MP-BAIDU
            appId = new_params.bd_app_key || '';
            path = new_params.bd_path || '';
            // #endif
            uni.navigateToMiniProgram({
                appId: appId,
                path: path
            });
            break;

        case 'clear_cache':
            uni.showModal({
                title: '提示',
                content: '确认清理缓存？',
                cancelText: '取消',
                confirmText: '确认',
                success: (e) => {
                    if (e.confirm) {
                        uni.showLoading({
                            title: '清理缓存...',
                        });
                        clearStorage();
                        if (user && store && store.state.user.accessToken) {
                            user.loginByToken(store.state.user.accessToken);
                        }
                        store.dispatch('mallConfig/actionResetConfig');
                        uni.hideLoading();
                        uni.showToast({
                            title: '清理完成',
                            duration: 1000,
                        });
                    }
                },
            });
            break;

        case 'map':
            // uni.openLocation({
            //     latitude: Number(this.latitude),
            //     longitude: Number(this.longitude),
            //     name: this.address,
            //     address: this.address,
            //     success: function () {
            //     },
            //     fail: function () {
            //     }
            // });
            break;
        // case 'share':
    }
};

export default jump;
