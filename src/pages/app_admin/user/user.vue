<template>
	<app-layout>
		<view class="admin">
			<view class="navigator dir-left-nowrap">
				<view class="box-grow-1" @click="setActive(0)">
					<view class="dir-top-nowrap cross-center">
						<text class="text" :class="{'active-text': active === 0}">全部用户</text>
					</view>
				</view>
				<view class="box-grow-1" @click="setActive(1)">
					<view  class="dir-top-nowrap cross-center">
						<text  class="text" :class="{'active-text': active === 1}">分销商</text>
					</view>
				</view>
				<view class="box-grow-1" @click="setActive(2)">
					<view  class="dir-top-nowrap cross-center">
						<text  class="text" :class="{'active-text': active === 2}">核销员</text>
					</view>
				</view>
			</view>
			<view class="search">
				<view class="prompt dir-left-nowrap main-center cross-center" v-if="search" @click="setSearch">
					<image src="../../../static/image/icon/icon-search.png"></image>
					<text>{{active ==2 ? '请输入昵称/门店搜索': active == 0 ? '请输入ID/昵称/手机号/备注/联系方式名搜索' : '请输入ID/昵称/手机号/姓名搜索'}}</text>
				</view>
				<view v-else style="position: relative">
					<input :placeholder="active === 2 ? '请输入昵称/门店搜索': active === 0 ? '请输入ID/昵称/手机号/备注/联系方式名搜索' : '请输入ID/昵称/手机号/姓名搜索'" type="text" v-model="keyword" @focus="getFocus=true" focus @blur="inputBlur" @confirm="keywordSearch"/>
                    <image v-if="getFocus && keyword.length > 0" @click.stop="clearSearch" class="search-clear" src="../image/clear.png"></image>
				</view>
			</view>
			<view class="sort dir-left-nowrap" v-if="active === 2">
				<view class="sort-item box-grow-1">
					<view @click="setSort(0)">
						<view class="view dir-left-nowrap main-center cross-center">
							<view>订单数</view>
							<image :src="`${sort === 1 ? '../image/toDown.png' : sort === 2 ? '../image/up.png' : '../image/sort.png'}`"></image>
						</view>
					</view>
				</view>
				<view class="sort-item box-grow-1">
					<view @click="setSort(1)">
						<view class="view dir-left-nowrap main-center cross-center">
							<view>金额</view>
							<image :src="`${sort === 3 ? '../image/toDown.png' : sort === 4 ? '../image/up.png' : '../image/sort.png'}`"></image>
						</view>
					</view>
				</view>
				<view class="sort-item box-grow-1 ">
					<view @click="setSort(2)">
						<view class="view dir-left-nowrap main-center cross-center">
							<view>卡券数</view>
							<image :src="`${sort === 5 ? '../image/toDown.png' : sort === 6 ? '../image/up.png' : '../image/sort.png'}`"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="sort-one dir-left-nowrap" v-if="active === 1">
				<view class="sort-item">
					<view @click="distributorSort(0)">
						<view class="view dir-left-nowrap main-center cross-center">
							<text>累计金额</text>
							<image :src="`${sort === 1 ? '../image/up.png' : sort === 2 ? '../image/toDown.png' : '../image/sort.png'}`"></image>
						</view>
					</view>
				</view>
				<view class="sort-item">
					<view @click="distributorSort(1)">
						<view class="view dir-left-nowrap main-center cross-center">
							<text>可提现金额</text>
							<image :src="`${sort === 3 ? '../image/up.png' : sort === 4 ? '../image/toDown.png' : '../image/sort.png'}`"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="sort-one dir-left-nowrap" v-if="active === 0">
				<view class="sort-item">
					<view @click="allSort(0)">
						<view class="view dir-left-nowrap main-center cross-center">
							<text>交易额</text>
							<image :src="`${sort === 1 ? '../image/up.png' : sort === 2 ? '../image/toDown.png' : '../image/sort.png'}`"></image>
						</view>
					</view>
				</view>
				<view class="sort-item">
					<view @click="allSort(1)">
						<view class="view dir-left-nowrap main-center cross-center">
							<text>订单数</text>
							<image :src="`${sort === 3 ? '../image/up.png' : sort === 4 ? '../image/toDown.png' : '../image/sort.png'}`"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="content safe-area-inset-bottom">
				<template v-if="list.length === 0">
					<view class="no-people">
						<image src="https://v4test.zjhejiang.com/web/statics/img/app/app_admin/no-user.png"></image>
						<view>没有任何用户哦</view>
					</view>
				</template>
				<template v-if="active === 0">
					<view class="all-item" v-for="(item, index) in list" :key="index">
						<view class="avatar-name dir-left-nowrap">
							<image class="avatar" :src="item.avatar"></image>
							<view class="name">
								<view class="dir-left-nowrap cross-bottom">
									<view class="nickname t-omit">{{item.nickname}}</view>
									<view class="member member-name t-omit">{{item.member_name}}</view>
								</view>
								<view class="member" v-if="item.remark_name">备注名：{{item.remark_name}}</view>
							</view>
						</view>
						<view class="number dir-left-wrap">
							<view class="item margin dir-left-nowrap">
								<text class="label">交易额</text>
								<text class="amount">￥{{item.order_sum}}</text>
							</view>
							<view class="item margin dir-left-nowrap">
								<text class="label">积分</text>
								<text class="amount">{{item.integral}}</text>
							</view>
							<view class="item dir-left-nowrap">
								<text class="label">订单数</text>
								<text class="amount">{{item.order_count}}</text>
							</view>
							<view class="item dir-left-nowrap">
								<text class="label">余额</text>
								<text class="amount">￥{{item.balance}}</text>
							</view>
						</view>
						<view v-if="item.remark" class="remark">
							<view class="t-omit" style="width: 80%;">备注: {{item.remark}}</view>
							<view class="look-remark" @click="toLook(item)" v-if="item.remarkLength > 28">查看全部</view>
						</view>
						<view class="button dir-left-nowrap main-right">
							<view class="deduction">
								<view @click="toChangeInfo(item)">修改信息</view>
							</view>
							<view class="deduction">
								<view @click="setRechargeDeduction(item, 0)">扣除</view>
							</view>
							<view class="recharge">
								<view @click="setRechargeDeduction(item, 1)">充值</view>
							</view>
						</view>
					</view>
				</template>
				<template v-else-if="active === 1">
					<view class="distributor-item dir-left-nowrap" v-for="(item, index) in list" :key="index">
						<image class="avatar" :src="item.avatar"></image>
						<view class="content-text dir-top-nowrap">
							<view class="name">{{item.nickname}}</view>
							<view class="num dir-top-nowrap">
								<view class="amount">
									<text class="prompt ">累计金额</text>
									<text class="price">￥{{item.total_money}}</text>
								</view>
								<view>
									<text class="prompt">可提现金额</text>
									<text class="price">￥{{item.money}}</text>
								</view>
							</view>
						</view>
					</view>
				</template>
				<template v-else-if="active === 2">
					<view class="auditor-item" v-for="(item, index) in list" :key="index">
						<view class="avatar-name dir-left-nowrap">
							<image class="avatar" :src="item.user.userInfo.avatar"></image>
							<view class="name-content dir-top-nowrap">
								<view class="name">
									{{item.user.nickname}}
								</view>
								<view class="shop dir-left-nowrap cross-center">
									<image src="../image/shop.png"></image>
									<view class="t-omit">{{item.store[0].name}}</view>
								</view>
							</view>
						
						</view>
						<view class="num-content dir-left-nowrap">
							<view class="box-grow-1 dir-top-nowrap">
								<view class="prompt cross-top">
									<text>订单数</text>
								</view>
								<view class="num">{{item.order_count}}</view>
							</view>
							<view class="box-grow-1">
								<view class="prompt cross-top">
									<text>金额</text>
								</view>
								<view class="num">￥{{item.total_price}}</view>
							</view>
							<view class="box-grow-1">
								<view class="prompt cross-top">
									<text>卡券数</text>
								</view>
								<view class="num">{{item.card_count}}</view>
							</view>
						</view>
						<view class="button dir-left-nowrap main-right cross-center">
							<view class="release">
								<view @click="dismissal(item)">
									解除核销员
								</view>
							</view>
							<view class="modify">
								<view @click="modifyStore(item)">
									修改门店
								</view>
							</view>
						</view>
					</view>
				</template>
			</view>
			<view @touchmove.stop.prevent="" class="recharge-key-face" v-if="rechargeBool">
				<view class="key-face-item">
					<view class="nav dir-left-nowrap">
						<view class="box-grow-1 nav-item" @click="activeRecharge(0)">
							<text class="integral" :class="{'recharge-active': rechargeStatus === 0}" >{{rechargeDeduction === 0 ? '扣' : rechargeDeduction === 1 ?'充': ''}}积分</text>
						</view>
						<view class="box-grow-1 nav-item" @click="activeRecharge(1)">
							<text class="balance" :class="{'recharge-active': rechargeStatus === 1}" >{{rechargeDeduction === 0 ? '扣' :  rechargeDeduction === 1 ?'充': ''}}余额</text>
						</view>
					</view>
					<view class="input">
						<input v-if="rechargeStatus === 0" type="number" v-model="num" :placeholder="`请填写${rechargeDeduction === 0 ? '扣除' : rechargeDeduction === 1 ? '充值': ''}${placeholder}`">
						<input @input="checkRecharge" v-else type="digit" v-model="num" :placeholder="`请填写${rechargeDeduction === 0 ? '扣除' : rechargeDeduction === 1 ? '充值': ''}${placeholder}`">
						<input class="remark-input" v-model="remark" placeholder="请输入备注信息">
					</view>
					<view class="button dir-left-nowrap">
						<view class="cancel">
							<view @click="cancelRecharge">
								<text>取消</text>
							</view>
						</view>
						<view class="app-line"></view>
						<view class="confirm">
							<view @click="confirmRecharge">
								<text>确认</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view @touchmove.stop.prevent="" v-if="remarkTextarea" class="recharge-key-face">
				<view class="key-face-item">
					<view class="header">{{look ? '备注': '修改备注'}}</view>
					<view class="input">
						<textarea :disabled="look" class="textarea" placeholder="请填写备注" v-model="remark"></textarea>
					</view>
					<view v-if="look" class="button dir-left-nowrap">
						<view class="confirm" style="width: 100%">
							<view @click="remarkTextarea=false;remark='';look=false">
								<text>我知道了</text>
							</view>
						</view>
					</view>
					<view v-else class="button dir-left-nowrap">
						<view class="cancel">
							<view @click="remarkTextarea=false;remark='';dialog=false">
								<text>取消</text>
							</view>
						</view>
						<view class="app-line"></view>
						<view class="confirm">
							<view @click="toRemark">
								<text>确认</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view @touchmove.stop.prevent="" class="modify-store" v-if="modifyStoreBool"  @click.stop="modifyStoreBool = false">
				<view class="modify-store-item">
					<view class="picker-header dir-left-nowrap main-between">
						<view class="cancel">
							<view @click="modifyStoreBool = false">
								取消
							</view>
						</view>
						<view class="determine">
							<view @click="determineStore">
								确定
							</view>
						</view>
					</view>
					<picker-view class="picker" :value="[storeIndex]" @change="pickerChange" mask-class="picker-item" indicator-class="picker-item">
						<picker-view-column>
							<view
								class="item cross-center main-center t-omit"
								v-for="(item, index) in storeList"
								:key="index"
								:class="{
									'sure-color': storeIndex === index,
									'cardinal-color': storeIndex === index + 1 || storeIndex === index - 1,
									'even-color': storeIndex === index + 2 || storeIndex === index - 2,
								}"
								:style="{ lineHeight: lineHeight }"
							>{{item.name}}</view>
						</picker-view-column>
					</picker-view>
				</view>
			</view>
			<view @touchmove.stop.prevent="" class="release-prompt" v-if="releaseBool">
				<view class="prompt-item">
					<view class="header">
						提示
					</view>
					<view class="content">
						是否确认解除核销员
					</view>
					<view class="button dir-left-nowrap cross-center">
						<view class="cancel">
							<view @click="cancelUndelete">
								取消
							</view>
						</view>
						<view class="line"></view>
						<view class="sure">
							<view @click="sureDeletion">
								确认
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="dialog" class="dialog">
			<!-- 底部 -->
			<view v-if="dialogChoose" class="dialog-choose">
				<view @click="toChangeRemark(1)" class="dialog-choose-item">修改备注名</view>
				<view @click="toChangeRemark(2)" class="dialog-choose-item">修改备注</view>
				<view @click="toChangeMember" class="dialog-choose-item">修改会员等级</view>
				<view @click='toChangeInfo' class="dialog-choose-item dialog-cancel">取消</view>
			</view>
			<!-- 备注 -->
			<view v-if="changeRemark" class="key-face-item">
				<view class="nav dir-left-nowrap">
					<view class="box-grow-1 nav-item">
						<text>修改备注名</text>
					</view>
				</view>
				<view class="input">
					<input maxlength="8" v-model="remark_name" placeholder="请输入用户备注名(限8个字符)">
				</view>
				<view class="button dir-left-nowrap">
					<view class="cancel">
						<view @click="toChangeInfo">
							<text>取消</text>
						</view>
					</view>
					<view class="app-line"></view>
					<view class="confirm">
						<view @click="toRemarkName">
							<text>确认</text>
						</view>
					</view>
				</view>
			</view>
            <view class='dialog-item' v-if="error">
                <view class='dialog-title'>提示</view>
                <view class="error-info">您暂未设置会员等级</view>
                <view class="error-info">请前往商城后台设置</view>
                <view class="main-center btn-area">
                    <view class="submit-btn be-submit" @click='close'>确认</view>
                </view>
            </view>
            <view class="key-face-item" v-if="changeMember">
            	<view class="nav dir-left-nowrap">
					<view class="box-grow-1 nav-item">
						<text>修改会员等级</text>
					</view>
				</view>
                <view class="member-list">
                    <view @click='chooseMember(item.level)' class="member-item cross-center main-between" v-for="item in member" :key="item.id">
                    	<view class="add-info">
                            <view class="t-omit add-name">{{item.name}}</view>
                        </view>
                        <view>
	                        <image v-if="item.level == memberLevel" src="./../image/active.png"></image>
	                        <image v-else src="/static/image/icon/form-er.png"></image>
                        </view>
                    </view>
                </view>
				<view class="button dir-left-nowrap">
					<view class="cancel">
						<view @click="toChangeInfo">
							<text>取消</text>
						</view>
					</view>
					<view class="app-line"></view>
					<view class="confirm">
						<view @click="toLevel">
							<text>确认</text>
						</view>
					</view>
				</view>
            </view>
		</View>
	</app-layout>
