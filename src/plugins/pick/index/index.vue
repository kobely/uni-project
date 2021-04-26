<template>
    <app-layout>
        <view class="index" v-show="loading">

            <view class="search dir-left-nowrap cross-center">
                <view class="input dir-left-nowrap main-center cross-center" @click="navigator('/plugins/pick/search/search')">
                    <image class="search-img" src="/static/image/icon/search.png"></image>
                    <text class="search-text">搜索</text>
                </view>
            </view>

            <view class="billing" :style="{backgroundImage: `url(${background})`}">
                <view class="rule" @click="goRoute()">
                    活动规则
                </view>
            </view>

            <view class="activity" :style="{background: form.bg.color, color: form.text.color}" v-if="Object.keys(activity).length>0">
                {{activity.rule_price}}元，任选{{activity.rule_num}}件
            </view>

            <view class="list">
                <view class="item dir-left-nowrap" v-for="(item) in list" :key="item.id"  @click="navigator('/plugins/pick/detail/detail?goods_id=' + item.id)">
                    <view v-if="item.goods_stock == 0 && appSetting.is_show_stock === 1" class="out-dialog">
                        <image :src="appSetting.is_use_stock == 1 ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                    </view>
                    <image class="image" :src="item.cover_pic"></image>
                    <view class="content dir-top-nowrap main-between">
                        <text class="name t-omit-two">{{item.name}}</text>
                        <view class="information dir-left-nowrap main-between cross-bottom">
                            <view class="num">
                                <view class="value">
                                    <text class="price" :style="{'color': getTheme.color}">￥{{item.price}}</text>
                                    <text class="original_price">￥{{item.original_price}}</text>
                                </view>
                                <text class="sales" v-if="item.is_negotiable != 1 && isShowSalesNum == 1">{{item.sales}}</text>
                            </view>
                            <view>
                                <view class="go-button" :style="{'background-color': item.buy_goods_auth ? getTheme.background : '#999999'}">去凑单</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <view v-if="list.length === 0">
                <app-no-goods background="" title="没有任何活动商品哦~"></app-no-goods>
            </view>
            <view class="safe-area-inset-bottom">
                <view class="u-bottom-height" ></view>
            </view>
            <view v-if="list.length > 0" class="safe-area-inset-bottom u-bottom-fixed">
                <view class="generate dir-left-nowrap main-center cross-center"
                      @click="navigator('/plugins/pick/pond/pond?rule_num='+ activity.rule_num + '&pick_activity_id=' + activity.id)">
                    <view class="generate-img" :style="{'background-color': getTheme.background}"></view>
                    <text class="generate-text" :style="{'color': getTheme.color}">生成凑单</text>
                    <view class="pond-length" :style="{'background-color': getTheme.background}" v-if="storage > 0">{{storage | getStorage }}</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import appNoGoods from '../../../components/page-component/app-no-goods/app-no-goods.vue';
    import {mapGetters, mapState} from "vuex";

    export default {
        name: "index",
        data() {
            return {
                list: [],
                background: '',
                form: {
                    bg: {
                        color: ''
                    },
                    text: {
                        color: ''
                    }
                },
                activity: {
                    rule_price: 0,
                    rule_num: 0
                },
                page: 1,
                page_count: 1,
                storage: [],
                loading: false,
				disable: 'disable'
            }
        },
        components: {
            appNoGoods
        },
        methods: {
            getList() {
                this.$showLoading();
                this.loading = false;
                this.$request({
                    url: this.$api.pick.goods_list,
                    method: 'get'
                }).then(e => {
                    if (e.code === 0) {
                        this.$hideLoading();
                        let { bg_url, list, form, activity, pagination } = e.data;
                        this.background = bg_url;
                        this.form = form;
                        this.activity = activity;
                        this.list = list;
                        this.loading = true;
                        this.page_count = pagination.page_count;
                    } else if (e.code === 1) {
                        uni.showModal({
                            title: '提示',
                            content: e.msg,
                            success: function() {
                                uni.navigateBack();
                            }
                        });
                        this.$hideLoading();
                    }
                }).catch(() => {
                    this.$hideLoading();
                });
            },

            navigator(str) {
                uni.navigateTo({
                    url: str
                });
            },
            goRoute() {
                uni.navigateTo({
                    url: `/pages/rules/index?url=${encodeURIComponent(this.$api.pick.goods_list)}&key=rule`,
                });
            },


            async getBottom() {
                const e = await this.$request({
                    url: this.$api.pick.goods_list,
                    method: 'get',
                    data: {
                        page: this.page
                    }
                });
                if (e.code === 0) {
                    this.list.push(...e.data.list);
                }
            },

            async getCart() {
                const e = await this.$request({
                    url: this.$api.pick.list
                });
                if (e.code === 0) {
                    let data = e.data.list;
                    this.storage = 0;
                    for (let i = 0; i < data.length;i++) {
                        this.storage = Number(this.storage) +  Number(data[i].num);
                    }
                }
            }
        },
        onLoad() { this.$commonLoad.onload();
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
            this.getList();
        },
        onReachBottom() {
            if (this.page_count > this.page) {
                this.page++;
                this.getBottom();
            }
        },
        computed: {
            ...mapState({
                isShowSalesNum: state => state.mallConfig.mall.setting.is_show_sales_num,
                appImg: state => state.mallConfig.__wxapp_img.mall,
                appSetting: state => state.mallConfig.mall.setting,
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            })
        },
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            // 分享朋友圈beta
            return this.$shareTimeline({
                title: this.$children[0].navigationBarTitle,
                query: {
                } // 此处填写页面的参数
            });
        },
        // #endif
        filters: {
            getStorage(data) {
                if (data > 99) {
                    return '99+';
                } else {
                    return data;
                }
            }
        },
        onShow() {
            this.getCart();
        },
        onShareAppMessage() {
            return this.$shareAppMessage({
                path: '/plugins/pick/index/index',
                title: this.$children[0].navigationBarTitle,
            });
        }
    }
