<template>
    <view class="u-attr">
        <view @click="turnOn">
            <slot name="btn"></slot>
        </view>
        <u-popup v-model="newValue" mode="bottom" border-radius="14" :safeAreaInsetBottom="true" @close="close">
            <view class="u-model" @touchmove.stop.prevent>
                <view class="u-top dir-left-nowrap u-border-box">
                    <view class="u-pic u-border-box" @click="clickImg(imgUrl)">
                        <image class="u-img" :src="imgUrl"></image>
                    </view>
                    <view class="u-info">
                        <view class="cross-center dir-left-nowrap" :style="{'color': theme.color}">
                            <view class="dir-left-nowrap">
                                <slot name="priceBefore"></slot>
                                <view class="u-price">
                                    <app-price
                                        v-if="is_show_price"
                                        :theme="theme"
                                        :sign="sign"
                                        :price="sellPrice"
                                        :default-price="goods.price"
                                    ></app-price>
                                </view>
                            </view>
                            <app-member-mark
                                v-if="goods.level_show === 1"
                                :theme="theme"
                            ></app-member-mark>
                        </view>
                        <view class="u-stock">库存：{{stock}}</view>
                    </view>
                    <view class="u-close-image" @click="close">
                        <image class="bd-close-image u-border-box" src="/static/image/icon/icon-close.png" ></image>
                    </view>
                </view>
                <view class="u-center">
                    <scroll-view class="u-scroll-view" scroll-y="true">
                        <slot name="extra"></slot>
                        <view v-if="goods.type === 'goods'" class="u-attr-group u-border-box" v-for="(item, index) in newGroup" :key="index">
                            <view class="u-group-name u-text">{{item.attr_group_name}}</view>
                            <view class="dir-left-wrap" >
                                <view :class="['u-group-item', attr.select ? 'u-checked' : 'u-unchecked', attr.num_0 ? 'u-attr_num_0' : '']"
                                      :style="{'background-color': attr.select ? theme.background : ''}"
                                      @click="storeAttr(attr.attr_id, item.attr_group_id, attr.num_0)"
                                      v-for="(attr, key) in item.attr_list" :key="key">
                                    {{attr.attr_name}}
                                </view>
                            </view>
                        </view>
                        <view v-if="is_choose_number" class="u-number dir-left-nowrap main-between cross-center">
                            <view class="u-text">数量</view>
                            <view class="dir-left-nowrap u-input-box">
                                <view @click.stop="numberSub" :class="[number <=1 ? 'u-reduced-1' : 'u-reduced-0', 'u-number-btn']"></view>
                                <input @blur="numberBlur" type="number" class="u-input" v-model="number">
                                <view @click.stop="numberAdd" class="u-number-btn u-added-1"></view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
				<view>
					<app-sell-tip :time="sell_time" @changeTime="changeTime"></app-sell-tip>
				</view>
				<app-jump-button form>
                <view class="u-bottom dir-left-nowrap">
                    <view
                        v-if="is_show_left && (goods.type === 'goods' || is_must_left)"
                        class="box-grow-1"
                        :style="{'color': theme.secondary_text,'background': theme.background_s_gradient_btn}"
                        :class="['u-btn', is_show_right ? 'bd-btn-left' : '']"
                        @click="leftSubmit">
                        <slot name="left_slot"></slot>
                        <template v-if="!$slots.left_slot">{{leftText}}</template>
                    </view>
					<template v-if="(sign == '' || sign == 'mch') && sell_time > 0">
						<view
							v-if="isTip == 1"
							class="box-grow-1"
							@click="rightTip"
                        :style="{'background': !$slots.right_slot ? theme.background_gradient_btn : ''}"
                        :class="[!$slots.right_slot ? ' u-btn u-btn-color' : '', !(is_show_left && (goods.type === 'goods' || is_must_left)) ? '' : ' bd-btn-right']"
						>
						{{rightRemindText}}
						</view>
					</template>
					<template v-else>
						<view
						    v-if="is_show_right"
						    class="box-grow-1"
						    @click="rightSubmit"
                        :style="{'background': !$slots.right_slot ? theme.background_gradient_btn : ''}"
                        :class="[!$slots.right_slot ? ' u-btn u-btn-color' : '', !(is_show_left && (goods.type === 'goods' || is_must_left)) ? '' : ' bd-btn-right']"
						>
						    <slot name="right_slot"></slot>
						    <template v-if="!$slots.right_slot">{{rightText}}</template>
						</view>
						<template v-if="$slots.right">
						    <slot name="right"></slot>
						</template>
					</template>
                </view>
				</app-jump-button>
            </view>
        </u-popup>
    </view>
