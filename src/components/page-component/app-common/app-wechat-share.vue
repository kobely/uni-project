<template>
    <view v-if='is_add_show' class="app-view" @click="close">
        <view class="app-wechat-share point-box"
              :style="{'background-color':setting.add_app_bg_color,
              'opacity':setting.add_app_bg_transparency / 100,
              'border-radius': setting.add_app_bg_radius + `rpx`}"
        >
            <view class='triangle'
                  :style="{'border-bottom':'16rpx solid ' + setting.add_app_bg_color,'opacity': setting.add_app_bg_transparency / 100}"
            ></view>
            <view class='dir-left-nowrap cross-center'>
                <image @click='close'
                       v-if='setting.add_app_icon_color_type == 2'
                       class='icon-fork'
                       src='/static/image/icon/fork_black.png'
                ></image>
                <view class='cross-center point-text'
                      :style="{'color':setting.add_app_text_color}">
                    {{ setting.add_app_text }}
                </view>
            </view>
        </view>
    </view>
</template>
<script>

export default {
    name: "app-wechat-share",
    data() {
        return {
            //is_add_show: false,
            setting: {
                add_app_bg_color: '#FFFFFF',
                add_app_bg_radius: 36,
                add_app_bg_transparency: 100,
                add_app_icon_color_type: 2,
                add_app_text: '请点击右上角的“...”按钮，分享给好友',
                add_app_text_color: '#353535',
            },
        }
    },
    computed: {
        is_add_show() {
            // #ifdef H5
            return this.$store.state.share.status;
            // #endif
        },
    },
    methods: {
        close: function () {
            this.$store.commit('share/status', false);
        }
    },
    destroyed(){
        // #ifdef H5
        this.$store.commit('share/status', false);
        // #endif
    },
    created() {
        // #ifdef H5
        this.$store.commit('share/status', false);
        // #endif
    }
}
</script>

<style scoped lang="scss">
.app-view {
    position: fixed;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2002;
}

.point-box {
    position: fixed;
    z-index: 2003;
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
        right: 50#{rpx};
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
