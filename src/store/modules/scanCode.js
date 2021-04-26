const state = {
    userCoupon: null
};

const mutations = {
    mutSetUserCoupon(state, data) {
        state.userCoupon = data;
    },
};

const actions = {
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
