<template>
    <view class="safe-area-inset-bottom u-bottom-fixed">
        <view  class="page-width gift-navigation dir-left-nowrap cross-center">
            <view @click="routeGo(`/plugins/gift/index/index`)" class="nav main-center cross-center">
                <view :class="['icon', 'gift-icon','background-image', `${tab_route === `plugins/gift/index/index` ? theme+'-background' : `default-background`}`]"></view>
                <text :class="[`text`, `${tab_route === `plugins/gift/index/index` ? theme + '-color' : `default-text`}`]">送礼</text>
            </view>
            <view class="line"></view>
            <view @click="routeGo(`/plugins/gift/order/order`)" class="nav main-center cross-center">
                <view :class="['icon', 'my-icon','background-image',`${tab_route === `plugins/gift/order/order`  ? theme+'-background' : `default-background`}`]"></view>
                <text :class="[`text`, `${tab_route === `plugins/gift/order/order` ? theme + '-color' : `default-text`}`]">我的</text>
            </view>
        </view>
        <view :style="{width: `100%`, height: `${botHeight}rpx`}" v-if="navBool"></view>
    </view>
</template>

<script>
    export default {
        name: 'gift-navigation',
		props: [`theme`, `botHeight`, `navBool`],
		data() {
            return {
                tab_route: '',
                load_success: false,
            }
		},
		created() {
			let page = getCurrentPages();
			this.tab_route = page[page.length - 1].route;
		},
	    methods: {
            routeGo(data) {
                uni.redirectTo({
	                url: data
                })
            }
	    }
    }
</script>

<style scoped lang="scss">
	@import "../../css/gift.scss";
    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1500;
        background-color: #ffffff;
    }
	/*导航*/
	.gift-navigation {
		height: #{96upx};
		border-top: #{1upx} solid #e2e2e2;
		background-color: #ffffff;
		.nav {
			width: 49.8%;
			height: 100%;
			.icon {
				width: #{34upx};
				height: #{34upx};
				margin-right: #{8upx};
			}
			.my-icon {
				background-image: url("../../image/my.png");
			}
			.gift-icon {
				background-image: url("../../image/gift-giving.png");
			}
			.text {
				font-size: #{32upx};
				margin-left: #{8upx};
			}

			.default-text {
				color: #999999;
			}
			.default-background {
				background-color: #999999;
			}
			
		}
		.line {
			width: .4%;
			height: #{48upx};
			background-color: #e2e2e2;
		}
	}

</style>