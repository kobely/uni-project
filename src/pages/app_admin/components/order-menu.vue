<template>
	<view>
	    <view class="dir-right-nowrap" v-if="item.action_status">
	        <!-- 换货确认收货 -->
	        <view @click.stop="toConfirm(item)" v-if="item.action_status.is_show_confirm == 1" class="handle-btn other">确认收货</view>
	        <!-- 退货确认退款 -->
	        <view @click.stop="toRefund(item)" v-if="item.action_status.is_show_refund == 1" class="handle-btn other">退款</view>
	        <view @click.stop="refundHandle(2,item,1)" v-if="item.action_status.is_show_cancel_refund" :class="['handle-btn', `${num == 1 || num == -1?'other':''}`]">取消售后</view>
	        <!-- 换货发货 -->
	        <view @click.stop="toSend(item)" data-send="1" v-if="item.is_confirm == 0 && status == 2 && item.is_send == 1 && item.type == 2 && item.order.send_type == 0" class="handle-btn other">发货</view>
	        <!-- 买家申请售后 -->
	        <view @click.stop="refundHandle(1,item)" v-if="item.action_status.is_show_apply == 1" class="handle-btn other">同意</view>
	        <view @click.stop="refundHandle(2,item)" v-if="item.action_status.is_show_apply == 1" class="handle-btn">拒绝</view>
	        <view @click.stop="lookAbout(item)" v-if=" status == 2" class="handle-btn">售后理由</view>
	        <!-- 取消订单操作 -->
	        <view v-if="item.cancel_status == 2" @click.stop="toAgreeCancel(item)" class="handle-btn other">同意</view>
	        <view v-if="item.cancel_status == 2" @click.stop="beNotRefund(item)" class="handle-btn">拒绝</view>
	        <view v-if="item.cancel_status == 0 && item.is_pay == 0 && item.is_send == 0" @click.stop="toChange(item)" class="handle-btn other">修改价格</view>
	        <view v-if="item.action_status.is_confirm_order == 1" @click.stop="toConfirm(item)" class="handle-btn other">确认收货</view>
	        <view v-if="item.cancel_status == 0 && item.is_send == 1 && item.is_confirm == 0 && item.detailExpress && item.detailExpress.length > 0" @click.stop="toSend(item,2)" class="handle-btn">{{item.send_type == 2 ? '修改配送员' : '修改物流信息'}}</view>
	        <view @click="toExpressInfo(item)" v-if="item.cancel_status == 0 && item.is_send == 1 && item.is_confirm == 0 && item.detailExpress && item.detailExpress.length > 0" class="handle-btn other">查看物流</view>
	        <view @click.stop="toSend(item)" v-if="item.action_status.is_express_send == 1 || item.action_status.is_store_send == 1 || item.action_status.is_city_send == 1" class="handle-btn other">发货</view>
	        <view @click="toChangeAddress(item)" v-if="item.action_status.is_edit_address == 1 && item.address" class="handle-btn">修改地址</view>
	        <view @click.stop="toRefundOrder(item.order_no)" v-if="item.have_refund == 1 && status == 1 && item.is_sale == 0" class="handle-btn">售后中</view>
	        <view @click.stop="toCancelorder(item)" v-if="item.sign != 'gift' && item.action_status.is_coerce_cancel == 1" class="handle-btn">取消订单</view>
	        <view @click="toExpressInfo(item)" v-if="status == 2 && item.detailExpress && item.detailExpress.length > 0 && item.status == 2" class="handle-btn">物流详情</view>
	        <view v-if="status == 1 && !hiddenRemark" @click.stop="makeRemark(item)" class="handle-btn">备注</view>
	    </view>
        <view class="bg cross-center" v-if="isRefund || noRefund || changePrice || cancelOrder || item.showMobile || notRefund || isReason || openAddress || noAddress || beRemark || confirmOrder || refundOnly || cityRefund || beToSend">
            <!-- 退款 -->
            <view class="dialog" v-if="isRefund">
                <view class="dialog-title">退款</view>
                <view class="main-center cross-center refund-pay">￥
                    <input class="refund-price" type='digit' v-model="refund_price" />
                </view>
                <view class="main-center refund-tip">是否确认退款给买家</view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" v-if="status == 2" @click='agree'>确认</view>
                </view>
            </view>
            <view class="dialog-bg" :style="{'display': `${notRefund ? 'block' : 'none'}`}"></view>
            <!-- 拒绝退款 -->
            <view class="dialog" v-if="notRefund">
                <view class="dialog-title">拒绝售后</view>
                <textarea fixed class="textarea" v-model="about" placeholder="请输入拒绝理由" placeholder-style="color:#999999;font-size:14px" auto-focus />
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view v-if="notRefund" class="submit-btn be-submit" @click='decline(0)'>确认</view>
                </view>
            </view>
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
            <!-- 备注 -->
            <view class="dialog" v-if="beRemark">
                <view class="dialog-title">备注</view>
                <view class="remark-input">
                    <input maxlength="15" v-model="remark" placeholder="请输入备注内容(限15个字符)">
                </view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='toRemark'>确认</view>
                </view>
            </view>
            <!-- 改价 -->
            <view class="dialog" v-if="changePrice">
                <view v-if="changePrice" class="dialog-title">修改价格</view>
                <view v-if="changePrice" class="dir-left-nowrap change-price-item">
                    <view class="label">商品总价</view>
                    <view class="money">￥</view>
                    <view class="price-input" v-if="detail.sign == 'gift'">{{price}}</view>
                    <input v-else fixed type="digit" class="price-input" @input="priceInput" :focus="changePrice?true:false" v-model='price'/>
                </view>
                <view v-if="changePrice" class="dir-left-nowrap change-price-item">
                    <view class="label">运费</view>
                    <view class="money">￥</view>
                    <input fixed type="digit" class="price-input" @input="expressInput" focus v-model='express'/>
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
            <!-- 仅退款订单 -->
            <view class="dialog" v-if="refundOnly">
                <view class="main-center cancel-tip">是否同意用户仅退款（无需退货）申请?</view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='decline(3)'>确认</view>
                </view>
            </view>
            <!-- 非快递订单 -->
            <view class="dialog" v-if="cityRefund">
                <view class="dir-top-nowrap cross-center main-center cancel-tip dialog-refund-tip" v-if="detail.order.send_type == 1">
                    <view>该订单为到店自提订单</view>
                    <view>需买家到店退换货</view>
                </view>
                <view class="dir-top-nowrap cross-center main-center cancel-tip dialog-refund-tip" v-if="detail.order.send_type == 2" >
                    <view>该订单为同城配送订单</view>
                    <view>需商家上门取货</view>
                </view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='decline(4)'>确认</view>
                </view>
            </view>
            <!-- 售后确认收货 -->
            <view class="dialog" v-if="confirmOrder">
                <view class="main-center cancel-tip">是否确认收货?</view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" v-if="status == 1" @click='beOrderConfirm'>确认</view>
                    <view class="submit-btn be-submit" v-else @click='beConfirm'>确认</view>
                </view>
            </view>
            <!-- 打电话  -->
            <view class="dialog" v-if="item.showMobile">
                <view class="main-center cancel-tip">{{status == 2 ? item.order.mobile : item.mobile}}</view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='call'>确认</view>
                </view>
            </view>
            <!-- 提示 -->
            <view class="dialog" v-if="noAddress">
                <view class="main-center dir-top-nowrap cancel-tip" style="text-align: center">
                    <view>您还没有退货地址</view>
                    <view>请先设置</view>
                </view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='noAddress=false'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='toRefundAdd'>去设置</view>
                </view>
            </view>
            <!-- 理由 -->
            <view class="dialog get-top" v-if="isReason && detail">
                <view v-if="status == 2" class="dialog-title">售后理由</view>
                <view v-if="status == 1 && !noRefund" class="dialog-title">同意取消</view>
                <view v-if="status == 1 && noRefund" class="dialog-title">拒绝取消</view>   
                <view class="reason">
                    <template v-if="(status == 2 && detail.refund_data.cause) || (status == 1 && detail.cancel_data.cause)">
                        <view class="reason-title">{{detail.type == 2 && status == 2 ? '换货原因' : '退款原因'}}</view>
                    <view class="reason-content">{{status == 1 ? detail.cancel_data.cause : detail.refund_data.cause}}</view>
                    </template>
                    <template v-if="detail.type != 2">
                        <view class="reason-title">退款金额</view>
                        <view class="reason-content">￥{{status == 1 ? detail.total_pay_price : detail.refund_price}}</view>
                    </template>
                    <template v-if="(status == 2 &&detail.remark) || detail.cancel_data.remark">
                        <view class="reason-title">备注信息</view>
                        <view class="reason-content" :class="{'two-line':!showRemark}">{{status == 1 ? detail.cancel_data.remark : detail.remark}}</view>
                        <view v-if="(status == 2 && detail.remark && detail.remark.length > 40) || (detail.cancel_data && detail.cancel_data.remark && detail.cancel_data.remark.length > 40)" class="main-center cross-center show-remark">
                            <view @click="showRemark=!showRemark">{{showRemark ? '点击收起' : '点击展开'}}</view>
                            <image v-if="!showRemark" src="/static/image/icon/icon-down.png"></image>
                            <image v-else src="/static/image/icon/icon-up.png"></image>
                        </view>
                    </template>
                    <template v-if="(status == 2 && detail.mobile) || detail.cancel_data.mobile">
                        <view class="reason-title">联系方式</view>
                        <view class="reason-content">{{status == 1 ? detail.cancel_data.mobile : detail.mobile}}</view>
                    </template>
                    <view v-if="detail.pic_list && detail.pic_list.length > 0" class="reason-title">图片</view>
                    <view class="dir-left-wrap reason-img" v-if="detail.pic_list &&detail.pic_list.length > 0">
                        <image mode="aspectFill" @click='look(item)' v-for="item in detail.pic_list" :key="item" :src="item"></image>
                    </view>
                    <view v-if="detail.cancel_data && detail.cancel_data.image_list && detail.cancel_data.image_list.length > 0" class="reason-title">图片凭证</view>
                    <view class="dir-left-wrap reason-img" v-if="detail.cancel_data && detail.cancel_data.image_list && detail.cancel_data.image_list.length > 0">
                        <image mode="aspectFill" @click='look(item)' v-for="item in detail.cancel_data.image_list" :key="item" :src="item"></image>
                    </view>
                </view>
                <textarea v-if="status == 1 && noRefund" fixed class="textarea" v-model="about" placeholder="请输入拒绝理由" placeholder-style="color:#999999;font-size:14px" auto-focus />
                <textarea v-if="status == 1 && !noRefund" fixed class="textarea" v-model="about" placeholder="请输入同意理由" placeholder-style="color:#999999;font-size:14px" auto-focus />
                <view v-if="status == 1" class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='cancelSubmit(1)'>确认</view>
                </view>
                <view v-else class="main-center btn-area other-btn-area">
                    <view class="submit-btn be-submit" @click='cancel'>确认</view>
                </view>
            </view>
            <!-- 选地址 -->
            <view class="dialog" v-if="openAddress">
                <view class="dialog-title">选择退货地址</view>
                <view class="add-list">
                    <view class="add-item" v-for="item in address" :key="item.id">
                        <image v-if="item.id == addressId" @click='chooseAddress(item.id)' src="./../image/active.png"></image>
                        <image v-else @click='chooseAddress(item.id)' src="/static/image/icon/form-er.png"></image>
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
    </view>
