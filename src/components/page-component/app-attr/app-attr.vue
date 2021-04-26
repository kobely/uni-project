<template>
    <view class="app-attr">
        <view @click="alert">
            <slot name="button"></slot>
        </view>
	   <view class="modal" v-if="display === 'block'"  @click="close" >
		   <view class="safe-area-inset-bottom u-attr-fixed" >
			   <view class="content" @tap.native.stop="preventD">
				   <image src="/static/image/icon/close.png" class="close" @click="close"></image>
				   <view class="first dir-left-nowrap" :class="sign =='wholesale' ? 'no-border' : ''">
					   <view class="box-grow-0 img" @click.stop="clickImg(attrPic)">
						   <app-image :img-src="attrPic" width="100%" height="100%"></app-image>
					   </view>
					   <view class="info">
						   <view class="dir-left-nowrap cross-center" :class="priceColor">
							   <view class="dir-left-nowrap cross-center">
								   <view class="dir-left-nowrap cross-center" :style="{'color':getTheme.color}" v-if="(selectAttr && selectAttr.extra) || goods.extra">
									   <view>{{selectAttr.extra ? selectAttr.extra.value + selectAttr.extra.name :
										   goods.extra.value + goods.extra.name}}
									   </view>
									   <view v-if="!(goods.sign === 'integral_mall' && attrPrice == 0)">+</view>
								   </view>
								   <app-price :theme="theme" v-if="!(goods.sign === 'integral_mall' && attrPrice == 0) && sign !== 'wholesale'" type="text-price-all" :price="attrPrice"
											  :default-price="goods.price"></app-price>
                                   <app-price :theme="theme" v-if="sign === 'wholesale'" type="text-price-all" :price="attrPrice" :max="goods.level_show == 1 ? goods.price_member_max : goods.price_max" :min="goods.level_show == 1 ? goods.price_member_min : goods.price_min"></app-price>
							   </view>
							   <view v-if="goods.level_show === 1 && (selectAttr || sign == 'wholesale')">
								   <app-member-mark :theme="theme"></app-member-mark>
							   </view>
						   </view>
						   <view class="stock">库存：{{attrNum}}</view>
					   </view>
				   </view>
				   <view class="second" :class="sign ==='wholesale' ? 'no-padding' : ''">
					   <slot name="extra"></slot>
                        <view class="wholesale" v-if="sign ==='wholesale'">
                            <view class="wholesale-attr-list dir-left-nowrap cross-center" v-if="index != goods.attr_groups.length -1" v-for="(item, index) in goods.attr_groups" :key="index">
                                <view class="position cross-center">
                                    <view class="wholesale-attr-group t-omit-two">{{item.attr_group_name}}</view>
                                </view>
                                <scroll-view @scroll="scrollGet($event,index)" :scroll-left="item.scrollLeft" class="wholesale-attr-item" scroll-x="true">
                                    <view class="scroll-attr-group cross-center">
                                        <view class="wholesale-attr-group t-omit">{{item.attr_group_name.length > 10 ? item.less_attr_group_name : item.attr_group_name}}</view>
                                    </view>
                                    <view class="attr-name attr-background" v-for="(attr, key) in item.attr_list" :key="key" :style="{'background-color': attr.active ? theme.background : '#f2f2f2'}" @click.stop="chooseAttr(index,attr)">{{attr.attr_name}}
                                        <view class="attr-number" :style="{'right':`${attr.length + 'rpx'}`,'background-color': `${theme.background}`}" v-if="index == 0 && attr.number > 0">{{attr.number}}</view>
                                    </view>
                                    <view class="attr-name attr-background" style="visibility: hidden">
                                    </view>
                                </scroll-view>
                                <view @click.stop="toBottom(index)" class="right-icon">
                                    <view></view>
                                    <image src="/static/image/icon/right.png"></image>
                                </view>
                            </view>
                            <view class="wholesale-attr-group-list">
                                <view class="wholesale-attr-group" v-for="(item, index) in goodsAttr" :key="index">
                                   <view class="dir-left-nowrap">
                                        <view class="wholesale-attr-item main-between">
                                            <view class="dir-top-nowrap main-center attr-name t-omit">
                                                <view class="t-omit">{{item.attr_list[item.attr_list.length - 1].attr_name}}</view>
                                                <view class="attr-price">￥{{goods.level_show === 1 ? item.price_member : item.price}}</view>
                                            </view>
                                            <view class="dir-left-nowrap wholesale-number-box cross-center">
                                               <image :src="item.number <= 0 ? '/static/image/plugins/un-low.png' : '/static/image/plugins/low.png'" class="block box-grow-0 cross-center main-center" @click.stop="wholesaleNumberSub(index)">
                                               </image>
                                               <view class="wholesale-number-input box-grow-0 cross-center main-center">
                                                   <app-input height="60" type="number" v-model="item.number" paddingLeft="0" :center="true" placeholder=" " @blur="wholesaleNumberBlur(index)" :focus="false" width="88"></app-input>
                                               </view>
                                               <image :src="item.number >= item.stock? '/static/image/plugins/un-add.png' : '/static/image/plugins/add.png'" class="block box-grow-0 cross-center main-center" @click.stop="wholesaleNumberAdd(index)"></image>
                                            </view>
                                        </view>
                                   </view>
                               </view>
                           </view>
                        </view>
					   <view class="attr-group" v-if="goods.type === 'goods' && sign !='wholesale'" v-for="(item, index) in newAttrGroupList" :key="index">
						   <view class="attr-group-name">{{item.attr_group_name}}</view>
						   <view class="dir-left-wrap">
							   <view v-for="(attr, key) in item.attr_list" :key="key" class="attr-item"
                                     :style="{'background-color':attr.checked && sign !== 'gift' ? theme.background : ''}"
									 :class="attr.checked && sign !== 'gift' ?  'active' : attr.checked && sign === 'gift' ?  theme + '-background active' : 'attr-item-default' + (attr.attr_num_0 ? ' attr_num_0' : '')"
									 @click.stop="storeAttrClick(attr.attr_id, item.attr_group_id)">{{attr.attr_name}}
							   </view>
						   </view>
					   </view>
					   <view v-if="chooseNumber" class="dir-left-nowrap number-box cross-center">
						   <view class="box-grow-1">数量</view>
						   <image :src="number <= 1 ? '/static/image/icon/can-be-reduced.png' : '/static/image/cart/can-be-reduced.png'" class="block box-grow-0 cross-center main-center" @click.stop="numberSub">
						   </image>
						   <view class="number-input box-grow-0 cross-center main-center">
							   <app-input type="number" v-model="number" paddingLeft="0" :center="true" placeholder=" " @blur="numberBlur"
										  :focus="false" width="88"></app-input>
						   </view>
						   <image src="/static/image/cart/can-be-added.png" class="block box-grow-0 cross-center main-center" @click.stop="numberAdd"></image>
					   </view>
				   </view>
                    <view v-if="sign ==='wholesale'" class="total">已选<text>{{totalNumber}}</text>件 总计<text>￥{{totalPrice > 0? totalPrice : '0.00'}}</text></view>
					<view v-if="sell_time > 0">
						<app-sell-tip :time="sell_time" @changeTime="changeTime"></app-sell-tip>
					</view>
					<app-jump-button form>
					<view class="three dir-left-nowrap">
						<view class="bd-btn box-grow-1" v-if="cartShow"
                             :style="{'background-color': theme.background_s,'color': theme.secondary_text}" @click="cart">{{addText}}
						</view>
						<view v-if="showRight" class="bd-btn box-grow-1  buy"  :style="{'background-color': theme.background,'color': theme.main_text}" @click="buy">
						   {{rightRemindText}}
						</view>
					</view>
					</app-jump-button>
			   </view>
		   </view>
	   </view>
    </view>
