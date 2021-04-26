<template>
    <view>
        <view class="app-list" :style="{'margin-top': `${top}rpx`}">
            <view class="app-item" v-for="(item,index) in list" :key="item.id">
                <view class="dir-left-nowrap cross-center app-item-title">
                    <view class="check-icon" @click="choose(index,item)">
                        <image src="/static/image/icon/icon-uncheck.png" v-if="!item.choose"></image>
                        <image :style="{'background-color': theme.background,'opacity': `${item.type == 1 ? '0.3' : '1'}`}"  src="/static/image/icon/icon-checkbox-checked.png" v-else></image>
                    </view>
                    <view :style="{'color': theme.color}" class="item-type">{{item.type_text}}</view>
                    <view class="item-name">{{item.name}}</view>
                </view>
                <view class="item-goods dir-left-nowrap" v-for="goods in item.host_list" :key="goods.id">
                    <view class="check-icon">
                        <image :style="{'background-color': theme.background,'opacity': `${goods.opacity}`}" src="/static/image/icon/icon-checkbox-checked.png"></image>
                    </view>
                    <image @click="toDetail(goods.goods_id)" class="goods-img" :src="goods.cover_pic"></image>
                    <view v-if="goods.stock == 0 || item.stock == 0" class="out-dialog">
                        <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                    </view>
                    <view class="dir-top-nowrap goods-info">
                        <view class="item-good-name">{{goods.name}}</view>
                        <view class="item-good-num">x1</view>
                        <view class="item-good-attr" v-if="!goods.choose_attr" @click="chooseAttr(goods,index)">
                            <view class="item-good-attr-text t-omit-two">未选择</view>
                            <image class="item-good-attr-arrow" src="/static/image/icon/bottom.png"></image>
                        </view>
                        <view class="item-good-attr" v-else @click="chooseAttr(goods,index)">
                            <view class="item-good-attr-text t-omit-two">
                                <text v-for="attr in goods.choose_attr.attr_list" :key="attr.attr_id">{{attr.attr_group_name}}:{{attr.attr_name}}</text>
                            </view>
                            <image class="item-good-attr-arrow" src="/static/image/icon/bottom.png"></image>
                        </view>
                        <view v-if="item.type == 2 && goods.choose_attr" :style="{'color': theme.color}" class="choose_price">￥{{goods.total_price}}</view>
                    </view>
                </view>                    
                <view class="item-goods dir-left-nowrap" v-for="(goods,idx) in item.goods_list" :key="goods.id">
                    <view class="check-icon" v-if="item.type == 2" @click="chooseGoods(idx,index,goods)">
                        <image src="/static/image/icon/icon-uncheck.png" v-if="!goods.choose_goods"></image>
                        <image :style="{'background-color': theme.background}" src="/static/image/icon/icon-checkbox-checked.png" v-else></image>
                    </view>
                    <image @click="toDetail(goods.goods_id)" class="goods-img" :src="goods.cover_pic"></image>
                    <view v-if="goods.stock == 0 || item.stock == 0" class="out-dialog">
                        <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                    </view>
                    <view class="dir-top-nowrap goods-info">
                        <view class="item-good-name">{{goods.name}}</view>
                        <view class="item-good-num">x1</view>
                        <view class="item-good-attr" v-if="!goods.choose_attr" @click="chooseAttr(goods,index)">
                            <view class="item-good-attr-text t-omit-two">未选择</view>
                            <image class="item-good-attr-arrow" src="/static/image/icon/bottom.png"></image>
                        </view>
                        <view class="item-good-attr" v-else @click="chooseAttr(goods,index)">
                            <view class="item-good-attr-text t-omit-two">
                                <text v-for="(attr,idx) in goods.choose_attr.attr_list" :key="attr.attr_id">
                                    <text v-if="idx > 0">,</text>
                                    <text>{{attr.attr_group_name}}:{{attr.attr_name}}</text>
                                </text>
                            </view>
                            <image class="item-good-attr-arrow" src="/static/image/icon/bottom.png"></image>
                        </view>
                        <view v-if="item.type == 2 && goods.choose_attr"  :style="{'color': theme.color}" class="choose_price">￥{{goods.total_price}}</view>
                    </view>
                </view>
                <view class="app-price">
                    <template v-if="item.total_price && hidden">
                        <text>套餐价</text>
                        <text :style="{'color': theme.color}">￥{{item.total_price > -0.01 ? item.total_price : '0.00'}}</text>
                    </template>
                </view>
            </view>
        </view>
        <u-attr
            v-if="goods"
            v-model="attrShow"
            :goods="goods"
            rightText="确定"
            :is_show_left="cartShow"
            :is_choose_number="cartShow"
            :theme="theme"
            :checked="checked"
            @check="check"
            :again="attrShow"
            :right-func="true"
            @rightFunc="buyClick"
        ></u-attr>
