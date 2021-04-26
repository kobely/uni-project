<template>
    <app-layout>
        <view class="pond">
            <view class="bulletin dir-left-nowrap">
                <text class="bulletin-text">结算规则：选购商品数等于任选商品数的倍数</text>
                <view class="edit" v-if="!edit" @click="setEdit(true)">编辑</view>
                <view class="edit" v-else @click="setEdit(false)">完成</view>
            </view>
            <view class="list">
                <view class="empty" v-if="pond.length === 0">
                    <view class="cart">
                        <image src="/static/image/icon/nav-icon-cart.png"></image>
                    </view>
                    <text>凑单池还是空的哦</text>
                </view>
                <view class="item dir-left-nowrap" v-for="(item) in pond" :key="item.id" v-else>
                    <view class="radio dir-top-nowrap main-center cross-center" @click="changeActive(item)" v-if="item.pick_activity_id == pick_activity_id && !edit">
                        <view class="radio-single" v-if="!item.is_active"></view>
                        <view class="radio-single-active" v-else :style="{'background-color': getTheme.background}"></view>
                    </view>
                    <view class="radio dir-top-nowrap main-center cross-center" @click="changeActive(item)" v-if="edit">
                        <view class="radio-single" v-if="!item.is_active"></view>
                        <view class="radio-single-active" v-else :style="{'background-color': getTheme.background}"></view>
                    </view>
                    <view class="radio dir-top-nowrap main-center cross-center" v-else-if="item.pick_activity_id != pick_activity_id && !edit">
                        <view class="radio-lapse">
                            失效
                        </view>
                    </view>
                    <view class="content dir-left-nowrap">
                        <image class="cover-pic" :src="item.attrs.pic_url ? item.attrs.pic_url : item.goods.cover_pic "></image>
                        <view class="text dir-top-nowrap main-between">
                            <text class="name t-omit-two">
                                {{item.goods.name}}
                            </text>
                            <view class="it-attr t-omit">
                                <text v-for="(it, i) in item.attrs.attr" :key="i">
                                    {{it.attr_group_name}}：{{it.attr_name}}<text class="empty-nbsp"></text>
                                </text>
                            </view>
                            <view class="dir-left-nowrap main-between cross-center">
                                <template v-if="item.pick_activity_id == pick_activity_id">
                                    <text class="price" :style="{'color': getTheme.color}">{{item.attrs.price}}</text>
                                    <view class="aob dir-left-nowrap main-around cross-center">
                                        <view class="icon" @click="_calcValue(item, 'minus')" :class="{'app-unreducible': item.num == 1, 'app-can-be-reduced': item.num > 1}"></view>
                                        <input v-model="item.num" @change="editInput(item)" type="number">
                                        <view class="icon" @click="_calcValue(item, 'plus')" :style="{'background-color': getTheme.background}" :class="[{'app-not-add': item.num >= item.attrs.stock, ' app-can-add': item.num < item.attrs.stock}]"></view>
                                    </view>
                                </template>
                                <view v-else style="font-size: 25rpx;">
                                    此活动已过期，无法购买
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="safe-area-inset-bottom u-bottom-fixed">
                <view class="settlement dir-left-nowrap">
                        <view class="all-price dir-left-nowrap">
                            <view class="all-select dir-left-nowrap main-center cross-center" @click="selectAll">
                                <view class="all-radio">
                                    <view class="radio-single" v-if="!is_active"></view>
                                    <view class="radio-single-active" :style="{'background-color': getTheme.background}" v-else></view>
                                </view>
                                <text class="all-text">全选</text>
                            </view>
                            <view class="red-text dir-top-nowrap main-center" v-if="!edit">
                                <text class="all-price-text" :style="{'color': getTheme.color}">总计：￥{{all_price}}</text>
                                <text class="other-good" :style="{'color': getTheme.color}" v-if="stillNeed !== 0">还需添加{{stillNeed}}件商品</text>
                            </view>
                        </view>
                        <view class="button" :style="{'background-color': getTheme.background}" :class="[{'disabled': all_num == 0}, {'disabled': stillNeed > 0}]" @click="buy" v-if="!edit">
                            去结算
                        </view>
                        <view class="delete" :style="{'color': getTheme.color}" @click="del()" v-else>
                            <view>
                                删除
                            </view>
                        </view>
                    </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "pond",

        data() {
            return {
                pond: [],
                step: 1,
                pick_activity_id: 0,
                pay_pond: [],
                all_price: 0,
                is_active: false,
                rule_num: 0,
                edit: false,
                stillNeed: 0,
                buy_goods_list: [],
                all_num: 0
            }
        },

        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.pick_activity_id = options.pick_activity_id;
            this.rule_num = options.rule_num;
        },

        onShow() {
            this.getCart();
        },

        methods: {
            changeActive(item) {
                item.is_active = !item.is_active;
            },

            _calcValue(item, type) {
                const scale = this._getDecimalScale();
                let value = item.num * scale;
                let step = this.step * scale;
                if (type === "minus") {
                    value -= step;
                } else if (type === "plus") {
                    value += step;
                }
                if (value < 1 || value > item.attrs.stock) {
                    return;
                }
                item.num = String(value / scale);
                this.editList();
                // this.$storage.setStorageSync('PICK', this.pond);
            },

            editInput() {
                this.editList();
            },

            _getDecimalScale() {
                let scale = 1;
                // 浮点型
                if (~~this.step !== this.step) {
                    scale = Math.pow(10, (this.step + "").split(".")[1].length);
                }

                return scale;
            },

            selectAll() {
                this.is_active = !this.is_active;
                for (let i = 0; i < this.pond.length; i++) {
                    if (this.pond[i].pick_activity_id == this.pick_activity_id && !this.edit) {
                        this.pond[i].is_active = this.is_active;
                    } else if (this.edit) {
                        this.pond[i].is_active = this.is_active;
                    }
                }
            },

            buy() {
                let data = [];
                this.buy_goods_list = [];
                let obj = {
                    mch_id: '0',
                    goods_list: this.buy_goods_list,
                    pick_activity_id: this.pick_activity_id
                };
                data.push(obj);
                for (let i = 0; i < this.pay_pond.length; i++) {
                    this.buy_goods_list.push({
                        id: this.pay_pond[i].goods_id,
                        attr: this.pay_pond[i].attrs.attr,
                        num: this.pay_pond[i].num,
                        cat_id:0,
                        cart_id: this.pay_pond[i].id,
                        goods_attr_id: this.pay_pond[i].attrs.id
                    });
                }

                if (this.stillNeed !== 0) {
                    return;
                }

                if (this.buy_goods_list.length === 0) {
                    return;
                }
                let str = `/pages/order-submit/order-submit?mch_list=${JSON.stringify(data)}&preview_url=${encodeURIComponent(this.$api.pick.order_preview)}&submit_url=${encodeURIComponent(this.$api.pick.order_submit)}`;
                uni.navigateTo({
                    url: str
                });
            },

            setEdit(boolean) {
                for (let i = 0; i < this.pond.length; i++) {
                    this.pond[i].is_active = false;
                }
                this.is_active = false;
                this.edit = boolean;
            },

            async del() {
                let data = JSON.parse(JSON.stringify(this.pay_pond));
                let list = [];
                for (let i = 0; i < data.length; i++) {
                    list.push( data[i].id);
                }
                const e = await this.$request({
                    url: this.$api.pick.delete,
                    method: 'post',
                    data: {
                        cart_id_list: JSON.stringify(list),
                    }
                });
                if (e.code === 0) {
                    this.is_active = false;
                    this.getCart();
                }
            },

            async getCart() {
                const e = await this.$request({
                    url: this.$api.pick.list
                });
                if (e.code === 0) {
                    let list = e.data.list;
                    for (let i = 0; i < list.length; i++) {
                        list[i].is_active = false;
                    }
                    this.pond = list;
                }
            },

            async editList() {
                let data = JSON.parse(JSON.stringify(this.pond));
                let list = [];
                for (let i = 0; i < data.length; i++) {
                    list.push({
                        attr: data[i].attr_id,
                        goods_id: data[i].goods_id,
                        num: data[i].num
                    })
                }
                const e = await this.$request({
                    url: this.$api.pick.edit,
                    method: 'post',
                    data: {
                        list: JSON.stringify(list),
                    }
                });
            }
        },

        watch: {
            pond: {
                handler(data) {
                    this.pay_pond = [];
                    let all_price = 0;
                    let all_active = 0;
                    this.all_num = 0;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].is_active) {
                            this.pay_pond.push(data[i]);
                            all_active++;
                            this.all_num += Number(data[i].num);
                            all_price += data[i].num*data[i].attrs.price;
                        }
                    }

                    if (all_active === data.length) {
                        this.is_active = true;
                        data.length === 0 ? this.is_active = false : null;
                    } else {
                      this.is_active = false;
                    }
                    this.all_num%this.rule_num === 0 ? this.stillNeed = 0 : this.stillNeed = this.rule_num - (this.all_num%this.rule_num);
                    this.all_price = all_price.toFixed(2);
                },
                deep: true
            }
        },

    }
