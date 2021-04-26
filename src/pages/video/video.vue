<template>
    <app-layout>
        <view v-for="(item, index) in list" :key="index">
            <view>
                <app-video :pic-url="item.pic_url" :url="item.url"></app-video>
            </view>
            <view class="video">
                <view class="title">{{item.title}}</view>
                <view class="content" :class="active !== index ? 'active' : ''">{{item.content}}</view>
                <view class="other dir-left-nowrap cross-center">
                    <view class="box-grow-1">{{item.time}}</view>
                    <image src="../../static/image/icon/arrow-right.png" class="img" @click="click(index)"
                           :class="active === index ? 'active' : ''"></image>
                    <view class="box-grow-0" @click="click(index)">{{active === index ? '收起' : '展开'}}</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapState} from 'vuex';
    import appVideo from "../../components/page-component/app-video/app-video.vue";
    import tabBar from './../../core/tabbar.js';

    let page = 1;
    let is_no_more = false;
    let is_loading = false;
    export default {
        name: "video",
        components: {
            'app-video': appVideo,
        },
        data() {
            return {
                list: [],
                active: -1,
                navigationBarTitle: '',
            };
        },
        onLoad() { this.$commonLoad.onload();
            page = 1;
            is_no_more = false;
            is_loading = false;
            this.loadData();
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            });
            // #endif
           this.$nextTick(() => {
               let currentRoute = this.$platDiff.route();
               tabBar.setNavigationBarTitle(this.bar_title, currentRoute).then(res => {
                    this.navigationBarTitle = res;
               });
           });
        },
        onPageScroll(e) {
            this.$store.dispatch('page/actionSetScrollTop', e.scrollTop);
        },
        onReachBottom() {
            if (is_no_more) return;
            this.loadData();
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: this.navigationBarTitle,
                path: '/pages/video/video'
            });
        },
        // #endif
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            // 分享朋友圈beta
            return this.$shareTimeline({
                title: this.navigationBarTitle,
            });
        },
        // #endif
        computed: {
           ...mapState('mallConfig', {
               bar_title: state => state.bar_title,
           })
        },
        methods: {
            loadData() {
                if (is_loading) {
                    return;
                }
                this.$showLoading();
                is_loading = true;
                this.$request({
                    url: this.$api.video.index,
                    data: {
                        page: page
                    }
                }).then(response => {
                    this.$hideLoading();
                    if (response.code === 0) {
                        this.list = this.list.concat(response.data.list);
                        if (response.data.list.length === 0) {
                            is_no_more = true;
                        }
                        page++;
                    }
                    is_loading = false;
                }).catch(() => {
                    this.$hideLoading();
                    is_loading = false;
                })
            },
            click(index) {
                if (this.active === index) {
                    this.active = -1;
                } else {
                    this.active = index;
                }
            }
        },
    }
</script>

<style scoped lang="scss">
    .video {
        padding: #{24rpx};
    }

    .title {
        color: $uni-important-color-black;
        margin-top: #{24rpx};
    }

    .content {
        font-size: $uni-font-size-general-one;
        color: $uni-general-color-two;
        margin-top: #{40rpx};
    }

    .content.active {
        word-break: break-all;
        white-space: pre-wrap;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }

    .other {
        font-size: $uni-font-size-weak-one;
        color: $uni-general-color-two;
        margin-top: #{36rpx};
        margin-bottom: #{40rpx};
    }

    .img {
        height: #{22rpx};
        width: #{12rpx};
        margin-right: #{16rpx};
        transform: rotate(90deg);
    }

    .img.active {
        transform: rotate(-90deg);
    }
</style>