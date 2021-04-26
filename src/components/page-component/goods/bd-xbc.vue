<template>
    <view class="bd-xbc" v-if="services.length || param_content.length || (type === 'goods' && goodsStock > 0 && coAttr === 1)">
        <template v-if="type === 'goods' && goodsStock > 0 && coAttr === 1">
            <view class="dir-left-nowrap cross-center bd-attr bd-server" @click="open('attr')">
                <text class="box-grow-0 bd-name">选择</text>
                <view class="box-grow-1 attr u-content u-line-1">
                    {{attrStr}}
                </view>
                <image class="bd-icon" src="/static/image/icon/arrow-right.png"></image>
            </view>
            <view v-if="newAttrGroups.length > 0 && attrCount > 1" class="bd-x dir-left-nowrap cross-center">
                <div class="dir-left-wrap cross-center">
                    <template v-if="pictureList.length > 0">
                        <image class="bd-attr-img" v-for="(picture, index) in pictureList" :key="index" :src="picture"></image>
                    </template>
                    <template v-else>
                        <view v-for="attrItem in newAttrGroups" :key="attrItem.attr_name"
                              class="bd-attr-text bd-attr-count u-line-1">
                            {{attrItem.attr_name}}
                        </view>
                    </template>
                </div>
                <view v-if="attrCount > 0" class="bd-attr-count t-omit">
                    共{{attrCount}}个{{attrName}}可选
                </view>
            </view>
        </template>
        <view v-if="services.length" class="dir-left-nowrap cross-center bd-server" @click.stop="open('service')">
            <text class="box-grow-0 bd-name">保障</text>
            <view class="box-grow-1 u-content u-line-1">
                {{serviceStr}}
            </view>
            <image class="bd-icon" src="/static/image/icon/arrow-right.png"></image>
        </view>
        <view v-if="param_content.length > 0" class="dir-left-nowrap cross-center bd-server" @click.stop="open('param')">
            <text class="box-grow-0 bd-name">参数</text>
            <view class="box-grow-1 u-content u-line-1">
                {{paramStr}}
            </view>
            <image class="bd-icon" src="/static/image/icon/arrow-right.png"></image>
        </view>
        <u-popup v-model="show" mode="bottom" border-radius="14" @close="show = false">
            <view class="model">
                <view class="f-top dir-left-nowrap main-between cross-center">
                    <view class="f-title dir-left-nowrap cross-center u-line-1">
                        <template v-if="isShow === 'service'">
                            <image class="u-top-icon" :src="guaranteePic"></image>
                            <view>
                                {{guaranteeTitle}}
                            </view>
                        </template>
                        <template v-else-if="isShow === 'param'">
                            <view class="p-title">{{ param_name }}</view>
                        </template>
                    </view>
                    <view class="f-image" @click="show = false">
                        <image class="f-img" src="/static/image/icon/icon-close.png"></image>
                    </view>
                </view>
                <scroll-view scroll-y class="f-scroll">
                    <view class="f-scroll-content">
                        <template v-if="isShow === 'service'">
                            <view class="f-item dir-top-nowrap" v-for="(item, index) in services" :key="index">
                                <view class="dir-left-nowrap cross-center">
                                    <image class="u-icon" :src="item.pic"></image>
                                    <view class="u-name">{{item.name}}</view>
                                </view>
                                <text class="u-remark">{{item.remark}}</text>
                            </view>
                        </template>
                        <template v-else-if="isShow === 'param'">
                            <view v-for="(con, index) of param_content" :key="index" class="p-box dir-left-nowrap cross-center">
                                <view class="p-label">{{ con.key }}</view>
                                <view class="p-value">{{ con.value }}</view>
                            </view>
                        </template>
                    </view>
                </scroll-view>
            </view>
        </u-popup>
    </view>
</template>

