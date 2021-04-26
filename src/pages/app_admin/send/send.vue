<template>
    <app-layout>
        <view class="title">
            选择发货商品
            <text>
                默认全选
            </text>
        </view>
        <view class="goods-list" v-if="detail.detail && detail.detail.length > 0">
            <view :key="item.id" class="dir-left-nowrap cross-center goods-item" v-for="item in detail.detail">
                <image class="active-icon" src="/static/image/icon/form-er.png" style="background-color: #E2E2E2" v-if="item.choose == 2 && order_refund_id == 0">
                </image>
                <image @click="chooseAddress(item)" class="active-icon" src="./../image/active.png" v-else-if="item.choose">
                </image>
                <image @click="chooseAddress(item)" class="active-icon" src="/static/image/icon/form-er.png" v-else>
                </image>
                <view class="dir-left-nowrap goods">
                    <image :src="item.goods_info.goods_attr.pic_url ? item.goods_info.goods_attr.pic_url : item.goods_info.goods_attr.cover_pic" class="goods-img">
                    </image>
                    <view class="goods-info">
                        <view class="t-omit-two goods-name">
                            {{item.goods_info.goods_attr.name}}
                        </view>
                        <view class="goods-attr t-omit">
                            <text :key="index" v-for="(attr,index) in item.goods_info.attr_list">
                                {{attr.attr_group_name}}:{{attr.attr_name}}
                            </text>
                        </view>
                        <view class="main-between cross-bottom">
                            <view class="goods-num">
                                x{{item.num}}
                            </view>
                            <view>
                                ￥{{item.total_price}}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="title">
            填写物流信息
        </view>
        <view class="input-list">
            <template v-if="detail.send_type == 2">
                <view class="main-between input-item">
                    <view class="label">
                        选择配送方式
                    </view>
                    <view class="type dir-left-nowrap city-type">
                        <view :class="is_express == 2 ? 'active': ''" @click="toggleExpress(2)">
                            商家自己配送
                        </view>
                        <view :class="is_express == 1 ? 'active': ''" @click="toggleExpress(1)">
                            第三方配送
                        </view>
                    </view>
                </view>
                <!-- 商家配送列表 -->
                <view class="dir-left-nowrap input-item" v-if="is_express == 2">
                    <view class="label">
                        配送员
                    </view>
                    <view @click="toPick" class="dir-right-nowrap cross-center" width="width:30%;">
                        <image class="to-more" src="/static/image/icon/arrow-right.png">
                        </image>
                        <text>
                            {{city.delivery}}
                        </text>
                    </view>
                </view>
                <!-- 第三方配送列表 -->
                <template v-else>
                    <view class="dir-left-nowrap input-item">
                        <view class="label">
                            选择配送
                        </view>
                        <view @click="toPick" class="dir-right-nowrap cross-center" width="width:30%;">
                            <image class="to-more" src="/static/image/icon/arrow-right.png">
                            </image>
                            <text class="t-omit">
                                {{city.cityService}}
                            </text>
                        </view>
                    </view>
                    <template v-if="city.isPreview">
                        <view class="dir-left-nowrap input-item" style="padding: 12rpx 0;border-top: 0;height: 60rpx">
                            <view class="preview-fee">
                                {{city.name}}可接单
                            </view>
                        </view>
                        <view class="dir-left-nowrap input-item" style="padding:0;border-top: 0;height: 60rpx;margin-bottom: 24rpx;">
                            <view>
                                预订单费用
                            </view>
                            <view class="dir-right-nowrap cross-center">
                                ￥{{city.fee}}
                            </view>
                        </view>
                    </template>
                </template>
            </template>
            <!-- 快递发货信息 -->
            <template v-else-if="is_express > -2">
                <view class="main-between input-item">
                    <view class="label">
                        选择发货方式
                    </view>
                    <view class="type dir-left-nowrap">
                        <view :class="is_express == 1 ? 'active': ''" @click="toggleExpress(1)">
                            快递配送
                        </view>
                        <view :class="is_express == 0 ? 'active': ''" @click="toggleExpress(0)">
                            无需物流
                        </view>
                    </view>
                </view>
                <view class="dir-left-nowrap input-item" v-if="is_express == 1">
                    <view class="label">
                        快递公司
                    </view>
                    <view @click="toPick(1)" class="dir-right-nowrap cross-center" width="width:30%;">
                        <image class="to-more" src="/static/image/icon/arrow-right.png">
                        </image>
                        <text>
                            {{express}}
                        </text>
                    </view>
                </view>
                <view class="dir-left-nowrap input-item" style="position:relative" v-if="is_express == 1">
                    <view class="label">
                        快递单号
                    </view>
                    <input class="express-no" v-model="express_no" />
                    <text @click="getExpressNo" class="get" v-if="id > 0">
                        获取面单
                    </text>
                </view>
                <view class="dir-left-nowrap input-item" v-if="is_express == 1">
                    <view class="label">
                        收件人邮编
                    </view>
                    <input type="number" v-model="code" />
                </view>
                <view class="dir-left-nowrap input-item" v-if="is_express == 1">
                    <view class="label">
                        商家留言
                    </view>
                    <input v-model="words" />
                </view>
                <view class="dir-left-nowrap input-item" v-if="is_express == 0">
                    <view class="label">
                        物流内容
                    </view>
                    <input placeholder="请输入物流内容" v-model="express_content" />
                </view>
            </template>
        </view>
        <!-- 同城配送发货 -->
        <template v-if="detail.send_type == 2">
            <!-- 第三方配送发货 -->
            <button v-if="is_express == 1" @click="citySend()" class="address-bottom">
                {{city.isPreview == 0 ? '下单' : '确认发货'}}
            </button>
            <!-- 商家配送发货 -->
            <button v-else @click="citySend()" class="address-bottom">
                确认发货
            </button>
        </template>
        <!-- 快递发货 -->
        <template v-else>
            <button @click="saveAddress" class="address-bottom">
                确认发货
            </button>
        </template>
        <!-- 统一选择列表 -->
        <view class="dialog" v-if="dialog">
            <view :class="['picker-list', `${iphone_x? 'iphone_x':''}`]">
                <view class="main-between picker-header">
                    <view @click="closeDialog(2)">
                        取消
                    </view>
                    <view @click="closeDialog(1)">
                        确定
                    </view>
                </view>
                <picker-view :value="chooseIndex" @change="bindChange" class="pick" indicator-style="height: 36px;">
                    <picker-view-column>
                        <view :key="idx" v-for="(item,idx) in list"
                                :style="{'color': newIndex == idx ? '#446dfd' : newIndex == idx + 1 || newIndex == idx - 1 ? '#999999' : newIndex == idx + 2 || newIndex == idx - 2 ? '#cdcdcd' : ''}"
                                class="picker-view t-omit">
                            {{item.name}}
                        </view>
                    </picker-view-column>
                </picker-view>
            </view>
        </view>
    </app-layout>
