<template>
    <u-index-plugins url="/plugins/flash_sale/index/index">
        <template v-slot:u-top-name>
            <view class="cross-center u-top">
                <image class="u-icon" :src="appImg.flash_sale"></image>
                <view class="box-grow-1">限时抢购</view>
                <template v-if="newData.activity || newData.next_activity">
                    <view class="dir-left-nowrap time-box">
                        <view class="main-center cross-center time">{{time_str.day}}</view>
                        <view class="main-center cross-center maohao">:</view>
                        <view class="main-center cross-center time">{{time_str.hou}}</view>
                        <view class="main-center cross-center maohao">:</view>
                        <view class="main-center cross-center time">{{time_str.min}}</view>
                        <view class="main-center cross-center maohao">:</view>
                        <view class="main-center cross-center time">{{time_str.sec}}</view>
                    </view>
                    <view :class="time_str ? 'box-grow-0' : 'box-grow-1'" style="color: #353535;margin-left: 10rpx;font-size: 22rpx;">{{newData.str}}</view>
                </template>
            </view>
        </template>
        <template v-slot:u-body>
            <view v-if="style == '1'" class="dir-left-nowrap">
                <view v-for="(goods, index) in goodsList" v-bind:key="index" class="u-goods dir-top-nowrap box-grow-0" v-on:click="router(goods)">
                    <view class="u-cover-box">
                        <view class="u-out-dialog" v-if="isShowStock(goods)">
                            <image class="u-pic" :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                        </view>
                        <image class="box-grow-0 u-cover" v-bind:src="goods.goodsWarehouse.cover_pic"></image>
                    </view>
                    <view class="box-grow-0 u-goods-name t-omit-two ">
                        {{goods.name}}
                    </view>
                    <view class="box-grow-1 u-content  dir-top-nowrap main-right">
                        <view class="u-margin dir-left-nowrap">
                            <text :style="{'background-color': theme.background}" class="u-des-price">
                                {{goods.discount_type == 1 ? goods.min_discount + '折' : '减' + goods.min_discount + '元'}}
                            </text>
                        </view>
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
                        <text class="u-original-price">
                            ￥{{goods.goodsWarehouse.original_price}}
                        </text>
                    </view>
                </view>
            </view>
            <view v-if="style === '2'">
                <!-- <app-goods-list :theme="theme" :list="goodsList" sign="flash_sale"></app-goods-list> -->
                <u-ordinary-list :showBuyBtn="false" :theme="getTheme" :list-style="2" :list="goodsList"></u-ordinary-list>
            </view>
        </template>
    </u-index-plugins>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import uIndexPlugins from '../u-index-plugins/u-index-plugins.vue';
import uOrdinaryList from '@/components/page-component/u-goods-list/u-ordinary-list.vue';

export default {
    name: "u-flash-sale",
    props: {
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
            newData: {},
            tempList: [],
            goodsList: [],
            time: 0,
            time_str:{
                day: '00',
                hou: '00',
                min: '00',
                sec: '00'
            },
            timing: null,
            style: '1',
            goods_num: 20,
        };
    },
    components: {
        uIndexPlugins,
        uOrdinaryList
    },
    computed: {
        ...mapGetters('mallConfig', {
            getTheme: 'getTheme',
        }),
        copyList: function() {
            return this.newData.list;
        }
    },
    methods: {
        router(goods) {
            this.$emit('router', goods);
        },
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
        loadData() {
            let para = {
                type: this.page_id === 0 ? 'mall' : 'diy',
                key: 'flash_sale',
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
                if (e.code === 0) {
                    this.newData = e.data;
                    if (this.newData.activity) {
                        this.newData.str = '结束';
                        this.set_time(this.newData.activity.end_at);
                    } else {
                        this.newData.str = '开始';
                        if (this.newData.next_activity && this.newData.next_activity.start_at) {
                            this.set_time(this.newData.next_activity.start_at);
                        }
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
        set_time(time_at) {
            clearInterval(this.timing);
            let time_str = new Date(time_at.replace(/-/g, '/'));
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
            let sec = parseInt((time/1000)%60);
            this.time_str.day = day < 10 ? '0' + day : day;
            this.time_str.hou = hou < 10 ? '0' + hou : hou;
            this.time_str.min = min < 10 ? '0' + min : min;
            this.time_str.sec = sec < 10 ? '0' + sec : sec;
        },
    },
    mounted() {
        let storage = this.$storage.getStorageSync('INDEX_MALL');
        this.style = storage.home_pages[this.index].style;
        this.goods_num = storage.home_pages[this.index].goods_num;
        this.loadData();
    },
    watch: {
        copyList: {
            handler(newVal) {
                if (this.$validation.empty(newVal)) return;
                this.tempList = this.cloneData(newVal);
                this.splitData();
            }
        },
        pageHide: {
            handler(v) {
                if (v) {
                    clearInterval(this.timing);
                    return;
                } else {
                    if (this.newData.activity) {
                        this.newData.str = '结束';
                        this.set_time(this.newData.activity.end_at);
                    } else if (this.newData.next_activity) {
                        this.newData.str = '开始';
                        this.set_time(this.newData.next_activity.start_at);
                    }
                }

            },
            immediate: true
        },
    },
    destroyed() {
        clearTimeout(this.time);
    },
    beforeDestroy() {
        clearInterval(this.timing);
    },
}
</script>

<style scoped lang="scss">
    @import url('./index.scss');
    .u-icon {
        width: 46upx;
        height: 46upx;
        margin-right: 16upx;
        background-color: #ff4544;
    }
    .u-top {
        font-size: 28upx;
        color: #ff4544;
    }
    .u-des-price {
        display: inline-block;
        font-size: 19upx;
        color: #ffffff;
        border-radius: 7upx;
        padding: 0 5upx;
        height: 25upx;
        line-height: 25rpx;
    }
    .time-box {
        margin-left: #{23rpx};

        .time {
            width: #{32rpx};
            height: #{34rpx};
            background-color: #4c4c4c;
            color: #ffffff;
            font-size: #{20rpx};
            border-radius: #{4rpx};
        }

        .maohao {
            width: #{20rpx};
            height: #{34rpx};
            color: #353535;
        }
    }
</style>