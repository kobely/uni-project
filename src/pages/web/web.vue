<template>
	<view class="web">
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
    export default {
        name: "web",
        data() {
            return {
                url: '',
                webviewStyles: {
                    progress: {
	                    width: '100%',
	                    height: '100%',
                    }
                }
            }
        },
        onLoad(option) { this.$commonLoad.onload(option);
            if (option.is_pay) {
                this.url = JSON.parse(option.url).url;
                // this.url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${option.data.appid}&redirect_uri=${window.location.origin}/pages/user-center/user-center&response_type=code&scope=snsapi_base&state=${option.data.state}#wechat_redirect`
            } else {
                this.getUrl(unescape(option.url));
            }
        },
        methods: {
            getUrl(url) {
                url = decodeURIComponent(url);
                let arr = url.split('?');
                let uri = arr[0];
                let param = arr[1] ? arr[1].split('&') : '';
                if (param) {
                    url = uri;
                    if (this.$user.isLogin()) {
                        for (let i in param) {
                            if (param[i] === 'visiter_id=') {
                                let access_token = this.$store.state.user.accessToken;
                                param[i] += access_token || '';
                            }
                            let userInfo = this.$store.state.user.info;
                            if (param[i] === 'visiter_name=') {
                                param[i] += encodeURIComponent(userInfo ? userInfo.nickname : '游客');
                            }
                            if (param[i] === 'avatar=') {
                                param[i] += encodeURIComponent(userInfo ? userInfo.avatar : '');
                            }
                        }
						if (this.$store.state.user.info) {
							param.push('user_id=' + this.$store.state.user.info.options.user_id);
							param.push('unionid=' + this.$store.state.user.info.unionid);
						}
                    }
                    let pages = getCurrentPages();
                    if (pages.length > 1) {
                        let page = pages[pages.length - 2];
                        let  goods = null;
                        // #ifdef MP
                        goods = page.data.goods;
                        // #endif
                        // #ifdef H5
                        goods = page._data.goods;
                        // #endif
                        if (goods) {
                            let goods = '';
                            let product = '';
                            // #ifdef MP
                            goods = page.data.goods;
                            // #endif
                            // #ifdef H5
                            goods = page._data.goods;
                            // #endif
                            product = {
                                pid: goods.id,
                                title: goods.name,
                                img: goods.cover_pic,
                                info: '',
                                price: "￥" + goods.price,
                                url: ""
                            };
                            if (page.route === 'plugins/integral_mall/goods/goods') {
                                product.price = '';
                                if (typeof goods.integral != 'undefined') {
                                    product.price += goods.integral + "积分 + ";
                                }
                                product.price += "￥" + goods.price;
                            }
                            if (page.route === 'plugins/step/goods/goods') {
                                product.price = goods.price;
                            }
                            if (product) {
                                param.push("product=" + encodeURIComponent(JSON.stringify(product)));
                            }
                        }
                    }
                    url = uri + '?' + param.join('&');
                } else {
                    if (this.$user.isLogin() && this.$store.state.user.info) {
                        url = uri + '?user_id=' + this.$store.state.user.info.options.user_id + '&unionid=' + this.$store.state.user.info.unionid;
                    }
                }
                this.url = url
            }
        },
        // #ifdef MP
        onShareAppMessage() {
            let args = {
                path: '/pages/web/web',
                params: {
                    url: encodeURIComponent(this.url)
                }
            };
            return this.$shareAppMessage(args);
        },
        // #endif
    }
</script>

<style scoped>
	.web {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>