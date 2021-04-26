<template>
	<view class="iphone-x">
		<slot name="empty-area"></slot>
		<view class="x-line" v-if="getBoolEmpty.XBoolean" :style="{height: getBoolEmpty.emptyHeight + 'rpx', backgroundColor: backgroundColor,}"></view>
	</view>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        props: {
            backgroundColor: {
                type: String,
                default: function() {
                    return 'white';
                }
            }
        },
        computed: {
            ...mapGetters('iPhoneX', {
                getBoolEmpty: 'getBoolEmpty'
            }),
        }
    }
</script>

<style scoped lang="scss">
	.iphone-x {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 1500;
	}
	.x-line {
		width: 100%;
		background-color: pink;
	}
</style>