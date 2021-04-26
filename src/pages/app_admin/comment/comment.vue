<template>
	<app-layout>
		<view class="comment">
			<view class="navigator dir-left-nowrap">
				<view @click="setActiveNav(3)">
					<text :class="{'active-nav': score === 3}">好评</text>
				</view>
				<view @click="setActiveNav(2)">
					<text :class="{'active-nav': score === 2}">中评</text>
				</view>
				<view @click="setActiveNav(1)">
					<text :class="{'active-nav': score === 1}">差评</text>
				</view>
			</view>
			<view class="replyStatus dir-left-nowrap main-center cross-center">
				<view @click="setActiveReply(2)" :class="{'active-reply': is_reply === 2}">未回复</view>
				<view @click="setActiveReply(1)" :class="{'active-reply': is_reply === 1}">已回复</view>
			</view>
			<view class="tip" v-if="list.length === 0">
				<image src="https://v4test.zjhejiang.com/web/statics/img/app/app_admin/no-comment.png"></image>
				<view>没有任何评论哦~</view>
			</view>
			<view class="content">
                <view class="item dir-top-nowrap" v-for="(item, index) in list" :key="index"
                      :class="{'is-top-box-bg': item.is_top === 1}">
                    <view class="top dir-left-nowrap">
                        <image :src="item.cover_pic" lazy-load class="image"></image>
                        <view class="text" :class="{'is-top-center-bg': item.is_top === 1}">
                            <view class="name">
                                {{item.name}}
                            </view>
                            <view class="from">
                                来自用户 {{item.nickname}}
                            </view>
                        </view>
                    </view>
                    <view class="bottom dir-left-nowrap main-between">
                        <view class="performed dir-left-nowrap cross-center">
                            <image class="icon"
                                   :src="`${item.score === 3 ? '../image/praise.png' : item.score === 2 ? '../image/average.png' : '../image/bad-review.png'}`"/>
                            <view class="evaluation">{{item.score === 3 ? '好评' : item.score === 2 ? '中评' : item.score
                                === 1 ? '差评' : ''}}
                            </view>
                            <view class="show" v-if="0 && item.is_show === 0">已隐藏</view>
                        </view>
                        <view class="button dir-left-nowrap">
                            <view class="reply" @click="isTop(item,index)">
                                {{item.is_top === 1 ? '取消置顶' : '置顶'}}
                            </view>
                            <view @click="isShow(item)" class="show-button" style="margin-left:16rpx">
                                {{item.is_show === 1 ? '隐藏评论' : '取消隐藏'}}
                            </view>
                            <app-jump-button form
                                             :url="`/pages/app_admin/comment-detail/comment-detail?id=${item.id}`">
                                <view class="reply">
                                    {{item.reply_content === '' ? '回复' : '修改回复'}}
                                </view>
                            </app-jump-button>
                        </view>
                    </view>
                </view>
            </view>
		</view>
	</app-layout>
</template>

<script>
    export default {
        name: 'comment',
	    data() {
            return {
	            list: [],
                over: false,
	            page: 1,
	            is_reply: 2,
	            score: 3,
                first: true,
            }
	    },
	    onLoad() { this.$commonLoad.onload();
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.$request({
	            url: this.$api.app_admin.comments,
	            data: {
                    score: 3,
                    is_reply: 2,
                    page: 1,
	            }
            }).then(response => {
                this.$hideLoading();
                if (response.code === 0) {
                    this.first = false;
                    this.list = response.data.list;
                }
            })
	    },
        onReachBottom() {
            if (!this.over) {
                this.page++;
                this.request();
            }
        },
        onShow() {
            if(this.first) {
                return false
            }
            this.$request({
                url: this.$api.app_admin.comments,
                data: {
                    score: this.score,
                    is_reply: this.is_reply,
                    page: this.page,
                }
            }).then(response => {
                if (response.code === 0) {
                    for(let i in response.data.list) {
                        for(let j in this.list) {
                            this.list = response.data.list;
                        }
                    }
                }
            })
        },
	    methods: {
            setActiveNav(data) {
                this.page = 1;
                this.score = data;
                this.is_reply = 2;
                this.over = false;
                uni.pageScrollTo({
                    scrollTop: 0
                });
                uni.showLoading({
                    title: '加载中...'
                });
                this.$request({
                    url: this.$api.app_admin.comments,
                    data: {
                        score: this.score,
                        is_reply: this.is_reply,
                        page: this.page,
                    }
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        this.list = response.data.list;
                    }
                })
            },
		    setActiveReply(data) {
                this.page = 1;
                this.is_reply = data;
                this.over = false;
                uni.showLoading({
                    title: '加载中...'
                });
                this.$request({
                    url: this.$api.app_admin.comments,
                    data: {
                        score: this.score,
                        is_reply: this.is_reply,
                        page: this.page,
                    }
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        this.list = response.data.list;
                    }
                });
		    },
		    request() {
                this.$request({
	                url: this.$api.app_admin.comments,
	                data: {
	                    score: this.score,
		                is_reply: this.is_reply,
		                page: this.page,
                    }
                }).then(response => {
                    if (response.code === 0) {
                        if (response.data.list.length > 0) {
                            this.list = [...this.list, ...response.data.list];
                        } else {
                            this.over = true;
                        }
                    }
                })
            },
            isTop(data, index) {
                const self = this;
                const is_top = data.is_top == 1 ? 0 : 1;
                self.$request({
                    url: self.$api.app_admin.comments_top,
                    method: 'POST',
                    data: {
                        status: is_top,
                        id: data.id
                    }
                }).then(info => {
                    if (info.code === 0) {
                        data.is_top = is_top;
                        self.list.splice(index, 1, data);
                        uni.showToast({title: info.msg, icon: 'none'});
                    }
                })
            },

            isShow(data) {
                if (data.is_show === 0) {
                    this.$request({
                        url: this.$api.app_admin.comments_show,
                        method: 'POST',
                        data: {
                            is_show: 1,
                            id: data.id,
                        }
                    }).then(response => {
                        if (response.code === 0) {
                            for (let i = 0; i < this.list.length; i++) {
                                if (data.id === this.list[i].id) {
                                    this.list[i].is_show = 1;
                                }
                            }
                        }
                    })
                } else {
                    this.$request({
                        url: this.$api.app_admin.comments_show,
                        method: 'POST',
                        data: {
                            is_show: 0,
                            id: data.id,
                        }
                    }).then(response => {
                        if (response.code === 0) {
                            for (let i = 0; i < this.list.length; i++) {
                                if (data.id === this.list[i].id) {
                                    this.list[i].is_show = 0;
                                }
                            }
                        }
                    })
                }
            }
	    },
    }
</script>

<style scoped lang="scss">
@import "./comment.scss";
</style>