import request from './request.js';
import api from './appOnLaunch.js';
import Vue from "vue";

let isFirstAppRun = true;
let isGettingFromService = false;
let mallConfig = null;
let cacheKey = '_APP_CONFIG';
let resolveList = [];
let rejectList = [];

const getConfigFormServer = (resolve, reject) => {
    if (resolve) {
        resolveList.push(resolve);
    }
    if (reject) {
        rejectList.push(reject);
    }
    if (isGettingFromService) {
        return;
    }
    isGettingFromService = true;
    request({
        url: api.index.config,
    }).then(response => {
        isGettingFromService = false;
        if (response.code === 0) {
            mallConfig = response.data;
            Vue.prototype.$storage.setStorageSync(cacheKey, mallConfig);
            for (let i in resolveList) {
                resolveList[i](mallConfig);
            }
            resolveList = [];
        } else {
            for (let i in rejectList) {
                rejectList[i](response.msg);
            }
            rejectList = [];
        }
    }).catch(error => {
        isGettingFromService = false;
        for (let i in rejectList) {
            rejectList[i](error.msg);
        }
        rejectList = [];
    });
};

export default {
    getConfig(options) {
        return new Promise((resolve, reject) => {
            if (mallConfig) {
                return resolve(mallConfig);
            }
            mallConfig = Vue.prototype.$storage.getStorageSync(cacheKey);
            if (mallConfig) {
                if (isFirstAppRun) {
                    isFirstAppRun = false;
                    getConfigFormServer();
                }
                return resolve(mallConfig);
            } else {
                getConfigFormServer(resolve, reject);
            }
        });
    },
    resetConfig() {
        mallConfig = null;
        Vue.prototype.$storage.removeStorageSync(cacheKey);
        isGettingFromService = false;
    }
};
