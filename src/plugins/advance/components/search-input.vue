<template>
	<view class="search-input dir-left-nowrap">
		<view class="input-view main-center dir-top-nowrap">
			<view class="input" @click="route_jump('/plugins/advance/search/search')">
				<app-form-id>
					<view class="input-in dir-left-nowrap main-center cross-center">
						<image class="icon" src="/static/image/icon/search.png"></image>
						<text class="font">搜索</text>
					</view>
				</app-form-id>
			</view>
		</view>
		<view class="jump-button">
			<app-form-id @click="route_jump('/plugins/advance/order/order')">
				<div class="jump-button dir-left-wrap main-center cross-center">
					<view class="icon main-center cross-center" :style="{'background-color': theme.background}">
						<image src="../image/pre-sale-logo.png"></image>
					</view>
					<text class="font" :style="{'color': theme.color}">我的预定</text>
				</div>
			</app-form-id>
		</view>
	</view>
</template>

<script>
    export default {
        name: "search-input",
	    methods: {
            route_jump(data) {
                if (this.$user.isLogin() && data === '/plugins/advance/order/order') {
                    uni.navigateTo({
                        url: data,
                    })
                } else if (!this.$user.isLogin() && data === '/plugins/advance/order/order') {
                    this.$user.getInfo().then(info => {
                        uni.navigateTo({
                            url: data,
                        })
                    }).catch(error => {
                    });
                } else {
                    uni.navigateTo({
                        url: data,
                    })
                }
            }
	    },

		props: {
			theme: Object,
		}
    }
</script>

<style scoped lang="scss">
	.search-input {
		height: #{88rpx};
		box-shadow: inset 0 0 1px 0 rgba(0, 0, 0, 0.15);
		background-color: #efeff4;
		position: fixed;
        top: 0;
		left: 0;
		z-index: 1500;
	}
	.jump-button {
		width: #{224rpx};
		height: #{88rpx};
		.icon {
			width: #{46rpx};
			height: #{46rpx};
			margin-right: #{8rpx};
			position: relative;
			>image {
				position: absolute;
				left: #{-1rpx};
				top: #{-1rpx};
				height: #{48rpx};
				width: #{48rpx};
			}
		}
		.font {
			font-size: #{26rpx};
			text-align: center;
		}
	}
	.input-view {
		width: #{526rpx};
		.input {
			width: #{503rpx};
			height: #{56rpx};
			margin-left: #{23rpx};
			background-color: #ffffff;
			border-radius: #{25rpx};
			.input-in {
				width: #{503rpx};
				height: #{56rpx};
				.icon {
					width: #{26rpx};
					height: #{26rpx};
					margin-right: #{12rpx};
				}
				.font {
					font-size: #{26rpx};
					color: #b2b2b2;
				}
			}
		}
	}
</style>