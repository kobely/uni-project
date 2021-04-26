<template>
    <app-layout>
        <view class="search dir-left-nowrap cross-centers">
            <view class="search-view">
                <input id="search" @confirm='toSearch' placeholder="请输入商品名称搜索" v-model="keyword" type="text" focus @focus="getFocus=true">
                <image v-if="getFocus && keyword.length > 0" @click="clearSearch" class="search-clear" src="/static/image/icon/delete-yuan.png"></image>
            </view>
            <view @click="toSearch" class="search-btn">搜索</view>
        </view>

        <view class="main-center no-result" v-if="list.length == 0 && searchResult">
            <view class="dir-left-nowrap cross-center">
                <image class="box-grow-0 empty" src="/static/image/icon/empty.png"></image>
                <view class="box-grow-1">
                    <view>抱歉，没有相关商品</view>
                </view>
            </view>
        </view>
        <view class="list">
            <view class="item" v-for="item in list" :key="item.id">
                <app-composition :theme="getTheme" @click="show(item)" @look="toDetail(item)" :item="item" :large="true">
                    <template>
                        <view class="look-goods main-center cross-center">
                            <view>套餐商品</view>
                            <image src="/static/image/icon/icon-down.png"></image>
                        </view>
                    </template>
                </app-composition>
            </view>
        </view>
        <view @click="close" class="dialog-bg" v-if="showGoods">
            <view @click.stop="" class="dialog" :style="{'bottom':height +'px'}" :animation="animationData">
                <view class="dialog-title main-between cross-center">
                    <view @click="toDetail(detail)" class="toBuy dir-left-nowrap cross-center">
                        <image  :style="{'background-color': getTheme.background}" src="/static/image/icon/goods-cart.png"></image>
                        <view :style="{'color': getTheme.color}">去购买套餐</view>
                    </view>
                    <view class="close">
                        <image @click="close" src="/static/image/icon/close.png"></image>
                    </view>
                </view>
                <view class="dialog-goods-list">
                    <view @click.stop="toGoods(item.goods_id)" class="dialog-goods dir-left-nowrap" v-for="item in detail.host_list" :key="item.id">
                        <image :src="item.cover_pic"></image>
                        <view>
                            <view class="t-omit-two goods-name">{{item.name}}</view>
                            <view class="goods-price"  :style="{'color': getTheme.color}">￥{{item.min_price}}{{item.max_price != item.min_price ? '~￥'+item.max_price : ''}}</view>
                        </view>
                    </view>
                    <view @click.stop="toGoods(item.goods_id)" class="dialog-goods dir-left-nowrap" v-for="item in detail.goods_list" :key="item.id">
                        <image :src="item.cover_pic"></image>
                        <view>
                            <view class="t-omit-two goods-name">{{item.name}}</view>
                            <view class="goods-price" :style="{'color': getTheme.color}">￥{{item.min_price}}{{item.max_price != item.min_price ? '~￥'+item.max_price : ''}}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from "vuex";
    import appComposition from'../../../components/basic-component/app-composition/app-composition.vue';
    export default {
        data() {
            return {
                list: [],
                keyword: '',
                choose_list: [],
                detail: {},
                animationData: {},
                height: 0,
                searchResult: false,
                searchMode: true,
                getFocus: true,
                showGoods: false,
            }
        },
        components: {
            'app-composition': appComposition,
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            })
        },
        methods: {
            show(e) {
                this.detail = e;
                this.showGoods = true;
                var animation = uni.createAnimation({
                    duration: 1000,
                    timingFunction: 'ease',
                })
                this.animation = animation
                animation.translateY(this.height).step()
                this.animationData = animation.export();
            },
            close() {
                this.detail = {};
                this.showGoods = false;
            },
            toDetail(item) {
                this.close();
                uni.navigateTo({
                    url: '/plugins/composition/detail/detail?composition_id=' + item.id
                });
            },
            toGoods(id) {
                uni.navigateTo({
                    url: '/pages/goods/goods?id=' + id
                });
            },
            // updateList(e) {
            //     this.list = e;
            // },
            // choose(row,type) {
            //     let that = this;
            //     if(type == 1) {
            //         for(let i in that.choose_list) {
            //             if(that.choose_list[i].type == 2) {
            //                 if(that.choose_list[i].host_list[0].id == row.id) {
            //                     that.choose_list[i].host_list[0] = row;
            //                 }else {
            //                     for(let x in that.choose_list[i].goods_list) {
            //                         if(that.choose_list[i].goods_list[x].id == row.id) {
            //                             that.choose_list[i].goods_list[x] = row;
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //         uni.setStorage({
            //             key: "composition",
            //             data: that.choose_list
            //         })
            //         uni.navigateBack();
            //     }else {
            //         let index = -1;
            //         for(let i in that.choose_list) {
            //             if(that.choose_list[i].id == row.id) {
            //                 index = i;
            //             }
            //         }
            //         if(index > -1) {
            //             that.choose_list[index] = row;
            //         }
            //         uni.setStorage({
            //             key: "composition",
            //             data: that.choose_list
            //         })
            //         uni.navigateBack();
            //     }
            // },
            clearSearch() {
                this.keyword = '';
                this.list = [];
                this.searchResult = false;
            },
            toSearch() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '搜索中...',
                });
                that.$request({
                    url: that.$api.composition.index,
                    data: {
                        keyword: that.keyword
                    }
                }).then(response=>{
                    uni.hideLoading();
                    that.searchResult = true;
                    if(response.code == 0) {
                        that.list = response.data.list;
                        // for(let i in that.list) {
                        //     that.list[i].choose = false;
                        //     for(let idx in that.list[i].goods_list) {
                        //         that.list[i].goods_list[idx].choose_attr = null;
                        //         if(that.list[i].type == 2) {
                        //             that.list[i].host_list[0].choose_attr = null;
                        //             that.list[i].host_list[0].opacity = 1;
                        //             that.list[i].goods_list[idx].choose_goods = false;
                        //             that.list[i].host_list[0].choose_goods = false;
                        //         }
                        //     }
                        // }
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
        onLoad() { this.$commonLoad.onload();
            let that = this;
            uni.getSystemInfo({
                success: function (res) {
                    that.height = -res.screenHeight;
                }
            })
        },
    }
</script>

<style scoped lang="scss">
    .list {
        margin-top: #{108rpx};
        .item {
            margin: 0 #{24rpx} #{20rpx};
            background-color: #fff;
            border-radius: #{16rpx};
            padding: #{24rpx};
            padding-bottom: #{16rpx};
            .look-goods {
                margin-top: #{8rpx};
                border-radius: #{8rpx};
                height: #{48rpx};
                width: #{288rpx};
                font-size: #{24rpx};
                color: #666666;
                background-color: #f7f7f7;
                image {
                    width: #{18rpx};
                    height: #{10rpx};
                    margin-left: #{16rpx};
                }
            }
        }
    }
    .no-result {
        height: #{156rpx};
        padding: #{28rpx} 0;
        margin-top: #{88rpx};
        font-size: $uni-font-size-general-one;
        background-color: #ffffff;

        .text {
            color: $uni-general-color-two;
        }

        .empty {
            width: #{100rpx};
            height: #{100rpx};
            display: block;
            margin-right: #{40rpx};
        }
    }
    .search {
        width: #{750rpx};
        height: #{88rpx};
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        background-color: #efeff4;
        padding: #{15rpx} 0;
        padding-left: #{24rpx};
        box-sizing: border-box;
        .search-view {
            flex-shrink: 0;
            position: relative;
            width: #{626rpx};
            height: #{88-30rpx};
            background-color: white;
            border-radius: #{29rpx};
            .search-clear {
              position: absolute;
              right: #{15rpx};
              top: #{14rpx};
              width: #{30rpx};
              height: #{30rpx};
              z-index: 100;
            }
            input {
                box-sizing: border-box;
                padding: #{0 70rpx 0 30rpx};
                font-size: #{26rpx};
                height: #{58rpx};
                line-height: #{58rpx};
            }
            .image {
                width: #{20rpx};
                height: #{20rpx};
                margin-right: #{11rpx};
            }
            .text {
                font-size: #{26rpx};
                color: #999999;
            }
        }
        .search-btn {
            width: #{100rpx};
            height: #{58rpx};
            line-height: #{58rpx};
            text-align: center;
            font-size: #{28rpx};
            color: #666;
        }
    }
    .dialog-bg {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.3);
        z-index: 202;
        .dialog {
            width: 100%;
            position: fixed;
            left: 0;
            z-index: 210;
            background-color: #fff;
            border-top-left-radius: #{16rpx};
            border-top-right-radius: #{16rpx};
            .dialog-title {
                padding: #{36rpx} #{24rpx} #{24rpx};
                font-size: #{32rpx};
                color: #353535;
                .toBuy {
                    font-size: #{28rpx};
                    image {
                        width: #{36rpx};
                        height: #{36rpx};
                        margin-right: #{12rpx};
                        display: block;
                    }
                }
                .close {
                    image {
                        width: #{36rpx};
                        height: #{36rpx};
                    }
                }
            }
            .dialog-goods-list {
                padding: 0 #{24rpx};
                max-height: #{750rpx};
                overflow-y: auto;
                .dialog-goods {
                    font-size: #{32rpx};
                    position: relative;
                    padding: #{28rpx} 0;
                    border-top: #{2rpx} solid #e2e2e2;
                    image {
                        width: #{180rpx};
                        height: #{180rpx};
                        margin-right: #{24rpx};
                        border-radius: #{8rpx};
                    }
                    .goods-name {
                        color: #353535;
                        width: #{498rpx};
                    }
                    .goods-price {
                        position: absolute;
                        bottom: #{50rpx};
                        left: #{204rpx};
                    }
                }
                .dialog-goods:first-of-type {
                    border-top: 0;
                }
            }
        }
    }
</style>