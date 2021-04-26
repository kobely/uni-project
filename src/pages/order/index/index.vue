<template>
    <app-layout>
        <!-- #ifdef H5 -->
        <bd-h5-back :iconStyle="2" height="88" width="100"></bd-h5-back>
        <!-- #endif -->
        <view class="search-area">
            <view v-if="search.keyword || search.dateArr[0] || search.dateArr[1]" class="search be-search dir-left-nowrap" @click="toSearch">
                <image class="icon-search" src="/static/image/icon/icon-search.png"></image>
                <view v-if="search.dateArr[0]">{{search.dateArr[0]}}</view>
                <view v-if="search.dateArr[1]"><text v-if="search.dateArr[0]">至</text>{{search.dateArr[1]}}</view>
                <view v-if="search.keyword"><text v-if="search.dateArr[0] || search.dateArr[1]">,</text>{{search.keyword}}</view>
            </view>
            <view v-else class="search main-center" @click="toSearch">
                <image class="icon-search" src="/static/image/icon/icon-search.png"></image>
                <text>搜索</text>
            </view>
        </view>
        <view class="search-placeholder"></view>
        <view class="order-box">
            <app-tab-nav padding="0" setTop="88" :tabList="list" :border="false" :shadow="false" :background="bgColor" :activeItem="currentIndex" @click="clickTab" :theme="getTheme"></app-tab-nav>
            <view v-if="is_show" class='content-box'>
                <template v-if="orders.length">
                    <view hover-class="u-hover-class" v-for='(item, index) in orders' :key='item.id' :style="{'margin-top': index == 0 ? '24rpx' : '0'}" class='order-item-box dir-top-wrap'>
                        <app-jump-button :url="getPageUrl(item.id, item.sign)">
                            <view class="dir-top-nowrap" style="width: 100%">
                                <view class='dir-left-nowrap view-1'>
                                    <view class='box-grow-1'>订单号：{{item.order_no}}</view>
                                    <template v-if='item.status == 0'>
                                        <text v-if='item.sign == "pintuan"'>{{item.is_pay == 1 ? '拼团中' : '待付款'}}</text>
                                    </template>
                                    <template v-else>
                                        <view>{{item.status_text}}</view>
                                    </template>
                                </view>
                                <view v-for='(dItem, dIndex) in item.detail' :key='dIndex' class='view-2'>
                                    <app-order-goods-info :goods='dItem.goods_info' :plugin-data="item.plugin_data" :plugin-index="dIndex"></app-order-goods-info>
                                </view>
                            </view>
                        </app-jump-button>
                        <view class='dir-top-nowrap view-3'>
                            <template v-if='currentIndex == 5'>
                                <view v-if='item.type == 1' class='box-grow-1'>退货退款:
                                    <text class='price-color'>￥{{item.refund_price}}</text>
                                </view>
                                <view v-else class='box-grow-1'>换货</view>
                            </template>
                            <template v-else>
                                <view class='box-grow-1 main-right cross-center price-count-box'>
                                    <text class="price-label">合计 </text>
                                    <span class='price-color'>
                                        <text v-if="item.plugin_data.exchange_count">{{item.plugin_data.exchange_count}}{{item.plugin_data.price_name}}+</text>
                                        <text>￥{{item.total_pay_price}}</text>
                                    </span>
                                    <text v-if="item.express_price > 0" class="price-express">(含运费￥{{item.express_price}})</text>
                                </view>
                            </template>
                            <view class='box-grow-0 main-right action-button-box'>
                                <app-jump-button>
                                    <view class="main-right action-box-view">
                                        <!-- 售后订单 -->
                                        <template v-if='currentIndex == 5'>
                                            <text :class="{'success-color': item.is_confirm == 1 ? true : false}">
                                                {{item.status_text}}
                                            </text>
                                        </template>
                                        <!-- 其它订单 -->
                                        <template v-else>
                                            <!-- 货到付款订单操作 start -->
                                            <template v-if='item.pay_type == 2'>
                                                <!-- 进行中的订单 不能进行订单操作 -->
                                                <template v-if='item.status == 1'>
                                                    <!-- 待收货-->
                                                    <template v-if='item.is_confirm == 0'>
                                                        <view v-if="isShowExpressButton(item)" @click='logistics(item)' class='order-btn'>物流
                                                        </view>
                                                        <view v-if="item.is_send == 1 && item.is_confirm == 0" @click='confirm(item)' class='order-btn'>确认收货
                                                        </view>
                                                    </template>
                                                    <!-- 核销 -->
                                                    <!-- 到店自提订单 在核销前有收款操作 -->
                                                    <template v-if='item.send_type ==1 && item.is_confirm == 0 && item.cancel_status == 0'>
                                                        <view @click='getClerkCode(item)' class='order-btn'>核销码</view>
                                                    </template>
                                                    <template v-if='item.action_status.is_show_comment == 1'>
                                                        <view @click='appraise(item)' class='order-btn'>评价</view>
                                                    </template>
                                                </template>
                                            </template>
                                            <!-- 货到付款订单操作 end -->
                                            <!-- 已支付订单操作 start -->
                                            <template v-else>
                                                <!-- 待付款 -->
                                                <template v-if='item.is_pay == 0'>
                                                    <view @click="cancel(item)" class='order-btn'>取消</view>
                                                    <view @click='orderPay(item)' class='order-btn'>付款</view>
                                                </template>
                                                <template v-if='item.status == 1'>
                                                    <!-- 核销 -->
                                                    <!-- 到店自提订单 未支付不显示核销码 | 未支付 货到付款订单显示核销码 -->
                                                    <template v-if='item.send_type ==1 && item.is_confirm == 0 && ((item.is_pay == 0 && item.pay_type == 2) || (item.is_pay == 1 && item.pay_type != 2))'>
                                                        <view @click='getClerkCode(item)' class='order-btn'>核销码</view>
                                                    </template>
                                                    <!-- 待收货-->
                                                    <template v-if='item.is_pay == 1 && item.is_confirm == 0 && item.sign != "community"'>
                                                        <view v-if="isShowExpressButton(item)" @click='logistics(item)' class='order-btn'>物流
                                                        </view>
                                                        <view v-if="item.is_send == 1 && item.is_confirm == 0" @click='confirm(item)' class='order-btn'>确认收货</view>
                                                    </template>
                                                    <template v-if='item.action_status.is_show_comment == 1'>
                                                        <view @click='appraise(item)' class='order-btn'>评价</view>
                                                    </template>
                                                </template>
                                            </template>
                                            <!-- 已支付订单操作 end -->
                                        </template>
                                    </view>
                                </app-jump-button>
                            </view>
                        </view>
                    </view>
                </template>
                <view class="no-list" v-else>
                    <app-no-goods background="#f7f7f7" :title="search.keyword || search.dateArr[0] || search.dateArr[1] ? '暂无您搜索的订单':'暂无相关订单'" color="#999999" :is_image="1"></app-no-goods>
                </view>
                <app-related-suggestion-product v-if="search.keyword || search.dateArr[0] || search.dateArr[1]" :list="recommend_list" :showIcon="false" text="您或许会喜欢" :theme="getTheme"></app-related-suggestion-product>
                <!-- 核销码展示 -->
                <view v-if='is_qrcode' class='qrcode-box'>
                    <view class='dir-top-wrap main-center cross-center item'>
                        <view>核销码</view>
                        <image class='img' :src='qr_code_url'></image>
                        <image @click='closeQrcode' src='/static/image/icon/icon-close.png' class='remove'></image>
                    </view>
                </view>
            </view>
            <app-load-text v-if="is_load_show"></app-load-text>
        </view>
    </app-layout>
