<template>
  <app-layout>
        <view class="page-width share" :class="[`${theme}-background`]" v-if="loading">

            <!-- 标题 -->
            <view class="page-width ready-send">
                <share-gift-text
					big="礼物准备完毕，送出去吧"
					small="记得提醒收礼人填写地址哦"
				></share-gift-text>
            </view>

            <!-- 内容 -->
            <view class="page-width gift-content">
                <gift-content
                    v-on:share="setShare"
                    :theme="theme"
                    :big_gift_pic="big_gift_pic"
                    :nickname="gift_detail.list.user.nickname"
                    :avatar="gift_detail.list.user.userInfo.avatar"
                    :bless_word="gift_detail.list.bless_word"
                    :is_big_gift="gift_detail.is_big_gift"
                    :cover_pic="gift_detail.list.sendOrder[0].detail[0].goods.goodsWarehouse.cover_pic"
                    :name="gift_detail.list.sendOrder[0].detail[0].goods.goodsWarehouse.name"
                    :refund_time="gift_detail.refund_time"
                    :bless_music="gift_detail.list.bless_music"
                    :is_play="is_play"
                    @play="play"
                ></gift-content>
            </view>
	        
	        <!-- 分享海报 -->
	        <view class="page-width share-poster">
		        <app-share-qr-code-poster @share="hShareAppMessage" sign="gift" :theme="theme" :url="url" v-model="share"></app-share-qr-code-poster>
	        </view>
	        
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from 'vuex';
    import shareGiftText from '../components/announcement/share-gift-text.vue';
    import giftContent from '../components/share/gift-content.vue';
	import appShareQrCodePoster from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue'
    
    export default {
        name: 'share',

        data() {
            return {
                gift_id: -1,
                gift_detail: {},
                share: false,
                url: ``,
	            loading: false,
                is_play: false,
                innerAudioContext: ''
            }
        },

	    onLoad(options) { this.$commonLoad.onload(options);
            if (JSON.parse(options.pay_data).gift_id) {
                this.gift_id = JSON.parse(options.pay_data).gift_id;
                this.request(JSON.parse(options.pay_data).gift_id);
                this.$storage.removeStorageSync('GIFT_CART');
                let self = this;
                this.innerAudioContext = uni.createInnerAudioContext();
                this.innerAudioContext.autoplay = true;
                this.innerAudioContext.onEnded(function(res) {
                    self.is_play = false;
                });
            } else {
                uni.redirectTo({
                    url: '/plugins/gift/index/index',
                })
            }
	    },
        // #ifdef MP
        onShareAppMessage() {
            return this.hShareAppMessage();
        },
        // #endif
        methods: {
            hShareAppMessage(s = false){
                return this.$shareAppMessage({
                    path: '/plugins/gift/index/index',
                    imageUrl: this.gift_detail.is_big_gift === 0 ? this.gift_detail.list.sendOrder[0].detail[0].goods.goodsWarehouse.cover_pic : this.big_gift_pic,
                    // #ifdef MP-ALIPAY
                    bgImgUrl: this.gift_detail.is_big_gift === 0 ? this.gift_detail.list.sendOrder[0].detail[0].goods.goodsWarehouse.cover_pic : this.big_gift_pic,
                    // #endif
                    params: {
                        gift_id: this.gift_id,
                    },
                    title: this.gift_detail.list.bless_word,
                }, s);
            },
            async request(gift_id) {
                this.$utils.showLoading();
                const res = await this.$request({
	                url: this.$api.gift.gift,
	                method: 'get',
	                data: {
                        gift_id: gift_id
	                }
                });
                this.$utils.hideLoading();
                if (res.code === 0) {
                    this.url = `${this.$api.gift.poster}&gift_id=${gift_id}`;
                    this.gift_detail = res.data;
                    this.loading = true;
                } else {
                    uni.showModal({
	                    title: '提示',
	                    content: res.msg,
                    })
                }
            },

            setShare() {
                this.share = true;
            },

            play(status, bless_music) {
                 this.is_play = status;
				if (status) {
					this.innerAudioContext.src = bless_music;
                    this.innerAudioContext.play();
				} else {
					this.innerAudioContext.stop();
				}
            }
        },

        computed: {
            ...mapState('gift',{
                theme: state => state.theme,
                big_gift_pic: state => state.big_gift_pic,
            })
        },

        onHide() {
			this.is_play = false;
            this.innerAudioContext.stop();
		},

        components: {
            'share-gift-text': shareGiftText,
            'gift-content': giftContent,
	        'app-share-qr-code-poster': appShareQrCodePoster,
        },
    }
</script>

<style scoped lang="scss">
	@import '../css/gift.scss';

    .share {
        position: absolute;
        height: 100%;
        overflow: hidden;
    }

    .gift-content {
        height: calc(100% - #{104upx});
        margin-top: #{104upx};
    }

</style>