</template>

<script>
    export default {
        name: 'user-admin',
	    data() {
            return {
                lineHeight: '68rpx',
            	getFocus: false,
                active: 0,
	            search: true,
	            remarkTextarea: false,
	            look: false,
	            error: false,
                keyword: '',
                status: '',
                page: 1,
	            over: false,
	            list: [],
	            memberLevel: null,
	            storeList: [],
                rechargeBool: false,
                placeholder: '积分',
                rechargeStatus: 0,
                num: '',
                remark_name: '',
                remark: '',
	            rechargeItem: {},
                rechargeDeduction: 0, // 0 扣除 1 充值
                modifyStoreBool: false,
	            storeItem: {},
                storeIndex: -1,
                storeUser: {},
	            sort: 0,
	            dialog: false,
	            dialogChoose: true,
	            changeRemark: false,
	            changeMember: false,
                releaseBool: false,
                member: [],
                deleteObject: {}
            }
	    },
	    onLoad() { this.$commonLoad.onload();
            let screenWidth = uni.getSystemInfoSync().windowWidth;
            let p = 375 / screenWidth;
            this.lineHeight = 68*p + 'rpx';
            this.$request({
	            url: this.$api.app_admin.user,
	            data: {
                    page: this.page,
		            status: this.status,
		            keyword: this.keyword
	            }
            }).then(response => {
                if (response.code === 0) {
                    this.list = response.data.list;
                	for(let item of this.list) {
                		if(item.remark) {
                			item.remarkLength = this.strlen(item.remark)
                		}
                	}
                    this.member = response.data.mall_members;
                    let para = {
                    	level: 0,
                    	id: 0,
                    	name: response.data.general_user_text ? response.data.general_user_text : '普通用户',
                    }
                    this.member.unshift(para);
                }
            });
	    },
        onReachBottom() {
            if (!this.over) {
                this.page++;
                this.threeRequest(this.active);
            }
        },
	    methods: {
	    	toLook(item) {
	    		this.remarkTextarea = true;
	    		this.look = true;
	    		this.remark = item.remark
	    	},
	    	strlen(str){
			    var len = 0;
			    for (var i=0; i<str.length; i++) {
			     var c = str.charCodeAt(i);
			    //单字节加1
			     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			       len++;
			     }
			     else {
			      len+=2;
			     }
			    }
			    return len;
			},
            async request({url, data}) {
                const response = await this.$request({
	                url: url,
	                data: data
                });
                if (response.code === 0) {
                    if (response.data.list.length > 0) {
                        return response.data;
                    } else {
                        this.over = true;
                        return false;
                    }
                }
            },
            clearSearch() {
                this.keyword = '';
                this.keywordSearch();
            },
            chooseMember(level) {
            	this.memberLevel = level;
            },
            toChangeInfo(data) {
            	this.dialog = !this.dialog;
            	this.changeRemark = false;
	            this.remarkTextarea = false;
            	this.dialogChoose = true;
            	this.changeMember = false;
            	this.remark_name = null;
            	if(data) {
                	this.rechargeItem = data;
            	}else {
            		this.rechargeItem = {};
            	}
            },
            toChangeRemark(num) {
            	this.dialogChoose = false;
            	if(num == 1) {
	            	this.changeRemark = true;
	            	this.remark_name = this.rechargeItem.remark_name;
            	}else {
	            	this.remarkTextarea = true;
	            	this.remark = this.rechargeItem.remark;
            	}
            },
            toChangeMember() {
            	this.dialogChoose = false;
            	if(this.member.length > 0) {
	            	this.changeMember = true;
	            	this.memberLevel = this.rechargeItem.member_level
            	}else {
            		this.error = true;
            	}
            },
            close() {
            	this.error = false;
            	this.dialog = false;
            },
            toLevel() {
                this.$request({
                    url: this.$api.app_admin.level,
                    method: 'post',
                    data: {
                    	id: this.rechargeItem.user_id,
                        member_level: this.memberLevel,
                    },
                }).then(response => {
                    if (response.code === 0) {
                    	this.toChangeInfo();
                    	this.setActive(0);
                    }else {
                    	uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                });
            },
            toRemark() {
                this.$request({
                    url: this.$api.app_admin.remark,
                    method: 'post',
                    data: {
                    	id: this.rechargeItem.user_id,
                        remark: this.remark
                    },
                }).then(response => {
                    if (response.code === 0) {
                    	this.rechargeItem.remark = this.remark;
                    	this.rechargeItem.remarkLength = this.strlen(this.rechargeItem.remark)
                    	this.toChangeInfo();
                    }else {
                    	uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                });
            },
            toRemarkName() {
                this.$request({
                    url: this.$api.app_admin.remarkName,
                    method: 'post',
                    data: {
                    	id: this.rechargeItem.user_id,
                        remark_name: this.remark_name
                    },
                }).then(response => {
                    if (response.code === 0) {
                    	this.rechargeItem.remark_name = this.remark_name;
                    	this.toChangeInfo();
                    }else {
                    	uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                });
            },
            setSearch() {
                this.search = false;
            },
            setActive(data) {
                this.list = [];
                this.page = 1;
                this.over = false;
                this.keyword = '';
                this.sort = 0;
                uni.showLoading({
                    title: '加载中...'
                });
                this.threeRequest(data);
                this.active = data;
                this.search = true;
            },
		    threeRequest(data) {
	            uni.showLoading({
	                mask: true,
	                title: '加载中...'
	            });
                if (data === 0) {
                    this.request({
                        url: this.$api.app_admin.user,
                        data: {
                            page: this.page,
                            status: '',
                            keyword: this.keyword,
                        }
                    }).then(response => {
                		uni.hideLoading();
                        if (response === false) return;
                    	this.list = [...this.list, ...response.list];
                    	for(let item of this.list) {
                    		if(item.remark) {
                    			item.remarkLength = this.strlen(item.remark)
                    		}
                    	}
                    });
                } else if (data === 1) {
                    this.request({
                        url: this.$api.app_admin.share,
                        data: {
                            page: this.page,
                            status: 1,
                            keyword: this.keyword,
                            sort: this.sort,
                        }
                    }).then(response => {
                    	uni.hideLoading();
                        if (response === false) return;
                        this.list = [...this.list, ...response.list];
                    });
                } else if (data === 2) {
                    this.request({
                        url: this.$api.app_admin.clerk,
                        data: {
                            page: this.page,
                            status: '',
                            keyword: this.keyword,
	                        sort: this.sort,
                        }
                    }).then(response => {
                    	uni.hideLoading();
                        if (response === false) return;
                        this.list = [...this.list, ...response.list];
                        this.storeList = response.store_list;
                    });
                }
		    },
            inputBlur() {
                let that = this;
                setTimeout(v =>{
	            	that.getFocus = false;
	                if (that.keyword === '') that.search = true;
                },300);
            },
            setRechargeDeduction(data, status) {
                this.rechargeItem = data;
                this.rechargeBool = true;
                this.rechargeDeduction = status;
            },
            activeRecharge(data) {
            	let that = this;
                that.rechargeStatus = data;
                that.num = '';
                if (data === 0) {
                    that.placeholder = '积分';
                } else {
                    that.placeholder = '余额';
                }
            },
            checkRecharge(data) {
            	let that = this;
            	if(that.rechargeStatus === 1) {
            		let num = (+data.detail.value).toFixed(2)
            		setTimeout(()=>{
            			that.num = Number(num)
            		})
            	}
            },
		    clearStatus() {
                // 默认积分
                this.rechargeStatus = 0;
                // 充值对象
                this.rechargeItem = {};
                // 充值框
                this.rechargeBool = false;
                // 充值扣除
                this.rechargeDeduction = 0;
                // 充值量
                this.num = '';
                this.remark = '';
		    },
            cancelRecharge() {
                this.rechargeBool = false;
                this.clearStatus();
            },
		    intergral(num, type) {
                this.$request({
                    url: this.$api.app_admin.integral, // 积分
                    method: 'post',
                    data: {
                        user_id: this.rechargeItem.user_id,
                        num: num,
                        remark: this.remark ? this.remark : '',
                        pic_url: '',
                        type: type
                    }
                }).then(response => {
                    if (response.code === 0) {
                        if (this.rechargeDeduction === 1) {
                            this.setList('integral', num,1);
                        } else {
                            this.setList('integral', num, 0);
                        }
                        this.clearStatus();
                    } else if (response.code === 1) {
                        uni.showToast({
                            title: response.msg,
                            image: '../image/mark.png'
                        });
                    }
                })
		    },
            balance(num, type) {
                this.$request({
                    url: this.$api.app_admin.balance, // 余额
                    method: 'post',
                    data: {
                        user_id: this.rechargeItem.user_id,
                        price: num,
                        remark: this.remark ? this.remark : '',
                        pic_url: '',
                        type: type
                    }
                }).then(response => {
                    if (response.code === 0) {
                        if (this.rechargeDeduction === 1) {
                            this.setList('balance', num,1);
                        } else {
                            this.setList('balance', num, 0);
                        }
                        this.clearStatus();
                    } else if (response.code === 1) {
                        uni.showToast({
                            title: response.msg,
                            image: '../image/mark.png'
                        });
                    }
                })
            },
		    setList(key, num, algorithm) {
                this.list.map(item => {
                    if (item.user_id === this.rechargeItem.user_id) {
                        if (algorithm === 0) {
                            item[key] = Number(item[key]) - num;
                        } else {
                            item[key] = Number(item[key]) + num;
                        }
                    }
                });
		    },
            confirmRecharge() {
                this.$utils.debounce(this.sureCharge, 500, true);
            },
            sureCharge() {
                if (!isNaN(this.num)) {
                    this.rechargeBool = false;
                    if (this.rechargeDeduction === 1) {
                        if (this.rechargeStatus === 0) {
                            this.intergral(Number(this.num), 1);
                        } else if (this.rechargeStatus === 1) {
                            this.balance(Number(this.num), 1);
                        }
                    } else if (this.rechargeDeduction === 0) {
                        if (this.rechargeStatus === 0) {
                            this.intergral(Number(this.num), 0);
                        } else if (this.rechargeStatus === 1) {
                            this.balance(Number(this.num), 0);
                        }
                    }
                }
            },
            modifyStore(data) {
                this.storeUser = data;
                this.storeItem = data.store[0];
                for (let i = 0; i < this.storeList.length; i++) {
                    if (this.storeItem.id === this.storeList[i].id) {
                        this.storeIndex = i;
                    }
                }
                this.modifyStoreBool = true;
            },
            pickerChange(data) {
                this.storeIndex = data.detail.value[0];
            },
            dismissal(data) {
                this.deleteObject = data;
                this.releaseBool = true;
            },
            determineStore() {
                this.$request({
	                url: this.$api.app_admin.clerk_edit,
	                method: 'post',
	                data: {
						user_id: this.storeUser.user_id,
		                store_id: this.storeList[this.storeIndex].id,
		                id: this.storeUser.id,
	                }
                }).then(response => {
                    if (response.code === 0) {
                       this.$nextTick().then(() => {
                           for (let i = 0; i < this.list.length; i++) {
                               if (this.list[i].user.id === this.storeUser.user_id) {
                                   this.list[i].store[0] = this.storeList[this.storeIndex];
                                   this.storeIndex = -1;
                                   this.storeUser = {};
                                   this.modifyStoreBool = false;
                                   this.storeItem = {};
                               }
                           }
                       })
                    }
                })
            },
            allSort(data) {
                this.over = false;
                this.page = 1;
                uni.pageScrollTo({
                    scrollTop: 0
                });

                if (data === 0) {
                	this.sort === 1 ? this.sort = 2 : this.sort = 1;
                } else if (data === 1) {
					this.sort === 3 ? this.sort = 4 : this.sort = 3;
                }

                let sort = undefined;
				switch (this.sort) {
					case 1:
						sort = 'price_count_asc';
						break;
					case 2:
						sort = 'price_count_desc';
						break;
					case 3:
						sort = 'order_count_asc';
						break;
					case 4:
						sort = 'order_count_desc';
						break;
					default:
						sort = '';
				}
                this.$request({
	                url: this.$api.app_admin.user,
	                data: {
	                    page: 1,
                        keyword: this.keyword,
                        status: '',
                        sort: sort
	                }
                }).then(res => {
                    if (res.code === 0) {
                        this.list = res.data.list;
                    }
                })
            },
            setSort(data) {
                this.over = false;
                this.page = 1;
                uni.pageScrollTo({
                    scrollTop: 0
                });
                switch (data) {
					case 0:
						this.sort === 1 ? this.sort = 2 : this.sort = 1;
						break;
					case 1:
						this.sort === 3 ? this.sort = 4 : this.sort = 3;
						break;
					case 2:
						this.sort === 5 ? this.sort = 6 : this.sort = 5;
						break;
				}
                uni.showLoading({
                    title: '加载中...'
                });
                this.$request({
	                url: this.$api.app_admin.clerk,
	                data: {
	                    page: 1,
                        keyword: this.keyword,
                        status: '',
                        sort: this.sort
	                }
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        this.list = response.data.list;
                    }
                })
            },
            cancelUndelete() {
                this.releaseBool = false;
                this.deleteObject = {};
            },
            sureDeletion() {
                uni.showLoading({
                    title: '加载中...'
                });
                this.$request({
	                url: this.$api.app_admin.clerk_destroy,
	                method: 'post',
	                data: {
	                    id: this.deleteObject.id
	                }
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        this.list.map((item, index) => {
                            if (item.id === this.deleteObject.id) {
                                this.$delete(this.list, index);
                            }
                        });
                        this.deleteObject = {};
                        this.releaseBool = false;
                    }
                });
            },
		    keywordSearch() {
                this.page = 1;
                this.over = false;
                uni.showLoading({
                    title: '加载中...'
                });
                if (this.active === 0) {
                    this.request({
                        url: this.$api.app_admin.user,
                        data: {
                            page: this.page,
                            status: '',
                            keyword: this.keyword
                        }
                    }).then(response => {
                    	uni.hideLoading();
                        if (response === false) {
                            return this.list = [];
                        }
                        this.list = response.list;
                    	for(let item of this.list) {
                    		if(item.remark) {
                    			item.remarkLength = this.strlen(item.remark)
                    		}
                    	}
                    });
                } else if (this.active === 1) {
                    this.request({
                        url: this.$api.app_admin.share,
                        data: {
                            page: this.page,
                            status: 1,
                            keyword: this.keyword
                        }
                    }).then(response => {
                    	uni.hideLoading();
                        if (response === false) {
                            return this.list = [];
                        }
                        this.list = response.list;
                    });
                } else if (this.active === 2) {
                    this.request({
                        url: this.$api.app_admin.clerk,
                        data: {
                            page: this.page,
                            status: '',
                            keyword: this.keyword,
                            sort: this.sort
                        }
                    }).then(response => {
                    	uni.hideLoading();
                        if (response === false) {
                            return this.list = [];
                        }
                        this.list = response.list;
                    });
                }
		    },
            distributorSort(data) {
                this.over = false;
                this.page = 1;
                uni.pageScrollTo({
                    scrollTop: 0
                });
                if (data === 0) {
					this.sort === 1 ? this.sort = 2 : this.sort = 1;
                } else {
					this.sort === 3 ? this.sort = 4 : this.sort = 3;
                }
                uni.showLoading({
                    title: '加载中...'
                });
                this.$request({
                    url: this.$api.app_admin.share,
                    data: {
                        page: 1,
                        keyword: this.keyword,
                        status: 1,
                        sort: this.sort
                    }
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        this.list = response.data.list;
                    }
                })
            }
 	    }
    }
