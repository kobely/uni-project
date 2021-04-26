<template>
	<app-layout>
		<view class="page" :style="{ height: height }">
			<view class="swiper" :style="containerStyle">
				<block v-for="(item, index) in videoList" :key="index">
					<video-new
							class="video"
							:video_id="item.video_id"
							:video_url="item.video_url"
							:height="height"
							:width="width"
							:play="item.flag"
							:cur_index="cur_index"
							:style="{ height: height, width: width }"
					></video-new>
				</block>
			</view>
			<view class="close" @click.stop="close">
				<image class="image" src="./image/video-close.png"></image>
			</view>
			<view
					class="cover-view-marks"
					:style="{ height: height, width: width }"
					@click.stop="clickVideo"
					@touchmove="ListTouchMove"
					@touchend.stop="ListTouchEnd"
					@touchstart="ListTouchStart"
			>
			</view>
			<view class="operating ">
				<view class="dir-left-nowrap cross-bottom">
					<view class="left dir-left-nowrap main-between">
						<view class="up-down-goods">
							<view class="item" @click="previous">上一件商品</view>
							<view class="item down" @click="next">下一件商品</view>
						</view>
						<view class="goods-list">
							<view class="scroll" :style="{bottom: (getEmpty+157) + 'rpx'}" v-show="goodBool">
								<view  class="scroll-view">
									<view class="item-good dir-left-nowrap"  @click="routeGo(goods_list[cur_index].page_url)">
										<view class="image-view cover-pic">
											<image class="cover-pic " :src="goods_list[cur_index] && goods_list[cur_index].cover_pic"></image>
											<view>视频同款</view>
										</view>
										<view v-if="goods_list[cur_index]" class="content dir-top-nowrap main-between">
											<view class="name t-omit-two">{{goods_list[cur_index].name}}</view>
											<view class="pri-but dir-left-nowrap main-between cross-bottom">
												<view>
													<view class="dir-left-nowrap">
														<!-- 会员价 -->
														<view class="member-price" v-if="goods_list[cur_index].is_level == 1 && goods_list[cur_index].is_negotiable != 1">
															<app-member-price
                                                                :price="goods_list[cur_index].level_price"
                                                                :sign="sign"
                                                                :theme="sign !== 'gift' ? getTheme : theme"
															></app-member-price>
														</view>
														<!-- 超级会员卡 -->
														<view class="app-sup-vip" v-if="goods_list[cur_index] && goods_list[cur_index].vip_card_appoint.discount">
															<app-sup-vip
																	:discount="goods_list[cur_index] &&goods_list[cur_index].vip_card_appoint.discount"
																	:is_vip_card_user="goods_list[cur_index].vip_card_appoint.is_vip_card_user"
															></app-sup-vip>
														</view>
													</view>
													<view class="pri">
														<text class="price" :style="{'color': sign !== 'gift' ? getTheme.color : ''}" :class="sign === 'gift' ? theme + '-color '+ theme : ''">{{goods_list[cur_index].price_content}}</text>
														<text class="original">￥{{goods_list[cur_index].original_price}}</text>
													</view>
												</view>
												<view class="button" @click.stop="specification(goods_list[cur_index])"></view>
											</view>
										</view>
									</view>
								</view>
								<view class="triangle"></view>
							</view>
							<image class="image" src="/static/image/video-goods.png" @click="goodBool = !goodBool"></image>
						</view>
					</view>
					<view class="right dir-left-nowrap">
						<view class="but index" @click.stop="routeGo('/pages/index/index')">
							<view class="icon">
								<image class="image" src="./image/video-index.png"></image>
							</view>
							<text>首页</text>
						</view>
						<view class="but cart" @click.stop="specification(goods_list[cur_index])">
							<view class="icon">
								<image class="image" src="./image/video-card.png"></image>
							</view>
							<text>加购</text>
						</view>
						<view class="but" >
							<view class="icon">
								<image class="image" src="./image/video-share.png"></image>
							</view>
							<text>分享</text>
							<!-- #ifdef MP -->
							<button class="share" open-type="share">
							</button>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<button class="share" @click="shareUrl">
							</button>
							<!-- #endif -->
						</view>
					</view>
				</view>
				<view class="empty" :style="{'height': getEmpty+'rpx'} ">
				</view>
			</view>
			<view class="attr">
				<app-attr ref="attr"
						  :goods="item"
						  :select-attr="selectAttr"
						  :attr-group-list="attrGroup"
						  :show="show"
						  :cartShow="cartShow"
						  :buyText="buyText"
						  :addText="addText"
						  :buyClick="buyBool"
						  :plugin="plugin"
						  :previewUrl="previewUrl"
						  :submitUrl="submitUrl"
						  @buyClick="buyClick"
						  @attrtap="onAttr"
						  @attr="attr"
						  @add="add"
                          @close="closept"
						  :is_show_buy="is_show_buy"
						  :theme="getTheme"
				>
					<view slot="extra" v-if="sign === 'pintuan'">
						<app-pt-attr
								v-if="pt"
								:groups="item.groups"
								:selectGroupAttrId="selectGroupAttrId"
								@click="setGroupAttrID"
								:theme="getTheme"
						></app-pt-attr>
					</view>
				</app-attr>
			</view>
			<view v-if="sign === 'pintuan' && show_pt">
				<view class="pintuan dir-left-nowrap" slot="empty-area">
					<view class="single box-grow-1 dir-top-nowrap"
						  :style="{'background-color': getTheme.background_s,'color': getTheme.secondary_text}"
						  @click="individual"
                          v-if="item && item.pintuanGoods.is_alone_buy">
                            <text class="price">
                                {{singlePrice}}
                            </text>
                            <text class="app-text">单独购买</text>
					</view>
					<view class="tuan box-grow-1 dir-top-nowrap" :style="{'background-color': getTheme.background,'color': getTheme.main_text}" @click="multiplayer">
		                <text class="price">{{groupPrice}}</text>
		                <text class="app-text">{{item.groups[set_group_num].groups.people_num}}人拼团</text>
					</view>
				</view>
			</view>
		</view>
	</app-layout>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
    import videoNew from '../../components/page-component/goods/app-goods-video.vue';
    import appAttr from '../../components/page-component/app-attr/app-attr.vue';
    import appPtAttr from '../../components/page-component/app-pt-attr/app-pt-attr.vue';
    import allPay from '../../core/all-pay.js';

    export default {
        components: {
            videoNew,
            appPtAttr,
            'app-attr': appAttr,
        },
        data() {
            return {
                buyText: '立即购买',
                sign: '',
                cartShow: 1,
                plugin: '',
                buyBool: false,
                previewUrl: '',
                submitUrl: '',
                show_pt: false,
				pt: true,
				selectGroupAttrId: -1,
				appAttr: {},
                translateX: '10',
                height: '667px',
                cur_index: null,
                width: '',
                sysheight: 0,
                containerStyle: 'transform:translateY(0px)',
                distance: 0,
                listTouchStartY: 0,
                listTouchDirection: null,
                scroll: false,
                videoList: [],
                clicktime: 0,
                goodBool: false,
                goods_list: [],
                page: 1,
                goods_id: 0,
                show: 0,
                item: null,
                selectAttr: {},
                attrGroup: null,
                ne: 0,
                pre: 0,
				is_show_buy: true,
                is_share: 0,//社交送礼用的
				addText: '',
                ptAttr: {},
                ptId: 0,
                getResult: null,
                han: null
            };
        },
		computed: {
			...mapGetters('iPhoneX', {
				getEmpty: 'getEmpty'
			}),
			...mapGetters('mallConfig', {
				getTheme: 'getTheme',
			}),
            ...mapState('gift',{
                theme: state => state.theme,
            }),
            groupPrice: function() {
            	if(this.item) {
	                if (!this.$validation.isEmpty(this.selectAttr)) {
	                    if (this.pt) {
	                        if (this.item.level_show === 1) {
	                            if (this.selectAttr.price_member === 0) {
	                                return '免费';
	                            } else {
	                                return `￥${this.selectAttr.price_member}`;
	                            }
	                        } else {
	                            if (Number(this.selectAttr.price) ===  0) {
	                                return '免费';
	                            } else {
	                                return `￥${this.selectAttr.price}`;
	                            }
	                        }
	                    } else {
	                        let attr = this.item.groups[this.set_group_num].attr;
	                        for (let i = 0; i < attr.length; i++) {
	                            if (attr[i].sign_id === this.selectAttr.sign_id) {
	                                if (this.item.level_show === 1) {
	                                    if (attr[i].price_member === 0) {
	                                        return '免费';
	                                    } else {
	                                        return `￥${attr[i].price_member}`;
	                                    }
	                                } else {
	                                    if (Number(attr[i].price) ===  0) {
	                                        return '免费';
	                                    } else {
	                                        return `￥${attr[i].price}`;
	                                    }
	                                }
	                            }
	                        }
	                    }
	                } else {
	                    if (this.item.level_show === 1) {
	                        if (Number(this.item.price_member_min) === 0) {
	                            return '免费';
	                        } else {
	                            return `￥${this.item.price_member_min}`;
	                        }
	                    } else {
	                        if (Number(this.item.price) ===  0) {
	                            return '免费';
	                        } else {
	                            return `￥${this.item.price}`
	                        }
	                    }
	                }
            	}
            },
            set_group_num() {
            	if(this.item && this.item.groups) {
	                for (let i = 0; i < this.item.groups.length; i++) {
	                    if (this.item.groups[i].groups.id == this.selectGroupAttrId) {
	                        return i;
	                    }
	                }
            	}
            },
            singlePrice: function() {
            	if(this.item) {
	                if (!this.$validation.isEmpty(this.selectAttr)) {
	                    for (let i = 0; i < this.ptAttr.length; i++) {
	                        if (this.ptAttr[i].sign_id === this.selectAttr.sign_id) {
	                            if (this.item.level_show === 1) {
	                                if (Number(this.ptAttr[i].price_member) === 0) {
	                                    return '免费';
	                                } else {
	                                    return `￥${this.ptAttr[i].price_member}`;
	                                }
	                            } else {
	                                if (Number(this.ptAttr[i].price) === 0) {
	                                    return '免费';
	                                } else {
	                                    return `￥${this.ptAttr[i].price}`;
	                                }
	                            }
	                        }
	                    }
	                } else {
	                    if (this.item.level_show === 1) {
	                        if (Number(this.item.price_member_min) === 0) {
	                            return '免费';
	                        } else {
	                            return `￥${this.item.price_member_min}`;
	                        }
	                    } else {
	                        if (Number(this.item.price) ===  0) {
	                            return '免费';
	                        } else {
	                            return `￥${this.item.price}`
	                        }
	                    }
	                }
	            }
            },
		},
        onLoad(options) { this.$commonLoad.onload(options);
            this.goods_id = options.goods_id;
            this.sign = options.sign;
            this.is_share = options.is_share;
            switch (this.sign) {
                case "advance":
                    this.cartShow = 0;
                    this.buyText = '支付定金';
                    this.buyBool = true;
                    break;
                case "booking":
                    this.cartShow = 0;
                    this.buyText = '立即预约';
                    this.plugin = 'booking';
					this.submitUrl = this.$api.book.order_submit;
					this.previewUrl = this.$api.book.order_preview;
					break;
				case "miaosha":
                    this.addText = '加入购物车';
					this.submitUrl = this.$api.miaosha.order_submit;
					this.previewUrl = this.$api.miaosha.order_preview;
					break;
				case "pintuan":
					this.$request({
						url: this.$api.pt.detail,
						data: {
							id: this.goods_id,
							group_id: 0,
						}
					}).then((res) => {
						this.item = res.data.detail;
                        this.cartShow = res.data.detail.pintuanGoods.is_alone_buy;
                        this.ptAttr = JSON.parse(JSON.stringify(res.data.detail.attr));
                        this.ptId = JSON.parse(JSON.stringify(res.data.detail.id));
                        this.selectGroupAttrId = this.item.groups[0].groups.id;
                        this.item.attr = this.item.groups[0].attr;
                        this.item.id = this.item.groups[0].groups.goods_id;
                    });
                    break;
                case "integral_mall":
                    this.cartShow = 0;
                    this.buyText = '立即兑换';
                    this.submitUrl = this.$api.integral_mall.order_submit;
                    this.previewUrl = this.$api.integral_mall.order_preview;
                    break;
                case "step":
                    this.cartShow = 0;
                    this.buyText = '立即兑换';
                    this.submitUrl = this.$api.step.order_submit;
                    this.previewUrl = this.$api.step.order_preview;
                    break;
                case "gift":
                    this.cartShow = 0;
                    this.buyBool = true;
                    this.buyText = '加入礼包';
                    this.$request({
                        url: this.$api.gift.config,
                        method: 'get',
                    }).then((res) => {
                        if (res.code === 0) {
                            this.$store.commit('gift/setTheme', Number(res.data.theme.id));
                        }
                    });
                    break;
                case "mch":
                    this.addText = '加入购物车';
                    this.submitUrl = this.$api.mch.order_submit;
                    this.previewUrl = this.$api.mch.order_preview;
                    break;
				case "pick":
					this.addText = '加入凑单池';
					this.is_show_buy=false;
					break;
                case "exchange":
                    this.cartShow = 0;
                    this.submitUrl = this.$api.exchange.order_submit;
                    this.previewUrl = this.$api.exchange.order_preview;
                    break;
                case "community":
                    this.addText = '加入购物车';
                    this.is_show_buy=false;
                    break;
				default:
                    this.addText = '加入购物车';
                    break;
            }

			this.getVideo(options.goods_id);
            let res = uni.getSystemInfoSync();
            this.height = `${res.windowHeight}px`;
            this.width = `${res.windowWidth}px`;
            this.sysheight = res.windowHeight;
        },
        onHide() {
			this.videoList[this.cur_index].flag = false;
			clearTimeout(this.getResult);
        },
        onShow() {
			if (this.cur_index !== null) {
				this.videoList[this.cur_index].flag = true;
			}
        },
        methods: {
			buyClick(data) {
				allPay(data, this.sign, this, this.goods_list[this.cur_index]);
			},
			submit() {
				let goods = this.item;
				let number = this.appAttr.number;
				let select_attr = this.selectAttr;
				if (!select_attr) {
					uni.showModal({
						title: '提示',
						content: '请先选择规格',
						showCancel: false
					});
					return false;
				}
				if (number <= 0) {
					uni.showModal({
						title: '提示',
						content: '商品数量不能为0',
						showCancel: false
					});
					return false;
				}
				if (!goods) {
					return false;
				}
				return true;
			},
			onAttr(goods) {
				this.selectAttr = goods;
			},
			specification(goods) {
				this.attrGroup = goods.attr_groups;
                this.item = JSON.parse(JSON.stringify(goods));
                if (this.sign === 'pintuan') {
                    this.pt = true;
                    this.cartShow = goods.pintuanGoods.is_alone_buy;
                    this.show_pt = true;
                    this.ptAttr = JSON.parse(JSON.stringify(goods.attr));
                    this.ptId = JSON.parse(JSON.stringify(goods.id));
                    this.selectGroupAttrId = goods.groups[0].groups.id;
                    this.item.id = goods.groups[0].groups.goods_id;
                    this.item.attr = goods.groups[0].attr;
				}
                this.show = Math.random();
			},
			setGroupAttrID(item) {
				this.selectGroupAttrId = item.groups.id;
				this.selectAttr = null;
                this.item.attr = item.attr;
                this.item.id = item.groups.goods_id;
			},
			attr(data) {
				this.appAttr = data;
			},
			buy() {
				if (!this.submit()) {
					return false;
				}
				let goods = this.item;
				let number = this.appAttr.number;
				let select_attr = this.selectAttr;
				let goods_attr_id = select_attr.id;
				let attr = [];
				for (let i in select_attr.attr_list) {
					attr.push({
						attr_id: select_attr.attr_list[i].attr_id,
						attr_group_id: select_attr.attr_list[i].attr_group_id,
					});
				}
				let mch_list = [];
				let mch = {
					mch_id: goods.mch_id ? goods.mch_id : 0,
                    pintuan_order_id: 0,
                    pintuan_group_id: 0,
					goods_list: []
				};
				mch.goods_list.push({
					id: goods.id,
					attr: attr,
					num: number,
					cat_id: 0,
					goods_attr_id: goods_attr_id
				});
				mch_list.push(mch);
                uni.navigateTo({
                    url: `/pages/order-submit/order-submit?mch_list=${JSON.stringify(mch_list)}&preview_url=${encodeURIComponent(this.$api.pt.order_preview)}&submit_url=${encodeURIComponent(this.$api.pt.order_submit)}`
                });
			},
			individual() {
				if (this.pt) {
					this.pt = false;
                    // this.item.attr = this.ptAttr;
                    this.$set(this.item, 'attr', this.ptAttr);
                    this.$set(this.item, 'id', this.ptId);
                    // this.item.id = this.ptId;
                    this.selectAttr = null;
                } else {
					if (Object.keys(this.selectAttr).length === 0) {
						uni.showToast({
							title: '请选择规格',
							icon: "none"
						})
					} else {
						this.buy();
					}
				}
			},
            closept() {
                this.selectAttr = null;
                this.$set(this.item, 'attr', this.ptAttr);
                this.$set(this.item, 'id', this.ptId);
            },
			multiplayer() {
				if (this.pt) {
					if (this.selectAttr && Object.keys(this.selectAttr).length === 0) {
						uni.showToast({
							title: '请选择规格',
							icon: "none"
						})
					} else if (this.selectAttr &&  Object.keys(this.selectAttr).length > 0) {
						let mch_id = this.item.mch_id;
						let mch_list = [];
						let goods = {
							id: this.item.id,
							attr: [],
							num: this.appAttr.number,
							goods_attr_id: this.selectAttr.id,
							cart_id: 0,
						};
						for (let i = 0; i < this.selectAttr.attr_list.length; i++) {
							let attr = {
								attr_id: this.selectAttr.attr_list[i].attr_id,
								attr_group_id: this.selectAttr.attr_list[i].attr_group_id,
							};
							goods.attr.push(attr);
						}
						mch_list.push({
							mch_id: mch_id,
							pintuan_order_id: 0,
							pintuan_group_id: this.selectGroupAttrId,
							goods_list: [goods],
						});
						uni.navigateTo({
							url: `/pages/order-submit/order-submit?mch_list=${JSON.stringify(mch_list)}&preview_url=${encodeURIComponent(this.$api.pt.order_preview)}&submit_url=${encodeURIComponent(this.$api.pt.order_submit)}&order_page_url=/plugins/pt/order/order&plugin=pt`
						});
					}
				} else {
					this.selectAttr = null;
					this.pt = true;
                    this.selectGroupAttrId = this.item.groups[0].groups.id;
                    this.item.attr = this.item.groups[0].attr;
                    this.item.id = this.item.groups[0].groups.goods_id;
				}

			},
        	async getVideo() {

        		const res = await this.$request({
					url: this.$api.goods.goods_video_list,
					method: 'get',
					data: {
						goodsId: this.goods_id,
						page: this.page,
						limit: 2
					}
				});
        		if (res.code === 0) {
        			let data = res.data.list;
					for (let item of data) {
                        this.videoList.push({
                            video_id: item.id,
                            video_url: item.video_url,
                            flag: false,
                        });
                        this.goods_list.push(item);
					}
					if (this.cur_index == null) this.cur_index = 0;

					this.$nextTick().then(() => {
						this.videoList[this.cur_index].flag = true;
					});
				}

			},
            routeGo(data) {
                uni.navigateTo({
	                url: data,
                })
            },
            close() {
                let url = this.goods_list[this.cur_index].page_url;
                if (this.is_share) url = url + '&is_share=1';
                uni.redirectTo({
                    url,
                });
            },
            clickVideo(e) {
				this.goodBool = false;
                if(this.clicktime > 0 && e.timeStamp - this.clicktime < 200){
                    clearTimeout(this.han);
                }else{
                    let _this = this;
                    this.han = setTimeout(function() {
                        _this.videoList[_this.cur_index].flag = !_this.videoList[_this.cur_index].flag;
                    }, 200);
                }
                this.clicktime = e.timeStamp;
                return;
            },
            ListTouchStart(e) {
                this.listTouchStartY = e.changedTouches[0].pageY;
            },
            ListTouchMove(e) {
                this.listTouchDirection = this.listTouchStartY - e.changedTouches[0].pageY > 10 ? -1 : 0;
                this.listTouchDirection = e.changedTouches[0].pageY - this.listTouchStartY > 10 ? 1 : this.listTouchDirection;
                const distance = this.distance + e.changedTouches[0].pageY - this.listTouchStartY;
                if (distance > 0) return;
                if (Math.abs(this.listTouchStartY - e.changedTouches[0].pageY) < 2) {
                    this.listTouchDirection = null;
                }
            },
            ListTouchEnd(e) {
                this.handelVideo(e);
            },
            handelVideo(){
                if (this.cur_index == 0 && this.listTouchDirection == 1) {
                    return;
                }

                this.translateX = 10;

                if (this.scroll) return;
                if (!this.listTouchDirection) {
                    return;
                }
                const destination = this.listTouchDirection * this.sysheight + this.distance;
                if (destination > 0 || destination < -this.sysheight * (this.videoList.length - 1)) return;
                for (let item of this.videoList) {
                    item.flag = false;
                }

                this.animate(destination, this.listTouchDirection);
                this.cur_index = this.cur_index - this.listTouchDirection;
                this.videoList[this.cur_index].flag = true;

                //移动到最后一个加载新的列表
                if (this.videoList.length == this.cur_index + 1) {
					this.page++;
					this.getVideo();
                }
                this.listTouchDirection = null;
            },
            animate(des, direc) {
                let { distance } = this;
                return new Promise((resolve, reject) => {
                    this.scroll = true;
                    const temp = setInterval(() => {
                        if ((direc === -1 && des < distance) || (direc === 1 && des > distance)) {
                            distance += 100 * direc;
                            this.containerStyle = `transform:translateY(${distance}px)`;
                        } else {
                            clearInterval(temp);
                            distance = des;
                            this.distance = des;
                            this.containerStyle = `transform:translateY(${distance}px)`;
                            this.scroll = false;
                            resolve();
                        }
                    }, 20);
                });
            },

            previous() {
        		if (this.cur_index === 0) return;

				for (let item of this.videoList) {
					item.flag = false;
				}
				this.distance =this.distance + this.sysheight;
				this.cur_index = this.cur_index - 1;
				this.containerStyle = `transform:translateY(${this.distance}px)`;
				clearTimeout(this.pre);
				this.pre = setTimeout(() => {
					this.videoList[this.cur_index].flag = true;
				}, 300);
            },
			async add(data, number) {
				if (this.sign === 'pick') {
                    if (this.item.activity_id === 0) {
                        uni.showToast({
                            title: '活动不存在',
                            icon: 'none'
                        });
                    } else {
                        const e = await this.$request({
                            url: this.$api.pick.add,
                            data: {
                                goods_id: data.goods_id,
                                attr: data.id,
                                num: number,
                                pick_activity_id: this.item.activity_id
                            }
                        });
                        if (e.code === 0) {
                            uni.showToast({
                                title: '加入成功',
                                icon: 'none'
                            });
                        }
                    }
                } else if (this.sign === 'community') {
                    let { id, goods_id } = data;
                    this.$request({
                        url: this.$api.community.cart_add,
                        data: {
                            activity_id: this.item.id,
                            goods_id: goods_id,
                            goods_attr_id: id,
                            num: number
                        },
                        method: 'post'
                    }).then(response => {
                        if (response.code === 0) {
                            this.addResult(response.data.queue_id, response.data.token);
                        }
                    });
                }
			},
            addResult(queue_id, token) {
                this.$request({
                    url: this.$api.community.cart_result,
                    method: 'post',
                    data: {
                        queue_id: queue_id,
                        token: token,
                    },
                }).then(response => {
                    if (response.code === 0) {
                        if (response.data && response.data.retry === 1) {
                            this.getResult = setTimeout(() => {
                                this.addResult(queue_id, token);
                            }, 1000);
                        } else {
                            this.attrShow = 0;
                            uni.hideLoading();
                            uni.showToast({
                                title: '添加成功',
                                duration: 1000
                            });
                        }
                    } else {
                        uni.hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                });
            },
            next() {
				if (this.cur_index + 1 === this.videoList.length) {
					uni.showToast({
						title: '无更多视频',
						icon: 'none'
					});
					return
				}
                this.distance = this.distance - this.sysheight;

                this.containerStyle = `transform:translateY(${this.distance}px)`;

                clearTimeout(this.ne);
                this.ne = setTimeout(() => {
					this.videoList[this.cur_index].flag = false;
					this.cur_index = this.cur_index + 1;
					this.videoList[this.cur_index].flag = true;
				});

                if (this.videoList.length < this.cur_index + 1) {
                    this.page++;
                    this.getVideo();
                }
            },
			// #ifdef H5
			shareUrl() {
				let goods = this.goods_list[this.cur_index];
				let params = {
					id: goods.id,
					mch_id: goods.mch_id
				}
				if (goods.sign === 'integral_mall') {
					delete params.id;
					params.goods_id = goods.id
				}
				this.$shareAppMessage({
					title: goods.app_share_title ? goods.app_share_title : goods.name,
					imageUrl: goods.app_share_pic ? goods.app_share_pic :  goods.cover_pic,
					path: goods.page_url.split('?')[0],
					params: params
				});
			}
			// #endif
        },
        // #ifdef MP
		onShareAppMessage() {
        	let goods = this.goods_list[this.cur_index];
        	let params = {
                id: goods.id,
                mch_id: goods.mch_id
            }
            if (goods.sign === 'integral_mall') {
                delete params.id;
                params.goods_id = goods.id
            }
			return this.$shareAppMessage({
				title: goods.app_share_title ? goods.app_share_title : goods.name,
				imageUrl: goods.app_share_pic ? goods.app_share_pic :  goods.cover_pic,
				path: goods.page_url.split('?')[0],
				params: params
			});
		},
        // #endif
		watch: {
			appAttr: {
        		handler(data) {
        			if (data.display === 'none') {
        				this.show_pt = false;
					}
				}
			}
		},
		onUnload() {
            clearTimeout(this.getResult);
		}
    };
</script>

<style lang="scss">
    @import '../../static/css/gift.scss';
	.empty {
		width: #{750upx};
	}
	.page {
		flex: 1;
		overflow: hidden;
		background-color: #000;
	}
	.operating {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 1402;
	}
	.left {
		margin-left: #{26upx};
		width: #{410upx};
	}
	.right {
		margin-right: #{26upx};
	}
	.attr {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 1403;
	}
	.up-down-goods {
		.item {
			width: #{266upx};
			height: #{60upx};
			border-radius: #{16upx};
			background-color: rgba(51,51,51,.4);
			color: #ffffff;
			font-size: #{24upx};
			line-height: #{60upx};
			text-align: center;
		}

		.down {
			margin-top: #{12upx};
		}
	}
	.goods-list {
		width: #{124upx};
		height: #{124upx};
		border-radius: #{62upx};
		background-color: rgba(51,51,51,.4);
		margin-left: #{20upx};
		position: relative;
		.image {
			width: #{68upx};
			height: #{78upx};
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
	.index {
		margin-left: #{20upx};
	}
	.cart {
		margin: #{0 30upx};
	}
	.but {
		text-align: center;
		position: relative;
		.icon {
			width: #{70upx};
			height: #{70upx};
			border-radius: #{35upx};
			background-color: rgba(51,51,51,.4);
			position: relative;
		}
		.image {
			width: #{38upx};
			height: #{36upx};
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		text {
			color: #ffffff;
			font-size: #{24upx};
			line-height: 1;
		}
	}
	.share {
		background: transparent;
		border: none;
		border-radius: 0;
		padding:0;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.scroll {
		width: #{690upx};
		height: #{240upx};
		position: fixed;
		left: 50%;
		bottom: #{157upx};
		transform: translate(-50%, 0%);
	}
	.scroll-view {
		height: calc(100% - #{23upx});
		background-color: #ffffff;
		border-radius: #{16upx};
		padding: #{0 25upx};
		.item-good {
			padding-top: #{25upx};
			.image-view {

				position: relative;
				>view {
					width: #{150upx};
					height: #{30upx};
					line-height: #{30upx};
					position: absolute;
					bottom: 0;
					font-size: #{18upx};
					color: #ffffff;
					text-align: center;
					background: linear-gradient(to left, #ffcb00, #ff9600);
				}
			}
		}
		.cover-pic {
			width: #{150upx};
			height: #{150upx};
		}
		.content {
			width: calc(100% - #{150upx});
			min-height: #{150upx};
			margin-bottom: #{25upx};
			padding-left: #{25upx};
		}
		.name {
			line-height: #{32upx};
			font-size: #{24upx};
			color: #303030;
			margin-top: #{8upx};
		}
		.pri-but {

			>.button {
				width: #{50upx};
				height: #{50upx};
				background-image: url("../../static/image/icon/add-to.png");
				background-size: 100% 100%;
				background-repeat: no-repeat;
				margin: #{0 4upx 0 0};
				border-radius: #{25rpx};
				background-color: transparent;
			}
			.pri {
				line-height: #{21upx};
				margin-top: #{9upx};
			}
			.price {
				font-size: #{21upx};
				line-height: 1;
			}
			.original {
				color: #999999;
				font-size: #{17upx};
				line-height: 1;
				text-decoration: line-through;
				margin-left: #{15upx};
			}
		}
		.member-price {
			margin-right: #{12upx};
		}
	}
	.triangle {
		width: #{40upx};
		border-top: #{23upx} solid #ffffff;
		border-bottom: #{23upx} solid transparent;
		border-left: #{23upx} solid transparent;
		border-right: #{23upx} solid transparent;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	.close {
		position: fixed;
		top: 26upx;
		right: #{26upx};
		width: #{70upx};
		height: #{70upx};
		z-index: 1406;
		border-radius: #{35upx};
		background-color: rgba(51,51,51,.4);
		.image {
			width: #{26upx};
			height: #{26upx};
			position:absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}
	.swiper {
		position: relative;
	}
	.cover-view-marks {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 1401;
	}

	.video {
		width: 100%;
		height: 100%;
		position: relative;
	}
	.pintuan {
		width: #{750upx};
		height: #{110upx};
		padding: #{20rpx} #{24rpx};
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 1500;
		.single {
			border-top-left-radius: 35rpx;
			border-bottom-left-radius: 35rpx;
	        text-align: center;
	        font-size: 22upx;
		}
		.tuan {
			border-top-right-radius: 35rpx;
			border-bottom-right-radius: 35rpx;
	        text-align: center;
	        font-size: 22upx;
		}
	}
    .buy {
        color: #ffffff;
    }

</style>
