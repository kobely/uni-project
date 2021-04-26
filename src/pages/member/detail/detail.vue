<template>
    <app-layout>
    	<view class="page">
	        <image class="bg" ref="bg" :src="memberImg.bg"></image>
	        <view class="member-list">
	            <swiper class="member-bannner" :current="index" @change="change" previous-margin="20px" next-margin="20px">
	                <swiper-item class="member-item" v-for="item in list" :key="item.id">
	                    <image class="member-img" :src="item.bg_pic_url ? item.bg_pic_url : item.pic_url"></image>
	                </swiper-item>
	            </swiper>
	            <view class="member-name main-center cross-center">{{detail.name}}</view>
	            <view class="triangle"></view>
	        </view>
	        <view class="rights">
	            <view class="main-center title">
	                <image src="./../image/left.png"></image>
	                <view class="title-name">权益介绍</view>
	                <image src="./../image/right-right.png"></image>
	            </view>
	            <view class="rights-list">
	                <view :class="[`rights-item`,_num == item.id ? `active` : ``]" v-for="(item,index) in detail.rights" :key="item.id">
		                <view @click="tab(item.id,index)">
		                        <image class="rights-img" :src="item.pic_url"></image>
		                        <view class="t-omit" style="display:block;">{{item.title}}</view>
		                </view>
			            <view class="explain" v-if="_num == item.id" :style="{'left': `${explainLeft}`}">
		                	<view class="explain-triangle" :style="{'left': `${triangleLeft}%`}"></view>
			                <image class="explain-img" src="./../image/right.png"></image>
			                <view class="explain-text">
			                    <view class="explain-title">特权说明</view>
			                    <app-rich-text class="text" :content="item.content"></app-rich-text>
			                </view>
			            </view>
	                </view>
	        	</view>
	        </view>
	    </view>
    </app-layout>
</template>

