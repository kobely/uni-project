<template>
	<app-layout>
        <view class="info">
            <image class="avatar" :src="detail.user.userInfo.avatar"></image>
            <view class="dir-left-nowrap form-item" :class="change ? 'change-item' : ''">
            	<view class="label">申请人</view>
            	<view class="item-content t-omit">{{detail.user.nickname}}</view>
            </view>
            <view @click="choose(1)" class="dir-left-nowrap form-item" :class="change ? 'change-item' : ''">
            	<view @click.stop="" class="label">代理级别</view>
                <view class="item-content t-omit" v-if="detail.level == 1">省代理</view>
                <view class="item-content t-omit" v-if="detail.level == 2">市代理</view>
                <view class="item-content t-omit" v-if="detail.level == 3">区/县代理</view>
                <image v-if="change && show_dialog && dialog_title == '选择代理级别'" class="more" src="/static/image/icon/icon-up.png"></image>
                <image v-if="change && dialog_title != '选择代理级别'" class="more" src="/static/image/icon/icon-down.png"></image>
            </view>
            <view @click="choose(2)" class="dir-left-nowrap form-item" :class="change ? 'change-item' : ''">
            	<view @click.stop="" class="label">归属省</view>
	            <view class="item-content t-omit">{{choose_province.name}}</view>
                <image v-if="change && show_dialog && dialog_title == '选择省'" class="more" src="/static/image/icon/icon-up.png"></image>
                <image v-if="change && dialog_title != '选择省'" class="more" src="/static/image/icon/icon-down.png"></image>
            </view>
            <view @click="choose(3)" class="dir-left-nowrap form-item" :class="change ? 'change-item' : ''" v-if="detail.level > 1">
            	<view @click.stop="" class="label">归属市</view>
	            <view v-if="detail.level == 2" class="item-content">
	                <text v-if="choose_city.length == 0">请选择市</text>
	                <text v-else v-for="(item,index) in choose_city" :key="index">
	                    <text class="placeholder" v-if="index > 0">/</text>
	                    {{item.name}}
	                </text>
	            </view>
	            <view class="item-content t-omit" v-if="detail.level == 3">{{choose_city.name}}</view>
                <image v-if="change && (show_dialog || show_list) && dialog_title == '选择市'" class="more" src="/static/image/icon/icon-up.png"></image>
                <image v-if="change && dialog_title != '选择市'" class="more" src="/static/image/icon/icon-down.png"></image>
            </view>
            <view @click="choose(4)" class="dir-left-nowrap form-item" :class="change ? 'change-item' : ''" v-if="detail.level == 3">
            	<view @click.stop="" class="label">代理区域</view>
	            <view class="item-content">
	                <text v-if="choose_district.length == 0">请选择代理区域</text>
	                <text v-else v-for="(item,index) in choose_district" :key="index">
	                    <text class="placeholder" v-if="index > 0">/</text>
	                    {{item.name}}
	                </text>
	            </view>
                <image v-if="change && (show_dialog || show_list) && dialog_title == '选择区/县'" class="more" src="/static/image/icon/icon-up.png"></image>
                <image v-if="change && dialog_title != '选择区/县'" class="more" src="/static/image/icon/icon-down.png"></image>
            </view>
            <view v-if="!change" @click="toChange" class="to-change">修改申请信息</view>
        </view>
		<view v-if="!change" class="button dir-left-nowrap main-between">
			<view class="fail" @click="refuse">拒绝</view>
			<view class="by" @click="by">通过</view>
		</view>
		<view v-else @click="toChange" class="change-btn">确认修改</view>
		<view @touchmove.stop.prevent="" class="model" v-if="model">
			<template v-if="modelType === 1">
				<view class="refuse">
					<view class="top">{{type > 2 ? '拒绝申请' : '不通过申请'}}</view>
					<view class="content">
						<textarea v-model="reasonRefusal" class="textarea" placeholder="请填写拒绝理由"></textarea>
					</view>
					<view class="buttons dir-left-nowrap cross-center">
						<view class="but cancel"  @click="cancel">
							<app-form-id>
								取消
							</app-form-id>
						</view>
						<view class="line"></view>
						<view class="but confirm"  @click="confirm">
							<app-form-id>确认</app-form-id>
						</view>
					</view>
				</view>
			</template>
			<template v-if="modelType === 2">
				<view class="by">
					<view class="top">通过申请</view>
					<view class="content">
						是否确认通过申请
					</view>
					<view class="buttons dir-left-nowrap cross-center">
						<view class="but cancel" @click="cancel">
							<app-form-id>
								取消
							</app-form-id>
						</view>
						<view class="line"></view>
						<view class="but confirm" @click="confirm">
							<app-form-id>确认</app-form-id>
						</view>
					</view>
				</view>
			</template>
		</view>
        <view class="model" @click="close" v-if="show_dialog || show_list">
            <view :class="['select-dialog', `${iphone_x?'iphone_x':''}`]" @click.stop="">
                <view class="select-title">
                    <view>{{dialog_title}}</view>
                    <view @click.stop="changeSubmit" class="submit-btn">确定</view>
                </view>
                <picker-view v-if="show_dialog" :style="{ 'height': `${dialog_title == '选择代理级别' ? '360' : '536'}rpx`}" indicator-style="height: 44px;" :value="chooseIndex" @change="bindChange">
                    <picker-view-column>
                        <view
                            v-for="(item,idx) in choose_list" :key="item.name"
                            :class="[`picker-view`,{
                                'sure-color': newIndex == idx
                            }]">
                            {{item.name}}
                        </view>
                    </picker-view-column>
                </picker-view>
                <view class="dialog-list dir-left-wrap" v-if="show_list">
                    <view @click.stop="chooseDistrict(item,idx)" :class="[`dialog-item`,{'active': item.show}]" v-for="(item,idx) in choose_list" :key="item.name">{{item.name}}</view>
                </view>
            </view>
        </view>
	</app-layout>
