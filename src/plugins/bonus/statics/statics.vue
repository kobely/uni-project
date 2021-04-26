<template>
    <app-layout>
        <view class='main-between total'>
            <view class='box-grow-1'>
                <view class='data-num'>{{all_data.day_data}}</view>
                <view>昨日{{setting.form && setting.form.statics_text ? setting.form.statics_text :'分红'}}</view>
            </view>
            <view class='box-grow-1'>
                <view class='data-num'>{{all_data.day_7_data}}</view>
                <view>7日{{setting.form && setting.form.statics_text ? setting.form.statics_text :'分红'}}总计</view>
            </view>
            <view class='box-grow-1'>
                <view class='data-num'>{{all_data.month_12_data}}</view>
                <view>月{{setting.form && setting.form.statics_text ? setting.form.statics_text :'分红'}}总计</view>
            </view>
        </view>
        <view class='canvas'>
            <view class="choose main-center">
                <view class="choose-list main-center">
                    <view :class="[date == 0 ? 'active' : '','cross-center','main-center','choose-item','left-choose-item']">
                        <view @click="tablist(0)">昨日{{setting.form && setting.form.statics_text ? setting.form.statics_text :'分红'}}</view>
                    </view>
                    <view :class="[date == 1 ? 'active' : '','cross-center','main-center','choose-item']">
                        <view @click="tablist(1)">7日{{setting.form && setting.form.statics_text ? setting.form.statics_text :'分红'}}</view>
                    </view>
                    <view :class="[date == 2 ? 'active' : '','cross-center','main-center','choose-item','right-choose-item']">
                        <view @click="tablist(2)">月{{setting.form && setting.form.statics_text ? setting.form.statics_text :'分红'}}</view>
                    </view>
                </view>
            </view>
            <view class="box">
                <!--#ifdef MP-ALIPAY -->
                <canvas @touchstart="touchIt($event,'canvasColumn')" canvas-id="canvasColumn" id="canvasColumn" class="charts" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth*(pixelRatio-1)/2+'px','margin-top':-cHeight*(pixelRatio-1)/2+'px'}"></canvas>
                <!--#endif-->
                <!--#ifndef MP-ALIPAY -->
                <canvas @touchstart="touchIt($event)" canvas-id="canvasColumn" id="canvasColumn" class="charts"></canvas>
                <!--#endif-->
            </view>
        </view>
    </app-layout>
</template>

