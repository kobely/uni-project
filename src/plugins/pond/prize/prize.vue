<template>
    <app-layout>
        <view v-if="!list || !list.length" class="no-content">暂无中奖记录</view>
        <block v-for="(v,k) in list" :key="k">
            <view class="dir-left-nowrap line cross-center">
                <view class="dir-top-nowrap box-grow-1 main-center">
                    <view class="name t-omit" v-text="v.name"></view>
                    <view class="time" v-text="v.created_at"></view>
                </view>
                <view class="box-grow-0">
                    <app-button @click="submit(v)" v-if="v.status == 0 && v.type == 4" background="#FFFFFF" height="56" width="170" color="#FF4544" font-size="27" round>立即兑换</app-button>
                    <app-button v-if="v.status == 1 && v.type == 4" background="#CDCDCD" height="56" width="170" color="#FFFFFF" font-size="27" disabled round>已兑换</app-button>
                    <app-button v-if="v.status == 1 && v.type != 4" background="#CDCDCD" height="56" width="170" color="#FFFFFF" font-size="27" disabled round>已发放</app-button>
                </view>
            </view>
        </block>
    </app-layout>
</template>

<script>
    export default {
        name: "prize",
        components: {},
        data() {
            return {
                list: null,
                page: 1,
                args: false,
                load: false,
            }
        },
        onShow: function () {
            const self = this;
            self.$showLoading({title: '加载中'});
            self.$request({
                url: self.$api.pond.prize,
                data: {
                    page: 1,
                }
            }).then(info => {
                self.$hideLoading();
                if (info.code === 0) {
                    self.list = info.data.list;
                }
            }).catch(e => {
                self.$hideLoading();
            });
        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {
            const self = this;
            if (self.args || self.load)
                return;
            self.load = true;
            let page = self.page + 1;
            self.$request({
                url: self.$api.pond.prize,
                data: {
                    page: page,
                }
            }).then(info => {
                if (info.code === 0) {
                    [self.page, self.args, self.list] = [page, info.data.list.length === 0, self.list.concat(info.data.list)];
                }
                self.load = false;
            });
        },
        methods: {
            submit: function (list) {
                const mchList = [{
                    "mch_id": 0,
                    "pond_id": list.id,
                    "goods_list": [{
                        "id": list.goods.id,
                        "attr": list.attr_list,
                        "num": 1,
                        "cart_id": 0,
                        "goods_attr_id": list.attr_id
                    }]
                }];

                uni.navigateTo({
                    url: `/pages/order-submit/order-submit?mch_list=` +
                        JSON.stringify(mchList) +
                        `&preview_url=` + encodeURIComponent(this.$api.pond.order_preview) +
                        `&submit_url=` + encodeURIComponent(this.$api.pond.order_submit)
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    .no-content {
        color: #888;
        padding-top: #{100rpx};
        text-align: center;
    }

    .line {
        height: #{140rpx};
        padding: 0 #{24rpx};
        border-bottom: 1px solid $uni-weak-color-one;
        background: #FFFFFF;

        .name {
            font-size: #{28rpx};
            color: #353535;
            margin-right: #{80rpx};
        }

        .time {
            margin-top: #{22rpx};
            font-size: #{24rpx};
            color: #666666;
        }
    }
</style>