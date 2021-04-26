<template>
    <view class="bd-comments" v-if="isComment == 1">
        <template v-if="list.length > 0">
            <view class="bd-top dir-left-nowrap cross-center" @click="goto">
                <view class="box-grow-1 bd-name">评价</view>
                <view class="box-grow-0 bd-more">查看更多</view>
                <image class="box-grow-0 bd-icon" src="/static/image/icon/arrow-right.png"></image>
            </view>
            <view class="bd-bottom bt" v-for="(item, index) in list" :key="index" >
                <view class="bd-title dir-left-nowrap cross-center">
                    <image class="box-grow-0 bd-avatar" :src="item.avatar"></image>
                    <view class="box-grow-1 bd-nickname">{{item.nickname}}</view>
                    <view class="bd-more box-grow-0">{{item.time}}</view>
                </view>
                <view class="bd-attr-name">{{ item.attr_name }}</view>
                <view class="bd-content u-line-2">{{item.content}}</view>
                <view class="dir-left-wrap pic-list">
                    <image class="bd-pic" @click="imgPreview(index, ind)" :src="pic_url" v-for="(pic_url, ind) in item.pic_url" :key="ind"></image>
                </view>
            </view>
        </template>
        <view class="bd-nothing" v-else>暂无评价</view>
    </view>
</template>

<script>
import {mapState} from "vuex";

export default {
        name: "bd-comments",
        props: {
            goodsId: Number
        },
        data() {
            return {
                list: []
            }
        },
        computed: {
            ...mapState({
                isComment: function(state) {
                    return state.mallConfig.mall.setting.is_comment;
                }
            })
        },
        methods: {
            getList: function(goodsId) {
                this.$request({
                    url: this.$api.goods.comments_list,
                    data: {
                        goods_id: goodsId
                    }
                }).then((res) => {
                    if (res.code === 0) {
                        this.list = res.data.comments.slice(0, 2);
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: res.msg
                        });
                    }
                });
            },
            imgPreview: function(index, ind) {
                if (this.list && this.list[index] && this.list[index].pic_url && this.list[index].pic_url.length > 0) {
                    uni.previewImage({
                        current: ind,
                        urls: this.list[index].pic_url
                    });
                }
            },
            goto() {
                uni.navigateTo({
                    url: `/pages/comments/comments?goods_id=${this.goodsId}`
                });
            }
        },
        watch: {
            goodsId: {
                immediate: true,
                handler(newVal) {
                    this.getList(newVal);
                }
            }
        }
    }
</script>

<style scoped>
    .bd-comments {
        width: 702upx;
        margin: 24upx 24upx 0 24upx;
        background-color: #ffffff;
        border-radius: 15upx;
    }
    .bd-nothing {
        padding: 20upx;
        font-size: 26upx;
        color: #353535;
    }
    .bd-top {
        height: 90upx;
        border-bottom: 1upx solid #eeeeee;
        padding: 0 20upx;
    }
    .bd-icon {
        width: 12upx;
        height: 22upx;
        margin-left: 15upx;
    }
    .bd-name {
        font-size: 26upx;
        color: #999999;
    }
    .bd-more {
        font-size: 22upx;
        color: #999999;
    }
    .bd-bottom {
        padding: 20upx;
    }
    .bd-title {
        margin-top: 8upx;
        margin-bottom: 22upx;
    }
    .bd-avatar {
        width: 56upx;
        height: 56upx;
        border-radius: 50%;
    }
    .bd-nickname {
        font-size: 26upx;
        color: #999999;
        margin-left: 26upx;
    }
    .bd-attr-name {
        font-size: 24upx;
        color: #999999;
        line-height: 34upx;
        margin-bottom: 14upx;
    }
    .bd-content {
        font-size: 26upx;
        line-height: 36upx;
        color: #353535;
    }
    .pic-list {
        margin-top: 20upx;
    }
    .bd-pic {
        width: 210upx;
        height: 210upx;
        margin-right: 10upx;
        margin-bottom: 10upx;
    }
</style>