</template>
<script>
import { mapState } from "vuex";

export default {
    data() {
        return {
            express_no: '',
            express: '',
            customer_name: '',
            express_content: '',
            code: '',
            words: '',
            list: [],
            detail: {},
            dialog: false,
            iphone_x: false,
            id: '',
            chooseIndex: [0],
            express_id: 0,
            newIndex: 0,
            is_express: -2,
            is_send: 0,
            order_refund_id: 0,
            express_single: {},
            city: {
                cityList: [],
                deliveryId: null,
                delivery: '',
                cityServiceList: [],
                cityServiceId: null,
                cityService: '',
                isPreview: 0,
                fee: 0,
                name: '',
                delivery_no: '',
            }
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.info,
            adminImg: state => state.mallConfig.__wxapp_img.app_admin,
        })
    },
    methods: {
        chooseAddress(item) {
            if(this.is_send) {
                for(let express of this.detail.detailExpress) {
                    if(express.id == item.expressRelation.order_detail_express_id) {
                        this.express = express.express;
                        this.is_express = express.send_type == 2 ? 0 : 1;
                        this.express_content = express.express_content
                        this.express_no = express.express_no;
                        this.express_id = express.id;
                        this.customer_name = express.customer_name;
                        this.code = '';
                        this.words = express.merchant_remark;
                        this.code = express.code > 0 ? express.code : ''
                        for(let goods of this.detail.detail) {
                            goods.choose = false;
                            for(let expressGoods of express.expressRelation) {
                                if(expressGoods.order_detail_id == goods.id) {
                                    goods.choose = true;
                                }
                            }
                        }
                    }
                }
            }else {
                item.choose = !item.choose;
            }
            this.$forceUpdate();
        },

        toggleExpress(item) {
            this.is_express = item;
            if (this.detail.send_type == 2) {
                this.list = item == 2 ? this.city.cityList : this.city.cityServiceList;
                for(let index in this.list) {
                    if(this.is_express == 2) {
                        if(this.list[index].id == this.city.deliveryId) {
                            this.chooseIndex[0] = +index;
                            this.newIndex = +index;
                        }
                    }else {
                        if(this.list[index].id == this.city.cityServiceId) {
                            this.chooseIndex[0] = +index;
                            this.newIndex = +index;
                        }
                    }
                }
            }
        },

        bindChange(e) {
            this.newIndex = e.detail.value[0];
        },
        toPick(num) {
            let that = this;
            if(num == 1) {
                that.customer_name = '';
                that.newIndex = that.chooseIndex[0];
            }else {
                that.newIndex = that.chooseIndex[0];
            }
            setTimeout(()=>{
                that.dialog = !that.dialog;
            })
        },
        closeDialog(num) {
            if(num == 1) {
                this.chooseIndex[0] = this.newIndex;
                // 即时配送
                if (this.detail.send_type == 2) {
                    if (this.is_express == 2) {
                        this.city.delivery = "(" + this.list[this.chooseIndex[0]].id + ")" + this.list[this.chooseIndex[0]].name
                        this.city.deliveryId = this.list[this.chooseIndex[0]].id
                    } else {
                        this.city.cityService = "(" + this.list[this.chooseIndex[0]].id + ")" + this.list[this.chooseIndex[0]].name;
                        this.city.cityServiceId = this.list[this.chooseIndex[0]].id
                        this.city.isPreview = 0;
                    }
                }else {
                    this.express = this.list[this.newIndex].name
                }
            }else {
                this.newIndex = this.chooseIndex[0];
            }
            this.dialog = !this.dialog;
        },
        getExpressNo() {
            let that = this;
            uni.showLoading({
                mask: true,
                title: '加载中...'
            });
            that.$request({
                url: that.$api.app_admin.print,
                data: {
                    express: that.express,
                    code: that.code,
                    order_id: that.id,
                    order_detail_ids: JSON.stringify(that.getIdList())
                },
            }).then(response => {
                uni.hideLoading();
                if (response.code == 0) {
                    that.express_no = response.data.Order.LogisticCode;
                    that.express_single = response.data.express_single
                } else {
                    uni.showToast({
                        title: response.msg,
                        icon: 'none',
                        duration: 1000
                    });
                }
            }).catch(response => {
                uni.hideLoading();
            });
        },
        getExpress() {
            let that = this;
            uni.showLoading({
                mask: true,
                title: '加载中...'
            });
            that.$request({
                url: that.$api.app_admin.express
            }).then(response => {
                uni.hideLoading();
                if (response.code == 0) {
                    that.list = response.data.list;
                    that.getList();
                } else {
                    uni.showToast({
                        title: response.msg,
                        icon: 'none',
                        duration: 1000
                    });
                }
            }).catch(response => {
                uni.hideLoading();
            });
        },
        getList() {
            let that = this;
            uni.showLoading({
                mask: true,
                title: '加载中...'
            });
            that.$request({
                url: that.$api.app_admin.detail,
                data: {
                    order_id: that.id
                },
                method: 'post'
            }).then(response => {
                uni.hideLoading();
                if (response.code == 0) {
                    that.detail = response.data.order;
                    if(this.detail.send_type == 2) {
                        that.getDelivery();
                        that.is_express = 2;
                    }else {
                        that.is_express = 1;
                    }
                    for (let i in that.detail.detail) {
                        that.detail.detail[i].choose = true;
                    }
                    let num = that.is_send ? 1 : 0;
                    if (that.detail.detailExpress.length > num) {
                        that.detail.detail.forEach(row => {
                            for(let i = num;i < that.detail.detailExpress.length;i++) {
                                for (let x in that.detail.detailExpress[i].expressRelation) {
                                    if (that.detail.detailExpress[i].expressRelation[x].order_detail_id == row.id) {
                                        row.choose = that.is_send ? false:2;
                                    }
                                }
                            }
                        })
                    }
                    if (that.is_send > 0) {
                        that.express = response.data.order.detailExpress[0].express;
                        that.is_express = response.data.order.detailExpress[0].send_type == 2 ? 0 : 1;
                        that.express_content = response.data.order.detailExpress[0].express_content
                        that.express_no = response.data.order.detailExpress[0].express_no;
                        that.express_id = response.data.order.detailExpress[0].id;
                        that.customer_name = response.data.order.detailExpress[0].customer_name;
                        that.code = '';
                        that.words = response.data.order.detailExpress[0].merchant_remark;
                        if (response.data.order.code > 0) {
                            that.code = response.data.order.detailExpress[0].code
                        }
                    } else {
                        that.express = response.data.order.last_express ? response.data.order.last_express : that.list[0].name;
                    }
                    for(let index in that.list) {
                        if (that.list[index].name == that.express) {
                            that.chooseIndex[0] = index;
                        }
                    }
                } else {
                    uni.showToast({
                        title: response.msg,
                        icon: 'none',
                        duration: 1000
                    });
                }
            }).catch(response => {
                uni.hideLoading();
            });
        },
        saveAddress: function(e) {
            let that = this;
            if (that.is_express == 1 && !that.express_no) {
                uni.showToast({
                    title: '快递单号不得为空',
                    icon: 'none',
                    duration: 1000,
                });
                return;
            }
            let id_list = that.getIdList();
            if (id_list.length == 0 && that.order_refund_id == 0) {
                uni.showToast({
                    title: '请选择发货商品',
                    icon: 'none',
                    duration: 1000,
                });
                return;
            }
            uni.showLoading({
                mask: true,
                title: '提交中...'
            });
            let para = {
                is_express: 1,
                order_id: that.id,
                express_no: that.express_no,
                express: that.express,
                code: that.code,
                customer_name: that.customer_name,
                merchant_remark: that.words,
                express_content: '',
                order_detail_id: JSON.stringify(id_list),
                express_single_id: that.express_single.id ? that.express_single.id : 0,
            }
            if (that.is_express == 0) {
                para = {
                    is_express: 2,
                    order_id: that.id,
                    express_content: that.express_content,
                    order_detail_id: JSON.stringify(id_list)
                }
            }
            if(that.is_send > 0) {
                para.express_id = that.express_id;
            }
            if (that.order_refund_id > 0) {
                that.$request({
                    url: that.$api.app_admin.refund_handle,
                    method: "POST",
                    data: {
                        is_express: 1,
                        type: 2,
                        is_agree: 1,
                        order_refund_id: that.order_refund_id,
                        express_no: that.express_no,
                        express: that.express,
                        merchant_remark: that.words,
                    }
                }).then(response => {
                    uni.hideLoading();
                    if (response.code == 0) {
                        let msg = response.msg;
                        uni.showToast({
                            title: msg,
                            duration: 1000,
                            icon: 'success',
                            mask: false
                        });
                        setTimeout(function() {
                            uni.navigateBack();
                        }, 500)
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                    uni.showToast({
                        title: response,
                        icon: 'none',
                        duration: 1000
                    });
                });
            } else {
                that.$request({
                    url: that.$api.app_admin.send,
                    method: "POST",
                    data: para
                }).then(response => {
                    uni.hideLoading();
                    if (response.code == 0) {
                        let msg = response.msg;
                        if (that.is_send == 2) {
                            msg = '修改成功'
                        }
                        uni.showToast({
                            title: msg,
                            duration: 1000,
                            icon: 'success',
                            mask: false
                        });
                        setTimeout(function() {
                            uni.navigateBack();
                        }, 500)
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                    uni.showToast({
                        title: response,
                        icon: 'none',
                        duration: 1000
                    });
                });
            }
        },
        getIdList() {
            let that = this;
            let id_list = [];
            for (let i in that.detail.detail) {
                if (that.detail.detail[i].choose && that.detail.detail[i].choose != 2) {
                    id_list.push(that.detail.detail[i].id)
                }
            }
            return id_list;
        },
        getDelivery() {
            let that = this;
            that.$request({
                url: that.$api.app_admin.delivery
            }).then(response => {
                if (response.code === 0) {
                    if (response.data.list.length > 0) {
                        this.city.cityList = response.data.list;
                        this.city.deliveryId = response.data.list[0].id;
                        this.city.delivery = "(" + response.data.list[0].id + ")" + response.data.list[0].name;
                        // 同城配送配送员列表数据
                        this.list = this.city.cityList;
                        this.is_express = 2;
                    }


                    let city_service_list = response.data.city_service_list;
                    if (city_service_list.length > 0) {
                        let new_city_service_list = [];
                        city_service_list.forEach(function(item, index) {
                            if (item.service_type == '第三方') {
                                new_city_service_list.push(item)
                            } else if (that.detail.platform == 'wxapp' && item.service_type == '微信') {
                                new_city_service_list.push(item)
                            }
                        })

                        this.city.cityServiceList = new_city_service_list;
                        this.city.cityServiceId = new_city_service_list[0].id;
                        this.city.cityService = "(" + new_city_service_list[0].id + ")" + new_city_service_list[0].name;
                    }
                } else {
                    uni.showToast({
                        title: response.msg,
                        icon: 'none',
                        duration: 1000
                    });
                }
            }).catch(response => {
                uni.hideLoading();
            });
        },
        citySend() {
            let that = this;
            let para;
            if (that.detail.send_type == 2) {
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });

                let id_list = that.getIdList();
                if (id_list.length == 0 && that.order_refund_id == 0) {
                    uni.showToast({
                        title: '请选择发货商品',
                        icon: 'none',
                        duration: 1000,
                    });
                    return;
                }

                para = {
                    is_express: that.is_express,
                    words: '',
                    order_id: that.detail.id,
                    order_detail_id: JSON.stringify(id_list),
                    city_service: that.city.cityService,
                    is_preview: that.city.isPreview ? 0 : 1,
                    delivery_no: that.city.delivery_no
                };
                if (that.detail.send_type == 2) {
                    para.man = that.city.delivery;
                }
                if(that.is_send > 0) {
                    para.express_id = that.express_id;
                }
                that.$request({
                    url: that.$api.app_admin.send,
                    data: para,
                    method: 'post'
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        let resultData = response.data;
                        if (resultData && resultData.preview_success == 1) {
                            that.city.fee = resultData.fee;
                            that.city.isPreview = 1;
                            that.city.name = resultData.name;
                            that.city.isPreview = 1;
                            that.city.delivery_no = resultData.delivery_no;
                        } else {
                            setTimeout(function() {
                                uni.navigateBack();
                            }, 500);
                        }

                        uni.showToast({
                            title: response.msg,
                            type: 'success',
                            mask: false,
                            duration: 2000
                        });
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                    uni.showToast({
                        title: response,
                        icon: 'none',
                        duration: 1000
                    });
                });
            }
        }
    },
    onLoad(options) { this.$commonLoad.onload(options);
        let that = this;
        uni.getSystemInfo({
            success: function(res) {
                if (res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                    that.iphone_x = true;
                }
            }
        })
        if (options.id > 0) {
            that.id = options.id
        }
        if (options.order_refund_id > 0) {
            that.order_refund_id = options.order_refund_id
        }
        if(options.send_type == 0) {
            that.getExpress();
        }else {
            uni.showLoading({
                mask: true,
                title: '加载中...'
            });
            that.getList();
        }
        if (options.is_send > 0) {
            that.is_send = options.is_send
        }
    }
}
</script>
<style lang="scss" scoped="">
.title {
    padding: #{28rpx} #{24rpx} #{24rpx};
    font-size: #{28rpx};
    color: #353535;

    text {
        margin-left: #{16rpx};
        color: #999999;
    }
}

