<template>
    <view class="app-nav-bar">
        <view class="hidden-height" :style="[hiddenHeight()]"></view>
        <view
            :class="{ 'app-navbar--fixed': fixed, 'app-navbar--shadow': shadow,'app-navbar--border': border, 'app-navbar--content':true}">
            <view :style="[ordinaryStyle()]" class="app-navbar__bar cross-center">
                <view class="dir-left-nowrap app-navbar__box">
                    <view class="app-navbar__back cross-center box-grow-0" @click="onClickBack" v-if="pagesLength > 1">
                        <view class="icon-back"></view>
                    </view>
                    <view
                        :class="{'main-center app-navbar__right-center': position === 'center' && xStyle== 1, 'right__back': pagesLength > 1}"
                        class="box-grow-1 dir-left-nowrap app-navbar__right">
                        <view v-if="showLeftIcon">
                            <app-jump-button form :open_type="link.openType"
                                             :url="link.url"
                                             :params="link.params">
                                <view class="cross-center box-grow-0 left-icon">
                                    <image :style="[hw_style]" :src="leftIcon"></image>
                                </view>
                            </app-jump-button>
                        </view>
                        <view v-if="showTitle" class="cross-center box-grow-0 title">
                            <app-jump-button v-if="hasJump" form :open_type="link.openType"
                                             :url="link.url"
                                             :params="link.params">
                                <view class="t-omit" :style="[maxWidth()]">{{ title }}</view>
                            </app-jump-button>
                            <view v-else class="t-omit" :style="[maxWidth()]">{{ title }}</view>
                        </view>
                        <view v-if="showLink" class="cross-center box-grow-0 link">
                            <view class="link-search" @click="navGoodsSearch"
                                  :style="{color: placeholderColor}">
                                <view class="link-box cross-center main-between">
                                    <view class="search-placeholder t-omit">{{ placeholder }}</view>
                                    <view class="search-icon"></view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>

import {mapState} from "vuex";

