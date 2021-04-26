<template>
    <app-layout>
        <scroll-view @scrolltolower="getMore" scroll-y :style="{'height':`${windowHeight}px`}">
            <view v-if="search" class="search-item main-between cross-center">
                <view class="search-input">
                    <image class="search-icon" src='/static/image/icon/icon-search.png'></image>
                    <input @confirm='searchMethod' confirm-type='search' v-model='keyword' placeholder-style='color:#999999;font-size:13px;' :focus="getFocus" @blur="getFocus=false" @focus="getFocus=true" :placeholder="is_user ? '请输入团长手机号':'请输入活动名称或买家手机号'"></input>
                    <image v-if="getFocus && keyword.length > 0" @click="clearSearch" class="search-clear" src="../image/clear.png"></image>
                </view>
                <view @click="cancelSeacrch">取消</view>
            </view>
            <view v-if="!searchResult && search && list.length == 0" class="search-history">
                <view v-if="candidate.length != 0" class='main-between search-title'>
                    <view>历史搜索</view>
                    <view @click="clear">
                        <image class="delete-icon" src="/static/image/icon/delete.png"></image>
                    </view>
                </view>
                <view class='flex-wrap candidate-list'>
                    <view @click="keywordSearch(item)" class="keyword-item box-grow-0" v-for="item in candidate" :key="item">
                        <text class="t-omit">{{item}}</text>
                    </view>
                </view>
            </view>
            <view v-if="!search" class="search-area main-between cross-center">
                <view class="search dir-left-nowrap" :class="{'all-search': is_user}" @click="toSearch">
                    <image class="icon-search" src="/static/image/icon/icon-search.png"></image>
                    <text :class="{'keyword':keyword.length> 0}">{{ keyword.length> 0?keyword:is_user ? '请输入团长手机号':'请输入活动名称或买家手机号'}}</text>
                </view>
                <view v-if="!is_user" class="choose dir-left-nowrap cross-center" @click='toTime' :style="{'color': getTheme.color}">
                    <text v-if="time == 0">汇总</text>
                    <text v-else-if="time == 1">今日</text>
                    <text v-else-if="time == 2">昨日</text>
                    <text v-else-if="time == 3">7日</text>
                    <text v-else>自定义</text>
                    <image :style="{'background-color': getTheme.background}" v-if="chooseTime" src='./../image/order-close.png'></image>
                    <image :style="{'background-color': getTheme.background}" v-else src='./../image/order-open.png'></image>
                </view>
            </view>
            <view v-if="!search" class="main-between navs-info">
                <view @click="tab(0)" class="box-grow-1 main-center cross-center navs">
                    <text :class="_num==0?'active':'nav-text'" :style="{'color': _num==0?getTheme.color:'', 'border-color': _num==0?getTheme.border:''}">全部</text>
                </view>
                <view @click="tab(1)" class="box-grow-1 main-center cross-center navs">
                    <text :class="_num==1?'active':'nav-text'" :style="{'color': _num==1?getTheme.color:'', 'border-color': _num==1?getTheme.border:''}">未付款</text>
                </view>
                <view @click="tab(2)" class="box-grow-1 main-center cross-center navs">
                    <text :class="_num==2?'active':'nav-text'" :style="{'color': _num==2?getTheme.color:'', 'border-color': _num==2?getTheme.border:''}">待发货</text>
                </view>
                <view @click="show=!show" v-if="active" class="box-grow-1 main-center navs more-navs">
                    <text :class="_num==active.value?'active':'nav-text'">{{active.name}}</text>
                    <image :style="{'background-color': getTheme.background}" src="./../image/more-active.png"></image>
                </view>
                <view @click="show=!show" v-if="!active" class="box-grow-1 main-center navs more-navs">
                    <text class="nav-text">更多状态</text>
                    <image src="./../image/more.png"></image>
                </view>
            </view>
            <view v-if="!search && show" class="more-menu">
                <view @click="chooseItem(item.value)" v-for="item in menu" :key="item.value">{{item.name}}</view>
            </view>
            <view v-if="!search" class="search-palce"></view>
            <!-- 订单信息 -->
            <view class='no-tip' v-if="list.length == 0">
                <image src="/static/image/order-empty.png"></image>
                <span>暂无{{activeTab == 0?'未付款': activeTab == 1?'待发货':activeTab == 2?'待提货':''}}订单</span>
            </view>
            <view v-else>
                <app-order v-for="(item,index) in list" :key="item.id" v-on:update="update" v-if="(_num==3 && item.is_confirm == 0) || _num!=3" :is_user="is_user" :theme="getTheme" :item="item"></app-order>
            </view>
            <app-time-screening @click="toChoose" @cancel="cancel" :theme="getTheme" v-if="chooseTime" :time="time" :start-date="date_start" :end-date="date_end"></app-time-screening>
            <app-menu v-if="!is_user" :theme="getTheme" active="order"></app-menu>
        </scroll-view>
    </app-layout>
