<template>
    <app-layout>
        <view v-if="type === 'give'">
            <app-card-give :card="card" @receive="receive"></app-card-give>
        </view>
        <view v-if="type === 'detail'">
            <app-card-detail @share="hShareAppMessage" :list="card"></app-card-detail>
        </view>
    </app-layout>
</template>

<script>
    import {mapState} from "vuex";
    import appCardGive from '../components/app-card-give.vue';
    import appCardDetail from '../components/app-card-detail.vue';

    export default {
        name: "give",
        components: {
            appCardGive,
            appCardDetail
        },
        data() {
            return {
                card: null,
                type: null,
            };
        },
        computed: {
            ...mapState({
                cardImg: state => state.mallConfig.__wxapp_img.card,
            })
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.loadData(options);
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.hShareAppMessage();
        },
        // #endif
        methods: {
            hShareAppMessage() {
                return this.$shareAppMessage({
                    title: this.card.app_share_title ? this.card.app_share_title : '送你一张卡券，赶快来领取吧',
                    imageUrl: this.card.app_share_pic ? this.card.app_share_pic : this.cardImg.img_card_2,
                    path: '/pages/card/give/give',
                    params: {
                        card_id: this.card.id
                    }
                });
            },
            loadData(options) {
                this.$showLoading();
                this.$request({
                    url: this.$api.card.give,
                    method: 'get',
                    data: {
                        cardId: options.card_id
                    }
                }).then(response => {
                    this.$hideLoading();
                    if (response.code === 0) {
                        let data = response.data;
                        this.type = data.type;
                        this.card = response.data;
                        let title = '';
                        if (data.type === 'give') {
                            title = '领取卡券'
                        } else {
                            title = '卡券详情'
                        }
                        uni.setNavigationBarTitle({
                            title: title,
                        });
                    }
                })
            },
            receive() {
                this.loadData({card_id: this.card.id})
            }
        },
    }
</script>

<style scoped lang="scss">
</style>
