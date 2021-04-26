<template>
	<view class="app-picker">
		<view class="app-mask" :class="{'show': showPicker}" v-if="showPicker" @tap="maskTap" @touchmove.stop.prevent catchtouchmove="true"></view>
		<view class="app-picker-cnt" :class="{'show':showPicker}">
			<view class="app-picker-hd" @touchmove.stop.prevent catchtouchmove="true">
				<view class="app-picker-btn" @tap="pickerCancel">取消</view>
				<view class="app-picker-btn" :style="{'color':themeColor}" @tap="pickerConfirm">确定</view>
			</view>
			<view class="app-picker-view" v-if="mode=='region'">
				<picker-view :indicator-style="itemHeight" :value="pickVal" @change="bindChange">
					<picker-view-column>
						<view class="app-picker-item"  v-for="(item,index) in selectData" :key="index">{{item.name}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="app-picker-item" v-if="provinceId === item.parent_id_id" v-for="(item,index) in selectData[provinceId].list" :key="index">{{item.name}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="app-picker-item" v-if="cityId === item.parent_id_id" v-for="(item,index) in selectData[provinceId].list[cityId].list" :key="index">{{item.name}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</view>
</template>

<script>
    export default {
        name: "app-city",
	    data() {
            return {
                showPicker: false,
                pickVal: [0,0,0],
                itemHeight:`height: ${uni.upx2px(88)}px;`,
                checkArr:[],
                provinceId: 0,
	            cityId: 0,
            }
	    },
	    props: {
            themeColor:{
                type:String,
                default(){
                    return "#f00"
                }
            },
            mode: {
                type:String,
                default(){
                    return "region"
                }
            },
            cityData: {
                type: Object,
			    default() {
                    return {}
			    }
		    }
	    },
	    methods: {
            maskTap(){
                this.showPicker = false;
            },
            bindChange(val) {
                let arr = val.detail.value;
                this.provinceId = arr[0];
                this.cityId = arr[1];
                this.$nextTick().then(() => {
                    this.pickVal = arr;
                });
            },
            pickerCancel() {
                this.showPicker = false;
            },
            pickerConfirm() {
                // 返回结果
                this.showPicker = false;
            },
		    initData(list) {
                for (let i = 0; i < list.length; i++) {
                    list[i].id_id = i;
                    for (let j = 0; j < list[i].list.length; j++) {
                        list[i].list[j].parent_id_id = i;
                        list[i].list[j].id_id = j;
                        for (let p = 0; p < list[i].list[j].list.length; p++) {
                            list[i].list[j].list[p].parent_id_id = j;
                            list[i].list[j].list[p].id_id = p;
                        }
                    }
                }
                return list;
		    }
	    },
	    computed: {
            selectData: function() {
                return this.initData(this.cityData);
            }
	    }
    }
</script>

<style scoped lang="scss">
	.app-picker {
		position: relative;
		z-index: 1888;
		height:100%;
		.app-mask {
			position: fixed;
			z-index: 1000;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.5);
			transition: all 0.3s ease;
			.app-mask.show{
				visibility: visible;
				opacity: 1;
			}
		}
		.app-picker-cnt {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			transition: all 0.3s ease;
			transform: translateY(100%);
			z-index: 1600;
		}
		.app-picker-cnt.show {
			transform: translateY(0);
		}
		.app-picker-hd {
			display: flex;
			align-items: center;
			padding: 0 #{30rpx};
			height: #{88rpx};
			background-color: #fff;
			position: relative;
			text-align: center;
			font-size: #{32rpx};
			justify-content: space-between;
			.app-picker-btn{
				font-size: #{30rpx};
			}
		}
		.app-picker-hd:after {
			content: ' ';
			position: absolute;
			left: 0;
			bottom: 0;
			right: 0;
			height: 1px;
			border-bottom: 1px solid #e5e5e5;
			color: #e5e5e5;
			transform-origin: 0 100%;
			transform: scaleY(0.5);
		}
		.app-picker-view {
			width: 100%;
			height: #{476rpx};
			overflow: hidden;
			background-color: rgba(255, 255, 255, 1);
			z-index: 666;
		}
		.app-picker-item {
			text-align: center;
			width: 100%;
			height: #{88rpx};
			line-height: #{88rpx};
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: #{30rpx};
		}
		picker-view{
			height: 100%;
		}
	}
</style>