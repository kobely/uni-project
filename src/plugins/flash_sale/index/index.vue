<template>
    <app-layout>
        <view class="f-switch" :style="{'background-color': getTheme.background}">
           <template v-if="!is_no_now">
               <image v-if="is_switch" src="./../image/processing.png"></image>
               <image v-else src="./../image/start.png"></image>
               <button class="button left" @click="is_switch = true"></button>
               <button class="button right" @click="is_switch = false"></button>
           </template>
            <view v-else style="font-size: 36rpx;text-align: center;color: #fff;line-height:100rpx">
                即将开始
            </view>
        </view>
        <view class="f-bulletin" :style="{'background-color': getTheme.background}" v-if="Object.keys(activity).length">
            <view>
                <view class="dir-left-nowrap main-between cross-center">
                    <view class="f-title">
                        {{activity.title}}
                    </view>
                    <view class="f-rule" @click="goRule">
                        活动规则
                        <image src="/static/image/icon/arrow-right.png"></image>
                    </view>
                </view>
                <view class="f-timing">
                    距离本场{{type === 1 ? '结束' : '开始'}}
                    <text :style="{'color': getTheme.color}">{{time_str.day}}</text>天
                    <text :style="{'color': getTheme.color}">{{time_str.hou}}</text>时
                    <text :style="{'color': getTheme.color}">{{time_str.min}}</text>分
                    <text :style="{'color': getTheme.color}">{{time_str.sec}}</text>秒
                </view>
            </view>
        </view>
        <view class="f-activity" :style="{'background-color': getTheme.background}"v-if="list.length > 0">
            <view class="f-item dir-left-nowrap"
                  @click="routeDetail(item.id)"
                  v-for="(item, index) in list" :key="index">
                <view class="f-image">
                    <view class="out-dialog" v-if="item.goods_stock == 0 && appSetting.is_show_stock == '1'">
                        <image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                    </view>
                    <image class='f-pic' :src="item.goodsWarehouse.cover_pic"></image>
                </view>
                <view class="cont">
                    <view class="dir-left-nowrap cross-center" style="overflow: hidden">
                        <view v-if="item.discount_type === 1" :style="{'background-color': getTheme.background}" class="f-discount box-grow-0">{{Number(item.min_discount)}}折</view>
                        <view v-else :style="{'background-color': getTheme.background}" class="f-discount box-grow-0">减{{item.min_discount}}元</view>
                        <view class="f-name t-omit">{{item.goodsWarehouse.name}}</view>
                    </view>
                    <view class="app-percentage" :style="{'background-color': getTheme.background_l}">
                        <view :style="{'background-color': getTheme.background,width: `${item.percentage}%`}"></view>
                    </view>
                    <view class="f-num main-between">
                        <text>{{item.sales}}</text>
                        <text :style="{'color': getTheme.color}">仅剩{{item.goods_stock}}{{item.goodsWarehouse.unit}}</text>
                    </view>
                    <view class="f-content dir-top-nowrap main-right">
                        <view v-if="item.is_level">
                            <app-member-price :theme="getTheme" :price="item.level_price"></app-member-price>
                        </view>
                        <app-sup-vip
                            :is_vip_card_user="item.vip_card_appoint.is_vip_card_user"
                            margin="4rpx 0 0"
                            v-if="item.vip_card_appoint.discount"
                            :discount="item.vip_card_appoint.discount"
                        ></app-sup-vip>
                        <view class="dir-left-nowrap main-between cross-bottom">
                            <view class="f-price dir-top-nowrap">
                                <text :style="{'color': getTheme.color}">{{item.price_content}}</text>
                                <text>￥{{item.original_price}}</text>
                            </view>
                            <button
                                :style="{'background-color': item.goods_stock === 0 && type === 1 ? '#cdcdcd' : item.buy_goods_auth || type !== 1 ? getTheme.background : '#999999'}"
                                class="f-button"
                                @click.stop="grab(item)">
                                {{type === 1 ? '马上抢' : '查看商品'}}
                            </button>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <u-attr
            v-if="detail"
            :goods="detail"
            v-model="attrShow"
            :theme="getTheme"
            :checked="selectAttr"
            :right-func="true"
            :left-func="true"
            @leftFunc="leftFunc"
            @rightFunc="rightFunc"
            @check="onAttr"
        >
        </u-attr>
        <view
            v-if="!Object.keys(activity).length && loading"
            :style="{height: (windowHeight - switch_height) + 'px','background-color': getTheme.background}"
            class="f-empty">
            <view class="f-empty-con">
                <view class="f-no">
                    <app-no-goods background="#efefef" :title="title"></app-no-goods>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapGetters, mapState } from "vuex";
    import appNoGoods from "../../../components/page-component/app-no-goods/app-no-goods.vue";
    import uAttr from '../../../components/page-component/goods/u-attr.vue';

    export default {
        name: "index",
        data() {
            return {
                is_switch: true,
                page: 1,
                type: 1,
                activity: {},
                timing: null,
                time_str: {
                    day: '00',
                    hou: '00',
                    min: '00',
                    sec: '00'
                },
                list: [],
                page_count: 1,
                detail: null,
                attr_groups: [],
                attrShow: 0,
                selectAttr: {},
                switch_height: 0,
                title: `暂无进行中活动`,
                is_no_now: false,
                going: true,
                loading: true,
				disable: 'disable'
            }
        },
        methods: {
            async getList() {
                this.loading = false;
                const e = await this.$request({
                    url: this.$api.flash_sale.list,
                    data: {
                        type: this.type,
                        page: this.page
                    }
                });
                if (e.code === 0) {
                    let { activity, list, next_activity, pagination } = e.data;
                    if (this.type === 1) {
                        this.activity = activity;

                        if (Object.keys(activity).length === 0) {
                            this.is_no_now = true;
                            this.type = 2;
                            const w = await this.$request({
                                url: this.$api.flash_sale.list,
                                data: {
                                    type: this.type,
                                    page: this.page
                                }
                            });
                            let {  list, next_activity, pagination } = w.data;
                            this.activity = next_activity;
                            this.list.push(...list);
                            this.page_count = pagination.page_count;
                        } else {
                            this.is_no_now = false;
                            this.list.push(...list);
                            this.page_count = pagination.page_count;
                        }
                    } else {
                        this.activity = next_activity;
                        this.list.push(...list);
                        this.page_count = pagination.page_count;
                    }

                }
                this.loading = true;
            },
            set_time(time_at) {
                clearInterval(this.timing);
                let time_str = new Date(time_at.replace(/-/g, '/'));
                this.now_time(time_str);
                this.timing = setInterval(() => {
                    this.now_time(time_str);
                }, 1000);
            },
            now_time(time_str) {
                let time = time_str.getTime() - new Date().getTime();
                if (time < 0) {
                    clearInterval(this.timing);
                }
                let day = parseInt(time/1000/60/60/24);
                let hou = parseInt((time/1000/60/60)%24);
                let min = parseInt((time/1000/60)%60);
                let sec = parseInt((time/1000)%60);
                this.time_str.day = day < 10 ? '0' + day : day;
                this.time_str.hou = hou < 10 ? '0' + hou : hou;
                this.time_str.min = min < 10 ? '0' + min : min;
                this.time_str.sec = sec < 10 ? '0' + sec : sec;
            },
            grab(item) {
                if (this.type === 1) {
                    this.detail = null;
                    if (item.goods_stock !== 0) {
						if (!item.buy_goods_auth) {
							this.$tips.showToast({
								title: '该商品您暂无权限购买',
								icon: 'none'
							});
							return ;
						}
                        setTimeout(() => {
                            this.selectAttr = {};
                            this.detail = item;
                            this.attrShow = true;
                        })
                    }
                } else {
                    uni.navigateTo({
                        url: `/plugins/flash_sale/goods/goods?id=${item.id}`
                    })
                }
            },
            onAttr({item}) {
                this.selectAttr = item;
            },
            routeDetail(id) {
                uni.navigateTo({
                    url: `/plugins/flash_sale/goods/goods?id=${id}`
                })
            },
            goRule() {
                uni.navigateTo({
                    url: `/pages/rules/index?url=${encodeURIComponent(this.$api.flash_sale.list)}&key=content`
                });
            },
            rightFunc(data) {
                uni.navigateTo({
                    url: `/pages/order-submit/order-submit?mch_list=${JSON.stringify([data])}`
                });
            },
            leftFunc(number) {
                this.$request({
                    url: this.$api.flash_sale.add_cart,
                    data: {
                        flash_goods_id: this.selectAttr.goods_id,
                        attr_id: this.selectAttr.id,
                        num: number
                    },
                    method: 'post'
                }).then(e => {
                    uni.showToast({
                        title: e.msg,
                        type: 'success'
                    });
                });
            }
        },
        mounted() {
            let query = wx.createSelectorQuery();
            this.$nextTick().then(() => {
                query.select('.f-switch').boundingClientRect(rect=>{
                    this.switch_height = rect.height;
                }).exec();
            });
            // #ifdef MP-WEIXIN
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline']
            })
            // #endif
        },
        onReachBottom() {
            if (this.page < this.page_count) {
                this.page++;
                this.getList();
            }
        },
        watch: {
            is_switch: {
                handler(boolean) {
                    if (this.going) {
                        this.going = false;
                        this.list = [];
                        this.page = 1;
                        if (boolean) {
                            this.type = 1;
                            this.title = '暂无进行中活动';
                        } else {
                            this.type = 2;
                            this.title = '暂无下一场活动';
                        }
                        this.getList().then(() => {
                            if (this.type === 1) {
                                let end_at = this.activity.end_at;
                                end_at ? this.set_time(end_at) : null;
                            } else {
                                let start_at = this.activity.start_at;
                                start_at ? this.set_time(start_at) : null;
                            }
                            this.going = true;
                        });
                    }
                },
                immediate: true
            }
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme'
            }),
            ...mapState('gConfig', {
                windowHeight: state => state.systemInfo.windowHeight
            }),
            ...mapState({
                appImg: state => state.mallConfig.__wxapp_img.mall,
                appSetting: state => state.mallConfig.mall.setting,
            })
        },
        components: {
            'app-no-goods': appNoGoods,
            uAttr
        },
        // #ifdef MP
        onShareAppMessage() {
            return this.$shareAppMessage({
                path: '/plugins/flash_sale/index/index',
                title: this.$children[0].navigationBarTitle
            });
        },
        // #endif
        // #ifdef MP-WEIXIN
        onShareTimeline() {
            // 分享朋友圈beta
            return this.$shareTimeline({
                title:this.$children[0].navigationBarTitle
            });
        },
        // #endif
    }