</script>

<style scoped lang="scss">
    .index {
    }
    .billing {
        width: #{750upx};
        height: #{280upx};
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: relative;
    }

    .rule {
        font-size: #{22upx};
        color: #ffffff;
        display: inline-block;
        position: absolute;
        background-color: rgba(0, 0, 0, .4);
        padding: #{10upx 18upx};
        top: #{24upx};
        right: #{24upx};
        border-radius: #{24upx};
    }

    .activity {
        width: #{750upx};
        height: #{70upx};
        text-align: center;
        line-height: #{70upx};
        font-size: #{26upx};
    }

    .search {
        height: #{88upx};
        width: #{750upx};
        background-color: #efeff4;
    }

    .input {
        width: #{702upx};
        height: #{56upx};
        margin-left: #{24upx};
        background-color: #ffffff;
        border-radius: #{28upx};

    }

    .pond {
        margin-left: #{35upx};
    }

    .pond-img {
        width: #{34upx};
        height: #{34upx};
        margin-right: #{8upx};
    }

    .pond-text {
        font-size: #{26upx};
        color: #ff4544;
    }

    .search-img {
        width: #{26upx};
        height: #{26upx};
        margin-right: #{6upx};
    }

    .search-text {
        color: #999999;
        font-size: #{26upx};
        margin-left: #{6upx};
    }

    .list {
        padding-bottom: #{150upx};
    }

    .item {
        padding: #{24upx};
        border-bottom: #{1upx} solid #eeeeee;
        background-color: #ffffff;
        position: relative;
        .out-dialog {
            width: #{220rpx};
            height: #{220rpx};
            border-radius: #{16rpx};
            position: absolute;
            top: #{24rpx};
            left: #{24rpx};
            z-index: 10;
            background-color: rgba(0,0,0,.5);
            image {
                width: #{220rpx};
                height: #{220rpx};
                border-radius: #{16rpx};
            }
        }
    }

    .image {
        width: #{220upx};
        height: #{220upx};
        border-radius: #{16upx};
        flex-shrink: 0;
    }

    .content {
        width: #{478upx};
        margin-left: #{24upx};
        height: #{228upx};
    }
    .name {
        font-size: #{28upx};
        color: #353535;
    }

    .generate {
        height: #{96upx};
        width: #{750upx};
        border-top: #{1upx} solid #e2e2e2;
        position: relative;
    }
    .generate-img {
        width: #{34upx};
        height: #{34upx};
        margin-right: #{7.5upx};
        background-image: url("../image/pond.png");
        background-size: 101% 101%;
        background-repeat: no-repeat;
    }

    .generate-text {
        margin-left: #{7.5upx};
        font-size: #{32upx};
    }

    .information {
        margin-bottom: #{12upx};
    }

    .num {
        margin-bottom: #{8upx};
    }

    .sales {
        font-size: #{24upx};
        color: #999999;
        line-height: 1;
    }

    .value {
        margin-bottom: #{18upx};
        line-height: 1;
    }
    .price {
        font-size: #{32upx};
        line-height: 1;
    }
    .original_price {
        text-decoration:line-through;
        font-size: #{24upx};
        line-height: 1;
        color: #999999;
        margin-left: #{10upx};
    }
    .go-button {
        height: #{56upx};
        line-height: #{56upx};
        width: #{130upx};
        font-size: #{28upx};
        border-radius: #{28upx};
        text-align: center;
        color: #ffffff;
    }
    .pond-length {
        width: #{20upx};
        height: #{20upx};
        color: #ffffff;
        text-align: center;
        line-height: #{20upx};
        position: absolute;
        left: 40%;
        top: 40%;
        border-radius: 50%;
        transform: translate(40%, -50%);
        font-size: #{13upx};
    }
    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1500;
        background-color: #ffffff;
    }
    .u-bottom-height-0 {
        height: 96upx;
    }
</style>
