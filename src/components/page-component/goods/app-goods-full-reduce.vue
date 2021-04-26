<template>
    <view @click="route" class="reduce dir-left-nowrap main-between cross-center" :style="{'background-color': theme.background_o}">
        <view :style="{'color': theme.color}" class="bd-name">满减优惠</view>
       <view class="dir-left-nowrap cross-center">
          <view class="bd-item" v-if="full_reduce.rule_type === 2">
              <text :style="{'background-color': theme.background}" class="text" >
                  每满{{full_reduce.rule.min_money}}减{{full_reduce.rule.cut}}
              </text>
          </view>
           <view :class="!opacity  ? 'bd-opacity-0' : 'bd-opacity-1'" v-else-if="full_reduce.rule_type === 1" class="bd-item u-line-1 dir-left-nowrap cross-center">
               <text :style="{'background-color': theme.background}"
                     :id="'bd-'+index + '-text'"
                     class="text " v-for="(item, index) in list" :key="index">
                   满{{item.min_money}}{{item.discount_type === '1' ? '减' + item.cut : '打' + item.discount + '折'}}
               </text>
           </view>
           <view class="arrow"></view>
       </view>
    </view>
</template>

<script>
    export default {
        name: "app-goods-full-reduce",

        props: {
            theme: Object,
            full_reduce: Object,
            sign: String
        },

        data() {
            return {
                textWidth: 0,
                resultWidth: 0,
                list: [],
                opacity: false
            }
        },
        methods: {
            route() {
                uni.navigateTo({
                    url: '/pages/full_reduce/index/index'
                })
            },
            initSize: function () {
                let query = [];
                for (let i = 0; i < this.list.length; i++) {
                    query.push(
                        new Promise(resolve => {
                            let query = uni.createSelectorQuery().in(this);
                            query.select(`#bd-${i}-text`).boundingClientRect().exec(ret => {
                                if (ret[0]) {
                                    this.textWidth += (ret[0].width + uni.upx2px(10));
                                }
                                resolve();
                            });
                        })
                    )
                }
                Promise.all(query).then(() => {
                    this.resultWidth = this.textWidth;
                });
            }
        },
        watch: {
            'full_reduce.rule' : {
                immediate: true,
                handler(newVal) {
                    this.list = newVal;
                    this.textWidth = 0;
                    setTimeout(() => {
                        this.initSize();
                    }, 500);
                },
                deep: true
            },
            resultWidth: {
                handler(newVal) {
                    if (newVal > uni.upx2px(552)) {
                        this.list = this.list.slice(0, this.list.length - 1);
                        this.textWidth = 0;
                        this.$nextTick(() => {
                            this.initSize();
                        });
                    } else {
                        this.opacity = true;
                    }
                }
            }
        },
        mounted() {
            setTimeout(() => {
                this.list = this.full_reduce.rule;
                this.textWidth = 0;
                setTimeout(() => {
                    this.initSize();
                }, 500);
            }, 500);
        }

    }
</script>

<style lang="scss" scoped>
    @import '../../../static/css/gift.scss';
    .reduce {
        width: 750upx;
        padding: 20upx 24upx;
    }
    .arrow {
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 12upx;
        height: 22upx;
        background-image: url("../../../static/image/icon/arrow-right.png");
    }
    .text {
        padding: 5rpx 10rpx;
        border-radius: 15rpx;
        font-size: 21upx;
        color: #ffffff;
        margin-right: 10rpx;
    }
    .bd-name {
        font-size: 28rpx;
        width: 150rpx;
    }
    .bd-item {
        width: 552upx;
    }
    .a.a-m-back-full {
        background: #ffecec;
    }
    .b.b-m-back-full {
        background: #fff9e5;
    }
    .c.c-m-back-full {
        background: #ffeef2;
    }
    .d.d-m-back-full {
        background: #fcf8ef;
    }
    .e.e-m-back-full {
        background: #f1f2fd;
    }
    .f.f-m-back-full {
        background: #ffecec;
    }
    .g.g-m-back-full{
        background: #eff8f1;
    }
    .h.h-m-back-full {
        background: #edf4fc;
    }
    .i.i-m-back-full {
        background: #eaeaea;
    }
    .j.j-m-back-full {
        background: #ffecec;
    }


    .streamer-gold-gift-full {
        background: #fcf6ec;
    }
    .romantic-powder-gift-full {
        background: #ffeef2;
    }
    .taste-red-gift-full {
        background: #ffecec;
    }
    .elegant-purple-gift-full {
        background: #f1f2fd;
    }
    .fresh-green-gift-full {
        background: #eff8f1;
    }
    .business-blue-gift-full {
        background: #edf4fc;
    }

    .bd-opacity-0 {
        opacity: 0;
    }
    .bd-opacity-1 {
        opacity: 1;
    }
</style>