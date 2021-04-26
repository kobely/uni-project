<template>
	<view class="gift-content" :class="[`${small ? 'receive-content-big' : 'receive-content-small'}`, `${bless_music && gift_status != 0 ? 'blessing-content' : ''}`]">
		<view class="voice-blessing" v-if="gift_status != 0 && bless_music">
			<view class="text">听听他的语音祝福</view>
			<view class="angle"></view>
		</view>
        <view class="avatar-image" :style="{backgroundImage: `url(${avatar})`}" >
			<view class="ripple" v-if="bless_music"  :animation="animationData1"></view>
			<view class="ripple" v-if="bless_music"  :animation="animationData2"></view>
		</view>
		<image class="avatar-image" @click="play" v-if="bless_music" :src="is_play ? './../../image/play-big.png' : './../../image/stop-big.png'"></image>
        <view class="sender dir-left-nowrap main-center">
            <text class="who">{{nickname}}</text>
        </view>
        <view class="greetings">{{bless_word}}</view>

		<view class="goods-content">
			<view class="goods" :class="[`${theme}-border`]">
				<image class="pic" :src="is_big_gift | getPicUrl(goods_info, cover_pic, big_gift_pic)"></image>
				<view class="name t-omit" v-if="is_big_gift === 0">{{name}}</view>
				<view class="status" :class="[`${theme}-background`]" v-if="status">
					<text>
						{{status}}
					</text>
				</view>
			</view>
			<button class="invite-friends" open-type="share" v-if="type === 'num_open' && open_status === 0 && gift_status != 0">
				<image :class="[`${theme}-background`]"  src="../../image/invite-friends.png"></image>
			</button>
		</view>
		
		<!-- 礼物领取情况 -->
		<view class=" gift-over" v-if="open_status !== 0 && winUser.length > 0">
			<gift-over :is_status="is_status" :type="type" :userOrder="userOrder" :open_type="open_type" :num="num" :win_time="win_time" :winUser="winUser"></gift-over>
		</view>

		<!-- 参与者 -->
		<view class="participant" v-if="type !== 'direct_open' && open_status === 0">
			<participant :userOrder="userOrder"></participant>
		</view>

		<view class="button dir-left-nowrap main-center" v-if="gift_status != 0 && address_status == 1">
			<view @click="routeAddress()" class="but again" :class="[`${theme}-border`, `${theme}-color`, `${theme}-shadow`]">
				填写地址
			</view>
			<view class="but send"  @click="routeGo" :class="[`${theme}-background`, `${theme}-shadow`]">我也要送礼物</view>
		</view>

		<view v-if="(gift_status == 1 || gift_status == 2) && address_status == 0" @click="routeGo" class="metoo" :class="[`${theme}-background`, `${theme}-shadow`]" >我也要送礼物</view>

		<view class="button dir-left-nowrap main-center" v-if="gift_status == 0 && win_goods_status != 3 && win_goods_status != 1">
			<view @click="routeGo" class="but again" :class="[`${theme}-border`, `${theme}-color`, `${theme}-shadow`]">
				再送一份
			</view>
			<view class="but send" @click="shareBool = true" :class="[`${theme}-background`, `${theme}-shadow`]">送给朋友</view>
		</view>
		
		<view v-else-if="gift_status == 0" class="metoo"  @click="routeGo" :class="[`${theme}-background`, `${theme}-shadow`]"  >再送一份</view>

		<!-- 分享海报 -->
		<view class="page-width share-poster">
			<app-share-qr-code-poster @share="testShare" :url="url" v-model="shareBool"></app-share-qr-code-poster>
		</view>
    </view>
</template>

