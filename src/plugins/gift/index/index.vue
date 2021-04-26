<template>
	<app-layout>
		<view class="index">
            <!--  导航  -->
            <view class="page-width gift-navigation">
                <gift-navigation
                    v-bind:theme="theme"
                    v-bind:botHeight="BotHeight"
                    v-bind:navBool="navBool"
                ></gift-navigation>
            </view>

			<!--  挑选礼物  -->
			<view class="page-width pick-gift">
				<pick-gift
					v-bind:theme="theme"
					v-bind:gift_list="gift_list"
					v-on:giftNumber="giftNumber"
					v-on:giftInput="giftInput"
				></pick-gift>
			</view>

			<!--  送礼方式  -->
			<view class="page-width gift-method">
				<gift-method
					v-bind:method_type="method_type"
					v-bind:open_type="open_type"
					v-bind:select_str="select_str"
					v-bind:type="config.type"
					v-on:set_methods="set_methods"
					v-on:set_people_status="set_people_status"
					v-on:change_people="change_people"
					v-on:set_lottery_time="set_lottery_time"
				></gift-method>
			</view>

			<!--  祝福留言  -->
			<view class="page-width blessing-message">
				<blessing-message
					v-bind:bless_word="bless_word"
					v-on:changeTextarea="changeTextarea"
					v-bind:place_bless_word="config.bless_word"
				></blessing-message>
			</view>
			<!--  #ifdef MP  -->
			<!--  语音  -->
			<view class="page-width voice">
				<voice
					v-bind:theme="theme"
					v-bind:botHeight="BotHeight"
					v-bind:is_play="is_play"
					v-on:play="play"
					v-bind:audio="audio"
					v-on:recorder="recorder"
					v-bind:voice_i="voice_i"
					v-on:click="voice_i = 0"
					v-on:close="close"
				></voice>
			</view>
			<!-- #endif -->
			<!--  生成礼包  -->
			<view class="page-width generate-package">
				<generate-package
					v-bind:theme="theme"
					v-bind:totalPrice="totalPrice"
					v-on:click="generatePackage"
					v-bind:template_message_captain="config.template_message_captain_gift_form_user"
				></generate-package>
			</view>

			<!-- 空白格 -->
			<view class="page-width empty-nav">
				<app-empty-bottom
						backgroundColor="#f7f7f7"
						v-bind:height="Number(96)"
				></app-empty-bottom>
			</view>

            <view class="page-width get-right-now" v-if="is_gift && Object.keys(gift).length > 0">
                <get-right-now
	                v-bind:background="config.background"
                    v-on:setGift="setGift"
	                v-bind:gift_id="gift_id"
	                v-bind:turn_no="turn_no"
	                v-bind:bless_word="gift.list.bless_word"
	                v-bind:nickname="gift.list.user.nickname"
	                v-bind:avatar="gift.list.user.userInfo.avatar"
	                v-bind:type="gift.list.type"
					v-bind:bless_music="gift.list.bless_music"
					v-bind:template_message="config.template_message_captain_gift_convert"
					v-bind:music_play="music_play"
					v-on:music="music"
                ></get-right-now>
            </view>

			<view v-bind:style="{width: `100%`, height: `${BotHeight}rpx`}" v-if="navBool"></view>
		</view>
	</app-layout>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
	import pickGift from '../components/index/pick-gift.vue';
	import giftMethod from '../components/index/gift-method.vue';
	import blessingMessage from '../components/index/blessing-message.vue';
	import generatePackage from '../components/index/generate-package.vue';
	import giftNavigation from '../components/announcement/gift-navigation.vue';
	import appEmptyBottom from'../../../components/basic-component/app-empty-bottom/app-empty-bottom.vue';
    import getRightNow from '../components/index/get-right-now.vue';
	import voice from '../components/index/voice.vue';

    export default {
        name: 'index',

		data() {
			return {
                // 礼物购物车
                gift_list: [],
                // 总价
                totalPrice: 0,
				// 送礼方式
                method_type: 'direct_open',
				// 领取方式
                open_type: 0,
				// 领取人数
                open_num: null,
				// 开奖时间
                select_str: ``,
                // 打开时间
                open_time: ``,
                // 祝福语
                bless_word: ``,
                // 插件配置
                config: {},
				// 是否领取礼物
                is_gift: false,
				// 礼物id
                gift_id: -1,
				// 转增码
                turn_no: '',
				// 礼物
				gift: {},
                // #ifdef MP
                currentRoute:  this.$platDiff.route(),
                // #endif
                navBool: false,
				new_open_type: '',
				src: '',
                innerAudioContext: '',
				// 是否播放
				is_play: false,
				audio: {},
				recorderManager: null,
				music_play: false,
				bless_music: '',
				voice_i: 0,
				voice_time: -1
			}
		},

		onLoad(options) { this.$commonLoad.onload(options);
			if (!this.$user.isLogin()) {
				this.$user.getInfo().then(() => {
                    if (options.gift_id && options.user_id) {
                        this.gift_id = options.gift_id;
                        this.is_gift = true;
                        this.turn_no = options.turn_no;
                        this.getGift(this.gift_id);
                    }
				});
			} else {
			    if (options.gift_id && options.user_id) {
			        this.is_gift = true;
                    this.gift_id = options.gift_id;
                    this.turn_no = options.turn_no;
                    this.getGift(this.gift_id);
                } else if (options.pay_data) {
			        let gift_id = JSON.parse(options.pay_data).gift_id;
			        this.$request({
				        url: this.$api.gift.cancel,
				        data: {
				            gift_id: gift_id,
				        }
			        })
			    }
			}
			this.request();
			let self = this;
			// #ifdef MP
			this.recorderManager = uni.getRecorderManager({
				duration: 30000
			});
			this.innerAudioContext = uni.createInnerAudioContext();
			this.innerAudioContext.onEnded(function(res) {
				self.is_play = false;
				self.music_play = false;
			});
			this.innerAudioContext.onStop(function() {
			});
			this.innerAudioContext.autoplay = true;
			this.recorderManager.onStop(function (res) {
				uni.uploadFile({
					url: self.$api.upload.file,
					filePath: res.tempFilePath,
					name: 'file',
					fileType: 'audio',
					formData: {
						file: res.tempFilePath,
						file_name: ''
					},
					success(e) {
						let {code, data} = JSON.parse(e.data);
						self.bless_music = data.url;
					}
				})
				self.audio = res;
			});
			// #endif
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				menus: ['shareAppMessage', 'shareTimeline']
			})
			// #endif
		},

        onShow() {
            this.gift_list = this.$storage.getStorageSync(`GIFT_CART`);
            for (let i = 0; i < this.gift_list.length; i++) {
                this.gift_list[i].number = Number(this.gift_list[i].number);
                this.gift_list[i].total_cost =  parseFloat((this.gift_list[i].number * this.gift_list[i].price).toFixed(2));
            }
        },

		onUnload() {
			if (this.innerAudioContext) {
				this.music_play = false;
				this.is_play = false;
				this.innerAudioContext.stop();
			}
		},
		onHide() {
			if (this.innerAudioContext) {
				this.music_play = false;
				this.is_play = false;
				this.innerAudioContext.stop();
			}
		},
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                path: '/plugins/gift/index/index',
                title: this.config.ask_gift,
            });
        },
        // #endif
		// #ifdef MP-WEIXIN
		onShareTimeline() {
			// 分享朋友圈beta
			return this.$shareTimeline({
				title: this.config.ask_gift,
				query: {
				} // 此处填写页面的参数
			});
		},
		// #endif
		methods: {
            // 请求配置
            async request() {
	            this.$utils.showLoading();
                try {
                    const res = await this.$request({
                        url: this.$api.gift.config,
                        method: 'get',
                    });
                    this.$utils.hideLoading();
                    if (res.code === 0) {
						this.config = res.data;
						uni.setNavigationBarTitle({
							title: res.data.title,
						});
						let theme = '';
						switch (Number(res.data.theme.id)) {
							case 1:
								theme = 'streamer-gold-gift';
								break;
							case 2:
								theme = 'romantic-powder-gift';
								break;
							case 3:
								theme = 'taste-red-gift';
								break;
							case 4:
								theme = 'elegant-purple-gift';
								break;
							case 5:
								theme = 'fresh-green-gift';
								break;
							case 6:
								theme = 'business-blue-gift';
								break;
							default:
								theme = 'streamer-gold-gift';
						}
						this.$storage.setStorageSync('giftTheme', theme);
                        this.$store.commit('gift/setTheme', Number(res.data.theme.id));
                        this.$store.commit('gift/setGiftPic', res.data.big_gift_pic);
						this.method_type = this.config.type[0];
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: res.msg,
                        });
                    }
                } catch (e) {
                    this.$utils.hideLoading();
                    throw new Error(e);
                }
            },

            //加减礼物数量
            giftNumber({index, type}) {
                if (type) {
                    this.gift_list[index].number = this.gift_list[index].number + 1;
                } else {
                    this.gift_list[index].number = this.gift_list[index].number - 1;
                }
                this.changeNumber(index);
            },

			//input改变礼物数量
            giftInput({index, quantity}) {
                // 数量大于规格库存
                if (quantity >= this.gift_list[index].attr.stock) {
                    let gift  = JSON.parse(JSON.stringify(this.gift_list[index]));
                    gift.number = this.gift_list[index].attr.stock;
                    this.$set(this.gift_list, index, gift);
                    this.changeNumber(index);
                } else {
                    this.$set(this.gift_list[index], 'number', quantity);
                    this.changeNumber(index);
                }
            },


			// 改变数量
			changeNumber(index) {
                let { number, price } = this.gift_list[index];
                this.$set(this.gift_list[index], 'total_cost', parseFloat((number * price).toFixed(2)));
                if (this.gift_list[index].number === 0) {
                    this.$delete(this.gift_list, index);
                }
                this.$storage.setStorageSync('GIFT_CART', this.gift_list);
			},

			async submit() {
				this.$utils.showLoading();
				let form_data = [
					{
						mch_id: 0,
						type: this.method_type,
						open_num: this.open_num,
						open_time: this.open_time,
						bless_word: this.bless_word ? this.bless_word : this.config.bless_word,
						bless_music: this.bless_music,
						open_type: this.open_type,
						goods_list: [],
						remark: '',
						use_integral: 0,
						user_coupon_id: 0
					}
				];
				for (let i = 0; i < this.gift_list.length; i++) {
					let goods = {
						id: this.gift_list[i].attr.goods_id,
						attr: [],
						num: this.gift_list[i].number,
						cat_id: 0,
						goods_attr_id: this.gift_list[i].attr.id,
					};
					for (let j = 0; j < this.gift_list[i].attr.attr_list.length; j++) {
						goods.attr.push({
							attr_id: this.gift_list[i].attr.attr_list[j].attr_id,
							attr_group_id: this.gift_list[i].attr.attr_list[j].attr_group_id,
						})
					}
					form_data[0].goods_list.push(goods);
				}
				let data = {
					form_data: JSON.stringify({
						list: form_data,
					})
				};
				this.$store.commit('gift/setFormData', data);
				if (this.method_type === 'direct_open') {
					delete form_data[0].open_num;
					delete form_data[0].open_time;
				} else if (this.method_type === 'time_open') {
					delete form_data[0].open_num;
				} else if (this.method_type === 'num_open') {
					delete form_data[0].open_time;
				}
				this.$utils.hideLoading();

				uni.navigateTo({
					url: `/pages/order-submit/order-submit?preview_url=${encodeURIComponent(this.$api.gift.order_preview)}&submit_url=${encodeURIComponent(this.$api.gift.order_submit)}&pay_data_url=${encodeURIComponent(this.$api.gift.pay_data)}&show_pay_result=false&mch_list=${JSON.stringify(form_data)}&theme=${this.theme}&order_page_url=/plugins/gift/share/share&pay_cancel_url=/plugins/gift/index/index`
				});
			},

			// 生成礼物
            generatePackage() {
				this.submit();
            },

			// 设置方法
            set_methods(data) {
                this.method_type = data;
            },

			// 设置单人多人
            set_people_status(data) {
                this.open_type = data;
            },

			// 设置参与如数
            change_people(data) {
                this.open_num = data;
            },

			// 设置定时时间
            set_lottery_time(data, time) {
                this.select_str = data;
                this.open_time = time;
            },

			// 修改祝福语
            changeTextarea(data) {
                this.bless_word = data;
            },

			// 支付接口
            async pay_data(data) {
                try {
                    const res = await this.$request({
                        url: this.$api.gift.pay_data,
                        method: 'post',
                        data: {
                            ...data
                        },
                    });
                    if (res.code === 0) {
                        if (res.data.hasOwnProperty('id')) {
                            this.$payment.pay(res.data.id).then(() => {
                                // 支付成功
                                this.$storage.setStorageSync('GIFT_CART', []);
                                uni.redirectTo({
                                    url: `/plugins/gift/share/share?gift_id=${res.data.gift_id}`,
                                });
                            }).catch(() => {
                                // 支付失败
                            });
                            this.$utils.hideLoading();
                        } else {
                            setTimeout(() => {
                                this.pay_data(data);
                            }, 1000);
                        }
                    } else {
                        this.$utils.hideLoading();
                        uni.showModal({
                            title: '提示',
                            content: res.msg,
                        });
                    }
                } catch (e) {
                    this.$utils.hideLoading();
                    throw new Error(e);
                }
            },

            // 开启关闭领取礼物
            setGift(data) {
                this.is_gift = data;
            },

			async getGift(data) {
                this.$utils.showLoading();
                const res = await this.$request({
	                url: this.$api.gift.gift,
	                data: {
	                    gift_id: data,
	                }
                });
                if (res.code === 0) {
                    this.gift = res.data;
					this.wordYun(this.gift.list.bless_word);
                } else {
                    uni.showModal({
	                    title: '提示',
	                    content: res.msg,
                    })
                }
				this.$utils.hideLoading();
			},

            setNav() {
                let currentRoute = undefined;
                // #ifdef MP
                currentRoute = this.currentRoute;
                // #endif
                // #ifdef H5
                currentRoute = window.location.hash.split('#')[1].split('?')[0];
                // #endif
				if (!currentRoute) return;
                for (let i = 0; i < this.tabBarNavs.length; i++) {
                    if(currentRoute.includes(this.tabBarNavs[i].url.split('?')[0])) {
                        return this.navBool = true;
                    }
                }
                return  this.navBool = false;

            },

			play(status) {
				this.is_play = status;
                this.voice_i = 0;
				if (status) {
				    // #ifdef MP
					this.innerAudioContext.src = this.audio.tempFilePath;
                    this.innerAudioContext.play();
                    // #endif
                    // #ifdef H5
                    this.$jwx.playVoice({
                        localId: this.audio.localId
                    });
                    // #endif
				} else {
                    // #ifdef MP
					this.innerAudioContext.stop();
                    // #endif
                    // #ifdef H5
                    this.$jwx.stopVoice({
                        localId: this.audio.localId
                    });
                    // #endif
				}
			},

			recorder(status) {
				if (status) {
					clearInterval(this.voice_time);
					this.voice_i = 0;
					this.voice_time = setInterval(() => {
						this.voice_i++;
					}, 1000);
					// #ifdef MP
					this.recorderManager.start();
					// #endif
                    // #ifdef H5
                    this.$jwx.startRecord();
                    // #endif
				} else {
                    // #ifdef MP
	                this.recorderManager.stop();
                    // #endif
                    // #ifdef H5
                    let _this = this;
                    this.$jwx.stopRecord({
                        success(res) {
                            _this.audio = res;
                        }
                    });
                    // #endif
					clearInterval(this.voice_time);
				}
			},

			music(status, bless_music) {
				this.music_play = status;
				if (status) {
					this.innerAudioContext.src = bless_music;
                    this.innerAudioContext.play();
				} else {
					this.innerAudioContext.stop();
				}
			},

			close() {
				this.is_play = false;
				this.innerAudioContext.stop();
			}
		},

		watch: {
            gift_list: {
                handler(data) {
                    this.totalPrice = 0;
                    for (let i = 0; i < data.length; i++) {
                        this.totalPrice += data[i].total_cost;
                    }
                    this.totalPrice = this.totalPrice.toFixed(2);
                },
	            immediate: true,
	            deep: true,
            },
            tabBarNavs: {
                handler: function() {
                    this.setNav();
                },
                immediate: true,
            }
		},

		computed: {
			...mapState('gift',{
				theme: state => state.theme,
                big_gift_pic: state => state.big_gift_pic,
			}),
            ...mapState({
                tabBarNavs: state => state.mallConfig.navbar.navs,
            }),
            ...mapGetters('iPhoneX', {
                BotHeight: 'getNavHei',
            }),
		},

		components: {
			'pick-gift': pickGift,
			'gift-method': giftMethod,
			'blessing-message': blessingMessage,
			'generate-package': generatePackage,
			'gift-navigation': giftNavigation,
            'app-empty-bottom': appEmptyBottom,
            'get-right-now': getRightNow,
			'voice': voice
		},
    }
</script>

<style lang="scss">

	/* 首页 */
	.index {
		position: absolute;
		min-height: 100%;
		width: 100%;
		background-color: #f7f7f7;
	}

	/* 挑选礼物 */
	.pick-gift {

	}

	/* 送礼方式 */
	.gift-method {
		position: relative;
		top: -20upx;
	}

	/* 祝福留言 */
	.blessing-message {
		position: relative;
		top: -20upx;
	}

	/* 生成礼包 */
	.generate-package {
		position: relative;
		top: -20upx;
	}

	/* 导航 */
	.gift-navigation {}
</style>
