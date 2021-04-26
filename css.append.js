'use strict';

module.exports = {
    apply(compiler) {
        compiler.hooks.emit.tap('compilation', compilation => {
            // 遍历所有资源文件
            for (let filePathName in compilation.assets) {
                if (/common\/main\.ttss/i.test(filePathName)) {
                    console.log('\n-  字节跳动追加box-sizing:border-box...');
                    // 获取文件内容
                    let content = `*{-webkit-box-sizing:border-box;box-sizing:border-box}` + compilation.assets[filePathName].source() || '';
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
