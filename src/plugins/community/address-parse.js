
/**
 * 需要解析的地址，type是解析的方式，默认是正则匹配
 * @param address
 * @param options：type： 0:正则，1：树查找, textFilter： 清洗的字段
 * @returns {{}|({area: Array, province: Array, phone: string, city: Array, name: string, detail: Array} & {area: (*|string), province: (*|string), city: (*|string), detail: (Array|boolean|string|string)})}
 * @constructor
 */
const AddressParse = (address, options, provinceString, cityString, areaString) => {
    const { type = 0, textFilter = [] } = typeof options === 'object' ? options : {};

    if (!address) {
        return {}
    }

    const parseResult = {
        phone: '',
        province: [],
        city: [],
        area: [],
        detail: [],
        name: '',
    };
    address = cleanAddress(address, textFilter);

    // 识别手机号
    const resultPhone = filterPhone(address);
    address = resultPhone.address;
    parseResult.phone = resultPhone.phone;

    const resultCode = filterPostalCode(address);
    address = resultCode.address;
    parseResult.postalCode = resultCode.postalCode;

    // 地址分割
    const splitAddress = address.split(' ').filter(item => item).map(item => item.trim());

    // 找省市区和详细地址
    splitAddress.forEach((item) => {
        // 识别地址
        if (!parseResult.province[0] || !parseResult.city[0] || !parseResult.area[0]) {
            // 两个方法都可以解析，正则和树查找
            let parse;
            type === 1 && (parse = parseRegion(item, parseResult));
            type === 0 && (parse = parseRegionWithRegexp(item, parseResult, provinceString, cityString, areaString));
            const {province, city, area, detail} = parse;
            parseResult.province = province || [];
            parseResult.area = area || [];
            parseResult.city = city || [];
            parseResult.detail = parseResult.detail.concat(detail || []);
        } else {
            parseResult.detail.push(item);
        }
    });

    // 地址都解析完了，如果还没有姓名，那么姓名应该是在详细地址里面，取详细地址里面长度最小的那个
    if (!parseResult.name) {
        const detail = JSON.parse(JSON.stringify(parseResult.detail));
        detail.sort((a, b) => a.length - b.length);
        parseResult.name = detail[0];
        const nameIndex = parseResult.detail.findIndex(item => item === parseResult.name);
        parseResult.detail.splice(nameIndex, 1)
    }


    const province = parseResult.province[0];
    const city = parseResult.city[0];
    const area = parseResult.area[0];
    const detail = parseResult.detail;

    return Object.assign(parseResult, {
        province: (province && province.name) || '',
        city: (city && city.name) || '',
        area: (area && area.name) || '',
        detail: (detail && detail.length > 0 && detail.join('')) || ''
    })
};

/**
 * 利用正则表达式解析
 * @param fragment
 * @param hasParseResult
 * @returns {{area: (Array|*|string), province: (Array|*|string), city: (Array|*|string|string), detail: (*|Array)}}
 */