</script>

<style scoped lang="scss">
    .pond {
        padding-bottom: #{100upx};
    }
    .settlement {
        height: #{110upx};
        width: #{750upx};
        background-color: #ffffff;
        border-top: #{1upx} solid #e2e2e2;
    }
    .button {
        width: #{250upx};
        height: #{110upx};
        font-size: #{32upx};
        color: #ffffff;
        text-align: center;
        line-height: #{110upx};
    }
    .all-price {
        width: #{500upx};
        height: #{100upx};
    }

    .bulletin {
        height: #{70upx};
        width: #{750upx};
        background-color: #ffffff;
        position: fixed;
        top: 0;
    }
    .edit {
        width: #{116upx};
        height: #{70upx};
        line-height: #{70upx};
        font-size: #{25upx};
        text-align: center;
    }
    .bulletin-text {
        font-size: #{25upx};
        line-height: #{70upx};
        width: #{610upx};
        color: #999999;
        margin-left: #{24upx};
    }
    .list {
        margin-top: #{100upx};
        background-color: #ffffff;
    }
    .item {
        width: #{750upx};
        border-bottom: #{1upx} solid #e2e2e2;
        height: #{218upx};
        padding: #{30upx 0 15upx 0};
    }

    .radio {
        width: #{85upx};
        height: #{156upx};
    }

    .radio-single {
        width: #{40rpx};
        height: #{40rpx};
        border-radius: 50%;
        background-color: white;
        border: #{1rpx} solid #e2e2e2;
    }

    .radio-single-active {
        width: #{40rpx};
        height: #{40rpx};
        border-radius: 50%;
        background-repeat: repeat;
        background-size: 100% 100%;
        background-image: url("../../../static/image/icon/icon-checkbox-checked.png");
    }

    .content {
        width: #{665upx};
        padding-right: #{25upx};
    }

    .cover-pic {
        width: #{156upx};
        height: #{156upx};
    }

    .text {
        margin-left: #{20upx};
        height: #{171upx};
        width: #{440upx};
    }
    .text>view {
        width: 100%;
    }
    .name {
        font-size: #{28upx};
        color: #3f3f3f;
    }

    .price {
        font-size: #{32upx};
    }
    .price:before {
        content: '￥';
        font-size: #{24upx};
    }
    .aob {
        height: #{60upx};
        input {
            height: #{60rpx};
            width: #{88rpx};
            font-size: #{21rpx};
            color: #353535;
            text-align: center;
        }
    }
    .app-unreducible {
        background-image: url("../../../static/image/cart/unreducible.png");
    }
    .app-not-add {
        background-image: url("./../../../static/image/cart/can-add.png");
    }
    .app-can-add {
        background-image: url("../../../static/image/icon/add-but.png");
    }
    .app-can-be-reduced {
        background-image: url("../../../static/image/icon/subtract.png");
    }
    .all-select {
        width: #{150upx};
        height: 100%;
    }
    .all-text {
        font-size: #{26upx};
        color: #3f3f3f;
        margin-left: #{5upx};
    }

    .all-radio {
        margin-right: #{5upx};
    }

    .all-price-text {
        font-size: #{26upx};
        line-height: 1;
    }

    .red-text {
        width: #{350upx};
    }
    .other-good {
        font-size: #{21upx};
        margin-top: #{10upx};
        line-height: 1;
    }
    .delete {
        width: #{250upx};
        height: #{100upx};
        position: relative;
        >view {
            font-size: #{24upx};
            text-align: center;
            width: #{140upx};
            height: #{64upx};
            line-height: #{64upx};
            border-radius: #{28upx};
            border: #{1upx} solid;
            position: absolute;
            right: #{24upx};
            top: #{18upx};
        }
    }

    .it-attr {
        font-size: #{22upx};
        color: #999999;
    }

    .disabled {
        background-color: #999999;
    }

    .empty {
        margin-top: #{150upx};
        width: #{750upx};
        /*position: relative;*/
        text-align: center;
        >text {
            color: #999999;
            font-size: #{26upx};
            position: absolute;
            top: #{325upx};
            transform: translateX(-50%);
        }
    }
    .cart {
        width: #{160upx};
        height: #{160upx};
        border-radius: 50%;
        background-color: #dedede;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        >image {
            width: #{59upx};
            height: #{59upx};
            position: absolute;
            left: 50%;
            top:50%;
            transform: translate(-50%, -50%);
        }
    }
    .empty-nbsp {
        width: #{10upx};
        display: inline-block;
    }
    .radio-lapse {
        height: #{32upx};
        width: #{64upx};
        border-radius: #{16upx};
        background-color: #cdcdcd;
        font-size: #{23upx};
        color: #ffffff;
        line-height: #{32upx};
        text-align: center;
    }
    .icon {
        height: #{44rpx};
        width: #{44rpx};
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1602;
        background-color: #ffffff;
    }
</style>