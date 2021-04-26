<template>
    <view class="app-layout">
        <app-layout :haveBackground="false">
            <view class="pond">
                <view class="pond-head"
                      :style="{'background-image': `url(${ setting.bg_pic})`}">
                    <view class="p-b" @click="rules">规则</view>
                    <view class="p-b" @click="share">分享</view>
                    <app-share-qr-code-poster @share="hShareAppMessage"
                                               v-model="shareShow" :url="poster" title="生成海报"></app-share-qr-code-poster>
                </view>
                <view class="pond-oppty">
                    <view>您还有
                        <text>{{ oppty }}</text>
                        次抽奖机会
                    </view>
                </view>
                <view class="pond-box"
                      :style="{height: 'calc(100vh - 480rpx - '+ ` ${platHeight} `+'  - ' + `${bottomHeight}` + 'rpx)',
                      background: 'linear-gradient(' + setting.bg_color +', '+ (setting.bg_color_type === 'gradient' ? setting.bg_gradient_color: setting.bg_color) + ')'}">
                    <view class="container-out">
                        <view
                            :style="{top: v.topCircle, left: v.leftCircle, background: i%2 === 0 ? colorCircleFirst : colorCircleSecond}"
                            class="container-circle" v-for="(v,i) in circleList" :key="i"></view>
                        <view class="container-in">
                            <view
                                :style="{top: v.topAward, left: v.leftAward, background: i == indexSelect ? colorAwardSelect : colorAwardDefault}"
                                class="content-out" v-for="(v,i) in awardList" :key="i">
                                <image class="img" :src="v.image_url" mode="aspectFit" load-lazy></image>
                                <view class="name">{{ v.name }}</view>
                            </view>
                            <view class="start-btn" @click="startGame">
                                <image class="pond-start1" src="./../image/pond-button.png" load-lazy></image>
                                <block v-if="setting.deplete_integral_num > 0">
                                    <view class="pond-start2" :animation="animationData">
                                        <image src="./../image/pond-register.png" load-lazy></image>
                                    </view>
                                    <view class="main-center pond-register">
                                        <view :animation="animationData">
                                            -{{ setting.deplete_integral_num }}积分
                                        </view>
                                    </view>
                                </block>
                                <image v-else class="pond-start3" src="./../image/pond-start.png"
                                       :animation="animationData" load-lazy></image>
                            </view>
                        </view>
                    </view>
                    <view class="dir-left-nowrap main-center cross-center end">
                        <view @click="home" class="dir-left-nowrap cross-center box-grow-0 left">
                            <icon class="end-icon home" type></icon>
                            <view>回到首页</view>
                        </view>
                        <view @click="prize" class="dir-left-nowrap cross-center box-grow-0">
                            <view>我的中奖记录</view>
                            <icon class="end-icon price" type></icon>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 活动弹窗 -->
            <view v-if="status==2">
                <view class="act-modal">
                    <view class="act-modal-bg"></view>
                    <view class="act-modal-pic cross-center main-center">
                        <view class="act-modal-info success">
                            <icon class="image-bg" :style="{'background-image': `url(${appImg.pond_success})`}"> type></icon>
                            <view @click="closeActModal">
                                <icon class="image-close" type></icon>
                            </view>
                            <view class="main-center h5-limit">
                                <text class="text">恭喜\n抽中{{ name }}</text>
                            </view>
                            <view class="main-center">
                                <view class="box main-center">
                                    <app-button @click="closeActModal" color="#FFFFFF" background="#FF4544"
                                                font-size="32"
                                                border-color="#FF4544"
                                                height="80" width="480"
                                                round>继续抽奖
                                    </app-button>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <view v-if="status==1">
                <view class="act-modal show">
                    <view class="act-modal-bg"></view>
                    <view class="act-modal-pic cross-center main-center">
                        <view class="act-modal-info error">
                            <icon class="image-bg" :style="{'background-image': `url(${appImg.pond_empty})`}"> type></icon>
                            <view @click="closeActModal">
                                <icon class="image-close" type></icon>
                            </view>
                            <view class="main-center">
                                <text class="text">谢谢参与\n再换个姿势抽奖</text>
                            </view>
                            <view class="main-center">
                                <view class="box main-center">
                                    <app-button @click="closeActModal" color="#FFFFFF" background="#FF4544"
                                                font-size="32"
                                                border-color="#FF4544"
                                                height="80" width="480"
                                                round>继续抽奖
                                    </app-button>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

        </app-layout>
    </view>
