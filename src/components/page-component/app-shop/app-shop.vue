<template>
	<view class="app-shop">
		<view class="app-item dir-left-nowrap main-between cross-center" v-for="(item, index) in newList" :key="index">
			<view class="app-left dir-left-nowrap main-left cross-top">
				<app-jump-button form backgroundColor="white" arrangement="left" open_type="navigate" :url="`/pages/store/detail?id=${item.id}`">
					<image class="app-image" :style="{backgroundImage: `url(${item.pic_url})`}"></image>
					<view class="app-content dir-top-nowrap main-right" :class="{'main-center': !showName || !showScore || !showTel}">
						<text class="app-text t-omit" v-if="showName">{{item.name}}</text>
						<view class="app-score dir-left-nowrap main-left" v-if="showScore">
							<text>评分: </text>
							<view class="app-love">
                                <image
                                    class="navPicUrl app-icon image-no-rep image-cover"
                                    v-for="(score, index) of item.score"
                                    :key="index"
                                    :src="scorePicUrl ? scorePicUrl : '/static/image/icon/store-score.png'"
                                ></image>
							</view>
						</view>
						<text class="app-phone" v-if="showTel">电话: {{item.mobile}}</text>
						<text class="app-distance" v-if="item.distance">距离: {{item.distance}}</text>
					</view>
				</app-jump-button>
			</view>
			<view class="app-jump">
				<app-jump-button open_type="map" arrangement="column" form backgroundColor="white" :latitude="item.latitude" :longitude="item.longitude">
					<image :src="navPicUrl ? navPicUrl : '/static/image/icon/navigation.png'" class="scorePicUrl app-icon image-no-rep image-cover"></image>
					<text class="app-text">一键导航</text>
				</app-jump-button>
			</view>
		</view>
	</view>
</template>
<script>
	
    export default {
        name: 'app-shop',
	    props: {
            list: {
                type: Array,
	            default: function() {
	                return [
	                ]
	            }
            },
            navPicUrl: {
                type: String,
	            default: function() {
	                return "";
	            }
            },
            scorePicUrl: {
                type: String,
	            default: function() {
	                return "";
	            }
            },
            showName: {
                type: Boolean,
	            default: function() {
	                return true;
	            }
            },
            showScore: {
                type: Boolean,
	            default: function() {
	                return true;
	            }
            },
            showTel: {
                type: Boolean,
	            default: function() {
	                return true;
	            }
            },
            scrollTop: {
                type: Number,
	            default: function() {
	                return 0;
	            }
            },
            value: {
                type: Boolean,
	            default: function() {
	                return true;
	            }
            }
	    },
	    data() {
          return {
              height: 0,
	          request: true
          }
	    },
        created() {
            let that = this;
            uni.getSystemInfo({
                success: function (response) {
                    that.height = response.windowHeight;
                }
            })
        },
	    methods: {
          autoEnd() {
              this.$lazyLoadingData('app-shop').then(response => {
                  if (response[0].height + response[0].top < this.height) {
                      this.request = false;
                      this.$emit('input', this.request);
                  }
              });
          },
      },
	    watch: {
            scrollTop: {
                handler: function(n,o) {
                    if (n > o  &&  this.request) this.autoEnd();
                }
            }
	    },
        computed: {
            carCount() {
                return function (item) {
                    return new Array(item.score);
                }
            },
            newList() {
                this.list.forEach(item => {
                    if (!(item.score instanceof Array)) {
                        item.score = new Array(item.score);
                    }
                });
                return this.list;
            }
        }
    }
</script>

<style scoped lang="scss">
	.app-item {
		height: #{219rpx};
		width: #{750rpx};
		border-bottom: #{1rpx} solid #e2e2e2;
		background-color: white;
		overflow: hidden;
		.app-left {
			margin-left: #{24rpx};
			height: #{219rpx};
			width: #{600rpx};
			.app-image {
				height: #{150rpx};
				width: #{150rpx};
				border-radius: 50%;
                background-size: 100% auto;
				margin-top: #{35rpx};
			}
		}
		.app-jump {
			//height: #{219rpx};
			//width: #{131rpx};
      margin-left: auto;
			padding-right: #{20rpx};
			.app-icon {
				width: #{50rpx};
				height: #{50rpx};
			}
			.app-text {
				font-size: #{22rpx};
				color: #999999;
				margin-top: #{16rpx};
			}
		}
		.app-content {
			margin-left: #{20rpx};
			margin-top: #{20rpx};
			width: #{449upx};
			.app-text {
				font-size: #{28rpx};
				color: #353535;
				font-weight: bold;
				margin-bottom: #{18rpx};
			}
			.app-phone {
				font-size: #{26rpx};
				color: #999999;
				margin-bottom: #{15rpx};
			}
			.app-distance {
				font-size: #{26rpx};
				color: #999999;
				margin-bottom: #{15rpx};
			}
			.app-score {
				height: #{26rpx};
				margin-bottom: #{15rpx};
				line-height: #{26rpx};
				>text {
					font-size: #{26rpx};
					color: #999999;
				}
				.app-love {
					margin-left: #{4rpx};
					.app-icon {
						width: #{20rpx};
						height: #{18rpx};
						margin-right: #{4rpx};
					}
				}
			}
		}
	}
</style>