import * as utils from './utils.js';

const shareTimeline = function(args) {
    args = args || {
        title: '这是一个分享页面',
        query: {}
    };
    if (typeof args.query === 'undefined') {
        args.query = {};
    }
    let user_id = 0;
    if (this.$user.isLogin() && this.$store.state.user.info) {
        user_id = this.$store.state.user.info.options.user_id;
    }
    args.query.user_id = user_id;
    args.query = utils.objectToUrlParams(args.query);
    return args;
};
export default shareTimeline;
