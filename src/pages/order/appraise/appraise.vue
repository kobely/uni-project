<template>
    <app-layout>
        <view v-if="is_show" class='appraise-box'>
            <form class='form-box'>
                <view v-for='item in appraiseData' :key='item.id' class='item-box'>
                    <view class='dir-left-nowrap'>
                        <view class='box-grow-0'>
                            <image class='goods_pic' mode="aspectFill" :src='item.goods_pic_url'></image>
                        </view>
                        <view class='box-grow-1 dir-left-nowrap cross-center'>
                            <text class='box-grow-1 t-omit goods_name'>{{item.goods_name}}</text>
                            <view class="box-grow-0" @click='checkedChange(item)'>
                                <image v-if='item.is_anonymous' class='check-icon'
                                       src='/static/image/icon/order/icon-checkbox-checked.png'></image>
                                <image v-else class='check-icon' src='/static/image/icon/form-er.png'></image>
                            </view>
                            <view @click='checkedChange(item)' class='anonymous-text box-grow-0'>匿名评价</view>
                        </view>
                    </view>

                    <view class='dir-left-nowrap grade-box'>
                        <view @click='grade(gradeItem,item,index)' v-for='(gradeItem, index) in item.grade'
                              :key='gradeItem.id'
                              class='dir-top-nowrap box-grow-1 cross-center main-center grade-item'>
                            <image v-if="gradeItem.id == 1" class='grade-icon'
                                   :src='gradeItem.active ? scoreImg.score_1_active : scoreImg.score_1'></image>
                            <image v-if="gradeItem.id == 2" class='grade-icon'
                                   :src='gradeItem.active ? scoreImg.score_2_active : scoreImg.score_2'></image>
                            <image v-if="gradeItem.id == 3" class='grade-icon'
                                   :src='gradeItem.active ? scoreImg.score_3_active : scoreImg.score_3'></image>
                            <text :style="{'color':gradeItem.active ? gradeItem.text_color : ''}"
                                  class="title"
                                  :class="{'active-title': gradeItem.active ? true : false}">
                                {{gradeItem.title}}
                            </text>
                        </view>
                    </view>
                    <view class='content-box'>
                        <view class='box-grow-1'>
                            <textarea class='content' v-model="item.content" placeholder="请输入评价内容" auto-height></textarea>
                        </view>
                    </view>

                    <view class='image-box'>
                        <app-upload-image
                                :sign='item.id'
                                @imageEvent='imageEvent'
                                :count="6"
                                :maxNum='maxNum'>
                        </app-upload-image>
                    </view>
                </view>
                <button v-if='appraiseData.length' class='btn' @click="formSubmit">提交</button>
            </form>
        </view>
    </app-layout>
</template>

