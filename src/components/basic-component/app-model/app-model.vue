<template>
    <view class="app-mode" :class="{'app-show': display}" @click.stop="close">
	    <view v-if="type === '1'" class="app-content" :style="{backgroundColor: background, bottom: setHeight, height: `${height+108}rpx`}">
		    <view class="app-top">
			    <slot name="title">赠卡券</slot>
			    <view class="app-icon">
				    <app-form-id @click="close()">
					    <icon class="app-icon-close image-no-rep image-cover" type></icon>
                    </app-form-id>
                </view>
            </view>
            <view class="app-bottom">
                <slot name="content"></slot>
            </view>
        </view>
        <view v-if="type === '2'" class="app-center" :style="{backgroundColor: background}">
            <view class="app-top">
                <slot name="title">限购</slot>
                <view class="app-icon">
                    <app-form-id @click.stop="close()">
                        <icon class="app-icon-close image-no-rep image-cover" type></icon>
                    </app-form-id>
                </view>
            </view>
            <view class="app-bottom">
                <slot name="content"></slot>
            </view>
        </view>

        <view v-if="type === '3'" class="app-content" :style="{backgroundColor: background, bottom: setHeight}"
              @click.stop="bubble">
            <view class="app-common main-center">
                <slot name="title">提现方式</slot>
                <view class="app-icon">
                    <app-form-id @click="close()">
                        <icon class="app-icon-close image-no-rep image-cover" type></icon>
                    </app-form-id>
                </view>
            </view>
            <view class="app-bottom">
                <slot name="content"></slot>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'app-model',
	    props: {
            type: {
                type: String,
                default: function() {
                    return '1';
                }
            },
		    background: {
                type: String,
			    default: function() {
			        return 'white';
			    }
		    },
		    height: {
                type: Number,
			    default: function() {
			        return 500;
			    }
		    },
		    value: {
                type: Boolean,
			    default: function() {
			        return false;
			    }
		    }
	    },
	    data() {
            return {
                display: this.value
            }
        },
        methods: {
            bubble() {
                return false;
            },
            close() {
                this.display = false;
                this.$emit('input', this.display);
            },
        },
        computed: {
            setHeight() {
                if (this.display === true) {
                    return `0`;
                } else {
                    return `-${this.height + 108}rpx`;
                }
            }
        },
        watch: {
            value: function() {
                this.display = this.value;
            }
	    }
    }
</script>

<style scoped lang="scss">
	.app-mode {
        position: fixed;
        z-index: 1600;
        top: 0;
        left: 0;
        width: #{750rpx};
        height: 100%;
        background-color: rgba(127, 127, 127, 0.4);
        transition: all 0.2s linear;
        visibility: hidden;
        opacity: 0;
        overflow: hidden;

        .app-common {
            color: #353535;
            font-size: #{36rpx};
            width: 100%;
            line-height: #{100rpx};
            border-bottom: 1px solid #E2E2E2;

            .app-icon-close {
                width: #{30rpx};
                height: #{30rpx};
                position: absolute;
                background-image: url("../../../static/image/icon/icon-close.png");
                top: #{35rpx};
                right: #{32rpx};
            }
        }

        .app-icon {
            position: absolute;
            top: 0;
            right: 0;
            height: #{108rpx};
            width: #{54rpx};
        }

        .app-icon-close {
            width: #{30rpx};
            height: #{30rpx};
            position: absolute;
            background-image: url("../../../static/image/icon/icon-close.png");
            top: #{24rpx};
            right: #{24rpx};
        }

        .app-content {
            position: absolute;
            width: #{750rpx};
            transition: bottom 0.5s linear;
            border-top-left-radius: #{16rpx};
            border-top-right-radius: #{16rpx};

            .app-top {
                width: #{750rpx};
                height: #{108rpx};
            }
        }

        .app-center {
            width: #{600rpx};
            border-radius: #{16rpx};
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            .app-top {
                width: #{600rpx};
                height: #{108rpx};
            }

            .app-bottom {
                width: #{520rpx};
                margin: 0 #{40rpx} #{48rpx} #{40rpx};
                font-size: #{28rpx};
                color: #353535;
            }
        }
    }
	.app-show {
		opacity: 1;
		visibility: visible;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        transform: scale(1);
	}
</style>