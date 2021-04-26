<template>
    <view class="u-waterfall">
        <view id="u-left-column" class="u-column u-left-column">
            <view v-for="(item, index) in leftList" :key="index" class="goods-item" @click="route(item)">
                <view class="demo-img-wrap">
                    <image class="demo-image"  :src="item.cover_pic" mode="widthFix"></image>
                </view>
                <view class="goods-title t-omit-two">
                    {{item.name}}
                </view>
                <view class="goods-vip" v-if="item.is_level == 1 && item.is_negotiable != 1">
                    <app-member-price
                        :price="item.level_price"
                        :theme="theme"
                    ></app-member-price>
                </view>
                <view class="goods-vip" v-if="item.vip_card_appoint.discount">
                    <app-sup-vip
                        :discount="item.vip_card_appoint.discount"
                        :is_vip_card_user="item.vip_card_appoint.is_vip_card_user"
                    ></app-sup-vip>
                </view>
                <view class="goods-content dir-left-nowrap main-between">
                    <view>
                        <view class="price" :style="{'color': theme.color}">{{item.price_content}}</view>
                        <view class="sales">{{item.sales}}</view>
                    </view>
                    <view :style="{'background-color': theme.background}" :class="'app-button-icon'" v-if="item.goods_stock !== 0"  @click.stop="buy(item)">
                    </view>
                </view>
            </view>
        </view>
        <view id="u-right-column" class="u-column u-right-column">
            <view v-for="(item, index) in rightList" :key="index" class="goods-item" @click="route(item)" >
                <view class="demo-img-wrap">
                    <image class="demo-image" :src="item.cover_pic" mode="widthFix"></image>
                </view>
                <view class="goods-title t-omit-two">
                    {{item.name}}
                </view>
                <view class="goods-vip" v-if="item.is_level == 1 && item.is_negotiable != 1">
                    <app-member-price
                            :price="item.level_price"
                            :theme="theme"
                    ></app-member-price>
                </view>
                <view class="goods-vip" v-if="item.vip_card_appoint.discount">
                    <app-sup-vip
                        :discount="item.vip_card_appoint.discount"
                        :is_vip_card_user="item.vip_card_appoint.is_vip_card_user"
                    ></app-sup-vip>
                </view>
                <view class="goods-content dir-left-nowrap  main-between">
                    <view>
                        <view class="price" :style="{'color': theme.color}">{{item.price_content}}</view>
                        <view class="sales">{{item.sales}}</view>
                    </view>
                    <view :style="{'background-color': theme.background}" :class="'app-button-icon'" v-if="item.goods_stock !== 0"  @click.stop="buy(item)">
                    </view>
                </view>
            </view>
        </view>
        <app-attr :goods="goods" :attrGroupList="goods && goods.attr_groups" :theme="theme" :show="attrShow"></app-attr>
    </view>
</template>

<script>
    import appAttr from '../../components/page-component/app-attr/app-attr.vue';

    export default {
        name: "u-waterfall",
        props: {
            value: {
                type: Array,
                required: true,
                default: function() {
                    return [];
                }
            },
            addTime: {
                type: [Number, String],
                default: 200
            },
            idKey: {
                type: String,
                default: 'id'
            },
            theme: Object
        },
        provide() {
            return {
                uWaterfall: this
            }
        },
        data() {
            return {
                leftList: [],
                rightList: [],
                tempList: [],
                children: [],
                attrShow: 0,
                goods: null
            }
        },
        watch: {
            copyFlowList(nVal, oVal) {
                let startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0;
                this.tempList = this.tempList.concat(this.cloneData(nVal.slice(startIndex)));
                this.splitData();
            }
        },
        mounted() {
            this.tempList = this.cloneData(this.copyFlowList);
            this.splitData();
        },
        computed: {
            copyFlowList() {
                return this.cloneData(this.value);
            }
        },
        methods: {
            async splitData() {
                if (!this.tempList.length) return;
                let leftRect = await this.uGetRect('#u-left-column');
                let rightRect = await this.uGetRect('#u-right-column');
                let item = this.tempList[0];
                if(!item) return ;
                if (leftRect && leftRect.height < rightRect && rightRect.height) {
                    this.leftList.push(item);
                } else if (leftRect && leftRect.height > rightRect && rightRect.height) {
                    this.rightList.push(item);
                } else {
                    if (this.leftList.length <= this.rightList.length) {
                        this.leftList.push(item);
                    } else {
                        this.rightList.push(item);
                    }
                }
                this.tempList.splice(0, 1);
                if (this.tempList.length) {
                    setTimeout(() => {
                        this.splitData();
                    }, this.addTime);
                }
            },
            cloneData(data) {
                return JSON.parse(JSON.stringify(data));
            },

            uGetRect(element) {
                return new Promise((resolve) => {
                    const query = uni.createSelectorQuery().in(this);
                    query.select(element).boundingClientRect(data => {
                        resolve(data);
                    }).exec();
                })
            },

            buy(item) {
                this.goods = item;
                this.attrShow = Math.random();
            },

            route(item) {
                uni.navigateTo({
                    url: item.page_url
                });
            },
            emptyList() {
                this.leftList = [];
                this.tempList = [];
                this.rightList = [];
            }
        },

        components: {
            appAttr
        }
    }
</script>

<style lang="scss" scoped>

    .u-waterfall {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
    }

    .u-column {
        display: flex;
        flex: 1;
        flex-direction: column;
        height: auto;
    }

    .u-image {
        width: 100%;
    }
    .u-right-column {
        margin-right: 24upx;
        margin-left: 7upx;
    }
    .u-left-column {
        margin-left: 24upx;
        margin-right: 7upx;
    }

    .demo-image {
        width: 344rpx;
    }
    .goods-item {
        width: 344rpx;
        background-color: #fff;
        margin-top: 20upx;
        overflow: hidden;
        border-radius: 16upx;
    }
    .goods-title {
        font-size: 26upx;
        color: #373737;
        padding: 0 20upx;
    }
    .goods-vip {
        padding: 0 20upx;
        margin-top: 12upx;
    }
    .goods-content {
        padding: 0 20upx;
        margin: 12upx 0 28upx 0;
    }
    .price {
        font-size: 22upx;
    }
    .sales {
        font-size: 18upx;
        color: #b0b0b0;
    }
    .app-button-icon {
        width: 40rpx;
        height: 40rpx;
        display: block;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        background-image: url('../../static/image/icon/goods-cart.png');
    }
</style>
