<template>
    <app-layout>
        <scroll-view scroll-y :style="{'height':`${windowHeight}px`}">
            <view class="app-goods" v-show="loading">
                <view class="banner">
                    <app-banner
                        :videoUrl="goods.video_url"
                        :picList="goods.pic_list"
                        :goods_id="goods.id"
                        :isCart="false"
                        sign="exchange"
                    ></app-banner>
                </view>
                <view class="other-info">
                    <view class="t-omit-two goods-name">{{goods.name}}</view>
                    <view class="code" :style="{'color': status == 'unused' ? getTheme.color : '#999999','background-color': status == 'unused' ? getTheme.background_o : '#f5f5f5'}">{{code}}</view>
                    <view v-if="status == 'unused'" class="app-share">
                        <app-form-id @click="shareShow = true">
                            <image class="app-icon" src="../../../static/image/icon/icon-share.png"></image>
                            <text class="app-text">赠送</text>
                        </app-form-id>
                    </view>
                </view>
                <app-share-qr-code v-model="shareShow"
                                   :url="url"
                                   title="生成赠送海报"
                                   :goods="goods"
                                   @share="hShareAppMessage"
                                   :theme="getTheme"
                                   :has-poster-nav="false"
                ></app-share-qr-code>
                <!-- 商品详情 -->
                <bd-detail :detail="goods.detail"></bd-detail>
                <!-- 底部空格 -->
                <view class="safe-area-inset-bottom">
                    <view class="u-bottom-height"></view>
                </view>
                <!-- 底部按钮 -->
                <view class="safe-area-inset-bottom u-bottom-fixed">
                    <view class="buttons dir-left-nowrap">
                        <view class="app-button main-center cross-center">
                            <view @click="copy" v-if="status == 'unused'" class="app-exhange" :style="{'background': getTheme.background_s_gradient_o,'color': getTheme.secondary_text}">
                                复制兑换码
                            </view>
                            <view @click="toExchange" v-if="status == 'unused'" class="app-exhange" :style="{'background': getTheme.background_gradient_o,'color': getTheme.main_text}">
                                立即兑换
                            </view>
                            <view class="app-over" v-if="status != 'unused'">
                                {{status == 'used' ? '已兑换': '已失效'}}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appBanner from '../../../components/page-component/goods/app-goods-banner.vue';
    import appShareQrCode from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
    import bdDetail from '@/components/page-component/goods/bd-detail.vue';

    export default {
        name: 'goods',
        data() {
            return {
                shareShow: false,
                goods: {},
                url: this.$api.exchange.qrcode,
                show: false,
                list: [],
                code: null,
                id: null,
                status: '',
                windowHeight: 667,
                loading: false,
                first: true,
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.code = options.code;
            that.windowHeight = uni.getSystemInfoSync().windowHeight;
            that.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            that.request({
                url: that.$api.exchange.me_detail,
                data: {
                    code: that.code,
                }
            }).then(response => {
                if(response) {
                    that.first = false;
                    let { goods_attr, code,status } = response;
                    that.url = that.url + '&code=' + code;
                    that.goods = goods_attr;
                    that.code = code;
                    that.status = status;
                    that.loading = true;
                    that.$hideLoading();
                }
            });
        },
        onShow() {
            if(this.first) {
                return false
            }
            this.$showLoading();
            this.$nextTick(() => {
                let that = this;
                that.request({
                    url: that.$api.exchange.me_detail,
                    data: {
                        code: that.code,
                    }
                }).then(response => {
                    let { goods_attr, code,status } = response;
                    that.goods = goods_attr;
                    that.code = code;
                    that.status = status;
                    that.loading = true;
                    that.$hideLoading();
                });
            })
        },
        computed: {
            ...mapState('gConfig',{
                iphone: (data) => {
                    return data.iphone;
                },
                iphoneHeight: (state) =>{
                    return  state.iphoneHeight;
                },
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                mall: state => state.mallConfig.mall,
                userInfo: state => state.user.info
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
                    path: '/plugins/exchange/gift/gift',
                    title: this.goods.app_share_title ? this.goods.app_share_title : this.goods.name,
                    imageUrl: this.goods.app_share_pic ? this.goods.app_share_pic : '',
                    params: {
                        code: this.code,
                    }
                }, s);
            },
            copy() {
                this.$utils.uniCopy({
                    data: this.code,
                    success() {
                        //#ifndef MP-WEIXIN
                        uni.showToast({title: '复制成功'});
                        // #endif
                    },
                });
            },
            toExchange() {
                uni.navigateTo({
                    url: '/plugins/exchange/detail/detail?code=' + this.code
                })
            },
            async request({url, data}) {
                const response = await this.$request({
                    url: url,
                    data: data,
                });
                if (response.code === 0) {
                    return response.data;
                }else {
                    uni.showModal({
                        title: '提示',
                        content: response.msg,
                        showCancel: false,
                        success: function (res) {
                            uni.navigateBack();
                        }
                    });
                }
            }
        },
        components: {
            'app-banner': appBanner,
            'app-share-qr-code': appShareQrCode,
            bdDetail
        }
    }
</script>

<style scoped lang="scss">
    .other-info {
        background-color: #fff;
        padding-top: 24rpx;
        padding-bottom: 24rpx;
        margin-bottom: 24rpx;
        position: relative;
        .goods-name {
            font-size: #{32rpx};
            color: #353535;
            margin: 0 #{24rpx} #{50rpx};
        }
        .code {
            margin-left: 24rpx;
            display: inline-block;
            padding: 16rpx 46rpx;
            border-radius: 40rpx;
            font-size: 32rpx;
            font-weight: 600;
            &.default {
                background-color: #F5F5F5;
                color: #999999;
            }
        }
        .app-share {
            width: #{40rpx};
            height: #{102rpx};
            position: absolute;
            right: #{24rpx};
            bottom: #{26rpx};
            .app-icon {
                width: #{40rpx};
                height: #{40rpx};
            }
            .app-text {
                color: #666666;
                font-size: #{20rpx};
                position: absolute;
                top: #{50rpx};
                left: 0;
            }
        }
    }

    .app-goods {
        background-color: #f7f7f7;
    }
    .buttons {
        width: #{750rpx};
        height: #{110rpx};
        border-top: #{1rpx} solid #e2e2e2;
        .app-button {
            width: 100%;
            height: #{110rpx};
            text-align: center;
            line-height: #{110rpx};
            background-color: #fff;
            .app-over {
                background: #e9e9e9;
                width: #{702rpx};
                border-radius: #{41rpx};
                color: #999999;
                height: #{82rpx};
                line-height: #{82rpx};
                font-size: #{28rpx};
            }
            .app-exhange {
                margin: 0 10rpx;
                width: 340rpx;
                border-radius: 41rpx;
                height: 82rpx;
                line-height: 82rpx;
                font-size: 28rpx;
            }
        }
    }
    .u-bottom-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1602;
        background-color: #ffffff;
    }
    .u-bottom-height {
        height: 110upx;
    }
</style>