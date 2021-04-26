<template>
	<view class="app-iphone-bottom" :style="{height: iphone ? `50rpx` : '0rpx'}">
	</view>
</template>

<script>
    import {mapState} from 'vuex';
    
    export default {
        name: 'app-iphone-bottom',
	    props: {
            backgroundColor: {
                type: String,
	            default: function() {
	                return 'white';
	            }
            }
	    },
	    computed: {
            ...mapState('gConfig',{
                iphone: (data) => {
                    return data.iphone;
                },
                iphoneHeight: (state) =>{
                    return  state.iphoneHeight;
                },
            })
	    }
    }
</script>

<style scoped lang="scss">
.app-iphone-bottom {
	background-color: white;
	width: 100%;
	position:fixed;
	left: 0;
	bottom: 0;
}
</style>