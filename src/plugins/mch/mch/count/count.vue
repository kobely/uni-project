<template>
    <app-layout>
        <view style="background:#FFFFFF" v-if="year_list">
            <scroll-view scroll-x :scroll-into-view="`mch_`+ scrollId" scroll-with-animation>
                <view class="dir-left-nowrap month-list">
                    <view id="mch_0-2" class="box-grow-0 month-item"></view>
                    <view id="mch_0-1" class="box-grow-0 month-item"></view>
                    <block v-for="(item,index) in year_list" :key="index">
                        <app-form-id v-for="(year_item, year_index) in item.month_list" :key="year_index"
                                     @click="switchTaps(index,year_index)">
                            <view class="box-grow-0 dir-top-nowrap main-center month-item"
                                  :class="year_item.active?`active`:``" :id="`mch_`+ index + year_index">
                                <view class="en">{{year_item.name_en}}</view>
                                <view class="cn">{{year_item.name_cn}}</view>
                            </view>
                        </app-form-id>
                    </block>
                    <view class="box-grow-0 month-item"></view>
                    <view class="box-grow-0 month-item"></view>
                </view>
            </scroll-view>
            <view class="dir-left-nowrap cross-center">
                <view class="year-line"></view>
                <view class="year-label">{{year_str}}</view>
                <view class="year-line"></view>
            </view>
            <view class="main-between count-num">
                <view class="cross-center dir-top-nowrap">
                    <view class="name">日均成交额</view>
                    <view class="num">{{monthly_order_pay_price_average}}</view>
                </view>
                <view class="cross-center dir-top-nowrap">
                    <view class="name">当月成交额</view>
                    <view class="num">{{monthly_order_pay_price_count}}</view>
                </view>
                <view class="cross-center dir-top-nowrap">
                    <view class="name">对比上月</view>
                    <view class="num">{{contrast_prev_monthly}}</view>
                </view>
            </view>

            <view class="main-center cross-center canvas-box">
                <!--#ifdef MP-ALIPAY -->
                <canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" :width="750" :height="500"
                        :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-top':-cHeight*(pixelRatio-1)/2+'px'}"></canvas>
                <!--#endif-->

                <!--#ifndef MP-ALIPAY -->
                <canvas canvas-id="canvasColumn" id="canvasColumn" class="charts"></canvas>
                <!--#endif-->
            </view>

        </view>
    </app-layout>
</template>