<script>
	
	import giftOver from './gift-over.vue';
	import participant from './participant.vue';
    import appShareQrCodePoster from '../../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
	
    export default {

        name: 'gift-content',
		
	    data() {
            return {
                shareBool: false,
				animationData1: null,
				animationData2: null,
				animationStatus: false,
            }
	    },
        props: [
            `theme`,
	        `avatar`,
	        `nickname`,
	        `bless_word`,
	        `is_big_gift`,
	        `cover_pic`, `name`,
	        `status`, `type`, `num`, `userOrder`, `open_type`, `open_status`,
	        `winUser`, `gift_status`,
	        `gift_id`,
	        `win_goods_status`,
	        `small`,
	        `is_status`,
	        `win_time`,
	        `goods_info`,
	        `big_gift_pic`,
			`address_status`,
			`user_id`,
			`bless_music`,
			`is_play`
        ],
        
        methods: {
            share() {
                this.$emit('share');
            },
	        
	        routeGo() {
                uni.navigateTo({
	                url: `/plugins/gift/index/index`
                })
	        },

			routeAddress() {
				let id = 0;
				for (let i = 0; i < this.userOrder.length; i++) {
					if (this.userOrder[i].user_id  == this.user_id) {
						id = this.userOrder[i].id;
					}
				}
				let status = 0;
				if (this.type === 'num_open' || this.type === 'time_open') {
					status = 2;
				} else if (this.type === 'direct_open') {
					status = 1;
				}
				uni.navigateTo({
					url: `/plugins/gift/address/address?status=${status}&id=${id}`
				})
			},

			play() {
				if (this.is_play) {
					this.$emit('play', false);
				} else {
					this.start();
					this.$emit('play', true, this.bless_music);
				}
			},

			animationFun:function(animationData){
                if(!this.animationStatus){
                    return;
                }
				let animation = uni.createAnimation({
                    duration: 1000
                });
                animation.opacity(0).scale(1.5,1.5).step(); 
                this[animationData] = animation.export();
            },
            animationEnd: function (animationData) {
				let animation = uni.createAnimation({
                    duration: 0
                });
                animation.opacity(1).scale(1, 1).step(); 
                this[animationData] = animation.export()
            },
            recodeEnd: function() {
                //动画1结束
                let animation1 = uni.createAnimation({
                    duration: 0
                });
                animation1.opacity(1).scale(1, 1).step(); 
                //动画2结束
				let animation2 = uni.createAnimation({
                    duration: 0
                });
                animation2.opacity(1).scale(1, 1).step(); 
                this.animationData1 = animation1.export();
                this.animationData2 = animation2.export();
                this.animationStatus = false;
            },
            recodeClick: function() {
                this.animationStatus = true;
                this.animationFun('animationData1');
                setTimeout(()=>{
                    this.animationFun('animationData2');
                },500);
                setTimeout(() => {
                    this.animationRest();
                }, 1000)
            },
            testShare:function(e){
              this.$emit('share', e);
            },
            animationRest: function() {
                this.animationEnd('animationData1');
                setTimeout(()=>{
                    this.animationEnd('animationData2');
                },500);
                setTimeout(() => {
                    if (this.animationStatus) {
                        this.recodeClick();
                    }
                }, 100);
            },
            start() {
                this.recodeClick();
            },
            end() {
                this.recodeEnd();
            },
		},
		computed: {
            url() {
                return `${this.$api.gift.poster}&gift_id=${this.gift_id}`
            }
		},

        filters: {
            getPicUrl(data, goods_info, cover_pic, big_gift_pic) {
                if (data === 0) {
                    let goods_attr = JSON.parse(goods_info).goods_attr;
                    return goods_attr.pic_url ? goods_attr.pic_url : cover_pic;
                } else {
                    return big_gift_pic;
                }
            }
	    },
		components: {
			'gift-over': giftOver,
			'participant': participant,
            'app-share-qr-code-poster': appShareQrCodePoster,
		},

		watch: {
			is_play: {
				handler(data) {
					if (!data) {
						this.end();
					}
				}
			}
		}
    }
</script>

