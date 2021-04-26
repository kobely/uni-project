<template>
	<view class="app-head-navigation dir-left-nowrap">
		<view class="app-item"
		      v-for="(item, index) in list"
		      :key="index"
		      :class="{'app-active-item': activeIndex === item.id}"
		      @click="active(item.id)"
		>{{item.name}}</view>
	</view>
</template>

<script>
    export default {
        name: 'app-head-navigation',
        props: {
            list: {
                type: Array,
                default() {
                    return [
                        {
                            name: '全部',
                            id: 0,
                        },
                        {
                            name: '待支付',
                            id: 1
                        },
                        {
                            name: '待使用',
                            id: 2,
                        },
                        {
                            name: '待评价',
                            id: 4,
                        }
                        ,
                        {
                            name: '售后',
                            id: 9,
                        }
                    ];
                }
            }
        },
        data() {
            return {
                activeIndex: 0
            }
        },
        methods: {
            active(index) {
                this.activeIndex = index;
                this.$emit('click', index);
            }
        }
    }
</script>

<style scoped lang="scss">
	.app-head-navigation {
		width: #{750rpx};
		height: #{80rpx};
		background-color: white;
		white-space: nowrap;
		border-bottom: #{1rpx} solid #e2e2e2;
		
		.app-item {
			display: inline-block;
			height: #{80rpx};
			line-height: #{80rpx};
			width: #{150rpx};
			border-bottom-width: #{4rpx};
			border-bottom-style: solid;
			border-bottom-color: transparent;
			color: #666666;
			font-size: #{32rpx};
			text-align: center;
		}
		.app-active-item {
			border-bottom-color: #ff5a5a;
			color: #ff5a5a;
		}
	}
</style>