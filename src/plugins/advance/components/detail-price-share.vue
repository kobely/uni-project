<template>
    <view class="detail-price-share" :style="{paddingBottom: level_show !== 2 ? '20rpx' : 0}">
        <view class="top dir-left-nowrap main-between">
            <view class="price">
                <view class="member-price" v-if="level_show == 1">
                    <view class="member dir-left-nowrap cross-bottom">
                        <text class="m-p" v-if="member_price_status === 0" :style="{'color': theme.color}">
                            <text class="symbol">￥</text>
                            {{group_min_member_price}}
                        </text>
                        <text class="m-p" v-if="member_price_status === 1" :style="{'color': theme.color}">
                            <text class="symbol">￥</text>
                            {{group_min_member_price}}-
                            <text class="symbol"></text>
                            {{group_max_member_price}}
                        </text>
                        <text class="logo" :style="{'background-color': theme.background_o,'color': theme.color}"
                              style="margin-bottom: 8upx;">会员价
                        </text>
                        <app-sup-vip :is_vip_card_user="is_vip_card_user" margin="0 0 8rpx 10rpx" v-if="discount"
                                     :discount="discount"></app-sup-vip>
                    </view>
                    <view class="yushou">
                        <text class="p" :style="{'color': theme.color}" v-if="status === 0">
                            <text class="symbol">￥</text>
                            {{price_min}}
                        </text>
                        <text class="p" :style="{'color': theme.color}" v-if="status === 1">
                            <text class="symbol">￥</text>
                            {{price_min}}-
                            <text class="symbol"></text>
                            {{price_max}}
                        </text>
                        <text class="p-t" :style="{'color': theme.color}">预售价</text>
                        <text class="ori" v-if="isUnderlinePrice == 1">
                            ￥{{original_price}}
                        </text>
                    </view>
                </view>

                <view v-if="level_show == 2 || level_show == 0" class="dir-left-nowrap cross-bottom">
                    <text class="presale" :style="{'color': theme.color}" v-if="status === 0">
                        <text class="symbol">￥</text>
                        {{price_min}}
                    </text>
                    <text class="presale" :style="{'color': theme.color}" v-if="status === 1">
                        <text class="symbol">￥</text>
                        {{price_min}}-
                        <text class="symbol"></text>
                        {{price_max}}
                    </text>
                    <text style="margin-bottom: 8upx;" :style="{'color': theme.color}" class="title">预售价</text>
                    <app-sup-vip :is_vip_card_user="is_vip_card_user" margin="0 0 8rpx 10rpx" v-if="discount"
                                 :discount="discount"></app-sup-vip>
                </view>
                <view class="original-price" v-if="(level_show == 2 || level_show === 0) && isUnderlinePrice == 1">
                    ￥{{original_price}}
                </view>
            </view>
            <view class="share dir-top-nowrap main-between">
                <view @click="share_show"  :style="{'background-color': theme.background}" class="bd-share-box dir-left-nowrap main-center cross-center">
                    <image class="bd-icon box-grow-0" src="/static/image/icon/icon-share-white.png"></image>
                    <text class="bd-text box-grow-0">分享</text>
                </view>
            </view>
        </view>
        <view class="bottom">
            <view>
                <text class="des" :style="{'color': theme.color}" v-if="de_status === 0 && swell_status === 0">
                    定金￥{{de_price}}抵￥{{swell_price}}
                </text>
                <text class="des" :style="{'color': theme.color}" v-if="de_status === 1 && swell_status === 0">
                    定金￥{{de_price_min}}-{{de_price_max}}抵￥{{swell_price}}
                </text>
                <text class="des" :style="{'color': theme.color}" v-if="de_status === 1 && swell_status === 1">
                    定金￥{{de_price_min}}-{{de_price_max}}抵￥{{swell_price_min}}-{{swell_price_max}}
                </text>
                <text class="des" :style="{'color': theme.color}" v-if="de_status === 0 && swell_status === 1">
                    定金￥{{de_price}}抵￥{{swell_price_min}}-{{swell_price_max}}
                </text>
            </view>
            <view class="time">
                尾款支付时间：{{set_time}}
            </view>
        </view>
        <view>
            <app-share-qr-code v-model="shareShow"
                               :url="url"
                               :has-poster-nav="hasPosterNav"
                               :poster-config="posterConfig"
                               :poster-generate="posterGenerate"
                               :goods="goods"
                               @share="shareAppMessage"
            ></app-share-qr-code>
        </view>
    </view>
