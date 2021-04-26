<template>
    <app-layout>
        <view class="tab-list">
            <view class="tab cross-center main-center">
                <view @click="toList">浏览记录</view>
                <view class="active">账单总结</view>
            </view>
        </view>
        <view @touchstart="start(1)" @touchmove="enter" @touchend="leave"  :class="[`list`,`${active == 1 ? 'active' : ''}`, `${last == 1 ? 'last' : ''}`]" :style="{'background-image': `url(${ttf.open_bg})`}">
            <view :style="{'zoom': indexRate}" style="height: 100%" class="show-icon first cross-center main-center">
                <image :style="{'width': `${size[1].width}`,'height':`${size[1].height}`}" @load="load(1,$event)" :src="ttf.index"></image>
            </view>
        </view>
        <view @touchstart="start(2)" @touchmove="enter" @touchend="leave"  :class="[`list`,`${active == 2 ? 'active' : ''}`, `${next == 2 ? 'next' : ''}`, `${last == 2 ? 'last' : ''}`]" :style="{'background-image': `url(${ttf.day_bg})`}">
            <view class="info cross-center dir-top-nowrap main-center" :style="{'font-size': rate*40 + 'rpx'}">
                <view>这是您在<text class="name" :style="{'font-size': rate*58 + 'rpx'}">{{mall.name}}</text></view>
                <view>的第<text class="day" :style="{'font-size': rate*95 + 'rpx'}">{{day}}</text>天</view>
            </view>
            <view :style="{'zoom': rate}" class="show-icon cross-center main-center">
                <image :style="{'width': `${size[2].width}`,'height':`${size[2].height}`}" @load="load(2,$event)" :src="ttf.day_icon"></image>
            </view>
        </view>
        <view @touchstart="start(3)" @touchmove="enter" @touchend="leave"  :class="[`list`,`${active == 3 ? 'active' : ''}`, `${next == 3 ? 'next' : ''}`, `${last == 3 ? 'last' : ''}`]" :style="{'background-image': `url(${ttf.total_bg})`}">
            <view class="info cross-center dir-top-nowrap main-center" :style="{'font-size': rate*40 + 'rpx'}">
                <view>截止到<text class="yesterday">{{yesterday}}</text></view>
                <view>您在本店共消费<text style="color: #fff7be">￥</text><text class="pay-price" :style="{'font-size': rate*95 + 'rpx'}">{{pay_price}}</text></view>
            </view>
            <view :style="{'zoom': rate}" class="show-icon cross-center main-center">
                <image :style="{'width': `${size[3].width}`,'height':`${size[3].height}`}" @load="load(3,$event)" :src="ttf.total"></image>
            </view>
        </view>
        <view @touchstart="start(4)" @touchmove="enter" @touchend="leave"  :class="[`list`,`${active == 4 ? 'active' : ''}`, `${next == 4 ? 'next' : ''}`, `${last == 4 ? 'last' : ''}`]" :style="{'background-image': `url(${ttf.buy_bg})`}">
            <view class="info cross-center dir-top-nowrap main-center" :style="{'font-size': rate*40 + 'rpx'}">
                <view>截止到<text class="yesterday" :style="{'font-size': rate*58 + 'rpx'}">{{yesterday}}</text></view>
                <view>您在本店共购买<text class="pay-price" :style="{'font-size': rate*95 + 'rpx'}">{{pay_num}}</text>件商品</view>
            </view>
            <view :style="{'zoom': rate}" class="show-icon cross-center main-center">
                <image :style="{'width': `${size[4].width}`,'height':`${size[4].height}`}" @load="load(4,$event)" :src="ttf.buy"></image>
            </view>
        </view>
        <view @touchstart="start(5)" @touchmove="enter" @touchend="leave"  :class="[`list`,`${active == 5 ? 'active' : ''}`, `${next == 5 ? 'next' : ''}`, `${last == 5 ? 'last' : ''}`]" :style="{'background-image': `url(${ttf.high_bg})`}">
            <view style="height: 20%" class="info cross-center dir-top-nowrap main-center" :style="{'font-size': rate*40 + 'rpx'}">
                <view>截止到<text class="yesterday" :style="{'font-size': rate*58 + 'rpx'}">{{yesterday}}</text></view>
                <view class="other" :style="{'margin': rate*30 + 'rpx 0 ' + rate*10 + 'rpx'}">您在本店的最高一次消费达到</view>
                <view><text style="color: #fff7be">￥</text><text class="pay-price" :style="{'font-size': rate*95 + 'rpx'}">{{highest_price}}</text></view>
            </view>
            <view :style="{'zoom': rate}" class="show-icon cross-center main-center">
                <image :style="{'width': `${size[5].width}`,'height':`${size[5].height}`}" @load="load(5,$event)" :src="ttf.high_icon"></image>
            </view>
        </view>
        <view @touchstart="start(6)" @touchmove="enter" @touchend="leave"  :class="[`list`,`${active == 6 ? 'active' : ''}`, `${next == 6 ? 'next' : ''}`, `${last == 6 ? 'last' : ''}`]" :style="{'background-image': `url(${ttf.coupon_bg})`}">
            <view style="height: 21%" class="info cross-center dir-top-nowrap main-center" :style="{'font-size': rate*40 + 'rpx'}">
                <view>截止到<text class="yesterday" :style="{'font-size': rate*58 + 'rpx'}">{{yesterday}}</text></view>
                <view>使用了<text class="yesterday" :style="{'font-size': rate*58 + 'rpx'}">{{coupon_num}}</text>张优惠券</view>
                <view>共计节省了<text style="color: #fff7be">￥</text><text class="pay-price" :style="{'font-size': rate*95 + 'rpx'}">{{coupon_discount_price}}</text></view>
            </view>
            <view :style="{'zoom': rate}" class="show-icon cross-center main-center">
                <image :style="{'width': `${size[6].width}`,'height':`${size[6].height}`}" @load="load(6,$event)" :src="ttf.coupon_icon"></image>
            </view>
        </view>
        <view v-if="userInfo.identity.member_level > 0 || userInfo.is_vip_card_user == 1" @touchstart="start(7)" @touchmove="enter" @touchend="leave"  :class="[`list`,`${active == 7 ? 'active' : ''}`, `${next == 7 ? 'next' : ''}`, `${last == 7 ? 'last' : ''}`]" :style="{'background-image': `url(${ttf.member_bg})`}">
            <view style="height: 20%" class="info cross-center dir-top-nowrap main-center" :style="{'font-size': rate*40 + 'rpx'}">
                <view>截止到<text class="yesterday" :style="{'font-size': rate*58 + 'rpx'}">{{yesterday}}</text></view>
                <view class="other" :style="{'margin': rate*30 + 'rpx 0 ' + rate*10 + 'rpx'}">您作为会员，比普通用户节省</view>
                <view><text style="color: #fff7be">￥</text><text class="pay-price" :style="{'font-size': rate*95 + 'rpx'}">{{member_discount_price}}</text></view>
            </view>
            <view :style="{'zoom': rate}" class="show-icon cross-center main-center">
                <image :style="{'width': `${size[7].width}`,'height':`${size[7].height}`}" @load="load(7,$event)" :src="ttf.member_icon"></image>
            </view>
        </view>
        <view @touchstart="start(8)" @touchmove="enter" @touchend="leave"  :class="[`list`,`${active == 8 ? 'active' : ''}`, `${next == 8 ? 'next' : ''}`, `${last == 8 ? 'last' : ''}`]" :style="{'background-image': `url(${ttf.buy_bg})`}">
            <view class="info cross-center dir-top-nowrap main-center" :style="{'font-size': rate*40 + 'rpx'}">
                <view class="other" :style="{'margin': rate*30 + 'rpx 0 ' + rate*10 + 'rpx'}">您的消费力度高于本店铺</view>
                <view><text class="pay-price" :style="{'font-size': rate*95 + 'rpx'}">{{percentageRate}}%</text>的客户</view>
            </view>
            <view class="show-icon cross-center main-center">
                <image :style="{'width': `${size[8].width}`,'height':`${size[8].height}`}" @load="load(8,$event)" :src="ttf.rate_icon"></image>
            </view>
        </view>
        <view class="text-info" v-if="active == 2">更多惊喜，接着往下看</view>
        <image class="page-down" v-if="active < 8" src="./../image/pgdn.gif"></image>
        <view class="more-menu cross-center main-center" v-if="active == 8">
            <image @click="toMall" src="./../image/to-index.png"></image>
            <image @click="openPoster" src="./../image/share.png"></image>
        </view>
        <view v-if="show" class="poster-dialog">
            <app-goods-preview-poster v-model="show" @close="show=false" :url="posterUrl"></app-goods-preview-poster>
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";
    import appGoodsPreviewPoster from '../../../components/page-component/goods/app-goods-preview-poster.vue';
    export default {
        data() {
            return {
                rate: 1,
                indexRate: 1,
                day: 0,
                posterUrl: this.$api.poster.footprint,
                coupon_discount_price: 0,
                coupon_num: 0,
                highest_price: 0,
                member_discount_price: 0,
                pay_num: 0,
                pay_price: 0,
                percentage: 0,
                percentageRate: 0,
                yesterday: '',
                active: 1,
                next: null,
                last: 0,
                height: 0,
                loading: false,
                show: false,
                list: [],
                size: [{width: '',height: ''},{width: '',height: ''},{width: '',height: ''},{width: '',height: ''},{width: '',height: ''},{width: '',height: ''},{width: '',height: ''},{width: '',height: ''},{width: '',height: ''}]
            }
        },
        components: {
            appGoodsPreviewPoster,
        },
        computed: {
            ...mapState({
                mall: state => state.mallConfig.mall,
                ttf: state => state.mallConfig.__wxapp_img.foot,
                userInfo: state => state.user.info,
            })
        },
        methods: {
            openPoster() {
                this.show = true;
            },
            toMall() {
                uni.reLaunch({
                    url: '/pages/index/index'
                });
            },
            close() {
                this.show = false;
            },
            start(num) {
                if(this.loading) {
                    return false
                }
                this.list = [];
                this.active = num;
            },
            enter(e) {
                if(this.loading) {
                    return false
                }
                this.list.push(e);
            },
            leave(e) {
                let that = this;
                if(that.loading) {
                    return false
                }
                setTimeout(v=>{
                    that.loading = true;
                    if(that.list.length > 0) {
                        if(+that.list[0].changedTouches[0].clientY - +that.list[that.list.length - 1].changedTouches[0].clientY > 30 && that.active < 8) {
                            setTimeout(v=>{
                                if(that.active == 6 && that.userInfo.identity.member_level == 0 && that.userInfo.is_vip_card_user == 0) {
                                    that.next = 8;
                                }else {
                                    that.next = that.active + 1;
                                }
                                if(that.active == 8 && that.userInfo.identity.member_level == 0 && that.userInfo.is_vip_card_user == 0) {
                                    that.last = 6;
                                }else {
                                    that.last = that.active - 1;
                                }
                                setTimeout(v=>{
                                    uni.pageScrollTo({
                                        scrollTop: that.height*2,
                                        duration: 1000
                                    });
                                },100)
                                setTimeout(v=>{
                                    that.next = 0;
                                    if(that.active == 6 && that.userInfo.identity.member_level == 0 && that.userInfo.is_vip_card_user == 0) {
                                        that.active = 8;
                                    }else {
                                        that.active++;
                                    }
                                    that.loading = false;
                                },1000)
                            },100)
                        }else if(+that.list[0].changedTouches[0].clientY - +that.list[that.list.length - 1].changedTouches[0].clientY < -30 && that.active > 1) {
                            if(that.active == 6 && that.userInfo.identity.member_level == 0 && that.userInfo.is_vip_card_user == 0) {
                                that.next = 8;
                            }else {
                                that.next = that.active + 1;
                            }
                            if(that.active == 8 && that.userInfo.identity.member_level == 0 && that.userInfo.is_vip_card_user == 0) {
                                that.last = 6;
                            }else {
                                that.last = that.active - 1;
                            }
                            uni.pageScrollTo({
                                scrollTop: 0,
                                duration: 0
                            });
                            that.next = 0;
                            if(that.active == 8 && that.userInfo.identity.member_level == 0 && that.userInfo.is_vip_card_user == 0) {
                                that.active = 6;
                            }else {
                                that.active--;
                            }
                            that.loading = false;
                        }else {
                            uni.pageScrollTo({
                                scrollTop: 0,
                                duration: 200
                            });
                            that.loading = false;
                        }
                    }
                },200)
            },
            toList() {
                uni.redirectTo({
                    url: '/pages/foot/index/index'
                });
            },
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.foot.list,
                }).then(response=>{
                    uni.hideLoading();
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.day = response.data.day;
                        that.coupon_discount_price = response.data.coupon_discount_price;
                        that.coupon_num = response.data.coupon_num;
                        that.highest_price = response.data.highest_price;
                        that.member_discount_price = response.data.member_discount_price;
                        that.pay_num = response.data.pay_num;
                        that.pay_price = response.data.pay_price;
                        that.percentage = response.data.percentage;
                        that.percentageRate = (response.data.percentage*100).toFixed(0);
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    uni.hideLoading();
                    that.$hideLoading();
                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(()=>{
                        that.getList();
                    });
                });
            },
            load(index,e) {
                this.size[index].width = e.detail.width + 'rpx';
                this.size[index].height = e.detail.height + 'rpx';
            }
        },
        onLoad() { this.$commonLoad.onload();
            this.height = uni.getSystemInfoSync().windowHeight;
            this.rate = +this.height / 599 > 1 ? 1 : +this.height / 599;
            this.indexRate = +this.height / 657 > 1 ? 1 : +this.height / 657
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            var timestamp = Date.parse(new Date());
            // 昨天
            let yesterTime = (timestamp / 1000 - 24 * 60 * 60) * 1000;
            let yesterDate = new Date(yesterTime)
            let yester_year = yesterDate.getFullYear();
            let yester_month = yesterDate.getMonth() + 1;
            if (yester_month >= 1 && yester_month <= 9) {
                yester_month = "0" + yester_month;
            }
            let yester_now = yesterDate.getDate();
            this.yesterday = yester_year + "." + yester_month + "." + yester_now;
            this.getList();
        }
    }
