const showToast = function(object) {
	uni.showToast(object);
}

const hideToast = function() {
	uni.hideToast();
}

const showLoading = function(object) {
	uni.showLoading(object);
}

const hideLoading = function() {
	uni.hideLoading();
}

const showModal = function(object) {
	uni.showModal(object);
}

const showActionSheet = function(object) {
	uni.showActionSheet(object);
}
export {showToast, hideToast, showLoading, hideLoading, showModal, showActionSheet}