</template>

<script>
    import appShareQrCode from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
    import {mapGetters, mapState} from 'vuex';

    export default {
        name: "detail-price-share",
        data() {
            return {
                price: 0,
                status: 0,
                de_price: 0,
                de_status: 0,
                swell_price: 0,
                swell_status: 0,
                de_price_min: 0,
                de_price_max: 0,
                swell_price_min: 0,
                swell_price_max: 0,
                shareShow: false,
                member_price_min: 0,
                member_price_max: 0,
                member_price_status: 0,
                start_end: '',
            }
        },
        props: {
            price_min: Number,
            price_max: Number,
            attr: Array,
            original_price: String,
            url: String,
            level_show: Number,
            group_min_member_price: Number,
            group_max_member_price: Number,
            end_prepayment_at: String,
            pay_limit: Number,
            cats: Array,
            goodsId: Number,
            discount: {
                type: String
            },
            is_vip_card_user: {
                type: Number,
                default() {
                    return 0;
                }
            },
            theme: Object,
            posterConfig: String,
            posterGenerate: String,
            hasPosterNav: {
                type: Boolean,
                default() {
                    return false
                },
            },
            goods:Object

        },
        mounted() {
            if (this.price_min === this.price_max) {
                this.status = 0;
            } else {
                this.status = 1;
            }
            let deposit = [];
            let swell_deposit = [];
            for (let i = 0; i < this.attr.length; i++) {
                deposit.push(this.attr[i].deposit);
                swell_deposit.push(this.attr[i].swell_deposit);
            }
            let max = Math.max.apply(null, deposit);
            let min = Math.min.apply(null, deposit);
            let swell_max = Math.max.apply(null, swell_deposit);
            let swell_min = Math.min.apply(null, swell_deposit);
            if (max === min) {
                this.de_price = min;
                this.de_status = 0;
            } else {
                this.de_status = 1;
                this.de_price_min = min;
                this.de_price_max = max;
            }
            if (swell_min === swell_max) {
                this.swell_price = swell_min;
                this.swell_status = 0;
            } else {
                this.swell_status = 1;
                this.swell_price_min = swell_min;
                this.swell_price_max = swell_max;
            }
            if (this.group_min_member_price === this.group_max_member_price) {
                this.member_price_status = 0;
            } else {
                this.member_price_status = 1;
            }
        },
        computed: {
            set_time() {
                if (this.pay_limit === -1) {
                    return `${this.getDate(this.end_prepayment_at)} ~ 无期限`
                } else {
                    this.addDate(this.end_prepayment_at, this.pay_limit);
                    return `${this.getDate(this.end_prepayment_at)} ~ ${this.addDate(this.end_prepayment_at, this.pay_limit)}`
                }
            },
            ...mapGetters('mallConfig', {
                vip: 'getVip'
            }),
            ...mapState({
                mall: state => state.mallConfig.mall,
                isUnderlinePrice: state => state.mallConfig.mall.setting.is_underline_price,
            })
        },
        methods: {
            shareAppMessage(s){
                this.$emit('share', s);
            },
            addDate(date, days) {
                if (days == undefined || days == '') {
                    days = 1;
                }
                var date = new Date(date.replace(/-/g, '/'));
                date.setDate(date.getDate() + days);
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let mm = "'" + month + "'";
                let dd = "'" + day + "'";
                if (mm.length == 3) {
                    month = "0" + month;
                }
                if (dd.length == 3) {
                    day = "0" + day;
                }
                let hour = date.getHours();//得到小时
                let minu = date.getMinutes();//得到分钟
                let sec = date.getSeconds();//得到秒
                if (sec === 0) {
                    sec = 59;
                    if (minu === 0) {
                        minu = 59;
                        if (hour === 0) {
                            hour = 23;
                            day = '0' + Number(day) - 1;
                        } else {
                            hour = hour - 1;
                        }
                    } else {
                        minu = minu - 1;
                    }
                } else {
                    sec = sec - 1;
                }
                sec = `${sec}`;
                minu = `${minu}`;
                hour = `${hour}`;
                if (hour.length === 1) {
                    hour = `0${hour}`
                }
                if (minu.length === 1) {
                    minu = `0${minu}`
                }
                if (sec.length === 1) {
                    sec = `0${sec}`
                }
                let time = date.getFullYear() + "." + month + "." + day + ' ' + hour + ':' + minu + ':' + sec;
                return time;
            },
            getDate(end_prepayment_at) {
                let newDate = new Date(end_prepayment_at.replace(/-/g, '/'));
                newDate.setDate(newDate.getDate());
                let month = newDate.getMonth() + 1;
                let day = newDate.getDate();
                let mm = "'" + month + "'";
                let dd = "'" + day + "'";
                let hour = newDate.getHours();//得到小时
                let minu = newDate.getMinutes();//得到分钟
                let sec = newDate.getSeconds();//得到秒
                sec = `${sec}`;
                minu = `${minu}`;
                hour = `${hour}`;
                if (mm.length == 3) {
                    month = "0" + month;
                }
                if (dd.length == 3) {
                    day = "0" + day;
                }
                if (hour.length === 1) {
                    hour = `0${hour}`
                }
                if (minu.length === 1) {
                    minu = `0${minu}`
                }
                if (sec.length === 1) {
                    sec = `0${sec}`
                }
                let time = newDate.getFullYear() + "." + month + "." + day + ' ' + hour + ':' + minu + ':' + sec;
                return time;
            },
            share_show() {
                if (this.$user.isLogin()) {
                    this.shareShow = true;
                } else {
                    this.$user.getInfo();
                }
            },
        },
        components: {
            'app-share-qr-code': appShareQrCode
        }
    }
