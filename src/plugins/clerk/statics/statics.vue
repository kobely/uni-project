<template>
    <app-layout>
        <app-tab-nav :shadow="noBorder" :tabList="tabList" background="#f7f7f7" padding="0" :border="noBorder" :activeItem="activeTab" @click="tabStatus"></app-tab-nav>
        <view class="total-item">
            <view class='total-num' style='color: #417afd'>{{total_order_num}}</view>
            <view class="total-title">核销订单数</view>
            <!--#ifdef MP-ALIPAY -->
            <canvas @touchstart="touchIt($event,'canvasFirst')" canvas-id="canvasFirst" id="canvasFirst" class="charts" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth*(pixelRatio-1)/2+'px','margin-top':-cHeight*(pixelRatio-1)/2+'px'}"></canvas>
            <!--#endif-->
            <!--#ifndef MP-ALIPAY -->
            <canvas @touchstart="touchIt($event,'canvasFirst')" canvas-id="canvasFirst" id="canvasFirst" class="charts"></canvas>
            <!--#endif-->
        </view>
        <view class="total-item">
            <view class='total-num' style='color: #ff9000'>{{total_order_price}}</view>
            <view class="total-title">核销订单金额</view>
            <!--#ifdef MP-ALIPAY -->
            <canvas @touchstart="touchIt($event,'canvasSec')" canvas-id="canvasSec" id="canvasSec" class="charts" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth*(pixelRatio-1)/2+'px','margin-top':-cHeight*(pixelRatio-1)/2+'px'}"></canvas>
            <!--#endif-->
            <!--#ifndef MP-ALIPAY -->
            <canvas @touchstart="touchIt($event,'canvasSec')" canvas-id="canvasSec" id="canvasSec" class="charts"></canvas>
            <!--#endif-->
        </view>
        <view class="total-item">
            <view class='total-num' style='color: #41c6fe'>{{total_card}}</view>
            <view class="total-title">核销卡券次数</view>
            <!--#ifdef MP-ALIPAY -->
            <canvas @touchstart="touchIt($event,'canvasThird')" canvas-id="canvasThird" id="canvasThird" class="charts" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth*(pixelRatio-1)/2+'px','margin-top':-cHeight*(pixelRatio-1)/2+'px'}"></canvas>
            <!--#endif-->
            <!--#ifndef MP-ALIPAY -->
            <canvas @touchstart="touchIt($event,'canvasThird')" canvas-id="canvasThird" id="canvasThird" class="charts"></canvas>
            <!--#endif-->
        </view>
    </app-layout>
</template>

