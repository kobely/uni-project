<template>
	<view class="app-goods-list">
        <view class="goods-list" :class="listClass" v-if="newData.length > 0">
            <!-- 列表模式 -->
            <template v-if="listStyle === -1">
                <block v-for="(goods, index) in newData" :key="index">
                    <view :style="[{'background-color':`${goodsStyle != 3 ? '#fff' : ''}`, overflow: `${sign === 'composition' ? 'hidden': 'visible'}`}]" class="goods-item app-list-mode dir-left-nowrap" @click="jump(goods)"
                          :class="goodsStyle === 3 ? 'no-border' : goodsStyle === 2 ? 'border' : ''">

                        <!-- 售罄 -->
                        <view :style="[{'border-radius': `${lisRadius}`}]" class="out-dialog" v-if="(goods.goods_stock == 0 || (goods.goods && goods.goods.goods_stock == 0)) && appSetting.is_show_stock == '1'">
                            <image :style="[{'border-radius': `${lisRadius}`}]" :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic"></image>
                        </view>

                        <view class="box-grow-0">
                            <app-image
                                    v-if="sign === 'advance'"
                                    :borderRadius="lisRadius"
                                    :img-src="goods.goods.goodsWarehouse.cover_pic"
                                    width="220rpx"
                                    height="220rpx"
                                    :mode="fill === 1 ? 'aspectFill' : 'aspectFit'"
                            ></app-image>
                            <div v-else-if="sign === 'composition'" style="width: 328rpx;height: 100%">
                                <app-diy-composition-image
                                        :mode="fill === 1 ? 'aspectFill' : 'aspectFit'"
                                        :image-list="goods.cover_pic_list"></app-diy-composition-image>
                            </div>
                            <app-image
                                    v-else
                                    :borderRadius="lisRadius"
                                    :img-src="goods.cover_pic"
                                    width="220rpx"
                                    height="220rpx"
                                    :mode="fill === 1 ? 'aspectFill' : 'aspectFit'"
                            ></app-image>
                        </view>

                        <!-- 角标 -->
                        <view class="goods-tag" v-if="showGoodsTag">
                            <app-image :img-src="goodsTagPicUrl" width="64rpx" height="64rpx"></app-image>
                        </view>
                        <view class="right box-grow-1 dir-top-nowrap main-between"
                              :style="{
                                padding: sign === 'advance' || sign=== 'composition' || (sign === 'flash-sale' && ((goods.vip_card_appoint && goods.vip_card_appoint.discount) && (goods.level_show == 1 && goods.is_negotiable != 1))) ? `10rpx 24rpx 6rpx 20rpx` : '28rpx 24rpx 24rpx 20rpx',
                                height: sign === 'composition' ? '165rpx' : '220rpx',
                          }">
                            <view class="box-grow-0 name "
                                  :class="(sign === 'advance' || sign === 'miaosha' || sign === 'flash-sale') || (goods.vip_card_appoint && goods.vip_card_appoint.discount) || (goods.level_show == 1 && goods.is_negotiable != 1) ? 't-omit name-one' : 't-omit-two name-two'">
                                <text class="dir-tag-def"
                                      v-if="tag && sign === 'advance' || sign === 'pick'|| sign === 'miaosha'"
                                      :style="{'background-color': theme.background_o,'color': theme.color}"
                                >
                                    {{goods.people_num ? goods.people_num : ''}}{{tag}}
                                </text>
                                <text class="dir-tag-def"
                                      v-if="tag && sign !== 'advance' && sign !== 'pick' && sign !== 'miaosha'  && ((sign == 'pintuan' && goods.people_num) || sign != 'pintuan')"
                                      :style="{'background-color': theme.background_o,'color': theme.color}"
                                >
                                    {{goods.people_num ? goods.people_num : ''}}{{tag}}
                                </text>

                                <!-- 商品名字 -->
                                <text v-if="sign === 'advance'">
                                    {{showGoodsName ? goods.goods.goodsWarehouse.name : ''}}
                                </text>
                                <text v-else>{{showGoodsName ? goods.name : ''}}</text>
                            </view>

                            <view class=" dir-top-nowrap main-right box-grow-1">
                                <template v-if="sign === 'flash-sale'">
                                    <view class="dir-left-nowrap main-between" style="margin-bottom: 10rpx">
                                        <view
                                                class="flash-sale"
                                                :style="{'background-color': theme.background}"
                                                v-if="goods.discount_type == 1"
                                        >{{goods.min_discount}}折</view>
                                        <view
                                                class="flash-sale"
                                                :style="{'background-color': theme.background}"
                                                v-if="goods.discount_type == 2"
                                        >减{{goods.min_discount}}元</view>
                                        <view v-if="showProgressBar" style="font-size: 20rpx;color: #999999;">{{goods.sales}}</view>
                                    </view>
                                    <view class="app-percentage" v-if="showProgressBar" :style="{'width': '445rpx','margin-bottom': '10rpx','background-color': theme.background_l}">
                                        <view :style="{width: `${goods.percentage}%`,'background-color': theme.background}"></view>
                                    </view>
                                </template>
                                <view class="dir-left-nowrap cross-bottom">
                                    <view class="box-grow-1" :style="{'color': theme.color}">
                                        <!-- 时间 -->
                                        <template v-if="showTimer && sign !== 'flash-sale'">
                                            <app-goods-timer
                                                    v-if="sign === 'advance'"
                                                    :list-style="listStyle"
                                                    :theme="theme"
                                                    :start-date-time="goods.start_prepayment_at"
                                                    :end-date-time="goods.end_prepayment_at"
                                                    :sign="sign"
                                                    :page-hide="pageHide"
                                            ></app-goods-timer>
                                            <app-goods-timer
                                                    v-else
                                                    :list-style="listStyle"
                                                    :start-date-time="goods.start_time"
                                                    :end-date-time="goods.end_time"
                                                    :sign="sign"
                                                    :page-hide="pageHide"
                                                    :theme="theme"
                                            ></app-goods-timer>
                                        </template>
                                        <!-- #ifndef MP-ALIPAY -->
                                        <text v-if="sign === 'advance'" class="des-price"
                                              :style="{'color': theme.color,'border-color': theme.color,'margin-top': '5rpx'}">
                                            定金￥{{goods.deposit}}抵￥{{goods.swell_deposit}}
                                        </text>
                                        <!-- #endif -->
                                        <!-- #ifdef MP-ALIPAY -->
                                        <text v-if="sign === 'advance'" class="des-price" 
                                              :style="{'color': theme.color,'border-color': theme.color,'margin-top': '5rpx'}">
                                            定金￥{{goods.deposit}}抵￥{{goods.swell_deposit}}
                                        </text>
                                        <!-- #endif -->
                                        <text class="tag" v-else-if="sign === 'pick'">
                                            {{goods.rule_price}}元选{{goods.rule_num}}{{goods.unit}}
                                        </text>

                                        <template v-if="goods.is_level == 1 && goods.is_negotiable != 1">
                                            <app-member-price :price="goods.level_price"></app-member-price>
                                        </template>
                                        <!-- #ifndef MP-ALIPAY -->
                                        <app-sup-vip
                                                :is_vip_card_user="goods.vip_card_appoint.is_vip_card_user"
                                                v-if="goods.vip_card_appoint && goods.vip_card_appoint.discount"
                                                :discount="goods.vip_card_appoint && goods.vip_card_appoint.discount"
                                        ></app-sup-vip>
                                        <!-- #endif -->
                                        <!-- #ifdef MP-ALIPAY -->
                                        <app-sup-vip
                                                margin="4rpx 0"
                                                :is_vip_card_user="goods.vip_card_appoint.is_vip_card_user"
                                                v-if="goods.vip_card_appoint && goods.vip_card_appoint.discount"
                                                :discount="goods.vip_card_appoint && goods.vip_card_appoint.discount"
                                        ></app-sup-vip>
                                        <!-- #endif -->
                                        <template v-if="sign === 'advance'">
                                            <view class="dir-left-nowrap main-left cross-center">
                                                <view class="goods-price ">￥{{showGoodsPrice ? goods.goods.price :''}}
                                                </view>
                                                <view class="original-price" style="margin-left: 10upx;"
                                                      v-if="isUnderLinePrice && goods.goods.goodsWarehouse.original_price">
                                                    ￥{{goods.goods.goodsWarehouse.original_price}}
                                                </view>
                                            </view>
                                        </template>
                                        <view v-else
                                              :class="sign === 'miaosha'|| (sign === 'flash-sale' && showProgressBar) || (goods.vip_card_appoint && goods.vip_card_appoint.discount) || (goods.is_level == 1 && goods.is_negotiable != 1) ? 'dir-left-nowrap main-left cross-center' :  'dir-top-nowrap'">
                                            <view class="goods-price ">{{showGoodsPrice  ?
                                                goods.price_content :
                                                ''}}
                                            </view>
                                            <view class="dir-left-nowrap">
                                                <view class="original-price" style="margin-left: 10upx;"
                                                      v-if="isShowOriginalPrice(goods)">
                                                    ￥{{goods.original_price}}
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                    <!--购物车-->
                                    <view v-if="showBuyBtn && goods.is_negotiable != 1" :style="goods.buy_goods_auth ? btnStyle : disableBtnStyle" :class="[buyBtnClass, 'box-grow-0', 'buy-btn', 'main-center', 'cross-center']">{{buyBtnText}}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </block>
            </template>
            <!-- 一行一个 -->
            <template v-else-if="listStyle === 1">
                <block v-for="(goods, index) in newData" :key="index">
                    <view :style="[{'background-color':`${goodsStyle != 3 ? '#fff' : ''}`,overflow: `${sign === 'composition' ? 'hidden': 'visible'}`}]"
                      class="goods-item app-column-1" :class="[goodsClass, index !== newData.length - 1 ? 'app-column-1-mar' : '']" @click="jump(goods)">
                    <view style="position: relative;">
                        <view class="out-dialog"
                              :style="[{'height':`${coverPicHeight}`,'border-radius': `${imgRadius}`}]"
                              v-if="(goods.goods_stock == 0 || (goods.goods && goods.goods.goods_stock == 0)) && appSetting.is_show_stock == '1'">
                            <image v-if="coverPicHeight == '468rpx'"
                                   :style="[{'height':`${coverPicHeight}`,'border-radius': `${imgRadius}`}]"
                                   :src="appSetting.is_use_stock == '1' ? appImg.rate_out : appSetting.sell_out_other_pic"></image>
                            <image v-else
                                   :style="[{'height':`${coverPicHeight}`,'border-radius': `${imgRadius}`}]"
                                   :src="appSetting.is_use_stock == '1' ? appImg.one_out : appSetting.sell_out_pic"></image>
                        </view>
                        <view>
                            <app-image :borderRadius="imgRadius" v-if="sign === 'advance'"
                                       :img-src="goods.goods.goodsWarehouse.cover_pic"
                                       width="100%"
                                       :height="coverPicHeight"
                                       :mode="fill === 1 ? 'aspectFill' : 'aspectFit'"
                            ></app-image>
                            <div v-else-if="sign === 'composition'" style="width: 100%;height: 336rpx">
                                <app-diy-composition-image
                                        :mode="fill === 1 ? 'aspectFill' : 'aspectFit'"
                                        :image-list="goods.cover_pic_list"></app-diy-composition-image>
                            </div>
                            <app-image :borderRadius="imgRadius" v-else
                                       :img-src="goods.cover_pic"
                                       width="100%"
                                       :height="coverPicHeight"
                                       :mode="fill === 1 ? 'aspectFill' : 'aspectFit'"
                            ></app-image>
                        </view>
                        <view class="goods-tag" v-if="showGoodsTag">
                            <app-image :img-src="goodsTagPicUrl"
                                       width="64rpx"
                                       height="64rpx"
                            >
                            </app-image>
                        </view>
                        <view class="box-grow-0 timer" v-if="showTimer">
                            <template v-if="sign === 'advance'">
                                <app-goods-timer
                                        :list-style="listStyle"
                                        :start-date-time="goods.start_prepayment_at"
                                        :end-date-time="goods.end_prepayment_at"
                                        :sign="sign" :page-hide="pageHide"
                                        :theme="theme"
                                ></app-goods-timer>
                            </template>
                            <template v-else>
                                <app-goods-timer
                                        :list-style="listStyle"
                                        :start-date-time="goods.start_time"
                                        :end-date-time="goods.end_time"
                                        :sign="sign" :page-hide="pageHide"
                                        :theme="theme"
                                ></app-goods-timer>
                            </template>
                        </view>
                    </view>
                    <view class="goods-name t-omit-two" v-if="showGoodsName">
                        <template v-if="sign === 'advance'">
                            <text>{{showGoodsName ? goods.goods.goodsWarehouse.name : ''}}</text>
                        </template>
                        <template v-if="['pick', 'gift', 'exchange', 'wholesale', 'step'].indexOf(sign) !== -1">
                            <text class="tag-pick"
                                    :style="{'background-color': theme.background_o,'color': theme.color}"
                                {{tag}}
                            </text>
                            <text>{{showGoodsName ? goods.name : ''}}</text>
                        </template>
                        <template v-else-if="sign === 'composition'">
                            <text class="tag-pick" :style="{'background-color': theme.background_o,'color': theme.color}">
                                {{goods.tag}}
                            </text>
                            <text>{{showGoodsName ? goods.name : ''}}</text>
                        </template>
                        <template v-else>
                            <text class="tag"
                                  :style="{'border-color': theme.border,'color': theme.color}"
                                  v-if="tag && sign == 'pintuan' && goods.people_num">
                                {{goods.people_num ? goods.people_num : ''}}{{tag}}
                            </text>
                            <text>{{showGoodsName ? goods.name : ''}}</text>
                        </template>
                    </view>
                    <template v-if="sign === 'advance'">
                        <text class="des-price" :style="{'border-color': theme.border,'color': theme.color,'margin-left':'24rpx','margin-top':'15rpx'}">
                            定金￥{{goods.deposit}}抵￥{{goods.swell_deposit}}
                        </text>
                    </template>
                    <template v-if="sign === 'flash-sale'">
                        <view class="dir-top-nowrap" style="margin-bottom: 10rpx;padding:0 24rpx;">
                            <view :class="showProgressBar ? 'flash-sale-dis' : ''">
                                <view class="flash-sale" :style="{'background-color': theme.background}"
                                      v-if="goods.discount_type == 1">{{goods.min_discount}}折</view>
                                <view class="flash-sale" :style="{'background-color': theme.background}"
                                      v-if="goods.discount_type == 2">减{{goods.min_discount}}元</view>
                            </view>
                            <view v-if="showProgressBar" class="app-percentage" :style="{'background-color': theme.background_l,'width':'660rpx'}">
                                <view :style="{width: `${goods.percentage}%`,'background-color': theme.background}"></view>
                            </view>
                            <view v-if="sign === 'flash-sale' && showProgressBar" style="font-size: 20rpx;color: #999999;">{{goods.sales}}</view>
                        </view>
                    </template>
                    <template v-if="sign === 'pick'">
                        <text class="des-price"
                              :style="{'border-color': theme.border,'color': theme.color,'margin-left':'24rpx','margin-top':'15rpx'}">
                            {{goods.rule_price}}元选{{goods.rule_num}}{{goods.unit}}
                        </text>
                    </template>
                    <view class="price dir-left-nowrap cross-center"
                          :style="{marginTop: sign === 'advance' ? '0rpx' : '16rpx'}">
                        <view class="box-grow-1 t-omit" :style="{'color': theme.color}">
                            <view v-if="sign === 'advance'" class="dir-left-nowrap cross-center"
                                  :class="textStyle === 2 ? 'main-center' : ''">
                                <view v-if="goods.goods.is_level == 1">
                                    <app-member-price :price="goods.level_price"></app-member-price>
                                </view>
                                <app-sup-vip :is_vip_card_user="goods.vip_card_appoint.is_vip_card_user"
                                             margin='0 0 0 12rpx' v-if="goods.vip_card_appoint && goods.vip_card_appoint.discount"
                                             :discount="goods.vip_card_appoint && goods.vip_card_appoint.discount"></app-sup-vip>
                            </view>
                            <template v-if="sign === 'advance'">
                                <view :class="{'dir-left-nowrap': goods.goods.is_level == 1}"
                                      v-if="showGoodsPrice">
                                    <view class="dir-left-nowrap cross-center"
                                          :class="{'main-center' :textStyle == 2}">
                                        <view style="font-size: 22rpx;height: 22rpx;line-height: 22rpx">
                                            {{showGoodsPrice ? `￥${goods.goods.price}` : ''}}
                                        </view>
                                    </view>
                                    <view class="original-price"
                                          style="font-size: 17rpx;height:17rpx;line-height: 17rpx;"
                                          v-if="isUnderLinePrice && goods.goods.goodsWarehouse.original_price">
                                        ￥{{goods.goods.goodsWarehouse.original_price}}
                                    </view>
                                </view>
                            </template>
                            <template v-else>
                                <view class="dir-left-nowrap cross-center"
                                      :class="textStyle === 2 ? 'main-center' : ''">
                                    <view>{{showGoodsPrice  ? goods.price_content :
                                        ''}}
                                    </view>
                                    <view class="member-price"
                                          v-if="goods.is_level == 1 && goods.is_negotiable != 1 && sign !== 'pick'">
                                        <app-member-price margin=""
                                                          :price="goods.level_price"></app-member-price>
                                    </view>
                                    <app-sup-vip :is_vip_card_user="goods.vip_card_appoint.is_vip_card_user"
                                                 margin='0 0 0 12rpx'
                                                 v-if="goods.vip_card_appoint && goods.vip_card_appoint.discount"
                                                 :discount="goods.vip_card_appoint && goods.vip_card_appoint.discount"></app-sup-vip>
                                </view>
                                <view class="original-price"
                                      v-if="isShowOriginalPrice(goods)">
                                    ￥{{goods.original_price}}
                                </view>
                            </template>
                        </view>
                        <template v-if="showBuyBtn && goods.is_negotiable != 1 && textStyle !== 2">
                            <view class="box-grow-0 buy-btn main-center cross-center" :style="goods.buy_goods_auth ? btnStyle : disableBtnStyle" :class="buyBtnClass">
                                {{buyBtnText}}
                            </view>
                        </template>
                    </view>
                </view>
                </block>
            </template>
            <!-- 一行两个 -->
            <template v-else-if="listStyle === 2">
                <block v-for="(goods, index) in newData" :key="index">
                    <view :style="[{'background-color':`${goodsStyle != 3 ? '#fff' : ''}`, overflow: `${sign === 'composition' ? 'hidden': 'visible'}`}]"
                      class="box-grow-0 dir-top-nowrap goods-item app-column-2" :class="goodsClass"
                      @click="jump(goods)">
                    <view style="position: relative;">
                        <view :style="[{'border-radius': `${imgRadius}`}]" class="out-dialog"
                              v-if="(goods.goods_stock == 0 || (goods.goods && goods.goods.goods_stock == 0)) && appSetting.is_show_stock == '1'">
                            <image :style="[{'border-radius': `${imgRadius}`}]"
                                   :src="appSetting.is_use_stock == '1' ? appImg.book_out : appSetting.sell_out_pic"></image>
                        </view>
                        <view class="box-grow-0">
                            <template v-if="sign === 'advance'">
                                <app-image :borderRadius="imgRadius"
                                           :img-src="goods.goods.goodsWarehouse.cover_pic"
                                           width="100%"
                                           height="342rpx"
                                           :mode="fill === 1 ? 'aspectFill' : 'aspectFit'"
                                ></app-image>
                            </template>
                            <div v-else-if="sign === 'composition'" style="width: 100%;height: 164rpx">
                                <app-diy-composition-image
                                        :mode="fill === 1 ? 'aspectFill' : 'aspectFit'"
                                        :image-list="goods.cover_pic_list"></app-diy-composition-image>
                            </div>
                            <template v-else>
                                <app-image :borderRadius="imgRadius" :img-src="goods.cover_pic" width="100%"
                                           height="342rpx"
                                           :mode="fill === 1 ? 'aspectFill' : 'aspectFit'"></app-image>
                            </template>
                        </view>
                        <view class="goods-tag" v-if="showGoodsTag">
                            <app-image :img-src="goodsTagPicUrl" width="64rpx"
                                       height="64rpx"></app-image>
                        </view>
                        <view class="box-grow-0 timer" v-if="showTimer">
                            <template v-if="sign === 'advance'">
                                <app-goods-timer :list-style="listStyle"
                                                 :start-date-time="goods.start_prepayment_at"
                                                 :end-date-time="goods.end_prepayment_at"
                                                 :sign="sign" :page-hide="pageHide"
                                                 :theme="theme"
                                ></app-goods-timer>
                            </template>
                            <template v-else>
                                <app-goods-timer :list-style="listStyle" :start-date-time="goods.start_time"
                                                 :end-date-time="goods.end_time"
                                                 :sign="sign" :page-hide="pageHide"
                                                 :theme="theme"
                                ></app-goods-timer>
                            </template>
                        </view>
                    </view>
                    <view class="box-grow-1 dir-top-nowrap main-between">
                        <view class="box-grow-0 goods-name t-omit-two" v-if="showGoodsName">
                            <template v-if="['advance', 'pick', 'gift', 'exchange', 'composition', 'wholesale', 'step'].indexOf(sign) === -1">
                                <text class="tag"
                                      :style="{'border-color': theme.border,'color': theme.color}"
                                      v-if="tag && ((sign === 'pintuan' && goods.people_num) || sign !== 'pintuan')">
                                    {{goods.people_num ? goods.people_num : ''}}{{tag}}
                                </text>
                            </template>
                            <template v-if="['pick', 'gift', 'exchange', 'wholesale', 'step'].indexOf(sign) !== -1">
                                <text class="dir-tag-def"
                                      :style="{'background-color': theme.background_o,'color': theme.color}">
                                    {{tag}}
                                </text>
                            </template>
                            <template v-if="sign === 'composition'">
                                <text class="dir-tag-def"
                                      :style="{'background-color': theme.background_o,'color': theme.color}">
                                    {{goods.tag}}
                                </text>
                            </template>
                            <text v-if="sign === 'advance'">{{showGoodsName ?
                                goods.goods.goodsWarehouse.name : ''}}
                            </text>
                            <text v-else>{{showGoodsName ? goods.name : ''}}</text>
                        </view>
                        <view v-if="sign === 'advance'">
                            <text class="des-price"
                                  :style="{'background-color': theme.background,'border-color': theme.color,'margin-left':'24rpx'}">
                                定金￥{{goods.deposit}}抵￥{{goods.swell_deposit}}
                            </text>
                        </view>
                        <view v-if="sign === 'pick'">
                            <text class="des-price"
                                  :style="{'background-color': theme.background,'border-color': theme.color,'margin-left':'24rpx'}">
                                {{goods.rule_price}}元选{{goods.rule_num}}{{goods.unit}}
                            </text>
                        </view>
                        <template v-if="sign === 'flash-sale'">
                            <view :class="showProgressBar ? 'flash-sale-dis' : ''" style="margin-left: 24rpx;">
                                <view class="flash-sale" v-if="goods.discount_type === 1" :style="{'background-color': theme.background}">{{goods.min_discount}}折</view>
                                <view class="flash-sale" v-if="goods.discount_type === 2" :style="{'background-color': theme.background}">减{{goods.min_discount}}元</view>
                            </view>
                            <view v-if="showProgressBar" class="app-percentage" :style="{'background-color': theme.background_l,'width':'296rpx','margin-left':'24rpx'}">
                                <view :style="{width: `${goods.percentage}%`,'background-color':theme.background}"></view>
                            </view>
                            <text v-if="showProgressBar" style="font-size: 20rpx; color: #999;margin-top: 10rpx;padding-left: 24rpx">{{goods.sales}}</text>
                        </template>
                        <view :class="textStyle === 2 ? 'main-center' : 'dir-left-nowrap'"
                              style="height: 15px;padding-left: 24rpx;"
                              v-if="sign === 'advance' && goods.goods.is_level == 1 && goods.is_negotiable != 1">
                            <view class="member-price">
                                <app-member-price :price="goods.level_price"></app-member-price>
                            </view>
                        </view>
                        <app-sup-vip :is_vip_card_user="goods.vip_card_appoint.is_vip_card_user"
                                     style="padding-left: 24rpx;"
                                     :class="textStyle === 2 ? 'main-center' : ''" margin="4rpx 0"
                                     v-if="goods.vip_card_appoint && goods.vip_card_appoint.discount && sign === 'advance'"
                                     :discount="goods.vip_card_appoint && goods.vip_card_appoint.discount"></app-sup-vip>
                        <view class="box-grow-0 price dir-left-nowrap cross-bottom main-between"
                              :style="{marginTop: sign === 'advance' ? '0rpx' : '16rpx'}">
                            <template v-if="sign === 'advance'">
                                <view :class="textStyle === 2 ? 'main-center advance-center' : ''"
                                      style="width: 100%" v-if="showGoodsPrice">
                                    <view class="dir-top-nowrap main-right cross-top"
                                          :style="{'color': theme.color}">
                                        <text class="t-omit"
                                              style="font-size: 22rpx;height: 22rpx; line-height: 22rpx">
                                            {{showGoodsPrice ? `￥${goods.goods.price}` : ''}}
                                        </text>
                                        <text class="original-price"
                                              style="font-size: 17rpx;height: 22rpx; line-height: 22rpx"
                                              v-if="isUnderLinePrice && goods.goods.goodsWarehouse.original_price">
                                            ￥{{goods.goods.goodsWarehouse.original_price}}
                                        </text>
                                    </view>
                                </view>
                            </template>
                            <template v-else>
                                <view class="box-grow-1" :style="{'color': theme.color}">
                                    <view class="member-price" :class="textStyle === 2 ? 'main-center' : ''"
                                          v-if="goods.is_level == 1 && goods.is_negotiable != 1 && sign !== 'pick'">
                                        <app-member-price :price="goods.level_price"></app-member-price>
                                    </view>
                                    <view v-if="goods.vip_card_appoint && goods.vip_card_appoint.discount" :class="textStyle === 2 ? 'main-center' : ''">
                                        <app-sup-vip
                                            :is_vip_card_user="goods.vip_card_appoint.is_vip_card_user"
                                            :margin="textStyle === 2 ? '0':'8rpx 0 0'"
                                            :discount="goods.vip_card_appoint && goods.vip_card_appoint.discount"
                                        ></app-sup-vip>
                                    </view>
                                    <view class="t-omit">
                                        {{showGoodsPrice  ? goods.price_content : ''}}
                                    </view>
                                    <view class="original-price"
                                          v-if="isShowOriginalPrice(goods)">
                                        ￥{{goods.original_price}}
                                    </view>
                                </view>
                            </template>
                            <view v-if="showBuyBtn && goods.is_negotiable != 1 && textStyle !== 2" class="box-grow-0 buy-btn main-center cross-center" :style="goods.buy_goods_auth ? btnStyle : disableBtnStyle" :class="buyBtnClass">
                                {{buyBtnText}}
                            </view>
                        </view>
                    </view>
                </view>
                </block>
            </template>
        </view>
	</view>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import appPrice from "../../page-component/goods/app-price.vue";
