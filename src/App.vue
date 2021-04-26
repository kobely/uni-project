<script>
    export default {
        globalData() {
            return {
                stystem: {},
                text: ''
            }
        },
        onLaunch: function (options) {
            console.log('app onLaunch--->'); // 公众号文章进小程序无底部导航调试，请勿删除
            console.log(options);            // 公众号文章进小程序无底部导航调试，请勿删除
            console.log('<---app onLaunch'); // 公众号文章进小程序无底部导航调试，请勿删除
            // #ifdef H5
            if (!this.$jwx.isWechat()) {
               uni.getLocation({
                   success() {
                   },
                   fail() {
                   }
               });
            }
            // #endif
            if (options && options.scene) {
                this.$appScene = options.scene;
            }
            this.$store.dispatch('mallConfig/actionGetConfig');
            let _this = this;
            wx.getSystemInfo({
                success: function (response) {
                    _this.$store.dispatch('gConfig/setSystemInfo', response);
                    _this.$store.dispatch('iPhoneX/setIphone', response);
                }
            });
            // #ifdef MP-WEIXIN
            if (options.scene == '1011' || options.scene == '1012' || options.scene == '1013'
                || options.scene == '1047' || options.scene == '1048' || options.scene == '1049') {
                this.$store.dispatch('page/actionSetIsScanQrCode', true);
            }
            // #endif
            // #ifdef MP-ALIPAY
            if (typeof options.query != 'undefined') {
                this.$store.dispatch('page/actionSetQeury', options.query)
            }
            // #endif
            if (options.query && typeof options.query.user_id !== 'undefined') {
                this.$store.dispatch('user/setTempParentId', options.query.user_id)
            }
            // #ifdef H5
            this.$storage.setStorageSync('platform', 'wechat');
            if (this.$jwx.isWechat()) {
                if (!this.$storage.getStorageSync('_USER_SIGN')) {
                    this.$storage.setStorageSync('isSign', false);
                    this.$storage.removeStorageSync('_USER_ACCESS_TOKEN');
                    this.$user.silentLogin();
                } else {
                    this.$storage.setStorageSync('_USER_SIGN', false);
                    let params = this.$utils.getUrlParam('code');
                    if (params) {
                        this.$request({
                            url: this.$api.registered.login,
                            data: {
                                code: params,
                                type: 'wechat'
                            },
                            method: 'post'
                        }).then(response => {
                            if (response.code === 0) {
                                this.$storage.setStorageSync('_USER_ACCESS_TOKEN', response.data.access_token);
                            }
                            let url = window.location.href;
                            let res = url.replace(url.slice(url.indexOf('?'), url.indexOf('#')), '');
                            let index = res.indexOf('#');
                            let newRes = res.slice(0, index) + '?' + res.slice(index);
                            this.$storage.setStorageSync('_USER_SIGN', true);
                            window.location.replace(newRes);
                            this.$storage.setStorageSync('isSign', true);
                        });
                    }
                    return true;
                }
            } else {
                this.$storage.setStorageSync('isSign', true);
                if (window.location.href.indexOf('?#') === -1) {
                    let { hash, origin, pathname } = window.location;
                    this.$storage.setStorageSync('_USER_SIGN', true);
                    window.location.replace(`${origin}${pathname}?${hash}`);
                    return true;
                }
            }
            if (this.$jwx.isWechat()) {
                let hash= window.location.hash;
                if (hash.indexOf('isWechat=true') > -1 && hash.indexOf('isPay=ture') > -1 && hash.indexOf('payType=alipay_h5') > -1) {
                    uni.reLaunch({
                        url: '/pages/registered/placard'
                    });
                }
                this.$storage.setStorageSync('isSign', true);
            }
            // #endif

            // #ifdef MP-WEIXIN
            this.$user.silentLogin();
            // #endif
        },
        onShow(options) {
            console.log('app onShow--->'); // 公众号文章进小程序无底部导航调试，请勿删除
            console.log(options);          // 公众号文章进小程序无底部导航调试，请勿删除
            console.log('<---app onShow'); // 公众号文章进小程序无底部导航调试，请勿删除
            if (options && options.scene) {
                this.$appScene = options.scene;
            }
        }
    };
</script>

<style lang="scss">
    /*每个页面公共css */
    @import "./static/css/flex.scss";
    @import "./static/css/text.scss";
    @import "./static/css/image.scss";
    @import "./static/css/parse.scss";
    @import "./static/css/gift.scss";
    @import "./static/css/u-index.scss";
    @import "./static/css/border-box.scss";
    @import './static/css/iconfont.css';
    .u-goods-detail {
        background-image: url("./static/image/goods.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        min-height: 100vh;
    }
    .u-border-box {
        box-sizing: border-box;
    }
    /* #ifdef H5 */
    body.pages-index-index uni-page-body { background: transparent!important;}
    /* #endif */
    /* #ifdef H5 */
    //uni-page-head { display: none}
    /* #endif */
</style>
