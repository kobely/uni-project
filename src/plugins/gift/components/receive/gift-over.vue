<template>
	<view class="page-width gift-over">
        <view class="title" v-if="type === 'direct_open' && open_type == 1 && winUser.length >=1 && is_status === 1">{{num}}份礼物已被领取{{winUser.length}}份</view>
		<view class="title" v-if="type === 'direct_open' && open_type == 0 && winUser.length >=1 && is_status === 1">
			{{num}}份礼物已被领取
		</view>
		
		<view class="title" v-if="type === 'direct_open' && open_type == 1 && is_status === 0 && winUser.length >=1">
			{{num}}份礼物{{win_time}}被抢光
		</view>
		<view class="title" v-if="type === 'direct_open' && open_type == 0 && is_status === 0 && winUser.length >=1">
			{{num}}份礼物{{win_time}}被抢光
		</view>
		
		<view class="title" v-if="type !== 'direct_open'">
			共{{userOrder.length}}人参与 {{winUser.length}}人中奖
		</view>
		<view class="content" :class="[`${winUser.length > 3 && len <= 3 ? 'margin' : ''}`]">
			<view class="item dir-left-nowrap cross-center" v-for="(item, index) in newWinUser" :key="index">
				<image class="avatar" :src="item.user.userInfo.avatar"></image>
				<view class="name t-omit">{{item.user.nickname}}</view>
			</view>
			<view class="more" v-if="winUser.length > 3 && len <= 3" @click="len = winUser.length">加载更多</view>
		</view>
    </view>
</template>

<script>
    export default {
        name: 'gift-over',

        props: [ `num`, `winUser`, `open_type`, `type`, `userOrder`, `is_status`, `win_time`],
	    
	    data() {
            return {
                len: 3,
            }
	    },
	    
	    computed: {
            newWinUser:function() {
                return this.winUser.slice(0, this.len);
            }
	    }
    }
</script>

<style scoped lang="scss">
    @import "../../css/gift.scss";
	.gift-over {
		width: #{638upx};
		border-radius: #{16upx};
		background-color: #f7f7f7;
		.title {
			font-size: #{28upx};
			color: #353535;
			height: #{88upx};
			line-height: #{88upx};
			text-align: center;
			border-bottom: #{1upx} solid #e2e2e2;
		}
		.content {
			padding-top: #{32upx};
			overflow: hidden;
			.more {
				font-size: #{24upx};
				line-height: 1;
				text-align: center;
				color: #999999;
				margin-bottom: #{32upx};
			}
			.item {
				padding-left: #{40upx};
				margin-bottom: #{32upx};
			}
			.avatar {
				width: #{64upx};
				height: #{64upx};
				border-radius: 50%;
				background-color: blue;
				margin-right: #{32upx};
			}
			.name {
				width: calc(100% - #{136upx});
				font-size: #{28upx};
				color: #353535;
			}
		}
	}
	.margin {
		margin-bottom: #{250upx};
	}
</style>