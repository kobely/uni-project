<template>
	<view class="app-recommended-product">
		<view class="app-display-classification" v-if="showCat">
			<scroll-view class="app-scroll-view dir-left-nowrap" scroll-x scroll-with-animation>
				<text class="app-nav-item" @click="change(index)"
				      :class="{'app-active-current': catStyle === 1 && activeCurrent === index,
				      'app-active-current-round': catStyle === 2 && activeCurrent === index,
				      'app-current-round': catStyle === 2
				      }"
				      :key="index"
				      v-for="(item, index) in catList"
				>{{item.menuName}}</text>
			</scroll-view>
		</view>
		<view class="app-content" v-if="!showCat">
			<!-- 列表模式 -->
			<view class="app-list-mode" v-if="listStyle === -1">
				<view :class="{'app-border': goodsStyle === 2}" :key="index" v-for="(item, index) in list">
					<app-form-id @click="jump(item)">
						<view class="app-item dir-left-nowrap">
						<image class="app-icon" :src="goodsTagPicUrl" v-if="showGoodsTag"></image>
						<image class="app-image" :mode="fill === 1 ? 'scaleToFill' : fill === 2 ? 'aspectFit': ''" :src="item.cover_pic"></image>
						<view class="app-item-content dir-top-nowrap" :class="{'main-right': showGoodsName === false}">
							<text class="app-name" v-if="showGoodsName">{{item.name}}</text>
							<view class="app-price-button dir-left-nowrap" :class="{'main-between': showGoodsPrice, 'main-right': !showGoodsPrice}">
								<text v-if="showGoodsPrice" class="app-text">{{item.price_content}}</text>
									<template v-if="showBuyBtn">
										<button v-if="buyBtn === 'text'"
										        @click.stop="buyProduct(item)"
										        :class="{
											'app-button-filling': buyBtnStyle === 1,
											'app-button-line' : buyBtnStyle === 2 ,
											'app-button-fillet' : buyBtnStyle === 3,
											'app-button-rounded-lines': buyBtnStyle === 4,
										}"
										>{{buyBtnText}}</button>
										<icon class="app-icon-button app-shopping-cart"
										      @click.stop="buyProduct(item)"
										      v-else-if="buyBtn === 'cart'"
										 type></icon>
										<icon class="app-icon-button app-add-to"
										      @click.stop="buyProduct(item)"
										      v-else-if="buyBtn === 'add'"
										 type></icon>
									</template>
							</view>
						</view>
						</view>
					</app-form-id>
				</view>
			</view>
			<!--  左右滑动 -->
			<view class="app-swipe-left-right" v-if="listStyle === 0">
				<scroll-view class="scroll-view" scroll-with-animation scroll-x>
					<view class="app-item" :class="{'app-border': goodsStyle === 2 || goodsStyle === 4}" v-for="(item, index) in list" :key="index">
						<app-form-id @click="jump(item)">
							<image class="app-icon" :src="goodsTagPicUrl" v-if="showGoodsTag"></image>
							<image class="app-image" :mode="fill === 1 ? 'scaleToFill' : fill === 2 ? 'aspectFit': ''" :src="item.cover_pic"></image>
							<view class="app-price-button-name dir-top-nowrap">
								<text v-if="showGoodsName" class="app-name" :class="{'app-name-goods-style': goodsStyle === 3 || goodsStyle === 4}">{{item.name}}</text>
								<view class="app-price-button dir-left-nowrap cross-bottom"
								      :class="{
										'app-price-goods-style': goodsStyle === 3 || goodsStyle === 4,
										'main-right': showGoodsPrice === false
										}">
									<text v-if="showGoodsPrice" class="app-price" :class="{'app-price-goods-style': goodsStyle === 3 || goodsStyle === 4}">{{item.price_content}}</text>
									<template v-if="goodsStyle !== 3 && goodsStyle !== 4">
										<icon class="app-icon-button app-shopping-cart"
										      @click.stop="buyProduct(item)"
										      v-if="buyBtn === 'cart'"
										 type></icon>
										<icon class="app-icon-button app-add-to"
										      @click.stop="buyProduct(item)"
										      v-else-if="buyBtn === 'add'"
										 type></icon>
									</template>
								</view>
							</view>
						</app-form-id>
					</view>
				</scroll-view>
			</view>
			<!-- 一行一个 -->
			<view class="app-one-per-line" v-if="listStyle === 1">
				<view class="app-item" :class="{'app-border': goodsStyle === 2 || goodsStyle === 4, 'app-square': goodsCoverProportion === '1-1',
					'app-rectangle': goodsCoverProportion === '3-2'
				}" v-for="(item, index) in list" :key="index">
					<app-form-id @click="jump(item)">
						<image class="app-icon" :src="goodsTagPicUrl" v-if="showGoodsTag"></image>
						<image class="app-image"
						       :mode="fill === 1 && goodsCoverProportion === '3-2'? 'center' :goodsCoverProportion === '3-2' && fill === 2 ? 'aspectFit': fill === 1 && goodsCoverProportion === '1-1' ? 'scaleToFill' : goodsCoverProportion === '1-1' && fill === 2 ? 'scaleToFill' : ''"
						       :class="{
						            'app-square-image': goodsCoverProportion === '1-1',
									'app-rectangle-image': goodsCoverProportion === '3-2',
									}"
						       :src="item.cover_pic"
						></image>
						<text class="app-text" :style="{textAlign: goodsStyle === 3 ? 'center' : ''}" v-if="showGoodsName">{{item.name}}</text>
						<view v-if="showBuyBtn && showGoodsPrice"
						      class="app-button-price dir-left-nowrap  cross-center"
						      :class="{'main-between': goodsStyle !== 3 || goodsStyle !== 4, 'main-center' : goodsStyle === 3 || goodsStyle === 4}"
						      :style="{position: showGoodsPrice === false ? 'relative' : ''}">
							<text v-if="showGoodsPrice" class="app-price">{{item.price_content}}</text>
							<view v-if="showBuyBtn" :class="{'app-button-no-price' : showGoodsPrice === false}">
									<button v-if="buyBtn === 'text' && goodsStyle !== 3 && goodsStyle !== 4"
									        @click.stop="buyProduct(item)"
									        :class="{
											'app-button-filling': buyBtnStyle === 1,
											'app-button-line' : buyBtnStyle === 2 ,
											'app-button-fillet' : buyBtnStyle === 3,
											'app-button-rounded-lines': buyBtnStyle === 4,
										}"
									>{{buyBtnText}}</button>
									<icon class="app-icon-button app-shopping-cart"
									      @click.stop="buyProduct(item)"
									      v-else-if="buyBtn === 'cart' && goodsStyle !== 3 && goodsStyle !== 4" type></icon>
									<icon class="app-icon-button app-add-to"
									      @click.stop="buyProduct(item)"
									      v-else-if="buyBtn === 'add' && goodsStyle !== 3 && goodsStyle !== 4" type></icon>
							</view>
						</view>
					</app-form-id>
				</view>
			</view>
			<!-- 一行两个 -->
			<view class="app-one-line-two dir-left-wrap" v-if="listStyle === 2">
				<view class="app-item"
				      :class="{'app-border': goodsStyle === 2 || goodsStyle === 4}"
				      v-for="(item, index) in list"
				      :key="index"
				>
					<app-form-id @click="jump(item)">
						<image
								class="app-icon"
								:src="goodsTagPicUrl"
								v-if="showGoodsTag"
						></image>
						<image class="app-image"
						       :mode="fill === 1 ? 'scaleToFill' : fill === 2 ? 'aspectFit': ''"
						       :src="item.cover_pic"
						></image>
						<text v-if="showGoodsName"
						      class="app-name"
						      :class="{'app-name-goods-style': goodsStyle === 3 || goodsStyle === 4}"
						>{{item.name}}</text>
						<view
								class="app-price-buttons dir-left-nowrap cross-center"
								:class="{'main-between': showGoodsPrice, 'main-right': !showGoodsPrice, 'main-center': goodsStyle === 3 || goodsStyle === 4}"
						>
							<text v-if="showGoodsPrice"
							      class="app-price"
							>{{item.price_content}}</text>
							<template v-if="showBuyBtn">
								<button
									v-if="buyBtn === 'text' && goodsStyle !== 3 && goodsStyle !== 4"
									@click.stop="buyProduct(item)"
									:class="{
										'app-button-filling': buyBtnStyle === 1,
										'app-button-line' : buyBtnStyle === 2 ,
										'app-button-fillet' : buyBtnStyle === 3,
										'app-button-rounded-lines': buyBtnStyle === 4,
									}"
								>{{buyBtnText}}</button>
								<icon class="app-icon-button app-shopping-cart"
								      @click.stop="buyProduct(item)"
								      v-else-if="buyBtn === 'cart' && goodsStyle !== 3 && goodsStyle !== 4"
								 type></icon>
								<icon class="app-icon-button app-add-to"
								      @click.stop="buyProduct(item)"
								      v-else-if="buyBtn === 'add' && goodsStyle !== 3 && goodsStyle !== 4"
								 type></icon>
							</template>
						</view>
					</app-form-id>
				</view>
			</view>
			<!-- 一行三个 -->
			<view class="app-one-line-three dir-left-wrap" v-if="listStyle === 3">
				<view class="app-item"
				      v-for="(item, index) in list"
				      :key="index"
				      :class="{'app-border': goodsStyle === 2 || goodsStyle === 4}"
				>
					<app-form-id @click="jump(item)">
						<image
								class="app-icon"
								:src="goodsTagPicUrl"
								v-if="showGoodsTag"
						></image>
						<image class="app-image"
						       :mode="fill === 1 ? 'scaleToFill' : fill === 2 ? 'aspectFit': ''"
						       :src="item.cover_pic"
						></image>
						<text class="app-name"
						      :class="{'app-name-goods-style': goodsStyle === 3 || goodsStyle === 4}"
						      v-if="showGoodsName">{{item.name}}</text>
						<view class="app-price-buttons dir-left-nowrap  cross-center"
							:class="{'main-between': goodsStyle !== 3 && goodsStyle !== 4, 'main-center': goodsStyle === 3 || goodsStyle === 4}"
						>
							<text class="app-price"
								v-if="showGoodsPrice"
							>{{item.price_content}}</text>
							<icon class="app-icon-button app-shopping-cart"
							      @click.stop="buyProduct(item)"
							      v-if="buyBtn === 'cart' && goodsStyle !== 3 && goodsStyle !== 4"
							 type></icon>
							<icon class="app-icon-button app-add-to"
							      @click.stop="buyProduct(item)"
							      v-else-if="buyBtn === 'add' && goodsStyle !== 3 && goodsStyle !== 4"
							 type></icon>
						</view>
					</app-form-id>
				</view>
			</view>
		</view>
		<view class="app-content" v-if="showCat">
			<!-- 列表模式 -->
			<view class="app-list-mode" v-if="listStyle === -1">
				<view class="app-page" v-for="(page, number) in catList" :key="number" v-if="activeCurrent === number">
					<view :class="{'app-border': goodsStyle === 2}" :key="index" v-for="(item, index) in page.goodsList">
						<app-form-id @click="jump(item)">
							<view class="app-item dir-left-nowrap">
								<image class="app-icon" :src="goodsTagPicUrl" v-if="showGoodsTag"></image>
								<image class="app-image" :mode="fill === 1 ? 'scaleToFill' : fill === 2 ? 'aspectFit': ''" :src="item.cover_pic"></image>
								<view class="app-item-content dir-top-nowrap" :class="{'main-right': showGoodsName === false}">
									<text class="app-name" v-if="showGoodsName">{{item.name}}</text>
									<view class="app-price-button dir-left-nowrap" :class="{'main-between': showGoodsPrice, 'main-right': !showGoodsPrice}">
										<text v-if="showGoodsPrice" class="app-text">{{item.price_content}}</text>
										<template v-if="showBuyBtn">
											<button v-if="buyBtn === 'text'"
											        @click.stop="buyProduct(item)"
											        :class="{
											'app-button-filling': buyBtnStyle === 1,
											'app-button-line' : buyBtnStyle === 2 ,
											'app-button-fillet' : buyBtnStyle === 3,
											'app-button-rounded-lines': buyBtnStyle === 4,
										}"
											>{{buyBtnText}}</button>
											<icon class="app-icon-button app-shopping-cart"
											      @click.stop="buyProduct(item)"
											      v-else-if="buyBtn === 'cart'" type></icon>
											<icon class="app-icon-button app-add-to"
											      @click.stop="buyProduct(item)"
											      v-else-if="buyBtn === 'add'" type></icon>
										</template>
									</view>
								</view>
							</view>
						</app-form-id>
					</view>
				</view>
			</view>
			<!--  左右滑动 -->
			<view class="app-swipe-left-right" v-if="listStyle === 0">
				<view class="app-page" v-for="(page, number) in catList" :key="number" v-if="activeCurrent === number">
					<scroll-view class="scroll-view" scroll-with-animation scroll-x>
						<view class="app-item" :class="{'app-border': goodsStyle === 2 || goodsStyle === 4}" v-for="(item, index) in page.goodsList" :key="index">
							<app-form-id @click="jump(item)">
								<image class="app-icon" :src="goodsTagPicUrl" v-if="showGoodsTag"></image>
								<image class="app-image" :mode="fill === 1 ? 'scaleToFill' : fill === 2 ? 'aspectFit': ''" :src="item.cover_pic"></image>
								<view class="app-price-button-name dir-top-nowrap">
									<text v-if="showGoodsName" class="app-name" :class="{'app-name-goods-style': goodsStyle === 3 || goodsStyle === 4}">{{item.name}}</text>
									<view class="app-price-button dir-left-nowrap cross-bottom"
									      :class="{
										'app-price-goods-style': goodsStyle === 3 || goodsStyle === 4,
										'main-right': showGoodsPrice === false
										}">
										<text v-if="showGoodsPrice" class="app-price" :class="{'app-price-goods-style': goodsStyle === 3 || goodsStyle === 4}">{{item.price_content}}</text>
										<template v-if="goodsStyle !== 3 && goodsStyle !== 4">
											<icon class="app-icon-button app-shopping-cart"
											      @click.stop="buyProduct(item)"
											      v-if="buyBtn === 'cart'" type></icon>
											<icon class="app-icon-button app-add-to"
											      @click.stop="buyProduct(item)"
											      v-else-if="buyBtn === 'add'" type></icon>
										</template>
									</view>
								</view>
							</app-form-id>
						</view>
					</scroll-view>
				</view>
			</view>
			<!-- 一行一个 -->
			<view class="app-one-per-line" v-if="listStyle === 1">
				<view class="app-page" v-for="(page, number) in catList" :key="number" v-if="activeCurrent === number">
					<view class="app-item" :class="{'app-border': goodsStyle === 2 || goodsStyle === 4, 'app-square': goodsCoverProportion === '1-1',
					'app-rectangle': goodsCoverProportion === '3-2'
				}" v-for="(item, index) in page.goodsList" :key="index">
						<app-form-id @click="jump(item)">
							<image class="app-icon" :src="goodsTagPicUrl" v-if="showGoodsTag"></image>
							<image class="app-image"
							       :mode="fill === 1 && goodsCoverProportion === '3-2'? 'center' :goodsCoverProportion === '3-2' && fill === 2 ? 'aspectFit': fill === 1 && goodsCoverProportion === '1-1' ? 'scaleToFill' : goodsCoverProportion === '1-1' && fill === 2 ? 'scaleToFill' : ''"
							       :class="{
						            'app-square-image': goodsCoverProportion === '1-1',
									'app-rectangle-image': goodsCoverProportion === '3-2',
									}"
							       :src="item.cover_pic"
							></image>
							<text class="app-text" :style="{textAlign: goodsStyle === 3 ? 'center' : ''}" v-if="showGoodsName">{{item.name}}</text>
							<view v-if="showBuyBtn && showGoodsPrice"
							      class="app-button-price dir-left-nowrap  cross-center"
							      :class="{'main-between': goodsStyle !== 3 || goodsStyle !== 4, 'main-center' : goodsStyle === 3 || goodsStyle === 4}"
							      :style="{position: showGoodsPrice === false ? 'relative' : ''}">
								<text v-if="showGoodsPrice" class="app-price">{{item.price_content}}</text>
								<view v-if="showBuyBtn" :class="{'app-button-no-price' : showGoodsPrice === false}">
									<button v-if="buyBtn === 'text' && goodsStyle !== 3 && goodsStyle !== 4"
									        @click.stop="buyProduct(item)"
									        :class="{
											'app-button-filling': buyBtnStyle === 1,
											'app-button-line' : buyBtnStyle === 2 ,
											'app-button-fillet' : buyBtnStyle === 3,
											'app-button-rounded-lines': buyBtnStyle === 4,
										}"
									>{{buyBtnText}}</button>
									<icon class="app-icon-button app-shopping-cart"
									      @click.stop="buyProduct(item)"
									      v-else-if="buyBtn === 'cart' && goodsStyle !== 3 && goodsStyle !== 4" type></icon>
									<icon class="app-icon-button app-add-to"
									      @click.stop="buyProduct(item)"
									      v-else-if="buyBtn === 'add' && goodsStyle !== 3 && goodsStyle !== 4" type></icon>
								</view>
							</view>
						</app-form-id>
					</view>
				</view>
			</view>
			<!-- 一行两个 -->
			<template v-if="listStyle === 2">
				<view class="app-page app-one-line-two dir-left-wrap" v-for="(page, number) in catList" :key="number" v-if="activeCurrent === number">
					<view class="app-item"
					      :class="{'app-border': goodsStyle === 2 || goodsStyle === 4}"
					      v-for="(item, index) in page.goodsList"
					      :key="index"
					>
						<app-form-id @click="jump(item)">
							<image
									class="app-icon"
									:src="goodsTagPicUrl"
									v-if="showGoodsTag"
							></image>
							<image class="app-image"
							       :mode="fill === 1 ? 'scaleToFill' : fill === 2 ? 'aspectFit': ''"
							       :src="item.cover_pic"
							></image>
							<text v-if="showGoodsName"
							      class="app-name"
							      :class="{'app-name-goods-style': goodsStyle === 3 || goodsStyle === 4}"
							>{{item.name}}</text>
							<view
									class="app-price-buttons dir-left-nowrap cross-center"
									:class="{'main-between': showGoodsPrice, 'main-right': !showGoodsPrice, 'main-center': goodsStyle === 3 || goodsStyle === 4}"
							>
								<text v-if="showGoodsPrice"
								      class="app-price"
								>{{item.price_content}}</text>
								<template v-if="showBuyBtn">
									<button
											v-if="buyBtn === 'text' && goodsStyle !== 3 && goodsStyle !== 4"
											@click.stop="buyProduct(item)"
											:class="{
										'app-button-filling': buyBtnStyle === 1,
										'app-button-line' : buyBtnStyle === 2 ,
										'app-button-fillet' : buyBtnStyle === 3,
										'app-button-rounded-lines': buyBtnStyle === 4,
									}"
									>{{buyBtnText}}</button>
									<icon class="app-icon-button app-shopping-cart"
									      @click.stop="buyProduct(item)"
									      v-else-if="buyBtn === 'cart' && goodsStyle !== 3 && goodsStyle !== 4"
									 type></icon>
									<icon class="app-icon-button app-add-to"
									      @click.stop="buyProduct(item)"
									      v-else-if="buyBtn === 'add' && goodsStyle !== 3 && goodsStyle !== 4"
									 type></icon>
								</template>
							</view>
						</app-form-id>
					</view>
				</view>
			</template>
			<!-- 一行三个 -->
			<template v-if="listStyle === 3">
				<view class="app-page app-one-line-three dir-left-wrap" v-for="(page, number) in catList" :key="number" v-if="activeCurrent === number">
					<view class="app-item"
					      :class="{'app-border': goodsStyle === 2 || goodsStyle === 4}"
					      v-for="(item, index) in page.goodsList"
					      :key="index"
					>
						<app-form-id @click="jump(item)">
							<image
									class="app-icon"
									:src="goodsTagPicUrl"
									v-if="showGoodsTag"
							></image>
							<image class="app-image"
							       :mode="fill === 1 ? 'scaleToFill' : fill === 2 ? 'aspectFit': ''"
							       :src="item.cover_pic"
							></image>
							<text v-if="showGoodsName"
							      class="app-name"
							      :class="{'app-name-goods-style': goodsStyle === 3 || goodsStyle === 4}"
							>{{item.name}}</text>
							<view
									class="app-price-buttons dir-left-nowrap cross-center"
									:class="{'main-between': showGoodsPrice, 'main-right': !showGoodsPrice, 'main-center': goodsStyle === 3 || goodsStyle === 4}"
							>
								<text v-if="showGoodsPrice"
								      class="app-price"
								>{{item.price_content}}</text>
								<template v-if="showBuyBtn">
									<button
											@click.stop="buyProduct(item)"
											v-if="buyBtn === 'text' && goodsStyle !== 3 && goodsStyle !== 4"
											:class="{
										'app-button-filling': buyBtnStyle === 1,
										'app-button-line' : buyBtnStyle === 2 ,
										'app-button-fillet' : buyBtnStyle === 3,
										'app-button-rounded-lines': buyBtnStyle === 4,
									}"
									>{{buyBtnText}}</button>
									<icon class="app-icon-button app-shopping-cart"
									      @click.stop=""
									      v-else-if="buyBtn === 'cart' && goodsStyle !== 3 && goodsStyle !== 4"
									 type></icon>
									<icon class="app-icon-button app-add-to"
									      @click.stop="buyProduct(item)"
									      v-else-if="buyBtn === 'add' && goodsStyle !== 3 && goodsStyle !== 4"
									 type></icon>
								</template>
							</view>
						</app-form-id>
					</view>
				</view>
			</template>
		</view><view>
		<app-attr
				:goods="goods"
				:attrGroupList="goods.attr_groups"
				:show="show"
				:selectAttr="selectAttr"
				@attr="attr"
		></app-attr>
	</view>
	</view>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
    import appAttr from '../../../components/page-component/app-attr/app-attr.vue';

    export default {
        name: 'app-recommended-product',
	    props: {
		    showCat: {
                type: Boolean,
			    default: function() {
			        return true;
			    }
		    },
            showBuyBtn: {
                type: Boolean,
	            default: function() {
	                return true;
	            }
            },
            showGoodsName: {
                type: Boolean,
	            default: function() {
	                return true;
	            }
            },
            showGoodsPrice: {
                type: Boolean,
                default: function() {
                    return true;
                }
            },
            showGoodsTag: {
                type: Boolean,
                default: function() {
                    return true;
                }
            },
            goodsTagPicUrl: {
                type: String,
	            default: function() {
	                return 'https://www.bangdian.net/plugins/diy/assets/images/goods-tag-rx.png';
	            }
            },
            goodsCoverProportion: {
                type: String,
	            default: function() {
	                return '1-1';
	            }
            },
            goodsStyle: {
                type: Number,
	            default: function() {
	                return 1;
	            }
            },
            listStyle: {
                type: Number,
	            default: function() {
	                return 2;
	            }
            },
            list: {
                type: Array,
	            default: function () {
		            return [
		            ];
                }
            },
            fill: {
                type: Number,
	            default: function() {
	                return 2;
	            }
            },
            customizeGoodsTag: {
                type: Boolean,
	            default: function() {
	                return false;
	            }
            },
            catStyle: {
                type: Number,
	            default:function() {
	                return 2;
	            }
            },
            buyBtnText: {
                type: String,
	            default: function() {
	                return '购买放电';
	            }
            },
            buyBtnStyle: {
                type: Number,
	            default: function() {
	                return 1;
	            }
            },
            buyBtn: {
                type: String,
	            default: function() {
	                return 'cart';
	            }
            },
            catList: {
                type: Array,
	            default: function() {
	                return [];
	            }
            }
	    },
	   data() {
            return {
                activeCurrent: 0,
                goods: {},
            }
	   },
		computed: {
			...mapGetters('mallConfig',{
				getVideo: 'getVideo'
			}),
            ...mapState({
                platform: function(state) {
                    return state.gConfig.systemInfo.platform;
                }
            }),
		},
	    methods: {
            change(index) {
                this.activeCurrent = index;
            },
            buyProduct(data) {
                if (data.mch_id === 0) {
                    this.$request({
                        url: this.$api.goods.detail,
                        data: {
                            id: data.id,
                        }
                    }).then(response => {
                        if (response.code === 0) {
                            this.goods = response.data.goods;
                            this.show = Math.random();
                        }
                    })
                } else {
                    this.$request({
                        url: this.$api.mch.goods_detail,
                        data: {
                            mch_id: data.mch_id,
                            id: data.id,
                        }
                    }).then(response => {
                        if (response.code === 0) {
                            this.goods = response.data.goods;
                            this.show = Math.random();
                        }
                    })
                }
            },
            jump(data) {
				// #ifndef MP-BAIDU
				if (data.video_url && this.getVideo == 1) {
				    // #ifdef MP
					uni.navigateTo({
						url: `/pages/goods/video?goods_id=${data.id}`
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
            }
	    },
        components: {
            'app-attr': appAttr,
	    }
    }
</script>

<style scoped lang="scss">
	.app-icon {
		width: #{55rpx};
		height: #{55rpx};
		position: absolute;
		top: 0;
		left: 0;
	}
	/* #ifdef MP-ALIPAY*/
	button {
		padding: 0 #{20rpx};
	}
	/* #endif */
	/* #ifdef MP-BAIDU*/
	button:after {
		display: none;
	}
	/* #endif */
	.app-recommended-product {
		width: #{750rpx};
		.app-display-classification {
			width: #{750rpx};
			height: #{99rpx};
			border-bottom: #{1rpx} solid #e2e2e2;
			.app-scroll-view {
				white-space: nowrap;
				width: #{750-5-5rpx};
				margin: 0 #{5rpx};
				height: #{99-1rpx};
				/* #ifdef MP-ALIPAY */
				.app-nav-item {
					display: inline-block;
					height: #{97rpx};
					min-width: #{60rpx};
					line-height: #{97rpx};
					font-size: #{26rpx};
					color: #666666;
					margin: 0 #{44rpx};
					border-bottom: #{1rpx} solid transparent;
				}
				/* #endif */
				/* #ifndef MP-ALIPAY */
				.app-nav-item {
					display: inline-block;
					height: #{97rpx};
					line-height: #{97rpx};
					font-size: #{26rpx};
					color: #666666;
					margin: 0 #{44rpx};
					border-bottom: #{1rpx} solid transparent;
				}
				/* #endif */
				.app-active-current {
					border-bottom-color: #ff5c5c;
					color: #ff5c5c;
				}
				/* #ifdef MP-ALIPAY */
				.app-current-round {
					height: #{56rpx};
					padding-left: #{24rpx};
					min-width: #{100rpx};
					padding-right: #{24rpx};
					border-radius: #{30rpx};
					line-height: #{56rpx};
					margin: #{21.5rpx} #{24rpx};
				}
				/* #endif */
				/* #ifndef MP-ALIPAY */
				.app-current-round {
					height: #{56rpx};
					padding-left: #{24rpx};
					padding-right: #{24rpx};
					border-radius: #{30rpx};
					line-height: #{56rpx};
					margin: #{21.5rpx} #{24rpx};
				}
				/* #endif */
				.app-active-current-round {
					background-color: #ff5c5c;
					color: white;
				}
				
			}
		}
		.app-icon-button {
			background-repeat: no-repeat;
			background-size: 100% 100%;
			width: #{50rpx};
			height: #{50rpx};
		}
		.app-shopping-cart {
			background-image: url("../../../static/image/icon/shopping-cart.png");
		}
		.app-add-to {
			background-image: url("../../../static/image/icon/add-to.png");
		}
		.app-border {
			border-color: #e2e2e2 !important;
		}
		/*列表模式*/
		.app-list-mode {
			.app-item {
				margin: #{32rpx} #{24rpx};
				width: #{750-24-24rpx};
				height: #{200rpx};
				border: #{1rpx} solid transparent;
				position: relative;
				overflow: hidden;
                background: #FFFFFF;
				.app-image {
					width: #{200rpx};
					height: #{198rpx};
				}
				
				.app-item-content {
					height: #{200rpx};
					width: #{500rpx};
					padding: #{24rpx} #{24rpx} #{20rpx} #{32rpx};
					.app-name {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						height: #{66rpx};
						font-size: #{26rpx};
					}
					.app-price-button button {
						display: inline-block;
						margin: 0;
						height: #{48rpx};
						font-size: #{28rpx};
						line-height: #{48rpx};
						border-radius: 0;
					}
					.app-button-filling {
						color: #ffffff;
						background-color: #ff5c5c;
					}
					.app-button-fillet {
						color: #ffffff;
						background-color: #ff5c5c;
						border-radius: #{20rpx} !important;
					}
					.app-button-line {
						border: #{1rpx} solid #ff5c5c;
						color: #ff5c5c;
					}
					.app-button-rounded-lines {
						border: #{1rpx} solid #ff5c5c;
						color: #ff5c5c;
						border-radius: #{20rpx} !important;
					}
					.app-text {
						color: #ff4544;
						font-size: #{28rpx};
					}
					.app-price-button {
						margin-top: #{28rpx};
					}
					.app-price-button button:after {
						display: none;
					}
				}
			}
			
		}
		/*左右滑动*/
		.app-swipe-left-right {
			width: #{750rpx};
			.scroll-view {
				white-space: nowrap;
				width: #{750rpx};
				margin: 0 #{8rpx};
				padding-top: #{24rpx};
				padding-bottom: #{32rpx};
				.app-item {
					display: inline-block;
					width: #{200rpx};
					overflow: hidden;
					margin: 0 #{16rpx};
					position: relative;
					border: #{1rpx} solid transparent;
                    background: #FFFFFF;
					.app-image {
						width: #{200rpx};
						height: #{200rpx};
					}
					.app-name {
						width: #{200-12-12rpx};
						height: #{48rpx};
						font-size: #{24rpx};
						line-height: #{24rpx};
						color: #353535;
						display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;
						overflow: hidden;
					}
					.app-name-goods-style {
						text-align: center;
					}
					.app-price-button-name {
						width: #{200-12-12rpx};
						margin: 0 #{12rpx};
						.app-price-goods-style {
							width: #{200-12-12rpx} !important;
						}
						.app-icon-button {
							margin-top: #{16rpx};
							margin-left: #{16rpx};
						}
						.app-price {
							width: #{110rpx};
							height: #{28rpx};
							font-size: #{28rpx};
							line-height: #{28rpx};
							color: #ff4544;
							text-align: center;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
							margin-bottom: #{12rpx};
						}
					}
				}
			}
		}
		/*一行一个*/
		.app-one-per-line {
			width: #{750rpx};
			padding: #{26rpx} #{24rpx};
			.app-square {
			}
			.app-rectangle {
			}
			.app-item {
				width: #{750-24-24rpx};
				border: #{1rpx} solid transparent;
				border-bottom-left-radius: #{20rpx};
				border-bottom-right-radius: #{20rpx};
				margin-bottom: #{12rpx};
				position: relative;
				padding-bottom: #{24rpx};
                background: #FFFFFF;
				.app-image {
					width: #{702rpx};
				}
				.app-square-image {
					height: #{702rpx};
				}
				.app-rectangle-image {
					height: #{702-234rpx};
				}
				.app-icon {
					width: #{60rpx};
					height: #{60rpx};
					position: absolute;
					top: 0;
					left: 0;
				}
				.app-text {
					width: #{702rpx};
					padding: 0 #{24rpx};
					margin-top: #{28rpx};
					font-size: #{26rpx};
					color: #353535;
					display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;
					overflow: hidden;
				}
				.app-button-price {
					width: #{702-24-24rpx};
					margin: #{32rpx} #{24rpx};
					height: #{50rpx};
					.app-price {
						font-size: #{28rpx};
						color: #ff4544;
					}
					button {
						display: inline-block;
						margin: 0;
						height: #{48rpx};
						font-size: #{28rpx};
						line-height: #{48rpx};
						border-radius: 0;
					}
					.app-button-no-price {
						position: absolute;
						right: 0;
					}
					
					.app-button-filling {
						color: #ffffff;
						background-color: #ff5c5c;
					}
					.app-button-fillet {
						color: #ffffff;
						background-color: #ff5c5c;
						border-radius: #{20rpx} !important;
					}
					.app-button-line {
						border: #{1rpx} solid #ff5c5c;
						color: #ff5c5c;
					}
					.app-button-rounded-lines {
						border: #{1rpx} solid #ff5c5c;
						color: #ff5c5c;
						border-radius: #{20rpx} !important;
					}
				}
			}
		}
		/* 一行两个 */
		.app-one-line-two {
			width: #{750rpx};
			padding: #{2rpx} #{19rpx} #{0} #{19rpx};
			.app-item {
				width: #{346rpx};
				margin: #{24rpx} #{5rpx} #{0rpx} #{5rpx};
				border: #{1rpx} solid transparent;
				position: relative;
                background: #FFFFFF;
				.app-icon {
					width: #{55rpx};
					height: #{55rpx};
					position: absolute;
					top: 0;
					left: 0;
				}
				.app-image {
					width: #{343rpx};
					height: #{343rpx};
				}
				.app-name {
					width: #{346-24-24rpx};
					margin: #{24rpx} #{24rpx} 0 #{24rpx};
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					color: #353535;
					font-size: #{26rpx};
					/*	#ifndef MP-ALIPAY*/
					height: #{64rpx};
					/* #endif */
					/* #ifdef MP-ALIPAY */
					height: #{55rpx};
					/* #endif */
				}
				.app-name-goods-style {
					text-align: center;
				}
				.app-price-buttons {
					margin: #{32rpx} #{24rpx} #{48rpx} #{24rpx};
					button {
						display: inline-block;
						margin: 0;
						height: #{48rpx};
						font-size: #{25rpx};
						line-height: #{48rpx};
						border-radius: 0;
						padding: 0 #{11rpx};
					}
					.app-price {
						color: #ff4544;
						font-size: #{28rpx};
					}
					.app-button-filling {
						color: #ffffff;
						background-color: #ff5c5c;
					}
					.app-button-fillet {
						color: #ffffff;
						background-color: #ff5c5c;
						border-radius: #{20rpx} !important;
					}
					.app-button-line {
						border: #{1rpx} solid #ff5c5c;
						color: #ff5c5c;
					}
					.app-button-rounded-lines {
						border: #{1rpx} solid #ff5c5c;
						color: #ff5c5c;
						border-radius: #{20rpx} !important;
					}
				}
			}
		}
		/* 一行三个	*/
		.app-one-line-three {
			width: #{750rpx};
			padding: #{8rpx} #{16.5rpx};
			.app-item {
                background: #FFFFFF;
				width: #{224rpx};
				margin: #{16rpx} #{7.5rpx} #{16rpx} #{7.5rpx};
				position: relative;
				border: #{1rpx} solid transparent;
				padding-bottom: #{8rpx};
				.app-image {
					width: #{221rpx};
					height: #{221rpx};
				}
				.app-name {
					font-size: #{28rpx};
					color: #353535;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					width: #{224-12-12rpx};
					margin: #{16rpx} #{12rpx} #{0} #{12rpx};
					/* #ifndef MP-ALIPAY */
					height: #{70rpx};
					/* #endif */
					/* #ifdef MP-ALIPAY */
					height: #{60rpx};
					/* #endif */
				}
				.app-name-goods-style {
					text-align: center;
				}
				.app-price-buttons {
					margin: #{16rpx} #{12rpx} #{0} #{12rpx};
					.app-price {
						width: #{135rpx};
						font-size: #{28rpx};
						height: #{28rpx};
						line-height: #{28rpx};
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
						color: #ff4544;
					}
				}
			}
		}
	}
	.app-page {
		width: #{750rpx};
	}
</style>
