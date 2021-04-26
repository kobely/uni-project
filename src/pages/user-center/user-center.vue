<template>
    <app-layout>
        <app-user-center-top
            :top-style="userCenter.top_style"
            :top-pic-url="userCenter.top_pic_url"
            :member-pic-url="userCenter.member_pic_url"
            :is_icon_super_vip="is_icon_super_vip"
            :user-name-color="userCenter.user_name_color"
        ></app-user-center-top>

        <view class="u-foot-box main-center" v-if="userCenter.is_foot_bar_status == 1">
            <view @click="router(item.name)" class="u-foot-item main-center" v-for="(item, key) in foot_bar" :key="key">
                <image class="u-icon" :src="item.icon_url"></image>
                <view class="u-foot-info">
                    <view class="u-foot-num">{{item.name | showNum(userInfo)}}</view>
                    <view>{{item.name}}</view>
                </view>
            </view>
            <view class="u-line"></view>
        </view>

        <view style="padding: 0 24rpx">
            <app-vip-card></app-vip-card>
        </view>

        <app-account-balance
            v-if="account_bar_status == 1"
            :margin="true"
            :round="true"
            :input-user-center="userCenter"
        ></app-account-balance>

        <app-my-order
            v-if="userCenter.is_order_bar_status == 1"
            :margin="true"
            :round="true"
            :theme="getTheme"
            :order_bar="userCenter.order_bar"
        ></app-my-order>

        <view class="app-my-service" v-if="userCenter.is_menu_status == 1">
            <view class="title" v-if="userCenter.menu_title">{{userCenter.menu_title}}</view>
            <view class="list" :class="[listStyle]">
                <!--  #ifdef MP -->
                <view class="item" v-for="(item, index) in userCenter.menus" :key="index" >
                    <app-jump-button form
                                     :url="item.link_url"
                                     :open_type="item.open_type"
                                     :item="item"
                                     :arrangement="`${userCenter.menu_style === '1' ? 'row' : userCenter.menu_style === '2' ? 'column' : ''}`">
                        <view style="width: 100%"
                              class="item-container"
                              :class="[
                                  userCenter.menu_style=='1'?'dir-left-nowrap cross-center':'',
                                  userCenter.menu_style=='2'?'dir-top-nowrap cross-center':'',
                              ]">
                            <view class="box-grow-0">
                                <image :src="item.icon_url" class="icon"></image>
                            </view>
                            <view class="box-grow-1" style="max-width: 100%">
                                <view class="name">{{item.name}}</view>
                            </view>
                            <view class="box-grow-0" v-if="userCenter.menu_style=='1'">
                                <image src="/static/image/icon/arrow-right.png" class="arrow"></image>
                            </view>
                        </view>
                    </app-jump-button>
                </view>
                <!--  #endif -->
                <!--  #ifdef H5 -->
                <block v-for="(item, index) in menus" :key="index">
                    <view class="item" v-if="item.open_type !== 'app'">
                        <app-jump-button form
                                         :url="item.link_url"
                                         :open_type="item.open_type"
                                         :item="item"
                                         :arrangement="`${userCenter.menu_style === '1' ? 'row' : userCenter.menu_style === '2' ? 'column' : ''}`">
                            <view style="width: 100%"
                                  class="item-container"
                                  :class="[
                                  userCenter.menu_style=='1'?'dir-left-nowrap cross-center':'',
                                  userCenter.menu_style=='2'?'dir-top-nowrap cross-center':'',
                              ]">
                                <view class="box-grow-0">
                                    <image :src="item.icon_url" class="icon"></image>
                                </view>
                                <view class="box-grow-1" style="max-width: 100%">
                                    <view class="name">{{item.name}}</view>
                                </view>
                                <view class="box-grow-0" v-if="userCenter.menu_style=='1'">
                                    <image src="/static/image/icon/arrow-right.png" class="arrow"></image>
                                </view>
                            </view>
                        </app-jump-button>
                    </view>
                    <view  v-else :id="item.id" class="item"></view>
                </block>

                <!--  #endif -->
            </view>
        </view>
        <!-- #ifdef H5 -->
        <view v-if="userInfo && isShowSetting" class="bd-setting dir-left-nowrap main-between cross-center" @click="routerGo">
            <view>设置</view>
            <image src="./../../static/image/icon/arrow-right.png" class="bd-arrow"></image>
        </view>
        <!-- #endif -->

        <app-copyright
            v-if="copyright && copyright.status == '1'"
            background-color="transparent"
            :link="copyrightLink"
            :pic-url="copyright.pic_url"
            :text="copyright.description"
        ></app-copyright>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import AppUserCenterTop from '../../components/page-component/app-user-center-top/app-user-center-top.vue';
    import AppAccountBalance from '../../components/page-component/app-account-balance/app-account-balance.vue';
    import AppMyOrder from '../../components/page-component/app-my-order/app-my-order.vue';
    import AppCopyright from '../../components/page-component/app-copyright/app-copyright.vue';
    import AppVipCard from '../../components/page-component/app-vip-card/app-vip-card.vue';

    export default {
        name: 'user-center',
        components: {
            AppCopyright,
            AppUserCenterTop,
            AppAccountBalance,
            AppMyOrder,
            AppVipCard,
        },
        computed: {
            ...mapState({
                copyright: state => state.mallConfig.copyright,
                userInfo: state => state.user.info,
                is_icon_super_vip: function (state) {
                    return state.mallConfig.mall.setting.is_icon_super_vip;
                },
                foot_bar: function(state) {
                    return state.userCenter.data.foot_bar;
                },
                account_bar_status: function() {
                    return this.userCenter.account_bar ? this.userCenter.account_bar.status : 0;
                },
                // #ifdef H5
                isWechat: function() {
                    return this.$jwx.isWechat();
                },
                menus: function() {
                    let menus = this.userCenter.menus;
                    menus.forEach(item => {
                        if(item.open_type === 'app') {
                            item.id = this.$utils.guid('user-center');
                            let username = this.$utils.getUrlParamApp(item.link_url, 'username');
                            let path = this.$utils.getUrlParamApp(item.link_url, 'path');
                            let strImg = ``;
                            let size = uni.upx2px(50) + 'px';
                            let style = `
                                <style>
                                .app-button-row {
                                    height: 100%;
                                    width: 100%;
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: center;
                                    align-items: center;
                                }

                                .app-button-column {
                                    height: 100%;
                                    width: 100%;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: center;
                                    align-items: center;
                                }
                                .box-grow-0 {
                                  min-width: 0;
                                  -webkit-box-flex: 0;
                                  -webkit-flex-grow: 0;
                                  -ms-flex-positive: 0;
                                  flex-grow: 0;
                                  -webkit-flex-shrink: 0;
                                  -ms-flex-negative: 0;
                                  flex-shrink: 0;
                                }

                                .box-grow-1 {
                                  min-width: 0;
                                  -webkit-box-flex: 1;
                                  -webkit-flex-grow: 1;
                                  -ms-flex-positive: 1;
                                  flex-grow: 1;
                                  -webkit-flex-shrink: 1;
                                  -ms-flex-negative: 1;
                                  flex-shrink: 1;
                                }

                                    .name {
                                        color: #666666;
                                        white-space: nowrap;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                    }
                                    .dir-left-nowrap {
                                      display: -webkit-box;
                                      display: -webkit-flex;
                                      display: flex;
                                      -webkit-flex-direction: row;
                                      flex-direction: row;
                                      flex-wrap: nowrap;
                                    }

                                .dir-top-nowrap {
                                  display: -webkit-box;
                                  display: -webkit-flex;
                                  display: flex;
                                  -webkit-box-orient: vertical;
                                  -webkit-flex-direction: column;
                                  flex-direction: column;
                                  flex-wrap: nowrap;
                                }

                                .cross-center {
                                  display: -webkit-box;
                                  display: -webkit-flex;
                                  display: flex;
                                  -webkit-align-items: center;
                                  align-items: center;
                                }
</style>


                            `;
                            let classStr = '';
                            let font = '';
                            let padding = '';
                            let arrow = require("../../static/image/icon/arrow-right.png");
                            if (this.userCenter.menu_style == 1) {
                                let margin = uni.upx2px(16);
                                strImg = `<img src="${item.icon_url}" width="${size}" height="${size}" style="margin-right: ${margin}px"/>`;
                                font = '17px';
                                padding = 0;
                            } else if (this.userCenter.menu_style == 2) {
                                let margin = uni.upx2px(28);
                                strImg = `<img src="${item.icon_url}" width="${size}" height="${size}" style="margin-bottom: ${margin}px"/>`;
                                classStr = 'name';
                                font = uni.upx2px(24) + 'px';
                                padding = `0px` + ' ' +uni.upx2px(12) +'px';
                            }

                            let str = `<div class="box-grow-0">${strImg}</div>
                                        <div class="box-grow-1" style="max-width: 100%;"><div style="padding:${padding};font-size: ${font}" class="${classStr}">${item.name}</div></div>`;
                            if (this.userCenter.menu_style == 1) {
                                let width = uni.upx2px(12);
                                let height = uni.upx2px(22);
                                str+= ` <div class="box-grow-0">
                                    <img src="${arrow}" width="${width}px" height="${height}px"/>
                                </div>`
                            }
                            let div = ``;
                            let div1 = '';
                            if (this.userCenter.menu_style == 1) {
                                let padding1 = uni.upx2px(20) + 'px';
                                let padding2 = uni.upx2px(32) + 'px';
                                div1 = `<div style="width: 100%;padding: ${padding1} ${padding2}" class="dir-left-nowrap cross-center">${str}</div>`
                            } else {
                                let padding = uni.upx2px(24) + 'px';
                                div1 = `<div style="width: 100%;padding: ${padding} 0" class="dir-top-nowrap cross-center">${str}</div>`
                            }
                            if (this.userCenter.menu_style == 1) {
                                div = `<div class="app-button-row">${div1}</div>`
                            } else {
                                div = `<div class="app-button-column">${div1}</div>`
                            }
                            style += div;
                            this.$utils.createWxOpenLaunchWeapp(item.id, username, path, style);
                        }
                    });
                    return menus;
                }
                // #endif
            }),
            copyrightLink() {
                if (!this.copyright) return {};
                let { open_type, new_link_url, params } = this.copyright.link;
                return {
                    openType: open_type,
                    url: new_link_url,
                    params: params ? params : []
                };
            },
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme'
            }),
            ...mapGetters('userCenter',{
                userCenter: 'userCenter'
            }),
            listStyle() {
                if (this.userCenter.menu_style == 1) return 'row';
                if (this.userCenter.menu_style == 2) return 'grid dir-left-wrap';
                return '';
            },
            // #ifdef H5
            isShowSetting: function () {
                return this.$storage.getStorageSync('platform') !== 'wechat';
            }
            // #endif
        },
        onLoad() { this.$commonLoad.onload();
            // #ifdef H5
            this.$jwx.config();
            // #endif
        },
        onShow() {
            this.$event.on(this.$const.EVENT_USER_LOGIN).then(() => {
                uni.redirectTo({
                    url: `/pages/user-center/user-center`
                });
            });
            if (this.$user.isLogin()) {
                this.$store.dispatch('user/refresh');
            }
            this.$nextTick().then(() => {
                this.$store.dispatch('userCenter/data');
            });
        },
        methods: {
            router(name) {
                let url = '';
                if (name === '我的收藏') {
                    url = `/pages/favorite/favorite`;
                } else {
                    url = `/pages/foot/index/index`;
                }
                uni.navigateTo({
                    url: url
                });
            },
            // #ifdef H5
            routerGo() {
                uni.navigateTo({
                    url: '/pages/registered/setting'
                });
            },
            // #endif

        },
        filters: {
            showNum(name, userInfo) {
                if (name === '我的收藏') {
                    return userInfo && userInfo.favorite ? userInfo.favorite : 0;
                } else {
                    return userInfo && userInfo.footprint ? userInfo.footprint : 0;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
.app-my-service {
    width: #{702rpx};
    border-radius: #{16rpx};
    margin: #{24rpx} auto;
    box-shadow: 0 0 #{8rpx} rgba(0, 0, 0, .05);
    background: #fff;

    .title {
        padding: #{32rpx} #{32rpx} #{16rpx};
    }

    .list {
        .item {
            .icon {
                width: #{50rpx};
                height: #{50rpx};
                display: block;
            }

            .arrow {
                width: #{12rpx};
                height: #{22rpx};
            }
        }
    }

    .list.row {
        .item-container {
            padding: #{20rpx} #{32rpx};
        }

        .icon {
            margin-right: #{16rpx};
        }
    }

    .list.grid {
        .item {
            width: 25%;

            .icon {
                margin-bottom: #{28rpx};
            }

            .name {
                padding: 0 #{12rpx};
                font-size: $uni-font-size-weak-one;
                color: $uni-general-color-one;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        .item-container {
            padding: #{24rpx} 0;
        }
    }
}
.u-foot-box {
    position: relative;
    height: 104upx;
}
.u-icon {
    margin-top: 44upx;
    width: 40upx;
    height: 40upx;
    margin-right: 17upx;
}
.u-foot-item {
    font-size: #{26rpx};
    color: #666666;
    padding-top: #{14rpx};
    width: 50%;
}
.u-foot-info {
    text-align: center;
}
.u-foot-num {
    font-size: 32upx;
    margin-bottom: 10upx;
}
.u-line {
    height: 40upx;
    width: 2upx;
    background-color: #666666;
    position: absolute;
    top: 45upx;
    left: 50%;
    margin-left: -2upx;
}
// #ifdef H5
.bd-setting {
    width: 702upx;
    height: 100upx;
    line-height: 100upx;
    border-radius: 16upx;
    padding: 0 33upx;
    background: #ffffff;
    margin: 24upx auto;
    box-shadow: 0 0 #{8rpx} rgba(0, 0, 0, .05);
    font-size:32upx;
    color: #353535;
}
.bd-arrow {
    width: #{12rpx};
    height: #{22rpx};
}
// #endif
</style>