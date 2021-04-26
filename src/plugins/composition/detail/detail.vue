<template>
    <app-layout>
        <app-list v-if="loading" :hidden="false" :top="0" :theme="getTheme" :list="list" v-on:update="update" v-on:change="getTotal" v-on:updateList="updateList"></app-list>
        <view class="list" v-if="other.length > 0">
            <view class="title">其他套餐</view>
            <view v-for="(item, index) in other" :key="index" class="item dir-left-nowrap">
                <app-composition :theme="getTheme" @click="choose(item)" @look="choose(item)" :item="item"></app-composition>
            </view>
        </view>
        <view v-if="list.length > 0" :class="['bottom-space', `${iphone_x? 'iphone_x':''}`]"></view>
        <view v-if="list.length > 0" :class="['bottom','main-between','cross-center', `${iphone_x? 'iphone_x':''}`]">
            <view>
                <view class="dir-left-nowrap cross-center">
                    <view>总计</view>
                    <view class="total-price" :style="{'color': getTheme.color}">￥{{total == 0 ? '0.00' : total}}</view>
                </view>
                <view class="discount" :style="{'color': getTheme.color}">已省￥{{max_discount}}</view>
            </view>
            <view @click="toBuy" class="submit-btn" :style="{'background-color': getTheme.background}">立即购买</view>
        </view>
        <view class="dialog-bg" v-if="showNoAttr">
            <view class="dialog">
                <view class="dialog-title">
                    <view class="dialog-big-title">以下商品未选择规格</view>
                    <view>请选择规格后购买</view>
                </view>
                <view :class="[`${noAttrList.length > 4 ? 'dir-left-wrap' : 'main-center'}`,`dialog-goods-list`]">
                    <view class="dialog-goods" v-for="(item, index) in noAttrList" :key="index">
                        <image :src="item.cover_pic"></image>
                    </view>
                </view>
                <view @click="close" class="dialog-close" :style="{'color': getTheme.color}">我知道了</view>
            </view>
        </view>
        <view class='no-tip' v-if="list.length == 0 && loading">
            <image src="../image/pull-off.png"></image>
            <view>您选购的套餐已下架</view>
            <view @click="toComposition" class="to-composition" :style="{'background-color': getTheme.background}">逛逛套餐专区</view>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters} from "vuex";
    import appList from '../components/app-list/app-list';
    import appComposition from "../../../components/basic-component/app-composition/app-composition.vue";

    export default {
        data() {
            return {
                list: [],
                other: [],
                total: 0,
                showNoAttr: false,
                noAttrList: [],
                goods_id: '',
                max_discount: '0.00',
                page: 2,
                hidden: false,
                iphone_x: false,
                noMore: false,
                composition_id: '',
                loading: false
            }
        },
        components: {
            'app-list': appList,
            'app-composition': appComposition
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            })
        },
        methods: {
            choose(item) {
                this.composition_id = item.id;
                this.total = '0.00';
                this.max_discount = '0.00';
                this.getDetail();
            },
            toComposition() {
                uni.redirectTo({
                    url: '/plugins/composition/index/index'
                });
            },
            toBuy() {
                let that = this;
                let attr = [];
                let list = [
                    {
                        mch_id: 0,
                        composition_list: []
                    }
                ]
                if(that.noAttrList.length > 0) {
                    that.showNoAttr = true;
                }else {
                    for(let i in that.list) {
                        attr = [];
                        if(that.list[i].choose) {
                            let arr = {
                                composition_id: that.list[i].id,
                                goods_list: []
                            }
                            if(that.list[i].host_list.length > 0) {
                                for(let x in that.list[i].host_list[0].choose_attr.attr_list) {
                                    attr.push({
                                        attr_id: that.list[i].host_list[0].choose_attr.attr_list[x].attr_id,
                                        attr_group_id: that.list[i].host_list[0].choose_attr.attr_list[x].attr_group_id,
                                    })
                                }
                                arr.goods_list.push({
                                    id: that.list[i].host_list[0].goods_id,
                                    num: 1,
                                    goods_attr_id: that.list[i].host_list[0].choose_attr.goods_attr_id,
                                    attr: []
                                })
                            }
                            let goods_attr = [];
                            for(let y in that.list[i].goods_list) {
                                if(that.list[i].goods_list[y].choose_attr && that.list[i].goods_list[y].choose_attr.attr_list.length > 0) {
                                    for(let x in that.list[i].goods_list[y].choose_attr.attr_list) {
                                        attr.push({
                                            attr_id: that.list[i].goods_list[y].choose_attr.attr_list[x].attr_id,
                                            attr_group_id: that.list[i].goods_list[y].choose_attr.attr_list[x].attr_group_id,
                                        })
                                    }
                                    arr.goods_list.push({
                                        id: that.list[i].goods_list[y].goods_id,
                                        num: 1,
                                        goods_attr_id: that.list[i].goods_list[y].choose_attr.goods_attr_id,
                                        attr: attr
                                    })
                                }
                            }
                            list[0].composition_list.push(arr);
                        }else {
                            let arr = {
                                composition_id: that.list[i].id,
                                goods_list: []
                            }
                            if(that.list[i].host_list.length > 0 && that.list[i].host_list[0].choose_goods) {
                                for(let x in that.list[i].host_list[0].choose_attr.attr_list) {
                                    attr.push({
                                        attr_id: that.list[i].host_list[0].choose_attr.attr_list[x].attr_id,
                                        attr_group_id: that.list[i].host_list[0].choose_attr.attr_list[x].attr_group_id,
                                    })
                                }
                                arr.goods_list.push({
                                    id: that.list[i].host_list[0].goods_id,
                                    num: 1,
                                    goods_attr_id: that.list[i].host_list[0].choose_attr.goods_attr_id,
                                    attr: attr
                                })
                            }
                            let noChoose = true;
                            for(let y in that.list[i].goods_list) {
                                if(that.list[i].goods_list[y].choose_goods && that.list[i].goods_list[y].choose_attr.attr_list) {
                                    noChoose = false;
                                    for(let x in that.list[i].goods_list[y].choose_attr.attr_list) {
                                        attr.push({
                                            attr_id: that.list[i].goods_list[y].choose_attr.attr_list[x].attr_id,
                                            attr_group_id: that.list[i].goods_list[y].choose_attr.attr_list[x].attr_group_id,
                                        })
                                    }
                                    arr.goods_list.push({
                                        id: that.list[i].goods_list[y].goods_id,
                                        num: 1,
                                        goods_attr_id: that.list[i].goods_list[y].choose_attr.goods_attr_id,
                                        attr: attr
                                    })
                                }
                            }
                            if(arr.goods_list.length > 0) {
                                list[0].composition_list.push(arr);
                            }
                        }
                    }
                    if(list[0].composition_list.length == 0) {
                        uni.showToast({
                            title: '请选择套餐',
                            icon: 'none',
                            duration: 1000
                        });
                    }else {
                        for(let i in list[0].composition_list) {
                            if(list[0].composition_list[i].goods_list.length == 1) {
                                list[0].composition_list.splice(i,1)
                            }
                        }
                        if(list[0].composition_list.length == 0) {
                            uni.showToast({
                                title: '请选择搭配商品',
                                icon: 'none',
                                duration: 1000
                            });
                        }else {
                            list[0].goods_list = [];
                            for (let j in list[0].composition_list) {
                                for (let y in list[0].composition_list[j].goods_list) {
                                    list[0].composition_list[j].goods_list[y].cart_id = 0;
                                    list[0].goods_list.push(list[0].composition_list[j].goods_list[y])
                                }
                            }
                            let jump_url = `/pages/order-submit/order-submit?mch_list=${JSON.stringify(list)}`;
                            jump_url += `&preview_url=${encodeURIComponent(this.$api.composition.order_preview)}&submit_url=${encodeURIComponent(this.$api.composition.order_submit)}&plugin=composition`;
                            this.$jump({
                                open_type: 'navigate',
                                url: jump_url,
                            });
                        }
                    }
                }
            },
            close () {
                this.showNoAttr = false;
            },
            updateList(e) {
                this.list = e;
            },
            update(e) {
                this.noAttrList = e;
            },
            getTotal(e) {
                this.total = e.total;
                if(e.max_discount) {
                    this.max_discount = e.max_discount.toFixed(2)
                }
            },
            getDetail() {
                let that = this;
                that.loading = false;
                uni.showLoading({
                    mask: true,
                    title: '加载中...',
                });
                let para = {
                    composition_id: that.composition_id
                }
                if(that.goods_id > 0) {
                    para.goods_id = that.goods_id
                }
                that.$request({
                    url: that.goods_id > 0 ? that.$api.composition.detail : that.$api.composition.composition_detail,
                    data: para
                }).then(response=>{
                    that.loading = true;
                    uni.hideLoading();
                    if(response.code == 0) {
                        if(that.goods_id > 0) {
                            that.list = response.data.other_list;
                            that.other = response.data.list;
                        }else {
                            that.list = [];
                            that.list[0] = response.data.composition;
                        }
                        if(that.other.length < 4) {
                            that.noMore = true;
                        }
                        for(let i in that.list) {
                            that.list[i].choose = false;
                            for(let idx in that.list[i].goods_list) {
                                that.list[i].goods_list[idx].choose_attr = null;
                                if(that.list[i].goods_list[idx].goods_attr.length == 1) {
                                    that.list[i].goods_list[idx].choose_attr = that.list[i].goods_list[idx].goods_attr[0];
                                    that.list[i].goods_list[idx].choose_attr.number = 1;
                                    that.list[i].goods_list[idx].total_price = (+that.list[i].goods_list[idx].choose_attr.price - +that.list[i].goods_list[idx].price).toFixed(2)
                                }
                                if(that.list[i].type == 2) {
                                    that.list[i].host_list[0].choose_attr = null;
                                    if(that.list[i].host_list[0].goods_attr.length == 1) {
                                        that.list[i].host_list[0].choose_attr = that.list[i].host_list[0].goods_attr[0];
                                        that.list[i].host_list[0].choose_attr.number = 1;
                                        that.list[i].host_list[0].total_price = (+that.list[i].host_list[0].choose_attr.price - +that.list[i].host_list[0].price).toFixed(2)
                                    }
                                    that.list[i].goods_list[idx].choose_goods = false;
                                    that.list[i].host_list[0].choose_goods = true;
                                    that.list[i].host_list[0].opacity = 0.3;
                                }
                            }
                        }
                        if(that.list[0].type == 1) {
                            that.list[0].choose = true;
                            that.max_discount = that.list[0].max_discount;
                        }
                    }else {
                        uni.hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.loading = true;
                    uni.hideLoading();
                    that.$hideLoading();
                });
            },
            getMore() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中'
                });
                that.$request({
                    url: that.$api.composition.detail,
                    data: {
                        goods_id: that.goods_id,
                        composition_id: that.composition_id,
                        page: that.page
                    }
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        if(response.data.list.length == 0) {
                            this.noMore = true;
                            return false;
                        }
                        that.page++;
                        that.other = that.other.concat(response.data.list);
                        for(let i in that.list) {
                            that.list[i].choose = false;
                            for(let idx in that.list[i].goods_list) {
                                that.list[i].goods_list[idx].choose_attr = null;
                                if(that.list[i].type == 2) {
                                    that.list[i].host_list[0].choose_attr = null;
                                    that.list[i].host_list[0].opacity = 1;
                                    that.list[i].goods_list[idx].choose_goods = false;
                                    that.list[i].host_list[0].choose_goods = false;
                                }
                            }
                        }
                    }else {
                        uni.hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
        },
        onReachBottom() {
            if(!this.noMore) {
                this.getMore();
            }
        },
        onLoad(option) { this.$commonLoad.onload(option);
            let that = this;
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
            this.goods_id = option.goods_id > 0 ? option.goods_id : '';
            this.composition_id = option.composition_id;
            that.getDetail();
        },
    }
