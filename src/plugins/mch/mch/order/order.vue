<template>
    <app-layout>
        <!-- #ifdef H5 -->
        <bd-h5-back v-if="!search" :iconStyle="2" :moreRank="true"></bd-h5-back>
        <!-- #endif -->
        <view v-if="!search" class="tab-info">
            <view class='main-center tab'>
                <view @click="tabStatus(1)" :class="['tab-item','tab-left',`${status==1?'active': ''}`]">订单列表</view>
                <view @click="tabStatus(2)" :class="['tab-item','tab-right',`${status==2?'active': ''}`]">售后订单</view>
            </view>
        </view>
        <view v-if="search" class="search-item main-between cross-center">
            <view class="search-input">
                <image src='/static/image/icon/icon-search.png'></image>
                <input :focus="!msg" @confirm='searchMethod' confirm-type='search' v-model='keyword' placeholder-style='color:#999999;font-size:13px;' placeholder='请输入订单号搜索'></input>
            </view>
            <view @click="cancelSeacrch">取消</view>
        </view>
        <view v-if="!searchResult && search" :class="['search-history', `${list.length == 0 ? '' : 'go-out'}`]">
            <view v-if="candidate.length != 0" class='main-between search-title'>
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
                <image src='./../../image/open.png'></image>
            </view>
        </view>
        <view v-if="!search && status==1" class="main-between navs-info">
            <view @click="tab(0)" class="box-grow-1 main-center cross-center navs">
                <text :class="[`${_num==0?'active':'nav-text'}`]">全部</text>
            </view>
            <view @click="tab(1)" class="box-grow-1 main-center cross-center navs">
                <text :class="[`${_num==1?'active':'nav-text'}`]">待付款</text>
            </view>
            <view @click="tab(2)" class="box-grow-1 main-center cross-center navs">
                <text :class="[`${_num==2?'active':'nav-text'}`]">待发货</text>
            </view>
            <view @click="show=!show" v-if="active" class="box-grow-1 main-center navs more-navs">
                <text :class="[`${_num==active.value?'active':'nav-text'}`]">{{active.name}}</text>
                <image src="./../../image/more-active.png"></image>
            </view>
            <view @click="show=!show" v-if="!active" class="box-grow-1 main-center navs more-navs">
                <text class="nav-text">更多状态</text>
                <image src="./../../image/more.png"></image>
            </view>
        </view>
        <view v-if="!search && status==2" class="main-between navs-info">
            <view @click="tab(0)" class="box-grow-1 main-center cross-center navs">
                <text :class="[`${_num==0?'active':'nav-text'}`]">全部</text>
            </view>
            <view @click="tab(1)" class="box-grow-1 main-center cross-center navs">
                <text :class="[`${_num==1?'active':'nav-text'}`]">待审核</text>
            </view>
            <view @click="tab(2)" class="box-grow-1 main-center cross-center navs">
                <text :class="[`${_num==2?'active':'nav-text'}`]">待买家处理</text>
            </view>
            <view @click="tab(3)" class="box-grow-1 main-center cross-center navs">
                <text :class="[`${_num==3?'active':'nav-text'}`]">待卖家处理</text>
            </view>
            <view @click="tab(4)" class="box-grow-1 main-center cross-center navs">
                <text :class="[`${_num==4?'active':'nav-text'}`]">已完成</text>
            </view>
        </view>
        <view v-if="!search && show" class="more-menu">
            <view @click="chooseItem(item.value)" v-for="item in menu" :key="item.value">{{item.name}}</view>
        </view>
        <view v-if="!search" class="search-palce"></view>
        <!-- 订单信息 -->
        <view>
            <view class="order-item" v-for="item in list" :key="item.id">
                <view @click="toDetail(item,status)">
                    <view class="main-between order-info" v-if="status ==1">
                        <view>订单号 {{item.order_no}}</view>
                        <view v-if="item.is_sale == 1">已完成</view>
                        <view v-else-if="item.cancel_status == 1">已取消</view>
                        <view v-else-if="item.cancel_status == 2">待退款</view>
                        <view v-else-if="item.is_pay == 0 && item.pay_type != 2">待付款</view>
                        <view v-else-if="item.is_send == 0">待发货</view>
                        <view v-else-if="item.is_confirm == 0">待收货</view>
                        <view v-else-if="item.is_confirm == 1">已收货</view>
                    </view>
                    <view class="main-between order-info" v-if="status ==2">
                        <view>订单号 {{item.order_no}}</view>
                        <view v-if="item.type == 1" class="status-txt">退货退款</view>
                        <view v-if="item.type == 2" class="status-txt">换货</view>
                        <view v-if="item.type == 3" class="status-txt">仅退款</view>
                    </view>
                    <view class="dir-left-nowrap cross-center order-user">
                        <view>{{status == 1 ? item.name : item.order.name}}</view>
                        <view>{{status == 1 ? item.mobile : item.order.mobile}}</view>
                        <view @click.stop='toCall(item)' class="to-tel">
                            <image src='./../../image/tel.png'></image>
                            <text>联系收货人</text>
                        </view>
                    </view>
                    <view v-for="goods in item.detail" class="goods" :key="goods.id">
                        <image class="goods-img" :src='goods.goods_info.pic_url'></image>
                        <view class='t-omit-two goods-name'>{{goods.goods_info.name}}</view>
                        <view class="goods-attr t-omit">
                            <text v-for="attr in goods.goods_info.attr_list" :key="attr.attr_id">{{attr.attr_group_name}}:{{attr.attr_name}}</text>
                        </view>
                        <view class="goods-num">x{{goods.num ? goods.num : goods.goods_info.num}}</view>
                        <view class="goods-price">￥{{goods.total_price ? goods.total_price : item.refund_price}}</view>
                    </view>
                    <view class="dir-right-nowrap">
                        <view class="price-info">
                            <text class="other">合计</text>
                            <text v-if="status == 1">￥{{item.total_pay_price}}</text>
                            <text v-if="status == 2">￥{{item.refund_price}}</text>
                            <text v-if="status == 1" class="other">(含运费￥{{item.express_price}})</text>
                        </view>
                    </view>
                </view>
                <view class="dir-right-nowrap menu-button" v-if="item">
                    <view @click.stop="toAgreeCancel(item)" v-if="item.cancel_status == 2" class="handle-btn other">同意</view>
                    <view @click.stop="beNotRefund(item)" v-if="item.cancel_status == 2" class="handle-btn">拒绝</view>
                    <view @click.stop="toChange(item)" v-if="item.cancel_status == 0 && item.is_pay == 0 && item.is_send == 0" class="handle-btn other">修改价格</view>
                    <view @click.stop="toSend(item)" v-if="item.have_refund != 1 && item.cancel_status == 0 && item.is_send == 1 && item.is_confirm == 0 && item.detailExpress.length > 0" class="handle-btn other">修改物流信息</view>
                    <view @click.stop="toSend(item)" v-if="item.cancel_status == 0 && item.is_send == 0 && item.is_pay == 1" class="handle-btn other">发货</view>
                    <view @click.stop="toSend(item)" v-else-if="item.cancel_status == 0 && item.is_send == 0 && item.pay_type == 2" class="handle-btn other">发货</view>
                    <view @click.stop="toRefundOrder(item.order_no)" v-if="item.have_refund == 1 && status == 1 && item.is_sale == 0" class="handle-btn">售后中</view>
                    <view @click.stop="toCancelorder(item)" v-if="item.is_send == 0 && item.cancel_status == 0" class="handle-btn">取消订单</view>
                    <view @click.stop="toRefund(item)" v-if="item.status == 2 && item.status_text == '待退款' && item.is_confirm == 1 && status == 2 && item.type != 2" class="handle-btn other">退款</view>
                    <view @click.stop="toConfirm(item)" v-if="item.status == 2 && item.is_send == 1 && item.is_confirm == 0 && status == 2 && item.type == 1" class="handle-btn other">确认收货</view>
                    <view @click.stop="toSend(item)" data-send="1" v-if="item.is_confirm == 0 && status == 2 && item.is_send == 1 && item.type == 2" class="handle-btn other">发货</view>
                    <view @click="toChangeAddress(item)" v-if="item.action_status && item.action_status.is_edit_address == 1" class="handle-btn">修改地址</view>
                    <view @click.stop="refundHandle(2,item,1)" v-if="item.status == 2 && status == 2 && item.is_refund == 0" :class="['handle-btn', `${_num == 2 || _num == -1?'other':''}`]">取消售后</view>
                    <view @click.stop="refundHandle(1,item)" v-if="item.status == 1 && status == 2" class="handle-btn other">同意</view>
                    <view @click.stop="refundHandle(2,item)" v-if="item.status == 1 && status == 2" class="handle-btn">拒绝</view>
                    <view @click.stop="lookAbout(item)" v-if=" status == 2" class="handle-btn">售后理由</view>
                </view>
            </view>
        </view>
        <view class='no-tip' v-if="list.length == 0">
            <image :src='adminImg.no_order'></image>
            <view>没有任何订单哦~</view>
        </view>
        <app-time-screening :theme="theme" @click="toChoose" @cancel="cancel" color="#ff4544" v-if="chooseTime" :time="time" :start-date="date_start" :end-date="date_end"></app-time-screening>
        <view class="bg cross-center" v-if="isRefund || noRefund || changePrice || cancelOrder || callPhone || isSend || notRefund || isReason || openAddress || noAddress || confirmOrder || beToSend">
            <!-- 到店自提未填发货地址的提示 -->
            <view class="dialog" v-if="beToSend">
                <view class="dialog-title">提示</view>
                <view class="main-center dir-top-nowrap cancel-tip" style="text-align: center">
                    <view>是否将配送方式改为快递配送</view>
                </view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='toChangeAddress'>确认</view>
                </view>
            </view>
            <!-- 退款 -->
            <view class="dialog" v-if="isRefund">
                <view class="dialog-title">退款</view>
                <view class="main-center refund-pay" v-if="status == 1">￥{{detail.total_pay_price}}</view>
                <view class="main-center cross-center refund-pay" v-if="status == 2">￥
                    <input class="refund-price" type='digit' v-model="refund_price"></input>
                </view>
                <view class="main-center refund-tip">是否确认退款给买家</view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" v-if="status == 1" @click='cancelSubmit(1)'>确认</view>
                    <view class="submit-btn be-submit" v-if="status == 2" @click='agree'>确认</view>
                </view>
            </view>
            <view class="dialog-bg" :style="{'display': `${noRefund || notRefund ? 'block' : 'none'}`}"></view>
            <!-- 拒绝退款 -->
            <view class="dialog" v-if="noRefund || notRefund">
                <view v-if="noRefund" class="dialog-title">拒绝取消</view>
                <view v-if="notRefund" class="dialog-title">拒绝售后</view>
                <textarea fixed class="textarea" v-model="about" placeholder="请输入拒绝理由" placeholder-style="color:#999999;font-size:14px" auto-focus />
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view v-if="noRefund" class="submit-btn be-submit" @click='noCancel'>确认</view>
                    <view v-if="notRefund" class="submit-btn be-submit" @click='decline(0)'>确认</view>
                </view>
            </view>
            <!-- 改价 -->
            <view class="dialog" v-if="changePrice">
                <view v-if="changePrice" class="dialog-title">修改价格</view>
                <view v-if="changePrice" class="dir-left-nowrap change-price-item">
                    <view class="label">商品总价</view>
                    <view class="money">￥</view>
                    <input fixed type="digit" class="price-input" @input="priceInput" :focus="changePrice?true:false" v-model='price'></input>
                </view>
                <view v-if="changePrice" class="dir-left-nowrap change-price-item">
                    <view class="label">运费</view>
                    <view class="money">￥</view>
                    <input fixed type="digit" class="price-input" @input="expressInput" focus v-model='express'></input>
                </view>
                <view v-if="changePrice" class="dir-left-nowrap change-price-item">
                    <view class="label">合计</view>
                    <view class="total-money">{{total}}</view>
                </view>
                <view v-if="changePrice" class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='submitChange'>确认</view>
                </view>
            </view>
            <!-- 取消订单 -->
            <view class="dialog" v-if="cancelOrder">
                <view class="main-center cancel-tip">确定取消该订单?</view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='cancelSubmit(2)'>确认</view>
                </view>
            </view>
            <!-- 售后确认收货 -->
            <view class="dialog" v-if="confirmOrder">
                <view class="main-center cancel-tip">是否确认收货?</view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='beConfirm'>确认</view>
                </view>
            </view>
            <!-- 提示 -->
            <view class="dialog" v-if="noAddress">
                <view class="main-center cancel-tip">请到商户后台添加退货地址</view>
                <view class="main-center btn-area">
                    <view class="submit-btn be-submit" @click='cancel'>确认</view>
                </view>
            </view>
            <!-- 打电话  -->
            <view class="dialog" v-if="callPhone">
                <view class="main-center cancel-tip">{{mobile}}</view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='call'>确认</view>
                </view>
            </view>
            <!-- 发货 -->
            <view class="dialog" v-if="isSend">
                <view class="dialog-title">选择发货方式</view>
                <view class="flex-wrap main-center send-type">
                    <view @click="sendType=0" :class="[`${sendType == 0 ? 'active':'' }`,'send-item']">快递配送</view>
                    <view @click="sendType=1" :class="[`${sendType == 1 ? 'active':'' }`,'send-item']">无需物流</view>
                </view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='toSendType'>确认</view>
                </view>
            </view>
            <!-- 理由 -->
            <view class="dialog" v-if="isReason">
                <view class="dialog-title">售后理由</view>
                <view class="reason">
                    <view class="reason-title">申请原因</view>
                    <view class="reason-content">{{detail.remark}}</view>
                    <view v-if="detail.pic_list.length > 0" class="reason-title">图片</view>
                    <view class="dir-left-wrap reason-img" v-if="detail.pic_list.length > 0">
                        <image @click='look(item)' v-for="(item, index) in detail.pic_list" :key="index" :src="item"></image>
                    </view>
                </view>
                <view class="main-center btn-area other-btn-area">
                    <view class="submit-btn be-submit" @click='cancel'>确认</view>
                </view>
            </view>
            <!-- 选地址 -->
            <view class="dialog" v-if="openAddress">
                <view class="dialog-title">选择退货地址</view>
                <view class="add-list">
                    <view class="add-item" v-for="item in address" :key="item.id">
                        <image v-if="item.id == addressId" @click='chooseAddress(item.id)' src="./../../image/apply-ok.png"></image>
                        <image v-else @click='chooseAddress(item.id)' src="./../../image/apply-er.png"></image>
                        <view @click='chooseAddress(item.id)' class="add-info">
                            <view class="main-between">
                                <view class="add-name">{{item.name}}</view>
                                <view>{{item.mobile}}</view>
                            </view>
                            <view>{{item.address}}{{item.address_detail}}</view>
                        </view>
                    </view>
                </view>
                <view class="main-center btn-area other-btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='decline(1)'>确认</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import appTimeScreening from "../../../../components/page-component/app-time-screening/app-time-screening.vue";
    // #ifdef H5
    import bdH5Back from "../../../../components/page-component/goods/bd-h5-back.vue";
    // #endif
    import { mapState } from "vuex";
    export default {
        data() {
            return {
                theme: {
                    color: '#ff4544'
                },
                mch_id: 0,
                cancelRefund: false,
                time_start: [],
                noAddress: false,
                status: '1',
                _num: '0',
                more_list: false,
                addressId: '0',
                refund_price: 0,
                page: 1,
                notRefund: false,
                openAddress: false,
                isReason: false,
                menu: [
                    {
                        name: '待收货',
                        value: '3'
                    },
                    {
                        name: '待处理',
                        value: '7'
                    },
                    {
                        name: '已取消',
                        value: '6'
                    },
                    {
                        name: '已完成',
                        value: '8'
                    }
                ],
                active: null,
                show: false,
                start: [],
                end: [],
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
                isRefund: false,
                noRefund: false,
                beToSend: false,
                cancelOrder: false,
                confirmOrder: false,
                detail: {},
                changePrice: false,
                callPhone: false,
                custom: false,
                mobile: '',
                isSend: false,
                sendType: 0,
                price: 0,
                express: 0,
                msg: false,
                first: false,
                searchResult: false,
                total: 0,
                about: '',
                actions: [{
                        name: '取消',
                        color: '#666666',
                    },
                    {
                        name: '去设置',
                        color: '#ff4544',
                        loading: false
                    }
                ]
            }
        },
        components: {
            // #ifdef H5
            bdH5Back,
            // #endif
            "app-time-screening": appTimeScreening
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                adminImg: state => state.mallConfig.__wxapp_img.mch,
            })
        },
        methods: {
            toDetail(item,status) {
                let id = item.order_id;
                if(status == 2) {
                    id = item.id
                }
                uni.navigateTo({
                    url: '/plugins/mch/mch/order-detail/order-detail?id='+id+'&status='+status+'&mch_id='+this.mch_id
                })
            },
            toRedirect(url) {
                uni.redirectTo({
                    url: url
                })
            },
            // 取消
            cancel() {
                this.about = '';
                this.isRefund = false;
                this.chooseTime = false;
                this.noRefund = false;
                this.changePrice = false;
                this.cancelOrder = false;
                this.confirmOrder = false;
                this.beToSend = false;
                this.callPhone = false;
                this.isSend = false;
                this.notRefund = false;
                this.openAddress = false;
                this.isReason = false;
                this.addressId = 0;
                this.noAddress = false;
            },
            toChangeAddress(item) {
                this.beToSend = false;
                let order_no = item.order_no ? item.order_no : this.detail.order_no
                uni.navigateTo({
                    url: '/plugins/mch/mch/change-add/change-add?mch_id='+this.mch_id+'&order_no='+order_no
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
                that._num = '0';
                if(e == 2) {
                    that._num = 0
                }
                that.page = 1;
                this.getList();
            },
            toCall(e) {
                if(this.status == 1) {
                    this.mobile = e.mobile;
                }else {
                    this.mobile = e.order.mobile;
                }
                this.callPhone = !this.callPhone;
            },
            beConfirm() {
                let that = this;
                that.$request({
                    url: that.$api.mch.shou_huo,
                    data: {
                        refund_order_id: that.detail.id,
                        mch_id: that.mch_id
                    },
                    method: 'post'
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        uni.showToast({
                            title: response.msg,
                            duration: 1000,
                            type: 'success',
                            mask: false
                        });
                        that.cancel();
                        setTimeout(v=>{
                            that.list = [];
                            that.page = 1;
                            uni.showLoading({
                                title: '加载中...'
                            });
                            that.getList();
                        },1000)
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
            call() {
                uni.makePhoneCall({
                    phoneNumber: this.mobile
                })
                this.callPhone = !this.callPhone;
            },
            toSearch() {
                this.search = true;
                this.list = [];
                this.searchResult = false;
                this.candidate = this.$storage.getStorageSync('mch_keyword') ? this.$storage.getStorageSync('mch_keyword') : [];
                this.inSearch = false;
            },
            keywordSearch(e) {
                this.keyword = e;
                this.searchResult = true;
                this.getList();
            },
            // 清除搜索记录
            clear() {
                let that = this;
                this.$storage.removeStorageSync('mch_keyword');
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
                let value = this.$storage.getStorageSync('mch_keyword') ? this.$storage.getStorageSync('mch_keyword') : [];
                if (this.keyword.length == 0) {
                    return
                } else if (value.length > 0) {
                    value.unshift(this.keyword)
                } else {
                    value = [this.keyword]
                }
                this.page = 1;
                this.list = [];
                this.getList();
                value.forEach(function(row, index) {
                    if (value[0] == value[index] && index > 0) {
                        value.splice(index, 1)
                    }
                })
                this.$storage.setStorageSync('mch_keyword', value);
                this.inSearch = true;
                this.searchResult = true;
            },
            // 取消搜索
            cancelSeacrch() {
                this.search = false;
                this.keyword = '';
                this.list = [];
                this.page = 1;
                this.getList();
            },
            // 
            // 确认选择时间
            toChoose(res) {
                let that = this;
                uni.showLoading({
                    title: '加载中...'
                });
                that.date_start = res.date_start;
                that.date_end = res.date_end;
                that.time = res.choose;
                that.page = 1;
                that.list = [];
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
                that._num = e;
                that.menu.forEach(function(row, index) {
                    if (row.value == that._num) {
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
                this._num = e;
                this.show = false;
                this.active = null;
                this.list = [];
                this.page = 1;
                this.getList();
            },
            getList() {
                let that = this;
                that.about = '';
                let url;
                let refund_status = 0;
                if (that.status == 2) {
                    refund_status = that._num;
                }
                uni.showLoading({
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.mch.order_list,
                    data: {
                        status: that.status == 2 ? '0': that._num,
                        mch_id: that.mch_id,
                        end_date: that.date_end,
                        start_date: that.date_start,
                        order_type: that.status == 2 ? 'refund_order':'order',
                        refund_status: refund_status,
                        page: that.page,
                        keyword: that.keyword
                    }
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    that.first = true;
                    if(response.code == 0) {
                        let list = response.data.list;
                        if (that.status == 2) {
                            let address = response.data.address;
                            address.forEach(function(row, index) {
                                row.address = row.address.replace(/"/g, '')
                                row.address = row.address.replace(/,/g, '')
                                row.address = row.address.replace('[', '')
                                row.address = row.address.replace(']', '')
                            })
                            that.address = address;
                        } else {
                            list.forEach(function(row) {
                                row.order_id = row.id;
                                row.detail.forEach(function(res) {
                                    if (res.refund_status > 0) {
                                        row.have_refund = 1;
                                    }
                                })
                            })
                        }
                        that.more_list = false;
                        if (list.length == response.data.pagination.pageSize) {
                            that.more_list = true;
                        }
                        that.page++;
                        that.list = that.list.concat(list);
                        that.$forceUpdate();
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                    uni.hideLoading();
                });
            },
            toCancelorder(e) {
                this.detail = e;
                this.cancelOrder = !this.cancelOrder;
            },
            toConfirm(e) {
                this.detail = e;
                this.confirmOrder = !this.confirmOrder;
            },
            cancelSubmit(type) {
                let that = this;
                uni.showLoading({
                    title: '加载中...'
                });
                let url = type == 1 ? that.$api.mch.cancel : that.$api.mch.force_cancel
                that.$request({
                    url: url,
                    data: {
                        status: 1,
                        mch_id: that.mch_id,
                        remark: '',
                        order_id: that.detail.id
                    },
                    method: 'post'
                }).then(response => {
                    uni.hideLoading();
                    if (response.code == 0) {
                        uni.showToast({
                            title: '取消成功',
                            duration: 2000,
                            type: 'success',
                            mask: false
                        });
                        that.isRefund = false;
                        that.cancelOrder = false;
                        setTimeout(()=>{
                            that.list = [];
                            that.page = 1;
                            that.getList();
                        },1000)
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
            toChange(e) {
                this.detail = e;
                this.changePrice = !this.changePrice;
                this.price = e.total_goods_price;
                this.express = e.express_price;
                this.total = '￥' + e.total_pay_price;
            },
            priceInput: function(e) {
                if (e.detail.value > -0.01) {
                    this.total = '￥' + (+e.detail.value + +this.express).toFixed(2)
                } else {
                    this.total = '数据有误'
                }
            },
            expressInput: function(e) {
                if (e.detail.value > -0.01) {
                    this.total = '￥' + (+e.detail.value + +this.price).toFixed(2)
                } else {
                    this.total = '数据有误'
                }
            },
            // 确认修改价格
            submitChange() {
                let that = this;
                uni.showLoading({
                    title: '加载中...'
                });
                if (that.price > -0.01 && that.express > -0.01) {
                    that.$request({
                        url: that.$api.mch.update_total_price,
                        data: {
                            order_id: that.detail.id,
                            mch_id: that.mch_id,
                            total_price: that.price,
                            express_price: that.express
                        },
                        method: 'post'
                    }).then(response => {
                        uni.hideLoading();
                        if (response.code == 0) {
                            uni.showToast({
                                title: response.msg,
                                duration: 2000,
                                type: 'success',
                                mask: false
                            });
                            that.page = 1;
                            that.list = [];
                            that.changePrice = false;
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
                } else {
                    if (!that.price || typeof(that.price) != 'number') {
                        uni.showToast({
                            title: '商品总价必须大于等于0',
                            icon: 'none',
                            duration: 1000
                        });
                    } else if (!that.express || typeof(that.express) != 'number') {
                        uni.showToast({
                            title: '运费必须大于等于0',
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }
            },
            toRefundOrder(e) {
                let that = this;
                
                that.list = [];
                that.more_list = false;
                that.keyword = e;
                that.status = 2;
                that._num = 0;
                that.search = true;
                that.searchMethod();
            },
            toSend(e) {
                this.detail = e;
                if(e.send_type == 1 && !e.address) {
                    this.beToSend = true;
                }else {
                    this.isSend = true;
                }
            },
            toExpress(e,is_send) {
                let id = e.id;
                let order_refund_id = e.refund;
                if (id > 0) {
                    uni.navigateTo({
                        url: '/plugins/mch/mch/send/send?id=' + id + '&is_send=' + is_send + '&mch_id=' + this.mch_id
                    })
                } else if (order_refund_id) {
                    uni.navigateTo({
                        url: '/plugins/mch/mch/send/send?order_refund_id=' + order_refund_id + '&is_send=' + is_send + '&mch_id=' + this.mch_id
                    })
                }
            },
            toSendType() {
                let that = this;
                if (that.sendType == 1) {
                    if (that.detail.status_text) {
                        uni.showLoading({
                            title: '加载中...'
                        });
                        that.$request({
                            url: that.$api.mch.refund_handle,
                            data: {
                                is_express: 0,
                                merchant_remark: '',
                                mch_id: that.mch_id,
                                type: that.detail.type,
                                is_agree: 1,
                                order_refund_id: that.detail.id
                            },
                            method: 'post'
                        }).then(response => {
                            uni.hideLoading();
                            if (response.code == 0) {
                                uni.showToast({
                                    title: response.msg,
                                    type: 'success',
                                    mask: false,
                                    duration: 2000
                                });
                                that.list = [];
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
                    } else {
                        uni.showLoading({
                            title: '加载中...'
                        });
                        let para = {
                            is_express: 2,
                            mch_id: that.mch_id,
                            words: '',
                            order_id: that.detail.id
                        }
                        if(that.detail.detailExpress.length > 0) {
                            para.express_id = that.detail.detailExpress[0].id
                        }
                        that.$request({
                            url: that.$api.mch.order_send,
                            data: para,
                            method: 'post'
                        }).then(response => {
                            uni.hideLoading();
                            if (response.code == 0) {
                                uni.showToast({
                                    title: response.msg,
                                    type: 'success',
                                    mask: false,
                                    duration: 2000
                                });
                                that.isSend = false;
                                setTimeout(()=>{
                                    that.list = [];
                                    that.page = 1;
                                    that.sendType = 0;
                                    that.getList();
                                },1000)
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
                } else {
                    that.isSend = false;
                    if (that.detail.status_text) {
                        uni.navigateTo({
                            url: '/plugins/mch/mch/send/send?order_refund_id=' + that.detail.id + '&mch_id=' + that.mch_id + '&is_send=' + that.detail.is_send
                        })
                    } else {
                        uni.navigateTo({
                            url: '/plugins/mch/mch/send/send?id=' + that.detail.id + '&mch_id=' + that.mch_id + '&is_send=' + that.detail.is_send
                        })
                    }
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
            toRefund(e) {
                this.detail = e;
                this.refund_price = e.refund_price;
                this.isRefund = !this.isRefund;
            },
            agree() {
                let that = this;
                uni.showLoading({
                    title: '处理中...'
                });
                if (that.detail.refund_price > 0) {
                    that.$request({
                        url: that.$api.mch.refund_handle,
                        data: {
                            order_refund_id: that.detail.id,
                            type: that.detail.type,
                            is_agree: 1,
                            mch_id: that.mch_id,
                            refund_price: that.refund_price,
                            merchant_remark: that.about
                        },
                        method: 'post'
                    }).then(response => {
                        uni.hideLoading();
                        if (response.code == 0) {
                            uni.showModal({
                                title: '提示',
                                content: response.msg,
                                showCancel: false,
                                success: function (res) {
                                    if (res.confirm) {
                                        that.list = [];
                                        that.notRefund = false;
                                        that.openAddress = false;
                                        that.isRefund = false;
                                        that.addressId = 0;
                                        that.page = 1;
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
                    if (this.address.length == 0) {
                        this.noAddress = true;
                    } else {
                        this.detail = detail;
                        this.openAddress = true;
                    }
                } else if (type == 2) {
                    this.detail = detail;
                    this.notRefund = true;
                }
                this.$forceUpdate();
            },

            toAgreeCancel(e) {
                this.detail = e;
                this.isRefund = !this.isRefund;
            },
            decline(type) {
                let that = this;
                if (type == 1) {
                    if (that.addressId < 1) {
                        uni.showToast({
                            title: '请选择地址',
                            icon: 'none',
                            duration: 1000
                        });
                        return false;
                    }
                }
                if (that.cancelRefund) {
                    type = 2;
                }
                uni.showLoading({
                    title: '处理中...'
                });
                that.$request({
                    url: that.$api.mch.refund_handle,
                    data: {
                        order_refund_id: that.detail.id,
                        type: that.detail.type,
                        is_agree: type,
                        mch_id: that.mch_id,
                        address_id: that.addressId,
                        refund_price: that.detail.refund_price,
                        merchant_remark: that.about
                    },
                    method: 'post'
                }).then(response => {
                    uni.hideLoading();
                    if (response.code == 0) {
                        uni.showModal({
                            title: '提示',
                            content: response.msg,
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    that.page = 1;
                                    that.list = [];
                                    that.notRefund = false;
                                    that.cancelOrder = false;
                                    that.openAddress = false;
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
            noCancel() {
                let that = this;
                uni.showLoading({
                    title: '处理中...'
                });
                that.$request({
                    url: that.$api.mch.cancel,
                    data: {
                        status: 2,
                        remark: that.about,
                        mch_id: that.mch_id,
                        order_id: that.detail.id
                    },
                    method: 'post'
                }).then(response => {
                    uni.hideLoading();
                    if (response.code == 0) {
                        uni.showToast({
                            title: response.msg,
                            type: 'success',
                            mask: false,
                            duration: 2000
                        });
                        that.list = [];
                        that.page = 1;
                        that.noRefund = false;
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
                this.noRefund = !this.noRefund;
            },
        },
        onReachBottom: function() {
            if (this.more_list) {
                this.getList();
            }
        },
        onShow: function() {
            if (!this.search && this.first) {
                this.list = [];
                this.page = 1;
                this.getList();
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.status = '1';
            that._num = '0';
            that.mch_id = options.mch_id;
            that.getList();
        }
    }
</script>

<style scoped lang="scss">
    .dialog-bg {
        width: 100%;
        height: 100%;
        position: fixed;
        background-color: rgba(0, 0, 0, 0.5);
        left: 0;
        top: 0;
    }

    .tab {
        margin: #{24rpx} auto;
        width: #{320rpx};
        height: #{56rpx};
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
    }

    .tab-item.tab-left {
        border-top-left-radius: #{28rpx};
        border-bottom-left-radius: #{28rpx};
        border: #{1rpx} solid #ff4544;
        border-right: 0;
    }

    .tab-item.tab-right {
        border-top-right-radius: #{28rpx};
        border-bottom-right-radius: #{28rpx};
        border: #{1rpx} solid #ff4544;
        border-left: 0;
    }

    .tab-item.active {
        background-color: #ff4544;
        color: #fff;
    }

    .search-area {
        position: fixed;
        z-index: 2;
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
        color: #ff4544;
        font-size: #{26rpx};
    }

    .choose image {
        width: #{22rpx};
        height: #{12rpx};
        margin-left: #{12rpx};
    }

    .navs-info {
        background-color: #fff;
        border-bottom: #{1rpx} solid #e2e2e2;
        position: fixed;
        z-index: 2;
        top: #{192rpx};
        left: 0;
        right: 0;
    }

    .navs {
        height: #{100rpx};
        font-size: #{28rpx};
        color: #666;
        text-align: center;
        position: relative;
    }

    .navs.more-navs {
        line-height: #{100rpx};
    }

    .navs .active {
        color: #ff4544;
        display: inline-block;
        height: #{100rpx};
        line-height: #{102rpx};
        border-bottom: #{2rpx} solid #ff4544;
    }

    .navs image {
        height: #{16rpx};
        width: #{16rpx};
        margin-left: #{16rpx};
        display: block;
        float: right;
        margin-top: #{42rpx};
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
    }

    .order-user {
        height: #{72rpx};
        background-color: #f7f7f7;
        padding-left: #{28rpx};
        font-size: #{24rpx};
        color: #353535;
    }

    .order-user view:first-of-type {
        margin-right: #{32rpx};
    }

    .to-tel {
        color: #ff4544;
        font-size: #{24rpx};
        margin-left: #{20rpx};
        height: #{72rpx};
        line-height: #{72rpx};
    }

    .to-tel image {
        height: #{28rpx};
        width: #{28rpx};
        display: block;
        margin-top: #{22rpx};
        margin-right: #{12rpx};
        float: left;
    }

    .goods {
        height: #{160rpx};
        margin-top: #{24rpx};
        position: relative;
        font-size: #{24rpx};
        color: #353535;
        margin-bottom: #{24rpx};
    }

    .goods .goods-img {
        height: #{160rpx};
        width: #{160rpx};
        float: left;
        margin-right: #{20rpx};
        border-radius: #{4rpx};
    }

    .goods .goods-attr {
        font-size: #{24rpx};
        color: #999;
        position: absolute;
        top: #{78rpx};
        left: #{180rpx};
    }

    .goods .goods-attr text {
        margin-right: #{20rpx};
    }

    .goods .goods-num {
        font-size: #{24rpx};
        color: #999;
        position: absolute;
        top: #{126rpx};
        left: #{180rpx};
    }

    .goods .goods-price {
        font-size: #{24rpx};
        color: #353535;
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .price-info {
        font-size: #{28rpx};
        color: #353535;
    }

    .price-info .other {
        font-size: #{24rpx};
        color: #999;
    }

    .handle-btn {
        height: #{48rpx};
        display: flex;
        align-items: center;
        padding: 0 #{24rpx};
        border-radius: #{24rpx};
        border: #{1rpx} solid #bbb;
        color: #353535;
        font-size: #{24rpx};
        margin-left: #{16rpx};
    }

    .handle-btn.other {
        border: #{1rpx} solid #ff4544;
        color: #ff4544;
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
    }

    .more-menu.go-out, .search-history.go-out {
        display: none;
    }

    .more-menu view {
        width: #{196rpx};
        height: #{68rpx};
        line-height: #{68rpx};
        text-align: center;
        border-left: #{1rpx} solid #e0e0e0;
        border-right: #{1rpx} solid #e0e0e0;
    }

    .search-item {
        height: #{96rpx};
        background-color: #efeff4;
        padding: 0 #{24rpx};
        font-size: #{28rpx};
        color: #00c203;
    }

    .search-input {
        height: #{64rpx};
        position: relative;
        width: #{620rpx};
    }

    .search-input image {
        height: #{22rpx};
        width: #{22rpx};
        position: absolute;
        top: #{21rpx};
        left: #{28rpx};
        z-index: 10;
    }

    .search-input input {
        padding-left: #{62rpx};
        background-color: #fff;
        border-radius: #{32rpx};
        height: #{64rpx};
        font-size: #{26rpx};
        color: #353535;
    }

    .search-history {
        position: absolute;
        top: #{96rpx};
        left: 0;
        right: 0;
        height: 100%;
        background-color: #fff;
        padding: #{24rpx} #{4rpx};
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
        border: #{1rpx} solid #ddd;
        color: #666;
        background-color: #fff;
        font-size: #{28rpx};
        margin: 0 #{30rpx} #{36rpx};
    }

    .send-item.active {
        color: #fff;
        border: #{1rpx} solid #ff4544;
        background-color: #ff4544;
    }

    .dialog-choose-item.active {
        color: #ff4544;
        border: #{2rpx} solid #ff4544;
    }

    .btn-area {
        height: #{88rpx};
        position: relative;
        border-top: #{1rpx} solid #e2e2e2;
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
        color: #ff4544;
    }

    .textarea {
        height: #{252rpx};
        width: #{492rpx};
        padding: #{24rpx} #{32rpx};
        font-size: #{28rpx};
        border-radius: #{16rpx};
        border: #{1rpx} solid #e2e2e2;
        text-align: left;
        margin: #{32rpx} auto;
    }

    .change-price-item {
        position: relative;
        height: #{64rpx};
        line-height: #{64rpx};
        color: #353535;
        font-size: #{28rpx};
        margin-bottom: #{32rpx};
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

    .time-title {
        margin-left: #{32rpx};
        color: #666;
        font-size: #{28rpx};
        margin-bottom: #{20rpx};
    }

    .reason {
        padding-left: #{32rpx};
    }

    .reason-title {
        font-size: #{28rpx};
        color: #999;
        margin-bottom: #{20rpx};
    }

    .reason-content {
        font-size: #{28rpx};
        color: #353535;
        width: #{556rpx};
        margin-bottom: #{26rpx};
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

    .add-item:last-of-type {
        border-bottom: 0;
    }

    .add-item image {
        height: #{36rpx};
        width: #{36rpx};
        position: absolute;
        left: #{-64rpx};
        top: 50%;
        margin-top: #{-18rpx};
    }

    .add-name {
        width: #{220rpx};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
        border: #{1rpx} solid #e2e2e2;
        border-radius: #{5rpx};
        font-size: #{32rpx};
        padding: 0 #{5rpx};
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
    }

    .icon-search+text {
        color:#b2b2b2;
        font-size:#{24rpx};
        margin:0 #{5rpx};
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

    .refund-pay {
        font-size: #{36rpx};
        color: #353535;
        font-weight: blod;
    }

    .refund-tip {
        font-size: #{32rpx};
        color: #353535;
        margin: #{4rpx} 0 #{45rpx};
    }

    .total-money {
        margin-left: #{56rpx};
    }

    .cancel-tip {
        font-size: #{32rpx};
        color: #353535;
        margin: #{74rpx} 0 #{60rpx};
    }

    .send-type {
        margin-bottom: #{24rpx};
        padding: 0 #{32rpx};
    }
</style>