<template>
    <app-layout>
        <view class="search">
            <view @click='beSearch' v-if="!toSearch" class="main-center search-content cross-center">
                <image src="/static/image/icon/icon-search.png"></image>
                <text>搜索</text>
            </view>
            <view v-else class="dir-left-nowrap cross-center search-area">
                <view class="search-input">
                    <image src='/static/image/icon/icon-search.png'></image>
                    <input focus class="box-grow-1 t-small search-content" @confirm='goSearch' confirm-type='search' v-model='keyword' :placeholder="'请输入'+setting.form.members?setting.form.members:'队员'+'昵称搜索'"></input>
                </view>
                <view class="cancel" @click="cancelSeacrch">
                    <view>取消</view>
                </view>
            </view>
        </view>
        <view @click="toggle" class='main-center cross-center sort'>
            <text>{{setting.form && setting.form.offer_text?setting.form.offer_text :'贡献分红金额'}}</text>
            <image v-if="order_by == 'bonus_price desc'" src='./../image/shop-price-less.png'></image>
            <image v-if="order_by == 'bonus_price'" src='./../image/shop-price-plus.png'></image>
        </view>
        <view class="placeholder"></view>
        <view class="list" v-if="list && list.length > 0">
            <view @click="toOrder(item.nickname)" v-for="item in list" :key="item.id">
                <view class="main-between cross-center item">
                    <view class='item-info dir-left-nowrap'>
                        <image class='avatar' :src='item.avatar'></image>
                        <view>
                            <view class="item-nickname">{{item.nickname}}</view>
                            <view>
                                <text class='info-label'>{{setting.form && setting.form.offer_text?setting.form.offer_text :'贡献分红金额'}}</text>
                                <text style='font-family:DIN'>￥{{item.bonus_price}}</text>
                            </view>
                        </view>
                    </view>
                    <view>
                        <text>订单</text>
                        <image class="arrow-right" src='/static/image/icon/arrow-right.png'></image>
                    </view>
                </view>
            </view>
        </view>
        <view class='no-tip' v-if="list && list.length == 0">
            <image src="/static/image/user-default-avatar.png"></image>
            <span>暂无队员</span>
        </view>
    </app-layout>
</template>

<script>
    import appRichText from "../../../components/basic-component/app-rich/parse.vue";

    export default {
        data() {
            return {
                order_by: 'bonus_price desc',
                captain_id: null,
                keyword: '',
                page: 2,
                setting: '',
                more_list: false,
                toSearch: false,
                list: []
            }
        },
        components: {
            "app-rich-text": appRichText
        },
        methods: {
            toOrder(nickname) {
                uni.navigateTo({
                    url: '/plugins/bonus/order/order?nickname=' + nickname
                }); 
            },

            cancelSeacrch() {
                this.keyword = '';
                this.toSearch = !this.toSearch;
                this.page = 2;
                this.getList();
            },

            beSearch() {
                this.toSearch = !this.toSearch;
                this.page = 2;
            },

            goSearch() {
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.getList();
            },

            toggle() {
                if (this.order_by == 'bonus_price desc') {
                    this.order_by = 'bonus_price'
                } else if (this.order_by == 'bonus_price') {
                    this.order_by = 'bonus_price desc'
                }
                this.list = [];
                this.page = 2;
                this.getList();
            },

            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.bonus.setting,
                }).then(response=>{
                    that.getList();
                    if(response.code == 0) {
                        that.setting = response.data.list;
                        if (that.setting.form && that.setting.form.members) {
                            uni.setNavigationBarTitle({
                                title: that.setting.form.members,
                            })
                        } else {
                            uni.setNavigationBarTitle({
                                title: '队员',
                            })
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                });
            },

            getList() {
                let that = this;
                that.$request({
                    url: that.$api.bonus.team,
                    data: {
                        keyword: that.keyword,
                        keyword_1: 1,
                        order_by: that.order_by,
                    },
                    method: 'post'
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

            getMore() {
                let that = this;
                that.$request({
                    url: that.$api.bonus.team,
                    data: {
                        keyword: that.keyword,
                        keyword_1: 1,
                        order_by: that.order_by,
                        page: that.page
                    }
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.list = that.list.concat(response.data.list);
                        that.page++;
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
            },
        },

        onLoad() { this.$commonLoad.onload();
            let that = this;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.getSetting();
        },
        onReachBottom() {
            this.getMore();
        }
    }
</script>

<style scoped lang="scss">
    .no-tip {
        position: fixed;
        top: #{400rpx};
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
    }
    .search {
        height: #{88rpx};
        padding: #{16rpx} #{26rpx};
        background-color: #efeff4;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
    }

    .search input {
        padding: 0 #{30rpx};
    }

    .search-content {
        background-color: #fff;
        height: #{56rpx};
        border-radius: #{28rpx};
    }

    .search-content image {
        height:#{24rpx};
        width:#{24rpx};
    }

    .search-content text {
        color:#b2b2b2;
        font-size:#{24rpx};
        margin:0 #{5rpx};
    }

    .search-area {
        height: #{56rpx};
    }

    .placeholder {
        height: #{192rpx};
    }


    .sort {
        height: #{80rpx};
        background-color: #fff;
        position: fixed;
        top: #{88rpx};
        left: 0;
        right: 0;
        z-index: 10;
        font-size: #{28rpx};
        color: #666;
    }

    .sort image {
        height: #{26rpx};
        width: #{16rpx};
        margin-left: #{16rpx};
    }

    .item {
        width: #{702rpx};
        margin: #{24rpx};
        margin-top: 0;
        background-color: #fff;
        border-radius: #{16rpx};
        padding: #{24rpx};
        font-size: #{24rpx};
        color: #999;
    }

    .item .avatar {
        height: #{80rpx};
        width: #{80rpx};
        margin-right: #{24rpx};
        border-radius: #{5rpx};
    }

    .item-info {
        font-size: #{28rpx};
        color: #353535;
    }

    .item-info .item-nickname {
        margin-bottom: #{4rpx};
    }

    .info-label {
        height: #{36rpx};
        padding: 0 #{10rpx};
        text-align: center;
        line-height: #{36rpx};
        font-size: #{24rpx};
        color: #999;
        background-color: #efeff4;
        display: inline-block;
    }

    .search-input {
        height: #{56rpx};
        position: relative;
        width: #{620rpx};
    }

    .search-input image {
        height: #{22rpx};
        width: #{22rpx};
        position: absolute;
        top: #{17rpx};
        left: #{28rpx};
        z-index: 10;
    }

    .search-input input {
        padding-left: #{66rpx};
        background-color: #fff;
        border-radius: #{32rpx};
        height: #{56rpx};
        font-size: #{26rpx};
        color: #353535;
    }

    .cancel view {
        margin-left: #{16rpx};
        font-size: #{28rpx};
        color: #00c203;
    }

    .arrow-right {
        height:#{20rpx};
        width:#{12rpx};
        margin-left:#{12rpx};
    }
</style>