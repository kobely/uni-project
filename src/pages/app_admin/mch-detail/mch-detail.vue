<template>
	<app-layout>
        <view class="mch-detail" v-if="pageShow">
            <view class="title">
                基本信息
            </view>
            <view class="information">
                <view class="line line-margin dir-left-nowrap">
                    <view class="label">
                        申请人
                    </view>
                    <view class="expression">
                        {{detail.user.nickname}}
                    </view>
                </view>
                <view class="line line-margin dir-left-nowrap">
                    <view class="label">
                        联系人
                    </view>
                    <view class="expression">
                        {{detail.realname}}
                    </view>
                </view>
				<view class="line line-margin dir-left-nowrap">
					<view class="label">
						联系电话
					</view>
					<view class="expression">
						{{detail.mobile}}
					</view>
				</view>
				<view class="line line-margin dir-left-nowrap">
					<view class="label">
						微信号
					</view>
					<view class="expression">
						{{detail.wechat}}
					</view>
				</view>
				<view class="line dir-left-nowrap cross-center">
					<view class="label have-icon  dir-left-nowrap cross-center">
						<image class="icon" src="../image/price.png"></image>
						<text>手续费</text>
					</view>
					<view class="expression dir-left-nowrap cross-center">
						<input type="number" maxlength="4" max="1000" v-model="transfer_rate" @input="onInput" placeholder-style="color: #cdcdcd;" class="input" placeholder="设置0~1000整数商户交易手续费率">
						<view>‰</view>
					</view>
				</view>
			</view>
			<view class="title">
				店铺信息
			</view>
			<view class="information">
				<view class="line line-margin dir-left-nowrap">
					<view class="label">
						店铺名称
					</view>
					<view class="expression">
						{{detail.scope}}
					</view>
				</view>
				<view class="line line-margin dir-left-nowrap">
					<view class="label">
						所在地区
					</view>
					<view class="expression">
						{{detail.districts}}
					</view>
				</view>
				<view class="line line-margin dir-left-nowrap">
					<view class="label">
						详细地址
					</view>
					<view class="expression">
						{{detail.address}}
					</view>
				</view>
				<view class="line line-margin dir-left-nowrap">
					<view class="label">
						所售类目
					</view>
					<view class="expression">
						{{detail.cat_name}}
					</view>
				</view>
				<view class="line dir-left-nowrap">
					<view class="label">
						客服电话
					</view>
					<view class="expression">
						{{detail.service_mobile}}
					</view>
				</view>
			</view>
			<view class="title" v-if="showForm">
				其他信息
			</view>
			<view class="information" v-if="showForm">
				<block v-for="(item, index) in detail.form_data" :key="index">
					<template
							v-if="item.key === 'text' || item.key === 'date' || item.key === 'radio'|| item.key === 'time'|| item.key === 'checkbox'"
					>
						<view class="line line-margin dir-left-nowrap" v-if="item.value">
							<view class="label">
								{{item.label}}
							</view>
							<view class="expression break-word">
								{{item.value}}
							</view>
						</view>
					</template>
					<template v-else-if="item.key === 'img_upload' && item.value">
						<view class="line line-margin dir-left-nowrap">
							<view class="label">
								{{item.label}}
							</view>
							<view class="expression dir-left-wrap">
								<template v-if="getTypeof(item.value) === 'string'" >
									<image class="image" v-if="item.value" :src="item.value" @click="preview(item.value)"></image>
								</template>
								<template v-if="getTypeof(item.value) === 'object'">
									<image class="image" v-if="image" v-for="(image, i) in item.value" @click="preview(image)" :key="i" :src="image"></image>
								</template>
							</view>
						</view>
					</template>
				</block>
			</view>
			<view class="button dir-left-nowrap main-between" style="visibility: hidden;">
				<view class="fail">
					<app-form-id>
						不通过
					</app-form-id>
				</view>
				<view class="by">
					<app-form-id>
						通过
					</app-form-id>
				</view>
			</view>
			<view class="button fixed dir-left-nowrap main-between">
				<view class="fail" @click="fail">
					<app-form-id>
						不通过
					</app-form-id>
				</view>
				<view class="by" @click="by">
					<app-form-id>
						通过
					</app-form-id>
				</view>
			</view>
			<view @touchmove.stop.prevent="" class="model" v-if="model">
				<template v-if="modelType === 1">
					<view class="refuse">
						<view class="top">不通过申请</view>
						<view class="content">
							<textarea v-model="reasonRefusal"  class="textarea" placeholder="请填写拒绝理由"></textarea>
						</view>
						<view class="buttons dir-left-nowrap cross-center">
							<view class="but cancel"  @click="cancel">
								<app-form-id>
									取消
								</app-form-id>
							</view>
							<view class="line"></view>
							<view class="but confirm"  @click="confirm">
								<app-form-id>确认</app-form-id>
							</view>
						</view>
					</view>
				</template>
				<template v-if="modelType === 2">
					<view class="by">
						<view class="top">通过申请</view>
						<view class="content">
							是否确认通过申请
						</view>
						<view class="buttons dir-left-nowrap cross-center">
							<view class="but cancel" @click="cancel">
								<app-form-id>
									取消
								</app-form-id>
							</view>
							<view class="line"></view>
							<view class="but confirm" @click="confirm">
								<app-form-id>确认</app-form-id>
							</view>
						</view>
					</view>
				</template>
			</view>
		</view>
	</app-layout>
