<template>
    <view class="app-layout">
        <app-layout>
            <template v-if="cat_style === `1`">
                <view class="app-body dir-top-nowrap">
                    <view class="app-item" v-for="(item, index) in list" :key="index">
                        <app-jump-button 
                            form 
                            open_type="navigate" 
                            :url="item.page_url"
                        >
                            <view class="app-image" 
                                :style="{backgroundImage: `url(${item.big_pic_url})`}"
                            ></view>
                        </app-jump-button>
                    </view>
                </view>
            </template>
            <template v-else-if="cat_style === `2`">
                <view class="app-left-right dir-left-nowrap">
                    <app-category-list
                        :theme="getTheme"
                        @click="activeThree" 
                        :windowHeight="windowHeight" 
                        :windowWidth="windowWidth"
                        :botHeight="botHeight" 
                        :height="height" 
                        :noSetHeight="setHeight"
                        :list="list"
                    ></app-category-list>
                    <scroll-view scroll-y class="app-right" :style="{height: `${setHeight}`}" style="padding-top:20rpx">
                        <image class="app-background" :src="list[activeIndex].advert_pic"
                               v-if="list[activeIndex].advert_pic"></image>
                        <view class="app-item" v-for="(item, index) in list[activeIndex].child" :key="index">
                            <app-jump-button form open_type="navigate" :url="item.page_url">
                                <image :src="item.big_pic_url" class="app-image"></image>
                            </app-jump-button>
                        </view>
                    </scroll-view>
                </view>
            </template>
            <template v-else-if="cat_style === `3`">
                <view class="app-small dir-left-wrap">
                    <view class="app-item" v-for="(item, index) in list" :key="index">
                        <app-jump-button arrangement="column" form open_type="navigate" :url="item.page_url">
                            <image class="app-image" :src="item.pic_url"></image>
                            <text class="app-name" style="text-align: center">{{item.name}}</text>
                        </app-jump-button>
                    </view>
                </view>
            </template>
            <template v-else-if="cat_style === `4`">
                <view class="app-left-right-t dir-left-nowrap">
                    <app-category-list :windowHeight="windowHeight" :windowWidth="windowWidth" :botHeight="botHeight"
                                       @click="activeThree" :height="height" :noSetHeight="setHeight"
                                       :theme="getTheme"
                                       :list="list"></app-category-list>
                    <scroll-view scroll-y class="app-right" :style="{height: `${setHeight}`}"
                                 style="padding-top: 20rpx">
                        <image class="app-background" :src="list[activeIndex].advert_pic"
                               v-if="list[activeIndex].advert_pic"></image>
                        <view class="app-item" v-for="(item, index) in list[activeIndex].child" :key="index">
                            <app-jump-button arrangement="column" form open_type="navigate" :url="item.page_url">
                                <image :src="item.pic_url" class="app-image"></image>
                                <text class="app-name">{{item.name}}</text>
                            </app-jump-button>
                        </view>
                    </scroll-view>
                </view>
            </template>
            <template v-else-if="cat_style === `6`">
                <view class="app-left-right-f dir-left-nowrap">
                    <app-category-list :windowHeight="windowHeight" :windowWidth="windowWidth" :botHeight="botHeight"
                                       @click="activeThree" :height="height" :noSetHeight="setHeight"
                                       :theme="getTheme"
                                       :list="list"></app-category-list>
                    <scroll-view scroll-y class="app-right" :style="{height: `${setHeight}`}">
                        <image class="app-background" :src="list[activeIndex].advert_pic"
                               v-if="list[activeIndex].advert_pic"></image>
                        <view class="app-item" v-for="(item, index) in list[activeIndex].child" :key="index">
                            <view class="app-top">
                                <app-jump-button arrangement="left" form open_type="navigate" :url="item.page_url">
                                    <text class="app-text">{{item.name}}</text>
                                    <view class="app-icon dir-left-nowrap cross-center">
                                        <text>更多</text>
                                        <icon type></icon>
                                    </view>
                                </app-jump-button>
                            </view>
                            <view v-for="(a, i)  in item.child" :key="i">
                                <app-jump-button form open_type="navigate" :url="a.page_url">
                                    <image :src="a.big_pic_url" class="app-image"></image>
                                </app-jump-button>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </template>
            <template v-else-if="cat_style === `7`">
                <view class="app-left-right-s  dir-left-nowrap">
                    <app-category-list 
                        :windowHeight="windowHeight" 
                        :windowWidth="windowWidth" 
                        :botHeight="botHeight"
                        @click="activeThree" 
                        :height="height"
                        :theme="getTheme"
                        :noSetHeight="setHeight"
                        :list="list"
                    ></app-category-list>
                    <scroll-view
                        scroll-y
                        class="app-right"
                        :style="{height: `${setHeight}`}"
                        style="padding-top: 20rpx"
                    >
                        <image lazy-load class="app-background" 
                            :src="list[activeIndex].advert_pic"
                            v-if="list[activeIndex].advert_pic"
                        ></image>
                        <view class="app-item" v-for="(item, index) in list[activeIndex].child" :key="index">
                            <view class="app-top">
                                <app-jump-button arrangement="left" form open_type="navigate" :url="item.page_url">
                                    <text class="app-text">{{item.name}}</text>
                                    <view class="app-icon dir-left-nowrap cross-center">
                                        <text>更多</text>
                                        <icon type></icon>
                                    </view>
                                </app-jump-button>
                            </view>
                            <view class="app-item-child" v-for="(a, i)  in item.child" :key="i">
                                <app-jump-button arrangement="column" form open_type="navigate" :url="a.page_url">
                                    <image :src="a.pic_url" class="app-image"></image>
                                    <text class="app-text">{{a.name}}</text>
                                </app-jump-button>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </template>
        </app-layout>
    </view>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appCategoryList from '../../../components/page-component/app-category-list/app-category-list.vue';

    export default {
        components: {
            'app-category-list': appCategoryList,
        },
        data() {
            return {
                scrollTop: 0,
                list: [],
                goods: [],
                request: true,
                page: 1,
                classId: 0,
                activeIndex: 0,
                activeIndexTwo: 0,
                height: 0,
                over: false,
                scrollHeight: 0,
                mch_id: 0,
                cat_style: 0,
                cat_id: 0,
            }
        },
        computed: {
            ...mapGetters('mallConfig', {
                tabBarNavs: 'getNavBar',
                getTheme: 'getTheme'
            }),
            ...mapState('gConfig', {
                windowHeight: state => state.systemInfo.windowHeight,
                windowWidth: state => state.systemInfo.windowWidth,
            }),
            ...mapGetters('iPhoneX', {
                botHeight: 'getBotHeight'
            }),
            setHeight() {
                return this.windowHeight + 'px';
            }
        },
        onReachBottom() {

        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad(options) { this.$commonLoad.onload(options);
            const self = this;
            self.mch_id = options.mch_id;
            self.$request({
                url: self.$api.mch.cat_style,
                data: {
                    mch_id: self.mch_id,
                }
            }).then(info => {
                if (info.code === 0) {
                    self.cat_style = info.data.setting.cat_style;
                    self.loadData();
                }
            });
        },
        methods: {
            loadData: function () {
                const self = this;
                self.$showLoading();
                self.$request({
                    url: self.$api.mch.cats_list,
                    data: {
                        mch_id: self.mch_id,
                        cat_id: self.cat_id
                    }
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        self.list = info.data.list
                    }
                }).catch(info => {
                    self.$hideLoading();
                })
            },
            // 点击导航栏
            active(item) {
                this.page = 1;
                uni.showLoading({
                    text: '加载中...',
                    mask: true
                });
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].active !== item.active) {
                        this.list[i].active = false;
                    }
                    if (this.list[i].id === item.id) {
                        this.list[i].active = true;
                    }
                }
                this.$request({
                    url: `${this.$api.default.goods_list}&page=${this.page}&cat_id=${item.id}`
                }).then(response => {
                    uni.hideLoading();
                    this.goods = response.data.list;
                    this.page = 1;
                    this.classId = item.id;
                    this.over = false;
                });
                this.over = false;
            },
            // 下拉分页请求
            req() {
                this.$request({
                    url: `${this.$api.default.goods_list}&page=${this.page}&cat_id=${this.classId}`
                }).then(response => {
                    if (response.data.list.length > 0) {
                        this.goods.push(...response.data.list);
                    } else {
                        this.over = true;
                    }
                    uni.hideLoading();
                });
            },
            activeThree({item}) {
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].active !== item.active) {
                        this.list[i].active = false;
                    }
                    if (this.list[i].id === item.id) {
                        this.list[i].active = true;
                        this.activeIndex = i;
                    }
                }
            }
        },
    }
