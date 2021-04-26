import {popAll} from "./formId";
import Vue from "vue";
import $store from "../store";
import {objectValues} from "./utils";
import apiUrl from "./apiUrl";

const setHeader = async function (args, type) {
    const header = {
        'X-App-Platform': (args.header && args.header['X-App-Platform']) ? args.header['X-App-Platform'] : Vue.prototype.$platform,
        'X-Form-Id-List': JSON.stringify(popAll()),
        'X-Requested-With': (args.header && args.header['X-Requested-With']) ? args.header['X-Requested-With'] : 'XMLHttpRequest',
        'X-App-Version': Vue.prototype.$appVersion,
        'content-type': type ? 'multipart/form-data' :'application/x-www-form-urlencoded'
    };

    await $store.dispatch('user/loadAccessTokenFormCache');

    if ($store.state.user && $store.state.user.accessToken) {
        header['X-Access-Token'] = $store.state.user.accessToken;
    }
    if ($store.state.user && $store.state.user.tempParentId !== 0) {
        header['X-User-Id'] = $store.state.user.tempParentId + '';
    }
    //多商户Token
    let obj = {};
    args.url.replace(/([^=&]+)=([^&]*)/g, function (m, key, value) {
        obj[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    if (objectValues(apiUrl.mch).indexOf(obj.r) !== -1) {
        const mch_storage = Vue.prototype.$storage.getStorageSync('MCH2019');
        header['Mch-Access-Token'] = mch_storage.token;
    }
    return header;
};

export default setHeader