</script>

<style scoped lang="scss">
    .f-switch {
        width: 750upx;
        height: 100upx;
        position: relative;
    }
    .f-switch image {
        width: 750upx;
        height: 100upx;
        position: absolute;
        top: -1upx;
    }
    .f-switch .button {
        width: 375upx;
        height: 100upx;
        position: absolute;
        background: transparent;
        padding: 0;
        margin: 0;
        border: none;
    }
    .f-switch .right {
        right: 0;
    }
    .f-switch .left {
        left: 0;
    }
    .f-bulletin {
        padding: 20upx 24upx;
        .f-title {
            font-size: 32upx;
            font-weight: bold;
            color: #353535;

        }
        .f-rule {
            font-size: 26upx;
            color: #666;
            vertical-align: middle;
            >image {
                width: 12upx;
                height: 22upx;
                margin-left: 14upx;
            }
        }
        .f-timing {
            margin-top: 18upx;
            font-size: 26upx;
            color: #353535;
            >text:first-child {
                margin-left: 18upx;
            }
        }
    }
    .f-bulletin>view {
        background-color: #fff;
        border-radius: 15upx;
        height: 147upx;
        padding: 32upx 24upx;
    }
    .f-activity {
        padding: 0 24upx;
        overflow: auto;
        position: absolute;
        width: 750upx;
        min-height: calc(100vh - 287rpx);
        .f-item {
            background-color: #fff;
            border-radius: 15upx;
            padding: 24upx;
            margin-bottom: 20upx;
            .f-pic {
                width: 240upx;
                height: 240upx;
                border-radius: 8upx;
            }
            >view.cont {
                width: 394upx;
                margin-left: 24upx;
                position: relative;
            }
            .f-name {
                font-size: 28upx;
                color: #353535;
                min-width: 304upx;
            }
            .f-discount {
                height: 26upx;
                color: #fff;
                font-size: 20upx;
                margin-right: 10upx;
                text-align: center;
                line-height: 26upx;
                border-radius: 7upx;
                padding: 0 5upx;
            }
            .f-num {
                font-size: 24upx;
                margin-top: 10upx;
            }
            .f-num>text:first-child {
                color: #666;
            }
            .f-button {
                height: 68upx;
                line-height: 68upx;
                width: 164upx;
                border-radius: 34upx;
                font-size: 26upx;
                color: #fff;
                margin: 0;
                padding: 0;
                text-align: center;
                border: none;
            }
            .f-content {
                position: absolute;
                bottom: 0;
                width: 394upx;
            }
            .f-price>text:first-child {
                font-size: 32upx;
            }
            .f-price>text:last-child {
                font-size: 25upx;
                color: #999;
                text-decoration: line-through;
            }
            .app-percentage {
                width: #{395rpx};
                height: #{20rpx};
                border-radius: #{12rpx};
                margin-top: #{10rpx};
                overflow: hidden;
                >view {
                    height: #{20rpx};
                    border-radius: #{12rpx};
                }
            }
            .f-sold-out {
                background-color: #cdcdcd;
            }
        }
    }
    .f-empty {
        width: 750upx;
        padding: 20upx 24upx;
        .f-empty-con {
            height: 100%;
            background: #efefef;
            border-radius: 15upx;
            position: relative;
        }
        .f-no {
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    .out-dialog {
        border-top-left-radius: 15upx;
        border-top-right-radius: 15upx;
        width: 240upx;
        height: 240upx;
        position: absolute;
        top: 0;
        z-index: 10;
        left: 0;
        background-color: rgba(0,0,0,.5);
        image {
            width: 240upx;
            height: 240upx;
        }
    }
    .f-image {
        position: relative;
    }
</style>
