<template>
	<view class="app-phone-binding">
		<view class="app-bound dir-top-nowrap cross-center" v-if="bind">
			<image class="app-image" :src="wxapp_img.mall.binding"></image>
			<view class="app-phone-text dir-top-nowrap" >
				<text>已绑定手机</text>
				<text class="app-hone">{{phone}}</text>
			</view>
			<view class="app-button">
				<app-button type="important" round background="#ff4544" height="88" width="700" fontSize="32" @click="clearPhone(false)">更换绑定</app-button>
			</view>
		</view>
		<template v-else>
			<view class="app-unbound">
				<!-- #ifndef MP-BAIDU -->
				<view class="header dir-left-nowrap" v-if="is_manual_mobile_auth == 1">
					<view class="box-grow-1" @click="setActive(1)">
						<app-form-id>
							<text :class="{'active-index': activeIndex === 1}">
								直接授权
							</text>
						</app-form-id>
					</view>
					<view class="box-grow-1" @click="setActive(2)">
						<app-form-id>
							<text :class="{'active-index': activeIndex === 2}">
								手动输入
							</text>
						</app-form-id>
					</view>
				</view>
				<!-- #endif-->
				<view class="content">
					<!-- #ifndef MP-BAIDU -->
					<view class="input-view dir-left-nowrap cross-center" v-if="activeIndex === 1">
						<view class="input" :class="{'input-value': value !== ''}">{{value === '' ? '点击授权获取手机号' : value}}</view>
						<view class="line"></view>

						<!-- #ifndef MP-ALIPAY -->
						<button open-type="getPhoneNumber" class="button" @getphonenumber="getPhoneNumber">点击授权</button>
						<!-- #endif -->

						<!-- #ifdef MP-ALIPAY -->
						<button open-type="getAuthorize"
								class="button"
								@getAuthorize="onGetAuthorize"
								scope='phoneNumber'
						>点击授权</button>
						<!-- #endif -->
					</view>
					<!-- #endif -->
					<view class="manual-input dir-top-nowrap"  v-if="activeIndex === 2">
						<view class="top">
							<input type="number" v-model="phoneNumber" placeholder="输入手机号">
						</view>
						<view class="bottom dir-left-nowrap cross-center">
							<input type="number" placeholder="输入验证码" v-model="verificationCode">
							<view class="line"></view>
							<view class="btn" @click="obtain">获取验证码</view>
						</view>
					</view>
					<view class="sure-button" @click="bindPhone(true, activeIndex)">确认</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
    import {mapState, mapGetters} from 'vuex';
    export default {
        name: 'app-phone-binding',
	    data() {
            return {
                code: '',
                value: '',
	            // #ifndef MP-BAIDU
                activeIndex: 1,
	            // #endif
                // #ifdef MP-BAIDU
                activeIndex: 2,
                // #endif
                phoneNumber: null,
                verificationCode: null,
            }
	    },
	    props: {
            bind: {
                type: Boolean,
            },
            phone: {
                type: String,
            }
	    },
        computed: {
            ...mapState({
                wxapp_img: state => state.mallConfig.__wxapp_img,
				is_manual_mobile_auth: state => state.mallConfig.mall.setting.is_manual_mobile_auth
            }),
        },
	    created() {
            // #ifndef MP-ALIPAY
            let _this= this;
            uni.login({
                scopes: 'auth_base',
                success(res) {
                    if (res.errMsg === 'login:ok') {
                        _this.code = res.code;
                    }
                }
            })
            // #endif
	    },
	    methods: {
            // #ifndef MP-ALIPAY
            getPhoneNumber(e) {
                if (e.detail.errMsg === 'getPhoneNumber:fail user deny' || !this.code) return;
                let _this = this;
                this.$request({
	                method: 'post',
	                url: _this.$api.phone.binding,
	                data: {
                        encryptedData: e.detail.encryptedData,
		                iv: e.detail.iv,
		                code: _this.code,
	                }
                }).then(response => {
                    this.value = response.data.mobile;
                })
            },
            // #endif
		    // #ifdef MP-ALIPAY
            onGetAuthorize() {
                let _this = this;
                my.getPhoneNumber({
                    success: (res) => {
                        this.$request({
                            method: 'post',
                            url: _this.$api.phone.binding,
                            data: {
                                data: JSON.parse(res.response).response,
                            }
                        });
                        this.value = JSON.parse(res.response).response;
                    },
                    fail: () => {
                    }
                });
            },
            // #endif
            bindPhone(data, i) {
                if (i === 1) {
                    if (this.value === '') return;
                    this.$emit('click', data);
                } else {
                    if (this.verificationCode === null) return;
                    this.$request({
                        url: this.$api.phone.binding,
	                    method: 'post',
                        data: {
                            mobile: this.phoneNumber,
	                        mobile_code: this.verificationCode,
                        }
                    }).then(res => {
                       if (res.code === 0) {
                           this.$emit('click', data);
                       } else if (res.code === 1) {
                           uni.showModal({
                               title: '提示',
                               content: res.msg,
                           })
                       }
                    });
                }
            },
            clearPhone(data) {
                this.$emit('click', data);
            },
            obtain() {
                if (this.phoneNumber === null) return;
                this.$request({
	                url: this.$api.phone.code,
	                data: {
                        mobile: this.phoneNumber,
	                }
                }).then(res => {
                    if (res.code === 0) {
                        uni.showModal({
                            title: '提示',
                            content: res.msg,
                        })
                    } else if (res.code === 1) {
                        uni.showModal({
	                        title: '提示',
	                        content: res.msg,
                        })
                    }
                })
            },
            setActive(data) {
                this.activeIndex = data;
            }
	    },
    }
