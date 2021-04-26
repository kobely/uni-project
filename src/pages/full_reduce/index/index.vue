<template>
    <app-layout :overflow="false">
        <template v-if="hasActivity && activityLoading">
            <view class="search dir-left-nowrap main-between cross-center">
                <view class="input dir-left-nowrap main-center cross-center" @click="search">
                    <view class="search-icon"></view>
                    <view class="text">搜索</view>
                </view>
                <view class="icon" @click="setSwitch">
                    <image class="icon-img" :src="style_switch ? '../image/list-2.png' : '../image/list-1.png' "></image>
                </view>
            </view>
            <view class="rule" id="rule" :class="[is_fixed ? 'rule-fixed' : 'rule-no-fixed']" :style="{'background': getTheme.background_gradient_l}">
                <view class="rule-top dir-left-nowrap main-between cross-top">
                    <view class="icon"></view>
                    <view class="text">
                        <template v-if="rule_type === 1">
                            <block v-for="(item, index) in rule"
                                   :key="index">
                                满{{item.min_money}}{{item.discount_type === '1' ? '减' + item.cut : '打' + item.discount + '折'}}{{index !== rule.length - 1 ? ', ' : ''}}
                            </block>
                        </template>
                        <template v-else-if="rule_type === 2">
                            每满{{rule.min_money}}减{{rule.cut}}
                        </template>
                    </view>
                </view>
                <view class="dir-left-nowrap main-between">
                    <view class="time dir-left-nowrap cross-center">
                        <view class="time-icon"></view>
                        <view class="time-text">距离活动结束仅剩：{{time_str.day}}天{{time_str.hou}}时{{time_str.min}}分</view>
                    </view>
                    <view class="rule-text" @click="goRouter">活动规则</view>
                </view>
            </view>

            <scroll-view scroll-x id="cats" class="cats  dir-left-nowrap">
                <view class="cats-item"
                      :style="{'background-color': item.active === true ? getTheme.background : ''}"
                      :class="item.active === true ? 'cats-item-active' : 'cats-item-no'"
                      v-for="(item, index) in cats"
                      @click="active(item)"
                      :key="index">
                    {{item.name}}
                </view>
            </scroll-view>

            <view>
                <template v-if="style_switch">
                    <u-water-fall v-model="flowList" ref="waterFall" :theme="getTheme">
                    </u-water-fall>
                </template>
                <template v-else>
                    <view class="goods-item dir-left-nowrap " v-for="(item ,index) in flowList" @click="routeGood(item)" :key="index">
                        <image class="goods-pic" :src="item.cover_pic"></image>
                        <view class="goods-cont dir-top-nowrap main-between">
                            <view>
                                <view class="goods-name t-omit-two"> {{item.name}}</view>
                                <view class="goods-vip" v-if="item.is_level == 1 && item.is_negotiable != 1">
                                    <app-member-price
                                        :price="item.level_price"
                                        :theme="getTheme"
                                    ></app-member-price>
                                </view>
                                <view class="goods-vip" v-if="item.vip_card_appoint.discount">
                                    <app-sup-vip
                                        :discount="item.vip_card_appoint.discount"
                                        :is_vip_card_user="item.vip_card_appoint.is_vip_card_user"
                                    ></app-sup-vip>
                                </view>
                            </view>
                            <view class="dir-left-nowrap main-between">
                                <view>
                                    <view :style="{'color': getTheme.color}" class="price">{{item.price_content}}</view>
                                    <view class="sales">{{item.sales}}</view>
                                </view>
                                <view
                                    v-if="item.goods_stock !== 0"
                                    @click.stop="buyProduct(item)"
                                    :style="{'background-color': getTheme.background}"
                                    :class="'app-button-icon-cart box-grow-0 app-button-icon'"
                                ></view>
                            </view>
                        </view>
                    </view>
                </template>
                <view class="u-loading-list" v-if="bottomLoading">加载中...</view>
            </view>
            <view class="no-empty main-center" v-if="!loading && flowList.length === 0">
                <app-no-goods title="该分类下无相关内容哦~" background="#f7f7f7"></app-no-goods>
            </view>
        </template>
        <template v-else-if="!hasActivity && activityLoading">
            <view class="no-empty main-center" >
                <app-no-goods title="暂无满减商品" background="#f7f7f7"></app-no-goods>
            </view>
        </template>
        <app-attr :goods="goods" :attrGroupList="goods.attr_groups" :theme="getTheme" :show="attrShow"></app-attr>
    </app-layout>
</template>