</script>

<style scoped lang="scss">
    .detail-price-share {
        padding: #{18rpx 20rpx 20rpx 20rpx};
        background-color: #ffffff;
        width: 702upx;
        margin: 0 24upx;
        .presale {
            font-size: #{56rpx};
            margin-right: #{16rpx};
            font-family: DIN;
            text-align: end;

            .symbol {
                font-size: #{32rpx};
            }
        }

        .title {
            font-size: #{28rpx};
        }

        .des {
            font-size: #{26rpx};
            line-height: #{26rpx};
        }

        .original-price {
            font-size: #{24rpx};
            color: #999999;
            margin-top: #{8rpx};
            text-decoration: line-through;
        }

        .share {
            margin-top: #{23rpx};
            height: #{80rpx};
            margin-right: #{-23rpx};
            padding: #{5rpx};

            .bd-share-box {
                height: #{48rpx};
                border-radius: #{40rpx} 0 0 #{40rpx};
                padding: 0 #{14rpx};
                width: #{103rpx};

                > image {
                    width: #{22rpx};
                    height: #{22rpx};
                }

                > text {
                    font-size: #{22rpx};
                    color: #ffffff;
                    margin-left: #{10rpx};
                }
            }
        }
    }

    .member-price {
        .symbol {
            font-size: #{23rpx};
        }

        .member {
            color: #f39800;
            font-family: DIN;

            .m-p {
                font-family: DIN;
                font-size: #{40rpx};
            }

            .logo {
                display: inline-block;
                font-size: #{20rpx};
                border: #{1rpx} solid;
                padding: #{2rpx 4rpx};
                margin-left: #{12rpx};
                border-radius: #{8rpx};
                margin-bottom: #{5rpx};
            }
        }

        .yushou {
            .p {
                font-size: #{26rpx};
                font-family: DIN;
            }

            .p-t {
                font-size: #{26rpx};
                margin-left: #{8rpx};
            }
        }

        .ori {
            text-decoration: line-through;
            color: #999999;
            font-size: #{24rpx};
            margin-left: #{16rpx};
        }
    }

    .time {
        font-size: #{22rpx};
        color: #999999;
    }
</style>