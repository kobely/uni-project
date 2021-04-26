<template>
    <view class="app-layout">
        <app-layout>
            <view class="poster-goods dir-top-nowrap" v-if="loadShow">
                <view id="head" class="head box-grow-1 main-center">
                    <template v-if="selectForm.style == styleList[0].value">
                        <app-goods-poster-one :info="info" :form="selectForm"
                                              :multiple="multiple"></app-goods-poster-one>
                    </template>
                    <template v-if="selectForm.style == styleList[1].value">
                        <app-goods-poster-two :info="info" :form="selectForm"
                                              :multiple="multiple"></app-goods-poster-two>
                    </template>
                    <template v-if="selectForm.style == styleList[2].value">
                        <app-goods-poster-three :info="info" :form="selectForm"
                                                :multiple="multiple"></app-goods-poster-three>
                    </template>
                    <template v-if="selectForm.style == styleList[3].value">
                        <app-goods-poster-four :info="info" :form="selectForm"
                                               :multiple="multiple"></app-goods-poster-four>
                    </template>
                </view>
                <view class="setting box-grow-0">
                    <view class="dir-left-nowrap line">
                        <view class="box-grow-0 main-center cross-center label">
                            <icon :style="{'background-color': getTheme.background}" type></icon>
                            <text>样式</text>
                        </view>
                        <view class="dir-left-wrap box-grow-1">
                           <block v-for="(item,key) in styleList" :key="key">
                               <template v-if="config.poster_style.indexOf(item.value.toString()) !== -1">
                                   <view  :key="key"
                                         @click="changeStyle(item.value)"
                                         :style="{'border-color': item.value == selectForm.style ? getTheme.border : ''}"
                                         :class="item.value == selectForm.style ? 'active' : ''"
                                         class="style-input main-center cross-center"
                                   >
                                       <text>{{item.label}}</text>
                                       <icon
                                               v-if="item.value == selectForm.style"
                                               :style="{'background-color': getTheme.background}"
                                               class="icon-active" type></icon>
                                   </view>
                               </template>
                           </block>
                        </view>
                    </view>

                    <view class="dir-left-nowrap line">
                        <view class="box-grow-0 main-center cross-center label">
                            <icon :style="{'background-color': getTheme.background}" type></icon>
                            <text>排版</text>
                        </view>
                        <view class="dir-left-wrap box-grow-1">
                            <block v-for="(item,key) in typesettingList" :key="key">
                                <template v-if="config.image_style.indexOf(item.value.toString()) !== -1">
                                    <view  :key="key"
                                          @click="changeTypeSetting(item.value)"
                                         :style="{'border-color': item.value == selectForm.typesetting ? getTheme.border : ''}"
                                         :class="item.value == selectForm.typesetting ? 'active' : ''"
                                          class="line-input dir-left-nowrap main-center cross-center"
                                    >
                                        <img :src="item.pic_url" class="icon-square"
                                             :style="{'background-image': `url(${item.pic_url})`}"/>
                                        <text>{{item.label}}</text>
                                        <icon v-if="item.value == selectForm.typesetting"
                                              :style="{'background-color': getTheme.background}"
                                               class="icon-active" type></icon>
                                    </view>
                                </template>
                            </block>
                        </view>
                    </view>

                    <view class="dir-left-nowrap line" style="margin-bottom:5rpx">
                        <view class="box-grow-0 main-center cross-center label">
                            <icon :style="{'background-color': getTheme.background}" type></icon>
                            <text>类型</text>
                        </view>
                        <view class="dir-left-wrap box-grow-1" :class="getTheme">
                            <view v-for="(item,key) in typeList" :key="key"
                                  @click="changeType(item.value)"
                                  :style="{'border-color': item.value == selectForm.type ? getTheme.border : ''}"
                                  :class="item.value == selectForm.type ? 'active' : ''"
                                  class="style-input dir-left-nowrap main-center cross-center"
                            >
                                <view v-if="item.value === 1" class="type-pure"></view>
                                <view v-if="item.value === 2" class="type-gradient"></view>
                                <text>{{item.label}}</text>
                                <icon v-if="item.value == selectForm.type"
                                      :style="{'background-color': getTheme.background}"
                                      class="icon-active" type></icon>
                            </view>
                        </view>
                    </view>

                    <view class="dir-left-nowrap line">
                        <view class="box-grow-0 main-center cross-center label" style="margin-top: 19rpx">
                            <icon :style="{'background-color': getTheme.background}" type></icon>
                            <text>颜色</text>
                        </view>
                        <view class="dir-left-wrap box-grow-1">
                            <scroll-view scroll-x class="app-scroll" enable-flex="true">
                                <view v-for="(color,key) in config.color" :key="key"
                                      @click="changeColor(color)"
                                      class="color-bg"
                                      :style="{'background': `${color}`}">
                                    <icon v-if="color == selectForm.color"
                                          :style="{'background-color': getTheme.background}"
                                          class="icon-active" type></icon>
                                </view>
                            </scroll-view>
                        </view>
                    </view>
                    <view @click="submitSave" :style="{'background-color': getTheme.background}" class="button main-center cross-center">保存图片
                    </view>
                </view>
            </view>
        </app-layout>
    </view>