</template>

<script>
import appShareQrCodePoster from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster';

import {mapGetters, mapState} from 'vuex';

export default {
    name: "index",
    components: {appShareQrCodePoster},
    computed: {
        ...mapState({
            tabBarNavs: state => state.mallConfig.navbar.navs,
            appImg: state => state.mallConfig.plugin.pond.app_image,
            userInfo: state => state.user.info,
        }),
        ...mapGetters('iPhoneX', {
            BotHeight: 'getBotHeight',
            getEmpty: 'getEmpty',
        }),
        platHeight() {
            return "0px";
        },
        bottomHeight() {
            let s = this.tabBarNavs.find(item => {
                let currentRoute = '/plugins/pond/index/index';
                if (currentRoute.includes(item.url.split('?')[0])) {
                    return true;
                }
                return false;
            })
            if (s) {
                return this.BotHeight;
            } else {
                return 0;
            }
        },
    },
    data() {
        let bout, btn, animation;
        return {
            bout,
            btn,
            animation,
            circleList: [], //圆点数组
            awardList: [], //奖品数组
            colorCircleFirst: '#F12416', //圆点颜色1
            colorCircleSecond: '#FFFFFF', //圆点颜色2
            colorAwardDefault: '#F5F0FC', //奖品默认颜色
            colorAwardSelect: '#FFE400', //奖品选中颜色
            indexSelect: 0, //被选中的奖品index
            prizeIndex: 0, //奖品index
            isRunning: false, //是否正在抽奖,

            animationData: {},
            status: 0,
            setting: {},
            oppty: 0,
            msg: '', //提示文字
            name: '',//奖品名称
            //海报参数
            poster: this.$api.pond.poster,
            shareShow: false,
        }
    },
    // #ifdef MP-WEIXIN
    onLoad(options) { this.$commonLoad.onload(options);
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
    },

    onShareTimeline() {
        return this.$shareTimeline({
            title: this.$children[0].navigationBarTitle,
            query: {}
        });
    },
    // #endif
    onShow: function () {
        const self = this;
        self.$showLoading({title: '加载中'});
        self.$request({
            url: this.$api.pond.index,
        }).then(info => {
            self.$hideLoading();
            if (!info.data) {
                uni.showToast({title: info.msg, icon: 'none'});
                return;
            }

            self.oppty = info.data.oppty;
            self.msg = info.msg;
            self.setting = info.data.setting;

            let list = info.data.list;
            let topAward = 18;
            let leftAward = 18;
            for (let j = 0; j < 8; j++) {
                if (j === 0) {
                    topAward = 18;
                    leftAward = 18;
                } else if (j < 3) {
                    leftAward = leftAward + 196 + 8;
                } else if (j < 5) {
                    topAward = topAward + 158 + 8;
                } else if (j < 7) {
                    leftAward = leftAward - 196 - 8;
                } else if (j < 8) {
                    topAward = topAward - 158 - 8;
                }
                list[j].topAward = topAward + 'rpx';
                list[j].leftAward = leftAward + 'rpx';
            }
            self.awardList = list;
            //动画
            self.boutAnimation();
            self.btnAnimation();
        }).catch(e => {
            self.$hideLoading();
        });
    },
    onHide: function () {
        clearInterval(this.bout);
        clearInterval(this.btn);
    },
    // #ifdef MP
    onShareAppMessage() {
        this.hShareAppMessage();
    },
    // #endif
    methods: {
        hShareAppMessage(s = false){
            return this.$shareAppMessage({
                title: this.$children[0].navigationBarTitle,
                path: '/plugins/pond/index/index',
                params: {}
            }, s);
        },
        home() {
            uni.redirectTo({url: `/pages/index/index`});
        },
        prize() {
            uni.navigateTo({url: `/plugins/pond/prize/prize`});
        },
        rules() {
            uni.navigateTo({
                url: `/pages/rules/index?url=${encodeURIComponent(this.$api.pond.setting)}&keys=${JSON.stringify(['setting', 'rule'])}`,
            });
        },
        share() {
            this.shareShow = true;
        },

        //开始抽奖
        startGame: function () {
            const self = this;
            if (self.isRunning) return
            if (self.msg) {
                uni.showToast({title: self.msg, icon: 'none'});
                self.isRunning = false;
                return;
            }

            clearInterval(self.btn);
            self.animation.translate(0, 0).step();
            self.animationData = self.animation.export();

            self.isRunning = true;
            self.prizeIndex = 0;
            //循环
            let i = 0;
            let indexSelect = self.indexSelect;
            let list = self.awardList;
            let timer = setInterval(() => {
                i += 30;
                indexSelect++;
                indexSelect = indexSelect % 8;
                self.indexSelect = indexSelect;

                if (self.prizeIndex > 0 && indexSelect + 1 == self.prizeIndex) {
                    clearInterval(timer);
                    self.btnAnimation();
                    self.isRunning = false;
                    self.name = list[indexSelect].name;
                    self.status = list[indexSelect].type == 5 ? 1 : 2;
                }
            }, (200 + i))

            self.$request({
                url: self.$api.pond.lottery,
            }).then(info => {
                if (info.code === 0) {
                    list.map((item, index, array) => {
                        if (item.id == info.data.id) {
                            setTimeout(() => {
                                self.prizeIndex = index + 1;
                                self.oppty = info.data.oppty;
                                self.msg = info.msg;
                            }, 2000)
                        }
                    });
                    return;
                }
                clearInterval(timer);
                uni.showToast({title: info.msg, icon: 'none'});
                self.isRunning = false;
                self.btnAnimation();
            }).catch(info => {
                clearInterval(timer);
                self.isRunning = false;
                self.btnAnimation();
            })
        },

        //圆点设置
        boutAnimation: function () {
            const self = this;
            let leftCircle = 4;
            let topCircle = 4;
            let circleList = [];
            for (let i = 0; i < 24; i++) {
                if (i === 0) {
                    topCircle = 8;
                    leftCircle = 8;
                } else if (i < 6) {
                    topCircle = 4;
                    leftCircle = leftCircle + 110;
                } else if (i === 6) {
                    topCircle = 8
                    leftCircle = 660;
                } else if (i < 12) {
                    topCircle = topCircle + 92;
                    leftCircle = 663;
                } else if (i === 12) {
                    topCircle = 545;
                    leftCircle = 660;
                } else if (i < 18) {
                    topCircle = 550;
                    leftCircle = leftCircle - 110;
                } else if (i === 18) {
                    topCircle = 545;
                    leftCircle = 10;
                } else if (i < 24) {
                    topCircle = topCircle - 92;
                    leftCircle = 5;
                } else {
                    return
                }
                circleList.push({topCircle: topCircle + 'rpx', leftCircle: leftCircle + 'rpx'});
            }
            self.circleList = circleList;
            //圆点闪烁
            self.bout = setInterval(() => {
                const temp = self.colorCircleFirst;
                self.colorCircleFirst = self.colorCircleSecond;
                self.colorCircleSecond = temp;
            }, 900)
        },

        btnAnimation: function () {
            const self = this;
            let animation = uni.createAnimation({
                duration: 500,
                timingFunction: "step-start",
                delay: 0,
                transformOrigin: "50% 50%",
            });
            self.animation = animation;
            let sentinel = true;
            self.btn = setInterval(() => {
                if (sentinel) {
                    animation.translate(0, 0).step();
                    sentinel = false;
                } else {
                    animation.translate(0, -3).step();
                    sentinel = true;
                }
                self.animationData = animation.export();
            }, 900)
        },

        closeActModal() {
            this.status = 0;
        },
    }
}
</script>