</template>
<script>
import appTabNav from '../../../components/basic-component/app-tab-nav/app-tab-nav.vue';
import appNoGoods from '../../../components/page-component/app-no-goods/app-no-goods.vue';
import appRelatedSuggestionProduct from '../../../components/page-component/app-related-suggestion-product/app-related-suggestion-product.vue';
import appOrderGoodsInfo from '../../../components/page-component/app-order-goods-info/app-order-goods-info.vue';
// #ifdef H5
import bdH5Back from "@/components/page-component/goods/bd-h5-back.vue";
// #endif
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            list: [{ name: '全部', id: 0 }, { name: '待付款', id: 1 }, { name: '待发货', id: 2 }, { name: '待收货', id: 3 }, { name: '已完成', id: 4 }],
            page: 1,
            currentIndex: 0,
            orders: [],
            search: {
                keyword: '',
                dateArr: []
            },
            pagination: null,
            qr_code_url: '',
            is_qrcode: false,
            is_show: false,
            is_load_show: false,
            bgColor: '#f7f7f7',
            isRequest: true, //防止数据重复加载
            template_message: [],
            recommend_list: []
        }
    },
    methods: {
        getList() {
            this.isRequest = false;
            this.$request({
                url: this.$api.order.list,
                data: {
                    status: this.currentIndex,
                    keyword: this.search ? this.search.keyword : '',
                    dateArr: this.search ? JSON.stringify(this.search.dateArr) : JSON.stringify([]),
                    page: this.page,
                }
            }).then(response => {
                let { code, data, msg } = response;
                this.$hideLoading();
                this.is_load_show = false;
                this.is_show = true;
                if (code === 0) {
                    let { list, pagination } = data;
                    if (this.page !== 1) {
                        this.orders = this.orders.concat(list);
                    } else {
                        this.orders = list;
                    }
                    this.page = list.length ? this.page + 1 : this.page;
                    this.pagination = pagination;
                    this.template_message = data.template_message;
                } else {
                    uni.showModal({
                        title: '',
                        content: msg,
                        showCancel: false,
                    });
                }
                this.isRequest = true;
            }).catch(() => {
                this.is_load_show = false;
                this.$hideLoading();
            });
        },
        loadRecommend() {
            this.$request({
                url: this.$api.goods.new_recommend,
                data: {
                    type: 'order_pay'
                }
            }).then(response => {
                if (response.code === 0) {
                    this.recommend_list = response.data.list;
                }
            });
        },
        clickTab(params) {
            if (this.isRequest) {
                this.page = 1;
                this.currentIndex = params.currentTarget.dataset.id;
                this.is_show = false;
                this.$showLoading();
                this.getList();
            }
        },
        getPageUrl: function(id, sign) {
            if (sign === 'community') {
                return `/plugins/community/order-detail/order-detail?id=${id}&is_user=1`
            } else if (this.currentIndex == 5) {
                return `/pages/order/refund-detail/refund-detail?id=${id}&sign=${sign}`
            } else {
                return `/pages/order/order-detail/order-detail?id=${id}&sign=${sign}`
            }
        },
        // 确认收货
        confirm(item) {
            let self = this;
            uni.showModal({
                title: '提示',
                content: '是否确认收货?',
                success: function(res) {
                    if (res.confirm) {
                        uni.showLoading({ title: '确认收货中' });
                        self.$request({
                            url: self.$api.order.confirm,
                            data: {
                                id: item.id
                            }
                        }).then(response => {
                            uni.hideLoading();
                            if (response.code === 0) {
                                uni.redirectTo({
                                    url: '/pages/order/index/index?status=' + 4
                                });
                            } else {
                                uni.showModal({
                                    title: '',
                                    content: response.msg,
                                    showCancel: false,
                                });
                            }
                        }).catch(() => {
                            uni.hideLoading()
                        });
                    }
                }
            });
        },
        // 取消
        cancel(e) {
            let self = this;
            uni.showModal({
                title: '提示',
                content: '是否取消订单？',
                success: function(res) {
                    if (res.confirm) {
                        uni.showLoading({ title: '取消中' });
                        self.$request({
                            url: self.$api.order.cancel,
                            data: {
                                id: e.id
                            }
                        }).then(response => {
                            uni.hideLoading();
                            if (response.code == 0) {
                                uni.redirectTo({
                                    url: '/pages/order/index/index?status=' + self.currentIndex
                                })
                            } else {
                                uni.showModal({
                                    title: '',
                                    content: response.msg,
                                    showCancel: false,
                                });
                            }
                        }).catch(() => {
                            uni.hideLoading();
                        });
                    }
                }
            });
        },
        // 物流信息
        logistics(orderDetail) {
            if (orderDetail.is_send == 1 && orderDetail.detailExpress.length == 0) {
                // 兼容
                let [id, express, express_no, customer_name, cover_pic] = [orderDetail.id, orderDetail.express, orderDetail.express_no, orderDetail.customer_name, orderDetail.detail[0].goods_info.pic_url];
                uni.navigateTo({
                    url: `/pages/order/express-detail/express-detail?id=${id}&express=${express}&express_no=${express_no}&customer_name=${customer_name}&cover_pic=${cover_pic}`
                })
            } else if (orderDetail.is_send == 1 && orderDetail.detailExpress.length == 1 && orderDetail.send_type != 2) {
                let express = orderDetail.detailExpress[0].express;
                let express_no = orderDetail.detailExpress[0].express_no;
                let customer_name = orderDetail.detailExpress[0].customer_name;
                let cover_pic = orderDetail.detailExpress[0].expressRelation[0].orderDetail.goods_info.goods_attr.cover_pic;
                uni.navigateTo({
                    url: `/pages/order/express-detail/express-detail?express=` + express + `&customer_name=` + customer_name + `&express_no=` + express_no + `&cover_pic=` + cover_pic
                })
            } else if (orderDetail.detailExpress.length >= 1) {
                uni.navigateTo({
                    url: '/pages/order/express-list/express-list?order_id=' + orderDetail.id
                });
            }
        },
        // 订单支付
        orderPay(e) {
            let _this = this;
            _this.$showLoading();
            _this.$request({
                url: _this.$api.order.list_pay_data,
                data: {
                    id: e.id
                }
            }).then(response => {
                _this.$hideLoading();
                if (response.code === 0) {
                    _this.$payment.pay(response.data.id).then(() => {
                        // 支付成功
                        uni.redirectTo({
                            url: '/pages/order/index/index?status=2'
                        })
                    }).catch(e => {
                        // 支付失败
                        uni.showModal({
                            title: '',
                            content: e.errMsg,
                            showCancel: false
                        })
                    })
                }
            }).catch(() => {
                _this.$hideLoading();
            });
        },
        // 订单评价
        appraise(e) {
            uni.navigateTo({
                url: `/pages/order/appraise/appraise?id=${e.id}`
            })
        },
        getClerkCode(e) {
            let self = this;
            self.$showLoading();
            self.$request({
                url: self.$api.order.clerk_qr_code,
                data: {
                    id: e.id
                }
            }).then(response => {
                self.$hideLoading();
                if (response.code === 0) {
                    self.qr_code_url = response.data.file_path;
                    self.is_qrcode = true;
                } else {
                    uni.showModal({
                        title: '',
                        content: response.msg,
                        showCancel: false,
                    });
                }
            }).catch(() => {
                self.$hideLoading();
            });
        },
        closeQrcode() {
            this.is_qrcode = false;
        },
        toSearch() {
            uni.navigateTo({
                url: `/pages/order/search/search`
            })
        },
        isShowExpressButton: function(order) {
            if (order.is_send) {
                if (order.detailExpress.length == 1 && order.detailExpress[0].send_type == 2 && order.send_type == 0) {
                    return false;
                }

                if (order.is_confirm == 0) {
                    return true;
                }
            }

            return false;
        }
    },
    onLoad(options) { this.$commonLoad.onload(options);
        this.currentIndex = options.status ? options.status : this.currentIndex;
        this.loadRecommend();
        this.$storage.removeStorage({key: 'search'});
    },

    onReachBottom() {
        this.is_load_show = true;
        this.getList();
    },
    onShow() {
        let self = this;
        setTimeout(function() {
            self.$storage.getStorage({
                key: 'search',
                success(res) {
                    self.search = res.data;
                    let interval = setInterval(function() {
                        if (self.isRequest) {
                            self.page = 1;
                            self.$showLoading();
                            self.getList();
                            self.$store.dispatch('gConfig/setTabBarBoolean', self.tabBarNavs.navs);
                        }
                        clearInterval(interval)
                    }, 300);
                },
                fail() {
                    let interval = setInterval(function() {
                        if (self.isRequest) {
                            self.page = 1;
                            self.$showLoading();
                            self.getList();
                            self.$store.dispatch('gConfig/setTabBarBoolean', self.tabBarNavs.navs);
                        }
                        clearInterval(interval)
                    }, 300);
                }
            });
        }, 0)
    },
    computed: {
        ...mapGetters('mallConfig', {
            tabBarNavs: 'getNavBar',
            getTheme: 'getTheme',
        })
    },
    components: {
        // #ifdef H5
        bdH5Back,
        // #endif
        'app-tab-nav': appTabNav,
        'app-order-goods-info': appOrderGoodsInfo,
        'app-related-suggestion-product': appRelatedSuggestionProduct,
        'app-no-goods': appNoGoods,
    },
}
</script>
<style scoped lang="scss">
.search-area {
    position: fixed;
    z-index: 3;
    top: 0;
    left: 0;
    right: 0;
    height: #{88rpx};
    line-height: #{88rpx};
    width: 100%;
    background-color: #efeff4;
    padding: #{12rpx} #{24rpx};
    // #ifdef H5
    padding-left: #{100rpx};
    // #endif
    .search {
        height: #{64rpx};
        line-height: #{64rpx};
        border-radius: #{32rpx};
        background-color: #fff;
        color: #b2b2b2;
        font-size:#{26rpx};

        &.be-search {
            color: #353535;
            padding-left: 32rpx;

            .icon-search {
                margin-right: 10rpx;
            }
        }

        .icon-search {
            height: #{24rpx};
            width: #{24rpx};
            margin-top: #{20rpx};

            &+text {
                color: #b2b2b2;
                margin:0 #{8rpx};
            }
        }
    }
}

