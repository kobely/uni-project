<template>
    <app-layout>
        <view class="poster-goods">
            <view id="head" class="head">
                <view class="poster main-center cross-center" :style="cStyle">
                    <view v-if="selectForm" :class="['style-'+ selectForm.style]">
                        <image class="activity-bg" :src="bg"></image>
                        <view class="middleman-tip dir-left-nowrap cross-center">
                            <image class="middleman-avatar" :src="middleman.avatar"></image>
                            <view>我在{{address}}{{middleman.location}}发现了一个超划算的团购！</view>
                        </view>
                        <view class="goods-list" :class="['number-'+ activity.goods_list.length]">
                            <view class="goods" :class="activity.goods_list.length > 2 ? 'dir-left-nowrap' : 'dir-top-nowrap'" v-for="(item,index) in activity.goods_list" :key="index">
                                <image class="goods-cover" :src="item.cover_pic"></image>
                                <view class="goods-info" :class="activity.goods_list.length > 2 ? '' : 'dir-top-nowrap main-center'">
                                    <view class="t-omit-two">{{item.name}}</view>
                                    <view v-if="item.price">
                                        <view class="goods-price">￥{{item.price}}</view>
                                        <view class="goods-original-price">￥{{item.original_price}}</view>
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view class="cross-center activity" :class="selectForm.style == 1 ? 'dir-right-nowrap' : 'dir-left-nowrap'">
                            <view class="activity-qrcode main-center cross-center">
                                <image :src="activity.qrcode"></image>
                            </view>
                            <view class="activity-info">
                                <view class="dir-left-nowrap cross-center">
                                    <view>团长：</view>
                                    <image class="activity-avatar" :src="middleman.avatar"></image>
                                    <view>{{middleman.nickname}}</view>
                                </view>
                                <view class="dir-left-nowrap cross-center">
                                    结束时间：{{activity.end_at}}
                                </view>
                                <view class="dir-left-nowrap cross-center">
                                    提货地址：{{address}}{{middleman.detail}}
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="setting">
                <view class="dir-left-nowrap line">
                    <view class="box-grow-0 main-center cross-center label">
                        <icon :style="{'background-color': getTheme.background}" type></icon>
                        <text>样式</text>
                    </view>
                    <view class="dir-left-wrap box-grow-1">
                        <view v-for="(item,key) in styleList" :key="key"
                              @click="changeStyle(item.value)"
                              v-if="config.activity_poster_style.indexOf(item.value.toString()) !== -1"
                              :style="{'border-color': item.value == selectForm.style ? getTheme.border : ''}"
                              :class="item.value == selectForm.style ? 'active': ''"
                              class="style-input main-center cross-center"
                        >
                            <text>{{item.label}}</text>
                            <icon v-if="item.value == selectForm.style" class="icon-active"
                                  :style="{'background-color': getTheme.background}" type></icon>
                        </view>
                    </view>
                </view>

                <view class="dir-left-nowrap line" style="margin-bottom:5rpx">
                    <view class="box-grow-0 main-center cross-center label">
                        <icon :style="{'background-color': getTheme.background}" type></icon>
                        <text>类型</text>
                    </view>
                    <view class="dir-left-wrap box-grow-1">
                        <view v-for="(item,key) in typeList" :key="key"
                              @click="changeType(item.value)"
                              :style="{'border-color': item.value == selectForm.type ? getTheme.border : ''}"
                              :class="item.value == selectForm.type ? 'active': ''"
                              class="style-input dir-left-nowrap main-center cross-center"
                        >
                            <view v-if="item.value === 1" class="type-pure"></view>
                            <view v-if="item.value === 2" class="type-gradient"></view>
                            <text>{{item.label}}</text>
                            <icon v-if="item.value == selectForm.type" class="icon-active"
                                  :style="{'background-color': getTheme.background}" type></icon>
                        </view>
                    </view>
                </view>

                <view class="dir-left-nowrap line" v-if="selectForm && selectForm.type == 1">
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
                                <icon v-if="color == selectForm.color" class="icon-active"
                                      :style="{'background-color': getTheme.background}" type></icon>
                            </view>
                        </scroll-view>
                    </view>
                </view>
                <view class="button main-center cross-center" @click="submitSave"
                      :style="{'background-color': getTheme.background}">保存图片
                </view>
            </view>
        </view>
    </app-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';

    export default {
        name: "goods",
        data() {
            return {
                styleList: [{
                    label: '样式一',
                    value: 1,
                }, {
                    label: '样式二',
                    value: 2,
                }, {
                    label: '样式三',
                    value: 3,
                }, {
                    label: '样式四',
                    value: 4,
                }],
                bg: '',
                typeList: [],
                selectForm: null,
                config: {
                    color: [],
                    activity_poster_style: [],
                },
                address: '',
                info: {},
                activity: {},
                middleman: {},
                rpx: 1,
                canvas: null,
                canvas2: null,
                ctx: null,
                activity_id: 0,
                middleman_id: 0,
            }
        },
        computed: {
            cStyle() {
                let style = '';
                console.log(uni.getSystemInfoSync().windowHeight)
                if(uni.getSystemInfoSync().windowHeight > 672) {
                    style += `margin: 17% auto;`
                }
                if(this.selectForm && this.selectForm.type == 1) {
                    style += `background-color:${this.selectForm.color};`
                }else if(this.selectForm && this.selectForm.type == 3) {
                    style += `background-image:url(${this.config.image_bg});`
                }
                return style
            },
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            ...mapState({
                community: state => state.mallConfig.__wxapp_img.community,
            })
        },
        onLoad(options) { this.$commonLoad.onload(options);
            let that = this;
            that.$showLoading({text: '加载中'});
            that.activity_id = options.activity_id;
            that.middleman_id = options.middleman_id;
            that.loadData();
        },

        methods: {
            loadData() {
                const self = this;
                self.$request({
                    url: self.$api.community.poster,
                    data: {
                        activity_id: self.activity_id,
                        middleman_id: self.middleman_id
                    }
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        self.config = info.data.config;
                        self.info = info.data.info;
                        self.middleman = info.data.middleman;
                        self.activity = info.data.activity;
                        self.activity.goods_list = self.activity.goods_list.slice(0,6);
                        if(self.activity.goods_list.length == 5) {
                            self.activity.goods_list.push('')
                        }
                        self.address = self.middleman.city+self.middleman.district;
                        if(self.middleman.city != self.middleman.province) {
                            self.address = self.middleman.province + self.address
                        }
                        self.typeList = [{
                            label: '纯色',
                            value: 1,
                        }, {
                            label: '背景图',
                            value: 3,
                        }];
                        self.selectForm = {
                            color: self.config['color'][0],
                            style: self.config['activity_poster_style'][0],
                            type: 3,
                        }
                        switch (self.config['activity_poster_style'][0]) {
                            case '1':
                                self.bg = self.community.style1;
                                break;
                            case '2':
                                self.bg = self.community.style2;
                                break;
                            case '3':
                                self.bg = self.community.style3;
                                break;
                            case '4':
                                self.bg = self.community.style4;
                                break;
                        }
                    } else {
                        uni.showToast({title: info.msg,icon: 'none'});
                    }
                })
            },
            changeStyle(value) {
                let that = this;
                that.selectForm.style = value;
                switch (that.selectForm.style) {
                    case 1:
                        that.bg = that.community.style1;
                        break;
                    case 2:
                        that.bg = that.community.style2;
                        break;
                    case 3:
                        that.bg = that.community.style3;
                        break;
                    case 4:
                        that.bg = that.community.style4;
                        break;
                }
            },
            changeType(value) {
                const self = this;
                self.selectForm.type = value;
            },
            changeColor(value) {
                const self = this;
                self.selectForm.color = value;
            },
            submitSave() {
                this.$showLoading({text: '生成中'});
                let para = this.selectForm;
                para.activity_id = this.activity_id;
                para.middleman_id = this.middleman_id;
                this.$request({
                    url: this.$api.community.poster_share,
                    data: this.selectForm
                }).then(info => {
                    this.$hideLoading();
                    let { code, data, msg } = info;
                    if (code === 0) {
                        const pic_url = data.pic_url;

                        this.$utils.batchSave(pic_url, 'image').then(() => {
                            uni.showToast({title: '保存成功'});
                        });
                    } else {
                        uni.showToast({title: msg, icon: 'none'});
                    }
                }).catch(() => {
                    this.$hideLoading();
                })
            },
        },
    }
