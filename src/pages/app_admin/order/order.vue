<template>
    <app-layout>
        <!-- #ifdef H5 -->
        <bd-h5-back v-if="!search" :iconStyle="2"></bd-h5-back>
        <!-- #endif -->
        <!-- 订单切换 -->
        <view v-if="!search" class="tab-info">
            <view class='main-center tab'>
                <view @click="tabStatus(1)" :class="['tab-item','tab-left',`${status==1?'active': ''}`]">普通订单</view>
                <view @click="tabStatus(2)" :class="['tab-item','tab-right',`${status==2?'active': ''}`]">维权订单</view>
            </view>
        </view>
        <!-- 搜索界面 -->
        <view v-if="search" class="search-item main-between cross-center">
            <view class="search-input">
                <image class="search-icon" src='/static/image/icon/icon-search.png'></image>
                <input :focus="!msg" @confirm='searchMethod' confirm-type='search' v-model='keyword' placeholder-style='color:#999999;font-size:13px;' @blur="getFocus=false" @focus="getFocus=true" placeholder='请输入订单号/商品名称/收货人姓名搜索' />
                <image v-if="getFocus && keyword.length > 0" @click.stop="clearSearch" class="search-clear" src="../image/clear.png"></image>
            </view>
            <view @click="cancelSeacrch">取消</view>
        </view>
        <view v-if="!searchResult && search && list.length === 0" class="search-history">
            <view v-if="candidate.length !== 0" class='main-between search-title'>
                <view>历史搜索</view>
                <view @click="clear">
                    <image class="delete-icon" src="/static/image/icon/delete.png"></image>
                </view>
            </view>
            <view class='flex-wrap candidate-list'>
                <view @click="keywordSearch(item)" class="keyword-item box-grow-0" v-for="item in candidate" :key="item">
                    <text class="t-omit">{{item}}</text>
                </view>
            </view>
        </view>
        <!-- 搜索框 -->
        <view v-if="!search" class="search-area main-between cross-center">
            <view class="search main-center" @click="toSearch">
                <image class="icon-search" src="/static/image/icon/icon-search.png"></image>
                <text>搜索</text>
            </view>
            <view class="choose" @click='toTime'>
                <text v-if="time == 0">汇总</text>
                <text v-else-if="time == 1">今日</text>
                <text v-else-if="time == 2">昨日</text>
                <text v-else-if="time == 3">7日</text>
                <text v-else>自定义</text>
                <image src='./../image/open.png'></image>
            </view>
        </view>
        <!-- 普通订单tab栏 -->
        <view v-if="!search && status==1" class="main-between navs-info">
            <view @click="tab('-1')" class="box-grow-1 main-center cross-center navs">
                <text :class="[`${num=='-1'?'active':'nav-text'}`]">全部</text>
            </view>
            <view @click="tab('0')" class="box-grow-1 main-center cross-center navs">
                <text :class="[`${num=='0'?'active':'nav-text'}`]">待付款</text>
            </view>
            <view @click="tab('1')" class="box-grow-1 main-center cross-center navs">
                <text :class="[`${num=='1'?'active':'nav-text'}`]">待发货</text>
            </view>
            <view @click="show=!show" v-if="active" class="box-grow-1 main-center navs more-navs">
                <text :class="[`${num==active.value?'active':'nav-text'}`]">{{active.name}}</text>
                <image src="./../image/more-active.png"></image>
            </view>
            <view @click="show=!show" v-if="!active" class="box-grow-1 main-center navs more-navs">
                <text class="nav-text">更多状态</text>
                <image src="./../image/more.png"></image>
            </view>
        </view>
        <!-- 售后订单tab栏 -->
        <view v-if="!search && status==2" class="main-between navs-info">
            <view @click="tab('-1')" class="box-grow-1 main-center cross-center navs">
                <text :class="[`${num=='-1'?'active':'nav-text'}`]">全部</text>
            </view>
            <view @click="tab('0')" class="box-grow-1 main-center cross-center navs">
                <text :class="[`${num=='0'?'active':'nav-text'}`]">待审核</text>
            </view>
            <view @click="tab('1')" class="box-grow-1 main-center cross-center navs">
                <text :class="[`${num=='1'?'active':'nav-text'}`]">待买家处理</text>
            </view>
            <view @click="tab('2')" class="box-grow-1 main-center cross-center navs">
                <text :class="[`${num=='2'?'active':'nav-text'}`]">待卖家处理</text>
            </view>
        </view>
        <!-- 更多隐藏tab栏 -->
        <view v-if="!search && show" class="more-menu">
            <view @click="chooseItem(item.value)" v-for="item in menu" :key="item.value">{{item.name}}</view>
        </view>
        <view v-if="!search" class="search-palce"></view>
        <!-- 订单信息 -->
        <view :class="search ? 'search-order' : ''">
            <view class="order-item" v-for="item in list" :key="item.id">
                <view @click="toDetail(item.id,status)">
                    <view class="main-between order-info" v-if="status ==1">
                        <view style="width: 80%">
                            <view>订单号 {{item.order_no}}</view>
                            <view v-if="item.seller_remark && item.seller_remark != null" class="remark-info">商家备注 {{item.seller_remark}}</view>
                        </view>
                        <!-- 订单右上角信息 -->
                        <view v-if="item.is_sale == 1">已完成</view>
                        <view v-else-if="item.cancel_status == 2">待退款</view>
                        <view v-else-if="item.is_send == 0 && item.is_pay == 1 && item.detailExpress && item.detailExpress.length > 0">部分发货</view>
                        <view v-else-if="item.is_pay == 0">待付款</view>
                        <view v-else-if="item.is_send == 0">待发货</view>
                        <view v-else-if="item.is_confirm == 0">待收货</view>
                        <view v-else-if="item.is_confirm == 1">已收货</view>
                    </view>
                    <view class="main-between order-info" v-if="status ==2">
                        <view>订单号 {{item.order_no}}</view>
                        <view class="status-txt">{{item.refund_status_cn}}</view>
                    </view>
                    <view class="dir-left-nowrap cross-center order-user" v-if="status ==1">
                        <view class="t-omit">{{item.name ? item.name : item.nickname}}</view>
                        <view class="t-omit">{{item.mobile}}</view>
                        <view v-if="item.mobile" @click.stop='toCall(item)' class="to-tel dir-left-nowrap cross-center">
                            <image src='./../image/tel.png'></image>
                            <text>联系收货人</text>
                        </view>
                    </view>
                    <view class="dir-left-nowrap cross-center order-user" v-if="status ==2">
                        <view class="t-omit">{{item.order.name}}</view>
                        <view class="t-omit">{{item.order.mobile}}</view>
                        <view v-if="item.order.mobile" @click.stop='toCall(item)' class="to-tel dir-left-nowrap cross-center">
                            <image src='./../image/tel.png'></image>
                            <text>联系收货人</text>
                        </view>
                    </view>
                    <view v-for="(goods, dIndex) in item.detail" class="goods" :key="goods.id">
                        <image class="goods-img" :src='goods.goods_info.goods_attr.pic_url ? goods.goods_info.goods_attr.pic_url : goods.goods_info.goods_attr.cover_pic'></image>
                        <view v-if="status ==2" class="goods-status">{{item.type == 3 ? '仅退款' : item.refund_type_text}}</view>
                        <view class='t-omit-two goods-name'>{{goods.goods_info.goods_attr.name}}</view>
                        <view class="goods-attr t-omit">
                            <text v-for="attr in goods.attr_list" :key="attr.attr_id">{{attr.attr_group_name}}:{{attr.attr_name}}</text>
                        </view>
                        <view class="goods-num">x{{goods.num}}</view>
                        <view class="goods-price">
                            <span v-if="item.plugin_data && item.plugin_data.exchange_list && item.plugin_data.exchange_list.length">{{item.plugin_data.exchange_list[dIndex].value}}{{item.plugin_data.price_name}}+</span>
                            ￥{{goods.total_price}}
                        </view>
                    </view>
                    <view class="dir-right-nowrap">
                        <view class="price-info">
                            <text class="other">合计</text>
                            <span v-if="status == 1">
                                <text v-if="item.plugin_data.exchange_count">{{item.plugin_data.exchange_count}}{{item.plugin_data.price_name}}+</text>
                                <text>￥{{item.total_pay_price}}</text>
                            </span>
                            <text v-if="status == 2">￥{{item.refund_price}}</text>
                            <text v-if="status == 1 && item.is_show_express === 1" class="other">(含运费￥{{item.express_price}})</text>
                        </view>
                    </view>
                </view>
                <view class="menu-button">
                    <order-menu @change="cancel" :address="address" @to="toRefundOrder" :status="status" @update="update" :num="num" :item="item"></order-menu>
                </view>
            </view>
        </view>
        <view class='no-tip' v-if="list.length === 0 && !loading">
            <image :src='adminImg.no_order'></image>
            <view>没有任何订单哦~</view>
        </view>
        <view v-if="!search" class="safe-area-inset-bottom">
            <view class="u-bottom-height"></view>
        </view>
        <view class="safe-area-inset-bottom u-bottom-fixed">
            <view :class="['main-between bottom-tab']">
                <view class="box-grow-1 tab-nav-item" @click="toRedirect('/pages/app_admin/index/index')">
                    <image class="tab-icon" src="./../image/index.png"></image>
                    <view>首页</view>
                </view>
                <view class="box-grow-1 tab-nav-item active" @click="reload">
                    <image class="tab-icon" src="./../image/order-active.png"></image>
                    <view>订单</view>
                </view>
                <view class="box-grow-1 tab-nav-item" @click="toRedirect('/pages/app_admin/goods/goods')">
                    <image class="tab-icon" src="./../image/goods.png"></image>
                    <view>商品</view>
                </view>
                <view class="box-grow-1 tab-nav-item" @click="toRedirect('/pages/app_admin/setting/setting')">
                    <image class="tab-icon" src="./../image/setting.png"></image>
                    <view>设置</view>
                </view>
            </view>
        </view>
        <app-time-screening :theme="theme" @click="toChoose" @cancel="cancel" v-if="chooseTime" :time="time" :start-date="date_start" :end-date="date_end"></app-time-screening>
    </app-layout>
