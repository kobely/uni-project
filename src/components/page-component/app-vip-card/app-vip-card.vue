<template>
    <view v-if="vip_card.permission == 1" v-bind:style="vipBoxStyle">
        <view v-if="userInfo && userInfo.is_vip_card_user" class="app-vip-card cross-center dir-left-nowrap" v-bind:style="isVipStyle">
            <image class="app-vip-logo" v-bind:src="svipImg.logo"></image>
            <view>
                <view class="buy-big-text" v-bind:style="[{'color': `${vip_card.setting.form.renew_text_color}`}]">{{vip_card.setting.form.renew_text}}</view>
            </view>
            <view @click="router" class="app-vip-btn app-renew-btn cross-center main-center" v-bind:style="[{'background':`${vip_card.setting.form.renew_btn_bg_color}`}]">
                <text>详情</text>
                <image class="right-icon" src="/static/image/icon/right.png"></image>
            </view>
        </view>
        <view v-else class="app-vip-card cross-center dir-left-nowrap" v-bind:style="noVipStyle">
            <image class="app-vip-logo" v-bind:src="svipImg.logo"></image>
            <view>
                <view class="buy-big-text" v-bind:style="[{'color': `${vip_card.setting.form.buy_big_color}`}]">{{vip_card.setting.form.buy_big}}</view>
                <view class="buy-small-text" v-bind:style="[{'color': `${vip_card.setting.form.buy_small_color}`}]">{{vip_card.setting.form.buy_small}}</view>
            </view>
            <view @click="router" class="app-vip-btn" v-bind:style="[{'color': `${vip_card.setting.form.buy_btn_color}`,'background':`${vip_card.setting.form.buy_btn_bg_color}`}]">{{vip_card.setting.form.buy_btn_text}}</view>
        </view>

    </view>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: 'app-vip-card',
        data() {
            return {
                vip_card: {
                    permission: 0,
                    setting: {
                        form: {}
                    }
                }
            }
        },
        props: {
            background: {
                type: String,
                default() {
                    return `#f7f7f7`;
                }
            },
            top: {
                type: String,
                default() {
                    return `20rpx`;
                }
            },
            value: {
                type: Object
            }
        },
        computed: {
            ...mapState({
                userInfo: function(state) {
                    return state.user.info;
                },
                svipImg: function(state) {
                    return state.mallConfig.__wxapp_img.vip_card
                }
            }),
            vipBoxStyle: function() {
                return this.value ? `background-color: ${this.vip_card.setting.form.background};
                        height:${this.vip_card.setting.form.top_bottom_padding*2 + 120 + 'rpx'};
                        padding: ${this.vip_card.setting.form.top_bottom_padding + 'rpx 0'}` : '';
            },
            noVipStyle: function() {
                let buy_bg = this.vip_card.setting.form.buy_bg;
                return `background-image: url(${buy_bg !== 'statics/img/app/vip_card/buy_bg.png' ? buy_bg : this.svipImg.buy_bg});
                        background-color: ${this.background};
                        margin-top: ${this.top}`;
            },
            isVipStyle: function() {
                let renew_bg = this.vip_card.setting.form.renew_bg;
                return `background-image: url(${ renew_bg !== 'statics/img/app/vip_card/buy_bg.png' ? renew_bg : this.svipImg.buy_bg});
                        background-color: ${this.background};
                        margin-top: ${this.top}`;
            }
        },
        created() {
            this.getConfig();
        },
        methods: {
            router() {
                uni.navigateTo({
                    url: '/plugins/vip_card/index/index'
                });
            },
            async getConfig() {
                const res = await this.$request({
                    url: this.$api.index.config
                });
                if (res.code === 0) {
                    this.vip_card = Object.assign(this.vip_card,res.data.plugin.vip_card);
                    if(this.value) {
                        this.vip_card.setting.form = this.value;
                    }
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-vip-card {
        height: #{120rpx};
        width: 100%;
        position: relative;
        background-size: 100% 100%;
        background-repeat:no-repeat;
        background-position: center bottom;
    }
    .app-vip-btn.app-renew-btn {
        width: #{89rpx};
        height: #{35rpx};
        line-height: #{35rpx};
        border-radius: #{18rpx};
        top: #{42.5rpx};
    }
    .app-vip-logo {
        height: #{54rpx};
        width: #{60rpx};
        margin: 0 #{30rpx} 0 #{25rpx};
    }
    .buy-big-text {
        font-size: #{28rpx};
        margin-bottom: #{4rpx};
    }
    .buy-small-text {
        font-size: #{22rpx};
    }
    .app-vip-btn {
        position: absolute;
        right: #{45rpx};
        top: #{36rpx};
        font-size: #{25rpx};
        width: #{140rpx};
        height: #{48rpx};
        line-height: #{48rpx};
        text-align: center;
        border-radius: #{24rpx};
        background: -webkit-linear-gradient(left, #fbdec7, #f3bf95);
        background: -o-linear-gradient(left, #fbdec7, #f3bf95);
        background: linear-gradient(to right, #fbdec7, #f3bf95);
    }
    .right-icon {
        height: #{22rpx};
        width: #{12rpx};
        margin-left: #{8rpx};
    }
</style>
