<template>
    <scroll-view scroll-y class="app-category-list"
                 :style="{height: `${noSetHeight}` ? `${noSetHeight}` : `${setHeight}`}">
		<view class="app-item dir-left-nowrap" v-for="(item, index) in list" :key="index" @click="active(item, index)">
			<view class="app-border" :style="{'background-color': item.active === true ? theme.background : '#f7f7f7'}"></view>
			<view class="app-text" :style="{'color': item.active === true ? theme.color : ''}">{{item.name}}</view>
		</view>
	</scroll-view>
</template>

<script>

    export default {
        name: 'app-category-list',
	    props: {
            list: {
                type: Array,
	            default() {
                    return [];
	            }
            },
            windowHeight: {
                type: Number,
	            default() {
                    return 0
	            }
            },
            windowWidth: {
                type: Number,
                default() {
                    return 0
                }
            },
            botHeight: {
                type: Number,
                default() {
                    return 0
                }
            },
            noSetHeight: {
                type: String
            },
			theme: Object
	    },
	    methods: {
            active(item, index) {
                this.$emit('click', {
                    item, index
                });
            }
	    },
	    computed: {
		    setHeight() {
                let bottom = 0;
                if (this.$parent.$parent.$children[0].tabbarbool) {
                    bottom = this.botHeight;
                }
                return (this.windowHeight * (750 / this.windowWidth)) - bottom - 88 + 'rpx';
		    }
	    }
    }
</script>

<style lang="scss">
	.app-border {
		width: #{8rpx};
		height: #{106rpx};
		background-color: #f7f7f7;
	}
	.app-category-list {
		width: #{204rpx};
		background-color: #f7f7f7;
	}
	.app-item {
		width: #{204rpx};
		height: #{106rpx};
		background-color: #f7f7f7;
	}
	.app-text {
		background-color: #f7f7f7;
		width: #{196rpx};
		height: #{106rpx};
		line-height: #{106rpx};
		text-align: center;
		font-size: #{28rpx};
		color: #666666;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}
</style>