<template>
    <view v-if="isShow" class="app-share-video-number" @click.prevent.stop="">
       <!-- 视频号弹框 -->
        <view class="item" v-if="isLoading">
            <image @click.prevent.stop="close" class="close" src="/static/image/icon/icon-close.png"></image>
            <view class="title">视频号链接</view>
            <view v-if="article_url">
                <view class="content">{{article_url}}</view>
                <view @click.prevent.stop="copyText" class="copy">复制</view>
            </view>
            <image v-else :src="sph.loading" class="loading"></image>
        </view>
    </view>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';

    export default {
        name: 'app-share-video-number',
        props: {
            title: {
                type: String,
                default() {
                    return '生成商品海报';
                }
            },
            isShow: {
                type: Boolean,
                default() {
                    return false
                }
            },
            goodsId: null
        },
        data() {
            return {
                article_url: '',
                number: 0,
                isLoading: false,
                interval: null,
            }
        },
        computed: {
            ...mapState({
                sph: state => state.mallConfig.__wxapp_img.sph,
            }),
        },
        watch: {
            isShow(newVal, oldVal) {
                if (newVal) {
                    this.addMaterial()
                }
            }
        },
        methods: {
            addMaterial() {
                uni.showLoading({title: '加载中'});
                this.$request({
                    url: this.$api.goods.addMaterial,
                    data: {
                        goods_id:this.goodsId
                    }
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        this.getArticleUrl(response.data.media_id);
                    } else {
                        this.showModal(response.msg, this.interval);
                    }
                }).catch(() => {

                });
            },
            getArticleUrl(mediaId) {
                this.article_url = '';
                this.isLoading = true;
                let interval = setInterval(()=> {
                    this.number++;

                    if (this.number > 15) {
                        this.showModal('获取视频号链接异常,请稍后重试', interval);
                    }

                    this.$request({
                        url: this.$api.goods.articleUrl,
                        data: {
                            media_id: mediaId
                        }
                    }).then(response => {
                        uni.hideLoading();
                        if (response.code === 0) {
                            this.article_url = response.data.url;
                            if (this.article_url) {
                                clearInterval(interval);
                            }
                        } else {
                            this.showModal(response.msg, interval);
                        }
                    });
                }, 1000)
                this.interval = interval;
            },
            showModal(msg, interval) {
                this.isLoading = false;
                this.number = 0;
                uni.showModal({
                    content: msg,
                    showCancel: false,
                    success: (() => {
                        this.close();
                    })

                });
                clearInterval(interval);
            },
            copyText() {
                this.$utils.uniCopy({
                    data: this.article_url,
                    success(){
                        uni.showToast({ title: '复制成功'});
                        this.close()
                    }
                });
            },
            close() {
                this.isLoading = false;
                clearInterval(this.interval);
                this.$emit('close', false);
            }
        }
    }
</script>


<style scoped lang="scss">
    .app-share-video-number {
        display: flex;
        justify-content: center;
        align-items: center;
        width: #{750rpx};
        height: 100%;
        z-index: 3000;
        position: fixed;
        left: 0;
	    top: 0;
        background-color: rgba(153, 153, 153, 0.5);

        .item {
            display: flex;
            align-items: center;
            flex-direction: column;
            width: #{622rpx};
            border-radius: #{16rpx};
            position: relative;
            background: #ffffff;

            .close {
                width: #{30rpx};
                height: #{30rpx};
                position: absolute;
                top: #{24rpx};
                right: #{24rpx};
            }

            .title {
                color: #353535;
                font-size: #{32rpx};
                margin: #{40rpx} 0;
            }

            .content {
                width: #{558rpx};
                height: #{82rpx};
                border-radius: #{16rpx};
                background: #f7f7f7;
                color: #353535;
                font-size: #{28rpx};
                padding: #{20rpx};
                margin: 0 #{30rpx} #{30rpx};
                overflow: hidden;
                display: inline-block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .copy {
                height: #{90rpx};
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: #{34rpx};
                color: #ff4544;
                border-top: #{1rpx} solid #e2e2e2;
            }

            .hint {
                text-align: center;
                margin: #{30rpx} 0;
            }

            .loading {
                width: #{150rpx};
                height: #{150rpx};
                margin-bottom: #{20rpx};
            }
        }
    }
</style>
