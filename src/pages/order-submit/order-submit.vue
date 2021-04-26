<template>
    <app-layout>
        <view class="safe-area-inset-bottom">
          <!-- 地址、商户、配送、商品、优惠、费用信息 -->
          <view class="page" v-if="previewData">
            <view v-if="!previewData.hasCity && previewData.show_address !== false && previewData.hasRecipient" class="group">
              <app-address-bar :address="previewData.address" :has-ziti="previewData.has_ziti" :all-ziti="previewData.allZiti" @address-input="handleAddressInput"></app-address-bar>
            </view>
            <template v-for="(mch, mchIndex) in previewData.mch_list" >
              <view v-if="previewData.hasCity && mchIndex === 0" class="group">
                <app-address-bar :address="mch.city.error ? null : mch.address" :has-city="true" :city="mch.city"></app-address-bar>
              </view>
              <view v-if="previewData.hasCity && mchIndex === 1" class="group">
                <app-address-bar :address="previewData.address" :has-ziti="previewData.has_ziti" :all-ziti="previewData.allZiti" :city="mch.city"></app-address-bar>
              </view>
              <view :key="mchIndex" class="group">
                <!-- 循环商户列表start -->
                <view style="padding: 26rpx 32rpx;">
                  <view class="dir-left-nowrap cross-center" style="padding: 10rpx 0;line-height: 1.2;">
                    <!-- 商户名start -->
                    <view class="box-grow-0">
                      <image src="/static/image/icon/store-black.png" class="title-icon mr-12"></image>
                    </view>
                    <view class="box-grow-1 font-bold ellipsis-1">{{mch.mch.name}}</view>
                    <view v-if="mch.mch.id > 0 &&  mch.delivery && mch.delivery.send_type === 'offline' && mch.store && mch.store.distance != '-m'" class="box-grow-0 dir-left-nowrap cross-center">
                      <image src="/static/image/icon/location.png" class="mr-12" style="display: block; width: 22rpx;height: 26rpx;"></image>
                      <view>距您{{mch.store.distance}}</view>
                    </view>
                  </view><!-- 商户名end -->
                  <template v-if="mch.delivery && mch.delivery.send_type === 'offline'">
                    <!-- 自提门店信息start -->
                    <view v-if="mch.no_store && mch.no_store === true" :class="[themeTextClass]" :style="{'color': !is_gift ? theme.color : '', 'paddding': '10rpx 0'}">暂无门店，请选择其他配送方式
                    </view>
                    <template v-else>
                      <template v-if="mch.store">
                        <view v-if="mch.mch.id == 0" class="dir-left-nowrap" style="padding: 10rpx 0;line-height: 1.2;">
                          <view @click="navigateStore(mchIndex)" class="box-grow-1 dir-left-nowrap cross-center">
                            <view>
                              <image src="/static/image/icon/navigation-black.png" class="title-icon mr-12"></image>
                            </view>
                            <view class="font-bold ellipsis-1 mr-12">
                              {{mch.store.name}}
                            </view>
                            <view class="mr-12">
                              <image src="/static/image/icon/right.png" class="mr-12" style="width: 12rpx; height: 22rpx;"></image>
                            </view>
                          </view>
                          <view v-if="mch.store.distance != '-m' || getLocationFail" class="box-grow-0 dir-left-nowrap cross-center">
                            <view>
                              <image src="/static/image/icon/location.png" class="mr-12" style="display: block; width: 22rpx;height: 26rpx;"></image>
                            </view>
                            <view v-if="getLocationFail" @click.stop="openLocationSetting" :class="[`${theme}-color`, `${theme}-border`]"  :style="{'color': !is_gift ? theme.color : '', 'border-color': !is_gift ? theme.border : ''}">获取位置
                            </view>
                            <view v-else-if="mch.store.distance != '-m'">距您{{mch.store.distance}}</view>
                          </view>
                        </view>
                        <view style="padding: 10rpx 0;line-height: 1.2;">
                          <view class="font-gray ellipsis-2" style="line-height: 30rpx; max-height: 60rpx;">
                            {{mch.store.address}}
                          </view>
                        </view>
                      </template>
                      <view v-else class="dir-left-nowrap cross-center" @click="navigateStore(mchIndex)" style="padding: 10rpx 0;">
                        <view class="box-grow-1 dir-left-nowrap">
                          <image src="/static/image/icon/navigation-black.png" class="title-icon mr-12"></image>
                          <view class="mr-12 font-bold">选择门店</view>
                        </view>
                        <view class="box-grow-0 dir-left-nowrap cross-center">
                          <view class="mr-12 font-gray">请选择门店</view>
                          <image src="/static/image/icon/arrow-right.png" class="mr-12" style="width: 12rpx; height: 22rpx;"></image>
                        </view>
                      </view>
                    </template>
                  </template><!-- 自提门店信息end -->
                </view>
                <view class="line"></view>
                <view v-if="mch.show_delivery !== false" style="padding: 18rpx 32rpx;">
                  <!-- 选择配送方式start -->
                  <view class="dir-left-nowrap cross-center" style="padding: 18rpx 0;">
                    <view class="box-grow-0">
                      <image src="/static/image/icon/delivery.png" class="title-icon mr-12"></image>
                    </view>
                    <view class="box-grow-1 font-bold">配送方式</view>
                  </view>
                  <view class="dir-left-nowrap" style="padding: 18rpx 0;">
                    <view v-for="(sendType, sendTypeIndex) in mch.delivery.send_type_list" :key="sendTypeIndex" class="send-type"
                          :style="{'background-color': sendType.value == mch.delivery.send_type && !userTheme ? theme.background : ''}"
                          :class="sendType.value == mch.delivery.send_type && userTheme ? `${theme}-background theme-color`: sendType.value == mch.delivery.send_type && !userTheme ? 'theme-color' : 'app-light-gray-back' "
                          @click="changeSendType(mchIndex,sendType.value)">
                      {{sendType.name}}
                    </view>
                  </view>
                </view><!-- 选择配送方式end -->
                <template v-if="mch.delivery && mch.delivery.send_type === 'city' && mch.city">
                  <!-- 同城配送信息start -->
                  <view class="line"></view>
                  <view v-if="mch.city.error" class="dir-left-nowrap cross-center" style="padding: 36rpx 32rpx;">
                    <view class="box-grow-1">{{mch.city.error}}</view>
                    <view class="box-grow-0 dir-left-nowrap delivery-coverage-btn" @click="jump(mchIndex)" style="margin: -12rpx 0;">查看配送范围
                    </view>
                  </view>
                  <view v-else style="padding: 36rpx 32rpx;">
                    <view style="padding: 10rpx 0;">发货地址：{{mch.city.address}}</view>
                    <view class="dir-left-nowrap cross-center" style="padding: 10rpx 0;">
                      <view class="box-grow-1">
                        <view v-if="mch.city.explain">{{mch.city.explain}}</view>
                      </view>
                      <view class="box-grow-0 dir-left-nowrap delivery-coverage-btn" @click="jump(mchIndex)">查看配送范围
                      </view>
                    </view>
                  </view>
                </template><!-- 同城配送信息end -->
                <view class="line"></view>
                <view v-if="!mch.pick_up_enable" style="height: 80rpx;line-height: 80rpx; background: #fff4f3;padding: 0 24rpx;">
                  <view>以下商品满{{mch.pick_up_price}}元起送</view>
                </view>
                <app-submit-goods :theme="theme" v-on:updateList="updateList" :index="mchIndex" :plugin="plugin" :list="mch"></app-submit-goods>
                <view class="line"></view>
                <template v-if="(mch.coupon && mch.coupon.enabled) ||
                                (mch.member_discount > 0 || mch.member_discount < 0) ||
                                (mch.integral && mch.integral.can_use) ||
                                mch.temp_vip_discount ||
                                (mch.insert_rows && mch.insert_rows.length) ||
                                (mch.full_reduce_discount > 0 || mch.full_reduce_discount < 0)">
                        <view style="padding: 20rpx 32rpx;">
                            <template v-if="mch.coupon && mch.coupon.enabled">
                                <view @click="showCouponPicker(mchIndex)" style="padding: 16rpx 0;">
                                    <view class="dir-left-nowrap cross-center">
                                        <view class="box-grow-1">优惠券</view>
                                        <view class="box-grow-0 mr-12" v-if="mch.coupon.use" :class="[themeTextClass]" :style="{'color': !is_gift ? theme.color : ''}">
                                            -¥{{mch.coupon.coupon_discount}}
                                        </view>
                                        <view class="box-grow-0 mr-12 font-gray" v-else-if="noCouponStatus(mchIndex)">
                                            暂无优惠券可用
                                        </view>
                                        <view class="box-grow-0 mr-12 font-gray" v-else>选择优惠券</view>
                                        <view class="box-grow-0">
                                            <image src="/static/image/icon/arrow-right.png" style="width: 12rpx; height: 22rpx; margin-bottom: -2rpx;"></image>
                                        </view>
                                    </view>
                                </view>
                                <app-bottom-modal :visible.sync="mch.showCouponPicker" title="优惠券">
                                    <app-coupon-pick :plugin="plugin" :mch-index="mchIndex" @change="loadPreviewData" :no-coupons.sync="mch.noCoupons" :theme="theme"></app-coupon-pick>
                                </app-bottom-modal>
                            </template>
                            <view v-if="mch.member_discount > 0 || mch.member_discount < 0" class="dir-left-nowrap" style="padding: 16rpx 0;">
                                <view class="box-grow-1">会员价总优惠</view>
                                <view class="box-grow-0"  :class="[themeTextClass]" :style="{'color': !is_gift ? theme.color : ''}">
                                    <template v-if="mch.member_discount>0">-¥{{mch.member_discount}}</template>
                                    <template v-else-if="mch.member_discount<0">+¥{{0-mch.member_discount}}</template>
                                    <template v-else>¥0.00</template>
                                </view>
                            </view>
                            <view v-if="mch.full_reduce_discount > 0 || mch.full_reduce_discount < 0" class="dir-left-nowrap" style="padding: 16rpx 0;">
                                <view class="box-grow-1">满减总优惠</view>
                                <view class="box-grow-0"  :class="[themeTextClass]" :style="{'color': !is_gift ? theme.color : ''}">
                                    <template v-if="mch.full_reduce_discount>0">-¥{{mch.full_reduce_discount}}</template>
                                    <template v-else-if="mch.full_reduce_discount<0">+¥{{0-mch.full_reduce_discount}}</template>
                                </view>
                            </view>
                            <view v-if="mch.integral && mch.integral.can_use" class="dir-left-nowrap" style="padding: 16rpx 0;">
                                <view class="box-grow-1 dir-left-nowrap cross-center">
                                    积分抵扣（使用 {{mch.integral.use_num}}积分）
                                    <image @click="showIntegralTip" style="width: 36rpx;height: 36rpx; margin: -12rpx 0;" src="/static/image/icon/warning.png"></image>
                                </view>
                                <view class="box-grow-0 dir-left-nowrap cross-center">
                                    <view class="mr-12"  :class="[themeTextClass]" :style="{'color': !is_gift ? theme.color : ''}">
                                        -¥{{mch.integral.deduction_price}}
                                    </view>
                                    <view style="margin: -6rpx 0">
                                        <app-submit-checkbox :round="true" :theme="theme" :value="mch.integral.use" border-color="#999999" @input="changeIntegral(mchIndex)"></app-submit-checkbox>
                                    </view>
                                </view>
                            </view>
                            <view v-if="mch.temp_vip_discount" style="padding: 16rpx 0;">
                                <view :style="{
                            backgroundImage: `url(${appImg.order_submit.svip_bg})`,
                            }" class="svip dir-left-nowrap cross-center">
                        <view class="box-grow-1">
                          <view v-if="mch.vip_card_detail">SVIP用户，本单优惠
                            <text style="color: #ff4544;">{{mch.temp_vip_discount}}</text>
                            元
                          </view>
                          <template v-else>
                            <view style="margin-bottom: 10rpx;">现在开卡，本单立减
                              <text style="color: #ff4544;">{{mch.temp_vip_discount}}
                              </text>
                              元
                            </view>
                            <view @click="navigateVipCardPrivilege" class="dir-left-nowrap cross-center">
                              <view style="margin-right: 10rpx; font-size: 22rpx;">查看权益</view>
                              <image src="/static/image/icon/order-submit/arrow-right-b.png" style="width: 12rpx;height: 22rpx; display: block;"></image>
                            </view>
                          </template>
                        </view>
                        <view class="box-grow-0 dir-left-nowrap cross-center" style="padding: 12rpx 22rpx 12rpx 0;" @click="navigateSvip(mchIndex)">
                          <view class="vip-card-name" style="margin-right: 10rpx; line-height: 1.05;">
                            <template v-if="mch.vip_card_detail">{{mch.vip_card_detail.name}}</template>
                            <template v-else>请选择</template>
                          </view>
                          <image src="/static/image/icon/order-submit/arrow-right-a.png" style="width: 12rpx;height: 22rpx; display: block;"></image>
                        </view>
                      </view>
                    </view>
                    <view v-if="mch.insert_rows && mch.insert_rows.length" :class="[mch.showInsertRows?'show':'',]">
                      <view class="dir-left-nowrap cross-center" @click="reversalShowInsertRows(mchIndex)" style="padding: 16rpx 0;">
                        <view class="box-grow-1 dir-left-nowrap cross-center">
                          <view class="mr-12">活动优惠</view>
                          <image style="width: 22rpx; height: 12rpx;" class="bottom-icon" src="/static/image/icon/bottom.png"></image>
                        </view>
                        <view class="box-grow-0"  :class="[themeTextClass]" :style="{'color': !is_gift ? theme.color : ''}">
                          {{mch.insert_total_discount}}
                        </view>
                      </view>
                      <view class="insert-rows">
                        <view class="font-small more-discount-info">
                          <view v-for="(insertRow, insertRowIndex) in mch.insert_rows" :key="insertRowIndex" class="row dir-left-nowrap no-px">
                            <view class="box-grow-1" style="color: #999;">{{insertRow.title}}</view>
                            <view class="box-grow-0"  :class="[themeTextClass]" :style="{'color': !is_gift ? theme.color : ''}">
                              {{insertRow.value}}
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
                  <view class="line"></view>
                </template>
                <template v-if="mch.show_express_price !== false">
                  <!-- 运费信息start -->
                  <view class="dir-left-nowrap cross-center" style="height: 84rpx; padding: 0 32rpx;">
                    <view class="box-grow-1">运费</view>
                    <view class="box-grow-0"  :class="[themeTextClass]" :style="{'color': !is_gift ? theme.color : '','text-align':'right'}">
                      <template v-if="mch.express_price_origin && mch.express_price_desc">
                        <view :style="{'color': theme.color}">￥{{mch.express_price_origin}}</view>
                        <view class="express-price-desc" :style="{'color': theme.color}">{{mch.express_price_desc}}
                        </view>
                      </template>
                      <template v-else>￥{{mch.express_price}}</template>
                    </view>
                  </view>
                </template><!-- 运费信息end -->
                <template v-if="
                    !(mch.order_form && mch.order_form.status == '1')
                    && mch.show_remark !== false
                    && mch.has_goods_form !== true">
                  <view class="line"></view>
                  <view class="row" style="padding-top: 0;padding-bottom: 0;">
                    <app-input @input="inputRemark(mchIndex)" v-model="mch.remark" placeholder="买家留言" padding-left="0" height="100"></app-input>
                  </view>
                </template>
                <view class="line"></view>
                <view class="dir-right-nowrap cross-center" style="height: 84rpx; padding: 0 32rpx;">
                  <view class="box-grow-0 dir-left-nowrap">
                    <view>小计：</view>
                    <view :class="[themeTextClass]" :style="{'color': !is_gift ? theme.color : ''}">¥{{mch.total_price}}</view>
                  </view>
                  <view class="box-grow-0 font-gray mr-12">共{{mch.goods_count}}件</view>
                </view>
              </view><!-- 循环商户列表end -->
            </template>
            <view v-for="(mch, mchIndex) in previewData.mch_list" :key="mchIndex">
              <view v-if="mch.order_form && mch.order_form.status == '1'" class="group">
                <view style="padding: 0 12rpx">
                  <app-diy-form :title="mch.order_form.name" :list="mch.order_form.value" @input="handleOrderFormInput" @validate="handleOrderFormValidate" :sign="mchIndex" label-position="top" :show-scroll-btn="mch.order_form.show_scroll"></app-diy-form>
                </view>
              </view>
              <template v-if="mch.has_goods_form">
                <view v-for="(goodsItem, goodsIndex) in mch.goods_list" :key="goodsIndex" v-if="goodsItem.form && !goodsItem.form.same_form" class="group goods-form">
                  <view style="padding: 36rpx 32rpx;" class="font-bold">{{goodsItem.form.name}}</view>
                  <view class="line"></view>
                  <view class="row goods-list" v-if="mch.diff_goods_form_count !== 1 || previewData.mch_list.length > 1">
                    <view v-for="(subGoodsItem, subGoodsIndex) in mch.goods_list" :key="subGoodsIndex" v-if="subGoodsItem.form && subGoodsItem.form.id == goodsItem.form.id" class="dir-left-nowrap goods-item">
                      <view class="box-grow-0">
                        <image class="goods-image" :src="subGoodsItem.goods_attr.pic_url ? subGoodsItem.goods_attr.pic_url : subGoodsItem.cover_pic"></image>
                      </view>
                      <view class="box-grow-1">
                        <view class="goods-name ellipsis-2">
                          {{subGoodsItem.name}}
                        </view>
                        <view class="dir-left-wrap">
                          <view v-for="(attrItem,attrIndex) in subGoodsItem.attr_list" :key="attrIndex" class="mr-12 font-gray font-small">
                            {{attrItem.attr_group_name}}:{{attrItem.attr_name}}
                          </view>
                        </view>
                        <view class="dir-left-nowrap">
                          <view class="box-grow-1 font-gray font-small">×{{subGoodsItem.num}}</view>
                          <view class="box-grow-0">
                            <view class="font-small" style="text-align: right" :style="{'color': theme.color}">
                              <text v-for="(customCurrency,customCurrencyIndex) in subGoodsItem.custom_currency" :key="customCurrencyIndex">
                                {{customCurrency}}+
                              </text>
                              ￥{{subGoodsItem.total_original_price}}
                            </view>
                            <view v-for="(discount,discountIndex) in subGoodsItem.discounts" :key="discountIndex" style="text-align: right" :style="{'color': theme.color}">
                              {{discount.name}}: {{discount.value}}
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
                  <view style="padding: 0 12rpx">
                    <app-diy-form :showRequiredIcon="true" :list="goodsItem.form.value" @input="handleGoodsFormInput" @validate="handleGoodsFormValidate" label-position="top" :label-fs28="true" :sign="`${mchIndex},${goodsIndex},${goodsItem.form.id}`"></app-diy-form>
                  </view>
                </view>
              </template>
            </view>
          </view>
		  <view class="full-tip" v-if="previewData.next_full_reduce"></view>
        </view>
        <!-- 结算底栏 -->
        <view class="submit-bar u-bottom-fixed dir-top-nowrap safe-area-inset-bottom" v-if="previewData">
			<view class="full-tip full-tip-show" v-if="previewData.next_full_reduce">
				还差<span class="full-tip-text">{{previewData.next_full_reduce.diff}}</span>元<span class="full-tip-text">{{previewData.next_full_reduce.text}}</span>
			</view>
            <view class="bd-bottom dir-left-nowrap">
                <view class="box-grow-1 cross-center u-submit-bar-height">
                    <view class="price-info">
                        <view :class="[themeTextClass]" :style="{'color': !is_gift ? theme.color : '','font-size': '26rpx'}">
                            {{totalTitle}}:
                            <text v-for="(custom_currency, ccIndex) in previewData.custom_currency_all" :key="ccIndex">
                                {{custom_currency}}+
                            </text>
                            <template v-if="previewData.vip_card_discount_total_price">
                                ￥{{previewData.vip_card_discount_total_price}}
                            </template>
                            <template v-else>￥{{previewData.total_price}}</template>
                        </view>
                        <view v-if="previewData.vip_card_price > 0"  :class="[themeTextClass]" :style="{'color': !is_gift ? theme.color : '','font-size': '20rpx'}">包含SVIP费用:
                            ¥{{previewData.vip_card_price}}
                        </view>
                    </view>
                </view>
                <template v-if="previewData.address_enable && previewData.price_enable">
                    <view @click="subscribe" class="submit-btn u-submit-bar-height box-grow-0 main-center cross-center" :class="[ submitLock? ' lock' : '', themeBgClass]" :style="{'background-color': !is_gift ? theme.background : ''}">
                        <view style="background-color: transparent;color:#ffffff; text-align: center;">提交订单</view>
                    </view>
                </template>
                <template v-else>
                    <view class="submit-btn u-submit-bar-height box-grow-0 main-center cross-center disabled" :class="[themeTextClass]" :style="{'color': !is_gift ? theme.color : ''}">
                        <view style="background-color: transparent;color: #ffffff; text-align: center;">提交订单</view>
                    </view>
                </template>
            </view>
        </view>
        <app-close v-if="showClose && mchList.length > 0" :toBack="true" :mch_list="mchList" @update="getMall"></app-close>
    </app-layout>
