<template>
	<view>
      <view class="app-special-topic-list" :style="{backgroundColor:catBgColor}" v-if="catShow">
          <scroll-view class="auto-tab" scroll-x>
              <view class="dir-left-nowrap ">
                  <text v-for="(item,index) in list"
                        :key="index"
                        :style="{borderBottomColor: tabCurrentIndex === index ? tagColor: 'transparent',
                        color: tabCurrentIndex === index ? catSelectedColor: catUnselectedColor}"
                        class="app-nav-item"
                        @click="tabClick(index)"
                  >
                      {{ item.name }}
                  </text>
				</view>
			</scroll-view>
		</view>
		<view class="app-content">
			<template v-if="catShow">
				<view class="app-content-item"
				      v-for="(item, index) in list"
				      :key="index"
				      v-if="tabCurrentIndex === index"
				>
					<block v-for="(child, sub) in item.children" v-bind:key="sub" >
						<template v-if="child.layout === 0">
							<app-jump-button form :url="`../topic/topic?id=${child.id}`" open_type="navigate">
							<view class="app-small-frame main-between ">
								<view class="app-content-text dir-top-nowrap main-between">
									<text class="app-text t-omit-two">{{child.title}}</text>
									<text class="app-text-read t-omit-two">{{child.abstract}}</text>
									<text class="app-text-read">{{child.read_count}}</text>
								</view>
								<image lazy-load class="app-image" mode="scaleToFill" :src="child.cover_pic"></image>
							</view>
							</app-jump-button>
						</template>
						<template v-if="child.layout === 1">
							<app-jump-button form :url="`../topic/topic?id=${child.id}`" open_type="navigate">
								<view class="app-big-frame dir-top-nowrap">
									<text class="app-text t-omit-two">{{child.title}}</text>
									<text class="app-text-read t-omit-two">{{child.abstract}}</text>
									<image lazy-load  class="app-image" mode="scaleToFill" :src="child.cover_pic"></image>
									<text class="app-text-read">{{child.read_count}}</text>
								</view>
							</app-jump-button>
						</template>
						<template v-if="child.layout === 2">
							<app-jump-button form :url="`../topic/topic?id=${child.id}`" open_type="navigate">
								<view class="app-more-frame dir-top-nowrap">
									<text class="app-text t-omit-two">{{child.title}}</text>
									<text class="app-text-read t-omit-two">{{child.abstract}}</text>
									<view class="dir-left-nowrap">
										<block v-for="(item, index) in child.pic_list" :key="index">
											<image lazy-load  class="app-image box-grow-1" mode="scaleToFill" :src="item.url"></image>
										</block>
									</view>
									<text class="app-text-read">{{child.read_count}}</text>
								</view>
							</app-jump-button>
						</template>
					</block>
				</view>
			</template>
			<template v-else>
				<block v-for="(child, sub) in topicList" v-bind:key="sub" >
					<template v-if="child.layout == 0">
						<app-jump-button form :url="`../topic/topic?id=${child.id}`" open_type="navigate">
							<view class="app-small-frame main-between ">
								<view class="app-content-text dir-top-nowrap main-between">
									<text class="app-text t-omit-two">{{child.title}}</text>
									<text class="app-text-read t-omit-two">{{child.abstract}}</text>
									<text class="app-text-read">{{child.read_count}}</text>
								</view>
								<image lazy-load class="app-image" mode="scaleToFill" :src="child.cover_pic"></image>
							</view>
						</app-jump-button>
					</template>
					<template v-if="child.layout == 1">
						<app-jump-button form :url="`../topic/topic?id=${child.id}`" open_type="navigate">
							<view class="app-big-frame dir-top-nowrap">
								<text class="app-text t-omit-two">{{child.title}}</text>
								<text class="app-text-read t-omit-two">{{child.abstract}}</text>
								<image lazy-load  class="app-image" mode="scaleToFill" :src="child.cover_pic"></image>
								<text class="app-text-read">{{child.read_count}}</text>
							</view>
						</app-jump-button>
					</template>
					<template v-if="child.layout == 2">
						<app-jump-button form :url="`../topic/topic?id=${child.id}`" open_type="navigate">
							<view class="app-more-frame dir-top-nowrap">
								<text class="app-text t-omit-two">{{child.title}}</text>
								<text class="app-text-read t-omit-two">{{child.abstract}}</text>
								<view class="dir-left-nowrap">
									<block v-for="(item, index) in child.pic_list" :key="index">
										<image lazy-load  class="app-image box-grow-1" mode="scaleToFill" :src="item.url"></image>
									</block>
								</view>
								<text class="app-text-read">{{child.read_count}}</text>
							</view>
						</app-jump-button>
					</template>
				</block>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
	    props: {
            catShow: {
                type: Boolean,
	            default: function() {
	                return true;
	            }
            },
	        list: {
	            type: Array,
		        default: function() {
		            return [];
            }
          },
          topicList: {
              type: Array,
              default: function () {
                  return []
              }
          },
          //标签颜色
          tagColor: {
              type: String
          },
          //选中颜色
          catSelectedColor: {
              type: String
          },
          //未选中颜色
          catUnselectedColor: {
              type: String
          },
          //背景色
          catBgColor: {
              type: String
          },
      },
	    data() {
	        return {
                tabCurrentIndex: 0,
                touchStartX: 0,
                touchStartY: 0,
                time: 0,
                interval: '',
                touchMoveX: 0,
                touchMoveY: 0,
            }
	    },
		methods: {
            tabClick(index) {
                this.tabCurrentIndex = index;
            },
            touchStart(e) {
                this.touchStartX = e.touches[0].pageX;
                this.touchStartY = e.touches[0].pageY; // 获取触摸时的原点
                // 使用js计时器记录时间
                this.interval = setInterval(() => {
                    this.time++;
                }, 100);
            },
            touchmove(e) {
                this.touchMoveX = e.touches[0].pageX;
                this.touchMoveY = e.touches[0].pageY;
            },
            touchend() {
                let moveX = this.touchMoveX - this.touchStartX;
                let moveY = this.touchMoveY - this.touchStartY;
                if (Math.sign(moveX) === -1) {
                    moveX = moveX * -1;
                }
                if (Math.sign(moveY) === -1) {
                    moveY = moveY * -1;
                }
                if(moveX >= moveY) {// 左右
                    // 向左滑动
                    if (this.touchMoveX - this.touchStartX <= -20 && this.time < 10) {
                        if (this.tabCurrentIndex === 0 ) {
                            this.tabCurrentIndex = this.list.length -1;
                        } else {
                            this.tabCurrentIndex -= 1;
                        }
                    }
                    // 向右滑动
                    if (this.touchMoveX - this.touchStartX >= 20 && this.time < 10) {
                        if (this.tabCurrentIndex === this.list.length -1) {
                            this.tabCurrentIndex = 0;
                        } else {
                            this.tabCurrentIndex += 1;
                        }
                    }
                }
                clearInterval(this.interval); // 清除setInterval
                this.time = 0;
            }
		}
	}
