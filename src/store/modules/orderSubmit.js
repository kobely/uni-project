const state = {
    formData: null,
    mchNoCouponStatusList: []
};

const getters = {
    getMchNoCouponStatusList(state) {
        return state.mchNoCouponStatusList;
    },
};

const mutations = {
    mutSetFormData(state, data) {
        state.formData = data;
    },
    mutSetMchNoCouponStatusList(state, data) {
        state.mchNoCouponStatusList = data;
    },
};

const actions = {};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
