const state = {
    reportAndError: {
        boolean: false,
        content: '网络开了会儿小差， 请刷新重试下哦~',
    },
    is_edit: false
};

const getters = {
    reportAndErrorObj(state) {
        return state.reportAndError;
    },
    is_edit(state) {
        return state.is_edit;
    },
};

const mutations = {
    reportAndErrorObj(state, data) {
        state.reportAndError = data;
    },
    is_edit(state, data) {
        state.is_edit = data;
    },
};

const actions = {
    reportAndErrorObj(content, data) {
        content.commit('reportAndErrorObj', data);
    },
    is_edit(content, data) {
        content.commit('is_edit', data);
    }
};

export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions,
}
