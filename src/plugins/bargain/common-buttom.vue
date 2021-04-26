<template>
    <view>
	    <view>
		    <app-empty-bottom :height="Number(96)" backgroundColor="#f7f7f7"></app-empty-bottom>
	    </view>
        <view>
	        <app-iphone-x>
		        <view slot="empty-area" class='lottery-bottom dir-left-nowrap cross-center'>
			        <view @click="nav1" class="box-grow-1 dir-left-nowrap main-center cross-center">
				        <icon class="icon icon-hf" :style="{'background-color': status==='index' ? theme.background : '#999999'}" type></icon>
				        <view :style="{'color': status==='index' ? theme.color : '#999999'}">砍价会场</view>
			        </view>
			        <view class="line"></view>
			        <view @click="nav2" class="box-grow-1 dir-left-nowrap main-center cross-center">
				        <icon class="icon icon-jf" :style="{'background-color': status !=='index' ? theme.background : '#999999'}" type></icon>
				        <view :style="{'color': status!=='index' ? theme.color : '#999999'}">我的砍价</view>
			        </view>
		        </view>
	        </app-iphone-x>
        </view>
    </view>
</template>

<script>
    import { mapState } from 'vuex';
    import appIphonexBottom from "../../components/page-component/app-iphonex-bottom/app-iphonex-bottom.vue";
    import appIphoneX from '../../components/basic-component/app-iphone-x/app-iphone-x.vue';
    import appEmptyBottom from '../../components/basic-component/app-empty-bottom/app-empty-bottom.vue';
    
    export default {
        name: 'common-buttom',
        components: {appIphonexBottom, appEmptyBottom, appIphoneX},
        computed: {
            ...mapState('gConfig', {
                iphone: (data) => {
                    return data.iphone;
                },
                iphoneHeight: (state) => {
                    return state.iphoneHeight;
                },
            })
        },
        props: {
            status: {
                type: String,
                default: 'index',
            },
			theme: Object
        },
        data() {
            return {}
        },
        methods: {
            nav1() {
                uni.redirectTo({url: `/plugins/bargain/index/index`});
            },
            nav2() {
                uni.redirectTo({url: `/plugins/bargain/order-list/order-list`});
            }
        }
    }
</script>

<style scoped lang="scss">
    .lottery-bottom {
        width: 100%;
        height: #{96rpx};
        background-color: #fff;
        border-top: #{1rpx} solid #e2e2e2;
        color: #999;

        .line {
            height: #{48rpx};
            width: #{1rpx};
            background: #e2e2e2;
        }

        .icon {
            width: #{34rpx};
            height: #{33rpx};
            background-repeat: no-repeat;
            background-size: 100% 100%;
            margin: 0 #{16rpx};
        }



        .icon.icon-hf {
            background-image: url('./image/bargain-list.png');
        }



        .icon.icon-jf {
            background-image: url('./image/bargain-my.png');
        }

        .red {
            color: #ff4544;
        }
    }

    .navbar + .body {
        padding-bottom: #{115rpx};
    }

    .navbar + .body .lottery-bottom {
        bottom: #{115rpx};
    }
</style>