</template>

<script>
    import { mapState, mapGetters } from "vuex";
    import appPrice from "../../page-component/goods/app-price.vue";
    import appMemberMark from '../../page-component/app-member-mark/app-member-mark.vue';
    import appSellTip from '@/components/page-component/goods/app-sell-tip.vue';
	import goodsMixin from '@/core/goods-mixin.js';
    export default {
        name: "app-attr",
		mixins: [goodsMixin],
        components: {
            appPrice,
            appMemberMark,
			appSellTip
        },
        props: {
            goods: Object,
            attrGroupList: Array,
            attrCart: {
                type: Array,
                default() {
                    return [];
                }
            },
            cartShow: {
                type: [Boolean, Number],
                default() {
                    return true
                }
            },
            previewUrl: String,
            submitUrl: String,
            goodsId: {
                type:Number,
                default() {
                    return 0
                }
            },
            show: Number,
            buyText: {
                type: String,
                default() {
                    return '立即购买';
                }
            },
            plugin: {
                default: '',
            },
	        theme: {
                type: Object,
	        },
            chooseNumber: {
                type: Boolean,
                default: true,
            },
            noPay: {
                type: Boolean,
	            default: false,
            },
			buyClick: {
                type: Boolean,
				default: false,
			},
			addText: {
				type: String,
				default: '加入购物车',
			},
			is_show_buy: {
				type: Boolean,
				default: true,
			},
            sign: {
                type: String
            },
            totalPrice: {
                type: String,
                default: '0.00',
            },
            totalNumber: {
                type: Number,
                default: 0,
            },
            discount: {
                type: Number,
                default: 0,
            },
            wholesaleType: {
                type: Number,
                default: 0,
            },
            attentionSign: {
                type: String
            }
        },
        data() {
            return {
                display: 'none',
                number: 1,
                selectAttr: null,
                newAttrGroupList: null,
				pic_url: null,
                // 商品批发
                activeAttr: [],
                goodsAttr: [],
				sell_time: 0,
            };
        },
        watch: {
            show() {
                if (this.display === 'block') {
                	this.selectAttr = null;
					this.close();
				} else if (this.display === 'none') {
					this.alert();
				}
            },
            newData: {
                handler() {
                    this.$emit('attr', this.newData)
                },
                immediate: true,
            },
            attrGroupList: {
                handler() {
					this.newAttrGroupList = this.attrGroupList;
					if (this.display == 'block') {
                        this.alert();
					}
				},
				immediate: true
			},
	        goods: {
                handler() {
                    if (this.display == 'block') {
                        this.alert();
                    }
					if (this.goods) {
						this.sell_time = this.goods.sell_time;
					}
                },
		        immediate: true
	        }
        },
        mounted() {
            if(this.sign == 'wholesale') {
                this.pic_url = this.goods.attr_groups[0].attr_list[0].pic_url
                if(this.goods.attr_groups.length == 1) {
                    this.goodsAttr = this.goods.attr;
                }else {
                    for(let item of this.goods.attr_groups) {
                        let para = {
                            attr_group_name: '',
                            attr_group_id: '',
                            attr_id: '',
                            attr_name: ''
                        };
                        para.attr_group_name = item.attr_group_name
                        para.attr_group_id = item.attr_group_id
                        para.attr_id = item.attr_list[0].attr_id
                        para.attr_name = item.attr_list[0].attr_name
                        this.activeAttr.push(para)
                    }
                    for(let item of this.goods.attr) {
                        let same = true;
                        for(let i = 0;i < item.attr_list.length -1;i++) {
                            let first = {
                                attr_group_name: item.attr_list[i].attr_group_name,
                                attr_group_id: item.attr_list[i].attr_group_id,
                                attr_id: item.attr_list[i].attr_id,
                                attr_name: item.attr_list[i].attr_name
                            }
                            if(JSON.stringify(first) != JSON.stringify(this.activeAttr[i])) {
                                same = false;
                            }
                        }
                        if(same) {
                            this.goodsAttr.push(item)
                        }
                    }
                }
            }
        },
        methods: {
            alert() {
                if (this.attrGroupList && this.attrGroupList.length === 0) {
                    return;
                }
                if(this.sign !== 'wholesale') {
                    let attr_group_list = this.attrGroupList;
                    let attrs = this.goods.attr;
                    let select_attr = null;
                    this.number = 1;
                    if (attr_group_list.length === 1) {
                        for (let i in attrs) {
                            for (let j in attr_group_list[0].attr_list) {
                                if (attr_group_list[0].attr_list[j].attr_id == attrs[i].attr_list[0].attr_id) {
                                    if (attrs[i].stock > 0) {
                                        if (attrs.length === 1) {
                                            attr_group_list[0].attr_list[j].checked = true;
                                        }
                                        attr_group_list[0].attr_list[j].attr_num_0 = false;
                                        this.pic_url = attr_group_list[0].attr_list[j].pic_url;
                                    } else {
                                        this.number = 0;
                                        attr_group_list[0].attr_list[j].checked = false;
                                        attr_group_list[0].attr_list[j].attr_num_0 = true;
                                    }
                                }
                            }
                        }
                        if (attrs.length === 1) {
                            select_attr = attrs[0];
                            this.$emit('attrtap', select_attr);
                        }
                    }
                    this.newAttrGroupList = attr_group_list;
                    if(this.goods.selectAttr) {
                        this.selectAttr = this.goods.selectAttr
                    }else {
                        this.selectAttr = select_attr;
                    }
                }
                this.display = 'block';
            },
            scrollGet(e,index) {
                this.goods.attr_groups[index].scrollLeft = e.detail.scrollLeft;
                this.$forceUpdate();
            },
            toBottom(index) {
                this.$nextTick().then(() => {
                    this.goods.attr_groups[index].scrollLeft = 99999;
                    this.$forceUpdate();
                })
            },
            chooseAttr(index,attrItem) {
                let that = this;
                for(let attr of that.goods.attr_groups[index].attr_list) {
                    attr.active = false;
                    if(attr.attr_id == attrItem.attr_id && attr.attr_name == attrItem.attr_name) {
                        attr.active = true;
                    }
                }
                if(index == 0) {
                    that.pic_url = attrItem.pic_url;
                }
                that.activeAttr[index].attr_id = attrItem.attr_id
                that.activeAttr[index].attr_name = attrItem.attr_name
                that.goodsAttr = [];
                for(let item of that.goods.attr) {
                    let same = true;
                    for(let i = 0;i < item.attr_list.length -1;i++) {
                        let first = {
                            attr_group_name: item.attr_list[i].attr_group_name,
                            attr_group_id: item.attr_list[i].attr_group_id,
                            attr_id: item.attr_list[i].attr_id,
                            attr_name: item.attr_list[i].attr_name
                        }
                        if(JSON.stringify(first) != JSON.stringify(this.activeAttr[i])) {
                            same = false;
                        }
                    }
                    if(same) {
                        that.goodsAttr.push(item)
                    }
                }
                that.$forceUpdate();
                that.count();
            },
            wholesaleNumberSub(index) {
                if(this.goodsAttr[index].number == 0) {
                    return  false;
                }
                this.goodsAttr[index].number--;
                if(this.goods.attr_groups.length == 1) {
                    this.pic_url = this.goodsAttr[index].pic_url;
                }
                this.count(index);
            },
            wholesaleNumberAdd(index) {
                if(this.goodsAttr[index].number > this.goodsAttr[index].stock || this.goodsAttr[index].number == this.goodsAttr[index].stock) {
                    return false
                }
                this.goodsAttr[index].number++;
                if(this.goods.attr_groups.length == 1) {
                    this.pic_url = this.goodsAttr[index].pic_url;
                }
                this.count(index);
            },
            wholesaleNumberBlur(index) {
                if(+this.goodsAttr[index].number > +this.goodsAttr[index].stock) {
                    this.goodsAttr[index].number = this.goodsAttr[index].stock
                }
                if(this.goods.attr_groups.length == 1) {
                    this.pic_url = this.goodsAttr[index].pic_url;
                }
                this.count(index);
            },
            count(index) {
                let that =this;
                this.$emit('attrtap', {goods: that.goods, goodsAttr:that.goodsAttr});
                setTimeout(()=>{
                    that.selectAttr = that.goodsAttr[index];
                })
            },
            close() {
                this.display = 'none';
                this.$emit('close', false)
            },
            preventD() {
            },
            storeAttrClick(attr_id, attr_group_id) {
                let attr_group_list = JSON.parse(JSON.stringify(this.newAttrGroupList));
                let attrs = this.goods.attr;
                let checkedAttr = [];
                let attr_cart = this.attrCart;
                for (let i in attr_group_list) {
                    for (let j in attr_group_list[i].attr_list) {
                        let temp = attr_group_list[i].attr_list[j];
                        if (parseInt(attr_group_list[i].attr_group_id) == parseInt(attr_group_id)) {
                            if (parseInt(temp.attr_id) === parseInt(attr_id)) {
                                if (temp.checked) {
                                    temp.checked = false;
                                } else {
                                    temp.checked = true;
                                }
                                if (temp.attr_num_0) {
                                    return;
                                }
                            } else {
                                temp.checked = false;
                            }
                        }
                        if (temp.checked) {
                            if (i == 0) {
                                this.pic_url = attr_group_list[0].attr_list[j].pic_url;
							}
                            checkedAttr.push(attr_group_list[i].attr_group_id + '-' + temp.attr_id);
                        }
                    }
                }

                function inArray(val, arr) {
                    return arr.some(function (v) {
                        return val == v;
                    })
                }

                let attrNum_0 = [];
                let select_attr = null;
                let number = 1;
                for (let i in attrs) {
                    let arr = [];
                    let sign = 0;
                    for (let j in attrs[i].attr_list) {
                        let param = attrs[i].attr_list[j].attr_group_id + '-' + attrs[i].attr_list[j].attr_id;
                        if (!inArray(param, checkedAttr)) {
                            sign += 1;
                            arr.push(param);
                        }
                    }
                    if (attrs[i].stock == 0 && sign <= 1) {
                        attrNum_0 = attrNum_0.concat(arr);
                    }
                    if (sign == 0) {
                        if (!select_attr) {
                            select_attr = {};
                        }
                        select_attr = attrs[i];
                        attr_cart.forEach(item => {

                            if (item.attr_id == select_attr.id) {
                                number = item.num;
                            }
                        });
                        if (select_attr.stock <= 0) {
                            uni.showToast({
                                title: '库存不足',
                                icon: 'none'
                            });
                            return;
                        }
                        if (select_attr.stock <= number) {
                            number = select_attr.stock;
                        }
                    }
                }
                if (checkedAttr.length == 0) {
                    select_attr = null;
                }

                //库存为0的规格添加标识
                for (let i in attr_group_list) {
                    for (let j in attr_group_list[i].attr_list) {
                        let cAttr = attr_group_list[i].attr_list[j];
                        let cParam = attr_group_list[i].attr_group_id + '-' + cAttr.attr_id;
                        if (inArray(cParam, attrNum_0) && !inArray(cParam, checkedAttr)) {
                            cAttr.attr_num_0 = true;
                        } else {
                            cAttr.attr_num_0 = false;
                        }
                    }
                }
                this.newAttrGroupList = attr_group_list;
                this.selectAttr = select_attr;
                this.number = number;
                this.$emit('attrtap', this.selectAttr);
            },
            numberBlur(number) {
                number = parseInt(number.value);
                if (number > this.attrNum) {
                    uni.showToast({
                        title: '库存不足',
                        icon: 'none'
                    });
                    number = this.attrNum;
                }
                this.$emit('attrtap', this.selectAttr);
                return this.number = number;
            },
            numberSub() {
                let number = this.number;
                if (number <= 1) {
                    return true;
                }
                number--;
                this.number = number;
                this.$emit('attrtap', this.selectAttr);
            },
            numberAdd() {
                let number = this.number;
                number++;
                if (number > this.attrNum) {
                    uni.showToast({
                        title: '库存不足',
                        icon: 'none'
                    });
                    this.number = this.attrNum;
                    return;
                }
                this.number = number;
                this.$emit('attrtap', this.selectAttr);
            },
            cart() {
                if (!this.submit()) {
                    return false;
                }
                let select_attr = this.selectAttr;
                if (this.goods.sign === 'pick' || this.goods.sign === 'community') {
                	this.$emit('add', select_attr, this.number);
                	return;
				}
			// 普通商品
			if (this.goods.type === 'goods') {
                if (this.goods.sign === 'miaosha') {
                    this.$request({
                        url: this.$api.miaosha.add_cart,
                        data: {
                            miaosha_goods_id: select_attr.goods_id,
                            attr_id: select_attr.id,
                            num: this.number
                        },
                        method: 'post'
                    }).then(e => {
                        uni.showToast({
                            title: e.msg,
                            type: 'success'
                        });
                        this.display = 'none';
                        this.selectAttr.number = this.number;
                        this.$emit('selectNumber', this.selectAttr);
                    }).catch(() => {
                        this.display = 'none';
                    });
                } else if (this.goods.sign === 'flash_sale') {
					this.$request({
						url: this.$api.flash_sale.add_cart,
						data: {
							flash_goods_id: select_attr.goods_id,
							attr_id: select_attr.id,
							num: this.number
						},
						method: 'post'
					}).then(e => {
						uni.showToast({
							title: e.msg,
							type: 'success'
						});
						this.display = 'none';
						this.selectAttr.number = this.number;
						this.$emit('selectNumber', this.selectAttr);
					}).catch(() => {
						this.display = 'none';
					});
				}else if(this.goods.sign == 'wholesale') {
                    if(this.totalNumber < this.goods.wholesaleGoods.rise_num) {
                        uni.showToast({
                            title: '至少采购' + this.goods.wholesaleGoods.rise_num + this.goods.unit,
                            image: '/static/image/plugins/tip.png',
                            duration: 1000
                        });
                        return false
                    }
                    let para = [];
                    for(let item of this.goods.attr) {
                        if(item.number > 0) {
                            para.push(item)
                        }
                    }
                    this.$request({
                        url: this.$api.wholesale.cart,
                        data: {
                            attr:  JSON.stringify(para)
                        },
                        method:'post'
                    }).then(response => {
                        this.display = 'none';
                        if (response.code === 0) {
                            for(let item of this.goods.attr) {
                                item.number = '0'
                            }
                            for(let item of this.goodsAttr) {
                                item.number = '0'
                            }
                            this.count();
                            uni.hideLoading();
                            uni.showToast({
                                title: '添加成功',
                                duration: 1000
                            });
                        }
                    }).catch(response => {
                        this.display = 'none';
                    })
                } else {
                    this.$request({
                        url: this.$api.cart.add,
                        data: {
                            goods_id: select_attr.goods_id,
                            attr: select_attr.id,
                            num: this.number
                        },
                        method: 'post'
                    }).then(e => {
                        if (e.code === 0) {
							uni.showToast({
								title: e.msg,
								type: 'success'
							});
							this.display = 'none';
							this.selectAttr.number = this.number;
							this.$emit('selectNumber', this.selectAttr);
						} else {
							uni.showToast({
								title: e.msg,
								icon: "none",
								duration: 2500
							});
							this.display = 'none';
						}
						}).catch(() => {
							this.display = 'none';
						});
					}
				//	虚拟商品
				} else if (this.goods.type === 'ecard') {
					uni.showToast({
						title: '虚拟商品不允许加入购物车',
						icon: 'none'
					});
				}
            },
            buy() {
                // 判断登入
                if (!this.$user.isLogin()) {
                    this.$user.getInfo();
                    return;
                }
				if (this.goods.sell_time > 0) {
					this.rightTip();
					return ;
				}
                if (!this.submit()) return false;
                if (this.noPay) {
                    this.$emit('pay', this.number);
                    return;
                }
                if (this.buyClick) {
                    this.display = 'none';
                    this.selectAttr.number = this.number;
                    this.$emit('buyClick', this.selectAttr);
                    return false;
				}
                if(this.goods.sign == 'wholesale') {
                    if(this.totalNumber < this.goods.wholesaleGoods.rise_num) {
                        uni.showToast({
                            title: '至少采购' + this.goods.wholesaleGoods.rise_num + this.goods.unit,
                            image: '/static/image/plugins/tip.png',
                            duration: 1000
                        });
                        return false
                    }
                    let para = {};
                    let mch_list = [{
                        mch_id: 0,
                        goods_list: []
                    }];
                    for(let item of this.goods.attr) {
                        if(item.number > 0) {
                           para = {
                                id: item.goods_id,
                                attr: [],
                                num: item.number,
                                cat_id: 0,
                                goods_attr_id: item.id
                            }
                            for(let attr of item.attr_list) {
                                let attrList = {
                                    attr_id: attr.attr_id,
                                    attr_group_id: attr.attr_group_id
                                }
                                para.attr.push(attrList)

                            }
                            mch_list[0].goods_list.push(para)
                        }
                    }
                    let url = `/pages/order-submit/order-submit?mch_list=${JSON.stringify(mch_list)}`;
                    if (this.submitUrl && this.previewUrl) {
                        url += `&preview_url=${encodeURIComponent(this.previewUrl)}&submit_url=${encodeURIComponent(this.submitUrl)}&plugin=${this.plugin}`;
                    }
                    uni.navigateTo({
                        url: url
                    })
                }else {
                    let goods = this.goods;
                    let number = this.number;
                    let select_attr = this.selectAttr;
                    let goods_attr_id = select_attr.id;
                    let attr = [];
                    for (let i in select_attr.attr_list) {
                        attr.push({
                            attr_id: select_attr.attr_list[i].attr_id,
                            attr_group_id: select_attr.attr_list[i].attr_group_id
                        });
                    }
                    let mch_list = [{
                        mch_id: goods.mch_id ? goods.mch_id : 0,
                        goods_list: [{
                            id: this.goodsId ? this.goodsId: goods.id,
                            attr: attr,
                            num: number,
                            cat_id: 0,
                            goods_attr_id: goods_attr_id
                        }]
                    }];
                    let url = `/pages/order-submit/order-submit?mch_list=${JSON.stringify(mch_list)}`;
                    if (this.submitUrl && this.previewUrl) {
                        url += `&preview_url=${encodeURIComponent(this.previewUrl)}&submit_url=${encodeURIComponent(this.submitUrl)}&plugin=${this.plugin}`;
                    }
                    uni.navigateTo({
                        url: url
                    })
                }
            },
            submit() {
                let select_attr = this.selectAttr;
                if(this.goods.sign === 'wholesale') {
                    return true;
                }
                if (!select_attr) {
                    uni.showToast({
                        title: '请先选规格',
                        icon: 'none'
                    });
                    return false;
                }
                if (select_attr.stock <= 0) {
                    uni.showToast({
                        title: '库存不足',
                        icon: 'none'
                    });
                    return false;
				}
                if (this.number <= 0) {
                    uni.showToast({
                        title: '数量不能为0',
                        icon: 'none'
                    });
                    return false;
                }
                if (!this.goods) {
                    return false;
                }

                return true;
            },
            clickImg(src) {
                uni.previewImage({
                    current: 0,
                    urls: [src]
                });
            },
			changeTime(time) {
				this.sell_time = time;
			}
        },
        computed: {
            ...mapState({
                gConfig: state => state.gConfig,
				isTip: state => state.mallConfig.mall.setting.is_remind_sell_time
            }),
            attrPic() {
                if (this.pic_url) {
                    return this.pic_url;
                } else if (this.goods) {
					return this.goods.cover_pic;
                } else {
					return ``;
				}
            },
            priceColor() {
                if (this.goods && this.goods.level_show === 1) {
                    return `member`;
                } else {
                    return this.theme + '-color';
                }
            },
            attrNum() {
                if (this.selectAttr) {
                    return this.selectAttr.stock;
                } else if (this.goods) {
					return this.goods.goods_num;
                }  else {
					return 0;
				}
            },
            attrPrice() {
				if (this.selectAttr) {
                    let price;
					if (this.goods.level_show === 1) {
                        price = this.selectAttr.price_member
					} else {
						price = this.selectAttr.price;
					}
                    if(this.sign == 'wholesale') {
                        if(this.selectAttr.number == 0) {
                            return 'undefined'
                        }
                        if(this.wholesaleType == 0) {
                            price = (price*(this.discount/10)).toFixed(2);
                            return price
                        }else {
                            price = (price - this.discount).toFixed(2);
                            return price
                        }
                    }else {
                        return price
                    }
				} else if(this.sign == 'wholesale') {
                    return 'undefined';
                } else if (this.goods) {
                    if (this.goods.hasOwnProperty('price_min')) {
    					return this.goods.price_min;
    				} else {
    					return this.goods.price;
    				}
				} else {
					return 0;
				}
            },
            newData() {
                const { number, display, selectAttr } = this;
                return {
                    number,
                    display,
                    selectAttr
                }
            },
	        ...mapGetters('iPhoneX', {
                boolEmpty: 'getBoolEmpty'
	        }),
            ...mapGetters({
                userInfo: 'user/info',
            }),
			showRight() {
				return !(this.isTip == 0 && this.goods.sell_time > 0) && this.is_show_buy
			},
			remindParams() {
				return {
					sell_time: this.sell_time,
					goods_id: this.goods.id,
					template_message_list: this.goods.template_message_list,
					buy_text: this.buyText
				};
			},
        }
    }