<style scoped lang="scss">
    @import "../../css/gift.scss";

    .receive-content-big {
	    min-height: 100% - #{260upx};
    }

    .receive-content-small {
	    min-height: 100% - #{210upx};
    }
    
    /*礼物内容*/
    .gift-content {
        width: 100% - #{48upx};
        background-color: #ffffff;
        border-radius: #{16upx};
        margin: #{104upx 24upx 0 24upx};
        padding-top: #{78upx};
	    position: absolute;
    }
	.blessing-content {
		margin: #{134upx 24upx 0 24upx};
	}
    /*头像*/
    .avatar-image {
        width: #{96upx};
        height: #{96upx};
        border-radius: #{48upx};
        position: absolute;
        left: 50%;
	    background-size: 100% 100%;
	    background-repeat: no-repeat;
        transform: translate(-50%, #{-128upx});
    }
    
    /*送礼物者*/
    .sender {
        font-size: #{28upx};
        color: #353535;
        margin: #{0 0 26upx 0};
        line-height: 1.7;
        text.who {
            max-width: #{336upx};
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            white-space: normal !important;
        }
    }

    /*祝福语*/
    .greetings {
        font-size: #{32upx};
        color: #353535;
        text-align: center;
        line-height: 1;
        margin-bottom: #{64upx};
    }
    .goods-content {
		position: relative;
		.invite-friends {
			width: #{88upx};
			height: #{88upx};
			position: absolute;
			right: #{32upx};
			bottom: #{-44upx};
			border: none;
			padding: 0;
			margin: 0;
			image {
				width: #{88upx};
				height: #{88upx};
			}
		}
	}
	/*礼物*/
	.goods {
		position: relative;
		width: #{400upx};
		padding: #{50upx 50upx 20upx 50upx};
		margin: #{64upx 151upx 32upx 151upx};
		border-width: #{1upx};
		border-style: solid;
		border-radius: #{16upx};
		overflow: hidden;
		.status {
			width: #{198upx};
			height: #{198upx};
			position: absolute;
			top: 0;
			left: 0;
			transform: translate(-50%, -50%) rotate(45deg);
			text {
				position: absolute;
				font-size: #{28upx};
				color: #ffffff;
				top: 50%;
				right: 0;
				transform: translate(10%, -50%) rotate(-90deg);
			}
		}
		
		/*图片*/
		.pic {
			width: #{300upx};
			height: #{300upx};
			margin-bottom: #{30upx};
		}
		/*名字*/
		.name {
			width: #{300upx};
			margin-bottom: #{22upx};
			font-size: #{28upx};
			color: #353535;
			text-align: center;
		}
	}
	
	.gift-over {
		width: #{638upx};
		margin: #{72upx 32upx 0 32upx};
	}

	.participant {
		width: #{638upx};
		margin: #{72upx 32upx 0 32upx};
	}

	.metoo {
		font-size: #{32upx};
		line-height: #{100upx};
		color: #ffffff;
		text-align: center;
		border-radius: #{58upx};
		position: fixed;
		bottom: #{88upx};
		width: #{400upx};
		height: #{100upx};
		left: 50%;
		transform: translateX(-50%);
		z-index: 1500;
	}
	.button {
		width: 100% - #{48upx};
		position: fixed;
		bottom: #{88upx};
		z-index: 1500;
		.but {
			font-size: #{32upx};
			line-height: 1;
			padding: #{36upx 77upx};
			border-radius: #{58upx};
		}
		.again {
			margin-right: #{24upx};
			border-width: #{1upx};
			border-style: solid;
			background-color: #ffffff;
		}
		
		.send{
			margin-left: #{24upx};
			color: #ffffff;
		}
	}
	.voice-blessing {
		position: absolute;
        left: 50%;
        transform: translate(-50%, #{-192upx});
		width: #{238upx};
		height: #{56upx};
		.text {
			width: #{238upx};
			height: #{48upx};
			text-align: center;
			line-height: #{48upx};
			font-size: #{24upx};
			color: #353535;
			background-color: #ffffff;
			border-radius: #{24upx};
		}
		.angle {
			width: #{15upx};
			border-width: #{8upx};
			border-style: solid;
			border-top-color: #ffffff;
			border-bottom-color: transparent;
			border-left-color: transparent;
			border-right-color: transparent;
			position: relative;
			left: 50%;
			bottom: 0;
			transform: translateX(-50%);
		}
	}
	.ripple{
        position: absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        border-radius: 50%;
		border: #{2upx} solid #ffffff;
    }
</style>