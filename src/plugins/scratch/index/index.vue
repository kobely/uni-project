<template>
    <view class="app-layout">
        <app-layout :haveBackground="false">
            <view class="scratch">
                <view class="bg" :style="{'background-image': `url(${setting.bg_pic})`}"></view>
                <view class="scratch-head">
                    <view class="s-h" @click="rules">规则</view>
                    <view class="s-h" @click="share">分享</view>
                    <app-share-qr-code-poster @share="hShareAppMessage"
                                              v-model="shareShow"
                                              :url="poster" title="生成海报"
                    ></app-share-qr-code-poster>
                </view>
                <view class="scratch-oppty">
                    <view>您还有
                        <text>{{oppty}}</text>
                        次抽奖机会
                    </view>
                </view>
                <view class="container">
                    <image class="image-bg-a" src="./../image/scratch_border_bg.png" load-lazy></image>
                    <image id='frame' class="image-bg-b" src="./../image/scratch_border.png"
                           load-lazy></image>
                    <view v-if="is_integral">
                        <image class="image-bg-b" src="./../image/scratch_hide.png" load-lazy></image>
                        <view @click="register" class="image-bg-c">{{setting.deplete_integral_num}}积分刮一次</view>
                    </view>
                    <view v-else class="integral-show">
                        <view class="scratch-award main-center" :hidden="shareShow || userLoginShow">
                            <!--头条小程序不支持action -->
                            <canvas v-if="is_start"
                                    class="scratch-canvas"
                                    id="scratch"
                                    canvas-id="scratch"
                                    @touchstart="touchStart"
                                    @touchmove="touchMove"
                                    @touchend="touchEnd"
                                    disable-scroll></canvas>
                            <view v-if="is_name" class="award-name">
                                <text>{{list ? list.name : ''}}</text>
                                <app-button v-if="oppty > 0" @click="onStart" background="#f05525" height="80"
                                            width="400"
                                            border-color="#f05525"
                                            color="#FFFFFF" font-size="32" round>再刮一次
                                </app-button>
                                <app-button v-if="oppty == 0" @click="onStart" background="#cdcdcd" height="80"
                                            width="400"
                                            border-color="#cdcdcd"
                                            color="#FFFFFF" font-size="32" round>再刮一次
                                </app-button>
                            </view>
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
                <view class="prize">
                    <view class="dir-left-nowrap cross-center main-center">
                        <view class="line"></view>
                        <view class="text">中奖名单</view>
                        <view class="line"></view>
                    </view>
                    <swiper duration="500" vertical="true" autoplay="false" class="scratch-swiper">
                        <swiper-item>
                            <block v-for="v in logs" :key="v.id">
                                <view class="scratch-item">{{v.create_time}} {{v.user}} {{v.name}}</view>
                            </block>
                        </swiper-item>
                    </swiper>
                </view>
            </view>

            <!-- 弹窗 -->
            <view v-if="is_award">
                <view class="act-modal">
                    <view class="act-modal-bg"></view>
                    <view class="act-modal-pic cross-center main-center">
                        <view class="success main-center">
                            <icon class="image-bg" :style="{'background-image': `url(${appImg.scratch_win})`}" type></icon>
                            <view class="dir-top-nowrap name main-center">
                                <view>恭喜获得</view>
                                <text class="main-center">{{list.name}}</text>
                            </view>
                        </view>
                        <view class="act-modal-end dir-top-nowrap cross-center main-center">
                            <app-button @click="onStart" height="72" width="320" color="#FFFFFF"  background="#f05525"
                                        border-color="#f05525"
                                        round>再刮一次
                            </app-button>
                            <view class="act-zh">奖品已放入您的账号</view>
                        </view>
                    </view>
                </view>
            </view>
        </app-layout>
    </view>
</template>

<script>
import appShareQrCodePoster from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster';
import {mapState} from 'vuex';