</script>
<style lang="scss" scoped>
    .app-layout {
        background: white;
        min-height: 100vh;
    }
    .app-body {
        width: #{750rpx};
        background-color: white;
        padding: 0 #{24rpx} #{24rpx} #{24rpx};
        .app-item {
            width: #{702rpx};
            height: #{212rpx};
            margin-top: #{20rpx};
            .app-image {
                background-size: 100% 100%;
                background-repeat: no-repeat;
                width: 100%;
                height: 100%;
            }
        }
    }
    .app-small {
        width: $screen-width;
        padding: 0 #{27rpx};
        background-color: white;
        .app-item {
            width: #{120rpx};
            margin: #{64rpx} #{27rpx} 0 #{27rpx};
            .app-image {
                width: #{120rpx};
                height: #{120rpx};
                margin-bottom: #{20rpx};
            }
            .app-name {
                color: #353535;
                font-size: #{26rpx};
                width: 100%;
                word-break: break-all;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
            }
        }
    }
    .app-top {
        width: $screen-width;
    }

    .app-top-t {
        width: $screen-width;
        background: white;

        .app-t {
            width: 100%;
            padding-top: #{24rpx};
            padding-left: #{24rpx};

            > text {
                margin-bottom: #{20rpx};
            }

            .app-text {
                border: #{1rpx} solid #cccccc;
                font-size: #{28rpx};
                color: #666666;
                padding: 0 #{28rpx};
                display: inline-block;
                height: #{54rpx};
                line-height: #{54rpx};
                margin-right: #{24rpx};
                border-radius: #{28rpx};
            }

            .app-active-color {
                color: #ff4544;
                border: #{1rpx} solid #ff4544;
            }
        }
    }
    .app-left-right {
        width: $screen-width;
        background: #ffffff;
        .app-right {
            width: #{524rpx};
            margin-left: #{22rpx};
            .app-background {
                width: #{500rpx};
                height: #{184rpx};
                margin: #{20rpx} #{24rpx} #{20rpx} 0;
            }

            .app-item {
                margin-left: #{2rpx};
                height: #{158rpx};
                width: #{524rpx};
                margin-bottom: #{20rpx};

                .app-image {
                    height: #{158rpx};
                    width: #{524rpx};
                }
            }
        }
    }
    .app-left-right-t {
        width: $screen-width;
        background: white;
        .app-right {
            width: #{546rpx};
            .app-background {
                width: #{500rpx};
                height: #{184rpx};
                margin: #{20rpx} #{24rpx} #{20rpx} #{24rpx};
            }
            .app-item {
                width: #{182rpx};
                height: #{138rpx};
                display: inline-block;
                margin-bottom: #{40rpx};
                .app-image {
                    height: #{104rpx};
                    width: #{104rpx};
                }
                .app-name {
                    font-size: #{26rpx};
                    margin-top: #{8rpx};
                    color: #353535;
                    word-break: break-all;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                }
            }
        }
    }
    .app-left-right-f {
        width: $screen-width;
        background: white;
        .app-right {
            width: #{524rpx};
            margin-left: #{22rpx};
            .app-background {
                width: #{500rpx};
                height: #{184rpx};
                margin: #{20rpx} #{24rpx} #{20rpx} 0;
            }
            .app-item {
                margin-left: #{2rpx};
                width: #{524rpx};
                .app-image {
                    width: #{524rpx};
                    height: #{158rpx};
                    margin-bottom: #{20rpx};
                }

                .app-top {
                    position: relative;
                    width: #{524rpx};
                    margin: #{20rpx} 0 #{40rpx} 0;
                }
                .app-text {
                    font-size: #{28rpx};
                    color: #353535;
                }
                .app-icon {
                    position: absolute;
                    right: #{24rpx};
                    text {
                        font-size: #{26rpx};
                        color: #999999;
                        margin-left: #{16rpx};
                    }
                    icon {
                        width: #{13rpx};
                        height: #{22rpx};
                        background-image: url("../../../static/image/icon/arrow-right.png");
                        background-size: 100% 100%;
                        background-repeat: no-repeat;
                        margin-left: #{24rpx};
                    }
                }
            }
        }
    }
    .app-left-right-s {
        width: $screen-width;
        background: white;
        .app-right {
            width: #{546rpx};
            background-color: white;
            .app-background {
                width: #{500rpx};
                height: #{184rpx};
                margin: #{20rpx} #{24rpx} #{40rpx} #{24rpx};
            }
            .app-item {
                width: #{546rpx};
                .app-top {
                    width: 100%;
                    padding-left: #{24rpx};
                    margin-bottom: #{40rpx};
                    .app-text {
                        font-size: #{28rpx};
                        color: #353535;
                    }
                    .app-icon {
                        position: absolute;
                        right: #{24rpx};
                        text {
                            font-size: #{26rpx};
                            color: #999999;
                            margin-left: #{16rpx};
                        }
                        icon {
                            width: #{13rpx};
                            height: #{22rpx};
                            background-image: url("../../../static/image/icon/arrow-right.png");
                            background-size: 100% 100%;
                            background-repeat: no-repeat;
                            margin-left: #{24rpx};
                        }
                    }
                }
                .app-item-child {
                    display: inline-block;
                    height: #{138rpx};
                    width: #{182rpx};
                    margin-bottom: #{40rpx};
                    .app-image {
                        width: #{104rpx};
                        height: #{104rpx};
                    }
                    .app-text {
                        font-size: #{26rpx};
                        color: #353535;
                        margin-top: #{8rpx};
                    }
                }
            }
        }
    }
</style>