<script>
    import appTabNav from "../../../components/basic-component/app-tab-nav/app-tab-nav.vue";
    import uCharts from '../../../components/u-charts/u-charts.min.js';

    import { mapState } from "vuex";

    var _self;
    var canvasObj = {};
    export default {
        name: "about",
        components: {
            "app-tab-nav": appTabNav,
        },
        data() {
            return {
                noBorder: false,
                tabList: [
                    {id:0, name: '累计'},
                    {id:1, name: '今日'},
                    {id:-1, name: '昨日'},
                    {id:7, name: '7日'},
                    {id:30, name: '30日'},
                ],
                cWidth:'',
                cHeight:'',
                pixelRatio:1,
                card_list: [],
                order_num_list: [],
                order_price_list: [],
                activeTab: 0,
                total_card: 0,
                total_order_num: 0,
                total_order_price: 0,
            };
        },
        computed: {
            ...mapState({
                mall: state => state.mallConfig.mall
            }),
        },
        onLoad() { this.$commonLoad.onload();
            _self = this;
            //#ifdef MP-ALIPAY
            uni.getSystemInfo({
                success: function (res) {
                    if(res.pixelRatio>1){
                        //正常这里给2就行，如果pixelRatio=3性能会降低一点
                        //_self.pixelRatio =res.pixelRatio;
                        _self.pixelRatio =2;
                    }
                }
            });
            //#endif
            this.cWidth=uni.upx2px(702);
            this.cHeight=uni.upx2px(340);
            this.activeTab = 0;
            this.getList();
        },
        methods: {
            showColumn(canvasId, chartData,color,padding) {
                canvasObj[canvasId] = new uCharts({
                    $this: _self,
                    canvasId: canvasId,
                    type: 'area',
                    legend:{
                        show: false
                    },
                    fontSize:9,
                    background:'#FFFFFF',
                    colors: color,
                    padding: padding?padding:[15,15,4,0],
                    pixelRatio: _self.pixelRatio,
                    animation: false,
                    categories: chartData.categories,
                    series: chartData.series,
                    xAxis: {
                        disableGrid:true,
                    },
                    yAxis: {
                        gridType: 'dash',
                        data: {
                            disabled: true
                        }
                    },
                    dataLabel: false,
                    dataPointShape: false,
                    width: _self.cWidth*_self.pixelRatio,
                    height: _self.cHeight*_self.pixelRatio,
                    extra: {
                        area: {
                            type: 'curve',
                            addLine: true
                        },
                        tooltip:{
                            bgColor:'#000000',
                            bgOpacity:0.7,
                        }
                    }
                });

            },
            tabStatus(e) {
                this.activeTab = e.currentTarget.dataset.id;
                this.getList();
            },
            touchIt(e,id) {
                canvasObj[id].showToolTip(e, {
                    format: function (item, category) {
                        item.color = 'rgba(0,0,0,0)';
                        if(typeof item.data === 'object'){
                            return category + ' ' + item.name + ':' + item.data.value 
                        }else{
                            return category + ' ' + item.name + ':' + item.data 
                        }
                    }
                });
            },
            getList() {
                let that = this;
                that.$request({
                    url: that.$api.clerk.statistics,
                    data: {
                        key: that.activeTab
                    }
                }).then(response=>{
                    that.$hideLoading();
                    if(response.code == 0) {
                        that.card_list = response.data.card_list;
                        that.order_num_list = response.data.order_num_list;
                        that.order_price_list = response.data.order_price_list;
                        that.total_card = 0;
                        that.total_order_num = 0;
                        that.total_order_price = 0;
                        that.card_list.forEach(function(row){
                            that.total_card = (+that.total_card + +row.num).toFixed(2);
                        })
                        that.order_num_list.forEach(function (row) {
                            that.total_order_num = (+that.total_order_num + +row.num).toFixed(2);
                        })
                        that.order_price_list.forEach(function (row) {
                            that.total_order_price = (+that.total_order_price + +row.num).toFixed(2);
                        })
                        let Column_1 = {categories:[],series:[{name: '核销订单数',data: []}]};
                        let Column_2 = {categories:[],series:[{name: '核销订单金额',data: []}]};
                        let Column_3 = {categories:[],series:[{name: '核销卡券次数',data: []}]};
                        let padding = [15,15,4,-20];
                        if(that.activeTab == 1 || that.activeTab == -1 || that.activeTab == 7) {
                            padding = [15,15,4,0];
                        }
                        // 图表一
                        Column_1 = that.create(response.data.order_num_list,Column_1);
                        _self.showColumn("canvasFirst",Column_1,["#417afd"],padding);
                        // 图表二
                        Column_2 = that.create(response.data.order_price_list,Column_2);
                        _self.showColumn("canvasSec",Column_2,["#ff9000"]);
                        // 图表三
                        Column_3 = that.create(response.data.card_list,Column_3);
                        _self.showColumn("canvasThird",Column_3,["#41c6fe"]);
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    that.$hideLoading();
                });
            },
            create(list,Column) {
                let date;
                let that = this;
                list.forEach(function(row,index){
                    date = list[index].time;
                    if(that.activeTab == 1 || that.activeTab == -1) {
                        if(index % 6 == 0) {
                            if(date < 10) {
                                date = '0' + date + ':00'
                            }else {
                                date = date + ':00'
                            }
                            Column.categories.push(date);
                        }else {
                            Column.categories.push('')
                        }
                    }else if(that.activeTab == 30) {
                        if(index % 5 == 0 || index == list.length - 1) {
                            Column.categories.push(date);
                        }else {
                            Column.categories.push('')
                        }
                    }else {
                        Column.categories.push(date);
                    }
                    Column.series[0].data.push(row.num);
                })
                if(that.activeTab == 1 || that.activeTab == -1) {
                    Column.categories.push('24:00')
                }
                return Column
            }
        }
    }
</script>

<style scoped lang="scss">


    .total-item {
        width: #{702rpx};
        margin: #{24rpx} #{24rpx} 0;
        border-radius: #{16rpx};
        background-color: #fff;
        padding-top: #{54rpx};
        text-align: center;
    }

    .total-title {
        color: #999999;
        font-size: #{24rpx};
    }

    .total-num {
        font-size: #{46rpx};
    }

    .charts{
        width: 100%;
        height:#{340rpx};
        margin: #{85rpx} auto 0;
    }

</style>