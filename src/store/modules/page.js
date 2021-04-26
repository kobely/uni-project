const state = {
    scrollTop: 0,
    isScanQrCode: false,
    coupon: {
        list: [],
        type: ''
    },
    query: null
};

const getters = {
    getScrollTop(state) {
        return state.scrollTop;
    },
    getIsScanQrCode(state) {
        return state.isScanQrCode
    },
    getCoupon(state) {
        return state.coupon;
    },
    getQuery(state) {
        return state.query;
    },
};

const mutations = {
    mutSetScrollTop(state, data) {
        state.scrollTop = data;
    },
    mutSetIsScanQrCode(state, data) {
        state.isScanQrCode = data
    },
    mutSetCoupon(state, data) {
        state.coupon = data;
    },
    mutSetQuery(state, data) {
        state.query = data;
    },
};

const actions = {
    actionSetScrollTop(context, data) {
        context.commit('mutSetScrollTop', data);
    },
    actionSetIsScanQrCode(context, data) {
        context.commit('mutSetIsScanQrCode', data);
    },
    actionSetCoupon(context, data) {
        context.commit('mutSetCoupon', data);
    },
    actionSetQeury(context, data) {
        context.commit('mutSetQuery', data);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}