</script>

<style scoped lang="scss">
	.admin {
		width: #{750rpx};
		background-color: #f7f7f7;
		.navigator {
			width: #{750rpx};
			height: #{100rpx};
			border-bottom: #{1rpx} solid #e2e2e2;
			position: fixed;
			background-color: white;
			top: 0;
			left: 0;
			z-index: 1000;
			>view {
				text-align: center;
				line-height: #{100rpx};
			}
			.text {
				font-size: #{26rpx};
				color: #666666;
				height: #{98rpx};
				display: inline-block;
				border-bottom-style: solid;
				border-bottom-width: #{2rpx};
				border-bottom-color: transparent;
				line-height: #{98rpx};
			}
			.active-text {
				color: #446dfd;
				border-bottom-color: #446dfd;
			}
		}
		.search {
			width: #{750rpx};
			height: #{88rpx};
			padding: #{16rpx} #{24rpx};
			box-sizing: border-box;
			
			background-color: #efeff4;
			position: fixed;
			top: #{100rpx};
			left: 0;
			z-index: 1000;
			.prompt {
				width: #{702rpx};
				height: #{56rpx};
				position: absolute;
				border-radius: #{28rpx};
				background-color: #ffffff;
				>image {
					width: #{26rpx};
					height: #{26rpx};
				}
				>text {
					color: #b2b2b2;
					font-size: #{26rpx};
					margin: #{0 10rpx};
				}
			}
			input {
				width: #{702rpx};
				height: #{56rpx};
				border-radius: #{28rpx};
				background-color: #ffffff;
      			padding: #{0 70rpx 0 30rpx};
				box-sizing: border-box;
				font-size: #{26rpx};
			}
		    .search-clear {
		      	position: absolute;
		      	right: #{15rpx};
		      	top: #{14rpx};
		      	width: #{30rpx};
		      	height: #{30rpx};
		      	z-index: 300;
		    }
		}
		.sort-one {
			width: #{750rpx};
			height: #{80rpx};
			background-color:white;
			position: fixed;
			top: #{188rpx};
			z-index: 1000;
			.sort-item {
				width: #{375rpx};
				height: #{80rpx};
				.view {
					width: #{375rpx};
					height: #{80rpx};
					>text {
						font-size: #{28rpx};
						color: #666666;
					}
					>image {
						width: #{16rpx};
						height: #{26rpx};
						margin-left: #{16rpx};
					}
				}
			}
		}
		.sort {
			width: #{750rpx};
			height: #{80rpx};
			background-color:white;
			position: fixed;
			top: #{188rpx};
			z-index: 1000;
			.sort-item {
				height: #{80rpx};
				width: #{250rpx};
				.view {
					width: #{250rpx};
					height: #{80rpx};
					view {
						display: inline-block;
						font-size: #{26rpx};
						color: #666666;
						margin-right: #{16rpx};
					}
					image {
						width: #{16rpx};
						height: #{26rpx};
					}
				}
			}
		}
		.content {
			.no-people {
				position: fixed;
				top: #{350rpx};
				left: 0;
				right: 0;
				margin: 0 auto;
				color: #666666;
				font-size: #{24rpx};
				width: #{240rpx};
				text-align: center;
				>image {
					width: #{240rpx};
					height: #{240rpx};
					margin-bottom: #{20rpx};
				}
			}
			background-color: #f7f7f7;
			padding-left: 24rpx;
            padding-right: 24upx;
			box-sizing: border-box;
			margin-top: #{292rpx};
			.all-item {
				width: #{702rpx};
				background-color: white;
				border-radius: #{15rpx};
				padding: #{24rpx};
				box-sizing: border-box;
				margin-top: #{24rpx};
				.avatar-name {
					margin-bottom: #{16rpx};
					.avatar {
						height: #{100rpx};
						width: #{100rpx};
						border-radius: #{4rpx};
						flex-shrink: 0;
					}
					.name {
						height: #{100rpx};
						margin-left: #{24rpx};
						font-size: #{32rpx};
						color: #353535;
						padding-top: #{10rpx};
					}
					.member {
						color: #999999;
						width: 100%;
						font-size: #{28rpx};
					}
					.nickname {
						max-width: #{300rpx};
					}
					.member.member-name {
						margin-left: #{12rpx};
						width: #{164rpx};
						vertical-align: bottom;
					}
				}
				.number {
					width: #{702-48rpx};
					height: #{36+36+12rpx};
					margin-bottom: #{15rpx};
					.item {
						width: 50%;
						height: #{36rpx};
						.label {
							height: #{36rpx};
							line-height: #{36rpx};
							padding: 0 #{8rpx};
							box-sizing: border-box;
							background-color: #efeff4;
							margin-right: #{16rpx};
							font-size: #{22rpx};
							color: #999999;
						}
						.amount {
							height: #{36rpx};
							line-height: #{36rpx};
							font-size: #{28rpx};
							color: #999999;
						}
					}
					.margin {
						margin-bottom: #{12rpx};
					}
				}
				.remark {
					font-size: #{30rpx};
					width: 100%;
					position: relative;
					.look-remark {
						position: absolute;
						top: 0;
						right: 0;
						color: #446dfd;
					}
				}
				.button {
					width: #{702-48rpx};
					height: #{60rpx};
					margin-top: #{10rpx};
					>view {
						height: #{60rpx};
						line-height: #{60rpx};
						text-align: center;
						padding: 0 #{32rpx};
						border-style: solid;
						border-color: transparent;
						border-width: #{1rpx};
						border-radius: #{30rpx};
						font-size: #{28rpx};
					}
					.deduction {
						margin-right: #{16rpx};
						border-color: #e2e2e2;
						color:#353535;
					}
					.recharge {
						color: #446dfd;
						border-color: #446dfd;
					}
				}
			}
			.auditor-item {
				width: #{702rpx};
				margin-top: #{24rpx};
				background-color:white;
				border-radius: #{15rpx};
				padding: #{24rpx};
				box-sizing: border-box;
				.avatar-name {
					width: #{654rpx};
					height: #{100rpx};
				}
				.avatar {
					width: #{100rpx};
					height: #{100rpx};
					border-radius: #{4rpx};
				}
				.name-content {
					height: #{100rpx};
					margin-left: #{24rpx};
					width: #{530rpx};
					.name {
						font-size: #{32rpx};
						color: #353535;
						margin-top: #{12rpx};
					}
					.shop {
						margin-top: #{6rpx};
						>image {
							height: #{28rpx};
							width: #{28rpx};
						}
						>view {
							font-size: #{28rpx};
							color: #999999;
							margin-left: #{12rpx};
						}
					}
				}
				.num-content {
					width: #{654rpx};
					margin-top: #{24rpx};
					.prompt {
						height: #{36rpx};
						line-height: #{36rpx};
						>text {
							display: inline-block;
							font-size: #{22rpx};
							color: #999999;
							padding: 0 #{8rpx};
							box-sizing: border-box;
							height: #{36rpx};
							background-color: #efeff4;
						}
					}
					.num {
						margin-top: #{12rpx};
						color: #999999;
						font-size: #{28rpx};
					}
				}
				.button {
					width: #{654rpx};
					height: #{60rpx};
					margin-top: #{32rpx};
					.release,.modify {
						height: #{60rpx};
						line-height: #{60rpx};
						background-color: white;
						font-size: #{28rpx};
						border-radius: #{30rpx};
						text-align: center;
						padding: 0 #{32rpx};
						box-sizing: border-box;
						border-width: #{1rpx};
						border-style: solid;
					}
					.release {
						color: #353535;
						border-color: #bbbbbb;
					}
					.modify {
						margin-left: #{16rpx};
						color: #446dfd;
						border-color: #446dfd;
					}
				}
			}
			.distributor-item {
				width: #{702rpx};
				background-color: white;
				border-radius: #{15rpx};
				padding: #{24rpx};
				box-sizing: border-box;
				margin-top: #{24rpx};
				.avatar {
					width: #{148rpx};
					height: #{148rpx};
					border-radius: #{4rpx};
					margin-right: #{24rpx};
				}
				.content-text {
					width: #{482rpx};
					height: #{148rpx};
					>view {
						width: #{482rpx};
					}
					.name {
						margin: #{12rpx 0 10rpx 0};
						font-size: #{32rpx};
						color: #353535;
					}
					.num {
						height: #{84rpx};
						>view {
							height: #{36rpx};
							line-height: #{36rpx};
						}
						.amount {
							margin-bottom: #{12rpx};
						}
						.prompt {
							display: inline-block;
							height: #{35rpx};
							color: #999999;
							font-size: #{22rpx};
							padding: 0 #{8rpx};
							box-sizing: border-box;
							background-color: #efeff4;
							margin-right: #{16rpx};
						}
						.price {
							font-size: #{28rpx};
							color: #999999;
						}
					}
				}
			}
		}
		.recharge-key-face {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1100;
			background-color: rgba(0, 0, 0, 0.3);
			.header {
		        text-align: center;
		        font-size: #{32rpx};
		        margin-top: #{40rpx};
		        color: #353535;
			}
			.key-face-item {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: #{620rpx};
				background-color: white;
				border-radius: #{16rpx};
				.nav {
					text-align: center;
					.nav-item {
						height: #{88rpx};
					}
					text {
						display: inline-block;
						font-size: #{32rpx};
						height: #{88rpx};
						line-height: #{88rpx};
						color: #666666;
						border-bottom-width: #{2rpx};
						border-bottom-style: solid;
						border-bottom-color:transparent;
					}
				
					.recharge-active {
						color: #446dfd;
						border-bottom-color: #446dfd;
					}
				}
				.input {
					padding: #{32rpx};
					box-sizing: border-box;
					>input {
						height: #{80rpx};
						border-radius: #{16rpx};
						background-color: #f7f7f7;
						color: #353535;
						font-size: #{28rpx};
						padding-left: #{24rpx};
						box-sizing: border-box;
					}
					.remark-input {
						margin-top: #{20rpx};
					}
					>textarea {
						border-radius: #{16rpx};
						border: 2rpx solid #e2e2e2;
						color: #353535;
						font-size: #{28rpx};
						width: 100%;
						padding: 16rpx 20rpx;
						box-sizing: border-box;
					}
				}
				.button {
					height: #{88rpx};
					border-top: #{1rpx} solid #e2e2e2;
					position: relative;
					.app-line {
						width: #{2rpx};
						height: #{32rpx};
						position: absolute;
						top: #{28rpx};
						background-color: #e2e2e2;
						left: 0;
						right: 0;
						margin: 0 auto;
					}
					>view.cancel {
						height: #{88rpx};
						line-height: #{88rpx};
						text-align: center;
						position: relative;
						width: #{309rpx};
					}
					>view.confirm {
						height: #{88rpx};
						line-height: #{88rpx};
						text-align: center;
						position: relative;
						width: #{309rpx};
					}
					text {
						width: 100%;
						font-size: #{32rpx};
					}
					.confirm text {
						color: #446dfd;
					}
					.cancel text {
						color: #666666;
					}
				}
			}
		}
		.modify-store {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1600;
			background-color: rgba(0,0,0,.5);
			.modify-store-item {
				width: #{750rpx};
				background-color: #ffffff;
				padding-top: #{20rpx};
				box-sizing: border-box;
				position: fixed;
				bottom: 0;
				left: 0;
				.picker-header {
					width: #{750rpx};
					padding: 0 #{24rpx};
					box-sizing: border-box;
					color: #446dfd;
					font-size: #{32rpx};
				}
				.picker {
					width: #{750rpx};
					height: #{400rpx};
					margin-top: #{16rpx};
					.item {
						height: #{68rpx};
						text-align: center;
						font-size: #{32rpx};
					}
					.sure-color {
						color: rgb(68,109,253);
					}
					.cardinal-color {
						color: #999999;
					}
					.even-color {
						color: #cdcdcd;
					}
				}
			}
			.picker-item {
				border-top: #{1rpx} solid #e2e2e2;
				border-bottom: #{1rpx} solid #e2e2e2;
			}
		}
		.release-prompt {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1600;
			background-color: rgba(0,0,0,.5);
			.prompt-item {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: #{620rpx};
				background-color: rgb(255,255,255);
				border-radius: #{16rpx};
				padding-top: #{40rpx};
				box-sizing: border-box;
				.header {
					font-size: #{32rpx};
					color: #353535;
					text-align: center;
				}
				.content {
					font-size: #{32rpx};
					color:#353535;
					text-align: center;
					margin: #{64rpx} 0;
					background-color: white;
				}
				.button {
					width: #{620rpx};
					height: #{88rpx};
					border-top: #{1rpx} solid #e2e2e2;
					.cancel,.sure {
						width: #{309rpx};
						font-size: #{32rpx};
						text-align: center;
					}
					.line {
						width: #{2rpx};
						background-color: #e2e2e2;
						height: #{32rpx};
					}
					.cancel {
						color: #666666;
					}
					.sure {
						color: #446dfd;
					}
				}
			}
		}
	}
	.dialog {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.3);
		z-index: 1000;
	    .dialog-item {
	        padding-top: #{20rpx};
	        position: fixed;
	        top: 25%;
	        left: 0;
	        right: 0;
			z-index: 1001;
	        margin: 0 auto;
	        width: #{620rpx};
	        border-radius: #{16rpx};
	        background-color: #fff;
		    .error-info {
		        text-align: center;
		        margin: #{50rpx};
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
		    .dialog-title {
		        text-align: center;
		        margin: #{15rpx} 0 #{50rpx};
		    }
		    .submit-btn.be-submit {
		        color: #446dfd;
		    }
	    }
		.dialog-choose {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: #{400rpx};
			z-index: 1001;
			border-top-left-radius: #{16rpx};
			border-top-right-radius: #{16rpx};
			background-color: #fff;
			text-align: center;
			font-size: #{32rpx};
			color: #353535;
			.dialog-choose-item {
				height: #{100rpx};
				line-height: #{100rpx};
				border-bottom: #{2rpx} solid #e2e2e2;
			}
			.dialog-cancel {
				border-bottom: 0;
				color: #446dfd;
			}
		}
		.key-face-item {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: #{620rpx};
			background-color: white;
			border-radius: #{16rpx};
			.nav {
				text-align: center;
				.nav-item {
					height: #{88rpx};
				}
				text {
					display: inline-block;
					font-size: #{32rpx};
					height: #{88rpx};
					line-height: #{88rpx};
					color: #666666;
					border-bottom-width: #{2rpx};
					border-bottom-style: solid;
					border-bottom-color:transparent;
				}
			
				.recharge-active {
					color: #446dfd;
					border-bottom-color: #446dfd;
				}
			}
			.input {
				padding: #{32rpx};
				box-sizing: border-box;
				>input {
					height: #{80rpx};
					border-radius: #{16rpx};
					background-color: #f7f7f7;
					color: #353535;
					font-size: #{28rpx};
					padding-left: #{24rpx};
					box-sizing: border-box;
				}
				.remark-input {
					margin-top: #{20rpx};
				}
			}
			.button {
				height: #{88rpx};
				border-top: #{1rpx} solid #e2e2e2;
				position: relative;
				.app-line {
					width: #{2rpx};
					height: #{32rpx};
					position: absolute;
					top: #{28rpx};
					background-color: #e2e2e2;
					left: 0;
					right: 0;
					margin: 0 auto;
				}
				>view.cancel {
					height: #{88rpx};
					line-height: #{88rpx};
					text-align: center;
					position: relative;
					width: #{309rpx};
				}
				>view.confirm {
					height: #{88rpx};
					line-height: #{88rpx};
					text-align: center;
					position: relative;
					width: #{309rpx};
				}
				text {
					width: 100%;
					font-size: #{32rpx};
				}
				.confirm text {
					color: #446dfd;
				}
				.cancel text {
					color: #666666;
				}
			}
			.member-list {
				font-size: #{32rpx};
				color: #353535;
				padding: 0 #{32rpx};
				max-height: #{388rpx};
				overflow: auto;
				.member-item {
					height: #{88rpx};
					border-top: #{2rpx} solid #e2e2e2;
					width: #{566rpx};
					padding: 0 #{40rpx};
					image {
						width: #{36rpx};
						height: #{36rpx};
					}
				}
				.member-item:first-of-type {
					border-top: 0;
				}
			}
		}
	}
</style>