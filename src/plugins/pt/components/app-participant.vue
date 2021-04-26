<template>
	<view class="app-participant">
		<view v-if="ptBool">
			<app-participant-model :theme="theme" v-model="ptBool" :pintuan_list="list"></app-participant-model>
		</view>

		<view class="app-spec dir-left-nowrap main-between cross-center" @click="route_go">
			<view class="item dir-top-nowrap main-center cross-center">
				<image src="../image/pay.png"></image>
				<text>支付开团</text>
			</view>
			<image class="arrow" src="../image/arrow.png"></image>
			<view class="item dir-top-nowrap main-center cross-center">
				<image src="../image/invite.png"></image>
				<text>邀请好友</text>
			</view>
			<image class="arrow" src="../image/arrow.png"></image>
			<view class="item dir-top-nowrap main-center cross-center">
				<image src="../image/ship.png"></image>
				<text>成功发货</text>
			</view>
			<image class="arrow" src="../image/arrow.png"></image>
			<view class="item dir-top-nowrap main-center cross-center">
				<image src="../image/refund.png"></image>
				<text>失败退款</text>
			</view>
		</view>
		<view class="app-content" v-if="list.length > 0">
			<view class="app-peo-text dir-left-nowrap main-between cross-center">
				<text>以下小伙伴正在发起拼团，您可以直接参与：</text>
				<view>
					<app-form-id @click="ptBool = true">
						<text class="app-text">查看更多</text>
						<image class="app-icon" src="../../../static/image/icon/arrow-right.png"></image>
					</app-form-id>
				</view>
			</view>

			<!-- #ifdef MP-ALIPAY -->
			<template v-if="list.length === 1">
				<block v-for="(item, index) in 1" :key="index">
					<view class="app-item dir-left-nowrap main-between" >
						<view class="dir-left-nowrap cross-center">
							<image class="app-icon" :src="list[item-1].avatar"></image>
							<text class="app-name">{{list[item-1].nickname}}</text>
						</view>
						<view class="dir-left-nowrap cross-center">
							<view class="app-text dir-top-nowrap main-between">
								<text class="app-red">还差{{list[item-1].surplus_people}}人成团</text>
								<view class="app-gray">
									<app-surplus-time :surplus_date_time="list[item-1].surplus_date_time"></app-surplus-time>
								</view>
							</view>
							<view class="app-go" :style="{'background-color': theme.background}">
								<app-jump-button form :url="`/plugins/pt/detail/detail?id=${list[item-1].id}`">
									去参团
								</app-jump-button>
							</view>
						</view>
					</view>
				</block>
			</template>

			<template v-if="list.length >= 2">
				<block v-for="(item, index) in 2" :key="index">
					<view class="app-item dir-left-nowrap main-between" >
						<view class="dir-left-nowrap cross-center">
							<image class="app-icon" :src="list[item-1].avatar"></image>
							<text class="app-name">{{list[item-1].nickname}}</text>
						</view>
						<view class="dir-left-nowrap cross-center">
							<view class="app-text dir-top-nowrap main-between">
								<text class="app-red">还差{{list[item-1].surplus_people}}人成团</text>
								<view class="app-gray">
									<app-surplus-time :surplus_date_time="list[item-1].surplus_date_time"></app-surplus-time>
								</view>
							</view>
							<view class="app-go" :style="{'background-color': theme.background}">
								<app-jump-button form :url="`/plugins/pt/detail/detail?id=${list[item-1].id}`">
									去参团
								</app-jump-button>
							</view>
						</view>
					</view>
				</block>
			</template>
			<!-- #endif -->

			<!-- #ifndef MP-ALIPAY -->
			<template v-if="list.length === 1 && list">
				<block v-for="(item, index) in 1" :key="index">
					<view class="app-item dir-left-nowrap main-between" >
						<view class="dir-left-nowrap cross-center">
							<image class="app-icon" :src="list[item].avatar"></image>
							<text class="app-name">{{list[item].nickname}}</text>
						</view>
						<view class="dir-left-nowrap cross-center">
							<view class="app-text dir-top-nowrap main-between">
								<text class="app-red">还差{{list[item].surplus_people}}人成团</text>
								<view class="app-gray">
									<app-surplus-time :surplus_date_time="list[item].surplus_date_time"></app-surplus-time>
								</view>
							</view>
							<view class="app-go" :style="{'background-color': theme.background}">
								<app-jump-button form :url="`/plugins/pt/detail/detail?id=${list[item].id}`">
									去参团
								</app-jump-button>
							</view>
						</view>
					</view>
				</block>
			</template>

			<template v-if="list.length >= 2 && list">
				<block v-for="(item, index) in 2" :key="index">
					<view class="app-item dir-left-nowrap main-between" >
						<view class="dir-left-nowrap cross-center">
							<image class="app-icon" :src="list[item].avatar"></image>
							<text class="app-name">{{list[item].nickname}}</text>
						</view>
						<view class="dir-left-nowrap cross-center">
							<view class="app-text dir-top-nowrap main-between">
								<text class="app-red">还差{{list[item].surplus_people}}人成团</text>
								<view class="app-gray">
									<app-surplus-time :surplus_date_time="list[item].surplus_date_time"></app-surplus-time>
								</view>
							</view>
							<view class="app-go" :style="{'background-color': theme.background}">
								<app-jump-button form :url="`/plugins/pt/detail/detail?id=${list[item].id}`">
									去参团
								</app-jump-button>
							</view>
						</view>
					</view>
				</block>
			</template>
			<!-- #endif -->
		</view>
		
	</view>
