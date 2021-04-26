<template>
    <movable-area class="u-swipe-action" :style="{backgroundColor: bgColor}">
        <movable-view
                class="u-swipe-view"
                @change="change"
                @touchend="touchend"
                @touchstart="touchstart"
                direction="horizontal"
                :disabled="disabled"
                :x="moveX"
                :style="{
				width: movableViewWidth
			}"
        >
            <view class="u-swipe-content"><slot></slot></view>
            <view
                    class="u-swipe-del  dir-top-wrap main-center"
                    @tap.stop="share"
                    :style="{
					width: innerBtnWidth/2 + 'px',
                    'background-color': theme.background_s
				}"
            >
                <text class="u-btn-text" :style="{'color': theme.color}">分享</text>
            </view>
            <view
                    class="u-swipe-del  dir-top-wrap main-center"
                    @tap.stop="del"
                    :style="{
					width: innerBtnWidth / 2 + 'px',
                    'background-color': theme.background
				}"
            >
                <text class="u-btn-text">删除</text>
            </view>
        </movable-view>
    </movable-area>
</template>

<script>
    export default {
        props: {
            btnText: {
                type: String,
                default: '删除'
            },
            btnBgColor: {
                type: String,
                default: '#ff0033'
            },
            index: {
                type: [Number, String],
                default: ''
            },
            btnWidth: {
                type: [String, Number],
                default: 200
            },
            disabled: {
                type: Boolean,
                default: false
            },
            show: {
                type: Boolean,
                default: false
            },
            bgColor: {
                type: String,
                default: '#ffffff'
            },
            theme: {
                type: Object
            },
            touch: {
                type: Boolean
            }
        },
        watch: {
            show: {
                immediate: true,
                handler(nVal, oVal) {
                    if(nVal) {
                        this.open();
                    } else {
                        this.close();
                    }
                }
            }
        },
        data() {
            return {
                moveX: 0,
                scrollX: 0,
                status: false,
                movableAreaWidth: 0,
                elId: this.guid()
            }
        },
        computed: {
            movableViewWidth() {
                return (this.movableAreaWidth + this.innerBtnWidth) + 'px';
            },
            innerBtnWidth() {
                return uni.upx2px(this.btnWidth);
            },

        },
        mounted() {
            this.getActionRect();
        },
        methods: {
            guid(len = 32, firstU = true, radix = null) {
                let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
                let uuid = [];
                radix = radix || chars.length;

                if (len) {
                    for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
                } else {
                    let r;
                    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                    uuid[14] = '4';

                    for (let i = 0; i < 36; i++) {
                        if (!uuid[i]) {
                            r = 0 | Math.random() * 16;
                            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                        }
                    }
                }
                if(firstU) {
                    uuid.shift();
                    return 'u' + uuid.join('');
                } else {
                    return uuid.join('');
                }
            },
            del() {
                this.status = false;
                this.moveX = 0;
                this.$emit('del', this.index);
            },
            share() {
                this.status = false;
                this.moveX = 0;
                this.$emit('share', this.index);
            },
            change(e) {
                this.scrollX = e.detail.x;
            },
            close() {
                this.moveX = 0;
                this.status = false;
            },
            open() {
                if(this.disabled) return ;
                this.moveX = - this.btnWidth;
                this.status = true;
            },
            touchend() {
                this.moveX = this.scrollX;
                this.$nextTick(function(){
                    if(this.status == false) {
                        if(this.scrollX <= -this.innerBtnWidth / 3) {
                            this.moveX = -this.innerBtnWidth;
                            this.status = true;
                            this.emitOpenEvent();
                            uni.vibrateShort();
                        } else {
                            this.moveX = 0;
                            this.status = false;
                            this.emitCloseEvent();
                        }
                    } else {
                        if(this.scrollX > -this.innerBtnWidth * 2 / 3) {
                            this.moveX = 0;
                            this.$nextTick(() => {
                                this.moveX = 101;
                            })
                            this.status = false;
                            this.emitCloseEvent();
                        } else {
                            this.moveX = -this.innerBtnWidth;
                            this.status = true;
                            this.emitOpenEvent();
                        }
                    }
                })
            },
            emitOpenEvent() {
                this.$emit('open', this.index);
            },
            emitCloseEvent() {
                this.$emit('close', this.index);
            },
            touchstart() {
            },
            getActionRect() {
                const query = uni.createSelectorQuery().in(this);
                query.select('.u-swipe-action').boundingClientRect(data => {
                    this.movableAreaWidth = data.width;
                }).exec();
            }
        }
    }
</script>

<style scoped lang="scss">

    .u-swipe-action {
        width: auto;
        height: initial;
        position: relative;
        overflow: hidden;
    }

    .u-swipe-view {
        display: flex;
        height: initial;
        position: relative; /* 这一句很关键，覆盖默认的绝对定位 */
    }

    .u-swipe-content {
        flex: 1;
    }

    .u-swipe-del {
        position: relative;
        font-size: 30rpx;
        color: #ffffff;
    }

    .u-btn-text {
        font-size: 30upx;
        text-align: center;
    }
</style>