.search-placeholder {
    width: 100%;
    height: #{88rpx};
}

.order-box {
    width: 100%;
    height: 100%;
}

.title-box {
    height: 80#{rpx};
    width: 100%;
    position: fixed;
    border-bottom: 1#{rpx} solid $uni-weak-color-one;
    top: 0;
    background: #fff;
    z-index: 1;
}

.no-list {
    margin-top: #{120upx};
}

.not-order-box {
    height: calc(100vh - 80#{rpx});
    color: $uni-general-color-two;
}

.order-item-box {
    background: #fff;
    padding: 0 24#{rpx};
    margin: 0 24#{rpx};
    margin-bottom: 24#{rpx};
    border-radius: 16#{rpx};
    font-size: $uni-font-size-general-two;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.06);
}

.order-item-box .view-1 {
    width: 100%;
    font-size: $uni-font-size-weak-one;
    color: $uni-important-color-black;
    margin: 32#{rpx} 0;
}

.order-item-box .view-2 {}

.order-item-box .view-3 {
    font-size: $uni-font-size-import-two;
}

.order-item-box .view-3 .btn {
    margin-left: 15#{rpx};
}

.price-count-box {
    margin: 28#{rpx} 0;
}

.price-label {
    margin-right: 5#{rpx};
    font-size: $uni-font-size-weak-one;
    color: $uni-general-color-two;
}