<script>
    import appRichText from "../../../components/basic-component/app-rich/parse.vue";

    import { mapState } from "vuex";

    export default {
        data() {
            return {
		        _num: 0,
		        explainLeft: '0rpx',
		        move: false,
		        prop: 0,
		        name: '',
		        money: '',
		        triangleLeft: 8,
		        member: true,
		        show: true,
		        index: 0,
		        list: [],
		        detail: [],
            }
        },
        name: "detail",
        components: {
            "app-rich-text": appRichText,
        },
        computed: {
            ...mapState({
                memberImg: state => state.mallConfig.__wxapp_img.member,
            })
        },
        methods: {
		    toMove() {
		        this.move = true
		    },

		    tab(num,index) {
		    	let that = this;
		    	if((index+1) % 3 == 1) {
		    		that.triangleLeft = 8
		    		that.explainLeft = '0rpx'
		    	}else if((index+1) % 3 == 2) {
		    		that.explainLeft = '-248rpx'
		    		that.triangleLeft = 50
		    	}else {
		    		that.explainLeft = '-496rpx'
		    		that.triangleLeft = 86
		    	}
		        if(that._num == num) {
		            that.show = false;
		        	that._num = 0;
		            return false
		        }else {
			        let index;
			        that._num = num;
			        for (let i = 0; i < that.detail.rights.length; i++) {
			            if (num == that.detail.rights[i].id) {
			                index = i;
			            }
			        }
			        that.show = true;
			        that.move = false;
			        that.$forceUpdate();
		        }
		    },

		    change(e) {
		        let that = this;
		        let index = e.detail.current;
		        this.detail = this.list[index];
		        this.show = false;
		    },

            getList() {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.member.all,
                    method: 'get',
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
						that.list = response.data.list;
		                that.index = 0;
		                if (that.level > 0) {
		                    for (let i = 0; i < that.list.length; i++) {
		                        if (that.level == that.list[i].level) {
		                            that.index = i
		                        }
		                    }
		                }
		                that.detail = that.list[that.index];
		                that._num = that.list[that.index].rights[0].id;
		                that.content = that.list[that.index].rights[0].content;
		                if (that.list[that.index].rights.length == 2) {
		                    that.x = 33
		                } else if (that.list[that.index].rights.length == 1) {
		                    that.x = 50;
		                }
		                that.toView = 'to' + (that.detail.id); 
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
        },
        onLoad(options) { this.$commonLoad.onload(options);
        	let that = this;
	        if (options.level > 0) {
	            that.level = options.level;
	        } else {
	            that.level = 0;
	        }
	        if (options.prop > 0) {
	            that.prop = options.prop * 3;
	        } else {
	            that.prop = 0;
	        }
	        that.getList();
        }
    }
</script>

<style scoped lang="scss">
	.page {
		position: absolute;
	    left: 0;
	    top: 0;
	    background-color: #fff;
	    width: 100%;
	    height: 100%;
		.bg {
		    height: #{464rpx};
		    width: 100%;
		}
		.member-list {
		    height: #{464rpx};
		    width: 100%;
		    position: absolute;
		    left: 0;
		    top: #{36rpx};
		    z-index: 0;
		    display: block;
			.member-bannner {
			    height: #{320rpx};
				.member-item {
				    display: flex;
				    justify-content: center;
					.member-img {
					    width: #{620rpx};
					    height: #{320rpx}; 
					    border-radius: #{16rpx};
					}
				}
			}
			.member-name {
			    font-size: #{32rpx};
			    color: #fff;
			    position: absolute;
			    width: 100%;
			    text-align: center;
			    z-index: 10;
			    height: #{100rpx};
			}
			.triangle {
			    position: absolute;
			    bottom: #{36rpx};
			    left: 0;
			    right: 0;
			    margin: 0 auto;
			    width: 0;
			    height: 0;
			    border-left: #{18rpx} solid transparent;
			    border-right: #{18rpx} solid transparent;
			    border-bottom: #{24rpx} solid #fff;
			}
		}
		.rights {
		    position: relative;
		    background-color: #fff;
		    border-top-left-radius: #{16rpx};
		    border-top-right-radius: #{16rpx};
		    padding-bottom: #{50rpx};
			.title {
			    font-size: #{36rpx};
			    color: #666666;
			    margin-top: #{55rpx};
			    height: #{50rpx};
			    line-height: #{50rpx};
				.title-name {
				    margin: 0 #{30rpx};
				}
				image {
				    display: block;
				    margin-top: #{15rpx};
				    height: #{20rpx};
				    width: #{110rpx};
				}
			}
			.rights-list {
			    margin-top: #{58rpx};
			    text-align: left;
			    position: relative;
				.rights-item {
				    width: #{150rpx};
				    margin: 0 #{50rpx};
				    font-size: #{26rpx};
				    color: #353535;
				    vertical-align: top;
				    text-align: center;
				    display: inline-block;
					.rights-img {
						margin-top: #{30rpx};
					    margin-bottom: #{12rpx};
					    height: #{80rpx};
					    width: #{80rpx};
					}
				}
				.rights-item.active {
				    font-size: #{32rpx};
				    font-weight: bold;
					.rights-img {
						margin-top: 0;
					    width: #{120rpx};
					    height: #{120rpx};
					}
				}
				.explain {
				    width: #{640rpx};
				    border-radius: #{16rpx};
				    padding: #{56rpx} #{50rpx} #{50rpx} #{126rpx};
				    margin: #{50rpx} auto #{20rpx};
				    font-size: #{28rpx};
				    color: #666;
				    position: relative;
				    background-color: #f7f7f7;
					.explain-img {
					    height: #{46rpx};
					    width: #{46rpx};
					    position: absolute;
					    top: #{56rpx};
					    left: #{40rpx};
					}
					.explain-title {
					    font-size: #{32rpx};
					    color: #353535;
					    text-align: left;
					    margin-bottom: 24px;
					}
					.explain-triangle {
					    border-bottom: #{24rpx} solid #f7f7f7;
					    margin-left: 0;
					    top: #{-22rpx};
			   		 	position: absolute;
					    width: 0;
					    height: 0;
					    border-left: #{18rpx} solid transparent;
					    border-right: #{18rpx} solid transparent;
					}
				}
			}
		}
	}
</style>