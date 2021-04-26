<template>
	<view class="search dir-left-nowrap main-center cross-center">
		<view class="input dir-left-nowrap main-center cross-center" @click="routeGo">
			<view></view>
			<text>搜索</text>
		</view>
	</view>
</template>

<script>
	
    export default {
        name: 'search',
	    
	    methods: {
            routeGo() {
                uni.navigateTo({
	                url: `/plugins/gift/search/search`
                })
            }
	    }
    }
</script>

<style scoped lang="scss">
	.search {
		width: #{750upx};
		height: #{88upx};
		background-color: #efeff4;
		padding: #{0 24upx};
	}
	
	.input {
		width: 100%;
		height: #{58upx};
		background-color: #ffffff;
		border-radius: #{29upx};
		text {
			font-size: #{26upx};
			margin-left: #{10upx};
			color: #999999;
		}
		view {
			width: #{25upx};
			height: #{25upx};
			background-image: url("../../../../static/image/icon/search.png");
			background-repeat: no-repeat;
			background-size: 100% 100%;
			margin-right: #{10upx}
		}
	}
</style>