</script>

<style scoped lang="scss">
    $box: #f7f7f7;

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
        .head {
            width: 100%;
            .poster {
                margin: #{50rpx} auto;
                width: #{450rpx};
                height: #{800.4rpx};
                background-size: 100% 100%;
                background-position: center;
                background-repeat: no-repeat;
                position: relative;
                .activity-bg {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                }
                .middleman-tip {
                    position: absolute;
                    color: #353535;
                    font-size: #{18rpx};
                    width: #{358.2rpx};
                    margin: 0 auto;
                    .middleman-avatar {
                        flex-shrink: 0;
                        width: #{58.2rpx};
                        height: #{58.2rpx};
                        margin-right: #{12rpx};
                    }
                }
                .goods-list {
                    position: absolute;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    align-items: center;
                    .goods-price {
                        color: #ff4544;
                    }
                    .goods-original-price {
                        color: #999999;
                        text-decoration: line-through;
                    }
                    .goods {
                        height: #{72rpx};
                        flex-shrink: 0;
                        margin: 0 15rpx #{31.2rpx};
                        .goods-cover {
                            height: #{72rpx};
                            width: #{72rpx};
                            margin-right: #{8.4rpx};
                            border-radius: #{4.8rpx};
                        }
                        .goods-info {
                            width: #{99.6rpx};
                            align-content: space-between;
                            font-size: #{14.4rpx};
                            .goods-original-price {
                                font-size: #{12rpx};
                            }
                        }
                    }
                    &.number-1 {
                        margin-top: #{-12rpx};
                        .goods {
                            height: 100%;
                            .goods-cover {
                                width: #{216rpx};
                                height: #{216rpx};
                                margin-right: 0;
                                margin: 0 auto;
                            }
                            .goods-info {
                                width: #{348rpx};
                                text-align: center;
                                margin: #{12rpx} auto;
                                font-size: #{16.8rpx};
                                .goods-price {
                                    margin-top: #{10rpx};
                                }
                                .goods-original-price {
                                    font-size: #{14.4rpx};
                                }
                            }
                        }
                    }
                    &.number-2 {
                        margin-top: #{-2.4rpx};
                        .goods {
                            height: #{270rpx};
                            width: #{174rpx};
                            border: #{2rpx} solid #e2e2e2;
                            border-radius: #{4.8rpx};
                            .goods-cover {
                                width: #{172rpx};
                                height: #{172rpx};
                                margin-right: 0;
                                border-radius: 0;
                            }
                            .goods-info {
                                width: #{153.6rpx};
                                text-align: center;
                                margin: #{10rpx} auto;
                                .goods-price {
                                    margin-top: #{10rpx};
                                }
                            }
                        }
                    }
                    &.number-3 {
                        margin-top: #{-14.4rpx};
                        .goods {
                            height: #{90rpx};
                            margin-bottom: #{19.2rpx};
                            .goods-cover {
                                height: #{90rpx};
                                width: #{90rpx};
                                margin-right: #{14.4rpx};
                            }
                            .goods-info {
                                width: #{270rpx};
                            }
                        }
                    }
                    &.number-4 {
                        margin-top: #{-21.6rpx};
                        .goods {
                            margin-bottom: #{12rpx};
                            .goods-info {
                                width: #{288rpx};
                            }
                        }
                    }
                }
                .activity {
                    position: absolute;
                    .activity-qrcode {
                        width: #{216rpx};
                        height: #{144rpx};
                        image {
                            width: #{144rpx};
                            height: #{144rpx};
                        }
                    }
                    .activity-info {
                        width: #{198rpx};
                        font-size: #{13.2rpx};
                        color: #353535;
                        .activity-avatar {
                            width: #{19.8rpx};
                            height: #{19.8rpx};
                            margin: 0 #{6rpx};
                        }
                    }
                }
                .style-1 {
                    .goods-list {
                        top: #{234rpx};
                        left: 0;
                    }
                    .middleman-tip {
                        top: #{87.6rpx};
                        left: #{46.8rpx};
                    }
                    .activity {
                        bottom: #{66rpx};
                        left: #{38.4rpx};
                    }
                }
                .style-2 {
                    .goods-list {
                        top: #{114rpx};
                        left: 0;
                    }
                    .middleman-tip {
                        bottom: #{255rpx};
                        left: #{48rpx};
                    }
                    .activity {
                        bottom: #{90rpx};
                        left: 0;
                    }
                }
                .style-3 {
                    .goods-list {
                        top: #{186rpx};
                        left: 0;
                    }
                    .middleman-tip {
                        top: #{98.4rpx};
                        left: #{48rpx};
                    }
                    .activity {
                        bottom: #{54rpx};
                        left: 0;
                    }
                }
                .style-4 {
                    .goods-list {
                        top: #{290.4rpx};
                        left: 0;
                    }
                    .middleman-tip {
                        top: #{68.4rpx};
                        left: #{33.6rpx};
                        .middleman-avatar {
                            margin-right: #{24rpx};
                        }
                    }
                    .activity {
                        bottom: #{54rpx};
                        left: 0;
                    }
                }
            }
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
                        background-image: url("../../../static/image/poster/mark.png");
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
                    padding: 0 #{20rpx};
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
                        background-image: url("./../image/icon.png");
                        background-size: 100% 100%;
                    }

                }
            }

            .active {
                border-width: #{3rpx};
                border-style: solid;
                background: #FFFFFF !important;
            }

            .icon-active {
                background-image: url("../../../static/image/poster/input-active.png");
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