<style scoped lang="scss">
.app-layout {
    min-height: 100vh;
}

.app-layout /deep/ .app-layout {
    min-height: 100vh;
}

.pond {
    text-align: center;

    .pond-box {
        min-height: #{700rpx};
        padding-top: #{20rpx};
    }

    .pond-head {
        height: #{480rpx};
        width: #{100%};
        background-repeat: no-repeat;
        //#ifdef H5
        margin-bottom: #{-1px};
        //#endif
        background-size: 100% 100%;

        .p-b {
            color: #FFFFFF;
            font-size: $uni-font-size-weak-one;
            background: #000000;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.4);
            line-height: #{48rpx};
            width: #{92rpx};
            border-radius: #{24rpx} 0 0 #{24rpx};
            position: absolute;
            right: 0;
            top: #{40rpx};
        }

        .p-b:nth-child(2) {
            top: #{112rpx}
        }
    }

    .pond-oppty {
        line-height: #{56rpx};
        font-size: #{28rpx};
        position: absolute;
        text-align: center;
        width: 100vw;
        top: #{450rpx};

        view {
            color: #ffffff;
            padding: 0 #{30rpx};
            display: inline-block;
            background: rgba(0, 0, 0, 0.3);
            border-radius: #{28rpx};
        }

        text {
            color: #ffb92a;
        }
    }

    /**小圆球 **/
    .container-out {
        height: #{566rpx};
        width: #{680rpx};
        background-color: #F47915;
        margin: #{32rpx} auto #{30rpx} auto;
        border-radius: #{16rpx};
        position: relative;
    }

    .container-in {
        width: #{640rpx};
        height: #{526rpx};
        background-color: #f12416;
        border-radius: #{20rpx};
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;

    }

    .container-circle {
        position: absolute;
        display: block;
        border-radius: 50%;
        height: #{15rpx};
        width: #{15rpx};
    }

    .content-out {
        position: absolute;
        height: #{144rpx};
        width: #{196rpx};
        background-color: #f5f0fc;
        border-radius: #{16rpx};
        box-shadow: 0 #{16rpx} 0 #FFCEC0;

        .img {
            position: absolute;
            top: #{12rpx};
            left: 50%;
            margin-left: #{-75rpx};
            width: #{150rpx};
            height: #{80rpx};
            z-index: 1;
        }

        .name {
            position: absolute;
            bottom: 0;
            top: #{24rpx + 80rpx};;
            color: #c62015;
            font-size: #{24rpx};
            width: #{196rpx};

            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            line-height: 1.5;
        }
    }

    /****/
    .pond-start1 {
        height: #{160rpx};
        width: 100%;
    }

    .pond-start2 {
        display: inline;
        position: absolute;
        left: #{10rpx};
        height: #{136rpx};
        width: #{178rpx};
    }

    .pond-start2 image {
        height: 100%;
        width: 100%;
    }

    .pond-start3 {
        position: absolute;
        left: #{10rpx};
        height: #{136rpx};
        width: #{178rpx};
    }

    .pond-register {
        position: absolute;
        top: #{84rpx};
        width: 100%;

        view {
            font-size: #{26rpx};
            padding: 0 #{16rpx};
            border-radius: #{16rpx};
            line-height: #{32rpx};
            background: #fff4ba;
        }
    }

    .start-btn {
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border-radius: #{16rpx};
        height: #{159rpx};
        width: #{196rpx};
        color: #f6251e;
        text-align: center;
        font-weight: bolder;
        line-height: #{154rpx};
    }

    .end {
        color: #FFFFFF;
        font-size: #{28rpx};

        .left {
            margin-right: #{160rpx};
        }

        .end-icon {
            background-repeat: no-repeat;
            background-size: 100% 100%;
            margin: 0 #{16rpx};
        }

        .end-icon.home {
            height: #{30rpx};
            width: #{30rpx};
            background-image: url('../../../static/image/icon/icon-home-white.png');
        }

        .end-icon.price {
            height: #{22rpx};
            width: #{12rpx};
            background-image: url('../../../static/image/icon/arrow-right-white.png');
        }
    }

}

