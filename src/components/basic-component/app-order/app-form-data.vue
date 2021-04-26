<template>
    <view class="app-form-data">
        <block v-if="formList && formList.length">
            <slot></slot>
            <view v-for="(row,idx) in formList" :class="['goods-form', `${idx == 0? 'more':''}`]" :key="idx">
                <view v-for="(goods,index) in row" :key="index" v-if="formList.length > 1">
                    <view class="goods">
                        <image class="goods-img" :src='goods.goods_info.goods_attr.pic_url ? goods.goods_info.goods_attr.pic_url : goods.goods_info.goods_attr.cover_pic'></image>
                        <view class='t-omit-two goods-name'>{{goods.goods_info.goods_attr.name}}</view>
                        <view class="goods-attr t-omit" v-if="goods.goods_type === 'goods'">
                            <text v-for="attr in goods.attr_list" :key="item.attr_id">{{attr.attr_group_name}}:{{attr.attr_name}}</text>
                        </view>
                        <view class="goods-num">x{{goods.num}}</view>
                        <view class="goods-price">￥{{goods.total_original_price}}</view>
                    </view>
                </view>
                <view v-for="(item,index) in row[0]['form_data']" v-if="item.value" :key="index" :class="[ `${item.key !== 'img_upload' ? 'dir-left-nowrap' : ''}`,`price-item`]">
                    <view class="price-label">{{item.label}}:</view>
                    <view v-if="item.key === 'img_upload'">
                        <view v-if="Array.isArray(item.value)">
                            <block v-for="(img,key) in item.value" :key="key">
                                <image v-if="img" v-show="!item.loadOver" @load="imageFormLoad(idx,index)" @click='look(img)' class="form-img" :src='img'></image>
                            </block>
                        </view>
                        <view v-else>
                            <image v-if="item.value" v-show="!item.loadOver" @load="imageFormLoad(idx,index)" @click='look(item.value)' class="form-img" :src='item.value'></image>
                        </view>
                    </view>
                    <view style="word-break: break-all" v-else>{{item.value}}</view>
                </view>
            </view>
        </block>
        <view v-if="detail.order_form.length > 0">
            <slot></slot>
            <view v-for="(item,index) in detail.order_form" v-if="item.value" :key="index" :class="[ `${item.key !== 'img_upload' ? 'dir-left-nowrap' : ''}`,`price-item`]">
                <view class="price-label">{{item.label}}:</view>
                <view v-if="item.key === 'img_upload'">
                    <view v-if="Array.isArray(item.value)">
                        <block v-for="(img,key) in item.value" :key="key">
                            <image v-if="img" v-show="!item.loadOver" @load="imageLoad(index)" @click.stop='look(img)' class="form-img" :src='img'></image>
                        </block>
                    </view>
                    <view v-else>
                        <image v-if="item.value" v-show="!item.loadOver" @load="imageLoad(index)" @click.stop='look(item.value)' class="form-img" :src='item.value'></image>
                    </view>
                </view>
                <view style="word-break: break-all" v-else>{{item.value}}</view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            order: {
                type: Object,
            }
        },
        data() {
            return {
                detail: this.order
            }
        },
        computed: {
            formList() {
                const self = this;
                let orderDetail = self.detail.detail;
                let newArr = {};
                let form_ids = [];

                if (orderDetail && orderDetail.length) {
                    for (let goods of orderDetail) {
                        if (goods.form_id == '0') {
                            continue;
                        }
                        if (form_ids.indexOf(goods.form_id) === -1) {
                            form_ids.push(goods.form_id);
                            newArr[goods.form_id] = [goods];
                        } else {
                            newArr[goods.form_id].push(goods);
                        }
                    }
                }
                let list = Object.values(newArr)
                this.$emit('show', list);
                return list;
            }
        },
        watch: {
            order: {
                handler (newValue) {
                    this.detail = newValue
                },
                deep: true
            }
        },
        methods: {
            imageLoad(index) {
                this.order.order_form[index].loadOver = false;
            },
            // 查看图片
            look(e) {
                uni.previewImage({
                    current: e, // 当前显示图片的http链接
                    urls: [e] // 需要预览的图片http链接列表
                })
            },
            imageFormLoad(idx,index) {
                this.order.detail[idx].form_data[index].loadOver = false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .app-form-data {
        .goods-form {
            border-top: #{2rpx solid #e2e2e2};
            margin-top: #{20rpx};
            &.more {
                border-top: 0;
                margin-top: #{10rpx};
            }
        }

        .form-img {
            height: #{120rpx};
            width: #{120rpx};
            margin-right: #{10rpx};
            margin-top: #{10rpx};
        }

        .price-label {
            color: #999;
            margin-right: #{10rpx};
        }
        .price-item {
            margin-bottom: #{10rpx};
            font-size: #{24rpx};
            color: #353535;
        }

        .goods {
            height: #{160rpx};
            margin-top: #{24rpx};
            position: relative;
            font-size: #{24rpx};
            color: #353535;
            margin-bottom: #{24rpx};
            .goods-img {
                height: #{160rpx};
                width: #{160rpx};
                float: left;
                margin-right: #{20rpx};
                border-radius: #{4rpx};
            }
            .goods-attr {
                font-size: #{24rpx};
                color: #999;
                width: 70%;
                position: absolute;
                width: 70%;
                top: #{78rpx};
                left: #{180rpx};
                text {
                    margin-right: #{20rpx};
                }
            }
            .goods-num {
                font-size: #{24rpx};
                color: #999;
                position: absolute;
                top: #{126rpx};
                left: #{180rpx};
            }
            .goods-price {
                font-size: #{24rpx};
                color: #353535;
                position: absolute;
                bottom: 0;
                right: 0;
            }
        }
    }
</style>