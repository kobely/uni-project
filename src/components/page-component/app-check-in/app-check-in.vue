<template>
    <view class="app-check-in dir-left-nowrap" :class="'main-' + textPosition" :style="{backgroundImage: `url(`+backgroundPicUrl+`)`}">
        <app-hotspot :hotspot="hotspot">
            <view @click='checkIn' style="width:100%;height:100%;"></view>
        </app-hotspot>
        <view class="dir-top-nowrap main-center" v-if="userInfo.check_in && showText" :style="{color:textColor,textAlign: textPosition}">
            <view class="box-grow-0 first">今天签到可获得{{userInfo.check_in.todayAward}}</view>
            <view class="box-grow-0 second">已连续签到{{userInfo.check_in.continue}}天</view>
        </view>
    </view>
</template>

<script>
    import {mapGetters} from 'vuex';
    import appHotspot from '../../basic-component/app-hotspot/app-hotspot.vue';
    import checkInAward from './check-in-award.js';

    export default {
        name: "app-check-in",
        components: {
            'app-hotspot': appHotspot
        },
        props: {
            backgroundPicUrl: {
                type: String,
                default() {
                    return '';
                }
            },
            hotspot: {
                type: Object,
                default() {
                    return {};
                }
            },
            showText: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            textColor: String,
            textPosition: String,
        },
        computed: {
            ...mapGetters({
                userInfo: 'user/info',
            })
        },
        methods: {
            checkIn() {
                uni.showLoading({
                    title: '签到中'
                });
                checkInAward.getAward(1, 1).then(result => {
                    uni.hideLoading();
                    uni.showToast({
                        title: '签到成功',
                        icon: 'success',
                        mask: false
                    });
                    this.$store.dispatch('user/info');
                }).catch(e => {
                    uni.hideLoading();
                    uni.showToast({
                        title: e,
                        mask: false,
                        icon: 'none'
                    })
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-check-in {
        width: 100%;
        height: #{200rpx};
        padding: 0 #{50rpx};
        position: relative;

        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
    }
</style>