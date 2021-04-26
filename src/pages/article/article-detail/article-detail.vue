<template>
    <app-layout>
        <view class="page">
            <app-rich-text background="#ffffff" :loading="loading" :content="list.content"></app-rich-text>
        </view>
    </app-layout>
</template>

<script>
    import appRichText from "../../../components/basic-component/app-rich/parse.vue";

    import { mapState } from "vuex";

    export default {
        data() {
            return {
                page: 2,
                loading: true,
                list: {
                	content: ' '
                }
            }
        },
        components: {
            appRichText,
        },
        methods: {
            getList() {
                let that = this;
                this.$request({
                    url: that.$api.article.detail,
		            data: {
		                article_id: that.id
		            },
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
            			that.loading = false;
                        that.list = response.data.article;
                        setTimeout(function(){
                            uni.setNavigationBarTitle({
                                title: that.list.title
                            });
                        },0)
                    }
                }).catch(e => {
                    that.$hideLoading();
                });
            },
        },
        onLoad(option) { this.$commonLoad.onload(option);
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.id = option.id;
            this.getList();
            this.$store.dispatch('gConfig/setImageWidth', 48);
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: this.list.title,
                path: "/pages/article/article-detail/article-detail",
                params: {
                    id: this.id
                }
            });
        }
        // #endif
    }
</script>

<style scoped lang="scss">
    .page {
        padding: 0 #{24rpx};
        position: absolute;
        top: 0;
        left: 0;
        min-height: 100%;
        width: 100%;
        background-color: #ffffff;
    }
</style>