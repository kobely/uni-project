const path = require('path');
module.exports = {
    externals: {
        'siteInfo': 'siteInfo',
        'appVersion': 'version'
    },
    copy: [
        {
            from: path.join(__dirname, 'public/ap.js'),
            to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'ap.js')
        },
        {
            from: path.join(__dirname, 'public/pay.html'),
            to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pay.html')
        },
        {
            from: path.join(__dirname, 'src/pages/registered/image'),
            to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/registered/image')
        },
    ]
};
