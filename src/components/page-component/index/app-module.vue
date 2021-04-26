<template>
    <view class="app-module">
        <scroll-view :scroll-left="scrollLeft"
                     v-if="list && list.length > 1"
                     scroll-x
                     :scroll-with-animation="true"
                     :style="{backgroundColor: tabBackground}">
            <view class="dir-left-nowrap" style="height: 100%">
                <view v-for="(item, index) in list"
                      :key="index"
                      @click="changeTab(index)"
                      class="scroll-item main-center cross-center"
                      :style="[scrollStyle]">
                    <view :style="[tabNameFill(index)]">
                        <view class="tab-name" :style="[tabNameStyle(index)]">{{item.tabName}}</view>
                        <view v-if="tabType === 'line'" class="line"
                              :style="{background: current === index ? tabColor : 'none'}"
                        ></view>
                    </view>
                </view>
            </view>
        </scroll-view>
        <view v-if="false && list && list.length > 4" :style="{background: tabBackground}" class="scroll-right"></view>
        <app-diy-page
            :page-hide="pageHide"
            :home-pages="newHomePages(current)"
            :is_storage="is_storage"
            :theme="theme"
            :page_id="page_id"
            :is_module="false"
            :is_required="is_required"
            :coupon_req="coupon_req"
            d-type="module"
            :d-index="dIndex"
            @buyProduct="buyProduct"
        ></app-diy-page>
    </view>
</template>


<script>
    // #ifdef MP
    import appDiyPage from "@/components/page-component/index/app-diy-page.vue";
    // #endif
    export default {
        name: "app-module",
        // #ifdef MP
        components: {
            appDiyPage
        },
        // #endif
        data() {
            return {
                newPage: [],
                time: -1,
                current: 0,
                scrollLeft: 0,
            }
        },
        props: {
            homePages: {
                type: Object,
                default() {
                    return {};
                }
            },
            scrollTop: {
                type: Number,
                default() {
                    return 0;
                }
            },
            is_storage: Boolean,
            pageHide: Boolean,
            theme: Object,
            coupon_req: Boolean,
            is_required: Boolean,
            page_id: Number,
            /*********************************************/
            tabType: String,
            tabColor: String,
            textColor: String,
            tabBackground: String,
            list: Array,
            dIndex: Array,
        },

        computed: {
            scrollStyle() {
                let length = this.list.length;
                if (length < 5) {
                    return {
                        width: `${100 / length}%`
                    }
                } else {
                    length = 5;
                    return {
                        width: `${(100 / (length * 2 - 1)) * 2}%`,
                    }
                }
            },
            tabNameFill() {
                return (index) => {
                    if (this.tabType === 'filling') {
                        if (this.current === index) {
                            return {
                                backgroundColor: this.tabColor,
                                borderRadius: '32rpx',
                                padding: '0 24rpx',
                            }
                        }
                    }
                };
            },
            tabNameStyle() {
                return (index) => {
                    let color = 'auto';
                    if (this.tabType === 'line') {
                        if (this.current === index) {
                            color = this.tabColor;
                        } else {
                            color = this.textColor;
                        }
                    } else if (this.tabType === 'filling') {
                        if (this.current === index) {
                            color = this.tabBackground;
                        } else {
                            color = this.textColor;
                        }
                    }

                    return {color};
                }
            },
            newHomePages() {
                return (index) => {
                    let { id, title, navs } = this.homePages;
                    return {
                        'id': id,
                        'is_home_page': 0,
                        'show_navs': 0,
                        'title': title,
                        'navs': [{
                            'id': '0',
                            'name': navs[0]['name'],
                            'page_id': this.page_id,
                            'template': this.list[index],
                            'template_id': navs[0]['template_id'],
                        }],
                    };
                }
            },
        },
        methods: {
            changeTab(index) {
                this.current = index;
                if (this.list.length > 4) {
                    let num = parseFloat(this.scrollStyle['width']);
                    this.scrollLeft = uni.getSystemInfoSync().windowWidth * (index * num - 50 + num / 2) / 100;
                }
            },

            buyProduct(data) {
                this.$emit('buyProduct', data);
            }
        },
    }
</script>

<style scoped lang="scss">
    .app-module {
        position: relative;

        scroll-view {
            white-space: nowrap;
            height: #{90rpx};
            box-shadow: inset #{-12rpx} 0 #{10rpx} #{-10rpx} #555555;

            .scroll-item {
                width: 25%;
                flex: 0 0 auto;
                height: 100%;

                .scroll-z {
                    height: #{56rpx};
                    padding: 0 #{24rpx};
                    border-radius: #{16rpx};
                }

                .tab-name {
                    font-size: #{28rpx};
                    line-height: 1;
                    color: #666666;
                    padding: #{12rpx} 0;
                }

                .line {
                    height: #{4rpx};
                    border-radius: #{16rpx};
                    width: 100%;
                }
            }
        }

        .scroll-right {
            width: #{2rpx};
            position: absolute;
            height: #{90rpx};
            top: 0;
            right: 0;
            z-index: 22;
            background: #FFFFFF;
            box-shadow: #{-4rpx} #{0rpx} #{12rpx} #555555;
        }
    }

</style>