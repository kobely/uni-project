let that = null;
const allPay = function(data, sign, _this, item) {
    that = _this;
    switch (sign) {
        case 'advance':
            let body = {
                goods_id: data.goods_id,
                goods_attr_id: data.id,
                goods_num: data.number,
            };
            that.$request({
                url: that.$api.advance.order_submit,
                method: 'post',
                data: {
                    ...body,
                }
            }).then(res => {
                if (res.code === 0) {
                    get_token(res.data);
                }
            });
            break;
        case 'gift':
            let select_data = {
                name: item.name,
                price: data.price,
                attr: {
                    id: data.id,
                    attr_list: data.attr_list,
                    stock: data.stock,
                    goods_id: data.goods_id,
                },
                attr_str: '',
                pic_url: data.pic_url ? data.pic_url : item.cover_pic,
                number: data.number,
            };
            for (let i = 0; i < data.attr_list.length; i++) {
                select_data.attr_str += `${data.attr_list[i].attr_group_name}:${data.attr_list[i].attr_name} `
            }
            if (that.$storage.getStorageSync('GIFT_CART')) {
                let again = 0;
                let storage = that.$storage.getStorageSync('GIFT_CART');
                for (let i = 0; i < storage.length; i++) {
                    if (storage[i].attr.id === data.id) {
                        storage[i].number += data.number;
                    } else {
                        again += 1;
                    }
                }
                if (again === storage.length) {
                    storage.push(select_data);
                }
                that.$storage.setStorageSync('GIFT_CART', storage);
            } else {
                that.$storage.setStorageSync('GIFT_CART', [select_data]);
            }
            uni.showToast({
                title: '加入成功',
                icon: 'none'
            });
            break;
        case "pintuan":
            // that.$jump({
            //     open_type: 'navigate',
            //     url: `/pages/order-submit/order-submit?mch_list=${JSON.stringify(mch_list)}&preview_url=${encodeURIComponent(that.$api.pt.order_preview)}&submit_url=${encodeURIComponent(that.$api.pt.order_submit)}&order_page_url=/plugins/pt/order/order&plugin=pt`
            // });
            break;
        default:
            break;
    }
};

function get_token(data) {
    that.$request({
        url: that.$api.advance.pay_data,
        method: 'post',
        data: {
            ...data
        },
    }).then(res => {
        if (res.code === 0) {
            if (res.data.hasOwnProperty('id')) {
                that.$payment.pay(res.data.id).then(() => {
                    // 支付成功
                    uni.navigateTo({
                        url: `/plugins/advance/order/order`
                    })
                }).catch(() => {
                    // 支付失败
                    uni.navigateTo({
                        url: `/plugins/advance/order/order`
                    })
                });
            } else {
                setTimeout(() => {
                    get_token(data);
                }, 1000);
            }
        } else {
            uni.showModal({
                title: '提示',
                content: res.msg,
            })
        }
    });
}

export default allPay;
