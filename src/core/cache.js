import siteInfo from 'siteInfo';

const clearStorage = function() {
    uni.clearStorageSync();
};

const setStorageSync = function(key, data) {
    // #ifdef H5
    if(key != 'WEB_URL') {
        key += `_${siteInfo.id}` + `_${siteInfo.platform}`;
    }
    // #endif
    uni.setStorageSync(key, data);
};

const getStorageSync = function(key) {
    // #ifdef H5
    key += `_${siteInfo.id}` + `_${siteInfo.platform}`;
    // #endif
    return uni.getStorageSync(key);
};

const getStorage = function({key, success, fail}) {
    // #ifdef H5
    key += `_${siteInfo.id}` + `_${siteInfo.platform}`;
    // #endif
    uni.getStorage({
        key: key,
        success: function(res) {
            success && success(res);
        },
        fail: function () {
            fail && fail();
        }
    });
}

const setStorage = function({key, data, success, fail}) {
    // #ifdef H5
    key += `_${siteInfo.id}` + `_${siteInfo.platform}`;
    // #endif
    uni.setStorage({
        key: key,
        data: data,
        success: function(res) {
            success && success(res);
        },
        fail: function () {
            fail && fail();
        }
    });
}

const removeStorageSync = function(key) {
    // #ifdef H5
    key += `_${siteInfo.id}` + `_${siteInfo.platform}`;
    // #endif
    uni.removeStorageSync(key);
};

const removeStorage = function({key, success, fail}) {
    // #ifdef H5
    key += `_${siteInfo.id}` + `_${siteInfo.platform}`;
    // #endif
    uni.removeStorage({
        key: key,
        success: function(res) {
            success && success(res);
        },
        fail: function () {
            fail && fail();
        }
    })
}
export { clearStorage, setStorageSync, getStorageSync, removeStorageSync, getStorage, setStorage, removeStorage }
