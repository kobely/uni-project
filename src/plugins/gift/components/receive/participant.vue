<template>
    <view class="participant">
		<view class="title">已有{{userOrder.length}}人参与</view>
		<view class="content dir-left-wrap">
			<image class="avatar" :src="item.user.userInfo.avatar" v-for="(item, index) in newUserOrder" :key="index" :class="{'margin-right': filter(index)}"></image>
		</view>
		<view class="no-more" v-if="userOrder.length> 30">仅显示最近参与30人</view>
	</view>
</template>

<script>
export default {
    name: 'participant',
	
	props: [`userOrder`],

	methods: {
		filter(data) {
			return /[9]/.test(data);
		}
	},
	
	computed: {
        newUserOrder() {
            if (this.userOrder.length > 30) {
                return this.userOrder.slice(0, 30);
            } else {
                return this.userOrder;
            }
        }
	}

}
</script>

<style lang="scss" scoped>
	.participant {
		width: #{638upx};
		border-top:#{1upx} solid #e2e2e2;
		.title {
			font-size: #{28upx};
			line-height: 1;
			text-align: center;
			color: #353535;
			margin: #{40upx 0 32upx 0};

		}

		.avatar {
			width: #{56upx};
			height: #{56upx};
			margin-bottom: #{20upx};
			margin-right: #{8upx};
		}

		.margin-right {
			margin-right: #{6upx};
		}
		.no-more {
			margin-top: #{12upx};
			font-size: #{24upx};
			color: #999999;
			text-align: center;
		}
	}
</style>