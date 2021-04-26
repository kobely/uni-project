const state = {
    status: false,
};

const getters = {
    getStatus(state) {
        return state.status;
    },
};

const mutations = {
    status(state, data) {
        state.status = data;
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