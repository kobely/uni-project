import apiUrl from './apiUrl.js';
import siteInfo from 'siteInfo';

const spliceUrl = (ip, apiUrl) => {
    let newUrl = {};
    for (let k in apiUrl) {
        let newOb = {
            [k]: {}
        };
        for (let i in apiUrl[k]) {
            newOb[k][i] = `${ip}${apiUrl[k][i]}`
        }
        newUrl[k] = newOb[k];
    }
    return newUrl;
};

const appendApiUrl = (siteInfo) => {
  let apiRoot = '';
  if (siteInfo.acid > 0) {
    const scriptUrl = siteInfo.siteroot.substr(0, siteInfo.siteroot.indexOf('app/index.php'))
      + 'addons/zjhj_bd/web/index.php';
    apiRoot = scriptUrl + '?_acid=' + siteInfo.acid + '&r=';
  } else {
    apiRoot = siteInfo.apiroot + '&r=';
  }
  return spliceUrl(apiRoot, apiUrl);
};

export default appendApiUrl(siteInfo);
