<template>
    <u-index-plugins url="/plugins/pick/index/index">
        <template v-slot:u-top-name>
            <view class="cross-center u-top">
                <image class="u-icon" :src="appImg.pick"></image>
                <view class="box-grow-1">N元任选</view>
            </view>
        </template>
        <template v-slot:u-body>
            <view v-if="style == '1'" class="dir-left-nowrap">
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
                                {{newData.activity.rule_price}}元任选{{newData.activity.rule_num}}件
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
                            <text class="u-price">￥{{goods.price}}</text>
                        </view>
                        <text class="u-original-price">
                            ￥{{goods.original_price}}
                        </text>
                    </view>
                </view>
            </view>
            <view v-if="style === '2'">
                <!-- <app-goods-list :theme="theme" :detail="newData.activity" :list="goodsList" sign="pick"></app-goods-list> -->
                <u-ordinary-list :activity="newData.activity" :showBuyBtn="false" :theme="getTheme" :list-style="2" :list="goodsList"></u-ordinary-list>
            </view>
        </template>
    </u-index-plugins>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import uIndexPlugins from '../u-index-plugins/u-index-plugins.vue';
import uOrdinaryList from '@/components/page-component/u-goods-list/u-ordinary-list.vue';

export default {
    name: "u-pick",
    props: {
        theme: Object,
        index: Number,
        is_required:Boolean,
        page_id: Number,
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
            newData: [],
            tempList: [],
            goodsList: [],
            time: 0,
            style: '1',
            goods_num: 10
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
            if (!this.newData) return;
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
                key: 'pick',
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
                this.newData = e.data;
                if (e.code ===0 && e.data && this.page_id === 0) {
                    let storage = this.$storage.getStorageSync('INDEX_MALL');
                    storage.home_pages[this.index].data = this.newData;
                    this.$storage.setStorageSync('INDEX_MALL', storage);
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
        }
    },
    mounted() {
        let storage = this.$storage.getStorageSync('INDEX_MALL');
        this.style = storage.home_pages[this.index].style;
        this.goods_num = storage.home_pages[this.index].goods_num;
        if (this.is_required) {
            this.loadData();
        } else {
            this.newData = storage.home_pages[this.index].data;
        }
    },
    watch: {
        copyList: {
            handler(newVal) {
                if (this.$validation.empty(newVal)) return;
                this.tempList = this.cloneData(newVal);
                this.splitData();
            }
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
    }
</style>