<script>
    import { mapGetters, mapState } from "vuex";
    import AppUploadImage from "../../../components/basic-component/app-upload-image/app-upload-image.vue";

    export default {
        components: {
            'app-upload-image': AppUploadImage,
        },
        data() {
            return {
                id: null,
                maxNum: 6, //最大图片上传数量
                appraiseData: [],
                is_show: false,
            }
        },
        computed: {
            ...mapState({
                scoreImg: state => state.mallConfig.__wxapp_img.mall,
            })
        },
        methods: {
            getOrderDetail() {
                let self = this;
                self.$showLoading();
                self.$request({
                    url: self.$api.order.detail,
                    data: {
                        id: this.id
                    }
                }).then(response => {
                    self.$hideLoading();
                    if (response.code === 0) {
                        let detail = response.data.detail;
                        let appraise = [];
                        detail.detail.forEach(function (item) {
                            appraise.push({
                                id: item.id,
                                goods_pic_url: item.goods_info.pic_url ? item.goods_info.pic_url : item.goods.goodsWarehouse.cover_pic,
                                goods_name: item.goods.goodsWarehouse.name,
                                content: '',
                                pic_list: [],
                                grade: [
                                    {
                                        id: 3,
                                        title: '好评',
                                        active: true,
                                        text_color: '#ff4544'
                                    },
                                    {
                                        id: 2,
                                        title: '中评',
                                        active: false,
                                        text_color: '#ff964a'
                                    },
                                    {
                                        id: 1,
                                        title: '差评',
                                        active: false,
                                        text_color: '#606e78'
                                    },
                                ],
                                grade_level: 3,
                                is_anonymous: false,
                            })
                        });
                        self.appraiseData = appraise;
                        self.is_show = true;
                    } else {
                        uni.showModal({
                            title: '',
                            content: response.msg,
                            showCancel: false,
                        });
                        uni.navigateBack();
                    }
                }).catch(() => {
                    self.$hideLoading();
                });
            },
            // 上传图片
            imageEvent(e) {
                let self = this;
                let sign = e.sign;
                let imageList = e.imageList;
                self.appraiseData.forEach(item => {
                    if (item.id === sign) {
                        item.pic_list = imageList;
                        return false;
                    }
                });
                this.appraiseData = self.appraiseData;
            },
            // 订单评分
            grade(gradeItem, item, index) {
                item.grade.forEach(aItem => {
                    aItem.active = false;
                });
                gradeItem.active = true;
                if (index == 0) {
                    item.grade_level = 3;
                }
                if (index == 1) {
                    item.grade_level = 2;
                }
                if (index == 2) {
                    item.grade_level = 1;
                }
            },
            checkedChange(item) {
                item.is_anonymous = !item.is_anonymous;
            },
            formSubmit() {
                let self = this;
                uni.showLoading({title: '提交中'});
                self.$request({
                    url: self.$api.order.appraise,
                    method: 'post',
                    data: {
                        appraiseData: JSON.stringify(self.appraiseData),
                        order_id: self.id,
                    },
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        uni.redirectTo({
                            url: `/pages/order/appraise-finish/index?id=${self.id}`,
                        });
                    } else {
                        uni.showModal({
                            title: '',
                            content: response.msg,
                            showCancel: false
                        })
                    }
                }).catch(() => {
                    uni.hideLoading();
                });
            },
            // 输入框事件
            inputEvent(value) {
                let self = this;
                let id = value.id;
                let content = value.value;
                self.appraiseData.forEach(item => {
                    if (item.id == id) {
                        item.content = content;
                        return;
                    }
                });
                this.appraiseData = self.appraiseData
            }
        },
        onLoad(options) { this.$commonLoad.onload(options);
            this.id = options.id;
            this.getOrderDetail();
        }
    }
</script>

<style lang="scss" scoped>
    .appraise-box {
        margin: 24#{rpx};
    }

    .form-box .item-box {
        border-radius: 15#{rpx};
        background-color: #ffffff;
        padding: 24#{rpx} 20#{rpx};
        width: 100%;
        margin-bottom: 24#{rpx};
    }

    .form-box .goods_pic {
        width: 100#{rpx};
        height: 100#{rpx};
    }

    .form-box .goods_name {
        margin-left: 16#{rpx};
    }

    .form-box .anonymous-text {
        font-size: $uni-font-size-weak-two;
        color: $uni-general-color-two;
    }

    .form-box .grade-box {
        margin: 32#{rpx} 24#{rpx};
    }

    .form-box .grade-icon {
        width: 68#{rpx};
        height: 68#{rpx};
    }

    .form-box .grade-item {
        height: 100%;
    }

    .form-box .grade-item .title {
        margin-top: 12#{rpx};
    }

    .form-box .grade-item .active-title {
        color: $uni-important-color-red;
    }

    .form-box .content-box {
        background-color: $uni-weak-color-two;
        margin-top: 20#{rpx};
        padding: 24#{rpx} 24#{rpx} 0;
        border-top-left-radius: 5#{rpx};
        border-top-right-radius: 5#{rpx};
    }

    .form-box .content {
        height: 100%;
        width: 100%;
    }

    .form-box .image-box {
        padding: 24#{rpx};
        background-color: $uni-weak-color-two;
        border-bottom-left-radius: 5#{rpx};
        border-bottom-right-radius: 5#{rpx};
    }

    .form-box .btn {
        background-color: $uni-important-color-red;
        border-radius: 40#{rpx};
        color: #fff;
        width: 100%;
        margin-top: 50#{rpx};
    }

    .form-box .check-icon {
        width: 28#{rpx};
        height: 28#{rpx};
        margin-right: 8#{rpx};
        margin-top: 5#{rpx};
    }
</style>