</template>

<script>
    export default {
        name: 'mch-detail',
	    data() {
            return {
                detail: {
                    user: {
                        nickname: '',
                    },
                    realname: '',
                    mobile: '',
                    wechat: '',
                    scope: '',
                    districts: '',
                    address: '',
                    cat_name: '',
                    service_mobile: '',
                    form_data: [],
                },
                model: false,
                modelType: 0,
                reasonRefusal: '',
                transfer_rate: null,
                pageShow: false,
                showForm: false,
            }
	    },
	    onLoad(options) { this.$commonLoad.onload(options);
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.$request({
                url: this.$api.app_admin.review_detail,
                data: {
                    id: options.id
                }
            }).then(response => {
                this.$hideLoading();
                if (response.code === 0) {
                    this.pageShow = true;
                    this.detail = response.data.detail;
                    for(let item of this.detail.form_data) {
                    	if(item.value) {
                    		this.showForm = true;
                    	}
                    }
                }
            }).catch(() => {
                this.$hideLoading();
            });
	    },
	    methods: {
            getTypeof(data) {
                return typeof(data);
            },
            fail() {
                this.model = true;
                this.modelType = 1;
            },
		    by() {
                this.model = true;
                this.modelType = 2;
            },
            cancel() {
                this.model = false;
                this.modelType = 0;
            },
            confirm() {
                if (this.modelType === 2) {
                    this.detail.transfer_rate = this.transfer_rate;
                    this.$request({
	                    url: this.$api.app_admin.review_switch,
	                    method: 'post',
	                    data: {
	                        type: 1,
		                    status: 1,
		                    form: JSON.stringify(this.detail),
                            user_id: this.detail.id
	                    }
                    }).then(response => {
                        if (response.code === 0) {
                            uni.navigateBack();
                            this.model = false;
                        } else if (response.code === 1) {
							uni.showToast({
								title: response.msg
							})
                        }
                    })
                } else if (this.modelType === 1) {
                    this.detail.review_remark = this.reasonRefusal;
                    this.$request({
                        url: this.$api.app_admin.review_switch,
                        method: 'post',
                        data: {
                            type: 1,
                            status: 2,
                            form: JSON.stringify(this.detail),
                            user_id: this.detail.id
                        }
                    }).then(response => {
                        if (response.code === 0) {
                            uni.navigateBack();
                            this.model = false;
                        } else if (response.code === 1) {
                            uni.showToast({
                                title: response.msg
                            })
                        }
                    });
                }
            },
            preview(data) {
                uni.previewImage({
                    urls: [data]
                });
            },
            onInput(data) {
                if (Number(data.detail.value) > 1000) {
                    setTimeout(() => {
                        this.transfer_rate = 1000;
                    });
                }
            }
	    }
    }
</script>

<style scoped lang="scss">
@import './mch-detail.scss';
</style>