</template>

<script>
    import uPopup from '../../basic-component/u-popup/u-popup.vue';
    import appPrice from "../goods/app-price.vue";
    import appMemberMark from "../app-member-mark/app-member-mark.vue";
    import {mapGetters, mapState} from "vuex";
	import appSellTip from './app-sell-tip.vue';
	import goodsMixin from '@/core/goods-mixin.js';

    export default {
        name: "u-attr",
		mixins: [goodsMixin],
        props: {
            value: {
                type: [Boolean, Number]
            },
            goods: {
                type: Object,
                default: function() {
                    return {}
                },
                required: true
            },
            theme: {
                type: Object
            },
            checked: {
                type: Object
            },
            is_show_price: {
                type: Boolean,
                default: true
            },
            is_show_left: {
                type: Boolean,
                default: true
            },
            is_must_left: {
                type: Boolean,
                default: false
            },
            is_show_right: {
                type: Boolean,
                default: true
            },
            is_choose_number: {
                type: Boolean,
                default: true,
            },
            leftText: {
                type: String,
                default: '加入购物车'
            },
            rightText: {
                type: String,
                default: '立即购买'
            },
            leftFunc: {
                type: Boolean
            },
            rightFunc: {
                type: Boolean
            },
            sign: {
                type: String
            },
            again: {
                type: Number
            },
            attentionSign : {
                type: String
            }
        },
        data() {
            return {
                newValue: false,
                picUrl: null,
                newGroup: [],
                number: 1,
				sell_time: 0,
            }
        },
        created() {
            // if(this.sign == 'community') {
                this.number = 1
            // }
        },
        methods: {
            close: function() {
                this.$emit('input', false);
            },
            turnOn: function() {
                this.$emit('input', true);
            },
            inArray: function(newVal, arr) {
                return arr.some(v => {
                    return newVal === v;
                });
            },
            identifier: function(copyGroup, attrNum_0, select) {
                copyGroup.forEach(f => {
                    f.attr_list.forEach(c => {
                        let param = `${f.attr_group_id}-${c.attr_id}`;
                        this.inArray(param, attrNum_0) && !this.inArray(param, select) ? c.num_0 = true : c.num_0 = false;
                    });
                });
            },
            selectCheck: function(copyAttr, attrNum_0, select) {
                copyAttr.forEach(f => {
                    let arr = [];
                    let sign = 0;
                    f.attr_list.forEach(c => {
                        let param = `${c.attr_group_id}-${c.attr_id}`;
                        if (!this.inArray(param, select)) {
                            sign += 1;
                            arr.push(param);
                        }
                    });
                    if (f.stock === 0 && sign <= 1) Array.prototype.push.apply(attrNum_0, arr);

                    if (sign === 0) {
                        this.$emit('check',{item: f, number: 1});
                    }
                });
            },
            storeAttr: function(attr_id, group_id, num_0) {
                if (num_0 === true) return;
                let newGroup = this.newGroup;
                let copyAttr = this.copyAttr;
                let select = [];
                newGroup.forEach((i, index) => {
                    let attr_list = i.attr_list;
                    attr_list.forEach((k) => {
                        if (i.attr_group_id === group_id) {
                            if (k.attr_id === attr_id) {
                                if (k.select === true) {
                                    k.select = false;
                                } else {
                                    k.select = true;
                                }
                            } else {
                                k.select = false;
                            }
                            // k.attr_id === attr_id ? k.select = true : k.select = false;
                        }
                        if (k.select === true) {
                            select.push(`${i.attr_group_id}-${k.attr_id}`);
                            if (index === 0) this.picUrl = k.pic_url;
                        }
                    });
                });
                let attrNum_0 = [];
                this.selectCheck(copyAttr, attrNum_0, select);
                this.$nextTick(() => {
                    if (this.number > this.stock) this.number = this.stock;
                });
                this.identifier(newGroup, attrNum_0, select);
                if (select.length !== newGroup.length) {
                    this.$emit('check', {
                        item: null,
                        number: 1
                    });
                }
            },
            firstSelect: function() {
                if (!this.copyGroup || !this.copyAttr) return;
                let copyGroup = this.copyGroup;
                let copyAttr = this.copyAttr;
                let groupLength = copyGroup.length;
                let select = [];
                copyAttr.forEach(i => {
                    let attr_list = i.attr_list;
                    attr_list.forEach(j => {
                        let attr_group_id = j.attr_group_id;
                        copyGroup.forEach(k => {
                            if (attr_group_id === k.attr_group_id) {
                                let groups_attr_list = k.attr_list;
                                groups_attr_list.forEach(g => {
                                    if (g.attr_id === j.attr_id) {
                                        if (i.stock > 0) {
                                            if (groupLength > 0) {
                                                g.select = true;
                                                select.push(`${k.attr_group_id}-${g.attr_id}`);
                                                if (groupLength === copyGroup.length) {
                                                    this.picUrl = g.pic_url;
                                                }
                                                groupLength--;
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    });
                });
                let attrNum_0 = [];
                this.selectCheck(copyAttr, attrNum_0, select);
                this.identifier(copyGroup, attrNum_0, select);
                this.newGroup = copyGroup;
            },
            numberBlur: function (e) {
                let value = parseInt(e.detail.value);
                if (!value) value = 1;
                if (value > this.stock) {
                    value = this.stock;
                    uni.showToast({
                        title: '库存不足',
                        icon: 'none'
                    });
                }
                this.number = value;
            },
            numberSub:function() {
                let value = this.number;
                if (value > 1) {
                    value--;
                    this.number = value;
                }
            },
            numberAdd: function() {
                let value = this.number;
                value++;
                if (value > this.stock) {
                    value = this.stock;
                    uni.showToast({
                        title: '库存不足',
                        icon: 'none'
                    });
                }
				if (!this.checkLimitBuy(value)) {
					value = this.goods.limit_buy.rest_number;
				}
                this.number = value;
            },
            leftSubmit:function() {
                if (this.leftFunc === true) {
                    this.$emit('leftFunc', this.number);
                } else {
                    this.cart();
                }
                this.close();
            },
            rightSubmit:function() {
                if (!this.checked) {
                    uni.showToast({
                        title: '请先选规格',
                        icon: 'none'
                    });
                    return false;
                }
                if (!this.$user.isLogin()) {
                    return this.$user.getInfo();
                }
                let attrs = [];

                this.checked.attr_list.forEach(item => {
                    attrs.push({
                        attr_id: item.attr_id,
                        attr_group_id: item.attr_group_id
                    });
                });
                let goods = {
                    mch_id: this.goods.mch_id ? this.goods.mch_id : 0,
                    goods_list: [
                        {
                            id: this.goods.id,
                            attrs,
                            num: this.number,
                            cat_id: 0,
                            goods_attr_id: this.checked.id
                        }
                    ]
                }
				if (!this.checkMinNUmber()) {
					return ;
				}
				if (!this.checkLimitBuy(this.number)) {
					return ;
				}
                if (this.rightFunc === true) {
                    this.$emit('rightFunc', goods);
                } else {
                    this.shop(goods);
                }
                this.close();
            },
            shop: function(goods) {
                uni.navigateTo({
                    url: `/pages/order-submit/order-submit?mch_list=${JSON.stringify([goods])}`
                });
            },
            cart: function() {
                if (!this.checked) {
                    uni.showToast({
                        title: '请先选规格',
                        icon: 'none'
                    });
                    return false;
                }
                if (this.goods.type === 'ecard') return;
                this.$request({
                    url: this.$api.cart.add,
                    method: 'post',
                    data: {
                        goods_id: this.checked.goods_id,
                        attr: this.checked.id,
                        num: this.number
                    }
                }).then(res => {
                    if (res.code === 0) {
                        uni.showToast({
                            title: res.msg,
                            icon: 'none'
                        });
                        this.$emit('cart', this.checked, this.number);
                        this.close();
                    } else {
                        uni.showToast({
                            title: res.msg,
                            icon: "none",
                            duration: 2500
                        });
                    }
                });
            },
            clickImg(src) {
                // #ifdef MP
                uni.previewImage({
                    current: 0,
                    urls: [src]
                });
                // #endif
                // #ifdef H5
                this.$jwx.previewImage({
                    current: src,
                    urls: [src]
                });
                // #endif
            },
			checkMinNUmber() {
				if (this.goods.min_number > this.number) {
					this.$tips.showToast({
						title: '该商品' + this.goods.min_number + this.goods.unit + '起售',
                        icon: 'none'
					});
					return false;
				}
				return true;
			},
			checkLimitBuy(value) {
				if (typeof this.goods.limit_buy !== 'undefined' && this.goods.limit_buy.status == 1 && this.goods.limit_buy.rest_number < value) {
                    this.$tips.showToast({
                        title: this.goods.limit_buy.text,
                        icon: 'none'
                    });
					return false;
				}
				return true;
			},
			changeTime(time) {
				this.sell_time = time;
			}
        },
        components: {
            uPopup,
            appPrice,
            appMemberMark,
			appSellTip
        },
        computed: {
            imgUrl: function() {
                if (this.picUrl) {
                    return this.picUrl;
                } else if (this.goods) {
                    return this.goods.cover_pic;
                } else {
                    return '';
                }
            },
            stock: function() {
                if (!this.$validation.isEmpty(this.checked)) {
                    return this.checked.stock;
                } else if (!this.$validation.isEmpty(this.goods)) {
                    return this.goods.goods_num;
                }
            },
            sellPrice: function() {
                if (!this.$validation.isEmpty(this.checked)) {
                    return this.goods.level_show === 1 ? this.checked.price_member : this.checked.price;
                } else if (!this.$validation.isEmpty(this.goods)) {
                    return this.goods.hasOwnProperty('price_min') ? this.goods.price_min : this.goods.price;
                }
            },
            copyGroup: function() {
                if (!this.goods) return;
                console.log(this.goods.attr_groups)
                let group = this.$utils.deepClone(this.goods.attr_groups);
                console.log(group)
                for (let i = 0; i < group.length; i++) {
                    group[i].attr_list.forEach(item => {
                        item.select = false;
                        item.num_0 = false;
                    });
                }
                return group;
            },
            copyAttr: function() {
                if (!this.goods) return;
                return this.$utils.deepClone(this.goods.attr);
            },
            ...mapGetters({
                userInfo: 'user/info',
            }),
			...mapState({
				isTip: state => state.mallConfig.mall.setting.is_remind_sell_time
			}),
			remindParams() {
				return {
					sell_time: this.sell_time,
					goods_id: this.goods.id,
					template_message_list: this.goods.template_message_list,
					buy_text: this.rightText
				};
			},
        },
        watch: {
            value: {
                handler(newVal) {
                    this.newValue = newVal;
                    if (newVal === false) {
                      this.number = 1;
                      return;
                    }
					this.sell_time = this.goods.sell_time;
                    if (this.$validation.isEmpty(this.checked)) this.$utils.throttle(this.firstSelect, 800);
                },
                immediate: true
            },
            number: {
                handler(newVal) {
                    this.$emit('check', {
                        item: this.checked,
                        number: newVal
                    });
                }
            },
            again: {
                handler() {
                    this.firstSelect();
                }
            }
        }
    }
</script>

<style scoped >
    .u-model {
        width: 750upx;
    }
    .u-top {
        margin: 0 24upx;
        border-bottom: 1upx solid #e2e2e2;
        height: 140upx;
    }
    .u-close-image {
        width: 54upx;
        height: 78upx;
        padding: 24upx 0 24rpx 24rpx;
        margin-left: 24rpx;
    }
    .bd-close-image {
        width: 30upx;
        height: 30upx;
    }
    .u-pic {
        width: 200rpx;
        height: 200rpx;
        padding: 4upx;
        border-radius: 8rpx;
        position: relative;
        top: -64upx;
        background-color: #ffffff;
    }
    .u-img {
        width: 192rpx;
        height: 192rpx;
        background-color: #ffffff;
    }
    .u-info {
        width: 424upx;
        height: 136upx;
        padding: 45upx 0 0 24upx;
    }
    .u-scroll-view {
        width: 100%;
        max-height: calc(80vh - 154upx);
    }
    .u-attr-group {
        margin:24upx 32upx 0 32upx;
        border-bottom: 1upx solid #e2e2e2;
    }
    .u-number {
        height: 124upx;
        margin: 0 32upx;
    }
    .u-group-name {
        margin-bottom: 20upx;
    }
    .u-group-item {
        padding: 15upx 24upx;
        border-radius: 8upx;
        margin:0 20upx 20upx 0;
        font-size: 26upx;
    }
    .u-checked {
        color: #ffffff;
    }
    .u-unchecked {
        background-color: #f2f2f2;
        color: #353535;
    }
    .u-attr_num_0 {
        background-color: #f7f7f7;
        color: #cdcdcd;
    }
    .u-stock {
        font-size: 24upx;
        color: #999999;
    }
    .u-price {
        margin-right: 12upx;
    }
    .u-input {
        width: 88upx;
        height: 60upx;
        background-color: #f7f7f7;
        font-size: 20upx;
        color: #353535;
        text-align: center;
    }
    .u-input-box {
        width: 218upx;
    }
    .u-number-btn {
        height: 60upx;
        width: 60upx;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
    }
    .u-number-btn:first-child {
        margin-right: 5upx;
    }
    .u-number-btn:last-child {
        margin-left: 5upx;
    }
    .u-reduced-1 {
        background-image: url("../../../static/image/icon/can-be-reduced.png");
    }
    .u-reduced-0 {
        background-image: url("../../../static/image/cart/can-be-reduced.png");
    }
    .u-added-1 {
        background-image: url("../../../static/image/cart/can-be-added.png");
    }
    .u-text {
        font-size: 26upx;
        color: #666666;
    }
    .u-bottom {
        height: 110upx;
        width: 750upx;
        padding: 20upx 24upx;
    }
    .u-btn {
        text-align: center;
        line-height: 70upx;
        border-radius: 35upx;
        font-size: 26upx;
        width: calc(50% - 10upx);
    }
    .bd-btn-left {
        margin-right:10upx;
        /*border-top-right-radius: 0;*/
        /*border-bottom-right-radius: 0;*/
    }
    .bd-btn-right {
        margin-left: 10upx;
        /*border-top-left-radius: 0;*/
        /*border-bottom-left-radius: 0;*/
    }
    .u-btn-color {
        color: #ffffff;
    }
</style>