<script>
    import { mapGetters, mapState } from 'vuex';
    import uWaterFall from '../u-waterfall.vue';
    import appDiyGoodsList from "../../../components/page-component/app-diy-goods-list/app-diy-goods-list.vue";
    import appNoGoods from "../../../components/page-component/app-no-goods/app-no-goods.vue";
    import appAttr from '../../../components/page-component/app-attr/app-attr.vue';

    export default {
        name: "index",

        data() {
            return {
                flowList: [],
                page: 1,
                app_share_title: '',
                app_share_pic: null,
                page_count: 1,
                rule_type: 1,
                rule: null,
                cats: [],
                cat_id: null,
                time_str: {
                    day: '00',
                    hou: '00',
                    min: '00'
                },
                timing: null,
                is_fixed: false,
                style_switch: false,
                loading: false,
                hasActivity: true,
                activityLoading: false,
                is_no_scroll: true,
                goods: {},
                attrShow: 0,
                no_active: false,
                bottomLoading: false
            }
        },

        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme'
            }),
            ...mapState('gConfig', {
                windowWidth: state => state.systemInfo.windowWidth
            })
        },

        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                path: '/pages/full_reduce/index/index',
                title: this.app_share_title ? this.app_share_title : this.$children[0].navigationBarTitle,
                imageUrl: this.app_share_pic ? this.app_share_pic :  '',
            });
        },
        // #endif
        methods: {
            async getListData(status) {
                this.loading = true;
                const e = await this.$request({
                    url: this.$api.full_reduce.list,
                    data: {
                        page: this.page,
                        cat_id: this.cat_id
                    }
                });
                this.loading = false;
                if (e.code === 0) {
                    this.no_active = false;
                    let list = e.data.list;
                    if (status === true) {
                        this.flowList.push(...list);
                    } else {
                        this.flowList = list;
                    }

                    this.page_count = e.data.pagination.page_count;
                    let page = this.page;
                    if (page++ === this.page_count) {
                        this.bottomLoading = false;
                    }
                }
            },

            async getIndex() {
                const e = await this.$request({
                    url: this.$api.full_reduce.index
                });
                this.activityLoading = true;
                if (e.code === 0) {
                    this.app_share_pic = e.data.app_share_pic;
                    this.app_share_title = e.data.app_share_title;
                    if (this.$validation.empty(e.data)) {
                        this.hasActivity = false;
                    } else {
                        this.rule = e.data.rule;
                        this.rule_type = e.data.rule_type;
                        if (this.$validation.date(e.data.time)) {
                            this.getTiming(e.data.time);
                        }
                    }
                }
            },

            async getCats() {
                const e = await this.$request({
                    url: this.$api.default.cat_list
                });
                if (e.code === 0) {
                    this.cats = e.data.list;
                    this.cat_id = this.cats[0].id;
                }
            },

            active(item) {
                this.bottomLoading = false;
                if (!this.no_active) {
                    this.no_active = true;
                    this.cats.forEach((item) => {
                        item.active = false;
                    });
                    item.active = true;
                    this.page = 1;
                    this.cat_id = item.id;
                    this.flowList = [];
                    if (this.style_switch) {
                        this.$refs.waterFall.emptyList();
                    }
                    uni.pageScrollTo({
                        scrollTop: 0,
                        duration: 500
                    });
                    this.getListData();
                }
            },

            getTiming(data) {
                clearInterval(this.timing);
                let time_str = new Date(data.replace(/-/g, '/'));
                this.now_time(time_str);
                this.timing = setInterval(() => {
                    this.now_time(time_str);
                }, 1000);
            },

            now_time(time_str) {
                let time = time_str.getTime() - new Date().getTime();
                if (time < 0) {
                    clearInterval(this.timing);
                }
                let day = parseInt(time/1000/60/60/24);
                let hou = parseInt((time/1000/60/60)%24);
                let min = parseInt((time/1000/60)%60);
                this.time_str.day = day < 10 ? '0' + day : day;
                this.time_str.hou = hou < 10 ? '0' + hou : hou;
                this.time_str.min = min < 10 ? '0' + min : min;
            },

            goRouter() {
                uni.navigateTo({
                    url: `/pages/rules/index?url=${encodeURIComponent(this.$api.full_reduce.index)}&key=content`
                });
            },

            routeGood(item) {
                uni.navigateTo({
                    url: item.page_url
                });
            },

            search() {
                uni.navigateTo({
                    url: `/pages/full_reduce/search/search`
                })
            },

            setSwitch() {
                this.style_switch = !this.style_switch;
            },

            buyProduct(item) {
                this.goods = item;
                this.attrShow = Math.random();
            },
        },

        onReachBottom() {
            if (this.page < this.page_count) {
                this.page++;
                this.bottomLoading = true;
                this.getListData(true);
            }
        },

        onload() {
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
        },

        mounted() {
            this.getIndex().then(() => {
                this.getCats().then(() => {
                    this.getListData();
                });
            });
        },

        components: {
            uWaterFall,
            appDiyGoodsList,
            appNoGoods,
            appAttr
        },

        onHide() {
            clearInterval(this.timing);
        },

        onUnload() {
            clearInterval(this.timing);
        },
    }