.goods-list {
    background-color: #fff;
    margin: 0 #{24rpx} #{28rpx};
    padding: #{32rpx} #{24rpx};
    border-radius: #{16rpx};

    .goods-item {
        margin-top: #{24rpx};
    }

    .goods-item:first-of-type {
        margin-top: 0;
    }

    .active-icon {
        height: #{36rpx};
        width: #{36rpx};
        border-radius: #{18rpx};
        margin-right: #{24rpx};
    }

    .goods {
        width: #{600rpx};
    }

    .goods-img {
        flex-shrink: 0;
        width: #{160rpx};
        height: #{160rpx};
        margin-right: #{20rpx};
    }

    .goods-info {
        font-size: #{24rpx};
        width: #{414rpx};
        color: #353535;

        .goods-name {
            height: #{64rpx};
            margin-top: #{5rpx};
            width: #{414rpx};
        }

        .goods-attr {
            color: #999999;
            width: 95%;
            margin-top: #{18rpx};
            margin-bottom: #{12rpx};

            text {
                margin-right: #{5rpx};
            }
        }

        .goods-num {
            color: #999999;
        }
    }
}

.pick {
    width: 100%;
    height: #{440rpx}
}

.pick-view {
    line-height: #{72rpx};
    text-align: center;
    color: #446dfd;
    font-size: #{32rpx};
}

