<template>
    <app-layout>
	    <view class="app-quick-shop dir-left-nowrap">
		    <view class="app-left" :style="{height: `calc(100% - 136rpx - ${tabbarbool ? botHeight : 0}rpx)`}">
			    <scroll-view scroll-y class="app-quick-scroll">
				   <view class="app-text" v-for="(item, index) in classification" :class="{'app-active-bk': activeIndex === index}" :key="index">
					   <app-form-id @click="active(item,index)">
						   <text class="app-text-text">{{item.name}}</text>
					   </app-form-id>
				   </view>
			    </scroll-view>
			    <view class="app-cart">
				    <view class="app-icon image-no-rep image-cover" @click="pushSelectProduct()">
					    <app-jump-button form url="/pages/cart/cart">
						    <text class="app-active-num"
								  :style="{'background-color': getTheme.background}"
								  v-if="activeNum !== '0' || activeNum === 0"
							>{{activeNum}}</text>
					    </app-jump-button>
				    </view>
			    </view>
		    </view>
		    <view class="app-right" :style="{height: `calc(100% - ${tabbarbool ? botHeight : 0}rpx)`}">
			    <text class="app-active-name">{{activeName}}</text>
			    <scroll-view scroll-y class="app-scroll-right"
			                 :style="{height: `calc(100% - 102rpx)`}"
			                :scroll-top="scrollTop" @scrolltolower="scrolltolower" >
				    <view class="app-request">
					   <view class="app-item-item" v-for="(item, index) in list" :key="index" >
						   <app-form-id >
							   <view class="app-item dir-left-nowrap cross-top" >
								   <image class="app-image" lazy-load :src="item.cover_pic" @click.stop="jumpGo(item)"></image>
			                       <view class="out-dialog" v-if="item.goods_num === 0 && appSetting.is_show_stock === 1 ">
			                           <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
			                       </view>
								   <view class="app-content dir-top-nowrap main-left">
									   <view class="app-top" @click.stop="jumpGo(item)">
										   {{item.name}}
									   </view>
									   <view class="app-volume">
										   销量 {{item.virtual_sales}}
									   </view>
									   <view class="dir-top-nowrap" style="padding: 10rpx 0;">
										   <view v-if="item.is_level === 1">
											   <app-member-price :theme="getTheme" :price="item.level_price"></app-member-price>
										   </view>
											<app-sup-vip :is_vip_card_user="item.vip_card_appoint.is_vip_card_user" margin="4rpx 0 0" v-if="item.vip_card_appoint.discount" :discount="item.vip_card_appoint.discount"></app-sup-vip>
										   <view class="app-bottom dir-left-nowrap main-between">
                                                <view>
                                                    <view class="app-price" :style="{'color': getTheme.color}">
                                                        <text class="app-symbol">￥</text>
                                                        {{item.price}}
                                                    </view>
                                                    <view class="origin-price"  v-if="isListUnderlinePrice == 1">
                                                        ￥{{item.original_price}}
                                                    </view>
                                                </view>
											   <app-add-subtract :item="item" v-if="item.use_attr === 0 && item.goods_num > 0" :theme="getTheme" @changeNum="changeNum" @subtract="subtract" @add="add" :total_num="item.total_num" ></app-add-subtract>
											   <view class="app-button" v-if="item.use_attr === 1 && item.goods_num > 0">
												   <view @click="specification(item)" class="but" :style="{'background-color': getTheme.background}">选规格</view>
											   </view>
											   <view
                                                   v-if="item.use_attr === 1 && item.total_num !== 0"
                                                   :style="{'color': getTheme.color}"
                                                   class="app-num"
                                               >
                                                   {{item.total_num}}
                                               </view>
										   </view>
									   </view>
								   </view>
							   </view>
						   </app-form-id>
					   </view>
				    </view>
			    </scroll-view>
		    </view>
            <u-attr
                v-if="item.use_attr === 1"
                v-model="show"
                :goods="item"
                :checked="checked"
                :theme="getTheme"
                @check="onAttr"
                @cart="selectNumber"
            ></u-attr>
	    </view>
    </app-layout>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import appAddSubtract from './components/app-add-subtract/app-add-subtract.vue';
    import appAttr from '../../components/page-component/app-attr/app-attr.vue';
    import uAttr from '../../components/page-component/goods/u-attr.vue';

    export default {
        name: 'quick-shop',
	    components: {
            'app-add-subtract': appAddSubtract,
            'app-attr': appAttr,
            uAttr
	    },
	    computed: {
            ...mapState({
                tabBarNavs: state => state.mallConfig.navbar.navs,
                appSetting: state => state.mallConfig.mall.setting,
                appImg: state => state.mallConfig.__wxapp_img.mall,
                isListUnderlinePrice: state => state.mallConfig.mall.setting.is_list_underline_price,

                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            }),
		    ...mapGetters('iPhoneX',{
                botHeight: 'getBotHeight',
		    }),
			...mapGetters('mallConfig',{
                getTheme: 'getTheme',
				getVideo: 'getVideo'
			})
	    },
	    data() {
            return {
	            activeNum: '',
                classification: [],
	            activeIndex: 0,
	            activeName: '',
                list: [],
                coverPic: '',
                spec: true,
                goodsNum: 0,
                item: {
                    use_attr: 0
                },
                selectAttr: {},
                checked: null,
                show: false,
	            page: 1,
                over: false,
                tabbarbool: false,
                currentRoute: this.$platDiff.route(),
                activeId: '0',
                scrollTop: 0,
                old: {
                    scrollTop: 0
                }
            }
	    },
	    methods: {
			onAttr({item}) {
			    this.checked = item;
            },
		    request() {
                this.$request({
                    url: `${this.$api.quick.goods_list}&page=${this.page}&cat_id=${this.activeId}is_sell_well=0 `,
                }).then(res => {
                    if (res.code === 0) {
                        if (res.data.list.length > 0) {
                            this.list = [...this.list, ...res.data.list];
                        } else {
                            this.over = true;
                        }
                    }
                });
		    },
            active(item, index) {
                this.scrollTop = 1;
                this.$nextTick(() => {
                    this.scrollTop = 0
                });
                this.activeIndex = index;
                this.activeName = item.name;
                this.activeId = item.id;
                this.over = false;
                this.page = 1;

                this.pushSelectProduct().then(() => {
					this.$request({
						url: `${this.$api.quick.goods_list}&page=${this.page}&cat_id=${item.id}is_sell_well=0 `,
					}).then(res => {
						this.list = res.data.list;
					});
				});
            },
            specification(item) {
                this.checked = null;
                this.item = item;
                this.show = true;
            },
            selectNumber(checked, number) {
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].id === checked.goods_id) {
                        this.list[i].total_num += number;
                        this.activeNum = Number(this.activeNum) + Number(number);
                    }
                }
            },
		    async pushSelectProduct() {
                let list = [];
                for (let key in this.selectAttr) {
                    list.push(this.selectAttr[key]);
                }
                this.$request({
	                url: this.$api.quick.cart,
	                method: 'post',
	                data: {
	                    list: JSON.stringify(list),
	                }
                })
		    },
            add(item) {
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].id === item.id) {
                        this.list[i].total_num += 1;
                        this.activeNum = Number(this.activeNum) + 1;
                        this.selectAttr[item.attr[0].id] = {
                            attr: item.attr[0].id,
                            num: this.list[i].total_num,
                            goods_id: item.id,
                        };
                    }
                }
            },
            subtract(item) {
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].id === item.id) {
                        this.list[i].total_num -= 1;
                        this.activeNum = Number(this.activeNum) - 1;
                        this.selectAttr[item.attr[0].id] = {
                            attr: item.attr[0].id,
                            num: this.list[i].total_num,
                            goods_id: item.id,
                        };
                    }
                }
            },
            changeNum(item, data) {
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].id === item.id) {
						this.activeNum = Number(this.activeNum) - this.list[i].total_num;
                        this.activeNum = Number(this.activeNum) + data;
                        this.list[i].total_num = data;
                        this.selectAttr[item.attr[0].id] = {
                            attr: item.attr[0].id,
                            num: this.list[i].total_num,
                            goods_id: item.id,
                        };
                    }
                }
            },
            jumpGo(data) {
				// #ifndef MP-BAIDU
				if (data.video_url && this.getVideo == 1) {
				    // #ifdef MP
					uni.navigateTo({
						url: `/pages/goods/video?goods_id=${data.id}`
					});
					// #endif
                    // #ifdef H5
                    uni.navigateTo({
                        url: `/pages/goods/goods?id=${data.id}`
                    });
                    // #endif
				} else {
					uni.navigateTo({
						url: `/pages/goods/goods?id=${data.id}`
					});
				}
				// #endif

				// #ifdef MP-BAIDU
				uni.navigateTo({
					url: `/pages/goods/goods?id=${data.id}`
				});
				// #endif
            },
            scrolltolower() {
                if (!this.over) {
                    this.page++;
                    this.request();
                }
            },
            b() {
                let currentRoute = this.currentRoute;
                for (let i = 0; i < this.tabBarNavs.length; i++) {
                    if(currentRoute.includes(this.tabBarNavs[i].url.split('?')[0])) {
                        return this.tabbarbool = true;
                    }
                }
                return  this.tabbarbool = false;
            },
        },
	    onLoad() { this.$commonLoad.onload();
            this.$request({
	            url: this.$api.quick.index
            }).then(response => {
                this.activeNum = `${response.data.count}`;
                let {name, id} = response.data.cats_list[this.activeIndex];
                this.activeName = name;
                this.activeId = id;
                this.classification = response.data.cats_list;
                this.$request({
	                url: this.$api.quick.index,
                }).then(response => {
                    this.activeNum = `${response.data.count}`;
                });
                this.$request({
	                url: `${this.$api.quick.goods_list}&page=${this.page}&cat_id=${id}is_sell_well=0 `,
                }).then(response => {
                    this.list = response.data.list;
                })
            })
	    },
        onHide() {
	        this.pushSelectProduct();
        },
        onUnload() {
            this.pushSelectProduct();
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                path: '/pages/quick-shop/quick-shop',
                title: this.$children[0].navigationBarTitle,
            });
        },
        // #endif
        watch: {
            tabBarNavs: {
                handler: function() {
                    this.b();
                },
                immediate: true,
            }
        }
    }