<script>
    import uCharts from '../../../components/u-charts/u-charts.min.js';

    var _self;
    var canvaColumn=null;

    export default {
        data() {
            return {
                list: [],
                setting: {},
                cWidth:'',
                cHeight:'',
                pixelRatio:1,
                date: 0,
                show: true,
                all_data: []
            }
        },
        methods: {
            tablist(e) {
                let that = this;
                this.date = e;
                this.show = true;
                let Column = {categories:[],series:[{name: '分红金额',data: []}]};
                let date;
                let padding;
                if(e == 0) {
                    that.list.day_list.forEach(function(row,index){
                        date = that.list.day_list[index].created_at;
                        Column.series[0].data.push(row.bonus_price);
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
                    })
                    Column.categories.push('24:00')
                    _self.showColumn("canvasColumn",Column,'line');
                }else if(e == 1) {
                    that.list.day_7_list.forEach(function(row,index){
                        date = that.list.day_7_list[index].created_at.slice(5);
                        Column.series[0].data.push(row.bonus_price);
                        Column.categories.push(date);
                    })
                    padding = [15,15,4,-30]
                    _self.showColumn("canvasColumn",Column,'column',padding);
                }else if(e == 2) {
                    that.list.month_12_list.forEach(function(row,index){
                        date = that.list.month_12_list[index].created_at.slice(5) + '月';
                        Column.series[0].data.push(row.bonus_price);
                        Column.categories.push(date);
                    })
                    padding = [15,15,4,-30]
                    _self.showColumn("canvasColumn",Column,'column',padding);
                }
                this.$forceUpdate();
            },

            touchIt(e) {
                canvaColumn.showToolTip(e, {
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
            getSetting() {
                let that = this;
                that.$request({
                    url: that.$api.bonus.setting,
                }).then(response=>{
                    if(response.code === 0) {
                        that.setting = response.data.list;
                        if (that.setting.form && that.setting.form.orders) {
                            uni.setNavigationBarTitle({
                                title: that.setting.form.statistic_bonus,
                            })
                        } else {
                            uni.setNavigationBarTitle({
                                title: '分红统计',
                            })
                        }
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(() => {
                    that.$hideLoading();
                });
            },
            getList() {
                let that = this;
                uni.showLoading({
                    mask: true,
                    title: '加载中...'
                });
                that.$request({
                    url: that.$api.bonus.data,
                }).then(response=>{
                    uni.hideLoading();
                    if(response.code == 0) {
                        that.list = response.data.list;
                        that.all_data = response.data.all_data;
                        let Column = {categories:[],series:[{name: '分红金额',data: []}]};
                        let date;
                        response.data.list.day_list.forEach(function(row,index){
                            date = response.data.list.day_list[index].created_at;
                            Column.series[0].data.push(row.bonus_price);
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
                        })
                        Column.categories.push('24:00')
                        _self.showColumn("canvasColumn",Column,'line');
                    }else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                }).catch(response => {
                    uni.hideLoading();
                });
            },
            showColumn(canvasId,chartData,type,padding){
                canvaColumn=new uCharts({
                    $this:_self,
                    canvasId: canvasId,
                    type: type ? type : 'column',
                    legend:{
                        show: false
                    },
                    fontSize:9,
                    background:'#FFFFFF',
                    colors: ["#ff4544"],
                    pixelRatio:_self.pixelRatio,
                    padding: padding ? padding : [15,15,4,0],
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
                        tooltip:{
                            bgColor:'#000000',
                            bgOpacity:0.7,
                        }
                    }
                });
            },
            changeData(){
                canvaColumn.updateData({
                    series: _self.serverData.ColumnB.series,
                    categories: _self.serverData.ColumnB.categories
                });
            }
        },

        onLoad() { this.$commonLoad.onload();
            _self = this;
            //#ifdef MP-ALIPAY
            uni.getSystemInfo({
                success: function (res) {
                    if(res.pixelRatio>1){
                        //正常这里给2就行，如果pixelRatio=3性能会降低一点
                        //_self.pixelRatio =res.pixelRatio;
                        _self.pixelRatio = 2;
                    }
                }
            });
            //#endif
            this.cWidth=uni.upx2px(650);
            this.cHeight=uni.upx2px(440);
            this.getList();
            this.getSetting();
        }
    }
</script>

<style scoped lang="scss">
    .total {
        height: #{150rpx};
        background-color: #fff;
        text-align: center;
        font-size: #{24rpx};
        color: #999;
    }

    .data-num {
        font-size: #{36rpx};
        font-family: DIN;
        color: #353535;
        margin-top: #{36rpx};
        margin-bottom: #{6rpx};
    }

    .canvas {
        width: #{702rpx};
        margin: #{24rpx};
        background-color: #fff;
        border-radius: #{16rpx};
        padding: #{40rpx} #{24rpx} #{24rpx};
    }

    .choose {
        width: 100%;
        height: #{56rpx};
        line-height: #{56rpx};
        font-size: #{24rpx};
        color: #666;
        margin: 0 auto #{40rpx};
    }

    .choose-list {
        border-radius: #{28rpx};
    }

    .choose .choose-item {
        padding: 0 #{24rpx};
        background-color: #fff;
        border-bottom: #{1rpx} solid #ff4544;
        border-top: #{1rpx} solid #ff4544;
    }

    .choose .choose-item.active {
        background-color: #ff4544;
        color: #fff;
    }

    .left-choose-item {
        border-top-left-radius: #{28rpx};
        border-left: #{1rpx} solid #ff4544;
        border-bottom-left-radius: #{28rpx};
    }

    .right-choose-item {
        border-top-right-radius: #{28rpx};
        border-right: #{1rpx} solid #ff4544;
        border-bottom-right-radius: #{28rpx};
    }

    .box {
        width: 100%;
        height: #{440rpx};
    }
    .charts{
        width: #{650rpx};
        height:#{440rpx};
        background-color: #FFFFFF;
    }

</style>