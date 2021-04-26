<template>
	<view class="app-add-subtract dir-left-nowrap cross-center">
		<image class="app-icon" @click.stop="_calcValue('minus')"
			   :src="inputValue <= min ? background == '#ffffff' ? '/static/image/cart/unreducible.png' : '/static/image/cart/unreducible-gray.png' : '/static/image/icon/subtract.png'"
			  ></image>
<!--		<view class="app-value">-->
			<input width="88rpx" height="60rpx" v-model="inputValue" class="text" @blur.stop="_onBlur" type="number" :style="{'background-color':background}">
<!--		</view>-->
		<image class="app-icon" v-show="is_loading" @load="imgLoad"  @click.stop="_calcValue('plus')"
			   :src="inputValue >= stock ? background == '#ffffff' ? '/static/image/cart/can-add.png' : '/static/image/cart/can-add-gray.png' : background == '#ffffff' ? '/static/image/icon/add-but.png':'/static/image/icon/add-but-gray.png'"
			   :style="{'background-color': theme.background}"></image>
	</view>
</template>

<script>
    export default {
        name: 'app-add-subtract',
	    data() {
            return {
                inputValue: 0,
                step: 1,
                disabled: false,
				is_loading: false,
            }
	    },
	    props: {
            value: {
                type: [String,Number],
                default() {
                    return 1;
                }
            },
		    stock: {
                type: Number,
			    default() {
                    return 0;
                }
            },
            min:{
                type: Number,
                default() {
                    return 1;
                }
            },
            background: {
                type: String,
                default() {
                    return '#ffffff';
                }
            },
            good_id: [String,Number],
			theme: Object
	    },
	    created() {
            this.inputValue = +this.value;
	    },
	    methods: {
            _calcValue(type) {
                if (this.disabled) {
                    return;
                }
                const scale = this._getDecimalScale();
                let value = this.inputValue * scale;
                let step = this.step * scale;
                if (type === "minus") {
                    value -= step;
                } else if (type === "plus") {
                    value += step;
                }
                if (value < this.min || value > this.stock) {
                    return;
                }
                this.inputValue = String(value / scale);
            },
		    
            _getDecimalScale() {
                
                let scale = 1;
                // 浮点型
                if (~~this.step !== this.step) {
                    scale = Math.pow(10, (this.step + "").split(".")[1].length);
                }
                return scale;
            },
		    
            _onBlur(event) {
                
                let value = event.detail.value;
                if (!value) {
                    // this.inputValue = 0;
                    return;
                }
                value = +value;
                if (value > this.stock) {
                    value = this.stock;
                } else if (value < this.min) {
                    value = this.min;
                }
                this.inputValue = value;
            },

			imgLoad() {
				this.is_loading = true;
			}
	    },
	    watch: {
            value: {
                handler(val) {
                    this.inputValue = +val;
                }
            },
            inputValue(newVal, oldVal) {
                if (+newVal !== +oldVal) {
                    this.$emit("change", {
                        number: newVal, id: this.good_id
                    });
                }
            }
	    }
    }
</script>

<style scoped lang="scss">
	.app-add-subtract {
		height: #{60rpx};
		.app-icon {
			height: #{44rpx};
			width: #{44rpx};
			background-size: 100% 100%;
			background-repeat: no-repeat;
		}
        image {
            margin-top: #{4rpx};
        }
		.app-unreducible {
			background-image: url("../../../../static/image/cart/unreducible.png");
		}
		.app-not-add {
			background-image: url("../../../../static/image/cart/can-add.png");
		}
		.app-can-add {
			background-image: url("../../../../static/image/icon/add-but.png");
		}
		.app-can-be-reduced {
			background-image: url("../../../../static/image/icon/subtract.png");
		}
            input {
                font-size: #{30rpx};
            }

			.text {
				line-height: #{60upx};
				height: #{60rpx};
				width: #{88rpx};
				font-size: #{21rpx};
                margin-top: #{4rpx};
				color: #353535;
				text-align: center;
				vertical-align: middle;
				padding: 0;
			}

	}
</style>