import appGoodsTimer from "./app-goods-timer.vue";
import appDiyCompositionImage from '../app-diy-goods-list/app-diy-composition-image';

export default {
    name: "app-diy-goods-list",
    components: {
        'app-price': appPrice,
        'app-goods-timer': appGoodsTimer,
        appDiyCompositionImage
    },
    props: {
        list: {
            type: Array,
            default() {
                return [];
            }
        },
        goodsStyle: {
            type: Number,
            default() {
                return 1;
            }
        },
        textStyle: {
            type: Number,
            default() {
                return 1;
            }
        },
        listStyle: {
            type: Number,
            default() {
                return -1;
            }
        },
        showBuyBtn: {
            type: Boolean,
            default() {
                return false;
            }
        },
        buyBtnText: {
            type: String,
            default() {
                return '';
            }
        },
        buyBtnStyle: {
            type: Number,
            default() {
                return 1;
            }
        },
        fill: {
            type: Number,
            default() {
                return 1;
            }
        },
        showGoodsName: {
            type: Boolean,
            default() {
                return true;
            }
        },
        showGoodsPrice: {
            type: Boolean,
            default() {
                return true;
            }
        },
        showGoodsTag: {
            type: Boolean,
            default() {
                return true;
            }
        },
        goodsCoverProportion: {
            type: String,
            default() {
                return '1-1';
            }
        },
        customizeGoodsTag: {
            type: Boolean,
            default() {
                return false;
            }
        },
        goodsTagPicUrl: String,
        sign: String,
        buttonColor: {
            type: String,
            default() {
                return '';
            }
        },
        //是否显示划线价
        isUnderLinePrice: {
            type: Boolean,
            default() {
                return true;
            }
        },
        pageHide: Boolean,
        theme: Object,
        showProgressBar: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },
    data() {
        return {
            imgRadius: '16rpx 16rpx 0 0',
            lisRadius: '16rpx',
			disableColor: '#999999'
        };
    },
    computed: {
        ...mapState({
            appImg: state => state.mallConfig.__wxapp_img.mall,
            appSetting: state => state.mallConfig.mall.setting,
            platform: function(state) {
                return state.gConfig.systemInfo.platform;
            }
        }),
        ...mapGetters('mallConfig',{
            vip: 'getVip',
            getVideo: 'getVideo'
        }),
        newData() {
            return this.list;
        },
        listClass() {
            switch (this.listStyle) {
                case 2:
                    return `dir-left-wrap column-2 main-between `;
                default:
                    return ``;
            }
        },
        buyBtnClass() {
            let buyBtnClass = ``;
            if (this.buyBtnStyle === 2 || this.buyBtnStyle === 4) {
                buyBtnClass += `buy-btn-border `;
            }
            if (this.buyBtnStyle === 4 || this.buyBtnStyle === 3) {
                buyBtnClass += `buy-btn-radius`;
            }
            return buyBtnClass;
        },
        btnStyle() {
            let btnStyle = ``;
            if (this.buyBtnStyle === 1 || this.buyBtnStyle === 3) {
                btnStyle += `background-color: ${this.buttonColor};color: #ffffff;`;
            } else {
                btnStyle += `border-color: ${this.buttonColor};color: ${this.buttonColor};`;
            }
            return btnStyle;
        },
        disableBtnStyle() {
            let btnStyle = ``;
            if (this.buyBtnStyle === 1 || this.buyBtnStyle === 3) {
                btnStyle += `background-color: ${this.disableColor};color: #ffffff;`;
            } else {
                btnStyle += `border-color: ${this.disableColor};color: ${this.disableColor};`;
            }
            return btnStyle;
        },
        coverPicHeight() {
            if (this.goodsCoverProportion === '1-1') {
                return `702rpx`;
            } else {
                return `468rpx`;
            }
        },
        goodsClass() {
            let goodsClass = ``;
            if (this.goodsStyle === 2) {
                goodsClass += `border`;
            }
            if (this.textStyle === 2) {
                goodsClass += `text-center`;
            }
            return goodsClass;
        },
        tag() {
            let tag = '';
            switch (this.sign) {
                case 'miaosha':
                    tag = '秒杀';
                    break;
                case 'bargain':
                    tag = '砍价';
                    break;
                case 'pintuan':
                    tag = '人团';
                    break;
                case 'advance':
                    tag = '预售';
                    break;
                case 'pick':
                    tag = 'N元任选';
                    break;
                case 'composition':
                    tag = '套餐组合';
                    break;
                case 'gift':
                    tag = '社交送礼';
                    break;
                case 'flash-sale':
                    tag = '限时抢购';
                    break;
                case 'wholesale':
                    tag = '商品批发';
                    break;
                case 'exchange':
                    tag = '礼品卡';
                    break;
                case 'step':
                    tag = '步数宝';
                    break;
                default:
                    tag = null;
                    break;
            }
            return tag;
        },
        showTimer() {
            if (!(this.sign === 'miaosha' || this.sign === 'bargain' || this.sign === 'lottery' || this.sign === 'advance' || this.sign === 'flash-sale')) return false;
            return true;
        },
    },
    methods: {
        jump(data) {
            // #ifndef MP-BAIDU
            if (data.video_url && this.getVideo == 1 && data.sign !== 'lottery' && data.sign !== 'bargain' && data.sign !== 'wholesale') {
                let id = data.id;
                if (data.sign === 'advance') {
                    id = data.goods_id;
                }
                if (data.sign === 'gift') {
                    id = id + '&is_share=1';
                }

                // #ifdef MP
                uni.navigateTo({
                    url: `/pages/goods/video?goods_id=${id}&sign=${data.sign}`
                });
                // #endif
                // #ifdef H5
                uni.navigateTo({
                    url: data.page_url
                });
                // #endif
            } else {
                uni.navigateTo({
                    url: data.page_url
                });
            }
            // #endif
            // #ifdef MP-BAIDU
            uni.navigateTo({
                url: data.page_url
            });
            // #endif
        },
        isShowOriginalPrice(goods) {
            return this.isUnderLinePrice && goods.original_price && this.showGoodsPrice && goods.is_negotiable !== 1;
        },
    }
}
</script>

