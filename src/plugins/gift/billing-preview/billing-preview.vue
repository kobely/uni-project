<template>
	<app-layout>
		<view class="billing-preview">
			<view v-for="(mch, index) in mch_list" :key="index">
				<view class="shop-name">{{mch.mch.name}}</view>
				<view class="goods-list">
					<view class="item dir-left-nowrap" v-for="(good) in mch.goods_list">
						<image :src="good.goods_attr.pic_url ? good.goods_attr.pic_url : good.goods_attr.cover_pic" class="pic"></image>
						<view class="content">
							<view class="name t-omit-two">{{good.name}}</view>
							<view class="attr dir-left-nowrap">
								<view v-for="attr in good.attr_list">
									{{attr.attr_group_name}}:{{attr.attr_name}}
								</view>
							</view>
							<view></view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</app-layout>
</template>

<script>
	import {mapState} from 'vuex';
	
    export default {
        name: "billing-preview",
	    
	    data() {
            return {
                mch_list: []
            }
	    },
	    
	    computed: {
            ...mapState('gift', {
                form_data: state => state.form_data
            })
	    },
	    onLoad() { this.$commonLoad.onload();
            this.request();
	    },
	    methods: {
            async request() {
                if (this.form_data.type === 'direct_open') {
                    delete this.form_data.open_num;
                    delete this.form_data.open_time;
                } else if (this.method_type === 'time_open') {
                    delete this.form_data.open_num;
                } else if (this.method_type === 'num_open') {
                    delete this.form_data.open_time;
                }
				const res = await this.$request({
					url: this.$api.gift.order_preview,
					method: 'post',
					data: {
						...this.form_data
					}
				});
				if (res.code === 0) {
					this.mch_list = res.data.mch_list;
				}
            }
	    }
    }
</script>

<style scoped lang="scss">
	 .billing-preview {
		 width: #{750upx};
		 background-color: #f7f7f7;
		 position: absolute;
		 min-height: 100%;
	 }
	.shop-name {
		height: #{80upx};
		line-height: #{80upx};
		padding: #{0 24upx};
		color: #666666;
		font-size: #{28upx};
	}
	.goods-list {
		width: #{750upx};
		background-color: #ffffff;
		overflow: hidden;
		.item {
			padding: #{0 24upx};
			margin-top: #{28upx};
		}
		.pic {
			width: #{155upx};
			height: #{156upx};
		}
		.name {
			font-size: #{28upx};
			color: #353535;
			line-height: #{32upx};
			height: #{64upx};
		}
		.content {
			width: #{547upx};
			padding: #{0 0 0 24upx};
		}
		.attr {
			margin-top: #{24upx};
			> view {
				margin-right: #{32upx};
				font-size: #{24upx};
				line-height: 1;
				color: #999999;
			}
		}
	}
</style>