</script>

<style scoped lang="scss">
    .poster-dialog {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 500;
        background-color: rgba(0,0,0,0.5);
    }
    .tab-list {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 300;
        background-color: #fff;
        padding: #{20rpx} 0;
        width: 100%;
        .tab {
            width: #{600rpx};
            border-radius: 40rpx;
            font-size: #{28rpx};
            color: #ff4544;
            border: #{2rpx} solid #ff4544;
            margin: 0 auto #{20rpx};
            view {
                width: #{300rpx};
                height: #{72rpx};
                text-align: center;
                line-height: #{72rpx};
            }
            .active {
                border-radius: #{36rpx};
                background-color: #ff4544;
                color: #fff;
            }
        }
        .tab-date {
            view {
                padding: 0 #{24rpx};
                height: #{60rpx};
                line-height: #{60rpx};
                margin-left: #{24rpx};
                border-radius: #{40rpx};
                color: #353535;
                font-size: #{26rpx};
                display: inline-block;
            }
            .customize {
                width: #{172rpx};
                padding: 0;
                text-align: center;
            }
            .active {
                background-color: #ff4544;
                color: #fff;
            }
        }
    }
    .list {
        padding-top: #{72rpx};
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        .show-icon {
            width: 100%;
            bottom: 0;
            left: 0;
            position: absolute;
            height: 70%;
        }
        .show-icon.first {
            padding-top: #{40rpx};
        }
    }
    .list.active {
        position: fixed;
        top: 0;
        z-index: 100;
        display: block;
    }
    .list.next {
        top: 100%;
        display: block;
        z-index: 200;
    }
    .info {
        font-size: #{40rpx};
        color: #fff;
        text-align: center;
        width: 100%;
        position: absolute;
        top: #{138rpx};
        font-family: hycyj;
        left: 0;
        height: 15%;
        .name {
            font-size: #{58rpx};
            color: #fff7be;
        }
        .day {
            color: #fff7be;
            font-size: #{95rpx};
            font-family: DIN;
        }
        .yesterday {
            font-size: #{58rpx};
            font-family: DIN;
            color: #fff7be;
        }
        .pay-price {
            font-size: #{95rpx};
            font-family: DIN;
            color: #fff7be;
        }
        .other {
            margin: #{30rpx} 0 #{10rpx};
        }
    }
    .total-gif {
        position: absolute;
        top: #{345rpx};
        left: #{30rpx};
        z-index: 20;
        width: #{691rpx};
        height: #{767rpx};
    }
    .buy-gif {
        position: absolute;
        top: #{450rpx};
        left: #{30rpx};
        z-index: 20;
        width: #{691rpx};
        height: #{663rpx};
    }
    .text-info {
        position: fixed;
        bottom: #{104rpx};
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 29rpx;
        color: #fff;
        font-family: hycyj;
        z-index: 100;
    }
    .page-down {
        position: fixed;
        bottom: #{24rpx};
        left: 0;
        right: 0;
        width: #{70rpx};
        height: #{70rpx};
        margin:  0 auto;
        z-index: 100;
    }
    .more-menu {
        position: fixed;
        bottom: #{35rpx};
        left: 0;
        right: 0;
        width: 100%;
        height: #{89rpx};
        z-index: 100;
        image {
            width: #{89rpx};
            height: #{89rpx};
            margin: 0 #{100rpx};
        }
    }
</style>