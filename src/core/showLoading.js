const showLoading = async function(args) {
    let defaultArgs = {
        type: 'global',
        text: '加载中',
        color: '#ffffff',
        backgroundImage: '',
    };
    args = Object.assign(defaultArgs, args);
    args.isShow = true;
    this.$store.dispatch('loading/actionGetLoading', args);
};
export default showLoading;