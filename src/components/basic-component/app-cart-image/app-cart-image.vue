<template>
    <view class="bd-image" :style="cartStyle" :class="cartClass"></view>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "app-cart-image",

        data() {
            return {
                is_loading: false,
				disable: 'disable'
            }
        },

        props: {
            imageWidth: {
                type: String,
                default: '36rpx'
            },
            imageHeight: {
                type: String,
                default: '36rpx'
            },
            src: {
                type: String,
                default: '/static/image/icon/goods-cart.png'
            },
            sign: String,
            theme: String,
			goods: {
				type: Object|null,
				default: null,
			}
        },

        computed: {
            ...mapGetters('mallConfig', {
                getTheme: 'getTheme',
            }),
            cartStyle() {
                let style = `width: ${this.imageWidth};height: ${this.imageHeight};`;
                if((!this.goods || this.goods.buy_goods_auth) && this.sign !== 'gift') {
                    style += `background-color : ${this.getTheme.background}`
                }
                return style;
            },
			cartClass() {
				if (!this.goods || this.goods.buy_goods_auth) {
					return this.sign !== 'gift' ? '' : this.theme + '-background';
				} else {
					return this.disable + '-m-back ' + this.disable;
				}
			}
        },
        methods: {
            imgLoad() {
                this.is_loading = true;
            }
        }

    }
</script>

<style scoped>
.bd-image {
    background-repeat: no-repeat;
    background-size: 101% 101%;
    background-image:url("../../../static/image/icon/goods-cart.png");
}
</style>