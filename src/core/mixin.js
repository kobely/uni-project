export default {
	install(Vue) {
		Vue.mixin({
			onLoad() {
				console.log('全局混入的钩子函数');
			}
		})
	}
}
