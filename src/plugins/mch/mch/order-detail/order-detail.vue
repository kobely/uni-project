<template>
    <app-layout>
        <image class="head-img" :src='mchImg.detail_bg'></image>
        <view v-if="status == 2 && order" class="head-txt main-between">
            <view class="status-txt">{{order.status_text}}</view>
        </view>
        <view v-else-if="status == 1 && order" class="head-txt main-between">
            <view class="status-txt" v-if="order.is_sale == 1">已完成</view>
            <view class="status-txt" v-else-if="order.cancel_status == 2">取消订单 待处理</view>
            <view class="status-txt" v-else-if="order.is_pay == 0 && order.pay_type != 2">等待买家付款</view>
            <view class="status-txt" v-else-if="order.is_send == 0">等待卖家发货</view>
            <view class="status-txt" v-else-if="order.is_confirm == 0">卖家已发货</view>
            <view class="status-txt" v-else-if="order.is_confirm == 1">买家已收货</view>
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
        <view class="user-info" v-if="order">
            <image class="localhost-img" src='./../../image/localhost.png'></image>
            <view class="user-text">
                <text class="name">{{status == 2 && order.order ? order.order.name: order.name}}</text>
                <text v-if="order.order && order.order.address">{{status == 2 && order.order?order.order.mobile:order.mobile}}</text>
            </view>
            <view class='user-text address-info' v-if="order.address || (order.order && order.order.address)">{{status == 2 && order.order ?order.order.address:order.address}}</view>
            <view class='user-text address-info' v-else>{{status == 2 && order.order ?order.order.mobile:order.mobile}}</view>
            <view class='main-center area'>
                <view @click='toCall(order)' class="detail-btn">联系收货人</view>
                <view class="line"></view>
                <view class="detail-btn" @click='copy'>复制地址</view>
            </view>
        </view>
        <view class="express" v-if="detail && detail.express">
            <image class="logo" src='./../../image/express.png'></image>
            <view class="express-company">{{detail.express}}</view>
            <view class="express-number">运单编号：{{detail.express_no}}</view>
        </view>
        <view class="express" v-else-if="order && order.express">
            <image class="logo" src='./../../image/express.png'></image>
            <view class="express-company">{{order.express}}</view>
            <view v-if="order.express" class="express-number">运单编号：{{order.express_no}}</view>
        </view>
        <view v-if="(detail.detailExpress && detail.detail && detail.detailExpress.length === 1 && detail.detail.length === 1) || (order.detailExpress && order.detail && order.detailExpress.length === 1 && order.detail.length === 1)">
            <view @click="toExpressInfo(detail)" class="express" v-if="detail.detailExpress && detail.detailExpress[0].express_no">
                <image class="logo" src='./../../image/express.png'></image>
                <view class="express-company">{{detail.detailExpress[0].express}}</view>
                <view class="express-number">运单编号：{{detail.detailExpress[0].express_no}}</view>
                <image v-if="detail.detailExpress[0].express" class="to-more" src='/static/image/icon/arrow-right.png'></image>
            </view>
            <view @click="toExpressInfo(order)" class="express" v-else-if="order.detailExpress[0].express_no">
                <image class="logo" src='./../../image/express.png'></image>
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
        <view class="goods-info" v-if="order">
            <view class="goods-title">自营商品</view>
            <view v-for="goods in order.detail" class="goods" :key="goods.id">
                <image class="goods-img" :src='goods.goods_info.pic_url'></image>
                <view class='t-omit goods-name'>{{goods.goods_info.name}}</view>
                <view class="goods-attr t-omit-two">
                    <text v-for="attr in goods.goods_info.attr_list" :key="attr.attr_id">{{attr.attr_group_name}}:{{attr.attr_name}}</text>
                </view>
                <view class="goods-num">x{{goods.num}}</view>
                <view class="goods-price">￥{{goods.total_original_price}}</view>
            </view>
            <view v-if="status == 1">
                <view class="main-between price-item">
                    <view class="price-label">商品总价</view>
                    <view>￥{{ order.total_goods_price }}元</view>
                </view>
                <view class="main-between price-item">
                    <view class="price-label">运费</view>
                    <view>￥{{ order.express_price }}元</view>
                </view>
                <view class="main-between price-item" v-if="order.member_discount_price > 0">
                    <view class="price-label">会员折扣</view>
                    <view>￥{{ order.member_discount_price }}元</view>
                </view>
                <view class="main-between price-item" v-if="order.integral_deduction_price > 0">
                    <view class="price-label">积分抵扣</view>
                    <view>￥-{{ order.integral_deduction_price }}元</view>
                </view>
                <view class="main-between price-item" v-if="order.coupon_discount_price > 0">
                    <view class="price-label">优惠券抵扣</view>
                    <view>￥-{{ order.coupon_discount_price }}元</view>
                </view>
                <view class="main-between price-item" v-if="order.full_reduce_price > 0">
                  <view class="price-label">满减</view>
                  <view>-￥{{ order.full_reduce_price }}</view>
                </view>
                <view class="main-between price-item" style='margin-bottom: 0'>
                    <view class="price-label total-label">订单总价</view>
                    <view class="total-price">￥{{ order.total_pay_price }}元</view>
                </view>
            </view>
            <view v-if="order.detail && status == 2">
                <view class="main-between price-item">
                    <view class="price-label">商品总价</view>
                    <view>￥{{ order.detail[0].total_price }}元</view>
                </view>
                <view class="main-between price-item" style='margin-bottom: 0'>
                    <view class="price-label total-label">退货金额</view>
                    <view class="total-price">￥{{ order.detail[0].unit_price }}元</view>
                </view>
            </view>
        </view>
        <view v-if="order" class='goods-info mch-goods'>
            <view class='goods-title'>订单信息</view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">{{status == 1? '下单时间':'申请时间'}}:</view>
                <view>{{order.created_at}}</view>
            </view>
            <view class="dir-left-nowrap price-item">
                <view class="price-label">订单号:</view>
                <view>{{order.order_no}}</view>
            </view>
            <view class="dir-left-nowrap price-item" v-if="order.words">
                <view class="price-label">卖家备注:</view>
                <view>{{order.words}}</view>
            </view>
            <view class="dir-left-nowrap price-item" v-if="order.remark">
                <view class="price-label">买家备注:</view>
                <view>{{order.remark}}</view>
            </view>
            <view v-if="status == 1" class="dir-left-nowrap price-item">
                <view class="price-label">支付方式:</view>
                <view v-if="order.pay_type == 1">线上支付</view>
                <view v-else-if="order.pay_type == 3">余额支付</view>
                <view v-else-if="order.pay_type == 2">货到付款</view>
                <view v-else-if="order.pay_type == 4">现金</view>
                <view v-else-if="order.pay_type == 5">pos机</view>
                <view v-else>未支付</view>
            </view>
            <view v-if="status == 1" class="dir-left-nowrap price-item">
                <view class="price-label">收货方式:</view>
                <view v-if="order.send_type == 1">到店自提</view>
                <view v-if="order.send_type == 0">快递配送</view>
            </view>
            <view v-if="order.order_form != '[]'" v-for="item in order.order_form" :key="item" class="dir-left-nowrap price-item">
                <view class="price-label">{{item.label}}:</view>
                <view v-if="item.key == 'img_upload'"><image @click='look(item.value)' class="form-img" :src='item.value'></image></view>
                <view v-else>{{item.value}}</view>
            </view>
        </view>
        <view class='goods-info' v-if="order && showForm&& status == 1">
            <view class='goods-title form-title'>其他信息</view>
            <view v-for="(goods,idx) in order.detail" :class="['goods-form', `${idx == 0? 'more':''}`]" :key="goods.id">
                <view class="goods" v-if="order.detail.length > 1">
                    <image class="goods-img" :src='goods.goods_info.pic_url'></image>
                    <view class='t-omit goods-name'>{{goods.goods_info.name}}</view>
                    <view class="goods-attr t-omit-two">
                        <text v-for="attr in goods.goods_info.attr_list" :key="attr.attr_id">{{attr.attr_group_name}}:{{attr.attr_name}}</text>
                    </view>
                    <view class="goods-num">x{{goods.num}}</view>
                    <view class="goods-price">￥{{goods.total_original_price}}</view>
                </view>
                <view v-for="(item,index) in goods.form_data" v-if="goods.form_data && item.value && order.sign !== 'booking'" :key="index" :class="[ `${item.key !== 'img_upload' ? 'dir-left-nowrap' : ''}`,`price-item`]">
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
                <view v-for="(item,index) in order.order_form" v-if="goods.form_data && item.value && order.sign === 'booking'" :key="index" :class="[ `${item.key !== 'img_upload' ? 'dir-left-nowrap' : ''}`,`price-item`]">
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
        </view>
        <view :class="['bottom-place', `${iphone_x? 'iphone_x':''}`]"></view>
        <view :class="['dir-right-nowrap','btn', `${iphone_x ? 'iphone_x':''}`]" v-if="order && (order.is_confirm != 1 || status == 2)">
            <view @click="toAgreeCancel(order)" v-if="order.cancel_status == 2" class="handle-btn other">同意</view>
            <view @click="beNotRefund(order)" v-if="order.cancel_status == 2" class="handle-btn">拒绝</view>
            <view @click="toChange(order)" v-if="order.cancel_status == 0 && order.is_pay == 0 && order.is_send == 0" class="handle-btn other">修改价格</view>
            <view @click="toSend(order)" v-if="order.cancel_status == 0 && order.is_send == 0 && order.is_pay == 1" class="handle-btn other">发货</view>
            <view @click="toSend(order)" v-else-if="order.cancel_status == 0 && order.is_send == 0 && order.pay_type == 2" class="handle-btn other">发货</view>

            <view open-type="navigate" @click="toSend(order)" v-if="order.cancel_status == 0 && order.is_send == 1 && order.is_confirm == 0 && order.detailExpress.length > 0 && status != 2" class="handle-btn other">修改物流信息</view>
            <view @click="toCancelorder(order)" v-if="order.is_send == 0 && order.cancel_status == 0" class="handle-btn">取消订单</view>
            <view @click="toChangeAddress(order)" v-if="order.action_status && order.action_status.is_edit_address == 1" class="handle-btn">修改地址</view>
            <view @click.stop="toRefund(order)" v-if="order.status_text == '待退款' && order.type != 2" class="handle-btn other">退款</view>
            <view @click="toSend(order)" v-if="order.is_confirm == 0 && status == 2 && order.is_send == 1 && order.type == 2" class="handle-btn other">发货</view>
            <view @click.stop="refundHandle(2,order,1)" v-if="status == 2 && order.status == 2 && order.status_text != '已换货' && order.status_text != '已退款'" :class="['handle-btn',`${order.status_text == '待商家处理' || order.status_text == '待退款'?'':'other'}`]">取消售后</view>
            <view @click="refundHandle(1,order)" v-if="status == 2 && order.status == 1" class="handle-btn other">同意</view>
            <view @click="refundHandle(2,order)" v-if="status == 2 && order.status == 1" class="handle-btn">拒绝</view>
            <view @click="lookAbout(order)" v-if="status == 2" class="handle-btn">售后理由</view>
        </view>

        <view class="bg cross-center" v-if="chooseTime || isRefund || noRefund || changePrice || cancelOrder || callPhone || isSend || notRefund || isReason || openAddress || noAddress || beToSend">
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
                    <view class="submit-btn be-submit" v-if="status == 1" @click='cancelSubmit'>确认</view>
                    <view class="submit-btn be-submit" v-if="status == 2" @click='agree'>确认</view>
                </view>
            </view>
            <view class="dialog-bg" :style="{'display': `${noRefund || notRefund ? 'block' : 'none'}`}"></view>
            <!-- 拒绝退款 -->
            <view class="dialog" v-if="noRefund || notRefund">
                <view v-if="noRefund" class="dialog-title">拒绝取消</view>
                <view v-if="notRefund" class="dialog-title">拒绝售后</view>
                <textarea fixed class="textarea" bindinput="toAbout" placeholder="请输入拒绝理由" placeholder-style="color:#999999;font-size:14px" auto-focus />
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view v-if="noRefund" class="submit-btn be-submit" @click='noCancel'>确认</view>
                    <view v-if="notRefund" class="submit-btn be-submit" @click='decline(0)'>确认</view>
                </view>
            </view>
            <!-- 提示 -->
            <view class="dialog" v-if="noAddress">
                <view class="main-center cancel-tip">请到商户后台添加退货地址</view>
                <view class="main-center btn-area">
                    <view class="submit-btn be-submit" @click='cancel'>确认</view>
                </view>
            </view>
            <!-- 改价 -->
            <view class="dialog" v-if="changePrice">
                <view class="dialog-title">修改价格</view>
                <view class="dir-left-nowrap change-price-item">
                    <view class="label">商品总价</view>
                    <view class="money">￥</view>
                    <input type="digit" class="price-input" @input="priceInput" focus v-model='price'></input>
                </view>
                <view class="dir-left-nowrap change-price-item">
                    <view class="label">运费</view>
                    <view class="money">￥</view>
                    <input type="digit" class="price-input" @input="expressInput" focus v-model='express'></input>
                </view>
                <view class="dir-left-nowrap change-price-item">
                    <view class="label">合计</view>
                    <view class="change-total-price">{{total}}</view>
                </view>
                <view class="main-center btn-area">
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
                    <view class="submit-btn be-submit" @click='cancelSubmit'>确认</view>
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
                    <view @click="setSendType(0)" :class="[`${sendType == 0 ? 'active':'' }`, 'send-item']">快递配送</view>
                    <view @click="setSendType(1)" :class="[`${sendType == 1 ? 'active':'' }`, 'send-item']">无需物流</view>
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
                    <view class="reason-content">{{order.remark}}</view>
                    <view v-if="order.pic_list.length > 0" class="reason-title">图片</view>
                    <view class="dir-left-wrap reason-img" v-if="order.pic_list.length > 0">
                        <image @click='look(item)' v-for="item in order.pic_list" :key="item" :src="item"></image>
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
                    <view class="add-item" v-for="item in address" :key="item">
                        <image v-if="item.id == addressId" @click='chooseAddress(item.id)' src="./../../image/apply-ok.png"></image>
                        <image v-else @click='chooseAddress(item.id)' src="./../../image/apply-er.png"></image>
                        <view @click='chooseAddress(item.id)' class="add-info">
                            <view class="main-between">
                                <view class="add-name">{{item.name}}</view>
                                <view>{{item.mobile}}</view>
                            </view>
                            <view>{{item.address_detail}}</view>
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

    import { mapState } from "vuex";

    export default {
        data() {
            return {
                mch_id: 0,
                order: {
                    total_pay_price: '',
                    express_price: '',
                    total_goods_price: '',
                    total_goods_original_price: ''
                },
                cancelRefund: false,
                addressId: '0',
                notRefund: false,
                isRefund: false,
                openAddress: false,
                isReason: false,
                beToSend: false,
                showForm: false,
                noAddress: false,
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
                today: '',
                yesterday: '',
                weekday: '',
                chooseTime: false,
                noRefund: false,
                cancelOrder: false,
                detail: {},
                changePrice: false,
                callPhone: false,
                custom: false,
                mobile: '',
                isSend: false,
                sendType: 0,
                price: 0,
                express: 0,
                total: 0,
                about: '',
                reset_time: 0,
                dd: 0,
                hh: 0,
                mm: 0,
                status: 1,
                first: false,
                refund_price: 0,
                iphone_x: false
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                mchImg: state => state.mallConfig.__wxapp_img.mch,
            })
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
            setSendType(e) {
                this.sendType = e;
            },
            imageFormLoad(idx,index) {
                this.order.detail[idx].form_data[index].loadOver = false;
            },
            toChangeAddress(item) {
                this.beToSend = false;
                let order_no = this.order.order_no ? this.order.order_no : this.detail.order_no
                uni.navigateTo({
                    url: '/plugins/mch/mch/change-add/change-add?mch_id='+this.mch_id+'&order_no='+order_no
                })
            },
            copy() {
                this.$utils.uniCopy({
                    data: this.status == 2 ? this.order.order.address:this.order.address,
                    success() {
                        //#ifndef MP-WEIXIN
                        uni.showToast({title: '复制成功'});
                        // #endif
                    },
                })
            },
            look(e) {
                uni.previewImage({
                    current: e, // 当前显示图片的http链接
                    urls: [e] // 需要预览的图片http链接列表
                })
            },
            agree() {
                let that = this;
                if (that.detail.refund_price > 0) {
                    uni.showLoading({
                        title: '处理中...'
                    });
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
            toSendType() {
                let that = this;
                if (that.sendType == 1) {
                    if (that.status == 2) {
                        uni.showLoading({
                            title: '加载中...'
                        });
                        that.$request({
                            url: that.$api.mch.refund_handle,
                            data: {
                                is_express: 0,
                                merchant_remark: '',
                                type: that.detail.type,
                                mch_id: that.mch_id,
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
                    }
                } else {
                    that.isSend = false;
                    if (that.status == 2) {
                        uni.navigateTo({
                            url: '/plugins/mch/mch/send/send?order_refund_id=' + this.detail.id + '&mch_id=' + this.mch_id + '&is_send=' + that.detail.is_send
                        })
                    } else {
                        uni.navigateTo({
                            url: '/plugins/mch/mch/send/send?id=' + this.detail.id + '&mch_id=' + this.mch_id + '&is_send=' + that.detail.is_send
                        })
                    }
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
            getList() {
                let that = this;
                that.about = '';
                let url = that.$api.mch.order_detail;
                if(that.status == 2) {
                    url = that.$api.mch.refund_detail;
                }
                that.$request({
                    url: url,
                    data: {
                        id: that.id,
                        mch_id: that.mch_id,
                    }
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.first = true;
                        let order = response.data.detail;
                        if(that.status == 2) {
                            that.address = response.data.address;
                        }else {
                            order.address = order.address.replace(/\s*/g, "");
                        }
                        let reset_time = 0;
                        if (order.auto_cancel > 0) {
                            reset_time = order.auto_cancel;
                        } else if (order.auto_confirm > 0) {
                            reset_time = order.auto_confirm;
                        } else if (order.auto_sales > 0) {
                            reset_time = order.auto_sales;
                        }
                        that.showForm = false;
                        if(order.detail.length > 0) {
                            for(let i in order.detail) {
                                if(order.detail[i].form_data != null && order.detail[i].form_data.length > 0) {
                                    for(let item of order.detail[i].form_data) {
                                        if(item.value != null) {
                                            that.showForm = true;
                                        }
                                    }
                                }
                            }
                        }
                        that.order = order;
                        that.reset_time = reset_time;
                        setInterval(function() {
                            that.getTime();
                        }, 1000)
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
            toCall(e) {
                if(this.status == 1) {
                    this.mobile = e.mobile;
                }else {
                    this.mobile = e.order.mobile;
                }
                this.callPhone = !this.callPhone;
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
                        mch_id: that.mch_id,
                        is_agree: type,
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
            call() {
                uni.makePhoneCall({
                    phoneNumber: this.mobile
                })
                this.callPhone = !this.callPhone;
            },
            toRefund(e) {
                this.detail = e;
                this.refund_price = e.refund_price;
                this.isRefund = !this.isRefund;
            },
            // 取消
            cancel() {
                this.about = '';
                this.date_start = '';
                this.date_end = '';
                this.isRefund = false;
                this.beToSend = false;
                this.chooseTime = false;
                this.noRefund = false;
                this.changePrice = false;
                this.cancelOrder = false;
                this.callPhone = false;
                this.isSend = false;
                this.notRefund = false;
                this.openAddress = false;
                this.isReason = false;
                this.noAddress = false;
                this.addressId = 0;
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
            cancelSubmit() {
                let that = this;
                uni.showLoading({
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.mch.cancel,
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
                        that.list = [];
                        that.isRefund = false;
                        that.cancelOrder = false;
                        that.page = 1;
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
            lookAbout(e) {
                this.detail = e;
                this.isReason = true;
            },
            chooseAddress(e) {
                if (this.addressId == e) {
                    this.addressId = ''
                }else {
                    this.addressId = e
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
            },
            beNotRefund(e) {
                this.detail = e;
                this.noRefund = !this.noRefund;
            },
            toCancelorder(e) {
                this.detail = e;
                this.cancelOrder = !this.cancelOrder;
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
            toSend(e) {
                this.detail = e;
                if(e.send_type == 1 && !e.address) {
                    this.beToSend = true;
                }else {
                    this.isSend = true;
                }
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
            toAgreeCancel(e) {
                this.detail = e;
                this.isRefund = !this.isRefund;
            },
        },
        onShow: function() {
            if(this.first) {
                this.getList();
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
            that.id = options.id;
            that.status = options.status;
            that.mch_id = options.mch_id;
            that.getList();
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

    .dialog-bg {
        width: 100%;
        height: 100%;
        position: fixed;
        background-color: rgba(0, 0, 0, 0.5);
        left: 0;
        top: 0;
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
        top: #{40rpx};
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
        width: 50%;
        height: #{72rpx};
        text-align: center;
        line-height: #{72rpx};
        color: #ff4544;
        font-size: #{24rpx};
    }

    .line {
        position: absolute;
        top: #{16rpx};
        left: 0;
        right: 0;
        width: #{1rpx};
        margin: 0 auto;
        background-color: #e2e2e2;
        height: #{40rpx};
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

    .price-label {
        color: #999;
        font-size: #{24rpx};
    }

    .total-price {
        font-size: #{28rpx};
        color: #ff4544;
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

    .handle-btn {
        height: #{48rpx};
        line-height: #{46rpx};
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
        border: #{1rpx} solid #ddd;
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
        border: #{1rpx} solid #ff4544;
    }

    .btn-area {
        height: #{88rpx};
        position: relative;
        border-top: #{1rpx} solid #e2e2e2;
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

    .bg {
        background-color: rgba(0, 0, 0, .3);
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 100;
    }

    .time-title {
        margin-left: #{32rpx};
        color: #666;
        font-size: #{28rpx};
        margin-bottom: #{20rpx};
    }

    .choose-time {
        position: relative;
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

    .bottom-place {
        height: #{120rpx};
    }

    .bottom-place.iphone_x {
        height: #{170rpx};
    }

    .refund-price {
        width: #{160rpx};
        border: #{1rpx} solid #e2e2e2;
        border-radius: #{5rpx};
        font-size: #{32rpx};
        padding: 0 #{5rpx};
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

    .mch-goods .goods-title {
        margin-bottom: #{24rpx};
    }

    .mch-goods .price-label {
        margin-right: #{20rpx};
    }

    .form-img {
        height: #{120rpx};
        width: #{120rpx};
        margin-right: #{10rpx};
        margin-top: #{10rpx};
    }

    .refund-tip {
        font-size: #{32rpx};
        color: #353535;
        margin: #{4rpx} 0 #{45rpx};
    }

    .change-total-price {
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

    .reason {
        padding-left: #{32rpx};
    }

    .btn-area.other-btn-area {
        margin-top: #{10rpx};
    }

    .refund-pay {
        font-size: #{36rpx};
        color: #353535;
        font-weight: blod;
    }

    .goods-name {
        padding-top: #{5rpx};
    }

    .address-info {
        margin-bottom: #{28rpx};
    }
</style>