<template>
    <app-layout>
        <view class="receive" :class="[`${theme}-background`]" v-if="loading">

            <!-- 分享礼物标题 -->
            <view class="share-gift-text">
                <share-gift-text
                    :big="big"
                    :small="small"
                ></share-gift-text>
            </view>

            <!-- 礼物内容 -->
            <view class="page-width receive-content">
                <receive-content
                    :theme="theme"
                    :big_gift_pic="big_gift_pic"
                    :small="small"
                    :status="status"
                    :is_status="gift_detail.status"
                    :nickname="gift_detail.list.user.nickname"
                    :type="gift_detail.list.type"
                    :name="gift_detail.list.sendOrder[0].detail[0].goods.goodsWarehouse.name"
                    :num="gift_detail.list.num"
                    :goods_info="gift_detail.list.sendOrder[0].detail[0].goods_info"
                    :cover_pic="gift_detail.list.sendOrder[0].detail[0].goods.goodsWarehouse.cover_pic"
                    :is_big_gift="gift_detail.is_big_gift"
                    :bless_word="gift_detail.list.bless_word"
                    :avatar="gift_detail.list.user.userInfo.avatar"
                    :userOrder="gift_detail.list.userOrder"
                    :winUser="gift_detail.list.winUser"
                    :open_type="gift_detail.list.open_type"
                    :open_status="gift_detail.open_status"
                    :gift_status="gift_status"
                    :gift_id="gift_detail.list.id"
                    :win_time="gift_detail.win_time"
                    :address_status="gift_detail.address_status"
                    :win_goods_status="gift_detail.win_goods_status"
                    :user_id="gift_detail.user_id"
                    :bless_music="gift_detail.list.bless_music"
                    :is_play="is_play"
                    @play="play"
                    @share="hShareAppMessage"
                ></receive-content>
            </view>

        </view>
    </app-layout>
</template>

<script>
import {mapState} from 'vuex';
import shareGiftText from '../components/announcement/share-gift-text.vue';
import receiveContent from '../components/receive/receive-content.vue';

export default {
    name: 'receive',

    data() {
        return {
            loading: false,
            big: "",
            small: "",
            status: '',
            gift_status: -1,
            gift_id: -1,
            gift_detail: {
                list: {
                    type: 'direct_open'
                }
            },
            is_play: false,
        }
    },

    onLoad(options) { this.$commonLoad.onload(options);
        this.gift_id = options.gift_id;
        this.gift_status = options.status;
        this.$store.dispatch('gift/getConfig', this.$api.gift.config);
        this.request();
        // #ifdef MP-ALIPAY || MP-WEIXIN
        uni.hideShareMenu();
        // #endif
        let self = this;
        this.innerAudioContext = uni.createInnerAudioContext();
        this.innerAudioContext.autoplay = true;
        this.innerAudioContext.onEnded(function (res) {
            self.is_play = false;
        });
        // #ifdef H5
        this.$shareAppMessage({
            path: '/plugins/gift/index/index',
            title: this.gift_detail.list.bless_word,
            params: {
                gift_id: this.gift_id,
            },
            imageUrl: this.gift_detail.is_big_gift === 0 ? this.gift_detail.list.sendOrder[0].detail[0].goods.goodsWarehouse.cover_pic : this.big_gift_pic,
        });
        // #endif
    },

    onHide() {
        this.is_play = false;
        this.innerAudioContext.stop();
    },
    // #ifdef MP
    onShareAppMessage() {
        return this.hShareAppMessage();
    },
    // #endif
    methods: {
        hShareAppMessage(s = false) {
            return this.$shareAppMessage({
                path: '/plugins/gift/index/index',
                title: this.gift_detail.list.bless_word,
                params: {
                    gift_id: this.gift_id,
                },
                // #ifdef MP-ALIPAY
                bgImgUrl: this.gift_detail.is_big_gift === 0 ? this.gift_detail.list.sendOrder[0].detail[0].goods.goodsWarehouse.cover_pic : this.big_gift_pic,
                // #endif
                imageUrl: this.gift_detail.is_big_gift === 0 ? this.gift_detail.list.sendOrder[0].detail[0].goods.goodsWarehouse.cover_pic : this.big_gift_pic,
            }, s);
        },
        async request() {
            this.$utils.showLoading();
            const res = await this.$request({
                url: this.$api.gift.gift,
                methods: 'get',
                data: {
                    gift_id: this.gift_id,
                }
            });
            this.$utils.hideLoading();

            this.gift_detail = res.data;

            if (this.gift_status != 0) {

                if (this.gift_detail.list.type === 'num_open') {
                    if (this.gift_detail.open_status === 0) {
                        this.big = '参与成功，等待开奖';
                        this.small = `满${this.gift_detail.list.open_num}人开奖`;
                    } else {
                        if (this.gift_detail.status === 0) {
                            this.big = '很遗憾，你未中奖';
                            this.status = '未中奖';
                        } else {
                            this.big = '恭喜你，中奖了';
                            this.status = '中奖了';
                        }
                    }
                } else if (this.gift_detail.list.type === 'time_open') {
                    if (this.gift_detail.open_status === 0) {
                        this.big = '参与成功，等待开奖';
                        let date = new Date(this.gift_detail.list.open_time.replace(/-/g, '/'));
                        let month = date.getMonth() + 1;
                        let day = date.getDate();
                        this.small = `${month > 10 ? month : '0' + month}月${day > 10 ? day : '0' + day}日 ${date.getHours()}:${date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()}:00 开奖`;
                    } else {
                        if (this.gift_detail.status === 0) {
                            this.big = '很遗憾，你未中奖';
                            this.status = '未中奖';
                        } else {
                            this.big = '恭喜你，中奖了';
                            this.status = '中奖了';
                        }
                    }
                } else if (this.gift_detail.list.type === 'direct_open') {
                    if (this.gift_detail.status === 1) {
                        this.big = '礼物领取成功';
                        this.status = '已领取';
                    } else {
                        this.big = '礼物已被抢光';
                        this.status = '已抢光';
                    }
                }
            } else {
                this.big = this.gift_detail.win_goods_name;
                if (this.gift_detail.list.type === 'time_open') {
                    let date = new Date(this.gift_detail.list.open_time.replace(/-/g, '/'));
                    this.small = `${date.getMonth() + 1 > 10 ? date.getMonth() + 1 : '0' + date.getMonth() + 1}月${date.getDate() > 10 ? date.getDate() : '0' + date.getDate()}日 ${date.getHours()}:${date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()}:00 开奖`;
                }
            }
            this.loading = true;
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
        ...mapState('gift', {
            theme: state => state.theme,
            big_gift_pic: state => state.big_gift_pic,
        }),
    },

    components: {
        'share-gift-text': shareGiftText,
        'receive-content': receiveContent,
    }

}
</script>

<style scoped lang="scss">

/* 首页 */
.receive {
    position: absolute;
    min-height: 100%;
    width: 100%;
    overflow: auto;
}


</style>