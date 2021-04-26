<template>
	<view class="u-pt-group dir-top-nowrap">
		<text class="u-group-name">拼团人数</text>
		<view class="app-content dir-left-wrap">
			<view class="u-group-item" v-for="(item, index) in groups"
                  :style="{'background-color': selectGroupAttrId == item.groups.id ? theme.background : ''}"
                  :class="selectGroupAttrId == item.groups.id ? 'u-checked u-unchecked': ''"
				  @click="active(item)" :key="index">{{item.groups.people_num}}人团</view>
		</view>
	</view>
</template>

<script>
	
    export default {
        name: 'app-pt-attr',

	    props: {
			groups: {
                type: Array,
	            default() {
                    return [];
	            }
            },
            selectGroupAttrId: String,
			theme: Object
	    },
	    methods: {
            active: function(item) {
                this.$emit('click',item);
            }
	    }
    }
</script>

<style scoped lang="scss">
	.u-unchecked {
		background-color: #f2f2f2;
        color: #353535;
	}
	.u-pt-group {
        margin:24upx 32upx 0 32upx;
        border-bottom: 1upx solid #e2e2e2;
	}
    .u-group-name {
        font-size: 26upx;
        color: #666666;
        margin-bottom: 20upx;
    }
    .u-group-item {
        padding: 15upx 24upx;
        border-radius: 8upx;
        margin:0 20upx 20upx 0;
        font-size: 26upx;
    }
    .u-checked {
        color: #ffffff;
    }
</style>