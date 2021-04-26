<template>
	<view class="app-normal">
		<view class="app-simple app-single dir-left-nowrap main-center cross-center" v-if="count == 1">
			<icon class="app-icon app-count-icon" :style="{backgroundImage: `url(${logo_1})`}" type></icon>
			<swiper class="app-swiper" vertical circular autoplay>
				<swiper-item class="dir-left-nowrap main-left cross-center" v-for="(item, index) in topic_list" :key="index">
					<app-jump-button arrangement="row" form width="100" height="100" open_type="navigate" url="../topic/list">
						<icon class="app-icon app-logo" :style="{backgroundImage: `url(${icon})`}" type></icon>
						<text class="app-text">{{item.title}}</text>
					</app-jump-button>
				</swiper-item>
			</swiper>
		</view>
		<view class="app-simple app-double dir-left-nowrap main-center cross-center" v-else-if="count == 2">
			<icon class="app-icon app-count-icon" :style="{backgroundImage: `url(${logo_2})`}" type></icon>
			<swiper class="app-swiper" vertical circular autoplay>
				<swiper-item v-for="list in newDataList" :key="item.id">
					<view class="app-list-view" v-for="(item, index) in list" :key="index">
						<app-jump-button  arrangement="row" form width="100" height="100" open_type="navigate" url="../topic/list">
							<icon class="app-icon app-logo" :style="{backgroundImage: `url(${icon})`}" type></icon>
							<text class="app-text">{{item.title}}</text>
						</app-jump-button>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
    export default {
        name: "app-special-topic",
	    props: {
            topic_list: {
                type: Array,
				default() {
                    return [];
				}
			},
            count: {
                type: Number,
				default() {
                    return 2;
				}
			},
            icon: String,
            logo_1: String,
            logo_2: String,
	    },
	    computed: {
            newDataList: function() {
                if (this.count !== 2) return;
                let newTopicList = [];
                for (let i = 0; i < Math.ceil(this.topic_list.length/this.count); i++) {
                    newTopicList.push(this.topic_list.slice(i*this.count, (i+1)*this.count));
                }
                return newTopicList;
            }
	    }
    }
</script>

<style scoped lang="scss">
	.app-simple {
		width: #{750-24*2rpx};
		margin: 0 #{24rpx};
	}
	.app-normal {
		background-color: #ffffff;
		.app-single {
			width: #{750-24*2rpx};
			height: #{72rpx};
			
			.app-swiper {
				margin-left: #{20rpx};
				width: #{577rpx};
				height: #{28rpx};
			}
			.app-count-icon {
				height: #{32rpx};
				width: #{104rpx};
			}
		}
		.app-double {
			height: #{110rpx};
			.app-count-icon {
				width: #{104rpx};
				height: #{50rpx};
			}
			.app-swiper {
				margin-left: #{20rpx};
				width: #{577rpx};
				height: #{110-22-22rpx};
			}
			.app-list-view {
				height: #{28rpx};
			}
			.app-list-view:first-child {
				margin-bottom: #{6rpx};
			}
			.app-list-view:last-child {
				margin-top: #{6rpx};
			}
		}
	}
	.app-logo {
		width: #{54rpx};
		height: #{28rpx};
		margin-right: #{10rpx};
	}
	.app-icon {
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
	.app-text {
		width: #{514rpx};
		height: #{28rpx};
		font-size: #{26rpx};
		line-height: #{28rpx};
		color: #353535;
		overflow:hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>