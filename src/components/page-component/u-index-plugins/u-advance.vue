<template>
    <u-index-plugins url="/plugins/advance/index/index">
        <template v-slot:u-top-name>
            <view class="cross-center u-top">
                <image class="u-icon" :src="appImg.advance"></image>
                <view class="box-grow-1">预售</view>
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
                        <view class="u-margin dir-left-nowrap">
                            <text :style="{'background-color': theme.background}" class="u-des-price">
                                定金￥{{goods.deposit}}抵￥{{goods.swell_deposit}}
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
                            <text class="u-price">预售价￥{{goods.price}}</text>
                        </view>
                        <text class="u-original-price">
                            ￥{{goods.original_price}}
                        </text>
                    </view>
                </view>
            </view>
            <view v-if="style === '2'">
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
    name: "u-advance",
    props: {
        index: Number,
        page_id: Number,
        is_required: Boolean,
        theme: {
            type: Object
        },
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
            style: '1',
            goods_num: 20
        };
    },
    computed: {
        ...mapGetters('mallConfig', {
            getTheme: 'getTheme',
        })
    },
    components: {
        uIndexPlugins,
        uOrdinaryList
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
                key: 'advance',
                page_id: this.page_id,
                index: this.index
            }
            if(this.goods_num) {
                para.goods_num = this.goods_num
            }
            this.$request({
                url: this.$api.index.extra,
                data: para
            }).then(info => {
                if (info.code === 0 && info.data) {
                    this.newData = info.data.list;
                    if (this.page_id === 0) {
                        let storage = this.$storage.getStorageSync('INDEX_MALL');
                        storage.home_pages[this.index].list = this.newData;
                        this.$storage.setStorageSync('INDEX_MALL', storage);
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
                this.time = setTimeout(() => {
                    this.splitData();
                }, 200);
            }
        },
    },
    mounted() {
        let storage = this.$storage.getStorageSync('INDEX_MALL');
        this.style = storage.home_pages[this.index].style;
        this.goods_num = storage.home_pages[this.index].goods_num;
        if (this.is_required) {
            this.loadData();
        } else {
            this.newData = storage.home_pages[this.index].list;
        }
    },
    watch: {
        newData: {
            handler(newVal) {
                if (this.$validation.empty(newVal)) return;
                this.tempList = this.cloneData(newVal);
                this.splitData();
            },
            immediate: true
        }
    },
    destroyed() {
        clearTimeout(this.time);
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
        font-size: 28upx;
        color: #ff4544;
    }
    .u-des-price {
        display: inline-block;
        font-size: 19upx;
        color: #ffffff;
        border-radius: 7upx;
        padding: 0upx 5upx;
        height: 25upx;
        line-height: 25rpx;
    }
</style>