</template>

<script>
    import appTimeScreening from "../../../components/page-component/app-time-screening/app-time-screening.vue";
    import orderMenu from "../components/order-menu.vue";
    // #ifdef H5
    import bdH5Back from "@/components/page-component/goods/bd-h5-back.vue";
    // #endif
    import { mapState } from "vuex";
    export default {
        data() {
            return {
                status: 1,
                num: '-1',
                getFocus: false,
                more_list: false,
                cityList: [],
                deliveryId: '0',
                delivery: '',
                addressId: '0',
                refund_price: 0,
                theme: {
                    color: '#446dfd'
                },
                page: 1,
                menu: [
                    {
                        name: '待收货',
                        value: '2'
                    },
                    {
                        name: '待退款',
                        value: '4'
                    },
                    {
                        name: '已收货',
                        value: '9'
                    },
                    {
                        name: '已完成',
                        value: '3'
                    }
                ],
                active: null,
                show: false,
                search: false,
                keyword: '',
                list: [],
                candidate: [],
                date_start: '',
                date_end: '',
                time: 0,
                inSearch: false,
                address: [],
                chooseTime: false,
                msg: false,
                searchResult: false,
                total: 0,
                about: '',
                iphone_x: false,
                loading: false
            }
        },
        components: {
            // #ifdef H5
            bdH5Back,
            // #endif
            "app-time-screening": appTimeScreening,
            "order-menu": orderMenu
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                adminImg: state => state.mallConfig.__wxapp_img.app_admin
            })
        },
        onReachBottom() {
            this.getMore();
        },
        methods: {
            cancel(e) {
                if(e && e.id) {
                    for(let i in this.list) {
                        if(this.list[i].id == e.id) {
                            this.list[i] = e;
                            this.$forceUpdate();
                        }
                    }
                }
                this.chooseTime = false;
            },
            toCall(e) {
                e.showMobile = true;
            },
            update(row) {
                if(row == 0) {
                    this.page = 1;
                    uni.showLoading({
                        mask: true,
                        title: '加载中...'
                    });
                    this.getList();
                }else {
                    for(let index in this.list) {
                        if(this.list[index].id == row.id) {
                            this.list[index] = row;
                            this.$forceUpdate();
                        }
                    }
                }
            },
            clearSearch() {
                this.keyword = '';
            },
            reload() {
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.page = 1;
                this.list = [];
                this.getList();
            },

            toDetail(order_id,status) {
                uni.navigateTo({
                    url: '/pages/app_admin/order-detail/order-detail?id='+order_id+'&status='+status
                })
            },
            toRedirect(url) {
                uni.redirectTo({
                    url: url
                })
            },
            // 切换类别
            tabStatus(e) {
                let that = this;
                that.status = e;
                that.active = null;
                that.list = [];
                that.date_start = '';
                that.date_end = '';
                that.keyword = '';
                that.time = 0;
                that.show = false;
                that.num = '-1';
                that.page = 1;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.getList();
            },
            toSearch() {
                this.search = true;
                this.list = [];
                this.searchResult = false;
                this.candidate = this.$storage.getStorageSync('keyword') ? this.$storage.getStorageSync('keyword') : [];
                this.inSearch = false;
            },
            keywordSearch(e) {
                this.keyword = e;
                this.searchResult = true;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.page = 1;
                this.getList();
            },
            // 清除搜索记录
            clear() {
                let that = this;
                this.$storage.removeStorageSync('keyword');
                that.candidate = [];
                uni.showToast({
                    title: '清理成功',
                    duration: 1000,
                    type: 'success',
                    mask: false
                });
            },
            // 搜索
            searchMethod() {
                let value = this.$storage.getStorageSync('keyword') ? this.$storage.getStorageSync('keyword') : [];
                if (this.keyword.length === 0) {
                    return
                } else if (value.length > 0) {
                    value.unshift(this.keyword)
                } else {
                    value = [this.keyword]
                }
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.page = 1;
                this.getList();
                value.forEach(function(row, index) {
                    if (value[0] == value[index] && index > 0) {
                        value.splice(index, 1);
                    }
                })
                this.$storage.setStorageSync('keyword', value);
                this.inSearch = true;
                this.searchResult = true;
            },
            // 取消搜索
            cancelSeacrch() {
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.search = false;
                this.keyword = '';
                this.page = 1;
                this.getList();
            },
            // 确认选择时间
            toChoose(res) {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.date_start = res.date_start;
                that.date_end = res.date_end;
                that.time = res.choose;
                that.page = 1;
                that.getList();
                that.chooseTime = false;
            },
            // 打开时间筛选
            toTime() {
                let that = this;
                that.chooseTime = !that.chooseTime;
                that.show = false;
            },
            // 选择更多状态
            chooseItem(e) {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.num = e;
                that.menu.forEach(function(row, index) {
                    if (row.value == that.num) {
                        that.active = row;
                    }
                })
                that.show = !that.show;
                that.page = 1;
                that.list = [];
                that.getList();
            },
            // 切换状态
            tab(e) {
                this.num = e;
                this.show = false;
                this.active = null;
                this.list = [];
                this.keyword = '';
                this.page = 1;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.getList();
            },
            getList() {
                let that = this;
                if(that.loading) {
                    return false
                }
                that.loading = true;
                that.about = '';
                let url;
                if (this.status == 1) {
                    url = that.$api.app_admin.order
                } else if (this.status == 2) {
                    url = that.$api.app_admin.refund
                }
                that.$request({
                    url: url,
                    data: {
                        status: that.num,
                        date_end: that.date_end,
                        date_start: that.date_start,
                        page: that.page,
                        keyword: that.keyword
                    }
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    that.loading = false;
                    if(response.code == 0) {
                        let list = response.data.list;
                        if (that.status == 2) {
                            let status = [];
                            list.forEach(function(row) {
                                row.showMobile = false;
                                row.detail = [row.detail];
                                status = row.status_cn.split(' ');
                                row.refund_status_cn = status[status.length - 1];
                            })
                            let address = response.data.address;
                            address.forEach((row) => {
                                row.address = row.address.replace(/"/g, '');
                                row.address = row.address.replace(/,/g, '');
                                row.address = row.address.replace('[', '');
                                row.address = row.address.replace(']', '');
                            })
                            that.address = address;
                        } else {
                            list.forEach(function(row) {
                                row.showMobile = false;
                                row.detail.forEach(function(res) {
                                    if (res.refund_status == 1 || res.refund_status == 2) {
                                        row.have_refund = 1;
                                    }
                                })
                            })
                        }
                        that.more_list = false;
                        if (list.length == response.data.pagination.pageSize) {
                            that.more_list = true;
                        }
                        if(that.page == 1) {
                            that.list = list;
                        }else {
                            that.list = that.list.concat(list);
                        }
                        that.page++;
                        that.$forceUpdate();
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.loading = false;
                    that.$hideLoading();
                    uni.hideLoading();
                });
            },
            toRefundOrder(e) {
                let that = this;
                that.list = [];
                that.more_list = false;
                that.keyword = e;
                that.status = 2;
                that.search = true;
                that.searchMethod();
            },
            getMore() {
                if (this.more_list && (this.searchResult && this.search) || !this.search) {
                    this.getList();
                }
            },
            toSendType() {
                let that = this;
                let para;
                if (that.sendType == 1 || that.detail.send_type == 2) {
                    uni.showLoading({
                        mask: true,
                        title: '加载中...'
                    });
                    para = {
                        is_express: 0,
                        words: '',
                        order_id: that.detail.id
                    };
                    if(that.detail.send_type == 2) {
                        para.man = that.delivery;
                    }
                    that.$request({
                        url: that.$api.app_admin.send,
                        data: para,
                        method: 'post'
                    }).then(response => {
                        uni.hideLoading();
                        if (response.code === 0) {
                            uni.showToast({
                                title: response.msg,
                                type: 'success',
                                mask: false,
                                duration: 2000
                            });
                            that.page = 1;
                            that.isSend = false;
                            that.sendType = 0;
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
                        uni.showToast({
                            title: response,
                            icon: 'none',
                            duration: 1000
                        });
                    });
                }
            },
            look(e) {
                uni.previewImage({
                    current: e, // 当前显示图片的http链接
                    urls: [e] // 需要预览的图片http链接列表
                })
            },
            lookAbout(e) {
                this.detail = e;
                this.isReason = true;
            },
            toConfirm(e) {
                this.detail = e;
                this.confirmOrder = !this.confirmOrder;
            },
            toRefund(e) {
                this.detail = e;
                this.refund_price = e.refund_price;
                this.isRefund = !this.isRefund;
            },
            agree() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '处理中...'
                });
                if (that.detail.refund_price > 0) {
                    that.$request({
                        url: that.$api.app_admin.refund_handle,
                        data: {
                            order_refund_id: that.detail.id,
                            type: that.detail.type,
                            is_agree: 1,
                            refund_price: that.refund_price,
                            merchant_remark: that.about
                        },
                        method: 'post'
                    }).then(response => {
                        uni.hideLoading();
                        if (response.code === 0) {
                            uni.showModal({
                                title: '提示',
                                content: response.msg,
                                showCancel: false,
                                success: function (res) {
                                    if (res.confirm) {
                                        that.notRefund = false;
                                        that.openAddress = false;
                                        that.isRefund = false;
                                        that.addressId = 0;
                                        that.page = 1;
                                        uni.showLoading({
                                            mask: true,
                                            title: '加载中...'
                                        });
                                        that.getList();
                                    }
                                }
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
                } else {
                    uni.showToast({
                        title: '退款金额需大于零',
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            refundHandle(type,detail,cancel) {
                if (cancel == 1) {
                    this.cancelRefund = true;
                }
                if (type == 1) {
                    if(detail.type == 3) {
                        this.refundOnly = true;
                        this.detail = detail;
                    }else if(detail.order.send_type != 0){
                        this.cityRefund = true;
                        this.detail = detail;
                    }else {
                        if (this.address.length == 0) {
                            this.noAddress = true;
                        } else {
                            this.detail = detail;
                            this.openAddress = true;
                        }
                    }
                } else if (type == 2) {
                    this.detail = detail;
                    this.notRefund = true;
                }
            },

            toAgreeCancel(e) {
                this.detail = e;
                this.isReason = !this.isReason;
                this.noRefund = false;
            },
            decline(type) {
                let that = this;
                let para = {
                    order_refund_id: that.detail.id,
                    type: that.detail.type,
                    is_agree: type != 0 ? 1 : 0,
                    refund_price: that.detail.refund_price,
                    merchant_remark: that.about
                }
                if (type == 1) {
                    if (that.addressId < 1) {
                        uni.showToast({
                            title: '请选择地址',
                            icon: 'none',
                            duration: 1000
                        });
                        return false;
                    }else {
                        para.address_id = that.addressId
                    }
                }
                if(type == 4) {
                    para.refund = 1
                }
                if (that.cancelRefund) {
                    type = 2;
                    para.is_agree = 2
                }
                uni.showLoading({
                    mask: true,
                    title: '处理中...'
                });
                that.$request({
                    url: that.$api.app_admin.refund_handle,
                    data: para,
                    method: 'post'
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        uni.showModal({
                            title: '提示',
                            content: response.msg,
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    that.page = 1;
                                    that.notRefund = false;
                                    that.cancelOrder = false;
                                    that.openAddress = false;
                                    that.refundOnly = false;
                                    that.cityRefund = false;
                                    that.addressId = 0;
                                    that.getList();
                                }
                            }
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
            },
            chooseAddress(e) {
                if (this.addressId == e) {
                    this.addressId = ''
                }else {
                    this.addressId = e
                }
            },
            chooseDelivery(e) {
                if (this.getDeliveryId == e.id) {
                    this.deliveryId = ''
                }else {
                    this.deliveryId = e.id
                    this.delivery = "(" + e.id + ")" + e.name;
                }
            },
            noCancel() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '处理中...'
                });
                that.$request({
                    url: that.$api.app_admin.cancel,
                    data: {
                        status: 2,
                        remark: that.about,
                        order_id: that.detail.id
                    },
                    method: 'post'
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        uni.showToast({
                            title: response.msg,
                            type: 'success',
                            mask: false,
                            duration: 2000
                        });
                        that.page = 1;
                        that.noRefund = false;
                        that.isReason = false;
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
                    uni.showToast({
                        title: response,
                        icon: 'none',
                        duration: 1000
                    });
                });
            },
            beNotRefund(e) {
                this.detail = e;
                this.isReason = !this.isReason
                this.noRefund = !this.noRefund;
            }
        },
        onShow: function() {
            this.page = 1;
            this.getList();
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.status = 1;
            that.num = '-1';
            let myDate = new Date();
            // 今天
            let year = myDate.getFullYear();
            let month = myDate.getMonth() + 1;
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            let now = myDate.getDate();
            that.today = year + "-" + month + "-" + now;
            let timestamp = Date.parse(new Date());
            // 昨天
            let yesterTime = (timestamp / 1000 - 24 * 60 * 60) * 1000;
            let yesterDate = new Date(yesterTime)
            let yester_year = yesterDate.getFullYear();
            let yester_month = yesterDate.getMonth() + 1;
            if (yester_month >= 1 && yester_month <= 9) {
                yester_month = "0" + yester_month;
            }
            let yester_now = yesterDate.getDate();
            that.yesterday = yester_year + "-" + yester_month + "-" + yester_now;
            // 7天
            let weekTime = (timestamp / 1000 - 24 * 60 * 60 * 7) * 1000;
            let weekDate = new Date(weekTime)
            let week_year = weekDate.getFullYear();
            let week_month = weekDate.getMonth() + 1;
            if (week_month >= 1 && week_month <= 9) {
                week_month = "0" + week_month;
            }
            let week_now = weekDate.getDate();
            that.weekday = week_year + "-" + week_month + "-" + week_now;

            that.$request({
                url: that.$api.app_admin.delivery
            }).then(response=>{
                if(response.code === 0) {
                    this.cityList = response.data.list;
                    this.deliveryId = response.data.list[0].id;
                    this.delivery = "(" + response.data.list[0].id + ")" + response.data.list[0].name
                }else {
                    uni.showToast({
                        title: response.msg,
                        icon: 'none',
                        duration: 1000
                    });
                }
            }).catch(response => {
                uni.hideLoading();
            });
            if(options.msg) {
                that.msg = true;
            }
            if(options.status > -1) {
                that.num = options.status.toString();
            }
            if(options.refund > 0) {
                that.status = 2
            }
            if (options.no) {
                if (options.no.slice(0, 2) === "RE") {
                    that.status = 2;
                }
                that.search = true;
                that.inSearch = true;
                that.keyword = options.no;
                this.getList();
            }
        }
    }
</script>

<style scoped lang="scss">
    .search-order {
        padding: #{96rpx} 0 #{120rpx};
    }
    .no-tip {
        position: fixed;
        top: #{400rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
        color: #666666;
        font-size: #{24rpx};
        width: #{240rpx};
        text-align: center;
        image {
            height: #{240rpx};
            width: #{240rpx};
            margin-bottom: #{20rpx};
        }
    }
    .tab {
        margin: #{24rpx} auto;
        width: #{320rpx};
        height: #{56rpx};
    }

    .bottom-tab {
        width: 100%;
        height: #{96rpx};
        background-color: #fff;
        font-size: #{20rpx};
        color: #9096ad;
        padding-top: #{14rpx};

    }

    .u-bottom-fixed {
        z-index: 999;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #ffffff;
    }
    .tab-nav-item {
        text-align: center;
        &.active {
            color: #446dfd;
        }
        view {
            margin-top: #{-5rpx};
        }
    }

    .tab-icon {
        height: #{48rpx};
        width: #{48rpx};
        display: inline-block;
    }

    .tab-info {
        background-color: #fff;
        position: fixed;
        z-index: 2;
        top: 0;
        left: 0;
        right: 0;
        height: #{104rpx};
    }

    .tab-item {
        width: #{160rpx};
        text-align: center;
        height: #{56rpx};
        line-height: #{54rpx};
        background-color: #fff;
        color: #666;
        font-size: #{24rpx};
        display: block;
        &.tab-left {
            border-top-left-radius: #{28rpx};
            border-bottom-left-radius: #{28rpx};
            border: #{2rpx} solid #446dfd;
            border-right: 0;
        }

        &.tab-right {
            border-top-right-radius: #{28rpx};
            border-bottom-right-radius: #{28rpx};
            border: #{2rpx} solid #446dfd;
            border-left: 0;
        }

        &.active {
            background-color: #446dfd;
            color: #fff;
        }
    }

    .search-area {
        position: fixed;
        z-index: 3;
        top: #{104rpx};
        left: 0;
        right: 0;
        height: #{88rpx};
        line-height: #{88rpx};
        background-color: #efeff4;
        padding: 0 #{48rpx} 0 #{24rpx};
    }

    .search {
        height: #{56rpx};
        line-height: #{56rpx};
        border-radius: #{28rpx};
        background-color: #fff;
        color: #b2b2b2;
        width: #{528rpx};
        text-align: center;
    }

    .choose {
        color: #446dfd;
        font-size: #{26rpx};
        image {
            width: #{22rpx};
            height: #{12rpx};
            margin-left: #{12rpx};
        }
    }

    .navs-info {
        background-color: #fff;
        border-bottom: #{1rpx} solid #e2e2e2;
        position: fixed;
        z-index: 2;
        top: #{182rpx};
        left: 0;
        right: 0;
        padding-top: #{10rpx};
    }

    .navs {
        height: #{100rpx};
        font-size: #{28rpx};
        color: #666;
        text-align: center;
        position: relative;
        &.more-navs {
            line-height: #{100rpx};
        }
        .active {
            color: #446dfd;
            display: inline-block;
            height: #{100rpx};
            line-height: #{102rpx};
            border-bottom: #{2rpx} solid #446dfd;
        }
        image {
            height: #{16rpx};
            width: #{16rpx};
            margin-left: #{16rpx};
            display: block;
            float: right;
            margin-top: #{42rpx};
        }
    }

    .order-item {
        background-color: #fff;
        padding: #{24rpx};
        margin: #{20rpx} #{24rpx} 0;
        border-radius: #{16rpx};
        display: block;
    }

    .order-info {
        font-size: #{24rpx};
        color: #353535;
        margin-bottom: #{24rpx};
        .remark-info {
            margin-top: #{8rpx};
        }
    }

    .order-user {
        height: #{72rpx};
        background-color: #f7f7f7;
        padding-left: #{28rpx};
        font-size: #{24rpx};
        color: #353535;
        .t-omit {
            max-width: #{200rpx};
        }
        view:first-of-type {
            margin-right: #{32rpx};
        }
    }

    .to-tel {
        color: #446dfd;
        font-size: #{24rpx};
        margin-left: #{20rpx};
        height: #{72rpx};
        line-height: #{72rpx};
        image {
            height: 14px;
            width: 14px;
            margin-right: #{12rpx};
            display: inline-block;
        }
    }

    .goods {
        height: #{160rpx};
        margin-top: #{24rpx};
        position: relative;
        font-size: #{24rpx};
        color: #353535;
        margin-bottom: #{24rpx};
        .goods-status {
            height: #{40rpx};
            line-height: #{40rpx};
            color: #fff;
            width: #{160rpx};
            position: absolute;
            bottom: 0;
            left: 0;
            text-align: center;
            background-color: #446dfd;
            border-bottom-left-radius: #{4rpx};
            border-bottom-right-radius: #{4rpx};
        }
        .goods-img {
            height: #{160rpx};
            width: #{160rpx};
            float: left;
            margin-right: #{20rpx};
            border-radius: #{4rpx};
        }
        .goods-attr {
            font-size: #{24rpx};
            color: #999;
            position: absolute;
            top: #{78rpx};
            left: #{180rpx};
            width: 70%;
            text {
                margin-right: #{20rpx};
            }
        }
        .goods-num {
            font-size: #{24rpx};
            color: #999;
            position: absolute;
            top: #{126rpx};
            left: #{180rpx};
        }
        .goods-price {
            font-size: #{24rpx};
            color: #353535;
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }

    .price-info {
        font-size: #{28rpx};
        color: #353535;
        .other {
            font-size: #{24rpx};
            color: #999;
        }
    }

    .more-menu {
        position: fixed;
        z-index: 5;
        top: #{270rpx};
        padding-top: #{22rpx};
        right: #{22rpx};
        width: #{196rpx};
        background-color: #fff;
        font-size: #{28rpx};
        color: #666;
        border-bottom: #{1rpx} solid #e0e0e0;
        view {
            width: #{196rpx};
            height: #{68rpx};
            line-height: #{68rpx};
            text-align: center;
            border-left: #{1rpx} solid #e0e0e0;
            border-right: #{1rpx} solid #e0e0e0;
        }
    }

    .more-menu.go-out, .search-history.go-out {
        display: none;
    }

    .search-item {
        height: #{96rpx};
        background-color: #efeff4;
        padding: 0 #{24rpx};
        font-size: #{28rpx};
        color: #00c203;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 21;
    }

    .search-input {
        height: #{64rpx};
        position: relative;
        width: #{620rpx};
        .search-clear {
            position: absolute;
            right: #{15rpx};
            top: #{21rpx};
            width: #{30rpx};
            height: #{30rpx};
            z-index: 100;
        }
        .search-icon {
            height: #{22rpx};
            width: #{22rpx};
            position: absolute;
            top: #{21rpx};
            left: #{28rpx};
            z-index: 10;
        }
        input {
            padding-left: #{62rpx};
            padding-right: #{70rpx};
            background-color: #fff;
            border-radius: #{32rpx};
            height: #{64rpx};
            font-size: #{26rpx};
            color: #353535;
        }
    }

    .search-history {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        background-color: #fff;
        padding: #{120rpx} #{4rpx} 0;
        font-size: #{28rpx};
        color: #666;
        z-index: 20;
    }

    .search-title {
        padding: 0 #{20rpx};
        margin-bottom: #{24rpx};
    }

    .keyword-item {
        height: #{64rpx};
        line-height: #{64rpx};
        padding: 0 #{20rpx};
        background-color: #f7f7f7;
        color: #333;
        border-radius: #{32rpx};
        font-size: #{28rpx};
        margin-left: #{20rpx};
        margin-bottom: #{20rpx};
        max-width: 90%;
    }

    .bg {
        background-color: rgba(0, 0, 0, 0.3);
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 100;
    }

    .dialog {
        width: #{620rpx};
        border-radius: #{16rpx};
        margin: 0 auto;
        background-color: #fff;
        z-index: 20;
        &.get-top {
            margin-top: #{-60rpx};
        }
    }

    .remark-input {
        padding: 0 #{32rpx};
        height: #{80rpx};
        margin-bottom: #{32rpx};
        color: #353535;
        input {
            border-radius: #{16rpx};
            background-color: #F7F7F7;
            height: #{80rpx};
            line-height: #{80rpx};
            padding: 0 #{24rpx};
        }
    }

    .dialog-title {
        font-size: #{32rpx};
        color: #353535;
        width: #{620rpx};
        margin: #{32rpx} auto #{40rpx};
        text-align: center;
    }

    .dialog-choose-item {
        width: #{170rpx};
        height: #{68rpx};
        line-height: #{68rpx};
        text-align: center;
        border-radius: #{34rpx};
        border: #{2rpx} solid #ddd;
        color: #666;
        font-size: #{28rpx};
        margin-bottom: #{16rpx};
    }

    .send-item {
        width: #{180rpx};
        height: #{68rpx};
        line-height: #{66rpx};
        text-align: center;
        border-radius: #{34rpx};
        border: #{2rpx} solid #ddd;
        color: #666;
        background-color: #fff;
        font-size: #{28rpx};
        margin: 0 #{30rpx} #{36rpx};
    }

    .send-item.active {
        color: #fff;
        border: #{2rpx} solid #446dfd;
        background-color: #446dfd;
    }

    .dialog-choose-item.active {
        color: #446dfd;
        border: #{2rpx} solid #446dfd;
    }

    .btn-area {
        height: #{88rpx};
        position: relative;
        border-top: #{2rpx} solid #e2e2e2;
    }

    .btn-area.other-btn-area {
        margin-top: #{10rpx};
    }

    .btn-area .line {
        height: #{32rpx};
        width: #{1rpx};
        background-color: #e2e2e2;
        position: absolute;
        top: #{28rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
    }

    .submit-btn {
        height: #{88rpx};
        line-height: #{88rpx};
        font-size: #{32rpx};
        color: #666;
        width: #{310rpx};
        text-align: center;
    }

    .submit-btn.be-submit {
        color: #446dfd;
    }

    .textarea {
        height: #{252rpx};
        width: #{492rpx};
        padding: #{24rpx} #{32rpx};
        font-size: #{28rpx};
        border-radius: #{16rpx};
        border: #{2rpx} solid #e2e2e2;
        text-align: left;
        margin: #{32rpx} auto;
    }

    .change-price-item {
        position: relative;
        height: #{64rpx};
        line-height: #{64rpx};
        color: #353535;
        font-size: #{28rpx};
        margin-bottom: #{26rpx};
    }

    .change-price-item:first-of-type {
        margin-bottom: #{32rpx};
    }

    .change-price-item:last-of-type {
        margin: #{24rpx} 0 #{34rpx};
    }

    .label {
        height: #{64rpx};
        line-height: #{64rpx};
        text-align: right;
        width: #{178rpx};
    }

    .price-input {
        width: #{298rpx};
        height: #{64rpx};
        margin-left: #{24rpx};
        border-radius: #{32rpx};
        padding-left: #{62rpx};
        background-color: #f7f7f7;
    }

    .money {
        position: absolute;
        left: #{234rpx};
    }

    .reason {
        padding-left: #{32rpx};
        max-height: 600#{rpx};
        overflow: scroll;
        margin-bottom: 40#{rpx};
        &+textarea {
            height: #{186rpx};
            width: #{556rpx};
        }
    }

    .reason-title {
        font-size: #{28rpx};
        color: #999;
        margin-bottom: #{14rpx};
    }

    .reason-content {
        font-size: #{28rpx};
        color: #353535;
        width: #{556rpx};
        margin-bottom: #{20rpx};
        word-break: break-all;
        &.two-line {
            overflow: hidden;
            //#ifdef MP-ALIPAY
            height: #{64rpx};
            //#endif
            // #ifndef MP-ALIPAY
            height: #{76rpx};
            // #endif
            margin-bottom: #{10rpx};
        }
    }

    .reason-img {
        margin-bottom: #{14rpx};
    }

    .reason-img image {
        height: #{180rpx};
        width: #{180rpx};
        margin: 0 #{8rpx} #{8rpx} 0;
    }

    .add-list {
        margin-top: #{50rpx};
        max-height: #{388rpx};
        overflow: auto;
        padding: 0 #{36rpx};
    }

    .add-item {
        padding: #{32rpx} 0;
        margin-left: #{64rpx};
        position: relative;
        font-size: #{28rpx};
        color: #353535;
        border-bottom: #{1rpx} solid #e2e2e2;
    }

    .add-item.delivery-item {
        padding-left: #{64rpx};
        margin-left: 0;
    }

    .add-item:last-of-type {
        border-bottom: 0;
    }

    .add-item image {
        height: #{36rpx};
        width: #{36rpx};
        position: absolute;
        left: #{-66rpx};
        top: 50%;
        margin-top: #{-18rpx};
    }

    .add-item .add-active {
        position: absolute;
        left: #{-64rpx};
        top: 50%;
        margin-top: #{-18rpx};
    }

    .add-item .add-name {
        width: #{220rpx};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .add-item.delivery-item .add-name {
        width: #{400rpx};
    }

    .no-tip {
        position: fixed;
        top: #{400rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
        color: #666666;
        font-size: #{24rpx};
        width: #{240rpx};
        text-align: center;
    }

    .no-tip image {
        height: #{240rpx};
        width: #{240rpx};
        margin-bottom: #{20rpx};
    }

    .refund-price {
        width: #{160rpx};
        border: #{2rpx} solid #e2e2e2;
        border-radius: #{5rpx};
        font-size: #{32rpx};
        padding: 0 #{5rpx};
    }
    .u-bottom-height {
        height: 116upx;
    }

    .delete-icon {
        height: #{34rpx};
        width: #{28rpx};
    }

    .candidate-list {
        max-height: #{420rpx};
        overflow: hidden;
    }

    .icon-search {
        height: #{24rpx};
        width: #{24rpx};
        margin-top: #{16rpx};
        &+text {
            color:#b2b2b2;
            font-size:#{24rpx};
            margin:0 #{5rpx};
        }
    }

    .search-palce {
        height: #{292rpx};
    }

    .goods-name {
        padding-top: #{5rpx};
    }

    .menu-button {
        margin-top: #{24rpx};
    }
</style>