</script>

<style scoped lang="scss">
    .no-tip {
        position: fixed;
        top: #{120rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
        color: #666666;
        font-size: #{24rpx};
        width: #{240rpx};
        text-align: center;
        image {
            height: #{240rpx};
            width: #{240rpx};
            margin-bottom: #{20rpx};
        }
        .to-composition {
            border-radius: #{33rpx};
            width: #{246rpx};
            text-align: center;
            height: #{66rpx};
            line-height: #{66rpx};
            margin-top: #{38rpx};
            color: #fff;
        }
    }
    .list {
        padding: #{24rpx};
        .title {
            font-size: #{28rpx};
            color: #353535;
        }
        .item {
            margin-top: #{20rpx};
            padding: #{24rpx};
            border-radius: #{16rpx};
            background-color: #fff;
        }
    }
    .dialog-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.3);
        z-index: 202;
        .dialog {
            width: #{630rpx};
            margin: #{260rpx} auto 0;
            background-color: #fff;
            padding-top: #{40rpx};
            border-radius: #{16rpx};
            .dialog-title {
                text-align: center;
                font-size: #{26rpx};
                color: #999999;
                .dialog-big-title {
                    font-size: #{32rpx};
                    color: #353535;
                    margin-bottom: #{10rpx};
                }
            }
            .dialog-goods-list {
                padding: 0 #{65rpx};
                margin: #{26rpx} 0 #{48rpx};
                .dialog-goods {
                    width: #{80rpx};
                    height: #{80rpx};
                    border-radius: #{8rpx};
                    margin: #{10rpx};
                    image {
                        border-radius: #{8rpx};
                        width: #{80rpx};
                        height: #{80rpx};
                    }
                }
            }
            .dialog-close {
                width: #{630rpx};
                border-top: #{2rpx} solid #e2e2e2;
                font-size: #{32rpx};
                text-align: center;
                padding: #{25rpx} 0;
            }
        }
    }
    .bottom {
        width: 100%;
        height: #{120rpx};
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 30;
        background-color: #fff;
        border-top: #{2rpx} solid #e2e2e2;
        font-size: #{24rpx};
        color: #353535;
        padding: 0 #{20rpx};
        &.iphone_x {
            height: #{150rpx};
            padding-bottom: #{50rpx};
        }
        .total-price {
            font-size: #{36rpx};
            margin-left: #{8rpx};
        }
        .submit-btn {
            width: #{222rpx};
            height: #{78rpx};
            border-radius: #{39rpx};
            color: #fff;
            font-size: #{32rpx};
            line-height: #{78rpx};
            text-align: center;
        }
        .discount {
            font-size: #{24rpx};
        }
    }
    .bottom-space {
        height: #{110rpx};
        &.iphone_x {
            height: #{160rpx};
        }
    }
</style>