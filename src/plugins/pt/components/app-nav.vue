<template>
	<view class="app-nav dir-left-nowrap cross-center main-around">
		<view class="box-grow-1" v-for="(item, index) in list" :key="index" @click="active(item.id)">
			<text :style="{'color': activeIndex === item.id ? theme.color : '#353535'}" :class="activeIndex === item.id ? 'active': 'no-active'" >{{item.name}}</text>
		</view>
	</view>
</template>

<script>
    export default {
        name: 'app-nav',
		props: {
			theme: Object
		},
	    data() {
            return {
                list: [
	                {
	                    name: '全部',
		                id: 0,
	                },
                    {
                        name: '待付款',
                        id: 1,
                    },
                    {
                        name: '拼团中',
                        id: 2,
                    },
                    {
                        name: '拼团成功',
                        id: 3,
                    },
                    {
                        name: '拼团失败',
                        id: 4,
                    },
                ],
	            activeIndex: 0
            }
	    },
	    methods: {
            active(id) {
                this.activeIndex = id;
                this.$emit('click', id);
            }
	    }
    }
</script>

<style scoped lang="scss">
	.app-nav {
		width: #{750rpx};
		height: #{80rpx};
		font-size: #{26rpx};
		color: #666666;
		position: fixed;
        top: 0;
		left: 0;
		z-index: 1000;
		background-color: white;
		>view {
			text-align: center;
		}
		text {
			display: inline-block;
			height: #{80rpx};
			line-height: #{76rpx};
		}
	}
	.active {
		border-bottom: #{4rpx} solid;
	}
	.no-active {
		border-bottom: #{4rpx} solid #FFFFFF;
	}
</style>