.act-modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2001;
    transition: 200ms;

    .show {
        visibility: visible;
        opacity: 1;
    }

    .act-modal-bg {
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    .act-modal-pic {
        background: rgba(0, 0, 0, 0.25);
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    .act-modal-info {
        text-align: center;
        position: relative;

        .h5-limit {
            //#ifdef H5
            margin: #{-1px} 0;
            //#endif
        }
    }

    .success {
        top: #{0rpx};
        width: 100%;

        .image-bg {
            height: #{462rpx};
            width: 100%;
            display: block;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .image-close {
            position: absolute;
            right: #{80rpx};
            top: 0;
            height: #{30rpx};
            width: #{30rpx};
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-image: url('../../../static/image/icon/close.png');
        }

        .text, .box {
            width: #{591rpx};
            background: #ffffff;
            color: #353535;
        }

        .box {
            border-radius: 0 0 #{16rpx} #{16rpx};
            text-align: center;
            padding: #{64rpx} 0;
        }
    }

    .error {
        top: #{0rpx};
        width: 100%;

        .image-bg {
            height: #{240rpx};
            width: 100%;
            display: block;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .image-close {
            position: absolute;
            right: #{80rpx};
            top: 0;
            height: #{30rpx};
            width: #{30rpx};
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-image: url('../../../static/image/icon/close.png');
        }

        .text, .box {
            width: #{591rpx};
            background: #ffffff;
            color: #353535;
        }

        .box {
            border-radius: 0 0 #{16rpx} #{16rpx};
            text-align: center;
            padding: #{64rpx} 0;
        }
    }
}

</style>