</template>

<script>
import AppGoodsPosterOne from '../../components/page-component/app-goods-poster/app-goods-poster-one.vue';
import AppGoodsPosterTwo from '../../components/page-component/app-goods-poster/app-goods-poster-two.vue';
import AppGoodsPosterThree from '../../components/page-component/app-goods-poster/app-goods-poster-three.vue';
import AppGoodsPosterFour from '../../components/page-component/app-goods-poster/app-goods-poster-four.vue';
import {mapGetters} from "vuex";

export default {
    name: "goods",
    components: {AppGoodsPosterOne, AppGoodsPosterTwo, AppGoodsPosterThree, AppGoodsPosterFour},
    data() {
        return {
            loadShow: false,
            styleList: [{
                label: '样式一',
                value: 1
            }, {
                label: '样式二',
                value: 2
            }, {
                label: '样式三',
                value: 3
            }, {
                label: '样式四',
                value: 4
            }],
            typesettingList: [{
                label: '1张图',
                    value: 1,
                    pic_url: '../../static/image/poster/pic-one.png'
                }, {
                    label: '2张图',
                    value: 2,
                    pic_url: '../../static/image/poster/pic-two.png'
                }, {
                    label: '3张图',
                    value: 3,
                    pic_url: '../../static/image/poster/pic-three.png'
                }, {
                    label: '4张图',
                    value: 4,
                    pic_url: '../../static/image/poster/pic-four.png'
                }, {
                    label: '5张图',
                    value: 5,
                    pic_url: '../../static/image/poster/pic-five.png'
                }],
                typeList: [],
                colorList: [],
                selectForm: null,
                config: {
                    color: [],
                    image_style: [],
                    poster_style: []
                },
                multiple: 0,
                info: null,
                posterConfig: '',
                posterGenerate: ''
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let { poster_config, poster_generate } = options;
            if (poster_config && poster_generate) {
                // #ifdef MP
                this.posterConfig = unescape(poster_config);
                this.posterGenerate = unescape(poster_generate);
                // #endif
                // #ifdef H5
                this.posterConfig = atob(poster_config);
                this.posterGenerate = atob(poster_generate);
                // #endif
            } else {
                return;
            }
            this.$nextTick(function (){
                this.loadData();
            })
        },

        methods: {
            calcMultiple() {
                let query = null;

                // #ifndef MP-WEIXIN
                 query = uni.createSelectorQuery();
                // #endif
                // #ifdef MP-WEIXIN
                 query = uni.createSelectorQuery().in(this);
                // #endif

                query.select('#head').boundingClientRect(item => {

                    // #ifndef  MP-TOUTIAO
                    this.multiple = (item.height * (750 / uni.getSystemInfoSync().screenWidth) - 24 - 24) / 1334;
                    // #endif

                    // #ifdef  MP-TOUTIAO
                    this.multiple = 0.455;
                    // #endif

                }).exec();
            },
            loadData() {
                this.$request({
                    url: this.posterConfig,
                }).then(info => {
                    this.$hideLoading();
                    this.loadShow = true;
                    let { code, data, msg }  = info;
                    if (code === 0) {
                        this.config = data.config;
                        this.info = data.info;
                        this.typeList = [{label: '纯色', value: 1}, {label: '渐变', value: 2}];
                        this.selectForm = {
                            color: this.config['color'][0],
                            style: this.config['poster_style'][0],
                            typesetting: this.config['image_style'][0],
                            type: 1
                        }
                        setTimeout(() => {
                            this.calcMultiple();
                        });
                    } else {
                        uni.showToast({title: msg,icon: 'none'});
                    }
                })
            },
            changeStyle(value) {
                this.selectForm.style = value;
            },
            changeTypeSetting(value) {
                this.selectForm.typesetting = value;
            },
            changeType(value) {
                this.selectForm.type = value;
            },
            changeColor(value) {
                this.selectForm.color = value;
            },
            submitSave() {
                this.$showLoading({text: '生成中'});

                this.$request({
                    url: this.posterGenerate,
                    data: this.selectForm
                }).then(info => {
                    this.$hideLoading();
                    let { code, data, msg } = info;
                    if (code === 0) {
                        const pic_url = data.pic_url;

                        // #ifndef H5
                        if(false){
                            let reg = /(api\/qrcode\/goods-new)+/;
                            if(reg.test(this.posterGenerate)){
                                let url =  this.$api.index.test + '&url=' + btoa(pic_url);
                                this.$utils.batchSave(url);
                                return;
                            }
                        }
                        // #endif

                        this.$utils.batchSave(pic_url, 'image').then(() => {
                            uni.showToast({title: '保存成功'});
                        });
                    } else {
                        uni.showToast({title: msg, icon: 'none'});
                    }
                }).catch(() => {
                    this.$hideLoading();
                })
            }
        },
        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme'
            })
        },
    }
