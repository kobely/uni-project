<template>
    <app-layout>
        <image class="head-img" :src='adminImg.detail_bg'></image>
        <view v-if="status == 2" class="head-txt main-between">
            <view class="status-txt">{{detail.status_cn}}</view>
        </view>
        <view v-else class="head-txt main-between">

            <view class="status-txt" >{{orderStatus}}</view>

            <view v-if="order.auto_confirm > 0 && order.is_send == 1 && order.is_confirm == 0">剩余
                <text v-if="dd>0">{{dd}}天</text>
                <text v-if="hh>0 && dd==0">{{hh}}小时</text> {{mm}}分自动确认收货
            </view>
            <view v-else-if="order.auto_cancel > 0 && order.is_pay == 0 && order.pay_type != 2">剩余
                <text v-if="dd>0">{{dd}}天</text>
                <text v-if="hh>0 && dd==0">{{hh}}小时</text> {{mm}}分自动删除
            </view>
            <view v-else-if="order.auto_sales > 0 && order.is_sale == 0 && order.is_confirm == 1">剩余
                <text v-if="dd>0">{{dd}}天</text>
                <text v-if="hh>0 && dd==0">{{hh}}小时</text> {{mm}}分自动完成订单
            </view>

        </view>
        <view class="user-info" v-if="(order.address || order.send_type != 2) &&  (order.goods_type === 'goods' || order.goods_type === 'exchange')" :style="{padding: order.mobile ? '28rpx 24rpx 0' : '44rpx 24rpx 20rpx' }">
            <image class="localhost-img" src='./../image/localhost.png'></image>
            <view class="user-text">
                <text class="name">{{order.name ? order.name : order.user.nickname}}</text>
                <text v-if="order.address">{{order.mobile}}</text>
            </view>
            <view class='user-text address-info'>{{!order.address ? order.mobile : order.address}}</view>
            <view v-if="order.mobile" class='main-center area'>
                <view @click='toCall(order.mobile)' class="detail-btn box-grow-1">联系收货人</view>
                <view :class="[`${order.send_type == 2 ? 'line left-line':'line'}`]"></view>
                <view class="detail-btn box-grow-1" @click='copy'>{{!order.address ? '复制联系方式' : '复制地址'}}</view>
                <view class="line" v-if="order.send_type == 2" :class="[`${order.address ? 'line right-line':'line'}`]"></view>
                <view class="detail-btn box-grow-1" v-if="order.send_type == 2" @click='openMap'>地图导航</view>
            </view>
        </view>
        <view class="user-info" v-if="order.goods_type === 'ecard'">
            <view class="user-text" flex="cross: center">
                <image class="localhost-img" src='./../image/localhost.png'></image>
                <view class="name">{{order.name}}</view>
            </view>
            <view class='user-text address-info'>{{order.mobile}}</view>
            <view class='main-center area'>
                <view @click='toCall(order.mobile)' class="detail-btn box-grow-1">联系收货人</view>
            </view>
        </view>
        <view v-if="(detail.detailExpress && detail.detail && detail.detailExpress.length === 1 && detail.detail.length === 1) || (order.detailExpress && order.detail && order.detailExpress.length === 1 && order.detail.length === 1)">
            <view @click="toExpressInfo(detail)" class="express" v-if="detail.detailExpress && detail.detailExpress[0].express_no">
                <image class="logo" src='./../image/express.png'></image>
                <view class="express-company">{{detail.detailExpress[0].express}}</view>
                <view class="express-number">运单编号：{{detail.detailExpress[0].express_no}}</view>
                <image v-if="detail.detailExpress[0].express" class="to-more" src='/static/image/icon/arrow-right.png'></image>
            </view>
            <view @click="toExpressInfo(order)" class="express" v-else-if="order.detailExpress[0].express_no">
                <image class="logo" src='./../image/express.png'></image>
                <view class="express-company">{{order.detailExpress[0].express}}</view>
                <view v-if="order.detailExpress[0].express" class="express-number">运单编号：{{order.detailExpress[0].express_no}}</view>
                <image v-if="order.detailExpress[0].express" class="to-more" src='/static/image/icon/arrow-right.png'></image>
            </view>
        </view>
        <view class="express" v-if="(order.detailExpress && order.detailExpress.length > 1) || (order.is_send == 0 && order.detailExpress &&  order.detailExpress.length >= 1)" @click="toExpressMore(order)">
            <view class="showMore">该订单已拆成多个包裹发货，点击查看详情</view>
            <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
        </view>
        <view class="express" v-else-if="(detail.detailExpress && detail.detailExpress.length > 1) || (detail.is_send == 0 && detail.detailExpress && detail.detailExpress.length >= 1)" @click="toExpressMore(detail)">
            <view class="showMore">该订单已拆成多个包裹发货，点击查看详情</view>
            <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
        </view>
        <view class="composition" v-if="order.sign === 'composition'">
            <view v-for="(list,idx) in order.composition_list" class="composition-item" :key="idx">
                <view class="main-between composition-title">
                    <view class="composition-type" v-if="list.type == 1">固定套餐</view>
                    <view class="composition-type" v-else>搭配套餐</view>
                    <view>套餐总价 ￥{{list.total_price}}</view>
                </view>
                <view v-if="list.show || index == 0" v-for="(goods,index) in list.goods_list" class="goods" :key="goods.id">
                    <image class="goods-img" :src='goods.pic_url'></image>
                    <view class='t-omit-two goods-name'>{{goods.name}}</view>
                    <view class="goods-attr t-omit">
                        <text v-for="attr in goods.attr_list" :key="item.attr_id">{{attr.attr_group_name}}:{{attr.attr_name}}</text>
                    </view>
                    <view class="goods-num">x{{goods.num}}</view>
                    <view class="goods-price">￥{{goods.total_price}}</view>
                </view>
                <view class="composition-open main-center">
                    <view @click="toggle(idx)" class="composition-btn">
                        <text>{{list.show ? '点击收起套餐详情' : '点击展开套餐详情'}}</text>
                        <image v-if="!list.show" src="/static/image/icon/icon-down.png"></image>
                        <image v-else src="/static/image/icon/icon-up.png"></image>
                    </view>
                </view>
            </view>
        </view>
        <view :class="[`${!order.address && order.send_type != 1 ? 'goods-info card-info':'goods-info'}`]" :style="{marginTop: order.goods_type === 'goods' && order.address == '' && order.send_type == 2? '140rpx' : '24rpx'}">
            <view v-if="order.sign !== 'composition' || status == 2">
                <view class="goods-title">自营商品</view>
                <view v-for="(goods, dIndex) in order.detail" class="goods" :key="goods.id">
                    <image class="goods-img" :src='goods.goods_info.goods_attr.pic_url ? goods.goods_info.goods_attr.pic_url : goods.goods_info.goods_attr.cover_pic'></image>
                    <view class='t-omit goods-name'>{{goods.goods_info.goods_attr.name}}</view>
                    <view class="goods-attr t-omit-two" v-if="order.goods_type === 'goods'">
                        <text v-for="(attr,index) in goods.attr_list" :key="index">{{attr.attr_group_name}}:{{attr.attr_name}}</text>
                    </view>
                    <view class="goods-num">x{{goods.num}}</view>
                    <view class="goods-price">
                        <span v-if="order.plugin_data && order.plugin_data.exchange_list && order.plugin_data.exchange_list.length">{{order.plugin_data.exchange_list[dIndex].value}}{{order.plugin_data.price_name}}+</span>
                        <span>￥{{goods.total_original_price}}</span>
                    </view>
                </view>
            </view>
            <view v-if="order.plugin_data && order.plugin_data.exchange_count == null" class="main-between price-item">
                <view class="price-label">商品总价</view>
                <view>￥{{ order.total_goods_original_price }}</view>
            </view>
            <view v-if="order.plugin_data && order.plugin_data.exchange_count" class="main-between price-item">
                <view class="price-label">兑换{{order.plugin_data.price_name}}</view>
                <view>{{ order.plugin_data.exchange_count }}</view>
            </view>
            <view v-if="order.plugin_data && order.plugin_data.exchange_count >= 0" class="main-between price-item">
                <view class="price-label">兑换金额</view>
                <view>￥{{ order.total_goods_original_price }}</view>
            </view>
            <view class="main-between price-item" v-if="order.goods_type !== 'ecard'">
                <view class="price-label">运费</view>
                <view>￥{{ order.express_price }}</view>
            </view>
            <view class="main-between price-item" v-if="order.member_discount_price > 0">
                <view class="price-label">会员折扣</view>
                <view>-￥{{ order.member_discount_price }}</view>
            </view>
            <view class="main-between price-item" v-if="order.integral_deduction_price > 0">
                <view class="price-label">积分抵扣</view>
                <view>-￥{{ order.integral_deduction_price }}</view>
            </view>
            <view class="main-between price-item" v-if="order.coupon_discount_price > 0">
                <view class="price-label">优惠券抵扣</view>
                <view>-￥{{ order.coupon_discount_price }}</view>
            </view>
            <block v-if="order.plugin_data && order.plugin_data.discount_list">
                <view class="main-between price-item"  v-if="pluginData.value > 0 || pluginData.value < 0" v-for="(pluginData,index) in order.plugin_data.discount_list" :key="index">
                    <view class="price-label">{{pluginData.label}}</view>
                    <view v-if="pluginData.value > 0">-￥{{ pluginData.value }}</view>
                    <view v-if="pluginData.value < 0">+￥{{ -pluginData.value }}</view>
                </view>
            </block>
            <view class="main-between price-item" v-if="order.full_reduce_price > 0">
                <view class="price-label">满减优惠</view>
                <view>-￥{{ order.full_reduce_price }}</view>
            </view>
            <view class="main-between price-item" v-if="order.back_price > 0">
                <view class="price-label">订单改价</view>
                <view v-if="order.back_price > 0">-￥{{ order.back_price }}</view>
                <view v-if="order.back_price < 0">+￥{{ -order.back_price }}</view>
            </view>
            <view class="main-between price-item" style='margin-bottom: 0'>
                <view class="price-label total-label">订单总价</view>
                <view class="total-price">
                    <text v-if="order.plugin_data && order.plugin_data.exchange_count">{{order.plugin_data.exchange_count}}{{order.plugin_data.price_name}}+</text>
                    <text>￥{{ order.total_pay_price }}</text>
                </view>
            </view>
            <view v-if="status== 2 && detail.type == 1" class="refund-info">申请退款 ￥{{detail.refund_price}} <text v-if="detail.is_refund == 1"> 实际退款 ￥{{detail.reality_refund_price}}</text></view>
        </view>
        <view class='goods-info' v-if="showForm && status == 2">
            <view v-for="(goods,idx) in order.detail" :class="['goods-form', `${idx == 0? 'more':''}`]" :key="goods.id">
                <view class='goods-title form-title'>表单内容</view>
                <view v-for="(item,index) in goods.form_data" v-if="item.value != null" :key="index" :class="[ `${item.key !== 'img_upload' ? 'dir-left-nowrap' : ''}`,`price-item`]">
                    <view class="price-label">{{item.label}}:</view>
                    <view v-if="item.key === 'img_upload'">
                        <image v-show="!item.loadOver" @load="imageFormLoad(idx,index)" @click='look(item.value)' class="form-img" :src='item.value'></image>
                    </view>
                    <view v-else>{{item.value}}</view>
                </view>
            </view>
        </view>

        <view class='goods-info mch-goods' v-if="order.sign !== 'vip_card'">
            <view class='goods-title'>配送信息</view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">发货方式:</view>
                <view v-if="order.send_type == 0">快递配送</view>
                <view v-else-if="order.send_type == 1">上门自提</view>
                <view v-else-if="order.send_type == 2">同城配送</view>
                <view v-else-if="order.send_type == 3">自动发货</view>
            </view>

            <template v-if="order.send_type == 1">
                <view  class="dir-left-nowrap price-item">
                    <view class="price-label">门店名称:</view>
                    <view>{{order.store.name}}</view>
                </view>
                <view  class="dir-left-nowrap price-item">
                    <view class="price-label">联系方式:</view>
                    <view>{{order.store.mobile}}</view>
                </view>
                <view class="dir-left-nowrap price-item">
                    <view class="price-label">门店地址:</view>
                    <view>{{order.store.address}}</view>
                </view>
            </template>

            <template v-if="order.send_type == 2">
                <view class="dir-left-nowrap price-item">
                    <view class="price-label">发货地址:</view>
                    <view>{{order.city.address}}</view>
                </view>
                <view class="dir-left-nowrap price-item">
                    <view class="price-label">联系方式:</view>
                    <view>{{order.city.contact_way}}</view>
                </view>
                <view class="dir-left-nowrap price-item">
                    <view class="price-label">配送说明:</view>
                    <view>{{order.city.explain}}</view>
                </view>
                <view class="sc" v-if="((order.detailExpress && order.detailExpress.length == 1) || order.city_name) && order.is_send == 1">
                    <view class="dir-left-nowrap cross-center city-service">
                        <image class="head" src="/static/image/icon/deliveryman.png"></image>
                        <template v-if="order.detailExpress[0].status == 101">
                            <view class="await-man">等待分配骑手</view>
                        </template>
                        <template v-else>
                            <view class="info-box dir-top-nowrap box-grow-1">
                                <view class="info-label">配送员</view>
                                <view class="info">{{order.city_name ? order.city_name : order.detailExpress[0].city_name}} {{order.city_mobile ? order.city_mobile : order.detailExpress[0].city_mobile}}</view>
                            </view>
                            <view class="icon-box">
                                <app-jump-button open_type="tel" :number="order.city_mobile ? order.city_mobile : order.detailExpress[0].city_mobile">
                                    <image class="icon" src="/static/image/icon/store-tel.png"></image>
                                </app-jump-button>
                            </view>
                            <!-- 第三方配送才有地图信息 -->
                            <view v-if="order.detailExpress[0].send_type == 1" class="icon-box">
                                <app-jump-button open_type="navigate" :url="'/pages/order/city-map/city-map?express_id=' + order.detailExpress[0].id">
                                    <image class="icon" src="/static/image/icon/see-location.png"></image>
                                </app-jump-button>
                            </view>
                        </template>
                    </view>
                </view>
            </template>

        </view>

        <view class='goods-info mch-goods'>
            <view class='goods-title'>订单信息</view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">下单时间:</view>
                <view>{{order.created_at}}</view>
            </view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">订单号:</view>
                <view>{{order.order_no}}</view>
            </view>
            <view class="dir-left-nowrap price-item" v-if="order.words || order.seller_remark">
                <view class="price-label">商家备注:</view>
                <view>{{order.words || order.seller_remark}}</view>
            </view>
            <view class="dir-left-nowrap price-item" v-if="order.remark && order.goods_type === 'goods'">
                <view class="price-label">买家留言:</view>
                <view style="word-break: break-all">{{order.remark}}</view>
            </view>
            <view v-if="order.detailExpress && order.detailExpress.length === 1 && (order.detailExpress[0].merchant_remark || order.detailExpress[0].express_contentd)" class="dir-left-nowrap price-item">
                <view class="price-label">卖家物流留言:</view>
                <view>{{order.detailExpress[0].merchant_remark || order.detailExpress[0].express_content}}</view>
            </view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">支付方式:</view>
                <view v-if="order.pay_type == 1">线上支付</view>
                <view v-else-if="order.pay_type == 3">余额支付</view>
                <view v-else-if="order.pay_type == 2">货到付款</view>
                <view v-else-if="order.pay_type == 4">现金</view>
                <view v-else-if="order.pay_type == 5">pos机</view>
                <view v-else>未支付</view>
            </view>
            <view class="dir-left-nowrap price-item" v-if="order.sign === 'exchange' && order.exchange_code">
                <view class="price-label">兑换码库:</view>
                <view>{{order.exchange_code.library_name}}</view>
            </view>
            <view class="dir-left-nowrap price-item" v-if="order.sign === 'exchange' && order.exchange_code">
                <view class="price-label">兑换码:</view>
                <view>{{order.exchange_code.code}}</view>
            </view>
            <view v-for="(item,index) in order.order_form" v-if="item.value && order.sign !== 'booking' && order.sign !== 'vip_card'" :key="index" class="dir-left-nowrap price-item">
                <view class="price-label">{{item.label}}:</view>
                <view v-if="item.key === 'img_upload'">
                    <view v-if="Array.isArray(item.value)">
                        <block v-for="(img,key) in item.value" :key="key">
                            <image v-show="!item.loadOver" @load="imageLoad(index)" @click='look(img)' class="form-img" :src='img'></image>
                        </block>
                    </view>
                    <view v-else>
                        <image v-show="!item.loadOver" @load="imageLoad(index)" @click='look(item.value)' class="form-img" :src='item.value'></image>
                    </view>
                </view>
                <view style="word-break: break-all" v-else>{{item.value}}</view>
            </view>
        </view>

        <view class='goods-info' v-if="showForm&& status == 1">
            <view class='goods-title form-title'>其他信息</view>
            <view v-for="(row,idx) in formList" :class="['goods-form', `${idx == 0? 'more':''}`]" :key="idx">
                <view v-for="(goods,index) in row" :key="goods.id">
                    <view class="goods" v-if="formList.length > 1">
                        <image class="goods-img" :src='goods.goods_info.goods_attr.pic_url ? goods.goods_info.goods_attr.pic_url : goods.goods_info.goods_attr.cover_pic'></image>
                        <view class='t-omit-two goods-name'>{{goods.goods_info.goods_attr.name}}</view>
                        <view class="goods-attr t-omit" v-if="order.goods_type === 'goods'">
                            <text v-for="attr in goods.attr_list" :key="item.attr_id">{{attr.attr_group_name}}:{{attr.attr_name}}</text>
                        </view>
                        <view class="goods-num">x{{goods.num}}</view>
                        <view class="goods-price">￥{{goods.total_original_price}}</view>
                    </view>
                </view>
                <view v-for="(item,index) in row[0].form_data" v-if="item.value && order.sign !== 'booking'" :key="index" :class="[ `${item.key !== 'img_upload' ? 'dir-left-nowrap' : ''}`,`price-item`]">
                    <view class="price-label">{{item.label}}:</view>
                    <view v-if="item.key === 'img_upload'">
                        <view v-if="Array.isArray(item.value)">
                            <block v-for="(img,key) in item.value" :key="key">
                                <image v-show="!item.loadOver" @load="imageFormLoad(idx,index)" @click='look(img)' class="form-img" :src='img'></image>
                            </block>
                        </view>
                        <view v-else>
                            <image v-show="!item.loadOver" @load="imageFormLoad(idx,index)" @click='look(item.value)' class="form-img" :src='item.value'></image>
                        </view>
                    </view>
                    <view style="word-break: break-all" v-else>{{item.value}}</view>
                </view>
            </view>
            <view v-for="(item,index) in order.order_form" v-if="item.value && (order.sign === 'booking' || order.sign === 'vip_card')" :key="index" :class="[ `${item.key !== 'img_upload' ? 'dir-left-nowrap' : ''}`,`price-item`]">
                <view class="price-label">{{item.label}}:</view>
                <view v-if="item.key === 'img_upload'">
                    <view v-if="Array.isArray(item.value)">
                        <block v-for="(img,key) in item.value" :key="key">
                            <image v-if="img" v-show="!item.loadOver" @load="imageLoad(index)" @click='look(img)' class="form-img" :src='img'></image>
                        </block>
                    </view>
                    <view v-else>
                        <image v-if="item.value" v-show="!item.loadOver" @load="imageLoad(index)" @click='look(item.value)' class="form-img" :src='item.value'></image>
                    </view>
                </view>
                <view style="word-break: break-all" v-else>{{item.value}}</view>
            </view>
        </view>
        <view :class="['bottom-place', `${iphone_x? 'iphone_x':''}`]"></view>
        <view :class="[`${(order.is_confirm != 1 && order.cancel_status == 0) || status == 2 ? 'btn': ''}`, `${iphone_x ? 'iphone_x':''}`]" v-if="(order.is_confirm != 1 && order.cancel_status == 0) || status == 2 || order.showMobile">
            <order-menu v-if="showSolt" :hiddenRemark="hiddenRemark" @change="cancel" :address="address" :status="status" @update="update" :item="status == 2 ? detail : order"></order-menu>
        </view>
        <view v-else-if="order.id > 0 && order.is_confirm != 1" :class="['btn', `${iphone_x ? 'iphone_x':''}`]">
            <order-menu v-if="showSolt" :hiddenRemark="hiddenRemark" @change="cancel" :address="address" :status="status" @update="update" :item="order"></order-menu>
        </view>
    </app-layout>