</template>
<script>
import {mapGetters, mapState} from 'vuex';
import AppDiyForm from "../../components/page-component/app-diy-form/app-diy-form.vue";
import appSubmitGoods from './app-submit-goods.vue';
import AppCouponPick from "./app-coupon-pick";
import AppBottomModal from "./app-bottom-modal";
import AppAddressBar from "./app-address-bar";
import AppSubmitCheckbox from "./app-submit-checkbox";
import AppClose from '../../components/basic-component/app-close/app-close.vue';

export default {
    name: 'order-submit',
    components: {
        AppSubmitCheckbox,
        AppAddressBar,
        AppBottomModal,
        AppCouponPick,
        AppDiyForm,
        appSubmitGoods,
        AppClose
    },
    data() {
        return {
            totalTitle: '合计',
            check: false,
            previewData: {
                mch_list: [],
                total_price: 0,
                vip_card_discount_total_price: null,
                custom_currency_all: []
            },
            getLocationFail: false,
            previewUrl: null,
            submitUrl: null,
            plugin: null,
            orderPageUrl: null,
            submitLock: false,
            getPayDataTimer: null,
            userTheme: null,
            is_gift: false,
            payDataUrl: null,
            showPayResult: true,
            payCancelUrl: null,
            loadingPreviewData: true,
            showClose: false,
            is_open: false,
            mchList: '',
            p_pay_id: '',//重新提交处理
        };
    },
    computed: {
        ...mapState({
            appImg: state => state.mallConfig.__wxapp_img,
        }),
        theme() {
            return this.userTheme ? this.userTheme : this.getTheme;
        },
        ...mapGetters('mallConfig', {
            getTheme: 'getTheme',
        }),
        themeBgClass() {
            if (this.userTheme && this.userTheme.indexOf('gift') >= 0) {
                return `${this.theme} ${this.theme}-background`;
            }
        },
        themeTextClass() {
            if (this.userTheme && this.userTheme.indexOf('gift') >= 0) {
                return `${this.theme} ${this.theme}-color`;
            }
        },
    },
    onLoad(options) { this.$commonLoad.onload(options);
        let mchList = JSON.parse(options.mch_list);
        let list = [];
        for(let item of mchList) {
            if(item.mch_id > 0) {
                list.push(item.mch_id)
            }
        }
        this.is_gift = this.userTheme && this.userTheme.indexOf('gift') >= 0 ? true : false;
        this.mchList = list.length > 0 ? JSON.stringify(list) : '0';
        if (this.submitLock) return;
        this.setFormData(options);
        this.$event.on(this.$const.EVENT_USER_LOGIN).then(() => {
            this.loadPreviewData();
        });
        // #ifdef H5
        let { hash } = window.location;
        if (hash.indexOf('pay_id_weChart') > 0 && hash.indexOf('isWechat=true') > 0) {
            let _this = this;
            uni.showModal({
                content: '确定已完成支付？',
                confirmText: '确定',
                cancelText: '返回支付',
                success(res) {
                    if (res.confirm) {
                        let search = hash.split('?')[1];
                        if (search) {
                            let str = search.substr(0).match(new RegExp('(^|&)' + 'pay_id_weChart' + '=([^&]*)(&|$)'))
                            if (unescape(str[2])) {
                                _this.weChartPay(unescape(str[2]));
                            }
                        }
                    } else if (res.cancel) {
                        uni.redirectTo({
                            url: `/pages/order/index/index`
                        });
                    }
                },
                fail() {
                }
            });

        }
        // #endif
    },
    onShow() {
        this.showClose = false;
        setTimeout(()=>{
            this.showClose = true;
            // #ifdef H5
            document.getElementsByClassName('uni-page-head__title')[0].innerHTML = '确认订单';
            // #endif
        });
    },
    onUnload() {
        if (this.getPayDataTimer) {
            clearTimeout(this.getPayDataTimer);
        }
    },
    watch: {
        'previewData.address.name': {
            handler() {
                this.changeZitiAddress();
            },
        },
        'previewData.address.mobile': {
            handler() {
                this.changeZitiAddress();
            },
        },
    },
    methods: {
        getMall(e) {
            console.log(e)
            if(e != undefined) {
              this.is_open = e && e.is_open == 1 ? true : false;
              if(this.is_open) {

                  if (this.submitLock) return;
                  // #ifdef MP-BAIDU
                  setTimeout(() => {
                      this.loadPreviewData();
                  }, 50);
                  // #endif
                  // #ifndef MP-BAIDU
                  this.loadPreviewData();
                  // #endif
              }
            }
        },
        
        noCouponStatus(mchIndex) {
            const mchNoCouponStatusList = this.$store.getters['orderSubmit/getMchNoCouponStatusList'];
            if (mchNoCouponStatusList[mchIndex])
                return true;
            else
                return false;
        },
        navigateVipCardPrivilege() {
            uni.navigateTo({
                url: '/plugins/vip_card/rights/rights?id=1',
            });
        },
        showCouponPicker(index) {
            this.previewData.mch_list[index].showCouponPicker = true;
        },
        reversalShowInsertRows(index) {
            this.previewData.mch_list[index].showInsertRows = !this.previewData.mch_list[index].showInsertRows;
        },
        updateList(e, index) {
            this.previewData.mch_list[index] = e;
            this.$forceUpdate();
        },
        setParams(options) {
            if (options.total_title) {
                this.totalTitle = options.total_title;
            }
        },
        handleOrderFormInput({data, sign}) {
            const result = [];
            for (let i in data) {
                result[i] = {
                    key: data[i].key,
                    label: data[i].name,
                    value: data[i].value,
                    required: data[i].is_required,
                };
            }
            const formData = this.$store.state.orderSubmit.formData;
            formData.list[sign].order_form = result;
            this.$store.commit('orderSubmit/mutSetFormData', formData);
        },
        handleOrderFormValidate({result, sign}) {
            const formData = this.$store.state.orderSubmit.formData;
            formData.list[sign].order_form_validate_result = result;
            this.$store.commit('orderSubmit/mutSetFormData', formData);
        },
        setFormData(options) {
            this.previewUrl = decodeURIComponent(options.preview_url || this.$api.order.preview);
            this.submitUrl = decodeURIComponent(options.submit_url || this.$api.order.submit);
            this.plugin = options.plugin || null;
            this.orderPageUrl = decodeURIComponent(options.order_page_url || '/pages/order/index/index?status=0');
            this.userTheme = options.theme || null;
            this.payDataUrl = decodeURIComponent(options.pay_data_url || this.$api.order.pay_data);
            this.payCancelUrl = options.pay_cancel_url ? decodeURIComponent(options.pay_cancel_url) : null;
            this.showPayResult = options.show_pay_result || true;
            if (this.showPayResult === 'true') this.showPayResult = true;
            if (this.showPayResult === 'false') this.showPayResult = false;
            const list = JSON.parse(options.mch_list);

            // 商户列表先做下排序，主商城必须在最前
            for (let i in list) {
                if (parseInt(list[i].mch_id) === 0) {
                    const _mchItem = list[i];
                    list.splice(i, 1);
                    list.unshift(_mchItem);
                    break;
                }
            }

            for (let i in list) {
                list[i].distance = 0;
                list[i].remark = '';
                list[i].order_form = [];
                list[i].use_integral = 0;
                list[i].user_coupon_id = 0;
                for (let j in list[i].goods_list) {
                    list[i].goods_list[j].cart_id = list[i].goods_list[j].cart_id || 0;
                }
                if (this.plugin === 'booking') {
                    let store_id = this.bookStorage('get');
                    list[i]['store_id'] = store_id ? store_id : '';
                }
            }
            this.$store.commit('orderSubmit/mutSetFormData', {
                list: list,
                address_id: 0,
				send_type: options.send_type || ''
            });
        },
        bookStorage(type, store_id = '') {
            let key = '_book_storage_order_preview';
            if (type === 'get') {
                return this.$storage.getStorageSync(key);
            }
            if (type === 'save') {
                this.$storage.setStorageSync(key, store_id ? store_id : 0);
            }
        },
        loadPreviewData() {
            this.loadingPreviewData = true;
            uni.showLoading({
                mask: true,
                title: '加载中',
            });
            this.$request({
                url: this.previewUrl,
                method: 'post',
                data: {
                    form_data: JSON.stringify(this.$store.state.orderSubmit.formData),
                },
            }).then(response => {
                this.loadingPreviewData = false;
                uni.hideLoading();
                if (response.code === 0) {
                    if (response.data.allZiti && !response.data.address) {
                        response.data.address = {
                            name: '',
                            mobile: '',
                        };
                    }
                    for (let i in response.data.mch_list) {
                        response.data.mch_list[i].showCouponPicker = false;
                        response.data.mch_list[i].noCoupons = false;
                        response.data.mch_list[i].showInsertRows = false;
                    }
					if (typeof response.data.address !== 'object') {
						let addressBuff = new Buffer(response.data.address, 'base64')
						let address = addressBuff.toString('utf8');
						response.data.address = JSON.parse(address);
					}
                    this.previewData = response.data;
                    this.setDiyFormScrollStatus();
                    this.checkCouponError();
                    this.updateStoreDistance();
                    this.updateGoodsCount();
                } else {
                    uni.showModal({
                        title: '提示',
                        content: response.msg,
                        showCancel: false,
                        success: () => {
                            uni.navigateBack();
                        },
                    });
                }
            }).catch(() => {
                this.loadingPreviewData = false;
                uni.hideLoading();
            });
        },
        navigateStore(mchIndex) {
            if (this.previewData.mch_list[mchIndex].mch.id != 0) {
                return;
            }
            let firstGoodsId = '';
            if (this.plugin === 'booking') {
                firstGoodsId = this.previewData.mch_list[0].goods_list[0].id;
            }
            let plugin = this.plugin || '';
            uni.navigateTo({
                url: `/pages/order-submit/store-pick?mchIndex=${mchIndex}&plugin=${plugin}&firstGoodsId=${firstGoodsId}`,
            });
        },
        navigateCoupon(mchIndex) {
            uni.navigateTo({
                url: `/pages/order-submit/coupon-pick?mchIndex=${mchIndex}`,
            });
        },
        navigateSvip(mchIndex) {
            uni.navigateTo({
                url: `/pages/order-submit/vip-card?mchIndex=${mchIndex}`,
            });
        },
        changeZitiAddress() {
            const formData = this.$store.state.orderSubmit.formData;
            formData.address = {
                name: this.previewData.address ? this.previewData.address.name : '',
                mobile: this.previewData.address ? this.previewData.address.mobile : '',
            };
            this.$store.commit('orderSubmit/mutSetFormData', formData);
        },
        changeSendType(mchIndex, value) {
            if (this.previewData.mch_list[mchIndex].delivery.send_type == value) return;
            const formData = this.$store.state.orderSubmit.formData;
            formData.list[mchIndex].send_type = value;
            this.$store.commit('orderSubmit/mutSetFormData', formData);
            this.previewData.mch_list[mchIndex].delivery.send_type = value;
            this.loadPreviewData();
        },
        updateStoreDistance() {
            if (!this.previewData) return;
            if (!this.previewData.has_ziti && this.plugin != 'booking') {
                return;
            }
            // #ifdef MP
            uni.getLocation({
                success: (res) => {
                    for (let i in this.previewData.mch_list) {
                        if (!this.previewData.mch_list[i].store) {
                            continue;
                        }
                        if (this.previewData.mch_list[i].store.distance &&
                            this.previewData.mch_list[i].store.distance != '-m') {
                            continue;
                        }
                        if (
                            this.previewData.mch_list[i].store.latitude == '' ||
                            this.previewData.mch_list[i].store.longitude == '' ||
                            isNaN(this.previewData.mch_list[i].store.latitude) ||
                            isNaN(this.previewData.mch_list[i].store.longitude)
                        ) {
                            continue;
                        }
                        const distance = this.$utils.earthDistance({
                            lat: res.latitude,
                            lng: res.longitude
                        }, {
                            lat: this.previewData.mch_list[i].store.latitude,
                            lng: this.previewData.mch_list[i].store.longitude
                        });
                        let distanceStr = '-m';
                        if (distance > 1000) {
                            distanceStr = (distance / 1000).toFixed(2) + 'km';
                        } else {
                            distanceStr = distance.toFixed(0) + 'm';
                        }
                        this.previewData.mch_list[i].store.distance = distanceStr;
                    }
                },
                fail: () => {
                    this.getLocationFail = true;
                },
            });
            // #endif
            // #ifdef H5
            if (this.$jwx.isWechat()) {
                this.$jwx.getLocation({
                    success: (res) => {
                        for (let i in this.previewData.mch_list) {
                            if (!this.previewData.mch_list[i].store) {
                                continue;
                            }
                            if (this.previewData.mch_list[i].store.distance &&
                                this.previewData.mch_list[i].store.distance != '-m') {
                                continue;
                            }
                            if (
                                this.previewData.mch_list[i].store.latitude == '' ||
                                this.previewData.mch_list[i].store.longitude == '' ||
                                isNaN(this.previewData.mch_list[i].store.latitude) ||
                                isNaN(this.previewData.mch_list[i].store.longitude)
                            ) {
                                continue;
                            }
                            const distance = this.$utils.earthDistance({
                                lat: res.latitude,
                                lng: res.longitude
                            }, {
                                lat: this.previewData.mch_list[i].store.latitude,
                                lng: this.previewData.mch_list[i].store.longitude
                            });
                            let distanceStr = '-m';
                            if (distance > 1000) {
                                distanceStr = (distance / 1000).toFixed(2) + 'km';
                            } else {
                                distanceStr = distance.toFixed(0) + 'm';
                            }
                            this.previewData.mch_list[i].store.distance = distanceStr;
                        }
                    },
                    fail: () => {
                        this.getLocationFail = true;
                    },
                });
            } else {
                uni.getLocation({
                    success: (res) => {
                        for (let i in this.previewData.mch_list) {
                            if (!this.previewData.mch_list[i].store) {
                                continue;
                            }
                            if (this.previewData.mch_list[i].store.distance &&
                                this.previewData.mch_list[i].store.distance != '-m') {
                                continue;
                            }
                            if (
                                this.previewData.mch_list[i].store.latitude == '' ||
                                this.previewData.mch_list[i].store.longitude == '' ||
                                isNaN(this.previewData.mch_list[i].store.latitude) ||
                                isNaN(this.previewData.mch_list[i].store.longitude)
                            ) {
                                continue;
                            }
                            const distance = this.$utils.earthDistance({
                                lat: res.latitude,
                                lng: res.longitude
                            }, {
                                lat: this.previewData.mch_list[i].store.latitude,
                                lng: this.previewData.mch_list[i].store.longitude
                            });
                            let distanceStr = '-m';
                            if (distance > 1000) {
                                distanceStr = (distance / 1000).toFixed(2) + 'km';
                            } else {
                                distanceStr = distance.toFixed(0) + 'm';
                            }
                            this.previewData.mch_list[i].store.distance = distanceStr;
                        }
                    },
                    fail: () => {
                        this.getLocationFail = true;
                    },
                });
            }
            // #endif
        },
        openLocationSetting() {
            this.getLocationFail = false;
            uni.openSetting({});
        },
        showIntegralTip() {
            uni.showModal({
                title: '积分抵扣说明',
                content: this.$store.state.mallConfig.mall.setting.member_integral_rule,
                showCancel: false,
            });
        },
        changeIntegral(mchIndex) {
            const formData = this.$store.state.orderSubmit.formData;
            const use = !this.previewData.mch_list[mchIndex].integral.use;
            formData.list[mchIndex].use_integral = use ? 1 : 0;
            this.previewData.mch_list[mchIndex].integral.use = use;
            this.loadPreviewData();
        },
        inputRemark(mchIndex) {
            const formData = this.$store.state.orderSubmit.formData;
            formData.list[mchIndex].remark = this.previewData.mch_list[mchIndex].remark;
            this.$store.commit('orderSubmit/mutSetFormData', formData);
        },
        submit() {
            uni.showLoading({
                mask: true,
                title: '提交中',
            });
            this.$request({
                url: this.submitUrl,
                method: 'post',
                data: {
                    form_data: JSON.stringify(this.$store.state.orderSubmit.formData),
                },
            }).then(response => {
                if (response.code === 0) {
                    this.getPayOrderId(response.data.queue_id, response.data.token);
                } else {
                    this.submitLock = false;
                    uni.hideLoading();
                    uni.showModal({
                        title: '',
                        content: response.msg,
                        showCancel: false,
                    });
                }
            }).catch(e => {
                this.submitLock = false;
                uni.hideLoading();
                uni.showModal({
                    title: '提示',
                    content: e.errMsg,
                    showCancel: false,
                });
            });
        },
        getPayOrderId(queue_id, token) {
            this.$request({
                url: this.payDataUrl,
                method: 'post',
                data: {
                    queue_id: queue_id,
                    token: token,
                },
            }).then(response => {
                if (response.code === 0) {
                    if (response.data.retry && response.data.retry === 1) {
                        this.getPayDataTimer = setTimeout(() => {
                            this.getPayOrderId(queue_id, token);
                        }, 1000);
                    } else {
                        uni.hideLoading();
                        this.pay(response.data);
                    }
                } else {
                    this.submitLock = false;
                    uni.hideLoading();
                    uni.showModal({
                        title: '提示',
                        content: response.msg,
                        showCancel: false,
                    });
                }
            }).catch(e => {
                this.submitLock = false;
                uni.hideLoading();
                uni.showModal({
                    title: '提示',
                    content: e.errMsg,
                    showCancel: false,
                });
            });
        },
        pay(data) {
            this.p_pay_id = data.id;
            this.$payment.pay(data.id).then(res => {
                if (this.showPayResult) {
                    uni.redirectTo({
                        url: `/pages/order-submit/pay-result?payment_order_union_id=${data.id}&order_page_url=${encodeURIComponent(this.orderPageUrl)}`,
                    });
                } else {

                    let page_url = this.orderPageUrl;
                    if (page_url.indexOf('?') === -1) {
                        page_url += '?'
                    } else {
                        page_url += '&';
                    }

                    delete data.id;

                    page_url += `pay_data=${JSON.stringify(data)}`;

                    uni.redirectTo({
                        url: page_url,
                    });
                }
            }).catch(e => {
                if (this.payCancelUrl) {
                    let page_url = this.payCancelUrl;
                    if (page_url.indexOf('?') === -1) {
                        page_url += '?'
                    } else {
                        page_url += '&';
                    }
                    page_url += `pay_data=${JSON.stringify(data)}`;
                    uni.redirectTo({
                        url: page_url,
                    });
                } else {
                    if (e.errMsg === '5b03b6e009796c698d132908cb635fca') {
                        //重新发起支付
                        this.submitLock = false;
                    } else {
                        uni.showModal({
                            title: '提交失败',
                            content: e.errMsg,
                            showCancel: false,
                            success: () => {
                                uni.redirectTo({
                                    url: this.orderPageUrl,
                                });
                            },
                        });
                    }
                }
            });
        },
        jump() {
            uni.navigateTo({
                url: `/pages/order-submit/map`,
            });
        },
        checkCouponError() {
            for (let i in this.previewData.mch_list) {
                if (this.previewData.mch_list[i].coupon && this.previewData.mch_list[i].coupon.coupon_error) {
                    uni.showModal({
                        title: '',
                        content: this.previewData.mch_list[i].coupon.coupon_error,
                        showCancel: false,
                    });
                    return;
                }
            }
        },
        setDiyFormScrollStatus() {
            for (let i in this.previewData.mch_list) {
                let order_form = this.previewData.mch_list[i].order_form;
                if (order_form) {
                    if (order_form.value && order_form.value.length && order_form.value.length >= 5) {
                        order_form.show_scroll = true;
                    } else {
                        order_form.show_scroll = false;
                    }
                }
            }
        },
        subscribe() {
            if (this.p_pay_id) {
                this.pay({
                    id: this.p_pay_id
                });
                return true;
            } else {
                this.p_pay_id = '';
            }
            for (let i in this.$store.state.orderSubmit.formData.list) {
                const item = this.$store.state.orderSubmit.formData.list[i];
                if (!item.order_form_validate_result) continue;
                if (item.order_form_validate_result.hasError) {
                    uni.showModal({
                        title: '提示',
                        content: item.order_form_validate_result.errors[0].msg,
                        showCancel: false,
                    });
                    return;
                }
            }
            for (let i in this.$store.state.orderSubmit.formData.list) {
                for (let j in this.$store.state.orderSubmit.formData.list[i].goods_list) {
                    const item = this.$store.state.orderSubmit.formData.list[i].goods_list[j];
                    if (!item.goods_form_validate_result) continue;
                    if (item.goods_form_validate_result.hasError) {
                        uni.showModal({
                            title: '提示',
                            content: item.goods_form_validate_result.errors[0].msg,
                            showCancel: false,
                        });
                        return;
                    }
                }
                if (this.plugin === 'booking' && this.$store.state.orderSubmit.formData.list[i]) {
                    this.bookStorage('save', this.$store.state.orderSubmit.formData.list[i].store_id);
                }
            }
            if (this.submitLock) return;
            this.submitLock = true;
            this.$subscribe(this.previewData.template_message_list).then(res => {
                this.submit();
            }).catch(() => {
                this.submit();
            });
        },
        handleGoodsFormInput({data, sign}) {
            const signArr = sign.split(',');
            const mchIndex = parseInt(signArr[0]);
            const goodsIndex = parseInt(signArr[1]);
            // const formId = parseInt(signArr[2]);
            const result = [];
            for (let i in data) {
                result[i] = {
                    key: data[i].key,
                    label: data[i].name,
                    value: data[i].value,
                    required: data[i].is_required,
                };
            }
            const formData = this.$store.state.orderSubmit.formData;
            formData.list[mchIndex].goods_list[goodsIndex].form_data = result;
            this.$store.commit('orderSubmit/mutSetFormData', formData);
        },
        handleGoodsFormValidate({result, sign}) {
            if (!sign) return;
            const signArr = sign.split(',');
            const mchIndex = parseInt(signArr[0]);
            const goodsIndex = parseInt(signArr[1]);
            const formData = this.$store.state.orderSubmit.formData;
            formData.list[mchIndex].goods_list[goodsIndex].goods_form_validate_result = result;
            this.$store.commit('orderSubmit/mutSetFormData', formData);
        },
        updateGoodsCount() {
            for (let i in this.previewData.mch_list) {
                let count = 0;
                for (let j in this.previewData.mch_list[i].goods_list) {
                    count += parseInt(this.previewData.mch_list[i].goods_list[j].num);
                }
                this.previewData.mch_list[i].goods_count = count;
            }
        },
        handleAddressInput(e) {
            if (typeof e.name !== 'undefined') this.previewData.address.name = e.name;
            if (typeof e.mobile !== 'undefined') this.previewData.address.mobile = e.mobile;
        },
        // #ifdef H5
        weChartPay(id) {
            this.$request({
                url: this.$api.registered.pay,
                method: 'get',
                data: {
                    payment_order_union_id: id
                }
            }).then((res) => {
                if (res.code === 0) {
                    if (res.data.status === 1) {
                        uni.redirectTo({
                            url: `/pages/order-submit/pay-result?payment_order_union_id=${id}&order_page_url=${encodeURIComponent(this.orderPageUrl)}`,
                        });
                    } else {
                        if (this.orderPageUrl) {
                            uni.redirectTo({
                                url: this.orderPageUrl
                            });
                        } else {
                            uni.redirectTo({
                                url: '/pages/order/index/index'
                            });
                        }
                    }
                }
            })
        }
        // #endif
    },
}
</script>
<style scoped lang="scss">
$submitBarHeight: #{110rpx};
$borderColor: $uni-weak-color-one;
$xWidth: #{24rpx};
$yWidth: #{24rpx};

