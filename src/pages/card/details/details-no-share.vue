<template>
    <app-layout>
        <view>
            <app-card-detail :list="list"></app-card-detail>
        </view>
    </app-layout>
</template>

<script>
    import appCardDetail from '../components/app-card-detail.vue';

    export default {
        components: {appCardDetail},
        data() {
            return {
                list: null,
            }
        },
        methods: {
            getList(id) {
                let that = this;
                that.$showLoading({
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.card.detail,
                    data: {
                        cardId: id,
                    },
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code === 0) {
                        that.list = response.data.card;
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000,
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.getList(options.id);
        }
    }
</script>
