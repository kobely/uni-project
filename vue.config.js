const CopyWebpackPlugin = require('copy-webpack-plugin');
const cssAppend = require('./css.append.js');
const we7Append = require('./we7.append.js');
const removeOtiose = require('./remove.otiose.js');
const noPlugins = require('./no.plugins.js');
const path = require('path');
const configExtra = require('./config.extra.js');
let copyPlugin = [
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, '')
    },
    {
        from: path.join(__dirname, 'src/version.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, '')
    },
    {
        from: path.join(__dirname, 'src/sitemap.json'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, '')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/app_admin/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/card/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/coupon/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/advance/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/community/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/book/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/step/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/bargain/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/flash_sale/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/exchange/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/gift/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/integral_mall/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/miaosha/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/pick/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/pt/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/mch/mch/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/wholesale/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/mch/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/vip_card/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/order/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/user-center/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/share/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/siteinfo.js'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/goods-edit/siteinfo.js')
    },
    {
        from: path.join(__dirname, 'src/pages/address/json/name.json'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/address/json/name.json')
    },
    {
        from: path.join(__dirname, 'src/pages/goods/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/goods/image')
    },
    {
        from: path.join(__dirname, 'src/pages/favorite/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/favorite/image')
    },
    {
        from: path.join(__dirname, 'src/pages/card/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/card/image')
    },
    {
        from: path.join(__dirname, 'src/pages/balance/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/balance/image')
    },
    {
        from: path.join(__dirname, 'src/pages/foot/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/foot/image')
    },
    {
        from: path.join(__dirname, 'src/pages/share/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/share/image')
    },
    {
        from: path.join(__dirname, 'src/pages/app_admin/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/app_admin/image')
    },
    {
        from: path.join(__dirname, 'src/pages/app_admin/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/app_admin/image')
    },
    {
        from: path.join(__dirname, 'src/pages/goods-edit/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/goods-edit/image')
    },
    {
        from: path.join(__dirname, 'src/pages/member/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/member/image')
    },
    {
        from: path.join(__dirname, 'src/pages/coupon/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/coupon/image')
    },
    {
        from: path.join(__dirname, 'src/pages/full_reduce/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/full_reduce/image')
    },
    {
        from: path.join(__dirname, 'src/pages/search/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/search/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/bargain/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/bargain/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/fxhb/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/fxhb/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/lottery/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/lottery/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/mch/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/mch/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/pond/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/pond/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/scratch/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/scratch/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/bonus/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/bonus/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/miaosha/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/miaosha/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/pt/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/pt/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/step/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/step/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/integral_mall/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/integral_mall/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/clerk/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/clerk/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/check_in/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/check_in/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/vip_card/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/vip_card/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/advance/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/advance/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/gift/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/gift/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/gift/css'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/gift/css')
    },
    {
        from: path.join(__dirname, 'src/plugins/quick_share/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/quick_share/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/stock/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/stock/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/pick/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/pick/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/region/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/region/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/community/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/community/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/flash_sale/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/flash_sale/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/exchange/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/exchange/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/composition/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/composition/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/wholesale/image'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/wholesale/image')
    },
    {
        from: path.join(__dirname, 'src/plugins/demo/static'),
        to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'plugins/demo/static')
    },
];
copyPlugin = copyPlugin.concat(configExtra.copy);

module.exports = {
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin(copyPlugin),
            cssAppend,
            we7Append,
            removeOtiose,
            noPlugins,
        ],
        externals: configExtra.externals
    }
};
