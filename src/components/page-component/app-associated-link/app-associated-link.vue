<template>
	<view class="app-associated-link dir-left-nowrap main-left cross-center" :style="{backgroundColor: background}">
		<app-jump-button style="width: 100%" form :open_type="link.open_type" :url="link.value" :params="link.params">
			<view class="dir-left-nowrap" :class="[`${className}`,`${arrowsSwitch ? 'padding': ''}`]" :style="{backgroundColor: background}">
				<view v-if="styleNum == '1'" class="app-link-title box-grow-1" :style="{textAlign: position}">
					<image class="app-title-icon" v-if="picSwitch" :src="picUrl">
					</image>
					<text :style="{color: color}">{{title}}</text>
				</view>
				<view v-else-if="styleNum == '2'" class="app-link-title box-grow-1 main-center cross-center">
                    <image :style="{backgroundColor: styleColor}" class="app-title-line" :src="styleImg.line"></image>
                    <view :style="{color: color}">{{title}}</view>
                    <image :style="{backgroundColor: styleColor}" class="app-title-line" :src="styleImg.line"></image>
                </view>
                <view v-else-if="styleNum == '3'" class="app-link-title box-grow-1 main-center cross-center">
                    <view class="app-title-line star">
                    	<view :style="{backgroundColor: styleColor}" class="top-icon"></view>
                    	<view :style="{backgroundColor: styleColor}" class="bottom-icon"></view>
                    </view>
                    <view :style="{color: color}">{{title}}</view>
                    <view class="app-title-line star">
                    	<view :style="{backgroundColor: styleColor}" class="top-icon"></view>
                    	<view :style="{backgroundColor: styleColor}" class="bottom-icon"></view>
                    </view>
                </view>
                <view v-else-if="styleNum == '4'" class="app-link-title box-grow-1 dir-left-nowrap cross-center">
                    <image :style="{backgroundColor: styleColor}" class="app-title-line div" :src="styleImg.div"></image>
                    <view :style="{color: color}">{{title}}</view>
                </view>
                <view v-else-if="styleNum == '5'" class="app-link-title box-grow-1 dir-left-nowrap cross-center">
                    <view :style="[{'border-color':`${styleColor}`,'background-color':`${background}`}]" class="app-title-line radius"></view>
                    <view :style="{color: color}">{{title}}</view>
                </view>
                <view v-if="arrowsSwitch" class="app-more-text">更多</view>
				<icon class="app-icon" v-if="arrowsSwitch" type></icon>
			</view>
		</app-jump-button>
	</view>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "app-associated-link",
        data() {
            return {
                className: ''
            }
        },
        computed: {
            ...mapState({
                styleImg: state => state.mallConfig.__wxapp_img.diy
            })
        },
	    props: {
            arrowsSwitch: {
                type: Boolean,
	            default: function() {
	                return false;
	            }
            },
            background: {
                type: String,
	            default: function() {
	                return '#E11B1B';
	            }
            },
            color: {
                type: String,
	            default: function() {
	                return '#F4EBEB';
	            }
            },
            link: {
                type: Object,
	            default: function() {
	                return {
                        open_type: "tel",
                        params: [
	                        {
                                value: "111",
	                        }
                        ],
	                }
	            }
            },
            styleColor: {
                type: String,
	            default: function() {
	                return '#353535';
	            }
            },
            picSwitch: {
                type:Boolean,
	            default: function() {
	                return false;
	            }
            },
            picUrl: {
                type: String,
	            default: function() {
	                return '';
	            }
            },
		    position: {
                type: String,
	            default: function() {
	                return 'left';
	            }
		    },
		    title: {
                type: String,
			    default: function() {
			        return '';
			    }
		    },
		    styleNum: {
                type: String,
			    default: function() {
			        return '1';
			    }
		    },
		    fontSize: {
                type: String,
			    default: function() {
			        return '36';
			    }
		    }
	    },
        created() {
            let that = this;
            if(this.fontSize == '36') {
            	this.className = 'big-style'
            }else if(this.fontSize == '28') {
            	this.className = 'medium-style'
            }else {
            	this.className = 'small-style'
            }
        },
    }
</script>

<style scoped lang="scss">
	.app-associated-link {
		width: #{750rpx};
		height: #{72rpx};
		position: relative;
    	.padding {
      		padding-right: #{48rpx};
    	}
		.app-more-text {
			font-size: #{24rpx};
			color: #999;
			white-space: nowrap;
		}
		.app-icon {
			background-image: url("../../../static/image/icon/arrow-right.png");
			width: #{12rpx};
			height: #{22rpx};
			background-repeat: no-repeat;
			background-size: cover;
			position: absolute;
			right: #{24rpx};
			top: 50%;
			transform: translateY(-50%);
		}
		.app-link-title {
        	flex-grow: 1;
        	width: 100%;
        	padding: 0 #{24rpx};
        	.app-title-line {
		        width: #{82rpx};
		        height: #{5rpx};
		        margin: 0 #{20rpx};
		    }
		    .app-title-line.star {
		        width: #{28rpx};
		        height: #{20rpx};
		        .top-icon {
		        	width: #{28rpx};
		        	height: #{4rpx};
		        	margin-bottom: #{12rpx};
		        }
		        .bottom-icon {
		        	width: #{28rpx};
		        	height: #{4rpx};
		        }
		    }
		    .app-title-line.div {
		        width: #{8rpx};
		        height: #{28rpx};
		        margin: 0 #{10rpx} 0 0;
		    }
		    .app-title-line.radius {
		        width: #{28rpx};
		        margin: 0 #{10rpx} 0 0;
		        border-radius: #{14rpx};
		        border: #{2rpx} solid #353535;
		        height: #{28rpx};
		    }
		}
    	.big-style {
	        height: #{50rpx};
	        line-height: #{50rpx};
	        font-size: #{36rpx};
	        width: 100%;
	        .app-title-icon {
		        width: #{50rpx};
		        height: #{50rpx};
		        margin-right: #{16rpx};
		        vertical-align: top;
		    }
    	}
    	.medium-style {
	        height: #{36rpx};
	        line-height: #{36rpx};
	        font-size: #{28rpx};
	        width: 100%;
	        .app-title-icon {
		        width: #{36rpx};
		        height: #{36rpx};
		        margin-right: #{16rpx};
		        vertical-align: top;
		    }
    	}
    	.small-style {
	        height: #{28rpx};
	        line-height: #{28rpx};
	        font-size: #{24rpx};
	        width: 100%;
	        .app-title-icon {
		        width: #{28rpx};
		        height: #{28rpx};
		        margin-right: #{16rpx};
		        vertical-align: top;
		    }
    	}
	}
</style>