.express-no {
    padding-right: #{180rpx};
}

.address-bottom {
    width: #{702rpx};
    height: #{80rpx};
    line-height: #{80rpx};
    border-radius: #{40rpx};
    padding: 0;
    text-align: center;
    margin: #{40rpx} auto;
    color: #fff;
    z-index: 7;
    font-size: #{28rpx};
    background-color: #446dfd;
}

.to-more {
    height: #{24rpx};
    width: #{12rpx};
    margin-left: #{10rpx};
}

.input-list {
    background-color: #fff;
    margin: 0 #{24rpx};
    border-radius: #{16rpx};
    padding: 0 #{24rpx};

    .input-item {
        border-top: #{1rpx} solid #eee;
        padding: #{24rpx} 0;
        height: #{96rpx};
        font-size: #{28rpx};
        color: #495060;


        view {
            width: #{550rpx};
            height: #{48rpx};
            line-height: #{48rpx};
            font-size: #{28rpx};
        }

        .type {
            width: #{328rpx};

            view {
                padding: 0 #{20rpx};
                height: #{48rpx};
                line-height: #{48rpx};
                margin-left: #{16rpx};
                background-color: #fff;
                border-radius: #{26rpx};
                border: #{2rpx} solid #e2e2e2;
                color: #666666;
                display: inline-block;
                width: auto;
                font-size: #{26rpx};
            }

            .active {
                background-color: #446dfd;
                border: 0;
                color: #fff;
            }
        }

        .city-type {
            width: #{410rpx};
        }

        .label {
            width: #{200rpx};
            height: #{48rpx};
            line-height: #{48rpx};
        }

        input {
            width: #{550rpx};
            height: #{48rpx};
            line-height: #{48rpx};
            font-size: #{28rpx};
        }

        .preview-fee {
            color: #63be72;
        }
    }

    .input-item:first-of-type {
        border-top: 0;
    }
}

.dialog {
    position: fixed;
    height: 100%;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, .3);
}

.picker-list {
    background-color: #fff;
    padding-top: #{20rpx};
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;

    .picker-view {
        line-height: #{72rpx};
        font-size: #{32rpx};
        text-align: center;
    }
    &.iphone_x {
        bottom: #{96rpx};
    }
}

.picker-header {
    padding: 0 #{24rpx};
    color: #446dfd;
    font-size: #{32rpx};
}

.get {
    width: #{160rpx};
    height: #{48rpx};
    line-height: #{48rpx};
    text-align: center;
    border: #{1rpx} solid #446dfd;
    border-radius: #{24rpx};
    position: absolute;
    top: #{20rpx};
    right: 0;
    display: block;
    color: #446dfd;
}
</style>