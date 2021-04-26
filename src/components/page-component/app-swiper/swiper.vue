<template>
	<view class="banner" :style="{height: height + 'rpx'}">
		<view v-for="(item, index) in list" :key="index" class="pic"
			  :animation="num === index ?showpic:hidepic"
              :style="{zIndex: zIndex === index ?1:0}"
			  @touchstart="touchstart" @touchend="touchend">
            <!--#ifdef MP -->
            <app-jump-button
                :open_type="item.open_type"
                :url="item.url ? item.url : item.page_url"
                :params="item.params">
                <image :style="{height: height + 'rpx', width: '100%'}" :mode="imgMode"  :src="item[name]" />
            </app-jump-button>
            <!--#endif-->
            <!--#ifdef H5 -->
            <app-jump-button
                v-if="item.open_type !== 'app'"
                :open_type="item.open_type"
                :url="item.url ? item.url : item.page_url"
                :params="item.params">
                <image :style="{height: height + 'rpx', width: '100%'}" :mode="imgMode"  :src="item[name]" />
            </app-jump-button>
            <view :id="item.id" v-if="item.open_type === 'app'" style="height: 100%;">

            </view>
<!--            <view :id="'swiper-' + index" style="height: 100%;">-->

<!--            </view>-->
<!--            <wx-open-launch-weapp v-if="item.open_type === 'app' && isWechat" id="launch-btn" :username="getUrlParam(item.page_url, 'username')" :path="getUrlParam(item.page_url, 'path')">-->
<!--                <script type="text/wxtag-template">-->
<!--                    <image :style="{height: height + 'rpx', width: '100%'}" :mode="imgMode"  :src="item[name]" />-->
<!--                </script>-->
<!--            </wx-open-launch-weapp>-->
            <!--#endif-->
		</view>
		<view class="u-swiper-indicator"
			  :style="{
				bottom: '12rpx',
				justifyContent: 'center'
			}"
		>
			<block v-if="mode === 'rect'">
				<view class="u-indicator-item-rect" :class="{ 'u-indicator-item-rect-active': index === num }" v-for="(item, index) in list"
					  :key="index"></view>
			</block>
			<block v-if="mode === 'round'">
				<view class="u-indicator-item-round" :class="{ 'u-indicator-item-round-active': index === num }" v-for="(item, index) in list"
					  :key="index"></view>
			</block>
		</view>
	</view>
</template>

<script>
	
    export default {
        name:'u-swiper',
        props: {
			list: {
				type: Array,
				default () {
					return [];
				}
			},
			// 图片的裁剪模式
			imgMode: {
				type: String,
				default: 'aspectFill'
			},
			// 从list数组中读取的图片的属性名
			name: {
				type: String,
				default: 'image'
			},
			// list的高度，单位rpx
			height: {
				type: [Number, String],
				default: 250
			},
			// 自动轮播时间间隔，单位ms
			duration: {
				type: [Number, String],
				default: 500
			},
			// 隔多久自动切换
			interval: {
				type: [String, Number],
				default: 3000
			},
			// 指示器的模式，rect|dot|number|round
			mode: {
				type: String,
				default: 'round'
			},
			// 指示器的位置，topLeft|topCenter|topRight|bottomLeft|bottomCenter|bottomRight
			indicatorPos: {
				type: String,
				default: 'bottomCenter'
			},
			// 是否自动播放
			autoplay: {
				type: Boolean,
				default: true
			},
        },
        data() {
            return {
				num: 0,
                zIndex: 0,
				showpic:null,
				hidepic:null,
				setTime: 0,
				touchDot: 0
			}
        },
        // #ifdef H5
        created() {
            this.$jwx.config();
        },
        // #endif
        methods: {
			touchstart(e) {
				this.touchDot = e.touches[0].pageX;
			},

			touchend(e) {
				let touchMove = e.changedTouches[0].pageX;
				if (touchMove - this.touchDot <= -40) {
					this.num = this.num - 1;
					if(this.num < 0){
						this.num=this.list.length-1;
					}
                    setTimeout(() => {
                        this.zIndex = this.num;
                    }, 1000);
				}
				if (touchMove - this.touchDot >= 40) {
					this.num = this.num + 1;
					if(this.num>=this.list.length){
						this.num=0;
					}
                    setTimeout(() => {
                        this.zIndex = this.num;

                    }, 1000);
				}
			},
            getUrlParam(url,name) {
                let search = url.split('?')[1];
                if (search) {
                    let r = search.substr(0).match(new RegExp('(^|&)' + name + '=([^&]*)(&|$)'))
                    if (r !== null) return unescape(r[2])
                    return null
                } else {
                    return null
                }
            }
        },
		destroyed() {
        	clearInterval(this.setTime);
		},
        watch: {
            list: {
                handler(newVal) {
                    if (newVal.length === 0) return;
                    let animation= uni.createAnimation({}) //创建一个动画实例
                    //淡入
                    animation.opacity(1).step({
                        duration:this.duration
                    }) //描述动画
                    this.showpic = animation.export();
                    //淡出
                    animation.opacity(0).step({duration:this.duration});
                    // #ifdef H5
                    // #endif
                    this.hidepic = animation.export();
                    if (this.autoplay) {
                        this.setTime = setInterval(() => {
                            this.num = this.num+1;
                            if(this.num>=this.list.length){
                                this.num=0;
                            }
                           setTimeout(() => {
                               this.zIndex = this.num;
                           }, this.interval + 1000)
                        }, this.interval);
                    }
                    // #ifdef H5
                    for (let i = 0; i < newVal.length; i++) {
                        if (newVal[i].open_type === 'app') {
                            newVal[i].id = this.$utils.guid('swiper');
                            let height = uni.upx2px(this.height)+ 'px';
                            let username = this.getUrlParam(newVal[i].page_url, 'username');
                            let path = this.getUrlParam(newVal[i].page_url, 'path');
                            let text = `<img src="${newVal[i].pic_url}" width="100%" height="${height}" />`;
                            this.$utils.createWxOpenLaunchWeapp(newVal[i].id, username, path, text);
                        }
                    }
                    // #endif
                },
                immediate: true
            }
        },
        // #ifdef H5
        computed: {
            isWechat: function() {
                return this.$jwx.isWechat();
            }
        }
        // #endif
	}
</script>

<style lang="scss">
	.banner {
		width: 750rpx;
		position: relative;
	}
	.pic {
		width:750rpx;
		position:absolute;
		top:0;
		left:0;
	}
	.u-swiper-indicator {
		padding: 0 24rpx;
		position: absolute;
		display: flex;
		width: 100%;
		z-index: 1;
	}
	.u-indicator-item-round-active {
		width: 34rpx !important;
		background-color: rgba(255, 255, 255, 0.8) !important;
	}
	.u-indicator-item-round {
		width: 14rpx;
		height: 14rpx;
		margin: 0 6rpx;
		border-radius: 20rpx;
		transition: all 0.5s;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.u-indicator-item-rect {
		width: 26rpx;
		height: 8rpx;
		margin: 0 6rpx;
		transition: all 0.5s;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.u-indicator-item-rect-active {
		background-color: rgba(255, 255, 255, 0.8);
	}
</style>
