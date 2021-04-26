<template>
    <app-layout :haveBackground="false">
        <view class="index-nav" v-if="nav_list.length > 0">
            <view class="app-index-nav dir-left-nowrap cross-center">
                <view class="app-search">
                    <app-jump-button form open_type="navigate" url="/pages/search/search?sign=wholesale">
                        <view class="app-icon"></view>
                    </app-jump-button>
                </view>
                <view class="app-line"></view>
                <scroll-view :scroll-into-view="`scroll-${activeIndex}`" scroll-with-animation scroll-x class="app-scroll">
                    <text class="app-item" :id="`scroll-${index}`" v-for="(item, index) in nav_list"
                          :key="item.id"
                          :style="{'background': cat_id == item.id && getTheme.key !== 'a'  ? getTheme.background : ''}"
                          :class="cat_id == item.id ? 'app-active-item default-item' : ''"
                          @click="changeStatus(item.id, index)"
                    >{{item.name}}</text>
                </scroll-view>
            </view>
            <view class="banner">
                <image :src="banner"></image>
            </view>
        </view>
        <view class="goods-style-one">
            <u-ordinary-list :theme="getTheme" :pagination="true" :isUnderLinePrice="false" v-if="list.length > 0 || first" buyBtn="text" :borderShow="1" :buyBtnStyle="3" buyBtnText="立即抢购" :list="list" :list-style="-1" :isBuy="false"></u-ordinary-list>
        </view>
        <view class="no-list" v-if="!loading && list.length === 0">
            <app-no-goods background="#f7f7f7"></app-no-goods>
        </view>
    </app-layout>
</template>

<script>
    import { mapState,mapGetters } from "vuex";
    import uOrdinaryList from '../../../components/page-component/u-goods-list/u-ordinary-list.vue';
    import appNoGoods from '../../../components/page-component/app-no-goods/app-no-goods.vue';

    export default {
        data() {
            return {
                list: [],
                nav_list: [],
                cat_id: -1,
                more: false,
                loading: false,
                first: false,
                page: 1,
                activityBg: '',
                banner: '',
                activeIndex: 0,
                style: -1
            }
        },
        components: {uOrdinaryList,appNoGoods},
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                compositionImg: state => state.mallConfig.__wxapp_img.composition
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
        },
        onReachBottom() {
            if(this.more) {
                this.getMore();
            }
        },
        methods: {
            requestCats(cat_id) {
                this.$request({
                    url: this.$api.wholesale.cats
                }).then(res => {
                    if (res.code === 0) {
                        this.nav_list = this.nav_list.concat(res.data.list);
                        !cat_id && (this.cat_id = this.nav_list[0].id);
                        this.getList(0);
                    }
                });
            },
            changeStatus(id, index) {
                this.cat_id = id;
                this.page = 1;
                if(index < 2) {
                    this.activeIndex = 0
                }else {
                    this.activeIndex = index - 1
                }
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                this.getList(id);
            },
            inputBlur() {
                let that = this;
                setTimeout(v => {
                    that.getFocus = false;
                    that.getList();
                }, 300)
            },
            tabShow() {
                this.style = this.style == 1 ? 4 : 1
            },
            jump(data) {
                uni.navigateTo({
                    url: data.page_url
                });
            },
            getMore() {
                this.more = false;
                this.loading = true;
                uni.showLoading({
                    mask: true,
                    title: '加载更多...'
                });
                this.$request({
                    url: this.$api.wholesale.index,
                    data: {
                        cat_id: this.cat_id,
                        page: this.page
                    }
                }).then(response=>{
                    this.$hideLoading();
                    uni.hideLoading();
                    if(response.code === 0) {
                        this.list = this.list.concat(response.data.list);
                        this.loading = false;
                        if(response.data.list.length == response.data.pagination.pageSize) {
                            this.more = true;
                            this.page++;
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    this.$hideLoading();
                });
            },
            getList(id) {
                this.more = false;
                this.loading = true;
                this.list = [];
                this.$request({
                    url: this.$api.wholesale.index,
                    data: {
                        cat_id: id
                    }
                }).then(response=>{
                    this.first = false;
                    this.$hideLoading();
                    uni.hideLoading();
                    if(response.code === 0) {
                        this.list = response.data.list;
                        this.banner = response.data.banner;
                        this.loading = false;
                        this.$forceUpdate();
                        if(this.list.length == response.data.pagination.pageSize) {
                            this.more = true;
                            this.page++;
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    this.$hideLoading();
                });
            },
        },

        onLoad(option) { this.$commonLoad.onload(option);
            let that = this;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.first = true;
            that.requestCats(option.cat_id);
        }
    }
</script>

<style scoped lang="scss">
    .index-nav {
        width: #{750rpx};
        height: #{348rpx};
        .app-index-nav {
            height: #{92rpx};
            background-color: white;
            width: #{750rpx};
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
            .app-search {
                width: #{108rpx};
                height: #{92rpx};
                .app-icon {
                    width: #{60rpx};
                    height: #{60rpx};
                    background-image: url("../image/big-sarch.png");
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                }
            }
            .app-line {
                width: #{1rpx};
                height: #{40rpx};
                background-color: #e2e2e2;
            }
            .app-scroll {
                width: #{641rpx};
                height: #{92rpx};
                white-space: nowrap;
                padding-left: #{18rpx};
                .app-item {
                    display: inline-block;
                    font-size: #{28rpx};
                    color: #666666;
                    padding: 0 #{24rpx};
                    box-sizing: border-box;
                    height: #{56rpx};
                    line-height: #{56rpx};
                    border-radius: #{28rpx};
                    margin: #{18rpx} #{32rpx};
                }
                .app-active-item {
                    color: white;
                }
                .default-item {
                    background: linear-gradient(140deg, #ffa360, #ff5c5c);
                }
            }
        }
        .banner {
            position: fixed;
            top: #{92rpx};
            left: 0;
            height: #{280rpx};
            width: 100%;
            z-index: 1000;
            image {
                width: 100%;
                height: #{280rpx};
            }
        }
    }
    .nav-area {
        height: 386rpx;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 22;
        background-color: #fff;
        font-size: #{26rpx};
        .search-view {
            margin: 20rpx auto;
            width: #{702rpx};
            height: #{66rpx};
            background-color: #F7F7F7;
            border-radius: #{33rpx};
            .icon {
                width: #{20rpx};
                height: #{20rpx};
                margin-right: #{11rpx};
            }
            .text {
                color: #999999;
            }
            input {
                width: #{702rpx};
                height: #{66rpx};
                border-radius: #{28rpx};
                padding: #{0 70rpx 0 30rpx};
                box-sizing: border-box;
                font-size: #{26rpx};
            }

            .search-clear {
                position: absolute;
                right: #{15rpx};
                top: #{19rpx};
                width: #{30rpx};
                height: #{30rpx};
                z-index: 300;
            }
        }
        .banner {
            height: #{280rpx};
            width: 100%;
            image {
                width: 100%;
                height: #{280rpx};
            }
        }
    }
    .no-list {
        position: absolute;
        top: #{348rpx};
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 50;
        background-color: #f7f7f7;
    }
</style>