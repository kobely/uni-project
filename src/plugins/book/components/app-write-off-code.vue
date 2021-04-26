<template>
	<view class="app-write-off-code" v-if="hidden">
		<view class="app-content">
			<view class="app-icon" @click="hiddenHandler"></view>
			<view class="app-text">核销码</view>
			<image :src="file_path" class="app-image"></image>
		</view>
	</view>
</template>

<script>
    export default {
        name: 'app-write-off-code',
        props: {
            hidden: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            itemId: {
                type: String,
                default() {
                    return '-1';
                }
            }
        },
        data() {
            return {
                file_path: '',
            }
        },
        watch: {
            hidden: {
                handler: function(v) {
                    if (v === true) {
                        this.$request({
                            url: this.$api.book.clerk_code,
                            data: {
                                id: this.itemId,
                            }
                        }).then(response => {
                            if (response.code === 0) {
                                this.file_path = response.data.file_path;
                            }
                        })
                    }
                }
            }
        },
        methods: {
            hiddenHandler() {
                this.$emit('hiden', false);
                this.file_path = '';
            }
        }
    }
</script>

<style scoped lang="scss">
	.app-write-off-code {
		background-color: rgba(0,0,0, 0.6);
		width: 100%;
		height: 100%;
		top: 0;
		left:0;
		position: fixed;
		border-radius: 0;
		z-index: 1500;
		.app-content {
			background-color: white;
			width: #{600rpx};
			height: #{600rpx};
			border-radius: #{8rpx};
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			.app-icon {
				width: #{30rpx};
				height: #{30rpx};
				position: absolute;
				top: #{32rpx};
				right: #{32rpx};
				background-repeat: no-repeat;
				background-size: 100% 100%;
				background-image: url("../../../static/image/icon/close.png");
			}
			.app-text {
				font-size: #{33rpx};
				color: #353535;
				margin-top: #{56rpx};
				text-align: center;
			}
			.app-image {
				width: #{360rpx};
				height: #{360rpx};
				margin-top: #{64rpx};
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}
</style>