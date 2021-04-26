<template>
	<view>
		<view class="bd-bottom dir-left-nowrap cross-center" v-if="active">
            <view  @click="route_jump" class="bd-back dir-top-nowrap main-center cross-center box-grow-0">
                <image class="bd-icon" src="/static/image/icon/index.png"></image>
                <text class="bd-text">首页</text>
            </view>
            <bd-service :name="detail.name" :url="webUrl"></bd-service>
            <view @click="set_favorite(favorite)" class="bd-back dir-top-nowrap main-center cross-center box-grow-0" >
                <image class="bd-icon" :src="favorite ? '/static/image/icon/icon-favorite-active.png' : '/static/image/icon/icon-favorite.png'"></image>
                <text class="bd-text">收藏</text>
            </view>
            <view class="box-grow-1 bd-btn bd-oversell-btn bd-btn-color" v-if="detail.goods_num === 0">
                已售罄
            </view>
			<view v-else class="box-grow-1 dir-left-nowrap">
				<view class="bd-btn bd-btn-half-3 bd-btn-left dir-top-nowrap main-center cross-center" :style="{'background-color': theme.background_s,'color': theme.secondary_text}">
					<text class="bd-line">预售截止</text>
					<text class="bd-line">{{getDate(end_prepayment_at)}}</text>
				</view>
				<view class="bd-btn bd-btn-half-4 bd-btn-color bd-btn-right" :style="{'background-color': !detail || detail.buy_goods_auth ? theme.background : '#999999'}" @click="set_active">
                    支付定金
				</view>
			</view>
		</view>
		<view  v-if="!active" class="bd-bottom dir-left-nowrap">
			<view class="bd-btn bd-btn-half-0 dir-top-nowrap main-center cross-center" :style="{'background-color': theme.background_s,'color': theme.secondary_text}">
				<text class="bd-line">预售截止</text>
				<text class="bd-line">{{getDate(end_prepayment_at)}}</text>
			</view>
			<view class="bd-btn bd-btn-half-1 bd-btn-color" :style="{'background-color': buttonDisabled ? '#dddddd': theme.background}" @click="pay">
                支付定金
			</view>
		</view>
	</view>
</template>

