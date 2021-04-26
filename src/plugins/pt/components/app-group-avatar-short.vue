<template>
	<view class="app-group-avatar-short">
		<image class="app-background" mode="scaleToFill"   src="/plugins/pt/image/group-avatar-BG.png"></image>
		<view class="app-background-image">
			<view class="app-text" >
				<template v-if="status == '1'">
					<text class="app-people">
						还差
						<text class="app-num">{{surplus_people}}</text>
						人，仅剩
						<text class="app-num">{{html}}</text>
						失效
					</text>
				</template>
				<template v-else-if="status == '3' || status == 4">
					<text class="app-people">
						超过有效时间，
						<text class="app-num">
							拼团失败
						</text>
					</text>
				</template>
				<template v-else-if="status == '2'">
					<text class="app-people">
						已成团
					</text>
				</template>
			</view>
			<view class="app-content dir-left-wrap main-center">
				<template v-if="status == '1' || status == '2'">
					<view class="app-item app-add" v-for="(item, index) in group_users" :key="index">
						<image lazy-load class="app-avatar app-add-avatar" :src="item.avatar"></image>
						<view class="app-name" v-if="item.is_parent == 1">团长</view>
					</view>
				</template>
				<block v-for="(item, index) in userList" :key="index">
					<view class="app-item app-no">
						<image class="app-avatar" src="/plugins/pt/image/question.png"></image>
					</view>
				</block>
			</view>
		</view>
		<view class="app-share" :style="{'background-color': theme.background}" v-if="status == '1' && is_join == '1'">
			<app-form-id @click="shareShow=true">
				邀请好友
			</app-form-id>
		</view>
		<view class="app-share" :style="{'background-color': theme.background}" v-if="status == '1' && is_join == '0'" >
			<app-form-id @click="setShow">
				我要参团
			</app-form-id>
		</view>
		<view class="app-share" :style="{'background-color': theme.background}" v-if="status == '2' && is_join == '1'">
			<app-form-id @click="shareShow=true">
				分享给好友
			</app-form-id>
		</view>
		<view class="app-share" :style="{'background-color': theme.background}" v-if="status == '2' && is_join == '0'">
			<app-jump-button :url="`/plugins/pt/goods/goods?goods_id=${one_goods_id}`">
				一键开团
			</app-jump-button>
		</view>
		<view class="app-share" :style="{'background-color': theme.background}" v-if="status == '3' || status == 4">
			<app-jump-button :url="`/plugins/pt/goods/goods?goods_id=${one_goods_id}`">
				一键开团
			</app-jump-button>
		</view>

		<view>
            <app-share-qr-code :theme="theme"
                               v-model="shareShow"
                               :url="url"
                               @share="testShare"
                               :poster-config="posterConfig"
                               :poster-generate="posterGenerate"
                               :has-poster-nav="hasPosterNav"
            ></app-share-qr-code>
        </view>
		<app-attr
				:selectAttr="selectAttr"
				:show="show"
				@attrtap="attrTap"
				@attr="setAttr"
				:attrGroupList="goods.attr_groups"
				:goods="goods"
				:theme="theme"
		>
			<view class="buy-btn cross-center main-center" slot="extra" :style="{bottom: `${getEmpty}rpx`,'background-color': theme.background}" @click="buySubmit"
				  v-if="attr.display === 'block'">确认</view>
		</app-attr>
	</view>
</template>

