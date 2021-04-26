<template>
	<app-layout :overflow='false'>
		<view class="app-cart">
			<view class="app-announcement dir-left-nowrap main-between cross-center">
				<text class="app-announcement-text">商品库存有限，请尽快下单</text>
				<app-form-id @click="editSwitch">
					<text class="app-edit-text">{{editStatus ? '完成' : '编辑'}}</text>
				</app-form-id>
			</view>
            <template v-if="listObj.length > 0">
                <view class="app-item" v-for="(mch, index) in listObj" :key="index" >
				    <app-shop-product :theme="getTheme" @change="change" @update="update" :mch="mch"  :editStatus="editStatus" @changeSingleRadio="changeSingleRadio" @changeRadioAll="changeRadioAll" ></app-shop-product>
			    </view>
            </template>
			<view class="no-cart" v-if="listObj.length === 0">
				<view class="cart-icon">
					<image class="cart-image" src="../../static/image/icon/nav-icon-cart.png"></image>
				</view>
				<view class="cart-text">购物车还是空的哦</view>
			</view>
			<view>
				<app-empty-bottom backgroundColor="#f7f7f7" :botBool="botBool" :height="Number(100)"></app-empty-bottom>
			</view>
			<view v-if="!tabbarbool" :style="{background: 'white', position: 'fixed', bottom: 0, height: `${getEmpty}rpx`, width: '750rpx'}"></view>
            <view class="safe-area-inset-bottom bd-fixed-bottom ">
                <view class="app-settlement dir-left-nowrap main-between cross-center">
                    <view class="app-radio dir-left-nowrap main-right cross-center">
                        <app-radio type="round" :theme="getTheme" @click="setALl" v-model="all"></app-radio>
                        <text class="app-all-text">全选</text>
                        <text class="app-price" v-if="!editStatus" :style="{'color': getTheme.color}">总计: ￥{{priceNum}}</text>
                    </view>
                    <button :disabled="submitDis" :style="{'color': !submitDis ? getTheme.color:'#989898'}" :class="submitDis ? 'delete-disabled' : ''"  class="app-delete" v-if="editStatus" @click="deleteProduct">
                        删除
                    </button>
                    <button :disabled="submitDis" :style="{'background-color' : !submitDis ? getTheme.background : '#989898'}" :class="submitDis ? 'delete-disabled' : ''" class="app-settlement-button" v-else @click="settlement">
                        去结算
                    </button>
                </view>
                <view v-if="tabbarbool" class="bd-bottom-height-0"></view>
            </view>
		</view>
        <view @touchmove.stop.prevent="" class="send-dialog" @click="sendDialog=false" v-if="sendDialog">
            <view class="send-content" @click.stop="">
                <image class="send-close" @click="sendDialog=false" src="../../static/image/icon/icon-close.png"></image>
                <view class="send-title">选择结算商品</view>
                <view class="send-tip">提示：选中商品存在不同配送方式，请分开下单</view>
                <view class="send-type" v-if="countList.express.number > 0">
                    <view class="send-type-name dir-left-nowrap cross-center">
                        <image src="../../static/image/icon/express.png"></image>
                        <view>{{countList.express.name}}</view>
                    </view>
                    <view class="send-type-item">
                        <scroll-view class="send-goods" scroll-x>
                            <view class="send-goods-list" v-for="mch in countList.express.list" :key="mch">
                                <view class="send-goods-cover" v-for="(goods,index) in mch.goods_list" :key="goods.id">
                                    <image :src="goods.cover"></image>
                                </view>
                            </view>
                        </scroll-view>
                        <view class="send-count t-omit">共{{countList.express.number}}件，合计<text :style="{'color': getTheme.color}">￥{{countList.express.price}}</text></view>
                        <view @click.stop="sendTypeSubmit('express')" :style="{'background-color' : getTheme.background}" class="send-count-btn">结算</view>
                    </view>
                </view>
                <view class="send-type" v-if="countList.city.number > 0">
                    <view class="send-type-name dir-left-nowrap cross-center">
                        <image src="../../static/image/icon/city.png"></image>
                        <view>{{countList.city.name}}</view>
                    </view>
                    <view class="send-type-item">
                        <scroll-view class="send-goods" scroll-x>
                            <view class="send-goods-list" v-for="mch in countList.city.list" :key="mch">
                                <view class="send-goods-cover" v-for="(goods,index) in mch.goods_list" :key="goods.id">
                                    <image :src="goods.cover"></image>
                                </view>
                            </view>
                        </scroll-view>
                        <view class="send-count t-omit">共{{countList.city.number}}件，合计<text :style="{'color': getTheme.color}">￥{{countList.city.price}}</text></view>
                        <view @click.stop="sendTypeSubmit('city')" :style="{'background-color' : getTheme.background}" class="send-count-btn">结算</view>
                    </view>
                </view>
                <view class="send-type" v-if="countList.offline.number > 0">
                    <view class="send-type-name dir-left-nowrap cross-center">
                        <image src="../../static/image/icon/offline.png"></image>
                        <view>{{countList.offline.name}}</view>
                    </view>
                    <view class="send-type-item">
                        <scroll-view class="send-goods" scroll-x>
                            <view class="send-goods-list" v-for="mch in countList.offline.list" :key="mch">
                                <view class="send-goods-cover" v-for="(goods,index) in mch.goods_list" :key="goods.id">
                                    <image :src="goods.cover"></image>
                                </view>
                            </view>
                        </scroll-view>
                        <view class="send-count t-omit">共{{countList.offline.number}}件，合计<text :style="{'color': getTheme.color}">￥{{countList.offline.price}}</text></view>
                        <view @click.stop="sendTypeSubmit('offline')" :style="{'background-color' : getTheme.background}" class="send-count-btn">结算</view>
                    </view>
                </view>
            </view>
        </view>
	</app-layout>