</script>

<style scoped lang="scss">
	.app-special-topic-list {
		height: 100%;
		width: #{750rpx};
		overflow: hidden;
		background-color: white;
		border-bottom: #{1rpx} solid #e2e2e2;
	}
	.auto-tab {
		height: #{88rpx};
		width: #{750rpx};
		margin-left: #{2rpx};
		>view {
			position: absolute;
		}
	}
	.auto-list-scroll-content{
		height: 100%;
	}
	.app-nav-item {
		display: inline-block;
		height: #{88rpx};
		line-height: #{88rpx};
		font-size: #{32rpx};
		color: #353535;
		margin-left: #{30rpx};
		margin-right: #{30rpx};
		border-bottom: #{4rpx} solid;
		white-space: nowrap;
	}
	.app-current {
		border-bottom-color:  transparent;
	}
	.app-content {
		width: #{750rpx};
		margin-top: #{-16rpx};
		.app-content-item {
			width: #{750rpx};
			border-top: #{0.1rpx} solid transparent;
		}
		.app-text-read {
			font-size: #{24rpx};
			color: #919191;
		}
		.app-small-frame {
			background-color: #ffffff;
			width: #{750rpx};
			overflow: hidden;
			margin-top: #{16rpx};
			padding: #{20rpx} #{24rpx};
			.app-image {
				width: #{268rpx};
				height: #{202rpx};
			}
			.app-content-text {
				width: #{394rpx};
				height: #{190rpx};
				.app-text {
					font-size: #{32rpx};
					color: #353535;
					width: #{394rpx};
				}
			}
		}
		.app-big-frame {
			margin-top: #{16rpx};
			padding: #{32rpx} #{24rpx} #{24rpx} #{24rpx};
			background-color: #ffffff;
			.app-text {
				font-size: #{32rpx};
				width: #{750-24-24rpx};
				color: #353535;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
			.app-image {
				width: #{750-24-24rpx};
				height: #{350rpx};
				margin: #{24rpx} 0;
				
			}
		}
		.app-more-frame {
			margin-top: #{16rpx};
			padding: #{32rpx} #{24rpx} #{24rpx} #{24rpx};
			background-color: #ffffff;
			.app-text {
				font-size: #{32rpx};
				width: #{750-24-24rpx};
				color: #353535;
			}
			.app-image {
				margin-top: #{16rpx};
				width: #{226rpx};
				height: #{170rpx};
				margin-right: #{12rpx};
				margin-bottom: #{16rpx};
				display: block;
			}
		}
	}
	
	
</style>