</script>

<style scoped lang="scss">
    .app-attr {
        background-color: #ffffff;
        .modal {
            background-color: rgba(0, 0, 0, 0.5);
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
			z-index: 1603;
        }
		.content {
			width: 100%;
			background-color: #ffffff;
			border-radius: #{16rpx} #{16rpx} 0 0;
			.close {
				width: #{30rpx};
				height: #{30rpx};
				position: absolute;
				right: #{24rpx};
				top: #{24rpx};
				background-color: #ffffff;
			}
			.first {
				margin: 0 #{24rpx};
				border-bottom: #{1rpx} solid #e2e2e2;
                &.no-border {
                    border-bottom: 0;
                }
				.img {
					width: #{200rpx};
					height: #{200rpx};
					border: #{4rpx} solid #ffffff;
					border-radius: #{8rpx};
					margin-top: #{-64rpx};
					display: block;
				}
				.info {
					margin: #{36rpx} 0 #{26rpx} #{24rpx};
					font-size: $uni-font-size-import-two;
					line-height: 1;
					.stock {
						font-size: $uni-font-size-weak-one;
						color: $uni-general-color-two;
						margin-top: #{18rpx};
					}
					view {
						&:first-child {
							margin-right: #{12rpx};
						}
					}
					>.member {
						color: #f39800;
					}
				}
			}
			.second {
				max-height: #{650rpx};
                overflow-y: auto;
				overflow-x: hidden;
				padding: #{4rpx} #{24rpx};
				font-size: $uni-font-size-general-two;
                &.no-padding {
                    padding: 0;
                }
				.attr-group {
					padding: #{32rpx} 0;
					border-bottom: #{1rpx} solid #e2e2e2;
					.attr-group-name {
						color: $uni-general-color-one;
						margin-bottom: #{20rpx};
					}
					.attr-item {
						margin-right: #{20rpx};
						padding: #{15rpx 24rpx};
						border-radius: #{8rpx};
						margin-bottom: #{20rpx};
						&.attr-item-default {
							background-color: #f2f2f2;
							color: $uni-important-color-black;
						}
						&.active {
							color: #ffffff;
						}
						&.attr_num_0 {
							color: #cdcdcd;
							background-color: #f7f7f7;
						}
					}
				}
				.number-box {
					color: $uni-general-color-one;
					height: #{124rpx};
					.block {
						width: #{60rpx};
						height: #{60rpx};
						margin: 0 #{4rpx};
						&.disabled {
							background-color: #fbfbfb;
							color: $uni-general-color-two;
						}
					}
					.number-input {
						width: #{88rpx};
						height: #{60rpx};
						color: $uni-important-color-black;
						font-size: $uni-font-size-general-one;
						background-color: $uni-weak-color-two;
					}
				}
			}
			.three {
				height: #{110rpx};
				width: 100%;
                padding: 20upx 24upx;
				font-size: $uni-font-size-general-one;
			}
		}
    }
	.buy {
		color: #ffffff;
        margin-left: 20upx;
	}
    .wholesale {      
        .wholesale-attr-list {
            height: #{88rpx};
            margin: 0 #{24rpx};
            border-bottom: #{1rpx} solid #e2e2e2;
            position: relative;
            &:first-of-type {
                border-top: #{1rpx} solid #e2e2e2;
            }
            .position {
                position: absolute;
                left: 0;
                top: #{2rpx};
                z-index: 10000;
                background-color: #fff;
                height: #{83rpx};
            }
            .wholesale-attr-group {
                max-width: #{200rpx};
                flex-shrink: 0;
                margin-right: #{4rpx};
                font-size: #{20rpx};
                color: #666666;
                background-color: #fff;
            }
            .right-icon {
                position: absolute;
                right: #{-24rpx};
                top: 0;
                height: #{84rpx};
                padding-left: #{10rpx};
                width: #{50rpx};
                z-index: 10000;
                background-color: #fff;
                view {
                    height: #{40rpx};
                    width: #{3rpx};
                    background-color: #e2e2e2;
                    position: absolute;
                    left: 0;
                    top: #{24rpx};
                }
                image {
                    margin-top: #{33rpx};
                    height: #{22rpx};
                    width: #{16rpx};
                }
            }
            .wholesale-attr-item {
                height: 100%;
                width: 100%;
                white-space : nowrap;
                .scroll-attr-group {
                    display: inline-block;
                    visibility: hidden;
                    .wholesale-attr-group {
                        height: #{44rpx};
                    }
                }
                .attr-name {
                    color: #fff;
                    padding: 0 #{22rpx};
                    height: #{56rpx};
                    line-height: #{56rpx};
                    border-radius: #{8rpx};
                    font-size: #{26rpx};
                    margin-left: #{20rpx};
                    display: inline-block;
                    position: relative;
                    min-width: #{10rpx};
                    .attr-number {
                        color: #fff;
                        position: absolute;
                        top: #{-15rpx};
                        height: #{30rpx};
                        line-height: #{26rpx};
                        border: #{2rpx} solid #fff;
                        padding: 0 #{10rpx};
                        border-radius: #{15rpx};
                        font-size: #{20rpx};
                        z-index: 100;
                    }
                    &.attr-background {
                        background-color: #f2f2f2;
                        color: #353535;
                    }
                }
            }
        }
        .wholesale-attr-group-list {
            margin-top: #{20rpx};
            .wholesale-attr-group {
                margin-bottom: #{20rpx};
                .wholesale-attr-item {
                    padding: #{20rpx};
                    background-color: #f7f7f7;
                    width: 100%;
                    .attr-name {
                        width: 60%;
                        .attr-price {
                            color: #999999;
                            font-size: #{24rpx};
                        }
                    }
                    .wholesale-number-box {
                        color: $uni-general-color-one;
                        .block {
                            width: #{60rpx};
                            height: #{60rpx};
                            margin: 0 #{4rpx};
                            &.disabled {
                                background-color: #fbfbfb;
                                color: $uni-general-color-two;
                            }
                        }

                        .wholesale-number-input {
                            width: #{88rpx};
                            height: #{60rpx};
                            color: $uni-important-color-black;
                            font-size: $uni-font-size-general-one;
                            background-color: #fff;
                        }
                    }
                }
            }
        }
    }
    .total {
        width: 100%;
        height: #{80rpx};
        line-height: #{80rpx};
        text-align: right;
        padding: 0 24rpx;
        color: #353535;
        font-size: #{28rpx};
        border-top: #{1rpx} solid #e2e2e2;
        text {
            color: #ff4544;
        }
    }
    .u-attr-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #ffffff;
    }
    .bd-btn {
        line-height: 70upx;
        text-align: center;
        font-size: 26upx;
        border-radius: 35upx;
    }
</style>
