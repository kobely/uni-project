<template>
    <app-layout>
        <app-rich-text :content="setting.recruit_content"></app-rich-text>
        <view class="placeholder" :class="[`${tabbarbool? 'tabbarbool':''}`]"></view>
        <view class="apply safe-area-inset-bottom" :class="[ `${iphone_x? 'iphone_x':''}`,`${tabbarbool? 'tabbarbool':''}`]">
            <view class="apply-btn" :style="{'background-color': getTheme.color}" @click="toApply">立即申请</view>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appRichText from "../../../components/basic-component/app-rich/parse.vue";

    export default {
        data() {
            return {
                setting: {},
                currentRoute: this.$platDiff.route(),
                tabbarbool: false,
                iphone_x: false,
            }
        },
        computed: {
            ...mapState({
                tabBarNavs: state => state.mallConfig.navbar.navs,
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            })
        },
        watch: {
            tabBarNavs: {
                handler: function() {
                    this.b();
                },
                immediate: true,
            }
        },
        components: {
            "app-rich-text": appRichText
        },
        methods: {
            b() {
                // #ifndef H5
                let currentRoute = this.currentRoute;
                for (let i = 0; i < this.tabBarNavs.length; i++) {
                    if(currentRoute.includes(this.tabBarNavs[i].url.split('?')[0])) {
                        return this.tabbarbool = true;
                    }
                }
                // #endif
                return  this.tabbarbool = false;
            },
            toApply() {
                this.stopLoad = true;
                uni.navigateTo({
                    url: '/plugins/community/apply/apply'
                });
            },
            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.community.setting,
                }).then(response=>{
                    if(response.code == 0) {
                        that.setting = response.data;
                        uni.setNavigationBarTitle({
                            title: that.setting.recruit_title
                        });
                    }else {
                        that.$hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
        },

        onLoad() { this.$commonLoad.onload();
            let that = this;
            uni.getSystemInfo({
                success: function (res) {
                    that.height = -res.screenHeight;
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            });
            that.getSetting();
        }
    }
</script>

<style scoped lang="scss">
    .placeholder {
        height: #{154rpx};
        width: 100%;
        &.tabbarbool {
            padding-bottom: #{110rpx};
        }
    }

    .apply {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 2;
        height: #{154rpx};
        width: 100%;
        background-color: #fff;
        padding-top: #{26rpx};
        padding-left: #{24rpx};
        &.tabbarbool {
            bottom: #{110rpx};
            &.tabbarbool.iphone_x {
                bottom: #{160rpx};
            }
        }
        .apply-btn {
            width: #{702rpx};
            height: #{88rpx};
            line-height: #{88rpx};
            border-radius: #{44rpx};
            text-align: center;
            color: #fff;
            font-size: #{32rpx};
        }
    }
</style>