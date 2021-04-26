<template>
    <app-layout>
        <view v-if="status == 1">
            <!-- 用户信息开始 -->
            <view class="info" :style="{'background-image': 'url('+share_setting.pic_url_home_head + ')'}">
                <view v-if="userInfo" class="user-info dir-left-nowrap cross-center">
                    <image class="user-avatar box-grow-0" :src="userInfo.avatar"></image>
                    <view class="box-grow-1 dir-top-nowrap main-center">
                        <view class="user-name t-omit">{{name ? name:userInfo.nickname}}</view>
                        <view class="mtb-10 t-omit">{{custom_setting.words.parent_name.name}}：{{userInfo.identity.parent_name}}</view>
                        <view v-if="index">分销等级：{{index.level_name ? index.level_name : '无'}}</view>
                    </view>
                    <view class="box-grow-0" v-if="share_setting.is_show_share_level == 1"
                          @click="$jump({url: '/pages/share/level/level', open_type: 'navigate'})">升级条件</view>
                    <image class="box-grow-0 arrow-right" v-if="share_setting.is_show_share_level == 1"
                           src="/static/image/icon/arrow-right-white.png"></image>
                </view>
                <view class="share-info">
                    <view>{{custom_setting.words.can_be_presented.name}}</view>
                    <view>
                        <text style="font-family:DIN">{{index.money?index.money:0}}</text>元</view>
                </view>
                <view @click="jump('/pages/share/cash/cash?money=' + index.money)">
                    <view class="withdraw-btn">{{custom_setting.words.cash.name}}</view>
                </view>
            </view>
            <!-- 佣金情况开始 -->
            <view class="nav main-justify cross-center">
                <view class="nav-left">
                    <view class="nav-title">{{custom_setting.words.already_presented.name}}</view>
                    <view>{{index.cash_money?index.cash_money:0}}元</view>
                </view>
                <view>
                    <view class="nav-title">{{custom_setting.words.order_money_un.name}}</view>
                    <view>{{index.order_money_un?index.order_money_un:0}}元</view>
                </view>
            </view>
            <!-- 功能菜单开始 -->
            <view class="list dir-left-wrap">
                <!-- 分销佣金 -->
                <view class="list-item">
                    <view @click="jump('/pages/share/money/money')">
                        <image :src="custom_setting.menus.money.icon"></image>
                        <view>{{custom_setting.menus.money.name}}</view>
                        <view>
                            <text>{{index.total_money?index.total_money:0}}</text>元
                        </view>
                    </view>
                </view>
                <!-- 分销订单 -->
                <view class="list-item">
                    <view @click="jump('/pages/share/order/order')">
                        <image :src="custom_setting.menus.order.icon"></image>
                        <view>{{custom_setting.menus.order.name}}</view>
                        <view>
                            <text>{{index.order_money?index.order_money:0}}</text>元
                        </view>
                    </view>
                </view>
                <!-- 提现明细 -->
                <view class="list-item">
                    <view @click="jump('/pages/share/cash-detail/cash-detail')">
                        <image :src="custom_setting.menus.cash.icon"></image>
                        <view>{{custom_setting.menus.cash.name}}</view>
                        <view>
                            <text>{{index.total_cash?index.total_cash:0}}</text>元
                        </view>
                    </view>
                </view>
                <!-- 我的团队 -->
                <view class="list-item">
                    <view @click="jump('/pages/share/team/team')">
                        <image :src="custom_setting.menus.team.icon"></image>
                        <view>{{custom_setting.menus.team.name}}</view>
                        <view>
                            <text>{{index.team_count?index.team_count:0}}</text>人
                        </view>
                    </view>
                </view>
                <!-- 推广二维码 -->
                <view class="list-item">
                    <view @click="jump('/pages/share/qrcode/qrcode')">
                        <image :src="custom_setting.menus.qrcode.icon"></image>
                        <view>{{custom_setting.menus.qrcode.name}}</view>
                    </view>
                </view>
                <!-- 团队分红 -->
                <view v-if="setting && setting.is_bonus == 1" class="list-item">
                    <view @click="jump('/plugins/bonus/index/index')">
                        <image src="./../image/img-bonus-price.png"></image>
                        <view>{{setting.form.entry_bonus?setting.form.entry_bonus:"团队分红"}}</view>
                    </view>
                </view>
                <!-- 股东分红 -->
                <view v-if="stock && stock.is_stock == 1" class="list-item">
                    <view @click="jump('/plugins/stock/index/index?name=' + share.name + '&mobile=' + share.mobile)">
                        <image src="/static/image/share/img-stock-price.png"></image>
                        <view>{{stock.form.entry_bonus?stock.form.entry_bonus:"股东分红"}}</view>
                    </view>
                </view>
                <!-- 股东分红 -->
                <view v-if="region && region.is_region == 1" class="list-item">
                    <view @click="jump('/plugins/region/index/index?name=' + share.name + '&mobile=' + share.mobile)">
                        <image src="/static/image/share/img-region-price.png"></image>
                        <view>{{region.form.entry_bonus?region.form.entry_bonus:"区域代理"}}</view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 不是分销商 -->
        <view class="no-pass" v-else-if="status == 2">
            <image class="no-pass-img" src="./../image/icon-share-tip.png"></image>
            <view>您还不是{{custom_setting.words.share_name.name ? custom_setting.words.share_name.name : custom_setting.words.share_name.default}}，请先提交申请！</view>
            <view v-if="share_setting.share_condition == '2' || share_setting.share_condition == '4'" @click="jump('/pages/share/add/add?template_message=' + JSON.stringify(template_message))">
                <button :class="['no-pass-btn']">立即前往</button>
            </view>
            <view v-else @click="toApply">
                <button :class="['no-pass-btn']">立即申请</button>
            </view>
        </view>
        <view v-else-if="status == 0">
            <image :src="share_setting.pic_url_status" class="add-bg"></image>
            <view class="thx">
                <image src="./../image/img-share-info.png"></image>
                <view>谢谢您的支持，请等待审核</view>
            </view>
            <view @click="jump('/pages/index/index')">
                <view class="submit" style="margin:0">
                    <button >去商城逛逛</button>
                </view>
            </view>
        </view>
        <view class="status-3 dir-top-nowrap" v-else-if="status == 3">
            <image :src="share_setting.pic_url_status" class="add-bg"></image>
            <template v-if="share_setting.become_condition == 1">
                <view class="apply-status-3">
                    <view class="dir-left-nowrap">
                        <image class="money" src="./../image/money.png"></image>
                        <view class="progress box-grow-0 cross-center">
                            <view class="progress-content" :style="{left: `${percent}%`}">
                                <view class="dir-top-nowrap cross-center" style="margin-left: -90%;">
                                    <view class="q-price">{{order_price}}</view>
                                    <view class="shuxian"></view>
                                    <image class="icon" src="./../image/progress.png"></image>
                                </view>
                            </view>
                            <view style="width: 100%;">
                                <progress :percent="percent" stroke-width="5" activeColor="#ff4544" backgroundColor="#e3e3e3" />
                            </view>
                        </view>
                        <image class="money" src="./../image/money-active.png"></image>
                    </view>
                    <view class="dir-left-nowrap cross-center price">
                        <view class="box-grow-0">￥0</view>
                        <view class="progress box-grow-1"></view>
                        <view class="box-grow-0">￥{{share_setting.auto_share_val}}</view>
                    </view>
                    <view class="content">单次消费满<text>￥{{share_setting.auto_share_val}}</text>可{{condition}}成为{{custom_setting.words.share_name.name ? custom_setting.words.share_name.name : custom_setting.words.share_name.default}}</view>
                    <view class="content">您最高一次单次消费为<text>￥{{order_price}}</text></view>
                    <view @click="$jump({url: '/pages/goods/list', open_type: 'navigate'})">
                        <view class="submit">
                            <button >去商城逛逛</button>
                        </view>
                    </view>
                </view>
            </template>
            <template v-else-if="share_setting.become_condition == 4">
                <view class="apply-status-3">
                    <view class="dir-left-nowrap">
                        <image class="money" src="./../image/money.png"></image>
                        <view class="progress box-grow-0 cross-center">
                            <view class="progress-content" :style="{left: `${percent}%`}">
                                <view class="dir-top-nowrap cross-center" style="margin-left: -90%;">
                                    <view class="q-price">{{order_price}}</view>
                                    <view class="shuxian"></view>
                                    <image class="icon" src="./../image/progress.png"></image>
                                </view>
                            </view>
                            <view style="width: 100%;">
                                <progress :percent="percent" stroke-width="5" activeColor="#ff4544" backgroundColor="#e3e3e3" />
                            </view>
                        </view>
                        <image class="money" src="./../image/money-active.png"></image>
                    </view>
                    <view class="dir-left-nowrap cross-center price">
                        <view class="box-grow-0">￥0</view>
                        <view class="progress box-grow-1"></view>
                        <view class="box-grow-0">￥{{share_setting.total_consume}}</view>
                    </view>
                    <view class="content">累计消费满<text>￥{{share_setting.total_consume}}</text>可{{condition}}成为{{custom_setting.words.share_name.name ? custom_setting.words.share_name.name : custom_setting.words.share_name.default}}</view>
                    <view class="content">您累计消费为<text>￥{{order_price}}</text></view>
                    <view @click="$jump({url: '/pages/goods/list', open_type: 'navigate'})">
                        <view class="submit">
                            <button >去商城逛逛</button>
                        </view>
                    </view>
                </view>
            </template>
            <template v-else-if="share_setting.share_goods_status == 1">
                <view class="share-goods-status-1">
                    <view class="content">购买<text>任意商品</text>可{{condition}}成为{{custom_setting.words.share_name.name ? custom_setting.words.share_name.name : custom_setting.words.share_name.default}}</view>
                    <view @click="$jump({url: '/pages/goods/list', open_type: 'navigate'})">
                        <view class="submit">
                            <button >去商城逛逛</button>
                        </view>
                    </view>
                </view>
            </template>
            <template v-else-if="share_setting.share_goods_status == 2">
                <view class="share-goods-status-1 box-grow-1 dir-top-nowrap">
                    <view class="content">购买以下<text>指定商品</text>可{{condition}}成为{{custom_setting.words.share_name.name ? custom_setting.words.share_name.name : custom_setting.words.share_name.default}}</view>
                    <view class="box-grow-1" style="background-color: #f7f7f7">
                        <view class="dir-left-nowrap goods-title main-center cross-center">
                            <view class="border"></view>
                            <image src="/static/image/icon/icon-favorite.png"></image>
                            <view>指定商品</view>
                            <view class="border"></view>
                        </view>
                        <view>
                            <u-ordinary-list :isShowAttr="true" :list="goods_list" :theme="getTheme" :list-style="2"></u-ordinary-list>
                        </view>
                    </view>
                </view>
            </template>
            <template v-else-if="share_setting.share_goods_status == 3">
                <view class="share-goods-status-1 box-grow-1 dir-top-nowrap">
                    <view class="content">购买以下<text>指定分类商品</text>可{{condition}}成为{{custom_setting.words.share_name.name ? custom_setting.words.share_name.name : custom_setting.words.share_name.default}}</view>
                    <view class="box-grow-1" style="background-color: #f7f7f7">
                        <view class="dir-left-nowrap goods-title main-center cross-center">
                            <view class="border"></view>
                            <image src="/static/image/icon/icon-favorite.png"></image>
                            <view>指定分类</view>
                            <view class="border"></view>
                        </view>
                        <view class="dir-left-wrap cat-list">
                            <block v-for="(item, index) in cat_list" :key="index">
                                <view class="cat-item t-omit" @click="toGoods(item.value)">{{item.label}}</view>
                            </block>
                        </view>
                    </view>
                </view>
            </template>
        </view>
        <view v-else-if="status == 4 || status == 5">
            <image :src="share_setting.pic_url_status" class="add-bg"></image>
            <view class="thx">
                <image class="warning" src="./../image/warning.png"></image>
                <template v-if="status == 4">
                    <view class="apply-status-4">您的申请被拒绝</view>
                    <view style="text-align: left">
                        <text style="color: #999;">审核时间：</text>
                        <text>{{share.apply_at}}</text>
                    </view>
                    <view style="text-align: left">
                        <text style="color: #999;">拒绝理由：</text>
                        <text>{{share.reason}}</text>
                    </view>
                </template>
                <template v-if="status == 5">
                    <view class="apply-status-4">您被解除{{custom_setting.words.share_name.name ? custom_setting.words.share_name.name : custom_setting.words.share_name.default}}身份</view>
                    <view style="text-align: left">
                        <text style="color: #999;">解除时间：</text>
                        <text>{{share.deleted_at}}</text>
                    </view>
                    <view style="text-align: left">
                        <text style="color: #999;">解除理由：</text>
                        <text>{{share.reason}}</text>
                    </view>
                </template>
            </view>
            <view @click="againApply" class="submit again-apply main-center" style="margin:0">
                <button>再次申请</button>
            </view>
        </view>
        <view class="dir-top-nowrap cross-center disabled" v-else-if="status == 6">
            <image src="./../image/disabled.png" class="disabled-img"></image>
            <view class="disabled-text">当前功能未开放</view>
            <view class="disabled-btn" @click="jump('/pages/index/index')">去商城逛逛</view>
        </view>
        <view class="bg" v-if="apply">
            <view class="dialog">
                <view class="dialog-title">提示</view>
                <view class="dialog-msg">是否申请成为{{custom_setting.words.share_name.name ? custom_setting.words.share_name.name : custom_setting.words.share_name.default}}</view>
                <view class="dialog-btn main-center">
                    <view @click="toApply" class="dialog-close">取消</view>
                    <view class="line"></view>
                    <view class="dialog-submit" @click="subscribe">确认</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapGetters, mapState } from "vuex";
    import uOrdinaryList from '../../../components/page-component/u-goods-list/u-ordinary-list.vue';

    export default {
        components: {
            uOrdinaryList
        },
        data() {
            return {
                setting: null,
                status: -1,
                customize: [],
                name: null,
                first: false,
                page_loading: true,
                inApply: false,
                apply: false,
                template_message: null,
                index: [],
                order_price: null,
                goods_list: null,
                cat_list: null,
                share: null,
                stock: null,
                region: null,
                is_can_apply: false
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                custom_setting: state => state.mallConfig.share_setting_custom,
                share_setting: state => state.mallConfig.share_setting,
                mall: state => state.mallConfig.mall
            }),
            percent() {
                if (this.order_price === null) {
                    return 0;
                } else if (this.share_setting.become_condition == 1 ) {
                    return parseFloat(this.order_price) / parseFloat(this.share_setting.auto_share_val) * 100;
                } else if (this.share_setting.become_condition == 4 ) {
                    // TODO 未完成
                    return parseFloat(this.order_price) / parseFloat(this.share_setting.total_consume) * 100;
                }
            },
            condition() {
                if (this.share_setting.share_condition == 3) {
                    return '自动';
                } else {
                    return '申请';
                }
            },
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme'
            })
        },
        methods: {
            toApply() {
                this.apply = !this.apply;
            },
            jump(url) {
                uni.navigateTo({
                    url: url
                })
            },
            subscribe() {
                this.$subscribe(this.template_message).then(() => {
                    this.submit();
                }).catch(() => {
                    this.submit();
                });
            },
            submit() {
                let that = this;
                uni.showLoading({
                    title: '提交中...'
                });
                if(that.inApply) {
                    return false
                }
                that.inApply = true;
                that.$request({
                    url: that.$api.share.apply,
                    data: {
                        name: that.userInfo.nickname,
                        mobile: that.userInfo.mobile
                    },
                    method: 'post'
                }).then(response=>{
                    that.inApply = false;
                    uni.hideLoading();
                    if(response.code === 0) {
                        that.status = 0;
                        if (that.share_setting.share_condition == '3') {
                            that.status = 1;
                        }
                        that.apply = false;
                        that.getStatus();
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    uni.hideLoading();
                });
            },
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.share.index,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code === 0) {
                        that.index = response.data.list;
                        that.setting = response.data.bonus_setting.list;
                        that.stock = response.data.stock_setting;
                        that.region = response.data.region_setting;
                    }else {
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
            getStatus() {
                let that = this;
                that.$request({
                    url: that.$api.share.new_apply_status,
                }).then(response=>{
                    that.first = true;
                    if(response.code === 0) {
                        that.template_message = response.data.template_message;
                        that.status = response.data.status;
                        that.share = response.data.share;
                        that.order_price = response.data.orderPrice;
                        that.goods_list = response.data.goodsList;
                        that.cat_list = response.data.catList;
                        that.is_can_apply = response.data.is_can_apply;
                        if (that.status == 1) {
                            that.getList();
                            let name = response.data.share.name;
                            if (that.share_setting.share_condition == '3') {
                                name = that.userInfo.nickname
                            }
                            that.name = name;
                        } else if (that.status == 2) {
                            that.$hideLoading();
                            if (that.share_setting.share_condition != 2 && this.share_setting.share_condition != 4) {
                                that.apply = true;
                            }
                        }else {
                            that.$hideLoading();
                        }
                    }else {
                        that.$hideLoading();
                        uni.showModal({
                            content: response.msg,
                            showCancel: false
                        })
                    }
                }).catch(() => {
                    that.$hideLoading();
                    that.$event.on(that.$const.EVENT_USER_LOGIN).then(()=>{
                        that.$store.dispatch('user/info');
                        that.getStatus();
                    });
                });
            },
            againApply() {
                if (this.is_can_apply) {
                    if (this.share_setting.share_condition != 2 && this.share_setting.share_condition != 4) {
                        this.apply = true;
                    } else {
                        this.jump('/pages/share/add/add?template_message=' + JSON.stringify(this.template_message));
                    }
                } else {
                    this.status = 3;
                }
            },
            toGoods(cat_id) {
                this.$jump({
                    url: '/pages/goods/list?cat_id=' + cat_id,
                    open_type: 'navigate'
                });
            }
        },
        onLoad() { this.$commonLoad.onload();
            if (this.$user.isLogin()) {
                this.$store.dispatch('user/refreshInfo');
            }
            this.$showLoading({
                type: 'global',
                text: '加载中...'
            });
            this.getStatus();
        },
        onShow() {
            let that = this;
            if(that.first) {
                that.getStatus();
            }
        }
    }
