<template>
    <view v-if="is_show" class="vip-price dir-left-nowrap" :style="{'margin': `${margin}`}">
        <view class="item vip-left">
            <image class="vip-icon" src="/static/image/icon/S-VIP.png"></image>
        </view>
        <view class="item vip-right">{{discount == 0 ? '免费' :  discount +'折' }}</view>
    </view>
</template>

<script>

	import {mapState} from 'vuex';
	
    export default {
        name: "app-sup-vip",
	    props: {
            discount: {
                type: String,
	            default() {
                    return null;
                }
            },
            is_vip_card_user: {
                type: Number,
                default() {
                    return 0;
                }
            },
            margin: {
                type: String,
	            default() {
                    return '0';
	            }
            }
	    },
        data() {
            return {
                is_show: false,
            }
        },
        created() {
            let that = this;
            if(that.is_vip_card_user == 1) {
                if(that.mall.setting.is_show_super_vip == '1'){
                    that.is_show = true;
                }else {
                    that.is_show = false;
                }
            }else {
                if(that.mall.setting.is_show_normal_vip == '1'){
                    that.is_show = true;
                }else {
                    that.is_show = false;
                }
            }
        },
	    computed: {
            ...mapState({
                mall: state => state.mallConfig.mall,
                userInfo: state => state.user.info,
            })
	    }
    }
</script>

<style scoped lang="scss">
    .vip-price {
        width: #{148upx};
        height: #{27upx};
        .item {
            height: #{27upx};
            width: 50%;
        }
        .vip-left {
            border-top-left-radius: #{13upx};
            border-bottom-left-radius: #{13upx};
            background-color: #4e4040;
            position: relative;
        }
        .vip-right {
            border-top-right-radius: #{13upx};
            border-bottom-right-radius: #{13upx};
            background: linear-gradient(45deg, #edc9a8, #fdebde);
            font-size: #{22upx};
            line-height: #{27upx};
            text-align: center;
            color: #4e4040;
        }
        .vip-icon {
            width: #{51upx};
            height: #{14upx};
            position:absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
</style>