.page {
    padding-bottom: $submitBarHeight;
    font-size: #{28rpx};
    line-height: 1;
    color: #353535;
}

.u-submit-bar-height {
  height: 82upx;
}

.group {
    margin: #{20rpx} #{26rpx};
    background: #fff;
    border-radius: #{16rpx};
    overflow: hidden;
    box-shadow: 0 0 #{5rpx} rgba(0, 0, 0, 0.025);
}

.row {
    padding: #{12rpx} #{32rpx};
}

.row.no-px {
    padding-left: 0;
    padding-right: 0;
}

.line {
    height: 0;
    width: 100%;
    background: #e2e2e2;
    border-bottom: #{1rpx} solid #e2e2e2;
}

.font-bold {
    font-weight: bold;
}

.font-small {
    font-size: #{24rpx};
}

.font-gray {
    color: #999999;
}

.title-icon {
    width: #{28rpx};
    height: #{25rpx};
    display: block;
}

.mr-12 {
    margin-right: #{12rpx};
}

.ellipsis-1 {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.ellipsis-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
}


.send-type {
    display: inline-block;
    padding: 0 0;
    height: #{56rpx};
    line-height: #{56rpx};
    width: #{190rpx};
    text-align: center;
    border-radius: #{100rpx};
    margin: 0 #{32rpx} 0 0;
    font-size: #{28rpx};
}

