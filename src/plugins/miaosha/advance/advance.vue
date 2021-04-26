<template>
    <app-layout>

	   <view class="ms">
		   <template v-if="(time_list.length > 0 || is_estimate === 1 ) && loading">

			   <view class="time-list" >
				   <scroll-view
					   class="scroll "
					   :scroll-x="true"
					   scroll-with-animation
					   :scroll-into-view="`${scroll_id}`"
				   >
					   <view class="content">
						   <view
							   class="item"
							   :id="`ms_${i}`"
							   v-for="(t, i) in time_list"
							   :key="i"
							   :style="{'background-color': active_index === i ? getTheme.background : ''}"
							   :class="active_index === i ? 'active-item' : 'no-active-item'"
							   @click="activeTime({open_time: t.open_time, type: 1, date_time: t.date_time}, i)"
						   >
							   <view class="open-time">{{t.new_open_time}}</view>
							   <view class="label">{{t.label}}</view>
							   <view class="icon" :style="{'color': getTheme.color}"></view>
						   </view>
						   <view
							   class="item teaser"
							   :style="{'background-color': active_index === time_list.length ? getTheme.background : ''}"
							   :class="active_index === time_list.length ? 'active-item' : 'no-active-item'"
							   :id="`ms_${time_list.length}`"
							   v-if="is_estimate === 1"
							   @click="activeTime({open_time: 0, type: 2}, time_list.length)"
						   >
							   预告

							   <view class="icon" :style="{'color': getTheme.color}"></view>
						   </view>
					   </view>
				   </scroll-view>
				   <view class="time dir-left-nowrap main-between" v-if="!is_booking">
					   <view class="left"></view>
					   <view class="text">限时限量 先到先得</view>
					   <view class="timing">
						   <text v-if="time_list[active_index] && time_list[active_index].status === 1">距离本场结束</text>
						   <text v-if="time_list[active_index] && time_list[active_index].status === 2">本场秒杀已结束</text>
						   <text v-if="time_list[active_index] && time_list[active_index].status === 0">距离本场开始</text>
						   <text class="time-html" v-if="time_list[active_index] && (time_list[active_index].status === 1 || time_list[active_index].status === 0)">{{html}}</text>
					   </view>
				   </view>
				   <view class="empty-goods dir-left-nowrap main-center cross-center" v-if="is_booking">
					   <image src="/static/image/icon/empty.png"></image>
					   <view>
						   <view style="color: #353535;">今日已无更多场次</view>
						   <view style="color: #999999;">
							   下场将于
						   		<text style="color: #ff4544;">{{next_time}}</text>
							   开始
						   </view>
					   </view>
				   </view>
			   </view>

			   <scroll-view  :class="is_booking ? 'is_book_list' : 'goods-list'" :scroll-y="true" @scrolltolower="scrollLower">
				   <product-list
					   :empty="nav_bool"
					   :botHeight="BotHeight"
					   :list="goods_list"
					   :theme="getTheme"
					   :status="time_list[active_index] && time_list[active_index].status"
				   ></product-list>
			   </scroll-view>

		   </template>

		   <template v-else-if="time_list.length === 0 && is_estimate !== 1 && loading">
			   <view>
				   <view class="empty dir-top-nowrap cross-center" >
					   <image src="../image/empty.png"></image>
					   <text>暂无秒杀商品</text>
					   <button :style="{'background-color': getTheme.background}" @click="router_go">返回首页</button>
				   </view>
			   </view>
		   </template>
	   </view>

    </app-layout>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import appProductList from '../components/app-product-list.vue';

    export default {
        name: 'advance',

	    data() {
            return {
                time_list: [],
                goods_list: [],
                next_time: '',
                page: 1,
                active_index: null,
                scroll_id: '',
                is_estimate: 0,
                open_time: 0,
                type: 0,
                page_count: 1,
	            nav_bool: false,
                // #ifdef MP
                currentRoute: this.$platDiff.route(),
                // #endif
                time: -1,
                html: '',
				is_booking: false,
				loading: false
            }
	    },

	    computed: {
            ...mapState({
                tabBarNavs: state => state.mallConfig.navbar.navs,
            }),
            ...mapGetters('iPhoneX', {
                BotHeight: 'getBotHeight',
            }),
			...mapGetters('mallConfig', {
				getTheme: 'getTheme',
			}),
	    },

	    onLoad() { this.$commonLoad.onload();
            this.getTimeList().then(() => {
                let active_status = false;
                this.time_list.map((item, index) => {
                    if (item.status === 1) {
                        active_status = true;
                        this.active_index = index;
                        this.scroll_id = `ms_${index}`;
                        item.type = 1;
                        this.getGoodsList(item);
                    }
                });
				this.$nextTick(() => {
					this.loading = true;
				});
                if (active_status === false) {
                    this.active_index = 0;
                    if (this.time_list.length > 0) {
                        this.type = 1;
                        this.open_time = this.time_list[0].open_time;
                        this.getGoodsList({
                            open_time: this.open_time,
	                        type: this.type
                        });
                    } else {
                        if (this.is_estimate === 1) {
							this.type = 2;
                            this.open_time = 0;
                            this.is_booking = true;
                            this.getGoodsList({
                                open_time: this.open_time,
                                type: this.type,
                            });
                        }
                    }
                }
            });
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				menus: ['shareAppMessage', 'shareTimeline']
			})
			// #endif
	    },

	    onShow() {
            if (this.type === 1) {
                this.set_time(this.time_list[this.active_index].date_time);
            }
	    },

        onHide() {
            clearInterval(this.time);
        },

        onUnload() {
            clearInterval(this.time);
        },

	    methods: {
            async getTimeList() {
                uni.showLoading({
	                title:'加载中...'
                });
                try {
                    const res = await this.$request({
                        url: this.$api.miaosha.time_list,
                        method: 'get'
                    });
					if (res.code === 0) {
                        let {is_estimate, list, next_miaosha_date_time} = res.data;
                        this.time_list = list;
                        this.is_estimate = is_estimate;
                        this.next_time = next_miaosha_date_time;
                    }
                } catch (e) {
                    throw new Error(e);
                }
				uni.hideLoading();
			},

		    async getGoodsList(item) {
                try {
                    this.open_time = item.open_time;
                    this.type = item.type;
                    if (this.type === 1) {
                        this.set_time(item.date_time);
                    } else {
                        clearInterval(this.time);
                    }
                    const res = await this.$request({
                        url: this.$api.miaosha.goods,
                        data: {
                            open_time: item.open_time,
                            type: item.type,
                            page: this.page ? this.page : 1,
                        }
                    });
                    if (res.code === 0) {
                        this.goods_list = res.data.list;
                        this.page_count = res.data.pagination.page_count;

                    }
                } catch(e) {
                    throw new Error(e);
                }
		    },

            activeTime(item, index) {
                this.active_index = index;
                this.scroll_id = `ms_${index}`;
                this.page = 1;
                this.getGoodsList(item);
                this.getTimeList();
                if (item.type === 2) {
                	this.is_booking = true;
				} else {
                	this.is_booking = false;
				}
            },

            async scrollLower() {
                try {
                    if (this.page >= this.page_count) return;
                    this.page++;
                    const res = await this.$request({
                        url: this.$api.miaosha.goods,
                        data: {
                            open_time: this.open_time,
                            type: this.type,
                            page: this.page,
                        }
                    });
                    if (res.code === 0) {
                        this.goods_list = [...this.goods_list, ...res.data.list];
                    }
                } catch(e) {
                    throw new Error(e);
                }
            },

            set_nav() {
                let currentRoute = null;
                // #ifdef MP
                currentRoute = this.currentRoute;
                // #endif
                // #ifdef H5
                currentRoute = this.$route.fullPath;
                // #endif
                for (let i = 0; i < this.tabBarNavs.length; i++) {
                    if(currentRoute.includes(this.tabBarNavs[i].url.split('?')[0])) {
                        return this.nav_bool = true;
                    }
                }
                return  this.nav_bool = false;
            },

		    set_time(data) {
                clearInterval(this.time);
                if (!data) return;
                let time_str = new Date(data.replace(/-/g, '/'));
                let time = time_str.getTime() - new Date().getTime();
                let day = parseInt((time/1000/60/60/24)%30);
                let hou = parseInt((time/1000/60/60)%24);
                let min = parseInt((time/1000/60)%60);
                let sec = parseInt((time/1000)%60);
                if (day > 0) {
                    this.html = day+"天"+hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec);
                } else {
                    this.html = hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec);
                }
                this.time = setInterval(() =>{
                    let time = time_str.getTime() - new Date().getTime();
                    if (time < 0) {
                        clearInterval(this.time);
                        this.time_list[this.active_index].status = 2;
                    }
                    let day = parseInt((time/1000/60/60/24)%30);
                    let hou = parseInt((time/1000/60/60)%24);
                    let min = parseInt((time/1000/60)%60);
                    let sec = parseInt((time/1000)%60);
                    if (day > 0) {
                        this.html = day+"天"+hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec);
                    } else {
                        this.html = hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec);
                    }
                },1000);
		    },

			router_go() {
            	uni.reLaunch({
					url: '/pages/index/index'
				});
			}
	    },
		// #ifdef MP-WEIXIN
		onShareTimeline() {
			// 分享朋友圈beta
			return this.$shareTimeline({
				title: this.$children[0].navigationBarTitle,
				query: {
				} // 此处填写页面的参数
			});
		},
		// #endif

	    components: {
            'product-list': appProductList,
	    },

	    watch: {
            tabBarNavs: {
                handler: function() {
                    this.set_nav();
                },
                immediate: true,
            }
	    }
    }
