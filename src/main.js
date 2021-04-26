import Vue from 'vue';
import App from './App.vue';
import store from './store/index.js';
import appVersion from 'appVersion';
import siteInfo from 'siteInfo';
import './uni.scss';
import request from './core/request.js';
import user from './core/user.js';
import Api from './core/appOnLaunch.js';
import {platform} from './core/config.js';
import mallConfig from './core/mallConfig.js';
import * as cache from './core/cache.js';
import appButton from './components/basic-component/app-button/app-button.vue';
import appFormId from './components/basic-component/app-form-id/app-form-id.vue';
import appLayout from './components/basic-component/app-layout/app-layout.vue';
import appInput from './components/basic-component/app-input/app-input.vue';
import appCartImage from './components/basic-component/app-cart-image/app-cart-image.vue';
import appJumpButton from './components/basic-component/app-jump-button/app-jump-button.vue';
import appLoadText from './components/basic-component/app-load-text/app-load-text.vue';
import * as utils from './core/utils.js';
import $const from './core/const.js';
import event from './core/event.js';
import showLoading from './core/showLoading.js';
import hideLoading from './core/hideLoading.js';
import platDiff from './core/platDiff.js';
import lazyLoadingData from './core/lazyLoadingData.js';
import jump from './core/jump.js';
import popupAd from './core/popupAd.js';
import appImage from './components/basic-component/app-image/app-image.vue';
import subscribe from './core/subscribe.js';
import appCssIcon from './components/basic-component/app-css-icon/app-css-icon.vue';
import validation from './core/test.js';
import appMemberPrice from './components/page-component/app-member-mark/app-member-price';
import appSupVip from './components/page-component/app-sup-vip/app-sup-vip.vue';
import * as commonLoad from './core/commonLoad.js';
// #ifdef MP-WEIXIN
import shareTimeline from './core/shareTimeline.js';
// #endif

import shareAppMessage from './core/shareAppMessage.js';

// #ifdef H5
import jwx from './core/jweixin.js';
import appDiyPage from "@/components/page-component/index/app-diy-page.vue";
import wxParseTemplate from "@/components/basic-component/app-rich/components/wxParseTemplate0.vue";
import { updateAppMessageShareData } from './core/shareAppMessage.js';
// #endif
import * as tips from './core/tips.js';
import goodsRemind from './core/goodsRemind.js';

import myMixin from './core/mixin.js';

Vue.component('app-button', appButton);
Vue.component('app-form-id', appFormId);
Vue.component('app-layout', appLayout);
Vue.component('app-input', appInput);
Vue.component('app-jump-button', appJumpButton);
Vue.component('app-load-text', appLoadText);
Vue.component('app-image', appImage);
Vue.component('app-cart-image', appCartImage);
Vue.component('app-css-icon', appCssIcon);
Vue.component('app-member-price', appMemberPrice);
Vue.component('app-sup-vip', appSupVip);
// #ifdef H5
Vue.component('app-diy-page', appDiyPage);
Vue.component('wx-parse-template', wxParseTemplate);
// #endif

Vue.use({
    install(Vue, options) {
        Vue.prototype.$appVersion = appVersion;  // 小程序端版本号
        Vue.prototype.$store = store;// 数据池
        Vue.prototype.$platform = platform; // 平台
        Vue.prototype.$api = Api; // 接口 路径
        Vue.prototype.$request = request; // 请求
        Vue.prototype.$storage = cache; // 缓存
        Vue.prototype.$user = user; // 用户组件
        Vue.prototype.$mallConfig = mallConfig; // 商城配置
        Vue.prototype.$utils = utils; // 工具函数
        Vue.prototype.$const = $const; // 常量
        Vue.prototype.$event = event; // 事件
        Vue.prototype.$showLoading = showLoading; // loading
        Vue.prototype.$hideLoading = hideLoading; // loading
        Vue.prototype.$platDiff = platDiff; // 平台差异性
        Vue.prototype.$lazyLoadingData = lazyLoadingData;
        Vue.prototype.$jump = jump;
        Vue.prototype.$popupAd = popupAd;
        Vue.prototype.$subscribe = subscribe;
        Vue.prototype.$appScene = 1001;
        Vue.prototype.$validation = validation;
        Vue.prototype.$tips = tips; // 交互反馈
        Vue.prototype.$commonLoad = commonLoad;
        Vue.prototype.$shareAppMessage = shareAppMessage;
        Vue.prototype.$goodsRemind = goodsRemind;

        // #ifdef MP-WEIXIN
        Vue.prototype.$shareTimeline = shareTimeline;
        // #endif
        // #ifdef H5
        Vue.prototype.$jwx = jwx;
        Vue.prototype.$updateAppMessageShareData = updateAppMessageShareData;
        // #endif
    },
});
Vue.use(myMixin);
Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue({
    store,
    ...App
});
app.$mount();
