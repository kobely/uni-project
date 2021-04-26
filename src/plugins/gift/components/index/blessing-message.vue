<template>
	<view class="page-width blessing-message">
		<view class="title black">祝福留言</view>
		<view class="page-width blessing-content">
			<input
				class="textarea"
				:value="bless_word"
				:placeholder="place_bless_word"
				placeholder-class="gray"
				maxlength="12"
				@input="changeTextarea"
				@confirm="changeTextarea"
			/>
		</view>
	</view>
</template>

<script>
    export default {
        name: 'blessing-message',

        props: [`bless_word`, `place_bless_word`],
	    
	    methods: {
            changeTextarea(data) {
                this.$emit('changeTextarea', data.detail.value);
            }
	    }
    }
</script>

<style scoped lang="scss">
	@import '../../css/gift.scss';
	
	/*祝福留言*/
	.blessing-message {
		padding: #{0 24upx};
	}
	
	/*标题*/
	.title {
		font-size: #{26upx};
		padding: #{38upx 0 14upx 0};
	}
	
	/*留言区域*/
	.blessing-content {
		height: #{160upx};
		border-radius: #{16upx};
		background-color: #ffffff;
		overflow: hidden;
		.textarea {
			width: #{670upx};
			margin: #{32upx 0 0 32upx};
			padding: 0;
		}
	}
</style>