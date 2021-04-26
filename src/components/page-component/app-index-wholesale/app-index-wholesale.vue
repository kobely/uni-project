<template>
    <view class="app-index-wholesale">
        <view class="top dir-left-nowrap cross-center" @click="jump(`/plugins/wholesale/index/index`)">
            <image class="box-grow-0" src="../../../static/image/icon/wholesale.png"></image>
            <view class="box-grow-1">商品批发</view>
            <view class="dir-left-nowrap cross-center">
                <view class="box-grow-0 more">更多</view>
                <image class="box-grow-0 icon" src="../../../static/image/icon/arrow-right.png"></image>
            </view>
        </view>
        <view v-if="style == '1'" class="dir-left-nowrap list">
            <block v-for="(item, key) in newData" :key="key">
                <app-form-id @click="jump_router(item)">
                    <view class="item box-grow-0 dir-top-nowrap">
                        <view class="cover-pic box-grow-0">
                            <view class="out-dialog" v-if="item.goods_stock == 0 && appSetting.is_show_stock == '1'">
                                <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                            </view>
                            <app-image :img-src="item.cover_pic" width="220rpx" height="220rpx"></app-image>
                        </view>
                        <view class="title t-omit-two box-grow-0">{{item.name}}</view>
                        <view class="box-grow-1 dir-top-nowrap main-right">
                            <view v-if="item.is_level == 1 && item.is_negotiable == 0">
                                <app-member-price :theme="getTheme" :price="item.level_price"></app-member-price>
                            </view>
                            <app-sup-vip :is_vip_card_user="item.vip_card_appoint.is_vip_card_user" margin="4rpx 0 0" v-if="item.vip_card_appoint.discount > 0 && item.is_negotiable == 0" :discount="item.vip_card_appoint.discount"></app-sup-vip>
                            <view v-if="item.is_negotiable == 1" class="price" :style="{'color': getTheme.color}">价格面议</view>
                            <view v-if="item.is_negotiable == 0" :style="{'color': getTheme.color}"  class="price dir-left-nowrap">
                                <text class="text"  style="font-size: 28rpx;" >￥{{item.price}}</text>
                            </view>
                            <view v-if="item.is_negotiable == 0 && isListUnderlinePrice == 1" class="old-price">
                                ￥{{item.goodsWarehouse.original_price}}
                            </view>
                        </view>
                        <view class="cross-center count">{{item.group_count}}</view>
                    </view>
                </app-form-id>
            </block>
        </view>
        <view v-if="style === '2'">
            <u-ordinary-list :showBuyBtn="false" :theme="getTheme" :list-style="2" :list="newData"></u-ordinary-list>
        </view>
    </view>
</template>


<script>
    import {mapGetters, mapState} from 'vuex';
    import uOrdinaryList from '@/components/page-component/u-goods-list/u-ordinary-list.vue';

    export default {
        name: "app-index-wholesale",
        props: {
            index: Number,
            page_id: Number,
            is_required: Boolean
        },
        data() {
            return {
                appAttr: {},
                selectAttr: null,
                wholesaleDiscount: 0,
                totalNumber: 0,
                totalPrice: '0.00',
                newData: {},
                style: '1',
                goods_num: 20,
                attrGoods: {
                    goods: null,
                    attrShow: 0
                },
                show: 0,
                attrShow: false
            };
        },
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img.mall,
                appSetting: state => state.mallConfig.mall.setting,
                mall: state => state.mallConfig.mall,
                isListUnderlinePrice: state => state.mallConfig.mall.setting.is_list_underline_price
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapGetters('mallConfig',{
                vip: 'getVip'
            }),
            ...mapGetters('mallConfig', {
                getVideo: 'getVideo'
            })
        },
        methods: {
            jump(url) {
                this.$jump({
                    url: url,
                    open_type: 'navigate'
                })
            },
            jump_router(data) {
                uni.navigateTo({
                    url: `/plugins/wholesale/goods/goods?id=${data.id}`
                })
            },
            loadData() {
                let para = {
                    type: this.page_id === 0 ? 'mall' : 'diy',
                    key: 'wholesale',
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
        },
        components: {
            uOrdinaryList
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
    }
</script>

<style scoped lang="scss">
    .text1 {
        color: #ff8831;
        font-size: $uni-font-size-general-one;
    }

    .app-index-wholesale {

        .top {
            padding: #{0 24rpx};
            color: #ff4544;
            font-size: $uni-font-size-general-one;
            height: #{72rpx};
            background-color: white;
            image {
                width: #{46rpx};
                height: #{46rpx};
                display: block;
                margin-right: #{8rpx};
            }
            
            .more {
                font-size: $uni-font-size-general-two;
                margin-right: #{12rpx};
                color: $uni-general-color-two;
            }
            
            .icon {
                width: #{12rpx};
                height: #{22rpx};
                display: block;
            }
        }

        .list {
            margin-top: #{8rpx};
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;

            .item {
                background-color: #ffffff;
                margin-right: #{8rpx};
                padding: #{20rpx 20rpx 24rpx 20rpx};
                height: 100%;
                border-radius: #{8rpx};

                .cover-pic {
                    width: #{220rpx};
                    height: #{220rpx};
                    display: block;
                    margin-bottom: #{20rpx};
                    .out-dialog {
                        width: #{220rpx};
                        height: #{220rpx};
                        position: absolute;
                        top: #{20rpx};
                        left: #{20rpx};
                        z-index: 10;
                        background-color: rgba(0,0,0,.5);
                        image {
                            width: #{220rpx};
                            height: #{220rpx};
                        }
                    }
                }

                .title {
                    font-size: 26upx;
                    line-height: #{32upx};
                    color: $uni-important-color-black;
                    width: #{220rpx};
                }

                .price {
                    .text {
                        text-overflow: ellipsis;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 1;
                        overflow: hidden;
                        line-height: 1;
                        vertical-align: sub;
                        margin-top: #{10rpx};
                    }
                }
                .old-price {
                    font-size: #{21upx};
                    line-height: 1;
                    color: #999999;
                    text-decoration:line-through;
                    margin: #{5upx 0 20upx 0};
                }

                .count {
                    font-size: $uni-font-size-weak-one;
                    color: $uni-general-color-two;
                }
            }
        }
    }
</style>