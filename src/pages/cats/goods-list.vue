<template>
    <view class="goods-list">
        <view class="item dir-left-nowrap" :class="key !== goods_list.length ? 'item-border' : ''" v-for="(item, key) in goods_list" :key="key" @click="route_go(item)">
            <view class="box-grow-0 cover-pic">
                <image class="pic" :src="item.cover_pic"></image>
                <view class="out-dialog" v-if="item.goods_stock == 0 && appSetting.is_show_stock == '1'">
                    <image mode="aspectFill" :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                </view>
            </view>
            <view class="cont dir-top-nowrap main-between">
                <text class="name t-omit-two">{{item.name}}</text>
                <view>
                    <view class="box-grow-0 cross-bottom"
                          v-if="item.is_level == 1 && item.is_negotiable != 1">
                        <app-member-price :theme="theme" :price="item.level_price"></app-member-price>
                    </view>
                    <app-sup-vip class="margin-vip" :is_vip_card_user="item.vip_card_appoint.is_vip_card_user"
                                 v-if="item.vip_card_appoint && item.vip_card_appoint.discount"
                                 :discount="item.vip_card_appoint && item.vip_card_appoint.discount">
                    </app-sup-vip>
                    <view class="price-but dir-left-nowrap main-between cross-center">
                        <view class="price dir-top-nowrap">
                            <text class="price_content" :style="{'color': theme.color}">{{item.price_content}}</text>
                            <text class="sales">{{item.sales}}</text>
                            <text class="origin-price" v-if="isListUnderlinePrice == 1">￥{{item.original_price}}</text>
                        </view>
                        <view class="but">
                            <view v-if="item.is_negotiable != 1 && isShowCart == 1 && item.goods_stock > 0" class="box-grow-0 cart-box">
                                <view class="goods-cart" >
                                    <cats-image  @click.stop.native="specification(item)" :theme="theme"></cats-image>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

    </view>
</template>

<script>
    import { mapGetters, mapState } from 'vuex';
    import catsImage from './cats-image.vue';

    export default {
        name: "goods-list",
        props : [`goods_list`, `theme`],
        components: {
            catsImage
        },
        data() {
            return {
                previewUrl: '',
                submitUrl: '',
                attrGroup: [],
                selectAttr: {},
                item: {},
                show: 0
            }
        },
        computed: {
            ...mapGetters('mallConfig', {
                getVideo: 'getVideo',
                isShowCart: 'getShowCart'
            }),
            ...mapState({
                appSetting: state => state.mallConfig.mall.setting,
                appImg: state => state.mallConfig.__wxapp_img.mall,
                isListUnderlinePrice: state => state.mallConfig.mall.setting.is_list_underline_price,
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            })
        },
        methods: {
            specification(goods) {
                if (goods.sign === 'mch') {
                    this.previewUrl = this.$api.mch.order_preview;
                    this.submitUrl = this.$api.mch.order_submit;
                } else {
                    this.previewUrl = '';
                    this.submitUrl = '';
                }
                uni.showLoading({
                    text: '',
                    mask: true
                });
                this.$request({
                    url: this.$api.goods.attr,
                    data: {
                        id: goods.id,
                        mch_id: goods.mch_id
                    }
                }).then(e => {
                    uni.hideLoading();
                    if (e.code === 0) {
                        let data = Object.assign(goods, e.data);
                        this.$emit('attr', {previewUrl:this.previewUrl, submitUrl:this.submitUrl, attr_groups:goods.attr_groups, goods: data});
                    } else {
                        uni.showToast({
                            title: e.msg,
                            icon: 'none'
                        })
                    }
                })
            },

            route_go(item) {
                // #ifndef MP-BAIDU
                if (item.video_url && this.getVideo == 1) {
                    // #ifdef MP
                    uni.navigateTo({
                        url: `/pages/goods/video?goods_id=${item.id}&sign=${item.sign}`
                    });
                    // #endif
                    // #ifdef H5
                    uni.navigateTo({
                        url: item.page_url
                    });
                    // #endif
                } else {
                    uni.navigateTo({
                        url: item.page_url
                    });
                }
                // #endif

                // #ifdef MP-BAIDU
                uni.navigateTo({
                    url: item.page_url
                });
                // #endif
            },

            onAttr(data) {
                this.selectAttr = data;
            },
        }
    }
</script>

<style scoped lang="scss">
    .cover-pic {
        position: relative;
        border-radius: #{8upx};
        margin-right: #{20upx};
    }
    .out-dialog {
        width: #{200upx};
        height: #{200upx};
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        background-color: rgba(0,0,0,.5);
        image {
            width: #{200upx};
            height: #{200upx};
        }
    }
    .goods-list {
        background-color: #ffffff;
    }
    .item {
        width: #{750upx};
        padding: #{0 24upx};
        background-color: #ffffff;
        margin: #{20upx 0};
    }
    .item-border {
        border-bottom: #{1upx} solid #e2e2e2;
    }
    .cover-pic {
        width: #{200upx};
        height: #{200upx};
        border-radius: #{8upx};
        margin-right: #{20upx};
        position: relative;
    }
    .out-dialog {
        width: #{200rpx};
        height: #{200rpx};
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        background-color: rgba(0,0,0,.5);
        image {
            width: #{200rpx};
            height: #{200rpx};
        }
    }
    .pic {
        width: #{200upx};
        height: #{200upx};

    }
    .cont {
        width: #{480upx};
        min-height: #{200upx};
        margin-bottom: #{20upx};
    }
    .name {
        font-size: #{28upx};
        line-height: 38upx;
        color: #353535;
        margin-top: #{5upx};
    }
    .margin-vip {
        margin: #{8upx 0 0 0};
    }
    .price-but {

        margin-top: #{8upx};
    }
    .price_content {
        font-size: #{32upx};
        line-height: 1;
    }
    .cart-box {
        width:#{56rpx};
        height:#{56rpx};
        border-radius: 50%;
        position: relative;
        transform: rotateZ(360deg);
    }
    .sales {
        font-size: #{20upx};
        line-height: 1;
        color: #999999;
    }
    .goods-cart {
        width:#{56rpx};
        height:#{56rpx};
        border:none;
        background: transparent;
    }

    .origin-price {
        font-size: 21upx;
        color: #999999;
        text-decoration:line-through;
    }
</style>