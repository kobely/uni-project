const subscribe = (templateId) => {
    return new Promise((resolve, reject) => {
        // #ifdef MP_WEIXIN
        if(wx.requestSubscribeMessage) {
            wx.requestSubscribeMessage({
                tmplIds: templateId,
                success (res) {
                    resolve(res);
                },
                fail(res) {
                    reject(res);
                }
            })
        } else {
            uni.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
                showCancel: false,
                success(res) {
                    reject({});
                }
            });
        }
        // #endif
        // #ifndef MP-WEIXIN
        resolve({});
        // #endif
    });
};
export default subscribe;
