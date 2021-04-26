<template>
    <view class="app-comments" v-if="mall.setting.is_comment == 1">
        <view class="empty" v-if="showType !== 'detail'">
            <view class="app-top dir-left-nowrap cross-center">
                <view class="box box-grow-1 main-center cross-center" @click="clickStatus(item.index)"
                      v-for="(item, index) in commentCount"
                      :key="index"
                      :style="{'background-color': status === item.index ? getTheme.background : ''}"
                      :class="status === item.index ? 'u-text ' : 'background'">
                    {{item.name}}({{item.count}})
                </view>
            </view>
        </view>
        <view class="list" v-if="list.length > 0">
            <view class="dir-left-nowrap block cross-center" v-if="showType === 'detail'">
                <view class="box-grow-1">评价</view>
                <view class="box-grow-0 more" @click="goto">查看更多</view>
                <image class="box-grow-0" src="../../../static/image/icon/arrow-right.png"></image>
            </view>
            <view class="comments" v-for="(item, index) in list" :key="index" :class="showType === 'detail' ? 'bt' : 'bb'">
                <view class="title dir-left-nowrap cross-center">
                    <image class="box-grow-0" :src="item.avatar"></image>
                    <view class="box-grow-1">{{item.nickname}}</view>
                    <view class="more box-grow-0">{{item.time}}</view>
                </view>
                <view class="c-attr-name">{{ item.attr_name }}</view>
                <view :class="showType === 'detail' ? 'content' : ''">{{item.content}}</view>
                <view class="dir-left-wrap pic-list">
                    <image :src="pic_url" v-for="(pic_url,pic_url_index) in item.pic_url" :key="pic_url_index"
                           @click="imgPreview(index, pic_url_index)"></image>
                </view>
                <view class="replay" v-if="showType !== 'detail' && item.reply_content">
                    <view>
	                    <text :style="{'color': getTheme.color}">商家：</text>
	                    {{item.reply_content}}
                    </view>
                </view>
            </view>
        </view>
        <view class="block cross-center" v-else>暂无评价</view>
    </view>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';

    let page = 1;
    let is_loading = false;
    let is_no_more = false;
    
    export default {
        name: 'app-comments',
        props: {
            goodsId: Number,
            url: {
                type: String,
                default() {
                    return '';
                }
            },
            showType: {
                type: String,
                default() {
                    return 'detail'
                }
            },
            reachBottom: Number,
        },
        watch: {
            goodsId: {
               handler() {
                   this.loadData();
               }
            },
            reachBottom: {
              handler(){
                  if (is_no_more) return;
                  this.loadData();
              }
            }
        },
        computed: {
            ...mapState({
                mall: state => state.mallConfig.mall
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
        },
        methods: {
            loadData() {
                if (this.mall.setting.is_comment == 0) return;
                if (is_loading) return;
                is_loading = true;
                if (this.showType !== 'detail') {
                    uni.showLoading({
                        title: '加载中'
                    });
                }
                this.$request({
                    url: this.url ? this.url : this.$api.goods.comments_list,
                    data: {
                        goods_id: this.goodsId,
                        page: page,
                        status: this.status,
                    }
                }).then(response => {
                    is_loading = false;
                    uni.hideLoading();
                    if (response.code === 0) {
                        this.commentCount = response.data.comment_count;
                        if (page === 1) {
                            this.list = [];
                        }
                        let list = response.data.comments;
                        if (list.length > 0) {
                            if (this.showType === 'detail') {
                                list = list.splice(0, 2)
                            }
                            this.list = [...this.list, ...list];
                            page++;
                        } else {
                            is_no_more = true;
                        }
                    }
                }).catch(() => {
                    is_loading = false;
                    uni.hideLoading();
                });
            },
            goto() {
                uni.navigateTo({
                    url: `/pages/comments/comments?goods_id=${this.goodsId}`
                })
            },
            clickStatus(status) {
                this.status = status;
                page = 1;
                is_no_more = false;
                this.loadData();
            },
            imgPreview(index, pic_index) {
                if (this.list && this.list[index] && this.list[index].pic_url && this.list[index].pic_url.length > 0) {
                    uni.previewImage({
                        current: pic_index,
                        urls: this.list[index].pic_url
                    });
                }
            },
        },
        data() {
            return {
                commentCount: [],
                list: [],
                status: 0,
            };
        },
        created() {
            page = 1;
            is_loading = false;
            is_no_more = false;
        },
	    
        mounted() {
            if (this.goodsId) this.loadData();
        },
    }
</script>

<style scoped lang="scss">
    .app-comments {

        .c-attr-name {
            color: #999999;
            font-size: #{24rpx};
        }


        .more {
            font-size: $uni-font-size-weak-one;
            color: $uni-general-color-two;
        }

        .block {
            width: 100%;
            height: #{80rpx};
            font-size: $uni-font-size-general-two;
            background-color: #FFFFFF;
            padding: 0 #{24rpx};

            image {
                width: #{12rpx};
                height: #{22rpx};
                display: block;
                margin-left: #{12rpx};
            }
        }

        .empty {
            width: 100%;
            height: #{100rpx};
            margin-bottom: #{20rpx};
        }

        .app-top {
            padding: #{24rpx};
            background-color: #FFFFFF;
            width: 100%;
            height: #{100rpx};
            position: fixed;
            left: 0;
            top: 0;

            .box {
                padding: 0 #{20rpx};
                margin-right: #{16rpx};
                border-radius: #{26rpx};
                font-size: $uni-font-size-general-two;
                height: 100%;

                &.background {
                    background-color: #f1f1f1;
                    color: $uni-general-color-one;
                }
            }
        }

        .list {
            background-color: #ffffff;
            padding: 0 #{24rpx};
            .block {
                padding: 0;
            }

            .comments {
                padding: #{28rpx} 0;
                width: 100%;
                word-break: break-all;

                .title {
                    font-size: $uni-font-size-general-one;
                    color: $uni-general-color-two;
                    margin-bottom: #{26rpx};

                    image {
                        width: #{56rpx};
                        height: #{56rpx};
                        display: block;
                        margin-right: #{26rpx};
	                    border-radius: #{28upx};
                    }
                }

                &.bt {
                    border-top: #{1rpx} solid #e2e2e2;
                }

                &.bb {
                    border-bottom: #{1rpx} solid #e2e2e2;
                }

                &.bb:last-child {
                    border: none;
                }

                .content {
                    word-break: break-all;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                }

                .pic-list {
                    image {
                        width: #{214rpx};
                        height: #{214rpx};
                        display: inline-block;
                        margin: #{20rpx} #{20rpx} 0 0;
                    }
                }

                .replay {
                    width: 100%;
                    background-color: $uni-weak-color-two;
                    padding: #{28rpx};
                    border-radius: #{16rpx};
                    font-size: $uni-font-size-general-one;
                    color: $uni-general-color-one;
                }
            }
        }
    }
    .u-text {
        color: #ffffff;
    }
</style>