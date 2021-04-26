<template>
	<view class="app-participant-model">
		<view class="app-content">
			<view class="app-top dir-top-nowrap">
				<text class="app-title">正在拼团</text>
				<text class="app-description">仅显示10条正在拼团信息</text>
				<image class="app-icon" src="../../../static/image/icon/close.png" @click="close()"></image>
			</view>
			<!-- #ifdef MP-ALIPAY -->
			<scroll-view class="app-scroll" scroll-y>
				<block v-for="(item, index) in 10" :key="index">
					<template v-if="item <= pintuan_list.length">
						<view class="app-item dir-left-nowrap cross-center">
							<image class="app-avatar" :src="pintuan_list[item-1].avatar"></image>
							<view class="app-content-text dir-top-nowrap">
								<view class="app-top-name-people dir-left-nowrap">
									<text class="app-name">{{pintuan_list[item-1].nickname}}</text>
									<text class="app-people">还差{{pintuan_list[item-1].surplus_people}}人</text>
								</view>
								<view class="app-time cross-center">
									<text>剩余</text>
									<app-surplus-time :surplus_date_time="pintuan_list[item-1].surplus_date_time"></app-surplus-time>
								</view>
							</view>
							<view class="app-go" :style="{'background-color': theme.background}">
								<app-jump-button form :url="`/plugins/pt/detail/detail?id=${pintuan_list[item-1].id}`">
									去参团
								</app-jump-button>
							</view>
						</view>
					</template>
				</block>
			</scroll-view>
			<!-- #endif -->
			<!-- #ifndef MP-ALIPAY -->
			<scroll-view class="app-scroll" scroll-y>
				<block v-for="(item, index) in 10" :key="index">
					<template v-if="item < pintuan_list.length">
						<view class="app-item dir-left-nowrap cross-center">
							<image class="app-avatar" :src="pintuan_list[item].avatar"></image>
							<view class="app-content-text dir-top-nowrap">
								<view class="app-top-name-people dir-left-nowrap">
									<text class="app-name">{{pintuan_list[item].nickname}}</text>
									<text class="app-people">还差{{pintuan_list[item].surplus_people}}人</text>
								</view>
								<view class="app-time cross-center">
									<text>剩余</text>
									<app-surplus-time :surplus_date_time="pintuan_list[item].surplus_date_time"></app-surplus-time>
								</view>
							</view>
							<view class="app-go" :style="{'background-color': theme.background}">
								<app-jump-button form :url="`/plugins/pt/detail/detail?id=${pintuan_list[item].id}`">
									去参团
								</app-jump-button>
							</view>
						</view>
					</template>
				</block>
			</scroll-view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import appSurplusTime from './app-surplus_time.vue';
	
    export default {
        name: 'app-participant-model',
	    props: {
            pintuan_list: {
                type: Array,
	            default() {
                    return [];
	            }
            },
		    value: {
                type: Boolean
		    },
			theme: Object
	    },
	    data() {
            return {
                tpBool: this.value,
            }
	    },
	    methods: {
            close() {
                this.tpBool = false;
                this.$emit('input', this.tpBool);
            }
	    },
	    components: {
            'app-surplus-time': appSurplusTime,
	    }
    }
</script>

<style scoped lang="scss">
	.app-participant-model {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 16000;
		width: #{750rpx};
		height: 100%;
		background-color:rgba(127,127,127, 0.3);
		.app-content {
			width: #{650rpx};
			border-radius: #{16rpx};
			background-color: white;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			padding-bottom: #{40rpx};
			.app-top {
				border-bottom: #{1rpx} solid #e2e2e2;
				padding-bottom: #{24rpx};
				padding-top: #{32rpx};
				text-align: center;
				.app-title {
					font-size: #{32rpx};
					color: #353535;
				}
				.app-description {
					font-size: #{24rpx};
					color: #999999;
					margin-top: #{12rpx};
				}
				.app-icon {
					position: absolute;
					top: #{24rpx};
					right: #{24rpx};
					width: #{30rpx};
					height: #{30rpx};
				}
			}
			.app-scroll {
				width: #{650rpx};
				max-height: #{540rpx};
				padding: #{14rpx} #{24rpx} 0 #{24rpx};
				.app-item {
					width: #{650-48rpx};
					height: #{100rpx};
					margin-bottom: #{10rpx};
					background-color: #f6f6f6;
					border-bottom-left-radius: #{8rpx};
					border-top-left-radius: #{8rpx};
					position: relative;
					.app-avatar {
						margin-left: #{20rpx};
						width: #{80rpx};
						height: #{80rpx};
						border-radius: 50%;
					}
					.app-content-text {
						width: #{338rpx};
						height: #{100rpx};
						padding-left: #{24rpx};
						.app-top-name-people {
							margin-top: #{13rpx};
						}
						.app-time {
							font-size: #{24rpx};
							color: #666666;
							margin-top: #{12rpx};
						}
						.app-name {
							font-size: #{28rpx};
							color: #353535;
							width: #{118rpx};
							word-break: break-all;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
							overflow: hidden;
						}
						.app-people {
							margin-left: #{20rpx};
							font-size: #{24rpx};
							color: #ff4544;
						}
					}
					.app-go {
						width: #{140rpx};
						height: #{100rpx};
						line-height: #{100rpx};
						color: #ffffff;
						font-size: #{24rpx};
						text-align: center;
						position:absolute;
						right: 0;
					}
				}
			}
		}
	}
</style>