</script>

<style scoped lang="scss">
    .info {
        height: #{312rpx};
        background-color: #ff4544;
        width: 100%;
        padding: #{20rpx} #{25rpx} 0;
        color: #fff;
        font-size: #{28rpx};
        background-repeat: no-repeat;
        background-size: #{750rpx} #{312rpx};
    }
    .user-info {
        border-bottom: #{1rpx} solid #FFFFFF;
        padding-bottom: #{20rpx};
        .arrow-right {
            width: #{12rpx};
            height: #{22rpx};
            margin-left: #{12rpx};
            display: block;
        }
    }
    .user-avatar {
        width: #{120rpx};
        height: #{120rpx};
        border-radius: 50%;
        font-size: #{26rpx};
        margin-right: #{40rpx};
    }
    .user-name {
        font-size: #{36rpx};
    }
    .mtb-10 {
        margin: #{10rpx 0};
    }
    .share-info {
        float: left;
        margin-top: #{20rpx};
        font-size: #{28rpx};
    }
    .share-info text {
        font-size: #{46rpx};
    }
    .withdraw-btn {
        float: right;
        width: #{105rpx};
        border-radius: #{28rpx};
        height: #{56rpx};
        line-height: #{54rpx};
        font-size: #{28rpx};
        color: #fff;
        background-color: auto;
        text-align: center;
        border: #{2rpx} solid #fff;
        padding: 0;
        margin-top: #{48rpx};
    }
    .withdraw-btn::after {
        border: 0;
    }
    .nav {
        background-color: #fff;
        height: #{160rpx};
        padding: #{40rpx} 0;
        text-align: center;
        font-size: #{30rpx};
        color: #666;
        width: #{702rpx};
        margin: #{16rpx} auto 0;
        border-radius: #{10rpx};
    }
    .nav>view {
        width: 50%;
        text-align: center;
    }
    .nav-left {
        margin-left: #{-1rpx};
        border-right: #{1rpx} solid #bbb;
    }
    .nav-title {
        font-size: #{26rpx};
        color: #ff8f17;
        margin-bottom: #{10rpx};
    }
    .nav-left .nav-title {
        color: #22af19;
    }
    .list {
        margin: #{16rpx} auto 0;
        background-color: #fff;
        width: #{702rpx};
        border-radius: #{10rpx};
    }
    .list-item {
        height: #{220rpx};
        width: #{234rpx};
        text-align: center;
        padding-top: #{57rpx};
        font-size: #{24rpx};
        color: #666;
    }
    .list-item image {
        height: #{61rpx};
        width: #{61rpx};
        vertical-align: top;
        margin-top: #{-10rpx};
        margin-bottom: #{10rpx};
    }
    .list-item text {
        color: #ff6868;
    }
    .list-item.no-border {
        border-bottom: 0;
    }
    .no-pass {
        position: absolute;
        left: 0;
        right: 0;
        height: 100%;
        width: 100%;
        background-color: #fff;
        text-align: center;
        padding-top: #{150rpx};
        color: #666;
        font-size: #{30rpx};
    }
    .no-pass-img {
        height: #{240rpx};
        width: #{420rpx};
        margin-bottom: #{80rpx};
    }
    .no-pass-btn {
        height: #{80rpx};
        width: #{560rpx};
        border-radius: #{40rpx};
        margin: #{88rpx} auto 0;
        color: #fff;
        font-size: #{30rpx};
        line-height: #{80rpx};
        background: #ff4544;
    }
    .withdraw-btn:active {
        background-color: rgba(0, 0, 0, 0.2);
    }
    .add-bg {
        height: #{300rpx};
        width: 100%;
        display: block;
        margin-bottom: #{20rpx};
        background-color: #f7f7f7;
    }
    .thx {
        padding: #{100rpx};
        text-align: center;
        color: #666;
        font-size: #{30rpx};
    }
    .thx image {
        height: #{80rpx};
        width: #{80rpx};
        margin-bottom: #{50rpx};
    }
    .submit {
        background-color: #f7f7f7;
        margin: 0 #{-24rpx};
        padding: #{24rpx};
    }
    .submit button {
        color: #fff;
        font-size: #{30rpx};
        font-weight: bold;
        height: #{100rpx};
        border-radius: #{50rpx};
        line-height: #{100rpx};
        background: #ff4544;
    }
    .bg {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, .3);
        z-index: 10;
    }
    .dialog {
        position: fixed;
        top: #{400rpx};
        left: 0;
        right: 0;
        height: #{300rpx};
        width: #{640rpx};
        margin: 0 auto;
        z-index: 21;
        background-color: #fff;
        border-radius: 10px;
        text-align: center;
        font-size: #{30rpx};
    }
    .dialog-title {
        margin: #{40rpx} auto #{35rpx};
    }
    .dialog-btn {
        height: #{88rpx};
        width: #{640rpx};
        border-top: #{1rpx} solid #e2e2e2;
        line-height: #{88rpx};
        position: absolute;
        bottom: 0;
        left: 0;
    }
    .dialog-close,.dialog-submit {
        width: 50%;
    }
    .line {
        height: #{44rpx};
        margin-top: #{22rpx};
        width: #{1rpx};
        background-color: #e2e2e2;
    }
    .dialog-submit {
        color: #ff4544;
    }
    .apply-status-4 {
        border-bottom: #{1rpx solid #e2e2e2};
        padding-bottom: #{32rpx};
        margin-bottom: #{32rpx};
        font-size: $uni-font-size-import-one;
        color: #353535;
    }
    .thx image.warning {
        width: #{160rpx};
        height: #{160rpx};
    }
    .again-apply {
        button {
            width: #{320rpx};
        }
    }
    .status-3 {
        background-color: #ffffff;
        min-height: 100vh;
        .submit {
            background-color: #ffffff;
            margin-top: #{160rpx};
            margin-left: 0;
            margin-right: 0;
        }
    }
    .apply-status-3 {
        padding: #{0 24rpx};
        margin-top: #{57rpx};
        .money {
            width: #{125rpx};
            height: #{100rpx};
            display: block;
        }
        .progress {
            width: #{470rpx};
            border-radius: #{5rpx};
            position: relative;
            .progress-content {
                position: absolute;
                top: -10rpx;
                z-index: 10;
                text-align: center;
                font-size: $uni-font-size-weak-one;
                .shuxian {
                    width: #{2rpx};
                    height: #{13rpx};
                    border: #{1rpx solid #eeeeee};
                }
                .icon {
                    width: #{35rpx};
                    height: #{35rpx};
                    display: block;
                }
                .q-price {
                    color: #ff4544;
                    &:before {
                        content: '￥';
                    }
                }
            }
        }
        .price {
            text-align: center;
            color: #999999;
            margin-left: #{20rpx};
            view:last-child {
                color: #ff4544;
            }
        }
        .content {
            text-align: center;
            color: #353535;
            font-size: #{35rpx};
            margin-top: #{47rpx};
            text {
                color: #ff4544;
                font-size: #{45rpx};
            }
        }
    }
    .share-goods-status-1 {
        .content {
            text-align: center;
            color: #353535;
            font-size: #{35rpx};
            margin-top: #{60rpx};
            margin-bottom: #{80rpx};
            text {
                color: #ff4544;
                font-size: #{45rpx};
            }
        }
        .goods-title {
            color: #a6a6a6;
            margin-top: #{36rpx};
            margin-bottom: #{34rpx};
            .border {
                width: #{40rpx};
                border: #{1rpx solid #a6a6a6};
                &:first-child {
                    margin-right: #{24rpx};
                }
                &:last-child {
                    margin-left: #{24rpx};
                }
            }
            image {
                width: #{24rpx};
                height: #{24rpx};
                display: block;
                margin-right: #{12rpx};
            }
        }
    }

    .cat-list {
        padding: #{0 24rpx};
        .cat-item {
            width: #{221rpx};
            padding: #{10rpx 27rpx};
            font-size: $uni-font-size-general-one;
            border-radius: #{30rpx};
            border: #{2rpx solid #e2e2e2};
            background-color: #ffffff;
            margin-right: #{18rpx};
            margin-bottom: #{34rpx};
            text-align: center;
        }
    }

    .disabled {
        padding-top: #{156rpx};

        .disabled-img {
            width: #{240rpx};
            height: #{237rpx};
            display: block;
        }

        .disabled-text {
            font-size: $uni-font-size-general-two;
            color: #999999;
            margin-top: #{62rpx};
        }

        .disabled-btn {
            margin-top: #{80rpx};
            width: #{320rpx};
            height: #{80rpx};
            font-size: $uni-font-size-import-two;
            color: #ffffff;
            background: #ff4544;
            border-radius: #{40rpx};
            text-align: center;
            line-height: #{80rpx};
        }
    }
</style>