</script>

<style scoped lang="scss">
    .search {
        height: 88upx;
        width: 750upx;
        border-bottom: 1upx solid #d6d6db;
        position: fixed;
        top: 0;
        background-color: #efeff4;
        z-index: 1000;
        padding: 0 24upx;
        .icon {
            width: 60upx;
            height: 60upx;
            padding: 15upx;
        }
        .icon-img {
            width: 100%;
            height: 100%
        }

        .input {
            width: 620upx;
            height: 56upx;
            border-radius: 28upx;
            background-color: #ffffff;
            border: 1upx solid #eaeaef;
            .search-icon {
                width: 25upx;
                height: 25upx;
                background-size: 100% 100%;
                background-image: url("../../../static/image/icon/search.png");
                background-repeat: no-repeat;
                margin-right: 5upx;
            }
            .text {
                font-size: 25upx;
                color: #b2b2b2;
                margin-left: 5upx;
            }
        }
    }
    .cats {
        height: 100upx;
        line-height: 100upx;
        width: 750upx;
        background-color: #ffffff;
        border-top:1upx solid #eaeaef;
        border-bottom: 1upx solid #eaeaef;
        white-space:nowrap;
        padding-left: 20upx;
        position: sticky;
        top: 88upx;
        z-index: 1000;
        .cats-item {
            display: inline-block;
            margin-right: 32upx;
            height: 58upx;
            line-height: 58upx;
            border-radius: 29upx;
            font-size: 26upx;
            padding: 0 28upx;
        }
        .cats-item-active {
            color: #ffffff;
        }
        .cats-item-no {
            color: #666666;
        }
    }

    .cats-fixed {
        position: fixed;
        top: 88upx;
        z-index: 1000;
    }
    .rule-fixed {
        margin-top: 188upx;
    }
    .rule-no-fixed {
        margin-top: 88upx;
    }
    .rule {
        padding: 36upx 24upx 30upx 24upx;
        .rule-top {
            margin-bottom: 30upx;
        }
        .icon {
            width: 54upx;
            height: 28upx;
            background-image: url("../image/icon.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            margin-top: 7upx;
        }
        .text {
            width: 648upx;
            font-weight: bold;
            font-size: 28upx;
            color:#FFFFFF;
            margin-left: 8upx;
        }
        .rule-text {
            width: 120upx;
            height: 40upx;
            border-radius: 20upx;
            background-color: rgba(0,0,0,.4);
            color: #ffffff;
            font-size:22upx;
            line-height: 40upx;
            text-align: center;
        }
        .time-icon {
            width: 26upx;
            height: 26upx;
            background-image: url("../image/time.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            margin-right: 8upx;
        }
        .time-text {
            font-size: 26upx;
            color: #ffffff;
            line-height: 1;
        }
    }

    .no-empty {
        width: 100%;
        margin-top: 150upx;
    }

    .goods-item {
        padding: 24upx;
        background-color: #ffffff;
        border-bottom: 1upx solid #e2e2e2;
        .goods-pic {
            width: 200upx;
            height: 200upx;
            border-radius: 13upx;
            margin-right: 24upx;
        }
        .goods-cont {
            width: 478upx;
            .goods-name {
                font-size: 26upx;
                color: #353535;
            }
            .goods-vip {
                margin-top: 8upx;
            }
            .app-button-icon-cart {
                background-image: url('../../../static/image/icon/cats.png');
            }
            .app-button-icon {
                width: #{56rpx};
                height: #{56rpx};
                display: block;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
            }
            .sales {
                font-size: 22upx;
                color: #b0b0b0;
            }
            .price {
                font-size: 24upx;
            }
        }
    }
    .u-loading-list {
        height: 64upx;
        line-height: 64upx;
        text-align: center;
        color: #b0b0b0;
        font-size: 24upx;
    }
</style>