import Vue from 'vue';
import siteInfo from 'siteInfo';

export default {
    isWechat: function() {
		if (`${siteInfo.platform}` === 'mobile') {
			return 0;
		} else {
			return 1;
		}
    },
    init:function(callback){
        let url = window.location.href.split('#')[0];
        Vue.prototype.$request({
            url: Vue.prototype.$api.registered.weChat,
            data: {
                url: url,
                refresh: true
            }
        }).then((e) => {
            let apiList = [
                'updateAppMessageShareData',
                'updateTimelineShareData',
                'chooseImage',
                'uploadImage',
                'downloadImage',
                'previewImage',
                'openLocation',
                'getLocation',
                'scanQRCode',
                'showMenuItems',
                'hideMenuItems',
                'chooseWXPay',
                'hideOptionMenu',
                'showOptionMenu',
                'checkJsApi',
                'startRecord',
                'stopRecord',
                'playVoice',
                'stopVoice',
                'getLocalImgData',
                'hideAllNonBaseMenuItem'
            ];
            let config = {
                debug: false,
                appId: e.data.appid,
                timestamp: e.data.timestamp,
                nonceStr: e.data.noncestr,
                signature: e.data.signature,
                jsApiList: apiList,
                openTagList: [
                    'wx-open-launch-weapp'
                ]
            };
            jWeixin.config(config);
            jWeixin.error(err => {
                console.log('config fail:', err);
            });
            jWeixin.ready(() => {
                if (callback) callback(jWeixin);
            });
        })
    },
    getLocation: function({type = 'wgs84', success, fail}) {
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.getLocation({
                    type: type,
                    success: function (res) {
                        success(res);
                    },
                    fail:function(res){
                        fail(res);
                    }
                });
            });
        } else {
            uni.getSystemInfo({
                success(res) {
                    uni.getLocation({
                        success: function (res) {
                            success(res);
                        },
                        fail: function (res) {
                            fail(res);
                        },
                    });
                }
            })
            // uni.getSystemInfo({
            //     success(res) {
            //         //Android OK iphone Fail
            //         if (0 && res.brand === 'iPhone') {
            //             //默认值
            //             //self.longitude = res.longitude;
            //             //self.latitude = res.latitude;
            //         } else {
            //             uni.getLocation({
            //                 success: function (res) {
            //                     success(res);
            //                 },
            //                 fail: function () {
            //                     fail(res);
            //                 },
            //             });
            //         }
            //     }
            // });
        }
    },
    updateAppMessageShareData: function({data = {}, success, cancel}) {
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.updateAppMessageShareData({
                    title: data.title,
                    desc: data.desc,
                    link: data.link,
                    imgUrl: data.imgUrl,
                    success: function (e) {
                        // uni.showToast({
                        //     icon: 'none',
                        //     title: '触发分享'
                        // })
                        success(e);
                    },
                    cancel: function (e) {
                        cancel(e);
                    }
                });
                jssDk.updateTimelineShareData({
                    title: data.title,
                    link: data.link,
                    imgUrl: data.imgUrl
                });
            });
        } else {
            cancel({
                msg: 'h5'
            });
        }
    },
    showMenuItems: function({menuList = ['menuItem:share:appMessage', 'menuItem:share:timeline'], success, fail}) {
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.showMenuItems({
                    menuList: menuList,
                    success: function (e) {
                        success(e);
                    },
                    fail: function (e) {
                        fail(e);
                    }
                });
            });
        }
    },
    chooseImage: function({count = 1, sizeType = ['original', 'compressed'], sourceType = ['album', 'camera'], success, cancel}){//选择图片
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.chooseImage({
                    count: count,
                    sizeType: sizeType,
                    sourceType: sourceType,
                    success:function(res){
                        let images = res.localIds;
                        let length = images.length;
                        let i = 0;
                        function getLocal() {
                            jssDk.getLocalImgData({
                                localId: images[i],
                                success: function (response) {
                                    success(response);
                                    i++;
                                    if (length >= i ) {
                                        getLocal();
                                    }
                                },
                                fail:function(error){
                                    // return uni.showModal({
                                    //     content: error.msg
                                    // });
                                }
                            });

                        }
                        getLocal();
                    },
                    cancel: function(res) {
                        cancel(res);
                    }
                });
            });
        }
    },
    downloadImage: function({serverId = '', isShowProgressTips = 1, success, fail}) {
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.downloadImage({
                    serverId: serverId,
                    isShowProgressTips: isShowProgressTips,
                    success: function (res) {
                        success(res);
                    },
                    fail:function(res){
                        fail(res);
                    }
                });
            });
        }
    },
    getLocalImgData: function({localId = '', success, fail}) {
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.getLocalImgData({
                    localId: localId,
                    success: function (res) {
                        success(res);
                    },
                    fail:function(res){
                        fail(res);
                    }
                });
            });
        }
    },
    openLocation: function({latitude = 0, longitude = 0, name = '', address = '', scale = 1, infoUrl = '',success, fail}){
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.openLocation({
                    latitude: latitude,
                    longitude: longitude,
                    name: name,
                    address: address,
                    scale: scale,
                    infoUrl: infoUrl,
                    success: function (res) {
                        success(res);
                    },
                    fail:function(res){
                        fail(res);
                    }
                });
            });
        }
    },
    scanQRCode: function({needResult = 1, scanType = ["qrCode","barCode"], success,}) {
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.scanQRCode({
                    needResult: needResult,
                    scanType: scanType,
                    success: function(res) {
                        success(res);
                    },
                    fail: function(res) {
                        fail(res)
                    }
                });
            });
        }
    },
    chooseWXPay: function({timestamp = 0, nonceStr = '', packAge = '', signType = '', paySign = '', webUrl = '', success, fail}) {
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.chooseWXPay({
                    timestamp: timestamp,
                    nonceStr: nonceStr,
                    package: packAge,
                    signType: signType,
                    paySign: paySign,
                    success: function(res) {
                        success(res);
                    },
                    fail: function(res) {
                        fail(res);
                    }
                });
            });
        } else {

            window.location.href = webUrl;
        }
    },
    startRecord: function() {
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.startRecord();
            });
        }
    },
    stopRecord: function({success}) {
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.stopRecord({
                    success: function (res) {
                        success(res);
                    }
                });
            });
        }
    },
    playVoice: function({localId}) {
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.playVoice({
                    localId: localId
                });
            });
        }
    },
    stopVoice: function({localId}) {
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.stopVoice({
                    localId: localId
                });
            });
        }
    },
    hideAllNonBaseMenuItem: function () {
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.hideAllNonBaseMenuItem();
            });
        }
    },
    hideMenuItems: function({menuList = []}) {
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.hideMenuItems({
                    menuList: menuList
                });
            });
        }
    },
    previewImage: function({current = '', urls = []}) {
        if (this.isWechat()) {
            this.init(function(jssDk) {
                jssDk.previewImage({
                    current: current, // 当前显示图片的http链接
                    urls: urls
                });
            });
        } else {
            uni.previewImage({
                current: 0,
                urls: [current]
            });
        }
    },
    config: function() {
        if (this.isWechat()) {
            this.init();
        }
    }
}
