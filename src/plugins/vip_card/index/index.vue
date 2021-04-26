<template>
    <app-layout>
        <!-- 卡片 -->
        <view v-if="!first" class="head-card" :style="[{'background-color': `${list.form.card_bg}`}]">
            <image :src="list.form.head_card != 'statics/img/app/vip_card/default-card.png'?list.form.head_card:svipImg.default_card" class="card-bg" alt=""></image>
            <image class="card-bottom" :src="svipImg.card_bottom" alt=""></image>
            <view class="card-name dir-left-nowrap" :style="[{'color': `${list.form.card_color}`}]">
                <view>{{detail ? list.name: '暂未添加会员卡'}}</view>
                <view v-if="user && user.order && user.order.length > 0" @click="toggleLog" class="buy-log dir-left-nowrap cross-center"><view>购买记录</view><image class="buy-log-icon" src="./../image/right.png"></image></view>
            </view>
            <view class="open-info" :style="[{'color': `${list.form.card_color}`}]">
                <view>开通会员可享受以下权利</view>
                <view class="card-rights cross-center dir-left-nowrap">
                    <image class="image" src="./../image/coupon-icon.png"></image>
                    <view>{{user ? user.image_discount == 0 ? '免费' : user.image_discount + '折' : card.discount == 0 ? '免费' : card.discount + '折'}}</view>
                    <image class="image free-icon" v-if="user ? user.image_is_free_delivery ==1  : card.is_free_delivery == 1" src="./../image/free.png"></image>
                    <view v-if="user ? user.image_is_free_delivery ==1  : card.is_free_delivery == 1">自营商品包邮</view>
                    <view @click="toRight" class="buy-log dir-left-nowrap cross-center"><view>查看权益</view><image class="buy-log-icon" src="./../image/right.png"></image></view>
                </view>
                <view class="userDay" v-if="user">有效时间：{{start_time}}-{{end_time}}</view>
                <view class="userDay" v-if="user && (user.expire > 0 || user.expire == 0)">累积剩余{{user.expire}}天</view>
                <view class="userDay" v-if="user && user.expire < 0">已过期</view>
            </view>
            <image class="share-btn" @click="showShare = !showShare" src="./../image/share.png" alt=""></image>
            <view v-if="!is_buy && card.detail.length > 0" @click="toBuy(detail.id)" class="card-buy">立即开通</view>
        </view>
        <view class="placeholde"></view>
        <!-- 子卡列表 -->
        <view class="card-detail-title" v-if="is_buy">请选择续费时长</view>
        <view class="card-detail-list" v-if="card.detail.length > 0 && !first">
            <scroll-view :scroll-into-view="scroll_position" class="scroll-view" scroll-x="true">
                <view :id="'detail' + index" @click="choose(item,index)" :class="['scroll-item',`${item.id == detail.id ? 'active':''}`]" :key="item.id" v-for="(item,index) in card.detail">
                    <view class="scroll-item-name">{{item.name}}</view>
                    <view class="scroll-item-price">￥<text>{{item.price}}</text></view>
                    <view class="cross-center main-center" @click.stop="lookAbout(item)">
                        <text style="color: #999999">使用说明</text>
                        <image class="card-more" v-if="item.id == detail.id" src="./../image/more-active.png"></image>
                        <image class="card-more" v-else src="./../image/more.png"></image>
                    </view>
                    <image v-if="item.id == detail.id" class="choose-icon" src="./../image/right-bottom.png"></image>
                </view>
            </scroll-view>
        </view>
        <view>
            <view class="list" v-for="(item,index) in list.form.sort" :key="index">
                <!-- 会员专享 -->
                <view v-if="item == 'member'" class="item vip-icon" :style="[{'background-color': `${list.form.vip_bg}`}]">
                    <view class="item-title main-center cross-center">
                        <image :src="svipImg.left" alt=""></image>
                        <view :style="[{'color': `${list.form.vip_color}`}]" class="item-title-text">会员专享</view>
                        <image :src="svipImg.right" alt=""></image>
                    </view>
                    <view style="width: 100%;overflow-x: auto">
                        <view class="item-icon-list dir-left-wrap" :style="[{'color': `${list.form.vip_color}`, 'max-height': `${vipHeight}`,'width': `${icon_width}`}]">
                            <view  class="dir-left-wrap cross-top form-icon-list" :key="idx" v-for="(icon_list,idx) in list.form.vip_icon_list">
                                <view class="item-icon dir-top-nowrap" :key="number" v-for="(res,number) in icon_list" :style="[{'width': `${vip_icon_width + 'rpx'}`}]">
                                    <image class="item-icon-img" :src="res.img"></image>
                                    <view class="item-icon-name">{{res.name}}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 会员特权 -->
                <view v-if="item == 'right'" class="item">
                    <view class="item-title main-center cross-center">
                        <image :src="svipImg.left" alt=""></image>
                        <view class="item-title-text">会员特权</view>
                        <image :src="svipImg.right" alt=""></image>
                    </view>
                    <view v-for="(res,idx) in list.form.right_list" :key="idx" class="item-right">
                        <image v-if="res.img == 'statics/img/app/vip_card/off.png'" :src="svipImg.off" alt=""></image>
                        <image v-else-if="res.img == 'statics/img/app/vip_card/free-shipping.png'" :src="svipImg.shipping" alt=""></image>
                        <image v-else :src="res.img" alt=""></image>
                        <view class="item-right-text">
                            <view :style="[{'color': `${res.big_color}`}]">{{res.big}}</view>
                            <view :style="[{'color': `${res.small_color}`}]">{{res.small}}</view>
                        </view>
                    </view>
                </view>
                <!-- 开卡即赠 -->
                <view v-if="item == 'gift' && (detail.send_integral_num > 0 || detail.send_balance > 0 || detail.vipCoupons && detail.vipCoupons.length > 0 || detail.vipCards && detail.vipCards.length > 0)" class="item">
                    <view class="item-title main-center cross-center">
                        <image :src="svipImg.left" alt=""></image>
                        <view class="item-title-text">开卡即赠</view>
                        <image :src="svipImg.right" alt=""></image>
                    </view>
                    <view v-if="detail.send_integral_num > 0" class="dir-left-nowrap cross-center item-gift">
                        <image class="item-gift-img" :src="list.form.integral_icon != 'statics/img/app/vip_card/integral.png'?list.form.integral_icon:svipImg.integral"></image>
                        <view>积分</view>
                        <view class="item-gift-about">{{detail.send_integral_num}}积分</view>
                    </view>
                    <view v-if="detail.send_balance > 0" class="dir-left-nowrap cross-center item-gift">
                        <image class="item-gift-img" :src="list.form.balance_icon != 'statics/img/app/vip_card/balance.png'?list.form.balance_icon:svipImg.balance"></image>
                        <view>余额</view>
                        <view class="item-gift-about">{{detail.send_balance}}元</view>
                    </view>
                    <view v-if="detail.vipCoupons && detail.vipCoupons.length > 0" class="dir-left-nowrap cross-center item-gift coupon">
                        <image class="item-gift-img" :src="list.form.coupon_icon != 'statics/img/app/vip_card/coupon.png'?list.form.coupon_icon:svipImg.coupon"></image>
                        <view>优惠券</view>
                        <view class="item-gift-about">X{{couponNum}}</view>
                    </view>
                    <view v-if="detail.vipCoupons && detail.vipCoupons.length > 0" class="coupon-list">
                        <scroll-view class="coupon-view" scroll-x="true" scroll-left="120">
                            <view class="coupon-space"></view>
                            <view class="coupon-item" :key="coupon.id" v-for="coupon in detail.vipCoupons">
                                <image class="coupon-bg" src="./../image/coupon.png"></image>                            
                                <view class="dir-top-nowrap coupon-info">
                                        <view class="coupon-price" v-if="coupon.type == 2">￥
                                            <text>{{coupon.sub_price}}</text>
                                        </view>
                                        <view class="coupon-price" v-else>
                                            <text>{{coupon.discount}}</text>折
                                        </view>
                                        <view class="coupon-total">满{{coupon.min_price}}可用</view>
                                    </view>
                            </view>
                        </scroll-view>
                    </view>
                    <view v-if="detail.vipCards && detail.vipCards.length > 0" class="dir-left-nowrap cross-center item-gift coupon">
                        <image class="item-gift-img" :src="list.form.card_icon != 'statics/img/app/vip_card/card.png'?list.form.card_icon:svipImg.card"></image>
                        <view>卡券</view>
                        <view class="item-gift-about">X{{cardNum}}</view>
                    </view>
                    <view v-if="detail.vipCards && detail.vipCards.length > 0" class="card-list">
                        <view class="card-item dir-left-nowrap" :key="cardIdx" v-for="(card,cardIdx) in detail.vipCards">
                            <image :src="card.pic_url"></image>
                            <view class="t-omit-two">{{card.name}}</view>
                        </view>
                    </view>
                </view>
                <!-- 图片广告 -->
                <!-- #ifndef H5 -->
                <view v-if="item == 'rubik'" class="rubik" :style="[{'height': `${list.form.rubik.height*2 + 'rpx'}`}]">
                    <view :style="[{'height': `${rubik.h*2 + 'rpx'}`,'width': `${rubik.w*2 + 'rpx'}`,'top': `${rubik.y*2 + 'rpx'}`,'left': `${rubik.x*2 + 'rpx'}`}]" :key="rubikIndex" v-for="(rubik,rubikIndex) in list.form.rubik.list">
                        <app-jump-button :url="rubik.url" :open_type="rubik.open_type">
                            <image :style="[{'height': `${rubik.h*2 + 'rpx'}`,'width': `${rubik.w*2 + 'rpx'}`}]" :src="rubik.pic"></image>
                        </app-jump-button>
                    </view>
                </view>
                <!-- #endif -->
                <!-- #ifdef H5 -->
                <view v-if="item == 'rubik'" class="rubik" :style="[{'height': `${list.form.rubik.height*2 + 'rpx'}`}]">
                    <view :style="[{'height': `${rubik.h*2 + 'rpx'}`,'width': `${rubik.w*2 + 'rpx'}`,'top': `${rubik.y*2 + 'rpx'}`,'left': `${rubik.x*2 + 'rpx'}`}]" :key="rubikIndex" v-for="(rubik,rubikIndex) in list.form.rubik.list">
                        <app-jump-button v-if="rubik.open_type !== 'app'" :url="rubik.url" :open_type="rubik.open_type">
                            <image :style="[{'height': `${rubik.h*2 + 'rpx'}`,'width': `${rubik.w*2 + 'rpx'}`}]" :src="rubik.pic"></image>
                        </app-jump-button>
                        <view :id="rubik.id" v-if="rubik.open_type === 'app'" :style="{'height': `${rubik.h*2 + 'rpx'}`,'width': `${rubik.w*2 + 'rpx'}`}"></view>
                    </view>
                </view>
                <!-- #endif -->
            </view>
        </view>
        <view v-if="detail.id > 0" :class="['bottom-place', `${iphone_x? 'iphone_x':''}`,`${tabbarbool? 'tabbarbool':''}`]"></view>
        <!-- 购买按钮 -->
        <view v-if="detail.id > 0" :class="['foot main-center cross-center', `${iphone_x? 'iphone_x':''}`,`${tabbarbool? 'tabbarbool':''}`]">
            <view>
                <view class="foot-button dir-left-nowrap">
                    <view class="foot-info" :style="[{'background-color': `${list.form.bottom_style_1}`, 'color': `${list.form.bottom_style_2}`}]">
                        <text>￥{{detail.price}}</text>/{{user ? (user.expire > 0 ? '剩余' + user.expire + '天到期' : '已过期') : '有效期' + detail.expire_day +'天'}}</view>
                    <view class="foot-buy" @click="toBuy(detail.id)" :style="[{'background-color': `${list.form.bottom_btn_style_1}`, 'color': `${list.form.bottom_btn_style_2}`}]">{{user && is_buy? '立即续费':'立即开通'}}</view>
                </view>
                <view v-if="list.is_agreement" class="bottom-read main-center cross-bottom">
                    <view @click="toRead" class="read-icon main-center cross-bottom">
                        <image v-if="read" :style="[{'background-color': `${list.form.bottom_btn_style_1}`}]" src="./../image/vip-check.png" alt=""></image>
                        <image v-else src="/static/image/icon/form-er.png" alt=""></image>
                    </view>
                    <view :style="[{'color': `${list.form.bottom_btn_style_2}`}]">我已仔细阅读并同意<text @click="toRule" :style="[{'color': `${list.form.bottom_btn_style_1}`}]">《{{list.agreement_title}}》</text></view>
                </view>
            </view>
        </view>
        <!-- 子卡使用说明 -->
        <view v-if="title && content" class="bg main-center cross-center">
            <view class="dialog">
                <image @click="lookAbout" class="dialog-close" src="/static/image/icon/icon-close.png"></image>
                <view class="dialog-title">{{title}}</view>
                <view class="dialog-content">
                    <text>{{content}}</text>
                </view>
                <view class="dialog-btn cross-center main-center">
                    <view @click="lookAbout" class="dialog-button">我知道了</view>
                    <view class="line"></view>
                    <view @click="toBuy(id)" class="dialog-button buy">{{user && is_buy? '立即续费':'立即购买'}}</view>
                </view>
            </view>
        </view>
        <view v-if="showLog" class="bg main-center cross-center">
            <view class="dialog buy-log">
                <view class="dialog-top medium">购买记录</view>
                <image @click="toggleLog" class="dialog-close" src="/static/image/icon/icon-close.png"></image>
                <view class="log-item main-center medium">
                    <view>子卡名称</view>
                    <view>有效期</view>
                    <view>下单时间</view>
                </view>
                <view class="log-list">
                    <view v-if="user.order && user.order.length > 0" v-for="(item,index) in user.order" :key="index" class="log-item main-center">
                        <view>{{item.detail_name}}</view>
                        <view>{{item.expire}}天</view>
                        <view>{{item.created_at}}</view>
                    </view>
                </view>
                <view class="log-foot">
                    <view @click="toggleLog" class="log-foot-btn">我知道了</view>
                </view>
            </view>
        </view>
        <view>
            <app-share-qr-code @share="hShareAppMessage" :theme="getTheme" v-model="showShare" :url="poster" title="生成海报"></app-share-qr-code>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appShareQrCode from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';

    export default {
        data() {
            return {
                list: {
                    form: {}
                },
                couponNum: 0,
                cardNum: 0,
                detail: {
                    price: '',
                    expire_day: '',
                },
                is_buy: false,
                first: true,
                showLog: false,
                showShare: false,
                poster: this.$api.vip_card.poster,
                card: {
                    detail: []
                },
                scroll_position: '',
                iphone_x: false,
                read: false,
                vip_icon_width: 234,
                user: {
                    order: []
                },
                title: '',
                start_time: '',
                end_time: '',
                id: 0,
                expire_day: 0,
                vipHeight: '320rpx',
                content: '',
                icon_width: '702rpx',
                currentRoute: this.$platDiff.route(),
                tabbarbool: false,
            }
        },
        computed: {
            ...mapState({
                svipImg: state => state.mallConfig.__wxapp_img.vip_card,
                tabBarNavs: state => state.mallConfig.navbar.navs,
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
        },
        components: {
            appShareQrCode
        },
        watch: {
            tabBarNavs: {
                handler: function() {
                    this.b();
                },
                immediate: true,
            }
        },
        // #ifdef H5
        mounted() {
            this.$jwx.config({});
        },
        // #endif
        // #ifdef MP
        onShareAppMessage() {
            return this.hShareAppMessage();
        },
        // #endif
        methods: {
            hShareAppMessage(s = false){
                return this.$shareAppMessage({
                    title: '我是' + this.card.name + '，召唤小伙伴一起来加入会员吧！',
                    imageUrl: this.svipImg.image_share,
                    path: "/plugins/vip_card/index/index",
                }, s);
            },
            b() {
                // #ifndef H5
                let currentRoute = this.currentRoute;
                for (let i = 0; i < this.tabBarNavs.length; i++) {
                    if(currentRoute.includes(this.tabBarNavs[i].url.split('?')[0])) {
                        return this.tabbarbool = true;
                    }
                }
                // #endif
                return  this.tabbarbool = false;
            },
            toRight() {
                let that = this;
                if(that.user != null && +that.user.expire > 0) {
                    uni.navigateTo({
                        url: '/plugins/vip_card/rights/rights'
                    });
                }else {
                    uni.navigateTo({
                        url: '/plugins/vip_card/rights/rights?id=' + that.detail.id
                    });
                }
            },
            toRead() {
                this.read = !this.read
            },
            toggleLog() {
                this.showLog = !this.showLog
            },
            toBuy(id) {
                let expire_day = 0;
                if(this.user != null) {
                    expire_day = this.user.expire
                }
                if((this.read && this.list.is_agreement) || !this.list.is_agreement) {
                    this.title = '';
                    uni.navigateTo({
                        url: '/plugins/vip_card/buy/buy?id=' + id + '&end=' + this.end_time + '&expire_day=' + expire_day
                    });
                }else {
                    uni.showToast({
                        title: '请先查看申请协议并同意',
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            toRule() {
                // uni.navigateTo({
                //     url: '/plugins/vip_card/rules/rules'
                // });
                uni.navigateTo({
                    url: `/pages/rules/index?url=${encodeURIComponent(this.$api.vip_card.setting)}&key=agreement_content&title=超级会员卡使用说明`,
                });
            },
            lookAbout(item) {
                if(item.id > 0) {
                    this.title = item.title;
                    this.content = item.content;
                    this.id = item.id;
                    this.expire_day = item.expire_day;
                }else {
                    this.title = '';
                    this.content = '';
                }
            },

            choose(detail,index) {
                let that = this;
                that.is_buy = false;
                that.couponNum = 0;
                that.cardNum = 0;
                if(index > 1 || index < (that.card.detail.lenth - 2)) {
                    index--;
                }else if(index < 2){
                    index = 0;
                }else {
                    index = his.card.detail.lenth - 1;
                }
                that.detail = detail;
                that.scroll_position = 'detail' + index;
                if(detail.coupons.length > 0) {
                    for(let i in detail.coupons) {
                        that.couponNum += +detail.coupons[i].send_num
                    }
                }
                if(detail.cards.length > 0) {
                    for(let i in detail.cards) {
                        that.cardNum += +detail.cards[i].send_num
                    }
                }
                if(that.user && that.user.order) {
                    that.user.order.forEach(v => {
                        if(v.detail_id == detail.id) {
                            that.is_buy = true;
                        }
                    })
                }
            },
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.vip_card.index,
                }).then(response=>{
                    that.$hideLoading();
                    that.first =  false;
                    if(response.code == 0) {
                        that.user = response.data.user;
                        response.data.user.order.forEach(v => {
                            if(v.detail_id == that.card.detail[0].id) {
                                that.is_buy = true;
                            }
                        })
                        if(that.user) {
                            that.start_time = that.user.start_time.slice(0,10).replace(/-/g,"/");
                            that.end_time = that.user.end_time.slice(0,10).replace(/-/g,"/");
                        }
                    }else {
                        if(response.msg == '超级会员卡已关闭' || response.msg == '无超级会员卡权限') {
                            uni.redirectTo({
                                url: '/pages/index/index'
                            })
                        }
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
            getUrlParam(url,name) {
                let search = url.split('?')[1];
                if (search) {
                    let r = search.substr(0).match(new RegExp('(^|&)' + name + '=([^&]*)(&|$)'))
                    if (r !== null) {
                        return unescape(r[2])
                    }
                    return null
                } else {
                    return null
                }
            },
            getSetting() {
                let that = this;
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.$request({
                    url: that.$api.vip_card.setting,
                }).then(response=>{
                    if(response.code == 0) {
                        that.getCard();
                        that.list = response.data;
                        for(let index in that.list.form.vip_icon_list) {
                            for(let i in that.list.form.vip_icon_list[index]){
                                switch(that.list.form.vip_icon_list[index][i].img) {
                                    case 'statics/img/app/vip_card/icon1.png':
                                        that.list.form.vip_icon_list[index][i].img = that.svipImg.icon1;
                                        break;
                                    case 'statics/img/app/vip_card/icon2.png':
                                        that.list.form.vip_icon_list[index][i].img = that.svipImg.icon2;
                                        break;
                                    case 'statics/img/app/vip_card/icon3.png':
                                        that.list.form.vip_icon_list[index][i].img = that.svipImg.icon3;
                                        break;
                                    case 'statics/img/app/vip_card/icon4.png':
                                        that.list.form.vip_icon_list[index][i].img = that.svipImg.icon4;
                                        break;
                                    case 'statics/img/app/vip_card/icon5.png':
                                        that.list.form.vip_icon_list[index][i].img = that.svipImg.icon5;
                                        break;
                                    case 'statics/img/app/vip_card/icon6.png':
                                        that.list.form.vip_icon_list[index][i].img = that.svipImg.icon6;
                                        break;
                                    case 'statics/img/app/vip_card/icon7.png':
                                        that.list.form.vip_icon_list[index][i].img = that.svipImg.icon7;
                                        break;
                                }
                            }
                        }
                        // #ifdef H5
                        for(let i in that.list.form.rubik.list) {
                            that.list.form.rubik.list[i].id = that.$utils.guid('app-swiper');
                            if(that.list.form.rubik.list[i].open_type === 'app') {
                                let username = this.getUrlParam(that.list.form.rubik.list[i].url,'username');
                                let path = this.getUrlParam(that.list.form.rubik.list[i].url,'we_path');
                                let text = `<img src="`+that.list.form.rubik.list[i].pic+`" width="`+that.list.form.rubik.list[i].w+`px" height="`+that.list.form.rubik.list[i].h+`px" />`;
                                this.$utils.createWxOpenLaunchWeapp(that.list.form.rubik.list[i].id, username, path, text)
                            }
                        }
                        // #endif
                        if(that.list.form.vip_number == 3) {
                            that.vip_icon_width = 234
                        }else if(that.list.form.vip_number == 4) {
                            that.vip_icon_width = 175
                        }else if(that.list.form.vip_number == 5) {
                            that.vip_icon_width = 140
                        }
                        that.vipHeight = +that.list.form.vip_line * 160 + 'rpx';
                        that.icon_width = 702*that.list.form.vip_icon_list.length + 'rpx'
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                        if(response.msg == '超级会员卡已关闭' || response.msg == '无超级会员卡权限') {
                            setTimeout(()=>{
                                uni.redirectTo({
                                    url: '/pages/index/index'
                                })
                            },1000)
                        }
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
            getCard() {
                let that = this;
                that.$request({
                    url: that.$api.vip_card.card,
                }).then(response=>{
                    if(response.code == 0) {
                        that.card = response.data;
                        that.detail = that.card.detail[0];
                        if(that.detail.coupons.length > 0) {
                            for(let i in that.detail.coupons) {
                                that.couponNum += +that.detail.coupons[i].send_num
                            }
                        }
                        if(that.detail.cards.length > 0) {
                            for(let i in that.detail.cards) {
                                that.cardNum += +that.detail.cards[i].send_num
                            }
                        }
                        that.getList();
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
        },
        onLoad() { this.$commonLoad.onload();
            let that = this;
            that.getSetting();
            uni.getSystemInfo({
                success: function (res) {
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1) {
                        that.iphone_x = true;
                    }
                }
            })
        },
        onShow() {
            let that = this;
            if(this.$storage.getStorageSync('vip_card_is_read')) {
                this.read = this.$storage.getStorageSync('vip_card_is_read');
                this.$storage.removeStorageSync('vip_card_is_read');
            }
            if(!that.first) {
                that.getList();
            }
        },
    }
</script>

<style scoped lang="scss">
    .medium {
        font-weight: 600
    }

    .head-card {
        height: #{344rpx};
        position: relative;
        .buy-log {
            margin-left: #{20rpx};
            font-size: #{20rpx};
            color: #b17426;
            .buy-log-icon {
                width: #{15rpx};
                height: #{15rpx};
                margin-left: #{10rpx};
            }
        }
        .share-btn {
            position: absolute;
            top: 80rpx;
            right: 48rpx;
            height: 60rpx;
            width: 60rpx;
            z-index: 12;
        }
        .card-bg {
            position: absolute;
            z-index: 11;
            top: #{64rpx};
            left: 0;
            right: 0;
            margin: 0 auto;
            height: #{360rpx};
            width: #{702rpx};
            border-radius: #{30rpx};
            background-color: #fff;
            box-shadow: 0 0 #{20rpx} rgba(0, 0, 0, .3)
        }
        .card-name {
            position: absolute;
            top: #{114rpx};
            left: #{80rpx};
            font-size: #{40rpx};
            z-index: 12;
        }
        .open-info {
            position: absolute;
            top: #{200rpx};
            left: #{80rpx};
            font-size: #{24rpx};
            z-index: 12;
            .card-rights {
                margin-top: #{20rpx};
                margin-bottom: #{30rpx};
                height: #{30rpx};
            }
            .free-icon {
                margin-left: #{65rpx};
            }
            .image {
                width: #{42rpx};
                margin-right: #{12rpx};
                height: #{30rpx};
            }
            .userDay {
                color: #b17426;
                margin-bottom: #{16rpx};
            }
        }
        .card-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            height: #{80rpx};
            width: 100%;
            z-index: 5;
        }
        .card-buy {
            position: absolute;
            top: #{342rpx};
            right: #{57rpx};
            height: #{44rpx};
            line-height: #{44rpx};
            width: #{144rpx};
            border-radius: #{22rpx};
            font-size: #{26rpx};
            color: #dba158;
            background-color: #ffefde;
            text-align: center;
            z-index: 12;
        }
    }
    .placeholde {
        height: #{120rpx};
    }
    .scroll-view {
        height: #{225rpx};
        padding-left: #{11rpx};
        white-space: nowrap;
        .scroll-item {
            display: inline-block;
            height: #{223rpx};
            width: #{215rpx};
            background-color: #fff;
            border-radius: #{15rpx};
            text-align: center;
            padding-top: #{24rpx};
            margin-left: #{13rpx};
            border: #{2rpx} solid #e5e5e5;
            font-size: #{22rpx};
            color: #5d5d5d;
            position: relative;
            .scroll-item-name {
                font-size: #{24rpx};
                margin-bottom: #{16rpx};
                font-weight: bold;
            }
            .scroll-item-price {
                font-size: #{30rpx};
                width: #{215rpx};
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #ff5151;
                margin-bottom: #{30rpx};
                text {
                    font-size: #{40rpx};
                }
            }
            .card-more {
                width: #{21rpx};
                margin-left: #{8rpx};
                height: #{21rpx};
            }
            .choose-icon {
                position: absolute;
                bottom: 0;
                right: 0;
                width: #{40rpx};
                height: #{37rpx};
            }
        }
        .scroll-item.active {
            background-color: #fff8ef;
            border-radius: #{15rpx};
            text-align: center;
            padding-top: #{24rpx};
            margin-left: #{13rpx};
            border: #{5rpx} solid #ffd8a9;
        }
    }
    .rubik {
        position: relative;
        margin-top: #{32rpx};
        view {
            position: absolute;
        }
    }
    .item {
        position: relative;
        width: #{702rpx};
        margin: 0 auto;
        padding: #{40rpx} #{36rpx};
        font-size: #{32rpx};
        border-radius: #{15rpx};
        padding-top: #{110rpx};
        background-color: #fff;
        box-shadow: 0 0 #{8rpx} rgb(239, 239, 239);
        .item-title {
            position: absolute;
            top: #{48rpx};
            left: 0;
            width: #{702rpx};
            .item-title-text {
                margin: 0 #{20rpx};
                font-size: #{32rpx};
                color: #342e25;
            }
            image {
                width: #{60rpx};
                height: #{19rpx};
            }
        }
        .item-icon-list {
            overflow-y: hidden;
            margin: 0 auto;
            color: #666666;
            .form-icon-list {
                width: #{702rpx};
                height: #{1rpx};
            }
            .form-icon-list:first-of-type {
                height: auto;
            }
        }
        .item-icon {
            text-align: center;
            height: #{140rpx};
            margin-top: #{20rpx};
            .item-icon-img {
                width: #{80rpx};
                height: #{80rpx};
                margin-bottom: #{20rpx};
                border-radius: 50%;
                margin: 0 auto;
            }
            .item-icon-name {
                font-size: #{26rpx};
            }
        }
        .item-right {
            margin-top: #{30rpx};
            position: relative;
            height: #{160rpx};
            .item-right-text {
                position: absolute;
                left: #{50rpx};
                top: #{20rpx};
                font-size: #{33rpx};
                view:first-of-type {
                    font-size: #{43rpx};
                    margin-bottom: #{5rpx};
                }
            }
            image{
                width: #{630rpx};
                height: #{160rpx};
                border-radius: #{15rpx};
            }
        }
        .item-right:first-of-type {
            margin-top: 0;
        }
        .item-gift {
            height: #{118rpx};
            font-size: #{32rpx};
            color: #342e25;
            border-bottom: 2rpx solid #e2e2e2;
            .item-gift-img {
                height: #{52rpx};
                width: #{56rpx};
                margin-right: #{31rpx};
            }
            .item-gift-about {
                margin-left: #{10rpx};
                font-size: #{28rpx};
                color: #999999;
            }
        }
        .item-gift.coupon {
            border-bottom: 0;
        }
        .coupon-list {
            border-bottom: #{2rpx} solid #e2e2e2;
            padding-bottom: #{30rpx};
            .coupon-view {
                height: #{130rpx};
                padding-left: #{15rpx};
                white-space: nowrap;
                .coupon-space {
                    height: #{130rpx};
                    width: #{88rpx};
                    display: inline-block;
                }
                .coupon-item {
                    position: relative;
                    width: #{256rpx};
                    height: #{130rpx};
                    margin-right: #{15rpx};
                    display: inline-block;
                    .coupon-bg {
                        width: #{256rpx};
                        height: #{130rpx};
                    }
                    .coupon-info {
                        position: absolute;
                        z-index: 10;
                        top: #{14rpx};
                        right: #{75rpx};
                        height: #{130rpx};
                        color: #5d402f;
                        font-size: #{20rpx};
                        text-align: right;
                        .coupon-price {
                            font-size: #{30rpx};
                            margin-bottom: #{10rpx};
                            text {
                                font-size: #{48rpx};
                            }
                        }   
                    }
                }
            }            
        }
        .card-list {
            width: #{542rpx};
            padding-left: #{88rpx};
            .card-item {
                height: #{136rpx};
                width: #{542rpx};
                border-radius: #{15rpx};
                font-size: #{28rpx};
                color: #000000;
                border: #{2rpx} solid #e2e2e2;
                padding: #{28rpx} #{24rpx};
                margin-bottom: #{16rpx};
                image {
                    width: #{80rpx};
                    height: #{80rpx};
                    border-radius: 50%;
                    margin-right: #{25rpx};
                }
            }
        }
    }
    .card-detail-title {
        margin-left: #{24rpx};
        margin-bottom: #{24rpx};
    }
    .card-detail-list {
        margin-bottom: #{32rpx};
    }
    .list {
        margin-top: #{32rpx};
    }
    .list:first-of-type {
        margin-top: 0;
    }
    .item.vip-icon {
        padding: #{110rpx} 0 #{36rpx};
    }
    .item-gift:last-of-type {
        border-bottom: 0
    }
    .bottom-place {
        height: #{200rpx};
    }
    .bottom-place.tabbarbool {
        height: #{200rpx};
    }
    .bottom-place.iphone_x {
        height: #{275rpx};
    }
    .bottom-place.iphone_x.tabbarbool {
        height: #{200rpx};
    }
    .foot {
        position: fixed;
        z-index: 101;
        bottom: 0;
        left: 0;
        width: 100%;
        padding-top: #{10rpx};
        height: #{185rpx};
        padding-bottom: #{25rpx};
        background-color: #fff;
        .foot-button {
            width: #{702rpx};
            margin: #{10rpx} auto 0;
            height: #{80rpx};
            line-height: #{80rpx};
            font-size: #{24rpx};
            text {
                font-size: #{36rpx};
            }
            .foot-info {
                width: #{502rpx};
                padding-left: #{40rpx};
                border-top-left-radius: #{40rpx};
                border-bottom-left-radius: #{40rpx};
            }
            .foot-buy {
                width: #{200rpx};
                text-align: center;
                border-top-right-radius: #{40rpx};
                border-bottom-right-radius: #{40rpx};
            }
        }
        .bottom-read {
            height: #{34rpx};
            font-size: #{20rpx};
            .read-icon {
                height: #{34rpx};
                width: #{44rpx};
                image {
                    width: #{24rpx};
                    height: #{24rpx};
                    border-radius: 50%;
                }
            }
        }
    }
    .foot.iphone_x {
        height: #{260rpx};
        padding-bottom: #{100rpx};
    }

    .foot.iphone_x.tabbarbool {
        height: #{340rpx};
        padding-bottom: #{170rpx};
    }
    .foot.tabbarbool {
        height: #{300rpx};
        padding-bottom: #{130rpx};
    }
    .bg {
        position: fixed;
        z-index: 200;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,.3);
        width: 100%;
        height: 100%;
        .dialog {
            width: #{650rpx};
            background-color: #fff;
            padding-bottom: #{122rpx};
            border-radius: #{15rpx};
            position: relative;
            .dialog-top {
                height: #{95rpx};
                width: #{410rpx};
                padding-top: #{20rpx};
                font-size: #{32rpx};
                color: #342e25;
                position: absolute;
                text-align: center;
                left: 0;
                right: 0;
                top: 0;
                margin: #{-34rpx} auto 0;
                background-image: url('./../image/dialog-title.png');
                background-size: 100% 100%;
                background-repeat: no-repeat;;
                background-position: center center;
            }
            .log-item {
                font-size: #{32rpx};
                width: #{586rpx};
                margin: 0 auto;
                height: #{90rpx};
                line-height: #{90rpx};
                color: #000000;
                view{
                    width: #{175rpx};
                    text-align: center;
                }
            }
            .log-list {
                max-height: #{790rpx};
                min-height: #{140rpx};
                overflow-y: auto;
                .log-item {
                    border-top: 2rpx solid #e2e2e2;
                    font-size: #{28rpx};
                    color: #333333;
                }
            }
            .log-foot {
                padding: #{25rpx} 0 #{50rpx};
                width: 100%;
                .log-foot-btn {
                    height: #{88rpx};
                    width: #{586rpx};
                    text-align: center;
                    line-height: #{88rpx};
                    border-radius: #{44rpx};
                    background-color: #efc493;
                    font-size: #{32rpx};
                    color: #fff;
                    margin: 0 auto;
                }
            }
            .dialog-close {
                position: absolute;
                top: #{24rpx};
                right: #{24rpx};
                width: #{30rpx};
                height: #{30rpx};
            }
            .dialog-title {
                margin: #{34rpx} auto;
                text-align: center;
                width: 75%;
                font-size: #{32rpx};
                color: #353535;
            }
            .dialog-content {
                width: #{586rpx};
                margin: 0 auto;
                max-height: #{517rpx};
                overflow-y: auto;
                border-radius: #{15rpx};
                border: #{2rpx} solid #e2e2e2;
                padding: #{16rpx} #{32rpx};
            }
            .dialog-btn {
                position: absolute;
                bottom: 0;
                left: 0;
                width: #{650rpx};
                height: #{90rpx};
                line-height: #{90rpx};
                border-top: #{2rpx} solid #e2e2e2;
                .dialog-button {
                    width: 50%;
                    text-align: center;
                    color: #666666;
                    font-size: #{32rpx};
                }
                .dialog-button.buy {
                    color: #e5b883;
                }
                .line {
                    height: #{35rpx};
                    width: #{1rpx};
                    background-color: #e2e2e2;
                }
            }
        }
        .dialog.buy-log {
            width: #{640rpx};
            padding-top: #{92rpx};
            padding-bottom: 0;
        }
    }
</style>