<!--         <app-attr v-if="goods" :goodsId="goods.goods_id"
                  :goods="goods.detail"
                  :attrGroupList="goods.attr_groups"
                  :cartShow="cartShow"
                  :chooseNumber="cartShow"
                  buyText="确定"
                  :buyClick="buyBool"
                  :show="attrShow"
                  :theme="theme"
                  @buyClick="buyClick"></app-attr> -->
    </view>
</template>

<script>
    import { mapState } from "vuex";
    // import appAttr from "../../../../components/page-component/app-attr/app-attr.vue";
    import uAttr from "../../../../components/page-component/goods/u-attr.vue";

    export default {
        name: 'app-index',
        props: {
            list: {
                type: Array
            },
            top: {
                type: Number,
                default() {
                    return 388
                }
            },
            search: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            allCount: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            hidden: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            theme: Object
        },
        data() {
            return {
                attrShow: 0,
                goods: null,
                cartShow: false,
                buyBool: true,
                max_discount: '0.00',
                noAttrList: [],
                checked: null,
                total: 0,
            }
        },
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img.mall,
                appSetting: state => state.mallConfig.mall.setting,
            })
        },
        components: {
            'u-attr': uAttr,
        },
        methods: {
            // 规格选择
            check({item}) {
                this.checked = item;
            },
            toDetail(id) {
                uni.navigateTo({
                    url: '/pages/goods/goods?id=' + id
                });
            },
            buyClick() {
                let that = this;
                let selectAttr = this.checked
                that.list[that.index].goods_list.forEach(v => {
                    if(v.id == that.goods.id) {
                        v.choose_attr = selectAttr;
                        v.detail.selectAttr = selectAttr;
                        for(let i in selectAttr.attr_list) {
                            for(let j in v.attr_groups) {
                                if(v.attr_groups[j].attr_group_id == selectAttr.attr_list[i].attr_group_id) {
                                    for(let z in v.attr_groups[j].attr_list) {
                                        v.attr_groups[j].attr_list[z].checked = false;
                                        if(v.attr_groups[j].attr_list[z].attr_id == selectAttr.attr_list[i].attr_id && v.attr_groups[j].attr_list[z].attr_name == selectAttr.attr_list[i].attr_name) {
                                            v.attr_groups[j].attr_list[z].checked = true;
                                        }
                                    }
                                }
                            }
                        }
                        if(that.list[that.index].type == 2) {
                            v.choose_goods = true;
                            that.list[that.index].host_list[0].choose_goods = true
                            that.list[that.index].host_list[0].opacity = 0.3
                        }
                        that.count();
                        that.$forceUpdate();
                    }
                })
                that.list[that.index].host_list.forEach(v => {
                    if(v.id == that.goods.id) {
                        for(let i in selectAttr.attr_list) {
                            for(let j in v.attr_groups) {
                                if(v.attr_groups[j].attr_group_id == selectAttr.attr_list[i].attr_group_id) {
                                    for(let z in v.attr_groups[j].attr_list) {
                                        v.attr_groups[j].attr_list[z].checked = false;
                                        if(v.attr_groups[j].attr_list[z].attr_id == selectAttr.attr_list[i].attr_id && v.attr_groups[j].attr_list[z].attr_name == selectAttr.attr_list[i].attr_name) {
                                            v.attr_groups[j].attr_list[z].checked = true;
                                        }
                                    }
                                }
                            }
                        }
                        v.choose_attr = selectAttr;
                        v.detail.selectAttr = selectAttr;
                        v.choose_goods = true;
                        that.count();
                        that.$forceUpdate();
                        if (that.search) {
                            that.$emit('search', v, 1);
                            return false;
                        }
                    }
                })
                that.goods = null;
                that.checked = null;
            },
            chooseAttr(goods,index, type) {
                console.log(goods)
                this.goods = goods;
                this.index = index;
                this.attrShow = Math.random();
            },
            choose(index,item) {
                if(this.list[index].type == 2) {
                    this.list[index].choose = !this.list[index].choose;
                    for(let i in this.list[index].goods_list) {
                        this.list[index].goods_list[i].choose_goods = this.list[index].choose
                    }
                    this.count();
                    this.$forceUpdate();
                    if (this.search) {
                        this.$emit('search', item);
                    }
                }
            },
            chooseGoods(idx,index,item) {
                this.list[index].goods_list[idx].choose_goods = !this.list[index].goods_list[idx].choose_goods;
                let all = true;
                for(let i in this.list[index].goods_list) {
                    if(!this.list[index].goods_list[i].choose_goods) {
                        all = false;
                    }
                }
                this.list[index].choose = all;
                this.$forceUpdate();
                this.$emit("updateList",this.list);
                this.count();
                if (this.search) {
                    this.$emit('search', item, 1);
                }
            },
            count() {
                let that = this;
                that.total = 0;
                that.noAttrList = [];
                that.max_discount = 0;
                let i = 0;
                if(that.list[i].type == 1) {
                    that.list[i].total_price = 0;
                    let allchoose = true;
                    for(let x in that.list[i].goods_list) {
                        if(that.list[i].goods_list[x].choose_attr) {
                            if(that.list[i].goods_list[x].choose_attr.price > 0) {
                                that.list[i].total_price += +that.list[i].goods_list[x].choose_attr.price;
                            }
                        }else {
                            allchoose = false;
                        }
                        if(that.list[i].choose && that.list[i].goods_list[x].choose_attr == null ) {
                            that.noAttrList.push(that.list[i].goods_list[x])
                        }
                    }
                    if(that.list[i].total_price < 0) {
                        that.list[i].total_price = 0
                    }
                    that.list[i].total_price = (+that.list[i].total_price - +that.list[i].price);
                    if(that.list[i].total_price < 0) {
                        that.list[i].total_price = 0
                    }
                    if(that.list[i].choose) {
                        that.list[i].total_price = that.list[i].total_price.toFixed(2)
                    }else {
                        delete that.list[i].total_price
                    }
                    if(that.list[i].choose && allchoose) {
                        that.total += +that.list[i].total_price
                    }
                }else if(that.list[i].type == 2) {
                    that.list[i].total_price = 0;
                    if(that.list[i].host_list[0].choose_attr) {
                        that.list[i].total_price = +that.list[i].host_list[0].choose_attr.price - +that.list[i].host_list[0].price
                        that.list[i].host_list[0].total_price = +that.list[i].host_list[0].choose_attr.price - +that.list[i].host_list[0].price
                        that.max_discount += +that.list[i].host_list[0].price
                        if(that.list[i].host_list[0].total_price < 0) {
                            that.list[i].host_list[0].total_price = 0
                        }else {
                            that.list[i].host_list[0].total_price = +that.list[i].host_list[0].total_price.toFixed(2);
                        }
                        that.total += +that.list[i].host_list[0].total_price
                    }else {
                        that.noAttrList.push(that.list[i].host_list[0])
                    }
                    for(let x in that.list[i].goods_list) {
                        if(that.list[i].goods_list[x].choose_goods && that.list[i].goods_list[x].choose_attr) {
                            that.list[i].goods_list[x].total_price = +that.list[i].goods_list[x].choose_attr.price - +that.list[i].goods_list[x].price
                            that.max_discount += +that.list[i].goods_list[x].price
                            if(that.list[i].goods_list[x].total_price < 0) {
                                that.list[i].goods_list[x].total_price = 0
                            }else {
                                that.list[i].goods_list[x].total_price = +that.list[i].goods_list[x].total_price.toFixed(2);
                            }
                            that.total += +that.list[i].goods_list[x].total_price
                            if(that.list[i].total_price > 0) {
                                that.list[i].total_price += +that.list[i].goods_list[x].total_price
                            }
                        }
                        if(that.list[i].goods_list[x].choose_goods && that.list[i].goods_list[x].choose_attr == null ) {
                            that.noAttrList.push(that.list[i].goods_list[x])
                        }
                    }
                    if(that.list[i].total_price < 0) {
                        that.list[i].total_price = 0
                    }
                    that.list[i].total_price = +that.list[i].total_price.toFixed(2);
                    that.max_discount = +that.max_discount.toFixed(2);
                }
                that.total = that.total.toFixed(2);
                that.$emit("updateList",that.list);
                that.$emit("change",{
                    total:that.total,
                    max_discount:that.max_discount
                });
                that.$emit("update",that.noAttrList);
            },
        },

        mounted() {
            let that = this;
            let get = setInterval(function(){
                if(that.list.length > 0) {
                    clearInterval(get)
                    that.count();
                }
            },500)
        }
    }