.send-type:last-child {
    margin-right: 0;
}

.delivery-coverage-btn {
    display: inline-block;
    padding: 0 #{20rpx};
    height: #{56rpx};
    line-height: #{56rpx};
    text-align: center;
    border-radius: #{100rpx};
    font-size: #{24rpx};
    border: #{1rpx} solid #e5e5e5;
    color: #666;
}

.more-discount-info {
    background: #f7f7f7;
    padding: #{6rpx} #{14rpx};
    position: relative;
    border-radius: #{8rpx};
}

.more-discount-info:before {
    display: block;
    content: " ";
    width: 0;
    height: 0;
    position: absolute;
    right: #{30rpx};
    top: -#{39rpx};
    border: #{20rpx} solid transparent;
    border-bottom-color: #f7f7f7;
}

.insert-rows {
    height: 0;
    overflow: hidden;
    transition: 200ms;
    padding: 0 0;
    visibility: hidden;

    view {
        font-size: #{24rpx};
    }
}

.show .insert-rows {
    height: auto;
    padding: #{24rpx} 0;
    visibility: visible;
}

.show .bottom-icon,
.bottom-icon.show {
    transform: rotate(180deg);
    transition: 200ms;
}

.svip {
    view {
        color: #e4cdbb;
    }

    height: #{120rpx};
    background-size: 100% 100%;
    background-color: #3c352e;
    padding-left: #{110rpx};
    border-radius: #{12rpx};

    .vip-card-name {
        max-width: #{90rpx};
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: #{24rpx};
        color: #f3be94;
    }
}

