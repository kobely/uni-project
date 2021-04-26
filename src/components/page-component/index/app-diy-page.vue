<template>
    <view class="app-diy-page" v-bind:class="mp_link_top ? 'mp_link_top' : ''">
        <view class="nav-bar dir-left-nowrap" v-bind:class="mp_link_top ? 'mp_link_top' : ''" v-if="newData.show_navs == 1">
            <block v-for="(nav, index) in newData.navs" :key="index">
                <view class="nav-bar-one cross-center box-grow-0"
                      v-bind:class="nav_active === index ? 'active' : ''"
                      :style="{'color': nav_active === index ? theme.color : ''}"
                      v-on:click='changeNav(index)'
                >
                    {{nav.name}}
                </view>
            </block>
        </view>
        <view class="diy-template">
            <block v-for="(item, index) in newData.navs" :key="index">
                <template v-if="nav_active === index">
                    <block v-for="(temp, temp_index) in item.template.data" :key="temp_index">
                        <template v-if="temp.id === 'background'">
                            <view
                                class="app-diy-bg"
                                :style="[
                            {'background-color':`${temp.data.backgroundColor}`,
                            'background-image': temp.data.backgroundPicUrl ? `url(${temp.data.backgroundPicUrl})` : `none`,
                            'background-size':`${temp.data.backgroundWidth + '% ' + temp.data.backgroundHeight + '%'}`,
                            'background-position':`${transLabelBackgroundPosition(temp.data.position)}`,
                            'background-repeat':`${transLabelBackgroundRepeat(temp.data.mode)}`}
                        ]"
                            ></view>
                        </template>

                        <!--搜索-->
                        <template v-else-if="temp.id === 'search'">
                            <app-search-for v-bind:value="temp.data"></app-search-for>
                        </template>

                        <!--轮播图-->
                        <template v-else-if="temp.id === 'banner'">
                            <template v-if="temp.data.banners.length > 0">
                                <view :style="{height: temp.data.height + 'rpx'}" v-if="temp.data.effect == 1 || !temp.data.effect">
                                    <app-swiper
                                        :list="temp.data.banners"
                                        :autoplay="temp.data.autoplay === 0 ? true : false"
                                        name="pic_url"
                                        :effect3d="temp.data.style === 2 ? true : false"
                                        :height="temp.data.height"
                                        :effect3dPreviousMargin="50"
                                        :imgMode="temp.data.fill === 0 ? 'aspectFit' : 'scaleToFill'"
                                        :interval="temp.data.interval ? temp.data.interval : 3000"
                                        :duration="temp.data.duration ? temp.data.duration : 500"
                                        :mode="temp.data.mode"
                                    ></app-swiper>
                                </view>
                                <view :style="{height: temp.data.height + 'rpx'}" v-if="temp.data.effect == 2">
                                    <u-swiper
                                        :list="temp.data.banners"
                                        name="pic_url"
                                        :height="temp.data.height"
                                        :interval="temp.data.interval ? temp.data.interval : 3000"
                                        :duration="temp.data.duration ? temp.data.duration : 500"
                                        :mode="temp.data.mode"
                                        :imgMode="temp.data.fill === 0 ? 'aspectFit' : 'scaleToFill'"
                                        :autoplay="temp.data.autoplay === 0 ? true : false"
                                    >
                                    </u-swiper>
                                </view>
                            </template>
                        </template>

                        <!-- 普通商品列表 -->
                        <template v-else-if="temp.id === 'goods'">
                            <view
                                :style="[
                            {'background-color':`${temp.data.backgroundColor}`,
                            'background-image': temp.data.backgroundPicUrl ? `url(${temp.data.backgroundPicUrl})` : `none`,
                            'background-size':`${temp.data.backgroundWidth + '% ' + temp.data.backgroundHeight + '%'}`,
                            'background-position':`${transLabelBackgroundPosition(temp.data.position)}`,
                            'background-repeat':`${transLabelBackgroundRepeat(temp.data.mode)}`}
                        ]">
                                <template v-if="temp.data.catPosition === 'top'">
                                    <u-ordinary-list
                                        v-bind:theme="theme"
                                        v-bind:show-cat="temp.data.showCat"
                                        v-bind:cat-list="temp.data.catList"
                                        v-bind:cat-style="temp.data.catStyle"
                                        v-bind:list="temp.data.list"
                                        v-bind:list-style="temp.data.listStyle"
                                        v-bind:goods-style="temp.data.goodsStyle"
                                        v-bind:goods-tag-pic-url="temp.data.goodsTagPicUrl"
                                        v-bind:goods-cover-proportion="temp.data.goodsCoverProportion"
                                        v-bind:show-goods-tag="temp.data.showGoodsTag"
                                        v-bind:show-goods-name="temp.data.showGoodsName"
                                        v-bind:show-goods-price="temp.data.showGoodsPrice"
                                        v-bind:show-buy-btn="temp.data.showBuyBtn"
                                        v-bind:buy-btn="temp.data.buyBtn"
                                        v-bind:buy-btn-style="temp.data.buyBtnStyle"
                                        v-bind:buy-btn-text="temp.data.buyBtnText"
                                        v-bind:button-color="temp.data.buttonColor"
                                        v-bind:text-style="temp.data.textStyle"
                                        v-bind:is-under-line-price="temp.data.isUnderLinePrice"
                                        v-bind:fill="temp.data.fill"
                                        v-bind:isDIY="true"
                                        v-bind:tag-color="temp.data.tagColor"
                                        v-bind:cat-selected-color="temp.data.catSelectedColor"
                                        v-bind:cat-unselected-color="temp.data.catUnselectedColor"
                                        v-bind:cat-bg-color="temp.data.catBgColor"
                                        v-on:buyProduct="buyProduct"
                                    >
                                    </u-ordinary-list>
                                </template>

                                <template v-else>
                                    <app-recommended-product-list
                                        v-bind:show-cat="temp.data.showCat"
                                        v-bind:show-buy-btn="temp.data.showBuyBtn"
                                        v-bind:cat-style="temp.data.catStyle"
                                        v-bind:cat-list="temp.data.catList"
                                        v-bind:list="temp.data.list" :list-style="temp.data.listStyle"
                                        v-bind:goods-cover-proportion="temp.data.goodsCoverProportion"
                                        v-bind:fill="temp.data.fill" :goods-style="temp.data.goodsStyle"
                                        v-bind:show-goods-name="temp.data.showGoodsName"
                                        v-bind:show-goods-price="temp.data.showGoodsPrice"
                                        v-bind:buy-btn="temp.data.buyBtn" :sign="temp.id"
                                        v-bind:buy-btn-style="temp.data.buyBtnStyle"
                                        v-bind:buy-btn-text="temp.data.buyBtnText"
                                        v-bind:show-goods-tag="temp.data.showGoodsTag"
                                        v-bind:customize-goods-tag="temp.data.customizeGoodsTag"
                                        v-bind:goods-tag-pic-url="temp.data.goodsTagPicUrl"
                                        v-bind:button-color="temp.data.buttonColor"
                                        v-bind:is-under-line-price="temp.data.isUnderLinePrice"
                                        v-bind:theme="theme"
                                        v-bind:cat-position="temp.data.catPosition"
                                        v-on:buyProduct="buyProduct"
                                        v-bind:tag-color="temp.data.tagColor"
                                        v-bind:cat-selected-color="temp.data.catSelectedColor"
                                        v-bind:cat-unselected-color="temp.data.catUnselectedColor"
                                        v-bind:cat-bg-color="temp.data.catBgColor"
                                    ></app-recommended-product-list>
                                </template>
                            </view>
                        </template>

                        <!-- 插件商品列表 -->
                        <template v-else-if="['miaosha', 'flash-sale'].indexOf(temp.id) !== -1 && temp.data.addGoodsType == 0">
                            <app-diy-m-goods-list
                                v-bind:mTitle="temp.data.mTitle"
                                v-bind:mColor="temp.data.mColor"
                                v-bind:mBgType="temp.data.mBgType"
                                v-bind:mBgColor="temp.data.mBgColor"
                                v-bind:mBgGradientColor="temp.data.mBgGradientColor"
                                v-bind:mTimeColor="temp.data.mTimeColor"
                                v-bind:mTimeBgColor="temp.data.mTimeBgColor"
                                v-bind:mGoodsBgColor="temp.data.mGoodsBgColor"
                                v-bind:showGoodsName="temp.data.showGoodsName"
                                v-bind:showGoodsPrice="temp.data.showGoodsPrice"
                                v-bind:showGoodsTag="temp.data.showGoodsTag"
                                v-bind:customizeGoodsTag="temp.data.customizeGoodsTag"
                                v-bind:goodsTagPicUrl="temp.data.goodsTagPicUrl"
                                v-bind:isUnderLinePrice="temp.data.isUnderLinePrice"
                                v-bind:backgroundColor="temp.data.backgroundColor"
                                v-bind:showProgressBar="temp.data.showProgressBar"
                                v-bind:mData="temp.data.mData"
                                v-bind:sign="temp.id"
                                v-bind:theme="theme"
                            ></app-diy-m-goods-list>
                        </template>
                        <template v-else-if="temp.id === 'pintuan'
                            || temp.id === 'miaosha'
                            || temp.id === 'advance'
                            || temp.id === 'booking'
                            || temp.id === 'bargain'
                            || temp.id === 'pick'
                            || temp.id === 'lottery'
                            || temp.id === 'integral-mall'
                            || temp.id === 'gift'
                            || temp.id === 'exchange'
                            || temp.id === 'composition'
                            || temp.id === 'flash-sale'
                            || temp.id === 'step'
                            || temp.id === 'wholesale'">

                            <view :style="[
                            {'background-color':`${temp.data.backgroundColor}`,
                            'background-image': temp.data.backgroundPicUrl ? `url(${temp.data.backgroundPicUrl})` : `none`,
                            'background-size':`${temp.data.backgroundWidth + '% ' + temp.data.backgroundHeight + '%'}`,
                            'background-position':`${transLabelBackgroundPosition(temp.data.position)}`,
                            'background-repeat':`${transLabelBackgroundRepeat(temp.data.mode)}`}]"
                            >
                                <template v-if="temp.id === 'integral-mall' && temp.data.showCoupon">
                                    <app-exclusive-coupon
                                        v-bind:none-color="true"
                                        v-bind:list="temp.data.coupon_list"
                                        v-bind:sign="temp.id"
                                        v-bind:text-color="temp.data.couponColor"
                                        v-bind:show-top="false"
                                        v-bind:coupon_req="coupon_req"
                                        v-bind:unclaimed-bg="temp.data.couponPicUrl"
                                    ></app-exclusive-coupon>
                                </template>
                                <app-diy-goods-list
                                    v-bind:show-buy-btn="temp.data.showBuyBtn"
                                    v-bind:list="temp.data.list"
                                    v-bind:list-style="temp.data.listStyle"
                                    v-bind:goods-cover-proportion="temp.data.goodsCoverProportion"
                                    v-bind:fill="temp.data.fill"
                                    v-bind:goods-style="temp.data.goodsStyle"
                                    v-bind:show-goods-name="temp.data.showGoodsName"
                                    v-bind:text-style="temp.data.textStyle"
                                    v-bind:sign="temp.id"
                                    v-bind:button-color="temp.data.buttonColor"
                                    v-bind:buy-btn-style="temp.data.buyBtnStyle"
                                    v-bind:buy-btn-text="temp.data.buyBtnText"
                                    v-bind:show-goods-tag="temp.data.showGoodsTag"
                                    v-bind:page-hide="pageHide"
                                    v-bind:show-progress-bar="temp.data.showProgressBar"
                                    v-bind:customize-goods-tag="temp.data.customizeGoodsTag"
                                    v-bind:is-under-line-price="temp.data.isUnderLinePrice"
                                    v-bind:goods-tag-pic-url="temp.data.goodsTagPicUrl"
                                    v-bind:theme="theme"
                                ></app-diy-goods-list>
                            </view>

                        </template>

                        <template v-else-if="temp.id === 'rubik'">
                            <view style="position: relative">
                                <app-image-ad
                                    v-bind:image-style="temp.data.style"
                                    v-bind:list="temp.data.list"
                                    v-bind:height="temp.data.height"
                                ></app-image-ad>
                                <block v-for="(hotspot, hotspot_index) in temp.data.hotspot" v-bind:key="hotspot_index">
                                    <app-hotspot v-bind:hotspot="rubikHotspot(hotspot)"></app-hotspot>
                                </block>
                            </view>
                        </template>

                        <template v-else-if="temp.id === 'notice'">
                            <u-announcement
                                v-bind:bgColor="temp.data.background"
                                v-bind:btn-color="temp.data.btnColor"
                                v-bind:btn-height="temp.data.btnHeight"
                                v-bind:btn-radius="`${temp.data.btnRadius}rpx`"
                                v-bind:btn-text="temp.data.btnText"
                                v-bind:btn-text-color="temp.data.btnTextColor"
                                v-bind:btn-width="temp.data.btnWidth"
                                v-bind:content="temp.data.content"
                                v-bind:header-url="temp.data.headerUrl"
                                v-bind:icon="temp.data.icon"
                                v-bind:name="temp.data.name"
                                v-bind:textColor="temp.data.textColor"
                            ></u-announcement>
                        </template>

                        <template v-else-if="temp.id === 'nav'">
                            <!-- 新数据 -->
                            <template v-if="temp.data.modeType">
                                <app-navigation-two-icon
                                    v-bind:mode-type="temp.data.modeType"
                                    v-bind:background="temp.data.backgroundColor"
                                    v-bind:color="temp.data.color"
                                    v-bind:navs="temp.data.navs"
                                    v-bind:columns="temp.data.columns"
                                    v-bind:temp-index="temp_index"
                                    v-bind:nav-type="temp.data.navType"
                                    v-bind:alone-num="temp.data.aloneNum"
                                    v-bind:line-num="temp.data.lineNum"
                                    v-bind:swiper-type="temp.data.swiperType"
                                    v-bind:swiper-color="temp.data.swiperColor"
                                    v-bind:swiper-no-color="temp.data.swiperNoColor"
                                    :bg-type="temp.data.bgType"
                                    :background-pic-url = "temp.data.backgroundPicUrl"
                                ></app-navigation-two-icon>
                            </template>

                            <!-- 老数据 -->
                            <template v-else>
                                <view
                                    :style="[
                                        {'background-color':`${temp.data.backgroundColor}`,
                                        'background-image': temp.data.backgroundPicUrl ? `url(${temp.data.backgroundPicUrl})` : `none`,
                                        'background-size':`${temp.data.backgroundWidth + '% ' + temp.data.backgroundHeight + '%'}`,
                                        'background-position':`${transLabelBackgroundPosition(temp.data.position)}`,
                                        'background-repeat':`${transLabelBackgroundRepeat(temp.data.mode)}`}]"
                                >
                                    <app-navigation-icon
                                        v-bind:background="''"
                                        v-bind:color="temp.data.color"
                                        v-bind:rows="temp.data.rows"
                                        v-bind:columns="temp.data.columns"
                                        v-bind:scroll="temp.data.scroll"
                                        v-bind:navs="temp.data.navs"
                                    ></app-navigation-icon>
                                </view>
                            </template>
                        </template>

                        <template v-else-if="temp.id === 'video'">
                            <app-video
                                v-bind:pic-url="temp.data.pic_url"
                                v-bind:url="temp.data.url"
                                v-bind:has-auto="temp.data.hasAuto"
                                v-bind:has-cycle="temp.data.hasCycle"
                            ></app-video>
                        </template>

                        <template v-else-if="temp.id === 'link'">
                            <app-associated-link
                                v-bind:arrows-switch="temp.data.arrowsSwitch"
                                v-bind:background="temp.data.background"
                                v-bind:color="temp.data.color"
                                v-bind:position="temp.data.position"
                                v-bind:style-color="temp.data.styleColor"
                                v-bind:link="Object.assign({}, temp.data.link)"
                                v-bind:styleNum="temp.data.style"
                                v-bind:pic-switch="temp.data.picSwitch"
                                v-bind:pic-url="temp.data.picUrl"
                                v-bind:font-size="temp.data.fontSize"
                                v-bind:title="temp.data.title"
                            ></app-associated-link>
                        </template>

                        <template v-else-if="temp.id === 'topic'">
                            <template v-if="temp.data.style === 'normal'">
                                <app-special-topic
                                    v-bind:count="temp.data.count"
                                    v-bind:icon="temp.data.icon"
                                    v-bind:logo_1="temp.data.logo_1"
                                    v-bind:logo_2="temp.data.logo_2"
                                    v-bind:topic_list="temp.data.topic_list"
                                ></app-special-topic>
                            </template>

                            <template v-else-if="temp.data.style === 'list'">
                                <app-special-topic-list
                                    v-bind:cat-show="temp.data.cat_show"
                                    v-bind:list="temp.data.list"
                                    v-bind:theme="theme"
                                    v-bind:topic-list="temp.data.topic_list"
                                    v-bind:tag-color="temp.data.tagColor"
                                    v-bind:cat-selected-color="temp.data.catSelectedColor"
                                    v-bind:cat-unselected-color="temp.data.catUnselectedColor"
                                    v-bind:cat-bg-color="temp.data.catBgColor"
                                ></app-special-topic-list>
                            </template>
                        </template>

                        <template v-else-if="temp.id === 'store'">
                            <app-shop
                                v-bind:list="temp.data.list"
                                v-bind:nav-pic-url="temp.data.navPicUrl"
                                v-bind:score-pic-url="temp.data.scorePicUrl"
                                v-bind:show-name="temp.data.showName"
                                v-bind:show-score="temp.data.showScore"
                                v-bind:show-tel="temp.data.showTel"
                                v-bind:scrollTop="scrollTop"
                            ></app-shop>
                        </template>

                        <template v-else-if="temp.id === 'copyright'">
                            <app-copyright
                                v-bind:background-color="temp.data.backgroundColor"
                                v-bind:text="temp.data.text"
                                v-bind:pic-url="temp.data.picUrl"
                                v-bind:link="temp.data.link"
                            ></app-copyright>
                        </template>

                        <template v-else-if="temp.id === 'user-info'">
                            <app-user-center
                                v-bind:top-pic-url="temp.data.backgroundPicUrl"
                                v-bind:member-pic-url="userCenter.member_pic_url"
                                v-bind:top-style="temp.data.style"
                            ></app-user-center>
                        </template>

                        <template v-else-if="temp.id === 'user-order'">
                            <app-my-order
                                v-bind:order_bar="temp.data.navs"
                                v-bind:background-color="temp.data.backgroundColor"
                                v-bind:theme="theme"
                            ></app-my-order>
                        </template>

                        <!-- 优惠券 -->
                        <template v-else-if="temp.id === 'coupon'">
                            <app-exclusive-coupon-two
                                background="#FFFFFF"
                                v-bind:list="temp.data.coupon_list"
                                v-bind:receive-bg="temp.data.receiveBg"
                                v-bind:text-color="temp.data.textColor"
                                v-bind:unclaimed-bg="temp.data.unclaimedBg"
                                v-bind:coupon_req="coupon_req"
                                v-bind:coupon-bg="temp.data.couponBg ? temp.data.couponBg : `#D9BC8B`"
                                v-bind:coupon-bg-type="temp.data.couponBgType"
                                v-bind:add-type="temp.data.addType"
                                v-bind:page_id="page_id"
                                v-bind:template_id="Number.parseInt(item.template_id)"
                                v-bind:d-index="[nav_active,temp_index]"
                                v-bind:m-index="dIndex"
                                v-bind:d-type="dType"
                            ></app-exclusive-coupon-two>
                        </template>

                        <template v-else-if="temp.id === 'timer'">
                            <app-diy-timer
                                v-bind:pic-url="temp.data.picUrl"
                                v-bind:start-date-time="temp.data.startDateTime"
                                v-bind:end-date-time="temp.data.endDateTime"
                                v-bind:page-hide="pageHide"
                                v-bind:bg-pic-url="temp.data.bgPicUrl"
                                v-bind:link="temp.data.link"
                            ></app-diy-timer>
                        </template>

                        <template v-else-if="temp.id === 'mch'">
                            <view :style="[
                                {'background-color':`${temp.data.backgroundColor}`,
                                'background-image': temp.data.backgroundPicUrl ? `url(${temp.data.backgroundPicUrl})` : `none`,
                                'background-size':`${temp.data.backgroundWidth + '% ' + temp.data.backgroundHeight + '%'}`,
                                'background-position':`${transLabelBackgroundPosition(temp.data.position)}`,
                                'background-repeat':`${transLabelBackgroundRepeat(temp.data.mode)}`}]"
                            >
                                <app-goods-shop
                                    v-bind:card-style="temp.data.cardStyle"
                                    v-bind:background-color="temp.data.backgroundColor"
                                    type="diy"
                                    v-bind:theme="theme"
                                    v-bind:mch_list="temp.data.list"
                                    v-bind:coupon_req="coupon_req"
                                    v-bind:is_required="is_required"
                                    v-bind:show-goods="temp.data.showGoods"
                                ></app-goods-shop>
                            </view>
                        </template>

                        <template v-else-if="temp.id === 'empty'">
                            <app-empty
                                v-bind:height="temp.data.height"
                                v-bind:background-color="temp.data.background"
                            ></app-empty>
                        </template>

                        <template v-else-if="temp.id === 'ad'">
                            <app-ad
                                v-bind:unit-id="temp.data.id"
                                v-bind:type="temp.data.type"
                                v-bind:coupon-url="coupon_url"
                                v-bind:video-url="temp.data.video_url"
                                v-bind:pic-url="temp.data.pic_url"
                                v-bind:coupon-params="item | getObje"
                            ></app-ad>
                        </template>

                        <template v-else-if="temp.id === 'modal'">
                            <app-popup-ad
                                v-bind:opened="temp.data.opened"
                                v-bind:times="temp.data.times"
                                v-bind:list="temp.data.list"
                                v-bind:multiple="true"
                                v-bind:is_storage="is_storage"
                                v-bind:mark="homePages.id + '-' + homePages.navs[nav_active].id + '-' + temp_index"
                            ></app-popup-ad>
                        </template>

                        <template v-else-if="temp.id === 'quick-nav' && temp.data.navSwitch == 1">
                            <app-quick-navigation
                                v-bind:value="temp.data"
                                v-bind:use-mall-config="temp.data.useMallConfig"
                            ></app-quick-navigation>
                        </template>

                        <!-- #ifdef MP-WEIXIN -->
                        <template v-else-if="temp.id === 'mp-link'">
                            <view v-bind:class="temp.data.position === 'top' ? `mp-link-top` : ``"
                                  v-bind:style="[{'top': hiddenHeight(temp.data.position)}]">
                                <official-account
                                    v-on:load="mpLink(temp.data.position)"
                                    v-on:error="mpLinkError"
                                ></official-account>
                            </view>
                        </template>
                        <!-- #endif -->
                        <!-- #ifdef H5 -->
                        <template v-if="temp.id === 'mp-link' && isWechat">
                            <view class="bd-attention">
                                <view class="bd-content">
                                    <view class="dir-left-nowrap main-between cross-center">
                                        <view class="dir-left-nowrap cross-center">
                                            <image class="bd-logo" :src="userInfo && userInfo.wechat_logo"></image>
                                            <view class="bd-name">{{userInfo && userInfo.wechat_name}}</view>
                                        </view>
                                        <view class="bd-btn" @click="openAttention">去关注</view>
                                    </view>
                                </view>
                            </view>
                        </template>
                        <!-- #endif -->
                        <!-- #ifndef MP-TOUTIAO -->
                        <template v-else-if="temp.id === 'map'">
                            <app-map
                                v-bind:background-pic-url="temp.data.backgroundPicUrl"
                                v-bind:height="temp.data.height"
                                v-bind:latitude="temp.data.latitude"
                                v-bind:longitude="temp.data.longitude"
                                v-bind:margin-top="temp.data.marginTop"
                                v-bind:margin-top-color="temp.data.marginTopColor"
                                v-bind:padding-x="temp.data.paddingX"
                                v-bind:padding-y="temp.data.paddingY"
                            ></app-map>
                        </template>
                        <!-- #endif -->

                        <template v-else-if="temp.id === 'check-in'">
                            <app-check-in
                                v-bind:background-pic-url="temp.data.backgroundPicUrl"
                                v-bind:hotspot="temp.data.hotspot"
                                v-bind:show-text="temp.data.showText"
                                v-bind:text-color="temp.data.textColor"
                                v-bind:text-position="temp.data.textPosition"
                            ></app-check-in>
                        </template>

                        <template v-else-if="temp.id === 'image-text'">
                            <view style="padding: 0 24rpx;">
                                <app-rich v-bind:content='temp.data.content'></app-rich>
                            </view>
                        </template>

                        <template v-else-if="temp.id === 'form'">
                            <app-diy-form
                                v-bind:title="temp.name"
                                v-bind:list="temp.data.formDialog"
                                v-bind:item-padding-x="temp.data.inputPadding"
                                v-bind:item-margin-y="temp.data.marginBottom"
                                v-bind:item-height="temp.data.height"
                                v-bind:show-item-border="false"
                                v-bind:label-position="transLabelPosition(temp.data.style)"
                                v-bind:label-color="temp.data.inputLabel"
                                label-text-align="left"
                                v-bind:show-input-border="true"
                                v-bind:input-background="temp.data.inputBackground"
                                v-bind:input-border-color="temp.data.inputBorder"
                                v-bind:input-text-color="temp.data.inputText"
                                v-bind:input-placeholder-color="temp.data.inputTip"
                                v-bind:input-radius="temp.data.radius"
                                v-bind:show-submit="true"
                                v-bind:submit-url="diyFormSubmitUrl"
                                v-bind:submit-btn-text="temp.data.borderContent"
                                v-bind:submit-btn-height="temp.data.buttonHeight"
                                v-bind:submit-btn-padding="temp.data.buttonPadding"
                                v-bind:submit-btn-margin="temp.data.buttonMargin"
                                v-bind:submit-btn-radius="temp.data.buttonRadius"
                                v-bind:submit-btn-background="temp.data.borderBackground"
                                v-bind:submit-btn-border-color="temp.data.borderBorder"
                                v-bind:submit-btn-text-color="temp.data.borderText"
                                v-bind:background-color="temp.data.backgroundColor"
                                v-bind:background-image="temp.data.backgroundPicUrl"
                                v-bind:background-width="temp.data.backgroundWidth"
                                v-bind:background-height="temp.data.backgroundHeight"
                                v-bind:background-position="transLabelBackgroundPosition(temp.data.position)"
                                v-bind:background-repeat="transLabelBackgroundRepeat(temp.data.mode)"
                                v-bind:margin-top="temp.data.marginTop"
                                v-bind:margin-color="temp.data.marginColor"
                                v-bind:padding-top="temp.data.padding"
                                v-bind:padding-bottom="temp.data.padding"
                                v-bind:select-box-color="temp.data.selectBoxColor"
                            ></app-diy-form>
                        </template>

                        <!--超级会员卡组件-->
                        <template v-else-if="temp.id === 'vip-card'">
                            <view class="vip-card" 
                                :style="[
                            {'background-color':`${temp.data.background}`}]">
                            <app-vip-card
                                v-bind:value="temp.data" top="0"
                                v-bind:background="temp.data.background"
                            ></app-vip-card>
                            </view>
                        </template>

                        <!--直播组件-->
                        <!--  #ifdef MP-WEIXIN -->
                        <template v-else-if="temp.id === 'live'">
                            <app-live v-bind:value="temp.data"></app-live>
                        </template>
                        <!-- #endif -->

                        <template v-else-if="temp.id === 'module' && is_module">
                            <app-module
                                v-bind:tab-type="temp.data.tabType"
                                v-bind:tab-color="temp.data.tabColor"
                                v-bind:text-color="temp.data.textColor"
                                v-bind:tab-background="temp.data.tabBackground"
                                v-bind:list="temp.data.list"
                                v-bind:d-index="[index, temp_index]"
                                v-bind:theme="theme"
                                v-bind:page-hide="pageHide"
                                v-bind:home-pages="homePages"
                                v-bind:is_storage="is_storage"
                                v-bind:page_id="page_id"
                                v-bind:is_required="is_required"
                                v-bind:coupon_req="coupon_req"
                                @buyProduct="buyProduct"
                            ></app-module>
                        </template>
                        <template v-else-if="temp.id === 'access_limit'">
                            <view style="background:#FFFFFF;width: 100vw;padding-top: 26%"
                                  :style="{height: 'calc(100vh - ' + hiddenHeight('top') + ' - ' + bottomHeight + ')'}"
                                  class="dir-top-nowrap cross-center">
                                <image :src="diyImg.access_limit" style="height: 240rpx;width:240rpx;display: block"/>
                                <view style="color:#999999;font-size: 26rpx;margin-top: 20rpx">该页面暂无权限访问</view>
                            </view>
                        </template>
                    </block>
                </template>
            </block>
        </view>
    </view>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import appSearchFor from '../../page-component/app-search-for/app-search-for.vue';
    import appSwiper from '../../page-component/app-swiper/app-swiper.vue';
    import uSwiper from '../../page-component/app-swiper/swiper.vue';
    import uAnnouncement from '../../page-component/u-announcement/u-announcement.vue';
    import appNavigationIcon from '../../page-component/app-navigation-icon/app-navigation-icon.vue';
    import appNavigationTwoIcon from '../../page-component/app-navigation-icon/app-navigation-two-icon.vue';
    import appVideo from '../../page-component/app-video/app-video.vue';
    import appAssociatedLink from '../../page-component/app-associated-link/app-associated-link.vue';
    import appSpecialTopic from '../../page-component/app-special-topic/app-special-topic-normal.vue';
    import appSpecialTopicList from '../../page-component/app-special-topic/app-special-topic-list.vue';
    import appImageAd from '../../page-component/app-image-ad/app-image-ad.vue';
    import appHotspot from '../../basic-component/app-hotspot/app-hotspot.vue';
    import appShop from '../../page-component/app-shop/app-shop.vue';
    import appCopyright from '../../page-component/app-copyright/app-copyright.vue';
    import appUserCenter from '../../page-component/app-user-center-top/app-user-center-top.vue';
    import appMyOrder from '../../page-component/app-my-order/app-my-order.vue';
    import appRecommendedProductList from '../../page-component/app-recommended-product/app-recommended-product-list.vue';
    import appExclusiveCoupon from '../../page-component/app-exclusive-coupon/app-exclusive-coupon.vue';
    import appExclusiveCouponTwo from '../../page-component/app-exclusive-coupon/app-exclusive-coupon-two.vue';
    import appDiyTimer from '../../page-component/app-diy-timer/app-diy-timer.vue';
    import appGoodsShop from '../../page-component/app-good-shop-recommendation/app-good-shop-recommendation.vue';
    import appEmpty from '../../basic-component/app-empty/app-empty.vue';
    import appPopupAd from '../../page-component/app-popup-ad/app-popup-ad.vue';
    import appQuickNavigation from '../../page-component/app-quick-navigation/app-quick-navigation.vue';
    import appCheckIn from '../../page-component/app-check-in/app-check-in.vue';
    import appRich from '../../basic-component/app-rich/parse.vue';
    import appReservation from "../../page-component/app-reservation/app-reservation.vue";
    import appDiyGoodsList from "../../page-component/app-diy-goods-list/app-diy-goods-list.vue";
    import appDiyForm from "../../page-component/app-diy-form/app-diy-form.vue";
    import appVipCard from "../../page-component/app-vip-card/app-vip-card.vue";
    import appAd from "../../page-component/app-ad/app-ad.vue";
    import appModule from "../../page-component/index/app-module.vue";
    import uOrdinaryList from '../u-goods-list/u-ordinary-list.vue';
    import appDiyMGoodsList from '../../page-component/app-diy-goods-list/app-diy-m-goods-list.vue';
    // #ifdef MP-WEIXIN
    import appLive from "../../page-component/app-live/app-live.vue";
    // #endif
    // #ifndef MP-TOUTIAO
    import appMap from "../../page-component/app-map/app-map.vue";
    // #endif

    export default {
        name: "app-diy-page",
        components: {
            'app-search-for': appSearchFor,
            'app-swiper': appSwiper,
            uAnnouncement,
            'app-navigation-icon': appNavigationIcon,
            'app-navigation-two-icon': appNavigationTwoIcon,
            'app-video': appVideo,
            'app-associated-link': appAssociatedLink,
            'app-special-topic': appSpecialTopic,
            'app-special-topic-list': appSpecialTopicList,
            'app-image-ad': appImageAd,
            'app-hotspot': appHotspot,
            'app-shop': appShop,
            'app-copyright': appCopyright,
            'app-user-center': appUserCenter,
            'app-my-order': appMyOrder,
            'app-recommended-product-list': appRecommendedProductList,
            'app-exclusive-coupon': appExclusiveCoupon,
            appExclusiveCouponTwo,
            'app-diy-timer': appDiyTimer,
            'app-goods-shop': appGoodsShop,
            'app-empty': appEmpty,
            'app-popup-ad': appPopupAd,
            'app-quick-navigation': appQuickNavigation,
            'app-check-in': appCheckIn,
            'app-rich': appRich,
            'app-reservation': appReservation,
            'app-diy-goods-list': appDiyGoodsList,
            'app-diy-form': appDiyForm,
            'app-vip-card': appVipCard,
            appDiyMGoodsList,
            // 普通商品列表
            uOrdinaryList,
            // #ifndef MP-TOUTIAO
            appMap,
            // #endif
            appAd,
            appModule,
            // #ifdef MP-WEIXIN
            appLive,
            // #endif
            uSwiper
        },
        props: {
            dIndex: {
                type: Array,
                default() {
                    return [0, 0];
                }
            },
            dType: String, //module 模块
            homePages: {
                type: Object,
                default() {
                    return {
                        navs: []
                    };
                }
            },
            scrollTop: {
                type: Number,
                default() {
                    return 0;
                }
            },
            is_storage: Boolean,
            pageHide: Boolean,
            theme: Object,
            coupon_req: Boolean,
            is_required: Boolean,
            page_id: Number,
            is_module: {
                type: Boolean,
                default() {
                    return true;
                }
            }
        },
        computed: {
            hiddenHeight() {
                return (type) => {
                    // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO
                    if(type === 'top'){
                        let barHeight = this.systemInfo.statusBarHeight + this.mBarHeight;
                        return barHeight + 'px';
                    }
                    // #endif
                    return 0 + 'px';
                }
            },
            newData() {
                if (this.homePages) {
                    if (this.homePages.title) {
                        uni.setNavigationBarTitle({
                            title: this.homePages.title,
                        });
                    }
                    return this.homePages;
                } else {
                    return {
                        navs: [],
                    }
                }
            },
            ...mapState({
                tabBarNavs: state => state.mallConfig.navbar.navs,
                systemInfo: state => state.gConfig.systemInfo,
                userCenter: state => state.mallConfig.user_center,
                mBarHeight: state => state.gConfig.mBarHeight,
                diyImg: state => state.mallConfig.__wxapp_img.diy,
            }),
            ...mapGetters({
                userInfo: 'user/info',
            }),
            ...mapGetters('iPhoneX', {
                BotHeight: 'getBotHeight',
                getEmpty: 'getEmpty',
            }),
            bottomHeight() {
                let s = this.tabBarNavs.find(item => {
                    return item.url.indexOf('/pages/index/index') !== -1 && item.url.indexOf(`page_id=${this.page_id}`) !== -1
                })
                if (s) {
                    return uni.upx2px(this.BotHeight) + 'px';
                } else {
                    return 0 + 'px';
                }
            },

            diyFormSubmitUrl() {
                return this.$api.diy.page_store;
            },
            // #ifdef H5
            isWechat: function() {
                return this.$jwx.isWechat();
            },
            // #endif
        },
        data() {
            return {
                nav_active: 0,
                mp_link_top: false,
                coupon_url: this.$api.diy.receive,
                coupon_params: {}
            };
        },

        filters: {
            getObje(data) {
                if (!data) return;
                return {
                    template_id: data.template_id
                }
            }
        },
        methods: {
            changeNav(index) {
                this.nav_active = index;
                this.mp_link_top = false;
            },
            rubikHotspot(hotspot) {
                if (hotspot && hotspot.link) {
                    hotspot.link.url = hotspot.link.value;
                    hotspot.link.openType = hotspot.link.open_type;
                }
                return hotspot;
            },
            mpLink(position) {
                if (position === 'top') {
                    this.mp_link_top = true;
                }
            },
            transLabelPosition(val) {
                val = Number(val);
                switch (val) {
                    case 3:
                        return 'top';
                    case 2:
                        return 'inset';
                    default:
                        return 'left';
                }
            },
            transLabelBackgroundPosition(val) {
                val = Number(val);
                switch (val) {
                    case 1:
                        return 'left top';
                    case 2:
                        return 'center top';
                    case 3:
                        return 'right top';
                    case 4:
                        return 'left center';
                    case 5:
                        return 'center center';
                    case 6:
                        return 'right center';
                    case 7:
                        return 'left bottom';
                    case 8:
                        return 'center bottom';
                    case 9:
                        return 'right bottom';
                    default:
                        return 'center';
                }
            },
            transLabelBackgroundRepeat(val) {
                val = Number(val);
                switch (val) {
                    case 1:
                        return 'no-repeat';
                    case 2:
                        return 'repeat-x';
                    case 3:
                        return 'repeat-y';
                    case 4:
                        return 'repeat';
                    default:
                        return 'no-repeat';
                }
            },
            mpLinkError() {
                this.mp_link_top = false;
            },

            buyProduct(data) {
                this.$emit('buyProduct', data);
            },
            // #ifdef H5
            openAttention() {
                this.$store.dispatch('user/showAttention', true);
                this.$store.dispatch('user/showAttentionTwo', true);
            },
            // #endif
        }
    }