export default {
    name: 'app-nav-bar',
    data() {
        return {
            hw_style: {},
        }
    },
    watch: {
        'leftIcon'(newValue, oldValue) {
            console.log('lefticon 监听测试');
            this.doSomething();
        }
    },
    props: {
        fixed: {
            type: [Boolean, String],
            default: true
        },
        shadow: {
            type: [String, Boolean],
            default: false
        },
        border: {
            type: [String, Boolean],
            default: false
        },
        backgroundColor: {
            type: String,
            default: "#FFFFFF"
        },
        leftIcon: {
            type: String,
            default: ""
        },
        link: {
            type: [Object,Array]
        },
        title: {
            type: String,
            default: ""
        },
        xStyle: {
            type: [Number, String],
            default: 1
        },
        hasMallSetting: {
            type: [Number, String],
            default: 1
        },
        color: {
            type: String,
            default: "#000000"
        },
        position: {
            type: String,
            default: "center"
        },
        placeholder: {
            type: String,
            default: "搜索"
        },
        placeholderColor: {
            type: String,
            default: "#666666"
        }
    },
    computed: {
        ...mapState({
            statusBarHeight: state => state.gConfig.systemInfo.statusBarHeight,
            mBarHeight: state => state.gConfig.mBarHeight,
            appImg: state => state.mallConfig.__wxapp_img.mall,
            mallNavbar: state => state.mallConfig.navbar
        }),
        maxWidth() {
            return () => {
                let xstyle = parseInt(this.xStyle);
                let width = 0;

                switch (xstyle) {
                    case 1:
                        if (this.position === 'center') {
                            width = uni.upx2px(360);
                        } else {
                            width = uni.upx2px(500);
                        }
                        break;
                    case 2:
                        width = uni.upx2px(400);
                        break;
                    case 4:
                        width = uni.upx2px(200);
                        break;
                    default:
                        break;
                }
                if (width && this.pagesLength > 1) {
                    width -= uni.upx2px(42);
                }
                return Object.assign({}, {
                    'max-width': width + 'px',
                });
            }
        },
        hiddenHeight() {
            return () => {
                let barHeight;
                // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO
                barHeight = this.statusBarHeight;
                // #endif
                barHeight = barHeight || 0;
                return {
                    height: (barHeight + this.mBarHeight) + 'px',
                }
            }
        },
        ordinaryStyle() {
            return () => {
                let color = '';
                let backgroundColor = '';
                if (this.hasMallSetting == 1) {
                    color = this.mallNavbar.top_text_color;
                    backgroundColor = this.mallNavbar.top_background_color;
                } else {
                    color = this.color;
                    backgroundColor = this.backgroundColor;
                }
                let barHeight;
                // #ifdef MP
                barHeight = this.statusBarHeight;
                // #endif
                barHeight = barHeight || 0;
                color = color || '#000000';
                backgroundColor = backgroundColor || '#FFFFFF';
                return Object.assign({}, {
                    color, backgroundColor,
                    height: (barHeight + this.mBarHeight) + 'px',
                    paddingTop: barHeight + 'px',
                })
            }
        },
        hasJump() {
            return [2, 4].indexOf(parseInt(this.xStyle)) !== -1
        },
        showLeftIcon() {
            return [2, 3].indexOf(parseInt(this.xStyle)) !== -1 && this.leftIcon
        },
        showTitle() {
            return [1, 2, 4].indexOf(parseInt(this.xStyle)) !== -1 && this.title
        },
        showLink() {
            return [3, 4].indexOf(parseInt(this.xStyle)) !== -1 && this.link
        },
        pagesLength() {
            return getCurrentPages().length;
        },
    },
    mounted() {
        this.doSomething();
    },
    methods: {
        doSomething() {
            const maxHeight = 54;
            const maxWidth = 100;
            const self = this;
            uni.getImageInfo({
                src: self.leftIcon,
                success: function (res) {
                    let {height, width} = res;
                    if (height <= maxHeight && width <= maxWidth) {
                        // height = height;
                        // width = width;
                    }
                    if (height <= maxHeight && width >= maxWidth) {
                        height = height / (width / maxWidth);
                        width = maxWidth;
                    }
                    if (height >= maxHeight && width <= maxWidth) {
                        height = maxHeight;
                        width = width / (height / maxHeight);
                    }

                    if (height > maxHeight && width >= maxWidth) {
                        if (maxWidth / maxHeight > width / height) {
                            width = width / (height / maxHeight);
                            height = maxHeight;
                        } else {
                            height = height / (width / maxWidth);
                            width = maxWidth;
                        }
                    }
                    self.hw_style = {
                        height: uni.upx2px(height) + 'px',
                        width: uni.upx2px(width) + 'px',
                    };
                    console.log(self.hw_style);
                }
            })
        },
        navGoodsSearch() {
            uni.navigateTo({
                url: '/pages/search/search',
            })
        },
        onClickBack() {
            uni.navigateBack({
                delta: 1
            })
        },
    },
}
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
$bar-height: 0;
/* #endif */
/* #ifdef MP */
$bar-height: 20px;
/* #endif */
$app-height: 44px + $bar-height;
$app-bg-color: #FFFFFF;
.app-nav-bar {
    .hidden-height {
        height: $app-height;
    }

    .app-navbar--fixed {
        position: fixed;
        z-index: 9998;
        top: 0;
    }

    .app-navbar--shadow {
        box-shadow: 0 1px 6px #ccc;
    }

    .app-navbar--border {
        border-bottom-width: #{1rpx};
        border-bottom-style: solid;
        border-bottom-color: $app-bg-color;
    }

    .app-navbar--content {
        width: 100vw;
        background-color: $app-bg-color;
        overflow: hidden;
    }
}

.app-navbar__bar {
    height: $app-height;
    padding-top: $bar-height;

    .app-navbar__box {
        position: relative;
        width: 100%;

        .app-navbar__back {
            padding-left: #{26rpx};

            .icon-back {
                background-image: url("../../../static/image/icon/h5-back-2.png");
                background-repeat: no-repeat;
                background-size: 100% 100%;
                height: #{27rpx};
                width: #{16rpx};
                display: block;
            }
        }

        .app-navbar__right {
            > view {
                padding-left: #{26rpx};
            }

            .left-icon image {
                max-height: #{54rpx};
                max-width: #{100rpx};
                height: 0;
                width: 0;
                display: block;
            }

            .title {
                font-size: #{32rpx};
                font-weight: bold;

                > view {
                    max-width: 50vw;
                }
            }

            .link-search {
                width: #{298rpx};
                height: #{55rpx};
                background-color: #FFFFFF;
                border-radius: #{40rpx};
                position: relative;

                .link-box {
                    position: absolute;
                    top: 0;
                    left: 0;
                    font-size: #{22rpx};
                    height: #{55rpx};
                    padding: 0 #{24rpx};
                    width: 100%;
                    border: 1upx solid #e2e2e2;
                    border-radius: #{40rpx};
                    .search-placeholder {
                        max-width: #{218rpx};
                    }

                    .search-icon {
                        background-image: url("../../../static/image/icon/icon-search.png");
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        height: #{26rpx};
                        width: #{26rpx};
                    }
                }
            }
        }

        .app-navbar__right-center {
            margin-right: 0;

            .title {
                padding-left: 0;
            }
        }

        .app-navbar__right-center.right__back {
            margin-right: calc(#{26rpx} + #{16rpx});
        }
    }
}
</style>
