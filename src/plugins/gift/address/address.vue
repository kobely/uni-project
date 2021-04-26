<template>
    <app-layout>
        <view class="address" v-if="loading">

            <app-submit-address
                    v-bind:previewData="previewData"
                    v-bind:theme="theme"
                    v-bind:address="address"
                    v-bind:name="name"
                    v-bind:mobile="mobile"
                    v-bind:goods_id="goods_id"
                    v-bind:user_order_id="user_order_id"
                    v-bind:store_list="store_list"
                    v-bind:store_index="store_index"
                    v-on:setMethod="setMethod"
                    v-bind:send_type="send_type"
                    v-bind:goods="goods"
                    v-bind:remark="remark"
                    v-bind:store="store"
                    v-bind:mch="mch"
                    v-bind:dis_send_type="dis_send_type"
                    v-bind:diyForm="diyForm"
                    v-on:city="city"
                    v-on:delivery="delivery"
                    v-on:express="express"
                    :template_message_captain="template_message_captain"
            ></app-submit-address>

            <view class="some-good">
                <view class="goods dir-left-nowrap" v-for="(item, index) in goods" :key="index">
                    <image :src="item.cover_pic" class="pic"></image>
                    <view class="content dir-top-nowrap main-left">
                        <text class="name t-omit-two">
                            {{item.name}}
                        </text>
                        <text class="attr t-omit">
                            {{item.attr}}
                        </text>
                        <text class="number">×{{item.num}}</text>
                    </view>
                </view>
            </view>

            <view class="freight dir-left-nowrap main-between cross-center" v-if="mch.express_price != 0">
                <text class="text">运费</text>
                <text :class="theme+'-color'">￥{{mch.express_price}}</text>
            </view>

            <view v-if="mch.order_form && mch.order_form.status == '1'">
                <app-diy-form
                        v-bind:title="mch.order_form.name"
                        v-bind:list="mch.order_form.value"
                        v-bind:sign="mchIndex"
                        label-position="top"
                        v-on:input="diyFormInput"
                        v-bind:show-scroll-btn="mch.order_form.show_scroll"
                ></app-diy-form>
            </view>
            <view class="leave-message" v-else-if="mch.show_remark !== false && mch.has_goods_form !== true">
                <textarea class="textarea" placeholder-class="place" v-model="remark" placeholder="备注留言"></textarea>
            </view>

            <template v-if="mch.has_goods_form">
                <view style="padding: 24rpx; color: #666666">自定义表单</view>
                <view v-for="(goodsItem, goodsIndex) in mch.goods_list"
                      :key="goodsIndex"
                      v-if="goodsItem.form && !goodsItem.form.same_form"
                      style="margin-bottom: 20rpx">
                    <view class="goods-list some-good" v-if="mch.diff_goods_form_count !== 1">
                        <view v-for="(subGoodsItem, subGoodsIndex) in mch.goods_list"
                              :key="subGoodsIndex"
                              v-if="subGoodsItem.form && subGoodsItem.form.id == goodsItem.form.id"
                              class="goods dir-left-nowrap">
                            <image class="pic"
                                   :src="subGoodsItem.goods_attr.pic_url ? subGoodsItem.goods_attr.pic_url : subGoodsItem.cover_pic"></image>
                            <view class="box-grow-1 content">
                                <view class="goods-name">{{subGoodsItem.name}}</view>
                                <view class="dir-left-wrap attr-list">
                                    <view v-for="(attrItem,attrIndex) in subGoodsItem.attr_list"
                                          :key="attrIndex"
                                          class="attr-item attr">
                                        {{attrItem.attr_group_name}}:{{attrItem.attr_name}}
                                    </view>
                                </view>
                                <view class="dir-left-nowrap">
                                    <view class="box-grow-1 goods-num number">×{{subGoodsItem.num}}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <app-diy-form
                            :list="goodsItem.form.value"
                            @input="handleGoodsFormInput"
                            @validate="handleGoodsFormValidate"
                            :sign="`0,${goodsIndex},${goodsItem.form.id}`"></app-diy-form>
                </view>
            </template>

            <!-- 空白格 -->
            <view class="page-width empty">
                <app-empty-bottom
                        backgroundColor="#f7f7f7"
                        v-bind:height="Number(110)"
                ></app-empty-bottom>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import appSubimtAddress from './app-submit-address.vue';
    import {mapState} from 'vuex';
    import appEmptyBottom from '../../../components/basic-component/app-empty-bottom/app-empty-bottom.vue';
    import AppDiyForm from "../../../components/page-component/app-diy-form/app-diy-form";

    export default {
        name: 'address',

        data() {
            return {
                previewData: {
                    hasCity: false
                },
                address_id: '',
                address: {},
                goods_id: -1,
                user_order_id: 0,
                goods: [],
                store_list: [],
                store_index: 0,
                send_type: [],
                remark: '',
                store: {},
                mch: {},
                send_data: null,
                deli: '',
                loading: false,
                dis_send_type: '',
                diyForm: [],
                template_message_captain: []
            }
        },

        onLoad(options) { this.$commonLoad.onload(options);
            this.goods_id = options.goods_id;
            this.user_order_id = options.id;
            let url = '';
            if (options.status == 2) {
                url = this.$api.gift.join_detail
            } else if (options.status == 1) {
                url = this.$api.gift.win_detail;
            }
            this.$request({
                url: url,
                data: {
                    user_order_id: options.id,
                }
            }).then(res => {
                for (let i in res.data.detail.detail) {
                    res.data.detail.detail[i].form_data = null;
                }
                this.template_message_captain = res.data.template_message_captain;
                this.goods = res.data.detail.detail;
                let data = {
                    list: [
                        {
                            mch_id: 0,
                            goods_list: [],
                            use_integral: 0,
                            user_coupon_id: 0,
                            distance: 0,
                            remark: '',
                            order_form: [],
                        }
                    ],
                    address_id: 0
                };
                for (let i = 0; i < this.goods.length; i++) {
                    let good = {
                        id: this.goods[i].goods_id,
                        attr: [],
                        num: this.goods[i].num,
                        cat_id: 0,
                        goods_attr_id: this.goods[i].goods_attr_id,
                        cart_id: 0,
                        user_order_id: options.id,
                    };
                    let attr = [];
                    let attr_list = this.goods[i].goods_info;
                    for (let j = 0; j < attr_list.length; j++) {
                        attr.push({
                            attr_id: attr_list[j].attr_id,
                            attr_group_id: attr_list[j].attr_group_id,
                        })
                    }
                    good.attr = attr;
                    data.list[0].goods_list.push(good);
                }

                this.send_data = data;
                this.$request({
                    url: this.$api.gift.preview,
                    method: 'post',
                    data: {
                        form_data: JSON.stringify(data)
                    },
                }).then(res => {
                    if (res.code === 0) {

                        this.send_type = res.data.mch_list[0].delivery.send_type_list;
                        this.dis_send_type = res.data.mch_list[0].delivery.send_type;
                        this.mch = res.data.mch_list[0];
                        this.address = res.data.address;
                        this.loading = true;
                        if (this.send_type[0].value === 'offline') {
                            // this.store = res.data.mch_list[0].store;
                            this.setMethod();
                        }
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: res.msg,
                            success: function () {
                                uni.navigateBack();
                            }
                        })
                    }
                })
            });
        },

        onShow() {
            if (this.$store.state.gift.address_id && !this.$validation.isEmpty(this.send_data)) {
                let data = this.send_data;
                data.list[0].send_type = this.deli;
                data.list[0].address_id = this.$store.state.gift.address_id;
                data.address_id = this.$store.state.gift.address_id;
                this.$request({
                    url: this.$api.gift.preview,
                    method: 'post',
                    data: {
                        form_data: JSON.stringify(data)
                    },
                }).then(res => {
                    if (res.code === 0) {
                        this.send_type = res.data.mch_list[0].delivery.send_type_list;
                        this.mch = res.data.mch_list[0];
                        this.address = res.data.address;
                        if (this.deli === 'city') {
                            this.address =  this.mch.address;
                        }
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: res.msg,
                            success: function () {
                                uni.navigateBack();
                            }
                        });
                    }
                })
            }
            if (this.$store.state.gift.store_id) {
                for (let i = 0; i < this.store_list.length; i++) {
                    if (this.store_list[i].id === this.$store.state.gift.store_id) {
                        this.store = this.store_list[i];
                    }
                }
            }
        },

        methods: {
            delivery(data) {
                this.deli = data;
            },
            setMethod() {
                let _this = this;
                // #ifdef MP
                uni.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                        _this.$request({
                            url: _this.$api.order.store_list,
                            data: {
                                latitude: res.latitude,
                                longitude: res.longitude,
                                goods_id: _this.goods_id,
                            }
                        }).then(res => {
                            _this.store_list = res.data.list;
                            _this.store = res.data.list[0];
                        })
                    }
                });
                // #endif
                // #ifdef H5
                this.$jwx.getLocation({
                    success: function (res) {
                        _this.$request({
                            url: _this.$api.order.store_list,
                            data: {
                                latitude: res.latitude,
                                longitude: res.longitude,
                                goods_id: _this.goods_id,
                            }
                        }).then(res => {
                            _this.store_list = res.data.list;
                            _this.store = res.data.list[0];
                        });
                    }
                });
                // #endif
            },

            city() {
                let data = this.send_data;
                data.list[0].send_type = 'city';
                if (this.address && this.address.type !== 1) {
                    data.list[0].address_id = this.address.id;
                }
                this.$request({
                    url: this.$api.gift.preview,
                    method: 'post',
                    data: {
                        form_data: JSON.stringify(data)
                    },
                }).then(res => {
                    this.send_type = res.data.mch_list[0].delivery.send_type_list;
                    this.mch = res.data.mch_list[0];
                    this.address = res.data.mch_list[0].address;
                    if (this.address && this.address.type !== 1) {
                        this.address = null;
                    }
                })
            },
            express() {
                let data = this.send_data;
                data.list[0].send_type = 'express';
                if (this.address) {
                    data.list[0].address_id = this.address.id;
                }
                this.$request({
                    url: this.$api.gift.preview,
                    method: 'post',
                    data: {
                        form_data: JSON.stringify(data)
                    },
                }).then(res => {
                    this.send_type = res.data.mch_list[0].delivery.send_type_list;
                    this.mch = res.data.mch_list[0];
                    this.address = res.data.mch_list[0].address;
                })
            },
            diyFormInput({data}) {
                this.diyForm = data;
            },

            handleGoodsFormInput(data, sign) {
                const signArr = sign.split(',');
                const goodsIndex = parseInt(signArr[1]);
                const result = [];
                for (let i in data) {
                    result[i] = {
                        key: data[i].key,
                        label: data[i].name,
                        value: data[i].value,
                        required: data[i].is_required,
                    };
                }
                this.goods[goodsIndex].form_data = result;
            },
            handleGoodsFormValidate(result, sign) {
                const signArr = sign.split(',');
                const goodsIndex = parseInt(signArr[1]);
                this.goods[goodsIndex].goods_form_validate_result = result;
            },
        },

        computed: {
            ...mapState('gift', {
                theme: state => state.theme,
            }),
        },

        components: {
            'app-submit-address': appSubimtAddress,
            'app-empty-bottom': appEmptyBottom,
            'app-diy-form': AppDiyForm,
        },
    }
