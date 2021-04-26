<template>
	<app-layout>
		<view class="cash">
			<view class="search">
                <view v-if="searchBool" style="position: relative">
    				<input placeholder="请输入昵称搜索" confirm-type="search" type="text" class="input" focus v-model="inputText" :focus="getFocus" @focus="getFocus=true" @blur="searchText" @confirm="getFocus=false">
                    <image v-if="inputText.length > 0" @click="clearSearch" class="search-clear" src="../image/clear.png"></image>
                </view>
				<view class="view dir-left-nowrap main-center cross-center" v-else @click="searchBool = true;getFocus=true">
					<image src="../image/icon-search.png"></image>
					<view>{{type === 'mch' ? '请输入订单号/店铺名/昵称搜索':'请输入昵称搜索'}}</view>
				</view>
			</view>
            <view v-if="titleShow" class="bar">
                <scroll-view class="scroll-view" scroll-x="true">
                    <view class="bar-item" :style="{'width': `${titleWidth}`}" v-for="item in tab" :key="item.key" @click="tabSwitch(item.key)">
                        <app-form-id>
                            <view :class="['bar-item-text',`${type === item.key ? 'text-active' : ''}`]">{{item.name}}
                                <view class="bar-item-tips">{{item.plugin}}</view>
                            </view>
                        </app-form-id>
                    </view>
                </scroll-view>
            </view>
			<view class="reply main-center cross-center reply-margin-search" :class="{'reply-margin-bar': titleShow}">
				<view class="reply-item unreviewed " :class="{'reply-item-active': status === 0}">
					<app-form-id @click="setStatus(0)">
						未审核
					</app-form-id>
				</view>
				<view class="reply-item unpaid" :class="{'reply-item-active': status === 1}">
					<app-form-id @click="setStatus(1)">
						未打款
					</app-form-id>
				</view>
			</view>
			<view class="content content-margin-search" :class="{'content-margin-bar': titleShow}">
				<view class="content-item dir-left-nowrap" v-for="(item, index) in list" :key="index">
					<view class="image">
						<image :src="item.user.avatar"></image>
					</view>
					<view class="app-content dir-top-nowrap">
						<view class="name">{{item.user.nickname}}</view>
						<view class="amount">提现金额：￥{{item.cash.price}}</view>
                        <view class="amount">手续费：￥{{item.cash.service_charge}}</view>
						<view class="pay dir-left-nowrap">
							<view class="pay-price-text">打款金额：</view>
							<view class="pay-price-number">￥{{item.cash.actual_price}}</view>
						</view>
						<view class="button-men dir-left-nowrap main-right cross-center">
                            <view class="button ordinary">
                                <app-form-id @click="toDetail(item)">
                                    提现详情
                                </app-form-id>
                            </view>
							<view class="button ordinary">
								<app-form-id @click="refuse(item)">
									拒绝
								</app-form-id>
							</view>
							<view class="button can" v-if="item.status == '0'">
								<app-form-id @click="byGo(item)">
									通过
								</app-form-id>
							</view>
							<view class="button can" v-if="item.status == '1'">
								<app-form-id @click="pay(item)">
									打款
								</app-form-id>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="no-tip" v-if="list.length === 0">
				<image src="https://v4test.zjhejiang.com/web/statics/img/app/app_admin/no-apply.png"></image>
				<view>没有任何申请哦~</view>
			</view>
			<view @touchmove.stop.prevent="" class="model" v-if="model">
				<view class="model-content">
					<view class="header">{{modelType === 2 ? '通过申请' : modelType === 3 ? '打款' : modelType === 1 ? '拒绝申请' :''}}</view>
					<view class="center">
						<template v-if="modelType === 1">
							<view class="free">
								<textarea class="textarea" placeholder="请填写拒绝理由" v-model="textarea"></textarea>
							</view>
						</template>
						<template v-if="modelType === 2">
							<view class="i-modal-body">
								<view>是否确认通过提现申请</view>
							</view>
						</template>
						<template v-if="modelType === 3">
							<view class="i-modal-body-free">
                                <view class="price" v-if="setItem.cash.actual_price > 0">￥{{setItem.cash.actual_price}}</view>
								<view class="price" v-else-if="setItem.money > 0">￥{{setItem.money}}</view>
								<view class="text">是否确认打款</view>
							</view>
						</template>
					</view>
					<view class="bottom dir-left-nowrap cross-center">
						<view class="but cancel">
							<app-form-id @click="model=false; modelType=-1">取消</app-form-id>
						</view>
						<view class="line"></view>
						<view class="but confirm">
							<app-form-id @click="confirm">确认</app-form-id>
						</view>
					</view>
				</view>
			</view>
            <u-mask :show="detailDialog" :maskClickAble="false" :zoom="false">
                <view class="dialog">
                    <view class="dialog-title">提现详情</view>
                    <view class="dialog-item dir-left-nowrap">
                        <view class="dialog-label">提现方式</view>
                        <view>{{detail.pay_type}}</view>
                    </view>
                    <view class="dialog-item dir-left-nowrap" v-if="detail.extra && detail.extra.name">
                        <view class="dialog-label">{{detail.pay_type == '微信线下转账' ? '微信昵称': detail.pay_type == '银行线下转账' ? '开户人':'支付宝姓名'}}</view>
                        <view>{{detail.extra.name}}</view>
                    </view>
                    <view class="dialog-item dir-left-nowrap" v-if="detail.extra && detail.extra.mobile">
                        <view class="dialog-label">{{detail.pay_type == '微信线下转账' ? '微信号': detail.pay_type == '银行线下转账' ? '银行卡号':'支付宝帐号'}}</view>
                        <view>{{detail.extra.mobile}}</view>
                    </view>
                    <view class="dialog-item dir-left-nowrap" v-if="detail.extra && detail.extra.bank_name">
                        <view class="dialog-label">开户行</view>
                        <view>{{detail.extra.bank_name}}</view>
                    </view>
                    <view @click="detailDialog=false" class="dialog-button">我知道了</view>
                </view>
            </u-mask>
		</view>
	</app-layout>
