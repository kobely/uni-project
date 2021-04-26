<template>
	<scroll-view scroll-x class="app-scroll" :scroll-into-view="`${scrollId}`" scroll-with-animation>
		<view class="app-content">
			<view class="app-item" v-for="(item, index) in timeList"  :id="`ms_${index}`" :key="index" :class="[activeIndex === index ? 'app-active-item' : '', item.type === 2 ? 'app-top' : '']" :style="{'background-color': activeIndex === index ? theme.background : ''}">
				<app-form-id @click="active(item, index)">
					<view class="app-ad dir-top-nowrap main-center cross-center" v-if="item.type !== 2">
						<view class="app-time" :class="{'active-color': activeIndex === index}">{{item.new_open_time}}</view>
						<view class="app-label" :class="{'active-color': activeIndex === index}">{{item.label}}</view>
						<view class="app-icon" :style="{'border-color': activeIndex === index ? theme.border : ''}"></view>
					</view>
					<view class="app-ad" v-else>
						<text :class="{'active-color': activeIndex === index}">{{item.label}}</text>
						<view :style="{'border-color': activeIndex === index ? theme.border : ''}" class="app-icon"></view>
					</view>
				</app-form-id>
			</view>
		</view>
	</scroll-view>
</template>

<script>
    export default {
        name: "app-scroll",
	    props: {
            timeList: Array,
			theme: {
            	type: Object,
			}
	    },
        data() {
            return {
                scrollId: '',
	            activeIndex: 0,
            }
        },
	    methods: {
            active(item, index) {
                this.activeIndex = index;
                let i = index - 2;
                this.scrollId = `ms_${i}`;
                this.$emit('click', index, item);
            }
	    },
	    watch: {
            timeList: {
                handler: function(value) {
                    value.map((item, index) => {
                        if (item.status === 1) {
                            this.scrollId = `ms_${index-2}`;
                            this.activeIndex = index;
                        }
                    });
                },
	            immediate: true,
            }
	    }
    }
</script>

<style lang="scss">
	.app-item {
		display: inline-block;
		width: #{150rpx};
		height: #{96rpx};
		background-color: #30353c;
		position: relative;
		.app-ad {
			width: #{150rpx};
			height: #{96rpx};
		}
		.app-d {
			font-size: #{32rpx};
		}
		view {
			color: #bbbbbb;
			text-align: center;
		}
		.app-time {
			width: #{150rpx};
			font-size: #{32rpx};
		}
		.app-label {
			width: #{150rpx};
			font-size: #{22rpx};
		}
	}
	.app-active-item {
		color: white !important;
		.app-icon {
			border: #{20rpx} solid ;

			position: absolute;
			bottom: #{-36rpx};
			left: 50%;
			transform: translateX(-50%);
		}
		.active-color {
			color: white !important;
		}
	}
	.app-scroll {
		white-space: nowrap;
		width: #{750rpx};
		height: #{120rpx};
		.app-content {
			width: #{750rpx};
			height: #{96rpx};
			/*white-space: nowrap;*/
			display: flex;
			z-index: 1601;
			background-color: #30353c;
			-webkit-flex-direction: row;
			flex-direction: row;
			.app-top {
				line-height: #{96rpx};
			}


		}
	}
</style>