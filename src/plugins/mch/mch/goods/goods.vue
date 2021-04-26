<template>
    <app-layout>
        <view v-if="id" class="screen" @click='id=null'></view>
        <view class="search main-between">
            <view @click='beSearch' v-if="!toSearch" class="main-center search-content cross-center">
                <image class="search-icon" src="/static/image/icon/icon-search.png"></image>
                <text class="search-text">搜索</text>
            </view>
            <view v-else class="dir-left-nowrap">
                <input focus @blur='beSearch' class="box-grow-1 t-small search-content" @confirm='reload' confirm-type='search' v-model='keyword'></input>
            </view>
            <view @click="toAdd">
                <view class='add-goods dir-left-nowrap'>
                    <image src='./../../image/add.png'></image>
                    <view>添加商品</view>
                </view>
            </view>
        </view>
        <app-tab-nav setTop="88" :tabList="tabList" padding="0" :activeItem="activeTab" @click="tabStatus" :theme="theme"></app-tab-nav>
        <view class="top-place"></view>
        <view>
            <view class="msg-item" @click='id=null' v-for="item in list" :key="item.id">
                <image class="msg-img" :src='item.cover_pic'></image>
                <view class="out-dialog" v-if="item.goods_stock == 0 && appSetting.is_show_stock == '1'">
                    <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                </view>
                <view class="t-omit-two goods-name">{{item.name}}</view>
                <view class='goods-price'>¥{{item.price}}</view>
                <view class='goods-num'>库存:{{item.goods_stock}}</view>
                <image class='more-handle' @click.stop='showMenu(item.id)' src='./../../image/more-handle.png'></image>
                <view v-if="item.id == id" class='main-between more'>
                    <view @click.stop="toEdit(item.id)">
                        <view class='more-item'>
                            <image src='./../../image/goods-edit.png'></image>
                            <view>编辑</view>
                        </view>
                    </view>
                    <view v-if="item.status == 1" @click.stop="toSwitch(0,item.id)">
                        <view class='more-item'>
                            <image src='./../../image/goods-xiajia.png'></image>
                            <view>下架</view>
                        </view>
                    </view>
                    <view v-if="item.status == 0 && is_goods_audit == 0" @click.stop="toSwitch(1,item.id)">
                        <view class='more-item'>
                            <image src='./../../image/goods-xiajia.png' style="transform: rotate(180deg)"></image>
                            <view>上架</view>
                        </view>
                    </view>
                    <view v-if="(item.mch_goods.status == 0 || item.mch_goods.status == 3) && item.status == 0 && is_goods_audit == 1" @click.stop="toSwitch(2,item.id)">
                        <view class='more-item'>
                            <image src='./../../image/goods-xiajia.png' style="transform: rotate(180deg)"></image>
                            <view>申请上架</view>
                        </view>
                    </view>
                    <view @click.stop="toDelete(item.id)">
                        <view class='more-item'>
                            <image src='./../../image/goods-del.png'></image>
                            <view>删除</view>
                        </view>
                    </view>
                </view>
                <view v-if="item.id == id" class='and-more'></view>
            </view>
        </view>
        <view class='no-tip' v-if="list.length == 0">
            <image :src='adminImg.no_goods'></image>
            <view>没有任何商品哦~</view>
        </view>
        <view class="dialog" v-if="is_switch || is_delete || apply_up">
            <view class="dialog-item" v-if="is_switch || is_delete || apply_up">
                <view class="dialog-title">提示</view>
                <view class="dialog-txt" v-if="is_switch && status== 0">是否下架该商品</view>
                <view class="dialog-txt" v-if="is_switch && status== 1">是否上架该商品</view>
                <view class="dialog-txt" v-if="apply_up">是否申请上架该商品</view>
                <view class="dialog-txt" v-if="is_delete">是否删除该商品</view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancel'>取消</view>
                    <view class="line"></view>
                    <view v-if="is_switch" class="submit-btn be-submit" @click='goods_switch'>确认</view>
                    <view v-if="is_delete" class="submit-btn be-submit" @click='goods_destroy'>确认</view>
                    <view v-if="apply_up" class="submit-btn be-submit" @click='applyStatus'>确认</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import appTabNav from "../../../../components/basic-component/app-tab-nav/app-tab-nav.vue";

    import { mapState } from "vuex";

    export default {
        data() {
            return {
                theme: {
                    color: '#ff4544'
                },
                tabList: [
                    {id:1, name: '出售中'},
                    {id:2, name: '售罄'},
                    {id:3, name: '仓库中'},
                    {id:4, name: '最新'}
                ],
                activeTab: '1',
                keyword: '',
                page: 1,
                id: null,
                more_list: false,
                iphone_x: false,
                status: null,
                page_loading: true,
                sort_type: 0,
                sort: 1,
                is_goods_audit: 1,
                go_status: 1,
                is_sold_out: 0,
                list: [],
                is_switch: false,
                is_delete: false,
                apply_up: false,
                toSearch: false,
                device: null,
                mch_id: 0
            }
        },
        components: {
            "app-tab-nav": appTabNav
        },
        computed: {
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img.mall,
                appSetting: state => state.mallConfig.mall.setting,
                adminImg: state => state.mallConfig.__wxapp_img.mch,
            })
        },
        methods: {
            toEdit(id) {
                uni.navigateTo({
                    url: '/plugins/mch/mch/add-goods/add-goods?id=' + id + '&mch_id=' + this.mch_id
                })
                setTimeout(()=>{
                    this.id = null
                })
            },
            toAdd() {
                uni.navigateTo({
                    url: '/plugins/mch/mch/add-goods/add-goods?mch_id=' + this.mch_id
                })
            },
            beSearch() {
                if (this.keyword.length == 0) {
                    this.toSearch = !this.toSearch
                }else {
                    this.toSearch = this.toSearch;
                }
            },
            reload() {
                this.id = null;
                this.getList();
            },
            cancel() {
                this.id = null;
                this.is_delete = false;
                this.is_switch = false;
                this.apply_up = false;
            },
            toDelete(e) {
                this.is_delete = true;
            },
            showMenu(id) {
                this.id = id;
            },
            toSwitch(status,id) {
                let that = this;
                that.id = id;
                if(status == 2) {
                    that.apply_up = true;
                }else {
                    that.status = status;
                    that.is_switch = true;
                }
            },
            tabStatus(e) {
                this.activeTab = e.currentTarget.dataset.id;
                this.getList();
            },
            applyStatus() {
                let that = this;
                that.apply_up = false;
                uni.showLoading({
                    title: '申请中...'
                });
                that.$request({
                    url: that.$api.mch.apply_status,
                    method: 'post',
                    data: {
                        mch_id: that.mch_id,
                        id: that.id,
                    }
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        uni.showToast({
                            title: response.msg,
                            duration: 1000
                        });
                        setTimeout(function(){
                            that.reload();
                        },1000)
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                });
            },
            getList() {
                let that = this;
                uni.showLoading({
                    title: '加载中...'
                });
                that.list = [];
                that.page = 1;
                if(that.activeTab == '1') {
                    that.go_status = 1;
                    that.is_sold_out = 0;
                }else if(that.activeTab == '2') {
                    that.go_status = 1;
                    that.is_sold_out = 1;
                }else if(that.activeTab == '3') {
                    that.go_status = 0;
                    that.is_sold_out = 0;
                }else if(that.activeTab == '4') {
                    that.go_status = 1;
                    that.is_sold_out = 0;
                }
                that.$request({
                    url: that.$api.mch.goods,
                    data: {
                        page: that.page,
                        mch_id: that.mch_id,
                        sort: that.sort,
                        sort_type: that.sort_type,
                        keyword: that.keyword,
                        status: that.go_status,
                        is_sold_out: that.is_sold_out,
                    }
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.list = response.data.list;
                        that.page++;
                        that.more_list = false;
                        if (response.data.list.length == 10) {
                            that.more_list = true;
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                });
            },
            getMore() {
                let that = this;
                uni.showLoading({
                    title: '加载中...'
                });
                if(that.activeTab == '1') {
                    that.go_status = 1;
                    that.is_sold_out = 0;
                }else if(that.activeTab == '2') {
                    that.go_status = 1;
                    that.is_sold_out = 1;
                }else if(that.activeTab == '3') {
                    that.go_status = 0;
                    that.is_sold_out = 0;
                }else if(that.activeTab == '4') {
                    that.go_status = 1;
                    that.is_sold_out = 0;
                }
                that.$request({
                    url: that.$api.mch.goods,
                    data: {
                        page: that.page,
                        mch_id: that.mch_id,
                        sort: that.sort,
                        sort_type: that.sort_type,
                        keyword: that.keyword,
                        status: that.go_status,
                        is_sold_out: that.is_sold_out,
                    }
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.list = that.list.concat(response.data.list);
                        that.page++;
                        that.more_list = false;
                        if (response.data.list.length == 10) {
                            that.more_list = true;
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                });
            },
            goods_destroy() {
                let that = this;
                that.is_delete = false;
                uni.showLoading({
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.mch.destroy,
                    data: {
                        mch_id: that.mch_id,
                        id: that.id
                    },
                    method: 'post'
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        uni.showToast({
                            title: response.msg,
                            duration: 1000
                        });
                        setTimeout(function(){
                            that.reload();
                        },1000)
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    un
                    
                });
            },

            goods_switch() {
                let that = this;
                that.is_switch = false;
                uni.showLoading({
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.mch.switch_status,
                    data: {
                        mch_id: that.mch_id,
                        id: that.id
                    },
                    method: 'post'
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        uni.showToast({
                            title: response.msg,
                            duration: 1000
                        });
                        setTimeout(function(){
                            that.reload();
                        },1000)
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                });
            },

            getSetting() {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.mch.setting
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.is_goods_audit = response.data.setting.is_goods_audit;
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

        onReachBottom: function() {
            if (this.more_list) {
                this.getMore();
            }
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.mch_id = options.mch_id;
            that.go_status = 1;
            that.is_sold_out = 0;
            that.getSetting();
        },

        onShow(options) {
            let that = this;
            var getInfo = setInterval(function(){
                if(that.mch_id > 0) {
                    clearInterval(getInfo);
                    that.getList();
                }
            },500)
        }
    }
</script>

<style scoped lang="scss">
    .search {
        z-index: 30;
        height: #{88rpx};
        padding: #{16rpx} #{35rpx};
        background-color: #EFEFF4;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
    }

    .search input {
        padding: 0 #{30rpx};
    }

    .search-content {
        background-color: #fff;
        height: #{56rpx};
        border-radius: #{28rpx};
        width: #{502rpx};
    }

    input.search-content {
        width: #{482rpx};
        font-size: #{26rpx};
    }

    .msg-item {
        margin: #{24rpx};
        margin-bottom: 0;
        background-color: #fff;
        border-radius: #{16rpx};
        position: relative;
        padding: #{24rpx};
        .out-dialog {
            width: #{148rpx};
            height: #{148rpx};
            position: absolute;
            top: #{24rpx};
            left: #{24rpx};
            z-index: 5;
            background-color: rgba(0,0,0,.5);
            image {
                width: #{148rpx};
                height: #{148rpx};
            }
        }
    }

    .msg-img {
        height: #{148rpx};
        width: #{148rpx};
        display: block;
    }

    .goods-name {
        font-size: #{26rpx};
        color: #353535;
        position: absolute;
        top: #{22rpx};
        left: #{192rpx};
        width: #{486rpx};
    }

    .goods-price {
        font-size: #{32rpx};
        color: #ff4544;
        position: absolute;
        bottom: #{55rpx};
        left: #{192rpx};
    }

    .goods-num {
        font-size: #{24rpx};
        color: #999999;
        position: absolute;
        bottom: #{20rpx};
        left: #{192rpx};
    }

    .add-goods {
        width: #{180rpx};
        height: #{56rpx};
        line-height: #{54rpx};
        border-radius: #{28rpx};
        border: #{1rpx} solid #ff4544;
        padding-left: #{18rpx};
        font-size: #{26rpx};
        color: #ff4544;
        margin-left: #{20rpx};
        background-color: #fff;
    }

    .add-goods image{
        height: #{28rpx};
        width: #{28rpx};
        margin-right: #{8rpx};
        margin-top: #{14rpx};
        display: block;
    }

    .more-handle {
        height: #{56rpx};
        width: #{56rpx};
        position: absolute;
        bottom: #{16rpx};
        right: #{24rpx};
    }

    .more {
        height: #{100rpx};
        border-radius: #{8rpx};
        background-color: rgba(0, 0, 0, .75);
        padding: #{18rpx} 0 #{8rpx};
        font-size: #{20rpx};
        color: #fff;
        z-index: 6;
        position: absolute;
        bottom: #{62rpx};
        right: #{24rpx};
    }

    .more-item {
        width: #{90rpx};
        text-align: center;
    }

    .more .more-item image {
        height: #{40rpx};
        width: #{40rpx};
    }

    .and-more {
        width: 0;
        height: 0;
        border-left: #{10rpx} solid transparent;
        border-right: #{10rpx} solid transparent;
        border-top: #{10rpx} solid rgba(0, 0, 0, .75);
        position: absolute;
        bottom: #{54rpx};
        right: #{44rpx};
        z-index: 6;
    }

    .screen {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0)
    }

    .btn-area {
        height: #{88rpx};
        position: relative;
        border-top: #{1rpx} solid #e2e2e2;
    }

    .btn-area .line {
        height: #{32rpx};
        width: #{1rpx};
        background-color: #e2e2e2;
        position: absolute;
        top: #{28rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
    }

    .submit-btn {
        height: #{88rpx};
        line-height: #{88rpx};
        font-size: #{32rpx};
        color: #666;
        width: #{310rpx};
        text-align: center;
    }

    .submit-btn.be-submit {
        color: #ff4544;
    }

    .dialog {
        position: fixed;
        height: 100%;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 50;
        background-color: rgba(0, 0, 0, .3);
    }

    .dialog-item {
        padding-top: #{35rpx};
        position: fixed;
        top: 30%;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: #{620rpx};
        border-radius: #{16rpx};
        background-color: #fff;
    }

    .dialog-title {
        font-size: #{32rpx};
        color: #353535;
        margin-bottom: #{6rpx};
        text-align: center;
    }

    .dialog-txt {
        margin: #{40rpx} auto;
        text-align: center;
        font-size: #{32rpx};
        color: #353535;
    }

    .no-tip {
        position: fixed;
        top: #{350rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
        color: #666666;
        font-size: #{24rpx};
        width: #{240rpx};
        text-align: center;
    }

    .no-tip image {
        height: #{240rpx};
        width: #{240rpx};
        margin-bottom: #{20rpx};
    }

    .bottom-place {
        height: #{116rpx};
    }

    .bottom-place.iphone_x {
        height: #{166rpx};
    }

    .search-icon {
        height: #{24rpx};
        width: #{24rpx};
    }

    .search-text {
        color: #b2b2b2;
        font-size: #{24rpx};
        margin: 0 #{5rpx};
    }

    .top-place {
        height: #{88rpx};
    }
</style>