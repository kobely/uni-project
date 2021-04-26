<template>
    <app-layout>

        <view class="f-favorite">

            <view class="u-mask"  :class="[show ? 'u-mask-show' : 'u-mask-no']" @tap="closeMask" catchtouchmove="true"></view>

            <view class="f-tabs">
                <scroll-view scroll-x class="u-scroll-view" :scroll-left="0" scroll-with-animation >
                    <view class="u-tabs-scroll-box">
                        <view
                            class="u-tabs-item"
                            :style="{
                                fontWeight: (index == getCurrent) ? 'bold' : 'normal',
                                color: index == getCurrent ? getTheme.color : ''
                            }"
                            v-for="(item, index) in getTabs"
                            :key="index"
                            @tap="emit(index)"
                        >
                            {{ item['name']}}
                        </view>
                        <view
                            class="u-scroll-bar"
                            :style="{'transform':'translateX(' + left + 'rpx)','background-color': getTheme.background}"
                        ></view>
                    </view>
                </scroll-view>
            </view>

            <view class="f-set" catchtouchmove="true">
                <view class="f-status dir-left-nowrap cross-center" :style="{'transform':'translateY(' + statusTop + 'rpx)'}">
                    <view class="f-item dir-left-nowrap cross-center main-between" @click="setDef('left')"
                          :style="{color: rotate.left === 180 ? getTheme.color : ''}"
                          :class="rotate.left === 180 ? 'f-set' : 'f-def-set'">
                        <view>
                            <text class="t-omit">{{leftSet | category}}</text>
                        </view>
                        <view class="bd-image" :style="{'transform':'rotate(' + rotate.left + 'deg)','background-color': rotate.left === 180 ?  getTheme.background : '#353535'}"></view>
                    </view>
                    <view class="f-item dir-left-nowrap cross-center main-between" @click="setDef('right')"
                          :style="{color: rotate.right === 180 ? getTheme.color : ''}"
                          :class="rotate.right === 180 ? 'f-set' : 'f-def-set'">
                        <view>
                            <text class="t-omit">{{rightSet | setStatus}}</text>
                        </view>
                        <view class="bd-image" :style="{'transform':'rotate(' + rotate.right + 'deg)','background-color': rotate.right === 180 ?  getTheme.background : '#353535'}"></view>
                    </view>
                    <view class="f-good-btn" @click="edit">
                        {{touch ? '完成' : '管理'}}
                    </view>
                    <view class="f-good-icon" @click="setListStyle()">
                        <image
                           :src="listStyle ? '/static/image/icon/favorite/square.png' : '/static/image/icon/favorite/row.png'"></image>
                    </view>
                </view>
                <view class="f-select" :style="{'transform':'translateY('+ typeY+'rpx)'}">
                    <scroll-view scroll-y>
                        <view class="dir-left-wrap f-type">
                            <view class="f-type-item" @tap="setStatus(it.id)"
                                  :style="{'color': selectStatus == it.id ? getTheme.color: ''}"
                                  v-bind:class="selectStatus == it.id ? '' : 'f-type-def'"
                                  v-for="it in statusList" :key="it.id">{{it.name}}</view>
                        </view>
                    </scroll-view>
                    <view class="f-button dir-left-nowrap">
                        <button class="box-grow-1" @click="sureStatus(0)">重置</button>
                        <button class="box-grow-1" @click="sureStatus(1)" :style="{'background-color': getTheme.background}">确定</button>
                    </view>
                </view>
            </view>

            <view class="f-good" v-if="is_goods" :class="getCurrent === 0 ? 'f-good-show' : 'f-good-hidden'">
                <block v-if="listStyle" >
                    <app-share-qr-code v-model="shareShow"
                                       :url="shareItem.newShareUrl"
                                       :goods="shareItem.goods"
                                       :poster-config="shareItem.posterConfig"
                                       :poster-generate="shareItem.posterGenerate"
                                       :has-poster-nav="shareItem.hasPosterNav"
                    ></app-share-qr-code>
                    <!-- #ifndef MP-TOUTIAO -->
                    <view class="dir-left-nowrap" v-for="(item, index) in list" :key="index">
                        <view class="f-radio box-grow-0 dir-top-nowrap main-center cross-center" style="background-color: #ffffff;" v-if="touch" @tap="setTouch(index)">
                            <view class="f-radio-no" v-if="!item.touch"></view>
                            <view class="f-radio-yes" v-if="item.touch"></view>
                        </view>
                        <good-action style="width: 750rpx" :index="index"  :theme="getTheme"
                                     @del="del" @open="openAction"
                                     @share="share"
                                     :disabled="touch"
                                     :show="item.show">
                            <view class="f-item u-border-bottom dir-left-nowrap" @click="routeUrl(item)">
                                <image class="f-img" :src="item.cover_pic" />
                                <!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
                                <view class="f-content dir-top-wrap main-between">
                                    <text class="t-omit-two f-title">{{ item.name }}</text>
                                    <view>
                                        <view class="f-invalid dir-left-nowrap cross-center main-between"
                                              v-if="item.status_type === 3">
                                            <image src="/static/image/icon/invalid.png"></image>
                                            <text>失效</text>
                                        </view>
                                        <view class="f-low-stock dir-left-nowrap cross-center main-between"
                                              v-if="item.status_type === 2">
                                            <image src="/static/image/icon/low_stock.png"></image>
                                            <text>低库存</text>
                                        </view>
                                        <view class="f-low-price dir-left-nowrap"
                                              v-if="item.status_type === 1">
                                            <view class="dir-left-nowrap main-between cross-center">
                                                <image src="/static/image/icon/low_price.png"></image>
                                                比收藏时降价{{item.low_price}}元
                                            </view>
                                        </view>
                                        <view class="dir-left-nowrap main-between" v-if="item.status_type !== 3">
                                                <template v-if="item.is_negotiable == 1">
                                                    <view :style="{'color': getTheme.color,'margin-bottom': '8rpx'}">价格面议</view>
                                                </template>
                                                <view v-else class="dir-top-wrap main-between">
                                                <text class="f-price" :style="{'color': getTheme.color}">{{item.price_content}}</text>
                                                <text class="f-scale">{{item.sales}}</text>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </good-action>
                    </view>
                    <!-- #endif -->
                    <!-- #ifdef MP-TOUTIAO -->
                    <view class="f-swipe-content dir-left-nowrap" v-for="(item, index) in list" :key="item.id">
                        <view class="f-radio box-grow-0 dir-top-nowrap main-center cross-center" v-if="touch" @tap="setTouch(index)">
                            <view class="f-radio-no" v-if="!item.touch"></view>
                            <view class="f-radio-yes" v-if="item.touch"></view>
                        </view>
                        <view class="f-item u-border-bottom dir-left-nowrap" @click="routeUrl(item)">
                            <image class="f-img" :src="item.cover_pic" />
                            <view class="f-content dir-top-wrap main-between">
                                <text class="t-omit-two f-title">{{ item.name }}</text>
                                <view>
                                    <view class="f-invalid dir-left-nowrap cross-center main-between"
                                          v-if="item.status_type === 3">
                                        <image src="/static/image/icon/invalid.png"></image>
                                        <text>失效</text>
                                    </view>
                                    <view class="f-low-stock dir-left-nowrap cross-center main-between"
                                          v-if="item.status_type === 2">
                                        <image src="/static/image/icon/low_stock.png"></image>
                                        <text>低库存</text>
                                    </view>
                                    <view class="f-low-price"
                                          v-if="item.status_type === 1">
                                        <view class="dir-left-nowrap main-between cross-center">
                                            <image src="/static/image/icon/low_price.png"></image>
                                            <text>比收藏时降价{{item.low_price}}元</text>
                                        </view>
                                    </view>
                                    <view class="dir-left-nowrap main-between" v-if="item.status_type !== 3">
                                        <view class="dir-top-wrap main-between">
                                            <text class="f-price" :style="{'color': getTheme.color}">{{item.price_content}}</text>
                                            <text class="f-scale">{{item.sales}}</text>
                                        </view>
                                        <view>
                                            <image class="f-share-icon" @click.stop="share(index)" src="./image/share.png"></image>
                                            <image class="f-delete-icon" @click.stop="del(index)" src="./image/delete.png"></image>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <!-- #endif -->
                    <view class="f-delete-box" v-if="touch"></view>
                    <view class="f-delete dir-left-nowrap main-between cross-center" :class="touch ? 'f-delete-show' : 'f-delete-hidden'">
                        <view class="dir-left-nowrap" @click="setTouchA(allTouch)">
                            <view class="f-radio">
                                <view class="f-kon" v-if="!allTouch"></view>
                                <view class="f-touch" v-if="allTouch"></view>
                            </view>
                            <text>全选</text>
                        </view>
                        <button :class="touchNumber > 0 ? 'f-button-t ' : 'f-button-m'" @click="remove">删除</button>
                    </view>
                </block>
                <block v-else>
                    <view  class="f-list dir-left-wrap"
                    >
                        <view class="f-list-item" @touchmove="handletouchmove"
                              @touchstart="handletouchstart" @touchend="handletouchend(item, index)" v-for="(item, index) in list" :key="index" >
                            <view class="f-img">
                                <image :src="item.cover_pic"></image>
                                <view class="f-invalid f-icon dir-left-nowrap cross-center main-between" v-if="item.status_type === 3">
                                </view>
                                <view class="f-low-price f-icon dir-left-nowrap cross-center main-between" v-if="item.status_type === 1">
                                </view>
                                <view class="f-low-stock f-icon dir-left-nowrap cross-center main-between" v-if="item.status_type === 2">
                                </view>
                                <view class="f-radio">
                                    <view class="f-kon" v-if="touch && !item.touch" ></view>
                                    <view class="f-touch"  v-if="item.touch"></view>
                                </view>
                            </view>
                            <view class="f-text dir-top-nowrap main-between">
                                <text class="t-omit-two">{{item.name}}</text>
                                <template v-if="item.is_negotiable == 1">
                                    <view :style="{'color': getTheme.color,'margin-bottom': '8rpx'}">价格面议</view>
                                </template>
                                <view v-else class="dir-left-nowrap main-between">
                                    <text class="f-price" :style="{'color': getTheme.color}">{{item.price_content}}</text>
                                    <text class="f-sales">{{item.sales}}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="f-delete-box" v-if="touch"></view>
                    <view class="f-delete dir-left-nowrap main-between cross-center" :class="touch ? 'f-delete-show' : 'f-delete-hidden'">
                        <view class="dir-left-nowrap" @click="setTouchA(allTouch)">
                            <view class="f-radio">
                                <view class="f-kon" v-if="!allTouch"></view>
                                <view class="f-touch" v-if="allTouch"></view>
                            </view>
                            <text>全选</text>
                        </view>
                        <button :class="touchNumber > 0 ? 'f-button-t ' : 'f-button-m'" @click="remove">删除</button>
                    </view>
                </block>
                <app-no-goods v-if="list.length === 0" background="#f7f7f7"></app-no-goods>
            </view>

            <view class="f-topic" v-if="!is_goods" :class="getCurrent === 1 ? 'f-good-show' : 'f-good-hidden'">
                <!-- #ifdef MP-TOUTIAO -->
                <app-special-topic-list :cat-show="false" :topic-list="topicList"></app-special-topic-list>
                <!-- #endif -->
                <!-- #ifndef MP-TOUTIAO -->
                <block v-for="(child, sub) in topicList" v-bind:key="sub" >
                    <view style="margin-top: 10rpx;">
                        <good-action style="width: 750rpx;" :index="sub" bgColor="#f7f7f7"  :theme="getTheme"
                                     @del="del" @open="openAction"
                                     @share="share"
                                     :show="child.show">
                            <template v-if="child.layout == 0">
                                <app-jump-button form :url="`../topic/topic?id=${child.id}`" open_type="navigate">
                                    <view class="app-small-frame main-between ">
                                        <view class="app-content-text dir-top-nowrap main-between">
                                            <text class="app-text t-omit-two">{{child.title}}</text>
                                            <text class="app-text-read t-omit-two">{{child.abstract}}</text>
                                            <text class="app-text-read">{{child.read_count}}</text>
                                        </view>
                                        <image lazy-load class="app-image" mode="scaleToFill" :src="child.cover_pic"></image>
                                    </view>
                                </app-jump-button>
                            </template>
                            <template v-if="child.layout == 1">
                                <app-jump-button form :url="`../topic/topic?id=${child.id}`" open_type="navigate">
                                    <view class="app-big-frame dir-top-nowrap">
                                        <text class="app-text t-omit-two">{{child.title}}</text>
                                        <text class="app-text-read t-omit-two">{{child.abstract}}</text>
                                        <image lazy-load  class="app-image" mode="scaleToFill" :src="child.cover_pic"></image>
                                        <text class="app-text-read">{{child.read_count}}</text>
                                    </view>
                                </app-jump-button>
                            </template>
                            <template v-if="child.layout == 2">
                                <app-jump-button form :url="`../topic/topic?id=${child.id}`" open_type="navigate">
                                    <view class="app-more-frame dir-top-nowrap">
                                        <text class="app-text t-omit-two">{{child.title}}</text>
                                        <text class="app-text-read t-omit-two">{{child.abstract}}</text>
                                        <view class="dir-left-nowrap">
                                            <block v-for="(item, index) in child.pic_list" :key="index">
                                                <image lazy-load  class="app-image box-grow-1" mode="scaleToFill" :src="item.url"></image>
                                            </block>
                                        </view>
                                        <text class="app-text-read">{{child.read_count}}</text>
                                    </view>
                                </app-jump-button>
                            </template>
                        </good-action>
                    </view>
                </block>
                <app-share-qr-code v-model="topicShow"
                                   :url="shareItem.url"
                ></app-share-qr-code>
                <!-- #endif -->
            </view>
        </view>
    </app-layout>