</script>

<style scoped lang="scss">
    @import '../css/gift';

    /* 商品页面 */
    .address {
        position: absolute;
        width: 100%;
        min-height: 100%;
        background-color: #f7f7f7;
    }

    .some-good {
        background: #ffffff;
        padding: #{28upx 24upx 0 24upx};
        overflow: hidden;

        .goods {
            height: #{156upx};
            margin-bottom: #{28upx};

            .pic {
                width: #{156upx};
                height: #{156upx};
                margin-right: #{24upx};
            }

            .content {
                width: #{522upx};
                height: #{156upx};

                .name {
                    font-size: #{32upx};
                    color: #353535;
                    line-height: #{38upx};
                }

                .attr {
                    color: #999999;
                    font-size: #{24upx};
                    line-height: 1;
                    margin-top: #{18upx};
                }

                .number {
                    color: #999999;
                    font-size: #{24upx};
                    line-height: 1;
                    margin-top: #{18upx}
                }
            }
        }
    }

    .leave-message {
        margin-top: #{24upx};
        height: #{100upx};
        line-height: #{100upx};
        padding: #{18upx 24upx};
        background-color: #ffffff;

        .textarea {
            font-size: #{32upx};
            width: 100%;
            height: 100%;
            line-height: #{64upx};
            padding: 0;
        }

        .place {
            line-height: #{64upx};
        }
    }

    .freight {
        width: #{750upx};
        background-color: #ffffff;
        padding: #{0 24upx};
        margin-top: #{20upx};
        height: #{88upx};

        text {
            font-size: #{32upx};
        }

        .text {
            color: #353535;
        }
    }
</style>