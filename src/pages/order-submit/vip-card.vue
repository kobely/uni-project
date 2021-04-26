<template>
    <app-layout>
        <view class="page" v-if="card">
            <view class="main-card"
                  :style="{
                  backgroundImage: `url(${appImg.vip_card.default_card})`,
                  }">
                <view class="name">{{card.name}}</view>
                <view style="margin-bottom: 24rpx">开通超级会员可以享受以下权益</view>
                <view class="dir-left-nowrap cross-center">
                    <image src="/static/image/icon/vip-card-coupon.png"
                           style="width: 42rpx; height: 30rpx; margin-right: 18rpx"></image>
                    <view style="margin-right: 50rpx">{{card.discount == 0 ? '免费' : card.discount + '折'}}</view>
                    <template v-if="card.is_free_delivery == 1 || true">
                        <image src="/static/image/icon/vip-card-delivery.png"
                               style="width: 38rpx; height: 32rpx; margin-right: 18rpx"></image>
                        <view style="margin-right: 32rpx">自营商品包邮</view>
                    </template>
                    <view @click="navigateVipCardPrivilege" style="color: #b17426;">
                        <text>查看权益 ></text>
                    </view>
                </view>
            </view>
            <view v-for="(item, index) in card.detail"
                  :key="index"
                  @tap="active(index)"
                  class="child-card dir-left-nowrap cross-center"
                  :class="[item.active?'active':'']">
                <view class="box-grow-1">
                    <view style="margin-bottom: 12rpx;">{{item.name}}</view>
                    <view class="dir-left-nowrap" style="font-size: 24rpx;">
                        <view v-if="item.active"
                              @tap.stop="showDesc(item)"
                              class="dir-left-nowrap cross-center">
                            <view style="color: #ffb85d;margin-right: 8rpx; font-size: 22rpx; line-height: 1.05;">使用说明
                            </view>
                            <app-css-icon icon="arrow-right" size="22" padding round color="#fff"
                                          background="#ffb85d"></app-css-icon>
                        </view>
                        <view v-else
                              @tap.stop="showDesc(item)"
                              class="dir-left-nowrap cross-center">
                            <view style="color: #999;margin-right: 8rpx; font-size: 22rpx; line-height: 1.05;">使用说明
                            </view>
                            <app-css-icon icon="arrow-right" size="22" padding round color="#fff"
                                          background="#999"></app-css-icon>
                        </view>
                    </view>
                </view>
                <view class="box-grow-0 dir-left-nowrap cross-center">
                    <view class="price" :style="{'color': theme.color}"
                          style="margin-right: 24rpx">
                        ¥{{item.price}}
                    </view>
                    <view v-if="item.active" class="checkbox"
                          :style="{'background-color': theme.background, 'border-color': theme.border}">
                        <app-css-icon v-if="item.active"
                                      icon="check"
                                      :size="28"
                                      color="#fff"
                                      transform="translate(28%, -15%)"></app-css-icon>
                    </view>
                    <view v-else class="checkbox border-gray"></view>
                </view>
            </view>

            <view class="submit-bar dir-left-nowrap">
                <view class="box-grow-1 cross-center price"
                      :style="{'color': theme.color}">
                    <template v-if="selectedCard">开卡费用：¥{{selectedCard.price}}</template>
                    <template v-else>请选择需要开通的子卡</template>
                </view>
                <view @click="setData"
                      class="box-grow-0 cross-center submit-btn"
                      :style="{'background-color': theme.background}">提交
                </view>
            </view>
            <app-dialog :title="descDialog.title"
                        :content="descDialog.content"
                        confirm-text="我知道了"
                        :visible.sync="descDialog.visible"></app-dialog>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters} from 'vuex';
    import AppCheckBox from "../../components/basic-component/app-check-box/app-check-box";
    import AppDialog from "./app-dialog";

    export default {
        name: 'vip-card',
        components: {AppDialog, AppCheckBox},
        data() {
            return {
                mchIndex: null,
                card: null,
                selectedCard: null,
                list: null,
                descDialog: {
                    title: '',
                    content: '',
                    visible: false,
                },
            };
        },
        computed: {
            ...mapGetters({
                appImg: 'mallConfig/getWxappImg',
                theme: 'mallConfig/getTheme',
            }),
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.mchIndex = options.mchIndex;
            this.loadData();
            setTimeout(() => {
                this.list = [1, 2, 3];
            }, 500);
        },
        methods: {
            navigateVipCardPrivilege() {
                uni.navigateTo({
                    url: '/plugins/vip_card/rights/rights?id=1',
                });
            },
            loadData() {
                uni.showNavigationBarLoading({});
                this.$request({
                    url: this.$api.vip_card.card,
                }).then(e => {
                    uni.hideNavigationBarLoading({});
                    if (e.code === 0) {
                        for (let i in e.data.detail) {
                            e.data.detail[i].active = false;
                        }
                        this.card = e.data;
                        this.setActive();
                    }
                }).catch(e => {
                    uni.hideNavigationBarLoading({});
                });
            },
            active(index) {
                if (this.card.detail[index].active) {
                    // 取消操作
                    this.selectedCard = null;
                    this.card.detail[index].active = false;
                } else {
                    for (let i in this.card.detail) {
                        if (parseInt(i) === parseInt(index)) {
                            this.selectedCard = this.card.detail[i];
                            this.card.detail[i].active = true;
                        } else {
                            this.card.detail[i].active = false;
                        }
                    }
                }
            },
            showDesc(item) {
                this.descDialog.title = item.title;
                this.descDialog.content = item.content;
                this.descDialog.visible = true;
            },
            setActive() {
                const formData = this.$store.state.orderSubmit.formData;
                const id = formData.list[this.mchIndex].vip_card_detail_id;
                if (!id) return;
                for (let i in this.card.detail) {
                    if (parseInt(this.card.detail[i].id) === parseInt(id)) {
                        this.card.detail[i].active = true;
                        this.selectedCard = this.card.detail[i];
                    }
                }
            },
            setData() {
                const formData = this.$store.state.orderSubmit.formData;
                if (this.selectedCard) {
                    formData.list[this.mchIndex].vip_card_detail_id = parseInt(this.selectedCard.id);
                } else {
                    formData.list[this.mchIndex].vip_card_detail_id = null;
                }
                this.$store.commit('orderSubmit/mutSetFormData', formData);
                uni.navigateBack();
            },
        }
    }
