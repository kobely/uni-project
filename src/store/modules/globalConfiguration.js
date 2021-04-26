const state = {
    reportAndError: {
        boolean: false,
        content: '网络开了会儿小差， 请刷新重试下哦~',
    },
    tabBarBoolean: false,
    systemInfo: {
        SDKVersion: "",
        batteryLevel: 0,
        brand: "",
        errMsg: "",
        fontSizeSetting: 0,
        language: "0",
        model: "",
        pixelRatio: 0,
        platform: "",
        safeArea: {
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0,
        },
        screenHeight: 0,
        screenWidth: 0,
        statusBarHeight: 0,
        system: "",
        version: "",
        windowHeight: 0,
        windowWidth: 0,
    },
    mBarHeight: 44,
    tabBarHeight: 0,
    iphone: false,
    iphoneHeight: 0,
    promptBox: {
        text: '',
        show: false,
        call: -1,
    },
    imageWidth: 0,
};

const getters = {
    reportAndErrorObj(state) {
        return state.reportAndError;
    }
};

const mutations = {
    reportAndErrorObj(state, data) {
        state.reportAndError = data;
    },
    reportAndErrorB(state, data) {
        state.reportAndError.boolean = data;
    },
    setTabBarBoolean(state, data) {
        let pages = getCurrentPages();
        let currPage = null;
        if (pages.length) {
            currPage = pages[pages.length - 1];
        }
        let currentRoute = undefined;

        // #ifndef MP-TOUTIAO
        currentRoute = `/${currPage.route.split("?")[0]}`;
        // #endif

        // #ifdef MP-TOUTIAO
        currentRoute = `/${currPage.__route__.split("?")[0]}`;
        // #endif
        for (let i = 0; i < data.length; i++) {
            if(currentRoute.includes(data[i].url.split('?')[0])) {
                return state.tabBarBoolean = true;
            }
        }
        return state.tabBarBoolean = false;
    },
    setSystemInfo(state, data) {
        state.systemInfo = data;
        state.imageWidth = data.windowWidth;
    },
    setPromptBox(state, data) {
        state.promptBox = data;
    },
    setPromptBoxCall(state, data) {
        state.promptBox.call = data;
    },
    setHeight(state, data) {
        state.tabBarHeight = data;
    },
    setiPhoneHeight(state, data) {
        state.iphoneHeight = data;
    },
    setiPhoneBoolean(state, data) {
        state.iphone = data;
    },
    setImageWidth(state, data) {
        state.imageWidth = state.systemInfo.windowWidth - (state.systemInfo.windowWidth / 750) * data;
    }
};

const actions = {
    setImageWidth(content, data) {
        content.commit('setImageWidth', data);
    },
    reportAndErrorObj(content, data) {
        content.commit('reportAndErrorObj', data);
    },
    reportAndErrorB(content, data) {
        content.commit('reportAndErrorB', data);
    },
    setTabBarBoolean(content, data) {
        content.commit('setTabBarBoolean', data);
    },
    setSystemInfo(content, data) {
        content.commit('setSystemInfo', data);
    },
    setHeight(content, data) {
        content.commit('setHeight', data);
    },
    setiPhoneBoolean(content, data) {
        content.commit('setiPhoneBoolean', data);
    },
    setPromptBox(content, data) {
        content.commit('setPromptBox', data);
    },
    setPromptBoxCall(content,data) {
        content.commit('setPromptBoxCall', data);
    },
    setiPhoneHeight(content, data) {
        content.commit('setiPhoneHeight', data);
    }
};

export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions
};