</script>

<style scoped lang="scss">
	.app-phone-binding {
		position: absolute;
		height: 100%;
		width: 100%;
		background-color: #f7f7f7;
		.app-unbound {
			width: 100%;
			background-color: #f7f7f7;
			.header {
				width: 100%;
				height: #{86rpx};
				background-color: white;
				border-bottom: #{1rpx} solid #e2e2e2;
				text-align: center;
				margin-bottom: #{8rpx};
				.box-grow-1 {
					text {
						display: inline-block;
						height: #{84rpx};
						line-height: #{84rpx};
						border-bottom-color: transparent;
						border-bottom-style: solid;
						border-bottom-width: #{2rpx};
						color: #353535;
						font-size: #{28rpx};
					}
					.active-index {
						border-bottom-color: #ff4544;
						color: #ff4544;
					}
				}
			}
			.content {
				width: 100%;
				height: #{110rpx};
				background-color: white;
				padding: #{10rpx} 0;
				box-sizing: border-box;
				.input-view {
					margin-left: #{24rpx};
					background-color: white;
					height: #{80rpx};
					width: #{750-24rpx};
					.input {
						height: #{80rpx};
						width: #{516rpx};
						line-height: #{80rpx};
						background-color: #f7f7f7;
						padding-left: #{24rpx};
						box-sizing: border-box;
						font-size: #{28rpx};
						color: #999999;
						margin-right: #{16rpx};
					}
					.input-value {
						color: #353535;
					}
					.line {
						width: #{1rpx};
						height: #{36rpx};
						background-color: #e2e2e2;
					}
					.button {
						width: #{194rpx};
						height: #{80rpx};
						line-height: #{80rpx};
						color: #ff4544;
						font-size: #{28rpx};
						background-color: white;
						border: none;
						border-radius: 0;
						text-align: center;
						padding: 0;
						box-sizing: border-box;
					}
				}
				.manual-input {
					width: 100%;
					height: #{200rpx};
					background-color: white;
					.top {
						height: #{100rpx};
						font-size: #{28rpx};
						border-bottom: #{1rpx} solid #e2e2e2;
						>input {
							width: #{750rpx};
							height: #{60rpx};
							margin: #{20rpx} 0;
							padding-left: #{40rpx};
							box-sizing: border-box;
						}
					}
					.bottom {
						height: #{100rpx};
						>input {
							width: #{750-220-1rpx};
							line-height: #{60rpx};
							padding-left: #{40rpx};
							font-size: #{28rpx};
							margin: #{20rpx} 0;
							box-sizing: border-box;
						}
						.line {
							width: #{1rpx};
							height: #{32rpx};
							background-color: #e2e2e2;
						}
						.btn {
							height: #{100rpx};
							line-height: #{100rpx};
							width: #{220rpx};
							font-size: #{28rpx};
							text-align: center;
							color: #ff4544;
						}
					}
				}
				.sure-button {
					width: #{702rpx};
					height: #{88rpx};
					line-height: #{88rpx};
					text-align: center;
					margin: #{80rpx 20rpx 0 24rpx};
					background-color: #ff4544;
					color: white;
					font-size: #{32rpx};
					border-radius: #{44rpx};
				}
			}
		}
		.app-bound {
			width: #{750rpx};

			.app-image {
				width: #{288rpx};
				height: #{288rpx};
				margin: #{64rpx 0rpx 56rpx 0rpx};
			}

			.app-phone-text {
				text-align: center;
				color: #666;
				font-size: #{30rpx};
				margin-bottom: #{60rpx};

				.app-hone {
					margin-top: #{15rpx};
				}

				.app-button {
					height: 100%;
					border: none;
					font-size: #{26rpx};
					color: #ff4544;
					padding: 0 0;
					margin-top: #{64rpx};
					margin-left: #{24rpx};
					margin-right: #{24rpx};
				}

				.app-button:after {
					display: none;
				}
			}
		}
	}
</style>
