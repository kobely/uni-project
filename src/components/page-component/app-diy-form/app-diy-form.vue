<template>
    <view class="app-diy-form" :style="{
        paddingTop: `${marginTop}rpx`,
        paddingBottom: `${marginBottom}rpx`,
        backgroundColor: `${marginColor}`
    }">
        <view class="title" v-if="title !== '' && title !== null">{{title}}</view>
        <!--<view style="border: 1rpx solid #ff3455">
            <view v-for="(item, index) in myList" :key="index">{{item.name}}:{{item.value}}</view>
        </view>-->
        <view :style="{
            backgroundColor: backgroundColor,
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : `none`,
            backgroundPosition: backgroundPosition,
            backgroundSize: `${backgroundWidth}% ${backgroundHeight}%`,
            backgroundRepeat: backgroundRepeat,
            paddingTop: `${paddingTop}rpx`,
            paddingBottom: `${paddingBottom}rpx`,
        }">
            <view class="list"
                  :class="[showItemBorder?'item-border':'', showAllItems?'show-all':'show-first',labelFs28?'label-fs-28':'']">
                <template v-for="(item, index) in myList">

                    <view :key="index" v-if="item.key=='text'"
                          class="item"
                          :class="[itemClass, index===0 ? `is-first-item` : ``,]"
                          :style="{
                      'padding': `0 ${itemPaddingX}rpx`,
                      'margin-bottom': `${itemMarginY}rpx`,
                      }">
                        <view v-if="labelPosition !== 'inset'" class="box-grow-0 cross-top label">
                            <image v-if="showRequiredIcon && (item.is_required == 1 || item.is_required == '1')"
                                   class="required-icon"
                                   src="/static/image/icon/required.png"></image>
                            <view class="name-key"
                                  :class="[`text-align-${labelTextAlign}`]"
                                  :style="{
                                  'color': labelColor
                                  }">{{item.name}}
                            </view>
                        </view>
                        <view class="box-grow-1">
                            <app-input v-model="item.value"
                                       :default-value="item.value"
                                       :background-color="inputBackground"
                                       @input="textInput"
                                       :color="inputTextColor"
                                       :placeholder="labelPosition === 'inset' ? item.name:item.hint"
                                       :height="`${itemHeight}`"
                                       :border="showInputBorder"
                                       :radius="inputRadius"
                                       :placeholder-style="`color:${inputPlaceholderColor}`"
                                       :padding-left="getInputPaddingLeft"
                                       :border-color="inputBorderColor"></app-input>
                        </view>
                    </view>

                    <view :key="index" v-if="item.key=='textarea'"
                          class="item"
                          :class="[itemClass, index===0 ? `is-first-item` : ``,]"
                          :style="{
                      'padding': `0 ${itemPaddingX}rpx`,
                      'margin-bottom': `${itemMarginY}rpx`,
                      }">
                        <view v-if="labelPosition !== 'inset'" class="box-grow-0 cross-top label">
                            <image v-if="showRequiredIcon && (item.is_required == 1 || item.is_required == '1')"
                                   class="required-icon"
                                   src="/static/image/icon/required.png"></image>
                            <view class="name-key"
                                  :class="[`text-align-${labelTextAlign}`]"
                                  :style="{
                                  'color': labelColor
                                  }">{{item.name}}
                            </view>
                        </view>
                        <view class="box-grow-1">
                            <app-textarea v-model="item.value"
                                          :default-value="item.value"
                                          :background="inputBackground"
                                          @input="textInput"
                                          :color="inputTextColor"
                                          :placeholder="labelPosition === 'inset' ? item.name:item.hint"
                                          :show-border="showInputBorder"
                                          :border-radius="inputRadius"
                                          :padding-x="getInputPaddingLeft"
                                          :placeholder-style="[`color:${inputPlaceholderColor}`]"
                                          :border-color="inputBorderColor"></app-textarea>
                        </view>
                    </view>

                    <view :key="index" v-if="item.key=='date'"
                          class="item"
                          :class="[itemClass, index===0 ? `is-first-item` : ``,]"
                          :style="{
                      'padding': `0 ${itemPaddingX}rpx`,
                      'margin-bottom': `${itemMarginY}rpx`,
                      }">
                        <view class="box-grow-0 cross-top label">
                            <image v-if="showRequiredIcon && (item.is_required == 1 || item.is_required == '1')"
                                   class="required-icon"
                                   src="/static/image/icon/required.png"></image>
                            <view class="name-key"
                                  :class="[`text-align-${labelTextAlign}`]"
                                  :style="{
                                  'color': labelColor
                                  }">{{item.name}}
                            </view>
                        </view>
                        <view class="box-grow-1">
                            <app-datetime-picker v-model="item.value"
                                                 @change="datetimeChange"
                                                 :text="item.value||''"
                                                 :sign="index"
                                                 :show-border="showInputBorder"
                                                 :background="inputBackground"
                                                 :height="itemHeight"
                                                 :radius="inputRadius"
                                                 :default-value="item.default"
                                                 :text-color="inputTextColor"
                                                 :text-position="getDateTimeTextPosition"
                                                 :border-color="inputBorderColor"
                                                 :start="item.min ? item.min : ''"
                                                 :padding="datePadding"
                                                 :end="item.max ? item.max : ''">
                                <!-- #ifdef MP-TOUTIAO -->
                                {{item.value||''}}
                                <!-- #endif -->
                            </app-datetime-picker>
                        </view>
                    </view>

                    <view :key="index" v-if="item.key=='time'"
                          class="item"
                          :class="[itemClass, index===0 ? `is-first-item` : ``,]"
                          :style="{
                      'padding': `0 ${itemPaddingX}rpx`,
                      'margin-bottom': `${itemMarginY}rpx`,
                      }">
                        <view class="box-grow-0 cross-top label">
                            <image v-if="showRequiredIcon && (item.is_required == 1 || item.is_required == '1')"
                                   class="required-icon"
                                   src="/static/image/icon/required.png"></image>
                            <view class="name-key"
                                  :class="[`text-align-${labelTextAlign}`]"
                                  :style="{
                                  'color': labelColor
                                  }">{{item.name}}
                            </view>
                        </view>
                        <view class="box-grow-1">
                            <app-datetime-picker v-model="item.value"
                                                 @change="datetimeChange"
                                                 mode="time"
                                                 :text="item.value||''"
                                                 :sign="index"
                                                 :default-value="item.default"
                                                 :show-border="showInputBorder"
                                                 :background="inputBackground"
                                                 :height="itemHeight"
                                                 :radius="inputRadius"
                                                 :text-color="inputTextColor"
                                                 :text-position="getDateTimeTextPosition"
                                                 :border-color="inputBorderColor"
                                                 :start="item.min ? item.min : ''"
                                                 :end="item.max ? item.max : ''">
                                <!-- #ifdef MP-TOUTIAO -->
                                {{item.value||''}}
                                <!-- #endif -->
                            </app-datetime-picker>
                        </view>
                    </view>

                    <view :key="index" v-if="item.key=='radio'"
                          class="item"
                          :class="[itemClass, index===0 ? `is-first-item` : ``,]"
                          :style="{
                      'padding': `0 ${itemPaddingX}rpx`,
                      'margin-bottom': `${itemMarginY}rpx`,
                      }">
                        <view class="box-grow-0 cross-top label">
                            <image v-if="showRequiredIcon && (item.is_required == 1 || item.is_required == '1')"
                                   class="required-icon"
                                   src="/static/image/icon/required.png"></image>
                            <view class="name-key"
                                  :class="[`text-align-${labelTextAlign}`]"
                                  :style="{
                                  'color': labelColor
                                  }">{{item.name}}
                            </view>
                        </view>
                        <view class="box-grow-1" :style="{
                        padding: labelPosition === 'top' ? `0 0` : `0 12rpx`,
                        }">
                            <app-radio-group :list="item.list" v-model="item.value"
                                             :color="selectBoxColor"
                                             type="round"
                                             :height="74"
                                             @change="checkChange"></app-radio-group>
                        </view>
                    </view>

                    <view :key="index" v-if="item.key=='checkbox'"
                          class="item"
                          :class="[itemClass, index===0 ? `is-first-item` : ``,]"
                          :style="{
                      'padding': `0 ${itemPaddingX}rpx`,
                      'margin-bottom': `${itemMarginY}rpx`,
                      }">
                        <view class="box-grow-0 cross-top label">
                            <image v-if="showRequiredIcon && (item.is_required == 1 || item.is_required == '1')"
                                   class="required-icon"
                                   src="/static/image/icon/required.png"></image>
                            <view class="name-key"
                                  :class="[`text-align-${labelTextAlign}`]"
                                  :style="{
                                  'color': labelColor
                                  }">{{item.name}}
                            </view>
                        </view>
                        <view class="box-grow-1 dir-left-wrap" :style="{
                        padding: labelPosition === 'top' ? `0 0` : `0 12rpx`,
                        }">
                            <app-diy-form-checkbox-group :list="item.list"
                                                         v-model="item.value"
                                                         :color="selectBoxColor"
                                                         @change="checkChange"></app-diy-form-checkbox-group>
                        </view>
                    </view>

                    <view :key="index" v-if="item.key=='img_upload'"
                          class="item"
                          :class="[itemClass, index===0 ? `is-first-item` : ``,]"
                          :style="{
                      'padding': `0 ${itemPaddingX}rpx`,
                      'margin-bottom': `${itemMarginY}rpx`,
                      }">
                        <view class="box-grow-0 cross-top label">
                            <image v-if="showRequiredIcon && (item.is_required == 1 || item.is_required == '1')"
                                   class="required-icon"
                                   src="/static/image/icon/required.png"></image>
                            <view class="name-key"
                                  :class="[`text-align-${labelTextAlign}`]"
                                  :style="{
                                  'color': labelColor
                                  }">{{item.name}}
                            </view>
                        </view>
                        <view class="box-grow-1 dir-left-wrap" :style="{
                        padding: labelPosition === 'top' ? `12rpx 0` : `12rpx 12rpx`,
                        }">
                            <!-- 普通图片 -->
                            <template v-if="item.img_type == 1">
                                <app-upload-image
                                        :value="uploadShowImage(item)"
                                        :max-num="item.num ? item.num:1"
                                        @imageEvent="handleImageUpload"
                                        :sign="`${index}`"
                                        :show-number="false"
                                ></app-upload-image>
                            </template>

                            <!-- 身份证，正反面 -->
                            <template v-if="item.img_type == 2">
                                <app-upload-image
                                        :value="(item.value && item.value[0])?[item.value[0]]:null"
                                        style="margin-right: 12rpx"
                                        :max-num="1"
                                        @imageEvent="handleUserIdFrontUpload"
                                        :sign="`${index}`"
                                        text="身份证正面"
                                        :show-number="false"
                                        default-img="/static/image/user-id-card-front.png"></app-upload-image>
                                <app-upload-image
                                        :value="(item.value && item.value[1])?[item.value[1]]:null"
                                        :max-num="1"
                                        @imageEvent="handleUserIdBackUpload"
                                        :sign="`${index}`"
                                        text="身份证反面"
                                        :show-number="false"
                                        default-img="/static/image/user-id-card-back.png"></app-upload-image>
                            </template>

                            <!-- 营业执照 -->
                            <template v-if="item.img_type == 3">
                                <app-upload-image
                                        :value="item.value?[item.value]:null"
                                        :max-num="1"
                                        @imageEvent="handleImageUpload"
                                        :sign="`${index}`"
                                        text="营业执照"
                                        :show-number="false"
                                        default-img="/static/image/company-license.png"></app-upload-image>
                            </template>
                        </view>
                    </view>

                </template>
            </view>

            <view class="main-center cross-center scroll-bar" v-if="showScrollBtn"
                  @click="showAllItems = !showAllItems">
                <view class="cross-center">点击{{showAllItems?'收起':'展开'}}</view>
                <view class="cross-center">
                    <image v-if="showAllItems" src="/static/image/icon/icon-up.png"
                           style="width: 18rpx;height: 10rpx;"></image>
                    <image v-else src="/static/image/icon/icon-down.png"
                           style="width: 18rpx;height: 10rpx;"></image>
                </view>
            </view>

            <view v-if="showSubmit" class="submit" :style="{
                'padding': `${submitBtnMargin}rpx ${submitBtnPadding}rpx 24rpx`,
                }">
                <app-form-id @click="submit">
                    <view class="submit-button" :style="{
                'background-color': submitBtnBackground,
                'border-color': submitBtnBorderColor,
                'color': submitBtnTextColor,
                'border-radius': `${submitBtnRadius}rpx`,
                'height': `${submitBtnHeight}rpx`,
                'line-height': `${submitBtnHeight-2}rpx`,
                }">{{submitBtnText}}
                    </view>
                </app-form-id>
            </view>

        </view>

    </view>
