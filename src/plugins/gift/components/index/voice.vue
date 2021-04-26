<template>
    <view class="voice">
        <button class="adjunction dir-left-nowrap cross-center" @click="open()" v-if="Object.keys(audio).length === 0">
            <view class="recording"></view>
            <view class="text">添加语音祝福</view>
        </button>
        <view class="audio dir-left-nowrap cross-center" v-else>
            <view class="btn" @click="playaudio" :class="[is_play ? 'btn-pause' : 'btn-play']"></view>
            <view class="duration">{{voice_i}}″</view>
            <view class="close" @click="close()"></view>
        </view>
        <view class="black" v-if="start_tran" @click.stop="start_tran = false">
            <view class="mouldboard dir-top-nowrap cross-center"  @click.stop>
                <view class="voice-num">{{voice_i | second}}</view>
                <view class="transcription" :class="[`${theme}-background`]" @touchstart="start" @touchend="end">
                    <image :src="animationStatus ? '../../image/transcriptioning.png' : '../../image/transcription.png'" class="image"/>
                    <view class="ripple" :class="[`${theme}-border`]" :animation="animationData1"></view>
                    <view class="ripple" :class="[`${theme}-border`]" :animation="animationData2"></view>
                </view>
                <view class="active-text">{{animationStatus ? '松开停止录音' : '长按开始录音'}}</view>
            </view>
        </view>
    </view>
</template>

<script>

    export default {

        name: 'voice',
	    
		props: [`theme`, `is_play`, `audio`, `voice_i`],

		data() {
            return {
                animationData1: '',
                animationData2: '',
                animationStatus: false,
                manager: null,
                start_tran: false,
            }
		},
		
		watch: {
            voice_i: {
                handler(data) {
                    if (data >= 30) {
                        this.end();
                    }
                },
            }
        },
		
	    methods: {
            animationFun:function(animationData){
                if(!this.animationStatus){
                    return;
                }
                var animation = uni.createAnimation({
                    duration: 1000
                })
                animation.opacity(0).scale(1.5,1.5).step(); 
                this[animationData] = animation.export();
            },
            animationEnd: function (animationData) {
                var animation = uni.createAnimation({
                    duration: 0
                })
                animation.opacity(1).scale(1, 1).step(); 
                this[animationData] = animation.export()
            },
            recodeEnd: function() {
                //动画1结束
                var animation1 = uni.createAnimation({
                    duration: 0
                })
                animation1.opacity(1).scale(1, 1).step(); 
                //动画2结束
                var animation2 = uni.createAnimation({
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
                },500)
                setTimeout(() => {
                    this.animationRest();
                }, 1000)
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
                this.$emit('recorder', true);
            },
            end() {
                this.recodeEnd();
                this.$emit('recorder', false);
                this.start_tran = false;
            },
            playaudio() {
                if (this.is_play) {
                    this.$emit('play', false);
                } else {
                    this.$emit('play', true);
                }
            },
            open() {
                let self = this;
                // #ifdef MP
                wx.getSetting({
                    success(res) {
                        if (!res.authSetting['scope.record']) {
                            wx.authorize({
                                scope: 'scope.record',
                                success () {
                                    self.start_tran = true;
                                    self.$emit('click');
                                },
                                fail(e) {
                                    wx.showModal({
                                        title: '提示',
                                        content: '您未授权录音，功能将无法使用',
                                        showCancel: true,
                                        confirmText: "授权",
                                        confirmColor: "#52a2d8",
                                        success() {
                                            wx.openSetting({
                                                success: (res) => {
                                                    if (!res.authSetting['scope.record']) {
                                                        
                                                    } else {
                                                        self.start_tran = true;
                                                        self.$emit('click');
                                                    }
                                                },
                                                fail(e) {
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            self.start_tran = true;
                            self.$emit('click');
                        }
                    },
                    fail(e) {
                    }
                });
                // #endif
                // #ifdef H5
                self.start_tran = true;
                // #endif
            },
            close() {
                this.audio = {}
                this.$emit('close');
            }
        },

        filters: {
            second(data) {
                if (data < 10) {
                    return '00:0' + data;
                } else {
                    return '00:' + data;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../css/gift.scss';
    .audio {
        height: #{80upx};
        width: #{376upx};
        border-radius: #{40upx};
        margin-left: #{24upx};
        padding: 0;
        background-color: #49c265;
    }
    .btn {
        width: #{96upx};
        height: #{80upx};
        padding: #{16upx 32upx 16upx 16upx};
        background-repeat: no-repeat;
        background-size: 52% 60%;
        background-position: center #{16upx};
    }
    .btn-play {
        background-image: url('../../image/play.png');
    }
    .btn-pause {
        background-image: url('../../image/pause.png');
    }
    .duration {
        width: #{210upx};
        text-align: right;
        font-size: #{30upx};
        color: #ffffff;
        padding-right: #{28upx};
        border-right: #{1upx} solid #ffffff;
        height: #{30upx};
        line-height: #{30upx};
    }
    .close {
        width: #{48upx};
        height: #{80upx};
        padding: #{30upx 28upx 30upx 28upx};
        background-image: url('../../image/close.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 41.6% 25%;
    }
    .adjunction {
        height: #{80upx};
        width: #{278upx};
        line-height: #{80upx};
        background-color: #ffffff;
        border-radius: #{40upx};
        margin-left: #{24upx};
        margin-bottom: #{56upx};
        padding: 0;
    }

    .text {
        font-size: #{28upx};
        color: #666666;
        margin-left: #{8upx};
    }

    .recording {
        width: #{32upx};
        height: #{32upx};
        margin-left: #{32upx};
        background-repeat: no-repeat;
        background-image: url('../../image/recording.png');
        background-size: 100% 100%;
    }
   
    .black {
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1600;
        background-color: rgba(0,0,0,.5);
    }
    .mouldboard {
        width: #{750upx};
        height: #{480upx};
        background-color: #ffffff;
        position: absolute;
        bottom: 0;
        border-top-right-radius: #{16upx};
        border-top-left-radius: #{16upx};
    }
    .transcription {
        width: #{200upx};
        height: #{200upx};
        border-radius: 50%;
        margin-top: #{50upx};
        position: relative;
    }
    .active-text {
        margin-top: #{48upx};
        font-size: #{28upx};
        color: #999999;
    }
    .image {
        width: #{110upx};
        height: #{110upx};
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .ripple{
        position: absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        border-radius: 50%;
    }
    
    .voice-num {
        font-size: #{30upx};
        margin-top: #{50upx};
        color: #353535;
        font-family: 'DIN';
    }
</style>