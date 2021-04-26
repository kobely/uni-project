/**
 * 使用参数 --no-plugins参数编译时，app.json中将去除插件使用的配置，其它json文件去除带plugin-private://的配置
 */
'use strict';

module.exports = {
    apply(compiler) {
        compiler.hooks.emit.tap('compilation', compilation => {
            if (!(process.argv && process.argv.indexOf('--no-plugins') > -1)) {
                return;
            }
            // 遍历所有资源文件
            for (let filePathName in compilation.assets) {
                if (/^app\.json/i.test(filePathName)) {
                    console.log('\n- app.json中将去除插件使用的配置...');
                    // 获取文件内容
                    let content = compilation.assets[filePathName].source() || '';
                    let data = JSON.parse(content);
                    if (typeof data.plugins !== 'undefined') {
                        delete data.plugins;
                    }
                    if (typeof data.subPackages !== 'undefined' && data.subPackages.length) {
                        for (let i in data.subPackages) {
                            if (typeof data.subPackages[i].plugins !== 'undefined') {
                                delete data.subPackages[i].plugins;
                            }
                        }
                    }
                    content = JSON.stringify(data, null, 2);
                    // 重写指定输出模块内容
                    compilation.assets[filePathName] = {
                        source() {
                            return content;
                        },
                        size() {
                            return content.length;
                        }
                    };
                } else if (/.*\.json/i.test(filePathName)) {
                    let content = compilation.assets[filePathName].source() || '';
                    let data = JSON.parse(content);
                    if (typeof data.usingComponents === 'object') {
                        for (let i in data.usingComponents) {
                            if (/^plugin-private:\/\//i.test(data.usingComponents[i])) {
                                delete data.usingComponents[i];
                            }
                        }
                    }
                    content = JSON.stringify(data, null, 2);
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
