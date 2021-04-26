<template>
    <app-layout>
        <app-tab-nav :tabList="tabList" :activeItem="activeTab" @click="tabStatus" :theme="getTheme"></app-tab-nav>
        <view class='coupon' v-if="activeTab == 1" v-for="item in list" :key="item.id">
            <view class='coupon-name' v-if="item.integralCoupon.coupon.type == 2">{{item.integralCoupon.coupon.sub_price}}元优惠券 满{{item.integralCoupon.coupon.min_price}}元可用</view>
            <view class='coupon-name' v-else>{{item.integralCoupon.coupon.discount}}折优惠券 满{{item.integralCoupon.coupon.min_price}}元可用</view>
            <view class='coupon-price' :style="{'color': getTheme.color}">{{item.integralCoupon.integral_num}}积分
                <text v-if="item.integralCoupon.price > 0">+{{item.integralCoupon.price}}元</text>
            </view>
            <view @click="toList" class="card-list">
                <button class='to-card' :style="{'color': getTheme.color}">去卡券包查看</button>
            </view>
        </view>
        <view class='goods' v-if="activeTab == 2" v-for="item in list" :key="item.id">
            <image class='goods-img' mode="aspectFill" :src='item.detail[0].goods_info.goods_attr.pic_url ? item.detail[0].goods_info.goods_attr.pic_url : item.detail[0].goods.goodsWarehouse.cover_pic'></image>
            <view class='goods-info'>
                <view class='coupon-name t-omit-two'>{{item.detail[0].goods_info.name}}</view>
                <view class='coupon-price' :style="{'color': getTheme.color}">{{item.detail[0].goods_info.goods_attr.extra.integral_num}}积分+{{item.detail[0].goods_info.goods_attr.price}}元</view>
            </view>
            <view @click="toOrder(item.id)" class="order-detail">
                <button class='to-card' :style="{'color': getTheme.color}">订单详情</button>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import appTabNav from "../../../components/basic-component/app-tab-nav/app-tab-nav.vue";

    import {mapGetters, mapState} from "vuex";

    export default {
        name: "about",
        components: {
            "app-tab-nav": appTabNav
        },
        data() {
            return {
                list: [],
                tabList: [
                    {id:1, name: '优惠券'},
                    {id:2, name: '商品'}
                ],
                page: 2,
                activeTab: 1,
            };
        },
        computed: {
            ...mapState({
                mall: state => state.mallConfig.mall
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            })
        },
        onLoad() { this.$commonLoad.onload();
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.getList();
        },
        methods: {
            tabStatus(e) {
                this.list = [];
                this.page = 2;
                this.activeTab = +e.currentTarget.dataset.id;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.getList();
            },
            toOrder(id) {
                uni.navigateTo({
                    url: '/pages/order/order-detail/order-detail?id=' + id
                });
            },
            toList() {
                uni.navigateTo({
                    url: '/pages/coupon/index/index'
                });
            },
            getList() {
                let that = this;
                let url = that.$api.integral_mall.coupon_order;
                if(that.activeTab == 2) {
                    url = that.$api.integral_mall.order
                }
                that.$request({
                    url: url,
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.list = response.data.list;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                    uni.hideLoading();
                });
            },
        },
        onReachBottom() {
                let that = this;
                let url = that.$api.integral_mall.coupon_order;
                if(that.activeTab == 2) {
                    url = that.$api.integral_mall.order
                }
                that.$request({
                    url: url,
                    data: {
                        page: that.page
                    }
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        let more = false;
                        that.list.forEach(function(row,index){
                            if(row.id == response.data.list[0].id) {
                                more = true;
                                return false
                            }
                        })
                        if(!more) {
                            that.list = that.list.concat(response.data.list);
                        }
                        page++;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
        }
    }
</script>

<style scoped lang="scss">
    .coupon {
        height: #{156rpx};
        border-bottom: #{1rpx} solid #e2e2e2;
        position: relative;
        padding: #{30rpx} #{24rpx} 0;
        font-size: 15px;
        background-color: #fff;
    }

    .coupon-name {
        color: #353535;
    }

    .coupon-price {
        margin-top: #{12rpx};
    }

    .to-card {
        height: #{56rpx};
        line-height: #{56rpx};
        padding: 0 #{16rpx};
        background-color: #fff;
        border-radius: #{28rpx};
        border: #{1rpx} solid;
        font-size: #{28rpx};
        width: auto;
    }

    .to-card::after {
        border: 0;
    }

    .goods {
        height: #{200rpx};
        border-bottom: #{1rpx} solid #e2e2e2;
        position: relative;
        padding: #{32rpx} #{24rpx};
        font-size: 15px;
        background-color: #fff;
    }

    .goods-img {
        height: #{136rpx};
        width: #{180rpx};
        float: left;
        margin-right: #{16rpx};
    }

    .goods-info {
        width: 72%;
    }

    .order-detail {
        position: absolute;
        top: #{72rpx};
        right:#{24rpx};
    }

    .card-list {
        position: absolute;
        top: #{50rpx};
        right:#{24rpx};
    }
</style>