</script>

<style lang="scss">
    page {
        background: $uni-weak-color-two;
    }

    .page {
        padding-bottom: #{120rpx};
    }

    .main-card,
    .child-card {
        padding: #{56rpx};
        border-radius: #{16rpx};
        margin: #{24rpx};
    }

    .main-card {
        background: #d6aa84;
        color: #342e25;
        background-size: 100% 100%;
        height: #{361rpx};
        font-size: #{24rpx};
        margin-bottom: #{30rpx};
        box-shadow: 0 0 #{24rpx} rgba(0, 0, 0, .15);

        .name {
            font-size: #{40rpx};
            margin-bottom: #{32rpx};
        }
    }

    .child-card {
        background: #fff;
        position: relative;
        overflow: hidden;
        z-index: 1;
        border: #{1rpx} solid #e5e5e5;

        .price {
            font-size: #{40rpx};
            font-weight: bold;
        }

    }

    .submit-bar {
        position: fixed;
        z-index: 100;
        left: 0;
        bottom: 0;
        width: 100%;
        background: #fff;
        height: #{100rpx};
        border-top: #{1rpx} solid rgba(0, 0, 0, 0.1);

        .price {
            padding: 0 #{24rpx};
        }

        .submit-btn {
            padding: 0 #{48rpx};
            color: #fff;
        }
    }

    .checkbox {
        width: #{46rpx};
        height: #{46rpx};
        border-radius: #{1000rpx};
        border-width: #{2rpx};
        border-style: solid;
    }

    .checkbox.border-gray {
        border-color: #ccc;
    }

</style>