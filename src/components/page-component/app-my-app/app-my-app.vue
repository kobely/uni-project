<template>
    <view class="app-view">
        <view class="app-my-app point-box"
              v-if='is_add_show'
              :style="[hiddenHeight()]"
        >
            <view class='triangle'
                  :style="{'border-bottom':'16rpx solid ' + setting.add_app_bg_color,'opacity': setting.add_app_bg_transparency / 100}"
            ></view>
            <view class='dir-left-nowrap cross-center'>
                <image @click='close'
                       v-if='setting.add_app_icon_color_type == 1'
                       class='icon-fork'
                       src='/static/image/icon/fork_white.png'
                ></image>
                <image @click='close'
                       v-else-if='setting.add_app_icon_color_type == 2'
                       class='icon-fork'
                       src='/static/image/icon/fork_black.png'
                ></image>
                <view class='cross-center point-text'
                      :style="{'color':setting.add_app_text_color}">
                    {{setting.add_app_text}}
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        name: "app-my-app",
        data() {
            return {
                is_add_show: false,
            }
        },
        computed: {
            //可首先定义
            hiddenHeight() {
                return (type) => {
                    let top = null;

                    function changePx(num) {
                        return uni.upx2px(num);
                    }
                    let barHeight;
                    // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO
                    barHeight = this.systemInfo.statusBarHeight + this.mBarHeight;
                    // #endif
                    barHeight = barHeight || 0;
                    top = {top: (barHeight + changePx(16)) + 'px',}

                    return Object.assign({
                        backgroundColor: this.setting.add_app_bg_color,
                        opacity: this.setting.add_app_bg_transparency / 100,
                        borderRadius: this.setting.add_app_bg_radius + `rpx`
                    }, top);
                }
            },
            ...mapState({
                systemInfo: state => state.gConfig.systemInfo,
                mBarHeight: state => state.gConfig.mBarHeight
            }),
            ...mapState('mallConfig', {
                setting: state => state.mall.setting
            }),
        },
        methods: {
            close: function () {
                this.is_add_show = false;
                this.$storage.setStorageSync('_IS_ADD_APP', !this.is_add_show);
            }
        },
        created() {
            this.is_add_show = !this.$storage.getStorageSync('_IS_ADD_APP');
        }
    }
</script>

<style scoped lang="scss">

    .point-box {
        position: fixed;
        z-index: 9999;
        top: 16#{rpx};
        right: 24#{rpx};
        height: 72#{rpx};

        .triangle {
            width: 0;
            height: 0;
            border-right: 16#{rpx} solid transparent;
            border-left: 16#{rpx} solid transparent;
            position: absolute;
            top: -15#{rpx};
            right: 114#{rpx};
        }

        .icon-fork {
            width: 72#{rpx};
            height: 72#{rpx};
        }

        .point-text {
            margin: 0 28#{rpx};
            font-size: $uni-font-size-general-one;
        }
    }
</style>
