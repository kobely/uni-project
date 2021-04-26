'use strict';

const fs = require("fs");

const keywords = [
    /.*\.scss$/i,
    /.*\.sass$/i,
    /.*\.less$/i,
    /.*\.vue$/i,
    /.*\.md$/i,
    /.*\.txt$/i,
    /.*\.html$/i,
    /.*\.log$/i,
    /.*\.gitignore$/i,
];

const dirs = [
    'dist/dev/mp-weixin',
    'dist/dev/mp-alipay',
    'dist/dev/mp-baidu',
    'dist/dev/mp-toutiao',
    'dist/build/mp-weixin',
    'dist/build/mp-alipay',
    'dist/build/mp-baidu',
    'dist/build/mp-toutiao',
];

module.exports = {
    apply(compiler) {
        compiler.hooks.afterEmit.tap('compilation', compilation => {
            // 遍历所有文件
            for (let filePathName in compilation.assets) {
                for (let i in keywords) {
                    const keyword = keywords[i];
                    if (keyword.test(filePathName)) {
                        for (let j in dirs) {
                            const dir = dirs[j];
                            const file = dir + '/' + filePathName;
                            if (fs.existsSync(file)) {
                                console.log('\n-  删除文件 ' + file);
                                fs.unlinkSync(file);
                            }
                        }
                    }
                }
            }

        });
    },
};
