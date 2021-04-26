<template>
	<view class="gift-content">
        <view class="avatar" :style="{backgroundImage: `url(${avatar})`}" >
			<view class="ripple" v-if="bless_music"  :animation="animationData1"></view>
			<view class="ripple" v-if="bless_music"  :animation="animationData2"></view>
		</view>
		<image class="avatar" @click="play" v-if="bless_music" :src="is_play ? './../../image/play-big.png' : './../../image/stop-big.png'"></image>
        <view class="sender dir-left-nowrap main-center">
            <text class="who">{{nickname}}</text>
        </view>
        <view class="greetings">{{bless_word}}</view>
		<view class="goods" :class="[`${theme}-border`]">
			<image class="pic" :src=" is_big_gift === 0 ? cover_pic : big_gift_pic"></image>
			<view class="name" v-if="is_big_gift === 0">{{name}}</view>
		</view>
		<view class="automatic-refund">{{refund_time}}天内无人领取将自动退款</view>
		<view class="button dir-left-nowrap main-center">
			<navigator
	            url="/plugins/gift/index/index"
	            open-type="redirect"
				:class="[`item`,` again`,`${theme}-border`, `${theme}-color`, `${theme}-shadow`]"
			>
				再送一份
			</navigator>
			<button @click="share" :class="[`item`, `send`, `${theme}-background`, `${theme}-shadow`]">
				送给朋友
			</button>
		</view>
    </view>
</template>

<script>
    export default {
        name: 'gift-content',
	    
        props: [
			`theme`, `avatar`, `nickname`,
			`bless_word`, `is_big_gift`,
			`cover_pic`, `name`, `refund_time`,
			`big_gift_pic`, `bless_music`, `is_play`
		],
        
		data() {
			return {
				animationData1: '',
				animationData2: '',
				animationStatus: false
			}
		},
		
		methods: {
			share() {
                this.$emit('share');
            },
			animationFun:function(animationData){
                if(!this.animationStatus){
                    return;
                }
				let animation = uni.createAnimation({
                    duration: 1000
                })
                animation.opacity(0).scale(1.5,1.5).step(); 
                this[animationData] = animation.export();
            },
            animationEnd: function (animationData) {
				let animation = uni.createAnimation({
                    duration: 0
                })
                animation.opacity(1).scale(1, 1).step(); 
                this[animationData] = animation.export()
            },
            recodeEnd: function() {
                //动画1结束
                let animation1 = uni.createAnimation({
                    duration: 0
                })
                animation1.opacity(1).scale(1, 1).step(); 
                //动画2结束
				let animation2 = uni.createAnimation({
                    duration: 0
                })
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
                }, 1000);
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
			play() {
				if (this.is_play) {
					this.$emit('play', false);
				} else {
					this.start();
					this.$emit('play', true, this.bless_music);
				}
			},
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

    /*礼物内容*/
    .gift-content {
        width: calc(100% - #{48upx});
        height: 101%;
        background-color: #ffffff;
        border-radius: #{16upx};
        margin: #{0 24upx};
        position: relative;
        padding-top: #{80upx};
    }

    /*头像*/
    .avatar {
        width: #{96upx};
        height: #{96upx};
        border-radius: #{48upx};
        position: absolute;
        left: 50%;
	    background-repeat: no-repeat;
	    background-size: 100% 100%;
        transform: translate(-50%, #{-128upx});
    }
    
    /*送礼物者*/
    .sender {
        font-size: #{28upx};
        color: #353535;
        line-height: 1;
        margin: #{0 0 28upx 0};
        
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
    
	/*礼物*/
	.goods {
		width: #{400upx};
		padding: #{50upx 50upx 20upx 50upx};
		margin: #{64upx 151upx 32upx 151upx};
		border-width: #{1upx};
		border-style: solid;
		border-radius: #{16upx};
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
			word-break: break-all;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
			white-space: normal;
		}
	}
	
	/*自动退款*/
    .automatic-refund {
	    font-size: #{24upx};
	    line-height: 1;
	    margin-top: #{32upx};
	    color: #999999;
	    text-align: center;
    }
    
    /*按钮*/
    .button {
	    margin-top: #{72upx};
	    height: #{100upx};
	    width: 100%;
	    
	    .item {
		    width: #{280upx};
		    padding: 0;
		    margin: 0;
		    border-radius: #{58upx};
		    text-align: center;
		    font-size: #{32upx};
		    height: #{100upx};
		    line-height: #{100upx};
	    }
	    /*送给朋友*/
	    .send {
		    color: #ffffff;
		    margin-left: #{24upx};
	    }
	    /*再送一份*/
	    .again {
		    border-width: #{1upx};
		    border-style: solid;
		    margin-right: #{24upx};
		    background-color: #ffffff;
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