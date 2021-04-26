import Vue from "vue";

const state = {
    type: 'global',
    text: '加载中',
    color: '#ffffff',
    backgroundImage: '',
    isShow: false
};

const getters = {
    getType(state) {
        return state.type;
    },
    getText(state) {
        return state.text;
    },
    getColor(state) {
        return state.color;
    },
    getBackgroundImage: async function(state) {
        return state.backgroundImage;
    },
    getIsShow(state) {
        return state.isShow;
    }
};

const mutations = {
    mutSetLoading(state, data) {
        for (let key in data) {
            state[key] = data[key];
        }
        if (!state.backgroundImage) {
            Vue.prototype.$mallConfig.getConfig().then(config => {
                state.backgroundImage = config.__wxapp_img.mall.loading;
            });
        }
    },
};

const actions = {
    actionGetLoading(context, data) {
        context.commit('mutSetLoading', data);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}