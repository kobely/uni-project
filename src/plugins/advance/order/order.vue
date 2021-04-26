<template>
  <app-layout>
	  <view class="order">
		  <view  class="top dir-left-nowrap main-between cross-center">
			  <view class="top-input cross-center" @click="go_search()" v-if="!search">
				  <view class="input main-center cross-center">
					 <image src="/static/image/icon/icon-search.png"></image>
					  <text>搜索</text>
				  </view>
			  </view>
			  <view class="to-top dir-left-nowrap main-center cross-center" v-if="!search" @click="active = true">
				  <text :style="{'color': getTheme.color}">{{active_item}}</text>
				  <image v-if="!active" :style="{'background-color': getTheme.background}" class="icon" src="../image/open.png"></image>
				  <image v-else class="icon icon-active" :style="{'background-color': getTheme.background}" src="../image/open.png"></image>
			  </view>
			  <view class="search dir-left-nowrap cross-center main-between" v-if="search">
				  <input type="text" class="input" :focus="true" v-model="search_text" @blur="blur_request" @confirm="set_search">
				  <image class="delete" v-show="search_text.length>0" @click="empyt_search" src="../image/delete.png"></image>
				  <text style="color:#666666;font-size: 32rpx;" @click="set_search">搜索</text>
			  </view>
		  </view>
		  <view class="do-top" v-if="active" @click.stop="active = false">
			  <view class="do-top-item"
			        v-for="(item, index) in select_list"
			        :key="index"
			        :style="{'color': item.active ? getTheme.color : '#353535'}"
			        @click="set_active(item)"
			  >
				  {{item.text}}
			  </view>
		  </view>
		  <view style="margin-top: 108rpx;"></view>
		  <view class="item"  v-for="(item, index) in order_list" :key="index">
			  <view class="item-top dir-left-wrap main-between cross-center" >
				  <text class="order-number" style="color: #999999;">订单号{{item.advance_no}}</text>
                  <text>{{item.status_num | orderStatus}}</text>
			  </view>
			  <view class="item-center dir-left-nowrap" @click="route_go(item)">
				  <image class="image" :src="item.goods.goodsWarehouse.cover_pic"></image>
				  <view class="content">
					  <view class="name">{{item.goods.goodsWarehouse.name}}</view>
					  <view class="attr">
						  <text>{{item.attr_name}}</text>
					  </view>
					  <view class="num-price dir-left-nowrap main-between cross-center">
						  <text>×{{item.goods_num}}</text>
						  <text>￥{{item.goodsAttr.price}}</text>
					  </view>
					  <view class="des-price dir-left-wrap main-right cross-center">
						  <text>定金</text>
						  <text :style="{color: item.is_pay == 0 ? '#ff4544' : '#353535'}">￥{{item.deposit}}</text>
						  <text>抵￥{{item.swell_deposit}}</text>
						  <text style="color: #ff4544;" v-if="item.status_num == 9">（定金不退）</text>
					  </view>
				  </view>
			  </view>
			  <view class="item-bottom">
				  <view class="swell-price main-right cross-center" v-if="item.status_num == 2 || item.status_num == 3 || item.status_num == 4 || item.status_num == 9 ">
					  <text>尾款</text>
					  <text style="color: #ff4544;">￥{{item.tail_money}}</text>
				  </view>
                  <view v-if="item.status_num == 1" class="text-time">
                      <text>距截止</text>
                      <text style="color: #ff4544">{{item.html}}</text>
                  </view>
                  <view v-if="item.status_num == 3  && item.pay_limit != -1" class="text-time">
                      <text>距截止</text>
                      <text style="color: #ff4544">{{item.html}}</text>
                  </view>
				  <view class="filal-payment-time" v-if="item.status_num == 2">
					  支付尾款时间：{{set_time(item.pay_limit, item.end_prepayment_at)}}
				  </view>
				  <view class="button" :style="{'background-color': getTheme.background}" @click="payFinalPayment(item)" v-if="item.status_num == 3 && item.order_id == 0">
					  <app-form-id>
						  <text>
							  去支付尾款
						  </text>
					  </app-form-id>
				  </view>
				  <view class="button" :style="{'background-color': getTheme.background}" @click="payPayment(item, index)" v-else-if="item.status_num == 3 && item.order_id != 0 && item.pay_type != 2">
					  <app-form-id>
						  <text>
							  付款
						  </text>
					  </app-form-id>
				  </view>
				  <view class="button" :style="{'background-color': getTheme.background}" @click="payDeposit(item, index)" v-else-if="item.status_num == 1">
					  <app-form-id>
						  <text>
							  去支付定金
						  </text>
					  </app-form-id>
				  </view>
			  </view>
		  </view>
		  <view class="order-empty" v-if="order_list.length === 0">
			 <image src="../image/order.png"></image>
			  <text>没有任何订单哦~</text>
		  </view>
	  </view>
  </app-layout>