<script>
    import uPopup from '../../basic-component/u-popup/u-popup.vue';

    export default {
        name: "bd-xbc",
        props: {
            attrGroups: Array,
            services: Array,
            attrList: Array,
            guaranteeTitle: String,
            guaranteePic: String,
            param_content: {
                type: Array,
                default: function() {
                    return [];
                }
            },
            param_name: String,
            type: String,
            goodsStock: Number,
            coAttr: {
                type: [Number, Boolean],
                default: 1
            }
        },
        data() {
            return {
                attrStr: `请选择规格`,
                serviceStr: ``,
                paramStr: ``,
                newAttrGroups: [],
                attrCount: [],
                attrName: '',
                pictureList: [],
                show: false,
                isShow: '',
            }
        },
        watch: {
            attrList: {
                deep: true,
                immediate: true,
                handler: function(newVal) {
                    let str = ``;
                    if (!this.$validation.isEmpty(newVal)) {
                        newVal.forEach(item => {
                            str += `${item.attr_group_name}:${item.attr_name} `;
                        });
                    } else {
                        str = '请选择规格';
                    }
                    this.attrStr = str;
                }
            },
            services: {
                immediate: true,
                handler: function() {
                    let str = ``;
                    if (!this.$validation.isEmpty(this.services)) {
                        this.services.forEach(item => {
                            str += `${item.name} · `;
                        });
                    }
                    str = str.substring(0, str.lastIndexOf(' · ') + 1);
                    this.serviceStr = str;
                }
            },
            attrGroups: {
                immediate: true,
                handler(newVal) {
                    this.newAttrGroups = [];
                    this.pictureList = [];
                    this.attrCount = 0;
                    this.attrName = '';
                    if(newVal && newVal.length > 0) {
                        newVal.forEach((item, index) => {
                            if (!this.attrName) {
                                this.attrName = item.attr_group_name;
                                item.attr_list.forEach( () => {
                                    this.attrCount += 1;
                                });
                            }
                            if (index === 0) {
                                item.attr_list.forEach(item2 => {
                                    if (this.newAttrGroups.length < 3) this.newAttrGroups.push(item2);
                                    if (item2.pic_url && this.pictureList.length < 5) this.pictureList.push(item2.pic_url);
                                });
                            }
                        });
                    }
                }
            },
            param_content: {
                immediate: true,
                handler: function(newVal) {
                    let str = ``;
                    if (!this.$validation.isEmpty(newVal)) {
                        newVal.forEach(item => {
                            str += `${item.key} `;
                        });
                    }
                    str = str.substring(0, str.lastIndexOf(' ') + 1);
                    this.paramStr = str;
                }
            }
        },
        components: {
            uPopup
        },
        methods: {
            open(data) {
                if (data === 'attr') {
                    this.$emit('openAttr');
                } else {
                    this.show = true;
                    this.isShow = data;
                }
            }
        }
    }
</script>

<style scoped>
    .bd-xbc {
        width: 702upx;
        border-radius: 15upx;
        padding: 20upx;
        background-color: #ffffff;
        margin: 24upx 24upx 0 24upx;
    }
    .bd-icon {
        width: 12upx;
        height: 22upx;
        position: absolute;
        right: 0;
    }
    .bd-attr {
        position: relative;
        line-height: 36upx;
    }
    .bd-name {
        margin-right: 26upx;
        color: #999999;
        font-size: 26upx;
    }
    .bd-server {
        position: relative;
        margin-top: 20upx;
        line-height: 36upx;
    }
    .bd-server:first-child {
        margin-top: 0;
    }
    .u-content {
        color: #353535;
        font-size: 26upx;
        padding-right: 20upx;
    }
    .bd-attr-count {
        max-width: 200upx;
        background: #f7f7f7;
        color: #999999;
        height: 51upx;
        line-height: 51upx;
        border-radius: 8upx;
        font-size: 24upx;
        padding: 0 20upx;
    }
    .bd-x {
        margin: 30upx 0 0 100upx;
    }
    .bd-attr-text {
        width: 100upx;
        text-align: center;
        margin-right: 7upx;
    }
    .bd-attr-img {
        width: 54upx;
        height: 54upx;
        margin-right: 7upx;
    }
    .model {
        height: 80vh;
        width: 750upx;
    }
    .f-top {
        height: 105upx;
        background-color: #ffffff;
        position: relative;
        border-radius: 15rpx;
    }
    .f-image {
        width: 78upx;
        height: 78upx;
        padding: 24upx;
        position: absolute;
        right: 0;
    }
    .f-img {
        width: 30upx;
        height: 30upx;
    }
    .f-title {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        max-width: 594upx;
    }
    .f-scroll {
        height: calc(80vh - 105upx);
        width: 100%;
    }
    .f-scroll-content {
        padding: 0 24upx;
    }
    .u-icon {
        width: 24upx;
        height: 24upx;
    }
    .u-name {
        color: #353535;
        font-size: 24upx;
        margin-left: 20upx;
    }
    .u-remark {
        font-size: 24upx;
        color: #999999;
        margin-top: 26upx;
        margin-left: 44upx;
    }
    .f-item {
        margin-bottom: 30upx;
    }
    .u-top-icon {
        width: 28upx;
        height: 28upx;
        margin-right: 10upx;
    }
    .p-title {
        font-size: 28upx;
        line-height: 106upx;
        color: #000000;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
    }
    .p-box {
        padding: 32upx 0;
        font-size: 26upx;
        border-bottom: 1upx solid #e2e2e2;
    }
    .p-box:last-child{
        border-width: 0;
    }
    .p-label {
        width: 120upx;
        min-width: 120upx;
        color: #999999;
        margin-right: calc(36upx);
        word-break: break-word;
    }
    .p-value {
        color: #353535;
        word-break: break-word;
    }
</style>