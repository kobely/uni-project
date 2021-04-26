<template>
    <view class="app-order-share-modal dir-left-nowrap main-center cross-center" v-if="show">
        <view class="modal">
            <view class="title">温馨提示</view>
            <view class="content">
                <template v-if="share_setting.become_condition == 1">
                    <view class="mb-24">您单次消费满<text :style="{'color': getTheme.color}">￥{{share_setting.auto_share_val}}</text></view>
                </template>
                <template v-if="share_setting.become_condition == 4">
                    <view class="mb-24">您累计消费满<text :style="{'color': getTheme.color}">￥{{share_setting.total_consume}}</text></view>
                </template>
                <template v-else-if="share_setting.become_condition == 2">
                    <template v-if="share_setting.share_goods_status == 2">
                        <view class="mb-24">您已购买指定商品</view>
                    </template>
                    <template v-else-if="share_setting.share_goods_status == 3">
                        <view class="mb-24">您已购买指定分类商品</view>
                    </template>
                </template>
                <view class="">{{share_setting.become_condition == 3 || share_setting.share_goods_status == 1 ? '您' : ''}}可申请成为{{custom_setting.words.share_name.name ? custom_setting.words.share_name.name : custom_setting.words.share_name.default}}</view>
            </view>
            <view class="footer dir-left-nowrap cross-center">
                <view class="box-grow-1" @click="show=false">取消</view>
                <view class="box-grow-1" :style="{'color': getTheme.color}"
                      @click="$jump({url: '/pages/share/index/index', open_type: 'navigate'})">申请分销商</view>
            </view>
        </view>
    </view>
</template>

<script>
    import {mapState, mapGetters} from "vuex";
    export default {
        name: "app-order-share-modal",
        data() {
            return {
                show: true,
            };
        },
        computed: {
            ...mapState({
                share_setting: state => state.mallConfig.share_setting,
                custom_setting: state => state.mallConfig.share_setting_custom,
            }),
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme'
            })
        }
    }
</script>

<style scoped lang="scss">
    .app-order-share-modal {
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;

        .modal {
            background-color: #ffffff;
            width: #{620rpx};
            border-radius: #{16rpx};
            text-align: center;

            .title {
                margin-top: #{40rpx};
            }

            .content {
                margin: #{62rpx 0};
            }

            .footer {
                border-top: #{1rpx solid #e2e2e2};
                height: #{88rpx};

                view {
                    width: 50%;

                    &:first-child {
                        color: #666666;
                        border-right: #{1rpx solid #e2e2e2};
                    }
                }
            }

            .mb-24 {
                margin-bottom: #{24rpx};
                text {
                    font-size: 40rpx;
                }
            }
        }
    }
</style>