</template>

<script>
	import {mapGetters} from "vuex";

	export default {
		name: 'order',
		data() {
			return {
			  active: false,
			  active_item: '全部预定',
			  select_list: [
				{
				  id: -1,
				  active: true,
				  text: '全部预定',
				},
				 {
				   id: 1,
				  active: false,
				  text: '定金待支付',
				},
				 {
				   id: 2,
				  active: false,
				  text: '尾款支付未开始',
				},
				 {
				   id: 3,
				  active: false,
				  text: '尾款待支付',
				},
				 {
				   id: 4,
				  active: false,
				  text: '购买成功',
				},
				 {
				   id: 5,
				  active: false,
				  text: '购买失败',
				}
			  ],
				order_list: [],
				page: 1,
				keyword: -1,
				over: false,
				interval: null,
				search: false,
				search_text: '',
				oldOrder: [],
				template_message: []
			}
		},
		onShow() {
			this.order_list = [];
			this.page = 1;
			this.request(1).then(() => {
				this.get_time();
			});
		},
		onHide() {
			clearInterval(this.interval);
		},
		onUnload() {
			clearInterval(this.interval);
		},
		methods: {
			empyt_search() {
				this.search = false;
				this.search_text = '';
				this.set_active({id: -1});
				this.active_item = '全部预定';
			},
			set_active(data) {
				clearInterval(this.interval);
				this.order_list = [];
				this.keyword = data.id;
				this.over = false;
				this.page = 1;
				this.request().then(() => {
					if (data.id === 1 || data.id === -1 || data.id === 3) this.get_time();
				});
				for (let i = 0; i < this.select_list.length; i++) {
					if (this.select_list[i].id === data.id) {
						this.select_list[i].active = true;
					} else {
						this.select_list[i].active = false;
					}
				  }
				this.active = false;
				this.active_item = data.text;
			},
			route_go(data) {
				if (data.status_num == 4) {
					uni.navigateTo({
						url: `/pages/order/order-detail/order-detail?id=${data.order_id}&sign=advance`
					})
				}
			},
			// 支付尾款
			payFinalPayment(item) {
				let data = [
					{
						"mch_id": item.goods.mch_id,
						"goods_list": [
							{
								"id":item.goods_id,
								"attr": JSON.parse(item.goods_info).attr_list,
								"num":item.goods_num,
								"cat_id":0,
								"goods_attr_id":item.goodsAttr.id,
								"advance_id": item.id,
							}
						]
					}
				];
				this.$jump({
					open_type: 'navigate',
					url: `/pages/order-submit/order-submit?mch_list=${JSON.stringify(data)}&preview_url=${encodeURIComponent(this.$api.advance.order_preview)}&submit_url=${encodeURIComponent(this.$api.advance.order_sub)}&order_page_url=/plugins/advance/order/order&plugin=advance&total_title=尾款`
				});
			},
			payPayment(item, index) {
				this.$request({
					url: this.$api.order.list_pay_data,
					data: {
						id: item.order_id,
					},
					method: 'get'
				}).then(res => {
					if (res.code === 0) {
						this.$payment.pay(res.data.id).then(() => {
							// 支付成功
							if (this.keyword === -1) {
								this.order_list[index].status_num = '4';
							} else {
								this.$delete(this.order_list, index);
							}
						}).catch(() => {
							// 支付失败
						});
					}
				})
			},
			// 去支付定金
			payDeposit(data, index) {
				this.$subscribe(this.template_message).then(() => {
					this.submit(data, index);
				}).catch(() => {
					this.submit(data, index);
				});
			},
			submit(data, index) {
				let body = {
					id: data.id,
					goods_id: data.goods_id,
					goods_num: data.goods_num,
					goods_attr_id:data.goodsAttr.id,
				};
				this.get_submit(body).then(response => {
					this.$payment.pay(response.data.id).then((res) => {
						this.$request({
							url: this.$api.advance.order,
							method: 'get',
							data: {
								id: data.id,
							}
						}).then(response => {
							if (response.code === 0) {
								this.$set(this.order_list, index, response.data.list[0]);
								let attr_name = '';
								let attr_groups = JSON.parse(this.order_list[index].goods_info);
								for (let j = 0; j < attr_groups.attr_list.length; j++) {
									attr_name+= ` ${attr_groups.attr_list[j].attr_group_name}:${attr_groups.attr_list[j].attr_name}`
								}
								this.$set(this.order_list[index], 'attr_name', attr_name);
							} else if (response.code === 1) {
								uni.showModal({
									title: '提示',
									content: res.msg,
									success(res) {
										if (res.cancel) {
											uni.navigateBack();
										} else if (res.confirm) {
											uni.navigateBack();
										}
									}
								})
							}
						});
					}).catch(() => {
					});
				});
			},
			addDate(date, days) {
				if(days == undefined || days == '') {
					days = 1;
				}
				let newDate = new Date(date.replace(/-/g, '/'));
				newDate.setDate(newDate.getDate() + days);
				let month = newDate.getMonth() + 1;
				let day = newDate.getDate();
				let mm = "'" + month + "'";
				let dd = "'" + day + "'";
				if(mm.length == 3) {
					month = "0" + month;
				}
				if(dd.length == 3) {
					day = "0" + day;
				}
			   let hour = newDate.getHours();//得到小时
			   let minu = newDate.getMinutes();//得到分钟
			   let sec = newDate.getSeconds();//得到秒
			   if (sec === 0) {
				 sec = 59;
				 if (minu === 0) {
				   minu = 59;
				   if (hour === 0) {
					   hour = 23;
					   day = '0' + Number(day) -1;
				   } else {
					   hour = hour -1;
				   }
				 } else {
				   minu = minu - 1;
				 }
			   } else {
				  sec = sec -1;
			   }
			   sec = `${sec}`;
			   minu = `${minu}`;
			   hour = `${hour}`;
			   if (hour.length === 1) {
				   hour = `0${hour}`
			   }
			   if (minu.length === 1) {
				   minu = `0${minu}`
			   }
			   if (sec.length === 1) {
				   sec = `0${sec}`
			   }
			   return newDate.getFullYear() + "." + month + "." + day + ' ' + hour +':' + minu + ':' + sec;
			},
			getDate(end_prepayment_at) {
				let newDate = new Date(end_prepayment_at.replace(/-/g, '/'));
				newDate.setDate(newDate.getDate());
				let month = newDate.getMonth() + 1;
				let day = newDate.getDate();
				let mm = "'" + month + "'";
				let dd = "'" + day + "'";
				if(mm.length == 3) {
					month = "0" + month;
				}
				if(dd.length == 3) {
					day = "0" + day;
				}
				let hour = newDate.getHours();//得到小时
				let minu = newDate.getMinutes();//得到分钟
				let sec = newDate.getSeconds();//得到秒
				sec = `${sec}`;
				minu = `${minu}`;
				hour = `${hour}`;
				if (hour.length === 1) {
					hour = `0${hour}`
				}
				if (minu.length === 1) {
					minu = `0${minu}`
				}
				if (sec.length === 1) {
					sec = `0${sec}`
				}
				return newDate.getFullYear() + "." + month + "." + day + ' ' + hour +':' + minu + ':' + sec;
			},
			async request(data) {
				uni.showLoading({
					title: '加载中'
				});
				try {
					const response = await this.$request({
						url: this.$api.advance.order,
						method: 'get',
						data: {
							keyword: this.keyword,
							page: this.page,
							name: this.search_text,
						}
					});
					uni.hideLoading();
					if (response.code === 0) {
						if (data === 1) {
							this.order_list = response.data.list;
						} else {
							this.order_list.push(...response.data.list);
						}
						this.template_message = response.data.template_message;
						for (let i = 0; i < this.order_list.length; i++) {
							let attr_name = '';
							let attr_groups = JSON.parse(this.order_list[i].goods_info);
							for (let j = 0; j < attr_groups.attr_list.length; j++) {
								attr_name+= ` ${attr_groups.attr_list[j].attr_group_name}:${attr_groups.attr_list[j].attr_name}`
							}
							this.$set(this.order_list[i], 'attr_name', attr_name);
						}
					}
				} catch (e) {
					uni.hideLoading();
					uni.navigateTo({
						url: `/plugins/advance/index/index`
					});
				}
			},
			set_time(pay_limit, end_prepayment_at) {
				if (pay_limit == -1) {
					return `${this.getDate(end_prepayment_at)} ~ 无期限`
				} else {
					return `${this.getDate(end_prepayment_at)} ~ ${this.addDate(end_prepayment_at, Number(pay_limit))}`
				}
			},
			async get_submit(body) {
				const response = await this.$request({
					url: this.$api.advance.order_submit,
					method: 'post',
					data: {
						...body,
					}
				});
				if (response.code === 0) {
					return response;
				} else if (response.code === 1) {
					uni.showModal({
						title: '提示',
						content: response.msg,
						success(res) {
							if (res.cancel) {
								uni.navigateBack();
							} else if (res.confirm) {
								uni.navigateBack();
							}
						}
					})
				}
			},
			get_time() {
				clearInterval(this.interval);
				let now = new Date().getTime();
				for (let i = 0; i < this.order_list.length; i++) {
					if (this.order_list[i].status_num == 1) {
						let timelog = new Date(this.order_list[i].end_prepayment_at.replace(/-/g, '/')).getTime();
						let time = timelog - now;
						if (time > 0) {
							let day = parseInt((time/1000/60/60/24)%30);
							let hou = parseInt((time/1000/60/60)%24);
							let min = parseInt((time/1000/60)%60);
							let sec = parseInt((time/1000)%60);
							if (day > 0) {
								this.$set(this.order_list[i], 'html', day+"天"+hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec));
							} else {
								this.$set(this.order_list[i], 'html', hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec));
							}
						}
					} else if (this.order_list[i].status_num == 3) {
						if (this.order_list[i].pay_limit == -1) {
							this.$set(this.order_list[i], 'html', '不显示');
						} else {
							let newDate = new Date(this.order_list[i].end_prepayment_at.replace(/-/g, '/'));
							let timelog = newDate.setDate(newDate.getDate() + Number(this.order_list[i].pay_limit));
							let time =  new Date(timelog).getTime() - now;
							if (time > 0) {
								let day = parseInt((time/1000/60/60/24)%30);
								let hou = parseInt((time/1000/60/60)%24);
								let min = parseInt((time/1000/60)%60);
								let sec = parseInt((time/1000)%60);
								if (day > 0) {
									this.$set(this.order_list[i], 'html', day+"天"+hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec));
								} else {
									this.$set(this.order_list[i], 'html', hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec));
								}
							}
						}
					}
				}
				this.interval = setInterval(() => {
					let now = new Date().getTime();
					if (this.order_list.length === 0) clearInterval(this.interval);
					for (let i = 0; i < this.order_list.length; i++) {
						if (this.order_list[i].status_num == 1) {
							let timelog = new Date(this.order_list[i].end_prepayment_at.replace(/-/g, '/')).getTime();
							let time = timelog - now;
							if (time > 0) {
								let day = parseInt((time/1000/60/60/24)%30);
								let hou = parseInt((time/1000/60/60)%24);
								let min = parseInt((time/1000/60)%60);
								let sec = parseInt((time/1000)%60);
								if (day > 0) {
									this.$set(this.order_list[i], 'html', day+"天"+hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec));
								} else {
									this.$set(this.order_list[i], 'html', hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec));
								}
							}
						}  else if (this.order_list[i].status_num == 3) {
							if (this.order_list[i].pay_limit == -1) {
								this.$set(this.order_list[i], 'html', '不显示');
							} else {
								let newDate = new Date(this.order_list[i].end_prepayment_at.replace(/-/g, '/'));
								let timelog = newDate.setDate(newDate.getDate() + Number(this.order_list[i].pay_limit));
								let time =  new Date(timelog).getTime() - now;
								if (time > 0) {
									let day = parseInt((time/1000/60/60/24)%30);
									let hou = parseInt((time/1000/60/60)%24);
									let min = parseInt((time/1000/60)%60);
									let sec = parseInt((time/1000)%60);
									if (day > 0) {
										this.$set(this.order_list[i], 'html', day+"天"+hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec));
									} else {
										this.$set(this.order_list[i], 'html', hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec));
									}
								}
							}
						}
					}
				}, 1000);
			},
			async set_search() {
				this.page = 1;
				this.keyword = -1;
				uni.showLoading({
					title: '加载中'
				});
				const response = await this.$request({
					url: this.$api.advance.order,
					method: 'get',
					data: {
						keyword: this.keyword,
						page: this.page,
						name: this.search_text,
					}
				});
				if (response.code === 0) {
					this.order_list = response.data.list;
					for (let i = 0; i < this.order_list.length; i++) {
						let attr_name = '';
						let attr_groups = JSON.parse(this.order_list[i].goods_info);
						for (let j = 0; j < attr_groups.attr_list.length; j++) {
							attr_name+= ` ${attr_groups.attr_list[j].attr_group_name}:${attr_groups.attr_list[j].attr_name}`
						}
						this.$set(this.order_list[i], 'attr_name', attr_name);
					}
				}
				uni.hideLoading();
				this.get_time();
			},
			blur_request() {
				// this.order_list = this.oldOrder;
			},
			go_search() {
				this.search = true;
				this.active = false;
				this.oldOrder = this.order_list;
				this.order_list = [];
			}
		  },
		onReachBottom() {
			if (!this.over) {
				this.page+=1;
				this.$request({
					url: this.$api.advance.order,
					method: 'get',
					data: {
						keyword: this.keyword,
						page: this.page,
						name: this.search_text,
					}
				}).then(res => {
					if (res.code === 0) {
						if (res.data.list.length > 0) {
							this.order_list = [...this.order_list, ...res.data.list];
							for (let i = 0; i < this.order_list.length; i++) {
								let attr_name = '';
								let attr_groups = JSON.parse(this.order_list[i].goods_info);
								for (let j = 0; j < attr_groups.attr_list.length; j++) {
									attr_name+= ` ${attr_groups.attr_list[j].attr_group_name}:${attr_groups.attr_list[j].attr_name}`
								}
								this.$set(this.order_list[i], 'attr_name', attr_name);
							}
							this.get_time();
						} else {
							this.over = true;
						}
					}
				})
			}
		},
		computed: {
			...mapGetters('mallConfig',{
				getTheme: 'getTheme'
			})
		},
        filters: {
		    orderStatus:function(status) {
                if (status == 1) {
                    return '定金待支付';
                } else if (status == 2) {
                    return '尾款支付未开始';
                } else if (status == 3) {
                    return '尾款待支付';
                } else if (status == 4) {
                    return '购买成功';
                } else if (status == 5) {
                    return '订单已取消';
                } else if (status == 6) {
                    return '订单已售后';
                } else if (status == 7) {
                    return '购买失败 定金支付超时';
                } else if (status == 8) {
                    return '购买失败 定金已退款';
                } else if (status == 9) {
                    return '购买失败 尾款支付超时';
                }
            }
        }
	}
