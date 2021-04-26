<template>
   <view class="app-submit-address">
	   <view class="information dir-top-nowrap main-left">
		   <view class="express dir-left-nowrap cross-center" @click="navigateAddress" v-if="delivery === 0">
			   <view class="dir-top-nowrap content" v-if="Object.keys(address).length > 0">
				   <view class="top dir-left-nowrap main-between">
					   <text class="font">收货人：{{address.name}}</text>
					   <text class="font">{{address.mobile}}</text>
				   </view>
				   <view class="bottom font t-omit-two">
					   收货地址：{{address.province}}{{address.city}}{{address.district}}{{address.detail}}
				   </view>
			   </view>
			   <view class="content font" v-else>请选择收货地址</view>
			   <view>
				   <image class="icon-image" src="/static/image/icon/arrow-right.png"></image>
			   </view>
		   </view>
		   <view class="lifting dir-left-nowrap cross-center main-between" v-else>
			   <input type="text" placeholder="姓名" v-model="name">
			   <input type="number" placeholder="电话" v-model="mobile">
		   </view>
		   <image class="line" :src="appImg.common.address_bottom"></image>
	   </view>
	   <view class="delivery-method dir-left-nowrap main-between cross-center">
		   <view>配送方式</view>
		   <view class="dir-left-nowrap main-between method">
			   <text class="item" @click="setMethod(0)" :class="[`${delivery === 0 ? theme + '-background' : ''}`]">快递配送</text>
			   <text class="item" @click="setMethod(1)" :class="[`${delivery === 1 ? theme + '-background' : ''}`]">到店自提</text>
		   </view>
	   </view>
	   <view class="store-information dir-top-nowrap" v-if="delivery === 1">
		   <view class="font" v-if="store_list.length == 0">
			   暂无门店，请选择其他配送方式
		   </view>
		   <view class="font" v-if="store_list.length > 0">门店信息</view>
		   <view class="dir-left-nowrap main-between cross-center" v-if="store_list.length > 0">
			  <view class="content dir-top-nowrap">
				  <view class="dir-left-nowrap main-between">
					  <view class="font">{{store_list[0].name}}</view>
					  <view>
						  <image class="location" src="/static/image/icon/location.png"></image>
						  <text class="font">距您{{store_list[0].distance}}</text>
					  </view>
				  </view>
				  <view class="address">
					  {{store_list[0].address}}
				  </view>
			  </view>
			   <image class="icon-image" src="/static/image/icon/arrow-right.png"></image>
		   </view>
	   </view>
   </view>
</template>

<script>
    import { mapState } from 'vuex';

	export default {
		props: {
			theme: String,
            address: Object,
            goods_id: Number,
            id: Number,
		},

		data() {
		    return {
                delivery: 0,
                store_list: [],
			    name: '',
			    mobile: '',
		    }
		},
		methods: {
			navigateAddress() {
				let url = '/pages/order-submit/address-pick';
				url += '?sign=gift&id='+ this.id;
				uni.navigateTo({
					url: url,
				});
			},

            setMethod(data) {
                this.delivery = data;
                let _this = this;
                if (this.delivery === 1) {
                    uni.getLocation({
                        type: 'wgs84',
                        success: function (res) {
                            _this.$request({
	                            url: _this.$api.order.store_list,
	                            data: {
                                    latitude: res.latitude,
                                    longitude: res.longitude,
		                            goods_id: _this.goods_id,
	                            }
                            }).then(res => {
                                _this.store_list = res.data.list;
                            })
                        }
                    });
                }
            }
		},

		computed: {
			...mapState({
				appImg: state => state.mallConfig.__wxapp_img,
			}),
		},
	}
</script>


<style lang="scss" scoped>
	.icon-image {
		width: #{12upx};
		height: #{22upx};
	}
	.information {
		background-color: #ffffff;
	}
	.app-submit-address {
		width: 100%;
		
		.express {
			.content {
				width:#{660upx};
				margin-right: #{28upx};
			}
			padding: #{32upx 24upx};
			.top {
				margin-bottom: #{22upx};
			}
			
			.font {
				font-size: #{32upx};
				line-height: 1;
				color: #353535;
			}
			.bottom {
				line-height: #{36upx};
			}
		}
		.line {
			width: 100%;
			height: #{8upx};
		}
		
	}
	
	.delivery-method {
		font-size: #{32upx};
		width: 100%;
		margin-top: #{24upx};
		background-color: #ffffff;
		height: #{120upx};
		padding: #{0 24upx};
		.method {
			width: #{355upx};
			.item {
				width: #{170upx};
				height: #{56upx};
				border-radius: #{30upx};
				line-height: #{56upx};
				background-color: #f7f7f7;
				text-align: center;
			}
		}
	}
	
	
	.lifting {
		padding: #{0 24upx};
		width: 100%;
		height: #{100upx};
		input {
			width: 50%;
			color: #353535;
			font-size: #{32upx};
		}
	}
	/*门店信息*/
	.store-information {
		width: 100%;
		padding: #{32upx 24upx 32upx 24upx};
		background-color: #ffffff;
		border-top: #{1upx} solid #e2e2e2;
		.content {
			padding: #{32upx 40upx 32upx 0};
			width: #{662upx};
		}
		.font {
			color: #353535;
			font-size: #{32upx};
			line-height: 1;
		}
		
		.location {
			width: #{22upx};
			height: #{26upx};
			margin-right: #{8upx};
		}
		
		.address {
			color: #999999;
			font-size: #{28upx};
			line-height: 1;
			margin-top: #{20upx};
		}
	}
</style>
	
