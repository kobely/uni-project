<template>
	<view class="demo">
		<view class="red" @touchstart="onChange" @touchmove="onCha" :style="{right: `${left}rpx`}"></view>
	</view>
</template>

<script>
    export default {
        name: "cart",
	    data() {
            return {
                oldClientX: 100,
                newClientX: 0,
	            left: 0,
            }
	    },
	    methods: {
            onChange(e) {
                this.oldClientX = e.touches[0].clientX;
            },
            onCha() {
                this.newClientX = this.newClientX +10;
                this.left = this.newClientX;
                if (this.left >= 350) return;
            }
	    }
    }
</script>

<style scoped lang="scss">
	.demo {
		width: 100%;
		height: 100rpx;
		background-color: blue;
	}
	.red {
		width: 1000rpx;
		height: 100rpx;
		background-color: red;
		position: relative;
		right: 0;
	}
</style>