<template>
    <view>
        <!--#ifndef MP-ALIPAY-->
        <ad v-if="type=== ``" :unit-id="unitId" @load="onAdLoad" @error="onAdError" @close="onAdClose" ad-intervals="0"/>
        <ad v-else-if="type === `video`" :unit-id="unitId" :ad-type="type" :ad-theme="theme" @load="onAdLoad" @error="onAdError" @close="onAdClose"/>
        <ad v-else-if="type === `grid`" :unit-id="unitId" :ad-theme="theme" :ad-type="type" @load="onAdLoad" @error="onAdError" @close="onAdClose" grid-opacity="0.8" grid-count="5"/>
        <!--#endif-->
        <!--#ifdef MP-WEIXIN-->
        <img v-else-if="type === `rewarded-video`" class="ad-img" @click="showRewardedVideoAd" :src="picUrl"/>
        <img v-else-if="type === `interstitial`" class="ad-img" @click="showInterstitialAd" :src="picUrl"/>
        <!--#endif-->
        <view v-if="type ===`before-video`" class="ad-video">
            <video :src="videoUrl" :ad-unit-id="unitId" :poster="picUrl" @adplay="onAdPlay" @adload="onAdLoad" @adclose="onAdClose" @aderror="onAdError"/>
        </view>
    </view>
</template>

<script>
    export default {
        name: "app-ad",
        props: {
            type: String,
            unitId: String,
            picUrl: String,
            videoUrl: String,
            // #ifndef MP-ALIPAY
            theme: {
                type: String,
                default() {
                    return 'white';
                }
            },
            //#endif
            //#ifdef MP-WEIXIN
            couponUrl: String,
            couponParams: Object,
            //#endif
        },
        //#ifdef MP-WEIXIN
        data() {
            return {
                //单屏问题
                rewardedVideoAd: null,
                interstitialAd: null
            }
        },
        //#endif
        //#ifdef MP-WEIXIN
        created: function () {
            this.init();
        },
        //#endif
        methods: {
            onAdLoad() {},
            onAdPlay() {},
            onAdClose() {},
            onAdError() {},
            //#ifdef MP-WEIXIN
            init: function () {
                switch (this.type) {
                    case 'rewarded-video':
                        this.initRewardedVideoAd();
                        break;
                    case 'interstitial':
                        this.initInterstitialAd();
                        break;
                    default:
                        break;
                }
            },
            //#endif
            //#ifdef MP-WEIXIN
            initRewardedVideoAd: function () {
                if (wx.createRewardedVideoAd) {
                    this.rewardedVideoAd = wx.createRewardedVideoAd({adUnitId: this.unitId});
                    this.rewardedVideoAd.onClose((res) => {
                        if (res && res.isEnded) {
                            this.getUserCoupon();
                        }
                    });
                }
            },
            //#endif
            //#ifdef MP-WEIXIN
            initInterstitialAd: function () {
                if (wx.createInterstitialAd) {
                    this.interstitialAd = wx.createInterstitialAd({adUnitId: this.unitId});
                }
            },
            //#endif
            //#ifdef MP-WEIXIN
            showRewardedVideoAd: function () {
                this.rewardedVideoAd.show().catch(() => {
                    this.rewardedVideoAd.load().then(() => this.rewardedVideoAd.show()).catch(err => {
                        uni.showToast({title: err.errMsg, icon: 'none'});
                    })
                });
            },
            //#endif
            //#ifdef MP-WEIXIN
            showInterstitialAd: function () {
                this.interstitialAd.show().catch((err) => {
                    uni.showToast({title: err.errMsg, icon: 'none'});
                });
            },
            //#endif
            //#ifdef MP-WEIXIN
            getUserCoupon() {
                this.$request({
                    url: this.couponUrl,
                    method: 'POST',
                    data: Object.assign({}, this.couponParams)
                }).then(info => {
                    if (info.code === 0) {
                        this.$store.dispatch('page/actionSetCoupon', {
                            list: info.data.list,
                            type: 'award'
                        })
                    } else {
                        uni.showToast({title: info.msg, icon: 'none'});
                    }
                })
            },
            //#endif
        }
    }
</script>

<style scoped lang="scss">
    //#ifdef MP-WEIXIN
    .ad-img {
        display: block;
        height: 139px;
        width: 100vw;
    }
    //#endif
    .ad-video {
        height: 230px;
        width: 100vw;

        video {
            height: 100%;
            width: 100%;
        }
    }
</style>