const parseRegionWithRegexp = (fragment, hasParseResult, provinceString, cityString, areaString) => {
    // log('----- 当前使用正则匹配模式 -----')
    let province = hasParseResult.province || [], city = hasParseResult.city || [], area = hasParseResult.area || [],
        detail = [];

    let matchStr = '';
    if (province.length === 0) {
        for (let i = 1; i < fragment.length; i++) {
            const str = fragment.substring(0, i + 1);
            const regexProvince = new RegExp(`\{\"code\":\"[0-9]{1,6}\",\"name\":\"${str}[\u4E00-\u9FA5]*?\"}`, 'g');
            const matchProvince = provinceString.match(regexProvince);
            if (matchProvince) {
                const provinceObj = JSON.parse(matchProvince[0]);
                if (matchProvince.length === 1) {
                    province = [];
                    matchStr = str;
                    province.push(provinceObj)
                }
            } else {
                break
            }
        }

        if (province[0]) {
            fragment = fragment.replace(matchStr, '')
        }

    }

    if (city.length === 0) {
        for (let i = 1; i < fragment.length; i++) {
            const str = fragment.substring(0, i + 1);
            const regexCity = new RegExp(`\{\"code\":\"[0-9]{1,6}\",\"name\":\"${str}[\u4E00-\u9FA5]*?\",\"provinceCode\":\"${province[0] ? `${province[0].code}` : '[0-9]{1,6}'}\"\}`, 'g');
            const matchCity = cityString.match(regexCity);
            if (matchCity) {
                const cityObj = JSON.parse(matchCity[0]);
                if (matchCity.length === 1) {
                    city = [];
                    matchStr = str;
                    city.push(cityObj);
                }
            } else {
                break;
            }
        }
        if (city[0]) {
            const {provinceCode} = city[0];
            fragment = fragment.replace(matchStr, '');
            if (province.length === 0) {
                const regexProvince = new RegExp(`\{\"code\":\"${provinceCode}\",\"name\":\"[\u4E00-\u9FA5]+?\"}`, 'g');
                const matchProvince = provinceString.match(regexProvince);
                province.push(JSON.parse(matchProvince[0]))
            }
        }

    }

    if (area.length === 0) {
        for (let i = 1; i < fragment.length; i++) {
            const str = fragment.substring(0, i + 1);
            const regexArea = new RegExp(`\{\"code\":\"[0-9]{1,6}\",\"name\":\"${str}[\u4E00-\u9FA5]*?\",\"cityCode\":\"${city[0] ? city[0].code : '[0-9]{1,6}'}\",\"provinceCode\":\"${province[0] ? `${province[0].code}` : '[0-9]{1,6}'}\"\}`, 'g');
            const matchArea = areaString.match(regexArea);
            if (matchArea) {
                const areaObj = JSON.parse(matchArea[0]);
                if (matchArea.length === 1) {
                    area = [];
                    matchStr = str;
                    area.push(areaObj);
                }
            } else {
                break
            }
        }
        if (area[0]) {
            const {provinceCode, cityCode} = area[0];
            fragment = fragment.replace(matchStr, '');
            if (province.length === 0) {
                const regexProvince = new RegExp(`\{\"code\":\"${provinceCode}\",\"name\":\"[\u4E00-\u9FA5]+?\"}`, 'g');
                const matchProvince = provinceString.match(regexProvince);
                province.push(JSON.parse(matchProvince[0]));
            }
            if (city.length === 0) {
                const regexCity = new RegExp(`\{\"code\":\"${cityCode}\",\"name\":\"[\u4E00-\u9FA5]+?\",\"provinceCode\":\"${provinceCode}\"\}`, 'g');
                const matchCity = cityString.match(regexCity);
                city.push(JSON.parse(matchCity[0]));
            }
        }
    }


    // 解析完省市区如果还存在地址，则默认为详细地址
    if (fragment.length > 0) {
        detail.push(fragment)
    }

    return {
        province,
        city,
        area,
        detail,
    }
};

/**
 * 利用树向下查找解析
 * @param fragment
 * @param hasParseResult
 * @returns {{area: Array, province: Array, city: Array, detail: Array}}
 */