</template>

<script>
    import { mapState, mapGetters } from "vuex";
    import appTimeScreening from "../../../components/page-component/app-time-screening/app-time-screening.vue";
    import appMenu from '../components/app-menu';
    import appOrder from '../components/app-order';

    export default {
        data() {
            return {
                _num: '0',
                getFocus: false,
                more_list: false,
                page: 1,
                menu: [
                    {
                        name: '待提货',
                        value: '3'
                    },
                    {
                        name: '已提货',
                        value: '4'
                    },
                    {
                        name: '已完成',
                        value: '8'
                    },
                    {
                        name: '已关闭',
                        value: '6'
                    }
                ],
                active: null,
                is_user: false,
                show: false,
                search: false,
                keyword: '',
                list: [],
                candidate: [],
                date_start: '',
                date_end: '',
                activeTab: -1,
                time: 0,
                activity_id: 0,
                windowHeight: 0,
                chooseTime: false,
                detail: {},
                custom: false,
                msg: false,
                searchResult: false,
                loading: false
            }
        },
        components: {
            "app-menu": appMenu,
            'app-order': appOrder,
            "app-time-screening": appTimeScreening
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                userInfo: state => state.user.info,
                adminImg: state => state.mallConfig.__wxapp_img.app_admin,
            })
        },
        methods: {
            cancel() {
                this.chooseTime = false;
            },
            update(e) {
                for(let index in this.list) {
                    if(this.list[index].id == e.id) {
                        this.list[index] = e;
                    }
                }
                this.$forceUpdate();
            },
            clearSearch() {
                this.keyword = '';
            },
            toSearch() {
                this.search = true;
                this.getFocus = true;
                this.list = [];
                this.searchResult = false;
                this.candidate = this.$storage.getStorageSync('keyword') ? this.$storage.getStorageSync('keyword') : [];
            },
            keywordSearch(e) {
                this.keyword = e;
                this.searchResult = true;
                this.search = false;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.page = 1;
                this.getList();
            },
            // 清除搜索记录
            clear() {
                let that = this;
                this.$storage.removeStorageSync('keyword');
                that.candidate = [];
                uni.showToast({
                    title: '清理成功',
                    duration: 1000,
                    type: 'success',
                    mask: false
                });
            },
            // 搜索
            searchMethod() {
                let value = this.$storage.getStorageSync('keyword') ? this.$storage.getStorageSync('keyword') : [];
                if (this.keyword.length == 0) {
                    return
                } else if (value.length > 0) {
                    value.unshift(this.keyword)
                } else {
                    value = [this.keyword]
                }
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.page = 1;
                this.getList();
                value.forEach(function(row, index) {
                    if (value[0] == value[index] && index > 0) {
                        value.splice(index, 1)
                    }
                })
                this.$storage.setStorageSync('keyword', value);
                this.search = false;
                this.searchResult = true;
            },
            // 取消搜索
            cancelSeacrch() {
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.search = false;
                this.keyword = '';
                // this.list = [];
                this.page = 1;
                this.getList();
            },
            change(e) {
                let that = this;
                that.time = e;
                that.custom = false;
                if (that.time == 4) {
                    that.custom = true;
                    that.date_end = that.today;
                    that.date_start = that.today + ' 00:00:00';
                }
            },
            // 确认选择时间
            toChoose(res) {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.date_start = res.date_start;
                that.date_end = res.date_end;
                that.time = res.choose;
                that.page = 1;
                that.getList();
                that.chooseTime = false;
            },
            // 打开时间筛选
            toTime() {
                let that = this;
                that.chooseTime = !that.chooseTime;
                that.show = false;
            },
            // 选择更多状态
            chooseItem(e) {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that._num = e;
                that.menu.forEach(function(row, index) {
                    if (row.value == that._num) {
                        that.active = row;
                    }
                })
                that.show = !that.show;
                that.page = 1;
                that.list = [];
                that.getList();
            },
            // 切换状态
            tab(e) {
                this._num = e;
                this.show = false;
                this.active = null;
                this.list = [];
                this.page = 1;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.getList();
            },
            getList() {
                let that = this;
                if(that.loading) {
                    return false
                }
                that.loading = true;
                that.$request({
                    url: that.is_user ? that.$api.community.order_list : that.$api.community.middle_list,
                    data: {
                        status: that._num,
                        date_end: that.date_end,
                        date_start: that.date_start,
                        page: that.page,
                        keyword: that.keyword
                    }
                }).then(response=>{
                    that.$hideLoading();
                    uni.hideLoading();
                    that.loading = false;
                    if(response.code == 0) {
                        let list = response.data.list;
                        that.more_list = false;
                        if (list.length == response.data.pagination.pageSize) {
                            that.more_list = true;
                        }
                        if(that.page == 1) {
                            that.list = response.data.list;
                            that.$forceUpdate();
                        }else {
                            that.list = that.list.concat(list);
                            that.$forceUpdate();
                        }
                        that.page++;
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.loading = false;
                    that.$hideLoading();
                    uni.hideLoading();
                })
            },
            getMore() {
                if (this.more_list) {
                    this.getList();
                }
            }
        },
        onShow: function() {
            this.page = 1;
            this.getList();
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            if(options.is_user == 1) {
                that.is_user = true
            }
            if(options.keyword) {
                that.keyword = options.keyword;
            }
            uni.getSystemInfo({
                success: function (res) {
                    that.windowHeight = res.windowHeight;
                }
            })
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that._num = 0
        }
    }