</script>

<style scoped lang="scss">
	.ms {
        height: 100vh;
		width: 100%;
		background: white;
	}
	.time-list {
		width: #{750upx};
		height: #{176upx};
		position: fixed;
		top: 0;
		left: 0;
	}
	.goods-list {
		margin-top: #{176upx};
		width: #{750upx};
		height: calc(100% - #{176upx});
	}
	.is_book_list {
		margin-top: #{350upx};
		width: #{750upx};
		height: calc(100% - #{350upx});
	}
	.scroll {
		width: #{750upx};
		height: #{111upx};
		position: relative;
		z-index: 1500;
		background: #ffffff;
		.content {
			white-space: nowrap;
			/*z-index: 1500;*/
			height: #{96upx};
			background-color: #30353c;
		}
		.item {
			display: inline-block;
			width: #{150upx};
			height: #{96upx};
			position: relative;
			vertical-align:top;
			color: #bbbbbb;
			> view {
				text-align: center;
				line-height: 1;
			}
		}
		.teaser {
			line-height: #{96upx};
			text-align: center;
		}
		.open-time {
			margin-top: #{20upx};
			font-size: #{32upx};
		}
		.label {
			margin-top: #{5upx};
			font-size: #{22upx};
		}
		.no-active-item {
			background-color: #30353c;
		}
		.active-item {
			color: #ffffff;
			.icon {
				border: #{20rpx} solid;
				border-bottom-color: transparent;
				border-left-color: transparent;
				border-right-color: transparent;
				position: absolute;
				bottom: #{-36rpx};
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}
	.time {
		background-color: #ffffff;
		height: #{80upx};
		line-height: #{80rpx};
		position: relative;
		top: #{-18upx};
		.left {
			width: #{6upx};
			height: 100%;
			background-color: #ff4544;
			position: absolute;
			top: 0;
			z-index: 1600;
		}
		.text {
			margin-left: #{20rpx};
			font-size: #{28rpx};
			color: #ff4544;
		}
		.timing {
			font-size: #{28rpx};
			margin-right: #{24rpx};
			color: #999999;
		}
		.time-html {
			margin-left: #{12rpx};
			color: #353535;
		}
	}
	.empty {
		background-color: #ffffff;
		width: 100%;
		font-size: #{26upx};
		>image {
			width: #{350upx};
			height: #{350upx};
			margin-top: #{150upx};
		}
		>text {
			font-size: #{32upx};
			color: #353535;
			line-height: 1;
			margin-top: #{80upx};
		}
		>button {
			padding: 0;
			border: 0;
			border-radius: #{34upx};
			height: #{68upx};
			font-size: #{26upx};
			text-align: center;
			color: #ffffff;
			line-height: #{68upx};
			width: #{240upx};
			margin-top: #{96upx};
		}
	}
	.empty-goods {
		margin-top: 45upx;
		>image {
			width: #{150upx};
			height: #{150upx};
		}
	}
</style>
