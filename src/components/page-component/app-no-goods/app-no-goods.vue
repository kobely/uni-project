<template>
	<view class="app-no-goods dir-top-nowrap main-center cross-center" :style="{'backgroundColor': background}">
		<image class="icon" v-if="is_image === 0" src="/static/image/no-goods.png"></image>
		<image class="icon" v-else-if="is_image === 1" src="/static/image/order-empty.png"></image>
		<text class="text" :style="{'color': color}">{{title}}</text>
	</view>
</template>

<script>
    export default {
        name: "app-no-goods",
	    
	    props: {
            background: {
                type: String,
                default() {
                    return '#ffffff';
                }
            },
            color: {
                type: String,
                default() {
                    return '#666666';
                }
            },
		   	title: {
			   type: String,
			   default() {
				   return '没有任何商品哦~';
			   }
		   },
			is_image: {
				type: Number,
				default() {
					return  0;
				}
			},
	    },
    }
</script>

<style scoped lang="scss">
	.app-no-goods {
		width: 100%;
		height: #{400upx};
		.icon {
			width: #{240upx};
			height: #{240upx};
		}
		.text {
			font-size: #{24upx};
			line-height: 1;
			margin-top: #{25upx};
		}
	}
</style>