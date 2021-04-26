import * as utils from './utils.js';

export default {
    // 获取不带options的路由
    route(page = null) {
        if (!page) {
            let pages = getCurrentPages();
            if (pages.length) {
                page = pages[pages.length - 1];
            }
        }
        let route = '';
        // #ifndef MP-TOUTIAO
        route = `/${page.route.split('?')[0]}`;
        // #endif

        // #ifdef MP-TOUTIAO
        route = `/${page.__route__.split('?')[0]}`;
        // #endif
        return route;
    },

    // 获取带options的路由
    routeWithOption(page = null) {
        if (!page) {
            let pages = getCurrentPages();
            if (pages.length) {
                page = pages[pages.length - 1];
            }
        }
        let route = '';
        // #ifndef MP-TOUTIAO
        route = `/${page.route.split('?')[0]}`;
        // #endif

        // #ifdef MP-TOUTIAO
        route = `/${page.__route__.split('?')[0]}`;
        // #endif
        if (page.options) {
            route += '?' + utils.objectToUrlParams(page.options);
        }
        return route;
    },

    // 获取带options(去除某些特定参数的)的路由 page_count--created时总页面数量
    tabBarUrl(page = null, page_count = 0) {
        if (!page) {
            let pages = getCurrentPages();
            if (pages.length) {
                let diff = (pages.length - page_count) > 0 && page_count > 0 ? pages.length - page_count : 0;
                page = pages[pages.length - 1 - diff];
            }
        }
        let route = '';
        // #ifndef MP-TOUTIAO
        route = `/${page.route.split('?')[0]}`;
        // #endif

        // #ifdef MP-TOUTIAO
        route = `/${page.__route__.split('?')[0]}`;
        // #endif
        let options = {};
        // #ifdef MP-ALIPAY
        if (route === '/pages/index/index') {
            options = {
                page_id: page.data.page_id
            };
        }
        if (route === '/pages/cats/cats' && typeof page.data.options.cat_id !== 'undefined') {
            options = {
                cat_id: page.data.options.cat_id
            };
        }
        // #endif
        // #ifdef MP
        // #ifndef MP-ALIPAY
        options = page.options;
        // #endif
        // #endif

        // #ifdef H5
        if (route === '/pages/index/index') {
            options = {
                page_id: page._data.page_id
            };
        }
        if (route === '/pages/cats/cats' && typeof page._data.options.cat_id !== 'undefined') {
            options = {
                cat_id: page._data.options.cat_id
            };
        }
        // #endif

        if (options) {
            let params = {};
            for (let key in options) {
                if (!(key == 'user_id' || key == 'scene' || key == 'params' || key == 'first_id' || key == 'select_cat_id' || key == 'path'
                    || key == 'share_openid' || key == 'custom_params' || key == 'room_id' || key == 'openid'
                    || key == 'multipleSlots' || key == 'addGlobalClass')) {
                    if (key == 'page_id') {
                        if (options[key] > 0) {
                            params[key] = options[key];
                        }
                    } else {
                        params[key] = options[key];
                    }
                }
            }
            params = utils.objectToUrlParams(params);
            if (params) {
                route += '?' + params;
            }
        }
        return route;
    },

    reload() {
        getCurrentPages()[getCurrentPages().length - 1].onShow();
    }
}