</template>

<script>

import {mapGetters} from "vuex";
// #ifndef MP-TOUTIAO
import goodAction from './component/good-action.vue';
// #endif
import appShareQrCode from '../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
import appSpecialTopicList from "../../components/page-component/app-special-topic/app-special-topic-list.vue";
import appNoGoods from '../../components/page-component/app-no-goods/app-no-goods.vue';

let catList = [];

export default {
    name: 'favorite',

    data() {

        return {
            getCurrent: 0,
            is_goods: true,
            left: 0,
            rotate: {
                left: 0,
                right: 0
            },
            leftSet: 0,
            rightSet: 0,
            statusTop: 85,
            listStyle: true,
            statusList: [],
            selectStatus: 0,
            typeY: -800,
            show: false,
            list: [],
            topicList: [],
            timeOutEvent: -1,
            touch: false,
            allTouch: false,
            touchNumber: 0,
            shareShow: false,
            shareItem: {},
            goods_page: 1,
            topic_page: 1,
            topicShow: false
        }
    },

    computed: {
        getTabs: function() {
            return [
                {
                    name: '商品'
                },
                {
                    name: '专题'
                }
            ]
        },
        ...mapGetters('mallConfig', {
            cat_style: 'getCatStyle',
            getTheme: 'getTheme'
        }),
    },

    methods: {
        emit(index) {
            this.goods_page = 1;
            if (index === 0) {
                this.is_goods = true;
                this.left = 0;
                this.statusTop = 85;
                setTimeout(() => {
                    this.getCurrent = index;
                });
                this.getFavorite();
            } else if (index === 1) {
                setTimeout(() => {
                    this.is_goods = false;
                }, 500);
                this.getCurrent = index;
                this.left = 375;
                this.typeY = -800;
                this.statusTop = -85;
                for (let i in this.rotate) {
                    this.rotate[i] = 0;
                }
                this.show = false;
                if (!this.listStyle) {
                    for (let i = 0; i < this.list.length; i++) {
                        this.list[i].touch = false;
                    }
                    this.touch = false;
                    this.allTouch = false;
                }
                this.getTopicList();
            }
        },

        setDef(key) {
            if (key === 'right') {
                this.statusList = [
                    {
                        name: '全部状态',
                        id: 0
                    },
                    {
                        name: '优惠',
                        id: 3
                    },
                    {
                        name: '低库存',
                        id: 1
                    },
                    {
                        name: '失效',
                        id: 2
                    }
                ];
                this.rotate.left = 0;
                this.typeY = -800;
            } else {
                this.statusList = catList;
                this.rotate.right = 0;
                this.typeY = -800;
            }
            if (this.rotate[key] === 0) {
                this.rotate[key] = 180;
                this.show = true;
                this.typeY = -3;
            } else {
                this.rotate[key] = 0;
            }
        },

        setStatus(index) {

            this.selectStatus = index;
        },

        sureStatus(s) {
            this.goods_page = 1;

            this.typeY = -800;
            this.show = false;
            if (s === 1) {
                if (this.rotate.left !== 0) {
                    this.leftSet = this.selectStatus;
                }
                if (this.rotate.right !== 0) {
                    this.rightSet = this.selectStatus;
                }

                this.getFavorite();
                for (let i in this.rotate) {
                    this.rotate[i] = 0;
                }
            } else {
                this.leftSet = 0;
                this.rightSet = 0;
                this.getFavorite();
                for (let i in this.rotate) {
                    this.rotate[i] = 0;
                }
            }
        },


        async getCats() {
            const e = await this.$request({
                url: this.$api.favorite.cats,
                method: 'get'
            });
            catList = e.data.list;
            this.statusList = e.data.list;
        },

        async getFavorite(bool) {
            const e = await this.$request({
                url: this.$api.favorite.my_favorite_goods,
                method: 'get',
                data: {
                    cat_id: this.leftSet,
                    status: this.rightSet,
                    page: this.goods_page
                }
            });
            if (!bool) {
                this.list = e.data.list;
            } else {
                this.list.push(...e.data.list);
            }
        },

        async getTopicList(bool) {
            const e = await this.$request({
                url: this.$api.user.my_favorite_topic,
                method: 'get',
                data: {
                    page: this.topic_page
                }
            });
            let list = e.data.list;
            for (let i =0; i < list.length; i++) {
                list[i].show = false;
            }
            if (!bool) {
                this.topicList = list;
            } else {
                this.topicList.push(...list);
            }
        },
        del(index) {
            if (this.getCurrent === 0) {
                this.$request({
                    url: this.$api.user.favorite_remove,
                    method: 'get',
                    data: {
                        goods_id: this.list[index].id
                    }
                });
                this.$delete(this.list, index);
            } else {
                this.$request({
                    url: this.$api.topic.favorite,
                    data: {
                        id: this.topicList[index].id,
                        is_favorite: 'no_love'
                    },
                    method: 'post'
                });
                this.$delete(this.topicList, index);
            }
            uni.showToast({
                title: '取消收藏成功',
                icon: 'none'
            });

        },
        remove() {
            let goods_ids = [];
            for (let i = 0; i < this.list.length; i++) {
                if (this.list[i].touch) {
                    goods_ids.push(this.list[i].id);
                }
            }
            if (goods_ids.length === 0) return;
            this.$request({
                url: this.$api.user.favorite_batch_remove,
                method: 'post',
                data: {
                    goods_ids: JSON.stringify(goods_ids)
                }
            });
            for (let i = 0; i < this.list.length; i++) {
                for (let j = 0; j < goods_ids.length; j++) {
                    if (goods_ids[j] === this.list[i].id) {
                        this.$delete(this.list, i);
                    }
                }
            }
            uni.showToast({
                title: '取消收藏成功',
                icon: 'none'
            });
        },
        share(index) {
            if (this.getCurrent === 0) {
                let data = this.list[index];
                this.shareItem.goods = this.list[index];
                this.shareItem.hasPosterNav = true;
                this.shareItem.newShareUrl =  this.$api.goods.poster + '&goods_id=' + data.id;
                this.shareShow = true;
                switch (data.sign) {
                    case "step":
                        this.shareItem.posterGenerate = this.$api.step.poster_generate + '&goods_id=' + data.id;
                        this.shareItem.posterConfig = this.$api.step.poster_config + '&goods_id=' + data.id;
                        break;
                    case "book":
                        this.shareItem.posterGenerate = this.$api.book.poster_generate + '&goods_id=' + data.id;
                        this.shareItem.posterConfig = this.$api.book.poster_config + '&goods_id=' + data.id;
                        break;
                    case "bargain":
                        this.shareItem.posterGenerate = this.$api.bargain.poster_generate + '&goods_id=' + data.id;
                        this.shareItem.posterConfig = this.$api.bargain.poster_config + '&goods_id=' + data.id;
                        break;
                    case "integral_mall":
                        this.shareItem.posterGenerate = this.$api.integral_mall.poster_generate + '&goods_id=' + data.id;
                        this.shareItem.posterConfig = this.$api.integral_mall.poster_config + '&goods_id=' + data.id;
                        break;
                    case "pt":
                        this.shareItem.posterGenerate = this.$api.pt.poster_generate + '&goods_id=' + data.id;
                        this.shareItem.posterConfig = this.$api.pt.poster_config + '&goods_id=' + data.id;
                        break;
                    case "mch":
                        this.shareItem.posterGenerate = this.$api.mch.poster_generate + '&goods_id=' + data.id;
                        this.shareItem.posterConfig = this.$api.mch.poster_config + '&goods_id=' + data.id;
                        break;
                    case "miaosha":
                        this.shareItem.posterGenerate = this.$api.miaosha.poster_generate + '&goods_id=' + data.id;
                        this.shareItem.posterConfig = this.$api.miaosha.poster_config + '&goods_id=' + data.id;
                        break;
                    case "advance":
                        this.shareItem.posterGenerate = this.$api.advance.poster_generate + '&goods_id=' + data.id;
                        this.shareItem.posterConfig = this.$api.advance.poster_config + '&goods_id=' + data.id;
                        break;
                    case "quick_share":
                        this.shareItem.posterGenerate = this.$api.quick_share.poster_generate + '&goods_id=' + data.id;
                        this.shareItem.posterConfig = this.$api.quick_share.poster_config + '&goods_id=' + data.id;
                        break;
                    case "pick":
                        this.shareItem.posterGenerate = this.$api.pick.poster_generate + '&goods_id=' + data.id;
                        this.shareItem.posterConfig = this.$api.pick.poster_config + '&goods_id=' + data.id;
                        break;
                    default:
                        this.shareItem.posterGenerate = this.$api.poster.goods_new + '&goods_id=' + data.id;
                        this.shareItem.posterConfig = this.$api.goods.poster + '&goods_id=' + data.id;
                        break;
                }
            } else {
                this.shareItem.url = this.$api.poster.topic + '&id=' + this.topicList[index].id;
                this.shareItem.topic = this.topicList[index];
                this.topicShow = true;
            }

        },
        openAction(index) {
            if (this.getCurrent === 0) {
                this.list[index].show = true;
                this.list.map((val, idx) => {
                    if(index != idx) {
                        this.list[idx].show = false;
                    }
                });
            } else {
                this.topicList[index].show = true;
                this.topicList.map((val, idx) => {
                    if(index != idx) {
                        this.topicList[idx].show = false;
                    }
                });
            }

        },
        handletouchmove() {
            clearTimeout(this.timeOutEvent); //清除定时器
            this.timeOutEvent = 0;

        },
        handletouchstart(e) {
            this.timeOutEvent = setTimeout(() => {
                this.onLongPress(e)
            }, 1000);
            return false;

        },
        handletouchend(item, index) {
            clearTimeout(this.timeOutEvent);
            if (this.timeOutEvent != 0) {
                //处理点击时间
                if (!this.touch) {
                    this.routeUrl(item);
                } else if (this.touch) {
                    this.setTouch(index);
                }
            }
            return false;
        },
        onLongPress(e) {
            this.touch = true;
        },

        setTouch(index) {
            this.list[index].touch = !this.list[index].touch;
        },

        setTouchA(allTouch) {
            this.allTouch = !allTouch;
            for (let i = 0; i < this.list.length; i++) {
                this.list[i].touch = this.allTouch;
            }
        },

        setListStyle() {
            this.listStyle = !this.listStyle;
            this.touch = false;
            if (!this.listStyle) {
                for (let i = 0; i < this.list.length; i++) {
                    this.list[i].touch = false;
                }
                this.allTouch = false;
            }
        },

        routeUrl(item) {
            if (item.status_type !== 3) {
                uni.navigateTo({
                    url: item.page_url
                })
            }
        },

        edit() {
            if (this.touch) {
                for (let i = 0; i < this.list.length; i++) {
                    this.list[i].touch = false;
                }
                this.touch = false;
                this.allTouch = false;
            } else {
                this.touch = !this.touch;
                for (let i = 0; i < this.list.length; i++) {
                    this.list[i].show = false;
                }
            }
        },

        closeMask() {
            this.show = false;
            this.rotate.left = 0;
            this.rotate.right = 0;
            this.typeY = -500;
        }
    },

    watch: {
        rotate: {
            handler(data) {
                if (data.left === 0 && data.right === 0) {
                    this.show = false;
                }
                if (data.left !== 0) {
                    this.selectStatus = this.leftSet;
                }
                if (data.right !== 0) {
                    this.selectStatus = this.rightSet;
                }
            },
            deep: true
        },
        list: {
            handler(data) {
                let touch = 0;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].touch) {
                        touch ++;
                    }
                }
                this.touchNumber = touch;
                if (touch === data.length) {
                    this.allTouch = true;
                } else {
                    this.allTouch = false;
                }
            },
            deep: true
        }
    },
    onLoad() { this.$commonLoad.onload();
        this.getCats();
        this.getFavorite();
    },
    components: {
        // #ifndef MP-TOUTIAO
        goodAction,
        // #endif
        appShareQrCode,
        'app-special-topic-list': appSpecialTopicList,
        appNoGoods
    },

    onReachBottom() {
        if (this.getCurrent === 0) {
            this.goods_page++;
            this.getFavorite(true);
        } else {
            this.topic_page++;
            this.getTopicList(true);
        }
    },
    // #ifdef MP
    onShareAppMessage(object) {
        if (object.from === 'button') {
            if (this.getCurrent === 0) {
                return this.$shareAppMessage({
                    title: this.shareItem.goods.name,
                    imageUrl: this.shareItem.goods.cover_pic,
                    path: '/pages/goods/goods',
                    params: {
                        id:this.shareItem.goods.id
                    }
                });
            } else {
                return this.$shareAppMessage({
                    title: this.shareItem.topic.app_share_title ? this.shareItem.topic.app_share_title : this.shareItem.topic.title,
                    imageUrl: this.shareItem.topic.cover_pic ? this.shareItem.topic.cover_pic : '',
                    path: '/pages/topic/topic',
                    params: {
                        id:this.shareItem.topic.id
                    }
                });
            }
        }
    },
    // #endif
    filters: {
        category(data) {
            for (let i = 0; i < catList.length; i++) {
                if (catList[i].id === data) {
                    return catList[i].name;
                }
            }
        },
        setStatus(data) {
            let statusList = [
                {
                    name: '全部状态',
                    id: 0
                },
                {
                    name: '优惠',
                    id: 3
                },
                {
                    name: '低库存',
                    id: 1
                },
                {
                    name: '失效',
                    id: 2
                }
            ];
            for (let i = 0; i < statusList.length; i++) {
                if (statusList[i].id === data) {
                    return statusList[i].name;
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
.item {
    display: flex;
    padding: 20rpx;
    image {
        width: 120rpx;
        flex: 0 0 120rpx;
        height: 120rpx;
        margin-right: 20rpx;
        border-radius: 12rpx;
    }
}

.title {
    text-align: left;
    font-size: 28rpx;
    color: red;
    margin-top: 20rpx;
}
.f-favorite {
    min-height: 600rpx;
}
.f-tabs {
    height: 88upx;
    background-color: #fff;
    border-bottom: 1upx solid #e2e2e2;
    z-index: 10;
    position: fixed;
    top: 0;
    width: 100%;
}
.u-tabs-scorll-flex {
    display: flex;
    justify-content: space-between;
}

.u-tabs-scroll-box {
    position: relative;
}

.u-tabs-scorll-flex .u-tabs-item {
    flex: 1;
}

.u-tabs-item {
    position: relative;
    display: inline-block;
    text-align: center;
    font-size: 32upx;
    height: 88upx;
    line-height: 88upx;
    width: 50%;
    transition-property: background-color, color, font-weight;
}
.u-scroll-bar {
    position: absolute;
    bottom: 0rpx;
    width: 58upx;
    height: 4upx;
    left: 160upx;
    transition: .5s;
}
.f-set {
    position: relative;
    .f-select {
        position: absolute;
        top: 0;
        width: 750upx;
        transition: .5s;
        z-index: 8;
        background-color: #f5f5f5;
        .f-button {
            height: 90upx;
            border-top: 1upx solid #e2e2e2;
            button {
                font-size: 26upx;
                line-height: 90upx;
                border-radius: 0;
            }
            button:first-child {
                color:#747474;
                background-color: #fff;
            }
            button:last-child {
                color: #fff;
            }

        }
        .f-type {
            padding: 48upx 24upx 24upx 24upx;
            max-height: 360upx;
            .f-type-item {
                margin-bottom: 24upx;
                background-color: #ffffff;
                border: 1upx solid;
                width: 339upx;
                border-radius: 37upx;
                height: 72upx;
                line-height: 72upx;
                font-size: 25upx;
                text-align: center;
            }
            .f-type-def {
                border: 1upx solid #e2e2e2;
                color: #353535;
            }
            .f-type-item:nth-child(odd) {
                margin-right: 23upx;
            }
        }

    }
}
.f-status {
    height: 78upx;
    background-color: #ffffff;
    border-bottom: 1upx solid #e2e2e2;
    padding: 0 24upx;
    transition: .5s;
    z-index: 9;
    position: fixed;
    width: 100%;
    top: 2upx;
    >view:first-child {
        margin-right: 22upx;
    }
    .f-item {
        border-radius: 26upx;
        height: 52upx;
        margin-right: 5upx;
        width: 160upx;
        image {
            width: 11upx;
            height: 6upx;
            transition: .3s;
            margin-right: 16upx;
        }
        >view {
            width: 133upx;
            padding-left: 25upx;
            padding-right: 10upx;
        }
        text {
            width: 98upx;
            font-size: 23upx;
        }
    }
    .f-set {
        border: 1upx solid;
        background-color: #ffffff;
    }
    .f-def-set {
        border: 1upx solid #f5f5f5;
        background-color: #f5f5f5;
    }

    .f-img {
        background-color: #353535;
    }
    text {
        font-size: 23upx;
    }
    .f-good-icon {
        width: 78upx;
        height: 78upx;
        position: absolute;
        right: 0;
        padding: 24upx;
        image {
            width: 30upx;
            height: 30upx;
        }
    }
    .f-good-btn {
        position: absolute;
        right: 79upx;
        padding: 24upx;
        font-size:24upx;
    }
}
.u-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    visibility: hidden;
    background: rgba(0, 0, 0, 0.6);
    z-index: 6;
    transition: all .3s ease-in-out;
    transform: scale(1.2,1.2);
}
.u-mask-no {
    z-index: 0;
}
.u-mask-show {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
}
.f-good-hidden {
    opacity: 0;
    visibility: hidden;
}
.f-good-show {
    opacity: 1;
    visibility: visible;
}
.f-good {
    margin-top: 166upx;
    visibility: visible;
    transition: all .3s ease-in-out;
    .f-item {
        width: 750upx;
        padding: 24upx;
        .f-img {
            width: 200upx;
            height: 200upx;
            border-radius: 23upx;
            margin-right: 24upx;
        }
        .f-content {
            width: 478upx;
        }
        .f-title {
            font-size: 26upx;
            color: #353535;
        }
        .f-invalid {
            width: 128upx;
            height: 42upx;
            line-height: 42upx;
            background-color: #f7f7f7;
            padding: 0 27upx 0 18upx;
            >text {
                font-size: 23upx;
                color: #999999;
            }
            >image {
                width: 24upx;
                height: 24upx;
            }
        }
        .f-low-stock {
            width: 148upx;
            height: 42upx;
            line-height: 42upx;
            background-color: #ffecec;
            padding: 0 27upx 0 18upx;
            >text {
                font-size: 23upx;
                color: #ff4544;
            }
            >image {
                width: 24upx;
                height: 24upx;
            }
        }
        .f-low-price {
            height: 42upx;
            line-height: 42upx;
            display: inline-block;
            background-color: #ffecec;
            padding: 0 27upx 0 18upx;
            position: relative;
            font-size: 23upx;
            color: #ff4544;
            >text {
                font-size: 23upx;
                color: #ff4544;
                vertical-align:center;
            }
            image {
                width: 24upx;
                height: 24upx;
                margin-right: 14upx;
            }
        }
        .f-delete-icon {
            width: 46upx;
            height: 50upx;
            padding: 8upx;
        }
        .f-share-icon {
            width: 46upx;
            height: 46upx;
            padding: 8upx;
            margin-right: 10upx;
        }
        .f-price {
            font-size: 24upx;
            margin-top: 12upx;
        }
        .f-scale {
            font-size: 21upx;
            color: #b0b0b0;
        }
    }

    .f-list {
        padding: 0 24upx;
        .f-list-item {
            height: 492upx;
            width: 344upx;
            border-radius: 12upx;
            margin-top: 14upx;
            background-color: #fff;
            overflow: hidden;
        }
        .f-list-item:nth-child(odd) {
            margin-right: 15upx;
        }
        .f-img {
            width: 344upx;
            height: 344upx;
            position: relative;
            >image {
                width: 344upx;
                height: 344upx;
            }
            .f-radio {
                width: 40upx;
                height: 40upx;
                border-radius: 50%;
                position: absolute;
                top: 10upx;
                right: 10upx;
                .f-kon {
                    width: 40upx;
                    height: 40upx;
                    border-radius: 50%;
                    border: 1upx solid #868686;
                }
                .f-touch {
                    width: 40upx;
                    height: 40upx;
                    background-size: 101% 101%;
                    background-repeat: no-repeat;
                    border-radius: 50%;
                    z-index: 1;
                    background-image: url("./image/touch.png");
                }
            }
        }
        .f-invalid {
            width: 112upx;
            background-image: url("./image/invalid.png");
        }
        .f-low-price {
            width: 112upx;
            background-image: url("./image/low_price.png");
        }
        .f-low-stock {
            width: 152upx;
            background-image: url("./image/low_stock.png");
        }
        .f-icon {
            bottom: 24upx;
            left: 0;
            height: 46upx;
            padding: 0 18upx 0 17upx;
            position: absolute;
            border-top-right-radius: 25upx;
            border-bottom-right-radius: 25upx;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        .f-text {
            width: 100%;
            height: 148upx;
            padding-bottom: 10upx;
            >text {
                font-size: 26upx;
                padding: 18upx 23upx 0 23upx;
            }
            >view {
                padding: 0 23upx 0 23upx;
                margin-bottom: 18upx;
            }
            .f-price {
                font-size: 21upx;
            }
            .f-sales {
                font-size: 23upx;
                color: #999999;
            }
        }

    }
    .f-delete-box {
        width: 100%;
        height: 100upx;
    }
    .f-delete {
        position: fixed;
        width: 100%;
        height: 100upx;
        border-top: 1px solid #e2e2e2;
        background-color: #FFFFFF;
        z-index: 8;
        left: 0;
        transition: all .3s ease-in-out;
        font-size: 26upx;
        padding: 0 24upx;
        >button {
            width: 138upx;
            height: 64upx;
            line-height: 64upx;
            border-radius: 32upx;
            background-color: #ffffff;
            margin: 0;
            border-width: 1upx;
            border-style: solid;
            transform: rotateZ(360deg);
        }
        .f-button-m {
            border-color: #999999;
            color: #999999;
        }
        .f-button-t {
            border-color: #ff4544;
            color: #ff4544;
        }
        >view {
            width: 103upx;
            .f-radio {
                width: 40upx;
                height: 40upx;
                border-radius: 50%;
                margin-right: 10upx;
                .f-kon {
                    width: 40upx;
                    height: 40upx;
                    border-radius: 50%;
                    border: 1upx solid #868686;
                }
                .f-touch {
                    width: 40upx;
                    height: 40upx;
                    background-size: 101% 101%;
                    background-repeat: no-repeat;
                    border-radius: 50%;
                    z-index: 1;
                    background-image: url("./image/touch.png");
                }
            }
        }
    }
    .f-delete-show {
        bottom: 0;
        visibility: visible;
    }
    .f-delete-hidden {
        bottom: -101upx;
        visibility: hidden;
    }
}
// #ifndef MP-TOUTIAO
.f-swipe-content {
    background-color: #ffffff;
}
//#endif
.f-topic {
    margin-top: 88upx;

}
.f-radio {
    width: 85upx;
    height:  248upx;
    .f-radio-no {
        border-radius: 50%;
        width: 40upx;
        height: 40upx;
        border: 1upx solid #868686;
    }
    .f-radio-yes {
        width: 40upx;
        height: 40upx;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        border-radius: 50%;
        background-image: url("./image/touch.png");
    }
}

    .app-content-item {
        width: #{750rpx};
        border-top: #{0.1rpx} solid transparent;
    }
    .app-text-read {
        font-size: #{24rpx};
        color: #919191;
    }
    .app-small-frame {
        background-color: #ffffff;
        width: #{750rpx};
        overflow: hidden;
        padding: #{20rpx} #{24rpx};
        .app-image {
            width: #{268rpx};
            height: #{202rpx};
        }
        .app-content-text {
            width: #{394rpx};
            height: #{190rpx};
            .app-text {
                font-size: #{32rpx};
                color: #353535;
                width: #{394rpx};
            }
        }
    }
    .app-big-frame {
        padding: #{32rpx} #{24rpx} #{24rpx} #{24rpx};
        background-color: #ffffff;
        .app-text {
            font-size: #{32rpx};
            width: #{750-24-24rpx};
            color: #353535;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        .app-image {
            width: #{750-24-24rpx};
            height: #{350rpx};
            margin: #{24rpx} 0;

        }
    }
    .app-more-frame {
        padding: #{32rpx} #{24rpx} #{24rpx} #{24rpx};
        background-color: #ffffff;
        .app-text {
            font-size: #{32rpx};
            width: #{750-24-24rpx};
            color: #353535;
        }
        .app-image {
            margin-top: #{16rpx};
            width: #{226rpx};
            height: #{170rpx};
            margin-right: #{12rpx};
            margin-bottom: #{16rpx};
            display: block;
        }
    }
.bd-image {
    background-image:url("../../static/image/icon/favorite/bottom.png");
    background-size: 102% 102%;
    width: 11upx !important;
    height: 6upx;
    transition: .3s;
    margin-right: 16upx;
    background-repeat: no-repeat;
    padding-left: 0 !important;
}
</style>

