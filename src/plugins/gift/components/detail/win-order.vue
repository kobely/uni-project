<template>
    <view class="page-width order">
        <view class="page-width order-content">
            <view class="item dir-left-wrap " v-for="(item, index) in order_list" :key="index">
                <view class="image">
                    <image class="pic" :src="item | getPicUrl"></image>
                    <image class="convert-pic" v-if="item.is_convert == -1" src="../../image/convert.png"></image>
                </view>
                <view class="name-attr-price dir-top-nowrap main-left">
                    <view class="name">{{item.name}}</view>
                    <view class="attr">
                        {{item.attr}}
                    </view>
                    <view class="number-price dir-left-nowrap main-between">
                        <text class="number gray">{{item.num}}</text>
                        <view v-if="item.refund === 1" @click="setSwitch(index)" class="refunding dir-left-nowrap cross-center">
                            <text>
                                申请售后中
                            </text>
                            <image class="icon" :src="item.switch ? '/static/image/icon/icon-up.png' : '/static/image/icon/icon-down.png'"></image>
                        </view>
                    </view>
                    <view class="main-right">
                        <view v-if="item.refund === 0 && item.is_confirm == 1 " class="btn" @click="route_go(`/pages/order/refund/select-refund-type?sign=gift&id=${item.detail_id}`)">
                            申请售后
                        </view>
                    </view>
                </view>
                <view class="refund-content dir-top-nowrap" v-if="item.switch && item.orderRefund">
                    <view class="item">
                        <text class="gray">申请原因： </text>
                        <text class="black">{{item.orderRefund.remark}}</text>
                    </view>
                    <view :class="{'item' : item.orderRefund.pic_list.length > 0}">
                        <text class="gray">审核结果： </text>
                        <text class="black">{{item.orderRefund.status == 1 ? '待商家处理' : item.orderRefund.status == 2 ? '同意' : item.orderRefund.status == 3 ? '拒绝' : ''}}</text>
                    </view>
                    <view class="dir-left-wrap " v-if="item.orderRefund.pic_list.length > 0">
                        <image class="pic_url" @click="previewImage(item.orderRefund.pic_list, pic)" :src="pic" v-for="(pic,i) in item.orderRefund.pic_list" :key="i"></image>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    name: 'win-order',

    props: ['order_list', 'status_num'],

    methods: {
        route_go(data) {
            uni.navigateTo({
                url: data,
            })
        },

        setSwitch(index) {
            this.$emit('setSwitch', index)
        },

        previewImage(pic_list, image) {
            uni.previewImage({
                urls: pic_list,
                current: image,
                longPressActions: {
                    itemList: ['发送给朋友', '保存图片'],
                    success: function() {},
                    fail: function() {}
                }
            });
        }
    },

    filters: {
        getPicUrl(data) {
            let goods_attr = Object.prototype.toString.call(data.goods_info) === '[object String]' ? JSON.parse(data.goods_info).goods_attr : data.goods_info.goods_attr;
            return goods_attr.pic_url ? goods_attr.pic_url : data.cover_pic;
        }
    }
}
</script>
<style scoped lang="scss">
@import "../../css/gift.scss";

.btn {
    height: #{70upx};
    width: #{166upx};
    line-height: #{70upx};
    border-radius: #{38upx};
    font-size: #{26upx};
    color: #353535;
    border: #{1upx} solid #bbbbbb;
    text-align: center;
    margin-top: #{18upx};
    position: relative;
    right: 0;
}

.order {
    padding: #{0 24upx};
    margin-top: #{24upx};

    .order-content {
        background-color: #ffffff;
        padding: #{24upx 24upx 0 24upx};
        overflow: hidden;
    }
}

/*订单*/
.item {
    margin-bottom: #{24upx};

    .image {
        width: #{160upx};
        height: #{160upx};
        position: relative;

        .pic {
            border-radius: #{8upx};
            width: #{160upx};
            height: #{160upx};
        }

        .convert-pic {
            width: #{160upx};
            height: #{160upx};
            position: absolute;
            top: 0;
            left: 0;
        }
    }

    .sign {
        position: absolute;
        top: 0;
        left: 0;
        border-top-left-radius: #{8upx};
        font-size: #{24upx};
        color: #ffffff;
        padding: #{10upx};
    }
}

/*名字价格规格*/
.name-attr-price {
    width: calc(100% - #{160upx});
    padding-left: #{20upx};

    .name {
        font-size: #{24upx};
        line-height: #{30upx};
        height: #{60upx};
        margin-top: #{5upx};
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        white-space: normal !important;
    }

    .attr {
        font-size: #{24upx};
        color: #999999;
        margin-top: #{17upx};
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        white-space: normal !important;
    }

    .number-price {
        font-size: #{24upx};
        line-height: 1;
        margin-top: #{20upx};

        .number:before {
            content: "×";
            font-size: 80%;
        }

        .price:before {
            content: "￥";
        }
    }
}

/*合计*/
.total {
    padding: #{24upx 0};

    /*灰字*/
    .gray-word {
        font-size: #{24upx};
        line-height: 1;
    }

    /*黑字*/
    .black-word {
        font-size: #{28upx};
        line-height: 1;
    }

    .black-word:before {
        content: '￥';
        font-size: 100%;
    }
}

.refund-content {
    width: #{654upx};
    padding: #{24upx};
    border: #{1upx} solid #bbbbbb;
    border-radius: #{15upx};
    margin-top: #{16upx};

    text {
        font-size: #{24upx};
        line-height: 1;
    }
}

.refunding {
    font-size: #{24upx};
    color: #353535;

}

.icon {
    width: #{18upx};
    height: #{11upx};
    margin-left: #{12upx};
}

.item {
    margin-bottom: #{16upx};
}

.pic_url {
    width: #{160upx};
    height: #{160upx};
    margin: #{0 16upx 16upx 0};
}
</style>