.goods-form {
    .goods-list {
        padding-top: #{12rpx};
        padding-bottom: #{12rpx};
    }

    .goods-item {
        margin: #{12rpx} 0;
    }

    .goods-image {
        width: #{200rpx};
        height: #{200rpx};
        margin-right: #{24rpx};
    }

    .goods-name {
        line-height: #{35rpx};
        height: #{70rpx};
        margin-bottom: #{32rpx};
    }
}

/* ---------- */


.submit-bar {
    //background: #fff;
    //border-top: #{1rpx} solid $uni-weak-color-two;
    //position: fixed;
    //left: 0;
    //bottom: 0;
    //width: 100%;
    //z-index: 1000;

    .price-info {
        padding: 0 0;

        >view {
            margin: #{16rpx} 0;
        }
    }

    .submit-btn {
        width: 240upx;
        text-align: center;
        border-radius: 41upx;
    }

    .submit-btn:active {
        box-shadow: inset 0 0 #{500rpx} rgba(0, 0, 0, .15);
    }

    .submit-btn.lock {
        box-shadow: inset 0 0 #{500rpx} rgba(255, 255, 255, 0.35);
    }

    .submit-btn.disabled {
        background: $uni-general-color-two;
    }
}

.theme-color {
    color: #ffffff;
}

.u-bottom-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 997;
    background-color: #ffffff;
    box-shadow: 0 -1rpx 20rpx -15rpx #353535;
}
.bd-bottom {
    width: 750upx;
    height: 110upx;
    padding: 14upx 24upx;
}
.full-tip {
	width: 750upx;
	height: 58upx;
	line-height: 58upx;
}
.full-tip-show {
	background-color: #ffecec;
	font-size: #{24rpx};
	text-align: center;
	
	.full-tip-text {
		color: #FF4544;
	}
}
</style>