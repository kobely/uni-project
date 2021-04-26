<template>
    <view class="app-video app-content" :style="{width: width, height: height}" @click.stop="preventD" id="video">
        <view class="app-video app-image" @click.stop="play" v-if="!start">
            <image :src="picUrl" class="app-image" style="width: 100%;height:100%"></image>
            <view class="app-play app-image">
                <icon class="app-play-icon" type></icon>
            </view>
        </view>
        <video id="myVideo"
               @fullscreenchange="fullscreenChange"
               v-else
               class="app-video video"
               :show-mute-btn="true"
               :style="{width: width, height: height}"
               :autoplay="start" show-center-play-btn @error="error" :muted="hasAuto ? start : false" :loop="hasCycle" :src="url"></video>
    </view>
</template>

<script>
	import * as event from '../../../core/event.js';

    export default {
        name: "app-video",
	    data() {
            return {
	            start: false,
                fullScreen: false,
                maxTop: 0
            }
	    },
        props: {
            hasAuto: {
                type: [Boolean, String, Number],
                default: () => {
                    return false;
                }
            },
            hasCycle: {
                type: [Boolean, String, Number],
                default: () => {
                    return false;
                }
            },
            picUrl: {
                type: String,
                default: () => {
                    return '';
                }
            },
            url: {
                type: String,
                default() {
                    return '';
                }
            },
            width: {
                type: String,
                default() {
                    return `750rpx`;
                }
            },
            height: {
                type: String,
                default() {
                    return `422rpx`;
                }
            },
        },
        methods: {
            fullscreenChange(e) {
                this.fullScreen = e.detail.fullScreen;
            },
            play() {
                this.$nextTick().then(() => {
                    this.start = true;
                });
                event.trigger(this.$const.EVENT_VIDEO_END);
                this.$emit('videoStart', true);
                event.on(this.$const.EVENT_VIDEO_END, true).then(() => {
                    this.start = false;
                    this.$emit('videoStart', false);
                });
            },
            autoPlay() {
                let query = null;
                // #ifndef MP-WEIXIN
                query = uni.createSelectorQuery();
                // #endif
                // #ifdef MP-WEIXIN
                query = uni.createSelectorQuery().in(this);
                // #endif
                query.select('#video').boundingClientRect(res => {
                    if (res && res.top > 0 && res.top < 500) {
                        this.play();
                    }
                }).exec();
            },
            autoEnd() {
                let query = null;
                /* #ifndef MP-ALIPAY */
                query = this.createSelectorQuery();
                /* #endif */
                /* #ifdef MP-ALIPAY */
                query = uni.createSelectorQuery();
                /* #endif */
                query.select('.video').boundingClientRect();
                query.selectViewport().scrollOffset();
                query.exec(res => {
                    if (res[0].top <= -200 || res[0].top >= this.maxTop - 57) {
                        event.trigger(this.$const.EVENT_VIDEO_END);
                    }
                });
            },
            preventD() {
            },
            error() {}
	    },
		computed: {
            scrollTop() {
                return this.$store.state.page.scrollTop;
			}
		},
        created() {
            this.maxTop = uni.getSystemInfoSync().windowHeight;
        },
        watch: {
            scrollTop: {
                handler() {
                    if (this.start && !this.fullScreen) {
                        this.$utils.throttle(this.autoEnd, 500);
                    }
                    if (!this.start && this.hasAuto) {
                        this.$utils.throttle(this.autoPlay, 500);
                    }
                },
                immediate: true
            }
        }
    }
</script>

<style scoped lang="scss">
	.app-content {
		position: relative;
	}
	.app-image {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 100;
		width: 100%;
		height:100%;
	}
	.app-play-icon {
		width:#{130rpx};
		height: #{130rpx};
		background-image: url("../../../static/image/icon/play.png");
		background-size:100% 100%;
		position: absolute;
		top: 50%;
		z-index: 100;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