</template>

<script>
    export default {
        name: "order-menu",
	    props: {
            item: {
                type: Object
            },
            address: {
            	type: Array
            },
            mobile: {
            	type: String
            },
            hiddenRemark: {
            	type: Boolean,
            	default() {
            		return false
            	}
            },
            status: {
            	type: Number
            },
            num: {
                type: String
            }
	    },
	    data() {
            return {
	    		detail: {},
                isRefund: false,
                noRefund: false,
                changePrice: false,
                cancelOrder: false,
                callPhone: false,
                notRefund: false,
                isReason: false,
                openAddress: false,
                noAddress: false,
                beRemark: false,
                confirmOrder: false,
                refundOnly: false,
                cityRefund: false,
                beToSend: false,
                showRemark: false,
                price: 0,
                express: 0,
                total: 0,
                refund_price: 0,
                addressId: '0',
                remark: '',
                about: '',
	    	}
	    },
	    methods: {
            // 取消
            cancel() {
            	if(this.item.showMobile) {
            		this.item.showMobile = false;
                	this.$emit('change', this.item);
            	}else {
	                this.about = '';
	                this.isRefund = false;
	                this.beToSend = false;
	                this.noRefund = false;
	                this.changePrice = false;
	                this.cancelOrder = false;
	                this.custom = false;
	                this.refundOnly = false;
	                this.cityRefund = false;
	                this.notRefund = false;
	                this.openAddress = false;
	                this.isReason = false;
	                this.confirmOrder = false;
	                this.addressId = 0;
	                this.beRemark = false;
	                this.confirmOrder = false;
	                this.remark = null;
            	}
            },
            // 去售后订单查看
            toRefundOrder(e) {
            	this.$emit('to', e);
            },
	    	// 备注
            makeRemark(data) {
                this.beRemark = true;
                this.detail = data;
                data.seller_remark ? this.remark = data.seller_remark : null;
            },
            // 提交备注
            toRemark() {
                let that = this;
                that.$request({
                    url: that.$api.app_admin.sellerRemark,
                    method: 'post',
                    data: {
                        order_id: that.detail.id,
                        seller_remark: that.remark
                    }
                }).then(response=>{
                    if(response.code === 0) {
                        that.detail.seller_remark =  that.remark;
                        that.cancel();
                		that.$emit('update', that.detail);
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                });
            },
            // 设置退货地址
            toRefundAdd() {
                this.noAddress = false;
                uni.navigateTo({
                    url: `/pages/address/address?manual_btn_bg=admin&is_hide_default_btn=1&is_refund_address=1`,
                })
            },
            // 改地址
            toChangeAddress(item) {
                this.beToSend = false;
                let order_no = item.order_no ? item.order_no : this.detail.order_no
                uni.navigateTo({
                    url: '/pages/app_admin/change-add/change-add?order_no='+order_no
                })
            },
            // 查看物流
            toExpressInfo(item) {
                if(item.detail.length === 1 && item.detailExpress[0].express_no) {
                    uni.navigateTo({
                        url: '/pages/app_admin/express/express?id='+item.id+'&express='+item.detailExpress[0].express+'&express_no='+item.detailExpress[0].express_no+'&customer_name='+item.detailExpress[0].customer_name
                    });
                }else {
                    uni.navigateTo({
                        url: '/pages/order/express-list/express-list?order_id='+item.id
                    });
                }
            },
            // 拨打电话
            call() {
                uni.makePhoneCall({
                    phoneNumber: this.status == 2 ? this.item.order.mobile : this.item.mobile
                })
                this.$emit('change', '');
            },
            // 确认收货提示
            toConfirm(e) {
                this.detail = e;
                this.confirmOrder = !this.confirmOrder;
            },
            // 确认收货
            beOrderConfirm() {
                let that = this;
                that.$request({
                    url: that.$api.app_admin.confirm,
                    data: {
                        order_id: that.detail.id
                    },
                    method: 'post'
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code === 0) {
                        uni.showToast({
                            title: response.msg,
                            duration: 1000,
                            type: 'success',
                            mask: false
                        });
                        that.cancel();
                        setTimeout(v=>{
                			that.$emit('update', 0);
                        },1000)
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            // 同意取消订单
            toAgreeCancel(e) {
                this.detail = e;
                this.isReason = !this.isReason;
                this.noRefund = false;
            },
            // 取消订单提示
            toCancelorder(e) {
                this.detail = e;
                this.cancelOrder = !this.cancelOrder;
            },
            // 取消订单
            cancelSubmit(type) {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                let url = type == 1 ? that.$api.app_admin.cancel : that.$api.app_admin.force_cancel
                that.$request({
                    url: url,
                    data: {
                        status: that.noRefund ? 2 : 1,
                        remark: that.about,
                        order_id: that.detail.id
                    },
                    method: 'post'
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        uni.showToast({
                            title: that.noRefund ? '拒绝成功':'取消成功',
                            duration: 1000,
                            type: 'success',
                            mask: false
                        });
                        that.cancel();
                        setTimeout(v=>{
                			that.$emit('update', 0);
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
            // 修改价格
            toChange(e) {
                this.detail = e;
                this.changePrice = !this.changePrice;
                this.price = e.total_goods_price;
                this.express = e.express_price;
                this.total = '￥' + e.total_pay_price;
            },
            // 价格输入验证
            priceInput: function(e) {
                if (e.detail.value > -0.01) {
                    this.total = '￥' + (+e.detail.value + +this.express).toFixed(2);
                } else {
                    this.total = '数据有误';
                }
            },
            // 邮费输入验证
            expressInput: function(e) {
                if (e.detail.value > -0.01) {
                    this.total = '￥' + (+e.detail.value + +this.price).toFixed(2);
                } else {
                    this.total = '数据有误';
                }
            },
            // 确认修改价格
            submitChange() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                if (this.price > -0.01 && this.express > -0.01) {
                    this.$request({
                        url: this.$api.app_admin.update_price,
                        data: {
                            order_id: this.detail.id,
                            total_price: this.price ? this.price : 0,
                            express_price: this.express ? this.express : 0
                        },
                        method: 'post'
                    }).then(response => {
                        uni.hideLoading();
                        if (response.code === 0) {
                            uni.showToast({
                                title: response.msg,
                                duration: 1000,
                                type: 'success',
                                mask: false
                            });
	                        that.changePrice = false;
	                		that.$emit('update', 0);
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
            // 发货
            toSend(e,is_send) {
                let that = this;
                that.detail = e;
                if (that.detail.status_cn) {
                    uni.navigateTo({
                        url: '/pages/app_admin/send/send?order_refund_id=' + that.detail.id + '&id=' + that.detail.order_id + '&send_type=' + that.detail.send_type + '&is_send=' + is_send
                    })
                } else {
                    if(that.detail.send_type == 1 && !that.detail.address) {
                        this.beToSend = true;
                    }else {
                        uni.navigateTo({
                            url: '/pages/app_admin/send/send?id=' + that.detail.id + '&send_type=' + that.detail.send_type + '&is_send=' + is_send
                        })
                    }
                }
            },
            // 售后操作


            // 选择退款地址
            chooseAddress(e) {
                if (this.addressId == e) {
                    this.addressId = ''
                }else {
                    this.addressId = e
                }
            },
            // 售后处理
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
                                	that.cancel();
			                        setTimeout(v=>{
			                			that.$emit('update', 0);
			                        },1000)
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
            // 同意售后
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
					                    that.cancel();
				                        setTimeout(v=>{
				                			that.$emit('update', 0);
				                        },1000)
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
            // 拒绝售后
            beNotRefund(e) {
                this.detail = e;
                this.isReason = !this.isReason
                this.noRefund = !this.noRefund;
            },
            // 售后操作
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
            // 退款提示
            toRefund(e) {
                this.detail = e;
                this.refund_price = e.refund_price;
                this.isRefund = !this.isRefund;
            },
            // 查看图片
            look(e) {
                uni.previewImage({
                    current: e, // 当前显示图片的http链接
                    urls: [e] // 需要预览的图片http链接列表
                })
            },
            // 查看售后理由
            lookAbout(e) {
                this.detail = e;
                this.isReason = true;
            },
            // 售后确认收货
            beConfirm() {
                let that = this;
                that.$request({
                    url: that.$api.app_admin.shou_huo,
                    data: {
                        refund_order_id: that.detail.id
                    },
                    method: 'post'
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code === 0) {
                        that.cancel();
                        that.page = 1;
                        uni.showLoading({
                            mask: true,
                            title: '加载中...'
                        });
                		that.$emit('update', 0);
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
	    }
    }
</script>

<style scoped lang="scss">
    .handle-btn {
        height: #{48rpx};
        display: flex;
        align-items: center;
        padding: 0 #{16rpx};
        border-radius: #{24rpx};
        border: #{2rpx} solid #bbb;
        color: #353535;
        font-size: #{24rpx};
        margin-left: #{16rpx};
        white-space: nowrap;
	    &.other {
	        border: #{2rpx} solid #446dfd;
	        color: #446dfd;
	    }
	}

    .bg {
        background-color: rgba(0, 0, 0, 0.3);
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 100;
	    .dialog {
	        width: #{620rpx};
	        border-radius: #{16rpx};
	        margin: 0 auto;
	        background-color: #fff;
	        z-index: 20;
	        &.get-top {
	            margin-top: #{-60rpx};
	        }
		    .dialog-title {
		        font-size: #{32rpx};
		        color: #353535;
		        width: #{620rpx};
		        margin: #{32rpx} auto #{40rpx};
		        text-align: center;
		    }
		    .cancel-tip {
		        font-size: #{32rpx};
		        color: #353535;
		        margin: #{74rpx} 0 #{60rpx};
		        &.dialog-refund-tip {
		            padding: 0 #{60rpx};
		            text-align: center;
		        }
		    }
		    .refund-pay {
		        font-size: #{36rpx};
		        color: #353535;
		        font-weight: bold;
		    }
		    .refund-tip {
		        font-size: #{32rpx};
		        color: #353535;
		        margin: #{4rpx} 0 #{45rpx};
		    }
		    .total-money {
		        margin-left: #{56rpx};
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
		    .change-price-item {
		        position: relative;
		        height: #{64rpx};
		        line-height: #{64rpx};
		        color: #353535;
		        font-size: #{28rpx};
		        margin-bottom: #{26rpx};
			    &:first-of-type {
			        margin-bottom: #{32rpx};
			    }
			    &:last-of-type {
			        margin: #{24rpx} 0 #{34rpx};
			    }
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
		        image {
			        height: #{180rpx};
			        width: #{180rpx};
			        margin: 0 #{8rpx} #{8rpx} 0;
			    }
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
			    &.delivery-item {
			        padding-left: #{64rpx};
			        margin-left: 0;
			        .add-name {
				        width: #{400rpx};
				    }
			    }
			    &:last-of-type {
			        border-bottom: 0;
			    }
			    image {
			        height: #{36rpx};
			        width: #{36rpx};
			        position: absolute;
			        left: #{-66rpx};
			        top: 50%;
			        margin-top: #{-18rpx};
			    }
			    .add-active {
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
		    }
		    .dialog-bg {
		        width: 100%;
		        height: 100%;
		        position: fixed;
		        background-color: rgba(0, 0, 0, 0.5);
		        left: 0;
		        top: 0;
		    }
		    .show-remark {
		        color: #999;
		        margin-bottom: #{12rpx};
		        font-size: #{24rpx};
		        image {
		            width: #{22rpx};
		            height: #{12rpx};
		            margin-left: #{16rpx};
		            display: block;
		        }
		    }
		    .refund-price {
		        width: #{160rpx};
		        border: #{2rpx} solid #e2e2e2;
		        border-radius: #{5rpx};
		        font-size: #{32rpx};
		        padding: 0 #{5rpx};
		    }
		    .btn-area {
		        height: #{88rpx};
		        position: relative;
		        border-top: #{2rpx} solid #e2e2e2;
		        &.other-btn-area {
			        margin-top: #{10rpx};
			    }
			    .line {
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
			        &.be-submit {
				        color: #446dfd;
				    }
			    }
		    }

	    }
    }
</style>