</script>

<style scoped lang="scss">
    $box: #f7f7f7;
    .app-layout /deep/ .app-layout {
        overflow-y: auto;
    }

    ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
    }

    .app-scroll {
        width: 100%;
        white-space: nowrap;
        padding: 0 #{14rpx};
    }

    .poster-goods {
        height: 100vh;

        .head {
            height: #{655rpx};
            width: 100%;
        }

        .setting {
            padding-top: #{20rpx};
            font-size: #{24rpx};
            color: #353535;
            background: #FFFFFF;
            padding-bottom: #{48rpx};

            .line {
                margin-bottom: #{24rpx};

                .label {
                    height: #{56rpx};

                    icon {
                        background-image: url("../../static/image/poster/mark.png");
                        background-size: 100% 100%;
                        height: #{21rpx};
                        width: #{21rpx};
                        background-repeat: no-repeat;
                        margin-left: #{24rpx};
                        border-radius: 50%;
                    }

                    text {
                        line-height: 1;
                        padding-left: #{12rpx};
                        padding-right: #{26rpx - 14rpx};
                    }
                }

                .style-input {
                    position: relative;
                    height: #{56rpx};
                    width: #{120rpx};
                    background: $box;
                    border-radius: #{5rpx};
                    margin: 0 #{14rpx};

                    .type-pure {
                        height: #{32rpx};
                        width: #{32rpx};
                        margin-right: #{10rpx};
                        background: #d8d8d8;
                    }

                    .type-gradient {
                        height: #{32rpx};
                        width: #{32rpx};
                        margin-right: #{10rpx};
                        background: linear-gradient(#d8d8d8, #FFFFFF);
                    }

                }
            }

            .active {
                border-width: #{3rpx};
                border-style: solid;
                background: #FFFFFF !important;
            }

            .icon-active {
                background-image: url("../../static/image/poster/input-active.png");
                height: #{38rpx};
                width: #{38rpx};
                background-repeat: no-repeat;
                background-size: 100% 100%;
                position: absolute;
                top: #{-19rpx};
                right: #{-19rpx};
                z-index: 10;
                border-radius: 50%;
            }

            .line-input {
                position: relative;
                border-radius: #{5rpx};
                margin: 0 #{14rpx} #{14rpx};
                background: $box;
                width: #{140rpx};
                height: #{56rpx};

                .icon-square {
                    background-size: 100% 100%;
                    height: #{32rpx};
                    width: #{32rpx};
                    background-repeat: no-repeat;
                }

                text {
                    margin-left: #{10rpx};
                }
            }

            .color-bg {
                position: relative;
                display: inline-block;
                height: #{60rpx};
                width: #{60rpx};
                border-radius: #{5rpx};
                border: 1px solid #e5e5e5;
                margin-right: #{26rpx};
                margin-top: #{19rpx};
            }
        }

        .button {
            font-size: #{32rpx};
            border-radius: #{40rpx};
            height: #{68rpx};
            margin: #{34rpx} auto 0;
            color: #ffffff;
            width: #{500rpx};
        }
    }
</style>