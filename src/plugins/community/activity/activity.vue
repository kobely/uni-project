<template>
    <app-layout>
        <scroll-view @scrolltolower="getMore" :scroll-top="scrollTop" scroll-y @scroll="scroll" :style="{'height':`${windowHeight}px`}">
            <app-head v-if="getTheme" :theme="getTheme"></app-head>
            <!-- 团长信息 -->
            <view @click="toList" class="middleman dir-top-nowrap main-center">
                <view class="location t-omit">{{middleman.location}}</view>
                <view v-if="middleman.id > 0" class="middleman-info dir-left-nowrap">
                    <image class="avatar" :src="middleman.avatar"></image>
                    <view class="user-info">
                        <view class="t-omit">{{middleman.name}} {{setting.middleman}} {{middleman.mobile}}</view>
                        <view>
                            <image class="icon" src="./../image/address.png"></image>
                            <text>提货地址:{{middleman.province}}<text v-if="middleman.province != middleman.city">{{middleman.city}}</text>{{middleman.district}}{{middleman.detail}}</text>
                        </view>
                    </view>
                </view>
                <view v-if="middleman.is_allow_change == 1" class="space">距离最近{{space}}</view>
                <image v-if="middleman.is_allow_change == 1" class="arrow-image" src="/static/image/icon/arrow-right-white.png"></image>
            </view>
            <!-- 团购活动状态 -->
            <view v-if="activity.time > 0" class="time dir-left-nowrap cross-center">
                <image class="icon" src="./../image/timeline.png"></image>
                <view>距离本次团购活动开始还有{{d}}天{{h}}时{{m}}分{{s}}秒</view>
            </view>
            <view v-if="activity.activity_status == 2" class="time">
                <text>团购已结束，下次记得早点来哦</text>
            </view>
            <view v-if="activity.activity_status == 3" class="time">
                <text>本次团购活动已经下架</text>
            </view>
            <view class="status-area" v-if="activity.activity_status == 1">
                <view class="status dir-top-nowrap main-center cross-center">
                    <view v-if="activity.condition == 0" class="end-time">{{activity.end_at}}结束</view>
                    <view v-else class="condition main-between">
                        <view>
                            <text v-if="activity.num - activity.condition_count > 0">还差<text class="end-time">{{activity.num - activity.condition_count}}</text>{{activity.condition == 1 ? '人':'件商品'}}</text>拼团成功
                        </view>
                        <view class="end-time">{{activity.end_at}}结束</view>
                    </view>
                    <!-- 进度条 -->
                    <view class="progress" v-if="activity.condition > 0">
                        <view :style="{'width': `${activity.rate}%`,'backgroundImage':`url(${bonusImg.progress})`}"></view>
                    </view>
                    <!-- 下单人数 -->
                    <view class="main-center cross-center buy-user">
                        <view class="user-list dir-right-nowrap">
                            <image v-for="(item,index) in user_list" :key="index" class="avatar" :src="item.avatar"></image>
                        </view>
                        <view class="sales">
                            <text>{{activity.user_num}}</text>
                            人已抢<text>{{activity.all_sales > activity.condition_count ? activity.all_sales : activity.condition_count}}</text>件
                        </view>
                    </view>
                    <!-- 最新下单状态 -->
                    <view v-if="user_list.length > 0" class="main-center cross-center new-buy">
                        <image class="avatar" :src="user_list[user_list.length - 1].avatar"></image>
                        <view>{{end_time}}参与团购</view>
                    </view>
                </view>
            </view>
            <scroll-view :scroll-into-view="`scroll-${activeIndex}`" scroll-with-animation v-show="activity.id > 0" scroll-x class="app-scroll" :class="activity.time > 0 || activity.activity_status == 2 ? 'no-ing' : ''">
                <text class="app-item" v-for="(item, index) in nav_list"
                      :key="item.id" :id="`scroll-${index}`"
                      :style="{'color': cat_id == item.id ? getTheme.color : '', 'border-color': cat_id == item.id ? getTheme.border : ''}"
                      :class="cat_id == item.id ? 'app-active-item'  : ''"
                      @click="changeStatus(item.id, index)"
                >{{item.name}}</text>
            </scroll-view>
            <!-- 商品 -->
            <view class="list">
                <view @click="toGoods(item)" class="goods dir-left-nowrap" v-for="item in list" :key="item.id">
                    <view v-if="item.goods_stock === 0" class="out-dialog">
                        <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                    </view>
                    <image class="cover" mode='aspectFill' :src="item.cover_pic"></image>
                    <view class="info">
                        <view class="name t-omit-two">{{item.name}}</view>
                        <view class="sale" :style="{'color': getTheme.color, 'border-color': getTheme.border}">
                            <view style="position: relative">
                                {{item.sales}}
                                <view class="sale-bg" :style="{'background-color': getTheme.background}"></view>
                            </view>
                            <view class="stock">剩{{item.goods_stock}}{{item.goodsWarehouse.unit}}</view>
                        </view>
                        <view class="price" :style="{'color': getTheme.color}">￥{{item.min_price}}</view>
                        <view :style="{'background-color': item.buy_goods_auth ? getTheme.background : '#9999999'}"  class="cart" @click.stop="toBuy(item)" v-if="activity && activity.activity_status == 1 && item.goods_stock > 0">
                        </view>
                    </view>
                </view>
            </view>
            <!-- 购物车 -->
            <view @click="openCart" v-if="showCart && cart.length > 0" class="bg">
                <view class="dialog cart-dialog" @click.stop="" style="padding: 0;">
                    <view v-if="activity.full_price.length > 0" class="cart-discount main-center">
                        <view :style="{'color': getTheme.color}" v-for="(item,index) in activity.full_price" :key="index"><view class="discount-bg" :style="{'background-color': getTheme.background}"></view><text v-if="index > 0">,</text>满{{item.full_price}}减{{item.reduce_price}}</view>
                    </view>
                    <view class="title main-between">
                        <view>已选商品</view>
                        <view class="dir-right-nowrap cross-center" @click.stop="clearAll">
                            <view style="color: #999999">清空购物车</view>
                            <image src="/static/image/icon/delete.png"></image>
                        </view>
                    </view>
                    <view class="goods-list">
                        <view v-if="item.num > 0 || item.num == ''" class="goods dir-left-nowrap" v-for="(item,index) in cart" :key="item.id">
                            <image class="cover" mode='aspectFill' :src="item.pic_url"></image>
                            <view class="info">
                                <view class="name t-omit-two" :style="{'color': item.is_exist == 1 ? '#353535': '#999999'}">{{item.name}}</view>
                                <view class="attr">
                                    <text class="attr-group" v-for="(attr,idx) in item.attr_list" :key="idx">
                                        {{attr.attr_group_name}}：{{attr.attr_name}}
                                    </text>
                                </view>
                                <view style="height: 60rpx"></view>
                                <view class="price" v-if="item.is_exist == 1" :style="{'color': getTheme.color}">￥{{item.price}}</view>
                                <view class="price" v-else style="color: #353535">商品已失效</view>
                                <view class="app-add-subtract dir-left-nowrap cross-center">
                                    <image class="app-icon" @click.stop="_calcValue(index,'minus')"
                                           :src="item.is_exist == 0 ? '/static/image/cart/unreducible.png' : '/static/image/icon/subtract.png'"
                                          ></image>
                                    <view class="app-value">
                                        <input v-model="item.num" v-if="item.is_exist == 1" @blur.stop="_onBlur(index)" type="number">
                                        <view v-else>{{item.num}}</view>
                                    </view>
                                    <image class="app-icon" v-show="is_loading" @load="imgLoad"  @click.stop="_calcValue(index,'plus')"
                                           :src="item.num >= 99 || item.is_exist == 0 ? '/static/image/cart/can-add.png' : '/static/image/icon/add-but.png'"
                                           :style="{'background-color': getTheme.background}"></image>
                                </view>
                            </view>
                        </view>
                    </view>

                    <view v-if="is_exist" class="discount main-center" style="background-color: #f0f0f0;color: #999999;">
                        <view>{{is_exist}}件商品已失效</view>
                    </view>
                    <view class="cart-placeholder cart-list-placeholder" :class="{'again-placeholder': is_exist}"></view>
                </view>
            </view>
            <!-- 买家信息 -->
            <view id="input" v-if="cart.length > 0 && activity.activity_status == 1" class="input-info">
                <view class="input-item">
                    <view class="input-label">手机号</view>
                    <view class="input">
                        <input placeholder-style="color:#999999" type="number" placeholder="请输入手机号" v-model="mobile">
                    </view>
                </view>
                <view class="input-item" @click="inputRemark = false">
                    <view class="input-label">备注</view>
                    <view class="input" v-if="inputRemark" :style="{'color': remark ? '#353535': '#999999'}">{{remark ? remark : '请输入备注'}}</view>
                    <view class="input" v-else>
                        <input placeholder-style="color:#999999" :focus="!inputRemark" @blur="inputRemark = true" maxlength="50" v-model="remark" placeholder="请输入备注">
                    </view>
                </view>
            </view>
            <!-- 结算栏 -->
            <view v-if="cart.length > 0 && activity.activity_status == 1 && activity.full_price.length > 0" class="discount main-center">
                <view :style="{'color': getTheme.color}" v-for="(item,index) in activity.full_price" :key="index"><view class="discount-bg" :style="{'background-color': getTheme.background}"></view><text v-if="index > 0">,</text>满{{item.full_price}}减{{item.reduce_price}}</view>
            </view>
            <view v-if="cart.length > 0 && activity.activity_status == 1" class="cart-placeholder" :class="{'more-placeholder': is_middleman}"></view>
            <view v-if="cart.length > 0 && activity.activity_status == 1" class="cart-item main-between cross-center">
                <view @click="openCart" class="cart-left dir-left-nowrap">
                    <view class="cart-icon">
                        <image src="./../image/cart.png" class="cart"></image>
                        <view :style="{'background-color': getTheme.background}">{{cartLength > 99 ? '99+':cartLength}}</view>
                    </view>
                    <view class="price-info main-center dir-top-nowrap">
                        <view class="total-price t-omit">总计<text :style="{'color': getTheme.color}">￥{{total < 0 ? '0.00':total}}</text></view>
                        <view class="minus-price t-omit">已减<text :style="{'color': getTheme.color}">￥{{minus}}</text></view>
                    </view>
                </view>
                <view @click="toSubmit" class="cart-right" :style="{'background-color': getTheme.background}">确认下单</view>
            </view>
            <!-- 悬浮按钮 -->
            <view class="dialog-btn">
                <view v-if="is_middleman" @click="toIndex">
                    <image src="./../image/user-index.png"></image>
                </view>
                <view @click="toOrder">
                    <image src="./../image/user-order.png"></image>
                </view>
                <view @click="toUser">
                    <image src="./../image/user-center.png"></image>
                </view>
                <view @click="showHiddenClick">
                    <image src="./../image/user-share.png"></image>
                </view>
            </view>
            <u-attr
                v-if="goods"
                v-model="attrShow"
                :theme="getTheme"
                :goods="goods"
                :checked="selectAttr"
                @check="attr"
                :is_show_left="false"
                :is_show_right="false"
            >
                <template slot="right">
                    <!-- 购物车信息 -->
                    <view class="attr-bottom dir-left-nowrap">
                        <view class="box-grow-1 dir-left-nowrap cross-center">
                            <view class="total-price">总计<text :style="{'color': getTheme.color}">￥{{selectAttr ? attr_price : goods.price}}</text></view>
                        </view>
                        <view class="box-grow-1 u-add-btn main-center cross-center"
                              :style="{'background': getTheme.background_gradient_btn}" @click="add">加入购物车
                        </view>
                    </view>
                </template>
            </u-attr>
            <!-- 推荐 -->
            <view v-if="recommendDialog" @click="recommendDialog=!recommendDialog" class="bg">
                <view class="dialog" @click.stop="" :animation="animationData">
                    <view v-show="showOther" @click="recommendDialog=!recommendDialog" class="end-close main-center cross-center">
                        <image src="/static/image/icon/icon-close.png"></image>
                    </view>
                    <view class="end-title">当前团购已结束</view>
                    <view class="end-recommend main-center cross-center">
                        <view class="end-line"></view>
                        <view>为您推荐</view>
                        <view class="end-line"></view>
                    </view>
                    <view class="end-sec-title">以下{{recommend.count}}个商品正在团购</view>
                    <view class="main-center recommend-goods">
                        <image v-if="index < 3" v-for="(item,index) in recommend.goods_list" :key="index" :src="item.cover_pic"></image>
                    </view>
                    <view v-show="showOther" class="to-activity" :style="{'background-color': getTheme.background}" @click="toActivity">去看看</view>
                </view>
            </view>
            <!-- 分享 -->
            <view>
                <app-share-qr-code @share="hShareAppMessage"
                                   :posterUrl="'/plugins/community/poster/poster?activity_id='+id + '&middleman_id='+middleman.user_id"
                                   :hasPosterNav="showShare" v-model="showShare" :url="poster"
                                   title="生成活动海报"></app-share-qr-code>
            </view>
        </scroll-view>
        <app-close v-if="showClose" :toBack="true" @update="getMall"></app-close>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appHead from '../components/app-head.vue';
    import appShareQrCode from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
    import uAttr from '../../../components/page-component/goods/u-attr.vue';
    import AppClose from '../../../components/basic-component/app-close/app-close.vue';

    export default {
        data() {
            return {
                activeIndex: 0,
                nav_list: [],
                cat_id: -1,
                id: null,
                showCart: false,
                is_loading: false,
                submitLock: false,
                recommendDialog: false,
                showShare: false,
                stopLoad: false,
                showOther: false,
                more: false,
                is_middleman: false,
                share: false,
                default: false,
                inputRemark: true,
                cartLength: 0,
                windowHeight: 0,
                is_exist: 0,
                page: 1,
                poster: '',
                mobile: '',
                remark: '',
                d: '',
                h: '',
                m: '',
                s: '',
                selectAttr: {},
                animationData: {},
                animation: {},
                attr_price: '0.00',
                number: 1,
                space: '0m',
                display: 'none',
                // attrShow: 0,
                attrShow: false,
                scrollTop: 0,
                scrollHeight: 0,
                goods: null,
                timeInterval: null,
                buyBool: true,
                longitude: '',
                latitude: '',
                activity: {
                    rate: 0
                },
                middleman: {},
                setting: {},
                recommend: {},
                list: [],
                cart: [],
                user_list: [],
                template_message_list: [],
                end_time: '1小时前',
                title: '',
                total: '0.00',
                minus: '0.00',
                middleman_id: 0,
                first: true,
                showClose: false,
                is_open: false,
				disable: 'disable'
            }
        },
        components: {
            appShareQrCode,
            appHead,
            uAttr,
            AppClose
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme'
            }),
            ...mapState({
                community: state => state.mallConfig.__wxapp_img.community,
                bonusImg: state => state.mallConfig.__wxapp_img.bonus,
                appImg: state => state.mallConfig.__wxapp_img.mall,
                appSetting: state => state.mallConfig.mall.setting,
                userInfo: state => state.user.info
            }),
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            if(options.activity_id) {
                this.id = options.activity_id;
            }
            if(options.id) {
                this.id = options.id;
            }
            this.title = options.title;
            uni.setNavigationBarTitle({
                title: options.title,
            });
            uni.getSystemInfo({
                success: function (res) {
                    that.windowHeight = res.windowHeight;
                }
            });
            // #ifndef H5
            uni.getLocation({
                success: (e) => {
                    uni.hideLoading();
                    that.longitude = e.longitude;
                    that.latitude = e.latitude;
                    if(this.$storage.getStorageSync('middleman_info')) {
                        let middleman = this.$storage.getStorageSync('middleman_info');
                        if(middleman.id > 0) {
                            if(options.middleman_id) {
                                that.middleman_id = options.middleman_id;
                                that.share = true;
                            }else {
                                that.middleman_id = middleman.user_id
                            }
                        }
                    }else {
                        if(options.middleman_id) {
                            that.middleman_id = options.middleman_id;
                            that.share = true;
                        }
                    }
                    that.$showLoading({
                        type: 'global',
                        text: '加载中...'
                    });
                    that.getSetting();
                },
                fail: () => {
                    uni.hideLoading();
                    uni.showModal({
                        title: '提示',
                        content: '获取位置信息失败，需要授权获取您的位置信息',
                        showCancel: false,
                        confirmText: '打开授权',
                        success(e) {
                            if (e.confirm) {
                                uni.openSetting({});
                            }
                        }
                    });
                },
            });
            // #endif
            // #ifdef H5
            if (that.$jwx.isWechat()) {
                that.$jwx.getLocation({
                    success(res) {
                        that.longitude = e.longitude;
                        that.latitude = e.latitude;
                        if(this.$storage.getStorageSync('middleman_info')) {
                            let middleman = this.$storage.getStorageSync('middleman_info');
                            if(middleman.id > 0) {
                                if(options.middleman_id) {
                                    that.middleman_id = options.middleman_id;
                                    that.share = true;
                                }else {
                                    that.middleman_id = middleman.user_id
                                }
                            }
                        }else {
                            if(options.middleman_id) {
                                that.middleman_id = options.middleman_id;
                                that.share = true;
                            }
                        }
                        that.$showLoading({
                            type: 'global',
                            text: '加载中...'
                        });
                        that.getSetting();
                    },
                    fail: function () {
                        uni.showToast({
                            title: '请开启手机位置权限',
                            icon: 'none',
                            duration: 1000
                        });
                    },
                })
            }else {
                // uni.getLocation({
                //     success: (e) => {
                //         uni.hideLoading();
                        that.longitude = 11;
                        that.latitude = 22;
                        if(this.$storage.getStorageSync('middleman_info')) {
                            let middleman = this.$storage.getStorageSync('middleman_info');
                            if(middleman.id > 0) {
                                if(options.middleman_id) {
                                    that.middleman_id = options.middleman_id;
                                    that.share = true;
                                }else {
                                    that.middleman_id = middleman.user_id
                                }
                            }
                        }else {
                            if(options.middleman_id) {
                                that.middleman_id = options.middleman_id;
                                that.share = true;
                            }
                        }
                        that.$showLoading({
                            type: 'global',
                            text: '加载中...'
                        });
                        that.getSetting();
                    // },
                    // fail: (e) => {
                    //     uni.showToast({
                    //         title: '请开启手机位置权限',
                    //         icon: 'none',
                    //         duration: 1000
                    //     });
                    // },
             //   });
            }
            that.$jwx.getLocation({
                success: (e) => {
                    uni.hideLoading();
                    that.longitude = e.longitude;
                    that.latitude = e.latitude;
                    if(this.$storage.getStorageSync('middleman_info')) {
                        let middleman = this.$storage.getStorageSync('middleman_info');
                        if(middleman.id > 0) {
                            if(options.middleman_id) {
                                that.middleman_id = options.middleman_id;
                                that.share = true;
                            }else {
                                that.middleman_id = middleman.user_id
                            }
                        }
                    }else {
                        if(options.middleman_id) {
                            that.middleman_id = options.middleman_id;
                            that.share = true;
                        }
                    }
                    that.$showLoading({
                        type: 'global',
                        text: '加载中...'
                    });
                    that.getSetting();
                },
                fail: function () {
                    uni.showToast({
                        title: '请开启手机位置权限',
                        icon: 'none',
                        duration: 1000
                    });
                },
            })
            // #endif
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            });
            // #endif
        },
        onUnload() {
            this.stopLoad = true;
            clearInterval(this.timeInterval);
        },
        onHide() {
            this.stopLoad = true;
            clearInterval(this.timeInterval);
        },
        onShow() {
            let that = this;
            if(this.stopLoad) {
                this.stopLoad = false;
                if(this.$storage.getStorageSync('bind')) {
                    let bindInfo = this.$storage.getStorageSync('bind');
                    if(bindInfo > 0) {
                        that.$showLoading({
                            type: 'global',
                            text: '加载中...'
                        });
                        that.middleman = {};
                        that.middleman_id = 0;
                        if(this.$storage.getStorageSync('middleman_info')) {
                            let middleman = this.$storage.getStorageSync('middleman_info');
                            if(middleman.id > 0) {
                                that.middleman_id = middleman.user_id;
                            }
                            that.getActivity('reload');
                        }else {
                            that.getActivity('reload');
                        }
                        this.$storage.removeStorageSync('bind');
                    }else {
                        that.getActivity('reload');
                    }
                }else {
                    if(that.id > 0) {
                        that.getActivity();
                    }
                }
            }
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.hShareAppMessage();
        },
        // #endif
        methods: {
            hShareAppMessage(s = false) {
                return this.$shareAppMessage({
                    title: this.setting.app_share_title ? this.setting.app_share_title : this.title,
                    imageUrl: this.setting.app_share_pic ? this.setting.app_share_pic : this.list[0].cover_pic,
                    path: "/plugins/community/activity/activity",
                    params: {
                        id: this.id,
                        user_id: this.userInfo.options.user_id,
                        middleman_id: this.middleman.user_id
                    }
                }, s);
            },
            changeStatus(id, index) {
                this.cat_id = id;
                this.page = 1;
                if (index < 2) {
                    this.activeIndex = 0
                } else {
                    this.activeIndex = index - 2
                }
                uni.showLoading({
                    mask: true,
                    title: '加载中'
                });
                this.getList(this.middleman.user_id);
            },
            requestCats(middleman_id) {
                this.$request({
                    url: this.$api.community.cats,
                    data: {
                        id: this.id,
                        middleman_id: middleman_id ? middleman_id : this.middleman.user_id
                    }
                }).then(res => {
                    if (res.code === 0) {
                        this.nav_list = res.data.list;
                        this.getList(middleman_id);
                    }
                });
            },
            toSubmit() {
                this.showClose = false;
                setTimeout(()=>{
                    this.showClose = true;
                })
            },
            getMall(e) {
                this.is_open = e.is_open == 1 ? true : false;
                if(this.is_open) {
                    this.allBuy();
                }
            },
            scroll(e) {
                this.scrollHeight = e.detail.scrollTop;
            },
            getMore() {
                if(this.more) {
                    this.page++;
                    uni.showLoading({
                        mask: true,
                        title: '加载更多'
                    });
                    this.getOther();
                    this.more = false;
                }
            },
            getOther() {
                let that = this;
                let para = {
                    id: that.id,
                    middleman_id: that.middleman.user_id,
                    page: that.page,
                }
                if(that.cat_id > 0) {
                    para.cat_id = that.cat_id
                }
                that.$request({
                    url: that.$api.community.activity_goods,
                    data: para
                }).then(response=>{
                    uni.hideLoading();
                    that.$hideLoading();
                    if(response.code === 0) {
                        if(response.data.list.length === 20) {
                            that.more = true;
                        }
                        that.list = that.list.concat(response.data.list);
                    }
                })
            },
            openCart() {
                this.showCart = !this.showCart;
                this.stopLoad = true;
                if(this.showCart == false) {
                    this.stopLoad = false;
                    this.getActivity();
                }
            },
            toList() {
                if(this.middleman.is_allow_change === '0') {
                    return false;
                }
                uni.navigateTo({
                    url: '/plugins/community/captain/captain?longitude=' + this.longitude + '&latitude='+ this.latitude
                });
            },
            showHiddenClick() {
                this.showShare = !this.showShare;
            },
            toGoods(item) {
                this.stopLoad = true;
                uni.navigateTo({
                    url: '/plugins/community/goods/goods?goods_id=' + item.id + '&middleman_id=' + this.middleman.user_id
                });
            },
            toIndex() {
                this.stopLoad = true;
                uni.navigateTo({
                    url: '/plugins/community/index/index'
                });
            },
            toOrder() {
                this.stopLoad = true;
                uni.navigateTo({
                    url: '/plugins/community/order/order?is_user=1'
                });
            },
            toUser() {
                this.stopLoad = true;
                uni.navigateTo({
                    url: '/pages/user-center/user-center'
                });
            },
            toActivity() {
                this.stopLoad = true;
                uni.redirectTo({
                    url: '/plugins/community/activity/activity?id=' + this.recommend.activity_id
                });
            },
            attr(e) {
                this.selectAttr = e.item;
                this.number = e.number;
                this.attr_price = (+this.selectAttr.price * +this.number).toFixed(2);
            },
            imgLoad() {
                this.is_loading = true;
            },
            allBuy() {
                if(this.submitLock) {
                    return false;
                }
                this.showCart = false;
                this.scrollTop = this.scrollHeight
                if(this.default) {
                    this.$nextTick().then(() => {
                        this.scrollTop = 9999999;
                        this.default = false;
                    })
                    uni.showToast({
                        title: '请确认手机号',
                        icon: 'none',
                        duration: 1000
                    });
                    return false;
                }
                if(this.mobile.length == 11 && (/0?(1)[0-9]{10}/.test(this.mobile))) {
                    this.$subscribe(this.template_message_list).then(res => {
                        this.submit();
                    }).catch(() => {
                        this.submit();
                    });
                }else {
                    this.$nextTick().then(() => {
                        this.scrollTop = 9999999;
                    })
                    this.stopLoad = false;
                    this.getActivity();
                    uni.showToast({
                        title: '请输入正确的手机号码',
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            submit() {
                uni.showLoading({
                    mask: true,
                    title: '提交订单...'
                });
                this.stopLoad = true;
                this.submitLock = true;
                let goods_list = [];
                for(let i in this.cart) {
                    if(this.cart[i].is_exist == 1) {
                        let para = {};
                        para.id = this.cart[i].goods_id;
                        para.goods_attr_id = this.cart[i].goods_attr_id;
                        para.num = this.cart[i].num;
                        para.cart_id = this.cart[i].id;
                        para.attr = this.cart[i].attr_list;
                        para.cat_id = 0;
                        para.form_data = [];
                        goods_list.push(para);
                    }
                }
                if(goods_list.length === 0) {
                    uni.showToast({
                        title: '请添加有效商品',
                        icon: 'none',
                        duration: 1000
                    });
                    return false
                }
                let mch_list = [{
                    mch_id: 0,
                    activity_id: this.id,
                    middleman_id: this.middleman.user_id,
                    goods_list: goods_list,
                    distance: 0,
                    remark: this.remark,
                    order_form: [],
                    use_integral: 0,
                    user_coupon_id: 0
                }];
                let form = {};
                form.list = mch_list;
                form.address_id = 0;
                form.address = {
                    name: this.userInfo.nickname,
                    mobile: this.mobile
                };
                this.$request({
                    url: this.$api.community.order_submit,
                    data: {
                        form_data: JSON.stringify(form)
                    },
                    method: 'post'
                }).then(response => {
                    if (response.code === 0) {
                        this.getPayOrderId(response.data.queue_id, response.data.token);
                    } else {
                        this.submitLock = false;
                        this.stopLoad = false;
                        uni.hideLoading();
                        uni.showModal({
                            title: '提示',
                            content: response.msg,
                            showCancel: false,
                        });
                    }
                }).catch(e => {
                    this.submitLock = false;
                    this.stopLoad = false;
                    uni.hideLoading();
                    uni.showModal({
                        title: '提示',
                        content: e.errMsg,
                        showCancel: false,
                    });
                });
            },
            getPayOrderId(queue_id, token) {
                this.$request({
                    url: this.$api.order.pay_data,
                    method: 'post',
                    data: {
                        queue_id: queue_id,
                        token: token,
                    },
                }).then(response => {
                    if (response.code === 0) {
                        if (response.data.retry && response.data.retry === 1) {
                            this.getPayDataTimer = setTimeout(() => {
                                this.getPayOrderId(queue_id, token);
                            }, 1000);
                        } else {
                            uni.hideLoading();
                            this.cart = [];
                            this.pay(response.data);
                        }
                    } else {
                        this.submitLock = false;
                        uni.hideLoading();
                        uni.showModal({
                            title: '提示',
                            content: response.msg,
                            showCancel: false,
                        });
                    }
                }).catch(e => {
                    this.submitLock = false;
                    uni.hideLoading();
                    uni.showModal({
                        title: '提示',
                        content: e.errMsg,
                        showCancel: false,
                    });
                });
            },
            pay(data) {
                this.$storage.removeStorageSync('middleman_info');
                this.$payment.pay(data.id).then(() => {
                    this.submitLock = false;
                    let url = '/plugins/community/order/order';
                    uni.navigateTo({
                        url: `/pages/order-submit/pay-result?payment_order_union_id=${data.id}&order_page_url=${url}`
                    });
                }).catch(() => {
                    this.submitLock = false;
                    this.toOrder();
                });
            },
            _calcValue(index,type) {
                if(type === 'minus') {
                    this.cart[index].num--;
                }else if(type === 'plus') {
                    this.cart[index].num++;
                }
                this._onBlur(index);
            },
            _onBlur(index) {
                this.total = 0;
                this.cartLength = 0;
                for(let i in this.cart) {
                    this.total = (+this.total + (+this.cart[i].price*this.cart[i].num));
                    this.cartLength += +this.cart[i].num;
                }
                let minus = 0;
                for(let i in this.activity.full_price) {
                    if(+this.activity.full_price[i].full_price < +this.total || +this.activity.full_price[i].full_price == +this.total) {
                        if(this.activity.full_price[i].reduce_price > minus) {
                            minus = +this.activity.full_price[i].reduce_price;
                        }
                    }
                }
                this.total = (+this.total - minus).toFixed(2);
                this.minus = minus.toFixed(2);
                if(this.cart[index].num == 0) {
                    this.delCart(index)
                }else {
                    this.$request({
                        url: this.$api.community.cart_edit,
                        data: {
                            list: JSON.stringify(this.cart)
                        },
                    });
                }
            },
            clearAll() {
                let cart = [];
                for(let i in this.cart) {
                    cart.push(this.cart[i].id)
                }
                this.cart = [];
                this.showCart = false;
                this.$request({
                    url: this.$api.community.cart_delete,
                    data: {
                        cart_id_list: JSON.stringify(cart),
                    },
                }).then(() => {
                    this.stopLoad = false;
                    this.getActivity();
                })
            },
            delCart(index) {
                let list = [];
                list.push(this.cart[index].id)
                this.cart.splice(index,1);
                this.total = 0;
                this.cartLength = 0;
                for(let i in this.cart) {
                    this.total = (+this.total + (+this.cart[i].price*this.cart[i].num));
                    this.cartLength += +this.cart[i].num
                }
                let minus = 0;
                for(let i in this.activity.full_price) {
                    if(+this.activity.full_price[i].full_price < +this.total || +this.activity.full_price[i].full_price == +this.total) {
                        if(this.activity.full_price[i].reduce_price > minus) {
                            minus = +this.activity.full_price[i].reduce_price
                        }
                    }
                }
                this.total = (+this.total - minus).toFixed(2);
                this.minus = minus.toFixed(2);
                if(this.cart.length === 0) {
                    this.showCart = false
                }
                this.$request({
                    url: this.$api.community.cart_delete,
                    data: {
                        cart_id_list: list,
                    },
                }).then(() => {
                    this.stopLoad = false;
                    this.getActivity();
                }).catch(() => {
                    this.attrShow = false;
                    uni.hideLoading();
                });
            },
            add() {
                uni.showLoading({
                    mask: true,
                    title: '加入购物车'
                });
                let para = {
                    activity_id: this.id,
                    goods_id: this.selectAttr.goods_id,
                    goods_attr_id: this.selectAttr.id,
                    num: this.number
                }
                this.$request({
                    url: this.$api.community.cart_add,
                    data: para,
                    method: 'post'
                }).then(response => {
                    if(response.code === 0) {
                        this.addResult(response.data.queue_id, response.data.token);
                    } else {
                        uni.hideLoading();
                        this.attrShow = false;
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    this.attrShow = false;
                    uni.hideLoading();
                });
            },
            addResult(queue_id, token) {
                this.$request({
                    url: this.$api.community.cart_result,
                    method: 'post',
                    data: {
                        queue_id: queue_id,
                        token: token,
                    },
                }).then(response => {
                    if (response.code === 0) {
                        if (response.data && response.data.retry === 1) {
                            this.getResult = setTimeout(() => {
                                this.addResult(queue_id, token);
                            }, 1000);
                        } else {
                            this.attrShow = false;
                            let index = -1;
                            for(let i in this.cart) {
                                if(this.cart[i].goods_id == this.selectAttr.goods_id && this.cart[i].goods_attr_id == this.selectAttr.id) {
                                    index = i;
                                }
                            }
                            if(index > -1) {
                                this.cart[index].num += +this.number;
                            } else {
                                let para = {
                                    activity_id: this.id,
                                    community_goods_id: this.goods.id,
                                    goods_id: this.selectAttr.goods_id,
                                    goods_attr_id: this.selectAttr.id,
                                    num: this.number,
                                    name: this.goods.name,
                                    attr_list: this.selectAttr.attr_list,
                                    pic_url: this.selectAttr.pic_url,
                                    id: 0,
                                    price: this.selectAttr.price,
                                    is_exist: 1
                                }
                                this.cart.push(para);
                            }
                            this.total = 0;
                            this.cartLength = 0;
                            for(let item of this.cart) {
                                this.total = (+this.total + (+item.price*item.num));
                                this.cartLength += +item.num;
                            }
                            let minus = 0;
                            for(let i in this.activity.full_price) {
                                if(+this.activity.full_price[i].full_price < +this.total || +this.activity.full_price[i].full_price == +this.total) {
                                    if(this.activity.full_price[i].reduce_price > minus) {
                                        minus = +this.activity.full_price[i].reduce_price;
                                    }
                                }
                            }
                            this.total = (+this.total - minus).toFixed(2);
                            this.minus = minus.toFixed(2);
                            uni.hideLoading();
                            setTimeout(()=>{
                                this.goods = null
                            })
                        }
                    } else {
                        uni.hideLoading();
                        uni.showModal({
                            title: '提示',
                            content: response.msg,
                            showCancel: false
                        });
                    }
                }).catch(e => {
                    this.attrShow = false;
                    uni.hideLoading();
                    uni.showModal({
                        title: '提示',
                        content: e.errMsg,
                        showCancel: false
                    });
                });
            },
            toBuy(item) {
				if (!item.buy_goods_auth) {
                    this.$tips.showToast({
                        title: '您暂无权限购买该商品',
                        icon: 'none'
                    });
                    return;
				}
                this.selectAttr = null;
                this.goods = item;
                this.attrShow = true;
            },
            getCart() {
                let that = this;
                if(that.stopLoad) {
                    return false;
                }
                that.$request({
                    url: that.$api.community.cart,
                    data: {
                        middleman_id: that.middleman.user_id,
                        activity_id: that.activity.id,
                    }
                }).then(response=>{
                    if(that.stopLoad) {
                        return false;
                    }
                    if(response.code === 0) {
                        that.total = 0;
                        that.cartLength = 0;
                        that.cart = response.data.list;
                        that.is_exist = 0;
                        for(let i in that.cart) {
                            if(that.cart[i].is_exist == 0) {
                                that.is_exist++;
                            }
                            that.total = (+that.total + (+that.cart[i].price*that.cart[i].num));
                            that.cartLength += +that.cart[i].num;
                        }
                        let minus = 0;
                        for(let i in that.activity.full_price) {
                            if(+that.activity.full_price[i].full_price < +that.total || +that.activity.full_price[i].full_price == +that.total) {
                                if(that.activity.full_price[i].reduce_price > minus) {
                                    minus = +that.activity.full_price[i].reduce_price;
                                }
                            }
                        }
                        that.total = (+that.total - minus).toFixed(2);
                        that.minus = minus.toFixed(2);

                    }else {
                        that.stopLoad = true;
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                        if(response.msg === '所选活动已下架') {
                            setTimeout(()=>{
                                uni.navigateBack({});
                            },1000);
                        }
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            getTime(time) {
                if(time > 86399) {
                    this.d = Math.floor(time / 86400);
                    time = time - (86400*this.d);
                }else {
                    this.d = 0;
                }
                if(time > 3599) {
                    this.h = Math.floor(time / 3600);
                    if(this.h < 10) {
                        this.h = '0' + this.h;
                    }
                    time = time - (3600*this.h);
                }else {
                    this.h = '00'
                }
                if(time > 59) {
                    this.m = Math.floor(time / 60);
                    if(this.m < 10) {
                        this.m = '0' + this.m;
                    }
                    time = time - (60*this.m);
                }else {
                    this.m = '00';
                }
                if(time < 60) {
                    this.s = time;
                    if(this.s < 10) {
                        this.s = '0' + this.s;
                    }
                }
            },
            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.community.setting,
                }).then(response=>{
                    if(response.code === 0) {
                        that.head = that.community.a;
                        switch(that.getTheme.key) {
                            case 'b':
                                that.head = that.community.b;
                                break;
                            case 'c':
                                that.head = that.community.c;
                                break;
                            case 'd':
                                that.head = that.community.d;
                                break;
                            case 'e':
                                that.head = that.community.e;
                                break;
                            case 'g':
                                that.head = that.community.g;
                                break;
                            case 'h':
                                that.head = that.community.h;
                                break;
                            case 'i':
                                that.head = that.community.i;
                                break;
                        }
                        that.setting = response.data;
                        that.getActivity();
                    }else {
                        that.$hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            getList(middleman_id) {
                let that = this;
                let para = {
                    type: 1,
                    id: that.id,
                }
                para.middleman_id = middleman_id ? middleman_id: that.middleman.user_id
                if(that.cat_id > 0) {
                    para.cat_id = that.cat_id
                }
                that.$request({
                    url: that.$api.community.activity_goods,
                    data: para
                }).then(response=>{
                    uni.hideLoading();
                    that.$hideLoading();
                    if(response.data.list.length === 0) {
                        that.page = 1;
                        that.stopLoad = true;
                        uni.showToast({
                            title: '活动商品异常，正在返回活动主页',
                            icon: 'none',
                            duration: 1000
                        });
                        setTimeout(()=>{
                            uni.redirectTo({
                                url: '/plugins/community/list/list'
                            });
                        },1000);
                        return false;
                    }
                    that.list = response.data.list;
                    response.data.list.length < 20 ? that.more = false : that.more = true;
                })
            },
            getActivity(string) {
                let that = this;
                let para = {
                    id: that.id,
                    longitude: that.longitude,
                    latitude: that.latitude
                }
                if(that.middleman_id > 0) {
                    para.middleman_id = that.middleman_id
                }
                that.$request({
                    url: that.$api.community.user_activity,
                    data: para
                }).then(response=>{
                    if(response.code === 0) {
                        if(that.nav_list.length == 0 || string == 'reload') {
                            that.requestCats(response.data.middleman_info.user_id);
                        }
                        if(!that.mobile && response.data.last_mobile) {
                            that.mobile = response.data.last_mobile;
                            that.default  = true;
                        }
                        that.activity = response.data.activity;
                        that.is_middleman = response.data.is_middleman;
                        that.middleman = response.data.middleman_info;
                        if(that.middleman_id == 0) {
                            if(this.$storage.getStorageSync('middleman_info')) {
                                let middleman = this.$storage.getStorageSync('middleman_info');
                                if(middleman.id > 0) {
                                    that.middleman = middleman;
                                }
                            }
                        }
                        that.space = ~~that.middleman.distance +'m';
                        if(that.middleman.distance > 1000) {
                            that.space = (that.middleman.distance / 1000).toFixed(1) + 'km';
                        }
                        if(that.share) {
                            this.$storage.setStorageSync('middleman_info',that.middleman);
                        }
                        that.user_list = response.data.user_list;
                        if(that.user_list.length > that.activity.user_num){
                            that.user_list = that.user_list.slice(0,that.activity.user_num);
                        }
                        that.template_message_list = response.data.template_message_list;
                        if(that.activity.activity_status == 1) {
                            if(!that.stopLoad) {
                                setTimeout(function(){
                                    that.getActivity();
                                },8000)
                            }
                            that.getCart();
                            let end_time = Math.floor(that.user_list[that.user_list.length - 1].time / 60);
                            if(end_time > 60) {
                                that.end_time = '1小时前';
                            }else if(end_time == 0) {
                                that.end_time = '刚刚';
                            }else {
                                that.end_time = end_time+ '分钟前';
                            }
                        }
                        if(that.activity.activity_status == 2 && response.data.recommend_activity.activity_id > 0) {
                            setTimeout(function(){
                                that.recommend = response.data.recommend_activity;
                                that.recommendDialog = true;
                                var animation = uni.createAnimation({
                                    duration: 1000,
                                    timingFunction: 'ease',
                                })
                                that.animation = animation;

                                setTimeout(function(){
                                    animation.bottom(0).step();
                                    that.animationData = animation.export();
                                    setTimeout(function(){
                                        that.showOther = true;
                                    },1500);
                                },200);
                            },800);
                        }
                        if(that.activity.time > 0) {
                            let time = that.activity.time;
                            that.timeInterval = setInterval(() =>{
                                that.getTime(time);
                                time--;
                                if(time == 0) {
                                    clearInterval(that.timeInterval);
                                    that.getActivity();
                                }
                            },1000);
                        }
                    }else {
                        that.stopLoad = true;
                        if(response.msg === '周边没有活动可参加') {
                            uni.showToast({
                                title: '周边没有活动可参加，正在返回活动主页',
                                icon: 'none',
                                duration: 1000
                            });
                            setTimeout(()=>{
                                uni.redirectTo({
                                    url: '/plugins/community/list/list'
                                });
                            },1000);
                        }else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    }
                }).catch(() => {
                    uni.hideLoading();
                    that.$hideLoading();
                });
            },
        },
        // #ifdef MP-WEIXIN
        onShareTimeline: function() {
            return this.$shareTimeline({
                title: this.share_title ? this.share_title : this.title,
                query: {
                    id: this.id,
                    user_id: this.userInfo.options.user_id,
                    middleman_id: this.middleman.user_id
                }
            });
        }
        // #endif
    }
</script>

<style scoped lang="scss">
    .app-scroll {
        height: 80rpx;
        background-color: #fff;
        position: relative;
        width: 702rpx;
        margin: 0 24rpx 24rpx;
        border-radius: 16rpx;
        white-space: nowrap;
        font-size: 26rpx;
        padding-top: 20rpx;
        &.no-ing {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
        .app-item {
            display: inline-block;
            padding-bottom: 10rpx;
            padding-right: 5rpx;
            margin-left: 40rpx;
            margin-right: 15rpx;
            &.app-active-item {
                border-bottom: 2rpx solid;
            }
        }
    }

    .middleman {
        margin-top: -360rpx;
        height: 190rpx;
        color: #ffffff;
        padding: 0 35rpx;
        position: relative;
        .space {
            color: #fff;
            font-size: 22rpx;
            position: absolute;
            top: 45rpx;
            right: 30rpx;
        }
        .arrow-image {
            margin-left: 36rpx;
            width: #{12rpx};
            height: #{24rpx};
            position: absolute;
            top: 50%;
            right: 30rpx;
            margin-top: -12rpx;
        }
        .location {
            font-size: 40rpx;
            width: 70%;
            margin-bottom: 15rpx;
            margin-top: -10rpx;
        }
        .middleman-info {
            font-size: 26rpx;
            .avatar {
                width: 58rpx;
                height: 58rpx;
                border-radius: 50%;
                margin-right: 20rpx;
                flex-shrink: 0;
            }
            .user-info {
                .icon {
                    height: 25rpx;
                    width: 25rpx;
                    margin-right: 6rpx;
                    color: #ff4544;
                }
            }
        }
    }
    .time {
        padding: 0 36rpx;
        color: #ff4544;
        height: 90rpx;
        line-height: 90rpx;
        margin: 0 24rpx;
        width: 702rpx;
        border-top-left-radius: 16rpx;
        border-top-right-radius: 16rpx;
        background-color: #F2F2F2;
        position: relative;
        z-index: 2;
        font-size: 24rpx;
        .icon {
            color: #ff4544;
            width: 24rpx;
            height: 24rpx;
            margin-right: 10rpx;
        }
    }
    .status-area {
        width: 702rpx;
        margin: 0 24rpx;
        padding-bottom: 24rpx;
        border-radius: 16rpx;
        background-color: #f7f7f7;
        position: relative;
        z-index: 2;
        .status {
            background-color: #fff;
            border-radius: 16rpx;
            padding: 24rpx;
            .end-time {
                color: #ff4544;
                text-align: center;
                font-size: 24rpx;
            }
            .condition {
                color: #353535;
                font-size: 24rpx;
                width: 100%;
                .end-time {
                    color: #ff4544;
                }
            }
            .progress {
                width: #{654rpx};
                background-color: #f0f0f0;
                border-radius: #{10rpx};
                height: #{20rpx};
                position: relative;
                margin: 15rpx 0;
                overflow: hidden;
                view {
                    border-radius: #{10rpx};
                    height: #{20rpx};
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 2;
                }
            }
            .buy-user {
                height: 58rpx;
                .user-list {
                    image {
                        width: 58rpx;
                        height: 58rpx;
                        margin-left: -14rpx;
                        border-radius: 50%;
                        border: 2rpx solid #ffffff;
                    }
                }
                .sales {
                    font-size: 24rpx;
                    line-height: 58rpx;
                    height: 58rpx;
                    margin-left: 14rpx;
                    text {
                        color: #ff4544;
                    }
                }
            }
            .new-buy {
                margin-top: 20rpx;
                color: #999999;
                font-size: 24rpx;
                image {
                    width: 60rpx;
                    height: 60rpx;
                    border-radius: 50%;
                    display: block;
                    margin-right: 20rpx;
                }
            }
        }
    }
    .list {
        margin: 0 24rpx;
        width: 702rpx;
        .goods {
            background-color: #fff;
            border-radius: 16rpx;
            width: 702rpx;
            height: 220rpx;
            margin-bottom: 20rpx;
            position: relative;
            z-index: 2;
            .out-dialog {
                width: #{220rpx};
                height: #{220rpx};
                border-radius: #{16rpx};
                position: absolute;
                top: 0;
                left: 0;
                z-index: 10;
                background-color: rgba(0,0,0,.5);
                image {
                    width: #{220rpx};
                    height: #{220rpx};
                    border-radius: #{16rpx};
                }
            }
            .cover {
                height: 220rpx;
                width: 220rpx;
                border-radius: 16rpx;
                margin-right: 15rpx;
            }
            .info {
                padding: 20rpx 0;
                position: relative;
                .name {
                    width: 445rpx;
                    // #ifndef MP-ALIPAY
                    height: 72rpx;
                    // #endif
                    // #ifdef MP-ALIPAY
                    height: 66rpx;
                    // #endif
                    font-size: 28rpx;
                }
                .sale {
                    height: 30rpx;
                    line-height: 28rpx;
                    font-size: 22rpx;
                    margin-top: 18rpx;
                    display: inline-block;
                    position: relative;
                    >view {
                        padding: 0 10rpx;
                        border: 2rpx solid;
                        display: inline-block;
                    }
                    .sale-bg {
                        padding: 0;
                        position: absolute;
                        top: 0;
                        left: 0;
                        opacity: 0.1;
                        border-top-left-radius: 15rpx;
                        border-bottom-left-radius: 15rpx;
                        border: 0;
                        height: 100%;
                        width: 100%;
                    }
                    view:first-of-type {
                        border-right: 0;
                        border-top-left-radius: 15rpx;
                        border-bottom-left-radius: 15rpx;
                    }
                    .stock {
                        border-top-right-radius: 15rpx;
                        border-bottom-right-radius: 15rpx;
                        border-left: 0;
                        background-color: #fff;
                    }
                }
                .price {
                    font-size: 32rpx;
                    position: absolute;
                    bottom: 20rpx;
                    left: 0;
                }
                .cart {
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    background-image:url("../../../static/image/icon/cats.png");
                    border: 0;
                    border-radius: 50%;
                    position: absolute;
                    bottom: 20rpx;
                    right: 0;
                    width: 80rpx;
                    height: 80rpx;
                    z-index: 2;
                }
            }
        }
    }
    .cart-placeholder {
        height: 450rpx;
        &.cart-list-placeholder {
            height: 150rpx;
            &.again-placeholder {
                height: 210rpx;
            }
        }
        &.more-placeholder {
            height: 540rpx;
        }
    }
    .total-price {
        width: 350rpx;
        text {
            font-size: 32rpx;
        }
    }
    .minus-price {
        width: 350rpx;
    }
    .discount {
        position: fixed;
        bottom: 145rpx;
        left: 0;
        height: 60rpx;
        line-height: 60rpx;
        width: 100%;
        font-size: 24rpx;
        z-index: 10;
        background-color: #fff;
        .discount-bg {
            position: fixed;
            bottom: 145rpx;
            left: 0;
            height: 60rpx;
            line-height: 60rpx;
            width: 100%;
            opacity: 0.1;
            z-index: 10;
        }
        text {
            margin-right: 10rpx;
        }
    }
    .cart-item {
        position: fixed;
        bottom: 0;
        left: 0;
        height: 145rpx;
        width: 100%;
        padding: 0 16rpx 24rpx;
        background-color: #fff;
        z-index: 20;
        box-shadow: 0 0 #{10rpx} rgba(0,0,0,.3);
        .cart-left {
            font-size: 24rpx;
            color: #353535;
            height: 74rpx;
            line-height: 74rpx;
            .cart-icon {
                position: relative;
                margin-right: 45rpx;
                image {
                    width: 74rpx;
                    height: 74rpx;
                    border-radius: 50%;
                }
                view {
                    position: absolute;
                    top: -5rpx;
                    left: 52rpx;
                    height: #{34rpx};
                    line-height: #{34rpx};
                    border-radius: #{17rpx};
                    color: #fff;
                    padding: 0 #{10rpx};
                }
            }
            .price-info {
                height: 74rpx;
                >view {
                    height: 37rpx;
                    line-height: 37rpx;
                }
            }
        }
        .cart-right {
            font-size: 28rpx;
            color: #fff;
            height: 78rpx;
            line-height: 78rpx;
            border-radius: 39rpx;
            padding: 0 50rpx;
        }
    }
    .dialog-btn {
        position: fixed;
        bottom: 175rpx;
        left: 30rpx;
        z-index: 10;
        >view {
            margin-top: 10rpx;
            width: 80rpx;
            height: 80rpx;
            image {
                width: 80rpx;
                height: 80rpx;
            }
        }
    }
    .bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.3);
        z-index: 18;
        .dialog {
            background-color: #fff;
            border-top-left-radius: 16rpx;
            border-top-right-radius: 16rpx;
            position: fixed;
            bottom: -600rpx;
            left: 0;
            width: 100%;
            z-index: 19;
            padding: 0 24rpx;
            &.cart-dialog {
                bottom: 0
            }
            .cart-discount {
                height: 60rpx;
                line-height: 60rpx;
                width: 100%;
                font-size: 24rpx;
                z-index: 10;
                border-top-left-radius: 16rpx;
                border-top-right-radius: 16rpx;
                position: relative;
                .discount-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.1;
                }
                text {
                    margin-right: 10rpx;
                }
            }
            .title {
                height: 84rpx;
                line-height: 84rpx;
                font-size: 26rpx;
                padding: 0 24rpx;
                color: #353535;
                image {
                    display: block;
                    width: 40rpx;
                    height: 40rpx;
                    margin-right: 12rpx;
                }
            }
            .goods-list {
                padding: 0 24rpx;
                max-height: 510rpx;
                overflow: auto;
            }
            .goods {
                background-color: #fff;
                border-radius: 8rpx;
                width: 702rpx;
                margin-bottom: 20rpx;
                padding-top: 20rpx;
                border-top: 2rpx solid #e2e2e2;
                position: relative;
                z-index: 22;
                &:first-of-type {
                    border-top: 0;
                    padding-top: 0;
                }
                .cover {
                    height: 180rpx;
                    width: 180rpx;
                    border-radius: 8rpx;
                    margin-right: 25rpx;
                }
                .info {
                    position: relative;
                    width: 492rpx;
                    .name {
                        width: 445rpx;
                        max-height: 72rpx;
                        font-size: 28rpx;
                        margin-bottom: 20rpx;
                    }
                    .attr {
                        font-size: 24rpx;
                        color: #999999;
                        .attr-group {
                            margin-left: 10rpx;
                            &:first-of-type {
                                margin-left: 0;
                            }
                        }
                    }
                    .price {
                        font-size: 30rpx;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                    }
                    .app-add-subtract {
                        height: #{60rpx};
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        .app-icon {
                            height: #{44rpx};
                            width: #{44rpx};
                            background-size: 100% 100%;
                            background-repeat: no-repeat;
                        }
                        .app-value {
                            height: #{60rpx};
                            width: #{88rpx};
                            input,view {
                                height: #{60rpx};
                                width: #{88rpx};
                                font-size: #{26rpx};
                                color: #353535;
                                background-color: #ffffff;
                                text-align: center;
                            }
                            view {
                                line-height: #{60rpx};
                                color: #999999;
                            }
                        }
                    }
                }
            }
            .end-close {
                position: fixed;
                bottom: 488rpx;
                right: 0;
                z-index: 20;
                width: 80rpx;
                height: 80rpx;
                padding: 25rpx;
                image {
                    width: 30rpx;
                    height: 30rpx;
                }
            }
            .end-title {
                margin-top: 40rpx;
                font-size: 32rpx;
                color: #353535;
                text-align: center;
            }
            .end-recommend {
                font-size: 24rpx;
                color: #999999;
                height: 70rpx;
                .end-line {
                    width: 40rpx;
                    height: 2rpx;
                    background-color: #999999;
                    margin: 0 15rpx;
                }
            }
            .end-sec-title {
                font-size: 28rpx;
                color: #353535;
                text-align: center;
            }
            .recommend-goods {
                margin-top: 25rpx;
                margin-bottom: 135rpx;
                image {
                    width: 220rpx;
                    height: 220rpx;
                    border-radius: 8rpx;
                    display: block;
                    margin: 0 33rpx;
                }
            }
            .to-activity {
                position: fixed;
                bottom: 0;
                left: 0;
                height: 100rpx;
                width: 100%;
                text-align: center;
                line-height: 100rpx;
                color: #fff;
                font-size: 30rpx;
            }
        }
    }
    .attr-bottom {
        position: fixed;
        z-index: 1666;
        bottom: 0;
        left: 0;
        height: #{110rpx};
        width: 100%;
        padding: 20upx 24upx;
        font-size: $uni-font-size-general-one;
        .total-price {
            margin-left: 25rpx;
        }
    }
    .input-info {
        margin: 0 24rpx;
        background-color: #fff;
        border-radius: 16rpx;
        width: 702rpx;
        .input-item {
            font-size: 26rpx;
            padding: 30rpx;
            padding-bottom: 15rpx;
            border-top: 2rpx solid #e2e2e2;
            view.input {
                line-height: 52rpx;
                word-break: break-all;
            }
            &:first-of-type {
                border-top: 0;
            }
            .input-label {
                color: #666;
                margin-bottom: 10rpx;
            }
        }
    }
    .u-add-btn {
        color: #ffffff;
        border-radius: 35upx;
    }
</style>