</script>

<style scoped lang="scss">
    .app-list {
        .app-item {
            background-color: #fff;
            margin: #{10rpx} #{24rpx};
            border-radius: #{16rpx};
            padding: #{24rpx};
            padding-top: 0;
            padding-left: 0;
            .app-price {
                line-height: #{74rpx};
                height: #{74rpx};
                text-align: right;
                color: #353535;
                font-size: #{28rpx};

                .max-discount {
                    font-size: #{24rpx};
                    color: #f39800;
                    margin-left: #{16rpx};
                }
            }
            .app-item-title {
                padding-right: #{24rpx};
                height: #{64rpx};
                font-size: #{28rpx};
                color: #353535;
                font-weight: bold;
                .check-icon {
                    padding: #{28rpx} #{20rpx} 0 #{24rpx};
                    width: #{72rpx};
                    height: #{64rpx};
                    image {
                        height: #{32rpx};
                        width: #{32rpx};
                        border-radius: #{16rpx};
                        display: block;
                    }
                }
                .item-type {
                    margin-top: #{24rpx};
                    flex-shrink: 0;
                    height: #{40rpx};
                    line-height: #{38rpx};
                    padding: 0 #{12rpx};
                    border-radius: #{20rpx};
                    margin-right: #{16rpx};
                    border: #{2rpx} solid;
                    font-weight: 400;
                }
                .item-name {
                    margin-top: #{24rpx};
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-break: break-all;
                }
            }
            .item-goods {
                margin-top: #{28rpx};
                margin-left: #{76rpx};
                padding-bottom: #{28rpx};
                border-bottom: #{2rpx} solid #e2e2e2;
                position: relative;
                .out-dialog {
                    width: #{180rpx};
                    height: #{180rpx};
                    border-radius: #{16rpx};
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 10;
                    background-color: rgba(0,0,0,.5);
                    image {
                        width: #{180rpx};
                        height: #{180rpx};
                        border-radius: #{16rpx};
                    }
                }
                .check-icon {
                    position: absolute;
                    left: #{-76rpx};
                    top: 50%;
                    margin-top: #{-52rpx};
                    padding: #{24rpx};
                    width: #{80rpx};
                    height: #{80rpx};
                    image {
                        height: #{32rpx};
                        width: #{32rpx};
                        border-radius: #{16rpx};
                        display: block;
                    }
                }
                .goods-img {
                    height: #{180rpx};
                    width: #{180rpx};
                    border-radius: #{8rpx};
                    margin-right: #{24rpx};
                    position: relative;
                }
                .goods-info {
                    font-size: #{28rpx};
                    color: #353535;
                    position: relative;
                    .item-good-name {
                        width: #{336rpx};
                        max-height: #{90rpx};
                        line-height: #{42rpx};
                        word-break: break-all;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .item-good-num {
                        position: absolute;
                        right: 0;
                        top: 0;
                    }
                    .choose_price {
                        font-size: #{28rpx};
                        margin-top: #{20rpx};
                    }
                    .item-good-attr {
                        margin-top: #{20rpx};
                        background-color: #f7f7f7;
                        width: #{398rpx};
                        display: inline-block;
                        padding: #{8rpx} #{16rpx};
                        border-radius: #{8rpx};
                        position: relative;
                        .item-good-attr-text {
                            width: #{314rpx};
                            line-height: #{32rpx};
                            max-height: #{62rpx};
                            color: #999;
                        }
                        .item-good-attr-arrow {
                            position: absolute;
                            right: #{16rpx};
                            top: 50%;
                            margin-top: #{-6rpx};
                            height: #{12rpx};
                            width: #{22rpx};
                        }
                    }
                }
            }
            .item-goods:last-of-type {
                border-bottom: 0
            }
        }
    }
</style>