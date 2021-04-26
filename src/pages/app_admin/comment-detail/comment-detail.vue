<template>
	<app-layout>
		<view class="comment-detail">
			<view class="top-text dir-left-nowrap main-left">
				<view class="prompt">买家评价</view>
				<view class="show" v-if="detail.is_show === '0'">已隐藏</view>
			</view>
			<view class="content">
				<view class="top dir-left-nowrap">
					<image class="image" :src="detail.cover_pic"></image>
					<view class="name dir-left-nowrap main-between">
						<view class="name-text">
							<view class="text">{{detail.goods_name}}</view>
							<view v-if="detail.attr_list && detail.attr_list.length > 0" class="attr">{{detail.attr_list[0].attr_group_name}}：{{detail.attr_list[0].attr_name}}</view>
						</view>
						<view class="name-icon dir-top-nowrap main-center cross-center">
							<image class="icon" :src="`${detail.score === '3' ? '../image/praise.png' : detail.score === '2' ? '../image/average.png' : '../image/bad-review.png'}`"></image>
							<view class="evaluation">{{detail.score === '3' ? '好评' : detail.score === '2' ? '中评' : detail.score === '1' ? '差评' : ''}}</view>
						</view>
					</view>
				</view>
				<view class="bottom">
					<view class="bottom-text">{{detail.content}}</view>
					<view class="bottom-image dir-left-wrap">
						<image @click="screen(index)" :key="index" lazy-load :src="item" v-for="(item, index) in detail.pic_url"></image>
					</view>
				</view>
			</view>
			<view class="seller">卖家回复</view>
			<view class="area">
				<textarea  maxlength="-1" :show-confirm-bar="true" @input="bindTextAreaBlur" @confirm="bindTextAreaBlur" @blur="bindTextAreaBlur" placeholder="请输入回复内容" placeholder-class="place" :value="detail.reply_content"></textarea>
			</view>
			<view class="button" @click="reply">发布回复</view>
		</view>
	</app-layout>
</template>

<script>
    export default {
        name: 'comment-detail',
	    data() {
            return {
                detail: {}
            }
	    },
	    onLoad(options) { this.$commonLoad.onload(options);
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.$request({
	            url: this.$api.app_admin.comments_reply,
	            data: {
	                id: options.id,
	            }
            }).then(response => {
                this.$hideLoading();
                if(response.code === 0) {
                    this.detail = response.data.list;
                }
            });
	    },
	    methods: {
            screen(index) {
                uni.previewImage({
                	current: index,
                    urls: this.detail.pic_url
                })
            },
            reply() {
                this.$request({
                    url: this.$api.app_admin.comments_reply,
	                method: 'post',
                    data: {
                        id: this.detail.id,
                        reply_content: this.detail.reply_content,
                    }
                }).then(response => {
                    if (response.code === 0) {
                        uni.navigateBack();
                    }
                });
            },
            bindTextAreaBlur(e) {
                this.detail.reply_content = e.detail.value;
            }
	    }
    }
</script>

<style scoped lang="scss">
@import "./comment-detail.scss";
</style>