</template>

<script>
    import {mapState} from "vuex";
    import orderMenu from "../components/order-menu.vue";

    export default {
        data() {
            return {
                showSolt: false,
                order: {
                    total_pay_price: '',
                    express_price: '',
                    total_goods_price: '',
                    total_goods_original_price: ''
                },
                address: [],
                today: '',
                yesterday: '',
                weekday: '',
                detail: {},
                reset_time: 0,
                dd: 0,
                hh: 0,
                mm: 0,
                status: 1,
                hiddenRemark: true,
                showForm: false,
                first: true,
                iphone_x: false
            }
        },
        components: {
            "order-menu": orderMenu
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                adminImg: state => state.mallConfig.__wxapp_img.app_admin,
            }),
            formList() {
                const self = this;
                let orderDetail = self.order.detail;
                let newArr = {};
                let form_ids = [];

                if (orderDetail && orderDetail.length) {
                    for (let goods of orderDetail) {
                        if (goods.form_id == '0') {
                            continue;
                        }
                        if (form_ids.indexOf(goods.form_id) === -1) {
                            form_ids.push(goods.form_id);
                            newArr[goods.form_id] = [goods];
                        } else {
                            newArr[goods.form_id].push(goods);
                        }
                    }
                }
                return Object.values(newArr);
            },
            orderStatus: function() {
                if (this.order.is_sale == 1) {
                    return '已完成';
                } else if (this.order.cancel_status == 1) {
                    return '订单已取消';
                } else if (this.order.cancel_status == 2) {
                    return '取消订单 待处理';
                } else if (this.order.is_pay == 0 && this.order.pay_type != 2) {
                    return '等待买家付款';
                } else if (this.order.is_send == 0) {
                    return '等待卖家发货';
                } else if (this.order.is_confirm == 0) {
                    return '卖家已发货';
                } else if (this.order.is_confirm == 1) {
                    return '买家已收货';
                }
            }
        },
        methods: {
            toExpressInfo(item) {
                uni.navigateTo({
                    url: '/pages/app_admin/express/express?id='+item.id+'&express='+item.detailExpress[0].express+'&express_no='+item.detailExpress[0].express_no+'&customer_name='+item.detailExpress[0].customer_name
                })
            },
            toExpressMore(item) {
                uni.navigateTo({
                    url: '/pages/order/express-list/express-list?order_id='+item.id
                })
            },
            cancel(e) {
                if(e && e.id > 0) {
                    if(this.status == 2) {
                        this.detail = e;
                    }else {
                        this.order = e;
                    }
                }
                this.showSolt = false;
                setTimeout(()=>{
                    this.showSolt = true;
                },0)
                this.$forceUpdate();
            },
            toCall(e) {
                if(this.status == 2) {
                    this.detail.showMobile = true;
                }else {
                    this.order.showMobile = true;
                }
                this.showSolt = false;
                setTimeout(()=>{
                    this.showSolt = true;
                },0)
                this.$forceUpdate();
            },
            update(row) {
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.getList();
            },
            toggle(index) {
                this.order.composition_list[index].show = !this.order.composition_list[index].show;
            },

            openMap() {
                let location = this.order.location.split(',');
                uni.openLocation({
                    latitude: +location[1],
                    longitude: +location[0]
                });
            },
            imageLoad(index) {
                this.order.order_form[index].loadOver = false;
            },
            // 查看图片
            look(e) {
                uni.previewImage({
                    current: e, // 当前显示图片的http链接
                    urls: [e] // 需要预览的图片http链接列表
                })
            },
            imageFormLoad(idx,index) {
                this.order.detail[idx].form_data[index].loadOver = false;
            },
            copy() {
                let address = `${this.order.name} ${this.order.mobile} ${this.order.address}`;
                this.$utils.uniCopy({
                    data: address,
                    success() {
                        uni.showToast({
                            title: '复制成功',
                            duration: 1000
                        });
                    }
                })
            },
            getTime() {
                let reset_time = this.reset_time - 1;
                let dd = 0;
                let hh = parseInt(reset_time / 3600);
                if (reset_time > 86400) {
                    dd = parseInt(reset_time / 86400);
                    hh = parseInt((reset_time - 86400 * dd) / 3600);
                }
                let h = reset_time % 3600;
                let mm = parseInt(h / 60);
                if (hh < 10) {
                    hh = '0' + hh.toString();
                }
                if (mm < 10) {
                    mm = '0' + mm.toString();
                }
                this.reset_time = reset_time;
                this.dd = dd;
                this.hh = hh;
                this.mm = mm;
            },
            getList() {
                let that = this;
                that.about = '';
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                let para = {};
                if(that.status == 1) {
                    para.order_id = that.id
                }else {
                    para.refund_order_id = that.id
                }
                that.$request({
                    url: that.status == 1 ?that.$api.app_admin.detail : that.$api.app_admin.refund_detail,
                    data: para,
                    method: 'post'
                }).then(response=>{
                    uni.hideLoading();
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.showSolt = true;
                        let order;
                        if(that.status == 1) {
                            order = response.data.order;
                            order.showMobile = false;
                        }else {
                            that.detail = response.data.detail
                            that.detail.showMobile = false;
                            order = response.data.detail.order;
                            order.detail = [];
                            order.detail[0] = response.data.detail.detail
                        }
                        order.address = order.address.replace(/\s*/g, "");
                        let reset_time = 0;
                        if (order.auto_cancel > 0) {
                            reset_time = order.auto_cancel;
                        } else if (order.auto_confirm > 0) {
                            reset_time = order.auto_confirm;
                        } else if (order.auto_sales > 0) {
                            reset_time = order.auto_sales;
                        }
                        if(that.first) {
                            if(order.order_form !=null && order.order_form.length > 0) {
                                for(let i = 0;i < order.order_form.length;i++) {
                                    if(order.order_form[i].key == 'img_upload') {
                                        order.order_form[i].loadOver = true;
                                    }
                                }
                            }
                            that.first = false;
                        }
                        that.showForm = false;
                        for(let i in order.detail) {
                            if(order.detail[i].form_data != null && order.detail[i].form_data.length > 0) {
                                for(let item of order.detail[i].form_data) {
                                    if(item.value != null) {
                                        that.showForm = true;
                                    }
                                }
                            }
                        }
                        if(order.sign === 'booking' || order.sign === 'vip_card') {
                            if(order.order_form != null && order.order_form.length > 0) {
                                for(let item of order.order_form) {
                                    if(item.value != null) {
                                        that.showForm = true;
                                    }
                                }
                            }
                        }
                        if (order.sign == 'composition') {
                            for (let i in order.composition_list) {
                                order.composition_list[i].show = false;
                            }
                        }
                        that.order = order;
                        if(reset_time > 0) {
                            that.reset_time = reset_time;
                            setInterval(function() {
                                that.getTime();
                            }, 1000)
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                    that.$hideLoading();
                });
            },
            getAddress() {
                let that = this;
                that.$request({
                    url: that.$api.app_admin.refund_address
                }).then(response => {
                    that.$hideLoading();
                    if (response.code == 0) {
                        that.address = response.data.list;
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                    uni.showToast({
                        title: response,
                        icon: 'none',
                        duration: 1000
                    });
                });
            },
        },
        onShow: function() {
            this.getList();
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            });
            that.id = options.id;
            that.status = +options.status;
            that.getAddress();
        }
    }