</template>

<script>
    export default {
	    data() {
            return {
            	id: 0,
            	nickname: '',
                province: [],
                city: [],
                district: [],
                choose_list: {},
                level_list: [
                    {id: '1',name:'省代理'},
                    {id: '2',name:'市代理'},
                    {id: '3',name:'区/县代理'}
                ],
                choose_province: {
                    id: 0,
                    name: '请选择省'
                },
                choose_city: {
                    id: 0,
                    name: '请选择市'
                },
                choose_district: [],
            	detail: {},
                modelType: 1,
                reasonRefusal: '',
	            model: false,
	            change: false,
                show_dialog: false,
                show_list: false,
                dialog_title: '',
                newIndex: 0,
                chooseIndex: [0],
                iphone_x: false,
            }
	    },
	    onLoad(options) { this.$commonLoad.onload(options);
	    	let that = this;
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.id = options.id;
            that.nickname = options.name;
            that.getDetail();
	    },
	    methods: {
            changeSubmit() {
                if(this.dialog_title == '选择代理级别') {
                    this.detail.level = this.choose_list[this.newIndex].id;
                    if(this.newIndex != this.chooseIndex[0]) {
                        if(this.detail.level == 3) {
                            this.choose_city = {
                                id: 0,
                                name: '请选择市'
                            }
                            this.choose_district = [];
                        }else if(this.detail.level == 2) {
                            this.choose_city = []
                        }
                    }else {
                        this.chooseIndex[0] = this.newIndex;
                    }
                }else if(this.dialog_title == '选择省') {
                    this.choose_province = this.choose_list[this.newIndex];
                    this.city = this.choose_list[this.newIndex].list;
                    if(this.newIndex != this.chooseIndex[0]) {
                        if(this.detail.level == 3) {
                            this.choose_city = {
                                id: 0,
                                name: '请选择市'
                            }
                            this.choose_district = [];
                        }else if(this.detail.level == 2) {
                            this.choose_city = []
                        }
                    }else {
                        this.chooseIndex[0] = this.newIndex;
                    }
                }else if(this.dialog_title == '选择市') {
                    this.choose_city = this.choose_list[this.newIndex];
                    this.district = this.choose_list[this.newIndex].list;
                    if(this.newIndex != this.chooseIndex[0]) {
                        this.choose_district = []
                    }else {
                        this.chooseIndex[0] = this.newIndex;
                    }
                }
                if(this.show_list) {
                	if(this.dialog_title == '选择市') {
                    	this.choose_city = [];
                	}else {
                    	this.choose_district = [];
                	}
                    for(let i in this.choose_list) {
                        if(this.choose_list[i].show) {
                        	if(this.dialog_title == '选择市') {
                        		this.choose_city.push(this.choose_list[i])
                        	}else {
                            	this.choose_district.push(this.choose_list[i])
                        	}
                        }
                    }
                }
                this.show_dialog = false;
                this.show_list = false;
                this.dialog_title = ''
            },
            bindChange(e) {
                this.newIndex = e.detail.value[0]
            },
            chooseDistrict(item,index) {
                this.choose_list[index].show = !this.choose_list[index].show;
                this.$forceUpdate();
            },
            close() {
                this.show_list = false;
                this.show_dialog = false;
                this.dialog_title = '';
                this.chooseIndex = [0];
                this.newIndex = 0;
                this.choose_list = [];
            },
            choose(index) {
                this.show_list = false;
                this.show_dialog = false;
                this.chooseIndex = [0];
                this.newIndex = 0;
                if(index == 1) {
                    this.dialog_title = '选择代理级别';
                    this.choose_list = this.level_list;
                    for(let i in this.level_list) {
                        if(this.level_list[i].id == this.detail.level) {
                            this.chooseIndex[0]= i;
                            this.newIndex = i;
                        }
                    }
                    this.show_dialog = true;
                }else if(index == 2) {
                    this.dialog_title = '选择省';
                    this.choose_list = this.province;
                    for(let i in this.province) {
                        if(this.province[i].id == this.choose_province.id) {
                            this.chooseIndex[0] = i;
                            this.newIndex = i;
                        }
                    }
                    this.show_dialog = true;
                }else if(index == 3) {
                    this.dialog_title = '选择市';
                    this.choose_list = this.city;
                    if(this.detail.level == 2) {
                        for(let i in this.choose_list) {
                            this.choose_list[i].show = false;
                            for(let j in this.choose_city) {
	                            if(this.choose_list[i].id == this.choose_city[j].id) {
	                                this.choose_list[i].show = true;
	                            }
                            }
                        }
                        this.show_list = true;
                    }else {
                        for(let i in this.city) {
                            if(this.city[i].id == this.choose_city.id) {
                                this.chooseIndex[0] = i;
                                this.newIndex = i;
                            }
                        }
                        this.show_dialog = true;
                    }
                }else if(index == 4) {
                    this.dialog_title = '选择区/县';
                    this.choose_list = this.district;
                    for(let i in this.choose_list) {
                    	this.choose_list[i].district_id = this.choose_list[i].id
                        this.choose_list[i].show = false;
                        for(let j in this.choose_district)
                        if(this.choose_list[i].district_id == this.choose_district[j].id) {
                            this.choose_list[i].show = true;
                        }
                    }
                    this.show_list = true;
                }
            },
	    	toChange() {
                if(this.change) {
                    uni.showToast({
                        title: '修改成功',
                        icon: 'none',
                        duration: 1000
                    });
                }
	    		this.change = !this.change;
	    	},
	    	getDetail() {
	            this.$request({
	                url: this.$api.app_admin.review,
	                data: {
	                    type: 5,
	                    keyword: this.nickname
	                }
	            }).then(response => {
                    this.$hideLoading();
                    uni.hideLoading();
	            	if (response.code === 0) {
		            	let list = response.data.list;
                        this.province = response.data.allow_province;
		            	for(let i in list) {
		            		if(list[i].id == this.id) {
		            			this.detail = list[i];
		            		}
		            	}
		            	for(let i in this.province) {
		            		if(this.province[i].id == this.detail.province_id) {
		            			this.choose_province = this.province[i];
		            			this.city = this.province[i].list;
		            		}
		            	}
		            	if(this.detail.level == 2) {
                            this.choose_city = [];
                            for(let i in this.detail.relation) {
                                for(let j in this.city) {
                                    if(this.detail.relation[i].district_id == this.city[j].id) {
                                        this.choose_city.push(this.city[j])
                                    }
                                }
                            }
		            	}
		            	if(this.detail.level == 3) {
                            for(let i in this.city) {
                                if(this.city[i].id == this.detail.city_id) {
                                    this.choose_city = this.city[i];
                                    this.district = this.city[i].list;
                                }
                            }
                            for(let i in this.detail.relation) {
                                for(let j in this.district) {
                                    if(this.detail.relation[i].district_id == this.district[j].id) {
                                        this.choose_district.push(this.district[j])
                                    }
                                }
                            }
		            	}
	            	}
	            }).catch(() => {
                    this.$hideLoading();
                    uni.hideLoading();
                });
	    	},

            refuse() {
                this.modelType = 1;
                this.model = true;
            },
            by() {
                this.modelType = 2;
                this.model = true;
            },
            confirm() {
            	let city_id = [];
            	let district_id = [];
            	if(this.detail.level == 3) {
            		city_id.push(this.choose_city.id)
            		for(let i in this.choose_district) {
            			district_id.push(this.choose_district[i].id)
            		}
            	}
            	if(this.detail.level == 2) {
            		for(let i in this.choose_city) {
            			city_id.push(this.choose_city[i].id)
            		}
            	}
                if (this.modelType === 2) {
                    this.$request({
                        url: this.$api.app_admin.review_switch,
                        method: 'post',
                        data: {
                            type: 5,
                            province_id: this.choose_province.id,
                            level: this.detail.level,
                            city_id: JSON.stringify(city_id),
                            district_id: JSON.stringify(district_id),
                            status: 1,
                            user_id: this.detail.user.id
                        }
                    }).then(response => {
                        if (response.code === 0) {
                            uni.showToast({
                                title: '通过申请',
                                duration: 1000
                            });
                            this.model = false;
                            setTimeout(function(){
                            	uni.navigateBack();
                            })
                        }
                    })
                } else if (this.modelType === 1) {
                    this.$request({
                        url: this.$api.app_admin.review_switch,
                        method: 'post',
                        data: {
                            type: 5,
                            status: 2,
                            province_id: this.detail.province_id,
                            level: this.detail.level,
                            city_id: JSON.stringify(city_id),
                            district_id: JSON.stringify(district_id),
                            reason: this.reasonRefusal,
                            user_id: this.detail.user.id
                        }
                    }).then(response => {
                        if (response.code === 0) {
                            this.reasonRefusal = '';
                            this.model = false;
                            uni.showToast({
                                title: '拒绝申请',
                                icon: 'none',
                                duration: 1000
                            });
                            setTimeout(function(){
                            	uni.navigateBack();
                            })
                        }else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    });
                }
            },
            cancel() {
                this.model=false;
            }
	    }
    }
