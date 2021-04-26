<template>
    <app-layout>
        <view>
            <app-details :detail-list="list" :is-show-share="true" :type="type"></app-details>
        </view>
    </app-layout>
</template>

<script>
    import appDetails from './app-details.vue';
    import {mapState} from "vuex";

    export default {
        components: {appDetails},
        data() {
            return {
                type: 0,
                id: 0,
                list: null,
            }
        },
        computed: {
            ...mapState({
                couponImg: state => state.mallConfig.__wxapp_img.coupon,
            })
        },
        methods: {
            getList(id) {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                let url = that.$api.coupon.detail;
                let para = {
                    coupon_id: id
                };
                if (this.type === 2) {
                    url = that.$api.coupon.user_coupon_detail;
                    para = {
                        user_coupon_id: id
                    };
                }
                that.$request({
                    url: url,
                    data: para
                }).then(response => {
                    that.$hideLoading();
                    if (response.code === 0) {
                        that.list = response.data.list;
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
        },
        onLoad(option) { this.$commonLoad.onload(option);
            this.id = option.id;
            this.getList(this.id);
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                title: this.list.app_share_title,
                imageUrl: this.list.app_share_pic ? this.list.app_share_pic : this.couponImg.img_coupon_2,
                path: '/pages/coupon/give/give',
                params: {
                    coupon_id: this.id
                }
            });
        }
        // #endif
    }
</script>

<style scoped lang="scss">
</style>
