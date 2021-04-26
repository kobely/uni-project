<template>
    <app-layout>
        <view class="title main-center cross-center">
            <image :src="svipImg.left" ></image>
            <view class="title-text">会员卡权益</view>
            <image :src="svipImg.right" ></image>
        </view>
        <view v-if="is_free_delivery == 1" class="is-free cross-center">
            <image src="./../image/free.png"></image>
            <view>自营商品包邮</view>
        </view>
        <view class="is-free cross-center">
            <image src="./../image/object.png"></image>
            <view>折扣对象</view>
        </view>
        <view class="obj">
            <view class="all" v-if="card.image_type_info_detail.all">
                <view class="all-item main-center">
                    <view>全部自营商品</view>
                </view>
            </view>
            <view v-if="card.image_type_info_detail.cats.length > 0">
                <view class="obj-title cross-center main-center">
                    <view class="line"></view>
                    <view>指定分类</view>
                    <view class="line"></view>
                </view>
                <view class="cat-list dir-left-wrap">
                    <view class="cat-item t-omit" :key="item.value" @click="toCat(item.value)" v-for="item in card.image_type_info_detail.cats">{{item.label}}</view>
                </view>
            </view>
            <view v-if="card.image_type_info_detail.goods.length > 0">
                <view class="obj-title cross-center main-center">
                    <view class="line"></view>
                    <view>{{card.image_type_info_detail.all ? '为您推荐(特殊商品除外)' : '指定商品'}}</view>
                    <view class="line"></view>
                </view>
                <view class="goods-holder"></view>
            </view>
        </view>
        <u-ordinary-list :showBuyBtn="0" :list="card.image_type_info_detail.goods" :theme="getTheme" :list-style="3"></u-ordinary-list>
    </app-layout>
</template>

<script>
    import uOrdinaryList from '../../../components/page-component/u-goods-list/u-ordinary-list.vue';

    import { mapGetters, mapState } from "vuex";

    export default {
        data() {
            return {
        		card: {
                    image_type_info_detail: {
                        goods: [],
                        cats: [],
                        all: false
                    }
                },
                is_free_delivery: 0,
                page: 1,
                more: false,
                id: 0
            }
        },
        components: {
            uOrdinaryList
        },
        computed: {
            ...mapState({
                svipImg: state => state.mallConfig.__wxapp_img.vip_card
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            })
        },
        methods: {
            toCat(id) {
                uni.navigateTo({
                    url: '/pages/goods/list?cat_id=' + id
                });
            },

            getCard(id) {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.vip_card.index_right
                }).then(response=>{
                    if(response.code === 0) {
                        that.id = id;
                        that.card = response.data.right;
                        that.is_free_delivery = response.data.right.is_free_delivery;
                        if(that.card.image_type_info_detail.all) {
                            that.getRecommend();
                        }else {
                            that.$hideLoading();
                        }
                    }else {
                        that.$hideLoading();
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            getList() {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.vip_card.index,
                }).then(response=>{
                    if(response.code === 0) {
                        that.card.image_type_info_detail.cats = response.data.user.image_type_info_detail.cats;
                        that.card.image_type_info_detail.goods = response.data.user.image_type_info_detail.goods;
                        that.card.image_type_info_detail.all = response.data.user.image_type_info_detail.all;
                        that.is_free_delivery = response.data.user.image_is_free_delivery;
                        if(that.card.image_type_info_detail.all) {
                            that.getRecommend();
                        }else {
                            that.getGoods();
                        }
                    }else {
                        that.$hideLoading();
                        if(response.msg === '超级会员卡已关闭' || response.msg === '无超级会员卡权限') {
                            uni.redirectTo({
                                url: '/pages/index/index'
                            })
                        }
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            getRecommend() {
                let that = this;
                that.$request({
                    url: that.$api.vip_card.recommend,
                }).then(response => {
                    that.$hideLoading();
                    if(response.code === 0) {
                        that.card.image_type_info_detail.goods = response.data.list;
                    }else {
                        if(response.msg === '超级会员卡已关闭' || response.msg === '无超级会员卡权限') {
                            uni.redirectTo({
                                url: '/pages/index/index'
                            })
                        }
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            getGoods() {
                let that = this;
                that.more = false;
                that.$request({
                    url: that.$api.vip_card.right,
                    data: {
                        page: that.page
                    }
                }).then(response=>{
                    that.$hideLoading();
                    that.first =  false;
                    if(response.code === 0) {
                        that.card.image_type_info_detail.goods = response.data.list;
                        that.page++;
                        if(response.data.list.length == response.data.pagination.pageSize) {
                            that.more = true;
                        }
                    }else {
                        if(response.msg === '超级会员卡已关闭' || response.msg === '无超级会员卡权限') {
                            uni.redirectTo({
                                url: '/pages/index/index'
                            })
                        }
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            }
        },
        onReachBottom() {
            if(this.id == 0 && this.more) {
                this.getGoods();
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            if(options.id > 0) {
                this.getCard(options.id);
            }else {
                this.getList();
            }
        }
    }
</script>

<style scoped lang="scss">
    .title {
        height: #{118rpx};
        width: 100%;
        background-color: #fff;
        .title-text {
            margin: 0 #{20rpx};
            font-size: #{32rpx};
            color: #342e25;
        }
        image {
            width: #{60rpx};
            height: #{19rpx};
        }
    }
    .is-free {
        height: #{118rpx};
        padding: 0 #{40rpx};
        font-size: #{32rpx};
        margin-top: #{20rpx};
        color: #342e25;
        background-color: #fff;
        image {
            height: #{40rpx};
            width: #{40rpx};
            margin-right: #{22rpx};
        }
    }
    .obj {
        background-color: #fff;
        .all {
            padding-bottom: #{15rpx};
            .all-item {
                height: #{90rpx};
            }
        }
        .obj-title {
            color: #a6a6a6;
            font-size: #{23rpx};
            .line {
                width: #{40rpx};
                height: #{2rpx};
                background-color: #bbbbbb;
                margin: 0 #{17rpx};
            }
        }
        .goods-holder {
            height: #{32rpx};
        }
        .cat-list {
            padding: 0 #{12rpx} #{54rpx};
            .cat-item {
                width: #{218rpx};
                margin: #{56rpx} #{12rpx} #{6rpx};
                text-align: center;
                font-size: #{28rpx};
                color: #353535;
            }
        }
    }
</style>