<style scoped lang="scss">
	.advance-member {
		margin-right: #{12rpx};
	}
	.advance-center .original-price {
		width: 100%;
		text-align: center;
	}
    .app-goods-list {
        %background-image {
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
        }
        .goods-list {
            padding: #{24rpx 24rpx 24rpx 24rpx};
            font-size: $uni-font-size-general-one;
            .border {
                border: #{1rpx} solid #e2e2e2;
            }
            .goods-item {
                position: relative;
                .app-button-icon {
                    width: #{45rpx};
                    height: #{45rpx};
                    display: block;
                    @extend %background-image;
                }
                .app-button-icon-cart {
                    background-image: url('../../../static/image/icon/cats.png');
                }
                .app-button-icon-add {
                    background-image: url('../../../static/image/icon/add-to.png');
                }
                .buy-btn {
                    height: #{48rpx};
                    padding: 0 #{20rpx};
                }
                .buy-btn-radius {
                    border-radius: #{24rpx};
                }
                .buy-btn-border {
                    border: #{1rpx} solid;
                }
                .goods-tag {
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 10;
                    width: #{64rpx};
                    height: #{64rpx};
                }
                .original-price {
                    font-size: $uni-font-size-weak-two;
                    color: $uni-general-color-two;
                    text-decoration: line-through;
                }
                .tag {
                    padding: 0 #{10rpx};
                    margin-right: #{8rpx};
                    font-size: #{20rpx};
					line-height: 1;
                    border-radius: #{28rpx};
                    border: #{1rpx} solid;
					transform: rotateZ(360deg);
                }
                .timer {
                    width: 100%;
                }
                .pintuan-tag {
                    font-size: $uni-font-size-weak-two;
                    margin: #{16rpx} #{12rpx} 0 0;
                    padding: 0 #{24rpx};
                    .people {
                        width: #{70rpx};
                        text-align: center;
                        border: #{1rpx} solid;
                        border-radius: #{2rpx};
                        padding: #{2rpx} 0;
                    }
                }
            }
            .app-list-mode {
                margin-bottom: #{32rpx};
                position: relative;
                border-radius: #{16rpx};
				.name {
					font-size: #{28rpx};
					color: #353535;
                    line-height: 38upx;
				}
                .right {
					height: #{220rpx};
                }
                &:last-child {
                    margin-bottom: 0;
                }
                .pintuan-tag {
                    padding: 0;
                }
                .out-dialog {
			        width: #{220rpx};
			        height: 100%;
			        position: absolute;
			        z-index: 11;
			        top: 0;
			        left: 0;
			        background-color: rgba(0,0,0,.5);
			        image {
			            width: #{220rpx};
			            height: #{220rpx};
			        }
                }
            }
            .app-column-1 {
                padding-bottom: #{24rpx};
                border-radius: #{16rpx};
			    .out-dialog {
			        width: 100%;
			        height: #{702rpx};
			        z-index: 11;
			        position: absolute;
			        top: 0;
			        left: 0;
			        background-color: rgba(0,0,0,.5);
			        image {
			            width: #{702rpx};
			            height: #{702rpx};
			        }
			    }
                .goods-name {
                    margin-top: #{28rpx};
                    padding: 0 #{24rpx};
                    font-size: #{28rpx};
                    color: #353535;
                    line-height: 38upx;
                }
                .price {
                    margin-top: #{16rpx};
                    padding: 0 #{24rpx};
                    max-width: #{702rpx};
                    .member-price {
                        margin-left: #{10rpx};
                    }
                }
                .timer {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    z-index: 10;
                }
                .pintuan-tag {
                    margin: 0;
                    padding-left: 0;
                }
            }
            .app-column-1-mar {
                margin-bottom: #{24rpx};
            }
            &.column-2 {
				padding: #{24rpx} #{23rpx} 0 #{23rpx};
				.app-column-2 {
					margin-bottom: #{24rpx};
                    padding-bottom: #{24rpx};
                	border-radius: #{16rpx};
					width: #{346rpx};
				    .out-dialog {
				        width: 100%;
				        height: #{342rpx};
				        position: absolute;
				        z-index: 11;
				        top: 0;
				        left: 0;
				        background-color: rgba(0,0,0,.5);
				        image {
				            width: #{342rpx};
				            height: #{342rpx};
				        }
				    }
                    .goods-name {
                        font-size: #{28rpx};
                        color: #353535;
                        margin-top: #{24rpx};
                        padding: 0 #{24rpx};
                        width: #{344rpx};
                        line-height: 38upx;
                    }
                    .price {
                        margin-top: #{16rpx};
                        padding: 0 #{24rpx};
                        max-width: #{344rpx};
                    }
                    .pintuan-tag ~ .price {
                        margin-top: #{16rpx};
                    }
                    .timer {
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        z-index: 10;
                    }
                }
            }
        }
    }
    .des-price {
	    display: inline-block;
	    padding: #{0rpx 4rpx};
	    border: #{1rpx} solid;
	    border-radius: #{8rpx};
	    font-size: #{20rpx};
		line-height: 1.2;
		transform: rotateZ(360deg);
    }
    .dir-tag-def {
	    padding: 0 #{10rpx};
	    margin-right: #{8rpx};
	    font-size: $uni-font-size-weak-two;
	    border-radius: #{28rpx};
    }
	.seheight {
		height: #{110rpx};
		width: #{430rpx};
	}
    .default-text {
        color: #666666;
    }
	.tag-pick {
		padding: 0 #{10rpx};
		margin-right: #{8rpx};
		font-size: $uni-font-size-weak-two;
		border-radius: #{28rpx};
	}
	.goods-price {
		font-size: #{30upx};
		line-height: 1.1;
	}
    .app-percentage {
        height: #{20rpx};
        border-radius: #{12rpx};
        overflow: hidden;
        >view {
            height: #{20rpx};
            border-radius: #{12rpx};
        }
    }
    .flash-sale {
        padding: 5upx 10upx;
        font-size: 20upx;
        color: #fff;
        line-height: 1;
        border-radius: 14upx;
        margin-right: 10upx;
        display: inline-block;
    }
    .flash-sale-dis {
        margin-bottom: 10upx;
    }
</style>
