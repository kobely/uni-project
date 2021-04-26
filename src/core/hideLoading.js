const hideLoading = async function(args) {
    args = args || {};
    args.isShow = false;
    this.$store.dispatch('loading/actionGetLoading', args);
};
export default hideLoading;