<script>
    import uCharts from '../../../../components/u-charts/u-charts.min.js';

    var _self;
    var canvaColumn = null;
    export default {
        name: "count",
        components: {},
        data() {
            return {
                contrast_prev_monthly: '',
                monthly_order_pay_price_average: '',
                monthly_order_pay_price_count: '',

                mch_id: 0,
                options: [],
                year_str: '',
                month_str: '',

                year_list: null,
                scrollId: null,

                year_index: 0,
                index: 0,

                cWidth: '',
                cHeight: '',
                pixelRatio: 1,
                serverData: ''
            }
        },

        onLoad(options) { this.$commonLoad.onload(options);
            this.mch_id = options.mch_id;
            this.getYear();

            _self = this;
            //#ifdef MP-ALIPAY
            uni.getSystemInfo({
                success: function (res) {
                    if (res.pixelRatio > 1) {
                        //正常这里给2就行，如果pixelRatio=3性能会降低一点
                        //_self.pixelRatio =res.pixelRatio;
                        _self.pixelRatio = 2;
                    }
                }
            });
            //#endif
            this.cWidth = uni.upx2px(750);
            this.cHeight = uni.upx2px(500);
        },

        methods: {
            showColumn(canvasId, chartData) {
                canvaColumn = new uCharts({
                    $this: _self,
                    canvasId: canvasId,
                    type: 'line',
                    background: '#FFFFFF',
                    animation: true,
                    dataPointShape: false,
                    pixelRatio: _self.pixelRatio,
                    categories: chartData.categories,
                    series: chartData.series,
                    width: _self.cWidth * _self.pixelRatio,
                    height: _self.cHeight * _self.pixelRatio,
                    legend: true,
                    xAxis: {
                        disabled: true,
                        axisLine: false,
                        disableGrid: true,
                    },
                    yAxis: {
                        format: (val => {
                            return val;
                        })
                    },
                    dataLabel: false,

                    extra: {
                        line: {
                            type: 'curve',
                            width: '4rpx'
                        }
                    }
                });
            },
            changeData() {
                canvaColumn.updateData({
                    series: _self.serverData.ColumnB.series,
                    categories: _self.serverData.ColumnB.categories
                });
            },

            getYear() {
                const self = this;
                self.$showLoading();

                self.$request({
                    url: self.$api.mch.year_list,
                }).then(info => {
                    self.$hideLoading();
                    if (info.code === 0) {
                        //初始化
                        let year_list = info.data.year_list;
                        let scrollId, year_str, month_str;
                        year_list.map((v1, k1) => {
                            v1.month_list.map((v2, k2) => {
                                if (v2.active) {
                                    scrollId = k1.toString() + k2.toString();
                                    year_str = year_list[k1].year;
                                    month_str = year_list[k1].month_list[k2].month;
                                }
                            })
                        });
                        [
                            self.year_list,
                            self.scrollId,
                            self.year_str,
                            self.month_str
                        ] = [
                            year_list,
                            scrollId,
                            year_str,
                            month_str
                        ]
                        this.loadData();
                    }
                });
            },
            loadData() {
                const self = this;
                self.$request({
                    url: self.$api.mch.statistic,
                    data: {
                        mch_id: self.mch_id,
                        monthly: self.month_str,
                        year: self.year_str,
                    }
                }).then(info => {
                    if (info.code === 0) {
                        let chartData = {
                            categories: info.data.trend_arr,
                            series: [{
                                name: '日成交额',
                                data: info.data.trend_arr,
                                color: '#fa6855'
                            }]
                        }
                        self.showColumn("canvasColumn", chartData);
                        [
                            self.contrast_prev_monthly,
                            self.monthly_order_pay_price_average,
                            self.monthly_order_pay_price_count,
                        ] = [
                            info.data.contrast_prev_monthly,
                            info.data.monthly_order_pay_price_average,
                            info.data.monthly_order_pay_price_count,
                        ];
                    }
                });
            },
            switchTaps(index, year_index) {
                const self = this;
                let year_list = self.year_list;

                //ACTIVE
                year_list.forEach((v, k) => {
                    v.active = k == index;
                    v.month_list.forEach((v1, k2) => {
                        v1.active = k == index && k2 == year_index;
                    })
                })

                //Animate
                let scrollId = self.scrollId;
                if (year_index >= 2 || index == 0) {
                    scrollId = index.toString() + (year_index - 2).toString();
                } else {
                    scrollId = (index - 1).toString() + (year_index + 10).toString();
                }
                [
                    self.index,
                    self.year_list,
                    self.year_index,
                    self.scrollId,
                    self.year_str,
                    self.month_str
                ] = [
                    index,
                    year_list,
                    year_index,
                    scrollId,
                    year_list[index].year,
                    year_list[index].month_list[year_index].month,
                ]
                self.loadData();
            }
        }
    }
</script>

<style scoped lang="scss">
    .charts {
        width: #{750upx};
        height: #{500upx};
        background-color: #FFFFFF;
    }

    ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
    }

    .month-list .month-item {
        color: #bbb;
        width: #{150rpx};
        text-align: center;
        height: #{120rpx};

        .en {
            font-size: #{24rpx};
        }

        .cn {
            font-size: #{28rpx};
        }
    }

    .month-list .month-item.active {
        color: #e9ad33;
    }

    .year-label {
        font-size: #{20rpx};
        color: #999999;
        padding: #{24rpx} #{40rpx};
    }

    .year-line {
        height: #{1px};
        width: 100%;
        background: #e2e2e2;
    }

    .count-num {
        font-size: #{24rpx};
        margin: 0 #{24rpx};

        .name {
            color: #999999;
            margin-bottom: #{16rpx};
        }

        .num {
            color: #353535;
        }
    }

    .canvas-box {
        margin-top: #{48rpx};
        width: 100%
    }
</style>