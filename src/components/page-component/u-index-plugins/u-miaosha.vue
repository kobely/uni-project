<template>
    <u-index-plugins url="/plugins/miaosha/advance/advance">
        <template v-slot:u-top-name>
            <view class="cross-center u-top">
                <image class="u-icon" :src="appImg.icon_home_miaosha"></image>
                <view class="box-grow-1 u-name">整点秒杀</view>
                <template v-if="newData.open_date">
                    <view :class="timer ? 'box-grow-0' : 'box-grow-1'">{{newData.str}}</view>
                    <view class="box-grow-1 dir-left-nowrap u-time-box" v-if="timer">
                        <view class="main-center cross-center u-time">{{timer.hour}}</view>
                        <view class="main-center cross-center u-symbol">:</view>
                        <view class="main-center cross-center u-time">{{timer.min}}</view>
                        <view class="main-center cross-center u-symbol">:</view>
                        <view class="main-center cross-center u-time">{{timer.sec}}</view>
                    </view>
                </template>
            </view>
        </template>
        <template v-slot:u-body>
            <view v-if="style === '1'" class="dir-left-nowrap">
                <view v-for="(goods, index) in goodsList" v-bind:key="index" class="u-goods dir-top-nowrap box-grow-0" v-on:click="router(goods)">
                    <view class="u-cover-box">
                        <view class="u-out-dialog" v-if="isShowStock(goods)">
                            <image class="u-pic" :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                        </view>
                        <image class="box-grow-0 u-cover" v-bind:src="goods.cover_pic"></image>
                    </view>
                    <view class="box-grow-0 u-goods-name t-omit-two ">
                        {{goods.name}}
                    </view>
                    <view class="box-grow-1 u-content  dir-top-nowrap main-right">
                        <view class="u-margin" v-if="isShowMemPrice(goods)">
                            <app-member-price
                                :theme="theme"
                                v-bind:price="goods.level_price"
                            ></app-member-price>
                        </view>
                        <view class="u-margin" v-if="isShowVip(goods)">
                            <app-sup-vip
                                v-bind:is_vip_card_user="goods.vip_card_appoint.is_vip_card_user"
                                v-bind:discount="goods.vip_card_appoint.discount"
                            ></app-sup-vip>
                        </view>
                        <view :style="{'color': theme.color}" class="dir-left-nowrap u-price-box t-omit">
                            <text class="u-price">{{goods.price_content}}</text>
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="style === '2'">
                <u-ordinary-list :showBuyBtn="false" :theme="getTheme" :list-style="2" :list="newData.list"></u-ordinary-list>
            </view>
        </template>
    </u-index-plugins>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import uIndexPlugins from '../u-index-plugins/u-index-plugins.vue';
import uOrdinaryList from '@/components/page-component/u-goods-list/u-ordinary-list.vue';