</template>

<script>
    import AppDatetimePicker from '../../basic-component/app-datetime-picker/app-datetime-picker.vue';
    import AppRadio from "../../basic-component/app-radio/app-radio";
    import AppRadioGroup from "../../basic-component/app-radio/app-radio-group";
    import AppDiyFormCheckboxGroup from "./app-diy-form-checkbox-group";
    import AppUploadImage from "../../basic-component/app-upload-image/app-upload-image";
    import AppTextarea from "../../basic-component/app-textarea/app-textarea";

    export default {
        name: 'app-diy-form',
        components: {AppTextarea, AppUploadImage, AppDiyFormCheckboxGroup, AppRadioGroup, AppRadio, AppDatetimePicker},
        props: {
            sign: {
                default: null,
            },
            datePadding: {
                type: String,
                default: '0 24rpx',
            },
            title: {
                type: String,
                default: null,
            },
            backgroundColor: {
                default: '#ffffff',
            },
            backgroundImage: {
                default: null,
            },
            backgroundPosition: {
                default: 'center',
            },
            backgroundWidth: {
                default: 100,
            },
            backgroundHeight: {
                default: 100,
            },
            backgroundRepeat: {
                default: 'no-repeat',
            },
            marginTop: {
                default: 0,
            },
            marginBottom: {
                default: 0,
            },
            paddingTop: {
                default: 0,
            },
            paddingBottom: {
                default: 0,
            },
            list: {
                type: Array,
                default: [],
            },
            showRequiredIcon: {
                type: Boolean,
                default: false,
            },
            itemPaddingX: {
                default: 24,
            },
            itemMarginY: {
                default: 0,
            },
            itemHeight: {
                type: Number,
                default: 88,
            },
            showItemBorder: {
                default: true,
            },
            labelPosition: {
                default: 'left',
            },
            labelColor: {
                default: '#666666',
            },
            labelTextAlign: {
                default: 'right',
            },
            showInputBorder: {
                type: Boolean,
                default: false,
            },
            inputBackground: {
                default: '#ffffff',
            },
            inputBorderColor: {
                default: '#c0c4cc',
            },
            inputTextColor: {
                default: '#666666',
            },
            inputPlaceholderColor: {
                default: '#bbbbbb',
            },
            inputRadius: {
                default: 0,
            },

            showSubmit: {
                type: Boolean,
                default: false,
            },
            submitUrl: {
                type: String,
                default: null,
            },
            submitBtnText: {
                default: '提交',
            },
            submitBtnHeight: {
                default: 80,
            },
            submitBtnPadding: {
                default: 24,
            },
            submitBtnMargin: {
                default: 40,
            },
            submitBtnRadius: {
                default: 40,
            },
            submitBtnBackground: {
                default: '#ff4544',
            },
            submitBtnBorderColor: {
                default: '#ff4544',
            },
            submitBtnTextColor: {
                default: '#ffffff',
            },
            showScrollBtn: {
                default: false,
            },
            labelFs28: {
                default: false,
            },
            marginColor: {
                default: '#ffffff',
            },
            selectBoxColor: {
                default: '#ff4544',
            },
        },
        data() {
            const newList = [];
            for (let i in this.list) {
                const item = this.list[i];
                // if (typeof item.default === 'undefined') {
                //     item.default = null;
                // }
                if (typeof item.default === 'undefined' || item.default === null || item.default === '') {
                    if (item.key === 'text' || item.key === 'textarea' || item.key === 'time' || item.key === 'date') {
                        item.default = '';
                    }
                    if (item.key === 'radio' || item.key === 'checkbox') {
                        item.default = [];
                    }
                }
                if (typeof item.value === 'undefined' || item.value === null || item.value === '') {
                    item.value = item.default;
                }
                item.hint = item.hint || '';
                if (item.key === 'radio' || item.key === 'checkbox') {
                    if (!item.list) item.list = [];
                    for (let j in item.list) {
                        if (!item.list[j].value || item.list[j].value === false || item.list[j].value === 'false') {
                            item.list[j].value = false;
                        } else {
                            item.list[j].value = true;
                        }
                    }
                }
                if (item.key === 'img_upload' && (item.img_type === 2 || item.img_type === '2') && !item.value) {
                    item.value = ['', ''];
                }
                if(item.key == 'text') {
                }
                newList[i] = item;
            }
            return {
                myList: newList,
                randomString: '',
                validateResult: {
                    hasError: false,
                    errors: [],
                },
                showAllItems: true, //默认展开全部
            };
        },
        computed: {
            uploadShowImage() {
                return function (item) {
                    if (Array.isArray(item.value)) {
                        return item.value;
                    }
                    if (item.value) {
                        return [item.value];
                    }
                    return null;
                }
            },
            itemClass() {
                if (this.labelPosition === 'left') {
                    return 'label-left dir-left-nowrap cross-top';
                }
                if (this.labelPosition === 'inset') {
                    return 'label-inset dir-left-nowrap cross-top';
                }
                if (this.labelPosition === 'top') {
                    return 'label-top';
                }
            },
            getDateTimeTextPosition() {
                if (this.labelPosition === 'top') {
                    return 'left';
                }
                return 'right';
            },
            getInputPaddingLeft() {
                if (this.labelPosition === 'top') {
                    if (this.showInputBorder) {
                        return 24;
                    } else {
                        return 0;
                    }
                }
                return 24;
            },
        },
        created() {
            this.validate();
            this.outputData();
        },
        methods: {
            textInput() {
                this.outputData();
                // #ifdef H5
                this.$forceUpdate()
                // #endif
            },
            datetimeChange() {
                this.outputData();
                // #ifdef H5
                this.$forceUpdate()
                // #endif
            },
            checkChange() {
                setTimeout(() => {
                    this.outputData();
                }, 10);
            },
            handleImageUpload({sign, imageList}) {
                const index = parseInt(sign);
                if (imageList.length === 1) {
                    this.myList[index].value = imageList[0];
                } else if (imageList.length > 0) {
                    this.myList[index].value = imageList;
                } else {
                    this.myList[index].value = '';
                }
                this.outputData();
            },
            handleUserIdFrontUpload({sign, imageList}) {
                const index = parseInt(sign);
                if (imageList.length > 0) {
                    this.myList[index].value[0] = imageList[0];
                } else {
                    this.myList[index].value[0] = '';
                }
                this.outputData();
            },
            handleUserIdBackUpload({sign, imageList}) {
                const index = parseInt(sign);
                if (imageList.length > 0) {
                    this.myList[index].value[1] = imageList[0];
                } else {
                    this.myList[index].value[1] = '';
                }
                this.outputData();
            },
            validate() {
                this.validateResult = {
                    hasError: false,
                    errors: [],
                };
                for (let i in this.myList) {
                    const item = this.myList[i];
                    if (item.is_required === 1 || item.is_required === '1') {
                        if ((typeof item.value === 'undefined'
                            || item.value === null
                            || item.value === ''
                            || ['radio', 'checkbox'].indexOf(item.key) !== -1 && !item.value.length)
                        ) {
                            this.validateResult.hasError = true;
                            this.validateResult.errors.push({
                                index: i,
                                msg: `"${item.name}"不能为空。`,
                            });
                            continue;
                        }
                        if (item.img_type && parseInt(item.img_type) === 2) {
                            if (!item.value || !item.value.length) {
                                this.validateResult.hasError = true;
                                this.validateResult.errors.push({
                                    index: i,
                                    msg: `"${item.name}"不能为空。`,
                                });
                                continue;
                            }
                            let imgErr = false;
                            for (let j in item.value) {
                                if (item.value[j] === null || item.value[j] === '') {
                                    imgErr = true;
                                    break;
                                }
                            }
                            if (imgErr) {
                                this.validateResult.hasError = true;
                                this.validateResult.errors.push({
                                    index: i,
                                    msg: `"${item.name}"不能为空。`,
                                });
                                continue;
                            }
                        }
                    }
                }
                this.$emit('validate',{
                    result: this.validateResult,
                    sign: this.sign
                });
            },
            outputData() {
                this.validate();
                for (let i in this.myList) {
                    this.myList[i].label = this.myList[i].name;
                    this.myList[i].required = this.myList[i].is_required;
                }
                this.$emit('input',{
                    data: this.myList,
                    sign: this.sign
                });
                // #ifdef MP-TOUTIAO
                setTimeout(() => {
                    this.randomString = this.$utils.randomString(32);
                }, 1);
                // #endif
            },
            submit() {
                this.outputData();
                if (this.validateResult.hasError && this.validateResult.errors) {
                    uni.showModal({
                        title: '提示',
                        content: this.validateResult.errors[0].msg,
                        showCancel: false,
                    });
                    return;
                }
                uni.showLoading({
                    mask: true,
                    title: '正在提交...',
                });
                this.$request({
                    url: this.submitUrl ? this.submitUrl : this.$api.diy.page_store,
                    method: 'post',
                    data: {
                        form_data: JSON.stringify(this.myList),
                    },
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        setTimeout(() => {
                            let copyList = this.myList;
                            for (let i in copyList) {
                                copyList[i].value = copyList[i].default;
                                if((copyList[i].key === 'radio' || copyList[i].key === 'checkbox') && (copyList[i].list && copyList[i].list.length > 0)) {
                                    for(let item of copyList[i].list) {
                                        item.value = false;
                                    }
                                }
                            }
                            this.myList = [];
                            setTimeout(() => {
                                this.myList = copyList;
                            }, 0);
                        }, 300);
                        uni.showModal({
                            title: '提示',
                            content: response.msg || '提交成功',
                            showCancel: false,
                        });
                    } else {
                        uni.showModal({
                            title: '提示',
                            content: response.msg || '提交失败',
                            showCancel: false,
                        });
                    }
                }).catch(() => {
                    uni.hideLoading();
                });
            },
        },
    }
