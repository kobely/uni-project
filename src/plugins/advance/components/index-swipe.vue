<template>
	<view class="swipe">
		<swiper class="swipe" :indicator-dots="pictures.length > 1" :autoplay="pictures.length > 1" :circular="pictures.length > 1">
			<swiper-item v-for="(item, index) in pictures" :key="index">
				<app-form-id>
					<image :lazy-load="true" :src="item.pic_url" class="image" @click="route_jump(item)"></image>
				</app-form-id>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
    export default {
        name: 'index-swipe',
	    props: {
            pictures: {
                type: Array,
	            default() {
                    return [];
                }
            }
	    },
	    methods: {
            route_jump(data) {
                this.$jump({
	                url: data.page_url,
                    open_type: data.open_type,
                })
            }
	    }
    }
</script>

<style scoped lang="scss">
	.swipe {
		width: #{750rpx};
		height: #{280rpx};
		.image {
			width: #{750rpx};
			height: #{280rpx};
		}
	}
</style>