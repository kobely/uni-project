<template>
	<view class="bd-nav">
        <view class="bd-mask" @touchmove.stop.prevent v-if="isSwitch"></view>
        <view class="bd-head dir-left-nowrap">
            <scroll-view scroll-x scroll-with-animation :scroll-left="scrollLeft" :scroll-into-view="`scroll-${activeIndex}`" class="app-head-navigation dir-left-nowrap cross-center">
                <text class="head-text" :id="`scroll-${index}`" :class="item.active ? 'app-active':''" :style="{'background-color': item.active ? theme.background : '#ffffff'}"
                      v-for="(item, index) in list"
                      :key="index"
                      @click="active(item)">
                    {{item.name}}
                </text>
            </scroll-view>
            <view class="bd-btn" @click="isSwitch = true">
                <image class="bd-bt-img" src="/static/image/icon/icon-down.png"></image>
            </view>
        </view>
        <view class="bd-content" v-if="isSwitch" @touchmove.stop.prevent>
            <view class="bd-head dir-left-nowrap">
                <view class="app-head-navigation">
                    切换分类
                </view>
                <view class="bd-btn" @click="isSwitch = false">
                    <image class="bd-bt-img" src="/static/image/icon/icon-up.png"></image>
                </view>
            </view>
            <view class="bd-back dir-left-wrap" >
                <view class="bd-item"  @click="active(item)" :style="{'color': item.active ? theme.color : '#353535', 'border-color':  item.active ? theme.border : '#e5e5e5'}" :key="index" v-for="(item, index) in list">{{item.name}}</view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'app-head-navigation',
	    props: {
            list: {
                type: Array,
	            default: function() {
	                return [];
	            }
            },
			theme: Object,
	    },
	    methods: {
            active(item) {
                this.isSwitch = false;
                console.log(item);
                this.$emit('click', item);
            }
	    },
        data() {
            return {
                activeIndex: 0,
                isSwitch: false,
                scrollLeft: 0
            }
        },
        watch: {
            list: {
                handler(newVal) {
                    for (let i = 0; i < newVal.length; i++) {
                        if (newVal[i].active && i > 1) {
                            this.activeIndex = i - 2;
                        } else if (newVal[i].active && i <= 1) {
                            this.activeIndex = 0;
                        }
                    }
                },
                immediate: true,
                deep: true
            }
        }
    }
</script>

<style scoped lang="scss">
    .bd-head {
        width: #{750rpx};
        height: #{100rpx};
        background-color: #ffffff;
        border-top: #{1rpx} solid #e2e2e2;
        border-bottom: #{1rpx} solid #e2e2e2;
        .app-active {
            color: #ffffff;
        }
    }
    .bd-btn {
        width:70upx;
        height: #{100rpx};
    }
	.app-head-navigation {
        width: 680upx;
		height: #{100rpx};
		line-height: #{100rpx};
		padding: 0 0 0 24upx;
        font-size: #{28rpx};
		white-space:nowrap;
        color: #666666;
		.head-text {
			display: inline-block;
			height: #{56rpx};
			padding: 0 #{20rpx};
			line-height: #{56rpx};
			border-radius: #{28rpx};
			margin-right: #{32rpx};
			white-space:nowrap;
		}
	}
    .bd-bt-img {
        width: 22upx;
        height:12upx;
        margin: 44upx 24upx;
    }
    .bd-back {
        background: #f5f5f5;
        padding: 48upx 0upx 24upx 20upx;
    }
    .bd-item {
        padding: 15upx 30upx;
        margin-bottom: 24upx;
        margin-right:19upx;
        background-color: #ffffff;
        border-radius: 35upx;
        border-width: 2upx;
        border-style: solid;
        font-size: 26upx;
    }
    .bd-nav {
        position: relative;
    }
    .bd-content {
        position: absolute;
        top:0;
        z-index: 100;
    }
    .bd-mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
    }
</style>