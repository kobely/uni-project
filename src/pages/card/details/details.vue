<template>
    <app-layout>
        <view>
            <app-card-detail @share="hShareAppMessage" :list="list"></app-card-detail>
        </view>
    </app-layout>
</template>

<script>
    import appCardDetail from '../components/app-card-detail.vue';
    import {mapState} from "vuex";

    export default {
        components: {appCardDetail},
        data() {
            return {
                list: null,
            }
        },
        computed: {
            ...mapState({
                cardImg: state => state.mallConfig.__wxapp_img.card,
            })
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.hShareAppMessage();
        },
        // #endif
        methods: {
            hShareAppMessage(s = false) {
                return this.$shareAppMessage({
                    title: this.list.app_share_title ? this.list.app_share_title : '送你一张卡券，赶快来领取吧',
                    imageUrl: this.list.app_share_pic ? this.list.app_share_pic : this.cardImg.img_card_2,
                    path: '/pages/card/give/give',
                    params: {
                        card_id: this.list.id
                    }
                }, s);
            },
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
        },
    }
</script>