export default {
    name: "index",
    components: {appShareQrCodePoster},
    computed: {
        ...mapState({
            appImg: state => state.mallConfig.plugin.scratch.app_image,
            userInfo: state => state.user.info,
        }),
    },
    data() {
        let ctx, interval, minX, minY, maxX, maxY, lastX, lastY;
        return {
            ctx,
            interval,
            minX,
            minY,
            maxX,
            maxY,
            lastX,
            lastY,
            logs: [],
                setting: {},
                list: null,
                oppty: 0,
                msg: '', //错误信息
                is_start: true,
                is_award: false,
                is_name: false,
                extra_list: null,
                touch_end: true,
                poster: this.$api.scratch.poster,
                poster_status: false, //hide model
                shareShow: false,
                userLoginShow: false,
                r: 16,
                is_integral: false,
            }
        },
        watch: {
            shareShow(val, oldVal) {
                if (val === false && oldVal === true) {
                    this.init();
                }
            }
        },
        onUnload () {
            clearInterval(this.interval);
        },
        onHide () {
            clearInterval(this.interval);
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
        onShow() {
            const self = this;
            self.$showLoading({title: '加载中'});
            self.$request({
                url: self.$api.scratch.index,
            }).then(info => {
                self.$hideLoading();
                self.is_award = false;
                if (info.data) {
                    [self.msg, self.setting, self.oppty, self.list] = [info.code === 1 ? info.msg : '', info.data.setting, info.data.oppty, info.data.list];
                    self.is_integral = self.setting.deplete_integral_num > 0;
                } else {
                    uni.showToast({'title': info.msg, icon: 'none'});
                }
                self.init();
            });

            self.prizeList();
            self.interval = setInterval(() => {
                self.prizeList();
            }, 10000)
        },

        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: this.$children[0].navigationBarTitle,
                path: '/plugins/scratch/index/index',
                params: {}
            });
        },
        // #endif
        methods: {
            hShareAppMessage(s = false){
                return this.$shareAppMessage({
                    title: this.$children[0].navigationBarTitle,
                    path: '/plugins/scratch/index/index',
                    params: {}
                }, s);
            },
            register() {
                if (this.msg) {
                    uni.showToast({icon: `none`, title: this.msg});
                    return;
                }
                this.is_integral = false;
                this.init();
            },

            share() {
                this.shareShow = true;
            },
            home() {
                uni.redirectTo({url: `/pages/index/index`});
            },
            prize() {
                uni.navigateTo({url: `/plugins/scratch/prize/prize`});
            },
            rules() {
                // uni.navigateTo({url: `/plugins/scratch/rule/rule`});
                uni.navigateTo({
                    url: `/pages/rules/index?url=${encodeURIComponent(this.$api.scratch.setting)}&keys=${JSON.stringify(['setting', 'rule'])}`,
                });
            },

            prizeList() {
                const self = this;
                self.$request({
                    url: self.$api.scratch.record,
                }).then(info => {
                    if (info.code === 0) {
                        self.logs = info.data;
                    }
                })
            },

            onStart() {
                this.init();
                [this.is_integral, this.list, this.is_award] = [this.setting.deplete_integral_num > 0, this.extra_list, false];
            },

            init() {
                const self = this;
                [self.is_start, self.is_name] = [true, false];

                //Promise
                setTimeout(() => {
                    let query = uni.createSelectorQuery();
                    query.select('#frame').boundingClientRect();
                    query.exec((res) => {
                        const canvasWidth = res[0].width;
                        const canvasHeight = res[0].height;
                        let imageResource = './../image/scratch_hide.png';
                        [self.lastX, self.lastY, self.minX, self.minY, self.maxX, self.maxY] = ['', '', '', '', '', ''];
                        [self.r, self.canvasWidth, self.canvasHeight] = [16, canvasWidth, canvasHeight]

                        let ctx = uni.createCanvasContext('scratch');
                        ctx.drawImage(imageResource, 0, 0, canvasWidth, canvasHeight);
                        self.ctx = ctx;
                        ctx.draw(true, (e) => {
                            self.is_name = true;
                        })
                    })
                })
            },

            //
            drawRect(x, y) {
                const self = this;
                const r = self.r / 2;
                const x1 = x - r > 0 ? x - r : 0
                const y1 = y - r > 0 ? y - r : 0
                if ('' !== self.minX) {
                    self.minX = self.minX > x1 ? x1 : self.minX;
                    self.minY = self.minY > y1 ? y1 : self.minY;
                    self.maxX = self.maxX > x1 ? self.maxX : x1;
                    self.maxY = self.maxY > y1 ? self.maxY : y1;
                } else {
                    [self.minX, self.minY, self.maxX, self.maxY] = [x1, y1, x1, y1];
                }
                [self.lastX, self.lastY] = [x1, y1];
                return [x1, y1, 2 * r]
            },

            // 绘图
            clearArc(x, y, stepClear) {
                let r = this.r;
                let ctx = this.ctx;
                let calcWidth = r - stepClear;
                let calcHeight = Math.sqrt(r * r - calcWidth * calcWidth);
                let posX = x - calcWidth;
                let posY = y - calcHeight;
                let widthX = 2 * calcWidth;
                let heightY = 2 * calcHeight;
                if (stepClear <= r) {
                    ctx.clearRect(posX, posY, widthX, heightY);
                    stepClear += 2;
                    this.clearArc(x, y, stepClear);
                }
            },

            //action
            touchStart(e) {
                const self = this;
                if (self.msg === 'User ID不能为空。') {
                    this.userLoginShow = true;
                    self.$store.dispatch('user/info');
                } else if (self.msg) {
                    uni.showToast({icon: 'none', title: self.msg})
                }
            },

            touchMove(e) {
                if (!this.is_start || this.msg) return;
                let stepClear = 2;
                this.drawRect(e.touches[0].x, e.touches[0].y)
                this.clearArc(e.touches[0].x, e.touches[0].y, stepClear)
                this.ctx.draw(true)
            },

            touchEnd(e) {
                const self = this;
                if (!self.is_start || self.msg) return;
                //自动清楚采用点范围值方式判断
                let canvasWidth = self.canvasWidth;
                let canvasHeight = self.canvasHeight;
                let minX = self.minX;
                let minY = self.minY;
                let maxX = self.maxX;
                let maxY = self.maxY;
                if (maxX - minX > .4 * canvasWidth && maxY - minY > .4 * canvasHeight && self.touch_end) {
                    self.touch_end = false;

                    self.$request({
                        url: self.$api.scratch.receive,
                        data: {
                            id: self.list.id
                        }
                    }).then(info => {
                        if (info.code === 0) {
                            self.ctx.draw();
                            [self.msg, self.setting, self.oppty, self.extra_list] = [info.msg, info.data.setting, info.data.oppty, info.data.list];
                            [self.is_start, self.is_award] = [false, self.list.type != 5];
                        } else {
                            uni.showToast({icon: 'none', content: info.msg});
                            self.onStart();
                        }
                        self.touch_end = true;
                    });
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .app-layout /deep/ .app-layout {
        background: #5e00b8;
        min-height: 100vh;
    }
    .scratch-canvas {
        width: #{600rpx};
        height: #{320rpx};
        position: absolute;
        left: 0;
        z-index: 1;
    }

    .scratch {
        text-align: center;
        padding-bottom: #{1rpx};
        .bg {
            position: absolute;
            left: 0;
            top: 0;
            height: 100vh;
            width: #{100%};
            display: block;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .scratch-head {
            .s-h {
                color: #FFFFFF;
                font-size: $uni-font-size-weak-one;
                background: #000000;
                text-align: center;
                background-color: rgba(0, 0, 0, 0.3);
                line-height: #{48rpx};
                width: #{92rpx};
                border-radius: #{24rpx} 0 0 #{24rpx};
                position: absolute;
                right: 0;
                z-index: 1;
                top: #{40rpx};
            }

            .s-h:nth-child(2) {
                top: #{112rpx}
            }
        }

        .scratch-oppty {
            line-height: #{56rpx};
            font-size: #{28rpx};
            padding-top: #{380rpx};
            position: relative;
            view {
                color: #ffffff;
                padding: 0 #{30rpx};
                display: inline-block;
                background: rgba(0, 0, 0, 0.3);;
                border-radius: #{28rpx};
            }

            text {
                color: #ffb92a;
            }
        }

        .container {
            position: relative;
            margin-top: #{40rpx};
            margin-bottom: #{48rpx};
            height: #{360rpx};
            width: 100%;

            .image-bg-a {
                height: #{360rpx};
                width: #{654rpx};
            }

            .image-bg-b {
                height: #{320rpx};
                width: #{600rpx};
                position: absolute;
                top: #{20rpx};
                left: 50%;
                -webkit-transform: translate(-50%, -50%);
                transform: translate(-50%, 0);
            }

            .image-bg-c {
                position: absolute;
                top: #{150rpx};
                left: 50%;
                -webkit-transform: translate(-50%, -50%);
                transform: translate(-50%, 0);
                line-height: #{80rpx};
                background: #f05525;
                border-radius: #{40rpx};
                padding: 0 #{48rpx};
                color: #ffffff;
            }
        }


        .end {
            position: relative;
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

        .prize {
            position: relative;
            height: #{186rpx};
            width: #{654rpx};
            background: #420080;
            display: inline-block;
            border-radius: #{16rpx};
            text-align: left;
            padding-top: #{26rpx};
            margin-top: #{48rpx};

            .line {
                height: #{1px};
                width: #{120rpx};
                background: #FFFFFF;
            }

            .text {
                padding: 0 #{40rpx};
                color: #FFFFFF;
                font-size: #{28rpx};
                padding-bottom:#{12rpx};
            }

            .scratch-swiper {
                height: #{110rpx};
                font-size: #{24rpx};
                color: #ffffff;
            }

            .scratch-item {
                line-height: #{40rpx};
                padding: 0 #{50rpx};
                display: inline-block;
                white-space: nowrap;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        .integral-show {
            position: absolute;
            top: #{20rpx};
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, 0);
            width: #{600rpx};
            height: #{320rpx};

            .scratch-award {
                width: 100%;
                height: 100%;

                canvas {

                }

                .award-name {
                    text {
                        width: #{410rpx};
                        color: #f05525;
                        font-size: #{36rpx};
                        margin-bottom: #{40rpx};
                        margin-top: #{88rpx};
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                    }

                    view {

                    }
                }
            }
        }

        .scraxtch-award {


            view {
                width: #{400rpx};
                line-height: #{80rpx};
                color: #ffffff;
                margin-top: #{40rpx};
                border-radius: #{40rpx};
            }

            .next {
                background: #f05525;
            }

            .none {
                background: #cdcdcd;
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

        .success {
            position: absolute;
            top: 0;
            width: 100%;
            left: 0;

            .image-bg {
                height: #{733rpx};
                width: 100%;
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }

            .name {
                position: absolute;
                top: #{540rpx};
                font-size: #{32rpx};
                color: #f05525;
                left: 50%;
                right: 0;
                text-align: center;
                -webkit-transform: translate(-50%, 0);
                transform: translate(-50%, 0);

                view {
                    padding-bottom: #{10rpx};
                }

                text {
                    //text-align: left;
                }
            }
        }

        .act-modal-end {
            position: absolute;
            top: #{730rpx};
            border-bottom: #{10rpx} solid #ffb947;
            border-radius: 0 0 #{24rpx} #{24rpx};
            border-left: #{10rpx} solid #ffb947;
            border-right: #{10rpx} solid #ffb947;
            width: #{490rpx};
            background: #ffffff;
            height: #{160rpx};
            left: 0;
            right: 0;
            margin: 0 auto;

            .act-zh {
                margin-top: #{24rpx};
                font-size: #{24rpx};
                color: #999999;
            }
        }
    }
</style>