<script>
    import {mapGetters} from "vuex";
    import appShareQrCode
        from '../../../components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
    import appAttr from '../../../components/page-component/app-attr/app-attr.vue';

    export default {
        name: 'app-group-avatar-short',
        props: {
            surplus_people: Number,
			group_users: Array,
            surplusDateTime: String,
            url: String,
            status: String,
            goodsId: String,
			one_goods_id: Number,
			is_join: String,
            detail: Object,
            theme: Object,
            posterConfig: String,
            posterGenerate: String,
            hasPosterNav: {
                type: Boolean,
                default() {
                    return false
                },
            },
        },
	    data() {
            return {
                time: null,
                html: '',
                shareShow: false,
                attr: {},
                selectAttr: {},
                show: 0,
				goods: {},
                userList: [],
            }
	    },
	    destroyed() {
            clearInterval(this.time);
	    },
	    methods: {
          testShare(s){
              this.$emit('share', s);
          },
            setShow() {
                uni.showLoading();
                this.$request({
                    url: this.$api.pt.detail,
                    data: {
                        id: this.goodsId,
                        group_id: this.detail.group_id,
                    }
                }).then(response => {
                    uni.hideLoading();
                    if (response.code === 0) {
                        this.show = Math.random();
                        this.goods = response.data.detail;
                    } else {
                        uni.showModal({
							content: response.msg,
							showCancel: false
						});
					}
                }).catch(e => {
                    uni.hideLoading();
				})
            },
            setAttr(data) {
                this.attr = data;
            },
            setTime(v) {
                let timelog = new Date(v.replace(/-/g, '/'));
                clearInterval(this.time);
                this.time = setInterval(() =>{
                    let time = timelog.getTime() - new Date().getTime();
	                if (time < 0) {
	                    clearInterval(this.time);
	                }
                    let day = parseInt((time/1000/60/60/24)%30);
                    let hou = parseInt((time/1000/60/60)%24);
                    let min = parseInt((time/1000/60)%60);
                    let sec = parseInt((time/1000)%60);
                    if (day > 0) {
                        this.html = day+"天"+hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec);
                    } else {
                        this.html = hou+":"+(min<10?"0"+min:min) + ":"+(sec<10?"0"+sec:sec);
                    }
                },1000);
            },
            attrTap(data) {
                if (data !== null) {
                    this.selectAttr = data;
                } else {
                    this.selectAttr = {};
                }
            },
            buySubmit() {
                if (Object.keys(this.selectAttr).length === 0) {
                    uni.showModal({
                        title: '提示',
                        content: '请先选择规格',
                        showCancel: false
                    });
                } else {
                    let mch_id = this.goods.mch_id;
                    let mch_list = [];
                    let goods = {
                        id: this.goods.id,
                        attr: [],
                        num: this.attr.number,
                        goods_attr_id: this.selectAttr.id,
                        cart_id: 0,
                    };
                    for (let i = 0; i < this.selectAttr.attr_list.length; i++) {
                        let attr = {
                            attr_id: this.selectAttr.attr_list[i].attr_id,
                            attr_group_id: this.selectAttr.attr_list[i].attr_group_id,
                        };
                        goods.attr.push(attr);
                    }
                    mch_list.push({
                        mch_id: mch_id,
                        pintuan_order_id: this.detail.id,
                        pintuan_group_id: this.detail.group_id,
                        goods_list: [goods],
                    });
                    this.$jump({
                        open_type: 'navigate',
                        url: `/pages/order-submit/order-submit?mch_list=${JSON.stringify(mch_list)}&preview_url=${encodeURIComponent(this.$api.pt.order_preview)}&submit_url=${encodeURIComponent(this.$api.pt.order_submit)}&order_page_url=/plugins/pt/order/order&plugin=pt`
                    });
				}
			},
		    arr(data) {
                let ar = [];
                for (let i = 0; i < data; i++) {
                    ar.push(i);
                }
                return ar;
		    }
	    },
	    watch: {
            surplusDateTime: {
                handler: function(v) {
                    this.setTime(v);
                },
	            immediate: true
            },
		    status: {
                handler: function(v) {
                    if (Number(v) === 3) {
                        this.userList = this.arr(this.orderRelation.length + this.surplus_people);
                    } else if (Number(v) === 1) {
                        this.userList = this.arr(this.surplus_people);
                    } else {
                        this.userList = this.arr(this.surplus_people);
                    }
                },
                immediate: true
		    }
	    },
	    computed: {
		    ...mapGetters('iPhoneX',{
                getEmpty: 'getEmpty',
		    })
	    },
        components: {
            'app-share-qr-code': appShareQrCode,
            'app-attr': appAttr,
        }
    }
</script>

<style scoped lang="scss">
	.app-group-avatar-short {
		background-color: #f7f7f7;
		padding: #{10rpx} #{24rpx};
		box-sizing: border-box;
		min-height: #{230+24+88+32rpx};
		position: relative;
		.app-background {
			position: absolute;
			width: #{702rpx};
			height: #{220rpx};
			z-index: 0;
			top: 0;
			transform: translateX(-50%);
			left: 50%;
			margin-top: #{10rpx};
		}
		.app-background-image {
			width: #{702rpx};
			min-height: #{230-10rpx};
			padding-top: #{42rpx};
			box-sizing: border-box;
			.app-text {
				font-size: #{25rpx};
				text-align: center;
				margin-bottom: #{32rpx};
				z-index: 1000;
				position: relative;
				.app-people {
					color: #1b1b1b;
					.app-num {
						color: #ff2755;
						display: inline-block;
						margin: 0 #{10rpx};
					}
				}
			}
			.app-content {
				
				width: #{702rpx};
				background-color: #ffe7e7;
				.app-item {
					width: #{70rpx};
					height: #{82rpx};
					margin-right: #{16rpx};
					margin-bottom: #{20rpx};
					z-index: 1000;
					position: relative;
					.app-avatar {
						width: #{70rpx};
						height: #{70rpx};
						border-radius: 50%;
						background-color: white;
					}
					.app-name {
						position: absolute;
						bottom: 0;
						left: 50%;
						transform: translateX(-50%);
						background-color: #ff5c5c;
						color: white;
						line-height: #{26rpx};
						width: #{56rpx};
						height: #{26rpx};
						font-size: #{16rpx};
						border-radius: #{10rpx};
						text-align: center;
					}
				}
				.app-add {
					.app-add-avatar {
						border: #{1rpx} solid #ff6363;
					}
				}
				.app-no {
				}
			}
		}
		.app-share {
			width: #{702rpx};
			height: #{88rpx};
			line-height: #{88rpx};
			border-radius: #{46rpx};
			text-align: center;
			font-size: #{32rpx};
			color: #ffffff;
			margin: #{24rpx} 0 #{32rpx} 0;
		}

		.buy-btn {
			position: absolute;
			bottom: 0;
			left: 0;
			color: #ffffff;
			z-index: 1550;
			width: 100%;
			height: #{110rpx};
		}
	}
</style>