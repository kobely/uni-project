const lazyLoadingData = function(element) {
    return new Promise((resolve, reject) => {
        try {
            let query = null;
            /* #ifndef MP-ALIPAY */
            query = this.createSelectorQuery();
            /* #endif */
            /* #ifdef MP-ALIPAY */
            query = uni.createSelectorQuery();
            /* #endif */
            query.select(`.${element}`).boundingClientRect();
            query.exec(res => {
                resolve(res);
            })
        } catch(err) {
            reject(err);
        }
    })
};

export default lazyLoadingData;
