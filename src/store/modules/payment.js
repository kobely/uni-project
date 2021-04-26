const state = {
    id: null,
    showPayment: false,
    payData: null,
    payType: null,
    resolve: null,
    reject: null,
};

const getters = {
    id(state) {
        return state.id;
    },
    showPayment(state) {
        return state.showPayment;
    },
    payData(state) {
        return state.payData;
    },
    payType(state) {
        return state.payType;
    },
    resolve(state) {
        return state.resolve;
    },
    reject(state) {
        return state.reject;
    },
};

const mutations = {
    id(state, data) {
        state.id = data;
    },
    showPayment(state, data) {
        state.showPayment = data;
    },
    payData(state, data) {
        state.payData = data;
    },
    payType(state, data) {
        state.payType = data;
    },
    resolve(state, data) {
        state.resolve = data;
    },
    reject(state, data) {
        state.reject = data;
    },
    setAll(state, data) {
        for (let k in data) {
            state[k] = data[k];
        }
    },
};

const actions = {
    reset(context) {
        context.commit('id', null);
        context.commit('showPayment', false);
        context.commit('payData', null);
        context.commit('payType', null);
        context.commit('resolve', null);
        context.commit('reject', null);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