</script>

<style scoped lang="scss">
    .more-menu {
        position: fixed;
        z-index: 5;
        top: #{166rpx};
        padding-top: #{22rpx};
        right: #{22rpx};
        width: #{196rpx};
        background-color: #fff;
        font-size: #{28rpx};
        color: #666;
        border-bottom: #{1rpx} solid #e0e0e0;
        .handle-btn {
            height: #{48rpx};
            display: flex;
            align-items: center;
            padding: 0 #{24rpx};
            border-radius: #{24rpx};
            border: #{2rpx} solid #bbb;
            color: #353535;
            font-size: #{24rpx};
            margin-left: #{16rpx};
            &.other {
                border: #{2rpx} solid #ff4544;
                color: #ff4544;
            }
        }
        view {
            width: #{196rpx};
            height: #{68rpx};
            line-height: #{68rpx};
            text-align: center;
            border-left: #{1rpx} solid #e0e0e0;
            border-right: #{1rpx} solid #e0e0e0;
        }
    }
    .search-area {
        position: fixed;
        z-index: 3;
        top: 0;
        left: 0;
        right: 0;
        height: #{88rpx};
        line-height: #{88rpx};
        background-color: #efeff4;
        padding: 0 #{48rpx} 0 #{24rpx};
        .icon-search {
            height: #{24rpx};
            width: #{24rpx};
            margin-top: #{16rpx};
        }
        .icon-search+text {
            color:#b2b2b2;
            font-size:#{24rpx};
            margin:0 #{5rpx};
        }
        .search {
            height: #{56rpx};
            line-height: #{56rpx};
            border-radius: #{28rpx};
            background-color: #fff;
            color: #b2b2b2;
            width: #{528rpx};
            &.all-search {
                width: #{702rpx};
            }
            .keyword {
                color: #353535;
            }
            image {
                margin-left: #{28rpx};
                margin-right: #{10rpx};
            }
        }
        .choose {
            font-size: #{26rpx};
        }
        image {
            width: #{22rpx};
            height: #{12rpx};
            margin-left: #{12rpx};
        }
    }
    .navs-info {
        background-color: #fff;
        border-bottom: #{1rpx} solid #e2e2e2;
        position: fixed;
        z-index: 2;
        top: #{78rpx};
        left: 0;
        right: 0;
        padding-top: #{10rpx};
        .navs {
            height: #{100rpx};
            font-size: #{28rpx};
            color: #666;
            text-align: center;
            position: relative;
            &.more-navs {
                line-height: #{100rpx};
            }
            .active {
                display: inline-block;
                height: #{100rpx};
                line-height: #{102rpx};
                border-bottom: #{2rpx} solid;
            }
            image {
                height: #{16rpx};
                width: #{16rpx};
                margin-left: #{16rpx};
                display: block;
                float: right;
                margin-top: #{42rpx};
            }
        }
    }
    .order-item {
        background-color: #fff;
        padding: #{24rpx};
        margin: #{20rpx} #{24rpx} 0;
        border-radius: #{16rpx};
        display: block;
        .order-info {
            font-size: #{24rpx};
            color: #353535;
            margin-bottom: #{24rpx};
            .remark-info {
                margin-top: #{8rpx};
            }
        }
        .order-user {
            height: #{72rpx};
            background-color: #f7f7f7;
            padding-left: #{28rpx};
            font-size: #{24rpx};
            color: #353535;
            view:first-of-type {
                margin-right: #{32rpx};
            }
        }
        .goods {
            height: #{160rpx};
            margin-top: #{24rpx};
            position: relative;
            font-size: #{24rpx};
            color: #353535;
            margin-bottom: #{24rpx};
            .goods-status {
                height: #{40rpx};
                line-height: #{40rpx};
                color: #fff;
                width: #{160rpx};
                position: absolute;
                bottom: 0;
                left: 0;
                text-align: center;
                background-color: #ff4544;
                border-bottom-left-radius: #{4rpx};
                border-bottom-right-radius: #{4rpx};
            }
            .goods-img {
                height: #{160rpx};
                width: #{160rpx};
                float: left;
                margin-right: #{20rpx};
                border-radius: #{4rpx};
            }
            .goods-name {
                padding-top: #{5rpx};
            }
            .goods-attr {
                font-size: #{24rpx};
                color: #999;
                position: absolute;
                top: #{78rpx};
                left: #{180rpx};
                width: 70%;
                text {
                    margin-right: #{20rpx};
                }
            }
            .goods-num {
                font-size: #{24rpx};
                color: #999;
                position: absolute;
                top: #{126rpx};
                left: #{180rpx};
            }
            .goods-price {
                font-size: #{24rpx};
                color: #353535;
                position: absolute;
                bottom: 0;
                right: 0;
            }
        }
        .price-info {
            font-size: #{28rpx};
            color: #353535;
            .other {
                font-size: #{24rpx};
                color: #999;
            }
        }
        .menu-button {
            margin-top: #{24rpx};
        }
    }
    .search-item {
        height: #{96rpx};
        background-color: #efeff4;
        padding: 0 #{24rpx};
        font-size: #{28rpx};
        color: #00c203;
        .search-input {
            height: #{64rpx};
            position: relative;
            width: #{620rpx};
            .search-clear {
                position: absolute;
                right: #{15rpx};
                top: #{21rpx};
                width: #{30rpx};
                height: #{30rpx};
                z-index: 100;
            }
            .search-icon {
                height: #{22rpx};
                width: #{22rpx};
                position: absolute;
                top: #{21rpx};
                left: #{28rpx};
                z-index: 10;
            }
            input {
                padding-left: #{62rpx};
                padding-right: #{70rpx};
                background-color: #fff;
                border-radius: #{32rpx};
                height: #{64rpx};
                font-size: #{26rpx};
                color: #353535;
            }
        }
    }
    .search-history {
        position: absolute;
        top: #{96rpx};
        left: 0;
        right: 0;
        height: 100%;
        background-color: #fff;
        padding: #{24rpx} #{4rpx};
        font-size: #{28rpx};
        color: #666;
        z-index: 20;
        .delete-icon {
            height: #{34rpx};
            width: #{28rpx};
        }

        .candidate-list {
            max-height: #{420rpx};
            overflow: hidden;
        }
        .search-title {
            padding: 0 #{20rpx};
            margin-bottom: #{24rpx};
        }
        .keyword-item {
            height: #{64rpx};
            line-height: #{64rpx};
            padding: 0 #{20rpx};
            background-color: #f7f7f7;
            color: #333;
            border-radius: #{32rpx};
            font-size: #{28rpx};
            margin-left: #{20rpx};
            margin-bottom: #{20rpx};
            max-width: 90%;
        }
    }
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
    .search-palce {
        height: #{188rpx};
    }
    .dialog-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.3);
        z-index: 1000;
        .dialog {
            font-size: 30rpx;
            color: #353535;
            width: 480rpx;
            height: 200rpx;
            border-radius: 16rpx;
            text-align: center;
            background-color: #fff;
            .dialog-content {
                height: 110rpx;
                line-height: 110rpx;
            }
            .dialog-btn {
                position: relative;
                height: 90rpx;
                border-top: 2rpx solid #e2e2e2;
                .btn {
                    width: 240rpx;
                    height: 90rpx;
                    text-align: center;
                    line-height: 90rpx;
                    font-size: 26rpx;
                    color: #666;
                }
                .line {
                    position: absolute;
                    top: 20rpx;
                    left: 50%;
                    margin-left: -1rpx;
                    width: 2rpx;
                    height: 45rpx;
                    background-color: #e2e2e2;
                }
            }
        }
    }
</style>