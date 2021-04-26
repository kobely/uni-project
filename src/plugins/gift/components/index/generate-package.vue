<template>
	<view class="page-width generate-package">
        <view class="price black">{{newPrice}}</view>
        <button  @click="generatePackage" :class="[theme, `button`]">
            生成礼包
        </button>
		<view class="cart-empty"></view>
    </view>
</template>

<script>
    import { push } from '../../../../core/formId.js';

    export default {
        name: 'generate-package',

        props: {
            theme: String,
            totalPrice: String,
            template_message_captain: Array,
        },
        
		computed: {
            newPrice() {
                if (Number(this.totalPrice) === 0) {
                    return '0.00';
                } else {
                    return this.totalPrice;
                }
            }
		},
        methods: {
            // 生成礼包
            generatePackage(data) {
                push(data.detail.formId);
                // 按逻辑来讲支付后当前页面是要被删除的
	            this.$storage.getStorageSync('GIFT_CART');
	            if (this.$storage.getStorageSync('GIFT_CART') && Array.isArray(this.$storage.getStorageSync('GIFT_CART')) && this.$storage.getStorageSync('GIFT_CART').length > 0) {
                    this.$subscribe(this.template_message_captain).then((e) => {
                        this.$emit('click');
                    }).catch((e) => {
                        this.$emit('click');
                    });
	            } else {
                    uni.showToast({
                        mask: true,
                        title: '请选择礼物',
                        icon: 'none'
                    });
	            }
            }
        },
    }
</script>

<style scoped lang="scss">
	@import '../../css/gift.scss';

    .generate-package {
        // 价格
        .price {
            padding: #{50upx 0 26upx 0};
            font-size: #{90upx};
            text-align: center;
            font-family: "DIN";
        }
        // 符号
        .price:before{
            content: "￥";
            font-size: 36%;
            font-family: "DIN";
        }
        /*按钮*/
        .button {
	        height: #{100upx};
            width: #{560upx};
            margin: #{0 95upx};
            font-size: #{32upx};
            text-align: center;
            color: #ffffff;
            border-radius: #{58upx};
            line-height: #{100upx};
	        border: none;
        }
    }
	
	.cart-empty {
	
	}
	
    // 主题色

    /* 流光金 */
    .streamer-gold-gift {
        background: linear-gradient(45deg, $streamer-gold-deep, $streamer-gold-light);
    }

    /* 浪漫粉 */
    .romantic-powder-gift {
        background: linear-gradient(45deg, $romantic-powder-deep, $romantic-powder-light);
    }

    /* 品味红 */
    .taste-red-gift {
        background: linear-gradient(45deg, $taste-red-deep, $taste-red-light);
    }

    /* 优雅紫 */
    .elegant-purple-gift {
        background: linear-gradient(45deg, $elegant-purple-deep, $elegant-purple-light);
    }

    /* 清醒绿 */
    .fresh-green-gift {
        background: linear-gradient(45deg, $fresh-green-deep, $fresh-green-light);
    }

    /* 商务蓝 */
    .business-blue-gift {
        background: linear-gradient(45deg, $business-blue-deep, $business-blue-light);
    }
</style>