</template>

<script>
	import appSurplusTime from './app-surplus_time.vue';
	import appParticipantModel from './app-participant-model.vue';
	
    export default {
        name: 'app-participant',
	    data() {
            return {
                ptBool: false,
                show: 0,
                selectAttr: {},
                attr: {},
				list: []
            }
	    },
	    props: {
            pintuan_list: {
                type: Array,
	            default() {
                    return [];
	            }
            },
			theme: Object
	    },

		methods: {
			route_go() {
				uni.navigateTo({
					url: `/pages/rules/index?url=${encodeURIComponent(this.$api.pt.index)}&keys=${JSON.stringify(['setting', 'new_rules'])}`,
				});
			}
		},
	    components: {
            'app-surplus-time': appSurplusTime,
		    'app-participant-model': appParticipantModel
	    },

		watch: {
			pintuan_list: {
				handler(data) {
					this.list  = data;
				},
				immediate: true
			}
		}
    }
</script>

<style scoped lang="scss">
	.app-spec {
		height: #{160rpx};
		padding: #{16upx 60upx 10upx 60upx};
		.arrow {
			width: #{38upx};
			height: #{30upx};
		}

		.item {

			image {
				width: #{50upx};
				height: #{50upx};
				margin-bottom: #{10upx};
			}

			text {
				font-size: #{24upx};
				line-height: 1;
				color: #666666;
				margin-top: #{10upx};
			}
		}
	}

	.app-participant {
		width: #{702rpx};
		background-color: white;
        padding: 20upx;
        margin: 24upx 24upx 0 24upx;
        border-radius: 15upx;
		.app-left {
			font-size: #{24rpx};
			color: #666666;
		}

		.app-right {
			width: #{134rpx};
		}

		.app-text {
			font-size: #{24rpx};
			color: #999999;
		}

		.app-icon {
			width: #{12rpx};
			height: #{22rpx};
			margin-left: #{12rpx};
		}

		.app-content {
			padding: #{0 24upx 20upx 24upx};
			box-sizing: border-box;
		}

		.app-peo-text {
			font-size: #{24rpx};
			color: #666666;
			padding: #{24rpx} 0;
			box-sizing: border-box;

			.app-icon {
				width: #{12rpx};
				height: #{22rpx};
				margin-left: #{12rpx};
			}

			.app-text {
				font-size: #{24rpx};
				color: #999999;
			}
		}

		.app-item {
			height: #{100rpx};
			background-color: #f6f6f6;
			width: #{614rpx};
			border-bottom-left-radius: #{8rpx};
			border-top-left-radius: #{8rpx};
			margin-bottom: #{10rpx};

			.app-icon {
				height: #{80rpx};
				width: #{80rpx};
				border-radius: 50%;
				margin-left: #{20rpx};
			}

			.app-name {
				font-size: #{28rpx};
				color: #353535;
				width: #{170rpx};
				word-break: break-all;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				margin-left: #{16rpx};
			}

			.app-go {
				width: #{140rpx};
				height: #{100rpx};
				font-size: #{24rpx};
				text-align: center;
				color: #ffffff;
				margin-left: #{16rpx};
			}

			.app-text {
				font-size: #{24rpx};
				width: #{178rpx};
				height: #{100rpx};

				text {
					word-break: break-all;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}

				.app-red {
					color: #ff5c5c;
					margin-top: #{14rpx};
				}

				.app-gray {
					color: #707070;
					margin-bottom: #{14rpx};
				}
			}
		}
	}
</style>