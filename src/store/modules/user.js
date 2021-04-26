import user from '../../core/user.js';

const state = {
    accessToken: null,
    info: null,
    showLoginModal: false,
    tempParentId: 0,
    showAttention: false,
    showAttentionTwo:false,
    sign: {
        mobile: '',
        pic_captcha: '',
        sms_captcha: '',
        validate_code_id: -1
    },
    isSign: false

};

const getters = {
    accessToken(state) {
        return state.accessToken;
    },
    info(state) {
        return state.info;
    },
    showLoginModal(state) {
        return state.showLoginModal;
    },
    tempParentId(state) {
        return state.tempParentId;
    },
    is_vip(state) {
        return state.is_vip_card_user;
    },
    showAttention(state) {
        return state.showAttention;
    },
    showAttentionTwo(state) {
        return state.showAttentionTwo;
    },
    sign(state) {
        return state.sign;
    },
    isSign(state) {
        return state.isSign;
    }
};

const mutations = {
    accessToken(state, data) {
        state.accessToken = data;
    },
    info(state, data) {
        state.info = data;
    },
    showLoginModal(state, data) {
        state.showLoginModal = data;
    },
    tempParentId(state, data) {
        state.tempParentId = data;
    },
    showAttention(state, data) {
        state.showAttention = data;
    },
    showAttentionTwo(state, data) {
        state.showAttentionTwo = data;
    },
    sign(state, data) {
        state.sign = data;
    },
    isSign(state, data) {
        state.isSign = data;
    },
};

const actions = {
    sign(context, data) {
        context.commit('sign', data);
    },
    isSign(context, data) {
        context.commit('isSign', data);
    },
    accessToken(context) {
        if (!user.isLogin()) {
            context.commit('accessToken', null);
        }
        user.getAccessToken().then(accessToken => {
            context.commit('accessToken', accessToken);
        });
    },
    info(context, options) {
        if (!user.isLogin()) {
            context.commit('accessToken', null);
        }
        user.getAccessToken().then(accessToken => {
            context.commit('accessToken', accessToken);
            user.getInfo(options).then(data => {
                context.commit('info', data);
            });
        }).catch((err) => {
            context.commit('showLoginModal', true);
        });
    },
    refreshInfo(context) {
        context.commit('accessToken', null);
    },
    refresh(context) {
        if (!user.isLogin()) {
            context.commit('accessToken', null);
        }
        user.getAccessToken().then(accessToken => {
            context.commit('accessToken', accessToken);
            user.getInfo({
                refresh: true,
            }).then(data => {
                context.commit('info', data);
            }).catch(e => {
            });
        }).catch(e => {
        });
    },
    setTempParentId(context, data) {
        context.commit('tempParentId', data);
    },
    loadAccessTokenFormCache(context) {
        if (context.accessToken) return;
        user.getAccessToken({
            cacheOnly: true,
        }).then(e => {
            if (!e) return;
            context.commit('accessToken', e);
        });
    },
    logout(context) {
        context.commit('accessToken', null);
        user.loginByToken(null);
    },
    showAttention(context, data) {
        context.commit('showAttention', data);
    },
    showAttentionTwo(context, data) {
        context.commit('showAttentionTwo', data);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
