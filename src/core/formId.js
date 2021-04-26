import { datetime, time } from './utils.js';
import { getStorageSync, setStorageSync } from './cache.js';

const popAll = function() {
    const formIdList = getStorageSync('_FORM_ID_LIST');
    setStorageSync('_FORM_ID_LIST', []);
    return formIdList || [];
};

const push = function(formId) {
    if (!formId || formId === 'the formId is a mock one') {
        return false;
    }

    let formIdList = getStorageSync('_FORM_ID_LIST');

    if (!formIdList || !formIdList.length) {
        formIdList = [];
    }
    const item = {
        value: formId,
        type: 0,
        remains: 1,
        expires_at: datetime(null, (time() + 7 * 86400) - 60),
    };
    formIdList.push(item);
    setStorageSync('_FORM_ID_LIST', formIdList);
};

export {
    popAll,
    push,
}
