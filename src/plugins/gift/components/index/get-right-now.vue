<template>
	<view class="get-right-now">
		<view class="card dir-top-nowrap main-between cross-center">
			<view class="jump-card background-image"  @click="receiveGift">
				<image class="card-image" @load="is_text = true" :src="background.bg_pic"></image>
				<image class="avatar" :src="avatar"></image>
				<view class="avatar audio" @click.stop="play" v-if="bless_music">
					<image :src="music_play ? '../../image/play-big.png' : '../../image/stop-big.png'"></image>
				</view>
				<view class="font" v-show="is_text" :style="{color: background.color, top: `${Number(background.top)}px`, left: `${Number(background.left)}px`}">
					<view class="nickname">{{nickname}}</view>
					<view>送你一份礼物，快来领取吧</view>
					<view class="bless-word">{{bless_word}}</view>
				</view>
			</view>
			<image class="icon-close" src="./../../image/gift-close.png"  @click="setGift"></image>
		</view>
	</view>
</template>

<script>
	
    export default {
        name: 'figure-rule',

	    data() {
            return {
                is_text: false,
            }
	    },
        props: [`theme`, `gift_id`, `turn_no`, `background`, `bless_word`, `nickname`, `avatar`, `type`, `template_message`, `bless_music`, `music_play`],

	    methods: {
			setGift() {
				this.$emit('setGift', false);
			},

			async submit() {
				uni.showLoading({
					title: '获取中'
				});
				if (this.turn_no) {
					const res = await this.$request({
						url: this.$api.gift.get_turn,
						method: 'get',
						data: {
							turn_no: this.turn_no,
						}
					});
					if (res.code === 0) {
						let _this = this;
						uni.navigateTo({
							url: `/plugins/gift/receive/receive?gift_id=${this.gift_id}&status=1`,
							success() {
								_this.setGift();
							}
						})
					} else {
						uni.showModal({
							title: '提示',
							content: res.msg,
						});
						this.setGift();
					}
					uni.hideLoading();
				} else {
					const res = await  this.$request({
						url: this.$api.gift.join,
						method: 'get',
						data: {
							gift_id: this.gift_id
						}
					});
					if (res.code === 0) {
						this.loopAcquisition(res.data);
					} else {
						uni.showModal({
							title: '提示',
							content: res.msg,
						});
						this.setGift();
					}
				}
			},

			async receiveGift() {
				if (this.type !== 'direct_open') {
					this.$subscribe(this.template_message).then(() => {
						this.submit();
					}).catch(() => {
						this.submit();
					});
				} else {
					this.submit();
				}
				
			},

            loopAcquisition(data) {
			    this.$request({
				    url: this.$api.gift.join_status,
				    data: {
				        ...data,
                        gift_id: this.gift_id,
				    },
				    method: 'get',
			    }).then(res => {
                    if (res.code === 0) {
                        if (res.data.hasOwnProperty('list')) {
                            uni.hideLoading();
                            let _this = this;
                            uni.navigateTo({
                                url: `/plugins/gift/receive/receive?gift_id=${this.gift_id}&status=1`,
                                success() {
                                    _this.setGift();
                                }
                            });
                            return res.data;
                        } else {
                            setTimeout(() => {
                                this.loopAcquisition(data);
                            }, 1000);
                        }
                    } else if (res.code === 1) {
                        uni.hideLoading();
                        let status = 2;
                        if (this.type === 'direct_open') {
                            status = 2;
                        } else {
                            status = 3;
                        }
                        uni.navigateTo({
                            url: `/plugins/gift/receive/receive?gift_id=${this.gift_id}&status=${status}`
                        });
                        this.setGift();
                    }
			    });
            },

			play() {
				if (this.music_play) {
					this.$emit('music', false);
				} else {
					this.$emit('music', true, this.bless_music);
				}
			}
		}
    }
</script>

<style scoped lang="scss">
	@import '../../css/gift.scss';
	
	/* 广告图 规则 */
	.get-right-now {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1500;
		background-color: rgba(0,0,0,.3);
		.card {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: #{600upx};
			height: #{900upx};
			.card-image {
				width: #{600upx};
				height: #{800upx};
				position: absolute;
				top: 0;
				left: 0;
			}
			
			.icon-close {
				width: #{42upx};
				height: #{42upx};
				padding: #{8upx};
				margin-top: #{48upx};
			}

			.jump-card {
				width: #{600upx};
				height: #{800upx};
				position: relative;
				.avatar {
					width: #{128upx};
					height: #{128upx};
					position: absolute;
					top: #{126upx};
					left: 50%;
					transform: translateX(-50%);
					border-radius: 50%;
				}
				.audio {
					z-index: 1000;
					>image {
						width: 100%;
						height: 100%;
					}
				}
				.font {
					position: absolute;
					text-align: center;
					/*文字*/
					view {
						font-size: #{30upx};
						line-height: 1;
						white-space: nowrap;
					}
					/*用户名*/
					.nickname {
						margin-bottom: #{14upx};
					}
					/*祝福语*/
					.bless-word {
						margin-top: #{52upx};
					}
				}
			}
		}
	}
	
</style>