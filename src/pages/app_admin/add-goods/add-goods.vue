<template>
    <app-layout>
        <scroll-view scroll-y :style="{'height':`${windowHeight}px`}">
            <view class='title'>基本信息</view>
            <!-- 商品类型 fjt -->
            <view class='goods-type' v-if="is_ecard === 1">
                <view class='info-item type cross-center dir-left-nowrap'>
                    <view class="form-label">商品类型</view>
                    <view class="select">
                        <radio-group @change="typeChange" class="dir-left-nowrap main-between">
                            <label class="dir-left-nowrap">
                                <view>
                                    <radio :disabled="id !== 0"  color="#446dfd" value="goods" :checked="form.type === 'goods'"/>
                                </view>
                                <view class="select-label">实体商品</view>
                            </label>
                            <label class="dir-left-nowrap">
                                <view>
                                    <radio :disabled="id !== 0"  color="#446dfd" value="ecard" :checked="form.type === 'ecard'"/>
                                </view>
                                <view class="select-label" >电子卡密</view>
                            </label>
                        </radio-group>
                    </view>
                </view>
                <view class='info-item cross-center main-between' v-if="form.type === 'ecard'">
                    <view class="form-label">选择卡密</view>
                    <view @click="chooseECard">
                        <view class='cat-info dir-right-nowrap cross-center'>
                            <view class='cat-info dir-right-nowrap cross-center'>
                                <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                                <text v-if="form.plugin_data.ecard.ecard_id > 0">{{form.plugin_data.ecard.name}}</text>
                                <text style="color: #cdcdcd"  v-else>未选择</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <view class='goods-img'>
                <view class='label'>
                    <text style="color: #353535">商品图片</text>
                    <text class="label-info">(最多9张，可拖拽改变顺序)</text>
                </view>
                <view class='goods-list'>
                    <movable-area style="height: auto; width: 100%;" class="flex-wrap">
                        <view
                            @touchend.stop='touchend'
                            @touchmove.stop='touchm'
                            @longpress.stop='_longtap(item.pic_url,index,$event)'
                            class='goods-item'
                            v-for="(item,index) in img"
                            :key="index"
                        >
                            <image
                                mode="aspectFill"
                                class='goods-cover move-img'
                                :data-index="index"
                                :src="item.pic_url"
                            ></image>
                            <image
                                @click.stop='del_img(index)'
                                v-if="!beMove"
                                class='del-btn'
                                src='./../image/delete.png'
                            ></image>
                            <view v-if="index === 0 && !beMove" class='main-img'>主图</view>
                        </view>
                        <view v-if="img.length < 9" @click.stop='addImg' class='add-goods-img'>
                            <image src='./../image/add-goods.png'></image>
                            <view>添加</view>
                        </view>
                        <movable-view :data-index="beginIndex" :x="x" :y="y" direction="all" :damping="5000" :friction="1" :disabled="disabled">
                            <image :hidden='imgHidden' mode="aspectFill" class="goods-cover img-border" :src='img_src'></image>
                        </movable-view>
                    </movable-area>
                </view>
            </view>
            <view class='goods-info'>
                <view class='info-item goods-name cross-center dir-left-nowrap'>
                    <view class="form-label">商品名称</view>
                    <view @click="nameBlur" v-if="inputName" :class="form.name.length > 0 ? 'input' : 'input placeholder'">{{form.name ? form.name :'请输入商品名称'}}</view>
                    <input :focus="!inputName" @blur="nameBlur" v-else class='input' placeholder-style="color: #cdcdcd" placeholder="请输入商品名称" v-model='form.name'/>
                </view>
                <view class='info-item cross-center main-between'>
                    <view class="form-label">商品分类</view>
                    <view @click="chooseCat">
                        <view class='cat-info dir-right-nowrap cross-center'>
                            <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                            <text v-if="cats.length > 0">编辑</text>
                            <text style="color: #cdcdcd" v-else>未选择</text>
                        </view>
                    </view>
                </view>
                <view class='info-item cross-center dir-left-nowrap'>
                    <view class="form-label">单位</view>
                    <view class='dir-left-nowrap cross-center'>
                        <input maxlength="4" placeholder-style="color: #cdcdcd" placeholder="请输入商品单位" v-model='unit' class='input'/>
                    </view>
                </view>
            </view>
            <view class='title'>{{form.type === 'goods' ? '规格、价格及' : '价格、'}}库存</view>
            <view class='goods-info'>
                <view class='info-item main-between' v-if="form.type === 'goods'">
                    <view>多规格</view>
                    <switch style="transform:scale(0.7)" :checked="set_attr" @change="set_attr = !set_attr"></switch>
                </view>
                <view v-if="set_attr && form.type === 'goods'" class='info-item cross-center main-between'>
                    <view class="form-label">商品规格</view>
                    <view @click="chooseAttr">
                        <view class='cat-info dir-right-nowrap cross-center'>
                            <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                            <text v-if="attr">已设置</text>
                            <text style="color: #cdcdcd" v-else>未设置，点击设置</text>
                        </view>
                    </view>
                </view>
                <view v-if="!set_attr && form.type === 'goods'" class='info-item cross-center dir-left-nowrap'>
                    <view class="form-label">规格</view>
                    <view class='dir-left-nowrap cross-center price-input'>
                        <input class='input' placeholder-style="color: #cdcdcd" v-model='form.attr_default_name'></input>
                    </view>
                </view>
                <view class='info-item cross-center dir-left-nowrap'>
                    <view class="form-label">成本价</view>
                    <view class='dir-left-nowrap price-input cross-center main-between'>
                        <input @change="costChange" placeholder-style="color: #cdcdcd" placeholder="请输入成本价" type='digit' class='input' v-model="form.cost_price"></input>
                        <view>元</view>
                    </view>
                </view>
                <view class='info-item cross-center dir-left-nowrap'>
                    <view class="form-label">原价</view>
                    <view class='dir-left-nowrap price-input cross-center main-between'>
                        <input @change="originalChange" placeholder-style="color: #cdcdcd" placeholder="请输入原价" type='digit' class='input' v-model="form.original_price"></input>
                        <view>元</view>
                    </view>
                </view>
                <view class='info-item cross-center dir-left-nowrap'>
                    <view class="form-label">售价</view>
                    <view class='dir-left-nowrap price-input cross-center main-between'>
                        <input @change="priceChange" placeholder-style="color: #cdcdcd" placeholder="请输入售价" type='digit' class='input' v-model="form.price"></input>
                        <view>元</view>
                    </view>
                </view>
                <view v-if="!set_attr" class='info-item cross-center dir-left-nowrap'>
                    <view class="form-label">库存</view>
                    <view class='dir-left-nowrap price-input cross-center main-between'>
                        <input placeholder-style="color: #cdcdcd" placeholder="请输入库存" type='number' v-model="form.goods_num" class='input unit'></input>
                            <view class="unit-width">{{unit}}</view>
                    </view>
                </view>
                <view v-if="!set_attr" class='info-item cross-center dir-left-nowrap'>
                    <view class="form-label">货号</view>
                    <view class='dir-left-nowrap price-input cross-center'>
                        <input placeholder-style="color: #cdcdcd" placeholder="请输入货号" class='input' v-model="form.goods_no"></input>
                    </view>
                </view>
                <view v-if="!set_attr && form.type === 'goods'" class='info-item cross-center dir-left-nowrap'>
                    <view class="form-label">重量</view>
                    <view class='dir-left-nowrap cross-center price-input'>
                        <input placeholder-style="color: #cdcdcd" placeholder="请输入重量" type='number' v-model='form.goods_weight' class='input'></input>
                        <view>g</view>
                    </view>
                </view>
            </view>
            <view class='title'>{{form.type === 'goods' ? '运费、包邮及' : ''}}限购</view>
            <view class='goods-info'>
                <view class='info-item cross-center main-between' v-if="form.type === 'goods'">
                    <view class="form-label">运费设置</view>
                    <view @click="chooseExpress">
                        <view class='cat-info dir-right-nowrap cross-center'>
                            <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                            <text v-if="bePostage.id > -1">{{bePostage.name}}</text>
                            <text style="color: #cdcdcd" v-else>未选择</text>
                        </view>
                    </view>
                </view>
                <view class='info-item cross-center main-between' v-if="form.type === 'goods'">
                    <view class="form-label">包邮规则</view>
                    <view @click="chooseDelivery">
                        <view class='cat-info dir-right-nowrap cross-center'>
                            <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                            <text v-if="beDelivery.id > -1">{{beDelivery.name}}</text>
                            <text style="color: #cdcdcd" v-else>未选择</text>
                        </view>
                    </view>
                </view>
                <view class='info-item cross-center dir-left-nowrap'>
                    <view class="form-label">起售数量</view>
                    <view class='dir-left-nowrap cross-center price-input'>
                        <view class='dir-left-nowrap cross-center price-input'>
                            <input placeholder-style="color: #cdcdcd" style="width:396rpx;" placeholder="请输入起售数量" type='number' v-model='form.min_number' class='input'></input>
                            <view>{{unit}}</view>
                        </view>
                    </view>
                </view>
                <view class='info-item main-between'>
                    <view>限购</view>
                    <switch style="transform:scale(0.7)" :checked="confine" @change="changeConfine"></switch>
                </view>
                <view v-if="confine" class='info-item cross-center dir-left-nowrap'>
                    <view class="form-label">终身限购</view>
                    <view class="select">
						<radio-group @change="limitBuyFirstChange" class="dir-left-nowrap main-between">
							<label class="dir-left-nowrap">
								<view>
									<radio color="#446dfd" value="1" :checked="limit_buy_first"/>
								</view>
								<view class="select-label">无限制</view>
							</label>
							<label class="dir-left-nowrap">
								<view>
									<radio color="#446dfd" value="0" :checked="!limit_buy_first"/>
								</view>
								<view class="select-label" >手动输入</view>
							</label>
						</radio-group>
					</view>
                </view>
                <view class='info-item cross-center dir-left-nowrap' v-if="confine && !limit_buy_first">
                    <view class="form-label">终身限购数量</view>
                    <view class='dir-left-nowrap cross-center price-input'>
                        <view class='dir-left-nowrap cross-center price-input'>
                            <input placeholder-style="color: #cdcdcd" style="width:396rpx;" placeholder="请输入终身限购数量" type='number' v-model='form.confine_count' class='input'></input>
                            <view>{{unit}}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class='title'>商品图文描述</view>
            <view class='goods-info'>
                <view class='info-item cross-center main-between'>
                    <view class="form-label">商品图文描述</view>
                    <view @click="toGoodsDetail">
                        <view class='cat-info dir-right-nowrap cross-center'>
                            <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                            <text v-if="goods_detail.length > 0">已添加</text>
                            <text style="color: #cdcdcd" v-else>未添加</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class='title'>积分设置</view>
            <view class='goods-info integral-info'>
                <view class='express-setting'>
                    <view class='express-input cross-center'>
                        <view class="integral">积分赠送</view>
                        <input placeholder-style="color: #cdcdcd" placeholder="请输入积分赠送数量或比例" v-model='give_integral' class='input'></input>
                    </view>
                    <view class='express-etc'>会员购物赠送积分，如果不填或填0，则默认为不赠送，如果带%则为按成交价格的比例计算积分。</view>
                </view>
                <view class='express-setting'>
                    <view class='express-input cross-center'>
                        <view class="integral">积分抵扣</view>
                        <input placeholder-style="color: #cdcdcd" placeholder="请输入积分抵扣数量或比例" v-model='forehead_integral' class='input'></input>
                    </view>
                    <view class='express-etc'>如果不填或填0，则不支持积分抵扣；如果带%则为按成交价格的比例计算抵扣多少元。</view>
                </view>
            </view>
            <view class='title'>卡券</view>
            <view class='goods-info'>
                <view class='info-item cross-center main-between'>
                    <view class="form-label">卡券</view>
                    <view @click="chooseCard">
                        <view class='cat-info dir-right-nowrap cross-center'>
                            <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                            <text class="service-text" v-if="goods_card.length > 0">
                                <text v-for="(item,index) in goods_card" :key="index">
                                    <text v-if="index > 0">，</text>
                                    {{item.name}}
                                </text>
                            </text>
                            <text style="color: #cdcdcd" v-else>未选择</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class='title'>服务内容</view>
            <view class='goods-info'>
                <view class='info-item main-between'>
                    <view>默认服务</view>
                    <switch style="transform:scale(0.7)" :checked="is_default_services" @change="is_default_services=!is_default_services"></switch>
                </view>
                <view v-if="is_default_services == 0" class='info-item cross-center main-between'>
                    <view class="form-label">服务内容</view>
                    <view @click="chooseService">
                        <view class='cat-info dir-right-nowrap cross-center'>
                            <image class="to-more" src='/static/image/icon/arrow-right.png'></image>
                            <text class="service-text t-omit" v-if="beService.length > 0">
                                <text v-for="(item,index) in beService" :key="index">
                                    <text v-if="index > 0">，</text>
                                    {{item.name}}
                                </text>
                            </text>
                            <text style="color: #cdcdcd" v-else-if="service.length > 0">未选择</text>
                            <text style="color: #cdcdcd" v-else>未设置</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="main-between form-button">
                <view @click="submit(0)">
                    <view class='save'>保存</view>
                </view>
                <view @click="submit(1)">
                    <view class='send'>上架</view>
                </view>
            </view>
            <view :class="['dialog', `${iphone_x?'iphone_x':''}`]" v-if="dialog">
                <view class="picker-list">
                    <view class="main-between picker-header">
                        <view @click="toggle">取消</view>
                        <view @click="toggle(1)">确定</view>
                    </view>
                    <picker-view v-if="dialogType == 'postage'" :value="[set_postage?postageIndex:-1]" class="picker" @change="bindChange">
                        <picker-view-column>
                            <view v-for="(item,idx) in postage" :key="item.id"
                            :class="[`cross-center picker-text`,{
                                'sure-color': newIndex == idx,
                                'cardinal-color': newIndex == idx + 1 || newIndex == idx - 1,
                                'even-color': newIndex == idx + 2 || newIndex == idx - 2,
                            }]">{{item.name}}</view>
                        </picker-view-column>
                    </picker-view>
                    <picker-view v-if="dialogType == 'delivery'" :value="[set_delivery?deliveryIndex:-1]" class="picker" @change="bindChange">
                        <picker-view-column>
                            <view v-for="(item,idx) in delivery" :key="item.id"
                            :class="[`cross-center picker-text`,{
                                'sure-color': newIndex == idx,
                                'cardinal-color': newIndex == idx + 1 || newIndex == idx - 1,
                                'even-color': newIndex == idx + 2 || newIndex == idx - 2,
                            }]">{{item.name}}</view>
                        </picker-view-column>
                    </picker-view>
                </view>
            </view>
            <view :class="['dialog', `${iphone_x?'iphone_x':''}`]" v-if="ecard_dialog">
                <view class="picker-list">
                    <view class="main-between picker-header">
                        <view @click="ecardToggle">取消</view>
                        <view @click="ecardToggle(1)">确定</view>
                    </view>
                    <picker-view :value="[ecard_set_postage?ecard_postageIndex:-1]" class="picker" @change="bindChange">
                        <picker-view-column>
                            <view v-for="(item,idx) in ecard_postage" :key="item.id"
                                  :class="[`cross-center picker-text`,{
                                'sure-color': newIndex === idx,
                                'cardinal-color': newIndex === idx + 1 || newIndex === idx - 1,
                                'even-color': newIndex === idx + 2 || newIndex === idx - 2,
                            }]">{{item.name}}</view>
                        </picker-view-column>
                    </picker-view>
                </view>
            </view>
        </scroll-view>
        <view class='dialog' v-if="is_service">
            <view class='dialog-item'>
                <view class='dialog-title'>服务内容</view>
                <view class="type-list">
                    <view v-if="is_service" v-for="(item,index) in service" :key="index" @click='choose(item)' class="dir-left-nowrap type-choose" >
                        <image v-if="item.isChoose" class="active-status" src='./../image/active.png'></image>
                        <image v-else class="active-status" src='/static/image/icon/form-er.png'></image>
                        <view :class="[`${item.isChoose ? 'active':''}`]">{{item.name}}</view>
                    </view>
                </view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='cancelService'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='submitService'>确认</view>
                </view>
            </view>
        </view>
        <view class='dialog' v-if="modal">
            <view class='dialog-item'>
                <view class='dialog-title'>提示</view>
                <view class="error-info" v-if="set_cat">您暂未设置分类</view>
                <view class="error-info" v-if="set_postage && postage.length == 0">您暂未设置运费模板</view>
                <view class="error-info" v-if="set_delivery && delivery.length == 0">您暂未设置包邮规则</view>
                <view class="error-info" v-if="set_service && service.length == 0">您暂未设置服务内容</view>
                <view class="error-info" v-if="set_card && card.length == 0">您暂未设置卡券</view>
                <view class="error-info">请前往商城后台设置</view>
                <view class="main-center btn-area">
                    <view class="submit-btn be-submit" @click='close'>确认</view>
                </view>
            </view>
        </view>
        <view class='dialog' v-if="error">
            <view class='dialog-item'>
                <view class='dialog-title'>提示</view>
                <view class="error-info">{{error}}</view>
                <view class="main-center btn-area">
                    <view class="submit-btn be-submit" @click='close'>确认</view>
                </view>
            </view>
        </view>
        <view class='dialog' v-if="beSubmit">
            <view class='dialog-item'>
                <view class='dialog-title'>提示</view>
                <view class="submit-info">是否确认要上架此商品</view>
                <view class="main-center btn-area">
                    <view class="submit-btn" @click='close'>取消</view>
                    <view class="line"></view>
                    <view class="submit-btn be-submit" @click='toSubmit'>确认</view>
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import { mapState } from "vuex";
    import uploadFile from '@/core/upload.js';

    export default {
        data() {
            return {
                postageIndex: -1,
                deliveryIndex: -1,
                height: 0,
                give_integral: 0,
                forehead_integral: 0,
                windowHeight: 0,
                beSubmit: false,
                inputName: true,
                form: {
                    cats: [],
                    name: '',
                    cost_price: '',
                    price: '',
                    original_price: '',
                    type: 'goods',
                    plugin_data: {
                        ecard: {
                            ecard_id: 0
                        }
                    },
                    attr_default_name: '默认规格'
                },
                cats: [],
                forehead: -1,
                unit: '件',
                iphone_x: false,
                set_attr: false,
                is_default_services: true,
                modal: false,
                error: false,
                set_cat: false,
                set_postage: false,
                set_delivery: false,
                set_service: false,
                set_card: false,
                confine: false,
                is_service: false,
                goods_card: [],
                img: [],
                card: [],
                goods_detail: [],
                beMove: false,
                service: [],
                postage: [],
                delivery: [],
                bePostage: '',
                beDelivery: '',
                beService: [],
                default_service: [],
                newIndex: '0',
                index: '0',
                attr: false,
                have_children: false,
                disabled: true,
                imgHidden: true,
                flag: false,
                x: 0,
                y: 0,
                id: 0,
                first_service: true,
                choose_list: [],
                elements: [],
                img_src: '',
                dialog: false,
                loading: false,
                ecard_dialog: false,
                is_ecard: 0,
                ecard_api_url: '',
                ecardBePostage: '',
                ecard_postage: [],
                ecard_set_postage: false,
                ecard_postageIndex: -1,
                beginIndex: null,
                dialogType: '',
				limit_buy_status: 0,
				min_number: 1,
				limit_buy_first: true,
				limit_buy_second: true,
				limit_buy_type: 'day',
				limit_buy_value: -1,
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.info,
                adminImg: state => state.mallConfig.__wxapp_img.app_admin,
            })
        },
        methods: {
            changeConfine() {
                this.confine = !this.confine
				this.form.limit_buy_status = this.confine ? 1 : 0;
            },
            money(val) {
                let num = val.toString(); //先转换成字符串类型
                if (num.indexOf('.') == 0) { //第一位就是 .
                    num = '0' + num
                }
                num = num.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
                num = num.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
                num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
                if (num.indexOf(".") < 0 && num != "") {
                    num = parseFloat(num);
                }
                return +num
            },
            costChange(e) {
                this.form.cost_price = this.money(e.detail.value)
            },
            originalChange(e) {
                this.form.original_price = this.money(e.detail.value)
            },
            priceChange(e) {
                this.form.price = this.money(e.detail.value)
            },
            nameBlur() {
                this.inputName = !this.inputName;
            },

            catchTouchMove() {
                return false;
            },
            toSubmit() {
                let that = this;
                if(that.loading) {
                    return false
                }
                uni.showLoading({
                    mask: true,
                    title: '提交中...'
                });
                that.loading = true;
                that.beSubmit = false;
                that.$request({
                    url: that.$api.app_admin.edit,
                    data: {
                        form: JSON.stringify(that.form),
                        attrGroups: JSON.stringify(that.form.attr_groups)
                    },
                    method: 'post'
                }).then(response=>{
                    that.loading = false;
                    that.$hideLoading();
                    uni.hideLoading();
                    that.loading = false;
                    if(response.code == 0) {
                        if(response.code == 0) {
                            uni.showToast({
                                title: response.msg,
                                duration: 1000
                            });
                            setTimeout(function() {
                                uni.navigateBack();
                            }, 500)
                        }else {
                            uni.showToast({
                                title: response.msg,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.loading = false;
                    that.$hideLoading();
                    uni.hideLoading();
                });
            },

            submit(status) {
                let pass = false;
                let that = this;
                let form = that.form;

                let cats = [];
                if (that.img.length > 0) {
                    form.pic_url = that.img;
                } else {
                    that.error = '请上传商品图片';
                    return false
                }
                if (!form.name) {
                    that.error = '请设置商品名称';
                    return false
                }
                if (that.cats.length == 0) {
                    that.error = '请设置商品分类';
                    return false
                }else {
                    for(let i in that.cats) {
                        cats.push(that.cats[i].value)
                    }
                }
                if (!that.unit) {
                    that.error = '请设置商品单位';
                    return false
                } else {
                    form.unit = that.unit
                }
                if (form.cost_price != 0 && !form.cost_price) {
                    that.error = '请设置商品成本价';
                    return false
                }
                if (form.cost_price < 0) {
                    that.error = '成本价不得小于零';
                    return false
                }
                if (form.original_price != 0 && !form.original_price) {
                    that.error = '请设置商品原价';
                    return false
                }
                if (form.original_price < 0) {
                    that.error = '商品原价不得小于零';
                    return false
                }
                if (form.price != 0 && !form.price) {
                    that.error = '请设置商品售价';
                    return false
                }
                if(!that.set_attr) {
                    form.use_attr = 0;
                    form.attr = []; 
                    if (!form.goods_num) {
                        that.error = '商品库存不得为空';
                        return false
                    } else if (form.goods_num < 0) {
                        that.error = '商品库存不得小于零';
                        return false
                    } else {
                        pass = true;
                    }
                }else {
                    form.use_attr = 1;
                    form.goods_num = 0;
                    if (!form.attr_groups || form.attr_groups.length == 0) {
                        that.error = '请设置商品规格';
                        return false
                    }else {
                        pass = true
                    }
                }
                form.cards = that.goods_card;
                form.is_default_services = 1;
                form.services = [];
				that.form.limit_buy_status = that.confine ? 1 : 0;
                if(that.is_default_services == 0) {
                    form.is_default_services = 0;
                    if (that.beService.length > 0) {
                        form.services = that.beService;
                    }
                }
                form.status = status;
                if (that.goods_detail.length > 0) {
                    form.detail = '';
                    for(let i in that.goods_detail) {
                        if(that.goods_detail[i].type == "img") {
                            form.detail += '<p><img src="' + that.goods_detail[i].pic_url + '"/></p>'
                        }else if(that.goods_detail[i].type == "line") {
                            form.detail += '<p><img src="' + that.adminImg.line + '"/></p>'
                        }else if(that.goods_detail[i].type == "text") {
                            form.detail += '<p>' + that.goods_detail[i].text + '</p>'
                        }
                    }
                } else {
                    that.error = '请设置图文描述';
                    return false
                }
                if(!form.mchCats) {
                    form.mchCats = [];
                }
                if (that.forehead_integral) {
                    if (that.forehead_integral > 0) {
                        form.forehead_integral_type = 1;
                        form.forehead_integral = that.forehead_integral;
                    } else {
                        form.forehead_integral_type = 2;
                        form.forehead_integral = that.forehead_integral.replace('%', '')
                    }
                }
                if (that.give_integral) {
                    if (that.give_integral > 0) {
                        form.give_integral_type = 1;
                        form.give_integral = that.give_integral;
                    } else {
                        form.give_integral_type = 2;
                        form.give_integral = that.give_integral.replace('%', '')
                    }
                }
                if(!form.virtual_sales) {
                    form.virtual_sales = 0;
                }
                if(!form.cover_pic) {
                    form.cover_pic = '';
                }
                if(!form.sort) {
                    form.sort = 100;
                }
                if(!form.accumulative) {
                    form.accumulative = 1;
                }
                if(!form.member_price) {
                    form.member_price = {};
                }
                form.freight_id = that.bePostage.id;
                form.freight = that.bePostage;
                form.shipping_id = that.beDelivery.id;
                form.shipping = that.beDelivery;
                if(!form.individual_share) {
                    form.individual_share = 0;
                }
                if(!form.is_level) {
                    form.is_level = 0;
                }
                if(!form.individual_share) {
                    form.individual_share = 0;
                }
                if(!form.video_url) {
                    form.video_url = '';
                }
                if (pass) {
                    that.form = form;
                    that.form.cats = cats;
                    if(that.id > 0) {
                        that.form.id = that.id;
                    }
                    if(status == 0) {
                        that.toSubmit();
                    }else {
                        that.beSubmit = true; 
                    }
                }
            },

            close() {
                this.error = null;
                this.modal = false;
                this.beSubmit = false;
            },

            inputAttr(index) {
                this.attr[index].attr_list[0].attr_id = (+index + 2).toString();
            },

            _longtap: function (img_src,index,e) {
                let that = this;
                let query = uni.createSelectorQuery();
                let nodesRef = query.selectAll(".move-img");
                nodesRef.fields({
                    dataset: true,
                    rect: true

                }, (result) => {
                    that.elements = result;
                }).exec()
                // const detail = e.detail;
                that.img[index].pic_url = '';
                that.x = e.currentTarget.offsetLeft;
                that.y = e.currentTarget.offsetTop;
                that.imgHidden = false;
                that.flag = true;
                that.beMove = true;
                that.img_src = img_src;
                that.beginIndex = index;
            },
            //触摸结束
            touchend: function (e) {
                let that = this;
                if (!that.flag) {
                    return;
                }
                const x = e.changedTouches[0].pageX
                const y = e.changedTouches[0].pageY
                const list = that.elements;
                let data = that.img
                const beginIndex = that.beginIndex;
                for (let j = 0; j < list.length; j++) {
                    const item = list[j];
                    if (x > item.left && x < item.right && y > item.top && y < item.bottom) {
                        const endIndex = item.dataset.index;
                        //向后移动
                        if (beginIndex < endIndex) {
                            let tem = data[beginIndex];
                            for (let i = beginIndex; i < endIndex; i++) {
                                data[i] = data[i + 1]
                            }
                            data[endIndex] = tem;
                        }
                        //向前移动
                        if (beginIndex > endIndex) {
                            let tem = data[beginIndex];
                            for (let i = beginIndex; i > endIndex; i--) {
                                data[i] = data[i - 1]
                            }
                            data[endIndex] = tem;
                        }
                        data[endIndex].pic_url = that.img_src;
                        that.img = data;
                    }
                }
                if (!that.img[beginIndex].pic_url) {
                    that.img[beginIndex].pic_url = that.img_src;
                }
                that.imgHidden = true;
                that.flag = false;
                that.beMove = false;
                that.beginIndex = null;
            },
            //滑动
            touchm: function (e) {
                if (this.flag) {
                    const x = e.touches[0].pageX;
                    const y = e.touches[0].pageY;
                    this.x = x - 60;
                    this.y = y - 189;
                }
            },
            cancelService() {
                let beService = this.beService;
                let service = this.service;
                if (beService.length > 0) {
                    service.forEach(function(res, index) {
                        res.isChoose = false;
                        beService.forEach(function(row) {
                            if (row.id == res.id) {
                                res.isChoose = true;
                            }
                        })
                    })
                } else {
                    service.forEach(function(res, index) {
                        res.isChoose = false;
                    })
                }
                this.beService = beService;
                this.service = service;
                this.set_service = false;
                this.is_service = false;
                setTimeout(v=>{
                    uni.pageScrollTo({
                        scrollTop: 45550,
                        duration: 0
                    });
                },0)
            },

            submitService() {
                let beService = [];
                this.service.forEach(function(row) {
                    if (row.isChoose) {
                        beService.push(row)
                    }
                })
                this.beService = beService;
                this.set_service = false;
                this.is_service = false;
                setTimeout(v=>{
                    uni.pageScrollTo({
                        scrollTop: 45550,
                        duration: 0
                    });
                },0)
            },
            choose(item) {
                let that = this;
                that.service.forEach(function(row) {
                    if (row.id == item.id) {
                        row.isChoose = !row.isChoose;
                        that.$forceUpdate();
                    }
                })
            },
            toGoodsDetail() {
                uni.navigateTo({
                    url: '/pages/app_admin/goods-detail/goods-detail'
                })
            },
            addImg() {
                let that = this;
                let num = 9 - that.img.length;
                // #ifdef MP
                uni.chooseImage({
                    count: num,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera'],
                    success(res) {
                        // tempFilePath可以作为img标签的src属性显示图片
                        const tempFilePaths = res.tempFilePaths;
                        let img = that.img;
                        tempFilePaths.forEach(function (row, index) {   
                            uni.showLoading({
                                mask: true,
                                title: '上传中...'
                            });
                            let fileName = '';
                            // #ifdef MP-BAIDU
                            fileName = row.substr(row.lastIndexOf('/') + 1);
                            // #endif
                            uploadFile({
                                url: that.$api.upload.file,
                                filePath: row,
                                fileType: 'image',
                                fileName: fileName,
                                mch_id: 0
                            }).then(res => {
                                let imgInfo = null;

                                // #ifndef MP-BAIDU
                                imgInfo = JSON.parse(res.data);
                                // #endif

                                // #ifdef MP-BAIDU
                                imgInfo = res.data;
                                // #endif

                                if (imgInfo.code === 0) {
                                    img.push({
                                        pic_url: imgInfo.data.url,
                                        id: imgInfo.data.id
                                    })
                                }

                                that.img = img;
                                if (index === tempFilePaths.length - 1) {
                                    uni.hideLoading();
                                }
                            }).catch(e => {
                                if (e && e.errMsg) {
                                    uni.showModal({
                                        title: '错误',
                                        content: e.errMsg,
                                        showCancel: false,
                                    });
                                }
                            })
                        })
                    }
                })
                // #endif

                // #ifdef H5
                uni.chooseImage({
                    count: Number(num),
                    success: function(e) {
                        uni.showLoading({
                            mask: true,
                            title: '上传中...'
                        });
                        for (let i in e.tempFilePaths) {
                            if (i >= (num - that.img.length)) {
                                break;
                            }
                            let image = new Image();
                            image.src = e.tempFilePaths[i];
                            image.onload = () => {
                                let canvas = document.createElement("canvas");
                                canvas.width = image.width;
                                canvas.height = image.height;
                                let ctx = canvas.getContext("2d");
                                ctx.drawImage(image, 0, 0, image.width, image.height);
                                let ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase();
                                let dataURL = canvas.toDataURL("image/" + ext);
                                uploadFile({
                                    url: that.$api.upload.file,
                                    maxNum: num,
                                    success: function({res, header}) {
                                        that.$request({
                                            url: that.$api.upload.file + '&name=base64',
                                            header: header,
                                            method: 'post',
                                            data: {
                                                database: dataURL
                                            }
                                        }).then(res => {
                                            uni.hideLoading();
                                            if (res.code === 0) {
                                                that.img.push({
                                                    pic_url: res.data.url,
                                                    id: res.data.id
                                                })
                                                // if (index === e.tempFilePaths.length - 1) {
                                                //     uni.hideLoading();
                                                // }
                                            } else {
                                                uni.showModal({
                                                    title: '',
                                                    content: res.msg,
                                                    showCancel: false,
                                                });
                                            }
                                        })
                                    }
                                });
                            };
                        }
                    }
                });
            // #endif
            },
            del_img(index) {
                this.img.splice(index, 1);
            },
            chooseCat() {
                uni.navigateTo({
                    url: '/pages/goods-edit/goods-cat/goods-cat'
                })
            },
            chooseAttr() {
                uni.navigateTo({
                    url: '/pages/app_admin/goods-attr/goods-attr'
                })
                this.$storage.setStorageSync('goods_unit', this.unit);
            },
            bindChange(e) {
                this.newIndex = e.detail.value[0]
            },
            toggle(status) {
                this.choose_list = [];
                this.dialog = false;
                this.set_cat = false;
                if(this.dialogType == 'postage') {
                    if (status == 1) {
                        if (this.set_postage) {
                            this.bePostage = this.postage[this.newIndex];
                        }
                    }else {
                        this.set_postage = false;
                    }
                }
                if(this.dialogType == 'delivery') {
                    if (status == 1) {
                        if (this.set_delivery) {
                            this.beDelivery = this.delivery[this.newIndex];
                        }
                    }else {
                        this.set_delivery = false;
                    }
                }
                this.dialogType = '';
            },
            chooseService() {
                let that = this;
                if(that.first_service) {
                    that.$request({
                        url: that.$api.app_admin.service,
                    }).then(response=>{
                        that.$hideLoading();
                        if(response.code == 0) {
                            that.service = response.data.list;
                            if (response.data.list.length == 0) {
                                that.modal = true;
                            } else {
                                that.is_service = true;
                            }
                            let beService = [];
                            for(let row of response.data.list) {
                                row.isChoose = false
                                if (row.is_default == 1) {
                                    beService.push(row);
                                    row.isChoose = true
                                }
                            }
                            that.set_service = true;
                            that.beService = beService;
                            that.default_service = beService;
                            that.first_service = false;
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
                }else {
                    if (that.service.length == 0) {
                        that.modal = true;
                    } else {
                        that.is_service = true;
                    }
                }
            },
            chooseCard() {
                let that = this;
                that.$request({
                    url: that.$api.app_admin.card,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) { true;
                        that.card = response.data.list;
                        if(response.data.list.length == 0) {
                            that.set_card = true;
                            that.modal = true;
                        }else {
                            uni.navigateTo({
                                url: '/pages/app_admin/goods-card/goods-card'
                            })
                        }
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
            chooseDelivery() {
                let that = this;
                that.$request({
                    url: that.$api.app_admin.delivery_rules,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        if (response.data.list.length == 0) {
                            that.set_delivery = true;
                            that.modal = true;
                            that.delivery = response.data.list;
                        } else {
                            let arr = [];
                            response.data.list.forEach(function (row, index) {
                                arr.push(response.data.list[index].id)
                            });
                            let index = arr.indexOf(that.beDelivery.id);
                            if(index > -1) {
                                that.deliveryIndex = index;
                                that.newIndex = index;
                            }else {
                                that.beDelivery = ''
                            }
                            that.set_delivery = true;
                            that.dialog = true;
                            that.dialogType = 'delivery'
                            that.delivery = response.data.list;
                        }
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
            chooseExpress() {
                let that = this;
                that.$request({
                    url: that.$api.app_admin.postage,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        if (response.data.list.length == 0) {
                            that.set_postage = true;
                            that.modal = true;
                            that.postage = response.data.list;
                        } else {
                            let arr = [];
                            response.data.list.forEach(function (row, index) {
                                arr.push(response.data.list[index].id)
                            });
                            let index = arr.indexOf(that.bePostage.id);
                            if(index > -1) {
                                that.postageIndex = index;
                                that.newIndex = index;
                            }else {
                                that.bePostage = ''
                            }
                            that.set_postage = true;
                            that.dialog = true;
                            that.dialogType = 'postage'
                            that.postage = response.data.list;
                        }
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
            getService(id) {
                let that = this;
                this.$request({
                    url: this.$api.app_admin.service,
                }).then(response=>{
                    that.$hideLoading();
                    let { code, data, msg } = response;
                    if(code === 0) {
                        that.service = data.list;
                        for(let i in that.service) {
                            that.service[i].isChoose = false;
                        }
                        if(id > 0) {
                            for(let j in that.beService) {
                                for(let i in that.service) {
                                    if(that.service[i].id == that.beService[j].id) {
                                        that.service[i].isChoose = true;
                                        that.first_service = false;
                                    }
                                }
                            }
                        }else {
                            that.beService = [];
                            data.list.forEach(function(row) {
                                row.isChoose = false;
                                if (row.is_default == 1) {
                                    that.beService.push(row);
                                    row.isChoose = true
                                }
                            })
                        }
                    }else {
                        uni.showToast({
                            title: msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            getPostage(id) {
                let that = this;
                this.$request({
                    url: this.$api.app_admin.postage,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.postage = response.data.list;
                        if(id > 0) {
                            return false;
                        }else {
                            that.bePostage = '';
                            that.bePostage = response.data.list[0];
                        }
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
            getDelivery(id) {
                let that = this;
                this.$request({
                    url: this.$api.app_admin.delivery_rules,
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.delivery = response.data.list;
                        if(id > 0) {
                            return false;
                        }else {
                            that.beDelivery = '';
                            that.beDelivery = response.data.list[0];
                        }
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
            getCard() {
                let that = this;
                this.$request({
                    url: this.$api.app_admin.card
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.card = response.data.list;
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
            async getDetail(id) {
                const res = await this.$request({
                    url: this.$api.app_admin.goods_edit,
                    data: {
                        id: id
                    }
                });
                let { code, data, msg } = res;
                await this.$hideLoading();
                this.getService(id);
                this.getPostage(id);
                this.getDelivery(id);
                if(code === 0) {
                    this.form = data.detail;
                    let {
                        pic_url, cats, use_attr,
                        services, freight, cards,
                        confine_count, is_default_services, forehead_integral,
                        forehead_integral_type, give_integral, give_integral_type,
                        attr_groups, attr, detail, unit, shipping, min_number, limit_buy_status,
						limit_buy_type, limit_buy_value,
                    } = this.form;
                    this.img = pic_url;
                    this.cats = cats;
                    this.set_attr = use_attr == 1 ? true : false;
                    this.beService = services;
                    this.bePostage = freight;
                    this.beDelivery = shipping;
                    this.goods_card = cards;
                    this.unit = unit;
                    this.min_number = min_number;

                    if(limit_buy_status == 1) {
                        this.confine = true;
                    }
					
					if (confine_count > 0) {
						this.limit_buy_first = false;
					}
					if (limit_buy_value > 0) {
						this.limit_buy_second= false;
					}

                    if(is_default_services == 0) this.is_default_services = false;

                    this.forehead_integral = +forehead_integral;
                    if(forehead_integral_type == 2) this.forehead_integral = forehead_integral + '%';

                    this.give_integral = +give_integral;
                    if(give_integral_type == 2) this.give_integral = give_integral + '%';

                    if(attr_groups.length > 0 && attr.length > 0) {
                        this.attr = true;
                        this.$storage.setStorageSync('goods_attr_groups', attr_groups);
                        this.$storage.setStorageSync('goods_attr', attr);
                    }
                    let form_detail = detail.split(/<\/p>|<br\/>|<img /);
                    let good_detail = [];

                    let para = undefined;

                    for(let i in form_detail) {
                        form_detail[i] =  form_detail[i].replace(/<p>/g, '').replace(/<\/p>/g, '');
                        para = {type: ''};
                        if(form_detail[i].indexOf('src') > -1) {
                            para.type = 'img';
                            para.id = '';
                            let end = form_detail[i].indexOf('.png') > -1 ? form_detail[i].indexOf('.png') + 4 : form_detail[i].length -1;
                            if(form_detail[i].indexOf('.jpg') > -1) {
                                end = form_detail[i].indexOf('.jpg') + 4
                            }
                            if(form_detail[i].indexOf('.jpeg') > -1) {
                                end = form_detail[i].indexOf('.jpeg') + 5
                            }
                            if(form_detail[i].indexOf('.gif') > -1) {
                                end = form_detail[i].indexOf('.gif') + 4
                            }
                            para.pic_url = form_detail[i].slice(form_detail[i].indexOf('http'), end);
                        }else {
                            para.type = 'text';
                            para.text = form_detail[i];
                        }
                        good_detail[i] = para;
                    }

                    for(let i in good_detail) {
                        if(good_detail[i].text === '') {
                            good_detail.splice(i,1);
                        }
                    }
                    this.goods_detail = good_detail;
                    this.$storage.setStorageSync('goods_card', cards);
                    this.$storage.setStorageSync('goods_cat', this.cats);
                    this.$storage.setStorageSync('goods_detail', good_detail);
                }else {
                    uni.showToast({
                        title: msg,
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            // 选卡密列表
            chooseECard() {
                if (this.id !== 0) return;
                this.$request({
                    url: this.$api.app_admin.ecard_api_url + this.ecard_api_url,
                }).then(res => {
                    let { code, data, msg } = res;
                    this.$hideLoading();
                    if(code === 0) {
                        if (data.length === 0) {
                            this.ecard_set_postage = true;
                            this.ecard_postage = data;
                        } else {
                            let arr = [];
                            data.forEach((row, index) => {
                                arr.push(data[index].id);
                            });
                            let index = arr.indexOf(this.form.plugin_data.ecard.ecard_id);
                            if(index > -1) {
                                this.ecard_postageIndex = index;
                                this.newIndex = index;
                            }else {
                                this.form.plugin_data.ecard = {
                                    ecard_id: 0,
                                    name: ''
                                };
                            }
                            this.ecard_set_postage = true;
                            this.ecard_dialog = true;
                            this.ecard_postage = data;
                        }
                    }else {
                        uni.showToast({
                            title: msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    this.$hideLoading();
                });
            },

            typeChange(e) {
                if (this.id === 0) {
                    this.form.type = e.target.value;
                }
            },

            async getGoodsConfig() {
                const e = await this.$request({
                    url: this.$api.app_admin.goods_config,
                });
                if (e.code === 0) {
                    this.is_ecard = e.data.is_ecard;
                    this.ecard_api_url = e.data.ecard_api_url;
                }
            },

            ecardToggle(status) {
                this.ecard_dialog = false;
                if (status == 1) {
                    if (this.ecard_set_postage) {
                        this.form.plugin_data.ecard = {
                            ecard_id: this.ecard_postage[this.newIndex].id,
                            name: this.ecard_postage[this.newIndex].name,
                        }
                    }
                }else {
                    this.ecard_set_postage = false;
                }
            },
			limitBuyFirstChange(e) {
				if (e.target.value === '1') {
					this.limit_buy_first = true;
					this.form.confine_count = -1;
				} else {
					this.limit_buy_first = false;
					this.form.confine_count = '';
				}
			}
        },

        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            uni.getSystemInfo({
                success: function (res) {
                    that.windowHeight = res.windowHeight;
                    if(res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1 || res.model.indexOf('iPhone11') > -1 || res.model.indexOf('iPhone12') > -1 || res.model.indexOf('Unknown Device') > -1) {
                        that.iphone_x = true;
                    }
                }
            });
            uni.getSystemInfo({
                success: function (res) {
                    let clientHeight = res.windowHeight;
                    let clientWidth = res.windowWidth;
                    let ratio = 750 / clientWidth;
                    that.height = clientHeight * ratio;
                }
            });
            that.getCard();
            that.getGoodsConfig();
            this.$storage.removeStorageSync('goods_card');
            this.$storage.removeStorageSync('goods_cat');
            this.$storage.removeStorageSync('goods_unit');
            this.$storage.removeStorageSync('goods_attr_groups');
            this.$storage.removeStorageSync('goods_attr');
            this.$storage.removeStorageSync('temp_attr');
            this.$storage.removeStorageSync('temp_attr_info');
            this.$storage.removeStorageSync('goods_detail');
            that.goods_card = [];
            that.goods_detail = [];
            if(options.id > 0) {
                that.$showLoading({
                    type: 'global',
                    text: '加载中...'
                });
                that.id = options.id;
                setTimeout(()=>{
                    uni.setNavigationBarTitle({
                        title: '编辑商品',
                    });
                    that.getDetail(options.id);
                },500);
            }else {
                that.getService();
                that.getPostage();
                that.getDelivery();
            }
        },
        onShow() {
            this.goods_card = this.$storage.getStorageSync('goods_card') ? this.$storage.getStorageSync('goods_card') : [];
            this.cats = this.$storage.getStorageSync('goods_cat') ? this.$storage.getStorageSync('goods_cat') : [];
            this.goods_detail = this.$storage.getStorageSync('goods_detail') ? this.$storage.getStorageSync('goods_detail') : [];
            this.form.attr = this.$storage.getStorageSync('goods_attr') ? this.$storage.getStorageSync('goods_attr') : [];
            if(this.$storage.getStorageSync('goods_attr_groups')) {
                this.form.attr_groups = this.$storage.getStorageSync('goods_attr_groups');
                this.attr = true;
            }
            this.$storage.removeStorageSync('temp_attr');
            this.$storage.removeStorageSync('temp_attr_info');
        },

        watch: {
            'form.type' : {
                handler(data) {
                    if (data === 'goods') {
                        this.form.plugin_data.ecard.ecard_id = 0;
                        this.form.plugin_data.ecard.name = '';
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped lang="scss">
    .title {
        font-size: #{28rpx};
        color: #999;
        margin: #{30rpx} #{24rpx} #{13rpx};
    }

    .goods-img {
        background-color: #fff;
        padding: #{32rpx} #{24rpx};
    }

    .goods-list {
        margin-top: #{8rpx};
        margin-left: #{-24rpx};
    }

    .goods-item {
        position: relative;
        margin-left: #{24rpx};
        margin-top: #{24rpx};
        height: #{218rpx};
        width: #{218rpx};
    }

    .label {
        font-size: #{28rpx};
        color: #999;
    }

    .goods-cover {
        height: #{218rpx};
        width: #{218rpx};
    }

    .del-btn {
        height: #{40rpx};
        width: #{40rpx};
        position: absolute;
        right: #{-8rpx};
        top: #{-16rpx};
    }

    .main-img {
        height: #{40rpx};
        line-height: #{40rpx};
        width: #{218rpx};
        text-align: center;
        font-size: #{24rpx};
        color: #fff;
        background-color: rgba(68, 109, 253, 0.5);
        position: absolute;
        bottom: 0;
        left: 0;
    }

    .add-goods-img {
        background-color: #f4f5f9;
        position: relative;
        margin-left: #{24rpx};
        margin-top: #{24rpx};
        height: #{218rpx};
        width: #{218rpx};
        font-size: #{24rpx};
        color: #999;
        z-index: 10;
        text-align: center;
    }

    .add-goods-img image {
        height: #{40rpx};
        width: #{40rpx};
        margin: #{70rpx} auto #{10rpx};
    }

    .goods-info {
        background-color: #fff;
        padding: 0 #{24rpx};
        .info-item:first-of-type {
            border-top: 0;
        }
        .info-item.goods-name {
            border-top: #{1rpx} solid #e2e2e2;
        }
    }

    .form-label {
        width: #{176rpx};
    }

    .info-item {
        border-top: #{1rpx} solid #e2e2e2;
        height: #{88rpx};
        line-height: #{88rpx};
        font-size: #{28rpx};
        color: #353535;
    }

    view.input {
        height: #{80rpx};
        line-height: #{80rpx};
        white-space: nowrap;
        overflow: auto;
    }

    view.input.placeholder {
        color: #cdcdcd;
    }

    .input {
        width: #{476rpx};
        background-color: #fff;
        padding-left: #{25rpx};
        font-size: #{28rpx};
    }

    .input.unit {
        width: #{396rpx};
    }

    .unit-width {
        width: #{112rpx};
        text-align: right;
    }

    .cat-info {
        width: #{526rpx};
        color: #666;
    }

    .to-more {
        height: #{24rpx};
        width: #{12rpx};
        margin-left: #{10rpx};
    }

    .price-input {
        position: relative;
        color: #666;
        height: #{88rpx};
    }

    .money {
        position: absolute;
        height: #{88rpx};
        line-height: #{88rpx};
        width: #{20rpx};
        left: 0;
        top: 0;
    }

    .attr-info {
        background-color: #fff;
        padding: 0 #{24rpx};
        margin-top: #{20rpx};
    }

    .attr-input {
        width: #{638rpx};
    }

    .attr-input .input {
        color: #666;
        width: #{412rpx};
    }
    .attr-input .input.unit {
        width: #{330rpx};
    }

    .express-setting {
        height: #{136rpx};
        padding: #{16rpx} 0 #{20rpx};
        border-top: #{1rpx} solid #e2e2e2;
    }

    .express-input {
        position: relative;
        .input-item {
            font-size: #{28rpx};
            color: #353535;
            .input {
                width: #{650rpx};
            }
        }
    }

    .express-input .input {
        width: #{702rpx};
        padding-left: #{216rpx};
    }

    .express-input .integral {
        position: absolute;
        left: 0;
        z-index: 2;
    }

    .express-etc {
        color: #999;
        font-size: #{24rpx};
        margin-top: #{16rpx};
    }

    .form-button {
        width: #{656rpx};
        margin: 0 auto;
    }

    .save {
        height: #{80rpx};
        line-height: #{80rpx};
        text-align: center;
        width: #{300rpx};
        margin: #{80rpx} 0;
        font-size: #{28rpx};
        color: #446dfd;
        border: #{2rpx} solid #446dfd;
        background-color: #FFFFFF;
        border-radius: #{40rpx};
    }

    .send {
        height: #{80rpx};
        line-height: #{80rpx};
        text-align: center;
        width: #{300rpx};
        margin: #{80rpx} #{24rpx};
        font-size: #{28rpx};
        color: #fff;
        background-color: #446dfd;
        border-radius: #{40rpx};
    }

    .dialog {
        position: fixed;
        height: 100%;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, .3);
    }

    .dialog.iphone_x .picker-list{
        padding-bottom: #{50rpx};
    }

    .picker {
        width: 100%;
        height: #{440rpx};
        color: #999999;
    }


    .dialog.iphone_x .picker{
        height:#{490rpx};
    }

    .picker-list {
        background-color: #fff;
        padding-top: #{20rpx};
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
    }

    .picker-header {
        padding: 0 #{24rpx};
        color: #446dfd;
        font-size: #{32rpx};
    }

    .is_cat {
        padding: #{50rpx} 0 0 #{24rpx};
        color: #666666;
        font-size: #{28rpx};
        border-bottom: #{1rpx} solid #e2e2e2;
    }

    .is_cat text {
        margin-right: #{48rpx};
        display: inline-block;
        max-width: #{130rpx};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .is_cat text:last-of-type {
        padding-bottom: #{24rpx};
        color: #446dfd;
        border-bottom: #{2rpx} solid #446dfd;
    }

    .type-list {
        max-height: #{400rpx};
        overflow: auto;
    }

    .type-choose {
        padding: 0 #{24rpx} 0 #{72rpx};
        line-height: #{36rpx};
        color: #353535;
        font-size: #{32rpx};
        text-align: left;
        margin: #{35rpx} 0 #{50rpx};
    }

    .type-choose .active {
        color: #446dfd;
    }

    .active-status {
        width: #{36rpx};
        height: #{36rpx};
        display: block;
        margin-right: #{24rpx};
        flex-shrink: 0;
    }

    .attr-btn-item {
        padding-left: #{88rpx};
        background-color: #fff;
    }

    .dialog-item {
        padding-top: #{20rpx};
        position: fixed;
        top: 25%;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: #{620rpx};
        border-radius: #{16rpx};
        background-color: #fff;
    }

    .btn-area {
        height: #{88rpx};
        position: relative;
        border-top: #{1rpx} solid #e2e2e2;
    }

    .btn-area .line {
        height: #{32rpx};
        width: #{1rpx};
        background-color: #e2e2e2;
        position: absolute;
        top: #{28rpx};
        left: 0;
        right: 0;
        margin: 0 auto;
    }

    .submit-btn {
        height: #{88rpx};
        line-height: #{88rpx};
        font-size: #{32rpx};
        color: #666;
        width: #{310rpx};
        text-align: center;
    }

    .submit-btn.be-submit {
        color: #446dfd;
    }

    .dialog-title {
        text-align: center;
        margin: #{15rpx} 0 #{50rpx};
    }

    .img-border {
        height: #{250rpx};
        width: #{250rpx};
        margin-top: #{-16rpx};
        margin-left: #{-16rpx}; 
    }

    .screen {
        height: 100%;
        overflow: hidden;
    }

    .error-info {
        text-align: center;
        margin: #{50rpx};
    }

    .submit-info {
        text-align:center;
        margin-bottom: #{60rpx};
    }

    .picker-text {
        line-height: #{88rpx};
        color: #446dfd;
        font-size: #{32rpx};
        padding-left: #{24rpx};
    }

    .picker-text.sure-color {
        color: #446dfd;
    }
    .picker-text.cardinal-color {
        color: #999999;
    }
    .picker-text.even-color {
        color: #cdcdcd;
    }

    .integral {
        font-size: #{28rpx};
        color: #353535;
    }

    .integral-info .express-setting {
        height: #{164rpx};
    }

    .integral-info .express-setting:first-of-type {
        border-top:0
    }

    .label-info {
        font-size: #{24rpx};
        color: #999999;
    }

    .goods-type {
        background-color: #fff;
        padding: 0 #{24rpx};
        margin-bottom: #{18upx};
        .type {
            border-top: 0;
        }
    }
	.select {
		width: #{408upx};
	}
	.select-label {
		font-size: #{26upx};
		margin-left: #{23upx};
	}
    .service-text {
        width: 500rpx;
        text-align: right;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>