const state = {
    emptyHeight: 0,
    botNavHei: 110,
    XBoolean: false
};

const getters = {
    getBoolEmpty(state) {
        return {
            emptyHeight: state.emptyHeight,
            XBoolean: state.XBoolean,
        }
    },
    getNavHei(state) {
        return state.botNavHei;
    },
    getBotHeight(state) {
        return state.emptyHeight + state.botNavHei;
    },
    getAll(state) {
        return state;
    },
    getEmpty(state) {
        return state.emptyHeight;
    }
};

const mutations = {
    setXBoolean(state, data) {
        state.XBoolean = data;
    },
    setEmptyHeight(state, data) {
        state.emptyHeight = data;
    },
};

const actions = {
    setIphone(content, data) {
        // #ifdef MP-ALIPAY
        if (data.model.indexOf('iPhone11') > -1 || data.model.indexOf('iPhone12') > -1|| data.model.indexOf('iPhone 11') > -1) {
            content.commit('setXBoolean', true);
            content.commit('setEmptyHeight', 50);
        }
        // #endif

        // #ifdef MP-WEIXIN
        if (data.model.indexOf('iPhone X') > -1 ||  data.model.indexOf('iPhone12') > -1|| data.model.indexOf('iPhone 11') > -1) {
            content.commit('setXBoolean', true);
            content.commit('setEmptyHeight', 50);
        }
        // #endif

        // #ifdef MP-TOUTIAO
        if (data.model.indexOf('iPhone X') > -1 || data.model.indexOf('Unknown Device') > -1|| data.model.indexOf('iPhone 11') > -1) {
            content.commit('setXBoolean', true);
            content.commit('setEmptyHeight', 50);
        }
        // #endif

        // #ifdef MP-BAIDU
        if (data.model.indexOf('iPhone X') > -1 || data.model.indexOf('iPhone12') > -1|| data.model.indexOf('iPhone 11') > -1) {
            content.commit('setXBoolean', true);
            content.commit('setEmptyHeight', 50);
        }
        // #endif
    }
};

export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}
