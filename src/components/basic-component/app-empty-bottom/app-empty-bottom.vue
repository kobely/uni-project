<template>
	<view class="empty-bottom" :style="{backgroundColor: backgroundColor,height: `${botBool ?  BotHeight + height : height + emptyHeight}rpx`,}"></view>
</template>

<script>
	import {mapGetters} from 'vuex';
    export default {
        name: "app-empty-bottom",
	    props: {
            backgroundColor: {
                type: String,
	            default() {
                    return 'white';
	            }
            },
            height: {
                type: Number,
	            default() {
                    return 0;
                }
            },
		    botBool: {
                type: Boolean,
			    default() {
                    return false;
			    }
		    }
	    },
	    computed: {
            ...mapGetters('iPhoneX', {
                BotHeight: 'getBotHeight',
	            emptyHeight: 'getEmpty',
            })
	    }
    }
</script>

<style scoped lang="scss">
	.empty-bottom {
		width: 100%;
	}
</style>