const time = function () {
    return parseInt(Math.round(new Date() / 1000));
};

/***
 * 时间戳转换时间字符串
 * @param format eg: Y-m-d h:i:s
 * @param timestamp
 * @returns {*}
 */
const datetime = function (format, timestamp) {
    if (typeof format === 'undefined' || format === null) {
        format = 'Y-m-d h:i:s';
    }
    if (typeof timestamp === 'undefined' || timestamp === null) {
        timestamp = this.time();
    }
    const d = new Date();
    d.setTime(timestamp * 1000);
    // from https://www.cnblogs.com/yjf512/p/3796229.html
    const date = {
        "Y": d.getFullYear(),
        "m+": (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : (d.getMonth() + 1),
        "d+": d.getDate() < 10 ? `0${d.getDate()}` : d.getDate(),
        "h+": d.getHours() < 10 ? `0${d.getHours()}` : d.getHours(),
        "i+": d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes(),
        "s+": d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds(),
        "q+": Math.floor((d.getMonth() + 3) / 3),
        "S+": d.getMilliseconds(),
    };
    for (let k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ?
                date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

const strtotime = function (str) {
};

const objectToUrlParams = function (obj, urlencode) {
    let str = "";
    for (let key in obj) {
        str += "&" + key + "=" + (urlencode ? encodeURIComponent(obj[key]) : obj[key]);
    }
    return str.substr(1);
};

const timeDifference = function (start_at, end_at) {
    let times = parseInt((end_at - start_at) / 1000);
    let day = 0,
        hour = 0,
        minute = 0,
        second = 0;

    if (times > 0) {
        day = Math.floor(times / (60 * 60 * 24));
        hour = Math.floor(times / (60 * 60)) - (day * 24);
        minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    } else {
        return null;
    }

    return {
        d: day,
        h: hour < 10 ? ('0' + hour) : hour,
        m: minute < 10 ? ('0' + minute) : minute,
        s: second < 10 ? ('0' + second) : second,
    };
};

/**
 * 使用经纬度计算地球表面距离
 */
const earthDistance = function (location1, location2) {
    const lat1 = parseFloat(location1.lat);
    const lng1 = parseFloat(location1.lng);
    const lat2 = parseFloat(location2.lat);
    const lng2 = parseFloat(location2.lng);

    const EARTH_RADIUS = 6378137.0; //单位M
    const PI = Math.PI;

    function getRad(d)
    {
        return d * PI / 180.0;
    }

    let f = getRad((lat1 + lat2) / 2);
    let g = getRad((lat1 - lat2) / 2);
    let l = getRad((lng1 - lng2) / 2);

    let sg = Math.sin(g);
    let sl = Math.sin(l);
    let sf = Math.sin(f);

    let s, c, w, r, d, h1, h2;
    let a = EARTH_RADIUS;
    let fl = 1 / 298.257;

    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;

    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;

    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;

    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
};

const objectValues = function (obj) {
    let arr = [];
    for (let i in obj) {
        arr.push(obj[i]);
    }
    return arr;
};

const randomString = function (length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};

const urlParamsToObject = function (str) {
    let groups = str.split('&');
    let obj = {};
    for (let i in groups) {
        if (typeof groups[i] !== 'string') continue;
        if (!groups[i].length) continue;
        let kvs = groups[i].split('=');
        if (kvs.length !== 2) continue;
        obj[kvs[0]] = kvs[1];
    }
    return obj;
};

const showLoading = function () {
    uni.showLoading({
        title: '加载中',
        // #ifdef MP-WEIXIN || MP-BAIDU
        mask: true,
        // #endif
    })
};
const hideLoading = function () {
    uni.hideLoading();
};


const h5Address = function ({success, fail}) {
    // #ifdef H5
    async function geolocation() {
        let options = {
            enableHighAccuracy: true, //高精度 速度慢
            timeout: 5000,   //5s
            maximumAge: 10000,   //返回多长时间（即最长年龄，单位毫秒）内的可获取的缓存位置
        };

        function gsuccess(pos) {
            let crd = pos.coords;
            success({
                latitude: crd.latitude,
                longitude: crd.longitude,
            });
        }

        function gerror(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
            fail({
                code: err.code,
                errMsg: err.message,
            })
        }

        await navigator.geolocation.getCurrentPosition(gsuccess, gerror, options);
    }

    geolocation();
    // #endif
}

//保存
let batchStatus = false;

/**
 *
 * too long
 * @param url
 * @param desc ['image', 'video']
 * @returns {Promise<unknown>}
 */
// #ifdef H5
const isWechat = function () {
    let mic = window.navigator.userAgent.toLowerCase().match(/micromessenger/i);
    return mic && mic[0] === 'micromessenger';
};
// #endif
const batchSave = function (url, desc = 'image') {
    return new Promise((resolve_a, reject_a) => {
        if (!(url instanceof Array)) {
            url = [url];
        }
        const title = desc === "image" ? '图片' : '视频';

        // #ifdef H5
        if (isWechat()) {
            uni.previewImage({
                urls: url,
                current: 0
            });
            return
        }
        // #endif

        new Promise((resolve_b, reject_b) => {
            // #ifdef MP-ALIPAY || H5
            resolve_b('success');
            // #endif

            // #ifndef MP-ALIPAY
            let scope = null;
            // #ifdef MP-WEIXIN || MP-BAIDU
            scope = 'scope.writePhotosAlbum';
            // #endif
            // #ifdef MP-TOUTIAO
            scope = 'scope.album';
            // #endif
            uni.authorize({
                scope: scope,
                success(res) {
                    resolve_b('success');
                },
                fail(e) {
                    uni.showModal({
                        title: '提示',
                        content: '您好,请先授权保存到相册权限',
                        showCancel: false,
                        success(res) {
                            if (res.confirm) {
                                uni.openSetting({
                                    success(settingdata) {
                                        if (settingdata.authSetting[scope]) {
                                            resolve_b('success');
                                        } else {
                                            reject_b('fail');
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            });
            // #endif
        }).then(function (result) {
            if (batchStatus) {
                uni.showLoading({title: title + `保存中`, mask: true});
                return;
            }
            batchStatus = true;
            uni.showLoading({title: title + `保存中`, mask: true});
        }).then(e => {
            // #ifdef MP-ALIPAY
            let sentinel = 0;
            let func = function (url, sentinel) {
                my.saveImage({
                    url: url[sentinel],
                    showActionSheet: false,
                    success: (res) => {
                        if (sentinel < url.length - 1) {
                            sentinel++;
                            func(url, sentinel);
                        } else {
                            batchStatus = false;
                            uni.hideLoading();
                            resolve_a('success');
                        }
                    },
                    fail(info) {
                        batchStatus = false;
                        uni.hideLoading();
                        /* 提示暂放 */
                        uni.showToast({title: '下载失败'});
                        reject_a('fail');
                    }
                });
            }
            url[sentinel] === undefined || func(url, sentinel);
            // #endif

            // #ifndef MP-ALIPAY
            Promise.all(url.map(item => {
                return new Promise((resolve_c, reject_c) => {
                    try {
                        // #ifdef H5
                        const body = document.getElementsByTagName('body')[0];
                        const aEle = document.createElement('a');
                        if(desc === "image") {
                            aEle.setAttribute('download', Math.random().toString(36).substr(2) + '.jpg');
                        } else {
                            aEle.setAttribute('download', Math.random().toString(36).substr(2) + '.mp4');
                        }
                        aEle.style.display = 'none';
                        aEle.href =  item;
                        aEle.target = '_blank';

                        body.appendChild(aEle);
                        aEle.dispatchEvent(new MouseEvent('click'));  // 模拟鼠标click点击事件
                        document.body.removeChild(aEle);
                        resolve_c('success')
                        // #endif

                        // #ifndef MP-ALIPAY || H5
                        let downloadTask = uni.downloadFile({
                            url: item,
                            success: function (e) {
                                if (desc === 'image') {
                                    uni.saveImageToPhotosAlbum({
                                        filePath: e.tempFilePath,
                                        success: function () {
                                            resolve_c('success')
                                        },
                                        fail: function (err) {
                                            reject_c('fail');
                                        }
                                    });
                                }
                                if (desc === 'video') {
                                    uni.saveVideoToPhotosAlbum({
                                        filePath: e.tempFilePath,
                                        success: function () {
                                            resolve_c('success')
                                        },
                                        fail: function (err) {
                                            reject_c('fail');
                                        }
                                    });
                                }
                            },
                            fail: function (err) {
                                reject_c('fail');
                            }
                        });
                        // #endif

                        // #ifdef MP-WEIXIN
                        if (desc === 'video') {
                            const ago = new Date().getTime();
                            const limit = 1000 * 60;  //max 1minute
                            downloadTask.onProgressUpdate((res) => {
                                let currency = new Date().getTime();
                                if (currency - ago > limit) {
                                    downloadTask.abort();
                                    reject_c('fail');
                                }
                            });
                        }
                        // #endif
                    } catch (e) {
                        reject_c('fail');
                    }
                })
            })).then(() => {
                batchStatus = false;
                uni.hideLoading();
                resolve_a('success');
            }).catch(() => {
                batchStatus = false;
                uni.hideLoading();
                /* 提示暂放 */
                uni.showToast({title: '下载失败'});
                reject_a('fail');
            })
            // #endif
        }).catch(() => {
            uni.showModal({title: '提示', content: '授权失败，请稍后重新获取', showCancel: false});
            reject_a('fail');
        })
    })
}


/**
 * 删除url中指定参数，并返回删除后的url
 * @param {string} url url或完整带参数的路由
 * @param {string|array} param 需要删除的参数，多个可使用数字如['key1', 'key2']
 * @param {boolean} allParams 是否删除所有参数，默认false
 * @returns {string|*}
 */
const deleteUrlParam = function (url, param, allParams) {
    if (isNaN(url.indexOf('?')) || url.indexOf('?') < 0) {
        return url;
    }
    let query = url.substr(url.indexOf('?') + 1);
    let route = url.substr(0, url.indexOf('?'));
    if (allParams) {
        return route;
    }
    let params = [];
    if (typeof param === 'object') {
        params = param;
    } else {
        params = [param];
    }
    let queryObj = {};
    let queryList = query.split('&');
    for (let i in queryList) {
        queryList[i] = queryList[i].split('=');
        queryObj[queryList[i][0]] = queryList[i][1];
    }
    for (let i in params) {
        delete queryObj[params[i]];
    }
    query = JSON.stringify(queryObj).replace(/[\"\{\}]/g, '').replace(/\:/g, '=').replace(/\,/g, '&');
    if (!query.length) {
        return route;
    }
    return route + '?' + query;
};

const colorRgba = function (sHex, alpha = 1) {
    // 十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    /* 16进制颜色转为RGB格式 */
    let sColor = sHex.toLowerCase()
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            let sColorNew = '#'
            for (let i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
            }
            sColor = sColorNew
        }
        //  处理六位的颜色值
        let sColorChange = []
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
        }
        // return sColorChange.join(',')
        // 或
        return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
    } else {
        return sColor
    }
};

let timer, flag;

/**
 * 节流原理：在一定时间内，只能触发一次
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
const throttle = function (func, wait = 500, immediate = true) {
    if (immediate) {
        if (!flag) {
            flag = true;
            typeof func === 'function' && func();
            timer = setTimeout(() => {
                flag = false;
            }, wait);
        }
    } else {
        if (!flag) {
            flag = true
            timer = setTimeout(() => {
                flag = false
                typeof func === 'function' && func();
            }, wait);
        }

    }
}

let timeout = null;

/**
 * 防抖原理：一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
const debounce =function (func, wait = 500, immediate = false) {
    if (timeout !== null) clearTimeout(timeout);
    if (immediate) {
        let callNow = !timeout;
        timeout = setTimeout(function() {
            timeout = null;
        }, wait);
        if (callNow) typeof func === 'function' && func();
    } else {
        timeout = setTimeout(function() {
            typeof func === 'function' && func();
        }, wait);
    }
}
const deepClone = function(obj) {
    function isArray (arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    }
    if([null, undefined, NaN, false].includes(obj)) return obj;
    if(typeof obj !== "object" && typeof obj !== 'function') {
        return obj;
    }
    let o = isArray(obj) ? [] : {};
    for(let i in obj) {
        if(obj.hasOwnProperty(i)){
            o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
        }
    }
    return o;
}
const uniCopy = function ({data, success, error}) {
    // #ifndef H5
    uni.setClipboardData({
        data: data,
        success() {
            success && success()
        }
    });
    // #endif
    // #ifdef H5
    if (!document.queryCommandSupported('copy')) { //为了兼容有些浏览器 queryCommandSupported 的判断
        // 不支持
    }
    let textarea = document.createElement("textarea");
    textarea.value = data;
    textarea.readOnly = "readOnly";
    document.body.appendChild(textarea);
    textarea.select(); // 选择对象
    textarea.setSelectionRange(0, data.length) //核心
    let result = document.execCommand("copy") // 执行浏览器复制命令
    if (result) {
        success && success()
    } else {
    }
    textarea.remove();
    // #endif
}
const getUrlParam = function(name) {
    // #ifdef H5
    let url = window.location.href.split('#')[0];
    let search = url.split('?')[1];
    if (search) {
        let r = search.substr(0).match(new RegExp('(^|&)' + name + '=([^&]*)(&|$)'))
        if (r !== null) return unescape(r[2])
        return null
    } else {
        return null
    }
    // #endif
}
// #ifdef H5
const createWxOpenLaunchWeapp = function (id, username, path, text) {
    let script = document.createElement('script');
    script.type = 'text/wxtag-template';
    script.text = text;
    let html = `<wx-open-launch-weapp style="width:100%;display:block;height:100%;" username="${username}" path="${path}">${script.outerHTML}
                                        </wx-open-launch-weapp>`;
    setTimeout(() => {
        document.getElementById(id).innerHTML = html;
    }, 500);
}

function guid(str) {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return str + "-" + (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

const getUrlParamApp = function(url,name) {
    let search = url.split('?')[1];
    if (search) {
        let r = search.substr(0).match(new RegExp('(^|&)' + name + '=([^&]*)(&|$)'))
        console.log(r);
        if (r !== null) {
            console.log(unescape(r[2]));
            return unescape(r[2])
        }
        return null
    } else {
        return null
    }
}
// #endif
export {
    time,
    datetime,
    strtotime,
    objectToUrlParams,
    timeDifference,
    earthDistance,
    objectValues,
    randomString,
    urlParamsToObject,
    showLoading,
    hideLoading,
    batchSave,
    deleteUrlParam,
    colorRgba,
    throttle,
    debounce,
    deepClone,
    uniCopy,
    getUrlParam,
    h5Address,
    // #ifdef H5
    createWxOpenLaunchWeapp,
    guid,
    getUrlParamApp
    // #endif
}