export default {
    name: "u-miaosha",
    props: {
        value: {
            type: Object,
            default() {
                return {
                    open_date: null,
                    list: []
                };
            }
        },
        pageHide: Boolean,
        theme: Object,
        index: Number,
        page_id: Number,
        is_required: Boolean,
        appImg: {
            type: Object,
            default: function() {
                return {
                    plugins_out: ''
                }
            }
        },
        appSetting: {
            type: Object,
            default: function() {
                return {
                    is_show_stock: 1,
                    sell_out_pic: '',
                    is_use_stock: 1
                }
            }
        }
    },
    data() {
        return {
            style: '1',
            goods_num: 20,
            newData: {
            },
            timer: null,
            time: null,
            is_vip: true,
            tempList: [],
            goodsList: [],
            timeOut: 0
        };
    },
    components: {
        uIndexPlugins,
        uOrdinaryList
    },
    computed: {
        ...mapGetters('mallConfig', {
            getTheme: 'getTheme',
        })
    },
    beforeDestroy() {
        clearInterval(this.time);
        clearTimeout(this.timeOut);

    },
    watch: {
        pageHide: {
            handler(v) {
                if (v) {
                    clearInterval(this.time);
                    clearTimeout(this.timeOut);
                    return ;
                }

            },
            immediate: true
        },
        'newData': {
            handler(newVal) {
                if (this.$validation.isEmpty(newVal)) return;
                this.tempList = this.cloneData(newVal.list);
                this.splitData();
            },
            immediate: true
        }
    },
    methods: {
        // 是否展示会员价
        isShowMemPrice(goods) {
            return goods.is_level === 1 && goods.is_negotiable !== 1 ? 1 : 0;
        },
        // 是否展示超级会员价
        isShowVip(goods) {
            return goods.vip_card_appoint && goods.vip_card_appoint.discount > 0 && goods.is_negotiable !== 1 ? 1 : 0;
        },
        // 是否展示售罄
        isShowStock(goods) {
            return this.appSetting.is_show_stock === 1 && goods.goods_stock === 0 ? 1: 0;
        },
        router(goods) {
            this.$emit('router', goods);
        },
        loadData() {
            let para = {
                type: this.page_id === 0 ? 'mall' : 'diy',
                key: 'miaosha',
                page_id: this.page_id,
                index: this.index
            }
            if(this.goods_num) {
                para.goods_num = this.goods_num
            }
            this.$request({
                url: this.$api.index.extra,
                data: para
            }).then(e => {
                if (e.code === 0 && e.data) {
                    this.newData = e.data;
                    this.newData.str = '00:00:00 点场';
                    let timenow = new Date();//获取当前时间
                    if ((new Date(this.newData.open_date)).getDate() != timenow.getDate()) {
                        this.newData.str = '预告 ' + this.newData.open_date + ' ' + this.newData.open_time + '点场';
                    } else if (this.newData.open_time != timenow.getHours()) {
                        this.newData.str = '预告 ' + this.newData.open_time + '点场';
                    } else {
                        let timelog = this.newData.date_time * 1000 - timenow.getTime();//时间差的所有毫秒数
                        this.time = setInterval(() => {
                            timelog -= 1000;
                            this.newData.str = this.newData.open_time + '点场';
                            if (timelog <= 0) {
                                clearInterval(this.time);
                                return;
                            }
                            let hour = parseInt((timelog / 1000 / 60 / 60));
                            let min = parseInt((timelog / 1000 / 60) % 60);
                            let sec = parseInt((timelog / 1000) % 60);
                            this.timer = {
                                hour: hour < 10 ? "0" + hour : hour,
                                min: min < 10 ? "0" + min : min,
                                sec: sec < 10 ? "0" + sec : sec
                            };
                        }, 1000);
                    }
                }
            })
        },
        // 复制而不是引用对象和数组
        cloneData(data) {
            return JSON.parse(JSON.stringify(data));
        },
        // 循环载入
        splitData() {
            if (!this.tempList.length) return;
            let item = this.tempList[0];
            this.goodsList.push(item);
            this.tempList.splice(0, 1);
            if (this.tempList.length) {
                this.timeOut = setTimeout(() => {
                    this.splitData();
                }, 200);
            }
        },
    },

    mounted() {
        let storage = this.$storage.getStorageSync('INDEX_MALL');
        this.style = storage.home_pages[this.index].style;
        this.goods_num = storage.home_pages[this.index].goods_num;
        this.loadData();
    }
}
</script>

<style scoped lang="scss">
    @import url('./index.scss');
    .u-icon {
        width: 46upx;
        height: 46upx;
        margin-right: 16upx;
    }
    .u-top {
        font-size: 24upx;
        color: #999999;
    }
    .u-name {
        color: #ff8831;
        font-size: 28upx;
        margin-right: 20upx;
    }
    .u-time-box {
        margin-left: #{23rpx};
    }
    .u-symbol {
        width: 20upx;
        height: 34upx;
    }
    .u-time {
        width: 32upx;
        height: 34upx;
        font-size: 20upx;
        color: #ffffff;
        border-radius: 4upx;
        background-color: #4c4c4c;
    }
</style>