<template>
	<view class="name">
		<view class="page-width text">
			{{name}}
		</view>
	</view>
</template>

<script>
    export default {
        name: 'name',
	    props: {
            name: String
	    }
    }
</script>

<style scoped lang="scss">
	.page-width {
		width: 100%;
	}
	
	.name {
		background-color: #ffffff;
		overflow: hidden;
        width: 702upx;
        margin: 24upx 24upx 0 24upx;
        border-radius: 15upx 15upx 0 0;
	}
	
	.text {
		font-size: 32upx;
		color: rgb(0,0,0);
		line-height: 40upx;
		padding: 30upx 24upx 0 24upx;
		margin-bottom: 24upx;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		white-space: normal;
	}
</style>