.price-color {
    color: $uni-important-color-black;
}

.price-express {
    font-size: $uni-font-size-weak-one;
    color: $uni-general-color-two;
}

.success-color {
    color: $uni-important-color-black;
}

.error-color {
    color: $uni-important-color-red;
}

.qrcode-box {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
}

.qrcode-box .item {
    position: absolute;
    top: 25%;
    width: 562#{rpx};
    height: 562#{rpx};
    background: #fff;
    left: 94#{rpx};
    z-index: 999;
    border-radius: 15#{rpx};
}

.qrcode-box .img {
    margin-top: 30#{rpx};
    width: 375#{rpx};
    height: 375#{rpx};
}

.qrcode-box .item .remove {
    position: absolute;
    top: 0;
    right: 0;
    width: 50#{rpx};
    height: 50#{rpx};
    margin: 15#{rpx};
    padding: #{7rpx}
}

.order-btn {
    display: inline-block;
    line-height: 2.3;
    font-size: 26#{rpx};
    padding: 0 30#{rpx};
    border: 1#{rpx} solid $uni-weak-color-one;
    border-radius: 30#{rpx};
    margin-left: 16#{rpx};
}

.action-button-box {
    margin-bottom: 24#{rpx};
}


.action-box-view {
    width: 100%;
}
</style>