</script>

<style scoped lang="scss">
    .app-diy-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    .vip-card {
        padding: 0 #{24rpx};
    }

    //#ifdef MP-ALIPAY
    .app-diy-page /deep/ .app-diy-page {
        position: static !important;
        z-index: auto !important;
    }
    //#endif

    .app-diy-page {
        width: 100%;
        height: 100%;

        .nav-bar {
            position: fixed;
            left: 0;
            top: 0;
            z-index: 1500;
            background-color: #ffffff;
            width: 100%;
            height: #{44px};
            padding: 0 #{30rpx};
            overflow-x: auto;
            border-bottom: #{1rpx} solid #e2e2e2;

            .nav-bar-one {
                width: auto;
                margin-right: #{30rpx};
                padding: 0 #{15rpx};

                &.active {
                    border-bottom: #{4rpx} solid;
                }
            }

            &.mp_link_top {
                top: #{84px};
            }

            &.mp_link_top ~ .diy-template {
                margin-top: #{44px + 84px};
            }

            & ~ .diy-template {
                margin-top: #{44px};
            }
        }

        .mp-link-top {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1500;
            width: 100%;
        }

        &.mp_link_top {
            margin-top: #{168rpx};
        }
    }
    /* #ifdef H5 */
    .bd-attention {
        width: 100%;
        background-color: #ffffff;
        padding: 5upx 10upx 24upx 10upx;
        .bd-content {
            padding: 0 10upx 0 6upx;
            margin-top: 15upx;
        }
        .bd-logo {
            width:70upx;
            height: 70upx;
            margin-right: 15upx;
        }
        .bd-name {
            font-size: 28upx;
            color: #353535;
        }
        .bd-btn {
            width:110upx;
            height: 50upx;
            line-height: 50upx;
            font-size: 22upx;
            border: 1upx solid #009400;
            color: #009400;
            border-radius: 5upx;
            text-align: center;
            transform: rotateZ(360deg);
        }
    }
    /* #endif */
</style>
