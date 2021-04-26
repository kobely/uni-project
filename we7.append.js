'use strict';

module.exports = {
    apply(compiler) {
        compiler.hooks.emit.tap('compilation', compilation => {
            // 遍历所有资源文件
            for (let filePathName in compilation.assets) {
                if (/^app\.js$/i.test(filePathName)) {
                    console.log('\n-  app.js追加微擎注释...' + filePathName);
                    // 获取文件内容
                    let content = (compilation.assets[filePathName].source() || '') + '\n\n// 不要删这行注释，微擎版用的：siteInfo: require(\'siteinfo.js\')\n';
                    // 重写指定输出模块内容
                    compilation.assets[filePathName] = {
                        source() {
                            return content;
                        },
                        size() {
                            return content.length;
                        }
                    };
                }
            }

        });
    },
};
