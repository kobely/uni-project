<template>
    <view class="u-announcement">
        <view class="u-notice-bar" :style="{backgroundColor: bgColor}" @click="take(true)">
            <view class="u-direction-row">
                <view class="u-icon-wrap">
                    <image class="u-icon-left" :src="icon ? icon : '/static/image/icon/icon-notice.png'"></image>
                    <text class="u-text" :style="{color: textColor}">{{name}}</text>
                </view>
                <view class="u-notice-box" id="u-notice-box">
                    <view
                        class="u-notice-content"
                        id="u-notice-content"
                        :style="{
                            animationDuration: animationDuration,
                            animationPlayState: animationPlayState
					    }"
                    >
                        <text class="u-notice-text u-text" :style="{color: textColor}">{{showText}}</text>
                    </view>
                </view>
                <view class="u-icon-wrap">
                    <image class="u-icon-right" src="/static/image/icon/arrow-right-white.png" ></image>
                </view>
            </view>
        </view>
        <u-popup :length="600" mode="center" v-model="visibleSync" :zoom="false">
            <view class="app-top-image" :style="{backgroundImage: `url(${headerUrl})`}" v-if="headerUrl"></view>
            <view class="app-top-image icon" v-else></view>
            <view class="u-bottom-content">
                <scroll-view scroll-y class="u-content">
                    {{content}}
                </scroll-view>
                <view class="u-button" hover-class="u-hover-class" :style="btnStyle" @click="take(false)">
                    {{btnText}}
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script>
import uPopup from '../../../components/basic-component/u-popup/u-popup.vue';
export default {
    data() {
        return {
            animationDuration: '10s',
            animationPlayState: 'paused',
            showText: '',
            visibleSync: false,
            showDrawer: false,
            timer: null
        }
    },
    components: {
        uPopup
    },
    props: {
        content: String,
        bgColor: {
            type: String,
            default: '#f67f79'
        },
        icon: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: '公告'
        },
        textColor: {
            type: String,
            default: '#ffffff'
        },
        headerUrl: {
            type: String,
            default: ''
        },
        btnText: {
            type: String,
            default: '我知道了'
        },
        btnTextColor: {
            type: String,
            default: '#ffffff'
        },
        btnColor: {
            type: String,
            default: '#ff4544'
        },
        btnRadius: {
            type: String,
            default: '40rpx'
        },
        btnWidth: {
            type: Number,
            default: 500
        }
    },
    watch: {
        content: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.showText = newVal.replace(/[\r\n]/g,"");
                    this.$nextTick(() => {
                        this.initSize();
                    });
                }
            }
        }
    },
    methods: {
        initSize() {
            let query = [];
            let textQuery = new Promise(resolve => {
                uni.createSelectorQuery().in(this).select(`#u-notice-content`).boundingClientRect().exec(ret => {
                    this.textWidth = ret[0].width;
                    resolve();
                });
            });
            query.push(textQuery);
            Promise.all(query).then(() => {
                this.animationDuration = `${this.textWidth / uni.upx2px(100)}s`;
                this.animationPlayState = 'paused';
                setTimeout(() => {
                    this.animationPlayState = 'running';
                }, 10);
            });
        },
        take(data) {
            this.visibleSync = data;
        }
    },
    computed: {
        btnStyle: function() {
            return `width: ${this.btnWidth}rpx;color:${this.btnTextColor};background-color:${this.btnColor};border-radius: ${this.btnRadius};`
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initSize();
        });
    }
}
</script>

<style lang="scss" scoped>
    .u-notice-bar {
        padding: 18upx 24upx;
        overflow: hidden;
    }
    .u-direction-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .u-icon-wrap {
        display: flex;
        align-items: center;
    }
    .u-icon-left {
        width: 36upx;
        height: 36upx;
        margin-right: 20upx;
    }
    .u-notice-box {
        flex: 1;
        display: flex;
        flex-direction: row;
        overflow: hidden;
        margin-left: 12upx;
    }
    .u-notice-text {
        font-size: 26upx;
        word-break: keep-all;
        white-space: nowrap
    }
    .u-notice-content {
        animation: u-loop-animation 10s linear infinite both;
        text-align: right;
        padding-left: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }
    @keyframes u-loop-animation {
        0% {
            transform: translate3d(0, 0, 0);
        }

        100% {
            transform: translate3d(-100%, 0, 0);
        }
    }
    .u-icon-right {
        width: 12upx;
        height: 22upx;
        margin-left: 10upx;
    }
    .u-text {
        font-size: 26upx;
    }
    .app-transparent-frame {
        width: 600upx;
    }
    .app-top-image {
        height: #{150rpx};
        width: #{600rpx};
        background-repeat: no-repeat;
        background-size: cover;
        &.icon {
            background-image: url("../../../static/image/icon/announcement.png");
        }
    }
   	.u-bottom-content {
        background-color: #ffffff;
        padding: 50upx;
        border-bottom-right-radius:  11upx;
        border-bottom-left-radius: 11upx;
    }
    .u-button {
        margin: 0 auto;
        font-size: 31upx;
        text-align: center;
        height: 80upx;
        line-height: 80upx;
    }
 	.u-content {
        display: block;
       	min-height: 144upx;
        max-height: 285upx;
        width: 500upx;
        margin-bottom:  66upx;
        word-break: break-all;
        line-height: 48upx;
    }
</style>