</script>

<style scoped lang="scss">
	.app-quick-shop {
		position: absolute;
		height: 100%;
		width: $screen-width;
		.app-left {
			width: #{160rpx};
			.app-quick-scroll {
				width: 100%;
				height: 100%;
				background-color: #f3f3f3;
				.app-text {
					background-color: #f3f3f3;
					width: 100%;
					height: #{104rpx};
					line-height: #{104rpx};
					font-size: #{26rpx};
					color: #353535;
					.app-text-text {
						text-align: center;
						word-break: break-all;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}
				}
				.app-active-bk {
					background-color:white;
				}
			}
			.app-cart {
				width: #{160rpx};
				height: #{136rpx};
				background-color: #f3f3f3;
				.app-icon {
					width: #{96rpx};
					height: #{96rpx};
					margin: 0 #{32rpx} #{40rpx} #{32rpx};
					border-radius: 50%;
					box-shadow: #{0.1rpx} #{0.1rpx} #{5rpx} rgba(0,0,0,0.1);
					background-image: url("./image/cart-big.png");
					position: relative;
				}
				.app-active-num {
					position: absolute;
					top: #{26rpx};
					right: #{10rpx};
					border-radius: #{12rpx};
					font-size: #{18rpx};
					height: #{24rpx};
					line-height: #{24rpx};
					color: #FFFFFF;
					padding: 0 #{8rpx};
				}
			}
		}
		.app-right {
			width: calc(100% - #{160rpx});
			background-color: #ffffff;
			.app-active-name {
				display: inline-block;
				width: 100%;
				padding-top: #{40rpx};
				padding-bottom: #{36rpx};
				font-size: #{26rpx};
				color: #8c8c8c;
				padding-left: #{22rpx};
			}
			.app-scroll-right {
				.app-request {
					padding-top: #{1rpx};
				}
				.app-item-item {
					width: calc(100% - #{22rpx});
					margin-left: #{22rpx};
					margin-top: #{23rpx};
				}
			}
			.app-item {
				width: calc(100% - #{22rpx});
				border-bottom: #{1rpx} solid #e2e2e2;
				position: relative;
                .out-dialog {
                    width: #{152rpx};
                    height: #{152rpx};
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 10;
                    background-color: rgba(0,0,0,.5);
                    image {
                        width: #{152rpx};
                        height: #{152rpx};
                    }
                }
				.app-image {
					height: #{152rpx};
					width: #{152rpx};
					margin-right: #{20rpx};
				}
				.app-content {
					width: calc(100% -  #{192rpx} );
					min-height: #{152rpx};
					background-color: white;
					.app-top {
						width: 100%;
						padding-top: #{10rpx};
						font-size: #{28rpx};
						color: #353535;
						word-break: break-all;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					.app-volume {
						font-size: #{22rpx};
						color: #666666;
						margin-bottom: 2rpx;
					}
					.app-bottom {
						width: 100%;
						padding-bottom: #{16rpx};
						position: relative;
						.app-button {
							height: #{44rpx};
						}
						/deep/ button {
							text-align: center;
							width: #{104rpx};
							line-height: #{44rpx};
						}
						.app-price {
							font-size: #{28rpx};
							.app-symbol {
								font-size: #{18rpx};
							}
						}
						.app-num {
							position: absolute;
							background-color: white;
							border: #{1rpx} solid;
							border-radius: #{12rpx};
							height: #{24rpx};
							padding: 0 #{6rpx};
							top: #{-14rpx};
							right: #{15rpx};
							font-size: #{18rpx};
							line-height: #{24rpx};
						}
					}
				}
			}
		}
	}
	.but {
		height: #{44upx};
		line-height: #{44upx};
		padding: #{0 16upx};
		border-radius: #{22upx};
		font-size: #{24upx};
		color: #ffffff;
	}
    .origin-price {
        font-size: 21upx;
        color: #999999;
        text-decoration:line-through;
    }
</style>