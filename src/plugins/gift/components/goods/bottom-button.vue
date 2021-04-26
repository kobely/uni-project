<template>
	<view class="bd-bottom dir-left-nowrap cross-center">
		<view
			v-if="!attr_bool"
			@click="routeGo()"
			class="bd-back box-grow-0 dir-top-nowrap main-center cross-center"
		>
			<image class="bd-icon" src="/static/image/icon/index.png"></image>
			<text class="bd-text">首页</text>
		</view>
        <bd-service :name="name" :url="url"></bd-service>
		<view class="box-grow-1 bd-btn bd-oversell-btn bd-btn-color" v-if="goods_stock == 0">已售罄</view>
		<button v-else :disabled="attr_bool && join_disabled" :style="{'background': theme.background_gradient_btn}" class="bd-btn box-grow-1 bd-btn-color" @click="joinGift">加入礼包</button>
	</view>
</template>

<script>
import bdService from '@/components/page-component/goods/bd-service.vue';

export default {
        name: 'bottom-button',
	    
	    props: [`theme`, `attr_bool`, `goods_stock`, `join_disabled`, `name`, `url`],
	    
	    methods: {
            joinGift() {
                this.$emit('attrSwitch', true);
            },

		    // 返回首页
            routeGo() {
                uni.reLaunch({
	                url: `/pages/index/index`
                })
            }
	    },
        components: {
            bdService
        }
    }
</script>

<style scoped lang="scss">
	@import "../../css/gift.scss";

    .bd-bottom {
        width: 750upx;
        height: 110upx;
        padding: 20upx 24upx;
    }
    .bd-back {
        width: 66upx;
        height: 100%;
        margin-right: 20upx;
    }
    .bd-icon {
        width: 30upx;
        height: 30upx;
        margin-bottom: 8upx;
    }
    .bd-text {
        font-size: 20upx;
        color: #888888;
        line-height: 1;
    }
    .bd-btn {
        text-align: center;
        line-height: 70upx;
        height: 70upx;
        font-size: 28upx;
        border-radius: 35upx;
    }
    .bd-btn-color {
        color: #ffffff;
    }
    .bd-oversell-btn {
        background-color: #CDCDCD;
    }
</style>