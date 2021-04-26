<template>
	<app-layout>
        <view class="info">
            <image class="avatar" :src="detail.avatar"></image>
            <view class="dir-left-nowrap form-item">
            	<view class="label">姓名</view>
            	<view class="item-content">{{detail.nickname}}</view>
            </view>
            <view class="dir-left-nowrap form-item">
                <view class="label">手机号</view>
                <view class="item-content t-omit">{{detail.mobile}}</view>
            </view>
            <view class="dir-left-nowrap form-item">
                <view class="label">所在地区</view>
                <view class="item-content" v-if="detail.user_id > 0">{{detail.province}}{{detail.city}}{{detail.district}}{{detail.location}}</view>
            </view>
            <view class="dir-left-nowrap form-item">
                <view class="label">提货地址</view>
                <view class="item-content">{{detail.detail}}</view>
            </view>
        </view>
		<view class="button dir-left-nowrap main-between">
			<view class="fail" @click="refuse">拒绝</view>
			<view class="by" @click="by">通过</view>
		</view>
		<view @touchmove.stop.prevent="" class="model" v-if="model">
			<template v-if="modelType === 1">
				<view class="refuse">
					<view class="top">{{type > 2 ? '拒绝申请' : '不通过申请'}}</view>
					<view class="content">
						<textarea v-model="reasonRefusal" class="textarea" placeholder="请填写拒绝理由"></textarea>
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
	</app-layout>
</template>

<script>
    export default {
	    data() {
            return {
            	id: 0,
            	detail: {},
                modelType: 1,
                reasonRefusal: '',
	            model: false,
                iphone_x: false,
            }
	    },
	    onLoad(options) { this.$commonLoad.onload(options);
	    	let that = this;
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.id = options.id;
            that.getDetail();
	    },
	    methods: {
	    	getDetail() {
	            this.$request({
	                url: this.$api.app_admin.review_detail_v2,
	                data: {
	                    key: 'community',
	                    user_id: this.id
	                }
	            }).then(response => {
                    this.$hideLoading();
                    uni.hideLoading();
	            	if (response.code === 0) {
                        this.detail = response.data;
	            	}
	            }).catch(() => {
                    this.$hideLoading();
                    uni.hideLoading();
                });
	    	},

            refuse() {
                this.modelType = 1;
                this.model = true;
            },
            by() {
                this.modelType = 2;
                this.model = true;
            },
            confirm() {
                if (this.modelType === 2) {
                    this.$request({
                        url: this.$api.app_admin.review_switch_v2,
                        method: 'post',
                        data: {
                            key: 'community',
                            status: 1,
                            user_id: this.detail.user_id
                        }
                    }).then(response => {
                        if (response.code === 0) {
                            uni.showToast({
                                title: '通过申请',
                                duration: 1000
                            });
                            this.model = false;
                            setTimeout(function(){
                            	uni.navigateBack();
                            })
                        }
                    })
                } else if (this.modelType === 1) {
                    this.$request({
                        url: this.$api.app_admin.review_switch_v2,
                        method: 'post',
                        data: {
                            key: 'community',
                            status: 2,
                            reason: this.reasonRefusal,
                            user_id: this.detail.user_id
                        }
                    }).then(response => {
                        if (response.code === 0) {
                            this.reasonRefusal = '';
                            this.model = false;
                            uni.showToast({
                                title: '拒绝申请',
                                icon: 'none',
                                duration: 1000
                            });
                            setTimeout(function(){
                            	uni.navigateBack();
                            })
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
            cancel() {
                this.model=false;
            }
	    }
    }
</script>

<style scoped lang="scss">

    .info {
        position: relative;
        z-index: 10;
        width: 702rpx;
        margin: 94rpx auto 0;
        border-radius: 16rpx;
        background-color: #fff;
        font-size: 32rpx;
        color: #353535;
        padding: 98rpx 40rpx 15rpx;
        .avatar {
            width: 140rpx;
            height: 140rpx;
            border-radius: 70rpx;
            border: 4rpx solid #fff;
            position: absolute;
            top: -70rpx;
            left: 50%;
            margin-left: -70rpx;
        }
        .form-item {
        	margin-bottom: 26rpx;
        	.label {
        		color: #999999;
        		width: 170rpx;
        		flex-shrink: 0;
        	}
	        .item-content {
	            width: 450rpx;
	            .placeholder {
	            	margin: 0 10rpx;
	            }
	        }
        }
    }

	.button {
		width: #{750-48rpx};
		height: #{80rpx};
		margin: #{80rpx} #{12rpx};
		>view {
			width: #{346rpx};
			height: #{80rpx};
			line-height: #{80rpx};
			text-align: center;
			border-radius: #{40rpx};
			font-size: #{28rpx};
		}
		.fail {
			background-color: #e2e2e2;
			color: #353535;
		}
		.by {
			background-color: #446dfd;
			color: white;
		}
	}
	.model {
		position: fixed;
		z-index: 1600;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(0,0,0,.3);
        .dialog-list {
            padding: 46rpx 30rpx;
            .dialog-item {
                margin: 10rpx;
                height: 62rpx;
                line-height: 60rpx;
                display: inline-block;
                padding: 0 32rpx;
                font-size: 32rpx;
                color: #353535;
                border-radius: 32rpx;
                border: 2rpx solid #bbbbbb;
                &.active {
                    color: #446dfd;
                    border: 2rpx solid #446dfd;
                }
            }
        }
		.top {
			margin-top: #{40rpx};
			margin-bottom: #{32rpx};
			color: #353535;
			font-size: #{32rpx};
			text-align: center;
		}
		.content {
			width: calc(100% - #{64rpx});
			margin: 0 #{32rpx};
		}
		.buttons {
			width: 100%;
			border-top: #{1rpx} solid #e2e2e2;
			margin-top: #{32rpx};
			.but {
				width: calc(50% - #{1rpx});
				height: #{88rpx};
				line-height: #{88rpx};
				font-size: #{32rpx};
				text-align: center;
			}
			.line {
				width: #{2rpx};
				height: #{32rpx};
				background-color: #e2e2e2;
			}
			.cancel {
				color: #666666;
			}
			.confirm {
				color: #446dfd;
			}
		}
		.refuse {
			width: #{620rpx};
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			border-radius: #{16rpx};
			background-color: white;
			.content {
				border-radius: #{16rpx};
				border: #{1rpx} solid #e2e2e2;
				height: #{300rpx};
				box-sizing: border-box;
				padding: #{24rpx} #{32rpx};
			}
			.textarea {
				width: #{620-64-64rpx};
				height: #{300-48rpx};
				font-size: #{28rpx};
				color: #80848f;
			}
		}
		.by {
			width: #{620rpx};
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			border-radius: #{16rpx};
			background-color: white;
			.content {
				font-size: #{32rpx};
				color: #353535;
				text-align: center;
			}
		}
	}
</style>