</template>

<script>
	import { mapState, mapGetters } from 'vuex';
    import appShopProduct from './components/app-shop-product/app-shop-product.vue';
    import appRadio from '../../components/basic-component/app-radio/app-radio.vue';
    import appEmptyBottom from '../../components/basic-component/app-empty-bottom/app-empty-bottom.vue';
    
    export default {
        name: 'cart',
        components:{
            'app-shop-product': appShopProduct,
	        'app-radio': appRadio,
	        'app-empty-bottom': appEmptyBottom,
        },
        data() {
            return {
                countList: {
                    express: {
                        name: '',number: 0,list: [],price: 0, is_miaosha: false
                    },
                    city: {
                        name: '',number: 0,list: [],price: 0, is_miaosha: false
                    },
                    offline: {
                        name: '',number: 0,list: [],price: 0, is_miaosha: false
                    },
                },
                sendDialog: false,
                editStatus: false,
	            listObj: [],
	            all: false,
                editList: [],
	            priceNum: 0,
	            edit: false,
                botBool: true,
                // #ifdef MP
                currentRoute: this.$platDiff.route(),
                // #endif
                tabbarbool: false,
                spike: -1,
                submitDis: true
            }
        },
        computed:{
            ...mapState({
                tabBarHeight: (state) => {
                  return state.gConfig.tabBarHeight;
                },
                iphoneHeight: (state) =>{
	                return  state.gConfig.iphoneHeight;
                },
	            iphone: (state) => {
                    return state.gConfig.iphone
	            }
            }),
            ...mapGetters('iPhoneX', {
                BotHeight: 'getBotHeight',
                getEmpty: 'getEmpty',
			}),
			...mapGetters('mallConfig', {
				getTheme: 'getTheme',
			}),
            ...mapState({
                tabBarNavs: state => state.mallConfig.navbar.navs,
				is_edit: state => state.cart.is_edit
            }),
        },
        methods: {
            update(good) {
                for(let idx in this.listObj) {
                    for(let index in this.listObj[idx].goods_list) {
                        if(this.listObj[idx].goods_list[index].sign == 'wholesale' && this.listObj[idx].goods_list[index].goods_id == good.goods_id) {
                            this.listObj[idx].goods_list[index] = good;
                            this.$set(this.listObj[idx].goods_list, index, good);
                            this.$forceUpdate();
                        }
                    }
                }
            },
            setALl(data) {
                this.selectAll(data.active);
            },
	        
            // 编辑
            editSwitch() {
                this.all = false;
                for (let i = 0; i < this.listObj.length; i++) {
                    this.listObj[i].is_active = false;
                    for (let j = 0; j < this.listObj[i].goods_list.length; j++) {
                        this.listObj[i].goods_list[j].is_active = false;
                        if(this.listObj[i].goods_list[j].sign === 'wholesale') {
                            for(let attr of this.listObj[i].goods_list[j].attr_arr) {
                                attr.is_active = false;
                            }
                        }
                    }
                }
                this.editStatus = !this.editStatus;
            },
	        
	        async getProductList() {

                uni.showLoading({
	                title: '加载中'
                });
                const res = await this.$request({
	                url: this.$api.cart.list,
	                method: 'get',
                });
                if (res.code === 0) {
                    this.listObj = res.data.list;
                    if(res.data.send_type_desc.express) {
                        this.countList.express.name = res.data.send_type_desc.express
                    }else {
                        this.countList.express.show = false;
                    }
                    if(res.data.send_type_desc.city) {
                        this.countList.city.name = res.data.send_type_desc.city
                    }else {
                        this.countList.city.show = false;
                    }
                    if(res.data.send_type_desc.offline) {
                        this.countList.offline.name = res.data.send_type_desc.offline
                    }else {
                        this.countList.offline.show = false;
                    }
                    this.spikeTime(res.data.list);
                }
                uni.hideLoading();
	        },
	        
	        // 商城全选
            changeRadioAll(data) {
                for (let i = 0; i < this.listObj.length; i++) {
                    let {mch_id ,  goods_list } = this.listObj[i];
                    if (data.mch_id === mch_id) {
                        for (let j = 0; j < goods_list.length; j++) {
                            if (!this.editStatus) {
                                if (goods_list[j].new_status === 0 && goods_list[j].buy_goods_auth) goods_list[j].is_active = !data.is_active;
                            } else {
                                goods_list[j].is_active = !data.is_active;
                            }
                            if(goods_list[j].sign === 'wholesale') {
                                goods_list[j].choose_num = goods_list[j].is_active ? goods_list[j].attrs.num : 0;
                                goods_list[j].discount = goods_list[j].is_active ? goods_list[j].attrs.discount : goods_list[j].plugin_data.discount_type == 1 ? 0 : 10;
                                for(let attr of goods_list[j].attr_arr) {
                                    attr.is_active = goods_list[j].is_active;
                                }
                            }
                        }
                        this.listObj[i].is_active = !data.is_active;
                    }
                }
            },
	        
	        // 单选
            changeSingleRadio({mch, item}) {
                for (let i = 0; i < this.listObj.length; i++) {
                    if (this.listObj[i].mch_id === mch.mch_id) {
                        let goods_list_len = mch.goods_list.length;
                        let active_num = 0;
                        for (let j = 0; j < this.listObj[i].goods_list.length; j++) {
                            if(this.listObj[i].goods_list[j].sign === 'wholesale') {
                                this.listObj[i].goods_list[j].discount = this.listObj[i].goods_list[j].plugin_data.discount_type == 1 ? 0 : 10;
                                if(item.goods_id) {
                                    if (item.id === this.listObj[i].goods_list[j].id) {
                                        this.listObj[i].goods_list[j].is_active  = !this.listObj[i].goods_list[j].is_active;
                                        for(let attr of this.listObj[i].goods_list[j].attr_arr) {
                                            attr.is_active  = this.listObj[i].goods_list[j].is_active
                                        }
                                        if(!this.editStatus) {
                                            this.listObj[i].goods_list[j].choose_num = this.listObj[i].goods_list[j].is_active ? this.listObj[i].goods_list[j].attrs.num : 0;
                                            this.listObj[i].goods_list[j].discount = this.listObj[i].goods_list[j].is_active ? this.listObj[i].goods_list[j].attrs.discount : this.listObj[i].goods_list[j].plugin_data.discount_type == 1 ? 0 : 10;

                                        }
                                    }
                                }else {
                                    let choose = 0;
                                    this.listObj[i].goods_list[j].choose_num = 0;
                                    for(let attr of this.listObj[i].goods_list[j].attr_arr) {
                                        if (item.id === attr.id) {
                                            attr.is_active  = !attr.is_active;
                                        }
                                        if(attr.is_active) {
                                            choose++;
                                            this.listObj[i].goods_list[j].choose_num += +attr.num;
                                            for(let rule of this.listObj[i].goods_list[j].plugin_data.discount_rules) {
                                                if(!(+this.listObj[i].goods_list[j].choose_num < +rule.num)) {
                                                    this.listObj[i].goods_list[j].discount = rule.discount
                                                }
                                            }
                                        }
                                    }
                                    if(choose == this.listObj[i].goods_list[j].attr_arr.length) {
                                        this.listObj[i].goods_list[j].is_active = true;
                                    }else {
                                        this.listObj[i].goods_list[j].is_active = false;
                                    }
                                }
                            }else {
                                if (item.id === this.listObj[i].goods_list[j].id) {
                                    this.listObj[i].goods_list[j].is_active  = !this.listObj[i].goods_list[j].is_active;

                                }
                            }
                            
                            if (this.listObj[i].goods_list[j].is_active) {
                                active_num++;
                            }
                            
                            if (this.editStatus === false && (this.listObj[i].goods_list[j].new_status !== 0 || !this.listObj[i].goods_list[j].buy_goods_auth)) {
                                goods_list_len --;
                            }
                        }
                        if (goods_list_len === active_num) {
                            this.listObj[i].is_active = true;
                        } else {
                            this.listObj[i].is_active = false;
                        }
                    }
                }
                setTimeout(()=>{
                    this.count();
                })
            },
	        
            selectAll(bool) {
                this.listObj.map(item => {
                    item.is_active = bool;
                    item.goods_list.map(good => {
                        if (this.editStatus === false) {
                            if (item.new_status === 0 && good.new_status === 0 && good.buy_goods_auth) {
                                good.is_active = bool;
                                if(good.sign === 'wholesale') {
                                    good.choose_num = bool ? good.attrs.num : 0;
                                    good.discount = bool ? good.attrs.discount : good.plugin_data.discount_type == 1 ? 0 : 10;
                                    for(let attr of good.attr_arr) {
                                        attr.is_active = bool;
                                    }
                                }
                            }
                        } else {
                            good.is_active = bool;
                            if(good.sign === 'wholesale') {
                                for(let attr of good.attr_arr) {
                                    attr.is_active = bool;
                                }
                            }
                        }
                    })
                });
            },
	        // 结算
            settlement() {
                let all_product = [];
                this.countList.express.list = [];
                this.countList.city.list = [];
                this.countList.offline.list = [];
                this.countList.express.number = 0;
                this.countList.city.number = 0;
                this.countList.offline.number = 0;
                this.countList.express.price = 0;
                this.countList.city.price = 0;
                this.countList.offline.price = 0;
                this.countList.express.is_miaosha = false;
                this.countList.city.is_miaosha = false;
                this.countList.offline.is_miaosha = false;
                let is_miaosha = false;
                let all_product_number = 0;
                for (let i = 0; i < this.listObj.length; i++) {
                    let mch = {
                        mch_id: this.listObj[i].mch_id,
                        goods_list: [],
                    };
                    for (let j = 0; j < this.listObj[i].goods_list.length; j++) {
                        let good = this.listObj[i].goods_list[j];
                        if (good.new_status === 0 && good.buy_goods_auth) {
                            if(good.is_active) {
                                if (good.sign === 'miaosha') is_miaosha = true;
                                if(good.sign === 'wholesale') {
                                    for(let item of good.attr_arr) {
                                        if(item.num > 0 && item.is_active) {
                                           let product = {
                                                id: item.attr_info.goods_id,
                                                attr: [],
                                                send_type: good.send_type,
                                                cover: good.attrs && good.attrs.pic_url ? good.attrs.pic_url : good.goods.cover_pic,
                                                price: item.price,
                                                sign: good.sign,
                                                num: item.num,
                                                cart_id: item.id,
                                                goods_attr_id: item.attr_id
                                            }
                                            for(let attr of item.attrs.attr) {
                                                let para = {
                                                    attr_id: attr.attr_id,
                                                    attr_group_id: attr.attr_group_id  
                                                }
                                                product.attr.push(para)
                                            }
                                            mch.goods_list.push(product);
                                            all_product_number++;
                                        }
                                    }
                                }else {
                                    let product = {
                                        id: good.goods_id,
                                        attr: [],
                                        send_type: good.send_type,
                                        cover: good.attrs && good.attrs.pic_url ? good.attrs.pic_url : good.goods.cover_pic,
                                        price: good.attrs.price,
                                        num: good.num,
                                        sign: good.sign,
                                        cart_id: good.id,
                                        goods_attr_id: good.attr_id,
                                    };
                                    for (let n in good.attrs.attr) {
                                        let attr = {
                                            attr_id: good.attrs.attr[n].attr_id,
                                            attr_group_id: good.attrs.attr[n].attr_group_id,
                                        };
                                        product.attr.push(attr);
                                    }
                                    mch.goods_list.push(product);
                                    all_product_number++;
                                }
                            }else {
                                if(good.sign === 'wholesale') {
                                    for(let item of good.attr_arr) {
                                        if(item.num > 0 && item.is_active) {
                                           let product = {
                                                id: item.attr_info.goods_id,
                                                attr: [],
                                                send_type: good.send_type,
                                                cover: good.attrs && good.attrs.pic_url ? good.attrs.pic_url : good.goods.cover_pic,
                                                price: item.price,
                                                num: item.num,
                                                sign: good.sign,
                                                cart_id: item.id,
                                                goods_attr_id: item.attr_id
                                            }
                                            for(let attr of item.attrs.attr) {
                                                let para = {
                                                    attr_id: attr.attr_id,
                                                    attr_group_id: attr.attr_group_id  
                                                }
                                                product.attr.push(para)
                                            }
                                            mch.goods_list.push(product);
                                            all_product_number++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (mch.goods_list.length > 0) {
                        all_product.push(mch);
                    }
                }
                let send_type = all_product[0].goods_list[0].send_type;
                for(let item of all_product) {
                    this.countList.express.list.push({mch_id: item.mch_id,goods_list:[]});
                    this.countList.city.list.push({mch_id: item.mch_id,goods_list:[]});
                    this.countList.offline.list.push({mch_id: item.mch_id,goods_list:[]});
                    for(let goods of item.goods_list) {
                        for(let send of goods.send_type) {
                            if(send == 'express') {
                                for(let express of this.countList.express.list) {
                                    if(express.mch_id == item.mch_id) {
                                        express.goods_list.push(goods)
                                        if(goods.sign == 'miaosha') {
                                            this.countList.express.is_miaosha = true;
                                        }
                                        this.countList.express.number++;
                                        this.countList.express.price = (+this.countList.express.price + +goods.num * +goods.price).toFixed(2);
                                    }
                                }
                            }
                            if(send == 'city') {
                                for(let city of this.countList.city.list) {
                                    if(city.mch_id == item.mch_id) {
                                        city.goods_list.push(goods)
                                        if(goods.sign == 'miaosha') {
                                            this.countList.city.is_miaosha = true;
                                        }
                                        this.countList.city.number++;
                                        this.countList.city.price = (+this.countList.city.price + +goods.num * +goods.price).toFixed(2);
                                    }
                                }
                            }
                            if(send == 'offline') {
                                for(let offline of this.countList.offline.list) {
                                    if(offline.mch_id == item.mch_id) {
                                        offline.goods_list.push(goods)
                                        if(goods.sign == 'miaosha') {
                                            this.countList.offline.is_miaosha = true;
                                        }
                                        this.countList.offline.number++;
                                        this.countList.offline.price = (+this.countList.offline.price + +goods.num * +goods.price).toFixed(2);
                                    }
                                }
                            }
                        }
                    }
                }
                let pass = false;
                if(all_product_number == this.countList.express.number || all_product_number == this.countList.city.number || all_product_number == this.countList.offline.number) {
                    pass = true;
                }
                if(pass) {
                    for(let item of all_product) {
                        if(item.goods_list.length > 0) {
                            for(let goods of item.goods_list) {
                                console.log(goods.cover)
                                if(goods.cover) {
                                    delete goods.cover;
                                }
                            }
                        }
                    }
                    let jump_url = `/pages/order-submit/order-submit?mch_list=${JSON.stringify(all_product)}`;
                    if (is_miaosha) {
                        jump_url += `&preview_url=${encodeURIComponent(this.$api.miaosha.order_preview)}&submit_url=${encodeURIComponent(this.$api.miaosha.order_submit)}`;
                    }
                    this.$jump({
                        open_type: 'navigate',
                        url: jump_url,
                    });
                    setTimeout(()=> {
                        this.listObj = [];
                    }, 1000);
                }else {
                    this.sendDialog = true;
                }
            },
            sendTypeSubmit(type) {
                for(let index in this.countList[type].list) {
                    if(this.countList[type].list[index].goods_list.length == 0) {
                        this.countList[type].list.splice(index,1)
                    }
                    if(this.countList[type].list[index].cover) {
                        delete this.countList[type].list[index].cover;
                    }
                    
                }
                let jump_url = `/pages/order-submit/order-submit?send_type=${type}&mch_list=${JSON.stringify(this.countList[type].list)}`;
                if (this.countList[type].is_miaosha) {
                    jump_url += `&preview_url=${encodeURIComponent(this.$api.miaosha.order_preview)}&submit_url=${encodeURIComponent(this.$api.miaosha.order_submit)}`;
                }
                this.$jump({
                    open_type: 'navigate',
                    url: jump_url,
                });
                setTimeout(()=> {
                    this.sendDialog = false;
                    this.listObj = [];
                }, 1000);
            },
	        editNum() {
                let editList = [];
                for (let i = 0; i < this.listObj.length; i++) {
                    let goods = this.listObj[i].goods_list;
                    for (let j = 0; j < goods.length; j++) {
                        if (goods[j].new_status === 0) {
                            if(goods[j].sign === 'wholesale') {
                                for(let attr of goods[j].attr_arr) {
                                    editList.push({
                                        goods_id: attr.attr_info.goods_id,
                                        num: attr.num,
                                        attr: attr.attr_id,
                                    })
                                }
                            }else {
                                editList.push({
                                    goods_id: goods[j].goods_id,
                                    num: goods[j].num,
                                    attr: goods[j].attr_id,
                                })
                            }
                        }
                    }
                }
                this.$request({
                    method: 'post',
                    url: this.$api.cart.edit,
                    data: {
                        list: JSON.stringify(editList)
                    }
                }).then(() => {
					this.$store.dispatch('cart/is_edit', false);
                })
	        },
	        
	        // 删除商品
            async deleteProduct() {
                let product_list = [];
                
                for (let i = 0 ; i < this.listObj.length; i++) {
                    let goods = this.listObj[i].goods_list;
                    for (let j = 0 ; j < goods.length; j++) {
                        if (goods[j].is_active) {
                            if(goods[j].sign == 'wholesale') {
                                for(let item of goods[j].attr_arr) {
                                    product_list.push({
                                        mch_id: goods[j].mch_id,
                                        id: item.id,
                                    })
                                }
                            }else {
                                product_list.push({
                                    mch_id: goods[j].mch_id,
                                    id: goods[j].id,
                                })
                            }
                        }else {
                            if(goods[j].sign == 'wholesale') {
                                for(let item of goods[j].attr_arr) {
                                    if(item.is_active) {
                                        product_list.push({
                                            mch_id: goods[j].mch_id,
                                            id: item.id,
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
                
                if (!product_list.length) return;
                const res = await this.$request({
                    method: 'post',
	                url: this.$api.cart.delete,
                    data: {
                        cart_id_list: JSON.stringify(product_list),
                    }
                });
                if (res.code === 0) {
                    this.editStatus = false;
                    for (let j = 0; j < this.listObj.length; j++) {
                        for (let i = 0; i < product_list.length; i++) {
                            if (this.listObj[j].mch_id == product_list[i].mch_id) {
                                for (let k = 0; k < this.listObj[j].goods_list.length; k++) {
                                    if(this.listObj[j].goods_list[k].sign === 'wholesale') {
                                        for(let index in this.listObj[j].goods_list[k].attr_arr) {
                                            if (this.listObj[j].goods_list[k].attr_arr[index].id == product_list[i].id) {
                                                this.$delete(this.listObj[j].goods_list[k].attr_arr, index);
                                                if(this.listObj[j].goods_list[k].attr_arr.length == 0) {
                                                    this.$delete(this.listObj[j].goods_list, k);
                                                }
                                            }
                                        }
                                        this.count();
                                    }else {
                                        if (this.listObj[j].goods_list[k].id == product_list[i].id) {
                                            this.$delete(this.listObj[j].goods_list, k);
                                        }
                                    }
                                }
                                if (this.listObj[j].goods_list.length === 0) {
                                    this.$delete(this.listObj, j);
                                }
                            }
                        }
                    }
                }
            },
            b() {
                let currentRoute = undefined;
                // #ifdef MP
                currentRoute = this.currentRoute;
                // #endif
                // #ifdef H5
                currentRoute = window.location.hash.split('#')[1].split('?')[0];
                // #endif
                for (let i = 0; i < this.tabBarNavs.length; i++) {
                    if(currentRoute.includes(this.tabBarNavs[i].url.split('?')[0])) {
                        return this.tabbarbool = true;
                    }
                }
                return  this.tabbarbool = false;
            },

            change({number, id, mch_id}) {
                for (let i = 0; i < this.listObj.length; i++) {
                    if (this.listObj[i].mch_id === mch_id) {
                        for (let j = 0; j < this.listObj[i].goods_list.length; j++) {
                            if(this.listObj[i].goods_list[j].sign === 'wholesale' && this.listObj[i].goods_list[j].new_status != 3) {
                                for (let x = 0; x < this.listObj[i].goods_list[j].attr_arr.length; x++) {
                                    if (this.listObj[i].goods_list[j].attr_arr[x].id == id) {
                                        this.listObj[i].goods_list[j].attr_arr[x].num = Number(number);
                                        this.count();
                                        return;
                                    }
                                }
                            }else {
                                if (this.listObj[i].goods_list[j].id === id) {
                                    this.listObj[i].goods_list[j].num = Number(number);
                                    return;
                                }
                            }
                        }
                    }
                }
            },

            count() {
                let that = this;
                for(let item of that.listObj) {
                    for(let goods of item.goods_list) {
                        goods.price = 0;
                        if(goods.sign === 'wholesale' && (goods.new_status == 0 || (goods.new_status == 6 && goods.sell_time == 0))) {
                            if(goods.plugin_data.discount_type == 0) {
                                goods.attrs.discount = 10
                            }else {
                                goods.attrs.discount = 0;
                            }
                            goods.attrs.num = 0;
                            let price = 0;
                            goods.choose_num = 0;
                            for(let attr of goods.attr_arr) {
                                price += (+attr.num * +attr.attrs.price)
                                goods.attrs.num += +attr.num
                                if(attr.is_active) {
                                    goods.choose_num += +attr.num
                                }
                            }
                            let chooseNum = 0;
                            for(let item of goods.attr_arr) {
                                if(item.is_active) {
                                    chooseNum += +item.num
                                }
                            }
                            for(let i of goods.plugin_data.discount_rules) {
                                if(!(+goods.attrs.num < +i.num)) {
                                    goods.attrs.discount = i.discount
                                }
                                if(!(+chooseNum < +i.num)) {
                                    goods.discount = i.discount
                                }
                            }
                            if(goods.plugin_data.discount_type == 0) {
                                goods.price = (price*(goods.attrs.discount/10)).toFixed(2);
                            }else {
                                goods.price = (price - (goods.attrs.discount*goods.attrs.num)).toFixed(2);
                            }
                            if(goods.attrs.num < goods.plugin_data.up_num) {
                                goods.new_status = 6;
                            }else {
                                goods.new_status = 0;
                            }
                        }
                    }
                }
            },
	        
	        setTime(data) {
                let is_spike = false;
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < data[i].goods_list.length; j++) {
                        if (data[i].goods_list[j].sell_time > 0) {
                            is_spike = true;
                            data[i].goods_list[j].sell_time--;
                            let second = parseInt(data[i].goods_list[j].sell_time);
                            let minute = 0;
                            let hour = 0;
                            if (second > 60) {
                                minute = parseInt(second / 60);
                                second = parseInt(second % 60);
                                if (minute > 60) {
                                    hour = parseInt(minute / 60);
                                    minute = parseInt(minute % 60);
                                }
                            }
                            let timeDaily = {
                                h: hour < 10 ? ('0' + hour) : hour,
                                m: minute < 10 ? ('0' + minute) : minute,
                                s: second < 10 ? ('0' + second) : second,
                            };
                            this.$set(this.listObj[i].goods_list[j], 'sell_string',  `${timeDaily.h + ':' + timeDaily.m + ':' + timeDaily.s}`);
                            if(data[i].goods_list[j].sell_time == 0) {
                                this.count();
                            }
                        }
                        if (data[i].goods_list[j].sign === 'miaosha' && data[i].goods_list[j].miaosha_status === 1) {
                            is_spike = true;
                            data[i].goods_list[j].miaosha_time--;
                            let second = parseInt(data[i].goods_list[j].miaosha_time);
                            let minute = 0;
                            let hour = 0;
                            if (second > 60) {
                                minute = parseInt(second / 60);
                                second = parseInt(second % 60);
                                if (minute > 60) {
                                    hour = parseInt(minute / 60);
                                    minute = parseInt(minute % 60);
                                }
                            }
                            let timeDaily = {
                                h: hour < 10 ? ('0' + hour) : hour,
                                m: minute < 10 ? ('0' + minute) : minute,
                                s: second < 10 ? ('0' + second) : second,
                            };
                            this.$set(this.listObj[i].goods_list[j], 'miaosha_string',  `${timeDaily.h + ':' + timeDaily.m + ':' + timeDaily.s}`);
                        }
                        if (data[i].goods_list[j].sign === 'flash_sale' && (data[i].goods_list[j].flash_sale_status === 1 || data[i].goods_list[j].flash_sale_status === 2)) {
							is_spike = true;
							data[i].goods_list[j].flash_sale_time--;
							let second = parseInt(data[i].goods_list[j].flash_sale_time);
							let minute = 0;
							let hour = 0;
							if (second > 60) {
								minute = parseInt(second / 60);
								second = parseInt(second % 60);
								if (minute > 60) {
									hour = parseInt(minute / 60);
									minute = parseInt(minute % 60);
								}
							}
							let timeDaily = {
								h: hour < 10 ? ('0' + hour) : hour,
								m: minute < 10 ? ('0' + minute) : minute,
								s: second < 10 ? ('0' + second) : second,
							};
							this.$set(this.listObj[i].goods_list[j], 'flash_sale_string',  `${timeDaily.h + ':' + timeDaily.m + ':' + timeDaily.s}`);
						}
                    }
                }
                return is_spike;
	        },
	        spikeTime(data) {
	            clearInterval(this.spike);
	            let is_spike = this.setTime(data);
	            if (!is_spike) return;
                this.spike = setInterval(() => {
                    let is_spike = this.setTime(data);
                    if (!is_spike) {
                        clearInterval(this.spike);
                    }
                }, 1000);
	        }
        },

	    onShow() {
            this.submitDis = true;
			this.listObj = [];
			setTimeout(() => {
				this.getProductList();
			}, 1000);
            this.all = false;
        },
        onHide() {
            this.editNum();
            clearInterval(this.spike);
        },
        onUnload() {
            this.editNum();
            clearInterval(this.spike);
        },
	    watch:{
            listObj: {
                handler(listObj) {
                    this.priceNum = 0;
                    let listNum = 0;
                    let activeIndex = 0;
                    let check = true;
                    for (let i = 0; i < listObj.length; i++) {
                        if(listObj[i].new_status == 0 || this.editStatus) {
                            listNum += listObj[i].goods_list.length;
                        }
                        let status = listObj[i].goods_list.length;
                        let newStatus = 0;
                        for (let j = 0; j < listObj[i].goods_list.length;j++) {
                            if (listObj[i].goods_list[j].new_status !== 0 && !listObj[i].goods_list[j].buy_goods_auth) {
                                newStatus++;
                            }
                            if (this.editStatus === false && (listObj[i].goods_list[j].new_status !== 0 || !listObj[i].goods_list[j].buy_goods_auth)) {
                                listNum --;
                            }
                            if (listObj[i].goods_list[j].is_active) {
                                if(listObj[i].goods_list[j].sign === 'wholesale') {
                                    listNum += listObj[i].goods_list[j].attr_arr.length - 1;
                                    for(let item of listObj[i].goods_list[j].attr_arr) {
                                        if (!this.editStatus) {
                                            if(listObj[i].goods_list[j].plugin_data.discount_type == 0) {
                                                let discount = listObj[i].goods_list[j].discount ? listObj[i].goods_list[j].discount : 10;
                                                item.price = (+item.attrs.price*(+discount/10)).toFixed(2);
                                            }else {
                                                let discount = listObj[i].goods_list[j].discount ? listObj[i].goods_list[j].discount : 0;
                                                item.price = (+item.attrs.price - +discount).toFixed(2);
                                            }
                                        }
                                        if(item.is_active) {
                                            if (!this.editStatus) {
                                                let num = Number(item.price) * Number(item.num);
                                                this.priceNum += num;
                                                if(!(listObj[i].goods_list[j].choose_num < listObj[i].goods_list[j].plugin_data.up_num)) {
                                                    activeIndex++;
                                                }
                                            }else {
                                                activeIndex++;
                                            }
                                        }
                                    }
                                }else {
                                    if (!this.editStatus) {
                                        let num = Number(listObj[i].goods_list[j].attrs.price) * Number(listObj[i].goods_list[j].num);
                                        this.priceNum += num;
                                    }
                                    activeIndex++;
                                }
                            }else {
                                if(listObj[i].goods_list[j].sign === 'wholesale' && listObj[i].goods_list[j].new_status !== 3) {
                                    listNum += listObj[i].goods_list[j].attr_arr.length - 1;
                                    for(let item of listObj[i].goods_list[j].attr_arr) {
                                        if(listObj[i].goods_list[j].plugin_data.discount_type == 0) {
                                            let discount = listObj[i].goods_list[j].discount ? listObj[i].goods_list[j].discount : 10;
                                            item.price = (+item.attrs.price*(+discount/10)).toFixed(2);
                                        }else {
                                            let discount = listObj[i].goods_list[j].discount ? listObj[i].goods_list[j].discount : 0;
                                            item.price = (+item.attrs.price - +discount).toFixed(2);
                                        }
                                        if(item.is_active) {
                                            if (!this.editStatus) {
                                                let num = Number(item.price) * Number(item.num);
                                                this.priceNum += num;
                                                if(!(listObj[i].goods_list[j].choose_num < listObj[i].goods_list[j].plugin_data.up_num)) {
                                                    activeIndex++;
                                                }else {
                                                    check = false;
                                                }
                                            }else {
                                                activeIndex++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (status === newStatus) {
                            this.listObj[i].new_status = this.listObj[i].new_status == 0 ? 1 : this.listObj[i].new_status;
                        }
                    }
                    if (activeIndex === listNum) {
                        if (listNum === 0 && activeIndex === 0) {
                            this.all = false;
                        } else {
                            this.all = true;
                        }
                    } else {
                        this.all = false;
                    }
                    if (activeIndex > 0 && check) {
                        this.submitDis = false;
                    } else {
                        this.submitDis = true;
                    }
                    this.priceNum = this.priceNum.toFixed(2);
                },
	            deep: true,
            },
            tabBarNavs: {
                handler: function() {
                    this.b();
                },
                immediate: true,
            }
	    }
    }
</script>

<style lang="scss" scoped>
	.app-cart {
		background-color: #f7f7f7;
		position: absolute;
		top: 0;
		left: 0;
		width: #{750rpx};
		.app-announcement {
			width: 100%;
			height: #{72rpx};
			background-color: #ffffff;
			.app-announcement-text {
				font-size: #{26rpx};
				color: #999999;
				margin-left: #{24rpx};
			}
			.app-edit-text {
				font-size: #{26rpx};
				color: #353535;
				margin-right: #{32rpx};
			}
		}
		.app-settlement {
			width: 100%;
			height: #{110rpx};
			border-top: #{1rpx} solid #e2e2e2;
			background-color: white;
            padding: 15upx 24upx;
			.app-radio {
				padding-left: #{23rpx};
				.app-price {
					margin-left: #{24rpx};
					font-size: #{28rpx};
				}
			}
			.app-all-text {
				margin-left: #{9rpx};
				font-size: #{25rpx};
				color: #3f3f3f;
			}
			.app-delete {
				width: #{140rpx};
				height: #{64rpx};
				line-height: #{64rpx};
				text-align: center;
				background-color: white;
				border-radius: #{32rpx};
				border: #{1rpx} solid ;
				font-size: #{28rpx};
				margin: #{0 24rpx 0 0};
				padding: 0;
			}
			.delete-disabled {
				color: #989898;
				border: #{1rpx} solid #989898;
			}
			.app-settlement-button {
				height: #{82rpx};
				width: #{250rpx};
				color: #ffffff;
				font-size: #{30rpx};
				line-height: #{82rpx};
				text-align: center;
				margin: 0;
				padding: 0;
                border-radius: 41upx;
				border: none;
			}
		}
		.no-cart {
			width: 100%;
			.cart-icon {
				width: #{160rpx};
				height: #{160rpx};
				border-radius: 50%;
				background-color: rgba(0, 0, 0, 0.1);
				margin: #{150rpx auto 40rpx};
				.cart-image {
					height: #{80rpx};
					width: #{80rpx};
					margin: #{40rpx};
				}
			}
			.cart-text {
				font-size: #{30rpx};
				color: #888;
				text-align: center;
				
			}
		}
	}
    .send-dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.3);
        z-index: 1700;
        .send-content {
            position: absolute;
            bottom: 0;
            left: 0;
            background-color: #fff;
            border-top-left-radius: 16rpx;
            border-top-right-radius: 16rpx;
            padding: 24rpx;
            .send-close {
                position: absolute;
                top: 24rpx;
                right: 24rpx;
                width: 30rpx;
                height: 30rpx;
            }
            .send-title {
                font-size: 32rpx;
                margin: 16rpx 0 36rpx;
                text-align: center;
                color: #000000;
            }
            .send-tip {
                font-size: 24rpx;
                color: #999999;
            }
            .send-type {
                margin-top: 32rpx;
                .send-type-name {
                    height: 42rpx;
                    font-size: 28rpx;
                    color: #353535;
                    image {
                        width: 42rpx;
                        height: 42rpx;
                        margin-right: 18rpx;
                    }
                }
                .send-type-item {
                    margin-top: 15rpx;
                    height: 226rpx;
                    border-radius: 16rpx;
                    background-color: #f2f2f2;
                    padding: 20rpx;
                    padding-left: 0;
                    padding-bottom: 0;
                    width: 702rpx;
                    position: relative;
                    .send-goods {
                        white-space: nowrap;
                        .send-goods-list {
                            white-space: nowrap;
                            margin-left: 0;
                        }
                        view {
                            height: 110rpx;
                            margin-left: 20rpx;
                            display: inline-block;
                            image {
                                width: 110rpx;
                                height: 110rpx;
                                border-radius: 16rpx;
                            }
                        }
                    }
                    .send-count {
                        height: 96rpx;
                        line-height: 96rpx;
                        width: 500rpx;
                        font-size: 22rpx;
                        color: #353535;
                        position: absolute;
                        bottom: 0;
                        left: 30rpx;
                        text {
                            color: #ff4544;
                        }
                    }
                    .send-count-btn {
                        position: absolute;
                        bottom: 22rpx;
                        right: 28rpx;
                        height: 54rpx;
                        border-radius: 27rpx;
                        width: 128rpx;
                        text-align: center;
                        line-height: 54rpx;
                        background-color: #ff4544;
                        color: #fff;
                        font-size: 28rpx;
                    }
                }
            }
        }
    }
    .bd-fixed-bottom {
        width: 100%;
        z-index: 1500;
        position: fixed;
        left: 0;
        bottom: 0;
    }
    .bd-bottom-height-0 {
        width:100%;
        height: 110upx;
    }
</style>
