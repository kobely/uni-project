<template>
    <view class="page">
        <view class="view" v-if="list">
            <view class='card'>
                <image class='card-img' :src='list.pic_url'></image>
                <view class='card-name'>{{list.card_name}}</view>
                <view class="dir-left-nowrap main-center" v-if="list.status == 0">
                    <view class="over over-lg dir-left-nowrap cross-top box-grow-0">
                        <image src="/static/image/icon/icon_ok.png" class="icon_ok box-grow-0"></image>
                        <view class="box-grow-1" style="height: 100%;">
                            <view>已转赠给：{{list.receive_user_name}}</view>
                        </view>
                        <image :src="cardImg.img_seal" class="img_seal"></image>
                    </view>
                </view>
                <view class="qr" v-else-if="list.status == 1">
                    <view class="give-btn" :style="{'color': theme.color, 'border-color': theme.border}"
                        v-if="list.is_allow_send == 1"
                          @click="shareShow = true">转赠
                    </view>
                    <image :src='file_path' v-if="list.is_use === 0"></image>
                    <view>
                        <app-share-qr-code v-model="shareShow" title="生成卡券海报"
                                           @share="testShare"
                                           :poster-url="`/pages/poster/poster?card_id=` + list.id"
                                           :has-poster-nav="true" :is-show-friend="list.is_allow_send == 1"
                        ></app-share-qr-code>
                    </view>
                </view>
                <view class="over" v-else-if="list.status == 2">已使用</view>
                <view class="over" v-else>已过期</view>
            </view>
            <view class='line'>
                <image src='/static/image/icon/line.png'></image>
            </view>
            <view class='explain use-time' v-if="list.is_show_history">
                <view class='explain-title'>核销时间</view>
                <view class="clerk-history">
                    <view>{{list.clerked_at}}</view>
                    <view @click="isShow = true" class="history-button">查看历史</view>
                </view>
            </view>
            <view class='explain use-time'>
                <view class='explain-title'>有效时间</view>
                <view>{{list.start_time}} - {{list.end_time}}</view>
            </view>
            <view class='explain card-info'>
                <view class='explain-title'>使用说明</view>
                <view>
                    <text style="word-break: break-all;">{{list.content}}</text>
                </view>
            </view>
            <view class='explain card-info-2'>
                <view class='explain-title'>核销信息</view>
                <view class="clerk-info">
                    <view class="clerk-item">
                        <view>剩余次数：</view>
                        <view>{{list.number - list.use_number}}次</view>
                    </view>
                    <view class="clerk-item">
                        <view>已核销次数：</view>
                        <view>{{list.use_number}}次</view>
                    </view>
                    <view class="clerk-item">
                        <view>总次数：</view>
                        <view>{{list.number}}次</view>
                    </view>
                </view>
            </view>
        </view>
        <app-clerk-historys v-if="list.id" :user-card-id="list.id" :is-show.sync="isShow"></app-clerk-historys>
    </view>
</template>

<script>
    import {mapState} from "vuex";
    import {mapGetters} from "vuex";
    import appClerkHistorys from '../../../components/page-component/app-clerk-historys/app-clerk-historys.vue';
    import appShareQrCode
        from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';

    export default {
        name: "app-card-detail",
        components: {appClerkHistorys, appShareQrCode},
        props: {
            list: {
                type: Object | null,
                default() {
                    return null
                }
            },
        },
        data() {
            return {
                isShow: false,
                shareShow: false,
                file_path: '',
            }
        },
        computed: {
            ...mapState({
                cardImg: state => state.mallConfig.mall.card,
            }),
            ...mapGetters('mallConfig', {
                theme: 'getTheme',
            }),
        },
        methods: {
            testShare(e){
                this.$emit('share',e);
            },
        },
        watch: {
            list() {
                if (this.list.status == 1) {
                    this.$request({
                        url: this.$api.card.qrcode,
                        data: {
                            cardId: this.list.id,
                        },
                    }).then(response=>{
                        if(response.code === 0) {
                            this.file_path = response.data.file_path;
                        }else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000,
                            });
                        }
                    }).catch(() => {
                    });
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .page {
        min-height: 100vh;
        background-color: #ff7b33;
        width: 100%;
    }

    .view {
        background-color: #ff7b33;
        padding: #{72rpx} #{24rpx};
        position: relative;
    }

    .card {
        background-color: #fff;
        border-top-left-radius: #{16rpx};
        border-top-right-radius: #{16rpx};
        padding: #{90rpx} #{40rpx} #{24rpx};
    }

    .card-info {
        background-color: #fff;
    }

    .card-img {
        position: absolute;
        top: #{32rpx};
        left: 50%;
        margin-left: #{-44rpx};
        height: #{88rpx};
        width: #{88rpx};
        border-radius: 50%;
    }

    .card-name {
        text-align: center;
        font-size: #{50rpx};
        margin-bottom: #{31rpx};
        color: #353535;
    }

    .over {
        width: #{240rpx};
        height: #{64rpx};
        text-align: center;
        color: #999;
        font-size: #{30rpx};
        line-height: #{64rpx};
        border-radius: #{32rpx};
        background-color: #f7f7f7;
        margin: 0 auto;
    }

    .line {
        height: #{48rpx};
        width: 100%;
    }

    .line image {
        height: 100%;
        width: 100%;
    }

    .explain {
        background-color: #fff;
        padding: #{20rpx} #{40rpx};
        font-size: #{28rpx};
        color: #353535;
    }

    .explain.use-time {
        padding-bottom: #{20rpx};
    }

    .explain-title {
        font-size: #{26rpx};
        color: #999;
        margin-bottom: #{15rpx};
    }

    .qr {
        width: #{400rpx};
        display: block;
        margin: 0 auto;
    }

    .qr image {
        height: #{400rpx};
        width: 100%
    }

    .clerk-info {
        display: flex;
        flex-direction: column;

        .clerk-item {
            display: flex;
        }
    }

    .card-info-2 {
        background-color: #fff;
        border-bottom-left-radius: #{16rpx};
        border-bottom-right-radius: #{16rpx};
        padding-bottom: 60#{rpx};
    }

    .clerk-history {
        display: flex;
        align-items: center;

        .history-button {
            width: 125#{rpx};
            height: 48#{rpx};
            border-radius: 30#{rpx};
            margin-left: 10#{rpx};
            font-size: #{22rpx};
            color: #ac450d;
            background: #ffeda9;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .over.over-lg {
        width: auto;
        padding: #{0 34rpx};
        height: auto;
        margin: 0;
        max-width: 100%;
    }

    .over .icon_ok {
        width: #{32rpx};
        height: #{32rpx};
        margin-right: #{15rpx};
        margin-top: #{15rpx};
    }

    .give-btn {
        width: #{240rpx};
        height: #{64rpx};
        line-height: #{64rpx};
        border-radius: #{32rpx};
        border: #{1rpx solid};
        text-align: center;
        transform: rotateZ(360deg);
        margin: #{0 auto 46rpx auto};
    }

    .img_seal {
        position: absolute;
        bottom: #{132rpx};
        right: #{84rpx};
        width: #{150rpx};
        height: #{117rpx};
        display: block;
    }
</style>