</script>

<style scoped lang="scss">

    .info {
        position: relative;
        z-index: 10;
        width: 702rpx;
        margin: 94rpx auto 0;
        border-radius: 16rpx;
        background-color: #fff;
        font-size: 32rpx;
        color: #353535;
        padding: 98rpx 40rpx 0;
        .avatar {
            width: 140rpx;
            height: 140rpx;
            border-radius: 70rpx;
            border: 4rpx solid #fff;
            position: absolute;
            top: -70rpx;
            left: 50%;
            margin-left: -70rpx;
        }
        .form-item {
        	margin-bottom: 26rpx;
        	&.change-item {
        		padding: 28rpx 0;
        		border-top: 2rpx solid #e2e2e2;
        		margin-bottom: 0;
        		position: relative;
        		.item-content {
        			width: 390rpx;
        		}
        	}
        	&:first-of-type {
        		border-top: 0;
        	}
        	.more {
        		position: absolute;
        		right: 0;
        		top: #{42rpx};
                width: #{22rpx};
                height: #{12rpx};
        	}
        	.label {
        		color: #999999;
        		width: 170rpx;
        		flex-shrink: 0;
        	}
	        .item-content {
	            width: 450rpx;
	            .placeholder {
	            	margin: 0 10rpx;
	            }
	        }
        }
        .to-change {
        	height: 94rpx;
        	line-height: 94rpx;
        	width: 622rpx;
        	margin: 0 auto;
        	border-top: 2rpx solid #e2e2e2;
        	text-align: center;
        	color: #446dfd;
        	font-size: 28rpx;
        }
    }

	.button {
		width: #{750-48rpx};
		height: #{80rpx};
		margin: #{80rpx} #{12rpx};
		>view {
			width: #{346rpx};
			height: #{80rpx};
			line-height: #{80rpx};
			text-align: center;
			border-radius: #{40rpx};
			font-size: #{28rpx};
		}
		.fail {
			background-color: #e2e2e2;
			color: #353535;
		}
		.by {
			background-color: #446dfd;
			color: white;
		}
	}
	.change-btn {
		width: 702rpx;
		margin: 80rpx 12rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #446dfd;
		border-radius: 40rpx;
		color: #fff;
		font-size: 28rpx;
	}
	.model {
		position: fixed;
		z-index: 1600;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(0,0,0,.3);
        .dialog-list {
            padding: 46rpx 30rpx;
            .dialog-item {
                margin: 10rpx;
                height: 62rpx;
                line-height: 60rpx;
                display: inline-block;
                padding: 0 32rpx;
                font-size: 32rpx;
                color: #353535;
                border-radius: 32rpx;
                border: 2rpx solid #bbbbbb;
                &.active {
                    color: #446dfd;
                    border: 2rpx solid #446dfd;
                }
            }
        }
        .select-dialog {
            &.iphone_x {
                padding-bottom: 50rpx;
            }
            position: fixed;
            border-top-left-radius: 16rpx;
            border-top-right-radius: 16rpx;
            width: 100%;
            bottom: 0;
            left: 0;
            background-color: #fff;
            .select-title {
                border-top-left-radius: 16rpx;
                border-top-right-radius: 16rpx;
                position: relative;
                width: 100%;
                height: 100rpx;
                line-height: 100rpx;
                border-bottom: 2rpx solid #e2e2e2;
                text-align: center;
                font-size: 32rpx;
                .submit-btn {
                    position: absolute;
                    right: 24rpx;
                    top: 0;
                    color: #446dfd;
                }
            }
            picker-view {
                width: 100%;
                .picker-view {
                    line-height: #{72rpx};
                    text-align:center;
                    font-size: #{32rpx};
                    &.sure-color {
                        font-size: #{36rpx};
                    }
                }
            }
        }
		.top {
			margin-top: #{40rpx};
			margin-bottom: #{32rpx};
			color: #353535;
			font-size: #{32rpx};
			text-align: center;
		}
		.content {
			width: calc(100% - #{64rpx});
			margin: 0 #{32rpx};
		}
		.buttons {
			width: 100%;
			border-top: #{1rpx} solid #e2e2e2;
			margin-top: #{32rpx};
			.but {
				width: calc(50% - #{1rpx});
				height: #{88rpx};
				line-height: #{88rpx};
				font-size: #{32rpx};
				text-align: center;
			}
			.line {
				width: #{2rpx};
				height: #{32rpx};
				background-color: #e2e2e2;
			}
			.cancel {
				color: #666666;
			}
			.confirm {
				color: #446dfd;
			}
		}
		.refuse {
			width: #{620rpx};
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			border-radius: #{16rpx};
			background-color: white;
			.content {
				border-radius: #{16rpx};
				border: #{1rpx} solid #e2e2e2;
				height: #{300rpx};
				box-sizing: border-box;
				padding: #{24rpx} #{32rpx};
			}
			.textarea {
				width: #{620-64-64rpx};
				height: #{300-48rpx};
				font-size: #{28rpx};
				color: #80848f;
			}
		}
		.by {
			width: #{620rpx};
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			border-radius: #{16rpx};
			background-color: white;
			.content {
				font-size: #{32rpx};
				color: #353535;
				text-align: center;
			}
		}
	}
</style>