</template>

<script>
    import { mapState } from "vuex";
    import uMask from "../../../components/basic-component/u-mask/u-mask.vue";

    export default {
        name: "cash",
	    data() {
            return {
                tabList: [
                    {id:1, name: '出售中'},
                    {id:0, name: '下架中'}
                ],
                activeTab: '1',
                detailDialog: false,
                searchBool: false,
	            list: [],
                tab: [],
                detail: {},
                titleShow: false,
	            type: 'share',
                titleWidth: null,
                getFocus: false,
                status: 0,
	            over: false,
                model: false,
                modelType: -1,
                textarea: '',
	            setItem: {},
                page: 1,
                inputText: '',
            }
	    },
        components: {
            "u-mask": uMask
        },
	    onLoad(options) { this.$commonLoad.onload(options);
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.getTabs();
	    },
        onReachBottom() {
            if (!this.over) {
                this.page++;
                this.bottomRequest();
            }
        },
	    methods: {
            toDetail(detail) {
                this.detail = detail;
                this.detailDialog = true;
            },
            getTabs() {
                let that = this;
                that.$request({
                    url: that.$api.app_admin.cash_tabs,
                    method: 'get'
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.tab = response.data;
                        if(that.tab.length == 1) {
                            uni.setNavigationBarTitle({
                                title: that.tab[0].plugin + '提现'
                            })
                        }else {
                            that.titleShow = true;
                        }
                        that.titleWidth = 1/that.tab.length * 100 + '%';
                        that.type = response.data[0].key;
                        that.$request({
                            url: that.$api.app_admin.cash,
                            data: {
                                page: 1,
                                model_type: that.type,
                                status: 0,
                                keyword: '',
                            }
                        }).then(response => {
                            if (response.code == 0) {
                                that.list = response.data.list;
                            }else {
                                uni.showToast({
                                    title: response.msg,
                                    icon: 'none',
                                    duration: 1000
                                });
                            }
                        })
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                })
            },
            searchText() {
                let that = this;
                setTimeout(v=>{
                    that.page = 1;
                    that.over = false;
                    that.getFocus=false;
                    if(that.inputText == '') {
                        that.searchBool = false;
                    }
                    uni.showLoading({
                        mask: true,
                        title: '搜索中...'
                    });
                    that.switchRequest({type: 1});
                },300)
            },
            clearSearch() {
                this.inputText = '';
                if(!this.searchBool) {
                    this.searchText();
                }
            },
            bottomRequest() {
                this.$request({
                url: this.$api.app_admin.cash,
                    data: {
                        page: this.page,
                        model_type: this.type,
                        status: this.status,
                        keyword: '',
                    }
                }).then(response => {
                    if (response.code === 0) {
                        if (response.data.list.length === 0) {
                            this.over = true;
                        } else {
                            this.list = [...this.list, ...response.data.list];
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                })
            },
            setStatus(data) {
                this.page = 1;
                this.status = data;
                this.over = false;
                this.inputText = '';
                this.searchBool = false;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.$request({
	                url: this.$api.app_admin.cash,
	                data: {
	                    page: 1,
		                model_type: this.type,
		                status: data,
		                keyword: this.inputText,
	                }
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        this.list = response.data.list;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                });
            },
            tabSwitch(data) {
                this.page = 1;
                this.status = 0;
                this.over = false;
                this.type = data;
                this.inputText = '';
                this.searchBool = false;
                this.list = [];
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.$request({
	                url: this.$api.app_admin.cash,
	                data: {
                        page: 1,
		                model_type: data,
                        status: 0,
		                keyword: this.inputText,
	                }
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        this.list = response.data.list;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                });
            },
            confirm() {
                // 拒绝
	            if (this.modelType === 1) {
	                if (this.textarea === '') {
                        uni.showToast({
                            title: '请填写拒绝理由',
                            icon: 'none',
                            duration: 1000
                        });
                        return false
                    };
                    this.$request({
                        url: this.$api.app_admin.cash_save,
                        method: 'post',
                        data: {
                            status: 3,
                            id: this.setItem.id,
                            content: this.textarea,
                            model_type: this.type,
                        }
                    }).then(response => {
                        if (response.code === 0) {
                            for (let i = 0; i < this.list.length; i++) {
                                if (this.list[i].id === this.setItem.id) {
                                    this.$delete(this.list, i);
                                    this.model = false;
                                    this.textarea = '';
                                }
                            }
                        }else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    });
	            } else if (this.modelType === 3) {
                    this.$request({
                        url: this.$api.app_admin.cash_save,
                        method: 'post',
                        data: {
                            id: this.setItem.id,
                            content: '小程序端操作',
                            model_type: this.type,
                            status: 2,
                        }
                    }).then(response => {
                        if (response.code === 0) {
                            for (let i = 0; i < this.list.length; i++) {
                                if (this.list[i].id === this.setItem.id) {
                                    this.$delete(this.list, i);
                                    this.model = false;
                                }
                            }
                        }else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    })
	            } else if (this.modelType === 2) {
                    this.$request({
                        url: this.$api.app_admin.cash_save,
                        method: 'post',
                        data: {
                            id: this.setItem.id,
                            content: '小程序端操作',
                            model_type: this.type,
                            status: 1,
                        }
                    }).then(response => {
                        if (response.code === 0) {
                            for (let i = 0; i < this.list.length; i++) {
                                if (this.list[i].id === this.setItem.id) {
                                    this.$delete(this.list, i);
                                    this.model = false;
                                    this.textarea = '';
                                }
                            }
                        }else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    });
	            }
            },
            refuse(data) {
                this.setItem = data;
                this.model = true;
                this.modelType = 1;
            },
            byGo(data) {
                this.setItem = data;
                this.model = true;
                this.modelType = 2;
            },
            pay(data) {
                this.setItem = data;
                this.model = true;
                this.modelType = 3;
            },
		    async request(data) {
                const response = await this.$request({
                    url: this.$api.app_admin.cash,
                    data: {
                        model_type: this.type,
                        page: data.page,
                        status: data.status,
                        keyword: this.inputText,
                    }
                });
                uni.hideLoading();
                if (response.code === 0) {
                    this.list = response.data.list;
                }else {
                    uni.showToast({
                        title: response.msg,
                        icon: 'none',
                        duration: 1000
                    });
                }
		    },
		    switchRequest(data) {
                if (this.status === 0) {
                    this.request({
                        page: this.page,
                        status: 0,
                    });
                } else if (this.status === 1) {
                    this.request({
                        page: this.page,
                        status: 1,
                    });
                }
		    }
	    }
    }
</script>

<style scoped lang="scss">
	@import "./cash.scss";
</style>