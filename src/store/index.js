import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import mallConfig from './modules/mallConfig.js';
import user from './modules/user.js';
import gConfig from './modules/globalConfiguration.js';
import index from './modules/index.js';
import orderSubmit from './modules/orderSubmit.js';
import pagination from './modules/pagination.js';
import loading from './modules/loading.js';
import payment from './modules/payment.js';
import scanCode from './modules/scanCode.js';
import page from './modules/page.js';
import userCenter from './modules/userCenter.js';
import iPhoneX from './modules/iphoneX.js';
import gift from './modules/gift.js';
import cart from './modules/cart.js';
import share from './modules/share.js';

const store = new Vuex.Store({
    modules: {
        mallConfig,
        user,
        gConfig,
        index,
        orderSubmit,
        pagination,
        loading,
        payment,
        scanCode,
        page,
        userCenter,
        iPhoneX,
        gift,
        cart,
        share
    }
});

export default store;