const parseRegion = (fragment, hasParseResult) => {
    // log('----- 当前使用树查找模式 -----')
    let province = [], city = [], area = [], detail = [];

    if (hasParseResult.province[0]) {
        province = hasParseResult.province
    } else {
        // 从省开始查找
        for (const tempProvince of provinces) {
            const {name} = tempProvince;
            let replaceName = '';
            for (let i = name.length; i > 1; i--) {
                const temp = name.substring(0, i);
                if (fragment.indexOf(temp) === 0) {
                    replaceName = temp;
                    break;
                }
            }
            if (replaceName) {
                province.push(tempProvince);
                fragment = fragment.replace(replaceName, '');
                break
            }
        }
    }
    if (hasParseResult.city[0]) {
        city = hasParseResult.city
    } else {
        // 从市区开始查找
        for (const tempCity of cities) {
            const {name, provinceCode} = tempCity;
            const currentProvince = province[0];
            // 有省
            if (currentProvince) {
                if (currentProvince.code === provinceCode) {
                    let replaceName = '';
                    for (let i = name.length; i > 1; i--) {
                        const temp = name.substring(0, i);
                        if (fragment.indexOf(temp) === 0) {
                            replaceName = temp;
                            break;
                        }
                    }
                    if (replaceName) {
                        city.push(tempCity);
                        fragment = fragment.replace(replaceName, '');
                        break;
                    }
                }
            } else {
                // 没有省，市不可能重名
                for (let i = name.length; i > 1; i--) {
                    const replaceName = name.substring(0, i);
                    if (fragment.indexOf(replaceName) === 0) {
                        city.push(tempCity);
                        province.push(provinces.find(item => item.code === provinceCode));
                        fragment = fragment.replace(replaceName, '');
                        break;
                    }
                }
                if (city.length > 0) {
                    break;
                }
            }
        }
    }

    // 从区市县开始查找
    for (const tempArea of areas) {
        const {name, provinceCode, cityCode} = tempArea;
        const currentProvince = province[0];
        const currentCity = city[0];

        // 有省或者市
        if (currentProvince || currentCity) {
            if ((currentProvince && currentProvince.code === provinceCode)
                || (currentCity && currentCity.code) === cityCode) {
                let replaceName = '';
                for (let i = name.length; i > 1; i--) {
                    const temp = name.substring(0, i);
                    if (fragment.indexOf(temp) === 0) {
                        replaceName = temp;
                        break
                    }
                }
                if (replaceName) {
                    area.push(tempArea);
                    !currentCity && city.push(cities.find(item => item.code === cityCode));
                    !currentProvince && province.push(provinces.find(item => item.code === provinceCode));
                    fragment = fragment.replace(replaceName, '');
                    break;
                }
            }
        } else {
            // 没有省市，区县市有可能重名，这里暂时不处理，因为概率极低，可以根据添加市解决
            for (let i = name.length; i > 1; i--) {
                const replaceName = name.substring(0, i);
                if (fragment.indexOf(replaceName) === 0) {
                    area.push(tempArea);
                    city.push(cities.find(item => item.code === cityCode));
                    province.push(provinces.find(item => item.code === provinceCode));
                    fragment = fragment.replace(replaceName, '');
                    break;
                }
            }
            if (area.length > 0) {
                break;
            }
        }
    }

    // 解析完省市区如果还存在地址，则默认为详细地址
    if (fragment.length > 0) {
        detail.push(fragment)
    }

    return {
        province,
        city,
        area,
        detail,
    }
};

/**
 * 匹配电话
 * @param address
 * @returns {{address: *, phone: string}}
 */
const filterPhone = (address) => {
    let phone = '';
    // 整理电话格式
    address = address.replace(/(\d{3})-(\d{4})-(\d{4})/g, '$1$2$3');
    address = address.replace(/(\d{3}) (\d{4}) (\d{4})/g, '$1$2$3');
    address = address.replace(/(\d{4}) \d{4} \d{4}/g, '$1$2$3');
    address = address.replace(/(\d{4})/g, '$1');

    const mobileReg = /(\d{7,12})|(\d{3,4}-\d{6,8})|(86-[1][0-9]{10})|(86[1][0-9]{10})|([1][0-9]{10})/g;
    const mobile = mobileReg.exec(address);
    if (mobile) {
        phone = mobile[0];
        address = address.replace(mobile[0], ' ')
    }
    return {address, phone}
};

/**
 * 匹配邮编
 * @param address
 * @returns {{address: *, postalCode: string}}
 */
const filterPostalCode = (address) => {
    let postalCode = '';
    const postalCodeReg = /\d{6}/g;
    const code = postalCodeReg.exec(address);
    if (code) {
        postalCode = code[0];
        address = address.replace(code[0], ' ');
    }
    return {address, postalCode}
};

/**
 * 地址清洗
 * @param address
 * @returns {*}
 */
const cleanAddress = (address, textFilter = []) => {
    // 去换行等
    address = address
        .replace(/\r\n/g, ' ')
        .replace(/\n/g, ' ')
        .replace(/\t/g, ' ');

    // 自定义去除关键字，可自行添加
    const search = [
        '详细地址',
        '收货地址',
        '收件地址',
        '地址',
        '所在地区',
        '地区',
        '姓名',
        '收货人',
        '收件人',
        '联系人',
        '收',
        '邮编',
        '联系电话',
        '电话',
        '联系人手机号码',
        '手机号码',
        '手机号',
    ].concat(textFilter);
    search.forEach(str => {
        address = address.replace(new RegExp(str, 'g'), ' ')
    });

    const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]\.<>/?~！@#￥……&*（）——|{}【】‘；：”“’。，、？]", 'g');
    address = address.replace(pattern, ' ');

    // 多个空格replace为一个
    address = address.replace(/ {2,}/g, ' ');

    return address
};

export default AddressParse;
