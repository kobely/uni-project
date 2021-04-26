import Vue from 'vue';

const state = {
    data: {

    }
};

const getters = {
    data(state) {
        return state.data;
    },
    userCenter(state) {
        return state.data;
    }
};

const mutations = {
    data(state, data) {
        state.data = data;
    },
};

const actions = {
    data(context) {
        Vue.prototype.$request({
            url: Vue.prototype.$api.user.config,
        }).then(res => {
            let { data, code } = res;
            if (code === 0) {
                let config = data.config;
                if (data && config && config.user_center) {
                    context.commit('data', config.user_center);
                }
            }
        });
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
