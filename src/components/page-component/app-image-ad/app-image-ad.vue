<template>
	<view class="app-image-ad">
		<view class="app-one-image" v-if="imageStyle === 0" :style="{height: `${height}rpx`}">
			<app-jump-button form
                 :open_type="item.link.open_type"
                 :url="item.link.value"
                 :params="item.link.params"
                 v-for="(item, index) in list"
                 :key="index"
			>
				<view class="bd-background" :style="{
					left: item.left,
					width: item.width,
					top: item.top,
					backgroundImage: 'url(' + item.pic_url + ')',
					height: item.height,
			 	}"
			></view>
			</app-jump-button>
		</view>
		<view class="app-three-hundred-and-sixty" v-if="imageStyle === 1 || imageStyle === 2 || imageStyle === 3">
			<view class="app-item" :style="{
				backgroundImage: 'url(' + item.pic_url + ')',
			    height: item.height,
		        left: item.left,
	            width: item.width,
	            top: item.top,
			}"
		      v-for="(item, index) in list" :key="index"
			>
				<app-jump-button form :open_type="item.link.open_type" :url="item.link.value"  :params="item.link.params"></app-jump-button>
			</view>
		</view>
		<view class="app-two-hundred-and-forty"  v-if="imageStyle === 5 || imageStyle === 4">
			<view class="app-item" :style="[{
				backgroundImage: 'url(' + item.pic_url + ')',
			    height: item.height,
		        left: item.left,
	            width: item.width,
	            top: item.top,
	            
			}, ]"
			      
			      v-for="(item, index) in list" :key="index"
			>
				<app-jump-button form :open_type="item.link.open_type"  :url="item.link.value" :params="item.link.params"></app-jump-button>
			</view>
		</view>
		<view class="app-one-hundred-eighty-six" v-if="imageStyle === 6">
			<view class="app-item" :style="{
				backgroundImage: 'url(' + item.pic_url + ')',
			    height: item.height,
		        left: item.left,
	            width: item.width,
	            zIndex: item.zIndex,
	            top: item.top,
			}"
			      v-for="(item, index) in list" :key="index"
			>
				<app-jump-button form :open_type="item.link.open_type"  :url="item.link.value" :params="item.link.params"></app-jump-button>
			</view>
		</view>
		<view class="app-three-hundred-seventy-two" v-if="imageStyle === 7">
			<view class="app-item" :style="{
				backgroundImage: 'url(' + item.pic_url + ')',
			    height: item.height,
		        left: item.left,
	            width: item.width,
	            top: item.top,
			}"
			      v-for="(item, index) in list" :key="index"
			>
				<app-jump-button form :open_type="item.link.open_type"  :url="item.link.value" :params="item.link.params"></app-jump-button>
			</view>
		</view>
		<view class="app-customize" v-if="imageStyle === 8" :style="{height: `${height}rpx`}">
			<view class="app-item" :style="{
				backgroundImage: 'url(' + item.pic_url + ')',
			    height: item.height,
		        left: item.left,
	            width: item.width,
	            top: item.top,
			}"
			      v-for="(item, index) in list" :key="index"
			>
				<app-jump-button form :open_type="item.link.open_type"  :url="item.link.value" :params="item.link.params"></app-jump-button>
			</view>
		</view>
	</view>
</template>

<script>
    export default {
        name: 'app-image-ad',
	    props: {
            h: {
                type: Number,
	            default: function() {
	                return 1;
	            }
            },
            height: {
	            default: function() {
	                return 'auto';
	            }
            },
            hotspot: {
                type: Array,
	            default: function() {
	                return [];
	            }
            },
            list: {
                type: Array,
	            default: function() {
	                return [];
	            }
            },
            space: {
                type: Number,
	            default: function() {
	                return 0;
	            }
            },
            imageStyle: {
                type: Number,
	            default: function() {
	                return 2;
	            }
            },
            w: {
                type: Number,
	            default: function() {
	                return 25;
	            }
            }
        }
    }
</script>

<style scoped lang="scss">
	.bd-background {
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100% 100%;
	}
	.app-image-ad {
		width: #{750rpx};;
		background-color: #ffffff;
		.app-item {
			position: absolute;
			background-repeat: no-repeat;
			background-position: center;
			background-size: 100% 100%;
		}
		.app-one-image {
			width: #{750rpx};
			position: relative;
			.ren-qu {
				width: 100%;
				height: 100%;
				background-color: red;
			}
		}
		.app-three-hundred-and-sixty {
			width: #{750rpx};;
			height: #{360rpx};
			position: relative;
		}
		.app-two-hundred-and-forty {
			width: #{750rpx};;
			height: #{240rpx};
			position: relative;
		}
		.app-one-hundred-eighty-six {
			width: #{750rpx};
			position: relative;
			height: #{187.5rpx};
		}
		.app-three-hundred-seventy-two {
			width: #{750rpx};
			height: #{372rpx};
			position: relative;
		}
		.app-customize {
			width: #{750rpx};;
			position:relative;
		}
	}
</style>