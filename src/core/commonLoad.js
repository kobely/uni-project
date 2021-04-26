import shareAppMessage from './shareAppMessage.js';
import Vue from "vue";

const onload = function (options = null) {
    //页面onload调
    // #ifdef H5
    let setting = Vue.prototype.$store.getters["mallConfig/getSetting"];
    let {mall_logo_pic} = setting;
    console.log(mall_logo_pic);
    shareAppMessage({
        title: '',
        imageUrl: mall_logo_pic,
        path: '',
        desc: '',
        params: {}
    }, false);
    // #endif
};

export {
    onload
}