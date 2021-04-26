<template>
	<view>
		<view class="search" @click="router">
			<view class="f-input dir-left-nowrap main-center cross-center">
				<image src="/static/image/icon/search.png"></image>
				<text>搜索</text>
			</view>
		</view>
		<form report-submit v-on:submit="getFormId">
			<view class="page-width sort-rule dir-left-nowrap">
				<button class="box-grow-1 item" v-on:click="setSort(1)" formType="submit"
					    :class="[`${sort === 1 && sign === 'gift' ? theme + `-color` : ''}`]"
					    :style="{'color': sort === 1 && sign !== 'gift' ? theme.color : ''}">综合</button>
				<button class="box-grow-1 item" v-on:click="setSort(2)" formType="submit"
					    :class="[`${sort === 2 && sign === 'gift' ? theme + `-color` : ''}`]"
					    :style="{'color': sort === 2 && sign !== 'gift' ? theme.color : ''}">最新</button>
				<button class="box-grow-1 item dir-left-nowrap main-center cross-center" v-on:click="setSort(3)" formType="submit"
					    :class="[`${sort === 3 && sign === 'gift' ? theme + `-color` : ''}`]"
					    :style="{'color': sort === 3 && sign !== 'gift' ? theme.color : ''}">
					<text class="price">价格</text>
					<image v-show="loading" class="icon" @load="loading=true" 
					       :class="[`${sign === 'gift' ? theme + `-background` : ''}`]"
					       :style="{'background-color': sign !== 'gift' ? theme.background : ''}"
						   :src="sort_type === -1 ? `/static/image/icon/price-sort-default.png` : sort_type ===  2 ? `/static/image/icon/tall.png` : sort_type === 1 ? `/static/image/icon/low.png` : ``"></image>
				</button>
				<button class="box-grow-1 item" :style="{'color': sort === 4 && sign !== 'gift' ? theme.color : ''}" :class="[`${sort === 4 && sign === 'gift' ? theme + `-color` : ''}`]" v-on:click="setSort(4)" formType="submit">销量</button>
				<button @click="setStyle" class="box-grow-1 item dir-top-nowrap main-center cross-center">
					<image class="img-icon"  :src="listStyle ? '/static/image/icon/square.png' : '/static/image/icon/row.png'"  ></image>
				</button>
			</view>
		</form>
	</view>
</template>

<script>

    export default {
        name: 'sort-rule',

        props: {
            theme: [String,Object],
			sign: String,
			route: {
            	type: String,
				default: `/pages/search/search`
			}
        },

        data() {
            return {
                sort: 1,
                sort_type: -1,
				loading: false,
				listStyle: false
            }
        },

		computed: {
			classObject: function() {
				return {
					default: this.sort_type === -1,
					tall: this.sort_type === 2,
					low: this.sort_type === 1,
					icon: true,
					'default-background': true
				}
			}
		},
        methods: {
            getFormId(data) {
            },

            setSort(data) {
                this.sort = data;
                if (data !== 3) {
                    this.sort_type = -1;
                } else {
					this.loading = true;
                    switch (this.sort_type) {
                        case -1:
                            this.sort_type = 1;
                            break;
                        case 1:
                            this.sort_type = 2;
                            break;
                        case 2:
                            this.sort_type = 1;
                    }
                }
                this.$emit('sort', {
                    data:data, type: this.sort_type
                });
            },

			setStyle() {
            	this.listStyle = !this.listStyle;
				this.$emit('setStyle', this.listStyle);
			},

			router() {
            	uni.navigateTo({
					url: this.route
				})
			}
        },
    }
</script>

<style scoped lang="scss">
	
	/*排序*/
	.sort-rule {
		height: #{96upx};
		width: #{750upx};
		background-color: #ffffff;
		.item {
			line-height: #{96upx};
			text-align: center;
			background-color: #ffffff;
			font-size: #{26upx};
			border: none;
		}
		.icon {
			width: #{16upx};
			height: #{22upx};
			margin-left: #{5upx};
			background-size: 100% 100%;
			background-repeat: no-repeat;
		}
		.img-icon {
			width: 31upx;
			height: 31upx;
		}
		.price {
			margin-right: #{5upx};
		}
	}
	.default-color {
		color: #ff4544;
	}
	
	.default-background {
		background-color: #ff4544;
	}

	.default {
		background-image: url('../../../static/image/icon/price-sort-default.png');
	}
	.tall {
		background-image: url('../../../static/image/icon/tall.png');
	}
	.low {
		background-image: url('../../../static/image/icon/low.png');
	}
	.search {
		height: 93upx;
		padding: 20upx 24upx 10upx 24upx;
		background-color: #ffffff;
		.f-input {
			width: 702upx;
			height: 64upx;
			border-radius: 32upx;
			background-color: #f7f7f7;
			>image {
				width: 26upx;
				height: 26upx;
				margin-right: 5upx;
			}
			>text {
				font-size: 26upx;
				color: #999999;
				margin-left: 5upx;
			}
		}
	}
</style>