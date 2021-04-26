<template>
	<view class="app-add-subtract dir-left-nowrap main-right cross-center">
		<image src="/static/image/quick-shop/subtract.png" class="app-icon" v-if="total_num > 0 " @click="subtract"></image>
		<input class="app-input" v-if="total_num >= 0 " :value="total_num === 0 ? '' : total_num" @input="changeNum"  type="number">
		<image class="app-icon" v-show="loading" @load="imgLoad" src="/static/image/quick-shop/add.png" :style="{'background-color': theme.background}" @click="add"></image>
	</view>
</template>

<script>
    export default {
        name: 'app-add-subtract',
	    props: {
            total_num: {
                type: Number,
	            default: function() {
	                return 0;
	            }
            },
            item: {
                type: Object,
	            default: function() {
	                return {}
	            }
            },
			theme: Object
	    },

		data() {
        	return {
				loading: false
			}
		},
	    methods: {
            add() {
                this.$emit('add', this.item);
            },
            subtract() {
                this.$emit('subtract', this.item);
            },
            changeNum(e) {
                this.$emit('changeNum', this.item, Number(e.detail.value));
            },
			imgLoad() {
            	this.loading = true;
			}
	    }
    }
</script>

<style scoped lang="scss">
	.app-add-subtract {
		width: #{152rpx};
		height: #{44rpx};
		.app-icon {
			width: #{44rpx};
			height: #{44rpx};
		}
		.app-input {
			width: #{64rpx};
			height: #{44rpx};
			font-size: #{28rpx};
			color: #353535;
			text-align: center;
			background-color: #ffffff;
		}
	}
</style>