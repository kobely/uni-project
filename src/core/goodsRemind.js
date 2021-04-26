import subscribe from './subscribe.js';
import * as tips from './tips.js';
import api from './appOnLaunch.js';
import request from './request.js';
const remindRequest = (goods_id) => {
	tips.showLoading({
		mask: true
	});
	request({
		url: api.goods.remind,
		data: {
			goods_id: goods_id
		}
	}).then(response => {
		tips.hideLoading();
		if (response.code === 0) {
			tips.showToast({
				title: '订阅成功，开售前5分钟提醒您',
				icon: 'none'
			})
		}
	}).catch(e => {
		tips.hideLoading();
	});
}
const remind = (template_message_list, goods_id) => {
	subscribe(template_message_list).then(res => {
		remindRequest(goods_id);
	}).catch((e) => {
		remindRequest(goods_id);
	});
};
export default remind;
