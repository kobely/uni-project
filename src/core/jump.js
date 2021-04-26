/* #ifndef MP-TOUTIAO */
import { push } from './formId.js';
/* #endif */
import { clearStorage } from './cache.js';

const jump = function(data) {
    /* #ifndef MP-TOUTIAO */
    if (data.form) push(data.e.detail.formId);
    /* #endif */
    switch (data.open_type) {
        case 'redirect':
            uni.redirectTo({
                url: data.url
            });
            break;
        case 'navigate':
            uni.navigateTo({
                url: data.url
            });
            break;
        case 'app_admin':
            if (data.$store.state.user.info.identity.is_admin == 1) {
                uni.navigateTo({
                    url: data.url,
                });
            }
            break;
        case 'tel':
            if (data.params) {
                uni.makePhoneCall({
                    phoneNumber: data.params[0].value
                });
            } else if (data.number) {
                uni.makePhoneCall({
                    phoneNumber: data.number
                });
            }
            break;
        case 'web':
            uni.navigateTo({
                url: data.url
            });
            break;
        //  #ifndef MP-TOUTIAO
        case 'app':
            if (data.url) {
                let originalPath = data.url.split('?')[1];
                uni.navigateToMiniProgram({
                    appId: originalPath.slice(0, 25).split('=')[1],
                    path: originalPath.slice(originalPath.indexOf('&') + 1, originalPath.length).split('=')[1]
                });
            } else if(data.appId) {
                uni.navigateToMiniProgram({
                    appId: data.appId
                });
            }
            break;
        // #endif
        case 'clear_cache':
            clearStorage();
            break;
        case 'map':
            uni.openLocation({
                latitude: Number(data.latitude),
                longitude: Number(data.longitude),
                name: data.address
            });
            break;
        case 'reload':
            // #ifdef MP-ALIPAY
            this.$platDiff.reload();
            // #endif
            // #ifndef MP-ALIPAY
            uni.redirectTo({
                url: this.$platDiff.routeWithOption()
            });
            // #endif
            break;
    }
};

export default jump;
