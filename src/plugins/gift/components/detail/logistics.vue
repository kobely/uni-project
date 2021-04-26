<template>
	<view class="logistics dir-left-nowrap main-between cross-center" @click="routeGo()">
		<view class="font" v-if="send_type != 1 && is_send == 1 && express_no" >
			<view class="item margin">
				<text class="gray">快递公司：</text>
				<text class="black">{{express}}</text>
			</view>
			<view class="item">
				<text class="gray">物流单号：</text>
				<text class="black">{{express_no}}</text>
			</view>
		</view>
		<view class="font" v-else-if="send_type == 1">
			<view class="item margin">
				<text class="gray">门店名称：</text>
				<text class="black">{{store.name}}</text>
			</view>
			<view class="item margin">
				<text class="gray">联系电话：</text>
				<text class="black">{{store.mobile}}</text>
			</view>
			<view class="item">
				<text class="gray">门店地址：</text>
				<text class="black">{{store.address}}</text>
			</view>
		</view>
		<image class="icon" src="/static/image/icon/arrow-right.png"></image>
	</view>
</template>

<script>
    export default {
        name: 'logistics',
	    
	    props: [`send_type`, `store`, `is_send`, `express`, `express_no`, `customer_name`, `cover_pic`],

        methods: {
            routeGo() {
                if (this.send_type != 1 && this.is_send == 1 && this.express_no) {
                    uni.navigateTo({
                        url: `/pages/order/express-detail/express-detail?express=${this.express}&express_no=${this.express_no}&customer_name=${this.customer_name}&cover_pic=${this.cover_pic}`
                    })
                } else {
                    uni.openLocation({
                        latitude: parseFloat(this.store.latitude),
	                    longitude: parseFloat(this.store.longitude),
                        address: this.store.address,
                        name: this.store.name,
                    })
                }
            },
	        
        }
    }
</script>

<style scoped lang="scss">
	.logistics {
		width: 100%;
		background-color: #ffffff;
		padding: #{28upx 24upx};
		.icon {
			width: #{12upx};
			height: #{20upx};
		}
		.font {
			font-size: #{24upx};
		}
		.margin {
			margin-bottom: #{15upx};
		}
	}
</style>