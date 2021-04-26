import Vue from 'vue';

const state = {
    auth_page: {
        pic_url: ''
    },
    bar_title: {},
    cat_style: {},
    copyright: {},
    mall: {
        setting: {
            theme_color: 'classic-red'
        }
    },
    navbar: {
        navs: []
    },
    plugin: {
        vip_card: {
            setting: {
                background: '#f7f7f7'
            }
        }
    },
    share_setting: [],
    share_setting_custom: {},
    user_center: {},
    __wxapp_img: {},
    theme_color: {
        key: 'a',
        color: '#ff4544',
        background: '#ff4544',
        border: '#ff4544',
        border_s: '#f39800',
        background_s: '#f39800',
        main_text: '#ffffff',
        secondary_text: '#ffffff',
        border_m: 'border-color: #ff4544;border-bottom-color: transparent;border-left-color: transparent;border-right-color: transparent;',
        background_o: "rgba(255,69,68, 0.1)",
        background_p: "rgba(255,69,68, 0.2)",
        background_l: "rgba(255,69,68, 0.35)",
        background_q: "rgba(255,69,68, 0.8)",
        background_gradient: "linear-gradient(140deg, #ff4544, #f39800)",
        background_gradient_l: "linear-gradient(to right, rgba(255,69,68, 1), rgba(255,69,68, 0.5))",
        background_gradient_o: "linear-gradient(to right, rgba(255,69,68, 1), rgba(255,69,68, 0.7))",
        background_s_gradient_o: "linear-gradient(to right, rgb(243,152,0),rgba(243,152,0, 0.7))",
        background_gradient_btn: "linear-gradient(to left, rgb(255,69,68),rgba(255,69,68, 0.7))",
        background_s_gradient_btn: "linear-gradient(to right, rgb(243,152,0),rgba(243,152,0, 0.7))"
    },
    theme: "classic-red",
    windowHeight: {
        height: 0,
        width: 0,
        boolean: false
    },
};

const getters = {
    getNavBar(state) {
        return state.navbar;
    },
    getNavBarNavs(state) {
        for (let i = 0, len = state.navbar.navs.length; i < len; i++) {
        }
    },
    getUserCenter(state) {
        return state.user_center;
    },
    getWxappImg(state) {
        return state.__wxapp_img;
    },
    getCatStyle(state) {
        return state.cat_style;
    },
    getVip(state) {
        return state.plugin.vip_card;
    },
    getVideo(state) {
        return state.mall.setting.is_goods_video;
    },
    getShowCart(state) {
        return state.mall.setting.is_show_cart;
    },
    getTheme(state) {
        return state.theme_color;
    },
    getSetting(state) {
        return state.mall.setting;
    }
};

const mutations = {
    mutSetConfig(state, data) {
        for (let item in data) {
            if (item === 'navbar') {
                for (let i = 0; i < data[item].navs.length; i++) {
                    data[item].navs[i].id = i;
                }
            }
            state[item] = data[item];
        }
    },
    mutSetHeight(state, data) {
        state.windowHeight = data;
    }
};

const actions = {
    actionGetConfig(context) {
        Vue.prototype.$mallConfig.getConfig().then(response => {
            context.commit('mutSetConfig', response);
        }).catch(() => {
        });
    },
    actionHeight(context, data) {
        context.commit("mutSetHeight", data);
    },
    actionResetConfig(context) {
        Vue.prototype.$mallConfig.resetConfig();
        Vue.prototype.$mallConfig.getConfig().then(response => {
            context.commit('mutSetConfig', response);
        }).catch(() => {
        });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}