<script>
import bdService from '@/components/page-component/goods/bd-service.vue';

    export default {
        name: "detail-bottom-button",
	    data() {
            return {
                request_time: false,
	            once_pay: false,
                webUrl: '',
                disable: 'disable'
            }
	    },
        components: {
            bdService
        },
	    props: {
            end_prepayment_at: String,
            active: Boolean,
            favorite: Boolean,
            goods_id: Number,
            detail: Object,
            num: Number,
			theme: Object,
			buttonDisabled: Boolean
	    },
        created() {
            this.webUrl = '/plugins/advance/detail/detail?id=' + this.goods_id;
        },
	    methods: {
            set_active() {
                if (this.$user.isLogin() && !this.once_pay) {
                    this.$emit('close_attr', false);
                } else if (!this.$user.isLogin()) {
                    this.$user.getInfo().then(() => {
                    }).catch(() => {
                    });
                }
            },
            set_favorite(data) {
                if (data) {
                    this.$request({
	                    url: this.$api.user.favorite_remove,
	                    data: {
                            goods_id: this.goods_id,
	                    }
                    }).then(res => {
                        if (res.code === 0) {
                            this.$emit('favorite', !this.favorite);
                        } else {
                            uni.showModal({
                                title: '提示',
                                content: res.msg
                            })
                        }
                    })
                } else {
                    this.$request({
                        url: this.$api.user.favorite_add,
                        data: {
                            goods_id: this.goods_id,
                        }
                    }).then(res => {
                        if (res.code === 0) {
                            this.$emit('favorite', !this.favorite);
                        } else {
                            uni.showModal({
                                title: '提示',
                                content: res.msg
                            })
                        }
                    })
                }
            },
            route_jump() {
                uni.navigateTo({
	                url: `/pages/index/index`,
                });
            },
			submit(body) {
				this.once_pay = true;
				uni.showLoading({
					title: '生成订单中...',
					mask: true,
				});
				this.$emit('close_attr', true);
				this.get_submit(body).then(response => {
					this.get_token(response.data);
				});
			},
            pay() {
            	if (this.buttonDisabled) return;
				if (this.detail.min_number > this.num) {
					this.$tips.showToast({
						title: '该商品' + this.detail.min_number + this.detail.unit + '起售',
                        icon: 'none'
					});
					return ;
				}
				if (typeof this.detail.limit_buy !== 'undefined' && this.detail.limit_buy.status == 1 && this.detail.limit_buy.rest_number < this.num) {
                    this.$tips.showToast({
                        title: this.detail.limit_buy.text,
                        icon: 'none'
                    });
					return ;
				}
				let body = {
					goods_id: this.detail.id,
					goods_attr_id: 0,
					goods_num: `${this.num}`,
					advance_goods_id: this.detail.advanceGoods.id,
				};
				let attr = ``;
				let attr_groups = this.detail.attr_groups;
				for (let i = 0; i < attr_groups.length; i++) {
					let attr_list = attr_groups[i];
					for (let j = 0; j < attr_list.attr_list.length; j++) {
						if (attr_list.attr_list[j].active) {
							attr += `:${attr_list.attr_list[j].attr_id}`
						}
					}
				}
				for (let i = 0; i < this.detail.attr.length; i++) {
					if (this.detail.attr[i].sign_id === attr.substring(1)) {
						if (this.num > this.detail.attr[i].stock) {
							uni.showToast({
								title: '库存不足',
								icon: 'none'
							});
							return;
						}
						body.goods_attr_id = this.detail.attr[i].id;
					}
				}
				this.$subscribe(this.detail.template_message).then(() => {
					this.submit(body);
				}).catch(() => {
					this.submit(body);
				});
            },
		    get_token(data) {
                this.$request({
	                url: this.$api.advance.pay_data,
	                method: 'post',
	                data: {
	                    ...data
	                },
                }).then(response => {
                    if (response.code === 0) {
                        if (response.data.hasOwnProperty('id')) {
                            uni.hideLoading();
                            this.$payment.pay(response.data.id).then(() => {
                                this.once_pay = false;
                                // 支付成功
                                uni.navigateTo({
                                    url: `/plugins/advance/order/order`
                                })
                            }).catch(() => {
                                // 支付失败
                                this.once_pay = false;
                                uni.navigateTo({
                                    url: `/plugins/advance/order/order`
                                })
                            });
                        } else {
                             setTimeout(() => {
                                this.get_token(data);
                            }, 1000);
                        }
                    } else {
                        uni.hideLoading();
                        uni.showToast({
							title: response.msg,
							icon: 'none'
                        })
                    }
                });
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
                        success(res){
                            if(res.cancel){
                                this.$emit('request', this.goods_id);
                            }else if(res.confirm){
                               uni.navigateBack();
                            }
                        }
                    });
                }
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
	    },
    }
</script>

<style scoped lang="scss">
.bd-bottom {
    width: 750upx;
    height: 110upx;
    padding: 20upx 24upx;
}
.bd-back {
    width: 66upx;
    height: 100%;
    margin-right: 20upx;
}
.bd-icon {
    width: 30upx;
    height: 30upx;
    margin-bottom: 8upx;
}
.bd-text {
    font-size: 20upx;
    color: #888888;
    line-height: 1;
}
.bd-btn {
    text-align: center;
    line-height: 70upx;
    font-size: 26upx;
    border-radius: 35upx;
}
.bd-btn-left {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.bd-btn-right {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
.bd-btn-half {
    width: 50%;
}
.bd-btn-color {
    color: #ffffff;
}
.bd-oversell-btn {
    background-color: #CDCDCD;
}
    .bd-line {
        line-height: 1.1;
    }
    .bd-btn-half-0 {
        width: 341upx;
        margin-right: 20upx
    }
    .bd-btn-half-1 {
        width: 341upx;
    }
    .bd-btn-half-3 {
        width: 65%;
    }
.bd-btn-half-4 {
    width: 35%;
}
</style>