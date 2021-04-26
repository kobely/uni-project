<template>
	<view class="safe-area-inset-bottom u-bottom-fixed">
		<view class="page-width receiving-status dir-left-nowrap cross-center main-right">
			<view class="item" @click="route_go(`/plugins/gift/receive/receive?gift_id=${gift_id}&status=${status}`)">
				查看领取详情
			</view>
			<view class="item" v-if="status != 0 && status_num == 1 && !notPayOrder && getConvert(detail)" @click="setShare">
				转赠礼物
			</view>
			<view class="item" v-if="status != 0 && status_num == 1 && !notPayOrder  && getConvert(detail)" @click="route_go(`/plugins/gift/address/address?id=${user_id}&status=${status}`)">
				填写地址
			</view>
			<view class="item" v-if="status != 0 && status_num == 2  && getConvert(detail)" @click="receipt">
				确认收货
			</view>
			<view class="item" v-if="notPayOrder && getConvert(detail)" @click="route_go(`/pages/order/index/index?status=1`)">
				去支付
			</view>
		</view>
	</view>
</template>

<script>
    export default {
        name: "receiving-status",
	    props: [`theme`, `type`, `gift_id`, `status`, `status_num`, `user_id`, `order_id`, `notPayOrder`, `detail`],
	    methods: {
            route_go(data) {
                uni.navigateTo({
	                url: data,
                })
            },
		    // 转赠礼物
            setShare() {
                this.$emit('setShare');
            },
            receipt() {
                this.$emit('receipt', this.order_id);
            },
            getConvert(order_list){
                let  is_convert = true;
                for (let i = 0; i < order_list.length;i++) {
                    if (order_list[i].is_convert == -1) {
                        is_convert = false;
                    }
                }
                return is_convert;
            }
	    }
    }
</script>

<style scoped lang="scss">
	.receiving-status {
		height: #{110upx};
		padding: #{0 8upx};
		.item {
			padding: #{0 28upx};
			margin-right: #{16upx};
			height: #{62upx};
			line-height: #{62upx};
			font-size: #{24upx};
			color: #353535;
			border-radius: #{38upx};
			border: #{1upx} solid #bbbbbb;
		}
	}
    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1500;
        background-color: #ffffff;
    }
</style>