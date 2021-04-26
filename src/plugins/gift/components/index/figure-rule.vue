<template>
	<view 
		v-bind:class="['page-width', 'figure-rule', 'component-height', `${theme}-figure-rule`]"
	>
		<image 
			class="page-width component-height background-image" 
			src="/plugins/gift/image/head-texture-background.png"
		></image>
		<view class="page-width text-content component-height dir-left-nowrap">
			<view class="figure box-grow-0 dir-top-nowrap">
				<view class="box-grow-0 big-text text-color">表达心意新方式</view>
				<view class="box-grow-0 small-text text-color">
					·&nbsp;网上送礼&nbsp;&nbsp;&nbsp;·&nbsp;对方填地址&nbsp;&nbsp;&nbsp;·&nbsp;支持转赠
				</view>
			</view>
			<view class="rule box-grow-0">
				<view class="identification" @click="routeGo()">
					规则
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
    export default {
        name: 'figure-rule',

        props: [`theme`],
	    
	    methods: {
            routeGo() {
                uni.navigateTo({
	                url: `/plugins/gift/rule/rule`
                })
            }
	    }

    }
</script>

<style scoped lang="scss">
	@import '../../css/gift.scss';
	
	/* 广告图 规则 */
	.figure-rule {
		position: relative;
	}
	
	.text-content {
		position: absolute;
		top: 0;
		left: 0;
	}
	
	.rule {
		width: 12.5%;
		padding-top: #{40upx};
		.identification {
			width: 100%;
			border-top-left-radius: #{30upx};
			border-bottom-left-radius: #{30upx};
			background-color: rgba(0,0,0,.3);
			font-size: #{24upx};
			color: #ffffff;
			padding: #{12upx 24upx 12upx 20upx};
		}
	}
	
	.figure {
		width: 87.5%;
		padding-bottom: #{69upx};
		.text-color {
			color: #ffffff;
		}
		.big-text {
			font-size: #{48upx};
			padding: #{30upx 0 8upx 55upx};
		}
		.small-text {
			font-size: #{26upx};
			padding: #{8upx 0 52upx 48upx};
		}
	}
	
	.component-height {
		height: #{260upx};
	}
	
</style>