</script>

<style lang="scss" scoped>
  .order {
    position: absolute;
    width: #{750rpx};
    top: 0;
    left: 0;
    height: 100%;
	  z-index: 1500;
    background-color: #f7f7f7;
    .top {
        position: fixed;
        top: 0;
        left: 0;
        background-color: #efeff4;
        font-size: #{32rpx};
	    z-index: 1500;
	    width: #{750upx};
      .to-top {
        width: #{280rpx};
        height: #{88rpx};
        .icon {
            width: #{22rpx};
            height: #{12rpx};
	        margin-left: #{16rpx};
        }
	      text {
		      width: #{145rpx};
		      text-align: center;
		      word-break: break-all;
		      text-overflow: ellipsis;
		      display: -webkit-box;
		      -webkit-box-orient: vertical;
		      -webkit-line-clamp: 1;
		      overflow: hidden;
		      font-size: #{26rpx};
	      }
	      .icon-active {
		      transform:rotate(180deg);
	      }
      }
	    .top-input {
		    height: #{88rpx};
		    width: #{750-280rpx};
		    .input {
			   width: #{570upx};
			    height: #{56upx};
			    background-color: white;
			    border-radius: #{30upx};
			    margin-left: #{28upx};
			    >image {
				    width: #{26upx};
				    height: #{26upx};
				    margin-right: #{13upx};
			    }
			    >text {
				    font-size: #{26rpx};
				    color: #b2b2b2;
			    }
		    }
	    }
    }
    .do-top {
         position: fixed;
	      top: #{88rpx};
	      width: 100%;
	      height: 100%;
	    z-index: 1500;
        background-color: rgba(0,0,0,.3);
      .do-top-item {
        width: 100%;
        height: #{88rpx};
        background-color: #ffffff;
        font-size: #{32rpx};

        border-top: #{1rpx} solid #e2e2e2;
        text-align: center;
        line-height: #{88rpx};
      }

    }
    .item {
      width: #{750rpx};
      margin-bottom: #{20rpx};
      background-color: #ffffff;
      .item-top {
        width: 100%;
        line-height: #{80rpx};
        background-color: #ffffff;
        border-bottom: #{1rpx} solid #e2e2e2;
        font-size: #{26rpx};
        color: #ff4544;
        padding: 0 #{24rpx};
      }
      .item-center {
        width: 100%;
        padding: #{24rpx 24rpx 0 24rpx};
        .image {
          width: #{220rpx};
          height: #{220rpx};
          border-radius: #{16rpx};
        }
        .content {
          width: #{530-48rpx};
          min-height: #{220rpx};
          padding-left: #{24rpx};
          .name {
              margin-top: #{12rpx};
              word-break: break-all;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              font-size: #{28rpx};
              color:#353535;
          }
          .attr {
            margin-top: #{16rpx};
            >text {
              font-size: #{26rpx};
              color:#999999;
              margin-right: #{16rpx};
            }
          }
          .num-price {
            font-size: #{28rpx};
            color: #353535;
            margin-top: #{24rpx};
          }
          .des-price {
            font-size: #{28rpx};
            color: #353535;
            margin-top: #{24rpx};
          }
        }
      }
      .item-bottom {
        width: #{750rpx};
        background-color: #ffffff;
        padding: #{0 24rpx 32rpx 24rpx};
        overflow: hidden;
        .swell-price {
          font-size: #{28rpx};
          color: #353535;
          margin-top: #{24rpx};
        }
        .button {
          // display: inline-block;
          float: right;
          height: #{56rpx};
          line-height: #{56rpx};
          font-size: #{28rpx};
          color: #ffffff;
          padding: 0 #{24rpx};
          border-radius: #{28rpx};
          margin-top: #{32rpx};
        }
      }
    }
  }
	.order-empty {
		position: absolute;
		top: #{555rpx};
		left: 50%;
		transform: translate(-50%, -50%);
		width: #{240rpx};
		text-align: center;
		>image {
			height: #{240rpx};
			width: #{240rpx};
		}
		>text {
			font-size: #{24rpx};
			color: #666666;
		}
	}
	.text-time {
		text-align: right;font-size: #{26upx};color: #999999;
		margin-top: #{16upx};
	}
  .search {
	  height: #{104rpx};
	  width: 100%;
	  background-color: #efeff4;
	  padding: #{20rpx 24rpx};
	  position: relative;
	  overflow: hidden;
	  .delete {
		  width: #{32rpx};
		  height: #{32rpx};
	  }
	  .input {
		  height: #{64rpx};
		  width: #{620rpx};
		  border-radius: #{50rpx};
		  background-color: #ffffff;
		  padding-left: #{32rpx};
		  font-size: #{26rpx};
		  color: #353535;
	  }
	  .delete {
		  position: absolute;
		  right: #{125rpx};
		  z-index: 1600;
	  }
  }
	.order-number {
	
	}
	
	.filal-payment-time {
		font-size:#{22upx};
		color: #ff4544;
		text-align: right;
		margin-top: #{14upx};
	}
</style>