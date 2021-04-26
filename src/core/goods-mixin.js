export default {
	onLoad() {
		console.log('--商品混入--');
	},
	computed: {
		remindParams() {
			return {
				sell_time: this.sell_time,
				goods_id: this.goods ? this.goods.id : 0,
				template_message_list: this.template_message_list,
				buy_text: '立即购买'
			};
		},
		rightRemindText() {
			if (this.remindParams.sell_time > 5*60) {
				return '开售提醒我';
			} else if (this.remindParams.sell_time > 0) {
				return '即将开售';
			} else {
				return this.remindParams.buy_text;
			}
		}
	},
	methods: {
		rightTip() {
			if (this.remindParams.sell_time < 5*60) {
				console.log('小于5分钟不进行开售提醒')
				return ;
			}
			this.$goodsRemind(this.remindParams.template_message_list, this.remindParams.goods_id);
		},
	}
}
