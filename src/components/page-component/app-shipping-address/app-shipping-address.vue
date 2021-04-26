<template>
	<view class="app-view">
		<view class="app-information">
			<view class="app-contact-information dir-left-wrap main-between">
                <text>收货人：{{item.name}}</text>
                <text>{{item.mobile}}</text>
			</view>
            <text class="address">收货地址: {{item.address}}</text>
		</view>
		<view @click.stop="editStop" class="app-operating dir-left-nowrap cross-center">
            <view v-if="is_hide_default_btn" class="dir-left-nowrap cross-center">
                <view class="app-radio">
                    <app-radio
                        @click="changeDefault"
                        :theme="theme"
                        width="32"
                        height="32"
                        v-model="item.is_default == 1"
                        type="round"
                    ></app-radio>
                </view>
                <text class="app-text app-text-color-default" v-if="item.is_default === `0`">设为默认</text>
                <text class="app-text" :style="{'color': theme.color}" v-else-if="item.is_default === `1`">
                    已设为默认
                </text>
            </view>
			<view class="app-operating-view dir-left-nowrap cross-center main-between">
                <view @click.stop="edit" class="app-modify dir-left-nowrap cross-center main-between">
                    <icon class="app-icon app-modify-icon" type></icon>
                    <text>编辑</text>
                </view>

                <view @click.stop="destroy" class="app-delete dir-left-nowrap cross-center main-between">
                    <icon class="app-icon app-delete-icon" type></icon>
                    <text>删除</text>
                </view>
			</view>
		</view>
	</view>
</template>

<script>
    import appRadio from '../../basic-component/app-radio/app-radio.vue';

    export default {
        name: "app-shipping-address",
        components: {appRadio},
	    props: {
            item: {
                type: Object,
            },
            is_hide_default_btn: {
                type: Boolean,
                default: false,
            },
            destroy_url: {
                type: String,
                default: ''
            },
            is_refund_address: {
                type: Number,
                default: 0,
            },
            type: {
                type: Number,
                default: 0,
            },
            theme: Object
	    },
        methods: {
            changeDefault() {
                const self = this;
                self.$request({
                    url: self.$api.user.address_default,
                    method: 'POST',
                    data: {
                        id: self.item.id,
                        type: self.type,
                        is_default: self.item.is_default == 1 ? 0 : 1,
                    }
                }).then((info) => {
                    if (info.code === 0) {
                        self.$emit('handleAddress');
                    } else {
                        uni.showToast({title: info.msg, icon: 'none'})
                    }
                });
            },
            edit() {
                uni.navigateTo({
                    url: `/pages/address/address-edit?id=${this.item.id}&is_refund_address=${this.is_refund_address}&type=${this.type}`
                });
            },
            editStop(){
                this.$emit('handleStop', 'editStop');
            },
            destroy() {
                const self = this;
                uni.showModal({
                    content: '确定删除收货地址',
                    success: function (res) {
                        if (res.confirm) {
                            self.$request({
                                url: self.destroy_url,
                                method: 'POST',
                                data: {
                                    id: self.item.id,
                                }
                            }).then((info) => {
                                if (info.code === 0) {
                                    self.$emit('handleAddress', 'delete')
                                } else {
                                    uni.showToast({title: info.msg, icon: 'none'})
                                }
                            });
                        }
                    }
                });
            },
        }
    }
</script>

<style scoped lang="scss">
	text {
		font-size: #{28rpx};
		color: #353535;
	}
	.radio {
		width: #{32upx};
		height: #{32upx};
	}
	.app-view {
        margin: 20upx 24upx;
        background: #FFFFFF;
        border-radius: #{16rpx};
		.app-information {
            padding: #{32rpx} #{24rpx};
			border-bottom: #{1rpx} solid #e2e2e2;
			.app-contact-information {
				margin-bottom: #{24rpx};
			}
            .address {
                word-wrap:break-word;
            }
		}
		.app-operating {
			margin-top: #{24rpx};
            padding-bottom: #{24rpx};

			.app-radio {
				margin-left: #{24rpx};
				margin-right: #{20rpx};
			}
			.app-text {
				font-size: #{28rpx};
			}
			.app-text-color-default {
				color: #999999;
			}
			.app-operating-view {
                margin-left: auto;
				right: #{24rpx};
				width: #{106rpx + 106rpx + 48rpx + 24rpx};
				height: #{32rpx};

                text {
                    color: #999999;
                }
				.app-modify {
					width: #{106rpx};
                }
				.app-delete {
					width: #{106rpx};
                    margin-right:#{24rpx};
				}
				.app-icon {
					width: #{32rpx};
					height: #{32rpx};
					background-size: 100% 100%;
					background-repeat: no-repeat;
				}
				.app-modify-icon {
					background-image: url("../../../static/image/icon/modify.png");
				}
				.app-delete-icon {
					background-image: url("../../../static/image/icon/delete.png");
				}
			}
		}
	}
</style>