</script>

<style scoped lang="scss">
    .goods-form {
        border-top: #{2rpx solid #e2e2e2};
        margin-top: #{20rpx};
        .price-label {
            margin-right: #{10rpx};
        }
    }

    .goods-form.more {
        border-top: 0;
        margin-top: #{10rpx};
    }

    .sc {
        position: relative;
        margin: #{24rpx};
        background-color: #fff;
        padding: #{24rpx};
        border-radius: #{16rpx};
        .sc-info {
            padding-right: #{120rpx};
            width: 100%;
            .sc-icon {
                height: #{72rpx};
                width: #{72rpx};
                margin-right: #{24rpx};
            }
            .sc-about {
                font-size: #{24rpx};
                color: #999999;
                .sc-person {
                    margin-top: #{10rpx};
                    color: #666666;
                    font-size: #{28rpx};
                    .sc-name {
                        margin-right: #{16rpx};
                    }
                }
            }
        }
        .sc-to-call {
            position: absolute;
            top: 50%;
            right: 0;
            margin-top: #{-28rpx};
            height: #{56rpx};
            width: #{120rpx};
            border-left: #{2rpx} solid #e2e2e2;
            image {
                height: #{40rpx};
                width: #{40rpx};
            }
        }
    }

    .composition {
        padding: 0;
        margin-bottom: #{4rpx};
        .composition-item {
            background-color: #fff;
            margin: #{24rpx};
            padding: #{24rpx};
            padding-top: 0;
            border-radius: #{16rpx};
            margin-bottom: #{20rpx};
            .composition-open {
                text-align: center;
                background-color: #fff;
                height: #{84rpx};
                .composition-btn {
                    display: inline-block;
                    border: #{2rpx} solid #bbbbbb;
                    font-size: #{24rpx};
                    color: #999999;
                    padding: 0 #{24rpx};
                    margin: #{12rpx} 0 #{16rpx};
                    height: #{56rpx};
                    line-height: #{54rpx};
                    border-radius: #{28rpx};
                    image {
                        width: #{22rpx};
                        height: #{12rpx};
                        margin-left: #{16rpx};
                    }
                }
            }
            .goods-list {
                padding: 0 #{24rpx};
            }
            .composition-title {
                height: #{80rpx};
                line-height: #{80rpx};
                font-size: #{24rpx};
                color: #353535;
                margin-bottom: #{24rpx};
            }
        }
    }

    .goods {
        height: #{160rpx};
        margin-top: #{24rpx};
        position: relative;
        font-size: #{24rpx};
        color: #353535;
        margin-bottom: #{24rpx};
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
            width: 70%;
            position: absolute;
            width: 70%;
            top: #{40rpx};
            left: #{180rpx};
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

    .head-img {
        height: #{220rpx};
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }

    .head-txt {
        font-size: #{28rpx};
        color: #fff;
        position: absolute;
        top: #{45rpx};
        left: #{48rpx};
        right: #{48rpx};
        line-height: #{40rpx};
        height: #{40rpx};
        z-index: 2;
    }

    .status-txt {
        font-size: #{32rpx};
    }

    .user-info {
        position: relative;
        background-color: #fff;
        margin: #{140rpx} #{24rpx} 0;
        border-radius: #{16rpx};
        padding: #{28rpx} #{24rpx} 0;
        z-index: 2;
        font-size: #{26rpx};
        color: #353535;
    }

    .localhost-img {
        height: #{44rpx};
        width: #{44rpx};
        position: absolute;
        top: #{40rpx};
        left: #{24rpx};
    }

    .user-text {
        padding-left: #{68rpx};
    }

    .user-text:last-of-type {
        margin: #{10rpx} 0 #{28rpx};
    }

    .area {
        height: #{72rpx};
        border-top: #{1rpx} solid #e2e2e2;
        position: relative;
    }

    .detail-btn {
        // width: 50%;
        height: #{72rpx};
        text-align: center;
        line-height: #{72rpx};
        color: #446dfd;
        font-size: #{24rpx};
    }

    .line {
        position: absolute;
        top: #{16rpx};
        left: 50%;
        width: #{1rpx};
        margin-left: #{-1rpx};
        background-color: #e2e2e2;
        height: #{40rpx};
    }

    .line.left-line {
        left: 36%;
        width: #{2rpx};
    }

    .line.right-line {
        left: 68%;
        width: #{2rpx};
    }

    .logo {
        height: #{100rpx};
        width: #{100rpx};
        float: left;
        margin-right: #{34rpx};
    }

    .express {
        margin: #{24rpx};
        display: block;
        margin-bottom: 0;
        padding: #{32rpx};
        padding-left: #{24rpx};
        position: relative;
        font-size: #{32rpx};
        background-color: #fff;
        color: #353535;
        border-radius: #{16rpx};
        .showMore {
            font-size: #{28rpx};
        }
        .showMore+.to-more {
            margin-top: #{-12rpx};
        }
    }

    .to-more {
        height: #{24rpx};
        width: #{12rpx};
        position: absolute;
        right: #{24rpx};
        top: 50%;
        margin-top: #{-6rpx};
    }

    .goods-info {
        padding: #{24rpx};
        background-color: #fff;
        margin: #{24rpx};
        margin-bottom: 0;
    }

    .goods-info.card-info {
        position: relative;
        z-index: 10;
        border-top-left-radius: #{16rpx};
        border-top-right-radius: #{16rpx};
    }

    .goods-title {
        color: #353535;
        font-size: #{24rpx};
        &.form-title {
            margin-bottom: #{10rpx};
        }
    }

    .price-item {
        margin-bottom: #{10rpx};
        font-size: #{24rpx};
        color: #353535;
    }

    .refund-info {
        margin-top: #{15rpx};
        background-color: #f7f7f7;
        padding: #{15rpx} #{25rpx};
        font-size: #{24rpx};
    }

    .price-label {
        flex-shrink: 0;
        color: #999;
        font-size: #{24rpx};
    }

    .total-price {
        font-size: #{28rpx};
        color: #446dfd;
        font-weight: bold;
    }

    .btn.iphone_x {
        height: #{146rpx};
        padding-bottom: #{50rpx};
    }

    .btn {
        height: #{96rpx};
        position: fixed;
        bottom: 0;
        width: 100%;
        right: 0;
        border-top: #{1rpx} solid #e2e2e2;
        z-index: 10;
        padding: #{24rpx};
        background-color: #fff;
    }

    .bottom-place {
        height: #{120rpx};
    }

    .bottom-place.iphone_x {
        height: #{170rpx};
    }

    .name {
        margin-right: #{20rpx};
    }

    .express-company {
        margin-top: #{10rpx};
    }

    .express-number {
        color: #666666;
        font-size: #{28rpx};
        margin-top: #{10rpx}
    }

    .total-label {
        font-size: #{24rpx};
        color: #353535;
    }

    .mch-goods {
        .sc {
            margin: 0;
            border-radius: 0;
            border-top: #{2rpx} solid #e2e2e2;
            margin-top: #{30rpx};
            padding-right: 0;
        }
        .goods-title {
            margin-bottom: #{24rpx};
        }
        .price-label {
            margin-right: #{20rpx};
        }
    }

    .form-img {
        height: #{120rpx};
        width: #{120rpx};
        margin-right: #{10rpx};
        margin-top: #{10rpx};
    }

    .goods-name {
        padding-top: #{5rpx};
    }

    .address-info {
        margin-bottom: #{28rpx};
        word-break: break-all;
    }

    .city-service {
        width: 100%;
        margin-bottom: 10#{rpx};
        .info-box {
            margin-left: #{12rpx};
            .label {
                margin-bottom: #{10rpx};
                color: #999999;
                font-size: #{28rpx};
            }
        }
        .head {
            width: #{75rpx};
            height: #{75rpx};
        }
        .icon-box {
            padding: 0 #{30rpx};
            border-left: #{2rpx} solid #e2e2e2;
            .icon {
                width: #{45rpx};
                height: #{45rpx};
            }
        }
    }

    .city-service {
        width: 100%;
        margin-bottom: 10#{rpx};

        .await-man {
            margin-left: #{12rpx};
            font-size: #{28rpx};
            color: #666666;
        }

        .info-box {
            margin-left: #{12rpx};

            .info-label {
                margin-bottom: #{10rpx};
                color: #999999;
                font-size: #{28rpx};
            }
            .info {
                color: #666666;
                font-size: 28rpx;
            }
        }

        .head {
            width: #{75rpx};
            height: #{75rpx};
        }

        .icon-box {
            padding: 0 #{30rpx};
            border-left: #{2rpx} solid #e2e2e2;

            .icon {
                width: #{45rpx};
                height: #{45rpx};
            }
        }
    }
</style>