</script>

<style scoped lang="scss">
    .name-key {
        width: 100%;
        text-align: right;
        font-size: #{32rpx};
        color: #353535
    }

    .name-key.text-align-left {
        text-align: left;
    }

    .name-key.text-align-right {
        text-align: right;
    }

    .title {
        padding: #{24rpx};
        color: #999;
        font-size: #{26rpx};
    }

    .arrow {
        width: #{12rpx};
        height: #{22rpx};
    }

    .scroll-bar {
        border-top: #{1rpx} solid $uni-weak-color-one;
        height: #{72rpx};
        color: $uni-general-color-two;

        image {
            margin-left: #{16rpx};
        }
    }

    .list {
        .item {
            height: 0 !important;
            overflow: hidden;

            .label {
                min-width: #{125rpx};
                padding: #{24rpx} #{12rpx} #{12rpx} 0;
                height: 100%;
                position: relative;
            }

            .required-icon {
                width: #{15rpx};
                height: #{15rpx};
                display: inline-block;
                position: absolute;
                left: #{-14rpx};
                top: #{23rpx};
            }
        }

        .item.is-first-item {
            height: auto !important;
            overflow: auto;
        }

        .item.label-left {
            .name-key {
                max-width: #{200rpx};
            }
        }

        .item.label-top {
            .name-key {
                text-align: left;
            }

            .label {
                padding: #{20rpx} #{12rpx} #{8rpx} 0;
            }
        }

        .item:last-child {
            margin-bottom: 0 !important;
        }
    }

    .show-all {
        .item {
            height: auto !important;
            overflow: auto;
        }
    }

    .show-first {
        .item {
            margin-bottom: 0 !important;
            border: none !important;
        }
    }

    .item-border {
        .item {
            border-bottom: #{2rpx} solid $uni-weak-color-one;
        }

        .item:last-child {
            border-bottom: none;
        }
    }

    .submit-button {
        text-align: center;
        border: #{1rpx} solid;
    }

    .submit-button:active {
        box-shadow: inset 0 0 #{1000rpx} rgba(0, 0, 0, .15);
    }

    .label-fs-28 {
        .name-key {
            font-size: #{28rpx};
        }
    }
</style>
